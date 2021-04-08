---
title: 'JavaScript: What is the meaning of this?'
subhead: "Figuring out the value of `this` can be tricky in JavaScript, here's how to do it…"
description: "Figuring out the value of `this` can be tricky in JavaScript, here's how to do it…"
authors:
  - jakearchibald
date: 2021-03-08
# updated: 2021-02-19
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: this 🤔
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - javascript
---

JavaScript's `this` is the butt of many jokes, and that's because, well, it's pretty complicated.
However, I've seen developers do much-more-complicated and domain-specific things to avoid dealing
with this `this`. If you're unsure about `this`, hopefully this will help. This is my `this` guide.

I'm going to start with the most specific situation, and end with the least-specific. This article
is kinda like a big `if (…) … else if () … else if (…) …`, so you can go straight to the first
section that matches the code you're looking at.

1. [If the function is defined as an arrow function](#arrow-functions)
1. [Otherwise, if the function/class is called with `new`](#new)
1. [Otherwise, if the function has a 'bound' `this` value](#bound)
1. [Otherwise, if `this` is set at call-time](#call-apply)
1. [Otherwise, if the function is called via a parent object (`parent.func()`)](#object-member)
1. [Otherwise, if the function or parent scope is in strict mode](#strict)
1. [Otherwise](#otherwise)

## If the function is defined as an arrow function: {: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

In this case, the value of `this` is _always_ the same as `this` in the parent scope:

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

Arrow functions are great because the inner value of `this` can't be changed, it's _always_ the same
as the outer `this`.

### Other examples

With arrow functions, the value of `this` _can't_ be changed with [`bind`](#bound):

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

With arrow functions, the value of `this` _can't_ be changed with [`call` or `apply`](#call-apply):

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

With arrow functions, the value of `this` _can't_ be changed by calling the function as a member of
another object:

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

With arrow functions, the value of `this` _can't_ be changed by calling the function as a
constructor:

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### 'Bound' instance methods

With instance methods, if you want to ensure `this` always refers to the class instance, the best
way is to use arrow functions and [class
fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields):

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

This pattern is really useful when using instance methods as event listeners in components (such as
React components, or web components).

The above might feel like it's breaking the "`this` will be the same as `this` in the parent scope"
rule, but it starts to make sense if you think of class fields as syntactic sugar for setting things
in the constructor:

```js
class Whatever {
  someMethod = (() => {
    const outerThis = this;
    return () => {
      // Always logs `true`:
      console.log(this === outerThis);
    };
  })();
}

// …is roughly equivalent to:

class Whatever {
  constructor() {
    const outerThis = this;
    this.someMethod = () => {
      // Always logs `true`:
      console.log(this === outerThis);
    };
  }
}
```

Alternative pattens involve binding an existing function in the constructor, or assigning the
function in the constructor. If you can't use class fields for some reason, assigning functions in
the constructor is a reasonable alternative:

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## Otherwise, if the function/class is called with `new`: {: #new }

```js
new Whatever();
```

The above will call `Whatever` (or its constructor function if it's a class) with `this` set to the
result of `Object.create(Whatever.prototype)`.

```js
class MyClass {
  constructor() {
    console.log(
      this.constructor === Object.create(MyClass.prototype).constructor,
    );
  }
}

// Logs `true`:
new MyClass();
```

The same is true for older-style constructors:

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### Other examples

When called with `new`, the value of `this` _can't_ be changed with [`bind`](#bound):

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

When called with `new`, the value of `this` _can't_ be changed by calling the function as a member
of another object:

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## Otherwise, if the function has a 'bound' `this` value: {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

Whenever `boundFunction` is called, its `this` value will be the object passed to `bind`
(`boundObject`).

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %}
Avoid using `bind` to bind a function to its outer `this`. Instead, use [arrow
functions](#arrow-functions), as they make `this` clear from the function declaration, rather than
something that happens later in the code.

Don't use `bind` to set `this` to some value unrelated to the parent object; it's usually unexpected
and it's why `this` gets such a bad reputation. Consider passing the value as an argument instead;
it's more explicit, and works with arrow functions. {% endAside %}

### Other examples

When calling a bound function, the value of `this` _can't_ be changed with [`call` or
`apply`](#call-apply):

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

When calling a bound function, the value of `this` _can't_ be changed by calling the function as a
member of another object:

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## Otherwise, if `this` is set at call-time: {: #call-apply }

```js
function someFunction() {
  return this;
}

const someObject = {hello: 'world'};

// Logs `true`:
console.log(someFunction.call(someObject) === someObject);
// Logs `true`:
console.log(someFunction.apply(someObject) === someObject);
```

The value of `this` is the object passed to `call`/`apply`.

{% Aside 'warning' %} Don't use `call`/`apply` to set `this` to some value unrelated to the parent
object; it's usually unexpected and it's why `this` gets such a bad reputation. Consider passing the
value as an argument instead; it's more explicit, and works with arrow functions. {% endAside %}

Unfortunately `this` is set to some other value by things like DOM event listeners, and using it can
result in difficult-to-understand code:

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

I avoid using `this` in cases like above, and instead:

{% Compare 'better' %}

```js
element.addEventListener('click', (event) => {
  // Ideally, grab it from a parent scope:
  console.log(element);
  // But if you can't do that, get it from the event object:
  console.log(event.currentTarget);
});
```

{% endCompare %}

## Otherwise, if the function is called via a parent object (`parent.func()`): {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

In this case the function is called as a member of `obj`, so `this` will be `obj`. This happens at
call-time, so the link is broken if the function is called without its parent object, or with a
different parent object:

```js
const {someMethod} = obj;
// Logs `false`:
console.log(someMethod() === obj);

const anotherObj = {someMethod};
// Logs `false`:
console.log(anotherObj.someMethod() === obj);
// Logs `true`:
console.log(anotherObj.someMethod() === anotherObj);
```

`someMethod() === obj` is false because `someMethod` _isn't_ called as a member of `obj`. You might
have encountered this gotcha when trying something like this:

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

This breaks because the implementation of `querySelector` looks at its own `this` value and expects
it to be a DOM node of sorts, and the above breaks that connection. To achieve the above correctly:

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

Fun fact: Not all APIs use `this` internally. Console methods like `console.log` were changed to
avoid `this` references, so `log` doesn't need to be bound to `console`.

{% Aside 'warning' %} Don't transplant a function onto an object just to set `this` to some value
unrelated to the parent object; it's usually unexpected and it's why `this` gets such a bad
reputation. Consider passing the value as an argument instead; it's more explicit, and works with
arrow functions.
{% endAside %}

## Otherwise, if the function or parent scope is in strict mode: {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

In this case, the value of `this` is undefined. `'use strict'` isn't needed in the function if the
parent scope is in [strict
mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (and all
modules are in strict mode).

{% Aside 'warning' %}
Don't rely on this. I mean, there are easier ways to get an `undefined` value 😀.
{% endAside %}

## Otherwise: {: #otherwise }

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

In this case, the value of `this` is the same as `globalThis`.

{% Aside %} Most folks (including me) call `globalThis` the global object, but this isn't 100%
technically correct. Here's [Mathias Bynens with the
details](https://mathiasbynens.be/notes/globalthis#terminology), including why it's called
`globalThis` rather than simply `global`. {% endAside %}

{% Aside 'warning' %} Avoid using `this` to reference the global object (yes, I'm still calling it
that). Instead, use
[`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis),
which is much more explicit. {% endAside %}

## Phew!

And that's it! That's everything I know about `this`. Any questions? Something I've missed? Feel
free to [tweet at me](https://twitter.com/jaffathecake).

Thanks to [Mathias Bynens](https://twitter.com/mathias), [Ingvar
Stepanyan](https://twitter.com/RReverser), and [Thomas Steiner](https://twitter.com/tomayac) for
reviewing.
