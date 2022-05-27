---
layout: post
title: Best practices for a faster web app with HTML5
authors:
  - paulirish
date: 2010-06-18
updated: 2013-10-29
tags:
  - blog
---

## Introduction

Much of HTML5 aims to deliver native browser support for components and techniques that we have achieved through JavaScript libraries thus far. Using these features, when present, can end up delivering a much faster experience for your users. In this tutorial, I won't recap the excellent performance research that you've seen at Yahoo's [Exceptional Performance site](http://developer.yahoo.com/performance/rules.html) or Google's [Page Speed docs](http://code.google.com/speed/page-speed/docs/rules_intro.html) and [Let's make the web faster](http://code.google.com/speed/index.html) site. Instead I'll focus on how putting HTML5 and CSS3 to use today can make your web apps more responsive.

## Tip 1: Use web storage in place of cookies

While cookies have been used to track unique user data for years, they have serious disadvantages. The largest flaw is that all of your cookie data is added to every HTTP request header. This can end up having a [measurable impact on response time](http://yuiblog.com/blog/2007/03/01/performance-research-part-3/), especially during XHRs. So a best practice is to [reduce cookie size](http://developer.yahoo.com/performance/rules.html#cookie_size). In HTML5 we can do better than that: use `sessionStorage` and `localStorage` in place of cookies. 

These two web storage objects can be used to persist user data on the clientside for the length of the session or indefinitely. Their data is not transferred to the server via every HTTP request, either.  They have an API that will make you happy to be rid of cookies. Here are both APIs, using cookies as a fallback.

```js
// if localStorage is present, use that
if (('localStorage' in window) && window.localStorage !== null) {

  // easy object property API
  localStorage.wishlist = '["Unicorn","Narwhal","Deathbear"]';

} else {

  // without sessionStorage we'll have to use a far-future cookie
  //   with document.cookie's awkward API :(
  var date = new Date();
  date.setTime(date.getTime()+(365*24*60*60*1000));
  var expires = date.toGMTString();
  var cookiestr = 'wishlist=["Unicorn","Narwhal","Deathbear"];'+
                  ' expires='+expires+'; path=/';
  document.cookie = cookiestr;
}
```

## Tip 2: Use CSS Transitions instead of JavaScript animation

CSS Transitions give you an attractive visual transition between two states. Most style properties can be transitioned, like manipulating the text-shadow, position, background or color.  You can use transitions into pseudo-selector states like `:hover` or from HTML5 forms, `:invalid` and `:valid` ([example with form validation states](http://bradshawenterprises.com/tests/formdemo.php)). But they're much more powerful and can be triggered when you add any class to an element.

```js
div.box {
  left: 40px;
  -webkit-transition: all 0.3s ease-out;
     -moz-transition: all 0.3s ease-out;
       -o-transition: all 0.3s ease-out;
          transition: all 0.3s ease-out;
}
div.box.totheleft { left: 0px; }
div.box.totheright { left: 80px; }
```

By adding the toggling the classes of `totheleft` and `totheright` you can move the box around. Compare this amount of code with that of a JavaScript animation library. Clearly, the number of bytes sent to the browser is much less when using CSS-based animation. Additionally, with GPU level acceleration, these visual transitions will be as smooth as possible.

## Tip 3: Use client-side databases instead of server roundtrips

[Web SQL Database](http://dev.w3.org/html5/webdatabase/) and [IndexedDB](http://www.w3.org/TR/IndexedDB/) introduce databases to the clientside. Instead of the common pattern of posting data to the server via `XMLHttpRequest` or form submission, you can leverage these clientside databases. Decreasing HTTP requests is a primary target of all performance engineers, so using these as a datastore can save many trips via XHR or form posts back to the server. `localStorage` and `sessionStorage` could be used in some cases, like capturing form submission progress, and have seen to be noticeably faster than the client-side database APIs.
For example, if you have a data grid component or an inbox with hundreds of messages, storing the data locally in a database will save you HTTP roundtrips when the user wishes to search, filter, or sort. A list of friends or a text input autocomplete could be filtered on each keystroke, making for a much more responsive user experience.

## Tip 4: JavaScript improvements lend considerable performance advantages

Many [additional methods were added to the Array protoype](https://developer.mozilla.org/Core_JavaScript_1.5_Reference/Objects/Array#Methods) in JavaScript 1.6. These are available in most browsers now, except for IE. For example:

```js
// Give me a new array of all values multiplied by 10.
[5, 6, 7, 8, 900].map(function(value) { return value * 10; });
// [50, 60, 70, 80, 9000]

// Create links to specs and drop them into #links.
['html5', 'css3', 'webgl'].forEach(function(value) {
  var linksList = document.querySelector('#links');
  var newLink = value.link('http://google.com/search?btnI=1&q=' + value + ' spec');
  linksList.innerHTML +=  newLink;
});


// Return a new array of all mathematical constants under 2.
[3.14, 2.718, 1.618].filter(function(number) {
  return number < 2;
});
// [1.618]


// You can also use these extras on other collections like nodeLists.
[].forEach.call(document.querySelectorAll('section[data-bucket]'), function(elem, i) {
  localStorage['bucket' + i] = elem.getAttribute('data-bucket');
});
```

In most cases, using these native methods yield significantly faster speeds than your typical for loop like: `for (var i = 0, len = arr.length; i &lt; len; i++)`.
Native JSON parsing (via `JSON.parse()`) replaces the json2.js file we've been used to including for a while. Native JSON is much faster and safer than using an external script and it's already in IE8, Opera 10.50, Firefox 3.5, Safari 4.0.3 and Chrome.
Native `String.trim` is another good example of being not only faster than the longhand JS equivalents, but also potentially more correct. None of these JavaScript additions are technically HTML5, but they fall within the umbrella of technologies that are coming available recently.

## Tip 5: Use cache manifest for live sites, not just offline apps

Two years back, Wordpress used Google Gears to add a feature called [Wordpress Turbo](http://en.blog.wordpress.com/2008/07/02/gears/). It essentially cached many of the resources used in the admin panel locally, speeding up file access to them. We can replicate that behavior with HTML5's applicationCache and the [`cache.manifest`](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html#manifests).
The app cache has a slight advantage over setting `Expires` headers; because you make a declarative file indicating the static resources that can be cacheable, browsers can optimize that heavily, perhaps even precaching them ahead of your use.
Consider your site's basic structure as a template. You have data that may change but the HTML around it typically remains pretty consistent. With the app cache you could treat your HTML as a series of pure templates,  cache the markup via the cache.manifest, and then deliver JSON over the wire to update the content. This model is very similar to what an iPhone or Android native news app does.

## Tip 6: Enable hardware acceleration to enhance visual experience

In leading browsers, many visual operations can leverage GPU-level acceleration, which can make highly dynamic visual operations much smoother. Hardware acceleration has been announced for [Firefox Minefield](http://www.basschouten.com/blog1.php/2010/03/02/presenting-direct2d-hardware-acceleratio) and [IE9](http://blogs.msdn.com/b/ie/archive/2010/03/16/html5-hardware-accelerated-first-ie9-platform-preview-available-for-developers.aspx) and Safari added hardware-level acceleration in version 5. (It arrived in Mobile Safari much earlier.) Chromium has [just added](http://groups.google.com/group/chromium-dev/browse_thread/thread/291aa79568684c70) 3D transforms and hardware acceleration for Windows, with the other two platforms coming soon.

GPU acceleration kicks in only under a fairly restricted set of conditions, but 3D transforms and animated opacity are the most common ways to trip the switch. A somewhat hacky but unobtrusive way to turn it on is:

```css
.hwaccel {  -webkit-transform: translateZ(0); }
```

No guarantees, though. :)
With hardware acceleration supported and enabled, animated translation, rotation, scaling and opacity will definitely be smoother with GPU compositing. They will have the benefit of being handled directly on the GPU and don't require redrawing of the layer contents. However, any property that affects the layout of the page will still be __relatively__ slow.

## Tip 7: For CPU-heavy operations, Web Workers deliver

Web Workers have two significant benefits: 1) They are fast. 2) While they chug on your tasks, the browser remains responsive. Grab a look at the [HTML5 Slide Deck](http://slides.html5rocks.com/#web-workers) for Workers in action.
Some possible situations where you could use Web Workers:

- Text formatting of a long document
- Syntax highlighting
- Image processing
- Image synthesis
- Processing large arrays

## Tip 8: HTML5 Form attributes and input types

HTML5 introduces a new set of input types, upgrading our set of `text`, `password`, and `file` to include `search`, `tel`, `url`, `email`, `datetime`, `date`, `month`, `week`, `time`, `datetime-local`, `number`, `range` and `color`. Browser support for these vary, with Opera implementing most at the moment. With feature detection you can determine if the browser has native support (and will offer a UI like a datepicker or color picker) and if not, you can continue to use the JS widgets to accomplish these common tasks.
In addition to the types, a few useful features have been added to our normal input fields. The input `placeholder` offers default text that clears when you click into them and `autofocus` focuses the caret on page load so you can interact immediately with that field. Input validation is another thing making its way in with HTML5. Adding the `required` attribute means the browser won't let the form submit until that field is filled in. Also the `pattern` attribute lets you specify a custom regular expression for the input to be tested against; with invalid values blocking form submission. This declarative syntax is a big upgrade not only in source readability but also a significant reduction of JavaScript necessary. Again, you can use feature detection to serve a fallback solution if there isn't native support for these present.
Using the native widgets here means you don't need to send the heavy javascript and css required to pull off these widgets, speeding up page load and likely improving widget responsiveness. To try out some of these input enhancements check out the [HTML5 Slide deck](http://slides.html5rocks.com/#new-form-types).

## Tip 9: Use CSS3 effects instead of requesting heavy image sprites

CSS3 delivers many new styling possibilities that supplant our use of images to represent the visual design accurately. Replacing a 2k image with 100 bytes of CSS is a huge win, not to mention you've removed yet another HTTP request. A few of the properties to familiarize yourself with are:

- Linear and radial gradients
- Border-radius for rounded corners
- Box-shadow for drop shadows and glow
- RGBA for alpha opacity
- Transforms for rotation
- CSS masks

For example you, can create very [polished buttons via gradients](http://cubiq.org/dropbox/cssgrad.html) and [replicate many other effects](http://www.phpied.com/css-performance-ui-with-fewer-images/) sans-images. Browser support for most of these is very solid, and you can use a library like [Modernizr](http://www.modernizr.com/) to catch browsers that don't support the features in order to use images in a fallback case.

## Tip 10: WebSockets for faster delivery with less bandwidth than XHR

[WebSockets](http://dev.w3.org/html5/websockets/) was designed in response to the growing popularity of
[Comet](http://en.wikipedia.org/wiki/Comet_(programming)). There are indeed advantages to using WebSockets now,
instead of the Comet over XHR model.

WebSockets has very light framing, and so the bandwidth it consumes is often lighter than that of XHR. 
[Some reports](http://axod.blogspot.com/2009/12/websocket-some-numbers.html) indicate a 35% reduction
in bytes sent across the wire. Additionally, in higher volume the performance difference when it comes to message
delivery is more apparent; XHR has been recorded [in this test](http://bloga.jp/ws/jq/wakachi/mecab/wakachi.html)
with having an aggregate time of 3500% longer than WebSockets. Lastly, [Ericcson Labs considered the performance of WebSockets](https://www.youtube.com/watch?v=Z897fkPn7Rw)
and found the ping times over HTTP were 3-5 times larger than over WebSockets due to more substantial processing
requirements. They concluded that the WebSocket protocol was clearly more suitable for realtime applications.

## Additional Resources

For measurement and performance recommendations, you should certainly be using the Firefox extensions 
[Page Speed](http://code.google.com/speed/page-speed/) and [YSlow](http://developer.yahoo.com/yslow/).
Additionally, [Speed Tracer for Chrome](http://code.google.com/webtoolkit/speedtracer/) and [DynaTrace Ajax for IE](http://ajax.dynatrace.com/pages/) provide a more detailed level of logging of analysis.
