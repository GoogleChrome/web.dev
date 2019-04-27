---
layout: post
title: Page has the HTML doctype
description: |
  Learn about `doctype` audit.
author: megginkearney
web_lighthouse:
  - doctype
---

Specifying a doctype prevents the browser from switching to
[quirks-mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode).

## Recommendations

Lighthouse flags your page when it's missing `<!DOCTYPE html>`.
Learn more in [Doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype).

## More information

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)