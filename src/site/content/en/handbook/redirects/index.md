---
layout: handbook
title: Redirects
date: 2020-04-29
description: |
  Learn how to redirect content.
---

This guide explains how to redirect content.

## Redirect a single page

1. Open [`redirects.yaml`][source].
1. Add an entry similar to the following:

   ```yaml
   source: /path/to/old/page
   destination: /path/to/new/page
   ```

## Redirect multiple pages in a directory

It's possible to redirect a subdirectory of content, but this feature
is probably no longer useful because web.dev now uses a [flat URL structure][flat].

1. Open [`redirects.yaml`][source].
1. Add an entry similar to the following:

   ```yaml
   source: /path/to/old/subdirectory/:part
   destination: /path/to/new/subdirectory/:part
   ```

[source]: https://github.com/GoogleChrome/web.dev/blob/main/redirects.yaml
[flat]: https://joeyhoer.com/flat-vs-hierarchical-url-structure-420f178c
