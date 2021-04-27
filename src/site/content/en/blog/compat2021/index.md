---
title: "Compat2021: Eliminating five top compatibility pain points on the web"
subhead:
    "Google is working with other browser vendors and industry partners to fix the
    top five browser compatibility pain points for web developers: CSS Flexbox,
    CSS Grid, `position: sticky`, `aspect-ratio`, and CSS transforms."
description:
    "Learn more about how Google is working with other browser vendors and
    industry partners to fix the top five browser compatibility pain points for
    web developers: CSS Flexbox, CSS Grid, position: sticky, aspect-ratio,
    and CSS transforms."
authors:
  - robertnyman
  - foolip
hero: "image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/KQ5oNcLGKdBSuUM8pFPx.jpeg"
alt: "A puzzle with a missing piece."
date: 2021-03-22
updated: 2021-03-22
tags:
  - blog
  - CSS
---


Google is working with other browser vendors and industry partners to fix the
top five browser compatibility pain points for web developers. The areas of focus
are CSS Flexbox, CSS Grid, `position: sticky`, `aspect-ratio`, and CSS
transforms. Check out [How you can contribute and follow along](#contribute) to
learn how to get involved.

## Background

Compatibility on the web has always been a big challenge for developers. In the
last couple of years, Google and other partners, including Mozilla and
Microsoft, have set out to learn more about the top pain points for web
developers, to drive our work and prioritization to make the situation better.
This project is connected to [Google's Developer
Satisfaction](/developer-satisfaction) (DevSAT) work, and it
started on a larger scale with the creation of the
[MDN DNA (Developer Needs Assessment) surveys](https://insights.developer.mozilla.org/)
in 2019 and 2020, and a deep-dive research effort presented in the
[MDN Browser Compatibility Report 2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html).
Additional research has been done in various channels, such as the [State of
CSS](https://stateofcss.com/) and [State of JS](https://stateofjs.com/)
surveys.

The goal in 2021 is to eliminate browser compatibility problems in five key focus
areas so developers can confidently build on them as reliable foundations. This
effort is called [**#Compat2021**](https://twitter.com/search?q=%23compat2021&src=typed_query&f=live).

## Choosing what to focus on

While there are browser compatibility issues in basically all of the web
platform, the focus of this project is on a small number of the most problematic
areas which can be made significantly better, thus removing them as top issues
for developers.

The compatibility project uses multiple criteria influencing which areas to
prioritize, and some are:

+   Feature usage. For example, Flexbox is used in
    [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)
    of all page views, and adoption is growing strongly in [HTTP
    Archive](https://almanac.httparchive.org/en/2020/css#layout).
+   Number of bugs
    (in [Chromium](https://bugs.chromium.org/p/chromium/issues/list),
    [Gecko](https://bugzilla.mozilla.org/describecomponents.cgi),
    [WebKit](https://bugs.webkit.org/)), and for Chromium, how many stars those
    bugs have.
+   Survey results:

    +   [MDN DNA surveys](https://insights.developer.mozilla.org/)
    +   [MDN Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
    +   [State of CSS](https://2020.stateofcss.com/en-US/features/)
        most known and used features

+   Test results from [web-platform-tests](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project). For example, [Flexbox on
    wpt.fyi](https://wpt.fyi/results/css/css-flexbox).
+   [Can I use](https://caniuse.com/)'s most-searched-for features.

## The five top focus areas in 2021

In 2020, Chromium started work addressing the top areas outlined in
[Improving Chromium's browser compatibility in 2020](https://blog.chromium.org/2020/06/improving-chromiums-browser.html).
In 2021, we are beginning a dedicated effort to go even further. Google and
[Microsoft are working together on addressing top issues in Chromium](https://blogs.windows.com/msedgedev/2021/03/22/better-compatibility-compat2021/), along with [Igalia](https://www.igalia.com/). Igalia, who are regular contributors
to Chromium and WebKit, and maintainers of the official WebKit port for embedded devices,
have been very supportive and engaged in these compatibility efforts, and will be
helping tackle and track the identified issues.

Here are the areas which are committed to being fixed in 2021.

### CSS Flexbox

[CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
is
[widely used](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)
on the web and there are still some major challenges for developers. For example,
both [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=721123) and
[WebKit](https://bugs.webkit.org/show_bug.cgi?id=209983)
have had issues with `auto-height` flex containers leading to incorrectly sized images.

<div class="w-columns">
    <figure class="w-figure" style="display: flex; flex-direction: column;">
    {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/qmKoKHkZga5hgBeiHuBz.png", alt="Stretched photo of a chessboard.", width="800", height="400" %}
        <figcaption class="w-figcaption" style="margin-top: auto">
            Incorrectly sized image due to bugs.
        </figcaption>
    </figure>
    <figure class="w-figure" style="display: flex; flex-direction: column;">
        {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/0ruhCiZKRP9jBhnN70Xh.png", alt="Chessboard.", width="800", height="800" %}
        <figcaption class="w-figcaption" style="margin-top: auto">
            Correctly sized image. <br>
            Photo by <a href="https://unsplash.com/photos/ab5OK9mx8do">Alireza
            Mahmoudi.</a>
        </figcaption>
    </figure>
</div>


[Igalia's Flexbox Cats](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/)
blog post dives deeper into these issues with many more examples.

#### Why it is prioritized

+   Surveys: Top issue in
    [MDN Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html),
    most known and used in [State of
    CSS](https://2020.stateofcss.com/en-US/features/)
+   Tests: [85% pass](https://wpt.fyi/results/css/css-flexbox) in all browsers
+   Usage:
    [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)
    of page views, growing strongly in [HTTP
    Archive](https://almanac.httparchive.org/en/2020/css#layout)

### CSS Grid

[CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) is
a core building block for modern web layouts, replacing many older techniques
and workarounds. As adoption is growing, it needs to be rock solid, so that
differences between browsers is never a reason to avoid it. One area that's
lacking is the ability to animate grid layouts, supported in Gecko but not
[Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=759665) or
[WebKit](https://bugs.webkit.org/show_bug.cgi?id=204580). When supported,
effects like this are made possible:

<figure class="w-figure">
{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Ovs6wg9o5AJUG4IIoVvj.mp4",
  height="400",
  controls=false,
  autoplay=true,
  loop=true,
  muted=true
%}
  <figcaption class="w-figcaption">
    Animated chess demo by <a
    href="https://chenhuijing.com/blog/recreating-the-fools-mate-chess-move-with-css-grid/">Chen
    Hui Jing</a>.
  </figcaption>
</figure>

#### Why it is prioritized

+   Surveys: Runner-up in
    [MDN Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html),
    well known but less often used in [State of
    CSS](https://2020.stateofcss.com/en-US/features/)
+   Tests: [75% pass](https://wpt.fyi/results/css/css-grid) in all browsers
+   Usage:
    [8% and growing steady](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693),
    slight growth in [HTTP
    Archive](https://almanac.httparchive.org/en/2020/css#layout)

{% Aside %}
While a newer feature like
[subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid)
is important for developers, it isn't a part of this specific effort. To follow
along, see
[Subgrid compat on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Subgrid#browser_compatibility).
{% endAside %}

### CSS position: sticky

[Sticky positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning)
allows content to stick to the edge of the viewport and is commonly used
for headers that are always visible at the top of the viewport. While supported
in all browsers, there are common use cases where it doesn't work as intended.
For example,
[sticky table headers](https://bugs.chromium.org/p/chromium/issues/detail?id=702927)
aren't supported in Chromium, and although now
[supported behind a flag](https://bugs.chromium.org/p/chromium/issues/detail?id=958381),
the results are inconsistent across browsers:

<div class="w-columns">
    <figure class="w-figure">
        {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/DtNtuWCZUNwi7GGSBPvA.png", alt="", width="250", height="350" %}
        <figcaption class="w-figcaption">
            Chromium with "TablesNG"
        </figcaption>
    </figure>
    <figure class="w-figure">
        {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/hJwLpLeJNfG6kVBUK9Yn.png", alt="", width="250", height="350" %}
        <figcaption class="w-figcaption">
            Gecko
        </figcaption>
    </figure>
    <figure class="w-figure">
        {% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/od1YyD2BoBqfrnkzynUK.png", alt="", width="250", height="350" %}
        <figcaption class="w-figcaption">
            WebKit
        </figcaption>
    </figure>
</div>


Check out the <a href="https://output.jsbin.com/xunosud">sticky table headers
demo</a> by Rob Flack.

#### Why it is prioritized

+   Surveys: Highly known/used in [State of
    CSS](https://2020.stateofcss.com/en-US/features/) and was brought up
    multiple times in
    [MDN Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
+   Tests:
    [66% pass](https://wpt.fyi/results/css/css-position/sticky?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=%28status%3A%21missing%26status%3A%21pass%26status%3A%21ok%29)
    in all browsers
+   Usage:
    [8%](https://www.chromestatus.com/metrics/feature/timeline/popularity/3354)

### CSS aspect-ratio property

The new
[`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
CSS property makes it easy to maintain a consistent width-to-height ratio for
elements, removing the need for the well-known
[`padding-top` hack](/aspect-ratio/#the-old-hack:-maintaining-aspect-ratio-with-padding-top):

<div class="w-columns">
{% Compare 'worse', 'Using padding-top' %}
```css
.container {
  width: 100%;
  padding-top: 56.25%;
}
```
{% endCompare %}

{% Compare 'better', 'Using aspect-ratio' %}
```css
.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```
{% endCompare %}
</div>

Because it is such a common use case this is expected to become widely used, and
we want to make sure it's solid in all common scenarios and across browsers.

#### Why it is prioritized

+   Surveys: Already well known but not yet widely used in [State of
    CSS](https://2020.stateofcss.com/en-US/features/)
+   Tests: [27% pass](https://wpt.fyi/results/css/css-sizing/aspect-ratio)
    in all browsers
+   Usage:
    [3%](https://www.chromestatus.com/metrics/css/timeline/popularity/657) and
    expected to grow

### CSS transforms

[CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
have been supported in all browsers for many years and are widely used on the
web. However, there still remain many areas where they don't work the same
across browsers, notably with animations and 3D transforms. For example, a card
flip effect can be very inconsistent across browsers:

<figure class="w-figure">
{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/RhyPpk7dUooEobKZ3VOC.mp4",
  class="w-screenshot",
  controls=false,
  autoplay=true,
  loop=true,
  muted=true
%}
  <figcaption class="w-figcaption">
    Card flip effect in Chromium (left), Gecko (middle) and WebKit (right).
    Demo by David Baron from <a
    href="https://bugs.chromium.org/p/chromium/issues/detail?id=1008483#c42">bug
    comment</a>.
  </figcaption>
</figure>


#### Why it is prioritized

+   Surveys: Very well known and used in [State of
    CSS](https://2020.stateofcss.com/en-US/features/)
+   Tests: [55% pass](https://wpt.fyi/results/css/css-transforms) in all
    browsers
+   Usage:
    [80%](https://www.chromestatus.com/metrics/css/timeline/popularity/446)

## How you can contribute and follow along {: #contribute }

Follow and share any updates we post on
[@ChromiumDev](https://twitter.com/ChromiumDev) or the [public mailing list,
Compat 2021](https://groups.google.com/g/compat2021). Make sure bugs exist, or
[file them](/how-to-file-a-good-bug/) for issues you have been
experiencing, and if there's anything missing, reach out through the above
channels.

There will be regular updates about the progress here on web.dev and you can
also follow the progress for each focus area in the [Compat 2021
Dashboard](https://wpt.fyi/compat2021).

<a href="https://wpt.fyi/compat2021">
{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/9E5bMCRuPdQlGbFHZmuz.png", alt="Compat 2021 dashboard", width="800", height="778", class="w-screenshot" %}
</a>

We hope this concerted effort among browser vendors to improve reliability and
interoperability will help you go build amazing things on the web!
