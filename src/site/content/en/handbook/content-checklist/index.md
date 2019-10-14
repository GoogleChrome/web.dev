---
layout: handbook
title: web.dev content checklist
date: 2019-06-26
updated: 2019-10-10
description: |
  A checklist for web.dev content reviews.
---

Use this checklist to determine if a draft meets web.dev's [content quality guidelines](/handbook/quality/).
Work through the checklist from top to bottom. For example, if a draft has some of the problems listed
in [Basics](#basics), there's not much use in working through the rest of the checklist until those problems are fixed.

The long-term goal of this page is to concretely test **every** quality guideline. It also tests for lower-level issues
that commonly appear in drafts. This page is primarily intended for web.dev reviewers. web.dev authors can also
use it to self-review their content and fix problems rather than waiting for reviewers to highlight them.

## Basics
1. Is the piece providing value for one or more of the web.dev [personas](/handbook/audience)?
1. Do the title, subtitle, and description convey the value proposition?
1. Is the piece 1,000 words or less—or is there a good reason for it to be longer?
1. Are all statements and advice accurate and aligned with best practices?

## Style and voice
1. Is the [voice](/handbook/voice) appropriate for the web.dev audience?
1. Can any language be removed without changing the meaning or voice?
1. Is the language as simple as possible? Is there any unnecessary jargon?

## Organization
1. Are top-level section headings `<h2>` elements rather than `<h1>` elements? (That is, do they begin with `##` in Markdown?)
1. Headings should not [skip levels](/heading-levels).
1. Is the structure of the piece clear? Do headings convey the structure?
1. Does each paragraph focus on one main idea?
1. Does the subheading draw the reader in or provide extra context? Is it concise? Is it unique text?

## Instruction
1. If the piece expects readers to have prior knowledge, is that made clear up front?
1. Does the piece explain why the process being taught matters?
1. Are examples provided to support all key claims and ideas?
1. Are instructions in second person (_you/your_), not first person (_we/our_)?
1. Are common instructions provided using the web.dev [Instruction components](/handbook/web-dev-components/#instruction)?

## Media
1. Are images and videos used to clarify ideas that would be difficult to understand from text alone?
1. Are any images or videos included that don't directly relate to ideas in the text?
1. Are [image captions](/handbook/use-media/#image-captions) correctly formatted?
1. Do all images have [alt text](/image-alt)?

## Code
1. Are code blocks and sample apps as simple as possible while still conveying the core concept?
1. Is a brief description of a sample app's functionality provided before the app itself?
1. Is [code highlighting](/handbook/markup-code/#code-highlighting) used to indicate lines that have been added or changed?
1. Is all sample code [accessible](/inclusion-and-accessibility/#create-accessible-code-blocks)?

## Links
1. Do all links work?
1. Are all links to web.dev pages and assets relative?
1. When referencing a web platform API, does the page link out to the canonical MDN API reference?

## Mechanics
1. Is the text free of spelling and capitalization errors? (Check the [word list](/word-list).)
1. Are [dashes and hyphens](/handbook/grammar/#dashes-and-hyphens) used correctly?
1. Are titles and headings in sentence case with no terminal period?
1. Are [keyboard key commands](/handbook/grammar/#ui-elements-and-interaction) correctly formatted?
