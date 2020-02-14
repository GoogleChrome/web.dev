---
title: Verify phone numbers on the web with the SMS Receiver API
subhead: Help users type OTPs received through SMS
authors:
  - agektmr

date: 2019-10-07

hero: hero.png
alt: A drawing of a woman using OTP to log in to a web app.

description: |
  Finding, memorizing, and typing OTPs sent via SMS is cumbersome. The
  SMS Receiver API simplifies the OTP workflow for users.

tags:
  - post # post is a required tag for the article to show up in the blog.
  - identity
  - sms
  - capabilities
  - fugu
---


## What is the SMS Receiver API?

These days, most people in the world own a mobile device and developers are
commonly using phone numbers as an identifier for users of their services.

There are a variety of ways to verify phone numbers, but a randomly generated
one-time password (OTP) sent by SMS to the number is one of the most common.
Sending this code back to the developer's server demonstrates control of the
phone number.

This idea is already deployed in many scenarios to achieve:

* **Phone number as an identifier for the user.** When signing up for a new
  service, some websites ask for a phone number instead of an email address and
  use it as an account identifier.
* **Two step verification.** When signing in, a website asks for a one-time code
  sent via SMS on top of a password or other knowledge factor for extra
  security.
* **Payment confirmation.** When a user is making a payment, asking for a
  one-time code sent via SMS can help verify the person's intent.


