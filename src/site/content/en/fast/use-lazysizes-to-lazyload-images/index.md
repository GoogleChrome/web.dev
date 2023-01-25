---
layout: post
title: Use lazysizes to lazy-load images
authors:
  - katiehempenius
description: |
  Lazy-loading is the strategy of loading resources as they are needed, rather
  than in advance. This approach frees up resources during the initial page load
  and avoids loading assets that are never used.
date: 2018-11-05
updated: 2019-04-10
codelabs:
  - codelab-use-lazysizes-to-lazyload-images
tags:
  - performance
  - images
feedback:
  - api
---

{% Aside 'note' %}
  Browser-level lazy-loading is now available! Refer to the [Built-in lazy-loading for the
  web](/browser-level-image-lazy-loading/) article to learn how to use the `loading` attribute and leverage
  lazysizes as a fallback for browsers that do not yet support it.
{% endAside %}

**Lazy-loading** is the strategy of loading resources as they are needed, rather
than in advance. This approach frees up resources during the initial page load
and avoids loading assets that are never used.

Images that are offscreen during the initial pageload are ideal candidates for
this technique. Best of all, [lazysizes](https://github.com/aFarkas/lazysizes)
makes this a very simple strategy to implement.

## What is lazysizes?

[lazysizes](https://github.com/aFarkas/lazysizes) is the most popular library
for lazy-loading images. It is a script that intelligently loads images as the
user moves through the page and prioritizes images that the user will encounter
soon.

## Add lazysizes

It is simple to add lazysizes:

+  Add the lazysizes script to your pages.
+  Choose the images you want to lazy-load.
+  Update the `<img>` and/or `<picture>` tags for those images.

### Add the lazysizes script

Add the lazysizes
[script](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js) to
your pages:

```html
<script src="lazysizes.min.js" async></script>
```

### Update `<img>` and/or `<picture>` tags

**`<img>` tag instructions**

**Before:**
```html
<img src="flower.jpg" alt="">
```

**After:**
```html
<img data-src="flower.jpg" class="lazyload" alt="">
```

When you update the `<img>` tag you make two changes:

+  **Add the `lazyload` class**: This indicates to lazysizes that the
    image should be lazy-loaded.
+  **Change the `src` attribute to `data-src`**: When it is time to load the
    image, the lazysizes code sets the image `src` attribute using the value
    from the `data-src` attribute.

**`<picture>` tag instructions**

**Before:**
```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

**After:**
```html
<picture>
  <source type="image/webp" data-srcset="flower.webp">
  <source type="image/jpeg" data-srcset="flower.jpg">
  <img data-src="flower.jpg" class="lazyload" alt="">
</picture>
```

When you update the `<picture>` tag you make two changes:

+ Add the `lazyload` class to the `<img>` tag.
+ Change the `<source>` tag `srcset` attribute to `data-srcset`.

{% Aside 'codelab' %}
[Use lazysizes to only load images that are in the current viewport](/codelab-use-lazysizes-to-lazyload-images).
{% endAside %}

## Verify

Open DevTools and scroll down the page to see these changes in action. As you
scroll, you should see new network requests occur and `<img>` tag classes change
from `lazyload` to `lazyloaded`.

Additionally, you can use Lighthouse to verify that you haven't forgotten to
lazy-load any offscreen images. Run the Lighthouse Performance Audit
(**Lighthouse > Options > Performance**) and look for the results of the
**Defer offscreen images** audit.
