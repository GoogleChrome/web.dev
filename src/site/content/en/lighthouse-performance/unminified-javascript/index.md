---
layout: post
title: Minify JavaScript
description: |
  Learn about the unminified-javascript audit.
date: 2019-05-02
updated: 2020-06-24
web_lighthouse:
  - unminified-javascript
---

Minifying JavaScript files can reduce payload sizes and script parse time.
The Opportunities section of your Lighthouse report lists
all unminified JavaScript files,
along with the potential savings in [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte)
when these files are minified:

<figure class="w-figure">
  <img class="w-screenshot" src="unminified-javascript.png" alt="A screenshot of the Lighthouse Minify JavaScript audit">
</figure>

## How to minify your JavaScript files

Minification is the process of removing whitespace and any code that is not necessary
to create a smaller but perfectly valid code file.
[Terser](https://github.com/terser-js/terser) is a popular JavaScript compression tool.
webpack v4 includes a plugin for this library by default to create minified build files.

## Resources

- [Source code for **Minify JavaScript** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-javascript.js)
