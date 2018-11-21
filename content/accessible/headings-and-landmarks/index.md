---
page_type: guide
title: Headings and landmarks
author: robdodson
description: |
  By using the correct elements for headings and landmarks, you can dramatically
  improve the navigation experience for users of assitive technology.
web_lighthouse:
  - heading-levels
  - use-landmarks
  - bypass
wf_blink_components: Blink>Accessibility
---

# Headings and landmarks

Screen readers have commands to quickly jump between headings, or to specific
landmark regions. In fact, [a recent survey of screen reader users](http://www.heydonworks.com/article/responses-to-the-screen-reader-strategy-survey)
found that they most often navigate an unfamiliar page by navigating through
the headings.

By using the correct elements for headings and landmarks, you can dramatically
improve the navigation experience for users of assitive technology.

## Use headings to outline the page

Use H1-H6 elements to create a _structural_ outline for your page. The goal is
to create a scaffold or framing of the page such that anyone navigating by
headings can form a mental picture.

A common practice is to use a single H1 for the primary headline or logo on a
page, H2s to designate major sections, and H3s in supporting subsections:

```  
<h1>Company name</h1>  
<section>  
  <h2>Section Heading</h2>  
  …  
  <h3>Sub-section</h3>  
</section>
```

## Don't skip heading levels

Developers often skip heading levels to use the browser default styles that
closely match their design. This is considered an anti-pattern because it breaks
the scaffolding model.

Instead of relying on the browser's default font-sizing for headings, use your
own CSS, and don't skip levels. 

For example, this site has a section called "In the news", followed by two
headlines: 

![A news site with a headline, hero image, and subsections.](./headings.png)

The section heading, "In the news", could be an H2, and the supporting
headlines could both be H3s.

Because the `font-size` for "In the news" is _smaller_ than the headline, It may
be tempting to make the headline for the first story into an H2 and "In the
news" into an H3. While that may match the browser's default styling, it would
break the outline conveyed to a screen reader user!

<div class="aside note">
Though it may seem counterintuitive, it does not matter if <em>visually</em> H3s
and H4s are larger than their H2 or H1 counterparts. What matters is the
structure conveyed by the tags and how they are ordered.
</div>

You can use Lighthouse to check if your page skips any heading levels. Run the
Accessibility Audit (Lighthouse > Options > Accessibility) and look for the
results of the "Headings don't skip levels" audit.

## Use landmarks to aid navigation

HTML5 elements such as `main`, `nav`, and `aside` act as **landmarks** or
special regions on the page that a screen reader can jump to.

Use landmark tags to define major sections of your page, instead of relying on
`divs`. Be careful not to go overboard, as having _too many_ landmarks can be
overwhelming. For example, stick to just one `main` element instead of 3 or
4.

Lighthouse recommends manually auditing your site to check that "HTML5 landmark
elements are used to improve navigation". You can use this
[list of landmark elements](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html)
to check your page.

## Bypass repetitive content with skip links

Many sites contain repetitive navigation in their headers, which can be annoying
to navigate with a screen reader, keyboard, or switch device. Use a **skip
link** to let users bypass this content.

A skip link is an offscreen anchor that is always the first focusable item in
the DOM. Screen readers use skip links to quickly jump to a section on a site.

<pre class="prettyprint">
<!-- index.html -->
&lt;a class="skip-link" href="#main"&gt;Skip to main&lt;/a&gt;
…
&lt;main id="main"&gt;
  [Main content]
&lt;/main&gt;
</pre>

<pre class="prettyprint">
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #BF1722;
  color: white;
  padding: 8px;
  z-index: 100;
  border-bottom-right-radius: 8px;
}

.skip-link:focus {
  top: 0;
}
</pre>

Many popular sites such as [GitHub](https://github.com/), [NY
Times](https://www.nytimes.com/), and [Wikipedia](wikipedia.com) all contain
skip links. Try visiting them and pressing the `TAB` key on your keyboard a
few times.

Lighthouse can help you check if your page contains a skip link. Run the
Accessibility Audit (Lighthouse > Options > Accessibility) and look for the
results of the "The page contains a heading, skip link, or landmark region"
audit.

<div class="note">
Technically this test will also pass if your site contains any H1-H6
elements, or any of the HTML5 landmark elements, so it's a bit vague. But it's
still nice to pass it if you can!
</div>
