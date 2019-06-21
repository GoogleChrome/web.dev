---
<!-- layout: post -->
title: Macro Layout
authors:
  - adamargyle
subhead: Macro layouts are the top most layouts on the page, like the white space around your white space
description: Macro layouts are the top most layouts on the page, like the white space around your white space
web_lighthouse: N/A
date: 2019-06-10
codelabs:
  - codelab-intrinsic-layout-macro-v1
  - codelab-intrinsic-layout-macro-v2
hero: hero.jpg
hero_position: top
tags:
  - post
  - layout
  - css
---

{% Aside 'key-term' %}
  Macro layouts are the top most layouts of a page. Think of it like **the white space around your white space** or **the forest's layout rather than a tree's layout**.
{% endAside %}


## &#60;Discovery-Phase&#62;
I find overlaying estimated grid lines and tracks on a design pacify the initially overwhelming nature of starting from scratch. I use my wrong initial assumptions to fail fast where it's cheap to retry. I'm not drawing tracks to inform my code, I'm drawing tracks to inform my strategy.

**I don't expect my groupings to be right, but I expect it to help me get to the right solution faster.**

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-initial-estimate%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-initial-estimate.jpg" alt="Full page design mockup with estimated rows and columns highlighted" class="screenshot">
  </picture>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    I used semi-transparent blocks to draw groups, rows and columns. Hot pink areas show overlaps where I can learn about the shared or conflicting grid areas. Gridlines emerge as a result, as well as areas for margin and gap.
  </figcaption>
</figure>

{% Aside 'objective' %}
  Attempt some assertions: semantic assertions, layout assertions, as well as some preliminary concerns.
{% endAside %}

#### Layout Semantics
While translating pixels to elements I like striving towards a semantic baseline by identifying HTML elements that match the intent alluded by the design.

Here's what I see:

- 2 `<nav>`s': 1 at the top, 1 on the side
- A `<main>` should be used to wrap an `<aside>` and an `<article>`
- The `<aside>` should contain a `<nav>`
- Lots of `<img>`'s inside `<figure>`'s' with `<figcaption>`'s
- `<input type="search"/>` in the top bar
- `<button>`s and `<a>`s

These HTML5 elements are pretty typical for me when scaffolding a page, nothing out of the ordinary.

#### Layout Observations
Pointing out consistencies and inconsistencies being presented by the design can help everyone understand more about the intent and structure of the design.

<figure class="w-figure--center" style="margin-bottom:5rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-concerning-estimate%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-concerning-estimate.jpg" alt="problem area exposed" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    Some tricky parts of the layout shown via overlapping tracks
  </figcaption>
</figure>

<figure class="w-figure--center" style="margin-bottom:5rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-rag-right%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-rag-right.jpg" alt="rag right grid shown" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    An <b>asymmetric</b> layout, almost like the whole layout is aligned left and <a href="https://www.fonts.com/content/learning/fontology/level-2/making-type-choices/justified-vs-rag-right" target="_blank">rag right</a>
  </figcaption>
</figure>

<figure class="w-figure--center" style="margin-bottom:5rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-flanking-rails%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-flanking-rails.jpg" alt="common edges highlighted" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    <b>Rails appear to flank</b> a large flexible column
  </figcaption>
</figure>

<figure class="w-figure--center" style="margin-bottom:3rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-extrinsic-estimate%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-extrinsic-estimate.jpg" alt="common edges highlighted" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    <b>Extrinsicly sized</b> rails and sidebar space
  </figcaption>
</figure>

<figure class="w-figure--center" style="margin-bottom:3rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-split%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-split.jpg" alt="common edges highlighted" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    Shipping message is splitting our potentially shared tracks
  </figcaption>
</figure>

#### Layout Concerns
While evaluating the design, concerns can pop up.

1. `<nav>` and `<main>` share column guides but we don't have [subgrid](https://rachelandrew.co.uk/archives/2018/04/27/grid-level-2-and-subgrid/) to enforce or enable shared tracks
1. The rails will need to collapse on mobile changing alignments of the account and brand logo

