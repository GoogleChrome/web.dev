---
title: New capabilities status
subhead: Web apps should be able to do anything iOS/Android/desktop apps can. The members of the cross-company capabilities project want to make it possible for you to build and deliver apps on the open web that have never been possible before.
date: 2018-11-12
updated: 2021-11-03
tags:
  - blog
  - capabilities
---

{% Aside %}
This is a living document and will be updated as features move between
states.
{% endAside %}

The [capabilities project][capabilities-project] is a cross-company effort with the objective of
making it possible for web apps to do anything iOS/Android/desktop apps can, by exposing the
capabilities of these platforms to the web platform, while maintaining user
security, privacy, trust, and other core tenets of the web.

You can see the full list of new and potential capabilities at
the [Fugu API Tracker](https://goo.gle/fugu-api-tracker).

## Capabilities available in stable {: #in-stable }

The following APIs have graduated from origin trial and are available in the
latest version of Chrome, and in many cases other Chromium based browsers.

<a class="w-button w-button--primary" href="https://fugu-tracker.web.app/#:~:text=Oct%2019%2C%202021)-,shipped%20%23,-Web%20Bluetooth%20API">
  See all already shipped APIs
</a>

## Capabilities available as an origin trial {: #origin-trial }

These APIs are available as an [origin trial][ot-dashboard] in Chrome. Origin
trials provide an opportunity for Chrome to validate experimental features and
APIs, and make it possible for you to provide feedback on their usability
and effectiveness in broader deployment.

Opting into an origin trial allows you to build demos and prototypes that
your beta testing users can try for the duration of the trial without requiring
them to flip any special flags in their browser. There's more info on origin
trials in the [Origin Trials Guide for Web Developers][ot-guide].

<a class="w-button w-button--primary" href="https://fugu-tracker.web.app/#:~:text=origin%20trial%20(details)">
  See all APIs currently in origin trial
</a>

## Capabilities available behind a flag {: #flag }

These APIs are only available behind a flag. They're experimental and still
under development. They are not ready for use in production. There's a good
chance there are bugs, that these APIs will break, or the API surface will
change.

<a class="w-button w-button--primary" href="https://fugu-tracker.web.app/#:~:text=developer%20trial%20-%20behind%20a%20flag">
  See all APIs currently behind a flag
</a>

## Capabilities that are started {: #started }

Work on these APIs has just started. There is not much to see yet,
but interested developers may want to start the relevant Chromium bugs
to stay updated as progress is being made.

<a class="w-button w-button--primary" href="https://fugu-tracker.web.app/#:~:text=Started">
  See all APIs on which work has started
</a>

## Capabilities that are started {: #started }

This is the backlog of APIs and ideas we have not gotten to yet.
It is worthwhile to star the relevant Chromium bugs to cast your vote
for a feature, and to be informed once work starts.

<a class="w-button w-button--primary" href="https://fugu-tracker.web.app/#:~:text=under%20consideration%20(star%20and%20comment%20the%20bug)">
  See all APIs under consideration
</a>

## Suggest a new capability {: #suggest-new }

Do you have a suggestion for a capability you think Chromium should consider?
Tell us about it by filing a [new feature request](https://goo.gl/qWhHXU).
Please be sure to include as much detail as you can, such as
the problem you're trying to solve, suggested use cases, and anything else
that might be helpful.

{% Aside %}
  Want to try some of these new capabilities? Check out the
  [Web Capabilities Codelab](https://developers.google.com/codelabs/project-fugu#0).
{% endAside %}

[ot-dashboard]: https://developers.chrome.com/origintrials/#/trials/active
[ot-guide]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[capabilities-project]: https://developers.google.com/web/updates/capabilities
