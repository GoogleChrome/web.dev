---
layout: post
title: Compiling mkbitmap to WebAssembly
authors:
  - thomassteiner
date: 2023-06-29
# updated: 2023-06-29
description: >
  The mkbitmap C program reads an image and applies one or more of the following operations to it, in this order: inversion, highpass filtering, scaling, and thresholding. Each operation can be individually controlled and turned on or off. This article shows how to compile mkbitmap to WebAssembly.
tags:
  - webassembly
---

In [What is WebAssembly and where did it come from?](/what-is-webassembly/), I explained how we ended up with the WebAssembly of today. In this article, I will show you my approach of compiling an existing C program, `mkbitmap`, to WebAssembly. It's more complex than the [hello world](/what-is-webassembly/#compiling-to-webassembly) example, as it includes working with files, communicating between the WebAssembly and JavaScript lands, and drawing to a canvas, but it's still manageable enough to not overwhelm you.

The article is written for web developers who want to learn WebAssembly and shows step-by-step how you might proceed if you wanted to compile something like `mkbitmap` to WebAssembly. As a fair warning, not getting an app or library to compile on the first run is completely normal, which is why some of the steps described below ended up not working, so I needed to backtrack and try again differently. The article doesn't show the magic final compilation command as if it had dropped from the sky, but rather describes my actual progress, some frustrations included.

## About `mkbitmap`

