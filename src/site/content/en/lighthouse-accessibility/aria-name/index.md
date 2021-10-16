---
layout: post
title: "ARIA items do not have accessible names"
description: |
  Learn how to improve your web page's accessibility by making sure that
  assistive technology users can access the names of ARIA items.
date: 2020-12-08
web_lighthouse:
  - aria-command-name
  - aria-input-field-name
  - aria-meter-name
  - aria-progressbar-name
  - aria-toggle-field-name
  - aria-tooltip-name
  - aria-treeitem-name
tags:
  - accessibility
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

## How Lighthouse identifies ARIA items without accessible names

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags custom ARIA items whose names
aren't accessible to assistive technologies:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dnruhkr4IKtq0Pi9Pgny.png", alt="Lighthouse audit showing custom toggle elements without accessible names", width="800", height="259", class="w-screenshot" %}
</figure>

There are 7 audits that check for accessible names, each one covers a different
set of [ARIA roles](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex). Elements
that have any of the following ARIA roles but don't have accessible names will cause this audit to fail:

| Audit name | ARIA roles |
| ---------- | --------- |
| `aria-command-name` | `button`, `link`, `menuitem` |
| `aria-input-field-name` | `combobox`, `listbox`, `searchbox`, `slider`, `spinbutton`, `textbox` |
| `aria-meter-name` | `meter` |
| `aria-progressbar-name` | `progressbar` |
| `aria-toggle-field-name` | `checkbox`, `menu`, `menuitemcheckbox`, `menuitemradio`, `radio`, `radiogroup`, `switch` |
| `aria-tooltip-name` | `tooltip` |
| `aria-treeitem-name` | `treeitem` |

{% include 'content/lighthouse-accessibility/use-built-in.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Example 1: How to add accessible names to your custom ARIA toggle fields

### Option 1: Add inner text to the element

The easiest way to provide an accessible name for most elements
is to include text content inside the element.

For example, this custom checkbox will be announced as "Newspaper"
to assistive technology users:

```html
<div id="checkbox1" role="checkbox">Newspaper</div>
```

Using the [clip pattern](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/) you can hide the inner text on screen, but still have it announced by assistive technology. This can be especially handy if you translate your pages for localization.

```html
<a href="/accessible">Learn more <span class="visually-hidden">about accessibility on web.dev</span></a>
```

### Option 2: Add an `aria-label` attribute to the element

If you can't add inner text—for example, if you don't want
the element's name to be visible—use
the `aria-label` attribute.

This custom switch will be announced as "Toggle blue light"
to assistive technology users:

```html
<div id="switch1"
    role="switch"
    aria-checked="true"
    aria-label="Toggle blue light">
    <span>off</span>
    <span>on</span>
</div>
```

### Option 3: Refer to another element using `aria-labelledby`

Use the `aria-labelledby` attribute to identify another element, using its ID,
to serve as the name for the current element.

For example, this custom menu radio button refers to the `menuitem1Label` paragraph
as its label and will be announced as "Sans-serif":

```html
<p id="menuitem1Label">Sans-serif</p>
<ul role="menu">
    <li id="menuitem1"
        role="menuitemradio"
        aria-labelledby="menuitem1Label"
        aria-checked="true"></li>
</ul>
```

## Example 2: How to add accessible names to your custom ARIA input fields

The easiest way to provide an accessible name for most elements
is to include text content in the element.
However, custom input fields typically don't have inner text,
so you can use one of the following strategies instead.

### Option 1: Add an `aria-label` attribute to the element

Use the `aria-label` attribute to define the name for the current element.

For example, this custom combobox will be announced as "country"
to assistive technology users:

```html
<div id="combo1" aria-label="country" role="combobox"></div>
```

### Option 2: Refer to another element using `aria-labelledby`

Use the `aria-labelledby` attribute to identify another element, using its ID,
to serve as the name for the current element.

For example, this custom searchbox refers to the `searchLabel` paragraph
as its label and will be announced as "Search currency pairs":

```html
<p id="searchLabel">Search currency pairs:</p>
<div id="search"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="searchLabel"></div>
```

## Resources

- [Source code for **Not all ARIA toggle fields have accessible names** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-toggle-field-name.js)
- [ARIA button, link, and menuitem must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-command-name)
- [ARIA input fields must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-input-field-name)
- [ARIA meter must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-meter-name)
- [ARIA progressbar must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-progressbar-name)
- [ARIA toggle fields have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-toggle-field-label)
- [ARIA tooltip must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-tooltip-name)
- [ARIA treeitem must have an accessible name (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-treeitem-name)
- [Labels and text alternatives](/labels-and-text-alternatives)
- [Use semantic HTML for easy keyboard wins](/use-semantic-html)
