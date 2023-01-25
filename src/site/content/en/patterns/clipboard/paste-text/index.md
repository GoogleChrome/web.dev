---
layout: pattern
title: How to paste text
date: 2022-10-10
authors:
  - harrytheodoulou
height: 800
description: >
  Pasting text into the browser consists of using the readText() method of the Async Clipboard API.
---

## The modern way

### Using the Async Clipboard API

To read text from the user's clipboard programmatically, for example, after a button click, you can use the [`readText()`](https://developer.mozilla.org/docs/Web/API/Clipboard/readText) method of the [Async Clipboard API](https://developer.mozilla.org/docs/Web/API/Clipboard_API). If permissions to read clipboard have not been granted yet, the call to `navigator.clipboard.readText()` will request it upon the first call to the method.

```js
const pasteButton = document.querySelector('#paste-button');

pasteButton.addEventListener('click', async () => {
   try {
     const text = await navigator.clipboard.readText()
     document.querySelector('textarea').value += text;
     console.log('Text pasted.');
   } catch (error) {
     console.log('Failed to read clipboard');
   }
});
```

{% BrowserCompat 'api.Clipboard.readText' %}

## The classic way

### Using `document.execCommand()`

By using the [`document.execCommand('paste')`](https://developer.mozilla.org/docs/Web/API/Document/execCommand#paste) you can paste the clipboard content at the insertion point (currently focused HTML element). The `execCommand` method returns a boolean that indicates whether the `paste` event was successful. However this method comes with limitations, for example because it's synchronous, pasting large amounts of data can block the page.

```js
pasteButton.addEventListener('click', () => {
  document.querySelector('textarea').focus();
  const result = document.execCommand('paste')
  console.log('document.execCommand result: ', result);
})
```

{% BrowserCompat 'api.Document.execCommand' %}

## Progressive enhancement

```js
pasteButton.addEventListener('click', async () => {
   try {
     const text = await navigator.clipboard.readText()
     document.querySelector('textarea').value += text;
     console.log('Text pasted.');
   } catch (error) {
     console.log('Failed to read clipboard. Using execCommand instead.');
     document.querySelector('textarea').focus();
     const result = document.execCommand('paste')
     console.log('document.execCommand result: ', result);
   }
});
```
## Further reading

- [Clipboard API on MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)
- [Unblocking clipboard access](/async-clipboard/#readtext())

## Demo
