---
layout: post
title: Background and foreground colors do not have a sufficient contrast ratio
description: |
  Learn how to improve your web page's accessibility by making sure that
  all text has sufficient color contrast.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - color-contrast
---

Text that has a low contrast ratio—that is,
text whose brightness is too close to the background brightness—can be
hard to read.
For example, presenting light gray text on a white background
makes it difficult for users to distinguish the shapes of the characters,
which can reduce reading comprehension and slow down reading speed.

While this issue is particularly challenging for people with low vision,
low-contrast text can negatively affect the reading experience
for all your users.
For example, if you've ever read something on your mobile device outside,
you've probably experienced the need for text with sufficient contrast.

## How the Lighthouse color contrast audit fails

Lighthouse flags text whose background and
foreground colors don't have a sufficiently high contrast ratio:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="Lighthouse audit showing background and foreground colors do not have sufficient contrast ratio", width="800", height="343", class="w-screenshot" %}
</figure>

To evaluate text's color contrast, Lighthouse uses
<a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">success criterion 1.4.3 from WCAG 2.1</a>:
- Text that is 18&nbsp;pt, or 14&nbsp;pt and bold, needs a contrast ratio of 3:1.
- All other text needs a contrast ratio of 4.5:1.

Because of the nature of the audit,
Lighthouse can't check the color contrast of
text superimposed on an image.

{% Aside 'caution' %}
In version 2.1, WCAG expanded its color contrast requirements to
[include user interface elements and images](https://www.w3.org/TR/WCAG21/#non-text-contrast).
Lighthouse doesn't check these elements, but you should do so manually
to ensure your entire site is accessible to people with low vision.
{% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to ensure text has sufficient color contrast

Make sure all text on your page meets the minimum color contrast ratios
<a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">specified by WCAG</a>:
- 3:1 for text that is 18&nbsp;pt, or 14&nbsp;pt and bold
- 4.5:1 for all other text

One way to find a color that will meet contrast requirements
is to use Chrome DevTools' color picker:
1. Right-click (or `Command`-click on Mac) the element you want to check,
   and select **Inspect**.
1. In the **Styles** tab of the **Elements** pane,
   find the `color` value for the element.
1. Click the color thumbnail next to the value.

The color picker tells you whether the element
meets color contrast requirements,
taking font size and weight into account:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="Screenshot of Chrome DevTools color picker with color contrast information highlighted", width="298", height="430", class="w-screenshot" %}
</figure>

You can use the color picker to adjust the color
until its contrast is high enough.
It's easiest to make adjustments in the HSL color format.
Switch to that format by clicking the toggle button on the right of the picker:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="Screenshot of Chrome DevTools color picker with the color format toggle highlighted", width="298", height="430", class="w-screenshot" %}
</figure>

Once you have a passing color value, update your project's CSS.

More complex cases, like text on a gradient or text on an image,
need to be checked manually,
as do UI elements and images.
For text on an image, you can use DevTools' background color picker to check
the background that the text appears on:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="Screenshot of Chrome DevTools background color picker", width="301", height="431", class="w-screenshot" %}
</figure>

For other cases, consider using a tool like the Paciello Group's
<a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser</a>.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/color-contrast.js" rel="noopener">Source code for **Background and foreground colors do not have a sufficient contrast ratio** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">Text elements must have sufficient color contrast against the background (Deque University)</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser</a>
