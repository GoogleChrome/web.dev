---
layout: post
title: Making your website "cross-origin isolated" using COOP and COEP
subhead: >
  Use COOP and COEP to set up a cross-origin isolated environment and enable
  powerful features like `SharedArrayBuffer`,
  `performance.measureUserAgentSpecificMemory()` and high resolution timer with
  better precision.
description: >
  Some web APIs increase the risk of side-channel attacks like Spectre. To
  mitigate that risk, browsers offer an opt-in-based isolated environment called
  cross-origin isolated. Use COOP and COEP to set up such an environment and
  enable powerful features like `SharedArrayBuffer`,
  `performance.measureUserAgentSpecificMemory()` or high resolution timer with
  better precision.
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: An illustration of a person browsing a website that has a popup, an iframe, and an image.
date: 2020-04-13
updated: 2022-06-23
tags:
  - blog
  - security
origin_trial:
  url: https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281
feedback:
  - api
---

{% Aside 'caution' %}

`SharedArrayBuffer` on Chrome desktop requires cross-origin isolation starting
from Chrome 92. Learn more at [SharedArrayBuffer updates in Android Chrome 88
and Desktop Chrome
92](https://developer.chrome.com/blog/enabling-shared-array-buffer/).

{% endAside %}

**Updates**

- **June 21, 2022**: Worker scripts also need care when cross-origin isolation
  is enabled. Added some explanations.
- **Aug 5, 2021**: JS Self-Profiling API has been mentioned as one of APIs that
  require cross-origin isolation, but reflecting [recent change of the
  direction](https://github.com/shhnjk/shhnjk.github.io/tree/main/investigations/js-self-profiling#conclusion),
  it's removed.
- **May 6, 2021**: Based on feedback and issues reported we've decided to adjust
  the timeline for `SharedArrayBuffer` usage in none cross-origin isolated sites
  to be restricted in Chrome M92.
- **April 16, 2021**: Added notes about [a new COEP credentialless
  mode](https://github.com/mikewest/credentiallessness/) and [COOP
  same-origin-allow-popups to be a relaxed
  condition](https://github.com/whatwg/html/issues/6364) for cross-origin
  isolation.
- **March 5, 2021**: Removed limitations for `SharedArrayBuffer`,
  `performance.measureUserAgentSpecificMemory()`, and debugging functionalities,
  which are now fully enabled in Chrome 89. Added upcoming capabilities,
  `performance.now()` and `performance.timeOrigin`, that will have higher
  precision.
- **February 19, 2021**: Added a note about feature policy
  `allow="cross-origin-isolated"` and debugging functionality on DevTools.
- **October 15, 2020**: `self.crossOriginIsolated` is available from Chrome 87.
  Reflecting that, `document.domain` is immutable when
  `self.crossOriginIsolated` returns `true`.
  `performance.measureUserAgentSpecificMemory()` is ending its origin trial and
  is enabled by default in Chrome 89. Shared Array Buffer on Android Chrome will
  be available from Chrome 88.

{% YouTube 'XLNJYhjA-0c' %}

Some web APIs increase the risk of side-channel attacks like Spectre. To
mitigate that risk, browsers offer an opt-in-based isolated environment called
cross-origin isolated. With a cross-origin isolated state, the webpage will be
able to use privileged features including:

<div>
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer">
          <code>SharedArrayBuffer</code></a>
        </td>
        <td>
          Required for WebAssembly threads. This is available from Android
          Chrome 88. Desktop version is currently enabled by default with the
          help of <a href="https://www.chromium.org/Home/chromium-security/site-isolation">
          Site Isolation</a>, but will require the cross-origin isolated state
          and <a href="https://developer.chrome.com/blog/enabling-shared-array-buffer/">
          will be disabled by default in Chrome 92</a>.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/monitor-total-page-memory-usage/">
          <code>performance.measureUserAgentSpecificMemory()</code></a>
        </td>
        <td>
          Available from Chrome 89.
        </td>
      </tr>
      <tr>
        <td>
          <a href="https://crbug.com/1180178">
          <code>performance.now()</code>, <code>performance.timeOrigin</code></a>
        </td>
        <td>
          Currently available in many browsers with the resolution limited to
          100 microseconds or higher. With cross-origin isolation, the
          resolution can be 5 microseconds or higher.
        </td>
      </tr>
    </tbody>
    <caption>Features that will be available behind cross-origin isolated
    state.</caption>
  </table>
</div>

The cross-origin isolated state also prevents modifications of
`document.domain`. (Being able to alter `document.domain` allows communication
between same-site documents and has been considered a loophole in the
same-origin policy.)

To opt in to a cross-origin isolated state, you need to send the following
HTTP headers on the main document:

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

These headers instruct the browser to block loading of resources or iframes
which haven't opted into being loaded by cross-origin documents, and prevent
cross-origin windows from directly interacting with your document. This also
means those resources being loaded cross-origin require opt-ins.

You can determine whether a web page is in a cross-origin isolated state by
examining
[`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated).

This article shows how to use these new headers. In [a follow-up
article](/why-coop-coep) I will provide more background and context.

{% Aside %}

This article is aimed at those who would like to get their websites ready for
using `SharedArrayBuffer`, WebAssembly threads,
`performance.measureUserAgentSpecificMemory()` or high resolution timer with
better precision in a more robust manner across browser platforms.

{% endAside %}

{% Aside 'key-term' %}
This article uses many similar-sounding terminologies. To make things
clearer, let's define them first:

* [COEP: Cross Origin Embedder
  Policy](https://wicg.github.io/cross-origin-embedder-policy/)
* [COOP: Cross Origin Opener
  Policy](https://github.com/whatwg/html/pull/5334/files)
* [CORP: Cross Origin Resource
  Policy](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
* [CORS: Cross Origin Resource
  Sharing](https://developer.mozilla.org/docs/Web/HTTP/CORS)
* [CORB: Cross Origin Read
  Blocking](https://www.chromium.org/Home/chromium-security/corb-for-developers)
{% endAside %}

## Deploy COOP and COEP to make your website cross-origin isolated

{% Aside %}
Learn practical steps to enable cross-origin isolation at [A guide to
enable cross-origin isolation](/cross-origin-isolation-guide/).
{% endAside %}

### Integrate COOP and COEP

#### 1. Set the `Cross-Origin-Opener-Policy: same-origin` header on the top-level document

By enabling `COOP: same-origin` on a top-level document, windows with the same
origin, and windows opened from the document, will have a separate browsing
context group unless they are in the same origin with the same COOP setting.
Thus, isolation is enforced for opened windows and mutual communication between
both windows is disabled.

{% Aside 'caution' %}

This will break integrations that require cross-origin window interactions such
as OAuth and payments. To mitigate this problem, we are [exploring relaxing the
condition](https://github.com/whatwg/html/issues/6364) to enable cross-origin
isolation to `Cross-Origin-Opener-Policy: same-origin-allow-popups`. This way
the communication with the window opened by itself will be possible.

If you want to enable cross-origin isolation but are blocked by this issue, we
recommend [registering for an origin
trial](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)
and waiting until the new condition is available. We are not planning to
terminate the origin trial until this issue is safely resolved.

{% endAside %}

A browsing context group is a set of windows that can reference each other. For
example, a top-level document and its child documents embedded via `<iframe>`.
If a website (`https://a.example`) opens a popup window (`https://b.example`),
the opener window and the popup window share the same browsing context, therefore
they have access to each other via DOM APIs such as `window.opener`.

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="Browsing Context Group", width="470", height="469" %}

You can check if the window opener and its openee are in separate browsing
context groups [from DevTools](#devtools-coop).

{% Aside 'codelab' %}
[See the impact of different COOP
parameters](https://cross-origin-isolation.glitch.me/coop).
{% endAside %}

#### 2. Ensure resources have CORP or CORS enabled

Make sure that all resources in the page are loaded with CORP or CORS HTTP
headers. This step is required for [step four, enabling COEP](#enable-coep).

Here is what you need to do depending on the nature of the resource:

* If the resource is expected to be loaded **only from the same origin**, set
  the `Cross-Origin-Resource-Policy: same-origin` header.
* If the resource is expected to be loaded **only from the same site but cross
  origin**, set the `Cross-Origin-Resource-Policy: same-site` header.
* If the resource is **loaded from cross origin(s) under your control**, set the
  `Cross-Origin-Resource-Policy: cross-origin` header if possible.
* For cross origin resources that you have no control over:
    * Use the `crossorigin` attribute in the loading HTML tag if the resource is
      served with CORS. (For example, `<img src="***" crossorigin>`.)
    * Ask the owner of the resource to support either CORS or CORP.
* For iframes and worker scripts, set the `Cross-Origin-Resource-Policy:
  same-origin` (or `same-site`, `cross-origin` depending on the context).

{% Aside 'gotchas' %}

You can enable cross-origin isolation on a document embedded within an iframe by
applying `allow="cross-origin-isolated"` feature policy to the `<iframe>` tag
and meeting the same conditions described in this document. Note that entire
chain of the documents including parent frames and child frames must be
cross-origin isolated as well.

{% endAside %}

{% Aside 'key-term' %}
It's important that you understand the difference between "same-site" and
"same-origin". Learn about the difference at [Understanding same-site and
same-origin](/same-site-same-origin).
{% endAside %}

#### 3. Use the COEP Report-Only HTTP header to assess embedded resources

Before fully enabling COEP, you can do a dry run by using the
`Cross-Origin-Embedder-Policy-Report-Only` header to examine whether the policy
actually works. You will receive reports without blocking embedded content.

Recursively apply this to **all** documents including the top-level document,
iframes and worker scripts. For information on the Report-Only HTTP header, see
[Observe issues using the Reporting
API](#observe-issues-using-the-reporting-api).

#### 4. Enable COEP {: #enable-coep }

Once you've confirmed that everything works, and that all resources can be
successfully loaded, switch the `Cross-Origin-Embedder-Policy-Report-Only`
header to the `Cross-Origin-Embedder-Policy` header with the same value to all
documents including those that are embedded via iframes and worker scripts.

{% Aside 'codelab' %}
[See the impact of different COEP / CORP
parameters](https://cross-origin-isolation.glitch.me/coep).
{% endAside %}

{% Aside %}
[Squoosh](https://squoosh.app) (an image optimization PWA) [now uses COOP /
COEP](https://github.com/GoogleChromeLabs/squoosh/pull/829/files#diff-316f969413f2d9a065fcc08c7a5589c088dd1e21deebadccfc5a4372ac5e0cbbR22-R23)
to gain access to Wasm Threads (and Shared Array Buffer) as well on Android
Chrome.
{% endAside %}

{% Aside 'caution' %}

We've been exploring ways to deploy `Cross-Origin-Resource-Policy` at scale, as
cross-origin isolation requires all subresources to explicitly opt-in. And we
have come up with the idea of going in the opposite direction: [a new COEP
"credentialless"
mode](https://developer.chrome.com/blog/coep-credentialless-origin-trial/) that
allows loading resources without the CORP header by stripping all their
credentials. We hope this will lighten your burden of making sure the
subresources are sending the `Cross-Origin-Resource-Policy` header.

However, since `credentialless` mode is available on Chrome from version 96 but
not supported by any other browsers yet, some developers might find it
challenging to deploy COOP or COEP. If you prefer not to enable cross-origin
isolation yet, we recommend [registering for an origin
trial](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)
and waiting until `credentialless` is available in more browsers.

{% endAside %}

### Determine whether isolation succeeded with `self.crossOriginIsolated`

The `self.crossOriginIsolated` property returns `true` when the web page is in a
cross-origin isolated state and all resources and windows are isolated within
the same browsing context group. You can use this API to determine whether you
have successfully isolated the browsing context group and gained access to
powerful features like `performance.measureUserAgentSpecificMemory()`.

### Debug issues using Chrome DevTools

{% YouTube 'D5DLVo_TlEA' %}

For resources that are rendered on the screen such as images, it's fairly easy
to detect COEP issues because the request will be blocked and the page will
indicate a missing image. However, for resources that don't
necessarily have a visual impact, such as scripts or styles, COEP issues might
go unnoticed. For those, use the DevTools Network panel. If
there's an issue with COEP, you should see
`(blocked:NotSameOriginAfterDefaultedToSameOriginByCoep)` in the **Status**
column.

<figure>
  {% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="COEP issues in the Status column of the Network panel.", width="800", height="444" %}
</figure>

You can then click the entry to see more details.

<figure>
  {% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="Details of the COEP issue are shown in the Headers tab after clicking a network resource in the Network panel.", width="800", height="241" %}
</figure>

You can also determine the status of iframes and popup windows through the
**Application** panel. Go to the "Frames" section on the left hand side and
expand "top" to see the breakdown of the resource structure.

<span id="devtools-coep-iframe">
You can check the iframe's status such as availability of `SharedArrayBuffer`,
etc.
</span>

<figure>
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframe inspector", width="800", height="480" %}
</figure>

<span id="devtools-coop">
You can also check the popup windows's status such as whether it's cross-origin
isolated.
</span>

<figure>
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Chrome DevTools popup window inspector", width="800", height="480" %}
</figure>

### Observe issues using the Reporting API

The [Reporting API](/reporting-api) is another mechanism through which you can
detect various issues. You can configure the Reporting API to instruct your
users' browser to send a report whenever COEP blocks the loading of a resource
or COOP isolates a pop-up window. Chrome has supported the Reporting API since
version 69 for a variety of uses including COEP and COOP.

{% Aside %}

Are you already using the Reporting API with the `Report-To` header? Chrome is
transitioning to a new version of the Reporting API, which replaces `Report-To` with
`Reporting-Endpoints`; consider migrating to the new version. Check out
[Migrate to Reporting API v1](/reporting-api-migration) for details.

{% endAside %}

To learn how to configure the Reporting API and set up a server to receive
reports, head over to [Using the Reporting
API](/reporting-api/#using-the-reporting-api).

#### Example COEP report

An example [COEP
report](https://html.spec.whatwg.org/multipage/origin.html#coep-report-type)
payload when cross-origin resource is blocked looks like this:

```json
[{
  "age": 25101,
  "body": {
    "blocked-url": "https://third-party-test.glitch.me/check.svg?",
    "blockedURL": "https://third-party-test.glitch.me/check.svg?",
    "destination": "image",
    "disposition": "enforce",
    "type": "corp"
  },
  "type": "coep",
  "url": "https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %}
`blocked-url` is there for backward compatibility only and [will be removed
eventually](https://github.com/whatwg/html/pull/5848).
{% endAside %}

#### Example COOP report

An example [COOP
report](https://html.spec.whatwg.org/multipage/origin.html#reporting) payload
when a pop-up window is opened isolated looks like this:

```json
[{
  "age": 7,
  "body": {
    "disposition": "enforce",
    "effectivePolicy": "same-origin",
    "nextResponseURL": "https://third-party-test.glitch.me/popup?report-only&coop=same-origin&",
    "type": "navigation-from-response"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

When different browsing context groups try to access each other (only on
"report-only" mode), COOP also sends a report. For example, a report when
`postMessage()` is attempted would look like this:

```json
[{
  "age": 51785,
  "body": {
    "columnNumber": 18,
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "lineNumber": 83,
    "property": "postMessage",
    "sourceFile": "https://cross-origin-isolation.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
},
{
  "age": 51785,
  "body": {
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "property": "postMessage",
    "type": "access-to-coop-page-from-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

## Conclusion

Use a combination of COOP and COEP HTTP headers to opt a web page into a special
cross-origin isolated state. You will be able to examine
`self.crossOriginIsolated` to determine whether a web page is in a cross-origin
isolated state.

We'll keep this post updated as new features are made available to this
cross-origin isolated state, and further improvements are made to DevTools
around COOP and COEP.

## Resources

* [Why you need "cross-origin isolated" for powerful features](/why-coop-coep/)
* [A guide to enable cross-origin isolation](/cross-origin-isolation-guide/)
* [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome
  92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
* [Monitor your web page's total memory usage with
  `measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/)
