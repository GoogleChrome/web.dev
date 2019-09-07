---
layout: post
title: Manually check that headings don't skip levels
description: |
  Learn about heading-levels audit.
date: 2019-05-02
web_lighthouse:
  - heading-levels
---

Screen readers users often navigate an unfamiliar page by exploring headings.
By using the correct headings,
you can dramatically improve the navigation experience on your site
for users of assitive technology.

## How to manually test

To check headings don't skip levels,
make sure all headings follow a logical, numerical order.
For example:

```html
<h1>Company name</h1>
<section>
  <h2>Section Heading</h2>
  …
  <h3>Sub-section Heading</h3>
</section>
```

Use [this list of landmark elements](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html) to check your page.
Click the "Show Headings" button to see a structural outline for the page.

<!--
***Todo*** Talk to Rob about "Headings don't skip" mention in his web.dev guide.
It seems to imply in the guide that this audit will fail.
But it's a manual audit, I think, so no failure will occur.
Good to confirm this though!
-->
## How to fix

Use headings to create a structural outline for your page.
Create a skeleton or scaffold of the page
such that anyone navigating by headings can form a mental picture.

Don't skip heading levels.
Look out for an `<h1>` heading followed by an `<h3>` heading.
It is an anti-pattern to skip heading levels to use the browser's default heading styles.
Fix any skipped heading levels and use your own CSS for styling.

Learn more in [Headings and landmarks](/headings-and-landmarks).

## More information

- [Check headings don't skip levels audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/heading-levels.js)