---
layout: codelab
title: Lazy load offscreen images with lazysizes
authors:
  - katiehempenius
description: |
  In this codelab, learn how to use lazysizes to only load images that are
  in the current viewport.
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

Lazy loading is the approach of waiting to load resources until they are needed,
rather than loading them in advance. This can improve performance by reducing
the amount of resources that need to be loaded and parsed on initial page load.

Images that are offscreen during the initial pageload are ideal candidates for
this technique. Best of all, [lazysizes](https://github.com/aFarkas/lazysizes)
makes this a very simple strategy to implement.

## Add the lazysizes script to the page

{% Instruction 'remix' %}

`lazysizes.min.js` has already been downloaded and added to this Glitch. To
include it in the page:

- Add the following `<script>` tag to `index.html`:

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Images End -->
</body>
```

{% Aside %}
The [lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js)
file has already been added to this project, so there is no need to add it
separately. The script you just added can use this script.
{% endAside %}

lazysizes will intelligently load images as the user scrolls through the page
and prioritize the images that the user is going to encounter soon.

## Indicate the images to lazy load

- Add the class `lazyload` to images that should be lazy loaded. In addition,
  change the `src` attribute to `data-src`.

For example, the changes for `flower3.png` would look like this:

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

For this example, try lazy loading `flower3.png`, `flower4.jpg`, and
`flower5.jpg`.

{% Aside %}
You may be wondering why it is necessary to change the `src` attribute to
`data-src`. If this attribute is not changed, all the images will load
immediately instead of being lazy-loaded. `data-src` is not an attribute that
the browser recognizes, so when it encounters an image tag with this attribute,
it doesn't load the image. In this case, that is a good thing, because it then
allows the lazysizes script to decide when the image should be loaded, rather
than the browser.
{% endAside %}

## See it in action

That's it! To see these changes in action, follow these steps:

{% Instruction 'preview' %}

- Open the console and find the images that were just added. Their classes
  should change from `lazyload` to `lazyloaded` as you scroll down the page.

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="Images being lazy loaded", width="428", height="252" %}

- Watch the network panel to see the image files load individually as you scroll
  down the page.

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="Images being lazy loaded", width="418", height="233" %}

## Verify using Lighthouse

Lastly, it's a good idea to use Lighthouse to verify these changes. Lighthouse's
"Defer offscreen images" performance audit will indicate if you've forgotten to
add lazy loading to any offscreen images.

{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}
1. Verify the **Defer offscreen images** audit was passed.

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="Passing 'Efficiently encode images' audit in Lighthouse", width="800", height="774" %}

Success! You have used lazysizes to lazy load the images on your page.
