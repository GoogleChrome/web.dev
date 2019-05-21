---
layout: codelab
title: "Macro Layout v1: A Slotted Layout"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v1
path: app/css/layouts/body.css
previewSize: 70
related_post: intrinsic-layout-macro
---

{% Aside 'key-term' %}
  `grid-template-areas` ([docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)) empowers a developer to visually create rows and tracks by name, which then a grid item (child) can reference those area names and claim the space.
{% endAside %}

<h2 style="text-align:center">
  Each element <b>has a place</b>, <br>
  each element <b>in it's place</b>
</h2>

I love `grid-template-areas`, it's very cool, and fits the bill for tons of layout tasks. It's traditionally been the first way I translate a design into grid, it just makes sense and often the code reads very similar to the way we talk about a grid, which I'm a big fan of.

**So let's use it!** Let's make some tracks, select some nodes and put them into their cells.

<br>

#### The CSS
```css
body {
  display: grid;
  gap: 2rem 0;
  grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
  grid-template-rows: var(--body-rails) min-content 1fr;
  grid-template-areas:
    "nav nav nav nav"
    ". header header header"
    ". aside article article";

  /* select and assign children to an area */
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
}
```

{% Compare 'better', 'Tip' %}
[Open the Glitch](https://intrinsic-layout-macro-v1.glitch.me) in a new tab and inspect the grid with devtools 👍
{% endCompare %}

<br>

### Let's break some of that down...

#### Columns in plain speak:
```css
grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
```
- **1st** and **4th** columns should be fixed and equal with an extrinsic width set by the `--body-rails` CSS custom property. These are the flanking rails of the layout.
- **2nd** column should be the extrinsic width set by the `--sidebar-width` custom property.
- **3rd** column is our flexible column and should fill all remaining space.

<br>

#### Rows in plain speak:
```css
grid-template-rows: var(--body-rails) min-content 1fr;
```
- The **1st** row is our navbar and design decided it's height is the same value as the width of our rails, the custom property `--body-rails`. This means it's extrinsicly set, and also means we don't need padding in that navbar to have vertically centered content, we can align children to the center of the container.
- The **2nd** row is our header, an intrinsicly sized row indicated by the `min-content` keyword. This keyword in the case of a row, will shrinkwrap to whatever minimum height is required by the contents of the node.
- The **3rd** row is a fluid row that fill the remaining space or expands to match the needs of it's contents.

<!-- <figure style="text-align:center; margin: 1rem 0;">
  <img src="macro – body grid.png" alt="">
  <figcaption>tracks visualized: highlighted rows and dashed line columns</figcaption>
</figure> -->

<br>

#### Slotted layout pros 👍
1. Sure is a **fun to read** visual way to create a grid
1. Shallow DOM tree
1. **Slotted**, which may play nice with component architectures
1. Feels like a traditional print layout where there's content areas and we **placed elements**

<br>

#### Slotted layout cons 👎
1. High specificity: **specific children** to **specific locations**
1. **Empty columns** in the `<main>`feel wasteful when we have margin
1. **Lots of code**, even though it reads well and is satisfying
1. **Falling back** for older browsers will be tough with `grid-template-area`
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update.** Each specific child needs put into a new specific location. #tedious
1. Adding children, like a `<footer>` would require additional CSS to write

<br>

## Responsive Final Touches
Our designers didn't provide mobile comps, so through **trial and reason** I found that 768px, a typical portait and tablet size, is a great time to collapse our grid into a single column stack. This can be achieved with out slotted layout like so.

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

Well, **36 lines of code** isn't too bad for a responsive layout. It's not broken, it just needs it hand held a bit.

#### Incoming Chaos!!
Ready to write some code and **simulate some chaos?** Incoming change from the design team:

{% Aside 'objective' %}
  Remix the codelab to the right and uncomment the `<footer>` in `app/index.html`. Finish / author new CSS in `app/css/layouts/body.css` to put the `<footer>` into the proper place in the grid. **Don't forget about the media query!**

  When you're done, remember the level of effort and simplicity of handling the change. We'll be comparing it against a refactor soon. This type of chaos is typical in most environments, so it makes sense that we're concious of these changes that could come down the pipe.
{% endAside %}

<br>

## Conclusion
Grid template areas works fine, but wow when we uncommented that `<footer>` **it really was not intuitive what happened.** Our footer was tiny, crammed into the first open cell, and not under our content (where it logically should be). **When we start placing items we break out of flow**, almost like when you make an element positioned absolute.

Next, **we refactor to remedy some of these trials we learned** through our first grid. This time, we want less code, less selectors, and some flexibility with our container children.

<a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v2">
  Codelab: Intrinsic Macro Grids
</a>

OR
<br>
