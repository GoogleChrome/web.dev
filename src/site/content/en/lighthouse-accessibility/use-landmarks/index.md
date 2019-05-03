---
layout: post
title: Manually check landmark elements improve navigation
description: |
  Learn about managed-focus audit.
web_lighthouse:
  - managed-focus
---

HTML5 elements such as `main`, `nav`, and `aside` act as landmarks,
or special regions on the page to which a screen reader can jump.
By using landmark elements,
you can dramatically improve the navigation experience on your site
for users of assitive technology.
Learn more in
[HTML 5 and ARIA Landmarks](https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/landmarks.html).

## How to manually test

To check landmark elements improve navigation,
check that each major section of your page is a landmark element:
For example:

```html
<header role="banner">
   <p>Put product name and logo here</p>
</header>
<nav role="navigation">
   <ul>
      <li>Put navigation here</li>
   </ul>
</nav>
<main role="main">
   <p>Put main content here</p>
</main>
<footer role="contentinfo">
   <p>Put copyright, etc. here</p>
</footer>
```

Use [this list of landmark  elements](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html) to check your page.
Click the "Show Landmarks" button to see a structural outline for the page.

## How to fix

Use landmark tags to define major sections of your page,
instead of relying on divs.
Be careful not to go overboard because having too many landmarks can be overwhelming.
For example, stick to just one `main` element instead of 3 or 4.

Learn more in [Headings and landmarks](/headings-and-landmarks).

## More information

- [Check landmark elements improve navigation audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/use-landmarks.js)