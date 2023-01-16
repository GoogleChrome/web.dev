---
title: 'Async functions: making promises friendly'
subhead: >
  Async functions allow you to write promise-based code as if it were synchronous.
description: >
  Async functions allow you to write promise-based code as if it were synchronous.
date: 2016-10-20
updated: 2021-02-22
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

Async functions are enabled by default in Chrome, Edge, Firefox, and Safari, and
they're quite frankly marvelous. They allow you to write promise-based code as
if it were synchronous, but without blocking the main thread. They make your
asynchronous code less "clever" and more readable.

Async functions work like this:

```js
async function myFirstAsyncFunction() {
  try {
    const fulfilledValue = await promise;
  } catch (rejectedValue) {
    // …
  }
}
```

If you use the `async` keyword before a function definition, you can then use
`await` within the function. When you `await` a promise, the function is paused
in a non-blocking way until the promise settles. If the promise fulfills, you
get the value back. If the promise rejects, the rejected value is thrown.

{% Aside %}
If you're unfamiliar with promises, check out [our
promises guide](/promises).
{% endAside %}

## Browser support

{% BrowserCompat 'javascript.statements.async_function' %}

## Example: logging a fetch

Say you want to fetch a URL and log the response as text. Here's how it looks
using promises:

```js
function logFetch(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
    })
    .catch((err) => {
      console.error('fetch failed', err);
    });
}
```

And here's the same thing using async functions:

```js
async function logFetch(url) {
  try {
    const response = await fetch(url);
    console.log(await response.text());
  } catch (err) {
    console.log('fetch failed', err);
  }
}
```

It's the same number of lines, but all the callbacks are gone. This makes it way
easier to read, especially for those less familiar with promises.

{% Aside %}
Anything you `await` is passed through `Promise.resolve()`, so you can
safely `await` non-platform promises, such as those created by promise polyfills.
{% endAside %}

## Async return values

Async functions _always_ return a promise, whether you use `await` or not. That
promise resolves with whatever the async function returns, or rejects with
whatever the async function throws. So with:

```js
// wait ms milliseconds
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function hello() {
  await wait(500);
  return 'world';
}
```

…calling `hello()` returns a promise that _fulfills_ with `"world"`.

```js
async function foo() {
  await wait(500);
  throw Error('bar');
}
```

…calling `foo()` returns a promise that _rejects_ with `Error('bar')`.

## Example: streaming a response

The benefit of async functions increases in more complex examples. Say you wanted
to stream a response while logging out the chunks, and return the final size.

{% Aside %}
The phrase "logging out the chunks" made me sick in my mouth.
{% endAside %}

Here it is with promises:

```js
function getResponseSize(url) {
  return fetch(url).then((response) => {
    const reader = response.body.getReader();
    let total = 0;

    return reader.read().then(function processResult(result) {
      if (result.done) return total;

      const value = result.value;
      total += value.length;
      console.log('Received chunk', value);

      return reader.read().then(processResult);
    });
  });
}
```

Check me out, Jake "wielder of promises" Archibald. See how I'm calling
`processResult()` inside itself to set up an asynchronous loop? Writing that made
me feel _very smart_. But like most "smart" code, you have to stare at it for
ages to figure out what it's doing, like one of those magic-eye pictures from
the 90's.

Let's try that again with async functions:

```js
async function getResponseSize(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  let result = await reader.read();
  let total = 0;

  while (!result.done) {
    const value = result.value;
    total += value.length;
    console.log('Received chunk', value);
    // get the next result
    result = await reader.read();
  }

  return total;
}
```

