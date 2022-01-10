---
layout: post
title: 'PWAs on Oculus Quest&nbsp;2'
authors:
  - thomassteiner
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/B7zNhOVvzK3O71sQyLKe.jpg
alt:
  'Person wearing an Oculus Quest 2 with a PWA sticker on it spreading their arms with Quest
  controllers in both hands.'
subhead: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D Progressive Web Apps that take advantage of Oculus
  Quest&nbsp;2's multitasking feature.
description: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D Progressive Web Apps that take advantage of Oculus
  Quest 2's multitasking feature. This article describes the experience and how to build, sideload,
  and test your PWA on the Oculus Quest 2.
date: 2022-01-10
# updated: 2022-01-10
tags:
  - blog
  - capabilities
  - progressive-web-apps
---

{% Aside %} This article is _not_ focused on apps making use of [WebXR](/tags/webxr/), a group of
standards that are used together to support rendering 3D scenes to hardware designed for presenting
virtual worlds (VR), or for adding graphical imagery to the real world (AR).

Instead, this article is focused on 2D Progressive Web Apps, that is, PWAs that are primarily aimed
at being consumed on regular screens, but that the user can also experience on their Oculus
Quest&nbsp;2 device. {% endAside %}

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

Currently there are two browsers available for the Oculus Quest&nbsp;2,
[Firefox Reality](https://www.oculus.com/experiences/quest/2180252408763702/) and the built-in
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

### Controlling PWAs

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

### App submission

Apart from
[submitting apps to the Oculus Store](https://developer.oculus.com/documentation/web/pwa-submit-app/),
developers can also
[submit their apps to App Lab](https://developer.oculus.com/blog/introducing-app-lab-a-new-way-to-distribute-oculus-quest-apps/),
a way for developers to distribute apps directly to consumers safely and securely, via direct links
or platforms like [SideQuest](https://sidequestvr.com/), without requiring store approval and
without sideloading. This allows them to get an app directly to end users, even if it is early in
development, experimental, or aimed at a unique audience.

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

### Packaging PWAs with the command line tool

To sideload PWAs onto the Oculus Quest&nbsp;2, developers must use a
[command line tool](https://developer.oculus.com/documentation/web/pwa-packaging/) called
`ovr-platform-util` with the `create-pwa` command to generate the APK. Set the output file name via
the `-o` parameter. The Android SDK to use needs to be set via the `--android-sdk` parameter.
Assuming a manifest file called `manifest.json` in the current working directory, the
`--manifest-content-file` parameter helps the tool determine the relevant configuration fields from
the Web App Manifest. Alternatively, developers can point the tool at the live URL of a manifest via
the `--web-manifest-url` parameter. To leave the manifest as pure as possible, use the
`--package-name` parameter with a value in reverse domain name notation (e.g.,
`com.company.app.pwa`), rather than adding the proprietary `ovr_package_name` field to the manifest.

```bash
ovr-platform-util create-pwa -o output.apk --android-sdk ~/bin/android-10 --manifest-content-file manifest.json --package-name com.company.app.pwa
```

### Installing PWAs with `adb`

After creating the APK, developers can sideload the PWA with the `adb` command when the Oculus
Quest&nbsp;2 device is connected via USB and when the connected computer is trusted. Sideloaded apps
appear in an **Unknown Sources** section in the app drawer.

```bash
adb install output.apk
```

### Testing multi-tab apps

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

## Conclusions

PWAs on Oculus Quest&nbsp;2 are a lot of fun and very promising. The endless virtual canvas that
lets users scale their screen to whatever fits the current task best has a lot of potential to
change the way we work in the future. While typing in VR with hand tracking is still in its infancy
and, at least for me, doesn't work very reliably yet, it works well enough for entering URLs or
typing short texts.

What I like the most about PWAs on the Oculus Quest&nbsp;2 is that they are just regular PWAs that
can be used unchanged in a browser tab or through a thin APK wrapper without any platform-specific
APIs. Targeting multiple platforms with the same code has never been easier. Here's to PWAs in VR
and on the web. The future is bright!

## Acknowledgements

Oculus Quest&nbsp;2 photo by [Maximilian Prandstätter](https://flickr.com/people/191783462@N03/) on
[Flickr](https://flickr.com/photos/191783462@N03/50844634326). Oculus Store images of
[Instagram](https://www.oculus.com/experiences/quest/6102857836422862),
[Facebook](https://www.oculus.com/experiences/quest/6126469507395223),
[Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802), and
[Spike](https://www.oculus.com/experiences/quest/4949538568409451) apps as well as
[app discoverability](https://developer.oculus.com/pwa/) illustration and
[hand tracking](https://support.oculus.com/articles/headsets-and-accessories/controllers-and-hand-tracking/hand-tracking-quest-2/)
animation courtesy of Meta. This post was reviewed by [Joe Medley](https://github.com/jpmedley).
