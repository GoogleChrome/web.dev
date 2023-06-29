---
title: 'Compare & CompareCaption'
---
The lang attribute can only have one language associated with it. This means
the `<html>` attribute can only have one language, even if there are multiple
languages on the page. Set `lang` to the primary language of the page.

<div class="switcher">
{% Compare 'worse' %}
```html
<html lang="ar,en,fr,pt">...</html>
```

{% CompareCaption %}
Multiple languages are not supported.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```html
<html lang="ar">...</html>
```

{% CompareCaption %}
Set only the page's primary language. In this case, the language is Arabic.
{% endCompareCaption %}
{% endCompare %}
</div>

### Links

Similar to buttons, links primarily get their accessible name from their text
content. A nice trick when creating a link is to put the most meaningful piece
of text into the link itself, rather than filler words like "Here" or "Read
More."

{% Compare 'worse', 'Not descriptive enough' %}
```html
Check out our guide to web performance <a href="/guide">here</a>.
```
{% endCompare %}

{% Compare 'better', 'Useful content!' %}
```html
Check out <a href="/guide">our guide to web performance</a>.
```
{% endCompare %}

### Check if an animation triggers layout {: #layout }

An animation that moves an element using something other than `transform`, is likely to be slow.
In the following example, I have achieved the same visual result animating `top` and `left`, and using `transform`.

{% Compare 'worse' %}
```css/9-10
.box {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: move 3s ease infinite;
}

@keyframes move {
  50% {
     top: calc(90vh - 160px);
     left: calc(90vw - 200px);
  }
}
```
{% endCompare %}

{% Compare 'better' %}
```css/9
.box {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: move 3s ease infinite;
}

@keyframes move {
  50% {
     transform: translate(calc(90vw - 200px), calc(90vh - 160px));
  }
}
```
{% endCompare %}

You can test this in the following two Glitch examples,
and explore performance using DevTools.

With the same markup, we can replace: `padding-top: 56.25%` with `aspect-ratio: 16 / 9`, setting
`aspect-ratio` to a specified ratio of `width` / `height`.

<div class="switcher">
{% Compare 'worse', 'Using padding-top' %}
```css
.container {
  width: 100%;
  padding-top: 56.25%;
}
```
{% endCompare %}

{% Compare 'better', 'Using aspect-ratio' %}
```css
.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```
{% endCompare %}
</div>

Using `aspect-ratio` instead of `padding-top` is much more clear, and does not overhaul the padding
property to do something outside of its usual scope.

Yeah, that's right, I'm using `reduce` to chain a sequence of promises. I'm _so
smart_. But this is a bit of _so smart_ coding you're better off without.

However, when converting the above to an async function, it's tempting to go
_too sequential_:

{% Compare 'worse', 'Not recommended - too sequential' %}

```js
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

{% CompareCaption %}
Looks much neater, but my second fetch doesn't begin until my first fetch has
been fully read, and so on. This is much slower than the promises example that
performs the fetches in parallel. Thankfully there's an ideal middle-ground.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Recommended - nice and parallel' %}

```js
function markHandled(...promises) {
  Promise.allSettled(promises);
}

