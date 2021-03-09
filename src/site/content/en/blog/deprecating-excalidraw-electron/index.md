---
title: Deprecating Excalidraw Electron in favor of the web version
subhead: |
  Learn why the Excalidraw project decided to deprecate their Electron wrapper in favor of the web
  version.
description: |
  Excalidraw is a virtual collaborative whiteboard that lets you easily sketch diagrams that
  feel hand-drawn. On the Excalidraw project, we decided to deprecate Excalidraw
  Desktop, an Electron wrapper for Excalidraw, in favor of the web version that you can—and always
  could—find at excalidraw.com. After a careful analysis, we decided that Progressive Web App
  (PWA) is the future we want to build upon.
authors:
  - thomassteiner
date: 2021-01-07
updated: 2021-01-27
canonical: https://blog.excalidraw.com/deprecating-excalidraw-electron/
hero: image/admin/qfK9zbKBQalqq5zdr1P1.jpg
alt: |
  Excalidraw drawing with a stylized Electron logo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - case-study
---

{% Aside %}
  [Excalidraw](https://excalidraw.com/) is a virtual collaborative whiteboard that lets you easily sketch diagrams that feel hand-drawn.
  This article was cross-posted to and first appeared on the [Excalidraw blog](https://blog.excalidraw.com/deprecating-excalidraw-electron/).
{% endAside %}

On the [Excalidraw project](https://github.com/excalidraw), we have decided to
deprecate [Excalidraw Desktop](https://github.com/excalidraw/excalidraw-desktop), an
[Electron](https://www.electronjs.org/) wrapper for Excalidraw, in favor of the web version that you
can—and always could—find at [excalidraw.com](https://excalidraw.com/). After a careful analysis, we
have decided that [Progressive Web App](/pwa/) (PWA) is the future we want to build
upon. Read on to learn why.

## How Excalidraw Desktop came into being

Soon after [@vjeux](https://twitter.com/vjeux) created the initial version of Excalidraw in
January 2020 and [blogged about it](https://blog.excalidraw.com/reflections-on-excalidraw/), he proposed the following in
[Issue #561](https://github.com/excalidraw/excalidraw/issues/561#issue-555138343):

> Would be great to wrap Excalidraw within Electron (or equivalent) and publish it as a [platform-specific]
> application to the various app stores.

The immediate reaction by [@voluntadpear](https://github.com/voluntadpear) was to suggest:

> What about making it a PWA instead? Android currently supports adding them to the Play Store as
> Trusted Web Activities and hopefully iOS will do the same soon. On Desktop, Chrome lets you
> download a desktop shortcut to a PWA.

The decision that [@vjeux](https://github.com/vjeux) took in the end was simple:

> We should do both :)

While work on converting the version of Excalidraw into a PWA was started by
[@voluntadpear](https://github.com/voluntadpear) and later others,
[@lipis](https://github.com/lipis) independently
[went ahead](https://github.com/excalidraw/excalidraw/issues/561#issuecomment-579573783) and created
a [separate repo](https://github.com/excalidraw/excalidraw-desktop) for Excalidraw Desktop.

To this day, the initial goal set by [@vjeux](https://github.com/vjeux), that is, to submit
Excalidraw to the various app stores, has not been reached yet. Honestly, no one has even started
the submission process to any of the stores. But why is that? Before I answer, let's
look at Electron, the platform.

## What is Electron?

The unique selling point of [Electron](https://www.electronjs.org/) is that it allows you to _"build
cross-platform desktop apps with JavaScript, HTML, and CSS"_. Apps built with Electron are
_"compatible with Mac, Windows, and Linux"_, that is, _"Electron apps build and run on three
platforms"_. According to the homepage, the hard parts that Electron makes easy are
[automatic updates](https://www.electronjs.org/docs/api/auto-updater),
[system-level menus and notifications](https://www.electronjs.org/docs/api/menu),
[crash reporting](https://www.electronjs.org/docs/api/crash-reporter),
[debugging and profiling](https://www.electronjs.org/docs/api/content-tracing), and
[Windows installers](https://www.electronjs.org/docs/api/auto-updater#windows). Turns out, some of
the promised features need a detailed look at the small print.

- For example, automatic updates _"are [currently] only [supported] on macOS and Windows. There is
  no built-in support for auto-updater on Linux, so it is recommended to use the distribution's
  package manager to update your app"_.

- Developers can create system-level menus by calling `Menu.setApplicationMenu(menu)`. On Windows and
  Linux, the menu will be set as each window's top menu, while on macOS there are many
  system-defined standard menus, like the
  [Services](https://developer.apple.com/documentation/appkit/nsapplication/1428608-servicesmenu?language=objc)
  menu. To make one's menus a standard menu, developers should set their menu's `role` accordingly,
  and Electron will recognize them and make them become standard menus. This means that a lot of
  menu-related code will use the following platform check:
  `const isMac = process.platform === 'darwin'`.

- Windows installers can be made with
  [windows-installer](https://github.com/electron/windows-installer). The README of the project
  highlights that _"for a production app you need to sign your application. Internet Explorer's
  SmartScreen filter will block your app from being downloaded, and many anti-virus vendors will
  consider your app as malware unless you obtain a valid cert"_ [sic].

Looking at just these three examples, it is clear that Electron is far from "write once, run
everywhere". Distributing an app on app stores requires
[code signing](https://www.electronjs.org/docs/tutorial/code-signing), a security technology for
certifying app ownership. Packaging an app requires using tools like
[electron-forge](https://github.com/electron-userland/electron-forge) and thinking about where to
host packages for app updates. It gets complex relatively quickly, especially when the objective
truly is cross platform support. I want to note that it is _absolutely_ possible to create stunning
Electron apps with enough effort and dedication. For Excalidraw Desktop, we were not there.

## Where Excalidraw Desktop left off

Excalidraw Desktop so far is basically the Excalidraw web app bundled as an
[`.asar`](https://github.com/electron/asar) file with an added **About Excalidraw** window. The look
and feel of the application is almost identical to the web version.

<figure class="w-figure">
  {% Img src="image/admin/oR9usELiRYTSu8V7i7vj.png", alt="The Excalidraw Desktop application running in an Electron wrapper.", width="800", height="601" %}
  <figcaption class="w-figcaption">Excalidraw Desktop is almost indistinguishable from the web version</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/y9d4nWR3p0VjvHcnP0iq.png", alt="The Excalidraw Desktop 'About' window displaying the version of the Electron wrapper and the web app.", width="400", height="330" %}
  <figcaption class="w-figcaption">The <strong>About Excalibur</strong> menu providing insights into the versions</figcaption>
</figure>

On macOS, there is now a system-level menu at the top of the application, but since none of the menu
actions—apart from **Close Window** and **About Excalidraw**—are hooked up to to anything, the menu
is, in its current state, pretty useless. Meanwhile, all actions can of course be performed via the
regular Excalidraw toolbars and the context menu.

<figure class="w-figure">
  {% Img src="image/admin/akQQgmMKo66quqeVDdAH.png", alt="The Excalidraw Desktop menu bar on macOS with the 'File', 'Close Window' menu item selected.", width="736", height="138" %}
  <figcaption class="w-figcaption">The menu bar of Excalidraw Desktop on macOS</figcaption>
</figure>

We use [electron-builder](https://github.com/electron-userland/electron-builder), which supports
[file type associations](https://www.electron.build/configuration/configuration#PlatformSpecificBuildOptions-fileAssociations).
By double-clicking an `.excalidraw` file, ideally the Excalidraw Desktop app should open. The
relevant excerpt of our `electron-builder.json` file looks like this:

```json
{
  "fileAssociations": [
    {
      "ext": "excalidraw",
      "name": "Excalidraw",
      "description": "Excalidraw file",
      "role": "Editor",
      "mimeType": "application/json"
    }
  ]
}
```

Unfortunately, in practice, this does not always work as intended, since, depending on the
installation type (for the current user, for all users), apps on Windows&nbsp;10 do not have the
rights to associate a file type to themselves.

These shortcomings and the pending work to make the experience truly app-like on _all_ platforms
(which, again, with enough effort _is_ possible) were a strong argument for us to reconsider our
investment in Excalidraw Desktop. The way bigger argument for us, though, was that we foresee that
for _our_ use case, we do not need all the features Electron offers. The grown and still growing set
of capabilities of the web serves us equally well, if not better.

## How the web serves us today and in the future

Even in 2020, [jQuery](https://jquery.com/) is still
[incredibly popular](https://almanac.httparchive.org/en/2020/javascript#libraries). For many
developers it has become a habit to use it, despite the fact that today they
[might not need jQuery](http://youmightnotneedjquery.com/). There is a similar resource for
Electron, aptly called [You Might Not Need Electron](https://youmightnotneedelectron.com/). Let me
outline why we think we do not need Electron.

### Installable Progressive Web App

Excalidraw today is an [installable](/installable/) Progressive Web App with a
[service worker](https://excalidraw.com/service-worker.js) and a
[Web App Manifest](https://excalidraw.com/manifest.json). It caches all its resources in two caches,
one for fonts and font-related CSS, and one for everything else.

<figure class="w-figure">
  {% Img src="image/admin/tTo7miHIREZRySv8aoBd.png", alt="Chrome DevTools Application tab showing the two Excalidraw caches.", width="800", height="569" %}
  <figcaption class="w-figcaption">Excalidraw's cache contents</figcaption>
</figure>

This means the application is fully offline-capable and can run without a network connection.
Chromium-based browsers on both desktop and mobile prompt the user to install the app.
You can see the installation prompt in the screenshot below.

<figure class="w-figure">
  {% Img src="image/admin/be3EQLezj3776w6SHLPi.png", alt="Excalidraw prompting the user to install the app in Chrome on macOS.", width="400", height="258" %}
  <figcaption class="w-figcaption">The Excalidraw install dialog in Chrome</figcaption>
</figure>

Excalidraw is configured to run as a standalone application, so when you install it, you get an app
that runs in its own window. It is fully integrated in the operating system's multitasking UI and
gets its own app icon on the home screen, Dock, or task bar; depending on the platform where you install
it.

<figure class="w-figure">
  {% Img src="image/admin/MbMgQlGSBeNcX7Y362jV.png", alt="Excalidraw running in its own window.", width="800", height="584" %}
  <figcaption class="w-figcaption">The Excalidraw PWA in a standalone window</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/7ncf98ZQZcg4g3UP2s7F.png", alt="Excalidraw icon on the macOS Dock.", width="400", height="167" %}
  <figcaption class="w-figcaption">The Excalidraw icon on the macOS Dock</figcaption>
</figure>

### File system access

Excalidraw uses [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) for
accessing the file system of the operating system. On supporting browsers, this allows for a true
open→edit→save workflow and actual over-saving and "save as", with a transparent fallback for
other browsers. You can learn more about this feature in my blog post
[Reading and writing files and directories with the browser-fs-access library](/browser-fs-access/).

### Drag and drop support

Files can be dragged and dropped onto the Excalidraw window just as in platform-specific applications. On a
browser that supports the [File System Access API](/file-system-access/), a dropped
file can be immediately edited and the modifications be saved to the original file. This is so
intuitive that you sometimes forget that you are dealing with a web app.

### Clipboard access

Excalidraw works well with the operating system's clipboard. Entire Excalidraw drawings or also just
individual objects can be copied and pasted in `image/png` and `image/svg+xml` formats, allowing for
an easy integration with other platform-specific tools like [Inkscape](https://inkscape.org/) or web-based
tools like [SVGOMG](https://jakearchibald.github.io/svgomg/).

<figure class="w-figure">
  {% Img src="image/admin/90gLbYTtkKtDfun4fiRM.png", alt="Excalidraw context menu showing the 'copy to clipboard as SVG' and 'copy to clipboard as PNG' menu items.", width="800", height="746" %}
  <figcaption class="w-figcaption">The Excalidraw context menu offering clipboard actions</figcaption>
</figure>

### File handling

Excalidraw already supports the experimental [File Handling API](/file-handling/),
which means `.excalidraw` files can be double-clicked in the operating system's file manager and
open directly in the Excalidraw app, since Excalidraw registers as a file handler for `.excalidraw`
files in the operating system.

### Declarative link capturing

Excalidraw drawings can be shared by link. Here is an
[example](https://excalidraw.com/#json=4646308765761536,jwZJW8JsOM75vdhqG2nBgA). In the future, if
people have Excalidraw installed as a PWA, such links will not open in a browser tab, but launch a
new standalone window. Pending implementation, this will work thanks to
[declarative link capturing](https://github.com/WICG/sw-launch/blob/master/declarative_link_capturing.md),
an, at the time of writing, bleeding-edge proposal for a new web platform feature.

## Conclusion

The web has come a long way, with more and more features landing in browsers that only a couple of
years or even months ago were unthinkable on the web and exclusive to platform-specific applications.
Excalidraw is at the forefront of what is possible in the browser, all while acknowledging that not
all browsers on all platforms support each feature we use. By betting on a progressive
enhancement strategy, we enjoy the latest and greatest wherever possible, but without leaving anyone
behind. Best viewed in _any_ browser.

Electron has served us well, but in 2020 and beyond, we can live without it. Oh, and for that
objective of [@vjeux](https://github/com/vjeux): since the Android Play Store now accepts PWAs in a
container format called [Trusted Web Activity](/using-a-pwa-in-your-android-app/) and
since the
[Microsoft Store supports PWAs](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-edgehtml/microsoft-store),
too, you can expect Excalidraw in these stores in the not too distant future. Meanwhile, you can
always use and install [Excalidraw in and from the browser](https://excalidraw.com/).

## Acknowledgements

This article was reviewed by [@lipis](https://github.com/lipis),
[@dwelle](https://github.com/dwelle), and
[Joe Medley](https://github.com/jpmedley).
