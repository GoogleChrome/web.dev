---
title: SMS OTP form best practices
subhead: Learn how to optimize your SMS OTP form and improve user experience.
authors:
  - agektmr
date: 2020-12-09
updated: 2020-12-09
hero: image/admin/J3XT84NDBPLlsRN0PhLl.jpg
alt: A neon chat bubble sign.

description: |
  Asking a user to provide an OTP (one-time password) delivered via SMS is a
  common way to confirm a user's phone number. This post provides you with the
  best practices to build an SMS OTP form with great user experience.

tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - identity
  - security
  - forms
  - otp
---

{% YouTube 'sU4MpWYrGSI' %}

Asking a user to provide the OTP (one time password) delivered via SMS is a common 
way to confirm a user's phone number. There are a few use cases for SMS OTP:

* **Two-factor authentication.** In addition to username and password, SMS OTP can be
used as a strong signal that the account is owned by the person who received the
SMS OTP.
* **Phone number verification.** Some services use a phone number as the user's
primary identifier. In such services, users can enter their phone number and the
OTP received via SMS to prove their identity. Sometimes it's combined with a PIN
to constitute a two-factor authentication.
* **Account recovery.** When a user loses access to their account, there needs
to be a way to recover it. Sending an email to their registered email address or
an SMS OTP to their phone number are common account recovery methods.
* **Payment confirmation** In payment systems, some banks or credit card
issuers request additional authentication from the payer for security reasons.
SMS OTP is commonly used for that purpose.

This post explains best practices to build an SMS OTP form for the above use
cases.

