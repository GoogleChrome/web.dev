---
title: 'ARIA and HTML'
authors:
  - cariefisher
description: When to use ARIA versus HTML.
date: 2023-09-23
placeholder: false
tags:
  - accessibility
---

Most developers are familiar with the standard markup language of our modern
web, [HyperText Markup Language (HTML)](https://developer.mozilla.org/docs/Web/HTML).
However, you may be less familiar with
[Accessible Rich Internet Applications (ARIA)](https://developer.mozilla.org/docs/Web/Accessibility/ARIA)
(formally called WAI-ARIA): what it is, how it is used, and when&mdash;and when _not_&mdash;to use it.

HTML and ARIA play important roles in making digital products accessible,
especially when it comes to assistive technology (AT) such as screen readers.
Both are used to convert content into an alternate format, such as Braille or
Text-to-Speech (TTS).

Let's review a short history of ARIA, why it is important, and when and how
best to use it.

## Introduction to ARIA

ARIA was first developed in 2008 by the
[Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) group&mdash;a
subset of the overarching World Wide Web Consortium (W3C), which governs and
regulates the internet.

ARIA is not a true programming language but a set of attributes you can add to
HTML elements to increase their accessibility. These attributes communicate
role, state, and property to assistive technologies via accessibility APIs
found in modern browsers. This communication happens through the accessibility
tree.

<blockquote>
  <p>"ARIA is a way to make Web content and Web applications more accessible to people with disabilities. It especially helps with dynamic content, and advanced user interface controls developed with HTML, JavaScript, and related technologies."</p>
  <cite>[WAI group](https://www.w3.org/WAI/standards-guidelines/aria/)</cite>
</blockquote>

### The accessibility tree

ARIA modifies incorrect or incomplete code to create a better experience for
those using AT by changing, exposing, and augmenting parts of the accessibility
tree. 

The accessibility tree is created by the browser and based on the standard
Document Object Model (DOM) tree. Like the DOM tree, the accessibility tree
contains objects representing all the markup elements, attributes, and text
nodes. The accessibility tree is also used by platform-specific accessibility
APIs to provide a representation that assistive technologies can understand.

<figure>
{% Img
  src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/G1IWcJBT9tfZq4xCKTqq.jpg",
  alt="The ARIA augmented accessibility tree.", 
  width="575"
%}
</figure>

ARIA on its own doesn't change an element's functionality or visual appearance.
That means only AT users will notice differences between a digital product with
ARIA and one without it. That also means that developers alone are responsible
for making the appropriate code and styling changes to make an element as
accessible as possible.

The three main features of ARIA are roles, properties, and states/values.

_Roles_ define what an element is or does on the page or app.

```html
<div role="button">Self-destruct</div>
```

_Properties_ express characteristics or relationships to an object.

```html
<div role="button" aria-describedby="more-info">Self-destruct</div>

<div id="more-info">This page will self-destruct in 10 seconds.</div>
```

_States/values_ define the current conditions or data values associated with the element.

```html
<div role="button" aria-describedby="more-info" aria-pressed="false">
  Self-destruct
</div>

<div id="more-info">
  This page will self-destruct in 10 seconds.
</div>
```

While all three elements of ARIA can be used in one line of code, it's not
required. Instead, layer ARIA roles, properties, and states/values until you've
accomplished your final accessibility goal. Correctly incorporating ARIA into
your code base ensures that AT users will have all the information they need to
use your website, app, or other digital product successfully and equitably.

## When to use ARIA

In 2014, the W3C officially published the HTML5 recommendation. With it came
some big changes, including the addition of landmark elements such as `<main>`,
`<header>`, `<footer>`, `<aside>`, `<nav>`, and attributes like `hidden` and
`required`. With these new HTML5 elements and attributes, coupled with
increased browser support, certain parts of ARIA are now less critical.

When the browser supports an HTML tag with an implicit role with an ARIA
equivalent, there is usually no need to add ARIA to the element. However, ARIA
still includes many roles, states, and properties that aren't available in any
version of HTML. Those attributes remain useful for now.

This brings us to the ultimate question: When should you use ARIA? Thankfully
the WAI group has developed the
[five rules of ARIA](https://www.w3.org/TR/using-aria/) to help you decide how
to make elements accessible.

### Rule 1: Don't use ARIA

Yes, you read that right. Adding ARIA to an element does not inherently make it
more accessible. The [WebAIM Million annual accessibility report](https://webaim.org/projects/million/)
found that home pages with ARIA
present averaged 70% more detected errors than those without ARIA, primarily
due to the improper implementation of the ARIA attributes.

There are exceptions to this rule. ARIA is required when an HTML element
doesn't have accessibility support. This could be because the design doesn't
allow for a specific HTML element or the wanted feature/behavior isn't
available in HTML. However, these situations should be scarce.

<div class="switcher">
{% Compare 'worse' %}
```html
<a role="button">Submit</a>
```
{% endCompare %}

{% Compare 'better' %}
```html
<button>Submit</button>
```
{% endCompare %}
</div>

When in doubt, use [semantic HTML elements](/learn/html/semantic-html/).

### Rule 2: Don't add (unnecessary) ARIA to HTML

In most circumstances, HTML elements work well out of the box and do not need additional ARIA added to them. In fact, developers using ARIA often have to add additional code to make the elements functional in the case of interactive elements.

<div class="switcher">
{% Compare 'worse' %}
```html
<h2 role="tab">Heading tab</h2>
```
{% endCompare %}

{% Compare 'better' %}
```html
<div role="tab"><h2>Heading tab</h2></div>
```
{% endCompare %}
</div>

Do less work and have better-performing code when you use HTML elements as
intended.

### Rule 3: Always support keyboard navigation

All interactive (not disabled) ARIA controls must be keyboard accessible. You
can add tabindex= "0" to any element that needs a focus that doesn't normally
receive keyboard focus. Avoid [using tab indexes with positive
integers](https://www.scottohara.me/blog/2019/05/25/tabindex.html)
whenever possible to prevent potential keyboard focus order issues.

<div class="switcher">
{% Compare 'worse' %}
```html
<span role="button" tabindex="1">Submit</span>
```
{% endCompare %}

{% Compare 'better' %}
```html
<span role="button" tabindex="0">Submit</span>
```

{% CompareCaption %}
Of course, if you can, use a real `<button>` element in this case.
{% endCompareCaption %}

{% endCompare %}
</div>

{% Aside 'caution' %}
Remember, people with and without visual impairments use keyboard navigation. Don't add unnecessary tab stops to headings and paragraphs, as these can add additional challenges for some users who navigate by keyboard alone.
{% endAside %}

### Rule 4: Don't hide focusable elements

Don't add `role= "presentation"` or `aria-hidden= "true"` to elements that need
to have focus&mdash;including elements with a `tabindex= "0"`. When you add
these roles/states to elements, it sends a message to the AT that these
elements are not important and to skip over them. This can lead to confusion or
disrupt users attempting to interact with an element.

<div class="switcher">
{% Compare 'worse' %}
```html
<div aria-hidden="true"><button>Submit</button></div>
```
{% endCompare %}

{% Compare 'better' %}
```html
<div><button>Submit</button></div>
```
{% endCompare %}
</div>

### Rule 5: Use accessible names for interactive elements

The purpose of an interactive element needs to be conveyed to a user before
they know how to interact with it. Ensure that all elements have an
[accessible name](https://www.w3.org/TR/accname-1.1/) for people using AT
devices. 

Accessible names can be the content surrounded by an element (in the case of an
`<a>`), alternative text, or a label.

For each of the following code samples, the accessible name is "Red leather
boots."

```html
<!-- A plain link with text between the link tags. -->
<a href="shoes.html">Red leather boots</a>

<!-- A linked image, where the image has alt text. -->
<a href="shoes.html"><img src="shoes.png" alt="Red leather boots"></a>

<!-- A checkbox input with a label. -->
<input type="checkbox" id="shoes">
<label for="shoes">Red leather boots</label>
```

There are many ways to check an element's accessible name, including inspecting the accessibility tree using [Chrome DevTools](https://developer.chrome.com/blog/full-accessibility-tree/) or testing it with a screen reader. Read more about screen reader testing in module [testing module link]. 

## ARIA in HTML

While using HTML elements on their own is best practice, ARIA elements can be
added in certain situations. For example, you may pair ARIA with HTML in
patterns that need a higher level of AT support because of environmental
constraints or as a fall-back method for HTML elements that aren't fully
supported by all browsers.

Of course, there are recommendations for implementing [ARIA in
HTML](https://www.w3.org/TR/html-aria/). Most importantly: don't override
default HTML roles, reduce redundancy, and be aware of unintended side effects.

Let's look at some examples.

<div class="switcher">
{% Compare 'worse' %}
```html
<a role="heading">Read more</a>
```

{% CompareCaption %}
Wrong role.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```html
<a aria-label="Some awesome article title">Read More</a>
```

{% CompareCaption %}
Correct role and an extra link description.
{% endCompareCaption %}

{% endCompare %}
</div>

<div class="switcher">
{% Compare 'worse' %}
```html
<ul role="list">...</ul>
```

{% CompareCaption %}
Redundant role.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```html
<ul>...</ul>
```

{% CompareCaption %}
Redundancy removed
{% endCompareCaption %}

{% endCompare %}
</div>

<div class="switcher">
{% Compare 'worse' %}
```html
<details>
  <summary role="button">more information</summary>
  ...
</details>
```

{% CompareCaption %}
Potential side effects.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```html
<details>
  <summary>more information</summary>
  ...
</details>
```

{% CompareCaption %}
No unintended side effects.
{% endCompareCaption %}

{% endCompare %}
</div>

{% Aside %}
One place in particular where ARIA can be useful is in forms. Check out the [Learn Forms accessibility module](https://web.dev/learn/forms/accessibility/).
{% endAside %}

## Complexities of ARIA

ARIA is complex, and you should always use caution when using it. While the
code examples in this lesson are fairly straightforward, creating accessible
custom patterns can quickly get complicated. 

There are many things to pay attention to, including but not limited to:
keyboard interactions, touch interfaces, AT/browser support, translation needs,
environmental constraints, legacy code, and user preferences. A little bit of
coding knowledge can be detrimental&mdash;or just plain annoying&mdash;if used
incorrectly. Remember to keep your code simple.

Those warnings aside, digital accessibility is not an all-or-nothing
situation&mdash;it's a spectrum that allows for some gray areas like this.
Multiple coding solutions can be seen as "correct," depending on the situation.
What is important is that you keep learning, testing, and trying to make our
digital world more open to all.

{% Assessment 'aria' %}
