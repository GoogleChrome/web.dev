---
layout: handbook
title: web.dev components
date: 2019-06-26
updated: 2022-01-18
description: |
  Learn how to use web.dev's UI and content components.
---

The web.dev platform includes various components to make it easy for content
contributors to include common content features, like videos, side-by-side
comparisons, and asides.

This post shows sample markup for each of web.dev's content components and
provides guidance about how to use them effectively.

## Component types

1. [Asides](#asides)
1. [Banners](#banners)
1. [Block quotes](#block-quotes)
1. [Browser Compatibility](#browsercompat)
1. [Buttons](#buttons)
1. [Callouts](#callouts)
1. [Checkbox](#checkbox)
1. [Code pattern](#codepattern)
1. [Codepen](#codepen)
1. [Columns](#columns)
1. [Code](#code)
1. [Compare](#compare)
1. [Details](#details)
1. [Glitches](#glitches)
1. [Images](#images)
1. [Instructions](#instructions)
1. [Labels](#labels)
1. [Lists](#lists)
1. [Stats](#stats)
1. [Tables](#tables)
1. [Tabs](#tabs)
1. [Tooltips](#tooltips)
1. [Video](#video)
1. [Related Card](#relatedCard)


## Asides

Use asides to provide information that's related to but distinct from the
content in the body of the post or codelab. Asides should generally be short—no
more than 2–3 lines.

Asides can contain links and formatted text, including code.

There are several kinds of asides, each for a different purpose.

### Note asides

```text
{% raw %}&#123;% Aside %&#125;
Use the note aside to provide supplemental information.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside %}
Use the note aside to provide supplemental information.
{% endAside %}

### Caution asides

```text
{% raw %}&#123;% Aside 'caution' %&#125;
Use the caution aside to indicate a potential pitfall or complication.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'caution' %}
Use the caution aside to indicate a potential pitfall or complication.
{% endAside %}

### Warning asides

```text
{% raw %}&#123;% Aside 'warning' %&#125;
The warning aside is stronger than a caution aside; use it to tell the reader
not to do something.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'warning' %}
The warning aside is stronger than a caution aside; use it to tell the reader
not to do something.
{% endAside %}

### Success asides

```text
{% raw %}&#123;% Aside 'success' %&#125;
Use the success aside to describe a successful action or an error-free status.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'success' %}
Use the success aside to describe a successful action or an error-free status.
{% endAside %}

### Celebration asides

```text
{% raw %}&#123;% Aside 'celebration' %&#125;
Use the celebration aside to celebrate events like a cross-browser launch.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'celebration' %}
Use the celebration aside to celebrate events like a cross-browser launch.
{% endAside %}

### Objective asides

```text
{% raw %}&#123;% Aside 'objective' %&#125;
Use the objective aside to define the goal of a process described in the body
copy.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'objective' %}
Use the objective aside to define the goal of a process described in the body
copy.
{% endAside %}

### Important asides

```text
{% raw %}&#123;% Aside 'important' %&#125;
Use the important aside to indicate a common problem that the reader wouldn't know
without specialized knowledge of the topic.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'important' %}
Use the important aside to indicate a common problem that the reader wouldn't know
without specialized knowledge of the topic.
{% endAside %}

### Key-term asides

```text
{% raw %}&#123;% Aside 'key-term' %&#125;
Use the key-term aside to define a term that's essential to understanding an
idea in the body copy. Key-term asides should be a single sentence that
includes the term in italics. For example, "A _portal_ is…"
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'key-term' %}
Use the key-term aside to define a term that's essential to understanding an
idea in the body copy. Key-term asides should be a single sentence that
includes the term in italics. For example, "A _portal_ is…"
{% endAside %}

### Codelab asides

```text
{% raw %}&#123;% Aside 'codelab' %&#125;
Use the codelab aside to link to an associated codelab.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'codelab' %}
  [Using Imagemin with Grunt](#)
{% endAside %}

### Update asides

```text
{% raw %}&#123;% Aside 'update' %&#125;
Use the update aside in select cases where updates concerning a developing 
situation around a certain API or metric can be effectively communicated.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'update' %}
Use the update aside in select cases where updates concerning a developing 
situation around a certain API or metric can be effectively communicated.
{% endAside %}

## Banners

### Default banners

Default banners can be added to site templates (for example, landing pages)
to provide timely information to users (for example, an alert about an
upcoming conference).
Don't use default banners in the body of a post;
instead, use the Aside component.

```text
{% raw %}{% Banner %}This is an info banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner %}This is an info banner. It supports Markdown.{% endBanner %}

```text
{% raw %}{% Banner 'caution' %}This is a caution banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner 'caution' %}This is a caution banner. It supports Markdown.{% endBanner %}

```text
{% raw %}{% Banner 'warning' %}This is a warning banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner 'warning' %}This is a warning banner. It supports Markdown.{% endBanner %}

```text
{% raw %}{% Banner %}This is a neutral banner, used to display a discreet suggestion for the user. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner %}This is a neutral banner. It supports Markdown.{% endBanner %}

## Block quotes

To include quotation in the body of an article, use `<blockquote>` tag.
You can include a `<cite>` element indicating the quote's source
at the end of a block quote:

```html
<blockquote>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin dictum a massa sit amet ullamcorper.
  </p>
  <cite>
    Jon Doe
  </cite>
</blockquote>
```

You can also use a shortcode:

```html
{% raw %}{% Blockquote 'Jon Doe' %}
[Lorem ipsum](#) dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper.
{% endBlockquote %}{% endraw %}
```

<blockquote>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin dictum a massa sit amet ullamcorper.
  </p>
  <cite>
    Jon Doe
  </cite>
</blockquote>

To embed a [pull quote](https://en.wikipedia.org/wiki/Pull_quote) in an article,
to emphasize a piece of text or a quote, you can use `pullquote` class:

```html
<blockquote data-type="pullquote">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin dictum a massa sit amet ullamcorper.
  </p>
  <cite>
    Jon Doe
  </cite>
</blockquote>
```

<blockquote data-type="pullquote">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin dictum a massa sit amet ullamcorper.</p>
  <cite>Jon Doe</cite>
</blockquote>

You can also use a shortcode with a `pullquote` attribute:

```html
{% raw %}{% Blockquote 'Jon Doe', 'pullquote' %}
[Lorem ipsum](#) dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper.
{% endBlockquote %}{% endraw %}
```

{% Blockquote 'Jon Doe', 'pullquote' %}
[Lorem ipsum](#) dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper.
{% endBlockquote %}

## Browser compatibility table {: #browsercompat }

With the `BrowserCompat` shortcode, you can embed an
[MDN - Browser Compatibility Data](https://github.com/mdn/browser-compat-data/)
widget in your post. You have to pass in the dot-separated feature ID,
as used on [BCD Schema](https://github.com/mdn/browser-compat-data), e.g. for
[Web/API/BackgroundFetchEvent](https://developer.mozilla.org/docs/Web/API/BackgroundFetchEvent)
the ID is `api.BackgroundFetchEvent`.

```text
{% raw %}{% BrowserCompat 'api.BackgroundFetchEvent' %}{% endraw %}
```

{% BrowserCompat 'api.BackgroundFetchEvent' %}

The widget will use 🗑 symbols to represent features that are deprecated:

{% BrowserCompat 'api.Document.execCommand' %}

The following JavaScript snippet, run from the DevTools console, will display the correct ID for a given MDN page that's currently open:

```js
window.alert(document.querySelector(".bc-github-link")?.href.match(/title=(.+?)\+/)[1] ?? "No browser compat widget found on the page.")
```

## Buttons

In general, you shouldn't need to add buttons to your posts.
These buttons are shown for reference.

[Detailed specification](/design-system/component/button/)

### Text buttons

<div>
  <button class="button">
    Text button
  </button>
  <button class="button">
    {% include "icons/" ~ 'plus.svg' %}
    Text button with icon
  </button>
</div>

<div>
  <button class="button" data-type="primary">
    Primary button
  </button>
  <button class="button" data-type="primary">
    {% include "icons/" ~ 'plus.svg' %}
    Primary button with icon
  </button>
</div>

<div>
  <button class="button" data-type="secondary">
    Secondary button
  </button>
  <button class="button" data-type="secondary">
    {% include "icons/" ~ 'plus.svg' %}
    Secondary button with icon
  </button>
</div>

### Icon buttons

A default icon button:

[Detailed specification](/design-system/component/icon-button/)

<div>
  <button class="icon-button" aria-label="Close">
    {% include "icons/close.svg" %}
  </button>
</div>

An icon button with tooltip:

<div>
  <button class="icon-button tooltip" aria-labelledby="icon-button-toolip">
    {% include "icons/close.svg" %}
    <span class="tooltip__content" id="icon-button-toolip">Close</span>
  </button>
</div>

## Callouts

### Codelab callouts

In general, you shouldn't need to manually add a codelab callout to your page;
instead, use the `codelabs` field in
[the post's YAML](/handbook/markup-post-codelab/#set-up-the-yaml),
which will automatically append a codelab callout to the end of the post.

{% CodelabsCallout ['codelab-fix-sneaky-404', 'codelab-art-direction'], lang %}

### Self-assessment callouts

See the [Self-assessments](/handbook/self-assessment-components) post.

## Checkbox

To align a label to the checkbox wrap the label and checkbox in an element with
a `cluster gutter-base flex-align-start` class.

[Detailed specification](/design-system/component/form-fields/#checkbox)

```html
<div class="cluster gutter-base flex-align-start">
  <input id="myCheckbox" type="checkbox" />
  <label for="myCheckbox">Lorem ipsum dolor sit amet</label>
</div>
```

<div class="cluster gutter-base flex-align-start">
  <input id="myCheckbox" type="checkbox" />
  <label for="myCheckbox">Lorem ipsum dolor sit amet</label>
</div>

## Code pattern {: #codepattern }

A component that displays a demo and code snippets side by side,
organized in tabs.

Component height is determined by the code snippet with the most
code lines.

To change the component height, specify the height value in pixels
in the shortcode.

```text
{% raw %}{% CodePattern 'pattern-id', optional-height-in-px %}{% endraw %}
```

{% CodePattern 'example-set/example-pattern', 500 %}

You can embed one of the existing patterns (from `/content/en/patterns/`
directory) or add a new one. Check out the
[examples and documentation](/patterns/example-set/) on how to write new
code patterns.


## Codepen {: #codepen }

If you don't want to use your personal account, you can use the
**web-dev-codepen-external** account to create a Codepen. Speak to a member of
the tech writing team to get access to the login and password.

```md
{% raw %}{% Codepen {
  user: 'robdodson',
  id: 'GRroyyX',
  height: 300,
  theme: 'dark',
  tab: 'css,result',
  allow: ['geolocation']
} %}{% endraw %}
```

{% Codepen {
  user: 'robdodson',
  id: 'GRroyyX',
  height: 300,
  theme: 'dark',
  tab: 'css,result',
  allow: ['geolocation']
} %}

```typescript
{% include '../../../../../../types/site/_includes/components/Codepen.d.ts' %}
```

## Columns

Any elements can be placed in a two-column layout
by wrapping them in a `<div class="switcher">` element.
At smaller viewport sizes,
elements in a two-column layout will shift to a stacked arrangement.

[Detailed specification](/design-system/css-compositions/#switcher)

```html
<div class="switcher">
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
</div>
```

<div class="switcher">
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %}
    <figcaption>
      Small image.
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %}
    <figcaption>
      Small image.
    </figcaption>
  </figure>
</div>

## Code

See the [Code](/handbook/markup-code) post.

## Compare

```text
{% raw %}&#123;% Compare 'worse' %&#125;
&#96;&#96;&#96;text
Bad code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;

&#123;% Compare 'better' %&#125;
&#96;&#96;&#96;text
Good code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;{% endraw %}
```

{% Compare 'worse' %}
```text
Bad code example
```
{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```
{% endCompare %}

### Compare with caption

````text
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
````

{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}

### Compare with custom labels

```text
{% raw %}&#123;% Compare 'worse', 'Unhelpful' %&#125;
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
&#123;% endCompare %&#125;

&#123;% Compare 'better', 'Helpful' %&#125;
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
&#123;% endCompare %&#125;{% endraw %}
```

{% Compare 'worse', 'Unhelpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

{% Compare 'better', 'Helpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

### Compare in columns

````html
<div class="switcher">
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
</div>
````

<div class="switcher">
{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}
</div>

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus
incidunt harum reprehenderit laboriosam labore consequuntur quod. Doloribus,
deleniti! Atque aliquam facilis labore odio similique provident illo culpa
assumenda perspiciatis.

## Details

### Basic details component

```text
{% raw %}&#123;% Details %&#125;

&#123;% DetailsSummary %&#125;
Details _summary_
&#123;% endDetailsSummary %&#125;

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
&#123;% endDetails %&#125;{% endraw %}
```

{% Details %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component with preview

```text/4-5
{% raw %}&#123;% Details %&#125;

&#123;% DetailsSummary %&#125;
Details _summary_
This is an optional preview. Make your preview text match the first paragraph
of your panel text.
&#123;% endDetailsSummary %&#125;

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
&#123;% endDetails %&#125;{% endraw %}
```

{% Details %}

{% DetailsSummary %}
Details _summary_
This is an optional preview. Make your preview text match the first paragraph
of your panel text.
{% endDetailsSummary %}

This is an optional preview. Make your preview text match the first paragraph
of your panel text.

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component with custom heading level

The default heading level is `h2`.
To ensure the `Details` component is in the correct place in the page hierarchy,
add a custom heading argument to the `DetailsSummary` shortcode.
For example, if the component is in an `h2` section,
use an `h3` heading.

```text/2
{% raw %}&#123;% Details %&#125;

&#123;% DetailsSummary 'h3' %&#125;
Details _summary_
&#123;% endDetailsSummary %&#125;

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
&#123;% endDetails %&#125;{% endraw %}
```

{% Details %}

{% DetailsSummary 'h3' %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component in open state

The `Details` component is closed by default.
If for some reason you want it open,
add the `open` argument to the `Details` shortcode.

```text/0
{% raw %}&#123;% Details 'open' %&#125;

&#123;% DetailsSummary %&#125;
Details _summary_
&#123;% endDetailsSummary %&#125;

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
&#123;% endDetails %&#125;{% endraw %}
```

{% Details 'open' %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

## Glitches {: #glitches }

### Create a Glitch

* Remix the [web-dev-hello-webpage](https://glitch.com/~web-dev-hello-webpage) or
  [web-dev-hello-express](https://glitch.com/~web-dev-hello-express) template.
* Click **Project options** and update the description of the Glitch.
* Update `README.md`.
* Update `package.json` (if it exists).
* Add the project to [the web.dev team on Glitch](https://glitch.com/@webdev).
* Set the avatar of the project to the [web.dev logo](https://cdn.glitch.com/9b775a52-d700-4208-84e9-18578ee75266%2Ficon.jpeg?v=1585082912878).

### Embed a Glitch

{% raw %}

```html
{% Glitch {
  id: 'tabindex-zero',
  path: 'index.html',
  previewSize: 0,
  allow: []
} %}

<!-- Or just the Glitch ID -->

{% Glitch 'tabindex-zero' %}
```

{% endraw %}

It's OK to adjust the `height` of the Glitch wrapper element
if you need more or less space.

Shortcode object fields allow for modifying how the embed is presented:

* {`string | string[]`} `allow?` List of feature policies of an IFrame either as an array of strings, or as a `;` separated list. By default the following policies are enabled:
  * `'camera', 'clipboard-read', 'clipboard-write', 'encrypted-media', 'geolocation', 'microphone', 'midi'`
* {`string`} `id` ID of Glitch project.
* {`string`} `path?` Lets you specify which source code file to show.
* {`number`} `previewSize?` Defines what percentage of the embed should be dedicated to the preview, default is 100.
* {`number`} `height?` Height, in pixels, of the Glitch wrapper element.

<!-- https://support.glitch.com/t/more-flexible-embeds/2925 -->

<!-- Don't attempt to load Glitch if we're screenshot testing. -->
{% if site.percy %}
<div style="background: aquamarine; width: 400px; height: 400px;">
  Glitch iframe placeholder
</div>
{% else %}
{% Glitch {
  id: 'tabindex-zero',
  path: 'index.html'
} %}
{% endif %}

## Images

See the [Images and video](/handbook/markup-media) post.

## Instructions

The Instruction component provides commonly used instructions for
Glitch and Chrome DevTools.
Use the Instruction component whenever possible to help ensure
content consistency and make cross-site maintenance easier.

By default, each instruction is placed in an unordered list item.
To use an ordered list, add an `ol` argument to the shortcode.
To use a paragraph, add a `none` argument.
See the [Lists section of the Grammar, mechanics, and usage post](/handbook/grammar/#lists)
for information about when to use each list type.

Instructions can be strung together to create multi-step processes.

### Glitch instructions

The most common Glitch instructions explain how to preview a Glitch sample app
by using the `remix` and `preview` arguments in two consecutive `Instruction` shortcodes:

```html
{% raw %}{% Instruction 'remix' %}
{% Instruction 'preview' %}{% endraw %}
```

{% Instruction 'remix', 'ol' %}
{% Instruction 'preview', 'ol' %}

To explain how to open the Glitch console, use the `console` argument:

{% Instruction 'console', 'ol' %}

To explain how to create a new file in a Glitch, use the `create` argument:

{% Instruction 'create', 'ol' %}

To explain how to view a Glitch's source code, use the `source` argument:

{% Instruction 'source' %}

### Reloading the page

There are three ways to instruct users to reload the page.

If users are reloading an app, use the `reload-app` argument:

{% Instruction 'reload-app' %}

If users are reloading a traditional web page, use the `reload-page` argument:

{% Instruction 'reload-page' %}

If users are reloading a page for the purpose of profiling,
use the `start-profiling` argument:

{% Instruction 'start-profiling' %}

### DevTools instructions

Instruct users how to access any tab in DevTools
by using the `devtools-tabName` argument in the Instruction shortcode.
For example, here are the instructions for the **Performance** tab:

{% Instruction 'devtools-performance', 'ol' %}

If you just need users to open DevTools, use the `devtools` argument:

{% Instruction 'devtools' %}

To tell users how to open the DevTools **Command** menu,
use the `devtools-command` argument:

{% Instruction 'devtools-command', 'ol' %}

To tell users how to disable the cache, use this sequence:

```html
{% raw %}{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}{% endraw %}
```

{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}

Instruct users how to run an audit in Lighthouse
by using the `audit-auditName` argument in the Instruction shortcode.
For example, here are the instructions for the **Performance** audit:

{% Instruction 'audit-performance', 'ol' %}

## Labels

Labels can be used to display a filename associated with a [code](/handbook/markup-code) snippet.

````text
{% raw %}{% Label %}filename.js:{% endLabel %}{% endraw %}

```js
console.log('hello');
```
````

{% Label %}filename.js:{% endLabel %}

```js
console.log('hello');
```

## Lists

See the [Lists section of the Grammar, mechanics, and usage post](/handbook/grammar/#lists)
for information about when to use each list type.

Use standard Markdown syntax for lists: `1.` for ordered lists and `- `
for unordered lists.

### Ordered list

```md
1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…
```

1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…

### Unordered list

```md
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
```

- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…

### Definition list

```md
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
```

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

## Stats

Use the Stats component to call out important statistics
about a product or service discussed in a post.
(Stats are primarily used in case studies.)

Include no more than four statistics in a single Stats component
to avoid layout issues.

[Detailed specification](/design-system/component/stats/)

```html
<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>
```

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>

Stats component with applied utility class `bg-state-good-bg color-state-good-text`:

<ul class="stats bg-state-good-bg color-state-good-text">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>

## Tables

Use the markup below to create a table.
Do _not_ use Markdown syntax;
it doesn't include the wrapper element needed
to ensure correct whitespace around the table.

[Detailed specification](/design-system/component/tables/)

```html
<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Image Format</th>
        <th>Lossy Plugin(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="#">imagemin-mozjpeg</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="#">imagemin-pngquant</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="#">imagemin-giflossy</a></td>
      </tr>
    </tbody>
    <caption>
      Imagemin plugins for filetypes.
    </caption>
  </table>
</div>
```

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Image Format</th>
        <th>Lossy Plugin(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="#">imagemin-mozjpeg</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="#">imagemin-pngquant</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="#">imagemin-giflossy</a></td>
      </tr>
    </tbody>
    <caption>
      Imagemin plugins for filetypes.
    </caption>
  </table>
</div>

<div class="table-wrapper scrollbar">
  <table data-alignment="top">
    <thead>
      <tr>
        <th>Tool</th>
        <th>Summary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Lighthouse</td>
        <td>
          <ul>
            <li>
              Budgets for different types of resources based on their size or
              count
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>webpack</td>
        <td>
          <ul>
            <li>Budgets based on sizes of assets generated by webpack</li>
            <li>Checks uncompressed sizes</li>
          </ul>
        </td>
      </tr>
    </tbody>
    <caption>
      A table with the cell content vertically aligned by data-alignment="top" exception.
    </caption>
  </table>
</div>

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Option 1</th>
        <th>Option 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td><code>@font-face {
  font-family: Helvetica;
  <strong>font-display: swap;</strong>
}
</code>
        </td>
      </tr>
    </tbody>
    <caption>
      Table using a `code` element.
    </caption>
  </table>
</div>

<div class="table-wrapper">
  <table>
    <tbody>
      <tr>
        <th>Network</th>
        <th>Device</th>
        <th>JS</th>
        <th>Images</th>
        <th>CSS</th>
        <th>HTML</th>
        <th>Fonts</th>
        <th>Total</th>
        <th>Time to Interactive budget</th>
      </tr>
      <tr>
        <td>Slow 3G</td>
        <td>Moto G4</td>
        <td>100</td>
        <td>30</td>
        <td>10</td>
        <td>10</td>
        <td>20</td>
        <td>~170 KB</td>
        <td>5s</td>
      </tr>
      <tr>
        <td>Slow 4G</td>
        <td>Moto G4</td>
        <td>200</td>
        <td>50</td>
        <td>35</td>
        <td>30</td>
        <td>30</td>
        <td>~345 KB</td>
        <td>3s</td>
      </tr>
      <tr>
        <td>WiFi</td>
        <td>Desktop</td>
        <td>300</td>
        <td>250</td>
        <td>50</td>
        <td>50</td>
        <td>100</td>
        <td>~750 KB</td>
        <td>2s</td>
      </tr>
    </tbody>
    <caption>
      Tables scroll when their width is larger than that of the content column.
    </caption>
  </table>
</div>

## Tabs

Use `web-tabs` web component to display content that refers to different
platforms or languages.
Each child of the `web-tabs` component will become a separate tab.
Use `data-label` attribute to set the tab's title. You can use markdown inside
the tab, e.g. the code blocks.

```html
{% raw %}
<web-tabs>
  <div data-label="html">
    ```html
    <p>I'm html</p>
    ```
  </div>
  <div data-label="css">
    ```css
    .class { border: 0; }
    ```
  </div>
</web-tabs>
{% endraw %}
```

<web-tabs>
  <div data-label="html" title="t">

  ```html
  <p>I'm html</p>
  ```

  </div>
  <div data-label="css">

  ```css
  .class { border: 0; }
  ```

  </div>
</web-tabs>

## Tooltips

Use tooltips to provide information about UI controls
that are too small to have a label

[Detailed specification](/design-system/component/tooltips/)

```html
<div class="tooltip" data-alignment="">
  <button class="fab" aria-labelledby="mytooltip">
    {% raw %}{% include "icons/plus.svg" %}{% endraw %}
  </button>
  <span class="tooltip__content" role="tooltip" id="mytooltip"
    >Standard alignment</span
  >
</div>
```

<div class="tooltip" data-alignment="right">
  <button class="fab" aria-labelledby="mytooltip">
    {% include "icons/plus.svg" %}
  </button>
  <span class="tooltip__content" role="tooltip" id="mytooltip"
    >Right alignment</span
  >
</div>

<div class="tooltip" data-alignment="">
  <button class="fab" aria-labelledby="mytooltip">
    {% include "icons/plus.svg" %}
  </button>
  <span class="tooltip__content" role="tooltip" id="mytooltip"
    >Standard alignment</span
  >
</div>


## Video / YouTube {: #video }

See the [Images and video](/handbook/markup-media) post.


## Related Card  {: #relatedCard }

Use related card components in the post content to display relevant posts to cross-link to other useful stuff, for example, to signpost people to Learn PWA from each individual PWA article.

The relatedCard shortcode properties available:

- `title` - the title of the card, like a show's name or a post's title.
- `description` - a description or short summary.
- `thumbnail` - the thumbnail of the card.
- `eyebrow` - the keyword to introduce the type of card.
- `url` - the url for the page the card is previewing.
- `image` - an relevant image to be displayed in the card.
- `alt` - an alt text for image. If no thumbnail is provided, this can be null.
- `theme` - the theme colours of the card. Theme colours available - tertiary, quaternary, pink, dark, and blue.

### Eyebrows

<table>
  <tr>
    <th>Keyword</th>
    <th>Use for</th>
  </tr>
  <tr>
    <td>mortarboard</td>
    <td>Learn courses or individual modules.</td>
  </tr>
  <tr>
    <td>blog</td>
    <td>Blog posts.</td>
  </tr>
  <tr>
    <td>podcast</td>
    <td>Podcasts or episodes.</td>
  </tr>
  <tr>
    <td>pattern</td>
    <td>Pattern collections or individual patterns.</td>
  </tr>
  <tr>
    <td>news</td>
    <td>News items, newly interoperable posts.</td>
  </tr>
  <tr>
    <td>featured</td>
    <td>A star, anything you want to highlight.</td>
  </tr>
</table>

### Themes

<table>
  <tr>
    <th>Theme name</th>
    <th>Color</th>
  </tr>
  <tr>
    <td>Tertiary</td>
    <td class="theme-preview"><div class="theme-preview__box bg-tertiary"></div></td>
  </tr>
  <tr>
    <td>Quaternary</td>
    <td class="theme-preview"><div class="theme-preview__box bg-quaternary"></div></td>
  </tr>
  <tr>
    <td>Pink</td>
    <td class="theme-preview"><div class="theme-preview__box bg-pink"></div></td>
  </tr>
  <tr>
    <td>Dark</td>
    <td class="theme-preview"><div class="theme-preview__box bg-dark"></div></td>
  </tr>
  <tr>
    <td>Blue</td>
    <td class="theme-preview"><div class="theme-preview__box bg-blue"></div></td>
  </tr>
</table>

{% raw %}
```md
{% RelatedCard
  title="Lorem Ipsum",
  summary="Praesent accumsan eros orci quis congue metus porta a sed dapibus magna.",
  eyebrow="learn",
  image="image/foR0vJZKULb5AGJExlazy1xYDgI2/N5mplhgLlq9qzABgyYKQ.png",
  alt="learn CSS text with abstract background",
  url="/learn/css/",
  theme="quaternary"
%}
```
{% endraw %}

{% RelatedCard
  title="Lorem Ipsum",
  summary="Praesent accumsan eros orci quis congue metus porta a sed dapibus magna.",
  eyebrow="learn",
  image="image/foR0vJZKULb5AGJExlazy1xYDgI2/N5mplhgLlq9qzABgyYKQ.png",
  alt="learn CSS text with abstract background",
  url="/learn/css/",
  theme="quaternary"
%}
