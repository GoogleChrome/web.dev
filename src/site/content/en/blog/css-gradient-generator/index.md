---
title: Quickly create nice CSS gradients with the CSS Gradient Creator
subhead: >
  This tool by Josh W Comeau makes it super simple to create nice looking gradients.
date: 2022-05-04
scheduled: true
hero: image/rq1kLlxRBubsZSyX0gs2nghLSZc2/k2mYKB7AKDJdRjCbsc09.png
alt: "A subtle orange linear gradient."
authors: 
  - paulkinlan
description: >
  This tool by Josh W Comeau makes it super simple to create nice looking gradients.
tags:
  - blog
  - css
---

This [CSS Gradient Generator](https://www.joshwcomeau.com/gradient-generator/) by Josh W Comeau is a very good, simple Web App that helps you to create "Beautiful, lush gradients".

{% Img src="image/rq1kLlxRBubsZSyX0gs2nghLSZc2/CGKiSTSDSv30GLu7JuQR.png", alt="A screenshot of the Gradient Editor with a simple linear gradient.", width="800", height="693" %}

I personally struggle mapping the syntax to a visual so this tool has been a great help for me. It focuses on creating [linear gradients](https://developer.mozilla.org/docs/Web/CSS/gradient/linear-gradient) and it allows you to configure them using a number of different color modes (like HCL) even though they aren't directly supported on the `linear-gradient` CSS function. [Josh's supporting blog post](https://www.joshwcomeau.com/css/make-beautiful-gradients/) goes into more detail about how the color interpolation is calculated and applied to something the browser can render&mdash;it's a fascinating read into some of the theory behind how it works.

### Linear gradient

{% BrowserCompat 'css.types.image.gradient.linear-gradient' %}

Hero image by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/linear-gradient?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  