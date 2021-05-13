---
title: What is Federated Learning of Cohorts (FLoC)?
subhead: FLoC enables ad selection without sharing the browsing behaviour of individual users.
authors:
  - samdutton
date: 2021-03-30
updated: 2021-04-21
hero: image/80mq7dk16vVEg8BBhsVe42n6zn82/GA543wiVTwpbwp6Zmw0H.jpg
thumbnail: image/80mq7dk16vVEg8BBhsVe42n6zn82/OuORgPSvN06ntXT5xOii.jpg
alt: Murmuration of starlings over Brighton pier
tags:
  - blog
  - privacy
  - privacy-sandbox
  - security
feedback:
  - api
---

## Summary

FLoC provides a privacy-preserving mechanism for interest-based ad selection.

As a user moves around the web, their browser uses the FLoC algorithm to work out its "interest
cohort", which will be the same for thousands of browsers with a similar recent browsing history.
The browser recalculates its cohort periodically, on the user's device, without sharing
individual browsing data with the browser vendor or anyone else.

{% Aside %}
FLoC is now in [origin trial in Chrome](/origin-trials/). Find out more: 
[How to take part in the FLoC origin trial](https://developer.chrome.com/blog/floc/). 

During the current FLoC origin trial, a page visit will only be included in the browser's FLoC 
computation for one of two reasons: 
* The FLoC API (`document.interestCohort()`) is used on the page. 
* Chrome detects that the page [loads ads or ads-related resources](https://github.com/WICG/floc/issues/82). 

For other clustering algorithms, the trial may experiment with different inclusion criteria: that's 
part of the origin trial experiment process.
{% endAside %}

Advertisers (sites that pay for advertisements) can include code on their own websites in order to
gather and provide cohort data to their adtech platforms (companies that provide software and tools
to deliver advertising). For example, an adtech platform might learn from an online shoe store that
browsers from cohorts 1101 and 1354 seem interested in the store's hiking gear. From other
advertisers, the adtech platform learns about other interests of those cohorts.

Subsequently, the ad platform can use this data to select relevant ads (such as an ad for hiking
boots from the shoe store) when a browser from one of those cohorts requests a page from a site that
displays ads, such as a news website.

The Privacy Sandbox is a series of proposals to satisfy third-party use cases without third-party
cookies or other tracking mechanisms. See [Digging into the Privacy Sandbox](/digging-into-the-privacy-sandbox)
for an overview of all the proposals.

**This proposal needs your feedback.** If you have comments, please [create an
issue](https://github.com/WICG/floc/issues/new) on the [FLoC Explainer](https://github.com/WICG/floc)
repository.  If you have feedback on Chrome's experiment with this proposal, please post a reply on
the [Intent to Experiment](https://groups.google.com/a/chromium.org/g/blink-dev/c/MmijXrmwrJs).

## Why do we need FLoC?

Many businesses rely on advertising to drive traffic to their sites, and many publisher websites
fund content by selling advertising inventory. People generally prefer to see ads that are
relevant and useful to them, and relevant ads also bring more business to advertisers and
[more revenue to the websites that host them](https://services.google.com/fh/files/misc/disabling_third-party_cookies_publisher_revenue.pdf). In other words, ad space is more valuable when
it displays relevant ads. Thus, selecting relevant ads increases revenue for ad-supported websites.
That, in turn, means that relevant ads help fund content creation that benefits users.

However, many people are concerned about the privacy implications of tailored advertising, which
currently relies on techniques such as tracking cookies and device fingerprinting which are used to
track individual browsing behavior. The FLoC proposal aims to allow more effective ad selection
without compromising privacy.

## What can FLoC be used for?

* Show ads to people whose browsers belong to a cohort that has been observed to frequently visit an
advertiser's site or shows interest in relevant topics.
* Use machine learning models to predict the probability a user will convert based on their cohort,
in order to inform ad auction bidding behavior.
* Recommend content to users. For example, suppose a news site observes that their sports podcast
page has become especially popular with visitors from cohorts 1234 and 7. They can recommend that
content to other visitors from those cohorts.

## How does FLoC work?

The example below describes the different roles in selecting an ad using FLoC.

* The **advertiser** (a company that pays for advertising) in this example is an online shoe
retailer: <br>
**<u>shoestore.example</u>**

* The **publisher** (a site that sells ad space) in the example is a news site: <br>
**<u>dailynews.example</u>**

* The **adtech platform** (which provides software and tools to deliver advertising) is: <br>
**<u>adnetwork.example</u>**

{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/wnJ1fSECf5STngywgE7V.png",
  alt="Diagram showing, step by step, the different roles in selecting and delivering an ad using
  FLoC: FLoC service, Browser, Advertisers, Publisher (to observe cohorts), Adtech,
  Publisher (to display ads)", width="800", height="359" %}

In this example we've called the users **Yoshi** and **Alex**. Initially their browsers both belong
to the same cohort, 1354.

{% Aside %}
We've called the users here Yoshi and Alex, but this is only for the purpose of the example. Names
and individual identities are not revealed to the advertiser, publisher, or adtech platform with
FLoC.

Don't think of a cohort as a collection of people. Instead, think of a cohort as a grouping of
browsing activity.
{% endAside %}

### 1. FLoC service
1. The FLoC service used by the browser creates a mathematical model with thousands of "cohorts",
each of which will correspond to thousands of web browsers with similar recent browsing histories.
More about how this works [below](#floc-server).
1. Each cohort is given a number.

### 2. Browser
1. From the FLoC service, Yoshi's browser gets data describing the FLoC model.
1. Yoshi's browser works out its cohort [by using the FLoC model's algorithm](#floc-algorithm)
to calculate which cohort corresponds most closely to its own browsing history. In this example,
that will be the cohort 1354. Note that Yoshi's browser does not share any data with the FLoC
service.
1. In the same way, Alex's browser calculates its cohort ID. Alex's browsing history is
different from Yoshi's, but similar enough that their browsers both belong to cohort 1354.

### 3. Advertiser: <span style="font-weight:normal">shoestore.example</span>
1. Yoshi visits <u>shoestore.example</u>.
1. The site asks Yoshi's browser for its cohort: 1354.
1. Yoshi looks at hiking boots.
1. The site records that a browser from cohort 1354 showed interest in hiking boots.
1. The site later records additional interest in its products from cohort 1354, as well as from other
cohorts.
1. The site periodically aggregates and shares information about cohorts and product interests with
its adtech platform <u>adnetwork.example</u>.

Now it's Alex's turn.

### 4. Publisher: <span style="font-weight:normal">dailynews.example</span>
1. Alex visits <u>dailynews.example</u>.
1. The site asks Alex's browser for its cohort.
1. The site then makes a request for an ad to its adtech platform, <u>adnetwork.example</u>, including
Alex's browser's cohort: 1354.

### 5. Adtech platform: <span style="font-weight:normal">adnetwork.example</span>
1. <u>adnetwork.example</u> can select an ad suitable for Alex by combining the data it has from
the publisher <u>dailynews.example</u> and the advertiser <u>shoestore.example</u>:
	- Alex's browser's cohort (1354) provided by <u>dailynews.example</u>.
	- Data about cohorts and product interests from <u>shoestore.example</u>: "Browsers from cohort 1354
	might be interested in hiking boots."
1. <u>adnetwork.example</u> selects an ad appropriate to Alex: an ad for hiking boots on
<u>shoestore.example</u>.
1. <u>dailynews.example</u> displays the ad 🥾.

{% Aside %}
Current approaches for ad selection rely on techniques such as tracking cookies and device
fingerprinting, which are used by third parties such as advertisers to track individual browsing
behavior.

With FLoC, the browser **does not share** its browsing history with the FLoC service or anyone else.
The browser, on the user's device, works out which cohort it belongs to. The user's browsing history
never leaves the device.
{% endAside %}

## Who runs the back-end service that creates the FLoC model?

Every browser vendor will need to make their own choice of how to group browsers into cohorts.
Chrome is running its own FLoC service; other browsers might choose to implement FLoC with a
different clustering approach, and would run their own service to do so.

## How does the FLoC service enable the browser to work out its cohort? {: #floc-server }

1. The FLoC service used by the browser creates a multi-dimensional mathematical representation
of all potential web browsing histories. We'll call this model "cohort space".
1. The service divides up this space into thousands of segments. Each segment represents a
cluster of thousands of similar browsing histories. These groupings aren't based on knowing
any actual browsing histories; they're simply based on picking random centers in "cohort space" or
cutting up the space with random lines.
1. Each segment is given a cohort number.
1. The web browser gets this data describing "cohort space" from its FLoC service.
1. As a user moves around the web, their browser [uses an algorithm](#floc-algorithm) to
periodically calculate the region in "cohort space" that corresponds most closely to its own
browsing history.

<figure style="text-align: center">
{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/32k5jByqLrgwSMwb9mqo.png", alt="Diagram of the
'browsing history space' created by a FLoC server, showing multiple segments, each with a cohort
number.", width="400", height="359" %}
<figcaption class="w-figcaption">The FLoC service divides up "cohort space" into
thousands of segments (only a few are shown here).</figcaption>
</figure>

{% Aside %}
At no point in this process is the user's browsing history shared with the FLoC service, or
any third party. The browser's cohort is calculated by the browser, on the user's device. No
user data is acquired or stored by the FLoC service.
{% endAside %}

## Can a browser's cohort change?

_Yes_! A browser's cohort definitely can change! You probably don't visit the same websites every
week, and your browser's cohort will reflect that.

A cohort represents a cluster of browsing activity, not a collection of people. The activity
characteristics of a cohort are generally consistent over time, and cohorts are useful for ad selection
because they group similar recent browsing behavior. Individual people's browsers will float in and
out of a cohort as their browsing behavior changes. Initially, we expect the browser to recalculate
its cohort every seven days.

In the example above, both Yoshi and Alex's browser's cohort is 1354. In the future, Yoshi's
browser and Alex's browser may move to a different cohort if their interests change. In the
example below, Yoshi's browser moves to cohort 1101 and Alex's browser moves to cohort 1378. Other
people's browsers will move into and out of cohorts as their browsing interests change.

<figure style="text-align: center">
{% Img src="image/80mq7dk16vVEg8BBhsVe42n6zn82/LMkb62V3iJTqkOrFACnM.png", alt="Diagram of the
'browsing history space' created by a FLoC server, showing multiple segments, each with a cohort
number. The diagram shows browsers belonging to users Yoshi and Alex moving from one cohort to
another as their browsing interests change over time.", width="800", height="533" %}
<figcaption class="w-figcaption">Yoshi's and Alex's browser cohort may change if their interests
change.</figcaption>
</figure>

{% Aside %}
A cohort defines a grouping of browsing activity, not a group of people. Browsers will move in and out of a cohort as their activity changes.
{% endAside %}

## How does the browser work out its cohort? {: #floc-algorithm }

As described above, the user's browser gets data from its FLoC service that describes the
mathematical model for cohorts: a multi-dimensional space that represents the browsing activity of
all users. The browser then uses an algorithm to work out which region of this "cohort space" (that
is, which cohort) most closely matches its own recent browsing behavior.

## How does FLoC work out the right size of cohort?

There will be thousands of browsers in each cohort.

A smaller cohort size might be more useful for personalizing ads, but is less likely to stop user
tracking—and vice versa. A mechanism for assigning browsers to cohorts needs to make a trade off
between privacy and utility. The Privacy Sandbox uses [k-anonymity](https://en.wikipedia.org/wiki/K-anonymity)
to allow a user to "hide in a crowd". A cohort is k-anonymous if it is shared by at least k users. The higher the k
number, the more privacy-preserving the cohort.

## Can FLoC be used to group people based on sensitive categories?

The clustering algorithm used to construct the FLoC cohort model is designed to evaluate whether a
cohort may be correlated with sensitive categories, without learning why a category is sensitive.
Cohorts that might reveal sensitive categories such as race, sexuality, or medical history will be
blocked. In other words, when working out its cohort, a browser will only be choosing between
cohorts that won't reveal sensitive categories.

## Is FLoC just another way of categorizing people online?

With FLoC, a user's browser will belong to one of thousands of cohorts, along with thousands of
other users' browsers. Unlike with third-party cookies and other targeting mechanisms, FLoC only
reveals the cohort a user's browser is in, and not an individual user ID. It does not enable others
to distinguish an individual within a cohort. In addition, the information about browsing activity
that is used to work out a browser's cohort is kept local on the browser or device, and is not
uploaded elsewhere. The browser may further leverage other anonymization methods, such as
[differential privacy](https://en.wikipedia.org/wiki/Differential_privacy).

## Do websites have to participate and share information?

Websites will have the ability to opt in or out of FLoC, so sites about sensitive topics will be
able to prevent visits to their site from being included in the FLoC calculation. As additional
protection, analysis by the FLoC service will evaluate whether a cohort may reveal sensitive
information about users without learning why that cohort is sensitive. If a cohort might represent a
greater-than-typical number of people who visit sites in a sensitive category, that entire cohort is
removed. Negative financial status and mental health are among the sensitive categories covered by
this analysis.

Websites [can exclude a page from the FLoC calculation](https://github.com/WICG/floc#opting-out-of-computation)
by setting a [Permissions-Policy](https://www.w3.org/TR/permissions-policy-1/#introduction) header
`interest-cohort=()` for that page. For pages that haven't been excluded, a page visit will be included
in the browser's FLoC calculation if `document.interestCohort()` is used on the page. During the current
[FLoC origin trial](https://developer.chrome.com/origintrials/#/view_trial/213920982300098561), a
page will also be included in the calculation if Chrome detects that the page
[loads ads or ads-related resources](https://github.com/WICG/floc/issues/82).
([Ad Tagging in Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/ad_tagging.md)
explains how Chrome's ad detection mechanism works.)

Pages served from private IP addresses, such as intranet pages, won't be part of the FLoC
computation.

## As a web developer how can I try out FLoC?

The FLoC API is very simple: just a single method that returns a promise that resolves to an object
providing the cohort `id` and `version`:

```javascript
const { id, version } = await document.interestCohort();
console.log('FLoC ID:', id);
console.log('FLoC version:', version);
```

The cohort data made available looks like this:

```js
{
	id: "14159",
	version: "chrome.1.0"
}
```

The `version` value enables sites using FLoC to know which browser and which FLoC model the cohort
ID refers to. As described below, the promise returned by `document.interestCohort()` will reject
for any frame that is not allowed the `interest-cohort` permission.

The FLoC API is available in Chrome 89 and above, but if you are not taking part in the origin
trial, you will need to set flags and run Chrome from the command line.
[Run&nbsp;Chromium with flags](http://www.chromium.org/developers/how-tos/run-chromium-with-flags)
explains how to do this for different operating systems.

1. Start Chrome with the following flags: <br>

    ```text
    --enable-blink-features=InterestCohortAPI
    --enable-features="FederatedLearningOfCohorts:update_interval/10s/minimum_history_domain_size_required/1,FlocIdSortingLshBasedComputation,InterestCohortFeaturePolicy"
    ```
2. Make sure third-party cookies are not blocked and that no ad blocker is running.
3. View the demo at [floc.glitch.me](https://floc.glitch.me/).

{% Aside %}
[How to take part in the FLoC origin trial](https://developer.chrome.com/blog/floc) explains how
to try out FLoC in both first- and third-party contexts.
{% endAside%}

## How can websites opt out of the FLoC computation?

The `interest-cohort` permissions policy enables a site to declare that it does not want to be
included in the user's list of sites for cohort calculation. The policy will be `allow` by default.
The promise returned by `document.interestCohort()` will reject for any frame that is not allowed
`interest-cohort` permission. If the main frame does not have the `interest-cohort` permission, then the
page visit will not be included in the interest cohort calculation.

For example, a site can opt out of all FLoC cohort calculation by sending the following HTTP response header:

```text
  Permissions-Policy: interest-cohort=()
```

## How can I make suggestions or provide feedback?

If you have comments on the API, please [create an issue](https://github.com/WICG/floc/issues/new)
on the [FLoC Explainer](https://github.com/WICG/floc) repository.

## Find out more

* [FLoC demo](https://floc.glitch.me)
* [How to take part in the FLoC origin trial](https://developer.chrome.com/blog/floc)
* [Digging in to the Privacy Sandbox](/digging-into-the-privacy-sandbox/)
* [FLoC Explainer](https://github.com/WICG/floc)
* [Evaluation of cohort Algorithms for the FLoC API](https://github.com/google/ads-privacy/blob/master/proposals/FLoC/README.md)

---

Photo by [Rhys Kentish](https://unsplash.com/@rhyskentish) on [Unsplash](https://unsplash.com/photos/I5AYxsxSuVA).
