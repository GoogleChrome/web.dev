---
title: Speedy CSS Tip! Animated Gradient Text
subhead: Let's make that animated gradient text effect with scoped custom properties and background-clip
date: 2022-11-03
hero: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/jGDpMMoAas6YfIUAbPvr.jpg
thumbnail: image/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/jGDpMMoAas6YfIUAbPvr.jpg
alt: A hand holds up a sticker with the word "Hello!" printed on it. The text is orange and the background is black.
authors:
  - jheyy
tags: 
  - blog
  - css
---

Hop over to [CodePen](https://pen.new) and create a new pen.

Create the markup for your text. Let's use a header with the word "Speedy":

```html
<h1 class="boujee-text">Hello!</h1>
```

Then, let's give our `body` a darker `background-color`:

```css
body {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: hsl(0 0% 20%);
}
```

Bump up the `font-size` on our text. Use `clamp` to make it responsive:

```css
.boujee-text {
  font-size: clamp(3rem, 25vmin, 12rem);
}
```

Create two custom properties for the colors we're going to use. Apply a `linear-gradient` to the `background` using those colors and rotate it by 90 degrees:

```css/1-2,6-8
.boujee-text {
  --color-one: hsl(15 90% 55%);
  --color-two: hsl(40 95% 55%);
  font-size: clamp(3rem, 25vmin, 8rem);
  background: linear-gradient(
                90deg,
                var(--color-one),
                var(--color-two),
                var(--color-one)
              ) 0 0 / 100% 100%;
}
```

Create a custom property that you can use for the horizontal background size. Use it for `background-size-x`:

```css/1,10
.boujee-text {
  --bg-size: 400%;
  --color-one: hsl(15 90% 55%);
  --color-two: hsl(40 95% 55%);
  font-size: clamp(3rem, 25vmin, 8rem);
  background: linear-gradient(
                90deg,
                var(--color-one),
                var(--color-two),
                var(--color-one)
              ) 0 0 / var(--bg-size) 100%;
}
```

To clip the background to the text set the `color` to `transparent`, and set `background-clip: text`:


```css/11-13
.boujee-text {
  --bg-size: 400%;
  --color-one: hsl(15 90% 55%);
  --color-two: hsl(40 95% 55%);
  font-size: clamp(3rem, 25vmin, 8rem);
  background: linear-gradient(
                90deg,
                var(--color-one),
                var(--color-two),
                var(--color-one)
              ) 0 0 / var(--bg-size) 100%;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
}
```

{% Aside %}
The `background-clip` property needs prefixing in some browsers as `-webkit-background-clip`.
{% endAside %}

At this point, you could leave it there and experiment with the `background-position` and the gradient used in the `background-image`. Or, you could animate that gradient across your text. First, define a keyframe for the animation. This will use the `--bg-size` custom property you defined earlier. A good example of scoped custom properties making maintenance easier for you.

```css
@keyframes move-bg {
  to {
    background-position: var(--bg-size) 0;
  }
}
```

Then apply the animation using `animation`:

```css/14
.boujee-text {
  --bg-size: 400%;
  --color-one: hsl(15 90% 55%);
  --color-two: hsl(40 95% 55%);
  font-size: clamp(3rem, 25vmin, 8rem);
  background: linear-gradient(
                90deg,
                var(--color-one),
                var(--color-two),
                var(--color-one)
              ) 0 0 / var(--bg-size) 100%;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: move-bg 8s infinite linear;
}
```

To take this further, you can wrap your animation code in a media query to respect your user's preferences for motion:

```css
@media (prefers-reduced-motion: no-preference) {
  .boujee-text {
    animation: move-bg 8s linear infinite;
  }
  @keyframes move-bg {
    to {
      background-position: var(--bg-size) 0;
    }
  }
}
``` 

{% Codepen {
  user: 'web-dot-dev',
  id: 'vYrGPNE',
  height: 300,
  theme: 'dark',
  tab: 'result'
} %}

Done! 🎉 You've created some animated gradient text with CSS using scoped custom properties and `background-clip`.

Here's this tip in its speedy video form! ⚡️

{% Video {
    controls: true,
    src:"video/Dyx9FwYgMyNqy1kMGx8Orz6q0qC3/v6NHBhtbffb91Ls0D7No.mp4"
  }
%}

Prefer this in [tweet form](https://twitter.com/jh3yy/status/1517629642064150529)? 🐦

Stay Awesome! ʕ •ᴥ•ʔ

___Hero image by [Vladislav Klapin](https://unsplash.com/@lemonvlad) on [Unsplash](https://unsplash.com/s/photos/speedy-text)___
