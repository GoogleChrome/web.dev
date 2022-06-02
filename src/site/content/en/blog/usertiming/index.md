---
title: User timing API
subhead: Understanding your Web App
authors:
  - alexdanilo
date: 2014-01-21
tags:
  - blog
---

High performance web applications are crucial to a great user experience. As web applications become more and more complex, understanding performance impact is vital to creating a compelling experience. Over the past few years, a number of different APIs have appeared in the browser to help analyse performance of the network, load times, etc. but these don’t necessarily give fine-grained detail with sufficient flexibility to find what’s slowing down your application. Enter the [User Timing API](http://www.w3.org/TR/user-timing/) which provides a mechanism you can use to instrument your web application to identify where your application is spending its time. In this article we’ll cover the API plus examples of how to use it.

## You can’t optimize what you can’t measure

The first step in speeding up a slow web application is working out where time is being spent. Measuring the time impact of areas of Javascript code is the ideal way to identify hot spots, which is the first step in finding how to improve performance. Fortunately the [User Timing API](http://www.w3.org/TR/user-timing/) provides a way that you can insert API calls at different parts of your Javascript and then extract detailed timing data that can be used to help you optimize.

## High Resolution time and `now()`

A fundamental part of accurate time measurement is precision. In the old days we had timing based around millisecond measurement which is OK, but building a jank-free 60 FPS site means each frame needs to be drawn in 16ms. So when you only have millisecond accuracy it lacks the precision needed for good analysis. Enter [High Resolution Time](http://www.w3.org/TR/hr-time/), a new timing type that’s built into modern browsers. [High Resolution Time](http://www.w3.org/TR/hr-time/) gives us floating point time stamps that can be accurate to microsecond resolution - a thousand times better than before.

To get the current time in your web application, call the [`now()`](http://www.w3.org/TR/hr-time/#dom-performance-now) method which forms an [extension](http://www.w3.org/TR/hr-time/#sec-extenstions-performance-interface) of the [Performance](http://www.w3.org/TR/navigation-timing/#performance) interface. The following code shows how to do that:

```js
var myTime = window.performance.now();
```

There is another interface called [PerformanceTiming](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) which provides a number of different times related to how your web application is loaded. The `now()` method returns the time elapsed from when the [`navigationStart`](http://www.w3.org/TR/navigation-timing/#dom-performancetiming-navigationstart)time in [PerformanceTiming](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) happened.

### The DOMHighResTimeStamp type

When trying to time web applications in the past you’d use something like `Date.now()` which returns a [DOMTimeStamp](http://www.w3.org/TR/DOM-Level-3-Core/core.html#Core-DOMTimeStamp). DOMTimeStamp returns an integer number of milliseconds as its value. In order to provide the higher accuracy needed for High Resolution time, a new type called [DOMHighResTimeStamp](http://www.w3.org/TR/hr-time/#sec-DOMHighResTimeStamp) was introduced. This type is a floating point value that also returns the time in milliseconds. But since it’s floating point, the value can represent fractional milliseconds, and so can yield an accuracy of one thousandth of a millisecond.

## The User Timing Interface

So now that we have high resolution time stamps, let’s use the [User Timing](http://www.w3.org/TR/user-timing/) interface to pull out timing information.

The User Timing interface provides functions that let us call methods at different places in our application that can provide a Hansel and Gretel style breadcrumb trail to let us track where the time is being spent.

### Using `mark()`

The [`mark()`](http://www.w3.org/TR/user-timing/#dom-performance-mark) method is the main tool in our timing analysis toolkit. What `mark()` does is store a time stamp for us. What’s super useful about `mark()` is that we can name the time stamp, and the API will remember the name and the time stamp as a single unit.

Calling `mark()` at various places in your application lets you work out how much time it took you hit that ‘mark’ in your web application.

The specification calls out a number of suggested names for marks that might be interesting and are fairly self explanatory, such as `mark_fully_loaded`, `mark_fully_visible`,`mark_above_the_fold`, etc.

For example, we could set a mark for when the application is fully loaded by using the following code:

```js
window.performance.mark('mark_fully_loaded');
```

By setting named marks throughout our web application we can gather a whole bunch of timing data and analyze it at our leisure to work out what the application is doing and when.

### Calculating measurements with `measure()`

Once you’ve set a bunch of timing marks, you’ll want to find out the elapsed time between them. You use the [`measure()`](http://www.w3.org/TR/user-timing/#dom-performance-measure) method to do that.

The `measure()` method calculates the elapsed time between marks, and can also measure the time between your mark and any of the well-known event names in the [PerformanceTiming](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) interface.

For example, you could work out the time from the DOM being complete until your application state is fully loaded by using code like:

```js
window.performance.measure('measure_load_from_dom', 'domComplete', 'mark_fully_loaded');
```

{% Aside %}
In that example we are passing the well-known name [`domComplete`](http://www.w3.org/TR/navigation-timing/#dom-performancetiming-domcomplete) from the [PerformanceTiming](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) interface.
{% endAside %}

When you call `measure()` it stores the result independent of the marks you set, so you can retrieve them later. By storing away times as your application runs, the application remains responsive, and you can dump all the data out after your application has finished some work so it can be analyzed later.

### Discarding marks with `clearMarks()`

Sometimes it’s useful to be able to get rid of a bunch of marks that you’ve set up. For example, you might do batch runs on your web application and so you want to start fresh each run.

It’s easy enough to get rid of any marks you’ve set up by calling [`clearMarks()`](http://www.w3.org/TR/user-timing/#dom-performance-clearmarks).

So the example code below would blow away all the existing marks you have, so that you can set up a timing run again if you want.

```js
window.performance.clearMarks();
```

Of course, there are some scenarios where you might not want to clear all of your marks. So if you want to get rid of specific marks, you can just pass the name of the mark you want to remove. For example, the code below:

```js
window.peformance.clearMarks('mark_fully_loaded');
```

gets rid of the mark we set in the first example while leaving any other marks we set unchanged.

You might want to get rid of any measures you’ve made as well, and there’s a corresponding method to do that called [`clearMeasures()`](http://www.w3.org/TR/user-timing/#dom-performance-clearmeasures). It works exactly the same as `clearMarks()` does, but instead working on any measurements you’ve made. For example, the code:

```js
window.performance.clearMeasures('measure_load_from_dom');
```

will remove the measure we made in the above `measure()` example. If you want to remove all measures, it works just the same as `clearMarks()` - in that you just call `clearMeasures()` without arguments.

## Getting the timing data out

It’s all well and good to set marks and measure intervals, but at some point you want to get at that timing data to perform some analysis. This is really simple too, all you have to do is use the [`PerformanceTimeline`](http://www.w3.org/TR/performance-timeline/#sec-performance-timeline) interface.

For example, the [`getEntriesByType()`](http://www.w3.org/TR/performance-timeline/#dom-performance-getentriesbytype) method lets us get all our mark times, or all of our measure times out as a list so we can iterate over it and digest the data. What’s nice is that the list gets returned in chronological order, so you can see the marks in the order they were hit in your web application.

The code below:

```js
var items = window.performance.getEntriesByType('mark');
```

returns us a list of all the marks that have been hit in our web application, whilst the code:

```js
var items = window.performance.getEntriesByType('measure');
```

returns us a list of all the measures we’ve made.

You can also get back a list of entries by using the [specific name](http://www.w3.org/TR/performance-timeline/#dom-performance-getentriesbyname) you’ve given them. So for example, the code:

```js
var items = window.performance.getEntriesByName('mark_fully_loaded');
```

would return us a list with one item in it containing the ‘mark_fully_loaded’ time stamp in the [`startTime`](http://www.w3.org/TR/performance-timeline/#dom-performanceentry-starttime) property.

## Timing an XHR request (example)

Now that we have a decent picture of the User Timing API we can use it to analyze how long all our [XMLHttpRequests](http://www.w3.org/TR/XMLHttpRequest/) take in our web application.


First we’ll modify all of our [`send()`](http://www.w3.org/TR/XMLHttpRequest/#the-send()-method) requests to issue a function call that sets up the marks, and at the same time change our success callbacks with a function call that sets another mark and then generates a measure of how long the request took.

So normally our XMLHttpRequest would look something like:

```js
var myReq = new XMLHttpRequest();
myReq.open('GET', url, true);
myReq.onload = function(e) {
  do_something(e.responseText);
}
myReq.send();
```

For our example we’ll add a global counter to track the number of requests and also to use it to store a measure for each request that’s made. The code to do this looks like:

```js
var reqCnt = 0;

var myReq = new XMLHttpRequest();
myReq.open('GET', url, true);
myReq.onload = function(e) {
  window.performance.mark('mark_end_xhr');
  reqCnt++;
  window.performance.measure('measure_xhr_' + reqCnt, 'mark_start_xhr', 'mark_end_xhr');
  do_something(e.responseText);
}
window.performance.mark('mark_start_xhr');
myReq.send();
```

The code above generates a measure with a unique name value for every XMLHttpRequest we send. We’re assuming the requests run in sequence - the code for parallel requests would need to be a bit more complex to handle requests that return out of order, we’ll leave that as an exercise for the reader.

Once the web application has done a bunch of requests we could dump them all to the console using the code below:

```js
var items = window.performance.getEntriesByType('measure');
for (var i = 0; i &lt; items.length; ++i) {
  var req = items[i];
  console.log('XHR ' + req.name + ' took ' + req.duration + 'ms');
}
```

## Conclusion

The User Timing API gives you a lot of great tools to apply to any aspect of your web application. Narrowing down the hot-spots in your application can be easily achieved by sprinkling API calls throughout your web application and post-processing the timing data generated to create a clear picture of where time is being spent. But what if your browser doesn’t support this API? No problem, you can find a [great polyfill here](https://gist.github.com/pmeenan/5902672) that emulates the API really well and plays nicely with [webpagetest.org](http://www.webpagetest.org/) as well. So what are you waiting for? Try out the User Timing API on your applications now, you’ll work out how to speed them up and your users will thank you for making their experience so much better.
