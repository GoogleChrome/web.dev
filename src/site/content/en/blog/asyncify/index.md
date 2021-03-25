---
title: Using asynchronous Web APIs from WebAssembly
description: Learn how to invoke asynchronous Web APIs when compiling traditionally synchronous languages to WebAssembly.
date: # TODO
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/3XqfQyjjfxEw8T3azz0W.jpg
alt: A crosswalk signal asking to wait.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - file-system
---

The I/O APIs on the Web are asynchronous, but they're synchronous in most system languages. When
compiling code to WebAssembly, you need to bridge one kind of APIs to another - and this bridge is
Asyncify.

---

## I/O in system languages

Let's start by taking a look at a simple example in C. Let's say, you want to read user's name from
a file, and greet them with a "Hello, (username)!" message:

```cpp
#include <stdio.h>

int main() {
    char name[20+1];
    FILE * stream;
    stream = fopen("name.txt", "r");
    size_t len = fread(&name, 1, 20, stream);
    name[len] = '\0';
    fclose(stream);
    printf("Hello, %s!\n", name);
    return 0;
}
```

While it doesn't do much, it already demonstrates something you'll find in an application of any
size: it reads some inputs from the external world, processes them internally and writes outputs
back to the external world. All such interaction with the outside world happens via a few functions
- commonly called input-output functions, also shortened to I/O.

In order to read the name from C, you need at least two crucial I/O calls: `fopen`, to open the
file, and `fread` to read the data from it. Once you retrieve the data, you can use another I/O
function `printf` to print the result to the console.

Those functions look quite simple at first glance and you don't have to think twice about all the
machinery involved in order to read or write data. However, depending on the environment, there can
be quite a lot going on inside:

  - If the input file is located on a local drive, the application needs to perform a series of
    memory and disk accesses to locate the file, check permissions, open it for reading, and then
    read block by block until the requested number of bytes is retrieved. This can be pretty slow,
    depending on the speed of your disk and the requested size.
  - Or, the input file might be located on a mounted network location—in which case the network
    stack will now be involved too, increasing the complexity, latency and number of potential
    retries for each operation.
  - Finally, even printf is not guaranteed to print things to the console and might be redirected to
    a file or a network location, in which case it would have to go via the same steps above.

Long story short, I/O can be slow and you can't predict how long a particular call will take by a
quick glance at the code. While that operation is running, your whole application will appear frozen
and unresponsive to the user.

This is not limited to C or C++ either. Most system languages present all the I/O in a form of
synchronous APIs. For example, if you translate the example to Rust, the API might look simpler, but
the same principles apply. You just make a call and synchronously wait for it to return the result,
while it performs all the expensive operations and eventually returns the result back to you in a
single invocation:

```rust
fn main() {
    let s = std::fs::read_to_string("name.txt");
    println!("Hello, {}!", s);
}
```

But what happens when you try to compile any of those samples to WebAssembly and translate them to
the Web? Or, to provide a specific example, what could "file read" operation translate to? It would
need to read data from some storage.

## Asynchronous model of the Web

