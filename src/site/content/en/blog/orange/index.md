---
title: >
  Orange: New PWA converts 52% better on mobile
subhead: >
  The new PWA also has an average loading time 30% faster than the old site
  and has improved bounce rate 12% and session depth 18%.
description: >
  The new PWA also has an average loading time 30% faster than the old site
  and has improved bounce rate 12% and session depth 18%.
date: 2021-05-11
hero: image/BrQidfK9jaQyIHwdw91aVpkPiib2/Y0EbySRTUBgpnegXvg4K.jpg
thumbnail: image/BrQidfK9jaQyIHwdw91aVpkPiib2/IXZcW61ju9WcwmmTbhZT.jpg
alt: A group of smartphones in a circle.
tags:
  - blog
  - case-study
  - progressive-web-apps
authors:
  - adamskret
  - rafałfilipek
  - marcinsierakowski
---

{% Aside %}
  The authors of this case study are Orange employees and worked on the PWA project.
{% endAside %}

[Orange Polska S.A.](https://www.orange.pl/) (part of the international Orange Group) is a leading
provider of telecommunications services in Poland, including mobile and fixed telecommunications
services such as voice, data, internet access, and television. We also provide IT and integration
services, leased lines, and other telecommunications value-added services and equipment.

{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/lI8AvPzBsobGijMdUH3p.png", alt="Screenshots of the new PWA.", width="800", height="533" %}

## Challenge

We all know that feeling of anxiety that turns into irritation when a website takes forever to load.
For digital companies with little to no physical presence the impact of this is obvious, especially
when it comes to mobile apps where our internal research clearly shows that the single most
important reason for app de-installation is speed. However, if you operate in an established sector
like us with a strong brick-and-mortar strategy for distribution channels, the impact of digital
speed is not as obvious, because digital is not the only source of our sales. This makes it even
more challenging to persuade executives to invest in speed.

When pitching our executives, we made our case stronger by turning to our historical performance
data on Google Analytics to clearly show the correlation between loading time and conversion rates.
With cold, hard facts we were able to show that every additional second of page load time resulted
in 15-20% lower revenue and sales.

<figure>
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/dtZxd66DIrH6QX7Ff9FH.png", alt="Charts that show the correlation between load time and conversions.", width="800", height="366" %}
  <figcaption>
    The top chart (in orange) shows the conversion rate on the old site, segmented by loading
    time. For example, the first bar from the left represents users who experienced a loading time
    of less than 2 seconds. The bar next to it represents users who experienced a loading time of
    between 2 and 3 seconds. The bottom chart (in grey) shows the loading times that all users
    actually experienced on the old site. 
  </figcaption>
</figure>

## Approach

We decided to build a Progressive Web App (PWA). We specifically focused on mobile traffic because
more than 75% of customers use our website through a mobile device. The team focused equally on
improving key performance indicators and delivering a more engaging and attractive experience.

We launched a new cross-functional scrum team (including IT, business, and UX professionals) that
aimed at delivering a proof of concept to answer the following questions:

+   Are we able to effectively reduce loading time while respecting our significant legacy
    limitations?
+   What will be the actual impact on conversion and revenue?

We chose [Next.js](https://nextjs.org/) because of its many optimizations that are either enabled by
default or easy to set up, such as automatic server-side rendering (which is especially important
for our SEO),  data prefetching, and code splitting. Another key consideration for us was that
Next.js enabled us to migrate pages one-by-one without introducing any problems in our legacy
applications. Nevertheless, we had to manage the transformation in a complex environment where we
were still reliant on legacy systems, resulting in service unavailability. To remedy this we have
integrated [Workbox](https://developer.chrome.com/docs/workbox/) so that our website would
always be available even if the backend was down. Workbox also gave us nice performance boosts
thanks to its built-in solutions for precaching, request routing, and runtime caching.

## Results

Our new PWA has an average loading time 30% faster than the old site, our conversion on mobile
devices has increased 52%, our bounce rate has improved 12%, and our session depth has improved 18%.
This experience has confirmed the strategic direction to transform all customer-facing solutions
(including customer self-care and salesman frontends) towards PWA technology.
