---
layout: post
title: 'PWAs on Oculus Quest&nbsp;2'
authors:
  - thomassteiner
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/B7zNhOVvzK3O71sQyLKe.jpg
alt:
  'Person wearing an Oculus Quest 2 device with a PWA sticker on it spreading their arms with Quest
  controllers in both hands.'
subhead: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D apps that take advantage of Oculus Quest&nbsp;2's
  multitasking feature using Progressive Web Apps.
description: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
  Developers can now build and distribute 2D apps that take advantage of Oculus Quest 2's
  multitasking feature using Progressive Web Apps. This article describes the experience and how to
  test your PWA on the Oculus Quest 2.
date: 2021-12-09
tags:
  - blog
  - capabilities
  - progressive-web-apps
---

## PWAs and the Oculus Quest&nbsp;2

On October&nbsp;28, 2021, [Jacob Rossi](https://twitter.com/jacobrossi), Product Management Lead at
Meta (Oculus), [shared](https://twitter.com/jacobrossi/status/1453776349299019778) that PWAs are
coming to Oculus Quest. The Oculus Quest&nbsp;2 is a virtual reality (VR) headset created by Oculus,
a division of Meta. It is the successor to the company's previous headset, the Oculus Quest. The
device is capable of running as both a standalone headset with an internal, Android-based operating
system, and with Oculus-compatible VR software running on a desktop computer when connected over USB
or Wi-Fi. It uses the Qualcomm [Snapdragon XR2](https://www.qualcomm.com/news/onq/2020/10/29/oculus-quest-2-how-snapdragon-xr2-powers-next-generation-vr) system on a chip with 6&nbsp;GB of RAM. The
Quest&nbsp;2's display is a singular fast-switch LCD panel with a 1,832&nbsp;×&nbsp;1,920 pixels per eye resolution,
which can run at a refresh rate of up to 120&nbsp;Hz.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/g0IQmlLaOiLWqwQuvnhQ.jpeg", alt="Oculus Quest 2 device with controllers.", width="800", height="304" %}

## Browsers on the Oculus Quest&nbsp;2

Currently there are two browsers available for the Oculus Quest&nbsp;2,
[Firefox Reality](https://www.oculus.com/experiences/quest/2180252408763702/) and the built-in
[Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802). This article focuses on
the latter. The Oculus website
[introduces](https://developer.oculus.com/documentation/web/browser-intro/) the browser as follows.

_"Oculus Browser provides support for the latest web standards and other technologies to help you
create VR experiences on the web. Today's 2D web sites work great in Oculus Browser because it's
powered by the Chromium rendering engine. It's further optimized for Oculus headsets to get the best
performance and to enable web developers take advantage of the full potential of VR with new APIs,
like WebXR. Through WebXR, we're opening the doors to the next frontier of the web."_

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/R4SwrV05Pqap583Rzr4L.jpeg", alt="Oculus Browser with three browser windows open.", width="800", height="450" %}

### User agent

The browser's user agent string at the time of writing can be broken down as follows.

```bash
Mozilla/5.0 (X11; Linux x86_64; Quest 2)
AppleWebKit/537.36 (KHTML, like Gecko)
OculusBrowser/18.1.0.2.46.337441587
SamsungBrowser/4.0
Chrome/95.0.4638.74
VR
Safari/537.36
```

If the user switches to mobile mode, `VR` changes to `Mobile VR`. As you can see, the current
version 18.1.0.2.46.337441587 of the Oculus Browser is based on Chrome 95.0.4638.74, that is only
one version behind the current stable version of Chrome, which is 96.0.4664.110.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/E3929PxcGa7GCxKoTffh.png", alt="Oculus Browser About page.", width="800", height="449" %}

### User interface

The browser's user interface that you can see in the screenshot above has the following features
(top row from left to right):

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

For Oculus Quest&nbsp;2, Oculus Browser renders both 2D&nbsp;web page content and WebXR at
90&nbsp;Hz refresh rate. When watching fullscreen media, Oculus Browser optimizes the device refresh
rate based on the frame rate of the video. The Oculus Quest&nbsp;2 has a device pixel ratio of 1.5
for crisp text.

### State sharing

Login state is shared between Oculus Browser and PWAs, allowing users to seamlessly switch between
the two. Naturally Facebook Login is supported out of the box. The Oculus Browser includes a
password manager that allows users to store and share their passwords securely between the browser
and installed app experiences.

### PWA window sizes

Browser windows and windows of installed PWAs can be freely resized by the user. The height can vary
between 625&nbsp;px and 1,200&nbsp;px. The width can be set between 400&nbsp;px and 2,000&nbsp;px.
The default size is 1,000&nbsp;×&nbsp;625 px.

### Controlling PWAs

PWAs can be controlled with the Oculus left and right controllers, Bluetooth mice and keyboards, and
via hand tracking. Scrolling works via the thumb sticks on the Oculus controllers, or by pinching
the thumb and the index finger and moving in the desired direction.

### Permissions for PWAs

Permissions in Oculus Browser work pretty much the same way as in Chrome. The state is shared
between apps running in the browser and installed PWAs, so users can switch between the two
experiences without having to grant the same permissions again.

Albeit many permissions are
implemented, not all features are then actually supported. For example, while requesting the
geolocation permission succeeds, the device never actually gets a location. Similarly the various
hardware APIs like [WebHID](/hid/), [Web Bluetooth](/bluetooth/), etc. all pass feature detection,
but don't actually show a picker that would let the user pair the Oculus with a hardware device. I
suppose this will be refined once the browser matures.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/fTX92hn8bIMpWVMoBUjE.png", alt="Permissions in Oculus Browser.", width="800", height="575" %}

### Debugging PWAs via Chrome DevTools

Debugging PWAs works exactly as described in
[Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/).

1. [Enable Developer Mode](https://developer.oculus.com/documentation/native/android/mobile-device-setup/#enable-developer-mode).
1. On the device, browse to the desired site in Oculus Browser.
1. Launch Google Chrome.
1. Navigate to `chrome://inspect/#devices`.
1. Find the device in question, which will be followed by a set of Oculus Browser tabs currently
   open on the device.
1. Click **inspect** on the desired Oculus Browser tab.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/GiTjoiMuU2FoJOXLMEk2.png", alt="ALT_TEXT_HERE", width="800", height="476" %}

## Exemplary PWAs on the Oculus Quest&nbsp;2

### PWAs by Meta

Multiple Meta divisions have created PWAs for the Oculus Quest&nbsp;2, for example
[Instagram](https://www.oculus.com/experiences/quest/6102857836422862) and
[Facebook](https://www.oculus.com/experiences/quest/6126469507395223). These PWAs run in standalone
app windows that do not have a URL bar and that can be freely resized.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/m5NoDaB7hyFOvrxHF9oS.jpeg", alt="Facebook Oculus Quest 2 app.", width="800", height="450" %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/gxYCh0Z9R3vXRU0MWsIB.jpeg", alt="Instagram Oculus Quest 2 app", width="800", height="450" %}

### PWAs by other developers

At the time of this writing, there are a couple of other developers that have created PWAs for the
Oculus Quest&nbsp;2. [Spike](https://www.oculus.com/experiences/quest/4949538568409451) lets users
experience all the essential work tools like email, chat, calls, notes, tasks and to dos from their
inbox in a virtual environment hub.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/yATTFGQRz75I2JrIAUSz.jpeg", alt="Spike Oculus Quest 2 app.", width="800", height="450" %}

Another example is [Smartsheet](https://www.oculus.com/experiences/quest/4636949963023496), a
dynamic workspace that empowers teams to manage projects, automate workflows, and rapidly build new
solutions.

More PWAs like Slack or Dropbox are coming, as teased in a [video](https://www.facebook.com/watch/?v=4637130066326723)
released by Jacob Rossi in the context of Facebook Connect 2021.

### App discovery

Just like with any other browser, installed PWAs also work in Oculus Browser as websites running in
a tab. When a user visits a site in the browser, the Oculus Browser will help them discover the app
if it is available in the Oculus Store. For users that already have the app installed, Oculus
Browser will help them easily switch to the app if they desire. Note, though, that currently the
[`BeforeInstallPrompt` event](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent)
will _not_ fire in Oculus Browser, despite passing feature detection as being supported.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/YNM3CfMKqnLuCJLw3I0U.png", alt="Oculus Browser inviting the user in a prompt to install the MyEmail app.", width="512", height="343" %}

Developers can
[submit their apps to App Lab](https://developer.oculus.com/blog/introducing-app-lab-a-new-way-to-distribute-oculus-quest-apps/),
a way for developers to distribute apps directly to consumers safely and securely, via direct links
or platforms like [SideQuest](https://sidequestvr.com/), without requiring store approval and
without sideloading, which allows them to get an app directly to end users, even if it is early in
development, experimental, or aimed at a unique audience.

## Creating PWAs for Oculus

### Web App Manifest requirements

Meta has outlined the required steps in their
[documentation](https://developer.oculus.com/documentation/web/pwa-gs/). In general, PWAs that are
installable in Chrome should oftentimes work out of the box. Note that there are some important
differences compared to
[Chrome's installability criteria](https://web.dev/install-criteria/#criteria) and the
[Web App Manifest spec](https://w3c.github.io/manifest/), for example regarding language constraints (Oculus only supports left-to-right languages at the moment)
or the optionality of `start_url`, which Chrome strictly requires for an app to be installable.
Oculus offers a [command line tool](https://developer.oculus.com/documentation/web/pwa-packaging/)
that developers can use to create PWAs for the Oculus Quest&nbsp;2, which allows them to pass the
missing (or override the existing) parameters in the Web App Manifest.

| Name         | Required / Optional | Description                                                                                                        |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `name`       | Required            | The name of the PWA. Currently Oculus only support left-to-right languages for the name.                           |
| `display`    | Required            | Currently this value must be `"standalone"` or `"minimal-ui"`. Oculus currently does not support any other values. |
| `short_name` | Optional            | A shorter version of the app name, if needed.                                                                      |
| `scope`      | Optional            | This field allows developers to specify what URL or paths should be considered as part of the app.                 |
| `start_url`  | Optional            | Developers can specify a starting URL to load.                                                                     |

Oculus has a number of optional **proprietary** Web App Manifest fields that can be used to
customize the PWA experience.

| Name                    | Required / Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ovr_package_name`      | Optional            | Sets the package name of the APK generated for the PWA. This must be in reverse domain name notation, e.g., `"com.company.app.pwa"`. If not set, developers must provide a package name to the command line tool with the then required parameter `--package-name`.                                                                                                                                                                  |
| `ovr_multi_tab_enabled` | Optional            | If `true`, this boolean field will give the PWA a tab bar similar to Oculus Browser. In multi-tab PWAs, internal links that target a new tab (`target="_new"` or `target="_blank"`) will open in new tabs within the PWA window. This differs from single-tab PWAs where such links would open to a Oculus Browser window. **This feature is currently being standardized as [Tabbed Application Mode](/tabbed-application-mode/).** |
| `ovr_scope_extensions`  | Optional            | This field allows a PWA to include more web pages within the scope of the web application. It consists of a JSON dictionary containing extension URLs or wildcard patterns. **This feature is currently being standardized as [Scope Extensions for Web Apps](https://github.com/WICG/manifest-incubations/blob/gh-pages/scope_extensions-explainer.md).**                                                                           |

### Packaging PWAs with the command line tool

To get PWAs onto the Oculus Quest&nbsp;2, developers can use the
[command line tool](https://developer.oculus.com/documentation/web/pwa-packaging/) called
`ovr-platform-util` with the `create-pwa` command to create the APK. The output file name can be set
via the `-o` parameter, the Android SDK to use needs be set via the `--android-sdk` parameter.
Assuming a manifest file called `manifest.json` in the present working directory, the
`--manifest-content-file` parameter helps the tool to determine the relevant configuration fields
from the Web App Manifest. To leave the manifest as pure as possible, the `--package-name` parameter
can be used with a value of `com.company.app.pwa` in reverse domain name notation, rather than
adding the proprietary `ovr_package_name` field.

```bash
ovr-platform-util create-pwa -o output.apk --android-sdk ~/bin/android-10 --manifest-content-file manifest.json --package-name com.company.app.pwa
```

### Installing PWAs with `adb`

After creating the APK, developers can install the PWA by using the `adb` command with the Oculus
Quest&nbsp;2 connected via USB.

```bash
adb install output.apk
```

### Testing multi-tab apps

To test multi-tab apps, I have created a little
[test PWA](https://tomayac.github.io/oculus-pwa-test/) that demonstrates the various link features;
namely opening a new in-PWA tab, staying on the current tab, opening a new browser window, and
opening in a WebView staying on the current tab. Create a locally installable copy of this app by
running the commands below on your machine.

```bash
ovr-platform-util create-pwa -o test.apk --android-skd ~/bin/android-10 --web-manifest-url https://tomayac.github.io/oculus-pwa-test/manifest.json --package-name com.example.pwa
adb install test.apk
```

You can see a screencast of the test app in action embedded below.

{% YouTube "3ZlxCjW9rtg" %}

## An Oculus version of SVGcode

To take the instructions for an actual spin, I have created an Oculus version of my most recent PWA,
[SVGcode](/svgcode/). You can download the resulting APK file
[`output.apk`](https://drive.google.com/file/d/1ieGjwIXGGWmh0j9WpBdWqP7Bns3McNr1/view?usp=sharing)
from my Google Drive. If you want to investigate the package further, I have made available a
[decompiled version](https://drive.google.com/drive/folders/1EFtXK9ApJiJitfysZS_Z7iIWWiKEglu-?usp=sharing),
too. Find the build instructions in
[`package.json`](https://github.com/tomayac/SVGcode/blob/6b23adf63a0a3a1b3828866dbb7db0f10206397f/package.json#L16).

Using the app in VR works fine, including the ability to open and save files (though not using the
[File System Access API](/file-system-access/), but using the
[fallback approach](/browser-fs-access/#the-traditional-way-of-dealing-with-files)). The only thing
I could not get to work is pinch-zooming. My expectation was for it to work by pressing the trigger
on both controllers and then moving the controllers in opposed directions. Other than that,
everything else was performant and responsive, as you can see in the embedded screencast.

{% YouTube "Gjc0IR17kAk" %}

## Conclusions

PWAs on Oculus Quest&nbsp;2 are a lot of fun. The endless virtual canvas that lets users scale their
screen to whatever fits the current task best has a lot of potential to change the way we work in
the future. While typing in VR with hand tracking is still in its infancy and, at least for me, does
not work highly reliably, it works well enough for entering URLs or typing short texts. What I like
the most about PWAs on the Oculus Quest&nbsp;2 is that they are just regular PWAs that can be used
unchanged in a browser tab or through a thin APK wrapper without any platform-specific APIs.
Targeting multiple platforms with the same code has never been easier. Here's to PWAs in VR and on
the web. The future is bright!

## Acknowledgements

Oculus Quest&nbsp;2 photo by [Maximilian Prandstätter](https://flickr.com/people/191783462@N03/) on
[Flickr](https://flickr.com/photos/191783462@N03/50844634326). Oculus Store images of
[Instagram](https://www.oculus.com/experiences/quest/6102857836422862),
[Facebook](https://www.oculus.com/experiences/quest/6126469507395223), and
[Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802) apps by Meta.
