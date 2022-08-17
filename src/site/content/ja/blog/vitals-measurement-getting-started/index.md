---
title: Web Vitals の測定を開始する
authors:
  - katiehempenius
date: 2020-05-27
updated: 2022-07-18
hero: image/admin/QxMJKZcue9RS5u05XxTE.png
alt: 月単位のグラフと、LCP、FID、CLS と表示されているストップウォッチ。
description: 実際の環境とラボ環境の両方でサイトのWebバイタルを測定する方法を学びます。
tags:
  - blog
  - performance
  - web-vitals
---

運営するサイトの改善を行う場合には、Web Vitals データの収集がその第一歩となります。分析内容を充実させるためには、実際のユーザー環境とラボ環境の両方でパフォーマンス データを収集する必要があります。Web Vitals の測定は最小限のコード変更で十分実施が可能であり、ツールについては無料のものを利用することができます。

## RUM データを使用して Web Vitals を測定する

[リアル ユーザー モニタリング](https://en.wikipedia.org/wiki/Real_user_monitoring) (RUM) データはフィールド データとも呼ばれ、サイトを訪問した実際のユーザーが体験したパフォーマンスをキャプチャしたものです。RUM データは、サイトが[推奨されている Core Web Vitals のしきい値](/vitals/)を満たしているかどうかを Google が判断するために使用されます。

### はじめに

RUM を設定していない場合には、以下のツールを使用することで実際の環境でのサイトのパフォーマンスに関するデータをすばやく収集することができます。これらのツールはすべて同じ基本的なデータ セット ([Chrome User Experience Report](https://developer.chrome.com/docs/crux/)) をベースにしていますが、ユース ケースは若干異なります。

- **PageSpeed Insights (PSI)**: [PageSpeed Insights](https://pagespeed.web.dev/) は、過去 28 日間に渡るパフォーマンスをページレベルやオリジンレベルで集約し、レポートします。また、パフォーマンスの改善につながる提案もご確認いただけます。運営するサイトの Web Vitals の測定および改善を開始する方法を 1 つに絞ってお勧めするとすれば、PSI を使用したサイトの監査をお勧めします。PSI は、[Web](https://pagespeed.web.dev/) サイト上でご利用いただくか、[API](https://developers.google.com/speed/docs/insights/v5/get-started) としてご利用いただくことができます。
- **Search Console**: [Search Console](https://search.google.com/search-console/welcome) は、パフォーマンス データをページ単位でレポートします。そのため、改善が必要なページを特定する場合に適しています。PageSpeed Insights とは異なり、Search Console のレポートには過去のパフォーマンス データが含まれています。Search Console は、ご自身が運営する所有権が確認されたサイトでのみご利用いただけます。
- **CrUX ダッシュボード**: [CrUX ダッシュボード](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard)は、選択したオリジンの CrUX データを確認することができる、構築済みのダッシュボードです。Data Studio 上に構築されており、セットアップには約 1 分かかります。PageSpeed Insights や Search Console と比較すると、CrUX ダッシュボードが提供するレポートはデータをより多彩な視点から提供しています。たとえば、データをデバイスや接続タイプごとに分類することなどが可能です。

上記のツールは Web Vitals の測定を初めて行う場合に適しているものですが、それ以外の文脈においても有用であることを覚えておくとよいかもしれません。特に CrUX と PSI は API としても提供されており、[ダッシュボードの構築](https://dev.to/chromiumdev/a-step-by-step-guide-to-monitoring-the-competition-with-the-chrome-ux-report-4k1o)やその他のレポートの作成にも活用することができます。

### RUM データの収集

CrUX ベースのツールは Web Vitals のパフォーマンスを調査するにあたっての良い入門ツールとなりますが、データについては独自の RUM から取得したものの使用を強くお勧めします。ご自身で収集した RUM データは、サイトのパフォーマンスに関するより詳細なフィードバックをすばやく提供します。これにより、問題の特定や利用可能なソリューションのテストが容易になります。

{% Aside %}CrUX ベースのデータ ソースは約 1 か月の粒度でデータをレポートしますが、データの詳細はツールごとに若干異なります。たとえば、PSI と Search Console は過去 28 日間に渡って観測されたパフォーマンスをレポートしますが、CrUX のデータセットやダッシュボードは月単位に分かれています。{% endAside %}

RUM データは、専用の RUM プロバイダーを使用するか、または独自のツールをセットアップすることで収集が可能です。

専用の RUM プロバイダーは、RUMデータの収集およびレポートに特化しています。こういったサービスを使用して Core Web Vitals を測定する場合には、自身が運営するサイトで Core Web Vitals のモニタリングを有効にすることについて、ご利用の RUM プロバイダーまでお問い合わせください。

RUM プロバイダーを利用していない場合でも、[`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)を使用して既存のアナリティクス セットアップを補強し、これらの指標に関するデータ収集やレポートを行うことができる可能性があります。この方法の詳細については、以下で詳しく説明します。

### web-vitals JavaScript ライブラリ

Web Vitals のために独自の RUM セットアップを実装する場合、[`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)の使用が Web Vitals の測定値の収集にあたって最も簡単な方法となります。`web-vitals` は、[実際のユーザー環境で測定が可能な](/user-centric-performance-metrics/#in-the-field)各 Web Vitals 指標を収集してレポートする場合に便利な API を提供する、軽量なモジュール式のライブラリです (最大 1KB)。

Web Vitals を構成する指標は、ブラウザーに組み込まれたパフォーマンス API から直接提供されるものではなく、それらの上に構築されています。たとえば、[Cumulative Layout Shift (累積レイアウト シフト数、CLS)](/cls/) は [Layout Instability API](https://wicg.github.io/layout-instability/) を使用して実装されています。`web-vitals` を使用すれば、これらの指標を自分で実装する場合でも心配する必要がなくなります。また、収集したデータが各指標の方法論やベスト プラクティスに一致していることも保証されます。

`web-vitals` の実装に関する詳細については、「[ドキュメンテーション](https://github.com/GoogleChrome/web-vitals)」や「[実際のユーザー環境で Web Vitals を測定するためのベスト プラクティス](/vitals-field-measurement-best-practices/)」ガイドを参照してください。

### データの集約

`web-vitals` を使用して収集した測定値のレポートは必須の手順です。このデータが測定されていたとしても、レポートされなければ誰もそれを確認することができません。`web-vitals` のドキュメンテーションには、データを[ジェネリック API エンドポイント](https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint)、[Google Analytics](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics)、[Google Tag Manager](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-tag-manager) へと送信する方法を示すサンプルが含まれています。

すでにお気に入りのレポート ツールがある場合には、そのツールの利用をご検討ください。そうでない場合には、無料の Google Analytics をこの目的でご利用いただくことが可能です。

使用するツールを検討する場合には、誰がデータにアクセスする必要があるのかを考慮に入れるとよいでしょう。一般的に企業においては、単一の部門ではなく会社の全体がパフォーマンスの向上に対する関心を持っている場合に最大のパフォーマンスを達成することができます。「[Web サイトのスピードを部門横断的に修復する](/fixing-website-speed-cross-functionally/)」では、さまざまな部門から賛同を得る方法を紹介しています。

### データの解釈

パフォーマンス データを分析する際には、分布の末端に注意を払うことが重要になります。RUM データを確認してみると、あるユーザーのエクスペリエンスは高速なのに、別のユーザーのエクスペリエンスについては低速であるというように、パフォーマンスに大きなばらつきがあることが見て取れます。しかしながら、データの要約に中央値を使用してしまうと、このような挙動を簡単に覆い隠してしまいます。

Web Vitals に関しては、Google では対象となるサイトやページが推奨されているしきい値を満たしているかどうかを判断するために、中央値や平均値などの統計ではなく "良い" ユーザー エクスペリエンスの割合を使用しています。具体的には、Core Web Vitals のしきい値を満たしていると判断されるためには、ページ訪問数の 75% が各指標の "良い" しきい値を満たしている必要があります。

## ラボ データを使用して Web Vitals を測定する

[ラボ データ](/user-centric-performance-metrics/#in-the-lab)は合成データとも呼ばれ、実際のユーザーではなく、制御された環境から収集されます。RUM データとは異なり、ラボ データはプリプロダクション環境から収集されるため、開発者のワークフローや継続的な統合プロセスに組み込むことが可能です。合成データを収集するツールの例としては、Lighthouse や WebPageTest が挙げられます。

### 考慮事項

RUM データとラボ データの間には、常に矛盾が生じています。これは、ラボ環境のネットワーク状況、デバイスの種類、場所などがユーザーの環境と大きく異なる場合には特に当てはまります。しかしながら、特に Web Vitals 指標のラボ データを収集する場合には、以下のような重要な考慮事項が複数存在します。

- **Cumulative Layout Shift (CLS):** ラボ環境で測定された [Cumulative Layout Shift](/cls/) の値は、RUM データで観測される CLS に比べて人為的に低くなる可能性があります。CLS は、"*ページの全表示期間中*に発生した予期しないレイアウト シフトについて、個々のレイアウト シフト スコアを合計したもの。" として定義されています。しかしながら、ページの表示期間は実際のユーザーが読み込んだ場合と人工的なパフォーマンス測定ツールが読み込んだ場合とで一般的に大きく異なります。多くのラボ ツールではページは読み込まれるだけで、操作は行われません。その結果として、最初のページ読み込みに付随して発生するレイアウト シフトしか捕捉することができません。これに対し、RUM ツールを用いて測定される CLS は、ページの表示期間全体を通して発生する[予期しないレイアウト シフト](/cls/#expected-vs.-unexpected-layout-shifts)を捕捉することができます。
- **First Input Delay (初回入力までの遅延時間、FID):** [First Input Delay](/fid/) の測定にあたってはユーザーがページを実際に操作する必要があるため、ラボ環境では測定することができません。そのため、[Total Blocking Time](/tbt/) (合計ブロック時間、TBT) が FID のラボ環境での代替指標として推奨されています。TBT は、"First Contentful Paint (視覚コンテンツの初期表示時間、FCP) から Time to Interactive (操作可能になるまでの時間、TTI) までの間で、ユーザーの入力にページが応答できないようにブロックされている時間の合計" を測定します。FID と TBT の計算方法は異なりますが、どちらも起動プロセス中にメイン スレッドがブロックされている状態を反映しています。メイン スレッドがブロックされると、ブラウザーによるユーザーの操作への応答が遅れます。FID は、ユーザーが初めてページの操作を試みたときに発生する遅延 (もしあれば) を測定します。

### ツール

Web Vitals のラボ測定値の収集には、以下のツールが使用可能です。

- **Web Vitals Chrome Extension:** Web Vitals Chrome [拡張機能](https://github.com/GoogleChrome/web-vitals-extension)は、指定されたページの Core Web Vitals (LCP、FID、CLS) を測定してレポートします。このツールは、開発者がコードを変更する際にリアルタイムでのパフォーマンス フィードバックを提供することを目的としています。
- **Lighthouse:** Lighthouse は、LCP、CLS、TBT をレポートし、パフォーマンスを改善できる可能性がある部分を強調表示する機能を持っています。Lighthouse は、Chrome DevTools、Chrome 拡張機能、npm パッケージとして提供されています。Lighthouse は、[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) を介して継続的な統合ワークフローに組み込むことも可能です。
- **WebPageTest:** [WebPageTest](https://webpagetest.org/) では、標準レポートの一部に Web Vitals が含まれています。WebPageTest は、特定のデバイスやネットワーク状況下での Web Vitals の収集に役立ちます。
