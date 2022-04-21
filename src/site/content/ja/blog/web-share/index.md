---
title: Web ShareAPIを使用してOS共有UIと統合する
subhead: Webアプリは、プラットフォーム固有のアプリと同じシステム提供の共有機能を使用できます。
authors:
  - joemedley
date: 2019-11-08
updated: 2021-07-09
hero: image/admin/ruvEms3AeSZvlEI01DKo.png
alt: Webアプリがシステム提供の共有UIを使用できることを示す図。
description: Web Share APIを使用すると、Webアプリは、プラットフォーム固有のアプリと同じシステム提供の共有機能を使用できます。Web Share APIを使用すると、Webアプリは、プラットフォーム固有のアプリと同じ方法で、デバイスにインストールされている他のアプリへのリンク、テキスト、ファイルを共有できます。
tags:
  - blog
  - capabilities
feedback:
  - api
stack_overflow_tag: web-share
---

Web Share API を使用すると、Web アプリは、プラットフォーム固有のアプリと同じシステム提供の共有機能を使用できます。 Web Share API を使用すると、Web アプリは、プラットフォーム固有のアプリと同じ方法で、デバイスにインストールされている他のアプリへのリンク、テキスト、およびファイルを共有できます。

{% Aside %}共有は魔法の半分にすぎません。 Web アプリは共有ターゲットにすることもできます。つまり、プラットフォーム固有のアプリまたは Web アプリからデータ、リンク、テキスト、およびファイルを受信できます。アプリを共有ターゲットとして登録する方法の詳細については、[共有データの受信](/web-share-target/)の投稿を参照してください。{% endAside %}

## 概念と使用方法

<figure data-float="right">{% Img src="image/admin/cCXNoHbXAfkAQzTTuS0Z.png", alt="オプションとしてPWAがインストールされたシステムレベルの共有ターゲットピッカー。", width="370", height="349" %} <figcaption>オプションとしてPWAがインストールされたシステムレベルの共有ターゲットピッカー。</figcaption></figure>

### 機能と制限

Web 共有には、次の機能と制限があります。

