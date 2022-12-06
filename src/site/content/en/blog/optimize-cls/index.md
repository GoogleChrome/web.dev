---
title: Optimize Cumulative Layout Shift
subhead: Learn how to avoid sudden layout shifts to improve user-experience
authors:
  - addyosmani
  - tunetheweb
date: 2020-05-05
updated: 2022-10-25
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: |
  Cumulative Layout Shift (CLS) is a metric that quantifies how often users experience sudden shifts in page content. In this guide, we'll cover optimizing common causes of CLS such as images and iframes without dimensions or dynamic content.
alt: Layout shifts can suddenly push the content you are reading or are about to click further down the page, leading to a poor user-experience. Reserving space for dynamic content causing layout shifts leads to a more delightful user experience.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88', width=2482, height=1396 %}

"I was about to click that! Why did it move? 😭"

Layout shifts can be distracting to users. Imagine you've started reading an article when all of a sudden elements shift around the page, throwing you off and requiring you to find your place again. This is very common on the web, including when reading the news, or trying to click those 'Search' or 'Add to Cart' buttons. Such experiences are visually jarring and frustrating. They're often caused when visible elements are forced to move because another element was suddenly added to the page or resized.

[Cumulative Layout Shift](/cls) (CLS) - a [Core Web Vitals](/vitals) metric, measures the instability of content by summing shift scores across layout shifts that don't occur within 500ms of user input. It looks at how much visible content shifted in the viewport as well as the distance the elements impacted were shifted.

In this guide, we'll cover optimizing common causes of layout shifts.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Good CLS values are under 0.1, poor values are greater than 0.25 and anything in between needs improvement", width="384", height="96" %}
</picture>

The most common causes of a poor CLS are:

- Images without dimensions
- Ads, embeds, and iframes without dimensions
- Dynamically injected content
- Web Fonts causing FOIT/FOUT
- Actions waiting for a network response before updating DOM

## Images without dimensions

