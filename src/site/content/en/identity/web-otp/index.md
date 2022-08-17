---
layout: post
title: Verify phone numbers on the web with the WebOTP API
subhead: Help users with OTPs received through SMS
authors:
  - agektmr
date: 2019-10-07
updated: 2022-08-12
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: A drawing of a woman using OTP to log in to a web app.

description: |
  Finding, memorizing, and typing OTPs sent via SMS is cumbersome. The
  WebOTP API simplifies the OTP workflow for users.

tags:
  - identity
  - capabilities
  # - otp
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
API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) to
establish new sessions for these users.
{% endAside %}

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

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %}
  <figcaption>
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

{% Aside 'gotchas' %}

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

{% Label %}HTML{% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## Use the WebOTP API

Because WebOTP is simple, just copying and pasting the following code will do the
job. I'll walk you through what's happening anyway.

{% Label %}JavaScript{% endLabel %}

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

{% Label %}JavaScript{% endLabel %}

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

{% Label %}JavaScript{% endLabel %}

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

{% Label %}Content of obtained `OTPCredential` object{% endLabel %}

```json
{
  code: "123456" // Obtained OTP
  type: "otp"  // `type` is always "otp"
}
```

Next, pass the OTP value to the `<input>` field. Submitting the form directly
will eliminate the step requiring the user to tap a button.

{% Label %}JavaScript{% endLabel %}

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

Here are bad examples:

|Example malformed SMS Text|Why this won't work|
|--------------------------|-------------------|
|`Here is your code for @example.com #123456`|`@` is expected to be the first character of the last line.|
|`Your code for @example.com is #123456`|`@` is expected to be the first character of the last line.|
|`Your verification code is 123456`<br/><br/>`@example.com\t#123456`|A single space is expected between `@host` and `#code`.|
|`Your verification code is 123456`<br/><br/>`@example.com`<code>&nbsp;&nbsp;</code>`#123456`|A single space is expected between `@host` and `#code`.|
|`Your verification code is 123456`<br/><br/>`@ftp://example.com #123456`|URL scheme cannot be included.|
|`Your verification code is 123456`<br/><br/>`@https://example.com #123456`|URL scheme cannot be included.|
|`Your verification code is 123456`<br/><br/>`@example.com:8080 #123456`|Port cannot be included.|
|`Your verification code is 123456`<br/><br/>`@example.com/foobar #123456`|Path cannot be included.|
|`Your verification code is 123456`<br/><br/>`@example .com #123456`|No whitespace in domain.|
|`Your verification code is 123456`<br/><br/>`@domain-forbiden-chars-#%/:<>?@[] #123456`|No [forbidden chars](https://url.spec.whatwg.org/#forbidden-host-code-point) in domain.|
|`@example.com #123456`<br/><br/>`Mambo Jumbo`|`@host` and `#code` are expected to be the last line.|
|`@example.com #123456`<br/><br/>`App hash #oudf08lkjsdf834`|`@host` and `#code` are expected to be the last line.|
|`Your verification code is 123456`<br/><br/>`@example.com 123456`|Missing `#`.|
|`Your verification code is 123456`<br/><br/>`example.com #123456`|Missing `@`.|
|`Hi mom, did you receive my last text`|Missing `@` and `#`.|

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

## Use WebOTP from a cross-origin iframe

Entering an SMS OTP to a cross-origin iframe is typically used for payment
confirmation, especially with 3D Secure. Having the common format to support
cross-origin iframes, WebOTP API delivers OTPs bound to nested origins. For
example:

* A user visits `shop.example` to purchase a pair of shoes with a credit card.
* After entering the credit card number, the integrated payment provider shows a
  form from `bank.example` within an iframe asking the user to verify their
  phone number for fast checkout.
* `bank.example` sends an SMS that contains an OTP to the user so that they can
  enter it to verify their identity.

To use WebOTP API from within a cross-origin iframe, you need to do two things:

* Annotate both the top-frame origin and the iframe origin in the SMS text
  message.
* Configure permissions policy to allow the cross-origin iframe to receive OTP
  from the user directly.

<figure>
{% Video
  src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4",
  autoplay="true",
  controls="true",
  loop="true",
  muted="true",
  preload="auto",
  width="300",
  height="600"
%}
  <figcaption>
    WebOTP API within an iframe in action.
  </figcaption>
</figure>

You can try the demo at
[https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io).

### Annotate bound-origins to the SMS text message

When WebOTP API is called from within an iframe, the SMS text message must
include the top-frame origin preceded by `@` followed by the OTP preceded by `#`
and the iframe origin preceded by `@` at the last line.

```text
Your verification code is 123456

@shop.example #123456 @bank.exmple
```

### Configure Permissions Policy

To use WebOTP in a cross-origin iframe, the embedder must grant access to this
API via otp-credentials [permissions
policy](https://www.w3.org/TR/permissions-policy-1) to avoid unintended
behavior. In general there are two ways to achieve this goal:

{% Label %}via HTTP Header:{% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %}via iframe `allow` attribute:{% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

See [more examples on how to specify a permission policy
](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/#example-permissions-policy-setups/).

{% Aside %}

At the moment Chrome only supports WebOTP API calls from cross-origin iframes
that have **no more than one** unique origin in its ancestor chain. In the
following scenarios:

<ul>
  <li>`a.com` -> `b.com`</li>
  <li>`a.com` -> `b.com` -> `b.com`</li>
  <li>`a.com` -> `a.com` -> `b.com`</li>
  <li>`a.com` -> `b.com` -> `c.com`</li>
</ul>

using WebOTP in `b.com` is supported but using it in `c.com` is not.

Note that the following scenario is also not supported because of lack of demand
and UX complexities.

<ul>
  <li>`a.com` -> `b.com` -> `a.com` (calls WebOTP API)</li>
</ul>

{% endAside %}

## Use WebOTP on desktop

In Chrome, WebOTP supports listening for SMSes received on other devices to
assist users in completing phone number verification on desktop.

<figure>
{% Video
  src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/iUUGcawm8LJpGH3PFxNZ.mp4",
  autoplay="true",
  controls="true",
  loop="true",
  muted="true",
  preload="auto"
%}
  <figcaption>
    WebOTP API on desktop.
  </figcaption>
</figure>

This capability requires the user to sign-in to the same Google account on both
desktop Chrome and Android Chrome.

All developers have to do is to implement WebOTP API on their desktop website,
the same way they do on their mobile website, but no special tricks are
required.

Learn more details at [Verify a phone number on desktop using WebOTP
API](https://developer.chrome.com/blog/cross-device-webotp/).

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

Check back at [the format](#format) to see if your SMS is correctly formatted.

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
API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)
for strong authentication.

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

{% Aside %}
Find more questions at [the FAQ section in the explainer](https://github.com/WICG/WebOTP/blob/master/FAQ.md).
{% endAside %}

## Resources {: #resources }

* [SMS OTP form best practices](/sms-otp-form/)
* [Verify a phone number on desktop using WebOTP
  API](https://developer.chrome.com/blog/cross-device-webotp/)
* [Fill OTP forms within cross-origin iframes with WebOTP API](/web-otp-iframe/)
* [Yahoo! JAPAN's password-free authentication reduced inquiries by 25%, sped up
  sign-in time by 2.6x](/yahoo-japan-identity-case-study/)
