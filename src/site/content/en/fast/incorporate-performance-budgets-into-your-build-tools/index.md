---
layout: post
title: Incorporate performance budgets into your build process
authors:
  - mihajlija
description: |
  The best way to keep an eye on your performance budget is to automate it. Find
  out how to choose a tool that best fits your needs and current setup.
date: 2019-02-01
codelabs:
  - codelab-setting-performance-budgets-with-webpack
tags:
  - performance
---

Once you've defined a performance budget, it's time to set up the build process
to keep track of it. There are a number of tools that let you define thresholds
for chosen performance metrics and warn you if you go over budget. Find out
how to choose one that best fits your needs and current setup. 🕵️‍♀️


## Lighthouse performance budgets

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is an auditing tool that tests sites in a few key areas—performance, accessibility, best practices and how well your site performs as a progressive web application.

The [command line version](https://developers.google.com/web/tools/lighthouse/#cli) of Lighthouse (v5+) supports setting [performance budgets](https://developers.google.com/web/tools/lighthouse/audits/budgets) based on:

- resource size
- resource count

You can set budgets for any of the following resource types:
- `document`
- `font`
- `image`
- `media`
- `other`
- `script`
- `stylesheet`
- `third-party`
- `total`

Budgets are set in a JSON file and after defining them the new "Over Budget" column tells you whether you're exceeding any limits.

<figure class="w-figure">
  <img class="w-screenshot" src="./lightwallet.png" alt="Budgets section in Lighthouse report">
  <figcaption class="w-figcaption">
    "Budgets" section in Lighthouse report
  </figcaption>
</figure>

## Webpack performance hints

[Webpack](https://developers.google.com/web/fundamentals/performance/webpack/) is a powerful build tool for optimizing how your code is delivered to the users. It also supports setting performance budgets based on **asset size**.

Turn on [performance hints](https://webpack.js.org/configuration/performance/) in `webpack.config.js` to get command line warnings or errors when your bundle size grows over the limit. It's a great way to stay mindful about asset sizes throughout the development.

After the build step, webpack outputs a color-coded list of assets and their sizes. Anything over budget is highlighted in yellow.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./webpack-output.png" alt="Webpack output highlighting bundle.js">
  <figcaption class="w-figcaption">
    The highlighted bundle.js is bigger than your budget
  </figcaption>
</figure>

The default limit for both assets and entry-points is **250 KB**. You can set your own targets in the configuration file.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./webpack-warning.jpg" alt="Webpack bundle size warning">
  <figcaption class="w-figcaption">
    Webpack bundle size warning ⚠️
  </figcaption>
</figure>

The budgets are compared against **uncompressed asset sizes**. Uncompressed [JavaScript size is related to the execution time](https://v8.dev/blog/cost-of-javascript-2019) and big files can take a long time to execute, especially on mobile devices.

{% Aside %}
Compressed asset sizes affect the transfer time, which is very important on slow networks.
{% endAside %}

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./webpack-recommendation.jpg" alt="Webpack performance optimization recommendation">
  <figcaption class="w-figcaption">
    Bonus feature: webpack won’t only warn you, it will give you a recommendation on how to downsize your bundles. 💁
  </figcaption>
</figure>

## Bundlesize

[Bundlesize](https://github.com/siddharthkp/bundlesize) is a simple npm package that tests asset size against a threshold you've set. It can run locally and integrate with your CI.

### Bundlesize CLI

Run [bundlesize CLI](https://github.com/siddharthkp/bundlesize#cli) by specifying a threshold and the file that you want to test.

```bash
bundlesize -f "dist/bundle.js" -s 170kB
```

Bundlesize outputs color-coded test results in one line.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./bundlesize-fail.png" alt="Failing bundlesize CLI test">
  <figcaption class="w-figcaption">
    Failing bundlesize CLI test ❌
  </figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./bundlesize-pass.png" alt="Passing bundlesize CLI test">
  <figcaption class="w-figcaption">
    Passing bundlesize CLI test ✔️
  </figcaption>
</figure>

### Bundlesize for CI

You'll get the most value out of bundlesize if you integrate it with a CI to automatically enforce size limits on pull requests. **If bundlesize test fails, that pull request is not merged.** It works for pull requests on GitHub with [Travis CI](https://travis-ci.org/), [CircleCI](https://circleci.com/), [Wercker](http://www.wercker.com/), and [Drone](http://readme.drone.io/).

<figure class="w-figure">
  <img class="screenshot" src="./bundlesize-status.jpg" alt="Bundlesize check status on Github">
  <figcaption class="w-figcaption">
    Bundlesize check status on Github
  </figcaption>
</figure>

You may have a fast app today, but adding new code can often change this. Checking pull requests with bundlesize will help you avoid performance regressions. Bootstrap, Tinder, Trivago and many others use it to keep their budgets in check.

With bundlesize, it's possible to set thresholds for each file separately. This is especially useful if you are splitting a bundle in your application.

By default, **it tests gzipped asset sizes**. You can use the compression option to switch to [brotli compression](https://css-tricks.com/brotli-static-compression/) or turn it off completely.

## Lighthouse Bot

<figure class="w-figure">
  <img src="./lighthouse-travis.png" alt="Lighthouse Bot">
  <figcaption class="w-figcaption">
  </figcaption>
</figure>

[Lighthouse Bot](https://github.com/ebidel/lighthouse-ci) integrates with Travis CI and enforces budgets based on any of the five Lighthouse audit categories. For example, a budget of 100 for your Lighthouse performance score. It's sometimes simpler to keep an eye on a single number than individual asset budgets and Lighthouse scores take many things into account.

<figure class="w-figure">
  <img class="screenshot" src="./lighthouse-scores.png" alt="Lighthouse scores 💯">
  <figcaption class="w-figcaption">
    Lighthouse scores 💯
  </figcaption>
</figure>

Lighthouse Bot runs an audit after you deploy a site to staging server. In `.travis.yml` set budgets for particular Lighthouse categories with `--perf`, `--a11y`, `--bp`, `--seo` or `--pwa` options. Aim to stay in the green zone with scores of at least 90.

<pre class="prettyprint">
after_success:
  - ./deploy.sh # Deploy the PR changes to staging server
  - npm run lh -- --perf=96 https://staging.example.com # Run Lighthouse test
</pre>

If the scores for a pull request on GitHub fall below the threshold you've set, **Lighthouse Bot can prevent pull request from being merged**. ⛔

<figure class="w-figure">
  <img class="screenshot" src="./lighthouse-check.png" alt="Lighthouse Bot check status on Github">
  <figcaption class="w-figcaption">
    Lighthouse Bot check status on Github
  </figcaption>
</figure>

**Lighthouse Bot** then comments on your pull request with updated scores. This is a neat feature which encourages conversation about performance as code changes are happening.

<figure class="w-figure">
  <img src="./lighthouse-bot.png" alt="Lighthouse reporting scores on pull request">
  <figcaption class="w-figcaption">
    Lighthouse reporting scores on pull request 💬
  </figcaption>
</figure>

If you find your pull request blocked by a poor Lighthouse score, run an audit with [Lighthouse CLI](https://developers.google.com/web/tools/lighthouse/#cli) or in [Dev Tools](https://developers.google.com/web/tools/lighthouse/#devtools). It generates a report with details about bottlenecks and hints for simple optimizations.

## Summary

<div class="w-table-wrapper">
  <table>
    <tr>
      <th>Tool</th>
      <th>CLI</th>
      <th>CI</th>
      <th>Summary</th>
    </tr>
    <tr>
      <td>Lighthouse</td>
      <td>✔️</td>
      <td>❌</td>
      <td>
        <ul>
          <li>Budgets for different types of resources based on their size or count.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>webpack</td>
      <td>✔️</td>
      <td>❌</td>
      <td>
        <ul>
          <li>Budgets based on sizes of assets generated by webpack.</li>
          <li>Checks uncompressed sizes.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>bundlesize</td>
      <td>✔️</td>
      <td>✔️</td>
      <td>
        <ul>
          <li>Budgets based on sizes of specific resources.</li>
          <li>Checks compressed or uncompressed sizes.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Lighthouse Bot</td>
      <td>❌</td>
      <td>✔️</td>
      <td>
        <ul>
          <li>Budgets based on Lighthouse scores.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>
