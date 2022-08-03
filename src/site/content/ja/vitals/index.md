---
layout: post
title: Web Vitals
description: サイトの健全性を判断するための重要な指標
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2020-07-21
tags:
  - metrics
  - performance
  - web-vitals
---

ユーザー エクスペリエンス品質の最適化は、Web 上に存在するあらゆるサイトに適用可能な、長期的な成功を目指す上での秘訣であると言えます。Web Vitals は、ビジネス オーナー、マーケティング担当者、開発者などによる自身が運営するサイトのユーザー体験の数値化や、改善可能なポイントの特定をサポートします。

## 概要

Web Vitals は、Web 上での優れたユーザー エクスペリエンスの提供に欠かすことのできない品質シグナルに関する統一的なガイダンスの提供を目的とした、Google によるイニシアチブです。

Google ではパフォーマンスの測定およびレポートに関し、長年にわたり数多くのツールを提供してきました。一部の開発者たちはすでにこれらのツールの使用に精通しているものの、その他のユーザーにとっては、こういった豊富に存在するツールや指標に関する学習を進めていくことは難しく感じられてしまうようです。

ユーザーに提供されているエクスペリエンス品質を理解するために、サイトの所有者がサイト パフォーマンスの達人となる必要はありません。Web Vitals イニシアチブは必要な観点をシンプルに整理し、最も重要な指標である **Core Web Vitals** へと注力できるようにすることを目標としています。

## Core Web Vitals

