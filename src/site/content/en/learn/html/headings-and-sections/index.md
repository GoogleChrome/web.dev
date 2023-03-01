---
title: 'Headings and sections'
authors:
  - estelleweyl
description: How to correctly use sectioning elements to give meaning to your content.
date: 2022-09-27
tags:
  - html
---

In the last section you learned how, even if you don't know what the words on a page mean, when semantic elements provide the document with meaningful structure, others—the search engine, assistive technologies, a future maintainer, a new team member—will understand the outline of the document.

In this section, you'll discover document structure; you'll recap the sectioning elements from the previous section; and mark up the outline for your application.

Choosing the right elements for the job as you code means you won't have to refactor or comment out your HTML. If you think about using the right element for the job, you'll most often pick the right element for the job. If you don't, you probably won't.

Now that you [understand markup semantics](/learn/html/semantic-html/)  and are aware of why choosing the right element is important, once you learn about all the different elements, you will generally pick the right element without much, if any, additional effort.

## Site `<header>`

Let's build a site header. You'll start with non-semantic markup, and work your way to a good solution so that you can learn the benefits of the HTML section and heading elements along the way.

If you put little to no thought into the semantics for our header, you might use code like this:

```html
<!-- start header -->
<div id="pageHeader">
  <div id="title">Machine Learning Workshop</div>
  <!-- navigation -->
  <div id="navigation">
    <a href="#reg">Register</a>
    <a href="#about">About</a>
    <a href="#teachers">Instructors</a>
    <a href="#feedback">Testimonials</a>
  </div>
  <!-- end navigation bar -->
</div>
<!-- end of header -->
```

CSS can make (almost) any markup look right. But using the non-semantic `<div>` for everything actually creates extra work. To target multiple `<div>`s with CSS, you end up using ids or classes to identify the content. The code also includes a comment for each closing `</div>` to indicate which opening tag each `</div>` closed.

While the `id` and `class` attributes provide hooks for styling and JavaScript, they add no semantic value for the screen reader and (for the most part) the search engines.

You can include `role` attributes to provide semantics to create a good accessibility object model (AOM) for screen readers:

```html
<!-- start header -->
<div role="banner">
  <div role="heading" aria-level="1">Machine Learning Workshop</div>
  <div role="navigation">
    <a href="#reg">Register</a>
    <a href="#about">About</a>
    <a href="#teachers">Instructors</a>
    <a href="#feedback">Testimonials</a>
  </div>
  <!-- end navigation bar -->
<div>
<!-- end of header -->
```

This at least provides semantics and enables using attribute selectors in the CSS, but it still adds comments to identify which `<div>` each `</div>` closes.

If you know HTML, all you have to do is think about the purpose of the content. Then you can write this code semantically without using `role` and without needing to comment the closing tags:

```html
<header>
  <h1>Machine Learning Workshop</h1>
  <nav>
    <a href="#reg">Register</a>
    <a href="#about">About</a>
    <a href="#teachers">Instructors</a>
    <a href="#feedback">Testimonials</a>
  </nav>
</header>
```

This code uses two semantic landmarks: `<header>` and `<nav>`.

This is the main header. The `<header>` element isn't always a landmark. It has different semantics depending on where it is nested. When the `<header>` is top level, it is the site `banner`, a landmark role, which you may have noted in the `role` code block. When a `<header>` is nested in  `<main>`, `<article>`,  or `<section>`, it just identifies it as the header for that section and isn't a landmark.

