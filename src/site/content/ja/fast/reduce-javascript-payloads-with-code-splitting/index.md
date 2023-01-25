---
layout: post
title: コード分割でJavaScriptペイロードを削減する
authors:
  - houssein
description: 大きなJavaScriptペイロードを送信すると、サイトの速度に大きく影響します。アプリケーションの最初のページが読み込まれたときにすぐにすべてのJavaScriptをユーザーに送信するのではなく、バンドルを複数の部分に分割し、一番最初の時点で必要な項目のみを送信します。
date: 2018-11-05
codelabs:
  - codelab-code-splitting
tags:
  - performance
---

誰でも待ち時間は減らしたいものです。**[読み込みに3秒以上かかると、ユーザーの50％以上がそのWebサイトを諦めます](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)**。

大きなJavaScriptペイロードを送信すると、サイトの速度に大きく影響します。アプリケーションの最初のページが読み込まれるとすぐにすべてのJavaScriptをユーザーに送信するのではなく、バンドルを複数の部分に分割し、最初に必要な項目のみを送信します。

## 測定

ページ上のすべてのJavaScriptの実行にかなりの時間がかかると、Lighthouseは監査の失敗を示します。

{% Img src="image/admin/p0Ahh3pzXog3jPdDp6La.png", alt="実行に時間がかかりすぎるスクリプトを示すLighthouse監査の失敗。", width="797", height="100" %}

JavaScriptバンドルを分割して、ユーザーがアプリケーションを読み込んだときに最初のルートに必要なコードのみを送信します。これにより、解析およびコンパイルする必要のあるスクリプトの量が最小限に抑えられ、ページの読み込み時間が短縮されます。

[webpack](https://webpack.js.org/guides/code-splitting/)、[Parcel](https://parceljs.org/code_splitting.html)、[Rollup](https://rollupjs.org/guide/en#dynamic-import)などの一般的なモジュールバンドラを使用すると、[動的インポート](https://v8.dev/features/dynamic-import)を使用してバンドルを分割できます。たとえば、フォームが送信されたときに実行される`someFunction`メソッドの例を示す次のコードスニペットについて検討します。

```js
import moduleA from "library";

form.addEventListener("submit", e => {
  e.preventDefault();
  someFunction();
});

const someFunction = () => {
  // uses moduleA
}
```

ここで、 `someFunction`は特定のライブラリからインポートされたモジュールを使用します。このモジュールが他の場所で使用されていない場合は、フォームがユーザーによって送信されたときにのみ動的インポートを使用してフェッチするようにコードブロックを変更できます。

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('library.moduleA')
    .then(module => module.default) // using the default export
    .then(someFunction())
    .catch(handleError());
});

const someFunction = () => {
    // uses moduleA
}
```

モジュールを構成するコードは最初のバンドルに含まれず、**遅延読み込み**されるか、フォームの送信後に必要な場合にのみユーザーに表示されます。ページのパフォーマンスをさらに向上させるには、[クリティカルチャンクを事前読み込みし、優先的に早い段階で取り込みます](/preload-critical-assets)。

前のコードスニペットはシンプルな例ですが、大規模なアプリケーションでは、サードパーティの依存関係の遅延読み込みは、一般的なパターンではありません。通常、サードパーティの依存関係は、頻繁に更新されないため、キャッシュに保存できる個別のベンダーバンドルに分割されます。詳細については、[**SplitChunksPlugin**](https://webpack.js.org/plugins/split-chunks-plugin/)を使用してこの手順を実行する方法を参照してください。

クライアント側フレームワークを使用するときに、ルートまたはコンポーネントレベルで分割すると、アプリケーションのさまざまな部分を遅延読み込みするためのよりシンプルなアプローチです。webpackを使用する多くの一般的なフレームワークは抽象化を提供しており、自分で構成を行うよりも遅延読み込みが簡単になります。