The current process creates friction for the user. Finding an OTP within an SMS
message, then copying and pasting it to the form is cumbersome, lowering
conversion rates in critical user journeys. Easing this has been a long standing
request for the web from many of the largest global developers. Android has [an
API that does exactly
this](https://developers.google.com/identity/sms-retriever/). So does
[iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow)
and
[Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element).

The SMS Receiver API lets your app receive specially-formatted messages bound to
your app's origin. From this, you can programmatically obtain an OTP from an SMS
message and verify a phone number for the user more easily. Sign up for the
[Origin
Trial](https://developers.chrome.com/origintrials/#/view_trial/607985949695016961)
now if you are interested!

{% Aside 'warning' %}
Attackers can spoof SMS and can hijack a person's phone
number. Carriers can also recycle phone numbers to new users after an account
was closed. While SMS OTP is useful to verify a phone number for the use cases
above, we recommend using additional and stronger forms of authentication (such
as multiple factors and [WebAuthn](https://www.w3.org/TR/webauthn/)) to
establish new sessions for these users.
{% endAside %}

## Current status

The table below explains the current status of the SMS Receiver API.

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
<a href="https://github.com/samuelgoto/sms-receiver/blob/master/README.md" >Complete</a>
</td>
</tr>
<tr>
<td markdown="block">
2. Create initial draft of specification
</td>
<td markdown="block">
In Progress
</td>
</tr>
<tr>
<td markdown="block">
3. Gather feedback and iterate on design
</td>
<td markdown="block">
In Progress
</td>
</tr>
<tr>
<td markdown="block">
<strong>4. Origin trial</strong>
</td>
<td markdown="block">
<strong>Starts in Chrome 78</strong><br/>
Expected to run through Chrome 81
</td>
</tr>
<tr>
<td markdown="block">
5. Launch
</td>
<td markdown="block">
Not started
</td>
</tr>
</table>

## See it in action

Let's say a user wants to verify their phone number with a website. The website
sends a text message to the user over SMS and the user enters the OTP from the
message to verify the ownership of the phone number.

With the SMS Receiver API, these steps will become as easy as one tap for the
user, as demonstrated in the video. As the text message arrives, a bottom
sheet pops up and prompts the user to verify their
phone number. After clicking the **Verify** button within the bottom sheet,
the browser pastes the OTP into the form and the form is submitted without
the user needing to press **Continue**.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/sms-receiver-announce/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/sms-receiver-announce/demo.webm" type="video/webm">
</video>

The whole process is diagrammed in the image below.

<figure class="w-figure w-figure--center">
  <img src="./diagram.png" width="486" height="499" />
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    SMS Receiver API diagram
  </figcaption>
</figure

Try [the demo](https://sms-receiver-demo.glitch.me) yourself. It doesn't ask for
your phone number or send an SMS to your device, but you can send one from another
device by copying the text displayed on the demo. This works because it doesn't matter who
the sender is when using the SMS Receiver API.

1. Prepare Google Chrome on Android 78 or later with the **Experimental Web Platform
   features** flag turned on at
   `chrome://flags/#enable-experimental-web-platform-features`.
2. Go to
   [https://sms-receiver-demo.glitch.me](https://sms-receiver-demo.glitch.me).
3. Select your browser channel from the provided list.
4. Press **Copy** to copy the text message and send it to another phone.
5. Press **Verify**.
6. From the other phone, send yourself the copied text message via SMS.

Did you receive the SMS and see the prompt to enter the code to the input area?
That is how the SMS Receiver API works for end users.

{% Aside 'warning' %}
If you are using a Work Profile on your Android device and the SMS Receiver does
not seem to be working, try installing and using Chrome on your personal profile
instead (i.e. the same profile in which you receive SMS messages).
{% endAside %}

## Using the SMS Receiver API

Using the SMS Receiver API consists of two parts: JavaScript code in your web
app and the formatted message text sent via SMS.

{% Aside %}
The SMS Receiver API requires a secure origin (HTTPS).
{% endAside %}

### Feature detection

Feature detection is much the same as for many other APIs:

```js
if ('sms' in navigator) {
  ...
}
```

### Process the OTP

The SMS Receiver API itself is simple enough:

```js
const sms = await navigator.sms.receive();
```

Once a user taps **Verify**, displayed in the bottom sheet, the promise
containing the entire text message will resolve. You can use a regular
expression to extract the OTP and verify the user. Notably, you should parse and
use the SMS message assuming it could have been altered by an attacker inserting
their own SMSes into your app (e.g. following the formatting convention and
sending it right after you called `navigator.sms.receive()`). For example, if a
text message contains a six digit verification code following `otp=`, the code
would look like this:

```js
const code = sms.content.match(/^[\s\S]*otp=([0-9]{6})[\s\S]*$/m)[1];
```

You can now submit the code to the server to verify it.

### Formatting the SMS message

The API itself should have looked simple enough, but a critical part is to
format your SMS text message according to a specific convention. The message has
to be sent after `navigator.sms.receive()` is called and must comply with a
formatting convention.

The SMS message must be received on the device where `navigator.sms.receive()`
was called.

The message must adhere to the following formatting:

* The origin part of the URL of the website that invoked the API. It must be
  preceded by `For: `.
* The URL must contain (for [the time
  being](https://github.com/samuelgoto/sms-receiver/issues/4#issuecomment-528991114))
  a query parameter whose value is the application hash of the user's Chrome
  instance. (These are static strings. See the table below.)
* The URL must contain a query parameter `otp` whose value is the OTP.

An example message that can be retrieved by the browser would look like this:

```text
Your OTP is: 123456.

For: https://sms-receiver-demo.glitch.me/?otp=123456&xFJnfg75+8v
```

The application hash of Chrome instances are static. Use one of these strings
for development depending on which Chrome build you will be working with.

<table>
<tr>
<th markdown="block">
<strong>Chrome build</strong>
</th>
<th markdown="block">
<strong>APK hash string</strong>
</th>
</tr>
<tr>
<td markdown="block">
Chrome Beta
</td>
<td markdown="block">
<code>xFJnfg75+8v</code>
</td>
</tr>
<tr>
<td markdown="block">
Chrome Stable
</td>
<td markdown="block">
<code>EvsSSj4C6vl</code>
</td>
</tr>
</table>

### Demos

Try various messages with the demo:
[https://sms-receiver-demo.glitch.me](https://sms-receiver-demo.glitch.me)

You may also fork it and create your version:
[https://glitch.com/edit/#!/sms-receiver-demo](https://glitch.com/edit/#!/sms-receiver-demo).

### Enabling support during the origin trial

Starting in Chrome 78, [the SMS Receiver API is available as an origin trial on
Chrome for
Android](https://developers.chrome.com/origintrials/#/view_trial/607985949695016961).
Origin trials allow you to try new features and give feedback on their
usability, practicality, and effectiveness, both to the Chrome team and to the
web standards community. For more information, see the [Origin Trials Guide for
Web
Developers](https://googlechrome.github.io/OriginTrials/developer-guide.html).

To participate in an origin trial:

1. Request a
   [token](https://developers.chrome.com/origintrials/#/view_trial/607985949695016961)
   for your origin.
1. Add the token to your pages, there are two ways to provide this token on any
   page in your origin:
    * Add an `origin-trial <meta>` tag to the head of any page:
      `<meta http-equiv="origin-trial" content="TOKEN_GOES_HERE">`
    * If you can configure your server, you can also provide the token on pages
      using an `Origin-Trial` HTTP header:
      `Origin-Trial: TOKEN_GOES_HERE`

## Feedback

We want to hear about your experiences with the SMS Receiver API. Please sign up
for the [Origin
Trial](https://developers.chrome.com/origintrials/#/view_trial/607985949695016961)
now!

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or are there
missing methods or properties that you need to implement your idea?

* File an issue on the [SMS Receiver API explainer GitHub
  repo](https://github.com/samuelgoto/sms-receiver), or add your thoughts to an
  existing issue.

### Problem with the implementation?

Did you find a bug with Chrome's implementation?

* File a bug at
  [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts).
  Include as much detail as you can, simple instructions for reproducing, and
  set **Components** to `Blink>SMS`.

### Planning to use the API?

Planning to use the SMS Receiver API? Your public support helps us prioritize
features, and shows other browser vendors how critical it is to support them.

* Be sure you have signed up for the [SMS Receiver Origin
  Trial](https://developers.chrome.com/origintrials/#/view_trial/607985949695016961)
  to show your interest and provide your domain and contact info.
* Send a Tweet to [@ChromiumDev](https://twitter.com/chromiumdev) with
  `#smsreceiver` and let us know where and how you're using it.

## FAQ
### Why did you not align with Safari's `one-time-code`?

We're exploring options similar to Safari's declarative
[`autocomplete="one-time-code"`](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element)
approach as we go through our origin trial ([early
exploration](https://chromium-review.googlesource.com/c/chromium/src/+/1639728))
and we are interested to hear what developers and users think. Our imperative
approach could provide a more flexible UX and reduce friction when verifying a phone
number under certain circumstances. The declarative approach is easier to
implement for developers, but requires a form field and at least several taps:
focus on the input field, select the one-time-code, then submit the form. The
approach we are exploring (inspired by what native [Android
apps](https://developers.google.com/identity/sms-retriever/overview) have access
to) means that people make only a single tap on browser UI inline on the page
content.

### Is it safe to use SMS as a way to authenticate?

While SMS OTP is useful to verify a phone number when the number is first
provided, phone number verification via SMS must be used carefully for returning
user re-authentication since phone numbers can be hijacked and recycled by
carriers. SMS OTP is a convenient re-auth and recovery mechanism, but services
should combine it with additional factors, such as a knowledge challenge, or use
[WebAuthn](https://www.w3.org/TR/webauthn/) for strong authentication.

### Can't we omit the browser's app hash?

We would [like to remove
it](https://github.com/samuelgoto/sms-receiver/issues/4#issuecomment-528991114),
but it's currently a platform restriction. We are working with the Android
team to understand what's the best way to approach it.

### Will an SMS message timeout?

Yes. We're planning to use `AbortController` to time the request out ([tracking
bug](https://bugs.chromium.org/p/chromium/issues/detail?id=976401)), but it's
not implemented as of Chrome 78.

### Will the apk hash change for an installed PWA?

No. A PWA's app hash is the same as the browser it runs in.

### Can we localize the "For:" string required in the SMS?

Not right now. But ultimately, we are planning to remove it or otherwise allow for
localization.

{% Aside %}
Find more questions at [the FAQ section in the explainer](https://github.com/samuelgoto/sms-receiver/blob/master/FAQ.md).
{% endAside %}
