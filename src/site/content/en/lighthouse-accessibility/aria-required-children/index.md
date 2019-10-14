---
layout: post
title: "Elements with an ARIA `[role]` that require children to contain a specific `[role]` are missing some or all of those required children"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all elements with ARIA roles have the required child
  elements.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-children
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Some ARIA roles require child roles.
For example, the `tablist` role must own at least one element
with the `tab` role.
If the required child roles aren't present,
screen readers may convey confusing information about your page,
like announcing a tab set with no tabs.

## How Lighthouse identifies missing child roles

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA roles that don't have the required child roles:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-required-children.png" alt="Lighthouse audit showing ARIA role missing required child role(s)">
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check for
<a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">required owned elements</a>—that is,
required child roles.
A page fails this audit
when it contains a parent role that's missing its required child roles.


In the example Lighthouse audit above,
the `radiogroup` role requires child elements with the `radio` role.
Since there are no children with a `radio` role defined,
the audit fails.
This makes sense,
as it would be confusing to have a radio group without any radio buttons.

This issue is important to fix and may break the experience for users.
In the example above, the element may still be announced as a radio group,
but users won't know how many radio buttons it contains.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add missing child roles

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>
to see which child roles are required for the elements that Lighthouse flagged.
(The spec refers to required children as
<a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">required owned elements</a>.)

There are two ways to add required child roles.

### Option 1: Place the required child elements within the parent in the DOM
Placing elements with required child roles within the parent role element
in your HTML is usually the easiest and most maintainable solution.
For example:

```html
<div role="tablist">
	<button role="tab" aria-selected="true" aria-controls="tab-1-pane" active>
		Tab 1
	</button>
	<button role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-2-pane">
		Tab 2
	</button>
	<button role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-3-pane">
		Tab 3
	</button>
</div>
```

### Option 2: Associate the required child roles with the parent role using `aria-owns`
If you can't place the required child role elements inside the parent role element,
you can use the `aria-owns` attribute to associate them:

```html
<div role="tablist" aria-owns="tab-1 tab-2 tab-3"></div>
…
<button id="tab-1" role="tab" aria-selected="true" aria-controls="tab-1-pane" active>
  Tab 1
</button>
<button id="tab-2" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-2-pane">
  Tab 2
</button>
<button id="tab-3" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-3-pane">
  Tab 3
</button>
```

{% Aside %}
If an element with the `aria-owns` attribute contains DOM children,
screen readers will announce the DOM children before the elements
listed in `aria-owns`.
{% endAside %}

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-children.js" rel="noopener">Source code for **Elements with an ARIA `[role]` that require children to contain a specific [role] are missing some or all of those required children** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-children" rel="noopener">Certain ARIA roles must contain particular children</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
