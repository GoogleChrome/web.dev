---
title: Making your website "cross-origin isolated" using COOP and COEP
subhead: >
  Use COOP and COEP to set up a cross-origin isolated environment and enable
  powerful features like `SharedArrayBuffer`,
  `performance.measureUserAgentSpecificMemory()`, high resolution timer with
  better precision, and the JS Self-Profiling API.
description: >
  Some web APIs increase the risk of side-channel attacks like Spectre. To
  mitigate that risk, browsers offer an opt-in-based isolated environment called
  cross-origin isolated. Use COOP and COEP to set up such an environment and
  enable powerful features like `SharedArrayBuffer`,
  `performance.measureUserAgentSpecificMemory()`, high resolution timer with
  better precision or the JS Self-Profiling API.
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: An illustration of a person browsing a website that has a popup, an iframe, and an image.
date: 2020-04-13
updated: 2021-04-19
tags:
  - blog
  - security
origin_trial:
  url: https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281
feedback:
  - api
---


**Updates**

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
- **February 9, 2021**: Added an instruction [how to set up a reporting
  endpoint](#set-up-reporting-endpoint).
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

<div class="w-table-wrapper">
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
          will be disabled by default in Chrome 91</a>.
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
          <a href="https://wicg.github.io/js-self-profiling/">
          JS Self-Profiling API</a>
        </td>
        <td>
          Not available in any browsers yet.
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
`performance.measureUserAgentSpecificMemory()`, high resolution timer with
better precision or the JS Self-Profiling API in a more robust manner across
browser platforms.
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

A browsing context group is a group of tabs, windows or iframes which share the
same context. For example, if a website (`https://a.example`) opens a popup
window (`https://b.example`), the opener window and the popup window share the
same browsing context and they have access to each other via DOM APIs such as
`window.opener`.

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="Browsing Context Group", width="470", height="469" %}

