---
layout: post
title: Manifest doesn't have a maskable icon
description: |
  Learn how to add maskable icon support to your PWA.
web_lighthouse:
  - maskable-icon
date: 2020-05-06
---

[Maskable icons][guide] is a new icon format that ensures that your PWA icon looks
great on all Android devices. On newer Android devices, PWA icons that don't follow
the maskable icon format are given a white background. When you use a maskable
icon, it ensures that the icon takes up all of the space that Android provides for it.

## How the Lighthouse maskable icon audit fails

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
flags pages that do not have maskable icon support:

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="The maskable icon audit in the Lighthouse Report UI.", width="800", height="110" %}
</figure>

In order to pass the audit:

* A web app manifest must exist.
* The web app manifest must have an `icons` array.
* The `icons` array must contain one object with a `purpose` property,
  and the value of that `purpose` property must include `maskable`.

{% Aside 'caution' %}
  Lighthouse does not inspect the image that's specified as the maskable icon.
  You'll need to manually verify that the image displays well.
{% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to add maskable icon support to your PWA

1. Use [Maskable.app Editor][editor] to convert an existing icon to a maskable icon.
1. Add the maskable icon in different sizes to the `icons` array in your [web app manifest][manifest].
   Set the value of `purpose` to `maskable`. See [Values][values].

   ```json/8
   {
     …
     "icons": [
       …
       {
         "src": "path/to/maskable_icon_192.png",
         "sizes": "192x192",
         "type": "image/png",
         "purpose": "maskable"
       },
       {
         "src": "path/to/maskable_icon_512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "maskable"
       }
     ]
     …
   }
   ```

3. Use Chrome DevTools to verify that the maskable icon is displaying correctly.
   See [Are my current icons ready?](/maskable-icon/#are-my-current-icons-ready)

## Resources

- [Source code for **Manifest doesn't have a maskable icon** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/maskable-icon.js)
- [Adaptive icon support in PWAs with maskable icons][guide]
- [Maskable.app Editor][editor]
- [Add a web app manifest][manifest]
- [The `icons` property on MDN](https://developer.mozilla.org/docs/Web/Manifest/icons)

[guide]: /maskable-icon/
[editor]: https://maskable.app/editor
[manifest]: /add-manifest/
[values]: https://developer.mozilla.org/docs/Web/Manifest/icons#Values
