---
title: Introducing Aurora
subhead: A collaboration between Chrome and open-source web frameworks & tools
authors:
  - shubhie
  - addyosmani
  - houssein
date: 2021-06-15
hero: image/0SXGYLkliuPQY3aSy3zWvdv7RqG2/KvZQXFKIGKEzAjxzf5bF.jpg
alt: Night sky

description: This article introduces Aurora, a Chrome initiative to collaborate closely with open-source frameworks
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - aurora
---

On the Chrome team, we care about user experience and a thriving web ecosystem.
We want users to have the best possible experience on the web, not only with
static documents but also when they use rich, highly-interactive applications.

Open-source tools and frameworks play a large role in enabling developers to
build modern apps for the web, while also supporting good developer experiences.
These frameworks and tools empower companies of all sizes, as well as
individuals building for the web.

We believe that frameworks can also play a big role in helping developers with
key quality aspects such as performance, accessibility, security, mobile
readiness. Instead of asking every developer and site owner to become an expert
in these areas and keep up with the constantly changing best practices, the
framework can support these with baked-in solutions. This empowers developers
and enables them to focus on building product features.

In a nutshell, our vision is that a high bar of UX quality becomes a side effect
of building for the web.

## Aurora: a collaboration between Chrome and open-source web frameworks & tools

For almost two years, we have worked with some of the most popular frameworks
such as Next.js, Nuxt and Angular, working to improve web performance. We've
also funded popular tools and libraries such as Vue, ESLint, webpack. Today, we
are giving this effort a name - **Aurora**.

An aurora is a natural light display that shimmers in the sky. As we are trying
to help user experiences built with frameworks shimmer and shine, we thought
this name was an appropriate choice.

{% Img src="image/0SXGYLkliuPQY3aSy3zWvdv7RqG2/lxaUR7Za1DoQMJuJEZHP.png",
alt="Aurora logo", width="800", height="450" %}

In the coming months, we'll be sharing a lot more detail on Aurora. This is a
collaboration between a small team of Chrome engineers (internally codenamed
WebSDK) and framework authors. Our goal is to deliver the best user experience
possible for production apps regardless of the browser you're rendering in.

## What is our strategy?

At Google, we've learned a lot while using frameworks and tools to build and
maintain large scale web applications such as Google Search, Maps, Image Search,
Google Photos etc. We discovered how frameworks can play a crucial role in
predictable app quality by providing **strong defaults** and **opinionated
tooling**.

Frameworks have a unique vantage point for influencing both DX and UX as they
span the entire system: the client and the server, the development and
production environments, and they integrate tools such as compiler, bundler,
linter etc.

