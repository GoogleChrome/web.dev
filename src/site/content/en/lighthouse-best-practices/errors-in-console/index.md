---
layout: post
title: Browser errors were logged to the console
description: |
  Learn how to identify and fix browser errors.
web_lighthouse:
  - errors-in-console
updated: 2019-08-28
---

Most browsers ship with built-in developer tools.
These developer tools usually include a [console](https://developers.google.com/web/tools/chrome-devtools/console/).
The console gives you information about the page that's currently running.

Messages logged in the console have a severity level:
either `Verbose`, `Info`, `Warning`, or `Error`.
An `Error` message means there's a problem on your page that you need to resolve.

## How the browser error audit fails

Lighthouse flags all browser errors logged to the console:

<figure class="w-figure">
  <img class="w-screenshot" src="errors-in-console.png" alt="Lighthouse audit showing browser errors in the console">
</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to fix the browser errors

The messages you see in the console come from
either the web developers who built the page or the browser itself.

For example, this screenshot shows a page with two errors:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="errors.png" alt="An example of console errors in Chrome DevTools">
</figure>

In the example above, the first error comes from a web developer,
via a call to
[`console.error()`](https://developers.google.com/web/tools/chrome-devtools/console/console-reference#error).
The second error comes from the browser
and indicates that a variable used in one of the page's scripts doesn't exist.

Fix each of the errors that Lighthouse reports
to ensure that your page runs as expected for all of your users.
If the cause of the error is not clear to you, copy the error text and
paste it into a search engine.
If you can't find solutions to your problem,
try asking a question on [Stack Overflow](https://stackoverflow.com).

Chrome DevTools can help you track down the cause of the errors.
Take the top error in **Figure 2** for example.
Clicking the `pen.js:9` link in the top-right of that error shows you the code
that caused that error.
Below the text `this is an example of a console error...`,
there is the [call stack](https://en.wikipedia.org/wiki/Call_stack)
that caused the problematic code to execute.

The bottom function `(anonymous)` called the `init` function,
which called the `doStuff` function.
Open the Chrome DevTools **Console** by pressing
<kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>J</kbd> (Mac) or
<kbd>Control</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> (Windows, Linux).
See [Using The Console](https://developers.google.com/web/tools/chrome-devtools/console/) to learn more.

If you can't fix the errors, at least consider wrapping them in
[`try...catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) statements
to explicitly indicate in the code that you're aware of the issue.
You can also use the `catch` block to handle the error situation more gracefully.

## Resources

[Source code for **Browser errors were logged to the console** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/errors-in-console.js)
