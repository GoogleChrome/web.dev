---
title: Embedding JavaScript snippets in C++ with Emscripten
subhead: Learn how to embed JavaScript code in your WebAssembly library to communicate with the outside world.
description: Learn how to embed JavaScript code in your WebAssembly library to communicate with the outside world.
date: 2022-01-18
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/InR77BkPIakxD8X1rADr.jpg
alt: A man putting sticky notes on a whiteboard.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - javascript
---

When working on WebAssembly integration with the web, you need a way to call out to external APIs such as web APIs and third-party libraries. You then need a way to store the values and object instances those APIs return, and a way to pass those stored values to other APIs later. For asynchronous APIs, you might also need to await promises in your synchronous C/C++ code with [Asyncify](/asyncify/) and read the result once the operation is finished.

Emscripten provides several tools for such interactions:

* `emscripten::val` for storing and operating on JavaScript values in C++.
* `EM_JS` for embedding JavaScript snippets and binding them as C/C++ functions.
* `EM_ASYNC_JS` that's similar to `EM_JS`, but makes it easier to embed asynchronous JavaScript snippets.
* `EM_ASM` for embedding short snippets and executing them inline, without declaring a function.
* `--js-library` for advanced scenarios where you want to declare lots of JavaScript functions together as a single library.

In this post you’ll learn how to use all of them for similar tasks.

## emscripten::val class

The `emcripten::val` class is provided by Embind. It can invoke global APIs, bind JavaScript values to C++ instances, and convert values between C++ and JavaScript types.

