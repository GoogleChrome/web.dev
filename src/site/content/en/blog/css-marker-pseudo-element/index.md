---
layout: post
title: Custom bullets with CSS ::marker
subhead: It is now trivial to customize the color, size or type of number or bullet when using a <ul> or <ol>.
authors:
  - adamargyle
  - loirooriol
description: It is now trivial to customize the color, size or type of number or bullet when using a <ul> or <ol>.
tags:
  - blog
  - css
date: 2020-09-02
updated: 2020-09-02
scheduled: true
is_baseline: true
hero: image/admin/GPGTyXJOh0cH0wa1PvXH.png
thumbnail: image/admin/jbdOq0tGGzobMtaBsajn.png
alt: Showing the anatomy of a single list item by putting separate boxes around the bullet and the text
feedback:
  - api
---

Thanks to Igalia, sponsored by Bloomberg, we can finally put our hacks away for styling lists. See!

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOmqXrog0YoriZqqIzEZ.png", alt="", width="665", height="384" %}
  <figcaption>
    <a href="https://glitch.com/edit/#!/marker-fun-example">View Source</a>
  </figcaption>
</figure>

Thanks to [CSS `::marker`](https://www.w3.org/TR/css-lists-3/#marker-pseudo) we can change the content and some of the styles of bullets and numbers.

## Browser compatibility

`::marker` is supported in Firefox for desktop and Android, desktop Safari and iOS Safari (but only the `color` and `font-*` properties, see [Bug 204163](https://bugs.webkit.org/show_bug.cgi?id=204163)), and Chromium-based desktop and Android browsers.

{% BrowserCompat 'css.selectors.marker' %}

## Pseudo-elements
Consider the following essential HTML unordered list:

```html
<ul>
  <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
  <li>Dolores quaerat illo totam porro</li>
  <li>Quidem aliquid perferendis voluptates</li>
  <li>Ipsa adipisci fugit assumenda dicta voluptates nihil reprehenderit consequatur alias facilis rem</li>
  <li>Fuga</li>
</ul>
```

Which results in the following unsurprising rendering:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-plain-list?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

The dot at the beginning of each `<li>` item is free! The browser is drawing and creating a generated marker box for you.

Today we're excited to talk about the `::marker` pseudo-element, which gives the ability to style the bullet element that browsers create for you.

{% Aside 'key-term' %}
A pseudo-element represents an element in the document other than those which exist in the document tree. For example, you can select the first line of a paragraph using the pseudo-element `p::first-line`, even though there is no HTML element wrapping that line of text.
{% endAside %}

### Creating a marker

The `::marker` pseudo-element marker box is automatically generated inside every list item element, preceding the actual contents and the `::before` pseudo-element.

```css
li::before {
  content: "::before";
  background: lightgray;
  border-radius: 1ch;
  padding-inline: 1ch;
  margin-inline-end: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 340px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-before-example?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Typically, list items are `<li>` HTML elements, but other elements can also become list items with `display: list-item`.

```html
<dl>
  <dt>Lorem</dt>
  <dd>Lorem ipsum dolor sit amet consectetur adipisicing elit</dd>
  <dd>Dolores quaerat illo totam porro</dd>

  <dt>Ipsum</dt>
  <dd>Quidem aliquid perferendis voluptates</dd>
</dl>
```

```css/1
dd {
  display: list-item;
  list-style-type: "🤯";
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-definition-list?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### Styling a marker
Until `::marker`, lists could be styled using `list-style-type` and `list-style-image` to change the list item symbol with 1 line of CSS:

```css
li {
  list-style-image: url(/right-arrow.svg);
  /* OR */
  list-style-type: '👉';
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-list-style-type?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

That's handy but we need more. What about changing the color, size, spacing, etc!? That's where `::marker` comes to the rescue. It allows individual and global targeting of these pseudo-elements from CSS:

```css
li::marker {
  color: hotpink;
}

li:first-child::marker {
  font-size: 5rem;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-style-introduction?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside 'caution' %}
If the above list does not have pink bullets, then `::marker` is not supported in your browser.
{% endAside %}

The `list-style-type` property gives very limited styling possibilities. The `::marker` pseudo-element means that you can target the marker itself and apply styles directly to it. This allows for far more control.

That said, you can't use every CSS property on a `::marker`. The list of which properties are allowed and not allowed are clearly indicated in the spec. If you try something interesting with this pseudo-element and it doesn't work, the list below is your guide into what can and can't be done with CSS:

#### Allowed CSS `::marker` Properties
- `animation-*`
- `transition-*`
- `color`
- `direction`
- `font-*`
- `content`
- `unicode-bidi`
- `white-space`

Changing the contents of a `::marker` is done with `content` as opposed to `list-style-type`. In this next example the first item is styled using `list-style-type` and the second with `::marker`. The properties in the first case apply to the entire list item, not just the marker, which means that the text is animating as well as the marker. When using `::marker` we can target just the marker box and not the text.

Also, note how the disallowed `background` property has no effect.

<div class="switcher">
{% Compare 'worse', 'List Styles' %}
```css
li:nth-child(1) {
  list-style-type: '?';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
```

{% CompareCaption %}
Mixed results between the marker and the list item
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Marker Styles' %}
```css
li:nth-child(2)::marker {
  content: '!';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
```

{% CompareCaption %}
Focused results between marker and list item
{% endCompareCaption %}

{% endCompare %}
</div>

<br>

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-style-vs-list-style-type?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside 'gotchas' %}
In Chromium, `white-space` only works for inside positioned markers. For outside positioned markers, the style adjuster always forces `white-space: pre` in order to preserve the trailing space.
{% endAside %}


#### Changing the content of a marker
Here are some of the ways you could style your markers.

**Changing all list items**
```css
li {
  list-style-type: "😍";
}

/* OR */

li::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-change-all?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**Changing just one list item**
```css
li:last-child::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-change-one?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**Changing a list item to SVG**
```css
li::marker {
  content: url(/heart.svg);
  content: url(#heart);
  content: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='24' width='24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='none' stroke='hotpink' stroke-width='3'/></svg>");
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-inline-svg?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**Changing numbered lists**
What about an `<ol>` though? The marker on an ordered list item is a number and not a bullet by default. In CSS these are called [Counters](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters), and they're quite powerful. They even have properties to set and reset where the number starts and ends, or switching them to roman numerals. Can we style that? Yep, and we can even use the marker content value to build our own numbering presentation.

```css
li::marker {
  content: counter(list-item) "› ";
  color: hotpink;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-numbered-lists?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    loading="lazy"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### Debugging
Chrome DevTools is ready to help you inspect, debug and modify the styles applying to `::marker` pseudo elements.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PYKVXEzycrMhQujXsNxQ.png", alt="DevTools open and showing styles from the user agent and the user styles", width="776", height="574", style="max-inline-size: 480px" %}
</figure>

### Future Pseudo-element styling
You can find out more about ::marker from:

- [CSS Lists, Markers and Counters](https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/) from [Smashing Magazine](https://www.smashingmagazine.com/)
- [Counting With CSS Counters and CSS Grid](https://css-tricks.com/counting-css-counters-css-grid/) from [CSS-Tricks](https://css-tricks.com/)
- [Using CSS Counters](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters) from [MDN](https://developer.mozilla.org/)

It's great to get access to something which has been hard to style. You might wish that you could style other automatically generated elements. You might be frustrated with `<details>` or the search input autocomplete indicator, things that are not implemented in the same way across browsers. One way to share what you need is by creating a want at [https://webwewant.fyi](https://webwewant.fyi).
