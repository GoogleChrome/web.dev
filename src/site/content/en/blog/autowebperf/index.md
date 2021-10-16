---
title: 'Automating audits with AutoWebPerf'
subhead: >
  A new modular tool that enables automatic gathering of performance data from multiple sources.
description: >
  A new modular tool that enables automatic gathering of performance data from multiple sources.
date: 2020-12-09
updated: 2021-01-08
authors:
  - jonchen
  - gilbertococchi
  - antoinebisch
hero: image/admin/XEdZ5JBzgWLES21OvPjE.jpg
thumbnail: image/admin/I9vVFD2ldSQc9vBfTc3i.jpg
tags:
  - blog
  - performance
  - tools
---

## What is AutoWebPerf (AWP)?

[AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf) (AWP) is a
modular tool that enables automatic gathering of performance data from multiple
sources. Currently there are [many tools
available](/vitals-tools/) to measure website performance for
different scopes ([lab and
field](/how-to-measure-speed/#lab-data-vs-field-data)), such as
Chrome UX Report, PageSpeed Insights, or WebPageTest. AWP offers integration
with various audit tools with a simple setup so you can continuously monitor the
site performance in one place.

The release of [Web Vitals](/vitals/) guidance means that close
and active monitoring of web pages is becoming increasingly important. The
engineers behind this tool have been doing performance audits for years and they
created AWP to automate a manual, recurring, and time consuming part of their
daily activities. Today, AWP has reached a level of maturity and it's ready to
be shared broadly so anyone can benefit from the automation it brings.

The tool is accessible on the
[AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf) public repository
on GitHub.

## What is AWP for?

Although several tools and APIs are available to monitor the performance of web
pages, most of them expose data measured at a specific time. To adequately
monitor a website and maintain good performance of key pages, it's recommended
to continuously take measurements of [Core Web
Vitals](/vitals/#core-web-vitals) over time and observe trends.

AWP makes that easier by providing an engine and pre-built API integrations
which can be programmatically configured to automate recurrent queries to
various performance monitoring APIs.

For example, with AWP, you can set a daily test on your home page to capture the
field data from [CrUX API](/chrome-ux-report-api/) and lab data
from a
[Lighthouse report from PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).
This data can be written and stored over time, for example, in [Google
Sheets](https://www.google.co.uk/sheets/about/) and then visualised in the
[Data Studio dashboard](https://datastudio.google.com/c/u/0/navigation/reporting).
AWP automates the heavy-lifting part of the entire process, making it a great
solution to follow lab and field trends over time. See [Visualising audit
results in Data Studio](#data-studio) below for more details).

## Architecture overview

AWP is a modular-based library with three different types of modules:

* the **engine**
* **connector** modules
* **gatherer** modules

The engine takes a list of tests from a connector (for example, from a
local CSV file), runs performance audits through selected gatherers (such as
PageSpeed Insights), and writes results to the output connector (for example,
Google Sheets).

{% Img src="image/admin/GqufPfzbuslrT4st1FmP.png", alt="A diagram of AWP's architecture.", width="800", height="439" %}

AWP comes with a number of pre-implemented gatherers and connectors:

* Pre-implemented gatherers:
  * [CrUX API](/chrome-ux-report-api/)
  * [CrUX BigQuery](/chrome-ux-report-bigquery/)
  * [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
  * [WebPageTest API](https://www.webpagetest.org/getkey.php)
* Pre-implemented connectors:
  * Google Sheets
  * JSON
  * CSV

## Automating audits with AWP

AWP automates the performance audits via your preferred audit platforms such as
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/),
[WebPageTest](https://webpagetest.org/), or
[CrUX API](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference).
AWP offers the flexibility to choose where to load the list of tests, and where
to write the results to.

For example, you can run audits for a list of tests stored in a Google Sheet,
and write the results to a CSV file, with the command below:

```shell
PSI_APIKEY=<YOUR_KEY> SHEETS_APIKEY=<YOUR_KEY> ./awp run sheets:<SheetID> csv:output.csv
```

### Recurring audits

You can run recurring audits in daily, weekly, or monthly frequency. For
example, you can run daily audits for a list of tests defined in a local JSON
like below:

```json
{
  "tests": [
    {
      "label": "web.dev",
      "url": "https://web.dev",
      "gatherer": "psi"
    }
  ]
}
```

The command below reads the list of audit tests from the local JSON file, runs
audits on a local machine, then outputs results to a local CSV file:

```shell
PSI_APIKEY=<YOUR_KEY> ./awp run json:tests.json csv:output.csv
```

To run audits every day as a background service continuously, you can use the
command below instead:

```shell
PSI_APIKEY=<YOUR_KEY> ./awp continue json:tests.json csv:output.csv
```

Alternatively, you can set up the
[crontab](https://www.geeksforgeeks.org/how-to-setup-cron-jobs-in-ubuntu/) in a
Unix-like environment to run AWP as a daily cron job:

```shell
0 0 * * * PSI_APIKEY=<YOUR_KEY> ./awp run json:tests.json csv:output.csv
```

You can find more ways to automate daily audits and result collection in the
[AWP GitHub repository](https://github.com/GoogleChromeLabs/AutoWebPerf).

## Visualising audit results in Data Studio {: #data-studio }

Along with continuously measuring Core Web Vitals, it is important to be able to
evaluate the trends and discover potential regressions with real user metrics
(RUM) or the Chrome UX Report (CrUX) data collected by AWP. Note that
Chrome UX Report (CrUX) is a 28-day moving aggregation, hence it is recommended
to also use your own RUM data along with CrUX so you can spot regressions
sooner.

Data Studio is a free visualization tool that you can easily load performance
metrics into and draw trends as charts. For example, the time series charts
below show Core Web Vitals based on Chrome UX Report data. One of the charts
shows increasing Cumulative Layout Shift in recent weeks, which means
regressions in the layout stability for certain pages. In this scenario, you
would want to prioritize the efforts to analyze the underlying issues of these
pages.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cpi7NkLvKyvf2xYzFwAn.png", alt="A screenshot of Core Web Vitals results in Data Studio.", width="800", height="904", class="w-screenshot" %}
</figure>

To simplify the end-to-end process from data collection to visualization, you
can run AWP with a list of URLs to automatically export results to Google Sheets
with the following command:

```shell
PSI_APIKEY=<YOUR_KEY> SHEETS_APIKEY=<YOUR_KEY> ./awp run sheets:<SheetID> csv:output.csv
```

After collecting daily metrics in a spreadsheet, you can create a Data Studio
dashboard that loads the data directly from the spreadsheet, and plots the
trends into a time series chart. Check out [Google Spreadsheets API
Connector](https://github.com/GoogleChromeLabs/AutoWebPerf/blob/stable/docs/sheets-connector.md)
for detailed steps about how to set up AWP with spreadsheets as a data source to
visualize on Data Studio.

## What's next?

AWP provides a simple and integrated way to minimize the efforts to set up a
continuous monitoring pipeline to measure Core Web Vitals and other performance
metrics. As for now, AWP covers the most common use cases and will continue to
provide more features to address other use cases in the future.

Learn more in the [AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf) repository.
