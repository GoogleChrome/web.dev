---
layout: post
title: Optimizing Core Web Vitals for business decision makers
subhead: |
  Learn how business decision makers and non-developers can improve Core Web Vitals.
description: |
  Learn how business decision makers and non-developers can improve Core Web Vitals.
authors:
  - tunetheweb
date: 2023-10-10
#updated: 2023-10-10
hero: image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/we2OZeBtgjVjCqmk1ZRD.jpg
alt: Laptop showing business analytics
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
  - chrome-ux-report
---

## Introduction

Website user experience has been shown to have [a direct impact on business performance](/vitals-business-impact/). Delivering a better experience, where websites load and respond to users faster often results in increased engagement and conversions. [Core Web Vitals](/vitals/) is an initiative to quantify the experience of websites to identify areas for improvements.

However, a lot of Core Web Vitals documentation is aimed at web developers, with deep technical understanding and full control over their code. Web developers are not the only ones responsible for web performance. Many websites are created by non-developers using a “site-builder” platform such as WordPress, Shopify, Wix, or a number of other similar products.

Business decision makers have a huge influence over website performance, from deciding content and designs, to deciding on advertisement strategies on the web page and for securing traffic to the site. These decisions can make achieving a performant website easier or harder.

This guide aims to provide some relevant information for business owners on how they can understand—and improve—their user experience as much as possible, without having to be deeply technical web developers.

