---
layout: handbook
title: Pull request guidelines
date: 2020-07-15
description: >
  Guidelines for the web.dev teammates who review and merge content pull requests.
---

This guide is intended for the web.dev teammates who review and merge content
pull requests (PRs). These guidelines only apply to PRs that add or update
content. They do not apply to engineering PRs. The purpose of this guide is
to avoid duplication of reviewer effort and to ensure that each reviewer is
properly labeling each PR for our automated reporting systems.

## Claim a PR

Use GitHub's **Assignees** field to indicate to the other PR reviewers
that you are reviewing the PR.

### Claim an inactive PR

If a reviewer claims a PR but is inactive on the PR for 3 business days, any other reviewer
can reclaim the PR. The new reviewer should unassign the old reviewer and reassign
themselves.

## Properly label the PR

### New content

Make sure that there's a comment in the PR that uses GitHub's
[issue closing keyword][keyword]. In other words, there should be a comment
along the lines of `Fixes #45`, where `#45` is the tracking issue for the new content.

If the PR for the new content doesn't have a tracking issue, contact the web.dev
content lead.

### Content updates

Add the `content update` label to the PR.

Add **one** of the following labels to the PR:

* `performance`
* `frontend`
* `privacy/security`
* `capabilities`
* `pwa`

Contact the web.dev content lead if you don't know what label to use.

## Don't merge the PR until you're 100% certain that it's OK to merge

Once a PR is merged, the new or updated content is deployed to the site
within minutes. When in doubt, get an explicit confirmation of the publication
date from the author.

[keyword]: https://docs.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords#closing-an-issue-in-the-same-repository
