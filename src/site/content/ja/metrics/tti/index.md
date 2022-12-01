---
layout: post
title: Time to Interactive (TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: この投稿では、Time to Interactive (操作可能になるまでの時間、TTI) という指標について紹介し、その測定方法に関する説明を行います。
tags:
  - performance
  - metrics
---

{% Aside %}Time to Interactive (操作可能になるまでの時間、TTI) は、[読み込みの応答性](/user-centric-performance-metrics/#in-the-lab)を測定するために重要となる[ラボ環境での指標](/user-centric-performance-metrics/#types-of-metrics)です。TTI は、ページが*見かけ上*操作可能になっているものの、実際にはそうでない場合を特定するのに役立ちます。TTI を高速にすることで、そのページが[使用可能](/user-centric-performance-metrics/#in-the-lab)であることをユーザーに確信させることができます。{% endAside %}

## TTI とは？

TTI 指標は、ページの読み込みが開始されてから主なサブリソースの読み込みが完了するまでの時間を測定するもので、改善することでページがユーザーの入力に対してすばやく確実に応答できるようになります。

Web ページの[パフォーマンス トレース](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)に基づいて TTI を計算するには、以下の手順に従います。

1. [First Contentful Paint (FCP)](/fcp/) から開始します。
2. 少なくとも 5 秒間の落ち着いている期間を時間の経過順に探していきます。この場合の*落ち着いている期間*とは、[長く時間がかかっているタスク](/custom-metrics/#long-tasks-api)がなく、実行中のネットワーク GET リクエストが 2 件以下となる期間として定義されます。
3. 落ち着いている期間より前の期間内で、一番最後に現れる長く時間がかかっているタスクを見つけ出します。長く時間がかかっているタスクが見つからない場合には、FCP まで遡ります。
4. 落ち着いている期間より前の期間内で一番最後に現れる長く時間がかかっているタスクの終了時間が、TTI となります。(長く時間がかかっているタスクが見つからない場合には、FCP と同じ値になります)。

以下の図は、上記の手順を視覚化したものです。

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="TTI の算出方法を示すページの読み込みタイムライン", width="800", height="473", linkTo=true %}

歴史的に開発者はレンダリング時間を短縮するためにページを最適化してきており、時には TTI を犠牲にしてきました。

サーバーサイド レンダリング (SSR) のような技術は、ページが*見かけ上*は操作可能である (つまり、リンクやボタンが画面に表示されている) にもかかわらず、メイン スレッドがブロックされていたり、それらの要素を制御する JavaScript コードが読み込まれていなかったりするために*実際には*操作可能ではないといったシナリオをもたらします。

操作可能に見えて、実際には操作可能ではないページでユーザーが操作を試みると、次のいずれかの応答が返ってきます。

- 最良のシナリオの場合、ユーザーはページの反応が遅いことに苛立ちを覚えます。
- 最悪のシナリオの場合、ページが故障していると判断され、離脱されてしまう可能性があります。さらには、あなたが管理するブランドの価値に対する自信や信頼を失ってしまう可能性すらあります。

このような問題を回避するために、FCP と TTI の差を最小限に抑えるように努力してください。また、かなりの差がある場合には、ページ上のコンポーネントがまだ操作可能になっていないことを示す視覚的なインジケーターを設置してください。

## TTI の測定方法

TTI は、[ラボ環境](/user-centric-performance-metrics/#in-the-lab)で測定する場合に最適な指標です。TTI の測定に最適な方法には、サイトでの Lighthouse のパフォーマンス監査の実行が挙げられます。使用方法の詳細については、「[TTI に関する Lighthouse ドキュメント](/tti/)」を参照してください。

### ラボ測定を実施するためのツール

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %}実際のユーザー環境での TTI の測定は可能ですが、ユーザーの操作がページの TTI に影響を与え、レポートに多数のばらつきが出てしまう可能性があるため、お勧めできません。実際のユーザー環境でのページのインタラクティブ性を理解するためには、[First Input Delay (FID)](/fid/) を測定する必要があります。{% endAside %}

## TTI における良いスコアとは？

優れたユーザー エクスペリエンスを提供するためには、**平均的なモバイル ハードウェア**でテストを行った場合に、Time to Interactive を **5 秒**以下に抑えるよう努力する必要があります。

ページの TTI が Lighthouse のパフォーマンス スコアにどのような影響を及ぼすかについては、「[Lighthouse による TTI スコアの決定方法](/interactive/#how-lighthouse-determines-your-tti-score)」を参照してください。

## TTI の改善方法

特定のサイトについて TTI の改善方法を把握するには、Lighthouse でパフォーマンス監査を実行し、そこで推奨される具体的な [Opportunities](https://developer.chrome.com/docs/lighthouse/performance/#opportunities) (改善機会) に注目します。

TTI の (あらゆるサイトに共通する) 一般的な改善方法については、以下のパフォーマンス ガイドを参照してください。

- [JavaScript を圧縮する](/unminified-javascript/)
- [必要なオリジンに事前接続する](/uses-rel-preconnect/)
- [キー リクエストを事前に読み込む](/uses-rel-preload/)
- [サードパーティ製コードの影響を減らす](/third-party-summary/)
- [クリティカルなリクエストの深さを最小化する](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)
- [JavaScript の実行にかかる時間を短縮する](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)
- [メイン スレッドの作業を最小限に抑える](/mainthread-work-breakdown/)
- [リクエスト数を少なく、転送サイズを小さく維持する](/resource-summary/)
