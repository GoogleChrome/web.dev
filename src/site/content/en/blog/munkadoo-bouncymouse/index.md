---
layout: post
title: Case Study - Bouncy Mouse
authors:
  - ericrk
date: 2012-02-18
tags:
  - blog
  - case-study
---

## Introduction

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/lYHR5kzCPI8DWurLpItD.svg", alt="Bouncy Mouse", width="320", height="183" %}
</figure>

After publishing Bouncy Mouse on iOS and Android at the end of last year, I learned a few very important lessons. Key among them was that breaking into an established market is hard. On the thoroughly saturated iPhone market, gaining traction was very hard; on the less saturated Android Marketplace, progress was easier, but still not easy.
Given this experience, I saw an interesting opportunity on the Chrome Web Store. While the Web Store is by no means empty, its catalogue of high-quality HTML5-based games is just beginning to grow into maturity. For a new app developer, this means that making the ranking charts and gaining visibility is much easier. With this opportunity in mind, I set about porting Bouncy Mouse to HTML5 in hopes that I could deliver my latest gameplay experience to an exciting new user base.
In this case study, I will talk a bit about the general process of porting Bouncy Mouse to HTML5, then I will dig a bit deeper into three areas that proved interesting: Audio, Performance, and Monetization.

## Porting a C++ Game To HTML5

