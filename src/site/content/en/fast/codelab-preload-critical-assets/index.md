---
layout: codelab
title: "Codelab: Preload critical assets to improve loading speed"
authors:
  - houssein
description: |
  In this codelab, learn how to improve the performance of a page by preloading
  and prefetching resources.
date: 2019-04-24
glitch: preload-critical-assets
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

In this codelab, the performance of the following web page is improved
by preloading and prefetching a few resources:

{% Img src="image/admin/Ln5Oxy5vp8QWTn0GoOFh.png", alt="App Screenshot", width="800", height="578" %}

## Measure

First measure how the website performs before adding any optimizations.

{% Instruction 'preview' %}

Run the Lighthouse performance audit (**Lighthouse > Options > Performance**) on
the live version of your Glitch (see also
[Discover performance opportunities with Lighthouse](/discover-performance-opportunities-with-lighthouse)).

Lighthouse shows the following failed audit for a resource that is fetched
late:

{% Img src="image/admin/AMhzorWlWYejd0tA11rY.png", alt="Lighthouse: Preload key requests audit", width="800", height="231", class="w-screenshot" %}

{% Instruction 'devtools-network' %}

{% Img src="image/admin/pO1f6x9pOqzYwPciKnTy.png", alt="Network panel with late-discovered resource", width="800", height="166", class="w-screenshot" %}

The `main.css` file is not fetched by a Link element (`<link>`) placed in the HTML
document, but a separate JavaScript file, `fetch-css.js`, attaches
the Link element to the DOM after the `window.onLoad` event. This means that the
file is only fetched _after_ the browser finishes parsing and executing the JS
file.  Similarly, a web font (`K2D.woff2`) specified within `main.css` is only
fetched once the CSS file has finished downloading.

The **critical request chain** represents the order of resources that are
prioritized and fetched by the browser. For this web page, it currently looks
like this:

```bash
├─┬ / (initial HTML file)
  └── fetch-css.js
    └── main.css
      └── K2D.woff2
```

Since the CSS file is on the third level of the request chain, Lighthouse has
identified it as a late-discovered resource.

## Preload critical resources

The `main.css` file is a critical asset that's needed immediately as soon as the
page is loaded. For important files like this resource that are fetched late in
your application, use a link preload tag to inform the browser to download
it sooner by adding a Link element to the head of the document.

Add a preload tag for this application:

```html/2
<head>
  <!-- ... -->
  <link rel="preload" href="main.css" as="style">
</head>
```

The `as` attribute is used to identify which type of resource is being
fetched, and `as="style"` is used to preload stylesheet files.

Reload the application and take a look at the **Network** panel in DevTools.

{% Img src="image/admin/3xjh4kLTps0fCqs7wRwP.png", alt="Network panel with preloaded resource", width="800", height="166", class="w-screenshot" %}

Notice how the browser fetches the CSS file before the JavaScript
responsible for fetching it has even been finished parsing. With preload, the browser
knows to make a preemptive fetch for the resource with the assumption that it is
critical for the web page.

{% Aside %}
If this was a real production app, it would make more sense to just place a
`<link>` element in index.html to fetch the CSS file instead of using JavaScript
to append it. Browsers already know to fetch a CSS file defined at the head of
an HTML document with a high priority as soon as possible. However, preload is
used in this codelab to demonstrate the best course of action for files that are
fetched late in the request chain. For a large application, this can happen
quite often.
{% endAside %}

If not used correctly, preload can harm performance by making unnecessary
requests for resources that aren't used. In this application, `details.css` is
another CSS file located at the root of the project but is used for a separate
`/details route`. To show an example of how preload can be used incorrectly, add a
preload hint for this resource as well.

```html/3
<head>
  <!-- ... -->
  <link rel="preload" href="main.css" as="style">
  <link rel="preload" href="details.css" as="style">
</head>
```

Reload the application and take a look at the **Network** panel.
A request is made to retrieve `details.css` even though it is not being used by the web page.

{% Img src="image/admin/vOyq8M3X2UPd5JUTvex0.png", alt="Network panel with unecessary preload", width="800", height="189", class="w-screenshot" %}

Chrome displays a warning in the **Console** panel when a preloaded resource is
not used by the page within a few seconds after it has loaded.

{% Img src="image/admin/elfGvORyRu1s0slntYHo.png", alt="Preload warning in console", width="800", height="150", class="w-screenshot" %}

Use this warning as an indicator to identify if you have any preloaded resources
that are not being used immediately by your web page. You can now remove the
unnecessary preload link for this page.

```html//3
<head>
  <!-- ... -->
  <link rel="preload" href="main.css" as="style">
  <link rel="preload" href="details.css" as="style">
</head>
```

For a list of all the types of resources that can be fetched along with the
correct values that should be used for the `as` attribute, refer to the
[MDN article on Preloading](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded).

{% Aside %}
Cross-origin resources can also be preloaded using the `crossorigin` attribute.
Moreover, same-origin font resources must be fetched using anonymous mode CORS
which is why the `crossorigin` attribute is also used in this preload tag.
The [Cross Origin Resource Sharing](/cross-origin-resource-sharing)
guide explains the topic of same-origin and cross-origin requests in more detail.
{% endAside %}

