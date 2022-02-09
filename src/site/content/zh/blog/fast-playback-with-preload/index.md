---
layout: post
title: 快速播放音频和视频预加载
subhead: 如何通过主动预加载资源来加速媒体播放。
authors:
  - beaufortfrancois
description: |2-

  播放开始得越快，意味着观看您的视频或收听您的音频的人越多。这是众所周知的事实。在本文中，我将探讨一些实用的技术，可以使用这些技术根据您的用例主动预加载资源来加速媒体播放。
date: 2017-08-17
updated: 2020-11-16
tags:
  - media
  - performance
  - network
---

播放开始得越快，意味着观看您的视频或收听<br>您的音频的人越多。[这是众所周知的事实](https://www.digitaltrends.com/web/buffer-rage/)。在本文中，我将探讨一些实用的技术，可以使用这些技术根据您的用例主动预加载资源来加速音频和视频播放。

<figure>
  <video controls muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.webm#t=1.1" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.mp4#t=1.1" type="video/mp4">
  </source></source></video>
  <figcaption>
    <p>致谢：版权 Blender Foundation | <a href="http://www.blender.org">www.blender.org</a> 。</p>
  </figcaption></figure>

我将介绍三种预加载媒体文件的方法，从各自的优缺点开始。

<table>
  <tbody>
    <tr>
      <th></th>
      <th>优点...</th>
      <th>缺点...</th>
    </tr>
    <tr>
      <td rowspan="3" style="white-space: nowrap"><a href="#video_preload_attribute">视频预加载属性</a></td>
      <td rowspan="3">对于托管在 Web 服务器上的唯一文件来说简单易用。</td>
      <td>浏览器可能会完全忽略该属性。</td>
    </tr>
<tr>
      <td>当 HTML 文档已完全加载并解析后，才会开始获取资源。</td>
    </tr>
    <tr>
      <td>媒体源扩展 (MSE) 会忽略媒体元素上的 <code>preload</code> 属性，因为应用程序负责向 MSE 提供媒体。</td>
    </tr>
    <tr>
      <td rowspan="2" style="white-space: nowrap"><a href="#link_preload">链接预加载</a></td>
      <td>强制浏览器请求视频资源而不阻止文档的 <code>onload</code> 事件。</td>
      <td>HTTP 范围请求不兼容。</td>
    </tr>
<tr>
      <td>与 MSE 和文件段兼容。</td>
      <td>获取完整资源时，应仅用于小型媒体文件 (&lt;5 MB)。</td>
    </tr>
    <tr>
      <td><a href="#manual_buffering">手动缓冲</a></td>
      <td>完全控制</td>
      <td>需要由网站处理复杂的错误。</td>
    </tr>
  </tbody>
</table>

## 视频预加载属性

如果视频源是托管在 Web 服务器上的唯一文件，您可能希望使用视频  `preload` 属性向浏览器提供[有关要预加载多少信息或内容](/video-and-source-tags/#preload)的提示。这意味着[媒体源扩展 (MSE)](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API) 与 `preload` 不兼容。

仅当初始 HTML 文档已完全加载并解析（例如 `DOMContentLoaded` 事件已触发）后才会开始获取资源，而在实际获取资源时才会触发与之不同的 `load` 事件。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/De8tMHJUn3XyzFfosVLb.svg", alt="", width="800", height="234" %}</figure>

将 `preload` 属性设置为 `metadata` 表示用户不需要视频，但需要获取其元数据（尺寸、曲目列表、持续时间等）。请注意，从 [Chrome 64](https://developers.google.com/web/updates/2017/12/chrome-63-64-media-updates#media-preload-defaults-metadata) 开始，`preload` 的默认值是 `metadata` 。 （先前是 `auto`）。

```html
<video id="video" preload="metadata" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

将 `preload` 属性设置为 `auto` 表示浏览器可以缓存足够的数据，无需停止进一步缓冲即可完成播放。

```html
<video id="video" preload="auto" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

不过也有一些需要注意的地方。由于这只是一个提示，因此浏览器可能会完全忽略 `preload` 属性。在撰写本文时，以下是在 Chrome 中应用的一些规则：

- 启用[流量节省程序](https://support.google.com/chrome/answer/2392284)后，Chrome 会将 `preload` 值强制为 `none` 。
- 在 Android 4.3 中，由于 [Android 缺陷](https://bugs.chromium.org/p/chromium/issues/detail?id=612909)，Chrome 会将 `preload` 值强制为 `none`。
- 在蜂窝连接（2G、3G 和 4G）上，Chrome 会将 `preload` 值强制为 `metadata` 。

### 提示

如果您的网站在同一域中包含许多视频资源，我建议您将 `preload` 值设置为 `metadata` 或定义 `poster` 属性并将 `preload` 设置为`none` 。这样，即可避免达到同一域的最大 HTTP 连接数（根据 HTTP 1.1 规范为 6 个），这可能会挂起资源加载。请注意，如果视频不是您关注的重点，这也可能会提高页面速度。

## 链接预加载

像其他[文章](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)中[介绍的](https://developers.google.com/web/updates/2016/03/link-rel-preload)那样，[链接预加载](https://w3c.github.io/preload/)是一种声明性获取，可让您强制浏览器请求资源，而不会阻止 `load` 事件，同时页面也在下载。通过 `<link rel="preload">` 加载的资源存储在本地浏览器中，并且在 DOM、JavaScript 或 CSS 中显式引用它们之前，它们实际上是静止的。

预加载与预缓存的不同之处在于，前者专注于当前导航并根据资源的类型（脚本、样式、字体、视频、音频等）优先获取资源。它应该用于为当前会话预热浏览器缓存。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g5fQKJMivvcsHajmMmi2.svg", alt="", width="800", height="234" %}</figure>

### 预加载完整视频

以下是如何在您的网站上预加载完整视频的方法，这样当您的 JavaScript 要求获取视频内容时，它会从缓存中读取，因为浏览器可能已经缓存了该资源。如果预加载请求尚未完成，则会进行常规网络获取。

```js
<link rel="preload" as="video" href="https://cdn.com/small-file.mp4">

<video id="video" controls></video>

<script>
  // 随后，在满足某些条件后，将视频源设置为
  // 预加载视频 URL。
  video.src = 'https://cdn.com/small-file.mp4';
  video.play().then(() => {
    // 如果预加载视频 URL 已缓存，即会立即开始播放。
  });
</script>
```

{% Aside %} 我建议仅将此法用于小型媒体文件（小于 5MB）。 {% endAside %}

因为如果 `as` 预加载链接值为 `video`，预加载资源就会被视频元素消耗。如果它是一个音频元素，即为 `as="audio"` 。

### 预加载第一段

以下示例显示了如何使用 `<link rel="preload">` 预加载视频的第一段并将其与媒体源扩展一起使用。如果您不熟悉 MSE JavaScript API，请参阅 [MSE 基础知识](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API)。

为简单起见，我们假设整个视频已被拆分为较小的文件，例如 `file_1.webm` 、 `file_2.webm` 、 `file_3.webm` 等。

```html
<link rel="preload" as="fetch" href="https://cdn.com/file_1.webm">

<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // 如果视频已预加载，则获取会从浏览器
    // 缓存（内存缓存）中立即返回响应，否则，将执行
    // 常规网络获取。
    fetch('https://cdn.com/file_1.webm')
    .then(response => response.arrayBuffer())
    .then(data => {
      // 将数据追加到新的 sourceBuffer 中。
      sourceBuffer.appendBuffer(data);
      // TODO: 当用户开始播放视频时，获取 file_2.webm。
    })
    .catch(error => {
      // TODO: 向用户显示"视频不可用"消息。
    });
  }
</script>
```

{% Aside 'warning' %} 对于跨源资源，请确保您的 CORS 标头设置正确。 因为我们无法从 `fetch(videoFileUrl, { mode: 'no-cors' })` 获取的不透明响应创建数组缓冲区，我们将无法提供任何视频或音频元素。 {% endAside %}

### 支持

查看 MDN 的[浏览器兼容性](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)表，了解哪些浏览器支持预加载。您可能希望使用以下代码段检测其可用性，以调整您的性能指标。

```js
function preloadFullVideoSupported() {
  const link = document.createElement('link');
  link.as = 'video';
  return (link.as === 'video');
}

function preloadFirstSegmentSupported() {
  const link = document.createElement('link');
  link.as = 'fetch';
  return (link.as === 'fetch');
}
```

## 手动缓冲

在深入研究[缓存 API](https://developer.mozilla.org/docs/Web/API/Cache) 和服务工作进程之前，我们先来看看如何使用 MSE 手动缓冲视频。以下示例假设您的 Web 服务器支持 HTTP [`Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Range) 请求，但这与文件段非常相似。请注意，某些中间件库（例如 [Google 的 Shaka Player](https://github.com/google/shaka-player) 、 [JW Player](https://developer.jwplayer.com/) 和 [Video.js](http://videojs.com/)）就是为处理此问题而构建的。

```html
<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // 通过设置 Range HTTP 请求标头获取视频的开头。
    fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
    });
  }

  function updateEnd() {
    // 视频现在随时可以播放！
    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);

    // 当用户开始播放视频时，获取下一段。
    video.addEventListener('playing', fetchNextSegment, { once: true });
  }

  function fetchNextSegment() {
    fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
      // TODO: 获取接下来的段并予以追加。
    });
  }
</script>
```

### 注意事项

您现在可以控制整个媒体缓冲体验了，接下来我建议您在考虑预加载时关注一下设备的电池电量、“流量节省程序模式”用户首选项和网络信息。

#### 电池感知

在考虑预加载视频之前，请先看一下用户设备的电池电量。这会在电量低时延长电池寿命。

当设备电池耗尽时，禁用预加载或至少预加载较低分辨率的视频。

```js
if ('getBattery' in navigator) {
  navigator.getBattery()
  .then(battery => {
    // 如果电池正在充电或电池电量足够高
    if (battery.charging || battery.level > 0.15) {
      // TODO: 预加载视频的第一段。
    }
  });
}
```

#### 检测“流量节省程序”

使用 `Save-Data` 客户端提示请求标头向在浏览器中选择了“流量节省”模式的用户提供快速且轻便的应用程序。通过识别此请求标头，您的应用程序可以进行自定义并向成本和性能受限的用户提供最佳用户体验。

请参阅[使用 Save-Data 交付快速且轻便的应用程序](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data)以了解更多信息。

#### 基于网络信息的智能加载

在预加载之前，您可能要检查一下 `navigator.connection.type`，当它设置为 `cellular` 时 ，您可以阻止预加载并通知用户他们的移动网络运营商可能会对带宽收费，并且仅会开始自动播放以前缓存的内容。

```js
if ('connection' in navigator) {
  if (navigator.connection.type == 'cellular') {
    // TODO: 在预加载视频前提示用户
  } else {
    // TODO: 预加载视频的第一段。
  }
}
```

查看[网络信息示例](https://googlechrome.github.io/samples/network-information/)以了解如何对网络变化做出反应。

### 预缓存多个第一段

现在，如果我想试探性地预加载一些媒体内容，但不知道用户最终会选择哪段媒体怎么办？如果用户在一个包含 10 个视频的网页上，我们可能有足够的内存从每个视频中获取一个片段文件，但我们绝不应该创建 10 个隐藏的 `<video>` 元素和 10 个 `MediaSource` 对象并开始提供这些数据。

下面的两部分示例向您展示了如何使用强大易用的[缓存 API](/cache-api-quick-guide/) 预缓存多个视频的第一段。请注意，使用 IndexedDB 也可以实现类似的功能。我们还没有使用服务工作进程，因为缓存 API 也可以从 `window` 对象访问。

#### 获取和缓存

```js
const videoFileUrls = [
  'bat_video_file_1.webm',
  'cow_video_file_1.webm',
  'dog_video_file_1.webm',
  'fox_video_file_1.webm',
];

// 我们创建一个视频预缓存并在其中存储所有的视频第一段。
window.caches.open('video-pre-cache')
.then(cache => Promise.all(videoFileUrls.map(videoFileUrl => fetchAndCache(videoFileUrl, cache))));

function fetchAndCache(videoFileUrl, cache) {
  // 首先检查视频是否在缓存中。
  return cache.match(videoFileUrl)
  .then(cacheResponse => {
    // 如果视频已在缓存中，我们返回缓存的响应。
    if (cacheResponse) {
      return cacheResponse;
    }
    // 否则，从网络获取视频
    return fetch(videoFileUrl)
    .then(networkResponse => {
      // 将响应添加到缓存中，同时并行返回网络响应。
      cache.put(videoFileUrl, networkResponse.clone());
      return networkResponse;
    });
  });
}
```

注意，如果我之前使用的是 HTTP `Range` 请求，则必须手动重新创建一个 `Response` 对象，因为缓存 API [还](https://github.com/whatwg/fetch/issues/144)不支持 `Range` 响应。请注意，调用`networkResponse.arrayBuffer()` 会立即将响应的全部内容都提取到呈现程序内存中，这就是您可能想要使用小范围的原因。

为了供您参考，我修改了上面示例的一部分以将 HTTP Range 请求保存到视频预缓存中。

```js
    ...
    return fetch(videoFileUrl, { headers: { range: 'bytes=0-567139' } })
    .then(networkResponse => networkResponse.arrayBuffer())
    .then(data => {
      const response = new Response(data);
      // 将响应添加到缓存中，同时并行返回网络响应。
      cache.put(videoFileUrl, response.clone());
      return response;
    });
```

#### 播放视频

当用户单击播放按钮时，我们将获取缓存 API 中可用的第一段视频，这样就会在可用时立即开始播放。否则，我们将直接从网络中获取它。请记住，浏览器和用户可能会决定清除该[缓存](/storage-for-the-web/#eviction) 。

如前所述，我们会使用 MSE 将视频的第一段提供给视频元素。

```js
function onPlayButtonClick(videoFileUrl) {
  video.load(); // 后续能够播放视频。

  window.caches.open('video-pre-cache')
  .then(cache => fetchAndCache(videoFileUrl, cache)) // 在上文定义。
  .then(response => response.arrayBuffer())
  .then(data => {
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

    function sourceOpen() {
      URL.revokeObjectURL(video.src);

      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');
      sourceBuffer.appendBuffer(data);

      video.play().then(() => {
        // TODO: 在用户开始播放视频时，获取视频的其余部分。
      });
    }
  });
}
```

{% Aside 'warning' %} 对于跨源资源，请确保您的 CORS 标头设置正确。因为我们无法从 `fetch(videoFileUrl, { mode: 'no-cors' })` 获取的不透明响应创建数组缓冲区，我们将无法提供任何视频或音频元素。 {% endAside %}

### 使用 service worker 创建 Range 响应

现在，如果您已获取整个视频文件并将其保存在缓存 API 中怎么办？当浏览器发送一个 HTTP `Range` 请求，你肯定不希望把整个视频加入到呈现程序内存中，因为缓存 API [还](https://github.com/whatwg/fetch/issues/144)不支持 `Range` 响应。

接下来，我来展示如何拦截这些请求并从 service worker 返回自定义的 `Range` 响应。

```js
addEventListener('fetch', event => {
  event.respondWith(loadFromCacheOrFetch(event.request));
});

function loadFromCacheOrFetch(request) {
  // 为此请求搜索所有可用的缓存。
  return caches.match(request)
  .then(response => {

    // 如果它尚未在缓存中，则从网络获取。
    if (!response) {
      return fetch(request);
      // 注意，我们可能希望将响应添加到缓存中，同时并行
      // 返回网络响应。
    }

    // 浏览器发送一个 HTTP Range 请求。 让我们从缓存中
    // 手动重建一个。
    if (request.headers.has('range')) {
      return response.blob()
      .then(data => {

        // 从 Range 请求标头中获取起始位置。
        const pos = Number(/^bytes\=(\d+)\-/g.exec(request.headers.get('range'))[1]);
        const options = {
          status: 206,
          statusText: 'Partial Content',
          headers: response.headers
        }
        const slicedResponse = new Response(data.slice(pos), options);
        slicedResponse.setHeaders('Content-Range': 'bytes ' + pos + '-' +
            (data.size - 1) + '/' + data.size);
        slicedResponse.setHeaders('X-From-Cache': 'true');

        return slicedResponse;
      });
    }

    return response;
  }
}
```

需要注意的是，我使用 `response.blob()` 重建了这片响应，因为这只是给了我一个文件句柄，而 `response.arrayBuffer()` 会将整个文件加入到呈现程序内存中。

我的自定义 `X-From-Cache` HTTP 标头可用于判定此请求是来自缓存还是来自网络。[ShakaPlayer](https://github.com/google/shaka-player/blob/master/docs/tutorials/service-worker.md) 等播放器可以使用它来忽略响应时间作为网络速度的指标。

{% YouTube 'f8EGZa32Mts' %}

查看官方[示例媒体应用程序](https://github.com/GoogleChrome/sample-media-pwa)，特别是它的 [ranged-response.js](https://github.com/GoogleChrome/sample-media-pwa/blob/master/src/client/scripts/ranged-response.js) 文件，了解如何处理 `Range` 请求的完整解决方案。
