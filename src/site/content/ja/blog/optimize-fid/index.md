---
title: First Input Delay を最適化する
subhead: ユーザーによる操作により速く応答する方法。
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: スマートフォンの画面に触れる手
description: First Input Delay (初回入力までの遅延時間、FID) は、ユーザーが初めてサイトを操作してからブラウザーが実際にその操作に応答するまでの時間を測定するものです。この記事では、使用されていない JavaScript の圧縮、長く時間がかかっているタスクの分割、操作に対する準備状況の改善などの実施により FID を最適化する方法について説明します。
tags:
  - blog
  - performance
  - web-vitals
---

<blockquote>
  <p>クリックしても反応がありません。なぜこのページを操作できないのでしょうか？😢</p>
</blockquote>

[First Contentful Paint](/fcp/) (視覚コンテンツの初期表示時間、FCP) と [Largest Contentful Paint](/lcp/) (最大視覚コンテンツの表示時間、LCP) は、どちらもコンテンツがページ上で視覚的にレンダリング (描画) されるまでにかかる時間を測定する指標です。描画にかかる時間も重要ではありますが、これは*読み込みの応答性*、つまりユーザーの操作に対するページの応答の速さを示すものではありません。

[First Input Delay](/fid/) (FID) は、サイトのインタラクティブ性や応答性についてのユーザーの第一印象を測定する [Core Web Vitals](/vitals/) 指標です。ユーザーが最初にページに操作してからブラウザーが実際にその操作に応答するまでの時間を測定します。FID は[フィールド指標](/user-centric-performance-metrics/#in-the-field)であり、ラボ環境ではシミュレートできません。応答の遅延を測定するには、**実際のユーザーによる操作**が必要です。

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="良いfid値は2.5秒、悪い値は4.0秒を超え、その間の値は改善が必要", width="384", height="96" %}
  </picture>

