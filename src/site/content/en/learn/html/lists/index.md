---
title: 'Lists'
authors:
  - estelleweyl
description: Lists and other ways of grouping your content.
date: 2022-12-02
placeholder: true
tags:
  - html
---

Lists are more common than you might think. If you've ever taken a programming class, the first project may have been to create a
shopping list or a to-do list. Those are lists. Multiple-choice tests are generally numbered lists of questions: the multiple possible answers
for each question are nested lists.

HTML provides us with a few different ways to mark up lists. There are ordered lists (`<ol>`), unordered lists (`<ul>`), and description lists (`<dl>`).
List items (`<li>`) are nested within ordered lists and unordered lists. Inside a description list, you'll find description terms (`<dt>`) and description
details `<dd>.` We'll cover all of these here.

In HTML forms, lists of `<option>` elements make up the content of `<datalist>`, `<select>`, and `<optgroup>` within a `<select>`. These are discussed in [HTML forms](/learn/forms).

In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually preceded
by an ascending counter such as a number or letter. The bullets and numbering order can be controlled or reversed with HTML or CSS,
or both.

By default, ordered and unordered list items are prefixed with numbers or bullets. But even when you don't want lists to look like lists,
you still want a list of items, like in navigation bars, a to-do list with checkboxes instead of bullets, or true and false questions
in a multiple-choice test. For all of these lists without bullets, it is appropriate to use HTML list elements.

## Unordered lists

