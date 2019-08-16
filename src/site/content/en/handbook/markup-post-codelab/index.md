---
layout: handbook
title: Posts and codelabs
date: 2019-06-26
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

## Set up the YAML
The YAML fields at the start of each piece of web.dev content define how the piece should display.
* `layout`: The layout for your piece. Possible values:
  * `post`
  * `codelab`
* `title`: The title for your piece.
* `subhead`: The subtitle for your piece. Only required for posts.
* `authors`: The [slug(s)](/handbook/contributor-profile) for the author(s) of the piece.
* `date`: The publication date.
* `hero`: The filename of the hero image, which appears full-bleed above the title. Optional.
* `hero_position`: The position of the hero image. Optional. Possible values:
  * `center` (default)
  * `top`
  * `bottom`
* `thumbnail`: The filename of the thumbnail image, which appears when the post is displayed on the blog or homepage. Optional.
* `alt`: The [alt text](/image-alt) for the hero image. Required if `hero` is present.
* `description`: Content for the `description` `<meta>` tag.
* `tags`: Tags for the site search. The `post` tag is required for a post to appear on the blog.

Codelabs have two additional fields:
* `glitch`: The name of the glitch to be presented in the right pane.
* `related_post`: The slug for the post associated with your codelab. (This is what makes breadcrumbs work.)

Finally, if you don't want your post to be published as soon as it's done, add the `draft: true` flag to the YAML. (When it's time for the post to go live, the web.dev team will remove the `draft` flag.)

## Authoring tips
Use relative URLs to link to other posts and codelabs on web.dev.

{% Compare 'worse', "Don't" %}
`https://web.dev/some-article`
{% endCompare %}

{% Compare 'better', 'Do' %}
`/some-article`
{% endCompare %}

Use relative URLs to link to assets for the post or codelab.

{% Compare 'worse', "Don't" %}
`https://web.dev/some-article/image.png`
{% endCompare %}

{% Compare 'better', 'Do' %}
`./image.png`
{% endCompare %}

## Preview your content
Use the `npm run dev` command to start a local web server and watch for changes.
