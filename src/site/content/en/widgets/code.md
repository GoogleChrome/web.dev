---
title: 'Code'
---
# Code

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
