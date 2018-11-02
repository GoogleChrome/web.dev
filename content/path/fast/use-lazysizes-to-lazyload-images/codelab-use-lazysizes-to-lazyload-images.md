---
title: Lazy Load Offscreen Images with LazySizes
author: khempenius
page_type: glitch
glitch: lazysizes
---

Lazy loading is the approach of waiting to load resources until they are needed, rather than loading them in advance. This can improve performance by reducing the amount of resources that need to be loaded and parsed on initial page load.

Images that are offscreen during the initial pageload are ideal candidates for this technique. Best of all, <a href="https://github.com/aFarkas/lazysizes" target="_blank">LazySizes</a> makes this a very simple strategy to implement.

---

## 1. Add the LazySizes script to the page

1.  Add the following `<script>` tag to `index.html`:

```html
<script src="lazysizes.min.js" async></script>
```

(We've already added the <a href="https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js" target="_blank">lazysizes.min.js</a> file to this project for you, so you don't need to add it separately.)

This is the LazySizes script which does most of the work for us :) It will intelligently load images as the user moves through the page and prioritizes the images that the user is going to encounter soon.

## 2. Indicate the images you want to lazy load

1.  Add the class "`lazyload`" to images you want to lazy load & change their `src` attribute to `data-src`.

For example, the `<image>` tag for flower3.png would now look like this:

```html
<img data-src="images/flower3.png" class="lazyload"/>
```

For this example, we recommend lazy loading flower3.png, flower4.jpg, and flower5.jpg.

Note: You may be wondering why you need to change the `src` attribute to `data-src`. (If you don't change this attribute, you'll find that all your images load immediately instead of being lazy-loaded.) `data-src` is not an attribute that the browser recognizes, so when it encounters an image tag with this attribute, it doesn't load the image. In this case, that is a good thing, because it then allows the LazySizes script to decide when the image should be loaded, rather than the browser.

## 3. See it in action

That's it! If you want to see the changes you just made in action, you can follow these steps:

1. Click on the "Show Live" button to view the live version of the your Glitch.

<img src="./show-live.png" width="140" alt="The show live button">

1.  Open the console and find the images that you just added. You should find that their classes change from "lazyload" to "lazyloaded" as you scroll down the page.

<img src="./lazyload-console.png" style="display: block" alt="Images being lazy loaded">

1.  You can also watch the network panel to see the image files load individually as you scroll down the page.

<img src="./lazysizes-waterfall.png" alt="Images being lazy loaded">

## 4. Verify using Lighthouse

Lastly, it's a good idea to use Lighthouse to verify the changes that you just made. Lighthouse's "Defer offscreen images" performance audit will let you know whether you've forgotten to add lazy loading to any offscreen images.

1.  Click on the "Show Live" button to view the live version of the your Glitch.
 <img src="./show-live.png" width="140" style="display: block" alt="The show live button">

1.  Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the live version of your Glitch and verify that the "Defer offscreen images" audit was passed.

<img src="./lighthouse_passing.png" width="100%" alt="Passing 'Efficiently encode images' audit in Lighthouse">

Success! You have used Lazysizes to lazy load the images on your page. 
