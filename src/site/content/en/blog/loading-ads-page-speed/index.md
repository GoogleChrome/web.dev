---
title: Effectively loading ads without impacting page speed
subhead: In today's digital world, online advertising is a critical part of the free web we all enjoy. However, poorly implemented ads can lead to a slower browsing experience, frustrating users and diminishing engagement. Learn how to effectively load ads without impacting your page speed, ensuring a seamless user experience, and maximizing revenue opportunities for website owners.
authors:
  - markusbordihn
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/27qouRjnUSxESxCIzQp4.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/A52ucuDoKR97sMmqxLQQ.jpg
date: 2023-09-28
alt: A photograph of a work area with paints and a rubber glove, with a cogwheel painted in red on a wooden surface.
description: |
  Learn how to effectively load ads without impacting your page speed, ensuring a seamless user experience, and maximizing revenue opportunities for website owners.
tags:
  - blog
  - performance
  - web-vitals
---

Websites heavily rely on online advertising as a primary source of revenue. However, the presence of ads on websites can sometimes come at the expense of user experience and overall page performance. It's therefore vital to strike a balance between monetization and performance for website owners and advertisers, and the user experience.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/4ZPEk7N9pWo3E7iuX1U1.gif", alt="An animated image that illustrates the balance that must be struck when it comes to the amount of ads on a page. As the slider goes from 'no ads' to '100% ads', factors such as visitors, ads, and revenue fluctaute, with revenue and visitors suffering the most when there are 100% ads.", width="660", height="330" %}
</figure>

Consider a website that extensively places ads within its content, aiming to generate high revenue. However, the overwhelming number of ads frustrates users, leading to a poor user experience and high bounce rates. Despite the potential for substantial revenue from ads, abandonment severely hampers the website's success.

On the other end of the spectrum, consider a website with no ads. This ad-free environment attracts a significant number of users due to its fast loading time and seamless browsing experience. However, without a monetization strategy in place, the website struggles to generate revenue, which may hinder its long-term sustainability and growth.

Both scenarios illustrate the importance of balancing monetization, users and performance.

## Harnessing Core Web Vitals

Passing [the Core Web Vitals thresholds](/defining-core-web-vitals-thresholds/) is essential when it comes to loading ads without negatively impacting page speed. Core Web Vitals, comprising metrics such as [Largest Contentful Paint (LCP)](/lcp/), [First Input Delay (FID)](/fid/) (as well as the upcoming [Interaction to Next Paint (INP) Core Web Vital metric](/inp/) slated to replace FID), and [Cumulative Layout Shift (CLS)](/cls/), are user experience metrics that measure the quality of the user experience of your website.

To ensure a positive user experience while serving ads, it is crucial to prioritize the Core Web Vitals so that ads don't become a performance liability that can negatively affect business outcomes.

While [Time to First Byte (TTFB)](/ttfb/) and [First Contentful Paint (FCP)](/fcp/) may not be classified as Core Web Vitals, they remain useful as diagnostic metrics for optimizing the loading experience to ensure both the webpage and accompanying ads load as swiftly as possible.

### Largest Contentful Paint (LCP)

<figure>
  <picture>
    <source media="(min-width: 640px)" height="200" srcset="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" width="800">
    <img alt="Good LCP values are 2.5 seconds or less, poor values are greater than 4.0 seconds, and anything in between needs improvement" decoding="async" height="480" loading="lazy" src="https://web-dev.imgix.net/image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg" width="640">
  </picture>
</figure>

Focusing on optimizing LCP is vital, as this metric measures the time it takes for the largest contentful element to become visible within the viewport. By minimizing the loading time of ad content and by prioritizing asynchronous loading techniques, website owners can reduce LCP and decrease rendering time of the most prominent contentful elements on a page.

### First Input Delay (FID) and Interaction to Next Paint (INP)

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/BVwToSd1oEJ5mzdI86tl.png", alt="The INP and FID thresholds, side by side.", width="768", height="273" %}
</figure>

