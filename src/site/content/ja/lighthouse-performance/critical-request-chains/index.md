---
layout: post
title: クリティカル要求をチェーン化しない
description: クリティカル要求チェーンとは何か、Webページのパフォーマンスにどのように影響するのか、その影響を低減する方法について説明します。
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - クリティカル要求チェーン
---

[クリティカル要求チェーン](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)は、ページのレンダリングにとって重要な一連の依存ネットワークリクエストです。チェーンの長さが長く、ダウンロードサイズが大きいほど、ページの読み込みパフォーマンスへの影響が大きくなります。

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、高優先度で読み込まれたクリティカル要求を報告します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Lighthouseのクリティカル要求深度の最小化監査のスクリーンショット", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Lighthouseがクリティカル要求チェーンを識別する方法

Lighthouseは、レンダリングをブロックする重要なリソースを識別するためのプロキシとしてネットワーク優先度を使用します。Chromeがこれらの優先度を定義する方法の詳細については、Googleの[Chromeリソースの優先度とスケジュール](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)を参照してください。

クリティカル要求チェーン、リソースサイズ、リソースのダウンロードに費やされた時間に関するデータは、[Chromeリモートデバッグプロトコル](https://github.com/ChromeDevTools/devtools-protocol)から抽出されます。

## クリティカル要求チェーンがパフォーマンスに与える影響を減らす方法

クリティカル要求チェーンの監査結果を使用して、最初にページの読み込みに最大の影響を与えるリソースをターゲットにします。

- 重要なリソースの数を最小限に抑えます。たとえば、これらのリソースを削除したり、ダウンロードを遅延させたり、`async`に設定したりします。
- 重要なバイト数を最適化して、ダウンロード時間 (ラウンドトリップ数) を減らします。
- 残りの重要なリソースが読み込まれる順序を最適化します。クリティカルパスの長さを短くするために、すべてのクリティカルアセットをできるだけ早くダウンロードします。

[画像](/use-imagemin-to-compress-images)、[JavaScript](/apply-instant-loading-with-prpl)、[CSS](/defer-non-critical-css)、および[Webフォント](/avoid-invisible-text)の最適化の詳細をご覧ください。

## スタック固有のガイダンス

### Magento

JavaScriptアセットをバンドルしていない場合は、 [baler](https://github.com/magento/baler)の使用を検討してください。

## リソース

[**クリティカル要求の深度の最小化**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)
