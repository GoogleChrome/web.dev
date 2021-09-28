---
title: よりプライベートな広告コンバージョンの測定方法である Event Conversion Measurement API について
subhead: オリジン トライアルとして利用可能な新しい Web API がクロスサイト ID を使用せずに、広告のクリックがコンバージョンにつながるタイミングを測定します。
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: 2020-10-06
updated: 2020-05-04
tags:
  - blog
  - privacy
---

{% Banner 'caution', 'body' %}Conversion Measurement API は *Attribution Reporting API* に名前が変更され、さらなる機能を提供します。

- [Chrome 91](https://chromestatus.com/features/schedule) [以下で (Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/3e0ef7d3cee8d7dc5a4b953e70cb027b0e13943b/README.md) ) をお試しの方は、この投稿を読んで、API の詳細、使用例、手順を確認してください。
- Chrome (オリジン トライアル) での実験に利用できるこの API (Attribution Reporting) の次のイテレーションに興味がある方は、[メーリングリストにご登録の上、利用可能な実験の最新情報をご確認ください。](https://groups.google.com/u/1/a/chromium.org/g/attribution-reporting-api-dev)

{% endBanner %}

広告キャンペーンの効果を測定するために、広告主とサイト運営者は、広告のクリックまたは表示が購入や申し込みなどの[コンバージョンにつながる時期を知る必要があります。](/digging-into-the-privacy-sandbox/#conversion)**歴史的に、これはサードパーティの Cookie を使用**して行われてきました。現在、Event Conversion Measurement API を使用すると、サイト間でユーザーを認識するために使用できるメカニズムを使用せずに、サイト運営者の Web サイトでのイベントとその後の広告主サイトでのコンバージョンを関連付けることができます。

{% Banner 'info', 'body' %}**この提案には、皆さまからのフィードバックが必要です。**コメントをお持ちの方は、API プロポーザルのリポジトリで[課題を作成してください。](https://github.com/WICG/conversion-measurement-api/issues/) {% endBanner %}

{% Aside %}この API は、プライバシーサンドボックスの一部であり、サードパーティの Cookie やその他のクロスサイト追跡メカニズムを使用せずにサードパーティのユース ケースを満たす一連の提案です。すべての提案の概要については、「[Digging into the Privacy Sandbox](/digging-into-the-privacy-sandbox)」を参照してください。 {% endAside %}

## 用語集

- **アドテック プラットフォーム**: ブランドや代理店がデジタル広告をターゲティング、配信、分析できるようにするソフトウェアやツールを提供する企業。
- **広告主**: 広告にお金を払っている会社。
- **サイト運営者**：ウェブサイトに広告を表示する会社。
- **クリックスルー コンバージョン**: 広告のクリックに起因するコンバージョン。
- **ビュースルー コンバージョン**: 広告のインプレッションに起因するコンバージョン (ユーザーが広告を操作しなかった場合は、後でコンバージョンします)。

## この API について知っておく必要があるのは、アドテック プラットフォーム、広告主、パブリッシャーです。

- **[デマンドサイド](https://en.wikipedia.org/wiki/Demand-side_platform)** プラットフォームなどの**アドテック プラットフォーム**は、現在サードパーティの Cookie に依存している機能をサポートするためにこの API を使用することに関心を持つ可能性が高いでしょう。変換測定システムの開発に取り組んでいる方は、[デモを試し](#experiment-with-the-api)、[API を使って実験を行い](#demo)、[フィードバックを共有](#share-your-feedback)していただくようお願いします。
- **広告やコンバージョンの測定にカスタム コードを使用している広告主やサイト運営者**も、同様にこの API を使用して既存の手法を置き換えることに関心があるかもしれません。
- **広告またはコンバージョン測定に関してアドテック プラットフォームに依存している広告主およびパブリッシャー**は、API を直接使用する必要はありませんが、API を統合する可能性のあるアドテック プラットフォームを使用している場合には、特に[この API の理論的根拠](#why-is-this-needed)に興味を示されるかもしれません。

## API の概要

### なぜこれが必要なのですか？

今日、広告コンバージョンの測定は、多くの場合、 [サードパーティ Cookie](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Third-party_cookies) に依存しています。**しかし、ブラウザーはこれらへのアクセスを制限しています。**

[Chromeは、サードパーティ Cookie のサポートを段階的に廃止することを](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html)計画しており[、ユーザーが選択した場合に](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en) Cookie をブロックする方法を提供します。 Safari は[サードパーティ Cookie](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) をブロックし、Firefox は[既知のサードパーティ追跡 Cookie をブロックし](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default)、また Edge は[追跡防止を提供します](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention)。

サードパーティ Cookie はレガシー ソリューションになりつつあります。**このような新しい専用の API** は、サードパーティ Cookie が解決したユース ケースにプライバシーを保護する方法で対処する目的で使用が広まっています。

**Event Conversion Measurement API はサードパーティ Cookie とどのような点で異なりますか？**

- Cookie とは異なり、コンバージョンを測定する**ために設計されています。**これにより、ブラウザーはより強化されたプライバシー保護を適用できるようになります。
- **より高いレベルのプライバシー**を提供します。たとえば、サイト運営者側と広告主側のユーザー プロファイルをリンクするなど、2 つの異なるトップレベル サイトで同じユーザーを特定することが難しくなります。詳細については、「[How this API preserves user privacy](#how-this-api-preserves-user-privacy)」を参照してください。

### 最初のイテレーション

この API は**初期の実験段階にあり**ます。オリジン トライアルとして利用できるのは、API の**最初のイテレーション**です。[将来のイテレーション](#use-cases)では、状況が大幅に変わる可能性があります。

### クリックのみ

この API のイテレーションは、**クリックスルー コンバージョン測定**のみをサポートしていますが、 [ビュースルー コンバージョン測定](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md)は公開中です。

### 使い方

<figure class="w-figure">
  {% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="図：変換測定 API ステップの概要", width="800", height="496" %}
</figure>

この API は、広告に使用される 2 種類のリンク (`<a>` 要素) で使用できます。

- **ファーストパーティのコンテキスト**におけるリンク。ソーシャル ネットワーク上の広告や検索エンジンの結果ページなど。
- **サードパーティの iframe** におけるリンク。サードパーティのアドテック プロバイダーを使用するパブリッシャー サイトなど。

この API を使用すると、このようなアウトバウンド リンクを広告コンバージョンに固有の属性で構成できます。

- クリック ID やキャンペーン ID など、サイト運営者側の広告クリックに添付するカスタム データ。
- この広告のコンバージョンが見込まれる Web サイト。
- 変換が成功したことを通知する必要があるレポート エンドポイント。
- この広告でコンバージョンをカウントできなくなった締め切り日時。

ユーザーが広告をクリックすると、(ユーザーのローカル デバイスの) ブラウザーがこのイベントをコンバージョン設定とともに記録し、 `<a>`要素のコンバージョン測定属性で指定されたデータをクリックします。

その後、ユーザーは広告主の Web サイトにアクセスして、広告主またはそのアドテック プロバイダーが**コンバージョン**として分類するアクションを実行できます。これが発生した場合、広告クリックとコンバージョン イベントはユーザーのブラウザーによって照合されます。

ブラウザーは最終的に `<a>` 要素の属性で指定されたエンドポイントに送信される**コンバージョン レポート**をスケジュールします。このレポートには、このコンバージョンにつながった広告クリックに関するデータと、コンバージョンに関するデータが含まれています。

特定の広告クリックに対して複数のコンバージョンが登録されている場合、対応するレポートが多数送信されるようにスケジュールされます (広告クリックごとに最大 3 つ)。

レポートは、変換後数日または場合によっては数週間の遅延後に送信されます ([レポートのタイミングで](#report-timing)理由を参照してください)。

## ブラウザーのサポートと類似する API

### ブラウザーのサポート

Event Conversion Measurement API をサポートできます。

- [オリジン トライアル](/origin-trials/)としてサポート可能。オリジン トライアルは、特定の[オリジンの](/same-site-same-origin/#origin)**すべての訪問者**に対して API を有効にします。**エンド ユーザーで API を試すには、オリジン トライアルにオリジンを登録する必要があります**。オリジン トライアルの詳細については、「[変換測定 API の使用](/using-conversion-measurement)」を参照してください。
- Chrome 86 以降でフラグをオンにする。**フラグは、単一ユーザー**のブラウザーで API を有効にします。**フラグは、ローカルで開発するときに役立ちます**。

[Chrome 機能エントリ](https://chromestatus.com/features/6412002824028160)の現在のステータスの詳細をご覧ください。

### 標準化

この API は、Web Platform Incubator Community Group ([WICG](https://www.w3.org/community/wicg/)) でオープンに設計されています。Chrome での実験に利用可能です。

### 同様の API

Safari で使用される Web ブラウザー エンジンである  WebKit には、同様の目標を持つ提案である[プライベート クリック測定](https://github.com/privacycg/private-click-measurement)があります。プライバシー コミュニティ グループ ([PrivacyCG](https://www.w3.org/community/privacycg/)) 内で作業中です。

## この API がユーザーのプライバシーを保護する方法

この API を使用すると、ユーザーのプライバシーを保護しながらコンバージョンを測定できます。ユーザーはサイト間で認識されません。**これは、データ制限**、**変換データの通知**、および**レポートのタイミング** メカニズムによって可能になります。

これらのメカニズムがどのように機能するか、そしてそれらが実際に何を意味するかを詳しく見てみましょう。

### データ制限

以下において、**クリック時間または表示時間のデータ**は、広告がユーザーに配信されてからクリックまたは表示されたときに `adtech.example` で利用できるデータです。変換が発生したときのデータは、**コンバージョン時間データ**です。

**パブリッシャー** `news.example` と**広告主** `shoes.example` を見てみましょう。**アドテック プラットフォーム** `adtech.example` のサードパーティ スクリプトがパブリッシャー サイト `news.example` に存在しており、広告主 `shoes.example` の広告が含まれています。`shoes.example` には、コンバージョンを検出するための `adtech.example` が含まれています。

`adtech.example` は Web ユーザーについてどのくらい学ぶことができますか？

#### サードパーティ Cookie を使用

<figure class="w-figure">
  {% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="図：サードパーティ Cookie がクロスサイト ユーザーの認識を可能にする方法", width="800", height="860" %}
</figure>

`adtech.example` は、**サイト間でユーザーを認識する**ために、**一意のクロスサイト識別子として使用されるサードパーティ Cookie** に依存しています。さらに、`adtech.example` は、詳細なクリック時間または表示時間のデータと詳細な変換時間のデータの**両方**にアクセスし、それらをリンクすることができます。

その結果、`adtech.example` は、1 人のユーザーによる広告ビューからクリック、コンバージョンにおよぶサイト全体の行動を追跡できます。

`adtech.example`、`news.example`、`shoes.example` だけでなく、多数のサイト運営者や広告主のサイトに存在する可能性が高いため、ユーザーの行動を Web 全体で追跡できます。

#### Event Conversion Measurement API を使用

<figure class="w-figure">
  {% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="図：API がクロスサイトユーザー認識なしでコンバージョン測定を可能にする方法", width="800", height="643" %}
  <figcaption class="w-figcaption">Cookie 図の「広告 ID」と「クリック ID」はどちらも、詳細データへのマッピングを可能にする識別子です。この図では、クリックスルー コンバージョン測定のみがサポートされているため、「クリック ID」と呼ばれています。</figcaption>
</figure>

`adtech.example` はクロスサイト識別子を使用できないため、**サイト間でユーザーを認識できません**。

- 64 ビット識別子を広告クリックに添付できます。
- 変換イベントに添付できる変換データは 3 ビットのみです。3 ビットは 0 から 7 までの整数値に適合できます。これは多くのデータではありませんが、広告主が将来の広告予算をどこに使うかについて適切な決定を下す方法を学ぶのに十分です (たとえば、データモデルのトレーニングによって)。

{% Aside %}クリック データとコンバージョン データが同じコンテキストの JavaScript 環境に公開されることはありません。{% endAside %}

#### サードパーティ Cookie に代わるものなし

Event Conversion Measurement API などのサードパーティ Cookie に代わるものがなければ、コンバージョンを `adtech.example` することはできません。adtech.example がサイト運営者と広告主の両方のサイトに存在する場合は、クリック時間またはコンバージョン時間のデータにアクセスできますが、それらをリンクすることは一切できません。

この場合、ユーザーのプライバシーは保護されますが、広告主は広告費を最適化できません。Event Conversion Measurement API のような代替手段が必要なのはこのためです。

### コンバージョン データのノイズ

変換時に収集された 3 ビットには**ノイズ**が発生します。

たとえば、Chrome の実装では、データ ノイズは次のように機能します。API は 5％ の確率で実際のコンバージョン データではなくランダムな 3 ビット値をレポートします。

これにより、プライバシー攻撃からユーザーが保護されます。いくつかの変換からのデータを悪用して識別子を作成しようとする攻撃者は、受信するデータを完全には信用できないため、こうしたタイプの攻撃はより複雑化します。

[真のコンバージョン数を回復](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count)できることにご注意ください。

クリック データとコンバージョン データの合計:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>データ</th>
        <th>サイズ</th>
        <th>例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>クリック データ (<code>impressiondata</code> 属性)</td>
        <td>64 ビット</td>
        <td>広告 ID またはクリック ID</td>
      </tr>
      <tr>
        <td>変換データ</td>
        <td>3 ビット、ノイズ</td>
        <td>サインアップ、完全なチェックアウトなど、コンバージョン タイプにマッピングできる 0 から 7 までの整数。</td>
      </tr>
    </tbody>
  </table>
</div>

### レポートのタイミング

特定の広告クリックに対して複数のコンバージョンが登録されている場合**、対応するレポートがコンバージョンごとに送信され、クリックごとに最大 3 つまで送信されます**。

変換側からより多くの情報を取得する目的で変換時間が使用されることによりユーザーのプライバシーに影響がおよぶのを防ぐために、この API では、変換直後に変換レポートが送信されないことが指定されます。最初の広告クリックの後、このクリックに関連付けられた**レポート ウィンドウ**のスケジュールが開始されます。各レポート ウィンドウには期限があり、その期限より前に登録されたコンバージョンは、そのウィンドウの最後に送信されます。

レポートは、このようにスケジュールされた日時の正確なタイミングでは送信されない場合があります。レポートの送信がスケジュールされているときにブラウザーが稼働していなければ、レポートはブラウザーの起動時に送信されます。それは、スケジュールされた時刻から数日後または数週間後となる場合があります。

満了後 (クリック時間 + `impressionexpiry`)、変換はカウントされません。この広告の変換をカウントできなくなるタイミングとして、`impressionexpiry` がカットオフの日時となります

Chromeでは、レポートのスケジュールは次のように機能します。

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>変換時間に応じて、変換レポートが送信されます (ブラウザーが開いている場合)...</th>
        <th>レポート ウィンドウの数</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 日、デフォルトおよび最大値</td>
        <td>
          <ul>
            <li>広告がクリックされてから 2 日後</li>
            <li>または広告クリックから 7 日後</li>
            <li>または<code>impressionexpiry</code> = 広告クリックから 30 日後。</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>は 7 日から 30 日です</td>
        <td>
          <ul>
            <li>広告クリックの 2 日後</li>
            <li>または広告クリックから7日後</li>
            <li>または広告クリック後の<code>impressionexpiry</code>
</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>は 2 日から 7 日です</td>
        <td>
          <ul>
            <li>広告クリックの 2 日後</li>
            <li>または広告クリック後の<code>impressionexpiry</code>
</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>は 2 日未満です</td>
        <td>
          <li>広告クリックの 2 日後</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">
  {% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="どのレポートがいつ送信されるかを示すクロノロジー", width="800", height="462" %}
</figure>

タイミングの詳細については、 [スケジュールされたレポートの送信を](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports)参照してください。

## 例

{% Banner 'info', 'body' %}これが実際に動作することを確認するには、[デモ](https://goo.gle/demo-event-level-conversion-measurement-api)を試して、対応する[コード](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement)を確認してください。 {% endBanner %}

API によりコンバージョンが記録および報告される仕組みは次のとおりです。現在の API では、「click-to-convert」のフローはこのように機能します。この API の今後のイテレーションは、これと[異なる可能性があります](#use-cases)。

### 広告クリック (ステップ 1 から 5)

<figure class="w-figure">
  {% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="図：広告クリックとクリック ストレージ", width="800", height="694" %}
</figure>

`<a>`広告要素は、iframe 内の`adtech.example` によってサイト運営者サイトに読み込まれます。

アドテック プラットフォームの開発者は、`<a>` を以下のようなコンバージョン測定属性で設定しています。

```html
<a
  id="ad"
  impressiondata="200400600"
  conversiondestination="https://advertiser.example"
  reportingorigin="https://adtech.example"
  impressionexpiry="864000000"
  href="https://advertiser.example/shoes07"
>
  <img src="/images/shoe.jpg" alt="shoe" />
</a>
```

このコードは以下を指定します：

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>属性</th>
        <th>デフォルト値、最大、最小</th>
        <th>例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code> (必須)：広告クリックに添付する<b> 64 ビットの識別子。</b>
</td>
        <td>(デフォルトなし)</td>
        <td>64 ビット整数などの動的に生成されたクリック ID： <code>200400600</code>
</td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code> (必須): <b><a href="/same-site-same-origin/#site" noopener="">eTLD + 1</a></b> 変換はこの広告のために期待されています。</td>
        <td>(デフォルトなし)</td>
        <td>
<code>https://advertiser.example</code> 。<br> <code>conversiondestination</code>が<code>https://advertiser.example</code> である場合、 <code>https://advertiser.example</code> と<code>https://shop.advertiser.example</code> の両方での変換に起因します。<br> <code>conversiondestination</code>が<code>https://shop.advertiser.example</code> の場合も同じことが起こり、<code>https://advertiser.example</code> と<code>https://shop.advertiser.example</code> の両方での変換に起因します。</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>の有効期限 (オプション): ミリ秒単位で、コンバージョンがこの広告に起因する可能性がある場合のカットオフ時間。</td>
        <td>
<code>2592000000</code> = 30日 (ミリ秒単位)。<br><br>最大: 30 日 (ミリ秒単位)。<br><br>最小: 2日 (ミリ秒単位)。</td>
        <td>クリックから 10 日後： <code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code> (オプション): 確認済みのコンバージョンをレポートする宛先。</td>
        <td>リンク要素が追加されたページのトップレベルの起点。</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code>: 広告クリックの目的の宛先。</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}例に関する注意事項:

- 現在はクリックのみがサポートされていますが、API の属性または API プロポーザルで使用されている「インプレッション」という用語があります。名前は、API の将来の反復で更新される可能性があります。
- 広告は iframe 内にある必要はありませんが、これがこの例の基になっています。

{% endAside %}

{% Aside 'gotchas' %}

- `window.open` または `window.location` を介したナビゲートに基づくフローは、帰属の対象にはなりません。

{% endAside %}

ユーザーが広告をタップまたはクリックすると、広告主のサイトに移動します。ナビゲーションがコミットされると、ブラウザーは、`impressiondata`、`conversiondestination`、`reportingorigin`、`impressionexpiry` を含むオブジェクトを保存します。

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### 変換とレポートのスケジュール (ステップ 6 から 9)

<figure class="w-figure">
  {% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="図: 変換とレポートのスケジュール", width="800", height="639" %}
</figure>

広告をクリックした直後、または後で (たとえば翌日に)、ユーザーは `advertiser.example` にアクセスし、スポーツ シューズを閲覧し、購入したいペアを見つけて、チェックアウトに進みます。`advertiser.example` は、チェックアウト ページにピクセルを含めました。

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example` はこのリクエストを受信し、コンバージョンとして適格であると判断します。次に、コンバージョンを記録するようにブラウザーに要求する必要があります。`adtech.example` は、すべての変換データを 3 ビット (0 から 7 の整数) に圧縮します。たとえば、**チェックアウト** アクションを変換値 2 にマップする場合があります。

`adtech.example` は、特定のレジスタ変換リダイレクトをブラウザーに送信します。

```js
const conversionValues = {
  signup: 1,
  checkout: 2,
};

app.get('/conversion', (req, res) => {
  const conversionData = conversionValues[req.query.conversiontype];
  res.redirect(
    302,
    `/.well-known/register-conversion?conversion-data=${conversionData}`,
  );
});
```

{% Aside %}`.well-known` は特別な URL です。これにより、ソフトウェア ツールやサーバーは、サイトで一般的に必要な情報やリソースを簡単に見つけることができます。たとえば、ユーザーが[パスワードを変更できる](/change-password-url/)ページを確認できます。ここで、`.well-known` は、ブラウザーがこれを特別な変換要求として認識するためだけの目的で使用されます。このリクエストは、実際にはブラウザーによって内部的にキャンセルされます。{% endAside %}

ブラウザーはこのリクエストを受け取ります。`.well-known/register-conversion` を検出すると、ブラウザーは次のようになります。

- `conversiondestination` に一致するストレージ内のすべての広告クリックを検索します (ユーザーが広告をクリックしたときに `conversiondestination` URL として登録された URL でこのコンバージョンを受信しているため)。 1 日前にサイト運営者のサイトで発生した広告クリックを検出します。
- この広告クリックのコンバージョンを登録します。

いくつかの広告のクリックが変換にマッチする場合があります。ユーザーは、`news.example` と `weather.example` の両方で `shoes.example` の広告をクリックした可能性があります。この場合は、複数の変換が登録されます。

これで、ブラウザーはこの変換をアドテック サーバーに通知する必要があることを認識します。具体的には、`<a>` 要素とピクセル リクエスト (`adtech.example`) の両方で指定されている `reportingorigin` に報告する必要があります。

そのために、ブラウザーは **コンバージョン レポート**、つまり (パブリッシャー サイトからの) クリック データを含むデータのブロブおよび (広告主サイトからの) コンバージョン データを含むデータを送信するようにスケジュールします。この例では、ユーザーはクリックの 1 日後にコンバージョンを達成しました。そのため、レポートは翌日、ブラウザーが実行されている場合はクリック後 2 日目で送信されるようにスケジュールされています。

### レポートの送信 (ステップ 10 および 11)

<figure class="w-figure">
  {% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="図: レポートを送信するブラウザー", width="800", height="533" %}
</figure>

レポートを送信する予定の時間に達すると、ブラウザーは**変換レポート**を送信します。`<a>`要素 `adtech.example` で指定されたレポートの発信元に HTTP POST が送信されます。

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

パラメータとして含まれるものは次のとおりです。

- 元の広告クリックに関連付けられたデータ (`impression-data`)。
- 変換に関連するデータ[。ノイズが発生する可能性があり](#noising-of-conversion-data)ます。
- クリックに起因するコンバージョン クレジット。この API は、**ラストクリック アトリビューション** モデルに従います。最新の一致する広告クリックには 100 のクレジットが与えられ、他のすべての一致する広告クリックには 0 のクレジットが与えられます。

アドテック サーバーがこのリクエストを受信すると、サーバーから `impression-data` と `conversion-data` (つまり変換レポート) を取得できます。

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### その後の変換と有効期限

後に、ユーザーは、たとえば、シューズに合わせてテニスのラケットを `advertiser.example` から購入するかもしれません。その際も同様のフローが発生します。

- アドテック サーバーは、変換要求をブラウザーに送信します。
- ブラウザーはこのコンバージョンを広告クリックと照合し、レポートをスケジュールし、それを後からアドテック サーバーに送信します。

`impressionexpiry` の有効期限が切れると、この広告クリックのコンバージョンはカウントされなくなり、広告クリックはブラウザーのストレージから削除されます。

## ユース ケース

### 現在サポートされているもの

- クリックスルー コンバージョンを測定する: どの広告クリックがコンバージョンにつながるかを判断し、コンバージョンに関する大まかな情報にアクセスします。
- 機械学習モデルのトレーニングなどにより、データを収集して広告の選択を最適化します。

### このイテレーションでサポートされていないもの

次の機能はサポートされていませんが、この API の今後のイテレーション、または[集計](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md)レポートには含まれる可能性があります。

- ビュースルー コンバージョン測定。
- [複数のレポート エンドポイント](https://github.com/WICG/conversion-measurement-api/issues/29)。
- [iOS/Android アプリで開始された Web コンバージョン](https://github.com/WICG/conversion-measurement-api/issues/54)。
- コンバージョン リフトの測定/増分: 広告を見たテスト グループと見なかったコントロール グループの違いを測定することによる、コンバージョン行動の因果関係の違いの測定。
- ラストクリックではないアトリビューション モデル。
- 変換イベントに関する大量の情報を必要とするユース ケース。たとえば、きめ細かい購入額や商品カテゴリなど。

これらの機能やその他の機能をサポートする前に、(ノイズやビット数の削減、その他の制限など) **さらなるプライバシー保護**を API に追加する必要があります。

追加される可能性のある機能に関するディスカッションは、[API プロポーザル リポジトリの**課題のセクション**](https://github.com/WICG/conversion-measurement-api/issues)に公開されています。

{% Aside %}ユース ケースの欠落や API に関するフィードバックがございましたら、ぜひ[共有](#share-your-feedback)してください。{% endAside %}

### 将来のイテレーションで変わる可能性があるもの

- この API は、初期の実験段階にあります。今後のイテレーションにおいて、この API は変更される可能性があります。その変更内容は、以下を含むものの、これらに限定されない可能性があります。その目標は、ユーザーのプライバシーを保護しながらコンバージョンを測定することであり、このユース ケースにより適切に対処するのに役立つ変更が加えられます。
- API と属性の命名は進化する可能性があります。
- クリック データとコンバージョン データはエンコードを必要としなくなる可能性があります。
- 変換データの 3 ビット制限は増減する可能性があります。
- [より多くの機能が追加される可能性があります。そうした新機能をサポートするのに必要でれば、](#what-is-not-supported-in-this-iteration)**さらなるプライバシー保護 (ノイズ/ビット数の減少/その他の制限など)** が追加される可能性もあります。

新機能に関するディスカッションをフォローしたり、参加したりするには、プロポーザルの [GitHub リポジトリ](https://github.com/WICG/conversion-measurement-api/issues)を見てアイデアを送信してください。

## お試しください

### デモ

[デモをお](https://goo.gle/demo-event-level-conversion-measurement-api)試しください。必ず「始める前に」の指示に従ってください。

デモに関する質問については、[@maudnals](https://twitter.com/maudnals?lang=en) または [@ChromiumDev](https://twitter.com/ChromiumDev) をツイートしてください。

### API をお試しください

API をローカルで、またはエンドユーザーを対象に実験する予定の方は、[Using the conversion measurement API](/using-conversion-measurement) を参照してください。

### フィードバックを共有する

新しい Conversion Measurement API がユース ケースをサポートし、開発者に優れた体験を提供するには、**皆さまからのフィードバックが欠かせません**。

- Chrome の実装に関するバグを報告するには、[バグを開いてください](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A)。
- Chrome API のフィードバックを共有し、ユース ケースに関するディスカッションを行うには、新しい課題を作成するか、 [API プロポーザル リポジトリ](https://github.com/WICG/conversion-measurement-api/issues)に既存の課題に参加してください。[同様に、API プロポーザル リポジトリでは] (https://github.com/privacycg/private-click-measurement/issues)WebKit/Safari API とそのユース ケースに関するディスカッションを行えます。
- 広告の使用例について話し合い、業界の専門家と意見を交換するには、 [Improving Web Advertising Business Group](https://www.w3.org/community/web-adv/) に参加してください。 WebKit/Safari API に関するディスカッションについては、[プライバシー コミュニティ グループ](https://www.w3.org/community/privacycg/)に参加してください。

### 最新情報の確認をお忘れなく

- 開発者によるフィードバックとユース ケースが収集されるにつれ、Event Conversion Measurement API は進化していきます。プロポーザルの [GitHub リポジトリ](https://github.com/WICG/conversion-measurement-api/)をご覧ください。
- この API を補完する [AggregateConversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) の進化を追いましょう。

*Charlie Harrison、John Delaney、Michael Kleber、KayceBasques をはじめとする、すべてのレビュアーによる貢献とフィードバックに感謝いたします。*

*William Warby によるヒーロー画像/Unsplash の [@wawarby](https://unsplash.com/photos/WahfNoqbYnM)、編集済み。*