Secondly, [improving INP](/how-to-optimize-inp/) (and by extension, [optimizing FID](/optimize-fid/)) is crucial for interactivity. FID measures the time it takes for the browser to respond to the first user interaction, such as a click or tap. The INP metric, slated to replace FID in March of 2024, goes much further by measuring a page's overall ability to process all click, keyboard, and tap interactions throughout the page lifecycle.

Ads that delay user interactions negatively impact INP and FID. This may frustrate users by creating experiences that feel sluggish, or even altogether broken in extreme cases. Implementing lazy loading for ads and deferring non-critical JavaScript execution can help reduce page INP and FID, and therefore improve overall page responsiveness.

### Cumulative Layout Shift (CLS)

<figure>
  <picture>
    <source media="(min-width: 640px)" height="200" srcset="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" width="800">
    <img alt="Good CLS values are 0.1 or less, poor values are greater than 0.25, and anything in between needs improvement" decoding="async" height="480" loading="lazy" src="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg" width="640">
  </picture>
</figure>

Lastly, CLS measures a page's visual stability by measuring the amount of unexpected layout shifts that occur during page load. Ads that dynamically load or resize can result in layout instability, leading to a poor user experiences where users either lose track of where they are on a page, or even unintentionally tap on the wrong elements due to unexpected layout shifts. To mitigate this, website owners should [optimize CLS](/optimize-cls/) to ensure that ads have reserved space to prevent layout shifts, and ad sizes should be optimized to avoid sudden content reflows.

## Structuring your webpage into distinct content blocks

Structuring your web page with content blocks for both text, image, and ad content, while also using [the CSS `content-visibility:` property](/content-visibility/), can significantly improve overall rendering time in modern browsers.

By strategically applying the `content-visibility:` property within these content blocks, you optimize the rendering process for text, image, and ad content. This ensures that only the content currently in the viewport is fully rendered, resulting in a faster initial page load and smoother user interactions. This performance enhancement is particularly valuable when dealing with lengthy or pages with many ads.

## Prioritize important ad slots

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/lilcJR3rR6hsQk1Ts66i.gif", alt="An animated image demonstrating the concept of both 'above-the-fold' and 'below-the-fold' ads. As the page scrolls down, 'above-the-fold' ads disappear, and 'below-the-fold' ads appear in the second, third, and fourth viewports.", width="660", height="500" %}
</figure>

Not all ad slots are equal. For example, above-the-fold ad slots are usually more valuable than those that are below the fold in terms of viewability and monetization. This is because above-the-fold ads are more likely to be seen by users, as they are visible without scrolling in the first viewport. Below-the-fold ads become visible after the user scrolls down the page far enough to see them.

### Above the fold ads

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/KaYluIMHNvotxWL9c2y0.png", alt="A visual representation of the 'above-the-fold' ad concept.", width="660", height="500" %}
</figure>

Above the fold ad slots refer to the portion of a webpage that is visible without scrolling, and hold significant value in digital advertising. These prime placements are considered valuable for several reasons:

- Advertisements placed above the fold are immediately visible for users upon loading a webpage. Users are more likely to notice and engage with these ads, resulting in higher click-through rates and better ad performance.
- Advertisers often consider the top portion of a webpage as the most valuable real estate. It's the first impression users get when they visit a site, making it a crucial area for showcasing high-impact and premium ads.
- Ads above the fold have the highest viewability rates because they are in the user's direct line of sight. This ensures that the majority of users who visit the page will see these ads without having to scroll down.

However, it's important to strike a balance between monetization and the user experience when utilizing above the fold ad slots in the initial view. Here are some key considerations.

