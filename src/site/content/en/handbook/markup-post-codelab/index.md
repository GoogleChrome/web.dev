---
layout: handbook
title: Posts and codelabs
date: 2019-06-26
updated: 2020-06-29
description: |
  Learn how to create the Markdown for posts and codelabs on web.dev.
---

This post is about how to set up a new post or codelab so it works correctly on web.dev. For guidelines about what to put _in_ your post, see the [Content guidelines](/handbook/#content-guidelines) section.

## Get started
1. Create a new branch of the web.dev repository.
1. Depending on what you're writing, copy the post template directory (`_template-post`) or the codelab template directory (`_template-codelab`) in `src/site/_drafts` to the appropriate location:
    * Codelabs and posts that will live in a collection go in `src/site/content/en/<YOUR_LEARNING_PATH>`
    * Posts that will live only on the blog go in `src/site/content/en/blog`
1. Rename the template directory to match the content of your piece.
    * The folder name will become the URL for your piece, so it should be all lowercase, and words should be separated by hyphens.
    * Keep the name as short as possible while still being meaningful.
    * Codelabs always start with the `codelab-*` prefix. Example:
      ```text
      secure/
      ├── codelab-same-origin-fetch/
      │   └── index.md
      ```

## Add front matter

See [YAML front matter](/handbook/yaml-front-matter).

## Authoring tips
Use relative URLs to link to other posts and codelabs on web.dev.

{% Compare 'worse' %}
`https://web.dev/some-article`
{% endCompare %}

{% Compare 'better' %}
`/some-article`
{% endCompare %}

Use relative URLs to link to assets for the post or codelab.

{% Compare 'worse' %}
`https://web.dev/some-article/image.png`
{% endCompare %}

{% Compare 'better' %}
`./image.png`
{% endCompare %}

## Preview your content
Use the `npm run dev` command to start a local web server and watch for changes.
