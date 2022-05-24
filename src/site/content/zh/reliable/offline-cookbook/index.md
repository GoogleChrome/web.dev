---
layout: post
title: 离线指南
description: 让应用程序离线工作的一些常见方法。
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

由于[服务工作进程](/service-workers-cache-storage/)的出现，我们不再尝试离线解决问题，而是让开发人员自己动手解决。通过它可以控制缓存以及如何处理请求。这意味着您可以创建自己的模式。让我们分别了解几种可能的模式，但在实践中，您可能会根据 URL 和上下文同时使用多种模式。

有关其中一些模式的工作演示，请参见 [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 和展示性能影响的[这个视频](https://www.youtube.com/watch?v=px-J9Ghvcx4)。

## 缓存机 — 何时存储资源

[服务工作进程](/service-workers-cache-storage/)允许独立于缓存处理请求，因此我将分开演示。首先，应该何时进行缓存？

### 安装时 — 作为依赖项 {: #on-install-as-dependency }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="安装时 - 作为依赖项。", width="800", height="498" %} <figcaption>安装时 - 作为依赖项。</figcaption></figure>

服务工作进程提供了 `install` 事件，可以使用该事件来准备必须在处理其他事件前就绪的内容。在执行此操作时，先前版本的服务工作进程仍在运行并提供页面，所以此操作不得干扰其他服务。

**适合：**CSS、图像、字体、JS、模板… 基本上您认为对于您网站的特定“版本”为静态的任何内容。

如果无法获取这些内容，整个网站都不能正常运行，类似的平台特定应用程序会在初始下载中包含这些内容。

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil` 采用一个 promise 来定义安装的长度和是否成功。如果该 promise 拒绝，则安装被认为失败，该服务工作进程将被放弃（如果旧版本正在运行，它将保持原样）。`caches.open()` 和 `cache.addAll()` 返回 promise。如果无法获取其中任何资源，则 `cache.addAll()` 调用将拒绝。

在 [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 上，我使用此方法来[缓存静态资产](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3)。

### 安装时 — 不作为依赖项 {: #on-install-not }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt="安装时 - 不作为依赖项。", width="800", height="500" %}<figcaption>安装时 - 不作为依赖项。</figcaption></figure>

与上面相似，但不会使安装延迟完成，并且缓存失败不会导致安装失败。

**适合：**不需要立即使用的较大资源，例如游戏后期的关卡资产。

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

上面的示例没有针对第 11-20 关将 `cache.addAll` promise 传递回 `event.waitUntil`，因此即使它失败，游戏仍然可以离线游玩。当然，您必须考虑到可能缺少这些关卡，并且一旦缺少这些关卡就重新尝试缓存它们。

在下载第 11-20 关时，服务工作进程可能会被终止，因为它已完成事件处理，这意味着这些事件不会被缓存。将来，[Web 定期后台同步 API](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API) 将处理此类情况以及大型下载（例如电影）。目前，该 API 只在 Chromium 分支受到支持。

### 激活时 {: #on-activate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt="激活时。", width="800", height="500" %} <figcaption>激活时。</figcaption></figure>

**适合：**清理和迁移。

安装新的服务工作进程并且不再使用以前的版本后，新版本将激活，并且您会收到一个 `activate` 事件。由于旧版本已经过时，这正是处理 [IndexedDB 中的架构迁移](/indexeddb-best-practices/)以及删除未使用缓存的好时机。

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

在激活期间，其他事件（例如 `fetch`）将被放入队列，因此长时间激活可能会阻止页面加载。请确保激活尽可能精简，并且仅将其用于在旧版本有效时*无法*执行的操作。

在 [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 上，我使用此方法来[删除旧缓存](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17)。

### 用户交互时 {: #on-user-interaction }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="用户交互时。", width="800", height="222" %} <figcaption>用户交互时。</figcaption></figure>

**适合：**当整个网站无法离线使用，并且您选择允许用户选择他们希望离线使用的内容时。例如，YouTube 之类的网站上的视频、Wikipedia 上的文章、Flickr 上的特定图库。

为用户提供“稍后阅读”或“保存以供离线使用”按钮。单击按钮后，将从网络获取所需内容并将放入缓存中。

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

[缓存 API](https://developer.mozilla.org/docs/Web/API/Cache) 可在页面和服务工作进程中使用，这意味着无需让服务工作进程将内容添加到缓存中。

### 网络响应时 {: #on-network-response }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="网络响应时。", width="800", height="390" %} <figcaption>网络响应时。</figcaption></figure>

**适合：**频繁更新的资源，例如用户的收件箱或文章内容。也可用于不重要内容，例如头像，但需要小心。

如果请求与缓存中的任何内容都不匹配，则从网络获取内容，将其发送到页面，同时添加到缓存中。

如果对一系列 URL（例如头像）执行此操作，则需要小心不要使您的源存储空间膨胀。如果用户需要回收磁盘空间，您不会希望成为主要清除对象。确保清除缓存中不再需要的项目。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

为了有效使用内存，一次只能读取一个响应/请求的正文。上面的代码使用 [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone) 创建可以单独读取的额外副本。

在 [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 上，我使用此方法来[缓存 Flickr 图像](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109)。

### Stale-while-revalidate {: #stale-while-revalidate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="Stale-while-revalidate。", width="800", height="388" %} <figcaption>Stale-while-revalidate。</figcaption></figure>

**适合：**频繁更新，但不需要最新版本的资源。头像可以属于这类资源。

如果有可用的缓存版本，则使用它，但下次获取更新。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

这与 HTTP 的 [stale-while-revalidate](https://www.mnot.net/blog/2007/12/12/stale) 非常相似。

### 推送消息时 {: #on-push-message }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="推送消息时。", width="800", height="498" %} <figcaption>推送消息时。</figcaption></figure>

[Push API](/push-notifications/) 是构建在服务工作进程之上的另一个功能。它允许唤醒服务工作进程以响应来自操作系统消息服务的消息。即使用户没有标签页打开您的网站，此功能仍然有效。只有服务工作进程被唤醒。执行此操作的权限将从页面请求，系统将提示用户。

**适合：**与通知相关的内容，例如聊天消息、突发新闻或电子邮件。也适合不频繁变化但受益于即时同步的内容，例如待办事项列表更新或日历变化。

{% YouTube '0i7YdSEQI1w' %}

常见的最终结果是一个通知，点击它将打开/聚焦相关页面，但在此之前更新缓存*极其*重要。用户在收到推送消息时显然是在线的，但他们最终与通知交互时，可能并不在线，所以让这些内容离线可用是非常重要的。

以下代码在显示通知之前更新缓存：

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

### 后台同步时 {: #on-background-sync }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="后台同步时。", width="800", height="219" %} <figcaption>后台同步时。</figcaption></figure>

[后台同步](https://developer.chrome.com/blog/background-sync/)是构建在服务工作进程之上的另一个功能。它允许一次性或以一个（极具启发性的）时间间隔请求后台数据同步。即使用户没有标签页打开您的网站，此功能仍然有效。只有服务工作进程被唤醒。执行此操作的权限将从页面请求，系统将提示用户。

**适合：**非紧急更新，尤其是那些每次更新都推送消息对于用户来说过于频繁的定期更新，例如社交媒体时间线或新闻文章。

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## 缓存持久性 {: #cache-persistence }

您的源会被给予一定容量的可用空间来做它想做的事情。该可用空间在所有源存储之间共享：[（本地）存储](https://developer.mozilla.org/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/docs/Glossary/IndexedDB)、[文件系统访问](/file-system-access/)，当然还有[缓存](https://developer.mozilla.org/docs/Web/API/Cache)。

您获得的容量不会明确指定，它会因设备和存储条件而异。您可以通过以下方式了解获得多少容量：

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

但是，与所有浏览器存储一样，如果设备承受存储压力，浏览器可以随意丢弃您的数据。不幸的是，浏览器无法区分您不惜一切代价想要保留的电影与您并不真正在意的游戏之间的区别。

要解决此问题，请使用 [StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager) 接口：

```js
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
});
```

当然，用户必须授予权限。为此，请使用 Permissions API。

让用户成为这个流程的一部分很重要，因为我们现在可以期望他们控制删除。如果他们的设备面临存储压力，而清除非必要数据并不能解决问题，则用户可以判断要保留和删除哪些项目。

为此，需要操作系统在存储使用情况的细分中将“持久”源视为等同于平台特定的应用程序，而不是将浏览器作为单一项目来报告。

## 服务建议 — 响应请求 {: #serving-suggestions }

无论您做了多少缓存，服务工作进程都不会使用缓存，除非您告诉它何时以及如何使用。以下是一些处理请求模式：

### 仅缓存 {: #cache-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="仅缓存。", width="800", height="272" %} <figcaption>仅缓存。</figcaption></figure>

**适合：**您认为对于您网站的特定“版本”为静态的任何内容。您应该已在 install 事件中缓存这些内容，因此您可以依赖它们。

```js
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

