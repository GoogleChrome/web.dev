---
layout: post
title: ウェブアプリマニフェストがインストール可能性の要件を満たしていない
description: |2-

  プログレッシブウェブアプリをインストール可能にする方法について学びます。
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

インストール可能性は、[プログレッシブウェブアプリ (PWA)](/discover-installable) の基本的な要件です。ユーザーに PWA のインストールを促すことで、ユーザーが PWA をホーム画面に追加できるようにします。ユーザーは、ホーム画面に追加するアプリをそれ以外のアプリよりも頻繁に利用します。

[ウェブアプリマニフェスト](/add-manifest/)には、アプリをインストール可能にするための重要な情報が含まれています。

## Lighthouse によるウェブアプリマニフェスト監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、インストール可能性の最低要件を満たす[ウェブアプリマニフェスト](/add-manifest/)がないページをフラグします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="ユーザーがホーム画面からウェブアプリをインストールできないことを示す Lighthouse 監査", width="800", height="98" %}</figure>

以下のプロパティがないページのマニフェストは、監査は失敗します。

- [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) または [`name`](https://developer.mozilla.org/docs/Web/Manifest/name) プロパティ
- 192x192 ピクセルと 512x512 ピクセルのアイコンを含む [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons) プロパティ
- [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url) プロパティ
- `fullscreen`、`standalone`、または `minimal-ui` に設定された [`display`](https://developer.mozilla.org/docs/Web/Manifest/display) プロパティ
- `true` 以外の値に設定された [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) プロパティ。

{% Aside 'caution' %} アプリをインストール可能にするには、ウェブアプリマニフェストが*必要*ですが、それだけでは*不十分*です。インストール可能性の全要件を満たす方法については、[Discover what it takes to be installable (インストール可能にする方法について)](/discover-installable) と題した記事を参照してください。{% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## PWA をインストール可能にする方法

上述した要件を満たすマニフェストがアプリにあることを確認してください。 PWA の作成について詳しくは、[Installable](/installable/) コレクションを参照してください。

## PWA がインストール可能であることを確認する方法

### Chrome の場合

アプリがインストール可能性の最低要件を満たしている場合、Chrome は`beforeinstallprompt` イベントを発生させます。このイベントを使用して、ユーザーに PWA のインストールを促すことができます。

{% Aside 'codelab' %} Chrome でアプリをインストール可能にする方法については、コードラボの [Make it installable](/codelab-make-installable) で紹介されています。{% endAside %}

### 他のブラウザの場合

他のブラウザは、インストールの条件および `beforeinstallprompt` イベントをトリガーする条件が異なります。完全な詳細については、それぞれのサイトを確認してください。

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## リソース

- [**Web app manifest does not meet the installability requirements (ウェブアプリマニフェストがインストール可能性の要件を満たしていない)** 監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/installable-manifest.js)
- [Add a web app manifest (ウェブアプリマニフェストを追加する)](/add-manifest/)
- [Discover what it takes to be installable (インストール可能にする方法について)](/discover-installable)
- [Web App Manifest (ウェブアプリマニフェスト)](https://developer.mozilla.org/docs/Web/Manifest)
- [Does not use HTTPS (HTTPS を使用していない)](/is-on-https/)
