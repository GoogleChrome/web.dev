---
layout: post
title: ドキュメントにメタ記述がない
description: |2-

  Lighthouse監査「ドキュメントにメタ記述がない」について説明します。
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

`<meta name="description">`要素は、検索エンジンが検索結果に含めるページのコンテンツの概要を提供します。高品質で固有なメタ記述により、ページの関連性が高まり、検索トラフィックを増やすことができます。

## Lighthouseメタ記述監査が失敗する理由

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)はメタ記述のないページにフラグを設定します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="ドキュメントにメタ記述がないことを示すLighthouse監査", width="800", height="74" %}</figure>

次の場合、監査は失敗します。

- `<meta name=description>`要素がない。
- `<meta name=description>`要素の`content`属性が空。

Lighthouseは記述の質を評価しません。

{% include 'content/lighthouse-seo/scoring.njk' %}

## メタ記述を追加する方法

各ページの`<head>` `<meta name=description>`要素を追加します。

```html
<meta name="description" content="Put your description here.">
```

必要に応じて、明確にタグ付けされた事実を説明に含めます。次に例を示します。

```html
<meta name="description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

## メタ記述のベストプラクティス

- 各ページに固有の記述を使用する。
- 記述を明確かつ簡潔にする。 「ホーム」のような漠然とした説明は避ける。
- [キーワードの乱用は](https://support.google.com/webmasters/answer/66358)避ける。ユーザーにとって有用ではなく、検索エンジンによってページがスパムに設定される場合があります。
- 記述は完全な文でなくても良い。構造化データを含めることができる。

良い記述と悪い記述の例を次に示します。

{% Compare 'worse' %}

```html
<meta name="description" content="A donut recipe.">
```

{% CompareCaption %}あいまいすぎます。 {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="Mary's simple recipe for maple bacon donuts
           makes a sticky, sweet treat with just a hint
           of salt that you'll keep coming back for.">
```

{% CompareCaption %}わかりやすく簡潔。 {% endCompareCaption %} {% endCompare %}

その他のヒントについては、Googleの[検索結果ページで適切なタイトルとスニペットを作成する](https://support.google.com/webmasters/answer/35624#1)を参照してください。

## リソース

- [**ドキュメントにメタ記述がない**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [検索結果で適切なタイトルとスニペットを作成する](https://support.google.com/webmasters/answer/35624#1)
- [無関係なキーワード](https://support.google.com/webmasters/answer/66358)
