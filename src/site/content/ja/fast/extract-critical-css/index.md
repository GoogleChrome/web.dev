---
layout: post
title: 重要なCSSを抽出する
subhead: 重要なCSSテクニックを使用してレンダリング時間を改善する方法を学びます。
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: レンチとドライバのフラットレイ写真。
description: |2-

  重要なCSS手法を使用してレンダリング時間を改善する方法と、プロジェクトに最適なツールを選択する方法を学びます。
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog
  - performance
  - css
---

ブラウザは、ページを表示する前にCSSファイルをダウンロードして解析する必要があります。これにより、CSSはレンダリングブロックリソースになります。 CSSファイルが大きい場合、またはネットワークの状態が悪い場合、CSSファイルの要求により、Webページのレンダリングにかかる時間が大幅に長くなる可能性があります。

{% Aside 'key-term' %}クリティカルCSSは、ユーザーに対してコンテンツをできるだけ速くレンダリングするために、重要なコンテンツのCSSを抽出する手法です。 {% endAside %}

<figure>{% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="画面の端からWebページがオーバーフローするノートPCとモバイルデバイスの図", width="800", height="469", class="" %}</figure>

{% Aside 'note' %}最も重要なのは、ページの読み込み時に、スクロールする前に、閲覧者に表示されるすべてのコンテンツです。非常に多数のデバイスと画面サイズがあるため、折りたたまれたコンテンツの上にあると見なされるコンテンツには普遍的に定義されたピクセルの高さがありません。 {% endAside %}

HTMLドキュメントの`<head>`で抽出されたスタイルをインライン化すると、これらのスタイルを取り込むために追加の要求を行う必要がなくなります。 CSSの残りの部分は非同期でロードできます。

<figure>{% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="クリティカルCSSが先頭でインライン化されたHTMLファイル", width="800", height="325" %} <figcaption>インライン化されたクリティカルCSS</figcaption></figure>

レンダリング時間を改善すると、特にネットワークの状態が悪い[場合に、知覚されるパフォーマンスに](/rail/#focus-on-the-user)大きな違いが生じる可能性があります。モバイルネットワークでは、帯域幅に関係なく、高遅延が問題になります。

<figure>{% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="3G接続でレンダリングブロックCSSを使用したページ (上) とインライン化されたクリティカルCSSを使用した同じページ (下) を読み込んだフィルムストリップビューの比較。上のフィルムストリップは、最終的にコンテンツを表示する前の6つの空白フレームを表示します。下のフィルムストリップは、最初のフレームに意味のあるコンテンツを表示します。", width="800", height="363" %} <figcaption>3G接続でレンダリングブロックCSSを使用したページ (上) とインライン化されたクリティカルCSSを使用した同じページ (下) の読み込みの比較</figcaption></figure>

[First Contentful Paint (FCP)](/fcp/) が不十分で、Lighthouse監査で「レンダリングブロックリソースの排除」の可能性が特定された場合は、クリティカルCSSを試してみることをお勧めします。

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="「レンダリングブロックリソースの排除」または「未使用のCSSの遅延」の可能性が特定されたLighthouse監査", width="743", height="449" %}

{% Aside 'gotchas' %}大量のCSSをインライン化すると、残りのHTMLドキュメントの送信が遅れることに注意してください。すべてが優先されるということは、何も優先されないということです。インライン化には、ブラウザがCSSをキャッシュに保存できず、後続のページの読み込みでCSSを再利用できないという欠点もあるため、慎重に使用することをお勧めします。 {% endAside %}

<p id="14KB">最初にレンダリングする際の往復処理の数を最小限に抑えるには、最も重要なコンテンツを<strong>14 KB</strong> (圧縮) 未満に抑えるようにしてください。</p>

{% Aside 'note' %}新しい[TCP](https://hpbn.co/building-blocks-of-tcp/)接続は、クライアントとサーバーの間で利用可能な帯域幅全体をすぐに使用することができません。伝送可能な容量を超えたデータで接続が過負荷になるのを防ぐために、[slow-start](https://hpbn.co/building-blocks-of-tcp/#slow-start)で処理されます。このプロセスでは、サーバーは少量のデータで転送を開始し、完全な状態でクライアントに到達した場合、次の往復処理でデータ量を2倍にします。ほとんどのサーバーでは、最初の往復処理で転送できる最大値は10パケットまたは約14KBです。 {% endAside %}

この手法で達成できるパフォーマンスへの影響は、Webサイトのタイプによって異なります。一般的に、サイトのCSSが多いほど、インラインCSSの影響が大きくなる可能性があります。

## ツールの概要

ページのクリティカルCSSを自動的に決定できる多数の優れたツールがあります。この処理を手動で実行するのは非常に大変なので、このようなツールを使用すると便利です。ビューポートの各要素に適用されるスタイルを決定するには、DOM全体を分析する必要があります。

### Critical

[Critical](https://github.com/addyosmani/critical)は最も重要なCSSを抽出、縮小、インライン化し、[npmモジュール](https://www.npmjs.com/package/critical)として提供されています。 Gulp (直接) またはGrunt ([プラグイン](https://github.com/bezoerb/grunt-critical)として) で使用でき、[webpackプラグイン](https://github.com/anthonygore/html-critical-webpack-plugin)もあります。

このツールはシンプルで、プロセスで多数の判定を実行します。スタイルシートを指定する必要さえありません。Criticalによって自動的に検出されます。また、複数の画面解像度のクリティカルCSSの抽出もサポートしています。

### criticalCSS

[CriticalCSS](https://github.com/filamentgroup/criticalCSS)は、最も重要なCSSを抽出するもう1つの[npmモジュールです。](https://www.npmjs.com/package/criticalcss) CLIとしても利用できます。

クリティカルCSSをインライン化して縮小するオプションはありませんが、実際にはクリティカルCSSに属していないルールを強制的に含めることができ、`@font-face`宣言の包含をさらに細かく制御できます。

### Penthouse

[Penthouse](https://github.com/pocketjoso/penthouse)は、サイトまたはアプリに多数のスタイルまたはDOMに動的に挿入されるスタイル (Angularアプリで一般的に使用されている) がある場合に適しています。内部的に[Puppeteer](https://github.com/GoogleChrome/puppeteer)を使用し、[オンラインでホスティングされているバージョン](https://jonassebastianohlsson.com/criticalpathcssgenerator/)も提供しています。

Penthouseはスタイルシートを自動的に検出しません。クリティカルCSSを生成するHTMLファイルとCSSファイルを指定する必要があります。利点は、多数のジョブを並列で実行できることです。
