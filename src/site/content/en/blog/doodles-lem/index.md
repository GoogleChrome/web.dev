---
layout: post
title: Case Study - Building the Stanisław Lem Google doodle
date: 2011-08-06
authors:
  - marcinwichary
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study

---
## Hello, (strange) world

The Google homepage is a fascinating environment to code within. It comes
with many challenging restrictions: particular focus on speed and latency,
having to cater to all sorts of browsers and work under various
circumstances, and… yes, surprise and delight.
  
I’m talking about [Google doodles](http://www.google.com/doodles/), the special illustrations that occasionally replace our logo.
And while my relationship with pens and brushes has long had that
distinctive flavour of a restraining order, I often contribute to the
interactive ones.
  
Every interactive doodle I coded ([Pac-Man](http://www.google.com/doodles/30th-anniversary-of-pac-man), [Jules Verne](http://www.google.com/doodles/jules-vernes-183rd-birthday), [World’s Fair](http://www.google.com/doodles/160th-anniversary-of-the-first-worlds-fair))– and many I helped with – were in equal parts futuristic and anachronistic: great opportunities for pie-in-the-sky applications of cutting-edge Web features… and gritty pragmatism of cross-browser
compatibility.

We learn a lot from each interactive doodle, and the recent Stanisław Lem mini-game was no exception, with its 17,000 lines of JavaScript code
trying many things for the first time in doodle history. Today, I want to share that code with you – perhaps you'll find something interesting
there, or point out my mistakes – and talk a bit about it.

[View Stanisław Lem doodle code »](https://code.google.com/p/stanislaw-lem-google-doodle/)

A thing worth keeping in mind is that Google's homepage is not a place for
tech demos. With our doodles, we want to celebrate specific people and
events, and we want to do that using the best art and the best
technologies we can summon – but never celebrate technology for
technology's sake. This means carefully looking at whatever part of
broadly understood HTML5 is available, and whether it helps us make the
doodle better without distracting from it or overshadowing it.

So, let's go through some of the modern Web technologies that found their
place – and some that didn't – in the Stanisław Lem doodle.

## Graphics via DOM and canvas

[Canvas](https://developer.mozilla.org/HTML/Canvas) is
powerful and created for exactly the kind of things we wanted to do in
this doodle. However, some of the older browsers we cared about didn't
support it – and even though I am literally sharing an office with the
person who put together an otherwise excellent [excanvas](http://excanvas.sourceforge.net/), I decided to choose
a different way.

I put together a
graphic engine that abstracts away
graphic primitives called “rects,” and then renders them using either
canvas, DOM if canvas is unavailable.

This approach comes with some interesting challenges – for example, moving
or changing an object in DOM has immediate consequences, whereas
for canvas there’s a specific moment when everything’s drawn at the same
time. (I decided to have just one canvas, and clear it and draw from
scratch with every frame. Too many, literally, moving parts on one hand –
and on the other not enough complexity to warrant splitting into multiple
overlapping canvases and updating them selectively.)

Unfortunately, switching to canvas is not as simple as just mirroring CSS
backgrounds with `drawImage()`: you lose a number of things
that come for free when putting things together
via DOM – most importantly layering with z-indexes, and mouse events.

I already abstracted away the z-index with a concept called “planes.” The
doodle defined a number of plane – from the sky far behind, to the mouse
pointer in front of everything – and every actor within the doodle had to
decide which one it belonged to (small plus/minus corrections within a
plane were possible by using `planeCorrection`).

Rendering through DOM, the planes are simply translated into z-index.
But if we render via canvas, we need to sort rects based on
their planes before drawing them. Since it’s
costly to do this every time, the order is recalculated only when an actor
is added or when it moves to another plane.

For mouse events, I abstracted that too… sort of. For both DOM and canvas,
I used additional completely transparent floating DOM elements with high z-index, whose function is only to react to mouse over/out, clicks and
taps. 

One of the things we wanted to try with this doodle was breaking the
fourth wall. The above engine allowed us to combine canvas-based actors
with DOM-based actors. For example, the explosions in the finale are both
in canvas for in-universe objects and in DOM for the rest of the Google homepage. The bird, normally flying around and clipped by our
jagged mask like any other actor, decides to stay out of trouble during
the shooting level, and sits on the I’m Feeling Lucky button. The way it’s
done is for the bird to leave canvas and become a DOM
element (and vice versa later), which I hoped to be completely
transparent to our visitors.

## The frame rate

Knowing the current frame rate, and reacting to when it's too slow (and
too fast!) was an important part of our engine. Since the browsers don't
report back the frame rate, we have to calculate it ourselves.

I started with using [requestAnimationFrame](https://developer.mozilla.org/en/DOM/window.requestAnimationFrame),
falling back to the
old-fashioned `setTimeout` if the former was not available.
`requestAnimationFrame` cleverly saves the CPU in
some situations – although we are doing some of that ourselves, as will be
explained below – but also simply allows us to get a higher frame rate
than `setTimeout`.

{% Aside %}
Why a repeated `setTimeout` and not simply
`setInterval`? We found out before that when the system is
lagging, `setInterval`s become slightly unpredictable and can hog the CPU
when the browser tries to catch up. If you’re using `setTimeout`, there’s
only one timer event scheduled at any given time, so there is no danger of this
happening.
{% endAside %}

Calculating the current frame rate is simple, but is
subject to drastic changes – for example it can drop quickly when another
application hogs the computer for a while. Therefore, we calculate a
“rolling” (averaged) frame rate only across every 100 physical ticks
and make decisions based on that.

What kind of decisions?

- If the frame rate is higher than 60fps, we throttle it.
Currently, `requestAnimationFrame` on some versions of Firefox has no
upper cap on the frame rate, and there's no point in wasting the CPU.
Note that we actually cap at 65fps, because of the rounding errors that
make the frame rate just a bit higher than 60fps on other browsers – we
don't want do start throttling that by mistake.

- If the frame rate is lower than 10fps, we simply slow
down the engine instead of dropping frames.
It’s a lose-lose proposition, but I felt that skipping frames
excessively would be more confusing than simply having a slower (but still
coherent) game. There’s another nice side effect of that –
if the system gets slow temporarily, the user won’t experience a weird
jump ahead as the engine is desperately catching up. (I did it slightly
differently for Pac-Man, but the minimum frame rate is a better
approach.)

- Lastly, we can think of simplifying graphics when the frame rate gets
dangerously low. We're not doing it for Lem doodle with the exception of
mouse pointer (more on that below), but hypothetically we could lose some of the extraneous
animations just so that the doodle feels fluid even on slower computers.

We also have a concept of a physical tick and a logical tick. The former comes from
`requestAnimationFrame`/`setTimeout`. The ratio in
normal gameplay is 1:1, but for fast-forwarding, we just add more logical
ticks per a physical tick (up to 1:5). This allows us to do all the
necessary calculations for every logical tick, but only designate the last
one to be the one updating things on the screen.

## Benchmarking 

An assumption can be (and indeed, early on, was) made that canvas will be
faster than DOM whenever it's available. That is not always true. While
testing, we found out that Opera 10.0–10.1 on a Mac, and Firefox on Linux
are actually faster when moving DOM elements.

In the perfect world, the doodle would silently benchmark different
graphic techniques – DOM elements moved using `style.left`
and `style.top`,
drawing on canvas, and maybe even DOM elements moved using CSS3 transforms

– and then switch to whichever one gave the highest frame rate. I started
writing code for that, but found that at least my way of benchmarking was
pretty unreliable and required a lot of time. Time that we don't have on
our homepage – we care a lot about speed and we want the doodle to show up
instantly and the gameplay to begin as soon as you click or tap.

In the end, Web development sometimes boils down to having to do what you
gotta do. I looked behind my shoulder to make sure no one was looking, and
then I just hard-coded Opera 10
and Firefox out of canvas. In the next life, I will come back as a
`<marquee>` tag.

## Conserving CPU

You know that friend who comes to your house, watches the season finale of
Breaking Bad, spoils it for you and then
deletes it from your DVR? You don't want to be that guy, do you?

So, yes, the worst analogy ever. But we don't want our doodle to be that
guy either – the fact we're allowed into someone's browser tab is a
privilege, and hoarding CPU cycles or distracting the user
would make us an unpleasant guest. Therefore, if no one’s playing with the doodle
(no taps, mouse clicks, mouse movements, or key presses), we want it to
eventually go to sleep.

When?

- after 18 seconds on the homepage (arcade games called this [the attract mode](http://en.wikipedia.org/wiki/Attract_mode))
- after 180 seconds if the tab has focus
- after 30 seconds if the tab doesn’t have focus (e.g. the user switched to another window, but perhaps is still watching the doodle now in an inactive tab)
- __immediately__ if the tab becomes invisible (e.g. the user switched to
another tab in the same window – no point in wasting cycles if we can't
be seen)

How do we know the tab currently has focus? We attach ourselves to `window.focus` and `window.blur` How
do we know the tab is visible? We’re using the new [Page Visibility API](http://code.google.com/chrome/whitepapers/pagevisibility.html) and
react to the appropriate event.

The time outs above are more forgiving than usual for us. I adapted them
to this particular doodle, which has a lot of ambient animations (chiefly the
sky and the bird). Ideally, the time outs would be gated on in-game
interaction – e.g. right after landing, the bird could report back to the
doodle that it can go to sleep now – but I didn't implement
that in the end.

Since the sky is always in motion, when falling asleep and waking up the
doodle doesn’t just stop or start – it slows down before pausing, and vice
versa for resuming, increasing or decreasing the number logical ticks per a physical tick as necessary.

## Transitions, transforms, events

One of the powers of HTML has always been the fact you can make it better
yourself: if something is not good enough in the regular portfolio of HTML
and CSS, you can wrangle JavaScript into extending it. Unfortunately, it
oftentimes means having to start from scratch. CSS3 transitions are great,
but you cannot add a new transition type or use transitions to do anything
else than styling elements. Another example: CSS3 transforms are great for
DOM, but when you move to canvas, you're suddenly on your own.

These issues, and more, are why Lem doodle has its own transition and
transform engine. Yeah, I know, 2000s called, etc. – the capabilities I
built in are nowhere near as powerful as CSS3, but whatever the engine
does, it does consistently and gives us much more control.

I started with a simple action
(event) system – a timeline that fires events in the future without
using `setTimeout`, since at any given point doodle time can
become divorced from physical time as it gets faster (fast forward), slower
(low frame rate or falling asleep to save CPU), or stops altogether
(waiting for images to finish loading).

Transitions are just another
type of actions. In addition to basic movements and rotation, we also
support relative movements (e.g. move something 10 pixels to the right),
custom things like shivering, and also keyframe image animations.

I mentioned rotations, and those are done manually too: we have sprites
for various angles for the objects that need to be rotated.
The main reason is that both CSS3 and canvas
rotations were introducing visual artifacts that we found unacceptable –
and on top of that, those artifacts varied per platform.

Given that some objects which rotate are attached to other rotating
objects – one example is a robot's hand connected to the lower arm, which
itself is attached to a rotating upper arm – this meant I also needed to
create a poor man’s transform-origin in form of pivots.

All of this is a solid amount of work that ultimately covers the ground
already taken care of by HTML5 – but sometimes native support is not good
enough and it's that time for wheel reinvention.

## Dealing with images and sprites

An engine is not just for running the doodle – it's also for working on
it. I shared some debug parameters above: you can find the rest in
`engine.readDebugParams`.

[Spriting](http://www.alistapart.com/articles/sprites)
is a well-known technique that we too use for doodles. It allows us to
save bytes and decrease load times, plus it makes pre-loading easier.
However, it also makes development harder – every change to imagery would
require re-spriting (largely automated, but still cumbersome). Therefore,
the engine supports running on raw images for development as well as
sprites for production via `engine.useSprites` – both are
included with the source code.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3DQCbA7qIdPRtxP5KhYe.png", alt="Pac-Man doodle", width="786", height="280" %}
<figcaption>
    Sprites used by the
    <a href='http://www.google.com/pacman/'>Pac-Man doodle</a>.
</figcaption>
</figure>

We also support pre-loading images
as we go along and halting the doodle if the images didn’t load in time
– complete with a faux progress bar! (Faux because, unfortunately, not even HTML5
can tell us how much of an image file has already been loaded.)

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xCxoSewh2txsVbYlaV7w.png", alt="A screenshot of loading graphic with the rigged progress bar.", width="438", height="604" %}
<figcaption>
    A screenshot of loading graphic with the rigged progress bar.
</figcaption>
</figure>

For some scenes, we use more than one sprite not as much to speed up
loading using parallel connections, but simply because of [3/5 million pixel limitation for images on iOS](http://developer.apple.com/library/IOs/#documentation/AppleApplications/Reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html#//apple_ref/doc/uid/TP40006482-SW15).

Where does HTML5 fit into all this? There's not much of it above, but the
tool I wrote for spriting/cropping was all new Web tech: canvas, [blobs](https://developer.mozilla.org//DOM/Blob),
[a[download]](http://updates.html5rocks.com/2011/08/Downloading-resources-in-HTML5-a-download).
One of the exciting things about HTML is that it
slowly subsumes things that previously had to be done outside of the
browser; the only part we needed do there was
optimizing PNG files.

## Saving state in between games

Lem's worlds always felt big and alive and realistic. His stories
typically started without much in terms of explanation, the first page
starting in medias res, with the reader having to find her or his way
around.

The Cyberiad was no exception and we wanted to replicate that feeling for
the doodle. We start with trying not to over-explain the story. Another
large part is randomization which we felt befitted the mechanic nature of
the universe of the book; we have a number of helper functions dealing with randomness
that we use in many, many places.

We also wanted to increase replayability in other ways. For that, we
needed to know how many times the doodle was finished before. The
historically correct technological solution to that is a cookie, but that
doesn't work for Google homepage – every cookie increases every page's
payload, and again, we care quite a lot about speed and latency.

Fortunately, HTML5 gives us [Web Storage](https://developer.mozilla.org/DOM/Storage), trivial in use, allowing us to save and recall the
general play count and the last scene played by the user – with much more
grace than cookies would ever allow for.

What do we do with this information?

- we show a fast-forward button, allowing to zip through the cutscenes the user already saw before
- we show different N items during the finale
- we slightly increase the difficulty of the shooting level
- we show a little easter egg probability dragon from a different story on your third and subsequent plays

There is a number of debug parameters controlling this:

- `?doodle-debug&doodle-first-run` – pretend it’s a first run
- `?doodle-debug&doodle-second-run` – pretend it’s a second run
- `?doodle-debug&doodle-old-run` – pretend it’s an old run

## Touch devices

We wanted the doodle to feel right at home on touch devices – the most
modern ones are powerful enough so that the doodle runs really well, and
experiencing the game via tapping is so
much more fun than with clicking.

Some upfront changes to the user experience needed to be made. Originally, our
mouse pointer was the only place that communicated a
cutscene/non-interactive part is taking place. We later added a little
indicator in the lower-right corner, so we didn't have to rely on mouse
pointer alone (given that those don't exist on touch devices).

<figure>
<table>
    <thead>
        <tr>
            <th></th>
            <th>Normal</th>
            <th>Busy</th>
            <th>Clickable</th>
            <th>Clicked</th>
        </tr>
    <tbody>
        <tr>
            <td>Work-in-progress</td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/hZgE7oLpWwvEfIkWPqb0.png", alt="Work-in-progress normal pointer", width="32", height="43" %}</figure></td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/tws1jNd1hvUjjqOWa1zC.png", alt="Work-in-progress busy pointer", width="32", height="42" %}</figure></td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Yha8mb7Q31upUtHRhskW.png", alt="Work-in-progress clickable pointer", width="32", height="43" %}</figure></td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/1VWNZcqj8ApJQOhQZiAP.png", alt="Work-in-progress clicked pointer", width="32", height="43" %}</figure></td>
        </tr>
        <tr>
            <td>Final</td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Vq3EgAkFzGls8fjlKZUr.png", alt="Final normal pointer", width="32", height="36" %}v</td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/5MKryf69dmSOEUQEY57x.png", alt="Final busy pointer", width="32", height="37" %}</figure></td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/cdxKyJoAQJvVBnqq8vwj.png", alt="Final clickable pointer", width="32", height="43" %}</figure></td>
            <td><figure>{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/7fOZa4xdr234Z0CAZlK8.png", alt="Final clicked pointer", width="32", height="43" %}</figure></td>
        </tr>
    </tbody>
</table>
<figcaption>
    Mouse pointers during development, and final equivalents.
</figcaption>
</figure>

Most of the stuff worked out of the box. However, quick impromptu
usability tests of our touch experience showed two problems: some of the
targets were too hard to press, and quick taps were ignored since we just
overrode mouse click events.

Having separate clickable transparent DOM elements helped a lot here, as I
could resize them independently of the visuals. I introduced extra
15-pixel padding for touch devices and used it whenever clickable elements were created.
(I added 5-pixel padding for mouse environments too, just
to make Mr. Fitts happy.)

As for the other problem, I just made sure to attach and test proper touch
start and end handlers, instead of relying on mouse click.

We’re also using more modern style properties to remove some touch
features that WebKit browsers add by default (tap highlight, tap callout).

And how do we detect whether a given device running the doodle supports
touch? Lazily. Instead of figuring it out a
priori, we just used our combined IQs to deduct that the device
supports touch… after we get the first touch start event.

## Customizing the mouse pointer

But not everything is touch-based. One of our guiding principles was to
put as many things as we could within the universe of the doodle. The
little sidebar UI (fast-forward, question mark), the tooltip, and even,
yes, the mouse pointer.

How to customize a mouse pointer? Some browsers allow changing the
mouse cursor by linking to a bespoke image file. However, this is not
supported well and it’s also somewhat restrictive.

If not this, then what? Well, why not making a mouse pointer just another
actor in the doodle? This works, but comes with a number of
caveats, chiefly:

- you need to be able to remove the native mouse pointer
- you need to be pretty good at keeping your mouse pointer in sync with
the “real” one

The former is tricky. CSS3 allows for `cursor: none`, but it
too is not supported in some browsers. We needed to resort to some
gymnastics: using empty `.cur`
file as a fallback, specifying concrete
behavior for some browsers, and even hard-coding others out of the
experience whatsoever.

The other is relatively trivial on its face, but
with the mouse pointer being just another part of the universe of the
doodle, it will inherit all its problems too. The biggest one? If the
frame rate of the doodle is low, the frame rate of the mouse pointer will
be low too – and that has dire consequences since the mouse pointer, being
a natural extension of your hand, needs to feel responsive no matter what.
(People who used Commodore Amiga in their past are now nodding
vigorously.)

One somewhat complex solution to that problem is decoupling the mouse
pointer from the regular update loop. We did just that – in an alternate
universe where I don't need to sleep. A simpler solution for this one?
Just reverting to the native mouse pointer
if the rolling frame rate drops
below 20fps. (This is where the rolling
frame rate comes in handy. If we reacted to the current frame rate, and if
it happened to oscillate around 20fps, the user would see the custom mouse
pointer hiding and showing all the time.) This brings us to:

<figure>
<table>
    <thead>
        <tr>
            <th>Frame rate range</th>
            <th>Behaviour</th>
        </tr>
    <tbody>
        <tr>
            <td> >10fps</td>
            <td> Slow down the game so that more frames are not dropped.</td>
        </tr>
        <tr>
            <td>10–20fps</td>
            <td>Use native mouse pointer instead of custom one.</td>
        </tr>
        <tr>
            <td>20–60fps</td>
            <td>Normal operation.</td>
        </tr>
        <tr>
            <td>>60fps</td>
            <td>Throttle so that the frame rate doesn't exceed this value.</td>
        </tr>
    </tbody>
</table>
<figcaption>
    Summary of frame rate-dependent behaviour.
</figcaption>
</figure>

Oh, and our mouse pointer is dark on a Mac, but white on a PC. Why? Because platform wars need fuel even in
fictional universes.

## Conclusion

This is not a perfect engine, but it doesn't try to be one. It was
developed alongside the Lem doodle, and is very specific to it. That's
okay. “Premature optimization is the root of all evil,” as Don Knuth
famously said, and I don't believe writing an engine in isolation first,
and only applying it later makes sense – the practice informs theory just
as much as theory informs practice. In my case, code was thrown away,
several parts rewritten over and over again, and many common pieces
noticed post, rather than ante factum. But in the end, what we have here
allowed us to do what we wanted – celebrate the career of Stanisław Lem
and the drawings by Daniel Mróz in the best way we could think of.

I hope the above sheds light on some of the design choices and trade-offs
that we needed to make – and how we used HTML5 in a specific, real-life
scenario. Now, play with the source code, take it for the spin, and let us
know what you think.

I did that myself – this below was live in the last days, counting down to
the early hours of the 23th of November 2011 in Russia, which was the
first time zone that saw the Lem doodle. A goofy thing, perhaps, but just
like doodles, things that appear insignificant sometimes have a deeper
meaning – this counter was really a nice “stress test” for the engine.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/OBjGBgmdt7UmytyNhTOp.png", alt="A screenshot of Lem doodle in-universe countdown clock.", width="800", height="300" %}
<figcaption>
    A screenshot of Lem doodle in-universe countdown clock.
</figcaption>
</figure>

And that's one way of looking at the life of a Google doodle – months of
work, weeks of testing, 48 hours of baking it in, all for something that
people play for five minutes. Every one of those thousands of JavaScript
lines is hoping that those 5 minutes will be time well spent. Enjoy.
