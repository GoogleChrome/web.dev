---
title: JavaScript eventing deep dive
subhead:
  '`preventDefault` and `stopPropagation`: when to use which and what exactly each method does.'
authors:
  - stephenstchur
  - thomassteiner
Description: |
  preventDefault and stopPropagationEvent handling in JavaScript is usually fairly
  straightforward. Occasionally though, people get a little tripped up between
  preventDefault and stopPropagation, when to use which one and what exactly each
  method does. This article explains both with the goal of ending your confusion
  once and for all.
date: 2021-09-10
# updated: 2021-09-10
tags:
  - blog
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/tPQ30G1QPF3ETAVf1Q40.jpg
alt: Binders in many colors.
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/-6682215947110973439
---

## Event.stopPropagation() and Event.preventDefault()

JavaScript event handling is often straightforward. This is especially true when dealing with a
simple (relatively flat) HTML structure. Things get a bit more involved though when events are
traveling (or propagating) through a hierarchy of elements. This is typically when developers reach
for `stopPropagation()` and/or `preventDefault()` to solve the problems they're experiencing. If
you've ever thought to yourself "I'll just try `preventDefault()` and if that doesn't work I'll try
`stopPropagation()` and if that doesn't work, I'll try both," then this article is for you! I will
explain exactly what each method does, when to use which one, and provide you with a variety of
working examples for you to explore. My goal is to end your confusion once and for all.

Before we dive too deeply though, it's important to briefly touch on the two kinds of event handling
possible in JavaScript (in all modern browsers that is—Internet Explorer prior to version 9 did not
support event capturing at all).

## Eventing styles (capturing and bubbling)

All modern browsers support event capturing, but it is very rarely used by developers.
Interestingly, it was the only form of eventing that Netscape originally supported. Netscape's
biggest rival, Microsoft Internet Explorer, did not support event capturing at all, but rather, only
supported another style of eventing called event bubbling. When the W3C was formed, they found merit
in both styles of eventing and declared that browsers should support both, via a third parameter to
the `addEventListener` method. Originally, that parameter was just a boolean, but all modern
browsers support an `options` object as the third parameter, which you can use to specify (among
other things) if you want to use event capturing or not:

```js
someElement.addEventListener('click', myClickHandler, { capture: true | false });
```

Note that the `options` object is optional, as is its `capture` property. If either is omitted, the
default value for `capture` is `false`, meaning event bubbling will be used.

