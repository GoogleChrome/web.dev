---
layout: codelab
title: "Two ways to prefetch: `<link>` tags and HTTP headers"
authors:
  - demianrenzulli
description: |
  Learn how to speed up future navigations by prefetching resources.
date: 2019-09-12
glitch: two-ways-to-prefetch
related_post: link-prefetch
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

In this codelab, you'll implement prefetching in two ways: with `<link rel="prefetch">` and with HTTP `Link` header.

The sample app is a website that has a promotional landing page with a special discount for the shop's best selling t-shirt. Since the landing page links to a single product, it's safe to assume that a high percentage of users will navigate to the product details page. This makes the product page a great candidate to prefetch on the landing page.

## Measure performance

First establish the baseline performance:

{% Instruction 'remix', 'ol' %}
{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}

1. In the **Throttling** drop-down list, select **Fast 3G** to simulate a slow connection type.
1. To load the product page, click **Buy now** in the sample app.

The `product-details.html` page takes about 600 ms to load:

{% Img src="image/admin/MVpybZcY1aF8slLFgJ0n.png", alt="Network panel showing load times for product-details.html", width="800", height="186", class="w-screenshot" %}

## Prefetch the product page with `<link rel="prefetch">`

To improve navigation, insert a `prefetch` tag in the landing page to prefetch the `product-details.html` page:

- Add the following `<link>` element to the head of the `views/index.html` file:

```html/7-7/
<!doctype html>
  <html>
    <head>
       <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">

      <link rel="prefetch" href="/product-details.html" as="document">
	  ...
</head>
```

The `as` attribute is optional but recommended; it helps the browser set the right headers and determine whether the resource is already in the cache.  Example values for this attribute include: `document`, `script`, `style`, `font`, `image`, and [others](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#Attributes).

To verify that prefetching is working:

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}

1. In the **Throttling** drop-down list, select **Fast 3G** to simulate a slow connection type.
1. Clear the Disable cache checkbox.
{% Instruction 'reload-app', 'ol' %}

Now when the landing page loads, the `product-details.html` page loads too, but at the lowest priority:

{% Img src="image/admin/LDkU6zNbFU7GhPuUcaCR.png", alt="Network panel showing product-details.html prefetched.", width="800", height="172", class="w-screenshot" %}

The page is kept in the [HTTP cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) for five minutes, after which the normal [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) rules for the document apply. In this case, `product-details.html` has  a `cache-control` header with a value of `public, max-age=0`, which means that the page is kept for a total of five minutes.

### Reevaluate performance

{% Instruction 'reload-app', 'ol' %}
1. To load the product page, click **Buy now** in the sample app.

Take a look at the **Network** panel. There are two differences compared to the initial network trace:

- The **Size** column shows "prefetch cache", which means this resource was retrieved from the browser's cache rather than the network.
- The **Time** column shows that the time it takes for the document to load is now about 10 ms.

This is approximately a 98% reduction compared to the previous version, which took about 600 ms.

{% Img src="image/admin/gJZPsifaqFPozkhnMznX.png", alt="Network panel showing product-details.html retrieved from prefetch cache.", width="800", height="223", class="w-screenshot" %}

## Extra credit: Use `prefetch` as a progressive enhancement

Prefetching is best implemented as a progressive enhancement for the users who are browsing on fast connections. You can use the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) to check the network conditions and based on that dynamically inject prefetch tags. That way, you can minimize data consumption and save costs for users on slow or expensive data plans.

To implement adaptive prefetching, first remove the `<link rel="prefetch">` tag from `views/index.html`:

```html//6
<!doctype html>
  <html>
    <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
	   <link rel="prefetch" href="/product-details.html" as="document">
	   ...
	</head>
```

Then add the following code to `public/script.js` to declare a function that dynamically injects the `prefetch` tag when the user is on a fast connection:

```js/0-14/
function injectLinkPrefetchIn4g(url) {
	if (window.navigator.connection.effectiveType === '4g') {
		//generate link prefetch tag
		const linkTag = document.createElement('link');
		linkTag.rel = 'prefetch';
		linkTag.href = url;
		linkTag.as = 'document';

		//inject tag in the head of the document
		document.head.appendChild(linkTag);
	}
}
```

The function works as follows:

- It checks the [effectiveType](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType) property of the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) to determine if the user is on a 4G (or faster) connection.
- If that condition is fulfilled, it generates a `<link>` tag with `prefetch` as the type of hint, passes the URL that will be prefetched in the `href` attribute, and indicates that the resource is an HTML `document` in the `as` attribute.
- Finally, it injects the script dynamically in the `head` of the page.

Next add `script.js` to `views/index.html`, just before the closing `</body>` tag:

```html/2-2/
<body>
      ...
      <script src="/script.js"></script>
</body>

```

Requesting `script.js` at the end of the page ensures that it will be loaded and executed after the page is parsed and loaded.

To make sure that the prefetching doesn't interfere with critical resources for the current page, add the following code snippet to call `injectLinkPrefetchIn4g()` on the `window.load` event:

```html/4-7/
<body>
      ...
      <script src="/script.js"></script>
      <script>
           window.addEventListener('load', () => {
                injectLinkPrefetchIn4g('/product-details.html');
           });
      </script>
</body>

```

The landing page now prefetches `product-details.html` only on fast connections. To verify that:

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}
1. In the **Throttling** drop-down list, select **Online**.
{% Instruction 'reload-app', 'ol' %}

You should see `product-details.html` in the Network panel:

{% Img src="image/admin/NCoFDNGs0iSfBkDjiwzd.png", alt="Network panel showing product-details.html prefetched.", width="800", height="201", class="w-screenshot" %}

To verify that the product page isn't prefetched on slow connections:

1. In the Throttling drop-down list, select **Slow 3G**.
{% Instruction 'reload-app', 'ol' %}

The **Network** panel should include only the resources for the landing page without `product-details.html`:

{% Img src="image/admin/xpHuregNQIEKrVylhG3G.png", alt="Network panel showing product-details.html not being prefetched.", width="800", height="171", class="w-screenshot" %}

## Prefetch the stylesheet for the product page with the HTTP `Link` header

The HTTP `Link` header can be used to prefetch the same type of resources as the `link` tag. Deciding when to use one or the other mostly depends on your preference, as the difference in performance is insignificant. In this case, you'll use it to prefetch the main CSS of the product page, to further improve its rendering.

Add an HTTP `Link` header for `style-product.css` in the server response for the landing page:

1. Open the `server.js` file and look for the `get()` handler for the root url: `/`.
1. Add the following line at the beginning of the handler:

```js/1-1/
app.get('/', function(request, response) {
	response.set('Link', '</style-product.css>; rel=prefetch');
	response.sendFile(__dirname + '/views/index.html');
});
```

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'reload-app', 'ol' %}

The `style-product.css` is now prefetched at the lowest priority after the landing page loads:

{% Img src="image/admin/Memd8AIP4Yr5dhGGi240.png", alt="Network panel showing style-product.css prefetched.", width="800", height="205", class="w-screenshot" %}

To navigate to the product page, click **Buy now**. Take a look at the **Network** panel:

{% Img src="image/admin/12tQkKKPqx4JjaWofEYK.png", alt="Network panel showing style-product.css retrieved from prefetch cache.", width="800", height="223", class="w-screenshot" %}

The `style-product.css` file is retrieved from the "prefetch cache" and it took only 12 ms to load.

{% Aside %}
When using HTTP `Link` header, you can decide whether to prefetch depending on the network conditions based on the information available in [client hints](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/).
{% endAside %}
