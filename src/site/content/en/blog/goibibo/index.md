---
title: How Goibibo's PWA improved conversions by 60%
subhead: Bridging the gap between web and iOS/Android experiences to delight users.
date: 2020-09-29
hero: hero.png
thumbnail: thumbnail.png
description: >
  Learn how Goibibo, India’s top online travel company, achieved a 60% increase in
  conversions by building reliable user experiences between their PWA and iOS/Android apps. 
tags:
  - blog
  - case-study
  - capabilities
  - progressive-web-apps
  - scale-on-web
---

[Goibibo](https://goibibo.com) is India's leading online travel booking portal. By building a full-featured
and reliable [Progressive Web App](/pwa) that matched the capabilities of their iOS and Android
apps, Goibibo achieved a 60% increase in conversions (compared to their previous web flow).

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">60<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in conversions</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">20<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in logged-in users</p>
  </div>
</div>

## Highlighting the opportunity {: #opportunity }

In their journey to improve user experience, Goibibo noticed a few trends:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled w-figure--inline-right"
      src="mobile.png" 
      alt="Goibibo's PWA.">
</figure>

* With users either already shifted or quickly shifting to mobile, their initial strategy
  towards mobile web was to build a lightweight and functional application. This worked, with
  search-to-details-page conversions equalizing on web and iOS/Android, but the iOS/Android apps
  won in all further steps of the conversion funnel.

* There were significant drop offs at the payment stage of the PWA compared to their
  iOS/Android apps. This was when they decided to invest in their PWA with the goal of letting
  users experience the same UX on their PWA as on their iOS/Android apps.  

* They also noticed nearly 20% of their users were starting a session on the web and
  converting on the app. This reiterated their belief that a chunk of users will go untapped
  without an aligned PWA and iOS/Android app strategy.

## The tools they used {: #tools }

### Contact Picker API {: #contact-picker }

<div class="w-columns">
  <p>
    Nearly 15% of Goibibo's logged-in users make bookings for family or friends on the mobile web.
    Goibibo used the <a href="/contact-picker/">Contact Picker API</a> to enable PWA users to fill
    in forms on behalf of others hassle-free.
  </p>
  <figure class="w-figure">
    <img class="w-screenshot" 
        src="seamless.png"
        alt="Impact: 20% of users chose the seamless Goibibo experience.">
  </figure>
</div>

### Web OTP {: #web-otp }

<div class="w-columns">
  <p>
    Because secure authentication is a big challenge in India, Goibibo
    used the <a href="/web-otp/">Web OTP (One-Time Password) API</a>
    to reduce sign-in friction on their PWA.
  </p>
  <figure class="w-figure">
    <img class="w-screenshot" 
        src="logins.png" 
        alt="Impact: 20% increase in their mobile web logged-in users;
              25% drop in OTP retry API calls during sign up.">
  </figure>
</div>

### Web Share API {: #web-share }

<div class="w-columns">
  <p>
    To bridge the gap between their web and iOS/Android experiences,  Goibibo adopted the
    <a href="/web-share/">Web Share API</a> to make it easier to share  links, text, or files around hotel
    details, train availability, and so on.
  </p>
  <figure class="w-figure">
    <img class="w-screenshot" 
        src="web-share.png" 
        alt="Impact: 5% of new sessions came from Web Share API.">
  </figure>
</div>

### Push notifications {: #notifications}

<div class="w-columns">
  <p>
    Goibibo used <a href="https://developers.google.com/web/fundamentals/push-notifications">web push
    notifications</a> to retarget bounced users with relevant updates like flight fare alerts and other
    customized content.
  </p>
  <figure class="w-figure">
    <img class="w-screenshot" 
        src="conversions.png" 
        alt="Impact: Retargeted users converted 4x more compared to normal user base.">
  </figure>
</div>

## How new web capabilities improved Goibibo's funnel {: #funnel }

<style>
@media (min-width: 865px) {
  #funnel {
    max-width: 75%;
  }
}
</style>

<figure class="w-figure">
  <img class="w-screenshot"
       src="funnel.png"
       id="funnel"
       alt="1. Web Share improved returning user percentage
            2. Contact Picker enhanced user experience, making it easier for guests to book
            3. Web OTP reduced friction during transactions, resulting in less time spent on OTP screen and less retry API calls
            4. Push notifications improved conversions of retargeted users">
</figure>

## Overall business results {: #results }

+   Iterations to PWA interfaces resulted in a 60% jump in conversion rate (compared to the
    previous mobile web flow) and delighted users.
+   [New web capabilities](https://web.dev/fugu-status/) improved UX and caused a 20% increase
    in logged-in users (who convert 6x more).

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    We always strive for seamless user experience and in turn better  conversion rates. We saw
    improved user engagement and better conversion rates on PWA than on the original mobile web flow.
    Hence,  investing in PWA is critical to our success and if we had not, it would have cost us a
    fortune.
  </p>
  <cite>Rithish Saralaya, VP Engineering, Goibibo</cite>
</blockquote>

Check out the [SCALE on web case studies](/tags/scale-on-web) page for more
success stories from India and Southeast Asia.