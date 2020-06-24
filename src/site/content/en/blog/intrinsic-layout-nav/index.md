---
title: Intrinsic Navbar Layout
subhead: An accessible, resilient and flexible navigation component
authors:
  - adamargyle
description: >
  From a picture of a navbar, to having a navbar
web_lighthouse: N/A
date: 2019-06-14
hero: hero.jpeg
tags:
  - post
  - layout
  - css
---

Design gave us this.

<figure class="w-figure">
  <picture>
    <source type="image/png" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/comp@2x.png 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/comp.png" alt="image of the navigation bar design">
  </picture>
</figure>

{% Aside 'objective' %}
  Our goal is to translate that vision into a tangible, inclusive and responsive component.
{% endAside %}

Good layout and components start with supporting HTML. From our design image we see icons, images, brand names, and search bars. Let's try to include as many of those nouns as possible in our HTML.

**HTML Macro View**
```html
<nav>
  <picture>...</picture>
  <brand>ten hundred</brand>
  <search>...</search>
  <icon-button-list>...</icon-button-list>
  <button large-icon profile>...</button>
</nav>
```

{% Details %}

{% DetailsSummary %}
See full HTML
{% endDetailsSummary %}

```html
<nav>
  <picture>
    <source type="image/webp" srcset="img/brand/10hun@2x.webp 2x, img/brand/10hun.webp 1x"/> 
    <source type="image/png" srcset="img/brand/10hun@2x.png 2x, img/brand/10hun.png 1x"/>
    <img width="35" height="35" src="img/brand/10hun.png" alt="10hun logo" loading="lazy" intrinsicsize>
  </picture>
  <brand>ten hundred</brand>
  <search>
    <input type="search" placeholder="Search" autofocus>
    <svg viewbox="0 0 24 24">
      <path class="primary" d="M15.5 14l4.99 5L19 20.49l-5-4.99v-.79l-.27-.28A6.471 6.471 0 0 1 9.5 16 6.5 6.5 0 1 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27h.79zm-6 0c2.49 0 4.5-2.01 4.5-4.5S11.99 5 9.5 5 5 7.01 5 9.5 7.01 14 9.5 14z"></path>
    </svg>
  </search>
  <icon-button-list>
    <button small-icon search>
      <svg viewbox="0 0 24 24">
        <path class="primary" d="M15.5 14l4.99 5L19 20.49l-5-4.99v-.79l-.27-.28A6.471 6.471 0 0 1 9.5 16 6.5 6.5 0 1 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27h.79zm-6 0c2.49 0 4.5-2.01 4.5-4.5S11.99 5 9.5 5 5 7.01 5 9.5 7.01 14 9.5 14z"></path>
      </svg>
    </button>
    <button small-icon watch>
      <svg viewbox="0 0 24 24" class="icon-videocam">
        <path class="secondary" d="M13.59 12l6.7-6.7A1 1 0 0 1 22 6v12a1 1 0 0 1-1.7.7L13.58 12z"/>
        <rect width="14" height="14" x="2" y="5" class="primary" rx="2"/>
      </svg>
    </button>
    <button small-icon cart>
      <svg viewbox="0 0 24 24" class="icon-shopping-cart">
        <path class="secondary" d="M7 4h14a1 1 0 0 1 .9 1.45l-4 8a1 1 0 0 1-.9.55H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
        <path class="primary" d="M17.73 19a2 2 0 1 1-3.46 0H8.73a2 2 0 1 1-3.42-.08A3 3 0 0 1 5 13.17V4H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v10h11a1 1 0 0 1 0 2H6a1 1 0 0 0 0 2h12a1 1 0 0 1 0 2h-.27z"/>
      </svg>
    </button>
  </icon-button-list>
  <button large-icon>
    <svg viewbox="0 0 24 24" class="icon-user-circle">
      <circle cx="12" cy="12" r="10" class="secondary"/>
      <path class="primary" d="M3.66 17.52A5 5 0 0 1 8 15h8a5 5 0 0 1 4.34 2.52 10 10 0 0 1-16.68 0zM12 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
    </svg>
  </button>
</nav>
```

{% endDetails %}

Let's use CSS to create healthy constraints for these elements. Let's dive straight into some layout code and then break each part down.

```css
:root {
  --body-rails: 4rem;
  --sidebar-width: 12rem;
  --search-width: 24rem;
}

nav {
  min-block-size: var(--body-rails);
  display: grid;
  align-items: center;
  grid-template-columns:
    [logo] var(--body-rails)
    [brand] minmax(min-content, var(--sidebar-width))
    [search] minmax(min-content, var(--search-width))
    [buttons] 1fr
    [profile] var(--body-rails);

  & > :is(:first-child, :last-child) {
    justify-self: center;
  }
}
```

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <source type="image/png" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/highlevel-overview@2x.png 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/highlevel-overview.png" alt="each image of the column is labeled and it's bounds are shown to help visualize the columns created by grid">
  </picture>
</figure>

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/intrinsic-nav-before-responsive.gif" alt="demo gif showing navbar expanding and collapsing, some elements mash together and then go off screen" class="screenshot">
  </picture>
</figure>

<!-- Watching this closely, the brand text as it get's crunched, it **won't squeeze any smaller than it's longest word**. Same with the search bar, it can't be smaller than input padding box. This is a value proposition of `min-content`, like a "safe minimum".  -->

