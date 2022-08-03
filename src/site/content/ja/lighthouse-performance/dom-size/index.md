---
layout: post
title: 過大な DOM サイズを回避
description: 大規模な DOM によって Web ページのパフォーマンスが低下してしまうことと、読み込み時に DOM のサイズを縮小する方法を学びます。
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - dom-size
tags:
  - memory
---

大規模な DOM ツリーは、さまざまな方法でページのパフォーマンスを低下させる可能性があります。

- **ネットワーク効率と読み込みパフォーマンス**

    大規模なDOMツリーには、ユーザーが最初にページを読み込んだときに表示されないノードが多数含まれていることがよくあります。これにより、ユーザーのデータコストが不要に増加し、読み込み時間が遅くなります。

- **ランタイムのパフォーマンス**

    ユーザーとスクリプトはページと対話するため、ブラウザは[ノードの位置とスタイルを絶えず再計算](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli)する必要があります。複雑なスタイルルールが伴う大規模な DOM ツリーは、レンダリングを大幅に遅らせる可能性があります。

- **メモリのパフォーマンス**

    JavaScript が `document.querySelectorAll('li')` などの一般的なクエリセレクターを使用している場合、非常に多数のノードへの参照を無意識のうちに保存している可能性があり、これによりユーザーのデバイスのメモリ機能を抑え込む可能性があります。

## Lighthouse の DOM サイズ監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、ページの DOM 要素の合計、ページの最大 DOM 深度、およびその最大子要素を報告します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="Lighthouse の「過大な DOM サイズを回避」監査のスクリーンショット", width="800", height="363" %}</figure>

Lighthouse は DOM ツリーのあるページに以下のようなフラグを設定します。

- Body 要素に約 800 を超えるノードがあることを警告します。
- Body 要素に約 1,400 を超えるノードがある場合はエラーとなります。

{% include 'content/lighthouse-performance/scoring.njk' %}

## DOM サイズを最適化するには

一般に、必要な場合にのみ DOM ノードを作成し、不要になったら破棄する方法を探してください。

現在、大規模な DOM ツリーを公開している場合は、ページを読み込んで、度のノードを表示するかを手動で指定するようにします。おそらく、表示されていないノードは最初に書見込まれるドキュメントから除去し、スクロールやボタンクリックといった関連するユーザー操作の後にのみ作成するようにすることができます。

ランタイム時に DOM ノードを作成する場合は、[DOM 変更ブレークポイントでサブツリーの変更](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom)を使用すると、ノードが作成されるタイミングをピンポイントするのに役立ちます。

大規模な DOM ツリーを避けられない場合は、CSS セレクターを単純化することで、レンダリングのパフォーマンスを改善することができます。詳細は、Google の「[スタイル計算の範囲と複雑さを軽減する](/reduce-the-scope-and-complexity-of-style-calculations/)」をご覧ください。

## スタック特定のガイダンス

### Angular

大規模なリストをレンダリングする場合は、Component Dev Kit（CDK）の[仮想スクロール](/virtualize-lists-with-angular-cdk/)を使用してください。

### React

- ページで多数の反復要素をレンダリングしている場合は、[`react-window`](/virtualize-long-lists-react-window/) などの「ウィンドウイング」ライブラリを使用して、作成される DOM の数を最小限に抑えてください。
- [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action)、[`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent)、または [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) を使って、不要な再レンダリングを最小限に抑えてください。
- ランタイムのパフォーマンスを改善するために `Effect` フックを使用している場合は、特定の依存関係が変更するまでのみ[効果をスキップ](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)してください。

## リソース

- [**過大なDOMサイズを回避**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/dom-size.js)
- [スタイル計算の範囲と複雑さを軽減する](/reduce-the-scope-and-complexity-of-style-calculations/)
