---
title: The form element in depth
description: >
  Learn all about the form element, when you should use a form, and how a form works in detail.
authors:
  - michaelscharnagl
date: 2021-11-03
---

In a previous module, you learned [how to use the `<form>` element](/learn/forms/form-element).
In this module, you learn how a form works, and when to use a form.

## Should you use a `<form>` element?
{% BrowserCompat 'html.elements.input' %}

You don't always need to put form controls in a `<form>` element.
For example, you might provide a `<select>` element for users to choose a product category.
You don't need a `<form>` element here, as you're not storing or processing data on your backend.

However, in most cases when you store or process data from users,
you should use the `<form>` element.
As you will learn in this module, using a `<form>` gives you a lot of built-in functionality from browsers that you would otherwise have to build yourself.
A `<form>` also has many accessibility features built-in by default.
If you want to avoid a page reload when a user submits a form,
you can still use the `<form>` element, but enhance it with
[JavaScript](/learn/forms/javascript#ensure-users-can-submit-a-form-without-leaving-a-page).

{% Aside %}
It's possible to replicate form functionality with JavaScript, but a purely script-based approach is
unlikely to be as robust, accessible and future-proof as a built-in `<form>`.

Find out [why not everybody has JavaScript](https://kryogenix.org/code/browser/everyonehasjs.html).
{% endAside %}

## How does a `<form>` work?

You learned that a `<form>` is the best way to handle user data.
You may wonder now, how does a form work?

The `<form>` is a container for interactive form controls.

```html
<form method="post">
  <label for="name">Name</label>
  <input type="text" name="name" id="name">
  <button formaction="/name">Save</button>
</form>
```

## How does form submission work?

When you submit a `<form>`, the browser checks the `<form>` attributes. The data is sent as a `GET`
  or `POST` request according to the `method` attribute. If no `method` attribute is present, a
  `GET` request is made to the URL of the current page.

How can you access and process the form data?
The submitted data can be handled by JavaScript on the frontend using a `GET` request,
or by code on the backend using a `GET` or `POST` request.
Learn more about
[request types and transferring form data](/learn/forms/form-element/#where-is-the-data-processed).

{% Aside %}
The **Submit** button may have a `formmethod` attribute.
If this is the case, the value defined there is used.
{% endAside %}

When the form is submitted, the browser makes a request to the URL that is the value of the `action` attribute.
In addition, the browser checks if the **Submit** button has a `formaction` attribute.
If this is the case, the URL defined there is used.

Furthermore, the browser looks up additional attributes on the `<form>` element,
for example, to decide if the form should be validated (`novalidate`),
autocomplete should be used (`autocomplete="off"`) or what encoding should be used (`accept-charset`).

[Try to build a form](https://codepen.io/web-dot-dev/pen/c7d89671f738240187a86cda1074d554) where users can submit their favorite color.
The data should be sent as a `POST` request, and the URL where the data will be processed should be `/color`.

{% Details %}
{% DetailsSummary 'h3' %} Show form {% endDetailsSummary %}
One possible solution is using this form:

```html
<form method="post" action="/color">
    <label for="color">What is your favorite color?</label>
    <input type="text" name="color" id="color">
    <button>Save</button>
</form>
```

{% endDetails %}

## Ensure users can submit your form

There are two ways to submit a form.
You can click the **Submit** button, or press `Enter` while using any form control.

{% Aside %}
Use an actionable name for your **Submit** button,
for example, 'Proceed to Payment' or 'Save Changes', rather than just 'Submit'.

Don't disable the **Submit** button while still awaiting valid user input,
but consider disabling it once the form has been submitted,
preventing multiple requests to your server.

Learn more about [Submit button best practices](/payment-and-address-form-best-practices/#html-button).
{% endAside %}

You can add a **Submit** button in various ways.
One option is to use a `<button>` element inside your form.
As long as you don't use `type="button"` it works as a **Submit** button.
Another option is to use `<input type="submit" value="Submit">`.

{% Aside %}
You can use the [`enterkeyhint`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/enterkeyhint)
attribute to change the label of the `Enter` key for on-screen keyboards. This helps make it clearer
for users what happens when they submit the current form.
{% endAside %}

A third option is to use `<input type="image" alt="Submit" src="submit.png">`,
to create a graphical **Submit** button.
However, now that you can create graphical buttons with CSS, it's not recommended to use `type="image"`.

{% Aside %}
Always give users as much time as they want to submit a form.
Defining timeouts on your form will cause data loss, and frustrates your users.

For more information, see
[W3C form timeout guidelines](https://www.w3.org/WAI/WCAG21/Understanding/timeouts.html).
{% endAside %}

## Enable users to submit files

Use `<input type="file">` to enable people to upload and submit files if necessary.

```html
<label for="file">Choose file to upload</label>
<input type="file" id="file" name="file" multiple>
```

First, add an `<input>` element with `type="file"` to your form.
Add the `multiple` attribute if users should be able to upload multiple files.

{% Codepen {
  user: 'web-dot-dev',
  id: '6a600920c65a81e55576c6b52b4e5efa',
  height: 300,
  tab: 'html,result'
} %}

One more change is needed to ensure users can upload files—set the `enctype` attribute on your form.
The default value is `application/x-www-form-urlencoded`.

```html
<form method="post" enctype="multipart/form-data">
…
</form>
```
To make sure files can be submitted, change it to `multipart/form-data`.
Without this encoding, files can't be sent with a `POST` request.

{% Assessment 'form' %}

## Resources

- [The form HTML element](https://developer.mozilla.org/docs/Web/HTML/Element/form)
- [Submit button best practices](/payment-and-address-form-best-practices/#html-button)
