---
layout: post
title: Konga
date: 2016-05-13
updated: 2016-05-13
tags:
  - blog
  - case-study

---

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/seSymQNOS9N7GIcPjpia.gif", alt="Konga detail.", width="582", height="1000" %}
</figure>

### TL;DR

Konga cuts data usage 92% with new Progressive Web App

### Results

- 92% less data for initial load, vs. native app
- 82% less data to complete first transaction, vs. native app
- 63% less data for initial load, vs. previous mobile web experience
- 84% less data to complete first transaction, vs. previous mobile web experience

[Download PDF Case study](https://storage.googleapis.com/web-dev-uploads/file/T4FyVKpzu4WKF1kBNvXepbi08t52/tqrVtWVeV03xgU23ZsDp.pdf)

## About Konga

Launched in 2012, Konga is a leading e-commerce website in Nigeria, selling
everything from books to fridges to mobile phones. Mobile devices provide the
largest source of traffic and user growth.

## Challenge

Africa is a uniquely mobile continent. Unlike many other parts of the world,
Internet use leapfrogged over desktop to mobile. Poor connectivity, the
prevalence of low-end devices, and several other obstacles hindered Konga’s
ability to grow. They developed a native app, so users on mobile could work
offline and re-engage. The cost of Internet access is still high, however,
while per-capita income is relatively very low. Current and potential
customers are very data-sensitive, and many hesitated to use data or space
to download Konga’s native app. 

## Solution

Konga wanted to provide all of their web users with the benefits of their app,
including performance, the ability to work offline, and re-engage without the
data cost. They built a Progressive Web App to leverage new, open web APIs and
offer a mobile web experience that is fast, uses less data, and re-engages
users in multiple ways. 

With nearly two-thirds of Nigerian users reaching the Internet via 2G
networks, a fast user experience was essential. To decrease load times,
Konga added service workers and streamlined the site to help consumers quickly
reach the products they’re looking for. Users can continue to browse
categories, review previous searches, and even check out by calling to
order—all while offline. 

Tracking data usage to initial load and to complete first transaction were two
key measurements for Konga. Compared with their native app, their Progressive
Web App uses 92% less data for initial load and 82% less data to complete the
first transaction. Also, when compared to their previous mobile website, the
new experience uses 63% less data for initial load and 84% less data to
complete first transaction.

{% Blockquote 'Shola Adekoya, Konga.com CEO.'%}
We estimate that with our new light, super-fast, UX-rich browsing capability,
customers’ data consumption will fall dramatically.
{% endBlockquote %}
