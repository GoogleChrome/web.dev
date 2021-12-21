---
layout: post
title: "Compat 2021 Holiday Update: presents for developers before the end of the year"
subhead:
    "End of the year update on Compat 2021—an effort to eliminate browser compatibility problems in five key focus areas: CSS Flexbox, CSS Grid, position: sticky, aspect-ratio, and CSS transforms."
authors:
  - foolip
  - kosamari
hero: "image/Wd2sVnt4VLho4jgp7UtIyWFceE02/T4gzpGXXQ9sud6CEbHno.jpg"
alt: "A hand holding a small box of presents with red ribbon."
date: 2021-12-13
tags:
  - blog
  - css
---

The end of the year is near, and it's time for a final update on Compat 2021—an effort to eliminate
browser compatibility problems in five key focus areas.

{% Aside %}
This effort is also known as Interop 2021, matching the name of
[Interop 2022](https://github.com/web-platform-tests/interop-2022), which is the continuation of
this effort.
{% endAside %}

<div class="stats">
 <div class="stats__item">
   <p class="stats__figure">>90<sub>%</sub></p>
   <p>score in all browsers</p>
 </div>
</div>

Since our [last update](/compat2021-midyear/), we’ve continued to see improvements
in all browsers. All browsers started with much lower test scores at the beginning of the year, but
now all browsers have surpassed 90%! This means the web platform has significantly improved
interoperability of the five focus areas.

<figure>
{% Img src="image/Wd2sVnt4VLho4jgp7UtIyWFceE02/Kaz3ye7gFfow8ia7lWYW.png", alt="A snapshot of Compat
2021 Dashboard (experimental browsers)", width="800", height="727" %}
  <figcaption>
    A snapshot of <a href="https://wpt.fyi/compat2021">Compat 2021 Dashboard</a> (experimental
    browsers).
  </figcaption>
</figure>

{% Aside 'caution' %}
The graph does not correctly show the improvements in Safari Technology Preview between May and
November, as the version tested was [stuck](https://github.com/web-platform-tests/wpt/issues/31147)
at an older version. This is now resolved but the data between May and November remains incorrect.
{% endAside %}

Contributions to browser engines are made not only by browser vendors, but also others in the web
community. For this project, we particularly want to thank Igalia for
[their involvement](https://www.igalia.com/2021/11/12/New-Interoperability-Milestones.html) and
continued work to improve the scores. Igalia has contributed to improving all five focus
areas of Compat 2021.

On [wpt.fyi](https://wpt.fyi/), the test results dashboard, there’s now a
[filtered test results view](https://wpt.fyi/results/?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=label%3Ainterop-2021)
showing all of the tests included in Compat 2021, and also views for
[Chrome](https://wpt.fyi/results/?diff&filter=ADC&q=label%3Ainterop-2021&run_id=5738932147847168&run_id=5682110523244544),
[Firefox](https://wpt.fyi/results/?diff&filter=ADC&q=label%3Ainterop-2021&run_id=5644039006191616&run_id=5717852704210944),
and [Safari](https://wpt.fyi/results/?diff&filter=ADC&q=label%3Ainterop-2021&run_id=5739124314079232&run_id=5759777691926528)
comparing the results to our last update in July.

Let’s take a look at the improvements in each area!

{% Aside %}
This post uses browser engine names when referencing specific improvements or bug fixes.
**Chromium** is the engine used by Chrome and Edge, **Gecko** is used by Firefox, and
**WebKit** is used by Safari.
{% endAside %}


## CSS flexbox

`flex-basis: content` is now on its way to all browsers, with implementations landing in
[Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=470421) and
[WebKit](https://trac.webkit.org/changeset/284440/webkit). (The `content` value was already
supported by Gecko.)

In Chromium, an [issue with flexbox sizing](https://bugs.chromium.org/p/chromium/issues/detail?id=961902)
is fixed, matching the spec and Gecko’s behavior. And in Gecko, several
[issues affecting Compat 2021](https://bugzilla.mozilla.org/show_bug.cgi?id=1700745) are fixed,
including an [issue with percentage height on flex items](https://bugzilla.mozilla.org/show_bug.cgi?id=1611303).
Finally, in WebKit, support for more alignment property values ([left, right](https://trac.webkit.org/changeset/282078/webkit),
[self-start, self-end](https://trac.webkit.org/changeset/282267/webkit), [start, end](https://trac.webkit.org/changeset/281840/webkit))
is now added, and a lot of improvements were made for [absolute positioning](https://trac.webkit.org/changeset/281995/webkit),
also improving the flexbox test results in Compat 2021.


## CSS Grid

The use of CSS Grid on the web continues to grow, as can be seen in both the
[2021 Web Almanac](https://almanac.httparchive.org/en/2021/css#flexbox-and-grid-adoption) and
Chrome’s [usage metrics](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693).

The [launch of GridNG](https://blogs.windows.com/msedgedev/2021/08/10/compat2021-css-grid-gridng/)
in Chrome and Edge 93 resolved many long standing issues with Grid, closing an impressive 38 issues
in Chromium’s bug tracker. Together with many smaller improvements that followed, the Compat 2021
score for Grid in Chromium improved by 3% to 97%. This work was led by the Edge team at Microsoft.

An [absolute positioning bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1707643) affecting Grid
was fixed in Gecko, and [many fixes](https://bugs.webkit.org/buglist.cgi?bug_status=RESOLVED&chfield=resolution&chfieldfrom=2021-01-01&chfieldto=2021-12-31&component=Accessibility&component=CSS&component=Layout%20and%20Rendering&component=New%20Bugs&f1=short_desc&f2=short_desc&f3=short_desc&list_id=7744283&o1=notsubstring&o2=notsubstring&o3=substring&query_format=advanced&resolution=FIXED&v1=Web%20Inspector&v2=%5BLFC%5D&v3=grid)
have landed in WebKit, leading to a 1% improvement for Firefox and 3% improvement for Safari on
the Grid tests.


## CSS `position: sticky`

In our last update, we noted that `position: sticky` was the first area where any browser (in this
case Chrome and Edge) reached 100% passing tests. Now, following a [number of fixes](https://bugs.webkit.org/buglist.cgi?bug_status=RESOLVED&chfield=resolution&chfieldfrom=2021-01-01&chfieldto=2021-12-31&f1=short_desc&f2=short_desc&f3=short_desc&list_id=7744291&o1=notsubstring&o2=notsubstring&o3=substring&query_format=advanced&resolution=FIXED&v1=Web%20Inspector&v2=%5BLFC%5D&v3=sticky)
in WebKit’s implementation, Safari also scores 100% for these tests.  Most of these improvements
were included in Safari 15.


## CSS `aspect-ratio` property

Cross-browser support for defining the aspect ratio (width-to-height ratio) of elements has
continued to improve, with Compat 2021 scores reaching 99%, 97% and 95% for Chrome/Edge, Firefox
and Safari respectively. Most of the improvements are not with the `aspect-ratio` property itself,
but rather with how `width` and `height` attributes are [mapped to a default `aspect-ratio` value](https://developer.mozilla.org/docs/Web/Media/images/aspect_ratio_mapping)
for elements. This was implemented for multiple elements in [WebKit](https://wpt.fyi/results/html/rendering/replaced-elements/attributes-for-embedded-content-and-images?diff&filter=ADC&q=label%3Ainterop-2021&run_id=5739124314079232&run_id=6290692121821184),
and `<canvas>` for [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/3109968).


## CSS transforms

Support for `transform: perspective(none)` is now supported in
[Chromium](https://chromestatus.com/feature/5687325523705856),
[Gecko](https://bugzilla.mozilla.org/show_bug.cgi?id=1725207) and
[WebKit](https://trac.webkit.org/changeset/285255/webkit). This will make it easier to
animate between a perspective and no perspective.

In Chromium, `transform-style: preserve-3d` (which allows child elements to participate in the same
3D scene) and the `perspective` property (which applies a perspective transform to child elements)
are now [aligned with the spec](https://chromestatus.com/feature/5640541339385856) by making them
apply only to child elements.

The big increase in the [scores](https://wpt.fyi/compat2021?feature=css-transforms) for CSS
transforms for all browsers is mainly due to improvements to the test suite, where incorrect
tests have been fixed or removed. This makes it easier to understand the remaining interoperability
problems and avoid regressions in the future.


## Conclusion

We are grateful for the work that everyone has put in to end the year with many improvements to the
score as well as better testing infrastructure. `aspect-ratio` was a long requested feature from
web developers and it is now supported in all browsers. Use of flexbox, grid and `position: sticky`
are all growing, and these features are now better supported across browsers thanks to many
improvements made during 2021.

What's next? We are excited to continue collaborating with other browser vendors and the wider
community in the next iteration of this effort. We have started to research and discuss the focus
areas for 2022. Please look out for an announcement coming soon.

If you have any feedback or questions please reach out to us on Twitter at [@ChromiumDev](https://twitter.com/ChromiumDev).
