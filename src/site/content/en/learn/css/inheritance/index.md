---
title: Inheritance
description:
authors:
  - andybell
date: 2021-04-02
---

# Inheritance

Say you just wrote some CSS to make elements look like a button.

```html
<a href="http://example.com" class="my-button">I am a button link</a>
```

```css
.my-button {
  display: inline-block;
  padding: 1rem 2rem;
  text-decoration: none;
  background: pink;
  font: inherit;
  text-align: center;
}
```

You then add a link element to an article of content,
with a `class` value of `.my-button`. However there's an issue,
the text is not the color that you expected it to be. How did this happen?

Some CSS properties inherit if you don't specify a value for them.
In the case of this button, it **inherited** the `color` from this CSS:

```css
article a {
  color: maroon;
}
```

In this lesson you'll learn why that happens and
how inheritance is a powerful feature to help you write less CSS.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'zYNGEbg'
} %}
</figure>

## Inheritance flow

Let's take a look at how inheritance works,
using this snippet of HTML:

```html
<html>
  <body>
    <article>
      <p>Lorem ipsum dolor sit amet.</p>
    </article>
  </body>
</html>
```

The root element (`<html>`) won't inherit anything because it is the first element in the document.
Add some CSS on the HTML element,
and it starts to cascade down the document.

```css
html {
  color: lightslategray;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEKgBX'
} %}
</figure>

The `color` property is inheritable by other elements.
The `html` element has `color: lightslategray`,
therefore all elements that can inherit color will now have a color of `lightslategray`.

```css
body {
  font-size: 1.2em;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPLrLP'
} %}
</figure>

{% Aside %}
Because this demo sets the font size on the `body` element,
the `html` element will still have the initial font size set by the browser (user agent stylesheet),
but the `article` and `p` will inherit the font size declared by the `body`.
This is because inheritance only cascades downwards.
{% endAside %}

```css
p {
  font-style: italic;
}
```

Only the `<p>` will have italic text because it's the deepest nested element.
Inheritance only flows downwards, not back up to parent elements.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEKgmK'
} %}
</figure>

## Which properties are inheritable?

Not all CSS properties are inheritable,
but there are a lot that are.
For reference, here is the entire list of inheritable properties,
taken from the W3 reference of all CSS properties:

- [azimuth](https://developer.mozilla.org/en-US/docs/Web/CSS/azimuth)
- [border-collapse](https://developer.mozilla.org/en-US/docs/Web/CSS/border-collapse)
- [border-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/border-spacing)
- [caption-side](https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side)
- [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)
- [cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- [direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [empty-cells](https://developer.mozilla.org/en-US/docs/Web/CSS/empty-cells)
- [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
- [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)
- [font-style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style)
- [font-variant](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant)
- [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)
- [font](https://developer.mozilla.org/en-US/docs/Web/CSS/font)
- [letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
- [line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
- [list-style-image](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-image)
- [list-style-position](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position)
- [list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
- [list-style](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style)
- [orphans](https://developer.mozilla.org/en-US/docs/Web/CSS/orphans)
- [quotes](https://developer.mozilla.org/en-US/docs/Web/CSS/quotes)
- [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)
- [text-indent](https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent)
- [text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
- [visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility)
- [white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
- [widows](https://developer.mozilla.org/en-US/docs/Web/CSS/widows)
- [word-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/word-spacing)

## How inheritance works

Every HTML element has every CSS property defined by default with an initial value.
An initial value is a property that's not inherited and shows up as a default
if the cascade fails to calculate a value for that element.

<figure class="w-figure">
{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/OvoYqOMcdFZL7wJQIL2C.mp4" %}
</figure>

Properties that can be inherited cascade downwards,
and child elements will get a computed value which represents its parent's value.
This means that if a parent has `font-weight` set to `bold` all child elements will be bold,
unless their `font-weight` is set to a different value,
or the user agent stylesheet has a value for `font-weight` for that element.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'xxgGPOZ'
} %}
</figure>

## How to explicitly inherit and control inheritance

Inheritance can affect elements in unexpected ways so CSS has tools to help with that.

### The `inherit` keyword

You can make any property inherit its parent's computed value with the `inherit` keyword.
A useful way to use this keyword is to create exceptions.

```css
strong {
  font-weight: 900;
}
```

This CSS snippet sets all `<strong>` elements to have a `font-weight` of `900`,
instead of the default `bold` value, which would be the equivalent of `font-weight: 700`.

```css
.my-component {
  font-weight: 500;
}
```

The `.my-component` class sets `font-weight` to `500` instead.
To make the `<strong>` elements inside `.my-component` also `font-weight: 500` add:

```css
.my-component strong {
  font-weight: inherit;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'eYgNedO'
} %}
</figure>

Now, the `<strong>` elements inside `.my-component` will have a `font-weight` of `500`.

You could explicitly set this value,
but if you use `inherit` and the CSS of `.my-component` changes in the future,
you can guarantee that your `<strong>` will automatically stay up to date with it.

### The `initial` keyword

Inheritance can cause problems with your elements and `initial` provides you with a powerful reset option.

You learned earlier that every property has a default value in CSS.
The `initial` keyword sets a property back to that initial, default value.

```css
aside strong {
  font-weight: initial;
}
```

This snippet will remove the bold weight from all `<strong>` elements inside an `<aside>` element and instead,
make them normal weight, which is the initial value.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'OJWVORZ'
} %}
</figure>

### The `unset` keyword

The `unset` property behaves differently if a property is inheritable or not.
If a property is inheritable,
the `unset` keyword will be the same as `inherit`.
If the property is not inheritable, the `unset` keyword is equal to `initial`.

Remembering which CSS properties are inheritable can be hard,
`unset` can be helpful in that context.
For example, `color` is inheritable,
but `margin` isn't, so you can write this:

```css
/* Global color styles for paragraph in authored CSS */
p {
  margin-top: 2em;
  color: goldenrod;
}

/* The p needs to be reset in asides, so you can use unset */
aside p {
  margin: unset;
  color: unset;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEdpjw'
} %}
</figure>

Now, the `margin` is removed and `color` reverts back to being the inherited computed value.

You can use the `unset` value with the `all` property, too.
Going back to the above example,
what happens if the global `p` styles get an additional few properties?
Only the rule that was set for `margin` and `color` will apply.

```css/5-6
/* Global color styles for paragraph in authored CSS */
p {
	margin-top: 2em;
	color: goldenrod;
	padding: 2em;
	border: 1px solid;
}

/* Not all properties are accounted for anymore */
aside p {
	margin: unset;
	color: unset;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgdLNB'
} %}
</figure>

If you change the `aside p` rule to `all: unset` instead,
it doesn't matter what global styles are applied to `p` in the future,
they will always be unset.

```css/2-3
aside p {
	margin: unset;
	color: unset;
	all: unset;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'XWpbZbB'
} %}
</figure>

@@TODO Add self-assessment

## Resources

- [MDN reference on computed values](https://developer.mozilla.org/en-US/docs/Web/CSS/computed_value)
- [An article on how inheritance can be useful in modular front-ends](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/)
