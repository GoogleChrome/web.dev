---
layout: post
title: "web.dev engineering blog #1: How we build the site and use Web Components"
date: 2020-04-09
authors:
  - samthor
description: |
  In this first post from the web.dev engineering team, learn about how we build the site—including
  our use of Eleventy and Web Components.
hero: image/admin/TzR3470Au1W5XGK2BH5M.jpg
alt: Wind turbines on a hill
tags:
- blog # to show up in blog
- engineering-blog
---

This is the first post in web.dev's engineering blog.
Over the coming months, we hope to share actionable insights from our work—so watch for posts with the [Engineering Blog tag](/tags/engineering-blog/)!
Here we'll be covering the build process for our static site and the (optional!) JavaScript behind our web components.

web.dev provides content about building modern web experiences and allows you to [measure](/measure/) your site's performance.
Savvy users may have realized that [our Measure page](/measure/) is just an interface for [Lighthouse](https://developers.google.com/web/tools/lighthouse), which is also available in Chrome's DevTools.
Signing in to web.dev lets you run regular Lighthouse audits on your site so you can see how its score changes over time.
I'll be revisiting the Measure page a bit later, as we think it's fairly special. 🎊

## Introduction

Fundamentally, web.dev is a static site that is generated from a collection of Markdown files.
We've chosen to use [Eleventy](https://www.11ty.dev/) because it's a polished, extensible tool which makes it easy to turn Markdown into HTML.

We also use modern JavaScript bundles that we only serve to browsers supporting [`type="module"`](https://medium.com/dev-channel/es6-modules-in-chrome-canary-m60-ba588dfb8ab7), which includes `async` and `await`.
We also happily use features that are supported by evergreen browsers but not by a minority of older versions.
Because we're a static site, JavaScript is _just not required_ to read our content.

Once the build process—which involves generating static HTML and bundling our JavaScript with Rollup—is complete, web.dev can be hosted with a simple static server for testing.
The site is _almost_ completely static, but we have a few special needs that still benefit from [a custom Node.js server](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/server.js).
These include redirects for invalid domains, as well as code [to parse a user's preferred language](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/locale-handler.js) for an upcoming internationalization feature.

{% Aside %}
Despite being a Google product, web.dev doesn't use any internal Google tools or processes.
You can check out [our repo](https://github.com/GoogleChrome/web.dev).
We do this because the team that builds and maintains web.dev is responsible for advocating
within Google on behalf of the broader web developer ecosystem so it makes more sense for us
to have the same tools as external web developers.
{% endAside %}

## Static generation

Each page on web.dev is written in Markdown.
All pages include [front matter](https://www.11ty.dev/docs/data-frontmatter/), which describes metadata about each post.
This metadata is ingested into the layout of each page, creating headings, tags, and so on.
Here's an example:

```md
---
layout: post
title: What is network reliability and how do you measure it?
authors:
  - jeffposnick
date: 2018-11-05
description: |
  The modern web is enjoyed by a wide swath of people…
---

The modern web is enjoyed by a wide swath of [people](https://www.youtube.com/watch?v=dQw4w9WgXcQ), using a range of different devices and types of network connections.

Your creations can reach users all across the world...
```

This front matter lets us define arbitrary properties like author(s), publish date, and tags.
Eleventy conveniently exposes the front matter as [data](https://www.11ty.dev/docs/data/) in nearly every plugin, template, or other context where we'd like to do something intelligent.
The data object also contains what Eleventy describes as the [data cascade](https://www.11ty.dev/docs/data-cascade/)—a variety of data pulled from each individual page, from the layout the page uses, and from data found in the hierarchical folder structure.

Each unique layout describes a different type of content and can [inherit](https://www.11ty.dev/docs/layout-chaining/) from _other_ layouts.
On web.dev, we use this feature to correctly frame different types of content (like posts and codelabs) while still sharing one top-level HTML layout.

### Collections

Eleventy provides a programmatic way to build arbitrary collections of content.
This has let us build pagination support and generate virtual pages (pages that don't have a matching Markdown file on disk) for post authors.
For example, we construct our authors pages using a template containing [an expression for its permalink](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/src/site/content/en/authors/index.njk#L4) (so the template is re-rendered for every author) and a backing [collection](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/src/site/_collections/paginated-posts-by-author.js#L23).

This results in, for example, a simple page containing [all of Addy's posts](/authors/addyosmani/)!

### Limitations

Right now we can't easily hook into Eleventy's build process because it's _declarative_, rather than _imperative_: you describe what you want, rather than how you want it.
It's difficult to run Eleventy as part of a larger build tool, as it can only be invoked via its command-line interface.

## Templating

web.dev uses the [Nunjucks](https://mozilla.github.io/nunjucks/) templating system originally developed by Mozilla.
Nunjucks has the typical templating features like loops and conditionals but also lets us define [shortcodes](https://www.11ty.dev/docs/shortcodes/) that generate further HTML or invoke other logic.

Like most teams building static content sites, we started small and added shortcodes over time—about 20 so far.
Most of these just generate further HTML (including our custom web components).
Here's an example:

```text
{% raw %}&#123;% Aside %&#125;
[See how Asides work in the web.dev codebase](/handbook/web-dev-components/#asides)
&#123;% endAside %&#125;{% endraw %}
```

It will end up looking like this:

{% Aside %}
[See how Asides work in the web.dev codebase](/handbook/web-dev-components/#asides)
{% endAside %}

But it's actually creating HTML that looks like this:

```html
<div class="w-aside w-aside--note">
<p><a href="/handbook/web-dev-components/#asides">See how Asides work in the web.dev codebase</a></p>
</div>
```

While out of the scope of this post, web.dev also uses shortcodes as a type of metaprogramming language.
Shortcodes accept arguments, with one of their arguments being the contained content.
It's not required that shortcodes return anything, so they can be used to build up state or trigger some other behavior. 🤔💭

## Scripting

As mentioned before, because web.dev is a static site, it can be served and used without JavaScript and by older browsers that don't support `type="module"` or our other modern code.
This is an incredibly important part of our approach for making web.dev accessible to everyone.

However, our code for modern browsers consists of two major parts:

1. Bootstrap code, which includes code for global state, Analytics, and SPA routing
1. Code and CSS for Web Components which progressively enhance the site

The bootstrap code is fairly straightforward: web.dev can load new pages as a single-page application (SPA), so we install a global listener that listens for clicks on local `<a href="...">` elements.
The SPA model helps us maintain global state about the user's current session, as otherwise every new page load would trigger calls to Firebase to access a user's signed-in state.

We also specify a couple of different [entrypoints](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/src/lib/loader.js#L18) into our site based on which URL you've hit, and load the correct one using dynamic `import()`.
This cuts down on the number of bytes our users need before the site is enhanced with code.

### Web Components

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
are custom elements which encapsulate runtime functionality provided in JavaScript, and are identified by custom names like `<web-codelab>`.
The design lends itself well to largely static sites like web.dev: your browser manages an element's lifecycle as a site's HTML is updated, correctly informing any elements when they are attached or detached from the page.
And antiquated browsers just ignore Web Components altogether and render whatever is left in the DOM.

Each Web Component is a class with methods including `connectedCallback()`, `disconnectedCallback()`, and `attributeChangedCallback()`.
web.dev's custom elements mostly inherit from [LitElement](https://lit-element.polymer-project.org/), which provides a simple base for complex components.

While web.dev uses Web Components on many pages, nowhere is it more necessary than on the [Measure](/measure) page.
Two elements provide the bulk of the functionality you see on this page:

```html
<web-url-chooser-container></web-url-chooser-container>
<web-lighthouse-scores-container></web-lighthouse-scores-container>
```

These elements create further elements which provide more functionality.
Importantly, these elements are just part of [our regular Markdown source code](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/src/site/content/en/measure/index.njk#L33)—and our content team can add extended functionality to _any_ page, not just the Measure node.

Our Web Components most commonly utilize the [Container Component](https://flaviocopes.com/react-presentational-vs-container-components/) model, made popular by React, although this model [is now a bit passé](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
Each `-container` element connects to our global state (provided by [unistore](https://github.com/developit/unistore)), and then renders a visual element, which in turn goes on to render actual DOM nodes that have styling or other built-in functionality.

<figure class="w-figure">
  {% Img src="image/admin/0vvvEFtKSNNvD79QS2i2.png", alt="A diagram that shows the relationship between global state and HTML elements that use it.", width="640", height="220" %}
  <figcaption class="w-figcaption">Global state and a Web Component</figcaption>
</figure>

Our most complex Web Components exist to visualize global actions and state.
For example, web.dev lets you audit your favourite site and then navigate away from the Measure page.
If you return, you'll see that the task is still ongoing.

Our simple components purely enhance otherwise static content or create amazing visualizations (for example, each line graph is its own [`<web-sparkline-chart>`](https://github.com/GoogleChrome/web.dev/blob/2050fe6352e024943195a438841dc99217f34e63/src/lib/components/SparklineChart/index.js)), which has no relationship to the global state.

## Let's chat

The web.dev engineering team ([Rob](https://twitter.com/rob_dodson), [Ewa](https://twitter.com/devnook), [Michael](https://twitter.com/michaelsolati), and [Sam](https://twitter.com/samthor)) will be following up with more technical deep dives soon.

We hope hearing about how we do things gave you some ideas for your own projects.
Hit us up on Twitter if you've got questions or topic requests for this blog!

<!-- Test content change -->
