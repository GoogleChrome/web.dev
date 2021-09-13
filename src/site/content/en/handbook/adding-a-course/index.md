---
layout: handbook
title: Adding a course
date: 2021-08-11
description: |
  Learn how to add a new course to the site.
---

## Required files

To add a new course you will need to create the following files:

- `src/site/_data/i18n/courses.yml`
- `src/site/_data/courses/forms/meta.yml`
- `src/site/_data/courses/forms/toc.yml`
- `src/site/content/en/learn/forms/example/index.md`
- `src/site/content/en/learn/forms/forms.11tydata.js`
- `src/site/content/en/learn/forms/index.md`

You can refer to [the #5964 pull request](https://github.com/GoogleChrome/web.dev/pull/5964) as an example.

### Course Layout

A course is a series of articles that may have a nested tree structure.
A simple, linear course could look like:

```yaml
# toc.yml
- url: /learn/css
- url: /learn/css/zalgo
- url: /learn/css/clearfix
```

However, it's also possible to create nested sections:

```yaml
# toc.yml
- url: /learn/css
- title: i18n.courses.learn.esoterica
  sections:
  - url: /learn/css/zalgo
  - url: /learn/css/clearfix
  - title: i18n.courses.learn.even_more_estoerica
    sections:
    - url: /learn/css/highest_zindex_you_can_imagine
```

A course with nested sections will still order each page linearly.
When they complete a section, they'll be prompted to move to the next section in the order it appears in the `toc.yml` (regardless of nesting level).