{% Aside %} For more details about `addEventListener`, including its legacy syntax, see
[`EventTarget.addEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener).
{% endAside %}

### Event capturing

What does it mean if your event handler is "listening in the capturing phase?" To understand this,
we need to know how events originate and how they travel. The following is true of _all_ events,
even if you, as the developer, don't leverage it, care about it, or think about it.

All events begin at the window and first go through the capturing phase. This means that when an
event is dispatched, it starts the window and travels "downwards" towards its target element
_first_. This happens even if you are only listening in the bubbling phase. Consider the following
example markup and JavaScript:

```html
<html>
  <body>
    <div id="A">
      <div id="B">
        <div id="C"></div>
      </div>
    </div>
  </body>
</html>
```

```js
document.getElementById('C').addEventListener(
  'click',
  function (e) {
    console.log('#C was clicked');
  },
  true,
);
```

When a user clicks on element `#C`, an event, originating at the `window`, is dispatched. This event
will then propagate through its descendants as follows:

`window` => `document` => `<html>` => `<body>` => and so on, until it reaches the target.

It does not matter if nothing is listening for a click event at the `window` or `document` or
`<html>` element or `<body>` element (or any other element on the way to its target). An event still
originates at the `window` and begins its journey as just described.

In our example, the click event will then _propagate_ (this is an important word as it will tie
directly into how the `stopPropagation()` method works and will be explained later in this document)
_from the `window`_ to its target element (in this case, `#C`) by way of every element between the
`window` and `#C`.

This means that the click event will begin at `window` and the browser will ask the following
questions:

"Is anything listening for a click event on the `window` in the capturing phase?" If so, the
appropriate event handlers will fire. In our example, nothing is, so no handlers will fire.

Next, the event will _propagate_ to the `document` and the browser will ask: "Is anything listening
for a click event on the `document` in the capturing phase?" If so, the appropriate event handlers
will fire.

Next, the event will _propagate_ to the `<html>` element and the browser will ask: "Is anything
listening for a click on the `<html>` element in the capturing phase?" If so, the appropriate event
handlers will fire.

Next, the event will _propagate_ to the `<body>` element and the browser will ask: "Is anything
listening for a click event on the `<body>` element in the capturing phase?" If so, the appropriate
event handlers will fire.

Next, the event will _propagate_ to the `#A` element. Again, the browser will ask: "Is anything
listening for a click event on `#A` in the capturing phase and if so, the appropriate event handlers
will fire.

Next, the event will _propagate_ to the `#B` element (and the same question will be asked).

Finally, the event will reach its target and the browser will ask: "Is anything listening for a
click event on the `#C` element in the capturing phase?" The answer this time is "yes!" This brief
period of time when the event is _at_ the target, is known as the "target phase." At this point, the
event handler will fire, the browser will console.log "#C was clicked" and then we're done, right?
_Wrong!_ We're not done at all. The process continues, but now it changes to the bubbling phase.

### Event bubbling

The browser will ask:

"Is anything listening for a click event on `#C` in the bubbling phase?" Pay close attention here.
It is completely possible to listen for clicks (or any event type) in _both_ the capturing _and_
bubbling phases. And if you had wired up event handlers in both phases (e.g. by calling
`.addEventListener()` twice, once with `capture = true` and once with `capture = false`), then yes,
both event handlers would absolutely fire for the same element. But it's also important to note that
they fire in different phases (one in the capturing phase and one in the bubbling phase).

Next, the event will _propagate_ (more commonly stated as "bubble" because it seems as though the
event is traveling "up" the DOM tree) to its parent element, `#B`, and the browser will ask: "Is
anything listening for click events on `#B` in the bubbling phase?" In our example, nothing is, so
no handlers will fire.

Next, the event will bubble to `#A` and the browser will ask: "Is anything listening for click
events on `#A` in the bubbling phase?"

Next, the event will bubble to `<body>`: "Is anything listening for click events on the `<body>`
element in the bubbling phase?"

Next, the `<html>` element: "Is anything listening for click events on the `<html>` element in the
bubbling phase?

Next, the `document`: "Is anything listening for click events on the `document` in the bubbling
phase?"

Finally, the `window`: "Is anything listening for click events on the window in the bubbling phase?"

Phew! That was a long journey, and our event is probably very tired by now, but believe it or not,
that is the journey every event goes through! Most of the time, this is never noticed because
developers are typically only interested in one event phase or the other (and it is usually the
bubbling phase).

It's worth spending some time playing around with event capturing and event bubbling and logging
some notes to the console as handlers fire. It's very insightful to see the path that an event
takes. Here is an example that listens to every element in both phases.

```html
<html>
  <body>
    <div id="A">
      <div id="B">
        <div id="C"></div>
      </div>
    </div>
  </body>
</html>
```

```js
document.addEventListener(
  'click',
  function (e) {
    console.log('click on document in capturing phase');
  },
  true,
);
// document.documentElement == <html>
document.documentElement.addEventListener(
  'click',
  function (e) {
    console.log('click on <html> in capturing phase');
  },
  true,
);
document.body.addEventListener(
  'click',
  function (e) {
    console.log('click on <body> in capturing phase');
  },
  true,
);
document.getElementById('A').addEventListener(
  'click',
  function (e) {
    console.log('click on #A in capturing phase');
  },
  true,
);
document.getElementById('B').addEventListener(
  'click',
  function (e) {
    console.log('click on #B in capturing phase');
  },
  true,
);
document.getElementById('C').addEventListener(
  'click',
  function (e) {
    console.log('click on #C in capturing phase');
  },
  true,
);

document.addEventListener(
  'click',
  function (e) {
    console.log('click on document in bubbling phase');
  },
  false,
);
// document.documentElement == <html>
document.documentElement.addEventListener(
  'click',
  function (e) {
    console.log('click on <html> in bubbling phase');
  },
  false,
);
document.body.addEventListener(
  'click',
  function (e) {
    console.log('click on <body> in bubbling phase');
  },
  false,
);
document.getElementById('A').addEventListener(
  'click',
  function (e) {
    console.log('click on #A in bubbling phase');
  },
  false,
);
document.getElementById('B').addEventListener(
  'click',
  function (e) {
    console.log('click on #B in bubbling phase');
  },
  false,
);
document.getElementById('C').addEventListener(
  'click',
  function (e) {
    console.log('click on #C in bubbling phase');
  },
  false,
);
```

The console output will depend on which element you click. If you were to click on the "deepest"
element in the DOM tree (the `#C` element), you will see every single one of these event handlers
fire. With a bit of CSS styling to make it more obvious which element is which, here is the console
output `#C` element (with a screenshot as well):

```bash
"click on document in capturing phase"
"click on <html> in capturing phase"
"click on <body> in capturing phase"
"click on #A in capturing phase"
"click on #B in capturing phase"
"click on #C in capturing phase"
"click on #C in bubbling phase"
"click on #B in bubbling phase"
"click on #A in bubbling phase"
"click on <body> in bubbling phase"
"click on <html> in bubbling phase"
"click on document in bubbling phase"
```

You can interactively play with this in the live demo below. Click on the `#C` element and observe the console output.

<div style="height: 680px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/event-capturing-and-bubbling.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

## `event.stopPropagation()`

With an understanding of where events originate and how they travel (i.e. propagate) through the DOM
in both the capturing phase and the bubbling phase, we can now turn our attention to
`event.stopPropagation()`.

The `stopPropagation()` method can be called on (most) native DOM events. I say "most" because there
are a few on which calling this method won't do anything (because the event doesn't propagate to
begin with). Events like `focus`, `blur`, `load`, `scroll`, and a few others fall into this
category. You can call `stopPropagation()` but nothing interesting will happen, since these events
don't propagate.

