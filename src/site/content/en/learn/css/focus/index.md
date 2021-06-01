---
title: Focus
description: >
  Understand the importance of focus in your web applications.
  You'll find out how to manage focus,
  and how to make sure the path through your page works for people using a mouse,
  and those using the keyboard to navigate.
audio:
  title: 'The CSS Podcast - 018: Focus'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_018_v1.0.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-30
---

On your webpage,
you click a link that skips the user to the main content of the website.
These are often referred to as skip links, or anchor links.
When that link is activated by a keyboard, using the *tab* and *enter* keys,
the main content container has a focus ring around it. Why is that?

{% Codepen {
  user: 'web-dot-dev',
  id: 'poRWRjp'
} %}

This is because the `<main>` has a `tabindex="-1"` attribute value,
which means it can be programmatically focused.
When the `<main>` is targeted—because the `#main-content`
in the browser URL bar matches the `id`—it receives programmatic focus.
It's tempting to remove the focus styles in these situations,
but handling focus appropriately and with care helps to create a good,
accessible, user experience.
It can also be a great place to add some interest to interactions.

## Why is focus important?

As a web developer,
it's your job to make a website accessible and inclusive to all.
Creating accessible focus states with CSS is a part of this responsibility.

Focus styles assist people who use a device such as a keyboard or a
[switch control](https://www.24a11y.com/2018/i-used-a-switch-control-for-a-day/)
to navigate and interact with a website.
If an element receives focus and there is no visual indication,
a user may lose track of what is in focus.
This can create navigation issues and result in unwanted behaviour if,
say, the wrong link is followed.
You can
[read more on focus and how to manage it in this guide](https://developers.google.com/web/fundamentals/accessibility/focus).

## How elements get focus

Certain elements are automatically focusable;
these are elements that accept interaction and input, such as `<a>`,
`<button>`, `<input>` and `<select>`.
In short, all form elements, buttons and links.
You can typically navigate a website's focusable elements using the *tab* key to move forward on the page, and *shift* + *tab* to move backward.

There is also a HTML attribute called `tabindex` which allows you to change the tabbing index—which is
order in which elements are focused—every time someone presses their <kbd>tab</kbd> key,
or focus is shifted with a hash change in the URL or by a JavaScript event.
If `tabindex` on a HTML element is set to `0`,
it can receive focus via the <kbd>tab</kbd> key and it will honour the global tab index,
which is defined by the document source order.

If you set `tabindex` to `-1`, it can only receive focus programmatically,
which means only when a JavaScript event happens
or a hash change (matching the element's `id` in the URL) occurs.
If you set `tabindex` to be anything higher than `0`,
it will be removed from the global tab index,
defined by document source order.
Tabbing order will now be defined by the value of `tabindex`,
so an element with `tabindex="1"` will receive focus before an element with `tabindex="2"`, for example.

{% Aside 'warning' %}
Honoring document source order is really important,
and focus order should only be changed if you **absolutely have to change it**.
This applies both when setting `tabindex` **and** changing visual order with CSS layout,
such as flexbox and grid.
Anything that creates unpredictable focus on the web
can create an inaccessible experience for the user.
{% endAside %}

## Styling focus

The default browser behavior when an element receives focus is to present a focus ring.
This focus ring varies between both browser and operating systems.

{% Video
  src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/zVu8FoqteYCP1sTj3uCm.mp4",
  controls="true",
  autoplay="true"
%}

This behavior can be changed with CSS,
using the `:focus`, `:focus-within` and `:focus-visible`
pseudo-classes that you learned about in the
[pseudo-classes lesson](/learn/layout/pseudo-classes).
It is important to set a focus style which has **contrast** with the default style of an element.
For example, a common approach is to utilize the `outline` property.

```css
a:focus {
  outline: 2px solid slateblue;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'ZELXLMw'
} %}

The `outline` property could appear too close to the text of a link,
but the `outline-offset` property can help with that,
as it adds extra visual `padding` without affecting the geometric size that the element fills.
A positive number value for `outline-offset` will push the outline outwards,
a negative value will pull the outline inwards.

{% Codepen {
  user: 'web-dot-dev',
  id: 'xxgXgQx'
} %}

Currently in some browsers,
if you have a `border-radius` set on your element and use `outline`,
it won't match—the outline will have sharp corners.
Due to this,
it is tempting to use a `box-shadow` with a small blur radius because `box-shadow` clips to the shape,
honouring `border-radius`,
but **this style will not show in Windows High Contrast Mode**.
This is because Windows High Contrast Mode doesn't apply shadows,
and mostly ignores background images to favor the user's preferred settings.

{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgogyM'
} %}

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/MqMoKpLJ2rF5RRkn5jEO.mp4" %}

## In summary

Creating a focus state that has contrast with an element's default state is incredibly important. The default browser styles do this already for you, but if you want to change this behaviour, remember the following:

- Avoid using `outline: none` on an element that can receive keyboard focus
- Avoid replacing `outline` styles with `box-shadow`
as they don't show up in Windows High Contrast Mode
- Only set a positive value for `tabindex` on an HTML element if you absolutely have to
- Make sure the focus state is very clear vs the default state

{% Assessment 'focus' %}
