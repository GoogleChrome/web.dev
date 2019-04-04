---
page_type: guide
title: Minify CSS
author: demianrenzulli
description: |
  Learn how to minify CSS files, to improve performance, without affecting how the browser process the styles.
web_lighthouse:
- render-blocking-resources
web_updated_on: 
web_published_on: 
wf_blink_components: N/A
---

# Minify CSS

CSS files can contain unnecessary characters, such as comments, whitespaces, and indentation. In production versions of the sites, these bytes can be safely removed, in order to reduce file sizes, without affecting how the browser processes the styles. We call this technique **minification**.

## Loading unminified CSS

Take a look at the following CSS block:

```
body {
  font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
  margin: 2em;
}

/* all titles need to have the same font, color and background */
h1 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}

h2 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}
```

This content is easy to read, at the cost of producing a larger than necessary file:

- It uses spaces for indentation purposes and contains comments, which will be ignored by the browser.
- The `<h1>` and `<h2>` elements have the same styles: instead of declaring them separately: "`h1 {...} h2 {...}`" they could be expressed as "`h1, h2{...}`".
- The **background-color**, `#000000` could be expressed as just `#000`.

After applying these observations, you would obtain a more compact version of the same styles:

```
body{font-family:"Benton Sans","Helvetica Neue",helvetica,arial,sans-serif;margin:2em}h1,h2{font-style:italic;color:#373fff;background-color:#000}
```

In practice, you would like to introduce this technique as one of the steps of your build process. In this guide, you’ll learn how to do it by using a popular build tool: [Webpack](https://webpack.js.org/).

## Measure

You’ll apply CSS minification to the [Fav Kitties site](https://minify-css-unoptimized.glitch.me/), which has been used for other web.dev articles as well.

First, obtain the size of the CSS file used by the site:

1. Open the [site](https://minify-css-unoptimized.glitch.me/) in Chrome.
1. Press `Control+Shift+J` or `Cmd+Option+J` (Mac), to open DevTools.
1. Click on the **Network** panel and filter for **CSS**.
1. Make sure **Disable Cache** is checked and reload the page.

<img class="screenshot" width="510px" height="96px" src="./cdt-css-unoptimized.png" alt="DevTools CSS unoptimized trace">

The size of the file is **1.7KB**. If you now click on the file, and go to the **Response** tab, you’ll see that the content of the file includes things like indentation and whitespaces:

<img class="screenshot" width="510px" height="96px" src="./cdt-css-unoptimized-res.png" alt="DevTools CSS unoptimized response">

Next, you’ll minify this file, and measure the amount of bytes you can save by applying this technique.

<div class="aside note">
<strong>Note:</strong> If you run <strong>Lighthouse</strong> in this page, it will show the "Minify CSS" opportunity as "Passed", because the bytes saved after minifyng this file would be under the threshold that the tool considers "significant".
Recall this is a small demo. In general, minifying CSS is recommended, regardless that they show up or not as suggestions on performance tools.
</div>

## CSS Minification with Webpack:

The way the CSS files are produced works as follows:

- **index.js** imports **src/styles.css**, meaning the resulting JS bundle will contain the content of the CSS file inlined.
- In **webpack-config.js** [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) is used, so, after the previous step, the CSS can be extracted to its own file.

Take a look at the content of these files:

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    src="https://glitch.com/embed/#!/embed/minify-css-unoptimized?path=src/index.js&previewSize=0"
    alt="minify-css-unoptimized on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

You will now make some changes in the project:

1. Open the project [in Glitch](https://glitch.com/~minify-css-unoptimized).
1. Click “View Source”, and then, “Remix and Edit”, to make changes on the project.
1. Click the “Tools” optoin in the lower left corner of the edit view, and go to “Console”.

To minify the resulting CSS, you’ll use the [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin): 

1. In the console, run `npm install --save-dev optimize-css-assets-webpack-plugin`.
1. Run `refresh`, so the changes are synchronized with the Glitch editor.

Next, go back to the Glitch editor, and open the **webpack.config.js** file, and make some modifications:

At the beginning of the file, add:
```
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
```

Inside **module.exports**, insert:
```
optimization: {
	minimizer: [
		new OptimizeCSSAssetsPlugin({})
	]
}
```
After making the changes a rebuild of the project will be triggered.
This is how the resulting **webpack.config.js** will look like:

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    src="https://glitch.com/embed/#!/embed/minify-css-optimized?path=webpack.config.js&previewSize=0"
    alt="minify-css-optimized on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

1. Go back to the console, and run `cd public`.
1. Run `vi main.css`, to inspect the content of the CSS.

You'll find a more compact version of the CSS, after minification has been applied.

<div class="aside note">
Note: This demo is based on Webpack 4. It's likely that Webpack 5 will come with a CSS minimizer built-in. If that’s the case you won’t need to configure a plugin as done in the previous step.
</div>

## Monitor

1. Open the resulting [optimized page](https://minify-css-optimized.glitch.me/) in Chrome, and open DevTools.
1. Click in the **Network** panel and filter for “CSS”.
1. Make sure "Disable Cache" is checked and reload the page.

<img class="screenshot" width="510px" height="96px" src="./cdt-css-optimized.png" alt="DevTools CSS unoptimized response">

Once minified, [the new CSS file](https://minify-css-optimized.glitch.me/main.css) is now **~24% smaller** than its initial version.

As this is a relatively small demo, you might not see any impact on performance metrics.  On real production sites with larger CSS files, applying this technique can lead to improvements on metrics like [First Contentful Paint](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint).

## Next steps and resources

In this guide, we've covered CSS Minification with Webpack, but the same approach can be followed with other build tools, like [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) for [Gulp](https://gulpjs.com/), or
[grunt-contrib-cssmin](https://www.npmjs.com/package/grunt-contrib-cssmin) for [Grunt](https://gruntjs.com/).

Minification can also be applied to other types of files. Check out the [Minify and compress network payloads guide](https://web.dev/fast/reduce-network-payloads-using-text-compression) to learn more about tools to minify JS, and some complementary techniques, like compression.