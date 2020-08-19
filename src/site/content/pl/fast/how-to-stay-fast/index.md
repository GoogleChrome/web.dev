---
layout: post
title: How to stay fast?
authors:
  - bojanpavic
  - ansteychris
description: |
  Brands that optimize speed will often find they regress quickly. In this post
  we explore how to make sure your fast experience stays fast.
web_lighthouse: N/A
date: 2019-05-01
tags:
  - performance
---

Brands that optimize speed will often find they regress quickly. This is because website performance is a lot like getting fit: it's not enough to make a one time effort; you have to change your lifestyle.

{% Aside 'note' %}
  [Internal Google study](https://www.youtube.com/watch?v=YJGCZCaIZkQ) has found that 40% of brands regress on web performance after 6 months.
{% endAside %}

Performance budgets are one way to address this. A performance budget is a set of limits on metrics that affect site performance. The concept is similar to a financial budget: you set a limit and make sure you stay within it. In general, a good performance budget combines different types of metrics; so, for example, the performance budget for a product page might look as follows:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td>Time To Interactive on slow 3G</td>
        <td>Less than</td>
        <td>5 seconds</td>
      </tr>
      <tr>
        <td>First Contentful Paint on slow 3G</td>
        <td>Less than</td>
        <td>2 seconds</td>
      </tr>
      <tr>
        <td>Lighthouse performance score</td>
        <td>Greater than</td>
        <td>80</td>
      </tr>
      <tr>
        <td>Total JavaScript size</td>
        <td>Less than</td>
        <td>170 kb</td>
      </tr>
    </tbody>
    <caption>Example performance budget.</caption>
  </table>
</div>

Once set, a performance budget has to be enforced, which means for example incorporating the budget into your build process and reporting. Tools like Lighthouse can be included in your continuous integration, and you can write tests that fail a build if key metrics drop below a set threshold. Additionally, regular reporting through dashboards or summary reports can help with visibility and accountability. [Pinterest](https://www.youtube.com/watch?v=Xryhxi45Q5M) are one example of a business that have implemented performance budgets to make sure their fast experience stays fast, while brands like [Experian](https://www.thinkwithgoogle.com/intl/en-gb/success-stories/uk-success-stories/how-mobile-first-mindset-helped-experian-slash-page-load-times/) are now using site speed as a key metric in their monthly executive KPI reports.

You can find more details on performance budgets [here](/performance-budgets-101). A guide that describes how to further instill performance culture and make speed metrics visible and tangible for all stakeholders can be found [here](/how-to-report-metrics/).
