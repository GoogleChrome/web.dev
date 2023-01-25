---
layout: handbook
title: Quick start guide
date: 2020-02-11
description: |
  How to create and publish content on web.dev.
---

Content creation for web.dev has three phases: planning, writing, and publishing.

## Planning

1. If you're a Googler or have access to a Googler, use the [content proposal form][form] to submit
   your new content request. If you don't have access to a Googler, use the
   [content issue template](https://github.com/googlechrome/web.dev/issues/new?template=content.md).
1. The web.dev team will take a look to see if the idea fits with the goals of the site. If the idea is approved, it gets slated for a publication date!

{% Aside 'caution' %}
If the piece you'd like to publish is time sensitive, make sure to submit the issue at least **one month** before the target publication date so there's enough time to move it through the writing process.
{% endAside %}

## Writing

1. Read the [Content guidelines](/handbook/#content-guidelines) to understand how to create high-quality
   content. The higher the quality of your content, the less time and energy you'll have to spend
   incorporating feedback.
1. **After your content proposal is approved**, create a copy of the
   [web.dev content template][template] to draft your content.
1. Self-review your content with the [web.dev content checklist](/handbook/content-checklist) to find and fix
   common problems. The more of these problems you fix yourself, the faster your review will go.
1. When your first draft is ready, leave a comment in your GitHub issue and ask for a review.

## Publishing

1. After you get approval from a web.dev team member that your content can be published on the site,
   submit a GitHub pull request.
1. Check out the [web.dev markup section](/handbook/#web.dev-markup) to learn how to make your markdown squeaky clean.
   In particular, check out the [web.dev components](/handbook/web-dev-components/) guide
   to discover UI elements that can make your content more engaging or aesthetically pleasing.
1. Once your PR is merged, the content will be deployed to the site immediately.

## Organizing content

### Collections (learning paths)

Posts in collections in the *Learn* section are organized thematically within *learning paths*.
Each collection is defined in the `site/_data/paths` directory as a `json` object.

1. To add a new collection, add a `<collection_name>.json` file to the `site/_data/paths` directory.

1. In the collection's `.json` file, define fields like *title*, *description*, *overview* and *topic titles* as i18n paths, to allow their translation into many languages (e.g. `i18n.paths.newpathname.title`).

1. Add the content of these fields to the `site/_data/i18n/paths` directory (under `en` key).
If applicable, launch translation process for this content by emailing web.dev@.

### Tags

Tags are used to categorize articles and also to generate [web.dev/tags](/tags/) pages.
The canonical list of tags is published in [tagsData.json](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/tagsData.json) on Github.

- to add a new tag, add it first to `tagsData.json`
- to use an existing tag, add it to your article's `fromtmatter`:
```bash
tags:
  - accessibility
```

{% Aside %}
  Googlers: Check out [web.dev process](https://docs.google.com/document/d/1Vxgrgxtz4OeJcrYJF5lpK9bVhTcGpXOXeeL4GZCV8KY)
  for more detailed information about web.dev's content process.
{% endAside %}

[form]: https://docs.google.com/forms/d/e/1FAIpQLSdYePZbDZ9Idi4MKL0cbqTuUHfPU7ZZJNnV9hDzjc0e1c2UXw/viewform?fbzx=7994504531518856644
[template]: https://docs.google.com/document/d/1lgaNIEnXZf-RB8_p9RK22QEgpXJqnu77pLWVWVy4nuw/edit?usp=sharing