<figure class="w-figure">
  {% Img src="image/0SXGYLkliuPQY3aSy3zWvdv7RqG2/ARzxz7gjVfJRFwdkzQoS.png", alt="Chart that shows
  common tooling in frameworks", width="800", height="450" %}
  <figcaption class="w-figcaption">
    Common tooling used by framework developers
  </figcaption>
</figure>

When solutions are baked into the framework, teams of developers can use these
solutions and focus their time on what matters most to the product -- shipping
great features for users.

While we work to improve tools that live in every layer of the stack, frameworks
such as Next.js, Nuxt, and Angular CLI, manage every step of an application's
lifecycle. For this reason, and the fact that React adoption is the largest
within the core UI framework ecosystem, most of our optimizations have begun
with proving out in Next.js before expanding to the rest of the ecosystem.

Aurora supports success at scale by bringing solutions to the _right layer_ of
popular tech stacks. By bridging the gap between browsers and frameworks, it
enables high-quality to be a side-effect of building for the web while acting as
a feedback loop to improve the web platform.

{% Aside %}
Check out the [Conformance](/conformance) post to learn more about a key component of
our strategy.
{% endAside %}

## What is our work process?

Our principles for how Aurora bridges browsers and the developer ecosystem are:
humility, curiosity, scientific enquiry and pragmatism. We work with framework
authors on improvements, collaborate with the community and do our due diligence
prior to landing any changes.

{% Img src="image/0SXGYLkliuPQY3aSy3zWvdv7RqG2/QFTQX7npdBsFheXIqbuc.png",
alt="Aurora's partner driven process for improving Core Web Vital metrics",
width="800", height="448" %}

To summarize the steps we take for any new feature we work on:

1. Identify user experience pain in a popular stack, using representative apps.
2. Prototype solutions that address this, with an emphasis on "strong defaults"
   .
3. Verify the feature with another framework stack, to ensure it is adaptable.
4. Validate the feature by experimenting in a few production apps, typically
   with lab testing for performance.
5. Drive design using the RFC process, addressing community feedback.
6. Land the feature in a popular stack, typically behind a flag.
7. Enable the feature in a representative production app to assess quality and
   developer workflow integration.
8. Measure performance improvement by tracking metrics in representative
   production apps that adopted the feature or upgraded.
9. Enable the feature as the default in the stack, so all upgrading users
   benefit.
10. Once proven, work with additional frameworks to land the feature.
11. Identify gaps in the web platform, with a feedback loop.
12. Move onto the next problems.

The underlying tools and plugins (webpack, Babel, ESLint, TypeScript, etc…)
are shared across many frameworks. This helps create ripple effects, even when
contributing to a single framework stack.

Furthermore, the [Chrome Framework
Fund](https://blog.opencollective.com/chromes-framework-of-open-source-investment/)
supports open-source tools and libraries with funding. While we hope that there
is enough overlap in the problems and solution layers to our efforts above to
translate to other frameworks and tools, we know we can do more. To that end, we
want to do our part to ensure libraries and frameworks helping developers
succeed can thrive. That's one reason we will be continuing to invest in the
Chrome Framework Fund. To date, it has supported work towards Webpack 5, Nuxt
and performance and improvements to ESLint.

## What has our work unlocked so far?

Our work has been focused on **foundational optimizations** for resources like
images, JS, CSS, fonts. We've shipped a number of optimizations to improve the
defaults of multiple frameworks, including:

- An Image component in
  [Next.js](https://nextjs.org/docs/basic-features/image-optimization) that
  encapsulates best practices for image loading, followed by a collaboration
  with [Nuxt](https://image.nuxtjs.org/) on the same. Use of this component
  has resulted in significant improvements to paint times and layout shift
  (example: 57% reduction in Largest Contentful Paint and 100% reduction in
  Cumulative Layout Shift on
  [nextjs.org/give](https://mobile.twitter.com/rauchg/status/1321452444656623616/photo/2)).
- Automated inlining of CSS for Web Font declarations at build time. This
  feature has landed in
  [Angular](https://angular.io/guide/workspace-config#fonts-optimization-options)
  (Google Fonts) and
  [Next.js](https://nextjs.org/docs/basic-features/font-optimization) (Google
  Fonts & Adobe Fonts) resulting in notable improvements to Largest Contentful
  Paint and First Contentful Paint
  ([example](https://twitter.com/griefcode/status/1387746148883050496)).
- Inlining critical CSS using
  [Critters](https://github.com/GoogleChromeLabs/critters) in both
  [Angular](https://angular.io/guide/workspace-config#styles-optimization-options)
  and Next.js to reduce paint times. Resulted in a 20-30 point improvement in
  Lighthouse performance scores in a typical, large-scale Angular app when this
  was combined with font CSS inlining feature.
- Out-of-the-box [ESLint support](https://nextjs.org/docs/basic-features/eslint)
  in Next.js that includes a custom plugin and shareable configuration to make
  it easier to catch common framework-specific issues at build-time, resulting
  in more predictable loading performance.
- An introduction of a built-in performance relayer in [Create React
  App](https://create-react-app.dev/docs/measuring-performance/) and
  [Next.js](https://nextjs.org/docs/advanced-features/measuring-performance) to
  allow easier insight into page performance through web vitals and other custom
  metrics.
- [Granular chunking](/granular-chunking-nextjs/) shipped in Next.js and Gatsby,
  resulting in 30 to 70 percent reduction in bundle sizes while improving caching
  performance. This has become the default in Webpack 5.
- A separate [polyfill
  chunk](https://github.com/vercel/next.js/pull/10212#issue-365945853) for older
  browsers, in collaboration with the Next.js team, to improve bundle size in modern
  browsers.

Every one of these features have either been automated to be enabled by default
or only need a simple opt-in. This is essential to ensure that developers can
easily reap their benefits without adding complexity to their workflow.

## What are we planning for 2021?

Through the rest of this year, we will be focused on helping framework stacks
improve user experience and how well they perform on metrics such as the Core
Web Vitals. This work will include:

- Conformance for enforcing best practices. Check out the [blog post](/conformance) to
  learn more.
- Optimizing initial load performance by building on our collaborations to optimize
  [Images](https://nextjs.org/blog/next-10#built-in-image-component-and-automatic-image-optimization),
  [Fonts](https://nextjs.org/blog/next-10-2#automatic-webfont-optimization) and [Critical
  CSS](https://angular.io/guide/workspace-config#optimization-configuration).
- Loading third-party scripts (3Ps) with minimal perf impact by building on our foundation of work
  on a [Script](https://nextjs.org/docs/basic-features/script) component and performing deep
  research into how best to order and sequence 3Ps.
- JavaScript performance at scale (e.g. supporting [React Server
  Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)
  in Next.js).

Our team will aim to post more regular information on RFCs and design docs for
these ideas so that any framework or developer that wishes to follow along can
do so.

## Conclusion

The Aurora team ([Shubhie](https://github.com/spanicker),
[Houssein](https://github.com/housseindjirdeh),
[Alex](https://github.com/atcastle), [Gerald](https://github.com/devknoll),
[Ralph](https://github.com/janicklas-ralph),
[Addy](https://github.com/addyosmani)) look forward to continuing to work
closely with the open-source framework community on improving user experience
defaults in Next.js, Nuxt and Angular. We'll be growing our engagement to cover
even more frameworks and tools over time. Watch this space for more blog posts,
talks and RFCs from our team over the coming year :)
