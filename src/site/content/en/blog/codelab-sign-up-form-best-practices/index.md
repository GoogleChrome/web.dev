---
layout: codelab
title: Sign-up form best practices codelab
authors:
  - samdutton
scheduled: true
date: 2020-11-06
updated: 2020-11-06
description: Use cross-platform browser features to build a simple sign-up form that's secure, accessible and easy to use.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
glitch: sign-up-form-codelab-0
glitch_path: index.html
related_post: sign-up-form-best-practices
---

This codelab shows you how to build a sign-up form that is secure, accessible, and easy to use.

## Step 1: XXXXXXX

Explanation of this step blah blah blah.

{% Instruction 'remix' %}

* Add the following code inside the `<body>` element:

```html
<form action="#" method="post">
  <h1>Sign in</h1>
  <section>
    <label>Email</label>
    <input>
  </section>
  <section>
    <label>Password</label>
    <input>
  </section>
  <button>Sign in</button>
</form>
```

Here's how your `index.html` should look at this point:

{% Glitch {
  id: 'sign-up-form-codelab-1',
  path: 'index.html',
  height: 480
} %}

Click **View App** to preview your sign-up form.

Blah blah blah.

Click **View Source** to return to your source code.

## Step 2: XXXXXXXXXXXXXX

Explanation of this step blah blah blah.

Copy and paste the following CSS into your own `style.css` file:

{% Glitch {
  id: 'sign-up-form-codelab-2',
  path: 'style.css'
} %}

Click **View App** to check out your freshly styled sign-up form. Then
click **View Source** to return to `style.css`.

This is what's happening blah blah blah

When building your own form like this, it's very important at this point to
test your code on real devices on desktop and mobile:

* Is something working blah blah blah?
* Is something else working blah blah blah?

## Step 3: XXXXXXXXXXX

Explanation of this step blah blah blah.

Add blah blah to your HTML so it looks like this:

```html/3,4,7,8,10
<form action="#" method="post">
  <h1>Sign in</h1>
  <section>        
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="username" required autofocus>
  </section>
  <section>        
    <label for="current-password">Password</label>
    <input id="password" name="password" type="password" autocomplete="new-password" required>
  </section>
  <button id="sign-up">Sign in</button>
</form>
```

View your app again and then do something blah blah. Notice blah blah blah.

Try doing something blah blah blah. Notice something blah blah blah. For example blah blah blah.
All of this happens because blah blah blah.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="email-keyboard.png" 
       alt="The default email keyboard on iOS.">
</figure>

Try something else blah blah.

It's extremely important to test behaviour across platforms. Try entering values 
and submitting the form in different browsers on different devices. It's easy to 
test on a range of platforms using BrowserStack, which is [free for open source 
projects](https://www.browserstack.com/open-source). Try it out!

Here's how your `index.html` should look at this point:

{% Glitch {
  id: 'sign-up-form-codelab-3',
  path: 'index.html',
  height: 480
} %}

## Step 4: XXXXX

## Step 5: XXXXX



**For bonus points:** try out something blah blah blah.

Here's how your code should look at this point:

{% Glitch {
  id: 'sign-up-form-codelab-5',
  path: 'style.css',
  height: 480
} %}

## Going further

We won't show them here, but four crucial sign-up form features are still missing:

* Add a **Forgot your password?** link: make it easy for users to reset their password.

* Link to your Terms of Service and privacy policy documents: make it clear to 
users from the start how you safeguard their data.

* Consider style and branding: make sure these match the rest of your site. 

* Add [Analytics and RUM](/sign-up-form-best-practices#analytics): enable the 
performance and usability of your form design to be tested and monitored for 
real users. 
