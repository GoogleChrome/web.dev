---
layout: post
title: Is it :modal?
subhead: This handy CSS pseudo-selector gives you a way to select elements that are modal.
authors:
  - jheyy
description: This handy CSS pseudo-selector gives you a way to select elements that are modal.
date: 2022-09-02
thumbnail: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/xyyPgtSNjfzhcOGPn5lG.jpg
alt: Orange sheets of paper lie on a green school board and form a chat bubble with three crumpled papers.
tags:
  - blog
  - css
  - ux
  - newly-interoperable
---
{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% endAside %}

CSS `:modal` is available from Chrome 105. This handy pseudo-selector gives you a way to select elements that are "modal", and to avoid managing classes in JavaScript by providing a way to detect modal elements.

{% BrowserCompat 'css.selectors.modal' %}

Two types of elements are currently classed as `:modal`:

- Dialog elements using the `showModal` method.
- Elements that are in full-screen mode.

How can you use it? This example sets the scale of all `<dialog>` elements that are `:modal`.

```css
dialog:modal {
 scale: 2;
}
```

Consider this demo where you can show a `<dialog>` in either "modal" or "non-modal" styles.

{% Codepen {
    user: 'web-dot-dev',
    id: 'JjvPJKR',
    height: 450,
    tab: 'result'
  }
%}

When you show the "modal" version, it uses the `::backdrop` provided by the top layer.

{% Aside %}
[Top layer elements](https://developer.chrome.com/blog/what-is-the-top-layer/) have a styleable backdrop element.
{% endAside %}

```css
dialog::backdrop {
 background: hsl(0 0% 10% / 0.5);
}
```

But, for the non-modal version which doesn't have a `::backdrop`, a fake one gets created with the `::before` pseudo-element. It's lighter and doesn't blur the content behind it. You could combine with `:not` to detect a non-modal `<dialog>`.

```css
dialog[open]:not(:modal)::before {
  content: "";
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 50%;
  left: 50%;
  background: hsl(0 0% 10% / 0.25);
  transform: translate3d(-50%, -50%, -1px);
}
```

This will also work for elements that are in full-screen mode too. Consider this heading element made of spans.

```html
<header>
  <h1>
    <span style="--index: 0;">:</span>
    <span style="--index: 1;">m</span>
    <span style="--index: 2;">o</span>
    <span style="--index: 3;">d</span>
    <span style="--index: 4;">a</span>
    <span style="--index: 5;">l</span>
 </h1>
</header>
```

When the element is in full-screen mode, the spans will animate.

```css
h1 span {
 animation: jump calc(var(--speed, 0) * 1s) calc(var(--index, 0) * 0.1s) infinite ease;
}
header:modal span {
  --speed: 0.75;
}
@keyframes jump {
  50% {
    transform: translateY(-50%);
  }
}
```

{% Codepen {
    user: 'web-dot-dev',
    id: 'YzLKQGx',
    height: 450,
    tab: 'result'
  }
%}

_Photo by [Volodymyr Hryshchenko](https://unsplash.com/@lunarts) on [Unsplash](https://unsplash.com/s/photos/dialog)_
  


