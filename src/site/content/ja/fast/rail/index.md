---
layout: post
title: RAILモデルでパフォーマンスを評価する
description: |2-

  RAILモデルを使用すると、設計者と開発者は、ユーザーエクスペリエンスに最も大きく影響するパフォーマンス最適化作業に狙いを定めることができます。RAILモデルが設定する目標とガイドライン、およびそれらを達成するために使用できるツールについて説明します。
date: 2020-06-10
tags:
  - performance
  - animations
  - devtools
  - lighthouse
  - metrics
  - mobile
  - network
  - rendering
  - ux
---

**RAIL**は、パフォーマンスに関する考え方を構造化する**ユーザー中心**のパフォーマンスモデルです。このモデルは、ユーザーエクスペリエンスを主要なアクション（タップ、スクロール、ロードなど）に分割し、それぞれのパフォーマンス目標を定義するのに役立ちます。

RAILは、ウェブアプリのライフサイクルを構成する4つの要素、Response (応答)、Animation (アニメーション)、Idle (アイドル処理)、Load (読み込み) の頭文字を取ったものです。それぞれのパフォーマンスに関するユーザーの期待は異なるため、パフォーマンスの目標は、コンテキストおよび[ユーザーが遅延をどのように認識するかを調べたUX調査](https://www.nngroup.com/articles/response-times-3-important-limits/)を基に定義されます。

<figure>{% Img src="image/admin/uc1IWVOW2wEhIY6z4KjJ.png", alt="RAILパフォーマンスモデルを構成する4要素: 応答、アニメーション、アイドル処理、読み込み。", width="800", height="290" %}<figcaption> RAILパフォーマンスモデルを構成する4要素</figcaption></figure>

## ユーザーに焦点を合わせる

パフォーマンスへの取り組みはユーザーを中心に考えます。次の表は、ユーザーがパフォーマンスの遅延をどのように認識しているかを判断する主なメトリックを説明したものです。

<table class="table-wrapper scrollbar">
  <thead>パフォーマンスの遅延に対するユーザーの認識</thead>
  <tr>
    <td>0〜16ミリ秒</td>
    <td>ユーザーは動きの追跡が非常にうまく、アニメーションがスムーズでないことを嫌います。毎秒60個の新しいフレームがレンダリングされる限り、アニメーションはスムーズであると認識されます。これは、ブラウザが新しいフレームを画面にペイントするのにかかる時間を含めて、フレームあたり16ミリ秒であり、アプリがフレームを生成するのに約10ミリ秒かかります。</td>
  </tr>
  <tr>
    <td>0〜100ミリ秒</td>
    <td>この時間枠内でユーザーのアクションに応答すると、ユーザーは結果がすぐに得られると感じます。これ以上の時間がかかると、アクションと反応の連携が壊れています。</td>
  </tr>
  <tr>
    <td>100〜1000ミリ秒</td>
    <td>この枠内では、物事がタスクの自然で継続的な進行の一部として感じられます。 ウェブ上のほとんどのユーザーにとって、ページの読み込みやビューの変更はタスクを意味します。</td>
  </tr>
  <tr>
    <td>1000ミリ秒以上</td>
    <td>1000ミリ秒（1秒）を超えると、ユーザーは実行中のタスクに集中できなくなります。</td>
  </tr>
  <tr>
    <td>10000ミリ秒以上</td>
    <td>10000ミリ秒（10秒）を超えると、ユーザーは不満を感じ、タスクを放棄する可能性があります。ユーザーが後で戻ってくるかどうかは定かではありません。</td>
  </tr>
</table>

{% Aside %}ユーザーは、ネットワークの状態とハードウェアに応じて、パフォーマンスの遅延を異なるかたちで認識します。たとえば、高速Wi-Fi接続を介して強力なデスクトップマシンにサイトを読み込むという作業は、通常1秒未満で行われ、ユーザーはそれに慣れてしまっています。 低速の3G接続を使うモバイルデバイスにサイトを読み込むには時間がかかるため、モバイルユーザーは一般的に辛抱強く、またモバイルでは5秒以内に読み込むというのが現実的な目標と言えるでしょう。{% endAside %}

## 目標とガイドライン

RAILのコンテキストにおいて、**目標**と**ガイドライン**という用語には具体的な意味があります。

- **目標**。ユーザーエクスペリエンスに関連する主要なパフォーマンスメトリック。たとえば、ペイントはタップしてから100ミリ秒未満で完了します。人間による認識は比較的一定であるため、これらの目標がすぐに変わる可能性は低いと言えるでしょう。

- **ガイドライン**。目標の達成に役立つ推奨事項。これらは、現在のハードウェアおよびネットワーク接続の状態に固有である可能性があるため、時間の経過とともに変化する可能性があります。

## 応答：イベントを50ミリ秒未満で処理する

**目標**：ユーザー入力によって開始された移行を100ミリ秒以内に完了することで、ユーザーはやりとりが瞬時に行われていると感じます。

**ガイドライン**：

- 目に見える応答を100ミリ秒以内に確保するには、50ミリ秒以内にユーザー入力イベントを処理します。これは、ボタンのクリック、フォームコントロールの切り替え、アニメーションの開始など、ほとんどの入力に適用されます。タッチドラッグまたはスクロールはこれに該当しません。

- 反直感的に聞こえるかもしれませんが、ユーザー入力にすぐに応答することが常に正しいとは限りません。この100ミリ秒の時間枠を使用すれば他の高価な作業を実行できますが、ユーザーをブロックしないように注意してください。可能であれば、バックグラウンドで作業してください。

- 完了までに50ミリ秒以上かかるアクションについては、常にフィードバックを提供してください。

### 50ミリ秒を目指す？それとも100ミリ秒？

目標は100ミリ秒未満で入力に応答することですが、なぜ50ミリ秒しかないか？これは、一般的に、入力処理以外の作業も実行されており、そうした作業が許容可能な入力応答に使える時間の一部を占めるためです。アプリケーションがアイドル時間中に50ミリ秒の推奨チャンクで作業を実行している場合、そうした作業チャンクの1つで入力が発生すると、入力を最大で50ミリ秒のキューに入れることができます。これを考慮すると、実際の入力処理に使用できるのは、残りの50ミリ秒のみと想定しても問題ないでしょう。この効果については、次のダイアグラムをご覧ください。アイドルタスクの実行中に受信した入力がキューに入り、使用可能な処理時間が短縮されるのが分かります。

<figure>{% Img src="image/admin/I7HDZ9qGxe0jAzz6PxNq.png", alt="アイドルタスクの実行中に受信した入力がキューに入り、使用可能な入力処理時間が50msに短縮されるのを示した図", width="800", height="400" %}<figcaption>アイドル状態のタスクが入力応答バジェットにどう影響するか。</figcaption></figure>

## アニメーション：フレームを10ミリ秒で生成する

**目標**:

- アニメーションの各フレームを10ミリ秒以内に生成します。技術的には、各フレームの最大バジェットは16ミリ秒（1000ミリ秒/ 60フレーム/秒≈16ミリ秒）ですが、ブラウザーは各フレームをレンダリングするのに約6ミリ秒かかるため、フレームあたり10ミリ秒のガイドラインになります。

- 視覚的な滑らかさを目指します。ユーザーはフレームレートが変化に気づきます。

**ガイドライン**:

- アニメーションのようにプレッシャーの高いポイントでは、他の作業が一切必要なければ何もしない、何らかの作業が必要な場合は、極力最小の作業に抑えるのがカギです。可能であれば、60fpsに達する可能性を最大限に引き出せるように、100ミリ秒の応答を利用して高価な作業を事前に計算するようにします。

- アニメーションを最適化するさまざまな戦略については、[Rendering Performance (パフォーマンスのレンダリング)](/rendering-performance/)を参照してください。

{% Aside %}すべての種類のアニメーションを認識します。アニメーションは、単なるUI効果ではありません。以下のインタラクションは、すべてアニメーションと見なされます。

- 視覚的なアニメーション、開始と終了、[トゥイーン](https://www.webopedia.com/TERM/T/tweening.html)、読み込み中を示すインジケーターなど。
- スクロール。ユーザーがスクロールし始めてから、指を離してもページがスクロールし続けるという「フリング」が含まれます。
- ドラッグ。アニメーションは、多くの場合、地図をパンニングしたり、ピンチングしてズームするといった、ユーザーの操作に続いて実行されます。{% endAside %}

## アイドル: アイドル時間を最大化する

**目標**：アイドル時間を最大化して、ページが50ミリ秒以内にユーザー入力に応答する確率を高めます。

**ガイドライン**：

- アイドル時間を利用し、延期された作業を完了させます。たとえば、ページを最初に読み込む際は、極力少ない量のデータを読み込んでから、[アイドル時間](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)を使って残りを読み込みます。

- 作業はアイドル時間中に50ms以内で実行します。それ以上かかると、50ミリ秒以内にユーザー入力に応答するアプリの機能を妨げるリスクがあります。

- アイドル時間の作業中にユーザーがページを操作する場合は、常にユーザーの操作を最優先し、アイドル時間の作業を中断する必要があります。

## 読み込み: コンテンツを配信し、5秒以内にインタラクティブになります

ページの読み込みが遅いと、ユーザーは関心を失い、タスクが中断されたと感じます。読み込みが速いサイトでは、[平均セッションが長くなり、バウンス率が低くなり、広告の視認性が高くなります](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)。

**目標**:

- ユーザーのデバイスおよびネットワーク機能に関連して、高速な読み込みパフォーマンスを最適化します。現在、最初の読み込みについて、[低速の3G接続を使ったミッドレンジのモバイルデバイスでは、ページを読み込んでから5秒以内](/tti/)に[インタラクティブになる](/performance-budgets-101/#establish-a-baseline)ことが適切な目標でしょう。

- その後の読み込みでは、2秒以内にページを読み込むのが適切な目標です。

{% Aside %}

こうしたターゲットは時間の経過とともに変化する可能性があることに注意してください。

{% endAside %}

**ガイドライン**:

- 読み込みパフォーマンスは、ユーザーの間で一般的なモバイルデバイスとネットワーク接続を使ってテストします。ユーザーの接続分布を確認するには、[Chrome User Experience Report](/chrome-ux-report/)を使用します。サイトでデータが利用できない場合は、Moto G4といったミッドレンジのAndroidの携帯電話および低速の3Gネットワーク (転送速度が400 ms RTT および 400 kbpsとして定義されたもの) が [The Mobile Economy 2019](https://www.gsma.com/mobileeconomy/)によって適切なグローバルベースラインとして提案されています。この組み合わせは、[WebPageTest](https://www.webpagetest.org/easy)で利用可能です。

- 通常のモバイルユーザーのデバイスは2G、3G、または4G接続であると主張される場合がありますが、実際の[実効接続速度](/adaptive-serving-based-on-network-quality/#how-it-works)はパケットの損失やネットワークの変動により、大幅に遅くなることがよくあります。

- [レンダリングをブロックするリソースを排除する](/render-blocking-resources/)。

- 読み込みが完全に完了したという認識を生むために、すべてを5秒以内に読み込む必要はありません。[画像の遅延読み込み](/browser-level-image-lazy-loading/)、[JavaScriptのコード分割バンドル](/reduce-javascript-payloads-with-code-splitting/)、および[web.devで提案されているその他の最適化方法](/fast/)を検討してください。

{% Aside %}ページの読み込みパフォーマンスに影響を与える要因を認識しましょう。

- ネットワークの速度と遅延
- ハードウェア（たとえば、低速のCPU）
- キャッシュの削除
- L2 / L3キャッシングの違い
- JavaScriptの解析 {% endAside %}

## RAILを評価するためのツール

RAILの評価を自動化するのに役立つツールはいくつかあります。どれを使用するかは、必要な情報の種類と使用するワークフローの種類によって異なります。

### Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/)は、ページの読み込み中または実行中に発生するすべてのイベントについて詳細な分析を提供します。**パフォーマンス**パネルのUIを理解するには、[Get Started With Analyzing Runtime Performance](https://developer.chrome.com/docs/devtools/evaluate-performance/)を参照してください。

以下のDevTools機能は特に関連性が高いと言えます。

- さほど強力でないデバイスをシミュレートするために、[CPUをスロットルする](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#cpu-throttle)。

- 低速の接続をシミュレートするために、[ネットワークをスロットルする](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network-throttle)。

- [メインスレッドのアクティビティを表示](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#main)して、記録中にメインスレッドで発生したすべてのイベントを表示する。

- [メインスレッドのアクティビティをテーブルに表示](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#activities)して、最も時間を要したものの順にアクティビティを並べ替えます。

- アニメーションが本当にスムーズに実行されているかを評価するために、[1秒あたりのフレーム数（FPS）](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#fps)を分析する。

- [**パフォーマンスモニター**を使用して、CPU使用率、JSヒープサイズ、DOMノード、1秒あたりのレイアウトなど](https://developers.google.com/web/updates/2017/11/devtools-release-notes#perf-monitor)をリアルタイムに監視します。

- **ネットワーク**セクションで記録している間に発生した[ネットワーク要求を視覚化](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network)する。

- ページの読み込み中またはアニメーションの起動中にページがどのようにレンダリングされたかを正確に再生するために、[記録中にスクリーンショットをキャプチャ](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#screenshots)する。

- ユーザーがページを操作した後にページで何が起こったかをすばやく特定するために、[インタラクションを表示](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#interactions)する。

- 潜在的に問題のあるリスナーが起動するたびに、ページを強調表示することにより、[スクロールパフォーマンスの問題をリアルタイムに見つける](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#scrolling-performance-issues)。

- アニメーションのパフォーマンスに悪影響を与える可能性がある高価なペイントイベントを特定するために、[ペイントイベントをリアルタイムに表示](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#paint-flashing)する。

### Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、Chrome DevTools、 [web.dev / measure](/measure/) 、Chrome拡張機能、Node.jsモジュール、およびWebPageTest内で利用できます。 URLを指定すると、3G接続が遅いミッドレンジデバイスをシミュレートし、ページで一連の監査を実行してから、読み込みパフォーマンスに関するレポートと改善方法の提案を行います。

以下の監査は特に関連性が高いと言えます。

**応答**

- [Max Potential First Input Delay (最初の入力の最大潜在遅延)](/lighthouse-max-potential-fid/)。メインスレッドのアイドル時間に基づいて、アプリがユーザー入力に応答するのにかかる時間を推定する。

- [Does not use passive listeners to improve scrolling performance (スクロールパフォーマンスを向上させるためにパッシブリスナーを使用していない)](/uses-passive-event-listeners/)。

- [Total Blocking Time (合計ブロッキング時間)](/lighthouse-total-blocking-time/)。マウスをクリックしたり、画面をタップしたり、キーボードを押すといった、ユーザー入力への応答がブロックされる合計時間を測定する。

- [Time To Interactive (インタラクティブになるまでの時間)](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive)。ユーザーがすべてのページ要素を絶えず操作できるようになるまでの時間を測定する。

**読み込み**

- [Does not register a service worker that controls page and start_url (pageとstart_urlを制御するServiceWorkerを登録しない](/service-worker/)。Service Workerは、ユーザーのデバイスに共通のリソースをキャッシュして、ネットワーク経由でリソースをフェッチするために費やす時間を削減できます。

- [Page load is not fast enough on mobile networks (モバイルネットワークにおけるページの読み込み速度が十分でない)](/load-fast-enough-for-pwa/)。

- [Eliminate render-blocking resources (レンダリングをブロックするリソースを排除する)](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources)。

- [Defer offscreen images (オフスクリーンの画像を延期する)](/offscreen-images/)。オフスクリーン画像の読み込みは、必要になるまで延期します。

- [Properly size images (画像を適切なサイズにする)](/uses-responsive-images/)。モバイルビューポートでレンダリングされるサイズよりも大幅に大きい画像を提供してはいけません。

- [Avoid chaining critical requests (重要なリクエストを連鎖させない)](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)。

- [Does not use HTTP/2 for all of its resources (すべてのリソースにHTTP / 2を使用していない)](/uses-http2/)。

- [Efficiently encode images (画像を効率的にエンコードしている)](/uses-optimized-images/)。

- [Enable text compression (テキスト圧縮を有効にしている)](/uses-text-compression/)。

- [Avoid enormous network payloads (巨大なネットワークペイロードを避けている)](/total-byte-weight/)。

- [Avoid an excessive DOM size (過度のDOMサイズを避けている)](https://developer.chrome.com/docs/lighthouse/performance/dom-size/)。ページのレンダリングに必要なDOMノードのみを渡すことにより、ネットワークバイトを削減します。

### WebPageTest

WebPageTestは、実際のブラウザを使用してウェブページにアクセスし、タイミングメトリックを収集するウェブパフォーマンスツールです。[webpagetest.org/easy](https://webpagetest.org/easy)にURLを入力して、低速の3G接続を備えた実際のMotoG4デバイスを使ったページの読み込みパフォーマンスに関する詳細なレポートを取得します。Lighthouse による監査を含めるように構成することもできます。

## 概要

RAILは、いわば、ウェブサイトのユーザーエクスペリエンスを個別のインタラクションで構成されるジャーニーとして見るためのレンズのようなものです。ユーザーエクスペリエンスに最大のインパクトをもたらすパフォーマンス目標を設定できるように、ユーザーがサイトをどのように認識しているかを理解しましょう。

- ユーザーを中心に考える。

- 100ミリ秒未満でユーザー入力に応答する。

- アニメーション作成時またはスクロール時に10ミリ秒未満でフレームを生成する。

- メインスレッドのアイドル時間を最大化する。

- 5000ミリ秒未満でインタラクティブコンテンツを読み込む。
