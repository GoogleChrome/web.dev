---
layout: post
title: Avoid multiple page redirects
description: |
  Learn why page redirects slow down your web page's load speed and
  how to avoid them.
web_lighthouse:
  - redirects
date: 2019-05-04
updated: 2019-09-19
---

Redirects slow down your page load speed.
When a browser requests a resource that has been redirected,
the server usually returns an HTTP response like this:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

The browser must then make another HTTP request at the new location
to retrieve the resource.
This additional trip across the network can delay the loading
of the resource by hundreds of milliseconds.

## How the Lighthouse multiple redirects audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that have multiple redirects:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt="", width="800", height="276", class="w-screenshot" %}
</figure>

A page fails this audit when it has two or more redirects.

## How to eliminate redirects

Point links to flagged resources
to the resources' current locations.
It's especially important to avoid redirects in resources
required for your [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/).

If you're using redirects to divert mobile users to the mobile version of your page,
consider redesigning your site to use
[Responsive Design](https://developers.google.com/web/fundamentals/design-and-ux/responsive/).

## Stack-specific guidance

### React

If you are using React Router, minimize usage of the `<Redirect>` component for
[route navigations](https://reacttraining.com/react-router/web/api/Redirect).

## Resources

- [Source code for **Avoid multiple page redirects** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/redirects.js)
- [Redirections in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
- [Avoid Landing Page Redirects](https://developers.google.com/speed/docs/insights/AvoidRedirects)