- [HTTPS 経由でアクセス](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features)するサイトでのみ使用できます。
- クリックなどのユーザーアクションに応答して呼び出す必要があります。 `onload`ハンドラ経由で呼び出すことはできません。
- URL、テキスト、またはファイルを共有できます。
- 2021 年 1 月の時点で、Safari、Chromium フォークの Android、ChromeOS、Windows の Chrome で利用できます。 MacOS 上の Chrome はまだ開発中です。詳細については、 [MDN](https://developer.mozilla.org/docs/Web/API/Navigator/share#Browser_compatibility)を参照してください。

### リンクとテキストの共有

リンクとテキストを共有するには、 `share()`メソッドを使用します。これは、必須のプロパティオブジェクトを持つ promise ベースのメソッドです。ブラウザで`TypeError`を発生させないようにするには、オブジェクトに次のプロパティを 1 つ以上含める必要があります。`title`、`text`、`url`、または`files`。たとえば、URL なしでテキストを共有したり、その逆を行ったりすることができます。3 つのメンバーすべてを許可すると、ユースケースの柔軟性が高まります。以下のコードを実行した後、ユーザーがターゲットとして電子メールアプリケーションを選択した場合を想像してみてください。`title`パラメータは、電子メールの件名、 `text`、メッセージ本文、およびファイル、添付ファイルになる場合があります。

```js
if (navigator.share) {
  navigator
    .share({
      title: 'web.dev',
      text: 'Check out web.dev.',
      url: 'https://web.dev/',
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
}
```

同じコンテンツの複数の URL がサイトにある場合は、現在の URL ではなくページの正規 URL を共有します。`document.location.href`を共有する代わりに、ページの`<head>`で正規 URL `<meta>`タグをチェックし、それを共有します。これにより、ユーザーのエクスペリエンスが向上します。リダイレクトを回避するだけでなく、共有 URL が特定のクライアントに適切なユーザーエクスペリエンスを提供することも保証します。たとえば、友人が共有しているモバイル URL をデスクトップコンピュータで見ると、デスクトップバージョンが表示されます。

```js
let url = document.location.href;
const canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null) {
  url = canonicalElement.href;
}
navigator.share({url});
```

### ファイルの共有

ファイルを共有するには、最初に`navigator.canShare()`テストして呼び出します。`navigator.share()`呼び出しには、ファイルの配列が含まれます。

```js/0-5
if (navigator.canShare && navigator.canShare({ files: filesArray })) {
  navigator.share({
    files: filesArray,
    title: 'Vacation Pictures',
    text: 'Photos from September 27 to October 14.',
  })
  .then(() => console.log('Share was successful.'))
  .catch((error) => console.log('Sharing failed', error));
} else {
  console.log(`Your system doesn't support sharing files.`);
}
```

サンプルが`navigator.share()`ではなく、`navigator.canShare()`をテストすることによって、機能検出を処理しています。`canShare()`に渡されるデータオブジェクトは`files`プロパティのみをサポートします。画像、動画、音声、およびテキストファイルを共有できます。[(Chromium で許可されているファイル拡張子を](https://docs.google.com/document/d/1tKPkHA5nnJtmh2TgqWmGSREUzXgMUFDL6yMdVZHqUsg/edit?usp=sharing)参照してください。) 将来、さらに多くのファイルタイプが追加される可能性があります。

## Santa Tracker の事例研究

<figure data-float="right">{% Img src="image/admin/2I5iOXaOpzEJlEbM694n.png", alt="共有ボタンを表示しているSanta Trackerアプリ。", width="343", height="600" %} <figcaption>Santa Tracke共有ボタン。</figcaption></figure>

オープンソースプロジェクトである[Santa Tracke](https://santatracker.google.com/)は、Google の休日の伝統です。毎年 12 月には、ゲームや教育体験でクリスマスを祝うことができます。

2016 年、Santa Tracke チームは Android で Web Share API を使用しました。この API はモバイルに最適でした。過去数年間、チームにとってはスペースが貴重であったため、モバイルの共有ボタンを削除しました。しかし、複数の共有ターゲットを持つという根拠を示すことはできませんでした。

ところが、Web Share API を使用すると、ボタンを 1 つ表示することができ、貴重なピクセルを節約できました。また、Web Share で共有したユーザーは、API を有効にしていないユーザーより約 20%多いこともわかりました。[Santa Tracker](https://santatracker.google.com/)で Web Share の動作を確認してみてください。

## ブラウザのサポート

Web Share API のブラウザーサポートには微妙な違いがあり、特定のメソッドがサポートされていることを前提にするのではなく、機能検出 (前のコードサンプルで説明) を使用することをお勧めします。

2021 年初めの時点で、API を使用したタイトル、テキスト、および URL の共有は、次のシステムでサポートされています。

- macOS および iOS の Safari12 以降。
- Android の Chrome75 以降、ChromeOS と Windows の 89 以降。

API を使用したファイル共有は、次のシステムでサポートされています。

- macOS および iOS 上の Safari15 以降。
- Android では Chrome75 以降、ChromeOS と Windows では 89 以降。

(Edge などのほとんどの Chromium ベースのブラウザは、対応するバージョンの Chrome と同じ機能をサポートしています。)

### API のサポートを表示する

Web Share API を使用する計画がありますか。パブリックサポートは、Chrome チームが機能の優先順位を決定できるようにお手伝いしこの機能のサポートがどれほど重要であるのか他のブラウザベンダーに示します。

[@ChromiumDev](https://twitter.com/ChromiumDev)にツイートして、この API をどこで、どのように使用されているのかお知らせください。ハッシュタグは[`#WebShare`](https://twitter.com/search?q=%23WebShare&src=recent_search_click&f=live)をお使いください。

## 役立つリンク

- [Web Share デモ](https://w3c.github.io/web-share/demos/share-files.html)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)
