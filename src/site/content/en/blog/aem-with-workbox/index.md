---
layout: post
title: A modern web experience on Adobe Experience Manager with WorkBox
description: >
  Progressive Web Apps leverage what the modern web can do. Adobe used Workbox to bring those capabilities to Adobe Experience Manager.
authors:
  - kbalasub
  - sdenaro
date: 2022-04-12
hero: image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/DYLQrK14PjcDGMLjJy7C.png
alt: The Adobe Experience Manager logo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study
---

If you are a technical lead or digital marketing analyst interested in providing a modern Web experience to your Adobe Experience Manager (AEM) web application and have been looking for your options in doing so, then you have come to the right article. This will cover what Progressive Web Apps (PWA) are and what you need to create a PWA in AEM leveraging the WorkBox library through configuration, without coding.

## Why PWA?

Progressive Web Apps leverage what the modern web can do. They are installable on your device, load quickly, with subsequent visits loading instantly. They respond to input quickly. They work well on an unreliable connection or when offline. PWAs use modern APIs to provide an engaging app-like experience with an optional full screen UI, background updating, and offline access to data.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/xkDFjbziiPKvr2TLiAXF.png", alt="From web app to Progressive Web App.", width="800", height="477" %}
</figure>

To enhance a web app into a Progressive Web App requires adding two artifacts:

- A [web app manifest](/add-manifest/): a JSON configuration file that defines the app's entry point URL, the icon used to represent the PWA and other configuration that describe how the application looks and behaves.
- A [service worker](/learn/pwa/): a script that provides background services that enrich your PWA by defining resources your PWA uses and the strategies to access them.

## What is a service worker?

At its core, a service worker is just a script that your browser runs independently as you interact with your web application. An active service worker provides services such as smart caching using the [Cache API](/cache-api-quick-guide/), keeping data up to date using the [Background Sync API](/periodic-background-sync/), and integrating with push notifications. A service worker with the right caching strategy provides stable and reliable user experiences for various scenarios, returning pre-cached resources instantly, storing data in cache, and updating resources when connected to the web.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/j97xB2WYaExyh8SbI3pw.png", alt="A service worker lives on the client, but proxies the network.", width="800", height="369" %}
</figure>

