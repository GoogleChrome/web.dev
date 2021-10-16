---
title: "Lowe's website is among fastest performing e-commerce websites"
subhead: >
  By building an automated performance testing and monitoring system,
  the Lowe's Site Speed Team test pull requests against performance budgets,
  and prevent performance regressions going into production.
description: >
  By building an automated performance testing and monitoring system,
  the Lowe's Site Speed Team test pull requests against performance budgets,
  and prevent performance regressions going into production.
authors:
  - choudhuryashish
  - dinakarchandolu
  - abhimanyuraibahadur
  - dhilipvenkateshuvarajan
  - safwans
  - gmimani
date: 2021-03-23
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/U0Xrfy2kVLEb3JSiPS5C.png
alt: The Lowes logo.
tags:
  - blog
  - case-study
  - web-vitals
  - performance
---

{% Aside %}
This post was authored by [Ashish Choudhury](https://www.linkedin.com/in/choudhuryashish/),
[Dinakar Chandolu](https://www.linkedin.com/in/dinakarchandolu/),
[Abhimanyu Raibahadur](https://www.linkedin.com/in/abhimanyuraibahadur/), and
[Dhilipvenkatesh Uvarajan](https://www.linkedin.com/in/dhilip-venkatesh-uvarajan-16914624/)
from Lowe's.
{% endAside %}

[Lowe's](https://www.lowes.com/) is a nearly $90B home improvement retailer
that operates about 2,200 stores and employs more than 300,000 associates.
By building an automated testing and monitoring system that prevents performance regressions from deploying to production,
Lowe's Site Speed Team was able to improve its website performance,
ranking among the top retail sites.

## Problem

The Site Speed Team's goal is to make the Lowe's site one of the fastest e-commerce sites in terms of page load performance.
Before they built their automated testing and monitoring system,
Lowe's website developers were unable to measure performance automatically in pre-production environments.
Existing tools only conducted tests in the production environment.
As a result, inferior builds slipped into production, creating a poor user experience.
These inferior builds would remain in production until they were detected by the Site Speed Team and reverted by the author.

## Solution

The Site Speed Team used open source tools to build an automated performance testing and monitoring system for pre-production environments.
The system measures the performance of every pull request (PR)
and gates the PR from shipping to production if it does not meet the Site Speed Team's
[performance budget](/performance-budgets-101/) and [metric criteria](/vitals/).
The system also measures SEO and ADA compliance.

## Impact

From a sample of 1 team over 16 weeks deploying 102 builds,
the automated performance testing and monitoring system prevented 32 builds with subpar performance from going into production.

Where it used to take the Site Speed Team three to five days to inform developers that they had shipped performance regressions into production,
the system now automatically informs developers of performance problems five minutes after submitting a pull request in a pre-production environment.

Code quality is improving over time,
as measured by the fact that fewer pull requests are being flagged for performance regressions.
The Site Speed Team is also gradually tightening governance budgets to continuously improve site quality.

In general, having clear ownership of problematic code has shifted the engineering culture.
Instead of begrudging reactive corrections because it was never clear who actually introduced the problems,
the team can make proactive optimizations with ownership of problematic code being objectively attributable.

## Implementation

The heart of the Site Speed Governance (SSG) app is [Lighthouse CI](/lighthouse-ci/).
The SSG app uses Lighthouse to validate and audit the page performance of every pull request.

<figure class="w-figure">
{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/62alkvo2eRYoyptYeDbZ.png", alt="A process diagram of the SSG app, the steps shown in the diagram are described later in the article.", width="800", height="567" %}
</figure>

The SSG app causes a build to fail if the Site Speed Team's defined
[performance budget](/performance-budgets-101/) and metric targets are not reached.
It enforces not only load performance but also SEO, PWA, and accessibility.
It can report status immediately to authors, reviewers, and SRE teams.
It can also be configured to bypass the checks when exceptions are needed.

## Automated Speed Governance (ASG) process flow

### Spinnaker

Start point. A developer merges their code into a pre-production environment.

1. Deploy the pre-production environment with CDN assets.
1. Check for the successful deployment.
1. Run a [Docker](https://www.docker.com/)
container to start building the ASG application or send a notification (in the event of deployment failure).

### Jenkins and Lighthouse

1. Build the ASG application with [Jenkins](https://www.jenkins.io/).
1. Run a custom Docker container that has Chrome and Lighthouse installed.
Pull `lighthouserc.json` from the SSG app and run `lhci autorun --collect-url=https://example.com`.

### Jenkins and SSG app

1. Extract `assertion-results.json` from lhci and compare it to predefined budgets in `budgets.json`.
Save the output as a text file and upload it to [Nexus](https://www.sonatype.com/nexus/repository-oss) for future comparisons.
1. Compare the current `assertion-results.json` to the last successful build
(downloaded from Nexus) and save it as a text file.
1. Build an HTML email with the success or failure information.
1. Send the email to the relevant distribution lists with Jenkins.
