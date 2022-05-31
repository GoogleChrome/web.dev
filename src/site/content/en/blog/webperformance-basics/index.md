---
title: Measuring page load speed with navigation timing
authors:
  - samdutton
date: 2011-08-31
updated: 2013-10-29
tags:
  - blog
---

## Measuring Page Load Speed with Navigation Timing


People like web pages that load quickly. Google [experiments](http://googleresearch.blogspot.com/2009/06/speed-matters.html) show that a delay as small as a hundred milliseconds can have an adverse effect. But how do we measure web page load speed? And what does "page load" actually mean?

[Navigation Timing](http://www.w3.org/TR/navigation-timing/) is a JavaScript API for accurately measuring performance on the web. The API provides a simple way to get accurate and detailed timing statistics-natively-for page navigation and load events.  It's available now in [Internet Explorer 9](http://msdn.microsoft.com/library/ie/hh673552(v=vs.85).aspx), [Google Chrome](http://www.google.com/chrome) and in [Firefox](http://www.mozilla.org/firefox/).

This article describes the API and shows ways to make use of the timing data it exposes.

## How can I use it?

The API is accessed via the properties of the `window.performance` object:

- navigation: how the user navigated to the page
- timing: data for navigation and page load events.

Chrome also provides a `perfomance.memory` property that gives access to JavaScript memory usage data.

The simplest way to try out the API is to take a look at `window.performance` in your browser's JavaScript console.

In Google Chrome, from any web page:

1. Select __Tools > JavaScript console__ from the wrench menu at the top right of the Chrome window (or press `Ctrl-Shift-J` on Windows and Linux, or `Command-Option-J` on a Mac).
1. Type in the word __performance__ next to the __>__ prompt at the bottom of the window and press return.
1. Click __Performance__ to see the properties of the object: memory, navigation and timing.
1. Click the arrow to the left of __timing__ to view its properties.

You should see something like the following, which has been generated dynamically with code on this page:

```js
Sorry, this section is not supported in your browser.
```

To use the API in Internet Explorer, make sure the browser is running in the correct mode:

- On a web page, use the `<!doctype html>` directive to ensure the document is displayed in [Standards mode](http://msdn.microsoft.com/library/cc288325).
- In the developer tools console, you may need to adjust the browser or document mode.

## A better alternative to JavaScript Date

In the past, web developers have used the JavaScript Date object for timing metrics. A simple speed test might use code at the start of a web page like this:

```js
var start = Date.now();
```

With code at the end of the page like this:

```js
console.log("Page load took " + (Date.now() - start) + "milliseconds");
```

Using inline JavaScript to measure performance in this way is limited and unreliable for the following reasons:

- The timing code is in the page, so it affects how the page loads and the time that takes. (The Navigation Timing API can be used to get timings __after__ the page has finished loading, without affecting that process.)
- JavaScript time is [not accurate](http://ejohn.org/blog/accuracy-of-javascript-time/).
- Unless you're happy to leave timing code in a page, you won't be able to measure load speeds as experienced by your users.
- Worst of all, the Date object can't be used to measure network latency before the page began to load.

In other words, the in-the-page approach can't measure the total latency users experience when they "open a page", whether they click on a link or enter a URL in the address bar of their browser. This is because that latency includes processes such as DNS resolution, redirects and server response, which occur before page content (and JavaScript timing code) loads. It is possible to use cookies to measure the time taken between the unloading of one page, and loading of the next, but only if you host both pages. Using the cookie method won't work when a user first visits your website-which is probably the most important performance measurement-and can only give a total figure for network latency, without breaking down the data to give specific information about different types of delay.

## What does it all mean?

Each performance.timing attribute shows the time of a navigation event (such as when the page was requested) or page load event (such as when the DOM began loading), measured in milliseconds since midnight of January 1, 1970 (UTC). A zero value means that an event (such as `secureConnectionStart` or `redirectStart`) did not occur.

The meaning of these events is described in Microsoft's [performance.timing documentation](http://msdn.microsoft.com/library/ff975075) and more formally in the [W3C Recommendation](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface). Internet Explorer 9 supports all the attributes described in the API draft except `secureConnectionStart`, and in addition provides the[`msFirstPaint`](http://msdn.microsoft.com/library/ff974719) event which occurs when document display begins, after `loadEventEnd`.

The order of performance.timing events is shown in the image below from the [Navigation Timing Recommendation](http://www.w3.org/TR/navigation-timing/#processing-model):

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/INdBGUSB47XPiYY1fhhX.png", alt="Navigation timing overview", width="800", height="477" %}
</figure>

Note that the `loadEventEnd` event did not occur in this case, because the page was still being loaded when the timeline was rendered!

If you want work with `loadEventEnd`, make sure to get it after the load event has ended. For example:

```js
window.onload = function(){
  setTimeout(function(){
    var t = performance.timing;
    console.log(t.loadEventEnd - t.responseEnd);
  }, 0);
}
```

## Putting it all together

Data from the API really comes to life when events are used in combination:

- Network latency: `responseEnd`-`fetchStart`
- The time taken for page load once the page is received from the server: `loadEventEnd`-`responseEnd`
- The whole process of navigation and page load: `loadEventEnd`-`navigationStart`.

Data could also be combined in this way to pinpoint particular problems, for example by calculating the time taken for redirection using `redirectEnd`-`redirectStart`.

## How did I get to this page?

There are, of course, several ways to "open a page". This is where [performance.navigation](http://www.w3.org/TR/navigation-timing/#sec-navigation-info-interface) comes in handy. This API has just two attributes:

- **redirectCount**: the number of times the document request was redirected
- **type**: the navigation that lead to the page being loaded.

Type is an enumeration with one of three values: 

- 0: action by the user such as clicking a link or entering a URL in the browser address bar
- 1: page reload
- 2: navigation by moving back or forward through history

## In the wild

Unlike timing tests that use the Date object, the Navigation Timing API can be used in ways that do not affect page load. This makes it extremely useful for measuring page load latency in the 'real world', as experienced by actual users-rather than as tested by a developer using a development computer inside a corporate network.

For example, [XHR](http://www.w3schools.com/ajax/ajax_xmlhttprequest_create.asp) can be used to pass performance.timing data to the host server every time a page is loaded (or unloaded). This produces statistics in real time, but isn't very efficient. Alternatively, timing data could be recorded in [local storage](http://diveintohtml5.info/storage.html) for a subset of users for a subset of pages, and periodically packaged and filed to the server. In this way, the API provides a simple way to build up historical data for page performance.

## The future of Navigation Timing

Navigation Timing provides useful tools to help developers understand and optimise performance, but the API's most compelling use case is in web analytics, for which it enables rich, accurate and non-intrusive reporting.

Better reporting helps us understand page load latency. That should lead to more efficient websites and infrastructure, faster web applications, and a better experience on the web.

To get more of a sense of how the API might be used, you may want to try the [Page Speed Test](https://chrome.google.com/webstore/detail/page-speed-test/lgmnmdkkghdeagbghognjbjijpnckcid) extension for Google Chrome, developed by the author of this article. This charts current and historical navigation and page load performance for visits to any page.
