---
title: "Modern client-side routing: the App History API"
subhead: "Standardizing client-side routing through a brand new API which completely overhauls building single-page applications."
authors:
  - samthor
date: 2021-08-25
hero: image/QMjXarRXcMarxQddwrEdPvHVM242/aDcKXxmGtrMVmwZK43Ta.jpg
alt: "Sculpture adorning the General Post Office, Sydney, Australia"
description: "Learn about the App History API, a new API which adds improved functionality to build single-page applications."
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
---

Single-page applications, or SPAs, are defined by a core feature: dynamically rewriting their content as the user interacts with the site, instead of the default method of loading entirely new pages from the server.

While SPAs have been able to bring you this feature via the History API (or in limited cases, by adjusting the site's #hash part), it's a [clunky API][clunky-history-api] developed long-before SPAs were the norm—and the web is crying out for a completely new approach.
The App History API is a proposed API that completely overhauls this space, rather than trying to simply patch History API's rough edges.
(For example, [Scroll Restoration][scroll-restoration] patched the History API rather than trying to reinvent it.)

{% Aside %}

The App History API is currently in development, and available in Chrome 95 and beyond behind the "Experimental Web Platform features" flag.
[Check out a demo here][demo].

{% endAside %}

This post describes the App History API at a high level.
If you'd like to read the technical proposal, [check out the Draft Report in the WICG repository][wicg-report].

## Example Usage

To use the App History API, start by adding a "navigate" handler for the `AppHistoryNavigationEvent` event on the global `appHistory` object.
This event is fundamentally _centralized_: it will fire for all types of navigations, whether because the user performed an action (such as clicking a link, submitting a form, or going back and forward) or when navigation is triggered programmatically (i.e., via your site's code).
In most cases, it lets your code override the browser's default behavior for that action.
For SPAs, that likely means keeping the user on the same page and loading or changing the site's content.

{% Aside %}

This new event is very loosely analogous to the History API's "popstate" event, although way more powerful.
Read on to find out more!

{% endAside %}

The specific `AppHistoryNavigationEvent` passed to the "navigate" event handler contains information about the navigation, such as the destination URL, and allows you to respond to the navigation in one centralized place.
A basic implementation for the handler, on example.com, could look like this:

```js
appHistory.addEventListener("navigate", event => {
  switch (event.destination.url) {
    case 'https://example.com/':
      event.transitionWhile(loadIndexPage());
      break;
    case 'https://example.com/cats':
      event.transitionWhile(loadCatsPage());
      break;
  }
});
```

You can handle the event in one of two ways:

- by calling `transitionWhile()` (as described above) to handle the navigation
- by calling `preventDefault()`, which can cancel the navigation completely

This example calls `transitionWhile()` on the event with a promise generated from async helper functions.
By calling this method with a response, the browser knows that your code needs to run to configure the next state of your site.
This will create a transition object, which tracks the success or failure of the `Promise`.
For example, it might reject because the user's browser is offline.

Both `transitionWhile()` and `preventDefault()` are usually allowed, but have cases where they're unable to be called.
You can't handle navigations via `transitionWhile()` if the navigation is a cross-origin navigation: i.e., if it's leaving your domain.
And you can't cancel a navigation via `preventDefault()` if the user is pressing the Back or Forward buttons in their browser; you should not be able to trap your users on your site.
(This is [being discussed on GitHub][back-forward-discuss].)

Even if you can't stop or intercept the navigation itself, the "navigate" event handler will still fire.
It's _informative_, so your code could, e.g., log an Analytics event to indicate that a user is leaving your site.

## Why another event handler?

The "navigate" event handler centralizes handling URL changes inside a SPA.
This is a difficult proposition using older APIs.
If you've ever written the routing for your own SPA using the History API, you might have added code like this:

```js
function updatePage(event) {
  event.preventDefault();  // we're handling this link
  window.location.pushState(null, '', event.target.href);
  // TODO: set up page based on new URL
}
const links = [...document.querySelectorAll('a[href]')];
links.forEach(link => link.addEventListener('click', updatePage));
```

This is fine, but not exhaustive.
Links might come and go on your page, and they're not the only way users can navigate through pages.
E.g., they may submit a form or even use an [image map].
Your page might deal with these, but there's a long tail of possibilities which could just be simplified—something that the new App History API achieves.

Personally, the History API often _feels_ like it could go some way to help with these possibilities.
However, it really only has two surface areas: responding if the user presses Back or Forward in their browser, plus pushing and replacing URLs.
It doesn't have an analogy to "navigate", except if you manually set up listeners for, e.g., click events, as demonstrated above.

## Transition

When your code calls `transitionWhile()` from within its "navigate" handler, it informs the browser that it's now preparing the page for the new, updated state; and that the navigation may take some time (because the call accepts a `Promise`).

As such, this API introduces a semantic concept that the browser understands: a SPA navigation is currently occurring, over time, changing the document from a previous URL and state to a new one.
This has a number of potential benefits, including that of accessibility: browsers can surface the beginning, end, or potential failure of a navigation in a variety of ways.
Chrome, for example, intends to [reactivate its native loading indicator][loading-crbug] during this time.

### Transition Success and Failure

After the "navigate" handler completes normally, the URL being navigated to will take effect.
This happens immediately, even if you've called `transitionWhile()`.
But if you have called it with a `Promise`, one of two things will happen:

- If that succeeds (or you did not call `transitionWhile()`), the App History API will fire "navigatesuccess" with an `Event`.
- If the `Promise` rejects, the API will fire "navigateerror" with an `ErrorEvent`.

These events allow your code to deal with success or failure in a centralized way.
For example, you might deal with success by hiding a previously displayed progress indicator, like this:

```js
appHistory.addEventListener('navigatesuccess', event => {
  loadingIndicator.hidden = true;
});
```

Or you might show an error message on failure (i.e., if the `Promise` passed to `transitionWhile` rejected):

```js
appHistory.addEventListener('navigateerror', event => {
  loadingIndicator.hidden = true;  // also hide indicator
  showMessage(`Failed to load page: ${event.message}`);
});
```

The "navigateerror" event handler, which receives an `ErrorEvent`, is particularly handy as it's guaranteed to receive any errors from your code that's setting up a new page.
You can simply `await fetch()` knowing that if the network is unavailable, the error will eventually be routed to "navigateerror".

### Transition Context and Rollback

During the period between the initial "navigate" event and the exact time these terminal events fire, there'll also be an object available that gives some context on the navigation that's occurring.
It's available at `appHistory.transition`.
You're able to use this object to _rollback_ this navigation, pretending as if the navigation never occurred.
Your site might choose to do this in response to a user action, or perhaps if the loaded URL is invalid and should never appear in the user's history.
For example:

```js
appHistory.addEventListener('navigateerror', event => {
  const attemptedLoadURL = location.href;
  const previousURL = appHistory.transition.from;
  console.warn('Failed to load', attemptedLoadURL, 'returning to', previousURL);
  appHistory.transition.rollback();
});
```

Like many of the features in the App History API, this call to `rollback()` is a semantic action that implies meaning to the browser.
If a clicked `<a href>` fails to load and rolls back, the URL won't appear in the user's session history (for Forward or Back navigation).

{% Aside %}

Although calling `rollback()` on error is useful in some situations, you should avoid it in the general case.
You're more likely to show an error message, perhaps so the user can try a reload to get their content.

{% endAside %}

### Abort Signals

Since you're able to do asynchronous work while preparing a new page, it's possible that the transition your code is handling (to load a specific URL or state) might get preempted, or considered out-of-date.
This might happen because the `rollback()` method was invoked, the user just clicked on another link, or your code itself throws an error.

To deal with any of these possibilities, the event passed to the "navigate" handler contains a property called `signal`, which is an instance of `AbortSignal`.
For more information see [Abortable fetch][abortable-fetch].
The short version is it basically provides an object that fires an event when you should stop your work.
Notably, you can pass an `AbortSignal` to any calls you make to `fetch()`, which will cancel in-flight network requests if the navigation is preempted.
This will both save the user's bandwidth, and reject the `Promise` returned by `fetch()`, preventing any following code from e.g., updating the DOM to show a now invalid page navigation.

For a concrete example, you might set up loading a page of cat memes with a `fetch()` call in your handler.
By passing the `signal` to it, the fetch will be cancelled if the user decides to instead load a different page on your site before the `fetch` completes.
Take a look:

```js
appHistory.addEventListener("navigate", event => {
  if (isCatsUrl(event.destination.url)) {
    const method = async () => {
      const request = await fetch('/cat-memes.json', { signal: event.signal });
      const json = await request.json();
      // TODO: do something with cat memes json
    };
    event.transitionWhile(method());
  } else {
    // load some other page
  }
});
```

## App History Entries

The `AppHistory` interface provides the current entry through its `current` property.
This is an object which describes where the user is right now.
This entry includes the current URL, metadata that can be used to identify this entry over time, and developer-provided state.

{% Aside %}

Even sites that do not explicitly use the App History API will have a "current entry", and the entry is even updated or replaced if you use the older methods in the History API, `history.pushState()` and `history.replaceState()`, respectively.

{% endAside %}

The metadata includes `key`, a unique string property of each entry which represents the current entry and its _slot_.
This key remains the same even if the current entry's URL or state changes.
It's still in the same slot.
Conversely, if a user presses Back and then re-opens the same page, `key` will change as this new entry creates a new slot.

To a developer, "key" is useful because the App History API allows you to directly navigate the user to an entry with a matching key.
You're able to hold onto it, even in the states of other entries, in order to easily jump between pages.

```js
// On JS startup, get the key of the first loaded page
// so the user can always go back there.
const { key } = appHistory.current;
backToHomeButton.onclick = () => appHistory.goTo(key);

// Navigate away, but the button will always work.
await appHistory.navigate('/another_url');
```

### State

The App History API surfaces a notion of "state", which is developer-provided information that is stored persistently on the current history entry, but which isn't directly visible to the user.
This is extremely similar to but improved from `history.state` in the History API.

In the App History API, you can call the `AppHistoryEntry.getState()` method of the current entry (or any entry) to return a copy of its state.
By default, this will be `undefined`.
You can synchronously set the state for the current `AppHistoryEntry` by calling:

```js
appHistory.updateCurrent({ state: something });
```

You can also set the state when navigating programmatically with `appHistory.navigate()` (this is [described below](#programmatic-navigation)).

In the App History API, the state returned from `.getState()` is a copy of the previously set state.
If you modify it, the stored version won't also change.
For example:

```js
appHistory.updateCurrent({ state: { count: 1 }});

const state = appHistory.current.getState();
state.count = 2;

console.info(appHistory.current.getState());  // count will still be one
```

### Access All Entries

The "current entry" is not all, though.
The API also provides a way to access the entire list of entries that a user has navigated through while using your site via its `appHistory.entries()` call, which returns a snapshot array of entries.
This could be used to, e.g., show a different UI based on how the user navigated to a certain page, or just to look back at the previous URLs or their states.
This is impossible with the current History API.

It's possible to handle events on `AppHistoryEntry`.
These events include "dispose" (if the entry is no longer accessible), along with "navigateto" and "navigatefrom".
For example, you might add a "navigatefrom" handler to clean up some state when the user leaves a specific page (either by forward navigation or their Back or Forward button).

## Examples

The "navigate" event fires for all types of navigations, as mentioned above.
(There's actually a [long appendix in the spec][long-nav-appendix] of all possible types.)

While for many sites the most common case will be when the user clicks a `<a href="...">`, there are two notable, more complex navigation types that are worth covering.

### Programmatic Navigation {: #programmatic-navigation }

First is programmatic navigation, where navigation is caused by a method call inside youur client-side code.

You can call `appHistory.navigate('/another_page')` from anywhere in your code to cause a navigation.
This will be handled by the centralized event handler registered on the "navigate" handler, and your centralized handler will be called synchronously.

This is intended as an improved aggregation of older methods like `location.assign()` and friends, plus the History API's methods `pushState()` and `replacestate()`.

{% Aside %}

These older programmatic methods for changing the URL are all still supported with the App History API and now fire the "navigate" handler.
That is, they're also handled centrally.
Their signatures aren't modified in any way (i.e., they won't now return a `Promise`) by this new specification, and we imagine that in an older codebase, they'll be replaced by calls to `.navigate()` over time.

{% endAside %}

The `AppHistory.navigate()` method returns a `Promise`, so the invoker can wait until the transition is complete (or is rejected due to failure or being preempted by another navigation).
It also has an optional options object which controls how the navigation will occur.
These options will allow you to `replace` the current URL, set a new immutable `state` (to be made available via `AppHistoryEntry.getState()`), and configure `AppHistoryNavigateEvent.info`.

The `info` property is worth calling out.
It allows you to pass transient information about this specific navigation event into the "navigate" handler.
This could be useful to, for example, denote a particular animation that causes the next page to appear.
(The alternative might be to set a global variable or include it as part of the #hash. Both options are a bit awkward.)
Notably, this `info` won't be replayed if a user later causes navigation, e.g., via their Back and Forward buttons.
In fact, it will always be `undefined` in those cases.

<figure class="w-figure w-figure--fullbleed">
  {% Video
    src="video/QMjXarRXcMarxQddwrEdPvHVM242/UGyXlkr5Cbn3Db84FwqU.mov",
    autoplay="true",
    loop="true",
    width="320",
    height="320",
    muted="true",
    class="w-screenshot"
  %}
  <figcaption class="w-figure">
    <a href="https://wiry-tricolor-lipstick.glitch.me" target="_blank">Demo of opening from left or right</a>
  </figcaption>
</figure>

The `AppHistory` interface also has a number of other navigation methods.
I've already mentioned `goTo()` (which accepts a `key` that denotes a specific entry in the user's history) and `navigate()`.
It also includes `back()`, `forward()` and `reload()`.
These methods are all handled—just like `navigate()`—by the centralized "navigate" event handler.

### Form Submissions

Secondly, HTML `<form>` submission via POST is a special type of navigation, and the App History API can intercept it.
While it includes an additional payload, the navigation is still handled centrally by the "navigate" handler.

Form submission can be detected by looking for the `formData` property on the `AppHistoryNavigateEvent`.
Here's an example that simply turns any form submission into one which stays on the current page via `fetch()`:

```js
appHistory.addEventListener("navigate", event => {
  if (event.formData && event.canTransition) {
    // User submitted a POST form to a same-domain URL
    // (If canTransition is false, the event is just informative:
    // you can't intercept this request, although you could
    // likely still call .preventDefault() to stop it completely).

    const submitToServer = async () => {
      await fetch(event.destination.url, { method: 'POST', body: event.formData });
      // You could navigate again with {replace: true} to change the URL here,
      // which might indicate "done"
    };
    event.transitionWhile(submitToServer());
  }
});
```

## What's missing?

Despite the centralized nature of the "navigate" event handler, the current App History API specification doesn't trigger "navigate" on a page's first load.
And for sites which use [Server Side Rendering][ssr-definition] (SSR) for all states, this might be fine—your server could return the correct initial state, which is the fastest way to get content to your users.
But sites that leverage client-side code to create their pages may need to create an additional function to initialize their page.
This is up for discussion [in the app-history repo][initial-event-discuss].

Another intentional design choice of the App History API is that it operates only within a single frame—that is, the top-level page, or a single specific `<iframe>`.
This has a number of interesting implications that are [further documented in the spec][backforward-note], but in practice, will reduce developer confusion.
The previous History API has a number of confusing edge cases, like support for frames, and the reimagined App History API handles these edge cases from the get-go.

{% Aside %}

In the near future, it's hoped that [an unrelated change to the HTML spec][iframe-historyless] could introduce "historyless" IFrames which do not participate in the browser's history.
IFrames which change their URLs have classically confused both developers and users because these changes have no effect on the user's URL bar or overall page title.
So, e.g., a user pressing Back or Forward in their browser might not see an immediately obvious effect.

{% endAside %}

Lastly, there's not yet consensus on programmatically modifying or rearranging the list of entries the user has navigated through.
This is [currently under discussion][bug-edit-entries], but one option could be to allow only deletions: either historic entries or "all future entries".
The latter would allow temporary state.
E.g., as a developer, I could:

- ask the user a question by navigating to new URL or state
- allow the user to complete their work (or go Back)
- remove a history entry on completion of a task

This could be perfect for temporary modals or interstitals: the new URL is something that a user can use the Back gesture to leave from, but they then cannot accidentaly go Forward to open it again (because the entry has been removed).
This is just not possible with the current History API.

## Try the App History API

You can try the App History API in Chrome 95 and above by enabling the "Experimental Web Platform features" flag.
You can also [try out a demo][demo] by [Domenic Denicola][domenic].

We're especially eager for feedback on issues labelled with ["feedback wanted"][feedback-wanted] on GitHub.
You can also check out the repo and spec more generally at [https://github.com/WICG/app-history][repo], including filing new issues.

While the classic History API appears straightforward, it's not very well-defined and has [a large number of issues][history-api-issues] around corner cases and how it has been implemented differently across browsers.
We hope you consider providing feedback on the new App History API.

## References

* [WICG/app-history][repo]
* [Mozilla Standards Position][mozilla-position]
* [Intent To Prototype][i2p]
* [TAG review][w3ctag]
* [Chromestatus entry][chromestatus]

## Acknowledgements

Thanks to [Thomas Steiner][thomassteiner], [Domenic Denicola][domenic] and Nate Chapin for reviewing this post.
Hero image from [Unsplash][hero-image], by [Jeremy Zero][hero-image-by].

[clunky-history-api]: https://html5doctor.com/interview-with-ian-hickson-html-editor/#:~:text=My%20biggest%20mistake%E2%80%A6there%20are%20so%20many%20to%20choose%20from!%20pushState()%20is%20my%20favourite%20mistake
[scroll-restoration]: https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
[image map]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map
[back-forward-discuss]: https://github.com/WICG/app-history/issues/32
[loading-crbug]: https://bugs.chromium.org/p/chromium/issues/detail?id=1241202
[abortable-fetch]: https://developers.google.com/web/updates/2017/09/abortable-fetch
[ssr-definition]: https://developers.google.com/web/updates/2019/02/rendering-on-the-web#terminology
[initial-event-discuss]: https://github.com/WICG/app-history/issues/31
[backforward-note]: https://github.com/WICG/app-history#warning-backforward-are-not-always-opposites
[iframe-historyless]: https://github.com/whatwg/html/issues/6501
[feedback-wanted]: https://github.com/WICG/app-history/issues?q=is%3Aissue+is%3Aopen+label%3A%22feedback+wanted%22
[history-api-issues]: https://github.com/whatwg/html/issues?q=is%3Aissue+is%3Aopen+history
[mozilla-position]: https://github.com/mozilla/standards-positions/issues/543
[i2p]: https://groups.google.com/a/chromium.org/g/blink-dev/c/R1D5xYccqb0/m/8ukfzdVSAgAJ?utm_medium=email&utm_source=footer
[w3ctag]: https://github.com/w3ctag/design-reviews/issues/605
[chromestatus]: https://chromestatus.com/features/6232287446302720
[hero-image]: https://unsplash.com/photos/bGYguEqV2lk
[hero-image-by]: https://unsplash.com/@jeremy0
[thomassteiner]: https://web.dev/authors/thomassteiner/
[domenic]: https://web.dev/authors/domenic/
[demo]: https://gigantic-honored-octagon.glitch.me/
[wicg-report]: https://wicg.github.io/app-history/
[repo]: https://github.com/WICG/app-history
[bug-edit-entries]: https://github.com/WICG/app-history/issues/9
[long-nav-appendix]: https://github.com/WICG/app-history#appendix-types-of-navigations
