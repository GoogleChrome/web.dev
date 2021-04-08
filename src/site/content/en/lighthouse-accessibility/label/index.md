---
layout: post
title: Form elements do not have associated labels
description: |
  Learn how to make form elements accessible to assistive technology users by
  providing labels.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - label
---

Labels ensure that form controls are announced properly
by assistive technologies like screen readers.
Assistive technology users rely on these labels
to navigate forms.
Mouse and touchscreen users also benefit from labels
because the label text makes a larger click target.

## How this Lighthouse audit fails

Lighthouse flags form elements that don't have associated labels:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="Lighthouse audit showing form elements do not have associated labels", width="800", height="185", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add labels to form elements

There are two ways to associate a label with a form element.
Either place the input element inside a label element:

```html
<label>
  Receive promotional offers?
  <input type="checkbox">
</label>
```

Or use the label's `for` attribute and refer to the element's ID:

```html
<input id="promo" type="checkbox">
<label for="promo">Receive promotional offers?</label>
```

When the checkbox has been labeled correctly,
assistive technologies report that the element has a role of checkbox,
is in a checked state, and is named "Receive promotional offers?"
See also [Label form elements](/labels-and-text-alternatives#label-form-elements).

## Resources

- [Source code for **Form elements do not have associated labels** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/label.js)
- [Form `<input>` elements must have labels (Deque University)](https://dequeuniversity.com/rules/axe/3.3/label)
