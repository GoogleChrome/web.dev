---
title: Optimize Cumulative Layout Shift
subhead: Learn how to avoid sudden layout shifts to improve user-experience
authors:
  - tunetheweb
  - addyosmani
date: 2020-05-05
updated: 2023-05-04
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: |
  Cumulative Layout Shift (CLS) is a metric that quantifies how often users experience sudden shifts in page content. In this guide, we'll cover optimizing common causes of CLS such as images and iframes without dimensions or dynamic content.
alt: Layout shifts can suddenly push the content you are reading or are about to click further down the page, leading to a poor user-experience. Reserving space for dynamic content causing layout shifts leads to a more delightful user experience.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

"I was about to click that! Why did it move? 😭"

[Cumulative Layout Shift (CLS)](/cls/) is one of the three [Core Web Vitals](/vitals/#core-web-vitals) metrics, and it measures the instability of content by summing shift scores across layout shifts that don't occur within 500 milliseconds of user input. It looks at how much visible content shifted in the viewport as well as the distance the elements impacted were shifted.

Layout shifts can be distracting to users. Imagine you've started reading an article when all of a sudden elements shift around the page, throwing you off and requiring you to find your place again. This is very common on the web, including when reading the news, or trying to click those 'Search' or 'Add to Cart' buttons. Such experiences are visually jarring and frustrating. They're often caused when visible elements are forced to move because another element was suddenly added to the page or resized.

To provide a good user experience, **sites should strive to have a CLS of 0.1 or less for at least 75% of page visits.**

<figure>
  <picture>
    <source
      srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}"
      media="(min-width: 640px)"
      width="800"
      height="200">
    {%
      Img
        src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg",
        alt="Good CLS values are under 0.1, poor values are greater than 0.25 and anything in between needs improvement",
        width="640",
        height="480"
    %}
  </picture>
</figure>

Unlike the other Core Web Vitals, which are time-based values measured in seconds or milliseconds, the CLS score is a unitless value based on a calculation of how much content is shifting and by how far.

In this guide, we'll cover optimizing common causes of layout shifts.

The most common causes of a poor CLS are:

- Images without dimensions
- Ads, embeds, and iframes without dimensions
- Dynamically injected content such as ads, embeds, and iframes without dimensions
- Web fonts

{% Aside %}
  For a visual overview of some of the content presented in this guide, see the Optimize for Core Web Vitals video from Google I/O 2020:

  {% YouTube id="AQqFZ5t8uNc", startTime='88', width=2482, height=1396 %}
{% endAside %}

## Understanding where your shifts are coming from

Before we start looking at solutions to common CLS issues, it's always important to understand your CLS score and where the shifts are coming from. A big part of the problem is understanding your CLS score—the fix afterwards is often the easier part!

### CLS in lab tools versus field

