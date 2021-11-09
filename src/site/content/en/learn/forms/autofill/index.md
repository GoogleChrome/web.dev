---
title: Autofill
description: >
  Learn all about autofill and the autocomplete attribute.
authors:
  - michaelscharnagl
date: 2021-11-03
---

Having to re-enter your address for the tenth time is tiring. 
Browsers, and you, as a developer, can help users enter data faster, and avoid re-entering data. 
This module teaches you how autofill works, and how `autocomplete` and other element attributes can 
ensure that browsers offer appropriate autofill options.

## How does autofill work?

In the [intro to autofill](/learn/forms/auto), you already learned the basics of autofill. 
But why do browsers offer autofill?

Filling out forms isn't an interesting activity, 
but still something you do often. 
Over time, you fill out many forms, 
and you often fill in the same data. 
One way to help users fill out forms faster is by offering them the option 
to automatically fill in form fields with previously entered data. That's autofill. 

How do browsers know what data to autofill? 
Let's have a look at an example form field to find out.

```html
<label for="name">Name</label>
<input name="name" id="name">
```

If you submit this form field, 
browsers store the value (the data you entered) along with the value of the `name` attribute (name). 
Some browsers also look at the `id` attribute when storing and filling in data.

Say, weeks later, you fill out another form on another website. 
This site also contains a form field with `name="name"`. 
Your browser can now offer autofill, because a value for name is already stored.