- First screen ad slots should load as fast as possible in the user's initial viewport. Slow-loading ads can negatively impact user experience and increase bounce rates. Optimizing ad load times is crucial to maintain a smooth user and browsing experience.
- While above the fold ad placements are valuable, it's important to not overload this prime space with too many ads. Excessive ads clutter the page, disrupt content readability, and detract from the user experience. Strive for a balance between monetization and maintaining a clean, user-friendly layout.
- Ensure above the fold ad slots are compatible with different screen sizes and devices. [Responsive design practices](/learn/design/) can help maintain a consistent and visually appealing layout regardless of the user's screen size.

### Below the fold ads

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/6deTpSz4wdfubdlPV9rc.png", alt="A visual representation of the 'below-the-fold' ad concept.", width="660", height="500" %}
</figure>

Below the fold ad slots—that is, ads placed within the portion of a webpage that becomes visible only after scrolling down—also hold considerable value in the world of digital advertising. These placements offer unique advantages that complement above the fold placements.

Ads located below the fold benefit from users who scroll down to explore more content. These placements capture the attention of engaged users who are actively seeking additional information, making them valuable for brands looking to convey more complex messages or storytelling.

- Ad slots which are not initially visible can align with the content next to them, providing an opportunity for contextual relevance. This alignment can lead to higher user engagement as users discover ads that are related to the content they are exploring.
- When designed thoughtfully, below the fold ads can seamlessly integrate with the surrounding content, appearing less disruptive to users. This integration—also known as [native advertising](https://support.google.com/admanager/answer/6366845?hl=en)—can result in a more harmonious user experience.
- Scroll required ad placements offer more creative design and format flexibility, with ample space and freedom to experiment. Video ads, interactive elements, and larger images can be lazy loaded to capture user attention without disrupting their experience.

However, the following considerations should be given for below the fold ad placements:

- While below the fold ad placements can be effective, it's essential to ensure that users are encouraged to scroll down. Implementing visual cues or content teasers can entice users to explore further, increasing the likelihood of ad visibility.
- The placements of ads below the fold should not compromise content quality or readability. Maintaining a balance between ads and content to avoid overwhelming users and to ensure positive user experience.
- Unlike above the fold ad placements, below the fold ads may not need to load immediately. Delaying the loading of these ads until they are close to entering the user's viewport can help improve overall page load speed and reduce initial page rendering times.

When used strategically, below the fold ads can complement above the fold ads, and provide a platform for creative ad formats and contextual relevance. However, optimizing visibility, balancing content, and managing ad load timing are key considerations to ensure a positive user experience. 

Current Google Publisher Tag (GPT) best practices:

- [General best practices](https://developers.google.com/publisher-tag/guides/general-best-practices)
- [Ad Best Practices](https://developers.google.com/publisher-tag/guides/ad-best-practices)
- [Minimize layout shift](https://developers.google.com/publisher-tag/guides/minimize-layout-shift)
- [Monitor performance](https://developers.google.com/publisher-tag/guides/monitor-performance)
- [Avoiding common implementation mistakes](https://developers.google.com/publisher-tag/common_implementation_mistakes)

## Lazy load ads where appropriate

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/o3fxVz2ih5esYzX5TjyU.png", alt="A visualization of lazy loading versus not lazy loading resources. When resources are lazy loaded, bandwidth is conserved during page load, and resources are deferred to the point at which the user is likeliest to see them.", width="800", height="450" %}
</figure>

[Lazy loading](/lazy-loading-best-practices/) is a technique that defers loading non-critical resources until they are needed. Applying lazy loading for ads which are not immediately visible (that is, below-the-fold ads) ensures that they are only loaded when they come into view, conserving bandwidth and improving overall page speed.

By implementing lazy loading, ads are fetched dynamically when they are about to enter the user's viewport, reducing the initial load time and [Total Blocking Time (TBT)](/tbt/) (which is [highly correlated with INP](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt)) on the main thread at that crucial part of the page lifecycle, therefore minimizing negative impacts on the user experience.

## Refresh ads without refreshing the page

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/p4RuRhkucV695thelCNv.gif", alt="A visualization of ads refreshing on the page, without the top-level page being refreshed.", width="800", height="367" %}
</figure>

An additional technique that can balance page performance with loading ads is the ability to refresh ads every 30 to 120 seconds without reloading the entire page. This approach allows for dynamic updates of ad content without disrupting the user's browsing experience or causing unnecessary delays.

On mobile apps, refreshing ads in existing web views provides better performance compared to reloading the entire page or recreating WebViews because it minimizes the data and resource overhead, leading to faster content updates and a smoother user experience without the latency associated with starting from scratch.

By refreshing ads asynchronously, website owners can keep the page content intact while seamlessly updating the ad content in-place and in real time. This not only improves page speed by eliminating the need to reload the entire page, but also ensures that displayed ads remain relevant and engaging. With this technique, website owners can strike a balance between monetization and performance, delivering timely and engaging ad content while minimizing negative effects on the user experience. 

Refreshing ad slots is particularly valuable on pages where users tend to stay longer, such as recipe pages, DIY tutorials, or other content-rich websites. For example, on a DIY crafting page where users may spend a considerable amount of time following the tutorials, refreshing ad slots strategically during breaks between the steps, or while viewing image galleries, can enhance both the user experience and ad revenue. Similarly on a recipe page, refreshing ad slots after users have scrolled through the ingredients list or instructions can maintain user interest.

## Prioritize asynchronous loading

One of the most impactful strategies to improve page speed while serving ads is [asynchronous loading](https://developers.google.com/publisher-ads-audits/reference/audits/async-ad-tags). Asynchronous loading loads ads independently of the main web page content allows the page to continue rendering and become interactive without waiting for ads to fully load. 
This significantly reduces perceived loading time, enhancing user satisfaction.

Include the async attribute in the script tag definition. For example:

**AdSense:**

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

**AdSense (auto ads):**

```html
<script async data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

**Google Publisher Tag:**

```html
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
```

## Optimize ad sizes, position and formats

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/DFxKqN3avsKFmFaU1CXL.png", alt="An illustration of devices at varying viewport sizes, with ad placements stylized as green boxes, each reading 'Ad'.", width="800", height="222" %}
</figure>

The size, position, and format for ads can have a significant impact on page speed. Large ad sizes can slow down page load, leading to frustrated users. To mitigate this, website owners should work closely with advertisers to [optimize ad sizes and formats](/learn/images/). Encouraging the use of compressed image formats and efficient ad creative design helps reduce file sizes without compromising visual quality. These optimizations not only improve page speed, but also minimize data consumption for users with limited bandwidth.

## Better Ads Standards

It's essential to adhere to the [Better Ads Standard](https://www.betterads.org/standards/) for displaying ads, because doing so not only enhances the user experience by reducing intrusive and disruptive ad formats, but also positively impacts ad delivery position and page load time.

By following these standards, ads are more likely to be placed in positions that are less obstructive and intrusive, which can result in a higher user engagement and click-through rates.

Furthermore, adhering to these guidelines can also lead to faster page loading speeds since lighter, less resource-intensive ad formats are favored, improving overall website performance and user satisfaction.

## Strategic evaluation of ad networks and providers

Not all ad networks and providers are created equal in terms of performance. To ensure optimal page speed, website owners should meticulously evaluate the performance of different ad networks, header bidding implementation, and providers.

Forging partnerships with providers that prioritize speed—and have a track record of delivering lightweight ad content efficiently—can significantly increase page performance and improve the user experience.

## Conclusion

Achieving a balance between monetization and performance is crucial for website owners seeking to provide an exceptional user experience while maximizing revenue through online advertising.

By using techniques such as asynchronous loading, lazy loading, optimizing ad formats and sizes, leveraging intelligent caching and carefully evaluating ad networks, and header bidding and providers, website owners can successfully navigate the challenges of loading ads without compromising page performance. Prioritizing efficient delivery of ads ultimately ensures user stratification, increased engagement, and sustainable revenue generation.
