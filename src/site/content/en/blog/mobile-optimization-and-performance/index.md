---
layout: post
title: HTML5 techniques for optimizing mobile performance
authors:
  - wesleyhales
date: 2011-06-03
tags:
  - blog
---

## Introduction

Spinning refreshes, choppy page transitions, and periodic delays in tap events are just a few of the headaches in today’s mobile web environments. Developers are trying to get as close to native as they possibly can, but are often derailed by hacks, resets, and rigid frameworks.

In this article, we will discuss the bare minimum of what it takes to create a mobile HTML5 web app. The main point is to unmask the hidden complexities which today’s mobile frameworks try to hide. You will see a minimalistic approach (using core HTML5 APIs) and basic fundamentals that will empower you to write your own framework or contribute to the one you currently use.

## Hardware acceleration

Normally, GPUs handle detailed 3D modeling or CAD diagrams, but in this case, we want our primitive drawings (divs, backgrounds, text with drop shadows, images, etc.) to appear smooth and animate smoothly via the GPU.
The unfortunate thing is that most front-end developers are dishing this animation process off to a third-party party framework without being concerned about the semantics, but should these core CSS3 features masked? Let me give you a few reasons why caring about this stuff is important:

1. Memory allocation and computational burden — If you go around compositing every element in the DOM just for the sake of hardware acceleration, the next person who works on your code may chase you down and beat you severely.

1. Power Consumption — Obviously, when hardware kicks in, so does the battery. When developing for mobile, developers are forced to take the wide array of device constraints into consideration while writing mobile web apps. This will be even more prevalent as browser makers start to enable access to more and more device hardware.

1. Conflicts — I encountered glitchy behaviour when applying hardware acceleration to parts of the page that were already accelerated. So knowing if you have overlapping acceleration is *very* important.

