---
layout: post
title: Tabbed application mode for PWAs
subhead: Work on more than one document at a time with tabs in your Progressive Web App
authors:
  - thomassteiner
date: 2021-02-25
updated: 2021-04-07
description: |
  Tabbed application mode allows Progressive Web App developers to add a tabbed document interface
  to their standalone PWAs.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/N08W5skJmcYgS7346DBS.jpg
alt: Dictionary thumb index.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
  - capabilities
---

{% Aside %}
  Tabbed application mode is part of the
  [capabilities project](/fugu-status/) and is currently in development. This post
  will be updated as the implementation progresses. Tabbed application mode is an early-stage
  exploration of the Chrome team. It is not ready for production yet.
{% endAside %}

In the world of computing, the [desktop metaphor](https://en.wikipedia.org/wiki/Desktop_metaphor) is
an interface metaphor that is a set of unifying concepts used by graphical user interfaces (GUI) to
help users interact more easily with the computer. In keeping with the desktop metaphor, GUI tabs
are modeled after traditional card tabs inserted in books, paper files, or card indexes. A _tabbed
document interface_ (TDI) or tab is a graphical control element that allows multiple documents or
panels to be contained within a single window, using tabs as a navigational widget for switching
between sets of documents.

Progressive Web Apps can run in [various display modes](/add-manifest/#display) determined by the
`display` property in the Web App Manifest. Examples are `fullscreen`, `standalone`, `minimal-ui`,
and `browser`. These display modes follow a
[well-defined fallback chain](https://w3c.github.io/manifest/#dfn-fallback-display-mode)
(`"fullscreen"` → `"standalone"` → `"minimal-ui"` → `"browser"`). If a browser does not support a
given mode, it falls back to the next display mode in the chain.
Via the [`"display_override"`](/display-override/) property, developers can specify their own
fallback chain if they need to.

## What is tabbed application mode

Something that has been missing from the platform so far is a way to let PWA developers offer their
users a tabbed document interface, for example, to enable editing different files in the same PWA
window. Tabbed application mode closes this gap.

{% Aside %}
  This feature is about having a standalone app window with multiple tabs (containing
  separate documents inside the app scope) inside it. It is not to be confused with
  the existing `"display": "browser"`, which has a separate meaning (specifically, that
  the app is opened in a regular browser tab).
{% endAside %}

### Suggested use cases for tabbed application mode

Examples of sites that may use tabbed application mode include:

- Productivity apps that let the user edit more than one document (or file) at the same time.
- Communication apps that let the user have conversations in different rooms per tab.
- Reading apps that open article links in new in-app tabs.

### Differences to developer-built tabs

Having documents in separate browser tabs comes with resource isolation for free, which is not
possible using the web today. Developer-built tabs would not scale acceptably to hundreds of tabs
like browser tabs do. Developer-built tabs could also not be dragged out of the window to split into
a separate application window, or be dragged back in to combine them back into a single window.
Browser affordances such as navigation history, "Copy this page URL", "Cast this tab" or "Open this
page in a web browser" would be applied to the developer-built tabbed interface page, but not the
currently selected document page.

### Differences to `"display": "browser"`

The current `"display": "browser"` already has a
[specific meaning](https://w3c.github.io/manifest/#dom-displaymodetype-browser):

> Opens the web application using the platform-specific convention for opening hyperlinks in the
> user agent (e.g., in a browser tab or a new window).

While browsers can do whatever they want regarding UI, it would clearly be a pretty big subversion
of developer expectations if `"display": "browser"` suddenly meant "run in a separate
application-specific window with no browser affordances, but a tabbed document interface".

Setting `"display": "browser"` is effectively the way you _opt out_ of being put into an application
window.

## Current status

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [In progress][issue]     |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Not started              |
| 5. Launch                                | Not started              |

</div>

## Using tabbed application mode

To use tabbed application mode, developers need to opt their apps in by setting a specific
[`"display_override"`](/display-override/) mode value in the Web App Manifest.

```json
{
  …
  "display": "standalone",
  "display_override": ["tabbed"],
  …
}
```

{% Aside 'warning' %}
  The details of the potential `display_override` property's value (currently `"tabbed"`) are not final.
  While you can try tabbed mode behind a flag, it will blindly apply to all sites and does not
  currently care about the manifest. When you set `"display_override": ["tabbed"]`, it will just
  be treated the same as `"display": "browser"`.
{% endAside %}

### Trying tabbed application mode

You can try tabbed application mode on Chrome&nbsp;OS devices running Chrome&nbsp;83 and up today:

1. Set the `#enable-desktop-pwas-tab-strip` flag.
1. Install any web app that runs in `standalone` mode, for example,
   [Excalidraw](https://excalidraw.com/).
1. Pin the app icon to the shelf, right click the icon, and select "New tabbed window" from the
   context menu.
1. Open the app and interact with the tab strip.

The video below shows the current iteration of the feature in action. There is no need to make any
changes to the Web App Manifest for this to work.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/JwN0btyXFGiT9oPFh2qJ.webm", autoplay="true", loop="true", muted="true" %}

## Feedback

The Chrome team wants to hear about your experiences with tabbed application mode.

### Tell us about the API design

Is there something about tabbed application mode that does not work like you expected? Comment on
the [Web App Manifest Issue][issue] that we have created.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? File a bug at
[new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can, simple
instructions for reproducing, and enter `UI>Browser>WebAppInstalls` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy reproduction cases.

### Show support for the API

Are you planning to use tabbed application mode? Your public support helps the Chrome team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#TabbedApplicationMode`](https://twitter.com/search?q=%23TabbedApplicationMode&src=typed_query&f=live)
and let us
know where and how you are using it.

## Useful links

- [Web App Manifest spec issue][issue]
- [Chromium bug](https://crbug.com/897314)
- Blink Component: [`UI>Browser>WebAppInstalls`][blink-component]

## Acknowledgements

Tabbed application mode was explored by [Matt Giuca](https://github.com/mgiuca). The experimental
implementation in Chrome was the work of [Alan Cutter](https://github.com/alancutter). This article
was reviewed by [Joe Medley](https://github.com/jpmedley). Hero image by
[Till Niermann](https://commons.wikimedia.org/wiki/User:Till.niermann) on
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dictionary_indents_headon.jpg).

[blink-component]: https://chromestatus.com/features#component%3ABlink%3EUI>Browser>WebAppInstalls
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[issue]: https://github.com/w3c/manifest/issues/737
