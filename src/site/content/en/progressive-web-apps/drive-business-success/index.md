---
layout: post
title: How Progressive Web Apps can drive business success
authors:
  - sfourault
date: 2020-05-20
updated: 2020-05-20
description: Build a solid business case for your PWA. Learn when you should invest, and how you can measure its success.
tags:
  - progressive-web-apps
---

Progressive Web Apps are on a lot of companies' roadmap to modernize their
website and adapt to users' new expectations. Like all new concepts and
technical capabilities, they raise questions: is it what my customers want,
how much will it grow my business, what is technically feasible?

{% Img src="image/admin/o70RxMcAQVPrjxH34a8r.jpg", alt="Identify your stakeholders", width="800", height="254" %}

To shape your digital strategy, several stakeholders are often involved: the
Product Manager and CMO are co-owners of the business impact of each feature,
the CTO assesses the feasibility and reliability of a technology, the UX
Researchers validate that a feature answers a real customer issue.

This article aims to help you answer those three questions and shape your
PWA project. You will start from your customer needs, translate this into
PWA features, and focus on measuring the business impact that each feature
brings to the table.

## PWAs solve customer needs {: #solve-customer-needs }

One rule we love to follow at Google when making products is
"[focus on the user and all else will follow][ten-things-we-know]". Think
_user-first_: what are my customers' needs, and how does a PWA provide them?

{% Img src="image/admin/TcmXmWb5mSUqal98NIAH.jpg", alt="Identify customer needs", width="800", height="262" %}

When doing user research, we find some interesting patterns:

* Users hate delays and unreliability on mobile: the level of stress caused by
  mobile delays is [comparable to watching a horror movie][horror-movie].
