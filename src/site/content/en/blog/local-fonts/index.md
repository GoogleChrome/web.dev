---
layout: post
title: Use advanced typography with local fonts
subhead: >
  Learn how the Local Font Access API allows you to access the user's locally installed fonts and
  obtain low-level details about them.
tags:
  - blog
  - fonts
  - capabilities
authors:
  - thomassteiner
description: >
  The Local Fonts API enumerates the user's installed local fonts and provides low-level access to
  the various TrueType/OpenType tables.
date: 2020-08-24
updated: 2021-03-31
hero: image/admin/oeXwG1zSwnivzpvcUJly.jpg
alt: Page of a font book.
feedback:
  - api
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775
---

{% Aside %} The Local Font Access API is part of the
[capabilities project](https://developers.google.com/web/updates/capabilities) and is currently in
development. This post will be updated as the implementation progresses. {% endAside %}

## Web safe fonts

If you have been doing web development long enough, you may remember the so-called
[web safe fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals#Web_safe_fonts).
These fonts are known to be available on nearly all instances of the most used operating systems
(namely Windows, macOS, the most common Linux distributions, Android, and iOS). In the early 2000s,
Microsoft even spearheaded an
[initiative](https://web.archive.org/web/20020124085641/http://www.microsoft.com/typography/fontpack/default.htm)
called _TrueType core fonts for the Web_ that provided these fonts for free download with the
objective that _"whenever you visit a Web site that specifies them, you'll see pages exactly as the
site designer intended"_. Yes, this included sites set in
[Comic Sans MS](https://docs.microsoft.com/en-us/typography/font-list/comic-sans-ms). Here is a
classic web safe font stack (with the ultimate fallback of whatever
[`sans-serif`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#<generic-name>:~:text=sans%2Dserif,-Glyphs)
font) might look like this:

```css
body {
  font-family: Helvetica, Arial, sans-serif;
}
```

## Web fonts

The days where web safe fonts really mattered are long gone. Today, we have
[web fonts](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts), some of
which are even [variable fonts](/variable-fonts/) that we can tweak further by changing the values
for the various exposed axes. You can use web fonts by declaring an
[`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) block at the start of
the CSS, which specifies the font file(s) to download:

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: url('flamboyant.woff2');
}
```

After this, you can then use the custom web font by specifying the
[`font-family`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family), as normal:

```css
body {
  font-family: 'FlamboyantSansSerif';
}
```

## Local fonts as fingerprint vector

Most web fonts come from, well, the web. An interesting fact, though, is that the
[`src`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src) property in the
`@font-face` declaration, apart from the
[`url()`](<https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src#Values:~:text=%3Curl%3E%20%5B%20format(%20%3Cstring%3E%23%20)%20%5D%3F,-Specifies>)
function, also accepts a
[`local()`](<https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src#format():~:text=downloaded.-,%3Cfont%2Dface%2Dname%3E>)
function. This allows custom fonts to be loaded (surprise!) locally. If the user happens to have
_FlamboyantSansSerif_ installed on their operating system, the local copy will be used rather than
it being downloaded:

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: local('FlamboyantSansSerif'), url('flamboyant.woff2');
}
```

This approach provides a nice fallback mechanism that potentially saves bandwidth. On the Internet,
unfortunately, we cannot have nice things. The problem with the `local()` function is that it can be
abused for browser fingerprinting. Turns out, the list of fonts a user has installed can be pretty
identifying. A lot of companies have their own corporate fonts that are installed on employees'
laptops. For example, Google has a corporate font called _Google Sans_.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xivl6c1xM2VlqFf9GvgQ.png", alt="The macOS Font Book app showing a preview of the Google Sans font.", width="800", height="420", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    The Google Sans font installed on a Google employee's laptop.
  </figcaption>
</figure>

An attacker can try to determine what company someone works for by testing for the existence of a
large number of known corporate fonts like _Google Sans_. The attacker would attempt rendering text
set in these fonts on a canvas and measure the glyphs. If the glyphs match the known shape of the
corporate font, the attacker has a hit. If the glyphs do not match, the attacker knows that a
default replacement font was used since the corporate font was not installed. For full details on
this and other browser fingerprinting attacks, read the
[survey paper](http://www-sop.inria.fr/members/Nataliia.Bielova/papers/Lape-etal-20-TWEB.pdf) by
Laperdix _et al._

Company fonts apart, even just the list of installed fonts can be identifying. The situation with
this attack vector has become so bad that recently the WebKit team
[decided](https://webkit.org/tracking-prevention/#table-of-contents-toggle:~:text=Changed%20font%20availability%20to%20web%20content,but%20not%20locally%20user%2Dinstalled%20fonts)
to _"only include [in the list available fonts] web fonts and fonts that come with the operating
system, but not locally user-installed fonts"_. (And here I am, with an article on granting access
to local fonts.)

## The Local Font Access API

The beginning of this article may have put you in a negative mood. Can we really not have nice
things? Fret not. We think we can, and maybe
[everything is not hopeless](http://hyperboleandahalf.blogspot.com/2013/05/depression-part-two.html#Blog1:~:text=like-,hopeless).
But first, let me answer a question that you might be asking yourself.

### Why do we need the Local Font Access API when there are web fonts?

Professional-quality design and graphics tools have historically been difficult to deliver on the
web. One stumbling block has been an inability to access and use the full variety of professionally
constructed and hinted fonts that designers have locally installed. Web fonts enable some publishing
use-cases, but fail to enable programmatic access to the vector glyph shapes and font tables used by
rasterizers to render the glyph outlines. There is likewise no way to access a web font's binary
data.

- Design tools need access to font bytes to do their own OpenType layout implementation and allow
  design tools to hook in at lower levels, for actions such as performing vector filters or
  transforms on the glyph shapes.
- Developers may have legacy font stacks for their applications that they are bringing to the web.
  To use these stacks, they usually require direct access to font data, something web fonts do not
  provide.
- Some fonts may not be licensed for delivery over the web. For example, Linotype has a license for
  some fonts that only includes [desktop use](https://www.linotype.com/25/font-licensing.html).

The Local Font Access API is an attempt at solving these challenges. It consists of two parts:

- A **font enumeration API**, which allows users to grant access to the full set of available system
  fonts.
- From each enumeration result, the ability to request low-level (byte-oriented) **SFNT container
  access** that includes the full font data.

### Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1. Create explainer                      | [Complete][explainer]                                                                           |
| 2. Create initial draft of specification | [In progress][spec]                                                                             |
| 3. Gather feedback & iterate on design   | [In progress](#feedback)                                                                        |
| **4. Origin trial**                      | **[In progress](https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775)** |
| 5. Launch                                | Not started                                                                                     |

</div>

### How to use the Local Font Access API

#### Enabling via chrome://flags

To experiment with the Local Font Access API locally, enable the `#font-access` flag in
`chrome://flags`.

### Enabling support during the origin trial phase

Starting in Chrome 87, the Local Font Access API will be available as an origin trial in Chrome. The
origin trial is expected to end in Chrome 89 (April 7, 2021).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

#### Feature detection

To check if the Local Font Access API is supported, use:

```js
if ('fonts' in navigator) {
  // The Local Font Access API is supported
}
```

#### Asking for permission

Access to a user's local fonts is gated behind the `"local-fonts"` permission, which you can request
with
[`navigator.permissions.request()`](https://w3c.github.io/permissions/#requesting-more-permission).

```js
// Ask for permission to use the API
try {
  const status = await navigator.permissions.request({
    name: 'local-fonts',
  });
  if (status.state !== 'granted') {
    throw new Error('Permission to access local fonts not granted.');
  }
} catch (err) {
  // A `TypeError` indicates the 'local-fonts'
  // permission is not yet implemented, so
  // only `throw` if this is _not_ the problem.
  if (err.name !== 'TypeError') {
    throw err;
  }
}
```

#### Enumerating local fonts

Once the permission has been granted, you can then, from the `FontManager` interface that is exposed
on `navigator.fonts`, call `query()` to ask the browser for the locally installed fonts, which it
will display in a picker for the user to select all or a subset from to be shared with the page.
This results in an array that you can loop over. Each font is represented as a `FontMetadata` object
with the properties `family` (for example, `"Comic Sans MS"`), `fullName` (for example,
`"Comic Sans MS"`), and `postscriptName` (for example, `"ComicSansMS"`).

```js
// Query for all available fonts and log metadata.
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    console.log(metadata.postscriptName);
    console.log(metadata.fullName);
    console.log(metadata.family);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

#### Accessing SFNT data

Full [SFNT](https://en.wikipedia.org/wiki/SFNT) access is available via the `blob()` method of the
`FontMetadata` object. SFNT is a font file format which can contain other fonts, such as PostScript,
TrueType, OpenType, Web Open Font Format (WOFF) fonts and others.

```js
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    // We're only interested in a particular font.
    if (metadata.family !== 'Comic Sans MS') {
      continue;
    }
    // `blob()` returns a Blob containing valid and complete
    // SFNT-wrapped font data.
    const sfnt = await metadata.blob();

    const sfntVersion = new TextDecoder().decode(
      // Slice out only the bytes we need: the first 4 bytes are the SFNT
      // version info.
      // Spec: https://docs.microsoft.com/en-us/typography/opentype/spec/otff#organization-of-an-opentype-font
      await sfnt.slice(0, 4).arrayBuffer(),
    );

    let outlineFormat = 'UNKNOWN';
    switch (sfntVersion) {
      case '\x00\x01\x00\x00':
      case 'true':
      case 'typ1':
        outlineFormat = 'truetype';
        break;
      case 'OTTO':
        outlineFormat = 'cff';
        break;
    }
    console.log('Outline format:', outlineFormat);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

## Demo

You can see the Local Font Access API in action in the
[demo](https://local-font-access.glitch.me/demo/) below. Be sure to also check out the
[source code](https://glitch.com/edit/#!/local-font-access?path=README.md%3A1%3A0). The demo
showcases a custom element called [`<font-select>`](https://github.com/tomayac/font-select) that
implements a local font picker.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/local-font-access?path=index.html&previewSize=100"
    title="local-font-access on Glitch"
    allow="local-fonts"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Privacy considerations

The `"local-fonts"` permission appears to provide a highly fingerprintable surface. However,
browsers are free to return anything they like. For example, anonymity-focused browsers may choose
to only provide a set of default fonts built into the browser. Similarly, browsers are not required
to provide table data exactly as it appears on disk.

Wherever possible, the Local Font Access API is designed to only expose exactly the information
needed to enable the mentioned use cases. System APIs may produce a list of installed fonts not in a
random or a sorted order, but in the order of font installation. Returning exactly the list of
installed fonts given by such a system API can expose additional data that may be used for
fingerprinting, and use cases we want to enable are not assisted by retaining this ordering. As a
result, this API requires that the returned data be sorted before being returned.

## Security and permissions

The Chrome team has designed and implemented the Local Font Access API using the core principles
defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user
control, transparency, and ergonomics.

### User control

Access to a user's fonts is fully under their control and will not be allowed unless the
`"local-fonts"` permission, as listed in the
[permission registry](https://w3c.github.io/permissions/#permission-registry), is granted.

### Transparency

Whether a site has been granted access to the user's local fonts will be visible in the
[site information sheet](https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform=Desktop).

### Permission persistence

The `"local-fonts"` permission will be persisted between page reloads. It can be revoked via the
_site information_ sheet.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the Local Font Access API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>Storage>FontAccess` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Local Font Access API? Your public support helps the Chrome team to
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#LocalFontAccess`](https://twitter.com/search?q=%23LocalFontAccess&src=typed_query&f=live) and let
us know where and how you're using it.

## Helpful links

- [Explainer][explainer]
- [Spec draft][spec]
- [Chromium bug for font enumeration][cr-bug-enum]
- [Chromium bug for font table access][cr-bug-table]
- [ChromeStatus entry][cr-status]
- [GitHub repo][issues]
- [TAG review][tag-review]
- [Mozilla standards position][mozilla]
- [Origin Trial](https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775)

## Acknowledgements

The Local Font Access API spec was edited by
[Emil A. Eklund](https://www.linkedin.com/in/emilaeklund/),
[Alex Russell](https://infrequently.org/),
[Joshua Bell](https://www.linkedin.com/in/joshuaseanbell/), and
[Olivier Yiptong](https://github.com/oyiptong/). This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Dominik Röttsches](https://fi.linkedin.com/in/dominik-r%C3%B6ttsches-7323684), and
[Olivier Yiptong](https://github.com/oyiptong/). Hero image by
[Brett Jordan](https://unsplash.com/@brett_jordan) on
[Unsplash](https://unsplash.com/photos/qrjvkj-oS-M).

[tag-review]: https://github.com/w3ctag/design-reviews/issues/399
[explainer]: https://github.com/WICG/local-font-access
[spec]: https://wicg.github.io/local-font-access/
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[issues]: https://github.com/WICG/local-font-access/issues
[cr-status]: https://chromestatus.com/feature/6234451761692672
[cr-bug-enum]: https://bugs.chromium.org/p/chromium/issues/detail?id=535764
[cr-bug-table]: https://crbug.com/982054
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[mozilla]: https://github.com/mozilla/standards-positions/issues/401
