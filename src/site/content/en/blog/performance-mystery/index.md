---
layout: post
title: Use forensics and detective work to solve JavaScript performance mysteries
authors:
  - johnmccutchan
date: 2013-06-13
tags:
  - blog
---
## Introduction

In recent years, web applications have been sped up considerably. Many applications now run fast enough that I've heard some developers wonder aloud "is the web fast enough?". For some applications it may be, but, for the developers working on high performance applications, we know it is not fast enough. Despite the amazing advances in JavaScript virtual machine technology, a [recent study](https://docs.google.com/a/google.com/document/d/1k8d4SsYJoCfmw6Te8Ijf3WEyotNHp6YMy1PEgn_o5Yg/edit) showed that Google applications spend between 50% and 70% of their time inside [V8](https://code.google.com/p/v8/). Your application has a finite amount of time, shaving cycles off of one system means another system can do more. Remember, applications running at 60fps only have 16ms per frame or else - [jank](http://jankfree.org). Read on, to learn about optimizing JavaScript and profile JavaScript applications, in a from the trenches story of the performance detectives on the V8 team tracking down an obscure performance problem in [Find Your Way to Oz](http://www.findyourwaytooz.com/).

## Google I/O 2013 Session

I presented this material at Google I/O 2013. Check out the video below:

{% YouTube id="VhpdsjBUS3g" %}

## Why does performance matter?

