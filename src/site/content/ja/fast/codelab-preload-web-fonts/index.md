---
layout: codelab
title: Webフォントをプリロードして読み込み速度を向上させる
authors:
  - gmimani
description: このコードラボでは、Webフォントのプリロードによりページのパフォーマンスを向上させる方法を学びます。
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

このコードラボでは、`rel="preload"`を使用してWebフォントをプリロードし、スタイルが設定されていないテキストのちらつき（FOUT）を取り除く方法を説明します。

## 測定

まずは最適化の追加の前に、Webサイトのパフォーマンスを測定しましょう。{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

生成されるLighthouseレポートには、**Maximum critical path latency**の下にリソースのフェッチ順が表示されます。

{% Img src="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="Webフォントがクリティカルリクエストチェーンに存在します。", width="704", height="198" %}

上記の監査では、Webフォントはクリティカルリクエストチェーンの一部であり、最後にフェッチされています。[**クリティカルリクエストチェーン**](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)は、ブラウザが優先順位を付けてフェッチするリソースの順序を表します。このアプリケーションでは、Webフォント（PacficoとPacifico-Bold）は、[@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face)ルールで定義されており、クリティカルリクエストチェーンでブラウザがフェッチする最後のリソースとなっています。通常、Webフォントは遅延読み込みされるため、クリティカルリソース（CSS、JS）がダウンロードされるまで読み込まれません。

アプリケーションでフェッチされたリソースの順序は次のとおりです。

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt="Webフォントは遅延読み込みされます。", width="583", height="256" %}

## Webフォントのプリロード

FOUTを回避するには、すぐに必要なWebフォントはプリロードしておくことができます。このアプリケーションの`Link`要素をドキュメントのheadに追加してください。

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

`as="font" type="font/woff2"`属性は、このリソースをフォントとしてダウンロードするようにブラウザに指示し、リソースキューの優先順位付けに役立ちます。

`crossorigin`属性は、フォントが別のドメインからのものである可能性があるため、リソースをCORSリクエストでフェッチする必要があるかどうかを示します。この属性がない場合、ブラウザがプリロードされたフォントを認識しません。

Pacifico-Boldがページのヘッダーで使用されているため、さらに早くフェッチできるようにpreloadタグを追加しました。Pacifico.woff2フォントは、展開表示の下にあるテキストのスタイルを設定するフォントであるため、それをプリロードしておく必要はありません。

アプリケーションを再読み込みして、Lighthouseをもう一度実行します。**Maximum critical path latency**セクションを確認してください。

{% Img src="image/admin/lC85s7XSc8zEXgtwLsFu.png", alt="Pacifico-BoldのWebフォントがプリロードされ、クリティカルリクエストチェーンから削除されています", width="645", height="166" %}

`Pacifico-Bold.woff2`がクリティカルリクエストチェーンからどのように削除されているかに注目してください。アプリケーションの早い段階でフェッチされています。

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="Pacifico-Bold Webフォントはプリロードされています", width="553", height="254" %}

preloadを使用すると、ブラウザはこのファイルを早期にダウンロードする必要があることを認識します。preloadが正しく使用されていない場合、使用されていないリソースが不要に要求されてしまうため、パフォーマンスが低下する可能性があることに注意しておくことが重要です。
