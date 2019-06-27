---
layout: codelab
title: "Macro Layout v2 (refactor): Intrinsic Grids"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v2
related_post: intrinsic-layout-macro
---

**In this refactor** I want to try and:
- reduce our selector [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- reduce the amount of code in media queries
- move away from defining extrinsic boxes (where it makes sense)

{% Aside 'gotchas' %}
  This codelab is 2/2, in case you missed 1/2, you can find it below
{% endAside %}

{% Aside 'codelab' %}
  [Previous Codelab (v1): A Slotted Layout](/codelab-intrinsic-layout-macro-v1)
{% endAside %}

#### Let's break it down
## 1. `<body>` Layout
Our **top level macro grid** is the `<body>`. In the [previous codelab](/codelab-intrinsic-layout-macro-v1), adding a `<footer>` was an issue because it didn't just append to the vertical layout stack. Let's fix that by defining a grid that knows less about the children. It's best if the grid on body just **creates directionality** for the highest level elements and the **spacing between** them.

#### The HTML
To support the refactor to vertical rhythm and spacing, I've updated our HTML structure. I've wrapped the `<aside>` and `<article>` in a `<main>` tag:

```html/5-8/3-4
<body>
  <nav>...</nav>
  <h2>Free Shipping in U.S.</h2>
  <aside>...</aside>
  <article>...</article>
  <main>
    <aside>...</aside>
    <article>...</article>
  </main>
</body>
```

It's interesting how a refactor to simpler layouts may have enhanced our semantic markup. The `<main>` tag totally makes sense as a wrapper, and it allows us to space both those children at the same time. Our goal of "1 grid to rule them all" in v1 lead us to changing our markup to meet the needs of our CSS. This has been reversed, **now our CSS can meet the needs of our HTML.**

#### The CSS
See `app/css/layouts/body.css` in the Glitch embed.

```css/2-7/4-31
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;

  & > :matches(.greeting, main) {
    margin-left: var(--body-rails);
  }

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
}
```

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro2-margin-rows%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro2-margin-rows.jpg" alt="rows overlayed on the design comp reflecting what CSS grid is making" class="screenshot">
  </picture>
</figure>

#### Grid in Plain Speak:
I want a **grid of rows** with a **2rem gap**. Also, 2 elements need special spacing treatment, give them a left margin which simulates a left rail.

No magic in that grid, in fact, we practically don't even need the grid here. Children are laying out like block level elements naturally do, or would, without grid. BUT! **We get gap**, and I like gap.

I think it's worth noting here too that I didn't need to number the example image rows because our grid isn't creating specific tracks. Our grid now has no idea how many or what type the children are. **Pretty drastic simplification which unlocks the ability for the layout to scale and adapt on it's own.**

{% Aside 'note' %}
  I prefer when containers manage spacing. Some may want the `.greeting` or `<main>` to manage the margin in this case, but I think it's best when components only know about their internal spacing. **Containers have more context, they're the orchestrators of space.**
{% endAside %}

## Code Review
#### Macro intrinsic layout pros 👍
1. Just rows
1. Just gaps
1. **Add more elements and layout continues to work great**
1. Respectful rows that don't enforce a height
1. Fallback is straight forward
1. **Just flow and spacing**

#### Macro intrinsic layout cons 👎
1. **No more rails** (not really a con, but doesn't match the mental model my design brain had)
1. **Dinky**, it's barely doing anything (this a con? lol, perhaps to some?)

Cool, so our rows are taken care of. Let's checkout what we need to do to match the column styles we achieved in v1.

#### Let's break it down
## 2. `<main>` Layout

We've spaced our big elements vertically, leaves us with 1 more large macro layout to create. In our first version we had rails with placed elements. We've already gotten rid of the rails in favor of margin, now I'd like to **not place elements** this time.

#### The CSS
See `app/css/layouts/main.css` in the Glitch embed.

```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
}
```

<figure class="w-figure">
  <picture>
    <source type="image/jpeg" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v2-margins%402x.jpg 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/macro-v2-margins.jpg" alt="Main grid simplified to 2 columns" class="screenshot">
  </picture>
</figure>

#### Grid in Plain Speak:
I want a **grid** with **2 columns**, the **first at a fixed width** and the **2nd filling** the remaining space.

Another drastically simplified grid: 2 columns. The concept of "rails" we had in the 1st layout is gone now and this `<main>` relies on the parent container to use margin to simulate those rails. Less code, less to think about, smaller sets of responsibility.

## Code Review
#### Pros 👍
1. **Cut** the amount of **columns** to manage **in half**
1. **Cut** down the **complexity**
1. **Cut** the **LoC** down to 2
1. Media queries need to **know much less**

#### Cons 👎
1. Margin in place of a column? Aren't we here to learn about CSS grid?

## Responsive Final Touches
Our tasks at a high level are to remove the heavy left margin and stack our aside and articles. :cracks knuckles:

```css/9-13
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

#### CSS in plain speak:
When the viewport is less than or equal to `768px`, then select any direct descendants of the `body` that match `.greeting` and adjust the margin to `1rem` on left and right. TLDR; on mobile/portrait tablet, make sure the greeting text doesn't touch viewport edges.

You might be thinking I forgot to adjust the `<main>` element, but I've got a trick up my sleeve.

```css/4-6
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;

  @media (width <= 768px) {
    display: contents;
  }
}
```

#### CSS in plain speak:
When the viewport is less than or equal to `768px`, act as if the `main` tag doesn't exist and inherit the parent elements layout. This has the effect of hoisting the aside and article up to children of the `<body>`, therefore inheriting the grid styles we placed there, which is just rows and gaps. **We piggy back onto the intrinsic and unassuming grid that's managing the spacing of our top most layout**. Kinda neat!

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-macro/webdev-macro-layout-v2-recap2.gif" alt="gif demoing responsive nature of the layout going from columns to a stack" class="screenshot">
  </picture>
</figure>

## Chaos Time 😈

{% Aside 'warning' %}
  Changes from the design team! 😲
{% endAside %}

{% Aside 'objective' %}
**Remix the codelab to the right** and complete the following tasks
{% endAside %}

1. Uncomment the `<footer>` in `app/index.html`
1. Author new CSS in `app/css/layouts/body.css` to put the `<footer>` into the proper place in the grid (below `<main>`)
1. Ensure the layout still works on mobile
1. **Extra:** remove other HTML, like the `<nav>` and observe the effect it has on our layout. Poke it, prod it, feel out it's resilience to change and turbulence.

{% Aside 'gotchas' %}
  Click the **Remix To Edit** button to make the project editable
{% endAside %}

## Conclusion
We couldn't shake all the specificity in this refactor, or more literally, our body styles still reach into the child list and specifically target elements and apply styles, but it's much less than our first version. This refactor let us unlock a few interesting follow up gains: adding a `<footer>` was a piece of cake, and our nested grid got to inherit and opt into the parent flow.

I also felt like the amount of work our media queries were doing matches the amount I expected it to take. At the end of the day, this layout doesn't need to adjust a whole lot, it's decently ready for small and large screens as is. It was unfortunate in our first layout how much we needed to change, as opposed to our refactor which only needed 2 lines of code.

#### TLDR;
- We removed some grid
- We removed lines of code
- We removed issues around adding content
- **We did less and got more**

For a guide about learning how to do modern layouts, I found it interesting that removing layout code ended up getting us further than adding more. I think you'll find that's a common theme throughout this guide. I get grid happy because it's so much fun to author, but I like working my way out of strict tracks as they can get me into tricky scale issues as my design or site evolve.

This is why I like introducing chaos, we need our layouts to withstand not only user generated content (which we'll heavily tackle in some of the other layouts), but we also need to be flexible when design changes happen.
