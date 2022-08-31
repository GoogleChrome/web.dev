---
layout: post
title: リンクの名前が識別できない
description: ウェブページ上のリンクに支援技術が解釈できる名前を付けて、一層利用しやすくする方法を学びます。
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - link-name
---

識別可能でユニーク、またフォーカス可能なリンクテキストを使用すれば、スクリーンリーダーやその他の支援技術を利用するユーザーのナビゲーションエクスペリエンスを向上できます。

## Lighthouseのこの監査が失敗する原因

Lighthouseは、名前を識別できないリンクをフラグします。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="名前を識別できないことを示すLighthouseの監査", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## リンクに利用しやすい名前を追加する方法

ボタンと同様に、リンクも利用しやすい名前は主にテキストコンテンツから得ています。「Here」や「Read more」といったフィラーワードは避けましょう。代わりに、リンクの内容が一番よく伝わるテキストをリンクそのものに挿入します。

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

詳しくは、[Label buttons and links (ラベルボタンとリンク)](/labels-and-text-alternatives#label-buttons-and-links) をご覧ください。

## リソース

- [**Links do not have a discernible name (リンクの名前が識別できない)**監査のソースコード****](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/link-name.js)
- [Links must have discernible text (Deque University) (リンクには識別できるテキストが必要)](https://dequeuniversity.com/rules/axe/3.3/link-name)