## But what does `stopPropagation` do?

It does, pretty much, just what it says. When you call it, the event will, from that point, cease
propagating to any elements it would otherwise travel to. This is true of _both_ directions
(capturing and bubbling). So if you call `stopPropagation()` anywhere in the capturing phase, the
event will never make it to the target phase or bubbling phase. If you call it in the bubbling
phase, it will have already gone through the capturing phase, but it will cease "bubbling up" from
the point at which you called it.

Returning to our same example markup, what do you think would happen, if we called
`stopPropagation()` in the capturing phase at the `#B` element?

It would result in the following output:

```bash
"click on document in capturing phase"
"click on <html> in capturing phase"
"click on <body> in capturing phase"
"click on #A in capturing phase"
"click on #B in capturing phase"
```

You can interactively play with this in the live demo below. Click on the `#C` element in the live demo and observe the console output.

<div style="height: 680px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/stop-propagation-capturing-B.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

How about stopping propagation at `#A` in the bubbling phase? That would result in the following
output:

```bash
"click on document in capturing phase"
"click on <html> in capturing phase"
"click on <body> in capturing phase"
"click on #A in capturing phase"
"click on #B in capturing phase"
"click on #C in capturing phase"
"click on #C in bubbling phase"
"click on #B in bubbling phase"
"click on #A in bubbling phase"
```

You can interactively play with this in the live demo below. Click on the `#C` element in the live demo and observe the console output.

<div style="height: 680px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/stop-propagation-bubbling-A.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

One more, just for fun. What happens if we call `stopPropagation()` in the _target phase_ for `#C`?
Recall that the "target phase" is the name given to the period of time when the event is _at_ its
target. It would result in the following output:

