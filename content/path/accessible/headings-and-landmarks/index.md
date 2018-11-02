---
page_type: guide
title: Headings and landmarks
author: robdodson
web_lighthouse:
  - heading-levels
  - use-landmarks
  - bypass
wf_blink_components: Blink>Accessibility
---

# Headings and landmarks

Screen readers have commands to quickly jump between headings, or to specific
landmark regions. By using the correct semantic elements, you can dramatically
improve the navigation experience for these users.

[A recent survey of screen reader
users](http://www.heydonworks.com/article/responses-to-the-screen-reader-strategy-survey)
found that most screen reader users navigate an unfamiliar page using that the
most common way they navigate an unfamiliar page is with headings and landmarks.

## Use headings to outline the page

Use H1-H6 elements to create a _structural_ outline for your page. The goal is
to create a scaffold or framing of the page such that anyone navigating by
headings can form a mental picture.

A common practice is to use a single H1 for the primary headline or logo on a
page, H2s to designate major sections, and H3s in supporting subsections:

```  
<h1>Company name</h1>  
<div>  
  <h2>Section 1</h2>  
  …  
  <h3>Sub-section 1</h3>  
</div>  
```

## Don't skip heading levels

Developers often skip heading levels to use the browser default styles that
closely match their design. This is considered an anti-pattern because it breaks
the scaffolding model.  
Instead of relying on the browser's default font-sizing for headings, use your
own CSS, and don't skip levels. 

For example, this site has a section called "In the news", followed by two
headlines: 

![image](./headings.png)

The section heading, "In the news", should be an H2, and the supporting
headlines should both be H3s.

It may be tempting to make the headline for the first story into an H2 and "In
the news" into an H3. That would probably match the browser's default styling,
but it would break the outline conveyed to a screen reader user!

It may also be tempting to use divs for the section headings, skip H2s all
together, and have headlines be H3s. This would also break the outline model
since every heading level is supposed to support the heading level above it.

Note: Though it may seem counterintuitive, it does not matter if _visually_ H3s
and H4s are larger than their H2 or H1 counterparts. What matters is the
structure conveyed by the tags and how they are ordered.

Instead of relying on the browser's default font-sizing for headings, use your
own CSS, and don't skip levels. 

You can use Lighthouse to check if your page skips any heading levels. Run the
Accessibility Audit (Lighthouse > Options > Accessibility) and look for the
results of the "Headings don't skip levels" audit.

## Use landmarks to aid navigation

HTML5 elements such as `main`, `nav`, and `aside` act as "landmarks" or special
regions on the page that a screen reader can jump to.

Use landmark tags to define major sections of your page, instead of relying on
`divs`. Be careful not to go overboard as having _too many_ landmarks can also
be overwhelming. For example, stick to just one `main` element instead of 3 or
4.

Lighthouse recommends manually auditing your site to check that "HTML5 landmark
elements are used to improve navigation". You can use this
[list of landmark elements](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html)
to check your page.

## Bypass repetitive content with skip links

Many sites contain repetitive navigation in their headers, which can be annoying
to navigate with a screen reader, keyboard, or switch device. Use a skip link to
let users bypass this content.

A skip link is an offscreen anchor that is always the first focusable item in
the DOM. Screen readers use skip links to quickly jump to a section on a site.

<table>
<thead>
<tr>
<th><p><pre>
&lt;a class="skip-link"
   href="#main"&gt;Skip to main &lt;/a&gt;
…
&lt;main id="main"&gt;
  [Main content]
  &lt;/main&gt;
</pre></p>

</th>
<th><p><pre>
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
<br>
.skip-link:focus {
  top: 0;
}
</pre></p>

</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Many popular sites such as [GitHub](https://github.com/), [NY
Times](https://www.nytimes.com/), and [Wikipedia](wikipedia.com) all contain
skip links. Try visiting them and just pressing the tab key on your keyboard a
few times.

Lighthouse can help you check if your page contains a skip link. Run the
Accessibility Audit (Lighthouse > Options > Accessibility) and look for the
results of the "The page contains a heading, skip link, or landmark region"
audit.

<div class="note">
Technically this test will also pass if your site contains any H1-H6
elements, or any of the HTML5 landmark elements, so it's a bit vague. But it's
still nice to pass it.
</div>
