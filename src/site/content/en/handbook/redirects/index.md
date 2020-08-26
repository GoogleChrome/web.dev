---
layout: handbook
title: Redirects
date: 2020-04-29
description: |
  Learn how to redirect content.
---

This guide explains how to redirect content.

## Redirect a single page

1. Open [`firebase.json`][source].
1. Add an entry similar to the following in `hosting.redirects`:

  ```json
  {
    source: "/path/to/old/page",
    destination: "/path/to/new/page",
    type: 301
  }
  ```

## Redirect multiple pages in a directory

It's possible to redirect a subdirectory of content, but this feature
is probably no longer useful because web.dev now uses a [flat URL structure][flat].

1. Open [`firebase.json`][source].
1. Add an entry similar to the following in `hosting.redirects`:

   ```json
   {
    source: "/path/to/old/subdirectory/:path",
    destination: "/path/to/new/subdirectory/:path",
    type: 301
   }
   ```

[source]: https://github.com/GoogleChrome/web.dev/blob/master/firebase.json
[flat]: https://joeyhoer.com/flat-vs-hierarchical-url-structure-420f178c
