---
title: '{% CompareCaption %}'
---

<style>
  .webdev-caption {
    opacity: 0.8;
    font-size: 0.8em;
  }
</style>

#### Add a `nonce` attribute to `<script>` elements

With a nonce-based CSP, every `<script>` element must have a `nonce` attribute
which matches the random nonce value specified in the CSP header (all scripts
can have the same nonce). The first step is to add these attributes to all
scripts:

{% Compare 'worse', 'Blocked by CSP'%}

```html
<script src="/path/to/script.js"></script>
<script>foo()</script>
```

{% CompareCaption %}
CSP will block these scripts, because they don't have
`nonce` attributes.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script nonce="${NONCE}" src="/path/to/script.js"></script>
<script nonce="${NONCE}">foo()</script>
```

{% CompareCaption %}
CSP will allow the execution of these scripts if `${NONCE}`
is replaced with a value matching the nonce in the CSP response header. Note
that some browsers will hide the `nonce` attribute when inspecting the page
source.
{% endCompareCaption %}

{% endCompare %}



### Border shorthands
Border, plus its nested `color`, `style`, and `width` properties have all got
new logical shorthands as well.

{% Glitch 'border-logical-shorthand' %}

<br>

<div class="switcher">
{% Compare 'better', 'Physical longhand' %}
```css
border-top-color: hotpink;
border-bottom-color: hotpink;
```
{% endCompare %}

{% Compare 'better', 'Logical shorthand' %}
```css
border-block-color: hotpink;
/* or */
border-block-color: hotpink hotpink;
```
{% endCompare %}
</div>

<br>

<div class="switcher">
{% Compare 'better', 'Physical longhand' %}
```css
border-left-style: dashed;
border-right-style: dashed;
```
{% endCompare %}

{% Compare 'better', 'Logical shorthand' %}
```css
border-inline-style: dashed;
/* or */
border-inline-style: dashed dashed;
```
{% endCompare %}
</div>

<br>

<div class="switcher">
{% Compare 'better', 'Physical longhand' %}
```css
border-left-width: 1px;
border-right-width: 1px;
```
{% endCompare %}

{% Compare 'better', 'Logical shorthand' %}
```css
border-inline-width: 1px;
/* or */
border-inline-width: 1px 1px;
```
{% endCompare %}
</div>

Further reading and a [full list of border shorthand and longhand](https://developer.mozilla.org/docs/Web/CSS/border-block)
is available on MDN.