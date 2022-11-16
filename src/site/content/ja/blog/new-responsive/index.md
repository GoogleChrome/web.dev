---
layout: post
title: 新しいレスポンシブ：コンポーネント主導のWebデザイン
subhead: レスポンシブWebデザインの新時代におけるマクロとミクロのレイアウトの制御。
authors:
  - una
description: ユーザー設定ベースのメディア機能、コンテナクエリ、および折りたたみ式画面などの新しい画面タイプのメディアクエリにより、レスポンシブWebデザインの新時代で使用できるようになります。
date: 2021-05-19
updated: 2021-05-26
hero: image/HodOHWjMnbNw56hvNASHWSgZyAf2/P5LtV5IubshVuDac8uKO.jpg
tags:
  - blog
  - css
  - layout
---

{% YouTube 'jUQ2-C5ZNRc' %}

## 最新のレスポンシブデザイン

通常、「レスポンシブデザイン」という用語は、モバイルサイズからタブレットサイズ、デスクトップサイズにデザインのサイズを変更するときに、メディアクエリを使用してレイアウトを変更することを考慮しています。

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/3KENjI9FiNARctTiKDak.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}

しかし、このレスポンシブデザインの概念は、ページレイアウトに表を使用するのと同じように、すぐに時代遅れになってしまう可能性があります。

ビューポートベースのメディアクエリは、強力なツールをいくつか提供しますが、十分な精巧さがありません。ユーザーのニーズに対応する機能や、レスポンシブスタイルをコンポーネント自体に挿入する機能が不足しています。

{% Aside %}この記事では、コンポーネントとは、カードやサイドバーなどの他の要素で構成される要素を含む要素を意味します。これらのコンポーネントは、当社のWebページを構成します。 {% endAside %}

グローバルビューポート情報を使用してコンポーネントのスタイルを設定できますが、それらはまだスタイルを所有しておらず、デザインシステムがコンポーネントベースでページベースではない場合は機能しません。

ただし、エコシステムは変化しており、急速に進化しています。CSSは進化しており、レスポンシブデザインの新時代が間近に迫っています。

これは約10年ごとに発生します。 10年前の2010年から2012年頃に、モバイルとレスポンシブデザインに大きな変化が見られ、CSS3が登場しました。

<figure>{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/IhVNwOMENjOT2eiIXuMg.png", alt="CSS styles timeline", width="800", height="211" %} <figcaption>出典: <a href="https://www.webdesignmuseum.org/web-design-history">Web Design Museum</a>. </figcaption></figure>

したがって、エコシステムは、CSSにかなり大きな変更を加える準備ができていることがわかります。ChromeとWebプラットフォーム全体のエンジニアは、レスポンシブデザインの次の時代に向けて、プロトタイピング、仕様作成、実装の開始を行っています。

これらの更新には、ユーザー設定ベースのメディア機能、コンテナクエリ、および折りたたみ式画面などの新しい画面タイプのメディアクエリが含まれます。

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/3yqBl9BQmGEVzDQU3Ivh.png", alt="ユーザー、コンテナ、およびフォームファクタに対応", width="800", height="248" %}

## ユーザーへの対応

新しいユーザー設定メディア機能により、ユーザー自身の特定の設定やニーズに合わせてWebエクスペリエンスをスタイリングすることができます。つまり、プリファレンスメディア機能を使用すると、ユーザーエクスペリエンスをユーザーエクスペリエンスに適合させることができます。

これらのユーザー設定メディア機能は次のとおりです。

- `prefers-reduced-motion`
- `prefers-contrast`
- `prefers-reduced-transparency`
- `prefers-color-scheme`
- `inverted-colors`
- その他多数

設定機能は、ユーザーがオペレーティングシステムで設定した環境設定を取得し、特にアクセシビリティが必要なユーザーにとって、より堅牢でパーソナライズされたWebエクスペリエンスを構築するのに役立ちます。

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/cGWnoAAwMTU7C3HOfYQl.png", alt="オペレーティングシステムのユーザー補助設定をオンにする", width="800", height="428" %}

### `prefers-reduced-motion`

[モーションを減らす](/prefers-reduced-motion/)ためにオペレーティングシステム設定を設定しているユーザーは、一般的にコンピューターを使用するときに要求するアニメーションの数を減らしています。したがって、Webの使用中は、派手なイントロ画面、カードフリップアニメーション、複雑なローダー、またはその他の派手なアニメーションを好まない可能性があります。

`prefers-reduced-motion`を使用して、モーションを減らすことを念頭に置いてページをデザインし、このような設定をしていないユーザー向けにモーションが強化されたエクスペリエンスを作成できます。

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/r4z52PPvElemSUJwUCZp.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}

