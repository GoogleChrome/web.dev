---
layout: handbook
title: Tooling and libraries
authors:
  - katiehempenius
date: 2019-07-21
description: |
  Guidance on selecting the tooling and libraries for web.dev content.
---

Choosing tooling and libraries can be one of the most overwhelming and time consuming aspects of web development. To help readers feel confident in their choices, provide instructions for well-known, well-established tools rather than an exhaustive list of options. Strike a balance between what's most commonly used and what's best practice, in terms of compatibility, accessibility, and functionality.

When appropriate, provide multiple paths, frameworks, or tools to achieve a goal. Including a codelab for each path is often a good way to achieve that goal. To see an example, check out the codelab callout at the end of the [Use Imagemin to compress images](/use-imagemin-to-compress-images/#imagemin-npm-module) post.

## Use open-source software
This keeps web.dev accessible to as many developers as possible.

## Ensure tooling is well-established
When you're planning to include tooling in a post or codelab, make sure it meets at least one of these criteria:
*   **[HTTP Archive](https://httparchive.org) data:** Tooling is used by ≥ 10K domains.
*   **[npm](https://www.npmjs.com/) weekly download statistics:** Tooling consistently has ≥ 50K weekly downloads.

Include a link to the relevant data source in your [content proposal](/handbook/quick-start/#planning).

Sometimes it's impossible to use these data sources to verify the popularity of a given tool. (For example, if you're writing an article about servers, neither data source can be used to verify the usage of [NGINX](https://www.nginx.com/).) In such cases you can demonstrate the popularity of a tool in your content proposal by listing 5–10 well-known sites that have self-identified as users.
