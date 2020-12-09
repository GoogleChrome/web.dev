---
title: 'Automating audits with AutoWebPerf'
subhead: TODO
description: TODO
date: 2020-12-08
# updated: 2020-07-22
tags:
  - blog
  - performance
  - tools
---

## What is AutoWebPerf (AWP)?

[AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf) (AWP) is a
modular tool that enables automatic gathering of performance data from multiple
sources. Currently there are [many tools
available](https://web.dev/vitals-tools/) to measure website performance for
different scopes ([lab and
field](https://web.dev/how-to-measure-speed/#lab-data-vs-field-data)), such as
Chrome UX Report, PageSpeed Insights, or WebPageTest. AWP offers integration
with various audit tools with a simple setup so you can continuously monitor the
site performance in one place.

The release of [Web Vitals](https://web.dev/vitals/) guidance means that close
and active monitoring of web pages is becoming increasingly important. The
engineers behind this tool have been doing performance audits for years and they
created AWP to automate a manual, recurring, and time consuming part of their
daily activities. Today, AWP has reached a level of maturity and it's ready to
be shared broadly so anyone can benefit from the automation it brings. 

The tool is accessible on the
[GoogleChromeLabs public repository](https://github.com/GoogleChromeLabs/AutoWebPerf).

## What is AWP for?

Although several tools and APIs are available to monitor the performance of web
pages, most of them expose data measured at a specific time. To adequately
monitor a website and maintain good performance of key pages, it's recommended
to continuously take measurements of [Core Web
Vitals](https://web.dev/vitals/#core-web-vitals) over time and observe trends.  
AWP makes that easier by providing an engine and pre-built API integrations
which can be programmatically configured to automate recurrent queries to
various performance monitoring APIs.  
For example, with AWP, you can set a daily test on your home page to capture the
field data from [CrUX API](https://web.dev/chrome-ux-report-api/) and lab data
from a
[Lighthouse report from PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).
This data can be written and stored over time, for example, in [Google
Sheets](https://www.google.co.uk/sheets/about/) and then visualised in the
[Data Studio dashboard](https://datastudio.google.com/c/u/0/navigation/reporting).
AWP automates the heavy-lifting part of the entire process, making it a great
solution to follow lab and field trends over time (See "Visualising audit
results in Data Studio" below for more details).

## Architecture overview

AWP is a modular-based library with three different types of modules: 

+   the engine
+   connector modules
+   gatherer modules 

The engine takes a list of tests from the **Connector** (for example, from a
local CSV file), runs performance audits through selected **Gatherers** (such as
PageSpeed Insights), and writes results to the output connector (for example,
Google Sheets).

![image](https://drive.google.com/file/d/1b5ZdEaAfyvQrJ-d6eg86SNKcOkBkndSb/view?usp=drivesdk&resourcekey=0--dLlpVpeZV_n2GcjjTyXiQ)

AWP comes with a number of pre-implemented gatherers and connectors:

+   Pre-implemented gatherers:

    +   [CrUX API](https://web.dev/chrome-ux-report-api/)
    +   [CrUX BigQuery](https://web.dev/chrome-ux-report-bigquery/)
    +   [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
    +   [WebPageTest API](https://www.webpagetest.org/getkey.php)

+   Pre-implemented connectors:

    +   Google Sheets
    +   JSON
    +   CSV

## Automating audits with AWP

AWP automates the performance audits via your preferred audit platforms such as
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/),
[WebPageTest](https://webpagetest.org/), or
[CrUX API](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference).
AWP offers the flexibility to choose where to load the list of tests, and where
to write the results to.

For example, you can run audits for a list of tests stored in a Google Sheet,
and write the results to a CSV file, with the command below:

<table>
<thead>
<tr>
<th><p><pre>
PSI_APIKEY=<YOUR_KEY> SHEETS_APIKEY=<YOUR_KEY> ./awp run sheets:<SheetID> csv:output.csv
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

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
    },
  ]
}
```

The command below reads the list of audit tests from the local JSON file, runs
audits on a local machine, then outputs results to a local CSV file: 

<table>
<thead>
<tr>
<th><p><pre>
PSI_APIKEY=<YOUR_KEY> ./awp run json:tests.json csv:output.csv
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

To run audits every day as a background service continuously, you can use the
command below instead: 

<table>
<thead>
<tr>
<th><p><pre>
PSI_APIKEY=<YOUR_KEY> ./awp continue json:tests.json csv:output.csv
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Alternatively, you can set up the
[crontab](https://www.geeksforgeeks.org/how-to-setup-cron-jobs-in-ubuntu/) in a
Unix-like environment to run AWP as a daily cron job:

<table>
<thead>
<tr>
<th><p><pre>
0 0 * * * PSI_APIKEY=<YOUR_KEY> ./awp run json:tests.json csv:output.csv
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

These simple commands above automates the daily audits and result collection in
different ways. You can find more use cases in the [AWP github
repository](https://github.com/GoogleChromeLabs/AutoWebPerf) in detail.

## Visualising audit results in Data Studio

Along with continuously measuring Core Web Vitals, it is important to be able to
evaluate the trends and discover potential regressions with Real User Metrics
(RUM) or the Chrome UX Report (CrUX) data collected by AWP. Please note that
Chrome UX Report (CrUX) is a 28-day moving aggregation, hence it is recommended
to also use your own RUM data along with CrUX so you can spot regressions
sooner.

Data Studio is a free visualization tool that you can easily load performance
metrics in and draw the trends in charts. For example, the time series charts
below show Core Web Vitals based on Chrome UX Report data. One of the charts
shows the increasing Cumulative Layout Shift in the recent weeks, which means
regressions in the layout stability for certain pages. In this scenario, you
would want to prioritize the efforts to analyze the underlying issues of these
pages.

![image](https://drive.google.com/file/d/1AxvqpoNuwJjgRijhMZByVNO2bhr2fAmw/view?usp=drivesdk&resourcekey=0-ItH-oT-Ct0t3lD1xVU_7bA)

To simplify the end-to-end process from data collection to visualization, you
can run AWP with a list of URLs to automatically export results to Google Sheets
with the following command:

<table>
<thead>
<tr>
<th><p><pre>
PSI_APIKEY=<YOUR_KEY> SERVICE_ACCOUNT_CREDENTIALS=<PATH_TO_JSON> ./awp run csv:tests.csv sheets:<SheetsID>/Tests
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

After collecting daily metrics in a spreadsheet, you can create a Data Studio
dashboard that loads the data directly from the spreadsheet, and plot the trends
into a time series chart. Check
[this guidance](https://github.com/GoogleChromeLabs/AutoWebPerf/blob/stable/docs/sheets-connector.md)
for detailed steps about how to set up AWP with spreadsheets as a data source to
visualize on Data Studio.

## What's next?

AWP provides a simple and integrated way to minimize the efforts to set up a
continuous monitoring pipeline to measure Core Web Vitals and other performance
metrics. As for now, AWP covers the most common use cases and will continue to
provide more features to address other use cases in future.

Check out more details and examples in the GoogleChromeLabs public repository
at:
[https://github.com/GoogleChromeLabs/AutoWebPerf](https://github.com/GoogleChromeLabs/AutoWebPerf).