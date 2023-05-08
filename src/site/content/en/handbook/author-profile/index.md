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

## Create a featured card

The featuredPost properties available:
- `title` - the title of the card, like a event's name or a post's title.
- `summary` - a description or short summary.
- `thumbnail` - the thumbnail of the card.
- `eyebrowText` - the keyword to introduce the type of card.
- `eyebrowIcon` - the icon to introduce the type of card, such as mortarboard, pattern, podcast, blog, news, etc. The default value is featured. 
- `url` - the url for the page the card is previewing.
- `alt` - an alt text for image. If no thumbnail is provided, this can be null.
- `theme` - the theme colours of the card. Theme colours available - tertiary, quaternary, pink, dark, and blue. The default theme is quaternary.

1. If you want to set an internal post to be a featured post, copy the post URL and use it as the `url` value for the `featuredPost` key in your profile in the
   [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json). It will automatically fetch the all data from the post URL, but also allow an author to override the detail, such as title, eyebrow, thumbnail, alt, and summary.

   ```json
   "paulkinlan": {
     "homepage": "https://paul.kinlan.me/",
     "twitter": "paul_kinlan",
     "github": "PaulKinlan",
     "glitch": "PaulKinlan",
     "dcc": "paulkinlan",
     "mastodon": "https://status.kinlan.me/@paul",
     "linkedin": "https://uk.linkedin.com/in/paulkinlan",
     "image": "image/T4FyVKpzu4WKF1kBNvXepbi08t52/0O1ZGr2P0l9oTKabyUK5.jpeg",
     "featuredPost": {
      "url": "/googleio22-recap/"
     }
    }
   ```

   <figure>
      {% Img src="image/SZHNhsfjU9RbCestTGZU6N7JEWs1/LMRV7B0SvdX5So1sZG9N.png", alt="the featured post", width="800", height="351" %}
   </figure>

2. If you want to customise the detail of the featured post, you can specify the title, eyebrow, thumbnail, alt, summary, and theme in the [`authorsData.json`](https://github.com/GoogleChrome/web.dev/blob/main/src/site/_data/authorsData.json) with the following structure. 

   ```json
   "paulkinlan": {
     "homepage": "https://paul.kinlan.me/",
     "twitter": "paul_kinlan",
     "github": "PaulKinlan",
     "glitch": "PaulKinlan",
     "dcc": "paulkinlan",
     "mastodon": "https://status.kinlan.me/@paul",
     "linkedin": "https://uk.linkedin.com/in/paulkinlan",
     "image": "image/T4FyVKpzu4WKF1kBNvXepbi08t52/0O1ZGr2P0l9oTKabyUK5.jpeg",
     "featuredPost": {
      "url": "/googleio22-recap/",
      "eyebrowText": "Learn",
      "eyebrowIcon": "mortarboard",
      "title": "A simple TODO list using HTML5 WebDatabases",
      "thumbnail": "image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/9WSNd3mdbXACF19ELKJ1.png",
      "summary": "This tool by Josh W Comeau makes it super simple to create nice looking gradients.",
      "alt": "HTML5 text on the black background",
      "theme": "quaternary"
     }
    }
   ```

   <figure>
      {% Img src="image/SZHNhsfjU9RbCestTGZU6N7JEWs1/vz5H9MlBoD14OCKUzRSg.png", alt="the featured post with customising the detail", width="800", height="356" %}
   </figure>
    