{% Aside %}
Use the [`:autofill`](https://developer.mozilla.org/docs/Web/CSS/:autofill) 
CSS pseudo-class to style form controls that the browser has autofilled. 
Use `:autofill` and the prefixed version `:-webkit-autofill` for best browser compatibility.
{% endAside %}

Autofill is especially useful in forms you regularly use, 
such as sign-up and sign-in, payment, checkout, 
and forms where you have to enter your name or address.

Let's see how you can help browsers offer the best autofill options by using appropriate values for the `autocomplete` attribute.
Help users to enter their address
There are many possible values for `autocomplete`. Let's have a look at addresses first.

{% Codepen {
  user: 'web-dot-dev',
  id: 'f6eac7a585a34d0c2de36a365eaa8662',
  height: 600,
  tab: 'result,html'
} %}

Does your browser already have an address saved for you? 
Great! After you interact with the first field in the address form, 
the browser shows you a list of saved addresses. 
You can choose one, and the browser fills in all fields related to the address. 
Autofill makes filling out forms fast and easy.

Not every address form has the same fields, 
and the order of fields also varies. 
Using the correct values for `autocomplete` ensures that the browser fills in the correct values for a form. 
There are values for `country`, `postal-code`, and 
[many more](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete#values).

{% Aside %}
You can define multiple values separated by a space for `autocomplete`. 
Say, you have a form with a shipping address and another form for a billing address. 
To tell the browser which is the postal code for the billing address, 
you can use `autocomplete="billing postal-code"`. 
For the shipping address, use `shipping` as the first value.
{% endAside %}

## Ensure users can sign in fast and use secure passwords

Many people aren't good at remembering passwords. 
The 
[most common password](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords) is '123456', 
followed by other easy-to-remember combinations. 
How can you use secure and unique passwords without remembering them all? 

Browsers have built-in passwords managers to generate, save, and fill in passwords for you. 
Let's see how you can help browsers with autofilling emails and managing passwords.

{% Codepen {
  user: 'web-dot-dev',
  id: 'e7e95d2d671d577b0a141aaab4388b28',
  height: 380
} %}

You can use `autocomplete="email"` for an email field, 
so users get the autofill option for an email address.

As this is a sign-up form, users shouldn't get the option to fill in previously used passwords. 
You can use `autocomplete="new-password"` to ensure browsers offer the option to generate a new password.

{% Aside %}
To ensure a secure sign-up form it may be better to use a 
[third-party identity provider](/sign-up-form-best-practices/#federated-login), 
instead of building your own 
[authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) system.
{% endAside %}

On the sign-in form, you can use `autocomplete="current-password"` 
to tell browsers to offer the option to fill in previously saved passwords for this website. 

You can set up two-factor authentication on many websites. 
In addition to the password, a one-time code is sent via SMS or a two-factor authentication app. 

Wouldn't it be great if the code you received in the SMS message was suggested by the on-screen keyboard, 
and you could directly select it to fill in the value? On Safari 14 or later, you can use 
[`autocomplete="one-time-code"`](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element) to achieve this. 
On Chrome on Android, you can use the 
[WebOTP API](/web-otp) to achieve this with JavaScript.

Learn more about how to verify phone numbers on the web with the 
[SMS OTP form best practices](/sms-otp-form/).

{% Aside 'caution' %}
SMS isn't the most secure method of authentication by itself, 
because phone numbers can be recycled and hijacked. 
Consider using other two-factor authentication methods or multifactor authentication.

Learn more about 
[multifactor authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html).
{% endAside %}

## Help users fill in their credit card information

On many e-commerce websites, you can use your credit card to purchase products. 
Sites may use third-party payment platforms that provide their own forms, 
but if you do need to build your own payment forms, 
make sure people can easily fill in payment information.

You can use the `autocomplete` attribute again, 
to ensure browsers offer the correct autofill options. 

There are values for the credit card number `cc-number`, credit card expiration date `cc-exp`, 
and [all other information needed](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete#values) for a credit card payment.

Use a single input for numbers 
such as credit card numbers and telephone numbers, 
to ensure browsers offer autofill. 
Use standard form elements, for example, 
a `<select>` for the payment card dates, 
instead of custom elements, to ensure autocomplete is available.

Learn more about 
[helping users to avoid re-entering payment data](/learn/forms/payment/#help-users-enter-their-payment-details).

## Ensure autofill works for all your fields

In addition to addresses, account information, and credit card information, 
there are many more fields where browsers can help users with autofill. 

When adding a telephone field to your form check if you can use any of the 
[available values](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete#values) for autocomplete. 
Found an appropriate value for your form field? Add it. 

Using suitable values for the `autocomplete` attribute helps browsers offer the best autofill option, 
and helps users fill out forms faster.

## Help browsers understand that a field shouldn't be autofilled 

You learned how autofill works, how you can help browsers with autofill, 
and why autofill makes it convenient for users to fill out forms. 
Sometimes, though, you don't want browsers to offer autofill. Let's have a look.

```html
<label for="one-time-code">One-time code</label>
<input autocomplete="off" type="text" name="one-time-code" id="one-time-code">
```

One place where autofill isn't helpful is when entering one-off, 
unique values such as a one-time code field. 
The value is different every time, 
and the browser shouldn't save values or offer an autofill option. 
You can use `autocomplete="off"` for such fields to prevent autofill.

{% Aside %}
Autofill and autocomplete provide accessibility benefits. 
Using autofill, people don't have to remember information or manually re-enter data. 

For more information, see the 
[W3C accessibility guidelines](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html)
{% endAside %}

Another use case for `autocomplete="off"` is a honeypot field (see [previous module](/learn/forms/security-privacy/#a-honeypot)). 
Even though the field isn't visible, browsers may autofill it with the rest of the fields. 
Turning autofill off ensures a real user isn't identified as a bot, 
due to the field being completed automatically.

{% Aside %}
You learned how important it is to use unique, and secure passwords. 
In-browser password managers ensure that you use strong passwords. 
Therefore browsers will still offer autofill options for passwords, even though `autocomplete="off"` is used, 
to allow these password managers to do their job. 

Learn more about 
[the autocomplete attribute and sign-in fields](https://developer.mozilla.org/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields).
{% endAside %}

You should only disable autofill if you are sure it will help users.

{% Assessment 'autofill' %}

## Resources

- The [autocomplete attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete).
- [Payment and address form best practices](/payment-and-address-form-best-practices)
