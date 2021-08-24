---
title: "Modern Client-Side Routing: The App History API"
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

Single-page applications, or SPAs, are defined by a core feature: these are websites which dynamically rewrite their content as the user interacts with the site, instead of the default method of loading entirely new pages from the server.

While SPAs have been able to bring you this feature via the History API (or in limited cases, by adjusting the site's #hash part), it's a [clunky API][clunky-history-api] developed long-before SPAs were the norm—and the web is crying out for a completely new approach.
The App History API is a proposed API that completely overhauls this space, rather than trying to simply patch up History API's rough edges (e.g., [Scroll Restoration][scroll-restoration] patched the History API rather than trying to reinvent it).

{% Aside %}

The App History API is currently in development, but available in Chromium-based browsers behind the "Experimental Web Platform features" flag.
[Check out a demo here][demo].

{% endAside %}

This post will describe the App History API at a high level.
If you'd instead like to dive straight into the technical proposal, [check out the Draft Report in the WICG repository][wicg-report].

## Example Usage

When using the App History API, you'll start by adding a handler for the "navigate" event.
This event is fundamentally _centralized_: it will fire for all types of navigations, whether because the user performed an action (such as clicking a link, submitting a form, or going back and forward) or when navigation is triggered programmatically (i.e., via your site's code).
And, in most cases, it then lets your code override the browser's default behavior for that action.
For SPAs, that likely means keeping the user on the same page and loading or changing the site's content.

{% Aside %}

This new event is very loosely analogous to the History API's "popstate" event, although way more powerful for you as a developer.
Read on to find out more!

{% endAside %}

The "navigate" event contains information about the navigation, such as the target URL, and allows you to respond to the navigation in one centralized place.
A basic implementation on example.com could look like this:

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

In this example, we call `transitionWhile()` on the event with a promise generated from async helper functions.
By calling this method with a response, the browser knows that your code needs to run to configure the next state of your site.
This will create a transition object, which tracks the success or failure of the `Promise`—for example, it might reject because the user's browser is offline.

You can handle the event in one of two ways:

- by calling `transitionWhile()` (as described above) to handle the navigation
- by calling `preventDefault()`, which can cancel the navigation completely

Both these methods are usually allowed, but have cases where they're unable to be called.
You can't handle navigations via `transitionWhile()` if the navigation is a cross-origin navigation: i.e., it's leaving your domain.
And you can't cancel a navigation via `preventDefault()` if the user is pressing the Back and Forward buttons in their browser: you should not be able to trap your users on your site.

Even if these methods aren't allowed, the "navigate" event is still _informative_, so your code could still, e.g., log an analytics event or perform cleanup.

## Why another event handler?

The "navigate" event centralizes handling URL changes inside a SPA.
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
Links might come and go on your page, and they're not the only way users can navigate through pages, e.g., they may submit a form or even use an [image map].
Your page might deal with these, but there's a long tail of possibilities which could just be simplified—something that the new App History API achieves.

Personally, the History API often _feels_ like it could go some way to help with these possibilities.
However, it really only has two surface areas: responding if the user presses Back or Forward in their browser, plus pushing and replacing URLs.
It doesn't have an analogy to "navigate", except if you manually set up listeners for, e.g., click events, as demonstrated above.

### Preventing Navigation

It's possible to completely cancel a navigation event via `preventDefault()`, causing it to be ignored.
This method must be called  synchronously inside the "navigate" event handler.
Notably, this is different from calling `transitionWhile()`, which permits the navigation, but allows your code to handle it.

As mentioned, it won't always be possible to cancel the navigation: the navigation caused by a user pressing their browser's Back and Forward buttons isn't cancelable.
There's [some discussion on GitHub][back-forward-discuss], but the goal here is that the App History API should not be able to 'lock in' a user from leaving your site via the gestures available in their browser.

## Transition

When your code calls `transitionWhile()` from within its "navigate" handler, it informs the browser that it's now preparing the page for the new, updated state; and that the navigation may take some time (because the call accepts a `Promise`).

As such, this API introduces a semantic concept that the browser understands: a SPA navigation is currently occurring, over time, changing the document from a previous URL and state to a new one.
This has a number of potential benefits, including that of accessibility: browsers can surface the beginning, end, or potential failure of a navigation in a variety of ways.
Chrome, for example, intends to [reactivate its native loading indicator][loading-crbug] during this time.

### Transition Success and Failure

After the "navigate" event completes normally, the URL being navigated to will take effect. This happens immediately, even if you've called `transitionWhile()`, but if you have called it with a `Promise`, one of two things will happen:

- If that succeeds (or you did not call `transitionWhile()`), the App History API will fire "navigatesuccess".
- If the `Promise` rejects, the API will fire "navigateerror".

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

The "navigateerror" event is particularly handy as it's guaranteed to receive any errors from your code that's setting up a new page.
You can simply `await fetch()` knowing that if the network is unavailable, the error will eventually be routed to "navigateerror".

### Transition Context and Rollback

During the period between the initial `navigate` event and the exact time these terminal events fire, there'll also be an object available that gives some context on the navigation that's occurring—it's available at `appHistory.transition`.
You're able to use this object to _rollback_ this navigation, pretending as if the navigation never occurred.
Your site might choose to do this in response to a user action, or perhaps if the URL loaded is invalid and should never appear in the user's history. For example:

```js
appHistory.addEventListener('navigateerror', event => {
  const attemptedLoadURL = location.href;
  const previousURL = appHistory.transition.from;
  console.warn('Failed to load', attemptedLoadURL, 'returning to', previousURL);
  appHistory.transition.rollback();
});
```

Like many of the features in the App History API, this call to `rollback()` is a semantic action that implies meaning to the browser.
If a page loaded through a user clicking on an `<a href>` fails to load and is rolled back, the URL won't appear in the user's session history (for Forward or Back navigation).

{% Aside %}

Calling `rollback()` on error could be useful in some situations, but avoid it in the general case.
You're more likely to show an error message, perhaps so the user can try a reload to get their content.

{% endAside %}

### Abort Signals

Since you're able to do asynchronous work while preparing a new page, it's possible that the transition your code is handling (to load a specific URL or state) might get preempted, or considered out-of-date.
This might happen because the `rollback()` method was invoked, the user just clicked on another link, or your code itself throws an error.

To deal with any of these possibilities, the event passed to the "navigate" event contains a property called `signal`, which is an instance of `AbortSignal`.
For more information see [Abortable fetch][abortable-fetch], but the short version is it basically provides an object that fires an event when you should stop your work.
Notably, you can pass along an `AbortSignal` to any calls you make to `fetch()`, which will cancel in-flight network requests if the navigation is preempted.
This will both save the user's bandwidth, and reject the `Promise` returned by `fetch()`, preventing any following code from e.g., updating the DOM to show a now invalid page navigation.

For a concrete example, you might set up loading a page of cat memes with a `fetch()` call in your handler.
By passing the `signal` along to it, the fetch will be cancelled if the user decides to instead load a different page on your site before the `fetch` completes.
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

The App History API provides what's known as the "current entry".
This is an object which describes where the user is right now.
This entry includes the current URL, metadata that can be used to identify this entry over time, and developer-provided state.

{% Aside %}

Even sites that do not explicitly use the App History API will have a "current entry", and the entry is even updated or replaced if you use the older methods in the History API, `history.pushState()` and `history.replaceState()`, respectively.

{% endAside %}

The metadata includes "key", a unique string property of each entry which represents the current entry and its _slot_.
This key remains the same even if the current entry's URL or state changes—it's still in the same slot.
Conversely, if a user presses Back and then re-opens the same page, "key" will change as this new entry creates a new slot.

As a developer, "key" is useful because the App History API allows you to directly navigate the user to an entry with a matching key—you're able to hold onto it, even in the states of other entries, in order to easily jump between pages.

```js
// On JS startup, get the key of the first loaded page
// so the user can always go back there.
const { key } = appHistory.current;
backToHomeButton.onclick = () => appHistory.goTo(key);

// Navigate away, but the button will always work.
await appHistory.navigate('/another_url');
```

### State

The App History API surfaces a notion of "state".
This is similar but improved from `history.state` from the History API. In the App History API, you can call the `.getState()` method of the current entry (or any entry) to return a copy of its state.
The returned copy is mutable, but changes to the returned object won't affect further calls to `.getState()`. For example:

```js
const state = appHistory.getState() ?? { count: 0 };
state.count++;
console.info(appHistory.getState());  // prints whatever state/count was before
```

You can update the current state by calling `appHistory.updateCurrent()` with new state:

```js
const state = appHistory.getState() ?? { count: 0 };
state.count++;
appHistory.updateCurrent({ state });
```

### Access All Entries

The "current entry" is not all, though.
The API also provides a way to access the entire list of entries that a user has navigated through while using your site via its `appHistory.entries()` call, which returns a snapshot array of entries.
This could be used to, e.g., show different UI based on how the user navigated to a certain page, or just to look back at the previous URLs or their state.
This is impossible with the current History API.

Entries themselves support events that allow operations to be taken when the entry finishes loading, is navigated to or from, or if it's disposed of from the user's history (e.g., an entry forward of the current position can be disposed because the user clicked a link and cleared the existing stack).
These events can be set up at any time, but are best configured when a brand new navigation occurs, to avoid duplicate handlers.

## Examples

The "navigate" event isn't just fired when the user clicks a link.
And while the App History API is particularly powerful even with a simple event handler, you can look for and operate differently depending on the type of navigation that is being performed.

### Programmatic Navigation

You can call `appHistory.navigate('/another_page')` from anywhere in your code to cause a navigation which will be handled by the centralized event handler registered on the "navigate" event.
This is intended as an improved aggregation of older methods like `location.assign()` and friends, plus the History API's methods `pushState()` and `replacestate()`.

{% Aside %}

These older programmatic methods for changing the URL are all still supported with the App History API and now cause "navigate"—that is, they're also handled centrally.
Their signatures aren't modified in any way (i.e., they won't now return a `Promise`) by this new specification, and we imagine that in an older codebase, they'll be replaced by calls to `.navigate()` over time.

{% endAside %}

The `.navigate()` method returns a `Promise`, so the invoker can wait until the transition is complete (or is rejected due to failure or being preempted by another navigation).
It also has an optional options object, allowing you to `replace` the current URL, set a new immutable `state` (to be made available via `getState()`), and `info`.

The `info` option is worth calling out.
It allows you to pass transient information about this specific navigation event into the "navigate" handler.
This could be useful to, for example, denote a particular animation that causes the next page to appear (the alternative might be to set a global variable or include it as part of the #hash. Both options are a bit awkward).
Notably, this `info` won't be replayed if a user later causes navigation, e.g., via their Back and Forward buttons—in fact, it will always be `undefined` in those cases.

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

The `appHistory` namespace also has a number of other navigation methods: I've already mentioned `goTo()` (which accepts a `key` that denotes a specific entry in the user's history), but it also includes `back()`, `forward()` and `reload()`.
These methods are all handled—just like `navigate()`—by the centralized "navigate" event handler.

### Form Submissions

Form submission via POST is a kind of navigation, and the App History API can intercept it.
This is no different from a navigation done by clicking a link, or calling `appHistory.navigate()`—it's handled centrally.

It can be detected by looking for the `formData` property on the event passed to "navigate".
Here's an example that simply turns any form submission into one which stays on the current page:

```js
appHistory.addEventListener("navigate", event => {
  if (event.formData && event.canTransition) {
    // User submitted a POST form to a same-domain URL
    // (If canTransition is false, the event is just informative:
    // you can't intercept this request, although you could
    // likely still call .preventDefault() to stop it completely).

    const submitToServer = async () => {
      await fetch(event.destination.url, { method: 'POST', body: event.formData });
      // You could navigate again with {replace: true} to change the URL here
    };
    event.transitionWhile(submitToServer());
  }
});
```

## What's missing?

Despite the centralized nature of the "navigate" event handler, the current App History API specification doesn't trigger "navigate" on a page's first load.
And for sites which use [Server Side Rendering][ssr-definition] (SSR) for all states, this might be fine—your server could return the correct initial state, which is the fastest way to get content to your users.
But sites that leverage mostly JS to create their pages may need to create an additional function to initialize their page.
This is up for discussion [in the app-history repo][initial-event-discuss].

Another intentional design choice of the App History API is that it operates only within a single frame—that is, the top-level page, or a single specific `<iframe>`.
This has a number of interesting implications that are [further documented in the spec][backforward-note], but in practice, will reduce developer confusion.
The previous History API has a number of confusing edge cases, like support for frames, and the reimagined App History API avoids them from the get-go.

{% Aside %}

In the near future, it's hoped that [an unrelated change to the HTML spec][iframe-historyless] could introduce "historyless" IFrames which do not participate in the browser's history whatsoever.
IFrames which change their URL have classically confused both developers and users because this change has no effect on the user's URL bar or overall page title, so, e.g., a user pressing Back or Forward in their browser might not have an immediately obvious effect.

{% endAside %}

Lastly, there's not yet consensus on programatically modifying or rearranging the list of entries the user has navigated through while using your site.
This is [currently under discussion][bug-edit-entries], but one option could be to allow only deletions: either historic entries or "all future entries".
The latter would allow temporary state, e.g., as a developer, I could:

- ask the user a question by navigating to new URL or state
- allow the user to complete their work (or go Back)
- on completion, the App History API can remove that entry

This could be perfect for temporary modals or interstitals: the new URL is something that a user can use the Back gesture to leave from, but they then cannot accidentaly go Forward to open it again (because the entry has been removed), and is just not possible with the current History API.

## Try the App History API

You can try the App History API today in Chrome or Chromium-based browsers by enabling the "Experimental Web Platform features" flag.
You can also [try out a demo][demo] by [Domenic Denicola][domenic].

We're especially eager for feedback on issues labelled with ["feedback wanted"][feedback-wanted] on GitHub.
You can also check out the repo and spec more generally at WICG/app-history, including filing new issues.

If you'd like to provide feedback on the API, please look for issues marked "feedback wanted" at GitHub.
You can also check out the repo and spec more generally at [WICG/app-history][repo].

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