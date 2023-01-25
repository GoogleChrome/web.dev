---
layout: codelab
title: Use cross-platform browser features to build a sign-in form
authors:
  - samdutton
scheduled: true
date: 2020-06-29
updated: 2020-08-05
description: Use cross-platform browser features to build a simple sign-in form that's secure, accessible, and easy to use.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
glitch: sign-in-form-codelab-0
glitch_path: index.html
related_post: sign-in-form-best-practices
---

This codelab teaches you how to build a sign-in form that's secure, accessible, and easy to use.

## 1. Use meaningful HTML

Use these elements built for the job: 
* `<form>`
* `<section>`
* `<label>`
* `<button>`

As you'll see, these elements enable built-in browser functionality, improve 
accessibility, and add meaning to your markup.

1. Click Remix to edit to make the project editable.

2. Add the following code to the `<body>` element:

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

   Here's how your `index.html` file should look at this point:

  {% Glitch {
    id: 'sign-in-form-codelab-1',
    path: 'index.html',
    previewSize: 0,
    height: 480
  } %}

3. Click **View App** to preview your sign-in form.
The HTML that you added is valid and correct, but the default browser styling
makes it looks terrible and hard to use, especially on mobile devices.

4. Click **View Source** to return to your source code.

## 2. Design for fingers and thumbs

Adjust padding, margins, and font sizes to ensure that your inputs work well on mobile. 

1. Copy the following CSS and paste it into your `style.css` file:

  {% Glitch {
    id: 'sign-in-form-codelab-2',
    previewSize: 0,
    path: 'style.css'
  } %}

2. Click **View App** to see your freshly styled sign-in form. 

3. Click **View Source** to return to your `style.css` file.

That's quite a lot of code! The main things to be aware of are the changes to sizes:

* `padding` and `margin` are added to inputs.
* `font-size` is different for mobile and desktop.

The `:invalid` selector is used to indicate when an input has an invalid value.
This doesn't work yet.

The CSS layout is mobile-first:

* The default CSS is for viewports less than 450 pixels wide.
* The media query section sets overrides for viewports that are at least 450 pixels wide.

When building your own form like this, it's very important at this point in the process to
test your code on real devices on desktop and mobile:

* Is label and input text readable, especially for people with low vision?
* Are the inputs and **Sign in** button large enough to use as touch targets for thumbs?

## 3. Add input attributes to enable built-in browser features

Enable the browser to store and autofill input values, and provide access to 
built-in password-management features.

