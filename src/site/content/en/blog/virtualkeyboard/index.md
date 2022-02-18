---
title: Full control with the VirtualKeyboard API
subhead:
  Manage yourself how the browser deals with content occlusion when a touch device's virtual
  keyboard appears.
description: |
  The VirtualKeyboard API provides a mechanism for developers to opt-in to a special behavior
  when the virtual keyboard appears: a docked virtual keyboard will overlay content
  (as opposed to repositioning it) and JavaScript events will be dispatched to allow the author
  to rearrange the layout of the document to compensate for changes in the intersection
  of the layout viewport with the virtual keyboard.
authors:
  - thomassteiner
date: 2021-09-09
# updated: 2021-09-09
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/AxswfecVWVJzh0shbahj.jpg
alt: Virtual keyboard on a mobile device.
tags:
  - blog
  - capabilities
---

Devices like tablets or cellphones typically have a virtual keyboard for typing text.
Unlike a physical keyboard that is always present and always the same, a virtual keyboard appears
and disappears, dependent on the user's actions, to which it can also adapt dynamically, for
example, based on the
[`inputmode`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode)
attribute.

This flexibility comes at the price that the browser's layout engine has to be informed of the
virtual keyboard's presence and potentially needs to adjust the layout of the document to
compensate. For example, an input field the user is about to type into might be obscured by the
virtual keyboard, so the browser has to scroll it into view.

Traditionally, browsers have dealt with this challenge on their own, but more complex applications
may require more control over the browser's behavior. Examples include multi-screen mobile devices
where the traditional approach would result in "wasted" screen real estate if the virtual keyboard
is displayed on just one screen segment, but where the available viewport is shrunk on both screens
nonetheless. The image below shows how the VirtualKeyboard API could be used to optimize the layout
of the document dynamically to compensate for the virtual keyboard's presence.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/RHEvtaZIcCCgoWuS5c3Z.png", alt="The traditional approach results in \"wasted\" screen real estate if the virtual keyboard is displayed on just one screen segment of a multi-screen device, but where the available viewport is shrunk on both screens nonetheless.", width="800", height="301" %}

Situations like this is where the VirtualKeyboard API comes in. It consists of three parts:

- The `VirtualKeyboard` interface on the `navigator` object for programmatic access to the virtual
  keyboard from JavaScript.
- A set of CSS environment variables that provide information about the virtual keyboard's
  appearance.
- A virtual keyboard policy that determines if the virtual keyboard should be shown.

## Feature detection and browser support

To detect if the VirtualKeyboard API is supported in the current browser, use the following snippet:

```js
if ('virtualKeyboard' in navigator) {
  // The VirtualKeyboard API is supported!
}
```

The VirtualKeyboard API is implemented as of Chromium&nbsp;94 on desktop and mobile.

## Using the VirtualKeyboard API

The VirtualKeyboard API adds a new interface `VirtualKeyboard` to the `navigator` object.

### Opting in to the new virtual keyboard behavior

To tell the browser that you are taking care of virtual keyboard occlusions yourself, you need to
first opt in to the new virtual keyboard behavior by setting the boolean property `overlaysContent`
to `true`.

```js
navigator.virtualKeyboard.overlaysContent = true;
```

### Showing and hiding the virtual keyboard

You can programmatically show the virtual keyboard by calling its `show()` method. For this to work,
the focused element needs to be a form control (such as a `textarea` element), or be an editing host
(for example, by using the
[`contenteditable`](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable)
attribute). The method always returns `undefined` but triggers a `geometrychanged` event
if the virtual keyboard previously was not shown.

```js
navigator.virtualKeyboard.show();
```

To hide the virtual keyboard, call the `hide()` method. The method always returns `undefined` but triggers
a `geometrychanged` event if the virtual keyboard previously was shown.

```js
navigator.virtualKeyboard.hide();
```

### Being informed of geometry changes

