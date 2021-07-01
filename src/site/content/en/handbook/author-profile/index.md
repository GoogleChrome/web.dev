---
layout: handbook
title: Authors profile
date: 2019-06-26
description: |
  Learn how to create an author profile for web.dev.
---

## Add yourself to the authors list
1. Add a new object to [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/master/src/site/_data/authorsData.json) with the following structure. Make sure to choose a unique author slug.

    ```json
    "authorslug": {
      "name": {
        "given": "Jaimie",
        "family": "Smith"
      }
    },
    ```

1. If you want links to your online accounts to appear in your author lockup, add any of these members to your author object.

    ```json/5-7
    "jaimiesmith": {
      "name": {
        "given": "Jaimie",
        "family": "Smith"
      },
      "twitter": "jaimiesmith",
      "github": "jaimiesmith",
      "glitch": "jaimiesmith",
      "homepage": "https://jaimiesmithis.cool/",
      "descriptions": {
        "en": "Jaimie is more than meets the eye"
      },
    },
    ```

    <figure class="w-figure">
      {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wwUATUCfC4NdWk61UmrV.png", alt="Screenshot of an author lockup", width="267", height="95", class="w-screenshot" %}
    </figure>

1. You can also add supplemental info, but it's not currently displayed on web.dev.

    ```json/8-16
    "jaimiesmith": {
      "name": {
        "given": "Jaimie",
        "family": "Smith"
      },
      "twitter": "jaimiesmith",
      "github": "jaimiesmith",
      "glitch": "jaimiesmith",
      "homepage": "https://jaimiesmithis.cool/",
      "descriptions": {
        "en": "Jaimie is more than meets the eye"
      },
      "org": {
        "name": "Google",
        "unit": "Developer Relations"
      },
      "country": "US",
    },
    ```

## Create a profile image
1. Follow the [Images and video](/handbook/markup-media/) guide to upload your
   photo to the CDN.
1. The image uploader will return a shortcode. Copy the `src` value from the
   shortcode and use it as the `image` value in your profile.

   ```json/5
   "jaimiesmith": {
      "name": {
        "given": "Jaimie",
        "family": "Smith"
      },
      "image": "image/Cprm03kLbFXkxbzGLI6x.jpg"
    },
   ```

