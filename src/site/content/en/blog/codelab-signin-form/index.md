---
layout: codelab
title: Signin form best practice
authors:
  - samdutton
date: 2020-04-24
description: Use cross-platform browser features to build an email/password signin form that's secure, accessible and easy to use.
tags:
  - identity
  - login
  - privacy
  - security
  - signin
  - trust and safety
glitch: signin-form
related_post: signin-form-best-practice
---

## Step 1: Use meaningful HTML

Use elements built for the job: 
* `<form>`
* `<section>`
* `<label>`
* `<button>`

As you'll see, these elements enable built-in browser functionality, improve accessibility, and add meaning to your markup.

Add the following code inside the `<body>` element:

```html
<form id="signin" action="#" method="post">

  <h1>Sign in</h1>

  <section>
    <label>Email</label>
    <input />
  </section>

  <section>
    <label>Password</label>
    <input />
  </section>

  <button>Sign in</button>

</form>
```
{% Aside 'codelab' %}
[View code for Step 1](https://glitch.com/edit/#!/signin-form-codelab-1).
{% endAside %}

## Step 2: Design for fingers and thumbs

The HTML in Step 1 is valid and correct, but the default browser styling means it's unusable—and looks terrible!

Add the CSS to
