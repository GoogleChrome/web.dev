---
layout: post
title: Document uses plugins
description: |
  Learn about the "Document uses plugins" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - plugins
---

Search engines often can't index content that relies on browser plugins, such as
Java or Flash. That means plugin-based content doesn't show up in search
results.

Also, most mobile devices don't support plugins, which
[creates frustrating experiences for mobile users](https://developers.google.com/search/mobile-sites/mobile-seo/common-mistakes#unplayable-content).

## How the Lighthouse plugins audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
that use plugins:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lL85pZVbdytWgeGIL8wB.png", alt="Lighthouse audit showing document uses plugins", width="800", height="163", class="w-screenshot w-screenshot" %}
</figure>

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

## Don't use plugins to display your content

To convert plugin-based content to HTML, refer to guidance for that
plugin. For example, MDN explains [how to convert Flash video to HTML5 video](https://developer.mozilla.org/en-US/docs/Plugins/Flash_to_HTML5/Video).

## Resources

- [Source code for **Document uses plugins** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/plugins.js)
- [Unplayable content on mobile devices](https://developers.google.com/search/mobile-sites/mobile-seo/common-mistakes#unplayable-content)
- [Flash video to HTML5 video](https://developer.mozilla.org/en-US/docs/Plugins/Flash_to_HTML5/Video)

{% include 'content/lighthouse-seo/scoring.njk' %}
