---
title: "Feedback wanted: The road to a better layout shift metric for long-lived pages"
subhead: Learn about our plans for improving the Cumulative Layout Shift metric and give us feedback.
description: |
  Learn about our plans for improving the Cumulative Layout Shift metric and give us feedback.
authors:
  - anniesullie
  - mmocny
date: 2021-01-25
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: An example windowing approach for measuring layout shift.
tags:
  - blog
  - performance
  - web-vitals
---

[Cumulative Layout Shift](/cls) (CLS) is a metric that measures the visual stability of a web page. The metric is called cumulative layout shift because the score of every individual shift is summed throughout the lifespan of the page.

While all layout shifts are poor user experiences, they do add up more on pages that are open longer. That's why the Chrome Speed Metrics Team set out to improve the CLS metric to be more neutral to the time spent on a page.

It's important that the metric focuses on user experience through the full page lifetime, as we've found that users often have negative experiences after load, while scrolling or navigating through pages. But we've heard concerns about how this impacts long-lived pages—pages which the user generally has open for a long time. There are several different types of pages which tend to stay open longer; some of the most common are social media apps with infinite scroll and single-page applications. 

An internal analysis of long-lived pages with high CLS scores found that most problems were caused by the following patterns:

- [Infinite scrollers shifting content](https://addyosmani.com/blog/infinite-scroll-without-layout-shifts/) as the user scrolls.
- Input handlers taking longer than 500 ms to update the UI in response to a user interaction, without any kind of placeholder or skeleton pattern.

While we encourage developers to improve those user experiences, we're also working towards improving the metric and looking for feedback on possible approaches.

## How would we decide if a new metric is better?
Before diving into metric design, we wanted to ensure that we evaluated our ideas on a wide variety of real-world web pages and use cases. To start, we designed a small user study.

First, we recorded videos and [Chrome traces](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) of 34 user journeys through various websites. In selecting the user journeys, we aimed for a few things:

- A variety of different types of sites, such as news and shopping sites.
- A variety of user journeys, such as initial page load, scrolling, single-page app navigations, and user interactions.
- A variety of both number and intensity of individual layout shifts on the sites.
- Few negative experiences on the sites apart from layout shifts.

We asked 41 of our colleagues to watch two videos at a time, rating which of the pair was better in terms of layout shift. From these ratings, we created an idealized ranking order of the sites. The results of the user ranking confirmed our suspicions that our colleagues, like most users, are really frustrated by layout shifts after load, especially during scrolling and single-page app navigations. We saw that some sites have much better user experiences during these activities than others.

Since we recorded Chrome traces along with the videos, we had all the details of the individual layout shifts in each user journey. We used those to compute metric values for each idea for each user journey. This allowed us to see how each metric variant ranked the user journeys, and how different each was from the ideal ranking.

## What metric ideas did we test?

### Windowing strategies

Often pages have multiple layout shifts bunched closely together, because elements can shift multiple times as new content comes in piece by piece. This prompted us to try out techniques for grouping shifts together. To accomplish that, we looked at three windowing approaches:

- Tumbling windows
- Sliding windows
- Session windows

In each of these examples, the page has layout shifts of varying severity over time. Each blue bar represents a single layout shift, and the length represents the [score](/cls/#layout-shift-score) of that shift. The images illustrate the ways different windowing strategies group the layout shifts over time.

#### Tumbling windows

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Example of a tumbling window.
  </figcaption>
</figure>

The simplest approach is just to break the page into windows of equal-sized chunks. These are called tumbling windows. You'll notice above that the fourth bar really looks like it should be grouped into the second tumbling window, but because the windows are all a fixed size it is in the first window instead. If there are slight differences in timing of loads or user interactions on the page, the same layout shifts might fall on different sides of the tumbling window boundaries.

#### Sliding windows

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Example of a sliding window.
  </figcaption>
</figure>

An approach that lets us see more possible groupings of the same length is to continuously update the potential window over time. The image above shows one sliding window at a time, but we could look at all possible sliding windows or a subset of them to create a metric.

#### Session windows

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Example of a session window.
  </figcaption>
</figure>

If we wanted to focus on identifying areas of the page with bursts of layout shifts, we could start each window at a shift, and keep growing it until we encountered a gap of a given size between layout shifts. This approach groups the layout shifts together, and ignores most of the non-shifting user experience. One potential problem is that if there are no gaps in the layout shifts, a metric based on session windows could grow unbounded just like the current CLS metric. So we tried this out with a maximum window size as well.

### Window sizes

The metric might give very different results depending on how big the windows actually are, so we tried multiple different window sizes:

- Each shift as its own window (no windows)
- 100 ms
- 300 ms
- 1 second
- 5 seconds

### Summarization

We tried out many ways to summarize the different windows.
#### Percentiles

We looked at the maximum window value, as well as the 95th percentile, 75th percentile, and median.

#### Average

We looked at the mean window value.

#### Budgets

We wondered if maybe there was some minimum layout shift score that users wouldn't notice, and we could just count layout shifts over that "budget" in the score. So for various potential "budget" values, we looked at the percentage of shifts over budget, and the total shift score over budget.

### Other strategies

We also looked at many strategies that didn't involve windows, like the total layout shift divided by time on page, and the average of the worst N individual shifts.

## The initial results

Overall, we tested **145 different metric definitions** based on permutations of the above ideas. For each metric, we ranked all the user journeys by their score on the metric, and then ranked the metrics by how close they were to the ideal ranking.

To get a baseline, we also ranked all the sites by their current CLS score. CLS placed 32nd, tied with 13 other strategies, so it was better than most permutations of the strategies above. To ensure the results were meaningful, we also added in three random orderings. As expected, the random orderings did worse than every strategy tested.

To understand if we might be overfitting for the data set, after our analysis we recorded some new layout shift videos and traces, manually ranked those, and saw that the metric rankings were very similar for the new data set and the original one. 

A few different strategies stood out in the rankings.

### Best strategies

When we ranked the strategies, we found that three types of strategies topped the list. Each had roughly the same performance, so we plan to move forward with a deeper analysis on all three. We'd also like to hear developer feedback to understand if there are factors outside of user experience we should be considering when deciding between them. (See below for how to give feedback.)

#### High percentiles of long windows

A few windowing strategies worked well with long window sizes:

- 1 second sliding windows
- Session windows capped at 5 seconds with 1 second gap
- Session windows uncapped with 1 second gap

These all ranked really well at both the 95th percentile and the maximum.

But for such large window sizes, we were concerned about using the 95th percentile—often we were looking at only 4-6 windows, and taking the 95th percentile of that is a lot of interpolation. It's unclear what the interpolation is doing in terms of the metric value. The maximum value is a lot clearer, so we decided to move forward with checking the maximum.

#### Average of session windows with long gaps

Averaging the scores of all uncapped session windows with 5 second gaps between them performed really well. This strategy has a few interesting characteristics:

- If the page doesn't have gaps between layout shifts, it ends up being one long session window with the exact same score as the current CLS.
- This metric didn't take idle time into account directly; it only looked at the shifts that happened on the page, and not at points in time when the page was not shifting.

#### High percentiles of short windows

The maximum 300 ms sliding window ranked very highly, as well as the 95th percentile. For the shorter window size, there is less percentile interpolation than larger window sizes, but we were also concerned about "repeat" sliding windows—if a set of layout shifts occurs over two frames, there are multiple 300 ms windows that include them. Taking the maximum is much clearer and simpler than taking the 95th percentile one. So again we decided to move forward with checking the maximum.

### Strategies that didn't work out

Strategies that tried to look at the "average" experience of time spent both without layout shifts and with layout shifts did very poorly. None of the median or 75th percentile summaries of any windowing strategy ranked the sites well. Neither did the sum of layout shifts over time.

We evaluated a number of different "budgets" for acceptable layout shifts:
- Percent of layout shifts above some budget. For various budgets, these all ranked quite poorly.
- Average layout shift above some excess. Most variations on this strategy did poorly, but average excess over a long session with a large gap did almost as well as the average of session windows with long gaps. We decided to move forward with only the latter because it is simpler.

## Next steps

### Larger-scale analysis

We've implemented the top strategies listed above in Chrome, so that we can get data on real-world usage for a much larger set of websites. We plan to use a similar approach of ranking sites based on their metric scores to do the larger-scale analysis:

- Rank all the sites by CLS, and by each new metric candidate.
  - Which sites are ranked most differently by CLS and each candidate? Do we find anything unexpected when we look at these sites?
  - What are the largest differences between the new metric candidates? Do any of the differences stand out as advantages or disadvantages of a specific candidate?
- Repeat the above analysis, but bucketing by time spent on each page load. Do we see an expected improvement for long-lived page loads with acceptable layout shift? Do we see any unexpected results for short-lived pages?

### Feedback on our approach

We'd love to get feedback from web developers on these approaches. Some things to keep in mind while considering the new approaches:

#### What's not changing

We do want to clarify that a lot of things will not be changing with a new approach:

- None of our metric ideas change the way layout shift scores for [individual frames are calculated](/cls/#layout-shift-score), only the way we summarize multiple frames. This means that the [JavaScript API](/cls/#measure-cls-in-javascript) for layout shifts will stay the same, and the underlying events in Chrome traces that developer tools use will also stay the same, so layout shift rects in tools like WebPageTest and Chrome DevTools will continue to work the same way.
- We'll continue to work hard on making the metrics easy for developers to adopt, including them in the [web-vitals library](https://github.com/GoogleChrome/web-vitals), documenting on [web.dev](/metrics), and reporting them in our developer tooling like Lighthouse.

#### Trade-offs between metrics
One of the top strategies summarizes the layout shift windows as an average, and the rest report the maximum window. For pages which are open a very long time, the average will likely report a more representative value, but in general it will likely be easier for developers to act on a single window—they can log when it occurred, the elements that shifted, and so on. We'd love feedback on which is more important to developers.

Do you find sliding or session windows easier to understand? Are the differences important to you?

#### How to give feedback

You can try out the new layout shift metrics on any site using our [example JavaScript implementations](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver) or our [fork of the Core Web Vitals extension](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

Please email feedback to our **[web-vitals-feedback](https://groups.google.com/g/web-vitals-feedback)** Google group, with "[Layout Shift Metrics]" in the subject line. We're really looking forward to hearing what you think!
