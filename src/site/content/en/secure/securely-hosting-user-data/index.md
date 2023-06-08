---
layout: post
title: Securely hosting user data in modern web applications
authors:
  - ddworken
date: 2023-06-08
description: >
  How to securely display user-controlled content on web applications.
tags:
  - security
---

{% Aside %} 
This article was originally posted on the [Google Security Blog](https://security.googleblog.com/2023/04/securely-hosting-user-data-in-modern.html). 
{% endAside %}

Many web applications need to display user-controlled content. This can be as simple as serving user-uploaded images (for example, profile photos), or as complex as rendering user-controlled HTML (for example, a web development tutorial). This has always been difficult to do securely, so we've worked to find easy, but secure solutions that can be applied to most types of web applications.

## Classic solutions for isolating untrusted content

The classic solution for securely serving user-controlled content is to use what are known as [sandbox domains](https://security.googleblog.com/2012/08/content-hosting-for-modern-web.html). The basic idea is that if your application's main domain is `example.com`, you could serve all untrusted content on `exampleusercontent.com`. Since these two domains are [cross-site](/same-site-same-origin), any malicious content on `exampleusercontent.com` can't impact `example.com`.  
This approach can be used to safely serve all kinds of untrusted content including images, downloads, and HTML. While it may not seem like it is necessary to use this for images or downloads, doing so helps avoid risks from [content sniffing](https://en.wikipedia.org/wiki/Content_sniffing), especially in legacy browsers.  
Sandbox domains are widely used across the industry and have worked well for a long time. But, they have two major downsides:

- Applications often need to restrict content access to a single user, which requires implementing authentication and authorization. Since sandbox domains purposefully do not share cookies with the main application domain, this is very difficult to do securely. To support authentication, sites either have to rely on [capability URLs](https://www.w3.org/TR/capability-urls), or they have to set separate authentication cookies for the sandbox domain. This second method is especially problematic in the modern web where many browsers restrict cross-site cookies by default.
- While user content is isolated from the main site, it isn't isolated from other user content. This creates the risk of malicious user content attacking other data on the sandbox domain (for example, via reading same-origin data).

It is also worth noting that sandbox domains help mitigate phishing risks since resources are clearly segmented onto an isolated domain.

## Modern solutions for serving user content

Over time the web has evolved, and there are now easier, more secure ways to serve untrusted content. There are many different approaches here, so we will outline two solutions that are currently in wide use at Google.

### Approach 1: Serving inactive user content

If a site only needs to serve inactive user content (that is content that is not HTML or JavaScript, for example images and downloads), this can now be safely done without an isolated sandbox domain. There are two key steps:

* Always set the `Content-Type` header to a well-known [MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) that is supported by all browsers and guaranteed not to contain active content (when in doubt, `application/octet-stream` is a safe choice).
* In addition, always set the below response headers to ensure that the browser fully isolates the response.

<table>
  <thead>
    <tr>
      <th><strong>Response Header</strong></th>
      <th><strong>Purpose</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><pre>
X-Content-Type-Options: nosniff
</pre></p></td>
      <td>Prevents content sniffing</td>
    </tr>
    <tr>
      <td><p><pre>
Content-Disposition: attachment; filename="download"
</pre></p></td>
      <td>Triggers a download rather than rendering</td>
    </tr>
    <tr>
      <td><p><pre>
Content-Security-Policy: sandbox
</pre></p></td>
      <td>Sandboxes the content as if it was served on a separate domain</td>
    </tr>
    <tr>
      <td><p><pre>
Content-Security-Policy: default-src ‘none'
</pre></p></td>
      <td>Disables JavaScript execution (and inclusion of any subresources)</td>
    </tr>
    <tr>
      <td><p><pre>
Cross-Origin-Resource-Policy: same-site
</pre></p></td>
      <td>Prevents the page from being included cross-site</td>
    </tr>
  </tbody>
</table>

This combination of headers ensures that the response can only be loaded as a subresource by your application, or downloaded as a file by the user. Furthermore, the headers provide multiple layers of protection against browser bugs through the CSP sandbox header and the `default-src` restriction. Overall, the setup outlined above provides a high degree of confidence that responses served in this way cannot lead to injection or isolation vulnerabilities.

#### Defense in depth

While the above solution represents a generally sufficient defense against XSS, there are a number of additional hardening measures that you can apply to provide additional layers of security:

-  Set a `X-Content-Security-Policy: sandbox` header for compatibility with IE11.
-  Set a `Content-Security-Policy: frame-ancestors 'none'` header to block the endpoint from being embedded.
-  Sandbox user content on an isolated subdomain by:
    -  Serving user content on an isolated subdomain (e.g. Google uses domains such as `product.usercontent.google.com`).
    -  Set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` to enable [cross-origin isolation](/coop-coep).

### Approach 2: Serving active user content

Safely serving active content (for example, HTML or SVG images) can also be done without the weaknesses of the classic sandbox domain approach.  
The simplest option is to take advantage of the `Content-Security-Policy: sandbox` header to tell the browser to isolate the response. While not all web browsers currently implement process isolation for sandbox documents, ongoing refinements to browser process models are likely to improve the separation of sandboxed content from embedding applications. If [SpectreJS](https://security.googleblog.com/2021/03/a-spectre-proof-of-concept-for-spectre.html) and [renderer compromise](https://chromium.googlesource.com/chromium/src/+/master/docs/security/compromised-renderers.md) attacks are outside of your threat model, then using CSP sandbox is likely a sufficient solution.  
At Google, we've developed a solution that can fully isolate untrusted active content by modernizing the concept of sandbox domains. The core idea is to:

- Create a new sandbox domain that is added to the [public suffix list](https://publicsuffix.org/). For example, by adding `exampleusercontent.com` to the PSL, you can ensure that `foo.exampleusercontent.com` and `bar.exampleusercontent.com` are cross-site and thus fully isolated from each other.
- URLs matching `*.exampleusercontent.com/shim` are all routed to a static shim file. This shim file contains a short HTML and JavaScript snippet that listens to the `message` event handler and renders any content it receives.
- To use this, the product creates either an iframe or a popup to `$RANDOM_VALUE.exampleusercontent.com/shim` and uses `postMessage` to send the untrusted content to the shim for rendering.
- The rendered content is transformed to a Blob and rendered inside a [sandboxed iframe](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-sandbox).

Compared to the classic sandbox domain approach, this ensures that all content is fully isolated on a unique site. And, by having the main application deal with retrieving the data to be rendered, it is no longer necessary to use capability URLs.

## Conclusion

Together, these two solutions make it possible to migrate off of classic sandbox domains like `googleusercontent.com` to more secure solutions that are compatible with third-party cookie blocking. At Google, we've already migrated many products to use these solutions and have more migrations planned for the next year. 