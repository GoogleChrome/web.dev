---
layout: handbook
title: Authors profile
date: 2019-06-26
updated: 2021-06-21
description: |
  Learn how to create an author profile for web.dev.
---

## Add yourself to the authors list

1. Add a new object to [`authors.yml`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/i18n/authors.yml) with the following structure. Make sure to choose a unique author slug.

   ```yml
   authorslug:
     title:
       en: Full Name
     description:
       en: A relevant description about yourself you'd like to share.
   ```

   You can add multiple titles and descriptions to your author data for each language that is supported by using the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code for that language.

   ```yml
   authorslug:
     title:
       en: Full Name
       es: Nombre completo
     description:
       en: A relevant description about yourself you'd like to share.
       es: Una descripción relevante traducida por Google sobre usted que le gustaría compartir.
   ```

2. If you want links to your online accounts to appear in your author lockup add a new object to [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json) with the following structure. Make sure to use the same author slug used in the [`authors.yml`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/i18n/authors.yml).

   ```json
   "jaimiesmith": {
     "twitter": "jaimiesmith",
     "github": "jaimiesmith",
     "glitch": "jaimiesmith",
     "homepage": "https://jaimiesmithis.cool/",
   },
   ```

## Create a profile image

1. Follow the [Images and video](/handbook/markup-media/) guide to upload your photo to the CDN.

2. The image uploader will return a shortcode. Copy the `src` value from the
   shortcode and use it as the `image` value in your profile in the [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json).

   ```json
   "jaimiesmith": {
     "twitter": "jaimiesmith",
     "github": "jaimiesmith",
     "glitch": "jaimiesmith",
     "homepage": "https://jaimiesmithis.cool/",
     "image": "image/Cprm03kLbFXkxbzGLI6x.jpg",
    }
   ```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wwUATUCfC4NdWk61UmrV.png", alt="Screenshot of an author lockup", width="267", height="95", class="w-screenshot" %}
</figure>
