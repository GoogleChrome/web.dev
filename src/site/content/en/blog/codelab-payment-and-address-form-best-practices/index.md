---
layout: codelab
title: Payment and address form best practices codelab
authors:
  - samdutton
scheduled: true
date: 2020-11-25
updated: 2020-11-25
description: Learn best practices for payment and address forms.
tags:
  - ecommerce
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
glitch: payment-and-address-form-codelab-0
glitch_path: index.html
related_post: payment-and-address-form-best-practices
---

This codelab shows you how to build payment and address forms that are secure, accessible and easy to use.

First: build a payment form.

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
* Add the following code inside the `<body>` element:

```html
<main>
    
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

</main>
```

Here's how your `index.html` should look at this point:

{% Glitch {
  id: 'payment-form-codelab-1',
  path: 'index.html',
  height: 270
} %}

Click **View App** to preview your payment form. 

* Does the form work well enough as it is?
* Is there anything you would change to make it work better?
* How about on mobile?

Click **View Source** to return to your source code.

## Step 2: Design for fingers and thumbs

The HTML you added is valid, but the default browser styling makes the form hard to use, especially 
on mobile. It doesn't look great either!

You need to ensure your inputs work well on a range of devices by adjusting padding, margins, and 
font sizes. 

Copy and paste the following CSS into your own `style.css` file:

{% Glitch {
  id: 'sign-in-form-codelab-2',
  path: 'style.css'
} %}

Click **View App** to see the styled form. 

Now click **View Source** to return to `style.css`.

That's a lot of CSS! The main things to be aware of are the changes to sizes:

* `padding` and `margin` are added to inputs.
* `font-size` is different for different viewport sizes.

You'll also notice that borders are tweaked, and `display: block;` is used for labels so they go 
on a line on their own. Inputs are full width. 

The `:invalid` selector is used to indicate when an input has an invalid value.
(You'll make that work later in the codelab.)

The CSS layout is mobile-first:

* The default CSS is for viewports less than `400px` wide.
* [Media queries](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries) are 
used to override the default for viewports that are at least `400px` wide, and then again for 
viewports that are at least `500px` wide.

Whenever you build for the web, you need to test on different devices and viewport sizes. That's 
especially true for forms, because one small glitch can make them unusable.

There are several ways to test your form on different devices:

* [Use Chrome DevTools Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode) 
to simulate mobile devices. 
* [Send the URL from your computer to your phone](https://support.google.com/chrome/answer/9430554).
* Use a service such as [BrowserStack](https://www.browserstack.com/open-source) to test on a range 
of devices and browsers. 

* Is the whole form visible? 
* Are the form inputs big enough? 
* Is all the text readable?
* Did you notice any differences between using a real mobile device, and viewing the form in 
Device Mode in Chrome DevTools?

## Step 3: Add input attributes to enable built-in browser features

Enable the browser to store and autofill input values, and provide access to 
built-in password management features.

Add attributes to your form HTML so it looks like this:

```html/5,6,10,11,16,17,20,21
<form action="#" method="post">

  <h1>Payment form</h1>

  <section>        
    <label for="cc-number">Card number</label>
    <input id="cc-number" name="cc-number" inputmode="numeric" autocomplete="cc-number" pattern="[\d ]{10,30}" required>
  </section>

  <section>        
    <label for="cc-name">Name on card</label>
    <input id="cc-name" name="cc-name" autocomplete="cc-name" pattern="[\p{L} \-\.]+" required>
  </section>
  
  <section id="cc-exp-csc">      
    <div>
      <label for="cc-exp">Expiry date</label>
      <input id="cc-exp" name="cc-exp" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp" required>
    </div> 
    <div>
      <label for="cc-csc">Security code</label>
      <input id="cc-csc" name="cc-csc" maxlength="3" autocomplete="cc-csc" required>
      <div class="explanation">Back of card, last 3 digits</div>
    </div>
  </section>  

  <button id="complete-payment">Complete payment</button>

</form>
```

View your app again and then click in the **Card number** field. What happens?

Tap in the card number input on a mobile device. Notice how the 

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
  id: 'payment-and-address-form-codelab-3',
  path: 'index.html',
  height: 480
} %}

## Step 4: XXXXX

## Step 5: XXXXX



**For bonus points:** try out something blah blah blah.

Here's how your code should look at this point:

{% Glitch {
  id: 'payment-and-address-form-codelab-5',
  path: 'style.css',
  height: 480
} %}

## Going further

We won't show them here, but four crucial payment-and-address form features are still missing:

* Add a **Forgot your password?** link: make it easy for users to reset their password.

* Link to your Terms of Service and privacy policy documents: make it clear to 
users from the start how you safeguard their data.

* Consider style and branding: make sure these match the rest of your site. 

* Add [Analytics and RUM](/payment-and-address-form-best-practices#analytics): enable the 
performance and usability of your form design to be tested and monitored for 
real users. 
