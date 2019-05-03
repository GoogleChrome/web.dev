---
title: Visual searching with the Perception Toolkit
subhead: Real-world interactivity without learning artificial intelligence
author: joemedley
date: 2019-05-07
hero: hero.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: A description of the hero image for screen reader users.
description: |
  Wouldn't it be great if users could search your site using their camera?
tags:
  - visual-search
---
Wouldn't it be great if users could search your site using their camera? Imagine
this. Your site is Razor McShaveyface. Your customers tell you they have trouble
finding the right cartridges for their razor when they reorder. They don't know
the right keywords for your product search. And let's be honest, they probably
never will.

What if they never need to? What if they could point their phone's camera at a
cartridge they already have and your site could present them with the right
cartridge and a big red "reorder" button?

Think about other scenarios. Imagine a site that supports in-store price
checking. Imagine getting information about a museum exhibit or historical
marker. Imagine identifying real-world landmarks in games like geocaching or
scavenger hunts.

These are the problems the Perception Toolkit solves and I'm going to introduce
you to it.

## How does it work?

The open-source Web Perception Toolkit helps you add visual search to your
website. It passes a device camera stream through a set of detectors that map
markers or targets to structured data on your site. With this data, you can
present the right information in a customizable UI.

I'll show you enough of this to give you a taste of how it works. For a complete
explanation, check out the Getting Started Guide, the toolkit reference, and the
demos.

## Customize the user experience

Getting UI elements is amazingly simple. The toolkit gives you livecycle events,
Card and Button objects for crafting the user experience around those events,
and an easy way to style the cards.

The most important lifecycle event is MarkerChanges, which is called every time
a marker is found. A marker is the toolkit's term for one of the real-world
objects you're using the toolkit to look for. A marker can be a physical object,
an image, a barcode, or a QR code.

The process for responding to the event is the same as for any other event.

```js
const container = document.querySelector('.container');
async function onMarkerChanges(event) {
  // Process the event.
}
window.addEventListener(PerceptionToolkit.Events.MarkerChanges, onMarkerChanges);
```

Let's look at the event more closely. The event itself contains arrays of
markers it's both found and lost. This helps account for hand and marker
movements: cameras not help steadily enough, dropped markers, that kind of
thing. As long as the toolkit finds the marker at some point, it will be in
either array.

```js
async function onMarkerChanges(event) {
  event.preventDefault();
  if (container. childNodes.length > 0) { return; }
  const { found, lost } = event.detail;
  // Deal with lost and found objects.
}
```

Next, we show an appropriate card based on what the toolkit found. Notice the
conveniences I've added to the user experience. Whether the marker is found or
not, I provide one-click access to what I think is most useful in the
circumstances.

```js
async function onMarkerChanges(event) {
  event.preventDefault();
  if (container. childNodes.length > 0) { return; }
  const { found, lost } = event.detail;
  const { Card } = PerceptionToolkit.Elements;
  if (found.length === 0 && lost.length === 0) {
    const card = new Card();
    card.src = 'We wish we could help, but that\'s not our razor. Would you like to see <a href="/catalog">our catalog</a>?';
    card.dataset.notRecognized = true;
    container.appendChild(card);
  } else if (found.length > 0 || lost.length > 0) {
    const card = new Card();
    card.src = found[0].content || lost[0].content;
    // The ActionButton object is also part of the toolkit.
    // Its instantiation is not shown.
    carc.appendChild(reorderActionButton);
    container.appendChild(card);
  }
}
```

Perception toolkit provides a built-in formatting for cards and buttons with the
default stylesheet. But you can easily add your own. The provided `Card` and
`ActionButton` object's contain `style` properties (among many others) that you
can use to put your organizational stamp on the look and feel. To include the
default stylesheet, add a link element to the pages that need it.

```html
<link rel="stylesheet" href="//path/to/toolkit/styles/perception-toolkit.css">
```

## Match structured data

The toolkit can't find just any object in the real world. You must provide it
with linked JSON data for the markers you want it to recognize. This data also
contains information about those markers that will be shown to the user.
Anything you add to a display card with card.src (see above) will be in addition
to what's provided by the linked data.

This data itself can either be in an external file or in the application page.
Both cases use a <script> tag. If you're new to linked data, notice the mime
type.

```html
<script type="application/ld+json" src="//path/to/your/sitemap.jsonld">
```

Or

```js
<script type="application/ld+json">
{
  "@context": "https://schema.googleapis.com/",
  "@type": "ARArtifact",
  "arTarget": {
    "@type": "Barcode",
    "text": "Inline Barcode"
  },
  "arContent": {
    "@type": "WebPage",
    "url": "http://example.com/item.html",
    "name": "Item name",
    "description": "A short description explaining a little more about the item.",
    "image": "http://example.com/images/item-image.jpg"
  }
}
</script>
```

## Conclusion

As I said at the top, this is not an exhaustive look at the Perception Toolkit.
Hopefully it gives you a sense of how easy it is to add visual searching to a
web site. Learn more with the Getting Started guide and the demo. Dig in to the
toolkit documentation all that it can do.
