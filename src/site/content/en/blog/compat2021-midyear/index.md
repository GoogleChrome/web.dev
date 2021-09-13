---
title: "Compat 2021 mid-year update: Flex gap everywhere"
subhead:
    "Mid-year update on Compat 2021—an effort to eliminate browser compatibility problems in five 
    key focus areas: CSS flexbox, CSS Grid, position: sticky, aspect-ratio, and CSS transforms."
authors:
  - foolip
  - kosamari 
hero: "image/Wd2sVnt4VLho4jgp7UtIyWFceE02/94aWUQEFQTPIQnn2zOoN.jpg" 
alt: "A puzzle with a missing piece." 
date: 2021-07-23 
updated: 2021-07-23 
tags:
  - blog
  - CSS
---

It's time for the mid-year update on Compat 2021—an effort to eliminate browser compatibility
problems in five key focus areas. For more details about the 
[#compat2021](https://twitter.com/search?q=%23compat2021) work and how we decided on the 
areas of focus, check out the [March announcement](/compat2021). 

Improvements to Chromium discussed in this post will reach Chrome, Edge and all Chromium-based
browsers.

## How we measure progress

You can check the [Compat 2021 dashboard](https://wpt.fyi/compat2021?feature=summary) for
[web-platform-tests](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project) 
to see the number of passing tests and the trending graphs for different browsers. 

{% Aside 'key-term' %}
The web-platform-tests project is a cross-browser test suite for the web platform. The tests are 
run periodically across multiple browsers and results are available on the 
[wpt.fyi](https://wpt.fyi/) dashboard.
{% endAside %}

 A simple "passed tests" number doesn't tell the entire story of browser compatibility, however it
 is one of the signals we use to see the progress of our effort. Fewer differences between browsers
 in test results means greater interoperability of a web feature across multiple browsers. 

<figure class="w-figure">
{% Img src="image/Wd2sVnt4VLho4jgp7UtIyWFceE02/CFL9C7UHKSrAgI5rLrvv.jpg", alt="Caption: a snapshot of Compat 2021 Dashboard (experimental browsers)", width="800", height="538" %}
  <figcaption class="w-figcaption">
    A snapshot of <a href="https://wpt.fyi/compat2021">Compat 2021 Dashboard</a> (experimental browsers).
  </figcaption>
</figure>


## CSS flexbox

All three browser engines saw 
[improvements on flexbox](https://wpt.fyi/compat2021?feature=css-flexbox). 

Safari 14.1 shipped the 
[`gap` property for flexbox](https://blogs.igalia.com/svillar/2020/10/01/closing-the-gap-in-flexbox/)
. The `gap` property is a convenient way to set spacing between items. This property is often used 
in Grid layout, and support in flexbox layout was one of the most requested features in the 
[MDN Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
. With this update, the `gap` property in flex layouts is available in all major browsers and a top 
compatibility challenge is resolved. Safari 14.1 also included many fixes for 
[images in flexbox](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/), removing the need for old workarounds. 

Firefox resolved rendering of 
[tables as flex items](https://bugzilla.mozilla.org/show_bug.cgi?id=1674302), bumping Firefox 
closer to 100% passing tests (currently at 98.5%). 

Chromium fixed 
[tables as flex items](https://bugs.chromium.org/p/chromium/issues/detail?id=1181403) as well. In 
Chromium 88, there was also a 
[rewrite of images as flex items](https://bugs.chromium.org/p/chromium/issues/detail?id=1132627), 
resolving a number of long-standing bugs. Finally, Chromium recently added 
[support for new alignment keywords](https://bugs.chromium.org/p/chromium/issues/detail?id=1011718)
: `start`, `end`, `self-start`, `self-end`, `left`, and `right`. These keywords are available to 
try in [Chrome Canary](https://www.google.com/chrome/canary/) and 
[Edge Canary](https://www.microsoftedgeinsider.com/en-us/download/canary). 


## CSS Grid  

CSS Grid usage is 
[growing steadily](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693), 
currently at 9% of page views.  All three major browser engines implement CSS Grid and are passing 
more than 89% of related web-platform-tests already. Closing the compatibility gap is important to 
support steady growth of this feature. 

So far in 2021, Safari has improved from 89% to 93% passing tests, and Chromium is working on a new
architecture to resolve more CSS Grid issues, called GridNG. This is an effort led by the Microsoft
team, and led to the recent increase from 94% to 97% in the 
[targeted Grid tests](https://wpt.fyi/compat2021?feature=css-grid). You can expect an update on 
GridNG on the [Edge blog](https://blogs.windows.com/msedgedev/) soon.

## CSS `position: sticky`

In Chromium, 
[`position: sticky` for table headers](https://bugs.chromium.org/p/chromium/issues/detail?id=702927)
 got fixed with the launch of TablesNG—a multi-year effort to re-architect rendering of tables. 
This change, together with a few 
[final](https://bugs.chromium.org/p/chromium/issues/detail?id=841432) 
[fixes](https://bugs.chromium.org/p/chromium/issues/detail?id=752022), pushed the Chrome and Edge 93
developer channel to pass 100% of the 
[targeted tests](https://wpt.fyi/compat2021?feature=position-sticky).

Beyond `position: sticky`, 
[TablesNG resolved 72 Chromium bugs](https://developer.chrome.com/blog/tablesng/)!

## CSS `aspect-ratio` property

The `aspect-ratio` property, which makes it straightforward to set width-to-height ratio, is crucial
to responsive web design. It is also a solution to prevent 
[cumulative layout shifts](/cls/). 
 
The `aspect-ratio` property is now supported in stable versions of Chrome, Edge, and Firefox, and
in 
[Safari 15 beta](https://developer.apple.com/documentation/safari-release-notes/safari-15-beta-release-notes)
. As cross-browser support improves, 
[usage](https://www.chromestatus.com/metrics/css/timeline/popularity/657) is increasing.
  
Although no browser has 100% passing tests, the compatibility gap for `aspect-ratio` is the smallest
of all five focus areas for Compat 2021. It has 
[more than 90% passing tests for all major browsers](https://wpt.fyi/compat2021?feature=aspect-ratio)
. Moving forward, we'll keep monitoring the progress using this test suite to make it a rock-solid 
feature.  

Learn more about the usage and benefits of the 
[`aspect-ratio` property on web.dev](/aspect-ratio/).

## CSS transforms

There has been a slow and steady improvement in the results of the [targeted tests for CSS
transforms](https://wpt.fyi/compat2021?feature=css-transforms), due to both bug fixes, and
improvements to the tests themselves.

The Chromium team is also working on improving the interoperability of `transform-style:
preserve-3d` and `transform :perspective()`. We hope to have more progress to share in the next
update.

## Overall score improvements 

Since the announcement in March, all three browser engines have improved their Compat 2021 scores: 

* Chrome and Edge Dev went from 86 to 92.
* Firefox went from 83 to 86.
* Safari went from 64 to 82.

Notably, Safari has pushed to close the compatibility gap by 18 points, thanks to a lot of work from
WebKit contributors. In particular the team at 
[Igalia contributed](https://www.igalia.com/2021/06/29/Igalia-Developments-in-WebKit-and-Safari-15.html)
to the `aspect-ratio` property and many improvements to Flexbox and Grid, such as `gap` for flexbox 
and various bug fixes.

## Follow the Compat 2021 progress

To follow the progress of Compat 2021, keep an eye on the 
[dashboard](https://wpt.fyi/compat2021?feature=summary), subscribe to 
[our mailing list](https://groups.google.com/g/compat2021), or reach out to usat 
[@chromiumdev](https://twitter.com/chromiumdev). If you experience any issues make sure to 
[file a bug](/how-to-file-a-good-bug/) for the affected browser.
