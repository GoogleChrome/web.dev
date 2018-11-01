---
title: Same Origin Policy & iframe
author: kosamari
page_type: glitch
glitch: same-origin-policy-iframe
---
# Same Origin Policy & iframe

In this codelab, see how the Same Origin Policy works when accessing data inside
an iframe. The same-origin policy applies to access data inside of an iframe as
well.

## Fetch page with an iframe

Fetch a page with an iframe by clicking on the Show Live button:

![image](./show-live.png)

JavaScript on the site is accessing a "message" element inside an iframe. Since
the host and the iframe share the same origin, the host site is able to access
data inside of the iframe and expose the secret message.

## Change iframe src

In the `index.html` file, change the `src` of the iframe to
`[https://other-iframe.glitch.me/](https://other-iframe.glitch.me/)`. Click on
the Show Live button again.

Can the host still access the secret message? No. Since the host and embed
iframe do not have the same origin, access to data is restricted. 

<table>
<thead>
<tr>
<th><strong>How to prevent your application from being embedded in an
iframe</strong><br>
An attack called "clickjacking" embeds a site in an iframe and
overlays transparent buttons which link to a different destination. Users
are tricked into thinking they are accessing your application while sending
data to attackers. <br>
[image]<br>
<br>
To block other sites from embedding your site in an iframe, add
`X-Frame-Options: deny` to the HTTP headers. If you set `X-Frame-Options:
sameorigin` then iframe embedding from the same origin will be permitted.
You can also whitelist domains. To find out more, see <a
href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
 ">MDN</a>.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>