---
title: 'The Document'
authors:
  - cariefisher
description: >
  Additional HTML elements to consider when building accessible websites and web apps.
date: 2022-09-21
tags:
  - accessibility
---

Along with structure, there are many supporting HTML elements to consider when
building and designing for digital accessibility. Throughout the Learn
Accessibility course, we cover a lot of elements. 

This module focuses on very specific elements that don't quite fit into any of
the other modules but are useful to understand.

{% Aside %}
Our [Learn HTML course](/learn/html/) covers the basics of HTML and semantic
structure in great detail. As such, this module builds off of that course
material and is focused specifically on digital accessibility. Likewise, be
sure to review the [ARIA and HTML module](/learn/accessibility/aria-html/) in
this course before diving into this module.
{% endAside %}

## Page title

The HTML [`<title>`](https://developer.mozilla.org/docs/Web/HTML/Element/title)
element defines the content of the page or screen a user is about to
experience. It's found in the
[`<head>`](https://developer.mozilla.org/docs/Web/HTML/Element/head) section of
an HTML document and is equivalent to the `<h1>` or main topic of the page. The
title content is displayed in the browser tab and helps users understand which
page they are visiting, but it is not displayed on the website or app itself.

In a [single-page app](https://developer.mozilla.org/docs/Glossary/SPA) (SPA),
the `<title>` is handled in a slightly different way, as users don't navigate
between pages as they do on multi-page websites. For SPAs, the value of the
[`document.title`](https://developer.mozilla.org/docs/Web/API/Document/title)
property can be added manually or by a helper package, depending on the
JavaScript framework. Announcing the
[updated page titles](https://hidde.blog/accessible-page-titles-in-a-single-page-app/)
to a screen reader user may take some additional work.


Descriptive page titles are good for both users and
[search engine optimization (SEO)](https://developer.mozilla.org/docs/Web/HTML/Element/title#page_titles_and_seo)—but
don't go overboard and add lots of keywords. Since the title is the first
thing announced when an AT user visits a page, it must be accurate, unique, and
descriptive, but also concise.

When writing page titles, it is also best practice to "front load" the interior
page or important content first, then add any preceding pages or information
after. This way, AT users don't have to sit through the information they have
already heard.

<div class="switcher">
{% Compare 'worse' %}
```html
<title>The Food Channel | Outrageous Pumpkins | Season 3 </title>
```
{% endCompare %}

{% Compare 'better' %}
```html
<title>Season 3 | Outrageous Pumpkins | The Food Channel</title>
```
{% endCompare %}
</div>

{% Aside 'important' %}
Search engines typically display only the first 55–60 characters of a page
title, so be sure to limit your total page title characters.
{% endAside %}

## Language

### Page language

The page language attribute ([`lang`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang)) sets the default language for the entire page. This attribute is added to the [`<html>`](https://developer.mozilla.org/docs/Web/HTML/Element/html) tag. A valid language attribute should be added to every page as it signals the AT to which language it should use. 

It's recommended that you use two-character
[ISO language codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
for greater AT coverage, as many of them do not support
[extended language codes](https://webaim.org/techniques/language/).

When a language attribute is completely missing, the AT will default to the
user's programmed language. For example, if an AT was set to Spanish, but a
user visited an English website or app, the AT would try to read the English
text with Spanish accents and cadence. This combination results in an unusable
digital product and a frustrated user.

<div class="switcher">
{% Compare 'worse' %}
```html
<html>...</html>
```
{% endCompare %}

{% Compare 'better' %}
```html
<html lang="en">...</html>
```
{% endCompare %}
</div>

### Section language

You can also use the language attribute ([lang](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang)) for language switches in the content itself. The same basic rules apply as the full-page language attribute, except you add it to the appropriate in-page element instead of on the `<html> tag.

Remember that the language you add to the `<html> element cascades down to all the contained elements, so always set the primary language of the page top-level `lang` attribute first. Then for any in-page elements written in a different language, add that lang attribute to the appropriate wrapper element. Doing this will override the top-level language setting until that element is closed. 

<div class="switcher">
{% Compare 'worse' %}
```html
<html lang="en">
  <body>...
    <div>
      <p>While traveling in Estonia this summer, I often asked,
        "Kas sa räägid inglise keelt?" when I met someone new.</p>
    </div>
  </body>
</html>
```
{% endCompare %}

{% Compare 'better' %}
```html
<html lang="en">
  <body>...
    <div>
      <p>While traveling in Estonia this summer, I often asked,
        <span lang="ee">"Kas sa räägid inglise keelt?"</span>
        when I met someone new.</p>
    </div>
  </body>
</html>
```
{% endCompare %}
</div>

## iFrames

The iFrame element
([`<iframe>`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe)) is
used to host another HTML page or a third party's content within the page. It
essentially puts another webpage within the parent page. iFrames are commonly
used for advertisements, embedded videos, web analytics, and interactive
content.

To make your `<iframe>` accessible, there are a couple of aspects to consider. First, each `<iframe>` with distinct content should include a title element inside the parent tag. This title supplies AT users with more information about the content inside the `<iframe>`.

Second, as a best practice, it is good to set the scrolling to "auto" or "yes" in the `<iframe>` tag settings. This allows people with low vision to be able to scroll into content within the `<iframe>` that they might not otherwise be able to see. Ideally, the `<iframe>` container would also be flexible in its height and width.

<div class="switcher">
{% Compare 'worse' %}
```html
<iframe src="https://www.youtube.com/embed/3obixhGZ5ds"></iframe>
```
{% endCompare %}

{% Compare 'better' %}
```html
<iframe title="Google Pixel - Lizzo in Real Tone"
  src="https://www.youtube.com/embed/3obixhGZ5ds"
  scrolling="auto">
</iframe>
```
{% endCompare %}
</div>

{% Assessment 'document' %}
