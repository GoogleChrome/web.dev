---
title: Sign-up form best practices
subhead: Help your users sign up, log in and manage their account details with a minimum of fuss.
authors:
  - samdutton
scheduled: true
date: 2020-12-09
updated: 2020-12-11
description: Help your users sign up, log in and manage their account details with a minimum of fuss.
hero: image/admin/YfAltWqxvie1SP19BxBj.jpg
thumbnail: image/admin/7bDPvFWBMFIMynoqDpMc.jpg
alt: Clipboard with handwritten page showing list of vegetables sown.
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-up-form-best-practices
---

{% YouTube 'Ev2mCzJZLtY' %}

If users ever need to log in to your site, then good sign-up form design is
critical. This is especially true for people on poor connections, on mobile, in
a hurry, or under stress. Poorly designed sign-up forms get high bounce rates.
Each bounce could mean a lost and disgruntled user—not just a missed sign-up
opportunity.

{% Aside 'codelab' %}
If you would prefer to learn these best practices with a hands-on tutorial,
check out the [Sign-up form best practices codelab](/codelab-sign-up-form-best-practices).
{% endAside %}

Here is an example of a very simple sign-up form that demonstrates all of the best practices:

{% Glitch {
  id: 'signup-form',
  path: 'index.html',
  height: 700
} %}

{% Aside 'caution' %}
This post is about form best practices.

It does not explain how to implement sign-up via a third-party identity provider (federated login)
or show how to build backend services to authenticate users, store credentials, and manage accounts.

[Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)
explains how to add federated login to your sign-up options.

[12 best practices for user
account, authorization and password management](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) outlines core back-end principles for managing user accounts.
{% endAside %}

## Checklist

