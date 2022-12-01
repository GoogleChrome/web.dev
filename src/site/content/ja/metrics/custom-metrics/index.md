---
layout: post
title: カスタムメトリック
authors:
  - philipwalton
date: 2019-11-08
description: |2-

  カスタムメトリックを使用すると、サイト固有の体験を構成する各要素を評価、最適化できます。
tags:
  - performance
  - metrics
---

特定のウェブサイトで普遍的に測定できる[user-centric metrics  (ユーザー中心のメトリック)](/user-centric-performance-metrics/)を持つことには多くの価値があります。これらのメトリックを活用すると、以下のことを行えます。

- ユーザーの全面的なウェブ体験を理解できる
- 自分のサイトを競合他社のサイトと簡単に比較できる
- カスタムコードを記述せずに、分析ツールで有用かつ実用的なデータを追跡できる

ユニバーサルメトリクスは、便利なベースラインですが、多くの場合、特定のサイトの全体的なエクスペリエンスを把握するには、こうしたメトリクス*以外のメトリクス*も評価しなくてはいけません。

カスタムメトリックを使用すると、以下のような、自分のサイトだけに該当する可能性があるサイトエクスペリエンスの要素を評価できます。

- シングルページアプリ（SPA）がある「ページ」から別の「ページ」に移行するのにかかる時間
- ログインしたユーザーのためにデータベースからフェッチされたデータをページに表示するのにかかる時間
- サーバー側でレンダリングされた（SSR）アプリが[ハイドレイト](https://addyosmani.com/blog/rehydration/)するのにかかる時間
- リピーターによってロードされたリソースのキャッシュヒット率
- ゲーム内のクリックイベントまたはキーボードイベントのイベントレイテンシ

## カスタムメトリックを測定するためのAPI

これまで、ウェブ開発者は、パフォーマンスを測定するための低レベルAPIをあまり持っていなかったため、サイトのパフォーマンスを測定する場合はハッキングに頼らざるを得ませんでした。

たとえば、`requestAnimationFrame`ループを実行し、各フレーム間のデルタを計算することで、JavaScriptタスクの実行時間が長いためにメインスレッドがブロックされているかどうかを判断できます。デルタがディスプレイのフレームレートよりも大幅に長い場合は、長いタスクとして報告できます。ただし、このようなハッキングは、実際にはパフォーマンス自体に影響を与えるため（たとえば、バッテリーの消耗など）、お勧めできません。

効果的にパフォーマンスを測定するための最初のルールは、パフォーマンス測定手法自体がパフォーマンスの問題を引き起こしていないことを確認することです。したがい、サイトで測定するカスタムメトリックについては、可能であれば次のAPIのいずれかを使用することをお勧めします。

### パフォーマンスオブザーバー

PerformanceObserver APIを理解することは、カスタムパフォーマンスメトリックを作成するために重要です。理由は、それがこの記事で説明する他のすべてのパフォーマンスAPIからデータを取得するメカニズムであるためです。

`PerformanceObserver`を使用すると、パフォーマンス関連のイベントを受動的にサブスクライブできます。つまり、これらのAPIは通常、[アイドル期間中](https://w3c.github.io/requestidlecallback/#idle-periods)にコールバックが発生するため、ページのパフォーマンスに干渉しません。

`PerformanceObserver`を作成するには、新しいパフォーマンスエントリがディスパッチされるたびに実行されるコールバックを渡します。そして、[`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe)メソッドを介してリッスンするエントリのタイプをオブザーバーに知らせます。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });

  po.observe({type: 'some-entry-type'});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

以下のセクションでは、監視に使用できるさまざまなエントリタイプをすべて挙げていますが、新しいブラウザでは、静的な[`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute)プロパティを使えば、利用できるエントリタイプを調べることができます。

{% Aside %}`observe()`メソッドに渡されるオブジェクトは`entryTypes`配列を指定することもできます（同じオブザーバーを介して複数のエントリタイプを監視するため）。`entryTypes`を指定するのは、数多くのブラウザーでサポートされている古いオプションですが、`type`を使用すると、エントリ固有の監視構成 (次に説明する`buffered`など) を追加で指定できるため、今ではそれが優先されるようになりました。{% endAside %}

#### すでに発生したエントリを監視する

デフォルトでは、`PerformanceObserver`オブジェクトは、エントリが発生したときにのみ監視できます。これは、パフォーマンス分析コードを遅延ロードする場合（優先度の高いリソースをブロックしないため）に問題になる可能性があります。

(発生した後の) 履歴エントリを取得するには、`observe()`を呼び出すときに、`buffered`フラグを`true`に設定します。`PerformanceObserver`コールバックが最初に呼び出されるときに、ブラウザは、自身の[performance entry buffer](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer)の履歴エントリを含みます。

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %}メモリの問題を回避できるよう、パフォーマンスエントリバッファには制限が設けられています。たいていの一般的なページの読み込みでは、バッファがいっぱいになり、エントリが失われる可能性はほとんどありません。{% endAside %}

#### 避けるべきレガシーパフォーマンスAPI

Performance Observer APIが生まれる前、開発者は[`performance`](https://w3c.github.io/performance-timeline/)オブジェクトで定義された次の3つのメソッドを使用してパフォーマンスエントリにアクセスすることができました。

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

これらのAPIは今もサポートされていますが、新しいエントリが発信されるタイミングをリッスンできないため、使用することはお勧めていません。さらに、多くの新しいAPI（Long Tasksなど）は、`performance`を介して公開されません。`PerformanceObserver`を介してのみ公開されます。

Internet Explorerとの互換性が必要でない限りは、コードにこうしたメソッドを使うことは避け、今後は`PerformanceObserver`を使う方が無難でしょう。

### User Timing API

[User Timing API](https://w3c.github.io/user-timing/)は、時間ベースのメトリックを測定するためのAPIです。これにより、特定の時点を任意にマークし、後からそれらのマークの間の期間を測定することができます。

```js
// Record the time immediately before running a task.
performance.mark('myTask:start');
await doMyTask();
// Record the time immediately after running a task.
performance.mark('myTask:end');

// Measure the delta between the start and end of the task
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

`Date.now()`や`performance.now()`といったAPIは、同様の機能を提供しますが、User Timing APIを使用することには、パフォーマンスツールとうまく統合できるという利点があります。たとえば、Chrome DevToolsは[[パフォーマンス]パネルにユーザータイミングの測定値](https://developers.google.com/web/updates/2018/04/devtools#tabs)を視覚化します。また、多くの分析プロバイダーは、ユーザーが行った測定値を自動的に追跡し、期間データを分析バックエンドに送信します。

ユーザータイミングの測定値をレポートするには、 [PerformanceObserver](#performance-observer)を使って、`measure`型のエントリを監視する登録を行います。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `measure` entries to be dispatched.
  po.observe({type: 'measure', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Long Tasks API

[Long Tasks API](https://w3c.github.io/longtasks/)は、ブラウザのメインスレッドがフレームレートや入力遅延に影響を与えるのに十分な時間がブロックされているかどうかを知るのに役立ちます。現在、このAPIは、50ミリ秒 (ms) を超えて実行されるすべてのタスクを報告します。

高価なコードを実行する（または大きなスクリプトをロードして実行する）必要があるときは、そのコードがメインスレッドをブロックしたかどうかを追跡すると便利です。実際、多くの高レベルのメトリックは、Long Tasks APIそのものを基に構築されています(such as [Time to Interactive (TTI)](/tti/) や [Total Blocking Time (TBT)など。](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/))

長いタスクがいつ発生するかを判断するには、 [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)を使って、`longtask`型のエントリを監視する登録を行います。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `longtask` entries to be dispatched.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Element Timing API

[Largest Contentful Paint（LCP）](/lcp/)メトリックは、最大の画像またはテキストブロックがいつ画面にペイントされたかを知るのに役立ちますが、場合によっては、別の要素のレンダリング時間を測定する必要があります。

このような場合は、 [Element TimingAPIを](https://wicg.github.io/element-timing/)使用できます。実際、Largest Contentful PaintAPIはElementTiming APIを基に構築されており、最大のcontentful要素に関する自動レポートを追加しますが、別の要素に`elementtiming`属性を明示的に追加し、PerformanceObserverを登録して要素エントリの型を監視すれば、その別の要素についても報告できます。

```html
<img elementtiming="hero-image" />
<p elementtiming="important-paragraph">This is text I care about.</p>
...
<script>
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `element` entries to be dispatched.
  po.observe({type: 'element', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
</script>
```

{% Aside 'gotchas' %} Largest Contentful Paintで考慮される要素のタイプは、Element TimingAPIを使って観察できるものと同じです。これらのいずれの型でもない要素に`elementtiming`属性を追加しても、その属性は無視されます。{% endAside %}

### Event Timing API

[First Input Delay（FID）](/fid/)メトリックは、ユーザーが最初にページを操作してから、ブラウザーがその操作に応答してイベントハンドラーの処理を実際に開始できるようになるまでの時間を測定します。ただし、場合によっては、イベント処理にかかる時間と、次のフレームをレンダリングできるようになるまでの時間を測定することも役立つ場合があります。

[こうした測定は、FIDの測定に使用される Event Timing API](https://wicg.github.io/event-timing/) を使用すれば可能になります。以下のようなタイムスタンプがイベントライフサイクルにたくさん公開されるためです。

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime) ：ブラウザがイベントを受信した時刻。
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart) ：ブラウザがイベントのイベントハンドラーの処理を開始できる時間。
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend) ：ブラウザがこのイベントのイベントハンドラから開始されたすべての同期コードの実行を終了する時間。
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart) ：ブラウザがイベントを受信してから、イベントハンドラから開始されたすべての同期コードの実行が終了した後、次のフレームを描画できるようになるまでの時間（セキュリティ上の理由から8ミリ秒に<br>四捨五入されます）。

次の例は、これらの値を使用してカスタム測定値を作成する方法を示しています。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0];

    // Measure First Input Delay (FID).
    const firstInputDelay = firstInput.processingStart - firstInput.startTime;

    // Measure the time it takes to run all event handlers
    // Note: this does not include work scheduled asynchronously using
    // methods like `requestAnimationFrame()` or `setTimeout()`.
    const firstInputProcessingTime = firstInput.processingEnd - firstInput.processingStart;

    // Measure the entire duration of the event, from when input is received by
    // the browser until the next frame can be painted after processing all
    // event handlers.
    // Note: similar to above, this value does not include work scheduled
    // asynchronously using `requestAnimationFrame()` or `setTimeout()`.
    // And for security reasons, this value is rounded to the nearest 8ms.
    const firstInputDuration = firstInput.duration;

    // Log these values the console.
    console.log({
      firstInputDelay,
      firstInputProcessingTime,
      firstInputDuration,
    });
  });

  po.observe({type: 'first-input', buffered: true});
} catch (error) {
  // Do nothing if the browser doesn't support this API.
}
```

### Resource Timing API

[Resource Timing API](https://w3c.github.io/resource-timing/)は、特定のページのリソースが読み込まれた方法に関する詳しいインサイトを開発者に提供します。APIの名前からは分かりませんが、提供される情報は、タイミングデータだけではありません (もちろん[それも多く含まれています](https://w3c.github.io/resource-timing/#processing-model))。以下のようなデータにもアクセスできます。

- [initiatorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype): リソースがフェッチされる方法 (`<script>`または`<link>`タグ、または`fetch()`タグからフェッチ)
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol): `h2`や`quic`などのリソースをフェッチするために使用されるプロトコル
- [encodingBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize) / [decodeBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize) ]: エンコードまたはデコードされた形式のリソースのサイズ (両方)
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize): ネットワークで実際に転送されたリソースのサイズ。リソースがキャッシュを使って満たされる場合、この値は`encodedBodySize`よりも大分小さくなる可能性があり、場合によってはゼロになる可能性があります（キャッシュの再検証が必要ない場合）。

リソースタイミングエントリの`transferSize`プロパティを使用して、*cache hit rate (キャッシュヒット率)*メトリックまたは*total cached resource size (キャッシュされたリソースサイズ合計)*メトリックの合計を測定できます。これは、リソースキャッシュ戦略がリピーター (サイトに再度アクセスするユーザー) に対するパフォーマンスへの影響を理解するのに役立ちます。

次の例では、ページによって要求されたすべてのリソースをログに記録し、各リソースがキャッシュを介して実行されたかどうかを示します。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log(entry.name, entry.transferSize === 0);
    }
  });
  // Start listening for `resource` entries to be dispatched.
  po.observe({type: 'resource', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Navigation Timing API

[Navigation Timing API](https://w3c.github.io/navigation-timing/)はResourceTiming API[に似ていますが、報告するのはナビゲーション要求のみです。`navigation`エントリ型も`resource`エントリ型に似ていますが、ナビゲーションリクエストだけに固有の](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)[別の情報](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming)が含まれます (`DOMContentLoaded` イベントや `load` イベントが発生する場合など)。

[多くの開発者がサーバーの応答時間 (](https://en.wikipedia.org/wiki/Time_to_first_byte)[Time to First Byte](https://en.wikipedia.org/wiki/Time_to_first_byte)) を理解するために追跡するメトリックの 1 つが、Navigation Timing API で利用できます (具体的にはそのエントリの`responseStart`タイムスタンプ)。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log('Time to first byte', entry.responseStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

サービスワーカーを使用する開発者が気にするもう 1 つのメトリックに、ナビゲーションリクエストに対するサーバーワーカーの起動時間があります。これは、ブラウザーがフェッチイベントのインターセプトを開始する前にサーバーワーカースレッドを開始するのにかかる時間です。

特定のナビゲーションリクエストに対するサーバーワーカーの起動時間は、`entry.responseStart` と `entry.workerStart` の間のデルタによって判断できます。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Service Worker startup time:',
          entry.responseStart - entry.workerStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Server Timing API

[Server Timing API を](https://w3c.github.io/server-timing/)使用すると、応答ヘッダーを使ってリクエスト固有のタイミングデータをサーバーからブラウザーに渡すことができます。たとえば、データベース内の特定のリクエストに関するデータの検索にかかった時間を示すことができます。これは、サーバーの速度低下によって引き起こされるパフォーマンスの問題をデバッグするのに役立ちます。

サードパーティの分析プロバイダーを使用する開発者にとって、Server Timing API は、こうした分析ツールによって測定される可能性のある別のビジネスメトリックにサーバーパフォーマンスのデータを相関させる唯一の手段となっています。

レスポンスにサーバータイミングデータを指定するには、 `Server-Timing`応答ヘッダーを使用できます。以下はその一例です。

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

次に、このデータは、ページから、ResourceTiming API および NavigationTiming API の `resource` または `navigation` エントリの両方で読み取ることができます。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Logs all server timing data for this response
      console.log('Server Timing', entry.serverTiming);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```
