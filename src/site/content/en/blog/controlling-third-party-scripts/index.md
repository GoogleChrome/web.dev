---
title: 'Keeping third-party scripts under control'
subhead: |
  Before optimizing third party tags, make sure that these scripts are still needed on your site.
authors:
  - ansteychris
  - antoinebisch
date: 2021-04-22
hero: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/TqyTENFItXjxfEDHLsad.png
alt: Stylized photo of a half-hidden person.
description: >
    Third-party scripts, or "tags" can be a source of performance problems on your site,
    and therefore a target for optimization.
    However, before you start optimizing the tags you have added,
    make sure that you are not optimizing tags you don't even need.
    This article shows you how to assess requests for new tags,
    and manage and review existing ones.
tags:
  - blog
  - performance
---

Third-party scripts, or "tags" can be a source of performance problems on your site,
and therefore a target for optimization.
However, before you start optimizing the tags you have added,
make sure that you are not optimizing tags you don't even need.
This article shows you how to assess requests for new tags,
and manage and review existing ones.

When discussing third-party tags,
the conversation often quickly moves to performance problems,
losing sight of the foundations of what the "core" role of these tags are.
They provide a wide range of useful functionality,
making the web
[more dynamic, interactive, and interconnected](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript).
However, third-party tags can be added by different teams across the organization
and are often forgotten about over time.
People move on, contracts expire, or the results are yielded,
but the teams never get back in touch to have the scripts removed.

{% Aside %}
In the article
[Improving Third-Party Web Performance](https://medium.com/the-telegraph-engineering/improving-third-party-web-performance-at-the-telegraph-a0a1000be5),
the web team at The Telegraph removed old tags where they could not identify the requester,
deciding that if the tags were missed the responsible party would get in touch.
However, no one ever did.
{% endAside %}

Before you start to think about third-party tag script execution,
or which tags can be
[deferred, lazy-loaded or preconnected](/codelab-optimize-third-party-javascript/)
from a technical lens,
there's an opportunity to govern which tags are added to a site/page from an organizational point of view.
A common theme with websites that are being slowed down due to vast amounts of third-party tags,
is this part of the website is not owned by a single person or team,
and therefore falls between the cracks.
There's nothing more frustrating than optimizing your website,
being happy with the performance in a staging environment,
only for the speed to regress in production because of tags that are being added.
Implementing a "vetting process" for third-party tags can help prevent this,
by building a workflow that creates cross-functional accountability and responsibility for these tags.

The manner in which you vet third-party tags depends solely on the organisation,
its structure and its current processes.
It could be as basic as having a single team who govern and act as the gatekeeper
for analysing tags before they are added.
Or more advanced and formal,
for example by providing a form to teams to submit requests for a tag.
This might ask for context in terms of why it needs to be on the website,
for how long it should be present,
and what benefit it would bring to the business.

## Tag governance process

However you choose to vet tags within your organization,
the following stages should be considered as part of the lifecycle of a tag.

### Compliance

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/33aRnqMUCnbTSvaw5h0m.png",
alt="Five arrows, with the first step of 'Compliance' completed.",
width="800",
height="67" %}

Before any tag is added onto a page,
check that it has been thoroughly vetted by a legal team to ensure it passes all compliance requirements for it to be present.
This might include checking that the tag is compliant with the [EU General Data Protection Regulation (GDPR),
and California Consumer Privacy Act (CCPA)](https://iapp.org/news/a/what-you-must-know-about-third-parties-under-the-gdpr-ccpa/).

This is critical,
if there is any doubt with this step it needs to be addressed
before assessing the tag from a performance point of view.

### Required

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/kX91VwuEJzBBdf76HIm9.png",
alt="Five arrows, with the first two steps of 'Compliance' and 'Required' completed.",
width="800",
height="60" %}

The second step is to question whether a specific tag is needed on the page.
Consider the following discussion points:

- Is the tag actively being used? If not, can it be removed?
- If the tag is loading sitewide,
is this necessary?
For example, if we're analysing an A/B testing suite and you are currently only testing on Landing Pages,
can we only drop the tag on this page type?
- Can we add further logic to this, can we detect if there is a live A/B test?
If so, allow the tag to be added, but if not ensure that it is not present.

### Ownership

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/VsE2wzqT56RJ7Yl7wx2P.png",
alt="Five arrows, with the first three steps of 'Compliance', 'Required', and 'Ownership' completed.",
width="800",
height="62" %}

Having a  clear person or team as an owner of a tag,
helps to proactively keep track of tags.
Usually this would be whomever has added the tag. By having an assignee next to the tag,
this will ensure reviews and audits in the future can be conducted to re-visit whether the tag is required.

### Purpose

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/kKJCySoXMCTPjrID1CVg.png",
alt="Five arrows, with the first four steps of 'Compliance', 'Required', 'Ownership', and 'Purpose' completed.",
width="800",
height="58" %}

The fourth step begins to create cross-functional accountability and responsibility
by ensuring people understand why the tag is added to the page.
It's important for there to be a cross-functional understanding of what each tag is bringing to the website,
and why it is being used.
For example, if the tag is recording user session actions to allow personalization,
do all teams know why this should be present?

Furthermore, have there been any commercial vs performance trade-off discussions?
If there is a tag that is deemed as "required" because it brings in revenue,
has there been an analysis to the potential revenue lost through speed regression

### Review

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/txmJbO1xdLzfo3PYsDgZ.png",
alt="Five arrows, with all five steps of 'Compliance', 'Required', 'Ownership', 'Purpose', and 'Review' completed.",
width="800",
height="61" %}

The fifth, final and arguably most important step is to ensure tags are being reviewed on a regular basis.
This should be dependent on the size of the website,
the number of tags that are on the site,
and their turnaround time (e.g. weekly, monthly, quarterly).
This should be treated in the same manner as optimizing other website assets (JS, CSS, images, etc.)
and proactively checked on a regular basis.
Failure to review could lead to a "bloated" tag manager,
which slows down the pages.
It can be a complex task to revert back to being performant,
while not regressing the required functionality on the page

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/TqyTENFItXjxfEDHLsad.png",
alt="Five arrows, with all five steps of 'Compliance', 'Required', 'Ownership', 'Purpose', and 'Review' completed. Indicating that these are all steps in the performance vetting process.",
width="800",
height="305" %}

The vetting process should leave you with a final list
of tags which are classified as needed for a specific page.
At this stage, you can then delve into
[technical optimisation approaches](/codelab-optimize-third-party-javascript/).
This also opens up the opportunity to define the number of tags in this final list within a
[performance budget](/your-first-performance-budget/),
which can be monitored within
[Lighthouse CI](/lighthouse-ci/#overview)
and incorporated into performance-specific goal setting.
For example:

> If we stick to <5 tags on our Landing Pages along with our own optimized JS,
we're confident the
[Total Blocking Time (TBT)](/tbt/) can hit 'good' in the
[Core Web Vitals](/vitals/).
