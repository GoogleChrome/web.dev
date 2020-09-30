---
layout: handbook
title: web.dev content review checklists
date: 2019-06-26
updated: 2020-09-29
description: |
  The official checklists for web.dev content reviews.
---

This page contains the official checklists that all web.dev editors are expected to use
when reviewing new content. Authors are encouraged to use these checklists to
self-review their writing and fix problems proactively, rather than waiting for
an editor to catch them.

## Early stage review checklist {: #early }

### The content is ready for a web.dev editorial review

This is more of a meta point about editing

### The content is useful to web developers {: #useful }

web.dev's mission is to help web developers build excellent websites.
All content on web.dev should help web developers in one way or another.
If the content seems to be **primarily** written for an audience other than
web developers, it's probably not a good fit for web.dev.

### The path for gaining prerequisite knowledge is clear {: #prereqs }

If the content assumes that the reader has prerequisite knowledge

### The technical information is accurate

TODO

### The guidance is aligned with best practices

TODO

Code blocks follow accessibility best practices

### The writing is simple and concise

TODO

### The title follows good SEO practices

All web.dev titles should include all of the following elements whenever relevant:

* A general description of the use case that the content helps solve
* The exact names of the most relevant API, tool, product, etc.

{% Compare 'worse' %}
  Using Thumbor
  {% CompareCaption %}
    If you don't know what Thumbor is, you'll have no idea how this content is relevant for you.
  {% endCompareCaption %}
{% endCompare %}
{% Compare 'worse' %}
  How to optimize images
  {% CompareCaption %}
    Optimizing images is a big topic. This title makes it sound like
    the page will cover all aspects of image optimization. When you open the page
    and discover that it's only explaining how to use one specific tool, you may feel
    like the page misled you.
  {% endCompareCaption %}
{% endCompare %}
{% Compare 'better' %}
  How to optimize images with Thumbor
  {% CompareCaption %}
    This title accurately summarizes the page's content.
  {% endCompareCaption %}
{% endCompare %}

1. Does the title follow good SEO practices? See the example in
   [Explain why a user should care about your content](/handbook/quality/#explanations).

### The subheading draws the reader in or provides more context

See [`subhead`: add an enticing subtitle](/handbook/yaml-front-matter/#subhead).

### The guidance is usable

1. Can you complete the task with the provided instructions? Are there any missing steps? Does the code work?

### The organization of sections is logical

Think of the sections

1. Headings should not [skip levels](/heading-levels).

### Section headings are concise and descriptive

1. Is the structure of the piece clear? Do headings convey the structure?

### The content is focused on a main idea

1. Are any images or videos included that don't directly relate to ideas in the text?

### Each paragraph focuses on one idea

### The content uses examples to clarify complex ideas

### Browser compatibility is mentioned near the start of the content

### References to APIs link to relevant documentation

1. When referencing a web platform API, does the page link out to the canonical MDN API reference?

### Images do not have hardcoded text

### Code samples are as minimal as possible

### Titles and section headings are sentence case

### Links are logical

### Images and videos are used to clarify ideas

Are images and videos used to clarify ideas that would be difficult to understand from text alone?

## Late-stage review checklist {: #late }

### The URL mostly matches the title and is not overly general

### The page uses components when relevant

1. Are common instructions provided using the web.dev [Instruction components](/handbook/web-dev-components/#instruction)?

### The hero image's thumbnail looks good

### All images have alt text

1. Do all images have [alt text](/image-alt)?

### All images are optimized

### All links are valid

### All words are spelled correctly

### All words are capitalized correctly

### The content references specific versions of browsers

1. Articles should mention specific versions of Chrome. They should not mention `Stable`, `Beta`, or `Canary`
   because the Chrome version that's associated with those releases changes over time.

### The most important lines of code in a code block are highlighted

1. Is [code highlighting](/handbook/markup-code/#code-highlighting) used to indicate lines that have been added or changed?

### GIFs have been converted to animated videos

1. All GIFs should be converted to animated videos. See [Replace animated GIFs with videos](/replace-gifs-with-videos/)
   and [Videos hosted on web.dev](/handbook/markup-media/#video-hosted-on-web.dev)

### Images are sized correcly

Hero
Thumbnail
Content

