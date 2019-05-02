---
layout: post
title: Document uses plugins
description: |
  Learn about plugins audit.
web_lighthouse:
  - plugins
---

Plugins harm SEO. Search engines can't index plugin content.
Many mobile devices don't support plugins,
which creates frustrating experiences for mobile users.
Lighthouse flags your document when it uses plugins:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="plugins.png" alt="Lighthouse audit showing document uses plugins">
  <figcaption class="w-figcaption">
    Fig. 1 — Document uses plugins
  </figcaption>
</figure>

## What causes this audit to fail

Lighthouse checks the page for tags that commonly represent plugins:

- `embed`
- `object`
- `applet`

And then flags each tag as a plugin if its MIME type matches any of the following:

- `application/x-java-applet`
- `application/x-java-bean`
- `application/x-shockwave-flash`
- `application/x-silverlight`
- `application/x-silverlight-2`

Or if the tag points to a URL with a file format that is known to represent plugin content:

- `swf`
- `flv`
- `class`
- `xap`

Learn more in [Avoid making pages that rely on browser plugins](/remove-browser-plugins).

## Remove plugins

Remove the plugins from your document and convert your content to HTML.
Refer to specific documentation for the plugin,
for example, [how to switch Flash video to HTML5 video](https://developer.mozilla.org/en-US/docs/Plugins/Flash_to_HTML5/Video).
See also these
[best practices for displaying videos on the web](https://developers.google.com//web/fundamentals/media/video).

{% include 'content/lighthouse-seo/scoring.njk' %}

## More information

- [Document uses plugins audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/plugins.js)
- [Unplayable content](https://developers.google.com/search/mobile-sites/mobile-seo/common-mistakes#unplayable-content)
