---
title: Improving page dismissal in synchronous XMLHttpRequest()
subhead: Reducing delayed navigations
description: |
  It's common for a page or app to have unsubmitted analytics or other data at
  the time a user closes it. Sites use a synchronous call to XMLHttpRequest()
  to keep the page or app open until its data is passed to the server. It hurts
  the user experience and ignores better ways to save data. Chrome 80 implements
  a recent spec change to address this.
authors:
  - joemedley
date: 2019-12-18
updated: 2020-07-17
hero: image/admin/DF5rqLYGcuCpQZv1vXKS.jpg
alt: Roadblock barricades
tags:
  - blog
  - deprecation
---

It's common for a page or app to have unsubmitted analytics or other data at the
time a user closes it. To prevent data loss, some sites use a synchronous call
to `XMLHttpRequest()` to keep the page or app open until its data is passed to
the server. Not only are there better ways to save data, but this technique creates
a bad user experience by delaying closing of the page for up to several seconds.

This practice needs to change, and browsers are responding. The `XMLHttpRequest()`
specification is already [slated for deprecation and
removal](https://xhr.spec.whatwg.org/#sync-warning). Chrome 80 takes the first
step by disallowing synchronous calls inside several event handlers,
specifically `beforeunload`, `unload`, `pagehide`, and `visibilitychange` when
they are fired in the dismissal. WebKit also recently landed [a commit implementing
the same behavior change](https://bugs.webkit.org/show_bug.cgi?id=204912).

In this article I'll briefly describe options for those who need time to update
their sites and outline the alternatives to `XMLHttpRequest()`.

## Temporary opt-outs

Chrome does not simply want to pull the plug on `XMLHttpRequest()`, which is why a few
temporary opt-out options are available. For sites on the internet, [an origin
trial is
available](https://developers.chrome.com/origintrials/#/view_trial/4391009636686233601).
With this, you add an origin-specific token to your page headers that enables
synchronous `XMLHttpRequest()` calls. This option ends shortly before Chrome 89
ships, sometime in March 2021. Enterprise Chrome customers can also
use the  `AllowSyncXHRInPageDismissal` policy flag, which ends at the same time.

## Alternatives

Regardless of how you send data back to the server, it's best to avoid waiting
until page unload to send all the data at once. Aside from creating a bad user
experience, unload is unreliable on modern browsers and risks data loss if
something goes wrong. Specifically, unload events [often don't fire on mobile
browsers](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/)
because there are [many ways to
close](https://developers.google.com/web/updates/2018/07/page-lifecycle-api) a
tab or browser on mobile operating systems without the `unload` event firing.
With `XMLHttpRequest()`, using small payloads was a choice. Now it's a
requirement. Both of its alternatives have an upload limit of 64&nbsp;KB per
context, as required by the specification.

### Fetch keepalive

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
provides a robust means of dealing with server interactions and [a consistent
interface](https://fetch.spec.whatwg.org/#preface) for use across different
platform APIs. Among its options is `keepalive`, which ensures that a request
continues whether or not the page that made it stays open:

```js/4
window.addEventListener('unload', {
  fetch('/siteAnalytics', {
    method: 'POST',
    body: getStatistics(),
    keepalive: true
  });
}
```

The `fetch()` method has the advantage of greater control over what's sent to
the server. What I don't show in the example is that `fetch()` also returns a
promise that resolves with a `Response` object. Since I'm trying to get out of the
way of the page's unloading, I chose not to do anything with it.

### SendBeacon()

[`SendBeacon()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
actually uses the Fetch API under the hood, which is why it has the same
64&nbsp;KB payload limitation and why it also ensures that a request continues
after a page unload. Its primary advantage is its simplicity. It lets you
submit your data with a single line of code:

```js
window.addEventListener('unload', {
  navigator.sendBeacon('/siteAnalytics', getStatistics());
}
```

## Conclusion

With the [increased availability of
`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Browser_compatibility)
across browsers, `XMLHttpRequest()` will hopefully be removed
from the web platform at some point. Browser vendors agree it should be removed, but it will
take time. Deprecating one of its worst use cases is a first step that improves
the user experience for everyone.

*Photo by [Matthew Hamilton](https://unsplash.com/@thatsmrbio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/roadblock?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
