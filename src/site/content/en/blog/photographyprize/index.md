---
layout: post
title: Google Photography Prize Gallery
authors:
  - ilmariheikkinen
date: 2012-02-07
tags:
  - blog
---

## Creating the Google Photography Prize Gallery

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TRSbhnmDJJHfHCLyBw1w.jpg", alt="Google Photography Prize website", width="800", height="674" %}
</figure>

We recently launched the [Gallery section](http://www.google.com/landing/photographyprize/gallery.html) on the [Google Photography Prize](http://www.google.com/landing/photographyprize/) site. The gallery shows an infinite scrolling list of photos fetched from Google+. It gets the list of photos from an [AppEngine](http://appengine.google.com) app that we use for moderating the list of photos in the gallery. We also released the gallery app as an open source project on [Google Code](http://code.google.com/p/galleryplus).

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/nJ6DW790854a0PUYw8Y1.jpg", alt="The gallery page", width="800", height="581" %}
</figure>

The backend of the gallery is an AppEngine app that uses the Google+ API to search for posts with one of the Google Photography Prize hashtags on it (e.g. #megpp and #travelgpp). The app then adds those posts to its list of unmoderated photos. Once a week, our content team goes through the list of unmoderated photos and flags ones that break our content guidelines. After hitting the Moderate-button, the unflagged photos are added to the list of photos shown on the gallery page.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Qo6NAwVg8ebaS3poSOYb.jpg", alt="The moderation backend", width="800", height="480" %}
</figure>

## Gallery frontend

The Gallery frontend is built using the [Google Closure library](http://code.google.com/closure/library/). The Gallery widget itself is a Closure component. At the top of the source file we tell Closure that this file provides a component named `photographyPrize.Gallery` and require the parts of the Closure library used by the app:

```js
goog.provide('photographyPrize.Gallery');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.net.Jsonp');
goog.require('goog.style');
```

The gallery page has a bit of JavaScript that uses JSONP to retrieve the list of photos from the AppEngine app. JSONP is a simple cross-origin JavaScript hack that injects a script that looks like `jsonpcallback("responseValue")`. To handle the JSONP stuff, we’re using the `goog.net.Jsonp` component in the Closure library.

The gallery script goes through the list of photos and generates HTML elements for them to show them on the gallery page. The infinite scrolling works by hooking up to the window scroll event and loading a new batch of photos when the window scroll is close to the bottom of the page. After loading the new photo list segment, the gallery script creates elements for the photos and adds them to the gallery element to display them.

## Displaying the list of images

The image list display method is pretty basic stuff. It goes through the image list, generates HTML elements and +1 buttons. The next step is to add the generated list segment to the gallery's main gallery element. You can see some Closure compiler conventions in the code below, note the type definitions in the JSDoc comment and the @private visibility. Private methods have an underscore (_) after their name.

```js
/**
 * Displays images in imageList by putting them inside the section element.
 * Edits image urls to scale them down to imageSize x imageSize bounding
 * box.
 *
 * @param {Array.&lt;Object>} imageList List of image objects to show. Retrieved
 *                                   by loadImages.
 * @return {Element} The generated image list container element.
 * @private
 */
photographyPrize.Gallery.prototype.displayImages_ = function(imageList) {
  
  // find the images and albums from the image list
  for (var j = 0; j &lt; imageList.length; j++) {
    // change image urls to scale them to photographyPrize.Gallery.MAX_IMAGE_SIZE
  }

  // Go through the image list and create a gallery photo element for each image.
  // This uses the Closure library DOM helper, goog.dom.createDom:
  // element = goog.dom.createDom(tagName, className, var_childNodes);

  var category = goog.dom.createDom('div', 'category');
  for (var k = 0; k &lt; items.length; k++) {
    var plusone = goog.dom.createDom('g:plusone');
    plusone.setAttribute('href', photoPageUrl);
    plusone.setAttribute('size', 'standard');
    plusone.setAttribute('annotation', 'none');

    var photo = goog.dom.createDom('div', {className: 'gallery-photo'}, ...)
    photo.appendChild(plusone);

    category.appendChild(photo);
  }
  this.galleryElement_.appendChild(category);
  return category;
};
```

## Handling scroll events

To see when the visitor has scrolled the page to the bottom and we need to load new images, the gallery hooks up to the window object's scroll event. To paper over differences in browser implementations, we're using some handy utility functions from the Closure library: `goog.dom.getDocumentScroll()` returns an `{x, y}` object with the current document scroll position, `goog.dom.getViewportSize()` returns the window size, and `goog.dom.getDocumentHeight()` the height of the HTML document.

```js
/**
 * Handle window scroll events by loading new images when the scroll reaches
 * the last screenful of the page.
 *
 * @param {goog.events.BrowserEvent} ev The scroll event.
 * @private
 */
photographyPrize.Gallery.prototype.handleScroll_ = function(ev) {
  var scrollY = goog.dom.getDocumentScroll().y;
  var height = goog.dom.getViewportSize().height;
  var documentHeight = goog.dom.getDocumentHeight();
  if (scrollY + height >= documentHeight - height / 2) {
    this.tryLoadingNextImages_();
  }
};

/**
 * Try loading the next batch of images objects from the server.
 * Only fires if we have already loaded the previous batch.
 *
 * @private
 */
photographyPrize.Gallery.prototype.tryLoadingNextImages_ = function() {
  // ...
};
```

## Loading images

To load the images from the server, we're using the `goog.net.Jsonp` component. It takes a `goog.Uri` to query. Once created, you can send a query to the Jsonp provider with a query parameter object and a success callback function.

```js
/**
 * Loads image list from the App Engine page and sets the callback function
 * for the image list load completion.
 *
 * @param {string} tag Fetch images tagged with this.
 * @param {number} limit How many images to fetch.
 * @param {number} offset Offset for the image list.
 * @param {function(Array.&lt;Object>=)} callback Function to call
 *        with the loaded image list.
 * @private
 */
photographyPrize.Gallery.prototype.loadImages_ = function(tag, limit, offset, callback) {
  var jsonp = new goog.net.Jsonp(
      new goog.Uri(photographyPrize.Gallery.IMAGE_LIST_URL));
  jsonp.send({'tag': tag, 'limit': limit, 'offset': offset}, callback);
};
```

As mentioned above, the gallery script uses the Closure compiler for compiling and minifying the code. The Closure compiler is also useful in enforcing correct typing (you use `@type foo` JSDoc notation in your comments to set the type of a property) and it also tells you when you don’t have comments for a method. 

## Unit tests

We also needed unit tests for the gallery script, so it’s handy that the Closure library has an unit testing framework built into it. It follows the jsUnit conventions, so it’s easy to get started with.

To help me in writing the unit tests, I wrote a small Ruby script that parses the JavaScript file and generates a failing unit test for each method and property in the gallery component. Given a script like:

```js
Foo = function() {}
Foo.prototype.bar = function() {}
Foo.prototype.baz = "hello";
```

The test generator generates an empty test for each of the properties:

```js
function testFoo() {
  fail();
  Foo();
}

function testFooPrototypeBar = function() {
  fail();
  instanceFoo.bar();
}

function testFooPrototypeBaz = function() {
  fail();
  instanceFoo.baz;
}
```

These autogenerated tests gave me an easy start in writing tests for the code, and all the methods and properties were covered by default. The failing tests create a nice psychological effect where I had to go through the tests one by one and write proper tests. Coupled with a code coverage meter, it’s a fun game to make the tests and coverage all green. 

## Summary
Gallery+ is an open source project to display a moderated list of Google+ photos matching a #hashtag. It was built using Go and the Closure library. The backend runs on App Engine. Gallery+ is used on the Google Photography Prize website to display the submission gallery.
In this article we walked through the juicy bits of the frontend script. My collague Johan Euphrosine from the App Engine Developer Relations team is writing a second article talking about the backend app. The backend is written in Go, Google's new server-side language. So if you're interested in seeing a production example of Go code, stay tuned!

## References

- [Google Photography Prize](http://google.com/landing/photographyprize/)
- [Gallery+](http://code.google.com/p/galleryplus/) project page
- [Closure library](http://code.google.com/closure/library/)
- [Closure compiler](http://code.google.com/closure/compiler/)
