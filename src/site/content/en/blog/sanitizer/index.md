---
title: Safe DOM manipulation with the Sanitizer API
subhead: Safe DOM manipulation with the Sanitizer API
description: |
  The new Sanitizer API aims to build a robust processor for arbitrary strings to be safely inserted into a page.
  This article introduces the API, and explains its usage.

# A list of authors. Supports more than one.
authors:
  - jackjey

date: 2021-10-01
# Add an updated date to your post if you edit in the future.
# updated: 2019-11-01

# Add the scheduled flag if you'd like your post to automatically go live
# during a future date. Posts will deploy at 7am PST / 15:00 UTC.
# Example: A post with `date: 2050-01-01`, `scheduled: true`, will go live at
# 7am PST, January 1st, 2050.
# If you don't use the scheduled flag then setting a future date has no effect.
# scheduled: true

# !!! IMPORTANT: If your post does not contain a hero image it will not appear
# on the homepage.
# Hero images should be 3200 x 960.
hero: image/PV7xjXdOKHP8LWt9XhstsToJeK82/R2KGdIHv2lBRDS9vs8q1.jpg
# You can adjust the fit of your hero image with this property.
# Values: contain | cover (default)
# hero_fit: contain

# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom

# You can provide an optional cropping of your hero image to be used as a
# thumbnail. Note the alt text will be the same for both the thumbnail and
# the hero.
# thumbnail: thumbnail.jpg

alt: Sanitizing a desk with Sanitizer


# You can provide a custom thumbnail and description for social media cards.
# Thumbnail images should be 896 x 480.
# If no social thumbnail is provided then the post will attempt to fallback to
# the post's thumbnail or hero from above. It will also reuse the alt.
# social:
#   google:
#     title: A title for Google search card.
#     description: A description for Google search card.
#     thumbnail: google_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.
#   facebook:
#     title: A title for Facebook card.
#     description: A description for Facebook card.
#     thumbnail: facebook_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.
#   twitter:
#     title: A title for Twitter card.
#     description: A description for Twitter card.
#     thumbnail: twitter_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.


tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - security

# You can provide an optional Stack Overflow tag to be used at the end of the
# post in an "Ask on Stack Overflow" note.
# Find the official list of tags at https://stackoverflow.com/tags.
# stack_overflow_tag: service-worker
---


Applications deal with untrusted strings all the time, but safely rendering that content as part of an HTML document can be tricky. Without sufficient care, it's easy to accidentally create opportunities for [cross-site scripting](https://www.google.com/about/appsecurity/learning/xss/) (XSS) that malicious attackers may exploit.

