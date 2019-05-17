---
layout: codelab
title: "Macro Layout v1: A Slotted Layout"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v1
path: app/css/layouts/body.css
related_post: intrinsic-layout-macro
---

{% Aside 'key-term' %}
  `grid-template-areas` ([docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)) empowers a developer to visually create rows and tracks by name, which then a grid item (child) can reference those area names and claim the space.
{% endAside %}

## Each element **has a place**, <br>each element **in it's place**

I love `grid-template-areas`, it's very cool, and fits the bill for tons of layout tasks. It's traditionally been the first way I translate a design into grid, it just makes sense and often the code reads very similar to the way we talk about a grid, which I'm a big fan of.

So let's use it! Let's make some tracks, select some nodes and put them into their cells.

{% Aside 'gotchas' %}
  Make sure to check out the HTML so there's context for the selectors and grid implementation.
{% endAside %}

<br>

#### The CSS
```css
body {
  display: grid;
  gap: 2rem; ??
  grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
  grid-template-areas:
    "nav nav nav nav"
    ". header header ."
    ". aside article .";

  & > nav {
    grid-area: nav;
  }

  & > header {
    grid-area: header;
  }

  & aside {
    grid-area: aside;
  }

  & article {
    grid-area: article;
  }
}
```
#### Grid in Plain Speak:
I want a **grid** that's **3** rows by **4** columns, the **first** and **last** columns should be **equal** and the width of the `--body-rails`  CSS variable. **2nd** column at the **predetermined width** of a sidebar, and our **column 3** should **fill** all remaining space. **Furthermore**, these **areas** are **named**, and "these elements" should occupy "these areas".

<!-- <figure style="text-align:center; margin: 1rem 0;">
  <img src="macro – body grid.png" alt="">
  <figcaption>tracks visualized: highlighted rows and dashed line columns</figcaption>
</figure> -->

## Pros 👍
1. Sure is **fun to read**, visual way to create a grid
1. It's a **slotted layout**, which may play nice with component architectures
1. Feels like a traditional print layout where there's content areas and we **placed elements**

## Cons 👎
1. High specificity: **specific children** to **specific locations**
1. **Empty columns** in the `<main>`feel wasteful when we have margin
1. **Lots of code**, even though it reads well and is satisfying
1. **Falling back** for older browsers will be tough with `grid-template-area`
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update**
1. Adding children, like a `<footer>` would require additional CSS to write

TODO: simulate some chaos by adding a footer: make it easy for users to uncomment a footer and see it not work out well

TODO: move responsive work into here: do the responsive css to demonstrate the tedious nature of it

## Conclusion
todo: write a recap

<!-- **HTML**
```html
<body>
  <nav></nav>
  <header>
    <h2></h2>
  </header>
  <main>
    <aside></aside>
    <article></article>
  </main>
  <footer></footer>
</body>
```
{% Compare 'better', 'Plain Speak' %}
  Our layout skeleton with our estimated semantic markup begins to take shape
{% endCompare %}

<br>

**CSS**
```css
body {
  display: grid;
  grid-template-columns: var(--body-rails) var(--sidebar-width) 1fr var(--body-rails);
  grid-template-areas:
    "nav nav nav nav"
    ". header header ."
    ". aside article .";

  & > nav {
    grid-area: nav;
  }

  & > header {
    grid-area: header;
  }

  & aside {
    grid-area: aside;
  }

  & article {
    grid-area: article;
  }
}
```
{% Compare 'better', 'Plain Speak' %}
I want a **grid** that's **3** rows by **4** columns, the **first** and **last** columns should be **equal** and the width of the `--body-rails`  CSS variable. **2nd** column at the **predetermined width** of a sidebar, and our **column 3** should **fill** all remaining space. **Furthermore**, these **areas** are **named**, and "these elements" should occupy "these areas".
{% endCompare %}

<br><br>

**Results**
<div class="glitch-embed-wrap" style="height: 480px; width: 960px;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**Open that Glitch up** in a new tab and give it a whirl, kick the tires, peep the code. Try tweaking a few things that you're curious about. What do you think?

<br><br>

#### Each element **has a place**, each element **in it's place**

<figure style="text-align:center; margin: 1rem 0;">
  <img src="macro – body grid.png" alt="">
  <figcaption>tracks visualized: highlighted rows and dashed line columns</figcaption>
</figure>

## Pros 👍
1. Sure is **fun to read**, very visual way to create a grid
1. It's a **slotted layout**, which will play nice with component architecture
1. Feels like a magazine layout where there's content areas and we **placed elements**

## Cons 👎
1. High specificity: **specific children** to **specific locations**
1. **Empty columns** in the `<main>`feel wasteful when we have margin
1. **Lots of code**, even though it reads well and is satisfying
1. **Falling back** for older browsers will be tough with `grid-template-area`
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update** -->
