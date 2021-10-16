---
layout: codelab
title: Using Imagemin with webpack
authors:
  - katiehempenius
date: 2018-11-05
description: |
  In this codelab, learn how to use imagemin with webpack to optimize JPEG and
  PNG images for faster download.
glitch: imagemin-webpack
related_post: use-imagemin-to-compress-images
tags:
  - performance
---

## Set up the Imagemin webpack plugin

This Glitch already contains `webpack`, `webpack-cli`, and
`imagemin-webpack-plugin`. To add the configuration for Imagemin, you'll need
to edit your `webpack.config.js` file.

The existing `webpack.config.js` for this project has been copying images from
the `images/` directory to the `dist/` directory but it hasn't been
compressing them.

{% Instruction 'remix' %}

{% Aside %}
Why would you copy images to a new `dist/` folder? `dist/` is short for
"distribution" and it's fairly common practice to keep original code, images,
etc. separate from their distributed versions because they may be slightly
different.
{% endAside %}

- First, declare the Imagemin plugin by adding this code at the top of
`webpack.config.js`:

```javascript
const ImageminPlugin = require('imagemin-webpack-plugin').default;
```

- Next, add the following code as the last item in the `plugins[]` array. This
adds Imagemin to the list of plugins that webpack uses:

```javascript
new ImageminPlugin()
```

{% Aside %}
Why add it at the end of the array? Adding it there ensures that Imagemin runs
last, after all the other plugins.
{% endAside %}

## ✔︎ Check-in

Your complete `webpack.config.js` file should now look like this:

```javascript
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
     new CopyWebpackPlugin([{
       from: 'img/**/**',
       to: path.resolve(__dirname, 'dist')
     }]),
     new ImageminPlugin()
  ]
}
```

You now have a webpack config that compresses images using Imagemin.

## Run webpack

{% Instruction 'console' %}
1. To compress your images, run webpack by typing the following command into the
console:

```bash
webpack --config webpack.config.js --mode development
```

But what happens if you run webpack in production mode?

- Re-run webpack, but this time in production mode:

```bash
webpack --config webpack.config.js --mode production
```

This time around, webpack displays a warning letting you know that your PNG
files, in spite of some compression, still exceed the recommended size limit.
(webpack's `development` & `production` modes prioritize different things, which
is why you only see this warning while running webpack in production mode.)

Customize our Imagemin configuration to fix this warning.

## Customize your Imagemin Configuration

Add settings for compressing PNG images by passing the following object to `ImageminPlugin()`:

```javascript
{pngquant: ({quality: [0.5, 0.5]})}
```

This code tells Imagemin to compress PNGs using the Pngquant plugin. The
`quality` field uses a `min` and `max` range of values to determine the
compression level—0 is the lowest and 1 is the highest. To force all images to
be compressed at 50% quality, pass `0.5` as both the min and max value.

## ✔︎ Check-in

Your `webpack.config.js` file should now look like this:

```javascript
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([{
		from: 'img/**/**',
    	to: path.resolve(__dirname, 'dist')
    }]),
    new ImageminPlugin({
      pngquant: ({quality: [0.5, 0.5]}),
	  })
  ]
}
```

But what about JPEGs? The project also has JPEG images, so you should specify
how they are compressed as well.

## Customize your Imagemin Configuration (continued)

Instead of using `imagemin-webpack-plugin`'s default plugin for JPG compression
(`imagemin-jpegtran`), use the `imagemin-mozjpeg` plugin. Unlike Jpegtran,
Mozjpeg let's you specify a compression quality for your JPG compression. We've
already installed the Mozjpeg plugin for you in this Glitch, but you'll need to
edit your `webpack.config.js` file:

- Initialize the `imagemin-mozjpeg` plugin by adding the following line at the
  top of your `webpack.config.js` file:

```javascript
const imageminMozjpeg = require('imagemin-mozjpeg');
```

- Add a `plugins` property to the object passed to `ImageminPlugin()`, such that
  the object now looks like this:

```javascript
new ImageminPlugin({
  pngquant: ({quality: [0.5, 0.5]}),
  plugins: [imageminMozjpeg({quality: 50})]
})
```

This code tells webpack to compress JPGs to a quality of 50 (0 is the worst;
100 is the best) using the Mozjpeg plugin.

{% Aside %}
Are you wondering why Mozjpeg is added to the plugins array, but Pngquant isn't?
Good question.
{% endAside %}

If you're adding settings for a plugin that is a default plugin of
`imagemin-webpack-plugin`, they can be added as a key-object pair on the object
passed to `ImageminPlugin()`. The settings for Pnquant are a good example of
this.

However, if you're adding settings for non-default plugins (for example,
Mozjpeg), they should be added by including them in the array corresponding to
the `plugins` property.

## ✔︎ Check-in

Your code should now look like this:

```javascript
const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'img/**/**',
      to: path.resolve(__dirname, 'dist')
    }]),
    new ImageminPlugin({
      pngquant: ({quality: [0.5, 0.5]}),
      plugins: [imageminMozjpeg({quality: 50})]
    })
  ]
}
```

## Re-run webpack and verify results with Lighthouse

- In the console, re-run webpack:

```bash
webpack --config webpack.config.js --mode production
```

Hooray! Your changes should have fixed the webpack warnings.

webpack warns you about large images, but it can't tell you if images are
uncompressed or undercompressed. This is why it's always a good idea to use
Lighthouse to verify your changes.

Lighthouse's "Efficiently encode images" performance audit can let you know if
the JPEG images on your page are optimally compressed.

{% Instruction 'preview' %}
- Run the Lighthouse performance audit (**Lighthouse > Options > Performance**)
  on the live version of your Glitch and verify that the **Efficiently encode
  images** audit was passed.

{% Img src="image/admin/abAeMMdJEj9j2osonskn.png", alt="Passing 'Efficiently encode images' audit in Lighthouse", width="766", height="976", class="screenshot" %}

Success! You have used Imagemin to optimally compress the images on your page.
