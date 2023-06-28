---
title: CodePen
---
## Insert an element into the tab order

Insert an element into the natural tab order using `tabindex="0"`. For example:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

To focus an element, press the `Tab` key or call the element's `focus()` method.

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWzzMqp',
  height: 360,
  theme: 'dark',
  tab: 'result'
} %}

## Remove an element from the tab order

Remove an element using `tabindex="-1"`. For example:

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

This removes an element from the natural tab order, but the element can still be
focused by calling its `focus()` method.

{% Codepen {
  user: 'web-dot-dev',
  id: 'BammWGg',
  height: 360,
  theme: 'dark',
  tab: 'result'
} %}

Note that applying `tabindex="-1"` to an element doesn't affect its children;
if they're in the tab order naturally or because of a `tabindex` value,
they'll remain in the tab order.
To remove an element and all its children from the tab order, consider using
[the WICG's `inert` polyfill](https://github.com/WICG/inert).
The polyfill emulates the behavior of a proposed `inert` attribute,
which prevents elements from being selected or read by assistive technologies.

Get things spinning!

```css
.loader {
  animation: spin 0.75s infinite steps(var(--count));
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

Note the use of `steps(var(--count))` to get the right effect ✨

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNdeWep',
  height: 300,
  theme: 'dark',
  tab: 'result'
} %}