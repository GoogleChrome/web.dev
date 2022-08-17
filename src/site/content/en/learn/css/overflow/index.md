---
title: Overflow
description: >
  Overflow is how you deal with content that doesn’t fit in a set parent size. In this module, you’ll think outside the box, and learn how to style overflowing content.
audio:
  title: 'The CSS Podcast - 034: Overflow'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP034_v1.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - emmatwersky
date: 2021-11-09
tags:
  - css
---

When content extends beyond its parent, there are many options for how you can handle it. You can scroll to add additional space, clip the overflowing edges, indicate the cut-off with an ellipsis, and so much more. Overflow is especially important to consider when developing for phone applications and multiple screen sizes.

{% Codepen {
  user: 'web-dot-dev',
  id: 'LYjEjWZ',
  tab: 'result'
} %}

There are two different clipping options in CSS; `text-overflow` will help with individual lines of text, and the `overflow` properties will help control overflow in the box model.

## Single line overflow with `text-overflow`

Use the [`text-overflow`](https://developer.mozilla.org/docs/Web/CSS/text-overflow) property on any element that contains text node(s), for example a paragraph, `<p>`. It specifies how the text appears when it doesn’t fit in the available space of the element. All viewable HTML text on a page is in [text nodes](https://developer.mozilla.org/docs/Web/API/Text). To use `text-overflow` you need a single unwrapped line of text, so you must also set `overflow` to `hidden` and have a `white-space` value that prevents wrapping.

```css
p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;   
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNwQXyN',
  tab: 'result'
} %}

## Using overflow properties

Overflow properties are set on an element to control what happens when its children need more space than it has available. This can be intentional, like in an interactive map like Google Maps, where a user pans around a large image clipped to a specific size. It can also be unintentional like in a chat application where the user types a lengthy message that doesn’t fit in the text bubble. 

{% Codepen {
  user: 'web-dot-dev',
  id: 'KKvwvXE',
  tab: 'result'
} %}

You can think of the overflow in two parts. The parent element has a firmly constrained space that will not change. You can think of this as a window. The child elements are content that want more space from the parent. You can think of this as what you are looking through the window at. Managing overflow will help guide how the window frames this content.

{% Codepen {
  user: 'web-dot-dev',
  id: 'xxrmxOm',
  tab: 'result'
} %}

### Scrolling on the vertical and horizontal axis

The `overflow-y` property controls physical overflow along the vertical axis of the device viewport, therefore scrolling up and down.

The `overflow-x` property controls overflow along the horizontal axis of the device viewport, therefore scrolling left and right.

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzQdzoG',
  tab: 'css,result'
} %}

### Logical properties for scroll direction

The [`overflow-inline`](https://developer.mozilla.org/docs/Web/CSS/overflow-inline) and [`overflow-block`](https://developer.mozilla.org/docs/Web/CSS/overflow-block) properties set the overflow based on the document direction and writing mode. 

{% Aside %}
`overflow-inline` is currently only supported in Firefox 69+. See the support table on [MDN](https://developer.mozilla.org/docs/Web/CSS/overflow-inline#browser_compatibility).
{% endAside %}

### The `overflow` shorthand

The [`overflow`](https://developer.mozilla.org/docs/Web/CSS/overflow) shorthand sets both `overflow-x` and `overflow-y` styles in one line:

```css
overflow: hidden scroll;
```

If two keywords are specified, the first applies to `overflow-x` and the second to `overflow-y`. Otherwise, both `overflow-x` and `overflow-y` use the same value.

#### Values

Let's take a closer look at the [values and keywords](https://developer.mozilla.org/docs/Web/CSS/overflow#values) available for the `overflow` properties.

`overflow: visible` (default)
: Without setting the property, `overflow: visible` is the default value for the web. This ensures that content is never unintentionally hidden and follows the core tenets of "never hide content" or "safe layouts of precise layouts".

`overflow: hidden`
: With `overflow: hidden` content is clipped in the specified direction, and no scrollbars are provided to show it.

`overflow: scroll`
: `overflow: scroll` enables scrollbars to allow users to scroll through content. Even if content isn't currently overflowing, scrollbars will be present. This is a great way to reduce future layout shift if a container may be scrollable in the future based, for example, on resize, and visually prepare the user for scrollable areas.

`overflow: clip`
: Like `overflow: hidden`, the content with `overflow: clip` is clipped to the element's padding box. The difference between `clip` and `hidden` is that the `clip` keyword also forbids all scrolling, including programmatic scrolling.
 
`overflow: auto`
: Finally, the value most commonly used, `overflow: auto`. This respects the user's preferences and shows scrollbars if needed, but hides them by default, and gives responsibility for scrolling to the user and browser.

{% Codepen {
  user: 'web-dot-dev',
  id: 'gORZaaa',
  tab: 'result'
} %}

{% Aside %}
Using the `overflow` property with a value other than `visible` creates a [block formatting context](https://developer.mozilla.org/docs/Web/Guide/CSS/Block_formatting_context).
{% endAside %}

## Scrolling and overflow

Many of these `overflow` behaviors introduce a scrollbar, but there’s a few specific scroll behaviors and properties that can help you control scrolling on your overflow container. 

### Scrolling and accessibility

It's important to make sure that the scrollable area can accept focus so that a keyboard user can tab to the box, then use the arrow keys to scroll. 

To allow a scrolling box to accept focus add `tabindex="0"`, a name with the [`aria-labelledby`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) attribute, and an appropriate `role` attribute. For example:

```html
<div tabindex="0" role="region" aria-labelledby="id-of-descriptive-text">
    content
</div>
```

CSS can then be used to indicate that the box has focus, using the `outline` property to give a visual clue that it will now be scrollable.

In [Using CSS to Enforce Accessibility](https://adrianroselli.com/2021/06/using-css-to-enforce-accessibility.html) Adrian Roselli demonstrates how CSS can help prevent accessibility regressions. For example, to only turn on scrolling and add the focus indicator if the correct attributes are used. The following rules will only make the box scrollable if it has a `tabindex`, `aria-labelledby`, and `role` attribute.

```css
[role][aria-labelledby][tabindex] {
  overflow: auto;
}

[role][aria-labelledby][tabindex]:focus {
  outline: .1em solid blue;
}
```

### Scrollbar positioning within the box model

Scroll bars take up space within the padding box and can compete for space if `inline` and not `overlayed`. The [box model module](/learn/css/box-model/#the-areas-of-the-box-model) expands more on this potential source of layout shift.

{% Codepen {
  user: 'web-dot-dev',
  id: 'BaReoEV',
  tab: 'result'
} %}

### root-scroller vs implicit-scroller

You may notice that some scrollers have a pull-to-refresh behavior and other special behaviors, especially when developing for mobile and hybrid applications. This scroll behavior happens on the root scroller. There is only ever one root scroller on a page. By default, the [documentElement](https://developer.mozilla.org/docs/Web/API/Document/documentElement) is the page's root scroller, however, by changing which element is the root scroller, the special behaviors can be applied to scrollers other than the documentElement, we call this new scroller the implicit root scroller.

To create a root scroller, you can use something called *scroller promotion* by positioning a container as fixed, ensuring it covers the entire viewport and is z-index on top with a scroller. Experience a root scroller vs a nested implicit scroller [here](https://cdpn.io/web-dot-dev/debug/dyzPzwz).

<figure>
  {% Video
    src="video/dQwiPAoChjTYzXYCNg6U6Tsnr3x1/sn1cOusFy18gRkZroAET.mp4",
    autoplay="true",
    loop="true",
    width="380",
    muted="true"
  %}
  <figcaption>
    The video shows a root scroller with bounce behavior and new styling features, <br>
    compared to scrolling an implicit scroller with no enhanced scroll behavior. 
  </figcaption>
</figure>

### scroll-behavior

`scroll-behavior` allows you to opt into browser-controlled scrolling to elements. This allows you to specify how in-page navigation like `.scrollTo()` or links are handled.

This is especially useful when used with [prefers-reduced-motion](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion) to specify scroll behavior based on user preference.

```css
@media (prefers-reduced-motion: no-preference) {
  .scroll-view {
    scroll-behavior: auto;
  }
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNwJgae',
  tab: 'result'
} %}

### overscroll-behavior

If you’ve ever reached the end of a modal overlay, then continued scrolling and had the page behind the overlay move, this is the scroll chaining, or bubbling up to the parent scroll container. The [`overscroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior) property allows you to prevent overflow scrolling leaking into a parent container (called scroll chaining).

{% Codepen {
  user: 'web-dot-dev',
  id: 'powqJQe',
  tab: 'result'
} %}

{% Assessment 'overflow' %}

## Resources

[Overflow And Data Loss In CSS from Smashing Magazine](https://www.smashingmagazine.com/2019/09/overflow-data-loss-css/)

