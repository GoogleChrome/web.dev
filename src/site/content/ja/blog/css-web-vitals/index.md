---
title: WebVitalsのCSS
subhead: WebVitalsを最適化するためのCSS関連の手法
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: マルチカラーグラデーション
description: この記事では、Web Vitalsを最適化するためのCSS関連の手法について説明します。
tags:
  - blog
  - performance
  - css
---

スタイルの記述方法とレイアウトの作成方法は、[Core Web Vitals](/collection/)に大きな影響を与える可能性があります。これは、[Cumulative Layout Shift (CLS)](/cls)と[Largest Contentful Paint (LCP)](/lcp)に特に当てはまります。

この記事では、Web Vitalsを最適化するためのCSS関連の手法について説明します。これらの最適化はページのさまざまな要素 (レイアウト、画像、フォント、アニメーション、読み込み) によって分類されます。その中で、[サンプルページ](https://codepen.io/una/pen/vYyLKvY)の改良について探ります。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png", alt="サンプルサイトのスクリーンショット", width="800", height="646" %}

## レイアウト

### DOMへのコンテンツの挿入

周囲のコンテンツがすでに読み込まれた後にコンテンツをページに挿入すると、ページの他の要素がすべて下に配置されます。これにより、[レイアウトシフト](/cls/#layout-shifts-in-detail)が発生します。

[Cookieの通知](/cookie-notice-best-practices/)、特にページの上部に配置される通知は、この問題の一般的な例です。読み込み時にこのようなレイアウトシフトを引き起こすことが多い他のページ要素としては、広告と埋め込みがあります。

#### 特定

Lighthouseの「大きいレイアウトシフトの回避」監査は、シフトしたページ要素を特定します。このデモの結果は次のようになります。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png", alt="Lighthouseの「大きいレイアウトシフトの回避」監査", width="800", height="500" %}

Cookie通知自体は読み込み時にシフトしないため、Cookie通知はこれらの調査結果に記載されていません。通知の下にあるページの項目 (つまり、 `div.hero`と`article`) がシフトします。レイアウトシフトの特定と修正の詳細については、[レイアウトシフトのデバッグ](/debugging-layout-shifts)を参照してください。

{% Aside %}

Lighthouseは、「ページの読み込み」イベントまでのページのパフォーマンスのみを分析します。Cookieのバナー、広告、およびその他のウィジェットは、ページが読み込まれるまで読み込まれない場合があります。これらのレイアウトシフトは、Lighthouseによって警告されていなくても、ユーザーに影響します。

{% endAside %}

#### 修正

絶対位置または固定位置を使用して、ページの下部にCookie通知を配置します。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png", alt="ページの下部に表示されるCookie通知", width="800", height="656" %}

変更前

```css
.banner {
  position: sticky;
  top: 0;
}
```

変更後

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

このレイアウトシフトを修正する別の方法は、画面上部のCookie通知用にスペースを予約することです。このアプローチも同様に効果的です。詳細については、 [Cookie通知のベストプラクティス](/cookie-notice-best-practices/)を参照してください。

{% Aside %}

Cookie通知は、読み込み時にレイアウトシフトをトリガーする複数のページ要素の1つです。これらのページ要素を詳しく確認できるように、以降のデモ手順にはCookieの通知が含まれていません。

{% endAside %}

## 画像

### 画像とLargest Contentful Paint (LCP)

通常、画像はページのLargest Contentful Paint (LCP) 要素です。[LCP要素になりうる他のページ要素](/lcp/#what-elements-are-considered)には、テキストブロックと動画ポスター画像が含まれます。 LCP要素が読み込まれる時間によってLCPが決まります。

ページのLCP要素は、ページが最初に表示されたときにユーザーに表示されるコンテンツに応じて、ページの読み込みごとに異なる可能性があることに注意してください。たとえば、このデモでは、Cookie通知の背景、ヒーロー画像、および記事のテキストが、潜在的なLCP要素の一部です。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png", alt="さまざまなシナリオでページのLCP要素を強調表示した図。", width="800", height="498" %}

サンプルサイトでは、Cookie通知の背景画像は実際には大きな画像です。 LCPを改善するには、画像を読み込んで効果を作成するのではなく、CSSでグラデーションをペイントすることができます。

#### 修正

画像ではなくCSSグラデーションを使用するように`.banner` CSSを変更します。

前：

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

後：

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```

### 画像とレイアウトシフト

画像が読み込まれると、ブラウザーで画像のサイズを決定できます。ページがレンダリングされた後に画像の読み込みが発生し、画像のスペースが予約されていない場合は、画像が表示されたときにレイアウトシフトが発生します。このデモでは、ヒーロー画像が読み込まれたときにレイアウトシフトが発生しています。

{% Aside %}レイアウトシフトを引き起こす画像の現象は、画像の読み込みが遅い状況でよりはっきりとします。たとえば、接続が遅い場合や、ファイルサイズが特に大きい画像を読み込む場合などです。 {% endAside %}

#### 特定

明示的な`width`と`height`ない画像を特定するために、Lighthouseの「画像要素に明示的な幅と高さがある」監査を使用します。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png", alt="Lighthouseの「画像要素に明示的な幅と高さがある」監査", width="800", height="274" %}

この例では、ヒーロー画像と記事画像のいずれにも`width`と`height`属性がありません。

#### 修正

レイアウトシフトを避けるために、これらの画像に`width`と`height`属性を設定します。

変更前

```html
<img src="https://source.unsplash.com/random/2000x600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" alt="image to load in">
```

変更後

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="image to load in">
```

<figure>{% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMGOlGhKnNHef2py.mp4" %}<figcaption>これで、レイアウトシフトが発生せずに画像が読み込まれます。</figcaption></figure>

{% Aside %}画像を読み込む別のアプローチは、`width`および`height`属性を指定するとともに、[`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)および[`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)属性を使用することです。これには、さまざまなサイズの画像をさまざまなデバイスに提供できるというパフォーマンス上の利点があります。詳細については、[レスポンシブ画像の提供](/serve-responsive-images/)を参照してください。 {% endAside %}

## フォント

フォントはテキストのレンダリングを遅らせ、レイアウトシフトを引き起こす可能性があります。結果として、フォントを迅速に提供することが重要です。

### 遅延テキストレンダリング

デフォルトでは、関連付けられたWebフォントがまだ読み込まれていない場合、ブラウザーではテキスト要素がすぐにレンダリングされません。[これは、「スタイルなしテキストのフラッシュ」(FOUT)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) を防ぐために行われます。多くの場合、これにより[First Contentful Paint (FCP) が](/fcp)遅延します。状況によっては、Largest Contentful Paint (LCP) も遅延します。

{% Aside %}

デフォルトでは、ChromiumベースおよびFirefoxブラウザーでは、関連付けられたWebフォントが読み込まれていない場合、[最大3秒間テキストレンダリングをブロック](https://developers.google.com/web/updates/2016/02/font-display)します。Safariはテキストのレンダリングを無期限にブロックします。[ブロック期間](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline)は、ブラウザーがWebフォントを要求した時点から始まります。ブロック期間の終わりまでにフォントがまだ読み込まれていない場合、ブラウザーはフォールバックフォントを使用してテキストをレンダリングし、使用可能になった時点でWebフォントと入れ替えます。

{% endAside %}

### レイアウトシフト

フォントスワップは、ユーザーにコンテンツをすばやく表示する点で優れていますが、レイアウトシフトが発生する可能性があります。これらのレイアウトシフトは、Webフォントとそのフォールバックフォントがページ上で異なる量のスペースを占める場合に発生します。類似した比率のフォントを使用すると、これらのレイアウトシフトのサイズを最小限に抑えることができます。

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="フォントスワップによるレイアウトシフトを示す図", width="800", height="452" %} <figcaption>この例では、フォントスワップにより、ページ要素が5ピクセル上にシフトしました。</figcaption></figure>

#### 特定

特定のページに読み込まれているフォントを確認するには、DevToolsの [**ネットワーク****] タブを開き、フォント**でフィルタリングします。フォントは大きなファイルになる可能性があるため、通常、使用するフォントの数を減らす方がパフォーマンスが向上します。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png", alt="DevToolsに表示されるフォントのスクリーンショット", width="800", height="252" %}

フォントが要求されるまでにかかる時間を確認するには、[**タイミング**] タブをクリックします。フォントが要求されるのが早いほど、早い段階でフォントを読み込んで使用できます。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png", alt="DevToolsの [タイミング] タブのスクリーンショット", width="800", height="340" %}

フォントの要求チェーンを表示するには、[**イニシエーター**] タブをクリックします。一般的に、要求チェーンが短いほど、フォントを早く要求できます。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png", alt="DevToolsの [イニシエーター] タブのスクリーンショット", width="800", height="189" %}

#### 修正

このデモでは、Google Fonts APIを使用しています。oogle Fontsには、`<link>`タグまたは`@import`ステートメントを使用してフォントを読み込むオプションがあります。`<link>`コードスニペットには、`preconnect`リソースヒントが含まれています。`@import`バージョンを使用するよりもスタイルシートの配信が速くなります。

概念としては、[リソースヒント](https://www.w3.org/TR/resource-hints/#resource-hints)は、特定の接続を設定したり、特定のリソースをダウンロードしたりする必要があることをブラウザーに示す方法と考えることができます。その結果、ブラウザーはこれらのアクションを優先します。リソースヒントを使用するときには、特定のアクションに優先順位を付けると、他のアクションからブラウザーリソースが奪われることに注意してください。したがって、リソースのヒントは、すべてに設定するのではなく、慎重に使用する必要があります。詳細については、[ネットワーク接続を早期に確立して、認知されるページ速度を向上させる](/preconnect-and-dns-prefetch/)を参照してください。

次の`@import`ステートメントをスタイルシートから削除します。

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

`<link>`タグをドキュメントの`<head>`に追加します。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

これらのlinkタグは、Google Fontsが使用するオリジンへの早期接続を確立し、MontserratとRobotoのフォント宣言を含むスタイルシートを読み込むようにブラウザーに指示します。これらの`<link>`タグは、できるだけ早く`<head>`に配置する必要があります。

{% Aside %}

Google Fontsからフォントのサブセットのみを読み込むには、[`?text=`](https://developers.google.com/fonts/docs/getting_started) APIパラメーターを追加します。たとえば、`?text=ABC`は、「ABC」のレンダリングに必要な文字のみを読み込みます。これは、フォントのファイルサイズを小さくするための良い方法です。

{% endAside %}

## アニメーション

アニメーションがWeb Vitalsに影響する主な方法は、アニメーションがレイアウトシフトを引き起こす場合です。[レイアウトをトリガーするアニメーション](/animations-guide/#triggers)と、ページ要素を移動する「アニメーションのような」効果があるアニメーションの2種類のアニメーションは、使用することを避けるようお勧めします。通常、これらのアニメーションは、[`transform`](https://developer.mozilla.org/docs/Web/CSS/transform)、[`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity)、[`filter`](https://developer.mozilla.org/docs/Web/CSS/filter)などのCSSプロパティを使用して、よりパフォーマンスの高い同等のアニメーションに置き換えることができます。詳細については、[高パフォーマンスCSSアニメーションを作成する方法](/animations/)を参照してください。

### 特定

灯台の「合成されていないアニメーションを避ける」監査は、パフォーマンスの低いアニメーションを特定するのに役立つ場合があります。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png", alt="Lighthouseの「合成されていないアニメーションの回避」監査", width="512", height="132" %}

{% Aside 'caution' %}

Lighthouseの「合成されていないアニメーションの回避」監査では、パフォーマンスの低い*CSSアニメーション*のみが識別されます。JavaScriptベースのアニメーション (たとえば、[`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) を使用した要素の「アニメーション化」) はパフォーマンスに悪影響を及ぼしますが、この監査では警告されません。

{% endAside %}

### 修正

`slideIn`アニメーションシーケンスを変更して`margin-left`プロパティを遷移させるのではなく、 `transform: translateX()`

変更前

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

変更後

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```

## 重要なCSS

スタイルシートはレンダリングをブロックしています。つまり、ブラウザーがスタイルシートを検出し、ブラウザーがスタイルシートをダウンロードして解析するまでは、ブラウザーで他のリソースのダウンロードが停止します。これにより、LCPが遅延する可能性があります。パフォーマンスを向上させるには、[未使用のCSSを削除し](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/)、[重要なCSSをインライン化{/a1し、](/extract-critical-css/)[重要で}ないCSSを延期](/defer-non-critical-css/#optimize)することを検討してください。

## まとめ

さらなる改善の余地はまだありますが (たとえば、[画像圧縮](/use-imagemin-to-compress-images/)を使用して画像をより迅速に配信する)、これらの変更により、このサイトのWeb Vitalsが大幅に改善されました。これが実際のサイトである場合、次のステップは、[実際のユーザーからパフォーマンスデータを収集](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data)して、[ほとんどのユーザーのWeb Vitalsのしきい値を満たしている](/vitals-measurement-getting-started/#data-interpretation)かどうかを評価することです。Web Vitalsの詳細については、[Web Vitalsの詳細](/collection/)を参照してください。
