---
layout: post
title: State of CSS 2021
subhead:
    "A look at some of the results from the State of CSS survey."
authors:
  - foolip
hero: "image/kheDArv5csY6rvQUJDbWRscckLr1/wq71mnWZKXuruohdemDU.png"
alt: "State of CSS."
date: 2021-12-17
tags:
  - blog
  - css
---

The [State of CSS 2021](https://2021.stateofcss.com/en-US/) survey ran for the third year in a row, and reached over 8,000 developers worldwide. Let's  look at some of the results and how they map to plans browsers have for adding CSS features in 2022.

# Feature usage and awareness

For some features, there's a clear trend in usage and awareness year-over-year. [CSS grid](https://2021.stateofcss.com/en-US/features/layout/#grid) is an example of this.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/9YXDRDmtMRF6bgWKIM7S.png", alt="Awareness of CSS Grid in State of CSS over time. The usage has grown from 55% to 83% between 2019 and 2021.", width="800", height="360" %}

This matches the trend for CSS Grid in the [2021 Web Almanac](https://almanac.httparchive.org/en/2021/css#flexbox-and-grid-adoption) and in Chrome's [usage metrics](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693). 
If you haven't used CSS Grid, now is a great time to [learn it](/learn/css/grid/).

As more developers use grid, [awareness of subgrid]([https://2021.stateofcss.com/en-US/features/layout/#subgrid](https://2021.stateofcss.com/en-US/features/layout/#subgrid)) is also growing. Subgrid is already available in Firefox and will land in Chrome as part of the work by the Microsoft Team on [GridNG](https://blogs.windows.com/msedgedev/2021/08/10/compat2021-css-grid-gridng/).

Other features with strong growth in usage and awareness are 
[`aspect-ratio`]([https://2021.stateofcss.com/en-US/features/layout/#aspect_ratio](https://2021.stateofcss.com/en-US/features/layout/#aspect_ratio)`), [scroll snap]([https://2021.stateofcss.com/en-US/features/interactions/#scroll_snap](https://2021.stateofcss.com/en-US/features/interactions/#scroll_snap)), and [custom properties]([https://2021.stateofcss.com/en-US/features/other-features/#variables](https://2021.stateofcss.com/en-US/features/other-features/#variables)).

# Browser compatibility

Browser compatibility is a common pain point for web developers and, to learn more about what CSS features cause the most issues, the survey asked, "Are there any CSS features you have difficulties using because of differences between browsers?"

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/rjslQmdTEZr8lNz0EbHC.png", alt="Survey results for features with differences between browsers. The top three responses are grid, flexbox gap, and subgrid.", width="800", height="909" %} 

Survey results like these help guide prioritization for browser vendors. Many of the features are part of the [Compat 2021 effort](/compat2021-holiday-update/) based on the [MDN Browser Compatibility Report 2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html), and others like subgrid are now being [proposed](https://github.com/web-platform-tests/interop-2022/issues/1) as focus areas for Interop 2022.

# What's missing in CSS?

The survey also asked, "Which feature would you most like to be able to use in CSS today?"

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/cZesmseagvBYouHVaRJO.png", alt="Survey results for the question what's missing in CSS. The top three responses are container queries, parent selector, and browser support.", width="800", height="617" %}

Container Queries was the overall "winner", matching the [2020 results](https://2020.stateofcss.com/en-US/opinions/#currently_missing_from_css). Container queries are part of the [new responsive](/new-responsive/). Chrome is currently working on an experimental implementation, and funding the work of Miriam Suzanne, as she develops the specification in the CSS Working Group. You can try it out by going to `about:flags`, searching for, and enabling, the **Container Queries** flag.

# Learn more

Please see the [full report](https://2021.stateofcss.com/en-US/) to learn more, see recommended resources, or dig into the data yourself.

Thanks to [Sacha Greif](https://sachagreif.com/) for running the survey, and to the over 8,000 web developers who generously took the time to answer it.