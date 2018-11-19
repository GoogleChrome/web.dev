---
page_type: guide
title: Semantics and screen readers
author: robdodson
web_lighthouse: N/A
wf_blink_components: Blink>Accessibility
---

Have you ever stopped to wonder _how_ assistive technology, such as a screen
reader, knows what to announce to users? The answer is that these technologies
rely on developers marking up their pages with **semantic** HTML. But what are
semantics, and how do screen readers use them?

## Affordances and semantics

Before diving into semantics, it's helpful to understand another term:
**affordances**. An affordance is any object that offers, or affords, its user
the opportunity to perform an action. A classic example is the teapot:

![A red teapot](./teapot.png)

This teapot doesn't need an instruction manual, instead it's physical design
conveys to the user how it should be operated. It has a handle, and because
you've seen other objects in the world with similar handles, you can infer how
you should pick it up and operate it.

When we build graphical user interfaces, we use things like CSS to add **visual
affordances** to our UI. For instance, you might give a button a drop shadow and
border, so it resembles an actual button in the real world.

But if a user is unable to see the screen, then these visual affordances will
not be conveyed to them. Therefore, you need to make sure that your UI is
constructed in a way that can convey these same affordances to assistive
technology. This non-visual exposure of a UI element's affordances are called
its **semantics**.

## Use semantic HTML

The easiest way of conveying proper semantics is to use semantically rich HTML
elements.

Here's a classic example: a `<div>` versus a `<button>`. Using CSS it's possible
to style both elements so they convey the same visual affordances, but compare
the experience when using this embedded screen reader:

[Glitch div versus button example]

Because a `<div>`, semantically, is just a generic grouping element, the screen
reader announces it as a "group". Whereas the `<button>` is announced as a
"button"—a much stronger signal to the user that this is something they can
interact with!

## Semantic properties and the accessibility tree

Generally speaking, every HTML element will have some of the following semantic
properties

- A **role** or type
- A **name**
- A **value** (optional)
- A **state** (optional)

An element's **role** describes its type, i.e. "button", "input", or even just
"group" for things like `div`s and `span`s.

An element's **name** is it's computed label. Screen readers typically announce
an element's name followed by its role, e.g. "Sign Up, button". The algorithm
that determines an element's name factors in things like any text content inside
of the element, whether or not it's associated with an actual `<label>` element,
and if it has any ARIA attributes such as `aria-label` and `aria-labelledby`.

<div class="aside note">
If you're interested in learning more about how element names are computed, take
a look at our guide on labeling form controls.
</div>

Some elements may have a **value**, for instance, `<input type="text">` may have
a value that reflects whatever the user has typed into the text field.

Some elements may also have a **state**, which conveys their current status. For
instance, a `<select>` element can be in either an _expanded_ or a _collapsed_
state, depending on if it's open or closed.

### The accessibility tree

For each node in the DOM, the browser parses these properties, determines if the
node is semantically "interesting", and adds it to [the accessibility
tree](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree).
When assistive technology, like a screen reader, is providing an alternative UI
to the user, it is often doing so by walking this accessibility tree.

<div class="aside note">
Browsers will often remove semantically uninteresting nodes like `div`s and `span`s from the accessibility tree, especially if they're just being used to position their children with CSS. For instance, if you have a `button` nested inside of 5 `div`s, it may prune out some of the `div`s in the middle to cut down on noise.
</div>

Using Chrome's DevTools you can inspect an element's semantic properties and
explore its position in the accessibility tree. Try it on the example below:

1. Right-click on the slider in the example, and choose `Inspect`.
1. Click on the **Accessibility** pane

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/slider-semantics?path=index.html&previewSize=100&attributionHidden=true"
    alt="slider-semantics on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

You should end up with a screen that looks similar to the one below:

![Chrome's accessibilty devtools, showing computed properties for a slider.](./a11y-devtools.png)
