---
title: Typography
description: >
  Make your text legible and beautiful, no matter where it appears.
authors:
  - adactio
date: 2021-12-09
---

If you don't specify any styles for your text, browsers will apply their own default styles. These are called _User Agent stylesheets_, and may vary from browser to browser. Users can set their own preferences for displaying text too.

If you don't specify a line length, browsers will wrap lines of text at the edge of the screen. So text on the web is responsive by default—it flows to fit the user's viewport.

But just because text fits on a screen doesn't mean it's comfortable to read. Good typography is all about presenting your text in an appropriate way. There's more to typography than choosing suitable fonts to use. You need to consider the user's preferences, the size of the text, line length, and the distance between the lines of text.

{% Aside %}
You may even need to consider the primary language of your user, as you may need to leave room for accents and other special characters. Learn more about this in the [internationalization](/learn/design/internationalization) module.
{% endAside %}

## Text size

It's difficult to know what size text on the web should be.

If someone is using a small screen, it might be a safe bet that their screen will be fairly close to their eyes—a hand's length away.

But as screens get larger and larger, it's harder to make that connection. A laptop-size screen will probably be fairly near to the viewer, but a widescreen desktop monitor is around the same size as a television screen. People sit an arm's length away from a desktop screen but they sit much further away from a television.

Still, while you can't know for certain how far away someone is from a screen, you can try to use text sizes that will hopefully turn out to be appropriate. Use smaller text sizes for smaller screens and larger text sizes for larger screens.

You can use media queries to change the `font-size` property as the screen size gets wider.

```css
@media (min-width: 30em) {
  html {
    font-size: 125%;
  }
}

@media (min-width: 40em) {
  html {
    font-size: 150%;
  }
}

@media (min-width: 50em) {
  html {
    font-size: 175%;
  }
}

@media (min-width: 60em) {
  html {
    font-size: 200%;
  }
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'WNZeBWY',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/cH8IU9hV7FGCgN0roNiU.mp4", controls=true, loop=true %}

## Scaling text

Switching between fixed text sizes at specific breakpoints is quite jumpy. A more responsive approach is to let the user's device width influence the text size.

The `vw` unit in CSS stands for “viewport width.” Connecting font sizes to the 
 viewport's width means that the text will grow and shrink in proportion to the browser width. This makes it difficult to predict what the text size will be at any specific width, but you know that the text size will be appropriate for the user's browser width.

It's important that you don't use the `vw` by itself in a font-size declaration.

{% Compare 'worse' %}

```css
html {
  font-size: 2.5vw;
}
```

{% endCompare %}

If you do, the user won't be able to resize the text. The text will be resizable if you mix in a relative unit—like `em`, `rem` or `ch`. The CSS [`calc()`](https://developer.mozilla.org/docs/Web/CSS/calc()) function is perfect for this.

{% Compare 'better' %}

```css
html {
  font-size: calc(0.75rem + 1.5vw);
}
```

{% endCompare %}

Let the browser do the math. This makes it difficult to predict exactly what the text size will be at any specific width, but you know that the text size will be in the right range. The user's browser takes care of figuring out the exact text size calculations.

{% Codepen {
 user: 'web-dot-dev',
 id: 'zYEOQQG',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/x5h7TqkGHJIPa61wPvAs.mp4", controls=true, loop=true %}

But now there's a possibility that the text will get *too* small on narrow screens and *too* big on wide screens.

## Clamping text

You probably don't want your text to shrink and grow to extremes. You can control where the scaling starts and ends using the CSS [`clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp()) function. This “clamps” the scaling to a specific range.

The `clamp()` function is  like the `calc()` function but it takes three values. The middle value is the same as what you pass to `calc()`. The opening value specifies the minimum size, in this case 1rem so as to not go below the user's preferred font size. The closing value specifies the maximum size.

