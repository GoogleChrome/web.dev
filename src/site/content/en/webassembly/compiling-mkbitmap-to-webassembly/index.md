---
layout: post
title: Compiling mkbitmap to WebAssembly
authors:
  - thomassteiner
date: 2023-04-28
# updated: 2023-04-28
description: >
  The mkbitmap C program reads an image and applies one or more of the following operations to it, in this order: inversion, highpass filtering, scaling, and thresholding. Each operation can be individually controlled and turned on or off. This article shows how to compile mkbitmap to WebAssembly.
tags:
  - webassembly
---

The [`mkbitmap`](https://potrace.sourceforge.net/mkbitmap.1.html) C program reads an image and applies one or more of the following operations to it, in this order: inversion, highpass filtering, scaling, and thresholding. Each operation can be individually controlled and turned on or off. The principal use of `mkbitmap` is to convert color or grayscale images into a format suitable as input for other programs, particularly the tracing program [`potrace`](https://potrace.sourceforge.net/potrace.1.html) that forms the basis of [SVGcode](/svgcode/). As a preprocessing tool, `mkbitmap` is particularly useful for converting scanned line art, such as cartoons, handwritten text, etc., to high-resolution bilevel images.

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/IxTMIGl9KB2HQCI57VVk.png", alt="Cartoon image in color.", width="239", height="235" %}
  <figcaption>The original image (<a href="https://potrace.sourceforge.net/mkbitmap.html">Source</a>).</figcaption>
</figure>

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/EGN9P3V1AK8BneYniU1T.png", alt="Cartoon image converted to grayscale after preprocessing.", width="478", height="470" %}
  <figcaption>First scaled, then thresholded: <code>mkbitmap -f 2 -s 2 -t 0.48</code> (<a href="https://potrace.sourceforge.net/mkbitmap.html">Source</a>).</figcaption>
</figure>

You use `mkbitmap` by passing it a number of options and one or multiple file names. For all details, see the tool's [man page](https://potrace.sourceforge.net/mkbitmap.1.html):

```bash
$ mkbitmap [options] [filename...]
```

## Getting the code

The first step is to obtain the source code of `mkbitmap`. You can find it on the [project's website](https://potrace.sourceforge.net/#downloading). At the time of this writing, [potrace-1.16.tar.gz](https://potrace.sourceforge.net/download/1.16/potrace-1.16.tar.gz) is the latest version.

## Installing the tool

The next step is to install the tool. The [`INSTALL`](https://potrace.sourceforge.net/INSTALL) file contains the following instructions:

 1. `cd` to the directory containing the package's source code and type
    `./configure` to configure the package for your system.

    Running `configure` might take a while.  While running, it prints
    some messages telling which features it is checking for.
  1. Type `make` to compile the package.
  1. Optionally, type `make check` to run any self-tests that come with
     the package, generally using the just-built uninstalled binaries.
  1. Type `make install` to install the programs and any data files and
     documentation.  When installing into a prefix owned by root, it is
     recommended that the package be configured and built as a regular
     user, and only the `make install` phase executed with root
     privileges.

 If you follow these steps, you hopefully end up with two executables, `potrace` and `mkbitmap`—the latter is the focus of this article. You can verify it worked correctly by running `./mkbitmap --version`. Here is the output of all four steps from my machine, heavily trimmed for brevity:

Step 1, `./configure`:

 ```bash
 $ ./configure
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... ./install-sh -c -d
checking for gawk... no
checking for mawk... no
checking for nawk... no
checking for awk... awk
checking whether make sets $(MAKE)... yes
[…]
config.status: executing libtool commands
```

Step 2, `make`:

```bash
$ make
/Applications/Xcode.app/Contents/Developer/usr/bin/make  all-recursive
Making all in src
clang -DHAVE_CONFIG_H -I. -I..     -g -O2 -MT main.o -MD -MP -MF .deps/main.Tpo -c -o main.o main.c
mv -f .deps/main.Tpo .deps/main.Po
[…]
make[2]: Nothing to be done for `all-am'.
```

Step 3, `make check`:

```bash
$ make check
Making check in src
make[1]: Nothing to be done for `check'.
Making check in doc
make[1]: Nothing to be done for `check'.
[…]
============================================================================
Testsuite summary for potrace 1.16
============================================================================
# TOTAL: 8
# PASS:  8
# SKIP:  0
# XFAIL: 0
# FAIL:  0
# XPASS: 0
# ERROR: 0
============================================================================
make[1]: Nothing to be done for `check-am'.
```

Step 4, `sudo make install`:

```bash
$ sudo make install
Password:
Making install in src
 .././install-sh -c -d '/usr/local/bin'
  /bin/sh ../libtool   --mode=install /usr/bin/install -c potrace mkbitmap '/usr/local/bin'
[…]
make[2]: Nothing to be done for `install-data-am'.
```

Checking if it worked, `mkbitmap --version`:

```bash
$ mkbitmap --version
mkbitmap 1.16. Copyright (C) 2001-2019 Peter Selinger.
 ```

Congratulations, you have successfully installed `mkbitmap`! Now the next step is to make the equivalent of these steps work with WebAssembly.

## Compiling to WebAssembly

The [Emscripten Building Projects documentation](https://Emscripten.org/docs/compiling/Building-Projects.html) state the following:

> Building large projects with Emscripten is very easy. Emscripten provides two simple scripts that configure your makefiles to use `emcc` as a drop-in replacement for `gcc`—in most cases the rest of your project's current build system remains unchanged.

The documentation then goes on (a little edited for brevity):

> Consider the case where you normally build with the following commands: <br>
> <br>
> `./configure` <br>
> `make` <br>
> <br>
> To build with Emscripten, you would instead use the following commands: <br>
> <br>
> `emconfigure ./configure`<br>
> `emmake make`

So essentially `./configure` becomes `emconfigure ./configure` and `make` becomes `emmake make`. Let's try this with `mkbitmap`:

{% Aside 'warning' %}
If you followed the platform compilation steps above, be sure to run `make clean` before proceeding with the WebAssembly compilation steps.
{% endAside %}

Step 1, `emconfigure ./configure`:

```bash
$ emconfigure ./configure
configure: ./configure
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... ./install-sh -c -d
checking for gawk... no
checking for mawk... no
checking for nawk... no
checking for awk... awk
[…]
config.status: executing libtool commands
```

Step 2, `emmake make`:

```bash
$ emmake make
make: make
/Applications/Xcode.app/Contents/Developer/usr/bin/make  all-recursive
Making all in src
/opt/homebrew/Cellar/emscripten/3.1.36/libexec/emcc -DHAVE_CONFIG_H -I. -I..     -g -O2 -MT main.o -MD -MP -MF .deps/main.Tpo -c -o main.o main.c
mv -f .deps/main.Tpo .deps/main.Po
[…]
make[2]: Nothing to be done for `all'.
```

If everything went well, there should now be `.wasm` files somewhere in the directory. You can find them by running `find . -name "*.wasm"`:

```bash
$ find . -name "*.wasm"
./a.wasm
./src/mkbitmap.wasm
./src/potrace.wasm
```

The two last ones look promising. There are now also two corresponding files, `mkbitmap` and `potrace`. The fact that they don't have the `.js` extension is a little confusing, but they are in fact JavaScript files, verifiable with a quick `head` call:

```bash
$ head -n 20 mkbitmap
// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
```

Rename the JavaScript file to `mkbitmap.js` by calling `mv mkbitmap mkbitmap.js` (and `mv potrace potrace.js` respectively if you want).
Now it's time for the first test to see if it worked by executing the file with Node.js on the command line by running `node mkbitmap.js --version`:

```bash
$ node mkbitmap.js --version
mkbitmap 1.16. Copyright (C) 2001-2019 Peter Selinger.
```

Felicitation, you have successfully compiled `mkbitmap` to WebAssembly! Now the next step is to make it work in the browser.

## Making it work in the browser

Copy the `mkbitmap.js` and the `mkbitmap.wasm` files to a new directory called `mkbitmap` and create an `index.html` HTML boilerplate file that loads the `mkbitmap.js` JavaScript file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>mkbitmap</title>
  </head>
  <body>
    <script src="mkbitmap.js"></script>
  </body>
</html>
```

Start a local server that serves the `mkbitmap` directory and open it in your browser. You should see a prompt that asks you for input. This is actually perfectly expected, since, [according to the tool's man page](https://potrace.sourceforge.net/mkbitmap.1.html#:~:text=A%20filename%20of%20%22%2D%22%20may%20be%20given%20to%20specify%20reading%20from%20standard%20input), _"[i]f no filename arguments are given, then mkbitmap acts as a filter, reading from standard input"_.

{% Aside 'warning' %}
Serving from the `file:` protocol doesn't work for `.wasm` files, you really need to start a local server.
{% endAside %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/DbDQJnxA4GylWKZcmlJK.png", alt="The mkbitmap app showing a prompt that asks for input.", width="800", height="600" %}

So how do you stop `mkbitmap` from executing immediately and instead make it wait for user input? For this, you need to understand Emscripten's `Module` object. `Module` is a global JavaScript object with attributes that Emscripten-generated code calls at various points in its execution.
Developers can provide an implementation of `Module` to control the execution of code.
When an Emscripten application starts up, it looks at the values on the `Module` object and applies them.

In the case of `mkbitmap`, you need to set [`Module.noInitialRun`](https://emscripten.org/docs/api_reference/module.html#Module.noInitialRun) to `true` to prevent the initial run that caused the prompt to appear. Create a script called `script.js`, include it _before_ the `<script src="mkbitmap.js"></script>` and add the following code:

```js
var Module = {
  // Don't run main() at page load
  noInitialRun: true,
};
```

When you now reload the app, the prompt should be gone. But how can you provide input to the app? This is where Emscripten's [file system](https://emscripten.org/docs/api_reference/Filesystem-API.html) support in `Module.FS` comes in. If you read the [Including File System Support](https://emscripten.org/docs/api_reference/Filesystem-API.html#including-file-system-support) section of the documentation, you will read:

> Emscripten decides whether to include file system support automatically. Many programs don't need files, and file system support is not negligible in size, so Emscripten avoids including it when it doesn't see a reason to. That means that if your C/C++ code does not access files, then the `FS` object and other file system APIs will not be included in the output. And, on the other hand, if your C/C++ code does use files, then file system support will be automatically included.

Unfortunately `mkbitmap` is one of these cases where this magic doesn't work, so you need to explicitly tell Emscripten to include file system support. This means you need to do the `emconfigure` and `emmake` dance from above again, with the right flags set that you pass via a `CFLAGS` argument. Set `-sFILESYSTEM` so file system support is included and `-sEXPORTED_RUNTIME_METHODS=FS,ccall,cwrap` so `Module.FS`, `Module.ccall`, and `Module.cwrap` are exported. (More on `cwrap` and `ccall` later.) The final `emconfigure` command looks like this:

```bash
$ emconfigure ./configure CFLAGS='-sFILESYSTEM -sEXPORTED_FUNCTIONS=_main -sEXPORTED_RUNTIME_METHODS=FS,ccall,cwrap'
```

Do not forget to run `emmake make` again and copy the freshly created files over to the `mkbitmap` folder.

