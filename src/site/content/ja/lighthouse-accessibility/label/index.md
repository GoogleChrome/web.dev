---
layout: post
title: フォーム要素にラベルが関連付けられていない
description: ラベルを指定して支援技術を使用するユーザーがフォーム要素にアクセスできるようにする方法を学びます。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - label
---

ラベルを使用することで、フォームコントロールがスクリーンリーダーなどの支援技術によって適切に読み取られるようにすることができます。支援技術を使用するユーザーは、これらのラベルを使用してフォームをナビゲートします。ラベルテキストによってクリックターゲットが大きくなるため、マウスとタッチスクリーンを使用するユーザーにもラベルのメリットがあります。

## Lighthouse のこの監査に失敗する原因

Lighthouse は、ラベルが関連付けられていないフォーム要素にラベルを設定します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="フォーム要素にラベルが関連付けられていないことを示す Lighthouse 監査", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## フォーム要素にラベルを追加するには

ラベルをフォーム要素に関連付けるには 2 つの方法があります。 1 つ目は label 要素内に input 要素を配置する方法です。

```html
<label>
  Receive promotional offers?
  <input type="checkbox">
</label>
```

または、label の `for` 属性を使用して、要素の ID を参照します。

```html
<input id="promo" type="checkbox">
<label for="promo">Receive promotional offers?</label>
```

チェックボックスに正しくラベルが付けられている場合、支援技術は、要素にチェックボックスの役割があり、チェックされた状態であり、「Receive promotional offer?」という名前が付けられていることを報告します。「[フォーム要素にラベルを付ける](/labels-and-text-alternatives#label-form-elements)」もご覧ください。

## リソース

- [「**フォーム要素にラベルが関連付けられていない**」監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js)
- [Form `<input>` elements must have labels（Deque University）](https://dequeuniversity.com/rules/axe/3.3/label)
