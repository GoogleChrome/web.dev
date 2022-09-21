---
title: Speedy CSS Tip! Animated Loader
subhead: Let's make an animated CSS loader with scoped custom properties and animation-timing-function
date: 2022-09-22
hero: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/vzvc5Ep1blYUQMYYnAKT.jpg
authors:
  - jheyy
tags: 
  - blog
  - css
---

Hop over to [CodePen](https://pen.new) and create a new pen.

Create the markup for our loader. Note the use of inline custom properties!

```html
<div class="loader" style="--count: 10">
  <span style="--index: 0"></span>
  <span style="--index: 1"></span>
  <span style="--index: 2"></span>
  <span style="--index: 3"></span>
  <span style="--index: 4"></span>
  <span style="--index: 5"></span>
  <span style="--index: 6"></span>
  <span style="--index: 7"></span>
  <span style="--index: 8"></span>
  <span style="--index: 9"></span>
</div>

```

You can also use a generator ([Pug](https://pugjs.org/api/getting-started.html)) to configure the number of lines:

```pug
- const COUNT = 10
.loader(style=`--count: ${COUNT}`)
  - let i = 0
  while i < COUNT
    span(style=`--index: ${i}`)
    - i++
```

Give our loader some styles:

```css
loader {
  --size: 10vmin;
  height: var(--size);
  position: relative;
  width: var(--size);
}
```

Position our lines using absolute positioning and a combination of `calc` with `transform`:

```css
.loader span {
  background: grey;
  height: 25%;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%)
             rotate(calc(((360 / var(--count)) * var(--index)) * 1deg))
             translate(0, -125%);
  width: 10%;
}
```

Apply an opacity based on the `--index`:

```css
.loader span {
  opacity: calc(var(--index) / var(--count));
} 
```

Get things spinning!

```css
.loader {
  animation: spin 0.75s infinite steps(var(--count));
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

Note the use of `steps(var(--count))` to get the right effect ✨

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNdeWep',
  height: 300,
  theme: 'dark',
  tab: 'result'
} %}

Done! 🎉

{% Video {
    controls: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/Hs8ynufhs5B9PA0GSnZ8.mp4"
  }
%}

Prefer this in [tweet form](https://twitter.com/jh3yy/status/1513599688662044684)? 🐦

Stay Awesome! ʕ •ᴥ•ʔ
