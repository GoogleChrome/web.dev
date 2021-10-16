---
title: Choose the best build tool for your project with tooling.report
subhead: Select and configure build tools based on best practices.
description: |
  Select and configure build tools based on best practices.
scheduled: true
date: 2020-06-29
updated: 2020-08-20
hero: image/admin/y3f0yAb97pLOpTQrhUNA.jpg
alt: A grid of cards showing test names and test results from across tooling.report.
tags:
  - blog
  - tools
  - javascript
  - css
  - html
---

{% YouTube 'vsMJiNtQWvw' %}

Today web.dev is launching a new initiative called [tooling.report](https://tooling.report). It's a
website that gives web developers an overview of the features supported across a selection of
popular build tools. We built this site to help you choose the right build tool for your next
project, decide if migrating from one tool to another is worth it, or figure out how to incorporate
best practices into your tooling configuration and code base. Tools have different focus areas and
cater to a different set of needs, which means selecting and configuring tools involves making
tradeoffs. With tooling.report, we aim to explain these tradeoffs and document how to follow best
practices with any given build tool.

Sounds exciting? Visit tooling.report to start exploring, or read on to learn more about why and how
we developed this site.

## Build tools often get in our way

Over at [GoogleChromeLabs](https://github.com/GoogleChromeLabs), we've built web apps like
[Squoosh](https://squoosh.app/) and [Proxx](https://proxx.app/), as well as websites like the one
for [Chrome Dev Summit 2019](https://developer.chrome.com/devsummit/). As with any web development
project, we generally start by discussing project infrastructure like the hosting environment,
frameworks, and our build tool setup.  That infrastructure is updated as the project progresses: new
plugins are added in order to accommodate frameworks or techniques we adopt, or the way we write
code is changed so that our build tools better understand what we are trying to achieve. Throughout
this process, we have often found that the tools we select end up getting in our way.

Our team is focused on providing the best web experience to users, which often results in
fine-tuning how our frontend assets are assembled and delivered. For example, if a main thread
script and web worker script have shared dependencies, we would like to download the dependencies
once instead of bundling it twice for each script. Some tools support this out of the box, some need
significant customization effort to change default behaviors, and for others it's outright
impossible.

This experience led us to investigate what different build tools can and cannot do. Our hope was to
create a checklist for features so that next time we start a new project, we can evaluate and choose
which tool is best suited for our project.

## Our approach

How can we evaluate and compare different build tools in one place? We approached it by writing test
cases.

Our team discussed and designed test criteria that we believe represent best practices for web
development. We specifically focused on how to deliver fast, responsive, and smooth user
experiences, intentionally excluding tests related to developer experience in order to avoid
measuring two incomparable outcomes.

Once the test list was created, we went ahead and wrote a build script for each tool to check if the
tool can fulfil the test's success criteria. As an initial set, we decided to investigate webpack
v4, Rollup v2, and Parcel v2. We also tested Browserify + Gulp since a large number of projects
still use this setup. For a test to pass, only publicly documented features of the tool or a plugin
for the tool can be used. After the initial set of tests were written, we worked with the build tool
authors to make sure we used their tools correctly and represented them fairly.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0OauqO2tSeOTDpDGutmk.jpg", alt="A screenshot of tooling.report.", width="800", height="394", class="w-screenshot w-screenshot--filled" %}
</figure>

## We only use ${tool_name}, should I still care?

In many teams, there are people dedicated to maintaining the build infrastructure, and other members
of the team might never get to make a choice when it comes to build tools. We hope this site is
still useful for you too, as a way to set expectations for the tools you rely on. For each test,
we've included an explanation of why the test is important along with additional resources. And if
you want to adopt a best practice with the tool of your choice, the test setup in our repository
contains the configuration files necessary to do so.

## Can I contribute to the site?

If you think a certain feature should be tested that is currently missing, please [propose it in a
GitHub issue](https://github.com/GoogleChromeLabs/tooling.report/issues/new) to start the
discussion. We aim to encapsulate real-world use cases, and any additional tests that better assess
these outcomes are welcome.

If you want to write tests for tools we did not include in the initial set, we welcome that too!
Please see
[CONTRIBUTING.md](https://github.com/GoogleChromeLabs/tooling.report/blob/dev/CONTRIBUTING.md) for
more information.
