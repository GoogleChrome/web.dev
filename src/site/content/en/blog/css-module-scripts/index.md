---
title: Using CSS Module Scripts to import stylesheets
subhead: >
  Learn how to use CSS module scripts to import CSS stylesheets using the same syntax as JavaScript
  modules.
description: >
  Learn how to use CSS module scripts to import CSS stylesheets using the same syntax as JavaScript
  modules.
authors:
  - dandclark
date: 2021-08-17
hero: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/Hu0ljomDqgb0y7h7REp6.jpg
alt: A stack of multicolored shipping containers.
tags:
  - blog
  - css
  - dom
  - javascript
  - modules
---

With the new CSS module scripts feature, you can load CSS style sheets with `import` statements,
just like [JavaScript
modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules). The style sheets
can then be applied to documents or [shadow
roots](https://developer.mozilla.org/docs/Web/API/ShadowRoot) in the same manner as
[constructable
stylesheets](/constructable-stylesheets/). This can
be more convenient and [more
performant](https://dandclark.github.io/json-css-module-notes/#css-module-performancememory-examples)
than other ways of importing and applying CSS.

## Browser Support

CSS module scripts are available by default in Chrome and Edge in version 93.

Support in Firefox and Safari is not yet available. Implementation progress can be tracked at the
[Gecko bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1720570) and [WebKit
bug](https://bugs.webkit.org/show_bug.cgi?id=227967), respectively.

## Prerequisites

- Familiarity with [JavaScript
  modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).
- Familiarity with [constructable
  stylesheets](/constructable-stylesheets/).

## Using CSS module scripts

Import a CSS module script and apply it to a document or a shadow root like this:

```js
import sheet from './styles.css' assert { type: 'css' };
document.adoptedStyleSheets = [sheet];
shadowRoot.adoptedStyleSheets = [sheet];
```

The default export of a CSS module script is a [constructable
stylesheet](/constructable-stylesheets/) whose
contents are those of the imported file. Like any other constructable stylesheet, it is applied to
documents or shadow roots using
[`adoptedStyleSheets`](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).

Unlike other ways of applying CSS from JavaScript, there is no need to create `<style>` elements or
mess with JavaScript strings of CSS text.

CSS modules also have some of the same benefits as JavaScript modules.
- **Deduplication:** if the same CSS file is imported from multiple places in an application, it will
  still only be fetched, instantiated, and parsed a single time.
- **Consistent order of evaluation:** when the importing JavaScript is running, it can rely on the
  stylesheet it imports having already been fetched and parsed.
- **Security:** modules are fetched with [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS)
  and use strict MIME-type checking.

## Import Assertions (what's with the '`assert`'?)

The `assert { type: 'css' }` part of the `import` statement is an [import
assertion](https://v8.dev/features/import-assertions). This is required; without it, the `import` is
treated as a normal JavaScript module import, and will fail if the imported file has a
non-JavaScript MIME type.

```js
import sheet from './styles.css'; // Failed to load module script:
                                  // Expected a JavaScript module
                                  // script but the server responded
                                  // with a MIME type of "text/css".
```

## Dynamically imported stylesheets

You can also import a CSS module using [dynamic
import](https://v8.dev/features/dynamic-import#dynamic), with a new second parameter for the `type:
'css'` import assertion:

```js
const cssModule = await import('./style.css', {
  assert: { type: 'css' }
});
document.adoptedStyleSheets = [cssModule.default];
```

{% Aside 'gotchas' %}
Note that it's `cssModule.default` (not `cssModule` itself) that is added to `adoptedStyleSheets`.
This is because the object returned from dynamic `import()` is a module namespace object. The
CSSStyleSheet is the default export of the module, so it's accessed at `cssModule.default`.
{% endAside %}

## `@import` rules not yet allowed

Currently CSS [`@import` rules](https://developer.mozilla.org/docs/web/css/@import) don't work
in constructable stylesheets, including CSS module scripts. If `@import` rules are present in a
constructable stylesheet, those rules will be ignored.

```css
/* atImported.css */
div {
    background-color: blue;
}
```

```css
/* styles.css */
@import url('./atImported.css'); /* Ignored in CSS module */
div {
    border: 1em solid green;
}
```

```html
<!-- index.html -->
<script type="module">
    import styles from './styles.css' assert { type: "css" };
    document.adoptedStyleSheets = [styles];
</script>
<div>This div will have a green border but no background color.</div>
```

Support for `@import` in CSS module scripts may be added to the specification. Track this
specification discussion in [the GitHub issue](https://github.com/WICG/webcomponents/issues/870).
