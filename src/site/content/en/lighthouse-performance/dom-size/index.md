---
layout: post
title: Avoid an excessive DOM size
description: |
  Learn how a large DOM can reduce your web page's performance and how you
  can reduce the size of your DOM at load time.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - dom-size
tags:
  - memory
---

A large DOM tree can slow down your page performance in multiple ways:

- **Network efficiency and load performance**

  A large DOM tree often includes many nodes that aren't visible when the user
  first loads the page, which unnecessarily increases data costs for your users
  and slows down load time.

- **Runtime performance**

  As users and scripts interact with your page,
  the browser must constantly
  [recompute the position and styling of nodes](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli).
  A large DOM tree in combination with complicated style rules can severely slow down rendering.

- **Memory performance**

  If your JavaScript uses general query selectors such as `document.querySelectorAll('li')`,
  you may be unknowingly storing references to a very large number of nodes,
  which can overwhelm the memory capabilities of your users' devices.

## How the Lighthouse DOM size audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
reports the total DOM elements for a page, the page's maximum DOM depth,
and its maximum child elements:
<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="A screenshot of the Lighthouse Avoids an excessive DOM size audit", width="800", height="363", class="w-screenshot" %}
</figure>

Lighthouse flags pages with DOM trees that:

- Have more than 1,500&nbsp;nodes total.
- Have a depth greater than 32&nbsp;nodes.
- Have a parent node with more than 60&nbsp;child nodes.

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to optimize the DOM size

In general, look for ways to create DOM nodes only when needed,
and destroy nodes when they're no longer needed.

If you're currently shipping a large DOM tree,
try loading your page and manually noting which nodes are displayed.
Perhaps you can remove the undisplayed nodes from the initially loaded document
and only create them after a relevant user interaction,
such as a scroll or a button click.

If you create DOM nodes at runtime,
[Subtree Modification DOM Change Breakpoints](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints#dom)
can help you pinpoint when nodes get created.

If you can't avoid a large DOM tree,
another approach for improving rendering performance is simplifying your CSS selectors.
See Google's [Reduce the Scope and Complexity of Style Calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
for more information.

## Stack-specific guidance

### Angular

If you're rendering large lists, use [virtual scrolling](/virtualize-lists-with-angular-cdk/)
with the Component Dev Kit (CDK).

### React

* Use a "windowing" library like
  [`react-window`](/virtualize-long-lists-react-window/) to minimize the number
  of DOM nodes created if you are rendering many repeated elements on the page.
* Minimize unnecessary re-renders using
  [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action),
  [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent),
  or [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo).
* [Skip effects](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)
  only until certain dependencies have changed if you are using the `Effect`
  hook to improve runtime performance.

## Resources

- [Source code for **Avoid an excessive DOM size** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/dom-size.js)
- [Reduce the Scope and Complexity of Style Calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
