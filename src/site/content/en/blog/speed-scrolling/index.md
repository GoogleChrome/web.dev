---
layout: post
title: Scrolling performance
authors:
  - paullewis
date: 2012-12-20
tags:
  - blog
---

## Introduction

Scrolling doesn't immediately seem like something you'd think about from a performance perspective. After all, your content is styled and all your assets are loading or loaded, so why all of a sudden might we care about what happens when you scroll? The simple reason is that whenever you scroll the browser needs to draw your site or application to the screen. That means we have the opportunity to minimize the work the browser has to do to get everything drawn and, by extension, maximize the page performance.

Having smooth scrolling is actually an often overlooked but crucial part of a user's experience when they use your application. When you get the scrolling performance right your application will feel silky smooth and enjoyable to use rather than a clunky and unnatural experience.

## The Specifics of Scrolling

Let's take a look at what kinds of things happen when you scroll. To understand that we have to take a very brief look into how the browser actually draws things to the screen. Everything starts with the DOM tree, which is essentially all the elements within the page. The browser takes a look at your styled DOM and it finds things that it thinks will look the same when you scroll. It then groups these elements together and takes a picture of them, which is called a layer. Each of these layers needs to be painted and rasterized to a texture and then composited together to the image that you see on screen.

If you're interested in more details of Chrome's rendering check out this [summary article](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome).

Whenever you scroll a page the browser will probably need to paint some of the pixels in those layers (sometimes called compositor layers). By grouping things into layers we need only update that specific layer's texture when something inside that specific layer has changed, and where we can we want to only paint and rasterize the part of a render layer's texture that's been damaged rather than the whole thing. Obviously if you have things moving as you scroll, like in a parallax site, then you're potentially damaging a large area, possibly across multiple layers, and this can result in a lot of expensive paint work.

In short, **less painting is better**.

## Diagnosing Your Paints

So much for the theory, let's take a look how this works out in practice. If you open up the Timeline panel, set it to frame mode, hit the record button and then start scrolling, you should see a bunch of bars colored green. I've recorded a video showing you what to do, and what you should see:

{% YouTube id="KCtOt9OXvAM" %}

In the list below the timeline you will see a whole heap of paint records. This is Chrome painting and rasterizing the textures for the page's compositor layers. (After all the painting is done you may also see some composite layer records which would be all those updated layers being composited ready for display on screen.)

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/EId9aZLG5Wb06ptQkQx7.png", alt="Chrome DevTools: Paint Records", width="800", height="570" %}
  <figcaption>Paint records in Chrome's DevTools</figcaption>
</figure>

Next to each paint record you will see the dimensions of the painted area and, if you roll over it, Chrome will highlight the area in the page that had to be repainted. Another way to see the areas that had be repainted is to enable “Show paint rectangles” in Chrome's DevTools settings, which is accessed through that little cog icon in the bottom right corner. This is the first indicator that you get about how your page is performing when you scroll. A reminder: **you should be looking for the smallest possible paint areas.**

With the side menu visible you'll see that the paint regions are essentially the whole screen, and performance really suffers. The reason for this is that Chrome does a union of damaged regions. In this case the thin, 100% wide strip along the bottom for the content that just came into view and the 100% high side menu it has to draw into the same compositor layer, all of which is unioned to a region **100% wide and 100% high**. If you disable the side menu using the checkbox at the top and scroll again you'll notice that the only repainting work that needs to be performed is the thin strip along the bottom, and it all happens much more quickly.

