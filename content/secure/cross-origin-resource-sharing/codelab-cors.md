---
title: Cross Origin Resource Sharing
author: kosamari
page_type: glitch
glitch: cors-demo
---

This demo is a simple server with two endpoints that you can experiment with to
understand how cross origin resource sharing works.

## See how CORS works

Configure access control on your server, and try fetching resources based on
that configuration.  
   
In this demo, the first endpoint (line 5) does not have any response header set,
it just sends a file in response. Run the server by clicking on the Show Live
button:

![image](./show-live.png)

Open the devtools console and try
`fetch('[https://cors-demo.glitch.me/](https://cors-demo.glitch.me/)',
{mode:'cors'})`.  

You should see an error saying _"request has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource."_

The second endpoint (line 10) sends the  same file in response but adds
`Access-Control-Allow-Origin: *`  in the header. From the console, try
`fetch('[https://cors-demo.glitch.me/allow-cors](https://cors-demo.glitch.me/allow-cors)',{mode:'cors'})`.
This time, your request should not be blocked.

Add `Access-Control-Allow-Origin` and set it to a specific origin like this:
`Access-Control-Allow-Origin: [https://google.com](https://google.com)`. This
will allow cross-origin access to the resource only if the request came from
https://google.com.

## Share credentials with CORS

CORS is normally used for "anonymous requests" — ones where the request doesn't
identify the requestor. This is for privacy reasons. If you want to send
cookies when using CORS (which could identify the sender), you need to add
additional headers to the request and the server will do the same for the
response header.

### Request

Add  `credentials: 'include'` to the fetch options like below. This will include
the cookie with the request.

```  
fetch('http://example.com', {  
  mode: 'cors',  
  **credentials: 'include'**  
})  
```

### Response 

``Access-Control-Allow-Origin`` must be set to a specific origin (no wildcard
using `*`) and must set ``Access-Control-Allow-Credentials`` to ``true``.

```  
app.get('/allow-cors', function(request, response) {  
**  response.set('Access-Control-Allow-Origin', 'http://example.com');**  
**  response.set(Access-Control-Allow-Credentials', true);**  
  response.sendFile(__dirname + '/message.json');  
});  
`  
```

## Preflight request for complex HTTP call

If a web app needs a complex HTTP request, the browser adds a  **preflight
request** to the front of the request chain.

The CORS specification defines a **complex request** as 

+  A request that use methods other than GET, POST, or HEAD
+  A request that includes headers other than `Accept`, `Accept-Language` or
     `Content-Language`
+  A request that has a Content-Type header other than
    `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`

Browsers create a preflight request if it is needed. It's an OPTIONS request 
like below and is  sent before the actual request message.

    OPTIONS /data HTTP/1.1
    Origin: http://example.com
    Access-Control-Request-Method: DELETE

On the server side, an application needs to respond to the preflight request
with information about the methods the application accepts from this origin.   
   
`HTTP/1.1 200 OK`

    Access-Control-Allow-Origin: http://example.com
    Access-Control-Allow-Methods: GET,DELETE,HEAD,OPTIONS

The server response can also include an `Access-Control-Max-Age` header to
specify the duration to cache preflight results so the client does not need to
make a preflight request every it they sends a complex request.

<table>
<thead>
<tr>
<th><strong>Extra Step</strong>: Remix the glitch, set different values in
header and see how different requests are handled by CORS!</th>
</tr>
</thead>
<tbody>
</tbody>
</table>
