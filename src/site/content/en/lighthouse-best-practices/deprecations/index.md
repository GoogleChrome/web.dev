---
layout: post
title: Avoids deprecated APIs
description: |
  Learn about deprecations audit.
author: kaycebasques
web_lighthouse:
  - deprecations
---

Deprecated APIs are scheduled to be removed from Chrome. Calling these APIs
after they're removed will cause errors on your site.

## Recommendations

Lighthouse flags the deprecated APIs in your report. Go to [Chrome Platform
Status](https://www.chromestatus.com/features#deprecated) and expand the entries for the APIs that you're using
to learn more about why the APIs are deprecated, as well as how to replace
them.

## More information

Lighthouse collects the deprecated API warnings that Chrome logs to the
DevTools Console.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/deprecations.js)