* Fifty percent of smartphone users are more likely to use a company's mobile
  site when browsing or shopping because they
  [don't want to download an app][twg-shopping].
* One of the top reasons for uninstalling an app is the
  [limited storage][twg-uninstall] (whereas an installed PWA usually takes
  less than 1MB).
* Smartphone users are more likely to purchase from mobile sites that
  [offer relevant recommendations][twg-purchase] on products, and 85% of
  smartphone users say [mobile notifications are useful][twg-notifications].

According to those observations, we found out that customers prefer
experiences that are fast, installable, reliable, and engaging (F.I.R.E.)!

## PWAs leverage modern web capabilities {: #modern-capabilities }

PWAs provide a set of best practices and modern web APIs that are aimed at
meeting your customers' needs by making your site fast, installable, reliable,
and engaging.

For example, using a service worker to [cache your resources][cache-resources]
and doing [predictive prefetching][wb-precache] makes your site faster, and
more reliable. Making your site Installable provides an easy way for your
customers to access it directly from their home screen or app launcher. And
new APIs like [Web Push Notifications][mdn-web-push] make it easier to
re-engage your users with personalized content to generate loyalty.

{% Img src="image/admin/rP0eNCflNYOhzjPi1Lq5.jpg", alt="Improving the user experience with new capabilities", width="800", height="393" %}

## Understand the business impact {: #business-impact }

The business success definition can be a lot of things depending on your
activity:

* Users spending more time on your service
* Reduced bounce rates for your leads
* Improved conversion rates
* More returning visitors

Most PWA projects result in a higher mobile conversion rate, and you can
learn more from the numerous [PWA case studies][pwa-case-studies]. Depending
on your objectives, you may want to prioritize some aspects of PWA that make
more sense for your business, and it's completely OK. PWA features can be
cherry-picked and launched separately.

Let's measure the business impact of each of these great F.I.R.E features.

### The business impact of a fast website {: #impact-fast }

A recent [study from Deloitte Digital][deloitte-study] shows that page speed
has a significant impact on business metrics.

There's a lot you can do to optimize the speed of your site to optimize the
critical user journeys for all of your users. If you don't know where to
start, take a look at our [Fast](/fast/) section, and use
[Lighthouse][lighthouse] to prioritize the most important things to fix.

When working on your speed optimizations, start measuring your site speed
frequently with appropriate tools and metrics to monitor your progress.
For example, measure your metrics with [Lighthouse][lighthouse],
fix clear targets like having ["Good" Core Web Vitals scores](/vitals/#core-web-vitals), and
incorporate a [performance budget into your build process][perf-budget-ci].
Thanks to your daily measurements and [the "value of speed" methodology][value-of-speed],
you can isolate the impact of your incremental speed changes and calculate
how much extra revenue your work has generated.

{% Img src="image/admin/yyRfQaDL3NcGhB0f79RN.jpg", alt="Measure the value of speed and correlate it with conversions", width="800", height="306" %}

Ebay made [speed a company objective][ebay-speed] for 2019. They used
techniques like performance budget, critical path optimization, and
predictive prefetching. They concluded that for every 100 milliseconds
improvement in search page loading time, add-to-card count increased by 0.5%.

{% Img src="image/admin/Qq3wo5UOqzC1ugnTzdqT.jpg", alt="A 100ms improvement in load time resulted in a 0.5% increase in add to cart count for eBay", width="800", height="184" %}

### The business impact of an installable website {: #impact-installable }

Why would you want a user to install your PWA? To make it easier to come back
to your site. Where an Android app install would add at least three steps
(redirection to Play Store, downloading, relaunching the Android app at the
top of the funnel), PWA installation is done seamlessly in one click, and it
doesn't take the user away from the current conversion funnel.

{% Img src="image/admin/u1jcKrBBOHEzSz3SqhEB.jpg", alt="The install experience should be seamless", width="800", height="239" %}

Once installed, users are able to launch it in one click from the icon on
their home screen, see it in their app tray when they are switching between
apps, or find it via an app search result.  We call this app dynamic
Discover-Launch-Switch, and making your PWA installable is the key to
unlocking access.

In addition to being accessible from familiar discovery and launch surfaces
on their device, a PWA launches exactly like a platform-specific app: in a standalone
experience, separate from the browser. Additionally, it benefits from OS-level
device services such as the app switcher and settings.

Users who install your PWA are likely your most engaged users, with better
engagement metrics than casual visitors, including more repeat visits,
longer time on site and higher conversion rates, often at parity with platform-specific
app users on mobile devices.

To make your PWA installable, it needs to meet the
[base criteria](/install-criteria/). Once it meets those criteria, you can
[promote the installation](/promote-install/) within your user experience on
desktop and mobile, including iOS.

{% Img src="image/admin/5sH5YX7kFrwv4f6duqVf.jpg", alt="PWAs are installable everywhere", width="800", height="227" %}

Once you've begun to promote the installation of your PWA, you should
measure how many users are installing your PWA, and how they use your PWA.

To maximize the number of users installing your site, you may want to
[test different][pwabook-ch4] promotion messages ("install in one
second", or "add our shortcut to follow your order" for example), different
placements (header banner, in-feed), and try proposing it at different steps
of the funnel (on the second page visited, or after a booking).

To understand where your users are leaving and how to improve retention, the
install funnel can be [measured][pwabook-ch8] in four ways:

* Number of users eligible to install
* Number of users who clicked on the UI install prompt
* Number of users who both accepted and declined to install
* Number of users who have successfully installed

You can start promoting your PWA install to all your users or use a more
cautious approach by only experimenting with a small group of users.

After a few days or weeks you should already have some data to measure the
impact on your business. What is the behavior of people coming from the
installed shortcut? Do they engage more, do they convert more?

To segment users who installed your PWA, track the
[`appinstalled` event][appinstalled-event], and use JavaScript to
[check if users are in standalone mode][is-standalone] (indicating usage of
the installed PWA). Then use these as variables or dimensions for your
analytics tracking.

{% Img src="image/admin/H2U4jKTmATNzVJQ3WNCO.jpg", alt="Measure the value of installation", width="800", height="253" %}

The [case study of Weekendesk][twg-weekendest] is interesting: they propose
Installation on the second page visited to maximize the install rate, and
they observed that customers coming back via the icon on the home screen were
more than twice as likely to book a stay with them.

{% Img src="image/admin/eR23C2o1adHq5tATNw34.jpg", alt="Installed users had a 2.5x higher conversion rate", width="800", height="201" %}

Installation is a great way to make people return on your site and improve
your customer loyalty. You can also think of personalizing the experience for
those premium users.

Even if you already have a platform-specific app, you may test to propose your app first
then push the PWA later for those who declined or did not engage with the app
install banner. Some of your users that are "semi-engaged" may not meet the
threshold for an app store-based install. This cohort can be addressed with
PWA installability that is often perceived as lighter, and with less friction.

{% Img src="image/admin/iNQalNPhjdBueuqPHiad.jpg", alt="PWAs can reach semi-engaged users", width="800", height="229" %}

### The business impact of a reliable website {: #impact-reliable }

The Chrome Dino game, offered when a user is offline, is played more than
[270 million times][chrome-dino-game] a month. This impressive number shows
that network reliability is a considerable opportunity, especially in
markets with unreliable or expensive mobile data like India, Brazil, Mexico,
or Indonesia.

When an app installed from an app store is launched, users expect
it to open, regardless of whether they're connected to the internet.
Progressive Web Apps should be no different.

At a minimum, a simple offline page that tells the user the app isn't
available without a network connection should be served. Then, consider
taking the experience a step further by providing some
[functionality that makes sense while offline][pwabook-ch6]. For example,
you could provide access to tickets or boarding passes, offline wish lists,
call center contact information, articles or recipes that the user has
recently viewed, etc.

{% Img src="image/admin/ubglZLCoddAfB5cl8JSz.jpg", alt="Be helpful, even when offline", width="800", height="243" %}

Once you've implemented a [reliable user experience][pwabook-ch6], you may
want to measure it; how many users are going offline, in which geographies,
and do they stay on the website when the network is back?

Offline usage can be measured by recording analytics pings when the user goes
[offline or online][pwabook-ch8]. It tells you how many users continue
browsing on your website after the network comes back.

{% Img src="image/admin/UfjYsWQWJjVIk2sp5bnE.jpg", alt="Trivago saw a 67% of users who came back online continue browsing", width="800", height="272" %}

The [Trivago case study][twg-trivago] illustrates how this can impact your
business objectives: for users whose sessions were interrupted by an
offline period (around three percent of users), 67% of those who come
back online continued browsing the site.

### The business impact of an engaging website {: #impact-engaging }

Web push notifications allow users to opt-in to timely updates from sites
they love and allow you to effectively re-engage them with customized,
relevant content.

Be careful, though. Asking users to sign up for web notifications when they
first arrive and without exposing the benefits can be perceived as spammy
and negatively affect your experience. Make sure to follow
[best practices][not-ux-bp] when prompting for notifications and inspire
acceptance through relevant usages like train delays, price tracking, out
of stock products, etc.

Technically, [push notifications][dgc-web-push] on the web run in the
background thanks to a service worker and are often sent by a system built for
managing campaigns (e.g. Firebase). This feature brings great business value
for mobile (Android) and desktop users: it increases repeated visits and
consequently sales and conversions.

To measure the effectiveness of your push campaigns, your need to measure
the whole funnel:

* Number of users eligible for push notifications
* Number of users who click a custom notification UI prompt
* Number of users who grant push notification permission
* Number of users who receive push notifications
* Number of users who engage with notifications
* Conversion and engagement of users coming from a notification

{% Img src="image/admin/UpzfxBDi3e66cZ9gzkkS.jpg", alt="Measure the value of Web Push Notifications", width="800", height="255" %}

There are a lot of great case studies on web push notifications, like
[Carrefour who multiplied their conversion rate by 4.5][carrefour-45x] by
re-engaging users with abandoned carts.

## The P in PWA: a progressive launch, feature by feature {: #feature-by-feature }

PWAs are modern websites that benefit from the massive reach of the web,
combined with all the user-friendly features that users love in Android/iOS/desktop apps.
They leverage a set of best practices and modern web APIs, that can be
implemented independently depending on your business specificities and
priorities.

{% Img src="image/admin/7g1j2z7h5m9QSHQhHceM.jpg", alt="Progressively launch your PWA", width="800", height="253" %}

To accelerate the modernization of your website and make it a real PWA,
we encourage you to be agile: launch feature by feature. First, research
with your users what features would bring them the most value, then deliver
them with your designers and developers, and finally do not forget to
measure precisely how much extra money your PWA generated.

[pwa-case-studies]: https://www.pwastats.com/
[precache-app]: /service-workers-cache-storage/
[wb-precache]: /precache-with-workbox/
[mdn-webpush]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices
[ten-things-we-know]: https://www.google.com/about/philosophy.html
[horror-movie]: https://blog.hubspot.com/marketing/mobile-website-load-faster
[deloitte-study]: https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html
[lighthouse]: https://developers.google.com/web/tools/lighthouse
[perf-budget-ci]: /incorporate-performance-budgets-into-your-build-tools/
[value-of-speed]: /value-of-speed/
[ebay-speed]: /shopping-for-speed-on-ebay/
[pwabook-ch4]: https://pwa-book.awwwards.com/chapter-4
[pwabook-ch6]: https://pwa-book.awwwards.com/chapter-6
[pwabook-ch8]: https://pwa-book.awwwards.com/chapter-8
[chrome-dino-game]: https://www.blog.google/products/chrome/chrome-dino/
[appinstalled-event]: /customize-install/#detect-install
[is-standalone]: /customize-install/#detect-launch-type
[twg-weekendest]: https://www.thinkwithgoogle.com/_qs/documents/8971/Weekendesk_PWA_-_EXTERNAL_CASE_STUDY.pdf
[twg-shopping]: https://www.thinkwithgoogle.com/data/smartphone-user-mobile-shopping-preferences/
[twg-uninstall]: https://www.thinkwithgoogle.com/data/why-users-uninstall-travel-apps/
[twg-purchase]: https://www.thinkwithgoogle.com/data/smartphone-mobile-app-and-site-purchase-data/
[twg-trivago]: https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/case-studies/trivago-embrace-progressive-web-apps-as-the-future-of-mobile/
[twg-notifications]: https://www.thinkwithgoogle.com/data/smartphone-user-notification-preferences/
[not-ux-bp]: https://developers.google.com/web/fundamentals/push-notifications/permission-ux
[dgc-web-push]: https://developers.google.com/web/fundamentals/push-notifications/
[carrefour-45x]: https://useinsider.com/case-studies/carrefour/
[cache-resources]: /service-workers-cache-storage/
[mdn-web-push]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices
