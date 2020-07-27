---
title: 'CSS Content Visibility: the most impactful performance boost CSS can give you'
subhead: TBD
authors:
  - vladimirlevin
  - una
date: 2020-08-05
hero: hero.jpg
alt: Stylized photo of a half-hidden person.
description: TBD
tags:
  - blog
  - css
---

The [`content-visibility`](https://drafts.csswg.org/css-contain/#propdef-content-visibility) property might be one of the most impactful new CSS properties for improving page load performance. `content-visibility` enables the user agent to skip an element's rendering work, including layout and painting, until it is needed. If a large portion of your content is off-screen, leveraging the `content-visibility` property allows the browser to skip the rendering working for this content, making the initial user load much faster. Additionally, it allows for faster interactions with the on-screen content. Pretty neat.

`content-visibility` relies on primitives within the [the CSS Containment Spec](http://drafts.csswg.org/css-contain/). So, what exactly is this spec? Let's dive in.

## CSS Containment {: #containment }

 -- Caniuse Image Here: caniuse.com/#feat=css-containment --

The key and overarching goal of CSS containment is to enable rendering performance improvements of web content by providing *predictable isolation of a DOM subtree* from the rest of the page.

Basically a developer can tell a browser what parts of the page are encapsulated as a set of content, allowing the browsers to reason about the content without needing to consider state outside of the subtree. Knowing which bits of content (subtrees) contain isolated content means the browser can make optimization decisions for page rendering.

There are four types of [CSS containment](https://developers.google.com/web/updates/2016/06/css-containment), each a potential value for the `contain` CSS property. You can also combine them individually or together in a space-separated list of values:

- `size`: Size containment ensures that the containing box can be laid out without needing to examine its children. The parent sets the geometric size independent of its contents.
- `layout`: Layout containment means that the subtree does not affect the external layout of other boxes on the page, and nothing external affects its internal layout. 
- `style`: Style containment ensures that properties which can have effects on more than just its descendants don't escape the element (e.g. counters).
- `paint`: Paint containment ensures that the descendants of the containing box don't display outside its bounds. Nothing can visibly overflow the element, and if an element is off-screen or otherwise not visible, its descendants will also not be visible.

## `content-visibility`

It may be hard to figure out which containment values to use, since browser optimizations may only kick in when an appropriate set is specified. You can play around with the values to see [what works best](https://developers.google.com/web/updates/2016/06/css-containment), or you can use another CSS property called `content-visibility` to apply the needed containment automatically. `content-visibility` was created to ensure that you get the largest performance gains the browser can provide with least effort. 

### `content-visibility: auto` {: #auto }

The content-visibility property accepts several values, but `auto` is the one that provides immediate performance improvements. An element that has `content-visibility: auto` gains `layout`, `style` and `paint` containment. If the element is off-screen (and not otherwise relevant to the user—relevant elements would be the ones that have focus or selection in their subtree), it also gains `size` containment (it stops [painting](https://developers.google.com/web/updates/2018/09/inside-browser-part3#paint) and [hit-testing](https://developers.google.com/web/updates/2018/09/inside-browser-part4#finding_the_event_target) its contents).

What does this mean? In short, if the element is off-screen it is not rendered. The browser determines the size of the element without considering any of its contents, and it stops there. Most of the rendering, such as styling and layout of the element's subtree are skipped.



As the element approaches the viewport, the browser no longer adds the `size` containment and starts painting and hit-testing the element's content. This enables the rendering work to be done just in time to be seen by the user.

#### Example: a travel blog {: #example }

--- diagram / screenshot of a mock travel blog ---

A travel blog typically contains a set of stories. Each story has a few pictures, and some descriptive text. Here is what happens in a typical browser when it navigates to a travel blog:
A part of the page is downloaded from the network, along with any needed resources.
The browser styles and lays out all of the contents of the page, without considering if the content is visible to the user.
The browser goes back to step 1 until all of the page and resources are downloaded.

In step 2, the browser processes all of the contents looking for things that may have changed. It updates the style and layout of any new elements, along with the elements that may have shifted as a result of new updates. This is rendering work. This takes time.

--- diagram ---

Now consider what happens if you put `content-visibility: auto` on each of the individual stories in the blog. The general loop is the same: the browser downloads and renders chunks of the page. However, the difference is in the amount of work that it does in step 2.

With content-visibility, it will style and layout all of the contents that are currently visible to the user (they are on-screen). However, when processing the story that is fully off-screen, the browser will skip the rendering work and only style and layout the element box itself.

--- diagram ---

The performance of loading this page would be as if it contained full on-screen stories and empty boxes for each of the off-screen stories. This performs much better, with *expected reduction of 50% or more* from the rendering cost of loading.

What is the work that you need to do in order to reap these benefits? The addition of the following style rule:

```css
.story {
  content-visibility: auto;
  contain-intrinsic-size: 100px 500px; /* Explained in the next section. */
}
```

{% Aside %}
Note that as content moves in and out of visibility, it will start and stop being rendered as needed. However, this does not mean that the browser will have to render and re-render the same content over and over again.
{% endAside %}

##### `contain-intrinsic-size`

In order to realize the potential benefits of `content-visibility`, the browser needs to apply size containment to ensure that the rendering results of contents do not affect the size of the element in any way.

This means that the element will lay out as if it was empty. If the element does not have a height specified in a regular block layout, then it will be of 0 height. 

This might not be ideal, since the size of the scrollbar will shift, being reliant on each story having a non-zero height.

Thankfully, CSS provides another property, `contain-intrinsic-size`, which effectively specifies the natural size of the element *if the element is affected by size containment*.

This means it will lay out as if it had a single child of "intrinsic-size" dimensions, ensuring that your unsized divs still occupy space. `contain-intrinsic-size` acts as a placeholder size in lieu of rendered content.



### `content-visibility: hidden`

What if you want to keep the content unrendered regardless of whether or not it is on-screen, while leveraging the benefits of cached rendering state? Enter:  `content-visibility: hidden`.

The `content-visibility: hidden` property gives you all of the same benefits of unrendered content and cached rendering state as `content-visibility: auto` does off-screen. However, unlike with `auto`, it does not automatically start to render on-screen. 

This gives you more control, allowing you to hide an element's contents and later unhide them quickly. 

Compare it to other common ways of hiding element's contents:

- `display: none`: hides the element and destroys its rendering state. This means unhiding the element is as expensive as rendering a new element with the same contents.
- `visibility: hidden`: hides the element and keeps its rendering state. This doesn't truly remove the element from the document, as it (and it's subtree) still takes up geometric space on the page and can still be clicked on. It also updates the rendering state any time it is needed even when hidden.

`content-visibility: hidden`, on the other hand, hides the element while preserving its rendering state, so, if there are any changes that need to happen, they only happen when the element is shown again (i.e. the `content-visibility: hidden` property is removed).

Some great use cases for `content-visibility: hidden` are when implementing advanced virtual scrollers, and measuring layout.

## Conclusion

`content-visibility` and the CSS containment spec mean some exciting performance boosts are coming right to your CSS file. For more information on these properties, check out:

- [The CSS Containment Spec](http://drafts.csswg.org/css-contain/)
- [CSSWG Drafts](https://github.com/w3c/csswg-drafts)