---
layout: post
title: 'prefers-color-scheme: 昔馴染みのダークモード'
subhead: 宣伝し過ぎ？それとも必要性？ダークモードとユーザーのためのサポート方法について学習しましょう！
authors:
  - thomassteiner
date: 2019-06-27
updated: 2020-08-02
hero: image/admin/dgDcIJUyuWB5xNn9CODd.jpg
hero_position: bottom
alt: 夜の山のシルエット写真、Nathan Anderson（Unsplash）撮影。
description: 現在、多くのデバイスがオペレーティングシステム全体でダークモードまたはダークテーマのエクスペリエンスをサポートしています。この記事では、Web ページでダークモードをサポートする方法を説明し、ベストプラクティスを提示した上で、Web 開発者が特定の Web ページでオペレーティングシステムレベルの設定を上書きする方法をユーザーに提供できる dark-mode-toggle というカスタム要素を紹介します。
tags:
  - blog
  - css
feedback:
  - api
---

## はじめに

{% Aside 'note' %}私はダークモードのこれまでの経緯と理論について多くの背景的調査を行いました。ダークモードの使用のみに興味がある場合は、[このセクションをスキップ](#activating-dark-mode-in-the-operating-system)してください。{% endAside %}

### *ダークモード*が登場する前のダークモード

<figure data-float="right">{% Img src="image/admin/fmdRPm6K5SXiIRLgyz4y.jpg", alt="グリーンスクリーンのコンピューターのモニター", width="233", height="175" %} <figcaption>グリーンスクリーン（<a href="https://commons.wikimedia.org/wiki/File:Compaq_Portable_and_Wordperfect.JPG">出典</a>）</figcaption></figure>

ダークモードにおいては、一回りして戻ってきました。パーソナルコンピューターが台頭した当初、ダークモードは選択ではなく、事実でしかありませんでした。モノクロ <abbr title="Cathode-Ray Tube">CRT</abbr> コンピューターのモニターは、蓄光スクリーン上で電子線を発することによって機能し、初期の CRT で使用されていた蛍光体は緑色でした。テキストは緑、残りの画面は黒で表示されていたため、これらのモデルは[グリーンスクリーン](https://commons.wikimedia.org/wiki/File:Schneider_CPC6128_with_green_monitor_GT65,_start_screen.jpg)を呼ばれていました。

<figure data-float="left">{% Img src="image/admin/l9oDlIO59oyJiXVegxIV.jpg", alt="白黒のワープロ", width="222", height="175" %} <figcaption>白黒（<a href="https://www.youtube.com/watch?v=qKkABzt0Zqg">出典</a>）</figcaption></figure>

その後登場したカラー CRT は、赤、緑、および青の蛍光体を使用することで表現された多色表示でした。3 色すべての蛍光体を同時に発光することで白を作り出していました。より洗練された <abbr title="What You See Is What You Get">WYSIWYG</abbr> 系[デスクトップパブリッシング](https://en.wikipedia.org/wiki/Desktop_publishing)の登場により、実物の用紙に似せて仮想文書を作成するという考えに人気が集まりました。

<figure data-float="right">{% Img src="image/admin/lnuLLcQzIF7r08lt479k.png", alt="WorldWideWeb ブラウザの白黒の Webページ", width="233", height="175" %} <figcaption>WorldWideWeb ブラウザ（<a href="https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png">出典</a>）</figcaption></figure>

これがデザイントレンドとしての*白黒*の始まりであり、このトレンドは[初期のドキュメントベースの Web](http://info.cern.ch/hypertext/WWW/TheProject.html) に引き継がれました。史上初のブラウザである[WorldWideWeb](https://en.wikipedia.org/wiki/WorldWideWeb)（[CSS はまだ発明されていなかった](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#History)ころ）は、この方法で [Web ページを表示していました](https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png)。豆知識: その次に登場した 2 番目のブラウザである [Line Mode Browser](https://en.wikipedia.org/wiki/Line_Mode_Browser)（ターミナルベースのブラウザ）は、黒背景に緑文字が使用されていました。最近の Web ページと Web アプリは通常、明るい背景に暗いテキストを使用して設計されています。これは、[Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css) を含むユーザーエージェントのスタイルシートにもハードコーディングされているベースラインの前提です。

<figure data-float="left">{% Img src="image/admin/zCdyRdnAnbrB7aAB0TQi.jpg", alt="ベッドに寝転がって使用されるスマートフォン", width="262", height="175" %} <figcaption>ベッドで使用するスマートフォン（出典: Unsplash）</figcaption></figure>

CRT の時代は過ぎ去りました。コンテンツの消費と作成は、バックライト付き <abbr title="液晶表示装置">LCD</abbr> または省エネ <abbr title="アクティブマトリックス有機発光ダイオード">AMOLED</abbr> スクリーンを使用するモバイルデバイスにシフトしています。小型で持ち運びに便利なコンピューター、タブレット、スマートフォンによって、使用パターンも新しくなっています。Web サーフ、趣味のコーディング、ハイエンドゲームなどのレジャータスクは、一日の終わりにかけて薄暗い環境で行われることが頻繁です。夜にはベッドに入ってデバイスを楽しむことさえあります。より多くの人が暗い環境でデバイスを使用するにつれ、*ライトオンダーク*のルーツに戻るという考えに人気が集まっているのです。

### なぜダークモードなのか

#### 美的理由によるダークモード

[ダークモードが好きな理由や使用したい理由](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)を尋ねると、最初に*「目に優しい」*、次に*「エレガントで美しい」*という回答に人気が集まります。Appleは、 「[ダークモードの開発者向けドキュメント](https://developer.apple.com/documentation/appkit/supporting_dark_mode_in_your_interface)」において*「ほとんどのユーザーは、それぞれの美的センスに応じて明るい外観と暗い外観のどちらを有効にするかを選択しており、周囲の照明条件とは関係がない可能性がある」*と明示的に述べています。

{% Aside 'note' %} 「[ダークモードを欲する理由とその使用方法に関するユーザー調査](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)」でさらに詳細をご覧ください。 {% endAside %}

<figure data-float="right">{% Img src="image/admin/WZ9I5g1YGG6S1TjygEIq.png", alt="「White on Black」モードを使った MacOS System 7 のCloseView", width="193", height="225" %} <figcaption>System 7 CloseView（<a href="https://archive.org/details/mac_Macintosh_System_7_at_your_Fingertips_1992">出典</a>）</figcaption></figure>

#### アクセシビリティツールとしてのダークモード

ダークモードを実際に*必要*とし、それを別のアクセシビリティツールとして使用する人もいます。たとえば、ロービジョンのユーザーなどです。私が見つけたそのようなアクセシビリティツールの最初の出現は、[System 7](https://en.wikipedia.org/wiki/System_7) の *CloseView* 機能であり、これは*白地に黒*と*黒地に白*を切り替えることができました。System 7 はカラーをサポートしていましたが、デフォルトのユーザーインターフェイスは白黒のままでした。

これらの反転ベースの実装は、色が導入されるとその弱点を示しました。Szpiro *et.al* による[ロービジョンユーザーがコンピューティングデバイスにどのようにアクセスしているか](https://dl.acm.org/citation.cfm?id=2982168)に関するユーザー調査では、インタビューしたすべてのユーザーが反転画像を嫌っているが、多くのユーザーが暗い背景に明るい文字表示を好むことがわかりました。Appleは、画像、メディア、および暗い色のスタイルを使用する一部のアプリを除いてディスプレイの色を反転させる[スマート反転](https://www.apple.com//accessibility/iphone/vision/)と呼ばれる機能で、このユーザーの好みに対応しています。

特殊なロービジョンに、デジタル眼精疲労としても知られている、「*コンピュータ（デスクトップ、ノートパソコン、タブレットを含む）やその他の電子ディスプレイ（スマートフォンや電子書籍リーダーなど）の使用に関連付けられる目と視覚の複合問題*」として[定義](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1475-1313.2011.00834.x)されるコンピュータビジョン症候群があります。青少年による特に夜間の電子機器の使用によって、睡眠時間の短縮、入眠潜時の長時間化、睡眠不足の増加というリスクが増加するということが[提示](https://bmjopen.bmj.com/content/5/1/e006748)されています。さらに、ブルーライトへの暴露が[概日リズム](https://en.wikipedia.org/wiki/Circadian_rhythm) と睡眠サイクルの調整に関係していることが広く[報告](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4254760/) されており、[Rosenfield による調査によると](https://www.college-optometrists.org/oip-resource/computer-vision-syndrome--a-k-a--digital-eye-strain.html)、不規則な光の環境は睡眠不足につながる可能性があり、気分やタスクのパフォーマンスに影響を与える可能性があるとされています。こういった悪影響を抑制するには、iOS の[ナイトシフト](https://support.apple.com/HT207570)や Android の[ナイトライト](https://support.google.com/pixelphone/answer/7169926?)といった機能でディスプレイの色温度を調整してブルーライトを削減したり、ダークテーマやダークモードを通じて、一般的に明るい光や不規則な光を避けたりすることができます。

#### AMOLED 画面でのダークモードによる省電力

最後に、ダークモードは <abbr title="アクティブマトリックス有機発光ダイオード">AMOLED</abbr> 画面で*多く*のエネルギーを節約することが知られています。YouTube などの人気のある Google アプリに焦点を当てた Android のケーススタディでは、電力を最大 60％ 節約できることが示されています。以下の動画では、これらのケーススタディとアプリごとの省電力について詳しく説明されています。

<figure data-size="full">{% YouTube id='N_6sPd0Jd3g', startTime='305' %}</figure>

## OS でダークモードをアクティブにする

ダークモードが多くのユーザーにとって非常に重要である理由の背景を説明したので、それをどのようにサポートできるかを確認しましょう。

<figure data-float="left">{% Img src="image/admin/Yh6SEoWDK1SbqcGjlL6d.png", alt="Android Q ダークモード設定", width="218", height="250" %} <figcaption>Android Q ダークテーマ設定</figcaption></figure>

ダークモードまたはダークテーマをサポートするオペレーティングシステムには、通常、設定のどこかでアクティブ化するオプションがあります。macOS Xでは、システム環境設定の［*全般*］セクションの［*外観*］（<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lUAnDhiGiZxigDbCqfn1.png'%20%7C%20imgix%20%7D%7D">スクリーンショット</a>）にあり、Windows 10 では、［*色*］セクションの［*色を選択する*］（<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ahr8nkFttRPCe4RH8IEk.png'%20%7C%20imgix%20%7D%7D">スクリーンショット</a>）にあります。Android Q の場合は、［*ディスプレイ*］の下の［*ダークテーマ*］トグルスイッチ（<a href="%7B%7B%20'image/admin/Yh6SEoWDK1SbqcGjlL6d.png'%20%7C%20imgix%20%7D%7D">スクリーンショット</a>）にあり、iOS 13 の場合は、設定の［*ディスプレイと明るさ*］セクションの［*外観*］（<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K0QTu4Elw1ETabtoJjZ1.jpg'%20%7C%20imgix%20%7D%7D">スクリーンショット</a>）で変更できます。

## `prefers-color-scheme` メディアクエリ

先に進む前に、最後にもう 1 つ理論を説明します。[メディアクエリ](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries)を使用すると、作成者は、レンダリングされるドキュメントに関係なく、ユーザーエージェントまたはディスプレイデバイスをテストし、値または機能をクエリできます。これらは、CSS `@media` ルールで使用され、条件的にドキュメントにスタイルを適用します。また、HTML や JavaScript など、他のさまざまなコンテキストや言語でも使用されます。[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/) では、いわゆるユーザー設定メディア機能が導入されています。これは、サイトがユーザーの好みのコンテンツ表示方法を検出する方法です。

{% Aside 'note' %} ☝️確立されたユーザー設定メディア機能は、ページ上の動きを少なくしたいという希望を検出できる `prefers-reduced-motion` です。私は以前に<a href="https://developers.google.com/web/updates/2019/03/prefers-reduced-motion" data-md-type="link">`prefers-reduced-motion`について書いたことがあります</a>。 {% endAside %}

[`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) メディア機能は、ユーザーがページに明るい色または暗い色のテーマを使用するように要求したかどうかを検出するために使用されます。次の値で動作します。

- `light`: ユーザーが明るいテーマ（明るい背景に暗いテキスト）を持つページを好むことをシステムに通知したことを示します。
- `dark`: ユーザーが暗いテーマ（暗い背景に明るいテキスト）のページを好むことをシステムに通知したことを示します。

{% Aside 'note' %} 以前のバージョンの仕様には、3 番目の値として `no-preference` 含まれていました。これは、ユーザーがシステムに優先順位を知らせていないことを示すためのものでした。これを実装するブラウザがこれまで存在しなかったため、この値は仕様から[削除されています](https://github.com/w3c/csswg-drafts/issues/3857#issuecomment-634779976)。 {% endAside%}

## ダークモードのサポート

### ダークモードがブラウザでサポートされているかどうかを確認する

ダークモードはメディアクエリを通じて報告されるため、メディアクエリ `prefers-color-scheme` が一致するかどうかを確認することで、現在のブラウザがダークモードをサポートしているかどうかを簡単に確認できます。値を含めていないことに注意してください。ただし、メディアクエリだけが一致するかどうかを純粋に確認してください。

```js
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Dark mode is supported');
}
```

執筆時点では、 `prefers-color-scheme` は、バージョン 76 以降の Chrome と Edge、バージョン 67 以降の Firefox、および macOS のバージョン 12.1 以降と iOS のバージョン 13以降の Safari で、デスクトップとモバイル（利用可能な場合）の両方でサポートされています。他のすべてのブラウザについては、「[サポートテーブルを使用できますか](https://caniuse.com/#feat=prefers-color-scheme)」をご覧ください。

{% Aside 'note' %} 古いブラウザにダークモードのサポートを追加する [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) というカスタム要素があります。それについては、[この記事の後の方で](#the-lessdark-mode-togglegreater-custom-element)説明します。 {% endAside%}

### リクエスト時にユーザーの好みについて学ぶ

[`Sec-CH-Prefers-Color-Scheme`](/user-preference-media-features-headers/) クライアントヒントヘッダーを使用すると、サイトはリクエスト時にオプションでユーザーの配色設定を取得できるため、サーバーは適切な CSS をインライン化でき、したがって誤ったカラーテーマのフラッシュを回避できます。

### 実際のダークモード

最後に、ダークモードのサポートが実際にどのように見えるかを見てみましょう。「[ハイランダー](https://en.wikipedia.org/wiki/Highlander_(film))」と同じように、ダークモードでは *1 つしか勝者はありません*。ダークかライトのいずれかで、両方となることは絶対になりません！なぜこれを言及しているのでしょうか。この事実は読み込み戦略に　　影響を与えるからです。**ユーザーが現在使用していないモード用の CSS を重要なレンダリングパスでダウンロードするように強制しないでください。**読み込み速度を最適化するために、以下の推奨事項を実践で示すサンプルアプリ用の CSS を 3 つに分割し、[重要ではない CSS を延期](/defer-non-critical-css/)させています。

- `style.css`: サイトで広く使用されている一般的なルールを含む
- `dark.css`: ダークモードに必要なルールのみを含む
- `light.css`: ライトモードに必要なルールのみを含む

### 読み込み戦略

後者の 2 つ（`light.css` と `dark.css`）は、`<link media>` クエリを使用して条件的に読みこまれます。最初は、[すべてのブラウザでは `prefers-color-scheme`](https://caniuse.com/#feat=prefers-color-scheme) はサポートされないようになっているため（[上記のパターン](#finding-out-if-dark-mode-is-supported-by-the-browser)で検出）、デフォルトの `light.css` ファイルを非常に小さなスクリプトで条件的に挿入される `<link rel="stylesheet">` 要素を通じて読み込むことで、動的に処理しています（light は適当に選択したものであり、dark をデフォルトのフォールバックエクスペリエンスに指定することも可能です）。[スタイル設定されていないコンテンツのフラッシュ](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)を避けるために、`light.css` が読み込まれるまで、コンテンツを非表示にしています。

```html
<script>
  // If `prefers-color-scheme` is not supported, fall back to light mode.
  // In this case, light.css will be downloaded with `highest` priority.
  if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none';
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="/light.css" onload="document.documentElement.style.display = \'\'">',
    );
  }
</script>
<!--
  Conditionally either load the light or the dark stylesheet. The matching file
  will be downloaded with `highest`, the non-matching file with `lowest`
  priority. If the browser doesn't support `prefers-color-scheme`, the media
  query is unknown and the files are downloaded with `lowest` priority (but
  above I already force `highest` priority for my default light experience).
-->
<link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />
<link
  rel="stylesheet"
  href="/light.css"
  media="(prefers-color-scheme: light)"
/>
<!-- The main stylesheet -->
<link rel="stylesheet" href="/style.css" />
```

### スタイルシートアーキテクチャ

私は [CSS 変数](https://developer.mozilla.org/docs/Web/CSS/var)を最大限に活用しているため、汎用の `style.css` を汎用とし、すべてのライトモードまたはダークモードのカスタマイズは、他の 2 つの `dark.css` と `light.css` ファイルで行っています。以下に実際のスタイルを抜粋していますが、全体的なアイデアを伝えるには十分なはずです。私は 2 つの  `-⁠-⁠color` と `-⁠-⁠background-color` 変数を宣言しています。これらは基本的に*ダークオンライト*と*ライトオンダーク*の基準となるテーマを作成する変数です。

```css
/* light.css: 👉 dark-on-light */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
}
```

```css
/* dark.css: 👉 light-on-dark */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
}
```

私の `style.css` では、これらの変数を `body { … }` ルールで使用します。[`:root` CSS疑似クラス](https://developer.mozilla.org/docs/Web/CSS/:root)（HTML で `<html>` 要素を表し、具体性が高いことを除けば `html` セレクターと同一のセレクター）で定義されているため、カスケードダウンし、したがってグローバル CSS を宣言するのに役立ちます。

```css
/* style.css */
:root {
  color-scheme: light dark;
}

body {
  color: var(--color);
  background-color: var(--background-color);
}
```

上記のコードサンプルでは、[`color-scheme`](https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme) にスペースで区切られた `light dark` という値があることに気付いたと思います。

これにより、アプリがサポートするカラーテーマがブラウザに通知され、ユーザーエージェントスタイルシートの特別なバリエーションをアクティブ化できるようになります。これは、たとえば、ブラウザに暗い背景と明るいテキストでフォームフィールドをレンダリングさせたり、スクロールバーを調整したり、テーマ対応のハイライトカラーを有効にしたりするのに役立ちます。`color-scheme` の正確な詳細は、「[CSS Color Adjustment Module Level 1](https://drafts.csswg.org/css-color-adjust-1/)」で指定されています。

{% Aside 'note' %} 🌒 [`color-scheme` が実際に何をするか](/color-scheme/)についてさらにお読みください。 {% endAside %}

それ以外のすべては、私のサイトの重要な項目に対して CSS 変数を定義するだけの問題です。ダークモードで作業する場合、意味的にスタイルを整理すると非常に役立ちます。たとえば、変数を `-⁠-⁠highlight-yellow` ではなく、`-⁠-⁠accent-color` と呼ぶことを検討してください。これは、「黄色」がダークモードでは実際には黄色ではなかったり、その逆の場合があったりするためです。以下は、私の例で使用しているいくつかの変数の例です。

```css
/* dark.css */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
  --link-color: rgb(0, 188, 212);
  --main-headline-color: rgb(233, 30, 99);
  --accent-background-color: rgb(0, 188, 212);
  --accent-color: rgb(5, 5, 5);
}
```

```css
/* light.css */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
  --link-color: rgb(0, 0, 238);
  --main-headline-color: rgb(0, 0, 192);
  --accent-background-color: rgb(0, 0, 238);
  --accent-color: rgb(250, 250, 250);
}
```

### 完全な例

次の [Glitch](https://dark-mode-baseline.glitch.me/) の埋め込みでは、上記の概念を実践に導入した完全な例を見ることができます。特定の[オペレーティングシステムの設定](#activating-dark-mode-in-the-operating-system)でダークモードに切り替えて、ページがどのように反応するかを確認してください。

<div style="height: 900px; width: 100%;">
  {% IFrame {
    allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',
    src: 'https://glitch.com/embed/#!/embed/dark-mode-baseline?path=style.css&previewSize=100&attributionHidden=true'
  } %}
</div>

### 読み込みの影響

この例で作業して見ると、メディアクエリを介して `dark.css` と `light.css` を読み込むする理由がわかるかもしれません。ダークモードを切り替えてページをリロードしてみてください。現在一致していない特定のスタイルシートは引き続き読み込まれますが、優先度が最も低いため、現時点でサイトが必要とするリソースと競合することはありません。

{% Aside 'note' %} 😲 [一致しないメディアクエリでブラウザがスタイルシートをダウンロードする理由](https://blog.tomayac.com/2018/11/08/why-browsers-download-stylesheets-with-non-matching-media-queries-180513)について、さらに詳細をご覧ください。 {% endAside %}

<figure>{% Img src="image/admin/flTdLliru6GmqqlOKjNx.png", alt="ライトモードでダークモードの CSS が最低優先度でどのように読み込まれるかを示すネットワーク読み込み図", width="800", height="417" %} <figcaption>ライトモードのサイトは、ダークモードの CSS 最も低い優先度で読み込む。</figcaption></figure>

<figure>{% Img src="image/admin/IDs6Le0VBhHu9QEDdxL6.png", alt="ダークモードでライトモードの CSS が最低優先度でどのように読み込まれるかを示すネットワーク読み込み図", width="800", height="417" %} <figcaption>}ダークモードのサイトは、ライトモードのCSS を最も低い優先度で読み込む。</figcaption></figure>

<figure>{% Img src="image/admin/zJqu5k3TIgcZf1OHWWIq.png", alt="デフォルトのライトモードでダークモードの CSS が最低優先度でどのように読み込まれるかを示すネットワーク読み込み図", width="800", height="417" %} <figcaption><code>prefers-color-scheme</code> をサポートしていないブラウザでは、デフォルトのライトモードのサイトは、ダークモードの CSS 最も低い優先度で読み込む。</figcaption></figure>

### ダークモードの変更への対応

他のメディアクエリの変更と同様に、ダークモードの変更は JavaScript を介して適用できます。これを使用して、たとえば、 ページの[ファビコン](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#provide_great_icons_tiles)を動的に変更したり、Chrome の URL バーの色を決定する [`<meta name="theme-color">`](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera) を変更したりできます。上記の[完全な例](#full-example)はこれを実演しており、テーマの色とファビコンの変更を確認するために、[別のタブでデモ](https://dark-mode-baseline.glitch.me/)が開くようになっています。

```js
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    const darkModeOn = e.matches;
    console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
  });