## Prefetch future resources

**Prefetch** is another browser hint that can be used to make
a request for an asset used for a different navigation route but at
a lower priority than other important assets needed for the current page.

In this website, clicking the image takes you to a separate `details/`
route.

{% Img src="image/admin/KLzVOClmdtwTZ3nhzGz5.png", alt="Details route", width="800", height="585" %}

A separate CSS file, `details.css`, contains all the styles needed for this
simple page. Add a link element to `index.html` to prefetch this resource.

```html/2
<head>
  <!-- ... -->
  <link rel="prefetch" href="details.css">
</head>
```

To understand how this triggers a request for the file, open the **Network** panel in DevTools
and uncheck the **Disable cache** option.

{% Img src="image/admin/dddEy2ERtrha2WZKN5Ou.png", alt="Disable cache in Chrome DevTools", width="800", height="145", class="w-screenshot" %}

Reload the application and notice how a very low priority request is made for
`details.css` after all the other files have been fetched.

{% Img src="image/admin/STiBaCDoaZ1Ghzbp5fOH.png", alt="Network panel with prefetched resource", width="800", height="211", class="w-screenshot" %}

With DevTools open, click the image on the website to navigate to the `details` page.
Since a link element is used in `details.html` to fetch `details.css`, a request is made for the
resource as expected.

{% Img src="image/admin/AfkaIGXdHifq8n1xD8YQ.png", alt="Details page network requests", width="800", height="106", class="w-screenshot" %}

Click the `details.css` network request in DevTools to view its details. You'll notice
that the file is retrieved from the browser's disk cache.

{% Img src="image/admin/3pPpPCjbwugX1nnqCf5e.png", alt="Details request fetched from disk cache", width="800", height="170", class="w-screenshot" %}

By taking advantage of browser idle time, prefetch makes an early request for a
resource needed for a different page. This speeds up future navigation requests
by allowing the browser to cache the asset sooner and serve it from the cache
when needed.

## Preloading and prefetching with webpack

The
[Reduce JavaScript payloads with code splitting](/reduce-javascript-payloads-with-code-splitting)
post explores the use of dynamic imports to split a bundle into multiple chunks.
This is demonstrated with a simple application that
dynamically imports a module from [Lodash](https://lodash.com/) when a form is submitted.

{% Img src="image/admin/yg2lFaDyWQFBvw7YaJ3g.gif", alt="Magic Sorter app that demonstrates code splitting", width="600", height="375", class="w-screenshot" %}

You can access [the Glitch for this application here](https://glitch.com/edit/#!/code-splitting).

The following block of code, which lives in `src/index.js,` is responsible for
dynamically importing the method when the button is clicked.

```js
form.addEventListener("submit", e => {
  e.preventDefault()
  import('lodash.sortby')
    .then(module => module.default)
    .then(sortInput())
    .catch(err => { alert(err) });
});
```

Splitting a bundle improves page loading times by
reducing its initial size. Version 4.6.0 of webpack provides support to preload or
prefetch chunks that are imported dynamically. Using this application as an
example, the `lodash` method can be prefetched at browser idle time; when a user
presses the button, there is no delay for the resource to be fetched.

Use the specific `webpackPrefetch` comment parameter within a dynamic import to prefetch a particular chunk.
Here is how it would look with this particular application.

```js/2
form.addEventListener("submit", e => {
  e.preventDefault()
  import(/* webpackPrefetch: true */ 'lodash.sortby')
    .then(module => module.default)
    .then(sortInput())
    .catch(err => { alert(err) });
});
```

Once the application is reloaded, webpack injects a prefetch tag for the
resource into the head of the document. This can be seen in the **Elements**
panel in DevTools.

{% Img src="image/admin/5Zs5L6UMnkUJXyfwtru7.png", alt="Elements panel with prefetch tag", width="800", height="520" %}

Observing the requests in the **Network** panel also shows that this chunk is
fetched with a low priority after all other resources have been requested.

{% Img src="image/admin/nGh06M2LqgTfBUwPaXK7.png", alt="Network panel with prefetched request", width="800", height="181", class="w-screenshot" %}

Although prefetch makes more sense for this use case, webpack also provides support for preloading
chunks that are dynamically imported.

```js
import(/* webpackPreload: true */ 'module')
```

## Conclusion

With this codelab, you should have a solid understanding of how preloading or prefetching certain assets can improve the user experience of your site. It is important to mention that these techniques should not be used for every resource and using them incorrectly can harm performance. The best results are noticed by only preloading or prefetching selectively.

To summarize:

+ Use **preload** for resources that are discovered late but are critical to the current page.
+ Use **prefetch** for resources that are needed for a future navigation route or user action.

Not all browsers currently support both preload and prefetch. This means that
not all users of your application may notice performance improvements.

+ [Browser support: Preload](https://caniuse.com/#feat=link-rel-preload)
+ [Browser support: Prefetch](https://caniuse.com/#feat=link-rel-prefetch)

If you would like more information about specific aspects of how preloading and
prefetching can affect your web page, refer to these articles:

+ [Preload, Prefetch and Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
+ [&lt;link rel="prefetch/preload"&gt; in webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