You can check if the window opener and its openee are in separate browsing
context groups [from DevTools](#devtools-coop).

{% Aside 'codelab' %}
[See the impact of different COOP
parameters](https://first-party-test.glitch.me/coop).
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
* For iframes, use CORP and COEP headers as follows:
  `Cross-Origin-Resource-Policy: same-origin` (or `same-site`, `cross-origin`
  depending on the context) and `Cross-Origin-Embedder-Policy: require-corp`.

{% Aside 'gotchas' %}
You can enable cross-origin isolation on a document embedded within an iframe by
applying `allow="cross-origin-isolated"` feature policy to the `<iframe>` tag
and meeting the same conditions described in this document.
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
Recursively apply this to all documents. For information on the Report-Only HTTP
header, see [Observe issues using the Reporting
API](#observe-issues-using-the-reporting-api).

#### 4. Enable COEP {: #enable-coep }

Once you've confirmed that everything works, and that all resources can be
successfully loaded, apply the `Cross-Origin-Embedder-Policy: require-corp` HTTP
header to all documents including those that are embedded via iframes.

{% Aside 'codelab' %}
[See the impact of different COEP / CORP
parameters](https://first-party-test.glitch.me/coep).
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
"credentialless" mode](https://github.com/mikewest/credentiallessness/) that
allows loading resources without the CORP header by stripping all their
credentials. We are figuring out the details of how it should work, but we hope
this will lighten your burden of making sure the subresources are sending the
`Cross-Origin-Resource-Policy` header.

If you want to enable cross-origin isolation but are blocked by this, we
recommend [registering for an origin
trial](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)
and waiting until the new mode is available. We are not planning to terminate
the origin trial until the new mode is available.

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

<figure class="w-figure">
  {% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="COEP issues in the Status column of the Network panel.", width="800", height="444", class="w-screenshot w-screenshot--filled" %}
</figure>

You can then click the entry to see more details.

<figure class="w-figure">
  {% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="Details of the COEP issue are shown in the Headers tab after clicking a network resource in the Network panel.", width="800", height="241", class="w-screenshot w-screenshot--filled" %}
</figure>

You can also determine the status of iframes and popup windows through the
**Application** panel. Go to the "Frames" section on the left hand side and
expand "top" to see the breakdown of the resource structure.

<span id="devtools-coep-iframe">
You can check the iframe's status such as availability of `SharedArrayBuffer`,
etc.
</span>

<figure class="w-figure">
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframe inspector", width="800", height="480", class="w-screenshot w-screenshot--filled" %}
</figure>

<span id="devtools-coop">
You can also check the popup windows's status such as whether it's cross-origin
isolated.
</span>

<figure class="w-figure">
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Chrome DevTools popup window inspector", width="800", height="480", class="w-screenshot w-screenshot--filled" %}
</figure>

### Observe issues using the Reporting API

The [Reporting
API](https://developers.google.com/web/updates/2018/09/reportingapi) is another
mechanism through which you can detect various issues. You can configure the
Reporting API to instruct your users' browser to send a report whenever COEP
blocks the loading of a resource or COOP isolates a popup window. Chrome has
supported the
[`Report-To`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
header since version 69 for a variety of uses including COEP and COOP.

{% Aside %}
The Reporting API is undergoing transition to [a new
](https://w3c.github.io/reporting/)version. Chrome is planning to release it
soon, but will leave the older API in place for some time.
Firefox is also [considering the new
API](https://bugzilla.mozilla.org/show_bug.cgi?id=1620573). You may want to use
both APIs during the transition.
{% endAside %}

#### Set up a server to receive reports {: #set-up-reporting-endpoint}

A server with reporting endpoints needs to be set up in order to receive reports
from your COOP/COEP. There are two options:

* Use a solution that accepts reports.
* Build your own server that accepts reports.

##### Use a solution that accepts reports

There are a couple of solutions that accept reports from the browser's COOP/COEP
reporting functionality:

* [https://report-uri.com](https://report-uri.com)
* [https://uriports.com](https://uriports.com)

If there are any other solutions that accept reports, [let us know to
update this post](https://github.com/GoogleChrome/web.dev).

##### Build your own server that accepts reports

Building your own server that receives reports isn't that trivial. We have [a
lightweight sample implementation of a reporting endpoint on
glitch.com](https://reporting-endpoint.glitch.me/). ["Remix Project" to
clone](https://glitch.com/edit/#!/reporting-endpoint) and customize for your own
purposes.

<figure class="w-figure">
  {% Img src="image/admin/8Fh5mUULtCRK5K0738Ss.png", alt="Build your own reporting endpoint by forking a lightweight sample implementation on glitch.com.", width="800", height="496", class="w-screenshot w-screenshot--filled" %}
</figure>

All you have to do is to put the URL indicated in the page as the reporting
endpoint of COOP and COEP. See below to learn how to configure.

#### `Report-To`

To specify where the browser should send reports, append the `Report-To` HTTP
header to any document that is served with a COEP or COOP HTTP header. The
`Report-To` header also supports a few extra parameters to configure the
reports. For example:

```http
Report-To: { group: 'coep_report', max_age: 86400, endpoints: [{ url: 'https://reporting-endpoint.glitch.me/post'}]},{ group: 'coop_report', max_age: 86400, endpoints: [{ url: 'https://reporting-endpoint.glitch.me/post'}]}
```

The parameters object has three properties:

#### `group`

The `group` property names your various reporting endpoints. Use these names to
direct a subset of your reports. For instance, in the
`Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` directives you
can specify the relevant endpoint by providing the group name to `report-to=`.
For example:

```http
Cross-Origin-Embedder-Policy: require-corp; report-to="coep_report"
Cross-Origin-Opener-Policy: same-origin; report-to="coop_report"
```
When the browser encounters this, it will cross reference the `report-to` value
with the `group` property on the `Report-To` header to look up the endpoint.
This example cross references `coep_report` and `coop_report` to find the
endpoint `https://first-party-test.glitch.me/report`.

If you prefer to receive reports without blocking any embedded content or
without isolating a popup window, append `-Report-Only` to respective headers:
i.e. `Cross-Origin-Embedder-Policy-Report-Only` and
`Cross-Origin-Opener-Policy-Report-Only`. For example:

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep_report"
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop_report"
```

By doing this, when the browser detects cross origin resources that don't have
CORP or CORS, it sends a report using the Reporting API without actually
blocking those resources because of COEP.

Similarly, when the browser opens a cross-origin popup window, it sends a report
without actually isolating the window because of COOP. It also reports when
different browsing context groups try to access each other, but only in
"report-only" mode.

#### `max_age`

The `max_age` property specifies the time in seconds after which unsent reports
are to be dropped. The browser doesn't send the reports right away. Instead, it
transmits them out-of-band whenever there aren't any other higher priority
tasks. The `max_age` prevents the browser from sending reports that are too
stale to be useful. For example, `max_age: 86400` means that reports older than
twenty-four hours will not be sent.

#### `endpoints`

The `endpoints` property specifies the URLs of one or more reporting endpoints.
The endpoint must accept CORS if it's hosted on a different origin. The browser
will send reports with a Content-Type of `application/reports+json`.

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
  "url": "https://first-party-test.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %}
`blocked-url` is there for backward compatibility only and [will be removed
eventually](https://github.com/whatwg/html/pull/5848).
{% endAside %}

An example [COOP
report](https://html.spec.whatwg.org/multipage/origin.html#reporting) payload
when a popup window is opened isolated looks like this:

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
  "url": "https://first-party-test.glitch.me/coop?coop=same-origin&",
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
    "sourceFile": "https://first-party-test.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://first-party-test.glitch.me/coop?report-only&coop=same-origin&",
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
  "url": "https://first-party-test.glitch.me/coop?report-only&coop=same-origin&",
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

* [Why you need "cross-origin isolated" for powerful features](https://web.dev/why-coop-coep/)
* [A guide to enable cross-origin isolation](https://web.dev/cross-origin-isolation-guide/)
* [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome
  91](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
* [Monitor your web page's total memory usage with
  `measureUserAgentSpecificMemory()`](https://web.dev/monitor-total-page-memory-usage/)
