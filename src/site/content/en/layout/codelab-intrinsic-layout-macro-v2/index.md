---
layout: codelab
title: "Macro Layout v2 (refactor): Intrinsic Grids"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v2
related_post: intrinsic-layout-macro
---

In this refactor I want to try and reduce our selector specificity, reduce the amount of code in media queries, and move away from defining explicit boxes.

<!-- Grid 2 `<main>`: I want a **grid with 2 columns**, the first at a fixed width and the 2nd filling the remaining space -->

#### Let's break it down
## 1. `<body>` Layout
Our **most macro grid** is placed on the body. It's **creating directionality** for the highest level elements (`<nav>`, `<header>`, `<main>`, etc) and the **spacing between** them. This grid is minimal and doesn't know anything about what it's laying out except that there should be some healthy space applied via gap.

{% Aside 'gotchas' %}
  Make sure to check out the HTML so there's context for the selectors and grid implementation.
{% endAside %}

<br>

#### The CSS
```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;
}
```
#### Grid in Plain Speak:
I want a **grid** of **rows** with a **2rem gap**

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – body rows.png" alt="Showing simplified grid of only rows" class="screenshot">
</figure>


## Pros 👍
1. Just rows
1. Just gaps
1. Add more elements and layout continues to work great
1. Respectful rows that don't enforce a height
1. Fallback is straight forward
1. **Just flow and spacing**

## Cons 👎
1. **No more rails** (not really a con, but doesn't match the mental model my design brain had)
1. **Dinky**, it's barely doing anything (this a con? lol, perhaps to some?)




<br><br><br>

#### Let's break it down
## 2. `<main>` Layout

We've spaced our big elements vertically, now we have **1 more large macro layout to create**. In our first version we had rails with placed elements, **I'd like to not place elements this time**.

**CSS**
```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  margin: 0 var(--body-rails);
}
```
#### Grid in Plain Speak:
I want a **grid** with **2 columns**, the **first at a fixed width** and the **2nd filling** the remaining space.

Instead of rails we **use margin** 🤯 and then just have **2 columns**:

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – main.png" alt="Main grid simplified to 2 columns" class="screenshot">
</figure>

## Pros 👍
1. **Cut** the amount of **columns** to manage **in half**
1. **Cut** down the **complexity**
1. **Cut** the **LoC** down to 3
1. Media queries need to **know much less**

## Cons
1. No more rails (I dont know why, but I liked them, and they're gone lol)


TODO: simulate some chaos by adding a footer
TODO: move responsive work into here

<!-- #### Let's break it down
## 1. `<body>` Layout

Our **most macro grid** is placed on the body. It's **creating spaces** for the highest level elements (`<nav>`, `<header>`, `<main>`, etc) and the **spacing between** them. This grid is minimal and doesn't know anything about what it's laying out except that there should be some healthy space between.

We could add a any element to the `<body>` later and get some spacing **for free**. Free is nice.

<br><br>

**HTML**
```html
<body>
  <nav></nav>
  <h2></h2>
  <main>...</main>
  <footer></footer>
</body>
```

<br>

**CSS**
```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;
}
```

<div class="note">
  <b>Plain Speak:</b> I want a <b>grid</b> of <b>rows</b> with a <b>2rem gap</b>
</div>

<br><br>

**Results**
<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<br><br>

**Each child** element of `<body>` becomes **a row** with **2rems between** them:

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – body rows.png" alt="Showing simplified grid of only rows" class="screenshot">
</figure>


## Pros 👍
1. Just rows
1. Just gaps
1. Add more elements and layout continues to work great
1. Respectful rows that don't enforce a height
1. **Just flow and spacing**
1. Fallback is straight forward

## Cons 👎
1. **No more rails** (not really a con, but doesn't match the mental model my design brain had)
1. **Dinky**, it's barely doing anything

<br><br><br>

#### Next piece
## 2. `<main>` Layout
We've spaced our big elements vertically, now we have **1 more large macro layout to create**. In our first version we had rails with placed elements, **I'd like to not place elements this time**.

**Note:** I often find my first grids use `grid-template-area` but become unwieldy at a certain point.

<br>

**HTML**
```html
<main>
  <aside></aside>
  <article></article>
</main>
```

<br>

**CSS**
```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  margin: 0 var(--body-rails);
}
```

<div class="note">
  <b>Plain Speak:</b> I want a <b>grid</b> with <b>2 columns</b>, the <b>first at a fixed width</b> and the <b>2nd filling</b> the remaining space.
</div>

<br><br>

**Results**
<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**Open that Glitch up** in a new tab and give it a whirl, kick the tires, peep the code. Try tweaking a few things that you're curious about. What do you think? **How is it different from v1?**

<br><br>

Instead of rails we **use margin** 🤯 and then just have **2 columns**:

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – main.png" alt="Main grid simplified to 2 columns" class="screenshot">
</figure>

## Pros 👍
1. **Cut** the amount of **columns** to manage **in half**
1. **Cut** down the **complexity**
1. **Cut** the **LoC** down to 3
1. Media queries need to **know much less**

## Cons
1. No more rails (I dont know why, but I liked them, and they're gone lol) -->
