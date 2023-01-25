---
layout: post
title: Data StudioでのCrUX Dashboardの使用
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: Data Studioは、Chrome UXレポートなどのビッグデータソースの上にダッシュボードを構築できるようにする強力なデータ可視化ツールです。このガイドでは、オリジンのユーザーエクスペリエンスを追跡する独自のカスタムCrUX Dashboardを作成する方法を学習します。
date: 2020-06-22
updated: 2022-07-18
tags:
  - performance
  - blog
  - chrome-ux-report
---

[Data Studio](https://marketingplatform.google.com/about/data-studio/)は、[Chrome UXレポート](https://developer.chrome.com/docs/crux/)（CrUX）などのビッグデータソースの上にダッシュボードを構築できるようにする強力なデータ可視化ツールです。このガイドでは、オリジンのユーザーエクスペリエンスの傾向を追跡する独自のカスタムCrUX Dashboardを作成する方法を学習します。

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard", width="800", height="598" %}

CrUX Dashboardは、[コミュニティコネクター](https://developers.google.com/datastudio/connector/)と呼ばれるData Studioの機能を使用して構築されます。このコネクターは、[BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report)のCrUXローデータとData Studioの可視化の間で事前に確立されたリンクで、ダッシュボードのユーザーがクエリを書いたり、グラフを生成したりする必要がなくなります。すべてが構築されているため、ユーザーはオリジンを指定するだけで、ダッシュボードを生成することができます。

## ダッシュボードの作成

まず、[g.co/chromeuxdash](https://g.co/chromeuxdash)にアクセスし、ダッシュボードを生成するオリジンを指定できるCrUXコミュニティコネクターページに移動します。初めて利用するユーザーの場合、許可またはマーケティング設定のプロンプトを完了する必要がある場合があります。

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="CrUX ダッシュボードコネクター", width="800", height="484" %}

テキスト入力フィールドには、完全なURLではなく、以下のようにオリジンのURLのみを指定できます。

{% Compare 'better', 'Origin (Supported)' %}

```text
https://web.dev
```

{% endCompare %}

{% Compare 'worse', 'URL (Not supported)' %}

```text
https://web.dev/chrome-ux-report-data-studio-dashboard/
```

{% endCompare %}

プロトコルを省略すると、HTTPSであると見なされます。サブドメインは重要です。たとえば、 `https://developers.google.com`と`https://www.google.com`は異なるオリジンと見なされます。

オリジンに関するいくつかの一般的な問題は、`https://`の代わりに`http://`を指定するなどのようにプロトコルの指定が誤っている場合や、必要であるにも関わらずサブドメインが省略されている場合があります。一部のWebサイトにはリダイレクトが含まれる場合があるため、`http://example.com`が`https://www.example.com`にリダイレクトする場合は、オリジンの正規バージョンである後者を使用する必要があります。URLバーに表示されるオリジンを使用するのが、基本ルールです。

オリジンがCrUXデータセットに含まれていない場合、次のようなエラーメッセージが表示されることがあります。データセットには400万以上のオリジンがあるが、必要なオリジンにはデータセットに含まれるのに十分なデータがないこともあります。

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="CrUX Dashboardのエラーメッセージ", width="800", height="409" %}

オリジンが存在する場合は、ダッシュボードのスキーマページに移動します。そのページには、有効な接続タイプ、フォームファクター、データセットがリリースされた月、指標ごとのパフォーマンスの分布、そしてもちろんオリジンの名前が含まれています。このページでは何かを実行したり変更したりする必要はないため、**Create Report**をクリックして次に進みます。

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="CrUX Dashboardのスキーマ", width="800", height="403" %}

## ダッシュボードの使用

各ダッシュボードには、次の3種類のページがあります。

1. Core Web Vitalsの概要
2. 指標のパフォーマンス
3. ユーザーの統計情報

ページごとに、使用可能な月次リリースの経時的な分布を示すグラフが含まれています。新しいデータセットがリリースされるたびにダッシュボードを更新するだけで最新のデータを取得できます。

月次データセットは、毎月第2火曜日にリリースされます。たとえば、5月のユーザー体験データが含まれるデータセットは、6月の第2火曜日にリリースされます。

### Core Web Vitalsの概要

最初のページは、オリジンの毎月の[Core WebVitals](/vitals/)パフォーマンスの概要です。これらは、Googleが注目するよう勧めている最も重要なUX指標です。

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="CrUX DashboardのCore Web Vitalsの概要", width="800", height="906" %}

Core Web Vitalsページを使用すると、デスクトップと携帯電話におけるオリジンのユーザーエクスペリエンスを理解できます。デフォルトでは、ダッシュボードを作成した最新の月が選択されています。古い月次リリースと新しい月次リリースを切り替えるには、ページの上部にある**Month**フィルターを使用します。

タブレットはデフォルトでこれらのグラフから省略されていますが、必要に応じて、以下に示す棒グラフ構成で**No Tablet**フィルターを削除できます。

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="Core Web Vitalsページにタブレットが表示されるようにCrUX Dashboardを編集する", width="800", height="288" %}

### 指標のパフォーマンス

