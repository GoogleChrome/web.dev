---
layout: post
title: How to use AMP in Next.js
authors:
  - houssein
subhead: |
  Add AMP to any of your Next.js pages for  faster loads from search engine results pages
date: 2019-10-17
draft: true
---

[AMP](https://amp.dev) (Accelerated Mobile Pages) is a web component framework that makes it
easy to build fast and performant websites. [Next.js][intro] is a React framework that provides
many performance optimizations by default and supports AMP.

## What will you learn?

This guide first briefly describes how AMP optimizes web pages before covering the two different
ways you can use AMP in a Next.js application.

This guide assumes that you've read web.dev's [introduction to Next.js][intro].

## How AMP optimizes web pages

AMP is a structured HTML framework that provides two important optimizations for web pages:

* **AMP HTML**: A restricted form of regular HTML where developers use a set of custom
  AMP elements in place of some regular HTML tags (for example, `<amp-img>` instead of `<img>`)
* **AMP Cache**: A content cache used by some search engines, such as Google and Bing, that speeds
  up AMP page loads from search engine results pages

Both of these techniques ensure that every AMP site remains performant. However, it's
important to note that there are some restrictions imposed. For example, AMP does not allow
custom synchronous JavaScript. Take a look at [How AMP works](https://amp.dev/about/how-amp-works/)
to learn more about the restrictions and optimizations.

{% Aside %}
  Aside from web pages, AMP also lets you create optimized ads, emails, and web stories.
  [amp.dev](https://amp.dev) provides more information on all the different ways you can
  use the framework.
{% endAside %}

## How you can use AMP in Next.js

By including support for AMP directly within Next.js, you can render any page that you
build as an AMP page. This means that you can use React components in a Next.js codebase
to embed and render valid AMP elements, giving you the performance benefits of both frameworks.

There are two ways to use AMP in Next.js:

* The **Hybrid AMP** approach lets you create an accompanying AMP version of any Next.js page
* The **AMP-first** approach lets you only serve AMP pages

### How to create Hybrid AMP pages

The **Hybrid AMP** approach creates an accompanying AMP version of any Next.js page. The regular
page can always be accessed by your users but search engines will surface the AMP version of
the page instead.

There are multiple ways to configure how Next.js renders and serves pages. Using a `config`
object allows you to modify these on a per-page basis. In order to serve a specific page as
an AMP page, you need to export the `amp` property in the object:

```jsx
import React from 'react'

export const config = { amp: 'hybrid' };

const Home = () => (
  <p>This is the home page</p>
);
  
export default Home;
```

Let's take a look at the following embed as an example:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/next-amp-start?attributionHidden=true&path=pages/index.js"
          alt="A basic Next.js app on Glitch that supports AMP."
          style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

{% Instruction 'remix', 'ol' %}

{% Instruction 'preview', 'ol' %}

1. Add `?amp=1` to the end of the URL. The page looks the same, but if you look in the
   Console you'll see that the AMP version of the page is being rendered.

<figure>
  <img src="hybrid.png"
       alt="The live page and a message in the Chrome DevTools Console stating that the page is 
            powered by AMP.">
  <figcaption>
    The AMP version of the page.
  </figcaption>
</figure>

Since only a single `<p>` tag is being used on the page, there's no visible difference between the
main page and its AMP version. The Hybrid AMP approach is useful when you need to render
AMP-specific components only when the AMP page is loaded.

#### How to conditionally serve AMP components

AMP pages need to have their own set of valid components in place of many HTML elements. It's
important to make sure that they are conditionally served only for the AMP page. Next.js provides a
[hook] called `useAmp` to allow you to conditionally serve different elements depending on whether
the AMP version of the page has loaded.

1. Modify the code so that it renders a different paragraph element to the page depending on whether
   the main version or the AMP version was requested:

   ```jsx/1,5-11
   import React from 'react';
   import { useAmp } from 'next/amp';

   export const config = { amp: 'hybrid' };

   const Home = () => (
     useAmp() ? (
       <p>This is the <strong>AMP</strong> version of the home page</p>
     ) : (
       <p>This is the main version of the home page</p>
     )
   );

   export default Home;
   ```

1. Load the main version of the page:

    <figure>
      <img src="main.png"
           alt="The main version of the page.">
      <figcaption>
        The main version of the page.
      </figcaption>
    </figure>

1. Add `?amp=1` to the end of the URL again to load the AMP version of the page:

    <figure>
      <img src="amp.png"
           alt="The AMP version of the page.">
      <figcaption>
        The AMP version of the page.
      </figcaption>
    </figure>

1. Try using `useAmp` to render AMP's replacement of the image tag, `amp-img`:

    ```jsx/5-27
    import React from 'react';
    import { useAmp } from 'next/amp';

    export const config = { amp: 'hybrid' };

    const imgSrc = 'https://placekitten.com/400/300';

    const Image = () => (
      useAmp() ? (
        <amp-img alt="A cute kitten"
          src={imgSrc}
          width="400"
          height="300"
          layout="responsive">
        </amp-img>
      ) : (
        <img alt="A cute kitten"
          src={imgSrc}
          width="400"
          height="300">
        </img>
      )
    );

    const Home = () => (
      <div>
        <Image />
      </div>
    );

    export default Home;
    ```

TODO start here

    Notice that almost all of the same attributes and values are used for `amp-img` and `img`, but we've
    included an additional `layout` attribute. AMP allows developers to control the layout of elements
    using this single attribute instead of relying on CSS. Using layout="responsive" automatically
    renders a fully responsive image with an aspect ratio specified by width and height.

    {% Aside %}
      Check out [Layout & media queries](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout/)
      to learn more about the supported layouts of AMP elements.
    {% endAside %}

1. View the main version of the page again.

1. View the AMP version of the page again.

With this example, loading the page will render a regular image or an AMP image depending on whether
`?amp=1` is present at the end of the URL:

{% Aside %}
  See [amp-img](https://amp.dev/documentation/examples/components/amp-img/) to learn more about its
  optimizations.
{% endAside %}

### How to create AMP-first pages

Instead of building hybrid AMP pages, Next.js also provides support for building AMP-first pages.
With this approach, a single AMP page is served and rendered to users and search engines at all
times. However, it's important to note that only valid AMP components can be used for this.

To render an AMP-only page, change the value of the `amp` property in the config object to `true`.

```jsx
import React from 'react'

export const config = { amp: true };

const Home = () => (
  <p>This is an AMP-only page</p>
);
  
export default Home;
```

## Next steps

Check out the rest of the guides in web.dev's [Next.js collection][collection] to discover
other ways that you can optimize your Next.js app.

If you want to improve the performance of your Next.js site by leveraging built-in
AMP components or the AMP cache, render some of your pages in AMP.

Determine if you want to keep your Next.js page as-is and just want to roll out a separate version
using AMP. If so, use the hybrid AMP approach. Otherwise, create an AMP-only page within Next.js and
ensure the entire page is made of valid AMP components.

[intro]: /performance-as-a-default-with-nextjs
[layout]: https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout/
[collection]: /react#nextjs
[hook]: https://reactjs.org/docs/hooks-overview.html