---
page_type: guide
title: Getting started
description: |
  React is an open-source library that makes building UIs easier. This learning path will cover different APIs and tools within the ecosystem that you should consider using to improve the performance and usability of your application.
author: houssein
web_lighthouse: N/A
web_updated_on: N/A # TODO: update
web_published_on: N/A # TODO: update
wf_blink_components: N/A
---

# Getting started

[React](https://reactjs.org/) is an open-source library that makes building UIs easier. This learning path will cover different APIs and tools within the ecosystem that you should consider using to improve the performance and usability of your application.

## Why is this useful?

There is a lot of content that explain how to build fast and reliable applications by using different techiniques or including new APIs but not many that show how this fits within the tooling that comes with a React app. The guides and codelabs in this section of the site instead cover all of this from the perspective of a React app. Only libraries, APIs and features that are specific to the React ecosystem are mentioned.

<div class="aside caution">
  The tutorials in this learning path do not focus on:

  <ul>
    <li>How to use React</li>
    <li>How React works under the hood</li>
  </ul>

  Although both of these concepts will be touched on when needed, all the guides and codelabs in this section will instead focus on how to build fast and accessible React sites. For this reason, <strong>a basic knowledge of React is required.</strong>
</div>

To kick things off, this guide will briefly cover [Create React App](https://facebook.github.io/create-react-app/) which is used to build every application in this section. It will then conclude with a brief summary of all the different topics that will be explored in this learning path.

## Create React App

**Create React App** (CRA) is the easiest way to start building a React application with a build system that contains a module bundler (webpack) and transpiler (Babel). It takes care of these configurations by providing a default setup with a number of these core features baked in.

On a command-line shell, you only need to run the following to create a new application+:

```bash
npx create-react-app new-app
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
  Although CRA makes it simple to get started building a React application, there are many different ways to begin building sites with React. The <a href="https://github.com/facebook/create-react-app">"Popular Alternatives"</a> section within the README covers a few different cases where you might want to go with a different option.
</div>

There are multiple configuration files and build scripts that CRA uses to set up a webpack and Babel build process that includes a base [Jest](https://jestjs.io/) setup for testing. To make things simpler for the user, these files are hidden and cannot be accessed until you eject from CRA with `npm run eject`. This lets you take control of these configuration files yourself but once you eject, you are on your own.

To give you a better idea of the many configuration files, here is the directory structure of an ejected CRA application:

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/ejected-create-react-app?path=package.json&previewSize=0&attributionHidden=true"
    alt="ejected-create-react-app on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<div class="aside note">
  Although it can be useful to know how all the different configuration files underneath the Create React App hood works, we will not need to eject or dive into any of them for the guides and codelabs in this learning path. 
</div>

## What's next?

Now that you have a decent understanding of how every React application in this learning path is bootstrapped, each separate guide that follows this will cover a different topic that explains how to improve the performance of a specific part of your React site. This includes:

* Code-splitting with Suspense
* Virtualizing large lists
* Caching assets with a service worker
* Pre-rendering routes
* Adding a Web App Manifest
* Auditing and fixing accessibility issues
* Next.js