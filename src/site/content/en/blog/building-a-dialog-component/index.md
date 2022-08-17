---
layout: post
title: Building a dialog component
subhead: A foundational overview of how to build color-adaptive, responsive, and accessible mini and mega modals with the <dialog> element.
authors:
  - adamargyle
description: A foundational overview of how to build color-adaptive, responsive, and accessible mini and mega modals with the <dialog> element.
date: 2022-04-13
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/7l53GAQu1kmIuqOmTjRI.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/iVRNS1o7v27mmBPQiDdk.png
alt: Preview of the mini and mega dialogs in both light and dark themes.
tags:
  - blog
  - css
  - html
  - javascript
---

In this post I want to share my thoughts on how to build color-adaptive,
responsive, and accessible mini and mega modals with the `<dialog>` element.
[Try the demo](https://gui-challenges.web.app/dialog/dist/) and [view the
source](https://github.com/argyleink/gui-challenges)!

<figure data-size="full">
  <style style="display: none">
    .adjusted-aspect-ratio {
      aspect-ratio: 4/3;
    }
  </style>
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/rx8k6w5iQnEOwqOoUNNG.mp4",
    autoplay="true",
    loop="true",
    muted="true",
    class="adjusted-aspect-ratio"
  %}
  <figcaption>
    Demonstration of the mega and mini dialogs in their light and dark themes.
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'GDzzIlRhEzM' %}

## Overview

The
[`<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog)
element is great for in-page contextual information or action. Consider when the
user experience can benefit from a same page action instead of multi-page
action: perhaps because the form is small or the only action required from the
user is confirm or cancel.

The `<dialog>` element has recently become stable across browsers:

{% BrowserCompat 'html.elements.dialog' %}

I found the element was missing a few things, so in this [GUI
Challenge](https://a.nerdy.dev/gui-challenges) I add the developer experience
items I expect: additional events, light dismiss, custom animations, and a mini
and mega type.

## Markup

The essentials of a `<dialog>` element are modest. The element will
automatically be hidden and has styles built in to overlay your content.

```html
<dialog>
  …
</dialog>
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'popLbZB',
  height: 300,
  theme: 'auto',
  tab: 'html,result'
} %}

We can improve this baseline.

Traditionally, a dialog element shares a lot with a modal, and often the names
are interchangeable. I took the liberty here of using the dialog element for
both small dialog popups (mini), as well as full page dialogs (mega). I named
them mega and mini, with both dialogs slightly adapted for different use cases.
I added a `modal-mode` attribute to allow you to specify the type:

```html
<dialog id="MegaDialog" modal-mode="mega"></dialog>
<dialog id="MiniDialog" modal-mode="mini"></dialog>
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/OoSjF29FsSO81nkImk7o.png", 
  alt="Screenshot of both the mini and the mega dialogs in both light and dark themes.", 
  width="800", 
  height="900" 
%}

Not always, but generally dialog elements will be used to gather some
interaction information. [Forms inside dialog elements are made to go
together](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/returnValue).
It's a good idea to have a form element wrap your dialog content so that
JavaScript can access the data the user has entered. Furthermore, buttons inside
a form using `method="dialog"` can close a dialog without JavaScript and pass
data.

```html
<dialog id="MegaDialog" modal-mode="mega">
  <form method="dialog">
    …
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>
```

### Mega dialog

A mega dialog has three elements inside the form:
[`<header>`](https://developer.mozilla.org/docs/Web/HTML/Element/header),
[`<article>`](https://developer.mozilla.org/docs/Web/HTML/Element/article),
and
[`<footer>`](https://developer.mozilla.org/docs/Web/HTML/Element/footer).
These serve as semantic containers, as well as style targets for the
presentation of the dialog. The header titles the modal and offers a close
button. The article is for form inputs and information. The footer holds a
[`<menu>`](https://developer.mozilla.org/docs/Web/HTML/Element/menu) of
action buttons.

```html
<dialog id="MegaDialog" modal-mode="mega">
  <form method="dialog">
    <header>
      <h3>Dialog title</h3>
      <button onclick="this.closest('dialog').close('close')"></button>
    </header>
    <article>...</article>
    <footer>
      <menu>
        <button autofocus type="reset" onclick="this.closest('dialog').close('cancel')">Cancel</button>
        <button type="submit" value="confirm">Confirm</button>
      </menu>
    </footer>
  </form>
