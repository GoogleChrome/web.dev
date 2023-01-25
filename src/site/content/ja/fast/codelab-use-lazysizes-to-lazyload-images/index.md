---
layout: codelab
title: lazysizesを使用したオフスクリーン画像の遅延読み込み
authors:
  - katiehempenius
description: このコードラボでは、lazysizesを使用して、現在のビューポートの画像のみを読み込む方法について説明します。
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

遅延読み込みは、リソースを事前に読み込むのではなく、必要になるまでリソースの読み込みを待機するアプローチです。これにより、最初のページの読み込み時に読み込んで解析する必要のあるリソースの量が減り、パフォーマンスを向上させることができます。

この手法でパフォーマンスを改善する候補は、最初のページ読み込み中に画面外にある画像です。[lazysizes](https://github.com/aFarkas/lazysizes)を使用すると、このパフォーマンス改善を簡単に実装できます。

## lazysizesスクリプトをページに追加する

{% Instruction 'remix' %}

`lazysizes.min.js`はすでにダウンロードされており、このGlitchに追加されています。次の手順でページに追加します。

- `<script>`タグを`index.html`に追加します。

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Images End -->
</body>
```

{% Aside %} [lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js)ファイルはすでにこのプロジェクトに追加されているため、個別に追加する必要はありません。追加したスクリプトでこのスクリプトを使用できます。 {% endAside %}

lazysizesは、ユーザーがページをスクロールするときに画像をインテリジェントに読み込み、先に表示される画像を優先します。

## 画像を遅延読み込みするように命令する

- 遅延読み込みされる画像に`lazyload`を追加します。また、`src`属性を`data-src`に変更します。

たとえば、`flower3.png`の変更は次のようになります。

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

{% Aside %}
この例では、`flower3.png`、 `flower4.jpg`、および`flower5.jpg`の遅延読み込みを試みます。

`src`属性を`data-src`に変更する必要があるのはなぜでしょうか。この属性が変更されていない場合、すべての画像は遅延読み込みされず、すぐに読み込まれます。`data-src`はブラウザが認識する属性ではないため、この属性の画像タグを検出しても、画像は読み込まれません。この場合はこれで問題がありません。これにより、ブラウザではなく、lazysizesスクリプトが画像をいつ読み込むのかを決定できます。
{% endAside %}

## 実際の動作を確認する

以上です。これらの変更の動作を確認するには、次の手順に従います。

{% Instruction 'preview' %}

- コンソールを開き、追加した画像を見つけます。ページを下にスクロールすると、クラスが`lazyload`に`lazyloaded`に変更されます。

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="遅延読み込み中の画像", width="428", height="252" %}

- ネットワークパネルを見て、ページを下にスクロールするときに画像ファイルが個別に読み込まれることを確認します。

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="遅延読み込み中の画像", width="418", height="233" %}

## Lighthouseを使用して検証する

最後に、Lighthouseを使用してこれらの変更を確認することをお勧めします。Lighthouseの「オフスクリーン画像の遅延」パフォーマンス監査は、オフスクリーン画像に遅延読み込みを追加するのを忘れたかどうかを示します。

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. **オフスクリーン画像の遅延**監査に合格したことを確認します。

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="Lighthouseの「画像の効率的なエンコード」監査に合格", width="800", height="774" %}

成功です。lazysizesを使用して、ページで画像を遅延読み込みしました。