At the same time many performance issues require developers to implement technical fixes and our [developer focused guides](/fast/#core-web-vitals) can help with these. So this is not intended to be a comprehensive guide, but more an introduction to the Core Web Vitals initiative for business decision makes, some of the common non-development causes of issues, and when a web developer will need to be engaged to make further progress.

## What are the Core Web Vitals?

The Core Web Vitals are a set of three metrics, or measurements, of a page experience—and in particular how fast the page feels. Each of them has a three letter acronym:

- [Largest Contentful Paint (LCP)](/lcp/) measures _loading_ performance: how quickly it takes for the page to display.
- [Cumulative Layout Shift (CLS)](/cls/) measures _visual stability_ of a page: how much the content moves around.
- [First Input Delay (FID)](/fid/), which [is being replaced in March 2024](/inp-cwv/) with [Interaction to Next Paint (INP)](/inp/) measures _responsiveness_ of the page: how quickly the page responds to button clicks and other interactions.

Each metric measures a different facet of user experience. Google also provides recommended thresholds for each metric, below which the user experience is considered _good_, and above which it is considered _poor_. Between these, a page is considered to be in the _needs improvement_ range.

## How Core Web Vitals are measured

Core Web Vitals are measured by real users of your website and different users will have different Core Web Vitals results. Some users will be on faster devices, and faster networks. Some will be on slower devices or slower networks. Some users will visit simpler, faster pages on your site, others more complex, slower pages. The results of all these user experiences are then aggregated to give an overall measure of your site.

Google makes the data from Chrome users available in the [Chrome User Experience Report (CrUX)](https://developer.chrome.com/docs/crux/), which feeds into many Google tools such as [PageSpeed Insights](https://pagespeed.web.dev/) and [Google Search Console](https://support.google.com/webmasters/answer/9205520?hl=en). It aggregates Core Web Vitals over 28 days and gives the values that 75% of your users experience for each of the metrics. Aggregating over that 28-day time period, and looking at the value that most of your users experience gives a high-level summary of how your site is performing from a user perspective. CrUX is available on millions of popular websites, but all websites are in CrUX and even when a site is available in CrUX, not all pages on a site will have separate entries in CrUX so you may only be able to view the summary Core Web Vitals at a site, or origin, level.

Other Real User Monitoring (RUM) tools can also collect these metrics for your site. This allows you to see the values from more browsers than just Chrome, and also allows you to drill into this data more for more detailed analysis than a public dataset like CrUX makes possible. Many site site platforms provide RUM data as part of their service which can be invaluable to help understand your Core Web Vitals better. Check if your platform does this.

Finally, some tools can quickly scan your site and run a number of tests and give estimated values for some of the Core Web Vitals metrics. These are known as lab-based tools and [Lighthouse](https://developer.chrome.com/docs/lighthouse/) is one such well-known tool. As these tools only do a quick scan of your site under pre-defined simulated conditions, rather than measure actual user experiences, they are known as lab-based tools. They are very useful to identify potential problems and suggest recommendations to improve performance, but they may not mirror how your users experience your website depending on their environments, whether they are new to your site and loading it afresh or have parts of your website cached in their browser, and also how they interact with the website.

## Finding out your sites Core Web Vitals

There are many tools that show Core Web Vital metrics provided by Google and by 3rd parties. We will introduce two here to allow you to quickly view the Core Web Vitals for most popular sites. For a deeper look at the other Google tools including a workflow for using them to address Core Web Vitals, see the [Core Web Vitals workflows with Google tools](/vitals-tools/) post.

If your platform provides an integrated RUM solution it can provide much more detailed information on pages on your site or allow you to drill down into particular pages or segment your users to help understand and identify issues.

### PageSpeed Insights

For a quick view which requires no set up you can use [PageSpeed Insights (PSI)](https://pagespeed.web.dev/). Type in the URL and click analyze. If your site is included in CrUX you should quickly be presented with a “Discover what your real users are experiencing” section:

<figure>
  {% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/YEe3RQwgIWgQTHFV5sc0.png", alt="A screenshot of how PageSpeed Insights portrays CrUX data for a URL's Core Web Vitals. Each of the Core Web Vitals is displayed separately, while grouping each Core Web Vital in the 'Good', 'Needs Improvement', and 'Poor' thresholds for the last 28 days.", width="800", height="477" %}
  <figcaption>
    PageSpeed Insights shows the Core Web Vitals real users experienced.
  </figcaption>
</figure>

This shows how real Chrome users have experienced your website over the last 28 days. You see the 3 Core Web Vitals on the top, along with some other metrics beneath (including the Pending INP metric). Only the Core Web Vitals count in the overall Passed/Failed assessment at the top of the page, but the other metrics can be useful in other ways as shown in the next section.

By default PSI will show data for the URL entered and for mobile, if it exists. You can toggle between Mobile and Desktop views using the buttons at the top of this section. You can also toggle between this URL and all data for that Origin using the toggle in the top right.

This should give a broad indicator of how your site is performing and which metrics, if any, could be improved and on which device types.

### Google Search Console

Google Search Console (GSC) is for site owners only, so requires registration. It provides details on how Google Search views your site.

Unlike PageSpeed Insights, GSC lists all the pages the Google Search is aware of on your site and provides Core Web Vitals details on all pages:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/DWdv878oyTdEWQViRh06.png", alt="A screenshot of a Core Web Vitals report in Search Console. The report is broken down into Desktop and Mobile categories, with line graphs detailing the distribution of pages with Core Web Vitals in the 'Good', 'Needs Improvement', and 'Poor' categories over time.", width="800", height="639" %}
  <figcaption>
    Google Search Console Core Web Vitals report.
  </figcaption>
</figure>

Pages are grouped into [URL Groups](https://support.google.com/webmasters/answer/9205520#page_groups) to allow you to easily see if certain categories of pages (Product Detail Pages, Blog pages, and so on) have Core Web Vitals issues. As these are usually built on similar technologies or templates, there may be a common cause to any issues in these pages.

## Largest Contentful Paint

LCP aims to measure _loading speed_ of web pages by measuring the time from when a link is clicked, until the largest piece of content (typically a banner image, a H1 headline) is shown to the user.

<figure>
  {% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/nOU9Z9DHRz7oE3P2QUgm.png", alt="A screenshot of this site's home page with the LCP image highlighted", width="300", height="575" %}
  <figcaption>
    The LCP element is the largest element when the page is loaded
  </figcaption>
</figure>

For a _good_ page experience, a web page should aim to show this content within 2.5 seconds of the link being clicked. If this takes over 4 seconds this is considered a _poor_ experience.

Some of the common issues affecting LCP that business decisions makers can influence include:

### A/B tests

Many businesses perform A/B tests to experiment with changes to their website. How these are implemented can have a major impact on LCP.

Many A/B testing solutions hold back the displaying of our website until the changes in any tests have been applied. This avoids showing the original version of the website, but at the cost of delaying the website to the user. Other solutions are applied server-side to avoid this delay.

A/B testing can provide invaluable feedback before launching new changes, but the cost to page performance must be weighed up against any potential benefits they bring.

The following guidelines can help reduce the performance impact of any A/B testing:

- Understand how your A/B testing is performed and if it is subject to these delays.
- Consider server-side A/B testing solutions instead.
- Limit A/B testing tools to only those pages that are part of the test rather than delaying all pages, when most pages may not be running an A/B test at any particular time.
- Limit A/B testing to a subset of users to avoid impacting the majority of users.
- Limit A/B tests to the minimum amount of time necessary to provide conclusive results. The longer A/D tests are running, the longer users may be seeing delays in page performance.

### Time to First Byte issues

[Time to First Byte (TTFB)](/ttfb/) is the time it takes for the first part of your web page to download. If [PageSpeed Insights](#pagespeed-insights) is showing a large TTFB diagnostic metric, then this will have a direct impact on LCP as the largest content cannot begin to download until you have the web page itself. It is impossible to have an LCP under the 2.5 seconds good threshold if you have a TTFB that takes up a large chunk of that time.

For TTFB issues, it is important to understand your audience. If your website is hosted in one country, but serves a global audience, then the further away users will likely experience slower first byte times. A [Content Delivery Network (CDN)](/content-delivery-networks/) allows copies of your site to be cached around the world—closer to your users. Many hosted platforms include a CDN in their package and will take care of this automatically. Check if this is the case for where your site is hosted. Some platforms offer different tiers of service with more CDN locations for higher paid tiers.

Redirects are another common cause for slow TTFBs. LCP is measured from when your users click on a link until the largest content is displayed. When running ad campaigns or sending out email communications try to minimize the number of redirects by avoiding using multiple link shorteners, or including URLs that need to be redirected (for example, using [example.com/blog](example.com/blog) in a campaign which needs to redirect to [www.example.com/blog](www.example.com/blog) which then redirects to [https://www.example.com/blog](https://www.example.com/bog)). Ensure your marketing campaigns use the final URL where possible.

Also ensure your ad campaigns are effectively targeting your audience. Getting lots of new traffic from users who are halfway around the world, but whom you cannot deliver your product to, is both wasted ad spend and negatively impacts your measured website performance.

URL parameters such as [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters) are often used for marketing campaigns. These can reduce caching reuse on your infrastructure as each URL can look like a unique page—even though the same page is served each time. If you make use of these, then speak to your CDN or infrastructure teams to ensure that these URL parameters are ignored by caching infrastructure to allow campaigns to benefit from already cached pages.

### Media can be costly for performance

The LCP element is the largest piece of content on a page, typically a headline or a banner image. Text is much quicker to display while media like an image or video takes additional time to download, particularly if you have lots of media on your page.

Consider how much media you need on your pages. At the same time these can contribute to a rich visual experience for the user as text only web pages are often not as engaging.

[Carousels](/carousel-best-practices/) made of several images can affect the overall load time of a page as they can require several images to be downloaded at the same time if not implemented optimally. Additionally, despite their ubiquity, they often are [not great user experiences](https://www.nngroup.com/articles/designing-effective-carousels/).

Then there is the size of media assets. Many images on the web are served at too high a resolution. Ensure any media partners supply _web-optimized images_ rather than the full sized _print-quality images_ that they often provide. You can use a service like [TinyJPG](https://tinyjpg.com/) to quickly remove unnecessary data from images before uploading them. Many web platforms will attempt to automatically optimize images on upload but since they do not know what size images will be displayed at, providing smaller images to start can yield significant gains.

Give extra consideration when using videos. Videos are some of the most expensive content for a website to display so try not to overuse them. Avoid using them at the top of web pages and save them for further down the page. This can then allow less expensive content to load quickly to give a better loading experience to users and ensure your LCP is not impacted.

## Cumulative Layout Shift

CLS measures the _visual stability_ of a page—how much the page’s content shifts around as content is loaded. This can be distracting if a user has started reading a web page and then loses their place as more content, or ads, slot into place. It can also result in users clicking on the wrong content if buttons move above. Be very careful with dynamic content that loads later and can move some of the initial content.

<figure>
  <video autoplay controls loop muted
    poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png"
    width="658" height="510">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm"
      type="video/webm; codecs=vp8">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4"
      type="video/mp4; codecs=h264">
  </video>
  <figcaption>
    A screencast illustrating how CLS can negatively affect users.
  </figcaption>
</figure>

This is [measured with a mathematical formula](/cls/#layout-shift-score) that measures how much content is shifted, and how much it is shifted by. It is expressed as a unitless fraction with a value of 0.1 or less being seen as _good_ and a value of above 0.25 as _poor_.

Some of the common issues affecting CLS that business decisions makers can influence include:

### Check how your images load as your scroll down a page

Many templates avoid loading images further down the page to give more resources to images which are onscreen. The images are then loaded as the user scrolls down. This is known as lazy loading images.

Page templates should reserve space for these lazy-loaded images so if a user scrolls very fast before the image gets a chance to load, the content around it does not shift around. If your template or platform does not do this, then consider switching to one that does.

### Be careful with ads placed in the middle of content

Ads inserted in the middle of content run the risk of pushing your content down as ads often take a bit longer to load—longer than images described in the previous section. Having these on the side of content is a common pattern which reduces this risk

How this is achieved depends on your particular platform and what templates you use to build your site.

### Avoid adding dynamic content to the top of pages

Avoid alerts and banners (for example, cookie banners or special offers) added to the top of the page after page load. Choosing instead to overlay the main content will prevent this shifting the current content.

Similar to the previous section, your options here will depend on the platform and templates used for your pages.

## First Input Delay / Interaction to Next Paint

FID and INP measure the _responsiveness_ of a page. Do pages consistently respond to interactions (clicks, taps, and keyboard input) quickly, or is it a glitchy slow experience.

<style>
  #responsiveness-video {
    height: auto;
    aspect-ratio: 1445 / 370;
  }
</style>
<figure>
  {% Video src="video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/WSmcjiQC4lyLxGoES4dd.mp4", autoplay="true", loop="true", muted="true", playsinline="true", width="1445", height="370", id="responsiveness-video" %}
  <figcaption>
    An example of poor versus good responsiveness. At left, long tasks block the accordion from opening. This causes the user to click multiple times, thinking the experience is broken. When the main thread catches up, it processes the delayed inputs, resulting in the accordion opening and closing unexpectedly.
  </figcaption>
</figure>

FID measures the first interaction, while INP measures all interactions and reports the worst interaction (ignoring some outliers). INP also measures more of the interaction rather than just the delay until it is processed like FID does. INP has a _good_ threshold of 200 milliseconds and a _poor_ threshold of 500 milliseconds. INP is an enhancement to FID and better measures responsiveness hence why it is replacing FID.

Responsiveness metrics, and in particular INP, are tricky metrics to optimize. Usually these are caused by the web page simply trying to do too much so the main solutions here involve removing unnecessary code to make lighter pages.

Some of the common issues affecting FID and INP that business decisions makers can influence include:

### Have a spring clean!

Review plugins and widgets added to the site but no longer used and remove them if you can. It’s often easy to add plugins to try something out, but if you don’t end up using them make sure you remove them again or you’re unnecessarily slowing down your page.

Similarly, if using a Tag Manager for marketing campaigns then make sure old campaigns are removed. Even if they don’t fire anymore, they still need to be downloaded on each page, compiled and then ignored.

### Avoid expensive widgets and plugins

They may look nice, but is the user experience improved with them, or actually made worse? The Diagnose Performance Issues/Lighthouse report in PageSpeed Insights can help identify JavaScript that is having a noticeable impact on your website’s performance.

Ideally limit widgets to the page it is needed on—if only using Google Map embed on contact us page, then no need to load it on every page.

### Consider number of ads—especially on mobile

Ads may be where some businesses make their money, but they are complex and resource intensive to serve. The more ads you have, the more complex and resource intensive they are. This is especially true on mobile.

<figure>
  {% Video src="video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/wV8j1X6xN0L6rYVmtOaY.mp4", width="660", height="330", autoplay="true", loop="true", playsinline="true", controls="false" %}
  <figcaption>
    The balance between monetization and performance.
  </figcaption>
</figure>

Weigh up [the balance between monetization and performance](/loading-ads-page-speed/). If users are dropping off earlier due to a poor experience, then those extra ads may be costing your more revenue than they are adding.

### Avoid excessive page size

Large, complex pages take more effort to display. If you have a product gallery with 1000 different products then it is going to take a while to display. Consider when to paginate pages to reduce this time.

## Getting more help

In this post, we have shown some of the general considerations business owners can take which may affect performance. Beyond this you may need to avail of web performance expertise.

### Platform specific information

Most platforms care deeply about their web performance and may have dedicated, platform-specific advice on how to improve this. You may also have access to dedicated web performance teams as part of using that platform who can advise further on how to improve your site.

Platforms continually improve and many are concentrating on performance and Core Web Vitals right now. Make sure your platform is kept up to date to benefit from the latest improvements the platform developers have made.

This is easiest when you are on a hosted platform where the platform provider automatically manages the platform including releasing any fixes. If you are hosting the platform yourself (for example, a local install WordPress on your own servers) then ensuring this is kept up to date, will allow your site to benefit from any improvements the platform developers have made. Businesses should prioritize this upkeep or choose a service that manages this for them.

### Engaging a web developer

A web developer with expertise in web performance will likely be able to address many more issues than a business owner. You may have already engaged a web developer to build your site initially or for periodic changes, or you may have a dedicated development team, or you may have to look to engage a developer (ideally with web performance expertise).

Turn to developers if the above suggestions are not providing enough to address the performance issue, but hopefully above examples also show that it is important to work with the developers to balance business priorities with development decisions to reach the right solution for your website.

Be aware that web performance is rarely a one-off piece of work, and often requires regular monitoring and maintenance to ensure your website does not regress after improving it’s performance.

## Conclusion

A website is often the first entry point for a business with its customers and you want it to be a great experience for visitors. This applies both to first time visitors getting their first impression of your business, but also repeat visitors and loyal customers, who should be given as seamless an experience as possible, free of frustrations that may leave a negative impression. The Core Web Vitals are one measure of user experience that Google recommends sites consider. On the web, it is all too easy to try another website if a user gets frustrated with a website.

At the same time, the Core Web Vitals are just one measure of your website. Businesses need to decide themselves about how much to invest in their websites, and what return on investment will be achieved for that investment.

## Acknowledgements

_Hero image by [Steven Lelham](https://unsplash.com/@kmuza) on [Unsplash](https://unsplash.com/photos/hpjSkU2UYSU)_
