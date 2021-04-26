---
layout: codelab
title: Payment form best practices codelab
authors:
  - samdutton
scheduled: true
date: 2020-12-09
updated: 2020-12-09
description: Learn best practices for payment forms.
tags:
  - ecommerce
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
glitch: payment-form-codelab-1
glitch_path: index.html
related_post: payment-and-address-form-best-practices
---

This codelab shows you how to build a payment form that is secure, accessible and easy to use.

{% Aside 'caution' %}
This article is about frontend best practices for payment forms. It does not explain how to
implement transactions on your site. To find out more about adding payment functionality to your
website, see [Web Payments](/payments).
{% endAside %}

## Step 1: Use HTML as intended

Use elements built for the job:
* `<form>`
* `<section>`
* `<label>`
* `<input>`, `<select>`, `<textarea>`
* `<button>`

As you'll see, these elements enable built-in browser functionality, improve accessibility, and
add meaning to your markup.

{% Instruction 'remix' %}

Take a look at the HTML for your form in `index.html`.

```html
<form action="#" method="post">

  <h1>Payment form</h1>

  <section>
    <label>Card number</label>
    <input>
  </section>

  <section>
    <label>Name on card</label>
    <input>
  </section>

  <section id="cc-exp-csc">
    <div>
      <label>Expiry date</label>
      <input>
    </div>
    <div>
      <label>Security code</label>
      <input>
      <div class="explanation">Last 3 digits on back of card</div>
    </div>
  </section>

  <button id="complete-payment">Complete payment</button>

</form>
```

There are `<input>` elements for card number, name on card, expiry date and security code. They're all
wrapped in `<section>` elements, and each has a label. The **Complete Payment** button is an HTML
`<button>`. Later in this codelab you'll learn about the browser features you can access by using
  these elements.