{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/4izQ6TMiE9PHdRTor7b2.png", alt="Workbox Logo", width="200", height="47", style="max-width: 200px; margin: 0 auto;" %}

Service workers can be hard to write from scratch. Workbox was created to make it easier. Workbox is a set of libraries to help you write and manage [service workers](https://developers.google.com/web/fundamentals/primers/service-workers) and caching with the [Cache Storage API](/cache-api-quick-guide/). Service workers and the Cache Storage API, when used together, control how assets (HTML, CSS, JS, images, etc.) are requested from the network or cache, even allowing you to return cached content when offline. With Workbox, you can quickly set up and manage both, and more, with production-ready code.

## Upgrading an AEM site to a PWA

[Adobe Experience Manager](https://business.adobe.com/products/experience-manager/sites/aem-sites) (AEM) is a comprehensive content management solution for building websites, mobile apps, forms, and digital signage. It makes it easy to manage your marketing content and assets.

While AEM provides a rich library for building web applications, until now it's been difficult to build a PWA by adding a service worker and a manifest.

Adobe Experience Manager Sites is the UI building tool that is part of Adobe Experience Manager. When used with Adobe Experience Manager as a cloud service, AEM Sites makes it easy to convert any existing AEM website or single page application into an installable offline-enabled Progressive Web App with just configuration and no coding. It uses Workbox to deliver the best practices for Progressive Web Apps and abstracts the complexities of writing boilerplate manifests and service workers.

AEM supports localization of content which means you can have different branding and even different offline content for different locales. To do this build different PWA configurations for each language master.

### Getting started with PWA configuration on AEM

Log into Adobe Experience Manager as a Cloud Service and select any Adobe Experience Manager Sites page or language master and click properties. You should see a tab called Progressive Web App. (Note: if you do not see this tab, please contact Adobe to enable this feature.) You can configure the installation and the look and feel of your Progressive Web Apps with just a few clicks.

If you've completed AEM Sites tutorials you have likely seen the WKND site before. This article uses the [WKND](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html) demo as the starting point. When you are done you will have updated WKND from a web app to a PWA using WorkBox.

### Configure the manifest

The [web app manifest](/add-manifest/) is a JSON file that contains properties that describe the look and behavior of a PWA. Adobe Experience Manager Sites provides a friendly user interface to configure the properties.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/mhq0Kyzn88zfryTFpQgU.png", alt="Configuring the manifest in the installable experience dialog box.", width="800", height="634" %}
</figure>
The start URL is the entry point of your PWA. When a user taps on the the PWA icon on their phone, they will be accessing the startup URL. The display mode configures whether the app is a windowed or fullscreen experience. You can also specify the screen orientation of the application. The theme color is the color of the window and toolbar while the background color is the color of the splash screen when the application is launched. The icon is the image that is shown on the devices home screen or application drawer when the application is installed on the device. The configuration shown in the image generates the manifest JSON shown below.

```json
{
  "name": "WKND Adventures and Travel",
  "short_name": "WKND Adventures and Travel",
  "start_url": "/content/wknd/us/en.html",
  "display": "standalone",
  "theme_color": "#FFDC00",
  "background_color": "#FF851B",
  "orientation": "any",
  "icons": [
    {
      "src": "/content/dam/wknd/pwa-logo.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ]
}
```

The start URL can be different from the default landing page for your domain. By changing the `start_url` parameter, you can send your users directly to the application experience rather than the default page a non-authenticated or new user would be presented. This provides PWA users with a smoother, more app-like experience.

AEM understands that different locales can have a different look and feel. You can configure different properties, colors, and icons for different locales or languages and then synchronize the configuration with the linked pages.

Once the PWA is accessed on the browser, you can right click and inspect to bring up DevTools and view the manifest under the Applications panel.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/xWxP7YILDgejrdtbq0hh.png", alt="A PWA in the DevTools Application panel.", width="800", height="966" %}
</figure>

### Configure the service worker

You can configure the content to cache and the caching strategy to use.

If you have been using service workers you may be familiar with [caching strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/). Caching strategies specify which resources to cache and whether to look for those resources in the cache first, the network first, or in the cache with a network fallback. You can then choose the resources to pre-cache when the service worker is installed. AEM Application service workers implement a [warm cache strategy](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#warming-the-runtime-cache) which means user's experience will not break even if you specify a missing or broken path.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/GY9pDPqKTuux6jR26ZZZ.png", alt="Configuring the service worker using the Cache Management (Advanced) dialog box.", width="800", height="753" %}
</figure>

In AEM, the term "clientlibs" refers to client-side Libraries: the combination of related JavaScript, CSS, and static resources that have been added to your project that are served to and utilized by the client web browser. You can easily set your client-side libraries to be used offline by specifying those libraries in the user interface.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/9jrYgsiQzPecwYPVdCEw.png", alt="The client side libraries dialog box.", width="800", height="634" %}
</figure>

You can also include third-party resources such as fonts. This offline cache configuration provides configuration information to a service worker that is generated for your application that internally uses workbox. That is pretty much all there is to make your application installable. Once installed, the application icon will show up on your mobile device home screen just like a platform app. Clicking the icon will access the wknd site.

Please note that you can change your content or these settings at any time. When you publish your changes, the service worker will be updated at the client by the browser and a message will be presented to the user that a newer version of the PWA is available. The user can click the message to reload the application and get the latest updates. You can open the browser developer tools and applications panel to view the service worker details.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/4trs4SyeqTJN7HQQTXst.png", alt="The DevTools service worker panel.", width="800", height="575" %}
</figure>

You can expand cache storage to view the content that has been cached locally:

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/vNL5kbPDYti0GEkiJNBq.png", alt="The cache storage view in DevTools.", width="800", height="398" %}
</figure>

### The results

It's time to look at the results of your hard work. With just configuration and without coding you have just enhanced your AEM site to become a Progressive Web App.

{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/kKx6HOoA6z4hXoy4WZn8.gif", alt="An AEM site as a Progressive Web App.", width="385", height="633", style="max-width: 385; margin: 0 auto;" %}

Chrome developer tools provide a lighthouse audit that lets you check how compliant your web application and configuration is with Progressive Web App standards.

<figure>
  {% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/MGOAltGvFK3MCJLgFznv.png", alt="A lighthouse audit.", width="800", height="694" %}
</figure>

## Conclusion

Progressive Web Apps provide an app-like experience for your website, that uses the cross platform and open nature of the web at a lower cost of development and maintenance while providing control over distribution. This enhances engagement, retention, and most importantly, drives higher conversion rates. AEM in conjunction with Workbox makes it easy to enhance your existing site into a PWA with just configuration and no coding.

## References

* [WKND Tutorial](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html)
* [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
* [Cache API](/cache-api-quick-guide/)
* [Web application manifest](/add-manifest/)
* [Adaptive icon support in PWAs with maskable icons](/maskable-icon/)
* Learn more about Adobe Experience Manager Sites: [https://business.adobe.com/products/experience-manager/sites/aem-sites](https://business.adobe.com/products/experience-manager/sites/aem-sites)
* Learn more about Workbox: [https://developers.google.com/web/tools/workbox/guides/get-started](https://developers.google.com/web/tools/workbox/guides/get-started)
* Workbox Caching strategies: [https://developers.google.com/web/tools/workbox/modules/workbox-strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
* Learn more about [Progressive Web Apps](/progressive-web-apps/)