These concerns are pacified with CSS custom properties, and when subgrid is more common, we can lean on it to help with shared spaces that don't share parent containers.

### Process Recap
Look for alignments, shared spaces, dynamic content areas, and try to see which areas **should** be flexible. Top that off with an intent to **let the content speak for itself** when it can via a [content outward](https://alistapart.com/article/content-out-layout/) layout strategy; let [content length be a breakpoint](http://bradfrost.com/blog/post/7-habits-of-highly-effective-media-queries/#content).

## &#60;/Discovery-Phase&#62;

###### Let's Code!
## Macro Layout v1: A Slotted Layout
{% Aside 'objective' %}
  1 grid to rule them all 💍
{% endAside %}

Let's code one grid to handle this whole macro layout! Judging from our estimated gridlines, it looks like we can do **it with 1 slotted layout via** `grid-template-areas`. In the following Codelab, we'll write the grid, make it responsive, and then throw some chaos at it to test it's resilience.

What we make works, and there's aspects of it that are great, but it ends up being tedious.

<!-- <a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v1">
  Codelab: Slotted Macro Layout
</a> -->

{% Aside 'codelab' %}
  [Slotted Macro Layout](/codelab-intrinsic-layout-macro-v1)
{% endAside %}

<br><br>

###### Let's Code!
## Macro Layout v2 (refactor): Intrinsic Grids
{% Aside 'objective' %}
  2 grids that do less
{% endAside %}

In the following refactor Codelab, one grid manages the vertical "stack" and another grid manages the horizontal stack. We add an additional element, `<main>`, which not only adds some nice semantics to our markup, but isolates the 2 nodes that need to be horizontally layed out: `<aside>` and `<article>`. Throwing chaos at this layout has no effect, grid doesn't know or care how many elements there are in those stacks, they're just flow and spacing.

Less CSS, less responsible CSS, plus more flexibility 👍

<!-- <a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v2">
  Codelab: Intrinsic Macro Grids
</a> -->

{% Aside 'codelab' %}
  [Intrinsic Macro Grids](/codelab-intrinsic-layout-macro-v2)
{% endAside %}

## Conclusion
The refactored v2 of our macro layout is less code, less assumptive and will scale well as new children get introduced. It's counterintuitive too, because 1 single grid sounds like less to manage than 1 grid (our original goal). The code and the chaos shown in the 2 Codelab's illuminate the issues of the single grid strategy.

The refactor also relinquishes some of the control the `grid-template-areas` implementation had over the content, **by defining less**. Instead of creating boxes and shoving content in, we create containers mostly responsible for flow and spacing.

#### Results
- Container children can **change node names, position or length** and **no grid code needs modified** (aka less assumptive)
- Selectors **know less**
- Less `grid-template-columns`
- Less code in media queries
- Less to think about
- Less to manage

### Did we match our estimated grid lines!? Nope! 😹

Turns out my original guesses on grid lines were off.. **what's new**! So what did we end up with after all this work?

### Top Level Vertical Grid (Grid #1)

```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;

  & > :matches(.greeting, main) {
    margin-left: var(--body-rails);
  }

  @media (width <= 768px) {
    & > .greeting {
      margin: 0 1rem;
    }
  }
}
```

{% Compare 'better', 'Advantages' %}
Just flow/direction and spacing
{% endCompare %}

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro2-margin-rows%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro2-margin-rows.jpg" alt="rows overlayed on the design comp reflecting what CSS grid is making" class="screenshot">
  </picture>
</figure>

### Main Level Horizontal Grid (Grid #2)

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

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v2-margins%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v2-margins.jpg" alt="Main grid simplified to 2 columns" class="screenshot">
  </picture>
</figure>

### All Together

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-layout-recap.gif" alt="gif showing columns and rows across desktop and mobile" class="screenshot">
  </picture>
</figure>

{% Compare 'better', 'Result' %}
Devtools highlighting the 2 grids and showing them respond from desktop to mobile
{% endCompare %}
