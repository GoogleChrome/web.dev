---
layout: post
title: Touch and mouse
subhead: Together again for the first time
authors:
  - chriswilson
  - paulkinlan
date: 2013-03-13
tags:
  - blog
---

## Introduction


For close to thirty years, desktop computing experiences have centered around a keyboard and a mouse or trackpad as our main user input devices. Over the last decade, however, smartphones and tablets have brought a new interaction paradigm: touch. With the introduction of touch-enabled Windows 8 machines, and now with the release of the awesome touch-enabled Chromebook Pixel, touch is now becoming part of the expected desktop experience. One of the biggest challenges is building experiences that work not only on touch devices and mouse devices, but also on these devices where the user will use both input methods - sometimes simultaneously!

This article will help you understand how touch capabilities are built into the browser, how you can integrate this new interface mechanism into your existing apps and how touch can play nicely with mouse input.

## The State of Touch in the Web Platform

The iPhone was the first popular platform to have dedicated touch APIs built in to the web browser.  Several other browser vendors have created similar API interfaces built to be compatible with the iOS implementation, which is now described by the ["Touch Events version 1" specification](http://www.w3.org/TR/touch-events/). Touch events are supported by Chrome and Firefox on desktop, and by Safari on iOS and Chrome and the Android browser on Android, as well as other mobile browsers like the Blackberry browser.

My colleague Boris Smus wrote a great [HTML5Rocks tutorial on Touch events](http://www.html5rocks.com/en/mobile/touch/) that is still a good way to get started if you haven’t looked at Touch events before.  In fact, if you haven’t worked with touch events before, go read that article now, before you continue.  Go on, I’ll wait.

All done?  Now that you have a basic grounding in touch events, the challenge with writing touch-enabled interactions is that the touch interactions can be quite a bit different from mouse (and mouse-emulating trackpad and trackball) events - and although touch interfaces typically try to emulate mice, that emulation isn’t perfect or complete; you really need to work through both interaction styles, and may have to support each interface independently.

## Most Importantly: The User May Have Touch And a Mouse

Many developers have built sites that statically detect whether an environment supports touch events, and then make the assumption that they only need to support touch (and not mouse) events.  This is now a faulty assumption - instead, just because touch events are present does not mean the user is primarily using that touch input device.  Devices such as the Chromebook Pixel and some Windows 8 laptops now support BOTH Mouse and Touch input methods, and more will in the near future.  On these devices, it is quite natural for users to use both the mouse and the touch screen to interact with applications, so  "supports touch" is not the same as "doesn’t need mouse support."  You can’t think of the problem as "I have to write two different interaction styles and switch between them," you need to think through how both interactions will work together as well as independently.  On my Chromebook Pixel, I frequently use the trackpad, but I also reach up and touch the screen - on the same application or page, I do whatever feels most natural at the moment.  On the other hand, some touchscreen laptop users will rarely if ever use the touchscreen at all - so the presence of touch input shouldn’t disable or hinder mouse control.

Unfortunately, it can be hard to know if a user’s browser environment supports touch input or not; ideally, a browser on a desktop machine would always indicate support for touch events so a touchscreen display could be attached at any time (e.g. if a touchscreen attached through a [KVM](http://en.wikipedia.org/wiki/KVM_switch) becomes available).  For all these reasons, your applications shouldn’t attempt to switch between touch and mouse - just support both!

{% Aside %}
In IE10 on Windows 8, Microsoft introduced a new model called Pointer Events.  Pointer Events are a unification of Mouse Events and touch input, as well as other input methods such as pen input.  There is [work to standardize the Pointer Event model at the W3C](http://www.w3.org/TR/2013/WD-pointerevents-20130219/), and in the short term, there are libraries out there like [PointerEvents](https://github.com/toolkitchen/PointerEvents) and [Hand.js](http://blogs.msdn.com/b/eternalcoding/archive/2013/01/16/hand-js-a-polyfill-for-supporting-pointer-events-on-every-browser.aspx) that you can use to prototype how Pointer Events could work in your code to remove some of the need to independently support mouse and touch.  For really great touch and mouse interaction, you may need to customize your user experience for mouse and touch separately, but unified event handling can make this easier in many scenarios.  However, there are significant challenges with this model - namely, it requires supporting redundant input models, and it’s not broadly supported yet - and it will take some time to settle down into a solid, cross-browser standard.

In the meantime, the best advice is to support both mouse and touch interaction models.  There are a lot of challenges with simultaneously supporting touch and mouse events, so this article explains those challenges and the strategies to overcome them.  Additionally, some of this advice is just general "implementing touch" advice, so it may be redundant if you are already used to implementing touch in a mobile context.
{% endAside %}

## Supporting Mouse and Touch Together

### #1 - Clicking and Tapping - the "Natural" Order of Things

The first problem is that touch interfaces typically try to emulate mouse clicks - obviously, since touch interfaces need to work on applications that have only interacted with mouse events before!  You can use this as a shortcut - because "click" events will continue to be fired, whether the user clicked with a mouse or tapped their finger on the screen.  However, there are a couple of problems with this shortcut.

First, you have to be careful when designing more advanced touch interactions: when the user uses a mouse it will respond via a click event, but when the user touches the screen both touch and click events will occur.  For a single click the order of events is:

1. touchstart
1. touchmove
1. touchend
1. mouseover
1. mousemove
1. mousedown
1. mouseup
1. click

This, of course, means that if you are processing touch events like touchstart, you need to make sure that you don’t process the corresponding mousedown and/or click event as well.  If you can cancel the touch events (call preventDefault() inside the event handler), then no mouse events will get generated for touch.  One of the most important rules of touch handlers is:

{% Aside 'important' %}
Use preventDefault() inside touch event handlers, so the default mouse-emulation handling doesn’t occur.
{% endAside %}

However, this also prevents other default browser behavior (like scrolling) - although usually you’re handling the touch event entirely in your handler, and you will WANT to disable the default actions.  In general, you’ll either want to handle and cancel all touch events, or avoid having a handler for that event.

Secondly, when a user taps on an element in a web page on a mobile device, pages that haven’t been designed for mobile interaction have a delay of at least 300 milliseconds between the touchstart event and the processing of mouse events (mousedown).  If you have a touch device, you can check out this [example](http://paulkinlan.github.com/touch-patterns/touch-event-order-with-fixed-viewport.html) - or, using Chrome, you can turn on ["Emulate touch events"](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation#emulate-touch-events) in Chrome Developer Tools to help you test touch interfaces on a non-touch system!

This delay is to allow the browser time to determine if the user is performing another gesture - in particular, double-tap zooming.  Obviously, this can be problematic in cases where you want to have instantaneous response to a finger touch.  There is [ongoing work](https://code.google.com/p/chromium/issues/detail?id=169642) to try to limit the scenarios in which this delay occurs automatically.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Chrome for Android</th>
        <th>Android Browser</th>
        <th>Opera Mobile for Android)</th>
        <th>Firefox for Android</th>
        <th>Safari iOS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Non-scalable viewport</td>
        <td>No delay</td>
        <td>300ms</td>
        <td>300ms</td>
        <td>No delay</td>
        <td>300ms</td>
      </tr>
      <tr>
        <td>No Viewport</td>
        <td>300ms</td>
        <td>300ms</td>
        <td>300ms</td>
        <td>300ms</td>
        <td>300ms</td>
      </tr>
    </tbody>
  </table>
</div>

The first and easiest way to avoid this delay is to "tell" the mobile browser that your page is not going to need zooming - which can be done using a fixed viewport, e.g. by inserting into your page:

```html
<meta name="viewport" content="width=device-width,user-scalable=no">
```

This isn’t always appropriate, of course - this disables pinch-zooming, which may be required for accessibility reasons, so use it sparingly if at all (if you do disable user scaling, you may want to provide some other way to increase text readability in your application).  Also, for Chrome on desktop class devices that support touch, and other browsers on mobile platforms when the page has viewports that are not scalable, [this delay does not apply.](http://paulkinlan.github.com/touch-patterns/touch-event-order-no-viewport)

### #2: Mousemove Events Aren’t Fired by Touch

It’s important to note at this point that the emulation of mouse events in a touch interface does not typically extend to emulating mousemove events - so if you build a beautiful mouse-driven control that uses mousemove events, it probably won’t work with a touch device unless you specifically add touchmove handlers too.

Browsers typically automatically implement the appropriate interaction for touch interactions on the HTML controls - so, for example, HTML5 Range controls will just work when you use touch interactions.  However, if you’ve implemented your own controls, they will likely not work on click-and-drag type interactions; in fact, some commonly used libraries (like jQueryUI) do not yet natively support touch interactions in this way (although for jQueryUI, there are several monkey-patch fixes to this issue).  This was one of the first problems I ran into when upgrading my  Web Audio Playground application to work with touch - the sliders were jQueryUI-based, so they did not work with click-and-drag interactions.  I changed over to HTML5 Range controls, and they worked.  Alternately, of course, I could have simply added touchmove handlers to update the sliders, but there’s one problem with that…

### #3: Touchmove and MouseMove Aren’t the Same Thing

A pitfall I've seen a few developers fall into is having touchmove and mousemove handlers call into the same codepaths.  The behavior of these events is very close, but subtly different - in particular, **__touch events always target the element where that touch STARTED, while mouse events target the element currently under the mouse cursor.__**   This is why we have mouseover and mouseout events, but there are no corresponding touchover and touchout events - only touchend. 

The most common way this can bite you is if you happen to remove (or relocate) the element that the user started touching. For example, imagine an image carousel with a touch handler on the entire carousel to support custom scrolling behavior. As available images change, you remove some `<img>` elements and add others. If the user happens to start touching on one of those images and then you remove it, your handler (which is on an ancestor of the img element) will just stop receiving touch events (because they’re being dispatched to a target that’s no longer in the tree) - it'll look like the user is holding their finger in one place even though they may have moved and eventually removed it.

You can of course avoid this problem by avoiding removing elements that have (or have ancestors that have) touch handlers while a touch is active. Alternately, the best guidance is rather than register static touchend/touchmove handlers, wait until you get a touchstart event and then add touchmove/touchend/touchcancel handlers to the **__target__** of the touchstart event (and remove them on end/cancel). This way you'll continue to receive events for the touch even if the target element is moved/removed. You can play with this a little [here](http://www.rbyers.net/eventTest.html) - touch the red box and while holding hit escape to remove it from the DOM.

### #4: Touch and :Hover

The mouse pointer metaphor separated cursor position from actively selecting, and this allowed developers to use hover states to hide and show information that might be pertinent to the users.  However, most touch interfaces right now do not detect a finger "hovering" over a target - so providing semantically important information (e.g. providing "what is this control?" popup) based on hovering is a no-no, unless you also give a touch-friendly way to access this information.  You need to be careful about how you use hovering to relay information to users.

Interestingly enough, though, the CSS :hover pseudoclass CAN be triggered by touch interfaces in some cases - tapping an element makes it :active while the finger is down, and it also acquires the :hover state.  (With Internet Explorer, the :hover is only in effect while the user’s finger is down - other browsers keep the :hover in effect until the next tap or mouse move.) This is a good approach to making pop-out menus work on touch interfaces - a side effect of making an element active is that the :hover state is also applied.  For example:

```html
<style>
img ~ .content {
  display:none;
}

img:hover ~ .content {
  display:block;
}
</style>

<img src="/awesome.png">
<div class="content">This is an awesome picture of me</div>
```

Once another element is tapped the element is no longer active, and the hover state disappears, just as if the user was using a mouse pointer and moved it off the element.  You may wish to wrap the content in an `<a>` element in order to make it a tabstop as well - that way the user can toggle the extra information on a mouse hover or click, a touch tap, or a keypress, with no JavaScript required.  I was pleasantly surprised as I began work to make my [Web Audio Playground](http://webaudioplayground.appspot.com/) to work well with touch interfaces that my pop-out menus already worked well on touch, because I’d used this kind of structure!  

The above method works well for mouse pointer based interfaces, as well as for touch interfaces. This is in contrast to using "title" attributes on hover, which will NOT show up when the element is activated:

```html
<img src="/awesome.png" title="this doesn't show up in touch">
```

{% Aside %}
Additional hover-like semantics you may wish to consider:

- Implement "touch and hold" as a "secondary click".  On many devices - mobile and desktop alike - a touch-and-hold is already used to implement a context menu, so you shouldn’t use your own timer - listen for the oncontextmenu event, and be sure to cancel the default behavior.
- Make the UI take two single touch events to complete the click - the first click will show the hover information, the second will complete the action.
- If you are implementing hover effects as a way to provide help information - "what does this control do" sort of information - you may wish to just provide a "help mode" that toggles on this behavior.
{% endAside %}

### #5: Touch vs. Mouse Precision

While mice have a conceptual disassociation from reality, it turns out that they are extremely accurate, as the underlying operating system generally tracks exact pixel precision for the cursor.  Mobile developers on the other hand have learned that finger touches on a touch screen are not as accurate, mostly because of the size of the surface area of the finger when in contact with the screen (and partly because your fingers obstruct the screen).

Many individuals and companies have done extensive user research on how to design applications and sites that are accommodating of finger based interaction, and many books have been written on the topic.  The basic advice is to increase the size of the touch targets by increasing the padding, and reduce the likelihood of incorrect taps by increasing the margin between elements.  (Margins are not included in the hit detection handling of touch and click events, while padding is.)  One of the primary fixes I had to make to the Web Audio Playground was to increase the sizes of the connection points so they were more easily touched accurately.

Many browser vendors who are handling touch based interfaces have also introduced logic into the browser to help target the correct element when a user touches the screen and reduce the likelihood of incorrect clicks - although this usually only corrects click events, not moves (although Internet Explorer appears to modify mousedown/mousemove/mouseup events as well).

### #6: Keep Touch Handlers Contained, or They’ll Jank Your Scroll

It’s also important to keep touch handlers confined only to the elements where you need them; touch elements can be very high-bandwidth, so it’s important to avoid touch handlers on scrolling elements (as your processing may interfere with browser optimizations for fast jank-free touch scrolling - modern browsers try to scroll on a GPU thread, but this is impossible if they have to check with javascript first to see if each touch event is going to be handled by the app).  You can check out [an example](http://www.rbyers.net/janky-touch-scroll.html) of this behavior.

One piece of guidance to follow to avoid this problem is to make sure that if you are only handling touch events in a small portion of your UI, you only attach touch handlers there (not, e.g., on the `<body>` of the page); in short, limit the scope of your touch handlers as much as possible.

### #7: Multi-touch

The final interesting challenge is that although we’ve been referring to it as "Touch" user interface, nearly universally the support is actually for Multi-touch - that is, the APIs provide more than one touch input at a time.  As you begin to support touch in your applications, you should consider how multiple touches might affect your application.

If you have been building apps primarily driven by mouse, then you are used to building with at most one cursor point - systems don’t typically support multiple mice cursors.  For many applications, you will be just mapping touch events to a single cursor interface, but most of the hardware that we have seen for desktop touch input can handle at least 2 simultaneous inputs, and most new hardware appears to support at least 5 simultaneous inputs.  For developing an [onscreen piano keyboard](http://webaudiodemos.appspot.com/midi-synth/index.html), of course, you would want to be able to support multiple simultaneous touch inputs.

The currently implemented W3C Touch APIs have no API to determine how many touch points the hardware supports, so you’ll have to use your best estimation for how many touch points your users will want - or, of course, pay attention to how many touch points you see in practice and adapt.  For example, in a piano application, if you never see more than two touch points you may want to add some "chords" UI.  The PointerEvents API  does have an API to determine the capabilities of the device.

## Touching Up

Hopefully this article has given you some guidance on common challenges in implementing touch alongside mouse interactions.  More important than any other advice, of course, is that you need to test your app on mobile, tablet, and combined mouse-and-touch desktop environments.  If you don’t have touch+mouse hardware, use Chrome’s "[Emulate touch events](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation#emulate-touch-events)" to help you test the different scenarios.

It’s not only possible, but relatively easy following these pieces of guidance, to build engaging interactive experiences that work well with touch input, mouse input, and even both styles of interaction at the same time.
