---
title: Resize images with webpack & responsive-loader
author: khempenius
page_type: glitch
glitch: responsive-images-with-webpack
---

**Note:** The
[`responsive-loader`](https://github.com/herrstucki/responsive-loader) plugin is a
good choice for projects that import images using JavaScript. For projects that
do not import images into JavaScript files, using a Node script to resize images
is probably more convenient.

## 1. Configure webpack.config.js

- View `webpack.config.js` for an example of how to configure
`responsive-loader`.

In this demo, the [sharp](http://sharp.dimens.io/en/stable/) image processing
library resizes JPEG and PNG images to five default sizes: 480, 720, 1080, 1440,
and 1920 pixels wide. (Note: Specifying default sizes is optional.)

- View the `dist` directory to see the multiple image versions created by
`responsive-loader`.

## 2. Update image tags

`responsive-loader` sets the `src` and `srcset` properties on image imports (see
`app.js`):

```javascript
const flowerImage = require('./flower.jpg');
// flowerImage.src ==> "63f6dd53b67be54696fabc5192aa1520-480.jpg"
// flowerImage.srcSet ==> "63f6...8a135486-1920.jpg 1920w"
```

- Use images created by `responsive-loader` by updating the `src` and `srcset`
attributes on image tags to the values set by `responsive-loader`:

```javascript
const flowerImage = require('./flower.jpg');
ReactDOM.render(<img src={flowerImage.src} srcset={flowerImage.srcSet} sizes="50vw">, ...);
```

Note: Don't forget to include the
[`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes)
attribute in the HTML of any responsive image. `responsive-loader` will not set
this attribute for you.

## 3. View the Final Result

### Code

- Inspect the code in the live version of this Glitch. (Hint: Click  <web-screenshot type="show-live"> to view the live version)

Notice that `responsive-loader` has done the heavy lifting for you and generated
the contents of the `src` and `srcset` attributes. This is particularly handy
when supporting many images sizes.

<table>
<tbody>
<tr>
<td><strong>Initial Code</strong></td>
<td>
<code>&lt;img src={flowerImage.src} srcset={flowerImage.srcSet} sizes="50vw"/&gt;</code>
</td>
</tr>
<tr>
<td><strong>Final Code</strong></td>
<td>
<code>&lt;img src="63f6dd53b67be54696fabc5192aa1520-480.jpg" srcset="63f6dd53b67be54696fabc5192aa1520-480.jpg 480w,0e6cca2660ff3c6df90db07b68cb97aa-720.jpg 720w,b0b8f6c340a98d96a2a414a70d2c73fe-1080.jpg 1080w,5596f85fbfb994ccf46eab8ee9a12779-1440.jpg 1440w,17bb43ce70871ce91e64c6908a135486-1920.jpg 1920w" sizes="50vw"&gt;</code>
</td>
</tr>
</tbody>
</table>

### Responsive images

1. Reload this demo using different browser sizes. Notice how different image
sizes are loaded depending on the width of the browser.

Note:

+  If the cache is not cleared between page loads, the browser tries to
    use the image version that is already in the cache. If you are using
    Chrome, open DevTools, click the "refresh page" button and Chrome displays
    the option to "Empty Cache and Hard Reload."

![image](./empty-cache.png "How to empty cache and hard reload")

+  The
    [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
    of the device that you're using (or emulating) affects which image sizes
    are loaded. To learn how `devicePixelRatio` works, read [Responsive Images: Density Descriptors](/fast/serve-responsive-images/codelab-density-descriptors).

# Extra Credit

+  Check out `responsive-loader`'s
    [options](https://github.com/herrstucki/responsive-loader#options)
+  View other ways to
    [use](https://github.com/herrstucki/responsive-loader#usage) responsive-loader