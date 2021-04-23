---
title: Selectors
description:
authors:
  - andybell
date: 2021-03-29
---

# Selectors

If you've got some text that you only want to be larger and red if it's the first paragraph of an article,
how do you do that?

```html
<article>
  <p>I want to be red and larger than the other text.</p>
  <p>I want to be normal sized and the default color.</p>
</article>
```

You use a CSS selector to find that specific element and apply a CSS rule, like this.

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

CSS provides you with a lot of options to select elements and apply rules to them,
ranging from very simple to very complex,
to help solve situations like this.

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWprGYz'
} %}

## The parts of a CSS rule

To understand how selectors work and their role in CSS,
it's important to know the parts of a CSS rule.
A CSS rule is a block of code,
containing one or more selectors and one or more declarations.

<figure class="w-figure>
{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Vh2pt6e50XaObt1lEjEv.png", alt="An image of a CSS rule with the selector .my-css-rule", width="800", height="427" %}
</figure>

In this CSS rule, the **selector** is `.my-css-rule`
which finds all elements with a class of `my-css-rule` on the page.
There are three declarations within the curly brackets.
A declaration is a property and value pair which applies styles to the elements matched by the selectors.
A CSS rule can have as many declarations and selectors as you like.

## Simple selectors

The most straightforward group of selectors target HTML elements plus
classes, IDs, and other attributes which may be added to an HTML tag.

### Universal selector

A [universal selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors)—also known as a wildcard—matches any element.

```css
* {
  color: hotpink;
}
```

This rule causes every HTML element on the page to have hotpink text.

### Type selector

A [type selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)
matches a HTML element directly.

```css
section {
  padding: 2em;
}
```

This rule causes every `<section`> element to have `2em` of `padding` on all sides.

### Class selector

A HTML element can have one or more items defined in their `class` attribute.
The
[class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)
matches any element that has that class applied to it.

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

Any element that has the class applied to it will get colored red:

```css
.my-class {
  color: red;
}
```

Notice how the `.` is only present in CSS and **not** the HTML.
This is because the `.` character instructs the CSS language to match class attribute members.
This is a common pattern in CSS, where a special character,
or set of characters, is used to define selector types.

A HTML element that has a class of `.my-class` will still be matched to the above CSS rule,
even if they have several other classes, like this:

```html
<div class="my-class another-class some-other-class"></div>
```

This is because CSS looks for a `class` attribute that _contains_ the defined class,
rather than matching that class exactly.

{% Aside %}
The value of a class attribute can be almost anything you want it to be.
One thing that could trip you up, is that you can't start a class (or an ID) with a number,
such as `.1element`.
You can read more [in the specification](https://www.w3.org/TR/CSS21/syndata.html#characters).
{% endAside %}

### ID selector

An HTML element with an `id` attribute should be the only element on a page with that ID value.
You select elements with an
[ID selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) like this:

```css
#rad {
  border: 1px solid blue;
}
```

This CSS would apply a blue border to the HTML element that has an `id` of `rad`, like this:

```html
<div id="rad"></div>
```

Similarly to the class selector `.`,
use a `#` character to instruct CSS to look for an element that matches the `id` that follows it.

{% Aside %}
If the browser encounters more than one instance of an `id`
it will still apply any CSS rules that match its selector.
However, any element that has an `id` attribute is supposed to have a unique value for it,
so unless you're writing very specific CSS for a single element,
avoid applying styles with the `id` selector as it means you can't re-use those styles elsewhere.
{% endAside %}

### Attribute selector

You can look for elements that have a certain HTML attribute,
or have a certain value for an HTML attribute,
using the [attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
Instruct CSS to look for attributes by wrapping the selector with square brackets (`[ ]`).

```css
[data-type='primary'] {
  color: red;
}
```

This CSS looks for all elements that have an attribute of `data-type` with a value of `primary`, like this:

```html
<div data-type="primary"></div>
```

Instead of looking for a specific value of `data-type`,
you can also look for elements with the attribute present, regardless of its value.

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

Both of these `<div>` elements will have red text.

You can use case-sensitive attribute selectors
by adding an `s` operator to your attribute selector.

```css
[data-type='primary' s] {
  color: red;
}
```

This means that if a HTML element had a `data-type` of `Primary`,
instead of `primary`, it would not get red text.
You can do the opposite—case insensitivity—by using an `i` operator.

Along with case operators,
you have access to operators that match portions of strings inside attribute values.

```css
/* A href that contains “example.com” */
[href*='example.com'] {
  color: red;
}

/* A href that starts with https */
[href^='https'] {
  color: green;
}

/* A href that ends with .com */
[href$='.com'] {
  color: blue;
}
```

<figure class="w-figure">
  {% Codepen {
    user: 'web-dot-dev',
    id: 'BapBbOy'
  } %}
  <figcaption class="w-figcaption">In this demo, the `$` operator in our attribute selector gets the filetype from the `href` attribute.
  This makes it possible to prefix the label—based on that filetype—using a pseudo-element.</figcaption>
</figure>

### Grouping selectors

A selector doesn't have to match only a single element.
You can group multiple selectors by separating them with commas:

```css
strong,
em,
.my-element,
[lang] {
  color: red;
}
```

This example extends the color change to both `<strong>` elements and `<em>` elements.
It's also extended to a class named `.my-class`,and an element that has a `lang` attribute.

{% Assessment 'simple-selectors' %}

## Pseudo-classes and pseudo-elements

CSS provides useful selector types that focus on specific platform state,
like when an element is hovered, structures _inside_ an element, or parts of an element.

### Pseudo-classes

HTML elements find themselves in various states,
either because they are interacted with,
or one of their child elements is in a certain state.

For example, an HTML element could be hovered with the mouse pointer by a user
_or_ a child element could also be hovered by the user.
For those situations, use the `:hover` pseudo-class.

```css
/* Our link is hovered */
a:hover {
  outline: 1px dotted green;
}

/* Sets all even paragraphs to have a different background */
p:nth-child(even) {
  background: floralwhite;
}
```

For more on pseudo-classes, check out lesson 15.

@@TO DO link up to lesson 15

### Pseudo-element

Pseudo-elements differ from pseudo-classes because instead of responding to the platform state,
they act as if they are inserting a new element with CSS.
Pseudo-elements are also syntactically different from pseudo-classes,
because instead of using a single colon (`:`), we use a double colon (`::`).

{% Aside %}
A double colon (`::`) is what distinguishes a pseudo-element from a pseudo-class,
but because this distinction wasn't present in older versions of CSS specs,
browsers support a single colon for the original pseudo-elements,
such as `:before` and `:after` to help with backwards compatibility with older browsers, like IE8.
{% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

As in the above demo where you prefixed a link's label with the type of file it was,
you can use the `::before` pseudo-element to insert content **at the start of an element**,
or the `::after` pseudo-element to insert content at the **end of an element**.

Pseudo-elements aren't limited to inserting content, though.
You can also use them to target specific parts of an element.
For example, suppose you have a list.
Use `::marker` to style each bullet point (or number) in the list

```css
/* Your list will now either have red dots, or red numbers */
li::marker {
  color: red;
}
```

You can also use `::selection` to style the content that has been highlighted by a user.

```css
::selection {
  background: black;
  color: white;
}
```

For more on pseudo-elements, check out lesson 14.

@@TO DO link up to lesson 14

{% Assessment 'pseudo-selectors' %}

## Complex selectors

You have already seen a vast array of selectors,
but sometimes, you will need more _fine-grained control_ with your CSS.
This is where complex selectors step in to help.

It's worth remembering at this point that although the following selectors give us more power,
we can only **cascade downwards**, selecting child elements.
We are not able to target upwards and select a parent element.
We cover what the cascade is and how it works in a later lesson.

### Combinators

A combinator is what sits between two selectors.
For example, if the selector was `p > strong`, the combinator is the `>` character.
The selectors which use these combinators help you select items based on their position in the document.

#### Descendant combinator

To understand descendant combinators,
you need to first understand parent and child elements.

```html
<p>A paragraph of text with some <strong>bold text for emphasis</strong>.</p>
```

The parent element is the `<p>` which contains text.
Inside that `<p>` element is a `<strong>` element, making its content bold.
Because it is inside the `<p>`, it is a child element.

A descendant combinator allows us to target a child element.
This uses a space (` `) to instruct the browser to look for child elements:

```css
p strong {
  color: blue;
}
```

This snippet selects all `<strong>` elements
that are child elements of `<p>` elements only, making them blue recursively.

<figure class="w-figure">
  {% Codepen {
    user: 'web-dot-dev',
    id: 'BapBbGN'
  } %}
  <figcaption class="w-figcaption">Because the descendant combinator is recursive,
the padding added to each child element applies, resulting in a staggered effect.</figcaption>
</figure>

This effect is better visualised in the above example,
using the combinator selector, `.top div`.
That CSS rule adds left padding to those `<div>` elements.
Because the combinator is recursive,
all `<div>` elements that are in `.top` will have that same padding applied to them.

Take a look at the HTML panel in this demo
to see how the `.top` element has several `<div>` child elements which themselves,
have `<div>` child elements.

#### Next sibling combinator

You can look for an element that immediately follows another element
by using a `+` character in your selector.

{% Codepen {
    user: 'web-dot-dev',
    id: 'JjEPzwB'
} %}

To add space between stacked elements,
use the next sibling combinator to add space
_only_ if an element is a **next sibling** of a child element of `.top`.

You could add margin to all child elements of `.top`,
using the following selector:

```css
.top * {
  margin-top: 1em;
}
```

The problem with this is that because you're selecting every child element of `.top`,
this rule potentially creates extra, unnecessary space.
The **next sibling combinator**,
mixed with a **universal selector** enables you to not only control what elements get space,
but also apply space to **any element**.
This provides you with some long-term flexibility,
regardless of what HTML elements appear in `.top`.

#### Subsequent- sibling combinator

A subsequent combinator is very similar to a next sibling selector.
Instead of a `+` character however,
use a `~` character.
How this differs is that an element just has to follow another element with the same parent,
rather than being the next element with the same parent.

<figure class="w-figure">
  {% Codepen {
    user: 'web-dot-dev',
    id: 'ZELzPPX'
  } %}
  <figcaption class="w-figcaption">Use a subsequent selector along with a `:checked` pseudo class to create a pure CSS switch element.</figcaption>
</figure>

This subsequent combinator provides a little less rigidity,
which is useful in contexts like the above sample,
where we change the color of a custom switch when its associated checkbox has the `:checked` state.

#### Child combinator

A child combinator (also known as direct descendant)
allows you more control over the recursion that comes with combinator selectors.
By using the `>` character, you limit the combinator selector to apply **only** to direct children.

Consider the previous, next sibling selector example.
The space is added to each **next sibling**,
but if one of those elements also has **next sibling elements** as children,
it can result in undesirable, extra spacing.

{% Codepen {
    user: 'web-dot-dev',
    id: 'ExZYMJL'
} %}

To alleviate this problem,
change the **next sibling selector** to incorporate a child combinator: `> * + *`.
The rule will now **only** apply to direct children of `.top`.

{% Codepen {
    user: 'web-dot-dev',
    id: 'dyNbrEr'
} %}

### Compound selectors

You can combine selectors to increase specificity and readability.
For example, to target `<a>` elements,
that also have a class of `.my-class`, write the following:

```css
a.my-class {
  color: red;
}
```

This wouldn't apply a red color to all links
and it would also only apply the red color to `.my-class` **if** it was on an `<a>` element.
For more on specificity, see module 3.

@@TO DO link

{% Assessment 'complex-selectors' %}

## Resources

- [CSS selectors reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [Interactive selectors game](https://flukeout.github.io/)
- [Pseudo-class and pseudo-elements reference](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [A tool that translates CSS selectors into plain-english explainers](https://hugogiraudel.github.io/selectors-explained/)
