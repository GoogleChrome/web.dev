---
layout: post
title: Why does speed matter?
authors:
  - bojanpavic
  - ansteychris
  - jeremywagner
description: |
  When it comes to user experience, speed matters. And delays caused by mobile
  speed aren't just frustrating, they can also have a negative impact on
  business results.
web_lighthouse: N/A
date: 2019-05-01
updated: 2020-07-23
tags:
  - performance
---

Consumers increasingly rely on mobile to access digital content and services,
and if you look at your site analytics,
you'll probably see this story playing out in your own data.
Consumers are also more demanding than they've ever been,
and when they weigh the experience on your site, they aren't just comparing you with your competitors,
they're rating you against the best-in-class services they use every day.

This post rounds up some of the research that has been done on the relationship between performance and business success.

## Performance is about retaining users

<figure class="w-figure w-figure--inline-right">
  <blockquote>
    <p>
  	Performance has directly impacted the company's bottom line.
    </p>
    <cite>
      <a href="https://www.youtube.com/watch?v=Xryhxi45Q5M&feature=youtu.be&t=1366">Pinterest</a>
    </cite>
  </blockquote>
</figure>

Performance plays a major role in the success of any online venture.
High-performing sites engage and retain users better than low-performing ones.

Pinterest reduced perceived wait times by 40%
and this [increased search engine traffic and sign-ups by 15%](https://medium.com/@Pinterest_Engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7).

COOK reduced average page load time by 850 milliseconds which
[increased conversions by 7%, decreased bounce rates by 7%, and increased pages per session by 10%](https://www.nccgroup.trust/globalassets/resources/uk/case-studies/web-performance/cook-case-study.pdf).

Studies have also shown the negative impact poor performance can have on business goals.
For example, [the BBC](https://www.creativebloq.com/features/how-the-bbc-builds-websites-that-scale)
found they lost an additional 10% of users for every additional second their site took to load.

## Performance is about improving conversions

Retaining users is crucial to improving conversions.
Slow sites have a negative impact on revenue, and fast sites are shown to increase conversion rates.

For [Mobify](http://resources.mobify.com/2016-Q2-mobile-insights-benchmark-report.html),
every 100ms decrease in homepage load speed worked out to a 1.11% increase in session-based conversion,
yielding an average annual revenue increase of nearly $380,000.
Additionally, a 100ms decrease in checkout page load speed amounted to a 1.55% increase in session-based conversion,
which in turn yielded an average annual revenue increase of nearly $530,000.

When [AutoAnything reduced page load time by half](https://www.digitalcommerce360.com/2010/08/19/web-accelerator-revs-conversion-and-sales-autoanything/),
they saw a boost of 12% to 13% in sales.

Retailer [Furniture Village](https://www.thinkwithgoogle.com/intl/en-gb/success-stories/uk-success-stories/furniture-village-and-greenlight-slash-page-load-times-boosting-user-experience/) audited their site speed and developed a plan to address the problems they found,
leading to a 20% reduction in page load time and a 10% increase in conversion rate.

## Performance is about user experience

When it comes to user experience, speed matters.
A [consumer study](https://www.ericsson.com/en/press-releases/2016/2/streaming-delays-mentally-taxing-for-smartphone-users-ericsson-mobility-report)
shows that the stress response to delays in mobile speed are similar to that of watching a horror movie or solving a mathematical problem,
and greater than waiting in a checkout line at a retail store.

As a site begins to load, there's a period of time where users wait for content to appear.
Until this happens, there's no user experience to speak of.
This lack of an experience is fleeting on fast connections.
On slower connections, however, users are forced to wait.
Users may experience more problems as page resources slowly trickle in.

<figure class="w-figure">
  {% Img src="image/admin/W0ctiX3cMOfWnNF6AQMg.png", alt="A comparison of two filmstrip reels of a page loading. The first shows a page loading on a slow connection, while the second shows the same page loading on a fast connection.", width="800", height="264" %}
  <figcaption>A comparison of page load on a very slow connection
(top) versus a faster connection (bottom).</figcaption>
</figure>

Performance is a foundational aspect of good user experiences.
When sites ship a lot of code, browsers must use megabytes of the user's data plan in order to download the code.
Mobile devices have limited CPU power and memory.
They often get overwhelmed with what we might consider a small amount of unoptimized code.
This creates poor performance which leads to unresponsiveness.
Knowing what we know about human behavior, users will only tolerate low performing applications for so long before abandoning them.

## Performance is about people

Poorly performing sites and applications can also pose real costs for the
people who use them.

[As mobile users continue to make up a larger portion of internet users
worldwide](http://gs.statcounter.com/platform-market-share/desktop-mobile-tablet),
it's important to bear in mind that many of these users access the web through
mobile LTE, 4G, 3G, and even 2G networks.
As Ben Schwarz of Calibre points out in
[this study of real world performance](https://calibreapp.com/blog/beyond-the-bubble),
the cost of prepaid data plans is decreasing,
which in turn is making access to the internet more affordable in places where it once wasn't.
Mobile devices and internet access are no longer luxuries.
They are common tools necessary to navigate and function in an increasingly interconnected world.

[Total page size has been steadily increasing since at least 2011](http://beta.httparchive.org/reports/state-of-the-web#bytesTotal),
and the trend appears to be continuing.
As the typical page sends more data,
users must replenish their metered data plans more often, which costs them money.

In addition to saving your users money,
fast and lightweight user experiences can also prove crucial for users in crisis.
Public resources such as hospitals, clinics,
and crisis centers have online resources that give users important and specific information that they need during a crisis.
[While design is pivotal in presenting important information efficiently in stressful moments](https://aneventapart.com/news/post/eric-meyer-designing-for-crisis),
the importance of delivering this information fast can't be understated.
It's part of our job.

## Get started with improving your website speed {: #get-started }

Read up on the [Core Web Vitals](/vitals/#core-web-vitals) to learn about the metrics
that Google believes all websites should focus on.

<blockquote>
  <p>
	  Today, we’re building on this work and providing an early
	  look at an upcoming Search ranking change that incorporates
	  these page experience metrics. We will introduce a new signal
	  that combines Core Web Vitals with our existing signals for page
	  experience to provide a holistic picture of the quality of a user’s
	  experience on a web page.
  </p>
  <cite>
    <a href="https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html">
      Evaluating page experience for a better web
    </a>, Official Google Webmaster Central Blog
  </cite>
</blockquote>

Then check out [Fast load times](/fast/) for lots of tips and tricks
related to getting fast and staying fast.
