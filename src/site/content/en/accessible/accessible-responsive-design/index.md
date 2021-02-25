---
layout: post
title: Accessible responsive design
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |
  We know that it's a good idea to design responsively to provide the best multi-device experience, but responsive design also yields a win for accessibility.
tags:
  - accessibility
---

We know that it's a good idea to design responsively to provide the best multi-device experience,
but responsive design also yields a win for accessibility.

Consider a site like [Udacity](https://udacity.com):

<figure class="w-figure">
  {% Img src="image/admin/5q9dDtEubSM23SzokQNu.jpg", alt="The Udacity site", width="800", height="393", class="w-screenshot" %}
</figure>

A low-vision user who has difficulty reading small print might zoom in the page,
perhaps as much as 400%.
Because the site is designed responsively,
the UI will rearrange itself for the "smaller viewport" (actually for the larger page),
which is great for desktop users who require screen magnification
and for mobile screen reader users as well. It's a win-win.
Here's the same page magnified to 400%:

<figure class="w-figure">
  {% Img src="image/admin/WKHO21uWQz5lJ7Aqej1E.jpg", alt="The Udacity site zoomed to 400%", width="800", height="393" %}
</figure>

In fact, just by designing responsively,
we're meeting rule [1.4.4 of the WebAIM checklist](https://webaim.org/standards/wcag/checklist#sc1.4.4),
which states that a page "… should be readable and functional when the text size is doubled."

Going over all of responsive design is outside the scope of this guide,
but here are a few important takeaways that will benefit your responsive experience
and give your users better access to your content.

## Use the viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Setting `width=device-width` will match the screen's width in device-independent pixels,
and setting `initial-scale=1` establishes a 1:1 relationship between CSS pixels and device-independent pixels.
Doing this instructs the browser to fit your content to the screen size,
so users don't just see a bunch of scrunched-up text.

See [Size content to viewport](/responsive-web-design-basics/#viewport) to learn more.

## Allow users to zoom

It is possible to use the viewport meta tag to prevent zooming,
by setting `maximum-scale=1` or `user-scaleable=no`.
Avoid doing this, and let your users zoom in if they need to.

## Design with flexibility

Avoid targetting specific screen sizes and instead use a flexible grid,
making changes to the layout when the content dictates.
As we saw with the Udacity example above, this approach ensures that the design responds
whether the reduced space is due to a smaller screen or a higher zoom level.

You can read more about these techniques in the [Responsive web design basics](/responsive-web-design-basics/) article.

## Use relative units for text

To get the best out of your flexible grid
use relative units like em or rem for things like text size, instead of pixel values.
Some browsers support resizing text only in user preferences,
and if you're using a pixel value for text, this setting will not affect your copy.
If, however, you've used relative units throughout,
then the site copy will update to reflect the user's preference.

This will enable the whole site to reflow as the user zooms,
creating the reading experience they need to use your site.

## Avoid disconnecting the visual view from the source order

A visitor who is tabbing through your site with the keyboard
will be following the order of the content in the HTML document.
When using modern layout methods such as [Flexbox](/responsive-web-design-basics/#flexbox) and [Grid](/responsive-web-design-basics/#grid),
it is easy to make the visual rendering not match the source order.
This can lead to disconcerting jumps around the page for someone using the keyboard to move around.

Make sure to test your design at each breakpoint by tabbing through the content,
does the flow through the page still make sense?

Read more about [the source and visual display disconnect](/content-reordering/).

## Take care with spatial clues

When writing microcopy avoid using language which indicates the location of an element on the page.
For example, referring to navigation "on your left" makes no sense in a mobile version
when the navigation is at the top of the screen.

## Ensure tap targets are large enough on touchscreen devices

On touchscreen devices make sure your tap targets are large enough
to make them easy to activate without hitting other links.
A good size for any tappable element is 48px,
read more guidance on [tap targets](/accessible-tap-targets/).