All the "smart" is gone. The asynchronous loop that made me feel so smug is
replaced with a trusty, boring, while-loop. Much better. In future, you'll get
[async iterators](https://github.com/tc39/proposal-async-iteration),
which would
[replace the `while` loop with a for-of loop](https://gist.github.com/jakearchibald/0b37865637daf884943cf88c2cba1376), making it even neater.

{% Aside %}
I'm sort-of in love with streams. If you're unfamiliar with streaming,
[check out my guide](https://jakearchibald.com/2016/streams-ftw/#streams-the-fetch-api).
{% endAside %}

## Other async function syntax

I've shown you `async function() {}` already, but the `async` keyword can be
used with other function syntax:

### Arrow functions

```js
// map some URLs to json-promises
const jsonPromises = urls.map(async (url) => {
  const response = await fetch(url);
  return response.json();
});
```

{% Aside %}
The `array.map(func)` doesn't care that I gave it an async function. It just
sees it as a function that returns a promise. It won't wait for the first
function to complete before calling the second.
{% endAside %}

### Object methods

```js
const storage = {
  async getAvatar(name) {
    const cache = await caches.open('avatars');
    return cache.match(`/avatars/${name}.jpg`);
  }
};

storage.getAvatar('jaffathecake').then(…);
```

### Class methods

```js
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jaffathecake').then(…);
```

{% Aside %}
Class constructors and getters/setters cannot be async.
{% endAside %}

## Careful! Avoid going too sequential

Although you're writing code that looks synchronous, ensure you don't miss the
opportunity to do things in parallel.

```js
async function series() {
  await wait(500); // Wait 500ms…
  await wait(500); // …then wait another 500ms.
  return 'done!';
}
```

The above takes 1000ms to complete, whereas:

```js
async function parallel() {
  const wait1 = wait(500); // Start a 500ms timer asynchronously…
  const wait2 = wait(500); // …meaning this timer happens in parallel.
  await Promise.all([wait1, wait2]); // Wait for both timers in parallel.
  return 'done!';
}
```

The above takes 500ms to complete, because both waits happen at the same time.
Let's look at a practical example.

### Example: outputting fetches in order

Say you wanted to fetch a series of URLs and log them as soon as possible, in the
correct order.

_Deep breath_ - here's how that looks with promises:

```js
function markHandled(promise) {
  promise.catch(() => {});
  return promise;
}

function logInOrder(urls) {
  // fetch all the URLs
  const textPromises = urls.map((url) => {
    return markHandled(fetch(url).then((response) => response.text()));
  });

  // log them in order
  return textPromises.reduce((chain, textPromise) => {
    return chain.then(() => textPromise).then((text) => console.log(text));
  }, Promise.resolve());
}
```

Yeah, that's right, I'm using `reduce` to chain a sequence of promises. I'm _so
smart_. But this is a bit of _so smart_ coding you're better off without.

However, when converting the above to an async function, it's tempting to go
_too sequential_:

{% Compare 'worse', 'Not recommended - too sequential' %}

```js
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

{% CompareCaption %}
Looks much neater, but my second fetch doesn't begin until my first fetch has
been fully read, and so on. This is much slower than the promises example that
performs the fetches in parallel. Thankfully there's an ideal middle-ground.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Recommended - nice and parallel' %}

```js
function markHandled(...promises) {
  Promise.allSettled(promises);
}

async function logInOrder(urls) {
  // fetch all the URLs in parallel
  const textPromises = urls.map(async (url) => {
    const response = await fetch(url);
    return response.text();
  });

  markHandled(...textPromises);

  // log them in sequence
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

{% CompareCaption %}
In this example, the URLs are fetched and read in parallel, but the "smart"
`reduce` bit is replaced with a standard, boring, readable for-loop.
{% endCompareCaption %}

{% endCompare %}

{% Aside 'important' %}
`markHandled` is used to avoid "unhandled promise rejections". If a promise
rejects, and it was never given a rejection handler (for example, via
`.catch(handler)`), it's known as an "unhandled rejection". These are logged to
the console, and also trigger [a global
event](https://developer.mozilla.org/docs/Web/API/Window/unhandledrejection_event).

The gotcha when handling a bunch of promises in sequence, is if one of them
rejects, the function ends and the remaining promises are never handled.
`markHandled` is used to prevent this, by attaching rejection handlers to all of
the promises.
{% endAside %}

{% Aside %} The `for` loop in the previous example could make use of another
JavaScript feature, [for
await…of](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for-await...of).

```js
for await (const text of textPromises) {
  console.log(await text);
}
```

This automatically `await`s the next item in the iterable (the `textPromises`
array in this case). It awaits at the start of each turn through the loop, so
the performance is the same as `await`ing within the loop. {% endAside %}

### Browser support workaround: generators

If you're targeting browsers that support generators (which includes
[the latest version of every major browser](http://kangax.github.io/compat-table/es6/#test-generators)
) you can sort-of polyfill async functions.

[Babel](https://babeljs.io/) will do this for you,
[here's an example via the Babel REPL](https://goo.gl/0Cg1Sq)

- note how similar the transpiled code is. This transformation is part of
  [Babel's es2017 preset](http://babeljs.io/docs/plugins/preset-es2017/).

{% Aside %}
Babel REPL is fun to say. Try it.
{% endAside %}

I recommend the transpiling approach, because you can just turn it off once your
target browsers support async functions, but if you _really_ don't want to use a
transpiler, you can take
[Babel's polyfill](https://gist.github.com/jakearchibald/edbc78f73f7df4f7f3182b3c7e522d25)
and use it yourself. Instead of:

```js
async function slowEcho(val) {
  await wait(1000);
  return val;
}
```

…you'd include [the polyfill](https://gist.github.com/jakearchibald/edbc78f73f7df4f7f3182b3c7e522d25)
and write:

```js
const slowEcho = createAsyncFunction(function* (val) {
  yield wait(1000);
  return val;
});
```

Note that you have to pass a generator (`function*`) to `createAsyncFunction`,
and use `yield` instead of `await`. Other than that it works the same.

### Workaround: regenerator

If you're targeting older browsers, Babel can also transpile generators,
allowing you to use async functions all the way down to IE8. To do this you need
[Babel's es2017 preset](http://babeljs.io/docs/plugins/preset-es2017/)
_and_ the [es2015 preset](http://babeljs.io/docs/plugins/preset-es2015/).

The [output is not as pretty](https://goo.gl/jlXboV), so watch out for
code-bloat.

## Async all the things!

Once async functions land across all browsers, use them on every
promise-returning function! Not only do they make your code tidier, but it makes
sure that function will _always_ return a promise.

I got really excited about async functions [back in
2014](https://jakearchibald.com/2014/es7-async-functions/), and
it's great to see them land, for real, in browsers. Whoop!