async function logInOrder(urls) {
  // fetch all the URLs in parallel
  const textPromises = urls.map(async (url) => {
    const response = await fetch(url);
    return response.text();
  });

  markHandled(...textPromises);

  // log them in sequence
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

{% CompareCaption %}
In this example, the URLs are fetched and read in parallel, but the "smart"
`reduce` bit is replaced with a standard, boring, readable for-loop.
{% endCompareCaption %}

{% endCompare %}


## Writing Houdini custom properties

Here's an example of setting a custom property (think: CSS variable), but now
with a syntax (type), initial value (fallback), and inheritance boolean (does
it inherit the value from it's parent or not?). The current way to do this is
through `CSS.registerProperty()` in JavaScript, but in Chromium 85 and later, the
`@property` syntax will be supported in your CSS files:

<div class="switcher">
{% Compare 'worse', 'Separate JavaScript file (Chromium 78)' %}
```js
CSS.registerProperty({
  name: '--colorPrimary',
  syntax: '<color>',
  initialValue: 'magenta',
  inherits: false
});
```
{% endCompare %}

{% Compare 'better', 'Included in CSS file (Chromium 85)' %}
```css
@property --colorPrimary {
  syntax: '<color>';
  initial-value: magenta;
  inherits: false;
}
```
{% endCompare %}
</div>

Now you can access `--colorPrimary` like any other CSS custom property, via
`var(--colorPrimary)`. However, the difference here is that `--colorPrimary` isn't
just read as a string. It has data!

CSS `backdrop-filter` applies one or more effects to an element that is translucent or transparent. To understand that, consider the images below.

<div class="switcher">
{% Compare 'worse', 'No foreground transparency' %}
{% Img src="image/admin/LOqxvB3qqVkbZBmxMmKS.png", alt="A triangle superimposed on a circle. The circle can't be seen through the triangle.", width="480", height="283" %}

```css
.frosty-glass-pane {
  backdrop-filter: blur(2px);
}
```
{% endCompare %}

{% Compare 'better', 'Foreground transparency' %}
{% Img src="image/admin/VbyjpS6Td39E4FudeiVg.png", alt="A triangle superimposed on a circle. The triangle is translucent, allowing the circle to be seen through it.", width="480", height="283" %}

```css/1
.frosty-glass-pane {
  opacity: .9;
  backdrop-filter: blur(2px);
}
```
{% endCompare %}
</div>

The image on the left shows how overlapping elements would be rendered if `backdrop-filter` were not used or supported. The image on the right applies a blurring effect using `backdrop-filter`. Notice that it uses `opacity` in addition to `backdrop-filter`. Without `opacity`, there would be nothing to apply blurring to. It almost goes without saying that if `opacity` is set to `1` (fully opaque) there will be no effect on the background.

Unlike the `unload` event, however, there are legitimate uses for
`beforeunload`. For example, when you want to warn the user that they have
unsaved changes they'll lose if they leave the page. In this case, it's
recommended that you only add `beforeunload` listeners when a user has unsaved
changes and then remove them immediately after the unsaved changes are saved.

{% Compare 'worse' %}
```js
window.addEventListener('beforeunload', (event) => {
  if (pageHasUnsavedChanges()) {
    event.preventDefault();
    return event.returnValue = 'Are you sure you want to exit?';
  }
});
```
{% CompareCaption %}
  The code above adds a `beforeunload` listener unconditionally.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```js
function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};

// A function that invokes a callback when the page has unsaved changes.
onPageHasUnsavedChanges(() => {
  window.addEventListener('beforeunload', beforeUnloadListener);
});

// A function that invokes a callback when the page's unsaved changes are resolved.
onAllChangesSaved(() => {
  window.removeEventListener('beforeunload', beforeUnloadListener);
});
```
{% CompareCaption %}
  The code above only adds the `beforeunload` listener when it's needed (and
  removes it when it's not).
{% endCompareCaption %}
{% endCompare %}

### Minimize use of `Cache-Control: no-store`

`Cache-Control: no-store` is an HTTP header web servers can set on responses that instructs the browser not to store the response in any HTTP cache. This should be used for resources containing sensitive user information, for example pages behind a login.

The `fieldset` element, which contains each input group (`.fieldset-item`), is using `gap: 1px` to
create the hairline borders between elements. No tricky border solution!

<div class="switcher">
{% Compare 'better', 'Filled gap' %}

```css
.grid {
  display: grid;
  gap: 1px;
  background: var(--bg-surface-1);

  & > .fieldset-item {
    background: var(--bg-surface-2);
  }
}
```

{% endCompare %}

{% Compare 'worse', 'Border trick' %}

```css
.grid {
  display: grid;

  & > .fieldset-item {
    background: var(--bg-surface-2);

    &:not(:last-child) {
      border-bottom: 1px solid var(--bg-surface-1);
    }
  }
}
```
{% endCompare %}
</div>

### Natural grid wrapping

The most complex layout ended up being the macro layout, the logical layout
system between `<main>` and `<form>`.

<div class="switcher">
{% Compare 'better', 'input' %}

```html
<input
  type="checkbox"
  id="text-notifications"
  name="text-notifications"
>
```

{% endCompare %}

{% Compare 'better', 'label' %}

```html
<label for="text-notifications">
  <h3>Text Messages</h3>
  <small>Get notified about all text messages sent to your device</small>
</label>
```
{% endCompare %}
</div>

The `fieldset` element, which contains each input group (`.fieldset-item`), is using `gap: 1px` to
create the hairline borders between elements. No tricky border solution!

<div class="switcher">
{% Compare 'better', 'Filled gap' %}

```css
.grid {
  display: grid;
  gap: 1px;
  background: var(--bg-surface-1);

  & > .fieldset-item {
    background: var(--bg-surface-2);
  }
}
```

{% endCompare %}

{% Compare 'worse', 'Border trick' %}

```css
.grid {
  display: grid;

  & > .fieldset-item {
    background: var(--bg-surface-2);

    &:not(:last-child) {
      border-bottom: 1px solid var(--bg-surface-1);
    }
  }
}
```
{% endCompare %}
</div>

#### Tabs `<header>` layout {: #tabs-header }

The next layout is nearly the same: I use flex to create vertical ordering.

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<snap-tabs>
  <header>
    <nav></nav>
    <span class="snap-indicator"></span>
  </header>
  <section></section>
</snap-tabs>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css/1-2
header {
  display: flex;
  flex-direction: column;
}
```
{% endCompare %}
</div>

The `.snap-indicator` should travel horizontally with the group of links, and
this header layout helps set that stage. No absolute positioned elements here!

Gentle Flex is a truer centering-*only* strategy. It's soft and gentle, because
unlike `place-content: center`, no children's box sizes are changed during the
centering. As gently as possible, all items are stacked, centered, and spaced.

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

<div class="switcher">
{% Compare 'better', 'Pros' %}
- Only handles alignment, direction, and distribution
- Edits and maintenance are all in one spot
- Gap guarantees equal spacing amongst _n_ children

{% endCompare %}

{% Compare 'worse', 'Cons' %}
- Most lines of code

{% endCompare %}
</div>

**Great for** both macro and micro layouts.

### Usage
`gap` accepts any CSS [length](https://drafts.csswg.org/css-values-4/#lengths)
or [percentage](https://www.w3.org/TR/css-values-3/#percentages) as a value.

```css
.gap-example {
  display: grid;
  gap: 10px;
  gap: 2ch;
  gap: 5%;
  gap: 1em;
  gap: 3vmax;
}
```

<br>

Gap can be passed 1 length, which will be used for both row and column.

<div class="switcher">
{% Compare 'better', 'Shorthand' %}
```css
.grid {
  display: grid;
  gap: 10px;
}
```

{% CompareCaption %}
Set both rows and columns **together** at once
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Expanded' %}
```css/2-3
.grid {
  display: grid;
  row-gap: 10px;
  column-gap: 10px;
}
```

{% endCompare %}
</div>

<br>

Gap can be passed 2 lengths, which will be used for row and column.

<div class="switcher">
{% Compare 'better', 'Shorthand' %}
```css
.grid {
  display: grid;
  gap: 10px 5%;
}
```

{% CompareCaption %}
Set both rows and columns **separately** at once
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Expanded' %}
```css/2-3
.grid {
  display: grid;
  row-gap: 10px;
  column-gap: 5%;
}
```

{% endCompare %}
</div>
