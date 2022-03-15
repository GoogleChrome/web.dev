---
layout: post
title: Icons and browser colors
subhead: 
  Modern browsers make it easy to customize certain components, like icons, the address bar color, and even add things like custom tiles. These simple tweaks can increase engagement and bring users back to your site.
authors:
  - pbakaus
date: 2015-09-21
updated: 2019-08-31
description: |
  Modern browsers make it easy to customize certain components, like icons, the address bar color, and even add things like custom tiles. These simple tweaks can increase engagement and bring users back to your site.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
---

Modern browsers make it easy to customize certain components, like icons, the address bar color, and even add things like custom tiles. These simple tweaks can increase engagement and bring users back to your site.


## Provide great icons and tiles 

When a user visits your webpage, the browser tries to fetch an icon from the HTML. The icon may show up in many places, including the browser tab, recent app switch, the new (or recently visited) tab page, and more.

Providing a high quality image will make your site more recognizable, making it
easier for users to find your site. 

To fully support all browsers, you'll need to add a few tags to the `<head>`
element of each page.

```html
<!-- icon in the highest resolution we need it for -->
<link rel="icon" sizes="192x192" href="icon.png">

<!-- reuse same icon for Safari -->
<link rel="apple-touch-icon" href="ios-icon.png">

<!-- multiple icons for IE -->
<meta name="msapplication-square310x310logo" content="icon_largetile.png">
```


### Chrome and Opera

Chrome and Opera uses `icon.png`, which is scaled to the necessary size by 
the device. To prevent automatic scaling, you can also provide additional 
sizes by specifying the `sizes` attribute.


{% Aside %}
Icons sizes should be based on 48px, for example 48px, 96px, 144px and 192px.
{% endAside %}

### Safari

Safari also uses the `<link>` tag with the `rel` attribute: `apple-touch-icon` to 
indicate the home screen icon.

```html
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
```

A non-transparent PNG that's 180px or 192px square is ideal for the apple-touch-icon.

Including multiple versions via the `sizes` attribute is not recommended. 
Previously, Safari for iOS would consider the `-precomposed` keyword to avoid
adding visual effects, but it hasn't been necessary since iOS 7. 
    

### Internet Explorer and Windows Phone

Windows 8's new home screen experience supports four different layouts for 
pinned sites, and requires four icons. You can leave out the relevant meta 
tags if you don't want to support a specific size.


```html
<meta name="msapplication-square70x70logo" content="icon_smalltile.png">
<meta name="msapplication-square150x150logo" content="icon_mediumtile.png">
<meta name="msapplication-wide310x150logo" content="icon_widetile.png">
```


### Tiles in Internet Explorer

Microsoft’s "Pinned Sites" and rotating "Live Tiles" go far beyond other
implementations and are beyond the scope of this guide. You can learn more
at MSDN's
[how to create live tiles](//msdn.microsoft.com/library/ie/dn455115(v=vs.85).aspx).


## Color browser elements

Using different `meta` elements, you can customize the browser and 
even elements of the platform. Keep in mind that some may only work on certain
platforms or browsers, but they can greatly enhance the experience. 

Chrome, Firefox OS, Safari, Internet Explorer and Opera Coast allow you to define 
colors for elements of the browser, and even the platform using meta tags.

### Meta Theme Color for Chrome and Opera

To specify the theme color for Chrome on Android, use the meta theme color.

```html  
<!-- Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#4285f4">
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TjmJNR9LC84mh8LX2zxE.png", alt="Theme colors styling the address bar in Chrome.", width="800", height="614" %}
</figure>

### Safari specific styling

Safari allows you to style the status bar and specify a startup image.

#### Specify a startup image

By default, Safari shows a blank screen during load time and after multiple
loads a screenshot of the previous state of the app. You can prevent this by
telling Safari to show an explicit startup image, by adding a link tag, with
`rel=apple-touch-startup-image`. For example:

```html
<link rel="apple-touch-startup-image" href="icon.png">
```    


The image has to be in the specific size of the target device's screen or it
won't be used. Refer to
[Safari Web Content Guidelines](//developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
for further details.

While Apple's documentation is sparse on this topic, the developer community
has figured out a way to target all devices by using advanced media queries to
select the appropriate device and then specify the correct image. Here's a
working solution, courtesy of [tfausak's gist](//gist.github.com/tfausak/2222823)

#### Change the status bar appearance

You can change the appearance of the default status bar to either `black` or
`black-translucent`. With `black-translucent`, the status bar floats on top
of the full screen content, rather than pushing it down. This gives the layout
more height, but obstructs the top.  Here’s the code required:

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black">
```


  <figure class="float-left">
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/bIbzhcWA4st4dZNGhInp.png", alt="Screenshot using black-translucent.", width="328", height="258", class="screenshot" %}
    <figcaption>Screenshot using <code>black-translucent</code></figcaption>
  </figure>

  <figure class="float-right">
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ZHhtEoITFZ1LakJTYruY.png", alt="Screenshot using black", width="328", height="258", class="screenshot" %}
    <figcaption>Screenshot using <code>black</code></figcaption>
  </figure>

