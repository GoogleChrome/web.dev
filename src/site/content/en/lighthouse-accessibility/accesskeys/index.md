---
layout: post
title: "[accesskey] values are not unique"
description: |
  Learn how to improve your web page's accessibility for keyboard users by
  removing duplicate accesskey values.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - accesskeys
---

Access keys let users quickly focus or activate an element on your page
by pressing the specified key, usually in combination with the `Alt` key
(or `Control+Alt` on Mac).

Duplicating `accesskey` values creates unexpected effects
for users navigating using the keyboard.

## How the Lighthouse access key audit fails

Lighthouse flags pages with duplicate access keys:

<figure class="w-figure">
  <img class="w-screenshot" src="accesskeys.png" alt="Lighthouse: Access keys are not unique">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix duplicate access keys

First identify duplicate `accesskey` values
using the Lighthouse report.
Then make each `accesskey` value unique.

For each defined `accesskey`,
make sure the value doesn't conflict with any default browser
or screen reader shortcut keys.

See Deque University's
[accesskey attribute value must be unique](https://dequeuniversity.com/rules/axe/3.3/accesskeys)
page for more information.

## Resources

- [Source code for **`[accesskey]` values are not unique** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/accesskeys.js)
- [accesskey attribute value must be unique](https://dequeuniversity.com/rules/axe/3.3/accesskeys)
