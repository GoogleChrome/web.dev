---
layout: post
title: JavaScriptの実行時間を短縮する
description: JavaScriptの実行によりページのパフォーマンスが低下すること、またJavaScriptの実行を高速化する方法について学びます。
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - bootup-time
tags:
  - memory
---

JavaScriptの実行に時間がかかると、ページのパフォーマンスはさまざまなかたちで低下します。

- **ネットワークコスト**

    バイト数が多いと、ダウンロードも長引きます。

- **解析とコンパイルのコスト**

    JavaScriptは、メインスレッドで解析およびコンパイルされます。メインスレッドがビジー状態に陥ると、ページはユーザー入力に応答できません。

- **実行コスト**

    JavaScriptもまた、メインスレッドで実行されます。ページがその時点ではまだ必要のないコードを数多く実行してしまうと、[Time to Interactive (インタラクティブになるまでの時間)](/tti/) (ユーザーがどのようにページの速度を認識しているかを判断するための主な指標の1つ) も遅延します。

- **メモリコスト**

    JavaScriptが多くの参照を保持すると、それにより多くのメモリが消費される場合があります。大量のメモリを消費するページは、ぎくしゃくしたり、遅く見えたりします。メモリリークが発生すると、ページは完全にフリーズしてしまう場合があります。

## LighthouseのJavaScript実行時間監査が失敗する原因

JavaScriptの実行に2秒以上かかると、[Lighthouseは警告を表示します。実行に3.5秒以上かかると、監査は失敗します。](https://developer.chrome.com/docs/lighthouse/overview/)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="LighthouseによるJavaScript実行時間短縮監査のスクリーンショット", width="800", height="321" %}</figure>

実行時間が長くなる最大の要因を特定できるように、Lighthouseは、ページが読み込む各JavaScriptファイルの実行、評価、解析に費やされた時間を報告してくれます。

{% include 'content/lighthouse-performance/scoring.njk' %}

## JavaScriptの実行を高速化する方法

{% include 'content/lighthouse-performance/js-perf.njk' %}

## リソース

[**Reduce JavaScript execution time (JavaScriptの実行時間を短縮する)** 監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/bootup-time.js)