```

Chromium 93 と Safari 15 において、この色は、`meta` テーマカラー要素の `media` 属性を使ったメディアクエリを基に調整できます。最初に一致するものが選択されます。たとえば、ライトモード用に 1 つの色を使用し、ダークモード用に別の色を使用することができます。この記事の執筆時点では、マニフェストでそれらを定義することはできません。[GitHub の w3c/manifest#975 の課題](https://github.com/w3c/manifest/issues/975)を参照してください。

```html
<meta
  name="theme-color"
  media="(prefers-color-scheme: light)"
  content="white"
/>
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

## ダークモードのデバッグとテスト

### DevTools で `prefers-color-scheme` をエミュレートする

オペレーティングシステム全体の配色を切り替えると、すぐに煩わしくなります。そのため、Chrome DevTools では、現在表示されているタブのみに影響するように、ユーザーの好みの配色をエミュレートできるようになりました。[Command メニュー](https://developer.chrome.com/docs/devtools/command-menu/)を開いて、「`Rendering`」と入力し、`Show Rendering` コマンドを実行して、**Emulate CSS media feature prefers-color-scheme** オプションを変更します。

<figure>{% Img src="image/admin/RIq2z6Ja1zSzfNTHic5z.png", alt="Chrome DevTools の［Rendering］タブにある［Emulate CSS media feature prefers-color-scheme］オプションのスクリーンショット", width="800", height="552" %}</figure>

### Puppeteer で `prefers-color-scheme` をスクリーンショットする

[Puppeteer](https://github.com/GoogleChrome/puppeteer/) は、[DevTools プロトコル](https://chromedevtools.github.io/devtools-protocol/)を介して Chrome または Chromium を制御するための高レベル API を提供する Node.js ライブラリです。[`dark-mode-screenshot`](https://www.npmjs.com/package/dark-mode-screenshot) を使用すると、ダークモードとライトモードの両方でページのスクリーンショットを作成できる Puppeteer スクリプトが提供されます。このスクリプトは 1 回限りで実行することも、継続的インテグレーション（CI）テストスイートの一部にすることもできます。

```bash
npx dark-mode-screenshot --url https://googlechromelabs.github.io/dark-mode-toggle/demo/ --output screenshot --fullPage --pause 750
```

## ダークモードのベストプラクティス

### 真っ白なものは避けましょう

気づいているかもしれませんが、私は真っ白を使用していません。代わりに、周囲の暗いコンテンツに対して光りやにじみがでることを防ぐために、少し暗い白を選択しています。`rgb(250, 250, 250)` のようにするとうまく機能します。

### 写真画像の色を染め替えて暗くする

以下の 2 つのスクリーンショットを比較すると、コアテーマが*ダークオンライト*から*ライトオンダーク*に変更されただけでなく、ヒーロー画像もわずかに異なって見えることがわかります。私の[ユーザー調査](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)によると、調査対象の大多数のユーザーは、ダークモードがアクティブな場合に、鮮やかさと明るさがわずかに劣る画像を好むことがわかっています。私はこれを*再色付け*と呼んでいます。

<div class="switcher">
  <figure>{% Img src="image/admin/qzzYCKNSwoJr9BBEQlR7.png", alt="ダークモードでわずかに暗くしたヒーロー画像。", width="800", height="618" %} <figcaption> ダークモードでわずかに暗くしたヒーロー画像。</figcaption></figure>
  <figure>{% Img src="image/admin/41RbLRZ5wzkoVnIRJkNl.png", alt="ライトモードの通常のヒーロー画像。", width="800", height="618" %} <figcaption> ライトモードの通常のヒーロー画像。</figcaption></figure>
</div>

再色付けは、画像に CSS フィルターを使用して実行できます。URL に `.svg` のないすべての画像に一致する CSS セレクターを使用します。これは、ベクター画像（アイコン）に画像（写真）とは異なる再色付け処理を行えることができるという考えです。これについては、[次の段落](#vector-graphics-and-icons)で説明します。もう一度 [CSS 変数](https://developer.mozilla.org/docs/Web/CSS/var)を使用しているところに注意してください。これにより、後でフィルターを柔軟に変更できます。

{% Aside 'note' %} 🎨 [ダークモードでの再色付け設定に関するユーザー調査](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)について、さらに詳細をご覧ください。 {% endAside %}

再色付けはダークモード、つまり `dark.css` がアクティブである場合にのみ必要であるため、`light.css` にはそれに対応するルールはありません。

```css
/* dark.css */
--image-filter: grayscale(50%);

img:not([src*='.svg']) {
  filter: var(--image-filter);
}
```

#### JavaScript を使用してダークモードの再色付け強度をカスタマイズする

すべてのユーザーが同じではなく、ダークモードのニーズも人によって異なります。上記で説明した再色付け方法に従って、[JavaScript を介して](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties#Values_in_JavaScript)グレースケールの強度を変更できるユーザー設定に簡単にすることができます。また `0%` に設定することで、再色付けを完全に無効にすることもできます。[`document.documentElement`](https://developer.mozilla.org/docs/Web/API/Document/documentElement) は、ドキュメントのルート要素への参照を提供することに注意してください。つまり [`:root` CSS 疑似クラス](https://developer.mozilla.org/docs/Web/CSS/:root)で参照できるのと同じ要素です。

```js
const filter = 'grayscale(70%)';
document.documentElement.style.setProperty('--image-filter', value);
```

### ベクトルのグラフィックとアイコンを反転させる

ベクター画像（私の例ではでは、`<img>` 要素を介して参照するアイコンとして使用されています）の場合、別の再色付け方法を使用してします。[調査](https://dl.acm.org/citation.cfm?id=2982168)によると、ユーザーは写真の反転を好まないことがわかっていますが、ほとんどのアイコンでは非常にうまく機能します。ここでも、CSS 変数を使用して、通常の状態と[`:hover`](https://developer.mozilla.org/docs/Web/CSS/:hover) 状態の反転量を決定しています。

<div class="switcher">
  <figure>{% Img src="image/admin/JGYFpAPi4233HrEKTQZp.png", alt="ダークモードではアイコンが反転する。", width="744", height="48" %} <figcaption> ダークモードではアイコンが反転する。</figcaption></figure>
  <figure>{% Img src="image/admin/W8AWbuqWthI6CfFsYunk.png", alt="ライトモードの通常のアイコン。", width="744", height="48" %} <figcaption> ライトモードの通常のアイコン。</figcaption></figure>
</div>

`dark.css` でのみアイコンを反転し、`light.css` では反転しないこと、そしてユーザーが選択したモードに応じて、アイコンがわずかに暗くまたは明るく表示されるように、2 つのケースで異なる反転強度を使用していることに注意してください。

```css
/* dark.css */
--icon-filter: invert(100%);
--icon-filter_hover: invert(40%);

img[src*='.svg'] {
  filter: var(--icon-filter);
}
```

```css
/* light.css */
--icon-filter_hover: invert(60%);
```

```css
/* style.css */
img[src*='.svg']:hover {
  filter: var(--icon-filter_hover);
}
```

### インライン SVGに `currentColor` を使用する

*インライン* SVG 画像の場合、[反転フィルターを使用](#invert-vector-graphics-and-icons)する代わりに、要素の `color` プロパティの値を表す [`currentColor`](https://developer.mozilla.org/docs/Web/CSS/color_value#currentColor_keyword) キーワードを利用できます。デフォルトで `color` 値を受け取らないプロパティで color 値を使用できます。便利なことに、 `currentColor` が [`fill` または `stroke` 属性](https://developer.mozilla.org/docs/Web/SVG/Tutorial/Fills_and_Strokes#Fill_and_Stroke_Attributes)の値として使用される場合、代わりに、color プロパティの継承値からその値を取得します。さらに、これは [`<svg><use href="…"></svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/use) でも機能するため、個別のリソースを持つことができ、 `currentColor` は引き続きコンテキストに適用されます。これは*インライン*または `<use href="…">` SVGのみで機能し、画像の `src` として、または何らかの方法で CSS を介して参照される SVG では機能しないことに注意してください。これは、以下のデモに適用されています。

```html/2
<!-- Some inline SVG -->
<svg xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
>
  […]
</svg>
```

<div style="height: 950px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://glitch.com/embed/#!/embed/dark-mode-currentcolor?path=light.css&amp;previewSize=100', title: 'Glitch の dark-mode-currentcolor' } %}</div>

### モード間のスムーズな移行

`color` と `background-color` の両方が[アニメーション対応 CSS プロパティ](https://www.quackit.com/css/css3/animations/animatable_properties/)であるため、ダークモードからライトモードへの切り替え、またはその逆の切り替えをスムーズに行うことができます。アニメーションの作成は、2 つのプロパティに対して 2 つの `transition` を宣言するだけです。以下の例は全体的なアイデアを示すものであり、[デモ](https://dark-mode-baseline.glitch.me/)で実際に体験することができます。

```css
body {
  --duration: 0.5s;
   --timing: ease;

  color: var(--color);
  background-color: var(--background-color);

  transition:
    color var(--duration) var(--timing),
    background-color var(--duration) var(--timing);
}
```

### ダークモードでのアートディレクション

一般に読み込みパフォーマンスの理由で、排他的に `<link>` 要素の `media` 属性で `prefers-color-scheme` を操作することを推奨していますが（スタイルシートのインラインでではなく）、実際に HTML コードで直接インラインで `prefers-color-scheme` を処理する必要がある場合があります。このような状況になるのがアートディレクションです。Web では、アートディレクションは、ページの全体的な視覚的な見栄えとそれが視覚的にどのように伝達するのか、気分を刺激するのか、機能を強調するのか、そして心理的にターゲットオーディエンスに魅力を与えるのかを操作します。

ダークモードでは、特定のモードで最適な画像と[画像の再色付け](#photographic-images)が*不十分でないか*を判断するのは設計者の判断です。`<picture>` 要素と一緒に使用すると、表示する画像の `<source>` を `media` 属性に依存させることができます。以下の例では、ダークモードを左半球、ライトモードまたは優先順位が指定されていない場合を右半球に示し、他のすべての場合もデフォルトで右半球に示しています。もちろん、これは純粋に説明の目的でです。デバイスのダークモードを切り替えて、違いを確認してください。

```html
<picture>
  <source srcset="western.webp" media="(prefers-color-scheme: dark)" />
  <source srcset="eastern.webp" media="(prefers-color-scheme: light)" />
  <img src="eastern.webp" />
</picture>
```

<div style="height: 600px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://glitch.com/embed/#!/embed/dark-mode-picture?path=index.html&amp;previewSize=100', title: 'Glitch の dark-mode-picture '} %}</div>

### ダークモードで、オプトアウトを追加する

上記の「[ダークモードの理由](#why-dark-mode)」セクションで説明したように、ダークモードはほとんどのユーザーにとって美的な選択です。そのため、一部のユーザーは実際にはオペレーティングシステムの UI をダークモードにしても、Web ページはを以前と同じように表示することを望んでいる可能性もあります。そこで、`prefers-color-scheme` を介してブラウザが送信するシグナルに従いつつも、オプションでユーザーがシステムレベルの設定を上書きできるようにすることが、優れたパターンと言えます。

#### `<dark-mode-toggle>` カスタム要素

もちろん、このためのコードを自分で作成することもできますが、ちょうどこの目的のために私が作成した既製のカスタム要素（Web コンポーネント）を使用することもできます。これは [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) と呼ばれ、完全にカスタマイズできるトグル（ダークモード: オン/オフ）またはテーマスイッチャー（テーマ: ライト/ダーク）をページに追加します。以下のデモは、動作中の要素を示しています（[上記](https://dark-mode-currentcolor.glitch.me/)の[他の](https://dark-mode-picture.glitch.me/)すべての[例](https://dark-mode-baseline.glitch.me/)でも🤫こっそり挿入しています）。

```html
<dark-mode-toggle
    legend="Theme Switcher"
    appearance="switch"
    dark="Dark"
    light="Light"
    remember="Remember this"
></dark-mode-toggle>
```

<div class="switcher">
  <figure>{% Img src="image/admin/Xy3uus69HnrkRPO4EuRu.png", alt="ライトモードの <dark-mode-toggle>。", width="140", height="76" %} <figcaption> ライトモードの <code><dark-mode-toggle></code></figcaption></dark-mode-toggle></figure>
  <figure>{% Img src="image/admin/glRVRJpQ9hMip6MbqY9N.png", alt="ダークモードの <dark-mode-toggle>。", width="140", height="76" %} <figcaption> ダークモードの <code><dark-mode-toggle></code> 。</figcaption></dark-mode-toggle></figure>
</div>

下のデモの右上にあるダークモードコントロールをクリックまたはタップしてみてください。3 番目と 4 番目のコントロールのチェックボックスをオンにすると、ページを再読み込みしてもモード選択が記憶されることを確認できます。これにより、訪問者はオペレーティングシステムをダークモードに保ちながら、サイトをライトモードで楽しむことができ、その逆も可能です。

<div style="height: 800px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html' } %}</div>

## まとめ

ダークモードでの作業とサポートは楽しく、新しいデザインの道を開いてくれます。一部の訪問者にとっては、サイトを持て余すか満足するかを分けるきっかけとなるかもしれません。いくつかの落とし穴があるため、注意深いテストが絶対に必要ですが、ダークモードは、すべてのユーザーを気にかけていることを示す絶好の機会です。この記事で言及したベストプラクティスと [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) カスタム要素のようなヘルパーは、素晴らしいダークモードエクスペリエンスを作成するあなた自身の能力に自信を与えてくれるはずです。作成したものやこの記事が役だったかどうか、または改善の提案などがあれば、[Twitter でお知らせください](https://twitter.com/tomayac)。お読みいただきありがとうございました！ 🌒

## 関連リンク

`prefers-color-scheme` メディアクエリに関するリソース:

- [Chrome Platform Status ページ](https://chromestatus.com/feature/5109758977638400)
- [Chromium bug](https://crbug.com/889087)
- [Media Queries Level 5 の仕様](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)

`color-scheme` メタタグと CSS プロパティに関するリソース:

- [`color-scheme` CSS プロパティとメタタグ](/color-scheme/)
- [Chrome Platform Status ページ](https://chromestatus.com/feature/5330651267989504)
- [Chromium bug](http://crbug.com/925935)
- [CSS Color Adjustment Module Level 1 の仕様](https://drafts.csswg.org/css-color-adjust-1/)
- [メタタグと CSS プロパティに関する GitHub の CSS WG の問題](https://github.com/w3c/csswg-drafts/issues/3299)
- [メタタグに関する GitHub の HTML WHATWG の問題](https://github.com/whatwg/html/issues/4504)

一般的なダークモードリンク:

- [Material Design の「Dark Theme」](https://material.io/design/color/dark-theme.html)
- [Web Inspector のダークモード](https://webkit.org/blog/8892/dark-mode-in-web-inspector/)
- [WebKit のダークモードサポート](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)
- [Apple の『Human Interface Guidelines』の「Dark Mode」](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/)

この記事で使用した背景調査記事:

- 「[What Does Dark Mode's "supported-color-schemes" Actually Do? 🤔](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d)」
- 「[Let there be darkness! 🌚 Maybe…](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)」
- 「[Re-Colorization for Dark Mode](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)」

## 謝辞

`prefers-color-scheme` メディア機能、 `color-scheme` CSS プロパティ、および関連するメタタグは 👏 [Rune Lillesveen](https://twitter.com/runeli) の実装作業によるものです。Rune は、[CSS Color Adjustment Module Level 1](https://drafts.csswg.org/css-color-adjust-1/) 仕様の共同編集者でもあります。この記事を徹底してレビューしてくれた [Lukasz Zbylut](https://www.linkedin.com/in/lukasz-zbylut/)、[Rowan Merewood](https://twitter.com/rowan_m)、[Chirag Desai](https://www.linkedin.com/in/chiragd/)、および [Rob Dodson](https://twitter.com/rob_dodson) に 🙏 感謝しています。[読み込み戦略](#loading-strategy)は、[Jake Archibald](https://twitter.com/jaffathecake) が発案しました。[Emilio Cobos Álvarez](https://twitter.com/ecbos_) は、適切な `prefers-color-scheme` 検出方法に私を導いてくれました。参照された SVG と `currentColor` に関するヒントは [Timothy Hatcher](https://twitter.com/xeenon) から得ました。最後に、様々なユーザー調査に匿名で参加し、この記事の推奨事項の形成に力を貸してくれた多数の皆様にお礼申し上げます。ヒーロー画像提供: [Nathan Anderson](https://unsplash.com/photos/kujXUuh1X0o)。
