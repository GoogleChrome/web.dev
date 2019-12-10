---
title: Disallowing synchronous XMLHTTPRequest() during page dismissal
subhead: Eliminating a bad user experience
description: |
  It's common for a page or app to have unsubmitted analytics or other data at
  the time a user closes it. Sites use a synchronous call to `XMLHTTPRequest()`
  to keep the page or app open until its data is passed to the server. It hurts
  the user experience and ignores better ways to save data. Chrome 80 implements
  a recent spec change to address this
authors:
  - joemedley
date: 2019-12-18
hero: hero.jpg
alt: Roadblock barricades
tags:
  - post
  - deprecation
---

It's common for a page or app to have unsubmitted analytics or other data at the
time a user closes it. To prevent data loss, some sites use a synchronous call
to `XMLHTTPRequest()` to keep the page or app open until its data is passed to
the server. Not only are there better ways to save data, this technique creates
a bad user experience by delaying closing of a page for up to several seconds.

This needs to change and rowsers are responding. The `XMLHTTPRequest()`
specification is already [slated for deprecation and
removal](https://xhr.spec.whatwg.org/#sync-warning). Chrome 80 takes the first
step by disallowing synchronous calls inside several event handlers,
specifically `beforeunload`, `unload`, `pagehide`, and `visibilitychange` when
it is fired in the dismissal. WebKit also recently landed [a commit implementing
the same behavior change](https://bugs.webkit.org/show_bug.cgi?id=204912)

In this article I'll briefly describe options for those who need time to update
their sites and outline the alternatives to `XMLHTTPRequest()`.

## Temporary opt-outs

Chrome does not simply want to pull the plug on this feature, which is why a few
temporary opt-out options are available. For sites on the internet, [an origin
trial is
available](https://developers.chrome.com/origintrials/#/view_trial/4391009636686233601).
With this, you add an origin-specific token to your page headers that enables
synchronous `XMLHTTPRequest()` calls. This option ends shortly before Chrome 86
ships, sometime in late October of 2020. Enterprise Chrome customers can also
use the  `AllowSyncXHRInPageDismissal` policy flag, which ends at the same time.

## Alternatives

Regardless of how you send data back to the server, it's best to avoid waiting
until page unload to send all the data at once. Aside from creating a bad user
experience, you risk data loss if something goes wrong.  Unload events [often
don't fire on mobile
browsers](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/)
because there are [many ways to
close](https://developers.google.com/web/updates/2018/07/page-lifecycle-api) a
tab or browser on mobile operating systems without the unload event firing. With
`XMLHTTPRequest()` small payloads was a choice. Now it's a requirement. Both of
its alternatives have an upload limit of 64 kilobytes per context, as required
by the specification.

### Fetch keepalive

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
provides a robust means of dealing with server interactions and [a consistent
interface](https://fetch.spec.whatwg.org/#preface) for use across different
platform APIs. Among its options is one that ensures a request continues whether
or not the page that made it stays open. This is what keepalive does as I've
shown below.

```js/5
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
promise that resolves with a Response object. Since I'm trying to get out of the
way of the page's unloading, I chose not to do anything with it.

### SendBeacon()

[`SendBecaon()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
actually uses the Fetch API under the hood, which is why it has the same 64
kilobyte payload limitation and why it also ensures that a request continues
after a page unload. It's primary advantage is its simplicity. It lets you
submit your data with a single line of code.

```js
window.addEventListener('unload', {
  navigator.sendBeacon('/siteAnalytics', getStatistics());
}
```

## Conclusion

With the [increased availability of
`fetch()'](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Browser_compatibility)
across browsers it's hoped that `XMLHTTPRequest()` can eventually be removed
from the web platform. Browser vendors are in agreement about this, but it will
take time. Deprecating one of its worst use cases is a first step that improves
the user experience for everyone.

*Photo by [Matthew Hamilton](https://unsplash.com/@thatsmrbio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/roadblock?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
