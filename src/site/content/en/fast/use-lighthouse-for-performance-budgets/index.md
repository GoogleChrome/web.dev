---
layout: post
title: Use Lighthouse for performance budgets
authors:
  - katiehempenius
description: |
  Lighthouse now supports performance budgets. This feature, LightWallet, can be
  set up in under five minutes and provides feedvack on the size and quantity of
  page resources.
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

[Lighthouse](https://github.com/GoogleChrome/lighthouse) now supports performance budgets. This feature, [LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets), can be set up in under five minutes and provides feedback on performance metrics and the size and quantity of page resources.

## Install Lighthouse

LightWallet is available in the command line version of Lighthouse v5+.

To get started, install Lighthouse:

```bash
npm install -g lighthouse
```

## Create a Budget

Create a file named `budget.json`. In this file add the following JSON:

```json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-meaningful-paint",
        "budget": 1000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 125
      },
      {
        "resourceType": "total",
        "budget": 300
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ]
  }
]
```

This example `budget.json` file sets five separate budgets:

* A budget of 3000ms for Time to Interactive.
* A budget of 1000ms for First Meaningful Paint
* A budget of 125 KB for the total amount of JavaScript on the page.
* A budget of 300 KB for the overall size of the page.
* A budget of 10 requests for the number of requests made to third-party origins.

For a complete list of supported performance metrics and resource types, refer to the [Performance Budgets](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md) section of the Lighthouse docs.

## Run Lighthouse

Run Lighthouse using the `--budget-path` flag. This flag tells Lighthouse the location of your budget file.

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %}
**Note**: A budget file does not have to be named `budget.json`.
{% endAside %}

## View the Results

If LightWallet has been configured correctly, the Lighthouse report will contain a **Budgets** section within the **Performance** category.

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="'Budgets' section of the Lighthouse report", width="800", height="289" %}

In the JSON version of the Lighthouse report, Lightwallet results can be found within the audit findings for the `performance-budget` audit.
