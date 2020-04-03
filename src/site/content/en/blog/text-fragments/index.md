---
title: |
  Text Fragments
subhead: |
authors:
  - thomassteiner
date: 2020-04-03
hero: hero.jpg
alt:
description: |
tags:
  - post # post is a required tag for the article to show up in the blog.
  - text-fragments
  - capabilities
  - fugu
draft: true
---
## Fragment Identifiers

Chrome&nbsp;80 was a big release.
It contained a number of highly anticipated features like
[ECMAScript Modules in Web Workers](https://web.dev/module-workers/),
[nullish coalescing](https://v8.dev/features/nullish-coalescing),
[optional chaining](https://v8.dev/features/optional-chaining), and more.
The release was, as usual, announced as a
[blog post](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)
on the Chromium blog.
You can see an excerpt of the blog post in the screenshot below.

![Chromium blog post with red boxes around elements with an `id` attribute.](blog-red-ids.png)

Probably you ask yourself what all the red boxes mean.
They are the result of running the snippet below in the Developer Tools.
It highlights all elements that have an `id` attribute.

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

You can place a deep link to any element highlighted with a red box by using a
[fragment identifier](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment)
that you then use in the [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash)
of the URL of the page.
Assuming I wanted to deep link to the *Give us feedback in our
[Product Forums](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)*
box in the aside, I could do so by handcrafting the URL
`https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1`.
As you can see in the Elements panel of the Developer Tools, the element in question
has an `id` attribute with the value `HTML1`.

![Dev Tools showing the `id` of an element.](id-html8.png)

If I parse this URL with JavaScript, the different components are revealed.
You can see the `hash` with the value `#HTML1`.

```js
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Creates a new `URL` object
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

The pure fact that I had to open the Developer Tools to find out the `id`
of the element in question speaks volumes about the probability this particular section of the page
was meant to be linked to by the author of the blog post.

But what about the sections I actually may have wanted to link to in real life?
Unfortunately there is not a single red box in the entire blog post body.
Say I wanted to deep link to the *ECMAScript Modules in Web Workers* heading.
As you can see in the screenshot below, the `<h1>` in question does not have an `id` attribute.
Without a fragment identifier, there is no way how I could link to this heading.
This is the problem that Text Fragments solve.

![Dev Tools showing a heading without an `id`.](id-missing.png)

## Text Fragments

The [Text Fragments](https://wicg.github.io/ScrollToTextFragment/) proposal adds support
for specifying a text snippet in the URL fragment.
When navigating to a URL with such a fragment, the user agent can quickly emphasize
and/or bring it to the user's attention.
