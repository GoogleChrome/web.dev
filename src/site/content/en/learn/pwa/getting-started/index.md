---
title: Getting started
description: >
  If you want to build a Progressive Web App, you may be wondering where to start, if it's possible to upgrade a website to a PWA without starting from scratch, or how to move from a platform-specific app to a PWA. This article will help you answer these questions.
authors:
  - firt
date: 2021-11-03
updated: 2022-05-16
---

## First steps

Progressive Web Apps are still websites, with enhanced features and capabilities.
They are not attached to a particular technology stack and you can start from scratch with a new site or update your existing website without a complete overhaul.
In this guide you'll learn to create a good implementation of the PWA pattern.
Here are some strategies to get you started:

### Make it installable

Start small! This approach includes beginning with a basic manifest file, a simple offline page, and a service worker to serve the offline page and cache some critical CSS and JavaScript. Thanks to the critical CSS and JavaScript caching, you will get your existing web app ready to work offline while improving its performance.

### Focus on a feature

Pick one new feature—such as push notifications or file handling—that will significantly impact your users or your business. This will allow you to dip your toes into the PWA pool without making too many changes at once.

### Build a simple version

Take an existing section of your application or a specific user journey, like video playback or access to a boarding pass, and make it work front-to-back as an offline-first PWA, either stand-alone or in context. This allows for a low-stakes experiment enabling you to rethink an experience for your users with PWAs.

### Start from the ground up

If you're going through a redesign of your website or can start from scratch, this strategy makes a lot of sense. It enables you to more easily build in PWA design patterns than other strategies, in particular allowing you to take advantage of all the power of service workers from the get-go.

## Upgrading a store app

With the ability to publish a PWA to app stores,
it's possible to wrap your PWA into a PWA launcher and upload it to stores, such as Google's Play Store or Windows Store.
If you have an existing platform-specific app, you can replace it with your PWA published in the store.

With this approach, your existing users get an upgrade of their experiences to the PWA,
and new users can still use or install your PWA from the browser, or the app stores.
And, you will have one app for everyone, saving costs, time and improving user experience.

## PWA checklist

A Progressive Web App is a website, which leads to the question: When does it become a Progressive Web App?
The answer is not so simple, as the PWA concept doesn't refer to a specific technology or stack, PWA is instead a pattern including various technical components.

While there are no unique rules among all browsers, there are a set of recommendations,
called the [Progressive Web App Checklist](/pwa-checklist/), to help you create a PWA that users will love.

### Core requirements

Because PWAs span all devices,
from mobile through desktop,
the core Progressive Web App Checklist is about what you need to do to make your app installable and reliable for _all_ users,
regardless of screen size or input type.

The core requirements are:

#### Starts fast, stays fast

Performance plays a significant role in the success of any online experience, as high-performing sites engage and retain users better than poorly performing ones. Sites should focus on optimizing for user-centric performance metrics.

#### Works in any browser

Progressive Web Apps are web apps first, which means they need to work across browsers, not just in one of them. The experience doesn't have to be identical in all browsers, though. There can be features that aren't supported by one browser, with a fallback to ensure a good experience.

#### Responsive to any screen size

Users can use your PWA on any screen size, and all content is available at any viewport size.

#### Provides a custom offline page

When users are offline, keeping them in your PWA provides a more seamless and native-like experience than dropping back to the default browser offline page.

#### Is installable

Users who install or add apps to their home screens tend to engage with those apps more, and when the PWA is installed it can take advantage of more abilities for a better user experience.

### Optimal PWA characteristics

To create a genuinely great Progressive Web App,
one that feels like a best-in-class app, you need more than just the core checklist.
The optimal Progressive Web App checklist is about making your PWA feel capable and reliable while taking advantage of what makes the web powerful.

#### Provides an offline experience

By allowing users to use your PWA while offline, you'll create an authentic app-like experience for them. Do this by identifying those features that don't require connectivity, so that users can access at least some functionality.

{% Aside 'gotchas' %}
When we say that the PWA should provide an offline experience, it doesn't mean that all the services and content should be available offline. For example a note taking app can't sync its notes when there is no connectivity, but it can allow the users to write the note and sync new changes when they are back online. At the very least you should render the app's user interface with a proper message if your app needs a live connection.
{% endAside %}

#### Is fully accessible

Ensure all the application's content and interactions are understood by screen readers, usable with just a keyboard, that focus is indicated, and color contrast is strong. By making your PWA accessible, you ensure it's usable for everyone.

#### Uses powerful capabilities where available

From push messaging, WASM, and WebGL to file system access, contact pickers, and integration with app stores. The tools to create highly capable, deeply integrated PWAs are here, allowing you to create a fully-featured user experience, previously reserved for platform apps, that your users can take with them wherever they go.

#### Is discoverable through search

More than half of all website traffic comes from organic search. Making sure that canonical URLs exist for content and that search engines can index your site is critical for users to find your PWA.

#### Works with any input type

Users should be able to switch between input types while using your application seamlessly, and input methods should not depend on screen size.

#### Provides context for permission requests

Only trigger prompts for permissions like notifications, geolocation, and credentials, after providing in-context rationale to improve chances of the user accepting the prompts.

#### Follows best practices for healthy code

Keeping your application up-to-date and your codebase healthy makes it easier for you to deliver new features that meet the other goals laid out in this checklist.

{% Aside %}
While the PWA Checklist has a set of best practices for all developers,
some browsers also have _PWA Criteria_.

The PWA criteria is a set of technical requirements that your website must comply with to be treated as a PWA. Your PWA will receive special treatment when that happens, such as firing new events, rendering an install badge or dialog, or adding a new Install menu within the browser.{% endAside %}

## Resources

- [PWA checklist](/pwa-checklist/)
