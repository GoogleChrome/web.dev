---
layout: post
title: モバイルネットワークではページの読み込みが十分に速くないです
description: モバイルネットワークでWebページのく読み込みを加速する方法を学びましょう。
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

ページの多くのユーザーは、低速のセルラーネットワーク接続でアクセスします。モバイルネットワークでページの読み込みを改善することで、モバイルユーザーに快適な体験を提供できます。

{% Aside 'note' %} モバイルネットワークでの高速なページ読み込みは、サイトがプログレッシブWeb Appと見なされるための基本要件です。[コアプログレッシブWeb Appのチェックリストを](/pwa-checklist/#core)ご覧ください。 {% endAside %}

## Lighthouseページの読み込み速度の監査がどうのように失敗します

[Lighthouseは](https://developer.chrome.com/docs/lighthouse/overview/)、モバイルである程度で早めに読み込まないページにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="Lighthouse監査はモバイルである程度で早めに読み込まないページを表示します", width="800", height="98" %}</figure>

下記の2つの主要な指標は、読み込み時間に対するユーザーの知覚に影響します。

- [First Meaningful Paint（FMP）](https://developer.chrome.com/docs/lighthouse/performance/first-meaningful-paint/)は、ページのメインとなるコンテンツが表示されるまでの時間を測定します
- [Time to Interactive（TTI）](/tti/)は、ページが操作可能になるまでの時間を測定します

たとえば、ページが1秒後に完全に表示されたが、ユーザーが10秒以内でそのページを操作できない場合、ユーザーはページの読み込み時間を10秒と認識するかもしれません。

Lighthouseは、低速の4Gネットワーク接続でTTIがどうなると計算します。操作可能までの時間が10秒を超える場合、監査は失敗します。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## ページの読み込み時間を改善する方法

{% include 'content/lighthouse-performance/improve.njk' %}

## リソース

- [**モバイルである程度で早めに読み込まないページ**用のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/load-fast-enough-for-pwa.js)
- [基本プログレッシブWeb Appのチェックリスト](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [重要なレンダリングパス](/critical-rendering-path/)
- [ランタイムパフォーマンスの分析から開始する](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [読み込みパフォーマンスの記録](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load)
- [コンテンツ効率の最適化](/performance-optimizing-content-efficiency/)
- [レンダリングパフォーマンス](/rendering-performance/)
