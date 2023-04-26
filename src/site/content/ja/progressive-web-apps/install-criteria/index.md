---
layout: post
title: どうすればインストール可能にできますか？
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: プログレッシブ Web アプリのインストール可能性の基準。
tags:
  - progressive-web-apps
---

プログレッシブ Web アプリ（PWA）は、Web テクノロジーを使用して構築された最新の高品質アプリケーションです。PWAは、iOS/Android/デスクトップアプリと同様の機能を提供し、不安定なネットワーク状態でも信頼性が高く、インストール可能であるため、ユーザーが簡単に見つけて使用できます。

ほとんどのユーザーは、アプリケーションのインストールと、インストールされたエクスペリエンスの利点に精通しています。インストールされたアプリケーションは、Mac OS X の Applicationsフォルダ、Windowsのスタートメニュー、Android と iOS のホーム画面など、オペレーティングシステムの起動画面に表示されます。また、アクティビティスイッチャー、Spotlight などのデバイス検索エンジン、およびコンテンツ共有シートにも表示されます。

ほとんどのブラウザは、プログレッシブ Web アプリ（PWA）が特定の基準を満たしたときにインストール可能であることをユーザーに示します。インジケータの例には、アドレスバーの [インストール] ボタン、またはオーバーフローメニューの [インストール] メニュー項目が含まれます。

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png", alt="インストールインジケーターが表示されたオムニボックスのスクリーンショット。", width="800", height="307" %} <figcaption> ブラウザが提供するインストールプロモーション（デスクトップ）</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png", alt="ブラウザが提供するインストールプロモーションのスクリーンショット。", width="800", height="307" %} <figcaption>ブラウザが提供するインストールプロモーション（モバイル）</figcaption></figure>
</div>

さらに、基準が満たされると、多くのブラウザは `beforeinstallprompt` イベントを発し、アプリ内のインストールフローをトリガーするカスタムアプリ内 UX を提供できます。

## インストール基準 {: #criteria }

Chrome では、プログレッシブ Web アプリは `beforeinstallprompt` イベントを発してブラウザー内インストールプロモーションを表示する前に、次の基準を満たしている必要があります。

- Web アプリはまだインストールされていない
- ユーザーエンゲージメントヒューリスティックに対応している
- HTTPS 経由で提供されている
- 以下を含む [Web アプリマニフェスト](/add-manifest/)が含まれている
    - `short_name` または `name`
    - `icons` - 192px と 512px のアイコンを含む必要があります。
    - `start_url`
    - `display` - `fullscreen`、`standalone`、または `minimal-ui` のいずれかである必要があります。
    - `prefer_related_applications` が存在していないか、 `false` である
- `fetch` ハンドラーをもつサービスワーカーを登録する

他のブラウザにも同様のインストール基準がありますが、わずかな違いがある場合があります。詳細については、それぞれのサイトを確認してください。

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Installable_PWAs)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)

{% Aside %} Androidでは、Web アプリのマニフェストに `related_applications` と `"prefer_related_applications": true` が含まれている場合、ユーザーは Google Play ストアに移動し、代わりに[指定された Android アプリをインストールするよう求められます](https://developer.chrome.com/blog/app-install-banners-native/)。 {% endAside %}
