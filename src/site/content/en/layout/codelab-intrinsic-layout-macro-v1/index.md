---
layout: codelab
title: "Macro Layout v1: A Slotted Layout"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v1
related_post: intrinsic-layout-macro
---

## Each element **has a place**, each element **in it's place**

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

<div class="note">
  <b>Grid Plain Speak:</b> I want a <b>grid</b> that's <b>3</b> rows by <b>4</b> columns, the <b>first</b> and <b>last</b> columns should be <b>equal</b> and the width of the `--body-rails`  CSS variable. <b>2nd</b> column at the <b>predetermined width</b> of a sidebar, and our <b>column 3</b> should <b>fill</b> all remaining space. <b>Furthermore</b>, these <b>areas</b> are <b>named</b>, and "these elements" should occupy "these areas".
</div>

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
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update**

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
