---
title: JavaScript import maps are now supported cross-browser
subhead: >
  With import maps, importing ES modules now becomes a lot better.
date: 2023-03-28
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/7WzXtb7u4gPnFnjLip2b.jpg
alt: Accurately lined up containers.
authors:
  - thomassteiner
tags:
  - blog
  - newly-interoperable
---

{% Aside 'celebration' %} This web feature is now available in all three browser engines!
{% endAside %}

ES modules are a modern way to include and reuse JavaScript code in web applications. They are
supported by modern browsers and provide several benefits over older, non-modular approaches to
JavaScript development.

A modern way to use ES modules is with the `<script type="importmap">` tag. This tag allows you to
define a mapping of external module names to their corresponding URLs, which makes it easier to
include and use external modules in your code.

To use the `<script type="importmap">` approach, you first need to add it to the `<head>` section of
your HTML document. Inside the tag, you can define a JSON object that maps module names to their
corresponding URLs. For example:

```html
<script type="importmap">
  {
    "imports": {
      "browser-fs-access": "https://unpkg.com/browser-fs-access@0.33.0/dist/index.modern.js"
    }
  }
</script>
```

This code defines a single external module named `"browser-fs-access"` and maps it to the URL of the
Browser-FS-Access library on the unpkg CDN. With this mapping in place, you can now use the `import`
keyword to include the Browser-FS-Access library in your code. Note that the `import` keyword is
only available inside a `script` tag with the `type="module"` attribute.

```html
<button>Select a text file</button>
<script type="module">
  import {fileOpen} from 'browser-fs-access';

  const button = document.querySelector('button');
  button.addEventListener('click', async () => {
    const file = await fileOpen({
      mimeTypes: ['text/plain'],
    });
    console.log(await file.text());
  });
</script>
```

Using the `<script type="importmap">` tag and the `import` keyword provides several benefits over
older, non-modular approaches to JavaScript development. It allows you to clearly and explicitly
specify the external modules your code depends on, which makes it easier to understand and maintain
your code. Overall, using ES modules with the `<script type="importmap">` tag is a modern and
powerful way to include and reuse JavaScript code in web applications. You can feature-detect
support as follows:

```js
if (HTMLScriptElement.supports('importmap')) {
  // The importmap feature is supported.
}
```

{% BrowserCompat 'html.elements.script.type.importmap' %}

## Further reading

- [Specification](https://wicg.github.io/import-maps/)
- [Using ES modules in browsers with import-maps](https://blog.logrocket.com/es-modules-in-browsers-with-import-maps/)

## Acknowledgements

Hero image by [CHUTTERSNAP](https://unsplash.com/@chuttersnap) on
[Unsplash](https://unsplash.com/photos/fN603qcEA7g).
