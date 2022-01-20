---
layout: post
title: 未使用のコードを削除する
subhead: npmを使用すると、プロジェクトにコードを簡単に追加できます。しかし、あなたは本当に余分なバイトを全て使用していますか？
authors:
  - houssein
date: 2018-11-05
description: npmのようなレジストリは、全員が簡単にダウンロードして50万人以上の公開パッケージを使用できるようにすることにより、JavaScriptの世界を改善しています。ただし、十分に活用していないライブラリを含めることがよくあります。本問題を解決するには、バンドルを分析し、未使用のコードを検出しする必要となります。
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

[npmの](https://docs.npmjs.com/getting-started/what-is-npm)のようなレジストリは、全員が簡単にダウンロードして*50万*以上の公開パッケージを使用できるようにすることにより、JavaScriptの世界を改善しています。ただし、十分に活用していないライブラリを含めることがよくあります。本問題を解決するには、 **バンドルを分析** し、未使用のコードを検出しする必要となります。次に、**未使用**および**不要な**ライブラリを削除します。

## バンドルを分析する

DevToolsを使用すると、すべてのネットワークリクエストのサイズを簡単に確認できます。{% Instruction 'devtools-network', 'ol' %} {% Instruction 'disable-cache', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="バンドルリクエストのあるネットワークパネル", width="800", height="169" %}

[DevToolsのカバレッジ](https://developer.chrome.com/docs/devtools/coverage/)タブには、アプリケーション内の未使用のCSSおよびJSコードの量も表示されます。

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="DevToolsのコードカバレッジ", width="800", height="562" %}

ノードCLIを介して完全なLighthouse構成を指定することにより、「未使用のJavaScript」監査を使用して、アプリケーションに付属している未使用のコードの量を追跡することもできます。

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Lighthouse Unused JS Audit", width="800", height="347" %}

バンドラーとして[webpack](https://webpack.js.org/)を使用している場合は[、Webpack BundleAnalyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)がバンドルの構成要素を調査するのに役立ちます。他のプラグインと同様に、プラグインをwebpack構成ファイルに含めます。

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

webpackは通常、シングルページアプリケーションの構築に使用されますが、 [Parcel](https://parceljs.org/)や[Rollup](https://rollupjs.org/guide/en)などの他のバンドラーにも、バンドルの分析に使用できる視覚化ツールが持っています。

このプラグインが含まれている状態でアプリケーションをリロードすると、バンドル全体のズーム可能なツリーマップが表示されます。

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack Bundle Analyzer", width="800", height="468" %}

この可視化では、バンドルのどの部分が他の部分よりも大きいかを調べたり、インポートしているすべてのライブラリをより正確に把握したりできます。これは、未使用または不要なライブラリを使用しているかどうかを識別するのに役立ちます。

## 未使用のライブラリを削除する

前のツリーマップイメージでは、単一の`@firebase`ドメイン内にかなりの数のパッケージがあります。ウェブサイトにFirebaseデータベースコンポーネントのみが必要な場合は、インポートを更新してそのライブラリを取得します。

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

このプロセスは、大規模なアプリケーションでは非常に複雑であることを強調する必要となります。

どこにも使用されていないはずで不思議にみえるパッケージについては、見直し、どの優先依存性が使用しているかを確認してください。必要なコンポーネントのみをインポートする方法を見つけてください。ライブラリを使用していない場合は、ライブラリを削除してください。ライブラリが最初のページ読み込みに必要ない場合は、[遅延読み込み](/reduce-javascript-payloads-with-code-splitting)できるかどうかを検討してください。

また、webpackを使用している場合は[、人気のあるライブラリから未使用のコードを自動的に削除するプラグインのリストを](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)確認してください。

{% Aside 'codelab' %}[未使用のコードを削除します。](/codelab-remove-unused-code) {% endAside %}

## 不要なライブラリを削除する

すべてのライブラリを簡単にパーツに分割して選択的にインポートできるわけではありません。これらのシナリオでは、ライブラリを完全に削除できるかどうかを検討してください。カスタムソリューションを構築するか、より軽量な代替手段を活用することは、常に検討する価値のあるオプションです。ただし、アプリケーションからライブラリを完全に削除する前に、これらの作業のいずれかに必要な複雑さと作業を比較検討することが重要です。
