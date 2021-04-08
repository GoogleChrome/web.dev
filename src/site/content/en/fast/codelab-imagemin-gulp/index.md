---
layout: codelab
title: Using Imagemin with Gulp
authors:
  - katiehempenius
date: 2018-11-05
description: |
  In this codelab, learn how to use imagemin with gulp to optimize JPEG and
  PNG images for faster download.
glitch: imagemin-gulp
related_post: use-imagemin-to-compress-images
tags:
  - performance
---

## Setup the Imagemin Gulp plugin

This Glitch already contains `gulp`, `gulp-cli`, and the `gulp-imagemin` plugin.
To add the configuration for Imagemin, you'll need to edit your `gulpfile.js` file.

{% Instruction 'remix' %}
- First, initialize the `gulp-imagemin` plugin by adding this code at the top of
`gulpfile.js`:

```javascript
const imagemin = require('gulp-imagemin');
```

- Next, replace the `//Add tasks here` comment in `gulpfile.js` with this code
block:

```javascript
gulp.src('images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('images/'))
```

This code adds a Gulp task that uses Imagemin to compress the images in the
`images/` directory. The original images are overwritten and saved in the same
`images/` directory.

## ✔︎ Check-in

Your `gulpfile.js` file should now look like this:

```javascript
const imagemin = require('gulp-imagemin');
const gulp = require('gulp');

gulp.task('default', () => {
  gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('images/'))
});
```

You now have a `gulpfile.js` that can be used to compress images.

## Run Gulp

1. Click the **Tools** button.
1. Then click the **Console** button.
1. Run Gulp to compress your images by typing the following command into the
console:

<pre class="devsite-terminal devsite-click-to-copy">
gulp
</pre>

When Gulp completes, you should see a message like this in the terminal:

```bash
gulp-imagemin: Minified 6 images (saved 50 kB—14.8%)
```

A 15% improvement in file size is a good start; however, more improvements can
be made by using different compression settings.

## Customize your Imagemin Configuration

`imagemin-pngquant` is a plugin for specifying compression quality levels.
We've already added `imagemin-pngquant` to this project in the `package.json`
file so that you can use it to compress your PNGs. To use it, declare the plugin
and specify a compression quality level in your gulpfile.

- Declare the `imagemin-pngquant` plugin by adding this line to the top of your
`gulpfile.js`:

```javascript
const pngquant = require('imagemin-pngquant');
```

- Add the `imagemin-pngquant` plugin (and its settings) by passing the following
array to `ImageminPlugin()`:

```javascript
[pngquant({quality: [0.5, 0.5]})]
```

This code tells Imagemin to compress PNGs using the Pngquant plugin. The
`quality` field uses a `min` and `max` range of values to determine the
compression level—0 is the lowest and 1 is the highest. To force all images to
be compressed at 50% quality, pass `0.5` as both the min and max value.

## ✔︎ Check-in

Your `gulpfile.js` file should now look like this:

```javascript
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const gulp = require('gulp');

gulp.task('default', () => {
  gulp.src('images/*')
    .pipe(imagemin([
      pngquant({quality: [0.5, 0.5]})
    ]))
    .pipe(gulp.dest('images/'))
});
```

But what about JPGs? The project also has JPG images; these need to be
compressed too.

## Customize your Imagemin Configuration (continued)

Use the `imagemin-mozjpeg` plugin, which has already been installed for you, to compress
JPG images.

- Declare the `imagemin-mozjpeg` plugin by putting this line at the top your `gulpfile.js`.

```javascript
const mozjpeg = require('imagemin-mozjpeg');
```

- Next, add `mozjpeg({quality: 50})` to the array that's passed to
  `ImageminPlugin()`:

```javascript
[
  pngquant({quality: [0.5, 0.5]}),
  mozjpeg({quality: 50})
]
```

## ✔︎ Check-in

Your `gulpfile.js` file should now look like this:

```javascript
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const gulp = require('gulp');

gulp.task('default', () => {
  gulp.src('images/*')
    .pipe(imagemin([
      pngquant({quality: [0.5, 0.5]}),
      mozjpeg({quality: 50})
    ]))
    .pipe(gulp.dest('images/'))
});
```

## Re-run Gulp & verify results with Lighthouse

- Re-run Gulp:

<pre class="devsite-terminal devsite-click-to-copy">
gulp
</pre>

When Gulp completes, you should see a message like this in terminal:

```shell
gulp-imagemin: Minified 6 images (saved 667 kB—66.5%)
```

Hooray! These results are much better.

Lastly, it's a good idea to use Lighthouse to verify the changes that you just
made.

Lighthouse's "Efficiently encode images" performance audit can let you know if
the JPEG images on your page are optimally compressed.

{% Instruction 'preview' %}
- Run the Lighthouse performance audit (Lighthouse > Options > Performance) on
  the live version of your Glitch and verify that the "Efficiently encode
  images" audit was passed.

{% Img src="image/admin/vNZSjlHVQpG3R8SmojFi.png", alt="Passing 'Efficiently encode images' audit in Lighthouse", width="766", height="976", class="screenshot" %}

Success! You have used Imagemin to optimally compress the images on your page.
