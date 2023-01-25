---
layout: post
title: Prevents users from pasting into password fields
description: |
  Learn how to improve the user experience of your site's login screen by
  allowing users to paste text into password fields.
web_lighthouse:
  - password-inputs-can-be-pasted-into
date: 2019-05-02
updated: 2020-06-04
---

Some websites claim that allowing users to paste passwords reduces security.
However, password pasting actually _improves_ security
because it enables the use of password managers.

Password managers typically generate strong passwords for users,
store them securely, and then automatically paste them
into password fields whenever users need to log in. This approach is generally
more secure than forcing users to type in passwords that are short enough
to remember.

## How this Lighthouse audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags code that prevents users from pasting into password fields:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0tAkhHny7nQu4pYJ9m9E.png", alt="Lighthouse audit shows page stops users from pasting into password fields", width="800", height="163", class="w-screenshot" %}
</figure>

Lighthouse gathers all `<input type="password">` elements,
pastes some text into each element,
and then verifies that the element's content has been set to the pasted text.

If a page doesn't use `<input type="password">` for its password input fields,
Lighthouse doesn't detect those elements.
It's also possible to prevent pasting outside of a `paste` event listener.
Lighthouse doesn't detect that scenario, either.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to enable pasting into password fields

### Find the code that's preventing pasting

To quickly find and inspect the code that's preventing pasting:
{% Instruction 'devtools-sources', 'ol' %}
1. Expand the [**Event Listener Breakpoints**](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints#event-listeners) pane.
1. Expand the **Clipboard** list.
1. Select the **`paste`** checkbox.
1. Paste some text into a password field on your page.
1. DevTools should pause on the first line of code
   in the relevant `paste` event listener.

### Remove the code that's preventing pasting

The source of the problem is often a call to `preventDefault()`
within the `paste` event listener
that's associated with the password input element:

```js
let input = document.querySelector('input');

input.addEventListener('paste', (e) => {
  e.preventDefault(); // This is what prevents pasting.
});
```

If you're only listening to paste events to preempt them,
remove the entire event listener.

## Resources

[Source code for **Prevents users from pasting into password fields** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/password-inputs-can-be-pasted-into.js)
