---
layout: post
title: Includes front-end JavaScript libraries with known security vulnerabilities
description: |
  Learn how to make your page more secure by replacing JavaScript libraries
  that have known vulnerabilities.
web_lighthouse:
  - no-vulnerable-libraries
date: 2019-05-02
updated: 2020-06-04
---

Intruders have automated web crawlers that can scan your site
for known security vulnerabilities.
When the web crawler detects a vulnerability,
it alerts the intruder.
From there,
the intruder just needs to figure out how to exploit the vulnerability on your site.

## How this Lighthouse audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags front-end JavaScript libraries with known security vulnerabilities:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="Lighthouse audit showing any front-end JavaScript libraries with known security vulnerabilities used by the page", width="800", height="190", class="w-screenshot" %}
</figure>

To detect vulnerable libraries, Lighthouse:

- Runs [Library Detector For Chrome](https://www.npmjs.com/package/js-library-detector).
- Checks the list of detected libraries against
[snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all).

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Stop using insecure JavaScript libraries

Stop using each of the libraries that Lighthouse flags.
If the library has released a newer version that fixes the vulnerability,
upgrade to that version.
If the library hasn't released a new version or is no longer maintained,
consider using a different library.

Click the links in the **Library Version** column of your report to learn more about
each library's vulnerabilities.

## Resources

- [Source code for **Includes front-end JavaScript libraries with known security vulnerabilities** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [snyk's Vulnerability DB](https://snyk.io/vuln?packageManager=all)
