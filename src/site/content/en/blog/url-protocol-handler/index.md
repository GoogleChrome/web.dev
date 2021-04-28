---
layout: post
title: URL protocol handler registration for PWAs
subhead: |

authors:
  - thomassteiner
date: 2021-04-28
description: |

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

A _Uniform Resource Identifier_ (URI) is a compact sequence of characters that identifies an abstract
or physical resource. Each URI begins with a
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
letters after the `web+` prefix, for example, `web+coffee`. To make this clearer, here
is a concrete example:

If the user had visited a site at `https://coffeeshop.example.com/` that made the following call:
`navigator.registerProtocolHandler('web+coffee', 'coffee?type=%s')` and then, at a later point,
while visiting `https://randomsite.example.com/`, clicked on a link such as
`<a href="web+coffee:latte-macchiato">All about latte macchiato</a>`, then the browser might
navigate to the following URL:
`https://coffeeshop.example.com/coffee?type=web+coffee:latte-macchiato`.

