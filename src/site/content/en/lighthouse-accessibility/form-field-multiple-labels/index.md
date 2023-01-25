---
layout: post
title: "Form fields have multiple labels"
description: |
  Learn how to make sure assistive technologies announce your web page's form
  fields correctly by ensuring that each field has only one label.
web_lighthouse:
  - form-field-multiple-labels
date: 2019-10-17
---

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

`<label>` elements are a common way to assign names to controls.
If you unintentionally associate multiple labels with a single control,
you'll create inconsistent behavior across browsers and assistive technologies:
some will read the first label, some will read the last label,
and others will read both labels.

## How the Lighthouse multiple label audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags form elements that have more than one label:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/XO2Y33NoSzSis8zNH8kv.png", alt="Lighthouse audit showing form elements with multiple labels", width="800", height="259", class="w-screenshot" %}
</figure>

There are several common scenarios that cause this audit to fail:

- Explicitly associating more than one `<label>` element
  with a form element using the `for` attribute. For example:

  ```html
  <label for="checkbox1">Label one</label>
  <label for="checkbox1">Label two</label>
  <input type="checkbox" id="checkbox1" />
  ```

- Implicitly associating one `<label>` element with a form element
  and explicitly associating another using the `for` attribute. For example:

  ```html
  <label for="checkbox1">Label one</label>
  <label>Label two
    <input type="checkbox" id="checkbox1" />
  </label>
  ```

- Associating one `<label>` element with a form element
  and associating another element using the `aria-labelledby` attribute.
  For example:

  ```html
  <label for="checkbox1">Label one</label>
  <p id="checkbox1_label">Label two</p>
  <input type="checkbox" id="checkbox1" aria-labelledby="checkbox1_label" />
  ```

- Having nested `<label>` elements. For example:

  ```html
  <label>Label one
    <label>Label two
      <input type="checkbox" id="checkbox1" />
    </label>
  </label>
  ```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to remove duplicate form labels

Make sure that each form element on your page has no more than one label.
Labels can be assigned in three ways:
- Implicitly, by making the `<label>` element a parent of the form element:

  ```html
  <label>Label for checkbox
    <input type="checkbox" id="checkbox1" />
  </label>
  ```

- Explicitly, by associating a `<label>` element with the form element
  using the `for` attribute:

  ```html
  <label for="checkbox1">Label for checkbox</label>
  <input type="checkbox" id="checkbox1" />
  ```

- Using the `aria-labelledby` attribute to associate the form element
  with a separate element using its ID:

  ```html
  <p id="checkbox1_label">Label for checkbox</p>
  <input type="checkbox" id="checkbox1" aria-labelledby="checkbox1_label" />
  ```

Verify that you're using only one of these techniques for each form element.

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/form-field-multiple-labels.js" rel="noopener">Source code for **Form fields have multiple labels** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/form-field-multiple-labels" rel="noopener">Form fields do not have duplicate labels (Deque University)</a>