{% Aside 'caution' %}
While this post discusses SMS OTP form best practices, be aware that SMS OTP is
not the most secure method of authentication by itself because phone
numbers can be recycled and sometimes hijacked. And [the concept of OTP
itself is not phishing resistant](https://youtu.be/kGGMgEfSzMw?t=1133).

If you are looking for better security, consider using
[WebAuthn](https://www.w3.org/TR/webauthn-2/). Learn more about it from the talk
"[What's new in sign-up & sign-in](https://goo.gle/webauthn-video)" at the
Chrome Dev Summit 2019 and build a reauthentication experience using a biometric 
sensor with "[Build your first WebAuthn app](https://goo.gle/WebAuthnReauthCodelab)" 
codelab.
{% endAside %}

## Checklist

To provide the best user experience with the SMS OTP, follow these steps:

* Use the `<input>` element with:
    * `type="text"`
    * `inputmode="numeric"`
    * `autocomplete="one-time-code"`
* Use `@BOUND_DOMAIN #OTP_CODE` as the last line of the OTP SMS message.
* Use the [WebOTP API](/web-otp/).

## Use the `<input>` element

Using a form with an `<input>` element is the most important best practice you
can follow because it works in all browsers. Even if other suggestions from
this post don't work in some browser, the user will still be able to enter and submit the OTP 
manually.

```html
<form action="/verify-otp" method="POST">
  <input type="text"
         inputmode="numeric"
         autocomplete="one-time-code"
         pattern="\d{6}"
         required>
</form>
```

The following are a few ideas to ensure an input field gets the best out of
browser functionality.

### `type="text"`

Since OTPs are usually five or six digit numbers, using
`type="number"` for an input field might seem intuitive because it changes the mobile 
keyboard to numbers only. This is not recommended because the browser expects an
input field to be a countable number rather than a sequence of multiple numbers,
which can cause unexpected behavior. Using `type="number"` causes up and down
buttons to be displayed beside the input field; pressing these buttons
increments or decrements the number and may remove preceding zeros.

Use `type="text"` instead. This won't turn the mobile keyboard into numbers
only, but that is fine because the next tip for using `inputmode="numeric"` does
that job.

### `inputmode="numeric"`

Use [`inputmode="numeric"`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode) 
to change the mobile keyboard to numbers only.

Some websites use `type="tel"` for OTP input fields since it also 
turns the mobile keyboard to numbers only (including `*` and `#`) when
focused. This hack was used in the past when `inputmode="numeric"`
wasn't widely supported. Since [Firefox started supporting
`inputmode="numeric"`](https://github.com/mdn/browser-compat-data/pull/6782),
there's no need to use the semantically incorrect `type="tel"` hack.

### `autocomplete="one-time-code"`

[`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) 
attribute lets developers specify what permission the browser 
has to provide autocomplete assistance and informs the browser about the 
type of information expected in the field.

With `autocomplete="one-time-code"` whenever a user receives an SMS message while a 
form is open, the operating system will parse the OTP in the SMS heuristically and
the keyboard will suggest the OTP for the user to enter. It works only on Safari 12 and 
later on iOS, iPadOS, and macOS, but we strongly recommend using it, because it is an 
easy way to improve the SMS OTP experience on those platforms.

<figure class="w-figure" style="width:300px; margin:auto;">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    `autocomplete="one-time-code"` in action.
  </figcaption>
</figure>

`autocomplete="one-time-code"` improves the user experience, but there's more you
can do by [ensuring that the SMS message complies with the origin-bound message
format](#format).

{% Aside %}
Optional attributes:

* [`pattern`](https://developer.mozilla.org/docs/Web/HTML/Attributes/pattern)
  specifies the format that the entered OTP must match. Use regular expressions to specify
  the matching pattern, for example, `\d{6}` constrains the OTP to a six digit string. Learn more about the 
  `pattern` attribute in [Use JavaScript for more complex real-time validation] 
  (https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)
  
* [`required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required)
  indicates that a field is required.

For more general form best practices, [Sam Dutton](/authors/samdutton/)'s
[Sign-in form best practices](/sign-in-form-best-practices/) is a great starting
point.
{% endAside %}

## Format the SMS text {: #format }

Enhance the user experience of entering an OTP by aligning with 
[the origin-bound one-time codes delivered via SMS](https://wicg.github.io/sms-one-time-codes/) 
specification. 

The format rule is simple: Finish the SMS message with the receiver domain
preceded with `@` and the OTP preceded with `#`.

For example:
```text
Your OTP is 123456

@web-otp.glitch.me #123456
```

Using a standard format for OTP messages makes extraction 
of codes from them easier and more reliable. Associating OTP codes with 
websites makes it harder to trick users into providing a code to malicious sites.

{% Aside %}
The precise rules are:
* The message begins with (optional) human-readable text that contains a four to
  ten character alphanumeric string with at least one number, leaving the last
  line for the URL and the OTP.
* The domain part of the URL of the website that invoked the API must be
  preceded by `@`.
* The URL must contain a pound sign ("`#`") followed by the OTP.

Make sure the number of characters doesn't exceed 140 in total.

To learn more about Chrome specific rules, read [Format the SMS message section
of WebOTP API post](/web-otp/#format).
{% endAside %}

Using this format provides a couple of benefits:

* The OTP will be bound to the domain. If the user is on domains other than 
  the one specified in the SMS message, the OTP suggestion won't appear. 
  This also mitigates the risk of phishing attacks and potential account hijacks.
* Browser will now be able to reliably extract the OTP without depending on
  mysterious and flaky heuristics.

When a website uses `autocomplete="one-time-code"`, Safari with iOS 14 or later
will suggest the OTP following the above rules.

{% Aside %}
If the user is on a desktop with macOS Big Sur with the same iCloud account set
up as on iOS, the OTP received on the iOS device will be
available on the desktop Safari as well.

To learn more about other benefits and nuances of the availability on Apple
platforms, read [Enhance SMS-delivered code security with domain-bound
codes](https://developer.apple.com/news/?id=z0i801mg).
{% endAside %}

This SMS message format also benefits browsers other than Safari. Chrome, Opera,
and Vivaldi on Android also support the origin-bound one-time codes rule with
the WebOTP API, though not through `autocomplete="one-time-code"`.

## Use the WebOTP API

[The WebOTP API](https://wicg.github.io/web-otp/) provides access to the OTP
received in an SMS message. By calling
[`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get)
with `otp` type (`OTPCredential`) where `transport` includes `sms`, the website
will wait for an SMS that complies with the origin-bound one-time codes to be
delivered and granted access by the user. Once the OTP is passed to JavaScript,
the website can use it in a form or POST it directly to the server.

{% Aside 'caution' %}
The WebOTP API requires a secure origin (HTTPS).
{% endAside %}

```js
navigator.credentials.get({
  otp: {transport:['sms']}
})
.then(otp => input.value = otp.code);
```

<figure class="w-figure" style="width:300px; margin:auto;">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    WebOTP API in action.
  </figcaption>
</figure>

Learn how to use the WebOTP API in detail in [Verify phone numbers on the web
with the WebOTP API](/web-otp/) or copy and paste the following snippet. (Make
sure the `<form>` element has an `action` and `method` attribute properly set.)

```js
// Feature detection
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    // Cancel the WebOTP API if the form is submitted manually.
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        // Cancel the WebOTP API.
        ac.abort();
      });
    }
    // Invoke the WebOTP API
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      // Automatically submit the form when an OTP is obtained.
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

Photo by [Jason Leung](https://unsplash.com/photos/mZNRsYE9Qi4) on
[Unsplash](https://unsplash.com).
