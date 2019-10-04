---
layout: post
title: "Set up dynamic server-side rendering with Angular"
subhead: |
  Dynamically server-side rendering your pages per route using Angular Universal schematics.
hero: angular-universal-motorcycle.jpeg
alt: close-up of black and brown motorcycle dashboard
date: 2019-10-01
description: |
  Learn how to set up dynamic server-side rendering in your Angular applications.
authors:
  - markpieszak
tags:
  - angular
  - performance
  - ssr
  - angular-universal
---

_You can find the code samples from this article [on GitHub](https://github.com/trilonio/angular-universal-tutorial)_

In this post, you'll learn how to use the [Angular Universal schematics](https://www.github.com/angular/universal) to set up dynamic server-side rendering (SSR). SSR can give you more control over your search engine optimization (SEO) and social media previews and get faster [First Meaningful Paints](/first-meaningful-paint).

{% Aside %}

This post assumes you're already familiar with SSR and the Angular Universal schematics and their benefits. If you need a refresher on check out the [Getting started with server-side rendering in Angular](/getting-started-with-server-side-rendering-in-angular/) post.

{% endAside %}

## Dynamic Server-side rendering with Angular

Dynamic SSR is done at **_run time_**. With dynamic SSR, you'll need a Node.js server to handle incoming requests for routes by serializing your application to an HTML string that's then returned to the browser to be rendered.

Occasionally your applications have very dynamic content or components. A common use case would be if you had routes that required SSR but had dynamic parameters as part of their URL (for example, `/products/:id`).

Your Node.js server will essentially serve as a middleman when a specific product is requested, generating the content on the fly for the given URL.

To achieve this, you'll need to install the `@nguniversal/express-engine` schematic in your Angular CLI application. Read more about installing the schematic in the [Get started with server-side rendering in Angular](/getting-started-with-server-side-rendering-in-angular/) post.

### How it all works

If you inspect the `server.ts` file in the sample application, you'll see that it's currently set up to handle _all_ incoming requests and dynamically render them server-side. Let's go over a few notable lines of `server.ts` to understand what they are doing.

You can see that the code is passing in the Angular Universal express-engine installed by the schematics:

```javascript/16-19
// The Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});
```

You may only want specific routes dynamically rendered on the server, and you can adjust this behavior to meet your requirements.  It's also possible to have some routes return the original `index.html`, allowing for standard client-side rendering:

```javascript/9
// Render specific routes dynamically
const ssrRoutes = ['home', '/products'];
app.get(ssrRoutes, (req, res) => {
  res.render('index', { req });
}

// Catch-all for every other route
app.get('*', (req, res) => {
  // client-side rendering only - standard index.html will be returned
  res.send(html);
});
```

## Build and start your Node.js server

You may have noticed that the Angular Universal schematic added some new scripts to your `package.json` file. To build and run dynamic SSR simply run:

```bash
npm run build:ssr && npm run serve:ssr
```

Here's what those scripts are doing:
`build:ssr` builds both the client and server Angular bundles. (Remember, you're trying to render our application in two different platforms.)
`build:ssr` also compiles the `server.ts` Node.js Typescript code.
`server:ssr` starts the Node.js server.

In the terminal, you should now see:

```bash
Node Express server listening on http://localhost:4000
```

## Verify your build

Open `http://localhost:4000` in your browser and take a look at your running Universal application. Make sure to view the source to see if everything rendered correctly:

{% Instruction 'devtools-elements', 'ol' %}

You should see that your `<app-root>` element is populated with the HTML that was rendered server-side. Content needed for SEO, like the `<h1>` tag, is fully rendered.

```html/3
<body>
  <app-root _nghost-sc0="" ng-version="8.0.2">
    <div _ngcontent-sc0="" style="text-align:center">
      <h1 _ngcontent-sc0="">Welcome to angular-universal-tutorial!</h1>
    ...
```

To see the difference between SSR and client-side rendering (CSR), run an Angular application normally:

1. `npm start`
2. Open your browser to the standard `http://localhost:4200` URL.
{% Instruction 'devtools-elements', 'ol' %}

You should see an empty `<app-root>` element as you'd expect:

```html/1
<body>
  <app-root></app-root>
```

With dynamic SSR set up, you can render any route within your application, delivering any title, meta tags, structured data, and relevant content needed to meet your SEO goals.

Remember that both CSR, static SSR, and dynamic SSR can be mixed together in a hybrid approach as shown above. Determine how static or dynamic your application is before choosing which technique makes the most sense for you!

## Conclusion

To achieve dynamic SSR in an Angular CLI app:

1. Add `@nguniversal/express-engine` to your project using the Angular CLI.
2. Adjust routes and secure and set up your Node.js `server.ts` file accordingly.
3. Build and run your Node.js server with: `npm run build:ssr && npm run serve:ssr`
4. Open `https://localhost:4000` and use Chrome DevTools to verify that everything rendered correctly.
