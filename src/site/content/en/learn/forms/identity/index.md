---
title: Identity
description: >
  Learn how to build secure and accessible sign-up and sign-in forms, and find out how to help users change their account settings.
authors:
  - michaelscharnagl
date: 2021-11-03
---

{% Aside 'warning' %}  
User account [authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) 
is a complex issue in terms of privacy and security. 
To guarantee the safety of user accounts, it may be better to use a 
[third-party identity provider](/sign-up-form-best-practices/#federated-login), 
instead of building your own secure authentication system.

Learn more about 
[best practices for account authentication, and password management](https://cloud.google.com/blog/products/identity-security/account-authentication-and-password-management-best-practices).  
{% endAside %}

## Help users sign up

The sign-up form is often the first interaction with a form on your website. 
Good sign-up form design is critical, and a secure form is essential. 

{% Aside %}
Only require sign-up if you really need to. 
If you only want to store information between navigations, 
consider [using client-side storage](/storage-for-the-web/). 
For checkout forms, add a guest checkout by default. 
You can ask new customers if they want to sign up after they've completed a purchase, 
or when they enter address details.  
{% endAside %}

Let's look at a sign-up form, and how you can help users sign up on your website.

{% Codepen {  
  user: 'web-dot-dev',  
  id: '42a33b97484873a214f8a945a3b55f71',  
  height: 450  
} %}

Keep the sign-up form minimal and only show the required form controls to create an account. 
Don't double up your form controls to help users get their account details right. 
Send a confirmation email instead.

### Help users fill in their account details

You can help users fill in their account details by using the appropriate `autocomplete` attribute. 
Use `autocomplete="email"` for the email field, and `autocomplete="new-password"` for a new-password field. 

Learn more about [autofilling input controls](/learn/forms/autofill).

{% Aside 'warning' %}  
Don't disallow pasting into password fields. 
It's annoying for users, encourages passwords that are memorable and less secure, 
and makes it harder for password managers to suggest and autofill a secure password.

Learn more about why you should always 
[allow pasting passwords](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords).  
{% endAside %}

You can also help users enter a secure password by offering a reveal-password `<button>`.  
Learn more about the [reveal-password pattern](/learn/forms/javascript#ensure-users-can-see-the-password-they-entered).

### Ensure your sign-up form is secure

Never store or transmit passwords in plain text. 
Make sure to [salt and hash](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#Use_a_cryptographically_strong_credential-specific_salt) 
passwords—and [don't try to invent your own hashing algorithm](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html).

Offer [multi-factor authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), 
especially if you store personal or sensitive data. 
[SMS OTP best practices](/sms-otp-form) and 
[Enabling Strong Authentication with WebAuthn](https://developer.chrome.com/blog/webauthn/) 
explain how to implement multi-factor authentication.

Ensure users don't use compromised passwords. 
For example, use the API from [Have I Been Pwned](https://haveibeenpwned.com/API/) 
to detect compromised passwords, 
and suggest your users fill in a different new password, 
or warn them if their password becomes compromised.

## Help users sign in

Let's see how to build a sign-in form to ensure users can easily sign in to your website.

{% Codepen {  
  user: 'web-dot-dev',  
  id: '89610184f6c51990ab9484b593e1d951',  
  height: 500  
} %}

Make the location of sign-up and sign-in buttons obvious. 
Ensure your form is usable on touch devices:

-  The [tap target size](/accessible-tap-targets/) of buttons is at least 48px.
-  The `font-size` of your form elements is big enough (`20px` is about right on mobile).
-  There is enough space (`margin`) between form controls, and that inputs are large enough (use at least `padding: 15px` on mobile).

### Help users fill in their email and password

Help browsers and password managers autofill account details. 
Use `autocomplete="email"` for the email field, 
and `autocomplete="current-password"` for a current password field.

To help users manually fill in their account details, use `type="email"` 
for the email field to show the appropriate on-screen keyboard on mobile devices. 

Use the `required` attribute for your email and password field so you can warn of invalid values when the user submits the form. 
Consider using [real-time validation](/learn/forms/javascript#ensure-users-are-notified-about-errors-in-real-time) 
to help users correct invalid data as soon as they have entered it, rather than waiting for form 
submission.

### Ensure users can see the password they entered

The text you fill in for `<input type="password">` is obscured by default, 
to respect the privacy of users. 
Help users to enter their password, 
by showing a `<button>` to toggle the visibility of the entered text.

{% Codepen {  
  user: 'web-dot-dev',  
  id: 'bd8577c5380c436dba2788c7a2c8652a',  
  height: 300  
} %}

Learn more about 
[implementing a password-reveal `<button>`](/learn/forms/javascript/#ensure-users-can-see-the-password-they-entered).

## Ensure your sign-in and sign-up forms are usable

Test your sign-in and sign-up forms regularly with real people to make sure that authentication works as expected. 
Use analytics and [real user measurement (RUM)](/user-centric-performance-metrics/) to collect field data, 
and tools such as [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 
and [PageSpeed Insights](https://pagespeed.web.dev/) to run tests yourself. 
Learn more about [testing for usability](/learn/forms/usability-testing) and 
[gathering analytics data](/learn/forms/data).

Ensure your forms work in different browsers and on different platforms. 
Test your form on different screen sizes, using only your keyboard, 
or using a screen reader such as 
[VoiceOver](https://www.youtube.com/watch?v=5R-6WvAihms&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=6) on Mac or 
[NVDA](https://www.nvaccess.org/) on Windows.

## Help users change their account settings

Make sure that users can change every account setting, 
including email addresses, passwords, and usernames.

Make it transparent what data you are storing, 
and help users download all their personal data at any time. 
Ensure users can delete their account if that's what they want. 
Account management features such as these may be a legal requirement in some regions.

### Ensure users can update their passwords

Make it easy for users to update their password.

{% Codepen {  
  user: 'web-dot-dev',  
  id: 'dd3ac6198324f644774583c02bf0fbd8',  
  height: 450  
} %}

Ask users for the current password before changing it, 
and send an email about a password change with the option to revert and lock the account.  

Add the option to request a new password, 
and consider providing a [`.well-known` URL](/change-password-url/) for requesting a new password.

## Resources

-  [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
-  [Understanding the root cause of account takeover](https://security.googleblog.com/2017/11/new-research-understanding-root-cause.html)
-  [Password security: Complexity vs. length](https://resources.infosecinstitute.com/topic/password-security-complexity-vs-length/)
-  [Sign-up form best practices](/sign-up-form-best-practices)
-  [Sign-in form best practices](/sign-in-form-best-practices)
-  [Effective password management | Session](https://www.youtube.com/watch?v=4Ve2kw_AN84)