The `<nav>` element identifies content as navigation. As this `<nav>` is nested in the site heading, it is the main navigation for the site. If it was nested in an `<article>` or `<section>`, it would be internal navigation for that section only. By using semantic elements, you built a meaningful [accessibility object model](https://developer.mozilla.org/docs/Glossary/Accessibility_tree), or AOM. The AOM enables the screen reader to inform the user that this section consists of a major navigation block that they can either navigate through or skip.

Using `</nav>` and `</header>` closing tags removes the need for comments to identify which element each end tag closed. In addition, using different tags for different elements removes the need for `id` and `class` hooks. The CSS selectors can have low [specificity](/learn/css/specificity/); you can probably target the links with `header nav a` without worrying about conflict.

You have written a header with very little HTML and no classes or ids. When using semantic HTML, you don't need to.

## Site `<footer>`

Let's code the site footer.

```html
<footer>
  <p>&copy;2022 Machine Learning Workshop, LLC. All rights reserved.</p>
</footer>
```

Similar to `<header>`, whether the footer is a landmark depends on where the footer is nested. When it is the site footer, it is a landmark, and should contain the site footer information you want on every page, such as a copyright statement, contact information, and links to your privacy and cookie policies. The implicit `role` for the site footer is `contentinfo`. Otherwise, the footer has no implicit role and is not a landmark, as shown in the following screenshot of the AOM in Chrome (which has an `<article>` with a `<header>` and `<footer>`  between the `<header>` and `<footer>`).

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/A6uTEfG3muxX7namzXW5.png", alt="The Accessibility Object Model in Chrome.", width="800", height="374" %}

In this screenshot, there are two footers: one in an `<article>` and one top level. The top level footer is a landmark with the implicit role of `contentinfo`. The other footer isn't a landmark. Chrome shows it as `FooterAsNonLandmark`; Firefox shows it as `section`.

That doesn't mean you shouldn't use `<footer>`. Let's say you have a blog. The blog has a site footer with an implicit `contentinfo` role. Each blog post can also have a `<footer>`. On your blog's main landing page, the browser, search engine, and screen reader know the main footer is the top-level footer, and that all the other footers are related to the posts in which they are nested.

When a `<footer>` is a descendant of an `<article>`, `<aside>`, `<main>`, `<nav>`, or `<section>`, it's not a landmark. If the post appears on its own, depending on the markup, that footer might get promoted.

Footers are often where you will find contact information, wrapped in `<address>`, the contact address element. This is one element that is not very well named; it is used to enclose the contact information for individuals or organizations, not physical mailing addresses.

```html
<footer>
  <p>&copy;2022 Machine Learning Workshop, LLC. All rights reserved.</p>
  <address>Instructors: <a href="/hal.html">Hal</a> and <a href="/eve.html">Eve</a></address>
</footer>
```

## Document structure

This module starts with the `<header>` and `<footer>`, because they are unique in only sometimes being landmark, or "sectioning", elements. Let's cover the "full time" sectioning element by discussing the most common page layouts:

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/LJs8vlTVDYBmM6t1z6rD.png", alt="A layout with a header, three columns, and a footer.", width="800", height="607" %}

A layout with a header, two sidebars, and a  footer, is known as the [holy grail layout](/patterns/layout/holy-grail/). There are many ways to mark up this content, including:

```html
<body>
  <header>Header</header>
  <nav>Nav</nav>
  <main>Content</main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</body>
```

If you are creating a blog, you might have a series of articles in `<main>`:

```html
<body>
  <header>Header</header>
  <nav>Nav</nav>
  <main>
    <article>First post</article>
    <article>Second post</article>
  </main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</body>
```

When employing semantic elements, browsers are able to create meaningful accessibility trees, enabling screen reader users to more easily navigate. Here, a `banner` and `contentinfo` are provided through a site `<header>` and `<footer>`.  The new elements added here include `<main>`, `<aside>`, and `<article>`; also, `<h1>` and `<nav>` that you used earlier, and `<section>`, which you haven't used yet.

### `<main>`

There's a single `<main>` landmark element. The `<main>` element identifies the main content of the document. There should be only one `<main>` per page.

### `<aside>`

The `<aside>` is for content that is indirectly or tangentially related to the document's main content. For example, this article is about HTML. For a section on CSS selector specificity for the three site header examples (div, role, and semantic), the tangentially related aside could be contained in an `<aside>`; and, like most, the `<aside>` would likely be presented in a sidebar or a call-out box. The `<aside>` is also a landmark, with the implicit role of `complementary`.

### `<article>`
Nested in `<main>` we added two `<article>` elements. This wasn't necessary in the first example when the main content was just one word, or in the real world, a single section of content. But, if you are writing a blog, as in our second example, each post should be in an `<article>` nested in `<main>`.

An `<article>` represents a complete, or self-contained, section of content that is, in principle, independently reusable. Think of an article as you would an article in a newspaper.  In print, a news article about Jacinda Ardern, Prime Minister of New Zealand, might only appear in one section, maybe world news. On the paper's website, that same news article might appear on the home page, in the politics section, in the Oceana or the Asia Pacific news section, and, depending on the topic of the news, the sports, lifestyle, or technology sections, perhaps. The article may also appear on other sites, like Pocket or Yahoo News!

### `<section>`

The `<section>` element is used to encompass generic standalone sections of a document when there is no more specific semantic element to use. Sections should have a heading, with very few exceptions.

Going back to the Jacinda Ardern example, on the home page of the newspaper, the banner would include the name of the newspaper, followed by a single `<main>`, divided into several `<section>`s, each with a header, such as "World news" and "Politics"; and in each section you'll find a series of `<article>`s. Within each `<article>`, you might find one or more `<section>` elements as well. If you look at this page, the entire "headers and sections" part is the `<article>`. This `<article>` is then divided into several `<section>`s, including `site header`, `site footer`, and document structure. The article itself has a header, as do each of the sections.

A `<section>` isn't a landmark unless it has an accessible name; if it has an accessible name, the implicit role is `region`. [Landmark roles](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles#landmark_roles) should be used sparingly, to identify larger overall sections of the document. Using too many landmark roles can create "noise" in screen readers, making it difficult to understand the overall layout of the page, if your `<main>` contains two or three important sub-sections, including an accessible name for each `<section>` could be beneficial.

## Headings: `<h1>`-`<h6>`

There are six section heading elements: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, and `<h6>`.  Each represents one of the six levels of section headings, with `<h1>` being the highest or most important section level, and `<h6>` the lowest.

When a heading is nested in a document banner `<header>`, it is the heading for the application or site. When nested in `<main>`, whether or not it is nested within a `<header>` in `<main>`, it is the header for that page, not the whole site. When nested in an `<article>` or `<section>`, it is the header for that subsection of the page.

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNdePZj',
  height: 500,
  theme: 'dark',
  tab: 'html,result'
} %}

