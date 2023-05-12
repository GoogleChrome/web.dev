---
title: 'Focus'
authors:
  - estelleweyl
description: How to manage focus order in your HTML documents.
date: 2023-02-21
tags:
  - html
---

Interactive elements, including [form controls](/learn/html/forms/), [links](/learn/html/links/), and buttons, are by
default focusable and tabbable. Tabbable elements are part of the document's sequential focus navigation order. Other elements
are inert, meaning they are not interactive. With HTML attributes, it is possible to make interactive elements inert and to
make inert elements interactive.

{% Aside %}
For usability reasons, always ensure that the user knows which element has focus. Include CSS [`:focus`](https://developer.mozilla.org/docs/Web/CSS/:focus),
[`:focus-visible`](https://developer.mozilla.org/docs/Web/CSS/:focus-visible), and, optionally, [`:focus-within`](https://developer.mozilla.org/docs/Web/CSS/:focus-within)
styles. This is so important: there are Learn sections devoted to focus styles in both the [CSS](/learn/css/focus/) and [Accessibility](/learn/accessibility/focus/) learning paths.
{% endAside %}

By default, the navigation focus order is the same as the visual order, which is the source code order. There are HTML
attributes that can alter this order and CSS properties that can alter the visual order of content. Changing the tabbing
order with HTML or visual rendering order with CSS can harm user experience.

Don't alter the perceived and actual tabbing order with CSS and HTML. As the following two examples demonstrate, tab orders
that differ from the visually expected order are confusing to users and bad for user experience.

In this example, the value of the [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex) attribute
has made the tab order chaotic:

{% Codepen {
user: 'web-dot-dev',
id: 'GRXKqGz',
tab: 'result'
} %}

In this example, CSS has created a divergence between the tabbing order and the visual order of the content:

{% Codepen {
user: 'web-dot-dev',
id: 'KKxPMBV',
tab: 'result'
} %}

The [`flex-flow: row-reverse;`](https://developer.mozilla.org/docs/Web/CSS/flex-flow) declaration has reversed the visual order.
In addition, the CSS [order](https://developer.mozilla.org/docs/Web/CSS/order) property was applied to the sixth word, "This", which visually moved that
one word. The tabbing sequence is the order of the code, which no longer matches the visual order, creating a disconnect
for keyboard users.

{% Aside %}
CSS features, including [flexbox](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox), [grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout),
[positioning](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Positioning), [transforms](https://developer.mozilla.org/docs/Web/CSS/translate),
and [multi-column](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout), can alter the visual order of
content. Always ensure your content maintains a logical tabbing order on all viewport sizes. Test your content by tabbing
through it with a keyboard: with shift + tab to move backwards through the content. Always ensure it's apparent which element
currently has focus with CSS, and avoid accessibility problems by not reordering focusable elements with CSS.
{% endAside %}

## Making inert elements interactive

The `contenteditable` and `tabindex` attributes, being global attributes, can be added to any element, making them focusable
in the process. Focusable elements can also be focused with a mouse or pointer, by having the [`autofocus`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autofocus)
attribute set, or by script, such as with [`element.focus()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus).

### The `tabindex` attribute

The global [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex) attribute, introduced in
[attributes](/learn/html/attributes/#tabindex), enables elements that otherwise would not be able to receive focus to get
focus, usually with the Tab key, hence the name.

The `tabindex` attribute takes as its value an integer. A negative value makes an element focusable but not tabbable. A
`tabindex` value of `0` makes the element focusable and tabbable, adding the element on which it is applied to the sequential
focus navigation order in source code order. A value of 1 or greater makes the element focusable and tabbable,
but adds it to a prioritized tabbing sequence, and, as we saw above, should be avoided.

On this page, the share button, `<share-action>`, is a [custom element](/learn/html/template/). The `tabindex="0"` adds this not-normally focusable
element into the keyboard default tabbing order:

```html
<share-action authors="@front-end.social/@estellevw" data-action="click" data-category="web.dev" data-icon="share" data-label="share, mastodon" role="button" tabindex="0">
  <svg aria-label="share" role="img" xmlns="http://www.w3.org/2000/svg">
    <use href="#shareIcon" />
  </svg>
  <span>Share</span>
</share-action>
```

{% Aside %}

The [`role="button"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/button_role) informs screen reader
users that this element should behave like a [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button).
When creating custom elements which mimic existing semantic elements, including an [ARIA role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles)
is appropriate and expected. The element must provide all the features of the element being replicated. This can be done by extending the replicated
element, such as extending the [`HTMLButtonElement`](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement), or by adding
`tabindex="0"` and using JavaScript to program *all* the functionality of the element it is mimicking, including handling
pointer events and the Enter and Space key presses. If `<button>` had been used for the button instead of creating a custom element,
the `tabindex` and `role` attributes would have been unnecessary, and the browser would have provided the pointer and keyboard events.
{% endAside %}

There's another custom element on this page: the [local navigation](/learn/html/navigation/#local-navigation) has a custom
element with a negative `tabindex` value:

```html
<web-navigation-drawer type="standard" tabindex="-1">
```

A `tabindex` attribute with a negative value makes the element focusable but not tabbable. The element is capable of receiving
focus, such as via [`HTMLElement.focus()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus), but it is not part
of the sequential focus navigation order. The convention for non-tabbable, focusable elements is to use `tabindex="-1"`. Note that
if you add `tabindex="-1"` to an interactive element, it will no longer be tabbable.

The [`element.focus()`](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) method can be used to set focus to
focusable elements. Note that the browsers scroll focused elements into view. For this reason, avoid the use of
`element.focus({preventScroll:true})`, as focusing on a non-visible element will give a bad user experience.

If you want to query the document to find out which element currently has focus, use the read-only [`Document.activeElement`](https://developer.mozilla.org/docs/Web/API/Document/activeElement) property.

Elements with a `tabindex` of `1` or greater are included in a separate tab sequence. As you'll notice in the Codepen,
tabbing begins in a separate sequence, in order of lowest value to highest value, before going through those in the regular sequence
(no `tabindex` set, or `tabindex="0"`) in source order:

{% Codepen {
user: 'web-dot-dev',
id: 'WNgexPv'
} %}

`tabindex` with a positive value puts the element into a prioritized focus sequence, which can lead to focus order chaos.
Avoid [modifying the DOM order with `tabindex`](/using-tabindex/). Not only can altered tabbing orders create bad user
experiences, they are difficult for developers to manage and maintain.

### The `contenteditable` attribute

The [`contenteditable`](/learn/html/attributes/#contenteditable/) attribute was discussed earlier. Setting `contenteditable="true"` on any element makes it editable,
focusable, and part of the tab order. The focus behavior is similar to setting `tabindex="0"`, but not the same. Nested
`contenteditable` elements are focusable but not tabbable. To make a nested `contenteditable` element tabbable, add `tabindex="0"`,
which will add it to the sequential focus navigation order.

## Giving focus to interactive elements

### The `autofocus` attribute

While the boolean [`autofocus`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autofocus) is a global attribute
that can be set on any element, it doesn't make an inert element interactive. When the page loads, the first focusable element
with the `autofocus` attribute set will receive focus, as long as that element is displayed and not nested in a [`<dialog>`](/learn/html/dialog/).

Automatically setting focus on content can be confusing. Setting `autofocus` on a form control means that the form control
will scroll into view on page load. All your users, including screen reader users and users with small viewports, may not
"see" the instructions for the form, possibly even scrolling past the form control's normally visible label. The `autofocus`
attribute doesn't alter the document's sequential focus navigation order. The elements in the sequence coming before the
autofocused element are simply skipped. For these reasons, it is not advised to include the `autofocus` attribute.

The exception to the "don't use `autofocus`" recommendation is including the `autofocus` attribute within `<dialog>` elements.
When a dialog is opened, the browser will automatically focus on the first focusable interactive element within the `<dialog>`,
meaning `autofocus` to an element is not necessary. If you want to be sure a specific interactive element within the dialog receives
focus when the dialog opens, add the `autofocus` attribute to that element.

```html
<dialog open>
  <form method="dialog">
    <button type="submit" autofocus>close</button>
  </form>
</dialog>
```

The `autofocus` attribute set on the close `<button>` ensures it receives focus when the dialog is opened. As the first element
in the dialog, it would have received focus in any case. By default, when a dialog is opened, the first focusable element within
the dialog will receive focus unless a different element within the dialog has the `autofocus` attribute set.

## Making interactive elements inert

There are also HTML attributes that can remove interactive elements from the tabbing sequence. Including a negative `tabindex`
to focusable elements, adding the `disabled` attribute to supporting form controls, and adding the global `inert` attribute
to a container all make elements un-tabbable. These three attributes are NOT interchangeable.

### Negative `tabindex` value

As we learned above, a `tabindex` attribute with a negative value makes an element focusable but not tabbable. While adding
`tabindex="0"` to a focusable-by-default element, including links, buttons, form controls, and elements that are `contenteditable`
is not necessary; including a `tabindex` with a negative value removes normally tabbable elements from the sequential focus
navigation order.

A negative `tabindex` value prevents keyboard users from focusing on interactive elements, but doesn't disable the element. Pointer
users can still focus on the element. To disable an element, use the `disabled` attribute.

### Disabled

The boolean [disabled](https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled) attribute makes the form controls on
which it is applied and their descendants, if any, unfocusable. Disabled form controls can't be focused, don't get click events,
and are not submitted upon form submission. Note `disabled` is not a global attribute. It applies to `<button>`, `<input>`,
`<optgroup>`, `<option>`, `<select>`, `<textarea>`, form-associated custom elements, and [`<fieldset>`](https://developer.mozilla.org/docs/Web/HTML/Element/fieldset).
When set on `<optgroup>` or `<fieldset>`, all the child form controls are disabled, except for the contents of the `<fieldset>`'s first [`<legend>`](https://developer.mozilla.org/docs/Web/HTML/Element/legend).

The same elements that support `disabled` are also targetable with the [`:disabled`](https://developer.mozilla.org/docs/Web/CSS/:disabled)
and [`:enabled`](https://developer.mozilla.org/docs/Web/CSS/:enabled) pseudoclasses. Elements that are disabled with the
`disabled` attribute are generally styled as light gray via the user-agent stylesheet, even if an [`accent-color`](https://developer.mozilla.org/docs/Web/CSS/accent-color)
is set.

Being a boolean attribute, the presence of the attribute disables the otherwise enabled element; you can't set it to `false`.
To re-enable a disabled element, the attribute has to be removed, generally via [`Element.removeAttribute('disabled')`](https://developer.mozilla.org/docs/Web/API/Element/removeAttribute).

The [`HTMLInputElement.disabled`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/disabled) property lets you check
if an input is disabled. As `disabled` is not a global attribute, it's not inherited from the HTMLElement, but every supporting
element interface, like [`HTMLSelectElement`](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/disabled),
[`HTMLTextareaElement`](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement#instance_properties), has the same read-only property.

The `disabled` attribute does not apply to normally `inert` elements that are made focusable via `tabindex` or `contenteditable`.
It also doesn't apply to the `<form>` element itself. To disable these, the global `inert` attribute can be used.

### The `inert` attribute

When the `inert` global boolean attribute is added to an element, that element and all nested content become disabled—neither
clickable nor tabbable—and removed from the accessibility tree. While `inert` can be applied to any element, it is generally
used for sections of content, such as offscreen or otherwise hidden content.

When applying `disabled` to form controls, the browser provides default styling and can be styled using the [`:disabled`](https://developer.mozilla.org/docs/Web/CSS/:disabled)
pseudo class. The `inert` attribute provides no visual indicators and has no matching pseudoclass (though the `[inert]` [attribute selector](/learn/css/selectors/#attribute-selector) matches).

Using `inert` on visible content without styles indicating the inertness can lead to poor user experience. As inert content
is not available to screen reader users, it can lead to confusion when sighted screen reader users see content on screen
that is not available to the accessibility tools. Make inertness very apparent via CSS.

Make sure that the focus never moves to non-visible content. Anything rendered off-screen that does not automatically
come into view when focused should be made [inert](https://developer.chrome.com/articles/inert/). If content is hidden,
but comes into view when focused, like the [skip to content link](/learn/html/navigation/#skip-to-content-link) on this page,
it does not need to be made inert.

## Check your understanding

{% Assessment 'focus' %}
