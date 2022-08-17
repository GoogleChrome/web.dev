---
layout: post
title: Global and local variable scope
description: Learn about scope and how it works in JavaScript. 
date: 2022-04-14
---

In this article, you'll learn about scope and how it works in JavaScript. 

Scope is a fundamental concept in JavaScript and other programming languages that defines the context in which variables are accessed and used. It becomes more useful and applicable to your code as you continue to learn JavaScript and work more with variables. 

Scope can help you:

-  **Use memory more efficiently:** Scope provides the ability to load variables only when needed. If a variable is out of scope, you don't need to make it available to the code that's currently executing.
-  **Find and fix bugs more easily:** Isolating variables with local scope makes it easier to troubleshoot bugs in your code because, unlike global variables, you can trust that code from an outside scope can't manipulate locally scoped variables.
-  **Create small blocks of reusable code:** For example, you can write a [pure function](https://en.wikipedia.org/wiki/Pure_function) that doesn't rely on outside scope. You can easily move such a function elsewhere with minimal changes.

## What is scope?

A variable's scope determines from where within the code you can use a variable.

JavaScript defines variables of global or local scope: 

-  Variables with [global scope](https://developer.mozilla.org/docs/Glossary/Global_scope) are available from all other scopes within the JavaScript code.
-  Variables with [local scope](https://developer.mozilla.org/docs/Glossary/Local_scope) are available only within a specific local context and are created by keywords, such as `var`, `let`, and `const`. If you use the `var`, `let` or `const` keywords to create a variable within a function, that variable has local scope.

Later sections in this article discuss block and lexical scope:

-  [Block scope](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#block_statement) variables are available locally to a block as determined by the location of the curly brackets where the block statement is defined. Only variables declared with the `let` or `const` keywords have block scope.
-  [Lexical scope](https://developer.mozilla.org/docs/Web/JavaScript/Closures#lexical_scoping) uses the location where a variable is declared in the source code to determine where that variable is available. You use closures to give an enclosed function access to variables referenced in the outer scope known as the lexical environment.

When a variable is accessed within its scope, JavaScript returns its assigned value or otherwise produces an error. 

To declare a variable:

-  Use the `var`, `const`, or `let` keywords to declare local or global-scope variables.
-  Use the `const` or `let` keywords to declare block-scope variables.

When you declare a `var` variable in a function, the declaration makes the variable available to the nearest enclosing function. You can't use the `var` keyword to declare variables with block scope.

## Scope examples

This example demonstrates global scope because the `greeting` variable is declared outside of any function or block, which makes its value available to all code in the current document:

```js
const greeting = 'hello';
console.log(greeting); // 'hello'
```

In the global-scope example, the `greeting` variable is assigned a `hello` value. 

This example demonstrates local scope because it declares the `greeting` variable with the `let` keyword within a function. The `greeting` variable is a locally scoped variable and isn't available outside the function.

```js
function greet() {
  let greeting = 'Hello World!';
  console.log(greeting);
}
```

This example demonstrates block scope because it declares the `greeting` variable within a block so that the variable is accessible only inside the curly brackets:

```js
if (true) {
   const greeting = 'hello';
}

console.log(greeting); // ReferenceError: greeting is not defined
```

Notice that when the `console.log` function tries to output the value of the `greeting` variable, JavaScript returns a `ReferenceError` error message instead of the expected `hello` message. Why? 

An error is returned because the `greeting` variable has block scope and the nearest block is part of the `if` conditional statement. You can't access the `let` and `const` variables that you declare inside a block from outside the block. Thus, you can only access the `greeting` variable within the curly brackets, which specifies the block scope. 

This example fixes the error because it moves the `console.log(message)` method inside the curly brackets. The updated code relocates the `console.log(message)` method inside the block.

```js
if (true) {
   const greeting = 'hello';
   console.log(greeting);
}
```

## Types of scope

### Global scope

You can access variables with global scope from anywhere in the program.

Consider an HTML file that imports two JavaScript files: `file-1.js` and `file-2.js`: 

```js
<script src="file-1.js"></script>
<script src="file-2.js"></script>
```

In this example, the `globalMessage` variable has a global scope and it's written outside of a function. During run and execution, you can access the value of the `globalMessage` variable from anywhere in the JavaScript program. 

You can see the contents of the `file-1.js` and `file-2.js` files in this code snippet. Notice the availability of the `globalMessage` variable in both files.

```js
// file-1.js
function hello() {
	var localMessage = 'Hello!';
}

var globalMessage = 'Hey there!';

// file-2.js
console.log(localMessage); // localMessage is not defined
console.log(globalMessage); // Hey there!
```

There's another type of scope that's not heavily discussed in this article. If you create a variable within a JavaScript [module](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) but outside of a function or block, it doesn't have global scope, but rather module scope. Variables with module scope are available anywhere within the current module, but aren't available from other files or modules. To make a module-scoped variable available to other files, you must [export](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) it from the module where it's created and then [import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) it from the module that needs to access the variable.

### Local scope and function scope

When you create variables in a JavaScript function with the `var`, `let` or `const` keywords, the variables are local to the function, so you can only access them from within the function. Local variables are created when a function starts and are effectively deleted when the function execution finishes.

This example declares the `total` variable in the `addNumbers()` function. You can only access the `a`, `b,` and `total` variables within the `addNumbers()` function. 

```js
function addNumbers(a, b) {
	const total = a + b;
}

addNumbers(3, 4);
```

You can use the `let` and `const` keywords to name variables. When you use the `let` keyword, JavaScript can update the variable. However, with the `const` keyword, the variable remains constant.

```js
var variable1 = 'Declared with var';
var variable1 = 'Redeclared with var';
variable1; // Redeclared with var

let variable2 = 'Declared with let. Cannot be redeclared.';
variable2 = 'let cannot be redeclared, but can be updated';
variable2; // let cannot be redeclared, but can be updated

const variable3 = 'Declared with const. Cannot be redeclared or updated';
variable3; // Declared with const. Cannot be redeclared or updated
```

### Block scope

[Blocks](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/block) are used to group a single statement or a set of statements together. You can use the `const` or `let` keywords to declare a block-scope local variable. Note that you can't use the `var` keyword to declare variables with block scope.

For example, in this block, the scope for the `name` variable and its `"Elizabeth"` value is contained within the curly braces. Variables within a block scope aren't available outside of the block.

```js
{
	const name = "Elizabeth";
}
```

You can use block-scoped variables within `if`, `for`, or `while` statements.

Take note of the two `for` loops within this code snippet. One `for` loop uses the `var` keyword to declare the initializer variable, which increments through the numbers `0`, `1`, and `2`. The other `for` loop uses the `let` keyword to declare the initializer variable. 

```js
for (var i = 0; i < 2; i++) {
	// ...
}

console.log(i); // 2

for (let j = 0; j < 2; j++) {
	// ...
}

console.log(j); // The j variable isn't defined.
```

In the previous code example, you may notice that the `i` variable in the first `for` loop leaked outside the `for` loop and still retains a `2` value because the `var` keyword doesn't use block scope. The issue is fixed in the second `for` loop in which the `j` variable declared with the `let` keyword is scoped to the block of the `for` loop and doesn't exist after the `for` loop finishes.

## Reuse of a variable name in a different scope

Scope can isolate a variable within a function, even when you reuse the same variable name elsewhere in a different scope. 

This example shows you how the use of scope lets you reuse the same variable name in different functions:

```js
function listOne() {
    let listItems = 10;
    console.log(listItems); // 10
}

function listTwo() {
   let listItems = 20;
   console.log(listItems); // 20
}

listOne();
listTwo();
```

The `listItems` variables in the `listOne()` and `listTwo()` functions are assigned the expected values and so don't clash with each other.

## Closures and lexical scope

[Closures](https://developer.mozilla.org/docs/Web/JavaScript/Closures) refer to an enclosed function in which an inner function can access the outer function scope, which is also known as the lexical environment. Thus, in JavaScript, you use closures to let functions reference the outer lexical environment, which lets code inside a function reference variables declared outside the function. In fact, you can code a chain of references to outer lexical environments so that a function is called by a function, which in turn is called by another function. 

In this example, the code forms a closure with the lexical environment that's created when the `outer()` function is invoked, which closes over the `hello` variable. Thus, the `hello` variable is used within the `setTimeout` callback function. 

```js
function outer() {
    const hello = 'world';

    setTimeout(function () {
        console.log('Within the closure!', hello)
    }, 100);
}

outer();
```

With lexical scope, the scope is determined during compilation of the source code, not at runtime. To learn more about the lexical environment, see [Lexical scoping and Closure](https://developer.mozilla.org/docs/Web/JavaScript/Closures#lexical_scoping).  

## Modules

JavaScript [modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) help to organize JavaScript code. Used properly, they provide an effective structure to your codebase and help with code reuse. Rather than use global variables to share variables across different files, JavaScript modules provide a technique to [export](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) and [import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) variables.

```js
// hello.js file
function hello() {
  return 'Hello world!';
}

export { hello };

// app.js file
import { hello } from './hello.js';

console.log(hello()); // Hello world!
```

## Scope visualizer demo

Scope is a fundamental concept that every JavaScript developer should understand. To better understand the scope system, you can try to write your own code with the [JS Scope Visualizer](https://js-scope-visualizer.firebaseapp.com/#visualizer). The demo uses coloration in the code to help you visualize JavaScript scopes.

## Conclusion

This article introduces different types of scope. JavaScript scope is one of the more advanced concepts within web development, so it's great that you have read through this content and taken time to understand this topic.

Scope is not a user-facing feature. It only affects the web developer who writes code, but knowledge of how scope works can help you to fix bugs when they arise.