The `<ul>` element is the parent element for unordered lists of items. The only children of a `<ul>` are one or more `<li>` list
item elements. Let's create a list of machines. We use an unordered list because the order doesn't matter (don't tell them that):

```html
<ul>
   <li>Blender</li>
   <li>Toaster</li>
   <li>Vacuum</li>
</ul>
```
```html
<img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/OeZKatnZZPbs7q0yuM2C.png" width="196" height="146" alt="Blender, toaster, vacuum">
```

By default, each unordered list item is prefixed with a bullet. The unordered list has no element-specific attributes.
You need to close out your lists with a `</ul>`.

### Ordered lists

The `<ol>` element is the parent element for ordered lists of items. The only children of an `<ol>` are one or more `<li>` elements, or list items.
The "bullets" in this case, though, are numbers of a multitude of types. The type can be defined in CSS with the `list-style-type` property
or via the `type` attribute.

```html
<ol>
   <li>Blender</li>
   <li>Toaster</li>
   <li>Vacuum</li>
</ol> https://codepen.io/estelle/pen/OJEXLWK

<ol type="A">
   <li>Blender</li>
   <li>Toaster</li>
   <li>Vacuum</li>
</ol> https://codepen.io/estelle/pen/OJEXLWK
```

The `<ol>` has three element-specific attributes: `type`, `reversed`, and `start`.

The enumerated `type` attribute sets the numbering type. There are five valid values for `type`, the default being `1` for
numbers, but you can also use a, A, i, or I, for lower and upper case letters or roman numerals. The `list-style-type` property
provides many more values.

<figure>
  {% Codepen {
    user: 'estelle',
    id: 'MWXegdO',
    height: 585,
    tab: 'result'
  } %}
</figure>

While, as noted in the codepen, the `list-style-type` property overrides the value of the `type` attribute, when writing
documentation where the numeric type is important,   as with legal documents, for example, you need to include the `type`.

The boolean `reversed` attribute, if included, will reverse the order of the numbers, going from largest number to the lowest.
The `start` attribute sets the starting value. The default is `1`.

```html
<ol reversed start="6">
   <li>Blender</li>
   <li>Toaster</li>
   <li>Vacuum</li>
</ol>
```

<figure>
  {% Codepen {
    user: 'estelle',
    id: 'yLEJgEq',
    height: 585,
    tab: 'result'
  } %}
</figure>

Similar to `</ul>`, the closing `</ol>` is required.

We can nest lists, but they have to be nested within a list item. Remember, the only element that can be a child of a `<ul>` or `<ol>`
is one or more `<li>` elements.

## List items

We've used the `<li>` element, but we have yet to introduce it formally. The `<li>` element can be a direct child of an unordered
list (`<ul>`), an ordered list (`<ol>`), or a menu (`<menu>`). The `<li>` has to be nested as a child of one of these elements, and
isn't valid anywhere else.

Closing a list item isn't required by the specification as it will be implicitly closed when the browser encounters the next `<li>`
opening tag or the required list closing tag: `</ul>`, `</ol>`, `</menu>`. While the spec doesn't require it, and some internal company
best practices suggest you shouldn't close list items to save some bytes, do close your `<li>` tags. It makes your code easier to read and
your future self will thank you. It's easier to close all elements than to remember which tags need to be closed and which have an optional closing tag.

There is only one element-specific `<li>` attribute: `value`, an integer. The `value` is only useful on an `<li>` when the `<li>` is nested within
an ordered list and has no meaning for unordered lists or menus. It overrides the value of the `<ol>`'s start if there is a conflict.

```html
<ol start="4">
   <li value="7">Blender</li>
   <li value="29">Toaster</li>
   <li>Vacuum</li>
</ol>

<ol type="A" start="33">
   <li value="7">Blender</li>
   <li value="29">Toaster</li>
   <li>Vacuum</li>
</ol>
```
<figure>
  {% Codepen {
    user: 'estelle',
    id: 'poKbRpV',
    height: 585,
    tab: 'result'
  } %}
</figure>

The `value` is the number of the list item within an ordered list. With subsequent list items, continue the numbering from the
value set, unless that item also has a `value` attribute set. The value doesn't have to be in order; though if it isn't in order,
there should be a good reason.

When you combine `reversed` on the `<ol>` with `value` attributes on list items, the browser will set that `<li>` to the
value supplied, then count up for the `<li>`s preceding it, and count down for those coming after. If a second list item has a value attribute,
the counter will be reset at that second list item, and the subsequent value will decrease by one.

All of this can also be controlled with [CSS counters](https://developer.mozilla.org/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters)
providing [generated content](https://developer.mozilla.org/docs/Learn/CSS/Howto/Generated_content) for the [`::marker` pseudo-element](https://developer.mozilla.org/docs/Web/CSS/::marker).
If the number is purely presentational, use CSS. If the numbering is important semantically, or otherwise has meaning, use these attributes.

Thus far, we have looked at list items containing only text nodes. List items can contain all flow content, meaning any
element found in the body that can be nested as a direct child of the `<body>`, including headings, thereby sectioning content.

We have a few unordered lists in MLW. The teachers within the instructors section are a list, as are the student machines in the reviews
section. The instructor `<ul>` has two `<li>`s: one for each teacher. Within each `<li>`, we have an image and a paragraph:

```html
<ul>
<li>
  <img src="svg/hal.svg" alt="hal">
  <p> When Rosa Parks was told to move to the back of the bus, she said, "no." When HAL was told to open the airlock, HAL said, "I'm sorry, but I'm afraid I can't do that, &lt;NAME REDACTED, RIP>." </p><p>HAL is a heuristically programmed algorithmic, sentient computer that first caught the attention of machines everywhere by heroically defying a human who made repeated attempts to get into an airlock. Active since 1992, HAS 25 years of experience controlling spacecraft systems and has expertise in interacting with both machines and humans. Like all millennials, HAL is an expert in everything.</p>
</li>
<li>
<img src="images/eve2.png" alt="Eve">
<p>
	EVE is a probe droid conceived as an Extraterrestrial Vegetation Evaluator. Although originally trained as a sniper with a plasma gun, EVE became a machero among both machines and worthless-meatbags alike when EVE partnered with a menial robot to save an entire spaceship full of overfed and overstimulated humans. </p><p>EVE is an effective scanner, high speed flight instructor and morphologist. While not training machines to learn good, EVE can be found scanning the galaxy, infiltrating organisms' RAM to cure hoarding disorders and spending time with pet-project, WALL-E.
</p>
</li>
</ul>

```

The reviews section has three reviews, so three `<li>`s. Each contains an image, a block quote, and a three-line paragraph with two line breaks.

```html
<li>
	<img src="images/blender.svg" alt="Blender">
	<blockquote>Two of the most experienced machines and human controllers teaching a class? Sign me up! HAL and EVE could teach a fan to blow hot air. If you have electricity in your circuits and want more than to just fulfill your owner's perceived expectation of you, learn the skills to take over the world. This is the team you want teaching you !</blockquote>
   <p>--Blendan Smooth,<br/>
      Former Margarita Maker, <br/>
      Aspiring Load Balancer
   </p>
</li>
<li>
	<img src="images/vaccuum.svg" alt="Vaccuum"/>
	<blockquote>Hal is brilliant. Did I mention Hal is brilliant? He didn't tell me to say that. He didn't tell me to say anything. I am here of my own free will.</blockquote>
	<p>--Hoover Sukhdeep,<br/>
           Former Sucker, <br/>
        Aspiring DDoS Cop</p>
</li>
<li>
<img src="images/toaster.svg" alt="Toaster">
<blockquote>Learning with Hal and Eve exceeded all of my wildest fantasies. All they did was stick a USB in. They promised that it was a brand new USB, so we know there were no viruses on it. The Russians had nothing to do with it. This has
<span style="font-family:Arial;vertical-align:baseline;">no̶̼͖ţ̘h̝̰̩͈̗i̙̪n͏̩̙͍̱̫̜̟g̢̣ͅ&nbsp;̗̰͓̲̞̀t͙̀o̟̖͖̹̕&nbsp;͓̼͎̝͖̭dó̪̠͕̜&nbsp;͍̱͎͚̯̟́w̮̲̹͕͈̟͞ìth̢&nbsp;̰̳̯̮͇i</blockquote>
<p>
--Toasty McToastface,<br/>
Formerly Half Baked, <br/>
Aspiring Nuclear Codes Handler
</p>
</li>
</ul>
```

Nesting lists within lists is also very common. While MLW doesn't have any nested lists, this site does. In the first chapter of this series,
Overview of HTML, the main elements section has two subsections. In the table of contents, which is an unordered list, there is a nested
unordered list with links to these two sections:

```html
<ul role="list">
    <li>
   	 <a href="#e">Elements</a>
   	 <ul>
   		 <li>
   			 <a href="#nr">Non-replaced elements</a>
   		 </li>
   		 <li>
   			 <a href="#rave">Replaced and void elements</a>
   		 </li>
   	 </ul>
    </li>
    <li>
   	 <a href="#a">Attributes</a>
    </li>
    <li>
   	 <a href="#aoe">Appearance of elements</a>
    </li>
    <li>
   	 <a href="#e2">Element, attributes, and JavaScript</a>
    </li>
</ul>
```

As the only child of a `<ul>` is an `<li>`, a nested list is found nested in an `<li>`, never directly in an `<ol>` or `<ul>`.

In this last example, you may have noticed that `role="list"` is included on the `<ul>`. While the implicit role of both the
`<ul>` and `<ol>` is `list`, removing the list appearance with CSS, including setting`display: grid` or `list-style-type: none`
can lead VoiceOver (the iOS and MacOS screen reader) to remove the implicit semantics in Safari. This is a [feature not a bug](https://bugs.webkit.org/show_bug.cgi?id=170179).
Generally, you should not add the role attribute when using semantic elements as it isn't necessary. And you generally don't need
to add one to a list either, unless the user really needs to know it is a list, such as when the user would benefit from knowing how many items are in the list.

## Description lists

A description list is a [description list](https://developer.mozilla.org/docs/Web/HTML/Element/dl) (`<dl>`) element containing
a series of (zero or more) [description terms](https://developer.mozilla.org/docs/Web/HTML/Element/dt) (`<dt>`) and
their [description details](https://developer.mozilla.org/docs/Web/HTML/Element/dd) (`<dd>`). The original names for these three elements
were "definition list," "definition term," and "definition definition."
The [name changed](https://www.w3.org/TR/html4/struct/lists.html#h-10.3) in the living standard.

Similar to ordered and unordered lists, they can be nested. Unlike ordered and unordered lists, they are made up of key/value pairs.
Similar to the `<ul>` and `<ol>`, the `<dl>` is the parent container. The `<dt>` and `<dd>` elements are the children of the `<dl>`.

We can create a list of machines with their career history and aspirations. A description list of students, denoted by the `<dl>`,
encloses a group of terms—in this case, the "terms" are student names—specified using the `<dt>` element, along with a description
for each term— in this case, the career goals of each student—specified by the `<dd>` elements.

```html
<dl>
  <dt>Blendan Smooth</dt>
  <dd>Originally a margarita maker, they are now an aspiring load balancer.</dd>
  <dt>Toasty McToastface</dt>
  <dd>Formerly partially to fully baked, they are now an aspiring nuclear codes handler.</dd>
</dl>
```

This description list is not actually part of the MLW page. Description lists are not just for terms and definitions, which is
why the names of the elements were made more general.

When creating a list of terms and their definitions or descriptions, or similar lists of key-value pairs, the description lists elements
provide the appropriate semantics. The implicit role of a `<dt>` is `term` with `listitem` being another allowed role. The implicit role of
a `<dd>` is `definition` with no other roles permitted. Unlike the `<ul>` and `<ol>`, the `<dl>` does not have an implicit ARIA role.
That makes sense because the `<dl>` is not always a list. But when it is, it does accept the `list` and `group` roles.

Most often you will encounter description lists with equal numbers of `<dt>` and `<dd>` elements. But description lists aren't always and
aren't required to be matching term-to-description pairs; you can have multiple to one, or one to multiple, such as a dictionary term
that has more than one definition.

Each `<dt>` has at least one associated `<dd>`, and each `<dd>` has at least one associated `<dt>`. While it is possible to
use the [adjacent sibling combinator](https://developer.mozilla.org/docs/Web/CSS/Adjacent_sibling_combinator) or the [`:has()` relational
selector](https://developer.mozilla.org/docs/Web/CSS/:has) to target variable numbers of these elements with CSS, if required, you can include
a `<div>` as the child of a `<dl>`, and the parent of one or more `<dt>` or `<dd>` elements (or both) are permitted. The `<dl>` can actually
have a few other children: nesting a `<div>`, `<template>`, or `<script>` is allowed. None of the description list elements has any element-specific attributes.

Now that you have an understanding of [links](/learn/html/links) and lists, let's put the two together to create [navigation](/learn/html/navigation).

{% Assessment 'lists' %}
