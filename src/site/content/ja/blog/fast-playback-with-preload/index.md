---
layout: post
title: 音声と動画のプリロードによる高速再生
subhead: リソースを積極的にプリロードしてメディアの再生を高速化する方法。
authors:
  - beaufortfrancois
description: 再生の開始が速ければ、あなたの動画を見たり音声を聞いたりする人が多くなります。これは動かぬ事実です。この記事では、ユースケースに応じてリソースを積極的にプリロードすることによってメディアの再生を加速するために使用できるテクニックを探ります。
date: 2017-08-17
updated: 2020-11-16
tags:
  - media
  - performance
  - network
---

再生の開始が速ければ、あなたの動画を見たり音声を聞いたりする人が多くなります。[これは動かぬ事実です](https://www.digitaltrends.com/web/buffer-rage/)。この記事では、ユースケースに応じてリソースを積極的にプリロードすることによって音声と動画の再生を加速するために使用できるテクニックを探ります。

<figure>
  <video controls muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.webm#t=1.1" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.mp4#t=1.1" type="video/mp4">
  </source></source></video>
  <figcaption>
    <p>クレジット: copyright Blender Foundation | <a href="http://www.blender.org">www.blender.org</a>.</p>
  </figcaption></figure>

メディアファイルをプリロードする3つの方法について、長所と短所から説明します。

<table>
  <tbody>
    <tr>
      <th></th>
      <th>適している...</th>
      <th>一方で...</th>
    </tr>
    <tr>
      <td rowspan="3" style="white-space: nowrap"><a href="#video_preload_attribute">動画プリロード属性</a></td>
      <td rowspan="3">Webサーバーでホストされている一意のファイルに簡単に使用できます。</td>
      <td>ブラウザは属性を完全に無視する場合があります。</td>
    </tr>
<tr>
      <td>HTMLドキュメントが完全にロードされ、解析されると、リソースのフェッチが開始されます。</td>
    </tr>
    <tr>
      <td>Media Source Extensions（MSE）にメディアを提供するのはアプリであるため、MSEはメディア要素の<code>preload</code>属性を無視します。</td>
    </tr>
    <tr>
      <td rowspan="2" style="white-space: nowrap"><a href="#link_preload">リンクプリロード</a></td>
      <td>ドキュメントの<code>onload</code>イベントをブロックせずに、ブラウザに動画リソースの要求を強制します。</td>
      <td>HTTP Range要求には互換性がありません。</td>
    </tr>
<tr>
      <td>MSEおよびファイルセグメントと互換性があります。</td>
      <td>完全なリソースをフェッチする場合は、小さなメディアファイル（&lt;5 MB）にのみ使用する必要があります。</td>
    </tr>
    <tr>
      <td><a href="#manual_buffering">手動バッファリング</a></td>
      <td>フルコントロール</td>
      <td>複雑なエラー処理はWebサイトで行います。</td>
    </tr>
  </tbody>
</table>

## 動画プリロード属性

動画ソースがWebサーバーでホストされている一意のファイルである場合は、動画`preload`属性を使用して、[プリロードする情報またはコンテンツの量](/video-and-source-tags/#preload)に関するヒントをブラウザに提供することをお勧めします。つまり、[Media Source Extensions（MSE）](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API)には、`preload`との互換性がありません。

リソースのフェッチは、最初のHTMLドキュメントが完全にロードされて解析（ `DOMContentLoaded`イベントが発生した場合など）されなければ開始されませんが、リソースが実際にフェッチされたときには、非常に異なる`load`イベントが発行されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/De8tMHJUn3XyzFfosVLb.svg", alt="", width="800", height="234" %}</figure>

`preload`属性を`metadata`に設定すると、ユーザーには動画は必要ないと想定するが、そのメタデータ（サイズ、トラックリスト、再生時間など）をフェッチすることが望ましいことを示します。[Chrome 64](https://developers.google.com/web/updates/2017/12/chrome-63-64-media-updates#media-preload-defaults-metadata)より、`preload`のデフォルト値は`metadata`であることに注意してください。（以前は`auto`でした。）

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

`preload`属性を`auto`に設定すると、ブラウザが十分なデータをキャッシュして、停止してさらにバッファリングすることなく完全な再生が可能になることを示します。

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

ただし、いくつかの注意点があります。これは単なるヒントであるため、ブラウザは`preload`属性を完全に無視する場合があります。これを書いている時点では、Chromeに以下のルールが適用されます。

- [データセーバー](https://support.google.com/chrome/answer/2392284)が有効になっている場合、Chromeは`preload`値を`none`に強制します。
- Android 4.3では、[Android バグ](https://bugs.chromium.org/p/chromium/issues/detail?id=612909)により、Chromeは`preload`値を`none`に強制します。
- セルラー接続（2G、3G、および4G）では、Chromeは`preload`値を`metadata`に強制します。

### ヒント

Webサイトに同じドメインに多数の動画リソースが含まれている場合は、`preload`値を`metadata`に設定するか、`poster`属性を定義して`preload`を`none`に設定することをお勧めします。そうすれば、同じドメインへのHTTP接続の最大数（HTTP 1.1仕様では6）に達してリソースのロードがハングしてしまう可能性を回避することができます。動画がコアユーザーエクスペリエンスの一部でない場合は、これによってページ速度も向上する可能性があります。

## リンクプリロード

他の[記事](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)で[説明](https://developers.google.com/web/updates/2016/03/link-rel-preload)されているように、[リンクプリロード](https://w3c.github.io/preload/)は、`load`イベントをブロックせずに、ページのダウンロード中にリソースを要求するようにブラウザを強制することができます。`<link rel="preload">`を介してロードされたリソースは、ブラウザにローカルに保存され、DOM、JavaScript、またはCSSで明示的に参照されるまで事実上、静止状態となります。

プリロードは、現在のナビゲーションに焦点を合わせ、タイプ（スクリプト、スタイル、フォント、動画、音声など）に基づいて優先的にリソースをフェッチするという点で、プリフェッチとは異なります。現在のセッションのブラウザキャッシュをウォームアップするために使用する必要があります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g5fQKJMivvcsHajmMmi2.svg", alt="", width="800", height="234" %}</figure>

### フル動画をプリロードする

JavaScriptが動画コンテンツのフェッチを要求したときに、リソースがブラウザによってすでにキャッシュされている可能性があるため、キャッシュから読み取られるように、以下のようにして、Webサイトに動画全体をプリロードすることができます。プリロード要求がまだ終了していない場合は、通常のネットワークフェッチが発生します。

```js
<link rel="preload" as="video" href="https://cdn.com/small-file.mp4">

<video id="video" controls></video>

<script>
  // Later on, after some condition has been met, set video source to the
  // preloaded video URL.
  video.src = 'https://cdn.com/small-file.mp4';
  video.play().then(() => {
    // If preloaded video URL was already cached, playback started immediately.
  });
</script>
```

{% Aside %}これは小さなメディアファイル（5MB未満）にのみ使用することをお勧めします。 {% endAside %}

プリロードされたリソースはこの例の動画要素によって消費されるため、`as`プリロードリンクの値は`video`になっています。音声要素の場合は、 `as="audio"`です。

### 最初のセグメントをプリロードする

以下の例は、`<link rel="preload">`を使って動画の最初のセグメントをプリロードし、それをMedia Source Extensionsで使用する方法を示しています。MSE JavaScript APIに詳しくない場合は、「[MSEの基本](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API)」を参照してください。

単純化するために、動画全体が、`file_1.webm`、`file_2.webm`、`file_3.webm`などの小さなファイルに分割されていると仮定します。

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

    // If video is preloaded already, fetch will return immediately a response
    // from the browser cache (memory cache). Otherwise, it will perform a
    // regular network fetch.
    fetch('https://cdn.com/file_1.webm')
    .then(response => response.arrayBuffer())
    .then(data => {
      // Append the data into the new sourceBuffer.
      sourceBuffer.appendBuffer(data);
      // TODO: Fetch file_2.webm when user starts playing video.
    })
    .catch(error => {
      // TODO: Show "Video is not available" message to user.
    });
  }
</script>
```

{% Aside 'warning' %} クロスオリジンリソースの場合、CORSヘッダーが適切に設定されていることを確認してください。 `fetch(videoFileUrl, { mode: 'no-cors' })`でフェッチされた不透明な応答から配列バッファーを作成できないため、動画または音声要素をフィードすることはできません。 {% endAside %}

### サポート

どのブラウザがプリロードをサポートしているかを確認するには、MDNの[ブラウザ互換性](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)テーブルを参照してください。以下のスニペットを使用してその可用性を検出し、パフォーマンス指標を調整することをお勧めします。

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

## 手動バッファリング

[Cache API](https://developer.mozilla.org/docs/Web/API/Cache)とService Workerに飛び込む前に、MSEを使用して動画を手動でバッファリングする方法を見てみましょう。以下の例では、WebサーバーがHTTP [`Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Range)要求をサポートしていることを前提としていますが、これはファイルセグメントと非常によく似ています。[GoogleのShaka Player](https://github.com/google/shaka-player)、[JW Player](http://videojs.com/)、[Video.js](https://developer.jwplayer.com/)などの一部のミドルウェアライブラリは、これを処理するように構築されていることに注意してください。

```html
<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // Fetch beginning of the video by setting the Range HTTP request header.
    fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
    });
  }

  function updateEnd() {
    // Video is now ready to play!
    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);

    // Fetch the next segment of video when user starts playing the video.
    video.addEventListener('playing', fetchNextSegment, { once: true });
  }

  function fetchNextSegment() {
    fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
      // TODO: Fetch further segment and append it.
    });
  }
</script>
```

### 考慮事項

メディアバッファリングエクスペリエンス全体を制御できるようになったので、プリロードを検討するときは、デバイスのバッテリーレベル、「データセーバーモード」のユーザー設定、およびネットワーク情報を考慮することをお勧めします。

#### バッテリー対応

動画のプリロードを検討する前に、ユーザーのデバイスのバッテリーレベルを考慮してください。これにより、電力レベルが低いときにバッテリーの寿命を延ばすことができます。

デバイスのバッテリーが不足している場合は、プリロードを無効にするか、少なくとも低解像度の動画をプリロードします。

```js
if ('getBattery' in navigator) {
  navigator.getBattery()
  .then(battery => {
    // If battery is charging or battery level is high enough
    if (battery.charging || battery.level > 0.15) {
      // TODO: Preload the first segment of a video.
    }
  });
}
```

#### 「データセーバー」を検出する

`Save-Data`クライアントヒント要求ヘッダーを使用して、ブラウザで「データ節約」モードにオプトインしているユーザーに高速で軽量なアプリケーションを配信します。この要求ヘッダーを特定することで、アプリケーションはコストとパフォーマンスに制約のあるユーザーに最適化されたユーザーエクスペリエンスをカスタマイズして配信することができます。

詳細については、「[Save-Dataを使用して高速で軽量なアプリケーションを配信する](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data)」を参照してください。

#### ネットワーク情報に基づくスマートローディング

プリロードする前に、`navigator.connection.type`を確認することをお勧めします。`cellular`に設定すると、プリロードを防ぎ、モバイルネットワークオペレーターが帯域幅の料金を請求している可能性があることをユーザーに通知し、以前にキャッシュされたコンテンツの自動再生のみを開始できます。

```js
if ('connection' in navigator) {
  if (navigator.connection.type == 'cellular') {
    // TODO: Prompt user before preloading video
  } else {
    // TODO: Preload the first segment of a video.
  }
}
```

[ネットワーク情報のサンプル](https://googlechrome.github.io/samples/network-information/)をチェックして、ネットワークの変更に対応する方法も確認してください。

### 複数の最初のセグメントを事前にキャッシュする

ユーザーが最終的にどのメディアを選択するかを知らずに、投機的にメディアコンテンツをプリロードしたい場合はどうすればよいでしょうか？ユーザーが10本の動画を含むWebページを使用している場合、それぞれから1つのセグメントファイルをフェッチするのに十分なメモリがあるかもしれませんが、10個の非表示の`<video>`要素と10個の`MediaSource`オブジェクトを作成して、そのデータのフィードを開始してはいけません。

以下の2部構成の例は、強力で使いやすい[Cache API](/cache-api-quick-guide/)を使用して、動画の最初のセグメントを事前に複数キャッシュする方法を示しています。IndexedDBでも同様のことが実現できることに注意してください。Cache APIは`window`オブジェクトからもアクセスできるため、Service Workerはまだ使用していません。

#### フェッチとキャッシュ

```js
const videoFileUrls = [
  'bat_video_file_1.webm',
  'cow_video_file_1.webm',
  'dog_video_file_1.webm',
  'fox_video_file_1.webm',
];

// Let's create a video pre-cache and store all first segments of videos inside.
window.caches.open('video-pre-cache')
.then(cache => Promise.all(videoFileUrls.map(videoFileUrl => fetchAndCache(videoFileUrl, cache))));

function fetchAndCache(videoFileUrl, cache) {
  // Check first if video is in the cache.
  return cache.match(videoFileUrl)
  .then(cacheResponse => {
    // Let's return cached response if video is already in the cache.
    if (cacheResponse) {
      return cacheResponse;
    }
    // Otherwise, fetch the video from the network.
    return fetch(videoFileUrl)
    .then(networkResponse => {
      // Add the response to the cache and return network response in parallel.
      cache.put(videoFileUrl, networkResponse.clone());
      return networkResponse;
    });
  });
}
```

HTTP `Range`要求を使用する場合、Cache APIは[まだ](https://github.com/whatwg/fetch/issues/144)`Range`応答をサポートしていないため、`Response`オブジェクトを手動で再作成する必要があることに注意してください。 `networkResponse.arrayBuffer()`を呼び出すと、応答のコンテンツ全体がレンダラーメモリに一度にフェッチされることに注意してください。そのため、狭い範囲を使用することをお勧めします。

参考までに、上記の例の一部を変更して、HTTP Range要求を動画プリキャッシュに保存しました。

```js
    ...
    return fetch(videoFileUrl, { headers: { range: 'bytes=0-567139' } })
    .then(networkResponse => networkResponse.arrayBuffer())
    .then(data => {
      const response = new Response(data);
      // Add the response to the cache and return network response in parallel.
      cache.put(videoFileUrl, response.clone());
      return response;
    });
```

#### 動画を再生する

ユーザーが再生ボタンをクリックすると、利用可能な場合はすぐに再生が開始されるように、Cache APIで利用可能な動画の最初のセグメントがフェッチされます。それ以外の場合は、単にネットワークからフェッチします。ブラウザとユーザーが[キャッシュ](/storage-for-the-web/#eviction)をクリアする可能性があることに注意してください。

前に見たように、MSEを使用して、動画の最初のセグメントを動画要素にフィードします。

```js
function onPlayButtonClick(videoFileUrl) {
  video.load(); // Used to be able to play video later.

  window.caches.open('video-pre-cache')
  .then(cache => fetchAndCache(videoFileUrl, cache)) // Defined above.
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
        // TODO: Fetch the rest of the video when user starts playing video.
      });
    }
  });
}
```

{% Aside 'warning' %} クロスオリジンリソースの場合、CORSヘッダーが適切に設定されていることを確認してください。 `fetch(videoFileUrl, { mode: 'no-cors' })`でフェッチされた不透明な応答から配列バッファーを作成できないため、動画または音声要素をフィードすることはできません。 {% endAside %}

### Service WorkerでRange応答を作成する

動画ファイル全体をフェッチしてCache APIに保存した場合はどうなるでしょうか？ブラウザがHTTP `Range`要求を送信するとき、Cache APIは[まだ](https://github.com/whatwg/fetch/issues/144)`Range`応答をサポートしていないため、動画全体をレンダラーメモリに入れたくないことは確かです。

それでは、これらの要求をインターセプトして、Service Workerからカスタマイズされた`Range`応答を返す方法を説明しましょう。

```js
addEventListener('fetch', event => {
  event.respondWith(loadFromCacheOrFetch(event.request));
});

function loadFromCacheOrFetch(request) {
  // Search through all available caches for this request.
  return caches.match(request)
  .then(response => {

    // Fetch from network if it's not already in the cache.
    if (!response) {
      return fetch(request);
      // Note that we may want to add the response to the cache and return
      // network response in parallel as well.
    }

    // Browser sends a HTTP Range request. Let's provide one reconstructed
    // manually from the cache.
    if (request.headers.has('range')) {
      return response.blob()
      .then(data => {

        // Get start position from Range request header.
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

`response.blob()`を使用してこのスライスされた応答を再作成したことに注意してください。これは`response.arrayBuffer()`がファイル全体をレンダラーメモリに取り込むときに、ファイルへのハンドルを提供するだけであるためです。

私のカスタム`X-From-Cache` HTTPヘッダーを使用すると、この要求がキャッシュからのものか、ネットワークからのものかを知ることができます。[ShakaPlayer](https://github.com/google/shaka-player/blob/master/docs/tutorials/service-worker.md)などのプレーヤーは、ネットワーク速度の指標としての応答時間を無視するために使用できます。

{% YouTube 'f8EGZa32Mts' %}

`Range`要求を処理する方法の完全なソリューションについては、公式の[サンプルメディアアプリ](https://github.com/GoogleChrome/sample-media-pwa)と、特にその[ranged-response.js](https://github.com/GoogleChrome/sample-media-pwa/blob/master/src/client/scripts/ranged-response.js)ファイルをご覧ください。
