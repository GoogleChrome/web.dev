---
layout: post
title: ファサードを使用したサードパーティリソースの遅延読み込み
description: ファサードを使用してサードパーティのリソースを遅延読み込みする機会について学習します。
date: 2020-12-01
web_lighthouse:
  - third-party-facades
---

[サードパーティのリソース](/third-party-javascript/)は、広告や動画の表示やソーシャルメディアとの統合でよく使用されます。デフォルトのアプローチでは、ページが読み込まれるとすぐにサードパーティのリソースが読み込まれますが、これによりページの読み込みが不必要に遅くなる可能性があります。サードパーティのコンテンツが重要でない場合は、[遅延読み込み](/fast/#lazy-load-images-and-video)を行うことで、このパフォーマンスコストを削減できます。

このレポートでは、操作時に遅延読み込みできるサードパーティの埋め込みに焦点を当てます。その場合、ユーザーが操作するまで、サードパーティのコンテンツの代わりに*ファサード*が使用されます。

{% Aside 'key-term' %}

*ファサード*は静的な要素であり、実際に埋め込まれているサードパーティに似ていますが、機能していないため、ページの読み込みにかかる負担がはるかに少なくなります。

{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="ファサードを使用してYouTube埋め込みプレーヤーを読み込む例。操作時に読み込まれるファサードのサイズは3KB、プレーヤーのサイズは540 KBです。", width="800", height="521" %} <figcaption>ファサードを使用してYouTube埋め込みプレーヤーを読み込んでいます。</figcaption></figure>

## 遅延可能なサードパーティの埋め込みをLighthouseによって検出する方法

Lighthouseは、ソーシャルボタンウィジェットや動画埋め込み (YouTube埋め込みプレーヤーなど) など、遅延できるサードパーティ製品を検索します。

遅延可能な製品と利用可能なファサードに関するデータは、[third-party-webで管理](https://github.com/patrickhulce/third-party-web/)されています。

これらのサードパーティの埋め込みのいずれかに属するリソースがページによって読み込まれると、監査は失敗します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Vimeo組み込みプレーヤーとDriftライブチャットを強調するLighthouseサードパーティファサード監査。", width="800", height="517" %} <figcaption>Lighthouseサードパーティのファサード監査。</figcaption></figure>

## ファサードを使用してサードパーティを遅延する方法

サードパーティの埋め込みをHTMLに直接追加するのではなく、実際に埋め込まれたサードパーティコンテンツに似た静的要素を使用してページを読み込みます。連携パターンは次のようになります。

1. 読み込み時：ページにファサードを追加します。

2. マウスオーバー時: ファサードはあらかじめサードパーティのリソースに接続します。

3. クリック時: ファサードはサードパーティ製品に置き換えられます。

## お勧めのファサード

一般に、動画埋め込み、ソーシャルボタンウィジェット、およびチャットウィジェットではすべてファサードパターンを採用できます。以下の一覧は、お勧めのオープンソースファサードです。ファサードを選択するときには、サイズと機能セットのバランスを考慮してください。[vb/lazyframe](https://github.com/vb/lazyframe)などの遅延iframeローダーを使用することもできます。

### YouTube埋め込みプレーヤー

- [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

- [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

- [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Vimeo埋め込みプレーヤー

- [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

- [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### ライブチャット (Intercom、Drift、Help Scout、Facebook Messenger)

- [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader) ([ブログ投稿](https://calibreapp.com/blog/fast-live-chat))

{% Aside 'caution' %}

ファサードを使用して、サードパーティコンテンツを遅延読み込みするときには、実際の埋め込みの機能がすべて備わっていないため、いくつかのトレードオフがあります。たとえば、Driftライブチャットバブルには、新しいメッセージの数を示すバッジがあります。ファサードを使用して、ライブチャットバブルを遅延した場合、ブラウザーで`requestIdleCallback`を呼び出した後に、実際のチャットウィジェットが読み込まれたときに、バブルが表示されます。ビデオ埋め込みの場合、読み込みが遅いと自動再生が一貫した動作にならない場合があります。

{% endAside %}

## 独自のファサードを作成する

上記の連携パターンを採用する[カスタムファサードソリューションを構築](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget)することもできます。ファサードには、遅延されたサードパーティ製品よりも大幅に小さく、製品の外観を模倣するのに十分なコードのみを含めてください。

ご自身のソリューションを上記の一覧に追加したい場合は、 [提出手順](https://github.com/patrickhulce/third-party-web/blob/master/facades.md)を確認してください。

## リソース

[ファサード監査を使用したサードパーティリソースの遅延読み込み](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/third-party-facades.js)のソースコード。
