---
title: Hello Darkness, My Old Friend
subhead: Overhyped or necessity? Learn everything about dark mode and how to support it to benefit your users!
authors:
  - thomassteiner
date: 2019-06-21
hero: dark.png
alt: |
  Web page rendered in the dark mode experience with the Chrome Developer Tools open on the Network tab
  that shows the CSS file responsible for the (currently not used) light mode experience
  being downloaded with the lowest priority.
description: |
  Many devices now support an operating system wide dark mode or dark theme experience.
  This post explains how dark mode can be supported on web pages, lists best practices,
  and introduces a custom element named dark-mode-toggle that allows web developers
  to offer users a way to override their operating system level preference on specific web pages.
tags:
  - post
  - dark-mode
  - dark-theme
  - prefers-color-scheme
  - color-scheme
---

## Dark mode before *Dark Mode*

{% Aside 'note' %}
  📚 I have done a lot of background research on the history and theory of dark mode,
  if you are only interested in working with dark mode, feel free to
  [skip the introduction](#activating-dark-mode-in-the-operating-system).
{% endAside %}

<figure class="w-figure w-figure--inline-right">
  <img style="height:175px; width:auto;" src="green-screen.jpg" alt="Green screen computer monitor" intrinsicsize="640x480">
  <figcaption class="w-figcaption">Fig. — Green screen (<a href="https://commons.wikimedia.org/wiki/File:Compaq_Portable_and_Wordperfect.JPG">Source</a>)</figcaption>
</figure>

We have gone full circle with dark mode.
In the dawn of personal computing, dark mode wasn’t a matter of choice,
but a matter of fact:
Monochrome <abbr title="Cathode-Ray Tube">CRT</abbr> computer monitors worked by firing electron beams
on a phosphorescent screen and the phosphor used in early CRTs was green.
Because text was displayed in green and the rest of the screen was black, these models were often referred to as
[green screens](https://commons.wikimedia.org/wiki/File:Schneider_CPC6128_with_green_monitor_GT65,_start_screen.jpg).

<figure class="w-figure w-figure--inline-left">
  <img style="height:175px; width:auto;" src="word-processing.jpg" alt="Dark-on-white word processing" intrinsicsize="698x551">
  <figcaption class="w-figcaption">Fig. — Dark-on-white (<a href="https://www.youtube.com/watch?v=qKkABzt0Zqg">Source</a>)</figcaption>
</figure>

The subsequently introduced Color CRTs displayed multiple colors
through the use of red, green, and blue phosphors.
They created white by activating all three phosphors simultaneously.
With the advent of more sophisticated <abbr title="What You See Is What You Get">WYSIWYG</abbr>
[desktop publishing](https://en.wikipedia.org/wiki/Desktop_publishing),
the idea of making the virtual document resemble a physical sheet of paper became popular.

<figure class="w-figure w-figure--inline-right">
  <img style="height:175px; width:auto;" src="worldwideweb.png" alt="Dark-on-white webpage in the WorldWideWeb browser" intrinsicsize="1024x768">
  <figcaption class="w-figcaption">Fig. — The WorldWideWeb browser (<a href="https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png">Source</a>)</figcaption>
</figure>

This is where *dark-on-white* as a design trend started,
and this trend was carried over to the
[early document-based web](http://info.cern.ch/hypertext/WWW/TheProject.html).
The first ever browser,
[WorldWideWeb](https://en.wikipedia.org/wiki/WorldWideWeb)
(remember,
[CSS wasn’t even invented](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#History) yet),
[displayed webpages](https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png) this way.
Fun fact: the second ever browser,
[Line Mode Browser](https://en.wikipedia.org/wiki/Line_Mode_Browser)—a terminal-based browser—was
green on dark.
These days, web pages and web apps are typically designed with dark text
on a light background, a baseline assumption that is also hard-coded in user agent stylesheets, including
[Chrome’s](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css).

<figure class="w-figure w-figure--inline-left">
  <img style="height:175px; width:auto;" src="smartphone-in-bed.jpg" alt="Smartphone used while lying in bed" intrinsicsize="500x334">
  <figcaption class="w-figcaption">Fig. — Smartphone used in bed (<a href="https://unsplash.com/photos/W39xsPWZgA4">Source</a>)</figcaption>
</figure>

The days of CRTs are long over.
Content consumption and creation has shifted to mobile devices
that use backlit <abbr title="Liquid Crystal Display">LCD</abbr>
or energy-saving <abbr title="Active-Matrix Organic Light-Emitting Diode">AMOLED</abbr> screens.
Smaller and more transportable computers, tablets, and smartphones led to new usage patterns.
Leisure tasks like web browsing, coding for fun, and high-end gaming
frequently happen after-hours in dim environments.
People even use their devices in their beds at night-time.
The more people use their devices in the dark,
the more the idea of going back to the roots of *light-on-dark* becomes popular.

## Why dark mode

### Aesthetics

When people get asked
[why they like or want dark mode](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d),
the most popular response is that *“it’s easier on the eyes,”*
followed by *“it’s elegant and beautiful.”*
Apple in their
[Dark Mode developer documentation](https://developer.apple.com/documentation/appkit/supporting_dark_mode_in_your_interface)
explicitly writes: *“The choice of whether to enable a light or dark appearance
is an aesthetic one for most users, and might not relate to ambient lighting conditions.”*

{% Aside 'note' %}
  👩‍🔬 Read up more on
  [user research regarding why people want dark mode and how they use it](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d).
{% endAside %}

<figure class="w-figure w-figure--inline-right">
  <img style="height:225px; width:auto;" src="closeview.png" alt="CloseView in Mac OS System 7 with \"White on Black\" mode" intrinsicsize="531x618">
  <figcaption class="w-figcaption">Fig. — System&nbsp;7 CloseView (<a href="https://archive.org/details/mac_Macintosh_System_7_at_your_Fingertips_1992">Source</a>)</figcaption>
</figure>

### Accessibility

There are also people who actually *need* dark mode and use it as another accessibility tool,
for example, users with low vision.
The earliest occurrence of such an accessibility tool I could find is
[System&nbsp;7](https://en.wikipedia.org/wiki/System_7)’s *CloseView* feature, which had a toggle for
*Black on White* and *White on Black*.
While System&nbsp;7 supported color, the default user interface was still black-and-white.

These inversion-based implementations showed their weaknesses once color was introduced.
User research by Szpiro *et al.* on
[how people with low vision access computing devices](https://dl.acm.org/citation.cfm?id=2982168)
showed that all interviewed users disliked inverted images,
but that many preferred light text on a dark background.
Apple accommodates for this user preference with a feature called
[Smart Invert](https://www.apple.com//accessibility/iphone/vision/),
which reverses the colors on the display, except for images, media,
and some apps that use dark color styles.

### Computer Vision Syndrome

Computer Vision Syndrome, also known as Digital Eye Strain, is
[defined](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1475-1313.2011.00834.x)
as *“the combination of eye and vision problems associated with the use of computers
(including desktop, laptop, and tablets) and other electronic displays (e.g.
smartphones and electronic reading devices).”*
It has been [proposed](https://bmjopen.bmj.com/content/5/1/e006748)
that the use of electronic devices by adolescents, particularly at night time,
leads to an increased risk of shorter sleep duration,
longer sleep-onset latency, and increased sleep deficiency.
Additionally, exposure to blue light has been widely
[reported](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4254760/)
to be involved in the regulation of
[circadian rhythm](https://en.wikipedia.org/wiki/Circadian_rhythm)
and the sleep cycle,
and irregular light environments may lead to sleep deprivation,
possibly affecting mood and task performance, according to
[research by Rosenfield](https://www.college-optometrists.org/oip-resource/computer-vision-syndrome--a-k-a--digital-eye-strain.html).
To limit these negative effects, reducing blue light by adjusting the display color temperature
through features like iOS’ [Night Shift](https://support.apple.com/en-us/HT207570) or Android’s
[Night Light](https://support.google.com/pixelphone/answer/7169926?) can help,
as well as avoiding bright lights or irregular lights in general through dark themes or dark modes.

### Power savings on AMOLED screens

Finally, dark mode is known to save a *lot* of energy on AMOLED screens.
Android case studies that focused on popular Google apps
like YouTube have shown that the power savings can be up to 60%.
The video below has more details on these case studies and the power savings.

<figure class="w-figure w-figure--fullbleed">
  {% YouTube 'N_6sPd0Jd3g?start=305' %}
</figure>

## Activating dark mode in the operating system

Now that I have covered the background of why dark mode is such a big deal for many users,
let’s review how you can support it.

Operating systems that support a dark mode or dark theme
typically have an option to activate it somewhere in the settings.
On macOS&nbsp;X, it’s in the system preference’s *General* section and called *Appearance*,
and on Windows&nbsp;10, it’s in the *Colors* section and called *Choose your color*.
For Android&nbsp;Q, you can find it under *Display* as a *Dark Theme* toggle switch,
and on iOS&nbsp;13, you can change the appearance in the *Display &amp; Brightness*
section of the settings.

<figure>
  <style>
    #dark-mode-overview::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to right, transparent 0%, transparent 90%, currentColor 100%)
    }
  </style>
  <div style="position: relative;">
    <div id="dark-mode-overview" style="overflow-x: auto; padding-left:1rem;">
      <table class="w-screenshot w-screenshot--filled">
        <tr>
          <td style="vertical-align:top;">
            <figure class="w-figure w-figure--inline-left">
              <img style="height:250px; width:auto;" src="windows10.png" alt="Windows 10 dark theme settings" intrinsicsize="838x700">
              <figcaption class="w-figcaption">Windows&nbsp;10 dark theme settings</figcaption>
            </figure>
          </td>
          <td style="vertical-align:top;">
            <figure class="w-figure w-figure--inline-left">
              <img style="height:250px; width:auto;" src="macosx.png" alt="macOS X dark mode settings" intrinsicsize="668x678">
              <figcaption class="w-figcaption">macOS&nbsp;X dark mode settings</figcaption>
            </figure>
          </td>
          <td style="vertical-align:top;">
            <figure class="w-figure w-figure--inline-left">
              <img style="height:250px; width:auto;" src="android.png" alt="Android Q dark mode settings" intrinsicsize="610x700">
              <figcaption class="w-figcaption">Android&nbsp;Q dark theme settings</figcaption>
            </figure>
          </td>
          <td style="vertical-align:top;">
            <figure class="w-figure w-figure--inline-left">
              <img style="height:250px; width:auto;" src="ios.jpg" alt="iOS 13 appearance settings" intrinsicsize="323x700">
              <figcaption style="width: 10rem;" class="w-figcaption">iOS&nbsp;13 appearance settings</figcaption>
            </figure>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <figcaption class="w-figcaption">Fig. — Dark mode settings on various operating systems</figcaption>
</figure>

## The `prefers-color-scheme` media query

One last bit of theory before I get going.
[Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
allow authors to test and query values or features of the user agent or display device,
independent of the document being rendered.
They are used in the CSS `@media` rule to conditionally apply styles to a document,
and in various other contexts and languages, such as HTML and JavaScript.
[Media Queries Level&nbsp;5](https://drafts.csswg.org/mediaqueries-5/)
introduces so-called user preference media features, that is,
a way for sites to detect the user’s preferred way to display content.

{% Aside 'note' %}
  ☝️ An established user preference media feature is `prefers-reduced-motion`
  that lets you detect the desire for less motion on a page.
  I have written about
  [`prefers-reduced-motion`](https://developers.google.com/web/updates/2019/03/prefers-reduced-motion)
  before.
{% endAside %}

The [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)
media feature is used to detect
if the user has requested the page to use a light or dark color theme.
It works with the following values:

- `no-preference`:
  Indicates that the user has made no preference known to the system.
  This keyword value evaluates as `false` in the
  [boolean context](https://drafts.csswg.org/mediaqueries-5/#boolean-context).
- `light`:
  Indicates that the user has notified the system that they prefer a page that has a light theme
  (dark text on light background).
- `dark`:
  Indicates that the user has notified the system that they prefer a page that has a dark theme
  (light text on dark background).

## Supporting dark mode

Let’s finally see how supporting dark mode looks like in practice.
Just like with the [Highlander](https://en.wikipedia.org/wiki/Highlander_(film)),
with dark mode, *there can be only one*: dark or light, but never both!
Why do I mention this? Because this fact has an impact on the loading strategy.
Please don’t force users to download CSS in the critical rendering path
that is for a mode they don’t currently use.
To optimize load speed, I have therefore split my CSS for the example app
into three parts in order to [defer non-critical CSS](/defer-non-critical-css/):

- `style.css` that contains generic styles that are used universally on the site.
- `dark.css` that contains only the rules needed for dark mode.
- `light.css` that contains only the rules needed for light mode.

### Loading strategy

The two latter ones, `light.css` and `dark.css`,
are loaded conditionally with a `<link media>` query.
Initially,
[not all browsers will support `prefers-color-scheme`](https://caniuse.com/#feat=prefers-color-scheme),
which I deal with dynamically by loading the default `light.css` file
(an arbitrary choice, I could also have made the dark experience the default)
via `document.write` in a minuscule inline script.

```html
<!-- index.html -->
<script>
  // If `prefers-color-scheme` is not supported, fall back to light mode.
  // In this case, the file will be downloaded with `highest` priority.
  if (!window.matchMedia('(prefers-color-scheme)').matches) {
    document.write('<link rel="stylesheet" href="/light.css"">');
  }
</script>
<!-- The main stylesheet -->
<link rel="stylesheet" href="/style.css">
<!--
  Conditionally either load the light or the dark stylesheet. The matching file
  will be downloaded with `highest`, the non-matching file with `lowest`
  priority. If the browser doesn't support `prefers-color-scheme`, the media
  query is unknown and the files are downloaded with `lowest` priority (but
  above I already force `highest` for my default light experience).
-->
<link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="/light.css" media="(prefers-color-scheme: no-preference), (prefers-color-scheme: light)">
```

### Stylesheet architecture

I make maximum use of [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/var),
this allows my generic `style.css` to be, well, generic,
and all the customization happens in the two other files `dark.css` and `light.css`.
Below you can see an excerpt of the actual styles, but it should suffice to convey the overall idea.
I declare two variables, `--background-color` and `--color`
that essentially create a *dark-on-light* and a *light-on-dark* baseline theme.

```css
/* light.css */
:root {
  --background-color: rgb(250, 250, 250);
  --color: rgb(5, 5, 5);
}
```

```css
/* dark.css */
:root {
  --background-color: rgb(5, 5, 5);
  --color: rgb(250, 250, 250);
}
```

In my `style.css`, I then use these variables in the `body { … }` rule.
As they are defined on the
[`:root` CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:root)—a
selector that in HTML represents the `<html>` element
and is identical to the selector `html`, except that its specificity is
higher—they cascade down, which serves me for declaring global CSS variables.

```css
/* style.css */
:root {
  color-scheme: dark light;
}

body {
  background-color: var(--background-color);
  color: var(--color);
}
```

In the code sample above, you will probably have noticed a property
[`color-scheme`](https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme)
with the space-separated value `light dark`.

{% Aside 'warning' %}
  The `color-scheme` property is still [in development](https://crbug.com/925935)
  and it might not work as advertised, full support in Chrome will come later this year.
{% endAside %}

This tells the browser which color themes my app supports
and allows it to activate special variants of the user agent stylesheet,
which is useful to, for example, let the browser render form fields
with a dark background and light text, adjust the scrollbars,
or to enable a theme-aware highlight color.

{% Aside 'note' %}
  🌒 Read up more on
  [what `color-scheme` actually does](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d).
{% endAside %}

The exact details of `color-scheme` are specified in
[CSS Color Adjustment Module Level&nbsp;1](https://drafts.csswg.org/css-color-adjust-1/).

Everything else is then just a matter of defining CSS variables
for things that matter on my site.
Semantically organizing styles helps a lot when working with dark mode.
For example, rather than `--highlight-yellow`, consider calling the variable
`--accent-color`, as “yellow” may actually not be yellow in dark mode or vice versa.
Below is an example of some more variables that I use in my example.

```css
/* dark.css */
:root {
  --background-color: rgb(5, 5, 5);
  --color: rgb(250, 250, 250);
  --link-color: rgb(0, 188, 212);
  --main-headline-color: rgb(233, 30, 99);
  --accent-background-color: rgb(0, 188, 212);
  --accent-color: rgb(5, 5, 5);
}
```

```css
/* light.css */
:root {
  --background-color: rgb(250, 250, 250);
  --color: rgb(5, 5, 5);
  --link-color: rgb(0, 0, 238);
  --main-headline-color: rgb(0, 0, 192);
  --accent-background-color: rgb(0, 0, 238);
  --accent-color: rgb(250, 250, 250);
}
```

### Avoid pure white

A small detail you may have noticed is that I don’t use pure white.
Instead, to prevent glowing and bleeding against the surrounding dark content,
I choose a slightly darker white, `rgb(250, 250, 250)` or similar works well.

## Full example

In the following [Glitch](https://dark-mode-baseline.glitch.me/) embed,
you can see the complete example that puts the concepts from above into practice.
Try toggling dark mode in your particular [operating system’s settings](#activating-dark-mode-in-the-operating-system)
and see how the page reacts.

<div style="height: 900px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    src="https://glitch.com/embed/#!/embed/dark-mode-baseline?path=style.css&previewSize=100&attributionHidden=true"
    style="height:100%; width:100%; border:0;">
  </iframe>
</div>

When you play with this example, you can see
why I load my `dark.css` and `light.css` via media queries.
Try toggling dark mode and reload the page:
the particular currently non-matching stylesheets are still loaded, but with the lowest priority,
so that they never compete with resources that are needed by the site right now.

{% Aside 'note' %}
  😲 Read up more on
  [why browsers download stylesheets with non-matching media queries](https://blog.tomayac.com/2018/11/08/why-browsers-download-stylesheets-with-non-matching-media-queries-180513).
{% endAside %}

<figure class="w-figure">
  <img src="light.png" alt="Network loading diagram showing how in light mode the dark mode CSS gets loaded with lowest priority" intrinsicsize="1633x851">
  <figcaption class="w-figcaption">Fig. — Site in light mode loads the dark mode CSS with lowest priority.</figcaption>
</figure>

<figure class="w-figure">
  <img src="dark.png" alt="Network loading diagram showing how in dark mode the light mode CSS gets loaded with lowest priority" intrinsicsize="1633x851">
  <figcaption class="w-figcaption">Fig. — Site in dark mode loads the light mode CSS with lowest priority.</figcaption>
</figure>

<figure class="w-figure">
  <img src="unsupported.png" alt="Network loading diagram showing how in default light mode the dark mode CSS gets loaded with lowest priority" intrinsicsize="1633x851">
  <figcaption class="w-figcaption">Fig. — Site in default light mode on a browser that doesn’t support <code>prefers-color-scheme</code> loads the dark mode CSS with lowest priority.</figcaption>
</figure>

### Finding out if dark mode is supported

As dark mode is reported through media queries, you can easily check if the current browser
supports dark mode by checking if the media query `prefers-color-scheme` matches at all.
Note how I don’t include any value, but purely check if the media query alone matches.
Actually, I have silently used this pattern already above in the
[loading strategy](#loading-strategy) code snippet.

```js
if (window.matchMedia('(prefers-color-scheme)').matches) {
  console.log('🎉 Dark mode is supported');
}
```

### Reacting on dark mode changes

Like any other media query change, dark mode changes can be subscribed to via JavaScript.
You can use this to, for example, dynamically change the favicon of a page
or change the `<meta name="theme-color">` that determines the color of the URL bar in Chrome.
The [full example](#full-example) above shows this in action.

```js
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    const darkModeOn = e.matches;
    console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
  });
```

## Dark mode best practices

### Smooth transitions between modes

Switching from dark mode to light mode or vice versa can be smoothed thanks to the fact
that both `color` and `background-color` are animatable CSS properties.
Creating the animation is as easy as declaring two `transition`s for the two properties.
The example below illustrates the overall idea.

```css
body {
  --duration: 0.5s;
   --timing: ease;

  background-color: var(--background-color);
  color: var(--color);
  transition:
    color var(--duration) var(--timing),
    background-color var(--duration) var(--timing);
}
```

### Photographic images

If you compare the two screenshots above, you will notice that not only the core theme has changed
from *dark-on-light* to *light-on-dark*, but that also the hero image looks slightly different.
My [research](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)
has shown that the majority of the surveyed people
prefer slightly less vibrant and brilliant images when dark mode is active.
I refer to this as *re-colorization*.

Re-colorization can be achieved through a CSS filter on my images.
I use a CSS selector that matches all images that don’t have `.svg` in their URL,
the idea being that I can give vector graphics (icons) a different re-colorization treatment
than my images (photos), more about this in the [next paragraph](#vector-graphics-and-icons).
Note how I again use a [CSS variable](https://developer.mozilla.org/en-US/docs/Web/CSS/var),
so I can later on flexibly change my filter.

{% Aside 'note' %}
  🎨 Read up more on
  [user research regarding re-colorization preferences with dark mode](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b).
{% endAside %}

As re-colorization is only needed in dark mode, that is, when `dark.css` is active,
there are no corresponding rules in `light.css`.

```css
/* dark.css */
--image-filter: grayscale(50%);

img:not([src*=".svg"]) {
  filter: var(--image-filter);
}
```

<figure>
  <div style="width: 100%">
    <div style="display: inline-block;
      width: 45%;
      height: 100px;
      background-image: url(dark.png);
      background-repeat: no-repeat;
      background-position-y: center;"></div>
    <div style="display: inline-block;
      width: 45%;
      height: 100px;
      background-image: url(light.png);
      background-repeat: no-repeat;
      background-position-y: center;"></div>
  </div>
  <figcaption class="w-figcaption">Fig. — Image re-colorization</figcaption>
</figure>

### Customizing dark mode choices with JavaScript

Not everyone is the same and people have different dark mode needs.
By sticking to the re-colorization method described above,
I can easily make the grayscale intensity a user preference that I can change via JavaScript,
and by setting a value of `0%`, I can also disable re-colorization completely.

```js
const filter = 'grayscale(70%)';
document.documentElement.style.setProperty('--image-filter', value);
```

### Vector graphics and icons

For vector graphics—that in my case are used as icons—I use a different re-colorization method.
While [research](https://dl.acm.org/citation.cfm?id=2982168) has shown
that people don’t like inversion for photos, it does work very well for most icons.
Again I use CSS variables to determine the inversion amount
in the regular and in the `:hover` state.
Note how again I only invert icons in `dark.css` but not in `light.css`, and how the `:hover` state
gets a different inversion intensity in the two cases to make the icon appear
slightly darker or slightly brighter, dependent on the mode the user has selected.

```css
/* dark.css */
--icon-filter: invert(100%);
--icon-filter_hover: invert(40%);

img[src*=".svg"] {
  filter: var(--icon-filter);
}
```

```css
/* light.css */
--icon-filter_hover: invert(60%);
```

```css
/* style.css */
img[src*=".svg"]:hover {
  filter: var(--icon-filter_hover);
}
```

<figure>
  <div style="width: 100%">
    <div style="display: inline-block;
      width: 45%;
      height: 100px;
      background-image: url(dark.png);
      background-repeat: no-repeat;
      background-position: bottom -50px left 0;"></div>
    <div style="display: inline-block;
      width: 45%;
      height: 100px;
      background-image: url(light.png);
      background-repeat: no-repeat;
      background-position: bottom -50px left 0;"></div>
  </div>
  <figcaption class="w-figcaption">Fig. — Icon re-colorization</figcaption>
</figure>

### Art direction with dark mode

While for loading performance reasons in general I recommend to exclusively work with `prefers-color-scheme`
in the `media` attribute of `<link>` elements (rather than inline in stylesheets),
there are situations where you actually may want to work with `prefers-color-scheme` directly inline in your HTML code.
Art direction is such a situation.
On the web, art direction deals with the overall visual appearance of a page and how it communicates visually,
stimulates moods, contrasts features, and psychologically appeals to a target audience.
With dark mode, it’s up to the judgment of the designer to decide what is the best image at a particular mode
and whether [re-colorization of images](#photographic-images) is maybe *not* good enough.
If used with the `<picture>` element, the `<source>` of the image to be shown can be made dependent on the `media` attribute.
In the example below, I show the Western hemisphere for dark mode, and the Eastern hemisphere for light mode
and when no preference is given, defaulting to the Eastern hemisphere in all other cases.
Toggle dark mode on your device to see the difference.

```html
<picture>
  <source srcset="western.webp" media="(prefers-color-scheme: dark)">
  <source srcset="eastern.webp" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)">
  <img src="eastern.webp">
</picture>
```

<div style="height: 600px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    src="https://glitch.com/embed/#!/embed/dark-mode-picture?path=index.html&previewSize=100"
    alt="dark-mode-picture on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Dark mode, but add an opt-out

As mentioned in the [why dark mode](#why-dark-mode) section above,
dark mode is an aesthetic choice for most users.
In consequence, some users may actually like to have their operating system UI
in dark, but still prefer to see their webpages the way they are used to seeing them.
A great pattern is to initially adhere to the signal the browser sends through
`prefer-color-scheme`, but to then optionally allow users to override that color scheme.
You can of course create the code for this yourself, but you can also just use
a ready-made custom element (web component) that I have created right for this purpose.
It’s called [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle)
and it adds a toggle (dark mode on/off) or
a theme switcher (theme light/dark) to your page that you can fully customize.
The demo below shows the element in action
(oh, and I have also snuck it in the [full example](#full-example) above).

<div style="height: 800px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    src="https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html"
    style="height:100%; width:100%; border:0;">
  </iframe>
</div>

## Conclusions

Working with and supporting dark mode is fun and opens up new design avenues.
For some of your visitors it can be the difference between not being able to handle your site
and being a happy user.
There are some pitfalls and careful testing is required, but dark mode is definitely a great opportunity
for you to show that you care about all of your users.
The best practices mentioned in this post and helpers like the
[`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) custom element
should make you confident in your ability to create an amazing dark mode experience.
[Let me know on Twitter](https://twitter.com/tomayac) what you create and if this post was useful.
Thanks for reading! 🌒

## Related links

Resources for the `prefers-color-scheme` media query:
  - [Chrome Platform Status page](https://chromestatus.com/feature/5109758977638400)
  - [Chromium bug](https://crbug.com/889087)
  - [Media Queries Level&nbsp;5 spec](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)

Resources for the `color-scheme` meta tag and CSS property:
  - [Chrome Platform Status page](https://chromestatus.com/feature/5330651267989504)
  - [Chromium bug](http://crbug.com/925935)
  - [CSS Color Adjustment Module Level&nbsp;1 spec](https://drafts.csswg.org/css-color-adjust-1/)
  - [CSS WG GitHub Issue for the meta tag and the CSS property](https://github.com/w3c/csswg-drafts/issues/3299)
  - [HTML WHATWG GitHub Issue for the meta tag](https://github.com/whatwg/html/issues/4504)

General dark mode links:
  - [Material Design — Dark Theme](https://material.io/design/color/dark-theme.html)
  - [Dark Mode in Web Inspector](https://webkit.org/blog/8892/dark-mode-in-web-inspector/)
  - [Dark Mode Support in WebKit](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)
  - [Apple Human Interface Guidelines — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/)

Background research articles for this post:
  - [What Does Dark Mode’s “supported-color-schemes” Actually Do? 🤔](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d)
  - [Let there be darkness! 🌚 Maybe…](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)
  - [Re-Colorization for Dark Mode](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)

## Acknowledgements

I would like to thank 🙏 [Lukasz Zbylut](https://www.linkedin.com/in/lukasz-zbylut/)
for his thorough review of this article.
The `prefers-color-scheme` media feature, the `color-scheme` CSS property,
and the related meta tag are the implementation work of 👏 [Rune Lillesveen](https://twitter.com/runeli).
Rune is also a co-editor of the [CSS Color Adjustment Module Level&nbsp;1](https://drafts.csswg.org/css-color-adjust-1/) spec.
Finally, I am thankful to the many anonymous participants of the various user studies
that have helped shape the recommendations in this article.
