---
layout: post
title: Preparing for the display modes of tomorrow
subhead: PWAs can use the "display_override" property to deal with special display modes.
authors:
  - thomassteiner
date: 2021-02-25
description: |
  The display_override property allows developers to define a customized fallback chain of modes
  their PWAs should be displayed in.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/woTD625c2X9tODE58koK.jpg
alt: Web App Manifest source code excerpt.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
  - web-app-manifest
---

A [Web App Manifest](/add-manifest/) is a JSON file that tells the browser about your Progressive
Web App and how it should behave when installed on the user's desktop or mobile device.
Via the [`display`](/add-manifest/#display) property, you can customize what browser UI is shown when your app is launched. For example, you can hide the
address bar and browser chrome. Games can even be made to launch full screen.
As a quick recap, below are the display modes that are specified at the time this article was written.

<div class="w-table-wrapper">
  <table id="display-params">
    <thead>
      <tr>
        <th><strong>Property</strong></th>
        <th><strong>Use</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>fullscreen</code></td>
        <td>
          Opens the web application without any browser UI and takes
          up the entirety of the available display area.
        </td>
      </tr>
      <tr>
        <td><code>standalone</code></td>
        <td>
          Opens the web app to look and feel like a standalone
          app. The app runs in its own window, separate from the browser, and
          hides standard browser UI elements like the URL bar.
        </td>
      </tr>
      <tr>
        <td><code>minimal-ui</code></td>
        <td>
          This mode is similar to <code>standalone</code>, but provides the
          user a minimal set of UI elements for controlling navigation (such
          as back and reload).
        </td>
      </tr>
      <tr>
        <td><code>browser</code></td>
        <td>A standard browser experience.</td>
      </tr>
    </tbody>
  </table>
</div>

These display modes follow a [well-defined fallback chain](https://w3c.github.io/manifest/#dfn-fallback-display-mode)
(`"fullscreen"` → `"standalone"` → `"minimal-ui"` → `"browser"`). If a browser does not support a given
mode, it falls back to the next display mode in the chain.

## Shortcomings of the `display` property

The problem with this hard-wired fallback chain approach is threefold:

- A developer cannot request `"minimal-ui"` without being forced back into the `"browser"` display mode in case `"minimal-ui"` is not supported by a given browser.
- Developers have no way of handling cross-browser differences, like if the browser includes or excludes a [back button](https://twitter.com/ChromiumDev/status/1012065260625383425/photo/1) in the window for `"standalone"` mode.
- The current behavior makes it impossible to introduce new display
modes in a backward compatible way, since explorations like tabbed application mode do not have a
natural place in the fallback chain.

## The `display_override` property

These problems are solved by the `display_override` property, which the browser considers *before*
the `display` property. Its value is a sequence of strings that are considered in-order, and the
first supported display mode is applied. If none are supported, the browser falls back to evaluating
the `display` field.

{% Aside %}
  The `display_override` property is meant to solve special corner cases. In almost all
  circumstances the regular `display` property is what developers should reach for.
{% endAside %}

In the example below, the display mode fallback chain would be as follows.
(The details of `"window-controls-overlay"` are out-of-scope for this article.)

1. `"window-controls-overlay"` (First, look at `display_override`.)
1. `"minimal-ui"`
1. `"standalone"` (When `display_override` is exhausted, evaluate `display`.)
1. `"minimal-ui"` (Finally, use the `display` fallback chain.)
1. `"browser"`

```json
{
  "display_override": ["window-controls-overlay", "minimal-ui"],
  "display": "standalone",
}
```

{% Aside %}
  The browser will not consider `display_override` unless `display` is also present.
{% endAside %}

To remain backward compatible, any future display mode will only be acceptable as a value of
`display_override`, but not `display`.
Browsers that do not support `display_override` fall back to the `display` property and ignore
`display_override` as an unknown Web App Manifest property.

{% Aside %}
  The `display_override` property is defined independently from its potential values.
{% endAside %}

## Browser compatibility

The `display_override` property is supported as of Chromium&nbsp;89. Other browsers support the
`display` property, which caters to the majority of display mode use cases.

## Useful links

- [Explainer](https://github.com/WICG/display-override/blob/master/explainer.md)
- [Intent to Ship thread](https://groups.google.com/a/chromium.org/g/blink-dev/c/MZgYJgS4Lcs/m/NnUxG2_mAAAJ)
- [Chromium bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1092667)
- [Chrome Status entry](https://chromestatus.com/feature/5728570678706176)
- [Manifest Incubations repository](https://github.com/WICG/manifest-incubations)

## Acknowledgments

The `display_override` property was formalized by
[Daniel Murphy](https://github.com/dmurph).
