---
title: Address Bar Install for Progressive Web Apps on the Desktop
subhead: Progressive Web Apps are easy to install with a new install button in Chrome’s address bar (omnibox).
authors:
  - petelepage
date: 2019-06-12
updated: 2019-06-12
description: |
  Progressive Web Apps are easy to install with a new install button in Chrome’s address bar (omnibox).
tags:
  - blog # blog is a required tag for the article to show up in the blog.
---

On desktop, there's typically no indication to a user that a Progressive Web
App is installable, and if it is, the install flow is hidden within the three
dot menu.

<figure class="float-right">
  {% Video src="video/T4FyVKpzu4WKF1kBNvXepbi08t52/Clnl7AHL7JTP8XCSqLTX.mp4", muted="true", autoplay="true", loop="true" %}
</figure>

In Chrome 76 (beta mid-June 2019), we're making it easier for users to install
Progressive Web Apps on the desktop by adding an install button to the address
bar (omnibox). If a site meets the
[Progressive Web App installability criteria][pwa-install-criteria],
Chrome will automatically show an install icon in the address bar. Clicking the
button prompts the user to install the PWA.

Like other install events, you can listen for the [`appinstalled`][appinstalled-event]
event to detect if the user installed your PWA.


## Adding your own install prompt

If your PWA has use cases where it’s helpful for a user to install your app,
for example if you have users who use your app more than once a week, you
should be promoting the installation of your PWA within the web UI of your app.

To add your own custom install button, listen for the
[`beforeinstallprompt`][beforeinstallprompt-event] event. When it’s fired,
save a reference to the event, and update your user interface to let the user
know they can install your Progressive Web App.

## Patterns for promoting the installation of your PWA

There are three key ways you can promote the installation of your PWA:

* **Automatic browser promotion**, like the address bar install button.
* **Application UI promotion**, where UI elements appear in the application
  interface, such as banners, buttons in the header or navigation menu, etc.
* **Inline promotional patterns** interweave promotions within the site content.

Check out Patterns for [Promoting PWA Installation (mobile)][install-patterns]
for more details. It’s focus is mobile, but many of the patterns are applicable
for desktop, or can be easily modified to work for desktop experiences.

[pwa-install-criteria]: https://developers.google.com/web/fundamentals/app-install-banners/#criteria
[appinstalled-event]: https://developers.google.com/web/fundamentals/app-install-banners/#appinstalled
[beforeinstallprompt-event]: https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt
[install-patterns]: https://developers.google.com/web/fundamentals/app-install-banners/promoting-install-mobile
