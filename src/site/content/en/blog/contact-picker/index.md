---
title: A contact picker for the web
subhead: The Contact Picker API provides an easy way for users to share contacts from their contact list.
authors:
  - petelepage
description: Access to the user's contacts has been a feature of native apps since (almost) the dawn of time. The Contact Picker API is an on-demand API  that allows users to select an entry or entries from their contact list and share limited details of the selected contact(s) with a website. It allows users to share only what they want, when they want, and makes it easier for users to reach and connect with their friends and family.
date: 2019-08-07
updated: 2019-10-10
tags:
  - post
  - capabilities
  - fugu
  - contacts
  - chrome77
  - origin-trial
hero: hero.jpg
alt: Telephone on yellow background.
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/85568392920039425
---

{% Aside %}
  The Contact Picker API begins an origin trial in Chrome 77
  (stable in September) as part of our capabilities project. We'll keep this
  post updated as the implementation progresses.
{% endAside %}

## What is the Contact Picker API? {: #what }

<style>
  #video-demo { max-height: 600px; }
</style>

<figure class="w-figure w-figure--inline-right">
  <a href="https://storage.googleapis.com/webfundamentals-assets/contact-picker/contact-picker.mp4">
    <video id="video-demo" loop autoplay muted
          poster="contact-picker-demo.jpg"
          class="w-screenshot">
      <source type="video/webm"
              src="https://storage.googleapis.com/webfundamentals-assets/contact-picker/contact-picker.webm">
      <source type="video/mp4"
              src="https://storage.googleapis.com/webfundamentals-assets/contact-picker/contact-picker.mp4">
    </video>
  </a>
</figure>

Access to the user's contacts has been a feature of native apps since
(almost) the dawn of time. It's one of the most common feature requests
I hear from web developers, and is often the key reason they build a native
app.

The [Contact Picker API][spec] is an on-demand API that allows users to
select entries from their contact list and share limited details of the
selected entries with a website. It allows users to share only what they
want, when they want, and makes it easier for users to reach and connect
with their friends and family.

For example, a web-based email client could use the Contact Picker API to
select the recipient(s) of an email. A voice-over-IP app could look up
which phone number to call. Or a social network could help a user discover
which friends have already joined.