```bash
"click on document in capturing phase"
"click on <html> in capturing phase"
"click on <body> in capturing phase"
"click on #A in capturing phase"
"click on #B in capturing phase"
"click on #C in capturing phase"
```

{% Aside %} It would be technically more accurate if I had logged "click on #C in target phase".
However, I chose to use the term "capturing" and "bubbling" for both of `#C`'s event handlers to
make it clear that handlers can be executed in both phases of the event's lifecycle. Just know that
technically, the time when the event is at `#C` is officially known as the "target phase".
{% endAside %}

Note that the event handler for `#C` in which we log "click on #C in the capturing phase" _still_
executes, but the one in which we log "click on #C in the bubbling phase" does not. This should make
perfect sense. We called `stopPropagation()` _from_ the former, so that is the point at which the
event's propagation will cease.

You can interactively play with this in the live demo below. Click on the `#C` element in the live demo and observe the console output.

<div style="height: 680px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/stop-propagation-capturing-C.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

In any of these live demos, I encourage you to play around. Try clicking on the `#A` element only or
the `body` element only. Try to predict what will happen and then observe if you are correct. At
this point, you should be able to predict pretty accurately.

## `event.stopImmediatePropagation()`

What is this strange, and not oft-used method? It's similar to `stopPropagation`, but rather than
stopping an event from traveling to descendents (capturing) or ancestors (bubbling), this method
only applies when you have more than one event handler wired up to a single element. Since
`addEventListener()` supports a multicast style of eventing, it's completely possible to wire up an
event handler to a single element more than once. When this happens, (in most browsers), event
handlers are executed in the order they were wired up. Calling `stopImmediatePropagation()` prevents
any subsequent handlers from firing. Consider the following example:

```html
<html>
  <body>
    <div id="A">I am the #A element</div>
  </body>
</html>
```

```js
document.getElementById('A').addEventListener(
  'click',
  function (e) {
    console.log('When #A is clicked, I shall run first!');
  },
  false,
);

document.getElementById('A').addEventListener(
  'click',
  function (e) {
    console.log('When #A is clicked, I shall run second!');
    e.stopImmediatePropagation();
  },
  false,
);

document.getElementById('A').addEventListener(
  'click',
  function (e) {
    console.log('When #A is clicked, I would have run third, if not for stopImmediatePropagation');
  },
  false,
);
```

The above example will result in the following console output:

```bash
"When #A is clicked, I shall run first!"
"When #A is clicked, I shall run second!"
```

Note that the third event handler never runs due to the fact that the second event handler calls
`e.stopImmediatePropagation()`. If we had instead called `e.stopPropagation()`, the third handler
would still run.

<div style="height: 680px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/stop-immediate-propagation.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

## `event.preventDefault()`

If `stopPropagation()` prevents an event from traveling "downwards" (capturing) or "upwards"
(bubbling), what then, does `preventDefault()` do? It sounds like it does something similar. Does
it?

Not really. While the two are often confused, they actually don't have much to do with each other.
When you see `preventDefault()`, in your head, add the word "action." Think "prevent the default
action."

And what is the default action you may ask? Unfortunately, the answer to that isn't quite as clear
because it's highly dependent on the element + event combination in question. And to make matters
even more confusing, sometimes there is no default action at all!

Let's begin with a very simple example to understand. What do you expect to happen when you click a
link on a web page? Obviously, you expect the browser to navigate to the URL specified by that link.
In this case, the element is an anchor tag and the event is a click event. That combination (`<a>` +
`click`) has a "default action" of navigating to the link's href. What if you wanted to _prevent_
the browser from performing that default action? That is, suppose you want to prevent the browser
from navigating to the URL specified by the `<a>` element's `href` attribute? This is what
`preventDefault()` will do for you. Consider this example:

```html
<a id="avett" href="https://www.theavettbrothers.com/welcome">The Avett Brothers</a>
```

```js
document.getElementById('avett').addEventListener(
  'click',
  function (e) {
    e.preventDefault();
    console.log('Maybe we should just play some of their music right here instead?');
  },
  false,
);
```

