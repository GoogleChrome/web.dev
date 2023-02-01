---
title: Example course
authors:
  - cariefisher
description: This page is used for visual testing of the courses layout and also showcases its capabilities
date: 2023-01-17
---

## Welcome to the example course

The courses layout supports the full range of markdown elements/blocks as demonstrated in
the [example post](/handbook/content-types/example-post).

You can also add assessments as follows:

{% Assessment 'example' %}

## Adding courses

Adding courses involves the following:

- Add a new directory to `/src/site/content/en/learn`
- Add an index.md file. You can copy this one from `src/site/content/en/handbook/content-types/example-course/index.md` as a starting point
- Add a data file named using the following convention: `{dir_name}.11tydata.js`
- Use the `course11tydata` util to generate the required data. You can use the following file as a starting point `src/site/content/en/handbook/content-types/example-course/example-course.11tydata.js`
- Create a new directory under `src/site/_data/courses` using the name passed to the `course11tydata` util.
- Add two files, `meta.yml` and `toc.yml`.
- Add course sections as subdirectories
- Add the section urls to `toc.yml` and the sidebar will be generated automatically.

Here's what you'll learn:

{% include 'partials/course-index.njk' %}
