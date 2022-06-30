---
layout: post
title: "The end of Internet Explorer"
subhead: >
  What ending support for Internet Explorer meant for the customers and developers at Maersk.com. 
description: >
  What ending support for Internet Explorer meant for the customers and developers at Maersk.com.
date: 2022-07-01
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/4TgI61hOlKOSFv7qnkRr.jpg
alt: A sign reading End.
authors:
  - steveworkman
tags:
  - blog
---

I'm Steve Workman and I'm the Lead Engineer for Maersk.com. Maersk is the global leader in integrated supply chain logistics, helping customers to move goods around the world for 118 years, with bookings online for over twenty years. At the start of May 2022, [@Maersk](https://twitter.com/Maersk) officially stopped supporting Internet Explorer (IE) on its customer-facing systems, off the back of Microsoft formally ending support for IE in June, 2022. This is the end of one important era of the web, and the start of a new one.

I joined Maersk in 2018, and my first project was to build a new global navigation bar. It had to be fully testable, easy to deploy and update globally without downtime, be mobile-first, responsive, support multiple brands, be configurable, localised into 11 languages… and support IE9.

In 2018, Windows 7, and its default browser IE9, were still very popular, with Windows 10 and IE11 only reaching critical mass in early 2020 (according to stats counter). Looking at our data, we found a significant amount of trade coming from customers using IE9, or worse, IE11 in compatibility mode. This traffic was significantly slanted towards emerging markets and in areas where Maersk's customer base was growing rapidly.

If the navigation menu doesn't work, it's hard to find the login button. If login doesn't work, they can't book containers, and suddenly you have a big problem, caused by legacy browsers.

To solve this we took a progressive enhancement stance with the navigation component and all future web apps. We'd make it "work" but there may be significant polyfills and restrictions to do that - for example, IE doesn't support the [Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) API, but there are polyfills that go back to IE10 that we include for those browsers. For IE9, we coded XMLHttpRequest calls in a separate file, to be loaded only in cases where `fetch` couldn't be polyfilled.

When it came time to drop IE9 support, when only a handful of customers remained, we were able to simply drop this code from our applications, with minimal effort and maximum benefit to our users on modern browsers.

As Maersk's digital transformation continued, we rebuilt many parts of the site in VueJS powered micro-front-ends. Vue had a lot of features that made it future friendly, with a great preset configuration for advanced tree-shaking and bundle optimisation, to a [modern mode](https://cli.vuejs.org/guide/browser-compatibility.html#modern-mode) where two versions of the application are built—one that uses the latest ES Module syntax for evergreen browsers, and one for legacy applications that don't understand ES6 modules. This legacy version is served to browsers such as IE and is often 100KB larger in its gzipped polyfill bundle simply from the amount of features that the browser is missing.

We found we could also use most of the modern CSS layout techniques such as CSS grid thanks to Microsoft having started the spec way back in IE10. With the help of [autoprefixer](https://github.com/postcss/autoprefixer), and [this CSS Tricks article](https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/) to help us get really good at naming different areas of a page, we had a layout system that is lightweight, suitable for any project and extremely flexible. Still, there were compatibility issues that cost a lot of time to fix.

Suddenly we're back at the cost/benefit analysis stage, but for any version of IE this time, and just like with IE9, it's a big money decision. Confident that using a modern browser is a better experience for our customers, we nudged our users away from IE when they visited the website. We found that this was successful in small amounts for active customers who had got into the habit of opening IE for their interactions with us. This message was good, but not quite enough to make the maths work.

As visits from IE trailed off slowly, Maersk decided to follow the lead of many others before them and end official support for IE, even though the numbers still say that we should be supporting it. So, why now?


<figure>

  {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/LdJ381qMIfLBNGANmtsv.png", alt="A website with a horizontal navigation bar.", width="800", height="320" %}
  <figcaption>Maersk's homepage with the global navigation component.</figcaption>
</figure>

Simply put, the web platform has moved on, and IE11 cannot do the things we need it to do, even with a small army of polyfills. Take the navigation component—in a modern web platform world this is a custom element, with its own encapsulated styles, driven by CSS variables and container queries so it controls everything in one component. Without these pieces of the platform, the style of these components can be completely changed from the application, and styles can leak to other components or back to the application. There are polyfills that will let you emulate most of the features here, including [custom elements](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements), [ShadyCSS](https://github.com/webcomponents/polyfills/tree/master/packages/shadycss), [ShadyDOM](https://github.com/webcomponents/polyfills/tree/master/packages/shadydom), and the [template](https://github.com/webcomponents/polyfills/tree/master/packages/template) element.

In practice, these polyfills work great for isolated components—but when combining multiple components in a complex application, IE grinds to a halt with tens of seconds of white screen while the JavaScript runtime tries to calculate the style tree for the forty-second time. In short, the user experience was severely compromised to support the browser.

In the past, we had small interruptions—polyfills that might add half a second to first paint, but not much more. This was different, and these apps became unusable. Polyfills can only do so much when challenged with the complexity of the modern web platform.

And you know what's happened since we dropped IE support? Very, very little. There has been no avalanche of customer support tickets, or negative feedback. Our engineers are happier and our applications have an upgrade path to Vue 3 (which [doesn't support IE11](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md) as the Proxy object can't be polyfilled) and smaller bundle sizes. Full support for CSS variables and variable fonts allows for simpler theming across brands, and the ability to use the tokens within Vue's single file components also reduces cognitive complexity, making a better developer experience.

From a customer perspective, usage of IE continues to decline slowly. IE has not been shut off from the site, but as progressive enhancement turns into graceful degradation, features and applications will stop working. Customers will gain from the advances in our technology—getting a more consistent experience from the site as best practices, accessibility and design are baked into an evolving [Lit](https://lit.dev/)-based design system, with full interoperability to any framework that is around now, or in the future.

I'm excited to see how the new web platform features can be used within the company—from making use of dark mode so that vessel systems are easier to use at night, to Web Bluetooth, WebXR and PWAs so that our web apps can interact with the physical world around us in any conditions. Thank you, Internet Explorer, for many things; we're now free to catch up with the web platform.

_Hero image by [Matt Botsford](https://unsplash.com/@mattbotsford)._