**Summary:** Always include `width` and `height` size attributes on your images and video elements. Alternatively, reserve the required space with [CSS aspect ratio boxes](https://css-tricks.com/aspect-ratio-boxes/). This approach ensures that the browser can allocate the correct amount of space in the document while the image is loading.

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Images without width and height specified.
    </figcaption>
  </figure>

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Images with width and height specified.
    </figcaption>
  </figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift after setting dimensions on images", width="800", height="148" %}
  <figcaption>
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

All browsers will then add a [default aspect ratio](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images) based on the element's existing `width` and `height` attributes.

This calculates an aspect ratio based on the `width` and `height` attributes before the image has loaded. It provides this information at the very start of layout calculation. As soon as an image is told to be a certain width (for example `width: 100%`), the aspect ratio is used to calculate the height.

This `aspect-ratio` value is calculated by major browsers as the HTML is processed, rather than with a default User Agent stylesheet (see [this post for a deep dive into why](https://jakearchibald.com/2022/img-aspect-ratio/#width--height-presentational-hints)), so the value is displayed a little differently. For example, Chrome displays it like this in the Styles section of the Element panel:

```css
img[Attributes Style] {
  aspect-ratio: auto 640 / 360;
}
```

Safari behaves similarly by using a `HTML Attributes` style source. Firefox does not currently display this calculated `aspect-ratio` at all in it's Inspector panel, but does use it for layout.

The `auto` part of the above code is important as it causes the `640 / 360` to be overriden with the image dimensions once the image is downloaded. If the image dimensions are different this will still cause some layout shift after the image loads, but this ensures the image aspect ratio is still used ultimately when it becomes available—as it was in the past—in case the HTML is incorrect. Plus, the shift is likely to be a lot smaller than the 0x0 default image size when dimensions are not provided!

Tip: If you're having a hard time understanding aspect ratio, a handy [calculator](https://aspectratiocalculator.com/16-9.html) is available to help.

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

It's very possible these images could have different aspect ratios and browsers are still evaluating what the most efficient solution here should be, including if dimensions should be specified on all sources.

Chrome and Safari now support setting `width` and `height` on the `source` elements of `<picture>` element:

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" width=480 height=400/>
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" width=800 height=400/>
  <img src="puppy-800w.jpg" alt="Puppy with balloons" width=800 height=400/>
</picture>
```

On Firefox, these extra `width` and `height` attributes on `<source>` elements will currently be ignored and only the `width` and `height` attributes on the `<img>` will be used (even if the image itself is loaded from a `<source>` element). That's not great, but when the responsive image is loaded they will be reset, so it will be given the correct dimensions—just later than on Chrome and Safari.

## Ads, embeds and iframes without dimensions

As we have seen images have special considerations, but these are not the only content that can cause layout shifts.

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

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Ads without sufficient space reserved.
    </figcaption>
  </figure>

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Ads with sufficient space reserved.
    </figcaption>
  </figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for banners like ads", width="800", height="148" %}
  <figcaption>
    Lighthouse impact of reserving space for this banner on CLS
  </figcaption>
</figure>

#### Statically reserve space for the ad slot

Statically style slot DOM elements with the same sizes passed to your tag library. This can help ensure the library doesn't introduce layout shifts when it loads. If you don't do this, the library may change the size of the slot element after page layout.

This can be as simple as adding a `min-height` styling to reserve space or, for responsive ad sizings using the new [`aspect-ratio`](/aspect-ratio/) CSS property in a similar manner to the way browsers automatically use this for images with dimensions provided.

<figure>
  {% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/ThcGvVp0RiiABpmnWz7u.svg", alt="Three mobile devices with jjst text content in the first device, this is shifted down in the second device, and reserving space with a placehodler as shown in the third device prevents the shift", width="1180", height="600" %}
  <figcaption>
    Reserving space for ads can prevent layout shifts
  </figcaption>
</figure>

Also consider the sizes of smaller ad serves. If a smaller ad is served, a publisher can style the (larger) container to avoid layout shifts. The downside to this approach is that it will increase the amount of blank space, so keep in mind the trade-off here.

Alternatively, set the initial size to the smallest ad size, and accept some level of shift for larger ads. This will not fully eliminate CLS, but will hopefully reduce the impact of it to a more managable level.

#### Avoid placing ads near the top of the viewport

Ads near the top of the viewport may cause a greater layout shift than those at the middle. This is because ads at the top generally have more content lower down, meaning more elements move when the ad causes a shift. Conversely, ads near the middle of the viewport may not shift as many elements as the content above it is less likely to move.

### Embeds and iframes

Embeddable widgets allow you to embed portable web content in your page (for example, videos from YouTube, maps from Google Maps, social media posts, and so on). These embeds can take a number of forms:

- HTML fallback and a JavaScript tag transforming the fallback into a fancy embed
- Inline HTML snippet
- iframe embed

These embeds often aren't aware in advance just how large an embed will be (for example, in the case of a social media post - does it have an embedded image? video? multiple rows of text?). As a result, platforms offering embeds do not always reserve enough space for their embeds and can cause layout shifts when they finally load.

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Embed without space reserved.
    </figcaption>
  </figure>

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Embed with space reserved.
    </figcaption>
  </figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="Lighthouse report showing the before/after impact to Cumulative Layout Shift of reserving space for this embed on CLS", width="800", height="148" %}
  <figcaption>
    Lighthouse impact of reserving space for this embed on CLS
  </figcaption>
</figure>

To work around this, you can minimize CLS by precomputing sufficient space for embeds with a placeholder or fallback. One workflow you can use for embeds:

- Obtain the height of your final embed by inspecting it with your browser developer tools
- Once the embed loads, the contained iframe will resize to fit so that its contents will fit.

Take note of the dimensions and style a placeholder for the embed accordingly. You may need to account for subtle differences in ad/placeholder sizes between different form factors using media queries.

### Dynamic content

**Summary:** Avoid inserting new content above existing content, unless in response to a user interaction. This ensures any layout shifts that occur are expected.

You've probably experienced layout shifts due to UI that pops-in at the top or bottom of the viewport when you're trying to load a site. Similar to ads, this often happens with banners and forms that shift the rest of the page's content:

- "Sign-up to our newsletter!" (whoa, slow down! we just met!)
- "Related content"
- "Install our [iOS/Android] app"
- "We're still taking orders"
- "GDPR notice"

  <figure>
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg",
      controls=true,
      loop=true,
      muted=true %}
   <figcaption>
      Dynamic content without space reserved.
    </figcaption>
  </figure>

If you need to display these types of UI affordances, reserve sufficient space in the viewport for it in advance (for example, using a placeholder or skeleton UI) so that when it loads, it does not cause content in the page to surprisingly shift around.

In some cases adding content dynamically is an important part of user experience. For example, when loading more products to a list of items or when updating live feed content. There are several ways to avoid unexpected layout shifts in those cases:

*   Replace the old content with the new content within a fixed size container or use a carousel and remove the old content after the transition. Remember to disable any links and controls until the transition has completed to prevent accidental clicks or taps while the new content is coming in.
*   Have the user initiate the load of new content, so they are not surprised by the shift (for example with a "Load more" or "Refresh" button). It's recommended to prefetch the content before the user interaction so that it shows up immediately. As a reminder, [layout shifts that occur within 500&nbsp;ms](./cls/#user-initiated-layout-shifts) of user input are not counted towards CLS.
*   Seamlessly load the content offscreen and overlay a notice to the user that it's available (for example, with a "Scroll up" button).


<figure>
  {% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="Examples of dynamic content loading without causing unexpected layout shifts from Twitter and the Chloé website", width="800", height="458" %}
  <figcaption>
    Examples of dynamic content loading without causing unexpected layout shifts. Left: Live feed content loading on Twitter. Right: "Load More" example on Chloé website. Check out how the YNAP team <a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">optimized for CLS when loading more content</a>.
  </figcaption>
</figure>

### Web fonts causing FOUT/FOIT

Downloading and rendering web fonts can cause layout shifts in two ways:

- The fallback font is swapped with a new font (FOUT - flash of unstyled text)
- "Invisible" text is displayed until a new font is rendered (FOIT - flash of invisible text)

The following tools can help you minimize this:

- [`font-display`](https://developer.chrome.com/docs/lighthouse/performance/font-display/) allows you to modify the rendering behavior of custom fonts with values such as `auto`, `swap`, `block`, `fallback` and `optional`. Unfortunately, all of these values (except [`optional`](http://crrev.com/749080)) can cause a re-layout in one of the above ways.
- The [Font Loading API](./optimize-webfont-loading/#the-font-loading-api) can reduce the time it takes to get necessary fonts.

More recommendations for reducing font-related CLS:

- Using `<link rel=preload>` on the key web fonts: a preloaded font will have a higher chance to meet the first paint, in which case there's no layout shifting.
- Combining `<link rel=preload>` and `font-display: optional`

Read [Prevent layout shifting and flashes of invisible text (FOIT) by preloading optional fonts](/preload-optional-fonts/) for more details, and [Best practices for fonts](/font-best-practices/) for other font best practices.

### Animations

**Summary:** Prefer `transform` animations to animations of properties that trigger layout changes.

Changes to CSS property values can require the browser to react to these changes. A number of values trigger re-layout, paint and composite such as `box-shadow` and `box-sizing`. A number of CSS properties can be changed in a less costly manner.

To learn more about what CSS properties trigger layout, see [CSS Triggers](https://csstriggers.com/) and [High-performance animations](/animations-guide/).

### bfcache

The back/forward cache, or bfcache keeps pages in browsers memory for a short period so if you return to them, then they will be restored exactly as you left them. This means the fully loaded page is instantly available—without any shifts which may be normally seen during load to to any of the reason above. When this was rolled out to Chrome, we saw [noticeable improvements in CLS](https://twitter.com/anniesullie/status/1491399685961293828?s=20&t=Qj_nzSRZD0_c-HaAnfr98Q).

Some sites are ineligible for the bfcache due to a variety of reasons. Ensuring your site is eligible is a sure fire way to keep CLS scores down. Read [the bfcache article](/bfcache/) for more details on how to test and identify any issues preventing bfcache usage.

### Developer Tools

There are a number of tools available to measure and debug Cumulative Layout Shift (CLS).

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) includes support for measuring CLS in a lab setting. It will also highlight the nodes that cause the most layout shifting.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="Lighthouse includes support for measuring CLS in the metrics section", width="800", height="309" %}

The [Performance panel](https://developer.chrome.com/docs/devtools/evaluate-performance/) in DevTools highlights layout shifts in the **Experience** section. The **Summary** view for a `Layout Shift` record includes the cumulative layout shift score as well as a rectangle overlay showing the affected regions.

<figure>
  {% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Layout Shift records being displayed in the Chrome DevTools performance panel when expanding the Experience section", width="800", height="438" %}
  <figcaption>After recording a new trace in the Performance panel, the <b>Experience</b> section of the results is populated with a red-tinted bar displaying a <code>Layout Shift</code> record. Clicking the record allows you to drill down into impacted elements (e.g. note the moved from/to entries).</figcaption>
</figure>

The newer [Performance Insights panel](https://developer.chrome.com/docs/devtools/performance-insights/) also includes full support for identifying shifts.

Measuring real-world CLS aggregated at an origin-level is also possible using the [Chrome User Experience Report](/chrome-ux-report-bigquery/). CrUX CLS data is available via BigQuery and a [sample query](https://github.com/GoogleChrome/CrUX/blob/main/sql/cls-summary.sql) to look at CLS performance is available to use.

## Conclusion

There are a number of techniques to improve CLS as detailed above. There are allowances built into Core Web Vitals, so even if you cannot eliminate CLS completely, using some of these techniques should allow you to reduce the impact. This will be better for your users and hopefully allow you to stay within those limits.

That's it for this guide. We hope it helps keep your pages just a little less shifty :)

_With thanks to Philip Walton, Kenji Baheux, Warren Maresca, Annie Sullivan, Steve Kobes and Gilberto Cocchi for their helpful reviews._
