---
title: Registering a custom protocol handler 
authors:
  - ericbidelman
date: 2011-06-29
updated: 2011-06-29
tags:
  - blog

---

Chrome 13 finally includes `navigator.registerProtocolHandler`. This API allows web apps to register themselves as possible handlers for particular protocols. For example, users could select your application to handle "mailto" links.

Register a protocol scheme like:

```js
navigator.registerProtocolHandler(
    'web+mystuff', 'http://example.com/rph?q=%s', 'My App');
```   

The first parameter is the protocol. The second is the URL pattern of the application that should handle this scheme. The pattern should include a '%s' as a placeholder for data and it must must be on the same origin as the app attempting to register the protocol. Once the user approves access, you can use this link through your app, other sites, etc.:

```html
<a href="web+mystuff:some+data">Open in "My App"</a>
```

Clicking that link makes a `GET` request to `http://example.com/rph?q=web%2Bmystuff%3A:some%20data`. Thus, you have to parse `q` parameter and manually strip out data from the protocol.

It's worth noting that Firefox has had `navigator.registerProtocolHandler` implemented since FF3. One difference in Chrome's implementation is around custom protocols. Those need to be prefixed with "web+", as seen in the example above.  The following protocols do not need a "web+" prefix: "mailto", "mms", "nntp", "rtsp", "webcal".

More information on this API can be found on the [MDN article](https://developer.mozilla.org/DOM/Window.navigator.registerProtocolHandler).


