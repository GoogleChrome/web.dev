---
layout: codelab
title: Sign-up form best practices codelab
authors:
  - samdutton
scheduled: true
date: 2020-12-09
updated: 2020-12-09
description: Use cross-platform browser features to build a simple sign-up form that's secure, accessible, and easy to use.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
glitch: sign-up-form-codelab-1
glitch_path: index.html
related_post: sign-up-form-best-practices
---

This codelab shows you how to build a sign-up form that's secure, accessible, and easy to use.

## Step 1: Use meaningful HTML

In this step you'll learn how to use form elements to make the most of built-in browser features.

{% Instruction 'remix' %}

Take a look at the HTML for your form in `index.html`. You'll see there are inputs for name, email 
and password. Each is in a section, and each has a label. The **Sign up** button is… a `<button>`! 
  Later in this codelab, you'll learn the special powers of all these elements.

{% Aside %}
`<input>` elements don't have closing tags. That's because they are [void](https://www.w3.org/TR/2011/WD-html-markup-20110113/syntax.html#syntax-elements) (empty) elements: they don't have any
content in themselves. A "/" character at the end of a void element is optional: either `<input>` 
or `<input />` is OK.
{% endAside %}

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

Click **View App** to preview your sign-up form. This shows you what a form looks like with no CSS other than the 
[default browser styles](https://bitsofco.de/a-look-at-css-resets-in-2018). 

* Do the default styles *look* OK? What would you change to make the form look better?
* Do the default styles *work* OK? What problems might be encountered using your form as it is? What 
about on mobile? What about for screenreaders or other [assistive technologies](/a11y-tips-for-web-dev)?
* Who are your users, and what devices and browsers are you targeting? 

{% Aside %}
[Browser Default Styles](https://browserdefaultstyles.com) lists default CSS for HTML elements.
{% endAside %}

### Test your form

You could acquire a lot of hardware and set up a 
[device lab](https://www.smashingmagazine.com/2016/11/worlds-best-open-device-labs/), but there are 
cheaper and simpler ways to try out your form on a range of browsers, platforms and devices:

* [Use Chrome DevTools Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode) 
to simulate mobile devices. 
* [Send the URL from your computer to your phone](https://support.google.com/chrome/answer/9430554).
* Use a service such as [BrowserStack](https://www.browserstack.com/open-source) to test on a range 
of devices and browsers. 
* Try out the form using a screenreader tool such as the [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) Chrome extension.

{% Aside 'warning' %}
Testing your site on a range of devices and browsers is especially important for forms, because 
[small problems can cause high bounce rates](https://baymard.com/checkout-usability) and cause users 
to give up on creating an account or completing a purchase.
{% endAside %}

Click **View App** to preview your sign-up form. 

* Try out your form on different devices using Chrome DevTools Device Mode.
* Now open the form on a phone or other real devices. What differences do you see?

## Step 2: Add CSS to make the form work better

Click **View Source** to return to your source code.

There's nothing wrong with the HTML so far, but you need to make sure your form works well for a 
range of users on mobile and desktop.

In this step you'll add CSS to make the form easier to use.

Copy and paste all the following CSS into `css/main.css` file:

{% Glitch {
  id: 'sign-up-form-codelab-2',
  path: 'css/main.css',
  height: 400,
  previewSize: 0
} %}

Click **View App** to see your styled sign-up form. Then click **View Source** to return to 
`css/main.css`.

* Does this CSS work for a variety of browsers and screen sizes?

* Try adjusting `padding`, `margin`, and `font-size` to suit your test devices.

* The CSS is mobile-first. [Media queries](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) 
are used to apply CSS rules for viewports that are at least `400px` wide, and then again for 
viewports that are at least `500px` wide. Are these [breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints) 
adequate? How should you choose breakpoints for forms?

{% Aside %}
**Viewport** in this context means the display area available for your page. Mobile phones have a 
smaller viewport than laptops, and a small browser window on a desktop monitor has a smaller 
viewport than a maximized browser window.
{% endAside %}


## Step 3: Add attributes to help users enter data

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
* `type="email"` provides basic validation and ensures mobile users get an appropriate keyboard. Try 
it out!

Click **View App** and then click the **Email** label. What happens? Focus moves to the email 
input because the label has a `for` value that matches the email input's `id`. The other labels and 
inputs work the same way. Screenreaders also announce label text when the label (or the label's 
associated input) gets focus. You can try that using the [ChromeVox extension](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en).

Try submitting the form with an empty field. The browser won't submit the form, and it prompts to 
complete missing data and sets focus. That's because you added the `require` attribute to all the 
inputs. Now try submitting with a password that has less than eight characters. The browser warns that 
the password isn't long enough and sets focus on the password input because of the `minlength="8"` 
attribute. The same works for `pattern` (used for the name input) and other 
[validation constraints](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation). 
The browser does all this automatically, without needing any extra code.

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
layout, and accessibility.
{% endAside %}


## Step 4: Help users enter secure passwords 

With the form as it is, did you notice anything wrong with the password input?

There are two issues:
* There's no way to know if there are constraints on the password value.
* You can't see the password to check if you got it right.

Don't make users guess!

Update the password section of `index.html` with the following code:

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

This adds new features to help users enter passwords:

* A button (actually just text) to toggle password display. (The 
  button functionality will be added with JavaScript.)
* An `aria-label` attribute for the password-toggle button. 
* An `aria-describedby` attribute for the password input. Screenreaders 
  read the label text, the input type (password), and then the description. 

To enable the password-toggle button and show users information about password constraints, copy all the JavaScript below and paste it into your own `js/main.js` file.

{% Glitch {
  id: 'sign-up-form-codelab-4',
  path: 'js/main.js',
  height: 400,
  previewSize: 0
} %}


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

This codelab doesn't cover several important features:

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
