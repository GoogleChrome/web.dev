---
title: Using Imagemin with Gulp
author: khempenius
page_type: glitch
glitch: imagemin-grunt
---

This codelab shows you how to add Imagemin to an existing Gulp project.

## Install the Imagemin Gulp plugin

This Glitch already contains `gulp` and `gulp-cli`, but you'll need to
install `gulp-imagemin`.

- Click the **Remix This** button to make the project editable.

<web-screenshot type="remix"></web-screenshot>

- Click the **Status** button.

<web-screenshot type="status"></web-codelab>

- Then click the **Console** button.

<web-screenshot type="console"></web-codelab>

- Lastly, type this command into the console:

<pre class="devsite-terminal devsite-click-to-copy">
npm install --save-dev gulp-imagemin
</pre>

## Setup your gulpfile.js

First, initialize the `gulp-imagemin` plugin that you just installed by adding
this code at the top of `gulpfile.js`:

```javascript
const imagemin = require('gulp-imagemin');
```

Next, replace the `//Add tasks here` comment in `gulpfile.js` with this code
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

Your complete `gulpfile.js` file should now look like this:

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

- In the console, run Gulp to compress your images:

<pre class="devsite-terminal devsite-click-to-copy">
gulp
</pre>

When Gulp completes, you should see a message like this in the terminal:

```shell
gulp-imagemin: Minified 6 images (saved 50 kB - 14.8%)
```

A 15% improvement in file size is a good start - however, more improvements can
be made by using different compression settings.

## Customize your Imagemin Configuration

Customize your Imagemin configuration to use the `imagemin-pngquant` plugin to
compress PNGs. This plugin lets you specify a compression quality level.

- In the console, install the plugin using npm:

<pre class="devsite-terminal devsite-click-to-copy">
npm install --save-dev imagemin-pngquant
</pre>

- Declare the `imagemin-pngquant` plugin by adding this line at the top your
`gulpfile.js`:

```javascript
const pngquant = require('imagemin-pngquant');
```

- Add the `imagemin-pngquant` plugin (and its settings) by passing the following
array to `ImageminPlugin()`:

```javascript
[pngquant({quality: '50'})]
```

This code tells Imagemin to compress PNGs to a quality of '50' ('0' is the
worst; '100' is the best) using the Pngquant plugin.

## ✔︎ Check-in

Your `gulpfile.js` file should now look like this:

```javascript
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const gulp = require('gulp');

gulp.task('default', () => {
  gulp.src('images/*')
    .pipe(imagemin([
      pngquant({quality: '50'})
    ]))
    .pipe(gulp.dest('images/'))
});
```

But what about JPGs? The project also has JPG images; these need to be
compressed too.

## Customize your Imagemin Configuration (continued)

---

Use the `imagemin-mozjpeg` plugin to compress JPG images.

- In the console, install the plugin using npm:

<pre class="devsite-terminal devsite-click-to-copy">
npm install --save-dev imagemin-mozjpeg
</pre>

Declare the `imagemin-mozjpeg` plugin by putting this line at the top your `gulpfile.js`.

```javascript
const mozjpeg = require('imagemin-mozjpeg');
```

Next, add `mozjpeg({quality: '50'})` to the array that's passed to `ImageminPlugin()`:

```javascript
[
  pngquant({quality: '50'}),
  mozjpeg({quality: '50'})
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
      pngquant({quality: '50'}),
      mozjpeg({quality: '50'})
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
gulp-imagemin: Minified 6 images (saved 667 kB - 66.5%)
```

Hooray! These results are much better.

Lastly, it's a good idea to use Lighthouse to verify the changes that you just
made.

Lighthouse's "Efficiently encode images" performance audit can let you know if
the JPEG images on your page are optimally compressed.

- Click on the **Show Live** button to view the live version of the your Glitch.

<web-screenshot type="show-live"></web-screenshot>

Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the
live version of your Glitch and verify that the "Efficiently encode images"
audit was passed.

<img src="./lighthouse_passing.png" width="100%" alt="Passing 'Efficiently encode images' audit in Lighthouse">

Success! You have used Imagemin to optimally compress the images on your page.
