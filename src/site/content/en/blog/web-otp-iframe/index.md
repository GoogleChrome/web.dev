---
title: Fill OTP forms within cross-origin iframes with WebOTP API
subhead: WebOTP API can now receive OTPs from within iframes.
authors:
  - yigu
  - agektmr
date: 2021-04-21
hero: image/YLflGBAPWecgtKJLqCJHSzHqe2J2/cjCJPMZpWEK9MgnH3MK1.jpg
alt: A man entering the credit card number on a computer.

description: |
  WebOTP API can now receive an OTP from within an iframe.

tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - identity
  - capabilities
feedback:
  - api
---
SMS OTPs (one-time passwords) are commonly used to verify phone numbers, for
example as a second step in authentication, or to verify payments on the web. 
However, switching between the browser and the SMS app, to copy-paste or manually
enter the OTP makes it easy to make mistakes and adds friction to the user experience.

The [WebOTP API](/web-otp) gives websites the ability to programmatically
obtain the one-time password from a SMS message and enter it
automatically in the form for the users with just one tap without switching the
app. The SMS is specially-formatted and bound to the origin, so it mitigates
chances for phishing websites to steal the OTP as well.

One use case that has yet to be supported in WebOTP was targeting an origin
inside an iframe. This is typically used for payment confirmation, especially
with [3D Secure](https://en.wikipedia.org/wiki/3-D_Secure). Having [the common
format to support cross-origin
iframes](https://wicg.github.io/sms-one-time-codes/), WebOTP API now delivers
OTPs bound to nested origins starting in Chrome 91.

## How WebOTP API works

WebOTP API itself is simple enough:

```js
…
  const otp = await navigator.credentials.get({
    otp: { transport:['sms'] }
  });
…
```

The SMS message must be [formatted with the origin-bound one-time
codes](/web-otp/#format).

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

Notice that at the last line it contains the origin to be bound to preceded with
a `@` followed by the OTP preceded with a `#`.

When the text message arrives, an info bar pops up and prompts the user to
verify their phone number. After the user clicks the `Verify` button, the
browser automatically forwards the OTP to the site and resolves the
`navigator.credentials.get()`. The website can then extract the OTP and complete
the verification process.

Learn the basics of using WebOTP at [Verify phone numbers on the web with the
WebOTP API](/web-otp/).

## Cross-origin iframes use cases

Entering an OTP in a form within a cross-origin iframe is common in payment
scenarios. Some credit card issuers require an additional verification step to
check the payer's authenticity. This is called 3D Secure and the form is
typically exposed within an iframe on the same page as if it's a part of the
payment flow.

For example:

* A user visits `shop.example` to purchase a pair of shoes with a credit card.
* After entering the credit card number, the integrated payment provider shows a
  form from `bank.example` within an iframe asking the user to verify their
  phone number for fast checkout.
* `bank.example` sends an SMS that contains an OTP to the user so that they can
  enter it to verify their identity.

## How to use WebOTP API from a cross-origin iframe

To use WebOTP API from within a cross-origin iframe, you need to do two
things:

* Annotate both the top-frame origin and the iframe origin in the SMS text
  message.
* Configure permissions policy to allow the cross-origin iframe to receive OTP
  from the user directly.

<figure class="w-figure">
{% Video
  src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4",
  autoplay="true",
  controls="true",
  loop="true",
  muted="true",
  preload="auto",
  width="300",
  height="600",
  class="w-screenshot"
%}
  <figcaption class="w-figcaption">
    WebOTP API within an iframe in action.
  </figcaption>
</figure>

You can try the demo yourself at
[https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io).

### Annotate bound-origins to the SMS text message

When WebOTP API is called from within an iframe, the SMS text message must
include the top-frame origin preceded by `@` followed by the OTP preceded by `#`
followed by the iframe origin preceded by `@`.

```text
@shop.example #123456 @bank.exmple
```

### Configure Permissions Policy

To use WebOTP in a cross-origin iframe, the embedder must grant access to this
API via otp-credentials [permissions
policy](https://www.w3.org/TR/permissions-policy-1) to avoid unintended
behavior. In general there are two ways to achieve this goal:

- via HTTP Header:

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

- via iframe `allow` attribute:

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

See [more examples on how to specify a permission policy
](https://github.com/w3c/webappsec-permissions-policy/blob/master/permissions-policy-explainer.md#how-is-a-policy-specified).

### Caveats

#### Nesting levels

At the moment Chrome only supports WebOTP API calls from cross-origin iframes
that have **no more than one** unique origin in its ancestor chain. In the
following scenarios:

* a.com -> b.com
* a.com -> b.com -> b.com
* a.com -> a.com -> b.com
* a.com -> b.com -> c.com

using WebOTP in b.com is supported but using it in c.com is not.

Note that the following scenario is also not supported because of lack of demand
and UX complexities.

* a.com -> b.com -> a.com (calls WebOTP API)

## Interoperability

While browser engines other than Chromium do not implement the WebOTP API,
Safari shares the same [SMS format](https://wicg.github.io/sms-one-time-codes/)
with its `input[autocomplete="one-time-code"]` support. In Safari, as soon as an
SMS that contains an origin-bound one-time code format arrives with the matched
origin, the keyboard suggests to enter the OTP to the input field.

As of April 2021, Safari supports iframe with [a unique SMS format using
`%`](https://github.com/WICG/sms-one-time-codes/issues/4#issuecomment-709557866).
However, as the spec discussion concluded to go with `@` instead, we hope the
implementation of supported SMS format will converge.

## Feedback

Your feedback is invaluable in making WebOTP API better, so go on and try it out
and [let us know](https://bugs.chromium.org/p/chromium/issues/detail?id=1136506)
what you think.

## Resources

* [Verify phone numbers on the web with the Web OTP
  API](https://web.dev/web-otp/)
* [SMS OTP form best practices](https://web.dev/sms-otp-form/)
* [WebOTP API](https://wicg.github.io/web-otp/)
* [Origin-bound one-time codes delivered via
  SMS](https://wicg.github.io/sms-one-time-codes/)

Photo by [rupixen.com](https://unsplash.com/@rupixen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/online-payment?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
