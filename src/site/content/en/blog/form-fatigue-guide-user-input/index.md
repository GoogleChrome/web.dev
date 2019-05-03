---
title: "Reduce form fatigue: guide users to proper input"
author: mdiblasio
date: 2019-05-02
description: |
  This post describes how to guide users to enter the proper information into forms.
wf_blink_components: Blink>Accessibility
tags:
  - post
  - accessibility
  - ux
---

<!-- TODO (): update tags -->

_This is post 2 of 5 of the [Reduce form fatigue series](../form-fatigue) that
shows you how to build better forms for online stores._

<!-- TODO (robdodson): is there a format we should use for this line that opens each article?  -->

<!-- TODO (dutton): is there a format we should use for this line that opens each article?  -->

<video autoplay loop muted playsinline>
  <source src="video-typing-on-mobile-is-hard.mp4" type="video/mp4">
</video>

Typing on mobile is hard! In this guide you will learn how to reduce cart abandonment by guiding users
through form-filling:

+   Use labels
+   Provide data format hints
+   Avoid invalid input

## Use labels and hints

Labels clarify the purpose of form elements, increase touch target size (the
user can touch or click either the label or the input element), and improve form
accessibility. 

<figure class="w-figure">
  <img src="image-label.png" alt="label placement" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 1 — Label placement.
  </figcaption>
</figure>

<!-- TODO (meggin): remove this image? -->


Assign a label that _describes a clear and concise purpose_ for each input element using one of the following methods:

+   Implicit labels:

```html
<label>First Name <input type="text"/></label>  
```

+   Explicit labels:

```html
<label for="first">First Name <input type="text" id="first"/></label>  
```

+   `aria-label` attribute:

```html
<button class="hamburger-menu" aria-label="menu">...</button>  
```

+   `aria-labelledby` attribute:

```html
<span id="foo">Select seat:</span>  
<custom-dropdown aria-labelledby="foo"></custom-dropdown>  
```

{% Aside 'note' %}
Labels can only point to a single form control. Use the `aria-labelledby` attribute to associate a single label with multiple form controls for many-to-one relationships.
{% endAside %}

Label text should be aligned with the input line, and always be visible. It can be placed in the middle of a text field, or rest near the top of the container.

<figure class="w-figure">
  <video autoplay loop muted playsinline>
    <source src="video-label-placement.mp4" tfype="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Fig. 2 — Label placement.
  </figcaption>
</figure>

The `placeholder` attribute provides an additional hint to the user about the
expected format or content, typically by displaying the value as light text
until the user starts typing in the element.

<figure class="w-figure">
  <img src="image-placeholder.png" alt="placeholder text for input field" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 2 — Placeholder text.
  </figcaption>
</figure>

```html
<input type="search" placeholder="Find anything home...">
```

<!-- TODO (robdodson): display code above or below figure?  -->
<!-- TODO (meggin): display code above or below figure?  -->

{% Aside 'caution' %}
Don't use the `input` field `value` to set a placeholder as this can break autofill (described below).
{% endAside %}

{% Aside 'warning' %}
Placeholders should not be used instead of labels, as they disappear as soon as users start to type, [can reduce accessibility](https://www.smashingmagazine.com/2018/06/placeholder-attribute/), and can't be automatically translated. If you choose not to display a label for a given input field, hide the `label` element off-screen using CSS so it is still read by screen readers.
{% endAside %}

If hints should remain in view while users type, consider:

+   Using a separate hint element above or below the `input` field:

<figure class="w-figure">
  <img src="image-hint-element.png" alt="field hint element displayed below input field" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 3 — hint element below input.
  </figcaption>
</figure>

{% Aside 'aside' %}
When using helper text in addition to a label, associate the text with the input using the `aria-describedby` attribute:
{% endAside %}

```html
<label for="password">Password</label>
<input type="password" id="password" aria-describedby="newpassHelper">
<p id="newpassHelper" class="input-hint">Your password should be 8-20 characters 
long and include 1 number and 1 special character.</p>
```

+   Adding input masks:

<figure class="w-figure">
  <video autoplay loop muted playsinline>
    <source src="video-input-masking.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Fig. 4 — input masking <a href="https://css-tricks.com/input-masking/">(source)</a>.
  </figcaption>
</figure>

<!-- TODO (robdodson): is ok to use animation from   -->

<div class="w-aside w-aside--note">
  Ensure the contrast ratios of fields and labels are
accessible to all users. Small text should have a contrast ratio of at least
4.5:1 against its background. Large text (at 14-point bold, 18-point regular and
up) should have a contrast ratio of at least 3:1 against its background.
</div>


## Choose the best input type

Checkout forms require a broad range of input types. Users appreciate websites
that automatically present number pads when typing credit cards. To display a
matching keyboard for input fields, set the most appropriate `type` attribute,
or consider creating a custom element for entering a quantity or date. 

Common `type` attributes:

<table>
  <tr>
    <th>
      <strong>type</strong>
    </th>
    <th>
      <strong>Used to enter… </strong>
    </th>
  </tr>
  <tr>
    <td>
      <code>tel</code>
    </td>
    <td>Phone numbers</td>
  </tr>
  <tr>
    <td>
      <code>email</code>
    </td>
    <td>Email addresses</td>
  </tr>
  <tr>
    <td>
      <code>search</code>
    </td>
    <td>Textual search</td>
  </tr>
  <tr>
    <td>
      <code>number</code>
    </td>
    <td>Numeric input (e.g. credit card information)</td>
  </tr>
  <tr>
    <td>
      <code>range</code>
    </td>
    <td>Numeric ranges (e.g. price filters)</td>
  </tr>
  <tr>
    <td>
      <code>date</code>
    </td>
    <td>Date (e.g. birthdate, shipping date)</td>
  </tr>
  <tr>
    <td>
      <code>time</code>
    </td>
    <td>Time
      <br> e.g. delivery time</td>
  </tr>
</table>

For example, display a numeric keyboard when asking users for their credit card
number by assigning `type="number"`:

```html
<!-- use pattern="\d*" to show numeric on iOS -->
<input type="number" pattern="\d*">  
```

<figure class="w-figure">
  <img src="image-input-text.png" alt="no type attribute assigned to input element" style="max-height: 300px;">
  <figcaption class="w-figcaption">
    Fig. 5 — no <code>type</code> attribute assigned.
  </figcaption>
</figure>

{% Compare 'worse' %}
No <code>type</code> attribute assigned to credit card input.
{% endCompare %}

<!-- TODO (mdiblasio): update compare -->

<figure class="w-figure">
  <img src="image-input-numeric.png" alt="type attribute assigned to input element" style="max-height: 300px;">
  <figcaption class="w-figcaption">
    Fig. 6 — <code>type="number"</code>.
  </figcaption>
</figure>

{% Compare 'better' %}
<code>type="number"</code> attribute assigned to credit card input to display a numeric keyboard.
{% endCompare %}

<!-- TODO (mdiblasio): update compare -->

## Next steps

This series of guides will show you how to optimize forms for a variety of
e-commerce conversion flows.

+   [Guide users to proper input](../form-fatigue-guide-user-input)

+   [Reduce the number of fields and steps](../form-fatigue-reduce-number-of-fields)

+   [Validate user input](../form-fatigue-validate-user-input)

+   [Analytics and A/B testing](../form-fatigue-analytics-ab-testing)

## Find out more

+   [Create Amazing Forms](https://developers.google.com/web/fundamentals/design-and-ux/input/forms/)