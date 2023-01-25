---
layout: post
title: Chrome and Firefox soon to reach major version 100
subhead: User-Agent string changes, the strategies that Chrome and Firefox are taking to mitigate the impact, and how you can help.
authors:
 - abeyad
 - karldubost
 - mihajlija
date: 2022-02-15
hero: "image/VbsHyyQopiec0718rMq2kTE1hke2/5NqnziyOJnb5h5NWNY1a.jpg"
alt: Chrome and Firefox logos.
description: |
 User-Agent string changes, the strategies that Chrome and Firefox are taking to mitigate the impact, and how you can help.
tags:
 - blog # blog is a required tag for the article to show up in the blog.
---
 
[Chrome](https://developer.chrome.com/blog/force-major-version-to-100/)
and [Firefox](https://www.otsukare.info/2021/04/20/ua-three-digits-get-ready)
will reach version 100 in a couple of months. This has the potential to cause breakage
on sites that rely on identifying the browser version to perform business logic.
This post covers the timeline of events, the strategies that Chrome and Firefox are
taking to mitigate the impact, and how you can help.
 
## User-Agent string
 
User-Agent (UA) is a string that browsers send in HTTP headers, so servers can
identify the browser.  The string is also accessible through JavaScript with
[`navigator.userAgent`](https://developer.mozilla.org/docs/Web/API/Navigator/userAgent).
It's usually formatted as follows:
 
`<browser_name>/<major_version>.<minor_version>`
 
For example, the latest release versions of browsers at the time of publishing
this post are:
 
+   Chrome: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
   (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36`
+   Firefox: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0)
   Gecko/20100101 Firefox/96.0`
+   Safari: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
   AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15`
 
## Major version 100—three-digit version number
 
Major version 100 is a big milestone for both Chrome and Firefox. It also has
the potential to cause breakage on websites as we move from a two-digit to a
_three-digit version number_.  Web developers use all kinds of techniques for
parsing these strings, from custom code to using User-Agent parsing libraries,
which can then be used to determine the corresponding processing logic. The
User-Agent and any other version reporting mechanisms will soon report a
three-digit version number.
 
### Version 100 timelines
 
Version 100 browsers will be first released in experimental versions (Chrome
Canary, Firefox Nightly), then beta versions, and then finally on the stable
channel.
 
<table>
<thead>
<tr>
<th>Browser</th>
<th>Timeline</th>
</tr>
</thead>
<tbody>
<tr>
<td>Chrome (<a href="https://chromiumdash.appspot.com/schedule">release
schedule</a>)</td>
<td>March 29, 2022</td>
</tr>
<tr>
<td>Firefox (<a
href="https://wiki.mozilla.org/Release_Management/Calendar">release
schedule</a>)</td>
<td>May 3, 2022</td>
</tr>
</tbody>
</table>
 
## Why can a three-digit version number be problematic?
 
When browsers first reached version 10 a little over 12 years ago,
[many issues were discovered](https://maqentaer.com/devopera-static-backup/http/dev.opera.com/articles/view/opera-ua-string-changes/index.html)
with User-Agent parsing libraries as the major version number went from one
digit to two. 
 
Without a single specification to follow,
[different browsers have different formats](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent)
for the User-Agent string, and site-specific User-Agent parsing. It's
possible that some parsing libraries may have hard-coded assumptions or bugs
that don't take into account three-digit major version numbers.  Many libraries
improved the parsing logic when browsers moved to two-digit version numbers, so
hitting the three-digit milestone is expected to cause fewer problems. [Mike
Taylor](https://miketaylr.com/posts/2021/09/chrome-version-100-testing.html),
an engineer on the Chrome team, has done a survey of common UA parsing
libraries which didn't uncover any issues. Running Chrome experiments in the
field has surfaced some issues, which are being worked on.
 
## What are browsers doing about it?
 
Both Firefox and Chrome have been running experiments where current versions of
the browser report being at major version 100 in order to detect possible
website breakage. This has led to a few [reported issues](https://github.com/webcompat/web-bugs/labels/version100),
some of which have already been [fixed](https://bugs.chromium.org/p/chromium/issues/detail?id=1273958).
These experiments will continue to run until the release of version 100.
 
There are also backup mitigation strategies in place, in case version 100
release to stable channels causes more damage to websites than anticipated.
 
### Chrome mitigation
 
In Chrome, the backup plan is to use a flag to freeze the major version at 99
and report the real major version number in the minor version part of the
User-Agent string (the code has already
[landed](https://chromium-review.googlesource.com/c/chromium/src/+/3341658)). 
 
The Chrome version as reported in the User-Agent string follows the pattern
`<major_version>.<minor_version>.<build_number>.<patch_number>`. 
 
If the backup plan is employed, then the User-Agent string would look like
this:
 
`99.101.4988.0`
 
Chrome is also running experiments to ensure that reporting a three-digit value
in the minor version part of the string does not result in breakage, since the
minor version in the Chrome User-Agent string has reported 0 for a very long
time. The Chrome team will decide on whether to resort to the backup option
based on the number and severity of the issues reported.
 
### Firefox mitigation
 
In Firefox, the strategy will depend on how important the breakage is. Firefox
has a
[site interventions mechanism](https://wiki.mozilla.org/Compatibility/Interventions_Releases).
Mozilla webcompat team can hot fix broken websites in Firefox using this
mechanism. If you type ``about:compat`` in the Firefox URL bar, you can see what
is currently being fixed. If a site breaks with the major version being 100 on a
specific domain, it is possible to fix it by sending version 99 instead.
 
If the breakage is widespread, it is possible to freeze the major version
number. There are then different possible strategies, each of them with their
pros and cons. Mozilla can send the real version number as a minor version
number, freeze the string entirely as-is, or send the real version number
through other parameters.
 
Every strategy that adds complexity to the User-Agent string has a strong
impact on the ecosystem. Let's work together to avoid yet another quirky
behavior.
 
## What can you do to help?
 
In Chrome and Firefox Nightly, you can configure the browser to report the
version as 100 right now and report any issues you come across.
 
### Configure Chrome to report the major version as 100
 
1.  Go to `chrome://flags/#force-major-version-to-100`.
1.  Set the option to `Enabled`.
 
### Configure Firefox Nightly to report the major version as 100
 
1.  Open Firefox Nightly's Settings menu.
1.  Search for "Firefox 100" and then check the "Firefox 100 User-Agent
   String" option.
 
### Test and file reports
 
+   **If you are a website maintainer**, test your website with Chrome
   and Firefox 100. Review your User-Agent parsing code and libraries, and
   ensure they are able to handle three-digit version numbers. We have
   compiled some of the
   [patterns that are currently breaking](https://www.otsukare.info/2022/01/14/broken-ua-detection).
+   **If you develop a User-Agent parsing library**, add tests to parse
   versions greater than and equal to 100. Our early tests show that recent
   versions of libraries can handle it correctly. However, the web has a long legacy,
   so if you have old versions of parsing libraries, it's
   time to check for issues and eventually upgrade.
+   **If you are browsing the web** and notice any issues with the major
   version 100,
   [file a report on webcompat.com](https://webcompat.com/issues/new?label=version100).