{% Aside %}
`<input>` elements don't have closing tags. That's because they are [void](https://www.w3.org/TR/2011/WD-html-markup-20110113/syntax.html#syntax-elements) (empty) elements: they don't have any
content in themselves. A "/" character at the end of a void element is optional: either `<input>`
or `<input />` is OK.
{% endAside %}

Click **View App** to preview your payment form.

* Does the form work well enough as it is?
* Is there anything you would change to make it work better?
* How about on mobile?

Click **View Source** to return to your source code.


## Step 2: Design for mobile and desktop

The HTML you added is valid, but the default browser styling makes the form hard to use, especially
on mobile. It doesn't look too good, either.

You need to ensure your forms work well on a range of devices by adjusting padding, margins, and
font sizes.

Copy all the CSS below and paste it into your own `css/main.css` file.

{% Glitch {
  id: 'payment-form-codelab-2',
  path: 'css/main.css',
  height: 400,
  previewSize: 0
} %}

That's a lot of CSS! The main things to be aware of are the changes to sizes:

* `padding` and `margin` are added to inputs.
* `font-size` and other values are different for different viewport sizes.

When you're ready, click **View App** to see the styled form.  You'll also notice that borders have
been adjusted, and `display: block;` is used for labels so they go on a line on their own, and
inputs can be full width. [Sign-in form best practices](/sign-in-form-best-practices/#label:~:text=put%20your%20labels%20above%20your%20inputs)
explains the benefits of this approach in more detail.

The `:invalid` selector is used to indicate when an input has an invalid value. (You'll use this
later in the codelab.)

The CSS is mobile-first:

* The default CSS is for viewports less than `400px` wide.
* [Media queries](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) are
used to override the default for viewports that are at least `400px` wide, and then again for
viewports that are at least `500px` wide. This should work well for smaller phones, mobile devices
with larger screens, and on desktop.

Whenever you build for the web, you need to test on different devices and viewport sizes. That's
especially true for forms, because one small glitch can make them unusable. You should always adjust
[CSS breakpoints](/responsive-web-design-basics/#breakpoints) to ensure they work well with your
content and your target devices.

* Is the whole form visible?
* Are the form inputs big enough?
* Is all the text readable?
* Did you notice any differences between using a real mobile device, and viewing the form in
Device Mode in Chrome DevTools?
* Did you need to adjust breakpoints?

There are several ways to test your form on different devices: {: #different-devices}

* [Use Chrome DevTools Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode)
to simulate mobile devices.
* [Send the URL from your computer to your phone](https://support.google.com/chrome/answer/9430554).
* Use a service such as [BrowserStack](https://www.browserstack.com/open-source) to test on a range
of devices and browsers.

## Step 3: Add attributes to help users enter data

Enable the browser to store and autofill input values, and provide access to secure built-in
payment and validation features.

Add attributes to the form in your `index.html` file so it looks like this:

```html/5,6,10,11,16,17,20,21
<form action="#" method="post">

  <h1>Payment form</h1>

  <section>
    <label for="cc-number">Card number</label>
    <input id="cc-number" name="cc-number" autocomplete="cc-number" inputmode="numeric" pattern="[\d ]{10,30}" required>
  </section>

  <section>
    <label for="cc-name">Name on card</label>
    <input id="cc-name" name="cc-name" autocomplete="cc-name" pattern="[\p{L} \-\.]+" required>
  </section>

  <section id="cc-exp-csc">
    <div>
      <label for="cc-exp">Expiry date</label>
      <input id="cc-exp" name="cc-exp" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" required>
    </div>
    <div>
      <label for="cc-csc">Security code</label>
      <input id="cc-csc" name="cc-csc" autocomplete="cc-csc" inputmode="numeric" maxlength="3" required>
      <div class="explanation">Back of card, last 3 digits</div>
    </div>
  </section>

  <button id="complete-payment">Complete payment</button>

</form>
```

View your app again and then tap or click in the **Card number** field. Depending on the device and
platform, you may see a chooser showing payment methods stored for the browser, like the one below.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yPPoZYFMeSILBjgyjcFI.png", alt="Two screenshots of a payment form in Chrome on an Android phone. One shows the built-in browser payment card selector; the other shows dummy autofilled values.", width="800", height="684" %}
  <figcaption class="w-figcaption">Built-in browser payment chooser and autofill.</figcaption>
</figure>

Once you select a payment method and enter your security code, the browser autofills the form using
the payment card `autocomplete` values you added to the form:

* `cc-number`
* `cc-name`
* `cc-exp`
* `cc-csc`

Many browsers also check and confirm the validity of credit card numbers and security codes.

{% Aside %}
Don't be alarmed! Your browser may be able to autofill the form with stored payment card data, but
no payment can be made, and no data is transferred or saved.
{% endAside %}

On a mobile device you'll also notice that you get a numeric keyboard as soon as you tap into the
**Card number** field. That's because you used `inputmode="numeric"`. For numeric fields this makes
it easier to enter numbers and impossible to enter non-numeric characters, and nudges users to
remember the type of data they're entering.

It's extremely important to correctly add all available `autocomplete` values to payment forms. It's
quite common for sites to miss out the `autocomplete` value for the card expiry date and other
fields. If a single `autofill` value is wrong or missing, users will need to retrieve their actual
card to manually enter card data, and you may lose out on a sale. If autofill on payment forms
doesn't work properly, users may also decide to keep a record of payment card details on their phone
or computer, which is highly insecure.

{% Aside %}
Research shows that [it may be better to use separate select elements for month and year](https://baymard.com/blog/how-to-format-expiration-date-fields) rather than a single input. It's up to you which you think is
best. Test this out by remixing and editing the HTML from our complete
[payment form demo](https://glitch.com/~payment-form), which includes code for both types of expiry
date field.
{% endAside %}

Try submitting the payment form with an empty field. The browser prompts to complete missing
data. Now add a letter to the value in the **Card number** field and try submitting the form. The
browser warns that value is invalid. This happens because you used the `pattern` attribute to
specify valid values for a field. The same works for `maxlength` and other
[validation constraints](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
No JavaScript required.

Your payment form should now look this:

{% Glitch {
  id: 'payment-form-codelab-3',
  path: 'index.html',
  height: 750
} %}

* Try removing `autocomplete` values and filling in the payment form. What difficulties do you
encounter?
* Try out payment forms on online stores. Consider what works well and what goes wrong. Are there
any common problems or best practices you should follow?

## Step 4: Disable the payment button once the form is submitted

You should consider disabling a submit button once the user has tapped or clicked it—especially when
the user is making payment. [Many users tap or click buttons repeatedly](https://baymard.com/blog/users-double-click-online),
even if they're working fine. That can cause problems with payment processing and add to server load.

Add the following JavaScript to your `js/main.js` file:

``` js
const form = document.querySelector('form');
const completePaymentButton = document.querySelector('button#complete-payment');

form.addEventListener('submit', handleFormSubmission);

function handleFormSubmission(event) {
  event.preventDefault();
  if (form.checkValidity() === false) {
    // Handle invalid form data.
  } else {
    completePaymentButton.textContent = 'Making payment...';
    completePaymentButton.disabled = 'true';
    setTimeout(() => {alert('Made payment!');}, 500);
  }
}
```

Try submitting the payment form and see what happens.

{% Aside 'caution' %}
Some sites leave form submit buttons disabled until the user has correctly completed all form
fields. It's best not to do that, since users may accidentally leave out a required value, or use an
invalid value, then tap or click the disabled submit button and assume your site is broken! Even if
you mark form values as invalid or missing, the user may not see the warnings (especially for longer
forms, and on mobile). Better to validate inline while the user is entering data–*and* when they
try to submit the form.
{% endAside %}

Here is how your code should look at this point, with the addition of some comments and a
`validate()` function:

{% Glitch {
  id: 'payment-form-codelab-4',
  path: 'js/main.js',
  height: 500,
  previewSize: 0
} %}

* You'll notice that the JavaScript includes commented-out code for data validation. This code uses
the [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints)
(which is [widely supported](https://caniuse.com/#search=constraint%20validation)) to add custom
validation, accessing built-in browser UI to set focus and display prompts. Un-comment the code and
try it out. You'll need to set appropriate values for `someregex` and `message`, and set a value for
`someField`.

* What [analytics and Real User Monitoring data](/payment-and-address-form-best-practices#analytics-rum)
would you monitor in order to identify ways to improve your forms?

Your complete payment form should now look like this:

{% Glitch {
  id: 'payment-form',
  path: 'index.html',
  height: 750
} %}

* [Try out your form on different devices](#different-devices). What devices and browsers are you
targeting? How could the form be improved?

## Going further

Consider the following crucial form features that are not covered in this codelab:

* Link to your Terms of Service and privacy policy documents: make it clear to users how you
safeguard their data.

* Style and branding: make sure these match the rest of your site. When entering names and addresses
and making payment, users need to feel comfortable, trusting that they're still in the right place.

* [Analytics and Real User Monitoring](/payment-and-address-form-best-practices#analytics-rum):
enable the performance and usability of your form design to be tested and monitored for real users.
