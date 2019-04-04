---
page_type: guide
title: Summary
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

# Summary



[final glitch]



We built **macro layouts**, we build **micro layouts**, we **chaos** tested, we **mobilized**, we **strategized** and we **conquered**. We found some o**rganic harmonies between flexbox and grid**. We **refactored** extrinsic layouts to intrinsic ones. We found **meaningful** use cases for extrinsic **heights**. Ultimately we really dug into some day to day, practical layout work and learned a ton of great stuff along the way.



![adventure time dancing GIF](https://media3.giphy.com/media/10bxTLrpJNS0PC/giphy.gif?cid=3640f6095c9946a8466466546b017b0e)









<p style="text-align: center; font-weight: bold; font-size: 2rem;">All our CSS grids, in 1 GIF!</p>



![intrinsic-final-overview-tall](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-final-overview-tall.gif)







## TLDR;

### Macro Layouts

We laid down some layout code for our **outer most grids first** and created **CSS variables for layouts to share values** for consistency. CSS Grid was able to do the entire macro layout with a slotted layout strategy, but we refactored and were able to achieve the same layout with 2 smaller grids. We gained an easier browser fallback scenario and less code to modify in a media query.



**Top Level Grid**

> just flow and spacing

```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;
}
```

![macro – body grid](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/macro%20%E2%80%93%20body%20rows.png)





**Main Level Grid**

> used only 2 columns, used margin to simulate shared column with nav

```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  margin: 0 var(--body-rails);

  @media (width < 768px) {
    grid-template-columns: 1fr;
    margin: 0 0 0 1rem;

    & > aside {
      overflow-x: auto;
    }
  }
}
```

![macro – less grids more margin](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/macro%20%E2%80%93%20less%20grids%20more%20margin.png)









### Micro Layouts

Turns out **the majority of our layout work is spent in micro layouts**! They even end up being some of the more complex tasks.



#### Nav Layout

> Flat HTML structuring let us use 1 grid for the whole navbar

```css
nav {
  height: var(--body-rails);
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);

  & > :matches(:first-child, :last-child) {
    justify-self: center;
  }

  @media (width >= 500px) {
    .search > button {
      display: none;
    }
  }

  @media (width <= 500px) {
    .search {
      justify-self: flex-end;

      & > :matches(svg, input) {
        display: none;
      }
    }
  }
}
```

![micro - nav](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/micro - nav.png)

![intrinsic-nav-responsive-after-breakpoint](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-nav-responsive-after-breakpoint.gif)



#### Sidebar Layout

> Intrinsic interactive areas with easy flexbox direction pivot on mobile

```css
aside > nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > a:not(:last-of-type) {
    margin-bottom: 1.25rem;
  }

  @media (width < 768px) {
    flex-direction: row;

    & > a:not(:last-of-type) {
      margin-right: 1.25rem;
    }
  }
}
```

![intrinsic-aside-flexbox](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-aside-flexbox.gif)



#### Grouped ListView

> A grid of grids, a list of lists: 2 dimensional array layout

```css
article {
  display: grid;
  gap: 5rem;
}
```

![groupedlist-highlighted](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/groupedlist-highlighted.png)



#### Chips Layout

> Auto height, fixed width, scroll snapping grid

```css
chips {
  display: grid;
  grid-auto-columns: 20rem;
  grid-auto-flow: column;
  gap: 1rem;
}
```

![intrinsic-chips](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-chips.gif)



#### Hero Products List(s)

> Extrinsic equally spaced and equally sized squares

```css
hero-products-list {
  display: grid;
  gap: 1rem;
  grid-auto-flow: column;
  grid-auto-columns: 20rem;
  grid-template-rows: 20rem;
}
```

![fresh-releases-grid](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/fresh-releases-grid.gif)





#### Hero Featured

> Slotted grid with auto and equal heights

```css
hero-featured {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "card mural1"
    "card mural2";

  & > .mural-card:first-of-type { grid-area: mural1; }
  & > .mural-card:last-of-type  { grid-area: mural2; }

  @media (width < 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'card'
      'mural1'
      'mural2';

    padding-right: 1rem;
  }
}
```

![featured-stuff-responsive](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/featured-stuff-responsive.gif)





#### Chip

> Grid on the outside

```css
figure {
  display: grid;
  grid-auto-flow: column;
  gap: 0.5rem;
}
```

![chip-grid](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/chip-grid.png)



#### Chip Caption

> Flex on the inside

```css
figcaption {
  display: flex;
  flex-direction: column;
  text-align: right;

  & p {
    flex: 2;
    display: inline-flex;
    align-items: center;
  }
}
```

![intrinsic-chip-flexbox](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-chip-flexbox.gif)



#### Cards

> Grid and Flexbox combo **again**!

```css
deal-card {
  grid-area: card;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div:first-child {
    display: grid;
    gap: 1rem;
    grid-template-columns: auto 1fr;
    padding: 1rem;
  }
}
```

![card-chaos-test](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/card-chaos-test.gif)





#### Mural Grid

> Grid FTW

```css
.mural-card {
  display: grid;

  & > figcaption {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: flex-end;
    align-self: flex-end;
    gap: 1rem;
    padding: 1rem 2rem;
  }

  & p {
    display: inline-grid;
    gap: 0.5rem;
    grid-auto-flow: column;
    align-items: baseline;
  }
}
```





![intrinsic-feature-card-chaos](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/intrinsic-feature-card-chaos.gif)




# Learn More
#### TODO
Intrinsic has a few synonyms or alternative implecations and meanings I want to share quickly too, since I think they can really help you shape a mental model of what we're going for:
1. [Intrinsic web design](https://twitter.com/jensimmons/status/980980521848127488?lang=en)
1. [Content centric/outward layout](http://bradfrost.com/blog/post/7-habits-of-highly-effective-media-queries/)
1. [Resilient CSS](https://www.smashingmagazine.com/2017/03/resilient-web-design/)
1. Courteous CSS: okay, this one's mine 🤓




# Conclusion

**I hope this article helps you grok intrinsic layout**. It's definitely a bit more tricky to learn at first, but with **patience** and **play**, I think you'll find it has big payoffs. Let's respect out content, prepare for change, and ultimately **create resilient front end layouts** that can stand the test of time and variability.



**CSS**

```css
.retort {
  display: grid;
  grid-template-columns: minmax(min-content, 1fr);
  border: 2px solid hsl(0,0%,10%);
  padding: 1rem;
}
```



![css-is-awesome](/Users/argyle/design/tenhun/comps/intrinsic-store-exports/css-is-awesome.gif)
