---
title: Security and privacy
description: >
  Learn how to make your forms secure and keep your users' data private.
authors:
  - michaelscharnagl
date: 2021-09-30
---

When you create a form, you work with user data.
Your number one concern should be to ensure that user data is kept private and transferred securely.
Let's have a look at what can be done.

{% Aside %}
A secure form means that all data is encrypted, kept secure, and no unauthorized access can happen.

To ensure privacy, only save the data you need,
only save personal data after consent, ensure the user is in full control of their data,
and never share user data with others without the user's consent.
{% endAside %}

## Ensure your form is secure

As a first step, make sure to request as little data as possible.
Don't ask for data you don't need,
and always question whether you need all of the requested data.
Less data means less risk, less cost, and less liability.
In addition, reducing the number of fields in a form makes it less complex,
easier to fill out, and can reduce abandonment rates.

[Always use HTTPS](/secure/#secure-connections-with-https),
especially for pages that include a form.
With HTTPS, data is encrypted when coming from the server and when going back to the server.

Say you're sitting in a café using public Wi-Fi.
You open an e-commerce site and fill in your credit card information to purchase something.
If the website uses HTTP, anyone (with the skills to do so)
on the same public Wi-Fi could see your credit card information.
If the website uses HTTPS, the data is encrypted and therefore protected from anyone trying to access it.

On your site, you should also make sure to redirect any HTTP requests to HTTPS.
Learn more about
[how to redirect all traffic to HTTPS](https://geekflare.com/http-to-https-redirection/).

## Help users to keep their data private

In the first module, you learned about two possible ways to transfer data:
using a `GET` request and using a `POST` request. With a `GET` request,
form data is included as a
[query string](https://en.wikipedia.org/wiki/Query_string) in the request URL.

If you submit a form that uses a `GET` request,
the browser adds the request URL including form data to your browsing history.
Convenient if you want to look up past form submissions,
for example for a search form. Not great at all,
if sensitive data is submitted,
and everybody with access to your browser history or local network can see this information.

Use `POST` requests for every form where data that's personal or otherwise sensitive may be submitted.
This way, the data is only visible to the backend script processing it.

What about saving and processing personal data directly in the browser?
You could use client storage, for example, `localStorage` to store personal data in the browser.
With regard to privacy, this is less than ideal.
Again, everyone with access to your browser is able to read this information.
You should only store encrypted values for personal data.

## Ensure users can safely sign up and sign in on your site

User account [authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
is a complex issue in terms of privacy and security.
It may be better to use a
[third-party identity provider](/sign-up-form-best-practices/#federated-login),
instead of building your own secure authentication system.

Learn more about
[best practices for account authentication, and password management](https://cloud.google.com/blog/products/identity-security/account-authentication-and-password-management-best-practices).

{% Aside %}
If you do choose to build your own authentication system, make sure to follow best practice for password management:

- Never store or transmit passwords in plain text.
Make sure to salt and hash passwords—and
[don't try to invent your own hashing algorithm](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html).
- Ensure users enter [secure passwords](https://pages.nist.gov/800-63-3/sp800-63b.html#5-authenticator-and-verifier-requirements).
- Don't allow [compromised passwords](/sign-up-form-best-practices/#no-compromised-passwords).
- Don't force [password updates](/sign-up-form-best-practices/#no-forced-password-updates).
- Make it simple for users to change or reset passwords.
{% endAside %}

## Help users access their personal data

Many regions have laws and regulations regarding data protection and privacy,
including the
[CCPA](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act) in California and the
[PDPA](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3244203) in India.
Every website available in the European Union (EU) has to follow
[General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) (GDPR),
even if the site is not based in the EU.

GDPR sets guidelines for the collection and processing of personal information from people living in the EU.
Consent is required to process personal data,
users can request personal information that you store at any time,
and you have to officially announce data leaks.
A good thing for the user, as this ensures their privacy is respected. Learn more about
[GDPR](https://www.smashingmagazine.com/2018/02/gdpr-for-web-developers/).

Make sure your users know how you plan to process personal data.
Transparency is the key to trust.
Users should always be able to access, modify,
and delete all data you saved for them.

## Ensure users can update their personal data

Make it easy for users to update their personal data, including passwords,
email addresses, and usernames. Notify users about changes to their stored personal data,
and ensure users can revoke changes.
For example, send an email to the previous and new email address after users change their email address.

{% Aside %}
Separate the concept of user account and user identity to simplify implementing third-party identity provision.
Allow users to change their username and link multiple identities to a single user account,
for example if they sign up with an email and password, then sign up with a third-party identity provider.
{% endAside %}

Make it easy for users to delete their account, including all associated data,
and where relevant, make it possible to download data.
Account deletion is a
[legal requirement](https://ec.europa.eu/info/law/law-topic/data-protection_en) in some regions.

{% Aside %}
Link to your privacy policy on each page with a form,
especially if personal data is processed.
{% endAside %}

Require an additional authentication step,
for example, re-entering the current password,
to view or change personal information on your site.

Find out more:
[Web Application Privacy Best Practices](https://www.w3.org/TR/app-privacy-bp/).

## Ensure all data is in good shape

In a previous module, you already learned about
[validation on the frontend](/learn/forms/validation).
As a next step, you should validate the data again
[on the backend](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
before saving the data in your database.

Validation on the frontend is great,
but users might still be able to submit invalid data.
Backend validation catches these attempts,
making sure no invalid data is saved in your database.

Validation helps to ensure that the data format is valid,
but you should still not trust data entered by users.
How can you safely output the data? To prevent
[Cross Site Scripting](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) (XSS),
and ensure all data is safe to include in HTML, you must sanitize data before output.

Learn more about
[sanitizing data before output](https://benhoyt.com/writings/dont-sanitize-do-escape/).

## Ensure all submissions come from real people

To help protect your data, you have various options to prevent spam submissions from
[bots](https://en.wikipedia.org/wiki/Internet_bot#Malicious_bots).

The first option is to use a service such as
[reCAPTCHA](https://www.google.com/recaptcha/about/),
to distinguish between real people and bots.
This requires you to include a JavaScript snippet on your page,
and add some attributes to your **Submit** button.

reCAPTCHA performs various checks to find out if you are a human.
For example, it may ask you to identify images.
Automated software, such as a bot, cannot accomplish these challenges and can't submit the form.

{% Aside %}
Always make sure your spam protections are accessible.
Try them out by using a screen reader, and by only using your keyboard.
The best spam protection is useless if it makes the form unusable for real people.
{% endAside %}

### A honeypot

{% Codepen {
  user: 'web-dot-dev',
  id: 'c8e82763c4ce344eb23dfd3ef621b662',
  height: 400
} %}

Another option is to use a so-called 'honeypot': a visually hidden form field.
Humans will not recognize this field,
and ignore it, while bots will fill it in.
On the backend, your processing script checks if this field was completed.
If it was, the submission was probably from a bot, and you can ignore it.
It is important to not only hide the form field visually,
but to also hide it for screen readers.

There are also services like
[Akismet](https://akismet.com), which can help you with spam protection.
The Akismet filter works by combining information about spam captured on all participating sites,
and then using those spam rules to block future spam.
Akismet is transparent to the user, and catches most spam.

{% Assessment 'security-privacy' %}

## Resources

- [Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [Database Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html)
