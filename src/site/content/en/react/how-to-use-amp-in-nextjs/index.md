---
layout: codelab
title: How to use AMP in Next.js
authors:
  - houssein
subhead: |
  Try out the two ways that you can add AMP to a Next.js app
date: 2019-11-08
glitch: next-amp-start
related_post: how-amp-can-guarantee-fastness-in-your-nextjs-app
---

## What will you learn?

This codelab lets you try out the two ways that you can use AMP in a Next.js app.
Check out [How AMP can guarantee fastness in your Next.js app][guidance] to learn why you
might want to add AMP support to your Next.js app.

### How to create Hybrid AMP pages {: #hybrid }

{% Aside 'caution' %}
  The [AMP-only approach](#amponly) is the recommended path for using AMP with Next.js. The
  Hybrid AMP approach described in this section has a higher maintenance cost than the AMP-only
  approach because it requires you to maintain two versions of each page. You should only use the
  Hybrid approach if you're certain that the AMP-only approach won't work.
{% endAside %}

The **Hybrid AMP** approach creates an accompanying AMP version of any Next.js page. In the past
the Hybrid approach was frequently used when there was an experience on the main version of your
page that AMP couldn't support. The main version had the full experience while the AMP page had
a slightly degraded experience. With the introduction of [amp-script] there's less of a need
for the Hybrid approach, but we'll cover it here just in case you still need it.

There are multiple ways to configure how Next.js renders and serves pages. Using a `config`
object allows you to modify these on a per-page basis. In order to serve a specific page as
an AMP page, you need to export the `amp` property in the object:

```jsx/2
import React from 'react'

export const config = { amp: 'hybrid' };

const Home = () => (
  <p>This is the home page</p>
);
  
export default Home;
```

{% Instruction 'remix', 'ol' %}

{% Instruction 'preview', 'ol' %}

1. Add `?amp=1` to the end of the URL. The page looks the same, but if you look in the
   Console you'll see that the AMP version of the page is being rendered.

<figure class="w-figure">
  <img src="hybrid.png" class="w-screenshot-filled"
       alt="The live page and a message in the Chrome DevTools Console stating that the page is 
            powered by AMP.">
</figure>

Since the page only has a single `<p>` tag, there's no visible difference between the
main page and its AMP version. 

#### How to conditionally serve AMP components

AMP pages need to have their own set of valid components in place of many HTML elements. It's
important to make sure that the AMP components are conditionally served only for the AMP page.
Next.js provides a [hook] called `useAmp` to allow you to conditionally serve different elements
depending on which version of the page was requested.

{% Instruction 'source', 'ol' %}

1. Edit `pages/index.js` so that it renders a different paragraph element to the page depending on whether
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

   <figure class="w-figure">
     <img src="main.png" class="w-screenshot-filled"
          alt="A screenshot of the main version of the page.">
   </figure>

1. Add `?amp=1` to the end of the URL again to load the AMP version of the page:

   <figure class="w-figure">
     <img src="amp.png" class="w-screenshot-filled"
          alt="A screenshot of the AMP version of the page that is displaying different text
               than the main version.">
   </figure>

1. Try rendering AMP's replacement of the image tag, `amp-img`:

   {# TODO(kaycebasques): Line highlighting isn't working with this sample. #}

   ```jsx
   import React from 'react';
   import { useAmp } from 'next/amp';

   export const config = { amp: 'hybrid' };

   const imgSrc = 'https://placekitten.com/1000/1000';

   const Image = () => (
     useAmp() ? (
       <amp-img alt="A cute kitten"
         src={imgSrc}
         width="1000"
         height="1000"
         layout="responsive">
       </amp-img>
     ) : (
       <img alt="A cute kitten"
         src={imgSrc}
         width="1000"
         height="1000">
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

   `layout="responsive"` automatically renders a fully responsive image with an aspect ratio
   specified by width and height. Check out [Layout & media queries][layout] to learn more about
   the supported layouts of AMP elements, and [amp-img] to learn more about that element's
   optimizations.
    
1. View the main version of the page again.

   <figure class="w-figure">
     <img src="mainimg.png" class="w-screenshot-filled"
          alt="A screenshot showing that the image in the main version of the
               page overflows the viewport.">
   </figure>

1. View the AMP version of the page again.

   <figure class="w-figure">
     <img src="ampimg.png" class="w-screenshot-filled"
          alt="A screenshot showing that the image in the AMP version of the page has been
               automatically resized to fit the viewport.">
   </figure>

### How to create AMP-only pages {: #amponly }

Next.js also supports AMP-only pages. With this approach, a single AMP page is served and rendered
to users and search engines at all times.

1. To render an AMP-only page, change the value of the `amp` property in the config object to `true`.

   ```jsx/2
   import React from 'react'

   export const config = { amp: true };

   const Home = () => (
     <p>This is an AMP-only page</p>
   );
     
   export default Home;
   ```

[guidance]: /how-amp-can-guarantee-fastness-in-your-nextjs-app
[layout]: https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout/
[collection]: /react#nextjs
[hook]: https://reactjs.org/docs/hooks-overview.html
[layout]: https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout/
[amp-img]: https://amp.dev/documentation/examples/components/amp-img/
[amp-script]: https://amp.dev/documentation/components/amp-script/