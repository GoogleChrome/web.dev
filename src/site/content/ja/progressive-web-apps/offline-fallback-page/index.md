---
layout: post
title: オフラインフォールバックページを作成する
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: アプリのシンプルなオフラインエクスペリエンスを作成する方法について説明します。
tags:
  - progressive-web-apps
---

Googleアシスタントアプリ、Slackアプリ、Zoomアプリ、および携帯電話やパソコン上の他のほとんどのプラットフォーム固有のアプリに共通するものは何ですか？そうです、彼らは常に少なくともあなたに*何かを*与えます。ネットワークに接続していない場合でも、アシスタントアプリを開くか、Slackに入る、またはZoomを起動することができます。*特に意味のあるものが得られない場合*や、達成したいことを達成できない場合もありますが、少なくとも何かを取得し、アプリを制御できます。

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="オフライン中のGoogle Assistantモバイルアプリ。", width="621", height="1344" %} <figcaption id="fig-assistant"> Google Assistant. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="オフライン中のSlackモバイルアプリ。", width="621", height="1344" %} <figcaption id="fig-slack"> Slack. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="オフライン中のZoomモバイルアプリ。", width="621", height="1344" %} <figcaption id="fig-zoom"> Zoom. </figcaption></figure>

  <figcaption id="fig-apps-wrapper">プラットフォーム固有のアプリでは、ネットワークに接続していなくても、何かを得ることができます。</figcaption>



対照的に、従来、Webでは、オフラインのときは何も得られません。 Chromeは[オフラインの恐竜ゲーム](https://www.blog.google/products/chrome/chrome-dino/)を提供しますが、それだけです。

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="オフライン恐竜ゲームを表示するGoogle Chromeモバイルアプリ。", width="800", height="1731" %} <figcaption id="fig-chrome-ios"> Google Chrome for iOS. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="オフライン恐竜ゲームを表示するGoogle Chromeデスクトップアプリ。", width="800", height="607" %} <figcaption id="fig-chrome"> Google Chrome for macOS. </figcaption></figure>

  <figcaption id="fig-offline-wrapper">Webでは、ネットワーク接続がない場合、デフォルトでは何も得られません。</figcaption>



## カスタムサービスワーカーを含むオフラインフォールバックページ

