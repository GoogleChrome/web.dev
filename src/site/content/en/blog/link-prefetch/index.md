---
title: Prefetch resources to speed up future navigations
subhead: |
    Learn about rel=prefetch resource hint and how to use it.
date: 2019-09-12
authors:
  - demianrenzulli
description: |
    Learn about rel=prefetch resource hint and how to use it.
tags:
  - blog
  - performance
codelabs: codelab-two-ways-to-prefetch
feedback:
  - api
---

Research shows that [faster load times result in higher conversion rates](https://wpostats.com/) and better user experiences. If you have insight into how users move through your website and which pages they will likely visit next, you can improve load times of future navigations by downloading the resources for those pages ahead of time.

This guide explains how to achieve that with `<link rel=prefetch>`, a [resource hint](https://www.w3.org/TR/resource-hints/) that enables you to implement prefetching in an easy and efficient way.

## Improve navigations with `rel=prefetch`

Adding `<link rel=prefetch>` to a web page tells the browser to download entire pages, or some of the resources (like scripts or CSS files), that the user might need in the future. This can improve metrics like [First Contentful Paint](/first-contentful-paint) and [Time to Interactive](/interactive/) and can often make subsequent navigations appear to load instantly.

```html
<link rel="prefetch" href="/articles/" as="document">
```

{% Img src="image/admin/djLGrbmj5eovwa6qhlm1.png", alt="A diagram showing how link prefetch works.", width="800", height="413" %}

The `prefetch` hint consumes extra bytes for resources that are not immediately needed, so this technique needs to be applied thoughtfully; only prefetch resources when you are confident that users will need them. Consider not prefetching when users are on slow connections. You can detect that with the [Network Information API](/adaptive-serving-based-on-network-quality/).

There are different ways to determine which links to prefetch. The simplest one is to prefetch the first link or the first few links on the current page. There are also libraries that use more sophisticated approaches, explained later in this post.

## Use cases

### Prefetching subsequent pages

Prefetch HTML documents when subsequent pages are predictable, so that when a link is clicked, the page is loaded instantly.

For example, in a product listing page, you can prefetch the page for the most popular product in the list. In some cases, the next navigation is even easier to anticipate—on a shopping cart page, the likelihood of a user visiting the checkout page is usually high which makes it a good candidate for prefetching.

{% Aside %}
eBay implemented prefetching for the first five results on a search page to speed up future pages loads and saw a positive impact on conversion rates.
{% endAside %}

### Prefetching static assets

Prefetch static assets, like scripts or stylesheets, when subsequent sections the user might visit can be predicted. This is especially useful when those assets are shared across many pages.

For example, Netflix takes advantage of the time users spend on logged-out pages, to prefetch React, which will be used once users log in. Thanks to this, they [reduced Time to Interactive by 30% for future navigations](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9).

{% Aside 'gotchas' %}
At the time of this writing, it is possible to share prefetched resources among pages served from different origins. When [Double-keyed HTTP cache](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/6KKXv1PqPZ0/oguPntMGDgAJ) ships, this will only work for top-level navigations and same-origin subresources, but it won't be possible to reuse prefetched subresources among different origins. This means that, if `a.com` prefetches the resource `b.com/library.js`, it won't be available in `c.com` cache. Some browsers, such as WebKit-based ones, already [partition caches and HTML5 storage](https://webkit.org/blog/7675/intelligent-tracking-prevention/) for all third-party domains.
{% endAside %}

### Prefetching on-demand JavaScript chunks

[Code-splitting](/reduce-javascript-payloads-with-code-splitting) your JavaScript bundles allows you to initially load only parts of an app and lazy-load the rest. If you're using this technique, you can apply prefetch to routes or components that are not immediately necessary but will likely be requested soon.

For example, if you have a page that contains a button that opens a dialog box which contains an emoji picker, you can divide it into three JavaScript chunks—home, dialog and picker. Home and dialog could be initially loaded, while the picker could be loaded on-demand. Tools like webpack allow you to instruct the browser to prefetch these on-demand chunks.

## How to implement `rel=prefetch`

The simplest way to implement `prefetch` is adding a `<link>` tag to the `<head>` of the document:

```html
<head>
	...
	<link rel="prefetch" href="/articles/" as="document">
	...
</head>

```

The `as` attribute is not mandatory, but it's recommended. It helps the browser set the right headers, and determine whether the resource is already in the cache. Example values for this attribute include: `document`, `script`, `style`, `font`, `image`, and [others](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#Attributes).

You can also initiate prefetching via the [`Link` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link):

`Link: </css/style.css>; rel=prefetch`

A benefit of specifying a prefetch hint in the HTTP Header is that the browser doesn't need to parse the document to find the resource hint, which can offer small improvements in some cases.

{% Aside %}
`prefetch` is supported in [all modern browsers except Safari](https://caniuse.com/#search=prefetch). You can implement a fallback technique for Safari with [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) requests or the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
{% endAside %}

### Prefetching JavaScript modules with webpack magic comments

webpack enables you to prefetch scripts for routes or functionality you're reasonably certain users will visit or use soon.

The following code snippet lazy-loads a sorting functionality from the [lodash](https://lodash.com/) library to sort a group of numbers that will be submitted by a form:

```js
form.addEventListener("submit", e => {
	e.preventDefault()
	import('lodash.sortby')
		.then(module => module.default)
		.then(sortInput())
		.catch(err => { alert(err) });
});
```

Instead of waiting for the 'submit' event to take place to load this functionality, you can prefetch this resource to increase the chances of having it available in the cache by the time the user submits the form. webpack allows that using the [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) inside `import()`:

```js/2
form.addEventListener("submit", e => {
   e.preventDefault()
   import(/* webpackPrefetch: true */ 'lodash.sortby')
         .then(module => module.default)
         .then(sortInput())
         .catch(err => { alert(err) });
});
```

This tells webpack to inject the `<link rel="prefetch">` tag into the HTML document:

```html
<link rel="prefetch" as="script" href="1.bundle.js">
```

### Smart prefetching with quicklink and Guess.js

You can also implement smarter prefetching with libraries that use `prefetch` under the hood:

- [quicklink](https://github.com/GoogleChromeLabs/quicklink) uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when links come into the viewport and prefetches linked resources during [idle time](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback). Bonus: quicklink weighs less than 1 KB!
- [Guess.js](https://github.com/guess-js) uses analytics reports to build a predictive model that is used to [smartly prefetch](/predictive-prefetching/) only what the user is likely to need.

Both quicklink and Guess.js use the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) to avoid prefetching if a user is on a slow network or has [`Save-Data`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data) turned on.

{% Aside %}
A wine company Jabong implemented prefetching with quicklink and achieved 2.7 s faster Time To Interactive on future pages.
{% endAside %}

## Prefetching under the hood

Resource hints are not mandatory instructions and it's up to the browser to decide if, and when, they get executed.

You can use prefetch multiple times in the same page. The browser queues up all hints and requests each resource when it's [idle](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ#How_is_browser_idle_time_determined.3F). In Chrome, if a prefetch has not finished loading and the user navigates to the destined prefetch resource, the in-flight load is picked up as the navigation by the browser (other browser vendors might implement this differently).

Prefetching takes place at the ['Lowest' priority](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit), so prefetched resources do not compete for bandwidth with the resources required in the current page.

Prefetched files are stored in the [HTTP Cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching), or the [memory cache](https://calendar.perfplanet.com/2016/a-tale-of-four-caches/) (depending on whether the resource is cacheable or not), for an amount of time that varies by browsers. For example, in Chrome resources are kept around for five minutes, after which the normal cache-control rules for the resource apply.

## Conclusion

Using `prefetch` can greatly improve load times of future navigations and even make pages appear to load instantly. `prefetch` is widely supported in modern browsers, which makes it an attractive technique to improve the navigation experience for many users. This technique requires loading extra bytes that might not be used, so be mindful when you use it; only do it when necessary, and ideally, only on fast networks.
