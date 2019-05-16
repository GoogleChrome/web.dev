---
layout: post
title: Macro Layout
authors:
  - adamargyle
description:
web_lighthouse: N/A
date: 2019-03-05
---

{% Aside 'key-term' %}
  Macro layouts are the top most layouts of a page. Think of it like **the white space around your white space** or **the forest's layout rather than a tree's layout**.
{% endAside %}


## Discovery phase
I find overlaying estimated macro grid tracks and areas on a design pacify the initially overwhelming nature of starting from scratch. I use my wrong initial assumptions to fail fast where it's cheap to retry. I'm not drawing tracks to inform my code, I'm drawing tracks to inform my strategy. **I don't expect my groupings to be right, but I expect it to help me get to the right solution faster.** It's a discovery phase where I'm learning the relationships between elements by grouping them (probably wrong), and adjusting.

<figure class="w-figure w-figure--fullbleed">
  <img src="macro.png" alt="Full page design mockup with estimated rows and columns highlighted" class="screenshot">
</figure>

{% Aside 'objective' %}
  After drawing a few estimated gridlines and getting more familiar with their relationship, I'm ready to attempt some semantic assertions (there are elements that work well for macro layout). I'll share some of the things I'm gleaning from the design comp. I'll also share some concerns I see, as preliminary things to be mindful of as we continue.
{% endAside %}

<br>

#### Layout Semantics 👍
1. `<nav>` at the top
1. `<main>` should be used to wrap an `<aside>` and `<article>`
1. The `<aside>` should contain a `<nav>`
1. Lots of `<img>`'s inside `<figure>`'s' with `<figcaption>`'s
1. `<input type="search"/>`
1. `<button>`s and `<a>`s

<br>

#### Layout Observations 👀
1. An **asymetric** layout
1. **Rails** are **flanking** a large flexible column <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – flanking rails.png" alt=""></figure>
1. Rails and aside look like **fixed** **columns** <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – fixed widths.png" alt=""></figure>
1. Free shipping message **spans 2 columns** <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – greeting span.png" alt=""></figure>
1. Greeting message is **splitting** our potentially **shared columns** from `<nav>` to `<main>` <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – body split.png" alt=""></figure>

<br>

#### Layout Concerns 😬
1. Our side `<nav>` in the `<aside>` and site name share the same column, but they're in different places in the DOM tree
1. `<nav>` and `<main>` share column guides but we don't have [subgrid](https://rachelandrew.co.uk/archives/2018/04/27/grid-level-2-and-subgrid/)
1. The rails will need to collapse on mobile changing alignments of the account and brand logo

<br><br>

{% Compare 'better', 'In case you are wondering' %}
Where or how I conjured those notes, I don't have a systemic process to share. I look for alignments, shared spaces, dynamic content areas, and I try to see which areas **should** be flexible. Top that off with an intent to **let the content speak for itself** when it can with a **content outward** layout strategy, let content length be a breakpoint.
{% endCompare %}

Even if my first layout works great, I like going back and looking for places to optimize: trim logic, code, or whatever. **Just like I do in my Javascript.**


<br><br><br>


###### Let's Code!
## Macro Layout v1: A Slotted Layout
{% Aside 'objective' %}
  1 grid to rule them all 💍
{% endAside %}

In this iteration, we follow our gut and do our best to articulate one grid to handle this macro layout. It looks like we can do **the whole grid with 1 definition using a slotted layout**. We have identifiable elements and grid lines, so let's translate them to [grid-template-areas](<https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas>), **place** our elements in the **defined zones**, and go from there.

<a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v1">
  Codelab: Slotted Macro Layout
</a>

<br><br><br>

###### Let's Code!
## Macro Layout v2 (refactor): Intrinsic Grids
{% Aside 'objective' %}
  2 grids that do less
{% endAside %}

In this refactor, I **pulled the `<header>` element out**. Upon a closer look, I noticed that the `<header>` didnt need to be in a grid at all! It's a full width element from biggest screens to smallest, it's actually baggage / **code debt to be pushing that naturally responsive element into a more complicated layout strategy**.

Post refactor, 1 grid manages the "stack" / top level rows, and the 2nd manages the aside and articles. You could think of it like **2 grids with less responsibility**, **less knowledge** of children, and ultimately takes **less code** to create.

<a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v2">
  Codelab: Intrinsic Grids
</a>




<br><br><br><br>

## Responsive Final Touches
Due to our nice refactor, **our responsive work is pretty minimal**. Nothing needs to be changed on the `<body>`, woh, love it, and the `<main>` grid **only needs a minor adjustment**:

<br>

```css
@media (width < 768px) {
  grid-template-columns: 1fr;
  margin: 0 0 0 1rem;
}
```

<div class="note">
  <b>Plain Speak:</b> When the viewport width is less than 768px, I want a <b>grid</b> with <b>1 full width column</b> and margin only on the left side.
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