ただし、このようにする必要はありません。[サービスワーカーとCache Storage API](/service-workers-cache-storage/)のおかげで、カスタマイズされたオフラインエクスペリエンスをユーザーに提供できます。これは、ユーザーが現在オフラインであるという情報を含むシンプルなブランドページにすることもできますが、たとえば、手動の **[再接続]** ボタンと自動再接続試行のカウントダウンを備えた有名な[trivagoオフライン迷路ゲーム](https://www.trivago.com/offline)のようなもっとクリエイティブなソリューションにすることもできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="trivagoオフライン迷路が表示されたtrivagoオフラインページ。", width="800", height="616" %} <figcaption>trivagoオフライン迷路。</figcaption></figure>

### サービスワーカーの登録

これを実現する方法は、サービスワーカーを使用することです。次のコードサンプルのように、メインページからServiceWorkerを登録できます。通常、これはアプリが読み込まれた後に行います。

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### サービスワーカーコード

実際のサービスワーカーファイルの内容は一見少し複雑に見えるかもしれませんが、次のサンプルのコメントで問題がすっきりするはずです。主な考え方は、ナビゲーション要求の失敗時のみ提供される`offline.html`ファイルを事前にキャッシュに保存し、ブラウザーに他のすべてのケースを処理させるということです。

```js
/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 本ライセンスに準拠していない場合は、このファイルを使用することが禁止されています。
 本ライセンスのコピーは次のサイトから取得できます。
 http://www.apache.org/licenses/LICENSE-2.0
 適用される法律で義務付けられている場合、または書面で合意した場合を除き、
 本ライセンスの下で配布されたソフトウェアは、明示的であるか暗示的であるかを問わず一切の保証または条件なく、「現状有姿」で配布されます。
 本ライセンスの下での許可と制限を規定する特定の言語のライセンスを参照してください。
*/

// OFFLINE_VERSION の数が増えると、インストールイベントが開始し、
// キャッシュに保存されていたリソースが強制的にネットワークから更新される。
// この変数は意図的に宣言され、未使用。
// 必要に応じてlinterのコメントを追加すること。
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// 必要に応じてこれを別のURLでカスタマイズする。
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request will ensure that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be from
      // the network.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // 待機中のサービスワーカーが強制的にアクティブなサービスワーカーにされる。
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // サポートされている場合はナビゲーション事前読み込みを有効にする。
      // https://developers.google.com/web/updates/2017/02/navigation-preloadを参照
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // アクティブなサービスワーカーにただちにページを制御するように命令する。
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // これがHTMLページのナビゲーション要求の場合は、event.respondWith()
  // のみを呼び出す。
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // まず、サポートされている場合は、ナビゲーション事前読み込み応答を使用する。
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // 常に最初にネットワークを試行する。
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catchは例外が発生した場合にのみトリガーされる。
          // これはネットワークエラーが原因であることがほとんどである。
          // fetch() が4xxまたは5xxの範囲の応答コード
          // の有効なHTTP応答を返す場合、catch() は呼び出されない。
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // if() 条件がfalseの場合、このfetchハンドラーは要求を傍受しない。
  // 他のfetchハンドラーが登録されている場合は、
  // event.respondWith() を呼び出す可能性がある。fetchハンドラーが
  // event.respondWith() を呼び出す場合は、サービスワーカーが関与していないかのように
  // ブラウザーによって要求が処理される。
});
```

### オフラインフォールバックページ

`offline.html`ファイルは、クリエイティブになり、ニーズに合わせてブランドを追加できる場所です。次の例は、可能な最小限の処理を示しています。ボタン押下に基づく手動の再読み込みと、[`online`イベント](https://developer.mozilla.org/docs/Web/API/Window/online_event)および通常のサーバーポーリングに基づく自動再読み込みの両方を示します。

{% Aside 'gotchas' %}オフラインページに必要なすべてのリソースをキャッシュに保存する必要があります。これに対処する1つの方法は、すべてをインライン化することです。これにより、オフラインページは自己完結型になります。次の例では、これを示します。 {% endAside %}

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>You are offline</title>

    <!-- Inline the page's stylesheet. -->
    <style>
      body {
        font-family: helvetica, arial, sans-serif;
        margin: 2em;
      }

      h1 {
        font-style: italic;
        color: #373fff;
      }

      p {
        margin-block: 1rem;
      }

      button {
        display: block;
      }
    </style>
  </head>
  <body>
    <h1>You are offline</h1>

    <p>Click the button below to try reloading.</p>
    <button type="button">⤾ Reload</button>

    <!-- Inline the page's JavaScript file. -->
    <script>
      // 手動再読み込み機能。
      document.querySelector("button").addEventListener("click", () => {
        window.location.reload();
      });

      // ネットワーク状態の変更を待機。オンラインになったときに再読み込み。
      // これはデバイスが完全にオフラインのケースを処理する。
      window.addEventListener('online', () => {
        window.location.reload();
      });

      // サーバーが応答しているかどうかをチェックし、応答している場合はページを再読み込み。
      // これはデバイスがオンラインのケースを処理するが、
      // サーバーがオフラインであるか、正常に動作していない。
      async function checkNetworkAndReload() {
        try {
          const response = await fetch('.');
          // サーバーから有効な応答が得られることを検証
          if (response.status >= 200 && response.status < 500) {
            window.location.reload();
            return;
          }
        } catch {
          // サーバーに接続できない。無視。
        }
        window.setTimeout(checkNetworkAndReload, 2500);
      }

      checkNetworkAndReload();
    </script>
  </body>
</html>
```

## デモ

以下に埋め込ま}れた{a0デモでは、オフラインフォールバックページの動作を確認できます。興味があれば、Glitchの[ソースコード](https://glitch.com/edit/#!/offline-fallback-demo)を調べることができます。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### アプリをインストール可能にする際の注意事項

サイトにオフラインフォールバックページがあるので、次のステップについて疑問に思うかもしれません。アプリをインストール可能にするには、[Webアプリマニフェスト](/add-manifest/)を追加し、任意で[インストール戦略](/define-install-strategy/)を検討する必要があります。

### Workbox.jsでオフラインフォールバックページを提供する際の補足

[Workbox.js](https://developer.chrome.com/docs/workbox/)について聞いたことがあるかもしれません。Workbox.jsは、Webアプリにオフラインサポートを追加するためのJavaScriptライブラリのセットです。自分で作成するServiceWorkerコードを減らしたい場合は、[オフラインページでのみ](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only)Workbox.jsレシピを使用できます。

次は、アプリの[インストール戦略を定義する方法](/define-install-strategy/)について学習します。
