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
     bio:
       en: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed mollis ipsum. Morbi porta hendrerit neque, eu pretium enim pulvinar vel. Aliquam in leo eu est rutrum tincidunt et ac arcu. Vestibulum nec lorem ut elit tincidunt faucibus sit amet aliquam arcu. Nulla vestibulum fermentum velit, id rhoncus dui blandit vel.
   ```

   You can add multiple paragraphs to your author bio. 

   ```yml
   authorslug:
     title:
       en: Full Name
     description:
       en: A relevant description about yourself you'd like to share.
     bio:
       en:
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed mollis ipsum. Morbi porta hendrerit neque, eu pretium enim pulvinar vel. Aliquam in leo eu est rutrum tincidunt et ac arcu. Vestibulum nec lorem ut elit tincidunt faucibus sit amet aliquam arcu. Nulla vestibulum fermentum velit, id rhoncus dui blandit vel.
        - Aliquam eu lorem ac orci consequat faucibus. Cras in orci maximus justo lobortis mollis. Nam volutpat dictum quam. Integer vitae tincidunt est. Quisque fermentum eget lectus a vulputate. Nam blandit urna sed magna lobortis, feugiat volutpat lacus scelerisque.
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
     bio:
       en: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed mollis ipsum. Morbi porta hendrerit neque, eu pretium enim pulvinar vel. Aliquam in leo eu est rutrum tincidunt et ac arcu. Vestibulum nec lorem ut elit tincidunt faucibus sit amet aliquam arcu. Nulla vestibulum fermentum velit, id rhoncus dui blandit vel.
       es: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed mollis ipsum. Morbi porta hendrerit neque, eu pretium enim pulvinar vel. Aliquam in leo eu est rutrum tincidunt et ac arcu. Vestibulum nec lorem ut elit tincidunt faucibus sit amet aliquam arcu. Nulla vestibulum fermentum velit, id rhoncus dui blandit vel.
   ```

2. If you want links to your online accounts to appear in your author lockup add a new object to [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json) with the following structure. Make sure to use the same author slug used in the [`authors.yml`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/i18n/authors.yml).

   ```json
   "paulkinlan": {
     "homepage": "https://paul.kinlan.me/",
     "twitter": "paul_kinlan",
     "github": "PaulKinlan",
     "glitch": "PaulKinlan",
     "dcc": "paulkinlan",
     "mastodon": "https://status.kinlan.me/@paul",
     "linkedin": "https://uk.linkedin.com/in/paulkinlan"
   },
   ```

## Create a profile image

1. Follow the [Images and video](/handbook/markup-media/) guide to upload your photo to the CDN.

2. The image uploader will return a shortcode. Copy the `src` value from the
   shortcode and use it as the `image` value in your profile in the [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json).

   ```json
   "paulkinlan": {
     "homepage": "https://paul.kinlan.me/",
     "twitter": "paul_kinlan",
     "github": "PaulKinlan",
     "glitch": "PaulKinlan",
     "dcc": "paulkinlan",
     "mastodon": "https://status.kinlan.me/@paul",
     "linkedin": "https://uk.linkedin.com/in/paulkinlan",
     "image": "image/T4FyVKpzu4WKF1kBNvXepbi08t52/0O1ZGr2P0l9oTKabyUK5.jpeg"
    }
   ```

  <figure>
    {% Img src="image/SZHNhsfjU9RbCestTGZU6N7JEWs1/WtrUKbg3m1QMimf7qHB3.png", alt="Screenshot of an author lockup", width="640", height="500" %}
  </figure>
