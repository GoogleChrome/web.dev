---
layout: post
title: Use semantic HTML for easy keyboard wins
authors:
  - robdodson
date: 2018-11-18
description: |
  By using the correct semantic HTML elements you may be able to meet most or
  all of your keyboard access needs. That means less time fiddling with
  tabindex, and more happy users!
---

By using the correct semantic HTML elements you may be able to meet most or all
of your keyboard access needs. That means less time fiddling with `tabindex`,
and more happy users!

## Keyboard support for free (and better mobile experiences)

There are a number of built-in interactive elements with proper semantics and
keyboard support. The ones most developers use are:

- [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [`<input>` (and its many
    types)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)
- [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
- [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)

In addition, elements with the
[`contenteditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
attribute are sometimes used for freeform text entry.

It's easy to overlook the built-in keyboard support that these elements offer.
Below are some example elements to explore. Instead of using your
mouse, try using your keyboard to operate them. You can use `TAB` (or `SHIFT +
TAB`) to move between controls, and you can use the arrow keys and keys like
`ENTER` and `SPACE` to manipulate their values.

<div class="glitch-embed-wrap" style="height: 450px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/interactive-elements?path=index.html&previewSize=100&attributionHidden=true"
    alt="interactive-elements on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

If you have a phone handy, you can see that many times these built-in elements
have unique interactions on mobile. Attempting to reproduce these mobile
interactions yourself is a lot of work! It's another good reason to stick to
built-in elements whenever possible.

## Use `button` instead of `div`

A common accessibility anti-pattern is to treat a non-interactive element, like
a `div` or a `span`, as a button by adding a click handler to it.

But to be considered accessible, a button should:

- Be focusable via the keyboard
- Support being disabled
- Support the `ENTER` or `SPACE` keys to perform an action
- Be announced properly by a screen reader

A `div` button has none of these things. That means you'll need to write
additional code to replicate what the `button` element gives you for free!

For example, `button` elements have a neat trick called ****synthetic click
activation****. If you add a "click" handler to a `button`, it will run when the
user presses `ENTER` or `SPACE`. A `div` button doesn't have this feature, so
you'll need to write additional code to listen for the `keydown` event, check
that the keycode is `ENTER` or `SPACE`, and then run your click handler. Ouch!
That's a lot of extra work!

Compare the difference in this example. `TAB` to either control, and use `ENTER`
and `SPACE` to attempt to click on them.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/synthetic-click?path=index.html&previewSize=100&attributionHidden=true"
    alt="synthetic-click on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

If you have `div` buttons in your existing site or application, consider
swapping them out for `button` elements. `button` is easy to style and full of
accessibility wins!

## Links versus buttons

Another common anti-pattern is to treat links as buttons by attaching JavaScript
behavior to them.

```html
<a href="#" onclick="// perform some action">
```

Both buttons and links support some form of synthetic click activation. So which
should you choose?

- If clicking on the element will perform an _action_ on the page, use
  `<button>`.
- If clicking on the element will _navigate_ the user to a new page then use
  `<a>`. This includes single page web apps that load new content and update
  the URL using the
  [History API](https://developer.mozilla.org/en-US/docs/Web/API/History).

The reason for this is that buttons and links are announced differently by
screen readers. Using the correct element helps screen reader users know which
outcome to expect.

{% AssessmentCallout 'Use the drop-down below each code sample to check whether the sample should use buttons or links.' %}
{% Tabs 'Samples for knowledge self check' %}
{% Tab 'sample' %}

```html
See <a href="https://webaim.org/intro/" rel="noopener">WebAIM's Introduction to Web Accessibility</a> for more information.
```

{% AssessmentHint 'Should this sample use a button or a link?' %}
This sample should use a **link**. The sample is **correct**.

When selected, the element navigates the user to another page on a different domain, so a link is semantic.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

```html
See the <a href="/semantics-and-screen-readers">Semantics and screen readers page</a> for more information.
```

{% AssessmentHint 'Should this sample use a button or a link?' %}
This sample should use a **link**. The sample is **correct**.

When selected, the element navigates the user to a different page on the same domain. No matter where a resource is located, use a link to semantically indicate navigation.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

When selected, this element opens a modal dialog:

```html
<a href="#" onclick="openDialog()">
```

{% AssessmentHint 'Should this sample use a button or a link?' %}
This sample should use a **button**. The sample is **incorrect**.

When selected,
the element runs a function that opens a modal dialog on the same page;
since the element isn't navigating the user to a separate page,
a button is semantic.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

When selected, this element opens a navigation menu:

```html
<a href="#" onclick="openNavMenu()">
```

{% AssessmentHint 'Should this sample use a button or a link?' %}
This sample should use a **button**. The sample is **incorrect**.

When selected,
the element runs a function that opens a navigation menu on the same page.
Opening the menu is an action, so a button is semantic.
{% endAssessmentHint %}

{% endTab %}
{% Tab 'sample' %}

This code renders a horizontal navigation menu at the top of a website:

```html
<nav>
  <button>About</button>
  <button>Services</button>
  <button>Work</button>
  <button>Contact</button>
</nav>
```

{% AssessmentHint 'Should this sample use buttons or links?' %}
This sample should use **links**. The sample is **incorrect**.

The elements in the `<nav>` menu navigate the user to other pages.
Those pages may be separate resources in a static site,
or they may be views in a
[single-page application](https://developers.google.com/web/fundamentals/architecture/app-shell).
Either way, since the user is navigating somewhere else, links are semantic.
{% endAssessmentHint %}

{% endTab %}
{% endTabs %}
{% endAssessmentCallout %}

## Styling

Some built-in elements, in particular `<input>`, can be difficult to style.
With a bit of clever CSS you may be able to work around some of these
limitations. The (hilariously named) [WTFForms](http://wtfforms.com/) project
contains an [example
stylesheet](https://github.com/mdo/wtf-forms/blob/master/wtf-forms.css)
that demonstrates a number of techniques for styling some of the tougher
built-in elements.

## Next steps

Using built-in HTML elements can greatly improve the accessibility of your site,
and significantly cut down on your workload. Try tabbing through your site and
look for any controls which lack keyboard support. If possible, switch them out
for native HTML alternatives.

Sometimes you may find an element that doesn't have a counterpart in HTML.
That's okay! Read on to learn how to add keyboard support to custom interactive
controls using `tabindex`.
