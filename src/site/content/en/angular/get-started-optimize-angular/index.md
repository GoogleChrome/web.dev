---
layout: post
title: 'Get started: optimize an Angular application'
subhead: |
  Want to make your Angular site as fast and accessible as possible? You've come to the right place!
hero: image/admin/DX8MXZivFjz3NqMtFcK4.jpg
alt: A hand dipping a paintbrush in one of several buckets of paint.
date: 2019-06-24
description: |
  Learn how to make your Angular application faster, more reliable, discoverable, installable, and accessible!
authors:
  - mgechev
tags:
  - angular
---

## What's Angular?

Angular is a framework for building user interfaces. It provides building blocks to help you quickly set up a maintainable, scalable application. Angular empowers developers to create applications that live on the web, mobile, or the desktop.

## What's in this collection?

This collection focuses on five major areas for optimizing an Angular application:

* Improving the **performance** of your application to increase user conversion and engagement
* Improving your application's **reliability** on poor networks by precaching assets with the Angular service worker
* Making your application **discoverable** for search engines and social media bots using prerendering and server-side rendering
* Making your application **installable** to provide a user experience similar to an iOS/Android app's
* Improving the **accessibility of** your application to make it usable and understandable for all users

Each post in the collection will describe techniques that you can directly apply to your own applications.

## What's *not* in this collection?

This collection assumes that you're already familiar with Angular and TypeScript. If you're not feeling confident with them yet, check out the TypeScript [documentation](https://www.typescriptlang.org/docs/home.html) and the [Getting Started with Angular](https://angular.io/start) guide on [angular.io](https://angular.io).

## Start a project

The [Angular command line interface (CLI)](https://cli.angular.io/) lets you quickly set up a simple client-side Angular application. This post has a short introduction to the CLI, while other posts in the collection show how to add more advanced features like server-side rendering and deployment support.

### Set up the CLI

To begin, install the CLI globally and verify that you have the latest version by running these commands:

```bash
npm i -g @angular/cli
ng --version
```

Make sure the last command outputs version 8.0.3 or newer.

Alternatively, if you don't want to install the CLI globally, you can install it locally and run it with the `npx` command:

```bash
npm i @angular/cli
npx ng --version
```

### Create the project

To create a new project run:

```bash
ng new my-app
```

This command will create the initial files and folder structure for your application and install the node modules it needs.

Once the setup process completes successfully, start your application by running:

```bash
cd my-app
ng serve
```

You should now be able to access your application at [http://localhost:4200](http://localhost:4200).

## What's next?

In the rest of this collection you'll learn how to improve the performance, accessibility, and SEO of your Angular application. Here's what's covered:

- Route-Level code splitting in Angular
- Performance Budgets with the Angular CLI
- Route Prefetching Strategies in Angular
- Change detection optimization in Angular
- Virtualize large lists with the Angular CDK
- Precaching with the Angular Service Worker
- Pre-render routes with Angular CLI
- Server-side rendering with Angular Universal
- Add a web app manifest with Angular CLI
- Accessibility auditing with codelyzer