1. Add attributes to your form HTML so it looks like this:

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
    <button id="sign-in">Sign in</button>
  </form>
  ```

2. View your app again and then click **Email**.

   Notice how focus moves to the email input. This is because the label is associated with the input through the `for="email"` attribute. Screenreaders also 
   announce the label text when the label or the label's associated input gets focus.

3. Focus the email input on a mobile device. 

   Notice how the keyboard is optimized for typing an email address. For example, the `@` and `.` characters might be shown on the primary keyboard, and the 
   operating system might show stored emails above the keyboard. All of this happens because the `type="email"` attribute is applied to an `<input>` element.

  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dUtDcvYy1RMzEYBi7Ce0.png", alt="The default email keyboard on iOS.", width="800", height="1504", class="w-screenshot w-screenshot--filled" %}
  </figure>

4. Type some text into the password input. 

   The text is hidden by default because the `type="password"` attribute has been applied to the element.


* The `autocomplete`, `name`, `id`, and `type` attributes help browsers understand 
the role of inputs in order to store data that can be used later for autofill. 

5. Focus the email input on a desktop device and type some text. 

   You can see the URL of your app when you click **Fullscreen** ![The Fullscreen icon](/images/glitch/fullscreen.svg). If you stored any email addresses in your 
   browser, you probably see a dialog that lets you select from those stored emails. This happens because the `autocomplete="username"` attribute applied to the 
   email input.

* `autocomplete="username"` and `autocomplete="current-password"` help browsers use 
stored values to autofill the inputs.

{% Aside %}
For email inputs, use `autocomplete="username"` because `username` is recognized 
by password managers in modern browsers, even though you should use `type="email"`, 
and you may want to use `id="email"` and `name="email"`.
{% endAside %}

Different browsers use [different techniques](/sign-in-form-best-practices/#password-managers:~:text=Browser%20password%20and%20autofill%20systems%20are%20not%20simple) 
to work out the role of form inputs and provide autofill for a range of 
different websites. 

Add and remove attributes to try this yourself.

It's extremely important to test behavior across platforms. You should enter values 
and submit the form in different browsers on different devices. It's easy to 
test on a range of platforms with BrowserStack, which is [free for open source 
projects](https://www.browserstack.com/open-source). Try it!

Here's how your `index.html` file should look at this point:

{% Glitch {
  id: 'sign-in-form-codelab-3',
  path: 'index.html',
  height: 480
} %}

## 4. Add UI to toggle password display

Usability experts [strongly recommend](https://www.nngroup.com/articles/stop-password-masking/) the addition of an icon or button that lets users see the text that they enter in the **Password** field. There's [no built-in way to do this](https://twitter.com/sw12/status/1251191795377156099), so you need to implement it yourself with JavaScript. 

The code to add this functionality is straightforward. This example uses text, not an icon.

Update the [`index.html`](https://glitch.com/edit/#!/sign-in-form-codelab-4?path=index.html:22:2), [`style.css`](https://glitch.com/edit/#!/sign-in-form-codelab-4?path=style.css:34:0), and [`script.js`](https://glitch.com/edit/#!/sign-in-form-codelab-4?path=script.js) files as follows.

1. Add a toggle to the password section in the `index.html` file:

  ```html/2
  <section>
    <label for="password">Password</label>
    <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
    <input id="password" name="password" type="password" autocomplete="current-password" required>
  </section>
  ```

2. Add the following CSS to the bottom of the `style.css` file:

  ```css
  button#toggle-password {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 300;
    padding: 0;
    position: absolute;
    top: -4px;
    right: -2px;
  }
  ```

   This makes the **Show password** button look like plain text and displays it in the top-right corner of the password section.

3. Add the following JavaScript to the `script.js` file to toggle password display and set the appropriate `aria-label`:

  ```javascript
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('toggle-password');

  togglePasswordButton.addEventListener('click', togglePassword);

  function togglePassword() {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordButton.textContent = 'Hide password';
      togglePasswordButton.setAttribute('aria-label',
        'Hide password.');
    } else {
      passwordInput.type = 'password';
      togglePasswordButton.textContent = 'Show password';
      togglePasswordButton.setAttribute('aria-label',
        'Show password as plain text. ' +
        'Warning: this will display your password on the screen.');
    }
  }
  ```

4. Try the show password logic now. 

   a. View your app. 
   b. Enter some text in the password field.
   c. Click **Show password**.

5. Repeat the fourth step on multiple browsers on different operating systems.

Think about UX design: will users notice **Show password** and understand it? Is there a better way to provide this functionality? This is a good moment to try [discount usability testing](https://www.nngroup.com/articles/discount-usability-20-years/) with a small group of friends or colleagues.

To understand how this functionality works for screenreaders, install the [ChromeVox Classic Extension](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) and navigate through the form. Do the `aria-label` values work as intended?

Some websites, such as [Gmail](https://mail.google.com), use icons, not 
text, to toggle password display. When you're done with this codelab, implement this with SVG images. 
[Material Design](https://material.io/resources/icons/?icon=visibility) offers high-quality icons that you can download for free. 

Here's how your code should look at this point:

{% Glitch {
  id: 'sign-in-form-codelab-4',
  path: 'style.css',
  height: 480
} %}


## 5. Add form validation

You can help users enter their data correctly when you let them validate their data before form submission and show them what they need to change.

HTML form elements and attributes have built-in features for basic validation, 
but you should also use JavaScript to do more robust validation while users enter data and when they attempt to submit the form.

{% Aside 'warning' %}
Client-side validation helps users enter data and can avoid unnecessary server load, 
but you must always validate and sanitize data on your backend.
{% endAside %}

This step uses the [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) 
(which is [widely supported](https://caniuse.com/#search=constraint%20validation)) 
to add custom validation with built-in browser UI that sets focus and displays prompts. 

Tell users the constraints for passwords and any other inputs. Don't make them guess!

1. Update the password section of the `index.html` file:

  ```html
  <section>
    <label for="password">Password</label>
    <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
    <input id="password" name="password" type="password" autocomplete="current-password" aria-describedby="password-constraints" required>
    <div id="password-constraints">At least eight characters, with at least one lowercase and one uppercase letter.</div>
  </section>
  ```

This adds two new features:
* Information about password constraints
* An `aria-describedby` attribute for the password input (Screenreaders read the label text, the input type (password), and then the description.) 

2. Add the following CSS to the bottom of the `style.css` file:

  ```css
  div#password-constraints {
    margin: 5px 0 0 0;
    font-size: 16px;
  }
  ```

3. Add the following JavaScript to `script.js` file:

  ```javascript
  passwordInput.addEventListener('input', resetCustomValidity); 
  function resetCustomValidity() {
    passwordInput.setCustomValidity('');
  }

  // A production site would use more stringent password testing. 
  function validatePassword() {
    let message= '';
    if (!/.{8,}/.test(passwordInput.value)) {
      message = 'At least eight characters. ';
    }
    if (!/.*[A-Z].*/.test(passwordInput.value)) {
      message += 'At least one uppercase letter. ';
    }
    if (!/.*[a-z].*/.test(passwordInput.value)) {
      message += 'At least one lowercase letter.';
    }
    passwordInput.setCustomValidity(message);
  }

  const form = document.querySelector('form');
  const signinButton = document.querySelector('button#sign-in');

  form.addEventListener('submit', handleFormSubmission);                       

  function handleFormSubmission(event) {
    event.preventDefault();
    validatePassword();
    form.reportValidity();
    if (form.checkValidity() === false) {
    } else {
      // On a production site do form submission.
      alert('Logging in!')
      signinButton.disabled = 'true';
    }
  }
  ```

4. Try it! 

   All recent browsers have built-in features for form validation and 
   support validation with JavaScript.

   a. Enter an invalid email address and click **Sign in**. The browser displays a warning—no JavaScript required!

   b. Enter a valid email address, but then click **Sign in** without a password value. The browser warns that you missed a required value and sets focus on the 
      password input.

   c. Enter an invalid password and click **Sign in**. Now you see different messages depending on what's wrong. 

5. Try different ways to help users enter email addresses and passwords. [Better password form fields](https://aerotwist.com/blog/better-password-form-fields/) 
   offers some clever suggestions.

   Here's how your code should look at this point:

  {% Glitch {
    id: 'sign-in-form-codelab-5',
    path: 'style.css',
    previewSize: 0,
    height: 480
  } %}

## Go further

They're not shown in this codelab, but you still need these four crucial sign-in form features:

* Add **Forgot your password?**, a button that makes it easy for users to reset their passwords.

* Link to your terms of service and privacy policy documents so that your users know how you safeguard their data.

* Consider style and branding, and ensure that these additional features match the rest of your website. 

* Add [Analytics and RUM](/sign-in-form-best-practices#analytics) so that you can test and monitor the performance and usability of your form design.
