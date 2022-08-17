---
layout: post
title: How To Think About Speed Tools
subhead: |
  How To Think About Speed Tools
date: 2018-02-26
updated: 2022-07-18
description: |
  How To Think About Speed Tools
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Google has put out a lot of guidance around performance data and performance
tooling. The goal of this infographic is to consolidate this guidance for
developers and marketers to help them understand how to think about performance
and navigate all of Google's performance tool offerings.

<a class="button"
href="pdf/Infographic-How_To_Think_About_Speed_Tools.pdf"
data-label="primary">Download the PDF version</a>

## Common myths about performance

### Myth 1

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mHHktm1aDCiI0EBpy6WZ.svg", alt="A piece of paper with a line graph
on it.", width="398", height="275", class="float-left" %}
</figure>

**User experience can be captured with a single metric.**

Good user experience is not captured by a single point in time. It's composed of
a series of key milestones in your users' journey. Understand the different
metrics and track the ones that are important to your users' experience.

### Myth 2

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ZxO3D3RAZmRPmkzL6Qjy.svg", alt="A collection of network iconography representing different devices and network
conditions.", width="398", height="275", class="float-left" %}
</figure>

**User experience can be captured with a single “representative user.”**<br>
Real-world performance is highly variable due to differences in users’ devices,
network connections, and other factors. Calibrate your lab and development
environment to test a variety of such different conditions. Use field data to
inform selection of test parameters for device type (i.e., mobile vs. desktop),
network connections (i.e., 3G or 4G), and other key variables.

### Myth 3

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TxRMhKCEuOsnWb1gPi0L.svg", alt="An assortment of depictions of different
kinds of users.", width="398", height="275", class="float-left" %}
</figure>

**My website loads fast for me, so it should load fast for my users.**<br>
The devices and networks that developers test load performance on are often much
faster than what your users actually experience. Use field data to understand
what devices and networks your users are on and appropriately mirror those
conditions when you test performance.

## Understanding lab vs. field data

### Lab data

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mf2384q0tWgo4bVHa5r0.svg", alt="A depiction of a man standing in front of
a bunch of abstract technical concepts
and icons", width="398", height="275", class="float-rigt" %}
</figure>

Lab data is performance data collected within a controlled environment with
predefined device and network settings. This offers reproducible results and
debugging capabilities to help identify, isolate, and fix performance issues.

{% Compare 'better' %}

#### Strengths

- Helpful for debugging performance issues
- End-to-end and deep visibility into the UX
- Reproducible testing and debugging environment
{% endCompare %}

{% Compare 'worse' %}

#### Limitations

- Might not capture real-world bottlenecks
- Cannot correlate against real-world page KPIs
{% endCompare %}

