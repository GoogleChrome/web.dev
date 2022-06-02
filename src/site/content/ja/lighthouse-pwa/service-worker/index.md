---
layout: post
title: ページと `start_url` を制御するサービスワーカーが登録されない
description: オフライン機能やプッシュ通知、インストール可能性といった Progressive Web App (プログレッシブウェブアプリ) の機能をサポートするサービスワーカーを登録する方法について学びます。
web_lighthouse:
  - サービスワーカー
date: 2019-05-04
updated: 2020-06-10
---

[Service Worker](/service-workers-cache-storage/) の登録は、[Progressive Web App (PWA) (プログレッシブウェブアプリ)](/discover-installable) が提供する主な機能を有効化する最初のステップです。

- オフラインで稼働する
- プッシュ通知をサポートする
- デバイスにインストールできる

詳細は、[Service workers and the Cache Storage API (サービスワーカーと Cache Storage API)](/service-workers-cache-storage/) と題した記事をお読みください。

## ブラウザの互換性

サービスワーカーは、Internet Explorer を除くすべての主要なブラウザーでサポートされています。[Browser compatibility (ブラウザの互換性)](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility) を参照してください。

## Lighthouse のサービスワーカー監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、サービスワーカーを登録しないページをフラグします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="サイトがサービスワーカーを登録しないことを示す Lighthouse 監査", width="800", height="95" %}</figure>

Lighthouse は、[Chrome Remote Debugging Protocol (Chrome リモートデバッグプロトコル)](https://github.com/ChromeDevTools/devtools-protocol) がサービスワーカーのバージョンを返すかどうかを確認します。返されない場合に監査は失敗します。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## サービスワーカーの登録方法

{% include 'content/reliable/workbox.njk' %}

サービスワーカーは、わずか数行のコードで登録できますが、サービスワーカーを使用する唯一の理由は、上述した PWA の機能の 1 つを実装できるようにするためです。実際にそうした機能を実装するには、さらに多くの作業が必要になります。

- ファイルをキャッシュしてオフラインで使用する方法は、[What is network reliability and how do you measure it? (ネットワークの信頼性とは、またその評価方法とは？)](/network-connections-unreliable) と題した記事をお読みください。
- アプリをインストール可能にする方法については、コードラボ [Make it installable (インストール可能にする)](/codelab-make-installable/) を参照してください。
- プッシュ通知を有効にする方法については、Google の[Adding Push Notifications to a Web App (プッシュ通知のウェブアプリへの追加)](https://codelabs.developers.google.com/codelabs/push-notifications) を参照してください。

## リソース

- [**Does not register a service worker that controls page and `start_url (ページと `start_url` を制御するサービスワーカーが登録されない)`** 監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
- [Service Workers: an Introduction (サービスワーカー: はじめに)](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [Service workers and the Cache Storage API (サービスワーカーと Cache Storage API)](/service-workers-cache-storage/)
- [What is network reliability and how do you measure it? (ネットワークの信頼性とは、またその評価方法とは？)](/network-connections-unreliable)
- [Make it installable (インストール可能にする)](/codelab-make-installable/)
- [Adding Push Notifications to a Web App (プッシュ通知のウェブアプリへの追加)](https://codelabs.developers.google.com/codelabs/push-notifications)
