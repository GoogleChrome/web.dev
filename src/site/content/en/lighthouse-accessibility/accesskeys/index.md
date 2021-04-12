---
layout: post
title: "`[accesskey]` values are not unique"
description: |
  Learn how to improve your web page's accessibility for keyboard users by
  removing duplicate accesskey values.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - accesskeys
---

Access keys let users quickly [focus](/keyboard-access/#focus-and-the-tab-order)
or activate an element on your page
by pressing the specified key, usually in combination with the `Alt` key
(or `Control+Alt` on Mac).

Duplicating `accesskey` values creates unexpected effects
for users navigating via the keyboard.

{% Aside 'caution' %}
Unless you're building a complex app (for example, a desktop publishing app),
it's generally best to avoid access keys because of their limitations:
- Not all browsers support access keys.
- It's challenging to avoid conflicts with shortcut keys
  across all operating systems and browsers.
- Some access key values may not be present on all keyboards, particularly
  if your app is intended for an international audience.
- If users aren't aware of access keys, they may accidentally activate app
  functionality, causing confusion.
{% endAside %}

## How the Lighthouse access key audit fails

Lighthouse flags pages with duplicate access keys:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mLy4tlasmsksLtgGk79t.png", alt="Lighthouse: Access keys are not unique", width="800", height="206", class="w-screenshot" %}
</figure>

For example, these links both have `g` as their access key:
```html
<a href="google.com" accesskey="g">Link to Google</a>
<a href="github.com" accesskey="g">Link to GitHub</a>
```


{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix duplicate access keys

Evaluate the duplicate `accesskey` values flagged by Lighthouse
and make each `accesskey` value unique.
For example, to fix the example above,
you can change the value for the GitHub link:
```html/1
<a href="google.com" accesskey="g">Link to Google</a>
<a href="github.com" accesskey="h">Link to GitHub</a>
```

For each defined `accesskey`,
make sure the value doesn't conflict with any default browser
or screen reader shortcut keys.

## Resources

- [Source code for **`[accesskey]` values are not unique** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/accesskeys.js)
- [accesskey attribute value must be unique (Deque University)](https://dequeuniversity.com/rules/axe/3.3/accesskeys)
