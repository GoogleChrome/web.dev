---
title: 使用 Web Share Target API 接收共享数据
subhead: Web Share Target API 让在移动设备和桌面上分享变得更简单
authors:
  - petelepage
  - joemedley
date: 2019-11-08
updated: 2021-06-07
hero: image/admin/RfxdrfKdh5Fp8camulRt.png
alt: 展示平台特定应用现在可以与 web 应用分享内容的插图。
description: 在移动设备或桌面设备上，分享应该就像点击分享按钮一样简单，选择一个应用，然后选择要分享的目标。Web Share Target API 允许已安装的 Web 应用向底层操作系统注册以接收共享内容。
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

在移动设备或桌面设备上，分享应该像单击**分享**按钮、选择应用和选择分享对象一样简单。例如，您可能想要通过发送电子邮件给朋友或通过推特将其发送给全世界，来分享一篇有趣的文章。

在过去，只有平台特定的应用才能向操作系统注册来接收来自其他已安装应用的共享内容。但有了 Web Share Target API，已安装的 Web 应用可以在底层操作系统中注册为分享目标，从而实现接收分享内容的功能。

{% Aside %}这里面只有 Web Share Target API 一半的功劳。 Web 应用可以使用 Web Share API 分享数据、文件、链接或文本。有关详细信息，请参阅 [Web Share API](/web-share/)。 {% endAside %}

<figure data-float="right">{% Img src="image/admin/Q4nuOQMpsQrTilpXA3fL.png", alt=" 安卓手机的 Share via 抽屉。", width="400", height="377" %}<figcaption>将安装的 PWA 作为一个选项的系统级分享目标选择器。</figcaption></figure>

## 查看 Web Share Target 的实际应用

