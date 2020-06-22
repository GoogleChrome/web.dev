---
title: Getting started with Trust Tokens
subhead: A new API proposal that provides an alternative to passive tracking to combat fraud and distinguish bots from real humans.
authors:
  - samdutton
date: 2020-06-22
updated: 2020-06-22
hero: hero.jpg
thumbnail: thumbnail.jpg
alt: 
tags:
  - post
  - privacy
  - security
  - trust and safety
---

{% YouTube 'WnCKlNE52tc' %}

## Summary

Trust tokens enable an origin to issue cryptographic tokens to a user it trusts.
The tokens are stored by the user's browser. The browser uses the tokens in
other contexts to evaluate the user's authenticity.   

The Trust Token API allows trust of a user in one context (such as gmail.com) to
be conveyed to another context (such as an ad running on nytimes.com) without
identifying the user or linking the two identities.

{% Aside %}
The Privacy Sandbox is a series of proposals to satisfy third-party use cases
without third-party cookies or other tracking mechanisms. See
[Digging into the Privacy Sandbox](http://web.dev/digging-into-the-privacy-sandbox)
for an overview of all the proposals.

**This proposal needs your feedback!** If you have comments, please [create an
issue](https://github.com/WICG/trust-token-api/issues/new) on the [Trust Token
explainer](https://github.com/WICG/trust-token-api) repository.
{% endAside %}

## Why do we need Trust Tokens?

The web needs ways to establish trust signals which show that a user is who they
say they are, and not a bot pretending to be a human, or a malicious third-party
defrauding a real person or service. Fraud protection is particularly important
for advertisers, ad providers, and CDNs.   
  
Unfortunately, many existing mechanisms to gauge and propagate
trustworthiness—to work out if an interaction with a site is from a real human
or a bot, for example—take advantage of techniques that can also be used for
fingerprinting.

{% Aside 'key-term' %}  
**Fingerprinting** enables sites to identify and track individual users by
getting data about their device, operating system, and browser setup (such as
language preferences,
[user agent](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/userAgent), and available fonts) or changes in device state. This may be done on the server
by checking request headers or on the client with JavaScript.

Fingerprinting uses mechanisms that users aren't aware of and can't control.
Sites such as [Panopticlick](https://panopticlick.eff.org/) and
[amiunique.org](https://amiunique.org/) show how fingerprint data can be
combined to identify you as an individual.  
{% endAside %} 


### Trust token issuance

If the user is deemed to be trustworthy by a trust token issuer such as
`issuer.example`, the issuer can fetch trust tokens for the user by making a
`fetch()` request with a new `trustToken` parameter:


```js
fetch('issuer.example/.well-known/trust-token', {
  trustToken: {
    type: 'token-request',
    issuer: <issuer>
  }
}).then(...)
```

  
This invokes the [Privacy Pass](https://privacypass.github.io/) issuance
protocol:  

1. Generate a set of pseudo-random numbers known as _nonces_.
1. [Blind](https://www.cs.bham.ac.uk/~mdr/teaching/modules06/netsec/lectures/blind_sigs.html)
   the nonces (encode them so the issuer can't view their contents) and attach
   them to the request in a `Sec-Trust-Token` header.
1. Send a POST request to the endpoint provided.

The endpoint responds with
[blind signatures](http://cs.bham.ac.uk/~mdr/teaching/modules06/netsec/lectures/blind_sigs.html),
then the signatures and associated nonces are stored internally by the browser
as trust tokens.

### Trust token redemption

A publisher site (such as `publisher.example` in the example above) can check if
there are trust tokens available for the user:


```js
const userHasTokens = await document.hasTrustToken(<issuer>);
````

If there are tokens available, the publisher site can redeem them to get a
signed redemption record:

```js
fetch('issuer.example/.well-known/trust-token', {
  ...
  trustToken: {
    type: 'srr-token-redemption',
    issuer: 'issuer.example',
    refreshPolicy: 'none'
  }
  ...
}).then(...)
```

Then the publisher site can send the SRR to requests it makes using the
following API:
 
```js
fetch('<url>', {
  ...
  trustToken: {
    type: 'send-srr',
    issuer: <issuer>,
  }
  ...
}).then(...);
```

The publisher should include the SRR in requests that will require a trust
token, such as posting a comment, liking a page, or voting in a poll.  
  
{% Aside %}  
Trust tokens are only accessible through options to Fetch, XHR, and the HTML
`<iframe>` element: they cannot be accessed directly.  
{% endAside%}  

### Privacy considerations

Tokens are designed to be 'unlinkable'. An issuer can learn aggregate
information about which sites its users visit, but can't link issuance with
redemption: when a user redeems a token, the issuer can't tell the token apart
from other tokens it has created. However, trust tokens currently do not exist
in a vacuum: there are other ways an issuer could currently—in theory—join a
user's identity across sites, such as third-party cookies and covert tracking
techniques. It is important for sites to understand this ecosystem transition as
they plan their support. This is a general aspect of the transition for many
Privacy Sandbox APIs, so not discussed further here.

### Security considerations

**Trust token exhaustion:** a malicious site could deliberately deplete a user's
supply of tokens from a particular issuer. There are several mitigations against
this kind of attack, such as enabling issuers to provide many tokens at once, so
users have an adequate supply of ensuring browsers only ever redeem one token
per top-level page view.  
  
**Double-spend prevention:** malware might attempt to access all of a user's
trust tokens. However, tokens will run out over time, since every redemption is
sent to the same token issuer, which can verify that each token is used only
once. To mitigate risk, issuers could also sign fewer tokens.

### Request mechanisms

It might be possible to allow for sending SRRs outside of `fetch()`, for example
with navigation requests. Sites might also be able to include issuer data in
HTTP response headers to enable token redemption in parallel with page
loading.

**To reiterate: this proposal needs your feedback!** If you have comments, please
[create an issue](https://github.com/WICG/trust-token-api/issues/new) on the
Trust Token [explainer repository](https://github.com/WICG/trust-token-api).

## Find out more

-  [Digging in to the Privacy Sandbox](https://web.dev/digging-into-the-privacy-sandbox/)
-  [Trust Token API Explainer](https://github.com/WICG/trust-token-api)
-  [Chromium Projects: Trust Token API](https://sites.google.com/a/chromium.org/dev/updates/trust-token)
-  [Intent to Implement: Trust Token API](https://groups.google.com/a/chromium.org/g/blink-dev/c/X9sF2uLe9rA/m/1xV5KEn2DgAJ)
-  [Privacy Pass](https://privacypass.github.io/)

---

Thanks to Kayce Basques, David Van Cleve, Steven Valdez, and Marshall Vale for their help in writing this post.

Photo by [ZSun Fu](https://unsplash.com/photos/b4D7FKAghoE) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).