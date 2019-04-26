---
layout: post
title: Manually check user's focus is directed to new content
description: |
  Learn about managed-focus audit.
authors:
 - robdodson
 - megginkearney
web_lighthouse:
  - managed-focus
---

If new content is added to the page,
try to make sure that the user’s focus is directed to that content
so they can take action on it.

## How to manually test

One common scenario where this matters is navigation behavior in single-page apps.

If new content, such as a dialog, is added to the page,
check that the user's focus is directed to it.

## How to fix

TBD.

## More information

- [Check user's focus is directed to new content audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/managed-focus.js)