CPU cycles are a zero sum game. Making one part of your system use fewer allows you to use more in another or run smoother overall. Running faster and doing more are often competing goals. Users demand new features while also expecting your application to run smoother. JavaScript virtual machines keep getting faster but that is not a reason for ignoring performance problems that you can fix today, as the many developers, dealing with performance problems in their web applications already know. In real-time, high frame rate, applications the pressure to be jank free is paramount. [Insomniac Games](http://www.insomniacgames.com/) produced a [study](http://www.eurogamer.net/articles/insomniac-60fps-no-more) which showed that a solid, sustained frame rate is important to the success of a game: "A solid frame-rate is still a sign of professional, well-made product." Web developers take note.

## Solving Performance Problems

Solving a performance problem is like solving a crime. You need to carefully examine the evidence, check suspected causes, and experiment with different solutions. All along the way you must document your measurements so that you can be sure you've actually fixed the problem. There is very little difference between this method and how criminal detectives crack a case. Detectives examine evidence, interrogate suspects, and run experiments hoping to find the smoking gun.

## V8 CSI: Oz

The amazing wizards building [Find Your Way to Oz](http://www.findyourwaytooz.com/) approached the V8 team with a performance problem they couldn't solve on their own. Occasionally Oz would freeze, causing jank. The Oz developers had done some initial investigation using the [Timeline Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/performance-reference) in [Chrome DevTools](https://developer.chrome.com/docs/devtools/). Looking at memory usage they encountered the dreaded [saw tooth](http://en.wikipedia.org/wiki/Sawtooth_wave) graph. Once per second the garbage collector was collecting 10MB of garbage and the garbage collection pauses corresponded with the jank. Similar to the following screenshot from the Timeline in Chrome Devtools:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/zYrtkDoYJZOYGuSg7WVb.png", alt="Devtools timeline", width="467", height="81" %}
</figure>

The V8 detectives, Jakob and Yang took up the case. What took place was a long back and forth between Jakob and Yang from the V8 team and the Oz team. I've distilled this conversation down to the important events that helped track down this problem.

## Evidence

The first step is to collect and study the initial evidence.

### What type of application are we looking at?

The Oz demo is an interactive 3D application.  Because of this, it is very sensitive to pauses caused by garbage collections. Remember, an interactive application running at [60fps has 16ms to do all JavaScript work and must leave some of that time for Chrome to process the graphics calls and draw the screen](http://www.html5rocks.com/en/tutorials/speed/rendering/).

Oz performs a lot of arithmetic computation on double values and makes frequent calls to WebAudio and WebGL.

### What kind of performance problem are we seeing?

We are seeing pauses aka frame drops aka jank. These pauses correlate with garbage collection runs.

### Are the developers following best practices?

Yes, the Oz developers are well versed in JavaScript VM performance and optimization techniques. It's worth noting that the Oz developers were using [CoffeeScript](http://coffeescript.org/) as their source language and producing JavaScript code via the CoffeeScript compiler. This made some of the investigation trickier because of the disconnect between the code being written by the Oz developers and the code being consumed by V8. Chrome DevTools now supports [source maps](http://net.tutsplus.com/tutorials/tools-and-tips/source-maps-101/) which would have made this easier.

### Why does the garbage collector run?

Memory in JavaScript is automatically managed for the developer by the VM. V8 uses a common garbage collection system where memory is divided into two (or more) [generations](http://en.wikipedia.org/wiki/Garbage_collection_(computer_science)#Generational_GC_.28ephemeral_GC.29). The young generation holds objects that have recently been allocated. If an object survives long enough it is moved to the old generation.

The young generation is collected at a much higher frequency than the old generation is collected. This is by design, as young generation collection is much cheaper. It is often safe to assume that frequent GC pauses are caused by young generation collection.

In V8 the young memory space is divided into two equally sized contiguous blocks of memory. Only one of these two blocks of memory is in use at any given time and it is called the to space. While there is remaining memory in the to space, allocating a new object is cheap. A cursor in the to space is moved forward the number of bytes needed for the new object. This continues until the to space is exhausted. At this point the program is stopped and collection begins.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pR8BlH788T0cNWdO8Yls.png", alt="V8 young memory", width="545", height="346" %}
</figure>

At this point the from space and to space are swapped. What was the to space and is now the from space, is scanned from beginning to end and any objects which are still alive are copied into the to space or are promoted to the old generation heap. If you want details, I suggest you read about [Cheney's Algorithm](http://en.wikipedia.org/wiki/Cheney&#39;s_algorithm).

Intuitively you should understand that every time an object is allocated either implicitly or explicitly (via a call to new, [], or {}) your application is moving closer and closer to a garbage collection and the dreaded application pause.

### Is 10MB/sec of garbage expected for this application?

In short, no. The developer is not doing anything to expect 10MB/sec of garbage.

## Suspects

The next phase of the investigation is to determine potential suspects and then whittle them down.

### Suspect #1

Calling new during the frame. Remember that each object that is allocated moves you ever closer to a GC pause.  Applications running at high frame rates in particular should strive for zero allocations per frame. Usually this requires a carefully thought out, application specific, object recycling system. The V8 detectives checked with the Oz team and they were not calling new. In fact the Oz team was already well aware of this requirement and said "That would be embarrassing". Scratch this one off the list.

### Suspect #2

Modifying the "shape" of an object outside of the constructor. This happens whenever a new property is added to an object outside of the constructor.  This creates a new [hidden class](https://developers.google.com/v8/design) for the object. When optimized code sees this new hidden class a deopt will be triggered, unoptimized code will execute until the code is classified as hot and optimized again. This de-optimization,re-optimization churn will result in jank but does not strictly correlate with excessive garbage creation. After a careful audit of the code, it was confirmed that object shapes were static, thus suspect #2 was ruled out.

### Suspect #3

Arithmetic in unoptimized code. In unoptimized code all computation results in actual objects being allocated. For example, this snippet:

```js
var a = p * d;
var b = c + 3;
var c = 3.3 * dt;
point.x = a * b * c;
```

Results in 5 HeapNumber objects being created. The first three are for the variables, a, b, and c. The 4th is for the anonymous value (a &ast; b) and the 5th is from #4 &ast; c; The 5th is ultimately assigned to point.x.

Oz does thousands of these operations per frame. If any of these computations occur in functions which are never optimized, they could be the cause of the garbage. Because computations in unoptimized allocate
memory even for temporary results.

### Suspect #4

Storing a double precision number to a property. A HeapNumber object must be created to store the number and the property altered to point at this new object. Altering the property to point at the HeapNumber will not produce garbage. However, it is possible that there are many double precision numbers being stored as object properties. The code is full of statements like the following:

```js
sprite.position.x += 0.5 * (dt);
```

In optimized code, every time x is assigned a freshly computed value, a seemingly innocuous statement, a new HeapNumber object is implicitly allocated, bringing us closer to a garbage collection pause.

Note that by using a [typed array](http://www.khronos.org/registry/typedarray/specs/latest/) (or a regular array which only has held doubles) you can avoid this specific problem entirely as the storage for the double precision number is allocated only once and repeatedly changing the value does not require new storage to be allocated.

Suspect #4 is a possibility.

## Forensics

At this point the detectives have two possible suspects: storing heap numbers as object properties and arithmetic computation happening inside unoptimized functions. It was time to head to the lab and determine definitively which suspect was guilty. NOTE: In this section I will be using a reproduction of the problem found in the actual Oz source code. This reproduction is orders of magnitude smaller than the original code, thus easier to reason about.

### Experiment #1

Checking for suspect #3 (arithmetic computation inside unoptimized functions). The V8 JavaScript engine has a logging system builtin which can provide great insight into what is happening under the hood.

Starting with Chrome not running at all, launching Chrome with the flags:

```shell
--no-sandbox --js-flags="--prof --noprof-lazy --log-timer-events"
```

and then fully quitting Chrome will result in a v8.log file in the current directory.

In order to interpret the contents of v8.log, you must [download](https://code.google.com/p/v8/wiki/Source) the same version of v8 that your Chrome is using (check about:version), and [build it](https://developers.google.com/v8/build).

After successfully building v8, you can process the log using the tick processor:

```shell
$ tools/linux-tick-processor /path/to/v8.log
```

(Substitute mac or windows for linux depending on your platform.)
(This tool must be run from the top level source directory in v8.)

The tick processor displays a text based table of JavaScript functions which had the most ticks:

```shell
[JavaScript]:
ticks  total  nonlib   name
167   61.2%   61.2%  LazyCompile: *opt demo.js:12
 40   14.7%   14.7%  LazyCompile: unopt demo.js:20
 15    5.5%    5.5%  Stub: KeyedLoadElementStub
 13    4.8%    4.8%  Stub: BinaryOpStub_MUL_Alloc_Number+Smi
  6    2.2%    2.2%  Stub: BinaryOpStub_ADD_OverwriteRight_Number+Number
  4    1.5%    1.5%  Stub: KeyedStoreElementStub
  4    1.5%    1.5%  KeyedLoadIC:  {12}
  2    0.7%    0.7%  KeyedStoreIC:  {13}
  1    0.4%    0.4%  LazyCompile: ~main demo.js:30
```

You can see demo.js had three functions: opt, unopt, and main. Optimized functions have an asterisk (*) next to their names. Observe that the function opt is optimized and unopt is unoptimized.

Another important tool in the V8 detective's tool bag is plot-timer-event. It can be executed like so:

```shell
$ tools/plot-timer-event /path/to/v8.log
```

After being run, a png file called timer-events.png is in the current directory. Opening it up you should see something that looks like this:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ycghUWKsSE0VSyih8QmE.png", alt="Timer events", width="800", height="300" %}
</figure>

Aside from the graph along the bottom, data is displayed in rows. The X axis is time (ms). The left hand side includes labels for each row:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/PrC9GkRVxrrpdKPGAxh7.png", alt="Timer events Y axis", width="524", height="568" %}
</figure>

The V8.Execute row has black vertical line drawn on it at each profile tick where V8 was executing JavaScript code. V8.GCScavenger has a blue vertical line drawn on it at each profile tick where V8 was performing a new generation collection. Similarly for the rest of the V8 states.

One of the most important rows is the "code kind being executed". It will be green whenever optimized code is executing and mix of red and blue when unoptimized code is being executed. The following screenshot shows the transition from optimized to unoptimized and then back to optimized code:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/u24agPudgPibL91vBf6E.png", alt="Code kind being executed", width="800", height="43" %}
</figure>

Ideally, but never immediately, this line will be solid green. Meaning that your program has transitioned into an optimized steady state. Unoptimized code will always run slower than optimized code.

If you've gone to this length it's worth noting that you can work much quicker by refactoring your application so that it can run in the v8 debug shell: d8. Using d8 gives you faster iteration times with the tick-processor and plot-timer-event tools. Another side effect of using d8 is that it becomes easier to isolate actual problem, reducing the amount of noise present in the data.

Looking at the timer events plot from the Oz source code, showed a transition from optimized to unoptimized code and, while executing unoptimized code many new generation collections were triggered, similar to the following screenshot (note time has been removed in the middle):

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/svYDqOn9SLBhh3nETaL4.png", alt="Timer events plot", width="333", height="325" %}
</figure>

If you look closely you can see that the black lines indicating when V8 is executing JavaScript code are missing at precisely the same profile tick times as the new generation collections (blue lines). This demonstrates clearly that while garbage is being collected, the script is paused.

Looking at the tick processor output from the Oz source code, the top function (updateSprites) was not optimized. In other words, the function in which the program spent the most time was also unoptimized. This strongly indicates that suspect #3 is the culprit. The source for updateSprites contained loops that looked like these:

```js
function updateSprites(dt) {
    for (var sprite in sprites) {
        sprite.position.x += 0.5 * dt;
        // 20 more lines of arithmetic computation.
    }
}
```

Knowing V8 as well as they do, they immediately recognized that the for-i-in loop construct is sometimes not optimized by V8. In other words, if a function contains a for-i-in loop construct, it may not be optimized. This is a special case today, and will likely change in the future, that is, V8 may one day optimize this loop construct. Since we aren't V8 detectives and don't know V8 like the back of our hands, how can we determine why updateSprites was not optimized?

### Experiment #2

Running Chrome with this flag:

```shell
--js-flags="--trace-deopt --trace-opt-verbose"
```

displays a verbose log of optimization and deoptimization data. Searching through the data for updateSprites we find:

[disabled optimization for updateSprites, reason: ForInStatement is not fast case]

Just as the detectives hypothesized, the for-i-in loop construct was the reason.

## Case Closed

After discovering the reason updateSprites was not optimized, the fix was simple, simply move the computation into its own function, that is:

```js
function updateSprite(sprite, dt) {
    sprite.position.x += 0.5 * dt;
    // 20 more lines of arithmetic computation.
}

function updateSprites(dt) {
    for (var sprite in sprites) {
        updateSprite(sprite, dt);
    }
}
```
updateSprite will be optimized, resulting in far fewer HeapNumber objects, resulting in less frequent GC pauses. It should be easy for you to confirm this by performing the same experiments with new code.  The careful reader will notice that double numbers are still being stored as properties. If profiling indicates it is worth it, changing position to be an array of doubles or a typed data array would further reduce the number of objects being created.

## Epilogue

The Oz developers didn't stop there. Armed with the tools and techniques shared with them by the V8 detectives, they were able to find a few other functions that were stuck in deoptimization hell and factored the computation code into leaf functions which were optimized, resulting in even better performance.

Get out there and start solving some performance crimes!
