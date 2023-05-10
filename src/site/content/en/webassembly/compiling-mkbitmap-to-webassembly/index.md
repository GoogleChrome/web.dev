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

So time for the first test and checking if it worked via `node mkbitmap --version`:

```bash
$ node mkbitmap --version
mkbitmap 1.16. Copyright (C) 2001-2019 Peter Selinger.
```

Felicitation, you have successfully compiled `mkbitmap` to WebAssembly! Now the next step is to make it work in the browser.

## Making it work in the browser

