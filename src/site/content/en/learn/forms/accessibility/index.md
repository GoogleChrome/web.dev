---
title: Accessibility
description: >
  How to build inclusive forms.
authors:
  - michaelscharnagl
date: 2021-09-17
---

The form you build is for people.
People use different devices.
Some use a mouse, some a touch device, some the keyboard,
some a device controlled by eye movements.
Some use a screen reader, some a small screen, some use text enlargement software.
Everybody wants to use your form. Learn how to make your form accessible and usable for everyone.

## Ensure users understand the purpose of a form field

There are many [form controls](/learn/forms/form-fields) you can choose from.
What do they all have in common?
Every form control must have an associated `<label>` element.
The `<label>` element describes the purpose of a form control.
The `<label>` text is visually associated with the form control, and read out by screen readers.

In addition, tapping or clicking the `<label>` focuses the associated form control,
making it a larger target.

{% Aside %}
Try this, the next time you add a form control,
add the `<label>` first. Think about the purpose of the form control,
and describe the purpose to the user. Make it easy for people to fill in the needed data.
{% endAside %}

## Use meaningful HTML to access built-in browser features

In theory, you could build a form using only `<div>` elements.
You can even make it look like a native `<form>`.
What's the problem with using
[non-semantic](https://developer.mozilla.org/docs/Glossary/Semantics) elements?

Built-in form elements provide a lot of built-in features. Let's have a look at an example.

{% Codepen {
  user: 'web-dot-dev',
  id: '2f56a723b5045ea990d38c2c170c3037',
  height: 450
} %}

Visually, the `<input>` (the first one in the example) and the `<div>` look the same.
You can even insert text for both, as the `<div>` has a
[`contenteditable`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contenteditable) attribute.
There are lots of differences, though, between using an appropriate element (`<input>`), and a `<div>` looking like an `<input>`.

A screen reader user doesn't recognize the `<div>` as an input element,
and isn't able to complete the form.
All the screen reader user hears is 'Name',
with no indication that the element is a form control for adding text.

Clicking on `<div>Name</div>` doesn't focus the other `<div>`,
even though both are connected the same way as the `<label>` and the `<input>`,
using the `for` and `id` attribute.

After submitting the form, the data entered in the `<div>` isn't included in the request.
While attaching the data with JavaScript is possible,
an `<input>` does that by default.

Built-in form elements have other features.
For example, with appropriate form elements and the correct `inputmode` or `type`,
a virtual keyboard shows all needed characters at a first glance.
Using the `inputmode` attribute on a `<div>` cannot do that.

## Ensure users are aware of the expected data format

You can define various validation rules for a form control.
For example, say a form field should always have at least eight characters.
You use the `minlength` attribute, indicating the validation rule to browsers.
How can you ensure users also know about the validation rule? Tell them.

{% Codepen {
  user: 'web-dot-dev',
  id: 'b03a4c83688c1b02ab12f9873f1f6614',
  height: 350
} %}

Add information about the expected format directly beneath the form control.
To make it clear for assistive devices,
use the `aria-describedby` attribute on the form control,
and an `id` on the error message with the same value, to connect both.

## Help users find the error message for a form control

In a previous module about [validation](/learn/forms/validation),
you learned how to show error messages in case of invalid entry.

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" required>
```

For example, if the entered data is invalid,
the `required` attribute shows an error message next to the form control.
Screen readers also announce the error message.

You can also define your own error message:

{% Codepen {
  user: 'web-dot-dev',
  id: 'b7ed22a0539f9beef4dc03380f51f224',
  height: 300
} %}

This example needs more changes to connect the error message to the form control.
First, use the `aria-describedby`
attribute on the form control that matches the `id` on the error message element.
Next, use [`aria-live="assertive"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) for the error message.
ARIA live regions announce an error to screen reader users the moment the error is shown.

## Ensure users recognize errors

Sometimes designers color the invalid state red,
using the `:invalid` pseudo-class.
However, to communicate an error or success,
you should never rely only on color.
For people with red-green color blindness,
a green and a red border look almost the same.
It's impossible to see if the message is related to an error.

In addition to color, use an icon, or prefix your error messages with the error type.

```html
<span class="error">
  <strong>Error:</strong>Please use at least eight characters.
</span>
```

## Help users to navigate your form

You can change the visual order of form controls with CSS.
A disconnect between visual order and keyboard navigation (DOM order)
is problematic for screen reader and keyboard users.

Learn more about how to ensure
[visual order on the page follows DOM order](/visual-order-follows-dom/).

## Help users to identify the currently focused form control

Use your keyboard to navigate through
[this form](https://codepen.io/web-dot-dev/pen/c4ab903b77cdfc05dac4707fca69b997).
Did you recognize that the styling of the form controls changed once they were active?
This is the default focus style.
You can override it with the
[`:focus`](https://developer.mozilla.org/docs/Web/CSS/:focus) CSS pseudo-class.
Whatever styles you use inside `:focus`,
always make sure the visual difference between the default state and the focus state is recognizable.

Learn more about
[designing focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/).

## Ensure your form is usable

You can identify many common issues by filling out your form with different devices.
Use only your keyboard, use a screen reader (such as
[NVDA](https://www.nvaccess.org/) on Windows or
[VoiceOver](https://en.wikipedia.org/wiki/VoiceOver) on Mac),
or zoom the page to 200%.
Always test your forms,
especially with devices or settings you don't use every day.
Do you know someone using a screen reader,
or someone using text enlargement software? Ask them to fill out your form.
Accessibility reviews are great, testing with real users is even better.

Learn more about doing an
[accessibility review](https://developers.google.com/web/fundamentals/accessibility/how-to-review)
and how to [test with real users](/learn/forms/test/usability).

## Resources

- [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms)
- [WCAG: autocomplete accessibility benefits](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)
- [Focus Indicators](https://www.sarasoueidan.com/blog/focus-indicators/)