- [Avoid sign-in if you can](#no-forced-sign-in).
- [Make it obvious how to create an account](#obvious-account-creation).
- [Make it obvious how to access account details](#obvious-account-details).
- [Cut form clutter](#cut-clutter).
- [Consider session length](#session-length).
- [Help password managers securely suggest and store passwords](#help-password-managers).
- [Don't allow compromised passwords](#no-compromised-passwords).
- [Do allow password pasting](#allow-password-pasting).
- [Never store or transmit passwords in plain text](#salt-and-hash).
- [Don't force password updates](#no-forced-password-updates).
- [Make it simple to change or reset passwords](#password-change).
- [Enable federated login](#federated-login).
- [Make account switching simple](#account-switching).
- [Consider offering multi-factor authentication](#multi-factor-authentication).
- [Take care with usernames](#username).
- [Test in the field as well as the lab](#analytics-rum).
- [Test on a range of browsers, devices and platforms](#test-platforms).

## Avoid sign-in if you can {: #no-forced-sign-in }

Before you implement a sign-up form and ask users to create an account on your site, consider
whether you really need to. Wherever possible you should avoid gating features behind login.

The best sign-up form is no sign-up form!

By asking a user to create an account, you come between them and what they're trying to achieve.
You're asking a favor, and asking the user to trust you with personal data. Every password and item
of data you store carries privacy and security "data debt", becoming a cost and liability for
your site.

If the main reason you ask users to create an account is to save information between navigations or
browsing sessions, [consider using client-side storage](/storage-for-the-web) instead. For shopping
sites, forcing users to create an account to make a purchase is cited as a major reason for shopping
cart abandonment. You should [make guest checkout the default](/payment-and-address-form-best-practices#guest-checkout).

## Make sign-in obvious {: #obvious-account-creation}

Make it obvious how to create an account on your site, for example with a **Login** or **Sign in**
button at the top right of the page. Avoid using an ambiguous icon or vague wording ("Get on board!",
"Join us") and don't hide login in a navigational menu. The usability expert Steve Krug summed up
this approach to website usability: [Don't make me think!](https://uxplanet.org/dont-make-me-think-20-wise-thoughts-about-usability-from-steve-krug-876b563f1d63) If you need to
convince others on your web team, use [analytics](#analytics-rum) to show the impact of different
options.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KeztoU8KgAqrQ5CKBSWw.jpg", alt="Two screenshots of a mockup ecommerce website viewed on an Android phone. The one on the left uses an icon for the sign-in link that's somewhat ambiguous; the one on the right simply says 'Sign in'", width="800", height="737" %}
  <figcaption class="w-figcaption">Make sign-in obvious. An icon may be ambiguous, but a <b>Sign
  in</b> button or link is obvious.</figcaption>
</figure>

{% Aside %}
You may be wondering whether to add a button (or link) to create an account and another one for
existing users to sign in. Many popular sites now simply display a single **Sign in** button. When
the user taps or clicks on that, they also get a link to create an account if necessary. That's a
common pattern now, and your users are likely to understand it, but you can use
[interaction analytics](#analytics-rum) to monitor whether or not a single button works best.
{% endAside %}

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WUgCNqhEgvoWEVwGjfrA.jpg", alt="Screenshots of sign-in for Gmail: one page, showing Sign in button, when clicked leads to form that also has a Create account link.", width="800", height="545" %}
  <figcaption class="w-figcaption">The Gmail sign-in page has a link to create an account.<br>
    At window sizes larger than shown here, Gmail displays a <b>Sign in</b> link and a <b>Create an
  account</b> button.</figcaption>
</figure>

Make sure to link accounts for users who sign up via an identity provider such as Google and who
also sign up using email and password. That's easy to do if you can access a user's email address
from the profile data from the identity provider, and match the two accounts. The code below shows
how to access email data for a Google Sign-in user.

```js
// auth2 is initialized with gapi.auth2.init()
if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log(`Email: ${profile.getEmail()}`);
}
```

{: #obvious-account-details}

Once a user has signed in, make it clear how to access account details. In particular, make it
obvious how to [change or reset passwords](#password-change).

## Cut form clutter {: #cut-clutter}

In the sign-up flow, your job is to minimize complexity and keep the user focused. Cut the clutter.
This is not the time for distractions and temptations!

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/avoid-distractions.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">Don't distract users from completing sign-up.</figcaption>
</figure>

On sign-up, ask for as little as possible. Collect additional user data (such as name and address)
only when you need to, and when the user sees a clear benefit from providing that data. Bear in mind
that every item of data you communicate and store incurs cost and liability.

Don't double up your inputs just to make sure users get their contact details right. That slows down
form completion and doesn't make sense if form fields are autofilled. Instead, send a confirmation
code to the user once they've entered their contact details, then continue with account creation
once they respond. This is a common sign-up pattern: users are used to it.

You may want to consider password-free sign-in by sending users a code every time they sign in on
a new device or browser. Sites such as Slack and Medium use a version of this.

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/medium-sign-in.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">Password-free sign-in on medium.com.</figcaption>
</figure>

As with federated login, this has the added benefit that you don't have to manage user passwords.

## Consider session length {: #session-length}

Whatever approach you take to user identity, you'll need to make a careful decision about session
length: how long the user remains logged in, and what might cause you to log them out.

Consider whether your users are on mobile or desktop, and whether
they are sharing on desktop, or sharing devices.

{% Aside %}
You can get around some of the issues of shared devices by enforcing re-authentication for sensitive
features, for example when a purchase is made or an account updated. You can find out more about
ways to implement re-authentication from the codelab [Your First WebAuthn App](https://codelabs.developers.google.com/codelabs/webauthn-reauth/#0).
{% endAside %}

## Help password managers securely suggest and store passwords {: #help-password-managers}

You can help third party and built-in browser password managers suggest and store passwords, so that
users don't need to choose, remember or type passwords themselves. Password managers work well in
modern browsers, synchronizing accounts across devices, across platform-specific and web apps—and
for new devices.

This makes it extremely important to code sign-up forms correctly, in particular to use the correct
autocomplete values. For sign-up forms use `autocomplete="new-password"` for new passwords, and add
correct autocomplete values to other form fields wherever possible, such as `autocomplete="email"`
and `autocomplete="tel"`. You can also help password managers by using different `name` and `id`
values in sign-up and sign-in forms, for the `form` element itself, as well as any `input`, `select`
and `textarea` elements.

You should also use the appropriate [`type` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)
to provide the right keyboard on mobile and enable basic built-in validation by the browser.
You can find out more from [Payment and address form best practices](/payment-and-address-form-best-practices#type).

{% Aside %}
[Sign-in form best practices](/sign-in-form-best-practices) has lots more tips on how to improve
form design, layout and accessibility, and how to code forms correctly in order to take advantage
of built-in browser features.
{% endAside %}

## Ensure users enter secure passwords {: #secure-passwords}

Enabling password managers to suggest passwords is the best option, and you should encourage
users to accept the strong passwords suggested by browsers and third-party browser managers.

However, many users want to enter their own passwords, so you need to implement rules for password
strength. The US National Institute of Standards and Technology explains
[how to avoid insecure passwords](https://pages.nist.gov/800-63-3/sp800-63b.html#5-authenticator-and-verifier-requirements).

{% Aside 'warning' %}
Sign-up forms on some sites have password validation rules that don't allow the strong passwords
generated by browser and third-party password managers. Make sure your site doesn't do this,
since it interrupts form completion, annoys users, and requires users to make up their own
passwords, which may be less secure than those generated by password managers.
{% endAside %}

## Don't allow compromised passwords {: #no-compromised-passwords}

Whatever rules you choose for passwords, you should never allow passwords that have been [exposed in
security breaches](https://haveibeenpwned.com/PwnedWebsites).

Once a user has entered a password, you need to check that it's not a password that's already been
compromised. The site [Have I Been Pwned](https://haveibeenpwned.com/Passwords) provides an API for password
checking, or you can run this as a service yourself.

Google's Password Manager also allows you to [check if any of your existing passwords have been
compromised](https://passwords.google.com/checkup).

If you do reject the password that a user proposes, tell them specifically why it was rejected.
[Show problems inline and explain how to fix them](https://baymard.com/blog/inline-form-validation),
as soon as the user has entered a value—not after they've submitted the sign-up form and had to
wait for a response from your server.

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/password-validation.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">Be clear why a password is rejected.</figcaption>
</figure>

## Don't prohibit password pasting {: #allow-password-pasting}

Some sites don't allow text to be pasted into password inputs.

Disallowing password pasting annoys users, encourages passwords that are memorable (and therefore
may be easier to compromise) and, according to organizations such as the UK National
Cyber Security Centre, may actually [reduce security](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords).
Users only become aware that pasting is disallowed _after_ they try to paste their password, so
[disallowing password pasting doesn't avoid clipboard vulnerabilities](https://github.com/OWASP/owasp-masvs/issues/106).

## Never store or transmit passwords in plain text {: #salt-and-hash}

Make sure to [salt and hash](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#Use_a_cryptographically_strong_credential-specific_salt) passwords—and [don't try to invent your own hashing algorithm](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html)!

## Don't force password updates {: #no-forced-password-updates}

[Don't force users to update their passwords arbitrarily.](https://pages.nist.gov/800-63-3/sp800-63b.html#-5112-memorized-secret-verifiers:~:text=Verifiers%20SHOULD%20NOT%20require%20memorized%20secrets%20to%20be%20changed%20arbitrarily%20(e.g.%2C%20periodically).)

Forcing password updates can be costly for IT departments, annoying to users, and [doesn't have much
impact on security](https://pages.nist.gov/800-63-FAQ/#q-b05). It's also likely to encourage people
to use insecure memorable passwords, or to keep a physical record of passwords.

Rather than force password updates, you should monitor for unusual account activity and warn users.
If possible you should also monitor for passwords that become compromised because of data breaches.

You should also provide your users with access to their account login history, showing them where
and when a login happened.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zZXmhWc9bZ1GtvrE5Ooq.jpg", alt="Gmail account activity page", width="800", height="469" %}
  <figcaption class="w-figcaption"><a href="https://support.google.com/mail/answer/45938?hl=en-GB"
    title="Find out how to view Gmail account activity.">Gmail account activity page</a>.</figcaption>
</figure>

## Make it simple to change or reset passwords {: #password-change}

Make it obvious to users where and how to **update** their account password. On some sites, it's
surprisingly difficult.

You should, of course, also make it simple for users to **reset** their password if they forget it.
The Open Web Application Security Project provides detailed guidance on [how to handle lost
passwords](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

To keep your business and your users safe, it's especially important to help users change their
password if they discover that it's been compromised. To make this easier, you should add a
[`/.well-known/change-password`](https://w3c.github.io/webappsec-change-password-url/) URL to your
site that redirects to your password management page. This enables password managers to navigate
your users directly to the page where they can change their password for your site. This feature is
now implemented in Safari, Chrome, and is coming to other browsers. [Help users change passwords
easily by adding a well-known URL for changing passwords](/change-password-url) explains how to
implement this.

You should also make it simple for users to delete their account if that's what they want.

## Offer login via third-party identity providers {: #federated-login}

Many users prefer to log in to websites using an email address and password sign-up form.
However, you should also enable users to log in via a third party identity provider, also known as
federated login.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jubgwX1shLB7qAIiioTU.jpg", alt="WordPress login page", width="800", height="513" %}
  <figcaption class="w-figcaption">WordPress login page, with Google and Apple login options.</figcaption>
</figure>

This approach has several advantages. For users who create an account using federated login, you
don't need to ask for, communicate, or store passwords.

You may also be able to access additional verified profile information from federated login, such
as an email address—which means the user doesn't have to enter that data and you don't need to do
the verification yourself. Federated login can also make it much easier for users when they get a
new device.

[Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)
explains how to add federated login to your sign-up options. [Many other](https://en.wikipedia.org/wiki/Federated_identity#Examples) identity platforms are available.

{% Aside %}
"First day experience" when you get a new device is increasingly important. Users expect to log in from
multiple devices including their phone, laptop, desktop, tablet, TV, or from a car. If your sign-up
and sign-in forms aren't seamless, this is a moment where you risk losing users, or at least losing
contact with them until they get set up again. You need to make it as quick and easy as possible for
users on new devices to get up and running on your site. This is another area where federated login
can help.
{% endAside %}

## Make account switching simple {: #account-switching}

Many users share devices and swap between accounts using the same browser. Whether users access
federated login or not, you should make account switching simple.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sPDZJIY5Vo2ijqyuofCy.jpg", alt="Gmail, showing account switching", width="800", height="494" %}
  <figcaption class="w-figcaption">Account switching on Gmail.</figcaption>
</figure>

## Consider offering multi-factor authentication {: #multi-factor-authentication}

Multi-factor authentication means ensuring that users provide authentication in more than one way.
For example, as well as requiring the user to set a password, you might also enforce verification
using a one-time-passcode sent by email or an SMS text message, or by using an app-based one-time
code, security key or fingerprint sensor. [SMS OTP best practices](/sms-otp-form) and
[Enabling Strong Authentication with WebAuthn](https://developers.google.com/web/updates/2018/05/webauthn)
explain how to implement multi-factor authentication.

You should certainly offer (or enforce) multi-factor authentication if your site handles personal or
sensitive information.

## Take care with usernames {: #username}

Don't insist on a username unless (or until) you need one. Enable users to sign up and sign in with
only an email address (or telephone number) and password—or [federated login](#federated-login)
if they prefer. Don't force them to choose and remember a username.

If your site does require usernames, don't impose unreasonable rules on them, and don't stop users
from updating their username. On your backend you should generate a unique ID for every user account,
not an identifier based on personal data such as username.

Also make sure to use `autocomplete="username"` for usernames.

{% Aside 'caution' %}
As with personal names, ensure that usernames aren't restricted to characters from the [Latin
alphabet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types:~:text=Latin%20alphabet). [Payment and address form best practices](/payment-and-address-form-best-practices#unicode-matching)
explains how and why to validate using Unicode letter matching.
{% endAside %}

## Test on a range of devices, platforms, browsers and versions {: #test-platforms}

Test sign-up forms on the platforms most common for your users. Form element functionality may vary,
and differences in viewport size can cause layout problems. BrowserStack enables [free testing for
open source projects](https://www.browserstack.com/open-source) on a range of devices and browsers.

## Implement analytics and Real User Monitoring {: #analytics-rum}

You need [field data as well as lab data](/how-to-measure-speed/#lab-data-vs-field-data)
to understand how users experience your sign-up forms. Analytics and [Real User Monitoring](https://developer.mozilla.org/en-US/docs/Web/Performance/Rum-vs-Synthetic#Real_User_Monitoring)
(RUM) provide data for the actual experience of your users, such as how long sign-up pages take to
load, which UI components users interact with (or not) and how long it takes users to complete
sign-up.

- **Page analytics**: [page views, bounce rates and exits](https://analytics.google.com/analytics/academy/course/6) for every page in your sign-up flow.
- **Interaction analytics**: [goal funnels](https://support.google.com/analytics/answer/6180923?hl=en)
  and [events](https://developers.google.com/analytics/devguides/collection/gtagjs/events)
  indicate where users abandon the sign-up flow and what proportion of users click buttons,
  links, and other components of your sign-up pages.
- **Website performance**: [user-centric metrics](/user-centric-performance-metrics)
  can tell you if your sign-up flow is slow to load or [visually unstable](/cls).

Small changes can make a big difference to completion rates for sign-up forms. Analytics and RUM
enable you to optimize and prioritize changes, and monitor your site for problems that aren't
exposed by local testing.

## Keep learning {: #resources }

- [Sign-in form best practices](/sign-in-form-best-practices)
- [Payment and address form best practices](/payment-and-address-form-best-practices)
- [Create Amazing Forms](https://developers.google.com/web/fundamentals/design-and-ux/input/forms)
- [Best Practices For Mobile Form Design](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [More capable form controls](/more-capable-form-controls)
- [Creating Accessible Forms](https://webaim.org/techniques/forms/)
- [Streamlining the Sign-up Flow Using Credential Management API](https://developers.google.com/web/updates/2016/04/credential-management-api)
- [Verify phone numbers on the web with the WebOTP API](/web-otp)

Photo by [@ecowarriorprincess](https://unsplash.com/@ecowarriorprincess) on [Unsplash](https://unsplash.com/photos/lUShu7PHIGA).
