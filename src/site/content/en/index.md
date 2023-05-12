---
layout: 'homepage'
title: 'web.dev'
intro:
  eyebrow: 'Brought to you by the Chrome DevRel team'
  title: "Building a better web, together"
  summary: |
    Guidance to build modern web experiences that work on any browser.
  buttonText: 'About web.dev'
  buttonUrl: '/about/'
  image: 'https://web-dev.imgix.net/image/jxu1OdD7LKOGIDU7jURMpSH2lyK2/zrBPJq27O4Hs8haszVnK.svg'
  imageWidth: '333'
  imageHeight: '240'

featuredCard:
  eyebrow: ''
  title: '&nbsp; Top web things from <br>&nbsp; Google I/O.'
  background: 'image/kheDArv5csY6rvQUJDbWRscckLr1/4i7JstVZvgTFk9dxCe4a.svg'
  url: 'https://www.youtube.com/watch?v=gkAYHomO5Hg&list=PLOU2XLYxmsIJGxIV8Lt8gF_79Z334LQ6h'
  image: '.'
  alt: '.'
  theme: 'light'

pickedCaseStudyUrl: '/mishipay/'

platformNews:
  title: Web platform news
  subTitle: Keep up to date with the latest news from the major browser engines.
  pickedLeft:
    url: '/introducing-baseline/'
  pickedRight:
    url: '/web-platform-04-2023/'

themes:
  - category: CSS and UI
    cards:
      - latestPostByTags:
          - css
          - javascript
          - html
          - dom
        cardLayout: 'vertical'
      - title: 'The CSS Podcast'
        description: Follow Una Kravets and Adam Argyle, Developer Advocates from Google, who gleefully breakdown complex aspects of CSS into digestible episodes covering everything from accessibility to z-index.
        thumbnail: image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png
        eyebrow:
          icon: podcast
          text: Podcast
        cardLayout: 'horizontal'
        theme: 'tertiary'
        column: '2'
        url: https://pod.link/thecsspodcast/
      - url: /building-a-tooltip-component/
        eyebrow:
          icon: blog
          text: Blog
      - url: /learn/css/
        title: Learn CSS
        description: Learn modern CSS in our course covering everything from selectors to grid layout and animation.
        eyebrow:
          icon: mortarboard
          text: Learn
        cardLayout: 'vertical'
        column: '3'
        row: '2'
      - title: Aspect ratio image card
        description: With the aspect-ratio property, as you resize the card, the green visual block maintains this 16 x 9 aspect ratio.
        eyebrow:
          icon: pattern
          text: Featured pattern
        theme: 'quaternary'
        url: /patterns/layout/aspect-ratio-image-card/
      - url: /viewport-units/
        eyebrow:
          icon: news
          text: Newly interoperable
      - url: /building-chrometober/
        eyebrow:
          icon: blog
          text: Case study
        cardLayout: 'horizontal'
        column: '1'
      - url: /speedy-css-tip-animated-gradient-text/
        eyebrow:
          icon: blog
          text: Blog
        description: Make an animated gradient text effect with scoped custom properties and background-clip.

  - category: Performance
    cards:
      - url: /inp-cwv/
        eyebrow:
          icon: featured
          text: Featured
        cardLayout: vertical
        column: '1'
        theme: dark
      - title: How to Optimize INP
        description: Learn how to optimize for the Interaction to Next Paint metric.
        eyebrow:
          icon: pattern
          text: Pattern
        url: /how-to-optimize-inp/
        cardLayout: horizontal
        column: '2'
      - url: /top-cwv-2023/
        eyebrow:
          icon: blog
          text: Blog
      - url: /debug-cwvs-with-web-vitals-extension/
        eyebrow:
          icon: blog
          text: Blog

  - category: Web Apps
    cards:
      - url: /learn/pwa/
        eyebrow:
          icon: featured
          text: Featured
        cardLayout: vertical
        column: '1'
      - url: /transformstream/
        description: Now that transform streams are supported in Chrome, Safari, and Firefox, they're finally ready for prime time!
        eyebrow:
          icon: news
          text: Newly interoperable
      - title: Project Fugu API Showcase
        description: A list of sites filtered by the specific Capabilities APIs that they use.
        eyebrow:
          icon: news
          text: On Chrome Developers
        url: https://developer.chrome.com/blog/fugu-showcase/
      - url: /new-patterns-for-amazing-apps/
        eyebrow:
          icon: pattern
          text: Patterns
        cardLayout: horizontal
        column: '2'
        theme: blue

  - category: Accessibility
    cards:
      - url: /community-highlight-elisa/
        eyebrow:
          icon: blog
          text: Blog
        cardLayout: vertical
        column: '1'
        theme: pink
      - title: Learn Accessibility
        description: Our brand new course is a great entry-point and reference for key accessibility topics.
        eyebrow:
          icon: mortarboard
          text: Learn
        cardLayout: horizontal
        column: '2'
        url: /learn/accessibility/
      - url: /testing-web-design-color-contrast/
        eyebrow:
          icon: blog
          text: Blog
      - url: /website-navigation/
        eyebrow:
          icon: blog
          text: Blog

  - category: Payments and Identity
    cards:
      - url: /payment-and-address-form-best-practices/
        eyebrow:
          icon: featured
          text: Featured
        cardLayout: vertical
      - url: /passkey-registration/
        eyebrow:
          icon: blog
          text: Blog
      - url: /passkey-form-autofill/
        eyebrow:
          icon: blog
          text: Blog
      - url: /web-payments-overview/
        thumbnail: image/SZHNhsfjU9RbCestTGZU6N7JEWs1/HnOjEdC3jd3ozeEFFWvb.png
        eyebrow:
          icon: blog
          text: Overview
        cardLayout: horizontal
        theme: quaternary
        column: '2'

  - category: Ecosystem and community
    cards:
      - url: /advancing-framework-ecosystem-cds-2019/
        eyebrow:
          icon: featured
          text: Featured
        cardLayout: vertical
        theme: blue
      - title: Aurora Project
        description: A collaboration between Chrome and open-source web frameworks and tools.
        eyebrow:
          icon: blog
          text: On Chrome Developers
        thumbnail: image/0SXGYLkliuPQY3aSy3zWvdv7RqG2/KvZQXFKIGKEzAjxzf5bF.jpg
        url: https://developer.chrome.com/tags/aurora-project/
        cardLayout: horizontal
        column: '2'
      - url: /gde-focus-lars-knudsen/
        eyebrow:
          icon: blog
          text: Community
      - title: Meet the Chrome team
        description: We're meeting you where you are. Join us at upcoming web conferences in your region or catch up on past events.
        eyebrow:
          icon: event
          text: On Chrome Developers
        url: https://developer.chrome.com/meet-the-team/

developers:
  title: 'Check out new web platform features from Chrome'
  summary: |
    Visit <a href="https://developer.chrome.com/">Chrome Developers</a> for all the new and experimental things happening on the web as well as documentation for tools such as Workbox, Lighthouse, Chrome DevTools, and more.
  primaryButtonText: 'Chrome Developers'
  primaryButtonUrl: 'https://developer.chrome.com/'
---
