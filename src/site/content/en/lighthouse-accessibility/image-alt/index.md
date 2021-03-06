---
layout: post
title: "Image elements do not have `[alt]` attributes"
description: |
  Learn how to make sure assistive technology users can access your web page's
  images by providing alternative text.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - image-alt
---

Informative elements should aim for short, descriptive alternate text.
Decorative elements can be ignored with an empty alt attribute.

## How the Lighthouse image alternative text audit fails

Lighthouse flags `<img>` elements that don't have `alt` attributes:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="Lighthouse audit showing <img> elements do not have alt attributes", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add alternative text to images

Provide an `alt` attribute for every `<img>` element.
If the image fails to load,
the `alt` text is used as a placeholder
so users have a sense of what the image was trying to convey.
(See also
[Include text alternatives for images and objects](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects).)

Most images should have short, descriptive text:

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

If the image acts as decoration and does not provide any useful content,
give it an empty `alt=""` attribute to remove it from the accessibility tree:

```html
<img src="background.png" alt="">
```

{% Aside 'note' %}
You can also use ARIA labels to describe your images, for example,
`<img aria-label="Audits set-up in Chrome DevTools" src="...">`
See also
[Using the aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) and
[Using the aria-labelledby attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute).
{% endAside %}

## Tips for writing effective `alt` text

- `alt` text should give the intent, purpose, and meaning of the image.
- Blind users should get as much information from alt text as a sighted user gets from the image.
- Avoid non-specific words like "chart", "image", or "diagram".

Learn more in
[WebAIM's guide to Alternative Text](https://webaim.org/techniques/alttext/).

## Resources

- [Source code for **Image elements do not have `[alt]` attributes** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/image-alt.js)
- [Images must have alternate text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