To mitigate that risk, the new [Sanitizer API](https://wicg.github.io/sanitizer-api/) proposal aims to build a robust processor for arbitrary strings to be safely inserted into a page. This article introduces the API, and explains its usage.

```js
// Expanded Safely !!
$div.setHTML(`<em>hello world</em><img src="" onerror=alert(0)>`, new Sanitizer())
```

## Escaping user input contents

When inserting user input, query strings, cookie contents, and so on, into the DOM, the strings must be escaped properly. Particular attention should be paid to the DOM manipulation via [`.innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML), where unescaped strings are a typical source of XSS.

```js
const user_input = `<em>hello world</em><img src="" onerror=alert(0)>`
$div.innerHTML = user_input
```

If you escape HTML special characters in the input string above or expand it using [`.textContent`](https://developer.mozilla.org/docs/Web/API/Node/textContent), `alert(0)` will not be executed. However, since `<em>` added by the user is also expanded as a string as it is, this method cannot be used in order to keep the text decoration in HTML.

The best thing to do here is not _escaping_, but _sanitizing_.


## Sanitizing user input

### The difference between escaping and sanitizing

Escaping refer to replacing special HTML characters with [HTML Entities](https://developer.mozilla.org/docs/Glossary/Entity).

Sanitizing refers to removing semantically harmful parts (such as script execution) from HTML strings.
### Example
In the previous example, `<img onerror>` causes the error handler to be executed, but if the `onerror` handler was removed, it would be possible to safely expand it in the DOM while leaving `<em>` intact.

```js
// XSS 🧨
$div.innerHTML = `<em>hello world</em><img src="" onerror=alert(0)>`
// Sanitized ⛑
$div.innerHTML = `<em>hello world</em><img src="">`
```

To sanitize correctly, it is necessary to parse the input string as HTML, omit tags and attributes that are considered harmful, and keep the harmless ones.

The [proposed Sanitizer API specification](https://wicg.github.io/sanitizer-api/) aims to provide such processing as a standard API for browsers.

{% Aside %}
Internet Explorer had implemented `window.toStaticHTML()` for this purpose, but it was never standardized.
{% endAside %}


## Sanitizer API

The [Sanitizer API](https://wicg.github.io/sanitizer-api/) is used in the following way:

```js
const $div = document.querySelector('div')
const user_input = `<em>hello world</em><img src="" onerror=alert(0)>`
const sanitizer = new Sanitizer()
$div.setHTML(user_input, sanitizer) // <div><em>hello world</em><img src=""></div>

```

It is worth noting that `setHTML()` is defined on [`Element`](https://developer.mozilla.org/docs/Web/API/Element). Being a method of `Element`, the context to parse is self-explanatory (`<div>` in this case), the parsing is done once internally, and the result is directly expanded into the DOM.

If you don't want to expand directly into the DOM, you can also get the result as an `HTMLElement`.


```js
const user_input = `<em>hello world</em><img src="" onerror=alert(0)>`
const sanitizer = new Sanitizer()
sanitizer.sanitizeFor("div", user_input) // HTMLDivElement <div>
```

If you want to get the result of sanitization as a string, you can use `.innerHTML` from the `HTMLElement` you got here. (You still need to specify the appropriate context to parse.)


```js
sanitizer.sanitizeFor("div", user_input).innerHTML // <em>hello world</em><img src="">
```

If you already have a user-controlled `DocumentFragment` and you want to remove only the harmful stuff from it, use `sanitize()`.


```js
$div.replaceChildren(s.sanitize($userDiv));
```


### Customize via configuration

The Sanitizer API is configured by default to remove strings that would trigger script execution. However, you can also add your own customizations to the sanitization process via a configuration object.


```js
const config = {
  allowElements: [],
  blockElements: [],
  dropElements: [],
  allowAttributes: {},
  dropAttributes: {},
  allowCustomElements: true,
  allowComments: true
};
// sanitized result is customized by configuration
new Sanitizer(config)
```

The following options specify how the sanitization result should treat the specified element.

`allowElements`: Names of elements that the sanitizer should retain.

`blockElements`: Names of elements the sanitizer should remove, while retaining their children.

`dropElements`: Names of elements the sanitizer should remove, along with their children.


```js
const str = `hello <b><i>world</i></b>`

new Sanitizer().sanitizeFor("div", str)
// <div>hello <b><i>world</i></b></div>

new Sanitizer({allowElements: [ "b" ]}).sanitizeFor("div", str)
// <div>hello <b>world</b></div>

new Sanitizer({blockElements: [ "b" ]}).sanitizeFor("div", str)
// <div>hello <i>world</i></div>

new Sanitizer({allowElements: []}).sanitizeFor("div", str)
// <div>hello world</div>
```

You can also control whether the sanitizer will allow or deny specified attributes with the following options:

- `allowAttributes`
- `dropAttributes`

`allowAttributes` and `dropAttributes` properties expect **attribute match lists**—objects whose keys are attribute names, and values are lists of target elements or the `*` wildcard.


```js
const str = `<span id=foo class=bar style="color: red">hello</span>`

new Sanitizer().sanitizeFor("div", str)
// <div><span id="foo" class="bar" style="color: red">hello</span></div>

new Sanitizer({allowAttributes: {"style": ["span"]}}).sanitizeFor("div", str)
// <div><span style="color: red">hello</span></div>

new Sanitizer({allowAttributes: {"style": ["p"]}}).sanitizeFor("div", str)
// <div><span>hello</span></div>

new Sanitizer({allowAttributes: {"style": ["*"]}}).sanitizeFor("div", str)
// <div><span style="color: red">hello</span></div>

new Sanitizer({dropAttributes: {"id": ["span"]}}).sanitizeFor("div", str)
// <div><span class="bar" style="color: red">hello</span></div>

new Sanitizer({allowAttributes: {}}).sanitizeFor("div", str)
// <div>hello</div>
```

`allowCustomElements` is the option to allow or deny custom elements. If they're allowed, other configurations for elements and attributes still apply.


```js
const str = `<custom-elem>hello</custom-elem>`

new Sanitizer().sanitizeFor("div", str);
// <div></div>

new Sanitizer({ allowCustomElements: true,
                allowElements: ["div", "custom-elem"]
              }).sanitizeFor("div", str);
// <div><custom-elem>hello</custom-elem></div>
```

{% Aside %}
The Sanitizer API is designed to be safe by default. This means that no matter how you set it up, it will never allow constructs that are known XXS targets. For example, `allowElements: ["script"]` won't actually allow `<script>`, because the built-in baseline configuration cannot be overridden. The purpose of customization is to override default settings if your application has special needs.
{% endAside %}


## API surface

### Comparison with DomPurify

[DOMPurify](https://github.com/cure53/DOMPurify) is a well-known library that offers sanitization functionality. The main difference between the Sanitizier API and DOMPurify is that DOMPurify may return the result of the sanitization as a string, which you need to expand into a DOM via `.innerHTML`.


```js
const user_input = `<em>hello world</em><img src="" onerror=alert(0)>`
const sanitized = DOMPurify.sanitize(user_input)
$div.innerHTML = sanitized
// `<em>hello world</em><img src="">`
```

This can be an alternative when the Sanitizer API is not implemented on the browser.

DOMPurify implementation has a couple of downsides. If a string is returned, then the input string is parsed twice, by DOMPurify and `.innerHTML`. This double parsing wastes processing time, but can also lead to interesting vulnerabilities caused by cases where the result of the second parsing is different from the first.

{% Aside 'caution' %}
Learn more about the Securitum research on the DOMPurify vulnerability: [Mutation XSS via namespace confusion](https://research.securitum.com/mutation-xss-via-mathml-mutation-dompurify-2-0-17-bypass/).
{% endAside %}

HTML also needs **context** to be parsed. For example, `<td>` makes sense in `<table>`, but not in `<div>`. Since `DOMPurify.sanitize()` only takes a string as an argument, the parsing context had to be guessed.

{% Aside %}
Learn more about how the Sanitizer API parses strings and determines context in the [Sanitizer API explainer](https://github.com/otherdaniel/purification/blob/strings-explainer/explainer-strings.md).
{% endAside %}

The [Sanitizer API](https://wicg.github.io/sanitizer-api/) improves upon the DOMPurify approach and is designed to eliminate the need for double parsing and to clarify the parsing context.


## Current status

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Step</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. Create explainer</td>
        <td><a href="https://github.com/WICG/sanitizer-api/blob/main/README.md">Complete</a></td>
      </tr>
      <tr>
        <td>2. Create draft of specification</td>
        <td><a href="https://wicg.github.io/sanitizer-api/">Complete</a></td>
      </tr>
      <tr>
        <td>3. Gather feedback and iterate on design</td>
        <td><a href="https://docs.google.com/document/d/1kBpk-dhCukPphfH_8vkOgdUDcM9bqVuhsK0pRZzwapM/edit?resourcekey=0-4tFsd4s6aLbvvr2ys_9F4A#Feedback">In progress</a></td>
      </tr>
      <tr>
        <td>4. Origin trial</td>
        <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/OrWQnXVQJ0A/m/TbF-0Dw3BQAJ">Ready for Trial</a></td>
      </tr>
      <tr>
        <td>5. Launch</td>
        <td>Not started</td>
      </tr>
    </tbody>
  </table>
</div>


## How to enable the Sanitizer API


### Enabling via `about://flags` or CLI option


#### Chrome

Chrome is in the process of implementing the Sanitizer API, and when Chrome 93 is released, you can try out the behavior by enabling `about://flags/#enable-experimental-web-platform-features` flag. In earlier versions of Chrome Canary and Dev channel, you can enable it via `--enable-blink-features=SanitizerAPI` and try it out right now. Check out the [instructions for how to run Chrome with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).


#### Firefox

Firefox also implements the Sanitizer API as an experimental feature. To enable it, set the `dom.security.sanitizer.enabled` flag to `true` in `about:config`.

### Feature detection

```js
if (window.Sanitizer) {
  // Sanitizer API is enabled
}
```

### Feedback

If you try this API and have some feedback, we'd love to hear it. Share your thoughts on [Sanitizer API GitHub issues](https://github.com/WICG/sanitizer-api/issues) and discuss with the spec authors and folks interested in this API.


If you find any bugs or unexpected behavior in Chrome's implementation, [file a bug to report it](https://new.crbug.com/). Select the `Blink>SecurityFeature>SanitizerAPI` components and share details to help implementers track the problem.



### Demo

To see the Sanitizer API in action check out the [Sanitizer API Playground](https://sanitizer-api.dev/) by [Mike West](https://twitter.com/mikewest):



### Browser compatibility

The Sanitizer API is under discussion in the standardization process. The implementation status of other browsers is as follows

Mozilla: considers this proposal as [worth prototyping](https://mozilla.github.io/standards-positions/#sanitizer-api), and they are [actively implementing](https://groups.google.com/g/mozilla.dev.platform/c/C4EHeQlaMbU).

Webkit: see the response on [webkit mailing lists](https://lists.webkit.org/pipermail/webkit-dev/2021-March/031731.html).


### References

- Spec: [HTML Sanitizer API](https://wicg.github.io/sanitizer-api/)
- Repos: [WICG/sanitizer-api](https://github.com/WICG/sanitizer-api)
- FAQ: [WICG/sanitizer-api](https://github.com/WICG/sanitizer-api/blob/main/faq.md)
- MDN: [HTML Sanitizer API \| MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