このカードには両面に情報があります。ベースラインのモーションの少ないエクスペリエンスはその情報を表示するためのクロスフェードであり、モーションが強化されたエクスペリエンスはその反対側です。

オンラインで情報を伝達するにはモーションが非常に重要であるため、Preferred-reduced-motionは「モーションなし」を意味するものではありません。代わりに、不必要な動きをせずにユーザーを案内する堅実なベースラインエクスペリエンスを提供し、アクセシビリティのニーズや設定がなくても、ユーザーに合ったエクスペリエンスを段階的に強化します。

### `prefers-color-scheme`

もう1つの設定メディア機能は[`prefers-color-scheme`](/prefers-color-scheme)です。この機能は、ユーザーが好むテーマに合わせてUIをカスタマイズするのに役立ちます。オペレーティングシステムでは、デスクトップでもモバイルでも、ユーザーは、時間帯に応じて変化する明るいテーマ、暗いテーマ、または自動テーマの設定を行うことができます。

[CSSカスタムプロパティ](https://developer.mozilla.org/docs/Web/CSS/--*)を使用してページを設定すると、色の値の交換が簡単になります。`backgroundColor`や`textOnPrimary`などのカラーテーマ値をすばやく更新して、メディアクエリ内の新しいテーマに動的に調整できます。

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/j6Ru11BsBzCmINZDXKql.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}

これらの設定クエリの一部を簡単にテストできるようにするために、毎回システム設定を開くのではなく、エミュレーション目的でDevToolsを使用できます。

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/ol6pVXJLT44wAkRADAcq.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}

### ダークテーマのデザイン

ダークテーマ向けにデザインする場合、背景やテキストの色を反転したり、[ダークスクロールバー](/color-scheme/)を表示したりするだけではありません。気付かないかもしれませんが、いくつかの考慮事項があります。たとえば、視覚的な振動を減らすために、暗い背景の色の彩度を下げる必要がある場合があります。

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/tWxjbJ6yYUauQoCsySSX.png", alt="ダークテーマでは強い明るさの彩度の高い色を使用しない", width="698", height="640" %}

影を使用して奥行きを作成し、要素を前方に描画するのではなく、要素の背景色に光を使用して要素を前方に描画することをお勧めします。これは、暗い背景では影がそれほど効果的ではないためです。

<figure>{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/ZiasjYiaPFmJJOkxJBce.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %} <figcaption> <a href="https://material.io">マテリアルデザイン</a>は、ダークテーマのデザインに関する優れたガイダンスを提供します。</figcaption></figure>

ダークテーマは、よりカスタマイズされたユーザーエクスペリエンスを提供するだけでなく、AMOLED画面のバッテリー寿命を大幅に改善することもできます。これらは、新しいハイエンド携帯電話で見られる画面であり、モバイルデバイス全体でますます人気が高まっています。

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/ZszEdn43lc4ZmcOaGKy4.webp", alt="このグラフィックを最初に表示したトークのスクリーンショット", width="720", height="407" %}

ダークテーマに関する[2018年のAndroidの調査](https://www.theverge.com/2018/11/8/18076502/google-dark-mode-android-battery-life)では、画面の明るさと全体的なユーザーインターフェースに応じて、最大60％の消費電力の節約が示されました。60％の統計は、アプリのUIにダークテーマとライトテーマを使用して、YouTubeの再生画面と100%の画面の明るさで一時停止した動画を比較した結果です。

可能な限り、常にダークテーマエクスペリエンスをユーザーに提供する必要があります

## コンテナへの対応

CSSで最もエキサイティングな新しい分野の1つは、要素クエリとも呼ばれるコンテナクエリです。ページベースのレスポンシブデザインからコンテナベースのレスポンシブデザインへの移行が、デザインエコシステムの進化にどれほど貢献しているのかを十分に認識する必要があります。

コンテナクエリが提供する強力な機能の例を次に示します。リンクリスト、フォントサイズ、親コンテナに基づく全体的なレイアウトなど、カード要素の任意のスタイルを操作できます。

<figure>{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/fvrxk5kXiif6eFX25BH5.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %} <figcaption><a href="https://codepen.io/una/pen/LYbvKpK">}Codepenのデモを参照してください</a> (カナリアの旗の後ろ)。</figcaption></figure>

この例は、2つの異なるコンテナーサイズを持つ2つの同一のコンポーネントを示しています。どちらも、CSSグリッドを使用して作成されたレイアウトのスペースを占めています。各コンポーネントは、独自のスペース割り当てに適合し、それに応じてスタイルを設定します。

この程度の柔軟性は、メディアクエリだけでは不可能なことです。

