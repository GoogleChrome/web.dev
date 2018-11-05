---
title: Same Origin Policy & iframe
author: kosamari
page_type: glitch
glitch: same-origin-policy-iframe
---

In this codelab, see how the same-origin policy works when accessing data inside an iframe.

## Set up: Page with a same-origin iframe
Here is a page with an iframe. As a set up, it is embedding `iframe.html` in the same origin. 
Since the host and the iframe share the same origin, the host site is able to access data inside of the iframe and expose the secret message (Line 17 in index.html).

## Change iframe src
Try change the `src` of the iframe to `https://other-iframe.glitch.me/`.
Can the host still access the secret message? 

Since the host and embed iframe do not have the same origin, access to data is restricted. 