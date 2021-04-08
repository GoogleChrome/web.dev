---
title: Optimize Cumulative Layout Shift
subhead: Learn how to avoid sudden layout shifts to improve user-experience
authors:
  - addyosmani
date: 2020-05-05
updated: 2020-08-20
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: |
  Cumulative Layout Shift (CLS) is a metric that quantifies how often users experience sudden shifts in page content. In this guide, we'll cover optimizing common causes of CLS such as images and iframes without dimensions or dynamic content.
alt: Layout shifts can suddenly push the content you are reading or are about to click further down the page, leading to a poor user-experience. Reserving space for dynamic content causing layout shifts leads to a more delightful user experience.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

{% YouTube 'AQqFZ5t8uNc', '88' %}

"I was about to click that! Why did it move? 😭"

Layout shifts can be distracting to users. Imagine you've started reading an article when all of a sudden elements shift around the page, throwing you off and requiring you to find your place again. This is very common on the web, including when reading the news, or trying to click those 'Search' or 'Add to Cart' buttons. Such experiences are visually jarring and frustrating. They're often caused when visible elements are forced to move because another element was suddenly added to the page or resized.

[Cumulative Layout Shift](/cls) (CLS) - a [Core Web Vitals](/vitals) metric, measures the instability of content by summing shift scores across layout shifts that don't occur within 500ms of user input. It looks at how much visible content shifted in the viewport as well as the distance the elements impacted were shifted.

In this guide, we'll cover optimizing common causes of layout shifts.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Good CLS values are under 0.1, poor values are greater than 0.25 and anything in between needs improvement", width="384", height="96", class="w-screenshot w-screenshot--filled" %}
</picture>

The most common causes of a poor CLS are:

- Images without dimensions
- Ads, embeds, and iframes without dimensions
- Dynamically injected content
- Web Fonts causing FOIT/FOUT
- Actions waiting for a network response before updating DOM

## Images without dimensions 🌆

**Summary:** Always include `width` and `height` size attributes on your images and video elements. Alternatively, reserve the required space with [CSS aspect ratio boxes](https://css-tricks.com/aspect-ratio-boxes/). This approach ensures that the browser can allocate the correct amount of space in the document while the image is loading.

  <figure class="w-figure">
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg",
      controls=true,
      loop=true,
      muted=true,
      class="w-screenshot"
    %}
   <figcaption class="w-figcaption">
      Images without width and height specified.
    </figcaption>
  </figure>

  <figure class="w-figure">
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg",
      controls=true,
      loop=true,
      muted=true,
      class="w-screenshot"
    %}
   <figcaption class="w-figcaption">
      Images with width and height specified.
    </figcaption>
  </figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift after setting dimensions on images", width="800", height="148" %}
  <figcaption class="w-figcaption">
    Lighthouse 6.0 impact of setting image dimensions on CLS.
  </figcaption>
</figure>

### History

In the early days of the web, developers would add `width` and `height` attributes to their `<img>` tags to ensure sufficient space was allocated on the page before the browser started fetching images. This would minimize reflow and re-layout.

```html
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

You may notice `width` and `height` above do not include units. These "pixel" dimensions would ensure a 640x360 area would be reserved. The image would stretch to fit this space, regardless of whether the true dimensions matched or not.

When [Responsive Web Design](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/) was introduced, developers began to omit `width` and `height` and started using CSS to resize images instead:

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

A downside to this approach is space could only be allocated for an image once it began to download and the browser could determine its dimensions. As images loaded in, the page would reflow as each image appeared on screen. It became common for text to suddenly pop down the screen. This wasn't a great user experience at all.

This is where aspect ratio comes in. The aspect ratio of an image is the ratio of its width to its height. It's common to see this expressed as two numbers separated by a colon (for example 16:9 or 4:3). For an x:y aspect ratio, the image is x units wide and y units high.

This means if we know one of the dimensions, the other can be determined. For a 16:9 aspect ratio:

- If puppy.jpg has a 360px height, width is 360 x (16 / 9) = 640px
- If puppy.jpg has a 640px width, height is 640 x (9 / 16) = 360px

Knowing the aspect ratio allows the browser to calculate and reserve sufficient space for the height and associated area.

### Modern best practice

Modern browsers now set the default aspect ratio of images based on an image's width and height attributes so it's valuable to set them to prevent layout shifts. Thanks to the CSS Working Group, developers just need to set `width` and `height` as normal:

```html
<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

…and the [UA stylesheets](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets) of all browsers add a [default aspect ratio](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images) based on the element's existing `width` and `height` attributes:

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

This calculates an aspect ratio based on the `width` and `height` attributes before the image has loaded. It provides this information at the very start of layout calculation. As soon as an image is told to be a certain width (for example `width: 100%`), the aspect ratio is used to calculate the height.

