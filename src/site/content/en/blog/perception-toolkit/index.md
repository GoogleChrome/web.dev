---
title: Visual searching with the Web Perception Toolkit
subhead: Easy to use real-world interactivity.
authors:
  - joemedley
date: 2019-05-07
hero: image/admin/SJQDe005xR0Cvu9JPt78.png
alt: A series of screens shows a phone camera scanning an image and generating a link.
description: |
  Wouldn't it be great if users could search your site using their camera?
tags:
  - blog
  - visual-search
feedback:
  - api
---
Wouldn't it be great if users could search your site using their camera? Imagine
this. Your site is Razor McShaveyface. Your customers tell you they have trouble
finding the right cartridges for their razor when they reorder. They don't know
the right keywords for your product search. And let's be honest, they probably
never will.

What if they never need to? What if they could point their phone's camera at the
UPC code on package and your site could present them with the right cartridge
and a big red "reorder" button?

Think of other ways you can use a camera on a site. Imagine a site that
supports in-store price checking. Imagine getting information about a museum
exhibit or historical marker. Imagine identifying real-world landmarks in games
like geocaching or scavenger hunts.

[The Web Perception Toolkit](https://github.com/GoogleChromeLabs/perception-toolkit)
makes these camera-based scenarios possible. In some cases you can even create
an experience without writing code.

## How does it work?

The open-source Web Perception Toolkit helps you add visual search to your
website. It passes a device camera stream through a set of detectors that map
real-world objects, here called "targets", to content on your site. This mapping is defined
using Structured Data (JSON-LD) on your site. With this data, you can present the right information in a customizable
UI.

I'll show you enough of this to give you a taste of how it works. For a complete
explanation, check out the [Getting
Started](https://perceptiontoolkit.dev/getting-started/) guide, the [toolkit
reference](https://perceptiontoolkit.dev/documentation/), the [I/O Sandbox demo](https://io.perceptiontoolkit.dev/) and the [sample demos](https://github.com/GoogleChromeLabs/perception-toolkit/tree/master/demo).

## Structured data

The toolkit can't find just any target in the camera's view. You must provide it
with linked JSON data for the targets you want it to recognize. This data also
contains information about those targets that will be shown to the user.

The data is all you need to create a user experience like the one in the image
below. If you do nothing else, the Web Perception Toolkit can identify targets,
then show and hide cards based on the information provided in the data. Try this
for yourself using our [artifact-map
demo](https://github.com/GoogleChromeLabs/perception-toolkit/tree/master/demo/artifact-map).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UD5t3RD9HZ7OIHVaAg31.png", alt="The default interface is available by using just the linked data.", width="300", height="518", class="w-screenshot" %}
  <figcaption class="w-figcaption w-figcaption--center">
    The default interface.
  </figcaption>
</figure>

Add data to your site with a JSON linked data file, included using a `<script>`
tag and the `"application/ld+json"` MIME type.

```html
<script type="application/ld+json" src="//path/to/your/sitemap.jsonld">
```

The file itself looks something like this:

```js
[
  {
    "@context": "https://schema.googleapis.com/",
    "@type": "ARArtifact",
    "arTarget": {
      "@type": "Barcode",
      "text": "012345678912"
    },
    "arContent": {
      "@type": "WebPage",
      "url": "http://localhost:8080/demo/artifact-map/products/product1.html",
      "name": "Product 1",
      "description": "This is a product with a barcode",
      "image": "http://localhost:8080/demo/artifact-map/products/product1.png"
    }
  }
]
```

## The user experience

What if you want more than the default user experience? The toolkit gives you
lifecycle events, Card and Button objects for crafting the user experience
around those events, and an easy way to style the cards. I'm going to show a
little of this with code based losely on our [Getting
Started](https://perceptiontoolkit.dev/getting-started/) guide.

The most important lifecycle event is `PerceivedResults`, which is fired every
time a target is found. A target can be a real-world object or a marker such as
a bar code or QR code.

The process for responding to this event is the same as for any other event with
an exception already alluded to. If you don't implement the event, a user
interface is automatically created using structured data. To override this
behavior start your event handler by calling`event.preventDefault()`.

```js
const container = document.querySelector('.container');
async function onPerceivedResults(event) {
  // preventDefault() to stop default result Card from showing.
  event.preventDefault();
  // Process the event.
}
window.addEventListener(PerceptionToolkit.Events.PerceivedResults, onPerceivedResults);
```

Let's look at the event more closely. The event itself contains arrays of
markers and targets that it has both found and lost. When targets are found in
the world, the even fires and passes found objects in `event.found`. Similarly,
when targets pass from the camera view the event fires again, passing lost
objects in `event.lost`. This helps account for hand and marker movements:
cameras not held steadily enough, dropped markers, that kind of thing.

```js/4
async function onPerceivedResults(event) {
  // preventDefault() to stop default result Card from showing
  event.preventDefault();
  if (container.childNodes.length > 0) { return; }
  const { found, lost } = event.detail;
  // Deal with lost and found objects.
}
```

Next, you show an appropriate card based on what the toolkit found.

```js/4-10
async function onPerceivedResults(event) {
  event.preventDefault();
  if (container.childNodes.length > 0) { return; }
  const { found, lost } = event.detail;
  if (found.length === 0 && lost.length === 0) {
    // Object not found.
    // Show a card with an offer to show the catalog.
  } else if (found.length > 0) {
    // Object found.
    // Show a card with a reorder button.
  }
}
```

Adding cards and buttons is simply a matter of instantiating them and appending
them to a parent object. For example:

```js
const { Card } = PerceptionToolkit.Elements;
const card = new Card();
card.src = 'Your message here.'
container.appendChild(card)'
```

Finally, here's what the whole thing looks like. Notice the conveniences I've
added to the user experience. Whether the marker is found or not, I provide
one-click access to what I think is most useful in the circumstances.

```js
async function onPerceivedResults(event) {
  // preventDefault() to stop default result Card from showing
  event.preventDefault();
  if (container.childNodes.length > 0) { return; }
  const { found, lost } = event.detail;
  const { ActionButton, Card } = PerceptionToolkit.Elements;
  if (found.length === 0 && lost.length === 0) {
    //Make a view catalog button.
    const button =  new ActionButton();
    button.label = 'View catalog';
    button.addEventListener('click', () => {
      card.close();
      //Run code to launch a catalog.
    });
    //Make a card for the button.
    const card = new Card();
    card.src = 'We wish we could help, but that\'s not our razor. Would you like to see our catalog?';
    card.appendChild(button);
    //Tell the toolkit it does not keep the card around
    // if it finds something it recognizes.
    card.dataset.notRecognized = true;
    container.appendChild(card);
  } else if (found.length > 0) {
    //Make a reorder button.
    const button = new ActionButton();
    button.label = 'Reorder';
    botton.addEventListener('click', () => {
      card.close();
      //Run code to reorder.
    })
    const card = new Card();
    card.src = found[0].content;
    card.appendChild(button);
    container.appendChild(card);
  }
}
```

## Formatting cards

The Web Perception Toolkit provides built-in formatting for cards and buttons
with the default stylesheet. But you can easily add your own. The provided
`Card` and `ActionButton` objects contain `style` properties (among many others)
that let you put your organizational stamp on the look and feel. To include the
default stylesheet, add a `<link>` element to your page.

```html
<link rel="stylesheet" href="//path/to/toolkit/styles/perception-toolkit.css">
```

## Conclusion

As I said at the top, this is not an exhaustive look at the [Web Perception
Toolkit](https://github.com/GoogleChromeLabs/perception-toolkit). Hopefully it gives
you a sense of how easy it is to add visual searching to a website. Learn more
with the [Getting Started](https://perceptiontoolkit.dev/getting-started/) guide
and the [sample
demos](https://github.com/GoogleChromeLabs/perception-toolkit/tree/master/demo).
Dig in to the [toolkit
documentation](https://perceptiontoolkit.dev/documentation/) to learn what it
can do.
