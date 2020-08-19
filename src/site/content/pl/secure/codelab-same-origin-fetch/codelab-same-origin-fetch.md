---
layout: codelab
title: Same Origin Policy & Fetch requests
authors:
  - kosamari
date: 2018-11-05
description: |
  In this codelab, learn how the same-origin policy works when fetching
  resources.
glitch: same-origin-policy-fetch
related_post: same-origin-policy
tags:
  - security
---

In this codelab, see how the same-origin works when fetching resources.

## Set up: Fetch page from same origin
The demo is hosted at `https://same-origin-policy-fetch.glitch.me`.
This simple web page uses `fetch` to load resource from `https://same-origin-policy-fetch.glitch.me/fetch.html`. Since `index.html` and `fetch.html` share the same origin, you should see `200` displayed on the live preview.


## 1. Fetch page from different origin

Try to change the fetch URL to `https://www.google.com`.
What do you see in the live preview?

The browser should have blocked the fetch request because you requested a resource
from a different origin. This means an attacker cannot read cross-origin
resources even if they have taken control of a user's browser.

## 2. Fetch a cross-origin resource

Try changing the fetch URL to `https://api.thecatapi.com/v1/images/search`.
What do you see in the live preview?

The fetch URL is a different origin, but you should see the status code 200. Why?
Modern web applications often request cross-origin resources to load
third-party scripts or query an API endpoint. To accommodate these use cases,
there is a mechanism called CORS (Cross Origin Resource Sharing) to tell the
browser that loading of a cross-origin resource is allowed. See [Share cross-origin resources safely](/cross-origin-resource-sharing) for more on CORS.
