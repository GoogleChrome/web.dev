---
layout: post
title: Browser errors were logged to the console
description: |
  Learn how to identify and fix browser errors.
web_lighthouse:
  - errors-in-console
date: 2019-05-02
updated: 2019-08-28
---

Most browsers ship with built-in developer tools.
These developer tools usually include a [console](https://developers.google.com/web/tools/chrome-devtools/console/).
The console gives you information about the page that's currently running.

Messages logged in the console come from
either the web developers who built the page
or the browser itself.
All console messages have a severity level:
`Verbose`, `Info`, `Warning`, or `Error`.
An `Error` message means there's a problem on your page that you need to resolve.

## How the Lighthouse browser error audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags all browser errors logged to the console:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt="Lighthouse audit showing browser errors in the console", width="800", height="247", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to fix browser errors

Fix each browser error that Lighthouse reports
to ensure that your page runs as expected for all your users.

Chrome DevTools includes a couple tools
to help you track down the cause of errors:

- Below the text of each error, the DevTools Console shows the
  [call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)
  that caused the problematic code to execute.
- A link at the top-right of each error shows you the code
  that caused the error.

For example, this screenshot shows a page with two errors:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="An example of errors in the Chrome DevTools Console", width="800", height="505", class="w-screenshot w-screenshot--filled" %}
</figure>

In the example above, the first error comes from a web developer
via a call to
[`console.error()`](https://developers.google.com/web/tools/chrome-devtools/console/console-reference#error).
The second error comes from the browser and
indicates that a variable used in one of the page's scripts does not exist.

Below the text of each error,
the DevTools Console indicates the call stack in which the error appears.
For example, for the first error the Console indicates
that an `(anonymous)` function called the `init` function,
which called the `doStuff` function.
Clicking the `pen.js:9` link in the top-right of that error
shows you the relevant code.

Reviewing the relevant code for each error in this way can help you identify
and resolve possible problems.

If you can't figure out the cause of an error, try entering the error text
into a search engine.
If you can't find solutions to your problem,
try asking a question on [Stack Overflow](https://stackoverflow.com).

If you can't fix an error, consider wrapping it in
a [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) statement
to explicitly indicate in the code that you're aware of the issue.
You can also use the `catch` block to handle the error more gracefully.

## Resources

- [Source code for **Browser errors were logged to the console** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/errors-in-console.js)
- [Console Overview](https://developers.google.com/web/tools/chrome-devtools/console/)
- [Stack Overflow](https://stackoverflow.com/)
- [try…catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
