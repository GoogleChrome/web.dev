---
title: Cross Origin Resource Sharing
author: kosamari
page_type: glitch
glitch: cors-demo
---

# See how CORS works
This demo is a simple web server with two endpoints that you can experiment with and 
understand how cross origin resource sharing works.

The first endpoint (line 5) does not have any response header set, it just sends a file in response. 

The second endpoint (line 10) sends the same file in response but adds
`Access-Control-Allow-Origin: *`  in the header. 

Open the devtools console and try
`fetch('https://cors-demo.glitch.me/', {mode:'cors'})`.  

You should see an error saying _"request has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource."_

The second endpoint (line 10) sends the  same file in response but adds
`Access-Control-Allow-Origin: *`  in the header. From the console, try
`fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})`.
This time, your request should not be blocked.

Add `Access-Control-Allow-Origin` and set it to a specific origin like this:
`Access-Control-Allow-Origin: https://google.com`. This will allow cross-origin access to the resource only if the request came from
`https://google.com`.

**Extra Step**: Remix the glitch, set different values in header and see how different requests are handled by CORS!