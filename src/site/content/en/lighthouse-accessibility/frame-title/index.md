---
title: "`<frame>` or `<iframe>` elements do not have a title"
layout: post
description: |
  Learn how to make sure assistive technologies can announce frame content on
  your web page correctly by giving all frame elements titles.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - frame-title
---

Users of screen readers and other assistive technologies rely on
frame titles to describe the contents of frames.
Navigating through frames and inline frames can quickly become difficult and confusing
for assistive technology users if the frames are not marked
with a title attribute.

## How the Lighthouse frame title audit fails

Lighthouse flags `<frame>` and `<iframe>` elements that don't have titles:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vlHxWKrB3ESjPfmLbuwL.png", alt="Lighthouse audit showing frame or iframe doesn't have a title element", width="800", height="185", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add titles to frames and iframes

Provide unique and descriptive `title` attributes for all `frame` and `iframe` elements.

Additionally, best practice is to give the enclosed document a title element
with content identical to the title attribute.
For example:

```html
<iframe title="My Daily Marathon Tracker" src="https://www.mydailymarathontracker.com/"></iframe>
```

## Tips for creating descriptive frame titles

- As previously mentioned, give the enclosed document a title element with content identical to title attribute.
- Replace placeholder titles such as "untitled frame" with a more appropriate phrase.
- Make each title unique. Don't duplicate titles, even if they are similar.

Learn more in
[Write descriptive titles, descriptions, and link text for every page](/write-descriptive-text).

## Resources

- [Source code for **`<frame>` or `<iframe>` elements do not have a title** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/frame-title.js)
- [Label documents and frames](/labels-and-text-alternatives#label-documents-and-frames)
- [Frames must have title attribute (Deque University)](https://dequeuniversity.com/rules/axe/3.3/frame-title)
