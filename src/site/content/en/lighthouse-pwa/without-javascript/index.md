---
layout: post
title: Does not provide fallback content when JavaScript is not available
description: |
  Learn how to make sure users can view at least some content on your web page
  when JavaScript isn't available.
web_lighthouse:
  - without-javascript
date: 2019-05-04
updated: 2019-09-19
---

[Progressive Enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement)
is a web development strategy that ensures that your site is accessible to the
largest possible audience. The core principle is that
basic content and page functionality should rely on
only the most fundamental web technologies.
Enhanced experiences, such as sophisticated
styling using CSS or interactivity using JavaScript, can be layered on top for
browsers that support those technologies. But basic content and page
functionality should not rely on CSS or JavaScript.

## How the Lighthouse fallback content audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't contain _some_ content
when JavaScript is unavailable:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/durRW9Bh687rjFAIgF7P.png", alt="Lighthouse audit showing page doesn't contain some content when JS is unavailable", width="800", height="120", class="w-screenshot" %}
</figure>

Lighthouse disables JavaScript on the page and then inspects the page's HTML. If
the HTML is empty, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to ensure your page has content without JavaScript

Progressive enhancement is a large and contentious topic. One camp says that,
in order to adhere to the strategy of progressive enhancement, pages should
be layered so that basic content and page functionality only require HTML.
See Smashing Magazine's
[Progressive Enhancement: What It Is, And How To Use It](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/)
for an example of this approach.

Another camp believes that this strict approach is unfeasible or unnecessary
for many modern, large-scale web applications and suggests using inline
critical-path CSS in the document `<head>` for absolutely critical page styles.

Given these considerations, this Lighthouse audit performs a simple check to
ensure that your page isn't blank when JavaScript is disabled. How strictly your
app adheres to progressive enhancement is a topic of debate, but there's
widespread agreement that all pages should display at least *some* information
when JavaScript is disabled, even if the content is just an alert to the user
that JavaScript is required to use the page.

For pages that absolutely must rely on JavaScript, one approach is to use a
[`<noscript>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
element to alert the user that JavaScript is required for the page. This is
better than a blank page because the blank page leaves users uncertain
about whether there's a problem with the page, their browsers, or their
computers.

To see how your site looks and performs when JavaScript is disabled, use
Chrome DevTools' [Disable JavaScript](https://developers.google.com/web/tools/chrome-devtools/javascript/disable) feature.

## Resources

- [Source code for **Does not provide fallback content when JavaScript is not available** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/without-javascript.js)
- [Progressive Enhancement: What It Is, And How To Use It](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/)
- [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
- [Disable JavaScript With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/javascript/disable)
