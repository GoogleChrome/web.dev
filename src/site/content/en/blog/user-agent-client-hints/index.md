---
title: Improving user privacy and developer experience with User-Agent Client Hints
subhead:
  User-Agent Client Hints are a new expansion to the Client Hints API, that
  enables developers to access information about a user's browser in a
  privacy-preserving and ergonomic way.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: A variety of different footprints in the snow. A hint at who's been there.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

Client Hints enable developers to actively request information about the user's
device or conditions, rather than needing to parse it out of the User-Agent (UA)
string. Providing this alternative route is the first step to eventually
reducing User-Agent string granularity.

Learn how to update your existing functionality that relies on parsing the
User-Agent string to make use of User-Agent Client Hints instead.

{% Banner 'caution', 'body' %}
If you are already using User-Agent Client Hints, pay attention to the upcoming
changes. The header format is changing so the `Accept-CH` tokens exactly match
the returned headers. Previously a site could have sent `Accept-CH: UA-Platform`
to receive the `Sec-CH-UA-Platform` header and now that site should send
`Accept-CH: Sec-CH-UA-Platform`. If you've already implemented User-Agent Client
Hints, send both formats until the change has fully rolled out in stable
Chromium. See [Intent to Remove: Rename User-Agent Client Hint ACCEPT-CH
tokens](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ)
for updates.
{% endBanner %}

## Background

