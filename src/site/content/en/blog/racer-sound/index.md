---
layout: post
title: Case Study - The Sounds of Racer
authors:
  - plan8
date: 2013-06-11
tags:
  - blog
  - case-study
---

## Introduction

[Racer](http://www.chrome.com/racer) is a multi-player, multi-device Chrome Experiment. A retro-style slot car game played across screens. On phones or tablets, Android or iOS. Anyone can join. No apps. No downloads. Just the mobile web.

[Plan8](http://www.plan8.se/) together with our friends at [14islands](http://www.14islands.com/) created the dynamic music and sound experience based on an original composition by Giorgio Moroder. Racer features responsive engine sounds, race sound effects, but more importantly a dynamic music mix that distributes itself over several devices as racers join. It’s a multi-speaker installation composed of smartphones.

Connecting multiple devices together was something we had been fooling around with for some time. We had done music experiments where sound would split up on different devices or jump between devices, so we were eager to apply those ideas to Racer.

More specifically we wanted to test if we could build up the music track across the devices as more and more people joined the game—starting with drums and bass, then adding guitar and synths and so on. We did some music demos and dived into coding. The multi speaker effect was really rewarding. We didn’t have all the syncing right at this point, but when we heard the layers of sound spread out over the devices we knew we were onto something good.

## Creating the sounds

Google Creative Lab had outlined a creative direction for the sound and music. We wanted to use analogue synthesizers to create the sound effects rather than recording the real sounds or resorting to sound libraries. We also knew the output speaker would, in most cases, be a tiny phone or tablet speaker so the sounds had to be limited in frequency spectrum to avoid the speakers from distorting. This proved to be quite a challenge. When we received the first music drafts from Giorgio it was a relief because his composition worked perfectly with the sounds we had created.

## Engine sound

The greatest challenge in programming the sounds was to find the best engine sound and sculpt its behavior. The race track resembled an F1 or Nascar track, so the cars had to feel fast and explosive. At the same time the cars were really small so a big engine sound wouldn’t really connect the sound to the visuals. We couldn’t have a beefy roaring engine playing in the mobile speaker anyway so we had to figure out something else.

To get some inspiration we hooked up some of our friend [Jon Ekstrand’s](http://www.google.com/url?q=http%3A%2F%2Fwww.imdb.com%2Fname%2Fnm0252528%2F%3Fref_%3Dfn_al_nm_1&sa=D&sntz=1&usg=AFQjCNE5yX4_xdtd3BL-Li5Fey7mS_wisg) collection of modular synths and started messing around. We liked what we heard. This is what it sounded like with two oscillators, some nice filters and LFO.

Analogue gear has been remodeled with great success using the Web Audio API before so we had high hopes and started to create a simple synth in Web Audio. A generated sound would be the most responsive but would tax the processing power of the device. We needed to be extremely lean to save all the resources we could in order for the visuals to run smoothly. So we switched technique in favor of playing audio samples instead. 

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/bxjDQZVgd6JVBQSyhITC.jpg", alt="Modular synth for engine sound inspiration", width="375", height="500" %}
</figure>

There are several techniques that could be used to make an engine sound out of samples. The most common approach for console games would be to have a layer of multiple sounds (the more the better) of the engine at different RPMs (with load) and then crossfade and crosspitch between them. Then add a layer of multiple sounds of the engine just revving (without load) at the same RPM and crossfade and crosspitch between the too. Crossfading between those layers when shifting gears, if done properly, will sound very realistic but only if you have a large amount of sound files. The crosspitching can’t be too wide or it will sound very synthetic. Since we had to avoid long load times this option wasn’t good for us. We tried with five or six sound files for each layer, but the sound was disappointing. We had to find a way with fewer files.

The most effective solution proved to be this:

- One sound file with acceleration and gear shifting synced with the visual acceleration of the car ending in a programmed loop at the highest pitch / RPM. The Web Audio API is very good at looping precisely so we could do this without glitches or pops.
- One sound file with deceleration / engine revving down.
- And finally one sound file playing the still / idle sound in a loop.

### Looks like this

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/dqM92LCuKBgEyLsI4iSk.png", alt="Engine sound graphic", width="602", height="104" %}
</figure>

For the first touch event / acceleration we would play the first file from the beginning, and if the player released the throttle we would calculate the time from where we were in the sound file at release so that when the throttle came on again it would jump to the right place in the acceleration file after the second (revving down) file was played.

```js
function throttleOn(throttle) {
    //Calculate the start position depending 
    //on the current amount of throttle.
    //By multiplying throttle we get a start position 
    //between 0 and 3 seconds.
    var startPosition = throttle * 3;

    var audio = context.createBufferSource();
    audio.buffer = loadedBuffers["accelerate_and_loop"];

    //Sets the loop positions for the buffer source.
    audio.loopStart = 5;
    audio.loopEnd = 9;

    //Starts the buffer source at the current time
    //with the calculated offset.
    audio.start(context.currentTime, startPosition);
}
```

### Give it a go
Start the engine and press the "Throttle" button.

```html
<input type="button" id="playstop" value = "Start/Stop Engine" onclick='playStop()'>
<input type="button" id="throttle" value = "Throttle" onmousedown='throttleOn()' onmouseup='throttleOff()'>
```

So with only three small sound files and a good sounding engine we decided to move on to the next challenge.

## Getting the sync

Together with David Lindkvist of 14islands we started to look deeper into getting the devices to play in perfect sync. The basic theory is simple. The device asks the server for its time, factors in network latency, then calculates the local clock offset.

```js
syncOffset = localTime - serverTime - networkLatency
```

With this offset each connected device shares the same concept of time. Easy, right? (Again, in theory.)

## Calculating network latency

We might assume that latency is half the time it takes to request and receive a response from the server:

```js
networkLatency = (receivedTime - sentTime) × 0.5
```

The problem with this assumption is that the round trip to the server is not always symmetrical, i.e. the request might take longer than the response or vice versa. The higher the network latency, the bigger impact this asymmetry will have—causing sounds to be delayed and played out of sync with other devices.

Luckily our brain is wired to not notice if sounds are slightly delayed. Studies have shown that it takes a delay of 20 to 30 milliseconds (ms) before our brain will perceive sounds as separate. However, by around 12 to 15 ms, you will start to “feel” the effects of a delayed signal even if you’re unable to fully “perceive” it. We investigated a couple of established time synchronization protocols, simpler alternatives, and tried implementing some of them in practice. In the end—thanks to Google’s low latency infrastructure—we were able to simply sample a burst of requests and use the sample with the lowest latency as a reference.

## Fighting clock drift

It worked! We had 5+ devices playing a pulse in perfect sync—but only for a while. After playing for a couple of minutes devices would drift apart even though we scheduled sound using the highly precise Web Audio API context time. The lag accumulated slowly, by only a couple of milliseconds at a time and undetectable at first, but resulting in musical layers totally out of sync after playing for longer periods of time. Hello, clock drift.

The solution was to re-sync every few seconds, calculate a new clock offset and seamlessly feed this into the audio scheduler. To reduce the risk of notable changes in the music due to network lag, we decided to smooth out the change by keeping a history of latest sync offsets and calculate an average.

## Scheduling song and switching arrangements

Making an interactive sound experience means that you are no longer in control of when parts of the song will play, since you depend on user actions to change the current state. We had to make sure we could switch between arrangements in the song in a timely fashion, which means our scheduler had to be able to calculate how much remains of the currently playing bar before switching to the next arrangement.
Our algorithm ended up looking something like this:

- `Client(1)` starts the song.
- `Client(n)` asks first client when the song was started.   
- `Client(n)` calculates a reference point to when the song was started using its Web Audio context, factoring in syncOffset, and the time that has passed since its audio context was created. 
- `playDelta = Date.now() - syncOffset - songStartTime - context.currentTime`
- `Client(n)` calculates how long the song has been running using the playDelta. The song scheduler uses this to know which bar in the current arrangement should be played next.
- `playTime = playDelta + context.currentTime nextBar = Math.ceil((playTime % loopDuration) ÷ barDuration) % numberOfBars`

For the sake of sanity, we limited our arrangements to always be eight bars long and have the same tempo (beats per minute).

## Look ahead

It’s always important to [schedule](http://www.html5rocks.com/en/tutorials/audio/scheduling/) ahead when using `setTimeout` or `setInterval` in JavaScript. This is because the JavaScript clock is not very precise and scheduled callbacks can easily be skewed by tens of milliseconds or more by layout, rendering, garbage collection, and XMLHTTPRequests. In our case we also had to factor in the time it takes for all clients to receive the same event over the network.

## Audio sprites

Combining sounds into one file is a great way to reduce HTTP requests, both for HTML Audio and the Web Audio API. It also happens to be the best way to play sounds responsively using the Audio object, since it doesn’t have to load up a new audio object before playing. There are already some [good implementations](http://www.google.com/url?q=http%3A%2F%2Fremysharp.com%2F2010%2F12%2F23%2Faudio-sprites%2F&sa=D&sntz=1&usg=AFQjCNFzBNuXNYzET0YRpiP_UxSq6Aa10A) out there which we used as a starting point. We’ve extended our sprite to work reliably on both iOS and Android as well as handling some odd cases where devices fall asleep.

On Android, Audio elements keep playing even if you put the device into sleep mode. In sleep mode, JavaScript execution is limited to preserve battery and you can’t rely on `requestAnimationFrame`, `setInterval` or `setTimeout` to fire callbacks. This is a problem since audio sprites rely on JavaScript to keep checking if playback should be stopped. To make matters worse, in some cases the Audio element’s `currentTime` doesn’t update though the audio is still playing. 

Check out the [AudioSprite implementation](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2F14islands%2FAudioSprite&sa=D&sntz=1&usg=AFQjCNE7SWRjiPbz_4NDPqXsAQYbPu-v8A) we used in Chrome Racer as a non-Web Audio fallback.

## Audio element

When we started working on Racer, Chrome for Android did not yet support the Web Audio API. The logic of using HTML Audio for some devices, the Web Audio API for others, combined with the advanced audio output we wanted to achieve made for some interesting challenges. Thankfully, this is all history now. Web Audio API is implemented in [Android M28 beta.](https://play.google.com/store/apps/details?id=com.chrome.beta)

- Delays/timing issues. The Audio element doesn’t always play exactly when you tell it to play. Since JavaScript is single threaded the browser might be busy, causing playback delays of up to two seconds.
- Playback delays mean smooth looping is not always possible. On desktop you can use [double buffering](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2FHivenfour%2FSeamlessLoop&sa=D&sntz=1&usg=AFQjCNGmYC2m___Fh9cPiv9AXPrXRqM14w) to achieve somewhat gapless loops, but on mobile devices this isn’t an option, because:
    - Most mobile devices won’t play more than one Audio element at a time.
    - Fixed volume. Neither Android nor iOS allow you to change the volume of an Audio object.
- No preloading. On mobile devices, the Audio element won’t start loading its source unless playback is initiated in a `touchStart` handler.
- Seeking [issues](https://code.google.com/p/chromium/issues/detail?id=110309). Getting `duration` or setting `currentTime` will fail unless your server supports HTTP Byte-Range. Watch out for this one if you’re building an audio sprite like we did.
- Basic Auth on MP3 fails. Some devices [fail to load MP3 files protected by Basic Auth](https://code.google.com/p/android/issues/detail?id=1353), no matter which browser you’re using.

## Conclusions

We’ve come a long way since hitting the mute button as the best option to deal with sound for web, but this is only the beginning and web audio is about to rock hard. We’ve only touched the surface of what can be done when it comes to syncing of multiple devices. We didn’t have the processing power in the phones and tablets to dive into signal processing  and effects (like reverb), but as device performance increases web based games will take advantage of those features too. These are exciting times to continue pushing the possibilities of sound.
