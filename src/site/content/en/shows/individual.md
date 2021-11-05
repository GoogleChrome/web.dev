---
layout: item-page
path: 'shows'
title: Shows
permalink: /{{lang}}/{{ paged.href }}{% if paged.index > 0 %}{{ paged.index + 1 }}/{% endif %}index.html
description: Our latest news, updates, and stories for developers
renderData:
  title: "{{ paged.overrideTitle or paged.title | i18n(locale) or title }}"
  description: "{{ paged.description | i18n(locale) or description }}"
  rss: "{{ paged.href }}feed.xml"
  hero: "{{ paged.data.hero }}"
pagination:
  data: collections.shows
  size: 1
  alias: paged
  resolve: values
  addAllPagesToCollections: true
---