Core Web Vitalsページの次に、CrUXデータセットのあるあらゆる[指標](https://developer.chrome.com/docs/crux/methodology/#metrics)を示す独立したページがあります。

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX DashboardのLCPページ", width="800", height="598" %}

各ページの上部には**Device**フィルターがあり、エクスペリエンスデータに含まれるフォームファクターを絞り込むために使用できます。たとえば、具体的に携帯電話でのエクスペリエンスに絞り込むことができます。この設定はページ全体に適用されます。

これらのページの主な可視化は、「Good（良い）」、「Needs Improvement（改善が必要）」、「Poor（悪い）」に分類されたエクスペリエンスの月次分布です。グラフの下の色分けされた凡例は、カテゴリに含まれるエクスペリエンスの範囲を示しています。たとえば、上のスクリーンショットでは、「Good」[Largest Contentful Paint](/lcp/#what-is-a-good-lcp-score)（LCP: 最大視覚コンテンツの表示時間）エクスペリエンスの割合が変動しており、ここ数か月でわずかに悪化していることがわかります。

直近の月には「Good」と「Poor」のエクスペリエンスの割合は、前月との差の指標とともにチャートの上に表示されます。このオリジンでは、「Good」LCPエクスペリエンスは、前月比で3.2％減少して56.04％になっています。

{% Aside 'caution' %} Data Studioの難癖により、ここに`No Data`と表示されることがありますが、これは正常です。前月のリリースが第2火曜日まで利用できないために発生しています。 {% endAside %}

さらに、明示的なパーセンタイルの推奨を示すLCPや他のCore Web Vitalsなどの指標については、「Good」と「Poor」の割合の間に「P75」という指標があります。この値は、オリジンの75thパーセンタイルのユーザーエクスペリエンスに対応します。言い換えれば、エクスペリエンスの75％はこの値よりも優れているということです。注意点は、オリジン上の*すべてのデバイス*にわたる全体的な分布に適用されるということです。**Device**フィルターで特定のデバイスに切り替えても、パーセンタイルは再計算されません。

{% Details %} {% DetailsSummary %}パーセンタイルに関するつまらない技術的警告{% endDetailsSummary%}

パーセンタイルメトリックは[BigQuery](/chrome-ux-report-bigquery/)のヒストグラムデータに基づいているため、粒度は粗くなります。LCPの場合は1000ミリ秒、FIDの場合は100ミリ秒、CLSの場合は0.05です。言い換えると、3800ミリ秒のP75 LCPは、実際の75thパーセンタイルが3800ミリ秒と3900みり秒の間のどこかにあることを示します。

さらに、BigQueryデータセットは、「ビン拡散」と呼ばれる手法を使用します。この手法では、ユーザーエクスペリエンスの密度が、粒度が低下する非常に粗いビンに本質的にグループ化されます。 これにより、4桁の精度を超えることなく、分布の裾に微細な密度を含めることができます。たとえば、3秒未満のLCP値は、幅200ミリ秒のビンにグループ化されます。3〜10秒の間、ビンの幅は500ミリ秒です。10秒を超えると、ビンの幅は5000ミリ秒などになります。ビンの拡散により、ビンの幅が変化するのではなく、すべてのビンの幅が100ミリ秒（最大公約数）になり、分布が各ビンにわたって線形補間されます。

PageSpeed Insightsなどのツールの対応するP75値は、公開されているBigQueryデータセットに基づいておらず、ミリ秒精度の値を提供できます。{% endDetails %}

### ユーザーの統計情報

ユーザーの統計情報ページには、デバイスと有効な接続タイプ（ECT）の2つの[次元](https://developer.chrome.com/docs/crux/methodology/#dimensions)が含まれています。これらのページは、各統計情報のユーザーのオリジン全体にわたるページビューの分布を示しています。

デバイス分布ページには、携帯電話、デスクトップ、およびタブレットのユーザーの内訳が時系列で表示されます。多くのオリジンはタブレットデータがほとんどないかまったく存在しない傾向があるため、グラフの端からのぶら下がりが「0％」であることがよくあります。

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="CrUX Dashboardのデバイスページ", width="800", height="603" %}

同様に、ECT分布ページには、4G、3G、2G、低速2G、およびオフラインエクスペリエンスの内訳が表示されます。

{% Aside 'key-term' %}有効な接続タイプは、ユーザーのデバイスの帯域幅測定に基づいており、使用されている特定のテクノロジーについては言及していないため、*有効*とみなされます。たとえば、高速Wi-Fiを使用しているデスクトップユーザーは4Gとラベル付けされますが、低速のモバイル接続は2Gとラベル付けされる場合があります。 {% endAside %}

これらの次元の分布は、[First Contentful Paint](/fcp/)（FCP: 視覚コンテンツの初期表示時間）ヒストグラムデータのセグメントを使って計算されます。

## よくある質問

### どのようなときに、他のツールではなくCrUX Dashboardを使用しますか？

CrUX Dashboardは、BigQueryで利用可能な同じ基盤データに基づいていますが、データ抽出のためのSQLを1行書く必要がないため、使用可能なクォータを超えることを心配する必要がありません。ダッシュボードの設定はすばやく簡単で、すべての可視化が自動的に生成され、任意のユーザーに共有できるコントロールがあります。

### CrUX Dashboardの使用に制限はありますか？

BigQueryの基づくということは、CrUX Dashboardがそのすべての制限も継承していることでもあります。月次の粒度でのオリジンレベルのデータに制限されています。

CrUX Dashboardでは、単純性と利便性を得るためにBigQueryのローデータにある一部の汎用性がトレードオフされています。たとえば、指標分布は、完全なヒストグラムではなく、「Good」、「Needs Improvement」、「Poor」しか示しません。CrUX Dashboardはグローバルレベルのデータも提供しますが、BigQueryデータセットでは特定の国でズームインすることが可能です。

### Data Studioの詳細はどこで確認できますか？

詳細については、[Data Studioの機能ページ](https://marketingplatform.google.com/about/data-studio/features/)をご覧ください。
