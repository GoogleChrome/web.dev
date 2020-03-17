---
title: Trusted Types
subhead: Use Trusted Types to prevent DOM XSS vulnerabilities.
authors:
  - koto
date: 2020-03-25
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: hero.png
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
# thumbnail: thumbnail.png
alt: Code snippets demonstrating Cross-Site Scripting vulnerabilities.
description: |
  Introducing Trusted Types - a browser API to prevent DOM-Based Cross
  Site Scripting in modern web applications.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - security
  - trusted-types
---

## Why should you care?

DOM-Based Cross-Site Scripting (DOM XSS) is one of the most common web
application security vulnerabilities, and it's very easy to introduce it in
your application. [Trusted Types](https://github.com/w3c/webappsec-trusted-types)
give you the tools to write, security
review and maintain DOM-XSS free applications by making the dangerous Web API
functions secure by default. Trusted Types are supported in Chrome 82, with
a [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill) available
for other browsers.

{% Aside 'key-term' %}
DOM Based Cross-Site Scripting (DOM XSS) happens when data from user controlled
_source_ (like user name, or redirect URL taken from the URL fragment)
reaches a _sink_ - function that can execute arbitrary JavaScript code
(like `eval` or `.innerHTML` property setter).
{% endAside %}

## Chrome launches Trusted Types

For many years [Cross Site Scripting](https://owasp.org/www-community/attacks/xss/),
or XSS is one of the most prevalent—and dangerous—web security vulnerabilities.

There are two distinct groups of Cross Site Scripting. Some
XSSes are caused by the server-side code that insecurely creates the HTML code
forming the website. Others have a root cause on the client, where the JavaScript
code calls dangerous functions with user-controlled content.

To prevent server-side XSS, don't generate
HTML by concatenating strings and use safe contextual-autoescaping templating
libraries instead. Use a [nonce-based Content Security Policy](https://csp.withgoogle.com/docs/strict-csp.html) for additional mitigation against the bugs as they inevitably happen.

Now a browser can also help prevent the client-side (also known as DOM-based)
XSSes with [Trusted Types](https://bit.ly/trusted-types).

## API introduction

Trusted Types work by locking down the following risky Web APIs and element attributes.
You might already recognize some of them, as browsers vendors and [web frameworks](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml) already steer you away from using
these features for security reasons.

  * **Script manipulation**:<br>
    [`<script src>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-src) and setting text content of [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) elements.
  * **Generating HTML from a string**:<br>

    [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), [`outerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML),[`insertAdjacentHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML),
    [`<iframe> srcdoc`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-srcdoc),
    [`document.write`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write), [`document.writeln`](https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln),
    and [`DOMParser.parseFromString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser.parseFromString)
  * **Executing plugin content**:<br>
    [`<embed src>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed#attr-src), [`<object data>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object#attr-data) and [`<object codebase>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object#attr-codebase)
  * **Runtime JavaScript code compilation**: <br>
    `eval`, `setTimeout`, `setInterval`, `new Function()`

Trusted Types require you to process the data before passing it to the above
_sink_ functions. Just using a string will fail, as the browser doesn't know
if the data is trustworthy:

{% Compare 'worse' %}
```javascript
anElement.innerHTML  = location.href;
```
{% CompareCaption %}
With Trusted Types enabled, the browser throws a _TypeError_ and prevents using
a DOM XSS sink with a string.
{% endCompareCaption %}

{% endCompare %}

To signify that the data was securely processed, create a special object - a Trusted Type.

{% Compare 'better' %}
```javascript
anElement.innerHTML  = aTrustedHTML;
```
{% CompareCaption %}
With Trusted Types enabled, the browser accepts a `TrustedHTML` object for sinks
that expect HTML snippets. There are also `TrustedScript` and `TrustedScriptURL`
objects for other sensitive sinks.
{% endCompareCaption %}

{% endCompare %}

Trusted Types heavily reduce the DOM XSS [attack surface](https://en.wikipedia.org/wiki/Attack_surface) of your appliciation. It simplifies security reviews, and allows to enforce the type-based
security checks done when compiling, linting or bundling your code at runtime,
in the browser.

## How to start using Trusted Types?

### Prepare for receiving Content Security Policy violation reports

You can deploy a report collector on your own (there are many [open-source](https://github.com/jacobbednarz/go-csp-collector) solutions), or use one of the commercial equivalents.
You can also debug the violations in the browser:
```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### Add a report-only CSP header

Add the following HTTP Response header to documents that you want to migrate to
Trusted Types.
```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Now all the violations are reported to `//my-csp-endpoint.example`,
but the website continues to work.

{% Aside 'caution' %}
Trusted Types are only available in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
like HTTPS, so make sure your application is served in one - for example on
`localhost` or over HTTPS.
{% endAside %}

### Identify Trusted Types violations

From now on, everytime Trusted Types detect a violation, a report will be sent
to a configured `report-uri`. For example, when your application
passes a string to `innerHTML`, the browser sends the following report:

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

In `https://my.url.example/script.js` on line 39 `innerHTML` was called with
the string beginning with `<img src=x`.
This information should help you narrow down which parts of code may be
introducing DOM XSS and need to change.

{% Aside %}
Most of the violations like this can also be detected by running a code linter
or [static code checkers](https://github.com/mozilla/eslint-plugin-no-unsanitized)
on your codebase. This is preferable to quickly identify a large chunk of
violations.

That said, we recommend also analyzing the CSP violations, as these trigger if
and only if the non-conforming code is executed.
{% endAside %}

### Fix the violations
There are a couple of options for fixing a Trusted Type violation. You can [Remove the offending code](#remove-the-offending-code), [Use a library](#use-a-library), [Create a Trusted Type policy](#create-a-trusted-type-policy) or, as a last resort, [create a default policy](#create-a-default-policy).

#### Rewrite the offending code
Perhaps the non-conforming functionality is not needed anymore or can be
rewritten in a modern way without using the error-prone functions?

{% Compare 'worse' %}
```javascript
el.innerHTML = '<img src=xyz.jpg>';
```
{% endCompare %}

{% Compare 'better' %}
```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```
{% endCompare %}

#### Use a library
Some libraries already generate Trusted Types that you can pass to the
sink functions. For example, you can use
[DOMPurify](https://github.com/cure53/DOMPurify) that will
sanitize a HTML snippet, removing XSS payloads.

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true);
```

DOMPurify [supports Trusted Types](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types) and will return a sanitized
HTML wrapped in a `TrustedHTML` object such that the browser does not generate
a violation.
{% Aside 'caution' %}
If the sanitization logic in DOMPurify is buggy, your application might still
have a DOM XSS vulnerability. Trusted Types force you to process a value _somehow_,
but don't yet define what the exact processing rules are, and whether they are
safe.
{% endAside %}

#### Create a Trusted Type policy
Sometimes it's not possible to remove the functionality, and there is no
library to sanitize the value and create a Trusted Type for you.
In those cases, create a Trusted Type object yourself.

For that, first create a [policy](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr). Policies are factories for Trusted Types that enforce certain security rules on their input:

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '&lt;')
  });
}
```
This code creates a 'myEscapePolicy' policy that can produce `TrustedHTML`
objects via its `createHTML` function. The defined rules will
HTML-escape `<` characters to prevent the creation of new HTML elements.

Use the policy like so:

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)>'
```

{% Aside %}
While the JavaScript function passed to `trustedTypes.createPolicy` as
`createHTML` returns a string, `createPolicy` returns a policy object that
wraps the return value in a correct type - in this case `TrustedHTML`.
{% endAside %}

#### Use a default policy
Sometimes you can't change the offending code. For example, this is the case if you're loading a 3rd party library from a CDN. In that case, use a
[default policy](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr):

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true});
  });
}
```

The policy with a name `default` is used by the browser every
time when a string is used in a sink that only accepts Trusted Type.
{% Aside 'gotchas' %}
Use the default policy sparingly, and prefer refactoring the application to use
regular policies instead. Doing so encourages the design in which the security
rules are close to the data that they process, where you have the most context
to correctly sanitize the value.
{% endAside %}

### Switch to enforcing Content Security Policy

When you application no longer produces violations, you can start enforcing
Trusted Types:

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

Voila! Now, no matter how complex your web application is, the only thing that
can introduce a DOM XSS vulnerability, is the code in one of your policies - and
you can lock that down even more by [limiting policy creation](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive).

## Further reading

- [Trusted Types GitHub](https://github.com/w3c/webappsec-trusted-types)
- [W3C specification draft](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [FAQ](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [Integrations](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
