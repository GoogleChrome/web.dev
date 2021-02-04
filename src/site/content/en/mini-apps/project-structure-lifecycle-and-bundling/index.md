---
layout: post
title: Project structure, lifecycle, and bundling
authors:
  - thomassteiner
date: 2021-01-25
# updated: 2021-01-25
description: |
  This chapter covers the project structure, the lifecycle, and the bundling of mini apps.
tags:
  - mini-apps
---

## Mini app project structure

As before with the markup languages, the styling languages, and the components, with the mini app
project structure, too, the details like the file extensions or the default names vary, but the
overall idea is the same for all super app providers. The project structure always consists of a
root file `app.js` that initializes the mini app, a configuration file `app.json` that _roughly_
corresponds to a [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), an
optional common style sheet file `app.css` with shared default styles, and a `project.config.json`
file that contains build information. All the pages are stored in individual subfolders in a
`pages` folder. Each page subfolder contains a CSS file, a JS file, an HTML file, and an optional
configuration JSON file. All files must be named like their containing folder, apart from the file
extensions. Like that, the mini app just needs a pointer to the directory in the `app.json` file
(the manifest-like file), and can find all subresources dynamically. From the perspective of a Web
developer, mini apps are thus multi page apps.

```bash
├── app.js               # Initialization logic
├── app.json             # Common configuration
├── app.css              # Common style sheet
├── project.config.json  # Project configuration
└── pages                # List of pages
   ├── index               # Home page
   │   ├── index.css         # Page style sheet
   │   ├── index.js          # Page logic
   │   ├── index.json        # Page configuration
   │   └── index.html        # Page markup
   └── other               # Other page
       ├── other.css         # Page style sheet
       ├── other.js          # Page logic
       ├── other.json        # Page configuration
       └── other.html        # Page markup
```

## Mini app lifecycle

A mini app must be registered with the super app by calling the globally defined `App()` method.
Referring to the project structure outlined [before](/project-structure-lifecycle-and-bundling/#mini-app-project-structure), this happens in
`app.js`. The mini app lifecycle essentially consists of four events: `launch`, `show`, `hide`, and
`error`. Handlers for these events can be passed to the `App()` method in the form of a
configuration object, which can also contain a `globalData` property that holds data that should be
globally available across all pages.

```js
/* app.js */
App({
  onLaunch(options) {
    // Do something when the app is launched initially.
  },
  onShow(options) {
    // Do something when the app is shown.
  },
  onHide() {
    // Do something when the app is hidden.
  },
  onError(msg) {
    console.log(msg);
  },
  globalData: "I am global data",
});
```

As usual, the individual details vary, but the concept is the same for
[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html),
[Alipay](https://opendocs.alipay.com/mini/framework/app-detail),
[Baidu](https://smartprogram.baidu.com/docs/develop/framework/app_service_register/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/logic-layer/start-app/),
and also
[Quick App](https://doc.quickapp.cn/tutorial/framework/lifecycle.html#app-%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F).

## Page lifecycle

Similar to the app lifecycle, the page lifecycle, too, has lifecycle events that the developer can
listen for and react upon. These core events are `load`, `show`, `ready`, `hide`, and `unload`. Some
platforms offer additional events like `pulldownrefresh`. Setting up the event handlers happens in
the `Page()` method that is defined for each page. For the `index` or the `other` pages from the
project structure [before](/project-structure-lifecycle-and-bundling/#mini-app-project-structure), this would happen in `index.js` or
`other.js` respectively.

```js
/* index.js */
Page({
  data: {
    text: "This is page data.",
  },
  onLoad: function (options) {
    // Do something when the page is initially loaded.
  },
  onShow: function () {
    // Do something when the page is shown.
  },
  onReady: function () {
    // Do something when the page is ready.
  },
  onHide: function () {
    // Do something when the page is hidden.
  },
  onUnload: function () {
    // Do something when the page is closed.
  },
  onPullDownRefresh: function () {
    // Do something when the user pulls down to refresh.
  },
  onReachBottom: function () {
    // Do something when the user scrolls to the bottom.
  },
  onShareAppMessage: function () {
    // Do something when the user shares the page.
  },
  onPageScroll: function () {
    // Do something when the user scrolls the page.
  },
  onResize: function () {
    // Do something when the user resizes the page.
  },
  onTabItemTap(item) {
    // Do something when the user taps the page's tab.
  },
  customData: {
    foo: "bar",
  },
});
```

## The build process

The build process of mini apps is abstracted away from the developer. Under the hood, it is using
industry tools like the [Babel](https://babeljs.io/) compiler for transpilation and minification and
the [postcss](https://postcss.org/) CSS transformer. The build experience is comparable to that of
[Next.js](https://nextjs.org/) or
[`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html), where developers, if
they explicitly choose not to, never touch the build parameters. The resulting processed files
are finally signed, encrypted, and packaged in one or several (sub)packages that then get uploaded
to the servers of the super app providers. Subpackages are meant for lazy-loading, so a mini app
does not have to be downloaded all at once. The packaging details are meant to be private and are
not documented, but some package formats like WeChat's `wxapkg` format have been
[reverse-engineered](https://github.com/sjatsh/unwxapkg).

{% Banner 'neutral' %}
  👉 The next chapter provides insights on the [mini app standardization effort](/mini-app-standardization/).
{% endBanner %}
