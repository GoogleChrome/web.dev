---
layout: handbook
title: YAML front matter
subhead: |
  Everything you need to know about all of web.dev's supported YAML front matter properties.
date: 2020-07-23
updated: 2020-08-06
description: |
  Everything you need to know about all of web.dev's supported YAML front matter properties.
---

## Examples

### Posts

### Codelabs

## `alt`: describe the hero image for screen readers {: #alt }

* `alt`: The [alt text](/image-alt) for the hero image. Required if `hero` is present.

## `authors`: increase awareness of who wrote the content {: #authors }

[slug(s)](/handbook/authors-profile)

## `codelabs`: increase awareness of related codelabs {: #codelabs }

* `codelabs`: The slug(s) for the codelabs, if any, associated with the post.
  All indicated codelabs appear in a callout at the end of the post.

## `date`: indicate when the content was originally created {: #date }

```yaml
---
…
date: 2010-06-18
…
---
```

The `date` value should be in `YYYY-MM-DD` format.
This value should never change once the content is published.
Use the [`updated`](#updated) field to indicate content updates.

The `date` value is presented in human-readable format beneath the page title.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="date-updated.jpg"
       alt="The date field shows up under the title.">
  <figcaption>
    This page was originally published on <code>Jun 18, 2010</code>.
  </figcaption>
</figure>

## `description`: summarize the page for search engines {: #description }

```yaml
---
…
description: This is the paragraph that shows up in search engine result pages.
…
---
```

<!-- 160 characters https://moz.com/learn/seo/meta-description -->

## `draft`: TODO {: #draft }

Finally, if you don't want your post to be published as soon as it's done, add the `draft: true` flag to the YAML. (When it's time for the post to go live, the web.dev team will remove the `draft` flag.)

## `glitch`: indicate which Glitch should be presented next to codelab content {: #glitch }

* `glitch`: The name of the glitch to be presented in the right pane.

## `hero`: present a large image before post content {: #hero }

```yaml
---
…
hero: hero.jpg
…
---
```

See [Hero images](/handbook/markup-media/#hero).

## `hero_position`: change the position of the hero image {: #hero-position }

* `hero_position`: The position of the hero image. Optional. Possible values:
  * `center` (default)
  * `top`
  * `bottom`

## `layout`: change the overall layout of your content {: #layout }

```yaml/11-13
---
…
layout: post|codelab
…
---
```

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="post.jpg"
       alt="A screenshot of a page using the post layout.">
  <figcaption>An example of <code>layout: post</code>.</figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="codelab.jpg"
       alt="A screenshot of a page using the codelab layout.">
  <figcaption>An example of <code>layout: codelab</code>.</figcaption>
</figure>

## `related_post`: specify which post is related to a codelab {: #related-post }

* `related_post`: The slug for the post associated with your codelab. (This is what makes breadcrumbs work.)

## `scheduled`: TODO {: #scheduled }

* `scheduled`: Set to `true` to schedule a post for a future date. Posts will deploy at 7am PST / 15:00 UTC. Example: A post with `date: 2050-01-01`, `scheduled: true`, will go live at 7am PST, January 1st, 2050. If you don't use the scheduled flag then setting a future date has no effect. Only use this field on unpublished posts. Doing so on a published post will hide it from the site until the provided `updated` value.

## `subhead`: help readers decide if your content is relevant to them {: #subhead }

```yaml
---
…
subhead: This is the paragraph that shows up in search engine result pages.
…
---
```

## `tags`: increase awareness of related content {: #tags }

```yaml
---
…
tags:
  - performance
  - images
…
---
```

Tags help web.dev users find all of our content related to a topic.
For example, all of our Web Vitals content is available under
the [Web Vitals tags page](/tags/web-vitals/):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="web-vitals.jpg"
       alt="A screenshot of https://web.dev/tags/web-vitals">
</figure>

Tags show up in a few places across the site.
The first three tags of a page are shown on the [blog homepage](/blog):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="blog.jpg" 
       alt="A screenshot of https://web.dev/blog">
  <figcaption class="w-figcaption">
    The human interface devices page is tagged with <code>Capabilities</code> and
    <code>Games</code>, the streaming requests page is tagged with <code>Network</code>
    and <code>Service Worker</code>, and so on.
  </figcaption>
</figure>

A page's full list of tags is shown at the bottom of its main content:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="covid19.jpg" 
       alt="A screenshot of https://web.dev/covid19">
</figure>

### Supported keywords {: #supported-keywords }

Make sure tags added to the page are listed in 
[`tagsData.json`](https://github.com/GoogleChrome/web.dev/blob/master/src/site/_data/tagsData.json).

## `thumbnail`: TODO {: #thumbnail }

```yaml
---
…
thumbnail: thumbnail.jpg
…
---
```

A modified version of the hero image that is displayed on the
[homepage](/) or the [blog homepage](/blog). The thumbnail image
must be substantially similar to the hero image. Changing the proportions,
cropping, or rearranging the hero image's content is OK. Using a completely
different image is not OK.

## `title`: increase SEO with a keyword-rich title {: #title }

```yaml
---
…
title: Referer and Referrer-Policy best practices
…
---
```

## `translation`: TODO {: #translation }


* `translation`: none/machine/manual. Set only if the post is a translation from another, original post.


## `updated`: indicate when technical information changed {: #updated }

```yaml
---
…
updated: 2020-08-05
…
```

* `updated`: The date of the last factual change. This field should not be updated or added for changes that don't add or correct factual information.

<!--

## Set up the YAML












Codelabs have two additional fields:





-->