The Web has a variety of different storage options you could map to, such as in-memory storage (JS
objects), localStorage, IndexedDB, server-side storage, and a new [File System Access
API](https://web.dev/file-system-access/).

However, only two of those APIs—the in-memory storage and the localStorage—can be used
synchronously, and both are the most limiting options in what you can store and for how long. All
the other options provide only asynchronous APIs.

This is one of the core properties of executing code on the Web: any time-consuming operation, which
includes any I/O, has to be asynchronous.

The reason is that the Web is historically single-threaded, and any user code that touches the UI,
has to run on the same thread as the UI. It has to compete with the other important tasks like
layout, rendering and event handling for the CPU time. You wouldn't want a piece of JavaScript or
WebAssembly to be able to start a "file read" operation and block everything else—the entire tab,
or, in the past, the entire browser—for a range from milliseconds to a few seconds, until it's over.

Instead, code is only allowed to schedule an I/O operation together with a callback to be executed
once it's finished. Such callbacks are then executed as part of the browser's event loop. I won't be
going into details here, but if you're interested in learning how event loop works under the hood,
check out Jake Archibald's
[article](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) which explains this
topic in-depth.

The short version is that the browser runs all the pieces of code in sort of an infinite loop, by
taking them from the queue one by one. When some event is triggered, the browser queues the
corresponding handler, and on the next loop iteration it's taken out from the queue and executed.
This mechanism allows to simulate concurrency and run lots of parallel operations while still using
a single thread.

The important thing to remember about this mechanism is that, while your custom JavaScript (or
WebAssembly) code executes, the event loop is blocked and, while it is, there is no way to react to
any external handlers, events, I/O etc. The only way to get the I/O results back is to register a
callback, finish executing your code, and give the control back to the browser so that it could keep
processing any pending tasks. Once I/O is finished, your handler will become one of those tasks and
will get executed.

For example, if you wanted to rewrite the samples above in modern JavaScript and decided to read a
name from a remote URL, you would use Fetch API and async-await syntax:

```js
async function main() {
  let response = await fetch("name.txt");
  let name = await response.text();
  console.log("Hello, %s!", name);
}
```

However, even though it looks synchronous, under the hood each `await` is essentially a syntax sugar
for callbacks:

```js
function main() {
  return fetch("name.txt")
    .then(response => response.text())
    .then(name => console.log("Hello, %s!", name));
}
```

From the desugared example, it's a bit clearer that it starts a request and subscribes to the
response with the first callback. Once the browser receives the initial response—just the HTTP
headers—it asynchronously invokes this callback. The callback stars reading the body as text using
`response.text()`, and subscribes to the result with another callback. Finally, once `fetch` has
retrieved all the contents, it invokes the last callback, which prints "Hello, (username)!" to the
console.

Thanks to the asynchronous nature of those steps, the original function can return control to the
browser as soon as the I/O has been scheduled, and leave the entire UI responsive and available for
other tasks, including rendering, scrolling and so on while the I/O is executing in background.

As another final example, even simple APIs like "sleep" that allow to wait a specified number of
seconds, are also a form of an I/O:

```cpp
#include <stdio.h>
#include <unistd.h>
// ...
printf("A\n");
sleep(1);
printf("B\n");
```

Sure, you could translate it in a very straightforward manner that would block the current thread
until the time expires…

```js
console.log("A");
for (let start = Date.now(); Date.now() - start < 1000;);
console.log("B");
```

…and, in fact, that's exactly what Emscripten does in [its default implementation of
"sleep",](https://github.com/emscripten-core/emscripten/blob/16d5755a3f71f27d0c67b8d7752f94844e56ef7c/src/library_pthread_stub.js#L47-L52)
but that's very inefficient, will block the entire UI, won't allow any other events to get handled
meanwhile, and, generally, don't do that in production code :)

Instead, a more idiomatic version of such "sleep" in JavaScript would involve calling
`setTimeout()`, and subscribing with a handler:

```js
console.log("A");
setTimeout(() => {
    console.log("B");
}, 1000);
```

What's common for all those different examples and APIs? In each case, the idiomatic code in the
original systems language uses a blocking API for the I/O, whereas an equivalent example for the Web
uses an asynchronous API instead. When compiling to the Web, you need to somehow transform between
those two execution models, and WebAssembly has no built-in capability to do so just yet.

## Bridging the gap with Asyncify

This is where [Asyncify](https://emscripten.org/docs/porting/asyncify.html) comes in. Asyncify is a
compile-time feature supported by Emscripten, that allows pausing the entire program and
asynchronously resuming it later.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/VSMrdTiQ7PubW6vfE6WZ.svg", alt="ALT_TEXT_HERE",
width="300", height="75" %}

### Usage in C / C++ with Emscripten

If you wanted to use it to implement an asynchronous sleep for the last example, you could do it
like this:

```cpp
#include <stdio.h>
#include <emscripten.h>

EM_JS(void, async_sleep, (int seconds), {
    Asyncify.handleSleep(wakeUp => {
        setTimeout(wakeUp, seconds * 1000);
    });
});
…
puts("A");
async_sleep(1);
puts("B");
```

Here, [`EM_JS`](https://emscripten.org/docs/api_reference/emscripten.h.html?highlight=em_js#c.EM_JS)
is a macro that allows defining JavaScript snippets as if they were C functions. Inside, use a
function
[`Asyncify.handleSleep()`](https://emscripten.org/docs/porting/asyncify.html#making-async-web-apis-behave-as-if-they-were-synchronous)
which tells Emscripten to suspend the program and provides a `wakeUp()` handler that should be
called when the asynchronous operation has finished. In the example above, we pass that handler to
`setTimeout()`, but it could be used in any other context that accepts callbacks. Finally, we call
the `async_sleep()` function anywhere we want just like regular `sleep()` or any other synchronous
API.

When compiling such code, you need to tell Emscripten to activate the Asyncify feature. Do that by
passing `-s ASYNCIFY` as well as [`-s ASYNCIFY_IMPORTS=[func1,
func2]`](https://emscripten.org/docs/porting/asyncify.html#more-on-asyncify-imports) with a
comma-separated list of functions that might be asynchronous.

```bash
emcc -O2 \
    -s ASYNCIFY \
    -s ASYNCIFY_IMPORTS=[async_sleep] \
    ...
```

This lets Emscripten know that any calls to those functions might require saving and restoring the
state, so the compiler will inject a supporting code around such calls.

Now, when you execute this
code in the browser you'll see a seamless output log like you'd expect, with B coming after a short
delay after A.

```text
A
B
```

You can [return values from
Asyncify](https://emscripten.org/docs/porting/asyncify.html#returning-values) functions too. What
you need to do is return the result of `handleSleep`, and pass the result to the `wakeUp()`
callback. For example, if, instead of reading from a file, you want to fetch some numeric answer
from a remote resource, you can use a snippet like below to issue a request, suspend the C code, and
resume once the response body is retrieved—all done seamlessly as if the call was synchronous.

```js
EM_JS(int, get_answer, (), {
     return Asyncify.handleSleep(wakeUp => {
        fetch("answer.txt")
            .then(response => response.text())
            .then(text => wakeUp(Number(text)));
    });
});
puts("Getting answer...");
int answer = get_answer();
printf("Answer is %d\n", answer);
```

In fact, for Promise-based APIs like `fetch()`, you can even combine Asyncify with JavaScript
async-await feature instead of using the callback-based API. For that, instead of
`Asyncify.handleSleep()`, call `Asyncify.handleAsync()`. Then, instead of having to schedule a
`wakeUp()` callback, you can pass an `async` JavaScript function and use `await` and `return`
inside, making code look even more natural and synchronous, while not losing any of the benefits of
the asynchronous I/O.

```js
EM_JS(int, get_answer, (), {
     return Asyncify.handleAsync(async () => {
        let response = await fetch("answer.txt");
        let text = await response.text();
        return Number(text);
    });
});

int answer = get_answer();
```

#### Awaiting complex values

But this example still limits you only to numbers. What if you want to implement our original
example, where we tried to get a user's name from a file as a string? Well, you can do that too!

Emscripten provides a feature called
[Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html), that allows
you to handle conversions between JavaScript and C++ values. It has support for Asyncify as well, so
you can call `.await()` on external `Promise`s and it will act just like `await` in an async-await
JavaScript code:

```cpp
val fetch = val::global("fetch");
val response = fetch(std::string("answer.txt")).await();
val text = response.call<val>("text").await();
auto answer = text.as<std::string>();
```

When using this method, you don't even need to pass `ASYNCIFY_IMPORTS` as a compile flag, as it's
already included by default.

Okay, so this all works great in Emscripten. What about other toolchains and languages?

### Usage from other languages

Let's say you have a similar synchronous call somewhere in our Rust code that you want to map to an
async API on the Web. Turns out, you can do that too!

First of all, you need to define such a function as a regular import via `extern` block (or your
chosen language's syntax for foreign functions).

```rust
extern {
    fn get_answer() -> i32;
}

println!("Getting answer...");
let answer = get_answer();
println!("Answer is {}", answer);
```

And compile your code to WebAssembly:

```bash
$ cargo build --target wasm32-unknown-unknown
```

Now you need to instrument the WebAssembly file with code for storing/restoring the stack. For C /
C++, Emscripten would do this for us, but it's not used here, so the process is a bit more manual.

Luckily, the Asyncify transform itself is completely toolchain-agnostic. It can transform arbitrary
WebAssembly files, no matter which compiler it's produced by. The transform is provided separately
as part of the `wasm-opt` optimiser from the [Binaryen
toolchain](https://github.com/WebAssembly/binaryen) and can be invoked like this:

```bash
$ wasm-opt -O2 --asyncify \
      --pass-arg=asyncify-imports@env.get_answer \
      [...]
```

Pass `--asyncify` to enable the transform, and then use `--pass-arg=…` to provide a comma-separated
list of asynchronous functions, where the program state should be suspended and later resumed.

All that's left is to provide supporting runtime code that will actually do that—suspend and resume
our code. Again, in the C / C++ case this would be included by Emscripten, but now we need custom
JavaScript glue code that would handle arbitrary WebAssembly files. We've created a library just for
that.

You can find it on Github at
[https://github.com/GoogleChromeLabs/asyncify](https://github.com/GoogleChromeLabs/asyncify) or npm
under the name [`asyncify-wasm](https://www.npmjs.com/package/asyncify-wasm)`.

It simulates a standard [WebAssembly instantiation
API](https://developer.mozilla.org/en-US/docs/WebAssembly), but under its own namespace. The only
difference is that, under a regular WebAssembly API you can only provide synchronous functions as
imports, while under the Asyncify wrapper, you can provide asynchronous imports as well:

```js
let … = await Asyncify.instantiateStreaming(fetch('app.wasm'), {
    env: {
        async get_answer() {
            let response = await fetch("answer.txt");
            let text = await response.text();
            return Number(text);
        }
    }
});
…
await instance.exports.main();
```

Once you try to call such asynchronous function - like `get_answer()` in the example above - from
the WebAssembly side, the library will detect the returned `Promise`, suspend and save the state of
the WebAssembly application, subscribe to the promise completion, and later, once it's resolved,
seamlessly restore the call stack and state and continue execution as if nothing has happened.

Since any function in the module might make an asynchronous call, all the exports become potentially
asynchronous, too, so they get wrapped as well. You might have noticed in the example above that you
need to `await` the result of `instance.exports.main()` to know when the execution is truly
finished.

### How does this all work under the hood?

When Asyncify detects a call to one of the `ASYNCIFY_IMPORTS` functions, it starts an asynchronous
operation, saves the entire state of the application, including the call stack and any temporary
locals, and later, when that operation is finished, restores all the memory and call stack and and
resumes from the exact same place and with the exact same state as if the program has never stopped.

This is quite similar to async-await feature in JavaScript that I showed earlier, but, unlike the
JavaScript one, doesn't require any special syntax or runtime support from the language, and instead
works by transforming plain synchronous functions at compile-time.

For simplicity, let's take our asynchronous sleep example:

```js
puts("A");
async_sleep(1);
puts("B");
```

Asyncify takes this code and transforms it to roughly like the following (pseudo-code, real
transformation is more involved than this):

```js
if (mode == NORMAL_EXECUTION) {
    puts("A");
    async_sleep(1);
    saveLocals();
    mode = UNWINDING;
    return;
}
if (mode == REWINDING) {
    restoreLocals();
    mode = NORMAL_EXECUTION;
}
puts("B");
```

Initially `mode` is set to `NORMAL_EXECUTION`. Correspondingly, the first time such transformed code
is executed, only the part leading up to "async_sleep" will get evaluated. As soon as the
asynchronous operation is scheduled, Asyncify saves all the locals, and unwinds the stack by
returning from each function all the way to the top, this way giving control back to the browser
event loop.

Then, once `async_sleep()` resolves, Asyncify support code will change `mode` to `REWINDING`, and
call our function again. This time, the "normal execution" branch is skipped - since it already did
the job last time and we want to avoid printing "A" twice - and instead it comes straight to the
"rewinding" branch. Once it's reached, it restores all the stored locals, changes mode back to
"normal" and continues the execution as if the code was never stopped in the first place.

### Transformation costs

Unfortunately, Asyncify transform isn't completely free, since it has to inject quite a bit of
supporting code for storing and restoring all those locals, navigating the call stack under
different modes and so on. It tries to modify only functions marked as asynchronous on the command
line, as well as any of their potential callers, but that still might result in ~50% overhead to the
uncompressed code size.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/Im4hmQOYRHFcsg8UTfTR.png", alt="ALT_TEXT_HERE",
width="800", height="494" %}

It's not ideal, but in many cases acceptable when the alternative is not having the functionality
altogether or having to make significant rewrites to the original code.

Make sure to always enable optimizations for the final builds to avoid it going even higher. You can
also check [Asyncify-specific optimization
options](https://emscripten.org/docs/porting/asyncify.html#optimizing) to reduce the overhead by
limiting transforms only to specified functions and/or only direct function calls. There is also a
minor cost to runtime performance, but it's limited to the async calls themselves. However, compared
to the cost of the actual work, it's usually negligible.

## Real-world demos

Now that we've looked at the simple examples, let's move on to more complicated scenarios.

As mentioned in the beginning of the article, one of the storage options on the Web is an
asynchronous [File System Access API](https://web.dev/file-system-access/). It provides access to a
real host filesystem from a Web application.

On the other hand, there is a de-facto standard—[WASI](https://github.com/WebAssembly/WASI) - for
WebAssembly I/O in the console and the server-side. It was designed as a compilation target for
system languages, and exposes all sorts of filesystem and other operations in a traditional
synchronous form.

What if we could map one to another? Then we could compile any application in any source language
with any toolchain supporting the WASI target, and run it in a sandbox on the Web, while still
allowing it to operate on real user files! With Asyncify, we can do just that.

In this demo, I've compiled Rust [coreutils](https://github.com/RReverser/coreutils) crate with a
few minor patches to WASI, passed via Asyncify transform and implemented asynchronous
[bindings](https://github.com/GoogleChromeLabs/wasi-fs-access/blob/main/src/bindings.ts) from WASI
to File System Access API on the JavaScript side. Once combined with xterm.js, this provides a
realistic shell running in the browser tab and operating on real user files - just like an actual
terminal.

{% Video src="video/9oK23mr86lhFOwKaoYZ4EySNFp02/4244yB6c9RbMCjGjP8ZW.mp4" %}

Check it out live at [https://wasi.rreverser.com/](https://wasi.rreverser.com/).

It's not limited just to timers and filesystems, either. You can go further and use more niche APIs
on the Web.

For example, also with the help of Asyncify, it's possible to map
[libusb](https://github.com/libusb/libusb)—probably the most popular native library for working with
USB devices—to a [WebUSB API](https://web.dev/usb/), which gives asynchronous access to such devices
on the Web. Once mapped and compiled, I got standard libusb tests and examples to run against chosen
devices right in the sandbox of a Web page.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/2rscL8dyhOVMacuq54Ad.jpg", alt="ALT_TEXT_HERE",
width="375", height="548" %}

It's probably a story for another blog post though.

Those examples demonstrate just how powerful Asyncify can be for bridging the gap and porting all
sorts of applications to the Web, allowing you to gain cross-platform access, sandboxing, and better
security, all without losing in functionality.
