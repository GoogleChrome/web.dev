---
title: 'Glitch'
---
Well-designed forms help users and increase conversion rates. One small fix can make a big difference!

{% Aside 'codelab' %}
If you prefer to learn these best practices with a hands-on tutorial, check out the two codelabs
for this post:

* [Payment form best practices codelab](/codelab-payment-form-best-practices)
* [Address form best practices codelab](/codelab-address-form-best-practices)
{% endAside %}

Here is an example of a simple payment form that demonstrates all of the best practices:

{% Glitch {
  id: 'payment-form',
  path: 'index.html',
  height: 720
} %}

Here is an example of a simple address form that demonstrates all of the best practices:

{% Glitch {
  id: 'address-form',
  path: 'index.html',
  height: 980
} %}

For example, the following HTML specifies input for a birth year between
1900 and 2020. Using `type="number"` constrains input values to numbers only, within the range
specified by `min` and `max`. If you attempt to enter a number outside the range, the input will be
set to have an invalid state.

{% Glitch {
  id: 'constraints',
  path: 'index.html',
  height: 170
} %}

The following example uses `pattern="[\d ]{10,30}"` to ensure a valid payment card number, while
allowing spaces:

{% Glitch {
  id: 'payment-card-input',
  path: 'index.html',
  height: 170
} %}

Modern browsers also do basic validation for inputs with type `email` or `url`.

{% Glitch {
  id: 'type-validation',
  path: 'index.html',
  height: 250
} %}

#### CSS Grid Layout {: #grid }

CSS Grid Layout allows for the straightforward creation of flexible grids.
If we consider the earlier floated example,
rather than creating our columns with percentages,
we could use grid layout and the `fr` unit,
which represents a portion of the available space in the container.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

Grid can also be used to create regular grid layouts,
with as many items as will fit.
The number of available tracks will be reduced as the screen size shrinks.
In the below demo, we have as many cards as will fit on each row,
with a minimum size of `200px`.

{% Glitch 'grid-as-many-as-fit' %}

[Read more about CSS Grid Layout](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### Multiple-column layout {: #multicol }

For some types of layout you can use Multiple-column Layout (Multicol),
which can create responsive numbers of columns with the `column-width` property.
In the demo below, you can see that columns are added if there is room for another `200px` column.

{% Glitch {
  id: 'responsive-multicol',
  path: 'style.css'
} %}