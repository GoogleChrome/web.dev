---
layout: post
title: What is WebAssembly and where did it come from?
authors:
  - thomassteiner
date: 2023-06-29
# updated: 2023-06-29
description: >
  An introduction to WebAssembly (sometimes abbreviated Wasm), the portable binary-code format and
  corresponding text format for executable programs as well as software interfaces for facilitating
  interactions between such programs and their host environment.
tags:
  - webassembly
---

Ever since the web became a platform not just for documents but also for apps, some of the most advanced apps have pushed web browsers to their limits. The approach of going "closer to the metal" by interfacing with lower-level languages in order to improve performance is encountered in many higher-level languages. As an example, Java has the [Java Native Interface](https://web.archive.org/web/20080330002620/http://today.java.net/pub/a/today/2006/10/19/invoking-assembly-language-from-java.html). For JavaScript, this lower-level language is WebAssembly. In this article, you will discover what assembly language is, and why it can be useful on the web, then learn how WebAssembly was created via the interim solution of asm.js.

## Assembly language

Have you ever programmed in assembly language? In computer programming, assembly language, often referred to simply as Assembly and commonly abbreviated as ASM or asm, is _any_ low-level programming language with a very strong correspondence between the instructions in the language and the architecture's machine code instructions.

For example, looking at the [Intel® 64 and IA-32 Architectures](https://software.intel.com/en-us/download/intel-64-and-ia-32-architectures-sdm-combined-volumes-1-2a-2b-2c-2d-3a-3b-3c-3d-and-4) (PDF), the [`MUL`](https://www.felixcloutier.com/x86/mul) instruction (for **mul**tiplication) performs an unsigned multiplication of the first operand (destination operand) and the second operand (source operand), and stores the result in the destination operand. Very simplified, the destination operand is an implied operand located in register `AX`, and the source operand is located in a general-purpose register like `CX`. The result is stored again in register `AX`. Consider the following x86 code example:

```bash
mov ax, 5  ; Set the value of register AX to 5.
mov cx, 10 ; Set the value of register CX to 10.
mul cx     ; Multiply the value of register AX (5)
           ; and the value of register CX (10), and
           ; store the result in register AX.
```

For comparison, if tasked with the objective of multiplying 5 and 10, you would probably write code similar to the following in JavaScript:

```js
const factor1 = 5;
const factor2 = 10;
const result = factor1 * factor2;
```

The advantage of going the assembly route is that such low-level and machine-optimized code is much more efficient than high-level and human-optimized code. In the preceding case it doesn't matter, but you can imagine that for more complex operations, the difference can be significant.

As the name suggests, x86 code is dependent on the x86 architecture. What if there were a way of writing assembly code that was not dependent on a specific architecture, but that would inherit the performance benefits of assembly?

## asm.js

The first step to writing assembly code with no architecture dependencies was [asm.js](http://asmjs.org/spec/latest/), a strict subset of JavaScript that could be used as a low-level, efficient target language for compilers. This sub-language effectively described a sandboxed virtual machine for memory-unsafe languages like C or C++. A combination of static and dynamic validation allowed JavaScript engines to employ an ahead-of-time (AOT) optimizing compilation strategy for valid asm.js code. Code written in statically-typed languages with manual memory management (such as C) was translated by a source-to-source compiler such as the [early Emscripten](https://web.archive.org/web/20130420191339/http://kripken.github.io/mloc_emscripten_talk/) (based on LLVM).

Performance was improved by limiting language features to those amenable to AOT. Firefox&nbsp;22 was the first browser to [support asm.js](https://www.mozilla.org/firefox/22.0/releasenotes/), released under the name [OdinMonkey](https://blog.mozilla.org/luke/2013/03/21/asm-js-in-firefox-nightly/). Chrome added [asm.js support](https://v8.dev/blog/v8-release-61#asm.js-is-now-validated-and-compiled-to-webassembly) in version&nbsp;61. While asm.js still works in browsers, it has been superseded by WebAssembly. The reason to use asm.js at this point would be as an alternative for browsers that don't have WebAssembly support.

## WebAssembly

WebAssembly is a low-level assembly-like language with a compact binary format that runs with near-native performance and provides languages such as C/C++ and Rust, and many more with a compilation target so that they run on the web. Support for memory-managed languages such as Java, Kotlin, and Dart is in the works and should become available soon. WebAssembly is designed to run alongside JavaScript, allowing both to work together.

Apart from the browser, WebAssembly programs also run in other runtimes thanks to [WASI](https://wasi.dev/), the WebAssembly System Interface, a modular system interface for WebAssembly. WASI is created to be portable across operating systems, with the objective of being secure and the ability to run in a sandboxed environment.

WebAssembly code (binary code, that is, bytecode) is intended to be run on a portable virtual stack machine (VM). The bytecode is designed to be faster to parse and execute than JavaScript and to have a compact code representation.

Conceptual execution of instructions proceeds by way of a traditional program counter that advances through the instructions. In practice, most Wasm engines compile the Wasm bytecode to machine code, and then execute that. Instructions fall into two categories:

- **Control instructions** that form control constructs and pop their argument value(s) off the stack, may change the program counter, and push result value(s) onto the stack.
- **Simple instructions** that pop their argument value(s) from the stack, apply an operator to the values, and then push the result value(s) onto the stack, followed by an implicit advancement of the program counter.

Going back to the example before, the following WebAssembly code would be equivalent to the x86 code from the beginning of the article:

```bash
i32.const 5  ; Push the integer value 5 onto the stack.
i32.const 10 ; Push the integer value 10 onto the stack.
i32.mul      ; Pop the two most recent items on the stack,
             ; multiply them, and push the result onto the stack.
```

While asm.js is implemented all in software, that is, its code can run in any JavaScript engine (even if unoptimized), WebAssembly required new functionality that all browser vendors agreed on. [Announced in 2015](https://github.com/WebAssembly/design/issues/150) and first released in March 2017, WebAssembly became a [W3C recommendation](https://www.w3.org/TR/wasm-core-1/) on December&nbsp;5, 2019. The W3C maintains the standard with contributions from all major browser vendors and other interested parties. Since 2017, browser support is universal.

{% BrowserCompat 'javascript.builtins.WebAssembly' %}

WebAssembly has two representations: [textual](https://developer.mozilla.org/docs/WebAssembly/Understanding_the_text_format) and [binary](https://developer.mozilla.org/docs/WebAssembly/Text_format_to_wasm). What you see above is the textual representation.

### Textual representation

The textual representation is based on [S-expressions](https://developer.mozilla.org/docs/WebAssembly/Understanding_the_text_format#s-expressions) and commonly uses the file extension `.wat` (for **W**eb**A**ssembly **t**ext format). If you really wanted to, you could write it by hand. Taking the multiplication example from above and making it more useful by no longer hardcoding the factors, you can probably make sense of the following code:

```bash
(module
  (func $mul (param $factor1 i32) (param $factor2 i32) (result i32)
    local.get $factor1
    local.get $factor2
    i32.mul)
  (export "mul" (func $mul))
)
```

### Binary representation

The binary format that uses the file extension `.wasm` is not meant for human consumption, let alone human creation. Using a tool like [wat2wasm](https://webassembly.github.io/wabt/demo/wat2wasm/), you can convert the above code to the following binary representation. (The comments are not usually part of the binary representation, but added by the wat2wasm tool for better understandability.)

```bash
0000000: 0061 736d                             ; WASM_BINARY_MAGIC
0000004: 0100 0000                             ; WASM_BINARY_VERSION
; section "Type" (1)
0000008: 01                                    ; section code
0000009: 00                                    ; section size (guess)
000000a: 01                                    ; num types
; func type 0
000000b: 60                                    ; func
000000c: 02                                    ; num params
000000d: 7f                                    ; i32
000000e: 7f                                    ; i32
000000f: 01                                    ; num results
0000010: 7f                                    ; i32
0000009: 07                                    ; FIXUP section size
; section "Function" (3)
0000011: 03                                    ; section code
0000012: 00                                    ; section size (guess)
0000013: 01                                    ; num functions
0000014: 00                                    ; function 0 signature index
0000012: 02                                    ; FIXUP section size
; section "Export" (7)
0000015: 07                                    ; section code
0000016: 00                                    ; section size (guess)
0000017: 01                                    ; num exports
0000018: 03                                    ; string length
0000019: 6d75 6c                          mul  ; export name
000001c: 00                                    ; export kind
000001d: 00                                    ; export func index
0000016: 07                                    ; FIXUP section size
; section "Code" (10)
000001e: 0a                                    ; section code
000001f: 00                                    ; section size (guess)
0000020: 01                                    ; num functions
; function body 0
0000021: 00                                    ; func body size (guess)
0000022: 00                                    ; local decl count
0000023: 20                                    ; local.get
0000024: 00                                    ; local index
0000025: 20                                    ; local.get
0000026: 01                                    ; local index
0000027: 6c                                    ; i32.mul
0000028: 0b                                    ; end
0000021: 07                                    ; FIXUP func body size
000001f: 09                                    ; FIXUP section size
; section "name"
0000029: 00                                    ; section code
000002a: 00                                    ; section size (guess)
000002b: 04                                    ; string length
000002c: 6e61 6d65                       name  ; custom section name
0000030: 01                                    ; name subsection type
0000031: 00                                    ; subsection size (guess)
0000032: 01                                    ; num names
0000033: 00                                    ; elem index
0000034: 03                                    ; string length
0000035: 6d75 6c                          mul  ; elem name 0
0000031: 06                                    ; FIXUP subsection size
0000038: 02                                    ; local name type
0000039: 00                                    ; subsection size (guess)
000003a: 01                                    ; num functions
000003b: 00                                    ; function index
000003c: 02                                    ; num locals
000003d: 00                                    ; local index
000003e: 07                                    ; string length
000003f: 6661 6374 6f72 31            factor1  ; local name 0
0000046: 01                                    ; local index
0000047: 07                                    ; string length
0000048: 6661 6374 6f72 32            factor2  ; local name 1
0000039: 15                                    ; FIXUP subsection size
000002a: 24                                    ; FIXUP section size
```

### Compiling to WebAssembly

As you see, neither `.wat` nor `.wasm` are particularly very human-friendly. This is where a compiler like [Emscripten](https://emscripten.org/) comes into play.
It lets you compile from higher-level languages like C and C++. There are other compilers for other languages like Rust and many more. Consider the following C code:

```c
#include <stdio.h>

int main() {
  printf("Hello World\n");
  return 0;
}
```

Usually, you would compile this C program with the compiler `gcc`.

```bash
$ gcc hello.c -o hello
```

With [Emscripten installed](https://emscripten.org/docs/getting_started/downloads.html), you compile it to WebAssembly using the `emcc` command and almost the same arguments:

```bash
$ emcc hello.c -o hello.html
```

This will create a `hello.wasm` file and the HTML wrapper file `hello.html`. When you serve the file `hello.html` from a web server, you will see `"Hello World"` printed to the DevTools console.

There's also a way to compile to WebAssembly without the HTML wrapper:

```bash
$ emcc hello.c -o hello.js
```

As before, this will create a `hello.wasm` file, but this time a `hello.js` file instead of the HTML wrapper. To test, you run the resulting JavaScript file `hello.js` with, for example, Node.js:

```bash
$ node hello.js
Hello World
```

### Learn more

This brief introduction to WebAssembly is just the tip of the iceberg.
Learn more about WebAssembly in the [WebAssembly documentation](https://developer.mozilla.org/docs/WebAssembly) on MDN
and consult the [Emscripten documentation](https://emscripten.org/docs/index.html). Truth be told, working with WebAssembly can feel a bit like the [How to draw an owl meme](https://knowyourmeme.com/memes/how-to-draw-an-owl), especially since web developers familiar with HTML, CSS, and JavaScript are not necessarily versed in the to-be-compiled-from languages like C. Luckily there are channels like [StackOverflow's `webassembly` tag](https://stackoverflow.com/questions/tagged/webassembly) where experts are often happy to help if you ask nicely.

{% Aside %}
Move on to the article [Compiling `mkbitmap` to WebAssembly](/compiling-mkbitmap-to-webassembly/) for a beginner-friendly introduction to compiling a not completely trivial but also not overly complex C program to WebAssembly. At the example of [`mkbitmap`](https://potrace.sourceforge.net/mkbitmap.1.html), this article shows how to use a Wasm program as a library in JavaScript that works with files as input and that outputs images.
{% endAside %}

## Acknowledgements

This article was reviewed by [Jakob Kummerow](https://github.com/jakobkummerow), [Derek Schuff](https://www.linkedin.com/in/derek-schuff-117b11b1), and [Rachel Andrew](https://rachelandrew.co.uk/).
