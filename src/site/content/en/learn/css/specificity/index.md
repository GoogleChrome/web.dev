---
title: Specificity
description: >
  This module takes a deeper look at specificity, a key part of the cascade.
audio:
  title: 'The CSS Podcast - 003: Specificity'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_003_v2.0_FINAL.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-02
---

Suppose that you're working with the following HTML and CSS:

```html
<button class="branding">Hello, Specificity!</button>
```

```css
button {
  color: red;
}

.branding {
  color: blue;
}
```

There's two competing rules here.
One will color the button red and the other will color it blue.
Which rule gets applied to the element?
Understanding the CSS specification's algorithm about specificity
is the key to understanding how CSS decides between competing rules.

Specificity is one of the four distinct stages of the cascade,
which was covered in the last module, on [the cascade](/learn/css/the-cascade/).

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'YzNKMXm',
  height: 200
} %}
</figure>

## Specificity scoring

Each selector rule gets a scoring.
You can think of specificity as a total score and each selector type earns points towards that score.
The selector with the highest score wins.

With specificity in a real project,
the balancing act is making sure the CSS rules you expect to apply, actually _do apply,_
while generally keeping scores low to prevent complexity.
The score should only be as high as we need it to be,
rather than aiming for the highest score possible.
In the future, some genuinely more important CSS might need to be applied.
If you go for the highest score, you'll make that job hard.

## Scoring each selector type

Each selector type earns points.
You add all of these points up to calculate a selector's overall specificity.

### Universal selector

A [universal selector](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) (`*`)
has **no specificity** and gets **0 points**.
This means that any rule with 1 or more points will override it

```css
* {
  color: red;
}
```

### Element or pseudo-element selector

An [element](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) (type)
or [pseudo-element](https://developer.mozilla.org/docs/Web/CSS/Pseudo-elements)
selector gets **1 point of specificity** .

#### Type selector

```css
div {
  color: red;
}
```

#### Pseudo-element selector

```css
::selection {
  color: red;
}
```

### Class, pseudo-class, or attribute selector

A [class](https://developer.mozilla.org/docs/Web/CSS/Class_selectors),
[pseudo-class](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes) or
[attribute](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors) selector gets **10 points of specificity**.

#### Class selector

```css
.my-class {
  color: red;
}
```

#### Pseudo-class selector

```css
:hover {
  color: red;
}
```

#### Attribute selector

```css
[href='#'] {
  color: red;
}
```

The [`:not()`](https://developer.mozilla.org/docs/Web/CSS/:not)
pseudo-class itself adds nothing to the specificity calculation.
However, the selectors passed in as arguments do get added to the specificity calculation.

```css
div:not(.my-class) {
  color: red;
}
```

This sample would have **11 points** of specificity
because it has one type selector (`div`) and one class _inside_ the `:not()`.

### ID selector

An [ID](https://developer.mozilla.org/docs/Web/CSS/ID_selectors)
selector gets **100 points of specificity**,
as long as you use an ID selector (`#myID`) and not an attribute selector (`[id="myID"]`).

```css
#myID {
  color: red;
}
```

### Inline style attribute

CSS applied directly to the `style` attribute of the HTML element,
gets a **specificity score of 1,000 points**.
This means that in order to override it in CSS,
you have to write an extremely specific selector.

```html
<div style="color: red"></div>
```

### `!important` rule

Lastly, an `!important` at the end of a CSS value gets a specificity score of **10,000 points**.
This is the highest specificity that one individual item can get.

An `!important` rule is applied to a CSS property,
so everything in the overall rule (selector and properties) does not get the same specificity score.

```css
.my-class {
  color: red !important; /* 10,000 points */
  background: white; /* 10 points */
}
```

{% Assessment 'scoring-beginner' %}

## Specificity in context

The specificity of each selector that matches an element is added together.
Consider this example HTML:

```html
<a class="my-class another-class" href="#">A link</a>
```

This link has two classes on it.
Add the following CSS, and it gets **1 point of specificity**:

```css
a {
  color: red;
}
```

Reference one of the classes in this rule,
it now has **11 points of specificity**:

```css
a.my-class {
  color: green;
}
```

Add the other class to the selector,
it now has **21 points of specificity**:

```css
a.my-class.another-class {
  color: rebeccapurple;
}
```

Add the `href` attribute to the selector,
it now has **31 points of specificity**:

```css
a.my-class.another-class[href] {
  color: goldenrod;
}
```

Finally,add a `:hover` pseudo-class to all of that,
the selector ends up with **41 points of specificity**:

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'scoring-advanced' %}

## Visualizing specificity

In diagrams and specificity calculators,
the specificity is often visualized like this:

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/McrFhjqHXMznUzXbRuJ6.svg", alt="A diagram demonstrating most specific to least specific selectors", width="800", height="474" %}

The left group is `id` selectors.
The second group is class, attribute, and pseudo-class selectors.
The final group is element and pseudo-element selectors.

For reference, the following selector is `0-4-1`:

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'visualizing' %}

## Pragmatically increasing specificity

Let's say we have some CSS that looks like this:

```css
.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

With HTML that looks like this:

```html
<button class="my-button" onclick="alert('hello')">Click me</button>
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'abpoxdR',
  tab: 'css,result'
} %}
</figure>

The button has a grey background,
because the second selector earns **11 points of specificity** (`0-1-1`).
This is because it has one type selector (`button`),
which is **1 point** and an attribute selector (`[onclick]`), which is **10 points**.

The previous rule—`.my-button`—gets **10 points** (`0-1-0`),
because it has one class selector.

If you want to give this rule a boost,
repeat the class selector like this:

```css
.my-button.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'zYNOXBJ',
  tab: 'css,result'
} %}
</figure>

Now, the button will have a blue background,
because the new selector gets a specificity score of **20 points** (`0-2-0`).

{% Aside 'caution' %}
If you find that you are needing to boost specificity like this frequently,
it may indicate that you are writing overly specific selectors.
Consider whether you can refactor your CSS to reduce the specificity of other selectors
to avoid this problem.
{% endAside %}

## A matching specificity score sees the newest instance win

Let's stay with the button example for now and switch the CSS around to this:

```css
.my-button {
  background: blue;
}

[onclick] {
  background: grey;
}
```

The button has a grey background,
because **both selectors have an identical specificity score** (`0-1-0`).

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'zYNOXKJ',
  tab: 'css,result'
} %}
</figure>

If you switch the rules in the source order,
the button would then be blue.

```css
[onclick] {
  background: grey;
}

.my-button {
  background: blue;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'WNReWRO',
  tab: 'css,result'
} %}
</figure>

This is the only instance where newer CSS wins.
To do so it must match the specificity of another selector that targets the same element.

## Resources

- [CSS SpeciFISHity](http://specifishity.com)
- [Specificity Calculator](https://specificity.keegan.st)
- [MDN Specificity](https://developer.mozilla.org/docs/Web/CSS/Specificity)
- [Specifics on CSS Specificity](https://css-tricks.com/specifics-on-css-specificity/)
- [Another Specificity Calculator](https://polypane.app/css-specificity-calculator)