Core Web Vitals とは、すべての Web ページに適用可能な Web Vitals のサブセットのことを指します。すべてのサイト所有者にとって測定する価値のあるもので、Google が提供するあらゆるツールで採用されています。Core Web Vitals に含まれている各指標は、ユーザー エクスペリエンスに関する特徴的な観点を提供し、[フィールド データ](/user-centric-performance-metrics/#how-metrics-are-measured)の測定が可能であり、[ユーザーを中心とした](/user-centric-performance-metrics/#how-metrics-are-measured)重要な結果に基づく実際のユーザー体験を反映します。

Core Web Vitals を構成する指標は、時間の経過とともに[進化](#evolving-web-vitals)しています。2020 年現在のセットでは、ユーザー エクスペリエンスが持つ 3 つの観点 (*読み込み時間*、*インタラクティブ性*、*視覚的な安定性*) に焦点が当てられており、以下の指標 (および各指標のしきい値) が含まれています。

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Largest Contentful Paint のしきい値に関する推奨事項", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="First Input Delay のしきい値に関する推奨事項", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Cumulative Layout Shift のしきい値に関する推奨事項", width="400", height="350" %}</div>

- **[Largest Contentful Paint (最大視覚コンテンツの表示時間、LCP)](/lcp/)**: *読み込み*のパフォーマンスを測定するための指標です。優れたユーザー エクスペリエンスを提供するためには、ページの読み込みが開始されてからの LCP を **2.5 秒**以内にする必要があります。
- **[First Input Delay (初回入力までの遅延時間、FID)](/fid/)**: *インタラクティブ性*を測定するための指標です。優れたユーザー エクスペリエンスを提供するためには、ページの FID を **100 ミリ秒**以下にする必要があります。
- **[Cumulative Layout Shift (累積レイアウト シフト数、CLS)](/cls/)**: *視覚的な安定性*を測定するための指標です。優れたユーザー エクスペリエンスを提供するためには、ページの CLS を **0.1** 以下に維持する必要があります。

上記の各指標について、ほぼすべてのユーザーにとって好ましい推奨目標値を確実に達成するために、モバイル デバイスとデスクトップ デバイスに分けた上で、総ページロード数の **75 パーセンタイル**をしきい値として設定しています。

Core Web Vitals への準拠を評価するツールは、上記 3 つの指標すべてにおいて 75 パーセンタイルという推奨目標値を達成している場合に、そのページを合格として判定するように設定されています。

{% Aside %}これらの推奨事項の根拠となる調査および方法論に関する詳細については、「[Core Web Vitals の指標のしきい値の定義](/defining-core-web-vitals-thresholds/)」を参照してください。{% endAside %}

### Core Web Vitals の測定およびレポートを実施するためのツール

Google では、Core Web Vitals をあらゆる Web エクスペリエンスにおける重要な指標として捉えています。その結果として、[人気のあるすべての Google 製ツール](/vitals-tools/)でのこれらの指標の採用に取り組んでいます。このセクションでは、Core Web Vitals をサポートするツールについて詳しく説明していきます。

#### Core Web Vitals のフィールド測定を実施するためのツール

[Chrome User Experience Report](https://developer.chrome.com/docs/crux/) は、非特定化された実際のユーザーによる測定データを Core Web Vitals の各指標ごとに収集するツールです。このデータを活用すれば、サイト所有者はページに手動でアナリティクス ツールを設置しなくてもパフォーマンスをすばやく評価できるようになり、[PageSpeed Insights](https://pagespeed.web.dev/) や Search Console の [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520)などのツールを強化することもできるようになります。

<div class="table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">Search Console (Core Web Vitals Report)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %}これらのツールの使用方法や、ユース ケースごとに最適なツールの選別に関するガイダンスについては、「[Web Vitals の測定の概要](/vitals-measurement-getting-started/)」を参照してください。{% endAside %}

Chrome User Experience Report が提供するデータの活用によってサイトのパフォーマンスをすばやく評価できるようにはなりますが、正確な診断、監視、パフォーマンスの低下に対する迅速な対応などを実施するために必要となる可能性がある詳細なページビュー単位のテレメトリは提供されません。そのため、サイトには実際にユーザーを監視する仕組みを独自に設定しておくことを強くお勧めします。

#### JavaScript で Core Web Vitals を測定する

Core Web Vitals の各指標は、標準の Web API を使用して JavaScript で測定することができます。

Core Web Vitals の各指標をすべて測定するためには、[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript ライブラリを使用するのが最も簡単です。このライブラリは、前述したすべての Google 製ツールでレポートされている方法に完全に一致する方法で各指標を測定することができる、基本的な Web API を集めた小さなラッパーです。

[Web-vitals](https://github.com/GoogleChrome/web-vitals) ライブラリを使用することにより、各指標の測定は単一の関数の呼び出しと同じくらい簡単になります (詳細な[使用方法](https://github.com/GoogleChrome/web-vitals#usage)および [API](https://github.com/GoogleChrome/web-vitals#api) に関する詳細については、ドキュメントを参照してください)。

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // 利用が可能な場合には `navigator.sendBeacon()` を使用し、`fetch()` にフォールバックします。
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

[Web-Vitals](https://github.com/GoogleChrome/web-vitals) ライブラリを使用して Core Web Vitals データを測定し、アナリティクス エンドポイントへと送信するようサイトを構成したら、次のステップはそのデータの集計およびレポートを実施し、推奨しきい値 (ページ別訪問数の少なくとも 75%) を満たしているかどうかを確認することです。

一部のアナリティクス プロバイダーには Core Web Vitals の各指標のサポートが最初から組み込まれていますが、そうではない場合であっても、Core Web Vitals を各ツール上で測定可能にするための基本的なカスタム指標機能が備わっているはずです。

その一例として、サイトの所有者が Google Analytics を使用して Core Web Vitals を測定することができる [Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report) が挙げられます。その他のアナリティクス ツールを使用して Core Web Vitals を測定する場合のガイダンスについては、「[Web Vitals をフィールド測定するためのベスト プラクティス](/vitals-field-measurement-best-practices/)」を参照してください。

また、[Web Vitals Chrome 拡張機能](https://github.com/GoogleChrome/web-vitals-extension)を使用すれば、コードを記述しなくても Core Web Vitals の各指標をレポートすることができるようになります。この拡張機能は各指標の測定に [web-vitals](https://github.com/GoogleChrome/web-vitals) ライブラリを使用し、Web を閲覧する際にそれらをユーザーに表示します。

この拡張機能は、自身が運営するサイトや競合他社のサイト、そして Web 全体のパフォーマンスを把握する場合に役立ちます。

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">Web Vitals 拡張機能</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

開発者の方でこれらの指標を基本的な Web API を使用して直接測定したいという場合には、以下のガイドから詳細な実装手順をご確認いただけます。

- [JavaScript を使用して LCP を測定する](/lcp/#measure-lcp-in-javascript)
- [JavaScript を使用して FID を測定する](/fid/#measure-fid-in-javascript)
- [JavaScript を使用して CLS を測定する](/cls/#measure-cls-in-javascript)

{% Aside %}一般的なアナリティクス サービス (または独自の社内アナリティクス ツール) を使用してこれらの指標を測定する方法に関する詳細なガイダンスについては、「<a>Web Vitals をフィールド測定するためのベスト プラクティス</a>」を参照してください。{% endAside %}

#### Core Web Vitals のラボ測定を実施するためのツール

Core Web Vitals に関してはフィールド データの測定が何よりも優先されますが、その多くはラボ データの場合でも測定が可能です。

ラボ データの測定は、まだユーザー対して公開されていない開発段階の機能のパフォーマンスをテストする場合に最適な方法です。また、パフォーマンスの低下を事前に察知したい場合にも最適です。

ラボ環境で Core Web Vitals を測定する場合には、以下のツールが使用可能です。

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.chrome.com/docs/devtools/">Chrome DevTools</a></td>
        <td>✔</td>
        <td>✘ (代わりに <a href="/tbt/">TBT</a> を使用してください)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/">Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (代わりに <a href="/tbt/">TBT</a> を使用してください)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}Lighthouse のようなユーザーが存在しないシミュレーション環境でページの読み込みを行うツールでは、FID を測定することができません (FID の測定にはユーザーによる入力が必要です)。ただし、Total Blocking Time (合計ブロック時間、TBT) 指標はラボ環境でも測定可能であり、FID の優れた代替指標となります。ラボ環境での TBT の改善に伴うパフォーマンスの最適化がなされることにより、実際のユーザー環境での FID も改善されるはずです (後述するパフォーマンスに関する推奨事項を参照してください)。{% endAside %}

ラボ環境での測定は優れたユーザー体験を提供する上で不可欠な要素ではありますが、実際のユーザー環境での測定に取って代わるものではありません。

サイトのパフォーマンスは、ユーザーが使用するデバイスの性能やネットワークの状態、ユーザーのデバイス上での別プロセスの実行状況、そしてユーザーによるページの操作方法に応じて大きく変化します。実際に Core Web Vitals の各指標のスコアは、ユーザーの操作に影響を受けます。正確な全体像を把握することができるのは、実際のユーザー環境での測定のみです。

### スコアを改善するための推奨事項

Core Web Vitals の測定によって改善点を見つけたら、次のステップは最適化です。以下のガイドでは、ページを最適化するために必要となる具体的な推奨事項を、Core Web Vitals の各指標ごとに紹介しています。

- [LCP を最適化する](/optimize-lcp/)
- [FID を最適化する](/optimize-fid/)
- [CLS を最適化する](/optimize-cls/)

## Other Web Vitals

Core Web Vitals は優れたユーザー エクスペリエンスについての理解を深め、それらをユーザーに対して提供する際に重要な意味を持つ指標ですが、重要な指標はこれ以外にも存在します。

そういった Web Vitals のその他の指標は、多くの場合 Core Web Vitals の代替指標または補足指標として機能し、ユーザー体験をより大きな観点から把握したり、特定の問題を診断したりする場合に役立ちます。

たとえば [Time to First Byte (サーバーの初期応答時間、TTFB)](/ttfb/) や [First Contentful Paint (視覚コンテンツの初期表示時間、FCP)](/fcp/) などの指標は、どちらも*読み込み*時のユーザー体験に関連する重要な観点であり、それぞれが LCP に関する問題 ([サーバーの応答時間](/overloaded-server/)が長すぎる場合や、[レンダリングを妨げるリソース](/render-blocking-resources/)に関連する問題など) の診断に役立ちます。

同様に、[Total Blocking Time (合計ブロック時間、TBT)](/tbt/) や [Time to Interactive (操作可能になるまでの時間、TTI)](/tti/) などの指標は、FID に影響を及ぼす潜在的な*インタラクティブ性*に関する問題を察知して診断を実施するために不可欠な、ラボ環境での指標です。これらの指標は実際のユーザー環境では測定できず、また[ユーザーを中心とした](/user-centric-performance-metrics/#how-metrics-are-measured)結果も反映していないため、Core Web Vitals には含まれません。

## Evolving Web Vitals

Web Vitals および Core Web Vitals は、Web 上でのユーザー エクスペリエンス品質の測定に関して現在利用可能な最高品質のシグナルを開発者に提供していますが、これらのシグナルも完璧なものではなく、将来的な改善や機能追加が期待されています。

**Core Web Vitals** はあらゆる Web ページに関連し、関連する Google 製ツールにも広く採用されているため、これらの指標に対する変更の実施は広範囲に影響を及ぼします。そのため、開発者の方々は Core Web Vitals の定義およびしきい値が安定していること、そして更新に関する情報が事前に通知され、かつ更新が予測可能な 1 年周期で実施されることを期待しているものと思われます。

Web Vitals のその他の指標はコンテキストやツールに特有のものが多く、Core Web Vitals よりも実験的なものとなる場合があります。そのため、それらの指標の定義およびしきい値は、より頻繁に変更される可能性があります。

Web Vitals に含まれるすべての指標に対して実施された変更の内容については、公開されている [CHANGELOG](http://bit.ly/chrome-speed-metrics-changelog) にて詳細にドキュメント化されます。