尽管您通常不需要进行专门处理，但[缓存优先，网络为回退方案](#cache-falling-back-to-network)涵盖了这种情况。

### 仅网络 {: #network-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="仅网络。", width="800", height="272" %}<figcaption>仅网络。</figcaption></figure>

**适合：**没有离线等效项的内容，例如分析 ping、非 GET 请求。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

尽管您通常不需要进行专门处理，但[缓存优先，网络为回退方案](#cache-falling-back-to-network)涵盖了这种情况。

### 缓存优先，网络为回退方案 {: #cache-falling-back-to-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="缓存优先，网络为回退方案。", width="800", height="395" %} <figcaption>缓存优先，网络为回退方案。</figcaption></figure>

**适合：**构建离线优先内容。在这种情况下，这就是您处理大多数请求的方式。其他模式将是例外，具体取决于传入请求。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

这为缓存中的内容提供“仅缓存”行为，为未缓存的内容（包括所有非 GET 请求，因为它们不能被缓存）提供“仅网络”行为。

### 缓存和网络竞赛 {: #cache-and-network-race }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt="缓存和网络竞争。", width="800", height="427" %}<figcaption>缓存和网络竞赛。</figcaption></figure>

**适合：**在磁盘访问速度较慢的设备上追求性能的小型资产。

如果是较旧的硬盘驱动器、病毒扫描程序和较快的互联网组合，在某些情况下，从网络获取资源可能比从磁盘获取资源更快。但是，当用户的设备上有内容时，从网络获取资源可能是浪费数据，所以请记住这一点。

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### 网络优先，缓存为回退方案 {: #network-falling-back-to-cache }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="网络优先，缓存为回退方案。", width="800", height="388" %}<figcaption>网络优先，缓存为回退方案。</figcaption></figure>

**适合：**快速修正在网站“版本”外部经常更新的资源。例如文章、头像、社交媒体时间线和游戏排行榜。

这意味着您为在线用户提供最新的内容，但离线用户获得较旧的缓存版本。如果网络请求成功，您很可能希望[更新缓存条目](#on-network-response)。

但是，这种方法有缺陷。如果用户的连接时断时续或缓慢，他们将不得不等待网络请求失败，然后才能获得其设备上已有的可接受内容。这可能需要很长时间，并且是令人沮丧的用户体验。请参见下一个模式，[先缓存，再网络](#cache-then-network) ，以获得更好的解决方案。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### 先缓存，再网络 {: #cache-then-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="先缓存，再网络。", width="800", height="478" %} <figcaption>先缓存，再网络。</figcaption></figure>

**适合：**频繁更新的内容。例如文章、社交媒体时间线和游戏排行榜。

这需要页面发出两个请求，一个发往缓存，一个发往网络。理念是先显示缓存的数据，然后在网络数据到达时更新页面。

有时可以在新数据到达时替换当前数据（例如游戏排行榜），但这可能会破坏较大块的内容。基本上，不要让用户可能正在阅读或与之交互的内容“消失”。

Twitter 在旧内容上方添加新内容并调整滚动位置，因此用户不会受到干扰。这是可行的，因为 Twitter 几乎保留了内容的线性顺序。我为 [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 复制了这个模式，以尽快在屏幕上显示内容，同时在最新内容到达时立即显示。

**页面中的代码：**

```js
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**服务工作进程中的代码：**

您应该始终访问网络并随时更新缓存。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

在 [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 中，我的变通方法是使用 [XHR 而不是 fetch](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3)，并滥用 Accept 标头来告诉服务工作进程从哪里获取结果（[页面代码](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70)、[服务工作进程代码](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61)）。

### 通用回退 {: #generic-fallback }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="通用回退。", width="800", height="389" %} <figcaption>通用回退。</figcaption></figure>

如果无法从缓存和/或网络提供内容，则可能需要提供通用回退。

**适合：**次要图像，例如头像、失败的 POST 请求和“离线时不可用”页面。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function (response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL and headers.
        // Eg, a fallback silhouette image for avatars.
      }),
  );
});
```

回退到的项目可能是[安装依赖项](#on-install-as-dependency)。

如果页面正在发布电子邮件，服务工作进程可能会回退到将电子邮件存储在 IndexedDB 的“发件箱”中，并以让页面知道发送失败但数据已成功保留的方式来响应。

### 服务工作进程端模板 {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="服务工作进程端模板。", width="800", height="463" %} <figcaption>服务工作进程端模板。</figcaption></figure>

**适合：**无法缓存服务器响应的页面。

[在服务器上渲染页面可加速](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)，但这可能意味着将没有意义的状态数据包含在缓存中，例如“登录身份…”。如果页面由服务工作进程控制，您可以改为选择请求 JSON 数据和模板，并进行渲染。

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## 总结

您不会局限于这些方法中的一种。事实上，您可能会根据请求 URL 使用其中许多方法。例如，[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) 使用：

- [安装时缓存](#on-install-as-dependency)，用于静态 UI 和行为
- [网络响应时缓存](#on-network-response)，用于 Flickr 图像和数据
- [从缓存获取，回退到网络](#cache-falling-back-to-network)，用于大多数请求
- [先从缓存获取，再从网络获取](#cache-then-network)，用于 Flickr 搜索结果

只需查看请求，然后决定如何操作：

```js
self.addEventListener('fetch', function (event) {
  // Parse the URL:
  var requestURL = new URL(event.request.url);

  // Handle requests to a particular host specifically
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* some combination of patterns */);
    return;
  }
  // Routing for local URLs
  if (requestURL.origin == location.origin) {
    // Handle article URLs
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Flagrant cheese error', {
          status: 512,
        }),
      );
      return;
    }
  }

  // A sensible default pattern
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

…您就明白了。

### 致谢

可爱图标的出处：

- buzzyrobot 的 [Code](http://thenounproject.com/term/code/17547/)
- Scott Lewis 的 [Calendar](http://thenounproject.com/term/calendar/4672/)
- Ben Rizzo 的 [Network](http://thenounproject.com/term/network/12676/)
- Thomas Le Bas 的 [SD](http://thenounproject.com/term/sd-card/6185/)
- iconsmind.com 的 [CPU](http://thenounproject.com/term/cpu/72043/)
- trasnik 的 [Trash](http://thenounproject.com/term/trash/20538/)
- @daosme 的 [Notification](http://thenounproject.com/term/notification/32514/)
- Mister Pixel 的 [Layout](http://thenounproject.com/term/layout/36872/)
- P.J. Onori 的 [Cloud](http://thenounproject.com/term/cloud/2788/)

感谢 [Jeff Posnick](https://twitter.com/jeffposnick) 在我点下“发布”之前捕捉到许多错误。

### 进阶阅读

- [服务工作进程 — 简介](/service-workers-cache-storage/)
- [服务工作进程是否就绪？](https://jakearchibald.github.io/isserviceworkerready/)— 跟踪主要浏览器的实现状态
- [JavaScript Promise — 简介](/promises) - promise 指南
