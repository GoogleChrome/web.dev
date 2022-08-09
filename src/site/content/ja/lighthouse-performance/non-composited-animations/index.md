---
layout: post
title: 合成されていないアニメーションは避けてください
description: "「合成されていないアニメーションを避ける」灯台監査に合格する方法。"
date: 2020-08-12
web_lighthouse:
  - 合成されていないアニメーション
---

合成されていないアニメーションは、ローエンドの電話で、またはパフォーマンスの高いタスクがメインスレッドで実行されている場合に、ぎくしゃくした（つまりスムーズではない）ように見えることがあります。[ぎこちないアニメーションは、ページの累積レイアウトシフト](/cls/)（CLS）を増やす可能性があります。 CLSを減らすと、LighthousePerformanceスコアが向上します。

## バックグラウンド

HTML、CSS、およびJavaScriptをピクセルに変換するためのブラウザーのアルゴリズムは、まとめて*レンダリングパイプラインと*呼ばれます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/68xt0KeUvOpB8kA1OH0a.jpg", alt="レンダリングパイプラインは、JavaScript、スタイル、レイアウト、ペイント、コンポジット。", width="800", height="122" %}<figcaption>レンダリングパイプライン。</figcaption></figure>

レンダリングパイプラインの各ステップが何を意味するのか理解していなくても大丈夫です。ここで理解しておくべき重要なことは、レンダリングパイプラインの各ステップで、ブラウザーが前の操作の結果を使用して新しいデータを作成することです。たとえば、コードがレイアウトをトリガーする何かを実行する場合、ペイントとコンポジットのステップを再度実行する必要があります。合成されていないアニメーションとは、レンダリングパイプラインの初期のステップ（スタイル、レイアウト、またはペイント）のいずれかをトリガーするアニメーションです。合成されていないアニメーションは、ブラウザに多くの作業を強制するため、パフォーマンスが低下します。

レンダリングパイプラインの詳細については、次のリソースを確認してください。

- [最新のWebブラウザの内部を見る（パート3）](https://developer.chrome.com/blog/inside-browser-part3/)
- [ペイントの複雑さを簡素化し、ペイント領域を減らします](/simplify-paint-complexity-and-reduce-paint-areas/)
- [コンポジターのみのプロパティに固執し、レイヤー数を管理します](/stick-to-compositor-only-properties-and-manage-layer-count/)

## Lighthouseが合成されていないアニメーションを検出する方法

アニメーションを合成できない場合、Chromeは失敗の理由をDevToolsトレースに報告します。これは、Lighthouseが読み取るものです。 Lighthouseは、合成されなかったアニメーションを持つDOMノードと、各アニメーションの失敗理由を一覧表示します。

## アニメーションを確実に合成する方法

[コンポジターのみのプロパティに固執し、レイヤー数](/stick-to-compositor-only-properties-and-manage-layer-count/)と[高性能アニメーション](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)を管理するを参照してください。

## 資力

- [合成されてい*ないアニメーションを回避する*監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/non-composited-animations.js)
- [コンポジターのみのプロパティに固執し、レイヤー数を管理します](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [高性能アニメーション](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [ペイントの複雑さを簡素化し、ペイント領域を減らします](/simplify-paint-complexity-and-reduce-paint-areas/)
- [最新のWebブラウザの内部を見る（パート3）](https://developer.chrome.com/blog/inside-browser-part3/)