</dialog>
```

The first menu button has
[`autofocus`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autofocus)
and an `onclick` inline event handler. The `autofocus` attribute will receive
focus when the dialog is opened, and I find it's best practice to put this on
the cancel button, not the confirm button. This ensures that confirmation is
deliberate and not accidental. 

{% Aside %} 
The `onclick` handler contains some JavaScript which will find its nearest
parent dialog element and closes it, passing string data "cancel", so close
event handlers can inform developers which button was clicked. 
{% endAside %}

### Mini dialog

The mini dialog is very similar to the mega dialog, it's just missing a
`<header>` element. This allows it to be smaller and more inline.

```html
<dialog id="MiniDialog" modal-mode="mini">
  <form method="dialog">
    <article>
      <p>Are you sure you want to remove this user?</p>
    </article>
    <footer>
      <menu>
        <button autofocus type="reset" onclick="this.closest('dialog').close('cancel')">Cancel</button>
        <button type="submit" value="confirm">Confirm</button>
      </menu>
    </footer>
  </form>
</dialog>
```

The dialog element provides a strong foundation for a full viewport element that
can collect data and user interaction. These essentials can make for some very
interesting and powerful interactions in your site or app.

## Accessibility

The dialog element has very good built-in accessibility. Instead of adding these
features like I usually do, many are already there. 

### Restoring focus

As we did by hand in [Building a sidenav
component](/building-a-sidenav-component/), it's important that
opening and closing something properly puts focus on the relevant open and close
buttons. When that sidenav opens, focus is put on the close button. When the
close button is pressed, focus is restored to the button that opened it.

With the dialog element, this is built-in default behavior:

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/QJNfNwV4Nev5Ax4xKteM.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

Unfortunately, if you want to animate the dialog in and out, this functionality
is lost. In the [JavaScript section](#javascript) I'll be restoring that
functionality.

### Trapping focus

The dialog element manages
[`inert`](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)
for you on the document. Before `inert`, JavaScript was used to watch for focus
leaving an element, at which point it intercepts and puts it back.

{% BrowserCompat 'api.HTMLElement.inert' %}

After `inert`, any parts of the document can be "frozen" insomuch that they are
no longer focus targets or are interactive with a mouse. Instead of trapping
focus, focus is guided into the only interactive part of the document.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Cq08CQakxuwmUCR9r7c0.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Open and auto focus an element

By default, the dialog element will assign focus to the first focusable element
in the dialog markup. If this isn't the best element for the user to default to,
use the `autofocus` attribute. As described earlier, I find it's best practice
to put this on the cancel button and not the confirm button. This ensures that
confirmation is deliberate and not accidental.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/GSNvEAOJh7nxO0IWkAer.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Closing with the escape key

It's important to make it easy to close this potentially interruptive element.
Fortunately, the dialog element will handle the escape key for you, freeing you
from the orchestration burden.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/dH44OevxBNsEY8K9Q80G.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

## Styles

There's an easy path to styling the dialog element and a hard path. The easy
path is achieved by not changing the display property of the dialog and working
with its limitations. I go down the hard path to provide custom animations for
opening and closing the dialog, taking over the `display` property and more.

### Styling with Open Props

To accelerate adaptive colors and overall design consistency, I've shamelessly
brought in my CSS variable library [Open Props](https://open-props.style/). In
addition to the free provided variables, I also import a
[normalize](https://codepen.io/argyleink/pen/KKvRORE) file and some
[buttons](https://codepen.io/argyleink/pen/gOXbvjj), both of which Open Props
provides as optional imports. These imports help me focus on customizing the
dialog and demo while not needing a lot of styles to support it and make it look
good.

### Styling the `<dialog>` element

#### Owning the display property

The default show and hide behavior of a dialog element toggles the display
property from `block` to `none`. This unfortunately means it can't be animated
in and out, only in. I'd like to animate both in and out, and the first step is
to set my own
[display](https://developer.mozilla.org/docs/Web/CSS/display) property:

```css
dialog {
  display: grid;
}
```

By changing, and therefore owning, the display property value, as shown in the
above CSS snippet, a considerable amount of styles needs managed in order to
facilitate the proper user experience. First, the default state of a dialog is
closed. You can represent this state visually and prevent the dialog from
receiving interactions with the following styles:

```css
dialog:not([open]) {
  pointer-events: none;
  opacity: 0;
}
```

Now the dialog is invisible and cannot be interacted with when not open. Later
I'll add some JavaScript to manage the `inert` attribute on the dialog, ensuring
that keyboard and screen-reader users also can't reach the hidden dialog.

#### Giving the dialog an adaptive color theme

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/IUZ0U0gAcYU9NddPnzIL.png", 
  alt="Mega dialog showing the light and dark theme, demonstrating the surface colors.", 
  width="800", 
  height="266" 
%}

While [`color-scheme`](/color-scheme) opts your document into a browser-provided
adaptive color theme to light and dark system preferences, I wanted to customize
the dialog element more than that. Open Props provides a few [surface
colors](https://codepen.io/argyleink/pen/KKvRORE) that adapt automatically to
light and dark system preferences, similar to using the `color-scheme`. These
are great for creating layers in a design and I love using color to help
visually support this appearance of layer surfaces. The background color is
`var(--surface-1)`; to sit on top of that layer, use `var(--surface-2)`:

```css
dialog {
  …
  background: var(--surface-2);
  color: var(--text-1);
}

