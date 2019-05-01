---
layout: post
title: Document uses plugins
description: |
  Learn about plugins audit.
author: megginkearney
web_lighthouse:
  - plugins
---

Plugins harm SEO in two ways:

1. Search engines can't index plugin content. Plugin content won't show up in search results.
2. Many mobile devices don't support plugins, which creates frustrating experiences for
   mobile users This is likely to increase your bounce rate and other signals that indicate to
   search engines that the page is not helpful for mobile users.

Source:

- [Unplayable content](/search/mobile-sites/mobile-seo/common-mistakes#unplayable-content)

## Recommendations

Remove the plugins and convert your content to HTML.

See [Video](/web/fundamentals/media/video) to learn the best practices for displaying video on
the web.

## More information

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

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/plugins.js)
