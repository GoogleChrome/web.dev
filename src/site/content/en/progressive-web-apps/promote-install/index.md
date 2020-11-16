---
layout: post
title: Patterns for promoting PWA installation
authors:
  - pjmclachlan
  - mustafakurtuldu
date: 2019-06-04
updated: 2020-06-17
description: |
  How to promote installation of Progressive Web Apps and best practices.
tags:
  - progressive-web-apps
feedback:
  - api
---

Installing your Progressive Web App (PWA) can make it easier for users to
find and use. Even with browser promotion, some users don't realize that
they can install a PWA, so it can be helpful to provide an in-app experience
that you can use to promote and enable installation of your PWA.

<figure class="w-figure w-figure--inline-right">
  <img src="simple-button_mobile-crop.png"
      alt="Screenshot of simple install button in PWA.">
  <figcaption class="w-figcaption">
    A simple install button provided within your PWA.
  </figcaption>
</figure>

This list is by no means exhaustive, but offers a starting point for different
ways to promote the installation of your PWA. Regardless of which pattern, *or
patterns* you use,  they all lead to the same code that triggers the install
flow, documented in
[How to provide your own in-app install experience](/customize-install/).

<div class="w-clearfix">&nbsp;</div>

## PWA install promotion best practices {: #best-practices }

There are some best practices that apply no matter what promotional patterns
you're using on your site.

* Keep promotions outside of the flow of your user journeys. For example,
  in a PWA login page, put the call to action below the login form and submit
  button. Disruptive use of promotional patterns reduces the usability of your
  PWA and negatively impacts your engagement metrics.
* Include the ability to dismiss or decline the promotion. Remember the
  user's preference if they do this and only re-prompt if there's a change
  in the user's relationship with your content such as if they signed in or
  completed a purchase.
* Combine more than one of these techniques in different parts of your PWA,
  but be careful not to overwhelm or annoy your user with install promotion.
