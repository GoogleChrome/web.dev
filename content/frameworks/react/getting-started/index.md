---
page_type: guide
title: 'Get Started: Optimize your React app'
description: |
  React is an open-source library that makes building UIs easier. This learning path will cover different APIs and tools within the ecosystem that you should consider using to improve the performance and usability of your application.
author: houssein
web_lighthouse: N/A
web_updated_on: N/A # TODO: update
web_published_on: N/A # TODO: update
wf_blink_components: N/A
---

# Get Started: Optimize your React app

[React](https://reactjs.org/) is an open-source library that makes building UIs easier. This learning path will cover different APIs and tools within the ecosystem that you should consider using to improve the performance and usability of your application.

This guide will show you how to get up and running with a React application. Every other guide in this section will cover topics to optimize the speed or accessibility of a React app.

## Why is this useful?

There's a lot of content that explains how to build fast and reliable applications, but not many that show how to build fast and reliable React applications using React tooling. These guides and codelabs cover all this from the perspective of a React app. Only libraries, APIs, and features specific to the React ecosystem are mentioned.

## What will you learn?

The tutorials in this learning path do *not* focus on:

* How to use React
* How React works under the hood

Although both of these concepts will be touched on when needed, all the guides and codelabs in this section will instead focus on how to build fast and accessible React sites. For this reason, [a basic knowledge of React is required](https://reactjs.org/docs).

## Create React App

[Create React App](https://facebook.github.io/create-react-app/) (CRA) is the easiest way to get started building React applications. It provides a default setup with a number of core features baked in, including a build system containing a module bundler (webpack) and a transpiler (Babel).

On a command-line shell, you only need to run the following to create a new application:

```bash
npx create-react-app app-name
```

<div class="aside note">
<p><code>npx</code> is a package runner that is installed automatically with <code>npm</code> 5.2.0 or later. It simplifies quite a few processes involved with managing packages including running CLI commands (like <code>create-react-app</code> without having to install it globally on your machine.</p>

<p>Take a look at <a href="https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b">Introducing npx: an npm package runner</a> if you would like to learn more.</p>
</div>

Once the command finishes executing, you can navigate to and run the application with the following commands:

```bash
cd new-app
npm start
```

The following embed shows the directory structure and actual web page of a newly bootstrapped CRA application.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/new-create-react-app?path=src/App.js&attributionHidden=true"
    alt="new-create-react-app on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<div class="aside note">
  Although CRA makes it simple to get started building a React application, there are many different ways to begin building sites with React. The <a href="https://github.com/facebook/create-react-app">"Popular Alternatives"</a> in the README covers different use-cases and options.
</div>

There are multiple configuration files and build scripts that CRA uses to set up a webpack and Babel build process that includes a base [Jest](https://jestjs.io/) setup for testing. To make things simpler for the user, these files are hidden and cannot be accessed until you eject from CRA. It is always best to avoid ejecting whenever possible. Ejecting means taking on all of these configuration files as your own source code, which can become difficult to manage.

The directory structure of a new CRA application only contains the files that you would actually need to modify in order to work on your application. The [CRA documentation](https://facebook.github.io/create-react-app/docs/folder-structure) explains this in detail.

## What's next?

Now that you know how to get started building a Create React App, learn how improve your app's performance and accessibility, including:

* [Code-splitting with Suspense](/react/code-splitting-suspense)
* [Virtualizing large lists](/react/virtualize-long-lists-react-window)
* [Caching assets with a service worker](/react/add-service-worker)
* [Pre-rendering routes](/react/prerender-routes)
* [Adding a Web App Manifest](/react/add-manifest)
* [Auditing and fixing accessibility issues](/react/accessibility-in-react)
* [Next.js](/react/next)