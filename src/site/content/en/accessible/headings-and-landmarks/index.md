---
layout: post
title: Headings and landmarks
authors:
  - robdodson
date: 2018-11-18
description: |
  By using the correct elements for headings and landmarks, you can dramatically
  improve the navigation experience for users of assitive technology.
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Use headings to outline the page

Use `h1`-`h6` elements to create a _structural_ outline for your page. The goal is
to create a skeleton or scaffold of the page such that anyone navigating by
headings can form a mental picture.

A common practice is to use a single `h1` for the primary headline or logo on a
page, `h2`s to designate major sections, and `h3`'s in supporting subsections:

```html
<h1>Company name</h1>
<section>
  <h2>Section Heading</h2>
  …
  <h3>Sub-section Heading</h3>
</section>
```

## Don't skip heading levels

Developers often skip heading levels to use the browser's default styles that
closely match their design. This is considered an anti-pattern because it breaks
the outline model.

Instead of relying on the browser's default font-sizing for headings, use your
own CSS, and don't skip levels.

For example, this site has a section called "IN THE NEWS", followed by two
headlines:

{% Img src="image/admin/CdBjBuUo2yVVHWVFnQzx.png", alt="A news site with a headline, hero image, and subsections.", width="800", height="414", class="w-screenshot" %}

The section heading, "IN THE NEWS", could be an `h2`, and the supporting
headlines could both be `h3`'s.

Because the `font-size` for "IN THE NEWS" is _smaller_ than the headline, it may
be tempting to make the headline for the first story an `h2` and to make
"IN THE NEWS" an `h3`. While that may match the browser's default styling,
it would break the outline conveyed to a screen reader user!

{% Aside %}
Though it may seem counterintuitive, it does not matter if _visually_ `h3`'s and
`h4`'s are larger than their `h2` or `h1` counterparts. What matters is the
outline conveyed by the elements and elements' ordering.
{% endAside %}

You can use Lighthouse to check if your page skips any heading levels. Run the
Accessibility audit (**Lighthouse > Options > Accessibility**) and look
for the results of the **Headings don't skip levels** audit.

## Use landmarks to aid navigation

HTML5 elements such as `main`, `nav`, and `aside` act as **landmarks**, or
special regions on the page to which a screen reader can jump.

Use landmark tags to define major sections of your page, instead of relying on
`div`s. Be careful not to go overboard because having _too many_ landmarks can be
overwhelming. For example, stick to just one `main` element instead of 3 or
4.

Lighthouse recommends manually auditing your site to check that "HTML5 landmark
elements are used to improve navigation." You can use this [list of landmark
elements](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html)
to check your page.

## Bypass repetitive content with skip links

Many sites contain repetitive navigation in their headers, which can be annoying
to navigate with assistive technology. Use a **skip link** to let users bypass this content.

A skip link is an offscreen anchor that is always the first focusable item in
the DOM. Typically, it contains an in-page link to the main content of the page. Because it is
the first element in the DOM, it only takes a single action from assistive technology to focus
it and bypass repetitive navigation.

```html
<!-- index.html -->
<a class="skip-link" href="#main">Skip to main</a>
…
<main id="main">
  [Main content]
</main>
```

```css
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

{% Aside 'codelab' %}
[Live skip link example.](https://skip-link.glitch.me/)
{% endAside %}

Many popular sites such as [GitHub](https://github.com/), [The NY
Times](https://www.nytimes.com/), and [Wikipedia](https://wikipedia.org/) all
contain skip links. Try visiting them and pressing the `TAB` key on your
keyboard a few times.

Lighthouse can help you check if your page contains a skip link. Run the
Accessibility audit again and look for the results of the **The page contains a
heading, skip link, or landmark region** audit.

{% Aside %}
Technically, this test will also pass if your site contains any
`h1`-`h6` elements or any of the HTML5 landmark
elements. But although the test is vague in its requirements, it's still
nice to pass it if you can!
{% endAside %}
