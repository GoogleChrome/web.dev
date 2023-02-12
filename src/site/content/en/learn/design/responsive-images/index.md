---
title: Responsive images
description: >
  Give your visitors the most appropriate images for their devices and screens.
authors:
  - adactio
date: 2021-12-09
---

Text on the web automatically wraps at the edge of the screen so that it doesn't overflow. It's different with images. Images have an intrinsic size. If an image is wider than the screen, the image will overflow, causing a horizontal scrollbar to appear.

Fortunately, you can take measures in CSS to stop this from happening.

## Constrain your images

In your stylesheet, you can declare that images should never be rendered at a size wider than their containing element using [`max-inline-size`](https://developer.mozilla.org/docs/Web/CSS/max-inline-size).
{% BrowserCompat 'css.properties.max-inline-size' %}

```css
img {
  max-inline-size: 100%;
  block-size: auto;
}
```

{% Aside %}
You can use `max-width` instead of `max-inline-size` if you prefer, but remember it's good to get in the habit of thinking in terms of [logical properties](/learn/design/internationalization/#logical-properties).
{% endAside %}

You can apply the same rule to other kinds of embedded content too, like videos and iframes.

```css
img,
video,
iframe {
  max-inline-size: 100%;
  block-size: auto;
}
```

With that rule in place, browsers will automatically scale down images to fit on the screen.

{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/RvqAjVGiroJDuBBpYXYV.png", alt="Two screenshots; the first shows an image expanding past the browser width; the second shows the same image constrained within the browser viewport.", width="800", height="763" %}


Adding a [`block-size`](https://developer.mozilla.org/docs/Web/CSS/block-size) value of `auto` means that the aspect-ratio of the images will remain constant.

Sometimes the dimensions of an image might be out of your control—if an image is added through a content management system, for example. If your design calls for a images to have an aspect ratio that's different to the image's real dimensions, use the [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) property in CSS.

```css/3-3
img {
  max-inline-size: 100%;
  block-size: auto;
  aspect-ratio: 2/1;
}
```

But then the browser might squash or stretch the image to make it fit your preferred aspect ratio.

{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/GNEkQTnMZTde5QB2mkvh.jpg", alt="Profile of a happy-looking handsome dog with a ball in its mouth, but the image is squashed.", width="800", height="400" %}

To prevent that happening, use the [`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit) property.
{% BrowserCompat 'css.properties.object-fit' %}

An `object-fit` value of `contain` tells the browser to preserve the image's aspect ratio, even if that means leaving empty space above and below.

```css/4-4
img {
  max-inline-size: 100%;
  block-size: auto;
  aspect-ratio: 2/1;
  object-fit: contain;
}
```

An `object-fit` value of `cover` tells the browser to preserve the image's aspect ratio, even if that means cropping the image at the top and bottom.

```css/4-4
img {
  max-inline-size: 100%;
  block-size: auto;
  aspect-ratio: 2/1;
  object-fit: cover;
}
```

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/VCC9WmZ2BFqLrkRlFViy.jpg", alt="Profile of a happy-looking handsome dog with a ball in its mouth; there is extra space on either side of the image.", width="800", height="400" %}
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/FgeMDACB094Myj6cVCZu.jpg", alt="Profile of a happy-looking handsome dog with a ball in its mouth; the image has been cropped at the top and bottom.", width="800", height="400" %}
 <figcaption>
   The same image with two different values for `object-fit` applied. The first has an `object-fit` value of `contain`. The second has an `object-fit` value of `cover`.
 </figcaption>
</figure>



If the cropping at the top and bottom evenly is an issue, use the [object-position](https://developer.mozilla.org/docs/Web/CSS/object-position) CSS property to adjust the focus of the crop.
{% BrowserCompat 'css.properties.object-position' %}

You can make sure the most important image content is still visible.

```css/5-5
img {
  max-inline-size: 100%;
  block-size: auto;
  aspect-ratio: 2/1;
  object-fit: cover;
  object-position: top center;
}
```

{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/mZDZFob5QnBl5YmAHh2A.jpg", alt="Profile of a happy-looking handsome dog with a ball in its mouth; the image has only been cropped at the bottom.", width="800", height="400" %}

## Deliver your images

Those CSS rules tell the browser how you'd like images to be rendered. You can also provide hints in your HTML about how the browser should handle those images.

### Sizing hints

If you know the dimensions of the image you should include `width` and `height` attributes. Even if the image is rendered at a different size (because of your `max-inline-size: 100%` rule), the browser still knows the width to height ratio and can set aside the right amount of space. This will stop your other content jumping around when the image loads.

```html/3-4
<img
 src="image.png"
 alt="A description of the image."
 width="300"
 height="200"
>
```

<figure>
{% Video src="/video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4", controls=true, loop=true %}
{% Video src="/video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4", controls=true, loop=true %}
 <figcaption>
   The first video shows a layout without defined image dimensions. Notice how the text jumps once the images load. In the second video, image dimensions have been provided; space is left for the image so that once they load, the text doesn't jump around.
 </figcaption>
</figure>

### Loading hints

Use the `loading` attribute to tell the browser how urgently you want it to load an image. For images below the fold, use a value of `lazy`. The browser won't load lazy images until the user has scrolled far down enough that the image is about to come into view. If the user never scrolls, the image never loads.

```html/5-5
<img
 src="image.png"
 alt="A description of the image."
 width="300"
 height="200"
 loading="lazy"
>
```

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/jazsyaOjXfHS0g8yUijR.mp4", controls=true, loop=true %}

For a hero image above the fold, use a `loading` value of `eager`.

```html/5-5
<img
 src="hero.jpg"
 alt="A description of the image."
 width="1200"
 height="800"
 loading="eager"
>
```

For an important image you can tell the browser to pre-fetch the image in the head of your document.

```html
<link rel="prefetch" href="hero.jpg" as="image">
```

But remember: when you ask the browser to prioritize downloading one resource—like an image—the browser will have to de-prioritize another resource such as a script or a font file. Only prefetch an image if it is truly vital.

### Image decoding

There's also a `decoding` attribute you can add to `img` elements. You can tell the browser that the image can be decoded asynchronously. The browser can then prioritize processing other content.

```html/6-6
<img
 src="image.png"
 alt="A description of the image."
 width="300"
 height="200"
 loading="lazy"
 decoding="async"
>
```

You can use the `sync` value if the image itself is the most important piece of content to prioritize.

```html/6-6
<img
 src="hero.jpg"
 alt="A description of the image."
 width="1200"
 height="800"
 loading="eager"
 decoding="sync"
>
```

## Responsive images with `srcset`

Thanks to that `max-inline-size: 100%` declaration, your images will never break out of their containers. But even if it looks fine to have a large image that shrinks to fit, it won't feel fine. If someone uses a small screen device on a low bandwidth network, they'll download unnecessarily large images.

If you make multiple versions of the same image at different sizes, you can let the browser know about them using the [`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) attribute.

### Width descriptor

You can pass in a list of values separated by commas. Each value should be the URL of an image followed by a space followed by some metadata about the image. This metadata is called a descriptor.

In this example, the metadata describes the width of each image using the `w` unit. One `w` is one pixel.

```html/7-9
<img
 src="small-image.png"
 alt="A description of the image."
 width="300"
 height="200"
 loading="lazy"
 decoding="async"
 srcset="small-image.png 300w,
  medium-image.png 600w,
  large-image.png 1200w"
>
```

The `srcset` attribute doesn't replace the `src` attribute. Instead the `srcset` attribute complements the `src` attribute. You still need to have a valid `src` attribute, but now the browser can replace its value with one of the options listed in the `srcset` attribute.

The browser won't download the larger images unless they're needed. That saves bandwidth.

### Sizes

If you're using the width descriptor, you must also use the [`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes) attribute to give the browser more information. This tells the browser what size you expect the image to be displayed under different conditions. Those conditions are specified in a media query.

The `sizes` attribute takes a comma-separated list of media queries and image widths.

{% Aside %}
It feels strange to have CSS media queries inside an HTML element. It spoils the separation of presentation and structure. But it's the only way to provide the necessary sizing information in time to be effective.
{% endAside %}

```html/10-12
<img
 src="small-image.png"
 alt="A description of the image."
 width="300"
 height="200"
 loading="lazy"
 decoding="async"
 srcset="small-image.png 300w,
  medium-image.png 600w,
  large-image.png 1200w"
 sizes="(min-width: 66em) 33vw,
  (min-width: 44em) 50vw,
  100vw"
>
```
In this example, you're telling the browser that above a viewport width of `66em` to display the image no wider than one third of the screen (inside a three column layout, for example).

For viewport widths between `44em` and `66em`, display the image at half the width of the screen (a two column layout).

For anything below `44em` display the image at the full width of the screen.

This means that the biggest image won't necessarily be used for the widest screen. A wide browser window that can display a multi-column layout will use an image that fits in one column. That image might be smaller than an image used for a single-column layout on a narrower screen.

{% Codepen {
 user: 'web-dot-dev',
 id: 'XWerLJm',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/MkUAq5XQyjlUXLvkT4jL.mp4", controls=true, loop=true %}

### Pixel density descriptor

There's another situation where you might want to provide multiple versions of the same image.

Some devices have high-density displays. On a double-density display you can pack two pixels worth of information into the space of one pixel. This keeps images looking sharp on those kinds of displays.

{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/OtyGs9nZser6u0DrFYBq.png", alt="Two versions of the same image of a happy-looking handsome dog with a ball in its mouth, one image looking crisp and the other looking fuzzy.", width="800", height="275" %}


Use the density descriptor to describe the pixel density of the image in relationship to the image in the `src` attribute. The density descriptor is a number followed by the letter x: `1x`, `2x`, etc.

```html/7-9
<img
 src="small-image.png"
 alt="A description of the image."
 width="300"
 height="200"
 loading="lazy"
 decoding="async"
 srcset="small-image.png 1x,
  medium-image.png 2x,
  large-image.png 3x"
>
```

If `small-image.png` is 300 by 200 pixels in size, and `medium-image.png` is 600 by 400 pixels in size, then `medium-image.png` can have `2x` after it in the `srcset` list.

You don't have to use whole numbers. If another version of the image is 450 by 300 pixels in size, you can describe it with `1.5x`.

{% Aside %}
You can use *either* width descriptors *or* density descriptors, but not both together.
{% endAside %}

## Presentational images

Images in HTML are content. That's why you always provide an `alt` attribute with a description of the image for screen readers and search engines.

If you embed an image that is purely a visual flourish without any meaningful content, use an empty `alt` attribute.

```html/2-2
<img
 src="flourish.png"
 alt=""
 width="400"
 height="50"
>
```
You must still include the `alt` attribute. A missing `alt` attribute is not the same as an empty `alt` attribute. An empty `alt` attribute conveys to a screen reader that this image is presentational.

Ideally, your presentational or decorative images shouldn't be in your HTML at all. HTML is for structure. CSS is for presentation.

## Background images

Use the `background-image` property in CSS to load presentational images.

```css
element {
  background-image: url(flourish.png);
}
```

You can specify multiple image candidates using the [`image-set`](https://developer.mozilla.org/docs/Web/CSS/image/image-set()) function for `background-image`.

The `image-set` function in CSS works a lot like the `srcset` attribute in HTML. Provide a list of images with a pixel density descriptor for each one.

```css
element {
  background-image: image-set(
    small-image.png 1x,
    medium-image.png 2x,
    large-image.png 3x
  );
}
```
The browser will choose the most appropriate image for the device's pixel density.

There are many factors to consider when you're adding images to your site:

Reserving the right space for each image.
Figuring out how many sizes you need.
Deciding whether the image is content or decorative.

It's worth spending the time to get images right. Poor image strategies are responsible for frustration and annoyance for users. A good image strategy makes your site feel snappy and sharp, regardless of the user's device or network connection.

There's one more HTML element in your toolkit to help you exercise more control over your images: [the `picture` element](/learn/design/picture-element/).

{% Assessment 'images' %}
