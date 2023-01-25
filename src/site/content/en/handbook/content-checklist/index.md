---
layout: handbook
title: web.dev content review checklists
date: 2019-06-26
updated: 2021-01-25
description: |
  The official checklists for web.dev content reviews.
---

This page contains the official checklists that all web.dev editors are expected to use
when reviewing new content. Authors are encouraged to use these checklists to
self-review their writing and fix problems proactively, rather than waiting for
an editor to catch them.

The review process has two parts. The goal of the [early stage review checklist](#early)
is to make sure the content is useful to web.dev's target audience. The goal of the
[late-stage review checklist](#late) is to make sure the content is professional
and "plays nicely" with the rest of the web.dev codebase (e.g. not using a URL
that we'll want to use for other purposes).

## Early stage review checklist {: #early }

### The content aligns with web.dev's main audience {: #audience }

web.dev's mission is to help web developers build excellent websites.
All content on web.dev should help web developers in one way or another.
If the content does not seem helpful for web developers, or
the content seems to be primarily written for an audience other than
web developers, it's probably not a good fit for web.dev.

### The guidance is usable {: #usable }

If the content provides step-by-step instructions on completing a task, make sure
that someone (other than the author) has actually followed the instructions and
was able to complete the task successfully. The editor can do this themselves or
ask the author to find someone else to do a usability review.

See [Usability reviews](/handbook/reviews/#usability) for instructions.

### The content is a tutorial, how-to guide, or explainer {: #content-types }

There are four common types of software documentation: tutorials, how-to guides,
explainers, and references. Check out [Divio's Documentation System][divio] for an
explanation of these content types.

Each page of web.dev content should be focused around one of these content types
as much as possible. For example, a single page of content should not try to be a
tutorial and an explainer.

Reference documentation pages are not allowed on web.dev.

### The content is unique {: #unique }

After reading through the content, use a search engine to search for similar
content (from any reputable source, such as MDN or CSS-Tricks). If the proposed
web.dev content largely duplicates another source's content, ask the author why
it's necessary to duplicate the content.

{% Aside %}
  Rationale: every page of new content has a maintenance cost. We have to review every
  page once or twice a year to make sure that its guidance is still accurate.
{% endAside %}

### The content is focused on a main idea {: #focused }

Each page of content should have a main idea. All text, images, videos,
code samples, etc. should be related to the page's main idea.

### The content provides a path for getting background knowledge {: #prereqs }

Think about the background knowledge that's required to understand the
content you're reviewing. The content should provide a well-lit path
for gaining that background knowledge.

Here are the common strategies for helping readers gain background knowledge:

* Expand the content to explain the topic in more depth
* Link to other, existing content on the topic

The one exception to this rule is basic web development knowledge. web.dev
assumes that its readers understand the basics of CSS, HTML, and JavaScript.

### Factual information is verified {: #facts }

Factual claims should be backed by evidence or authoritative sources
as much as possible.

One seemingly small factual claim that has caused trouble
in the past was the browser version associated to an API's release. For
example, a post might claim that an API is launching in Chrome 88, but the
author and reviewer didn't double-check that claim. A lot of web developers
might then see the announcement on web.dev, attempt to try out the API, and get
confused when the API doesn't work as intended (because it's not actually supported in
that version).

### The guidance is aligned with best practices {: #best-practices }

Make a best effort to ensure that the content is aligned with general web
development best practices.

{% Aside %}
  A note from the web.dev content lead: we understand that this is a tall order.
  The author and reviewer are not expected to have complete expertise in every
  aspect of web development. Nonetheless, if you take a moment and ask yourself
  "is this content contradicting any other best practices I know of?" consistently,
  we should be able to catch obvious issues.
{% endAside %}

Here are some strategies for checking if the content is aligned with best practices:

* Run Lighthouse regularly and review all of its recommendations. Check if the content
  you're reviewing contradicts any of Lighthouse's recommendations.
* If the content discusses different aspects of web development (e.g. accessibility and
  performance) and the author is only an expert in one of those aspects (e.g. performance),
  ask a subject matter expert (SME) to do a quick review of the content. Instruct the
  to specifically focus on making sure that the content is aligned with the best
  practices of their area.

Here are some common problems:

* Using outdated Lighthouse metrics. The page should explicitly mention that the
  metric is outdated, and list its recommended replacement.
* The `unload` event is [considered harmful][unload]. The `pagehide` event should be used
  instead.

#### Anti-patterns should be clearly labeled {: #anti-patterns }

Bad web development practices should clearly be labeled as such.
Consider using [caution](/handbook/web-dev-components/#caution-asides)
or [warning](/handbook/web-dev-components/#warning-asides) components.

### Avoid subjective statements like "it's easy" {: #subjective }

Subjective statements like "it's easy" or "the process is simple" can usually be
removed. What might be easy for some might not be easy for others.

### Avoid summaries at the end of the content { #summaries }

The intro of the page should already summarize the content.

### The writing is simple {: #simple }

Use the simplest words available unless there is a specific reason to
use a fancy word.

{% Aside %}
  Rationale: web.dev has an international audience. Many of our readers do not
  speak English as their primary language. Using simple words increases the chances
  that they will be able to understand our content.
{% endAside %}

{% Compare 'worse' %}
  Utilize the Network panel to inspect network activity.
{% endCompare %}
{% Compare 'better' %}
  Use the Network panel to inspect network activity.
  {% CompareCaption %}
    In rare cases the author might have a specific reason to use `utilize` over `use`,
    but in many cases it's not intentional.
  {% endCompareCaption %}
{% endCompare %}

See also [Avoid fancy words](http://www.jlakes.org/ch/web/The-elements-of-style.pdf#page=73).

### The writing is concise {: #concise }

The writing should be as long as needed in order to effectively explain
the main idea of the page, and no longer.

#### All words are necessary {: #redundancy }

Delete redundant words, sentences, paragraphs, sections, and so on.

One exception is when the author intentionally repeats an idea
to make it easier to understand or emphasize its importance.

#### The writing uses the present tense by default {: #present-tense }

Rephrasing a text from the future tense to the present tense usually
removes tens or hundreds of words from a text, without changing the meaning.

{% Compare 'worse' %}
  By default the resources will be listed chronologically. The top resource will usually
  be the main HTML document. The bottom resource will be whatever was requested last.
{% endCompare %}
{% Compare 'better' %}
  By default the resources are listed chronologically. The top resource is usually
  the main HTML document. The bottom resource is whatever was requested last.
  {% CompareCaption %}
    This phrasing has 3 less words yet the meaning is the same.
  {% endCompareCaption %}
{% endCompare %}

The author can use the future tense if they provide a logical rationale
for its need.

### The title is optimized {: #title }

All web.dev titles should include all of the following elements whenever relevant:

* A general description of the use case that the content helps solve
* The exact name of the most relevant API, tool, product, etc.

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
    This title accurately summarizes the page's content and uses all relevant SEO
    keywords (`How to optimize images` and `Thumbor`).
  {% endCompareCaption %}
{% endCompare %}

### The intro clearly summarizes the purpose of the page {: #intro }

Explicitly summarize what "task" you help the user solve in your intro.
The "task" might be something concrete, such as optimizing images, or
something abstract, such as understanding how browsers work. The first
or last sentence of the intro is usually a good place for the summary.
Consider using the [objective](/handbook/web-dev-components/#objective-asides)
component.

Here is a general formula for creating a useful summary:

* Mention the [content type][divio] of the page: tutorial, how-to guide,
  reference, overview, etc. Mentioning the content type gives the reader a
  general idea of what type of content to expect.
* Mention the user-focused task that the page helps solve.

Examples:

* [Extending Workbox](/extending-workbox/)
* [Workers overview](/workers-overview/)
* [Building a Stories component](/building-a-stories-component/)
* [Browser-level lazy-loading for CMSs](/browser-level-lazy-loading-for-cmss/)
* [Measuring offline usage](/measuring-offline-usage/)

Note that some of these examples use the generic term "post" or "article".
They could be improved by replacing "post" or "article" with a more specific
content type keyword, like guide, tutorial, etc.

### The subheading (subtitle) draws the reader in or provides more context {: #subhead }

See [`subhead`: add an enticing subtitle](/handbook/yaml-front-matter/#subhead).

### The content is easy to scan {: #scannable }

Many web.dev readers are in a hurry. All web.dev content should be easy to scan.

#### Section headings are concise and descriptive {: #section-headings }

Each section heading should clearly summarize the content contained within that section.

#### Similar ideas are grouped together {: #grouping }

Scan the sections of the content. Check for sections with similar ideas that
are placed far apart (e.g. one section is at the top of the article, the other
is at the bottom, yet they both discuss related concepts).

Here are some common problems:

* The page concludes with a Frequently Answered Questions (FAQs) section. Check
  if the FAQs can be contextually discussed within a main section of the content.
  See also [FAQs are a code smell](https://kayce.basqu.es/blog/FAQs/).

### The paragraphs are effective {: #paragraphs }

Each paragraph should be focused around one idea. The first sentence
summarizes the main idea of the sentence. The following sentences provide
supporting details of the main idea. The last sentence concludes the idea
or transitions to a new idea. See [Writing Effective Paragraphs][paragraphs].

### Complex ideas are explained effectively {: #effective }

While reading a page, notice if you have to stop and re-read a section
multiple times before you understand what it's saying. Check if any of
the following strategies can be used to explain the idea more effectively:

* Images and videos
* Examples

### Browser compatibility is mentioned near the start of the content {: #compatibility }

When content is focused around specific web platform features or APIs,
make sure that the browser compatibility of the APIs is specifically mentioned. This is
especially important if the features/APIs aren't supported in all browsers,
but it should also be done even if the features/APIs are supported in all browsers.

Examples:

* [CSS masking](/css-masking/#browser-compatibility)
* [`content-visibility`](/content-visibility/#support)

{% Aside %}
  Rationale: We know from the [MDN Developer Needs Assessment 2019
  Report](https://mdn-web-dna.s3-us-west-2.amazonaws.com/MDN-Web-DNA-Report-2019.pdf#page=20)
  that browser compatibility is a top concern (items 1, 3, 4, 5). Non-public Google research
  has corroborated these findings. Therefore, if a feature/API is not well supported, we
  must respect the user's time and make that fact known upfront. And if the API is
  well supported, then it is reasonable to assume that explicitly mentioning that fact
  will make the feature/API more attractive.
{% endAside %}

### References to APIs link to relevant MDN documentation {: #api-references }

When referencing a specific web platform API, link to the MDN reference documentation
page for that API.

{% Compare 'worse' %}
  Cache-Control. The server can return a `Cache-Control` directive to specify
  how, and for how long, the browser and other intermediate caches should
  cache the individual response.
{% endCompare %}
{% Compare 'better' %}
  [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control).
  The server can return a `Cache-Control` directive to specify how, and for how long,
  the browser and other intermediate caches should cache the individual response.
{% endCompare %}

### Code samples are minimal, complete, and reproducible {: #code-samples }

Any code that is not directly relevant or necessary
for understanding the main idea of the code sample should be deleted.

See also [How to create a minimal, reproducible example](https://stackoverflow.com/help/minimal-reproducible-example).

### Links are useful {: #useful-links }

For each link that the author provides, look out for:

* A mismatch between the link text and the content of the link. For example, suppose
  that the link text is `service worker tutorial` but the content of the link is
  actually an API reference documentation page.
* Content that does not actually help the reader.

### The content references specific versions of browsers, not release channels {: #browser-versions }

The release channels of major browsers are not stable over time.
For example, currently `Google Chrome Stable` refers to version 85
of the browser. In a year, `Google Chrome Stable` will refer to version 95.

{% Compare 'worse' %}
  The Keyboard API is now available in Chrome Canary.
{% endCompare %}
{% Compare 'better' %}
  The Keyboard API is now available in Chrome 85 and later.
{% endCompare %}

### Other people's products are used as intended {: #intended-use }

If the content mentions or features other people's products, said products
are to be used as intended. For example, an article should not advise
to flash a "homebrew" firmware onto a commercial device, unless this is
explicitly blessed by the manufacturer.

### Use examples liberally {: #examples }

Provide more examples if a concept is unclear.

### Get permission before mentioning other companies, products, etc. {: #permission }

Don't mention other companies, products, services, etc. without
that entity's permission. You can ask the content lead to make exceptions
to this rule, which will be done on a case-by-case basis.

### Avoid insensitive words {: #insensitive-words }

Refer to the [GDDSG word list][wordlist] and make sure that you're not using
any insensitive words, such as:

* [blacklist](https://developers.google.com/style/word-list#blacklist)
* [whitelist](https://developers.google.com/style/word-list#whitelist)
* [native](https://developers.google.com/style/word-list#native)
* [grandfathered](https://developers.google.com/style/word-list#grandfathered)
* [hang](https://developers.google.com/style/word-list#hang)
* [master](https://developers.google.com/style/word-list#master)
* [slave](https://developers.google.com/style/word-list#slave)

## Late-stage review checklist {: #late }

### Titles and section headings are sentence case {: #sentence-case }

Follow the Google Developer Documentation Style Guide's guidance on
[titles and headings](https://developers.google.com/style/headings).

### The URL mostly matches the title and is not overly general {: #url }

The URL of a page of content should mostly match the title of that page of content
to avoid confusion.

The URL of a page should not be overly general, unless that page is our
authoritative content on that topic. For example, the URL of
[Introducing `<model-viewer>` 1.1](/introducing-model-viewer/)
is `https://web.dev/introducing-model-viewer/` because we wanted to reserve
`https://web.dev/model-viewer/` for our authoritative guide on that topic.

### The page uses components when relevant {: #components }

Review [web.dev's UI components](/handbook/web-dev-components/) and check if the
presentation of any of the content can be enhanced by the components.

### The hero image's thumbnail looks good {: #thumbnail }

If the page is going to be on the blog and has a hero image, go to the blog index page
(e.g. `http://localhost:8080/blog` if you're reviewing the content locally)
and make sure that the thumbnail version of the hero image looks good and is not
cropped in a weird way. Use a [thumbnail](/yaml-front-matter/#thumbnail) if necessary.

### All images have descriptive `alt` text {: #alt }

Review the Markdown and make sure that each image has descriptive
[alt text](/image-alt). Put yourself in the shoes of people who can't see
those images. Is there any critical information embedded in the images that
isn't covered anywhere else in the content?

### All images are optimized and sized correctly {: #images }

Content images and thumbnails should be optimized with a service like
[TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app). Hero
images do not need to be optimized.

All images should be sized correctly:

* Hero images should be 3200 pixels wide by 960 pixels tall.
* Thumbnail images should be 376 pixels wide by 240 pixels tall.
* Content images should be no wider than 1600 pixels.

{% Aside %}
  Every unoptimized or incorrectly sized image that we commit to the repository
  adds to the repository's overall size. This makes the repository slower-to-download
  for new contributors and for our continuous integration systems.
{% endAside %}

### All words are spelled correctly {: #spelling }

Follow the Google Developer Documentation Style Guide's guidance on [spelling][spelling].

### The most important lines of code in a code block are highlighted {: #code-highlighting }

[Code highlighting](/handbook/markup-code/#code-highlighting) should be used to indicate
lines that have been added or changed.

### GIFs have been converted to animated videos {: #gifs }

All GIFs should be converted to animated videos to improve performance. See
[Replace animated GIFs with videos](/replace-gifs-with-videos/)
and [Videos hosted on web.dev](/handbook/markup-media/#video-hosted-on-web.dev)

[divio]: https://documentation.divio.com/introduction/#the-secret
[unload]: https://developers.google.com/web/updates/2018/07/page-lifecycle-api#the-unload-event
[paragraphs]: https://www.riosalado.edu/web/oer/WRKDEV100-20012_INTER_0000_v1/lessons/Mod02_WritingEffectiveParagraphs.shtml
[spelling]: https://developers.google.com/style/spelling
[divio]: https://documentation.divio.com/introduction/#the-secret
[guide]: https://documentation.divio.com/how-to-guides/#how-to
[explanation]: https://documentation.divio.com/explanation/#explanation
[tutorial]: https://documentation.divio.com/tutorials/#tutorials
[wordlist]: https://developers.google.com/style/word-list
