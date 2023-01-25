---
title: Theming
description: >
  Adapt your designs to match user preferences such as a dark mode. 
authors:
  - adactio
date: 2021-12-09
---

Even branding can be responsive. 
You can adjust the presentation of your website to match the user's preference. 
But first, here's how to extend your website's branding to include the browser itself.  

## Customize the browser interface

Some browsers allow you to suggest a theme color based on your website's palette. 
The browser's interface adapts to your suggested color. Add the color in a `meta` element named `theme-color` in the `head` of your pages.

```html
<meta name="theme-color" content="#00D494">
```

{% Aside %}
It feels a little strange to put styling information like this in HTML rather than CSS, 
but this allows the browser to update its interface as soon as the page is loading rather than waiting for the CSS. 
{% endAside %}

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/bM78eiZbOqwZ5doqKyaQ.png", alt="Clearleft dot com.", width="800", height="520" %}
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/kN9Un2PoYIKdVzH9I2Ac.png", alt="Resilient Web Design dot com.", width="800", height="520" %}
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/b8AUE0DLJX5uLhJH9kaE.png", alt="The Session dot org.", width="800", height="520" %}
 <figcaption>
   Three websites are viewed in the Safari browser. Each one has its own theme color that extends into the browser interface. 
 </figcaption>
</figure>

You can update the value of `theme-color` using JavaScript. But use this power wisely. 
It can be overwhelming for users if their browser's color scheme changes too often. 
Think about subtle ways to adjust the theme color. If the changes are too jarring, users will leave in annoyance.

