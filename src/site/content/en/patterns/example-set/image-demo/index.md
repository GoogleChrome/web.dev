---
layout: pattern
title: Image demo pattern
description: Shows off how to create a pattern that uses the Img shortcode.
date: 2021-08-10
height: 400
noindex: true
---

It is possible to use an image (static or animated) as a demo in a CodePattern.

Use an `Img` shortcode wrapped in a `<figure>` tag in the demo.md
file. In this case, you should **not** add *body.html* to the demo assets.
If you still want to display an HTML snippet, give it a name other than "body".

<!--
  Remove the following code if you're creating your own image demo.
  It's just here for you when _reading_ the site to see example of what you'd put in index.md.
-->

```html
// demo.md

---
layout: demo
patternId: image-demo-example
---

<figure>
  {% Img
    src="image/admin/3lZosaL1YXafLn4ZRINl.gif",
    alt="WalkMe state toggle test.",
    width="441",
    height="400"
    %}
</figure>
```