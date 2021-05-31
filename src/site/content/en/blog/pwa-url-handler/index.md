---
layout: post
title: PWAs as URL Handlers
subhead: |
  Let installed PWAs handle URLs for a more integrated experience.
authors:
  - thomassteiner
date: 2021-05-31
# updated:
description: |
  After registering a PWA as a URL handler, when a user clicks on a hyperlink that matches
  one of the registered URL patterns, the registered PWA will open.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/fzrpAnVMFJ8xN9wIi8Si.jpg
alt: Messages app on macOS.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - progressive-web-apps
---

{% Aside %} PWAs as URL Handlers is part of the [capabilities project](https://web.dev/fugu-status/)
and is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

## What is PWAs as URL Handlers? {: #what }

Imagine you chat with a friend using an instant messenger application like Messages on macOS and you
talk about music. Further imagine you both have the `music.example.com` PWA installed on your
devices. If you want to share your favorite track for your friend to enjoy, you can send them a deep
link like `https://music.example.com/rick-astley/never-gonna-give-you-up`. Since this link is not
particularly user friendly, the developers of `music.example.com` may have decided to add an
additional short link to each track, like, for example, `https://🎵.example.com/r-a/n-g-g-y-u`.

PWA as URL Handlers is a proposal that allows apps like `music.example.com` to register themselves
as URL handlers for URLs that match patterns like `music.example.com`, `*.music.example.com`, or
`🎵.example.com`, so that links from outside of the PWA, for example, from an instant messenger
application, open in the installed PWA rather than in a browser tab.

This proposal consists of two additions:

1. The `"url_handlers"` Web App Manifest member.
1. The `web-app-origin-association` file format for validating out-of-scope URL associations.

### Suggested use cases for PWAs as URL Handlers {: #use-cases }

Examples of sites that may use this API include:

- Music or video streaming sites.
- News or RSS readers.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Not started              |
| 5. Launch                                | Not started              |

</div>

## How to use PWAs as URL Handlers {: #use }

### Enabling via about://flags

To experiment with PWAs as URL Handlers locally, without an origin trial token, enable the
`#enable-desktop-pwas-url-handling` flag in `about://flags`.

{% Aside %} Support for the PWAs as URL Handlers feature is limited to desktop operating systems
like Window, macOS, and Linux. {% endAside %}

### The `"url_handlers"` Web App Manifest member

To associate an installed PWA with URL patterns, these patterns need to be specified in the Web App
Manifest. This happens through the `"url_handlers"` member. It accepts an array of objects with the
following property:

- `origin`: A required `string`, which is a pattern for matching origins. These patterns are allowed
  to have a wildcard (`*`) prefix in order to include multiple sub-domains (`*.example.com`). URLs
  that match these origins could be handled by this web app.

The excerpt of a Web App Manifest below shows how the music PWA example from the introductory
paragraph could set this up. The second entry with the wildcard (`"*.music.example.com"`) makes sure
that the app also gets activated for `www.music.example.com` or other examples like
`marketing-activity.music.example.com`.

```json
{
  "url_handlers": [
    {
      "origin": "music.example.com"
    },
    {
      "origin": "*.music.example.com"
    },
    {
      "origin": "🎵.example.com"
    }
  ]
}
```

{%Aside %} While in an online scenario short links from `🎵.example.com` could be redirected to
`music.example.com`, such navigation redirection is not a good alternative with respect to offline
scenarios. Therefore the app needs to register for both origins. {% endAside %}

### The `web-app-origin-association` file

Since the PWA lives on a different domain (`music.example.com`) than some of the URLs it needs to
handle (e.g., `🎵.example.com`), the app needs to verify ownership of these other origins. This
happens in a `web-app-origin-association` file hosted on said other origins.

#### Structure of `web-app-origin-association` files

This file must contain valid JSON. The top-level structure is an object, with a member named
`"web_apps"`. This member is an array of objects and each object represents an entry for a unique
web app. Each object contains:

| Field        | Required | Description                                              | Type     | Default |
| ------------ | -------- | -------------------------------------------------------- | -------- | ------- |
| `"manifest"` | yes      | URL string of the Web App Manifest of the associated PWA | `string` | N/A     |
| `"details"`  | no       | Contains arrays of URL patterns object                   | N/A      |

Each `"details"` object contains:

| Field             | Required | Description                      | Type       | Default |
| ----------------- | -------- | -------------------------------- | ---------- | ------- |
| `"paths"`         | no       | Array of allowed path strings    | `string[]` | `[]`    |
| `"exclude_paths"` | no       | Array of disallowed path strings | `string[]` | `[]`    |

An example `web-app-origin-association` file for the music PWA example from above is given below. It
would be hosted from the origin `🎵.example.com` and establishes the association with
`music.example.com`.

```json
{
  "web_apps": [
    {
      "manifest": "https://music.example.com/manifest.webappmanifest",
      "details": {
        "paths": ["/*"],
        "exclude_paths": ["/internal/*"]
      }
    }
  ]
}
```

#### Regarding `web-app-origin-association` file discovery

For the browser to discover the `web-app-origin-association` file, developers have two choices.

- Add a `<link rel="web-app-origin-association">` element in the header section of the main document
  at the origin's root path that points at the `web-app-origin-association` file via the `href`
  attribute.
- Alternatively, the `web-app-origin-association` file can also be placed in the
  [`/.well-known/`](https://datatracker.ietf.org/doc/html/rfc8615) folder at the root level of the
  app. For this to work, the file name must exactly be `web-app-origin-association`.

## Demo

To test PWAs as URL Handlers, be sure to [set the browser flag](#enabling-via-about:flags) as
outlined above and then install the PWA at
[https://mandymsft.github.io/pwa/](https://mandymsft.github.io/pwa/). By looking at its
[Web App Manifest](https://github.com/mandymsft/pwa/blob/main/manifest.json), you can see that it
handles URLs from the following URL patterns: `https://mandymsft.github.io` and
`https://luhuangmsft.github.io`. Since the latter is on a different origin (`luhuangmsft.github.io`)
that the PWA, the PWA on `mandymsft.github.io` needs to prove ownership, which happens via the
`web-app-origin-association` file hosted at
[https://luhuangmsft.github.io/.well-known/web-app-origin-association](https://luhuangmsft.github.io/.well-known/web-app-origin-association).
To test that it is indeed working, send yourself a test message using an instant
messaging app of your choice or an email that you view in an email client that is not web-based like Mail on macOS on
your device with either of the links `https://mandymsft.github.io` or
`https://luhuangmsft.github.io`. Both should open in the installed PWA.

## Security and permissions

The Chromium team has designed and implemented PWAs as URL Handlers using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics.

### User control

### Transparency

### Permission persistence

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the PWAs as URL Handlers.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `UI>Browser>WebAppInstalls` in the **Components**
box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use PWAs as URL Handlers? Your public support helps the Chromium team prioritize
features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#URLHandlers`](https://twitter.com/search?q=%23URLHandlers&src=recent_search_click&f=live) and let
us know where and how you're using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [TODO API Demo][demo] | [TODO API Demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`UI>Browser>WebAppInstalls`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/552)
- [Microsoft documentation](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/experimental-features/#url-link-handling)

## Acknowledgements

Hero image via [Apple Support](https://support.apple.com/en-us/HT202549).

[issues]: https://github.com/WICG/pwa-url-handler/issues
[demo]: https://mandymsft.github.io/pwa/
[demo-source]: https://github.com/mandymsft/pwa/
[explainer]: https://github.com/WICG/pwa-url-handler/blob/main/explainer.md
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=1072058
[cr-status]: https://chromestatus.com/feature/5739732661174272
[blink-component]:
  https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
