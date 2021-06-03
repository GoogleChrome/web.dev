---
layout: post
title: 'High performance storage for your app: The Storage Foundation API'
subhead: |
  An API that is particularly well suited for Wasm-based libraries and
  applications that want to use custom storage algorithms to fine-tune
  execution speed and memory usage.
authors:
  - thomassteiner
date: 2021-06-03
# updated: 2021-06-03
description: |
  The Storage Foundation API is a storage API that resembles a very basic filesystem,
  with direct access to stored data through buffers and offsets. Its goal is to give
  developers flexibility by providing generic, simple, and performant primitives upon
  which they can build higher-level components. It is particularly well suited for
  Wasm-based libraries and applications that want to use custom storage algorithms to
  fine-tune execution speed and memory usage.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/jHUvdkuNQBLYxfWrCizd.jpg
alt: |
  Hacker binary attack code.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/2916080758722396161
---

{% Aside %}
The Storage Foundation API is part of the [capabilities project](https://web.dev/fugu-status/) and is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

## What is the Storage Foundation API? {: #what }

The Storage Foundation API is a new web platform API that allows TODO.

### Suggested use cases for the API_NAME API {: #use-cases }

Examples of sites that may use this API include:

*

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [In Progress][spec]          |
| 3. Gather feedback & iterate on design     | [In progress](#feedback)     |
| 4. Origin trial                            | [Started][ot]                  |
| 5. Launch                                  | Not started                  |

</div>
## How to use the API_NAME API {: #use }

### Enabling via about://flags

To experiment with the API_NAME API locally, without an origin trial token, enable the `#TODO` flag in `about://flags`.

### Enabling support during the origin trial phase

Starting in Chromium XX, the API_NAME API will be available as an origin trial in Chromium. The origin trial is expected to end in Chromium XX (TODO exact date).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Progressive enhancement


### Feature detection

To check if the Storage Foundation API is supported, use:

```javascript

```

### DevTools support



## Security and permissions

The Chromium team has designed and implemented the API_NAME API using the core principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user control, transparency, and ergonomics.

### User control


### Transparency


### Permission persistence


## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the API_NAME API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods or properties that you need to implement your idea? Have a question or comment on the security model?
File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can, simple instructions for reproducing, and enter `Blink>Storage` in the **Components** box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the API_NAME API? Your public support helps the Chromium team prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag [`#StorageFoundation`](https://twitter.com/search?q=%23StorageFoundation&src=recent_search_click&f=live) and let us know where and how you are using it.
Ask a question on StackOverflow with the hashtag [`#file-system-access-api`](https://stackoverflow.com/questions/tagged/file-system-access-api).

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [TODO API Demo][demo] | [TODO API Demo source][demo-source]
* [Chromium tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`TODO`][blink-component]
* [TAG Review](TODO)
* [Intent to Ship](TODO)
* [WebKit-Dev thread](TODO)
* [WebKit implementation bug](TODO)
* [Mozilla thread](TODO)
* [Mozilla implementation bug](TODO)


## Acknowledgements

Hero image via [Markus Spiske](https://unsplash.com/@markusspiske) on [Unsplash](https://unsplash.com/photos/iar-afB0QQw).

[issues]: https://github.com/WICG/storage-foundation-api-explainer/issues
[demo]: TODO
[demo-source]: TODO
[explainer]: https://github.com/WICG/storage-foundation-api-explainer
[wicg-discourse]: TODO
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=914488
[cr-status]: https://chromestatus.com/feature/5670244905385984
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EStorage
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developer.chrome.com/origintrials/#/view_trial/2916080758722396161
