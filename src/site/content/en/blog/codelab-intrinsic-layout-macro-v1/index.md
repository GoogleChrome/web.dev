---
layout: codelab
title: "Macro Layout v1: A Slotted Layout"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v1
related_post: intrinsic-layout-macro
---

{% Aside 'key-term' %}
  `grid-template-areas` ([docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)) empowers a developer to visually create rows and tracks by name, which then a grid item (child) can reference those area names and claim the space.
{% endAside %}

<h2 style="text-align:center; margin: 5rem 0 8rem;">
  Each element <b>has a place</b>, <br>
  each element <b>in it's place</b>
</h2>

I love `grid-template-areas`, it's very cool, and fits the bill for tons of layout tasks. It's traditionally been the first way I translate a design into grid, it just makes sense and often the code reads very similar to the way we talk about a grid, which I'm a big fan of.

**So let's use it!** Let's make some tracks, select some nodes and put them into their cells.

#### The HTML
See `app/index.html` in the Glitch embed for the full HTML. It's important with intrinsic layout to have your content in HTML before you get started, otherwise achieving a content outward layout wouldn't be possible.

At a macro view, here's the HTML we're working with:

```html
<body>
  <nav>...</nav>
  <h2>Free Shipping in U.S.</h2>
  <aside>...</aside>
  <article>...</article>
</body>
```

With this we want to create CSS grid tracks that will enable us to match the design comp. Here's what I came up with!

#### The CSS
See `app/css/layouts/body.css` in the Glitch embed.

```css
body {
  /* convert body to a grid container */
  display: grid;

  /* vertical spacing between rows */
  gap: 2rem 0;

  /* define columns/rows */
  grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
  grid-template-rows: var(--body-rails) min-content 1fr;

  /* give rows and columns names */
  grid-template-areas:
    "nav nav nav nav"
    ". header header header"
    ". aside article article";

  /* select and assign children to a named area */
  & > nav {
    grid-area: nav;
  }

  /* by assigning to a name that spans rows or columns, so will the child */
  & > .greeting {
    grid-area: header;
  }

  & > aside {
    grid-area: aside;
  }

  & > article {
    grid-area: article;
  }

  /* notice nothing is assigned to the grid-area "." */
  /* I'm using "." as a space holder */
}
```

{% Compare 'better', 'Tip' %}
Future spec compliant CSS syntax enabled via [PostCSS preset-env](https://preset-env.cssdb.org)
{% endCompare %}

### Let's break some of that down...

#### Columns in plain speak:
```css
grid-template-columns:
        /* 1 */            /* 2 */     /* 3 */    /* 4 */
  var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
```

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v1-columns%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v1-columns.jpg" alt="columns shown over design" class="screenshot">
  </picture>
</figure>

- **1st** and **4th** columns should be fixed and equal with an extrinsic width set by the `--body-rails` CSS custom property. These are the flanking rails of the layout.
- **2nd** column should be the extrinsic width set by the `--sidebar-width` custom property.
- **3rd** column is our flexible column and should fill all remaining space.

#### Rows in plain speak:
```css
grid-template-rows:
/* 1 */  var(--body-rails)
/* 2 */  min-content
/* 3 */  1fr
;
```

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-body-rows-numbered%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-body-rows-numbered.jpg" alt="columns shown over design" class="screenshot">
  </picture>
</figure>

- The **1st** row is our navbar and design decided it's height is the same value as the width of our rails, the custom property `--body-rails`. This means it's extrinsicly set, and **also means we don't need padding in that navbar to have vertically centered content, we can align children to the center of the container.**
- The **2nd** row is our header, an intrinsicly sized row indicated by the `min-content` keyword. This keyword in the case of a row, will shrinkwrap to whatever minimum height is required by the contents of the node.
- The **3rd** row is a fluid row that fill the remaining space or expands to match the needs of it's contents.

## Code Review
#### Slotted layout pros 👍
1. Sure is a **fun to read** visual way to create a grid
1. Shallow DOM tree
1. **Slotted**, which may play nice with component architectures
1. Feels like a traditional print layout where there's content areas and we **placed elements**

#### Slotted layout cons 👎
1. High specificity: **specific children** to **specific locations**
1. **Empty columns** feel wasteful when we have margin
1. **Lots of code**, even though it reads well and is satisfying
1. **Falling back** for older browsers will be tough with `grid-template-areas`
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update.** Each specific child needs put into a new specific location. #tedious
1. Adding children, like a `<footer>` would require additional CSS to place the new child

## Responsive Final Touches
Our designers didn't provide mobile comps, so we'll use **trial and reason.** I found that 768px, a typical portait and tablet size, is a great point to collapse our grid into a stack. This can be achieved with our slotted layout like so.

```css/26-34
body {
  display: grid;
  gap: 2rem 0;
  grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
  grid-template-rows: var(--body-rails) min-content 1fr;
  grid-template-areas:
    "nav nav nav nav"
    ". header header header"
    ". aside article article";

  & > nav {
    grid-area: nav;
  }

  & > .greeting {
    grid-area: header;
  }

  & > aside {
    grid-area: aside;
  }

  & > article {
    grid-area: article;
  }

  @media (width < 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: var(--body-rails) min-content 3rem 1fr;
    grid-template-areas:
      "nav"
      "header"
      "aside"
      "article";
  }
}
```
{% Compare 'better', 'Tip' %}
[Open the Glitch](https://intrinsic-layout-macro-v1.glitch.me) in a new tab and inspect the grid with devtools 👍
{% endCompare %}

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/v1-responsive.gif" alt="gif demoing responsive nature of the layout going from columns to a stack" class="screenshot">
  </picture>
</figure>

Well, **36 lines of code** isn't too bad for a responsive layout. Was even satisfying writing that media query `grid-template-areas` stack because it looks like our result. But.. the layout's hand does needs held a bit much.

{% Aside 'warning' %}
  Changes from the design team! 😲
{% endAside %}

## Chaos Time 😈

{% Aside 'objective' %}
**Remix the codelab to the right** and complete the following tasks
{% endAside %}

1. Uncomment the `<footer>` in `app/index.html`
1. Author new CSS in `app/css/layouts/body.css` to put the `<footer>` into the proper place in the grid (below the `<article>` and `<aside>`)
1. Ensure the layout still works on mobile
1. **Extra:** remove other HTML, like the `<nav>` and observe the effect it has on our layout. Poke it, prod it, feel out it's resilience to change and turbulence.

{% Aside 'gotchas' %}
  Click the **Remix To Edit** button to make the project editable
{% endAside %}

<figure class="w-figure w-figure--center">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v1-footer-chaos.png" alt="footer is laid out in the wrong location without custom CSS" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    Default footer placement in the grid is not good
  </figcaption>
</figure>

When you're done, **remember the level of effort of handling this change**. Also remember how well the layout algorithm handled change and turbulence. We'll be comparing it against [a refactor](/codelab-intrinsic-layout-macro-v2) next.

## Conclusion
Grid template areas works fine, but wow when we uncommented that `<footer>` **it really was not intuitive what happened.** Our footer was tiny, crammed into the first open cell, and not under our content (where it logically should be). **When we start placing items we break out of flow**, almost like when you make an element positioned absolute.

Next, **we refactor to remedy some of these trials we learned** through our first grid. This time, we want less code, less selectors, and some flexibility with our container children. We also want the ability to add footers without adding to our CSS so much, or at all.

{% Aside 'codelab' %}
  [Next Codelab (the refactor): Intrinsic Macro Grids](/codelab-intrinsic-layout-macro-v2)
{% endAside %}
