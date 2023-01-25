---
layout: post
title: Semantics and screen readers
authors:
  - robdodson
date: 2018-11-18
description: |
  Have you ever stopped to wonder how assistive technology, such as a screen
  reader, knows what to announce to users? The answer is that these technologies
  rely on developers marking up their pages with semantic HTML. But what are
  semantics, and how do screen readers use them?
---

Have you ever stopped to wonder _how_ assistive technology, such as a screen
reader, knows what to announce to users? The answer is that these technologies
rely on developers marking up their pages with **semantic** HTML. But what are
semantics, and how do screen readers use them?

## Affordances and semantics

Before diving into semantics, it's helpful to understand another term:
**affordances**. An affordance is any object that offers, or affords, its user
the opportunity to perform an action. A classic example is the teapot:

<figure class="w-figure">
  {% Img src="image/admin/EXqR31Kq3mosH6jv6jiG.png", alt="", width="640", height="446" %}
  <figcaption class="w-figcaption">
    A teapot's handle is a natural affordance.
  </figcaption>
</figure>

This teapot doesn't need an instruction manual; instead, its physical design
conveys to the user how it should be operated. It has a handle, and because
you've seen other objects in the world with similar handles, you can infer how
you should pick it up and operate it.

When we build graphical user interfaces, we use things like CSS to add **visual
affordances** to our UI. For instance, you might give a button a drop shadow and
border so that it resembles an actual button in the real world.

But if a user is unable to see the screen, then these visual affordances will
not be conveyed to them. Therefore, you need to make sure that your UI is
constructed in a way that can convey these same affordances to assistive
technology. This non-visual exposure of a UI element's affordances is called
its **semantics**.

## Use semantic HTML

The easiest way of conveying proper semantics is to use semantically rich HTML
elements.

Using CSS, it's possible
to style the `<div>` and `<button>` elements so they convey the same visual affordances,
but the two experiences are very different when using a screen reader.
A `<div>` is just a generic grouping element,
so a screen reader only announces the text content of the `<div>`.
The `<button>` is announced as a "button,"
a much stronger signal to the user that it's something they can interact with.

The simplest
and often best solution to this problem
is to avoid custom interactive controls altogether.
For example, replace a `<div>` that's acting like a button
with an actual `<button>`.

## Semantic properties and the accessibility tree

Generally speaking, every HTML element will have some of the following semantic
properties:

- A **role** or type
- A **name**
- A **value** (optional)
- A **state** (optional)

An element's **role** describes its type, i.e. "button," "input," or even just
"group" for things like `div`'s and `span`'s.

An element's **name** is its computed label. Screen readers typically announce
an element's name followed by its role, e.g. "Sign Up, button." The algorithm
that determines an element's name factors in things like if there is any text
content inside the element, whether or not it has attributes such as `title`
or `placeholder`, whether or not the element is associated with an actual
`<label>` element, and if the element has any ARIA attributes such as
`aria-label` and `aria-labelledby`.

Some elements _may_ have a **value**. For instance, `<input type="text">` may
have a value that reflects whatever the user has typed into the text field.

Some elements _may_ also have a **state**, which conveys their current status.
For instance, a `<select>` element can be in either an _expanded_ or a
_collapsed_ state, depending on if it's open or closed.

### The accessibility tree

For each node in the DOM, the browser determines if the
node is semantically "interesting" and adds it to [the accessibility
tree](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree).
When assistive technology, like a screen reader, is providing an alternative UI
to the user, it is often doing so by walking this accessibility tree.

{% Aside %}
Browsers will often remove semantically uninteresting nodes like `div` and
`span` from the accessibility tree, especially if they're just being used to
position their children with CSS. For instance, if you have a `button` nested
inside of 5 `div`'s, the browser may prune out some of the `div`'s in the middle
to cut down on noise.
{% endAside %}

Using Chrome's DevTools you can [inspect an element's semantic
properties](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
and explore its position in the accessibility tree.

## Next steps

Once you know a bit about semantics and how they aid screen reader navigation,
you can't help but look at the pages you build differently. In the next section,
we'll take a step back and consider how the entire outline of a page can be
conveyed using effective headings and landmarks.
