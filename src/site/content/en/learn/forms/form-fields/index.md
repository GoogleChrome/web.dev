---
title: Help users enter data in forms
description: >
  An overview of the various form elements you can choose from to build your form.
authors:
  - michaelscharnagl
date: 2021-11-03
---

To make a form interactive, you need to add form elements.
There are controls to enter and select data, elements that describe controls,
elements that group fields, and buttons to submit a form.

## What are form elements?

{% Codepen {
  user: 'web-dot-dev',
  id: 'a4a252d5c8511f94c0f56cabd2e73178',
  height: 400,
  tab: 'html,result'
} %}

You see two `<input>` elements, `<input type="text">` and `<input type="file">`. Why do they look different?

Based on the element name and the [type](/learn/forms/form-fields#type) attribute,
browsers show different user interfaces, use different
[validation](/learn/forms/validation) rules,
and provide many other features.
Using the appropriate form control helps you build better forms.

{% Aside %}
The default styles of form controls differ between browsers,
operating systems, and platforms.
You will learn in a later module how to [style forms](/learn/forms/styling) cross-platform.
{% endAside %}

## Labels for form elements

Say you want to add an input where the user can enter their favorite color.
For this, you need to add an [`<input>` element](/learn/forms/form-fields/#input) to your form.
But, how does the user know that they should fill in their favorite color?

To describe form controls, use a `<label>` for each form control.

```html
<label for="color">What is your favorite color?</label>
<input type="text" id="color" name="color">
```

The `for` attribute on the label element matches the `id` attribute on the input.

{% Aside %}
Describe every form control with a `<label>` rather than using some other HTML element.
This makes the form control accessible to screen readers, and provides a bigger target, since you 
can tap or click the label to set focus on the control.

[Click the label](https://codepen.io/web-dot-dev/pen/3ce69644635734a084f45350993f4170) in our demo 
to try this out.
{% endAside %}

## Capturing user input {: #input}

As the name suggests, the `<input>` element is used to gather input from users.

```html
<label for="color">What is your favorite color</label>
<input type="text" id="color" name="color">
```

As mentioned before, the `id` attribute connects the `<input>` to the `<label>`.
What about the name and type attribute in this example?

### The name attribute

Use the `name` attribute to identify the data the user enters with the control.
If you submit the form, this name is included in the request.
Say that you named a form control `mountain` and the user entered `Gutenberg`,
the request includes this information as `mountain=Gutenberg`.

[Try to change](https://codepen.io/web-dot-dev/pen/a9ec1be360c53c5284da27a92fbd7248)
the name of the form control to `hill`.
If you do this correctly, and submit the form, `hill` is visible in the URL.

### The input type {: #type}

There are different
[types of form controls](https://developer.mozilla.org/docs/Web/HTML/Element/input#input_types), all 
with useful built-in features that work across different browsers and platforms. Based on the `type` 
attribute, the browser renders different user interfaces, shows different on-screen keyboards, uses 
different validation rules, and more. Let's see how to change the type.

{% Codepen {
  user: 'web-dot-dev',
  id: '6a3705c993516bb294dbcddb084f0ba4',
  height: 300
} %}

By using `type="checkbox"` the browser now renders a checkbox instead of a text field.
The checkbox also comes with additional attributes.
You can set the `checked` attribute, to show it as checked.

{% Aside %}
The default value for `type` is `text`. This means that if you simply want a text `<input>`, you can 
leave out the `type` attribute.
{% endAside %}

There are various other [types](/learn/forms/fields) you can choose.
We have a detailed look in a later module.

## Allow multiple lines of text

Say, you need a field where a user can write a comment.
For this, wouldn't it be great if they can enter multiple lines of text?
This is the purpose of the `<textarea>` element.

```html
<label for="comment">Comment</label>
<textarea id="comment" name="comment"></textarea>
```

## Pick from a list of options

How do you give users a list of options to select from?
You can use a `<select>` element to achieve this.

{% Aside %}
If you want to enable text input with additional predefined options,
you can also use an `<input>` element together with the 
[datalist element](https://developer.mozilla.org/docs/Web/HTML/Element/datalist).
You can try out datalist examples [here](https://simpl.info/datalist/).
{% endAside %}

```html
<label for="color">Color</label>
<select id="color" name="color">
  <option value="orange">Orange</option>
  <option value="pink">Pink</option>
</select>
```

First, you add a `<select>` element.
As with all other form controls, you connect it to a `<label>` with the `id` attribute
and give it a unique name using the `name` attribute.

In between the start and end tag of the `<select>` element,
you can add multiple `<option>` elements, each representing one selection.

Each option has a unique `value` attribute, so you can tell them apart when processing the form data.
The text inside the option element is the human-readable value.

If you submit the form using this `<select>` without changing the selection,
the request will include `color=orange`. But how does the browser know which option should be used?

The browser uses the first option in the list, unless:
- One `<option>` element has the `selected` attribute.
- The user chooses another option.

{% Codepen {
  user: 'web-dot-dev',
  id: '7225931596b7eeafc448ad55d9c980fd',
  height: 300
} %}

## Pre-select an option

With the `selected` attribute you can pre-select one option.
This becomes the default, regardless of the order in which `<option>` elements are defined.

{% Codepen {
  user: 'web-dot-dev',
  id: '5324a9e3d1c3c695932ee95378b63436',
  height: 300,
  tab: 'html,result'
} %}

## Grouping form controls

Sometimes you need to group form controls. You can use the `<fieldset>` element to do that.

```html
<fieldset>
    <legend>What is your favorite web technology</legend>

    <label for="html">HTML</label>
    <input type="radio" name="webfeature" value="html" id="html">

    <label for="css">CSS</label>
    <input type="radio" name="webfeature" value="css" id="css">
</fieldset>
```
Did you notice the `<legend>` element inside the `<fieldset>` element? What do you think it is used for?

If your answer is "to describe the group of form controls", you're right!

Every `<fieldset>` element requires a `<legend>` element,
just as every form control needs an associated `<label>` element.
The `<legend>` also has to be the very first element in the `<fieldset>`.
After the `<legend>` element, you can define the form controls which should be part of the group.

## Submitting a form

After learning how to add form controls, and group them, you may wonder how a user can submit a form?

The first option is to use a `<button>` element.

```html
<button>Submit</button>
```

After a user clicks the **Submit** button,
the browser makes a request to the URL specified in the `<form>` element's
[action attribute](/learn/forms/form-element#where-is-the-data-processed)
with all data from the form controls.

{% Aside 'warning' %}
Every `<button>` element inside a form works as a **Submit** button by default.

Sometimes you don't want this: for example,
when using a `<button>` to toggle visibility for a password field.
To disable the default **Submit** behavior, you can add `type="button"` to the `<button>`.
This tells the browser that the `<button>` should not submit the form.
{% endAside %}

You can also use an `<input>` element with `type="submit"` instead of a `<button>` element.
The input looks and behaves just like a `<button>`. Instead of using a `<label>` element to describe 
the `<input>`, use the `value` attribute instead.

```html
<input type="submit" value="Submit">
```

In addition, a form can also be submitted by using the `Enter` key when a form field has focus. 

{% Assessment 'form-fields' %}

## Resources

- [The label element](https://developer.mozilla.org/docs/Web/HTML/Element/label)
- [The input element](https://developer.mozilla.org/docs/Web/HTML/Element/input)
- [The textarea element](https://developer.mozilla.org/docs/Web/HTML/Element/textarea)
- [The select element](https://developer.mozilla.org/docs/Web/HTML/Element/select)
- [The fieldset element](https://developer.mozilla.org/docs/Web/HTML/Element/fieldset)
- [The button element](https://developer.mozilla.org/docs/Web/HTML/Element/button)
