---
title: Using the Event Conversion Measurement API
subhead: Must-dos and tips to use the Event Conversion Measurement API.
authors:
  - maudn
hero: image/admin/fyXjSb1sdmnCw3SoXUs2.jpg
date: 2020-11-12
updated: 2020-02-10
tags:
  - blog
  - privacy
---

The [Event Conversion Measurement API](/conversion-measurement) measures when an ad click leads to a
conversion, without using cross-site identifiers. Here, you'll find must-dos and tips to use this
API locally or as an experiment for your end users.

## Demo

If you're considering using the API, see the
[demo](https://goo.gle/demo-event-level-conversion-measurement-api) and the corresponding
[code](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement) for a
simple end-to-end implementation example.

## Browser support

The Event Conversion Measurement API is supported:

- As an [origin trial](/origin-trials/), from Chrome 86 beta until Chrome 91 (April 2021). Origin
  trials enable the API for **all visitors** of a given [origin](/same-site-same-origin/#origin).
  **You need to register your origin for the origin trial in order to try the API with end users**.
- Or by turning on flags, in Chrome 86 and later. Flags enable the API on a **single user**'s browser.
  **Flags are useful when [developing locally](#develop-locally)**.

See details about the Chrome versions where the API is active on the [Chrome feature
entry](https://chromestatus.com/feature/6412002824028160).

## Experiment with end users

## Experiment with the API, with end users

To test the API with end users, you'll need to:

1. Design your experiment.
2. Set it up.
3. Run it.

### Design your experiment

Defining your goal will help you outline your plan for your experiment.

If your goal is to **understand the API mechanics**, run your experiment as follows:

- Track conversions.
- See how you can assign different values to conversion events.
- Look at the conversion reports you're receiving.

If your goal is to **see how well the API satisfies basic use cases**, run your experiment as
follows:

- Track conversions.
- Look at the aggregate count of conversions you're receiving.
- Recover the corrected count of conversions. See how in [Recover the corrected conversion
  count](<#(optional)-recover-the-corrected-conversion-count>).
- Optionally, if you want to try something more advanced: tweak the noise correction script. For
  example, try different groupings to see what sizes are necessary for the noise to be negligible.
- Compare the corrected count of conversions with source-of-truth data (cookie-based conversion
  data).

### Set up your experiment

#### Register for the origin trial

Registering for an [origin trial](/origin-trials/) is the first step to activate the API for end
users. Upon registering for an origin trial, you have two choices to make: what **type of tokens** you
need, and how the **API usage should be controlled**.

**Token type:**

- If you're planning to use the API directly on your own
  [origin(s)](/same-site-same-origin/#origin), register your origin(s) for a regular origin trial.
- If you're planning on using the API as a third-party—for example if you need to use the API in a
  script you wrote that is executed on origins you don't own—you may be eligible to register your
  origin for a [third-party origin trial](/third-party-origin-trials). This is convenient if you
  need to test at scale across different sites.

**API usage control:**

Origin trial features shouldn't exceed a small percentage of global page loads, because they're
ephemeral. Because of this, sites that have registered for origin trials typically need to
selectively enable API usage for small portions of their users. You can do this yourself, or let
Chrome do this for you. In the dropdown **How is (third-party) usage controlled?**:

- Select **Standard limit** to activate the API for all end users on origins where a token is
  present. Pick this if you don't need to A/B Test (with/without the experiment) or if you want
  to selectively enable API usage for small portions of your users yourself.
- Select **Exclude a subset of users** to let Chrome selectively activate the API on a small subset
  of users on origins where a token is
  present. This consistently diverts a user into an experiment group across sites to avoid the
  usage limit. Pick this if you don't want to worry about implementing throttling for your API
  usage.

{% Aside 'gotchas' %}
If you pick **Exclude a subset of users**, the API won't be enabled for all users, even for origins
that are registered for origin trials. This is the intended behaviour.
{% endAside %}

#### Add your origin trial tokens

Once your origin trial tokens are created, [add them](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin) where relevant.

#### Adapt your code

If you've picked **Exclude a subset of users**, use client-side feature detection alongside the
origin trial to check whether the API can be used.

### Run your experiment

You're now ready to run your experiment.

#### (Optional) Recover the corrected conversion count

Even though the conversion data is [noised](/conversion-measurement/#noising-of-conversion-data),
the reporting endpoint can recover the true count of reports that have a specific conversion value.
See how in this [noise corrector example
script](https://github.com/WICG/conversion-measurement-api/blob/master/noise_corrector.py).

User privacy isn't impacted by this technique, because you can't determine whether a specific
event's conversion data was noised. But this gives you the correct conversion count at an
**aggregated** level.

## Develop locally

A few tips when developing locally with the conversion measurement API.

### Set up your browser for local development

- Use Chrome version 86 or later. You can check what version of Chrome you're using by typing
  `chrome://version` in the URL bar.
- To activate the feature locally (for example if you're developing on `localhost`), enable
  flags. Go to flags by typing `chrome://flags` in Chrome's URL bar. Turn on the **two** flags
  `#enable-experimental-web-platform-features` and `#conversion-measurement-api`.
- Disable third-party cookie blocking. In the long term, dedicated browser settings will be
  available to allow/block the API. Until then, third-party cookie blocking is used as the signal
  that users don't want to share data about their conversions—and hence that this API should be
  disabled.
- Don't use **Incognito** or **Guest** mode. The API is disabled on these profiles.
- Some ad-blocking browser extensions may block some of the API's functionality (e.g. script names
  containing `ad`). Deactivate ad-blocking extensions on the pages where you need to test the API,
  or create a fresh user profile without extensions.

### Debug

You can see the conversion reports the browser has scheduled to send at
`chrome://conversion-internals/` > **Pending Reports**. Reports are sent at scheduled times, but for
debugging purposes you may want to get the reports immediately.

- To receive all of the scheduled reports now, click **Send All Reports** in
  `chrome://conversion-internals/` > **Pending Reports**.
- To always receive reports **immediately** without having to click this button, enable the flag
  `chrome://flags/#conversion-measurement-debug-mode`.

### Test your origin trial token(s)

If you've chosen **Exclude a subset of users** in the dropdown **How is usage controlled?** when
you've registered your token(s), the API is only enabled for a subset of Chrome users. You may not
be part of this group. To test your origin trial tokens, enforce that your browser behave as if it
was in the selected Chrome group by enabling the flag `#conversion-measurement-api`.

## Share your feedback

If you're experimenting with the API, your feedback is key in order to improve the API and support
more use cases—please [share it](/conversion-measurement/#share-your-feedback)!

## Further reading

- [Origin trials developer guide](/third-party-origin-trials/)
- [Getting started with Chrome's origin trials](/origin-trials/)
- [What are third-party origin
  trials?](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)

_With many thanks to Jxck and John Delaney for their feedback on this article._

_Hero image by William Warby / @wawarby on [Unsplash](https://unsplash.com/photos/WahfNoqbYnM),
edited._
