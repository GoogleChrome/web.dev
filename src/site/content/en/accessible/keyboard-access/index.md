---
layout: post
title: Keyboard access fundamentals
authors:
  - robdodson
date: 2018-11-18
description: |
  Many different users rely on the keyboard to navigate applications—from
  users with temporary and permanent motor impairments to users who use keyboard
  shortcuts to be more efficient and productive. Having a good keyboard
  navigation strategy for your application creates a better experience for
  everyone.
---

Many different users rely on the keyboard to navigate applications—from users
with temporary and permanent motor impairments to users who use keyboard
shortcuts to be more efficient and productive. Having a good keyboard navigation
strategy for your application creates a better experience for everyone.

## Focus and the tab order

At a given moment, **focus** refers to what element in your application (such as
a field, checkbox, button, or link) currently receives input from the keyboard.
In addition to receiving keyboard events, the focused element also gets content
that is pasted from the clipboard.

To move the focus on a page, use `TAB` to navigate "forward" and `SHIFT + TAB`
to navigate "backward." The currently focused element is often indicated by a
**focus ring**, and various browsers style their focus rings differently. The
order in which focus proceeds forward and backward through interactive elements
is called the **tab order**.

Interactive HTML elements like text fields, buttons, and select lists are
**implicitly focusable**: they are automatically inserted into the tab order
based on their position in the
[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model).
These interactive elements also have built-in keyboard event handling. Elements
such as paragraphs and divs are not implicitly focusable because users typically
do not need to interact with them.

Implementing a logical tab order is an important part of providing your users
with a smooth keyboard navigation experience. There are two main ideas to keep
in mind when assessing and adjusting your tab order:

1. Arrange elements in the DOM to be in logical order
1. Correctly set the visibility of offscreen content that should not receive
    focus

## Arrange elements in the DOM to be in logical order

To check if your application's tab order is logical, try tabbing through your
page. In general, focus should follow reading order, moving from left to right,
from the top to the bottom of your page.

If the focus order seems wrong, you should rearrange the elements in the DOM to
make the tab order more natural. **If you want something to appear visually
earlier on the screen, move it earlier in the DOM**.

Try tabbing through the two sets of buttons below to experience a logical tab
order versus an illogical tab order:

**Logical tab order**

{% Glitch {
  id: 'logical-tab-order',
  path: 'index.html',
  height: 346
} %}

**Illogical tab order**

{% Glitch {
  id: 'illogical-tab-order',
  path: 'index.html',
  height: 346
} %}

The code for these two examples is compared below:

**Logical tab order**
```html
<button>Kiwi</button>
<button>Peach</button>
<button>Coconut</button>
```

**Illogical tab order**
```html/0
<button style="float: right">Kiwi</button>
<button>Peach</button>
<button>Coconut</button>
```

Be careful when changing the visual position of elements using CSS to avoid
creating an illogical tab order. To fix the illogical tab order above, move the
floating "Kiwi" button so it comes after the "Coconut" button in the DOM, and
remove the inline style.

## Correctly set the visibility of offscreen content

Sometimes offscreen interactive elements need to be in the DOM but should not be
in your tab order. For example, if you have a responsive side-nav that opens
when you click a button, the user should not be able to focus on the side-nav
when it's closed.

To prevent a particular interactive element from receiving focus, you should
give the element either of the following CSS properties:

- `display: none`
- `visibility: hidden`

To add the element back into the tab order, for example when the side-nav is
opened, replace the above CSS properties respectively with:

- `display: block`
- `visibility: visible`

{% Aside %}
If you can't figure out where the focus on your page is as you're
tabbing, open the console and type: `document.activeElement`. This
property will return the element that currently has focus.
{% endAside %}

## Next steps

For users who operate their computer almost entirely with the keyboard or
another input device, a logical tab order is essential for making your
application accessible and usable. As a good habit for checking your tab order,
try **tabbing through your application before each publish**.
