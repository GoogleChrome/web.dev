---
layout: post
title: 'PWAs on Oculus Quest 2'
authors:
  - thomassteiner
  - alexeyrodionov
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/B7zNhOVvzK3O71sQyLKe.jpg
alt:
  'Person wearing an Oculus Quest 2 with a PWA sticker on it spreading their arms with Quest
  controllers in both hands.'
subhead: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D and 3D Progressive Web Apps (PWA) that take advantage
  of Oculus Quest 2's multitasking feature.
description: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D and 3D Progressive Web Apps (PWA) that take advantage
  of Oculus Quest 2's multitasking feature. This article describes the experience and how to build,
  sideload, and test your PWA on the Oculus Quest 2.
date: 2022-01-10
updated: 2022-11-27
tags:
  - blog
  - capabilities
  - progressive-web-apps
  - virtual-reality
  - augmented-reality
  - webxr
---

## The Oculus Quest&nbsp;2

The [Oculus Quest&nbsp;2](https://www.oculus.com/quest-2/) is a virtual reality (VR) headset created
by Oculus, a division of Meta. It is the successor to the company's previous headset, the Oculus
Quest. The device is capable of running as both a standalone headset with an internal, Android-based
operating system, and with Oculus-compatible VR software running on a desktop computer when
connected over USB or Wi-Fi. It uses the Qualcomm
[Snapdragon XR2](https://www.qualcomm.com/news/onq/2020/10/29/oculus-quest-2-how-snapdragon-xr2-powers-next-generation-vr)
system on a chip with 6&nbsp;GB of RAM. The Quest&nbsp;2's display is a singular fast-switch LCD
panel with 1,832&nbsp;×&nbsp;1,920 pixels per eye resolution that runs at a refresh rate of up to
120&nbsp;Hz.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/g0IQmlLaOiLWqwQuvnhQ.jpeg", alt="Oculus Quest 2 device with controllers.", width="800", height="304" %}

## The Oculus Browser

Currently there are three browsers available for the Oculus Quest&nbsp;2:
[Wolvic](https://www.oculus.com/experiences/quest/4812663595466206/), a successor to
[Firefox Reality](https://www.oculus.com/experiences/quest/2180252408763702/), and the built-in
[Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802). This article focuses on
the latter. The Oculus website
[introduces](https://developer.oculus.com/documentation/web/browser-intro/) the Oculus Browser as
follows.

_"Oculus Browser provides support for the latest web standards and other technologies to help you
create VR experiences on the web. Today's 2D web sites work great in Oculus Browser because it's
powered by the Chromium rendering engine. It's further optimized for Oculus headsets to get the best
performance and to enable web developers take advantage of the full potential of VR with new APIs,
like WebXR. Through WebXR, we're opening the doors to the next frontier of the web."_

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/R4SwrV05Pqap583Rzr4L.jpeg", alt="Oculus Browser with three browser windows open.", width="800", height="450" %}

### User agent

The browser's user agent string at the time of writing is as follows.

```bash
Mozilla/5.0 (X11; Linux x86_64; Quest 2)
AppleWebKit/537.36 (KHTML, like Gecko)
OculusBrowser/18.1.0.2.46.337441587
SamsungBrowser/4.0
Chrome/95.0.4638.74
VR
Safari/537.36
```

As you can see, the current version `18.1.0.2.46.337441587` of the Oculus Browser is based on Chrome
`95.0.4638.74`, that is only one version behind the current stable version of Chrome, which is
`96.0.4664.110`. If the user switches to mobile mode, `VR` changes to `Mobile VR`.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/E3929PxcGa7GCxKoTffh.png", alt="Oculus Browser About page.", width="800", height="449" %}

### User interface

The browser's user interface (shown above) has the following features (top row from left to right):

- Back button
- Reload button
- Site information
- URL bar
- Create bookmark button
- Resize button with narrow, medium, and wide options as well as a zoom feature
- Request mobile website button
- Menu button with the following options:
  - Enter private mode
  - Close all tabs
  - Settings
  - Bookmarks
  - Downloads
  - History
  - Clear browsing data

The bottom row includes the following features:

- Close button
- Minimize button
- Three dots button with back, forward, and reload options

### Refresh rate and device pixel ratio

For Oculus Quest&nbsp;2, Oculus Browser renders both 2D&nbsp;web page content and WebXR at a
90&nbsp;Hz refresh rate. When watching fullscreen media, Oculus Browser optimizes the device refresh
rate based on the frame rate of the video, for example, 24&nbsp;fps. The Oculus Quest&nbsp;2 has a
device pixel ratio of 1.5 for crisp text.

## PWAs in Oculus Browser and the Oculus Store

On October&nbsp;28, 2021, [Jacob Rossi](https://twitter.com/jacobrossi), Product Management Lead at
Meta (Oculus), [shared](https://twitter.com/jacobrossi/status/1453776349299019778) that
[PWAs were coming](https://developer.oculus.com/pwa/) to Oculus Quest and Oculus Quest&nbsp;2. In
the following, I describe the PWA experience on Oculus and explain how to build, sideload, and test
your PWA on the Oculus Quest&nbsp;2.

### State sharing

Login state is shared between Oculus Browser and PWAs, allowing users to seamlessly switch between
the two. Naturally, [Facebook Login](https://developers.facebook.com/docs/facebook-login/overview/)
is supported out of the box. The Oculus Browser includes a password manager that allows users to
store and share their passwords securely between the browser and installed app experiences.

### PWA window sizes

Browser windows and windows of installed PWAs can be freely resized by the user. The height can vary
between 625&nbsp;px and 1,200&nbsp;px. The width can be set between 400&nbsp;px and 2,000&nbsp;px.
The default dimensions are 1,000&nbsp;×&nbsp;625 px.

### Interacting with PWAs

PWAs can be controlled with the Oculus left and right controllers, Bluetooth mice and keyboards, and
via hand tracking. Scrolling works via the thumb sticks on the Oculus controllers, or by pinching
the thumb and the index finger and moving in the desired direction. To select something, the user
can point and pinch.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/20e7SXFMLC22gqW8HzRa.mp4", autoplay="true", loop="true", muted="true" %}

### Permissions for PWAs

Permissions in Oculus Browser work pretty much the same way as in Chrome. The state is shared
between apps running in the browser and installed PWAs, so users can switch between the two
experiences without having to grant the same permissions again.

Albeit many permissions are implemented, not all features are supported. For example, while
requesting the geolocation permission succeeds, the device never actually gets a location.
Similarly, the various hardware APIs like [WebHID](/hid/), [Web Bluetooth](/bluetooth/), etc. all
pass feature detection, but don't actually show a picker that would let the user pair the Oculus
with a hardware device. I suppose feature detectability of APIs will be refined once the browser
matures.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/fTX92hn8bIMpWVMoBUjE.png", alt="Permissions in Oculus Browser.", width="800", height="575" %}

### Debugging PWAs via Chrome DevTools

After
[enabling Developer Mode](https://developer.oculus.com/documentation/native/android/mobile-device-setup/#enable-developer-mode),
debugging PWAs on Oculus Quest&nbsp;2 works exactly as described in
[Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/).

1. On the Oculus device, browse to the desired site in Oculus Browser.
1. Launch Google Chrome on your computer and navigate to `chrome://inspect/#devices`.
1. Find the Oculus device in question, which will be followed by a set of Oculus Browser tabs
   currently open on the device.
1. Click **inspect** on the desired Oculus Browser tab.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/GiTjoiMuU2FoJOXLMEk2.png", alt="Inspecting an app running on the Oculus Quest 2 with Chrome DevTools.", width="800", height="476" %}

### App discovery

People can use the browser itself or the [Oculus Store](https://www.oculus.com/experiences/quest/)
to discover PWAs. Just like with any other browser, installed PWAs also work in Oculus Browser as
websites running in a tab. When a user visits a site, the Oculus Browser will help them discover the
app if (and only if) it is available in the Oculus Store. For users that already have the app
installed, Oculus Browser will help them easily switch to the app if they desire.

{% Aside %} Currently the
[`BeforeInstallPrompt` event](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent)
will _not_ fire in Oculus Browser, despite feature detection reporting it to be supported.
{% endAside %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/YNM3CfMKqnLuCJLw3I0U.png", alt="Oculus Browser inviting the user in a prompt to install the MyEmail app.", width="512", height="343" %}

## Exemplary PWAs on the Oculus Quest&nbsp;2

### PWAs by Meta

Multiple Meta divisions have created PWAs for the Oculus Quest&nbsp;2, for example
[Instagram](https://www.oculus.com/experiences/quest/6102857836422862) and
[Facebook](https://www.oculus.com/experiences/quest/6126469507395223). These PWAs run in standalone
app windows that don't have a URL bar and that can be freely resized.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/m5NoDaB7hyFOvrxHF9oS.jpeg", alt="Facebook Oculus Quest 2 app.", width="800", height="450" %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/gxYCh0Z9R3vXRU0MWsIB.jpeg", alt="Instagram Oculus Quest 2 app", width="800", height="450" %}

### PWAs by other developers

At the time of this writing, there is a small but growing number of PWAs for the Oculus Quest&nbsp;2
on the Oculus Store. [Spike](https://www.oculus.com/experiences/quest/4949538568409451) lets users
experience all the essential work tools like email, chat, calls, notes, tasks, and to-dos from their
inbox in a virtual environment hub right in the Spike app.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/yATTFGQRz75I2JrIAUSz.jpeg", alt="Spike Oculus Quest 2 app.", width="800", height="450" %}

Another example is [Smartsheet](https://www.oculus.com/experiences/quest/4636949963023496), a
dynamic workspace that provides project management, automated workflows, and rapid building of new
solutions.

More PWAs like Slack, Dropbox, or Canva are coming, as teased in a
[video](https://www.facebook.com/watch/?v=4637130066326723) featuring Jacob Rossi that was released
in the context of Facebook's Connect conference in 2021.

## Creating PWAs for Oculus

Meta outlined the required steps in their
[documentation](https://developer.oculus.com/documentation/web/pwa-gs/). In general, PWAs that are
installable in Chrome should oftentimes work out of the box on Oculus.

### Web App Manifest requirements

There are some important differences compared to
[Chrome's installability criteria](/install-criteria/#criteria) and the
[Web App Manifest spec](https://w3c.github.io/manifest/). For example, Oculus only supports
left-to-right languages at the moment, whereas the Web App Manifest spec enforces no such
constraints. Another example is `start_url`, which Chrome strictly requires for an app to be
installable, but which on Oculus is optional. Oculus offers a
[command line tool](https://developer.oculus.com/documentation/web/pwa-packaging/) that lets
developers create PWAs for the Oculus Quest&nbsp;2, which allows them to pass the missing (or
override the existing) parameters in the Web App Manifest.

<div class="table-wrapper scrollbar">
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>name</code></td>
<td>(Required) The name of the PWA. Currently Oculus only supports left-to-right languages for the name.</td>
</tr>
<tr>
<td><code>display</code></td>
<td>(Required) Either <code>"standalone"</code> or <code>"minimal-ui"</code>. Oculus currently doesn't support any other values.</td>
</tr>
<tr>
<td><code>short_name</code></td>
<td>(Required) A shorter version of the app name, if needed.</td>
</tr>
<tr>
<td><code>scope</code></td>
<td>(Optional) The URL or paths that should be considered as part of the app.</td>
</tr>
<tr>
<td><code>start_url</code></td>
<td>(Optional) The URL to show at app launch.</td>
</tr>
</tbody>
</table>
</div>

Oculus has a number of optional **proprietary** Web App Manifest fields that can be used to
customize the PWA experience.

<div class="table-wrapper scrollbar">
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>ovr_package_name</code></td>
<td>(Optional) Sets the package name of the APK generated for the PWA. This must be in reverse domain name notation, e.g., <code>"com.company.app.pwa"</code>. If not set, developers must provide a package name to the command line tool with the (then required) parameter <code>--package-name</code>.</td>
</tr>
<tr>
<td><code>ovr_multi_tab_enabled</code></td>
<td>(Optional) If <code>true</code>, this boolean field will give the PWA a tab bar similar to Oculus Browser. In multi-tab PWAs, internal links that target a new tab (<code>target="_new"</code> or <code>target="_blank"</code>) will open in new tabs within the PWA window. This differs from single-tab PWAs where such links would open to a Oculus Browser window. <strong>This feature is currently being standardized as <a href="https://github.com/w3c/manifest/issues/737" rel="noopener">Tabbed Application Mode</a>.</strong></td>
</tr>
<tr>
<td><code>ovr_scope_extensions</code></td>
<td>(Optional) Allows a PWA to include more web pages within the scope of the web application. It consists of a JSON dictionary containing extension URLs or wildcard patterns. <strong>This feature is currently being standardized as <a href="https://github.com/WICG/manifest-incubations/blob/gh-pages/scope_extensions-explainer.md" rel="noopener">Scope Extensions for Web Apps</a>.</strong></td>
</tr>
</tbody>
</table>
</div>

### Packaging PWAs with Bubblewrap CLI

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) is an open source set of libraries and
a command line tool (CLI) for Node.js. Bubblewrap is developed by the Google Chrome team, to help
developers generate, build, and sign an Android project that launches your PWA as a
[Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/) (TWA).

Meta Quest Browser currently doesn't fully support TWA, but starting from version 1.18.0,
Bubblewrap [supports](https://github.com/GoogleChromeLabs/bubblewrap/releases/tag/v1.18.0)
packaging PWAs for Meta Quest devices.

It can generate *universal* APK files that open a TWA on regular Android devices and the Meta Quest
Browser on Meta Quest devices.

Assuming you have [Node.js](https://nodejs.org) installed, Bubblewrap CLI can be installed with the
following command:

```bash
npm i -g @bubblewrap/cli
```

When running Bubblewrap for the first time, it will offer to automatically download and install the
required external dependencies—Java Development Kit (JDK) and Android SDK Build Tools.

To generate a Meta Quest compatible Android project that wraps your PWA, run the `init` command
with the `--metaquest` flag and follow the wizard:

```bash
bubblewrap init --manifest="https://your.web.app/manifest.json" --metaquest
```

Once the project has been generated, build and sign it by running:

```bash
bubblewrap build
```

This will output a file called `app-release-signed.apk`. This file can be installed on the device
or published to the Meta Quest Store, Google Play Store or any other Android app distribution
platforms.

{% Aside 'note' %}
Pro tip: you can also use the `--chromeosonly` flag in addition to the `--metaquest` flag to make
APK files compatible not only with Meta Quest and regular Android devices, but also with
[ChromeOS](https://chromeos.dev) devices.
{% endAside %}

### Packaging PWAs with Oculus Platform Utility

[Oculus Platform Utility](https://developer.oculus.com/documentation/web/pwa-packaging/#download-the-cli)
is the official command line tool developed by Meta for publishing apps for Oculus Rift and Meta
Quest devices.

It also allows to package PWAs for Meta Quest devices with the `create-pwa` command and publish
them to the Meta Quest Store and App Lab.

Set the output file name via the `-o` parameter and the path to Android SDK via the `--android-sdk`
parameter.

Point the tool at the live URL of the web app manifest via the `--web-manifest-url` parameter.

If you don't have a manifest on your live PWA or wish to override the live manifest, you can still
generate an APK for your PWA using a local manifest file and the `--manifest-content-file`
parameter.

To leave the manifest as pure as possible, use the `--package-name` parameter with a value in
reverse domain name notation (for example, `com.company.app.pwa`), rather than adding the
proprietary `ovr_package_name` field to the manifest.

```bash
ovr-platform-util create-pwa -o output.apk --android-sdk ~/bin/android-10 --manifest-content-file manifest.json --package-name com.company.app.pwa
```

{% Aside 'caution' %}
APK files generated by Oculus Platform Utility are only compatible with Meta Quest devices and cannot
be run on regular Android devices. Also they can only be published to the Meta Quest Store and App Lab.
{% endAside %}

### Packaging PWAs with PWABuilder

Using [PWABuilder](https://pwabuilder.com) is in the authors' view the easiest and therefore
recommended way to package PWAs for Meta Quest at the moment.

PWABuilder is an [open source](https://github.com/pwa-builder) project developed by Microsoft,
that allows developers to package and sign their PWAs for publishing to various stores, including
Microsoft Store, Google Play Store, App Store, and Meta Quest Store.

Packaging PWAs with PWABuilder is as easy as entering the URL of a PWA, entering/editing the
metadata for the app, and clicking the **Generate** button.

PWABuilder gives developers the choice of what tool under the hood to use for packaging PWAs for
Meta Quest devices.

You can choose the **Meta Quest** option to use the Oculus Platform Utility.

// TODO: replace by 1.png

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/sWjB34HjwjatCMUz39Q3.png", alt="PWABuilder packaging options.", width="683", height="512" %}

{% Aside 'note' %}
Pro tip: PWABuilder uses a slightly modified version of Oculus Platform Utility that generates much smaller
APK files by
[removing unused code and resources](https://github.com/pwa-builder/pwabuilder-oculus/pull/7).
{% endAside %}

You can choose the **Android** option to use the Bubblewrap and select the **Meta Quest compatible**
checkbox.

// TODO: replace by 2.png

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/sWjB34HjwjatCMUz39Q3.png", alt="Packaging PWAs with PWABuilder using Bubblewrap.", width="683", height="512" %}

{% Aside 'note' %}
Pro tip: since PWABuilder is a PWA itself that works everywhere there is a browser, you can open it
in the Meta Quest Browser and perform all the steps right on your Meta Quest.
{% endAside %}

### Installing PWAs with ADB

{% Aside 'important' %}
To enable Android Debug Bridge (ADB) on the Meta Quest device, you must
[enable developer mode](https://developer.oculus.com/documentation/native/android/mobile-device-setup/)
in the companion mobile app. Before you can put your device in developer mode, you must belong to
(or have created) a developer organization in the Oculus Developer Center.
{% endAside %}

After creating the APK file, developers can sideload it to the Meta Quest device using the ADB via
USB or Wi-Fi:

```bash
adb install app-release-signed.apk
```

If you use the Bubblewrap CLI for packaging PWAs, it provides a convenient alias command to
sideload the APK file:

```bash
bubblewrap install
```

{% Aside 'note' %}
Pro tip: you can use [Android Web Toolbox](https://yume-chan.github.io/ya-webadb/install) to
sideload APK files. It's an [open source](https://github.com/yume-chan/ya-webadb/) web app that
allows you to access all ADB functionality right from the browser even from another Android device.
No installation or drivers are required thanks to the [Web USB API](/usb/).
{% endAside %}

Sideloaded apps appear in an **Unknown Sources** section in the app drawer.

### App submission

{% Aside 'important' %}
Submission and consideration for the Oculus Store is only available if you have been approved as an
Meta Quest Store developer. Distribution of PWAs via
[App Lab](https://developer.oculus.com/blog/introducing-app-lab-a-new-way-to-distribute-oculus-quest-apps/)
is not currently available. The Meta team will share more on when and how you can submit a PWA to
App Lab soon.
{% endAside %}

Uploading and submitting PWAs to the Oculus Store is
[covered](https://developer.oculus.com/documentation/web/pwa-submit-app/) in detail in the Oculus
Developer Center docs.

Apart from submitting apps to the Oculus Store, developers can also distribute their apps via platforms
like [SideQuest](https://sidequestvr.com/) directly to consumers safely and securely, without requiring
store approval. This allows them to get an app directly to end users, even if it is early in development,
experimental, or aimed at a unique audience.

## Testing multi-tab apps

To test multi-tab apps, I created a little [test PWA](https://tomayac.github.io/oculus-pwa-test/)
that demonstrates the various link features: namely opening a new in-PWA tab, staying on the current
tab, opening a new browser window, and opening in a WebView staying on the current tab. Create a
locally installable copy of this app by running the commands below on your machine.

```bash
ovr-platform-util create-pwa -o test.apk --android-skd ~/bin/android-10 --web-manifest-url https://tomayac.github.io/oculus-pwa-test/manifest.json --package-name com.example.pwa
adb install test.apk
```

Here's a screencast of the test app.

{% YouTube "3ZlxCjW9rtg" %}

## An Oculus version of SVGcode

To take the instructions for a spin, I created an Oculus version of my most recent PWA,
[SVGcode](/svgcode/). You can download the resulting APK file
[`output.apk`](https://drive.google.com/file/d/1ieGjwIXGGWmh0j9WpBdWqP7Bns3McNr1/view?usp=sharing)
from my Google Drive. If you want to investigate the package further, I have a
[decompiled version](https://drive.google.com/drive/folders/1EFtXK9ApJiJitfysZS_Z7iIWWiKEglu-?usp=sharing),
too. Find the build instructions in
[`package.json`](https://github.com/tomayac/SVGcode/blob/6b23adf63a0a3a1b3828866dbb7db0f10206397f/package.json#L16).

Using the app on Oculus works fine, including the ability to open and save files. The Oculus Browser
doesn't support the [File System Access API](/file-system-access/), but the
[fallback approach](/browser-fs-access/#the-traditional-way-of-dealing-with-files) helps. The only
thing that didn't function is pinch-zooming. My expectation was for it to work by pressing the
trigger button on both controllers and then moving the controllers in opposed directions. Other than
that, everything else was performant and responsive, as you can see in the embedded screencast.

{% YouTube "Gjc0IR17kAk" %}

## Immersive 3D WebXR PWAs

PWA support on Oculus Quest is not limited to flat 2D apps. Developers can build immersive 3D
experiences for VR using the [WebXR API](/tags/webxr/).

Wondering how various prompts (PWA install, permission requests, notifications) are handled
from within VR, if at all?

Here's a screencast of
[User Agent Prompts test](https://immersive-web.github.io/webxr-samples/tests/permission-request.html)
from the [Immersive Web Working Group](https://immersive-web.github.io/)'s
[WebXR Tests](https://immersive-web.github.io/webxr-samples/tests/).

{% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/4fvDWOo2XxF67M8r3W3O.mp4" %}

As you can see, entering VR mode requires the user's permission. Permissions are asked once per origin.
Requesting permissions leaves the immersive mode. Notifications are currently not supported.

### Hand tracking

You can use your hands to interact with PWAs in immersive mode thanks to the
[WebXR Hand Input API](https://immersive-web.github.io/webxr-hand-input/) and Meta's
[AI-based hand-tracking system](https://ai.facebook.com/blog/hand-tracking-deep-neural-networks/).

Here's a screencast of
[Hand Tracking Sample](https://immersive-web.github.io/webxr-samples/immersive-hands.html)
from the Immersive Web Working Group's [WebXR Samples](https://immersive-web.github.io/webxr-samples/).

{% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/nDm0rY5DvtyTbDgUqFTS.mp4" %}

### Augmented/Mixed Reality (Passthrough)

As announced at Meta Connect 2022, Meta Quest Browser
[has added support](https://developer.oculus.com/documentation/web/webxr-mixed-reality/) for
[WebXR Augmented Reality (AR)](/web-ar/), also known as Mixed Reality (MR), on Meta Quest&nbsp;2 and Meta
Quest Pro devices.

Let's check a slightly modified A-Frame
[starter example](https://aframe.io/docs/1.3.0/introduction/#getting-started) with scaled-down
models and hidden sky and plane for augmented reality.

[A-Frame](https://aframe.io) is an open source web framework for building 3D/VR/AR experiences
entirely out of declarative, reusable [custom HTML elements](/custom-elements-v1/) that are easy to
read, understand, and copy-and-paste.

{% Glitch {
  id: 'a-frame-hello-world-ar',
  path: 'index.html',
  previewSize: 50,
  allow: ['xr-spatial-tracking', 'fullscreen']
} %}

Here's a screencast of this demo on Meta Quest&nbsp;2.

{% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/RmPUmnh57gDZ2bbGkOWR.mp4" %}

Meta Quest&nbsp;2 has monochrome cameras, so the passthrough is in grayscale, while Meta Quest Pro has
color cameras.

## Conclusions

PWAs on Oculus Quest&nbsp;2 are a lot of fun and very promising. The endless virtual canvas that
lets users scale their screen to whatever fits the current task best has a lot of potential to
change the way we work in the future. While typing in VR with hand tracking is still in its infancy
and, at least for me, doesn't work very reliably yet, it works well enough for entering URLs or
typing short texts.

What I like the most about PWAs on the Oculus Quest&nbsp;2 is that they are just regular PWAs that
can be used unchanged in a browser tab or through a thin APK wrapper without any platform-specific
APIs. Targeting multiple platforms with the same code has never been easier. Here's to PWAs in VR
and AR on the web. The future is bright!

## Acknowledgements

Oculus Quest&nbsp;2 photo by [Maximilian Prandstätter](https://flickr.com/people/191783462@N03/) on
[Flickr](https://flickr.com/photos/191783462@N03/50844634326). Oculus Store images of
[Instagram](https://www.oculus.com/experiences/quest/6102857836422862),
[Facebook](https://www.oculus.com/experiences/quest/6126469507395223),
[Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802), and
[Spike](https://www.oculus.com/experiences/quest/4949538568409451) apps as well as
[app discoverability](https://developer.oculus.com/pwa/) illustration and
[hand tracking](https://support.oculus.com/articles/headsets-and-accessories/controllers-and-hand-tracking/hand-tracking-quest-2/)
animation courtesy of Meta. Hero image by Arnau Marín i Puig. This post was reviewed by
[Joe Medley](https://github.com/jpmedley).