There's a few issues to resolve but we made it all the way down to `400px` so far, which is pretty small! There's 2 search icons instead of 1 and we're overflowing the viewport at small widths. Let's break down the layout we have and then finish our mobile styles. 

### 1<sup>st</sup> Column › Brand Logo

<figure class="w-figure">
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column1.png" alt="" class="screenshot">
</figure>

```css/3
nav {
  ...
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);
  ...
}
```

This column get's it height from the parent nav, which also happens to be the same CSS variable we used for the width. **Gives us a nice square!** The nav already articulated vertical centering for all children, but we horizontally center via the `:matches() ` selector that's telling the first and last element in the nav to be horizontally centered. **Result is a very symmetrical and perfectly centered logo**.

### 2<sup>nd</sup> Column › Brand Name

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column2.png" alt="" class="screenshot">
</figure>

```css/4
nav {
  ...
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);
  ...
}
```

**Clamp** this column to a minimum of it's own intrinsic width and to a maximum of the desired width of our sidebar. `min-content` ensures that when space gets limited, **allow line breaks but not word breaks**. If this concept is still fuzzy, try playing and changing `min-content` to `max-content` in the below codelab! It's a great place to feel out the capabilities within these intrinsic words.

{% Aside 'codelab' %}
  [min-content / max-content sandbox](/codelab-intrinsic-layout-nav/)
{% endAside %}

### 3<sup>rd</sup> Column › Search

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column3.png" alt="" class="screenshot">
</figure>

```css/5
nav {
  ...
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);
  ...
}
```

This should look familiar now 😏 Same scenario as our brand name, we want to **be respectful of our contents min-width**, while also **giving it a safe area to grow** per our design. We may end up changing away from a minimum of min-content because our breakpoint appears to be happening before that time. But we'll see, for now it's **a great safe intrinsic default**.

### 4<sup>th</sup> Column › Global Actions

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column4.png" alt="" class="screenshot">
</figure>

```css/6
nav {
  ...
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);
  ...
}
```

A flexible column that says "gimme allllll the rest!" The reason `1fr`, which means 1 fraction of the left over, is consuming "the rest" of the space is because there're no other `fr`'s to compete against. `1fr` in this case is a succinct way to say "be liquid and fill anything left over in the viewport; aka, grow until you hit a wall." We could probably get away with `auto` or `100%` or even `10000000fr`, but I prefer the succincness of `1fr`.

### 5<sup>th</sup> Column › Account Session

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column5.png" alt="" class="screenshot">
</figure>

```css/7
nav {
  ...
  grid-template-columns:
    var(--body-rails)
    minmax(min-content, var(--sidebar-width))
    minmax(min-content, var(--search-width))
    1fr
    var(--body-rails);
  ...
}
```

Same story as column 1, the brand logo. Be the same tall as you are wide, align center center.

## Responsive Final Touches

So far our grid layout algorithm is liquid, and it's gotten us pretty far, but it's time to shift to an **adaptive approach.** Our small viewport needs to see less, not just have less space.

Our **search input** is consuming too much space on mobile, and you may have been wondering why there was a 2nd search button in the header thus far. We're going to maintain those 2 search interaction elements so that only 1 is visible at a time. The search button can invoke a more dedicated mobile search experience that **doesnt need to squish into a tiny pill** like we see our input doing right now.

Additionally to save space, we can shed the text version of our brand "Ten Hundred" and let the logo do the talkin'.

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/macro-nav-layout-preview.gif" alt="demo gif showing small screen and large screen nav layout" class="screenshot">
  </picture>
</figure>

{% Aside %}
  Viewport is being resized down to 240px
{% endAside %}

### Search Adaptive CSS

```css
nav {
  ...

  /*
    if the width is above 500px (not mobile)
    then hide the search icon button
  */
  @media (width >= 500px) {
    & > icon-button-list > button[search] {
      display: none;
    }
  }

  /*
    if the width is below 500px (mobile)
    then, search, hold the column but consume no width
  */
  @media (width <= 500px) {
    & > search {
      width: 0;
      overflow: hidden;
    }
  }
}
```

### Brand Adaptive CSS
```css
nav {
  ...
  /*
    if the width is less than 350px
    then, brand, hold the column but consume no width
  */
  @media (width <= 350px) {
    & > brand {
      width: 0;
      overflow: hidden;
    }
  }
}
```

{% Aside 'gotchas' %}
  I don't think this strategy of holding columns with 0 width is pretty, but it get's the job done and does create a mental model that's easy to visualize
{% endAside %}

My favorite part about this solution is that **the layout code is never touched!** We adjust elements at a few viewports, but it's a small price to pay from a component that can handle 240px to 1600px+.

1 CSS grid layout definition for desktop to tiny phone 👍

## Conclusion

`minmax()` really does most the work here to let that desktop layout still squeeze within reason down to mobile. Our layout doesn't even know (or need to know) that children are showing and hiding themselves. We created a resilient layout system.

<div class="glitch-embed-wrap" style="height: 200px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/intrinsic-layout-nav?path=index.html&previewSize=100&attributionHidden=true"
    alt=""
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

**All Together**
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
    & > icon-button-list > button[search] {
      display: none;
    }
  }

  @media (width <= 500px) {
    & > search {
      width: 0;
      overflow: hidden;
    }
  }

  @media (width <= 350px) {
    & > brand {
      width: 0;
      overflow: hidden;
    }
  }
}
```

This navbar has been great example of **liquid and adaptive responsive tactics working together**. I generally find there's a harmony between those strategies and not a competition.
