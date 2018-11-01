---
title: Same Origin Policy & Fetch requests
author: kosamari
page_type: glitch
glitch: same-origin-policy-fetch
---

# Same Origin Policy & Fetch request

In this codelab, see how the Same Origin Policy works when fetching requests.

## Fetch page from same origin

Fetch a page served from the same origin by clicking on the Show Live button:

![image](./show-live.png)

You should see `200` displayed on your screen. The URL
`[https://same-origin-policy-fetch.glitch.me/fetch.html](https://same-origin-policy-fetch.glitch.me/fetch.html)`
is served from the same origin as the demo itself.

## Fetch page from different origin

Now change the fetch URL to `https://www.google.com`. Do you see the error? The
browser should have blocked the fetch request because you requested a resource
from a different origin. This means an attacker cannot read cross-origin
resources even if they have taken control of a user's browser.

## Fetch a cross-origin resource

Change the fetch URL to `https://api.thecatapi.com/v1/images/search`? It is a
different origin, but you should see status code 200. Why? 

Modern web applications often request cross-origin resources, to load
third-party scripts or query an API endpoint. To accommodate these use cases,
there is a mechanism called CORS (Cross Origin Resource Sharing) to tell the
browser that loading of a cross-origin resource is allowed.