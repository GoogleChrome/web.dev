---
title: Establish network connections early to improve perceived page speed
subhead: |
    Learn about rel=preconnect and rel=dns-prefetch resource hints and how to use them.
date: 2019-07-30
hero: image/admin/Dyccd1RLN0fzhjPXswmL.jpg
alt: Adam's Creation by Michelangelo on Sistine Chapel ceiling
authors:
  - mihajlija
description: |
    Learn about rel=preconnect and rel=dns-prefetch resource hints and how to use them.
tags:
  - blog
  - performance
---

Before the browser can request a resource from a server, it must establish a connection. Establishing a secure connection involves three steps:

* Look up the domain name and resolve it to an IP address.

* Set up a connection to the server.

* Encrypt the connection for security.

In each of these steps the browser sends a piece of data to a server, and the server sends back a response. That journey, from origin to destination and back, is called a [round trip](https://developer.mozilla.org/en-US/docs/Glossary/Round_Trip_Time_(RTT)).

Depending on network conditions, a single round trip might take a significant amount of time. The connection setup process might involve up to three round trips—and more in unoptimized cases.

Taking care of all that ahead of time makes applications feel much faster. This post explains how to achieve that with two resource hints: `<link rel=preconnect>` and `<link rel=dns-prefetch>`.

## Establish early connections with `rel=preconnect`

Modern browsers [try their best to anticipate](https://www.igvita.com/posa/high-performance-networking-in-google-chrome/#tcp-pre-connect) what connections a page will need, but they cannot reliably predict them all. The good news is that you can give them a (resource 😉) hint.

Adding `rel=preconnect` to a `<link>` informs the browser that your page intends to establish a connection to another domain, and that you'd like the process to start as soon as possible. Resources will load more quickly because the setup process has already been completed by the time the browser requests them.

Resource hints get their name because they are not mandatory instructions. They provide the information about what you'd like to happen, but it's ultimately up to the browser to decide whether to execute them. Setting up and keeping a connection open is a lot of work, so the browser might choose to ignore resource hints or execute them partially depending on the situation.

Informing the browser of your intention is as simple as adding a `<link>` tag to your page:

```html
<link rel="preconnect" href="https://example.com">
```

{% Img src="image/admin/988BgvmiVEAp2YVKt2jq.png", alt="A diagram showing how the download doesn't start for a while after the connection is established.", width="800", height="539" %}

You can speed up the load time by 100–500 ms by establishing early connections to important third-party origins. These numbers might seem small, but they make a difference in how [users perceive web page performance](https://developers.google.com/web/fundamentals/performance/rail#ux).

{% Aside %}
chrome.com [improved Time To Interactive](https://twitter.com/addyosmani/status/1090874825286000640) by almost 1 s by pre-connecting to important origins.
{% endAside %}

## Use-cases for `rel=preconnect`

### Knowing *where from*, but not *what* you're fetching

Due to versioned dependencies, you sometimes end up in a situation where you know you'll be requesting a resource from a particular CDN, but not the exact path for it.

<figure class="w-figure">
{% Img src="image/admin/PsP4qymb1gIp8Ip2sD9W.png", alt="A url of a script with the version name.", width="450", height="50" %}
<figcaption>An example of a versioned URL.</figcaption>
</figure>

The other common case is loading images from an [image CDN](/image-cdns), where the exact path for an image depends on media queries or runtime feature checks on the user's browser.

<figure class="w-figure">
{% Img src="image/admin/Xx4ai7tzSq12DJsQXaL1.png", alt="An image CDN URL with the parameters size=300x400 and quality=auto.", width="800", height="52" %}
<figcaption>An example of an image CDN URL.</figcaption>
</figure>

In these situations, if the resource you'll be fetching is important, you want to save as much time as possible by pre-connecting to the server. The browser won't download the file until your page requests it, but at least it can handle the connection aspects ahead of time, saving the user from waiting for several round trips.

### Streaming media

Another example where you may want to save some time in the connection phase, but not necessarily start retrieving content right away, is when streaming media from a different origin.

Depending on how your page handles the streamed content, you may want to wait until your scripts have loaded and are ready to process the stream. Pre-connecting helps you cut the waiting time to a single round trip once you're ready to start fetching.

## How to implement `rel=preconnect`

One way of initiating a `preconnect` is adding a `<link>` tag to the `<head>` of the document.

```html
<head>
    <link rel="preconnect" href="https://example.com">
</head>
```

Preconnecting is only effective for domains other than the origin domain, so you shouldn't use it for your site.

{% Aside 'caution' %}
Only preconnect to critical domains you will use soon because the browser closes any connection that isn't used within 10 seconds. Unnecessary preconnecting can delay other important resources, so limit the number of preconnected domains and [test the impact preconnecting makes](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/).
{% endAside %}

You can also initiate a preconnect via the [`Link` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link):

`Link: <https://example.com/>; rel=preconnect`

{% Aside %}
A benefit of specifying a preconnect hint in the HTTP header is that it doesn't rely on markup being parsed, and it can be triggered by requests for stylesheets, scripts, and more. For example, Google Fonts sends a `Link` header in the stylesheet response to preconnect to the domain that hosts the font files.
{% endAside %}

Some types of resources, such as fonts, are loaded in [anonymous mode](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). For those you must set the `crossorigin` attribute with the `preconnect` hint:

```html
<link rel="preconnect" href="https://example.com/ComicSans" crossorigin>
```

If you omit the `crossorigin` attribute, the browser only performs the DNS lookup.

## Resolve domain name early with `rel=dns-prefetch`

You remember sites by their names, but servers remember them by IP addresses. This is why the domain name system (DNS) exists. The browser uses DNS to convert the site name to an IP address. This process—[domain name resolution](https://hacks.mozilla.org/2018/05/a-cartoon-intro-to-dns-over-https/)— is the first step in establishing a connection.

If a page needs to make connections to many third-party domains, preconnecting all of them is counterproductive. The `preconnect` hint is best used for only the most critical connections. For all the rest, use `<link rel=dns-prefetch>` to save time on the first step, the DNS lookup, which usually takes around [20–120 ms](https://www.keycdn.com/support/reduce-dns-lookups).

DNS resolution is initiated similarly to `preconnect`: by adding a `<link>` tag to the `<head>` of the document.

```html
<link rel="dns-prefetch" href="http://example.com">
```

[Browser support for `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) is slightly different from [`preconnect`](https://caniuse.com/#search=preconnect) [support](https://caniuse.com/#search=preconnect), so `dns-prefetch` can serve as a fallback for browsers that don't support `preconnect`.


{% Compare 'better' %}
```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

{% CompareCaption %}
To safely implement the fallback technique, use separate link tags.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'worse' %}
```html
<link rel="preconnect dns-prefetch" href="http://example.com">
```

{% CompareCaption %}
Implementing `dns-prefetch` fallback in the same `<link>` tag causes a bug in Safari where `preconnect` gets cancelled.
{% endCompareCaption %}

{% endCompare %}

## Conclusion
These two resource hints are helpful for improving page speed when you know you'll download something from a third-party domain soon, but you don't know the exact URL for the resource. Examples include CDNs that distribute JavaScript libraries, images or fonts. Be mindful of constraints, use `preconnect` only for the most important resources, rely on `dns-prefetch` for the rest, and always measure the impact in the real-world.
