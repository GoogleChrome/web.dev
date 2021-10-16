---
title: >
  JD.ID improves their mobile conversion rate by 53% with caching strategies,
  installation, and push notifications
subhead: >
  How JD.ID increased its overall mobile conversion rate (mCVR) by 53%, mCVR
  for installed users by 200%, and daily active users by 26%.
description: >
  How JD.ID increased its overall mobile conversion rate (mCVR) by 53%, mCVR
  for installed users by 200%, and daily active users by 26%.
date: 2020-11-24
hero: image/admin/WubpgpQSHBG8nMqJ7ms4.png
thumbnail: image/admin/6l2nf0jG3h1DkTiqEbjv.png
alt: Various icons related to the concept of an e-commerce site.
tags:
  - blog
  - case-study
  - progressive-web-apps
  - install
  - offline
  - scale-on-web
---

[JD.ID](https://www.jd.id/) is an e-commerce platform in Indonesia providing
delivery services for a wide range of products including electronic devices,
household appliances, clothing, fashion accessories, and sports products.
Currently operating across more than 350 Indonesian cities, JD.ID wanted to
expand its online presence further by focusing on performance and a strong
network-independent experience for their [Progressive Web App
](/pwa)(PWA). With this enhanced experience, JD.ID was able to
increase its overall mobile conversion rate (mCVR) by 53%, its mCVR for
installed users by 200%, and its daily active users by 26%, putting it on course
to becoming the most popular and trusted e-commerce company in the country.  

{% Img src="image/admin/0nJBxHM0wbQKuAVnCAEX.jpg", alt="Screenshots of a user installing the JD.ID PWA", width="800", height="480" %}

## Highlighting the opportunity

To overcome the unstable mobile networks in Indonesia due to the vast number of
operators, JD.ID was looking for a solution that would keep its website and user
experience performing at all times, as well as solve any local caching issues.
It saw huge acquisition potential from users that had visited its website but
not downloaded the iOS/Android app. To capture this opportunity it used [PWA
best practices](/pwa-checklist/) to help build an app-like UX on
its website to enhance engagement, with a focus on [network
resilience](/reliable/) for dependability.

## The approach 

### Caching strategies

To mitigate network issues and improve user experience, the JD.ID team used
[Workbox](https://developers.google.com/web/tools/workbox) to ensure its PWA
performed well even when the user was offline or on a bad network. Workbox made
it easier to execute their PWA caching strategy, which consisted of 3 parts:

+   [**Network first, falling back to cache**](/offline-cookbook/#network-falling-back-to-cache):
    This strategy aims to get a response from the network first. Once a
    response is received, it passes it to the browser and saves it to a cache.
    If the network request fails, the last cached response will be used. JD.ID
    applied this strategy to the homepage to ensure that users can access the
    homepage even if they're offline.
+   [**Cache first, falling back to network**](/offline-cookbook/#cache-falling-back-to-network):
    This strategy checks the cache for a response first and uses it if
    available. If not, the JD.ID website goes to the network, caches the
    response, and then passes it to the browser. When the
    [service worker](/service-workers-cache-storage/#service-workers)
    gets installed, it will have the static resources of the homepage, offline
    fallback page (explained below), category page, product page, shopping
    cart, and settlement page cached into the user's
    [cache](/cache-api-quick-guide/) in advance. When the user
    routes to any of these pages, this caching strategy ensures the browser
    gets the static resource files from the cache directly, improving the
    loading speed of these critical pages.
+   [**Network only**](/offline-cookbook/#network-only): This
    strategy forces the response to come from the network only. JD.ID uses this
    strategy for the shopping cart and settlement page because those pages
    require very high data accuracy.

Workbox also enables JD.ID to configure routing rules, the default duration of
request timeouts, the number of responses that can be stored in the cache, and
the duration of how long responses should be cached.

### Offline fallback page

The JD.ID team [created an offline fallback
page](/offline-fallback-page/) to provide users with a consistent
experience and enhance the branding for the website. They also added a [web app
manifest](/add-manifest/) which enables users to easily install
the web app on their mobile device. 

{% Img src="image/admin/bE0afj8wH2XUmZdKH28R.jpg", alt="A screenshot of the offline fallback page", width="800", height="480" %}

### Push notifications

Additionally, for further re-engagement, JD.ID implemented push notifications
with
[Firebase Cloud Messaging for Web](https://firebase.google.com/docs/cloud-messaging/js/client),
applying them specifically during product sale promotional events.

{% Img src="image/admin/aTQmYAWe65pkwoaatfcp.jpg", alt="Screenshots of enabling push notifications", width="800", height="480" %}

## Overall business results

<div class="w-columns">
  <ul>
    <li>Overall mobile conversion rate (mCVR) improved 53%</li>
    <li>mCVR for users who installed the JD.ID PWA improved 200%</li>
    <li>
      Daily active users from mobile platforms increased 26% due to increased
      re-enagement from push notifications
    </li>
  </ul>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6cgF8sQt5IH2XcISQsk.png", alt="The impact statistics.", width="800", height="870", class="w-screenshot" %}
  </figure>
</div>

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    Our business is growing rapidly and we have a deeper focus on improving our
    user experience. We aim to become the most popular and trusted e-commerce
    company by constantly striving to provide services and a variety of products to
    all users and customers in Indonesia. Web performance and PWA are a crucial part
    of our UX and overall strategy and we will continue to invest in these areas.
  </p>
  <cite>Fengxian Liu, Web Engineering Manager, JD.ID</cite>
</blockquote>

Check out the [Scale on web case studies
page](/tags/scale-on-web/) for more success stories from India
and Southeast Asia.