It is quite common to hear developers think the CLS measured by the [Chrome UX Report (CrUX)](https://developer.chrome.com/docs/crux/) is incorrect as it does not match the CLS they measure using Chrome DevTools or other lab tools. Web performance lab tools like Lighthouse may not show the full CLS of a page as they typically do a simple load of the page to measure some web performance metrics and provide some guidance (though [Lighthouse user flows](/lighthouse-user-flows/) do allow you measure beyond the default page load audit).

CrUX is the official dataset of the Web Vitals program, and for that, CLS is measured throughout the full life of the page and not just during the initial page load that lab tools typically measure.

Layout shifts are very common during page load, as all the necessary resources are fetched to initially render the page, but layout shifts can also happen after the initial load. Many post-load shifts may occur [as the result of a user interaction](/cls/#user-initiated-layout-shifts) and therefore will be excluded from the CLS score as they are _expected_ shifts—as long as they occur within 500 milliseconds of that interaction.

However, other post-load shifts that are unexpected by the user may be included where there was no qualifying interaction—for example, if you scroll down the page and lazy-loaded content is loaded and that causes shifts. Other common causes of post-load CLS are on interactions of transitions, for example on Single Page Apps, which take longer than the 500 millisecond grace period.

[PageSpeed Insights](https://pagespeed.web.dev/) will show both the user-perceived CLS from a URL where it exists in the "Discover what your real users are experiencing" section, and also the lab-based load CLS in the "Diagnose performance issues" section beneath. If you see a difference between these, this is likely caused by post-load CLS.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/2eO9BsIb8Gx6kU4Zvbqa.png", alt="Screenshot of PageSpeed Insights showing URL-level data highlighting the real user CLS which is considerably larger than the Lighthouse CLS", width="800", height="450" %}

{% Aside important %}
  PageSpeed Inights will show URL-level data where it exists, and attempt to fall back to origin-level data where this does not exist. Always check what data is showing to ensure you do not waste time trying to track down a CLS issue that actually exists on other pages on your origin! In the above example you can see this is URL-level data as shown in the top right of the image.
{% endAside %}

### Identifying load CLS issues

When the CrUX and Lighthouse CLS scores of PageSpeed Insights are broadly in line, this usually indicates there is a load CLS issue that was detected by Lighthouse. In this case Lighthouse will help with two audits to provide more information on images causing CLS due to missing width and height, and also list all the elements that shifted for the page load along with their CLS contribution. You can see these audits by filtering on the CLS audits:

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/2C3v6dGwPx2yFyYpVdue.png", alt="Lighthouse Screenshot showing the CLS audits providing more information to help you identify and address CLS issues", width="800", height="544" %}

{% Aside important %}
  Lighthouse will identify the elements that were shifted, but often these are the ones _impacted_ rather than the elements _causing_ the CLS. For example, if a new element is inserted into the DOM, the elements that are beneath it will show in this audit, but the root cause is the addition of the new element above. However, the shifted element should be sufficient to help you identify and resolve the root cause.
{% endAside %}

The [Performance panel](https://developer.chrome.com/docs/devtools/evaluate-performance/) in DevTools also highlights layout shifts in the **Experience** section. The **Summary** view for a `Layout Shift` record includes the cumulative layout shift score as well as a rectangle overlay showing the affected regions. This is particularly helpful to get more detail on load CLS issues since this is easily replicated with a reload performance profile.

<figure>
  {% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Layout Shift records being displayed in the Chrome DevTools performance panel when expanding the Experience section", width="800", height="438" %}
  <figcaption>After recording a new trace in the Performance panel, the <b>Experience</b> section of the results is populated with a red-tinted bar displaying a <code>Layout Shift</code> record. Clicking the record allows you to drill down into impacted elements (e.g. note the moved from/to entries).</figcaption>
</figure>

### Identifying post-load CLS issues

When the CrUX and Lighthouse CLS scores of PageSpeed Insights are not in line, then this likely indicates post-load CLS. Without field data helping to identify the reason (that we will cover next), these can be more tricky to track down.

The [Web Vitals Chrome extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) can be used to monitor CLS as you interact with a page, either in a heads up display, or in the console—where you can [get more details above the elements shifted](/debug-cwvs-with-web-vitals-extension/#cls-debug-information).

As an alternative to using the extension, you can browse your web page while [recording layout shifts using a Performance Observer](/cls/#measure-layout-shifts-in-javascript) pasted into the console.

Once you are monitoring shifts you can try to replicate any post-load CLS issues. Scolling down a page is a common place for CLS to occur if content is lazy loaded and does not have space reserved for it. Content shifting on hover is another common post-load CLS cause. Both of these "interactions" are ineligible for the 500 milliseconds grace period as CLS during these periods are seen as being "unexpected shifts", despite the user interaction, as they should not cause content to shift. Other interactions—such as clicks or taps—do have that grace period, but a common reason for CLS in these cases is taking longer than that 500 milliseconds to move or add content.

We have a more detailed posted on [debugging layout shifts](/debug-layout-shifts/) for more information.

Once you have identified any common causes of CLS, the [timespans user flow mode of Lighthouse](lighthouse-user-flows/#timespans) can also be used to ensure typical user flows do not regress by introducing layout shifts.

### Measuring CLS elements in the field

It is also recommended to monitor CLS in the field. This can be used to measure both the CLS and—perhaps more importantly—the elements impacting your CLS score in the field and feed them back to your analytics service.

This can be invaluable in pointing you in the right direction of where the issue is as it can remove much of the guess work discribed above when you are trying to understand under what circumstances CLS is occuring. Again, be aware that this will measure the elements that shifted, rather than the root causes of those shifts, but this is often sufficient to identify the cause or at least to narrow down the problem.

Measuring CLS in the field can also be used to rank the issues in order of importance based on most frequently experienced issues.

The [attribution functionality of the `web-vitals` library](https://github.com/GoogleChrome/web-vitals#send-attribution-data) allows this additional information to be collected. Read our [Debug performance in the field](/debug-performance-in-the-field/) post for more information on how to do this. Other RUM providers have also started collecting and presenting this data similarly.

{% Aside %}
  RUM solutions that measure CLS in the field, including the `web-vitals` library, may show differences that CrUX data as explained in the [Why is CrUX data different from my RUM data?](crux-and-rum-differences/) post. In particular, CLS that happens in iframes is not measurable from Web APIs but is visible to the user, and is therefore included in CrUX. So while field data can be invaluable for identifying CLS issues, be aware that it may be incomplete in certain scenarios.
{% endAside %}

## Common causes of CLS

Once you have identified the causes of CLS, you can start working on fixing the issues. In this section we will show some of the more common reasons for CLS, and what you can do to avoid them.

### Images without dimensions

Always include `width` and `height` size attributes on your images and video elements. Alternatively, reserve the required space with [CSS `aspect-ratio`](/aspect-ratio/) or similar. This approach ensures that the browser can allocate the correct amount of space in the document while the image is loading.

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

#### History of `width` and `height` attributes on images

In the early days of the web, developers would add `width` and `height` attributes to their `<img>` tags to ensure sufficient space was allocated on the page before the browser started fetching images. This would minimize reflow and re-layout.

```html
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons">
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

#### Modern best practice for setting image dimensions

Modern browsers now set the default aspect ratio of images based on an image's `width` and `height` attributes so developers just need to set these, and include the above CSS, to prevent layout shifts:

```html
<!-- set a 640:360 i.e a 16:9 aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons">
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

#### What about responsive images?

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

It's very possible these images could have different aspect ratios. Chrome, Firefox, and Safari now support setting `width` and `height` on the `source` children of the `picture` element:

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" width=480 height=400/>
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" width=800 height=400/>
  <img src="puppy-800w.jpg" alt="Puppy with balloons" width=800 height=400/>
</picture>
```

### Ads, embeds, and other late-loaded content

As we have seen, images have special considerations. However, images are not the only type of content that can cause layout shifts. Ads, embeds, iframes, and other dynamically injected content can all cause content after these to shift down, increasing your CLS.

Ads are one of the largest contributors to layout shifts on the web. Ad networks and publishers often support dynamic ad sizes. Ad sizes increase performance/revenue due to higher click rates and more ads competing in the auction. Unfortunately, this can lead to a suboptimal user experience due to ads pushing visible content you're viewing down the page.

Embeddable widgets allow you to include portable web content in your page, such as videos from YouTube, maps from Google Maps, and social media posts. These widgets often aren't aware in advance just how large their contents will be. For example, in the case of a social media post, it might have an embedded image, video, multiple rows of text, or a number of other unpredictable factors. As a result, platforms offering embeds do not always reserve space for their widgets and so cause layout shifts when they finally load.

The techniques for dealing with these are all similar. The major differences are how much control you have over the content that will be inserted. If this is inserted by a third-party like an ad partner, you may not know the exact size of content that will be inserted, nor be able to control any layout shifts happening within those embeds.

#### Statically reserve space for late-loading content

When placing late-loading content in the content flow, layout shifts can be avoided by reserving the space for them in the initial layout.

This can be as simple as adding a `min-height` styling to reserve space or, for responsive content such as ads, using the new [`aspect-ratio`](/aspect-ratio/) CSS property in a similar manner to the way browsers automatically use this for images with dimensions provided.

<figure>
  {% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/ThcGvVp0RiiABpmnWz7u.svg", alt="Three mobile devices with just text content in the first device, this is shifted down in the second device, and reserving space with a placeholder as shown in the third device prevents the shift", width="1180", height="600" %}
  <figcaption>
    Reserving space for ads can prevent layout shifts
  </figcaption>
</figure>

You may need to account for subtle differences in ad or placeholder sizes across form factors using media queries.

For content that may not have a fixed height—like ads—you may not be able to reserve the exact amount of space needed to eliminate the layout shift entirely. If a smaller ad is served, a publisher can style the (larger) container to avoid layout shifts, or choose the most likely size for the ad slot based on historical data. The downside to this approach is that it will increase the amount of blank space, so keep in mind the trade-off here.

Alternatively, set the initial size to the smallest size that will be used, and accept some level of shift for larger content. Using `min-height`, as suggested above, will allow the parent element to grow as necessary. This will not fully eliminate CLS, but will hopefully reduce the impact of it to a more managable level. The default size of an empty element is 0px which gives maximum CLS, so any size is better than that!

Try to avoid collapsing the reserved space if, for example, there is no ad returned, by showing a placeholder. Removing the space set aside for elements can cause just as much CLS as inserting content!

#### Avoid placing late-loading content near the top of the viewport

Dynamically injected content near the top of the viewport may cause a greater layout shift than those at the middle. This is because elements inserted at the top generally have more content lower down, meaning more elements move when the late-loading content causes a shift.

Conversely, dynamically injected content near the middle of the viewport may not shift as many elements as the content above it is less likely to move, but will still cause some CLS. Even content injected at the bottom of the screen will cause CLS as the content it replace is moved off-screen.

The ideal scenario is not to shift any other content so reserving the appropriate space is preferred. Where this is not possible, minimizing the shifts can at least reduce the impact—both to your users and your CLS scores.

#### Avoid inserting new content without a user interaction

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

If you need to display these types of UI affordances, reserve sufficient space in the viewport for it in advance (for example, using a placeholder or skeleton UI) so that when it loads, it does not cause content in the page to surprisingly shift around. Alternatively, ensure the element is not part of the document flow by overlaying the content where this makes sense. See the [Best practices for cookie notices](/cookie-notice-best-practices/) post for more recommendations on these types of components.

In some cases adding content dynamically is an important part of user experience. For example, when loading more products to a list of items or when updating live feed content. There are several ways to avoid unexpected layout shifts in those cases:

- Replace the old content with the new content within a fixed size container or use a carousel and remove the old content after the transition. Remember to disable any links and controls until the transition has completed to prevent accidental clicks or taps while the new content is coming in.
- Have the user initiate the load of new content, so they are not surprised by the shift (for example with a "Load more" or "Refresh" button). It's recommended to prefetch the content before the user interaction so that it shows up immediately. As a reminder, [layout shifts that occur within 500 milliseconds](./cls/#user-initiated-layout-shifts) of user input are not counted towards CLS.
- Seamlessly load the content offscreen and overlay a notice to the user that it's available (for example, with a "Scroll up" button).

<figure>
  {% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="Examples of dynamic content loading without causing unexpected layout shifts from Twitter and the Chloé website", width="800", height="458" %}
  <figcaption>
    Examples of dynamic content loading without causing unexpected layout shifts. Left: Live feed content loading on Twitter. Right: "Load More" example on Chloé website. Check out how the YNAP team <a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">optimized for CLS when loading more content</a>.
  </figcaption>
</figure>

{% Aside important %}
  If content is likely to take more than 500 milliseconds—for example it requires a network fetch—then reserving the expected space within that 500 millisecond timeframe and taking the impact of any future shift up front allows you to ensure any shifts will not be included in the CLS score.
{% endAside %}

### Animations

Changes to CSS property values can require the browser to react to these changes. A number of values trigger re-layout, paint, and composite such as `box-shadow` and `box-sizing`. Try to avoid animating these.

A number of CSS properties can be changed in a much more performant manner. For example, `transform` animations can be used to translate, scale, rotate, or skew without triggering a re-layout and so completely avoiding layout shifts.

When animations are instead done by changing `top` and `left` CSS properties instead of using `translate`, layout shifts occur. This happens **even when the element being moved is in it's own layer and so does not cause shifts to other elements**. Composited animations via `translate` are exempt from CLS as they cannot impact other elements. There are also other considerable performance benefits of using non-composited animations since they do no cause re-layout and therefore are much less work for the browser.

To learn more about what CSS properties trigger layout see [High-performance animations](/animations-guide/).

### Web fonts

Downloading and rendering web fonts is typically handled in one of two ways before the web font is downloaded:

- The fallback font is swapped with the web font (FOUT—flash of unstyled text)
- "Invisible" text is displayed using the fallback font until a web font is available and the text is made visible (FOIT—flash of invisible text)

It is important to understand that **both of these can cause layout shifts**. Even though the text is invisible, it is laid out using the fallback font. This means the text block using the font, and the surrounding content, shifts when the web font loads—in the exact same way as for the visible font for FOUT.

The following tools can help you minimize this:

- `font-display: optional` can avoid a re-layout as the web font is only used if it is available by the time of initial layout.
- Ensure the appropriate fallback font is used. For example, using `font-family: "Google Sans", sans-serif;` will ensure the browser's `sans-serif` fallback font is used while `"Google Sans"` is loaded. Not specifying a fallback font using just `font-family: "Google Sans"` will mean the default font is used, which on Chrome is "Times"—a serif font which is a worse match than the default `sans-serif` font.
- Minimize the size differences between the fallback font and the web font using the new `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` APIs as detailed in the [Improved font fallbacks](https://developer.chrome.com/blog/font-fallbacks/) post.
- The [Font Loading API](/optimize-webfont-loading/#the-font-loading-api) can reduce the time it takes to get necessary fonts.
- Load critical web fonts as early as possible using `<link rel=preload>`. A preloaded font will have a higher chance to meet the first paint, in which case there's no layout shifting.

Read [Best practices for fonts](/font-best-practices/) for other font best practices.

## Reduce CLS by ensuring pages are eligible for the bfcache

A highly effective technique for keeping CLS scores low is to ensure your web pages are eligible for the [back/forward cache](/bfcache/) (bfcache).

The bfcache keeps pages in browsers memory for a short period after you navigate away so if you return to them, then they will be restored exactly as you left them. This means the fully loaded page is instantly available—without any shifts which may be normally seen during load due to any of the reasons above.

While this does potentially still mean the initial page load encounters layout shifts, when a user goes back through pages they are not seeing the same layout shifts repeatedly. You should always aim to avoid the shifts even on the initial load, but where that is more tricky to resolve fully, you can at least reduce the impact by avoiding them on any bfcache navigations.

Back and forward navigations are common on many sites. For example, returning to a contents page, or a category page, or search results.

When this was rolled out to Chrome, we saw [noticeable improvements in CLS](https://twitter.com/anniesullie/status/1491399685961293828?s=20&t=Qj_nzSRZD0_c-HaAnfr98Q).

The bfcache is used by default by all browsers, but some sites are ineligible for the bfcache due to a variety of reasons. Read [the bfcache article](/bfcache/) for more details on how to test and identify any issues preventing bfcache usage to ensure you are making full use of this feature to help your overall CLS score for your site.

## Conclusion

There are a number of techniques to identify and improve CLS as detailed above. There are allowances built into Core Web Vitals, so even if you cannot eliminate CLS completely, using some of these techniques should allow you to reduce the impact. This will be better for your users and hopefully allow you to stay within those limits.

That's it for this guide. We hope it helps keep your pages just a little less shifty :)
