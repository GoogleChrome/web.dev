---
title: |
  Wake Lock API case study: 300% increase in purchase intent indicators on BettyCrocker.com
subhead: |
  Nothing is worse when cooking with a mobile device than its screen turning off
  in the middle of a recipe step.
  Learn how cooking site BettyCrocker.com used the Wake Lock API to prevent this from happening.
authors:
  - thomassteiner
  - phillipkriegel
date: 2020-05-19
updated: 2020-05-19
hero: image/admin/uWpEHKUQjInjnw4h1YIC.jpg
alt: Betty Crocker Cake Mix—Coffee Cinnamon.
description: |
  Case study of cooking site BettyCrocker.com's experiences with implementing the Wake Lock API.
tags:
  - blog
  - case-study
  - wake-lock
  - capabilities
---
For nearly a century, Betty Crocker has been America's source for modern cooking instruction
and trusted recipe development.
Launched in 1997, their site [BettyCrocker.com](https://www.bettycrocker.com/)
today receives more than 12&nbsp;million visitors per month.
After they **implemented the Wake Lock API**, their
**indicators of
[purchase intent](https://www.igi-global.com/dictionary/technology-and-sharing-economy-based-business-models-for-marketing-to-connected-consumers/24144)
were about 300% higher** for wake lock users compared to all users.

## The retired iOS and Android apps

Released to [much fanfare](https://consumergoods.com/betty-crocker-launches-cookbook-app) in 2014,
Betty Crocker recently took their apps out of the Apple App Store and the Google Play Store
after they had been deprioritized.
For a long time, the Betty Crocker team has preferred adding new features to the mobile site
instead of the iOS/Android apps.
The technical platform the iOS/Android apps were created on was outdated,
and the business did not have the resources
to support updating and maintaining the apps moving forward.
The web app also was objectively way bigger traffic-wise,
more modern, and easier to enhance.

The iOS/Android apps did have one *killer feature*, though, that their users loved:

> Millennial cooking pro tip: the [@BettyCrocker](https://twitter.com/BettyCrocker) mobile app
  doesn't dim or lock when you're following a recipe.
  —[@AvaBeilke](https://twitter.com/AvaBeilke/status/996746473168670720)

> 80% of people cook with a device in the kitchen, but screen dimming and locking is a problem.
  What did [@BettyCrocker](https://twitter.com/BettyCrocker) do?
  Updated their app to NOT dim when users are in a recipe.
  —[@Katie_Tweedy_](https://twitter.com/Katie_Tweedy_/status/996746567762763776)

## Bringing the killer feature to the web with the Wake Lock API

When cooking with a device, there is nothing more frustrating
than having to touch the screen with messy hands or even your nose when the screen turns off.
Betty Crocker asked themselves how they could port the killer feature of their iOS/Android apps
over to the web app.
This is when they learned about
[Project Fugu](https://developers.google.com/web/updates/capabilities) and the
[Wake Lock API](/wakelock/).

{% Img src="image/admin/Yoj65m20XpoPdaL8ejAv.jpg", alt="A person kneading dough on a kitchen table covered in flour", width="800", height="533" %}

The Wake Lock API provides a way to prevent the device
from dimming or locking the screen.
This capability enables new experiences that, until now, required an iOS/Android app.
The Wake Lock API reduces the need for hacky and potentially power-hungry workarounds.

### Requesting a wake lock

To request a wake lock, you need to call the `navigator.wakeLock.request()` method
that returns a `WakeLockSentinel` object. You will use this object as a
[sentinel value](https://en.wikipedia.org/wiki/Sentinel_value).
The browser can refuse the request for various reasons
(for example, because the battery is too low),
so it is a good practice to wrap the call in a `try…catch` statement.

### Releasing a wake lock

You also need a way to release a wake lock,
which is achieved by calling the `release()` method of the `WakeLockSentinel` object.
If you want to automatically release the wake lock after a certain period of time has passed,
you can use `window.setTimeout()` to call `release()`, as shown in the example below.

```js
// The wake lock sentinel.
let wakeLock = null;

// Function that attempts to request a wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Request a wake lock…
await requestWakeLock();
// …and release it again after 5s.
window.setTimeout(() => {
  wakeLock.release();
  wakeLock = null;
}, 5000);
```

## The implementation

With the new web app, users should be enabled to easily navigate through a recipe,
complete steps, and even walk away without the screen locking.
To achieve this goal, the team first built a quick front-end prototype
as a proof of concept and to gather UX input.

After the prototype proved useful, they designed a
[Vue.js component](https://vuejs.org/v2/guide/components.html)
that could be shared across all their brands ([BettyCrocker](https://www.bettycrocker.com/),
[Pillsbury](https://www.pillsbury.com/), and [Tablespoon](https://www.tablespoon.com/)).
Even though only Betty Crocker had iOS and Android apps,
the three sites do have a shared code base,
so they were able to implement the component once, and deploy it everywhere,
as shown in the screenshots below.

<figure class="w-figure">
  {% Img src="image/admin/I9y4AIPEK9P4V0JFn4y1.png", alt="BettyCrocker.com wake lock toggle", width="600", height="170", class="w-screenshot" %}
  <figcaption class="w-figcaption">BettyCrocker.com wake lock toggle.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/PXS7bnWxYiLKtmLekulr.png", alt="Pillsbury.com wake lock toggle", width="600", height="152", class="w-screenshot" %}
  <figcaption class="w-figcaption">Pillsbury.com wake lock toggle.</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/S5NQabO9qJTwlidx2eZo.png", alt="Tablespoon.com wake lock toggle", width="600", height="152", class="w-screenshot" %}
  <figcaption class="w-figcaption">Tablespoon.com wake lock toggle.</figcaption>
</figure>

When developing the component based on the new site's modernized framework,
there was a strong focus on the
[`ViewModel` layer of the MVVM pattern](https://012.vuejs.org/guide/).
The team also programmed with interoperability in mind
to enable functionality on legacy and new frameworks of the site.

To keep track of viewability and usability, Betty Crocker integrated analytics tracking
for core events in the wake lock lifecycle.
The team utilized feature management to deploy the wake lock component
to a single site for initial production rollout,
and then deployed the feature to the rest of the sites after monitoring usage and page health.
They continue to monitor analytics data based on the usage of this component.

As a failsafe for users, the team created a forced timeout
to disable the wake lock after one hour of inactivity.
The final implementation they settled on
was in the short-term a toggle switch on all recipe pages across their sites.
In the long-term, they envision a revamped recipe page view.

### The wake lock container

```js
var wakeLockControl = () => {
  return import(/* webpackChunkName: 'wakeLock' */ './wakeLock');
};

export default {
  components: {
    wakeLockControl: wakeLockControl,
  },
  data() {
    return {
      config: {},
      wakeLockComponent: '',
    };
  },
  methods: {
    init: function(config) {
      this.config = config || {};
      if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
        this.wakeLockComponent = 'wakeLockControl';
      } else {
        console.log('Browser not supported');
      }
    },
  },
};
```

### The wake lock component

```html
<template>
  <div class="wakeLock">
    <div class="textAbove">{{settingsInternal.textAbove}}</div>
    <label class="switch" :aria-label="settingsInternal.textAbove">
      <input type="checkbox" @change="onChange()" v-model="isChecked">
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script type="text/javascript">
  import debounce from 'lodash.debounce';

  const scrollDebounceMs = 1000;

  export default {
    props: {
      settings: { type: Object },
    },
    data() {
      return {
        settingsInternal: this.settings || {},
        isChecked: false,
        wakeLock: null,
        timerId: 0,
      };
    },
    created() {
      this.$_raiseAnalyticsEvent('Wake Lock Toggle Available');
    },
    methods: {
      onChange: function() {
        if (this.isChecked) {
          this.$_requestWakeLock();
        } else {
          this.$_releaseWakeLock();
        }
      },
      $_requestWakeLock: async function() {
        try {
          this.wakeLock = await navigator.wakeLock.request('screen');
          //Start new timer
          this.$_handleAbortTimer();
          //Only add event listeners after wake lock is successfully enabled
          document.addEventListener(
            'visibilitychange',
            this.$_handleVisibilityChange,
          );
          window.addEventListener(
            'scroll',
            debounce(this.$_handleAbortTimer, scrollDebounceMs),
          );
          this.$_raiseAnalyticsEvent('Wake Lock Toggle Enabled');
        } catch (e) {
          this.isChecked = false;
        }
      },
      $_releaseWakeLock: function() {
        try {
          this.wakeLock.release();
          this.wakeLock = null;
          //Clear timer
          this.$_handleAbortTimer();
          //Clean up event listeners
          document.removeEventListener(
            'visibilitychange',
            this.$_handleVisibilityChange,
          );
          window.removeEventListener(
            'scroll',
            debounce(this.$_handleAbortTimer, scrollDebounceMs),
          );
        } catch (e) {
          console.log(`Wake Lock Release Error: ${e.name}, ${e.message}`);
        }
      },
      $_handleAbortTimer: function() {
        //If there is an existing timer then clear it and set to zero
        if (this.timerId !== 0) {
          clearTimeout(this.timerId);
          this.timerId = 0;
        }
        //Start new timer; Will be triggered from toggle enabled or scroll event
        if (this.isChecked) {
          this.timerId = setTimeout(
            this.$_releaseWakeLock,
            this.settingsInternal.timeoutDurationMs,
          );
        }
      },
      $_handleVisibilityChange: function() {
        //Handle navigating away from page/tab
        if (this.isChecked) {
          this.$_releaseWakeLock();
          this.isChecked = false;
        }
      },
      $_raiseAnalyticsEvent: function(eventType) {
        let eventParams = {
          EventType: eventType,
          Position: window.location.pathname || '',
        };
        Analytics.raiseEvent(eventParams);
      },
    },
  };
</script>
```

### Results

The Vue.js component has been deployed on all three sites and delivered great results.
During the period from December 10th, 2019 to January 10th, 2020,
BettyCrocker.com reported the following metrics:

- Of all Betty Crocker users with a browser compatible with the Wake Lock API,
  3.5% of them enabled the feature immediately, making it a top-5 action.
- The session duration for users who enabled the wake lock was 3.1× longer
  than for users who did not.
- The bounce rate for users who enabled the wake lock was 50% lower
  than for those not using the wake lock feature.
- Indicators of purchase intent were about 300% higher for wake lock users compared to all users.

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">3.1<sub class="w-stat__sub">×</sub></p>
    <p class="w-stat__desc">Longer session duration</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">50<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower bounce rate</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">300<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher purchase intent indicators</p>
  </div>
</div>

## Conclusions

Betty Crocker has seen fantastic results using the Wake Lock API.
You can test the feature yourself by searching for your favorite recipe on any of their sites
([BettyCrocker](https://www.bettycrocker.com/),
[Pillsbury](https://www.pillsbury.com/), or [Tablespoon](https://www.tablespoon.com/))
and enabling the **Prevent your screen from going dark while you cook** toggle.

Use cases for wake locks do not stop at recipe sites.
Other examples are boarding pass or ticket apps that need to keep the screen on
until the barcode has been scanned, kiosk-style apps that keep the screen on continuously,
or web-based presentation apps that prevent the screen from sleeping during a presentation.

We have compiled [everything you need to know about the Wake Lock API](/wakelock/)
in a comprehensive article on this very site.
Happy reading, and happy cooking!

## Acknowledgements

The *person kneading dough* photo courtesy of
[Julian Hochgesang](https://unsplash.com/@julianhochgesang)
on [Unsplash](https://unsplash.com/photos/huepD-06_pQ).
