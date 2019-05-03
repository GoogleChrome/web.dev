---
layout: post
title: Manually check interactive elements indicate their purpose and state
description: |
  Learn about interactive-element-affordance audit.
web_lighthouse:
  - interactive-element-affordance
---

Interactive elements, such as links and buttons,
should indicate their state and be distinguishable from non-interactive elements.
To check interactive elements indicate their purpose and state,
use both a visual and a screen reader test.

## How to manually test visual focus

To manually test visual focus,
`TAB` through your page.

- Are you able to tab to each interactive element?
- When you get to an interactive element, is there a visual clue that users can interact with it?
- Does each interactive element change in appearance when you select it?

There are many ways to style the focus indicators for each interactive element.
One sure way is to use `:focus`.
The `:focus` pseudo-class lets you apply a uniform style to an element.
That style is applied any time the element is focused,
regardless of the input device or method used to focus it.

Learn more in [Style focus](/style-focus).

## How to manually test with a screen reader

Using a screen reader,
navigate yor page and check that the screen reader is able
to announce the name of each interactive control,
the role of that control, and the current interactive state.
If the role of an element is unclear, and the state of the element is unclear,
you may need to add the appropriate ARIA roles.
Learn more in [Manually check all custom controls have appropriate ARIA roles](/custom-control-roles).

It is also important to pay close attention to how interactive elements are labeled.
Screen reader users rely on labels to understand the context of that element.
Vague labels are common,
and they are non-helpful for navigating content.
Learn how to improve [Labels and text alternatives](/labels-and-text-alternatives).

## Why this matters

Providing visual hints about what a control will do
helps people operate and navigate your site.
These hints are called affordances.
Providing affordances makes it possible for people to use your site on a wide variety of devices.

## More information

- [Check interactive elements indicate their purpose and state audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/interactive-element-affordance.js)