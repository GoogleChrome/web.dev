---
title: 'Navigation'
authors:
  - estelleweyl
description: Navigation is a key element of any site of application, and it starts with HTML.
date: 2022-12-08
tags:
  - html
---

As you learned in [links](/learn/html/links), the `<a>` element with the `href` attribute creates links that users can follow by clicking or
tapping. In [lists](/learn/html/lists), you learned how to create lists of content. In this section, you will discover how to group lists of
links together to create navigation.

There are several types of navigation and several ways to display them. Named anchors within text linking to other pages within
the same website are considered local navigation. Local navigation that consists of a series of links displaying the hierarchy of
the current page in relation to the site's structure, or the pages the user followed to get to the current page, is called a breadcrumb.
A page's table of contents is another type of local navigation. A page containing hierarchical links to every single page on a site is called
a site map. The navigation section leading to the top-level pages of the website which is found on every page is called global navigation.
Global navigation can be displayed in several different ways, including navigation bars, drop-down menus, and flyout menus.
The same site may display its global navigation differently, depending on the viewport size.

Always make sure users can navigate to any page on your site with the fewest number of clicks, while making sure the navigation
is intuitive and not overwhelming. That said, there are no specific requirements for navigational elements. [MachineLearningWorkshop.com](https://machinelearningworkshop.com),
being a single-page website, has a local navigation bar in the top right; this is where multi-page sites often put their global navigation.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/6Te041GdOLBpwp0cuUT0.png", alt="The front page of this page, including the breadcrumbs at top, a button to show the table of contents for this page, and the local navigations for the series.", width="600", height="628" %}

If you are viewing this page on web.dev, you can spot a few navigational features. There is a breadcrumb above the title,
an "on this page" table of contents after the title, and a "Learn HTML" table of contents that, depending on the width of your screen,
is either always displayed or made visible with the click of a menu button. The first element on the page is a hidden link to #main, which enables you to skip both the sidebar and breadcrumb links.


## "Skip to content" link

The first element on the page is an internal link:

```html
<a href="#main" class="skip-link button">Skip to main</a>
```

which, when clicked, or when it has focus and the user hits `Enter`, scrolls the page and gives focus to the main content:
a landmark `<main>` with an `id` of `main`:

```html
<main id="main">
```

You may never have seen the link on this site, even if you have read through all the previous sections.
It is only displayed when it has focus:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/ieTOzelKA243HJj195b5.png", alt="Skip to Main button.", width="680", height="300" %}

For improved usability and accessibility, it's important to let users bypass the blocks of content that are repeated on every page.
The skip link is included so when a keyboard user hits `tab` on load, they can quickly skip to the main content of the site—avoiding
having to tab through extensive linkages. On this page, the skip link skips the section-wide sidebar navigation and the breadcrumb navigation,
taking the user directly to the page title.

Most designers don't like the appearance of having a link at the top of the page. It is fine to hide the link from view while remembering
that when the link gets focus, which will happen when a keyboard user tabs through the link on the page, the link must be visible to all users.
Only hide content in the non-focused and non-active state using a selector similar to `.visually-hidden:not(:focus):not(:active)`.

The link text reads "skip to main." This is the link's accessible name. This is a technical site, and users probably know what "main" means.
Like all link text, the accessible name should clearly indicate where the link takes the user. The link target should be the beginning of the
page's main content. To test this, when the page loads, tab to the "Skip to main" link. Then press `Enter` to ensure it "jumps" to the main content.

## Table of contents

The skip-to-content link scrolls the main content into view. The first element is the `<h1>` heading with the title of this section.
In this case, `<h1>Marking up navigation</h1>`. The main heading is followed by the tagline, a brief description of the contents of this
tutorial. Whether the table of contents navigation comes before or after the heading in the codebase depends on the width of your browser.

<figure>
{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/8FNr1lp9jbtoM2weXceV.png", alt="On narrow screens, the table of contents is hidden behind an on this page button that toggles the navigations visibility.", width="446", height="300", style="max-width: 300px; margin: 0 auto;" %}
  <figcaption>On narrow screens, the table of contents is hidden behind an on this page button that toggles the navigations visibility.</figcaption>
</figure>
<figure>
{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/ThkLoScjUq2V6M1b4WSj.png", alt="On wide screens, the table of contents is always visible, with the link to the current section being highlighted in blue.", width="236", height="300", style="max-width: 400px; margin: 0 auto;" %}
  <figcaption>On wide screens, the table of contents is always visible, with the link to the current section being highlighted in blue.</figcaption>
</figure>

If your browser is wider than 80em, the Table of contents comes before the heading in the markup, and is similar to the following
(the class names have been removed to simplify the markup):

```html
<nav aria-label="On this page">
  <div>On this page</div>
  <div>
    <ul>
      <li>
        <a href="#skip">Skip to content link</a>
      </li>
      <li>
        <a href="#toc">Table of contents</a>
      </li>
      <li>
        <a href="#bc">Page breadcrumbs</a>
      </li>
      <li>
        <a href="#ln">Local navigation</a>
      </li>
      <li>
        <a href="#global">Global navigation</a>
      </li>
    </ul>
  </div>
</nav>
```

The `<nav>` is the best element to use for sections of navigation: it automatically informs the screen reader and search engine
that a section has a role of `navigation`, a landmark role.

Including the [`aria-label`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-label) attribute
provides a brief description of the purpose of the navigation. In this case, as the value of the attribute is redundant to
text that is visible on the page, it is preferable to use [`aria-labelledby`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)
to reference the visible text.

We can change the non-semantic `<div>` to a paragraph `<p>`, then add an [`id`](/learn/html/attributes/#id) so it can be referenced. We then use `aria-labelledby`:

```html
<nav aria-labelledby="tocTitle">
  <p id="tocTitle">On this page</p>
```

In addition to reducing redundancy, visible text gets translated by translation services, whereas attribute values may not.
When possible, if text is present that provides for an adequate label, prefer that over attribute text.

This navigation is the table of contents. If you want to use the `aria-label`, provide that information rather than repeating visible text:

```html
<nav aria-label="Table of Contents">
  <p>On this page</p>
```

When providing an accessible name on an element, don't include the name of the element. Screen readers provide that information to the user.
For example, when using the `<nav>` element, don't include "navigation"; that information is included when using semantic elements.

The links themselves are in an unordered list. While they don't have to be nested in a list, using a list enables screen reader users to know how many
list items, and therefore links, are an individual list in a navigation.

```html
<nav aria-labelledby="tocTitle">
  <p id="tocTitle">On this page</p>
  <ul role="list">
    <li>
      <a href="#skip">Skip to content link</a>
    </li>
    <li>
      <a href="#toc">Table of contents</a>
    </li>
    <li>
      <a href="#bc">Page breadcrumbs</a>
    </li>
    <li>
      <a href="#ln">Local navigation</a>
    </li>
    <li>
      <a href="#global">Global navigation</a>
    </li>
  </ul>
</nav>
```

If your browser is less than 80em wide, the "On this page" widget is below the heading and tagline. This is done by including
two table-of-contents navigation components and hiding one or the other with CSS `display: none;` based on a media query.

Including two identical widgets to only show one is an anti-pattern. The extra bytes are negligible. Hiding HTML content from
all users by using CSS `display: none` is appropriate. The issue is that, on wide screens, the table of contents comes before `#main`;
and on narrower screens, the table of contents is nested within #main. Using the keyboard to skip to content skips over the table of
contents on a wide screen. While users are accustomed to content being responsive and changing location when they change devices or
increase their font size, they do not expect the tab order to change when they do so. Page layouts should be accessible, predictable,
and consistent across a site. Here, the location of the table of contents is not predictable.

## Page breadcrumbs

Breadcrumbs provide secondary navigation to help users understand where they are on a website. They generally show the URL hierarchy
of the current document and the location of the current page in the site structure. The site structure from a user perspective may differ
from the file structure on the server. That is fine. The user doesn't need to know how you organize your files, but they do need to be able
to navigate through your content.

Breadcrumbs help users navigate and understand the organization of your site, allowing them to quickly navigate anywhere up to any ancestor
sections without having to step back through each prior page visited to get to the current page using `back` functionality.

If the site has a simple hierarchical directory structure, as is the case with web.dev, the breadcrumb navigation will often be composed
of a link to the home, or hostname, with a link to the index file of each directory in the URL's pathname. The inclusion of the
current page is optional and requires a little extra attention.

```js
const url = new URL("https://web.dev/learn/html/navigation");
const sections = url.hostname + url.pathname.split('/');
// "web.dev,learn,html,navigation"
```

The sections of the breadcrumb show the path from the current page back to the home page, showing each level in-between.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/DNpEzCXqogU6qfJWduLo.png", alt="Breadcrumbs indicating the path to the current page.", width="300", height="75" %}

Every Learn HTML module page has the same breadcrumb navigation, displaying the hierarchy of the `HTML` lessons within the
`learn` section of `web.dev`. The code is similar to the following, with classes and SVG details removed for clarity:

```html
<nav aria-label="breadcrumbs">
  <ul role="list">
    <li>
      <a href="/">
        <svg aria-label="web.dev" role="img">
          <use href="#webDevLogo" />
        </svg>
      </a>
    </li>
    <li>
      <a href="/learn/">Learn</a>
    </li>
    <li>
      <a href="/learn/html">Learn HTML!</a>
    </li>
  </ul>
  <share-action authors="@estellevw" data-action="click" data-category="web.dev" data-icon="share" data-label="share, twitter" role="button" tabindex="0">
    <svg aria-label="share" role="img">
      <use href="#shareIcon" />
    </svg>
    <span>Share</span>
  </share-action>
</nav>
```

This breadcrumb follows best practices. It uses the `<nav>` element, a landmark role, so assistive technology presents the breadcrumbs as a navigational element on the page.
The accessible name of "breadcrumbs", provided with the `aria-label`, differentiates it from the other navigation landmarks in the current document.

Between links there are CSS-generated content separators. The separators come before each list item starting with the second `<li>`.

```css
[aria-label^="breadcrumb" i] li + li::before {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  rotate: 45deg;
  opacity: .8
}
```

Screen readers will not "see" them, which is best practice: separators between breadcrumb links should be hidden from screen readers.
They must also have enough contrast against their background, the same as regular text.

This version uses an unordered list and list items. An ordered list is preferable as ordered list items are enumerated.
Also it is a list: `role="list"` was added back in because some CSS display property values remove the semantics from some elements.

Generally, the link to the home page in a breadcrumb should read "home" rather than be the site logo with the name of the site as
the label. But as the breadcrumb is at the top of the document and is the only occurrence of the logo on the page, it makes sense
as to why this anti-pattern was used.

The last element is a custom `<share-action>` element. Custom elements are discussed in section 15. While this custom element
is not part of the breadcrumb, including an unrelated element in a `<nav>` is fine, as long as the inclusion is consistent on all pages.

### Current page

On this page, the current page, "Navigation", is not included in the breadcrumb. When the current page is included in a
breadcrumb, the text should preferably not be a link, and `aria-current="page"` should be included on the current page's
list item. When it isn't included, it is helpful to indicate that the heading that follows is the current page with an
icon or other symbol.

Should the design change, an alternative version of the breadcrumb could be used:

```html
<nav aria-label="breadcrumbs">
  <ol role="list">
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/learn/">Learn</a>
    </li>
    <li>
      <a href="/learn/html">Learn HTML!</a>
    </li>
    <li aria-current="page">
      Navigation
    </li>
  </ol>
</nav>
```

Breadcrumbs are not for linear steps. For example, a list of the path the user followed to get to the current page or the
list of steps followed up to this point in a recipe can be nested within a `<nav>`,  but should not be labeled as a breadcrumb.

## Local navigation

There is another navigational component on this page. If you are on a wide screen, there is a sidebar on the left with the
"Learn HTML" logo, a search bar, and links to each of the 20 sections in Learn HTML. Each link contains the chapter number,
the section title, and a checkmark to the right on sections that you have already visited—possibly this one if you have navigated away and have come back. The links to all the sections in Learn HTML, along with the search and local header, are the location navigation.

If you are visiting this site on a tablet or mobile device, or otherwise have a narrower screen, when you load this page, the sidebar is hidden. You can make it visible via the hamburger menu in the top navigation bar (yes, the header is a custom `<web-header>` element with `role="navigation"` set).

The main difference between the permanent local navigation on wide screens and the local navigation on narrower screens that can be made to appear and disappear, is the display of the close button on the version that can be hidden. This icon is hidden on wide screens with `display: none;`.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/MHQ1i1NnGKx2N0ovmzxy.png", alt="The local navigation is showing a checkmark next to the name of this chapter.", width="365", height="75", style="max-width: 300px; margin: 0 auto;" %}

The link to this document, section 010, has a slightly different appearance from the other links in the local navigation to indicate to sighted users that this is the current page. This visual difference is created with CSS. The current page is also identified with the `aria-current="page"` attribute. This informs assistive technologies that it is a link to the current page. The HTML for this list item within this local navigation is similar to:

```html
<li>
  <a aria-current="page" href="/learn/html/navigation/" data-complete="true">
    <span>010</span>
    <span>Navigation</span>
    <svg aria-label="Check" role="img">
      <use href="#checkmark" />
    </svg>
  </a>
</li>
```

If this isn't the first time you visit this page, the checkmark will not be visible. If you have visited this page in the past, the
`data-complete` [custom attribute](/learn/html/attributes) is set to `true`, and the checkmark will be displayed. The checkmark is included
in each link, but CSS hides the checkbox from users who have not been to this page before with `display: none` based on the absence of the
`data-complete="true"` attribute and value:

```css
.course .stack-nav a:not([data-complete="true"]) svg {
  display: none;
}
```

When `display` is set to something other than `none`, the `role` informs assistive technology that the inline SVG is an image,
and the `aria-label` acts as the `alt` attribute on an `<img>`would.

## Global navigation

Global navigation is the navigation section leading to the top-level pages of the website that is the same on every page of a site.
A site's global navigation may also be made up of tabs that open nested lists of links that link to all the subsections of a site or other menus.
It may include titled sections, buttons, and search widgets. These additional features aren't a requirement. What is required is that
the navigation appears on every page, and is the same on every page; with `aria-current="page"` on any links to the current page, of course.

Global navigation provides a consistent means of traveling anywhere in the application or website. Google doesn't have global
navigation at the top of the page. Yahoo! does. While all the main Yahoo! properties have different styles, the content for
most sections are the same.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/p9q003xRDvYiTidnBEHf.png", alt="A well-contrasted navigation header, with a white picker on a black background.", width="600", height="31" %}

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/HyvinG9Tf5wR5qq1tM5s.png", alt="A poorly-contrasted navigation header, with a black picker on a grey background.", width="600", height="35" %}

The content of the news and sports global navigation headers are the same, but the icon showing that the user is currently
on sports does not have enough contrast to be accessible; even for visitors who don't have low vision. Both sections have a global
navigation with a section-specific local navigation below it.

Similar to global navigations, footers should be identical on all pages. But that is the only similarity. Global navigation
enables navigation to all parts of the site from a product perspective. Navigation elements within a footer don't have specific requirements.
Generally, the footer will include corporate links, such as legal statements, about the company, and careers, and can lead to external
sources, such as social media icons.

This page's footer contains three additional `<nav>` elements: the footer navigation, Google developers, and terms and policies,
with each being a link. The footer navigation includes how to contribute to web.dev on Github, other educational content provided by
Google outside of web.dev, and external "how to connect" links.

These three navigations in the `<footer>` are `<nav>` elements with an `aria-label`providing an accessible name for these landmark roles.
All the navigations we've seen have been [links](/learn/html/links) nested in [lists](/learn/html/lists) within a nav. We've covered all you need to know to create your own navigations.
Up next, we will look at marking up data tables.

{% Assessment 'navigation' %}
