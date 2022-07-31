---
layout: post
title: Total Blocking Time (合計ブロック時間)
description: |2-

  LighthouseのTotal Blocking Timeメトリックの概要、それを評価および最適化する方法について学びます。
web_lighthouse:
  - 合計ブロック時間
date: 2019-10-09
updated: 2021-06-04
---

Total Blocking Time（TBT）は、Lighthouseレポートの**[パフォーマンス]**セクションで追跡されるメトリックの1つです。各メトリックは、ページの読み込み速度に関する要素を部分的に取り込みます。

Lighthouseのレポートには、TBTがミリ秒単位で表示されます。

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/wk3OTIdxFPoUImDCnjic.png", alt="LighthouseのTotal Blocking Time (合計ブロック時間) 監査のスクリーンショット", width="800", height="592" %}</figure>

## TBTが測定するもの

TBTは、マウスのクリック、画面のタップ、キーボードの押下といったユーザー入力への応答がブロックされている合計時間を測定します。合計は、[First Contentful Paint (最初のコンテンツ描画にかかるまでの時間)](/fcp/) と [Time to Interactive (インタラクティブになるまでの時間)](/tti/) の間に実行されるすべての[長いタスク](/long-tasks-devtools)の*ブロック部分*を加算することで算出されます。長いタスクとは、50ミリ秒を超えて実行されるタスクのことです。50msを超えた後の時間がブロック部分です。たとえば、Lighthouseが70ミリ秒の長さのタスクを検出した場合、ブロック部分は20ミリ秒になります。

## LighthouseがTBTスコアを決定する方法

サイトのTBTスコアとは、モバイルデバイスに読み込まれたときのページのTBT時間と数百万の実在するサイトのTBT時間とを比較したものです。 Lighthouseスコアのしきい値が設定される仕組みについては、[How metric scores are determined (メトリックスコアの決定方法)](/performance-scoring/#metric-scores)を参照してください。

この表は、TBTスコアを解釈する方法を示しています。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>TBT時間<br>（ミリ秒単位）</th>
        <th>色分け</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0〜200</td>
        <td>緑（速い）</td>
      </tr>
      <tr>
        <td>200〜600</td>
        <td>オレンジ（中程度）</td>
      </tr>
      <tr>
        <td>600以上</td>
        <td>赤（遅い）</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## TBTスコアを改善する方法

Chrome DevToolsのパフォーマンスパネルを使用して長いタスクの根本原因を診断する方法を[What is causing my long tasks? (長いタスクが発生する原因は何ですか？)](/long-tasks-devtools/#what-is-causing-my-long-tasks)と題した記事に記載していますので、ぜひ参照してください。

一般に、長いタスクの最も一般的な原因は次のとおりです。

- JavaScriptによる不要な読み込み、解析、または実行。パフォーマンスパネルでコードを分析していると、メインスレッドによってページの読み込みには不必要な作業が実行されていることに気付くことがあるかもしれません。[コードを分割してJavaScriptのペイロードを削減する](/reduce-javascript-payloads-with-code-splitting/)、[未使用のコードを除去する](/remove-unused-code/)、または[サードパーティのJavaScriptを効率的に読み込む](/efficiently-load-third-party-javascript/)ことを実践すれば、TBTスコアが向上するはずです。
- JavaScriptの非効率的なステートメント。たとえば、[パフォーマンス]パネルでコードを分析した後、2000個のノードを返す`document.querySelectorAll('a')`の呼び出しがあることに気付くとします。10個のノードのみを返すもっと具体的なセレクタを使用するようにコードをリファクタリングすれば、TBTスコアは向上するはずです。

{% Aside %}JavaScriptによる不要な読み込みや解析、実行を見つければ、多くのサイトでは改善につなげる大きなチャンスとなります。{% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## リソース

- [**Total BlockingTime**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/total-blocking-time.js)
- [Are long JavaScript tasks delaying your Time to Interactive? (JavaScriptの長いタスクがインタラクティブになるまでの時間を遅らせていませんか？)](/long-tasks-devtools)
- [Optimize First Input Delay (最初の入力の遅延を最適化する)](/optimize-fid)
- [First Contentful Paint (最初のコンテンツ描画にかかるまでの時間)](/fcp/)
- [Time to Interactive (インタラクティブになるまでの時間)](/tti/)
- [Reduce JavaScript payloads with code splitting (コードを分割してJavaScriptのペイロードを削減する)](/reduce-javascript-payloads-with-code-splitting/)
- [Remove unused code (未使用のコードを除去うする)](/remove-unused-code/)
- [Efficiently load third-party resources (サードパーティのリソースを効率的に読み込む)](/efficiently-load-third-party-javascript/)
