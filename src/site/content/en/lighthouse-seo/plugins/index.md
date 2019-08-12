---
layout: post
title: Document uses plugins
description: |
  Learn about the "Document uses plugins" Lighthouse audit.
web_lighthouse:
  - plugins
---

Plugins harm SEO because search engines can't index plugin content.
Also, many mobile devices don't support plugins, which creates frustrating
experiences for mobile users.

Lighthouse flags your document when it uses plugins:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="plugins.png" alt="Lighthouse audit showing document uses plugins">
</figure>

## How this audit fails

Lighthouse checks the page for elements that commonly represent plugins:

- `embed`
- `object`
- `applet`

Lighthouse then flags an element as a plugin if its MIME type matches any of the
following:

- `application/x-java-applet`
- `application/x-java-bean`
- `application/x-shockwave-flash`
- `application/x-silverlight`
- `application/x-silverlight-2`

Lighthouse also flags elements that point to a URL with a file format that is
known to represent plugin content:

- `swf`
- `flv`
- `class`
- `xap`

See the [Avoid making pages that rely on browser plugins](/remove-browser-plugins)
post for more information.

## Remove plugins

Remove the plugins from your document and convert your content to HTML.
Refer to specific documentation for the plugin,
for example, [how to switch Flash video to HTML5 video](https://developer.mozilla.org/en-US/docs/Plugins/Flash_to_HTML5/Video).
See also these
[best practices for displaying videos on the web](https://developers.google.com//web/fundamentals/media/video).

## More information

- [**Document uses plugins** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/plugins.js)
- [Unplayable content](https://developers.google.com/search/mobile-sites/mobile-seo/common-mistakes#unplayable-content)

{% include 'content/lighthouse-seo/scoring.njk' %}
