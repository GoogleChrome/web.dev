---
layout: post
title: 'Get Started: Optimize an Angular application'
subhead: |
  Want to make your Angular site as fast and accessible as possible? You've come to the right place!
hero: get-started-optimize-angular.jpg
date: 2019-06-24
description: |
  Learn how to make your Angular application faster, more reliable, discoverable, installable, and accessible!
authors:
  - mgechev
---

# Get Started: Optimize your Angular application

In this collection you’ll learn practical tips and tricks to make your Angular applications faster, more reliable, more accessible, and more generally awesome.

## What’s Angular?

Angular is a framework for building user interfaces. It provides building blocks to help you quickly set up a maintainable, scalable application. Angular empowers developers to build applications that live on the web, mobile, or the desktop.

## What’s in this collection?

This collection focuses on five major areas for optimizing an Angular application:

* Improving the **performance** of your application to increase user conversion and engagement
* Improving your application’s **reliability** on poor networks by precaching assets with the Angular service worker
* Making your application **discoverable** for search engines and social media bots using prerendering and server-side rendering
* Making your application **installable** to provide a native-like user experience
* Improving the **accessibility of** your application to make it usable and understandable for all users

In each area, we’ll describe techniques that you can directly apply to your own applications.

## What’s *not* in this collection?

This collection assumes that you’re already familiar with Angular and TypeScript. If you’re not feeling confident with them yet, check out the TypeScript [documentation](https://www.typescriptlang.org/docs/home.html) and the "[Getting Started with Angular](https://angular.io/start)" guide on [angular.io](https://angular.io).

## Start a project

The [Angular command line interface (CLI)](https://cli.angular.io/) lets you quickly set up a simple client-side Angular application. In this section, we’re going to make a quick introduction to the CLI because the articles in this collection we’ll often reference examples using it. Later tutorials show how to add more advanced features like server-side rendering and deployment support.

### Set up the CLI

To begin, install the CLI globally and verify that you have the latest version:

Run these commands:

```
npm i -g @angular/cli
ng --version
```

Make sure the last commands outputs a version 8.0.3 or newer.

Alternatively, if you don’t want to install the CLI globally, you can install it locally and run it with the `npx` command:

```
npm i @angular/cli
npx ng --version
```

### Create the project

To create a new project run:

```
ng new my-app
```

This command will create the initial files and folder structure for your application and install the node modules it needs. In the following articles, you may need to clone a project and install the dependencies yourself. For the purpose run:

```
git clone git@github.com:mgechev/code-splitting-web-dev
cd code-splitting-web-dev && npm i
```

Once the setup process completes successfully, start your application by running:

```
cd my-app
ng start
```

You should now be able to access your application at [http://localhost:4200](http://localhost:4200).

## What’s next?

In the next tutorials from this collection you’ll learn how to improve the performance, accessibility, and SEO of your Angular application. In the course of the next couple of articles, we’ll explain:

- Route-Level code-splitting in Angular
- Performance Budgets with the Angular CLI
- Route Prefetching Strategies in Angular
- Change detection optimization in Angular
- Virtualize large lists with the Angular CDK
- Precaching with the Angular Service Worker
- Pre-render routes with Angular CLI
- Server-side rendering with Angular Universal
- Add a web app manifest with Angular CLI
- Accessibility auditing with codelyzer
