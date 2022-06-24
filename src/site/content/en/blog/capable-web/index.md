---
title: The Capable Web
subhead:

authors:
  - thomassteiner
description:

date: 2022-06-24
# updated: 2022-06-24
hero:
tags:
  - blog
  - capabilities
---

## Lighthouse cases that demonstrate the Web's abilities

Photoshop has for the longest time been recognized as one of the last bastions of high quality apps
that supposedly would never make it to the Web platform. Record scratch, this last bastion finally
fell. With [Photoshop on the Web](https://web.dev/ps-on-the-web/), Adobe together with Chromium
engineering has managed to get a version of Photoshop running in the browser that can serve as the
new lighthouse showcase of what is possible on the Web.

![alt_text](images/image1.png 'image_tooltip')

Similarly, Microsoft has launched
[Visual Studio Code on the Web](https://code.visualstudio.com/blogs/2021/10/20/vscode-dev), a
full-fledged, installable Web experience of its IDE that renders developing fully in the browser
almost completely possible, including the option to open and edit files on the local file system.

![alt_text](images/image2.png 'image_tooltip')

Lastly Twitter—whose PWA is
[largely seen](https://www.thurrott.com/cloud/social/150171/twitter-lite-now-adapts-larger-screens#:~:text=probably%20the%20best%20mainstream%20progressive%20web%20app)
as _probably the best mainstream progressive web app_—for a while now
[uses](https://blog.twitter.com/engineering/en_us/topics/insights/2019/twitter-for-mac-is-coming-back#:~:text=This%20led%20to%20our%20Responsive%20Web%20codebase%20being%20the%20spearhead%20for%20all%20platforms%20via%20web%20browsers)
their responsive Web codebase for all platforms, mobile and desktop, via Web browsers. On Windows,
the PWA is the experience the company is confident enough to make it _the_ Twitter experience that
you get when you
[install](https://blog.twitter.com/en_us/topics/product/2018/a-new-twitter-experience-on-windows)
the app from the Microsoft Store.

![alt_text](images/image3.png 'image_tooltip')

## Linkability and universality, the Web's super powers

All three companies, Adobe, Microsoft, and Twitter, in parallel to their Web apps have
well-established platform-specific Windows, macOS, Android, iOS, Linux,… etc. versions of their apps
Photoshop, Visual Studio Code, and Twitter respectively. So why did they build for the Web on top?
The answer lies in its linkability and universality.

As Google's
[puts it](https://web.dev/ps-on-the-web/#:~:text=the%20simple%20power%20of%20a%20url%20is%20that%20anyone%20can%20click%20it%20and%20instantly%20access%20it.%20all%20you%20need%20is%20a%20browser.%20there%20is%20no%20need%20to%20install%20an%20application%20or%20worry%20about%20what%20operating%20system%20you%20are%20running%20on.):
_"The simple power of a URL is that anyone can click it and instantly access it. All you need is a
browser. There is no need to install an application or worry about what operating system you are
running on"_. With Visual Studio Code for the Web,
[according to](https://code.visualstudio.com/blogs/2021/10/20/vscode-dev#:~:text=You%20can%20make%20quick%20edits%2C%20review%20PRs%2C%20and%20Continue%20on%20to%20a%20local%20clone)
Microsoft's [Chris Dias](https://twitter.com/chrisdias), when working with GitHub, _"you can make
quick edits, review PRs, and continue on to a local clone"_. The sole fact that you can share a link
to your work unlocks collaboration patterns that we have learned to love since the birth of apps
like Google Docs. Twitter of course lives and dies with links. News sites regularly
[link to newsworthy tweets](https://edition.cnn.com/2021/11/09/politics/gosar-anime-video-violence-ocasio-cortez-biden/index.html#:~:text=Ocasio-Cortez%20tweeted%20in%20response%20Monday%20saying%20a%20%22creepy%20member%22%20of%20the%20House%20had%20%22shared%20a%20fantasy%20video%20of%20him%20killing%20me.%22),
which _means "keeping it quick"_
[is core](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/progressively-enhancing-desktop-devices#:~:text=%C2%A0-,Keeping%20it%20quick,-With%20all%20the)
to ensuring people can get from the article straight into the app, where they can read or engage
with the linked tweet.

Web applications are inherently universal. They run on whatever operating system capable of running
a Web browser and do not need to be compiled for each operating system separately. The same code
base powers the application on all platforms. This does not mean that there are no compatibility
issues—there are plenty actually—but there is a
[solid shared increasing baseline](https://web.dev/interop-2022/) that all applications can build
upon.

## Linkability of platform-specific apps

While more ubiquitous on mobile, on desktop linking into a platform-specific app from the Web is
comparatively rare. On mobile (and macOS), this works via a technology called
[Universal Links](https://developer.apple.com/ios/universal-links/) on iOS (and on macOS) and
[App Links](https://developer.android.com/training/app-links/) on Android. Platform-specific apps
alternatively can rely on
[registered protocol schemes](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app)
like, for example, `itms-apps:` if they want to deep-link into the App Store app on macOS or iOS, or
register their own custom schemes for their own apps. So while technically possible, linking into
platform-specific apps is a lot less flexible and requires more plumbing work than simply linking
into a Web app.

## The slow decline of interest in cross-platform app frameworks and the rise of Flutter

With the Web becoming powerful enough to drive Web apps that were believed to be impossible like
Photoshop, we can see a slow decline of interest in cross-platform desktop app frameworks like
[Electron.js](https://www.electronjs.org/) and [NW.js](https://nwjs.io/) and mobile app frameworks
like [Cordova](https://cordova.apache.org/) or [React Native](https://reactnative.dev/), while at
the same time there is an undeniable increase of interest in [Flutter](https://flutter.dev/). The
[Google Trends chart](https://trends.google.com/trends/explore/TIMESERIES/1636457400?hl=en-US&tz=-60&cat=5&date=today+5-y&q=%2Fg%2F11bw_559wr,%2Fg%2F11f11js9bh,%2Fm%2F06znsr5,%2Fg%2F11f03_rzbg,%2Fg%2F11h03gfxy9&sni=3)
below shows all five side by side, well noting that this chart shows disambiguated topic trends as
detected by Google (as opposed to ambiguous
[search term trends](https://blog.tomayac.com/2021/11/08/things-mode-and-strings-mode-in-google-trends/)),
but it nevertheless is acknowledgedly not exact science.

![alt_text](images/image4.png 'image_tooltip')

This trend is backed by
[Statista stats](https://www.statista.com/statistics/869224/worldwide-software-developer-working-hours/),
according to which Flutter has passed React Native as the most popular framework.

![alt_text](images/image5.png 'image_tooltip')

And also
[StackOverflow statistics](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native%2Celectron%2Cionic-framework)
on tag usage agree. The underlying assumption of people actually using a technology being correlated
with people asking questions about said technology on StackOverflow is not out of this world.

![alt_text](images/image6.png 'image_tooltip')

## Should not everybody be building for the Web then?

Given the proves from the introductory three examples, Photoshop, VS Code, and Twitter, that it
indeed is possible to build amazing applications on the Web and given the Web's super powers of
linkability and universality, then _(i)_, why do people still not fully bet on PWAs but build
platform-specific apps and _(ii),_ do at least in part happily flock to Flutter?

### Why do people not fully bet on PWA?

For _(i)_, the answer is complex and manyfold. I want to break it down into different
sub-categories.

#### Missing capabilities, aka. the app gap

Web applications still lack certain functionalities that platform-specific apps have. In the
following, I list representative examples of such functionalities on different platforms. First, it
is impossible even with an installed PWA to obey the macOS user interface paradigm of having the
[app menu at the top of the screen](https://developer.apple.com/design/human-interface-guidelines/macos/menus/menu-bar-menus/).
It can easily be achieved with frameworks like Electron.js via the
<code>[Menu](https://www.electronjs.org/docs/latest/api/menu)</code> class. (On the Web, the next
best thing is [Window Controls Overlay](https://web.dev/window-controls-overlay/) and getting
support for app menus is tracked as [crbug/1295253](https://crbug.com/1295253).) Another example are
in-app purchases on macOS that can be handled via Electron's
<code>[inAppPurchase()](https://www.electronjs.org/docs/latest/tutorial/in-app-purchases)</code>
method. (On the Web, the next best thing is the
[Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/),
currently limited to Android and Chrome OS.) Installers are a common way users have learned to
install applications on Windows. With Electron.js, it is possible to create
[installers](https://www.electronjs.org/docs/latest/api/auto-updater#windows) and make installed
applications [update automatically](https://www.electronjs.org/docs/latest/api/auto-updater). (On
the Web, [Web Bundles](https://web.dev/web-bundles/) are the next best alternative in Chrome.) This
list is non-exhaustive, and Electron.js is mentioned as a representative framework out of many.

#### Discoverability in stores

Collectively we have educated users to look for apps in app stores. Some stores like the
[Windows Store](https://developer.microsoft.com/en-us/microsoft-store/pwa/) and the
[Android Play Store](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
have started to embrace (wrapped!) PWAs (optionally
[limited to Chrome OS](https://chromeos.dev/en/publish/pwa-in-play#chrome-os-only)) and offer
graphical user interface tools like [PWABuilder](https://www.pwabuilder.com/) (internally based on
the command line tool [bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)) for submitting
applications. Meanwhile on other stores like Apple's App Store, the situation is different and less
welcoming, and apps
[may or may not](https://blog.pwabuilder.com/posts/publish-your-pwa-to-the-ios-app-store/) make it
into the store, depending on the outcome of the app review. Recently, Oculus, a division of Meta
Platforms that produces virtual reality headsets, has announced that PWAs would be accepted on the
[Oculus Store](https://developer.oculus.com/pwa/).

#### Monetization of apps and in-app content

Apart from making apps themselves available for a fee, apps can also be monetized by selling items
as in-app purchases (for example, items in a game app) or by selling subscriptions (for example,
regular courses in a fitness app). If the developer integrates with payment providers, all of this
is available to Web apps as well, but the smooth integration of stores and their related payment
systems makes this a lot more attractive for platform-specific apps, albeit at a 15–30% commission.
For apps built using
[Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/) and
delivered through the Google Play Store, developers can now use the
[Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API) and the
new
[Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/)
to integrate with Google Play Billing.

#### Hiring or retraining developers

From personal experience from talking to many of Google's partners, a lot of
[companies struggle with hiring great Web developers](https://medium.com/javascript-scene/why-hiring-is-so-hard-in-tech-c462c3230017).
The talent shortage is real, and recruiting costs are high, which is why startups commonly early-on
hire in-house recruiters who oftentimes approach recruiting with a shotgun approach that has not
helped the guild's reputation with IT professionals. Companies also often already employ teams of
Android and/or iOS developers that they cannot just retrain to become Web developers. Creating a PWA
requires a high level of specialization that not all Web developers can offer.

#### Legacy existing apps (and migrating its user base)

It is not unusual for companies to have made massive investments in platform-specific apps, and
giving up these investments as well as the over the time acquired user base (not to speak of the
vanity install statistics) is not easy. Seemingly starting from scratch, even when the companies
have an existing website, appears very unattractive in comparison, but sometimes it
[happens](https://www.glossy.co/ecommerce/gone-fishin-patagonia-bids-farewell-to-mobile-app/).

#### Compatibility with relevant browsers

Web compatibility is still the
[top issue](https://insights.developer.mozilla.org/reports/mdn-web-developer-needs-assessment-2020.html#needs-assessment-top-ten-needs)
mentioned in developer surveys like Mozilla's, but also internal surveys Google has run. Having to
support specific browsers, avoiding or removing a feature that doesn't work across browsers, or
making a design look or work the same across browsers are frequently brought up challenges. Projects
like [webcompat.com](https://webcompat.com/) collect user-submitted browser bugs and invite
interested developers to fix them. Mozilla operates a
[repository](https://github.com/mozilla-extensions/webcompat-addon) with interventions and patches
to enable individual sites to run successfully in Firefox. WebKit maintains a
[quirks list](https://trac.webkit.org/browser/webkit/trunk/Source/WebCore/page/Quirks.cpp) and
[hires WebKit Web Compatibility Analysts](https://jobs.apple.com/search?search=%22WebKit%20Web%20Compatibility%20Analyst%22&sort=relevance).
Most importantly, though, the browser vendors themselves have joint forces to improve Web
compatibility in core areas in the context of the [Compat 2021](https://web.dev/compat2021/) and the
[Interop 2022](https://web.dev/interop-2022/) efforts, with
[Interop 2023](https://github.com/web-platform-tests/interop-2022/issues/78) already in the
planning.

#### Tools and framework support

Mozilla's
[developer survey](https://insights.developer.mozilla.org/reports/mdn-web-developer-needs-assessment-2020.html#needs-assessment-top-ten-needs),
apart from browser compatibility, likewise showed that developers struggle with tools and
frameworks. Supporting multiple frameworks in the same code base, understanding and implementing
security measures, plus outdated or inaccurate documentation for frameworks and libraries, and
keeping up with a large number of new and existing tools or frameworks were mentioned.

#### Security (or rather, security theater with certificate pinning)

In platform-specific app development, certificate pinning restricts which certificates are
considered valid for a particular app. Instead of allowing any trusted certificate to be used,
developers pin the certificate authority issuer, public keys, or even end-entity certificates of
their choice. Clients connecting to that server will treat all other certificates as invalid and
refuse to make an HTTPS connection. The hope is that this renders person-in-the-middle attacks
impossible, so platform-specific apps are more "secure" than Web apps, where traffic can easily be
sniffed with browser DevTools. There are ways to
[circumvent pinned certificates](https://codeshare.frida.re/@akabe1/frida-multiple-unpinning/) on
all platforms, so it is mostly a security theater at this point.

#### Performance limitations

Web applications have seen impressive performance improvements thanks to advanced technologies like
[Web Assembly](https://webassembly.org/) (including [SIMD](https://v8.dev/features/simd)),
[WebGPU](https://gpuweb.github.io/gpuweb/), and just general JavaScript engine progress in recent
years. Nonetheless will a carefully developed platform-specific app typically outperform a Web-based
application, albeit the situations where this _actually_ matters may be limited. With even
high-performance audio editing tools like [Soundtrap](https://www.soundtrap.com/) (thanks to the
[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and
[AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)), interactive
development environments like [Jupyter Notebook](https://jupyter.org/try) and graphics editing tools
like [Figma](https://www.figma.com/) (thanks to Web Assembly), and of course graphics-intensive
games like [Quake](http://www.quakejs.com) (thanks to
[WebGL](https://developer.mozilla.org/de/docs/Web/API/WebGL_API) and
[WebGPU](https://gpuweb.github.io/gpuweb/) in the future), the boundary is pushed at a rapid rate.

### Why is Flutter so popular?

For _(ii)_, one possible explanation is that it is a
[Google-backed](https://flutter.dev/#:~:text=Flutter%20is%20Google%27s%20UI%20toolkit%20for%20building%20beautiful%2C%20natively%20compiled%20applications%20for%20mobile%2C%20web%2C%20desktop%2C%20and%20embedded%20devices%20from%20a%20single%20codebase.)
toolkit for _"building beautiful, natively compiled applications for mobile, Web, desktop, and
embedded devices from a single codebase"_. If even Google, as the maker of Android, trusts Flutter
enough to build some of its strategic apps like
[Stadia](https://stadia.dev/blog/how-flutter-helped-us-make-stadia-controller-setup-better-for-users/)
and [Google Ads](https://flutter.dev/showcase) with it for both Android and iOS, and
[Assistant apps](https://developers.googleblog.com/2019/05/Flutter-io19.html) on smart display
embedded devices, that is quite a signal to send. Also note how Web and desktop are included in
Flutter's output options, which means Flutter is no longer limited to just mobile (with submission
into app stores as the carrot), and the promise is that it reduces the development cost of apps by
the number of targeted platforms. (Prominent target platform omissions so far are Apple CarPlay,
WearOS, WatchOS, and tvOS.)

An argument that is frequently brought up for Flutter is
[hot reloading](https://flutter.dev/docs/development/tools/hot-reload). On the backend, Flutter also
[plays well with Firebase](https://firebase.google.com/docs/flutter/setup?platform=ios), so apps are
easy to scale. Important for Web, and since Flutter initially was criticized for rendering
everything inaccessibly onto a `<canvas>`, the framework now has
[two different Web renderers](https://flutter.dev/docs/development/tools/web-renderers) it can
optionally automatically choose from:

- **HTML renderer:** This renderer uses a combination of HTML elements, CSS, canvas elements, and
  SVG elements and has a smaller download size.
- **CanvasKit renderer:** This renderer is fully consistent with Flutter mobile and desktop, has
  faster performance with higher widget density, but adds about 2 MB in download size. \

By default, Flutter selects the HTML renderer when the app is running in a mobile browser, and the
CanvasKit renderer when the app is running in a desktop browser.

Flutter relies on [a library of pre-made widgets](https://docs.flutter.dev/development/ui/widgets)
called Cupertino (for the iOS-native look) and Material (for the Android-native look) that allows
developers to quickly develop a good-looking application with a shared code base. It is well worth
noting that Flutter-built user interfaces are platform-agnostic because Flutter’s
[Skia](https://skia.org/) rendering engine does not require any platform-specific UI components. (A
downside of this approach of wrapping everything the app needs instead of reusing platform
primitives directly is app size.)

Apps in Flutter are developed in Dart, an object-oriented programming language that supports both
just-in-time (JIT) and ahead-of-time (AOT) compilation and compiles directly to native ARM or Intel
x64 code, which has a lot of performance advantages. Dart is also easy to pick up for developers
coming from any other object-oriented programming language.

Flutters [documentation](https://flutter.dev/docs) is generally recognized as best in class and its
[cookbook application](https://docs.flutter.dev/cookbook) makes getting started with a baseline
scaffolding a simple copy and paste job. The Flutter community is thriving and it's easy to find
help when one is stuck.

![alt_text](images/image7.png 'image_tooltip')

## How Fugu is my browser?

Given all the reasons (and counterarguments) listed above why companies are currently _not_ building
for the Web, why should you? My hypothesis is that many developers and executives alike don't
realize how capable the modern Web has become. Double-clicking an image file so it opens in an
associated PWA, making some modifications, saving the changes back to the file and then copying the
image contents over into another app or sharing it to an email client is a flow that wasn't possible
on the Web before, but which APIs developed in the context of
[Project Fugu](https://developer.chrome.com/blog/fugu-status/) 🐡 like the
[File Handling API](https://web.dev/file-handling/), the
[File System Access API](https://web.dev/file-system-access/), the
[Async Clipboard API](https://web.dev/async-clipboard/), and the
[Web Share API](https://web.dev/web-share/) have made possible.

Yes, in many cases the Web can do that! I have developed a test application with the tongue-in-cheek
name [How Fugu is my browser?](https://howfuguismybrowser.dev/) that you can take for a spin to see
what Project Fugu APIs your browser of choice supports. Since not all features are exposed on all
platforms, it's technically impossible to reach a score of 100%, so take it more like a playful
competition than absolute science. For each tested feature, there's a link to the relevant
documentation so you can learn more about the feature. Where feature detection is possible, there is
also a note whether the feature is supported by your browser or not, and finally
[page load statistics linked to Chrome Status](https://chromestatus.com/metrics/feature/timeline/popularity)
that tell you how popular over time a given feature is.

If your browser supports it, you can share how Fugu your browser is by clicking the **Share** button
right next to the Fugu fish and the progress bar.

![alt_text](images/image8.png 'image_tooltip')

## How Fugu is the Web?

Knowing how Fugu your browser is is only half of the equation. Equally interesting is knowing how
Fugu the Web is. To find an answer to this question, I have developed a browser extension with an
equally tongue-in-cheek name that is
[How Fugu is the Web](https://chrome.google.com/webstore/detail/how-fugu-is-the-web/apcghpabklkjjgpfoplnglnjghonjhdl).
When you install this extension from the Chrome Web Store and browse the Web, you will notice the
Fugu fish counter on some sites display a badge with the detected Project Fugu APIs. For example, if
you browse to [Excalidraw](https://excalidraw.com/), the counter jumps to 9, since Excalidraw uses
nine detectable Project Fugu APIs, namely
[Cache Storage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage),
[Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API),
[Web Share](https://web.dev/web-share/), [Async Clipboard](https://web.dev/async-clipboard/),
[Async Clipboard (Images)](https://web.dev/async-clipboard/),
[File System Access](https://web.dev/file-system-access/),
[Web Share Target](https://web.dev/web-share-target/),
[Web Share Target (Files)](https://web.dev/web-share-target/), and
[File Handling](https://web.dev/file-handling/). Again you can see if your browser supports the
feature and click through to documentation by clicking on **Details**, and also directly check out
the relevant source code snippet by clicking on the source code link in the bullet list.

![alt_text](images/image9.png 'image_tooltip')

## Conclusions

After browsing the Web for a while with the
[How Fugu is the Web extension](https://chrome.google.com/webstore/detail/how-fugu-is-the-web/apcghpabklkjjgpfoplnglnjghonjhdl)
installed, it is impressive how often the Project Fugu API badge appears. This ranges from pages
with comfort features like being able to paste images into an app like, for example, in
[GitHub's New Issue page](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue)
(instead of uploading them as a less comfortable option) to full-blown apps that make use of several
features like file handling, file system access, clipboard access, etc. as in
[Excalidraw](https://excalidraw.com/). Where before a platform-specific app was required, in some
cases now a Web application can fill in. An example of such is [Wooting](https://wooting.io/)'s
[Wootility](https://wootility.io/) app for programming gaming keyboards with the
[WebHID API](https://web.dev/hid/).

Similarly, running [How Fugu is my browser](https://howfuguismybrowser.dev/) on each new version of
your browser of choice is very satisfying, since with almost every new browser release the progress
bar moves up a little and your browser has gained a new capability or two.

Building for the Web is more viable than ever, and new features keep being added to the platform at
an amazing pace. The Web is not your only choice for building your app, but I hope with this article
I have convinced you to give The Capable Web a second look if you have dismissed it so far. It has
come a long way.
