---
title: Chromium lands Flexbox `gap`
subhead: The CSS `gap` property is here for Chromium's CSS Flexbox and Multi-Column layout engines.
authors:
  - adamargyle
  - dgrogan
description: The CSS `gap` property is here for Chromium's CSS Flexbox and Multi-Column layout engines.
date: 2020-05-07
updated: 2020-06-19
hero: image/admin/arR9d29YxN1N5Rak6OH6.jpg
alt: A brick wall with gaps.
feedback:
  - api
---

### Browser compatibility

At the time of writing `gap` is supported in desktop Firefox 63, Firefox for Android 63,
and Chromium 84 (desktop and Android). See
[Browser compatibility](https://developer.mozilla.org/docs/Web/CSS/gap#Browser_compatibility)
for updates.

## CSS Gap

{% Aside 'key-term' %}
`gap` is the spacing *between children*. You may have heard of this type of spacing being
called "gutters" or "alleys". It's space only where the children box edges touch.
{% endAside %}

`gap` is [flow relative](https://www.w3.org/TR/css-logical-1/#intro), meaning it changes
dynamically based on the direction of content flow. For example, `gap` will automatically
adjust for the different `writing-mode` or `direction` values that you set for your
international users. This significantly eases the burden of spacing challenges for
the component and CSS author. **Less code scaling further.**

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/flexbox-gap/gap-i18n.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/flexbox-gap/gap-i18n.mp4">
  </video>
  <figcaption class="w-figcaption">
    Gap demonstrating localization support, as it handles changes to direction and writing-mode:
    <a href="https://codepen.io/argyleink/pen/MWaoZJM">Codepen</a> |
    <a href="https://twitter.com/argyleink/status/1254794309263491072?s=20">Tweet</a>
  </figcaption>
</figure>

### Usage
`gap` accepts any CSS [length](https://drafts.csswg.org/css-values-4/#lengths)
or [percentage](https://www.w3.org/TR/css-values-3/#percentages) as a value.

```css
.gap-example {
  display: grid;
  gap: 10px;
  gap: 2ch;
  gap: 5%;
  gap: 1em;
  gap: 3vmax;
}
```

<br>

Gap can be passed 1 length, which will be used for both row and column.

<div class="w-columns">
{% Compare 'better', 'Shorthand' %}
```css
.grid {
  display: grid;
  gap: 10px;
}
```

{% CompareCaption %}
Set both rows and columns **together** at once
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Expanded' %}
```css/2-3
.grid {
  display: grid;
  row-gap: 10px;
  column-gap: 10px;
}
```

{% endCompare %}
</div>

<br>

Gap can be passed 2 lengths, which will be used for row and column.

<div class="w-columns">
{% Compare 'better', 'Shorthand' %}
```css
.grid {
  display: grid;
  gap: 10px 5%;
}
```

{% CompareCaption %}
Set both rows and columns **separately** at once
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Expanded' %}
```css/2-3
.grid {
  display: grid;
  row-gap: 10px;
  column-gap: 5%;
}
```

{% endCompare %}
</div>


## Flexbox `gap`

Before `gap` was in Flexbox, strategies involved negative margins, complex selectors,
`:last` or `:first` type pseudo-class selectors, or other means to manage the space
of a dynamically layed-out and wrapping set of children.

### Previous Attempts
The following are patterns that folks have used to get gap-like spacing.

<div class="w-columns">
{% Compare 'worse', 'pseudo-class selectors' %}
```css
.layout > :not(:last-child) {
  margin-bottom: 10px;
  margin-right: 10px;
}
```

{% endCompare %}

{% Compare 'worse', 'lobotomized owl' %}
```css
.layout > * + * {
  margin-bottom: 10px;
  margin-right: 10px;
}
```

{% CompareCaption %}
[Source](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/)
{% endCompareCaption %}

{% endCompare %}
</div>

The above are not a full replacement for `gap` though, and often need `@media`
or `:lang()` adjustments to account for wrapping scenarios, writing modes or direction.
Adding one or two media queries doesn't seem so bad, but they can add up and
lead to complicated layout logic.

What the above author really intended was to have none of the child items touch.
### The Antidote: gap

```css
.layout {
  display: flex;
  gap: 10px;
}
```

{% Aside %}
The ownership of the spacing shifts from the child to the parent
{% endAside %}

In the first 2 examples (without Flexbox `gap`), the children are targeted and
assigned spacing from other elements. In the antidote gap example, the container
owns the spacing. Each child can relieve itself of the burden, while also
centralizing the spacing ownership. Simplifying consistency. Reorder,
change viewports, remove elements, append new elements, etc. and spacing remains
consistent. No new selectors, no new media queries, just space.

## Chromium DevTools updates

With these updates come changes to Chromium DevTools, notice how the **Styles**
pane handles `grid-gap` and `gap` now 👍

<figure class="w-figure">
  {% Img src="image/admin/7ZxgySczxUR1qxuD8cbC.png", alt="An office with two people working at a table.", width="400", height="273" %}
  <figcaption class="w-figcaption">Devtools shows the both <code>grid-gap<code> and <code>gap</code>, with <code>gap</code> shown used below <code>grid-gap</code> as to let the cascade use the latest syntax.</figcaption>
</figure>

DevTools supports both `grid-gap` and `gap`, this is because `gap` is essentially
an alias to the previous syntaxes.

## New layout potential

With Flexbox `gap`, we unlock more than convenience. We unlock powerful, perfectly
spaced, intrinsic layouts. In the video and following code sample below, Grid
cannot achieve the layout that Flexbox can. Grid must have equal rows and columns,
even if they're intrinsically assigned.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/flexbox-gap/flex-gap-v1.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/flexbox-gap/flex-gap-v1.mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://twitter.com/argyleink/status/1255201934241198081?s=20">Tweet</a>
  </figcaption>
</figure>

Also, notice how dynamic the spacing between children is when they wrap intrinsically
like that. Media queries can't detect wrapping like that to make intelligent adjustments.
Flexbox `gap` can, and will, do it for you across all internationalizations.


## Multi-column `gap`

In addition to Flexbox supporting the `gap` syntax, multi-column layouts also support
the shorter `gap` syntax.

```css/3/2
article {
  column-width: 40ch;
  column-gap: 5ch;
  gap: 5ch;
}
```

Pretty rad.
