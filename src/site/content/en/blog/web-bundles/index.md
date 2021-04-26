---
title: Get started with Web Bundles
subhead: |
  Share websites as a single file over Bluetooth and run them offline in your origin's context
date: 2019-11-11
hero: image/admin/Z9ZE5FjAFT4R6eOaCWPl.png
alt: The Web Bundle logo
authors:
  - uskay
  - kenjibaheux
description: |
  Web Bundles enable you to share websites as a single file over Bluetooth and run them
  offline in your origin's context.
tags:
  - blog
  - web-bundles
feedback:
  - api
---

Bundling a full website as a single file and making it shareable
opens up new use cases for the web. Imagine a world where you can:

* Create your own content and distribute it in all sorts of ways without being
  restricted to the network
* Share a web app or piece of web content with your friends via Bluetooth or Wi-Fi Direct
* Carry your site on your own USB or even host it on your own local network

The Web Bundles API is a bleeding edge proposal that lets you do all of this.

## Browser compatibility

The Web Bundles API is currently only supported in Chromium-based browsers behind
an experimental flag.

## Introducing the Web Bundles API

A Web Bundle is a file format for encapsulating one or more HTTP resources in a
single file. It can include one or more HTML files, JavaScript files,
images, or stylesheets.

 Web Bundles, more formally known as [Bundled HTTP
 Exchanges](https://wicg.github.io/webpackage/draft-yasskin-wpack-bundled-exchanges.html),
 are part of the [Web Packaging](https://github.com/WICG/webpackage)
 proposal.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nIq4lyKZAV6XgbgDgNSk.png", alt="A figure demonstrating that a Web Bundle is a collection of web resources.", width="800", height="466", style="max-width: 75%" %}
  <figcaption class="w-figcaption">
    How Web Bundles work
  </figcaption>
</figure>

HTTP resources in a Web Bundle are indexed by request URLs, and can optionally
come with signatures that vouch for the resources. Signatures allow browsers to
understand and verify where each resource came from, and treats each as coming
from its true origin. This is similar to how [Signed HTTP Exchanges][exchanges],
a feature for signing a single HTTP resource, are handled.

This article walks you through what a Web Bundle is and how to use one.

## Explaining Web Bundles

To be precise, a Web Bundle is a [CBOR file](https://cbor.io/) with a `.wbn` extension (by convention) which
packages HTTP resources into a binary format, and is served with the `application/webbundle` MIME
type. You can read more about this in the [Top-level structure](https://wicg.github.io/webpackage/draft-yasskin-wpack-bundled-exchanges.html#top-level)
section of the spec draft.

Web Bundles have multiple unique features:

* Encapsulates multiple pages, enabling bundling of a complete website into a single file
* Enables executable JavaScript, unlike MHTML
* Uses [HTTP Variants](https://tools.ietf.org/id/draft-ietf-httpbis-variants-00.html) to do
  content negotiation, which enables internationalization with the `Accept-Language`
  header even if the bundle is used offline
* Loads in the context of its origin when cryptographically signed by its publisher
* Loads nearly instantly when served locally

These features open multiple scenarios. One common scenario is the ability to
build a self-contained web app that's easy to share and usable without an
internet connection. For example, say you're on an airplane from Tokyo to San Francisco with
your friend. You don't like the in-flight entertainment. Your friend is playing an interesting
web game called [PROXX](https://proxx.app/), and tells you that they downloaded the game as a Web
Bundle before boarding the plane. It works flawlessly offline. Before Web
Bundles, the story would end there and you would either have to take turns
playing the game on your friend's device, or find something else to pass the
time. But with Web Bundles, here's what you can now do:

1. Ask your friend to share the `.wbn` file of the game. For example the file
   could easily be shared peer-to-peer using a file sharing app.
2. Open the `.wbn` file in a browser that supports Web Bundles.
3. Start playing the game on your own device and try to beat your friend's high
   score.

Here's a video that explains this scenario.

{% YouTube 'xAujz66la3Y' %}

As you can see, a Web Bundle can contain every resource, making it work offline
and load instantly.

{% Aside %}
  Currently Chrome 80 only supports unsigned bundles (that is, Web Bundles without
  origin signatures). Bundling PROXX without signatures doesn't work
  well due to web worker cross-origin issues. Chrome is working on fixing this. In
  the meantime, check out [Dealing with Common Problems in Unsigned
  Bundles](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/content/browser/web_package/using_web_bundles.md#Dealing-with-Common-Problems-in-Unsigned-Bundles)
  to learn how to avoid cross-origin issues.
{% endAside %}

## Building Web Bundles

The [`go/bundle`](https://github.com/WICG/webpackage/tree/master/go/bundle) CLI is currently the
easiest way to bundle a website. `go/bundle` is a reference implementation of the Web Bundles
specification built in [Go](https://golang.org/).

1. [Install Go](https://golang.org/doc/install).
1. Install `go/bundle`.

   ```bash
   go get -u github.com/WICG/webpackage/go/bundle/cmd/...
   ```

1. Clone the [preact-todomvc](https://github.com/developit/preact-todomvc) repository and build
   the web app to get ready to bundle the resources.

    ```bash
    git clone https://github.com/developit/preact-todomvc.git
    cd preact-todomvc
    npm i
    npm run build
    ```

2. Use the `gen-bundle` command to build a `.wbn` file.

    ```bash
    gen-bundle -dir build -baseURL https://preact-todom.vc/ -primaryURL https://preact-todom.vc/ -o todomvc.wbn
    ```

Congratulations! TodoMVC is now a Web Bundle.

There are other options for bundling and more are coming. The `go/bundle` CLI
lets you build a Web Bundle using a HAR file or a custom list of resource
URLs. Visit the [GitHub
repo](https://github.com/WICG/webpackage/tree/master/go/bundle) to learn more
about `go/bundle`. You can also try out the experimental Node.js module for bundling,
[`wbn`](https://www.npmjs.com/package/wbn). Note that `wbn` is still in the early stages of
development.

## Playing around with Web Bundles

To try out a Web Bundle:

1. Go to `chrome://version` to see what version of Chrome you're running. If you're running version
   80 or later, skip the next step.
1. Download [Chrome Canary](https://www.google.com/chrome/canary/) if you're not running Chrome 80
   or later.
1. Open `chrome://flags/#web-bundles`.
1. Set the **Web Bundles** flag to **Enabled**.

   <figure class="w-figure">
     {% Img src="image/admin/tt32OXyh9PdrKK9KnMto.png", alt="A screenshot of chrome://flags", width="800", height="315" %}
     <figcaption class="w-figcaption">
       Enabling Web Bundles in <code>chrome://flags</code>
     </figcaption>
   </figure>

1. Relaunch Chrome.
1. Drag-and-drop the `todomvc.wbn` file into Chrome if you're on desktop, or tap it in a file
   management app if you're on Android.

Everything magically works.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/web-bundles/preact-todomvc.mp4"
            type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    The Preact implementation of TodoMVC working offline as a web bundle
  </figcaption>
</figure>

You could also try out other sample web bundles:

- [web.dev.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/web.dev.wbn) is a
   snapshot of the entire web.dev site, as of 2019 October 15.
- [proxx.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/proxx.wbn):
  [PROXX](/proxx-announce/) is a Minesweeper clone that works offline.
- [squoosh.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/squoosh.wbn):
  [Squoosh](https://squoosh.app) is a convenient and fast image optimization tool that
  lets you do side-by-side comparisons of various image compression formats, with support for
  resizing and format conversions.

{% Aside %}
  Currently you can only navigate into a Web Bundle stored in a local file, but
  that's only a temporary restriction.
{% endAside %}

## Send feedback

The Web Bundle API implementation in Chrome is experimental and incomplete.
Not everything is working and it might fail or crash. That's why
it's behind an experimental flag. But the API is ready enough for you to explore it in Chrome.
Feedback from web developers is crucial to the design of
new APIs, so please try it out and tell the people working on Web Bundles what you think.

* Send general feedback to
  [webpackage-dev@chromium.org](mailto:webpackage-dev@chromium.org).
* If you have feedback on the spec visit
  [https://github.com/WICG/webpackage/issues/new](https://github.com/WICG/webpackage/issues/new)
  to file a new spec issue, or email [wpack@ietf.org](mailto:wpack@ietf.org).
* If you find any issues in Chrome's behavior visit
  [https://crbug.com/new](https://crbug.com/new) to file a Chromium bug.
* Any contributions to the spec discussion and tooling are also more than
  welcome. Visit the [spec repo](https://github.com/WICG/webpackage) to get involved.

**Acknowledgements**

We would like to give a big shout-out to the wonderful Chrome engineering team,
[Kunihiko Sakamoto](https://github.com/irori), [Tsuyoshi
Horo](https://twitter.com/horo), [Takashi
Toyoshima](https://twitter.com/toyoshim), [Kinuko
Yasuda](https://twitter.com/kinu) and [Jeffrey
Yasskin](https://twitter.com/jyasskin) that worked hard contributing to the
spec, building the feature on Canary and reviewing this article. During the
standardization process [Dan York](http://danyork.me/) has helped navigate the
IETF discussion and also [Dave Cramer](https://twitter.com/dauwhe) has been a
great resource on what publishers actually need. We also want to thank [Jason
Miller](https://twitter.com/_developit) for the amazing preact-todomvc and his
restless effort on making the framework better.

[exchanges]: https://developers.google.com/web/updates/2018/11/signed-exchanges
[go/bundle]: https://github.com/WICG/webpackage/tree/master/go/bundle
