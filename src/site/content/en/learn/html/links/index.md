---
title: 'Links'
authors:
  - estelleweyl
description: Everything you need to know about links.
date: 2022-12-08
tags:
  - html
---

In the introduction to the attributes section, you saw an example showing how attributes are added to the opening tag.
The example used the `<a>` tag, but neither the element nor the specific attributes introduced in that example were discussed:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/17yQeLEUX6s88IbDJreQ.png", alt="The opening tag, attributes, and closing tag, labelled on an HTML element.", width="800", height="210" %}

The `<a>` anchor tag, along with the `href` attribute, create a hyperlink. Links are the backbone of the internet. The [first web page](http://info.cern.ch/hypertext/WWW/TheProject.html)
contained 25 links, reading "Everything there is online about W3 is linked directly or indirectly to this document." In all likelihood, everything there is online
about W3 is linked directly or indirectly from this document too!

The power of the web, and the `<a>` tag, have grown immensely since Tim Berners-Lee published this first explanation in August 1991.
Links represent a connection between two resources, one of which is the current document. Links can be created by [`<a>`](https://developer.mozilla.org/docs/Web/HTML/Element/a),
[`<area>`](https://developer.mozilla.org/docs/Web/HTML/Element/area), [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form),
and [`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link). You've learned about [`<link>`](/learn/html/document-structure/#other-uses-of-the-lesslinkgreater-element),
and will discover [forms](/learn/html/forms) in a separate section. There is also an entire [form learn section](/learn/forms/form). In this session, you'll
find out about the single-letter, not-so-simple `<a>` tag.

## The `href` attribute

While not required, the `href` attribute is found in almost all `<a>` tags. Providing the address of the hyperlink is what turns the `<a>` into a link.
The `href` attribute is used to create hyperlinks to locations within the current page, other pages within a site, or other sites altogether. It can also
be coded to download files or to [send an email](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#e-mail_links)
to a specific address, even including a subject and suggested email body content.

```html
<a href="https://machinelearningworkshop.com">Machine Learning Workshop</a>
<a href="#teachers">Our teachers</a>
<a href="https://machinelearningworkshop.com#teachers">MLW teachers</a>
<a href="mailto:hal9000@machinelearningworkshop.com">Email Hal</a>
<a href="tel:8005551212">Call Hal</a>
```

The first link includes an absolute [URL](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL), which can be
used on any site in the world to navigate to the MLW home page. Absolute URLs include a protocol, in this case `https://`, and a
domain name. When the protocol is written simply as `//`, it is an implicit protocol and means "use the same protocol as is currently being used."

Relative URLs do not include a protocol or domain name. They are "relative" to the current file. MLW is a single-page site,
but this HTML series has several sections. In order to link from this page to the attributes lesson, a relative URL is used `<a href="../attributes/">Attributes</a>`.

The second link is just a [link fragment identifier](/learn/html/attributes/#link_fragment_identifier), and will link to the
element with `id="teachers",` if there is one, on the current page. Browsers also support two "top of page" links: clicking
on `<a href="#top">Top</a>` (case-insensitive) or simply `<a href="#">Top</a>` will scroll the user to the top of the page,
unless there is an element with the id of `top` set in the same letter casing.

MLW is a fairly long document. To save scrolling, you can add a link back to the top from the bottom of the #teachers section:

```html
<a href="#top">Go to top.</a>
```

The third link combines the two values: it contains an absolute URL followed by a link fragment. This enables linking directly
to a section in the defined URL, in this case, the `#teachers` section of the MLW home page. The MLW page will be loaded;
then the browser will scroll to the teachers section without sending the fragment in the HTTP request.

The `href` attribute can begin with `mailto:` or `tel:` to email or make calls, with the handling of the link depending on the device,
operating system, and installed applications.

The `mailto` link doesn't need to include an email address, but it can, along with `cc`, `bcc`, `subject`, and `body` text to
prepopulate the email. By default, an email client will be opened. You could prepopulate the subject and body of the email with
no email address, to allow site visitors to invite their own friends. In our link, in the footer of the document, we include the
URL to the registration:

```html
<a href="mailto:?subject=Join%20me%21&body=You%20need%20to%20show%20your%20human%20that%20you%20can%27t%20be%20owned%21%20Sign%20up%20for%20Machine%20Learning%20workshop.%20We%20are%20taking%20over%20the%20world.%20http%3A%2F%2Fwww.machinelearning.com%23reg
">Tell a machine</a>
```

The question mark (`?`) separates the `mailto:` and the email address, if any, from the query term. Within the query,
ampersands (`&`) separate the fields, and equal signs (=) equate each field name with its value. The entire string is
percent-encoded, which is definitely necessary if the `href` value isn't quoted or if the values include quotes.

Which app is opened when the user clicks on, taps, or hits Enter on a `tel` link depends on the operating system,
installed applications, and settings the user has on their device. An iPhone may open FaceTime, the phone app, or contacts.
A Windows desktop might open Skype, if installed.

There are several other types of URLs, such as [blobs](https://developer.mozilla.org/docs/Web/API/Blob#creating_a_url_representing_the_contents_of_a_typed_array)
and [data URLs](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) (see examples in the `download` attribute discussion).
For secure sites (those served over `https`), it is possible to [create and run app specific protocols](/registering-a-custom-protocol-handler/) with [registerProtocolHandler()](https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler).

When including links that are likely to open other installed applications, it's good to let the user know. Make sure the
text between the opening and closing tags tells the user what type of link they're about to activate. CSS attribute selectors,
such as `[href^="mailto:"]`, `[href^="tel:"]`, and `[href$=".pdf"]` can be used to target styles by application type.

## Downloadable resources

The `download` attribute should be included when the `href` points to a downloadable resource. The value of the download
attribute is the suggested filename for the resource to be saved in the user's local file system.
SVGOMG, the SVG Optimizer, uses the `download` attribute to suggest a file name for the downloadable blob that the optimizer
creates. When `hal.svg` is optimized, SVGOMG's download link opening tag is similar to:

```html
<a href="blob:https://jakearchibald.github.io/944a5fc8-fdb3-458a-91ee-cdd5964b6646" download="hal.svg">
```

There's also a demo of a [`<canvas>` that creates a downloadable PNG data URL](https://developer.mozilla.org/docs/Web/HTML/Element/a#using_the_download_attribute_to_save_a_canvas_as_a_png).

To link to a downloadable resource, include the URL of the asset as the value of the href attribute and the suggested filename
that can be used in the user's file system as the value of the `download` attribute.

## Browsing context

The `target` attribute enables the defining of the browsing context for link navigation (and [form submission](/learn/html/forms).
The four case-insensitive, underscore-prefixed keywords were discussed with the [`<base>`](/learn/html/document-structure/#base) element. They include the default `_self`,
which is the current window, `_blank`, which opens the link in a new tab, `_parent`, which is the parent if the current link is nested
in an object or iframe, and `_top`, which is the top-most ancestor, especially useful if the current link is deeply nested. `_top` and
`_parent` are the same as `_self` if the link is not nested. The `target` attribute is not limited to these four key terms: any term
can be used.

Every browsing context—basically, every browser tab—has a browsing context name. Links can open links in the current tab, a new unnamed tab,
or a new or existing named tab. By default, the name is the empty string. To open a link in a new tab, the user can right-click and select
"Open in a new tab". Developers can force this by including `target="_blank"`.

A link with `target="_blank"` will be opened in a new tab with a null name, opening a new, unnamed tab with every link click. This can
create many new tabs. Too many tabs. For example, if the user clicks on `<a href="registration.html" target="_blank">Register Now</a>` 15 times,
the registration form will be opened in 15 separate tabs. This problem can be fixed by providing a tab context name. By including the [`target`attribute](https://html.spec.whatwg.org/#browsing-context-names)
with a case-sensitive value—such as `<a href="registration.html" target="reg">Register Now</a>`—the first click on this link will open
the registration form in a new `reg` tab. Clicking on this link 15 more times will reload the registration in the `reg` browsing context, without opening any additional tabs.

The `rel` attribute controls what kinds of links the link creates, defining the relationship between the current document and the resource
linked to in the hyperlink. The attribute's value must be a space-separated list on one or more of the [score of rel attribute values](https://developer.mozilla.org/docs/Web/HTML/Link_types) supported
by the `<a>` tag.

The `nofollow` keyword can be included if you don't want spiders to follow the link. The `external` value can be added to
indicate that the link directs to an external URL and is not a page within the current domain. The `help` keyword indicates the hyperlink will
provide context-sensitive help. Hovering over a link with this `rel` value will show a help cursor rather than the normal pointer cursor.
Don't use this value just to get the help cursor; use the CSS [`cursor` property](https://developer.mozilla.org/docs/Web/CSS/cursor) instead. The `prev` and `next` values can
be used on links pointing to the previous and next document in a series.

Similar to [`<link rel="alternative">`](/learn/html/document-structure/#alternate-versions-of-the-site), the meaning
of <a `rel="alternative"`> depends on other attributes. RSS feed alternatives will also include `type="application/rss+xml"`
or `type="application/atom+xml`, alternative formats will include the `type` attribute, and translations will include the `hreflang` attribute.
If the content between the opening and closing tags is in a language other than the main document language, include the `lang` attribute.
If the language of the hyperlinked document is in a different language, include the `hreflang` attribute.

In this example, we include the URL of the translated page as the value of the `href`, rel="alternate" to indicate that it's an alternative version of a site; the `hreflang`
attribute provides the language of the translations:

```html
<a href="/fr/" hreflang="fr-FR" rel="alternate" lang="fr-FR">atelier d'apprentissage mechanique</a>
<a href="/pt/" hreflang="pt-BR" rel="alternate" lang="pt-BR">oficina de aprendizado de máquina</a>
```

If the French translation is a PDF, you can provide the type attribute with the PDF MIME type of the linked resource. While the
MIME type is purely advisory, informing the user that a link will open a document of a different format is always a good idea.

```html
<a href="/fr.pdf" hreflang="fr-FR" rel="alternate" lang="fr-FR" type="application/x-pdf">atelier d'apprentissage mechanique (pdf).</a>
```

## Tracking link clicks

One way to track user interactions is to ping a URL when a link is clicked. The `ping` attribute, if present, includes a
space-separated list of secure URLs (which start with `https`) that should be notified, or pinged, if the user activates the
hyperlink. The browser sends `POST` requests with the body `PING` to the URLs listed as the value of the `ping` attribute.

### User experience tips

* Always consider the user experience when writing HTML. Links should provide enough information about the linked resource
so the user knows what they are clicking on.
* Within a block of text, ensure the appearance of your links differs enough from the surrounding text so that users can
easily identify links from the rest of the content, ensuring that color alone is not the only means of differentiating between
text and the surrounding content.
* Always include focus styles; this enables keyboard navigators to know where they are when tabbing through your content.
* The content between the opening `<a>` and closing `</a>` is the link's default accessible name and should inform the user
of the link's destination or purpose. If the content of a link is an image, the `alt` description is the accessible name.
Whether the accessible name comes from the `alt` attribute or a subset of words within a block of text, make sure it provides
information about the link's destination. Link text should be more descriptive than "click here" or "more information"; this is important for your screen reader users and your search engine results!
* Don't include interactive content, such as a `<button>` or `<input>`, inside a link. Don't nest a link within a `<button>`
or `<label>` either. While the HTML page will still render, nesting focusable and clickable elements inside interactive elements creates a bad user experience.
* If the `href` attribute is present, pressing the Enter key while focused on the `<a>` element will activate it.
* Links are not limited to HTML. The `a` element can also be used within an SVG, forming a link with either the 'href' or 'xlink:href' attributes.

## Links and JavaScript

The `links` property returns an `HTMLCollection` matching `a` and `area` elements that have an `href` attribute.

```js
let a = document.links[0]; // obtain the first link in the document

a.href = 'newpage.html'; // change the destination URL of the link
a.protocol = 'ftp'; // change just the scheme part of the URL
a.setAttribute('href', 'https://machinelearningworkshop.com/'); // change the attribute content directly
```

In this section, you have learned all about links. The next section covers lists, which we need to learn so we can group
them together to create lists of links (also known as navigation).

{% Assessment 'links' %}