When web browsers make requests they include information about the browser and
its environment so that servers can enable analytics and customize the response.
This was defined all the way back in 1996 (RFC 1945 for HTTP/1.0), where you can
find the [original definition for the User-Agent
string](https://tools.ietf.org/html/rfc1945#section-10.15), which includes an
example:

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

This header was intended to specify, in order of significance, the product (e.g.
browser or library) and a comment (e.g. version).

### The state of the User-Agent string

Over the intervening _decades_, this string has accrued a variety of additional
details about the client making the request (as well as cruft, due to backwards
compatibility). We can see that when looking at Chrome's current User-Agent
string:

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

The above string contains information about the user's operating system and
version, the device model, the browser's brand and full version, enough clues to
infer it's a mobile browser, and not to mention a number of references to other
browsers for historical reasons.

The combination of these parameters with the sheer diversity of possible values
means the User-Agent string could contain enough information to allow individual
users to be uniquely identified. If you test your own browser at
[AmIUnique](https://amiunique.org/), you can see just how closely **your**
User-Agent string identifies **you**. The lower your resulting "Similarity
ratio" is, the more unique your requests are, the easier it is for servers to
covertly track you.

The User-Agent string enables many legitimate [use
cases](https://github.com/WICG/ua-client-hints/blob/master/README.md#use-cases),
and serves an important purpose for developers and site owners. However, it is
also critical that users' privacy is protected against covert tracking methods,
and sending UA information by default goes against that goal.

There's also a need to improve web compatibility when it comes to the User-Agent
string. It is unstructured, so parsing it results in unnecessary complexity,
which is often the cause for bugs and site compatibility issues that hurt users.
These issues also disproportionately hurt users of less common browsers, as
sites may have failed to test against their configuration.

## Introducing the new User-Agent Client Hints

[User-Agent Client
Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity)
enable access to the same information but in a more privacy-preserving way, in
turn enabling browsers to eventually reduce the User-Agent string's default of
broadcasting everything. [Client
Hints](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints) enforce a
model where the server must ask the browser for a set of data about the client
(the hints) and the browser applies its own policies or user configuration to
determine what data is returned. This means that rather than exposing **all**
the User-Agent information by default, access is now managed in an explicit and
auditable fashion. Developers also benefit from a simpler API - no more regular
expressions!

The current set of Client Hints primarily describes the browser's display and
connection capabilities. You can explore the details in [Automating Resource
Selection with Client
Hints](https://developers.google.com/web/updates/2015/09/automating-resource-selection-with-client-hints),
but here's a quick refresher on the process.

The server asks for specific Client Hints via a header:

⬇️ _Response from server_

```text
Accept-CH: Viewport-Width, Width
```

Or a meta tag:

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

The browser can then choose to send the following headers back in subsequent
requests:

⬆️ _Subsequent request_

```text
Viewport-Width: 460
Width: 230
```

The server can choose to vary its responses, for example by serving images at an
appropriate resolution.

{% Aside %}
There are ongoing discussions on enabling Client Hints on an initial request,
but you should consider [responsive design](/responsive-web-design-basics) or
progressive enhancement before going down this route.
{% endAside %}

User-Agent Client Hints expand the range of properties with the `Sec-CH-UA`
prefix that can be specified via the `Accept-CH` server response header. For all
the details, start with [the
explainer](https://github.com/WICG/ua-client-hints/blob/master/README.md) and
then dive into the [full proposal](https://wicg.github.io/ua-client-hints/).

{% Aside %}
Client Hints are **only sent over secure connections**, so make sure you have
[migrated your site to HTTPS](/why-https-matters).
{% endAside %}

The new set of hints is available from Chromium 84, so let's explore how it all
works.

## User-Agent Client Hints from Chromium 84

User-Agent Client Hints will only be enabled gradually on Chrome Stable as
[compatibility
concerns](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285) are
resolved. To force the functionality on for testing:

- Use Chrome 84 **beta** or equivalent.
- Enable the `chrome://flags/#enable-experimental-web-platform-features` flag.

By default, the browser returns the browser brand, significant / major version,
and an indicator if the client is a mobile device:

⬆️ _All requests_

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %}
These properties are more complex than just a single value, so [Structured
Headers](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html)
are used for representing lists and booleans.
{% endAside %}

### User-Agent response and request headers

<style>
.w-table-wrapper th:nth-of-type(1), .w-table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.w-table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

| ⬇️ Response `Accept-CH`<br>⬆️ Request header | ⬆️ Request<br>Example value                         | Description                                                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Sec-CH-UA`                                 | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | List of browser brands and their significant version.                                                                                                                        |
| `Sec-CH-UA-Mobile`                          | `?1`                                             | Boolean indicating if the browser is on a mobile device (`?1` for true) or not (`?0` for false).                                                                             |
| `Sec-CH-UA-Full-Version`                    | `"84.0.4143.2"`                                  | The complete version for the browser.                                                                                                                                        |
| `Sec-CH-UA-Platform`                        | `"Android"`                                      | The platform for the device, usually the operating system (OS).                                                                                                              |
| `Sec-CH-UA-Platform-Version`                | `"10"`                                           | The version for the platform or OS.                                                                                                                                          |
| `Sec-CH-UA-Arch`                            | `"arm"`                                        | The underlying architecture for the device. While this may not be relevant to displaying the page, the site may want to offer a download which defaults to the right format. |
| `Sec-CH-UA-Model`                           | `"Pixel 3"`                                      | The device model.                                                                                                                                                            |

{% Aside 'gotchas' %}
Privacy and compatibility considerations mean the value may be blank, not
returned, or populated with a varying value. This is referred to as
[GREASE](https://wicg.github.io/ua-client-hints/#grease).
{% endAside %}

### Example exchange

An example exchange would look like this:

⬆️ _Initial request from browser_<br> The browser is requesting the `/downloads`
page from the site and sends its default basic User-Agent.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️ _Response from server_<br> The server sends the page back and additionally
asks for the full browser version and the platform.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️ _Subsequent requests_<br> The browser grants the server access to the
additional information and sends the extra hints back in all subsequent
responses.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### JavaScript API

Alongside the headers, the User-Agent can also be accessed in JavaScript via
`navigator.userAgentData`. The default `Sec-CH-UA` and `Sec-CH-UA-Mobile` header
information can be accessed via the `brands` and `mobile` properties,
respectively:

```js
// Log the brand data
console.log(navigator.userAgentData.brands);

// output
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// Log the mobile indicator
console.log(navigator.userAgentData.mobile);

// output
false;
```

The additional values are accessed via the `getHighEntropyValues()` call. The
"high entropy" term is a reference to [information
entropy](<https://en.wikipedia.org/wiki/Entropy_(information_theory)>), in other
words - the amount of information that these values reveal about the user's
browser. As with requesting the additional headers, it's down to the browser
what values, if any, are returned.

```js
// Log the full user-agent data
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// output
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### Demo

You can try out both the headers and the JavaScript API on your own device at
[user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me).

{% Aside %}
Ensure you're using Chrome 84 Beta or equivalent with
`chrome://flags/#enable-experimental-web-platform-features` enabled.
{% endAside %}

### Hint life-time and resetting

Hints specified via the `Accept-CH` header will be sent for the duration of the
browser session or until a different set of hints are specified.

That means if the server sends:

⬇️ _Response_

```text
Accept-CH: Sec-CH-UA-Full-Version
```

Then the browser will send the `Sec-CH-UA-Full-Version` header on all requests
for that site until the browser is closed.

⬆️ _Subsequent requests_

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

However, if another `Accept-CH` header is received then that will **completely
replace** the current hints the browser is sending.

⬇️ _Response_

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️ _Subsequent requests_

```text
Sec-CH-UA-Platform: "Android"
```

The previously asked-for `Sec-CH-UA-Full-Version` **will not be sent**.

It's best to think of the `Accept-CH` header as specifying the complete set of
hints desired for that page, meaning the browser then sends the specified hints
for all the subresources on that page. While hints will persist to the next
navigation, the site should not rely or assume they will be delivered.

{% Aside 'success' %}
Always ensure you can still deliver a meaningful experience without this
information. This is to enhance the user experience, not define it. That's why
they're called "hints" and not "answers" or "requirements"!
{% endAside%}

You can also use this to effectively clear all hints being sent by the browser
by sending a blank `Accept-CH` in the response. Consider adding this anywhere
that the user is resetting preferences or signing out of your site.

This pattern also matches how hints work via the
`<meta http-equiv="Accept-CH" …>` tag. The requested hints will only be sent on
requests initiated by the page and not on any subsequent navigation.

### Hint scope and cross-origin requests

By default, Client Hints will only be sent on same-origin requests. That means
if you ask for specific hints on `https://example.com`, but the resources you
want to optimize are on `https://downloads.example.com` they **will not**
receive any hints.

To allow hints on cross-origin requests each hint and origin must be specified
by a `Feature-Policy` header. To apply this to a User-Agent Client Hint, you
need to lowercase the hint and remove the `sec-` prefix. For example:

⬇️ _Response from `example.com`_

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️ _Request to `downloads.example.com`_

```text
Sec-CH-UA-Platform: "Android"
```

⬆️ _Requests to `cdn.provider` or `img.example.com`_

```text
DPR: 2
```

## Where to use User-Agent Client Hints?

The quick answer is that you should refactor any instances where you are parsing
either the User-Agent header or making use of any of the JavaScript calls that
access the same information (i.e. `navigator.userAgent`, `navigator.appVersion`,
or `navigator.platform`) to make use of User-Agent Client Hints instead.

Taking this a step further, you should re-examine your use of User-Agent
information, and replace it with other methods whenever possible. Often, you can
accomplish the same goal by making use of progressive enhancement, feature
detection, or [responsive design](/responsive-web-design-basics).
The base problem with relying on the User-Agent data is that you are always
maintaining a mapping between the property you're inspecting and the behavior it
enables. It's a maintenance overhead to ensure that your detection is
comprehensive and remains up-to-date.

With these caveats in mind, the [User-Agent Client Hints repo lists some valid
use cases](https://github.com/WICG/ua-client-hints#use-cases) for sites.

## What happens to the User-Agent string?

The plan is to minimize the ability for covert tracking on the web by reducing
the amount of identifying information exposed by the existing User-Agent string
while not causing undue disruption on existing sites. Introducing User-Agent
Client Hints now gives you a chance to understand and experiment with the new
capability, before any changes are made to User-Agent strings.

[Eventually](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ),
the information in the User-Agent string will be reduced so it maintains the
legacy format while only providing the same high-level browser and significant
version information as per the default hints. In Chromium, this change has been
deferred until at least 2021 to provide additional time for the ecosystem to
evaluate the new User Agent Client Hints capabilities.

You can test a version of this by enabling the
`chrome://flags/#freeze-user-agent` flag from Chrome 84. This will return a
string with the historical entries for compatibility reasons, but with sanitized
specifics. For example, something like:

```text
Mozilla/5.0 (Linux; Android 9; Unspecified Device) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.0.0 Mobile Safari/537.36
```

_Photo by [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
