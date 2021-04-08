---
layout: post
title: 'Precaching with the Angular service worker'
subhead: |
  Use the Angular service worker to make your app faster and more reliable on networks with poor connectivity.
hero: image/admin/r1NlrtasqQuMo11wlSva.jpg
alt: Sparks flying off a metal grinder.
date: 2019-07-02
description: |
  Learn how to use the Angular service worker to precache the static assets in your app.
authors:
  - mgechev
tags:
  - angular
  - performance
  - reliability
feedback:
  - api
---

## Dealing with limited connectivity

When users have limited network access—or none at all—web app functionality can significantly degrade and often fails. Using a [service worker](https://developers.google.com/web/fundamentals/primers/service-workers/) to provide precaching lets you intercept network requests and deliver responses directly from a local cache instead of retrieving them from the network. Once your app's assets have been cached, this approach can really speed up an app and make it work when the user is offline.

This post walks through how to set up precaching in an Angular app. It assumes you're already familiar with precaching and service workers in general. If you need a refresher, check out the [Service workers and the Cache Storage API](/service-workers-cache-storage/) post.

{% Aside %}

_You can find the code for the current example [on GitHub](https://github.com/mgechev/service-worker-web-dev)._

{% endAside %}

## Introducing the Angular service worker

The Angular team offers a service worker module with precaching functionality that's well integrated with the framework and the [Angular command line interface (CLI)](https://cli.angular.io/).

To add the service worker, run this command in the CLI:

```bash
ng add @angular/pwa
```

{% Aside %}

If you have multiple projects in the Angular CLI workspace, you can optionally specify a `--project` property with the project name you want to add the service worker to.

{% endAside %}

`@angular/service-worker` and `@angular/pwa` should now be installed in the app and should appear in `package.json`. The `ng-add` [schematic](https://angular.io/guide/schematics) also adds a file called `ngsw-config.json` to the project, which you can use to configure the service worker. (The file includes a default configuration that you'll customize a little later.)

Now build the project for production:

```bash
ng build --prod
```

Inside the `dist/service-worker-web-dev` directory you'll find a file called `ngsw.json`. This file tells the Angular service worker how to cache the assets in the app. The file is generated during the build process based on the configuration (`ngsw-config.json`) and the assets produced at build time.

Now start an HTTP server in the directory containing your app's production assets, open the public URL, and check out its network requests in Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

Note that the network tab has a bunch of static assets directly downloaded in the background by the `ngsw-worker.js` script:

{% Img src="image/admin/XL0o6p4YbQiBJmWW8Kw4.png", alt="Sample app", width="800", height="599" %}

This is the Angular service worker precaching the static assets specified in the generated `ngsw.json` manifest file.

One important asset is missing though: `nyan.png`. To precache this image you need to add a pattern that includes it to `ngsw-config.json`, which lives in the root of the workspace:

```json/13
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
      "files": [
        "/favicon.ico",
        "/index.html",
        "/*.css",
        "/*.js",
        "/assets/*.png"
        ]
      }
    },
    ...
}
```

This change adds all PNG images in the `/assets` folder  to the `app` resource asset group. Since the `installMode` for this asset group is set to `prefetch`, the service worker will precache all the specified assets—which now include PNG images.

Specifying other assets to be precached is just as straightforward: update the patterns in the `app` resource asset group.

## Conclusion

Using a service worker for precaching can improve the performance of your apps by saving assets to a local cache, which makes them more reliable on poor networks. To use precaching with Angular and the Angular CLI:

1. Add the `@angular/pwa` package to your project.
2. Control what the service worker caches by editing `ngsw-config.json`.
