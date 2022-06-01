---
layout: post
title: "New to the web platform in May"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during May 2022. 
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during May 2022.
date: 2022-05-31
updated: 2022-06-01
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/eZEXEaB9RiOw8fB7OUtD.jpg
alt: A balloon ascending into a bright blue sky.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In May, Chrome 102, [Safari 15.5](https://developer.apple.com/documentation/safari-release-notes/safari-15_5-release-notes), [Firefox 100](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/100), and [Firefox 101](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/101) became stable.

Chrome 102 and Safari 15.5 include [the `inert` attribute](https://developer.chrome.com/blog/inert/). This removes elements from the tab order and accessibility tree if they are non-interactive. For example, an element that is currently offscreen or hidden. 

{% BrowserCompat 'html.global_attributes.inert' %}

Chrome 102 includes the new value `until-found` for the HTML `hidden` attribute. This enables find-in-page and scroll to text fragment on text that is inside a collapsed area of the page, as you might find in an accordion pattern. Find out more in the post [Making collapsed content accessible with hidden=until-found](https://developer.chrome.com/blog/hidden-until-found/).

{% BrowserCompat 'html.global_attributes.hidden.until-found_value' %}

Chrome 102 ships the [Navigation API](https://developer.chrome.com/docs/web-platform/navigation-api/), an API that standardizes client-side routing in single-page applications. This API was previously named the App History API. 

{% BrowserCompat 'api.Navigation' %}

Firefox 101 supports [constructable stylesheets](/constructable-stylesheets/). Support includes the `CSSStyleSheet()` constructor, and the `replace()`, and `replaceSync()` methods. Constructable stylesheets make it easier to create stylesheets for use with the Shadow DOM. In the following example, a stylesheet is created using the `CSSStyleSheet()` constructor, a CSS rule is added with the `replaceSync()` method, and the resulting rule is printed to the console.

```js
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync('body { color: red; }');
console.log(stylesheet.rules[0].cssText);
```

{% BrowserCompat 'api.CSSStyleSheet.CSSStyleSheet' %}

Also in Firefox 101 is the [`prefers-contrast`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-contrast) media feature, making this feature available cross-browser.

{% BrowserCompat 'css.at-rules.media.prefers-contrast' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

New betas in April were [Chrome 103](https://blog.chromium.org/2022/05/chrome-103-beta-early-navigation-hints.html) and [Firefox 102](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/102). 

Firefox 102 includes the [`update`](https://developer.mozilla.org/docs/Web/CSS/@media/update-frequency) media feature. This is used to query whether the output device can modify the appearance of content once it has been rendered. It accepts the following values:

`none`
: Once rendered the content cannot be updated. For example, a printed document.

`slow`
: The device can update the content, but too slowly to display smooth animation. For example, E-ink screens.

`fast`
: The content can change dynamically, and quickly enough to render animations. For example, a computer or phone screen.

{% BrowserCompat 'css.at-rules.media.update' %}

Chrome 103 includes the [Local Font Access API](/local-fonts/), which allows access to the user's locally installed fonts.

These beta features will land in stable browsers soon.

_Edit: A previous version of this post included mention of the [`Element.isVisible()`](https://chromestatus.com/feature/5163102852087808) method, which is not shipping in this release._