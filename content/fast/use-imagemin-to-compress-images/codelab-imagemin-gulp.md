---
title: Using Imagemin with Gulp
author: khempenius
page_type: glitch
glitch: imagemin-grunt
---

This workbook will show you how to add Imagemin to an existing Gulp project.

## 1. Install the Imagemin Gulp plugin

---

We've already installed `gulp` and `gulp-cli` for you, but you'll need to install `gulp-imagemin`.

☞ Click the "Logs" button.
<img src="./logs_button.png" alt="The 'Logs' button in Glitch">

☞ Then click the "Console" button.
<img src="./console_button.png" alt="The 'Console' button in Glitch">

☞ Type these commands:

```shell
$ enable-npm
$ npm install --save-dev gulp-imagemin

## 2. Setup your gulpfile.js

---

We don't need to create a `gulpfile.js` file because this project already has one.

☞ First, initialize the `gulp-imagemin` plugin that we just installed by adding this code at the top of `gulpfile.js`:

```javascript
const imagemin = require('gulp-imagemin');
```

☞ Next, replace the "`//Add tasks here`" comment in `gulpfile.js` with this code block:

```javascript
gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('images/'))
```

This code adds a Gulp task that uses Imagemin to compress the images in the `images/` directory. The original images are overwritten and saved in the same `images/` directory.

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

We now have a `gulpfile.js` that can be used to compress images.

## 3. Run Gulp

---

☞ Run Gulp to compress your images:

```shell
$ gulp
```

When Gulp completes you should see a message like this in the terminal:

```shell
gulp-imagemin: Minified 6 images (saved 50 kB - 14.8%)
```

A 15% improvement in file size is a good start - however, we can improve upon this by using different compression settings. Let's customize our Imagemin configuration to yield bigger file size savings.

## 4. Customize your Imagemin Configuration

---

We are going to customize our Imagemin configuration to use the `imagemin-pngquant` plugin to compress PNGs. This plugin allows us to specify a compression quality level, which is why we have chosen to use it in this example.

☞ Install the plugin using npm:

```shell
$ npm install --save-dev imagemin-pngquant
```

☞ Declare the `imagemin-pngquant` plugin by adding this line at the top your `gulpfile.js`:

```javascript
const pngquant = require('imagemin-pngquant');
```

☞ Add the `imagemin-pngquant` plugin (and its settings) by passing the following array to `ImageminPlugin()`:

```javascript
[pngquant({quality: '50'})]
```

This code tells Imagemin to compress PNGs to a quality of '50' ('0' is the worst; '100' is the best) using the Pngquant plugin.

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

But what about JPGs? Our project also has JPG images, so we should specify how they are compressed as well.

## 5. Customize your Imagemin Configuration (continued)

---

<!-- TODO(khempenius): imagemin-mozjpeg currently does not work on Glitch. I believe this can probably be fixed by installing libpng16-dev via apt-get. Ideally, I'd like to use mozjpeg instead of jpegtran, but if this isn't possible this section will need to be changed to use a different plugin. -->

We are going to use the `imagemin-mozjpeg` plugin to compress JPG images.

☞ Install the plugin using npm:

```shell
$ npm install --save-dev imagemin-mozjpeg
```

☞ Declare the `imagemin-mozjpeg` plugin by putting this line at the top your `gulpfile.js`.

```javascript
const mozjpeg = require('imagemin-mozjpeg');
```

☞ Next, add `mozjpeg({quality: '50'})` to the array that is passed to `ImageminPlugin()`. That array should now look like this:

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

## 6. Re-run Gulp & verify results with Lighthouse

---

☞ Re-run Gulp:

```shell
$ gulp
```

When Gulp completes you should see a message like this in terminal:

```shell
gulp-imagemin: Minified 6 images (saved 667 kB - 66.5%)
```

Hooray! These results are much better.

Lastly, it's a good idea to use Lighthouse to verify the changes that you just made. Lighthouse's "Efficiently encode images" performance audit will let you know if the JPG images on your page are optimally compressed.

☞ Click on the "Show Live" button to view the live version of the your Glitch.

<img src="./show-live.png" width="140" alt="The show live button">

☞ Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the live version of your Glitch and verify that the "Efficiently encode images" audit was passed.

<img src="./lighthouse_passing.png" width="100%" alt="Passing 'Efficiently encode images' audit in Lighthouse">

Success! You have used Imagemin to optimally compress the images on your page.
