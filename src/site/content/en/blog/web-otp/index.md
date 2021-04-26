---
title: Verify phone numbers on the web with the WebOTP API
subhead: Help users with OTPs received through SMS
authors:
  - agektmr
date: 2019-10-07
updated: 2021-02-23
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: A drawing of a woman using OTP to log in to a web app.

description: |
  Finding, memorizing, and typing OTPs sent via SMS is cumbersome. The
  WebOTP API simplifies the OTP workflow for users.

tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - identity
  - capabilities
  - otp
feedback:
  - api
---

{% Aside 'gotchas' %}
If you want to learn more general SMS OTP form best practices including WebOTP
API, checkout [SMS OTP form best practices](/sms-otp-form).
{% endAside %}

## What is the WebOTP API?

These days, most people in the world own a mobile device and developers are
commonly using phone numbers as an identifier for users of their services.

There are a variety of ways to verify phone numbers, but a randomly generated
one-time password (OTP) sent by SMS is one of the most common. Sending this code
back to the developer's server demonstrates control of the phone number.

{% Aside %}
The WebOTP API was originally called the SMS Receiver API. You may still see it
named that way in some places. If you used that API, you should still read this
article. [There are significant differences](#differences) between the current
and earlier versions of the API.
{% endAside %}

This idea is already deployed in many scenarios to achieve:

* **Phone number as an identifier for the user.** When signing up for a new
  service, some websites ask for a phone number instead of an email address and
  use it as an account identifier.
* **Two step verification.** When signing in, a website asks for a one-time code
  sent via SMS on top of a password or other knowledge factor for extra
  security.
* **Payment confirmation.** When a user is making a payment, asking for a
  one-time code sent via SMS can help verify the person's intent.

The current process creates friction for users. Finding an OTP within an SMS
message, then copying and pasting it to the form is cumbersome, lowering
conversion rates in critical user journeys. Easing this has been a long standing
request for the web from many of the largest global developers. Android has [an
API that does exactly
this](https://developers.google.com/identity/sms-retriever/). So does
[iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow)
and
[Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element).

The WebOTP API lets your app receive specially-formatted messages bound to
your app's domain. From this, you can programmatically obtain an OTP from an SMS
message and verify a phone number for the user more easily.

{% Aside 'warning' %}
Attackers can spoof SMS and hijack a person's phone number. Carriers can also
recycle phone numbers to new users after an account is closed. While SMS OTP is
useful to verify a phone number for the use cases above, we recommend using
additional and stronger forms of authentication (such as multiple factors and
the [Web Authentication
API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) to
establish new sessions for these users.
{% endAside %}

## Current status

The table below explains the current status of the WebOTP API.

<table>
<tr>
<th markdown="block">
Step
</th>
<th markdown="block">
Status
</th>
</tr>
<tr>
<td markdown="block">
1. Create explainer
</td>
<td markdown="block">
<a href="https://github.com/WICG/WebOTP/blob/master/explainer.md">Complete</a>
</td>
</tr>
<tr>
<td markdown="block">
2. Create initial draft of specification
</td>
<td markdown="block">
<a href="https://wicg.github.io/WebOTP/">Complete</a>
</td>
</tr>
<tr>
<td markdown="block">
3. Gather feedback and iterate on design
</td>
<td markdown="block">
Complete
</td>
</tr>
<tr>
<td markdown="block">
4. Origin trial
</td>
<td markdown="block">
Complete
</td>
</tr>
<tr>
<td markdown="block">
<strong>5. Launch</strong>
</td>
<td markdown="block">
Chrome 84
</td>
</tr>
</table>

## Changes from earlier versions

Early versions of this API were called SMS Receiver. If you are famillar with
that version of the API be aware of the changes made to it. Improvements from
SMS Receiver API include:

* The SMS message format is now aligned with WebKit's.
* The web page only receives an OTP code regardless of whatever else is in the
  message.
* The browser's application hash code is no longer required in the message.

## See it in action

Let's say a user wants to verify their phone number with a website. The website
sends a text message to the user over SMS and the user enters the OTP from the
message to verify the ownership of the phone number.

With the WebOTP API, these steps are as easy as one tap for the user, as
demonstrated in the video. When the text message arrives, a bottom sheet pops up
and prompts the user to verify their phone number. After clicking the **Verify**
button on the bottom sheet, the browser pastes the OTP into the form and the
form is submitted without the user needing to press **Continue**.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm">
</video>

The whole process is diagrammed in the image below.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    WebOTP API diagram
  </figcaption>
</figure>

Try [the demo](https://web-otp.glitch.me) yourself. It doesn't ask for
your phone number or send an SMS to your device, but you can send one from
another device by copying the text displayed in the demo. This works because it
doesn't matter who the sender is when using the WebOTP API.

1. Go to [https://web-otp.glitch.me](https://web-otp.glitch.me) in Chrome 84 or
   later on an Android device.
1. Send your phone the following SMS text message from the another phone.

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

Did you receive the SMS and see the prompt to enter the code to the input area?
That is how the WebOTP API works for users.

{% Aside 'gotcha' %}
If the dialog doesn't appear for you, check out [the FAQ](#no-dialog).
{% endAside %}

Using the WebOTP API consists of three parts:

* A properly annotated `<input>` tag
* JavaScript in your web app
* Formatted message text sent via SMS.

I'll cover the `<input>` tag first.

## Annotate an `<input>` tag

WebOTP itself works without any HTML annotation, but for cross-browser
compatibility, I highly recommend that you add `autocomplete="one-time-code"` to
the `<input>` tag where you expect the user entering an OTP.

This allows Safari 14 or later to suggest that the user to autofill the `<input>`
field with an OTP when they receive an SMS with the format described in [Format
the SMS message](#format) even though it doesn't support WebOTP.

{% Label %}
HTML
{% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## Use the WebOTP API

Because WebOTP is simple, just copying and pasting the following code will do the
job. I'll walk you through what's happening anyway.

{% Label %}
JavaScript
{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

### Feature detection

Feature detection is the same as for many other APIs. Listening to
`DOMContentLoaded` event will wait for the DOM tree to be ready to query.

{% Label %}
JavaScript
{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    …
    const form = input.closest('form');
    …
  });
}
```

{% Aside 'caution' %}
The WebOTP API requires a secure origin (HTTPS). The feature detection on an
HTTP website will fail.
{% endAside %}

### Process the OTP

The WebOTP API itself is simple enough. Use
[`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get)
to obtain the OTP. WebOTP adds a new `otp` option to that method. It only has
one property: `transport`, whose value must be an array with the string `'sms'`.

{% Label %}
JavaScript
{% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

This triggers the browser's permission flow when an SMS message arrives. If permission is
granted, the returned promise resolves with an `OTPCredential` object.

{% Label %}
Content of obtained `OTPCredential` object
{% endLabel %}

```json
{
  code: "123456" // Obtained OTP
  type: "otp"  // `type` is always "otp"
}
```

Next, pass the OTP value to the `<input>` field. Submitting the form directly
will eliminate the step requiring the user to tap a button.

{% Label %}
JavaScript
{% endLabel %}

```js/5-6
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.error(err);
    });
    …
```

### Aborting the message {: #aborting }

In case the user manually enters an OTP and submits the form, you can cancel the
`get()` call by using an `AbortController` instance in the [`options`
object](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters).

{% Label %}
JavaScript
{% endLabel %}

```js/1,5,11
    …
    const ac = new AbortController();
    …
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    …
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
    …
```

## Format the SMS message {: #format }

The API itself should look simple enough, but there are a few things you should
know before using it. The message must be sent after
`navigator.credentials.get()` is called and it must be received on the device
where `get()` was called. Finally, the message must adhere to the following
formatting:

* The message begins with (optional) human-readable text that contains a four to ten
  character alphanumeric string with at least one number leaving the last line
  for the URL and the OTP.
* The domain part of the URL of the website that invoked the API must be preceded
  by `@`.
* The URL must contain a pound sign ('`#`') followed by the OTP.

For example:

```text
Your OTP is: 123456.

@www.example.com #123456
```

## Demos

Try various messages with the demo:
[https://web-otp.glitch.me](https://web-otp.glitch.me)

You may also fork it and create your version:
[https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp).

{% Glitch {
  id: 'web-otp',
  path: 'views/index.html',
  previewSize: 0,
  allow: []
} %}

## FAQ

### The dialog doesn't appear though I'm sending a properly formatted message. What's going wrong? {: #no-dialog}

There are a couple of caveats when testing the API:
* If the sender's phone number is included in the receiver's contact list, this
  API will not be triggered due to the design of the underlying [SMS User
  Consent
  API](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages).
* If you are using a work profile on your Android device and the WebOTP does
  not work, try installing and using Chrome on your personal profile instead
  (i.e. the same profile in which you receive SMS messages).

### Where do I report bugs in Chrome's implementation?

Did you find a bug with Chrome's implementation?

* File a bug at
  [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS).
  Include as much detail as you can, simple instructions for reproducing, and
  set **Components** to `Blink>WebOTP`.

### How can I help this feature?

Are you planning to use the WebOTP API? Your public support helps us prioritize
features, and shows other browser vendors how critical it is to support them.
Send a tweet to [@ChromiumDev](https://twitter.com/chromiumdev) using the hashtag
[`#WebOTP`](https://twitter.com/search?q=%23WebOTP&src=typed_query&f=live)
and let us know where and how you're using it.

### What are the differences with the SMS Receiver API? {: #differences }

Consider WebOTP API an evolved version of the SMS Receiver API. WebOTP API has
a few significant differences compared to the SMS Receiver API.

* The [expected text format](#format) for the SMS message has changed.
* It no longer requires an app hash string to be included in the SMS message.
* The method called is now `navigator.credentials.get()` rather than
  `navigator.sms.receive()`.
* The `get()` receives only the OTP rather than the entire SMS message as
  `receive()` did before.
* It's now possible to [abort the call to `get()`](#aborting).

### Is this API compatible between different browsers?

Chromium and WebKit agreed on [the SMS text message
format](https://wicg.github.io/sms-one-time-codes) and [Apple announced Safari's
support for it](https://developer.apple.com/news/?id=z0i801mg) starting in iOS 14
and macOS Big Sur. Though Safari doesn't support the WebOTP JavaScript API, by
annotating `input` element with `autocomplete=["one-time-code"]`, the default
keyboard automatically suggests that you enter the OTP if the SMS message complies
with the format.

### Is it safe to use SMS as a way to authenticate?

While SMS OTP is useful to verify a phone number when the number is first
provided, phone number verification via SMS must be used carefully for
re-authentication since phone numbers can be hijacked and recycled by carriers.
WebOTP is a convenient re-auth and recovery mechanism, but services should
combine it with additional factors, such as a knowledge challenge, or use the
[Web Authentication
API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
for strong authentication.

{% Aside %}
Find more questions at [the FAQ section in the explainer](https://github.com/WICG/WebOTP/blob/master/FAQ.md).
{% endAside %}