コンテナクエリは、レスポンシブデザインへのきわめて動的なアプローチを提供します。つまり、このカードコンポーネントをサイドバーやヒーローのセクション、またはページ本体の内側のグリッド内に配置すると、コンポーネント自体が、ビューポートではなく、コンテナに応じたレスポンシブ情報とサイズを所有します。

これには`@container` at-ruleが必要です。これは`@media`を}使用したメディアクエリと同じように機能します。ただし、代わりに、`@container`はビューポートとユーザーエージェントではなく親コンテナに情報を照会します。

```css
.card {
  container-type: inline-size;
}

@container (max-width: 850px) {
  .links {
    display: none;
  }

  .time {
    font-size: 1.25rem;
  }

  /* ... */
}
```

まず、親要素に包含を設定します。`@container`クエリを記述し、`min-width`または`max-width`を使用して、サイズに基づいてコンテナ内の要素のスタイルを設定します。

上記のコードは`max-width`を使用し、`display:none`へのリンクを設定します。また、コンテナが`850px`未満の場合は時間フォントサイズを小さくします。

### コンテナクエリカード

このデモプラントのWebサイトでは、ヒーローのカード、最近表示したアイテムのサイドバー、製品グリッドなど、各製品カードはすべてまったく同じコンポーネントであり、同じマークアップが付いています。

<figure>{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/D4hBchz6kaPjkgx8BCmU.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %} <figcaption><a href="https://codepen.io/una/pen/mdOgyVL">Codepenのデモを参照してください</a> (Canaryのフラグの後ろ)。</figcaption></figure>

このレイアウト全体を作成するために使用されるメディアクエリは*なく*、コンテナクエリのみです。これにより、各製品カードを適切なレイアウトにシフトして、そのスペースを埋めることができます。たとえば、グリッドはminmax列レイアウトを使用して要素をスペースに流し込み、スペースが圧縮されすぎた場合 (最小サイズに達した場合) にグリッドを再レイアウトします。

```css
.product {
  container-type: inline-size;
}

@container (min-width: 350px) {
  .card-container {
    padding: 0.5rem 0 0;
    display: flex;
  }

  .card-container button {
    /* ... */
  }
}

```

`350px`以上のスペースがある場合、カードのレイアウトは、デフォルトのフレックス方向が「行」である`display: flex`に設定されているため、水平になります。

より少ないスペースで、製品カードが積み重ねられます。各製品カードはそれ自体をスタイルします。これは、グローバルスタイルだけでは不可能なことです。

### コンテナクエリとメディアクエリの混合

コンテナクエリには非常に多くのユースケースがあります。1つはカレンダーコンポーネントです。コンテナクエリを使用して、親の使用可能な幅に基づいてカレンダーイベントやその他のセグメントを再レイアウトできます。

<figure>{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/hjV6i4PEu8wounYhHsHf.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %} <figcaption><a href="https://codepen.io/una/pen/RwodQZw">Codepenのデモを参照してください</a> (Canaryのフラグの後ろ)。</figcaption></figure>

このデモコンテナは、カレンダーの日付と曜日のレイアウトとスタイルを変更するためにクエリを実行し、スケジュールされたイベントの余白とフォントサイズを調整して、スペースに合わせやすくします。

次に、メディアクエリを使用して、画面サイズを小さくするためにレイアウト全体をシフトします。この例は、メディアクエリ（グローバルスタイルまたはマクロスタイルの調整）とコンテナクエリ（コンテナの子とそのマイクロスタイルの調整）を*組み合わせる*ことがいかに強力であるかを示しています。

これで、同じUIコンポーネント内のマクロレイアウトとマイクロレイアウトを考えて、微妙なニュアンスのある設計上の決定を行うことができます。

### コンテナクエリの使用

これらのデモは、Chrome Canaryのフラグの後ろで再生できるようになりました。 Canaryで`about://flags`に移動し、`#enable-container-queries`フラグをオンにします。これにより、`@container`、`contain`、`contain`の`block-size`値、およびLayoutNGグリッドの実装のサポートが有効になります。

### スコープスタイル

