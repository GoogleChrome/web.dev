---
page_type: codelab
glitch_id: code-splitting-starter
title: Code-splitting
author: houssein
web_lighthouse:
- bootup-time
wf_blink_components: N/A
---

# Code-splitting

**Code-splitting** is the technique of splitting a JavaScript bundle into separate chunks. 

Splitting a bundle can allow us to only send the code needed for the initial route when the user loads an application. This can result in much faster page load times. Other chunks can then be **lazy loaded**, or provided to the user when they need them as they make their way through the app.

[webpack](https://webpack.js.org/) allows developers to split their bundles by using **dynamic imports**. Here's an example of how it can by used to import `lodash` when a form is submitted.

```
  form.addEventListener("submit", e => {
    e.preventDefault()
    import('lodash.sortby')
      .then(module => module.default)
      .then(someFunction())
      .catch(err => { alert(err) });
  });
```

Dynamic import is represented using the `import()` syntax, which is still in [proposal](https://github.com/tc39/proposal-dynamic-import) stages for the JavaScript specification. However, webpack has already included support for this syntax allowing us to dynamically import (lazy load) separate modules, or chunks, of our application.
