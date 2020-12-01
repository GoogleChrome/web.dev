---
layout: codelab
title: Sign-up form best practices codelab
authors:
  - samdutton
scheduled: true
date: 2020-12-01
updated: 2020-12-01
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

This codelab shows you how to build a sign-up form that's secure, accessible, and easy to use.

## Step 1: Help password managers securely suggest and store passwords

In this step you'll learn how to use form elements and attributes to make the most of built-in 
browser features.

{% Instruction 'remix' %}

* Add the following code to your `index.html` file inside the `<main>` element:

```html
<form action="#" method="post">
  
  <h1>Sign up</h1>
  
  <section>
    <label>Full name</label>
    <input>
  </section>
  
  <section>
    <label>Email</label>
    <input>
  </section>
  
  <section>
    <label>Password</label>
    <input>
  </section>
  
  <button id="sign-up">Sign up</button>
  
</form>
```

Here's how your project should look at this point:

{% Glitch {
  id: 'sign-in-form-codelab-1',
  path: 'index.html',
  height: 220
} %}

Click **View App** to preview your sign-in form. 

This shows you what a form looks like with no CSS other than the 
[default browser styles](https://bitsofco.de/a-look-at-css-resets-in-2018). 

{% Aside %}
[Browser Default Styles](https://browserdefaultstyles.com) lists default CSS for HTML elements.
{% endAside %}

* Do the default styles *look* OK? What would you change to make the form look better?
* Do the default styles *work* OK? What problems might be encountered using your form as it is? What 
about on mobile? What about for screenreaders or other [assistive technologies](/a11y-tips-for-web-dev)?
* Who are your users, and what devices and browsers are you targeting? 

### How will you test your form? 

You could acquire a lot of hardware and set up a 
[device lab](https://www.smashingmagazine.com/2016/11/worlds-best-open-device-labs/), but there are 
cheaper and simpler ways to try out your form on a range of browsers and platforms:

* [Use Chrome DevTools Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode) 
to simulate mobile devices. 
* [Send the URL from your computer to your phone](https://support.google.com/chrome/answer/9430554).
* Use a service such as [BrowserStack](https://www.browserstack.com/open-source) to test on a range 
of devices and browsers. 

{% Aside 'caution' %}
Testing your site on a range of devices and browsers is especially important for forms, because 
[small problems can cause high bounce rates](https://baymard.com/checkout-usability) and cause users 
to give up on creating an account or completing a purchase.
{% endAside %}

Click **View Source** to return to your source code.

## Step 2: Add CSS to make the form work better

There's nothing wrong with the HTML you added, but you need to make sure your form works well for a 
range of users on mobile and desktop.

In this step you'll add CSS to make the form easier to use.

Copy and paste all the following CSS into your own `style.css` file:

{% Glitch {
  id: 'sign-up-form-codelab-2',
  path: 'css/main.css',
  height: 400,
  previewSize: 0
} %}

Click **View App** to see your styled sign-up form. Then click **View Source** to return to 
`style.css`.

* Does this CSS work for a variety of browsers and screen sizes?

* Try adjusting `padding`, `margin` and `font-size` to suit your test devices.

* The CSS is mobile-first. [Media queries](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) 
are used to apply CSS rules for viewports that are at least `400px` wide, and then again for 
viewports that are at least `500px` wide. Are these [breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints) 
adequate? How should you choose breakpoints for forms?

{% Aside %}
**Viewport** in this context means the display area available for your page. Mobile phones have a 
smaller viewport than laptops, and a small browser window on a desktop monitor has a smaller 
viewport than a maximized browser window.
{% endAside %}


## Step 3: Add attributes to enable built-in browser features

In this step you add attributes to your input elements to enable the browser to store and autofill 
form field values, and warn of fields with missing or invalid data.

Update your `index.html` file so the form code looks like this:

```html
<form action="#" method="post">
        
  <h1>Sign up</h1>
  
  <section>        
    <label for="name">Full name</label>
    <input id="name" name="name" autocomplete="name" 
           pattern="[\p{L}\.\- ]+" required>
  </section>

  <section>        
    <label for="email">Email</label>
    <input id="email" name="email" autocomplete="username"
           type="email" required>
  </section>
  
  <section>
    <label for="password">Password</label>
    <input id="password" name="password" autocomplete="new-password" 
           type="password" minlength="8" required>
  </section>
  
  <button id="sign-up">Sign up</button>
  
</form>
```

The `type` values do a lot:
* `type="password"` obscures text as it's entered and enables the browser's 
[password manager](https://passwords.google.com/) to suggest a strong password. 
* `type="email"` provides basic validation and ensures mobile users get an appropriate keyboard.

Try submitting the form with an empty field. The browser won't submit the form, and it prompts to 
complete missing data and sets focus. That's because you added the `require` attribute to all the 
inputs. Now try submitting with a password that has less than eight characters. The browser warns that 
the password isn't long enough and sets focus on the password input. The same works for `pattern` 
(used for the name input) and other [validation constraints](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation). The browser does all this automatically, without needing any extra code.

Using the `autocomplete` value `name` for the **Full name** input makes sense, but what about the 
other inputs? 
* `autocomplete="username"` for the **Email** input means the browser's password manager will store 
the email address as the 'name' for this user (the username!) to go with the password.
* `autocomplete="new-password"` for **Password** is a hint to the password manager that it should 
offer to store this value as the password for the current site. You can then use 
`autocomplete="current-password"` to enable autofill in a sign-in form (remember, this is 
*sign-up* form). 

{% Aside %}
[Sign-in form best practices](/sign-in-form-best-practices) has more tips for improving form design, 
layout and accessibility.
{% endAside %}


## Step 4: Help users enter secure passwords 

With the form as it is, did you notice anything wrong with the password input?

Two problems:
* There's no way to know if there are constraints on the password value.
* You can't see the password to check if you got it right.

Don't make users guess!

Update the password section of `index.html`:

```html
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. 
          Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="new-password" 
         minlength="8" aria-describedby="password-constraints" required>
  <div id="password-constraints">Eight or more characters.</div>
</section>
```

Copy all the JavaScript below and paste it into your own `js/main.js` file.

{% Glitch {
  id: 'sign-up-form-codelab-4',
  path: 'js/main.js',
  height: 400,
  previewSize: 0
} %}

This adds new features to help users enter passwords:

* A button (actually just text) to toggle password display.
* Information about password constraints.
* An `aria-describedby` attribute for the password input. Screenreaders read the label text, the 
input type (password), and then the description. 
* An `aria-label` attribute for the password-toggle button. 

(The CSS is already in place from step 2. Take a look, to see how the password-toggle button is 
styled and positioned.)

* Would an [icon]((https://material.io/resources/icons/?icon=visibility)) work better than text to 
toggle password display? Try [Discount Usability Testing](https://www.nngroup.com/articles/discount-usability-20-years/) 
with a small group of friends or colleagues.

* To experience how screenreaders work with forms, install the [ChromeVox extension](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) and navigate through the form. 
Could you complete the form using ChromeVox only? If not, what would you change?

Here's how your form should look at this point:

{% Glitch {
  id: 'sign-up-form-codelab-4',
  height: 690
} %}

## Going further

We won't show them here, but several important features are still missing:

* Checking for compromised passwords. You should never allow passwords that have been compromised. 
You can (and should) [use a password-checking service to catch compromised passwords](/sign-up-form-best-practices/#no-compromised-passwords). 
You can use an existing service or run one yourself on your own servers. Try it out! Add password 
checking to your form.

* Link to your Terms of Service and privacy policy documents: make it clear to users how you 
safeguard their data.

* Style and branding: make sure these match the rest of your site. When entering names and addresses 
and making payment, users need to feel comfortable, trusting that they're still in the right place.

* [Analytics and Real User Monitoring](/payment-and-address-form-best-practices#analytics-rum): 
enable the performance and usability of your form design to be tested and monitored for real users. 
