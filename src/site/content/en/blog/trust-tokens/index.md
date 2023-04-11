---
title: Getting started with Trust Tokens
subhead: Trust Tokens is a new API to enable a website to convey a limited amount of information from one browsing context to another (for example, across sites) to help combat fraud, without passive tracking.
authors:
  - samdutton
date: 2020-06-22
updated: 2021-12-10
hero: image/admin/okxi2ttRG3h1Z4F3cylI.jpg
thumbnail: image/admin/cTo0l2opcfNxg1TEjxSg.jpg
alt: Black and white photograph of hand holding token
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %}

This API [has been renamed](https://developer.chrome.com/blog/rename-trust-tokens/) Private State Tokens.

The developer.chrome.com article [Private State Tokens](https://developer.chrome.com/docs/privacy-sandbox/trust-tokens/) provides implementation status updates, and explains how to engage and share feedback.

{% endAside %}


{% Aside  'caution' %}
**⚠️ Warning: you may need to update your app!**

**TrustTokenV3** is a collection of backwards-incompatible changes to Chromium's Trust Tokens
implementation. The changes arrived in Chrome 92, which reached Chrome Stable towards the end of
July 2021.

If you haven't already, you will need to update existing applications
[testing the API](https://www.chromestatus.com/feature/5078049450098688).

Find out more: [What's TrustTokenV3?](https://bit.ly/what-is-trusttokenv3).
{% endAside %}

<br><br>

{% YouTube
  id='bXB1Iwq6Eq4'
%}

## Summary

Trust tokens enable an origin to issue cryptographic tokens to a user it trusts. The tokens are
stored by the user's browser. The browser can then use the tokens in other contexts to evaluate the
user's authenticity.

The Trust Token API enables trust of a user in one context to be conveyed to another context without
identifying the user or linking the two identities.

You can try out the API with our [demo](https://trust-token-demo.glitch.me), and
[inspect tokens](https://developer.chrome.com/blog/new-in-devtools-89/#trust-token) in the
Chrome DevTools **Network** and **Application** tabs.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/krrI292OLd6awb4dxkN0.jpg",
  alt="Screenshot showing Trust Tokens in the Chrome DevTools Network tab.", width="800", height="584" %}
  <figcaption>Trust Tokens in the Chrome DevTools <b>Network</b> tab.</figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cwR9JdoVo1M4VDovP2oM.jpg", alt="Screenshot showing Trust Tokens in the Chrome DevTools Application tab.", width="800", height="584" %}
  <figcaption>Trust Tokens in the Chrome DevTools <b>Application</b> tab.</figcaption>
</figure>

{% Aside %}
The Privacy Sandbox is a series of proposals to satisfy third-party use cases without third-party
cookies or other tracking mechanisms. See [Digging into the Privacy Sandbox](/digging-into-the-privacy-sandbox)
for an overview of all the proposals.

**This proposal needs your feedback!** If you have comments, please [create an issue](https://github.com/WICG/trust-token-api/issues/new)
on the [Trust Token explainer](https://github.com/WICG/trust-token-api) repository.
{% endAside %}

## Why do we need Trust Tokens?

The web needs ways to establish trust signals which show that a user is who they say they are, and
not a bot pretending to be a human, or a malicious third-party defrauding a real person or service.
Fraud protection is particularly important for advertisers, ad providers, and CDNs.

Unfortunately, many existing mechanisms to gauge and propagate trustworthiness—to work out if an
interaction with a site is from a real human, for example—take advantage of techniques that can also
be used for fingerprinting.

{% Aside 'key-term' %}
**Fingerprinting** enables sites to identify and track individual users by getting data about their
device, operating system, and browser setup (such as language preferences,
[user agent](https://developer.mozilla.org/docs/Web/API/NavigatorID/userAgent), and available
fonts) or changes in device state. This may be done on the server by checking request headers or on
the client with JavaScript.

Fingerprinting uses mechanisms that users aren't aware of and can't control. Sites such as
[Panopticlick](https://panopticlick.eff.org/) and [amiunique.org](https://amiunique.org/) show how
fingerprint data can be combined to identify you as an individual.
{% endAside %}

The API must preserve privacy, enabling trust to be propagated across sites without individual user
tracking.

## What's in the Trust Tokens proposal?

The web relies on building trust signals to detect fraud and spamming. One way to do this is by
tracking browsing with global, cross-site per-user identifiers. For a privacy-preserving API, that's
not acceptable.

From the proposal
[**explainer**](https://github.com/WICG/trust-token-api#overview):

<blockquote>
<p>This API proposes a new per-origin storage area for "Privacy Pass" style
cryptographic tokens, which are accessible in third party contexts. These
tokens are non-personalized and cannot be used to track users, but are
cryptographically signed so they cannot be forged.</p>
<p>When an origin is in a context where they trust the user, they can issue
the browser a batch of tokens, which can be "spent" at a later time in a
context where the user would otherwise be unknown or less trusted.
Crucially, the tokens are indistinguishable from one another, preventing
websites from tracking users through them.</p>
<p>We further propose an extension mechanism for the browser to sign outgoing
  requests with keys bound to a particular token redemption.</p>
</blockquote>


## Sample API usage

The following is adapted from
[sample code in the API explainer](https://github.com/WICG/trust-token-api#sample-api-usage).

{% Aside %}
The code in this post uses updated syntax available since Chrome 88.
{% endAside %}

Imagine that a user visits a news website (`publisher.example`) which embeds advertising from a
third party ad network (`foo.example`). The user has previously used a social media site that issues
trust tokens (`issuer.example`).

The sequence below shows how trust tokens work.

**1.**&nbsp;The user visits `issuer.example` and performs actions that lead the site to believe they
are a real human, such as account activity, or passing a CAPTCHA challenge.

**2.**&nbsp;`issuer.example` verifies the user is a human, and runs the following JavaScript to
issue a trust token to the user's browser:

```js
fetch('https://issuer.example/trust-token', {
  trustToken: {
    type: 'token-request',
    issuer: 'https://issuer.example'
  }
}).then(...)
```

**3.**&nbsp;The user's browser stores the trust token, associating it with `issuer.example`.

**4.**&nbsp;Some time later, the user visits `publisher.example`.

**5.**&nbsp;`publisher.example` wants to know if the user is a real human. `publisher.example` trusts
`issuer.example`, so they check if the user's browser has valid tokens from that origin:

```js
document.hasTrustToken('https://issuer.example');
```

**6.**&nbsp;If this returns a promise that resolves to `true`, that means the user has tokens from
`issuer.example`, so `publisher.example` can attempt to redeem a token:

```js
fetch('https://issuer.example/trust-token', {
trustToken: {
  type: 'token-redemption',
  issuer: 'https://issuer.example',
  refreshPolicy: {none, refresh}
}
}).then(...)
```

With this code:

 1. The redeemer `publisher.example` requests a redemption.
 1. If the redemption is successful, the issuer `issuer.example` returns a redemption record which
 indicates that at some point they issued a valid token to this browser.

 **7.**&nbsp;Once the promise returned by `fetch()` has resolved, the redemption record can be used
 in subsequent resource requests:

```js
fetch('https://foo.example/get-content', {
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['https://issuer.example', ...]
  }
});
```

With this code:

1. Redemption records are included as a request header `Sec-Redemption-Record`.
1. `foo.example` receives the redemption record and can parse the record to determine whether
  `issuer.example` thought this user was a human.
1. `foo.example` responds accordingly.

{% Details %}
{% DetailsSummary %}
How can a website work out whether to trust you?
{% endDetailsSummary %}
You might have shopping history with an e-commerce site, check-ins on a location platform, or account
history at a bank. Issuers might also look at other factors such as how long you've had an account,
or other interactions (such as CAPTCHAs or form submission) that increase the issuer's trust in the
likelihood that you're a real human.
{% endDetails %}


### Trust token issuance

If the user is deemed to be trustworthy by a trust token issuer such as `issuer.example`, the issuer
can fetch trust tokens for the user by making a `fetch()` request with a `trustToken` parameter:

```js
fetch('issuer.example/trust-token', {
  trustToken: {
    type: 'token-request'
  }
}).then(...)
```

This invokes an extension of the [Privacy Pass](https://privacypass.github.io/) issuance
protocol using a [new cryptographic primitive](https://eprint.iacr.org/2020/072.pdf):

1. Generate a set of pseudo-random numbers known as _nonces_.

1. Blind the nonces (encode them so the issuer can't view their contents) and attach them to the
request in a `Sec-Trust-Token` header.

1. Send a POST request to the endpoint provided.

The endpoint responds with [blinded tokens](https://en.wikipedia.org/wiki/Blind_signature)
(signatures on the blind nonces), then the tokens are unblinded and stored internally together with
the associated nonces by the browser as trust tokens.


### Trust token redemption

A publisher site (such as `publisher.example` in the example above) can check if there are trust
tokens available for the user:

```js
const userHasTokens = await document.hasTrustToken('issuer.example/trust-token');
````

If there are tokens available, the publisher site can redeem them to get a redemption record:

```js
fetch('issuer.example/trust-token', {
  ...
  trustToken: {
    type: 'token-redemption',
    refreshPolicy: 'none'
  }
  ...
}).then(...)
```

The publisher can include redemption records in requests that require a trust token—such as
posting a comment, liking a page, or voting in a poll—by using a `fetch()` call like
the following:

```js
fetch('https://foo.example/post-comment', {
  ...
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['issuer.example/trust-token', ...]
  }
  ...
}).then(...);
```

Redemption records are included as a `Sec-Redemption-Record` request header.

{% Aside %}
Trust tokens are only accessible through options to Fetch, XHR, and the HTML `<iframe>` element:
they cannot be accessed directly.
{% endAside%}

### Privacy considerations

Tokens are designed to be 'unlinkable'. An issuer can learn aggregate information about which sites
its users visit, but can't link issuance with redemption: when a user redeems a token, the issuer
can't tell the token apart from other tokens it has created. However, trust tokens currently do not
exist in a vacuum: there are other ways an issuer could currently—in theory—join a user's identity
across sites, such as third-party cookies and covert tracking techniques. It is important for sites
to understand this ecosystem transition as they plan their support. This is a general aspect of the
transition for many Privacy Sandbox APIs, so not discussed further here.

### Security considerations

**Trust token exhaustion:** a malicious site could deliberately deplete a user's supply of tokens
from a particular issuer. There are several mitigations against this kind of attack, such as
enabling issuers to provide many tokens at once, so users have an adequate supply of ensuring
browsers only ever redeem one token per top-level page view.

**Double-spend prevention:** malware might attempt to access all of a user's trust tokens. However,
tokens will run out over time, since every redemption is sent to the same token issuer, which can
verify that each token is used only once. To mitigate risk, issuers could also sign fewer tokens.

### Request mechanisms

It might be possible to allow for sending redemption records outside of `fetch()`, for example with
navigation requests. Sites might also be able to include issuer data in HTTP response headers to
enable token redemption in parallel with page loading.

**To reiterate: this proposal needs your feedback!** If you have comments, please
[create an issue](https://github.com/WICG/trust-token-api/issues/new) on the
Trust Token [explainer repository](https://github.com/WICG/trust-token-api).

## Find out more

-  [Trust Tokens demo](https://trust-token-demo.glitch.me)
-  [Getting started with Chrome's origin trials](https://developer.chrome.com/blog/origin-trials/)
-  [Digging in to the Privacy Sandbox](/digging-into-the-privacy-sandbox/)
-  [Trust Token API Explainer](https://github.com/WICG/trust-token-api)
-  [Chromium Projects: Trust Token API](https://sites.google.com/a/chromium.org/dev/updates/trust-token)
-  [Intent to Implement: Trust Token API](https://groups.google.com/a/chromium.org/g/blink-dev/c/X9sF2uLe9rA/m/1xV5KEn2DgAJ)
-  [Chrome Platform Status](https://www.chromestatus.com/feature/5078049450098688)
-  [Privacy Pass](https://privacypass.github.io/)
-  [Extensions of Privacy Pass](https://eprint.iacr.org/2020/072.pdf)

---

Thanks to all those who helped write and review this post.

Photo by [ZSun Fu](https://unsplash.com/photos/b4D7FKAghoE) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
