---
title: What are third-party origin trials?
subhead: Origin trials are a way to test a new or experimental web platform feature. A third-party origin trial makes it possible for providers of embedded content to try out a new feature across multiple sites.
authors:
  - samdutton
date: 2020-10-01
updated: 2020-10-07
hero: image/admin/YCJ38YPL2YlvllSTbOUO.jpg
thumbnail: image/admin/hk8e8X9hwfIdxyw5ZHa1.jpg
alt: Person wearing medical gloves pouring purple liquid from glass beaker into flask. Bristol Robotics Laboratory, UK.
tags:
  - blog
  - origin-trials
---

[Origin trials](/origin-trials) are a way to test a new or experimental web platform
feature.

Origin trials are usually only available on a first-party basis: they only work for a single
registered [origin](/same-site-same-origin/#origin). If a developer wants to test an
experimental feature on other origins where their content is embedded, those origins all need to be
registered for the origin trial, each with a unique trial token. This is not a scalable approach for
testing scripts that are embedded across a number of sites.

Third-party origin trials make it possible for providers of embedded content to try out a new
feature across multiple sites.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3lDDKsr313oJfWuEMckG.png", alt="Diagram showing how third-party origin trials enable a single registration token to be used across multiple origins", width="800", height="400" %}

Third-party origin trials don't make sense for all features. Chrome will only make the third-party
origin trial option available for features where embedding code on third-party sites is a common use
case.  [Getting started with Chrome's origin trials](https://developers.chrome.com/origintrials/)
provides more general information about how to participate in Chrome origin trials.

If you participate in an origin trial as a third-party provider, it will be your responsibility to
notify and set expectations with any partners or customers whose sites you intend to include in the
origin trial. Experimental features may cause unexpected issues and browser vendors may not be able
to provide troubleshooting support.

{% Aside %}
Supporting third-party origin trials allows for broader participation, but also increases the
potential for overuse or abuse of experimental features, so a "trusted tester" approach is more
appropriate. The greater reach of third-party origin trials requires additional scrutiny and
additional responsibility for web developers that participate as third-party providers. Requests to
enable a third-party origin trial may be reviewed in order to avoid problematic third-party scripts
affecting multiple sites. The Origin Trials Developer Guide explains the
[approval process](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#18-how-can-i-enable-an-experimental-feature-as-embedded-content-on-different-domains).
{% endAside %}

Check [Chrome Platform Status](https://www.chromestatus.com/features/5691464711405568) for updates
on progress with third-party origin trials.

## How to register for a third-party origin trial

1. Select a trial from the [list of active
   trials](https://developers.chrome.com/origintrials/#/trials/active).
1. On the trial's registration page, enable the option to request a third-party token, if
   available.
1. Select one of the choices for restricting usage for a third-party token:
   1. Standard Limit: This is the usual limit of
      [0.5% of Chrome page loads](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#3-what-happens-if-a-large-site-such-as-a-google-service-starts-depending-on-an-experimental-feature).
   1. User Subset: A small percentage of Chrome users will always be excluded from the trial,
      even when a valid third-party token is provided. The exclusion percentage varies (or might
      not apply) for each trial, but is typically less than 5%.

1. Click the Register button to submit your request.
1. Your third-party token will be issued immediately, unless further review of the request is
   required. (Depending on the trial, token requests may require review.)
1. If review is required, you'll be notified by email when the review is complete and your
   third-party token is ready.

   <figure class="w-figure">
     {% Img src="image/admin/RKAubZHAdOh7HIdQgDkQ.png", alt="Chrome origin trials registration page for the Conversion Measurement API, with third-party matching checkbox selected.", width="800", height="618" %}
     <figcaption class="w-figcaption">Registration page for the Conversion Measurement trial.</figcaption>
   </figure>

## How to provide feedback

If you're registering for a third-party origin trial and have feedback to share on the process or
ideas on how we can improve it, please [create an
issue](https://github.com/GoogleChrome/OriginTrials/issues/new) on the Origin Trials GitHub code
repo.

## Find out more

-  [Getting started with Chrome's origin trials](/origin-trials)
-  [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
-  [Chrome Platform Status](https://www.chromestatus.com/features/5691464711405568)

Photo by [Louis Reed
](https://unsplash.com/@_louisreed) on [Unsplash](https://unsplash.com/photos/JeInkKlI2Po).
