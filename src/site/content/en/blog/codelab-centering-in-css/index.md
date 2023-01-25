---
layout: codelab
title: "Codelab: Centering in CSS"
authors:
  - adamargyle
description: |
  Learn 5 different centering techniques with CSS.
date: 2020-12-16
hero: image/admin/wKAhovrYm23nFtqFqYbE.png
thumbnail: image/admin/tYvAWgtTaUOxXe9Pxacm.png
glitch: gui-challenges-centering-codelab
glitch_path: app/index.html
related_post: centering-in-css
tags:
  - css
  - layout
---

This codelab sets you up to share and showcase your favorite way of centering in
CSS.

Check out my blog post [Centering in CSS](/centering-in-css) to learn about 5 of
my favorite ways to center in CSS. Or watch this video!

{% YouTube 'ncYzTvEMCyE' %}

## Setup

{% Instruction 'remix', 'ol' %}
1. Open `app/index.html`
1. At `line 23`, replace `/* your centering CSS here /*` with your CSS
1. (optional) Name your centering technique and replace the text in the `<h1>`

### Styles
1. Create a new file in the `app/css/` folder
1. Create a selector to hold your centering solution, like `.turbo-center` or
   `[floaty-mcfloat]`
1. Within that new selector, write your centering technique (feel free to look
   at the other's in `app/css/` as examples)
1. (optional) write some "support styles" so we can see which children need
   styles to support the centering
1. Open `app/css/index.css` and import your new file at the bottom

### Tie it all up
1. Open `app/index.html` again
1. Find the `<article>` and give it your custom selector you made in step #2 of
   the previous section. 
1. [Tweet me](https://twitter.com/argyleink) your Glitch and I'll feature it on
   the blog post!
