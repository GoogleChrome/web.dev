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
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/comp.png" alt="image of the navigation bar design">
  </picture>
</figure>

In order to be content centric, we need content to work with! That means we start by writing HTML. Flat and semantic HTML as a starting point is healthy, so let's author that and start there.

**HTML**
```html
<nav>
  <img>
  <brand>Ten Hundred</brand>
  <search>...</search>
  <icon-button-list>...</icon-button-list>
  <button class="profile"></button>
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

<div class="note"><a href="https://preset-env.cssdb.org/features#media-query-ranges">Media Query Ranges</a>, <a href="https://preset-env.cssdb.org/features#matches-pseudo-class">:matches()</a> & <a href="https://preset-env.cssdb.org/features#nesting-rules">nesting</a> shown in the CSS above 👍</div>

Visually, I see that grid definition existing like this in my mind:

<figure style="text-align:center; margin: 4rem 0;">
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/highlevel-overview.png" alt="">
</figure>

Let's flex this in devtools and see how far we got without media queries. Our [minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) and ([fr](https://css-tricks.com/introduction-fr-css-unit/)) column definitions ensure we don't squish the elements beyond their minimal comfort level and don't extend beyond a size design decided on. We don't need to fix anything in a large screen scenario, but we do see [min-content](https://developer.mozilla.org/en-US/docs/Web/CSS/width) causing our navbar to go outside the viewport.

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/intrinsic-nav-before-responsive.gif" alt="demo gif showing navbar expanding and collapsing, some elements mash together and then go off screen" class="screenshot">
  </picture>
</figure>

I like to think about this moment with `min-content` like your body again. Your body can move and adjust to fit spaces pretty well, but there are certain elements, like your bones, that can't squish. The brand text in our navbar, if you watch it closely as it get's crunched, it **won't squeeze any smaller than it's longest word**. Words are like bones to min-content (unless you explicitly say they can be broken). Which is reasonable! Same with the search bar, it can't be smaller than a standard hit area so the input is still interactive.

<div class="note">
  We made it all the way down to `400px` so far though, which is pretty small! One layout definition that's <b>getting us almost all the way to our tiniest target size</b>. That's niiiiice.
</div>

**1<sup>st</sup> Column › Brand Logo** `var(--body-rails)`

<figure class="w-figure">
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column1.png" alt="" class="screenshot">
</figure>

This column get's it height from the parent nav, which also happens to be the same CSS variable we used for the width. **Gives us a nice square!** The nav already articulated vertical centering for all children, but we horizontally center via the `:matches() ` selector that's telling the first and last element in the nav to be horizontally centered. **Result is a very symmetrical and perfectly centered logo**.

**2<sup>nd</sup> Column › Brand Name** `minmax(min-content, var(--sidebar-width))`

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column2.png" alt="" class="screenshot">
</figure>

**Clamp** this column to a minimum of it's own intrinsic width and to a maximum of the desired width of our sidebar. `min-content` ensures that when space gets limited, **allow line breaks but not word breaks**. If this concept is still fuzzy, try playing and changing `min-content` to `max-content` in the below codelab! It's a great place to feel out the capabilities within these intrinsic words.

{% Aside 'codelab' %}
  [min-content / max-content sandbox](/codelab-intrinsic-layout-nav/)
{% endAside %}


**3<sup>rd</sup> Column › Search** `minmax(min-content, var(--search-width))`

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column3.png" alt="" class="screenshot">
</figure>

This should look familiar now 😏 Same scenario as our brand name, we want to **be respectful of our contents min-width**, while also **giving it a safe area to grow** per our design. We may end up changing away from a minimum of min-content because our breakpoint appears to be happening before that time. But we'll see, for now it's **a great safe intrinsic default**.

**4<sup>th</sup> Column › Global Actions** `1fr`

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column4.png" alt="" class="screenshot">
</figure>

A flexible column that says "gimme allllll the rest!" The reason `1fr`, which means 1 fraction of the left over, is consuming "the rest" of the space is because there're no other `fr`'s to compete against. `1fr` in this case is a succinct way to say "be liquid and fill anything left over in the viewport; aka, grow until you hit a wall." We could probably get away with `auto` or `100%` or even `10000000fr`, but I prefer the succincness of `1fr`.

**5<sup>th</sup> Column › Account Session** `var(--body-rails)`

<figure>
  <img src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/column5.png" alt="" class="screenshot">
</figure>

Same story as column 1, the brand logo. Be the same tall as you are wide, align center center.

## Responsive Final Touches

We need to **take an adaptive approach** to fixing our nav at a small viewport. Our **search input** is consuming too much space and I feel it'd be healthiest to replace the search input with a search button. That search button can invoke a more dedicated mobile search experience that **doesnt need to squish into a tiny pill**.

Furthermore, to squeeze our layout into even smaller devices, we can shed the text version of our brand "Ten Hundred" and let the logo do the talkin'. We'll have 1 media query for swapping a search input for a search button, and another for hiding the text brand name.

<figure class="w-figure">
  <picture>
    <img loading="lazy" src="https://storage.googleapis.com/web-dev-assets/intrinsic-layout-nav/macro-nav-layout-preview.gif" alt="demo gif showing small screen and large screen nav layout" class="screenshot">
  </picture>
</figure>

**Search Adaptive CSS**
```css
nav {
  ...

  @media (width >= 500px) {
    & > search > button {
      display: none;
    }
  }

  @media (width <= 500px) {
    & > search {
      justify-self: flex-end;

      & > :matches(svg, input) {
        display: none;
      }
    }
  }
}
```
<div class="note">hide the search button when above 500px, hide the input below 500px and align elements to the right/end</div>

**Brand Adaptive CSS**
```css
nav {
  ...

  @media (width <= 350px) {
    & > brand {
      width: 0;
      overflow: hidden;
    }
  }
}
```
<div class="note">hold the grid track but take no space</div>

Look how **little code** we need handle desktop to tiny phone 😍 **Only the search bar and brand name** needed touched, **not the layout**.

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
  grid-template-columns: var(--body-rails) minmax(min-content, var(--sidebar-width)) minmax(min-content, var(--search-width)) 1fr var(--body-rails);

  & > :matches(:first-child, :last-child) {
    justify-self: center;
  }

  @media (width >= 500px) {
    & > search > button {
      display: none;
    }
  }

  @media (width <= 500px) {
    & > search {
      justify-self: flex-end;

      & > :matches(svg, input) {
        display: none;
      }
    }
  }

  @media (width <= 350px) {
    & > brand {
      /* hold the grid track, take no space */
      width: 0;
      overflow: hidden;
    }
  }
}
```

This nav bar is a great example of **liquid and adaptive responsive tactics working together**. Next we'll tackle the sidebar navigation layout.
