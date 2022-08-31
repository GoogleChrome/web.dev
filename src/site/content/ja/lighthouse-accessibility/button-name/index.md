---
layout: post
title: ボタンにアクセス可能な名前がありません
description: すべてのボタンが、支援技術のユーザーがアクセスできる名前が付いていることを確認してWebページのアクセシビリティを向上させる方法を学びます。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

ボタンにアクセス可能な名前が付いていない場合、スクリーンリーダーやその他の支援技術はそれを*ボタン*とみなせないため、ボタンの機能に関する情報をユーザーに提供できません。

## Lighthouseのボタン名の監査が失敗する原因

Lighthouseはテキストコンテンツまたは`aria-label`プロパティがないボタンにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="ボタンにアクセス可能な名前がないことを示すLighthouseの監査", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## ボタンにアクセス可能な名前を追加する方法

表示ラベルのあるボタンについては、`button`要素にテキストコンテンツを追加します。明確なCTAを表すラベルを指定します。たとえば、次のようにすることができます。

```html
<button>Book room</button>
```

表示ラベルのないアイコンボタンのようなボタンの場合は、`aria-label`属性を使用して、支援技術を使用しているすべての人に対してアクションを明確に説明します。たとえば、次のようにすることができます。

{% Glitch { id: 'lh-button-name', path: 'index.html', previewSize: 0, height: 480 } %}

{% Aside %}このサンプルアプリは、Googleの[マテリアルアイコンフォント](https://alistapart.com/article/the-era-of-symbol-fonts/)に依存しており、ボタンの内側のテキストをアイコングリフに変換する[合字](https://google.github.io/material-design-icons/)を使用しています。支援技術は、ボタンを公開する際に、アイコングリフではなく`aria-label`を参照します。{% endAside %}

[ラベルボタンとリンク](/labels-and-text-alternatives#label-buttons-and-links)も参照してください。

## リソース

- [**ボタンにアクセス可能な名前がない**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js)
- [Buttons must have discernible text（Deque University）](https://dequeuniversity.com/rules/axe/3.3/button-name)（ボタンには識別可能なテキストが必要です）