You can interactively play with this in the live demo below. Click the link _The Avett Brothers_
and observe the console output (and the fact that you are not redirected to the Avett Brothers website).

<div style="height: 620px; width: 100%;">
  <iframe src="https://silicon-brawny-cardinal.glitch.me/prevent-default.html" loading="lazy" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

Normally, clicking the link labelled The Avett Brothers would result in browsing to
`www.theavettbrothers.com`. In this case though, we've wired up a click event handler to the `<a>`
element and specified that the default action should be prevented. Thus, when a user clicks this
link, they won't be navigated anywhere, and instead the console will simply log "Maybe we should
just play some of their music right here instead?"

What other element/event combinations allow you to prevent the default action? I cannot possibly
list them all, and sometimes you have to just experiment to see. But briefly, here are a few:

- `<form>` element + "submit" event: `preventDefault()` for this combination will prevent a form
  from submitting. This is useful if you want to perform validation and should something fail, you
  can conditionally call preventDefault to stop the form from submitting.

- `<a>` element + "click" event: `preventDefault()` for this combination prevents the browser from
  navigating to the URL specified in the `<a>` element's href attribute.

- `document` + "mousewheel" event: `preventDefault()` for this combination prevents page scrolling
  with the mousewheel (scrolling with keyboard would still work though). <br> <small>↜ This requires
  calling `addEventListener()` with `{ passive: false }`</small>.

- `document` + "keydown" event: `preventDefault()` for this combination is lethal. It renders the
  page largely useless, preventing keyboard scrolling, tabbing, and keyboard highlighting.

- `document` + "mousedown" event: `preventDefault()` for this combination will prevent text
  highlighting with the mouse and any other "default" action that one would invoke with a mouse
  down.

- `<input>` element + "keypress" event: `preventDefault()` for this combination will prevent
  characters typed by the user from reaching the input element (but don't do this; there is
  rarely, if ever, a valid reason for it).

- `document` + "contextmenu" event: `preventDefault()` for this combination prevents the native
  browser context menu from appearing when a user right-clicks or long-presses (or any other way in
  which a context menu might appear).

This is not an exhaustive list by any means, but hopefully it gives you a good idea of how
`preventDefault()` can be used.

## A fun practical joke?

What happens if you `stopPropagation()` _and_ `preventDefault()` in the capturing phase, starting at
the document? Hilarity ensues! The following code snippet will render any web page just about
completely useless:

```js
function preventEverything(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

document.addEventListener('click', preventEverything, true);
document.addEventListener('keydown', preventEverything, true);
document.addEventListener('mousedown', preventEverything, true);
document.addEventListener('contextmenu', preventEverything, true);
document.addEventListener('mousewheel', preventEverything, { capture: true, passive: false });
```

I don't really know why you'd ever want to do this (except maybe to play a joke on someone), but it
is useful to think about what's happening here, and realize why it creates the situation it does.

All events originate at `window`, so in this snippet, we're stopping, dead in their tracks, all
`click`, `keydown`, `mousedown`, `contextmenu`, and `mousewheel` events from ever getting to any
elements that might be listening for them. We also call `stopImmediatePropagation` so that any
handlers wired up to the document after this one, will be thwarted as well.

Note that `stopPropagation()` and `stopImmediatePropagation()` aren't (at least not mostly) what
render the page useless. They simply prevent events from getting where they would otherwise go.

But we also call `preventDefault()`, which you'll recall prevents the default _action_. So any
default actions (like mousewheel scroll, keyboard scroll or highlight or tabbing, link clicking,
context menu display, etc.) are all prevented, thus leaving the page in a fairly useless state.

## Live demos

To explore all the examples from this article again in one place, check out the embedded demo
below.

{% Glitch 'silicon-brawny-cardinal' %}

## Acknowledgements

Hero image by [Tom Wilson](https://unsplash.com/@pastorthomasbwilson) on
[Unsplash](https://unsplash.com/photos/Em2hPK55o8g).
