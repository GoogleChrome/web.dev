---
layout: post
title: リンクには説明文がありません
description: |2-

  「リンクには説明文がありません」Lighthouse 監査について学びます。
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - リンクテキスト
---

Link テキストは、ハイパーリンク内のクリック可能な単語またはフレーズです。Link テキストがハイパーリンクのターゲットを明確に伝える場合、ユーザーと検索エンジンの両方が、コンテンツとそれが他のページと関連する方法をより簡単に理解できます。

## Lighthouse link テキスト監査がどのように失敗します

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、説明文なしでlinkにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="Lighthouse auditは説明文なしでlinkを表示します", width="800", height="191" %}</figure>

Lighthouseは、次の一般的なlink テキストにフラグを立てます。

- `click here`
- `click this`
- `go`
- `here`
- `this`
- `start`
- `right here`
- `more`
- `learn more`

{% include 'content/lighthouse-seo/scoring.njk' %}

## 説明できるlink テキストを追加する方法

「ここにクリックする」や「詳細」などの一般的なフレーズを特定の説明に置き換えます。一般に、ユーザーがhyperlinkをたどった場合にどのような種類のコンテンツを取得するかを明確に示すlinkテキストを記述します。

```html
<p>To see all of our basketball videos, <a href="videos.html">click here</a>.</p>
```

{% Compare 'worse', 'Don\'t' %}「ここにクリックする」は、hyperlink がユーザーをどこに誘導するかを伝えません。 {% endCompare %}

```html
<p>Check out all of our <a href="videos.html">basketball videos</a>.</p>
```

{% Compare 'better', 'Do' %}「バスケットボールの動画」は、hyperlinkがユーザーを動画のページに誘導することを明確に伝えています。 {% endCompare %}

{% Aside %}link テキストをわかりやすくするために、周囲の文を修正する必要がある場合がよくあります。 {% endAside %}

## Link テキストのベストプラクティス

- トピックを続けてください。ページのコンテンツに関係のないLink テキストは使用しないでください。
- サイトの新しいアドレスを参照するなど、正当な理由がない限り、ページのURLをlinkの説明として使用しないでください。
- 説明は簡潔にしてください。いくつかの単語または短いフレーズでご作成ください。
- 内部linkにも注意してください。内部linkの品質を向上させると、ユーザーと検索エンジンの両方がサイトをより簡単にナビゲートできるようになります。

その他のヒントについては、Googleの[検索エンジン最適化（SEO）初心者用のガイド](https://support.google.com/webmasters/answer/7451184) [のリンクを賢く使用する](https://support.google.com/webmasters/answer/7451184#uselinkswisely)セクションを参照してください。

## 資力

- [**リンクには説明文がありません**監査用のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/link-text.js)
- [検索エンジン最適化（SEO）初心者用のガイド](https://support.google.com/webmasters/answer/7451184)