To make user interaction smooth and as close to native as possible, we must make the browser work for us. Ideally, we want the mobile device CPU to set up the initial animation, then have the GPU responsible for only compositing different layers during the animation process. This is what translate3d, scale3d and translateZ do — they give the animated elements their own layer, thus allowing the device to render everything together smoothly. To find out more about accelerated compositing and how WebKit works, Ariya Hidayat has [a lot of good info](http://ariya.blogspot.com/2011/07/fluid-animation-with-accelerated.html) on [his blog](http://ariya.blogspot.com/).

## Page transitions

Let’s take a look at three of the most common user-interaction approaches when developing a mobile web app: slide, flip, and rotation effects.

You can view this code in action here [http://slidfast.appspot.com/slide-flip-rotate.html](http://slidfast.appspot.com/slide-flip-rotate.html) (Note: This demo is built for a mobile device, so fire up an emulator, use your phone or tablet, or reduce the size of your browser window to ~1024px or less).

First, we’ll dissect the slide, flip, and rotation transitions and how they’re accelerated. Notice how each animation only takes three or four lines of CSS and JavaScript.

### Sliding

The most common of the three transition approaches, sliding page transitions mimics the native feel of mobile applications. The slide transition is invoked to bring a new content area into the view port.

For the slide effect, first we declare our markup:

```html
<div id="home-page" class="page">
  <h1>Home Page</h1>
</div>

<div id="products-page" class="page stage-right">
  <h1>Products Page</h1>
</div>

<div id="about-page" class="page stage-left">
  <h1>About Page</h1>
</div>
```
Notice how we have this concept of staging pages left or right. It could essentially be any direction, but this is most common.

We now have animation plus hardware acceleration with just a few lines of CSS. The actual animation happens when we swap classes on the page div elements.

```css
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  /*activate the GPU for compositing each page */
  -webkit-transform: translate3d(0, 0, 0);
}
```

`translate3d(0,0,0)` is known as the “silver bullet” approach.

When the user clicks a navigation element, we execute the following JavaScript to swap the classes. No third-party frameworks are being used, this is straight up JavaScript! ;)

```js
function getElement(id) {
  return document.getElementById(id);
}

function slideTo(id) {
  //1.) the page we are bringing into focus dictates how
  // the current page will exit. So let's see what classes
  // our incoming page is using. We know it will have stage[right|left|etc...]
  var classes = getElement(id).className.split(' ');

  //2.) decide if the incoming page is assigned to right or left
  // (-1 if no match)
  var stageType = classes.indexOf('stage-left');

  //3.) on initial page load focusPage is null, so we need
  // to set the default page which we're currently seeing.
  if (FOCUS_PAGE == null) {
    // use home page
    FOCUS_PAGE = getElement('home-page');
  }

  //4.) decide how this focused page should exit.
  if (stageType > 0) {
    FOCUS_PAGE.className = 'page transition stage-right';
  } else {
    FOCUS_PAGE.className = 'page transition stage-left';
  }

  //5. refresh/set the global variable
  FOCUS_PAGE = getElement(id);

  //6. Bring in the new page.
  FOCUS_PAGE.className = 'page transition stage-center';
}
```

`stage-left` or `stage-right` becomes `stage-center` and forces the page to slide into the center view port. We are completely depending on CSS3 to do the heavy lifting.

```css
.stage-left {
  left: -480px;
}

.stage-right {
  left: 480px;
}

.stage-center {
  top: 0;
  left: 0;
}
```

Next, let’s take a look at the CSS which handles mobile device detection and orientation.
We could address every device and every resolution (see [media query resolution](http://www.w3.org/TR/css3-mediaqueries/#resolution)). I used just a few simple examples in this demo to cover most portrait and landscape views on mobile devices. This is also useful for applying hardware acceleration per device. For example, since the desktop version of WebKit accelerates all transformed elements (regardless if it’s 2-D or 3-D), it makes sense to create a media query and exclude acceleration at that level.
Note that hardware acceleration tricks do not provide any speed improvement under Android Froyo 2.2+. All composition is done within the software.

```css
/* iOS/android phone landscape screen width*/
@media screen and (max-device-width: 480px) and (orientation:landscape) {
  .stage-left {
    left: -480px;
  }

  .stage-right {
    left: 480px;
  }

  .page {
    width: 480px;
  }
}
```

### Flipping

On mobile devices, flipping is known as actually swiping the page away. Here we use some simple JavaScript to handle this event on iOS and Android (WebKit-based) devices.

View it in action [http://slidfast.appspot.com/slide-flip-rotate.html](http://slidfast.appspot.com/slide-flip-rotate.html).

When dealing with touch events and transitions, the first thing you’ll want is to get a handle on the current position of the element. See this doc for more information on WebKitCSSMatrix.

```js
function pageMove(event) {
  // get position after transform
  var curTransform = new WebKitCSSMatrix(window.getComputedStyle(page).webkitTransform);
  var pagePosition = curTransform.m41;
}
```

Since we are using a CSS3 ease-out transition for the page flip, the usual `element.offsetLeft` will not work.

Next we want to figure out which direction the user is flipping and set a threshold for an event (page navigation) to take place.

```js
if (pagePosition >= 0) {
 //moving current page to the right
 //so means we're flipping backwards
   if ((pagePosition > pageFlipThreshold) || (swipeTime < swipeThreshold)) {
     //user wants to go backward
     slideDirection = 'right';
   } else {
     slideDirection = null;
   }
} else {
  //current page is sliding to the left
  if ((swipeTime < swipeThreshold) || (pagePosition < pageFlipThreshold)) {
    //user wants to go forward
    slideDirection = 'left';
  } else {
    slideDirection = null;
  }
}
```

You’ll also notice that we are measuring the `swipeTime` in milliseconds as well. This allows the navigation event to fire if the user quickly swipes the screen to turn a page.

To position the page and make the animations look native while a finger is touching the screen, we use CSS3 transitions after each event firing.

```js
function positionPage(end) {
  page.style.webkitTransform = 'translate3d('+ currentPos + 'px, 0, 0)';
  if (end) {
    page.style.WebkitTransition = 'all .4s ease-out';
    //page.style.WebkitTransition = 'all .4s cubic-bezier(0,.58,.58,1)'
  } else {
    page.style.WebkitTransition = 'all .2s ease-out';
  }
  page.style.WebkitUserSelect = 'none';
}
```

I tried to play around with cubic-bezier to give the best native feel to the transitions, but ease-out did the trick.

Finally, to make the navigation happen, we must call our previously defined `slideTo()` methods that we used in the last demo.

```js
track.ontouchend = function(event) {
  pageMove(event);
  if (slideDirection == 'left') {
    slideTo('products-page');
  } else if (slideDirection == 'right') {
    slideTo('home-page');
  }
}
```

### Rotating

Next, let’s take a look at the rotate animation being used in this demo. At any time, you can rotate the page you’re currently viewing 180 degrees to reveal the reverse side by tapping on the “Contact” menu option. Again, this only takes a few lines of CSS and some JavaScript to assign a transition class `onclick`.
NOTE: The rotate transition isn't rendered correctly on most versions of Android because it lacks 3D CSS transform capabilities. Unfortunately, instead of ignoring the flip, Android makes the page "cartwheel" away by rotating instead of flipping. We recommend using this transition sparingly until support improves.

The markup (basic concept of front and back):

```html
<div id="front" class="normal">
...
</div>
<div id="back" class="flipped">
    <div id="contact-page" class="page">
        <h1>Contact Page</h1>
    </div>
</div>
```

The JavaScript:

```js
function flip(id) {
  // get a handle on the flippable region
  var front = getElement('front');
  var back = getElement('back');

  // again, just a simple way to see what the state is
  var classes = front.className.split(' ');
  var flipped = classes.indexOf('flipped');

  if (flipped >= 0) {
    // already flipped, so return to original
    front.className = 'normal';
    back.className = 'flipped';
    FLIPPED = false;
  } else {
    // do the flip
    front.className = 'flipped';
    back.className = 'normal';
    FLIPPED = true;
  }
}
```

The CSS:

```css
/*----------------------------flip transition */
#back,
#front {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  -webkit-transition-duration: .5s;
  -webkit-transform-style: preserve-3d;
}

.normal {
  -webkit-transform: rotateY(0deg);
}

.flipped {
  -webkit-user-select: element;
  -webkit-transform: rotateY(180deg);
}
```

## Debugging hardware acceleration

Now that we have our basic transitions covered, let’s take a look at the mechanics of how they work and are composited.

To make this magical debugging session happen, let’s fire up a couple of browsers and your IDE of choice.
First start Safari from the command line to make use of some debugging environment variables. I’m on Mac, so the commands might differ based on your OS.
Open the Terminal and type the following:

- $> export CA_COLOR_OPAQUE=1
- $> export CA_LOG_MEMORY_USAGE=1
- $> /Applications/Safari.app/Contents/MacOS/Safari

This starts Safari with a couple of debugging helpers. CA_COLOR_OPAQUE shows us which elements are actually composited or accelerated. CA_LOG_MEMORY_USAGE shows us how much memory we are using when sending our drawing operations to the [backing store](http://ariya.blogspot.com/2011/06/progressive-rendering-via-tiled-backing.html). This tells you exactly how much strain you are putting on the mobile device, and possibly give hints to how your GPU usage might be draining the target device’s battery.

Now let’s fire up Chrome so we can see some good frames per second (FPS) information:

1. Open the Google Chrome web browser.
1. In the URL bar, type [about:flags](about:flags).
1. Scroll down a few items and click on “Enable” for FPS Counter.

{% Aside %}
Do not enable the GPU compositing on all pages option. The FPS counter only appear in the left-hand corner if the browser detects compositing in your markup—and that is what we want in this case.
{% endAside %}

If you view [this page](http://slidfast.appspot.com/slide-flip-rotate.html) in your souped up version of Chrome, you will see the red FPS counter in the top left hand corner.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/w5fg5acz92ZwH3KspU5l.png", alt="Chrome FPS", width="154", height="31" %}
</figure>

This is how we know hardware acceleration is turned on. It also gives us an idea on how the animation runs and if you have any leaks (continuous running animations that should be stopped).

Another way to actually visualize the hardware acceleration is if you open the same page in Safari (with the environment variables I mentioned above). Every accelerated DOM element have a red tint to it. This shows us exactly what is being composited by layer.
Notice the white navigation is not red because it is not accelerated.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/2QS6lIPQ6aVe2M5pWAxU.png", alt="Composited Contact", width="391", height="220" %}
</figure>

A similar setting for Chrome is also available in the [about:flags](about:flags) “Composited render layer borders”.

Another great way to see the composited layers is to view the [WebKit falling leaves demo](http://www.webkit.org/blog-files/leaves/) while this mod is applied.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ptfVme1oAxnqfPCaDRxt.png", alt="omposited Leaves", width="508", height="709" %}
</figure>

And finally, to truly understand the graphics hardware performance of our application, let’s take a look at how memory is being consumed.
Here we see that we are pushing 1.38MB of drawing instructions to the CoreAnimation buffers on Mac OS. The Core Animation memory buffers are shared between OpenGL ES and the GPU to create the final pixels you see on the screen.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/W0KgG9vNZzjQ70T4HRui.png", alt="Coreanimation 1", width="730", height="438" %}
</figure>

When we simply resize or maximize the browser window, we see the memory expand as well.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/IpREM4yEE6AqWs37vzhb.png", alt="Coreanimation 2", width="599", height="505" %}
</figure>

This gives you an idea of how memory is being consumed on your mobile device only if you resize the browser to the correct dimensions. If you were debugging or testing for iPhone environments resize to 480px by 320px.
We now understand exactly how hardware acceleration works and what it takes to debug. It’s one thing to read about it, but to actually see the GPU memory buffers working visually really brings things into perspective.

## Behind the Scenes: Fetching and Caching

Now it’s time to take our page and resource caching to the next level. Much like the approach that JQuery Mobile and similar frameworks use, we are going to pre-fetch and cache our pages with concurrent AJAX calls.

Let’s address a few core mobile web problems and the reasons why we need to do this:

- Fetching: Pre-fetching our pages allows users to take the app offline and also enables no waiting between navigation actions. Of course, we don’t want to choke the device’s bandwidth when the device comes online, so we need to use this feature sparingly.
- Caching: Next, we want a concurrent or asynchronous approach when fetching and caching these pages. We also need to use localStorage (since it’s well supported amongst devices) which unfortunately isn’t asynchronous.
- AJAX and parsing the response: Using innerHTML() to insert the AJAX response into the DOM is dangerous (and [unreliable](http://martinkou.blogspot.com/2011/05/alternative-workaround-for-mobile.html)?). We instead use a [reliable mechanism](http://community.jboss.org/people/wesleyhales/blog/2011/08/28/fixing-ajax-on-mobile-devices) for AJAX response insertion and handling concurrent calls. We also leverage some new features of HTML5 for parsing the `xhr.responseText`.

Building on the code from the [Slide, Flip, and Rotate demo](http://slidfast.appspot.com/slide-flip-rotate.html), we start out by adding some secondary pages and linking to them. We’ll then parse the links and create transitions on the fly.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/faWRz82uatGOj9o6WSST.png", alt="iPhone Home", width="372", height="335" %}
</figure>

[View the Fetch and Cache demo here.](http://slidfast.appspot.com/fetch-cache.html)

As you can see, we are leveraging semantic markup here. Just a link to another page. The child page follows the same node/class structure as its parent. We could take this a step further and use the data-* attribute for “page” nodes, etc.
And here is the detail page (child) located in a separate html file (/demo2/home-detail.html) which will be loaded, cached and set up for transition on app load.

```html
<div id="home-page" class="page">
  <h1>Home Page</h1>
  <a href="demo2/home-detail.html" class="fetch">Find out more about the home page!</a>
</div>
```

Now lets take a look at the JavaScript. For simplicity sake, I am leaving any helpers or optimizations out of the code. All we are doing here is looping through a specified array of DOM nodes to dig out links to fetch and cache.
Note—For this demo, this method `fetchAndCache()` is being called on page load. We rework it in the next section when we detect the network connection and determine when it should be called.

```js
var fetchAndCache = function() {
  // iterate through all nodes in this DOM to find all mobile pages we care about
  var pages = document.getElementsByClassName('page');

  for (var i = 0; i < pages.length; i++) {
    // find all links
    var pageLinks = pages[i].getElementsByTagName('a');

    for (var j = 0; j < pageLinks.length; j++) {
      var link = pageLinks[j];

      if (link.hasAttribute('href') &amp;&amp;
      //'#' in the href tells us that this page is already loaded in the DOM - and
      // that it links to a mobile transition/page
         !(/[\#]/g).test(link.href) &amp;&amp;
        //check for an explicit class name setting to fetch this link
        (link.className.indexOf('fetch') >= 0))  {
         //fetch each url concurrently
         var ai = new ajax(link,function(text,url){
              //insert the new mobile page into the DOM
             insertPages(text,url);
         });
         ai.doGet();
      }
    }
  }
};
```

We ensure proper asynchronous post-processing through the use of the “AJAX” object. There is a more advanced explanation of using localStorage within an AJAX call in [Working Off the Grid with HTML5 Offline](http://www.html5rocks.com/en/mobile/workingoffthegrid.html). In this example, you see the basic usage of caching on each request and providing the cached objects when the server returns anything but a successful (200) response.

```js
function processRequest () {
  if (req.readyState == 4) {
    if (req.status == 200) {
      if (supports_local_storage()) {
        localStorage[url] = req.responseText;
      }
      if (callback) callback(req.responseText,url);
    } else {
      // There is an error of some kind, use our cached copy (if available).
      if (!!localStorage[url]) {
        // We have some data cached, return that to the callback.
        callback(localStorage[url],url);
        return;
      }
    }
  }
}
```

Unfortunately, since localStorage uses UTF-16 for character encoding, each single byte is stored as 2 bytes bringing our storage limit from 5MB to [2.6MB total](https://twitter.com/#!/wesleyhales/status/104992809534238721). The whole reason for fetching and caching these pages/markup outside of the application cache scope is revealed in the next section.

With the recent advances in the [iframe element](http://dev.w3.org/html5/spec-author-view/the-iframe-element.html) with HTML5, we now have a simple and effective way to parse the `responseText` we get back from our AJAX call. There are plenty of 3000-line JavaScript parsers and regular expressions which removes script tags and so on. But why not let the browser do what it does best? In this example, we are going to write the `responseText` into a temporary hidden iframe. We are using the HTML5 “sandbox” attribute which disables scripts and offers many security features…

From the spec:
The sandbox attribute, when specified, enables a set of extra restrictions on any content hosted by the iframe. Its value must be an unordered set of unique space-separated tokens that are ASCII case-insensitive. The allowed values are allow-forms, allow-same-origin, allow-scripts, and allow-top-navigation. When the attribute is set, the content is treated as being from a unique origin, forms and scripts are disabled, links are prevented from targeting other browsing contexts, and plugins are disabled.

```js
var insertPages = function(text, originalLink) {
  var frame = getFrame();
  //write the ajax response text to the frame and let
  //the browser do the work
  frame.write(text);

  //now we have a DOM to work with
  var incomingPages = frame.getElementsByClassName('page');

  var pageCount = incomingPages.length;
  for (var i = 0; i < pageCount; i++) {
    //the new page will always be at index 0 because
    //the last one just got popped off the stack with appendChild (below)
    var newPage = incomingPages[0];

    //stage the new pages to the left by default
    newPage.className = 'page stage-left';

    //find out where to insert
    var location = newPage.parentNode.id == 'back' ? 'back' : 'front';

    try {
      // mobile safari will not allow nodes to be transferred from one DOM to another so
      // we must use adoptNode()
      document.getElementById(location).appendChild(document.adoptNode(newPage));
    } catch(e) {
      // todo graceful degradation?
    }
  }
};
```

Safari correctly refuses to implicitly move a node from one document to another. An error is raised if the new child node was created in a different document. So here we use `adoptNode` and all is well.

So why iframe? Why not just use innerHTML? Even though innerHTML is now part of the HTML5 spec, it is a dangerous practice to insert the response from a server (evil or good) into an unchecked area. During the writing of this article, I couldn’t find *anyone* using anything but innerHTML. I know JQuery uses it at it’s core with an append fallback on exception only. And JQuery Mobile uses it as well. However I haven’t done any heavy testing in regards to innerHTML [“stops working randomly”](http://martinkou.blogspot.com/2011/05/alternative-workaround-for-mobile.html), but it would be very interesting to see all the platforms this affects. It would also be interesting to see which approach is more performant… I’ve heard claims from both sides on this as well.

## Network type detection, handling, and profiling

Now that we have the ability to buffer (or predictive cache) our web app, we must provide the proper connection detection features that makes our app smarter. This is where mobile app development gets extremely sensitive to online/offline modes and connection speed.
Enter [The Network Information API](http://www.w3.org/TR/netinfo-api/). Every time I show this feature in a presentation, someone in the audience raises their hand and asks “What would I use that for?”. So here is a possible way to setup an extremely smart mobile web app.

Boring common sense scenario first…
While interacting with the Web from a mobile device on a high-speed train, the network may very well go away at various moments and different geographies might support different transmission speeds (e.g., HSPA or 3G might be available in some urban areas, but remote areas might support much slower 2G technologies). The following code addresses most of the connection scenarios.

The following code provides:

- Offline access through `applicationCache`.
- Detects if bookmarked and offline.
- Detects when switching from offline to online and vice versa.
- Detects slow connections and fetches content based on network type.

Again, all of these features require very little code. First we detect our events and loading scenarios:

```js
window.addEventListener('load', function(e) {
 if (navigator.onLine) {
  // new page load
  processOnline();
 } else {
   // the app is probably already cached and (maybe) bookmarked...
   processOffline();
 }
}, false);

window.addEventListener("offline", function(e) {
  // we just lost our connection and entered offline mode, disable eternal link
  processOffline(e.type);
}, false);

window.addEventListener("online", function(e) {
  // just came back online, enable links
  processOnline(e.type);
}, false);
```

In the EventListeners above, we must tell our code if it is being called from an event or an actual page request or refresh. The main reason is because the body `onload` event won’t be fired when switching between the online and offline modes.

Next, we have a simple check for an `ononline` or `onload` event. This code resets disabled links when switching from offline to online, but if this app were more sophisticated, you might insert logic that would resume fetching content or handle the UX for intermittent connections.

```js
function processOnline(eventType) {

  setupApp();
  checkAppCache();

  // reset our once disabled offline links
  if (eventType) {
    for (var i = 0; i < disabledLinks.length; i++) {
      disabledLinks[i].onclick = null;
    }
  }
}
```

The same goes for `processOffline()`. Here you would manipulate your app for offline mode and try to recover any transactions that were going on behind the scenes. This code below digs out all of our external links and disables them—trapping users in our offline app FOREVER muhahaha!

```js
function processOffline() {
  setupApp();

  // disable external links until we come back - setting the bounds of app
  disabledLinks = getUnconvertedLinks(document);

  // helper for onlcick below
  var onclickHelper = function(e) {
    return function(f) {
      alert('This app is currently offline and cannot access the hotness');return false;
    }
  };

  for (var i = 0; i < disabledLinks.length; i++) {
    if (disabledLinks[i].onclick == null) {
      //alert user we're not online
      disabledLinks[i].onclick = onclickHelper(disabledLinks[i].href);

    }
  }
}
```

OK, so on to the good stuff. Now that our app knows what connected state it’s in, we can also check the type of connection when it’s online and adjust accordingly. I have listed typical North American providers download and latencies in the comments for each connection.

{% Aside 'warning' %}  
The `type` property used in the example below has been removed from the Network Information API. Use the `bandwidth` property instead.
{% endAside %}

```js
function setupApp(){
  // create a custom object if navigator.connection isn't available
  var connection = navigator.connection || {'type':'0'};
  if (connection.type == 2 || connection.type == 1) {
      //wifi/ethernet
      //Coffee Wifi latency: ~75ms-200ms
      //Home Wifi latency: ~25-35ms
      //Coffee Wifi DL speed: ~550kbps-650kbps
      //Home Wifi DL speed: ~1000kbps-2000kbps
      fetchAndCache(true);
  } else if (connection.type == 3) {
  //edge
      //ATT Edge latency: ~400-600ms
      //ATT Edge DL speed: ~2-10kbps
      fetchAndCache(false);
  } else if (connection.type == 2) {
      //3g
      //ATT 3G latency: ~400ms
      //Verizon 3G latency: ~150-250ms
      //ATT 3G DL speed: ~60-100kbps
      //Verizon 3G DL speed: ~20-70kbps
      fetchAndCache(false);
  } else {
  //unknown
      fetchAndCache(true);
  }
}
```

There are numerous adjustments we could make to our fetchAndCache process, but all I did here was tell it to fetch the resources asynchronous (true) or synchronous (false) for a given connection.

Edge (Synchronous) Request Timeline

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Ooj7k3G4TcK5p4OQMPCo.png", alt="Edge Sync", width="796", height="147" %}
</figure>

WIFI (Asynchronous) Request Timeline

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ioRwvKAPWzBDV19kMLhH.png", alt="WIFI Async", width="800", height="140" %}
</figure>

This allows for at least some method of user experience adjustment based on slow or fast connections.
This is by no means is an end-all-be-all solution. Another todo would be to throw up a loading modal when a link is clicked (on slow connections) while the app still may be fetching that link’s page in the background.
The big point here is to cut down on latencies while leveraging the full capabilities of the user’s connection with the latest and greatest HTML5 has to offer.
[View the network detection demo here](http://slidfast.appspot.com/network-detection.html).

## Conclusion
The journey down the road of mobile HTML5 apps is just beginning. Now you see the very simple and basic underpinnings of a mobile “framework” built solely around HTML5 and it’s supporting technologies. I think it’s important for developers to work with and address these features at their core and not masked by a wrapper.
