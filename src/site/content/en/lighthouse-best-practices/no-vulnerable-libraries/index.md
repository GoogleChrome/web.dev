---
layout: post
title: Includes front-End JavaScript libraries with known security vulnerabilities
description: |
  Learn about `no-vulnerable-libraries` audit.
author: kaycebasques
web_lighthouse:
  - no-vulnerable-libraries
---

Intruders have automated web crawlers that can scan your site for known security vulnerabilities.
When the web crawler detects a vulnerability, it alerts the intruder. From there, the intruder
just needs to figure out how to exploit the vulnerability on your site.

## Recommendations

Stop using each of the libraries that Lighthouse flags. If the library has released a
newer version that fixes the vulnerability, upgrade to that version, or consider using a
different library.

See [Snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all) to learn more about each library's vulnerability.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## More information

To detect vulnerable libraries, Lighthouse:

- Runs [Library Detector For Chrome](https://www.npmjs.com/package/js-library-detector).
- Checks the list of detected libraries against [Snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all).

An intruder can scan your entire site using the process above and a web crawler.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)