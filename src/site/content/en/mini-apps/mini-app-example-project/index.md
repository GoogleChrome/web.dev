---
layout: post
title: Applying the mini app programming principles to an example project
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter shows an example project that follows the "programming the mini app way" approach.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## The app domain

To show the [mini app way of programming](/mini-app-programming-way/)
applied to a web app, I needed a small but complete enough app idea.
[High-intensity interval training](https://en.wikipedia.org/wiki/High-intensity_interval_training) (HIIT)
is a cardiovascular exercise strategy of alternating sets of short periods of intense anaerobic exercise with less intense recovery periods.
Many HIIT trainings use HIIT timers, for example, this [30&nbsp;minute online session](https://www.youtube.com/watch?v=tXOZS3AKKOw)
from [The Body Coach TV](https://www.youtube.com/user/thebodycoach1) YouTube channel.

<div class="w-columns">
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tUl2jNm2bFqGBAFF5s63.png", alt="HIIT training online session with green high intensity timer.", width="800", height="450" %}
    <figcaption class="w-figcaption">
      Active period.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMUgX3WJ4ZfQX38zHP75.png", alt="HIIT training online session with red low intensity timer.", width="800", height="450" %}
    <figcaption class="w-figcaption">
      Resting period.
    </figcaption>
  </figure>
</div>

## HIIT Time example app

For this chapter, I have built a basic example of such a HIIT timer application aptly named
"HIIT Time" that lets the user define and manage various timers,
always consisting of a high and a low intensity interval,
and then select one of them for a training session.
It is a responsive app with a navbar, a tabbar, and three pages:

- **Workout:** The active page during a workout. It lets the user select one of the timers
  and features three progress rings: the number of sets, the active period, and the resting period.
- **Timers:** Manages existing timers and lets the user create new ones.
- **Preferences:** Allows toggling sound effects and speech output and selecting language and theme.

The following screenshots give an impression of the application.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9RYkQ17tlEy79NlAIFfP.svg", alt="HIIT Time example app in portrait mode.", width="800", height="450" %}
  <figcaption class="w-figcaption">
    HIIT Time "Workout" tab in portrait mode.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SNHMWFvHtCYHEfC9SHPl.svg", alt="HIIT Time example app in landscape mode.", width="800", height="450" %}
  <figcaption class="w-figcaption">
    HIIT Time "Workout" tab in landscape mode.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/f7uqTk1PNMVaHob7FDzA.svg", alt="HIIT Time example app showing management of a timer.", width="800", height="450" %}
  <figcaption class="w-figcaption">
    HIIT Time timer management.
  </figcaption>
</figure>

## App structure

As outlined above, the app consists of a navbar, a tabbar, and three pages, arranged in a grid.
Navbar and tabbar are realized as iframes with a `<div>` container in between them with three more iframes
for the pages, out of which one is always visible and dependent on the active selection in the tabbar.
A final iframe pointing to `about:blank` serves for dynamically created in-app pages, which are needed for modifying existing
timers or creating new ones.
I call this pattern multi-page single-page app (MPSPA).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rv14TNs1kU0bpW5kv5bq.png", alt="Chrome DevTools view of the HTML structure of the app showing that it consists of six iframes: one for the navbar, one for the tabbar, and three grouped ones for each page of the app, with a final placeholder iframe for dynamic pages.", width="800", height="244" %}
  <figcaption class="w-figcaption">
    The app consists of six iframes.
  </figcaption>
</figure>

## Components-based lit-html markup

The structure of each page is realized as [lit-html](https://lit-html.polymer-project.org/) scaffold
that gets dynamically evaluated at runtime.
For a background on lit-html, it is an efficient, expressive, extensible HTML templating library for JavaScript.
By using it directly in the HTML files, the mental programming model is directly output-oriented.
As a programmer, you write a template of what the final output will look like,
and lit-html then fills the gaps dynamically based on your data and hooks up the event listeners.
The app makes use of third-party custom elements like [Shoelace](https://shoelace.style/)'s [`<sl-progress-ring>`](https://shoelace.style/components/progress-ring) or a self-implemented custom element called `<human-duration>`.
Since custom elements have a declarative API (for example, the `percentage` attribute of the progress ring),
they work well together with lit-html, as you can see in the listing below.

```html
<div>
  <button class="start" @click="${eventHandlers.start}" type="button">
    ${strings.START}
  </button>
  <button class="pause" @click="${eventHandlers.pause}" type="button">
    ${strings.PAUSE}
  </button>
  <button class="reset" @click="${eventHandlers.reset}" type="button">
    ${strings.RESET}
  </button>
</div>

<div class="progress-rings">
  <sl-progress-ring
    class="sets"
    percentage="${Math.floor(data.sets/data.activeTimer.sets*100)}"
  >
    <div class="progress-ring-caption">
      <span>${strings.SETS}</span>
      <span>${data.sets}</span>
    </div>
  </sl-progress-ring>
</div>
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Toz6JmkCQVt7WLscSnlP.png", alt="Three buttons and a progress ring.", width="300", height="244" %}
  <figcaption class="w-figcaption">
    Rendered section of the page corresponding to the mark-up above.
  </figcaption>
</figure>

## Programming model

Each page has a corresponding `Page` class that fills the lit-html markup with life by providing implementations
of the event handlers and providing the data for each page.
This class also supports lifecycle methods like `onShow()`, `onHide()`, `onLoad()`, and `onUnload()`.
Pages have access to a data store that serves for sharing optionally persisted per-page state and global state.
All strings are centrally managed, so internationalization is built in.
Routing is handled by the browser essentially for free, since all the app does is toggle iframe visibility and
for dynamically created pages change the `src` attribute of the placeholder iframe.
The example below shows the code for closing a dynamically created page.

```js
import Page from '../page.js';

const page = new Page({
  eventHandlers: {
    back: (e) => {
      e.preventDefault();
      window.top.history.back();
    },
  },
});
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y82LVHSxUVAehgQlDbsb.png", alt="In-app page realized as an iframe.", width="500", height="272" %}
  <figcaption class="w-figcaption">
    Navigation happens from iframe to iframe.
  </figcaption>
</figure>

## Styling

Styling of pages happens per-page in its own scoped CSS file.
This means elements can usually just be directly addressed by their element names,
since no clashes with other pages can occur.
Global styles are added to each page, so central settings like the `font-family` or the `box-sizing`
do not need to be declared repeatedly.
This is also where the themes and dark mode options are defined.
The listing below shows the rules for the Preferences page that lays out the various form elements
on a grid.

```css
main {
  max-width: 600px;
}

form {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  margin-block-end: 1rem;
}

label {
  text-align: end;
  grid-column: 1 / 2;
}

input,
select {
  grid-column: 2 / 3;
}
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/z3Op4O7OM5NQ1zz8Uah8.png", alt="HIIT Time app preferences page showing a form in grid layout.", width="500", height="312" %}
  <figcaption class="w-figcaption">
    Every page is its own world. Styling happens directly with the element names.
  </figcaption>
</figure>

## Screen wake lock

During a workout, the screen should not turn off.
On browsers that support it, HIIT Time realizes this through a [screen wake lock](/wake-lock/).
The snippet below shows how it is done.

```js
if ('wakeLock' in navigator) {
  const requestWakeLock = async () => {
    try {
      page.shared.wakeLock = await navigator.wakeLock.request('screen');
      page.shared.wakeLock.addEventListener('release', () => {
        // Nothing.
      });
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };
  // Request a screen wake lock…
  await requestWakeLock();
  // …and re-request it when the page becomes visible.
  document.addEventListener('visibilitychange', async () => {
    if (
      page.shared.wakeLock !== null &&
      document.visibilityState === 'visible'
    ) {
      await requestWakeLock();
    }
  });
}
```

## Testing the application

The HIIT Time application is available on [GitHub](https://github.com/tomayac/hiit-time).
You can play with the [demo](https://tomayac.github.io/hiit-time/) in a new window,
or right in the iframe embed below, which simulates a mobile device.

<iframe src="https://tomayac.github.io/hiit-time/#workout" width="411" height="731" loading="lazy" frameborder="0" allow="screen-wake-lock"></iframe>

{% Aside 'success' %}
  The final chapter ends this collection on mini apps with a [conclusion](/mini-app-conclusion).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
