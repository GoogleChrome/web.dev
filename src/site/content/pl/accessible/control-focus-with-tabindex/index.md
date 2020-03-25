---
layout: post
title: Control focus with tabindex
authors:
  - robdodson
date: 2018-11-18
description: |
  Native HTML elements such as <button> or <input> have keyboard accessibility
  built-in for free. If you're building custom interactive components, use
  tabindex to ensure that they're keyboard accessible.
translation: none
---

Native HTML elements such as `<button>` or `<input>` have keyboard accessibility
built in for free. If you're building _custom_ interactive components, however,
use the `tabindex` attribute to ensure that they're keyboard accessible.

{% Aside %}
Whenever possible, use a native HTML element rather than building your
own custom version. `<button>`, for example, is very easy to style and
already has full keyboard support. This will save you from needing to manage
`tabindex` or add semantics with ARIA.
{% endAside %}

## Check if your controls are keyboard accessible

A tool like Lighthouse is great at detecting certain accessibility issues, but
some things can only be tested by a human.

Try pressing the `Tab` key to navigate through your site. Are you able to reach
all the interactive controls on the page? If not, you may need to use
[`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
to improve the focusability of those controls.

{% Aside 'warning' %}
If you don't see a focus indicator at all, it may be hidden by your
CSS. Check for any styles that mention `:focus { outline: none; }`.
You can learn how to fix this in our guide on
[styling focus](/style-focus).
{% endAside %}

## Insert an element into the tab order

Insert an element into the natural tab order using `tabindex="0"`. For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

To focus an element, press the `Tab` key or call the element's `focus()` method.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-zero?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-zero on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Remove an element from the tab order

Remove an element using `tabindex="-1"`. For example:

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

This removes an element from the natural tab order, but the element can still be
focused by calling its `focus()` method.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-negative-one?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Note that applying `tabindex="-1"` to an element doesn't affect its children;
if they're in the tab order naturally or because of a `tabindex` value,
they'll remain in the tab order.
To remove an element and all its children from the tab order, consider using
[the WICG's `inert` polyfill](https://github.com/WICG/inert).
The polyfill emulates the behavior of a proposed `inert` attribute,
which prevents elements from being selected or read by assistive technologies.

{% Aside 'caution' %}
The `inert` polyfill is experimental and may not work as expected in all cases.
Test carefully before using in production.
{% endAside %}

## Avoid `tabindex > 0`

Any `tabindex` greater than 0 jumps the element to the front of the natural tab
order. If there are multiple elements with a `tabindex` greater than 0, the tab
order starts from the lowest value greater than zero and works its way up.

Using a `tabindex` greater than 0 is considered an **anti-pattern** because
screen readers navigate the page in DOM order, not tab order. If you need an
element to come sooner in the tab order, it should be moved to an earlier spot
in the DOM.

Lighthouse makes it easy to identify elements with a `tabindex` > 0. Run the
Accessibility Audit (Lighthouse > Options > Accessibility) and look for the
results of the "No element has a [tabindex] value greater than 0" audit.

## Create accessible components with "roving `tabindex`"

If you're building a complex component, you may need to add additional keyboard
support beyond focus. Consider the native `select` element. It is focusable and
you can use the arrow keys to expose additional functionality (the selectable
options).

To implement similar functionality in your own components, use a technique known
as "roving `tabindex`". Roving tabindex works by setting `tabindex` to -1 for
all children except the currently-active one. The component then uses a keyboard
event listener to determine which key the user has pressed.

When this happens, the component sets the previously focused child's `tabindex`
to -1, sets the to-be-focused child's `tabindex` to 0, and calls the `focus()`
method on it.

**Before**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="0">Redo</div>
  <button tabindex="-1">Cut</div>
</div>
```

**After**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```


<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/roving-tabindex?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside %}
Curious what those `role=""` attributes are for? They let you change the
semantics of an element so it will be announced properly by a screen reader.
You can learn more about them in our guide on
[screen reader basics](/semantics-and-screen-readers).
{% endAside %}

{% AssessmentCallout 'Use the drop-down below each code sample to check your understanding of tab order.' %}
{% Tabs 'Samples for knowledge self check' %}
{% Tab 'sample' %}

This HTML renders a modal dialog:
```html
<div role="dialog" aria-labelledby="dialog-header">
  <button aria-label="Close"></button>
  <h2 id="dialog-header">
    Do you want to allow notifications from this website?
  </h2>
  <button>No</button>
  <button>Yes</button>
</div>
```

{% AssessmentHint 'What is the tab order for the elements in the sample?' %}
1. The **Close** button
1. The **No** button
1. The **Yes** button

Only the `<button>` elements are included in the tab order
because they're the only native HTML form elements.
To insert other elements into the tab order, you would add a `tabindex` attribute.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

```html
<section tabindex="-1">
  <h2>Cat facts</h2>
  <ul>
    <li>A group of cats is called a <a href="https://m-w.com/dictionary/clowder">clowder</a>.</li>
    <li>Most cats are <a href="https://www.catfacts.org/catnip.html"> unaffected by catnip</a>.</li>
  </ul>
</section>
```

{% AssessmentHint 'Which elements from the sample are included in the tab order?' %}
Only the `<a>` elements are included in the tab order.

The `<section>` element is not in the tab order
because it has a negative `tabindex` value.
(It can, however, be focused using the `focus()` method.)
The `tabindex` value for the `<section>` element doesn't affect its children.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

This HTML renders a popup menu followed by a search input:

```html
<div role="menu" tabindex="0">
  <a role="menuitem" href="/learn/" tabindex="-1">Learn</a>
  <a role="menuitem" href="/measure/" tabindex="-1">Measure</a>
  <a role="menuitem" href="/blog/" tabindex="-1">Blog</a>
  <a role="menuitem" href="/about/" tabindex="-1">About</a>
</div>
<input tabindex="1" type="text" role="search" aria-label="Search" placeholder="Search">
```

{% AssessmentHint 'Which element in the sample comes first in the tab order?' %}
The **Search** text input comes first in the tab order.
Because it has a `tabindex` greater than 1, it jumps to the front of the tab order.

(This behavior is likely to cause confusion
if the menu is positioned on the page before the search input.
This is an example of why having a `tabindex` value greater than zero
is considered an anti-pattern.)

{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

This HTML renders a custom radio group, which should have a
[roving `tabindex`](#create-accessible-components-with-"roving-tabindex").
(To keep things simpler, ignore the
[`aria-*` attributes](/semantics-and-screen-readers) for now.)

```html
<div role="radiogroup" aria-labelledby="breed-header">
  <h3 id="breed-header">Your cat's breed</h3>
  <div role="radio" aria-checked="false" tabindex="0">Persian</div>
  <div role="radio" aria-checked="false" tabindex="-1">Bengal</div>
  <div role="radio" aria-checked="false" tabindex="-1">Maine Coon</div>
</div>
```

{% AssessmentHint 'When a `role="radio"` element is focused, what should happen when a user presses the `Right` arrow key ?' %}
- Change the `tabindex` values for all radio elements in the group to -1.
- If there's a radio element after the one that's focused,
  set its `tabindex` value to 0.
- If there's no radio element after the one that's focused,
  set the `tabindex` value of the first radio element in the group to 0.
- Focus the radio element that now has a `tabindex` of 0.

That's a lot—and it doesn't even include ARIA attributes!
This is an example of why it's easier to use native elements
with built-in keyboard behavior whenever you can.
{% endAssessmentHint %}

{% endTab %}
{% endTabs %}
{% endAssessmentCallout %}

## Keyboard access recipes

If you're unsure what level of keyboard support your custom components might
need, you can refer to the
[ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/).
This handy guide lists common UI patterns and identifies which keys your
components should support.
