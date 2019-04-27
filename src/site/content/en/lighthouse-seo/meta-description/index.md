---
layout: post
title: Document doesn't have a meta description
description: |
  Learn about the the "Document Does Not Have A Meta Description" Lighthouse audit.
author: megginkearney
web_lighthouse:
  - meta-description
---

Descriptions can be displayed in Google's search results. High-quality, unique descriptions
can make your results more relevant to search users and can increase your search traffic.

## Recommendations

- Add a description tag to the `<head>` of each of your pages.

```html
<meta name="Description" content="Put your description here.">
```

- Make sure that every page has a description.
- Use different descriptions for different pages.
- Include clearly-tagged facts in the descriptions. The descriptions don't have to be in
  sentence format. They can contain structured data.

```html
<meta name="Description" content="Author: A.N. Author, 
    Illustrator: P. Picture, Category: Books, Price: $17.99, 
    Length: 784 pages>
```

- Use quality descriptions. High-quality descriptions can be displayed in Google's search results,
and can go a long way to improving your search traffic.

See [Create good meta descriptions](https://support.google.com/webmasters/answer/35624#1) for more guidance.

## More information {: #more-info }

This audit fails if your page doesn't have a description, or if the `content` attribute of the
description is empty. Lighthouse doesn't evaluate the quality of your description.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
