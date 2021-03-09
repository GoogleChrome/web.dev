---
layout: handbook
title: Content process guide
date: 2021-03-07
description: >
  Process guidelines for reviewing, prioritizing, and tracking proposals and drafts.
---

This page explains web.dev's content review processes. It is written to help the
Chrome DevRel content team do their job. In other words, any instructions you
see on this page are directed at the Chrome DevRel content team. The job of the
Chrome DevRel content team is to ensure that all web.dev content is high
quality. We primarily enforce that through our proposal and draft review
processes.

The recommended way to use this page is to read it from top-to-bottom
to understand the context about how we do things, and then to use
the [checklists](#checklists) at the bottom when actually reviewing proposals or drafts.

## Proposal reviews {: #proposals }

Before any new content is published to web.dev it should go through our
standard proposal review process. The goals of the proposal review process are
to:

* Ensure that the content is a good fit for web.dev before we invest a lot of
  time and energy into reviewing it.
* Make sure that we're not duplicating content that already largely exists elsewhere.

[`go/chrome-devrel-content-proposal`](go/chrome-devrel-content-proposal) (or
**the form** for short) is the preferred way for people to propose new content.
The form is only available to Googlers. People who want to publish new
content but don't have access to a Googler who can submit the form on their
behalf can [create a GitHub issue][issue] instead. For the rest of this section
we'll assume that the proposal was submitted through the form.

Don't review drafts until the author has submitted the proposal form.

After the proposal is submitted an email should automatically be sent out
that CCs the proposal submitter, the Chrome DevRel content team, and relevant
stakeholders. In general, you want to make sure that the Chrome DevRel content
team's mailing list email is CC'd on most discussions, so that we have a permanent
and searchable record of the discussions.

This automated email is handled via a Google Apps automation script. In the event
that the script fails for some reason, you can see submitted proposals in
the [go/chrome-devrel-content-proposal (Responses)][spreadsheet] spreadsheet.

The proposal reviewer should aim to respond to the proposal within a day,
even if it's simply to say that they won't be able to review the proposal until
later (provide a specific date).

"Relevant stakeholders" is determined by the information that the proposal submitter
provides in the form. For example, if they specify that the content is related
to PWAs, a PWA DevRel lead will be CC'd in the automated email.

The proposal reviewer should check to make sure that the people who
have been CC'd actually need to be on the thread. If not, the proposal
reviewer should take them off the email thread. Conversely, if the
submitter provided incomplete information, the proposal reviewer should
add people who would be interested in the new content. 

Note that when a proposal is received a GitHub issue is also automatically
created to help us track the work. This GitHub issue is discussed more
in [Tracking work](#tracking).

### Acceptance criteria {: #criteria }

When reviewing content proposals, use the following guidelines
to determine whether the content is appropriate for web.dev:

* **Targeted at web developers**. web.dev's main audience is web
  developers. Content that is primarily for other types of developers
  probably shouldn't go on web.dev. One exception are technologies
  that blur the lines between platforms, such as WebViews. Non-developer
  content also usually doesn't belong on web.dev. One exception are case
  studies, where the audience is possibly mainly business stakeholders
  (the rationale being that web developers need to persuade business stakeholders
  before they can make improvements to their website).
* **Works on multiple browsers and is not Chrome-focused**. developer.chrome.com
  is usually a better fit for Chrome-focused content. The main exception to this
  rule are initiatives that may currently be perceived as Chrome-focused (due to
  lack of support in other browsers) but which Google believes to be
  strategically critical for the long-term success of the web as platform (such
  as the [Capabilities](/fugu-status) APIs and the Privacy Sandbox initiative).
* **Not geared towards beginners**. If the proposed content is targeted at
  beginner web developers, and this content has already been covered elsewhere,
  we shouldn't duplicate it on web.dev. It's OK to discuss beginner ideas if the
  author is covering a topic from the ground-up that hasn't been covered on other
  sites yet.
* **Not [reference] documentation**. MDN is the web platform's de facto
  reference documentation site. API reference content should go on MDN, not web.dev.
  One exception is when web.dev is the authoritative location for content
  on a topic and we need to provide reference information related to that topic.
  For example, [Largest Contentful Paint](/lcp) contains reference information
  about how that metric is scored, what elements it applies to, etc.
* **Is not duplicated content**. We should not duplicate content that
  is already covered on other sites. We already have hundreds of pages of
  documentation and it is difficult to keep them all up-to-date.
* **Is actionable**. We prefer [tutorials](https://documentation.divio.com/tutorials/)
  and [how-to guides](https://documentation.divio.com/how-to-guides/).

If the proposal does not meet the acceptance criteria, reply to the automated
email telling the submitter that the content does not appear to meet our
acceptance criteria. It's rare for us to receive proposals that obviously aren't
appropriate for web.dev. It's more common for the proposal to be somewhat
problematic but potentially publishable after substantial updates. Here are common
ways to handle that situation:

* Work with the author to rework the content so that it aligns with the
  acceptance criteria. You'll need to weigh the importance of this content
  against the work required to get it to a publishable state.
* Bring more stakeholders into the automated email to get more perspective.
* Ask to revisit the proposal at a later date.

### Tracking work {: #tracking }

As mentioned earlier, when the proposal is submitted, the automated script also
creates a GitHub issue. If you've accepted the proposal for publication on
web.dev, then add this issue to the [*Content* project board][project]. If the
proposal is not accepted for one reason or another, close the issue.

### Prioritization criteria {: #prioritization }

Add the `P0`, `P1`, and `P2` labels to tracking issues
to indicate priority. `P0` is top priority, `P1` is normal
priority, and `P2` is low priority.

Unfortunately there is no perfect decision matrix for determining priority.
The following considerations can help determine priority:

* The content has an upcoming hard deadline. One situation to (gently) pushback on,
  however, is when a proposal is submitted at the last minute when the
  proposal submitter presumably has known about the need for the content
  for a long time.
* The content is related to a [top priority area][priorities].
* The proposal submitter gave us a generous amount of notice on when they need
  to publish something. A month or more is a "generous" amount. In this scenario we
  should pay back their courteousness and make sure we help them publish on
  time.
* The content is extremely well-aligned with web.dev's goals
  (see [Acceptance criteria](#criteria)) or has high potential impact.
  A guide for a new Lighthouse audit related to Web Vitals is an example
  of content that is very aligned with our goals and has high impact because
  it's actionable, is related to a top priority area (as of Q1 2021), etc.

## Checklists {: #checklists }

### Proposal review checklist {: #proposal-checklist }

* Make sure that someone has submitted `go/chrome-devrel-content-proposal`
  before reviewing any content.
* Reply to the automated email within 1 business day, even if it's just to let
  the proposal submitter know that you can't review the proposal until a later date.
* Check the list of people that have been CC'd in the automated email. Is there
  anyone that doesn't need to be on the email thread? Is there anyone missing?
* Use the [acceptance criteria](#criteria) to determine whether the content
  is well-suited for web.dev.
* If the content does not meet the acceptance criteria, communicate the issues
  by replying to the automated email. You can link to the acceptance criteria
  section as rationale. You can either work with the author to rework the
  content so that it meets the criteria, bring more people into the discussion
  for further perspective, ask to postpone the content until a later date,
  or tell the author that the content is not aligned to web.dev's goals (if
  it's clearly outside the scope of the site).

### Work tracking checklist {: #tracking-checklist }

Do the following after accepting a proposal:

* Add the tracking issue (listed at the bottom of the automated email) to the
  [*Content* project board][project].
* Assign a [priority](#prioritization) to the tracking issue.
* Set the **assignee** of the tracking issue to the person on the Chrome DevRel
  content team who will be reviewing the content.

[issue]: https://github.com/GoogleChrome/web.dev/issues/new?assignees=kaycebasques&labels=new+content&template=propose-new-content.md&title=content%3A+TODO
[project]: https://github.com/GoogleChrome/web.dev/projects/23
[spreadsheet]: https://docs.google.com/spreadsheets/d/1plMunpJHlQZuEJDRRTBmpC3UQef5dXFN5i6Ux4utR_I/edit#gid=1251362433
[reference]: https://documentation.divio.com/reference/
[priorities]: https://docs.google.com/document/d/1hpg3o5k-SWOaROKZt0qEi-LtKcDByXr9yDYNT5foGEk/edit?resourcekey=0-LQ3W5lm-aZcalWhd-qlPFg#