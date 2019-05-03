---
layout: post
title: Mural Card Layout
authors:
  - adamargyle
description:
tags:
- Layout
- Design
- CSS
web_lighthouse: N/A
date: 2019-03-05
---

# Mural Card Layout

<figure style="text-align:center; margin: 4rem 0;">
  <img src="mural card.png" alt="">
</figure>


The layout of these featured mural cards are **hiding some fun & tricky grid tasks**:

1. **Layering**, things are on top of each other
1. Height **temptations**
1. **Optional/variable** content
1. Flexible **relationships**

<br>

## Strategy
#### Avoiding absolute positioned elements
Historically, I'd accomplish this layout with an absolute positioned caption element over an inline or background image. This would work fine, but absolutely positioned elements immediately become **extrinsic**. That extrinsic switch will become tedious in my experience, and find itself in odd states or behavior because it's not in flow anymore. Good news is, **we can achieve this layout without any absolutely positioned elements.**

Layering or stacking with CSS grid feels like **the way we've been wanting absolute positioned elements to behave all along!** "Layer over stuff but still be aware of your surroundings" as opposed to "layer over stuff and completely lose context, you be you." I've always wanted the former, "be aware of your surroundings" without me writing a bunch of code to tell the element about it's surroundings. It's here, we have it!

### Why avoid absolute positioned elements?
1. We could **still animate** the caption if we want
1. It's **less code**
1. More **resilient**
1. In **flow**

<br>

#### Inline content values
Personally, I try to keep **important imagery as inline content** so crawlers can find it and hoist it to social embeds. A background image would be a swift solution to this layout, with no layering as well, but the image would be hidden from crawlers, wouldn't be loaded lazily for free, and multiple srcsets would be harder to implement than the free native picture features.

<br><br>

# Stacking with CSS Grid

**HTML**
```html
<figure class="mural-card">
  <picture>...</picture>
  <figcaption>...</figcaption>
</figure>
```

<br>

**CSS**
```css
.mural-card {
  display: grid;
  align-items: flex-end;

  & > * {
    grid-column: 1;
    grid-row: 1;
  }

  & :matches(picture, img) {
    width: 100%;
    height: 100%;
  }
}
```

<div class="note" style="margin:2rem 0;">
  <b>Plain Speak:</b> This is a grid of 1 column and 1 row and all direct children should stack in that space. The picture should fill the cell, while the caption stays intrinsic and aligns to the bottom.
</div>

**Glitch**
<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/logical-tab-order?path=index.html&previewSize=100&attributionHidden=true"
    alt="logical-tab-order on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<figure style="text-align:center; margin: 4rem 0;">
  <img src="intrinsic-feature-card-stack.gif" alt="">
  <figcaption>Gif shows image and caption are stacked, with the caption aligned to the bottom</figcaption>
</figure>

We **achieve an absolute positionless layout** by **leveraging grid's slotted layout** syntax. We're **placing** each element into the **same grid cell**, which stacks them **using DOM source order** to determine which is **on top** of which. That takes care of the layering.

**BUT**, there's 1 part of this grid we can't control **without subgrid**, a shared width of the city columns between mural cards. Here, I've updated the card titles and cities to show what I mean.

todo: reshoot gif, shows img instead of picture
<figure style="text-align:center; margin: 4rem 0;">
  <img src="intrinsic-feature-card-subgrid.gif" alt="">
</figure>



Since we're intrinsicly sizing the city column cell, **they can be different** between each other. Notice the top card's first column width **vs** the second card's first column width. With **subgrid**, we could **share the max of those intrinsic columns** between the 2 mural cards so that the width of them are uniform. Be excited for subgrid, look at the control we'll get! 🤩

> Personally, while subgrid will be rad, I like the intrinsic effect here, where each card and it's contents can find their own appropriate relationship for display. There's something charming about it to me.

<br><br>



## Intrinsic Caption Layout

This layout needs to **deal with content variability** just like some of the other's that have content coming from a CMS or data model. Checkout the gif under the code, it can take a beating!

<br>

**This layout should:**
1. still work if content items are missing
1. never have text or icons pop out of the container
1. still work if content titles are super long
1. etc, these requirements should look familiar by now 😉

<br>

Grid makes swift work of these requirements. **Uniquely** to this layout, **flexbox was not needed**. **Gap**, **distribution** and **alignment** do all the work ❤️

<br><br>

**HTML**
```html
<figcaption>
  <h3>
    Coffee + HipHop
    <small>Monthly MeetUp</small>
  </h3>
  <p>
    Seattle
    <svg>...</svg>
  </p>
</figcaption>
```

<br>

**CSS**
```css
figcaption {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-end;
  gap: 1rem;

  & > h3 {
    display: grid;
    gap: .25rem;
  }

  & > p {
    grid-column: 2;
    justify-self: flex-end;
    width: max-content;

    display: inline-grid;
    gap: .5rem;
    grid-auto-flow: column;
    align-items: flex-end;
  }
}
```

<div class="note" style="margin-bottom: 4rem;">
  <b>Plain Speak:</b> The caption is a grid, the title is a grid, and the location is a grid. Each have their own rules and intrinsic value.
</div>

#### Caption grid
I want a grid of 2 columns, where the first column fills extra space and the 2nd is the width of it's content (intrinsic). Align the caption children to the bottom of the container. Put a healthy `1rem` gap between the columns.

#### Title and Sub-Title grid
Simple grid of rows with a small gap. This is convenient because the gap is only present **if** there are 2 child elements.

#### City and icon grid
The `<p>` is also a grid of columns with a gap between the icon and the city, all aligned to the bottom. It should also never be longer than the width of own intrinsic width.

<br><br>

# Incoming Chaos!
Let's delete things, make content short and long, and run this through a gauntlet to make sure it's resilient. Watch the following gif as I cause random chaos and check how the component's layout responds.

<figure style="text-align:center; margin: 4rem 0;">
  <img src="intrinsic-feature-card-chaos.gif" alt="">
</figure>

Turned out nice! The **height relationship** between the cards is really slick. See how a long title in one card has the other grow to match? So cool.

Also, the gradient background always fits the content. The city **isn't required**, the icon **isn't required**, the subtitle **isn't required**. The city, subtitle and title's can all be very long **without any breakage**.

There's **a healthy working little system** or algorithm here, and it's fun to watch it handle the attack.

<br><br>

# Responsive Final Touches
**None needed**, it's content outward!

<div class="note">
  <b>A parent grid is orchestrating the responsive areas</b>, and our intrinsic layout is resilient enough to handle it. <b>Another win for intrinsic</b> layout.
</div>


<figure style="text-align:center; margin: 4rem 0;">
  <img src="intrinsic-feature-mural-responsive.gif" alt="">
</figure>
