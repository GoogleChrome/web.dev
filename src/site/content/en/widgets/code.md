---
title: 'Code'
---
Examples for various displays of code.

## Various syntaxes in fenced code blocks

### HTML (with CSS and JS)

```html
<!-- This should highlight as HTML -->
<head>
    <title>Example</title>
    <style>
        /* This should highlight as CSS */
        .test {
          color: red;
        }
    </style>
</head>
<body>
    <p class="test">This is an example of a simple HTML page with one paragraph.</p>
</body>
<script>
  /* This should highlight as JavaScript */
  const helloWorld = 'Hello World';

  function sayHelloWorld() {
    console.log(helloWorld);
    if (false) {
      // Unreachable code.
    }
    return;
  }

  sayHelloWorld();
</script>
```

### CSS

```css
/* This should highlight as CSS */
.test {
  color: red;
}

#test {
  color: green;
}
```

### JavaScript

```js
/* This should highlight as JavaScript */
const helloWorld = 'Hello World';

function sayHelloWorld() {
  console.log(helloWorld);
  if (false) {
    // Unreachable code.
  }
  return;
}

sayHelloWorld();
```

## Inline code

This is a paragraph with inline code, like `<html lang="en">` and `console.log('Hello World');`. A longer snippet
like `document.onload = function() { console.log('Document load!); }`.

## Code blocks nested in HTML

### HTML (with CSS and JS) in a `<div>`

<div>

```html
<!-- This should highlight as HTML -->
<head>
    <title>Example</title>
    <style>
        /* This should highlight as CSS */
        .test {
          color: red;
        }
    </style>
</head>
<body>
    <p class="test">This is an example of a simple HTML page with one paragraph.</p>
</body>
<script>
  /* This should highlight as JavaScript */
  const helloWorld = 'Hello World';

  function sayHelloWorld() {
    console.log(helloWorld);
    if (false) {
      // Unreachable code.
    }
    return;
  }

  sayHelloWorld();
</script>
```

</div>

### CSS in a `<div>`

<div>

```css
/* This should highlight as CSS */
.test {
  color: red;
}

#test {
  color: green;
}
```

</div>

### JavaScript in a `<div>`

<div>

```js
/* This should highlight as JavaScript */
const helloWorld = 'Hello World';

function sayHelloWorld() {
  console.log(helloWorld);
  if (false) {
    // Unreachable code.
  }
  return;
}

sayHelloWorld();
```

</div>

# A code snippet inside a switcher div, with a compare shortcode

<div class="switcher">
{% Compare 'better', 'Smallest viewport side units' %}
```css
.new-min-viewport-units {
  --size: 100vmin;
  --size: 100dvmin;
  --size: 100svmin;
  --size: 100lvmin;
}
```
{% endCompare %}

{% Compare 'better', 'Largest viewport side units' %}
```css
.new-max-viewport-units {
  --size: 100vmax;
  --size: 100dvmax;
  --size: 100svmax;
  --size: 100lvmax;
}
```
{% endCompare %}
</div>

# Line highlighting

```css/2-6
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);

@font-palette-values --colorized {
  font-family: "Bungee Spice";
  base-palette: 0;
  override-colors: 0 hotpink, 1 cyan, 2 white;
}
```

With `--colorized` as an alias for the customizations, the last step is to apply
the palette to an element that is using the color font family:

```css/8-11
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);

@font-palette-values --colorized {
  font-family: "Bungee Spice";
  base-palette: 0;
  override-colors: 0 hotpink, 1 cyan, 2 white;
}

.spicy {
  font-family: "Bungee Spice";
  font-palette: --colorized;
}
```