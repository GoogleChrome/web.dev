---
title: Intrinsic Navbar Layout
subhead: A resilient and flexible navigation component
authors:
  - adamargyle
description: Grid, minmax(), min-content, and fr units make this intrinsic task straight forward
web_lighthouse: N/A
date: 2019-06-14
hero: hero.jpeg
tags:
  - post
  - layout
  - css
---

{% Aside 'objective' %}
  Build this component's layout to respond to large (1600px+) and tiny (240px) sized viewports.
{% endAside %}

<figure class="w-figure">
  <picture>
    <source type="image/png" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/comp@2x.png 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/comp.png" alt="image of the navigation bar design">
  </picture>
</figure>

In order to be content centric, we need content to work with! That means we start by writing HTML. Flat and semantic HTML as a starting point is healthy, so let's author that and start there.

**HTML**
```html
<nav>
  <picture>...</picture>
  <brand>ten hundred</brand>
  <search>
    <input type="search" placeholder="Search" autofocus>
    <svg>...</svg>
  </search>
  <icon-button-list>
    <button small-icon search>
      <svg>...</svg>
    </button>
    <button small-icon watch>
      <svg>...</svg>
    </button>
    <button small-icon cart>
      <svg>...</svg>
    </button>
  </icon-button-list>
  <button large-icon profile>
    <svg>...</svg>
  </button>
</nav>
```

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

Now we have children with intrinsic value to work with. Our layout algorithm is ready to create healthy constraints for these members. Let's dive straight into some layout code and then break each part down.

**CSS**
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
}
```

{% Aside 'key-term' %}
  [Media Query Ranges](https://preset-env.cssdb.org/features#media-query-ranges), [:matches()](https://preset-env.cssdb.org/features#matches-pseudo-class) & [nesting](https://preset-env.cssdb.org/features#nesting-rules) shown in the CSS above 👍
{% endAside %}

Visually, I see that grid definition existing like this in my mind:

<figure class="w-figure w-figure--fullbleed">
  <picture>
    <source type="image/png" srcset="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/highlevel-overview@2x.png 2x"/>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/highlevel-overview.png" alt="each image of the column is labeled and it's bounds are shown to help visualize the columns created by grid">
  </picture>
</figure>

Let's flex this in devtools and see how far we got without media queries. Our [minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) and ([fr](https://css-tricks.com/introduction-fr-css-unit/)) column definitions ensure we don't squish the elements beyond their minimal comfort level and don't extend beyond a size design decided on. We don't need to fix anything in a large screen scenario, but we do see [min-content](https://developer.mozilla.org/en-US/docs/Web/CSS/width) causing our navbar to go outside the viewport.

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/intrinsic-nav-before-responsive.gif" alt="demo gif showing navbar expanding and collapsing, some elements mash together and then go off screen" class="screenshot">
  </picture>
</figure>

I like to think about this moment with `min-content` like your body again. Your body can move and adjust to fit spaces pretty well, but there are certain elements, like your bones, that can't squish. The brand text in our navbar, if you watch it closely as it get's crunched, it **won't squeeze any smaller than it's longest word**. Words are like bones to min-content (unless you explicitly say they can be broken). Which is reasonable! Same with the search bar, it can't be smaller than a standard hit area so the input is still interactive.

{% Aside %}
  We made it all the way down to `400px` so far though, which is pretty small! One layout definition that's **getting us almost all the way to our tiniest target size**. That's niiiiice.
{% endAside %}

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
