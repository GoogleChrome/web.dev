---
layout: post
title: Links to cross-origin destinations are unsafe
description: |
  Learn how to safely link to resources on another host.
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

When you link to a page on another site using the `target="_blank"` attribute,
you can expose your site to performance and security issues:

- The other page may run on the same process as your page.
  If the other page is running a lot of JavaScript,
  your page's performance may suffer.
- The other page can access your `window` object with the `window.opener` property.
  This may allow the other page to redirect your page to a malicious URL.

Adding `rel="noopener"` or `rel="noreferrer"`
to your `target="_blank"` links avoids these issues.

{% Aside %}
As of Chromium version 88, anchors with `target="_blank"` automatically get
[`noopener` behavior by
default](https://www.chromestatus.com/feature/6140064063029248). Explicit
specification of  `rel="noopener"` helps protect users of legacy browsers
including Edge Legacy and Internet Explorer.
{% endAside %}

## How the Lighthouse cross-origin destination audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags unsafe links to cross-origin destinations:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="Lighthouse audit showing unsafe links to cross-origin destinations", width="800", height="213", class="w-screenshot" %}
</figure>

Lighthouse uses the following process to identify links as unsafe:

1. Gather all `<a>` tags that contain the `target="_blank"` attribute
   but not the `rel="noopener"` or `rel="noreferrer"` attributes.
2. Filter out any same-host links.

Because Lighthouse filters out same-host links,
there's an edge case you should be aware of if you're working on a large site:
if one page contains a `target="_blank"` link to another page on your site without using `rel="noopener"`,
the performance implications of this audit still apply.
However, you won't see these links in your Lighthouse results.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to improve your site's performance and prevent security vulnerabilities

Add `rel="noopener"` or `rel="noreferrer"`
to each link identified in your Lighthouse report.
In general, when you use `target="_blank"`, always
add `rel="noopener"` or `rel="noreferrer"`:

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"` prevents the new page from being able
to access the `window.opener` property and
ensures it runs in a separate process.
- `rel="noreferrer"` has the same effect
but also prevents the `Referer` header
from being sent to the new page.
See [Link type "noreferrer"](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer).

See the [Share cross-origin resources safely](/cross-origin-resource-sharing/)
post for more information.

## Resources

- [Source code for **Links to cross-origin destinations are unsafe** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [Share cross-origin resources safely](/cross-origin-resource-sharing/)
- [Site isolation for web developers](https://developers.google.com/web/updates/2018/07/site-isolation)
