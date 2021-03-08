---
layout: post
title: "`<input type=\"image\">` elements do not have `[alt]` text"
description: |
  Learn how to make sure assistive technology users can access your web page's
  image inputs by providing alternative text.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - input-image-alt
---

When an image is being used as an `<input>` button,
providing alternative text helps users of screen readers and other
assistive technologies understand the purpose of the button.

## How this Lighthouse audit fails

Lighthouse flags `<input type="image">` elements that don't have `alt` text:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3uac0DpUpqJCobLSo2Cy.png", alt="Lighthouse audit showing input types with a value of 'image' do not have alt attributes", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add alternative text to image inputs

Provide an `alt` attribute for every `<input type="image">` element.
Describe the action that occurs when the user clicks on the button
in the `alt` text:

```html
<form>
  <label>
    Username:
    <input type="text">
  </label>
  <input type="image" alt="Sign in" src="./sign-in-button.png">
</form>
```

See the [Include text alternatives for images and objects](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects) post for more information.

{% Aside 'note' %}
You can also use ARIA labels to describe your image buttons.

For example:
`<input type="image" aria-label="Sign in">`

See also
[Using the aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) and
[Using the aria-labelledby attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute).
{% endAside %}

## Tips for writing effective `alt` text

- As previously mentioned, describe the action that occurs when the user clicks on the button.
- `alt` text should give the intent, purpose, and meaning of the image.
- Blind users should get as much information from alt text as a sighted user gets from the image.
- Avoid non-specific words like "chart", "image", or "diagram".

Learn more in
[WebAIM's guide to Alternative Text](https://webaim.org/techniques/alttext/).

## Resources

- [Source code for **`<input type="image">` elements do not have `[alt]` text** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/input-image-alt.js)
- [Image buttons must have alternate text (Deque University)](https://dequeuniversity.com/rules/axe/3.3/input-image-alt)
