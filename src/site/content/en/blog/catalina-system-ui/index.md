---
title: More variable font options for the macOS `system-ui` font in Chromium 83
subhead: Catalina brings a new united variable system font to macOS 
authors:
  - adamargyle
  # - drott
description: Chromium 80 had a system-ui font weight regression on macOS. The reason it broke, and the new super powers post-resolution, are worth the wait in Chromium 83.
date: 2020-05-21
updated: 2020-05-21
hero: hero-temp.png
alt: A bright pink and purple gradient with "macOS Catalina system-ui" going from thin to think from left to right, demonstrating some of the new variation settings
---

The ['system-ui' section](https://drafts.csswg.org/css-fonts-4/#system-ui-def) of the CSS Fonts Module Level 4 spec defines a `system-ui` font keyword that allows developers to use the built-in, turbo-optimized, mega-high-quality, no-download-needed, default operating system font font right in their sites and apps. 

```css
body {
  font-family: system-ui;
}
```

This typography choice is akin to saying:

{% Blockquote 'browser' %}
use the native system font for the current locale of this user
{% endBlockquote %}

On macOS, the `system-ui` font is San Francisco, a font that a design team vetted, tested, and… recently upgraded! First we’ll cover the [new exciting variable font features in Catalina](#new-powers), then we’ll cover a couple of [bugs and how Chromium engineers resolved them](#regression).

This post assumes that you're already familiar with variable fonts. If not, check out [Introduction to variable fonts on the web](/variable-fonts/) and the video below.

{% YouTube 'B42rUMdcB7c' %}

### Browser Compatibility
At the time of writing, `system-ui` has support from Chromium (since 56), Edge (since 79), Safari (since 11), and from Firefox (since 43) but with the `-apple-system` keyword. See Can I use variable fonts? for updates.



## New Powers {: #new-powers }

The new abilities that Catalina brought to the system font are now available to web developers as of Chromium 83. The `system-ui` font now **has more variable settings**: optical sizing and 2 unique weight adjustments: 

{% Compare 'worse', 'Mojave' %}
```css
h1 {
  font-family: system-ui;
  font-weight: 700;
  font-variation-settings: 
    'wght' 750
  ;
}

```

{% endCompare %}

{% Compare 'better', 'Catalina' %}
```css/5-7
h1 {
  font-family: system-ui;
  font-weight: 700;
  font-variation-settings: 
    'wght' 750, 
    'opsz' 20,
    'GRAD' 400, 
    'YAXS' 400
  ;
}

```

{% endCompare %}

On Mojave, `system-ui` is a variable font with only `wght` settings. While `system-ui` on Catalina is a variable font with `wght`, `opsz`, `GRAD`, and `YAXS` settings.

Looks like some neat progressive enhancement design opportunities to me! Really dig into the subtleties of the system font if you want. 

{% Aside 'gotchas' %}
These variant features are only available for macOS Catalina users.
{% endAside %}

#### `wght`  {: #wght }
Accepts a font weight between `0` and `900` and is applied equally to all characters.

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_vp9.webm" type="video/webm; codecs=vp8"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_wght.mp4">
  </video>
</figure>

```css
/* Supports 0-900 */
font-variation-settings: 'wght' 750;
```

#### `opsz` {: #opsz }
Optical sizing is similar to kerning or letter-spacing, but the spacing is done by a human eye instead of math. A value of `19` or below is intended for text and body copy spacing, while `20` or above is for spacing display headers and titles.

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_vp9.webm" type="video/webm; codecs=vp8"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_opsz.mp4">
  </video>
</figure>

#### `GRAD`
Similar to weight, but without touching horizontal spacing. It accepts values between `400` and `1000`.

<!-- <figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_opsz.mp4">
  </video>
</figure> -->

```css
font-variation-settings: 'GRAD' 500;
```

#### `YAXS`
Stretches the glyph vertically. It accepts values between `400` and `1000`.

<!-- <figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_opsz.mp4">
  </video>
</figure> -->

```css
font-variation-settings: 'YAXS' 500;
```

### Combining the options
With a few lines of CSS, we can tweak the font settings into a bold of our choice or try out other interesting combinations:

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <!-- <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_vp9.webm" type="video/webm; codecs=vp8"> -->
    <source src="https://storage.googleapis.com/web-dev-assets/macos-system-ui/system-ui_all-settings.mp4">
  </video>
</figure>

```css
font-weight: 700;
font-weight: bold;
font-variation-settings: 'wght' 750, 'YAXS' 600;
```

And just like that, Chromium users on macOS see your upgraded, custom 750 weight with added thickness to the y-axis.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe
    src="TODO&attributionHidden=true"
    alt="tabindex-zero on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

macOS 10.15 added new features to its system font, and in macOS 10.15 a tricky `system-ui` bug was logged in the Chromium bug tracker. I wonder if they are related!?

