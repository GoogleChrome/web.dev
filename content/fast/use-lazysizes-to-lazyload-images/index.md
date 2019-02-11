---
page_type: guide
title: Use lazysizes to lazyload images
author: katiehempenius
description: |
  Lazy loading is the strategy of loading resources as they are needed, rather
  than in advance. This approach frees up resources during the initial page load
  and avoids loading assets that are never used.
web_lighthouse:
  - offscreen-images
web_updated_on: 2018-12-06
web_published_on: 2018-11-05
wf_blink_components: N/A
---

# Use lazysizes to lazyload images

**Lazy loading** is the strategy of loading resources as they are needed, rather
than in advance. This approach frees up resources during the initial page load
and avoids loading assets that are never used.

Images that are offscreen during the initial pageload are ideal candidates for
this technique. Best of all, [lazysizes](https://github.com/aFarkas/lazysizes)
makes this a very simple strategy to implement.

## What is lazysizes?

[lazysizes](https://github.com/aFarkas/lazysizes) is the most popular library
for lazy loading images. It is a script that intelligently loads images as the
user moves through the page and prioritizes images that the user will encounter
soon. lazysizes is a good choice because it uses the highly performant
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
(where available) to detect the visibility of page elements. This makes it more
performant than older solutions that use approaches like event handlers.

## Add lazysizes

It is simple to add lazysizes:

+  Add the lazysizes script to your pages.
+  Choose the images you want to lazy-load.
+  Update image tags for those images.

### Add the lazysizes script

Add the lazysizes
[script](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js) to
your pages:

    <script src="lazysizes.min.js" async></script>
### Update image tags

| Before  | After |
|---------|----------------|
| `<img src="flower.jpg">` | `<img data-src="flower.jpg" class="lazyload">` |

When you update the image tags you make two changes:

+  **Add the `lazyload` class**: This indicates to lazysizes that the
    image should be lazy loaded.
+  **Change the `src` attribute to `data-src`**: When it is time to load the
    image, the lazysizes code sets the image `src` attribute using the value
    from the `data-src` attribute.

### Update pictures tags

The picture element is also supported by Lazysizes. Add the `lazyload` class to the `img` and use `data-srcset` on your `source` and the `img` element. The final result should be something similar:

```html
<picture>
  <source
      data-srcset="flower@1200.jpg"
      media="(max-width: 1200px)" />
<img
    data-src="flower.jpg"
    class="lazyload" />
</picture>
```

## Verify

Open DevTools and scroll down the page to see these changes in action. As you scroll, you should see new network requests occur and `<img>` tag classes change from `lazyload` to `lazyloaded`.

Additionally, you can use Lighthouse to verify that you haven't forgotten to
lazy load any offscreen images. Run the Lighthouse Performance Audit (Lighthouse > Options >
Performance) and look for the results of the "Defer offscreen images"
audit.
