---
layout: handbook
title: Quick start guide
date: 2020-02-11
updated: 2022-07-11
description: |
  How to create and publish content on web.dev and developer.chrome.com.
---

Content creation for web.dev and developer.chrome.com has four phases: planning, writing, reviewing, and publishing. 
Most of the following information is relevant to both sites.

All content goes through our editorial process. Unless you are working on part of an already approved set of content, 
do not submit PRs for new content without following these instructions.

## Planning

1. Decide if you want your post on [web.dev](/) or [developer.chrome.com](https://developer.chrome.com). [More about the right site for your post](/handbook/writing-blog-posts#which-site).
1. If you're a Googler or have access to a Googler, use the [content proposal form][form] to submit
   your new content request. If you don't have access to a Googler, use the content issue template for
   [web.dev](https://github.com/GoogleChrome/web.dev/issues/new?template=propose-new-content.md) or [developer.chrome.com](https://github.com/GoogleChrome/developer.chrome.com/issues/new?assignees=rachelandrew&labels=new+content&template=propose-new-content.md&title=content%3A+TODO).
1. The team will evaluate the proposal's suitability for the goals of the relevant site. If the idea is approved, it will be assigned a reviewer.

{% Aside 'caution' %}
If the piece you'd like to publish is time sensitive, make sure to submit the issue at least **one month** before the target publication date so there's enough time to move it through the writing process.
{% endAside %}

## Writing

1. Read the [Content guidelines](/handbook/#content-guidelines) to understand how to create high-quality
   content. The higher the quality of your content, the less time and energy you'll have to spend
   incorporating feedback.
1. [How to write blog posts for web.dev and developer.chrome.com](/handbook/writing-blog-posts) has an overview of our process and tips for writing great blog posts.
1. **After your content proposal is approved**, create a copy of the
   [content template][template] to draft your content.
1. Review your content with the [content checklist](/handbook/content-checklist) to find and fix
   common problems. The more of these problems you fix yourself, the faster your review will go.
1. When your first draft is ready, leave a comment in your GitHub issue and ask for a review.

## Reviewing

Your content will be edited and reviewed in Google docs, this will include:

1. **Technical review** to check that the content is accurate.
1. **Copy edit:** to check that the content meets our style guides and is free from typos and grammar errors.

## Publishing

1. After you get approval from a web.dev team member that your content can be published on the site,
   submit a GitHub pull request.
1. Make no changes to the approved copy when creating your PR. 
1. Check out the [web.dev markup section](/handbook/#web.dev-markup) to learn how to make your markdown squeaky clean.
   In particular, check out the [web.dev components](/handbook/web-dev-components/) or 
   [developer.chrome.com components](https://developer.chrome.com/docs/handbook/components/) guide
   to discover UI elements that can make your content more engaging or aesthetically pleasing.
1. Once your PR is merged, the content will be deployed to the site immediately, and appear live after around an hour.

## Organizing content

Check with your assigned technical writer before creating new collections or tags.

### Collections (learning paths)

Posts in collections in the *Learn* section are organized thematically within *learning paths*.
Each collection is defined in the `site/_data/paths` directory as a `json` object.

1. To add a new collection, add a `<collection_name>.json` file to the `site/_data/paths` directory.

1. In the collection's `.json` file, define fields like *title*, *description*, *overview* and *topic titles* as i18n paths, to allow their translation into many languages (e.g. `i18n.paths.newpathname.title`).

1. Add the content of these fields to the `site/_data/i18n/paths` directory (under `en` key).
If applicable, launch translation process for this content by emailing web.dev@.

### Tags

Tags are used to categorize articles and also to generate [web.dev/tags](/tags/) pages.
The canonical list of tags is published in [tags.yml](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/i18n/tags.yml) on GitHub.

- to add a new tag, add it first to `tags.yml`
- to use an existing tag, add it to your article's `frontmatter`:
```bash
tags:
  - accessibility
```

[form]: https://docs.google.com/forms/d/e/1FAIpQLSc65CDClpUu7R2ECacLz3B1a6hOCWdFAk2vkWXIbZjzNSXq_Q/viewform?resourcekey=0-t3rJNkt5V2-iE2N42KhrhQ
[template]: https://docs.google.com/document/d/1lgaNIEnXZf-RB8_p9RK22QEgpXJqnu77pLWVWVy4nuw/edit?usp=sharing