1. 使用 Android 的 Chrome 76 或更高版本，或者桌面版的 Chrome 89 或更高版本，打开 [Web Share Target 演示](https://web-share.glitch.me/)。
2. 出现提示时，单击**安装**将应用添加到您的主屏幕，或使用 Chrome 菜单将其添加到您的主屏幕。
3. 打开任何支持分享的应用，或使用演示应用中的“分享”按钮。
4. 在目标选择器中，选择 **Web Share Test** 。

分享后，您应该会在 Web 共享目标 Web 应用中看到所有分享的信息。

## 将您的应用注册为分享目标

要将您的应用注册为分享目标，它需要满足 [Chrome 的可安装性标准](https://developers.google.com/web/fundamentals/app-install-banners/#criteria)。此外，在用户可以向您的应用分享内容之前，他们必须将其添加到主屏幕。这是为了防止网站将自己随机添加到用户的分享意图选择器中，并确保用户希望与您的应用进行分享。

## 更新您的 Web 应用清单

要将应用注册为分享目标，请将`share_target`添加到它的 [Web 应用清单](/add-manifest/)中。该操作会告诉操作系统将您的应用作为一个选项放在意图选择器中。添加到清单中的内容用来控制您的应用将接受的数据。 `share_target`有以下三种常见场景：

- 接受基本信息
- 接受应用程序改动
- 接受文件

{% Aside %} 每个清单中只能有一个`share_target`，如果您想将数据分享到应用内的不同位置，请在分享目标的登陆页面中提供该选项。 {% endAside %}

### 接受基本信息

如果您的目标应用仅接受数据、链接和文本等基本信息，请将以下内容添加到`manifest.json`文件中：

```json
"share_target": {
  "action": "/share-target/",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

如果您的应用程序已经有了分享 URL 方案，那么可以将`param`值替换为现有的查询参数。例如，如果您的分享 URL 方案使用`body`而不是`text` ，您可以将`"text": "text"`替换为`"text": "body"` 。

如果未提供`method`的值，则默认为是`"GET"`。在本示例中未显示的`enctype`字段表明了数据的[编码类型](https://developer.mozilla.org/docs/Web/HTML/Element/form#attr-enctype)。对于`"GET"`方法，`enctype`默认为`"application/x-www-form-urlencoded"`，如果设置为其他任何内容，则将被忽略。

### 接受应用程序改动

如果分享的数据以某种方式更改了目标应用（例如在目标应用中保存了书签），那么请将`method`的值设为`"POST"`，并包含`enctype`字段。下面的示例会在目标应用中创建一个书签，所以它将`method`设为了`"POST"`，将`enctype` 设为了`"multipart/form-data"`：

```json/4-5
{
  "name": "Bookmark",
  "share_target": {
    "action": "/bookmark",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "url": "link"
    }
  }
}
```

### 接受文件

与接受应用程序改动一样，接受文件需要将`method`设为`"POST"`，并且需要使用`enctype`。此外，`enctype`必须设为`"multipart/form-data"`，并且必须添加`files`

此外，您还必须添加一个`files`数组，用于定义应用程序接受的文件类型。数组元素是具有两个成员的条目： `name`字段和`accept`字段。 `accept`字段可以是 MIME 类型、文件扩展名或包含两者的数组。我们建议提供一个包含 MIME 类型和文件扩展名的数组，因为每个操作系统的偏好不同。

```json/5,10-19
{
  "name": "Aggregator",
  "share_target": {
    "action": "/cgi-bin/aggregate",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "name",
      "text": "description",
      "url": "link",
      "files": [
        {
          "name": "records",
          "accept": ["text/csv", ".csv"]
        },
        {
          "name": "graphs",
          "accept": "image/svg+xml"
        }
      ]
    }
  }
}
```

## 处理传入的内容

如何处理传入的共享数据取决于您自己以及您的应用。例如：

- 电子邮件客户端可以使用`title`作为电子邮件的主题，并连接`text`和`url`作为正文来起草一份新的电子邮件。
- 社交网络应用可以忽略`title`，使用`text`作为消息正文并添加`url`作为链接，来起草新帖子。如果缺少`text`，应用也可以在正文中使用`url`。如果缺少`url` ，应用可能会扫描`text`来查找 URL 并将其添加为链接。
- 照片分享应用可以使用`title`作为幻灯片标题、使用`text`作为描述以及将`files`作为幻灯片图像来创建新的幻灯片。
- 消息应用可以使用连接在一起的`text`和`url`来起草新消息，无需使用`title`。

### 处理 GET 分享

如果用户选择了您的应用，并且您的`method`是`"GET"`（默认），那么浏览器会在`action` URL 打开一个新窗口。然后，浏览器会使用清单中提供的 URL 编码值生成查询字符串。例如，如果分享应用提供`title`和`text`，那么查询字符串就是`?title=hello&text=world`。要处理此查询，请在前台页面使用`DOMContentLoaded`事件侦听器并解析查询字符串：

```js
window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
  // searchParams.get() will properly handle decoding the values.
  console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
  console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
  console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
});
```

请务必使用服务工作进程来[预缓存](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)`action`页面，以便它能够快速加载并可靠地工作，即便用户处于离线状态。[Workbox](/precache-with-workbox/) 这个工具可以帮您在服务工作进程中[实现预缓存](https://developer.chrome.com/docs/workbox/)。

### 处理 POST 分享

如果您的`method`是`"POST"`（目标应用接收保存的书签或共享文件时要设为此值），那么传入的`POST`请求的正文会包含分享应用传递的数据，使用清单中提供`enctype`进行编码。

前台页面无法直接处理此数据。由于页面将数据视为请求，因此会将其传递给服务工作进程，您可以在那里使用`fetch`事件侦听器拦截它。在这里，您可以使用`postMessage()`将数据传递回前台页面或将其传递给服务器：

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // If this is an incoming POST request for the
  // registered "action" URL, respond to it.
  if (event.request.method === 'POST' &&
      url.pathname === '/bookmark') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })());
  }
});
```

### 验证分享内容

<figure data-float="right">{% Img src="image/admin/hSwbgPk8IFgPC81oJbxZ.png", alt="显示带有分享内容的演示应用的 Android 手机。", width="400", height="280" %}<figcaption>分享目标应用的示例。</figcaption></figure>

请务必验证传入的数据。遗憾的是，我们无法保证其他应用会以正确的参数分享适当的内容。

例如，在Android 上， [`url`字段将为空](https://bugs.chromium.org/p/chromium/issues/detail?id=789379)，因为Android 的分享系统不支持该字段。相反，URL 经常出现在`text`字段中，或者偶尔出现在`title`字段中。

## 浏览器支持

截至 2021 年初，下列浏览器支持 Web Share Target API：

- Android 上的 Chrome 和 Edge 76 或更高版本。
- ChromeOS 上的 Chrome 89 或更高版本。

在所有平台上，您的 Web 应用程序必须先[安装](https://developers.google.com/web/fundamentals/app-install-banners/#criteria)，然后它才会显示为接收分享数据的潜在目标。

## 示例应用程序

- [Squoosh](https://github.com/GoogleChromeLabs/squoosh)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)

### 展示您对 API 的支持

您是否计划使用 Web Share Target API？您的公开支持有助于 Chromium 团队优先考虑功能，并向其他浏览器供应商展示支持它们的重要性。

请使用标签 [`#WebShareTarget`](https://twitter.com/search?q=%23WebShareTarget&src=recent_search_click&f=live) 向 [@ChromiumDev](https://twitter.com/ChromiumDev) 发送推文，与我们分享您的使用方式和地点。