It is recommended to use heading levels similarly to heading levels in a text editor: starting with a `<h1>` as the main heading, with `<h2>` as headings for sub-sections, and `<h3>` if those sub-sections have sections; avoid skipping heading levels. There is a good [article on section headings](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements) here.

Some screen reader users do access headings to understand a page's content. Originally, headings were supposed to outline a document, just as MS Word or Google Docs can produce an outline based on headings, but browsers never implemented this structure. While browsers do display nested headings at increasingly smaller font sizes as shown in the following example, they don't actually support outlining.

You now have enough knowledge to outline MachineLearningWorkshop.com:

## Outlining the `<body>` of MLW.com

This is the outline for the visible content of the machine learning workshop site:

{% Codepen {
  user: 'web-dot-dev',
  id: 'gOzxdxR',
  height: 700,
  theme: 'dark',
  tab: 'html'
} %}

{% Aside %}
This code snippet only includes the content of the `<body>`. The [`<!doctype>`, `<html>`, `<body>`, and meta-information](/learn/html/metadata/) were covered earlier.
{% endAside %}

As no piece of content is a standalone, complete piece of content, `<section>` is more appropriate than `<article>`; while each has a heading, no section is worthy of a `<footer>`.

It should go without saying by this point, but don't use headings to make text bold or large; use CSS instead. If you want to emphasize text, there are semantic elements to do that too. We'll cover that and fill in most of the page's content as we discuss text basics; after taking a deeper dive into attributes.

{% Assessment 'headings-and-sections' %}