```css
html {
  font-size: clamp(1rem, 0.75rem + 1.5vw, 2rem);
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'wvrwbbx',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

Now the text size shrinks and grows in proportion to the user's screen but the text size will never go below `1rem` or above `2rem`.

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/vVwP2L0z90zXL28iPYL4.mp4", controls=true, loop=true %}

## Line length

The web is not print, but we can learn lessons from the world of print and apply them on the web.

In his classic book [*The Elements of Typographic Style*](http://webtypography.net/2.1.2), Robert Bringhurst had this to say on line length (or measure):

> Anything from 45 to 75 characters is widely regarded as a satisfactory line length for a single-column page set in a serifed text face in a text size. The 66-character line (counting both letters and spaces) is widely regarded as ideal. For multiple column work, a better average is 40 to 50 characters.

You can't set a line length directly in CSS. There is no `line-length` property. But you can stop text from getting too wide by limiting how wide the container can be. The [`max-inline-size`](https://developer.mozilla.org/docs/Web/CSS/max-inline-size) property is perfect for this.

Don't set your line-lengths with a fixed unit like `px`. Users can scale their font size up and down and your line lengths should adjust accordingly. Use a [relative unit](/learn/css/sizing/#relative-lengths) like `rem` or `ch`.

{% Compare 'worse' %}

```css
article {
  max-inline-size: 700px;
}
```

{% endCompare %}

{% Compare 'better' %}

```css
article {
  max-inline-size: 66ch;
}
```

{% endCompare %}

Using `ch` units for width will cause new lines to wrap at the 66th character at that font size.

{% Codepen {
 user: 'web-dot-dev',
 id: 'MWEgddN',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/9Nxi6HuU28aQhxtzXq7l.mp4", controls=true, loop=true %}

## Line height

Although there is no `line-length` property in CSS, there is a [`line-height`](https://developer.mozilla.org/docs/Web/CSS/line-height) property.

Shorter lines of text can have larger `line-height` values. But if you use large `line-height` values for long lines of text, it's hard for the reader's eye to move from the end of one line to the start of the next line.

```css
article {
  max-inline-size: 66ch;
  line-height: 1.65;
}
blockquote {
  max-inline-size: 45ch;
  line-height: 2;
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'oNGvRrZ',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/di6psFbT6JhlwjtMm68j.mp4", controls=true, loop=true %}

Use unitless values for your `line-height` declarations. This ensures that the line height is relative to the `font-size`.

{% Compare 'worse' %}

```css
line-height: 24px;
```

{% endCompare %}

{% Compare 'better' %}

```css
line-height: 1.5;
```

{% endCompare %}

## Combinations and scale

Remember to prioritize hierarchy as you build your user interfaces for better clarity and page flow. A great way to do this is with [a typography scale built into your design system](https://material.io/design/typography/the-type-system.html#type-scale).

## Web fonts

A typeface is like a voice for your words. For the longest time on the web there were very few font options. System fonts were the only options. But now you can choose a web font that matches the feel of your content.

Use `@font-face` to tell browsers where to find your web font files. Use woff2 as your web font format. It's well supported and has the best performance gains.

```css
@font-face {
  font-family: Roboto;
  src: url('/fonts/roboto-regular.woff2') format('woff2');
}
body {
  font-family: Roboto, sans-serif;
}
```

But every web font file you add could potentially degrade the user experience as it increases page load time. Remember, design isn't just about how the final pixels look. How fast those pixels get painted is a critical part of the user experience. An experience that feels fast is a good user experience.

## Font loading

You can request that browsers start downloading a font file as soon as possible. Add a `link` element to the `head` of your document that references your web font file. A `rel` attribute with a value of `preload` tells the browser to prioritize that file. An `as` attribute with a value of `font` tells the browser what kind of file this is. The `type` attribute allows you to be even more specific.

```html
<link href="/fonts/roboto-regular.woff2" type="font/woff2" 
  rel="preload" as="font" crossorigin>
```

You need to include the `crossorigin` attribute even if you are hosting the font files yourself.

Use the CSS [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) property to tell the browser how to manage the switchover from a system font to a web font. You could choose to show no text at all until the web font is loaded. You could choose to display the system font immediately and then switch over to the web font once it loads. Both strategies have their downsides. If you wait until the web font is downloaded before showing any text, users may find themselves staring at a blank page for a frustratingly long time. If you show the text in a system font first and then switch over to the web font, users may experience a jarring shifting of content on the page.

{% Aside %}
You can mitigate the jarring effect of text shifting around by using [`size-adjust`](/css-size-adjust/) in your `@font-face` rule.
{% endAside %}

A good compromise is to wait for a short while before displaying any text. If the web font loads before that time is up, the text is displayed using the web font with no content shifts. If the web font still hasn't loaded after the time is up, the text is displayed using the system font so at least the user can read the content.

Use a `font-display` value of `swap` if you still want the web font to replace the system font whenever the web font finally loads.

```css
body {
  font-family: Roboto, sans-serif;
  font-display: swap;
}
```

Use a `font-display` value of `fallback` if you want to stick with the system font once text has been rendered.

```css
body {
  font-family: Roboto, sans-serif;
  font-display: fallback;
}
```

## Variable fonts

If you are using lots of different weights or styles of the same typeface, you may end up using lots of separate font files—a separate font file for each weight or style.

[Variable fonts](/variable-fonts/) solve this problem by using one file. Instead of having separate files for regular, bold, extra bold, and so on, a variable font file is responsive. It contains all the information it needs to be displayed across a spectrum of weights or styles.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ecr5godvTKunVXP7W8aU.png", alt="The letter 'A' shown in different weights.", width="800", height="218" %}


This means that a single variable font file is larger than a single regular font file, but a single variable font file will probably be smaller than multiple regular font files. If you're using lots of different weights, a variable font could give you a big performance gain.

{% Aside %}
If you're styling elements using the `system-ui` value for `font-face` property, you might get all the benefits of variable fonts without downloading any font files. [More and more system fonts are now variable fonts](/more-variable-font-options-in-chromium-83/).
{% endAside %}
 
Good typography on the web isn't just about the type choices that you make as a designer. Responsive typography is also about respecting the user's device and network connection. The end result is a design that feels right no matter how it's being viewed.

Now that you've mastered responsive text, it's time to dive into [responsive images](/learn/design/responsive-images).

{% Assessment 'typography' %}
