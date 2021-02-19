---
layout: post
title: 'Get started: optimize your React app'
subhead: |
  Want to make your React site as fast and accessible as possible? You've come to the right place!
hero: image/admin/seZsv5V8KU5oVlB7sO0b.jpg
date: 2019-04-29
description: |
  React is an open-source library that makes building UIs easier. This learning
  path will cover different APIs and tools within the ecosystem that you should
  consider using to improve the performance and usability of your application.
authors:
  - houssein
---

[React](https://reactjs.org/) is an open-source library that makes building UIs
easier. This learning path will cover different APIs and tools within the
ecosystem that you should consider using to improve the performance and
usability of your application.

This guide will show you how to get up and running with a React application.
Every other guide in this section will cover topics to optimize the speed or
accessibility of a React app.

## Why is this useful?

There's a lot of content that explains how to build fast and reliable
applications, but not many that show how to build fast and reliable **React**
applications. These guides cover all this from the perspective of a React
app where only libraries, APIs, and features specific to
the React ecosystem are mentioned.

## What will you learn?

The tutorials in this learning path do *not* focus on:

* How to use React
* How React works under the hood

Although both of these concepts will be touched on when needed, all the guides
and codelabs in this section will instead focus on how to build fast and
accessible React sites. For this reason, [a basic knowledge of React is
required](https://reactjs.org/docs).

## Create React App

[Create React App](https://facebook.github.io/create-react-app/) (CRA) is the
easiest way to get started building React applications. It provides a default
setup with a number of core features baked in, including a build system
containing a module bundler (webpack) and a transpiler (Babel).

On a command-line shell, you only need to run the following to create a new
application:

```bash
npx create-react-app app-name
```

{% Aside %}
`npx` is a package runner that is installed automatically with `npm` 5.2.0 or
later. It simplifies quite a few processes involved with managing
packages—including running CLI commands like `create-react-app`—without
having to install them globally on your machine.

Take a look at
[Introducing npx: an npm package runner](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) if you would like to learn more.
{% endAside %}

Once the command finishes executing, you can navigate to and run the application
with the following commands:

```bash
cd new-app
npm start
```

The following embed shows the directory structure and the actual web page of a newly
bootstrapped CRA application.

{% Glitch {
  id: 'new-create-react-app',
  path: 'src/App.js',
  height: 480
} %}

{% Aside %}
  Although CRA makes it simple to get started building a React application,
  there are many different ways to begin building sites with React. The
  ["Popular Alternatives"](https://github.com/facebook/create-react-app#popular-alternatives)
  in the README covers different use-cases and options.
{% endAside %}

There are multiple configuration files and build scripts that CRA uses to set up
a webpack and Babel build process that includes a base
[Jest](https://jestjs.io/) setup for testing. To make things simpler for the
user, these files are hidden and cannot be accessed until you eject from CRA. It
is always best to avoid ejecting whenever possible, since this means taking on all
of these configuration files as your own source code, which can become difficult
to manage.

The directory structure of a new CRA application only contains the files that
you would actually need to modify in order to work on your application. The
[CRA documentation](https://facebook.github.io/create-react-app/docs/folder-structure)
explains this in detail.

## What's next?

Now that you know how to get started building a Create React App, learn how
to improve your app's performance and accessibility with all the guides in
this learning path:

* [Code splitting with React.lazy and Suspense](/code-splitting-suspense)
* [Virtualize large lists with react-window](/virtualize-long-lists-react-window)
* [Precaching in Create React App with Workbox](/precache-with-workbox-react)
* [Pre-render routes with react-snap](/prerender-with-react-snap)
* [Add a web app manifest with Create React App](/add-manifest-react)
* [Accessibility auditing with react-axe and eslint-plugin-jsx-a11y](/accessibility-auditing-react)
