---
title: A contact picker for the web
subhead: The Contact Picker API provides an easy way for users to share contacts from their contact list.
authors:
  - petelepage
description: Access to the user's contacts has been a feature of iOS/Android apps since (almost) the dawn of time. The Contact Picker API is an on-demand API  that allows users to select an entry or entries from their contact list and share limited details of the selected contact(s) with a website. It allows users to share only what they want, when they want, and makes it easier for users to reach and connect with their friends and family.
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - contacts
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: Telephone on yellow background.
feedback:
  - api
---

## What is the Contact Picker API? {: #what }

<style>
  #video-demo { max-height: 600px; }
</style>

<figure class="w-figure w-figure--inline-right">
  {% Video
    src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"],
    poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg",
    loop=true,
    autoplay=true,
    muted=true,
    class="w-screenshot",
    linkTo=true,
    id="video-demo"
  %}
</figure>

Access to the user's contacts on a mobile device has been a feature of iOS/Android apps since
(almost) the dawn of time. It's one of the most common feature requests
I hear from web developers, and is often the key reason they build an iOS/Android
app.

Available in Chrome 80 on Android, the [Contact Picker API][spec] is an
on-demand API that allows users to select entries from their contact list and
share limited details of the selected entries with a website. It allows users to
share only what they want, when they want, and makes it easier for users to
reach and connect with their friends and family.

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
| 2. Create initial draft of specification   | [Complete][spec]             |
| 3. Gather feedback & iterate on design     | [Complete][spec]             |
| 4. Origin trial                            | Complete                     |
| **5. Launch**                              | **Chrome 80**<br>Available on Android only.        |

</div>

## Using the Contact Picker API {: #how-to-use }

The Contact Picker API requires a method call with an options parameter that
specifies the types of contact information you want. A second method tells you
what information the underlying system will provide.

{% Aside %}
  Check out the [Contact Picker API demo](https://contact-picker.glitch.me)
  and view the
  [source](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0).
{% endAside %}

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
returned as the first parameter (with the allowed values being any of
`'name'`, `'email'`, `'tel'`, `'address'`, or `'icon'`),
and optionally whether multiple contacts can be
selected as a second parameter.

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

{% Aside 'caution' %}
  Support for `'address'` and `'icon'` requires Chrome 84 or later.
{% endAside %}

The Contacts Picker API can only be called from a [secure][secure-contexts],
top-level browsing context, and like other powerful APIs, it requires a
user gesture.

### Detecting available properties

To detect which properties are available, call `navigator.contacts.getProperties()`.
It returns a promise that resolves with an array of strings indicating which
properties are available. For example: `['name', 'email', 'tel', 'address']`.
You can pass these values to `select()`.

Remember, properties are not always available, and new properties may be
added. In the future, other platforms and contact sources may restrict
which properties are be shared.

### Handling the results

The Contact Picker API returns an array of contacts, and each contact includes
an array of the requested properties. If a contact doesn't have data for the
requested property, or the user chooses to opt-out of sharing a particular
property, the API returns an empty array. (I describe how the user chooses properties
in the [User control](#security-control) section.)

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
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="Screen shot, users can choose which properties to share.", width="800", height="639", class="w-screenshot" %}
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
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="Screen shot of picker for site requesting all properties.", width="800", height="639", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      Picker, site requesting <code>name</code>, <code>email</code>, and
      <code>tel</code>, one contact selected.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="Screen shot of picker for site requesting only phone numbers.", width="800", height="639", class="w-screenshot" %}
    <figcaption class="w-figcaption">
      Picker, site requesting only <code>tel</code>, one contact selected.
    </figcaption>
  </figure>
</div>

<div class="w-clearfix"></div>

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="Screen shot of picker when a contact is long-pressed.", width="800", height="389",class="w-screenshot" %}
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

The Chrome team wants to hear about your experiences with the Contact Picker
API.

### Problem with the implementation?

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

* File a bug at [https://new.crbug.com][new-bug]. Be sure to include as much
  detail as you can, provide simple instructions for reproducing the bug, and
  set *Components* to `Blink>Contacts`. [Glitch](https://glitch.com) works great
  for sharing quick and easy problem reproductions.

### Planning to use the API?

Are you planning to use the Contact Picker API? Your public support helps the
Chrome team to prioritize features, and shows other browser vendors how
critical it is to support them.

* Share how you plan to use it on the [WICG Discourse thread][wicg-discourse].
* Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
  [`#ContactPicker`](https://twitter.com/search?q=%23ContactPicker&src=typed_query&f=live) and
  let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [Contact Picker Specification][spec]
* [Contact Picker API Demo][demo] and [Contact Picker API demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: `Blink>Contacts`

### Thanks

Big shout out and thanks to Finnur Thorarinsson and Rayan Kanso who are
implementing the feature and Peter Beverloo whose
[code](https://tests.peter.sh/contact-api/) I shamelessly
<strike>stole and</strike> refactored for the demo.

PS: The names in my contact picker are characters from Alice in Wonderland.

[spec]: https://wicg.github.io/contact-api/spec/
[spec-select]: https://wicg.github.io/contact-api/spec/#contacts-manager-select
[spec-security]: https://wicg.github.io/contact-api/spec/#privacy
[demo]: https://contact-picker.glitch.me
[demo-source]: https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=860467
[cr-status]: https://www.chromestatus.com/feature/6511327140904960
[explainer]: https://github.com/WICG/contact-api/
[wicg-discourse]: https://discourse.wicg.io/t/proposal-contact-picker-api/3507
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[secure-contexts]: https://w3c.github.io/webappsec-secure-contexts/
[cr-dev-twitter]: https://twitter.com/chromiumdev
