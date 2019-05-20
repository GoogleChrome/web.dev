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


## &#60;Discovery-Phase&#62;
I find overlaying estimated macro grid tracks and areas on a design pacify the initially overwhelming nature of starting from scratch. I use my wrong initial assumptions to fail fast where it's cheap to retry. I'm not drawing tracks to inform my code, I'm drawing tracks to inform my strategy.

**I don't expect my groupings to be right, but I expect it to help me get to the right solution faster.** It's a discovery phase where I'm learning the relationships between elements by grouping them (probably wrong), and adjusting.

<figure class="w-figure w-figure--fullbleed">
  <img src="macro.png" alt="Full page design mockup with estimated rows and columns highlighted" class="screenshot">
</figure>

{% Aside 'objective' %}
  After drawing a few estimated gridlines and getting more familiar with their relationship, I'm ready to attempt some assertions. I've got semantic assertions, some observation assertions, as well as some preliminary concerns to be mindful of as we continue.
{% endAside %}

<br>

#### Layout Semantics
1. 2 `<nav>`s': 1 at the top, 1 on the side
1. A `<main>` should be used to wrap an `<aside>` and an `<article>`
1. The `<aside>` should contain a `<nav>`
1. Lots of `<img>`'s inside `<figure>`'s' with `<figcaption>`'s
1. `<input type="search"/>` in the top bar
1. `<button>`s and `<a>`s

<br>

#### Layout Observations
1. An **asymetric** layout
1. **Rails** are **flanking** a large flexible column <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – flanking rails.png" alt=""></figure>
1. Rails and aside look like **fixed** **columns** <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – fixed widths.png" alt=""></figure>
1. Free shipping message **spans 2 columns** <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – greeting span.png" alt=""></figure>
1. Greeting message is **splitting** our potentially **shared columns** from `<nav>` to `<main>` <br><figure style="text-align:center; margin: 1rem 0 3rem;" class="screenshot"><img src="macro – body split.png" alt=""></figure>

<br>

#### Layout Concerns
1. Our side `<aside>` and site name share the same column, but they're in different places in the DOM tree
1. `<nav>` and `<main>` share column guides but we don't have [subgrid](https://rachelandrew.co.uk/archives/2018/04/27/grid-level-2-and-subgrid/) to enforce or enable shared tracks
1. The rails will need to collapse on mobile changing alignments of the account and brand logo

<br><br>

I don't have a systemic process to share in regards to these assertions. I look for alignments, shared spaces, dynamic content areas, and I try to see which areas **should** be flexible. Top that off with an intent to **let the content speak for itself** when it can with a **content outward** layout strategy, let content length be a breakpoint.

Even if my first layout works great, I like going back and looking for places to optimize: trim logic, code, or whatever. **Just like I do in my Javascript.**

## &#60;/Discovery-Phase&#62;


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

In this refactor, I pulled the `<header>` element out. Upon a closer look, I noticed that the `<header>` didnt need to be in a grid at all! It's a full width element from biggest screens to smallest. **Felt like I overarchitected the first grid** / incurred code debt to be pushing that naturally responsive element into a more complicated layout.

Post refactor, 1 grid manages the "stack" and the 2nd manages the aside and articles.

<a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v2">
  Codelab: Intrinsic Macro Grids
</a>




<!-- <br><br><br><br>

## Responsive Final Touches
TODO: move into codelabs

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
</figure> -->






<br><br><br><br>

## Conclusion
The refactored v2 of our macro layout is less code, less assumptive and will scale well as new children get introduced. **We've relinquished some of our control over the content** by defining less areas with specific widths, and instead, defining containers mostly responsible for spacing and direction.

#### Results
- Container children can **change node names, position or length** and **no grid code needs modified** (aka less assumptive)
- Selectors **know less**
- Less `grid-template-columns`
- Less code in media queries
- Less to think about
- Less to manage

<!-- <br><br>

**Final Macro Layout**
<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<br><br>

**Play with that Glitch a bit!** Resize your browser. Use the devtools to visualize the grid spaces! -->

<br>

#### Did we match our estimated grid lines!? Nope! 😹

Turns out my original guesses on grid lines were off.. **what's new**! Here are the designs with **updated grid lines** based on the learnings from development which also accurately reflect the refactored results.

<br>

### Top Level Grid

```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;

  @media (width > 768px) {
    & > :matches(.greeting, main) {
      margin-left: var(--body-rails);
    }
  }
}
```

{% Compare 'better', 'Advantages' %}
Just flow/direction and spacing
{% endCompare %}

<figure class="w-figure w-figure--fullbleed">
  <img src="macro – body rows.png" alt="">
</figure>


<br><br>

### Main Level Grid

```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;

  @media (width <= 768px) {
    display: contents;
  }
}
```

{% Compare 'better', 'Advantages' %}
2 columns with margin, 1 extrinsic (`<aside>`) the other fluid
{% endCompare %}

TODO: update graphic to only be the main grid and not have the header. consider making margin a different color and being consistent with column visuals

<figure class="w-figure w-figure--fullbleed">
  <img src="macro – less grids more margin.png" alt="">
</figure>

<br><br>

### All Together

TODO: better gif of results

{% Compare 'better', 'Result' %}
Devtools highlighting the 2 grids and showing them respond from desktop to mobile
{% endCompare %}

<figure class="w-figure w-figure--fullbleed">
  <img src="intrinsic-macro-1.gif" alt="">
</figure>
