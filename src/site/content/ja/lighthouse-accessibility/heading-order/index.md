---
layout: post
title: 見出し要素は番号の降順ではない
description: 見出し要素を正しく構造化することで、支援技術のユーザーがWebページを簡単に操作できるようにする方法について説明します。
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - heading-order
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Lighthouse見出しレベルの監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、見出しが1つ以上のレベルをスキップするページにフラグを設定します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="レベルをスキップする見出しを示すLighthouse監査", width="800", height="206" %}</figure>

たとえば、ページタイトルで`<h1>`要素を使用し、次にページのメインセクションで`<h3>`要素を使用すると、`<h2>`レベルがスキップされるため、監査が失敗します。

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 構造が適切でない見出しを修正する方法

- すべての見出し要素を、コンテンツの構造を反映する論理的な番号順に従わせます。
- 見出しのテキストが、関連するセクションの内容を明確に伝えていることを確認します。

例:

```html
<h1>Page title</h1>
<section>
  <h2>Section Heading</h2>
  …
    <h3>Sub-section Heading</h3>
</section>
```

見出しの構造を確認する方法の1つは、「誰かが見出しだけを使用してページのアウトラインを作成した場合、それは意味があるか」と確認することです。

Microsoftの<a href="https://accessibilityinsights.io/" rel="noopener">AccessibilityInsights拡張機能</a>などのツールを使用して、ページ構造を視覚化し、構造化されてない見出し要素を特定することもできます。

{% Aside 'caution' %}開発者は、目的の視覚スタイルを実現するために見出しレベルをスキップすることがあります。たとえば、`<h2>`テキストが大きすぎると感じたため、`<h3>`要素を使用する場合があります。これは**アンチパターン**と見なされます。代わりに、正しく順序付けられた見出し構造を使用し、必要に応じてCSSを使用して見出しのスタイルを視覚的に設定します。 {% endAside %}

詳細については、[見出しとランドマークの](/headings-and-landmarks)投稿を参照してください。

## リソース

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/heading-order.js" rel="noopener"><strong>見出しスキップレベル</strong>監査のソースコード</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">見出しレベルは1つだけ増やす (Deque University)</a>
