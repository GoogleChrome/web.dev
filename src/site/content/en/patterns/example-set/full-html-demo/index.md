---
layout: pattern
title: Full HTML demo pattern
description: Use this pattern if you'd like to show different HTML in the source viewer from what is actually rendered.
date: 2021-08-10
draft: true
noindex: true
static:
  - assets/special-script.js
---

The HTML for the demo page can differ from the code samples displayed
in the code pattern tabs. To achieve this, include the full HTML for the page
in the demo.md file in the patterns directory, and ommit the layout property
in the frontmatter. You still neeed to include the patternId in the
frontmatter.

<!--
  Remove the following code if you're creating your own full HTML demo.
  It's just here for you when _reading_ the site to see example of what you'd put in index.md.
-->

```html
---
patternId: full-html-demo
---

<!DOCTYPE html>
<html>
  <head></head>
  <body>I'm a full HTML demo.</body>
</html>
```
