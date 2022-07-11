---
layout: pattern
title: How to copy text
subhead: Learn how to copy text to the clipboard.
description: Learn how to copy text to the clipboard.
date: 2022-07-11
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: Clipboard with shopping list
height: 800
---

Cutting and pasting text is one of the most commonly used features of apps in general and desktop applications in particular. How do I copy text on the web? There's an old way and a new way. And it depends on which browser is used.

## The modern way

### Using the Async Clipboard API

The [`Clipboard.writeText()`](​​https://developer.mozilla.org/docs/Web/API/Clipboard/writeText) method takes a string and returns a Promise that resolves when text is successfully written to the clipboard. `Clipboard.writeText()` can only be used from the `window` object that has focus.

{% BrowserCompat 'api.Clipboard.writeText' %}

## The classic way

### Using `document.execCommand()`

Calling [`document.execCommand('copy')`](https://developer.mozilla.org/docs/Web/API/Document/execCommand#copy) returns a boolean value that indicates whether the copy was successful. Call this command inside of a user gesture such as a [click handler](https://developer.mozilla.org/docs/Web/API/Element/click_event#javascript). This approach has limitations when compared to the Async Clipboard API. The `execCommand()` method only works with DOM elements. Because it's synchronous, copying large amounts of data, especially data that must be transformed or sanitized in some way, can block the page.

{% BrowserCompat 'api.Document.execCommand' %}

## Progressive enhancement

```js
const copyButton = document.querySelector('#copyButton');
const out = document.querySelector('#out');

if ('clipboard' in navigator) {
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(out.value)
    .then(() => {
      console.log('Text copied');
    })
    .catch((err) => console.error(err.name, err.message));
  });
} else {
  copyButton.addEventListener('click', () => {
    const textArea = document.createElement('textarea');
    textArea.value = out.value;
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const success = document.execCommand('copy');
      console.log(`Text copy was ${success ? 'successful' : 'unsuccessful'}.`);
    } catch (err) {
      console.error(err.name, err.message);
    }
    document.body.removeChild(textArea);
  });
}
```

## Further reading

- [Unblocking clipboard access](/async-clipboard/) (the modern way)
- [Cut and copy commands](https://developer.chrome.com/blog/cut-and-copy-commands/) (the classic way)
