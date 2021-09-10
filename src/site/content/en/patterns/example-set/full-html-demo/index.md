---
layout: pattern
title: Full HTML demo pattern
description: A description for the example pattern
date: 2021-08-10
draft: true
---

The HTML for the demo page can differ from the code samples displayed
in the code pattern tabs. To achieve this, include the full HTML for the page
in the demo.md file in the patterns directory, and ommit the layout property
in the frontmatter. You still neeed to include the patternId in the
fromtmatter.

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