* Only show the promotion **after** the
  [`beforeinstallprompt` event](/customize-install/#beforeinstallprompt) has
  been fired.

## Automatic browser promotion {: #browser-promotion }

When [certain criteria](/install-criteria/) are met, most browsers will
automatically indicate to the user that your Progressive Web App is
installable. For example, desktop Chrome shows an install button in the omnibox.

<div class="w-columns">
  <figure class="w-figure" id="browser-install-promo">
    <img src="how-does-it-work_desktop.png"
        alt="Screenshot of omnibox with install indicator visible.">
    <figcaption class="w-figcaption">
      Browser provided install promotion (desktop)
    </figcaption>
  </figure>
  <figure class="w-figure">
    <img src="how-does-it-work_mobile.png"
        alt="Screenshot of browser provided install promotion.">
    <figcaption class="w-figcaption">
      Browser provided install promotion (mobile)
    </figcaption>
  </figure>
</div>

<div class="w-clearfix">&nbsp;</div>

Chrome for Android will show a mini-infobar to the user, though this can be
prevented by calling `preventDefault()` on the `beforeinstallprompt` event.
If you do not call `preventDefault()`, the banner will be shown the first time
a user visits your site and it meets the installability criteria on Android,
and then again after approximately 90 days.

## Application UI promotional patterns {: #app-ui-patterns }

Application UI promotional patterns can be used for almost any kind of PWA and
appear in the application UI, such as site navigation and banners. As with
any other type of promotional pattern, it's important to be aware of the
user's context to minimize disruption of the user's journey.

Sites which are thoughtful about when they trigger promotion UI achieve a
larger number of installs and avoid interfering with the journeys of users
who aren't interested in installation.

<div class="w-clearfix">&nbsp;</div>

### Simple install button {: #simple-button }

The simplest possible UX is to include an 'Install' or 'Get app' button at an
appropriate location in your web content. Ensure the button doesn't block
other important functionality and is out of the way of the user's journey
through your application.

<figure class="w-figure">
  <img src="simple-button_desktop.png" alt="Custom install button">
  <figcaption class="w-figcaption">
    Simple install button
  </figcaption>
</figure>

<div class="w-clearfix">&nbsp;</div>

### Fixed header {: #header }

This is an install button that is part of the header of your site. Other
header content often includes site branding such as a logo and the hamburger
menu. Headers may be `position:fixed` or not depending on your site's
functionality and user needs.

<figure class="w-figure">
  <img src="elevated-install_desktop.png" alt="Custom install button in header">
  <figcaption class="w-figcaption">
    Custom install button in header
  </figcaption>
</figure>

When used appropriately, promoting PWA installation from the header of your
site is a great way to make it easier for your most loyal customers to
return to your experience. Pixels in your PWA header are precious,
so make sure your installation call to action is appropriately sized, of greater
importance than other possible header content, and unintrusive.

<figure class="w-figure w-figure--inline-right">
  <img src="elevated-install_mobile.png" alt="Custom install button in header">
  <figcaption class="w-figcaption">
    Custom install button in header
  </figcaption>
</figure>

Make sure you:

* Do not show the install button unless the `beforeinstallprompt` has been
  fired.
* Evaluate the value of your installed use case for your users. Consider
  selective targeting to only present your promotion for users that are
  likely to benefit from it.
* Use precious header space efficiently. Consider what else would be helpful
  to offer your user in the header, and weigh the priority of the install
  promotion relative to other options.

<div class="w-clearfix">&nbsp;</div>

### Navigation menu {: #nav }

<figure class="w-figure w-figure--inline-right">
  <img src="nav.png" alt="Custom install button in nav menu">
  <figcaption class="w-figcaption">
    Add an install button/promotion in a slide out navigation menu.
  </figcaption>
</figure>

The navigation menu is a great place for promoting the installation of your
app since users who open the menu are signaling engagement with your experience.

Make sure you:

* Avoid disrupting important navigational content. Put the PWA install
  promotion below other menu items.
* Offer a short, relevant pitch for why the user would benefit from
  installing your PWA.

<div class="w-clearfix">&nbsp;</div>

### Landing page {: #landing }

The purpose of a landing page is to promote your products and services,
so this is one place where it is appropriate to go large with promoting
the benefits of installing your PWA.

<figure class="w-figure w-figure--inline-right">
  <img src="landing.png" alt="Custom install prompt on landing page">
  <figcaption class="w-figcaption">
    Custom install prompt on landing page
  </figcaption>
</figure>

First, explain your site's value proposition, then let visitors know what
they'll get from installation.

Make sure you:

* Appeal to features that matter most to your visitors and emphasize
  keywords that might have brought them to your landing page.
* Make your install promotion and call to action eye catching, but only after
  you've made your value proposition clear. This is your landing page, after
  all.
* Consider adding an install promotion in the part of your app where users spend
  most of their time.

<div class="w-clearfix">&nbsp;</div>

### Install banner {: #banner }

<figure class="w-figure w-figure--inline-right">
  <img src="banner.png" alt="Custom install banner at top of page.">
  <figcaption class="w-figcaption">
    A dismissible banner at the top of the page.
  </figcaption>
</figure>

Most users have encountered installation banners in mobile experiences and are
familiar with the interactions offered by a banner. Banners should be used
carefully because they can disrupt the user.

Make sure you:

* Wait until the user has demonstrated interest in your site before showing
  a banner. If the user dismisses your banner, don't show it again unless
  the user triggers a conversion event that indicates a higher level of
  engagement with your content such as a purchase on an e-commerce site or
  signing up for an account.
* Provide a brief explanation of the value of installing your PWA in the
  banner. For example, you can differentiate the install of a PWA from an
  iOS/Android app by mentioning that it uses almost no storage on the user's
  device or that it will install instantly without a store redirect.

<div class="w-clearfix">&nbsp;</div>

### Temporary UI {: #temporary-ui }

Temporary UI, such as the [Snackbar](https://material.io/components/snackbars/)
design pattern, notifies the user, and allows them to easily complete an
action. In this case, install the app. When used properly, these kinds of UI
patterns don't interrupt the user flow, and are typically automatically
dismissed if ignored by the user.

<figure class="w-figure">
  <img src="temporary-ui_desktop.png" alt="Custom install banner as snackbar.">
  <figcaption class="w-figcaption">
    A dismissible snackbar indicating the PWA is installable.
  </figcaption>
</figure>

Show the snackbar after a few engagements, interactions with your app. If it
appears on  page load, or out of context, it can be easily missed, or lead
to cognitive overload. When this happens, users will simply dismiss everything
they see. And remember, new users to your site may not be ready to install your
PWA. Therefore, it's best to wait until you have strong interest signals from
the user before using this pattern, for example, repeat visits, a user sign
in, or similar conversion event.

<figure class="w-figure w-figure--inline-right">
  <img src="temporary-ui_mobile.png" alt="Custom install banner as snackbar.">
  <figcaption class="w-figcaption">
    A dismissible snackbar indicating the PWA is installable.
  </figcaption>
</figure>

Make sure you:

* Show the snackbar for between 4 and 7 seconds to give users enough
  time to see and react to it, and without getting in the way.
* Avoid showing it over other temporary UI such as banners, etc.
* Wait until you have strong interest signals from the user before
  using this pattern, for example, repeat visits, a user sign in,
  or similar conversion event.

<div class="w-clearfix">&nbsp;</div>

## After conversion

Immediately after a user conversion event, for example after a purchase on
an e-commerce site, is an excellent opportunity to promote the installation of
your PWA. The user is clearly engaged with your content, and a conversion
often signals that the user will engage with your services again.

<figure class="w-figure">
  <img src="after-conversion_desktop.png" alt="Screenshot of install promotion after conversion.">
  <figcaption class="w-figcaption">
    Install promotion after user has completed purchase.
  </figcaption>
</figure>

### Booking or checkout journey {: #journey }

<figure class="w-figure w-figure--inline-right">
  <img src="after-conversion_mobile.png" alt="Install promotion after a user journey.">
  <figcaption class="w-figcaption">
    Install promotion after a user journey.
  </figcaption>
</figure>

Show an install promotion during or after a sequential journey such as those typical of
booking or checkout flows. If you're displaying the promotion after the user
has completed the journey, you can often make it more prominent since the
journey is completed.

Make sure you:

* Include a relevant call to action. Which users will benefit from installing
  your app and why? How is it relevant to the journey they are currently
  undertaking?
* If your brand has unique offers for installed app users, be sure to mention
  them here.
* Keep the promotion out of the way of next steps in your journey or you can
  negatively affect your journey completion rates. In the e-commerce example
  above, notice how the key call to action to checkout is above the
  app install promotion.

<div class="w-clearfix">&nbsp;</div>

### Sign up, sign in, or sign out flow {: #sign-up}

This promotion is a special case of the [journey](#journey) promotional
pattern where the promotion card can be more prominent.

<figure class="w-figure w-figure--inline-right">
  <img src="sign-up.png" alt="Custom install button on the sign up page.">
  <figcaption class="w-figcaption">
    Custom install button on the sign up page.
  </figcaption>
</figure>

These pages are usually only viewed by engaged users, where the value
proposition of your PWA has already been established. There's also often not
a lot of other useful content to place on these pages. As a result, it's less
disruptive to make a larger call-to-action as long as it's not in the way.

Make sure you:

* Avoid disrupting the user's journey inside the sign up form. If it's a
  multi-step process, you might want to wait until the user has completed the
  journey.
* Promote features most relevant to a signed-up user.
* Consider adding an additional install promotion within the signed-in areas
  of your app.

<div class="w-clearfix">&nbsp;</div>

## Inline promotional patterns

Inline promotional techniques interweave promotions with site content. This
is often more subtle than promotion in application UI, which has tradeoffs.
You want your promotion to stand out enough that interested users will notice
it, but not so much that it detracts from the quality of your user experience.

### In-feed {: #in-feed }

An in-feed install promotion appears between news articles or other lists of
information cards in your PWA.

<figure class="w-figure w-figure--inline-right">
  <img src="in-feed.png" alt="Install promotion within content feed.">
  <figcaption class="w-figcaption">
    Install promotion within content feed.
  </figcaption>
</figure>

Your goal is to show users how to access the content they're enjoying more
conveniently. Focus on promoting features and functionality that will be
helpful to your users.

Make sure you:

* Limit the frequency of the promotions to avoid annoying users.
* Give your users the ability to dismiss the promotions.
* Remember your user's choice to dismiss.