@media (prefers-color-scheme: dark) {
  dialog {
    border-block-start: var(--border-size-1) solid var(--surface-3);
  }
}
```

More adaptive colors will be added later for child elements, such as the header
and footer. I consider them extra for a dialog element, but really important in
making a compelling and well designed dialog design.

{% Aside %}
For a deep dive on adaptive color systems, 
see the [building a color scheme](/building-a-color-scheme/) GUI Challenge.
{% endAside %}

#### Responsive dialog sizing

The dialog defaults to delegating its size to its contents, which is generally
great. My goal here is to constrain the
[`max-inline-size`](https://developer.mozilla.org/docs/Web/CSS/max-inline-size)
to a readable size (`--size-content-3` = `60ch`) or 90% of the viewport width. This
ensures the dialog won't go edge to edge on a mobile device, and won't be so
wide on a desktop screen that it's hard to read. Then I add a
[`max-block-size`](https://developer.mozilla.org/docs/Web/CSS/max-block-size)
so the dialog won't exceed the height of the page. This also means that we'll
need to specify where the scrollable area of the dialog is, in case it's a tall
dialog element.

```css
dialog {
  …
  max-inline-size: min(90vw, var(--size-content-3));
  max-block-size: min(80vh, 100%);
  max-block-size: min(80dvb, 100%);
  overflow: hidden;
}
```

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/lf2PL5E3VQjpteVhQMUl.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

Notice how I have `max-block-size` twice? The first uses `80vh`, a physical
viewport unit. What I really want is to keep the dialog within relative flow,
for international users, so I use the logical, newer, and only partially
supported `dvb` unit in the second declaration for when it becomes more stable.

{% BrowserCompat 'css.types.length.dvb' %}

#### Mega dialog positioning

To assist in positioning a dialog element, it's worth breaking down its two
parts: the full screen backdrop and the dialog container. The backdrop must
cover everything, providing a shade effect to help support that this dialog is
in front and the content behind is inaccessible. The dialog container is free to
center itself over this backdrop and take whatever shape its contents require.

The following styles fix the dialog element to the window, stretching it to each
corner, and uses `margin: auto` to center the content:

```css
dialog {
  …
  margin: auto;
  padding: 0;
  position: fixed;
  inset: 0;
  z-index: var(--layer-important);
}
```

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/fsjCyaR7hwOKuSuL0jPk.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

##### Mobile mega dialog styles

On small viewports, I style this full page mega modal a little differently. I
set the bottom margin to `0`, which brings the dialog content to the bottom of
the viewport. With a couple of style adjustments, I can turn the dialog into an
actionsheet, closer to the user's thumbs:

```css
@media (max-width: 768px) {
  dialog[modal-mode="mega"] {
    margin-block-end: 0;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/pmvxlxa2b3SnTnCow5gi.png", 
  alt="Screenshot of devtools overlaying margin spacing 
  on both the desktop and mobile mega dialog while open.", 
  width="800", 
  height="484" 
%}

##### Mini dialog positioning

When using a larger viewport such as on a desktop computer, I chose to position the mini dialogs over
the element that called them. To do this I need JavaScript. [You can find the
technique I use
here](https://github.com/argyleink/gui-challenges/blob/main/dialog/index.js#L92-L102),
but I feel it is beyond the scope of this article. Without the JavaScript, the
mini dialog appears in the center of the screen, just like mega dialog.

#### Make it pop

Last, add some flair to the dialog so it looks like a soft surface sitting far
above the page. The softness is achieved by rounding the corners of the dialog.
The depth is achieved with one of Open Props’ carefully crafted [shadow
props](https://open-props.style/#shadows):

```css
dialog {
  …
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-6);
}
```

#### Customizing the backdrop pseudo element

I chose to work very lightly with the backdrop, only adding a blur effect with
[`backdrop-filter`](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter)
to the mega dialog:

{% BrowserCompat 'css.properties.backdrop-filter' %}

```css
dialog[modal-mode="mega"]::backdrop {
  backdrop-filter: blur(25px);
}
```

I also chose to put a transition on `backdrop-filter`, in the hope that browsers
will allow transitioning the backdrop element in the future:

```css
dialog::backdrop {
  transition: backdrop-filter .5s ease;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/lufi4kzHHbEnnEVbZoFD.png", 
  alt="Screenshot of the mega dialog overlaying a blurred background of colorful avatars.", 
  width="800", 
  height="509" 
%}

### Styling extras

I call this section "extras" because it has more to do with my dialog element
demo than it does the dialog element in general. 

#### Scroll containment

When the dialog is shown, the user is still able to scroll the page behind it,
which I do not want:

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/lapJyCRzEGbyrRyUBbRC.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

Normally,
[`overscroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior)
would be my usual solution, but [according to the
spec](https://drafts.csswg.org/css-overscroll-1/#ref-for-scroll-container%E2%91%A0%E2%91%A1:~:text=An%20element%20that%20is%20not%20scroll,methods%20supported%20by%20the%20user%20agent),
it has no effect on the dialog because it's not a scroll port, that is, it's not
a scroller so there's nothing to prevent. I could use JavaScript to watch for
the new events from this guide, such as "closed" and "opened", and toggle
`overflow: hidden` on the document, or I could wait for `:has()` to be stable in
all browsers:

{% BrowserCompat 'css.selectors.has' %}

```css
html:has(dialog[open][modal-mode="mega"]) {
  overflow: hidden;
}
```

Now when a mega dialog is open, the html document has `overflow: hidden`.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/EUrleQ6ToGCZw4ttUOVO.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

#### The `<form>` layout

Besides being a very important element for collecting the interaction
information from the user, I use it here to lay out the header, footer and
article elements. With this layout I intend to articulate the article child as a
scrollable area. I achieve this with
[`grid-template-rows`](https://developer.mozilla.org/docs/Web/CSS/grid-template-rows).
The article element is given `1fr` and the form itself has the same maximum
height as the dialog element. Setting this firm height and firm row size is what
allows the article element to be constrained and scroll when it overflows:

```css
dialog > form {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: start;
  max-block-size: 80vh;
  max-block-size: 80dvb;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/hj2polE46D4rQJGW4yaZ.png", 
  alt="Screenshot of devtools overlaying the grid layout information over the rows.", 
  width="800", 
  height="443" 
%}

#### Styling the dialog `<header>`

The role of this element is to provide a title for the dialog content and offer
an easy to find close button. It's also given a surface color to make it appear
to be behind the dialog article content. These requirements lead to a flexbox
container, vertically aligned items that are spaced to their edges, and some
padding and gaps to give the title and close buttons some room:

```css
dialog > form > header {
  display: flex;
  gap: var(--size-3);
  justify-content: space-between;
  align-items: flex-start;
  background: var(--surface-2);
  padding-block: var(--size-3);
  padding-inline: var(--size-5);
}

@media (prefers-color-scheme: dark) {
  dialog > form > header {
    background: var(--surface-1);
  }
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/sL4DfytpIAeOWJP5Xr1i.png", 
  alt="Screenshot of Chrome Devtools overlaying flexbox layout information on the dialog header.", 
  width="800", 
  height="525" 
%}

##### Styling the header close button

Since the demo is using the Open Props buttons, the close button is customized
into a round icon centric button like so:

```css
dialog > form > header > button {
  border-radius: var(--radius-round);
  padding: .75ch;
  aspect-ratio: 1;
  flex-shrink: 0;
  place-items: center;
  stroke: currentColor;
  stroke-width: 3px;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/gl0aIe6SaZ7a9jGIvzBi.png", 
  alt="Screenshot of Chrome Devtools overlaying sizing and padding information for the header close button.", 
  width="800", 
  height="469" 
%}

#### Styling the dialog `<article>`

The article element has a special role in this dialog: it's a space intended to
be scrolled in the case of a tall or long dialog.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/cpxeed80hrPUPD0LB2M9.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

To accomplish this, the parent form element has established some maximums for
itself which provide constraints for this article element to reach if it gets
too tall. Set `overflow-y: auto` so scrollbars are only shown when needed,
contain scrolling within it with `overscroll-behavior: contain`, and the rest
will be custom presentation styles:

```css
dialog > form > article {
  overflow-y: auto; 
  max-block-size: 100%; /* safari */
  overscroll-behavior-y: contain;
  display: grid;
  justify-items: flex-start;
  gap: var(--size-3);
  box-shadow: var(--shadow-2);
  z-index: var(--layer-1);
  padding-inline: var(--size-5);
  padding-block: var(--size-3);
}

@media (prefers-color-scheme: light) {
  dialog > form > article {
    background: var(--surface-1);
  }
}
```

#### Styling the dialog `<footer>`

The footer's role is to contain menus of action buttons. Flexbox is used to
align the content to the end of the footer inline axis, then some spacing to
give the buttons some room.

```css
dialog > form > footer {
  background: var(--surface-2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-3);
  justify-content: space-between;
  align-items: flex-start;
  padding-inline: var(--size-5);
  padding-block: var(--size-3);
}

@media (prefers-color-scheme: dark) {
  dialog > form > footer {
    background: var(--surface-1);
  }
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/EGKtn9rEwllUCtvqQkRi.png", 
  alt="Screenshot of Chrome Devtools overlaying flexbox layout information on the footer element.", 
  width="800", 
  height="517" 
%}

##### Styling the dialog footer menu

The [`menu`](https://developer.mozilla.org/docs/Web/HTML/Element/menu)
element is used to contain the action buttons for the dialog. It uses a wrapping
flexbox layout with `gap` to provide space between the buttons. Menu elements
have padding such as a `<ul>`. I also remove that style since I don't need it.

```css
dialog > form > footer > menu {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-3);
  padding-inline-start: 0;
}

dialog > form > footer > menu:only-child {
  margin-inline-start: auto;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zUzkTtb0nGCeWtaJiue3.png", 
  alt="Screenshot of Chrome Devtools overlaying flexbox information on the footer menu elements.", 
  width="800", 
  height="522" 
%}

## Animation

Dialog elements are often animated because they enter and exit the window.
Giving dialogs some supportive motion for this entrance and exit helps users
orient themselves in the flow. 

Normally the dialog element can only be animated in, not out. This is because
the browser toggles the `display` property on the element. Earlier, the guide
set display to grid, and never sets it to none. This unlocks the ability to
animate in and out.

Open Props comes with many [keyframe
animations](https://open-props.style/#animations) for use, which makes
orchestration easy and legible. Here are the animation goals and layered
approach I took:

1. Reduced motion is the default transition, a simple opacity fade in and out.
1. If motion is ok, slide and scale animations are added.
1. The responsive mobile layout for the mega dialog is adjusted to slide out.

### A safe and meaningful default transition

While Open Props comes with keyframes for fading in and out, I prefer this
layered approach of transitions as the default with keyframe animations as
potential upgrades. Earlier we already styled the dialog’s visibility with
opacity, orchestrating `1` or `0` depending on the `[open]` attribute. To
transition between 0% and 100%, tell the browser how long and what kind of
easing you'd like:

```css
dialog {
  transition: opacity .5s var(--ease-3);
}
```

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/UzlJyhu1WDqbJLw0327C.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Adding motion to the transition

If the user is ok with motion, both the mega and the mini dialogs should slide
up as their entrance, and scale out as their exit. You can achieve this with the
`prefers-reduced-motion` media query and a few Open Props:

```css
@media (prefers-reduced-motion: no-preference) {
  dialog {
    animation: var(--animation-scale-down) forwards;
    animation-timing-function: var(--ease-squish-3);
  }

  dialog[open] {
    animation: var(--animation-slide-in-up) forwards;
  }
}
```

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/CD4Bmk1moLD2nWonMEwm.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

{% Aside %}
The `animation-timing-function` is set to `var(--ease-squish-3)`, 
an expressive [easing effect](https://open-props.style/#easing) 
available from Open Props. 
It gives the exit animation a nice playful pop.
{% endAside %}

#### Adapting the exit animation for mobile

Earlier in the styling section, the mega dialog style is adapted for mobile
devices to be more like an action sheet, as if a small piece of paper has slid
up from the bottom of the screen and is still attached to the bottom. The scale
out exit animation doesn't fit this new design well, and we can adapt this with
a couple media queries and some Open Props:

```css
@media (prefers-reduced-motion: no-preference) and @media (max-width: 768px) {
  dialog[modal-mode="mega"] {
    animation: var(--animation-slide-out-down) forwards;
    animation-timing-function: var(--ease-squish-2);
  }
}
```

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/dpswjyPOJdnWUWlz0fUX.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

## JavaScript

There are quite a few things to add with JavaScript:

```js
// dialog.js
export default async function (dialog) {
  // add light dismiss
  // add closing and closed events
  // add opening and opened events
  // add removed event
  // removing loading attribute
}
```

These additions stem from the desire for light dismiss (clicking the dialog
backdrop), animation, and some additional events for better timing on getting
the form data.

### Adding light dismiss

This task is straightforward and a great addition to a dialog element that isn't
being animated. The interaction is achieved by watching clicks on the dialog
element and leveraging [event
bubbling](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)
to assess what was clicked, and will only
[`close()`](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event)
if it's the top-most element:

```js
export default async function (dialog) {
  dialog.addEventListener('click', lightDismiss)
}

const lightDismiss = ({target:dialog}) => {
  if (dialog.nodeName === 'DIALOG')
    dialog.close('dismiss')
}
```

Notice `dialog.close('dismiss')`. The event is called and a string is provided.
This string can be retrieved by other JavaScript to get insights into how the
dialog was closed. You'll find I've also provided close strings each time I call
the function from various buttons, to provide context to my application about
the user interaction.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/oXnc7zJCjzrlSejpjIUJ.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Adding closing and closed events

The dialog element comes with a close event: it emits immediately when the
dialog `close()` function is called. Since we're animating this element, it's
nice to have events for before and after the animation, for a change to grab the
data or reset the dialog form. I use it here to manage the addition of the
`inert` attribute on the closed dialog, and in the demo I use these to modify
the avatar list if the user has submitted a new image.

To achieve this, create two new events called `closing` and `closed`. Then
listen for the built-in close event on the dialog. From here, set the dialog to
`inert` and dispatch the `closing` event. The next task is to wait for the
animations and transitions to finish running on the dialog, then dispatch the
`closed` event.

```js
const dialogClosingEvent = new Event('closing')
const dialogClosedEvent  = new Event('closed')

export default async function (dialog) {
  …
  dialog.addEventListener('close', dialogClose)
}

const dialogClose = async ({target:dialog}) => {
  dialog.setAttribute('inert', '')
  dialog.dispatchEvent(dialogClosingEvent)

  await animationsComplete(dialog)

  dialog.dispatchEvent(dialogClosedEvent)
}

const animationsComplete = element =>
  Promise.allSettled(
    element.getAnimations().map(animation => 
      animation.finished))
```

The `animationsComplete` function, which is also used in the [Building a toast
component](/building-a-toast-component/), returns a promise based on the
completion of the animation and transition promises. This is why `dialogClose`
is an [async
function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function);
it can then
[`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await)
the promise returned and move forward confidently to the closed event.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/eLnkx3J99MwuDsTbbOHi.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Adding opening and opened events

These events aren't as easy to add since the built-in dialog element doesn't
provide an open event like it does with close. I use a
[MutationObserver](https://developer.mozilla.org/docs/Web/API/MutationObserver)
to provide insights into the dialog’s attributes changing. In this observer,
I'll watch for changes to the open attribute and manage the custom events
accordingly.

Similar to how we started the closing and closed events, create two new events
called `opening` and `opened`. Where we previously listened for the dialog close
event, this time use a created mutation observer to watch the dialog's
attributes.

```js
…
const dialogOpeningEvent = new Event('opening')
const dialogOpenedEvent  = new Event('opened')

export default async function (dialog) {
  …
  dialogAttrObserver.observe(dialog, { 
    attributes: true,
  })
}

const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async mutation => {
    if (mutation.attributeName === 'open') {
      const dialog = mutation.target

      const isOpen = dialog.hasAttribute('open')
      if (!isOpen) return

      dialog.removeAttribute('inert')

      // set focus
      const focusTarget = dialog.querySelector('[autofocus]')
      focusTarget
        ? focusTarget.focus()
        : dialog.querySelector('button').focus()

      dialog.dispatchEvent(dialogOpeningEvent)
      await animationsComplete(dialog)
      dialog.dispatchEvent(dialogOpenedEvent)
    }
  })
})
```

The mutation observer callback function will be called when the dialog
attributes are changed, providing the list of changes as an array. Iterate over
the attribute changes, looking for the `attributeName` to be open. Next, check
if the element has the attribute or not: this informs whether or not the dialog
has become open. If it has been opened, remove the `inert` attribute, set focus
to either an element requesting
[`autofocus`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autofocus)
or the first `button` element found in the dialog. Last, similar to the closing
and closed event, dispatch the opening event right away, wait for the animations
to finish, then dispatch the opened event.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/hardcBSWvvpnrKtr8kX2.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Adding a removed event

In single page applications, dialogs are often added and removed based on routes
or other application needs and state. It can be useful to clean up events or
data when a dialog is removed. 

You can achieve this with another mutation observer. This time, instead of
observing attributes on a dialog element, we'll observe the children of the body
element and watch for dialog elements being removed.

```js
…
const dialogRemovedEvent = new Event('removed')

export default async function (dialog) {
  …
  dialogDeleteObserver.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  })
}

const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(removedNode => {
      if (removedNode.nodeName === 'DIALOG') {
        removedNode.removeEventListener('click', lightDismiss)
        removedNode.removeEventListener('close', dialogClose)
        removedNode.dispatchEvent(dialogRemovedEvent)
      }
    })
  })
})
```

The mutation observer callback is called whenever children are added or removed
from the body of the document. The specific mutations being watched are for
`removedNodes` that have the
[`nodeName`](https://developer.mozilla.org/docs/Web/API/Node/nodeName) of
a dialog. If a dialog was removed, the click and close events are removed to
free up memory, and the custom removed event is dispatched.

### Removing the loading attribute

To prevent the dialog animation from playing its exit animation when added to
the page or on page load, a loading attribute has been added to the dialog. The
following script waits for the dialog animations to finish running, then removes
the attribute. Now the dialog is free to animate in and out, and we've
effectively hidden an otherwise distracting animation. 

```js
export default async function (dialog) {
  …
  await animationsComplete(dialog)
  dialog.removeAttribute('loading')
}
```

Learn more about the problem of [preventing keyframe animations on page load
here](https://stackoverflow.com/questions/27938900/how-to-prevent-a-css-keyframe-animation-from-running-on-page-load).

### All together 

Here is `dialog.js` in its entirety, now that we've explained each section
individually:

```js
// custom events to be added to <dialog>
const dialogClosingEvent = new Event('closing')
const dialogClosedEvent  = new Event('closed')
const dialogOpeningEvent = new Event('opening')
const dialogOpenedEvent  = new Event('opened')
const dialogRemovedEvent = new Event('removed')

// track opening
const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async mutation => {
    if (mutation.attributeName === 'open') {
      const dialog = mutation.target

      const isOpen = dialog.hasAttribute('open')
      if (!isOpen) return

      dialog.removeAttribute('inert')

      // set focus
      const focusTarget = dialog.querySelector('[autofocus]')
      focusTarget
        ? focusTarget.focus()
        : dialog.querySelector('button').focus()

      dialog.dispatchEvent(dialogOpeningEvent)
      await animationsComplete(dialog)
      dialog.dispatchEvent(dialogOpenedEvent)
    }
  })
})

// track deletion
const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(removedNode => {
      if (removedNode.nodeName === 'DIALOG') {
        removedNode.removeEventListener('click', lightDismiss)
        removedNode.removeEventListener('close', dialogClose)
        removedNode.dispatchEvent(dialogRemovedEvent)
      }
    })
  })
})

// wait for all dialog animations to complete their promises
const animationsComplete = element =>
  Promise.allSettled(
    element.getAnimations().map(animation => 
      animation.finished))

// click outside the dialog handler
const lightDismiss = ({target:dialog}) => {
  if (dialog.nodeName === 'DIALOG')
    dialog.close('dismiss')
}

const dialogClose = async ({target:dialog}) => {
  dialog.setAttribute('inert', '')
  dialog.dispatchEvent(dialogClosingEvent)

  await animationsComplete(dialog)

  dialog.dispatchEvent(dialogClosedEvent)
}

// page load dialogs setup
export default async function (dialog) {
  dialog.addEventListener('click', lightDismiss)
  dialog.addEventListener('close', dialogClose)

  dialogAttrObserver.observe(dialog, { 
    attributes: true,
  })

  dialogDeleteObserver.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  })

  // remove loading attribute
  // prevent page load @keyframes playing
  await animationsComplete(dialog)
  dialog.removeAttribute('loading')
}
```

### Using the `dialog.js` module

The exported function from the module expects to be called and passed a dialog
element that wants to have these new events and functionality added:

```js
import GuiDialog from './dialog.js'

const MegaDialog = document.querySelector('#MegaDialog')
const MiniDialog = document.querySelector('#MiniDialog')

GuiDialog(MegaDialog)
GuiDialog(MiniDialog)
```

Just like that, the two dialogs are upgraded with light dismiss, animation
loading fixes, and more events to work with.

#### Listening to the new custom events

Each upgraded dialog element can now listen for five new events, like this:

```js
MegaDialog.addEventListener('closing', dialogClosing)
MegaDialog.addEventListener('closed', dialogClosed)

MegaDialog.addEventListener('opening', dialogOpening)
MegaDialog.addEventListener('opened', dialogOpened)

MegaDialog.addEventListener('removed', dialogRemoved)
```

Here are two examples of handling those events:

```js
const dialogOpening = ({target:dialog}) => {
  console.log('Dialog opening', dialog)
}

const dialogClosed = ({target:dialog}) => {
  console.log('Dialog closed', dialog)
  console.info('Dialog user action:', dialog.returnValue)

  if (dialog.returnValue === 'confirm') {
    // do stuff with the form values
    const dialogFormData = new FormData(dialog.querySelector('form'))
    console.info('Dialog form data', Object.fromEntries(dialogFormData.entries()))

    // then reset the form
    dialog.querySelector('form')?.reset()
  }
}
```

In the demo that I built with the dialog element, I use that closed event and
the form data to add a new avatar element to the list. The timing is good in
that the dialog has completed its exit animation, and then some scripts animate
in the new avatar. Thanks to the new events, orchestrating the user experience
can be smoother.

Notice `dialog.returnValue`: this contains the close string passed when the
dialog `close()` event is called. It's critical in the `dialogClosed` event to
know if the dialog was closed, canceled, or confirmed. If it's confirmed, the
script then grabs the form values and resets the form. The reset is useful so
that when the dialog is shown again, it's blank and ready for a new submission.

## Conclusion

Now that you know how I did it, how would you‽ 🙂

Let's diversify our approaches and learn all the ways to build on the web.

Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

- [@GrimLink](https://twitter.com/GrimLink) with a [3-in-1
  dialog](https://fylgja.dev/components/dialog/).
- [@mikemai2awesome](https://twitter.com/mikemai2awesome) with [a nice
  remix](https://codepen.io/mikemai2awesome/pen/dyJgPxX) that doesn't change the
  `display` property.
- [@geoffrich_](https://twitter.com/geoffrich_) with
  [Svelte](https://github.com/geoffrich/dialog-gui-challenge-svelte) and nice
  [Svelte FLIP](https://svelte.dev/docs#run-time-svelte-animate-flip) polish.

### Resources

- [Source code](https://github.com/argyleink/gui-challenges/tree/main/dialog) on Github
- [Doodle Avatars](https://doodleipsum.com/)

