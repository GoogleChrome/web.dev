---
layout: post
title: Working off the grid with HTML5 offline
authors:
  - paulkinlan
date: 2011-06-01
tags:
  - blog
---

## Introduction

When your web browser was tied to your desktop, there was never really a time that you couldn't get an Internet connection whenever you wanted to.

With the significant increase in the ability to access the web on mobile devices  -  first on laptops, then phones and now tablet devices, it is now easier to access your data and your apps wherever you go. Or is it?

This article was written on a train from London to Liverpool. The train has Wifi, I have a 3G data card, yet I am still never fully connected. Besides, many online tools today can't handle this intermediate state of connectivity properly.

So how do we solve this problem? It is not simple, but there are steps that you can take today that will let your users use your app whereever they are.  Some of these steps have direct solutions implemented in HTML; some will require you to implement some logic, all will help you build a better app.

## Cache your assets

Users are conditioned to not enter a URL when they are not online because they know they will get an error page.  But it doesn't have to be this way.  It is possible to build applications that will load even when there is no Internet connection.

You should build your application to present a consistent UI to your users so that even if they are offline, they can still see and use some of your application.  This will allow you to detect presence of a network connection and inform the user of the connection requirements of your application in a graceful, friendly manner.

Following our [AppCache tutorial](http://www.html5rocks.com/tutorials/appcache/beginner), you will see that it is pretty easy to get this into existing apps. Your application will include a link to a manifest file, and that manifest file will contain all the files that encompass your application.

```js
CACHE:
/js/logic.js
/js/options.js
/images/loading.png
/css/main.css
```

The browser then ensures that these assets are cached offline until the next time that the manifest file is updated.

## Detecting network connectivity

Now that you can make your app load and present a consistent interface to your users even when you are offline, you need to  detect when there is Internet connectivity.  This is especially important if your app needs an Internet connection to function properly.

HTML5 defines an event that signals when your app has connectivity. This is the simplest approach, yet it is not supported in all browsers. It is also not guaranteed to be accurate.  Most implementations of the API watch for changes in the local network interface to determine if your application is online or not. But what if your network interface is up, but your router is down?  Are you offline or online?

It is simple to check if you are online by querying window.navigator.onLine

```js 
if (navigator.onLine) {
  alert('online')
} else {
  alert('offline');
}
```

You can also be told when there is a change in the network state.  Just listen for the for the events on `window.onOnline` and `window.onOffline`

```js
window.addEventListener("offline", function(e) {
  alert("offline");
}, false);

window.addEventListener("online", function(e) {
  alert("online");
}, false);
```

The API is straightforward, how do you get it to work if the API isn't implemented in the browser?

It is possible to use a couple more signals to detect if you are offline including side-effects of the AppCache and listening to the responses from XMLHttpRequest.

### AppCache error event

The AppCache system always makes an attempt to request the manifest to check to see if it needs to update its list of assets.  If that requests fails it is normally one of two things, the manifest file is no longer being used (that is, it is not hosted) or the system is unable to access the network to fetch the file.

```js
window.applicationCache.addEventListener("error", function(e) {
  alert("Error fetching manifest: a good chance we are offline");
});
```

Detecting this request failure is a good indication of whether you have a network connection or not.

### XMLHttpRequest

Network connections can fail during the use of your application, so how do you detect this?

A large number of applications built today use XMLHttpRequest to fetch data from the server while keeping the user inside the page. XMLHttpRequest defines an event for when an error occurs on the network.  You can use this to determine if you have a network connection.

Once you build your application to be able to handle these errors you can then interact with localStorage methods to store and fetch cached data in the presence of network failure.

The following code is a great example of a "fetch" function that is able to respond to network failures.

```js
var fetch = function(url, callback) {
  var xhr = new XMLHttpRequest();

  var noResponseTimer = setTimeout(function() {
    xhr.abort();
    if (!!localStorage[url]) {
      // We have some data cached, return that to the callback.
      callback(localStorage[url]);
      return;
    }
  }, maxWaitTime);

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) {
      return;
    }

    if (xhr.status == 200) {
      clearTimeout(noResponseTimer);
      // Save the data to local storage
      localStorage[url] = xhr.responseText;
      // call the handler
      callback(xhr.responseText);
    }
    else {
      // There is an error of some kind, use our cached copy (if available).
      if (!!localStorage[url]) {
        // We have some data cached, return that to the callback.
        callback(localStorage[url]);
        return;
      }
    }
  };
  xhr.open("GET", url);
  xhr.send();
};
```

Watching for this error event is pretty easy, but passing the result out as a return value becomes quickly cubmersome and prone to errors. Luckily, the HTML DOM has a rich event mechanism that you can hook in to, to create a custom "offline/online" event.

```js
var fireEvent = function(name, data) {
  var e = document.createEvent("Event");
  e.initEvent(name, true, true);
  e.data = data;
  window.dispatchEvent(e);
};
```

Integrating the "fireEvent" method into our "fetch" function allows us to respond to events based on the network connectivity and gives us the freedom to build applications that are not tied to monitoring the returned data from a method. 

```js
var fetch = function(url, callback) {
  var xhr = new XMLHttpRequest();

  var noResponseTimer = setTimeout(function() {
    xhr.abort();
    fireEvent("connectiontimeout", {});
    if (!!localStorage[url]) {
      // We have some data cached, return that to the callback.
      callback(localStorage[url]);
      return;
    }
  }, maxWaitTime);

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState != 4) {
      return;
    }

    if (xhr.status == 200) {
      fireEvent("goodconnection", {});
      clearTimeout(noResponseTimer);
      // Save the data to local storage
      localStorage[url] = xhr.responseText;
      // call the handler
      callback(xhr.responseText);
    } else {
      fireEvent("connectionerror", {});
      // There is an error of some kind, use our cached copy (if available).
      if (!!localStorage[url]) {
        // We have some data cached, return that to the callback.
        callback(localStorage[url]);
        return;
      }
    }
  };
  xhr.open("GET", url);
  xhr.send();
};
```

We can now build applications that are notified when there is a failure somewhere in the network.

```js
window.addEventListener("connectionerror", function(e) {
  alert("There is a connection error");
});
```

### Periodically checking network state

Using the exact same structure that we in the XML Http Request example, it is possible to periodically check a file on the network to see if there is a network connection.

```js
setTimeout(function() { fetch("favicon.ico"); } , 30000);
```

Use this sparingly. If your service is popular this can produce an increased amount of traffic.

## Cache your assets. Part II: Bootstrapping

A common misconception with AppCache is the belief that all of your application's logic and assets must be cached for it to function offline.  This is not the case. You can bootstrap just enough of your app to get it into a state where you can present a user interface to your users, and load the rest of the information in at run-time.

Lets have a look at a simple example:

```html
-- index.html --
<html manifest="cache.manifest">

-- cache.manifest --
CACHE:
/js/logic.js
/js/options.js
/images/loading.png
/css/main.css

NETWORK:
*
```

It is very similar to the AppCache example in the first chapter, but note the inclusion of the “NETWORK:” section. Every request for data that is not in the CACHE section will be allowed out on to the network.

With this very simple method, we can then provide the minimum number of assets to get the application running, then once we detect that the page has loaded, we can use a JavaScript loaded to bring in the next set of assets which more completely define the application.

Script Loaders have been gaining acceptance in the Web Development community as a way to target load scripts and other against specific criteria. For example, if your browser doesn't support any client-side storage, then why load all that extra code?

Integrating a script loader into your projects can while combining it with our tests for offline support can allow you to build applications that will delight the user. Below is an example using the [YepNope](http://yepnopejs.com) JavaScript framework.


```js
yepnope({
  test : isOnline,
  yep  : ['normal.js', 'controller.js', 'assets.js'],
  nope : 'errors.js'
});
```

The above example is sligthly contrived, but you can see how given knowledge of the connection state, you can easily start to load more of your application in at run-time, and, if offline load a different set of scripts that can handle the failure cases.

## Cache your data

We gave it away a little earlier in our example "fetch" request.

To make applications useful, you must cache the data your app uses on the client. We achieved this by taking advantage of the simplicity of the localStorage API.

Every single request made by the XMLHttpRequest framework can either succeed or fail.  If it is successful we store the results of the response against the URL.  If there is a failure we check localStorage for the presence of the requested URL, and if there is data we return that.

```js
if (xhr.status == 200) {
  clearTimeout(noResponseTimer);
  // Save the data to local storage
  localStorage[url] = xhr.responseText;
  // call the handler
  callback(xhr.responseText);
}
else {
  // There is an error of some kind, use our cached copy (if available).
  if (!!localStorage[url]) {
    // We have some data cached, return that to the callback.
    callback(localStorage[url]);
    return;
  }
}
```

