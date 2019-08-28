---
layout: post
title: Includes front-end JavaScript libraries with known security vulnerabilities
description: |
  Learn how to make your page more secure by replacing JavaScript libraries
  with known vulnerabilities.
web_lighthouse:
  - no-vulnerable-libraries
---

Intruders have automated web crawlers that can scan your site
for known security vulnerabilities.
When the web crawler detects a vulnerability,
it alerts the intruder.
From there,
the intruder just needs to figure out how to exploit the vulnerability on your site.
Lighthouse flags front-end JavaScript libraries with known security vulnerabilities:

<figure class="w-figure">
  <img class="w-screenshot" src="no-vulnerable-libraries.png" alt="Lighthouse audit showing any front-end JavaScript libraries with known security vulnerabilities used by the page">
</figure>

## How this audit fails

To detect vulnerable libraries, Lighthouse:

- Runs [Library Detector For Chrome](https://www.npmjs.com/package/js-library-detector).
- Checks the list of detected libraries against
[Snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all).

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Stop using these JavaScript libraries

An intruder can scan your entire site using a web crawler.

Stop using each of the libraries that Lighthouse flags.
If the library has released a newer version that fixes the vulnerability,
upgrade to that version, or consider using a different library.

See [Snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all)
to learn more about each library's vulnerability.

## Resources

[Source code for **Includes front-end JavaScript libraries with known security vulnerabilities** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