You can also specify a theme color in a [web app manifest](https://developer.mozilla.org/docs/Web/Manifest) file. 
This is a JSON file with metadata about your website.

Link to the manifest file from the `head` of your documents. Use a `link` element with a `rel` value of `manifest`.

```html
<link rel="manifest" href="/manifest.json">
```

In the manifest file, list your metadata using key/value pairs.

```json
{
  "short_name": "Clearleft",
  "name": "Clearleft design agency",
  "start_url": "/",
  "background_color": "#00D494",
  "theme_color": "#00D494",
  "display": "standalone"
}
```

If a visitor decides to add your website to their home screen, 
the browser will use the information in your manifest file to display an appropriate shortcut.

{% Aside %}
Find out more about how to [add a web app manifest](/add-manifest/).
{% endAside %}

## Provide a dark mode

Many operating systems allow users to specify a preference for a light or a dark color palette, 
which is a good idea to optimize your site to your user's theme preferences. 
You can access this preference in a media feature called `prefers-color-scheme`.

```css
@media (prefers-color-scheme: dark) {
  // Styles for a dark theme.
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'wvrwLgN',
 height: 400,
 theme: 'dark',
 tab: 'css, result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/hpMyDvtHUyLPz0ltO6SS.mp4", controls=true, loop=true %}

Specify theme colors with the `prefers-color-scheme` media feature within the `meta` element.

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
```

You can also use the `prefers-color-scheme` media feature inside SVG. 
If you use an SVG file for your favicon, it can be adjusted for dark mode. 
[Thomas Steiner](/authors/thomassteiner/) wrote about 
[`prefers-color-scheme` in SVG favicons for dark mode icons](https://blog.tomayac.com/2019/09/21/prefers-color-scheme-in-svg-favicons-for-dark-mode-icons/).

## Theming with custom properties

If you use the same color values in multiple places throughout your CSS, it could be quite tedious to repeat all your selectors within a `prefers-color-scheme` media query.

```css
body {
  background-color: white;
  color: black;
}
input {
  background-color: white;
  color: black;
  border-color: black;
}
button {
  background-color: black;
  color: white;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
    color: white;
  }
  input {
    background-color: black;
    color: white;
    border-color: white;
  }
  button {
    background-color: white;
    color: black;
  }
}
```

Use CSS custom properties to store your color values. 
Custom properties work like variables in a programming language. You can update the value of a variable without updating its name.

If you update the values of your custom properties within a `prefers-color-scheme` media query, 
you won't have to write all your selectors twice.

```css
html {
  --page-color: white;
  --ink-color: black;
}
@media (prefers-color-scheme: dark) {
  html {
    --page-color: black;
    --ink-color: white;
  }
}
body {
  background-color: var(--page-color);
  color: var(--ink-color);
}
input {
  background-color: var(--page-color);
  color: var(--ink-color);
  border-color: var(--ink-color);
}
button {
  background-color: var(--ink-color);
  color: var(--page-color);
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'qBPWzrj',
 height: 440,
 theme: 'dark',
 tab: 'css,result'
} %}

See [building a color scheme](/building-a-color-scheme/) for more advanced examples of theming with custom properties.

## Images

If you are using SVGs in your HTML, you can apply custom properties there too.

```css
svg {
  stroke: var(--ink-color);
  fill: var(--page-color);
}
```

Now your icons will change their colors along with the other elements on your page.

If you want to tone down the brightness of your photographic images when displayed in dark mode, you can apply a filter in CSS.

```css
@media (prefers-color-scheme: dark) {
  img {
    filter: brightness(.8) contrast(1.2);
  }
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'PoJYrpy',
 height: 600,
 theme: 'dark',
 tab: 'result'
} %}

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/j4Hkz0lwHv1HOr3Qd6Wc.png", alt="Three photographs at normal brightness.", width="800", height="210" %}
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/ChcCHA1JLRX4F2IaLOXR.png", alt="Three photographs with slightly less brightness.", width="800", height="210" %}
 <figcaption>
   The effect is subtle, but you can tone down the brightness of images in dark mode. 
 </figcaption>
</figure>

For some images, you might want to swap them out completely in dark mode. 
For example, you might want to show a map with a darker color scheme. 
Use the `<picture>` element containing a `<source>` element with the `prefers-color-scheme` media query.

```html
<picture>
  <source srcset="darkimage.png" media="(prefers-color-scheme: dark)">
  <img src="lightimage.png" alt="A description of the image.">
</picture>
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'MWEgMmw',
 height: 600,
 theme: 'dark',
 tab: 'html,result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/8Sz0XmotUrwnbprrHtoZ.mp4", controls=true, loop=true %}

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/aX6PmKj8pQudiWgt4x31.png", alt="Two maps of Broolyn, one using light colors and the other using dark colors.", width="782", height="398" %}
 <figcaption>
   Two versions of the same map, one for light mode and one for dark mode. 
 </figcaption>
</figure>


## Forms

Browsers provide a default color palette for form fields. 
Let the browser know that your site offers both a dark and a light mode. 
That way, the browser can provide the appropriate default styling for forms.

Add this to your CSS:

```css
html {
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
```

You can also use HTML. Add this in the `head` of your documents:

```html
<meta name="supported-color-schemes" content="light dark">
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'dyVbBWZ',
 height: 400,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/6YuAM0ZCNhGNAjpI8fyT.mp4", controls=true, loop=true %}

Use the [`accent-color`](/accent-color/) property in CSS to style checkboxes, radio buttons, and some other form fields.

```css
html {
  accent-color: red;
}
```

It's common for dark themes to have subdued brand colors. You can update the `accent-color` value for dark mode.

```css
html {
  accent-color: red;
}
@media (prefers-color-scheme: dark) {
  html {
    accent-color: pink;
  }
}
```

It makes sense to use a custom property for this so you can keep all your color declarations in one place.

```css
html {
  color-scheme: light;
  --page-color: white;
  --ink-color: black;
  --highlight-color: red;
}
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
    --page-color: black;
    --ink-color: white;
    --highlight-color: pink;
  }
}
html {
  accent-color: var(--highlight-color);
}
body {
  background-color: var(--page-color);
  color: var(--ink-color);
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'WNZeqjB',
 height: 400,
 theme: 'dark',
 tab: 'result'
} %}

{% Video src="video/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/Dl00EnG4mwTbSQIkYBF9.mp4", controls=true, loop=true %}

{% Aside %}
For more on tinting elements with theme colors, see the section on [more tinting](/accent-color/#extra-more-tinting).
{% endAside %}

Providing a dark mode is just one example of adapting your site to suit your user's preferences. 
Next you'll learn how to make your adaptable to all sorts of [accessibility](/learn/design/accessibility/) considerations.

{% Assessment 'theming' %}
