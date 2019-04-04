---
page_type: guide
title: Macro Layout
author: adamargyle
description:
tags:
- Layout
- Design
- CSS
web_lighthouse: N/A
web_updated_on:
web_published_on:
wf_blink_components: Blink>Accessibility
---

# Macro Layout

Macro layouts are the top most layouts of a page. Think of it like **the white space around your white space**. Could also call these an app shell or layout shell. The forest's layout, not a tree's layout. This is where we'll start!


## First Things First
I took a stab at **overlaying estimated macro grid tracks** on the design based on initial assumptions. I find this to be mentally pacifying since I can fail fast while sketching grid tracks over a comp. I'm not drawing tracks to inform my code, I'm drawing tracks to inform my strategy. **I don't expect it to be right, but I expect it to help me get to the right solution faster.**

<figure style="text-align:center; margin: 5rem 0;">
  <img src="macro.png" alt="Full page design mockup with estimated rows and columns highlighted" class="screenshot">
</figure>


# From this design I'm gleaning:

## Layout Semantics
1. `<nav>` at the top should all be in one containing element
1. `<main>` should be used to wrap the `<aside>` and `<article>`
1. The `<aside>` should contain a `<nav>`
1. Lots of `<img>`'s inside `<figure>`'s' with `<figcaption>`'s
1. `<input type="search"/>`
1. `<button>`s and `<a>`s


## Layout Observations
1. An **asymetric** layout 💀🤘
1. **Rails** are **flanking** a large flexible column
  <figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot">
    <img src="macro – flanking rails.png" alt="">
  </figure>

1. Rails and aside look like **fixed** **columns**
  <figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot">
    <img src="macro – fixed widths.png" alt="">
  </figure>

1. Free shipping message **spans 2 columns**
  <figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot">
    <img src="macro – greeting span.png" alt="">
  </figure>

1. Greeting message is **splitting** our potentially **shared columns** from `<nav>` to `<main>`
  <figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot">
    <img src="macro – body split.png" alt="">
  </figure>


## Layout Concerns
1. `<aside>` and site name share the same column, but they're in different places in the DOM tree
1. `<nav>` and `<main>` share column guides but we don't have [subgrid](https://rachelandrew.co.uk/archives/2018/04/27/grid-level-2-and-subgrid/)
1. The rails will need to collapse on mobile

<br><br>
Even if my first layout works great, I like going back and looking for places to optimize: trim logic, code, or whatever. **Just like I do in my Javascript.**

In case you're wondering where or how I conjured those notes, I don't have a systemic process to share. I look for alignments, shared spaces, dynamic content areas, and I try to see which areas <b>should</b> be flexible. Top that off with an intent to <b>let the content speak for itself</b> when it can with a <b>content outward</b> layout strategy, let content length be a breakpoint.


<br><br><br>


##### Let's Code!
# Macro Layout v1: <br>A Slotted Layout
<div class="note">1 grid to rule them all</div>

In this iteration, we follow our gut and do our best to articulate a grid to handle this macro layout. It looks like we can do **the whole grid** with 1 definition **using** a **slotted layout**. We have identifiable elements and grid lines, so let's translate them to [grid-template-areas](<https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas>), **place** our elements in the **defined zones**, and go from there.

<br>

**HTML**
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

<div class="note">
  <b>CSS Grid In English:</b> I want a <b>grid</b> that's <b>3</b> rows by <b>4</b> columns, the <b>first</b> and <b>last</b> columns should be <b>equal</b> and the width of the `--body-rails`  CSS variable. <b>2nd</b> column at the <b>predetermined width</b> of a sidebar, and our <b>column 3</b> should <b>fill</b> all remaining space. <b>Furthermore</b>, these <b>areas</b> are <b>named</b>, and "these elements" should occupy "these areas".
</div>

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
1. Inside a media query when we end up stacking these elements on mobile, we don't just have 1 or 2 levers to pull to tweak the layout, **we've got a handful of rules to update**


<br><br><br><br>


# Macro Layout v2 (refactor): <br>Intrinsic Grids
<div class="note">2 grids that do less</div>

<br>

In this refactor, I **pulled the `<header>` element out**. Upon a closer look, I noticed that the `<header>` didnt need to be in a grid at all! It's a full width element from biggest screens to smallest, it's actually baggage / **code debt to be pushing that naturally responsive element into a more complicated layout strategy**.

Post refactor, 1 grid manages the "stack" / top level rows, and the 2nd manages the aside and articles. You could think of it like **2 grids with less responsibility**, **less knowledge** of children, and ultimately takes **less code** to create.

<br><br>

#### Let's break it down
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
  <b>CSS Grid In English:</b> I want a <b>grid</b> of <b>rows</b> with a <b>2rem gap</b>
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
  <b>CSS Grid In English:</b> I want a <b>grid</b> with <b>2 columns</b>, the <b>first at a fixed width</b> and the <b>2nd filling</b> the remaining space.
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
1. No more rails (I dont know why, but I liked them, and they're gone lol)

<br><br><br><br>

# Responsive Final Touches
Due to our nice refactor, **our responsive work is pretty minimal**. Nothing needs to be changed on the `<body>`, woh, love it, and the `<main>` grid **only needs a minor adjustment**:

<br>

```css
@media (width < 768px) {
  grid-template-columns: 1fr;
  margin: 0 0 0 1rem;
}
```

<div class="note">
  <b>CSS Grid In English:</b> When the viewport width is less than 768px, I want a <b>grid</b> with <b>1 full width column</b> and margin only on the left side.
</div>

<figure style="text-align:center; margin: 4rem 0; max-width: 400px;">
  <img src="main-responsive.png" alt="Main grid simplified to 2 columns" class="screenshot">
</figure>

<br><br><br><br>

# Conclusion
v2 of our macro layout is lookin good. **We've created spaces and boxes for our biggest components**, and they're now resting healthy together. Turned out to be less work then we thought! That's always nice.

We also iterated a bit to use more intrinsic properties:
- Content can **change node names,** **position** or **length** and **no grid needs modified**
- CSS **knows less about the DOM structure**

<br><br>

**Final Macro Layout**
<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<br><br>

**Play with that Glitch a bit!** Resize your browser. Use the devtools to visualize the grid spaces!

<figure style="text-align:center; margin: 4rem 0;">
  <img src="intrinsic-macro-1.gif" alt="">
</figure>


## Did we match our estimated grid lines!?

**Nope!** 😹

Turns out my original guesses on grid lines were off.. **what's new**!

Here are the designs with **updated grid lines** based on the learnings from development.

### Top Level Grid
<div class="note">just flow and spacing</div>

<figure style="text-align:center; margin: 1rem 0 4rem 0;">
  <img src="macro – body rows.png" alt="">
</figure>


### Main Level Grid
<div class="note">2 columns with some margin</div>

<figure style="text-align:center; margin: 0.25rem 0 4rem 0;">
  <img src="macro – less grids more margin.png" alt="">
</figure>
