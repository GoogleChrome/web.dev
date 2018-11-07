---
title: Fix sneaky 404s
author: martinsplitt
page_type: glitch
glitch: sneaky-404
---

Single Page Apps can show different content without loading a new page.
 To do so, they use click handlers on links and the History API.
 The History API allows to manipulate the browser session history.
 This way we can update the URL when showing a different page
 (usually called a "view" in Single Page Apps).
 It also makes sure the browser's back button still works as expected.

Take a look at the Single Page App in this codelab.
 It shows either cat or dog images and provides links to toggle
 between the two animals. It seems to work fine!

## Hunting the sneaky 404

Unfortunately there is a subtle bug in the app. Let's take a look!

- Click on the **Show Live** button.

<web-screenshot type="show-live"></web-screenshot>

- Click on the link that says **Doggos**. Notice how the URL changed.
- Refresh the page.

You get a page with "`Cannot GET /doggos`" on it - a sneaky 404.
It is "sneaky", because the web app seems to work fine as long as you only click
on links within it. It breaks when using the URLs in a new browser window
or when refreshing the page. The issue is that the server does not know how to
respond to a request for these URLs. We are making them up in our web app using
the History API, but the server does not know what to do with them. Whenever the
server does not know what to do for a requested URL, it responds with the HTTP
status code `404`. With this code the server says it hasn't found anything for the requested URL.

Search engines will not index your views in this case, because a user would click
on a search result and find the error message, but not the content they were looking for,
such as the dog pictures.

## Fixing the server

In this project, we have an express.js server written in JavaScript.
Let's fix our server, so it responds with index.html and our single page app will take care of the rest.

- Click on **Edit on Glitch**.

<web-screenshot type="edit-on-glitch"></web-screenshot>

- Select the **server.js** file

This file contains the server code. It sets up an express.js server and sends the content of index.html.
The route setup in line 15 only serves the web app when requests go to the URL `/`.
The server should also serve the other URLs we have created.
To be as flexible as possible with regards to URLs we could add in the future, 
we should change this to serve all URLs.

To do so, we can change the code starting at line 15 to this:

<pre class="prettyprint">
app.get('/*', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
</pre>

The `*` matches any URL and our server now responds with our web app in index.html for any given URL.
We can now use the "Show Live" button and try it out.
Refreshing and opening the links in a new incognito window should now work as expected.
