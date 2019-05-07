---
layout: codelab
title: Access caches from your web app's code
author: mdiblasio
date: 2019-05-07
description: |
  In this section you'll learn how to access a web app's caches to display a
  list of cached assets.
glitch: wiki-offline-access-cache
web_lighthouse: N/A
---
If you've finished the [previous sections](../codelab-reliability-overview/) of
this project, you've built a sample app that allows users to search for and
view previously cached Wikipedia articles offline. That feature is somewhat
useful, but it's not an ideal solution: what if your user doesn't remember what
articles they've already viewed? A better experience would allow users to view
the list of articles available offline.

To create that experience, in this section you'll learn how to access a web
app's caches to display a list of cached assets.

{% Aside %}
If you've finished previous sections of this project in your own Glitch, you
can continue working in it. Otherwise, you can use the Glitch provided here.
{% endAside %}

{% Aside 'caution' %}
Make sure to [set up Glitch and DevTools](../codelab-reliability-setup/) if you
haven't already.
{% endAside %}

The [Cache Storage API](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api)
is available for use in both service workers and from the client. So, if you
want to make changes to caches—like adding or removing entries, or getting a
list of cached URLs—from the context of your web app, you can do so directly
without having to communicate with a service worker.

To allow users to view and access cached articles in the sample app, you can
refer to the Wikipedia articles cache name `wiki-articles` to get a list of entries
in that cache. To do that create a `queryWikiCache()` method in `app.js` to
query the `wiki-articles` cache using the Cache Storage API. For each article in the
cache, use the `createArticleThumbnail(title)` method to create an article
list item based on the article's title and append each list item to the
`articleHistoryContainer` DOM element.

```js/3-15/2
// query cache and populate cached articles list
async function queryWikiCache() {
  // TODO: add logic to query articles cache and display cached articles
  articleHistoryContainer.innerHTML = '';
  const wikiCache = await window.caches.open(WIKI_API_CACHE);

  wikiCache.keys().then(keys => {
    if (keys.length > 0) {
      keys.forEach(key => {
        let title = key.url.toString().match(/api\/wiki\/(.*)/)[1];
        articleHistoryContainer.appendChild(createArticleThumbnail(title));
      });
    } else {
      articleHistoryContainer.innerHTML = `<p><i>No articles cached</i></p>`;
    }
  });
}
```

Refresh the page and navigate to the __Cached__ tab in the sample app to see the
list of cached Wikipedia articles viewable offline!

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./article-list.png" alt="A screenshot
  showing the list of cached articles in the sample app.">
</figure>

Note that the trash buttons in the article list aren't functional yet. You'll
add this functionality in the next section!

## What's next
[Give users control over what your app caches](../codelab-reliability-user-control/)
