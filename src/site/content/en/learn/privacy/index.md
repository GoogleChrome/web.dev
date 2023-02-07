---
title: Learn Privacy
authors:
  - sil
description: A course to help you build more privacy-preserving websites.
date: 2023-01-24
---


## With great power…

When you acquire a new user, you are granted their trust. It's your organization's responsibility to honor this trust by keeping
user data private. As people use your service, they will share some information with your site or system so it can function
and serve them best.

As a developer, you have a key role to play! Ensuring that your site or system respects user privacy isn't just a product
manager's or legal team's responsibility.

_You_ have the power to directly improve the privacy of the people who use your site:
* By factoring in privacy early, as you're making technical and design decisions. This is called _privacy by design_.
* By using your technical expertise to equip the people you work with so they can make informed privacy decisions themselves.

Just like making the right security decisions, making good privacy decisions [shouldn't be scary](/security-not-scary/)!
This course is here to help.

## What you will learn

In this course, you will learn about:

* **Pragmatic privacy techniques**. We'll talk about making your site _privacy-preserving_. To be mindful about all the bits
of data that flow through your site, you'll learn a few [encryption](/learn/privacy/encryption/) tips and understand what
it means to collect just the [data](/learn/privacy/data/) you need. We also know that it may be helpful to collect
some user data and to leverage third parties as building blocks for your site to provide useful services—be it payment solutions, map widgets, or
error monitoring scripts. This course will offer tools and tips for you to approach this with care, especially when it
comes to [third parties](/learn/privacy/third-parties/).
* **What's up with web privacy**. You will learn about upcoming browser and web platform privacy improvements,
and how you can prepare your site for these changes. You'll also learn about what [fingerprinting](/learn/privacy/fingerprinting/) protections
in browsers mean for your site.
* **Ways to scale and maintain your organization's privacy approaches**. In [best practices](/learn/privacy/best-practices),
you will find tips to help the people you work with—direct teammates, members of other teams, or your company's leadership—consider
closely the impact of their privacy choices, and make decisions accordingly.

## Prerequisites

To follow this course, you need an intermediate knowledge of HTML, JavaScript, and HTTP requests and headers.

## Why this course matters today

1. User concerns and user experience. People are increasingly concerned about their privacy on the web. Offering more privacy
and being mindful about data collection can help build trust in your service and improve their experience, directly contributing
to your organization's success.
1. Compliance. Over recent years, privacy regulations have emerged all over the world, and keep evolving: in 2017, the
rehauled APPI in Japan; in 2018, the GDPR in Europe, in 2020, the CCPA in California; in 2022, the PDPB in India …
Whether or not you've directly worked on tasks to comply with these regulations, this shift indicates regulators’
growing attention to privacy.
1. Readiness for a more private web. Important privacy improvements have been made and will keep coming to browsers and
to the web platform. Browser vendors are limiting cross-site tracking enabled by third-party cookies, and are actively
combating fingerprinting and other covert tracking techniques. [Safari's ITP](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/),
[Firefox's ETP](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop),
and [third-party cookie phase-out plans in Chrome](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) are a few recent examples.
Besides browser features, changes to the web platform itself are coming: ecosystem actors, browser vendors, and developers are
incubating ideas for new web APIs to replace old ones, and fulfill important use cases in a privacy-preserving way.
All these changes make the web a safer and more private place for users, and they may come with a better developer
experience too! While these changes are improvements, you'll need to take measures to adapt your site or system to them.

## Bear in mind

This course doesn't offer legal advice, and it isn't a checklist. Instead, it lays out code snippets, best practices,
and questions to ask yourself and your team on your privacy journey. Throughout this course, we refer to products or
documentation maintained by third parties to illustrate key points. Your own approach is up to you to define. It will
depend on your organization, your business, and your compliance requirements and users’ needs.

Here's what you'll learn:

{% include 'partials/course-index.njk' %}

Let's get started!

{% Aside %}
This course was written by [Stuart Langridge](https://twitter.com/sil), with input and review from [Maud Nalpas](https://twitter.com/maudnals), Martin Sramek, and [Rachel Andrew](https://twitter.com/rachelandrew). Special thanks to David Adrian for providing additional support for the encryption module, Rainhard Findling for providing additional support for the data module, and Annette McFadyen and [Aaron Forinton](https://github.com/aaronforinton) for supporting the publication process.
{% endAside %}
