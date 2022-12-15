---
layout: post
title: Create a passkey for passwordless logins
subhead: Passkeys make user accounts safer, simpler, easier to use.
authors:
  - agektmr
date: 2022-10-12
updated: 2022-12-15
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
simpler, easier to use and passwordless. With a passkey, a user can sign in to a
website or an app just by using their fingerprint, face or device PIN.

{% Aside %}

To learn basic concepts of passkeys, please read [Passwordless login with passkeys](https://developers.google.com/identity/passkeys) first.

{% endAside %}

To let users sign in with a passkey, it first needs to be created, associated
with a user account and its public key stored on your server.

## How it works

When a user signs in using a password, or a passkey from another device (i.e.
the
[`authenticatorAttachment`](/passkey-form-autofill/#:~:text=authenticationattachment)
is `cross-platform`), that is a good opportunity to ask the user to create a
passkey. A dedicated page where users can manage their passkeys is also a good
place to create a new passkey as well.

<figure>
  {%
    Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/2gY9wppN8tivRRWDH8gV.mp4",
    autoplay="true", loop="true"
  %}
</figure>

To create a passkey, you use [the WebAuthn 
API](https://w3c.github.io/webauthn/).

On a passkey registration flow, four participants are involved in addition to 
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
    Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/vmxdOrHbR2kW17Ipv6hk.png",
    alt="Passkey registration diagram", width="800", height="258"
  %}
</figure>

1. A user signs in to the website. (We cover a use case that adds a new passkey 
   to an existing user account).
1. After the user is signed in, the user requests to create a passkey on the 
   frontend. e.g. by pressing a "Create a passkey" button.
1. The frontend requests information to create a passkey such as user 
   information, a challenge, and the credential IDs to exclude, from the 
   backend.
1. The frontend calls `navigator.credentials.create()` to create a passkey. 
   This returns a promise.
1. A passkey is created after the user consents using the device's screen lock. 
   The promise is resolved and a public key credential is returned to the 
   frontend.
1. The frontend sends the public key credential to the backend and stores the 
   credential ID and the public key associated with the user account for future 
   authentications.

## Compatibilities

WebAuthn is supported by most browsers, but there are small gaps. Refer to 
[Device Support - passkeys.dev](https://passkeys.dev/device-support/) to learn 
what combination of browsers and an operating systems support creating a 
passkey.

## Create a new passkey

Here's how a frontend should operate upon a request to create a new passkey.

### Feature detection

Before displaying a "Create a new passkey" button, check if:

* The browser supports WebAuthn.
* The device supports a platform authenticator (can create a passkey and 
  authenticate with the passkey).
* The browser supports [WebAuthn conditional UI](/passkey-form-autofill/).

```js  
// Availability of `window.PublicKeyCredential` means WebAuthn is usable.  
// `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.  
// `​​isConditionalMediationAvailable` means the feature detection is usable.  
if (window.PublicKeyCredential &&  
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&  
    PublicKeyCredential.​​isConditionalMediationAvailable) {  
  // Check if user verifying platform authenticator is available.  
  Promise.all([  
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),  
    PublicKeyCredential.​​isConditionalMediationAvailable(),  
  ]).then(results =&gt; {  
    if (results.every(r =&gt; r === true)) {  
      // Display "Create a new passkey" button  
    }  
  });  
}  
```

Without all the conditions met, passkeys are not supported on this browser. 
"Create a new passkey" button shouldn't be displayed.

### Fetch important information from the backend

When the user clicks the button, fetch important information to call 
`navigator.credentials.create()` from the backend:

* **[`challenge`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-challenge)**: 
  A server-generated challenge in ArrayBuffer for this registration. This is 
  required but unused during registration unless doing 
  [attestation](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API/Attestation_and_Assertion)—an 
  advanced topic not covered here. Absent attestation, it can be set to `new 
  Uint8Array([0])`, but never do this during sign-in.
* **[`user.id`](https://w3c.github.io/webauthn/#dom-publickeycredentialuserentity-id)**: 
   A user's unique ID. This must be an ArrayBuffer which does not include 
  personally identifying information, e.g., e-mail addresses or usernames. A 
  random, 16-byte value generated per account will work well.
* **[`user.name`](https://w3c.github.io/webauthn/#dom-publickeycredentialentity-name)**: 
  This should be a unique identifier for the account that the user will 
  recognise, like their email address or username. This will be displayed in the 
  account selector. (If using a username, use the same value as in password 
  authentication.)
* **[`user.displayName`](https://w3c.github.io/webauthn/#dom-publickeycredentialuserentity-displayname)**: 
  This is an optional, more friendly name for the account. It need not be unique 
  and could be the user's chosen name. If your site does not have a suitable 
  value to include here, pass an empty string. This may be displayed on the 
  account selector depending on the browser.
* **[`excludeCredentials`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-excludecredentials)**:
  Prevents registering the same device by providing a list of already registered
  credential IDs. The
  [`transports`](https://w3c.github.io/webauthn/#dom-publickeycredentialdescriptor-transports)
  member, if provided, should contain the result of calling
  [`getTransports()`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-gettransports)
  during the registration of each credential.

{% Aside %}

ArrayBuffer values transferred from the server such as `challenge`, `user.id`
and credential `id` for `excludeCredentials` need to be encoded on transmission.
Don't forget to decode them on the frontend before passing to the WebAuthn API
call. We recommend using Base64URL encode.

{% endAside %}

### Call WebAuthn API to create a passkey

Call `navigator.credentials.create()` to create a new passkey. The API returns 
a promise, waiting for the user's interaction displaying a modal dialog.

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
    type: 'public-key',  
    transports: ['internal'],  
  }],  
  authenticatorSelection: {  
    authenticatorAttachment: "platform",  
    requireResidentKey: true,  
  }  
};

const credential = await navigator.credentials.create({  
  publicKey: publicKeyCredentialCreationOptions  
});

// Encode and send the credential to the server for verification.  
```

The parameters not explained above are:

* **[`rp.id`](https://w3c.github.io/webauthn/#dom-publickeycredentialrpentity-id)**: 
  An RP ID is a domain and a website can specify either its domain or a 
  registrable suffix. For example, if an RP's origin is 
  `https://login.example.com:1337`, the RP ID can be either 
  `login.example.com` or `example.com`. If the RP ID is specified as 
  `example.com`, the user can authenticate on `login.example.com` or on any 
  subdomains on `example.com`.
* **[`rp.name`](https://w3c.github.io/webauthn/#dom-publickeycredentialentity-name)**: 
  The RP's name.
* **[`pubKeyCredParams`](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-pubkeycredparams)**: 
  This specifies the RP's supported public-key algorithms. We recommend setting 
  it to `[{alg: -7, type: "public-key"},{alg: -257, type: "public-key"}]`. 
  This specifies support for ECDSA with P-256 and RSA PKCS\#1 and supporting 
  these gives complete coverage.
* **[`authenticatorSelection.authenticatorAttachment`](https://w3c.github.io/webauthn/#dom-authenticatorselectioncriteria-authenticatorattachment)**: 
  Set it to "platform". This indicates that we want an authenticator that is 
  embedded into the platform device, and the user will not be prompted to insert 
  e.g. a USB security key.
* **[`authenticatorSelection.requireResidentKey`](https://w3c.github.io/webauthn/#dom-authenticatorselectioncriteria-residentkey)**: 
  Set it to a boolean "true". Requiring a discoverable credential (resident key) 
  stores user information to the passkey and lets users select the account upon 
  authentication.

{% Aside %}

Note: Some browsers don't require any parameters on `authenticatorSelection` 
to create a passkey, but others may. We recommend specifying those parameters 
explicitly.

{% endAside %}

### Send the returned public key credential to the backend

After the user consents using the device's screen lock, a passkey is created and 
the promise is resolved returning a 
[PublicKeyCredential](https://w3c.github.io/webauthn/#authenticatorattestationresponse) 
object to the frontend.

If the promise is rejected, there could be a few reasons. Treat them accordingly 
depending on the `Error` object's `name` property:

* **`InvalidStateError`**: A passkey already exists on the device. No error
  dialog will be shown to the user and the site should not treat this as an
  error—the user wanted the local device registered and it is.
* **`NotAllowedError`**: The user has canceled the operation.
* **Other exceptions**: Something unexpected happened. The browser shows an
  error dialog to the user.

The public key credential object contains the following properties:

* **[`id`](https://w3c.github.io/webauthn/#credential-id)**: A Base64URL encoded
  ID of the created passkey. This ID helps the browser to determine whether a
  matching passkey is in the device upon authentication. This needs to be stored
  in the database on the backend.
* **[`rawId`](https://w3c.github.io/webauthn/#credential-id)**: An ArrayBuffer
  version of the credential ID.
* **[`response.clientDataJSON`](https://w3c.github.io/webauthn/#client-data)**:
  An ArrayBuffer encoded client data.
* **[`response.attestationObject`](https://w3c.github.io/webauthn/#attestation-object)**:
  An ArrayBuffer encoded attestation object. This contains important information
  such as an RP ID, flags and a public key.
* **[`authenticatorAttachment`](https://w3c.github.io/webauthn/#enumdef-authenticatorattachment)**:
  Returns `"platform"` when this credential is created on a passkey capable
  device.
* **`type`**: This is always `"public-key"`.

If you use a library to handle the public key credential object on the backend,
we recommend sending the entire object to the backend after encoding it
partially with base64url.

{% Aside %}

Optionally, the `response` member of the credential - an
[`AuthenticatorAttestationResponse`](https://w3c.github.io/webauthn/#iface-authenticatorattestationresponse) 
— provides
[`getTransports()`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-gettransports),
[`getPublicKey()`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-getpublickey),
[`getAuthenticatorData()`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-getauthenticatordata),
and
[`getPublicKeyAlgorithm()`](https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-getpublickey)
functions to retrieve elements of the credential. 

{% endAside %}

### Save the credential

Upon receiving the public key credential on the backend, pass it to the FIDO
library to process the object.

{% Aside %}

We recommend using a server side library or a solution instead of writing your
own code to process a public key credential. [You can find open source libraries
here](https://github.com/herrjemand/awesome-webauthn).

{% endAside %}

Then store the information retrieved from the credential to the database for
future use. Here are typical properties to save:

* **Credential ID (Primary key)**
* **User ID**
* **Public key**

The public key credential also includes the following interesting information
that you may want to save in the database:

* **[Backup Eligibility
  flag](https://w3c.github.io/webauthn/#backup-eligibility)**: `true` if the
  device is eligible for passkey synchronization.
* **[Backup State flag](https://w3c.github.io/webauthn/#backup-state)**: `true`
  if the created passkey is actually set to be synchronized.
* **[Transports](https://w3c.github.io/webauthn/#enumdef-authenticatortransport)**:
  A list of transports the device supports: `"internal"` means the device
  supports a passkey, `"hybrid"` means it also supports [authentication on
  another
  device](https://developers.google.com/identity/passkeys/use-cases#sign-in-with-a-phone).

To authenticate the user, read [Sign in with a passkey through form
autofill](/passkey-form-autofill).

## Resources

* [Sign in with a passkey through form autofill](/passkey-form-autofill)
* [Passkeys](https://www.imperialviolet.org/2022/09/22/passkeys.html)
* [Apple document: Authenticating a User Through a Web
  Service](https://developer.apple.com/documentation/authenticationservices/authenticating_a_user_through_a_web_service)
* [Google document: Passwordless login with
  passkeys](https://developers.google.com/identity/passkeys/)
