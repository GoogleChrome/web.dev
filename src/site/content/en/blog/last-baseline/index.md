---
layout: post
title: Last baseline alignment
subhead: >
  All major browser engines now support last baseline alignment in CSS grid and flexbox.
description: >
  All major browser engines now support last baseline alignment in CSS grid and flexbox.
date: 2023-02-20
authors:
  - rachelandrew
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/taV4SVIvqz1D3XyOLgrM.jpg
alt: 'Aligned food and cutlery.'
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three major browser engines!
{% endAside %}

Alignment using the `first` and `last` keywords is now available in all major engines. This means that we can use last baseline alignment as another option when aligning groups of flex or grid items.

{% BrowserCompat 'css.properties.align-items.flex_context.last_baseline' %}

## First baseline alignment

If you set the value of `align-items` to `baseline`, the result will be first baseline alignment. Therefore the first baseline of the item you are aligning (described as the _alignment subject_) will align with the first baseline of the other items in the group. You can see this in the following example, where the first two flex items are aligned using `align-items: baseline`, so they align along the baseline created by the larger text. The final item is aligned to `flex-start` and therefore aligns to the start of the flex container.

{% Codepen {
    user: 'web-dot-dev',
    id: 'xxaGaqq',
    height: 450,
    tab: 'result'
  }
%}

## Last baseline alignment

When aligning a grid or flex item with the value `last baseline`, the last baseline of that item will align to the last baseline of the _baseline sharing group_ that it is part of. The following example demonstrates last baseline alignment, with the first flex item aligning with the last line of text in the larger item. The final item in this group is aligned to `flex-end`, which is the end of the flex container.

{% Codepen {
    user: 'web-dot-dev',
    id: 'ExejeWN',
    height: 450,
    tab: 'result'
  }
%}

## Fallback alignment

If the alignment subject does not have a baseline sharing group to align to, then a fallback alignment will be used. For `baseline`, and `first baseline` the fallback alignment is `start`, and for `last baseline` the fallback alignment is `end`. 

Photo by [Toa Heftiba](https://unsplash.com/@heftiba?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
