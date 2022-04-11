---
layout: post
title: Building a loading bar component
subhead: A foundational overview of how to build a color adaptive and accessible loading bar with the <progress> element.
authors:
  - adamargyle
description: A foundational overview of how to build a color adaptive and accessible loading bar with the <progress> element.
date: 2022-03-16
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/LIq0Z4XYtFp7WLnZmmNO.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/LIq0Z4XYtFp7WLnZmmNO.png
alt: Loading bars repeated and placed to create a pattern
tags:
  - blog
  - css
  - html
  - javascript
---

In this post I want to share thinking on how to build a color adaptive and
accessible loading bar with the `<progress>` element. [Try the
demo](https://gui-challenges.web.app/progress/dist/) and [view the
source](https://github.com/argyleink/gui-challenges)!

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IT7KpbHsrr1SydvFBzTm.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Light and dark, indeterminate, increasing, and completion demoed on Chrome.
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'TD1QxlGgIPk' %}

## Overview

The
[`<progress>`](https://developer.mozilla.org/docs/Web/HTML/Element/progress)
element provides visual and audible feedback to users about completion. This
visual feedback is valuable for scenarios such as: progress through a form,
displaying downloading or uploading information, or even showing that the
progress amount is unknown but work is still active. 

This [GUI Challenge](https://github.com/argyleink/gui-challenges) worked with
the existing HTML `<progress>` element to save some effort in accessibility. The
colors and layouts push the limits of customization for the built-in element, to
modernize the component and have it fit better within design systems. 

<figure>
  {% 
    Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/AXYPSsW7HQ21qfWgdlsy.png", 
    alt="Light and dark tabs in each browser providing an 
    overview of the adaptive icon from top to bottom: 
    Safari, Firefox, Chrome.", 
    width="800", 
    height="449" 
  %}
  <figcaption>
    Demo shown across Firefox, Safari, iOS Safari, 
    Chrome, and Android Chrome in light and dark schemes.
  </figcaption>
</figure>

## Markup

I chose to wrap the `<progress>` element in a
[`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label) so
I could skip the [explicit relationship attributes in favor of an implicit
relationship](https://css-tricks.com/html-inputs-and-labels-a-love-story/#aa-how-to-pair-a-label-and-an-input).
I've also labeled a parent element affected by the loading state, so screen
reader technologies can relay that information back to a user.

```html
<progress></progress>
```

If there is no `value`, then the element's progress is
[indeterminate](https://developer.mozilla.org/docs/Web/CSS/:indeterminate).
The `max` attribute defaults to 1, so progress is between 0 and 1. Setting `max`
to 100, for example, would set the range to 0-100. I chose to stay within the 0
and 1 limits, translating progress values to 0.5 or 50%.

### Label-wrapped progress

In an implicit relationship, a progress element is wrapped by a label like this:

```html
<label>Loading progress<progress></progress></label>
```

In my demo I chose to include the label for [screen readers
only](https://webaim.org/techniques/css/invisiblecontent/).
This is done by wrapping the label text in a `<span>` and applying some styles
to it so that it's effectively off screen:

```html
<label>
  <span class="sr-only">Loading progress</span>
  <progress></progress>
</label>
```

With the following accompanying CSS from [WebAIM](https://webaim.org/):

```css
.sr-only {
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/ejXKeSrFgAOBxXiuDcU1.png", 
  alt="Screenshot of the devtools revealing the screen ready only element.", 
  width="800", 
  height="442" 
%}

### Area affected by loading progress

If you have healthy vision, it can be easy to associate a progress indicator
with related elements and page areas, but for visually impaired users, it's not
so clear. Improve this by assigning the
[`aria-busy`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-busy)
attribute to the top-most element that will change when loading is complete.
Furthermore, indicate a relationship between the progress and the loading zone
with
[`aria-describedby`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-describedby).

```html
<main id="loading-zone" aria-busy="true">
  …
  <progress aria-describedby="loading-zone"></progress>
</main>
```

From JavaScript, toggle `aria-busy` to `true` at the start of the task, and to
`false` once finished.

### Aria attribute additions

While the implicit role of a `<progress>` element is
[`progressbar`](https://w3c.github.io/aria/#progressbar), I've made it explicit
for browsers that lack that implicit role. I've also added the attribute
`indeterminate` to explicitly put the element into a state of unknown, which is
clearer than observing the element has no `value` set. 

```html
<label>
  Loading 
  <progress 
    indeterminate 
    role="progressbar" 
    aria-describedby="loading-zone"
    tabindex="-1"
  >unknown</progress>
</label>
```

Use
[`tabindex="-1"`](https://css-tricks.com/focus-management-and-inert/#aa-do-use-tabindex-1-for-focusing-with-javascript)
to make the progress element focusable from JavaScript. This is important for
screen reader technology, since giving the progress focus as progress changes,
will announce to the user how far the updated progress has reached.

## Styles

The progress element is a bit tricky when it comes to styling. Built-in HTML
elements have special hidden parts that can be difficult to select and often
only offer a limited set of properties to be set.

### Layout

The layout styles are intended to allow some flexibility in the progress
element's size and label position. A special completion state is added that can
be a useful, but not required, additional visual cue.

#### `<progress>` Layout

The width of the progress element is left untouched so it can shrink and grow
with the space needed in the design. The built-in styles are stripped out by
setting `appearance` and `border` to `none`. This is done so the element can be
normalized across browsers, since each browser has its own styles for their
element. 

```css
progress {
  --_track-size: min(10px, 1ex);
  --_radius: 1e3px;

  /*  reset  */
  appearance: none;
  border: none;

  position: relative;
  height: var(--_track-size);
  border-radius: var(--_radius);
  overflow: hidden;
}
```

The value of `1e3px` for `_radius` uses [scientific number
notation](https://developer.mozilla.org/docs/Web/CSS/number) to express a
large number so the `border-radius` is always rounded. It's equivalent to
`1000px`. I like to use this because my aim is to use a value large enough that
I can set it and forget it (and it's shorter to write than `1000px`). It is also
easy to make it even larger if needed: just change the 3 to a 4, then `1e4px` is
equivalent to `10000px`.

`overflow: hidden` is used and has been a contentious style. It made a few
things easy, such as not needing to pass `border-radius` values down to the
track, and track fill elements; but it also meant no children of the progress
could live outside of the element. Another iteration on this custom progress
element could be done without `overflow: hidden` and it may open up some
opportunities for animations or better completion states.

#### Progress complete

CSS selectors do the tough work here by comparing the maximum with the value, and if they match, then the progress is complete. When complete, a pseudo-element is generated and appended to the end of the progress element, providing a nice additional visual cue to the completion.

```css
progress:not([max])[value="1"]::before,
progress[max="100"][value="100"]::before {
  content: "✓";
  
  position: absolute;
  inset-block: 0;
  inset-inline: auto 0;
  display: flex;
  align-items: center;
  padding-inline-end: max(calc(var(--_track-size) / 4), 3px);

  color: white;
  font-size: calc(var(--_track-size) / 1.25);
}
```

{% Aside %} 
These selectors only work if `max` is unset or is `100`. Selectors
will need to be updated if your progress element has a different maximum. 
{% endAside %}

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/TqbVcyeiGuwZKy7o9cnM.png", 
  alt="Screenshot of the loading bar at 100% and showing a checkmark at the end.", 
  width="800", 
  height="438" 
%}

### Color

The browser brings its own colors for the progress element, and is adaptive to
light and dark with just one CSS property. This can be built upon with some
special browser-specific selectors.

#### Light and dark browser styles

To opt your site into a dark and light adaptive `<progress>` element,
[`color-scheme`](/color-scheme/) is all that is required.

```css
progress {
  color-scheme: light dark;
}
```

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/rHdPhxGCLSndsMHrl9fv.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

{% Codepen {
 user: 'web-dot-dev',
 id: 'KKZwoVy',
 height: 250,
 tab: 'result'
} %}

#### Single property progress filled color

To tint a `<progress>` element, use [`accent-color`](/accent-color/).

```css
progress {
  accent-color: rebeccapurple;
}
```

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Q0OUWQXzkPe9El4pY8ft.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

Notice the track background color changes from light to dark depending on the
`accent-color`. The browser is ensuring proper contrast: pretty neat.

{% Codepen {
 user: 'web-dot-dev',
 id: 'mdpyxRP',
 height: 250,
 tab: 'result'
} %}

#### Fully custom light and dark colors

Set two custom properties on the `<progress>` element, one for the track color
and the other for the track progress color. Inside the
[`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme)
media query, provide new color values for the track and track progress.

```css
progress {
  --_track: hsl(228 100% 90%);
  --_progress: hsl(228 100% 50%);
}

@media (prefers-color-scheme: dark) {
  progress {
    --_track: hsl(228 20% 30%);
    --_progress: hsl(228 100% 75%);
  }
}
```

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/f5aa28tsX7nsvJakBBO4.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

{% Aside %}
It's a good idea to be concerned about the 
contrast between your track and progress colors.
{% endAside %}

#### Focus styles

Earlier we gave the element a negative tab index so it could be programmatically
focused. Use
[`:focus-visible`](https://developer.mozilla.org/docs/Web/CSS/:focus-visible) to
customize focus to opt into the smarter focus ring style. With this, a mouse
click and focus won't show the focus ring, but keyboard clicks will. The
[YouTube video](https://youtu.be/TD1QxlGgIPk) goes into this in more depth and
is worth reviewing.

```css
progress:focus-visible {
  outline-color: var(--_progress);
  outline-offset: 5px;
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CTj58sbVohyhPRPltW6D.png", 
  alt="Screenshot of the loading bar with a focus ring around it. Colors all match.", 
  width="800", 
  height="259" 
%}

#### Custom styles across browsers

Customize the styles by selecting the parts of a `<progress>` element that each
browser exposes. Using the progress element is a single tag, but it's made of a
few child elements that are exposed via CSS pseudo selectors. Chrome DevTools
will show these elements to you if you enable the setting:

1. Right-click on your page and select **Inspect Element** to bring up DevTools.
1. Click the Settings gear in the top-right corner of the DevTools window.
1. Under the **Elements** heading, find and enable the **Show user agent shadow
   DOM** checkbox.

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/GBrWTQonKg4Z6e3yCZmJ.png", 
  alt="Screenshot of where in DevTools to enable exposing the user agent shadow DOM.", 
  width="800", 
  height="584" 
%}

{% Aside 'gotcha' %} 
`-moz-` and `-webkit-` pseudo selectors cannot be grouped,
as one or the other will fail and invalidate the selector group. Furthermore,
while `:is()` and `:where()` feature forgiving selector lists, they do not
accept these pseudo selectors and will also fail. 
{% endAside %}

##### Safari and Chromium styles

WebKit-based browsers such as Safari and Chromium expose
`::-webkit-progress-bar` and `::-webkit-progress-value`, which allow a subset of
CSS to be used. For now, set `background-color` using the custom properties
created earlier, which adapt to light and dark.

```css
/*  Safari/Chromium  */
progress[value]::-webkit-progress-bar {
  background-color: var(--_track);
}

progress[value]::-webkit-progress-value {
  background-color: var(--_progress);
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/W2GJzB7tcznfvbAwHSwf.png", 
  alt="Screenshot showing the inner elements of the progress element.", 
  width="800", 
  height="257" 
%}

##### Firefox styles

Firefox only exposes the `::-moz-progress-bar` pseudo selector on the
`<progress>` element. This also means we can't tint the track directly. 

```css
/*  Firefox  */
progress[value]::-moz-progress-bar {
  background-color: var(--_progress);
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/z584hF7H0TwmmU4rcjmC.png", 
  alt="Screenshot of Firefox and where to find the progress element parts.", 
  width="800", 
  height="598" 
%}

{% Aside %}
For Firefox, `color-scheme` does tint the `<progress>` track. 
Custom colors cannot be provided to `color-scheme`, but I found 
it to be workable in delivering an adaptive loading bar.
{% endAside %}

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/AXYPSsW7HQ21qfWgdlsy.png", 
  alt="Screenshot of the Debugging Corner where Safari, iOS Safari, 
  Firefox, Chrome and Chrome on Android all have the loading bar shown working.", 
  width="800", 
  height="450" 
%}

Notice that Firefox has a track color set from `accent-color` while iOS Safari
has a light blue track. It's the same in dark mode: Firefox has a dark track but
not the custom color we've set, and it works in Webkit-based browsers.

## Animation

While working with browser built-in pseudo selectors, it's often with a limited
set of permitted CSS properties.

### Animating the track filling up

Adding a transition to the
[`inline-size`](https://developer.mozilla.org/docs/Web/CSS/inline-size) of
the progress element works for Chromium but not for Safari. Firefox also does
not use a transition property on it's `::-moz-progress-bar`.

```css/3
/*  Chromium Only 😢  */
progress[value]::-webkit-progress-value {
  background-color: var(--_progress);
  transition: inline-size .25s ease-out;
}
```

### Animating the `:indeterminate` state

Here I get a bit more creative so I can provide an animation. A pseudo-element
for Chromium is created and a gradient is applied that is animated back and
forth for all three browsers.

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/VPkH1KWsvUyNrdmc13k1.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

#### The custom properties

Custom properties are great for many things, but one of my favorites is simply
giving a name to an otherwise magical looking CSS value. Following is a fairly
complex
[`linear-gradient`](https://developer.mozilla.org/docs/Web/CSS/gradient/linear-gradient()),
but with a nice name. Its purpose and use cases can be clearly understood.

```css
progress {
  --_indeterminate-track: linear-gradient(to right,
    var(--_track) 45%,
    var(--_progress) 0%,
    var(--_progress) 55%,
    var(--_track) 0%
  );
  --_indeterminate-track-size: 225% 100%;
  --_indeterminate-track-animation: progress-loading 2s infinite ease;
}
```

Custom properties will also help the code stay DRY since once again, we can't
group these browser-specific selectors together. 

#### The keyframes

The goal is an infinite animation that goes back and forth. The start and end
keyframes will be set in CSS. Only one keyframe is needed, the middle keyframe
at `50%`, to create an animation that returns to where it started from, over and
over again!

```css
@keyframes progress-loading {
  50% {
    background-position: left; 
  }
}
```

#### Targeting each browser

Not every browser allows the creation of pseudo-elements on the `<progress>`
element itself or allows animating the progress bar. More browsers support
animating the track than a pseudo-element, so I upgrade from pseudo-elements as
a base and into animating bars.

##### Chromium pseudo-element

Chromium does allow the pseudo-element: `::after` used with a position to cover
the element. The indeterminate custom properties are used, and the back and
forth animation works very well.

```css
progress:indeterminate::after {
  content: "";
  inset: 0;
  position: absolute;
  background: var(--_indeterminate-track);
  background-size: var(--_indeterminate-track-size);
  background-position: right; 
  animation: var(--_indeterminate-track-animation);
}
```

##### Safari progress bar

For Safari, the custom properties and an animation are applied to the
pseudo-element progress bar:

```css
progress:indeterminate::-webkit-progress-bar {
  background: var(--_indeterminate-track);
  background-size: var(--_indeterminate-track-size);
  background-position: right; 
  animation: var(--_indeterminate-track-animation);
}
```

##### Firefox progress bar

For Firefox, the custom properties and an animation are also applied to the
pseudo-element progress bar:

```css
progress:indeterminate::-moz-progress-bar {
  background: var(--_indeterminate-track);
  background-size: var(--_indeterminate-track-size);
  background-position: right; 
  animation: var(--_indeterminate-track-animation);
}
```

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/FC444bSPndbT4FLC1Fg5.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

## JavaScript

JavaScript plays an important role with the `<progress>` element. It controls
the value sent to the element and ensures enough information is present in the
document for screen readers.

```js
const state = {
  val: null
}
```

The demo offers buttons for controlling the progress; they update `state.val`
and then call a function for updating the
[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).

```js
document.querySelector('#complete').addEventListener('click', e => {
  state.val = 1
  setProgress()
})
```

### `setProgress()`

This function is where the UI/UX orchestration occurs. Get started by creating a
`setProgress()` function. No parameters are needed because it has access to the
`state` object, progress element, and `<main>` zone.

```js
const setProgress = () => {
  
}
```

#### Setting the loading status on the `<main>` zone

Depending on whether the progress is complete or not, the related `<main>`
element needs an update to the
[`aria-busy`](https://docs.google.com/document/d/1VM-4oMK-YklPR13eSkUdFJnB-PKQV5wmc-KmwBMJIMQ/edit#heading=h.gmjywafg0wji)
attribute:

```js/1
const setProgress = () => {
  zone.setAttribute('aria-busy', state.val < 1)
}
```

#### Clear attributes if loading amount is unknown

If the value is unknown or unset, `null` in this usage, remove the `value` and
`aria-valuenow` attributes. This will turn the `<progress>` to indeterminate.

```js/3-7
const setProgress = () => {
  zone.setAttribute('aria-busy', state.val < 1)

  if (state.val === null) {
    progress.removeAttribute('aria-valuenow')
    progress.removeAttribute('value')
    progress.focus()
    return
  }
}
```

#### Fix JavaScript decimal math issues

Since I chose to stick with the progress default maximum of 1, the demo
increment and decrement functions use decimal math. JavaScript, and other
languages, [are not always great at
that](https://stackoverflow.com/questions/3439040/why-does-adding-two-decimals-in-javascript-produce-a-wrong-result).
Here's a `roundDecimals()` function that will trim the excess off the math
result:

```js
const roundDecimals = (val, places) =>
  +(Math.round(val + "e+" + places)  + "e-" + places)
```

Round the value so it can be presented and is legible:

```js/10-11
const setProgress = () => {
  zone.setAttribute('aria-busy', state.val < 1)

  if (state.val === null) {
    progress.removeAttribute('aria-valuenow')
    progress.removeAttribute('value')
    progress.focus()
    return
  }

  const val = roundDecimals(state.val, 2)
  const valPercent = val * 100 + "%"
}
```

#### Set value for screen readers and browser state

The value is used in three locations in the DOM:

1. The `<progress>` element's `value` attribute.
1. The `aria-valuenow` attribute.
1. The `<progress>` inner text content.

```js/13-15
const setProgress = () => {
  zone.setAttribute('aria-busy', state.val < 1)

  if (state.val === null) {
    progress.removeAttribute('aria-valuenow')
    progress.removeAttribute('value')
    progress.focus()
    return
  }

  const val = roundDecimals(state.val, 2)
  const valPercent = val * 100 + "%"

  progress.value = val
  progress.setAttribute('aria-valuenow', valPercent)
  progress.innerText = valPercent
}
```

#### Giving the progress focus

With the values updated, sighted users will see the progress change, but screen
reader users are not yet given the announcement of change. Focus the
`<progress>` element and the browser will announce the update!

```js/17
const setProgress = () => {
  zone.setAttribute('aria-busy', state.val < 1)

  if (state.val === null) {
    progress.removeAttribute('aria-valuenow')
    progress.removeAttribute('value')
    progress.focus()
    return
  }

  const val = roundDecimals(state.val, 2)
  const valPercent = val * 100 + "%"

  progress.value = val
  progress.setAttribute('aria-valuenow', valPercent)
  progress.innerText = valPercent

  progress.focus()
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/yy0Shiw8lPQWKs6L6kRr.png", 
  alt="Screenshot of the Mac OS Voice Over app 
  reading the progress of the loading bar to the user.", 
  width="800", 
  height="408" 
%}

## Conclusion

Now that you know how I did it, how would you‽ 🙂

There are certainly a few changes I'd like to make if given another chance. I think there's room to clean up the current component, and room to try and build one without the `<progress>` element's pseudo-class style limitations. It's worth exploring!

Let's diversify our approaches and learn all the ways to build on the web.

Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

- [Varun KS](https://twitter.com/VarunKS20161856) - [source](https://github.com/KSVarun/progress-loader-GUI-challenge) and [demo](https://ksvarun.github.io/progress-loader-GUI-challenge/)