Here's how to use it with Asyncify's [`.await()`](https://emscripten.org/docs/api_reference/val.h.html#_CPPv4NK10emscripten10emscripten3val5awaitEv) to fetch and parse some JSON:

```cpp
#include <emscripten/val.h>

using namespace emscripten;

val fetch_json(const char *url) {
  // Get and cache a binding to the global `fetch` API in each thread.
  thread_local const val fetch = val::global("fetch");
  // Invoke fetch and await the returned `Promise<Response>`.
  val response = fetch(url).await();
  // Ask to read the response body as JSON and await the returned `Promise<any>`.
  val json = response.call<val>("json").await();
  // Return the JSON object.
  return json;
}

// Example URL.
val example_json = fetch_json("https://httpbin.org/json");

// Now we can extract fields, e.g.
std::string author = json["slideshow"]["author"].as<std::string>();
```

This code works well, but it performs lots of intermediate steps. Each operation on `val` needs to perform the following steps:

1. Convert C++ values passed as arguments into some intermediate format.
2. Go to JavaScript, read and convert arguments into JavaScript values.
3. Execute the function
4. Convert the result from JavaScript to intermediate format.
5. Return the converted result to C++, and C++ finally reads it back.

Each `await()` also has to pause the C++ side by unwinding the entire call stack of the WebAssembly module, returning to JavaScript, waiting, and restoring the WebAssembly stack when the operation is complete.

Such code doesn't need anything from C++. C++ code is acting only as a driver for a series of JavaScript operations. What if you could move `fetch_json` to JavaScript and reduce the overhead of intermediate steps at the same time?

## EM_JS macro

The [`EM_JS macro`](https://emscripten.org/docs/api_reference/emscripten.h.html#c.EM_JS) lets you move `fetch_json` to JavaScript. `EM_JS` in Emscripten lets you declare a C/C++ function that is implemented by a JavaScript snippet.

Like WebAssembly itself, it has a limitation of supporting only numeric arguments and return values. In order to pass any other values, you need to convert them manually via corresponding APIs. Here are some examples.

Passing numbers doesn't need any conversion:

```cpp
// Passing numbers, doesn't need any conversion.
EM_JS(int, add_one, (int x), {
  return x + 1;
});

int x = add_one(41);
```

When passing strings to and from JavaScript you need to use the corresponding conversion and allocation functions from [preamble.js](https://emscripten.org/docs/api_reference/preamble.js.html):

```cpp
EM_JS(void, log_string, (const char *msg), {
  console.log(UTF8ToString(msg));
});

EM_JS(const char *, get_input, (), {
  let str = document.getElementById('myinput').value;
  // Returns heap-allocated string.
  // C/C++ code is responsible for calling `free` once unused.
  return allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL);
});
```

Finally, for more complex, arbitrary, value types, you can use the JavaScript API for the earlier mentioned `val` class. Using it, you can convert JavaScript values and C++ classes into intermediate handles and back:

```cpp
EM_JS(void, log_value, (EM_VAL val_handle), {
  let value = Emval.toValue(val_handle);
  console.log(value);
});

EM_JS(EM_VAL, find_myinput, (), {
  let input = document.getElementById('myinput');
  return Emval.toHandle(input);
});

val obj = val::object();
obj.set("x", 1);
obj.set("y", 2);
log_value(obj.as_handle()); // logs { x: 1, y: 2 }

val myinput = val::take_ownership(find_input());
// Now you can store the `find_myinput` DOM element for as long as you like, and access it later like:
std::string value = input["value"].as<std::string>();
```

With those APIs in mind, the `fetch_json` example could be rewritten to do most work without leaving JavaScript:

```cpp
EM_JS(EM_VAL, fetch_json, (const char *url), {
  return Asyncify.handleAsync(async () => {
    url = UTF8ToString(url);
    // Invoke fetch and await the returned `Promise<Response>`.
    let response = await fetch(url);
    // Ask to read the response body as JSON and await the returned `Promise<any>`.
    let json = await response.json();
    // Convert JSON into a handle and return it.
    return Emval.toHandle(json);
  });
});

// Example URL.
val example_json = val::take_ownership(fetch_json("https://httpbin.org/json"));

// Now we can extract fields, e.g.
std::string author = json["slideshow"]["author"].as<std::string>();
```

We still have a couple of explicit conversions at the entry and exit points of the function, but the rest is now regular JavaScript code. Unlike `val` equivalent, it can now be optimized by the JavaScript engine and only requires pausing the C++ side once for all async operations.

## EM_ASYNC_JS macro

The only bit left that does not look pretty is the `Asyncify.handleAsync` wrapper—its only purpose is to allow executing `async` JavaScript functions with Asyncify. In fact, this use case is so common that there is now a specialized `EM_ASYNC_JS` macro that combines them together.

Here's how you could use it to produce the final version of the `fetch` example:

```cpp
EM_ASYNC_JS(EM_VAL, fetch_json, (const char *url), {
  url = UTF8ToString(url);
  // Invoke fetch and await the returned `Promise<Response>`.
  let response = await fetch(url);
  // Ask to read the response body as JSON and await the returned `Promise<any>`.
  let json = await response.json();
  // Convert JSON into a handle and return it.
  return Emval.toHandle(json);
});

// Example URL.
val example_json = val::take_ownership(fetch_json("https://httpbin.org/json"));

// Now we can extract fields, e.g.
std::string author = json["slideshow"]["author"].as<std::string>();
```

## EM_ASM

`EM_JS` is the recommended way to declare JavaScript snippets. It's efficient because it binds the declared snippets directly like any other JavaScript function imports. It also provides good ergonomics by enabling you to explicitly declare all parameter types and names.

In some cases, however, you want to insert a quick snippet for [`console.log`](https://developer.mozilla.org/docs/Web/API/Console/log) call, a [`debugger;`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) statement or something similar and don't want to bother with declaring a whole separate function. In those rare cases, an [`EM_ASM macros family`](https://emscripten.org/docs/api_reference/emscripten.h.html#c.EM_ASM) (`EM_ASM`, `EM_ASM_INT` and `EM_ASM_DOUBLE`) might be a simpler choice. Those macros are similar to the `EM_JS` macro, but they execute code inline where they're inserted, instead of defining a function.

Since they don't declare a function prototype, they need a different way of specifying the return type and accessing arguments.

You need to use the right macro name to choose the return type. `EM_ASM` blocks are expected to act like `void` functions, `EM_ASM_INT` blocks can return an integer value, and `EM_ASM_DOUBLE` blocks return floating-point numbers correspondingly.

Any passed arguments will be available under names `$0`, `$1`, and so on in the JavaScript body. As with `EM_JS` or WebAssembly in general, the arguments are limited only to numeric values—integers, floating-point numbers, pointers and handles.

Here's an example of how you could use an `EM_ASM` macro to log an arbitrary JS value to the console:

```cpp
val obj = val::object();
obj.set("x", 1);
obj.set("y", 2);
// executes inline immediately
EM_ASM({
  // convert handle passed under $0 into a JavaScript value
  let obj = Emval.fromHandle($0);
  console.log(obj); // logs { x: 1, y: 2 }
}, obj.as_handle());
```

## --js-library

Finally, Emscripten supports declaring JavaScript code in a separate file in a customits own [library format](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#implement-a-c-api-in-javascript):

```js
mergeInto(LibraryManager.library, {
  log_value: function (val_handle) {
    let value = Emval.toValue(val_handle);
    console.log(value);
  }
});
```

Then you need to declare corresponding prototypes manually on the C++ side:

```cpp
extern "C" void log_value(EM_VAL val_handle);
```

Once declared on both sides, the JavaScript library can be linked together with the main code via the [`--js-library option`](https://emscripten.org/docs/tools_reference/emcc.html#emcc-js-library), connecting prototypes with corresponding JavaScript implementations.

However, this module format is non-standard and requires careful dependency annotations. As such, it's mostly reserved for advanced scenarios.

## Conclusion

In this post we've looked at various ways to integrate JavaScript code into C++ when working with WebAssembly.

Including such snippets allows you to express long sequences of operations in a cleaner and more efficient way, and to tap into third-party libraries, new JavaScript APIs, and even JavaScript syntax features that are not yet expressible via C++ or Embind.
