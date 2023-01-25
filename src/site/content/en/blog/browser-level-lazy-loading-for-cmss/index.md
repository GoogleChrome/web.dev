---
layout: post
title: Browser-level lazy-loading for CMSs
subhead: Learnings for adopting the standardized loading attribute
authors:
  - felixarntz
date: 2020-11-20
#updated: 2020-11-20
hero: image/admin/Tx8vq8DMsflw49EHAa8Q.jpg
alt: A lazy leopard relaxing on a tree
description: |
  This post provides guidance on how to adopt the loading
  attribute in content management systems.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

My goal with this post is to persuade CMS platform developers and contributors
(i.e. the people who develop CMS cores) that
[now is the time to implement support for the browser-level image lazy-loading feature](#the-case-for-implementing-lazy-loading-now).
I'll also share recommendations on how to [ensure high-quality user
experiences](#user-experience-recommendations) and [enable customization by other
developers](#technical-recommendations) while implementing lazy-loading. These
guidelines come from our experience adding support to WordPress as well as
helping Joomla, Drupal, and TYPO3 implement the feature.

Regardless of whether you're a CMS platform developer or a CMS user (i.e. a
person who builds websites with a CMS), you can use this post to learn more
about the benefits of browser-level lazy-loading in your CMS. Check out the
[Next steps](#next-steps) section for suggestions on how you can
encourage your CMS platform to implement lazy-loading.

## Background

Over the past year,
[lazy-loading images and iframes using the `loading` attribute](/browser-level-image-lazy-loading/)
has
[become part of the WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes)
and
[seen growing adoption by various browsers](https://caniuse.com/#feat=loading-lazy-attr).
These milestones however only lay the groundwork for a
[faster and more resource-saving web](/browser-level-image-lazy-loading/#why-browser-level-lazy-loading).
It is now on the distributed web ecosystem to make use of the `loading`
attribute.

Content management systems
[power about 60% of websites](https://w3techs.com/technologies/overview/content_management),
so these platforms play a vital role in bringing adoption of modern browser
features to the web. With a few popular open-source CMSs such as
[WordPress](https://make.wordpress.org/core/2020/07/14/lazy-loading-images-in-5-5/),
[Joomla](https://github.com/joomla/joomla-cms/pull/28838), and
[TYPO3](https://review.typo3.org/c/Packages/TYPO3.CMS/+/63317) having already
implemented support for the `loading` attribute on images, let's have a look at
their approaches and the takeaways which are relevant for adopting the feature
in other CMS platforms as well. Lazy-loading media is a key web performance
feature that sites should benefit from at a large scale, which is why adopting
it at the CMS core level is recommended.

## The case for implementing lazy-loading now

### Standardization

Adoption of non-standardized browser features in CMSs facilitates widespread
testing and can surface potential areas of improvement. However, the general
consensus across CMSs is that, as long as a browser feature is not standardized,
it should preferably be implemented in the form of an extension or plugin for
the respective platform. Only once standardized can a feature be considered for
adoption in the platform core.

{% Aside 'success' %}
Browser-level lazy-loading is now part of the WHATWG HTML Standard for
both
[`img`](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-loading)
and
[`iframe`](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-loading)
elements.
{% endAside %}

### Browser support

Browser support of the feature is a similar concern: The majority of CMS users
should be able to benefit from the feature. If there is a considerable
percentage of browsers where the feature is not yet supported, the feature has
to ensure that it at least has no adverse effect for those.

{% Aside 'success' %}
[Browser-level lazy-loading is widely supported by browsers](https://caniuse.com/#feat=loading-lazy-attr)
and
[the `loading` attribute is simply ignored](/browser-level-image-lazy-loading/#browser-compatibility)
by those browsers that have not adopted it yet.
{% endAside %}

### Distance-from-viewport thresholds

A common concern with lazy-loading implementations is that they in principle
increase the likelihood that an image will not be loaded once it becomes visible
in the user's viewport because the loading cycle starts at a later stage.
Contrary to previous JavaScript-based solutions,
[browsers approach this conservatively](/browser-level-image-lazy-loading/#distance-from-viewport-thresholds)
and furthermore can fine-tune their approach based on real-world user experience data,
minimizing the impact, so browser-level lazy-loading should be safe to adopt
by CMS platforms.

{% Aside 'success' %}
Experiments using Chrome on Android indicated that on 4G networks, 97.5% of
below-the-fold lazy-loaded images were fully loaded within 10ms of becoming
visible, compared to 97.6% for non lazy-loaded images. In other words, there was
virtually no difference (0.1%) in the user experience of eagerly-loaded images
and lazy-loaded images.
{% endAside %}

## User experience recommendations

### Require dimension attributes on elements

In order to avoid [layout shifts](/cls/), it has been a
long-standing recommendation that
[embedded content such as images or iframes should always include the dimension attributes `width` and `height`](/optimize-cls/#images-without-dimensions),
so that the browser can infer the aspect ratio of those elements before actually
loading them. This recommendation is relevant regardless of whether an element
is being lazy-loaded or not. However, due to the
[0.1% greater likelihood of an image not being fully loaded once in the viewport](#distance-from-viewport-thresholds)
it becomes slightly more applicable with lazy-loading in place.

CMSs should preferably provide dimension attributes on all images and iframes.
If this is not possible for every such element, they are recommended to skip
lazy-loading images which do not provide both of these attributes.

{% Aside 'caution' %}
If the CMS is unable to provide `width` and `height` attributes on
images and iframes on a large scale, you will have to weigh the trade-offs
between saving additional network resources and a slightly higher chance for
layout shifts to decide whether lazy-loading is worth it.
{% endAside %}

### Avoid lazy-loading above-the-fold elements

At the moment CMSs are recommended to only add `loading="lazy"` attributes to
images and iframes which are positioned below-the-fold, to avoid a slight delay
in the [Largest Contentful Paint](/lcp/) metric. However it has
to be acknowledged that it's complex to assess the position of an element
relative to the viewport before the rendering process. This applies especially
if the CMS uses an automated approach for adding `loading` attributes, but even
based on manual intervention several factors such as the different viewport
sizes and aspect ratios have to be considered. Fortunately, the impact of
marking above-the-fold elements with `loading="lazy"` is fairly small, with a
regression of <1% at the 75th and 99th percentiles compared to eagerly-loaded
elements.

{% Aside %}
Depending on the capabilities and audience of the CMS, try to define reasonable
estimates for whether an image or iframe is likely to be in the initial
viewport, for example never lazy-loading elements in a header template. In
addition, offer either a UI or API which allows modifying the existence of the
`loading` attribute on elements.
{% endAside %}

### Avoid a JavaScript fallback

While JavaScript can be used to
[provide lazy-loading to browsers which do not (yet) support the `loading` attribute](/browser-level-image-lazy-loading/#how-do-i-handle-browsers-that-don't-yet-support-lazy-loading),
such mechanisms always rely on initially removing the `src` attribute of an
image or iframe, which causes a delay for the browsers that _do_ support the
attribute. In addition, rolling out such a JavaScript-based solution in the
frontends of a large-scale CMS increases the surface area for potential issues,
which is part of why no major CMS had adopted lazy-loading in its core prior to
the standardized browser feature.

{% Aside 'caution' %}
Avoid providing a JavaScript-based fallback in the CMS. With
growing adoption of the `loading` attribute and no adverse effects on browser
versions that do not support it yet, it is safer to not provide the feature to
those browsers and instead encourage updating to a newer browser version.
{% endAside %}

## Technical recommendations

### Enable lazy-loading by default

The overall recommendation for CMSs implementing browser-level lazy-loading is to
enable it by default, i.e. `loading="lazy"` should be added to images and
iframes, preferably
[only for those elements that include dimension attributes](#require-dimension-attributes-on-elements).
Having the feature enabled by default will result in greater network resource
savings than if it had to be enabled manually, for example on a per-image
basis.

If possible, `loading="lazy"` should
[only be added to elements which likely appear below-the-fold](#avoid-lazy-loading-above-the-fold-elements).
If this requirement is too complex to implement for a CMS, it is then preferable
to globally provide the attribute rather than omit it, since on most websites
the amount of page content outside of the initial viewport is far greater than
the initially visible content. In other words, the resource-saving wins from
using the `loading` attribute are greater than the LCP wins from omitting it.

### Allow per-element modifications

While `loading="lazy"` should be added to images and iframes by default, it is
crucial to allow omitting the attribute on certain images, for example to
optimize for [LCP](/lcp/). If the audience of the CMS is on
average considered more tech-savvy, this could be a UI control exposed for every
image and iframe allowing to opt out of lazy-loading for that element.
Alternatively or in addition, an API could be exposed to third-party developers
so that they can make similar changes through code.

WordPress for example allows to skip the `loading` attribute either for an
[entire HTML tag or context](https://developer.wordpress.org/reference/hooks/wp_lazy_loading_enabled/)
or for a
[specific HTML element in the content](https://developer.wordpress.org/reference/hooks/wp_img_tag_add_loading_attr/).

{% Aside 'caution' %}
If an element should not be lazy-loaded, require or encourage
skipping the `loading` attribute entirely. While using `loading="eager"` is a
supported alternative, this would tell the browser explicitly to always load the
image right away, which would prevent potential benefits if browsers implemented
further mechanisms and heuristics to automatically decide which elements to
lazy-load.
{% endAside %}

### Retrofit existing content

At a high level, there are two approaches for adding the `loading` attribute to
HTML elements in a CMS:

+   Either add the attribute from within the content editor in the
    backend, persistently saving it in the database.
+   Add the attribute on the fly when rendering content from the database in
    the frontend.

It is recommended for CMS to opt for adding the attribute on the fly when
rendering, in order to bring the lazy-loading benefits to any existing content
as well. If the attribute could solely be added through the editor, only new or
recently modified pieces of content would receive the benefits, drastically
reducing the CMS's impact on saving network resources. Furthermore, adding the
attribute on the fly will easily allow for future modifications, should the
capabilities of browser-level lazy-loading be further expanded.

Adding the attribute on the fly should cater for a potentially existing
`loading` attribute on an element though and let such an attribute take
precedence. This way, the CMS or an extension for it could also implement the
editor-driven approach without causing a conflict with duplicate attributes.

#### Optimize server-side performance

When adding the `loading` attribute to content on the fly using (for example) a
server-side middleware, speed is a consideration. Depending on the CMS, the
attribute could be added either via DOM traversal or regular expressions, with
the latter being recommended for performance.

Regular expressions use should be kept to a minimum, for example a single regex
which collects all `img` and `iframe` tags in the content including their
attributes and then adds the `loading` attribute to each tag string as
applicable. WordPress for example goes as far as
[having a single general regular expression to perform various on-the-fly operations to certain elements](https://developer.wordpress.org/reference/functions/wp_filter_content_tags/),
of which adding `loading="lazy"` is just one, using a single regular expression
to facilitate multiple features. This form of optimization furthermore is
another reason why adopting lazy-loading in a CMS's core is recommended over an
extension - it allows for better server-side performance optimization.

## Next steps

See if there is an existing feature request ticket to add support for the
feature in your CMS, or open a new one if there is none yet. Use references to
this post as needed to support your proposal.

Tweet me ([felixarntz@](https://twitter.com/felixarntz)) for questions or
comments, or to get your CMS listed on this page if support for browser-level
lazy-loading has been added. If you encounter other challenges, I am also
curious to learn more about them to hopefully find a solution.

If you're a CMS platform developer, study how other CMSs have implemented
lazy-loading:

+   [WordPress Core](https://make.wordpress.org/core/2020/07/14/lazy-loading-images-in-5-5/)
+   [Joomla](https://github.com/joomla/joomla-cms/pull/28838)
+   [TYPO3](https://review.typo3.org/c/Packages/TYPO3.CMS/+/63317)

You can use the learnings from your research and the technical recommendations
from this post to start contributing code to your CMS, for example in form of a
patch or pull-request.

Hero photo by [Colin Watts](https://unsplash.com/@imagefactory?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lazy?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText).
