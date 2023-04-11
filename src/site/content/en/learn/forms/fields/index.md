---
title: Form fields in depth
description: >
  Learn about the different form fields you can use, and how to choose the right form element.
authors:
  - michaelscharnagl
date: 2021-11-03
---

## What form fields can I use?

To provide the best possible user experience,
make sure to use the element and element `type` that's most appropriate for the data the user is entering.

### Help users fill in text

To provide users with a form field for inserting text, use the `<input>` element.
It's the best choice for single words and short texts.
For longer text, use the `<textarea>` element.
This allows multiple lines of text,
and makes it easier for the user to see the text they entered, as the element is scrollable and resizable.

{% Aside %}
A `<textarea>` is resizable by default. You can disable the resizing with CSS and the `resize` property: `resize: none`.

However, people may want to see the text they entered all at once.
At least keep the option to resize an `<textarea>` vertically.
Use `resize: vertical` to ensure users can resize vertically but not horizontally.

Learn more about [why disabling resize on `<textarea>` is bad for UX](https://catalin.red/css-resize-none-is-bad-for-ux/).
{% endAside %}

### Ensure users enter data in the correct format

Do you want to help users fill in a telephone number?
Change the `type` attribute to `type="tel"` for the `<input>`.
Users on mobile devices get an adapted on-screen keyboard,
ensuring they can enter the telephone number faster and more easily.

For an email address, use `type="email"`.
Again, an adapted on-screen keyboard is shown.
Use the `required` attribute to make the form field mandatory.
When the form is submitted, the browser checks that the input has a value and that it's valid: in this case,
that it's a well-formatted email address.

Learn more about the different [input types](https://developer.mozilla.org/docs/Web/HTML/Element/input#input_types).
These also provide built-in [validation features](/learn/forms/validation).

### Help users fill in dates

When do you want to start your next trip?
To help users fill in dates, use `type="date"`.
Some browsers show the format as a placeholder such as `yyyy-mm-dd`,
demonstrating how to enter the date.

All modern browsers provide custom interfaces for selecting dates in the form of a date picker.

{% Codepen {
  user: 'web-dot-dev',
  id: '93693a7c2ce3d39ec5aa9088159b0601',
  height: 300
} %}

### Help users select an option

To ensure users can select or unselect one possible option, use `type="checkbox"`.
Do you want to offer multiple options?
Depending on your use case, there are various alternatives.
First, let's look at possible solutions if users should only be able to choose a single option.

You can use multiple `<input>` elements with `type="radio"` and the same `name` value. Users see all options at once, but can only choose one.

{% Codepen {
  user: 'web-dot-dev',
  id: '617e51cdae8adeca641d289da1a3e8a2',
  height: 300
} %}

Another option is to use the `<select>` element.
Users can scroll through a list of available options and choose one.

{% Codepen {
  user: 'web-dot-dev',
  id: '7225931596b7eeafc448ad55d9c980fd',
  height: 300
} %}

For some use cases, such as choosing a range of numbers,
`<input>` of type `range` may be a good option.

{% Codepen {
  user: 'web-dot-dev',
  id: '242b1ec7ea180c4995711ceabd749c59',
  height: 300
} %}

{% Aside %}
You can use the [`accent-color`](/accent-color/) CSS property to change the color of form controls,
including `<input type="range">`.
{% BrowserCompat 'css.properties.accent-color' %}
{% endAside %}

Do you need to offer the ability to select multiple options?
Use a `<select>` element with the `multiple` attribute or multiple `<input>` elements of type `checkbox`.

You may also use an `<input>` in combination with the [`<datalist>`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) element.
This gives you a combination of a text field and a list of `<option>` elements.

{% Aside 'codelab' %}
How would you tackle the selection of multiple items?
Try to implement different versions.
Use a `<select>` element, `<datalist>` element,
[multi-select custom element](https://github.com/samdutton/multi-input), or build something completely different.
{% endAside %}

### Ensure users can fill in different types of data

There are more input types for specific use cases.

There is an `<input>` of type `color` to provide users with a color picker in supported browsers,
and there are various other types as well. To ensure users can enter their password, use `<input>`
with `type="password"`. Every character entered is obscured by an asterisk ("*") or a dot ("•"),
to ensure the password can't be read.

Do you want to include a unique security token in the form data?
Use `<input>` with `type="hidden"`.
The value of an `<input>` of type `hidden` can't be seen or modified by users.

To enable users to upload and submit files, use `<input>` with `type="file"`.

{% Codepen {
  user: 'web-dot-dev',
  id: '74f2d88b9185b8fa880ea5a92f48f690',
  height: 300
} %}

{% Aside %}
An `<input>` of type `file` can also allow multiple uploads at once.
You can also specify which file formats are allowed.

Learn more about [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file).
{% endAside %}

You can also define [custom elements](/more-capable-form-controls/#form-associated-custom-elements) if you have a special use case,
where no built-in element or type is suitable.

## Help users fill out your form

There are many form elements and types, but which one should you choose?

For some use cases, it's straightforward to choose the appropriate element and type,
such as `<input type="date">`. For others, it depends.
For example, you can use multiple `<input>` elements with `type="checkbox"` or a `<select>` element.
Learn more about [choosing between listboxes and dropdown lists](https://www.nngroup.com/articles/listbox-dropdown/).

In general, make sure to
[test your form with real users](/learn/forms/usability-testing) to find the best form element and type.

{% Assessment 'fields' %}

## Resources

- [The `<input>` element](https://developer.mozilla.org/docs/Web/HTML/Element/Input)
- [The `<textarea>` element](https://developer.mozilla.org/docs/Web/HTML/Element/textarea)
- [The `<select>` element](https://developer.mozilla.org/docs/Web/HTML/Element/select)
- [`<input>` types](https://developer.mozilla.org/docs/Web/HTML/Element/input#input_types)
- [Custom form elements](/more-capable-form-controls/#form-associated-custom-elements)
