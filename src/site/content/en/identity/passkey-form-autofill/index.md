---
layout: post
title: Sign in with a passkey through form autofill
subhead: Create a sign in experience that leverages passkeys while still accommodating existing password users.
authors:
  - agektmr
date: 2022-10-12
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/n2fXJDSlefAg8EPLkqEr.jpg
description: |
  Passkeys make a website's user accounts safer, simpler, easier to use and passwordless. This article discusses how  how a passwordless sign-in with passkeys should be designed while accommodating existing password users.
tags:
  - identity
  - security
  - blog
---

[Passkeys](https://developers.google.com/identity/passkeys) replace passwords
and make user accounts on the web safer, simpler, easier to use. However, the
transition from password-based to passkey-based authentication can complicate
the user experience. Using form autofill to suggest passkeys can help
create a unified experience.

## Why use form autofill to sign-in with a passkey?

Using passkeys instead of passwords is a great way for websites to make their
user accounts safer, simpler, easier to use. With a passkey, a
user can sign in to a website or an app just by using fingerprint, face or
device pin.

In an ideal world, there would be no password users and the authentication flow
could be as simple as a single sign-in button. When the user taps the button, an
account selector dialog pops up, the user can pick an account, unlock the screen
to verify and sign in.

However, the transition from password-based authentication to passkey-based
authentication can be challenging. As users switch to passkeys, there will still
be those who use passwords and websites will need to accommodate both types of
users. Users themselves should not be expected to remember on which sites
they've switched to passkeys, so asking users to select which method to use up
front would be poor UX.

Passkeys are also a new technology. Explaining them and making sure users are
comfortable using them can be a challenge for websites. We can rely on familiar
user experiences for autofilling passwords to solve both problems.

## Conditional UI

To create an efficient user experience for both passkey and password users, you
can optimize the authentication flow using the browser's form autofill
functionality. This is called
[conditional UI](https://github.com/w3c/webauthn/wiki/Explainer:-WebAuthn-Conditional-UI)
and it's a part of [the WebAuthn standard](https://w3c.github.io/webauthn/). A
website can include passkeys in autofill suggestions.

1.  The user lands on the sign-in page.
1.  The user selects the username input field.
1.  An account selector dialog pops up.
1.  The user selects an account, whether that account uses a password or a
    passkey.
1.  The user verifies with fingerprint, face or device PIN.
1.  The user is signed in.

As soon as the user taps on the username input field, an autofill suggestion
dialog pops up which highlights the stored passkeys along with password autofill
suggestions. The user can then choose an account and use the device screen lock
to sign in.

This way, users can sign in to your website with the existing form as if
nothing has changed, but with
[the added security benefit of passkeys](https://developers.google.com/identity/passkeys#security-considerations)
if they have one.

{% Aside %}

When a user signs in with a password, consider using that opportunity to
offer them to
[create a passkey](/passkey-registration).

{% endAside %}

## Prerequisites

Conditional WebAuthn UI is publicly supported in Safari on iOS 16. It's also
available on Chrome Canary on Android, macOS and Windows 22H2.

On Chrome on Android, you need the
[Google Play services beta](https://developers.google.com/android/guides/beta-program)
to authenticate with conditional UI.

## Authenticate with a passkey through form autofill

When a user wants to sign in, you can make a conditional WebAuthn `get` call to
indicate that passkeys may be included in autofill suggestions. A conditional
call to [WebAuthn](https://w3c.github.io/webauthn/) 
`navigator.credentials.get()` API does not show UI and is pending until the user
picks an account to sign-in with from the autofill suggestion. If the user picks
a passkey account from the suggestions, the promise is resolved and you will
receive a credential, instead of filling in the sign-in form.

### Annotate form input field

Add an `autocomplete` attribute to the `username` input field, if needed.
Append `username` and `webauthn` as its tokens to let it suggest passkeys.

```html
<input type="text" name="username" autocomplete="username webauthn" ...>
```

### Feature detection

Before making a conditional WebAuthn call, check if:

-   The browser supports WebAuthn.
-   The browser supports conditional WebAuthn calls.

```js
// Availability of `window.PublicKeyCredential` means WebAuthn is usable.
if (window.PublicKeyCredential &&
    PublicKeyCredential.​​isConditionalMediationAvailable) {
  // Check if conditional mediation is available.
  const isCMA = await PublicKeyCredential.​​isConditionalMediationAvailable();
  if (isCMA) {
    // Call WebAuthn authentication
  }
}
```

### Call WebAuthn API with the `conditional` flag to authenticate the user

Actual authentication with a passkey is done by calling a
[WebAuthn](https://w3c.github.io/webauthn/) API `navigator.credentials.get()`.

```js
// To abort a WebAuthn call, instantiate an `AbortController`.
const abortController = new AbortController();

const publicKeyCredentialRequestOptions = {
  // Server generated challenge
  challenge: ****,
  // The same RP ID as used during registration
  rpId: 'example.com',
};

const credential = await navigator.credentials.get({
  publicKey: publicKeyCredentialRequestOptions,
  signal: abortController.signal,
  // Specify 'conditional' to activate conditional UI
  mediation: 'conditional'
});
```

The key parameter here is:

-   [`challenge`](https://w3c.github.io/webauthn/#dom-publickeycredentialrequestoptions-challenge):
    A server-generated challenge for this authentication. This is important to
    prevent replay attacks.

Remember to specify `mediation: 'conditional'` to make the request
conditional.

{% Aside %}

The WebAuthn call here will be pending and the promise won't be resolved until
the user interacts with the autofill input element and completes the
authentication flow.

{% endAside %}

### Verify the signature

When `navigator.credentials.get()` resolves successfully it returns a
[`PublicKeyCredential`](https://w3c.github.io/webauthn/#publickeycredential)
object, the `response` member of which is an
[`AuthenticatorAssertionResponse`](https://w3c.github.io/webauthn/#iface-authenticatorassertionresponse).
This has
[`signature`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-signature),
[`userHandle`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-userhandle),
and
[`authenticatorData`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-authenticatordata)
members that contain elements of the assertion. The `PublicKeyCredential` has a
[`rawId`](https://w3c.github.io/webauthn/#dom-publickeycredential-rawid) member
that contains the ID of the credential.

Encode the binary portion of the credential and send it to the server.

On the server, look up the user account with a matching `userHandle` property
(this will be the `user.id` you specified when creating the credential) and then
for the matching credential with the `id` property. See if the credential's
signature can be verified with the stored public key. To do so, we recommend
using a server side library or a solution instead of writing your own code.
[You can find open source libraries in the awesome-webauth GitHub repo](https://github.com/herrjemand/awesome-webauthn).

Once the credential is verified with a matching public key, sign the user in.
