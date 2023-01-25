---
layout: post
title: The page does not contain a heading, skip link, or landmark region
description: |
  Learn how to improve your web page's accessibility by making it easy for
  assistive technologies to skip repeated navigation elements.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - bypass
---

For users who cannot use a mouse,
content that's repeated on pages across your site
can make navigation difficult.
For example, screen reader users may have to move through many links in a navigation menu
to get to the main content of the page.

Providing a way to bypass repetitive content makes non-mouse navigation easier.

## How this Lighthouse audit fails

Lighthouse flags pages that don't provide a way to skip repetitive content:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fJBo4Nbmlks8cj5i2UMJ.png", alt="Lighthouse audit showing page doesn't contain a heading, skip link, or landmark region", width="800", height="185", class="w-screenshot" %}
</figure>

Lighthouse checks that the page contains at least one of the following:
- A `<header>` element
- A [skip link](/headings-and-landmarks#bypass-repetitive-content-with-skip-links)
- A [landmark](/headings-and-landmarks/#use-landmarks-to-aid-navigation)

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to improve keyboard navigation

Passing the Lighthouse audit is straightforward:
add a heading,
a [skip link](/headings-and-landmarks#bypass-repetitive-content-with-skip-links),
or a [landmark](/headings-and-landmarks/#use-landmarks-to-aid-navigation)
to your page.

However, to meaningfully improve the navigational experience
for assistive technology users,
- Place all page content inside a landmark element.
- Make sure each landmark accurately reflects the kind of content it contains.
- Provide a skip link.

{% Aside %}
While most screen readers allow users to navigate by landmarks,
other assistive technologies, like [switch devices](https://en.wikipedia.org/wiki/Switch_access),
only allow users to move through each element in the tab order one at a time.
So, it's important to provide both landmarks and skip links whenever possible.
{% endAside %}

In this example,
all content is inside a landmark,
the headings create an outline of the page's content,
no headings are skipped,
and a skip link is provided to skip the navigation menu:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document title</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <a class="skip-link" href="#maincontent">Skip to main</a>
    <h1>Page title</h1>
    <nav>
      <ul>
        <li>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
        </li>
      </ul>
    </nav>
    <main id="maincontent">
      <section>
        <h2>Section heading</h2>
	      <p>
	        Bacon ipsum dolor amet brisket meatball chicken, cow hamburger pork belly
	        alcatra pig chuck pork loin jerky beef tri-tip porchetta shank. Kevin porchetta
	        landjaeger, ribeye bacon strip steak pork chop tenderloin andouille.
	      </p>
        <h3>Sub-section heading</h3>
          <p>
            Prosciutto pork chicken chuck turkey tongue landjaeger shoulder picanha capicola
            ball tip meatball strip steak venison salami. Shoulder frankfurter short ribs
            ham hock, ball tip pork chop tenderloin beef ribs pastrami filet mignon.
          </p>
      </section>
    </main>
  </body>
</html>
```

You usually don't want to show the skip link to mouse users,
so it's conventional to use CSS to hide it offscreen until it receives
[focus](/keyboard-access/#focus-and-the-tab-order):

```css
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

See the [Headings and landmarks](/headings-and-landmarks) post for more
information.

## Resources

- [Source code for **The page does not contain a heading, skip link, or landmark region** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/bypass.js)
- [Page must have means to bypass repeated blocks (Deque University)](https://dequeuniversity.com/rules/axe/3.3/bypass)
