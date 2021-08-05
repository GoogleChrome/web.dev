---
layout: post
title: PWAs as URL Handlers
subhead: |
  Let installed PWAs handle URLs for a more integrated experience.
authors:
  - thomassteiner
date: 2021-06-03
updated: 2021-08-05
description: |
  After registering a PWA as a URL handler, when a user clicks on a hyperlink that matches
  one of the registered URL patterns, the registered PWA will open.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/tCdgaIMviiwzyggA2dBt.jpg
alt: |
  Interconnected chains, symbolizing the handling of URLs.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - progressive-web-apps
---

{% Aside %} PWAs as URL Handlers is part of the [capabilities project](https://web.dev/fugu-status/)
and is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

## What is PWAs as URL Handlers? {: #what }

Imagine you are chatting with a friend using an instant messenger application like Messages on macOS
and you are talking about music. Further imagine you both have the `music.example.com` PWA installed
on your devices. If you want to share your favorite track for your friend to enjoy, you can send
them a deep link like `https://music.example.com/rick-astley/never-gonna-give-you-up`. Since this
link is pretty long, the developers of `music.example.com` may have decided to add an additional
short link to each track, like, for example, `https://🎵.example.com/r-a/n-g-g-y-u`.

PWA as URL Handlers allows apps like `music.example.com` to register themselves as URL handlers for
URLs that match patterns like `https://music.example.com`, `https://*.music.example.com`, or
`https://🎵.example.com`, so
that links from outside of the PWA, for example, from an instant messenger application or an email
client, open in the installed PWA rather than in a browser tab.

PWA as URL Handlers consists of two additions:

1. The `"url_handlers"` web app manifest member.
1. The `web-app-origin-association` file format for validating in- and out-of-scope URL associations.

### Suggested use cases for PWAs as URL Handlers {: #use-cases }

Examples of sites that may use this API include:

- Music or video streaming sites so track links or playlist links open in the player experience of
  the app.
- News or RSS readers so followed or subscribed-to sites open in the app's reader mode.

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
like Windows, macOS, and Linux. On Android, Chromium browsers install PWAs by generating a
[WebAPK](https://developers.google.com/web/fundamentals/integration/webapks), which can register a
set of intent filters for all URLs within the scope of the app. This means that PWAs already handle
associated URLs on Android at the operating system level using intent filters. {% endAside %}

### The `"url_handlers"` web app manifest member

To associate an installed PWA with URL patterns, these patterns need to be specified in the web app
manifest. This happens through the `"url_handlers"` member. It accepts an array of objects with an
`origin` property, which is a required `string` that is a pattern for matching origins. These
patterns are allowed to have a wildcard (`*`) prefix in order to include multiple sub-domains (like
`https://*.example.com`). URLs that match these origins could be handled by this web app. The scheme is
always assumed to be `https://`, but it needs to be explicitly mentioned.

The excerpt of a web app manifest below shows how the music PWA example from the introductory
paragraph could set this up. The second entry with the wildcard (`"https://*.music.example.com"`) makes sure
that the app also gets activated for `https://www.music.example.com` or potential other examples like
`https://marketing-activity.music.example.com`.

```json
{
  "url_handlers": [
    {
      "origin": "https://music.example.com"
    },
    {
      "origin": "https://*.music.example.com"
    },
    {
      "origin": "https://🎵.example.com"
    }
  ]
}
```

{%Aside %} While in an online scenario, short links from `https://🎵.example.com` would typically be
redirected to `https://music.example.com`. Such navigation redirection is not a good alternative with
respect to offline scenarios. Therefore the app needs to register for both origins. {% endAside %}

### The `web-app-origin-association` file

Since the PWA lives on a different origin (`music.example.com`) than some of the URLs it needs to
handle (e.g., `https://🎵.example.com`), the app needs to verify ownership of these other origins. This
happens in a `web-app-origin-association` file hosted on the other origins.

{% Aside %} Apps that want to handle URLs that live on the _same_ origin as the PWA likewise need to
specify the handling rules in a `web-app-origin-association` file hosted on said origin. {% endAside %}

This file must contain valid JSON. The top-level structure is an object, with a member named
`"web_apps"`. This member is an array of objects and each object represents an entry for a unique
web app. Each object contains:

| Field        | Description                                                                     | Type     | Default |
| ------------ | ------------------------------------------------------------------------------- | -------- | ------- |
| `"manifest"` | (Required) URL string of the web app manifest of the associated PWA             | `string` | N/A     |
| `"details"`  | (Optional) An object that contains arrays of included and excluded URL patterns | `object` | N/A     |

Each `"details"` object contains:

| Field             | Description                                 | Type       | Default |
| ----------------- | ------------------------------------------- | ---------- | ------- |
| `"paths"`         | (Optional) Array of allowed path strings    | `string[]` | `[]`    |
| `"exclude_paths"` | (Optional) Array of disallowed path strings | `string[]` | `[]`    |

An example `web-app-origin-association` file for the music PWA example from above is given below. It
would be hosted on the origin `🎵.example.com` and establishes the association with the
`music.example.com` PWA, identified by its web app manifest URL.

```json
{
  "web_apps": [
    {
      "manifest": "https://music.example.com/manifest.json",
      "details": {
        "paths": ["/*"],
        "exclude_paths": ["/internal/*"]
      }
    }
  ]
}
```

{% Aside %} The `web-app-origin-association` file is similar to
[Apple's associated domain file](https://developer.apple.com/documentation/safariservices/supporting_associated_domains_in_your_app#3001215),
[Android's `assetlinks.json` file](https://developer.android.com/training/app-links/verify-site-associations),
and
[Windows' `windows-app-web-link` file](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking#associate-your-app-and-website-with-a-json-file).
What differs is that the `web-app-origin-association` file does not reference PWAs using a
platform-specific app ID, but by their web app manifest URL. {% endAside %}

#### When does a URL match?

A PWA matches a URL for handling if both of the following conditions are fulfilled:

- The URL matches one of the origin strings in `"url_handlers"`.
- The browser is able to validate via the respective `web-app-origin-association` file that each
  origin agrees to let this app handle such a URL.

#### Regarding `web-app-origin-association` file discovery

For the browser to discover the `web-app-origin-association` file, developers need to
place the `web-app-origin-association` file in the
[`/.well-known/`](https://datatracker.ietf.org/doc/html/rfc8615) folder at the root of the app.
For this to work, the file name must exactly be `web-app-origin-association`.

## Demo

To test PWAs as URL Handlers, be sure to [set the browser flag](#enabling-via-about:flags) as
outlined above and then install the PWA at
[https://mandymsft.github.io/pwa/](https://mandymsft.github.io/pwa/). By looking at its
[web app manifest](https://github.com/mandymsft/pwa/blob/main/manifest.json), you can see that it
handles URLs with the following URL patterns: `https://mandymsft.github.io` and
`https://luhuangmsft.github.io`. Since the latter is on a different origin (`luhuangmsft.github.io`)
than the PWA, the PWA on `mandymsft.github.io` needs to prove ownership, which happens via the
`web-app-origin-association` file hosted at
[https://luhuangmsft.github.io/.well-known/web-app-origin-association](https://luhuangmsft.github.io/.well-known/web-app-origin-association).

To test that it is indeed working, send yourself a test message using an instant messaging app of
your choice or an email viewed in an email client that is not web-based like Mail on macOS. The
email or text message should contain either of the links `https://mandymsft.github.io` or
`https://luhuangmsft.github.io`. Both should open in the installed PWA.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/EjFQNwv2IfINKykzsxxs.png", alt="The Windows Skype instant messenger app next to the installed demo PWA, which is opened in standalone mode after clicking a link handled by it in a Skype chat message.", width="800", height="498" %}

## Security and permissions

The Chromium team has designed and implemented PWAs as URL Handlers using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics.

### User control

If more than one PWA registers as a URL handler for a given URL pattern, the user will be prompted
to choose which PWA they want to handle the pattern with—if any at all. Navigations that start in a
browser tab are not handled by this proposal, it is explicitly aimed at navigations that start
outside of the browser.

### Transparency

If the necessary association validation cannot be completed successfully during PWA installation for
any reason, the browser will not register the app as an active URL handler for the affected URLs.
URL handlers, if improperly implemented, can be used to hijack traffic for websites. This is why the
app association mechanism is an important part of the scheme.

Platform-specific applications can already use operating system APIs to enumerate installed
applications on the user's system. For example, applications on Windows can use the
[`FindAppUriHandlersAsync`](https://docs.microsoft.com/en-us/uwp/api/windows.system.launcher.findappurihandlersasync)
API to enumerate URL handlers. If PWAs register as OS level URL handlers in Windows, their presence
would be visible to other applications.

### Permission persistence

An origin could modify its associations with PWAs at any time. Browsers will regularly attempt to
revalidate the associations of installed web apps. If a URL handler registration fails to revalidate
because the association data has changed or is no longer available, the browser will remove
registrations.

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
- [Demo][demo] | [Demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`UI>Browser>WebAppInstalls`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/552)
- [Microsoft documentation](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/experimental-features/#url-link-handling)

## Acknowledgements

PWAs as URL Handlers was specified and implemented by [Lu Huang](https://github.com/LuHuangMSFT) and [Mandy Chen](https://github.com/mandymsft) from the Microsoft Edge team.
This article was reviewed by
[Joe Medley](https://github.com/jpmedley).
Hero image by [Bryson Hammer](https://unsplash.com/@trhammerhead) on
[Unsplash](https://unsplash.com/photos/JZ8AHFr2aEg).

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
