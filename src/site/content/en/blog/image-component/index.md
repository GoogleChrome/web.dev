---
layout: post
title: Building an effective Image Component
subhead: An image component encapsulates performance best practices and provides an out-of-the-box solution to optimize images.
date: 2021-10-25
updated: 2021-10-25
authors:
  - leenasohoni
  - karaerickson
  - alexcastle
description: |
  Images are a common source of performance bottlenecks for web applications and a key focus area for optimization. This article explains how the Aurora team at Google designed a powerful image component in Next.js that is built-in with a number of optimizations via a developer-friendly interface. This post discusses how the component was designed and the lessons we learned along the way.
hero: image/IypihH3o5cSpEMVp5i08dp69otp2/Orid6fbbep03o45XkRis.jpeg
alt: Assembling the pieces of a puzzle
tags:
  - aurora-project
  - blog
---

Images are a common source of performance bottlenecks for web applications and a key focus area for optimization. Unoptimized images [contribute to page bloat](https://almanac.httparchive.org/en/2020/page-weight#image-bytes) and currently account for over 70% of the total page weight in bytes at the 90<sup>th</sup> percentile. Multiple ways to optimize images call for an intelligent "image component" with performance solutions baked in as a default.

The [Aurora](/introducing-aurora/) team worked with [Next.js](https://nextjs.org/) to build [one such component](https://nextjs.org/docs/basic-features/image-optimization#image-component). The goal was to create an optimized image template that web developers could further customize. The component serves as a good model and sets a standard for building image components in other frameworks, content management systems (CMS), and tech-stacks. We have collaborated on a similar [component for Nuxt.js,](https://image.nuxtjs.org/components/nuxt-img/) and we are working with [Angular](https://angular.io/) on image optimization in future versions. This post discusses how we designed the Next.js Image component and the lessons we learned along the way.

{% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/NiUYg2hxW7Hi5LzdPWVo.png", alt="Image component as an extension of images", width="750", height="320" %}

## Image optimization issues and opportunities

Images not only affect performance, but also business. The number of images on a page was the second [greatest predictor of conversions](https://almanac.httparchive.org/en/2019/page-weight#bigger-complex-pages-can-be-bad-for-your-business) of users visiting websites. Sessions in which users converted had 38% fewer images than sessions where they did not convert. Lighthouse lists multiple [opportunities](/fast/#optimize-your-images) to optimize images and improve [web vitals](/vitals/) as part of its best practices audit. Some of the common areas where images can affect core web vitals, and user experience are as follows.

### Unsized images hurt CLS

Images served without their size specified can cause layout instability and contribute to a high Cumulative Layout Shift ([CLS](/cls/)). Setting the `width` and `height` attributes on [img](/patterns/web-vitals-patterns/images/img-tag/) elements can help to prevent layout shifts. For example:

```html
<img src="flower.jpg" width="360" height="240">
```

The width and height should be set such that the aspect ratio of the rendered image is close to its natural aspect ratio. A significant [difference in the aspect ratio](/image-aspect-ratio/) can result in the image looking distorted. A relatively new property that allows you to specify [aspect-ratio in CSS](/aspect-ratio/) can help to size images responsively while preventing CLS.

### Large images can hurt LCP

The larger the file size of an image, the longer it will take to download. A large image could be the "hero" image for the page or the most significant element in the viewport responsible for triggering the Largest Contentful Paint ([LCP](/lcp/)). An image that is part of the critical content and takes a long time to download will delay the LCP.

In many cases, developers can reduce image sizes through better compression and the use of [responsive](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#how_do_you_create_responsive_images) images. The `srcset` and `sizes` attributes of the `<img>` element help to provide image files with different sizes. The browser can then choose the right one depending on the screen size and resolution.

### Poor image compression can hurt LCP

Modern image formats like [AVIF](/compress-images-avif/) or [WebP](/serve-images-webp/) can provide better compression than commonly used JPEG and PNG formats. Better compression reduces the file size by 25% to 50% in some cases for the same quality of the image. This reduction leads to faster downloads with less data consumption. The app should [serve modern image formats](/uses-webp-images/) to browsers that support these formats.

### Loading unnecessary images hurts LCP

Images below the fold or not in the viewport are not displayed to the user when the page is loaded. They can be deferred so that they do not contribute to the LCP and delay it. [Lazy-loading](/lazy-loading-images/) can be used to load such images later as the user scrolls towards them.

## Optimization challenges

Teams can evaluate the performance cost due to the issues listed previously and implement best practice solutions to overcome them. However, this often does not happen in practice, and inefficient images continue to slow down the web. Possible reasons for this include:

- **Priorities**: Web developers usually tend to focus on code, JavaScript, and data optimization. As such, they may not be aware of issues with images or how to optimize them. Images created by designers or uploaded by users may not be high in the list of priorities.
- **Out-of-the-box solution**: Even if developers are aware of the nuances of image optimization, the absence of an all-in-one out-of-the-box solution for their framework or tech-stack may be a deterrent.
- **Dynamic images**: In addition to static images that are part of the application, dynamic images are uploaded by users or sourced from external databases or CMS's. It may be challenging to define the size of such images where the source of the image is dynamic.
- **Markup overload**: Solutions for including the image size or `srcset` for different sizes require additional markup for every image, which can be tedious. The `srcset` attribute was introduced in 2014 but is [used by only 26.5%](https://almanac.httparchive.org/en/2020/media#srcset) of the websites today. When using `srcset`, developers have to create images in various sizes. Tools such as [just-gimme-an-img](https://just-gimme-an-img.vercel.app/) can help but have to be used manually for every image.
- **Browser support**: Modern image formats like AVIF and WebP create smaller image files but need special handling on browsers that don't support them. Developers have to use strategies like [content negotiation](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) or the [`<picture`>](https://developer.mozilla.org/docs/Web/HTML/Element/picture) element so that images are served to all browsers.
- **Lazy loading complications**: There are multiple techniques and libraries available to implement lazy-loading for below-the-fold images. Picking the best one can be a challenge. Developers may also not know the best distance from the "fold" to load deferred images. Different viewport sizes on devices can further complicate this.
- **Changing landscape**: As browsers start supporting new HTML or CSS features to enhance performance, it may be difficult for developers to evaluate each of them. For example, Chrome is introducing the [Priority Hints](/priority-hints) feature as an [Origin Trial](/blog/origin-trials/). It can be used to boost the priority of specific images on the page. Overall, developers would find it easier if such enhancements were evaluated and implemented at the component level.

## Image component as a solution

The opportunities available to optimize images and the challenges in implementing them individually for every application led us to the idea of an image component. An image component can encapsulate and enforce best practices. By replacing the `<img>` element with an image component, developers can better address their image performance woes.

Over the last year, we have worked with the [Next.js](https://nextjs.org/) framework to design and [implement](https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx) their [Image component](https://nextjs.org/docs/api-reference/next/image). It can be used as a drop-in replacement for the existing `<img>` elements in Next.js apps as follows.

```js
// Before with <img> element:
function Logo() {
  return <img src="/logo.jpg" alt="logo" height="200" width="100" />
}

// After with image component:
import Image from 'next/image'

function Logo() {
  return <Image src="/logo.jpg" alt="logo" height="200" width="100" />
}
```

The component tries to address image-related problems generically through a rich set of features and principles. It also includes options that allow developers to customize it for various image requirements.

### Protection from layout shifts

As discussed previously, unsized images cause layout shifts and contribute to CLS. When using the Next.js Image component, developers _must_ provide an image size using the `width` and `height` attributes to prevent any layout shifts. If the size is unknown, developers must specify [`layout=fill`](https://nextjs.org/docs/api-reference/next/image#layout) to serve an unsized image that sits inside a sized container. Alternatively you can use static image imports to retrieve the size of the actual image on the hard drive at build time and include it in the image.

```js
// Image component with width and height specified
<Image src="/logo.jpg" alt="logo" height="200" width="100" />

// Image component with layout specified
<Image src="/hero.jpg" layout="fill" objectFit="cover" alt="hero" />

// Image component with image import
import Image from 'next/image'
import logo from './logo.png'

function Logo() {
  return <Image src={logo} alt="logo" />
}
```

Since developers cannot use the Image component unsized, the design ensures that they will take the time to consider image sizing and prevent layout shifts.

### Facilitate responsiveness

To make images responsive across devices, developers must set the `srcset` and `sizes` attributes in the `<img>` element. We wanted to reduce this effort with the Image component. We designed the Next.js Image component to set the attribute values only once per application. We apply them to all instances of the Image component based on the layout mode. We came up with a three-part solution:

1. `deviceSizes` property: This property can be used to configure breakpoints one-time based on the devices common to the application user base. The default values for breakpoints are included in the config file.
2. `imageSizes` property: This is also a configurable property used to get the image sizes corresponding to device size breakpoints.
3. `layout` attribute in each image: This is used to indicate how to use the `deviceSizes` and `imageSizes` properties for each image. The supported values for layout mode are `fixed`, `fill`, `intrinsic` and `responsive`

When an image is requested with layout modes _responsive_ or _fill_, Next.js identifies the image to be served based on the size of the device requesting the page and sets the `srcset` and `sizes` in the image appropriately.

The following comparison shows how the layout mode can be used to control the size of the image on different screens. We have used a [demo image](https://image-component.nextjs.gallery/layout-intrinsic) shared in the Next.js docs, viewed on a phone and a standard laptop.

<div>
<table>
   <thead>
      <tr>
         <th>Laptop screen</th>
         <th>Phone screen</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td colspan="2" >Layout = Intrinsic: Scales down to fit the container's width on smaller viewports. Does not scale up beyond the image's intrinsic size on a larger viewport. Container width is at 100%
         </td>
      </tr>
      <tr>
         <td>
            {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/qQ6WnlG5OwWX4q75ahap.png", alt="Mountains image shown as is", width="400", height="300" %}
         </td>
         <td>
            {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/d4prulPcCUl0J4lytrBF.png", alt="Mountains image scaled down", width="250", height="300" %}
         </td>
      </tr>
      <tr>
         <td colspan="2" >Layout = Fixed: Image is not responsive. Width and height are fixed similar to `<img>` element irrespective of the device where it is rendered.
         </td>
      </tr>
      <tr>
         <td>
             {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/UCZZHaEWh0x807gPXYhj.png", alt="Mountains image shown as is", width="400", height="300" %}
         </td>
         <td>
            {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/pkTbqgBlpi8K5ByzUo9Y.png", alt="Mountains image shown as is does not fit the screen", width="250", height="300" %}
         </td>
      </tr>
      <tr>
         <td colspan="2" >Layout = Responsive: Scale down or scale up depending on the width of the container on different viewports, maintaining aspect ratio.
         </td>
      </tr>
      <tr>
         <td>
            {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/DrAhreYxIqszQaszOSGD.png", alt="Mountains image scaled up to fit the screen", width="400", height="300" %}
         </td>
         <td>
             {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/RasQtoFPckwrghdcfCqr.png", alt="Mountains image scaled down to fit the screen", width="250", height="300" %}
         </td>
      </tr>
      <tr>
         <td colspan="2" >Layout = Fill: Width and height stretched to fill the parent container. (Parent `<div>` width is set to 300*500 in this example)
         </td>
      </tr>
      <tr>
         <td>
             {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/XJlHRpBH4EUngVgkA43k.png", alt="Mountains image rendered to fit 300*500 size", width="400", height="300" %}
         </td>
         <td>
            {% Img src="image/IypihH3o5cSpEMVp5i08dp69otp2/LOjRUgoxcVrxXfqptKm5.png", alt="Mountains image rendered to fit 300*500 size", width="250", height="300" %}
         </td>
      </tr>
   </tbody>
   <caption>Images rendered for different layouts</caption>
</table>
</div>

### Provide built-in lazy-loading

The Image component provides a built-in, performant [lazy loading](https://nextjs.org/docs/api-reference/next/image#loading) solution as a default. When using the `<img>` element, there are a few native options for lazy loading, but they all have drawbacks that make them tricky to use. A developer might adopt one of the following lazy loading approaches:

- Specify the [`loading`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-loading) attribute: This is easy to implement but currently [unsupported](https://caniuse.com/?search=loading) on some browsers.
- Use the [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API): Building a custom lazy-loading solution requires effort and a thoughtful design and implementation. Developers may not always have the time for this.
- Import a third-party library to lazy-load images: Additional effort may be required to evaluate and integrate a suitable third-party library for lazy loading.

In the Next.js Image component, loading is set to `"lazy"` by default. Lazy loading is implemented using Intersection Observer, which is [available on most modern browsers](https://caniuse.com/?search=IntersectionObserver). Developers are not required to do anything extra to enable it, but they can disable it when needed.

### Preload important images

Quite often, LCP elements are images, and large images can delay LCP. It is a good idea to [preload critical images](/preload-critical-assets/) so the browser can discover that image sooner. When using an `<img>` element, a preload hint may be included in the HTML head as follows.

```html
<link rel="preload" as="image" href="important.png">
```

A well-designed image component should offer a way to tweak the loading sequence of images, regardless of the framework used. In the case of the Next.js Image component, developers can indicate an image that is a good candidate for preload using the [`priority`](https://nextjs.org/docs/api-reference/next/image#priority) attribute of the images component.

```html
<Image src="/hero.jpg" alt="hero" height="400" width="200" priority />
```

Adding a `priority` attribute simplifies markup and is more convenient to use. Image component developers can also explore options to apply heuristics to automate preloading for above-the-fold images on the page that meet specific criteria.

### Encourage high-performance image hosting

[Image CDNs](/image-cdns/) are recommended for automating image optimization, and they also support [modern image formats](/uses-webp-images/) like WebP and AVIF. The Next.js Image component uses an image CDN by default using a [loader architecture](https://nextjs.org/docs/api-reference/next/image#loader). The following example shows that the loader allows for configuration of the CDN in the Next.js config file.

```js
module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://ImgApp/imgix.net',
  },
}
```

With this configuration, developers can use relative URLs in the image source, and the framework will concatenate the relative URL with the CDN path to generate the absolute URL. Popular image CDNs like [Imgix](https://imgix.com/), [Cloudinary](https://cloudinary.com/), and [Akamai](https://www.akamai.com/) are supported. The architecture supports the use of a custom cloud provider by implementing a custom [`loader`](https://nextjs.org/docs/api-reference/next/image#loader) function for the app.

### Support self-hosted images

There may be situations where websites cannot use image CDNs. In such cases, an image component must support self-hosted images. The Next.js Image component uses an [image optimizer](https://nextjs.org/docs/basic-features/image-optimization) as a built-in image server that provides a CDN-like API. The optimizer uses [Sharp](https://www.npmjs.com/package/sharp) for production image transformations if it is installed on the server. This library is a good choice for anyone looking to build their own image optimization pipeline.

### Support progressive loading

Progressive loading is a technique used to hold users' interest by displaying a placeholder image usually of significantly lower quality while the actual image loads. It improves perceived performance and enhances the user experience. It can be used in combination with lazy loading for below-the-fold images or for above-the-fold images.

The Next.js Image component supports progressive loading for the image through the [placeholder](https://nextjs.org/docs/api-reference/next/image#placeholder) property. This can be used as an [LQIP](/lazy-loading-best-practices/#wrong-layout-shifting) (Low-quality image placeholder) for displaying a low-quality or blurred image while the actual image loads.

## Impact

With all the above optimizations incorporated, we have seen success with the Next.js Image component in production and are also working with other tech stacks on similar image components.

When [Leboncoin](https://www.leboncoin.fr/) [migrated their legacy JavaScript frontend to Next.js](https://medium.com/leboncoin-engineering-blog/how-we-are-improving-our-web-performance-9f850d59d810), they also upgraded their image pipeline to use the Next.js Image component. On a page that migrated from `<img>` to next/image, LCP went down from 2.4s to 1.7s. The total image bytes downloaded for the page went from 663kB to 326kB (with ~100kB of lazy-loaded image bytes).

## Lessons Learned

Anyone creating a Next.js app can benefit from using the Next.js Image component for optimization. However, if you want to build similar performance abstractions for another framework or CMS, the following are a few lessons we learned along the way that could be helpful.

### Safety valves can cause more harm than good

In an early release of the Next.js Image component, we provided a `unsized` attribute that allowed developers to bypass the sizing requirement, and use images with unspecified dimensions. We thought this would be a necessary in instances where it was impossible to know the image's height or width in advance. However, we noticed users recommending the `unsized` attribute in GitHub issues as a catch-all solution to problems with the sizing requirement, even in cases where they could solve the problem in ways that didn't worsen CLS. We subsequently deprecated and removed the `unsized` attribute.

### Separate useful friction from pointless annoyance

The requirement for sizing an image is an example of "useful friction." It restricts the use of the component, but it provides outsized performance benefits in exchange. Users will readily accept the constraint if they have a clear picture of the potential performance benefits. Therefore, it is worthwhile to explain this tradeoff in the documentation and other published material about the component.

However, you can find workarounds for such friction without sacrificing performance. For example, during the development of the Next.js Image component, we received complaints that it was annoying to look up sizes for locally stored images. We added [static image imports](https://nextjs.org/docs/basic-features/image-optimization#image-imports), which streamline this process by automatically retrieving dimensions for local images at build time using a Babel plugin.

### Strike a balance between convenience features and performance optimizations

If your image component does nothing but impose "useful friction" on its users, developers will tend to not want to use it. We found that although performance features like image sizing and automatic generation of `srcset` values were the most important. Developer-facing convenience features like automatic lazy loading and [built-in blurry placeholders](https://nextjs.org/docs/api-reference/next/image#placeholder) also drove interest in the Next.js Image component.

### Set a roadmap for features to drive adoption

Building a solution that works perfectly for all situations is very difficult. It can be tempting to design something that works well for 75% of people and then tell the other 25% that "in these cases, this component isn't for you."

In practice, this strategy turns out to be at odds with your goals as a component designer. You want developers to adopt your component in order to benefit from its performance benefits. This is difficult to do if there is a contingent of users that are unable to migrate and feel left out of the conversation. They are likely to express disappointment, leading to negative perceptions that affect adoption.

It is advisable to have a roadmap for your component that covers all reasonable use cases over the long term. It also helps to be explicit in the documentation about what isn't supported and why in order to set expectations about the problems the component is intended to solve.

## Conclusion

Image usage and optimization is complicated. Developers have to find the balance between performance and quality of images while ensuring a great user experience. This makes image optimization a high-cost, high-impact endeavor.

Instead of having each app reinvent the wheel every time, we came up with a best practices template that developers, frameworks, and other tech-stacks could use as a reference for their own implementations. This experience will indeed prove valuable as we support other frameworks, on their image components.

The Next.js Image component has successfully improved performance outcomes in Next.js applications, thereby enhancing the user experience. We believe that it's a great model that would work well in the broader ecosystem, and we would love to hear from developers who would like to adopt this model in their projects.
