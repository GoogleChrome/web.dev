---
layout: post
title: Sign in with a passkey through form autofill
subhead: Create a sign in experience that leverages passkeys while still accommodating existing password users.
authors:
  - agektmr
date: 2022-10-12
updated: 2023-04-25
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

With a passkey, a user can sign in to a website just by using fingerprint, face,
or device PIN.

Ideally, there would be no password users and the authentication flow
could be as simple as a single sign-in button. When the user taps the button, an
account selector dialog pops up, the user can pick an account, unlock the screen
to verify and sign in.

However, the transition from password to passkey-based authentication can be
challenging. As users switch to passkeys, there will still be those who use
passwords and websites will need to accommodate both types of users. Users
themselves should not be expected to remember on which sites they've switched to
passkeys, so asking users to select which method to use up front would be poor
UX.

Passkeys are also a new technology. Explaining them and making sure users are 
comfortable using them can be a challenge for websites. We can rely on familiar 
user experiences for autofilling passwords to solve both problems.

## Conditional UI

To build an efficient user experience for both passkey and password users, you
can include passkeys in autofill suggestions. This is called [conditional
UI](https://github.com/w3c/webauthn/wiki/Explainer:-WebAuthn-Conditional-UI) and
it's a part of [the WebAuthn standard](https://w3c.github.io/webauthn/).

<figure>
  {%
    Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/ZaxgMtkOh5CX2B1ZT9gd.mp4",
    autoplay="true", loop="true"
  %}
</figure>

As soon as the user taps on the username input field, an autofill suggestion
dialog pops up which highlights the stored passkeys along with password autofill
suggestions. The user can then choose an account and use the device screen lock
to sign in.

This way, users can sign in to your website with the existing form as if nothing
has changed, but with [the added security benefit of
passkeys](https://developers.google.com/identity/passkeys#security-considerations)
if they have one.

{% Aside 'success' %}

When a user signs in with a password, consider using that opportunity to offer
them to [create a passkey](/passkey-registration).

{% endAside %}

## How it works

To authenticate with a passkey, you use [the WebAuthn 
API](https://w3c.github.io/webauthn/).

The four components in a passkey authentication flow are:
the user:

* **Backend**: Your backend server that holds the accounts database storing the
  public key and other metadata about the passkey.
* **Frontend**: Your frontend which communicates with the browser and sends 
  fetch requests to the backend.
* **Browser**: The user's browser which is running your Javascript.
* **Authenticator**: The user's authenticator which creates and stores the 
  passkey. This may be on the same device as the browser (e.g. when using 
  Windows Hello) or on another device, like a phone.

<figure class="screenshot">
  {%
    Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/vAwnMiLi7U1spDopYg2Q.png",
    alt="Passkey authentication diagram", width="800", height="254"
  %}
</figure>

1. As soon as a user lands on the frontend, it requests a challenge from the 
   backend to authenticate with a passkey and calls 
   `navigator.credentials.get()` to initiate authenticating with a passkey. 
   This returns a `Promise`.
1. When the user puts the cursor in the sign-in field, the browser displays a 
   password autofill dialog including passkeys. An authentication dialog appears 
   if the user selects a passkey.
1. After the user verifies their identity using the device's screen lock, the 
   promise is resolved and a public key credential is returned to the frontend.
1. The frontend sends the public key credential to the backend. The backend 
   verifies the signature against the matched account's public key in the 
   database. If it succeeds, the user is signed in.

## Prerequisites

Conditional WebAuthn UI is publicly supported in Safari on iOS 16, iPadOS 16 and 
macOS Ventura. It's also available on Chrome on Android, macOS and Windows 11 
22H2.

## Authenticate with a passkey through form autofill

When a user wants to sign in, you can make a conditional WebAuthn `get` call 
to indicate that passkeys may be included in autofill suggestions. A conditional 
call to [WebAuthn](https://w3c.github.io/webauthn/)'s 
`navigator.credentials.get()` API does not show UI and remains pending until 
the user picks an account to sign-in with from the autofill suggestions. If the 
user picks a passkey the browser will resolve the promise with a credential 
rather than filling in the sign-in form. It's then the page's responsibility to 
sign the user in.

### Annotate form input field

Add an `autocomplete` attribute to the username `input` field, if needed. 
Append `username` and `webauthn` as its tokens to let it suggest passkeys.    

```html  
<input type="text" name="username" autocomplete="username webauthn" ...>
```

### Feature detection

Before invoking a conditional WebAuthn API call, check if:

* The browser supports WebAuthn.
* The browser supports WebAuthn conditional UI.

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

### Fetch a challenge from the RP server

Fetch a challenge from the RP server that is required to call 
`navigator.credentials.get()`:

* **[`challenge`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-challenge)**: 
  A server-generated challenge in an ArrayBuffer. This is required to prevent 
  replay attacks. Make sure to generate a new challenge on every sign-in attempt 
  and disregard it after a certain duration or after a sign-in attempt fails to 
  validate. Consider it like a CSRF token.
* **[`allowCredentials`](https://w3c.github.io/webauthn/#dom-publickeycredentialrequestoptions-allowcredentials)**:
  An array of acceptable credentials for this authentication. Pass an empty
  array to let the user select an available passkey from a list shown by the
  browser.
* **[`userVerification`](https://w3c.github.io/webauthn/#dom-publickeycredentialrequestoptions-userverification)**:
  Indicates whether user verification using the device screen lock is
  `"required"`, `"preferred"` or `"discouraged"`. The default is `"preferred"`,
  which means the authenticator may skip user verification. Set this to
  `"preferred"` or omit the property. 

{% Aside 'caution' %}

For requests with `userVerification` set to `"preferred"`, authenticators may
skip the user verification check, for example if the device doesn't have any
biometric sensors, the user hasn't set it up (no enrolled fingerprints), or
if the sensor is temporarily unavailable (a laptop running with a closed
display lid). The [UV bit in the authenticator data of the
response](https://w3c.github.io/webauthn/#authdata-flags-uv) always indicates
whether user verification was performed.

If you'd like to always require a user verification, set `userVerification` to
`"required"`. Don't forget to check that the UV flag is `true` on the server as
well.

{% endAside %}

{% Aside %}

ArrayBuffer values transferred from the server such as `challenge`, `user.id`
and credential `id` for `excludeCredentials` need to be encoded on transmission.
Make sure to decode them on the RP frontend before passing the values to the WebAuthn
API call. We recommend using Base64URL encode.

{% endAside %}

### Call WebAuthn API with the `conditional` flag to authenticate the user

Call `navigator.credentials.get()` to start waiting for the user authentication.

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

* **[`rpId`](https://w3c.github.io/webauthn/#dom-publickeycredentialrequestoptions-rpid)**:
  An RP ID is a domain and a website can specify either its domain or a
  registrable suffix. This value must match the rp.id used when the passkey was
  created.

Remember to specify `mediation: 'conditional'` to make the request conditional.

{% Aside %}

The WebAuthn call here will be pending and the promise won't be resolved until
the user interacts with the autofill input element and completes the
authentication flow. The RP frontend can use
[`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController)
to abort the WebAuthn call.

{% endAside %}

### Send the returned public key credential to the RP server

After the user selects an account and consents using the device's screen lock,
the promise is resolved returning a
[`PublicKeyCredential`](https://w3c.github.io/webauthn/#authenticatorassertionresponse)
object to the RP frontend.

A promise can be rejected due to several different reasons. You need to handle the errors accordingly,
depending on the `Error` object's `name` property:

* **`NotAllowedError`**: The user has canceled the operation.
* **Other exceptions**: Something unexpected happened. The browser shows an 
  error dialog to the user.

The public key credential object contains the following properties:

* **[`id`](https://w3c.github.io/webauthn/#credential-id)**: The 
  base64url encoded ID of the authenticated passkey credential.
* **[`rawId`](https://w3c.github.io/webauthn/#credential-id)**: An 
  ArrayBuffer version of the credential ID.
* **[`response.clientDataJSON`](https://w3c.github.io/webauthn/#client-data)**: 
  An ArrayBuffer of client data. This field contains information such as the challenge 
  and the origin that the RP server will need to verify.
* **[`response.authenticatorData`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-authenticatordata)**: 
  An ArrayBuffer of authenticator data. This field contains information such as the RP 
  ID.
* **[`response.signature`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-signature)**: 
  An ArrayBuffer of the signature. This value is the core of the credential and needs 
  to be verified on the server.
* **[`response.userHandle`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-userhandle)**: 
  An ArrayBuffer that contained the user ID that was set at creation time. This 
  value can be used, instead of the credential ID, if the server needs to pick 
  the ID values that it uses, or if the backend wishes to avoid creating an 
  index on credential IDs.
* **[`authenticatorAttachment`](https://w3c.github.io/webauthn/#enumdef-authenticatorattachment)**: 
  Returns `platform` when this credential came from the local device. 
  Otherwise `cross-platform`, notably when [the user used a phone to sign 
  in](https://developers.google.com/identity/passkeys/use-cases#sign-in-with-a-phone). 
  If the user needed to use a phone to sign-in, consider prompting them to 
  [create a passkey](/passkey-registration) on the local device.
* **`type`**: This field is always set to `"public-key"`.

If you use a library to handle the public-key credential object on the RP 
server, we recommend that you send the entire object to the server after encoding it 
partially with base64url.

### Verify the signature

When you receive the public key credential on the server, pass it to the FIDO 
library to process the object.

Look up the matching credential ID with the
[`id`](https://w3c.github.io/webauthn/#credential-id) property (If you need to
determine the user account, use the
[`userHandle`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-userhandle)
property which is the `user.id` you specified when creating the credential). See
if the credential's
[`signature`](https://w3c.github.io/webauthn/#dom-authenticatorassertionresponse-signature)
can be verified with the stored public key. To do so, we recommend using a
server side library or a solution instead of writing your own code. [You can
find open source libraries in the awesome-webauth GitHub
repo](https://github.com/herrjemand/awesome-webauthn).

Once the credential is verified with a matching public key, sign the user in.

## Resources

* [Create a passkey for passwordless logins](/passkey-registration/)
* [Passkeys](https://www.imperialviolet.org/2022/09/22/passkeys.html)
* [Apple document: Authenticating a User Through a Web
  Service](https://developer.apple.com/documentation/authenticationservices/authenticating_a_user_through_a_web_service)
* [Google document: Passwordless login with
  passkeys](https://developers.google.com/identity/passkeys/)
