---
layout: post
title: What makes a good Progressive Web App?
authors:
  - samrichard
  - petelepage
date: 2020-01-06
updated: 2020-02-24
description: |
  What makes a good, or great Progressive Web App?
tags:
  - progressive-web-apps
---

<!-- Disable heading-increment because it mucks with the Details widget -->
<!--lint disable heading-increment-->

Progressive Web Apps (PWA) are built and enhanced with modern APIs to deliver
enhanced capabilities, reliability, and installability while reaching
_anyone, anywhere, on any device_ with a single codebase. To help you create
the best possible experience, use the [core](#core) and [optimal](#optimal)
checklists and recommendations to guide you.

## Core Progressive Web App checklist {: #core }

The Progressive Web App Checklist describes what makes an app installable and
usable by all users, regardless of size or input type.

{% Details %}
{% DetailsSummary 'h3' %}

Starts fast, stays fast

Performance plays a significant role in the success of any online experience,
because high performing sites engage and retain users better than poorly
performing ones. Sites should focus on optimizing for user-centric performance metrics.

{% endDetailsSummary %}

Performance plays a significant role in the success of any online experience,
because high performing sites engage and retain users better than poorly
performing ones. Sites should focus on optimizing for user-centric performance metrics.

#### Why

Speed is critical for getting users to _use_ your app.
In fact, as page load times go from one second to ten seconds, the probability of
a user bouncing increases by 123%. Performance doesn't stop with the `load` event.
Users should never wonder whether their interaction—for example, clicking a
button—was registered or not. Scrolling and animation should feel smooth.
Performance affects your entire experience, from how users perceive your
application to how it actually performs.

While all applications have different needs, the performance audits in
Lighthouse are based on the
[RAIL user-centric performance model](https://developers.google.com/web/fundamentals/performance/rail),
and scoring high on those audits will make it more likely that your users have
an enjoyable experience. You can also use
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
or the [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report/)
to get real-world performance data for your web app.

#### How

Follow our [guide on fast load times](/fast/) to learn how to make your PWA
start fast and stay fast.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Works in any  browser

Users can use any browser they choose to access your web app before it's
installed.

{% endDetailsSummary%}

Users can use any browser they choose to access your web app before it's
installed.

#### Why

Progressive Web Apps are web apps first, and that means they need to work
across browsers, not just in one of them.

An effective way of doing this is by, in the words of Jeremy Keith in
[Resilient Web Design](https://resilientwebdesign.com/), identifying the core
functionality, making that functionality available using the simplest possible
technology, and then enhancing the experience where possible. In many cases,
this means starting with just HTML to create the core functionality, and
enhancing the user experience with CSS and JavaScript to create a more
engaging experience.

Take form submission for example. The simplest way to implement that is an
HTML form that submits a `POST` request. After building that, you can enhance
the experience with JavaScript to do form validation and submit the form via
AJAX, improving the experience for users who can support it.

Consider that your users will experience your site across a spectrum of
devices and browsers. You cannot simply target the top end of the spectrum.
By using feature detection, you'll be able to deliver a usable experience
for the widest range of potential users, including those using browsers
and devices that may not exist today.

#### How

Jeremy Keith's [Resilient Web Design](https://resilientwebdesign.com/) is an
excellent resource describing how to think about web design in this
cross-browser, progressive methodology.

#### Additional reading

* A List Apart's [Understanding Progressive Enhancement](https://alistapart.com/article/understandingprogressiveenhancement/)
  is a good introduction to the topic.
* Smashing Magazine's
  [Progressive Enhancement: What It Is, And How To Use It?](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/)
  gives a practical introduction and links to more advanced topics.
* MDN has an article titled
  [Implementing feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)
  that talks about how to detect a feature  by directly querying it.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Responsive to any screen size

Users can use your PWA on any screen size and all of the content is available
at any viewport size.

{% endDetailsSummary %}

Users can use your PWA on any screen size and all of the content is available
at any viewport size.

#### Why

Devices come in a range of sizes, and users may use your application at a
range of sizes, even on the same device. Therefore, it's critical to ensure
your content not only fits within the viewport, but that all features and
content for your site are usable at all viewport sizes.

The tasks users want to complete and the content they want to access do
not change with viewport size. The content can be rearranged at different
viewport sizes, and it should all be there, one way or another. In fact, as
Luke Wroblewski states in his book Mobile First, starting small and going
large instead of the other way around can actually improve a site's design:

> Mobile devices require software development teams to focus on only the
> most important data and actions in an application. There simply isn't room
> in a 320 by 480 pixel screen for extraneous, unnecessary elements.
> You have to prioritize.

#### How

There are many  resources on responsive design, including the
[original article by Ethan Marcotte](https://alistapart.com/article/responsive-web-design/),
a [collection of important concepts](https://snugug.com/musings/principles-responsive-web-design/)
related to it, as well as books and talks galore. To narrow this discussion
down to the content aspects of responsive design, you can dig into
[content-first design](https://uxdesign.cc/why-you-should-design-the-content-first-for-better-experiences-374f4ba1fe3c)
and [content-out responsive layouts](https://alistapart.com/article/content-out-layout/).
Finally, while it's focused on mobile, the lessons in
[Seven Deadly Mobile Myths](https://www.forbes.com/sites/anthonykosner/2012/05/03/seven-deadly-mobile-myths-josh-clark-debunks-the-desktop-paradigm-and-more/#21ecac977bca)
by Josh Clark are just as relevant to small-sized views of responsive sites
as they are to mobile.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Provides a custom offline page

When users are offline, keeping them in your PWA provides a more seamless
experience than dropping back to the default browser offline
page.

{% endDetailsSummary %}

When users are offline, keeping them in your PWA provides a more seamless
experience than dropping back to the default browser offline
page.

#### Why

Users expect installed apps to work regardless of their connection status.
A platform-specific app never shows a blank page when it is offline, and a Progressive
Web App should never show the browser default offline page. Providing a
custom offline experience, both when a user navigates to a URL that hasn't
been cached and when a user tries to use a feature that requires a connection,
helps your web experience feel like it's part of the device it's running on.

#### How

During a service worker's `install` event, you can precache a custom offline
page for later use. If a user goes offline, you can respond with the precached
custom offline page. You can follow our custom
[offline page sample](https://googlechrome.github.io/samples/service-worker/custom-offline-page/)
to see an example of this in action and learn how to implement it yourself.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Is installable

Users who install or add apps to their device tend to engage with those
apps more.

{% endDetailsSummary %}

Users who install or add apps to their device tend to engage with those
apps more.

#### Why

Installing a Progressive Web App allows it to look, feel, and behave like all
other installed apps. It's launched from the same place users launch their
other apps. It runs in its own app window, separate from the browser, and it
appears in the task list, just like other apps.

Why would you want a user to install your PWA? The same reason you'd want a
user to install your app from an app store. Users who install your apps
are your most engaged audience, and have better engagement metrics than
typical visitors, often at parity with app users on mobile devices.
These metrics include more repeat visits, longer times on your site and
higher conversion rates.

#### How

You can follow our [installable guide](/customize-install/) to learn how to make
your PWA installable, how to test to see that it's installable, and try
doing it yourself.

{% endDetails %}

## Optimal Progressive Web App checklist {: #optimal }

To create a truly great Progressive Web App, one that feels like a
best-in-class app, you need more than just the core checklist. The optimal
Progressive Web App checklist is about making your PWA feel like it's part
of the device it's running on while taking advantage of what makes the web powerful.


{% Details %}
{% DetailsSummary 'h3' %}

Provides an offline experience

Where connectivity isn't strictly required, your app works the same offline
as it does online.

{% endDetailsSummary %}

Where connectivity isn't strictly required, your app works the same offline
as it does online.

#### Why

In addition to providing a custom offline page, users expect Progressive Web
Apps to be usable offline. For example, travel and airline apps should have
trip details and boarding passes easily available when offline. Music,
video, and podcasting apps should allow for offline playback. Social and
news apps should cache recent content so users can read it when offline.
Users also expect to stay authenticated when offline, so design for
offline authentication. An offline PWA provides a true app-like experience
for users.

#### How

After determining which features your users expect to work offline, you'll
need to make your content available and adaptable to offline contexts. In
addition, you can use
[IndexedDB](https://developers.google.com/web/ilt/pwa/working-with-indexeddb),
an in-browser NoSQL storage system, to store and retrieve data, and
[background sync](https://developers.google.com/web/updates/2015/12/background-sync)
to allow users to take actions while offline and defer server communications
until the user has a stable connection again. You can also use service
workers to store other kinds of content, such as images, video files, and
audio files for offline use, as well as use them to implement
[safe, long-lived sessions](https://developers.google.com/web/updates/2016/06/2-cookie-handoff)
to keep users authenticated. From a user experience perspective, you can use
[skeleton screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
that give users a perception of speed and content while loading that can
then fall back to cached content or an offline indicator as needed.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Is fully accessible

All user interactions pass [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
accessibility requirements.

{% endDetailsSummary %}

All user interactions pass [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
accessibility requirements.

#### Why

Most people at some point in their life will want to take advantage of your
PWA in a way that is covered under the [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
accessibility requirements. Humans' ability to interact with and understand
your PWA exist on a spectrum and needs can be temporary or permanent. By
making your PWA accessible, you ensure it's usable for everyone.

#### How

W3C's [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
is a good place to start. A majority of accessibility testing
must be done manually. Tools like the [Accessibility](/lighthouse-accessibility/)
audits in Lighthouse, [axe](https://github.com/dequelabs/axe-core), and
[Accessibility Insights](https://accessibilityinsights.io/) can help you
automate some accessibility testing. It's also important to use semantically
correct elements instead of recreating those elements on your own,
for instance, `a` and `button` elements. This ensures that when you do need
to build more advanced functionality, accessible expectations are met (such as
when to use arrows vs. tabs).
[A11Y Nutrition Cards](https://accessibilityinsights.io/) has excellent
advice on this for some common components.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Can be discovered through search

Your PWA can be easily [discovered through search](/discoverable/).

{% endDetailsSummary %}

Your PWA can be easily [discovered through search](/discoverable/).

#### Why

One of the biggest advantages of the web is the ability to discover sites and
apps through search. In fact,
[more than half](https://www.brightedge.com/resources/research-reports/channel_share)
of all website traffic comes from organic search. Making sure that canonical
URLs exist for content and that search engines can index your site is critical
for users to be able to find your PWA. This is especially true when adopting
client-side rendering.

#### How

Start by ensuring that each URL has a unique, descriptive title and meta
description. Then you can use the
[Google Search Console](https://search.google.com/search-console/about)
and the [Search Engine Optimization audits](/lighthouse-seo/) in Lighthouse to
help you debug and fix discoverability issues with your PWA. You can also use
[Bing](https://www.bing.com/toolbox/webmaster)'s or
[Yandex](https://webmaster.yandex.com/welcome/)'s webmaster tools, and
consider including [structured data](https://goo.gle/search-gallery) via
schemas from [Schema.org](https://schema.org/) in your PWA.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Works with any input type

Your PWA is equally usable with a mouse, a keyboard, a stylus, or touch.

{% endDetailsSummary %}

Your PWA is equally usable with a mouse, a keyboard, a stylus, or touch.

#### Why

Devices offer a variety of input methods, and users should be able to
seamlessly switch between them while using your application. Just as important,
input methods should not depend on screen size, meaning that large viewports
need to support touch and small viewports need to support keyboards and mice.
To the best of your ability, ensure that your application and all of its
features supports usage of any input method your user may choose to use.
Where appropriate, you should also enhance experiences to allow for
input-specific controls as well (such as pull-to-refresh).

#### How

The [Pointer Events API](https://developers.google.com/web/updates/2016/10/pointer-events)
provides a unified interface for working with various input options, and is
especially good for adding stylus support. For supporting both touch and
keyboard, ensure that you're using the correct semantic elements (anchors,
buttons, form controls, etc.) and not rebuilding these with non-semantic
HTML (which is good for accessibility). When including interactions that
activate on hover, ensure they can activate on click or tap, too.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Provides context for permission requests

When asking permission to use powerful APIs, provide context and ask only
when the API is needed.

{% endDetailsSummary %}

When asking permission to use powerful APIs, provide context and ask only
when the API is needed.

#### Why

APIs that trigger a permission prompt, like notifications, geolocation, and
credentials, are intentionally designed to be disruptive to a user because they
tend to be related to powerful functionality that requires opt-in. Triggering
these prompts without additional context, like on page load, makes users
less likely to accept those permissions and more likely to distrust them
in the future. Instead, only trigger those prompts after providing an
in-context rationale to the user for why you need that permission.

#### How

The [Permission UX](https://developers.google.com/web/fundamentals/push-notifications/permission-ux)
article and UX Planet's
[The Right Ways to Ask Users for Permissions](https://uxplanet.org/mobile-ux-design-the-right-ways-to-ask-users-for-permissions-6cdd9ab25c27)
are good resources to understand how to design permission prompts that, while
focused on mobile, apply to all PWAs.

{% endDetails %}


{% Details %}
{% DetailsSummary 'h3' %}

Follows best practices for healthy code

Keeping your codebase healthy makes it easier to meet your goals and deliver
new features.

{% endDetailsSummary %}

Keeping your codebase healthy makes it easier to meet your goals and deliver
new features.

#### Why

There's a lot that goes into building a modern web application. Keeping your
application up-to-date and your codebase healthy makes it easier for you to
deliver new features that meet the other goals laid out in this checklist.

#### How

There are a number of high-priority checks to ensure a healthy
codebase: avoiding using libraries with known vulnerabilities, ensuring
you're not using deprecated APIs, removing web anti-patterns from your
codebase (like using `document.write()` or having non-passive scroll event
listeners), and even coding defensively to ensure your PWA doesn't break
if analytics or other third party libraries fail to load. Consider requiring
static code analysis, like linting, as well as automated testing, in multiple
browsers and release channels. These techniques can help catch errors
before they make it into production.

{% endDetails %}
