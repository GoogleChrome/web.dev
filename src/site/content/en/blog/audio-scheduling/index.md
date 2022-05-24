---
layout: post
title: A tale of two clocks
subhead: Scheduling web audio with precision
authors:
  - chriswilson
date: 2013-01-09
tags:
  - blog
---

## Introduction
One of the biggest challenges in building great audio and music software using the web platform is managing time.  Not as in “time to write code”, but as in clock time - one of the least well-understood topics about Web Audio is how to properly work with the audio clock. The Web Audio AudioContext object has a currentTime property that exposes this audio clock.  

Particularly for musical applications of web audio - not just writing sequencers and synthesizers, but any rhythmic use of audio events such as [drum machines](http://chromium.googlecode.com/svn/trunk/samples/audio/shiny-drum-machine.html), [games](http://cappel-nord.de/webaudio/acid-defender/), and [other](http://labs.dinahmoe.com/plink/) [applications](http://chromium.googlecode.com/svn/trunk/samples/audio/granular.html) - it’s very important to have consistent, precise timing of audio events; not just starting and stopping sounds, but also scheduling changes to the sound (like changing frequency or volume).  Sometimes it’s desirable to have slightly time-randomized events - for example, in the machine-gun demo in [Developing Game Audio with the Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/games/) - but usually, we want to have consistent and accurate timing for musical notes.

We’ve already shown you how to schedule notes using the Web Audio noteOn and noteOff (now renamed start and stop) methods’ time parameter in [Getting Started with Web Audio](http://www.html5rocks.com/tutorials/webaudio/intro/) and also in [Developing Game Audio with the Web Audio API](http://www.html5rocks.com/tutorials/webaudio/games/); however, we haven’t deeply explored more complex scenarios, such as playing long musical sequences or rhythms.  To dive into that, first we need a little background on clocks.

## The Best of Times - the Web Audio Clock

The Web Audio API exposes access to the audio subsystem’s hardware clock.  This clock is exposed on the AudioContext object through its .currentTime property, as a floating-point number of seconds since the AudioContext was created.  This enables this clock (hereafter called the “audio clock”) to be very high-precision;  it’s designed to be able to specify alignment at an individual sound sample level, even with a high sample rate.  Since there are around 15 decimal digits of precision in a “double”, even if the audio clock has been running for days, it should still have plenty of bits left over to point to a specific sample even at a high sample rate.

The audio clock is used for scheduling parameters and audio events throughout the Web Audio API - for [start()](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#dfn-start) and [stop()](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#dfn-stop), of course, but also for [set*ValueAtTime() methods](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#methodsandparams-AudioParam) on AudioParams.  This lets us set up very precisely-timed audio events in advance.  In fact, it’s tempting to just set up everything in Web Audio as start/stop times - however, in practice there’s a problem with that. 

For example, look at this reduced code snippet from our Web Audio Intro, which sets up two bars of an eighth note hi-hat pattern:

```js
for (var bar = 0; bar < 2; bar++) {
  var time = startTime + bar * 8 * eighthNoteTime;

  // Play the hi-hat every eighth note.
  for (var i = 0; i < 8; ++i) {
    playSound(hihat, time + i * eighthNoteTime);
  }
```

This code will work great.  However, if you want to change the tempo in the middle of those two bars - or stop playing before the two bars are up - you’re out of luck. (I’ve seen developers do things like insert a gain node between their pre-scheduled AudioBufferSourceNodes and the output, just so they can mute their own sounds!)

In short, because you will need the flexibility to change tempo or parameters like frequency or gain (or stop scheduling altogether), you don’t want to push too many audio events into the queue - or, more accurately, you don’t want to look ahead too far in time, because you may want to change that scheduling entirely.

## The Worst of Times - the JavaScript Clock

We also have our much-beloved and much-maligned JavaScript clock, represented by Date.now() and setTimeout().  The good side of the JavaScript clock is that it has a couple of very useful call-me-back-later window.setTimeout() and window.setInterval() methods, which let us have the system call our code back at specific times.

The bad side of the JavaScript clock is that it is not very precise.  For starters, Date.now() returns a value in milliseconds - an integer number of milliseconds - so the best precision you could hope for is one millisecond.  This isn’t incredibly bad in some musical contexts - if your note started a millisecond early or late, you might not even notice - but even at a relatively low audio hardware rate of 44.1kHz, it’s about 44.1 times too slow to use as an audio scheduling clock.  Remember that dropping any samples at all can cause audio glitching - so if we’re chaining samples together, we may need them to be precisely sequential.

The up-and-coming [High Resolution Time specification](http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/HighResolutionTime/Overview.html) actually does give us a much better precision current time through window.performance.now(); it’s even implemented (albeit prefixed) in many current browsers.  That can help in some situations, although it’s not really relevant to the worst part of the JavaScript timing APIs.

The worst part of the JavaScript timing APIs are that although Date.now()’s millisecond precision doesn’t sound too bad to live with, the actual callback of timer events in JavaScript (through window.setTimeout() or window.setInterval) can easily be skewed by tens of milliseconds or more by layout, rendering, garbage collection, and XMLHTTPRequest and other callbacks - in short, by any number of things happening on the main execution thread.  Remember how I mentioned “audio events” that we could schedule using the Web Audio API?  Well, those are all getting processed on a separate thread - so even if the main thread is temporarily stalled doing a complex layout or other long task, the audio will still happen at exactly the times they were told to happen - in fact, even if you’re stopped at a breakpoint in the debugger, the audio thread will continue to play scheduled events!

## Using JavaScript setTimeout() in Audio Apps

Since the main thread can easily get stalled for multiple milliseconds at a time, it is a bad idea to use JavaScript’s setTimeout to directly start playing audio events, because at best your notes will fire within a millisecond or so of when they really should, and at worst they will be delayed for even longer.  Worst of all, for what should be rhythmic sequences, they won’t fire at precise intervals as the timing will be sensitive to other things happening on the main JavaScript thread.

To demonstrate this, I wrote a sample “bad” metronome application  - that is, one that uses setTimeout directly to schedule notes - and also does a lot of layout.  Open this application, click “play”, and then resize the window quickly while it’s playing; you’ll notice that the timing is noticeably jittery (you can hear the rhythm doesn't stay consistent).  “But this is contrived!” you say?  Well, of course - but that doesn’t mean it doesn’t happen in the real world too.  Even relatively static user interface will have timing issues in setTimeout due to relayouts - for example, I noticed that resizing the window quickly will cause the timing on the otherwise excellent [WebkitSynth](http://jeremywentworth.com/webkitSynth/) to stutter noticeably.  Now picture what will happen when you’re trying to smooth-scroll a full musical score along with your audio, and you can easily imagine how this would affect complex music apps in the real world.

One of the most frequently-asked questions I hear is “Why can’t I get callbacks from audio events?”  Although there may be uses for these types of callbacks, they wouldn’t solve the particular problem at hand - it’s important to understand that those events would be fired in the main JavaScript thread, so they would be subject to all the same potential delays as setTimeout; that is, they could be delayed for some unknown and variable number of milliseconds from the precise time they were scheduled before they were actually processed.  

So what can we do?  Well, the best way to handle timing is to set up a collaboration between JavaScript timers (setTimeout(), setInterval() or requestAnimationFrame() - more on that later) and the audio hardware scheduling.

## Obtaining Rock-Solid Timing By Looking Ahead

Let’s go back to that metronome demo - in fact, I wrote the first version of this simple metronome demo correctly to demonstrate this collaborative scheduling technique.  ([The code is also available on Github](http://github.com/cwilso/metronome/)  This demo plays beep sounds (generated by an Oscillator) with high precision on every sixteenth, eighth, or quarter note, altering the pitch depending on the beat.  It also lets you change the tempo and note interval while it’s playing, or stop the playback at any time - which is a key feature for any real-world rhythmic sequencer.  It would be pretty easy to add code to change the sounds this metronome uses on the fly as well.

The way that it manages to allow temp control while maintaining rock-solid timing is a collaboration: a setTimeout timer that fires once every so often, and sets up Web Audio scheduling in the future for individual notes.  The setTimeout timer basically just checks to see if any notes are going to need to be scheduled “soon” based on the current tempo, and then schedules them, like so:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pu23mak40dM0zYG3BkF9.png", alt="setTimeout() and audio event interactio.", width="800", height="545" %}
  <figcaption>
  setTimeout() and audio event interaction.
  </figcaption>
</figure>

In practice, setTimeout() calls may get delayed, so the timing of the scheduling calls may jitter (and skew, depending on how you use setTimeout) over time - although the events in this example fire approximately 50ms apart, they’re frequently slightly more than that (and sometimes much more).  However, during each call, we schedule Web Audio events not only for any notes that need to be played now (e.g. the very first note), but also any notes that need to be played between now and the next interval.

In fact, we don’t want to just look ahead by precisely the interval between setTimeout() calls - we also need some scheduling overlap between this timer call and the next, in order to accommodate the worst case main thread behavior - that is, the worst case of garbage collection, layout, rendering or other code happening on the main thread delaying our next timer call.  We also need to account for the audio block-scheduling time - that is, how much audio the operating system keeps in its processing buffer - which varies across operating systems and hardware, from low single digits of milliseconds to around 50ms.  Each setTimeout() call shown above has a blue interval that shows the entire range of times during which it will attempt to schedule events; for example, the fourth web audio event scheduled in the diagram above might have been played “late” if we’d waited to play it until the next setTimeout call happened, if that setTimeout call was just a few milliseconds later.  In real life, the jitter in these times can be even more extreme than that, and this overlap becomes even more important as your app becomes more complex.

The overall lookahead latency affects how tight the tempo control (and other real-time controls) can be; the interval between scheduling calls is a tradeoff between the minimum latency and how often your code impacts the processor.  How much the lookahead overlaps with the next interval’s start time is determines how resilient your app will be across different machines, and as it becomes more complex (and layout and garbage collection may take longer).  In general, to be resilient to slower machines and operating systems, it’s best to have a large overall lookahead and a reasonably short interval.  You can adjust to have shorter overlaps and longer intervals, in order to process fewer callbacks, but at some point, you might start hearing that a large latency causes tempo changes, etc., to not take effect immediately; conversely, if you lessened the lookahead too much, you might start hearing some jittering (as a scheduling call might have to “make up” events that should have happened in the past).

The following timing diagram shows what the metronome demo code actually does: it has a setTimeout interval of 25ms, but a much more resilient overlap: each call will schedule for the next 100ms.  The downside of this long lookahead is that tempo changes, etc., will take a tenth of a second to take effect; however, we are much more resilient to interruptions:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/PdnVZLRqwpDqMAHRFDGb.png", alt="Scheduling with long overlaps.", width="800", height="486" %}
  <figcaption>
  scheduling with long overlaps
  </figcaption>
</figure>


In fact, you can tell in this example we had a setTimeout interruption in the middle - we should have had a setTimeout callback at approximately 270ms, but it was delayed for some reason until approximately 320ms - 50ms later than it should have been!  However, the large lookahead latency kept the timing going with no problem, and we didn’t miss a beat, even though we increased the tempo just before that to playing sixteenth notes at 240bpm (beyond even hardcore drum & bass tempos!)

It’s also possible that each scheduler call might end up scheduling multiple notes - let’s take a look at what happens if we use a longer scheduling interval (250ms lookahead, spaced 200ms apart), and a tempo increase in the middle:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/nWBTmc8SLQadveHqIt8D.png", alt="setTimeout() with long lookahead and long intervals.", width="800", height="247" %}
  <figcaption>
  setTimeout() with long lookahead and long intervals
  </figcaption>
</figure>

This case demonstrates that each setTimeout() call may end up scheduling multiple audio events - in fact, this metronome is a simple one-note-at-a-time application, but you can easily see how this approach works for a drum machine (where there are frequently multiple simultaneous notes) or a sequencer (that may frequently have non-regular intervals between notes).

In practice, you’ll want to tune your scheduling interval and the lookahead to see how affected it is by layout, garbage collection and other things going on in the main JavaScript execution thread, and to tune the granularity of control over tempo, etc.  If you have a very complex layout that happens frequently, for example, you’ll probably want to make the lookahead larger.  The main point is that we want the amount of “scheduling ahead” that we’re doing to be large enough to avoid any delays, but not so large as to be create noticeable delay when tweaking the tempo control.  Even the case above has a very small overlap, so it won’t be very resilient on a slow machine with a complex web application.  A good place to start is probably 100ms of “lookahead” time, with intervals set to 25ms.  This may still have problems in complex applications on machines with a lot of audio system latency, in which case you should up the lookahead time; or, if you need tighter control with the loss of some resilience, use a shorter lookahead.

The core code of the scheduling process is in the scheduler() function -

```js
while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
  scheduleNote( current16thNote, nextNoteTime );
  nextNote();
}
```

This function just gets the current audio hardware time, and compares it against the time for the next note in the sequence - most of the time* in this precise scenario this will do nothing (as there are no metronome “notes” waiting to be scheduled, but when it succeeds it will schedule that note using the Web Audio API, and advance to the next note.

{% Aside %}
The scheduler is called every 25ms.  At a standard tempo of 120 quarter-note beats per minute - in our case, playing eight sixteenth notes a second - a note will come up for scheduling every 125ms.  So, roughly 60% of the scheduling calls in this case will find no new notes to be scheduled.  Although you’d have to hit a tempo of 300 quarter-note beats per minute before our simple sixteenth-note pattern would start scheduling multiple notes in a single scheduler() pass, the “while” clause is important once you start supporting more complex rhythms - 32nd or shorter notes, flams, arbitrary sequences, etc. - and of course the first call, with a long lookahead and a fast tempo, will probably buffer up multiple notes.
{% endAside %}

The scheduleNote() function is responsible for actually scheduling the next Web Audio “note” to be played.  In this case, I used oscillators to make beeping sounds at different frequencies; you could just as easily create AudioBufferSource nodes and set their buffers to drum sounds, or any other sounds you wish.

```js
currentNoteStartTime = time;

// create an oscillator
var osc = audioContext.createOscillator();
osc.connect( audioContext.destination );

if (! (beatNumber % 16) )         // beat 0 == low pitch
  osc.frequency.value = 220.0;
else if (beatNumber % 4)          // quarter notes = medium pitch
  osc.frequency.value = 440.0;
else                              // other 16th notes = high pitch
  osc.frequency.value = 880.0;
osc.start( time );
osc.stop( time + noteLength );
```

Once those oscillators are scheduled and connected, this code can forget about them entirely; they will start, then stop, then get garbage-collected automatically.

The nextNote() method is responsible for advancing to the next sixteenth note - that is, setting the nextNoteTime and current16thNote variables to the next note:

```js
function nextNote() {
  // Advance current note and time by a 16th note...
  var secondsPerBeat = 60.0 / tempo;	// picks up the CURRENT tempo value!
  nextNoteTime += 0.25 * secondsPerBeat;	// Add 1/4 of quarter-note beat length to time

  current16thNote++;	// Advance the beat number, wrap to zero
  if (current16thNote == 16) {
    current16thNote = 0;
  }
}
```

This is pretty straightforward - although it’s important to understand that in this scheduling example, I’m not keeping track of “sequence time” - that is, time since the beginning of starting the metronome.  All we have to do is remember when we played the last note, and figure out when the next note is scheduled to play.  That way, we can change the tempo (or stop playing) very easily.

This scheduling technique is used by a number of other audio applications on the web - for example, the  [Web Audio Drum Machine](http://chromium.googlecode.com/svn/trunk/samples/audio/shiny-drum-machine.html), the very fun [Acid Defender game](http://cappel-nord.de/webaudio/acid-defender/), and even more in-depth audio examples like the [Granular Effects demo](http://chromium.googlecode.com/svn/trunk/samples/audio/granular.html).

## Yet Another Timing System

Now, as any good musician knows, what every audio application needs is more cowbell - er, more timers.  It’s worth mentioning that the right way to do visual display is making use of a THIRD timing system!

Why, why, oh dear heavens why do we need another timing system?  Well, this one is synchronized to the visual display - that is, the graphics refresh rate - via the [requestAnimationFrame API](http://www.html5rocks.com/en/tutorials/speed/rendering/).  For drawing boxes in our metronome example, this may not seem like a really a big deal, but as your graphics get more and more complex, it becomes more and more critical to be using requestAnimationFrame() to sync with the visual refresh rate - and it’s actually just as easy to use from the beginning as using setTimeout()!  With very complex synced graphics (e.g. precise display of dense musical notes as they play in a musical notation package), requestAnimationFrame() will give you the smoothest, most precise graphic and audio synchronization.  

We kept track of the beats in the queue in the scheduler:

```js
notesInQueue.push( { note: beatNumber, time: time } );
```

The interaction with our metronome’s current time can be found in the draw() method, which is called (using requestAnimationFrame) whenever the graphics system is ready for an update:

```js
var currentTime = audioContext.currentTime;

while (notesInQueue.length && notesInQueue[0].time < currentTime) {
  currentNote = notesInQueue[0].note;
  notesInQueue.splice(0,1);   // remove note from queue
}
```

Again, you’ll notice that we are checking the audio system’s clock - because that’s really the one we want to synchronize with, since it will actually play the notes - to see if we should be drawing a new box or not.  In fact, we’re not really using the requestAnimationFrame timestamps at all, since we’re using the audio system clock to figure out where we are in time.

Of course, I could have just skipped using a setTimeout() callback altogether, and put my note scheduler into the requestAnimationFrame callback - then we’d be back down to two timers again.  That’s okay to do, too, but it’s important to understand that requestAnimationFrame is just a stand-in for setTimeout() in this case; you’ll still want the scheduling accuracy of Web Audio timing for the actual notes.

## Conclusion

I hope this tutorial has been helpful in explaining clocks, timers and how to build great timing into web audio applications.  These same techniques can be extrapolated easily to build sequence players, drum machines, and more.  Until next time…
