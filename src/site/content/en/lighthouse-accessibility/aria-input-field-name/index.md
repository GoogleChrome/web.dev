---
layout: post
title: "Not all ARIA input fields have accessible names"
description: |
  Learn how to improve your web page's accessibility by making sure that
  screen reader users can access the names of your input fields.
date: 2019-10-17
web_lighthouse:
  - aria-input-field-name
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

If they don't have inner text,
custom controls must have either the `aria-label` or `aria-labelledby` attribute
to be announced properly by assistive technologies.
These attributes provide [accessible names](/labels-and-text-alternatives)
that you can use to convey the purpose of custom controls.

## How Lighthouse identifies inputs with inaccessible names

[Lighthouse](https://developers.google.com/web/tools/lighthouse)
flags input fields whose names aren't accessible to assistive technologies:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-input-field-name.png"
    alt="Lighthouse audit showing input elements with inaccessible names">
</figure>

Elements that have any of the following ARIA roles
but don't have accessible names will cause this audit to fail:
- [combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)
- [listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)
- [searchbox](https://www.w3.org/TR/wai-aria-1.1/#searchbox)
- [slider](https://www.w3.org/TR/wai-aria-practices-1.1/#slider)
- [spinbutton](https://www.w3.org/TR/wai-aria-practices-1.1/#spinbutton)
- [textbox](https://www.w3.org/TR/wai-aria-1.1/#textbox)

{% Aside 'caution' %}
Many of these input types can be created with native HTML5 elements,
which come with built-in behaviors and accessible semantics
that can be time consuming to replicate.
Consider [using native elements](/semantics-and-screen-readers/#use-semantic-html)
instead of ARIA roles if possible.
{% endAside %}


{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add accessible names to your input fields

The easiest way to provide an accessible name for most elements
is to include text content in the element.
However, custom input fields don't have inner text,
so you can use one of two strategies.

### Option 1: Add an `aria-label` attribute to the element

Use the `aria-label` attribute to define the name for the current element.
For example, this custom combobox will be announced as "country"
to assistive technology users:

```html
<div id="combo1" aria-label="country" role="combobox">England</div>
```

### Option 2: Refer to another element using `aria-labelledby`

Use the `aria-labelledby` attribute to identify another element, using its ID,
to serve as the name for the current element.
For example, the this custom searchbox refers to the `searchLabel` paragraph
as its label and will be announced as "Search currency pairs":

```html
<p id="searchLabel">Search currency pairs:</p>
<div id="pass3"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="pass3Label"></div>
```



## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-input-field-name.js" rel="noopener">Source code for **Not all ARIA input fields have accessible names** audit</a>
- [Labels and text alternatives](/labels-and-text-alternatives)