コンテナクエリに基づいて構築するために、CSSワーキンググループは、コンポーネントの適切な名前空間と衝突回避に役立つ[スコープスタイル](https://css.oddbird.net/scope/)についても積極的に議論しています。

<figure>{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/FCHIEO4IouHOQaOJXrQD.png", alt="スコープスタイル図", width="759", height="636" %} <figcaption><a href="https://css.oddbird.net/">Miriam Suzanne</a>氏がデザインした図。 </figcaption></figure>

スコープスタイルを使用すると、パススルーおよびコンポーネント固有のスタイル設定で名前の衝突を回避できます。これは、CSSモジュールなどの多くのフレームワークやプラグインでフレームワーク内で実行できるようになっています。この仕様により、マークアップを調整することなく、読み取り可能なCSSを使用してコンポーネントのカプセル化されたスタイルをネイティブに記述できるようになります。

```css
/* @scope (<root>#) [to (<boundary>#)]? { … } */

@scope (.tabs) to (.panel) {
  :scope { /* targeting the scope root */ }
  .light-theme :scope .tab { /* contextual styles */ }
}
```

スコープを使用すると、「ドーナツ型」セレクターを作成できます。このセレクターでは、スタイルをカプセル化する場所と、スコープスタイルから抜け出してよりグローバルなスタイルを参照する場所を指定できます。

この例としては、タブでスコープスタイルを取得するタブパネルや、タブ内のパネルで親スタイルを取得する場合があります。

## フォームファクターに対応

レスポンシブデザインの新時代についての会話の次のトピックは、フォームファクターの変化と、Webコミュニティとしてデザインする必要があるもの（形状変化画面や仮想現実など）の可能性の高まりです。

<figure>{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/OeskptFb2djUWWmX7K9y.svg", alt="スパン図", width="800", height="488" %} <figcaption><a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md">Microsoft Edge Explainers</a>の図。</figcaption></figure>

折りたたみ式またはフレキシブルスクリーン、およびスクリーンスパンの設計は、今日のフォームファクタの変化を確認できる一例です。そして、画面スパンは、これらの新しいフォームファクタとニーズに対応するために取り組んでいるさらに別の仕様です。

画面にまたがる実験的な[メディアクエリは](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md)ここでも役立ちます。現在、次のように動作します。`@media (spanning: <type of fold>)` 。デモでは、2つの列を持つグリッドレイアウトを設定します。1つは--sidebar-widthの幅で、デフォルトは5remで、もう1つは`1fr`です。縦方向に折り目が1つあるデュアル画面でレイアウトを表示すると、`--sidebar-width`値が左の折り目の環境値で更新されます。

```css
:root {
  --sidebar-width: 5rem;
}

@media (spanning: single-fold-vertical) {
  --sidebar-width: env(fold-left);
}

main {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
}
```

これにより、サイドバー（この場合はナビゲーション）が一方の折り目のスペースを埋め、アプリのUIがもう一方の折り目を埋めるレイアウトが可能になります。これにより、UIの「折り目」が防止されます。

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/Uf3RL7EhVZGK2ECiD0sT.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}

Chrome DevToolsエミュレータで折りたたみ可能な画面をテストして、ブラウザーで直接画面にまたがるデバッグとプロトタイプ作成に役立てることができます。

## まとめ

フラットスクリーンを超えてUIデザインを探求することは、コンテナクエリとスコープスタイルが非常に重要であるもう1つの理由です。これらは、ページレイアウトとグローバルスタイル、およびユーザースタイルからコンポーネントスタイルをサイロ化する機会を提供し、より弾力性のあるレスポンシブデザインを可能にします。これは、画面にまたがるニュアンスを含む、ページベースのメディアクエリを使用してマクロレイアウトを設計できることを意味します。同時に、コンポーネントのコンテナクエリでマイクロレイアウトを使用し、ユーザー設定ベースのメディアクエリを追加して、固有の設定とニーズに基づいてユーザーエクスペリエンスをカスタマイズします。

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/uAJDDUDLcAsLzBf0a27b.png", alt="新しいレスポンシブの円", width="800", height="442" %}

*これ*は新しいレスポンシブです。

マクロレイアウトとミクロレイアウトを組み合わせ、さらにユーザーのカスタマイズとフォームファクタを考慮に入れています。

これらの変更だけでも、Webのデザイン方法にかなりの変化が生じます。しかし、これらを組み合わせると、レスポンシブデザインの概念化さえも非常に大きく変化することを意味します。ビューポートサイズを超えたレスポンシブデザインについて考え、コンポーネントベースのカスタマイズされたエクスペリエンスを向上させるために、これらすべての新しい軸を検討し始めましょう。

レスポンシブデザインの次の時代はここにあり、すでにそれを自分で探求し始めることができます。

### web.dev/learnCSS

現時点では、CSSをレベルアップしたい場合、基本の一部を再検討したい場合は、新しい完全に無料のCSSコースとリファレンスがweb.devで提供されています。[web.dev/learnCSS](/learn/css)からアクセスできます。

レスポンシブデザインの次の時代とそれに伴ういくつかのプリミティブについてこの概要を楽しんでいただけたと思います。また、これがWebデザインの将来にとって何を意味するのかについて私と同じように興奮していることを願っています。

これは、UIコミュニティとして、コンポーネントベースのスタイル、新しいフォームファクターを採用し、ユーザーが応答するエクスペリエンスを作成するための大きな機会を開きます。