[ラボ](/how-to-measure-speed/#lab-data-vs-field-data)環境での FID の予測には、[Total Blocking Time (合計ブロック時間、TBT)](/tbt/) をお勧めしています。この 2 つの指標の測定対象は異なりますが、通常 TBT の改善は FID の改善に相当します。

FID が悪化する場合の主な原因には、**重い JavaScript の実行**が挙げられます。Web ページ上での JavaScript の解析方法、コンパイル方法、実行方法を最適化することにより、FID を直接的に短縮することができます。

## 重い JavaScript の実行

ブラウザーは、メイン スレッドで JavaScript を実行している最中にはほとんどのユーザー入力に応答することができません。言い換えれば、メイン スレッドがビジー状態の間はブラウザーがユーザーの操作に応答することはできません。これを改善するには、以下の方法を行います。

- [長く時間がかかっているタスクを分割する](#long-tasks)
- [操作に対する準備状況にページを最適化する](#optimize-interaction-readiness)
- [Web Worker を使用する](#use-a-web-worker)
- [JavaScript の実行にかかる時間を短縮する](#reduce-javascript-execution)

## 長く時間がかかっているタスクを分割する {: #long-tasks }

単一のページで読み込まれる JavaScript の量の削減をすでに試している場合には、長時間に渡って実行されるコードを**比較的小さな非同期タスク**へと分割する方法が有効となる可能性があります。

[**長く時間がかかっているタスク**](/custom-metrics/#long-tasks-api)とは、ユーザーが UI の応答がが悪いと感じる可能性のある JavaScript の実行時間のことを指します。メイン スレッドを 50 ミリ秒以上に渡ってブロックし続けるコードは、すべて長く時間がかかっているタスクとして分類されます。長く時間がかかっているタスクは、潜在的な JavaScript の肥大化 (ユーザーがその場で必要とする以上のものを読み込み、実行すること) の兆候を示しています。長く時間がかかっているタスクを分割することにより、サイトの入力遅延を削減することができます。

<figure>
  {% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Chrome DevTools での長く時間がかかっているタスク", width="800", height="132" %}
  <figcaption>Chrome DevTools のパフォーマンス パネルで<a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">可視化された、長く時間がかかっているタスク</a></figcaption>
</figure>

コード分割や、長く時間がかかっているタスクの分割などのベスト プラクティスを採用することにより、FID は顕著に改善されるはずです。TBT はフィールド指標ではありませんが、Time to Interactive (操作可能になるまでの時間、TTI) および FID の両指標が最終的に改善されるまでの進捗状況の確認に役立ちます。

{% Aside %}詳細については、「[長く時間がかかっている JavaScript タスクが Time to Interactive を悪化させていませんか？](/long-tasks-devtools/)」を参照してください。{% endAside %}

## 操作に対する準備状況にページを最適化する

JavaScript に大きく依存している Web アプリケーションで FID や TBT のスコアが悪化する原因には、いくつかのものが考えられます。

### ファーストパーティー スクリプトの実行によって操作に対する準備状況に遅延が生じる

- JavaScript のサイズの肥大化、実行時間の長期化、非効率なチャンキングは、ユーザーの入力に対するページの応答時間を遅らせ、FID、TBT、TTI に影響を与えます。コードや機能のプログレッシブ読み込みはこの作業を分散させ、操作に対する準備状況を改善させます。
- サーバー側でレンダリングされたアプリは、一見すぐに画面にピクセルが描画されるように見えるかもしれませんが、大量のスクリプトの実行によってユーザーの操作がブロックされる場合もあるので注意が必要です (イベント リスナーを接続するためのリハイドレーションなど)。ルートベースのコード分割が使用されている場合、これには数百ミリ秒、場合によっては数秒かかる可能性があります。より多くのロジックをサーバー側に移行するか、ビルド時に静的にコンテンツを生成することを検討してください。

次に示すのは、あるアプリケーションのファーストパーティー スクリプトの読み込みを最適化する前後での TBT スコアの比較です。必要のないコンポーネントのために読み込み (および実行) にコストがかかっていたスクリプトをクリティカル パスから除外することにより、ユーザーはより早くページを操作できるようになりました。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="ファーストパーティー スクリプトの最適化により、Lighthouse での TBT スコアが改善されました。", width="800", height="148" %}

### データフェッチが操作に対する準備状況の様々な側面に影響を与える可能性がある

- カスケーディング フェッチのウォーターフォール (例: コンポーネントで使用される JavaScript やデータのフェッチ) での待機は、操作の遅延時間に影響を及ぼす可能性があります。カスケーディング データ フェッチへの依存は、最小限に抑えるようにしましょう。
- サイズの大きいインラインのデータストアは、HTML の解析にかかる時間を増大させ、描画や操作の指標に影響を与えます。クライアント側で後処理が必要なデータの量を最小限に抑えるようにしましょう。

### サードパーティ スクリプトの実行も操作の遅延時間に悪影響を及ぼす可能性がある

- ネットワークをビジー状態にし、メイン スレッドを定期的に応答不可の状態にする可能性があるサードパーティ製のタグやアナリティクスが多くのサイトで使用されていますが、これらは操作の遅延時間に影響を及ぼします。サードパーティ製のコードについてはオンデマンドでの読み込みをご検討ください (たとえば、スクロールしてビューポートの範囲内に含まれるまで、Below the fold (ビロウ・ザ・フォールド、スクロールせずに閲覧可能なサイトのファースト ビュー以外の部分を指す) にある広告を読み込まないようにするなど)。
- 場合によっては、メイン スレッドでの優先度や帯域幅の観点からサードパーティ スクリプトがファーストパーティ スクリプトよりも先に実行される可能性があり、ページが操作に応答できるようになるまでの時間にも遅延が生じる場合があります。ユーザーにとって最も価値があると思われるものを優先的に読み込むようにしましょう。

## Web Worker を使用する

メイン スレッドのブロックは、入力遅延を引き起こす主な原因の 1 つです。[Web Worker](https://developer.mozilla.org/docs/Web/API/Worker) は、JavaScript をバックグラウンドのスレッドで実行できるようにします。UI 以外の処理を別のワーカー スレッドに移すことでメイン スレッドのブロック時間を短縮し、結果的に FID を改善させることができます。

運営するサイトで Web Worker をより簡単にご利用いただくために、以下のライブラリの使用をご検討ください。

- [Comlink](https://github.com/GoogleChromeLabs/comlink): `postMessage` を抽象化して使いやすくしたヘルパー ライブラリ
- [Workway](https://github.com/WebReflection/workway): 汎用的な Web Worker エクスポーター
- [Workerize](https://github.com/developit/workerize): モジュールを Web Worker に移動

{% Aside %}Web Worker を利用してメイン スレッド以外でコードを実行する方法については、「[Web Worker を使用してブラウザーのメイン スレッド以外で JavaScript を実行する](/off-main-thread/)」を参照してください。{% endAside %}

### JavaScript の実行にかかる時間を短縮する {: #reduce-javascript-execution }

ページ上の JavaScript の量を制限することで、ブラウザーが JavaScript コードを実行するために必要となる時間を短縮することができます。これにより、ユーザーの操作に対するブラウザーの応答時間を高速化することができます。

ページ上で実行される JavaScript の量を減らす方法には、以下のものがあります。

- 使用されていない JavaScript を先送りする
- 使用されていないポリフィルを最小限に抑える

#### 使用されていない JavaScript を先送りする

デフォルトでは、すべての JavaScript はレンダリングをブロックします。ブラウザーは外部の JavaScript ファイルにリンクされているスクリプト タグに遭遇すると処理を中断し、その JavaScript のダウンロード、解析、コンパイル、実行を行わなければならなくなります。そのため、ページの処理やユーザーの入力に対する応答に必要なコードのみを読み込む必要があります。

Chrome DevTools の [Coverage](https://developer.chrome.com/docs/devtools/coverage/) (カバレッジ) タブでは、Web ページで使用されていない JavaScript がどの程度存在しているかを確認することができます。

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="Coverage (カバレッジ) タブ。", width="800", height="559" %}

使用されていない JavaScript を削減する方法には、以下のものがあります。

- 複数のチャンクへとバンドルのコードを分割する
- サードパーティ スクリプトを含む重要でない JavaScript を`async` または `defer` を使用して先送りする

**コード分割**とは、1 つの大きな JavaScript バンドルを条件付きでの読み込みが可能な小さなチャンクへと分割することを意味します (レイジーロードとも呼ばれています)。[最新のブラウザーのほとんどが動的なインポート構文をサポート](https://caniuse.com/#feat=es6-module-dynamic-import)しており、モジュールを必要に応じてフェッチすることができます。

```js
import('module.js').then((module) => {
  // モジュールを使用して何かを実行します。
});
```

特定のユーザー操作 (ルートの変更やモーダル ウィンドウの表示など) に関する JavaScript を動的にインポートすることにより、最初のページ読み込みに使用されないコードを必要な場合にのみ取得できるようになります。

一般的なブラウザーのサポートに加えて、動的なインポート構文は様々なビルド システムでも使用が可能です。

- モジュール バンドラーとして [webpack](https://webpack.js.org/guides/code-splitting/)、[Rollup](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82)、[Parcel](https://parceljs.org/code_splitting.html) を使用している場合には、それらが提供する動的インポートのサポートをご利用ください。
- [React](https://reactjs.org/docs/code-splitting.html#reactlazy)、[Angular](https://angular.io/guide/lazy-loading-ngmodules)、[Vue](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) のようなクライアントサイド フレームワークでは、コンポーネントレベルでのレイジーロードを容易にするための抽象化を提供しています。

{% Aside %}コード分割の詳細については、「[コード分割による JavaScript ペイロードの削減](/reduce-javascript-payloads-with-code-splitting/)」を参照してください。{% endAside %}

コード分割以外にも、クリティカル パスや Above the fold (アバブ・ザ・フォールド、スクロールせずに閲覧可能なサイトのファースト ビューを指す) のコンテンツに必要のないスクリプトについては常に [async または defer](https://javascript.info/script-async-defer) を使用してください。

```html
<script defer src="…"></script>
<script async src="…"></script>
```

特別な理由がない限りは、すべてのサードパーティ スクリプトをデフォルトで `defer` または `async` のいずれかを使用して読み込むようにすることを強くお勧めします。

#### 使用されていないポリフィルを最小限に抑える

最新の JavaScript 構文を使用してコードを作成したり、最新のブラウザー API を参照したりしている場合、ページを古いブラウザーで動作させるためにはトランスパイルを行ったり、ポリフィルを使用したりする必要があります。

ポリフィルやトランスパイルされたコードをサイトに使用する場合に考えられる主なパフォーマンス上の問題点の 1 つとして、最新のブラウザーがそれらを必要としていない場合にはダウンロードを行う必要がなくなるということが挙げられます。アプリケーションの JavaScript サイズを削減するには、使用されていないポリフィルを可能な限り少なくし、それらが必要とされる環境に限定して使用するようにしてください。

運営するサイトでのポリフィルの使用を最適化する方法には、以下のものがあります。

- トランスパイラとして [Babel](https://babeljs.io/docs/en/index.html) を使用している場合、[`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) を使用して、ターゲットにするブラウザーが必要とするポリフィルのみを使用するようにします。Babel 7.9 では、不必要なポリフィルをさらに削減するために [`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) オプションを有効にしてください。

- module/nomodule パターンを使用して、異なるバンドルを 2 つ配信します (`@babel/preset-env` も [`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules) を介してこれをサポートしています)。

    ```html
    <script type="module" src="modern.js"></script>
    <script nomodule src="legacy.js" defer></script>
    ```

    JavaScript モジュールをサポートしている環境であれば、Babel を使用してコンパイルされた新しい ECMAScript の機能の多くはすでにサポートされています。そのため、この手法を用いることにより、トランスパイルされたコードのみが実際にそれらを必要としているブラウザーに使用されていることを確認するプロセスを簡素化することができます。

{% Aside %}このトピックの詳細については、「[最新のコードを最新のブラウザーに配信して、ページの読み込みを高速化する](/serve-modern-code-to-modern-browsers/)」ガイドをご覧ください。{% endAside %}

## 開発者ツール

FID を測定またはデバッグするためのツールは、以下のように様々なものが用意されています。

- FID はフィールド指標であるため、[Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) には FID のサポートは含まれていません。ただし、その代替指標として [Total Blocking Time](/tbt/) (TBT) を使用することができます。TBT を改善することができる最適化手法であれば、実際のユーザー環境での FID も改善することができるはずです。

    {% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="Lighthouse 6.0", width="800", height="309" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) は、オリジンレベルで集計された実際の環境での FID 値を提供します。

*レビューしていただいた Philip Walton、Kayce Basques、Ilya Grigorik、Annie Sullivan には、心より感謝申し上げます。*
