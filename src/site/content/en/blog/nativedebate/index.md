---
layout: post
title: HTML5 vs Native
subhead: The mobile app debate
authors:
  - mahemoff
date: 2011-06-03
tags:
  - blog
---

## Introduction

Mobile apps and HTML5 are two of the hottest technologies right now, and
there's plenty of overlap. Web apps run in mobile browsers and can also be
re-packaged as native apps on the various mobile platforms. With the wide
range of platforms to support, combined with the sheer power of mobile
browsers, developers are turning to HTML5 as a "write one, run many"
solution. But is it really viable? There are still compelling reasons to go
native, and clearly, many developers are indeed going that route. This
article is a debate on native versus the web.

## Feature Richness

### Point: Native can do more

We can divide mobile functionality into two dimensions: the
experience of the app itself, and the way it hooks into the device's
ecosystem, e.g. for Android, this would be features like widgets and
notifications. Native excels in both dimensions.

In terms of app experience, native apps can do more. They can easily get
hold of swipe events, mutlitouch even, for those platforms which support it.
They can typically act on hard keys being pressed, like Android's search button
and volume controls.  They can access hardware too, like GPS and camera. And
with the user's permission, some platforms provide unfettered access to the
operating system. Just try detecting how much battery remains with HTML5!

It's more than the in-app experience though. An operating system
like Android provides different ways for apps to interact with
users, and indeed, with other apps. You have active widgets on the
homepage. You have notifications, which show up in the device's
status bar. And you have intents, which allow your app to announce
itself as providing a general service which other apps might require
on occasion.

### Counterpoint: Native features can be augmented, and the web is catching up anyway

It's true that many in-app features are simply beyond
reach for an HTML5 app. No matter how hot your web-fu skills are,
if your app is stuck in a sandbox with no camera API, it won't be
taking snaps anytime soon! Fortunately, you don't have to be in
that sandbox. If you really need your web app to take a photo, you
can create a native app, one with an embedded web view which provides
the bulk of the user interface. This is how the open-source
PhoneGap framework operates: it fills the gap by exposing native
features as web services, which the web view calls using a
standard networking API. When you build a hybrid app like this,
you're also able to hook into those platform features like
widgets, notifications, and intents.

Making a hybrid - native plus web - app is hardly an ideal
solution. It adds complexity and applies only to web apps wrapped as
native apps, rather than traditional websites accessed from a mobile
browser. But it mightn't be necessary for long. Web standards are
evolving rapidly, and modern mobile browsers are keeping pace.
Offline storage, geolocation, canvas graphics, and video/audio
playback all  enjoy widespread support among modern smarpthones, for example.
Even camera is starting to be supported  -  as of Android 3.1, it's
possible to capture photos and videos using web standards.  And the latest iOS
browser supports WebSocket for 2-way streaming, as well as device orientation
detection.

Overall, mobile is evolving. But the web is also evolving, and fast. Among
desktop browsers alone, there are five major browser vendors evolving standards
and adding features at lightning pace.  While it's not a trivial process to
port these features to mobile, many of them have already made their way into
the mobile browsers.

Native is a fast-moving target, but the web is closing the gap.

## Performance

### Point: Native runs faster

Native apps don't have the web runtime barrier to deal with. They
run close to the metal and can take advantage of performance
boosters like GPU acceleration and multithreading.

### Counterpoint: Web runtimes are much faster today, and most apps don't need the speed anyway

It would be an understatement to say the web has gotten faster in
recent years. V8, the JavaScript engine that ships with Chrome, was a
major development in web performance when it launched, and since then, it
has only gotten faster:

<figure>
<a href="http://blog.chromium.org/2010/12/new-crankshaft-for-v8.html">
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/tUAj9JVwmvVqvmxfypAV.png", alt="V8 performance graph", width="400", height="230" %}
</a>
</figure>

Graphic rendering engines has also sped up the web, and now hardware
acceleration is starting to happen. Have a look at the speed bump provided by
hardware accelerated-canvas:

<a href="http://www.maximumpc.com/article/news/hardware-accelerated_chrome_7_60x_faster_previous_versions">
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/tUAj9JVwmvVqvmxfypAV.png", alt="Hardware accelerated-canvas graph", width="400", height="230" %}
</a>