{% Aside %}
Tools like [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) and
[WebPageTest](https://www.webpagetest.org/) collect this type of data.
{% endAside %}

### Field data

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oDNASv0rma8j3lvw6IxT.svg", alt="A depiction of people in a public setting using mobile
devices.", width="800", height="689", class="float-right" %}
</figure>

(Also called Real User Monitoring or RUM)

Field data is performance data collected from real page loads your users are
experiencing in the wild.

{% Compare 'better' %}

#### Strengths

- Captures true real-world user experience
- Enables correlation to business key performance indicators
{% endCompare %}

{% Compare 'worse' %}

#### Limitations {: .compare-worse }

- Restricted set of metrics
- Limited debugging capabilities
{% endCompare %}

{% Aside %}
Public data sets like [Chrome User Experience
Report](https://developer.chrome.com/docs/crux/) and performance tools like
[PageSpeed Insights](https://pagespeed.web.dev/) speed score report this type of
data.
{% endAside %}

## What are the different performance tools?

<div class="table-wrapper scrollbar">
<table>
    <tbody>
        <tr>
            <td>
                <a href="https://developer.chrome.com/docs/lighthouse/overview/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/1A9MXRXmgqfxmCFGHN80.svg", alt="Lighthouse", width="150", height="150" %}</a>
                <h3><a href="https://developer.chrome.com/docs/lighthouse/overview/">Lighthouse</a></h3>
                <p>Gives you personalized advice on how to improve your website across performance,
            accessibility, PWA, SEO, and other best practices.</p>
            </td>
            <td>
                <a href="https://www.webpagetest.org/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/BxEozEv17LAroJo9e9CG.svg", alt="WebPageTest", width="150", height="150" %}</a>
                    <h3><a href="https://www.webpagetest.org/">WebPageTest</a></h3>
                    <p>Allows you to compare performance of one or more pages in controlled lab
                environment, and deep dive into performance stats and test performance on a real
                device. You can also run Lighthouse on WebPageTest.</p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://testmysite.thinkwithgoogle.com/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/iEejvAzwfBoAaZwVlT4H.svg", alt="TestMySite", width="150", height="150" %}</a>
                    <h3><a href="https://testmysite.thinkwithgoogle.com/">TestMySite</a></h3>
                    <p>Allows you to diagnose webpage performance across devices and provides a
                list of fixes for improving the experience from Webpagetest and PageSpeed
                Insights.</p>
            </td>
            <td>
                <a href="https://developers.google.com/speed/pagespeed/insights/">
                {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3Tf74Rv0nbvrWzqXM56E.svg", alt="PageSpeed Insights", width="150", height="150" %}</a>
                    <h3><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a></h3>
                    <p>Shows speed field data for your site, alongside suggestions for common
                optimizations to improve it.</p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://www.thinkwithgoogle.com/feature/mobile/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/XYnAjGQ8E4HimMC5jqAh.svg", alt="Speed Scorecard", width="150", height="150" %}</a>
                    <h3><a href="https://www.thinkwithgoogle.com/feature/mobile/">Speed Scorecard</a></h3>
                    <p>Allows you to compare your mobile site speed against your peers in over 10
                countries. Mobile site speed is based on real-world data from the Chrome
                User Experience Report.</p>
            </td>
            <td>
                <a href="https://www.thinkwithgoogle.com/feature/mobile/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/rYMHLU8uySirxfmwgzij.svg", alt="Impact Calculator", width="150", height="150" %}</a>
                    <h3><a href="https://www.thinkwithgoogle.com/feature/mobile/">Impact Calculator</a></h3>
                    <p>Allows you to estimate the potential revenue opportunity of improving your
                mobile site speed, based on benchmark data from Google Analytics.</p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://developer.chrome.com/docs/devtools/">{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/YpBBtcAGyGGTDgB9IC8J.svg", alt="Chrome Developer Tools", width="150", height="150" %}</a>
                    <h3><a href="https://developer.chrome.com/docs/devtools/">Chrome Developer Tools</a></h3>
                    <p>Allows you to profile the runtime of a page, as well as identify and debug
                performance bottlenecks.</p>
            </td>
            <td>
            </td>
        </tr>
    </tbody>
</table>
</div>

## So you're…

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/d3vzaelRRQt1FMXbhHVI.svg", alt="Icon of a book showing
charts and graphs.", width="366", height="366", class="float-right" %}
</figure>

**Marketer or developer trying to build a business case for improving user
experience of your website. You speak dollars and cents and are looking for
monetary figures that can help you quantify the opportunity cost and expected
lift.**

- Use the **[Speed Scorecard](https://www.thinkwithgoogle.com/feature/mobile/)**
to see how your mobile site speed compares against your  peers in more than 10
countries. Scores are based on real-world data from Chrome User Experience
Report.
- Use the **[Impact Calculator](https://www.thinkwithgoogle.com/feature/mobile/)**
to estimate the potential revenue opportunity of improving your mobile site
speed. Impact is driven by benchmark data from Google Analytics.
- Use **[TestMySite](https://testmysite.thinkwithgoogle.com/)** to test your
page’s mobile loading time alongside industry benchmarks and to learn how simple
fixes can speed up your site and decrease visitor loss; TestMySite is currently
powered by WebPageTest and PageSpeed Insights.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/c9spNOrIojgpHghKiZJY.svg", alt="Icon of a laptop with the Chrome logo behind and slightly above
it.", width="366", height="366", class="float-right" %}
</figure>

**Developer trying to understand current performance of your site, as
experienced by real-world Chrome users, and looking for audit recommendations
against top industry trends and guidelines.**

**[PageSpeed Insights](https://pagespeed.web.dev/)** helps you understand the
real-world performance of your site, as experienced by Chrome users, and
recommends optimization opportunities.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Nj1NljG9QGhzSMWkG36E.svg", alt="Icon of a Lighthouse audit
result page.", width="366", height="366", class="float-right" %}
</figure>

**Developer trying to understand and audit a website against modern web
performance best practices.**

**[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)** contains a comprehensive set of
performance opportunities; it provides you with a list of performance
opportunities missing from your page and the time saved by implementing each
optimization, which can help you understand what you should do.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/rMwYhOH73ao3omTkEvHD.svg", alt="Icon of a magnifying glass
over a bug.", width="366", height="366", class="float-right" %}
</figure>

**Developer looking for technical guidance on how to debug/deep dive into the
performance of your site.**

**[Chrome Developer Tools](https://developer.chrome.com/docs/devtools/)** (CDT) contains a
Performance Panel that allows you to drill down into performance issues with
your site by profiling your site with customized configurations, allowing you
to track down performance bottlenecks. You can use CDT on either production or
development versions of a website.

**[WebPageTest](https://www.webpagetest.org/)** contains an advanced suite of
metrics and trace viewers. It enables deep diving into the performance of your
site on real mobile hardware with network conditions.