Tip: If you're having a hard time understanding aspect ratio, a handy [calculator](https://aspectratiocalculator.com/16-9.html) is available to help.

The above image aspect ratio changes have shipped in [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231) and [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891), and are coming to [WebKit](https://twitter.com/smfr/status/1220051332767174656) (Safari).

For a fantastic deep-dive into aspect ratio with further thinking around responsive images, see [jank-free page loading with media aspect ratios](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/).

If your image is in a container, you can use CSS to resize the image to the width of this container. We set `height: auto;` to avoid the image height being a fixed value (for example `360px`).

```css
img {
  height: auto;
  width: 100%;
}
```

**What about responsive images?**

When working with [responsive images](/serve-responsive-images), `srcset` defines the images you allow the browser to select between and what size each image is. To ensure `<img>` width and height attributes can be set, each image should use the same aspect ratio.

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="Puppy with balloons"
/>
```

What about [art direction](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)?

Pages may wish to include a cropped shot of an image on narrow viewports with the full image displayed on desktop.

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="Puppy with balloons" />
</picture>
```

It's very possible these images could have different aspect ratios and browsers are still evaluating what the most efficient solution here should be, including if dimensions should be specified on all sources. Until a solution is decided on, relayout is still possible here.

## Ads, embeds and iframes without dimensions 📢😱

### Advertisements

Ads are one of the largest contributors to layout shifts on the web. Ad networks and publishers often support dynamic ad sizes. Ad sizes increase performance/revenue due to higher click rates and more ads competing in the auction. Unfortunately, this can lead to a suboptimal user experience due to ads pushing visible content you're viewing down the page.

During the ad lifecycle, many points can introduce layout shift:

- When a site inserts the ad container in the DOM
- When a site resizes the ad container with first-party code
- When the ad tag library loads (and resizes the ad container)
- When the ad fills a container (and resizes if the final ad has a different size)

The good news is that it's possible for sites to follow best practices to reduce ad shift. Sites can mitigate these layout shifts by:

- Statically reserve space for the ad slot.
  - In other words, style the element before the ad tag library loads.
  - If placing ads in the content flow, ensure shifts are eliminated by reserving the slot size. These ads _shouldn't_ cause layout shifts if loaded off-screen.
- Take care when placing non-sticky ads near the top of the viewport.
  - In the below example, it's recommended to move the ad to below the "world vision" logo and make sure to reserve enough space for the slot.
- Avoid collapsing the reserved space if there is no ad returned when the ad slot is visible by showing a placeholder.
- Eliminate shifts by reserving the largest possible size for the ad slot.
  - This works, but it risks having a blank space if a smaller ad creative fills the slot.
- Choose the most likely size for the ad slot based on historical data.

Some sites may find collapsing the slot initially can reduce layout shifts if the ad slot is unlikely to fill. There isn't an easy way to choose the exact size each time, unless you control the ad serving yourself.

  <figure class="w-figure">
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
      controls=true,
      loop=true,
      muted=true,
      class="w-screenshot"
    %}
   <figcaption class="w-figcaption">
      Ads without sufficient space reserved.
    </figcaption>
  </figure>

  <figure class="w-figure">
      {% Video
        src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"],
        poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
        controls=true,
        loop=true,
        muted=true,
        class="w-screenshot"
      %}
   <figcaption class="w-figcaption">
      Ads with sufficient space reserved.
    </figcaption>
  </figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for banners like ads", width="800", height="148" %}
  <figcaption class="w-figcaption">
    Lighthouse 6.0 impact of reserving space for this banner on CLS
  </figcaption>
</figure>

#### Statically reserve space for the ad slot

Statically style slot DOM elements with the same sizes passed to your tag library. This can help ensure the library doesn't introduce layout shifts when it loads. If you don't do this, the library may change the size of the slot element after page layout.

Also consider the sizes of smaller ad serves. If a smaller ad is served, a publisher can style the (larger) container to avoid layout shifts. The downside to this approach is that it will increase the amount of blank space, so keep in mind the trade-off here.

#### Avoid placing ads near the top of the viewport

Ads near the top of the viewport may cause a greater layout shift than those at the middle. This is because ads at the top generally have more content lower down, meaning more elements move when the ad causes a shift. Conversely, ads near the middle of the viewport may not shift as many elements as the content above it is less likely to move.

### Embeds and iframes

Embeddable widgets allow you to embed portable web content in your page (for example, videos from YouTube, maps from Google Maps, social media posts, and so on). These embeds can take a number of forms:

- HTML fallback and a JavaScript tag transforming the fallback into a fancy embed
- Inline HTML snippet
- iframe embed