The [`mkbitmap`](https://potrace.sourceforge.net/mkbitmap.1.html) C program reads an image and applies one or more of the following operations to it, in this order: inversion, highpass filtering, scaling, and thresholding. Each operation can be individually controlled and turned on or off. The principal use of `mkbitmap` is to convert color or grayscale images into a format suitable as input for other programs, particularly the tracing program [`potrace`](https://potrace.sourceforge.net/potrace.1.html) that forms the basis of [SVGcode](/svgcode/). As a preprocessing tool, `mkbitmap` is particularly useful for converting scanned line art, such as cartoons or handwritten text, to high-resolution bilevel images.

You use `mkbitmap` by passing it a number of options and one or multiple file names. For all details, see the tool's [man page](https://potrace.sourceforge.net/mkbitmap.1.html):

```bash
$ mkbitmap [options] [filename...]
```

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/IxTMIGl9KB2HQCI57VVk.png", alt="Cartoon image in color.", width="239", height="235" %}
  <figcaption>The original image (<a href="https://potrace.sourceforge.net/mkbitmap.html">Source</a>).</figcaption>
</figure>

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/EGN9P3V1AK8BneYniU1T.png", alt="Cartoon image converted to grayscale after preprocessing.", width="478", height="470" %}
  <figcaption>First scaled, then thresholded: <code>mkbitmap -f 2 -s 2 -t 0.48</code> (<a href="https://potrace.sourceforge.net/mkbitmap.html">Source</a>).</figcaption>
</figure>

## Get the code

The first step is to obtain the source code of `mkbitmap`. You can find it on the [project's website](https://potrace.sourceforge.net/#downloading). At the time of this writing, [potrace-1.16.tar.gz](https://potrace.sourceforge.net/download/1.16/potrace-1.16.tar.gz) is the latest version.

## Compile and install locally

The next step is to compile and install the tool locally to get a feeling for how it behaves. The [`INSTALL`](https://potrace.sourceforge.net/INSTALL) file contains the following instructions:

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

 By following these steps, you should end up with two executables, `potrace` and `mkbitmap`—the latter is the focus of this article. You can verify it worked correctly by running `mkbitmap --version`. Here is the output of all four steps from my machine, heavily trimmed for brevity:

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

To check if it worked, run `mkbitmap --version`:

```bash
$ mkbitmap --version
mkbitmap 1.16. Copyright (C) 2001-2019 Peter Selinger.
 ```

If you get the version details, you have successfully compiled and installed `mkbitmap`. Next, make the equivalent of these steps work with WebAssembly.

{% Aside 'warning' %}
If you followed the preceding platform compilation steps, run `make clean` before proceeding with the WebAssembly compilation steps to remove previous compile artifacts.
{% endAside %}

## Compile `mkbitmap` to WebAssembly

[Emscripten](http://emscripten.org/) is a tool for compiling C/C++ programs to WebAssembly. Emscripten's [Building Projects](https://Emscripten.org/docs/compiling/Building-Projects.html) documentation states the following:

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

So essentially `./configure` becomes `emconfigure ./configure` and `make` becomes `emmake make`. The following demonstrates how to do this with `mkbitmap`.

Step 0, `make clean`:

```bash
$ make clean
Making clean in src
 rm -f potrace mkbitmap
test -z "" || rm -f
rm -rf .libs _libs
[…]
rm -f *.lo
```

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

The two last ones look promising, so `cd` into the `src/` directory. There are now also two new corresponding files, `mkbitmap` and `potrace`. For this article, only `mkbitmap` is relevant. The fact that they don't have the `.js` extension is a little confusing, but they are in fact JavaScript files, verifiable with a quick `head` call:

```bash
$ cd src/
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

You have successfully compiled `mkbitmap` to WebAssembly. Now the next step is to make it work in the browser.

## `mkbitmap` with WebAssembly in the browser

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

Start a local server that serves the `mkbitmap` directory and open it in your browser. You should see a prompt that asks you for input. This is as expected, since, [according to the tool's man page](https://potrace.sourceforge.net/mkbitmap.1.html#:~:text=A%20filename%20of%20%22%2D%22%20may%20be%20given%20to%20specify%20reading%20from%20standard%20input), _"[i]f no filename arguments are given, then mkbitmap acts as a filter, reading from standard input"_, which for Emscripten by default is a [`prompt()`](https://developer.mozilla.org/docs/Web/API/Window/prompt).

{% Aside 'warning' %}
Serving from the `file:` protocol doesn't work for `.wasm` files, you really need to start a local server.
{% endAside %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/DbDQJnxA4GylWKZcmlJK.png", alt="The mkbitmap app showing a prompt that asks for input.", width="800", height="600" %}

### Prevent automatic execution

To stop `mkbitmap` from executing immediately and instead make it wait for user input, you need to understand Emscripten's [`Module`](https://emscripten.org/docs/api_reference/module.html) object. `Module` is a global JavaScript object with attributes that Emscripten-generated code calls at various points in its execution.
You can provide an implementation of `Module` to control the execution of code.
When an Emscripten application starts up, it looks at the values on the `Module` object and applies them.

In the case of `mkbitmap`, set [`Module.noInitialRun`](https://emscripten.org/docs/api_reference/module.html#Module.noInitialRun) to `true` to prevent the initial run that caused the prompt to appear. Create a script called `script.js`, include it _before_ the `<script src="mkbitmap.js"></script>` in `index.html` and add the following code to `script.js`. When you now reload the app, the prompt should be gone.

```js
var Module = {
  // Don't run main() at page load
  noInitialRun: true,
};
```

### Create a modular build with some more build flags

To provide input to the app, you can use Emscripten's [file system](https://emscripten.org/docs/api_reference/Filesystem-API.html) support in `Module.FS`. The [Including File System Support](https://emscripten.org/docs/api_reference/Filesystem-API.html#including-file-system-support) section of the documentation states:

> Emscripten decides whether to include file system support automatically. Many programs don't need files, and file system support is not negligible in size, so Emscripten avoids including it when it doesn't see a reason to. That means that if your C/C++ code does not access files, then the `FS` object and other file system APIs will not be included in the output. And, on the other hand, if your C/C++ code does use files, then file system support will be automatically included.

Unfortunately `mkbitmap` is one of the cases where Emscripten does not automatically include file system support, so you need to explicitly tell it to do so. This means you need to follow the `emconfigure` and `emmake` steps described previously, with a couple more flags set via a `CFLAGS` argument. The following flags may come in useful for other projects, too.

{% Aside %}
When looking at the following commands, you might wonder about the missing space after `-s` that you may see in other online tutorials. Some `-s` options may require quoting, or the space between `-s` and the next argument may confuse `CMake`. To avoid those problems, I recommend you generally use the `-sX=Y` notation, that is, without a space.
{% endAside %}

- Set [`-sFILESYSTEM=1`](https://github.com/emscripten-core/emscripten/blob/fd9b4862cd3729b58ecc0f26ce03f9b9513615b0/src/settings.js#L918-L926) so file system support is included.
- Set [`-sEXPORTED_RUNTIME_METHODS=FS,callMain`](https://github.com/emscripten-core/emscripten/blob/fd9b4862cd3729b58ecc0f26ce03f9b9513615b0/src/settings.js#L862-L869) so `Module.FS` and `Module.callMain` are exported.
- Set [`-sMODULARIZE=1`](https://github.com/emscripten-core/emscripten/blob/fd9b4862cd3729b58ecc0f26ce03f9b9513615b0/src/settings.js#L1162-L1224) and [`-sEXPORT_ES6`](https://github.com/emscripten-core/emscripten/blob/fd9b4862cd3729b58ecc0f26ce03f9b9513615b0/src/settings.js#L1226-L1229) to generate a modern ES6 module.
- Set [`-sINVOKE_RUN=0`](https://github.com/emscripten-core/emscripten/blob/fd9b4862cd3729b58ecc0f26ce03f9b9513615b0/src/settings.js#L70-L74) to prevent the initial run that caused the prompt to appear.

Also, in this particular case, you need to set the [`--host`](https://www.gnu.org/software/autoconf/manual/autoconf-2.69/html_node/Hosts-and-Cross_002dCompilation.html) flag to `wasm32` to tell the `configure` script that you are compiling for WebAssembly.

The final `emconfigure` command looks like this:

```bash
$ emconfigure ./configure --host=wasm32 CFLAGS='-sFILESYSTEM=1 -sEXPORTED_RUNTIME_METHODS=FS,callMain -sMODULARIZE=1 -sEXPORT_ES6 -sINVOKE_RUN=0'
```

Do not forget to run `emmake make` again and copy the freshly created files over to the `mkbitmap` folder.

Modify `index.html` so that it only loads the ES module `script.js`, from which you then import the `mkbitmap.js` module.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>mkbitmap</title>
  </head>
  <body>
    <!-- No longer load `mkbitmap.js` here -->
    <script src="script.js" type="module"></script>
  </body>
</html>
```

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  const Module = await loadWASM();
  console.log(Module);
};

run();
```

When you open the app now in the browser, you should see the `Module` object logged to the DevTools console, and the prompt is gone, since the `main()` function of `mkbitmap` is no longer called at the start.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/VDD7kemQvnMsC7vsGnEr.png", alt="The mkbitmap app with a white screen, showing the Module object logged to the DevTools console.", width="800", height="502" %}

### Manually execute the main function

The next step is to manually call `mkbitmap`'s `main()` function by running `Module.callMain()`. The `callMain()` function takes an array of arguments, which match one-by-one what you would pass on the command line. If on the command line you would run `mkbitmap -v`, you would call `Module.callMain(['-v'])` in the browser. This logs the `mkbitmap` version number to the DevTools console.

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  const Module = await loadWASM();
  Module.callMain(['-v']);
};

run();
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/i4MTQgb47ColZt4pcAqr.png", alt="The mkbitmap app with a white screen, showing the mkbitmap version number logged to the DevTools console.", width="800", height="502" %}

### Redirect the standard output

 The standard output (`stdout`) by default is the console. However, you can redirect it to something else, for example, a function that stores the output to a variable. This means you can add the output to the HTML by setting the [`Module.print`](https://emscripten.org/docs/api_reference/module.html#Module.print) property.

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  let consoleOutput = 'Powered by ';
  const Module = await loadWASM({
    print: (text) => (consoleOutput += text),
  });
  Module.callMain(['-v']);
  document.body.textContent = consoleOutput;
};

run();
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/61iaKchi6p0NmbfipNhO.png", alt="The mkbitmap app showing the mkbitmap version number.", width="800", height="502" %}

### Get the input file into the memory file system

To get the input file into the memory file system, you need the equivalent of `mkbitmap filename` on the command line. To understand how I approach this, first some background on how `mkbitmap` expects its input and creates its output.

Supported input formats of `mkbitmap` are [PNM](https://en.wikipedia.org/wiki/Netpbm) ([PBM](https://en.wikipedia.org/wiki/Netpbm#PBM_example), [PGM](https://en.wikipedia.org/wiki/Netpbm#PGM_example), [PPM](https://en.wikipedia.org/wiki/Netpbm#PPM_example)) and [BMP](https://en.wikipedia.org/wiki/BMP_file_format). The output formats are PBM for bitmaps, and PGM for graymaps. If a [`filename`](https://potrace.sourceforge.net/mkbitmap.1.html#:~:text=Input/output%20options%3A-,filename,the%20input%20filename%20by%20changing%20its%20suffix%20to%20%22.pbm%22%20or%20%22.pgm%22.,-If%20the%20name) argument is given, `mkbitmap` will by default create an output file whose name is obtained from the input file name by changing its suffix to [`.pbm`](https://en.wikipedia.org/wiki/Netpbm#File_formats). For example, for the input file name `example.bmp`, the output file name would be `example.pbm`.

Emscripten provides a virtual file system that simulates the local file system, so that native code using synchronous file APIs can be compiled and run with little or no change.
For `mkbitmap` to read an input file as if it was passed as a `filename` command line argument, you need to use the [`FS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#id2) object that Emscripten provides.

The `FS` object is backed by an in-memory file system (commonly referred to as [MEMFS](https://emscripten.org/docs/api_reference/Filesystem-API.html#memfs)) and has a [`writeFile()`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.writeFile) function that you use to write files to the virtual file system. You use `writeFile()` as shown in the following code sample.

To verify the file write operation worked, run the `FS` object's [`readdir()`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.readdir) function with the parameter `'/'`. You will see `example.bmp` and a number of default files that [are always created automatically](https://emscripten.org/docs/api_reference/Filesystem-API.html#file-system-api).

Note that the previous call to `Module.callMain(['-v'])` for printing the version number was removed. This is due to the fact that `Module.callMain()` is a function that generally expects to only be run once.

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  const Module = await loadWASM();
  const buffer = await fetch('https://example.com/example.bmp').then((res) => res.arrayBuffer());
  Module.FS.writeFile('example.bmp', new Uint8Array(buffer));
  console.log(Module.FS.readdir('/'));
};

run();
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/HkJ5LUs5qcpP7Fwtu5iU.png", alt="The mkbitmap app showing an array of files in the memory file system, including example.bmp.", width="800", height="386" %}

### First actual execution

With everything in place, execute `mkbitmap` by running `Module.callMain(['example.bmp'])`. Log the contents of the MEMFS' `'/'` folder, and you should see the newly created `example.pbm` output file next to the `example.bmp` input file.

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  const Module = await loadWASM();
  const buffer = await fetch('https://example.com/example.bmp').then((res) => res.arrayBuffer());
  Module.FS.writeFile('example.bmp', new Uint8Array(buffer));
  Module.callMain(['example.bmp']);
  console.log(Module.FS.readdir('/'));
};

run();
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/vGFJy0pHyNPxdUUPdIcZ.png", alt="The mkbitmap app showing an array of files in the memory file system, including example.bmp and example.pbm.", width="800", height="502" %}

### Get the output file out of the memory file system

The `FS` object's [`readFile()`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.readFile) function enables getting the `example.pbm` created in the last step out of the memory file system. The function returns a `Uint8Array` that you convert to a `File` object and save to disk, as browsers don't generally support [PBM](https://en.wikipedia.org/wiki/Netpbm#File_formats) files for direct in-browser viewing.
(There are more elegant ways to [save a file](/patterns/files/save-a-file/), but using a dynamically created `<a download>` is the most widely supported one.) Once the file is saved, you can open it in your favorite image viewer.

```js
// This is `script.js`.
import loadWASM from './mkbitmap.js';

const run = async () => {
  const Module = await loadWASM();
  const buffer = await fetch('https://example.com/example.bmp').then((res) => res.arrayBuffer());
  Module.FS.writeFile('example.bmp', new Uint8Array(buffer));
  Module.callMain(['example.bmp']);
  const output = Module.FS.readFile('example.pbm', { encoding: 'binary' });
  const file = new File([output], 'example.pbm', {
    type: 'image/x-portable-bitmap',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
};

run();
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/RstHspfwZIn7FW9aetVW.png", alt="macOS Finder with a preview of the input .bmp file and the output .pbm file.", width="800", height="519" %}

### Add an interactive UI

To this point, the input file is hardcoded and `mkbitmap` runs with [default parameters](https://potrace.sourceforge.net/mkbitmap.1.html#:~:text=Normally%2C%20the%20following%20options%20are%20preselected%20by%20default%3A%20%2Df%204%20%2Ds%202%20%2D3%20%2Dt%200.45.). The final step is to let the user dynamically select an input file, tweak the `mkbitmap` parameters, and then run the tool with the selected options.

```js
// Corresponds to `mkbitmap -o output.pbm input.bmp -s 8 -3 -f 4 -t 0.45`.
Module.callMain(['-o', 'output.pbm', 'input.bmp', '-s', '8', '-3', '-f', '4', '-t', '0.45']);
```

The PBM image format is not particularly hard to parse, so with [some JavaScript code](https://github.com/megawac/pbm-formatter), you could even show a preview of the output image. See the [source code](https://glitch.com/edit/#!/mkbitmap) of the embedded [demo](https://mkbitmap.glitch.me/) below for one way to do this.


{% Glitch id='mkbitmap', height=950 %}

## Conclusion

Congratulations, you have successfully compiled `mkbitmap` to WebAssembly and made it work in the browser! There were some dead ends and you had to compile the tool more than once until it worked, but as I wrote above, that's part of the experience. Also remember the [StackOverflow's `webassembly` tag](https://stackoverflow.com/questions/tagged/webassembly) if you get stuck. Happy compiling!

## Acknowledgements

This article was reviewed by [Sam Clegg](https://www.linkedin.com/in/samclegg/) and [Rachel Andrew](https://rachelandrew.co.uk/).
