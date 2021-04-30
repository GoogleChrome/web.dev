---
title: A more private way to measure ad conversions, the Event Conversion Measurement API
subhead: >
  A new web API available as an origin trial measures when an ad click leads to a conversion, without using cross-site identifiers.
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: 2020-10-06
updated: 2020-02-10
tags:
  - blog
  - privacy
---

In order to measure the effectiveness of ad campaigns, advertisers and publishers need to know when
an ad click or view leads to a [conversion](/digging-into-the-privacy-sandbox/#conversion), such as
a purchase or sign-up. Historically, this has been done with **third-party cookies**. Now, the Event
Conversion Measurement API enables the correlation of an event on a publisher's website with a
subsequent conversion on an advertiser site without involving mechanisms that can be used to
recognize a user across sites.

{% Banner 'info', 'body' %} **This proposal needs your feedback!** If you have comments, please
[create an issue](https://github.com/WICG/conversion-measurement-api/issues/) in the API proposal's
repository. {% endBanner %}

{% Aside %} This API is part of the Privacy Sandbox, a series of proposals to satisfy third-party
use cases without third-party cookies or other cross-site tracking mechanisms. See [Digging into the
Privacy Sandbox](/digging-into-the-privacy-sandbox) for an overview of all the proposals. {%
endAside %}

## Glossary

- **Adtech platforms**: companies that provide software and tools to enable brands or agencies to
  target, deliver, and analyze their digital advertising.
- **Advertisers**: companies paying for advertising.
- **Publishers**: companies that display ads on their websites.
- **Click-through conversion**: conversion that is attributed to an ad click.
- **View-through conversion**: conversion that is attributed to an ad impression (if the user
  doesn't interact with the ad, then later converts).

## Who needs to know about this API: adtech platforms, advertisers, and publishers

- **Adtech platforms** such as **[demand-side
  platforms](https://en.wikipedia.org/wiki/Demand-side_platform)** are likely to be interested in
  using this API to support functionality that currently relies on third-party cookies. If you're
  working on conversion measurement systems: [try out the demo](#demo), [experiment with the
  API](#experiment-with-the-api), and [share your feedback](#share-your-feedback).
- **Advertisers and publishers relying on custom code for advertising or conversion measurement**
  may similarly be interested in using this API to replace existing techniques.
- **Advertisers and publishers relying on adtech platforms for advertising or conversion
  measurement** don't need to use the API directly, but the [rationale for this
  API](#why-is-this-needed) may be of interest, particularly if you are working with adtech
  platforms that may integrate the API.

## API overview

### Why is this needed?

Today, ad conversion measurement often relies on [third-party
cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Third-party_cookies). **But
browsers are restricting access to these.**

Chrome plans on [phasing out support for third-party
cookies](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html) and [offers
ways for users to block them if they
choose](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en). Safari
[blocks third-party
cookies](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), Firefox [blocks
known third-party tracking
cookies](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default),
and Edge [offers tracking
prevention](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention).

Third-party cookies are becoming a legacy solution. **New purpose-built APIs are emerging** to
address in a privacy-preserving way the use cases that third-party cookies solved. To name a few:

- The Event Conversion Measurement API helps measure click-through conversions for now, and maybe
  view-through conversions in future iterations.
- The [Aggregate Conversion Measurement
  API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) provides rich
  reports to advertisers by [aggregating conversions from multiple
  clients](https://github.com/WICG/conversion-measurement-api/blob/master/SERVICE.md).
- [Trust Tokens](/trust-tokens/) help combat fraud and distinguish bots from humans.

<figure class="w-figure">
  {% Img src="image/admin/vs7VtXlG4d6wHjZ1Tmwi.jpg", alt="Overview of some privacy sandbox APIs: trust tokens and conversion measurement (aggregate and event)", width="800", height="254" %}
</figure>

**How does the Event Conversion Measurement API compare to third-party cookies?**

- It's **purpose-built** to measure conversions, unlike cookies. This in turn can enable browsers to
  apply more enhanced privacy protections.
- It's **more private**: it makes it difficult to recognize a user across two different top-level
  sites, for example to link publisher-side and advertiser-side user profiles. See how in [How
  this API preserves user privacy](#how-this-api-preserves-user-privacy).

### A first iteration

This API is at an **early experimental stage**. What's available as an origin trial is the **first
iteration** of the API. Things may change substantially in [future iterations](#use-cases).

### Only clicks

This API only supports **click-through conversion measurement**. View-through conversion measurement
isn't supported yet, because view-through conversions are harder to measure in a truly
privacy-preserving way. This is an active area of work; you can read more about privacy
considerations in the [API
proposal](https://github.com/WICG/conversion-measurement-api#privacy-considerations).

### How it works

<figure class="w-figure">
  {% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="Diagram: overview of the conversion measurement API steps", width="800", height="496" %}
</figure>

This API can be used with two types of links (`<a>` elements) used for advertising:

- Links in a **first-party** context, such as ads on a social network or a search
  engine results page;
- Links in a **third-party iframe**, such as on a publisher site that uses a
  third-party adtech provider.

With this API, such outbound links can be configured with attributes that are
specific to ad conversions:

- Custom data to attach to an ad click on the publisher's side, for example a click ID or campaign
  ID.
- The website for which a conversion is expected for this ad.
- The reporting endpoint that should be notified of successful conversions.
- The cut-off date and time for when conversions can no longer be counted for this ad.

When the user clicks an ad, the browser—on the user's local device—records this event, alongside
conversion configuration and click data specified by Conversion Measurement attributes on the `<a>`
element.

Later on, the user may visit the advertiser's website and perform an action that the advertiser or
their adtech provider categorizes as a **conversion**. If this happens, the ad click and the
conversion event are matched by the user's browser.

The browser finally schedules a **conversion report** to be sent to the endpoint specified in the
`<a>` element's attributes. This report includes data about the ad click that led to this
conversion, as a well as data about the conversion.

If several conversions are registered for a given ad click, as many corresponding reports are
scheduled to be sent (up to a maximum of three per ad click).

Reports are sent after a delay: days or sometimes weeks after conversion (see why in [Reports
timing](#report-timing)).

## Browser support and similar APIs

### Browser support

The Event Conversion Measurement API can be supported:

- As an [origin trial](/origin-trials/). Origin trials enable the API for **all visitors** of a given
  [origin](/same-site-same-origin/#origin). **You need to register your origin for the origin trial
  in order to try the API with end users**. See [Using the conversion measurement API](/using-conversion-measurement) for details about the origin trial.
- By turning on flags, in Chrome 86 and later. Flags enable the API on a **single user**'s browser.
  **Flags are useful when developing locally**.

See details on the current status on the [Chrome feature
entry](https://chromestatus.com/features/6412002824028160).

### Standardization

This API is being designed in the open, in the Web Platform Incubator Community Group
([WICG](https://www.w3.org/community/wicg/)). It's available for experimentation in Chrome.

### Similar APIs

WebKit, the web browser engine used by Safari, has a proposal with similar goals, the [Private Click
Measurement](https://github.com/privacycg/private-click-measurement).
It's being worked on within the Privacy Community Group
([PrivacyCG](https://www.w3.org/community/privacycg/)).

## How this API preserves user privacy

With this API, conversions can be measured while protecting users' privacy: users can't be
recognized across sites. This is made possible by **data limits**, **noising of conversion data**,
and **report timing** mechanisms.

Let's take a closer look at how these mechanisms work, and what they mean in practice.

### Data limits

In the following, **click-time or view-time data** is data available to `adtech.example` when the ad
is served to the user and then clicked or viewed. Data from when a conversion happened is
**conversion-time data**.

Let's look at a **publisher** `news.example` and an **advertiser** `shoes.example`. Third-party
scripts from the **adtech platform** `adtech.example` are present on the publisher site
`news.example` to include ads for the advertiser `shoes.example`. `shoes.example` includes
`adtech.example` scripts as well, to detect conversions.

How much can `adtech.example` learn about web users?

#### With third-party cookies

<figure class="w-figure">
  {% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="Diagram: how third-party cookies enable cross-site user recognition", width="800", height="860" %}
</figure>

`adtech.example` relies on a **a third-party cookie used as a unique cross-site identifier** to
**recognize a user across sites**. In addition, `adtech.example` can access **both** detailed click-
or view-time data and detailed conversion-time data—and link them.

As a result, `adtech.example` can track the behavior of a single user across sites, between an ad
view, click, and conversion.

Because `adtech.example` is likely present on a large number of publisher and advertiser sites—not
just `news.example` and `shoes.example`—a user's behavior can be tracked across the web.

#### With the Event Conversion Measurement API

<figure class="w-figure">
  {% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="Diagram: how the API enables conversion measurement without cross-site user recognition", width="800", height="643" %}
  <figcaption class="w-figcaption">"Ad ID" on the cookies diagram and "Click ID" are both identifiers that enable mapping to detailed data. On this diagram, it's called "Click ID" because only click-through conversion measurement is supported.</figcaption>
</figure>

`adtech.example` can't use a cross-site identifier and hence **can't recognize a user across
sites**.

- A 64 bit-identifier can be attached to an ad click.
- Only 3 bits of conversion data can be attached to the conversion event. 3 bits can fit an integer
  value from 0 to 7. This is not much data, but enough that advertisers can learn how to make good
  decisions about where to spend their advertising budget in the future (for example by training
  data models).

{% Aside %} The click data and conversion data are never exposed to a JavaScript environment in the
same context. {% endAside %}

#### Without an alternative to third-party cookies

Without an alternative to third-party cookies such as the Event Conversion Measurement API,
conversions can't be attributed: if `adtech.example` is present on both the publisher's and
advertiser's site, it may access click-time or conversion-time data but it can't link them at all.

In this case, user privacy is preserved but advertisers can't optimize their ad spend. This is why
an alternative like the Event Conversion Measurement API is needed.

### Noising of conversion data

The 3 bits gathered at conversion time are **noised**.

For example, in Chrome's implementation, data noising works as follows: 5% of the time, the API
reports a random 3-bit value instead of the actual conversion data.

This protects users from privacy attacks. An actor trying to misuse the data from several
conversions to create an identifier won't have full confidence in the data they receive—making these
types of attacks more complicated.

Note that it's possible to [recover the true conversion
count](</using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count>).

Summing up click data and conversion data:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Data</th>
        <th>Size</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Click data (<code>impressiondata</code> attribute)</td>
        <td>64 bits</td>
        <td>An ad ID or click ID</td>
      </tr>
      <tr>
        <td>Conversion data</td>
        <td>3 bits, noised</td>
        <td>An integer from 0 to 7 that can map to a conversion type: signup, complete checkout, etc.</td>
      </tr>
    </tbody>
  </table>
</div>

### Report timing

If several conversions are registered for a given ad click, **a corresponding report is sent for
each conversion, up to a maximum of three per click**.

To prevent conversion time from being used to get more information from the conversion side and
hence hinder users' privacy, this API specifies that conversion reports aren't sent immediately
after a conversion happens. After the initial ad click, a schedule of **reporting windows**
associated with this click begins. Each reporting window has a deadline, and conversions registered
before that deadline will be sent at the end of that window.

Reports may not be exactly sent at these scheduled dates and times: if the browser isn't running
when a report is scheduled to be sent, the report is sent at browser startup—which could be days
or weeks after the scheduled time.

After expiry (click time + `impressionexpiry`), no conversion is counted—`impressionexpiry` is the
cut-off date and time for when conversions can no longer be counted for this ad.

In Chrome, report scheduling works as follows:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>Depending on conversion time, a conversion report is sent (if the browser is open)...</th>
        <th>Number of reporting windows</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 days, the default and maximum value</td>
        <td>
          <ul>
            <li>2 days after the ad was clicked</li>
            <li>or 7 days after ad click</li>
            <li>or <code>impressionexpiry</code> = 30 days after ad click.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td><code>impressionexpiry</code> is between 7 and 30 days</td>
        <td>
          <ul>
            <li>2 days after ad click</li>
            <li>or 7 days after ad click</li>
            <li>or <code>impressionexpiry</code> after ad click.</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td><code>impressionexpiry</code> is between 2 and 7 days</td>
        <td>
          <ul>
            <li>2 days after ad click</li>
            <li>or <code>impressionexpiry</code> after ad click.</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td><code>impressionexpiry</code> is under 2 days</td>
        <td>
          <li>2 days after ad click</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">
  {% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="Chronology of what reports are sent when", width="800", height="462" %}
</figure>

See [Sending Scheduled
Reports](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports) for more
details on timing.

## Example

{% Banner 'info', 'body' %} To see this in action, try out the
[demo](https://goo.gle/demo-event-level-conversion-measurement-api) ⚡️ and see the corresponding
[code](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement). {%
endBanner %}

Here's how the API records and reports a conversion. Note that this is how a click-to-convert flow
would work with the current API. Future iterations of this API [may be different](#use-cases).

### Ad click (steps 1 to 5)

<figure class="w-figure">
  {% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="Diagram: ad click and click storage", width="800", height="694" %}
</figure>

An `<a>` ad element is loaded on a publisher site by `adtech.example` within an iframe.

The adtech platform developers have configured the `<a>` element with conversion measurement
attributes:

```html
<a
  id="ad"
  impressiondata="200400600"
  conversiondestination="https://advertiser.example"
  reportingorigin="https://adtech.example"
  impressionexpiry="864000000"
  href="https://advertiser.example/shoes07"
  target="_blank"
>
  <img src="/images/shoe.jpg" alt="shoe" />
</a>
```

This code specifies the following:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Default value, maximum, minimum</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>impressiondata</code> (required): a <b>64-bit</b> identifier to attach to an ad click.</td>
        <td>(no default)</td>
        <td>A dynamically generated click ID  such as a 64-bit integer:
          <code>200400600</code>
        </td>
      </tr>
      <tr>
        <td><code>conversiondestination</code> (required): the <b><a href="/same-site-same-origin/#site" noopener>eTLD+1</a></b> where a conversion is expected for this ad.</td>
        <td>(no default)</td>
        <td><code>https://advertiser.example</code>.<br/>If the <code>conversiondestination</code> is <code>https://advertiser.example</code>, conversions on both <code>https://advertiser.example</code> and <code>https://shop.advertiser.example</code> will be attributed.<br/>The same happens if the <code>conversiondestination</code> is <code>https://shop.advertiser.example</code>: conversions on both <code>https://advertiser.example</code> and <code>https://shop.advertiser.example</code> will be attributed.
        </td>
      </tr>
      <tr>
        <td><code>impressionexpiry</code> (optional): in milliseconds, the cutoff time for when conversions can be attributed to this ad.</td>
        <td>
          <code>2592000000</code> = 30 days (in milliseconds).<br/><br/>
          Maximum: 30 days (in milliseconds).<br/><br/>
          Minimum: 2 days (in milliseconds).
        </td>
        <td>Ten days after click: <code>864000000</code></td>
      </tr>
      <tr>
        <td><code>reportingorigin</code> (optional): the destination for reporting confirmed conversions.</td>
        <td>Top-level origin of the page where the link element is added.</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td><code>href</code>: the intended destination of the ad click.</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
Some notes about the example:

- You will find the term "impression" used in the attributes of the API or in the API proposal, even
  though only clicks are supported for now. Names may be updated in future iterations of the API.
- The ad doesn't have to be in an iframe, but this is what this example is based on.

{% endAside %}

{% Aside 'gotchas' %}

- Flows based on navigating via `window.open` or `window.location` won't be eligible for
  attribution.

{% endAside %}

When the user taps or clicks the ad, they navigate to the advertiser's site. Once the navigation is
committed, the browser stores an object that includes `impressiondata`, `conversiondestination`,
`reportingorigin`, and `impressionexpiry`:

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### Conversion and report scheduling (steps 6 to 9)

<figure class="w-figure">
  {% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="Diagram: conversion and report scheduling", width="800", height="639" %}
</figure>

Either directly after clicking the ad, or later on—for example, on the next day—the user visits
`advertiser.example`, browses sports shoes, finds a pair they want to purchase, and proceeds to
checkout. `advertiser.example` has included a pixel on the checkout page:

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example` receives this request, and decides that it qualifies as a conversion. They now need
to request the browser to record a conversion. `adtech.example` compresses all of the conversion
data into 3 bits—an integer between 0 and 7, for example they might map a **Checkout** action to a
conversion value of 2.

`adtech.example` then sends a specific register-conversion redirect to the browser:

```js
const conversionValues = {
  signup: 1,
  checkout: 2,
};

app.get('/conversion', (req, res) => {
  const conversionData = conversionValues[req.query.conversiontype];
  res.redirect(
    302,
    `/.well-known/register-conversion?conversion-data=${conversionData}`,
  );
});
```

{% Aside %} `.well-known` URLs are special URLs. They make it easy for software tools and servers to
discover commonly-needed information or resources for a site—for example, on what page a user can
[change their password](/change-password-url/). Here, `.well-known` is only used so that the browser
recognizes this as a special conversion request. This request is actually cancelled internally by
the browser. {% endAside %}

The browser receives this request. Upon detecting `.well-known/register-conversion`, the browser:

- Looks up all ad clicks in storage that match this `conversiondestination` (because it's receiving
  this conversion on a URL that has been registered as a `conversiondestination` URL when the user
  clicked the ad). It finds the ad click that happened on the publisher's site one day before.
- Registers a conversion for this ad click.

Several ad clicks can match a conversion—the user may have clicked an ad for `shoes.example` on both
`news.example` and `weather.example`. In this case, several conversions are registered.

Now, the browser knows that it needs to inform the adtech server of this conversion—more
specifically, the browser must inform the `reportingorigin` that is specified in both the `<a>`
element and in the pixel request (`adtech.example`).

To do so, the browser schedules to send a **conversion report**, a blob of data containing the click
data (from the publisher's site) and the conversion data (from the advertiser's). For this example,
the user converted one day after click. So the report is scheduled to be sent on the next day, at
the two-day-after-click mark if the browser is running.

### Sending the report (steps 10 and 11)

<figure class="w-figure">
  {% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="Diagram: browser sending the report", width="800", height="533" %}
</figure>

Once the scheduled time to send the report is reached, the browser sends the **conversion report**:
it sends an HTTP POST to the reporting origin that was specified in the `<a>` element
(`adtech.example`). For example:

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

Included as parameters are:

- The data associated with the original ad click (`impression-data`).
- The data associated with a conversion, [potentially noised](#noising-of-conversion-data).
- The conversion credit attributed to the click. This API follows a **last-click attribution**
  model: the most recent matching ad click is given a credit of 100, all other matching ad clicks
  are given a credit of 0.

As the adtech server receives this request, it can pull the `impression-data` and `conversion-data`
from it, i.e. the conversion report:

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### Subsequent conversions and expiry

Later on, the user may convert again—for example by purchasing a tennis racket on
`advertiser.example` to go alongside their shoes. A similar flow takes place:

- The adtech server sends a conversion request to the browser.
- The browser matches this conversion with the ad click, schedules a report, and sends it to the
  adtech server later on.

After `impressionexpiry`, conversions for this ad click stop being counted and the ad click is
deleted from browser storage.

## Use cases

### What is currently supported

- Measure click-through conversions: determine which ad clicks lead to conversions, and access
  coarse information about the conversion.
- Gather data to optimize ad selection, for example by training machine learning models.

### What is not supported yet

The following features aren't supported yet, but may be in future iterations of this API, or in the
[Aggregate Conversion Measurement
API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md):

- View-through conversion measurement.
- [Multiple reporting endpoints](https://github.com/WICG/conversion-measurement-api/issues/29).
- [Web conversions that started in an iOS/Android
  app](https://github.com/WICG/conversion-measurement-api/issues/54).
- Conversion lift measurement / incrementality: measurement of causal differences in conversion
  behavior, by measuring the difference between a test group that saw an ad and a control group that
  didn't.
- Attribution models that are not last-click.
- Use cases that require larger amounts of information about the conversion event. For example,
  granular purchase values or product categories.

Before these features and more can be supported, **more privacy protections** (noise, fewer bits, or
other limitations) must be added to the API.

Discussion of additional possible features takes place in the open, in the [**Issues** of the API
proposal repository](https://github.com/WICG/conversion-measurement-api/issues).

{% Aside %} Is your use case missing? Do you have feedback on the API? [Share
it](#share-your-feedback). {% endAside %}

### What else may change in future iterations

- This API is at an early, experimental stage. In future iterations, this API may undergo
  substantial changes including but not limited to the ones listed below. Its goal is to measure
  conversions while preserving user privacy, and any change that would help better address this use
  case will be made.
- API and attribute naming may evolve.
- Click data and conversion data may not require encoding.
- The 3-bit limit for conversion data may be increased or decreased.
- [More features may be added](#what-is-not-supported-yet), and **more privacy protections** (noise / fewer bits /
  other limitations) if needed to support these new features.

To follow and participate in discussions on new features, watch the proposal's [GitHub
repository](https://github.com/WICG/conversion-measurement-api/issues) and submit ideas.

## Try it out

### Demo

Try out the [demo](https://goo.gle/demo-event-level-conversion-measurement-api). Make sure to follow
the "Before you start" instructions.

Tweet [@maudnals](https://twitter.com/maudnals?lang=en) or
[@ChromiumDev](https://twitter.com/ChromiumDev) for any question about the demo!

### Experiment with the API

If you're planning to experiment with the API (locally or with end users), see [Using the conversion
measurement API](/using-conversion-measurement).

### Share your feedback

**Your feedback is crucial**, so that new conversion measurement APIs can support your use cases and
provide a good developer experience.

- To report a bug on the Chrome implementation, [open a
  bug](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals>ConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A).
- To share feedback and discuss use cases on the Chrome API, create a new issue or engage in
  existing ones on the [API proposal
  repository](https://github.com/WICG/conversion-measurement-api/issues). Similarly, you can discuss
  the WebKit/Safari API and its use cases on the [API proposal
  repository](https://github.com/privacycg/private-click-measurement/issues).
- To discuss advertising use cases and exchange views with industry experts: join the [Improving Web
  Advertising Business Group](https://www.w3.org/community/web-adv/). Join the [Privacy Community
  Group](https://www.w3.org/community/privacycg/) for discussions around the WebKit/Safari API.

### Keep an eye out

- As developer feedback and use cases are gathered, the Event Conversion Measurement API will evolve
  over time. Watch the proposal's [GitHub
  repository](https://github.com/WICG/conversion-measurement-api/).
- Follow along the evolution of the [Aggregate Conversion Measurement
  API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) that will
  complement this API.

_With many thanks for contributions and feedback to all reviewers—especially Charlie Harrison,
John Delaney, Michael Kleber and Kayce Basques._

_Hero image by William Warby / @wawarby on [Unsplash](https://unsplash.com/photos/WahfNoqbYnM), edited._
