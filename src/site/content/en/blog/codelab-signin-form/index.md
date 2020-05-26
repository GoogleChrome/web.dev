---
layout: codelab
title: Signin form best practice
authors:
  - samdutton
date: 2020-04-24
updated: 2020-05-26
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
    <input>
  </section>

  <section>
    <label>Password</label>
    <input>
  </section>

  <button>Sign in</button>

</form>
```
{% Aside 'codelab' %}
[View complete code for Step 1](https://glitch.com/edit/#!/signin-form-codelab-1).
{% endAside %}

## Step 2: Design for fingers and thumbs

The HTML in Step 1 is valid and correct, but the default browser styling means it looks terrible and it's hard to use, especially on mobile.

Copy and paste the [complete CSS from step 2](https://glitch.com/edit/#!/signin-form-codelab-2?path=style.css) into [style.css](https://glitch.com/edit/#!/signin-form-codelab?path=style.css).

That's quite a lot of code! The main things to be aware of are the changes to sizes:
* Padding and margin are added to inputs.
* Font-size is set for mobile and desktop.

Styles are also set using the `:invalid` selector for when the email input has an invalid value.

The CSS layout is mobile-first: 
* The default CSS is for viewports less than 450 px wide.
* The media query section sets overrides for viewports that are at least 450 px wide.
* There are CSS variables for mobile and desktop font size.

It's very important at this point to test your code on real devices on desktop and mobile:
* Is label and input text readable, especially for people whose vision isn't 20/20?
* Are the inputs and **Sign in** button large enough to use as touch targets for thumbs?

{% Aside 'codelab' %}
[View complete code for Step 2](https://glitch.com/edit/#!/signin-form-codelab-2).
{% endAside %}

## Step 3: Add input attributes to enable built-in browser features

Add attributes to your form HTML so it looks like this:

```html
<form id="signin" action="#" method="post">
      
  <h1>Sign in</h1>

  <section>        
    <label for="email">Email</label>
    <input id="email" name="email" type="email" placeholder=" " autocomplete="email" required autofocus>
  </section>
        
  <section>        
    <label for="current-password">Password</label>
    <input id="password" name="password" type="password" autocomplete="new-password" required>
  </section>

  <button id="sign-in">Sign in</button>
  
</form>
```

The important parts to notice are the attributes on the label and input elements:
*  `for="email"` and `for="current-password"`: a tap or click on the label moves focus to its input, and screenreaders announce label text when the label or the label's input gets focus.
* `type="email"`: enable browsers to understand that the meaning of this input and, on mobile, provide a keyboard suitable for entering an email address.
* `type="password"`: ensure browsers hide the value by default and understand that the value of this input is a password.
* `name="email"` and `name="current-password"`: help browsers store named values.
* `autocomplete="email"` and `autocomplete="current-password"`: help browsers use stored values to autofill the inputs.

Once again, it's extremely important to test behaviour across platforms. Try entering values and submitting the form in different browsers on different devices.

{% Aside 'codelab' %}
[View complete code for Step 3](https://glitch.com/edit/#!/signin-form-codelab-3).
{% endAside %}

## Step 4: Add UI to toggle password display

Usability experts [strongly recommend](https://www.nngroup.com/articles/stop-password-masking/) adding a **Show password** icon or button to enable users to check the text they've entered. There's currently [no built-in way to do this](https://twitter.com/sw12/status/1251191795377156099), so you'll have to do it yourself with JavaScript.  

Code to add **Show password** functionality is straightforward—this example uses text, not an icon.

Update [index.html](https://glitch.com/edit/#!/signin-form-codelab-4?path=index.html:22:2), [style.css](https://glitch.com/edit/#!/signin-form-codelab-4?path=style.css:34:0) and [script.js](https://glitch.com/edit/#!/signin-form-codelab-4?path=script.js) as follows.

Add the toggle button to the password section in the HTML:

```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

Add the following CSS, so the **Show password** 'button' actually looks like plain text, displayed at the top right of the password section:

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

Add JavaScript to toggle password display and set the appropriate `aria-label`:

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

Once again, make sure to test your work on different browsers on different platforms.

**Bonus points**: Sites such as [Gmail](https://mail.google.com) use icons, not text, to toggle password display. Try implementing this using SVG images. 

{% Aside 'codelab' %}
[View complete code for Step 4](https://glitch.com/edit/#!/signin-form-codelab-4).
{% endAside %}


## Step 5: Add form validation

HTML form elements and attributes have built-in features for basic validation, but you should also use JavaScript to do more robust validation while users are entering data and when they attempt to submit the form.

{% Aside 'caution' %}
Client-side validation helps users enter data and can avoid unnecessary server load, but you must always validate and sanitize data on your back-end.
{% endAside %}

This step uses the [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) (which is [widely supported](https://caniuse.com/#search=constraint%20validation)) to add custom validation, using built-in browser UI to set focus and display prompts. 

Tell users the constraints for passwords and any other inputs. Don't make them guess!

Update the HTML for the password section:

```html
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" aria-describedby="password-constraints" required>
	<div id="password-constraints">At least eight characters, with at least one lowercase and one uppercase letter.</div>
</section>
```

This adds two new features:
* Information about password constraints.
* An `aria-describedby` attribute for the password input. Screenreaders read the label text, the input type (password), and then the description. 

Add CSS: 

```css
div#password-constraints {
  margin: 5px 0 0 0;
  font-size: 16px;
}
```

Add the following JavaScript:

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
const signinButton = document.querySelector('button#signin');

form.addEventListener('submit', handleFormSubmission);                       

function handleFormSubmission(event) {
  event.preventDefault();
  validatePassword();
  form.reportValidity();
  if (form.checkValidity() === false) {
  } else {
    // On a production site do form submission.
    alert('Signing in!')
    signinButton.disabled = 'true';
  }
}
```

{% Aside 'codelab' %}
[View complete code for Step 5](https://glitch.com/edit/#!/signin-form-codelab-5).
{% endAside %}


## And finally…

We won't show them here, but three crucial signin form features are still missing:

* **Forgot your password?** link: make it easy for users to reset their password.

* Links to your Terms of Service and privacy policy documents: make it clear to users from the start how you safeguard their data.

* The logo and name of your company or organization: include these and make sure that visual styles match the rest of your site. This may sound obvious, but many sites present users with forms that don't feel like they belong to the same site.