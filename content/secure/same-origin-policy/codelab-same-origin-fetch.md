---
title: Same Origin Policy & Fetch requests
author: kosamari
page_type: glitch
glitch: same-origin-policy-fetch
---

# Same Origin Policy & Fetch request

In this codelab, see how the same-origin works when fetching resources.

## Set up: Fetch page from same origin
The demo is hosted at `https://same-origin-policy-fetch.glitch.me`. 
In this simple web page, it is using `fetch` to load resource from `https://same-origin-policy-fetch.glitch.me/fetch.html`. Since `index.html` and `fetch.html` shares same origin, you should see `200` displayed on the live preview. 

## 1. Fetch page from different origin

Try change the fetch URL to `https://www.google.com`.  
What do you see in the live preview?

The browser should have blocked the fetch request because you requested a resource
from a different origin. This means an attacker cannot read cross-origin
resources even if they have taken control of a user's browser.

## 2. Fetch a cross-origin resource

Try change the fetch URL to `https://api.thecatapi.com/v1/images/search`.  
What do you see in the live preview?

The fetch URL is a different origin, but you should see status code 200. Why? 
Modern web applications often request cross-origin resources to load
third-party scripts or query an API endpoint. To accommodate these use cases,
there is a mechanism called CORS (Cross Origin Resource Sharing) to tell the
browser that loading of a cross-origin resource is allowed. See [Share cross-origin resources safely](./path/secure/cross-origin-resource-sharing) for more on CORS.