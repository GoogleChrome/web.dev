---
title: Core Web Vitals を測定するためのツール
subhead: ご利用の開発ツールでも Core Web Vitals を測定することができるようになりました。
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: Lighthouse、PageSpeed Insights、Chrome UX Report などを含む人気の高い Web 開発者向けツールを対象として新しく発表された、Core Web Vitals の測定サポートについて説します。
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Chrome User Experience のロゴ、PageSpeed Insights のロゴ、Lighthouse のロゴ、Search Console のロゴ、Chrome DevTools のロゴ、Web Vitals Extension のロゴ。
tags:
  - blog
  - web-vitals
  - performance
---

先日発表された [Web Vitals](/vitals/) イニシアチブでは、すべてのサイトが Web 上で優れたユーザーエクスペリエンスを提供するために不可欠となる品質シグナルに関する統一的なガイダンスを提供させていただきました。そしてこのたび、**Web 開発者向けに提供されている Google の人気ツールのすべてで Core Web Vitals の測定がサポート**されるようになり、ユーザー エクスペリエンスに関する問題をより簡単に診断および修正できるようになりました。これには、[Lighthouse](https://github.com/GoogleChrome/lighthouse)、[PageSpeed Insights](https://pagespeed.web.dev/)、[Chrome DevTools](https://developer.chrome.com/docs/devtools/)、[Search Console](https://search.google.com/search-console/about)、[web.dev の測定ツール](/measure/)、[Web Vitals Chrome 拡張機能](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)、そして新しい [Chrome UX Report](https://developer.chrome.com/docs/crux/) API が含まれています。

Google 検索には、[ページ エクスペリエンス](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html)を評価するための基盤として Core Web Vitals が含まれるようになりました。これらの指標が可能な限りいつでも利用可能で、実用的であることはとても重要です。

<figure>{% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="Core Web Vitals の指標をサポートする Chrome および検索ツールの概要", width="800", height="509" %}</figure>

{% Aside 'key-term' %}**ラボ測定を実施するためのツール**は、*潜在的なユーザー*があなたの Web サイトをどのように体験するかについての分析情報を提供し、デバッグに必要な再現性のある結果を提供します。**フィールド測定**を実施するためのツールは、*実際のユーザー*があなたの Web サイトをどのように体験しているかについての分析情報を提供します。このタイプの測定は、しばしばリアル ユーザー モニタリング (RUM) と呼ばれています。[ラボ測定またはフィールド測定を実施するためのツール](/how-to-measure-speed/#lab-data-vs-field-data)のそれぞれが、ユーザー エクスペリエンスの最適化に役立つ異なる価値を提供します。{% endAside %}

Core Web Vitals を使用したユーザー エクスペリエンスの最適化を開始するには、以下のワークフローをお試しください。

- Search Console の新しい Core Web Vitals Report を使用して、注意が必要なページのグループを (フィールド データに基づいて) 特定します。
- 作業が必要なページを特定したら、(Lighthouse と Chrome UX Report を活用した) PageSpeed Insights を使用して、ページのラボ環境および実際のユーザー環境での問題を診断します。PageSpeed Insights (PSI) を Search Console から利用するか、URL を PSI に直接入力することが可能です。
- ラボ環境があり、サイトをローカルで最適化する準備ができている場合には、Lighthouse と Chrome DevTools を使用して Core Web Vitals を測定することで、修正すべき点についての実用的なガイダンスを得ることができます。Web Vitals Chrome 拡張機能を使用すれば、各指標のリアルタイム ビューをデスクトップで確認することができます。
- Core Web Vitals のカスタム ダッシュボードが必要な場合には、アップデートされた CrUX ダッシュボード、新しい Chrome UX Report API (フィールド データ向け)、PageSpeed Insights API (ラボ データ向け) などをご利用ください。
- ガイダンスをお探しの場合には、web.dev/measure で PSI のデータを使用してあなたのページを測定し、優先度順に整理された最適化のためのガイドや Codelabs をご覧いただけます。
- 最後にプル リクエストに Lighthouse CI を使用して、本番環境に変更内容をデプロイする前に Core Web Vitals の指標が悪化していないことを確認します。

それでは、各ツールの具体的なアップデート内容をご紹介させていただきます。

### Lighthouse

Lighthouse は、開発者が問題を診断し、サイトのユーザー エクスペリエンスを向上させるために改善可能なポイントを特定するための自動 Web サイト監査ツールです。パフォーマンスやアクセシビリティなど、ユーザー エクスペリエンスの品質に関する様々な側面について、ラボ環境で測定を行います。Lighthouse の最新バージョン ([6.0](/lighthouse-whats-new-6.0/)、2020 年 5 月中旬リリース) には、付加的な監査、新しい指標、新しく構成されたパフォーマンス スコアが含まれています。

<figure>{% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="最新の Core Web Vitals 指標を表示している Lighthouse 6.0", width="800", height="527" %}</figure>

Lighthouse 6.0 では、レポートに 3 つの新しい指標が導入されました。そのうちの 2 つである [Largest Contentful Paint](/lcp/) (最大視覚コンテンツの表示時間、LCP) と [Cumulative Layout Shift](/cls/) (累積レイアウト シフト数、CLS) は、Core Web Vitals をラボ環境で実装したもので、ユーザー エクスペリエンスの最適化を行うために重要な診断情報を提供します。ユーザー エクスペリエンスを評価する上での重要性を考慮し、新しい指標は測定されレポートに含まれるだけでなく、パフォーマンス スコアの計算にも織り込まれています。

Lighthouse に採用された 3 つ目の新しい指標である [Total Blocking Time](/tbt/) (合計ブロック時間、TBT) は、もう 1 つの Core Web Vitals 指標であり、フィールド指標である [First Input Delay](/fid/) (初回入力までの遅延時間、FID) と高い相関性を持っています。Lighthouse のレポートに記載されている推奨事項に従ってスコアを最適化することにより、ユーザーに対して可能な限り最高のユーザー体験を提供できるようになります。

Lighthouse が活用されている製品は、マージされデプロイされる前にプル リクエストの Core Web Vitals を簡単に測定することができる [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) を含む最新バージョンを反映して更新されます。

<figure>{% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="Largest Contentful Paint に関する様々なビューが表示されている Lighthouse CI", width="800", height="498" %}</figure>

Lighthouse の最新のアップデートについては、「[Lighthouse 6.0 の最新情報](/lighthouse-whats-new-6.0/)」のブログ投稿を参照してください。

### PageSpeed Insights

[PageSpeed Insights](https://pagespeed.web.dev/) (PSI) は、モバイル デバイスおよびデスクトップ デバイスにおける、ラボ環境や実際のユーザー環境でのパフォーマンスをレポートします。このツールは、特定のページで行われた実際のユーザー エクスペリエンスに関する概要情報 (Chrome UX Report を活用) と、サイトの所有者によるページのユーザー エクスペリエンスの改善に役立つ実用的な推奨事項 (Lighthouse を活用) を提供します。

PageSpeed Insights や [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) も内部で Lighthouse 6.0 を使用するようにアップグレードされており、レポートのラボ セクションおよびフィールド セクションの両方で Core Web Vitals の測定をサポートするようになりました。Core Web Vitals は、以下のように青いリボンで表示されています。

<figure>{% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="フィールド データおよびラボ データに分けて Core Web Vitals が表示されている PageSpeed Insights", width="800", height="873" %}</figure>

[Search Console](https://search.google.com/search-console/) が注意が必要なページのグループに関する概要情報をサイトの所有者に提供する一方で、PSI はページのユーザー エクスペリエンスの改善機会をページごとに特定する際に役立ちます。PSI では、あなたのページがすべての Core Web Vitals について良好なユーザー体験を示すしきい値を満たしているかどうかを、レポートの上部に表示される **Passes the Core Web Vitals assessment** (Core Web Vitals の評価に合格) または **Does not pass the Core Web Vitals assessment** (Core Web Vitals の評価に不合格) を確認することで明確に判断することができます。

### CrUX

[Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX) は、何百万もの Web サイトでの実際のユーザー エクスペリエンス データを集約したパブリック データセットです。これは、すべての Core Web Vitals の実際のユーザー環境でのバージョンを測定します。ラボ データとは異なり、CrUX のデータは実際のユーザー環境で[オプトインしたユーザー](https://developer.chrome.com/docs/crux/methodology/#user-eligibility)から取得されます。このデータを使用することで、開発者は自身または競合他社の Web サイトにおける実際のユーザー エクスペリエンスの分布を理解することができます。サイトに RUM がない場合でも、CrUX を使用すれば Core Web Vitals をすばやく簡単に評価できます。[BigQuery の CrUX データセット](https://developer.chrome.com/docs/crux/bigquery/)にはすべての Core Web Vitals についての詳細なパフォーマンス データが含まれており、月間スナップショットにてオリジンレベルでご覧いただけます。

サイト パフォーマンスをユーザー目線で真に理解するための唯一の方法は、ユーザーがサイトを読み込み、操作を行っている実際の環境でパフォーマンスを測定することです。このタイプの測定方法は、一般的にリアル ユーザー モニタリング (または RUM) と呼ばれています。サイトに RUM を導入していなくても、CrUX を使用すれば Core Web Vitals をすばやく簡単に評価することができます。

**CrUX API のご紹介**

本日 Google は、[CrUX API](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/) を発表させていただきます。これは、以下のフィールド指標に関するオリジンおよび URL レベルでの品質測定を開発ワークフローに簡単に統合することができる、高速かつ無料の方法です。

- Largest Contentful Paint
- Cumulative Layout Shift
- First Input Delay
- First Contentful Paint

開発者はオリジンや URL でクエリを行なったり、様々な規格ごとに結果をセグメント化したりすることができます。API は毎日更新され、過去 28 日分のデータが集約されます (月単位で集計される BigQuery のデータセットとは異なります)。また、この API には Google が提供するもう 1 つの API である PageSpeed Insights API と同様の緩やかなパブリック API クォータ (1 日あたり 25,000 リクエスト) が設定されています。

以下は、CrUX API を使用して Core Web Vitals の指標を**良い**、**改善が必要**、**悪い**の分布で可視化した[デモ](/chrome-ux-report-api/)です。

<figure>{% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="Core Web Vitals の指標を表示している Chrome User Experience Report API のデモ", width="800", height="523" %}</figure>

今後のリリースでは、API を拡張して CrUX のデータセットに含まれているその他の側面や指標にもアクセスできるようにする予定です。

**新しくなった CrUX ダッシュボード**

新しくデザインされた [CrUX ダッシュボード](http://g.co/chromeuxdash)ではオリジンのパフォーマンスを時系列で簡単に追跡することができ、すべての Core Web Vitals 指標の分布を監視できるようにもなりました。ダッシュボードの使用を開始するには、web.dev の「[Tutorial](/chrome-ux-report-data-studio-dashboard/) (チュートリアル)」を参照してください。

<figure>{% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="新しいランディング ページで Core Web Vitals の指標を表示している Chrome UX Report ダッシュボード", width="800", height="497" %}</figure>

新しい Core Web Vitals ランディング ページが導入され、サイトのパフォーマンスを一目で確認できるようになりました。Google では、CrUX のすべてのツールに対する皆さまからのご意見をお待ちしております。ご意見やご質問は、Twitter アカウント [@ChromeUXReport](https://twitter.com/chromeuxreport) または [Google グループ](https://groups.google.com/a/chromium.org/g/chrome-ux-report)までお寄せください。

### Chrome DevTools パフォーマンス パネル

**エクスペリエンス セクションでのレイアウト シフト イベントのデバッグ**

Chrome DevTools の**パフォーマンス** パネルに、予期しないレイアウト シフトの検出に役立つ**[エクスペリエンス セクション](https://developers.google.com/web/updates/2020/05/devtools#cls)**が新しく追加されました。これは、Cumulative Layout Shift の改善につながるページ上での視覚的不安定性に関する問題を発見して修正する際に役立ちます。

<figure>{% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="パフォーマンス パネルに赤色で表示されている Cumulative Layout Shift", width="800", height="517" %}</figure>

レイアウト シフトを選択すると、**Summary** (概要) タブにその詳細情報が表示されます。シフトの発生箇所を可視化するには、**Moved from** (移動元) フィールドと **Moved to** (移動先) フィールドにカーソルを合わせてください。

**フッターに表示される Total Blocking Time を使用した操作に対する準備状況のデバッグ**

Total Blocking Time (TBT) 指標は、ラボ ツールでの測定が可能な First Input Delay の優れた代替指標です。TBT は、長時間に渡りメイン スレッドがブロックされ、入力の応答性が妨げられることで発生する [First Contentful Paint (視覚コンテンツの初期表示時間、FCP)](/fcp/) と [Time to Interactive (操作可能になるまでの時間、TTI)](/tti/) の間の時間の合計を測定します。TBT をラボ環境で改善するパフォーマンスの最適化は、実際のユーザー環境でも同じように FID を改善してくれるはずです。

<figure>{% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt="DevTools のパフォーマンス パネルのフッターに表示されている Total Blocking Time", width="800", height="517" %}</figure>

ページのパフォーマンスを測定する際に、Chrome DevTools の**パフォーマンス** パネルのフッターに TBT が表示されるようになりました。

{% Instruction 'devtools-performance', 'ol' %}

1. **Record** (記録) をクリックします。
2. ページの再読み込みを手動で行います。
3. ページの読み込みが終わったら、記録を停止します。

詳細については、「[DevTools (Chrome 84) の最新情報](https://developers.google.com/web/updates/2020/05/devtools#cls)」を参照してください。

### Search Console

Search Console の新しい [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520) は、CrUX の実際のユーザー環境で測定された (フィールド) データに基づいて、運営するサイト全体の中から注意が必要なページのグループを特定する際に役立ちます。URL のパフォーマンスは、状態、指標の種類、URL のグループ (類似した Web ページのグループ) ごとに分類されます。

<figure>{% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="Search Console の新しい Core Web Vitals Report", width="800", height="1000" %}</figure>

このレポートは、LCP、FID、CLS という 3 つの Core Web Vitals 指標に基づいて作成されています。これらの指標について最低限のレポート データを持たない URL については、レポートから除外されます。新しいレポートをお試しいただき、あなたのオリジンのパフォーマンスの全体像を把握してみてください。

Core Web Vitals に関連した問題を抱えるページの種類を特定したら、それらを代表するページに対して実施可能な具体的な最適化の提案を PageSpeed Insights を使用して確認することができます。

#### web.dev

[web.dev/measure](/measure/) では、ページのパフォーマンスを経時的に測定し、優先度順に整理された改善を行うためのガイドや Codelabs を確認することができます。web.dev/measure での測定には、PageSpeed Insights が使用されています。この測定ツールは、以下のように Core Web Vitals の指標にも対応しています。

<figure>{% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="web.dev の測定ツールを使用して Core Web Vitals の指標を経時的に測定し、優先度順に整理されたガイダンスを確認することができます", width="800", height="459" %}</figure>

### Web Vitals 拡張機能

Web Vitals 拡張機能を使用すれば、デスクトップ版の Google Chrome で 3 つの Core Web Vitals 指標をリアルタイムに測定することができます。この拡張機能は、開発ワークフローの初期段階で問題を発見したり、Web を閲覧しながら Core Web Vitals のパフォーマンスを評価したりするための診断ツールとして役立てることができます。

この拡張機能は、[Chrome ウェブストア](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)からインストールできるようになりました。是非ご利用ください。プロジェクトの [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) リポジトリへのフィードバックだけでなく、改善につながる貢献もお待ちしております。

<figure>{% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="Core Web Vitals がリアルタイムに表示されている Web Vitals Chrome 拡張機能", width="800", height="459" %}</figure>

#### クイック ハイライト

これで内容は以上です。次に実行可能な対応策を、以下にまとめました。

- DevTools で **Lighthouse** を使用してユーザー エクスペリエンスを最適化し、実際のユーザー環境での Core Web Vitals を最適な状態に保つための準備を整えましょう。
- **PageSpeed Insights** を使用して、ラボ環境と実際のユーザー環境での Core Web Vitals のパフォーマンスを比較しましょう。
- 新しい **Chrome User Experience Report API** を使用して、あなたのオリジンと URL が過去 28 日間に渡って記録した Core Web Vitals パフォーマンスを確認しましょう。
- DevTools の**パフォーマンス** パネルにある**エクスペリエンス** セクションとフッターを使用して特定の Core Web Vitals を深く調査し、デバッグを行いましょう。
- **Search Console の Core Web Vitals Report** を使用して、あなたのオリジンが実際のユーザー環境でどのようなパフォーマンスを見せているかを確認しましょう。
- **Web Vitals 拡張機能** を使用して、特定のページにおける Core Web Vitals のパフォーマンスをリアルタイムで追跡しましょう。

6 月に開催される [web.dev Live](/live/) では、Core Web Vitals のツールについてより詳しいお話をさせていただきます。サインアップして、イベントに関する最新情報を手に入れましょう。

Elizabeth と Addy (WebPerf 管理人)
