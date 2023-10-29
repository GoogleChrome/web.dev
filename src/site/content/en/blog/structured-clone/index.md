---
layout: post
title: Deep-copying in JavaScript using structuredClone
authors:
  - surma
hero: image/i9nJGvw3SnTPH63zKOYWtI6cP5m2/e1QXRf64ylK8blZ45H1X.jpeg
alt: Clones. Lots of clones.
subhead: The Platform now ships with structuredClone(), a built-in function for deep-copying.
description: >
  For the longest time, you had to resort to workarounds and libraries to create a deep copy of a JavaScript value. The Platform now ships with `structuredClone()`, a built-in function for deep-copying.
date: 2021-12-16
updated: 2022-07-25
is_baseline: true
tags:
  - performance
  - blog
---

For the longest time, you had to resort to workarounds and libraries to create a deep copy of a JavaScript value. The Platform now ships with `structuredClone()`, a built-in function for deep-copying.

{% BrowserCompat 'api.structuredClone' %}

## Shallow copies

Copying a value in JavaScript is almost always _shallow_, as opposed to _deep_.  That means that changes to deeply nested values will be visible in the copy as well as the original. 

One way to create a shallow copy in JavaScript using the [object spread operator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...`:

```js
const myOriginal = {
  someProp: "with a string value",
  anotherProp: {
    withAnotherProp: 1,
    andAnotherProp: true
  }
};

const myShallowCopy = {...myOriginal};
```

Adding or changing a property directly on the shallow copy will only affect the copy, not the original:

```js
myShallowCopy.aNewProp = "a new value";
console.log(myOriginal.aNewProp)
// ^ logs `undefined`
```

However, adding or changing a deeply nested property affects _both_ the copy and the original:

```js
myShallowCopy.anotherProp.aNewProp = "a new value";
console.log(myOriginal.anotherProp.aNewProp) 
// ^ logs `a new value`
```

The expression `{...myOriginal}` iterates over the (enumerable) properties of `myOriginal` using the [Spread Operator]. It uses the property name and value, and assigns them one by one to a freshly created, empty object. As such, the resulting object is identical in shape, but with its own copy of the list of properties and values. The values are copied, too, but so-called primitive values are handled differently by the JavaScript value than non-primitive values. To quote [MDN][MDN Primitive]:

{% Blockquote 'MDN — Primitive' %}
In JavaScript, a primitive (primitive value, primitive data type) is data that is not an object and has no methods. There are seven primitive data types: string, number, bigint, boolean, undefined, symbol, and null.
{% endBlockquote %}

Non-primitive values are handled as _references_, meaning that the act of copying the value is really just copying a reference to the same underlying object, resulting in the shallow copy behavior.

## Deep copies

The opposite of a shallow copy is a deep copy. A deep copy algorithm also copies an object’s properties one by one, but invokes itself recursively when it finds a reference to another object, creating a copy of that object as well. This can be very important to make sure that two pieces of code don’t accidentally share an object and unknowingly manipulate each others’ state. 

There used to be no easy or nice way to create a deep-copy of a value in JavaScript. Many people relied on third-party libraries like [Lodash’s `cloneDeep()`][lodash clonedeep]  function. Arguably the most common solution to this problem was a JSON-based hack:

```js
const myDeepCopy = JSON.parse(JSON.stringify(myOriginal));
``` 

In fact, this was such a popular workaround, that [V8 aggressively optimized][V8 JSON] `JSON.parse()` and specifically the pattern above to make it as fast as possible. And while it is fast, it comes with a couple of shortcomings and tripwires:

- **Recursive data structures**: `JSON.stringify()` will throw when you give it a recursive data structure. This can happen quite easily when working with linked lists or trees.
- **Built-in types**: `JSON.stringify()` will throw if the value contains other JS built-ins like `Map`, `Set`, `Date`, `RegExp` or `ArrayBuffer`.
- **Functions**: `JSON.stringify()` will quietly discard functions.

## Structured cloning

The platform already needed the ability to create deep copies of JavaScript values in a couple of places: Storing a JS value in IndexedDB requires some form of serialization so it can be stored on disk and later deserialized to restore the JS value. Similarly, sending messages to a WebWorker via `postMessage()` requires transferring a JS value from one JS realm to another. The algorithm that is used for this is called “Structured Clone”, and until recently, wasn’t easily accessible to developers.

That has now changed! The HTML spec was amended to expose a function called `structuredClone()` that runs exactly that algorithm as a means for developers to easily create deep copies of JavaScript values.

```js
const myDeepCopy = structuredClone(myOriginal);
```

That’s it! That’s the entire API. If you want to dive deeper into the details, take a look at the [MDN article][mdn structuredclone].

### Features and limitations

Structured cloning addresses many (although not all) shortcomings of the `JSON.stringify()` technique. Structured cloning can handle cyclical data structures, support many built-in data types and is generally more robust and often faster.

However, it still has some limitations that may catch you off-guard:
 
- **Prototypes**: If you use `structuredClone()` with a class instance, you’ll get a plain object as the return
value, as structured cloning discards the object’s prototype chain. 
- **Functions**: If your object contains functions, `structuredClone()` will throw a `DataCloneError` exception.
- **Non-cloneables**: Some values are not structured cloneable, most notably `Error` and DOM nodes. It
will cause `structuredClone()` to throw.
 
If any of these limitations are a deal-breaker for your use-case, libraries like Lodash still provide custom implementations of other deep-cloning algorithms that may or may not fit your use-case.

### Performance

While I haven’t done a new micro-benchmark comparison, [I did a comparison in early 2018][surma blog], before `structuredClone()` was exposed. Back then, `JSON.parse()` was the fastest option for very small objects. I expect that to remain the same. Techniques that relied on structured cloning were (significantly) faster for bigger objects. Considering that the new `structuredClone()` comes without the overhead of abusing other APIs and is more robust  than `JSON.parse()`, I recommend you make it your default approach for creating deep copies.
 
## Conclusion

If you need to create a deep-copy of a value in JS—maybe that be because you use immutable data structures or you want to make sure a function can manipulate an object without affecting the original—you no longer need to reach for workarounds or libraries. The JS ecosystem now has [`structuredClone()`][mdn structuredclone]. Huzzah.
 
[Spread Operator]:
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[MDN Primitive]: https://developer.mozilla.org/docs/Glossary/Primitive
[V8 JSON]: https://v8.dev/blog/cost-of-javascript-2019#json
[pushState]: https://developer.mozilla.org/docs/Web/API/History/pushState
[surma blog]: https://surma.dev/things/deep-copy/index.html
[lodash clonedeep]: https://lodash.com/docs/#cloneDeep
[mdn structuredclone]: https://developer.mozilla.org/docs/Web/API/structuredClone