These embeds often aren't aware in advance just how large an embed will be (for example, in the case of a social media post - does it have an embedded image? video? multiple rows of text?). As a result, platforms offering embeds do not always reserve enough space for their embeds and can cause layout shifts when they finally load.

  <figure class="w-figure">
    {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Embed without space reserved.
    </figcaption>
  </figure>

  <figure class="w-figure">
    {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Embed with space reserved.
    </figcaption>
  </figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for this embed on CLS", width="800", height="148" %}
  <figcaption class="w-figcaption">
    Lighthouse 6.0 impact of reserving space for this embed on CLS
  </figcaption>
</figure>

To work around this, you can minimize CLS by precomputing sufficient space for embeds with a placeholder or fallback. One workflow you can use for embeds:

- Obtain the height of your final embed by inspecting it with your browser developer tools
- Once the embed loads, the contained iframe will resize to fit so that its contents will fit.

Take note of the dimensions and style a placeholder for the embed accordingly. You may need to account for subtle differences in ad/placeholder sizes between different form factors using media queries.

### Dynamic content 📐

**Summary:** Avoid inserting new content above existing content, unless in response to a user interaction. This ensures any layout shifts that occur are expected.

You've probably experienced layout shifts due to UI that pops-in at the top or bottom of the viewport when you're trying to load a site. Similar to ads, this often this happens with banners and forms that shift the rest of the page's content:

- "Sign-up to our newsletter!" (whoa, slow down! we just met!)
- "Related content"
- "Install our [iOS/Android] app"
- "We're still taking orders"
- "GDPR notice"

  <figure class="w-figure">
    {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
   <figcaption class="w-figcaption">
      Dynamic content without space reserved.
    </figcaption>
  </figure>

If you need to display these types of UI affordances, reserve sufficient space in the viewport for it in advance (for example, using a placeholder or skeleton UI) so that when it loads, it does not cause content in the page to surprisingly shift around.

### Web fonts causing FOUT/FOIT 📝

Downloading and rendering web fonts can cause layout shifts in two ways:

- The fallback font is swapped with a new font (FOUT - flash of unstyled text)
- "Invisible" text is displayed until a new font is rendered (FOIT - flash of invisible text)

The following tools can help you minimize this:

- <code>[font-display](/font-display/)</code> allows you to modify the rendering behavior of custom fonts with values such as <code>auto</code>, <code>swap</code>, <code>block</code>, <code>fallback</code> and <code>optional</code>. Unfortunately, all of these values (except [optional](http://crrev.com/749080)) can cause a re-layout in one of the above ways.
- The [Font Loading API](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api) can reduce the time it takes to get necessary fonts.

As of Chrome 83, I can recommend the following too:

- Using `<link rel=preload>` on the key web fonts: a preloaded font will have a higher chance to meet the first paint, in which case there's no layout shifting.
- Combining `<link rel=preload>` and `font-display: optional`

Read [Prevent layout shifting and flashes of invisible text (FOIT) by preloading optional fonts](/preload-optional-fonts/) for more details.

### Animations 🏃‍♀️

**Summary:** Prefer `transform` animations to animations of properties that trigger layout changes.

Changes to CSS property values can require the browser to react to these changes. A number of values trigger re-layout, paint and composite such as `box-shadow` and `box-sizing`. A number of CSS properties can be changed in a less costly manner.

To learn more about what CSS properties trigger layout, see [CSS Triggers](https://csstriggers.com/) and [High-performance animations](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

### Developer Tools 🔧

I'm happy to share there are a number of tools available to measure and debug Cumulative Layout Shift (CLS).

[Lighthouse](https://developers.google.com/web/tools/lighthouse) [6.0](https://github.com/GoogleChrome/lighthouse/releases) and above include support for measuring CLS in a lab setting. This release will also highlight the nodes that cause the most layout shifting.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="Lighthouse 6.0 includes support for measuring CLS in the metrics section", width="800", height="309" %}

The [Performance panel](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance) in DevTools highlights layout shifts in the **Experience** section as of Chrome 84. The **Summary** view for a `Layout Shift` record includes the cumulative layout shift score as well as a rectangle overlay showing the affected regions.

<figure class="w-figure">
  {% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Layout Shift records being displayed in the Chrome DevTools performance panel when expanding the Experience section", width="800", height="438" %}
  <figcaption class="w-figcaption">After recording a new trace in the Performance panel, the <b>Experience</b> section of the results is populated with a red-tinted bar displaying a <code>Layout Shift</code> record. Clicking the record allows you to drill down into impacted elements (e.g. note the moved from/to entries).</figcaption>
</figure>

Measuring real-world CLS aggregated at an origin-level is also possible using the [Chrome User Experience Report](/chrome-ux-report-bigquery/). CrUX CLS data is available via BigQuery and a [sample query](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql) to look at CLS performance is available to use.

That's it for this guide. I hope it helps keep your pages just a little less shifty :)

_With thanks to Philip Walton, Kenji Baheux, Warren Maresca, Annie Sullivan, Steve Kobes and Gilberto Cocchi for their helpful reviews._
