---
title: New Capabilities Status
subhead: Web apps should be able to do anything native apps can. We want to make it possible for you to build and deliver apps on the open web that have never been possible before.
date: 2018-11-12
updated: 2020-02-14
tags:
  - post
  - capabilities
  - fugu
---

There are some apps that are not possible to build and deliver on the open
web today. We call this, the *app gap*. The gap between what's possible on the
web and what's possible on native. We want to close that gap. We believe web
apps should be able to do anything native apps can.

Through our [capabilities project][capabilities-project], we want to make
it possible for web apps to do anything native apps can, by exposing the
capabilities of native platforms to the web platform, while maintaining user
security, privacy, trust, and other core tenets of the web.

You can see the full list of capabilities we're working on at
<https://goo.gle/fugu-api-tracker>.

<!--
## Capabilities available behind a flag {: #flag }

These *experimental* APIs are only available behind a flag and are still
under-development. There's a good chance they'll break, or the API surface
will change.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Capability</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
-->

## Capabilities available as an origin trial {: #origin-trial }

These APIs are available as an [origin trial][ot-dashboard]. Origin
trials provide an opportunity for us to validate experimental features and
APIs, and make it possible for you to provide feedback on their usability
and effectiveness in  broader deployment.

Opting into an origin trial allows you to build demos and prototypes that
your beta testing users can try for the duration of the trial without requiring
them to flip any special flags in Chrome. There's more info on origin trials
in the [Origin Trials Guide for Web Developers][ot-guide].

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Capability</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="/badging-api/">Badging API</a>
        </td>
        <td>
          The Badging API is a new web platform API that allows installed web
          apps to set an application-wide badge, shown in an
          operating-system-specific place associated with the application, such
          as the shelf or home screen. Badging makes it easy to subtly notify
          the user that there is some new activity that might require their
          attention, or it can be used to indicate a small amount of
          information, such as an unread count.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/content-indexing-api/">Content Indexing API</a>
        </td>
        <td>
          Your PWA might cache articles and media files, but how will your users
          know that your pages work while offline? The Content Indexing API is
          one answer to this question currently in an origin trial. Once the
          index is populated with content from your PWA, as well as any other
          installed PWAs, it will show up in dedicated areas of supported
          browsers.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/native-file-system/">
            Native File System API
          </a>
        </td>
        <td>
          The Native File System API (formerly known as the Writable Files API)
          enables developers to build powerful web apps that interact with files
          on the users local device, like IDEs, photo and video editors, text
          editors, and more. After a user grants a web app access, this API
          allows web apps to read or save changes directly to files and folders
          on the users device.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/periodic-background-sync/">Periodic Background Sync API</a>
        </td>
        <td>
          Periodic Background Sync enables web applications to periodically
          synchronize data in the background, bringing web apps closer to
          the behavior of a native app.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/shape-detection/">Shape&nbsp;Detection API</a>
        </td>
        <td>
          The Shape Detection API opens up native implementations of shape
          detection services and exposes them through a set of JavaScript
          interfaces. Currently, the supported features are face detection,
          barcode detection, and text detection (Optical Character Recognition).
        </td>
      </tr>
      <tr>
        <td>
          <a href="/sms-receiver-api-announcement/">SMS Receiver API</a>
        </td>
        <td>
          Finding, memorizing, and typing OTPs sent via SMS is cumbersome.
          The SMS Receiver API simplifies the OTP workflow for users.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/wakelock/">Wake Lock API</a>
        </td>
        <td>
          To avoid draining the battery, most devices will quickly fall asleep
          when left idle. While this is fine for most of the time, there are
          some applications that need to keep the screen or the device awake in
          order to complete some work. The Wake Lock API provides a way to
          prevent the device from dimming or locking the screen or prevent
          the device from going to sleep when an application needs to keep
          running.
        </td>
      </tr>
    </tbody>
  </table>
</div>


## Capabilities available in stable {: #in-stable }

The following APIs have graduated from origin trial and are available in the
latest version of Chrome.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Capability</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="/image-support-for-async-clipboard/">
            Async&nbsp;Clipboard API (images)
          </a>
        </td>
        <td>
          TODO
          In Chrome 66, we shipped the Asynchronous Clipboard API with
          support for reading and writing text. In Chrome 76, we added support
          for reading and writing images to the clipboard.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/contact-picker/">Contact Picker API</a>
        </td>
        <td>
          The Contact Picker API is a new, on-demand picker that allows users to
          select entries from their contact list and share limited details of
          the selected entries with a website. It allows users to share only
          what they want, when they want, and makes it easier for users to
          reach and connect with their friends and family.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/get-installed-related-apps/">
            Get Installed Related Apps API
          </a>
        </td>
        <td>
          The Get Installed Related Apps API is a new web platform API
          that allows your web app to check to see if your native app is
          installed on the users device, and vice versa.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/web-share/">Web Share</a>
        </td>
        <td>
          With the Web Share API, web apps are able to use the same
          system-provided share capabilities as native apps. The Web Share API
          makes it possible for web apps to share links, text, and files to
          other apps installed on the device in the same way as native apps.
        </td>
      </tr>
      <tr>
        <td>
          <a href="/web-share-target/">Web Share Target</a>
        </td>
        <td>
          The Web Share Target API allows installed web apps to register with
          the underlying OS as a share target to receive shared content from
          either the Web Share API or system events, like the OS-level share
          button.
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Suggest a new capability {: #suggest-new }

Have a suggestion for a capability you think we should consider?
Tell us about it by filing a [new feature request](https://goo.gl/qWhHXU).
Please be sure to include as much detail as you can, such as
the problem you're trying to solve, suggested use cases, and anything else
that might be helpful.

{% Aside %}
  Want to try some of these new capabilities? Check out the
  [Web Capabilities Codelab](https://codelabs.developers.google.com/codelabs/web-capabilities/).
{% endAside %}

[ot-dashboard]: https://developers.chrome.com/origintrials/
[ot-guide]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[capabilities-project]: https://developers.google.com/web/updates/capabilities
