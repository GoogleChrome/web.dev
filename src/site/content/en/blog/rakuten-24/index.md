---
title: Rakuten 24’s investment in PWA increases user retention by 450%
subhead: >
  Making their web app installable resulted in increased traffic, visitor retention,
  sales per customer, and conversions.
description: >
  Making their web app installable resulted in increased traffic, visitor retention,
  sales per customer, and conversions.
date: 2020-11-17
hero: image/admin/tQYdZJzfseUxfjtvK3bL.png
thumbnail: image/admin/JdmKiaCrxFsayexQWPXk.png
alt: An illustration of an e-commerce app next to the text 'SCALE ON WEB'.
tags:
  - blog
  - case-study
  - install
  - mobile
  - progressive-web-apps
  - scale-on-web
---

[Rakuten 24](https://24.rakuten.co.jp/) is an online store provided by Rakuten,
one of the largest e-commerce companies in Japan. It provides a wide selection
of everyday items including grocery, medicine, healthcare, kitchen utensils, and
more. The team's main goal over the last year was to improve mobile customer
retention and re-engagement. By making their web app
[installable](/define-install-strategy/), they saw a 450% jump in
visitor retention rate as compared to the previous mobile web flow over a
1-month timeframe.

## Highlighting the opportunity {: #opportunity }

In their efforts to gain market share and improve user experience, Rakuten 24
identified the following areas of opportunities:

+   As a relatively new service, Rakuten 24 was not in a position to
    invest the time and cost in developing a platform-specific app both for iOS
    and Android and were seeking an alternative, efficient way to fill this gap.
+   As Rakuten-Ichiba (Rakuten's e-commerce marketplace) is the biggest
    service in Japan, many people think Rakuten 24 is a seller in
    Rakuten-Ichiba. As a result, they acknowledged the need to invest in brand
    awareness and drive more user retention.

## The tools they used {: #tools }

### Installability {: #installability }

To capture the two opportunities identified above, Rakuten 24 decided to build
[Progressive Web App](/pwa) (PWA) features on an incremental
basis, starting with [installability](/define-install-strategy/).
Implementing installability resulted in increased traffic, visitor retention,
sales per customer, and conversions.

### `beforeinstallprompt` {: #beforeinstallprompt }

To gain more flexibility and control over their install dialogue's behaviour,
the team implemented their own install prompt using the
[`beforeinstallprompt`](https://developers.google.com/web/updates/2018/06/a2hs-updates)
event. In doing so, they were able to detect if the app was already installed on
Android or iOS and provide a more meaningful and relevant experience to their
users.

### Custom installation instructions {: #instructions }

For users who weren't able to install the PWA from the banner, they created a
<a href="https://24.rakuten.co.jp/addto/">custom guide</a>
(linked from the banner) with instructions on how to install the PWA manually on
both Android and iOS devices.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/APDhzk6SjyxQTgxVidFR.png", alt="Screenshots of the custom installation instructions.", width="800", height="480" %}
</figure>

### Workbox for service workers {: #workbox }

The Rakuten 24 team used
[Workbox](https://developers.google.com/web/tools/workbox) (the
[workbox-webpack-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)
to be precise) to ensure their PWA worked well even when the user was offline or
on a bad network.  Workbox's APIs for controlling
[the cache](/service-workers-cache-storage/#the-cache-storage-api)
worked significantly better than Rakuten 24's previous in-house script.
Moreover, with workbox-webpack-plugin (and Babel), was able to automate the
process of supporting a wider range of browsers. To further build network
resilience, they implemented a
[cache-first strategy](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)
for their CSS and JS assets, and used
[stale-while-revalidate](/stale-while-revalidate/) for their
images that don't change frequently.

## Overall business results {: #results }

<div class="w-columns">
  <div>
    <p>
      By implementing installability, Rakuten 24 was able to increase visit frequency
      per user by 310% compared to the rest of their web users. It also saw a 450%
      jump in visitor retention (compared to the previous mobile web flow), a 150%
      increase in sales per customer, and a 200% increase in conversion rate. All of
      the improvements were observed over a 1-month timeframe.
    </p>
    <div class="w-aside w-aside--note">
      All stats represent users that installed the Rakuten 24 PWA, compared to
      web users who did not.
    </div>
  </div>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l49plmwrrFO3V953MQZD.png", alt="310% increase in visit frequency per user.  450% increase in visitor retention rate. 150% increase in sales per customer.200% increase in conversion rate.", width="800", height="1074", class="w-screenshot" %}
  </figure>
</div>

## Other ways the business improved with installability {: #other-improvements }

* **Brand Awareness:** Since users can directly access Rakuten 24 from
  their home screen, it helped both users and Rakuten separate Rakuten 24
  from Rakuten-Ichiba.
* **Efficiency:** Rakuten 24 was able to drive these results without
  spending significant time and money building platform-specific apps for iOS
  and Android.

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    Our mission is to contribute to society by creating value through
    innovation and　entrepreneurship. A step towards achieving this was to
    improve the Rakuten 24 customer experience by implementing A2HS. And in the
    near future we also plan to enhance our PWA engagement and customer
    proposition by developing push notifications using the Web Push API.
  </p>
  <cite>Masashi Watanabe, General Manager, Group Marketing Department, Rakuten Inc.</cite>
</blockquote>

{% Aside %}
  Previously the concept of installability was known as _add to homescreen_
  (A2HS).
{% endAside %}

Check out the [Scale on web case studies](/scale-on-web) page for
more success stories from India and Asia.
