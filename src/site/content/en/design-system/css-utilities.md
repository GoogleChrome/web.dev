---
title: 'CSS Utilities'
permalink: '/design-system/css-utilities/index.html'
layout: 'design-system-documentation.njk'
summary: 'Flexible utilities that solve common UI problems, using the [CUBE CSS utilities principles](https://cube.fyi/utility.html).'
---

## All center

Does what it says on the tin. It center-aligns text with `text-align` and uses
`margin-inline: auto` to center align on the reading mode direction.

```html
<header class="all-center">
  <h1>A page header</h1>
  <p>
    Donec ullamcorper nulla non metus auctor fringilla. Integer posuere erat a
    ante venenatis dapibus posuere velit aliquet. Aenean eu leo quam.
    Pellentesque ornare sem lacinia quam venenatis vestibulum. Curabitur blandit
    tempus porttitor. Donec ullamcorper nulla non metus auctor fringilla. Duis
    mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia
    odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient
    montes, nascetur ridiculus mus.
  </p>
</header>
```

## Avatar

The avatar utility adds a consistent treatment to images of authors and prevents
them being shrunk/grown by flexbox layouts.

You can affect the size of the avatar in your context by setting a value for
`--avatar-size`, which has a default value of `65px`.

The `.avatar` class can be added directly to an image, or a direct parent, such
as a link.

```html
<img class="avatar" src="/path-to-image.jpg" alt="Example's profile shot" />

<a href="#" class="avatar">
  <img class="avatar" src="/path-to-image.jpg" alt="Example's profile shot" />
</a>
```

## Flow

The flow utility provides flow and rhythm between direct sibling elements.
Where `--flow-space` is not defined: the default value is 1em, which equals
the font size of the affected element.

[More info](https://piccalil.li/quick-tip/flow-utility/)

```html
<article class="flow">
  <p>
    Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit
    libero, a pharetra augue.
  </p>
  <p>
    Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac
    facilisis in, egestas eget quam.
  </p>
  <p style="--flow-space: 2em">
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
  </p>
</article>
```

You can also use the `flow-space` generated utility that allows you to use
the **spacing design tokens**. For example, If you want that last paragraph
to have a `Size 2` spacing, you would change the code to the following:

```html
<article class="flow">
  <p>
    Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit
    libero, a pharetra augue.
  </p>
  <p>
    Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac
    facilisis in, egestas eget quam.
  </p>
  <p class="flow-space-size-2">
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
  </p>
</article>
```

## Focus ring

A box-shadow powered focus ring that uses a transparent outline to provide
focus for high contrast users. The box-shadow helps to support border-radius
elements.

```html
<button class="my-cool-button focus-ring">My cool button</button>
```

You can customise the `--focus-ring-padding-color`, which creates the
illusion of space, but it's actually just the background.

```css
.my-cool-button {
  --focus-ring-padding-color: goldenrod;
}
```

## Region

A container that provides consistent vertical spacing for
chunks/sections/regions of content.

```html
<div class="region">I have consistent space now.</div>
```

## Over Scroll

Provides a container that _contains_ overflowing content. This should be sized externally, either with [flex basis](https://piccalil.li/tutorial/build-a-responsive-media-browser-with-css/#heading-making-the-nav-shrinkable), or with units, like the example below.

```html
<div class="over-scroll" style="max-height: 10rem">
  <p>
    Leo malesuada nibh sed quam curae sollicitudin laoreet aptent fermentum
    tristique elit feugiat ultricies eget pulvinar rutrum venenatis turpis
    integer neque blandit aliquet morbi ligula risus hendrerit inceptos metus
    senectus mollis convallis vulputate scelerisque dictum vehicula etiam massa
    justo
  </p>
  <p>
    Leo malesuada nibh sed quam curae sollicitudin laoreet aptent fermentum
    tristique elit feugiat ultricies eget pulvinar rutrum venenatis turpis
    integer neque blandit aliquet morbi ligula risus hendrerit inceptos metus
    senectus mollis convallis vulputate scelerisque dictum vehicula etiam massa
    justo
  </p>
</div>
```

## Scrollbar

Provides a scrollbar only if there is overflow content. This utility only provides the scrollbar and **not** the rule which determines which direction scrolling occurs (`overflow-x`, `overflow-y`, `overflow`), so the element that this is applied to needs to deal with that.

### Example

```html
<div class="table-wrapper scrollbar">
  <table></table>
</div>
```

## Visually hidden

If you hide an element with `display: none`, it can also hide it from assistive
technology, such as screen readers. This utility allows you to get the effect
of `display: none`, without the a11y issues.

```html
<p class="visually-hidden">
  You can't see me, but a screen reader can still access me
</p>
```

## Wrapper

A horizontally centered wrapper that provides a consistent central column.
This should be used in all contexts where the content needs to be in the
center of the page.

```html
<div class="wrapper">I am centered and have a nice, consistent gutter.</div>
```

You can add an [exception](https://cube.fyi/exception.html) to create a narrow
wrapper, too. Add `data-size="narrow"` to the element and it will have a reduced
width and **no gutter**.

```html
<div class="wrapper" data-size="narrow">I am a reduced width wrapper</div>
```

You can also remove inline padding by adding `data-flush`.

```html
<div class="wrapper" data-flush>I am a flush wrapper</div>
```
