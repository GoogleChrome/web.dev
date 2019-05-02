---
layout: post
title: Manually check user's focus is directed to new content
description: |
  Learn about managed-focus audit.
web_lighthouse:
  - managed-focus
---

Whenever new content is added to a page,
try to ensure the user's focus gets directed to that content,
so they can take action on it.

## How to manually test

Single-page apps are important to test,
especially when it comes to managing a user's focus
to new content.

Typically in a single-page app,
clicking on a link won't do a hard refresh.
Instead,
a route change fetches new data for the `<main>` content area.

For sighted users,
this works fine.
But for users navigating with a screen reader,
they may not know that the new content
has been added to the page.
There's no indication that they should navigate
back to the `<main>` area.

When this happens,
you'll want to manage the user's focus
to keep the user's perceived context in sync with the site's visual content.

## How to fix

To manage a user's focus to fresh content on a page,
find a good heading in the newly loaded content and direct focus to it.
The easiest way to pull this off is to give the heading a `tabindex` of `-1`
and call its `focus()` method:

```html
<main>
  <h2 tabindex="-1">Welcome to your shopping cart</h2>
</main>
<script>
  // Assuming this gets called every time new content loads...
  function onNewPage() {
    var heading = document.querySelector('h2');
    heading.focus();
    // You can also update the page title :)
    document.title = heading.textContent;
  }
</script>
```

A screen reader announces the new heading,
as well as the main landmark area that it's contained within.

See also [Managing focus for accessibility](https://dev.to/robdodson/managing-focus-64l).


{% Aside 'note' %}
You probably don't want to do this focus management
when a user first arrives at your site.
Only implement this for subsequent navigation,
like when they click a link.
{% endAside %}

## More information

- [Check user's focus is directed to new content audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/managed-focus.js)