In addition, the new Web Workers API makes multithreading a possibility, and
modern web developers can also call on a range of performance-optimized libraries,
and well-researched performance optimizion techniques. While most of those started
life on the desktop web, they are still relevant to mobile, and there's
increased attention paid to mobile, e.g.  performance guru Steve Souders has [page dedicated to mobile performance tools](http://stevesouders.com/mobileperf/).

Not all desktop advances have made their way to every mobile platform yet,
but the trends indicate they are on their way. It's also important to note that
the majority of mobile apps aren't bleeding-edge 3D games, but fundamentally
information-based: news, mail, timetables, social networks, etc. Visit a few
sites from your mobile, e.g. GMail, Amazon, Twitter, and you can confirm mobile
web performance is more than adequate. As for games, basic ones are already
feasible with 2D canvas, and WebGL is starting to appear on mobiles - see
Firefox 4. Until it's widespread, there is a growing family of frameworks which
compile WebGL apps to native apps that can take advantage of OpenGL, e.g. [ImpactJS](http://impactjs.com/).

## Developer Experience

### Point: Native is easier to develop

Native apps use robust programming languages (e.g. Java,
Objective C, C++) which were designed for complex application
development and have a proven track record. The APIs were designed
ground-up to support the platform at hand. You can easily debug apps
in desktop emulators which provide a close representation of the
target device.

What makes web development particularly troublesome is the huge
diversity of browsers and runtimes. When your app runs, it's no
guarantee feature X will be available. And even if it is, how will
the browser implement it? Standards are open to interpretation.

### Counterpoint: Web is often easier to develop, especially if targeting multiple devices

Let's tackle core technology first. It's true that web standards
were originally conceived in an era when the web was fundamentally
about documents, not apps, with JavaScript built and deployed in
just 10 days! But they've turned out to be much more capable than
imagined - web developers have learned to leverage the good parts
and tame the bad parts, with patterns now understood for scaleable
design. Furthermore, the standards are not standing still, and
efforts like HTML5, CSS3, and EcmaScript Harmony are all improving
the developer experience. Whether you prefer C++ or Java or
JavaScript is a matter of religious debate, and also depends on your
legacy code base. But we can certainly include JavaScript as a
serious contender these days.

The flipside to browser/runtime fragmentation is the fact that
all these environments exist in the first place. Develop an Android
app in Java, and you're faced with a full port to Objective C to
support iOS. Develop a web app once and it will run in Android and
iOS, not to mention WebOS, BlackBerry, Windows Mobile and… well,
that's the theory anyway. In practice, you'll need to tweak things
for each platform if you really want to get the experience right.
But you'd have to do that in native too, for most mobile operating
systems - there are different versions and different devices.

The good news is "fragmentation" has always been this way on the
web, and there are well-known techniques to deal with it. Most
importantly, the principle of progressive enhancement urges
developers to target a basic device first, and add layers of
platform-specific awesomeness where it's available. The mantra of
feature detection also helps and these days, we have library support
from the likes of [Modernizr](http://www.modernizr.com/) to support responsive
web design. With judicious use of these techniques, you can
expand your reach to the vast majority of devices, even
old-school "feature phones", even form factors like watches and
TVs, regardless of make and OS. Witness our [multi-UI demonstration](http://www.google.com/events/io/2011/sessions/mobile-web-development-from-zero-to-hero.html) at Google IO 2011,
where we targeted distinct form factors (feature phone, smartphone, tablet, desktop, TV) with
a common code base of logic and markup.

## Look-And-Feel

### Point: Native fits platform look-and-feel

One of the defining features of any platform is its look and
feel. Users come to expect controls to be presented consistently and
manipiulated in the same way. There are certain idioms which vary
from platform to platform, e.g. what happens when the user performs
a "long hold" (keep touching an element for several seconds)?
Plaforms have standard idioms for such things, and you can't satisfy them all with a single HTML5 app.

Furthermore, platform look-and-feel is orchestrated by the platform's native
software library, whose widgets encapsulate the kind of look and feel users
expect. You get a lot of the expected look-and-feel "for free" just by using
the native toolkit.

### Counterpoint: The web has its own look-and-feel, and you can also customize web interface for those platforms you care about the most

As explained in the previous section, the way of web development
is to write a basic "one size fits all" version, and then
progressively enhance it. While the enhancement is typically based
on features, you can also enhance it by targeting those platforms
you care the most about. This is a kind of "browser detection",
which is sometimes frowned upon by the web community, mostly because
there are so many possible browsers out there. But if you do view
two or three platforms with a very high priority, and you're willing
to make the extra effort in order to stack up against native
alternatives, this may be the way to go.

As far as the baseline version, the web has its own
look-and-feel, and we can even say each mobile platform has its own
"web look-and-feel" established by the default browser and web
runtime. "Web look-and-feel" may be fine for your users, and in
fact, allows you to achieve a greater degree of consistency with the
desktop browsing experience, as well as those on other devices the
user might be working with. Furthermore, there are many successful
apps which don't much support native look and feel anyway. This is
certainly true of games (does your favorite mobile game follow your mobile
OS's look and feel?), and even true of more conventional apps, e.g. check out
the more popular native Twitter clients on your platform of choice, and you'll
see a wide range of user-interface mechanisms at work.

## Discoverability

### Point: Native apps are easier to discover

App distribution mechanisms, like Android's Market and Apple's
App Store, have been overwhelmingly popular in recent years and are
a major driving force for the entire mobile industry. Any developer
can submit their native app to the marketplace, where users can
discover it through a combination of browsing, searching, and
getting recommendations. Not only that, but if you've done your job
right, the glowing ratings and comments will convince users to hit
the all-important install button.

### Counterpoint: Actually, web apps are easier to discover

The web is arguably the most discoverable medium ever created. In
the humble URL, we have (in theory, at least) a unique identifier
for everything ever published on the web, which includes any apps
published on standard websites. Search engines make it easy to
discover that content and other websites can link to it, including
catalogues of web apps similar to mobile marketplaces. Indeed, any
individual can share web apps with their friends by just linking to
it in emails and social network messages. Links can be sent in SMS
too, where mobile users will be able to click on the link and launch
the app in their device's browser.

We don't yet have the same marketplaces where users can rate and
comment on apps, but that's changing too. Read on…

## Monetization

### Point: Native can be monetized

"6 year-old makes app during lunch hour, sells a zillion copies
at $3 each". You see that headline a lot these days, so it's no
wonder developers big and small are looking to the mobile
marketplaces for monetization. Mobile platforms offer several
avenues for developers to directly charge for their apps. Simplest
is the one-time payment, to unlock the app for all eternity. There
are also in-app payment and subscription mechanisms on offer in some
platforms, and they are tightly integrated in a consistent, secure,
mechanism. These newer forms of payment allow developers to convert
a smash-hit app into a long-term revenue stream.

In addition to app payments, you can monetize with traditional
web models, such as advertising and sponsorship.

### Counterpoint: It's always been possible to monetize on the web, and the opportunities are growing

The web would not be the engine of modern industry if there
weren't ample opportunities to cash in. Although direct
"pay-per-use" mechanisms haven't yet flourished, there are various
niches where subscription-based "software as a service" solutions
have indeed become viable. Examples include Google Apps, 37Signals'
range of products, and premium versions of various email services.
Furthermore, direct payments aren't the only way to profit from web
apps. There's online advertising, affiliate links, sponsorships,
cross-promotion to other products and services.

Having said that, it's perfectly reasonable for a web developer
to read the headlines and experience a dash of payment envy. You
can't submit a web URL to the native marketplaces, so what's a web
developer to do? What you do is create a native "wrapper app" - for
each platform you want to target, create an empty native app that
simply contains a web view. The web view is where you embed the real
app. Then you just submit these apps to the various marketplaces
(and hopefully watch the money roll in!). There are probably
hundreds, if not thousands, of web-powered apps in the main
marketplaces today, some of them so cunningly assimilated that we
don't even know their web apps at all.

The downside is the onus of cross-compiling to each
platform. Here's where an existing framework like PhoneGap can help.
Even better, there are web services like PhoneGap Build and
Apparatio under development. Point these websites to your code
repository, and out pops an Android app, an iOS app, and so
on… ready for you to submit to the respective stores. No installing
native SDKs on your machine; all you needed to build all these
native apps was a a code editor and a web browser.

Will the marketplaces ever support web apps directly, without all
the overhead of wrapping them natively? It's not yet clear. We do
know that Google introduced the Chrome Web Store last year, and
although it applies only to the desktop, the store has triggered
interest from other browser vendors, and is overall part of a trend
towards web app catalogues, including some mobile-specific attempts.
It's early days for the concept of a web store, but the signs are
promising.

## Conclusions

It would be nice to declare a winner here, but right now, there
is no clear winner. Some apps are best suited for native and some
are best suited for the web. The web stack arguably has more
momentum, but in terms of capabilities and execution qualities,
native apps are moving fast too. And unless there comes a time when
web technologies are a first-class citizen on the majority of mobile
OSs, native will always be an important consideration.

One technique mentioned in this article is hybrid apps, and this
may be the best compromise for some developers: web view where it's
possible and platform-specific native components where it's not.

If you do choose the web path, be mindful of web standards and
the principle of progressive enhancement. The web is a technology
that knows how to target the multitudes of devices and operating
systems around. Whether you choose to call it "fragmentation" or
"diversity", the web embraces it and you developers can benefit from
all the prior art out there.
