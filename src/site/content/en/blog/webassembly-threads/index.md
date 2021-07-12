---
title: Using WebAssembly threads from C, C++ and Rust
subhead: Learn how to bring multithreaded applications written in other languages to WebAssembly.
description: Learn how to bring multithreaded applications written in other languages to WebAssembly.
date: 2021-07-12
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/YrOqDnzjHFqmZdiNBmbw.jpg
alt: A needle acting as a prism—splitting a single white thread into multiple colourful ones.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - performance
---

WebAssembly threads support is one of the most important performance additions to WebAssembly. It
allows you to either run parts of your code in parallel on separate cores, or the same code over
independent parts of the input data, scaling it to as many cores as the user has and significantly
reducing the overall execution time.

In this article you will learn how to use WebAssembly threads to bring multithreaded applications
written in languages like C, C++, and Rust to the web.

## How WebAssembly threads work

WebAssembly threads is not a separate feature, but a combination of several components that allows
WebAssembly apps to use traditional multithreading paradigms on the web.

### Web Workers

First component is the regular
[Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) you know and
love from JavaScript. WebAssembly threads use the `new Worker` constructor to create new underlying
threads. Each thread loads a JavaScript glue, and then the main thread uses
[`Worker#postMessage`](https://developer.mozilla.org/docs/Web/API/Worker/postMessage) method to
share the compiled
[`WebAssembly.Module`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module)
as well as a shared
[`WebAssembly.Memory`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)
(see below) with those other threads. This establishes communication and allows all those threads to
run the same WebAssembly code on the same shared memory without going through JavaScript again.

Web Workers have been around for over a decade now, are widely supported, and don't require any
special flags.

### `SharedArrayBuffer`

WebAssembly memory is represented by a
[`WebAssembly.Memory`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)
object in the JavaScript API. By default `WebAssembly.Memory` is a wrapper around an
[`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)—a
raw byte buffer that can be accessed only by a single thread.

```js
> new WebAssembly.Memory({ initial:1, maximum:10 }).buffer
ArrayBuffer { … }
```

To support multithreading, `WebAssembly.Memory` gained a shared variant too. When created with a
`shared` flag via the JavaScript API, or by the WebAssembly binary itself, it becomes a wrapper
around a
[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
instead. It's a variation of `ArrayBuffer` that can be shared with other threads and read or
modified simultaneously from either side.

```js
> new WebAssembly.Memory({ initial:1, maximum:10, shared:true }).buffer
SharedArrayBuffer { … }
```

Unlike [`postMessage`](https://developer.mozilla.org/docs/Web/API/Worker/postMessage), normally used
for communication between main thread and Web Workers,
[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
doesn't require copying data or even waiting for the event loop to send and receive messages.
Instead, any changes are seen by all threads nearly instantly, which makes it a much better
compilation target for traditional synchronisation primitives.

`SharedArrayBuffer` has a complicated history. It was initially shipped in several browsers
mid-2017, but had to be disabled in the beginning of 2018 due to discovery of [Spectre
vulnerabilities](https://developers.google.com/web/updates/2018/02/meltdown-spectre). The particular
reason was that data extraction in Spectre relies on timing attacks—measuring execution time of a
particular piece of code. To make this kind of attack harder, browsers reduced precision of standard
timing APIs like `Date.now` and `performance.now`. However, shared memory, combined with a simple
counter loop running in a separate thread [is also a very reliable way to get high-precision
timing](https://github.com/tc39/security/issues/3), and it's much harder to mitigate without
significantly throttling runtime performance.

Instead, Chrome 68 (mid-2018) re-enabled `SharedArrayBuffer` again by leveraging [Site
Isolation](https://developers.google.com/web/updates/2018/07/site-isolation)—a feature that puts
different websites into different processes and makes it much more difficult to use side-channel
attacks like Spectre. However, this mitigation was still limited only to Chrome desktop, as Site
Isolation is a fairly expensive feature, and couldn't be enabled by default for all sites on
low-memory mobile devices nor was it yet implemented by other vendors.

Fast-forward to 2020, Chrome and Firefox both have implementations of Site Isolation, and a standard
way for websites to opt-in to the feature with [COOP and COEP headers](/coop-coep/). An opt-in
mechanism allows to use Site Isolation even on low-powered devices where enabling it for all the
websites would be too expensive. To opt-in, add the following headers to the main document in your
server configuration:

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Once you opt-in, you get access to `SharedArrayBuffer` (including `WebAssembly.Memory` backed by a
`SharedArrayBuffer`), precise timers, memory measurement and other APIs that require an isolated
origin for security reasons. Check out the [Making your website "cross-origin isolated" using COOP
and COEP](/coop-coep/) for more details.

### WebAssembly atomics

While `SharedArrayBuffer` allows each thread to read and write to the same memory, for correct
communication you want to make sure they don't perform conflicting operations at the same time. For example, it's
possible for one thread to start reading data from a shared address, while another thread is writing
to it, so the first thread will now get a corrupted result. This category of bugs is known as race
conditions. In order to prevent race conditions, you need to somehow synchronize those accesses.
This is where atomic operations come in.

[WebAssembly
atomics](https://webassembly.github.io/threads/core/syntax/instructions.html#atomic-memory-instructions)
is an extension to the WebAssembly instruction set that allow to read and write small cells of data
(usually 32- and 64-bit integers) "atomically". That is, in a way that guarantees that no two
threads are reading or writing to the same cell at the same time, preventing such conflicts at a low
level. Additionally, WebAssembly atomics contain two more instruction kinds—"wait" and "notify"—that
allow one thread to sleep ("wait") on a given address in a shared memory until another thread wakes
it up via "notify".

All the higher-level synchronisation primitives, including channels, mutexes, and read-write locks
build upon those instructions.

## How to use WebAssembly threads

### Feature detection

WebAssembly atomics and `SharedArrayBuffer` are relatively new features and aren't yet available in
all browsers with WebAssembly support. You can find which browsers support new WebAssembly features
on the [webassembly.org roadmap](https://webassembly.org/roadmap/).

To ensure that all users can load your application, you'll need to implement progressive enhancement
by building two different versions of Wasm—one with multithreading support and one without it. Then
load the supported version depending on feature detection results. To detect WebAssembly threads
support at runtime, use [wasm-feature-detect
library](https://github.com/GoogleChromeLabs/wasm-feature-detect) and load the module like this:

```js
import { threads } from 'wasm-feature-detect';

const hasThreads = await threads();

const module = await (
  hasThreads
    ? import('./module-with-threads.js')
    : import('./module-without-threads.js')
);

// …now use `module` as you normally would
```

Now let's take a look at how to build a multithreaded version of the WebAssembly module.

### C

In C, particularly on Unix-like systems, the common way to use threads is via [POSIX
Threads](https://en.wikipedia.org/wiki/POSIX_Threads) provided by the `pthread` library. Emscripten
[provides an API-compatible implementation](https://emscripten.org/docs/porting/pthreads.html) of
the `pthread` library built atop Web Workers, shared memory and atomics, so that the same code can
work on the web without changes.

Let's take a look at an example:

{% Label %}example.c:{% endLabel %}

```c/2,17,19
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>

void *thread_callback(void *arg)
{
    sleep(1);
    printf("Inside the thread: %d\n", *(int *)arg);
    return NULL;
}

int main()
{
    puts("Before the thread");

    pthread_t thread_id;
    int arg = 42;
    pthread_create(&thread_id, NULL, thread_callback, &arg);

    pthread_join(thread_id, NULL);

    puts("After the thread");

    return 0;
}
```

Here the headers for the `pthread` library are included via `pthread.h`. You can also see a couple
of crucial functions for dealing with threads.

[`pthread_create`](https://man7.org/linux/man-pages/man3/pthread_create.3.html) will create a
background thread. It takes a destination to store a thread handle in, some thread creation
attributes (here not passing any, so it's just `NULL`), the callback to be executed in the new
thread (here `thread_callback`), and an optional argument pointer to pass to that callback in case
you want to share some data from the main thread—in this example we're sharing a pointer to a
variable `arg`.

[`pthread_join`](https://man7.org/linux/man-pages/man3/pthread_join.3.html) can be called later at
any time to wait for the thread to finish the execution, and get the result returned from the
callback. It accepts the earlier assigned thread handle as well as a pointer to store the result. In
this case, there aren't any results so the function takes a `NULL` as an argument.

To compile code using threads with Emscripten, you need to invoke `emcc` and pass a `-pthread`
parameter, as when compiling the same code with Clang or GCC on other platforms:

```shell
emcc -pthread example.c -o example.js
```

However, when you try to run it in a browser or Node.js, you'll see a warning and then the program
will hang:

```text
Before the thread
Tried to spawn a new thread, but the thread pool is exhausted.
This might result in a deadlock unless some threads eventually exit or the code
explicitly breaks out to the event loop.
If you want to increase the pool size, use setting `-s PTHREAD_POOL_SIZE=...`.
If you want to throw an explicit error instead of the risk of deadlocking in those
cases, use setting `-s PTHREAD_POOL_SIZE_STRICT=2`.
[…hangs here…]
```

What happened? The problem is, most of the time-consuming APIs on the web are asynchronous and rely
on the event loop to execute. This limitation is an important distinction compared to traditional
environments, where applications normally run I/O in synchronous, blocking manner. Check out the
blog post about [Using asynchronous web APIs from WebAssembly](/asyncify/) if you'd like to learn
more.

In this case, the code synchronously invokes `pthread_create` to create a background thread, and
follows up by another synchronous call to `pthread_join` that waits for the background thread to
finish execution. However, Web Workers, that are used behind the scenes when this code is compiled
with Emscripten, are asynchronous. So what happens is, `pthread_create` only _schedules_ a new
Worker thread to be created on the next event loop run, but then `pthread_join` immediately blocks
the event loop to wait for that Worker, and by doing so prevents it from ever being created. It's a
classic example of a [deadlock](https://en.wikipedia.org/wiki/Deadlock).

One way to solve this problem is to create a pool of Workers ahead of time, before the program has
even started. When `pthread_create` is invoked, it can take a ready-to-use Worker from the pool, run
the provided callback on its background thread, and return the Worker back to the pool. All of this
can be done synchronously, so there won't be any deadlocks as long as the pool is sufficiently
large.

This is exactly what Emscripten allows with the [`-s
PTHREAD_POOL_SIZE=...`](https://emsettings.surma.technology/#PTHREAD_POOL_SIZE) option. It allows to
specify a number of threads—either a fixed number, or a JavaScript expression like
[`navigator.hardwareConcurrency`](https://developer.mozilla.org/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)
to create as many threads as there are cores on the CPU. The latter option is helpful when your code
can scale to an arbitrary number of threads.

In the example above, there is only one thread being created, so instead of reserving all cores it's
sufficient to use `-s PTHREAD_POOL_SIZE=1`:

```shell
emcc -pthread -s PTHREAD_POOL_SIZE=1 example.c -o example.js
```

This time, when you execute it, things work successfully:


```text
Before the thread
Inside the thread: 42
After the thread
Pthread 0x701510 exited.
```

There is another problem though: see that `sleep(1)` in the code example? It executes in the thread
callback, meaning off the main thread, so it should be fine, right? Well, it isn't.

When `pthread_join` is called, it has to wait for the thread execution to finish, meaning that if
the created thread is performing long-running tasks—in this case, sleeping 1 second—then the main
thread will also have to block for the same amount of time till the results are back. When this JS
is executed in the browser, it will block the UI thread for 1 second until the thread callback
returns. This leads to poor user experience.

There are few solutions to this:
 - `pthread_detach`
 - `-s PROXY_TO_PTHREAD`
 - Custom Worker and Comlink

#### pthread_detach

First, if you only need to run some tasks off the main thread, but don't need to wait for the
results, you can use [`pthread_detach`](https://man7.org/linux/man-pages/man3/pthread_detach.3.html)
instead of `pthread_join`. This will leave the thread callback running in the background. If you're
using this option, you can switch off the warning with [`-s
PTHREAD_POOL_SIZE_STRICT=0`](https://emsettings.surma.technology/#PTHREAD_POOL_SIZE_STRICT).

#### PROXY_TO_PTHREAD

Second, if you're compiling a C application rather than a library, you can use [`-s
PROXY_TO_PTHREAD`](https://emsettings.surma.technology/#PROXY_TO_PTHREAD) option, which will offload
the main application code to a separate thread in addition to any nested threads created by the
application itself. This way, main code can block safely at any time without freezing the UI.
Incidentally, when using this option, you don't have to precreate the thread pool either—instead,
Emscripten can leverage the main thread for creating new underlying Workers, and then block the
helper thread in `pthread_join` without deadlocking.

#### Comlink

Third, if you're working on a library and still need to block, you can create your own Worker,
import the Emscripten-generated code and expose it with
[Comlink](https://github.com/GoogleChromeLabs/comlink) to the main thread. Main thread will be able
to invoke any exported methods as asynchronous functions, and that way will also avoid blocking the
UI.

In a simple application such as the previous example `-s PROXY_TO_PTHREAD` is the best option:

```shell
emcc -pthread -s PROXY_TO_PTHREAD example.c -o example.js
```

### C++

All the same caveats and logic apply in the same way to C++. The only new thing you gain is access
to higher-level APIs like [`std::thread`](https://en.cppreference.com/w/cpp/thread/thread) and
[`std::async`](https://en.cppreference.com/w/cpp/thread/async), which use the previously discussed
`pthread` library under the hood.

So the example above can be rewritten in more idiomatic C++ like this:

{% Label %}example.cpp:{% endLabel %}

```cpp/1,9,14
#include <iostream>
#include <thread>
#include <chrono>

int main()
{
    puts("Before the thread");

    int arg = 42;
    std::thread thread([&]() {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        std::cout << "Inside the thread: " << arg << std::endl;
    });

    thread.join();

    std::cout << "After the thread" << std::endl;

    return 0;
}
```

When compiled and executed with similar parameters, it will behave in the same way as the C example:

```shell
emcc -std=c++11 -pthread -s PROXY_TO_PTHREAD example.cpp -o example.js
```

Output:

```text
Before the thread
Inside the thread: 42
Pthread 0xc06190 exited.
After the thread
Proxied main thread 0xa05c18 finished with return code 0. EXIT_RUNTIME=0 set, so
keeping main thread alive for asynchronous event operations.
Pthread 0xa05c18 exited.
```

### Rust

Unlike Emscripten, Rust doesn't have a specialized end-to-end web target, but instead provides a
generic `wasm32-unknown-unknown` target for generic WebAssembly output.

If Wasm is intended to be used in a web environment, any interaction with JavaScript APIs is left to
external libraries and tooling like [wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/)
and [wasm-pack](https://rustwasm.github.io/docs/wasm-pack/). Unfortunately, this means that the
standard library is not aware of Web Workers and standard APIs such as
[`std::thread`](https://doc.rust-lang.org/std/thread/) won't work when compiled to WebAssembly.

Luckily, the majority of the ecosystem depends on higher-level libraries to take care of
multithreading. At that level it's much easier to abstract away all the platform differences.

In particular, [Rayon](https://crates.io/crates/rayon) is the most popular choice for
data-parallelism in Rust. It allows you to take method chains on regular iterators and, usually with
a single line change, convert them in a way where they'd run in parallel on all available threads
instead of sequentially. For example:

```rust/3/2
pub fn sum_of_squares(numbers: &[i32]) -> i32 {
  numbers
  .iter()
  .par_iter()
  .map(x => x * x)
  .sum()
}
```

With this small change, the code will split up the input data, calculate `x * x` and partial sums in
parallel threads, and in the end add up those partial results together.

To accommodate for platforms without working `std::thread`, Rayon provides hooks that allow to
define custom logic for spawning and exiting threads.

[wasm-bindgen-rayon](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon) taps into those hooks
to spawn WebAssembly threads as Web Workers. To use it, you need to add it as a dependency and
follow the configuration steps described in the
[docs](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon#setting-up). The example above will
end up looking like this:

```rust/0-2/
pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn sum_of_squares(numbers: &[i32]) -> i32 {
  numbers
  .par_iter()
  .map(x => x * x)
  .sum()
}
```

Once done, the generated JavaScript will export an extra `initThreadPool` function. This function
will create a pool of Workers and reuse them throughout the lifetime of the program for any
multithreaded operations done by Rayon.

This pool mechanism is similar to the `-s PTHREAD_POOL_SIZE=...` option in Emscripten explained
earlier, and also needs to be initialized before the main code to avoid deadlocks:

```js/0,5-7
import init, { initThreadPool, sum_of_squares } from './pkg/index.js';

// Regular wasm-bindgen initialization.
await init();

// Thread pool initialization with the given number of threads
// (pass `navigator.hardwareConcurrency` if you want to use all cores).
await initThreadPool(navigator.hardwareConcurrency);

// ...now you can invoke any exported functions as you normally would
console.log(sum_of_squares(new Int32Array([1, 2, 3]))); // 14
```

Note that the same [caveats](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon#caveats) about
blocking the main thread apply here too. Even the `sum_of_squares` example still needs to block the
main thread to wait for the partial results from other threads.

It might be a very short wait or a long one, depending on the complexity of iterators and number of
available threads, but, to be on the safe side, browser engines actively prevent blocking the main
thread altogether and such code will throw an error. Instead, you should create a Worker, import the
`wasm-bindgen`-generated code there, and expose its API with a library like
[Comlink](https://github.com/GoogleChromeLabs/comlink) to the main thread.

Check out [the wasm-bindgen-rayon
example](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/tree/main/demo) for an end-to-end
demo showing:

*   [Feature detection of
    threads.](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/wasm-worker.js#L27)
*   [Building single- and multi-threaded versions of the same Rust
    app.](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/package.json#L4-L5)
*   [Loading the JS+Wasm generated by wasm-bindgen in a
    Worker.](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/wasm-worker.js#L28-L31)
*   [Using wasm-bindgen-rayon to initialize a thread
    pool.](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/wasm-worker.js#L32)
*   Using Comlink to [expose Worker's
    API](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/wasm-worker.js#L44-L46)
    to [the main
    thread](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/e13485d6d64a062b890f5bb3a842b1fe609eb3c1/demo/index.js#L25-L29).

## Real-world use cases

We actively use WebAssembly threads in [Squoosh.app](https://squoosh.app/) for client-side image
compression—in particular, for formats like AVIF (C++), JPEG-XL (C++), OxiPNG (Rust) and WebP v2
(C++). Thanks to the multithreading alone, we've seen consistent 1.5x-3x speed-ups (exact ratio
differs per codec), and were able to push those numbers even further by combining WebAssembly threads
with [WebAssembly SIMD](https://v8.dev/features/simd)!

Google Earth is another notable service that's using WebAssembly threads for its [web
version](https://earth.google.com/web/).

[FFMPEG.WASM](https://ffmpegwasm.github.io/) is a WebAssembly version of a popular
[FFmpeg](https://www.ffmpeg.org/) multimedia toolchain that uses WebAssembly threads to efficiently
encode videos directly in the browser.

There are many more exciting examples using WebAssembly threads out there. Be sure to check out
the demos and bring your own multithreaded applications and libraries to the web!
