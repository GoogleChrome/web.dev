---
title: '`content-visibility`: the new CSS property that boosts your rendering performance'
subhead: Improve initial load time by skipping the rendering of offscreen content.
authors:
  - una
  - vladimirlevin
date: 2020-08-05
updated: 2021-03-09
hero: image/admin/lrAkOWYTyGkK2BKXoF9y.jpg
alt: Stylized photo of a half-hidden person.
description: >
    The CSS content-visibility property enables web content rendering
    performance benefits by skipping rendering of off-screen content. This
    article shows you how to leverage this new CSS property for faster initial
    load times, using the auto keyword. You will also learn about the CSS
    Containment Spec and other values for content-visibility that give you more
    control over how your content renders in the browser.
tags:
  - blog
  - css
  - layout
  - performance
feedback:
  - api
---

The
[`content-visibility`](https://drafts.csswg.org/css-contain/#propdef-content-visibility)
property, launching in Chromium 85, might be one of the most impactful new CSS
properties for improving page load performance. `content-visibility` enables the
user agent to skip an element's rendering work, including layout and painting,
until it is needed. Because rendering is skipped, if a large portion of your
content is off-screen, leveraging the `content-visibility` property makes the
initial user load much faster. It also allows for faster interactions with the
on-screen content. Pretty neat.

<figure class="w-figure">
  {% Img src="image/admin/v6WcSx9Fq76lCD0iqFCQ.jpg", alt="demo with figures representing network results", width="800", height="554", class="w-screenshot" %}
  <figcaption class="w-figcaption">In our article demo, applying <code>content-visibility: auto</code> to chunked content areas gives a <b>7x</b> rendering performance boost on initial load. Read on to learn more.</figcaption>
</figure>

## Browser support {: #support }

`content-visibility` relies on primitives within the [the CSS Containment
Spec](http://drafts.csswg.org/css-contain/). While `content-visibility` is only
supported in Chromium 85 for now (and deemed ["worth
prototyping"](https://github.com/mozilla/standards-positions/issues/135) for
Firefox), the Containment Spec is supported in [most modern
browsers](https://caniuse.com/#feat=css-containment).

## CSS Containment {: #containment }

The key and overarching goal of CSS containment is to enable rendering
performance improvements of web content by providing **predictable isolation of
a DOM subtree** from the rest of the page.

Basically a developer can tell a browser what parts of the page are encapsulated
as a set of content, allowing the browsers to reason about the content without
needing to consider state outside of the subtree. Knowing which bits of content
(subtrees) contain isolated content means the browser can make optimization
decisions for page rendering.

There are four types of [CSS
containment](https://developers.google.com/web/updates/2016/06/css-containment),
each a potential value for the `contain` CSS property, which can be combined
together in a space-separated list of values:

- `size`: Size containment on an element ensures that the element's box can be
  laid out without needing to examine its descendants. This means we can
  potentially skip layout of the descendants if all we need is the size of the
  element.
- `layout`: Layout containment means that the descendants do not affect the
  external layout of other boxes on the page. This allows us to potentially skip
  layout of the descendants if all we want to do is lay out other boxes.
- `style`: Style containment ensures that properties which can have effects on
  more than just its descendants don't escape the element (e.g. counters). This
  allows us to potentially skip style computation for the descendants if all we
  want is to compute styles on other elements.
- `paint`: Paint containment ensures that the descendants of the containing box
  don't display outside its bounds. Nothing can visibly overflow the element,
  and if an element is off-screen or otherwise not visible, its descendants will
  also not be visible. This allows us to potentially skip painting the
  descendants if the element is offscreen.

## Skipping rendering work with `content-visibility`

It may be hard to figure out which containment values to use, since browser
optimizations may only kick in when an appropriate set is specified. You can
play around with the values to see [what works
best](https://developers.google.com/web/updates/2016/06/css-containment), or you
can use another CSS property called `content-visibility` to apply the needed
containment automatically. `content-visibility` ensures that you get the largest
performance gains the browser can provide with minimal effort from you as a
developer.

The content-visibility property accepts several values, but `auto` is the one
that provides immediate performance improvements. An element that has
`content-visibility: auto` gains `layout`, `style` and `paint` containment. If
the element is off-screen (and not otherwise relevant to the user—relevant
elements would be the ones that have focus or selection in their subtree), it
also gains `size` containment (and it stops
[painting](https://developers.google.com/web/updates/2018/09/inside-browser-part3#paint)
and
[hit-testing](https://developers.google.com/web/updates/2018/09/inside-browser-part4#finding_the_event_target)
its contents).

What does this mean? In short, if the element is off-screen its descendants are
not rendered. The browser determines the size of the element without considering
any of its contents, and it stops there. Most of the rendering, such as styling
and layout of the element's subtree are skipped.

As the element approaches the viewport, the browser no longer adds the `size`
containment and starts painting and hit-testing the element's content. This
enables the rendering work to be done just in time to be seen by the user.

## A note on accessibility

One of the features of `content-visibility: auto` is that the off-screen content remains available in the document object model and therefore, the accessibility tree (unlike with `visibility: hidden`). This means, that content can be searched for on the page, and navigated to, without waiting for it to load or sacrificing rendering performance.

The flip-side of this, however, is that [landmark](https://www.w3.org/TR/wai-aria-1.1/#landmark_roles) elements with style features such as `display: none` or `visibility: hidden` will also appear in the accessibility tree when off-screen, since the browser will not render these styles until they enter the viewport. To prevent these from being visible in the accessibility tree, potentially causing clutter, be sure to also add `aria-hidden="true"`.

{% Aside 'caution' %}
In Chromium 85-89, off-screen children within `content-visibility: auto` were marked as invisible. In particular, [headings](https://marcysutton.com/content-visibility-accessible-semantics) and landmark roles were not exposed to accessibility tools. In Chromium 90 this was updated so that they are exposed.
{% endAside %}

## Example: a travel blog {: #example }

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/content-visibility/travel_blog.mp4'>
  </video>
  <figcaption>In this example, we baseline our travel blog on the right, and apply <code>content-visibility: auto</code> to chunked areas on the left. The results show rendering times going from <b>232ms</b> to <b>30ms</b> on initial page load.</figcaption>
</figure>

A travel blog typically contains a set of stories with a few pictures, and some
descriptive text. Here is what happens in a typical browser when it navigates to
a travel blog:

1. A part of the page is downloaded from the network, along with any needed
   resources.
2. The browser styles and lays out all of the contents of the page, without
   considering if the content is visible to the user.
3. The browser goes back to step 1 until all of the page and resources are
   downloaded.

In step 2, the browser processes all of the contents looking for things that may
have changed. It updates the style and layout of any new elements, along with
the elements that may have shifted as a result of new updates. This is rendering
work. This takes time.

<figure class="w-figure">
  {% Img src="image/admin/57Zh2hjcXJjJIBSE648j.jpg", alt="A screenshot of a travel blog.", width="800", height="563", class="w-screenshot" %}
  <figcaption class="w-figcaption">An example of a travel blog. See <a href="https://codepen.io/una/pen/rNxEWLo">Demo on Codepen</a></figcaption>
</figure>

Now consider what happens if you put `content-visibility: auto` on each of the
individual stories in the blog. The general loop is the same: the browser
downloads and renders chunks of the page. However, the difference is in the
amount of work that it does in step 2.

With content-visibility, it will style and layout all of the contents that are
currently visible to the user (they are on-screen). However, when processing the
story that is fully off-screen, the browser will skip the rendering work and
only style and layout the element box itself.

The performance of loading this page would be as if it contained full on-screen
stories and empty boxes for each of the off-screen stories. This performs much
better, with *expected reduction of 50% or more* from the rendering cost of
loading. In our example, we see a boost from a **232ms** rendering time to a
**30ms** rendering time. That's a **7x** performance boost.

What is the work that you need to do in order to reap these benefits? First, we
chunk the content into sections:

<figure class="w-figure">
  {% Img src="image/admin/29uexe2kBwIsrAuILPnp.jpg", alt="An annotated screenshot of chunking content into sections with a CSS class.", width="800", height="563", class="w-screenshot" %}
  <figcaption class="w-figcaption">Example of chunking content into sections with the <code>story</code> class applied, to receive <code>content-visibility: auto</code>. See <a href="https://codepen.io/vmpstr/pen/xxZoyMb">Demo on Codepen</a></figcaption>
</figure>

Then, we apply the following style rule to the sections:

```css
.story {
  content-visibility: auto;
  contain-intrinsic-size: 1000px; /* Explained in the next section. */
}
```

{% Aside %} Note that as content moves in and out of visibility, it will start
and stop being rendered as needed. However, this does not mean that the browser
will have to render and re-render the same content over and over again, since
the rendering work is saved when possible. {% endAside %}

### Specifying the natural size of an element with `contain-intrinsic-size`

In order to realize the potential benefits of `content-visibility`, the browser
needs to apply size containment to ensure that the rendering results of contents
do not affect the size of the element in any way. This means that the element
will lay out as if it was empty. If the element does not have a height specified
in a regular block layout, then it will be of 0 height.

This might not be ideal, since the size of the scrollbar will shift, being
reliant on each story having a non-zero height.

Thankfully, CSS provides another property, `contain-intrinsic-size`, which
effectively specifies the natural size of the element *if the element is
affected by size containment*. In our example, we are setting it to `1000px` as
an estimate for the height and width of the sections.

This means it will lay out as if it had a single child of "intrinsic-size"
dimensions, ensuring that your unsized divs still occupy space.
`contain-intrinsic-size` acts as a placeholder size in lieu of rendered content.

## Hiding content with `content-visibility: hidden`

What if you want to keep the content unrendered regardless of whether or not it
is on-screen, while leveraging the benefits of cached rendering state? Enter:
`content-visibility: hidden`.

The `content-visibility: hidden` property gives you all of the same benefits of
unrendered content and cached rendering state as `content-visibility: auto` does
off-screen. However, unlike with `auto`, it does not automatically start to
render on-screen.

This gives you more control, allowing you to hide an element's contents and
later unhide them quickly.

Compare it to other common ways of hiding element's contents:

- `display: none`: hides the element and destroys its rendering state. This
  means unhiding the element is as expensive as rendering a new element with the
  same contents.
- `visibility: hidden`: hides the element and keeps its rendering state. This
  doesn't truly remove the element from the document, as it (and it's subtree)
  still takes up geometric space on the page and can still be clicked on. It
  also updates the rendering state any time it is needed even when hidden.

`content-visibility: hidden`, on the other hand, hides the element while
preserving its rendering state, so, if there are any changes that need to
happen, they only happen when the element is shown again (i.e. the
`content-visibility: hidden` property is removed).

Some great use cases for `content-visibility: hidden` are when implementing
advanced virtual scrollers, and measuring layout.

## Conclusion

`content-visibility` and the CSS Containment Spec mean some exciting performance
boosts are coming right to your CSS file. For more information on these
properties, check out:

- [The CSS Containment Spec](http://drafts.csswg.org/css-contain/)
- [MDN Docs on CSS
  Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- [CSSWG Drafts](https://github.com/w3c/csswg-drafts)
