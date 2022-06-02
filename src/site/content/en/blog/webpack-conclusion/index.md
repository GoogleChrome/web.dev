---
layout: post
title: Webpack conclusion
subhead: |
  Summing up Webpack
date: 2018-02-08 
updated: 2018-08-17 
authors:
  - iamakulov
description: |
  Summing up Webpack
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Summing up:

* **Cut unnecessary bytes.** Compress everything, strip unused code, be wise when adding
  dependencies
* **Split code by routes.** Load only what’s really necessary right now and lazy-load other stuff
  later
* **Cache code.** Some parts of your app are updated less often than other ones. Separate these
  parts into files so that they are only re-downloaded when necessary
* **Keep track of the size.** Use tools like
  [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard/) and
  [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
  to stay aware how large is your app.
  Take a fresh look at your app’s performance at whole every few months

Webpack is not the only tool that could help you make an app faster. Consider making your
application [a Progressive Web App](/progressive-web-apps/) for even better experience and use
automated profiling tools like [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) to get improvement suggestions.

Don’t forget to read [webpack docs](https://webpack.js.org/guides/) – they have plenty of other
useful information.

And make sure to play [with the training app](https://github.com/GoogleChromeLabs/webpack-training-project)!
