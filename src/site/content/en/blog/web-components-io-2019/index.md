---
title: "Web components: the secret ingredient helping power the web"
subhead: Web components at I/O 2019
authors:
  - arthurevans
date: 2019-06-18
hero: image/admin/WPxFy8Y2JsLcTD9xKHIH.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: A wooden spoon, full of salt.
description: |
  This post sums up a talk on the state of web components in 2019,
  given by Kevin Schaaf of the Polymer Project and Caridy Patiño of Salesforce.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - web-components
---


At Google I/O 2019, Kevin Schaaf of the Polymer Project and Caridy Patiño of Salesforce talked about the state of web components.

{% YouTube 'YBwgkr_Sbx0' %}

## How popular are web components?

If you've used the web today, you've probably used web components. By our count, somewhere between 5% and 8% of all page loads today use one or more web components. That makes web components one of the most successful new web platform features shipped in the last five years.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/admin/RYVwr119hwQIps5UL0u4.png", alt="A graph showing that 8% of sites use v1 custom elements. This figure eclipses the 5% highpoint for v0 custom elements.", width="800", height="493", class="w-screenshot" %}
</figure>

You can find web components on sites you probably use every day, like YouTube and GitHub. They're also used on many news and publishing sites built with [AMP](http://amp.dev)—AMP components are also web components. And many enterprises are also adopting web components.


## What are web components?

So what are web components? The web components specifications provide a low-level set of APIs that let you extend the browser's built-in set of HTML tags. Web components provide:

*   A common method for creating a component (using standard DOM APIs).
*   A common way of receiving and sending data (using properties/events).

Outside of that standard interface, the standards don't say anything about how a component is actually implemented:

*   What rendering engine it uses to create its DOM.
*   How it updates itself based on changes to its properties or attributes.

In other words, web components  tell the browser <strong>when</strong> and <strong>where</strong> to make a component, but not <strong>how</strong>.

Authors can choose functional rendering patterns just like React to build their web components, or they can use declarative templates like you might find in Angular or Vue. As an author you have total freedom to choose the technology you use inside the component, while still maintaining interoperability.


## What are web components good for?

The key difference between web components and proprietary component systems is  **interoperability**. Because of their standard interface, you can use web components anywhere you'd use a built-in element like `<input>` or `<video>`.

Because they can be expressed as real HTML, they can be rendered by all the popular frameworks. So your components can be consumed more widely, in a more diverse range of applications, without locking users into any one framework.

And because the component interface is standard, web components implemented using different libraries can be mixed on the same page. This fact helps future-proof your applications when you update your tech stack. Instead of a giant step-change between one framework and another, where you replace all of your components, you can update your components one at a time.


## Who's using web components?

So for all of these reasons, Web Components are actually finding huge success in a variety of different use cases. Three use cases have been especially popular: content sites, design systems, and enterprise applications.


### Content sites

Web components are the perfect technology for progressively enhancing content, because they can already be output as standard HTML by an untold number of CMS systems.



AMP is a great example of how quickly and easily Web Components slotted into the publishing industry's infrastructure for serving content.


### Design systems

More and more companies are unifying the way they present themselves using a design system—a set of components and guidelines that define the common look and feel for an organization's sites and applications. Web components are a great fit here, too.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/admin/xFG8pvgZDYTWQvx4W5i2.png", alt="The material design homepage, https://material.io.", width="800", height="736" %}
</figure>

Often, designers have to contend with many teams building their own versions of the design system components on top of React, Angular, and all the other frameworks, instead of having a single set of canonical components.

Web components are the answer—a truly write once, run everywhere component system that still gives app teams freedom to use the framework of their choice

Companies like ING, EA, and Google are implementing their company's design language in web components.


### Enterprise: Web components at Salesforce

Web components are also hitting a remarkable stride inside enterprises as a safe, future-proof technology to standardize on. Caridy Patiño, architect for Salesforce's UI platform, explained why they built their UI platform using web components.

Salesforce is a collection of applications—many of which came from acquisitions. Each of these may run on its own technology stack. Because they're built on different stacks, it's hard to give them all the same look and feel. In addition, Salesforce enables customers to build their own custom applications using the Salesforce platform. So ideally the components should be usable by outside developers, too.

Salesforce identified a set of needs from customers of their platform:

*   Standard, rather than proprietary solutions—so it's easier to find experienced developers, and quicker to ramp up new developers.
*   A common component model—so customizing any Salesforce application works the same way.

They also identified some things customers _didn't_ want:

*   Breaking changes on their components and apps. In other words, backwards compatibility was a must.
*   Being stuck with old technology, and unable to evolve.
*   Being stuck inside a walled garden.

Using web components as the basis for the new UI platform met all of these needs, and the result is the new [Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/lwc).


## Get started with web components

There are a lot of great ways to get started with web components.

If you're building a web app, consider using some of the many off-the-shelf web components available. Here are just a few examples:


*   Google vends its own Material design system as web components: [Material Web Components](https://github.com/material-components/material-components-web-components).
*   The [Wired Elements](https://wiredjs.com/) are a cool set of web components that feature a sketchy, hand-drawn look.
*   There are great special-purpose Web Components like [<model-viewer>](https://github.com/GoogleWebComponents/model-viewer), which you can drop into any app to add 3D content.

If you're developing a design system for your company, or you're vending a single component or library that you want to be usable in any environment, consider authoring your components using web components. You can use the built-in web components APIs, but they're pretty low-level, so there are a number of libraries available to make the process easier.

To get started building your own components, you can check out LitElement, a web component base class developed by Google that has a great functional rendering experience similar to React.

{% Glitch {
  id: 'lit-element-simple',
  path: 'my-component.js',
  previewSize: 0
} %}

Other tools and libraries to consider:



*   [Stencil](https://stenciljs.com/) is a web-components-first framework. It includes several popular framework features, like JSX and TypeScript
*   [Angular Elements](https://angular.io/guide/elements) provides a way to wrap Angular components as web components.
*   Vue.js [web component wrapper](https://github.com/vuejs/vue-web-component-wrapper) provides a way to package Vue components as web components.

More resources:



*   [open-wc.org](https://open-wc.org/) features great getting started information, as well as tips and default configurations for build and development tooling.
*   [Web Fundamentals](https://developers.google.com/web/fundamentals/web-components/) provides primers on the basic web components APIs, and best practices for designing web components.
*   [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components) provides reference docs for the web components APIs, plus some tutorials. \

_Hero image by Jason Tuinstra on Unsplash._

_Editor's note: The custom elements usage chart has been updated to show the
full monthly usage data, as reported on
[chromestatus.com](http://chromestatus.com). A previous version of this post
included a graph at a 6-month granularity, without the most recent months. The
V0 & V1 series in the original chart were stacked; they are now shown unstacked
with a total line to remove ambiguity. The abrupt jump in late 2017 is due to a
change in the data collection system for chromestatus.com. This change affected
the stats for all web platform features and resulted in more accurate
measurements going forward._