Whenever the virtual keyboard appears or disappears, the `geometrychanged` event is dispatched. The
event's `target` property contains the new geometry of the virtual keyboard inset as a
[`DOMRect`](https://www.w3.org/TR/geometry-1/#domrect).
The inset corresponds to the top, right, bottom, and/or left properties.

```js
navigator.virtualKeyboard.addEventListener('geometrychanged', (event) => {
  const { x, y, width, height } = event.target;
  console.log('Virtual keyboard geometry changed:', x, y, width, height);
});
```

### Getting the current geometry

You can get the current geometry of the virtual keyboard by looking at the `boundingRect` property.
It exposes the current dimensions of the virtual keyboard as a
[`DOMRect`](https://www.w3.org/TR/geometry-1/#domrect) object.

```js
const { x, y, width, height } = navigator.virtualKeyboard.boundingRect;
console.log('Virtual keyboard geometry:', x, y, width, height);
```

### The CSS environment variables

The VirtualKeyboard API exposes a set of CSS environment variables that provide information about
the virtual keyboard's appearance.
They are modeled similar to the [`inset`](https://developer.mozilla.org/docs/Web/CSS/inset) CSS property,
that is, corresponding to the top, right, bottom, and/or left properties.

- `keyboard-inset-top`
- `keyboard-inset-right`
- `keyboard-inset-bottom`
- `keyboard-inset-left`
- `keyboard-inset-width`
- `keyboard-inset-height`

The virtual keyboard insets are six environment variables that define a rectangle by its top, right,
bottom, and left insets from the edge of the viewport. The width and height insets are calculated
from the other insets for developer ergonomics. The default value of each keyboard inset is
`0px` if a fallback value is not provided.

You would typically use the environment variables as in the example below:

```css
.some-class {
  /**
   * Use a margin that corresponds to the virtual keyboard's height
   * if the virtual keyboard is shown, else use the fallback value of `50px`.
   */
  margin-block-end: env(keyboard-inset-height, 50px);
}

.some-other-class {
  /**
   * Use a margin that corresponds to the virtual keyboard's height
   * if the virtual keyboard is shown, else use the default fallback value of `0px`.
   */
  margin-block-end: env(keyboard-inset-height);
}
```

### The virtual keyboard policy

Sometimes the virtual keyboard should not appear when an editable element is focused. An example is a
spreadsheet application where the user can tap a cell for its value to be included in a formula of
another cell. The `virtualkeyboardpolicy` is an attribute whose keywords are the strings `auto` and
`manual`. When specified on an element that is a `contenteditable` host, `auto` causes the
corresponding editable element to automatically show the virtual keyboard when it is focused or
tapped, and `manual` decouples focus and tap on the editable element from changes in the virtual
keyboard's current state.

```html
<!-- Do nothing on regular focus, but show the virtual keyboard on double-click. -->
<div
  contenteditable
  virtualkeyboardpolicy="manual"
  inputmode="text"
  ondblclick="navigator.virtualKeyboard.show();"
>
  Double-click to edit.
</div>
```

## Demo

You can see the VirtualKeyboard API in action in a
[demo](https://virtualkeyboard.glitch.me/) on Glitch. Be sure to explore the
[source code](https://glitch.com/edit/#!/virtualkeyboard) to see how it is implemented.
While `geometrychange` events can be observed in the iframe embed, the actual virtual keyboard
behavior requires opening the demo [in its own browser tab](https://virtualkeyboard.glitch.me/).

{% Glitch 'virtualkeyboard' %}

## Useful links

- [Specification](https://w3c.github.io/virtual-keyboard/)
- [Repository](https://github.com/w3c/virtual-keyboard/)
- [ChromeStatus entry](https://chromestatus.com/features/5680057076940800)
- [Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=856269)
- [W3C TAG review](https://github.com/w3ctag/design-reviews/issues/507)
- [Mozilla standards position request](https://github.com/mozilla/standards-positions/issues/531)
- [WebKit standards position request](https://lists.webkit.org/pipermail/webkit-dev/2021-May/031862.html)

## Acknowledgements

The VirtualKeyboard API was specified by Anupam Snigdha from Microsoft, with contributions from
former editor Grisha Lyukshin, likewise from Microsoft. Hero image by
[@freestocks](https://unsplash.com/@freestocks) on
[Unsplash](https://unsplash.com/photos/mw6Onwg4frY).
