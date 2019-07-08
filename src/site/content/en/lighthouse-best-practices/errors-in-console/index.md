---
layout: post
title: Browser errors were logged to the console
description: |
  Learn about `errors-in-console` audit.
web_lighthouse:
  - errors-in-console
---

Lighthouse flags any browser errors logged to the console:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="errors-in-console.png" alt="Lighthouse audit showing browser errors in the console">
  <figcaption class="w-figcaption">
    Figure 1. Browser errors logged to the console.
  </figcaption>
</figure>

## How this audit fails

Most browsers ship with built-in developer tools.
These developer tools usually include a console.
The console gives you information about a page while that page is running.
Ultimately,
the messages you see in the console either come from the web developers who built the page,
or the browser itself.

When someone logs a message to the console,
they can indicate the importance, or "severity level" of the message.
An "error" message is an important message
representing an unresolved failure in the page.
In other words,
when you see an error, the page isn't running as intended.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="errors.png" alt="An example of console errors in Chrome DevTools">
  <figcaption class="w-figcaption">
    Figure 2. An example of console errors in Chrome DevTools.
  </figcaption>
</figure>

**Figure 2** shows two errors.
The top one comes from a web developer,
via a call to
[`console.error()`](https://developers.google.com/web/tools/chrome-devtools/console/console-reference#error).
The bottom one comes from the browser,
which indicates that a variable used in one of the page's scripts does not exist.
Lighthouse flags the browser errors.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to fix the browser errors

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

## More information

[Browser errors logged to console audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/errors-in-console.js)
