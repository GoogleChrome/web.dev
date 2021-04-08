---
layout: post
title: Links do not have descriptive text
description: |
  Learn about the "Links do not have descriptive text" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - link-text
---

Link text is the clickable word or phrase in a hyperlink. When link text clearly
conveys a hyperlink's target, both users and search engines can more easily
understand your content and how it relates to other pages.

## How the Lighthouse link text audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags links
without descriptive text:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="Lighthouse audit showing links don't have descriptive text", width="800", height="191", class="w-screenshot w-screenshot" %}
</figure>

Lighthouse flags the following generic link text:

- `click here`
- `click this`
- `go`
- `here`
- `this`
- `start`
- `right here`
- `more`
- `learn more`

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to add descriptive link text

Replace generic phrases like "click here" and "learn more" with specific
descriptions. In general, write link text that clearly indicates what type of
content users will get if they follow the hyperlink.

```html
<p>To see all of our basketball videos, <a href="videos.html">click here</a>.</p>
```

{% Compare 'worse', 'Don\'t' %}
"Click here" doesn't convey where the hyperlink will take users.
{% endCompare %}

```html
<p>Check out all of our <a href="videos.html">basketball videos</a>.</p>
```

{% Compare 'better', 'Do' %}
"Basketball videos" clearly conveys that the hyperlink will take users to a page
of videos.
{% endCompare %}

{% Aside %}
You'll often need to revise the surrounding sentence to make link text
descriptive.
{% endAside %}

## Link text best practices

- Stay on topic. Don't use link text that has no relation to the page's content.
- Don't use the page's URL as the link description unless you have a good reason
  to do so, such as referencing a site's new address.
- Keep descriptions concise. Aim for a few words or a short phrase.
- Pay attention to your internal links too. Improving the quality of internal
  links can help both users and search engines navigate your site more easily.

See the [Use links wisely](https://support.google.com/webmasters/answer/7451184#uselinkswisely)
section of Google's [Search Engine Optimization (SEO) Starter Guide](https://support.google.com/webmasters/answer/7451184)
for more tips.

## Resources

- [Source code for **Links do not have descriptive text** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/link-text.js)
- [Search Engine Optimization (SEO) Starter Guide](https://support.google.com/webmasters/answer/7451184)
