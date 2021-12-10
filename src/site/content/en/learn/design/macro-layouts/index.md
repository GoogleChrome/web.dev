---
title: Macro layouts
description: >
  Design page layouts using a choice of CSS techniques.
authors:
  - adactio
date: 2021-11-03
---

Macro layouts describe the larger, page-wide organization of your interface. 

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/HoOnH9yMrSY6MhQdRNRZ.jpeg", 
alt="A wireframe of a two column layout, next to the same layout as one column for a narrow view.", width="800", height="501" %}

Before applying any layout, 
you should make sure that the flow of your content makes sense. 
This single column default ordering is what smaller screens will get.

```html
<body>
  <header>…</header>
  <main>
    <article>…</article>
    <aside>…</aside>
  </main>
  <footer>…</footer>
</body>
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'oNeePOX',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

When you arrange these individual page-level components, 
you're designing a macro layout: a high-level view of your page. 
Using media queries, you can supply rules in CSS describing how this view should adjust to different screen sizes.

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/3KENjI9FiNARctTiKDak.mp4", autoplay=true, controls=true, loop=true %}

## Grid

[CSS grid](/learn/css/grid/) is an excellent tool for applying a layout to your page. 
In the example above,  say you want a two-column layout once there's enough screen width available. 
To apply this two-column layout once the browser is wide enough, 
use a media query to define the grid styles above a specified breakpoint.

```css
@media (min-width: 45em) {
  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```
{% Aside %}
While it would make more sense to specify `min-inline-size` instead of `min-width`, 
logical properties don't work in media queries yet.
{% endAside %}

{% Codepen {
 user: 'web-dot-dev',
 id: 'vYJJzMK',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

## Flexbox

For this specific layout, you could also use [flexbox](/learn/css/flexbox). 
The styles would look like this:

```css
@media (min-width: 45em) {
  main {
    display: flex;
    flex-direction: row;
  }

  main article {
    flex: 2;
  }

  main aside {
    flex: 1;
  }
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'gOxxdym',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

However, the flexbox version requires more CSS. 
Each column has a separate rule to describe how much space it should take up. 
In the grid example, that same information is encapsulated in one rule for the containing element.

## Do you need a media query?

You might not always need to use a media query. 
Media queries work fine when you're applying changes to a few elements, 
but if the layout needs to be updated a lot, your media queries could get out of hand with lots of breakpoints.

Say you've got a page full of card components. 
The cards are never wider than `15em`, and you want to put as many cards on one line as will fit. 
You could write media queries with breakpoints of `30em`, `45em`, `60em`, 
and so on, but that's quite tedious and difficult to maintain.

Instead, you can apply rules so that the cards themselves automatically take up the right amount of space.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  grid-gap: 1em;
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'QWMMVPm',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

You can achieve a similar layout with flexbox. 
In this case, if there are not enough cards to fill the final row, 
the remaining cards will stretch to fill the available space rather than lining up in columns. 
If you want to line up rows and columns, then use grid.

```css
.cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
}
.cards .card {
  flex-basis: 15em;
  flex-grow: 1;
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'abyyaMg',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

By applying some smart rules in flexbox or grid, 
it's possible to design dynamic macro layouts with minimal CSS and without any media queries. 
That's less work for you—you're making the browser do the calculations instead. 
To see some examples of modern CSS layouts that are fluid without requiring media queries, see 
[1linelayouts.com](https://1linelayouts.glitch.me/).

{% Assessment 'macro-layouts' %}

Now that you've got some ideas for page-level macro layouts, 
turn your attention to the components within the page. This is the realm of 
[micro layouts](/learn/design/micro-layouts).
