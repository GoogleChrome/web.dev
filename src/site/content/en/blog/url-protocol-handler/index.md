---
layout: post
title: URL protocol handler registration for PWAs
subhead: |
  Let installed PWAs handle links that use a specific protocol for a more integrated experience.
authors:
  - thomassteiner
date: 2021-05-03
description: |
  After registering a PWA as a protocol handler, when a user clicks on a hyperlink with a specific
  scheme such as mailto://, ms-word://, or web+music:// from a browser or a platform-specific app,
  the registered PWA will open and receive the URL.
# hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/Qu2wfQ3pxR8AeEfty88S.jpg
# alt: Cup of coffee and a laptop with a video conference running showing many participants.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
---

## Background on schemes/protocols

{% Aside %} URL protocol handler registration for PWAs is part of the
[capabilities project](https://web.dev/fugu-status/) and is currently in development. This post will
be updated as the implementation progresses. {% endAside %}

A _Uniform Resource Identifier_ (URI) is a compact sequence of characters that identifies an
abstract or physical resource. Each URI begins with a
[scheme](https://tools.ietf.org/html/rfc3986#section-3.1) name that refers to a specification for
assigning identifiers within that scheme. As such, the URI syntax is a federated and extensible
naming system wherein each scheme's specification may further restrict the syntax and semantics of
identifiers using that scheme. Schemes are also known as protocols. You can see some examples of
schemes below.

```bash
tel:+1-816-555-1212
mailto:Jane.Doe@example.com
news:comp.infosystems.www.servers.unix
https://web.dev/
```

The term _Uniform Resource Locator_ (URL) refers to the subset of URIs that, in addition to
identifying a resource, provide a means of locating the resource by describing its primary access
mechanism (e.g., its network location).

## Background on the `registerProtocolHandler()` method

The secure-content-only `Navigator` method
[`registerProtocolHandler()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)
lets sites register their ability to open or handle particular URL schemes. Therefore, sites need to
call the method like so: `navigator.registerProtocolHandler(scheme, url)`. The two parameters are
defined as follows.

- `scheme`: A string containing the protocol the site wishes to handle.
- `url`: A string containing the URL of the handler. This URL must include `%s`, as a placeholder
  that will be replaced with the escaped URL to be handled.

The scheme must either be one of the
[safelisted schemes](https://html.spec.whatwg.org/multipage/system-state.html#safelisted-scheme),
for example, `bitcoin`, or begin with `web+`, followed by at least one or more lowercase ASCII
letters after the `web+` prefix, for example, `web+coffee`. To make this clearer, here is a concrete
example:

1. The user visits a site at `https://coffeeshop.example.com/` that makes the following call:
   `navigator.registerProtocolHandler('web+coffee', 'coffee?type=%s')`.
1. At a later point, while visiting `https://randomsite.example.com/`, the user clicks on a link
   such as `<a href="web+coffee:latte-macchiato">All about latte macchiato</a>`.
1. This causes the browser to navigate to the following URL:
   `https://coffeeshop.example.com/coffee?type=web+coffee:latte-macchiato`.

## What this proposal is about

The present URL protocol handler registration for PWAs proposal is about offering protocol handler
registration as part of a PWA installation through its manifest. After registering a PWA as a
protocol handler, when a user clicks on a hyperlink with a specific scheme such as `mailto://` ,
`ms-word://`, or `web+music://` from a browser or a platform-specific app, the registered PWA will
open and receive the URL. It is important to note that both the proposed manifest-based registration
and the traditional `registerProtocolHandler()` play very similar roles in practice, while still
allowing the possibility for subtle but complementary user-experiences.

Similarities include requirements around the list of schemes allowed to be registered, as well as
the name and format of parameters, etc. There are subtle differences in the manifest-based
registration, however, that might be useful to enhance the experience for PWA users. For example,
manifest-based PWA registration, may not require an additional user action apart from the
user-initiated installation of the PWA.

### Use cases

- In a word processing PWA, the user in a document encounters a link to a presentation like
  `ms-powerpoint://deck2378465`. When the user clicks on the link, the presentation PWA
  automatically opens in the correct scope and shows the slide deck.
- In a platform-specific chat app, the user in a chat message receives a link to a `magnet://` URL.
  Upon clicking the link, an installed torrent PWA launches and starts downloading.
- The user has a music streaming PWA installed. When a friend shares a link to a song like
  `web+music://songid=1234&time=0:13` and the user clicks on it, the music streaming PWA will
  automatically launch in a standalone window.

