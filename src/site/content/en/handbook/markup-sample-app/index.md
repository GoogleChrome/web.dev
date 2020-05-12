---
layout: handbook
title: Sample apps
date: 2019-06-26
description: |
  Learn how to create sample apps for web.dev using Glitch.
---

This post is about how to get sample apps to work right in your post and follow site conventions. For guidance about how to use sample apps to support your writing goals, see the [Write useful code samples](/handbook/write-code-samples) post.

web.dev uses [Glitch](https://glitch.com/) to embed web-based sample apps and development environments in its posts and codelabs. Glitch is handy because it lets you demonstrate both frontend and backend code.

## Create a new Glitch
1. If you aren't already a member of the web.dev Glitch team, ask your content reviewer to be added.
1. Once you're on the team, remix the [Hello Webpage template](https://glitch.com/~web-dev-hello-webpage) or [Hello Express template](https://glitch.com/~web-dev-hello-express), depending on which is closest to what you're trying to build.
1. Replace the automatically generated title for your Glitch with a descriptive name that hasn't already been used elsewhere on web.dev.
1. Give your Glitch a brief description.
1. Use the [web.dev logo](https://user-images.githubusercontent.com/1066253/54093483-8c802400-4355-11e9-95a1-80fa72fda70a.jpg) for your Glitch thumbnail.
1. Add the Glitch to the [web.dev team page](https://glitch.com/@webdev).

## Authoring tips
Make all Glitch code [accessible](/handbook/inclusion-and-accessibility#create-accessible-code-blocks).

[Be mindful of the development landscape](/handbook/quality/#be-mindful-of-the-development-landscape) when selecting tools and frameworks.

Make sure the `README` for your Glitch links back to web.dev. Here's a template you can use:

```text
# [Your Article Name]
This example is part of the [name of article](link/to/article) post on [web.dev](https://web.dev).
```

Use the license headers for HTML, CSS, and JS files:

```js
// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0
```

Manage the dependencies in your Glitch by adding them to the `package.json` file. Otherwise, dependencies can get out of date and break the Glitch. (Or you can ask readers to add dependencies to the Glitch's `package.json` themselves if that's relevant to what you're teaching. Any time the `package.json` file is edited, Glitch will automatically run `npm` again.)
