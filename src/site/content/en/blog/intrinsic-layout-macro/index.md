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

**I don't expect my groupings to be right, but I expect it to help me get to the right solution faster.** It's a discovery phase where I'm learning the relationships between elements by grouping them (probably wrong), and adjusting.

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
  After drawing a few estimated gridlines and getting more familiar with their relationship, I'm ready to attempt some assertions. I've got semantic assertions, some observation assertions, as well as some preliminary concerns to be mindful of as we continue.
{% endAside %}

#### Layout Semantics
Goal here is to identify HTML elements that match the intent alluded to by the design. For me it's a typical translation task, where I'm translating elements and interactions from the pixels to the web, aka the HTML provided base elements that serve those purposes.

- 2 `<nav>`s': 1 at the top, 1 on the side
- A `<main>` should be used to wrap an `<aside>` and an `<article>`
- The `<aside>` should contain a `<nav>`
- Lots of `<img>`'s inside `<figure>`'s' with `<figcaption>`'s
- `<input type="search"/>` in the top bar
- `<button>`s and `<a>`s

#### Layout Observations
These are places for me to aknowledge the consistencies and inconsistencies being presented by the design. These help inform my decisions as well as my refactors. It's also fun!

<figure class="w-figure--center" style="margin-bottom:5rem;">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-concerning-estimate%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-concerning-estimate.jpg" alt="problem area exposed" class="screenshot">
  </picture>
  <figcaption class="w-figcaption">
    These are the isolated overlapping zones I found when estimating tracks which expose some of the tricky parts we'll need to deal with
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

<figure class="w-figure--center" style="margin-bottom:3rem;">
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
1. Our `<aside>` and site name share the same column, but they're in different places in the DOM tree
1. `<nav>` and `<main>` share column guides but we don't have [subgrid](https://rachelandrew.co.uk/archives/2018/04/27/grid-level-2-and-subgrid/) to enforce or enable shared tracks
1. The rails will need to collapse on mobile changing alignments of the account and brand logo

#### Process Recap
I don't have a systemic process to share in regards to these assertions. I look for alignments, shared spaces, dynamic content areas, and I try to see which areas **should** be flexible. Top that off with an intent to **let the content speak for itself** when it can with a [content outward](https://alistapart.com/article/content-out-layout/) layout strategy, let [content length be a breakpoint](http://bradfrost.com/blog/post/7-habits-of-highly-effective-media-queries/#content).

Even if my first layout works great, I like going back and looking for places to optimize: trim logic, code, or whatever. **Just like I do in my Javascript.**

## &#60;/Discovery-Phase&#62;

###### Let's Code!
## Macro Layout v1: A Slotted Layout
{% Aside 'objective' %}
  1 grid to rule them all 💍
{% endAside %}

Let's follow our gut and code one grid to handle this whole macro layout. Judging from our estimated gridlines, it looks like we can do **it with 1 slotted layout via** `grid-template-areas`. We have identifiable elements and grid lines, so let's translate them to [grid-template-areas](<https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas>) and **place** our elements in the **defined zones**. We'll also write some media queries so this layout can handle mobile viewports. Lastly take a design challenge to add a footer once we're all done, see how our layout can handle an additional macro layout element.

What we make works, and there's aspects of it that are great, but it's tedious and needy nature emerge as we respond to mobile and add a new element.

<!-- <a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v1">
  Codelab: Slotted Macro Layout
</a> -->

{% Aside 'codelab' %}
  [Slotted Macro Layout](/codelab-intrinsic-layout-macro-v1)
{% endAside %}

###### Let's Code!
## Macro Layout v2 (refactor): Intrinsic Grids
{% Aside 'objective' %}
  2 grids that do less
{% endAside %}

In this refactor, I removed `grid-template-areas` code, pulled the `<h2 class="greeting">` element out from grid's control and added a `<main>` element. Upon a closer look, I noticed that the `<h2 class="greeting">` didnt need to be in a grid at all, it's a full width element from biggest screens to smallest. The `<main>` tag not only adds some nice semantics to our markup layout, but isolates the 2 nodes that need to be horizontally layed out: `<aside>` and `<article>`. **Felt like I overarchitected the first grid** / incurred code debt to be pushing naturally responsive elements into a more complicated slot based layout.

Post refactor, 1 grid manages the vertical "stack" and the 2nd manages the aside and article. Less CSS, less responsible CSS, and more flexibility. Really shows it's true colors when chaos shows up.

<!-- <a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v2">
  Codelab: Intrinsic Macro Grids
</a> -->

{% Aside 'codelab' %}
  [Intrinsic Macro Grids](/codelab-intrinsic-layout-macro-v2)
{% endAside %}

## Conclusion
The refactored v2 of our macro layout is less code, less assumptive and will scale well as new children get introduced. **We've relinquished some of our control over the content** by defining less areas with specific widths, and instead, defining containers mostly responsible for spacing and direction.

#### Results
- Container children can **change node names, position or length** and **no grid code needs modified** (aka less assumptive)
- Selectors **know less**
- Less `grid-template-columns`
- Less code in media queries
- Less to think about
- Less to manage

#### Did we match our estimated grid lines!? Nope! 😹

Turns out my original guesses on grid lines were off.. **what's new**! Here are the designs with **updated grid lines** based on the learnings from development which also accurately reflect the refactored results.

### Top Level Grid

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
