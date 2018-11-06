---
page_type: guide
title: Share cross-origin resources safely
author: kosamari
web_lighthouse: N/A
wf_blink_components: N/A
---

# Share cross-origin resources safely

The browser's Same Origin Policy blocks reading a resource from a different
origin. This mechanism stops a malicious site from reading another site's data,
but it also prevents legitimate uses. What if you wanted to get weather data
from another country? 

In a modern web application, an application often wants to get resources from a
different origin. For example, you want to retrieve JSON data from a different
domain or load images from another site into a `<canvas>` element.

In other words, there are **public resources** that should be available for
anyone to read, but the same-origin policy blocks that. Developers have used
work-arounds such as
[JSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about),
but **Cross-Origin Resource Sharing (CORS)** fixes this in a standard way.

Enabling **CORS** lets your server share resources to multiple origins.
Technically speaking, the server tells the browser it's permitted to use an
additional origin.

# How does a resource request work on the web?

A browser and a server can exchange data over the network using the
**H**yper**t**ext** T**ransfer** P**rotocol (HTTP). HTTP defines the
communication rules between the requester and the responder, including what
information is needed to get a resource.

The HTTP header is used to negotiate the type of message exchange between the
client and the server and is used to determine access.  Both the browser's
request and the server's response message are divided into two parts: header and
body:

<table>
<thead>
<tr>
<th>header</th>
<th>Information about the message such as type of the message or encoding of
the message. A header can include a <a
href="https://en.wikipedia.org/wiki/List_of_HTTP_header_fields">variety of
information</a> expressed as key-value pairs. The request header and
response header contain different information.<br>
<br>
(Note that headers can't actually have comments)<br>
<br>
<strong>Sample Request header</strong><br>
<p><pre>
Accept: text/html  // "I want to receive HTML in response"
Cookie: Version=1 // "Here is cookie I have"
</pre></p>

<br>
<strong>Sample Response header<br>
<code></strong>Content-Encoding: gzip //
"It is encoded with gzip"</code><br>
<p><pre>
Cache-Control: no-cache // "Do not cache this please"
</pre></p>

</th>
</tr>
</thead>
<tbody>
<tr>
<td>Body</td>
<td>The message itself. This could be plain text, an image binary, JSON, HTML,
etc.</td>
</tr>
</tbody>
</table>

# How does CORS work?

Remember that the same-origin policy tells the browser to block all cross-origin
requests. When you want to get a public resource (or get data from another
server than you own), that other server needs to tell the browser "you can also
talk to mine". The browser remembers that and allow cross-origin requests to
that server.

When the browser sees a cross-origin request, it adds an ``Origin:`` header with
the current origin (scheme, host, and port). When a server sees this header, and
wants to allow access, it adds an ``Access-Control-Allow-Origin:``  header to
the response naming the requesting origin (or `*` to allow any origin.) The
browser sees this response, and allows the response data to come through.