---
layout: post
title: Avoiding Unnecessary Paints - Animated GIF Edition
date: 2011-10-21
authors:
  - paullewis
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Avoiding paints is critical to achieving a silky smooth frame rate, especially on mobile. Sometimes, however, paints crop up in the most unusual of places. This article looks at why animated GIFs can cause unnecessary paints to occur, and the remarkably simple fix you can apply.

{% Aside %}
Last time we looked at ways to [avoid hover effects during scrolls](http://www.html5rocks.com/en/tutorials/speed/unnecessary-paints/). If you've not seen that, check it out now!
{% endAside %}

## Layers of loveliness

As you probably know, modern browsers may paint groups of DOM elements into separate "images", called layers. Sometimes there's one layer for the entire page, sometimes there are hundreds or  in rare cases - thousands!

When DOM elements are grouped together into a layer and one of the elements changes visually, we end up having to paint not just the changed element, but __all the other elements in the layer that overlap the changed element as well__. Painting one thing on top of another results in the overwritten pixels being effectively "lost" forever; if you want the original pixels back you need to repaint them.

Sometimes, therefore, we want to isolate one element from the others so that when it gets painted we won't need to repaint the other elements that __haven't__ changed. For example, when you combine a fixed page header with scrollable content, you have to repaint the header each time the content scrolls, as well as the newly visible content. By placing the header in a separate layer, the browser can optimize scrolling. When you scroll, the browser can move the layers around - probably with the help of the GPU - and avoid repainting either layer.

Each additional layer increases memory consumption and adds performance overhead, so the goal is to group the page into as few layers as possible while maintaining good performance.

{% Aside %}
If you want a more detailed breakdown of how layers are created and used definitely check out [Tom Wiltzius's intro to the subject](http://www.html5rocks.com/en/tutorials/speed/layers/).
{% endAside %}

## What does this all have to do with animated GIFs?

Well let's have a look at this picture:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Er8KGGjUYDusN9vNDZfH.jpg", alt="A web app broken down into four layers.", width="800", height="532" %}
  <figcaption>Figure 1: A web app broken down into four layers.</figcaption>
</figure>

This is a potential layer setup for a simple app. There are four layers here: three of them (layers 2 to 4) are interface elements; the back layer is a loader, which happens to be an animated GIF. In the normal flow you show the loader (layer 1) while your app loads, then as everything finishes you would show the other layers. But here's the key: __you need to hide the animated GIF.__

## But why do I need to hide it?!

Good question. In a perfect world the browser would simply check the GIF’s visibility for you and avoid painting automatically. Unfortunately, checking whether the animated GIF is obscured or visible on the screen is typically __more__ expensive than simply painting it, so it gets painted.

In the best case the GIF is in its own layer and the browser only has to paint and upload it to the GPU. But in the worst case all your elements might be grouped into a single layer and the browser has to repaint __every single element__. And, when it’s done, it still needs to upload everything to the GPU. All of this is work occurs for every GIF frame, despite the fact that the user can’t even see the GIF!

On desktops you can probably get away with this kind of painting behavior because the CPUs and GPUs are more powerful, and there's plenty of bandwidth for transferring data between the two. On mobile, however, painting is extremely expensive so you must take great care.

## Which browsers does this affect?

As is often the way, behaviors differ between browsers. Today Chrome, Safari and Opera all repaint, even if the GIF is obscured. Firefox, on the other hand, figures out that the GIF is obscured and doesn’t need to be repainted. Internet Explorer remains something of a black box, and even in IE11 - since the F12 tools are still being developed - there is no indication as to whether or not any repainting is taking place.

## How can I tell if I have this problem?

The easiest way is to use "Show paint rectangles" in Chrome DevTools. Load DevTools and press the cog in the lower right corner ({% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Q1K5jZRASU3Q7aTfR4p9.png", alt="Cog icon", width="22", height="21" %}) and choose **Show paint rectangles** under the **Rendering** section.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/fceVMJ0tb0ZewvAcF5PP.png", alt="Enabling Show paint rectangles inside Chrome DevTools", width="366", height="59" %}
  <figcaption>Figure 2: Enabling Show paint rectangles inside Chrome DevTools.</figcaption>
</figure>

Now all you need to do is look for a red rectangle like this:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/vysbt6HCy7AFVxbZg72s.png", alt="DevTools’ Show Paint Rectangles hints at animated GIF problems with a red rectangle.", width="300", height="500" %}
  <figcaption>Figure 3: DevTools’ Show Paint Rectangles hints at animated GIF problems with a red rectangle.</figcaption>
</figure>

The little red box on the screen shows that Chrome is repainting something. You know that there’s a loader GIF hidden behind the other elements, so when you see a red box like this you need to hide the visible elements and check if you have left the animated GIF spinning away. If you have then you need to pop some CSS or JavaScript in place to apply `display: none` or `visibility: hidden` to it or its parent element. Of course if it's just a background image then you should make sure to remove it.

If you want to see an example of this behavior in a live site, check out [Allegro](http://allegro.pl/listing/listing.php?string=phone), where each product’s image has a loader GIF that is obscured rather than explicitly hidden.

## Conclusion

Achieving 60fps means doing __only__ what's needed to render the page and no more. Removing excess paints is a critical step in achieving this goal. Animated GIFs that are left running can trigger unnecessary paints, something which you can find and debug easily with DevTools' Show paint rectangles tool.

Now, you didn't leave that animated kitten loader GIF running forever, did you?
