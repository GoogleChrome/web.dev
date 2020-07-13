---
layout: handbook
title: Content review guidelines
date: 2020-07-13
description: >
  Guidelines that help web.dev content authors and reviewers align their expectations
  about what's in-scope and out-of-scope for any given content review.
---

This guide is intended for web.dev content authors and reviewers. The purpose of this guide
is to help authors and reviewers align their expectations about what's in-scope and out-of-scope
for any given content review.

## Usability reviews {: #usability }

{% Aside 'objective' %}
  The purpose of a usability review is to gain confidence that users can actually
  accomplish tasks based on the guidance that we've provided.
{% endAside %}

**What kinds of content should get usability reviews?** Any content that
takes you from point A to point B should get a usability review. Examples:

* Codelabs like [Configure HTTP caching behavior](/codelab-http-cache/)
* Tooling guides like [Replace animated GIFs with video](/replace-gifs-with-videos/)
* API guides like [Getting started with Trust Tokens](/trust-tokens/)

**Who can conduct usability reviews?** In general, anyone who approximately matches
the skill level of your target audience is a good candidate for a usability reviewer.
For example, if your guide assumes basic knowledge of service workers, a good usability
reviewer would be someone who has implemented a basic service worker in the past.
Someone significantly below your target skill level may not be able to follow along
with the guidance. Someone significantly above your target skill level may miss problems
that your target audience is going to get stuck on due to the 
[curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge). However, if
you can't find someone representative of your target audience, getting a usability review
from an expert is always better than not getting any usability reviews at all.

**What should the usability reviewer focus on?** The reviewer should do a hands-on
verification of the guidance. In other words, they should make sure that they can actually
complete the task with the guidance that has been provided. Continuing with the examples from
earlier:

* For the [Configure HTTP caching behavior](/codelab-http-cache/) codelab, the usability reviewer
  should use the incomplete website that's provided and verify that they can use the instructions
  to create a complete website that exactly matches the end state of the codelab
* For the [Replace animated GIFs with video](/replace-gifs-with-videos/) tooling guide,
  the usability reviewer should use the tool in one of their own projects and verify that
  the tool actually provides benefit (in this case, the video files that are produced 
  should be smaller than the animated GIF files)
* For the [Getting started with Trust Tokens](/trust-tokens/) API guide, the usability reviewer
  should use the guidance to implement the API in one of their own projects

**The most valuable feedback that the usability reviewer can provide is detailed descriptions
of where they got stuck and what was confusing.**

<!--

TODO(kayce): Mention that if you're having a hard time, just talk to a writer

Examples of typical review processes?

## Best practices

### List stakeholders

### Think about the order of stakeholder reviews

Reviews from some types of stakeholders should generally come before reviews
from other types of stakeholders. For example, suppose that you get a
[legal review](#legal) before a [technical review](#technical). The lawyer signs
off on the content and says "LGTM so as long as the content is published exactly as is."
During the technical review your subject matter expert finds
significant flaws with the content and you have to rewrite a significant portion of
the content. You now need to go back to the lawyer and get approval again for the new
content.

TODO(kayce): List other common examples

### Be specific about what type of review you need from each stakeholder

## Review categories {: #categories }

This is a general list of the categories of reviews that content sometimes goes through.
**Not all web.dev content needs to go through all of these reviews.**
If you ask a web.dev review "can you review this?" without providing further instructions,
they will probably point you to this section and ask you to clarify what kind of review you
need. 

Does calling out order make sense? It may be too variable. 

### Technical review {: #technical }

The goal of a technical review is to ensure that your content is technically accurate.
A technical review must be conducted by a subject matter expert (SME), such as the
software engineer that implemented the API that you're writing about.

Google Doc is good for new material, but not good for rewrites of existing material
(e.g. diff feature would be useful)

### Usability review {: #usability }

All content has a purpose. We can always ensure that the purpose is met

The goal of a usability review is to ensure that readers can actually accomplish a
task or understand a topic based on the content that you've written. A usability review
can be conducted by anyone is a reasonable approximation of your target audience. For best
results, get usability reviews from people who are slightly below the skill level of your
target audience. These people usually help you discover unspoken assumptions in your content.
Clarifying these unspoken assumptions make your content easier for everyone.

### Structural review {: #structural }

The goals of a structural review are to ensure that:

* Your content matches the target audience of the site
* The general flow of your ideas is logical 
  (i.e. later sections build on the ideas that you explained in earlier sections)

A structural review is usually conducted by a technical writer but it can theoretically
be conducted by anyone who is considered an excellent writer.

Product managers usually have strong opinions about narrative, presentation, etc.

#### Legal reviews {: #legal }

The goal of a legal review is to ensure that you're not saying that will get your company
into legal trouble. The legal review must be conducted by a lawyer.

Usually you want everything totally nailed down before doing a legal review

### PR reviews

### Copyedit reviews

Ideal location of review: Google Doc

What to check for:

* Grammar
* Mechanics
* Usage

### Proofread reviews

### Documentation source code review

Ideal location of review: GitHub PR

What to check for:

* UI elements are formatted correctly
* Making use of site UI components

-->
