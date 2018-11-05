---
title: Using Imagemin with Webpack
author: khempenius
page_type: glitch
glitch: imagemin-webpack
---

This workbook will show you how to add Imagemin to an existing Webpack project.

## 1. Install the Imagemin Webpack plugin:
---

We've already installed `webpack` and `webpack-cli` for you, but you'll need to install `imagemin-webpack-plugin`.

☞ Click the "Logs" button.
<img src="./assets/logs_button.png" alt="The 'Logs' button in Glitch">

☞ Then click the "Console" button.
<img src="./assets/console_button.png" alt="The 'Console' button in Glitch">

☞ Type these commands:

```shell
$ enable-npm
$ npm install --save-dev imagemin-webpack-plugin
```

## 2. Setup imagemin-webpack-plugin:

---

We don't need to create a `webpack.config.js` file because this project already has one. The existing `webpack.config.js` for this project has been copying images from the `"images/"` directory to the `"dist/"` directory but it hasn't been compressing them. Let's change that.

(Why would you copy images to a new "`dist/`" folder? `"dist/"` is short for "distribution" and it's fairly common practice to keep original code, images, etc. separate from their distributed versions because they may be slightly different.)

☞ First, declare the Imagemin plugin by adding this code at the top of `webpack.config.js`:

```javascript
const ImageminPlugin = require('imagemin-webpack-plugin').default;
```

☞ Next, add the following code as the last item in the `plugins[]` array. This adds Imagemin to the list of plugins that Webpack uses:

```javascript
new ImageminPlugin()
```

(Why add it at the end of the array? Adding it there ensures that Imagemin runs last, after all the other plugins.)

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

We now have a Webpack config that compresses images using Imagemin.

## 3. Run Webpack:

---

☞ Run Webpack to compress your images:

```shell
$ webpack --config webpack.config.js --mode development
```

But what happens if we run Webpack in production mode?

☞ Re-run Webpack, but this time in production mode:

```shell
$ webpack --config webpack.config.js --mode production
```

This time around, Webpack displays a warning letting you know that your PNG files, in spite of some compression, still exceed the recommended size limit. (Webpack's `development` & `production` modes prioritize different things, which is why you only see this warning while running Webpack in production mode.)

Let's customize our Imagemin configuration to fix this warning.

## 4. Customize your Imagemin Configuration:

---

☞ Add settings for compressing PNG images by passing the following object to `ImageminPlugin()`:

```javascript
{pngquant: ({quality: '50'})}
```

This code tells Webpack to compress PNGs to a quality of '50' ('0' is the worst; '100' is the best) using the Pngquant plugin.

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
       pngquant: ({quality: '50'}),
	})
  ]
}

```

But what about JPGs? Our project also has JPG images, so we should specify how they are compressed as well.

## 5. Customize your Imagemin Configuration (continued):

---

<!-- TODO(khempenius): imagemin-mozjpeg currently does not work on Glitch. I believe this can probably be fixed by installing libpng16-dev via apt-get. Ideally, I'd like to use mozjpeg instead of jpegtran, but if this isn't possible this section will need to be changed to use a different plugin. -->

Instead of using `imagemin-webpack-plugin`'s default plugin for JPG compression (`imagemin-jpegtran`), let's use the `imagemin-mozjpeg` plugin. Unlike Jpegtran, Mozjpeg let's you specify a compression quality for your JPG compression.

☞ Initialize the `imagemin-mozjpeg` plugin by adding the following line at the top of your `webpack.config.js` file:

```javascript
const imageminMozjpeg = require('imagemin-mozjpeg');
```

☞ Add a `plugins` property to the object passed to `ImageminPlugin()`, such that the object now looks like this:

```javascript
     new ImageminPlugin({
       pngquant: ({quality: '50'}),
       plugins: [imageminMozjpeg({quality: '50'})]
    })
```

This code tells Webpack to compress JPGs to a quality of '50' ('0' is the worst; '100' is the best) using the Mozjpeg plugin.

Note: Are you wondering why Mozjpeg is added to the plugins array, but Pngquant isn't? Good question.

If you're adding settings for a plugin that is a default plugin of `imagemin-webpack-plugin`, they can be added as a key-object pair on the object passed to `ImageminPlugin()`. The settings for Pnquant are a good example of this.

However, if you're adding settings for non-default plugins (for example, Mozjpeg), they should be added by including them in the array corresponding to the `plugins` property.

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
       pngquant: ({quality: '50'}),
       plugins: [imageminMozjpeg({quality: '50'})]
    })
  ]
}
```

## 6. Re-run Webpack & verify results with Lighthouse:

---

☞ Re-run Webpack:

```shell
$ webpack --config webpack.config.js --mode production
```

Hooray! Your changes should have fixed the Webpack warnings.

Webpack will warn you about large images, but it can't tell you if images are uncompressed or undercompressed. This is why it's always a good idea to use Lighthouse to verify your changes.

Lighthouse's "Efficiently encode images" performance audit can let you know if the JPG images on your page are optimally compressed.

☞ Click on the "Show Live" button to view the live version of the your Glitch.

<img src="./assets/show-live.png" width="140" alt="The show live button">

Run the Lighthouse performance audit (Lighthouse > Options > Performance) on the live version of your Glitch and verify that the "Efficiently encode images" audit was passed.

<img src="./assets/lighthouse_passing.png" width="100%" alt="Passing 'Efficiently encode images' audit in Lighthouse">

Success! You have used Imagemin to optimally compress the images on your page.
