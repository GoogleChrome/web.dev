---
layout: codelab
title: Fix sneaky 404s
authors:
  - martinsplitt
date: 2018-11-05
description: |
  In this codelab, learn how to track down a sneaky 404 that may prevent your
  page from being properly indexed.
glitch: fix-sneaky-404
related_post: fix-http-status-codes
---

Single Page Apps can show different content without loading a new page. To do
so, they use click handlers on links and the History API. The [History
API](https://developer.mozilla.org/en-US/docs/Web/API/History) allows to
manipulate the browser session history. This way we can update the URL when
showing a different page (usually called a "view" in Single Page Apps). It also
makes sure the browser's back button still works as expected.

Take a look at the Single Page App in this codelab. It shows either cat or dog
images and provides links to toggle between the two animals. It seems to work
fine!

## Uncovering the sneaky 404

Unfortunately there is a subtle bug in the app. Let's take a look!

{% Instruction 'preview' %}
- Click the **Doggos** link. Notice how the URL changed.
{% Instruction 'reload-app' %}

You get a page with "`Cannot GET /doggos`" on it—a sneaky 404. It is "sneaky",
because the web app seems to work fine as long as you only click on links within
it. It breaks when using the URLs in a new browser window or when refreshing the
page. The issue is that the server does not know how to respond to a request for
these URLs. The JavaScript code in our web app is using the History API to
navigate between them, but the server does not know what to do with them.
Whenever the server does not know what to do for a requested URL, it responds
with the HTTP status code `404`. With this code the server says it hasn't found
anything for the requested URL.

Search engines will not index the URLs in this case, because a user would click
on a search result and find the error message, but not the content they were
looking for, such as the dog pictures.

## Fixing the server

This project uses an [express.js](https://expressjs.com/) server written in
JavaScript. Let's fix the server, so it responds with index.html and the single
page app will take care of the rest.

{% Instruction 'remix' %}
- Select the `server.js` file.

This file contains the server code. It sets up an express.js server and sends
the content of index.html. The route setup in line 15 only serves the web app
when requests go to the URL `/`. The server should also serve the other URLs we
have created. Let's change this to serve all URLS, so it also works with
additional URLs in the future.

To do so, we can change the code starting at line 15 to this:

```js
app.get('/*', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
```

The `/*` matches any URL and the server now responds with the web app in
`index.html` for any given URL.

{% Instruction 'preview' %}

Refreshing and opening the links in a new incognito window should now work as
expected.