Bouncy Mouse is currently available on Android(C++), iOS (C++), Windows Phone 7 (C#), and Chrome (Javascript). 
This occasionally prompts the question: How do you write a game that can be easily ported to multiple platforms?. 
I get the feeling that people hope for some magic bullet that they can use to achieve this level of portability without resorting to a hand-port. 
Sadly, I’m not sure such a solution yet exists (the closest thing is probably Google’s [PlayN framework](http://code.google.com/p/playn/)
or the [Unity engine](http://unity3d.com/), but neither of these hits all the targets I was interested in). 
My approach was, in fact, a hand port. 
I first wrote the iOS/Android version in C++, then ported this code to each new platform. While this may sound like a lot of work, the WP7 and Chrome versions each took no more than 2 weeks to complete.
So now the question is, can anything be done to make a codebase easily hand-portable? There were a couple things I did which helped in this:

### Keep the Codebase Small

While this may seem obvious, it’s really the main reason I was able to port the game so quickly. Bouncy Mouse’s client code is only about 7,000 lines of C++. 7,000 lines of code isn’t nothing, but it’s small enough to be manageable. Both the C# and Javascript versions of the client code ended up being roughly the same size. Keeping my codebase small basically amounted to two key practices: Don’t write any excess code, and do as much as possible in pre-processing (non-runtime) code. 
Not writing any excess code may seem obvious, but it’s one thing I always fight over with myself. I frequently have the urge to write a helper class/function for anything that can be factored into a helper. However, unless you actually plan to use a helper multiple times, it usually just ends up bloating your code. With Bouncy Mouse, I was careful to never write a helper unless I was going to be using it at least three times. When I did write a helper class, I tried to make it clean, portable, and re-usable for my future projects. On the other hand, when writing code just for Bouncy Mouse, with low likelihood of re-use, my focus was to accomplish the coding task as simply and quickly as possible, even if this wasn’t the “prettiest” way to write the code.
The second, and more important part of keeping the codebase small was to push as much as possible into preprocessing steps. If you can take a runtime task and move it to a preprocessing task, not only will your game run faster, but you won’t have to port the code to each new platform. 
To give an example, I originally stored my level geometry data as a fairly unprocessed format, assembling the actual OpenGL/WebGL vertex buffers at run time. This took a bit of setup and a few hundred lines of runtime code. Later, I moved this code to a preprocessing step, writing out fully packed OpenGL/WebGL vertex buffers at compile time. The actual amount of code was about the same, but those few hundred lines had been moved to a preprocessing step, meaning I never had to port them to any new platforms.
There are tons of examples of this in Bouncy Mouse, and what is possible will vary from game to game, but just keep an eye out for anything that doesn’t need to happen at runtime.

### Don’t Take Dependencies You Don’t Need

Another reason Bouncy Mouse is easy to port is because it has almost no dependencies. The following chart summarizes Bouncy Mouse’s major library dependencies per platform:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Android</th>
        <th>iOS</th>
        <th>HTML5</th>
        <th>WP7</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Graphics</td>
        <td>OpenGL ES</td>
        <td>OpenGL ES</td>
        <td>WebGL</td>
        <td>XNA</td>
      </tr>
      <tr>
        <td>Sound</td>
        <td>OpenSL ES</td>
        <td>OpenAL</td>
        <td>Web Audio</td>
        <td>XNA</td>
      </tr>
      <tr>
        <td>Physics</td>
        <td>Box2D</td>
        <td>Box2D</td>
        <td>Box2D.js</td>
        <td>Box2D.xna</td>
      </tr>
    </tbody>
  </table>
</div>

That’s pretty much it. No big 3rd party libraries were used, other than [Box2D](http://code.google.com/p/box2dweb/), which is portable across all platforms. For graphics, both WebGL and XNA map almost 1:1 with OpenGL, so this wasn’t a big issue. Only in the area of sound were the actual libraries different. However, sound code in Bouncy Mouse is small (around a hundred lines of platform-specific code), so this wasn’t a huge issue.
Keeping Bouncy Mouse free of big non-portable libraries means that the logic of the runtime code can be almost the same between versions (despite the language change). Additionally it saves us from getting locked into a non-portable tool chain.
I’ve been asked if coding against OpenGL/WebGL directly causes increased complexity compared to using a library like [Cocos2D](http://cocos2d.org/) or [Unity](http://unity3d.com/) (there are some WebGL helpers out there as well). In fact, I believe just the opposite. Most mobile Phone / HTML5 games (at least ones like Bouncy Mouse) are very simple. In most cases, the game just draws a few sprites and maybe some textured geometry. The sum total of OpenGL-specific code in Bouncy Mouse is probably less than 1000 lines. I’d be surprised if using a helper library would actually reduce this number. Even if it cut this number in half, I’d need to spend significant time learning new libraries/tools just to save 500 lines of code.  On top of this, I have yet to find a helper library portable across all platforms I’m interested in, so taking such a dependency would significantly hurt portability.
If I were writing a 3d game that needed lightmaps, dynamic LOD, skinned animation, and so on, my answer would certainly change. In this case I’d be re-inventing the wheel to try to hand-code my entire engine against OpenGL. My point here is that most Mobile/HTML5 games aren’t (yet) in this category, so no need to complicate things before it’s necessary.

### Don’t Underestimate the Similarities Between Languages

One last trick that saved a lot of time in porting my C++ codebase to a new language was the realization that most of the code is almost identical between each language. While some key elements may change, these are far fewer than things that don’t change. In fact, for many functions, going from C++ to Javascript simply involved running a few regular expression replacements on my C++ codebase.

### Porting Conclusions

That’s pretty much it for the porting process. I’ll touch on a few HTML5 specific challenges in the next few sections, but the main message is that, if you keep your code simple, porting will be a small headache, not a nightmare.

## Audio

One area that caused me (and seemingly everyone else) some trouble was audio. On iOS and Android, a number of solid audio choices are available (OpenSL, OpenAL), 
but in the world of HTML5, things looked bleaker. While HTML5 Audio is available, I found that it has some deal-breaking problems when used in games. Even on the newest browsers, 
I frequently ran into strange behavior. Chrome, for instance, seems to have a limit on the number of simultaneous Audio elements ([source](http://code.google.com/p/chromium/issues/detail?id=110639)) you can create. Additionally, even when sound would play, 
it would sometimes end up inexplicably distorted. Overall, I was a bit worried.
Searching online revealed that just about everyone has the same problem. The solution I initially landed on was an API called SoundManager2. This API uses HTML5 Audio when available, 
falling back to Flash in tricky situations. While this solution worked, it was still buggy and unpredictable (just less so than pure HTML5 Audio). 
A week after launching, I talked to some of the helpful folks at Google, who pointed me at Webkit’s Web Audio API. I had originally considered using this API, 
but had shied away from it due to the amount of unnecessary (for me) complexity the API seemed to have. I just wanted to play a few sounds: with HTML5 Audio this amounts to a couple lines of Javascript. 
However, in my brief look at Web Audio, I was struck by its huge (70 page) specification, the small amount of samples on the web (typical for a new API), 
and the omission of a “play”, “pause”, or “stop” function anywhere in the spec. 
With Google’s assurances that my worries weren’t well founded, I dug into the API again. After looking at a few more examples and doing a bit more research, 
I found that Google was right–the API can definitely meet my needs, and it can do so without the bugs that plague the other APIs. Especially handy is the article [Getting Started with Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/), 
which is a great place to go if you want to gain a deeper understanding of the API. 
My real issue is that even after understanding and using the API, it still seems to me like an API that isn’t designed to “just play a few sounds”. 
To get around this misgiving, I wrote a small helper class which let me use the API just the way I wanted–to play, pause, stop, and query the state of a sound. 
I called this helper class AudioClip. The full source is available [on GitHub](https://github.com/Munkadoo/oss/blob/master/WebAudio/WebAudioHelper.js)
under the Apache 2.0 license, and I’ll be discussing the details of the class below. But first, some background on the Web Audio API:

### Web Audio Graphs

The first thing that makes the Web Audio API more complex (and more powerful) than the HTML5 Audio element is its ability to process / mix audio before outputting it to the user. While powerful, the fact that any audio playback involves a graph makes things a bit more complex in simple scenarios. To illustrate the power of the Web Audio API, consider the following graph:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/txV1GdBKIMYWD0rVCtIq.svg", alt="Basic Web Audio Graph", width="651", height="314" %}
<figcaption>Basic Web Audio Graph</figcaption>
</figure>

While the above example shows the power of the Web Audio API, I didn’t need most of this power in my scenario. I just wanted to play a sound. While this still requires a graph, the graph is very simple.

### Graphs Can Be Simple

The first thing that makes the Web Audio API more complex (and more powerful) than the HTML5 Audio element is its ability to process / mix audio before outputting it to the user. While powerful, the fact that any audio playback involves a graph makes things a bit more complex in simple scenarios. To illustrate the power of the Web Audio API, consider the following graph:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/hM71AVkmii4Kd5zMLV5y.svg", alt="Trivial Web Audio Graph", width="392", height="218" %}
<figcaption>Trivial Web Audio Graph</figcaption>
</figure>

The trivial graph shown above can accomplish everything needed to play, pause, or stop a sound.

### But Let's Not Even Worry About the Graph

While understanding the graph is nice, it’s not something I want to deal with each time I play a sound. Therefore, I wrote a simple wrapper class “AudioClip”. This class manages this graph internally, but presents a much simpler user-facing API.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/JCxm2JnV2VvweoebkUsr.svg", alt="AudioClip", width="655", height="401" %}
<figcaption>AudioClip</figcaption>
</figure>

This class is nothing more than a Web Audio graph and some helper state, but allows me to use much simpler code than if I had to build a Web Audio graph to play each sound.

```js
// At startup time
var sound = new AudioClip("ping.wav");

// Later
sound.play();
```

### Implementation Details

Let’s take a quick look at the helper class’s code:
Constructor – The constructor handles loading the sound data using an XHR. Although not shown here (to keep the example simple), an HTML5 Audio element could also be used as a source node. This is especially helpful for large samples. Note that the Web Audio API requires that we fetch this data as an “arraybuffer”. Once the data is received, we create a Web Audio buffer from this data (decoding it from its original format into a runtime PCM format).

```js
/**
* Create a new AudioClip object from a source URL. This object can be played,
* paused, stopped, and resumed, like the HTML5 Audio element.
*
* @constructor
* @param {DOMString} src
* @param {boolean=} opt_autoplay
* @param {boolean=} opt_loop
*/
AudioClip = function(src, opt_autoplay, opt_loop) {
// At construction time, the AudioClip is not playing (stopped),
// and has no offset recorded.
this.playing_ = false;
this.startTime_ = 0;
this.loop_ = opt_loop ? true : false;

// State to handle pause/resume, and some of the intricacies of looping.
this.resetTimout_ = null;
this.pauseTime_ = 0;

// Create an XHR to load the audio data.
var request = new XMLHttpRequest();
request.open("GET", src, true);
request.responseType = "arraybuffer";

var sfx = this;
request.onload = function() {
// When audio data is ready, we create a WebAudio buffer from the data.
// Using decodeAudioData allows for async audio loading, which is useful
// when loading longer audio tracks (music).
AudioClip.context.decodeAudioData(request.response, function(buffer) {
    sfx.buffer_ = buffer;
    
    if (opt_autoplay) {
    sfx.play();
    }
});
}

request.send();
}
```

Play – Playing our sound involves two steps: setting up the playback graph, and calling a version of “noteOn” on the graph’s source. A source can only be played back once, so we must re-create the source/graph each time we play.
Most of the complexity of this function comes from requirements needed to resume a paused clip (`this.pauseTime_ > 0`). To resume playback of a paused clip, we use `noteGrainOn`, 
which allows playing a sub-region of a buffer. Unfortunately, `noteGrainOn` doesn’t interact with looping in the desired way for this scenario (it will loop the sub-region, not the whole buffer). 
Therefore, we need to work around this by playing the remainder of the clip with `noteGrainOn`, then re-starting the clip from the beginning with looping enabled.

```js
/**
* Recreates the audio graph. Each source can only be played once, so
* we must recreate the source each time we want to play.
* @return {BufferSource}
* @param {boolean=} loop
*/
AudioClip.prototype.createGraph = function(loop) {
var source = AudioClip.context.createBufferSource();
source.buffer = this.buffer_;
source.connect(AudioClip.context.destination);

// Looping is handled by the Web Audio API.
source.loop = loop;

return source;
}

/**
* Plays the given AudioClip. Clips played in this manner can be stopped
* or paused/resumed.
*/
AudioClip.prototype.play = function() {
if (this.buffer_ && !this.isPlaying()) {
// Record the start time so we know how long we've been playing.
this.startTime_ = AudioClip.context.currentTime;
this.playing_ = true;
this.resetTimeout_ = null;

// If the clip is paused, we need to resume it.
if (this.pauseTime_ > 0) {
    // We are resuming a clip, so it's current playback time is not correctly
    // indicated by startTime_. Correct this by subtracting pauseTime_.
    this.startTime_ -= this.pauseTime_;
    var remainingTime = this.buffer_.duration - this.pauseTime_;

    if (this.loop_) {
    // If the clip is paused and looping, we need to resume the clip
    // with looping disabled. Once the clip has finished, we will re-start
    // the clip from the beginning with looping enabled
    this.source_ = this.createGraph(false);
    this.source_.noteGrainOn(0, this.pauseTime_, remainingTime)

    // Handle restarting the playback once the resumed clip has completed.
    // *Note that setTimeout is not the ideal method to use here. A better 
    // option would be to handle timing in a more predictable manner,
    // such as tying the update to the game loop.
    var clip = this;
    this.resetTimeout_ = setTimeout(function() { clip.stop(); clip.play() },
                                    remainingTime * 1000);
    } else {
    // Paused non-looping case, just create the graph and play the sub-
    // region using noteGrainOn.
    this.source_ = this.createGraph(this.loop_);
    this.source_.noteGrainOn(0, this.pauseTime_, remainingTime);
    }

    this.pauseTime_ = 0;
} else {
    // Normal case, just creat the graph and play.
    this.source_ = this.createGraph(this.loop_);
    this.source_.noteOn(0);
}
}
}
```

Play as Sound Effect - The play function above doesn’t allow the audio clip to be played multiple times with overlap (a second playback is only possible when the clip is finished or stopped). Sometimes a game will want to play a sound many times without waiting for each playback to complete (collecting coins in a game, etc). To enable this, the AudioClip class has a `playAsSFX()` method.
Because multiple playbacks can occur simultaneously, the playback from `playAsSFX()` isn’t bound 1:1 with the AudioClip. Therefore, playback cannot be stopped, paused or queried for state. Looping is also disabled, as there would be no way to stop a looping sound played in this manner.

```js
/**
* Plays the given AudioClip as a sound effect. Sound Effects cannot be stopped
* or paused/resumed, but can be played multiple times with overlap.
* Additionally, sound effects cannot be looped, as there is no way to stop
* them. This method of playback is best suited to very short, one-off sounds.
*/
AudioClip.prototype.playAsSFX = function() {
if (this.buffer_) {
var source = this.createGraph(false);
source.noteOn(0);
}
}
```

Stop, pause, and querying state – The rest of the functions are pretty straight forward and don’t require much explanation:

```js
/**
* Stops an AudioClip , resetting its seek position to 0.
*/
AudioClip.prototype.stop = function() {
if (this.playing_) {
this.source_.noteOff(0);
this.playing_ = false;
this.startTime_ = 0;
this.pauseTime_ = 0;
if (this.resetTimeout_ != null) {
    clearTimeout(this.resetTimeout_);
}
}
}

/**
* Pauses an AudioClip. The offset into the stream is recorded to allow the
* clip to be resumed later.
*/
AudioClip.prototype.pause = function() {
if (this.playing_) {
this.source_.noteOff(0);
this.playing_ = false;
this.pauseTime_ = AudioClip.context.currentTime - this.startTime_;
this.pauseTime_ = this.pauseTime_ % this.buffer_.duration;
this.startTime_ = 0;
if (this.resetTimeout_ != null) {
    clearTimeout(this.resetTimeout_);
}
}
}

/**
* Indicates whether the sound is playing.
* @return {boolean}
*/
AudioClip.prototype.isPlaying = function() {
var playTime = this.pauseTime_ +
            (AudioClip.context.currentTime - this.startTime_);

return this.playing_ && (this.loop_ || (playTime < this.buffer_.duration));
}
```
    
### Audio Conclusion

Hopefully this helper class is useful to developers struggling with the same Audio problems as me. Also, a class like this seems a reasonable place to start even if you need to add in some of the more powerful features of the Web Audio API. Either way, this solution met Bouncy Mouse’s needs, and allowed the game to be a true HTML5 game, no strings attached!

## Performance

Another area that worried me in regards to a Javascript port was performance. After finishing v1 of my port, I found that everything was working OK on my quad-core desktop. Unfortunately, things were a little less than OK on a netbook or Chromebook. In this case, Chrome’s profiler saved me by showing exactly where all my programs time was being spent.
My experience highlights the importance of profiling before doing any optimization. I was expecting Box2D physics or maybe the rendering code to be a major source of slowdown; however, the majority of my time was actually being spent in my `Matrix.clone()` function. Given the math-heavy nature of my game, I knew that I did a lot of matrix creation/cloning, but I never expected this to be the bottleneck. In the end, it turned out that a very simple change allowed the game to cut its CPU usage by over 3x, going from 6-7% CPU on my desktop to 2%.
Maybe this is common knowledge to Javascript developers, but as a C++ developer this problem surprised me, so I’ll go into a bit more detail. Basically, my original matrix class was a 3x3 matrix: a 3 element array, each element containing a 3 element array. Unfortunately, this meant that when it was time to clone the matrix, I had to create 4 new arrays. The only change I needed to make was to move this data into a single 9 element array and update my math accordingly. This one change was entirely responsible for this 3x CPU reduction I saw, and after this change my performance was acceptable across all my test devices.

## More Optimization

While my performance was acceptable, I was still seeing a few minor hiccups. After a bit more profiling, I realized that this was because of Javascript’s Garbage Collection. My app was running at 60fps, which meant that each frame had only 16ms to draw. Unfortunately, when garbage collection kicked in on a slower machine, it would sometimes eat up ~10ms. This resulted in a stutter ever few seconds, as the game required almost the full 16ms to draw a full frame.
To get a better idea of why I was generating so much garbage, I used Chrome’s heap profiler. Much to my despair, it turned out that the vast majority of garbage (over 70%) was being generated by Box2D. Eliminating garbage in Javascript is a tricky business, and re-writing Box2D was out of the question, so I realized I had gotten myself into a corner. Fortunately, I still had one of the oldest tricks in the book available to me: When you can’t hit 60fps, run at 30fps. It’s fairly well agreed upon that running at a consistent 30fps is far better than running at a jittery 60fps. In fact I still haven’t received one complaint or comment that the game runs at 30fps (it’s really hard to tell unless you compare the two versions side by side). This extra 16ms per frame meant that even in the case of an ugly garbage collection, I still had plenty of time to render the frame.
While running at 30fps isn’t explicitly enabled by the timing API I was using (WebKit’s excellent [requestAnimationFrame](https://developer.mozilla.org/DOM/window.requestAnimationFrame)), it can be accomplished in a very trivial manner. While maybe not as elegant as an explicit API, 30fps can be accomplished by knowing that RequestAnimationFrame’s interval is aligned to the monitor’s VSYNC (usually 60fps). This means that we just have to ignore every other callback. Basically, if you have a callback “Tick” which gets called every time “RequestAnimationFrame” is fired, this can be accomplished as follows:

```js
var skip = false;

function Tick() {
skip = !skip;
if (skip) {
return;
}

// OTHER CODE
}
```

If you want to be extra cautious, you should check that the computer’s VSYNC is not already at or below 30fps at startup, and disable the skipping in this case. However, I haven’t yet seen this on any desktop/laptop configurations I’ve tested.

## Distribution and Monetization

One final area that surprised me about the Chrome port of Bouncy Mouse was monetization. Going into this project, I envisioned HTML5 games as an interesting experiment to learn up-and-coming technologies. What I didn’t realize was that the port would reach a very large audience and have significant potential for monetization. 

Bouncy Mouse was launched at the end of October on the Chrome Web Store. By releasing on the Chrome Web Store I was able to leverage an existing system for discoverability, community engagement, rankings, and other features that I had grown used to on mobile platforms. What surprised me was how wide the reach of the store was. Within one month of release I had reached close to four hundred thousand installs and was already benefiting from the community engagement (bug reporting, feedback). One other thing that surprised me was a web-app’s potential for monetization.

Bouncy Mouse has one simple monetization method - a banner ad next to the game content. However, given the broad reach of the game, I found that this banner ad was able to generate significant income, and during it's peak period, the app generated income comperable to my most successful platform, Android. One factor contributing to this is that the larger AdSense ads shown on the HTML5 version generate significantly higher revenue per impression than the smaller Admob ads shown on Android. Not only that, but the banner ad on the HTML5 version is much less intrusive than on the Android version, allowing for a cleaner gameplay experience. Overall I was very pleasantly surprised by this outcome.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/yyaTb3BewMR6kA4IhIfm.png", alt="Normalized Earnings Over Time.", width="800", height="350" %}
<figcaption>Normalized Earnings Over Time</figcaption>
</figure>

While the earnings from the game were much better than expected, it is worth noting that the reach of the Chrome Web Store is still smaller than that of more mature platforms like Android Market. While Bouncy Mouse was able to quickly shoot up to the #9 most popular game on the Chrome Web Store, the rate of new users coming to the site slowed down considerably since the initial release. That said, the game's still seeing steady growth, and I'm excited to see what the platform develops into!

## Conclusion

I would say that porting Bouncy Mouse to Chrome went much smoother than I expected. Other than some minor audio and performance issues, I found that Chrome was a perfectly capable platform for an existing smartphone game.  I’d encourage any developers who have been shying away from the experience to give it a shot. I’ve been very happy with both the porting process as well as the new gaming audience that having an HTML5 game has connected me to. 
Feel free to shoot me an email if you have any questions. Or just drop a comment below, I’ll try to check these on a regular basis.

