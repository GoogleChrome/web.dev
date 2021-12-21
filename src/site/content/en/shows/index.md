---
layout: index-page
title: Shows
permalink: /{{lang}}/{{ paged.href }}{% if paged.index > 0 %}{{ paged.index + 1 }}/{% endif %}index.html
description: Our latest news, updates, and stories for developers
pagination:
  data: collections.shows
  size: 1
  alias: paged
  resolve: values
  addAllPagesToCollections: true
---
