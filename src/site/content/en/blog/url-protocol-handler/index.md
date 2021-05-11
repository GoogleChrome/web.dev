---
layout: post
title: URL protocol handler registration for PWAs
subhead: |
  Let installed PWAs handle links that use a specific protocol for a more integrated experience.
authors:
  - thomassteiner
date: 2021-05-11
updated: 2021-05-11
description: |
  After registering a PWA as a protocol handler, when a user clicks on a hyperlink with a specific
  scheme such as mailto, bitcoin, or web+music from a browser or a platform-specific app,
  the registered PWA will open and receive the URL.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/KKxFqY5Q6ovfi3qomHcv.jpg
alt: A metal chain used as the symbol for links.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
---

{% Aside %} URL protocol handler registration for PWAs is part of the
[capabilities project](https://web.dev/fugu-status/) and is currently in development. This post will
be updated as the implementation progresses. {% endAside %}

## Background on schemes (aka. protocols)

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
defined as follows:

- `scheme`: A string containing the protocol the site wishes to handle.
- `url`: A string containing the URL of the handler. This URL must include `%s`, as a placeholder
  that will be replaced with the escaped URL to be handled.

The scheme must either be one of the
[safelisted schemes](https://html.spec.whatwg.org/multipage/system-state.html#safelisted-scheme)
(for example, `mailto`, `bitcoin`, or `magnet`) or begin with `web+`, followed by at least one or
more lowercase ASCII letters after the `web+` prefix, for instance, `web+coffee`.

To make this clearer, here is a concrete example of the flow:

1. The user visits a site at `https://coffeeshop.example.com/` that makes the following call:
   `navigator.registerProtocolHandler('web+coffee', 'coffee?type=%s')`.
1. At a later point, while visiting `https://randomsite.example.com/`, the user clicks on a link
   such as `<a href="web+coffee:latte-macchiato">All about latte macchiato</a>`.
1. This causes the browser to navigate to the following URL:
   `https://coffeeshop.example.com/coffee?type=web%2Bcoffee%3A%2F%2Flatte-macchiato`. The search
   string URL-decoded then reads `?type=web+coffee://latte-macchiato`.

## What this proposal is about

The present _URL protocol handler registration for PWAs_ proposal is about offering protocol handler
registration as part of a PWA installation through its manifest. After registering a PWA as a
protocol handler, when a user clicks on a hyperlink with a specific scheme such as `mailto` ,
`bitcoin`, or `web+music` from a browser or a platform-specific app, the registered PWA will open
and receive the URL. It is important to note that both the proposed manifest-based registration and
the traditional `registerProtocolHandler()` play very similar roles in practice, while still
allowing the possibility for complementary user-experiences:

- Similarities include requirements around the list of schemes allowed to be registered, and the
  name and format of parameters, etc.
- Differences in the manifest-based registration are subtle, but might be useful to enhance the
  experience for PWA users. For example, manifest-based PWA registration may not require an
  additional user action apart from the user-initiated installation of the PWA.

### Use cases

- In a word processing PWA, the user in a document encounters a link to a presentation like
  `web+presentations://deck2378465`. When the user clicks on the link, the presentation PWA
  automatically opens in the correct scope and shows the slide deck.
- In a platform-specific chat app, the user in a chat message receives a link to a `magnet` URL.
  Upon clicking the link, an installed torrent PWA launches and starts downloading.
- The user has a music streaming PWA installed. When a friend shares a link to a song like
  `web+music://songid=1234&time=0:13` and the user clicks on it, the music streaming PWA will
  automatically launch in a standalone window.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                       |
| ---------------------------------------- | ---------------------------- |
| 1. Create explainer                      | [Complete][explainer]        |
| 2. Create initial draft of specification | [In progress][specification] |
| 3. Gather feedback & iterate on design   | [In progress](#feedback)     |
| 4. Origin trial                          | Not started                  |
| 5. Launch                                | Not started                  |

</div>

### Enabling via chrome://flags or edge://flags

To experiment with URL protocol handler registration for PWAs locally, without an origin trial
token, enable the `#enable-desktop-pwas-protocol-handling` flag in `chrome://flags` or `edge://flags`.

## How to use URL protocol handler registration for PWAs

The API for URL protocol handler registration is modeled closely on  
`navigator.registerProtocolHandler()`. Just this time the information is passed declaratively via
the Web Application Manifest in a new property called `"protocol_handlers"` that takes an array of
objects with the two required keys `"protocol"` and `"url"`. The code snippet below shows how to
register `web+tea` and `web+coffee`. The values are strings containing the URL of the handler with
the required `%s` placeholder for the escaped URL.

```json
{
  "protocol_handlers": [
    {
      "protocol": "web+tea",
      "url": "/tea?type=%s"
    },
    {
      "protocol": "web+coffee",
      "url": "/coffee?type=%s"
    }
  ]
}
```

### Multiple apps registering for the same protocol

If multiple applications register themselves as handlers for the same scheme, for example, the
`mailto` protocol, the operating system will show the user a picker and let them decide which of the
registered handlers to use.

### The same app registering for multiple protocols

The same app can register itself for multiple protocols, as you can see in the code sample above.

### App updates and handler registration

Handler registrations are synchronized with the latest manifest version provided by the app. There
are two cases:

- An update that adds new handlers triggers handler registration (separate from app installation).
- An update that removes handlers triggers handler unregistration (separate from app
  uninstallation).

## Demo

You can see a demo of URL protocol handler registration for PWAs on Glitch.

1. If you have not done so before, [enable the flag](#enabling-via-chrome:flags).
1. Go to [https://protocol-handler.glitch.me/](https://protocol-handler.glitch.me/), install the
   PWA, and reload the app after the installation. The browser has now registered the PWA as a
   handler for the `web+coffee` protocol with the operating system.
1. In the installed PWA window, click on the link
   [https://protocol-handler-link.glitch.me/](https://protocol-handler-link.glitch.me/). This will
   open a new browser tab with three links. Click on the first or the second (latte macchiato or
   americano). The browser will now show you a prompt and ask if you are fine with the app being a
   protocol handler for the `web+coffee` protocol. If you agree, the PWA will open and show the
   selected coffee.
1. To compare with the traditional flow that uses `navigator.registerProtocolHandler()`, click
   the \*_Register protocol handler_ button in the PWA. Then in the browser tab click the third link
   (chai). It will likewise show a prompt, but then open the PWA in a tab, not in a browser window.
1. Send yourself a message on a platform-specific application like Skype on Windows with a link like
   `<a href="web+coffee://americano">Americano</a>` and click it. It should likewise open the
   installed PWA.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/lfjgVAiGjVE9VohX3EDs.png", alt="URL protocol handler demo with browser tab with links on the left, and standalone PWA window on the right.", width="800", height="461" %}

## Security considerations

Since PWA installation requires the context to be secure, protocol handling inherits this
constraint. The list of registered protocol handlers is not exposed to the web in any way so it
cannot be used as a fingerprinting vector.

### Non user-initiated navigation attempts

Navigation attempts that are not initiated by the user, but that are programmatic, may not open
apps. The custom protocol URL may only be used in top-level browsing contexts, but not, for example,
as the URL of an iframe.

### Allowlist of protocols

Just like with `registerProtocolHandler()` there is an allowlist of protocols that apps can register
to handle.

### Default protocol handlers

Registration of PWA protocol handlers will not take over the default handler for a protocol.
Instead, the next time the protocol is invoked, an operating system disambiguation dialog will
prompt the user to either keep using the default handler or select the newly registered handler.

### Consent prompt

On the first launch of the PWA due to an invoked protocol, the user will be presented with a
permission dialog. This dialog will display the app name and origin of the app, and ask the user if
the app is allowed to handle links from the protocol. If a user rejects the permission dialog, the
registered protocol handler will be ignored by the operating system. To unregister the protocol
handler, the user needs to uninstall the PWA that registered it.

## Feedback

The Chromium team wants to hear about your experiences with URL protocol handler registration for
PWAs.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][github], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `UI>Browser>WebAppInstalls` in the **Components**
box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use URL protocol handler registration for PWAs? Your public support helps the
Chromium team prioritize features and shows other browser vendors how critical it is to support
them.

Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]. Send a Tweet to
[@ChromiumDev][cr-dev-twitter] using the hashtag
[`#ProtocolHandler`](https://twitter.com/search?q=%23ProtocolHandler&src=recent_search_click&f=live)
and let us know where and how you're using it.

## Useful links

- [Explainer][explainer]
- [Spec proposal][specification]
- [GitHub][github]
- [ChromeStatus](https://chromestatus.com/feature/5151703944921088)
- [Chromium bug](https://crbug.com/1019239)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/482)
- [Discourse][wicg-discourse]

## Acknowledgements

URL protocol handler registration for PWAs was implemented and specified by
[Fabio Rocha](https://www.linkedin.com/in/fabiorochap/),
[Diego González](https://www.linkedin.com/in/diekus/),
[Connor Moody](https://www.linkedin.com/in/connor-d-moody/), and
[Samuel Tang](https://www.linkedin.com/in/tangsamuel/) from the Microsoft Edge team. This article
was reviewed by [Joe Medley](https://github.com/jpmedley) and Fabio Rocha. Hero image by
[JJ Ying](https://unsplash.com/@jjying) on [Unsplash](https://unsplash.com/photos/PDxYfXVlK2M).

[explainer]:
  https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md
[specification]: https://github.com/w3c/manifest/pull/972
[github]: https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/main/URLProtocolHandler
[wicg-discourse]:
  https://discourse.wicg.io/t/proposal-url-protocol-handler-registration-for-pwas/4276
[cr-dev-twitter]: https://twitter.com/ChromiumDev
