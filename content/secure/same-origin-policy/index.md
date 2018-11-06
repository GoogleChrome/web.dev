---
page_type: guide
title: Same Origin Policy
author: kosamari
web_lighthouse: N/A
wf_blink_components: N/A
---

# Same Origin Policy

The same-origin policy is a browser security feature that restricts cross-origin
interactions by documents and scripts.

A browser can load and display resources from multiple sites. You might have
multiple tabs open at the same time, or a site could embed multiple iframes from
different sites. If there is no restriction on interactions between those
resources, and if a script is compromised by an attacker, the script could
expose everything on a user's browser.  

The same-origin policy prevents this from happening by blocking read access to
resources loaded from a different origin. "But wait", you say. "I load images
and scripts from other origins _all the time_." Browsers allow a few tags to
bypass the same-origin policy when loading. This makes it easier to build pages
but increases the risk of security bugs. You can restrict the origins for these
tags using a
[Content Security Policy](https://developers.google.com/web/fundamentals/security/csp/).

What is considered "same-origin"?  
An origin is defined by the scheme (also known as the  protocol, for example
HTTP or HTTPS), port (if it is specified), and host. When all three are the same
for two URLs, it is considered same-origin. For example.
"http://www.example.com/foo" is same-origin as "http://www.example.com/bar" but
not "**https**://www.example.com/baz" (the scheme is different).

## What is permitted and what is blocked?

Generally, embedding a cross-origin resource is permitted, while reading a
cross-origin resource is blocked.

<table>
  <tbody>
    <tr>
      <th>iframe </th>
      <td>Cross-origin embed is permitted (if <code>X-Frame-Options</code> permits) but
        cross-origin read, such as using JavaScript to access a document in an
      iframe, is not permitted.</td>
    </tr>
    <tr>
      <th>css</th>
      <td>Cross-origin CSS can be embedded using a <code>&lt;link&gt;</code> tag, or @import in a CSS
      file. The correct <code>Content-Type</code> header may be required.</td>
    </tr>
    <tr>
      <th>form</th>
      <td>Cross-origin URL can be used as the <code>action</code> attribute value of a form
        element. A web application can write form data  to a cross-origin
      destination. </td>
    </tr>
    <tr>
      <th>img</th>
      <td>Embedding cross-origin images is permitted. However, reading cross-origin
        image is blocked (such as loading a cross-origin image into a <code>&lt;canvas&gt;</code>
      element using JavaScript).</td>
    </tr>
    <tr>
      <th>media</th>
      <td>Cross-origin video and audio can be embedded using <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code>
      elements.</td>
    </tr>
    <tr>
      <th>script</th>
      <td>Cross-origin script can be embedded; however, access to certain APIs might
      be blocked, such as cross-origin fetch requests.</td>
    </tr>
  </tbody>
</table>

Hopefully you feel a little relieved that browsers work hard to be a gatekeeper
of security on the web. Even though browsers try to be safe by blocking access
to resources, sometimes you want to access cross-origin resources in your
applications. In the next guide, learn about Cross Origin Resource Sharing
(CORS) and how to tell the browser that loading of cross-origin resources is
allowed from trusted sources.
