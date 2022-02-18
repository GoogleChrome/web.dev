---
title: Use forms to get data from users
description: >
  Learn the basics of using a form on the web with this introduction to the form element.
authors:
  - michaelscharnagl
date: 2021-11-03
---

Imagine you want to ask people on your website about their favorite animal.
As a first step, you need a way to collect the data.

How do you do this with HTML?

{% Glitch 'learn-forms-get-started' %}

In HTML, you can build this using the form element (`<form>`),
an `<input>` with a `<label>`, and a submit `<button>`.

{% Aside %}
You may wonder where the styles for this example are coming from.
They are coming from a general stylesheet
[included in all demos](/learn/forms#demos).

Interested in styling forms? You can learn about this in a later
[module](/learn/forms/styling).
{% endAside %}

## What is a form element?

```html
<form>
  <label for="animal">What is your favorite animal?</label>
  <input type="text" id="animal" name="animal">
  <button>Save</button>
</form>
```

The form element consists of the start tag `<form>`,
optional attributes defined in the start tag, and an end tag `</form>`.

Between the start and end tag, you can include form elements like `<input>` and `<textarea>`
for different types of user input.
You will learn more about [form elements](/learn/forms/form-fields) in the next module.

{% Aside %}
Use HTTPS to protect all websites and forms,
not only if you handle sensitive data. This way, all data is encrypted.

Find out more: [Secure connections with HTTPS](/secure/#secure-connections-with-https).
{% endAside %}

## Where is the data processed?

When a form is submitted (for example, when the user clicks the **Submit** button),
the browser makes a request.
A script can respond to that request and process the data.

{% Aside %}
A script (running on the server or the client) is needed to process the form.
It may [validate](/learn/forms/validation) the data, save it into a database,
or do other operations based on the form data.
{% endAside %}

By default, the request is made to the page where the form is shown.

Say you want a script running at `https://web.dev`
to process the form data—how would you do that?
[Try it out](https://codepen.io/web-dot-dev/pen/fbf90faccc7a22e208c2a507f33be598?editors=1100)!

{% Details %}

{% DetailsSummary 'h3' %} Toggle answer {% endDetailsSummary %}

You can select the location of the script by using the `action` attribute.

```html
<form action="https://example.com/animals">
...
</form>
```

{% endDetails %}

The preceding example makes a request to `https://example.com/animals`.
A script on the `example.com` backend can handle requests to `/animals`
and process data from the form.

## How is the data transferred?

By default, form data is sent as a `GET` request,
with the submitted data appended to the URL.
If a user submits 'frog' in the example above, the browser makes a request to the following URL:

```html
https://example.com/animals?animal=frog
```

In this case, you can access the data on the frontend or the backend by getting the data from the URL.

If you want, you can instruct the form to use a `POST` request by changing the method attribute.

```html
<form method="post">
...
</form>
```

Using `POST`, the data is included in the
[body of the request](https://developer.mozilla.org/docs/Web/HTTP/Methods/POST#example).

The data will not be visible in the URL and can only be accessed from a frontend or backend script.

### What method should you use?

There are use cases for both methods.

For forms that process sensitive data use the `POST` method.
The data is encrypted (if you use  HTTPS) and only accessible by the backend script that processes the request.
The data is not visible in the URL. A common example is a sign-in form.

If the data is shareable, you can use the `GET` method.
This way the data will be added to your browser history as it is included in the URL.
Search forms often use this. This way you can bookmark a search result page.

Now that you've learned about the form element itself, it's time to learn about 
[form fields](/learn/forms/form-fields) to make your forms interactive.

{% Assessment 'form-element' %}

## Resources

[The `<form>` element](https://developer.mozilla.org/docs/Web/HTML/Element/form).
