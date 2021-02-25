---
layout: post
title: 'Route preloading strategies in Angular'
subhead: |
  Preload routes ahead of time to speed up users' navigation.
hero: image/admin/q4b86k6REnNHkpjQnsLK.jpg
hero_position: bottom
alt: Glass crystal ball
date: 2019-07-09
description: |
  Learn how to use Angular's preloading strategies for faster apps.
authors:
  - mgechev
tags:
  - angular
  - performance
feedback:
  - api
---

[Route-level code splitting](/route-level-code-splitting-in-angular) can help you reduce the initial load time of an application by delaying the JavaScript associated with routes that aren't initially needed. This way, the Angular router waits until a user navigates to a given route before triggering a network request to download the associated JavaScript.

While this technique is great for initial page load, it can slow down navigation, depending on the users' network latency and bandwidth. One way to tackle this problem is **route preloading**. Using preloading, when the user is at a given route, you can download and cache JavaScript associated with routes that are likely to be needed next. The Angular router provides this functionality out of the box.

In this post, you'll learn how to speed up navigation when using route-level code splitting by taking advantage of JavaScript preloading in Angular.

## Route preloading strategies in Angular

The Angular router provides a configuration property called `preloadingStrategy`, which defines the logic for preloading and processing lazy-loaded Angular modules. We'll cover two possible strategies:

* `PreloadAllModules`, which preloads all lazy-loaded routes, as the name implies
* `QuicklinkStrategy`, which preloads only the routes associated with links on the current page.

_The rest of this post refers to a sample Angular app. You can find the source code [on GitHub](https://github.com/mgechev/route-preloading-web-dev)._

### Using the `PreloadAllModules` strategy

The sample app has several lazy-loaded routes. To preload all of them using the `PreloadAllModules` strategy—which is built into Angular—specify it as the value for the `preloadingStrategy` property in the router configuration:

```js
import { RouterModule, PreloadAllModules } from '@angular/router';
// …

RouterModule.forRoot([
  …
], {
  preloadingStrategy: PreloadAllModules
})
// …
```

Now serve the application and look at the **Network** panel in Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

You should see that the router downloaded `nyan-nyan-module.js` and `about-about-module.js` in the background when you opened the application:

<figure class="w-figure w-figure--fullbleed">
<video controls loop muted poster="https://storage.googleapis.com/web-dev-angular/preloading/poster.png">
  <source src="https://storage.googleapis.com/web-dev-angular/preloading/preload-all.webm" type="video/webm; codecs=vp8">
  <source src="https://storage.googleapis.com/web-dev-angular/preloading/preload-all.mp4" type="video/mp4; codecs=h264">
</video>
 <figcaption class="w-figcaption w-figcaption--fullbleed">
    The PreloadAllModules strategy in action.
  </figcaption>
</figure>

The router also registered the modules' route declarations so that when you navigate to a URL associated with any of the preloaded modules, the transition is instantaneous.


### Using the Quicklink preloading strategy

`PreloadAllModules` is useful in a lot of cases. When you have dozens of modules, however, its aggressive preloading can really increase network usage. Also, since the router needs to register the routes in all the preloaded modules, it can cause intensive computations in the UI thread and lead to sluggish user experience.

The [quicklink](https://github.com/GoogleChromeLabs/quicklink) library provides a better strategy for larger apps. It uses the [IntersectionObserver](https://developers.google.com/web/updates/2019/02/intersectionobserver-v2) API to preload only modules associated with links that are currently visible on the page.

You can add quicklink to an Angular app by using the [ngx-quicklink](https://www.npmjs.com/package/ngx-quicklink) package. Start by installing the package from npm:

```bash
npm install --save ngx-quicklink
```

Once it's available in your project, you can use `QuicklinkStrategy` by specifying the router's `preloadingStrategy` and importing the `QuicklinkModule`:

```js
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    …
    QuicklinkModule,
    RouterModule.forRoot([…], {
      preloadingStrategy: QuicklinkStrategy
    })
  ],
  …
})
export class AppModule {}
```

Now when you open the application again, you'll notice that the router only preloads `nyan-nyan-module.js` since the button in the center of the page has a router link to it. And when you open the side navigation, you'll notice that the router then preloads the "About" route:

<figure class="w-figure w-figure--fullbleed">
<video controls loop muted poster="https://storage.googleapis.com/web-dev-angular/preloading/poster.png">
  <source src="https://storage.googleapis.com/web-dev-angular/preloading/ngx-quicklink.webm" type="video/webm; codecs=vp8">
  <source src="https://storage.googleapis.com/web-dev-angular/preloading/ngx-quicklink.mp4" type="video/mp4; codecs=h264">
</video>
 <figcaption class="w-figcaption w-figcaption--fullbleed">
    A demo of the quicklink preloading strategy.
  </figcaption>
</figure>

### Using the Quicklink preloading strategy across multiple lazy-loaded modules

The above example will work for a basic application but if your application contains multiple lazy-loaded modules you will need to import the `QuicklinkModule` into a shared module, export it and then import the shared module into your lazy-loaded modules.

First import the `QuicklinkModule` from `ngx-quicklink` into your shared module and export it:
```js
import { QuicklinkModule } from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    QuicklinkModule
  ],
  exports: [
    QuicklinkModule
  ],
  …
})
export class SharedModule {}
```

Then import your `SharedModule` into all of your lazy-loaded modules:
```js
import { SharedModule } from '@app/shared/shared.module';
…

@NgModule({
  …
  imports: [
      SharedModule
  ],
  …
});
```

`Quicklinks` will now be available in your lazy-loaded modules.

## Going beyond basic preloading

While selective preloading via quicklink can significantly speed up navigation, you can make your preloading strategy even more network efficient by using predictive preloading—which is implemented by [Guess.js](https://github.com/guess-js/guess). By analyzing a report from Google Analytics or another analytics provider, Guess.js can predict a user's navigation journey and preload only the JavaScript chunks that are likely to be needed next.

You can learn how to use Guess.js with Angular on [this page from the Guess.js site](https://guess-js.github.io/docs/angular).

## Conclusion

To speed up navigation when using route-level code splitting:

1. Pick the right preloading strategy depending on the size of your application:
    - Applications with few modules can use Angular's built-in `PreloadAllModules` strategy.
    - Applications with many modules should use a custom preloading strategy, like Angular's quicklink, or predictive preloading, as implemented in Guess.js.
1. Configure the preloading strategy by setting the `preloadStrategy` property of the Angular router.
