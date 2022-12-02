---
layout: post
title: Using the Page Visibility API
authors:
  - ernestd
date: 2010-02-24
tags:
  - blog
---

## Introduction

As Web developers, we tend to get excited by new technologies that enable us to create ever more engaging, interactive Web pages. 3D graphics with WebGL? Absolutely. Advanced audio capabilities with WebAudio? Sure thing. Real-time collaboration applications using the Web camera and microphone? Sign me up!

Less exciting, though equally important, are the technologies that allow us to build applications that run more efficiently and provide a better overall user experience. This is where an API like PageVisibility comes in.

The [Page Visibility API](http://www.w3.org/TR/page-visibility/) performs a simple but important function – it lets your application know when a page is visible to the user. This basic piece of information enables the creation of Web pages that behave differently when they are not being viewed. Consider a few examples:

- A Web page that retrieves information from a server can slow down its update cycle when not being actively viewed
- A page that displays a rotating image carousel or video/audio content can pause until the user displays the page again
- An application can decide to display notifications to the user only when it is hidden from view

At first, this API may not seem very useful beyond user convenience, but considering the huge increase in mobile Web browsing, anything that helps save the device's battery power becomes very important. By using the PageVisibility API, your site can help the user's device consume less power and last longer.

{% BrowserCompat 'api.Document.visibilityState' %}

The API specification, which as of this writing is in the Candidate Recommendation stage, provides both properties for detecting the document's visibility state as well as an event for responding to visibility changes.

In this tutorial, I'll cover the basics of the API and show how to apply it to some practical examples (feel free to skip ahead to them if you're the impatient type).

## Document Visibility Properties

The [current version of the PageVisibilityAPI spec](http://www.w3.org/TR/page-visibility/) defines two document properties: the boolean [`hidden`](http://www.w3.org/TR/page-visibility/#pv-hidden) and the enumeration [`visibilityState`](http://www.w3.org/TR/page-visibility/#pv-visibility-state). The visibilityState property currently has four possible values: `hidden`, `visible`, `prerender`, and `unloaded`.

{% Aside %}
These properties are only vendor-prefixed in Android Browser, where you’ll need to use prefixed versions such as `webkitHidden` and `webkitVisibilityState`. [All other supporting browsers](http://caniuse.com/#feat=pagevisibility) (IE 10+, Firefox, Chrome, Safari) implement the un-prefixed versions.
{% endAside %}

As you might expect, the hidden attribute returns true when the document is not visible at all. Typically, this means that the document is either minimized, on a background tab, the OS's lock screen is up, etc. The attribute is set to false if any part of the document is at least partially visible on at least one display. In addition, to accommodate accessibility tools, the hidden attribute can be set to false when a tool such as a screen magnifier completely obscures the document, but is showing a view of it.

### Dealing with vendor prefixes

To keep the focus on the code instead of all the vendor-specific prefixing, I’m going to use some helper functions to isolate the browser-specifics.  As soon as you drop support for Android 4.4 Browser you can remove this part and stick to the standard names.

```js
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document)
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}
```

### Document Properties Example

Now we can write a cross-browser function, `isHidden()`, to see if the document is visible.

```js
function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;

    return document[prop];
}
```

For a more granular view of the document's visibility, you can use the visibilityState property. This property returns one of four values:

- `hidden`: the document is completely hidden from view
- `visible`: the document is at least partially visible on at least one display device
- `prerender`: the document is loaded off-screen and not visible (this value is optional; [not all browsers will necessarily support it](https://developers.google.com/chrome/whitepapers/prerender))
- `unloaded`: if the document is to be unloaded, then this value will be returned (this value is optional; not all browsers will necessarily support it)

## The VisibilityChange Event

In addition to the visibility properties, there is a visibilitychange event that fires whenever the document's visibility state changes. You can register an event listener for this event directly on the document object:

### Event Example

```js
// use the property name to generate the prefixed event name
var visProp = getHiddenProp();
if (visProp) {
  var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
  document.addEventListener(evtname, visChange);
}

function visChange() {
   var txtFld = document.getElementById('visChangeText');

   if (txtFld) {
      if (isHidden())
         txtFld.value += "Tab Hidden!\n";
      else
         txtFld.value += "Tab Visible!\n";
   }
}
```

## Summary

Building a great Web application involves far more than just using the whiz-bang, eye catching features that users can see and interact with. A truly great application makes considerate use of the user's resources and attention, and the Page Visibility API is an important piece of that puzzle. To learn more about building resource-conscious Web applications, check out our [other performance-related articles](http://www.html5rocks.com/features/performance).

## External References

- [W3C PageVisibility API Spec](http://www.w3.org/TR/page-visibility/)
- [Web Performance Working Group](http://www.w3.org/2010/webperf/)
- [PageVisibility example in IE10](http://ie.microsoft.com/testdrive/Performance/PageVisibility/Default.html)
- [Visibility.js - a polyfill for PageVisibility](http://thechangelog.com/post/29416591924/visibility-js-a-wrapper-for-the-page-visibility-api)
- [isVis - another PageVisibility polyfill](http://coderwall.com/p/zuydwa)