{% Aside 'caution' %}
  The Chrome team has put a lot of thought into the design and implementation
  of the Contact Picker API to ensure that the browser will only share exactly
  what people choose. See the [Security and Privacy](#security-considerations)
  section below.
{% endAside %}

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [In Progress][spec]          |
| 3. Gather feedback & iterate on design     | [In progress][spec]          |
| **4. Origin trial**                        | **Started in Chrome 77** <br> Expected to run through Chrome 80. |
| 5. Launch                                  | Not started                  |

</div>

## Using the Contact Picker API {: #how-to-use }

The Contact Picker API requires a single API call with an options parameter
that specifies the types of contact information you want.

{% Aside %}
  Check out the [Contact Picker API demo](https://contact-picker.glitch.me)
  and view the
  [source](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0).
{% endAside %}

### Enabling via chrome://flags

To experiment with the Contact Picker API locally, without an origin
trial token, enable the `#enable-experimental-web-platform-features` flag
in `chrome://flags`.

### Enabling support during the origin trial phase {: #origin-trial }

Starting in Chrome 77, the Contact Picker API is available as an origin
trial on Chrome for Android.

{% include 'content/origin-trials.njk' %}

{% include 'content/origin-trial-register.njk' %}

### Feature detection

To check if the Contact Picker API is supported, use:

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

In addition, on Android, the Contact Picker requires Android M or later.

### Opening the Contact Picker

The entry point to the Contact Picker API is `navigator.contacts.select()`.
When called, it returns a promise and shows the contact picker, allowing the
user to select the contact(s) they want to share with the site. After
selecting what to share and clicking **Done**, the promise resolves with an
array of contacts selected by the user.

When calling `select()` you must provide an array of properties you'd like
returned as the first parameter, and optionally whether multiple contacts can be
selected as a second parameter.

```js
const props = ['name', 'email', 'tel'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

The Contacts Picker API can only be called from a [secure][secure-contexts],
top-level browsing context, and like other powerful APIs, it requires a
user gesture.

### Handling the results

The Contact Picker API returns an array of contacts, and each contact
includes an array of the requested properties. If a contact doesn't have
data for the requested property, or the user chooses to opt-out of sharing
a particular property, it returns an empty array.

For example, if a site requests `name`, `email`, and `tel`, and a user
selects a single contact that has data in the name field, provides two
phone numbers, but does not have an email address, the response returned will be:

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %}
  Labels and other semantic information on contact fields are dropped.
{% endAside %}

## Security and permissions {: #security-considerations }

The Chrome team designed and implemented the Contact Picker API using the core
principles defined in
[Controlling Access to Powerful Web Platform Features][powerful-apis],
including user control, transparency, and ergonomics. I'll explain each.

### User control {: #security-control }

Access to the users' contacts is via the picker, and it can only be called with
a user gesture, on a [secure][secure-contexts], top-level browsing context.
This ensures that a site can't show the picker on page load, or randomly show
the picker without any context.

<figure class="w-figure w-figure--inline-right">
  <img src="contact-picker-user-choice.jpg" class="w-screenshot"
       alt="Screen shot, users can choose which properties to share."
       width="550">
  <figcaption class="w-figcaption">
    Users can choose not to share some properties. In this screenshot, the
    user has unchecked the 'Phone numbers' button. Even though the site
    asked for phone numbers, they will not be shared with the site.
  </figcaption>
</figure>

There's no option to bulk-select all contacts so that users are encouraged
to select only the contacts that they need to share for that particular
website. Users can also control which properties are shared with the site
by toggling the property button at the top of the picker.

<div class="w-clearfix"></div>

### Transparency {: #security-transparency }

To clarify which contact details are being shared, the picker always
shows the contact's name and icon, plus any properties that the site has
requested. For example, if a site requests `name`, `email`, and `tel`,
all three properties will be shown in the picker. Alternatively,
if a site only requests `tel`, the picker will show only the name, and
telephone numbers.

<div class="w-columns">
  <figure class="w-figure">
    <img src="contact-picker-left.jpg" class="w-screenshot"
        alt="Screen shot of picker for site requesting all properties.">
    <figcaption class="w-figcaption">
      Picker, site requesting <code>name</code>, <code>email</code>, and
      <code>tel</code>, one contact selected.
    </figcaption>
  </figure>
  <figure class="w-figure">
    <img src="contact-picker-right.jpg" class="w-screenshot"
        alt="Screen shot of picker for site requesting only phone numbers.">
    <figcaption class="w-figcaption">
      Picker, site requesting only <code>tel</code>, one contact selected.
    </figcaption>
  </figure>
</div>

<div class="w-clearfix"></div>

<figure class="w-figure w-figure--inline-right">
  <img src="contact-picker-long-press.jpg" class="w-screenshot"
       alt="Screen shot of picker when a contact is long-pressed."
       width="550">
  <figcaption class="w-figcaption">
    The result of a long press on a contact.
  </figcaption>
</figure>

A long press on a contact will show all of the information that will be
shared if the contact is selected. (See the Cheshire Cat contact image.)

<div class="w-clearfix"></div>

### No permission persistence {: #security-persistence }

Access to contacts is on-demand, and not persisted. Each time a site wants
access, it must call `navigator.contacts.select()` with a user gesture,
and the user must individually choose the contact(s) they want to share
with the site.

## Feedback {: #feedback }

The Web Platform Incubator Group and the Chrome team want to hear about your
experiences with the Contact Picker API.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or
are there missing methods or properties that you need to implement your idea?

* File a spec issue on the [WICG Contact Picker API GitHub repo][issues],
  or add your thoughts to an existing issue.

### Problem with the implementation?

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much
  detail as you can, provide simple instructions for reproducing the bug, and
  set *Components* to `Blink>Contacts`. [Glitch](https://glitch.com) works great
  for sharing quick and easy repros.

### Planning to use the API?

Are you planning to use the Contact Picker API? Your public support helps the
Chrome team to prioritize features, and shows other browser vendors how
critical it is to support them.

* Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]
* Send a Tweet to [@ChromiumDev][cr-dev-twitter] with `#contactpicker` and
  let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [Contact Picker Specification][spec]
* [Contact Picker API Demo][demo] & [Contact Picker API demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Request an [origin trial token]({{origin_trial.url}})
* Blink Component: `Blink>Contacts`

### Thanks

Big shout out and thanks to Finnur Thorarinsson and Rayan Kanso who are
implementing the feature and Peter Beverloo whose
[code](https://tests.peter.sh/contact-api/) I shamelessly
<strike>stole and</strike> refactored for the demo.

PS: The 'names' in my contact picker, are characters from Alice in Wonderland.

[spec]: https://wicg.github.io/contact-api/spec/
[spec-select]: https://wicg.github.io/contact-api/spec/#contacts-manager-select
[spec-security]: https://wicg.github.io/contact-api/spec/#privacy
[issues]: https://github.com/WICG/contact-api/issues
[demo]: https://contact-picker.glitch.me
[demo-source]: https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=860467
[cr-status]: https://www.chromestatus.com/features/6511327140904960
[explainer]: https://github.com/WICG/contact-api/
[wicg-discourse]: https://discourse.wicg.io/t/proposal-contact-picker-api/3507
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts
[ot-what-is]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/README.md
[ot-dev-guide]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[ot-use]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[secure-contexts]: https://w3c.github.io/webappsec-secure-contexts/
[cr-dev-twitter]: https://twitter.com/chromiumdev
[ot-guide]: https://googlechrome.github.io/OriginTrials/developer-guide.html
