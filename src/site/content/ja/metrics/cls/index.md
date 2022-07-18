---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: 2019-06-11
updated: 2022-07-18
description: この投稿では、Cumulative Layout Shift (累積レイアウト シフト数、CLS) という指標について紹介し、その測定方法に関する説明を行います。
tags:
  - performance
  - metrics
  - web-vitals
---

{% Aside 'caution' %}**2021 年 6 月 1 日:** CLS の実装が変更されました。変更の理由に関する詳細については、「[進化を続ける CLS 指標](/evolving-cls)」を参照してください。{% endAside %}

{% Aside 'key-term' %}Cumulative Layout Shift (累積レイアウト シフト数、CLS) は、[視覚的な安定性](/user-centric-performance-metrics/#types-of-metrics)を測定するための重要なユーザーを中心とした指標です。これは、ユーザーが予期しないレイアウト シフトに遭遇する頻度の数値化に役立つ指標であり、CLS が低ければ低いほど、そのページが[快適](/user-centric-performance-metrics/#questions)であることが保証されます。{% endAside %}

インターネットで記事を読んでいて、突然ページのレイアウトが変わってしまったことはありませんか？何の警告もなく文字が移動してしまい、自分がページ内のどこを読んでいたのか分からなくなってしまうことがあります。さらにひどい場合には、リンクやボタンをタップしようとしてから画面に指が触れるまでのほんの一瞬の間に "パッ" とリンクが移動してしまい、結局別のものをクリックしてしまう場合もあります。

ほとんどの場合、こういったユーザー体験は単に煩わしいだけなのですが、中には実害をもたらしてしまう場合もあります。

<figure>
  <video autoplay controls loop muted poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png" width="658" height="510">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>レイアウトの不安定さがユーザーにネガティブな影響を及ぼす状況について説明しているスクリーンキャスト。</figcaption></figure>

ページ コンテンツの予期しない移動は、一般的にリソースが非同期的に読み込まれたり、ページ上の既存のコンテンツの上側に DOM 要素が動的に追加されたりする場合に発生します。原因としては、サイズが明示されていない画像や動画、フォールバックとして用意されているフォントよりも大きく、または小さくレンダリングされるフォント、動的にサイズが変更されるサードパーティ製の広告やウィジェットなどが考えられます。

この問題をさらに深刻なものにしているのは、開発段階でのサイトの機能が、実際にユーザーが体験するものとはかなり異なる場合が多いという点です。カスタマイズされたコンテンツやサードパーティ製のコンテンツは開発段階では本番環境と同じように動作しませんし、テスト画像については開発者のブラウザー キャッシュにすでに保存されている場合が多く、ローカル環境で実行される API コールも遅延に気付くことができないほど高速である場合が多いです。

Cumulative Layout Shift (CLS) 指標は、実際のユーザーに対するこの現象の発生頻度を測定することにより、この問題への対処をサポートします。

## CLS とは？

CLS は、ページの表示中に発生した[予期しない](/cls/#expected-vs.-unexpected-layout-shifts)レイアウトシフトごとに*レイアウト シフト スコア*の最大バーストを測定します。

*レイアウト シフト*は、表示された要素がレンダリングされたフレームから次のフレームへと位置を変更する際に発生します。(個々の[レイアウト シフト スコア](#layout-shift-score)の計算方法に関する詳細については、以下を参照してください)。

[*セッション ウィンドウ*](evolving-cls/#why-a-session-window)と呼ばれるレイアウト シフトのバーストとは、それぞれが独立した 1 回以上のレイアウト シフトが、1 回のシフトが 1 秒未満、ウィンドウ全体で最大 5 秒間の長さで急速に連続して発生することを指します。

そして最大バーストとは、そのウィンドウで発生したすべてのレイアウト シフトを累積したスコアが最大となるセッション ウィンドウのことを指します。

<figure>
  <video controls autoplay loop muted width="658" height="452">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>セッション ウィンドウの例。青いバーは、個々のレイアウト シフトのスコアを表しています。</figcaption></figure>

{% Aside 'caution' %}以前の CLS は、ページの表示期間全体で発生した*個々のレイアウト シフト スコアすべて*の合計値を測定していました。オリジナルの実装に対応可能なベンチマーク機能を現在も提供しているツールを確認するには、「[進化を続ける Web ツールでの Cumulative Layout Shift](/cls-web-tooling)」を参照してください。{% endAside %}

### CLS における良いスコアとは？

良好なユーザー体験を提供するために、サイトは CLS スコアが **0.1** 以下になるように努力する必要があります。ほぼすべてのユーザーに対してこの目標値を確実に達成するためには、モバイル デバイスとデスクトップ デバイスに分けた上で、総ページロード数の 75 パーセンタイルをしきい値として設定します。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="良好なCLS値は0.1未満、不良な値は0.25を超え、その間の値は改善が必要", width="400", height="300" %}
</picture>

{% Aside %}この推奨事項の根拠となる調査および方法論に関する詳細については、「[Core Web Vitals 指標のしきい値の定義](/defining-core-web-vitals-thresholds/)」を参照してください。{% endAside %}

## レイアウト シフトの詳細

レイアウト シフトは [Layout Instability API](https://github.com/WICG/layout-instability) によって定義されており、ビューポート内に表示されている要素が 2 つのフレーム間で開始位置 (たとえば、デフォルトの [writing-mode](https://developer.mozilla.org/docs/Web/CSS/writing-mode) での top と left) を変更すると、`layout-shift` エントリがレポートされます。こういった要素は、*不安定な要素*としてみなされます。

レイアウト シフトは、既存の要素がその開始位置を変更する場合にのみ発生することにご注意ください。新しい要素が DOM に追加されたり、既存の要素のサイズが変更されたりしても、その変更が表示されている他の要素の開始位置の変更を引き起こさない限りはレイアウト シフトとしてカウントされません。

### レイアウト シフト スコア

*レイアウト シフト スコア*を計算するために、ブラウザーはビューポートのサイズと、2 つのレンダリング フレーム間におけるビューポート内での*不安定な要素*の移動を確認します。レイアウト シフト スコアは、その移動の 2 つの尺度である*インパクト係数* (Impact Fraction) と*距離係数* (Distance Fraction) の積です (いずれも以下のように定義されます)。

```text
layout shift score = impact fraction * distance fraction
```

### インパクト係数

[インパクト係数](https://github.com/WICG/layout-instability#Impact-Fraction)は、*不安定な要素*が 2 つのフレーム間におけるビューポート領域にどのような影響を与えるかを測定します。

前のフレーム*と*現在のフレームにおけるすべての*不安定な要素*の表示領域の合計が、ビューポートの総領域の一部として、現在のフレームの*インパクト係数*となります。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BbpE9rFQbF8aU6iXN1U6.png", alt="*不安定な要素*が 1 つ含まれているインパクト係数の例", width="800", height="600", linkTo=true %}

上の画像には、1 つのフレームでビューポートの半分を占めている要素があります。そして次のフレームでは、その要素はビューポートの高さの 25% 分下方向に移動しています。赤い点線で囲まれている長方形は両方のフレームにおける要素の表示領域の合計を示しており、この場合にはビューポート全体の 75% となるため、その*インパクト係数*は `0.75` となります。

### 距離係数

レイアウト シフト スコアを算出するための式に含まれているもう一方の構成要素は、不安定な要素がビューポートと比較してどの程度移動したかを測定します。*距離係数*は、フレーム内での*不安定な要素*の最大の移動距離 (水平方向または垂直方向のいずれか) をビューポートの最大サイズ (幅または高さのうち大きい方のいずれか) で割ったものです。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASnfpVs2n9winu6mmzdk.png", alt="*不安定な要素*が 1 つ含まれている距離係数の例", width="800", height="600", linkTo=true %}

上の例では、ビューポートの最大サイズは高さであり、不安定な要素はビューポートの高さの 25% 分移動したことになるため、*距離係数*は 0.25 となります。

つまりこの例では、*インパクト係数*が `0.75`、*距離係数*が `0.25` となるため、*レイアウト シフト スコア*は `0.75 x 0.25 = 0.1875` となります。

{% Aside %}当初は、レイアウト シフト スコアは*インパクト係数*のみに基づいて計算されていました。この*距離係数*は、サイズの大きな要素がわずかな距離のみ移動する場合に、過度にペナルティを課してしまうことを避けるために導入されました。{% endAside %}

次の例では、既存の要素へのコンテンツの追加がレイアウト シフト スコアにどのような影響を及ぼすかについて説明します。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xhN81DazXCs8ZawoCj0T.png", alt="安定した要素、*不安定な要素*、ビューポート クリッピングが含まれるレイアウト シフトの例", width="800", height="600", linkTo=true %}

"Click Me!" (クリックしてね！) ボタンが黒色のテキストを含む灰色のボックスの下に追加され、白色のテキストを含む緑色のボックスを下方向に押し下げました (ボックスの一部がビューポートの外に出てしまいました)。

この例では、灰色のボックスのサイズは変更されていますが、開始位置は変更されていないため、これは*不安定な要素*ではありません。

"Click Me!" ボタンはそれまで DOM に存在していなかったため、このボタンの開始位置についても変更はありません。

緑色のボックスの開始位置は変更されたものの、一部がビューポートから外に出ています。*インパクト係数*の計算には、非表示領域は考慮されません。両方のフレームでの緑色のボックスの表示領域の合計 (赤い点線で囲まれている長方形で示されています) は、最初のフレームでの緑色のボックスの領域と同じで、ビューポートの 50% になります。この場合の*インパクト係数*は、`0.5` です。

*距離係数*は、紫色の矢印で示されています。緑色のボックスはビューポートの約 14% 分下方向に移動しているため、*距離分数*は `0.14` となります。

レイアウト シフト スコアは、`0.5 x 0.14 = 0.07` です。

次の最後の例では、*不安定な要素*が複数ある場合を示しています。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FdCETo2dLwGmzw0V5lNT.png", alt="複数の安定した要素と*不安定な要素*が含まれるレイアウト シフトの例", width="800", height="600", linkTo=true %}

上の画像にある 1 つ目のフレームでは、動物に関する API リクエストの 4 件の結果がアルファベット順に並べ替えられています。2 つ目のフレームでは、並べ替えられたリストに結果がさらに追加されています。

リストの一番上にある項目 ("Cat") は、フレーム間で開始位置が変更されていないため、安定した要素であると言えます。同様にリストに追加された新しいアイテムも、それまで DOM に存在していなかったため、開始位置に変更はありません。しかしながら、"Dog"、"Horse"、"Zebra" とラベル付けされている項目はすべて開始位置が変更されているため、これらは*不安定な要素*となります。

赤い点線で囲まれている長方形は、これら 3 つの*不安定な要素*の前後の領域の合計を示しており、この場合はビューポートの領域の約 38% になります (この場合の*インパクト係数*は `0.38` です)。

3 つの矢印は、*不安定な要素*がそれぞれの開始位置から移動した距離を示しています。そして、青い矢印で示されている "Zebra" 要素がビューポートの高さの約 30% と最も大きく移動しています。よって、この例での*距離係数*は `0.3` となります。

レイアウト シフト スコアは、`0.38 x 0.3 = 0.114` です。

### 意図的に行われるレイアウト シフトと予期しないレイアウト シフト

すべてのレイアウト シフトが問題となるわけではありません。実際に、多くの動的な Web アプリケーションにおいてページ上に存在する要素の開始位置の頻繁な変更が行われています。

#### ユーザーの操作によるレイアウト シフト

レイアウト シフトは、ユーザーがその発生を予期していない場合にのみ問題となります。その一方で、ユーザーによる操作 (リンクのクリック、ボタンの押下、検索ボックスへの入力など) に応じて発生するレイアウト シフトについては、通常その関係性をユーザーが明確に理解できるようにインタラクションの近くで発生させている限りは問題ありません。

たとえば、ユーザーの操作によって完了するまでに時間がかかるネットワーク リクエストがトリガーされた場合には、リクエストの完了時に不快なレイアウト シフトが発生してしまうことを避けるためにすぐにスペースを作成し、そこに読み込みインジケーターを表示させるのが最善の方法です。ユーザーが読み込み中であることに気付けなかったり、リソースの準備がいつ完了するのか分からなかったりすると、ユーザーが読み込みの待機中に何か別のものをクリックしようとしてしまうかもしれませんし、その結果としてページから離脱してしまう可能性もあります。

ユーザーの入力から 500 ミリ秒以内に発生するレイアウト シフトには [`hadRecentInput`](https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput) フラグが設定されるため、それらを計算から除外することができます。

{% Aside 'caution' %}`hadRecentInput` フラグは、個別の入力イベント (タップ、クリック、キー押下など) に対してのみ true になります。連続的なインタラクション (スクロール、ドラッグ、ピンチによるズーム ジェスチャーなど) は "最近の入力" (Recent Input、500 ミリ秒以内に応答が発生する入力) とはみなされません。詳細はについては、「[レイアウトの不安定性の仕様](https://github.com/WICG/layout-instability#recent-input-exclusion)」を参照してください。{% endAside %}

#### アニメーションとトランジション

アニメーションやトランジションは、上手に使用することでユーザーを驚かせることなくページ上のコンテンツを更新することができる優れた手法です。ページ上でコンテンツが突然何の前触れもなく移動してしまえば、ユーザーはほとんどの場合に悪印象を抱いてしまいます。しかしながら、ある位置から目的の位置へと少しづつ自然に移動するようなコンテンツは、ユーザーにとっては何が起こっているのかを理解しやすいですし、状態が変化している間にユーザーを誘導することもできます。

CSS の [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform) プロパティを使用すれば、レイアウト シフトを発生させることなく要素をアニメーション化することができます。

- `height` プロパティや `width` プロパティを変更するのではなく、`transform: scale()` を使用します。
- 要素を移動させる場合には、`top`、`right`、`bottom`、`left` の各プロパティを変更するのではなく、`transform: translate()` を使用します。

## CLS の測定方法

CLS は[ラボ環境](/user-centric-performance-metrics/#in-the-lab)または[実際のユーザー環境](/user-centric-performance-metrics/#in-the-field)で測定が可能で、以下のツールが使用できます。

{% Aside 'caution' %}通常ラボ測定を実施するためのツールは人工的な環境でページの読み込みを行うため、ページの読み込み中に発生するレイアウト シフトしかレポートできません。そのため、ラボ測定を実施するためのツールが指定されたページについてレポートする際の CLS の値は、ユーザーが実際の環境で体験する値よりも小さくなる可能性があります。{% endAside %}

### フィールド測定を実施するためのツール

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console (Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)

### ラボ測定を実施するためのツール

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### JavaScript を使用して CLS を測定する

JavaScript を使用した CLS の測定には、[Layout Instability API](https://github.com/WICG/layout-instability) を使用することができます。以下の例では、予期しない `layout-shift` エントリをリッスンしてセッションごとに分類し、変更が発生するたびにセッションの最大値をログとして記録する [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) の作成方法を示しています。

```js
let clsValue = 0;
let clsEntries = [];

let sessionValue = 0;
let sessionEntries = [];

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // 直近のユーザーの入力がないレイアウト シフトのみをカウントします。
    if (!entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // エントリが前のエントリの発生から 1 秒以内に発生していて、
      // かつ同一セッション内の最初のエントリの発生から 5 秒以内に発生している場合には、
      // そのエントリを現在のセッションに含めます。そうでない場合には、新しいセッションを開始します。
      if (sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // 現在のセッションの値が現在の CLS の値よりも大きい場合には、
      // CLS とそれに寄与しているエントリを更新します。
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries;

        // 更新された値 (およびそのエントリ) をコンソールにログとして記録します。
        console.log('CLS:', clsValue, clsEntries)
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

{% Aside 'warning' %}

このコードは CLS を計算してログとして記録するための基本的な方法を示していますが、[Chrome User Experience Report](https://developer.chrome.com/docs/crux/) (CrUX) での測定結果と一致するように CLS を正確に測定する方法はより複雑です。詳細については、以下を参照してください。

{% endAside %}

ほとんどの場合、ページがアンロードされている時点での CLS 値がそのページの最終的な CLS 値となるのですが、重要な例外もいくつか存在します。

次のセクションでは、API がレポートする内容と、指標の計算方法の違いについて説明します。

#### 指標と API の違い

- ページがバックグラウンドで読み込まれた場合や、ブラウザーがコンテンツのいずれかを描画する前にバックグラウンドに移行した場合には、CLS 値をレポートしてはいけません。
- ページが [Back/Forward Cache](/bfcache/#impact-on-core-web-vitals) から復元された場合、これはユーザーにとって異なるページ訪問となるため、その CLS 値はゼロへとリセットされる必要があります。
- API では iframe 内で発生したシフトについての `layout-shift` エントリはレポートされませんが、CLS を正確に測定するためにはこれらのエントリも考慮に入れる必要があります。サブフレームが[集約](https://github.com/WICG/layout-instability#cumulative-scores)のために API を使用してその親フレームに `layout-shift` エントリをレポートすることができます。

これらの例外に加えて、CLS はページの表示期間全体を測定するため、より複雑さが増しています。

- ユーザーは、1 つのタブを (数日間、数週間、数か月など) *かなりの*長期間に渡って開き続ける場合があります。実際に、タブをまったく閉じないユーザーが存在する可能性もあります。
- モバイル OS では、通常ブラウザーはバックグラウンド タブについてはページ アンロード コールバックを実行しないため、"最終的な" 値のレポートが困難になっています。

こういったケースに対処するためには、ページがアンロードされるタイミングに加えて、バックグラウンドに移行するタイミングでも CLS をレポートする必要があります ([`visibilitychange` イベント](https://developer.chrome.com/blog/page-lifecycle-api/#event-visibilitychange)は、これらのシナリオの両方をカバーしています)。このデータを受け取ったアナリティクス システムは、最終的な CLS 値をバックエンドで計算する必要があります。

開発者がこれらのケースをすべて記憶して対処する必要はありません。[`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)を使用すれば、上記すべてが考慮された状態で CLS の測定を行うことができます。

```js
import {getCLS} from 'web-vitals';

// CLS のレポートが必要なすべての状況で
// CLS を測定し、ログとして記録します。
getCLS(console.log);
```

JavaScript を使用して CLS を測定する方法に関する詳細な例については、[`getCLS()` のソース コード](https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts)を参照してください。

{% Aside %}場合によっては (クロスオリジン iframe など)、JavaScript を使用して CLS を測定することはできません。詳細については、`web-vitals` ライブラリの「[制限事項](https://github.com/GoogleChrome/web-vitals#limitations)」セクションを参照してください。{% endAside %}

## CLS の改善方法

以下に挙げるいくつかの原則に従うことにより、ほとんどの Web サイトで予期しないレイアウト シフトの発生を回避することができます。

- **画像要素や動画要素に必ず size 属性を付ける手法や、[CSS を駆使したアスペクト比対応ボックス](https://css-tricks.com/aspect-ratio-boxes/)などの手法を用いて必要なスペースを確保する。**こういったアプローチを取ることによって、ブラウザーが画像の読み込み中に適切なサイズのスペースをドキュメント内に確保することができます。なお、機能ポリシーをサポートしているブラウザーであれば、[unsized-media 機能ポリシー](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md)を使用してこの動作を強制することも可能です。
- **ユーザーの操作に応じる場合を除き、既存のコンテンツの上側にコンテンツを挿入しない。**こうしておくことで、レイアウト シフトが発生したとしても、その影響を想定内に留めておくことができるようになります。
- **レイアウト変更のトリガーとなるプロパティを利用したアニメーションよりも、transform アニメーションを優先する。**ある状態から別の状態へのコンテキストや連続性を提供する方法でトランジションをアニメーション化しましょう。

CLS の改善方法の詳細については、「[CLS を最適化する](/optimize-cls/)」および「[レイアウト シフトのデバッグ](/debug-layout-shifts)」を参照してください。

## その他のリソース

- [レイアウト シフトを最小限に抑える方法](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)に関する Google パブリッシャー タグのガイダンス
- [Annie Sullivan](https://anniesullie.com/) と [Steve Kobes](https://kobes.ca/) による「[Cumulative Layout Shift を理解する](https://youtu.be/zIJuY-JCjqw)」[#PerfMatters](https://perfmattersconf.com/) より (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
