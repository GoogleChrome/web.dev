---
title: Faster web navigation with predictive prefetching
subhead: Learn about predictive prefetching and how Guess.js implements it.
date: 2019-07-08
hero: image/admin/1jRaJzDtk6w4vYxbqDn3.png
alt: Guess.js logo
authors:
  - mgechev
description: |
  Code splitting allows you to speed up your applications, but it may slow down subsequent navigation. Predictive prefetching is an efficient way to use data analytics to smartly prefetch what the user is likely to use next, optimizing network utilization.
tags:
  - blog
  - performance
feedback:
  - api
---

In my [Faster Web Navigation with Predictive Prefetching](https://www.youtube.com/watch?v=0jB4YWgAxUo) session at Google I/O 2019, I began by talking about optimizing web apps with code splitting and the potential performance implications for subsequent page navigation. In the second part of the talk, I discussed how to improve navigation speed by using Guess.js to set up predictive prefetching:

{% YouTube '0jB4YWgAxUo' %}

## Code splitting for faster web apps

Web apps are slow, and JavaScript is among the most expensive resources that you ship. Waiting for a slow web app to load can frustrate your users and decrease conversions.

{% Img src="image/admin/Ex1RhD84fTzpNwYM6Ocy.png", alt="Slow web apps are stressful.", width="800", height="438" %}

Lazy-loading is an efficient technique to reduce the bytes of JavaScript that you're transferring over the wire. You can use several techniques to lazy-load JavaScript, including:

- Component-level code splitting
- Route-level code splitting

With component-level code splitting, you can move individual components into separate JavaScript chunks. On particular events, you can load the relevant scripts and render the components.

With route-level code splitting, however, you move entire _routes_ into independent chunks. When users transition from one route to another, they have to download the associated JavaScript and bootstrap the requested page. These operations can lead to significant delays, especially on slow networks.

## Prefetching JavaScript

Prefetching allows the browser to download and cache resources that the user is likely to need soon. The usual method is to use `<link rel="prefetch">`, but there are two common pitfalls:

- Prefetching too many resources (_overfetching_) consumes a lot of data.
- Some resources the user needs may never be prefetched.

Predictive prefetching solves these problems by using a report of users' navigational patterns to determine what assets to prefetch.

{% Img src="image/admin/vkK5KhZKhSo6bDIBuVrn.png", alt="Prefetching example", width="800", height="517" %}

## Predictive prefetching with Guess.js

[Guess.js](https://github.com/guess-js) is a JavaScript library that provides predictive prefetching functionality. Guess.js consumes a report from Google Analytics or another analytics provider to build a predictive model that can be used to smartly prefetch only what the user is likely to need.

Guess.js has integrations with [Angular](https://angular.io), [Next.js](https://nextjs.org/), [Nuxt.js](https://nuxtjs.org/), and [Gatsby](https://www.gatsbyjs.org/). To use it in your application, add these lines to your webpack configuration to specify a [Google Analytics view ID](https://stackoverflow.com/questions/36898103/what-is-a-viewid-in-google-analytics):

```js/0,5
const { GuessPlugin } = require('guess-webpack');

// ...
plugins: [
   // ...
   new GuessPlugin({ GA: 'XXXXXX' })
]
// ...
```

If you're not using Google Analytics, you can specify a `reportProvider` and download data from your favorite service.

### Integration with frameworks

To learn more about how to integrate Guess.js with your favorite framework check out these resources:

- [Using Guess.js with Angular](https://guess-js.github.io/docs/angular)
- [Using Guess.js with Next.js](https://guess-js.github.io/docs/next)
- [Using Guess.js with Nuxt.js](https://guess-js.github.io/docs/nuxt)

For a quick walkthrough on the integration with Angular, check out this video:

{% YouTube '5FRxQiGqqmM' %}

### How does Guess.js work?

Here's how Guess.js implements predictive prefetching:

1. It first extracts data for the user navigational patterns from your favorite analytics provider.
1. It then maps the URLs from the report to the JavaScript chunks produced by webpack.
1. Based on the extracted data, it creates a simple predictive model of which pages a user is likely to navigate to from any given page.
1. It invokes the model for each JavaScript chunk, predicting the other chunks that are likely to be needed next.
1. It adds prefetching instructions to each chunk.

When Guess.js is done, each chunk will contain prefetching instructions similar to:

```js
__GUESS__.p(
  ['a.js', 0.2],
  ['b.js', 0.8]
)
```

This Guess.js-generated code is telling the browser to consider prefetching chunk `a.js` with probability `0.2` and chunk `b.js` with probability `0.8`.

Once the browser executes the code, Guess.js will check the user's connection speed. If it's sufficient, Guess.js will insert two `<link rel="prefetch">` tags in the header of the page, one for each chunk. If the user is on a high-speed network, Guess.js will prefetch both chunks. If the user has a poor network connection, Guess.js will only prefetch chunk `b.js` since it has a high probability of being needed.

## Learn more

To learn more about Guess.js, check out these resources:

- [Faster Web Navigation with Predictive Prefetching](https://www.youtube.com/watch?v=0jB4YWgAxUo)
- [Introducing Guess.js - a toolkit for enabling data-driven user-experiences on the Web](https://blog.mgechev.com/2018/05/09/introducing-guess-js-data-driven-user-experiences-web/)
- [Documentation](https://guess-js.github.io)
- [Source code](https://github.com/guess-js)
