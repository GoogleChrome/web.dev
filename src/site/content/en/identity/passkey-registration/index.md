---
layout: post
title: Create a passkey for passwordless logins
subhead: Passkeys make user accounts safer, simpler, easier to use.
authors:
  - agektmr
date: 2022-10-12
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/ESXHlkzce7qhQSqQHacV.jpg
description: |
  Passkeys make a website's user accounts safer, simpler, easier to use and passwordless. This article discusses how to allow users to create passkeys for your website.
tags:
  - identity
  - security
  - blog
---

Using [passkeys](https://developers.google.com/identity/passkeys) instead of
passwords is a great way for websites to make their user accounts safer,
simpler, easier to use. With a passkey, a user can sign in to a
website or an app just by using their fingerprint, face or device PIN.

To enable passwordless sign in, a passkey first needs to be created and its public key stored on your server.

When users sign in with a password, use the opportunity to ask them to create a passkey.

Another good option is to have dedicated settings page where users can manage their passkeys and create new ones.

## Prerequisites

To create a passkey on Chrome for Android, you need the
[Google Play services beta](https://developers.google.com/android/guides/beta-program).
Otherwise the call to `navigator.credentials.create()` below will fail.

## Create a new passkey

### Feature detection

Before prompting the user to create a new passkey, check if:

-   The browser supports [WebAuthn](https://w3c.github.io/webauthn/).
-   The device supports a platform authenticator.
-   The browser supports conditional UI.

```js
// Availability of `window.PublicKeyCredential` means WebAuthn is usable.
if (window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    PublicKeyCredential.isConditionalMediationAvailable) {
  // Check if user verifying platform authenticator is available.
  Promise.all([
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
    PublicKeyCredential.isConditionalMediationAvailable(),
  ]).then(results => {
    if (results.every(r => r === true)) {
      // Call WebAuthn creation
    }
  });
}
```

### Call WebAuthn API to create a passkey

To create a passkey, call the WebAuthn API
`navigator.credentials.create()`. See below for details on each parameter.

```js
const publicKeyCredentialCreationOptions = {
  challenge: *****,
  rp: {
    name: "Example",
    id: "example.com",
  },
  user: {
    id: *****,
    name: "john78",
    displayName: "John",
  },
  pubKeyCredParams: [{alg: -7, type: "public-key"},{alg: -257, type: "public-key"}],
  excludeCredentials: [{
    id: *****,
    type: "public-key",
    transports: ["internal"],
  }],
  authenticatorSelection: {
    authenticatorAttachment: "platform",
    requireResidentKey: true,
  },
  timeout: 30000
};

const credential = await navigator.credentials.create({
  publicKey: publicKeyCredentialCreationOptions
});

// Encode and send the credential to the server for verification.
```


The key parameters here are:

-   [`challenge`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-challenge):
    A server-generated challenge for this registration. This is required but
    unused during registration unless doing attestation—an advanced topic not
    covered here. Absent attestation, it can be set to `new Uint8Array([0])`,
    but never do this during sign-in.
-   [`rp.id`](https://w3c.github.io/webauthn/#dom-publickeycredentialrpentity-id):
    A "relying party" ID. A relying party is any entity that uses passkeys to
    authenticate users, for example, a website. An RP ID is a domain and a website can
    specify either its domain or a registrable suffix. For example, if an RP's
    origin is `https://login.example.com:1337`, the RP ID can be either
    `login.example.com` or `example.com`. If the RP ID is specified as
    `example.com`, the user can authenticate on `login.example.com` or on any
    subdomains on `example.com`.
-   [`rp.name`](https://w3c.github.io/webauthn/#dom-publickeycredentialentity-name):
    The RP's name.
-   [`user.id`](https://w3c.github.io/webauthn/#dom-publickeycredentialuserentity-id):
     A user's unique ID. This must be an ArrayBuffer which does not include
    personally identifying information, such as e-mail addresses or usernames. A
    random, 16-byte value generated per account will work well.
-   [`user.name`](https://w3c.github.io/webauthn/#dom-publickeycredentialentity-name):
    This should be a unique identifier for the account that the user will
    recognise, like their email address or username. This will be displayed in
    the account selector. (If using a username, use the same value as in
    password authentication.)
-   [`user.displayName`](https://w3c.github.io/webauthn/#dom-publickeycredentialuserentity-displayname):
    This is an optional, more friendly name for the account. It need not be
    unique and could be the user's chosen name. If your site does not have a
    suitable value to include here, pass an empty string. This may be displayed
    on the account selector depending on the browser.
-   [`authenticatorSelection.authenticatorAttachment`](https://w3c.github.io/webauthn/#dom-authenticatorselectioncriteria-authenticatorattachment):
    Set it to `"platform"`. This indicates that we want an authenticator that is
    embedded into the platform device and the user will not be prompted to
    insert an external authenticator such as a USB security key.
-   [`authenticatorSelection.requireResidentKey`](https://w3c.github.io/webauthn/#dom-authenticatorselectioncriteria-residentkey):
    Set it to `true`. Requiring a discoverable credential (resident key)
    enables better sign-in experiences.
-   [`excludeCredentials`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-excludecredentials):
    Prevent registering the same authenticator by providing a list of already
    registered credential ID. The
    [`transports`](https://w3c.github.io/webauthn/#dom-publickeycredentialdescriptor-transports)
    member, if provided, should contain the result of calling
    [`getTransports`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-gettransports)`
    during the registration of each credential.

{% Aside %}
Some browsers don't require any parameters on
`authenticatorSelection` to create a passkey, but others may. We
recommend specifying those parameters explicitly.
{% endAside %}


### Save the credential

When `navigator.credentials.create()` resolves successfully it returns a
[`PublicKeyCredential`](https://w3c.github.io/webauthn/#publickeycredential)
object, the response member of which is an
[`AuthenticatorAttestationResponse`](https://w3c.github.io/webauthn/#iface-authenticatorattestationresponse).
This object provides
[`getTransports`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-gettransports),
[`getAuthenticatorData`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-getauthenticatordata),
and
[`getPublicKeyAlgorithm`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-getpublickey)
functions to retrieve elements of the newly created passkey. The
`PublicKeyCredential` has a
[`rawId`](https://w3c.github.io/webauthn/#dom-publickeycredential-rawid) member
that contains the ID of the credential.

On the server, store the information retrieved from the credential to the
database for future use. Here are typical properties to save:

-   credential ID (primary key)
-   user ID
-   public key
-   transports

To process the credential on the server side, we recommend using a server side
library or a solution instead of writing your own code.
[You can find open source libraries in the awesome-webauth GitHub repo](https://github.com/herrjemand/awesome-webauthn).

To authenticate the user, read
[Sign in with a passkey through form autofill](/passkey-form-autofill).
