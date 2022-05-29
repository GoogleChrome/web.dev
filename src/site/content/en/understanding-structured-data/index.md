---
layout: post
title: Understanding structured data
authors:
    - bendevjunior
description: 
    Let's understand a little about structured data and its function and importance for a website.
date: 2022-28-05
tags: 
  - blog
  - html
  - javascript
---

Let's understand a little about structured data and its function and importance for a website.


Let's start with the understanding that Google uses structured data to understand the content of your website, I'll put an example: Let's imagine that your website is a news portal with daily news as you would do for the search tools index your site as a news portal? Well, structured data and the answer.


There are a few ways you can structure the site, especially having a semantic site ( [I talk a little bit about web semantics on my website](https://blog.bendevoficial.com/posts/conceitos-importantes-sobre-html)), and one of them, but you can also use another method which is basically you provide it in a clear way so that Google Search understands what your site is about, this way it will be much simpler for Google to index your content.


Structured data they use vocabularies in this case one of the most famous and recommended by google and schema.org, I won't go into schema.org too deep but understand that it is a collaborative service that we use to structure this information, but Google created a gallery with available content and examples of structured code that Google supports that we call [Rich Results](https://developers.google.com/search/docs/advanced/structured-data/article) and we will explore it in this article, if you want something more advanced send me on twitter and I'll create another one with advanced content.


What ways to create structured data?

-   JSON-LD
  
-   Microdados
  
-   RDFa
  


Let's explore each one a little and let's start with the JSON-LD which is more recommended by Google itself to use.

## JSON-LD

JSON-LD and a notation that we incorporated inside a `<script></script>` tag we will use it soon after, the advantage of this is that Google can understand and read the data and can be dynamically injected into the page, thus facilitating understanding , it is worth mentioning that the user cannot view the JSON-LD so to use it is very practical because you can demarcate and make it simpler for Google to understand..

## Microdados

Microdata like JSON-LD or microdata is open community, it's an HTML specification used to define more specific data, which will be more like RD, which we'll use as talk-at-a-time attributes to combine the data.

## RDFa

RDFa it is an extension of HTML it is compatible with linked data that is different from JSON-LD that the user would not see the markup here it would already be more visible to him, we usually use RDFa in the header but it can also be used in the body depends on how will work.

## Exemplo

I'm going to show you some ways to use it, but I want to leave the Google documentation and results gallery here for you to access, remembering that on schema.org you can see a little more about each attribute that we're going to use.


I want to show an example of what structured data in an article would look like, but first let's understand what makes up an article ok? an article it would consist of:

-   Title
  
-   Images
  
-   Date it was published
  
-   Last change date
  
-   Author
  
-   The vehicle responsible for the publication.
  


Now that we have the information what would that look like in structured data using JSON-LD markup?
```js

<script type="application/ld+json">
       {
           "@context": "https://schema.org",
           "@type": "NewsArticle",
           "mainEntityOfPage": {
               "@type": "WebPage",
               "@id": "https://web.dev/entendendo-dados-estruturados"
            },
            "headline": "Entendendo dados estruturados ",
            "image": [
                "https://example.com/photos/1x1/photo.jpg",
            ],
            "datePublished": "2022-05-28T14:00:00+08:00",
            "dateModified": "2022-05-28T14:14:00+08:00",
            "author": {
                "@type": "Person",
                "name": "Bendev Junior",
                "url": "https://bendevoficial.com"
            },
            "publisher": {
                @type": "Organization",
                "name": "web.dev",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://google.com/logo.jpg"
                 }
           }
       }
</script>
```


In the example above we basically defined our structured data and let's understand it now, we had defined that an article basically has: **Title, Images, Date published, Date of last change, author, The vehicle responsible for the Publication**. Taking this into account, we represent all this information in this markup, it is worth remembering that the type needs to be defined in the `<script>` tag so that it understands that it is a markup language as I did above defining it as `type="application/ld+ json"`.


Let's understand a little bit what we did, in basically we created an objective that has as context which is defined in the @Context that you see in the first line of the object `"@context": "https://schema.org",` that basically we define that it will use the shema.org tags as I've been talking, right after we instantiate parameters that the shema has documentation of all including the type we use in `"@type": "NewsArticle"` you can enter and search is basically put url + type example: [schema.org/NewsArticle,](https://schema.org/NewsArticle) you will enter the official page and see all the parameters available in a news article such as the headline we use to the title, or the author that we must pass if it is an organization or a person that is also structured data, so Google can map and understand your site.


This is just an example you can use in [Google Search Results Gallery](https://developers.google.com/search/docs/advanced/structured-data/article) there are several remembering that in [shema. org](shema.org) also has information about each data that can be used.


Twitter: [@bendevoficial ](https://twitter.com/bendevoficial)