If you want to see a real world example of this in action, try loading [Google+](https://plus.google.com/) and then change the side navigation over from `position: fixed` to `position: absolute`. Of course this changes the behaviour of the site, but the point here is you can see a real performance boost by switching styles. Your reaction to all this might be to decide that `position:fixed` should never be used, but actually all of this depends on context and requirements. There is a time and place for most things, the important thing is to be able to measure and understand the impact of your decisions.

## Image Resizes

In addition to the basic paint records we actually get a little more information for some of them, specifically relating to images. If you resize the page down and up while recording you'll see that some of the paint records will allow you to twizzle down for more details. If you do just that you should see some image resize records. This is exactly what it says on the tin: the browser is having to resize the image as part of its paint work.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/tZBMN4GD1yStnWDSxTaS.png", alt="Chrome DevTools: Resize Records", width="800", height="559" %}
  <figcaption>Image Resize records in Chrome's DevTools</figcaption>
</figure>

If you're sending large images to a device and then scaling them down using CSS or image dimension attributes, you're more likely to see this happen. Of course the amount by which the browser has to rescale images, and the frequency with which it has to do this, is going to affect your page's performance as they happen on the main browser thread, and therefore block other work from taking place.

The case for sending images that can be rendered without any resizing, therefore, is very strong. As an interesting side note to this, there are situations where scaling operations are unavoidable, particularly on mobile where the zoom is easily changed from 1 by the user when they pinch-to-zoom. In those cases there's little you can do, but it's good to know it can (and probably will) happen. On the plus side, things are always improving in the browser and in particular rendering is a hot topic, so you can expect things to get much better over the coming months.

So with all that said, there are other things that may impact your scrolling performance:

- Expensive Styles
- Reflows and repaints
- Failing to debouncing your scroll events

Let's talk about each of these in a little more detail.

## Expensive Styles

So the first thing to say is that not all styles are created equal, some effects like box-shadow are oft-quoted as being particularly expensive from a rendering point of view, and this is simply because their associated draw code takes a long time to run compared to other styles. This means that if you have expensive styles that require repainting often you're likely to take a hit on performance. The second thing to say is that nothing stays the same, so one slow style today could be optimised and fast tomorrow, and it differs from browser to browser. The key here is to leverage developer tools like we did above to identify where the bottleneck is coming from and then see how you can reduce the browser's workload.

At [Google I/O 2012](https://developers.google.com/events/io) Nat Duca and Tom Wiltzius did a great talk on jank busting your rendering in Chrome, and there are a heap of golden tips in there, including expensive styles and how to measure their impact.

{% YouTube id="hAzhayTnhEI" %}

## Reflows and Repaints

Whenever you request the `offsetTop` property of an element in JavaScript you immediately give the browser a lot of work as it now has to go off and layout the page so it can give you the correct answer. This process is called reflowing. If we then change another property of the element based on the `offsetTop` value the element (and consequently its compositor layer) will need to be repainted, which may be expensive. It also has the knock-on effect that we invalidated that `offsetTop` calculation by repainting, since as far as the browser is concerned something changed.

The real problem comes when you scale that up to a collection of elements. If we calculate each element's position shortly followed by repainting it, we are forcing the browser into an expensive and unnecessary reflow-repaint cycle. In these situations, what we need to do is limit avoid this cycle by doing things in two passes: in our first pass we simply collect the `offsetTop` values, and the second will do the visual updates. By doing it this way we avoid the need to repeatedly recalculate the positions of elements in the page and, assuming we use `requestAnimationFrame`, we will schedule the visual updates at the optimal time for the browser.

It's also worth mentioning that there are [other operations besides offsetTop](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html) that will cause a reflow operation to take place, so it's worth checking those out so you know to be careful.

## Debouncing Scroll Events

Let's say you're building a large parallax scrolling site. Your natural inclination may be to do visual updates when you get the scroll event. The major problem here is that the scroll events are not timed to the visual updates of the browser, i.e. in a `requestAnimationFrame` callback, so you run the risk of performing multiple updates inside a single render frame. If your updates are expensive, which they are more likely to be if you're building something like a parallax site (lots of damaged areas, lots of painting and compositing) then doing these more times than necessary is a bad idea. To solve this problem you need to debounce your scroll events. You do this by simply storing the last scroll value in a variable whenever you receive a scroll event, and then you perform your visual updates in a `requestAnimationFrame`, making use of the last known value. This means that the browser can schedule the visual updates at the correct time, and we did no more work than was absolutely necessary inside each frame.

We covered [reflow / repaint cycles in a previous article](http://www.html5rocks.com/en/tutorials/speed/animations/), so that's worth checking out if you want to know more.

## Conclusion

Now you know how to interpret Chrome's DevTools timeline to assess your application's performance during a scroll. It's worth reiterating that performance characteristics change all the time, so while there are some things that are faster than others today, they do vary and change over time, and it's key to understand how to interpret the readings you see so that you can adapt your approach accordingly.

You should always check your **actual** performance data in your developer tools. It's tempting to compare changes by eye, but the results may not be immediately obvious. So don't guess it, test it.

## More reading

If you're interested in browser internals, or more tips for avoiding rendering performance bottlenecks, check these out.

1. [Tali Garsiel and Paul Irish on how browsers work](http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)
1. [A summary of hardware compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
1. [Paul Lewis on debouncing scroll events and reflow / repaint cycles](http://www.html5rocks.com/en/tutorials/speed/animations/)
1. [Tom Wiltzius on jank busting for better rendering performance](http://www.html5rocks.com/en/tutorials/speed/rendering/)
