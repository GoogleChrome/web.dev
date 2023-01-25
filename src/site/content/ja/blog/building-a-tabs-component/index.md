---
layout: post
title: Tabコンポーネントの構築
subhead: iOSおよびAndroidアプリに付いているものと同様のTabコンポーネントを構築する方法の基本的な概要。
authors:
  - adamargyle
description: iOSおよびAndroidアプリに付いているものと同様のTabコンポーネントを構築する方法の基本的な概要。
date: 2021-02-17
hero: image/admin/sq79nDAthaQGcdQkqazJ.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

この投稿では、レスポンシブで、複数のデバイスからの入力をサポートし、ブラウザー間で機能するWeb用のTabsコンポーネントを構築することについての考えを共有したいと思います。[デモを](https://gui-challenges.web.app/tabs/dist/)お試しください。

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IBDNCMVCysfM9fYC9bnP.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> <a href="https://gui-challenges.web.app/tabs/dist/">Demo</a> </figcaption></figure>

ビデオにより興味があれば、この投稿のYouTubeバージョンをご覧ください。

{% YouTube 'mMBcHcvxuuA' %}

## 概要

Tabは設計システムの一般的なコンポーネントですが、種々な形状やフォームで使用されます。 以前`<frame>`要素を基に構築されたデスクトップtabがあったが、現在には物理プロパティを基にコンテンツをアニメ化するバターモバイルのコンポーネントがあります。こういったものはどちらでもスペース節約という目的に狙っています。

本日、tabユーザー体験の基本は、表示フレーム内のコンテンツの可視性を切り替えるボタンナビゲーション範囲です。多くの異なるコンテンツ範囲は同じスペースを共有しますが、ナビゲーション内で選択されたボタンによって条件付きで表示されます。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/eAaQ44VAmzVOO9Cy5Wc8.png", alt="Webがコンポーネントのコンセプトに適用したスタイルの多様性のため、コラージュはかなり混沌になっています", width="800", height="500" %} <figcaption> 過去10年間のtabコンポーネントWebデザインスタイルのコラージュ </figcaption></figure>

## Web戦術

全体として見れば、いくつかの重要なWebプラットフォーム機能のおかげで、このコンポーネントの構築は非常に簡単になることがわかりました。

- `scroll-snap-points`は適切なスクロール停止位置でのエレガントなスワイプとキーボードの相互作用のためです。
- [Deep links](https://en.wikipedia.org/wiki/Deep_linking)はURLハッシュ経由でブラウザにページ内スクロールのアンカーと共有のサポートを処理されます。
- `<a>`や`id="#hash"`要素のマークアップによりスクリーンリーダーをサポートします。
- `prefers-reduced-motion`はクロスフェードトランジションとページ内のインスタントスクロールを有効にします。
- ドラフトの`@scroll-timeline`web機能は選択されたタブを動的に下線を引いて色を変更します。

### HTML {: #markup }

基本的に、このUXはリンクをクリックし、URLにネストされたページの状態を表し、ブラウザが一致する要素にスクロールするとコンテンツ範囲が更新されるのを確認します。

そこにはlinkと`:target`等の構造的なコンテンツメンバーがあります。`<nav>`が最適なリンクのリストと、 `<section>`が最適な`<article>`要素のリストが必要です。リンクハッシュごとはセクションと一致し、ブラウザにアンカー経由でスクロールさせます。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pr8BrPDjq8ga9NyoHLJk.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> Linkボタンをクリックして、フォーカスされたコンテンツ内にスライドさせます</figcaption></figure>

たとえば、linkをクリックすると、Chrome 89にある`:target`記事が自動的にフォーカスさ、JSが必要ありません。そうしたら、ユーザーは通常入力デバイスを使用して記事のコンテンツをスクロールできます。マークアップに示されているように、これは無料で提供されるコンテンツです。

次のマークアップを使用してタブを構成しました。

```html
<snap-tabs>
  <header>
    <nav>
      <a></a>
      <a></a>
      <a></a>
      <a></a>
    </nav>
  </header>
  <section>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</snap-tabs>
```

`href`プロパティと`id`プロパティを使用して`<a>`要素と`<article>`要素の間に接続を確立できます。

```html/3,10
<snap-tabs>
  <header>
    <nav>
      <a href="#responsive"></a>
      <a href="#accessible"></a>
      <a href="#overscroll"></a>
      <a href="#more"></a>
    </nav>
  </header>
  <section>
    <article id="responsive"></article>
    <article id="accessible"></article>
    <article id="overscroll"></article>
    <article id="more"></article>
  </section>
</snap-tabs>
```

次に、記事に種々のloremを、リンクにさまざまな長さとタイトルの画像セットを入力しました。必要なコンテンツを使用して、レイアウトを開始できます。

### スクロールレイアウト{: #overscroll }

このコンポーネントには、3つの異なるタイプのスクロール範囲があります。

- ナビゲーション<b style="color: #FF00E2;">（ピンク）</b>は水平方向にスクロール可能です
- コンテンツ範囲<b style="color: #008CFF;">（青）</b>は水平方向にスクロール可能です
- 各記事項目<b style="color: #2FD800;">（緑）</b>は垂直方向にスクロール可能です。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qVmUKMwbeoCBffP0aY55.png", alt="スクロール範囲の輪郭を描き、スクロールする方向を示す矢印の該当色が付いた3つのカラフルなボックス。", width="800", height="450" %}</figure>

スクロールに関連する要素には2つの異なるタイプがあります。

1. **ウィンドウ**<br>`overflow`プロパティスタイルを持ち、定義されたディメンションが付いているボックス。
2. **特大の表面**<br><br>このレイアウトでは、ナビゲーションlink、セクション記事、および記事のコンテンツを含むリストコンテナです。

#### `<snap-tabs>`レイアウト{: #tabs-layout }

私が選択した上位レベルのレイアウトはflex（Flexbox）でした。 `column`に方向を設定したので、headerとセクションは垂直方向に並べられています。これは最初のスクロールウィンドウであり、非表示のオーバーフローをすべて非表示にします。headerとセクションは、個々のゾーンとして、早めにオーバースクロールを採用します。

{% Compare 'better', 'HTML' %}

```html
<snap-tabs>
  <header></header>
  <section></section>
</snap-tabs>
```

{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
snap-tabs {
  display: flex;
  flex-direction: column;

  /* establish primary containing box */
  overflow: hidden;
  position: relative;

  & > section {
    /* be pushy about consuming all space */
    block-size: 100%;
  }

  & > header {
    /* defend against <section> needing 100% */
    flex-shrink: 0;
    /* fixes cross browser quarks */
    min-block-size: fit-content;
  }
}
```

{% endCompare %}

カラフルな3スクロール図に戻ります。

- `<header>`は、<b style="color: #FF00E2;">（ピンクの）</b>スクロールコンテナになるため準備されています。
- `<section>`は<b style="color: #008CFF;">（青の）</b>スクロールコンテナになるため準備されています。

以下で[VisBug](https://a.nerdy.dev/gimme-visbug)を使用して強調表示したフレームは、スクロールコンテナが作成した**ウィンドウ**を確認する上で役立ちます。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fyl0rTuETjORBigkIBx5.png", alt="header要素とセクション要素の上にはホットピンクのオーバーレイがあり、コンポーネントで占めるスペースに輪郭を描きます。", width="800", height="620" %}</figure>

#### Tab`<header>`レイアウト{: #tabs-header }

次のレイアウトはほぼ同じです。flexを使用して垂直方向の順序を作成します。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<snap-tabs>
  <header>
    <nav></nav>
    <span class="snap-indicator"></span>
  </header>
  <section></section>
</snap-tabs>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css/1-2
header {
  display: flex;
  flex-direction: column;
}
```
{% endCompare %}
</div>

`.snap-indicator`は、linkのグループとともに水平方向に移動する必要があり、そしてこのheaderレイアウトは、その段階を設定する上で役立ちます。ここには絶対的に配置される要素はありません！

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/EGNIrpw4gEzIZEcsAt5R.png", alt="nav要素とspan.indicator要素の上にはホットピンクのオーバーレイがあり、コンポーネントで占めるスペースに輪郭を描きます。", width="800", height="368" %}</figure>

次はスクロールスタイルです。2つの水平スクロール範囲（headerとセクション）間でスクロールスタイルを共有できることがわかったので、ユーティリティクラス`.scroll-snap-x`を作成しました。

```css
.scroll-snap-x {
  /* browser decide if x is ok to scroll and show bars on, y hidden */
  overflow: auto hidden;
  /* prevent scroll chaining on x scroll */
  overscroll-behavior-x: contain;
  /* scrolling should snap children on x */
  scroll-snap-type: x mandatory;

  @media (hover: none) {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
```

それぞれがｘ軸のオーバーフロー、オーバースクロールをトラップするためのスクロール抑制、タッチデバイス用の非表示のスクロールバー、最後にコンテンツ表示範囲をロックするためのscroll-snapが必要です。キーボードのtab順序がアクセスでき、どちらのインタラクションガイドでも自然に照準を合わせます。Scroll snapコンテナは、キーボードから優れたカルーセルスタイルインタラクションも取得します。

#### Tab header`<nav>`レイアウト{: #tabs-header-nav }

ナビゲーションlinkは、改行なしで垂直方向の中央揃えたラインで配置される必要があり、各linkアイテムはscroll-snapコンテナにスナップする必要があります。 スウィフトは2021 CSSに機能します！

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<nav>
  <a></a>
  <a></a>
  <a></a>
  <a></a>
</nav>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
nav {
  display: flex;

  & a {
    scroll-snap-align: start;

    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
}
```
{% endCompare %}
</div>

各リンクはそれ自体のスタイルとサイズを設定するため、ナビゲーションレイアウトでは方向とフローを指定するだけで済みます。ナビゲーションアイテムの唯一の幅は、インジケーターが新しいターゲットに合わせて幅を調整するため、タブ間の移行を楽しくします。ここにある要素の数に応じて、ブラウザはスクロールバーをレンダリングするかどうかを決定します。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/P7Vm3EvhO1wrTK1boU6y.png", alt="ナビゲーションの要素の上にはホットピンクのオーバーレイがあり、コンポーネント内で占めるスペースとオーバーフローするところのに輪郭を描きます。", width="800", height="327" %}</figure>

#### Tab`<section>`レイアウト{: #tabs-section }

このセクションはflexスアイテムであり、スペースの主要な消費者である必要があります。また、配置される記事の列を作成する必要があります。改めて、スウィフトは2021 CSSに機能します！ `block-size: 100%`はこの要素を引き伸ばして親を可能な限り埋めます。その上で独自のレイアウトのために、親の幅の`100%`である一連の列を作成します。親に強い制約を書き込んだので、パーセンテージはここでうまく機能します。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<section>
  <article></article>
  <article></article>
  <article></article>
  <article></article>
</section>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
section {
  block-size: 100%;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
}
```
{% endCompare %}
</div>

これは、「強引になるべく垂直方向に拡張する」と言っているかのようです（`flex-shrink: 0`設定したheaderがこの拡張プッシュに対する防御だと覚えておきましょう）。これにより、フルハイト例のセットに行の高さが設定されます。`auto-flow`スタイルは、我々の希望の通りに、グリッドに常に子を水平線に配置し、折り返しはなくするように指示します。そして親ウィンドウをオーバーフローさせます。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/FYroCMocutCGg1X8kfdG.png", alt="記事の要素の上にはホットピンクのオーバーレイがあり、コンポーネント内で占めるスペースとオーバーフローするところに輪郭を描きます。", width="800", height="512" %}</figure>

たまにこれを理解するのに困ります！このセクション要素はボックスに収まりますが、ボックスのセットも既に作成しました。画像と説明がお役に立てば幸いです。

#### Tab`<article>`レイアウト {: #tabs-article }

ユーザーは記事のコンテンツをスクロールでき、スクロールバーはオーバーフローがある場合にのみ表示される必要です。こういった記事の要素はきちんとした位置にあります。それらは同時にスクロールの親とスクロールの子です。ブラウザは、いくつかのトリッキーなタッチ、マウス、およびキーボードの相互作用を実際に処理してもらいます。

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html
<article>
  <h2></h2>
  <p></p>
  <p></p>
  <h2></h2>
  <p></p>
  <p></p>
  ...
</article>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
article {
  scroll-snap-align: start;

  overflow-y: auto;
  overscroll-behavior-y: contain;
}
```
{% endCompare %}
</div>

親スクローラー内で記事をスナップすることを選択しました。ナビゲーションlinkアイテムと記事要素がそれぞれのスクロールコンテナのインラインスタートにスナップする方法が本当に気に入っています。それは調和のとれた関係のように感じます。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/O8gJp7AxBty8yND4fFGr.png", alt="記事要素とその子要素の上にはホットピンクのオーバーレイがあり、コンポーネントで占めるスペースとオーバーフローする方向に輪郭を描きます。", width="800", height="808" %}</figure>

記事はグリッドの子であり、そのサイズは、スクロールUXを提供するビューポート範囲になるように事前に決めされています。つまり、ここでは高さや幅のスタイルは必要ありません。オーバーフローする方法を定義するだけで十分です。私はoverflow-yをautoに設定し、そして便利なoverscroll-behaviorプロパティを使用してスクロールの相互作用をトラップします。

#### 3つのスクロール範囲の要約{: #scroll-areas-recap }

以下のように、システム設定で「常にスクロールバーを表示する」を選択しました。レイアウトとスクロールオーケストレーションを確認するために、この設定をオンにしてレイアウトを機能させることは極めて重要だと思います。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/6I6TI9PI4rvrJ9lr8T99.png", alt="3つのスクロールバーが表示されるように設定されて、今レイアウトスペースが消費されるが、コンポーネントはまだ見栄えがします", width="500", height="607" %}</figure>

このコンポーネント内でスクロールバーのガターがあるので、スクロール範囲がどこにあるか、それらがサポートする方向、およびそれらが互いにどのように相互作用するかを明確に示す上で役立つと思います。こういったスクロールウィンドウフレームがそれぞれどのようにレイアウトのflex またはgrid の親になるを検討しましょう。

DevToolsは、これを可視化する上で役立ちます。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/GFJwc3IggHY4G5fBMiu9.png", alt="スクロール範囲にはgrid とflexboxツールのオーバーレイがあり、コンポーネントで占めるスペースとオーバーフローする方向に輪郭を描きます", width="800", height="455" %} <figcaption> Chromium Devtoolsは、アンカー要素でフレックスボックスナビゲーション要素レイアウト、記事要素でいっぱいのグリッドセクションレイアウト、段落と見出し要素でいっぱいの記事要素を示しています。</figcaption></figure>

スクロールレイアウトは完全です：スナップ、ディープリンク可能、キーボードアクセス可能。 UXの機能強化、スタイル、楽しみの強力な基盤。

#### 機能のハイライト

スクロールスナップされた子は、サイズ変更中にロックされた位置を維持します。これは、JavaScriptがデバイスの回転やブラウザのサイズ変更で何も表示する必要がないことを意味します。**レスポンシブ**以外のモードを選択し、デバイスフレームのサイズを変更することにより、Chromium DevTools[デバイスモード](https://developer.chrome.com/docs/devtools/device-mode/)で試しましょう。要素が表示されたままで、そのコンテンツでロックされていることに注意してください。これは、Chromiumが仕様を一致する目的にし実装を更新してから利用可能になっています。これについての[ブログ投稿](/snap-after-layout/)をご用意しました。

### アニメーション{: #animation }

ここでのアニメーション作業の目標は、インタラクションとUIフィードバックをしっかりに紐付けることです。これは、ユーザーがすべてのコンテンツを（期待の通り）スムーズに確認できるようにガイドまたは支援する上で役立ちます。目的と共に条件付きでモーションを追加します。ユーザーはオペレーティングシステムで[モーション嗜好](/prefers-reduced-motion/)を指定できるようになりました。私は自分のインターフェイスでユーザーの嗜好に応答することを非常に楽しんでいます。

タブの下線を記事のスクロール位置に紐付けるします。スナップは、きれいに配置されるだけでなく、アニメーションの開始と終了を固定する役割も果たします。これにより、[ミニマップの](https://en.wikipedia.org/wiki/Mini-map)ように機能する`<nav>`がコンテンツに接続される状態を維持します。CSSとJSの両方からユーザーのモーション嗜好をチェックします。気配りのある素晴らしい場所がいくつかあります！

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/D4zfhetqvhqlcPdTRtLZ.mp4", autoplay="true", loop="true", muted="true" %}</figure>

#### スクロール動作{: #scroll-behavior }

`:target`と`element.scrollIntoView()`両方のモーション動作を強化する機会があります。デフォルトでは、それが瞬時に実行されます。ブラウザはスクロール位置を設定するだけです。さて、そこで点滅するのではなく、そのスクロール位置に移行したい場合はどうなりますか？

```css
@media (prefers-reduced-motion: no-preference) {
  .scroll-snap-x {
    scroll-behavior: smooth;
  }
}
```

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Q4JDplhM9gEd4PoiXqs6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

ここではモーションと、ユーザーが（スクロールなどの）制御しないモーションを紹介しているため、ユーザーがオペレーティングシステムでモーションの削減を優先しない場合のみ、このスタイルを適用します。このように、それで同意する人々のためにスクロールモーションを紹介します。

#### Tabインジケーター{: #tabs-indicator}

このアニメーションの目的は、インジケーターをコンテンツの状態に関連付ける上でサポートすることです。モーションを減らしたいユーザーにはクロスフェードの`border-bottom`スタイルを、そしてモーションを変更する必要のないユーザーにはスライディングに紐付けるスクロール+カラーフェードアニメーションをカラーリングすることにしました。

Chromium Devtoolsでは、設定を切り替えて、2つの異なる遷移スタイルを示すことができます。これを作るのは凄く楽しました。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/NVoLHgjGjf7fZw5HFpF6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
@media (prefers-reduced-motion: reduce) {
  snap-tabs > header a {
    border-block-end: var(--indicator-size) solid hsl(var(--accent) / 0%);
    transition: color .7s ease, border-color .5s ease;

    &:is(:target,:active,[active]) {
      color: var(--text-active-color);
      border-block-end-color: hsl(var(--accent));
    }
  }

  snap-tabs .snap-indicator {
    visibility: hidden;
  }
}
```

ユーザーがモーションの削減を希望する場合は、`.snap-indicator`は不要となるので、非表示にします。その上で、それを`border-block-end`スタイルと`transition`に置き換えます。また、タブの相互作用で、アクティブなナビゲーションアイテムにブランドの下線が強調表示されるだけでなく、テキストの色も暗くなることに注意してください。アクティブな要素は、テキストの色のコントラストが高く、明るいアンダーライトのアクセントがあります。

CSSを数行で追加するだけで、誰かが見られているように感じさせることができます（モーションの嗜好を慎重に尊重しているという意味で）。大好きです。

#### `@scroll-timeline` {: #scroll-timeline}

上記のセクションでは、減らされたモーションのクロスフェードスタイルを処理する方法を示しました。このセクションでは、インジケーターとスクロール範囲を紐付ける方法を説明します。これは次の楽しい実験的なものです。楽しんで頂けばと思います。

```js
const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);
```

まず、JavaScriptからユーザーのモーション嗜好を確認します。結果が`false`である場合は、ユーザーがモーションを減らしたがり、そしてモーションエフェクトと紐付けるスクロールを実行しないことを意味します。

```js
if (motionOK) {
  // motion based animation code
}
```

これを書いている時点では[`@scroll-timeline`をサポートするブラウザ](https://caniuse.com/css-scroll-timeline)がなかったです。これは、ただ実験的な実装を含む[ドラフト仕様](https://drafts.csswg.org/scroll-animations-1/)です。ただし、このデモで使用するポリフィルがあります。

##### ` ScrollTimeline`

CSSとJavaScriptの両方ともスクロールタイムラインを作成できますが、アニメーション内でライブ要素測定を使用できるようにJavaScriptを選択しました。

```js
const sectionScrollTimeline = new ScrollTimeline({
  scrollSource: tabsection,  // snap-tabs > section
  orientation: 'inline',     // scroll in the direction letters flow
  fill: 'both',              // bi-directional linking
});
```

別のスクロール位置をたどれるものが欲しくて、 そして`ScrollTimeline`を作成することにより、スクロールlinkのドライバーである`scrollSource`を定義します。通常、Web上のアニメーションはグローバルな時間枠のティックに逆行されるが、カスタムの`sectionScrollTimeline`を使用すると、すべてを変更できます。

```js
tabindicator.animate({
    transform: ...,
    width: ...,
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

アニメーションのキーフレームに入る前に、スクロールのフォロワーである`tabindicator`はカスタムタイムライン（セクションのスクロール）を基にアニメーション化されることを指摘することが重要だと思います。これで紐付けは完了したが、キーフレームとも呼ばれる、かつアニメーション化するための最終的な要素であるステートフルポイントが欠落しています。

#### 動的キーフレーム

`@scroll-timeline`でアニメーション化するための非常に強力で理論的な宣言型CSSの方法がありますが、私が選択したアニメーションはあまりにも動的でした。`auto`幅を切り替える方法はなく、子の長さに応じてキーフレームを動的に作成する方法もありません。

JavaScriptはそういった情報を取得する方法を知っているので、子を自分で繰り返し処理させ、実行時に計算された値を取得します。

```js
tabindicator.animate({
    transform: [...tabnavitems].map(({offsetLeft}) =>
      `translateX(${offsetLeft}px)`),
    width: [...tabnavitems].map(({offsetWidth}) =>
      `${offsetWidth}px`)
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

`tabnavitem`ごとに、 `offsetLeft`の位置を分解し、`translateX`値として使用する文字列を返します。これにより、アニメーション用に4つの変換キーフレームが作成されます。幅についても同じことが行われ、それぞれに動的幅が何だかが尋ねられて、キーフレーム値として使用されます。

フォントとブラウザの設定を基した出力の例を次に示します。

TranslateXキーフレーム：

```js
[...tabnavitems].map(({offsetLeft}) =>
  `translateX(${offsetLeft}px)`)

// results in 4 array items, which represent 4 keyframe states
// ["translateX(0px)", "translateX(121px)", "translateX(238px)", "translateX(464px)"]
```

幅のキーフレーム：

```js
[...tabnavitems].map(({offsetWidth}) =>
  `${offsetWidth}px`)

// results in 4 array items, which represent 4 keyframe states
// ["121px", "117px", "226px", "67px"]
```

戦略のまとめるとしては、タブインジケーターは、セクションスクローラーのスクロールスナップ位置に応じて、4つのキーフレームにわたってアニメーション化されます。スナップポイントは、キーフレーム間の明確な描写を作成し、アニメーションの同期された感触を実際に追加します。

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jV5X2JMkgUQSIpcivvTJ.png", alt="アクティブタブと非アクティブタブは、両方のコントラストの合格点数を示すVisBugオーバーレイで表示されます", width="540", height="400" %}</figure>

ユーザーは、インタラクションを使用してアニメーションを操作しながら、インジケーターの幅と位置がセクションごとに変化するのを確認し、スクロールで完全に追跡します。

お気づきではないかもしれませんが、強調表示されたナビゲーションアイテムが選択されると、色が変化することを非常に誇りに思っています。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qoxGO8SR2t6GPuCWhwvu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

選択されていない明るい灰色は、強調表示されたアイテムのコントラストが高くなると、さらに押し戻されて表示されます。ホバーや選択の時など、テキストの色を変更させるのが一般的ですが、下線のインジケーターと同期して、スクロールに応じてその色を変更させるのは一段上のレベルです。

これは実施した方法です：

```js
tabnavitems.forEach(navitem => {
  navitem.animate({
      color: [...tabnavitems].map(item =>
        item === navitem
          ? `var(--text-active-color)`
          : `var(--text-color)`)
    }, {
      duration: 1000,
      fill: 'both',
      timeline: sectionScrollTimeline,
    }
  );
});
```

各タブナビゲーションリンクには、この新しいカラーアニメーションが必要であり、下線インジケーターと同じスクロールタイムラインを追跡します。以前と同じタイムラインを使用します。スクロール時にティックを出すことが役割なので、そのティックを任意で種類のアニメーションで使用できます。以前のやり方と同じように、ループ内に4つのキーフレームを作成し、色を返します。

```js
[...tabnavitems].map(item =>
  item === navitem
    ? `var(--text-active-color)`
    : `var(--text-color)`)

// results in 4 array items, which represent 4 keyframe states
// [
  "var(--text-active-color)",
  "var(--text-color)",
  "var(--text-color)",
  "var(--text-color)",
]
```

`var(--text-active-color)`が付いているキーフレームはlinkを強調表示しますが、それ以外は標準のテキスト色です。外側ループは各ナビゲーションアイテムであり、内側ループは各navアイテムの個人用キーフレームであるため、ネストされたループは比較的簡単になります。外側ループ要素が内側ループ要素と同じであるかどうかを確認し、それを使用して、いつ選択されたかを確認します。

これについて書いたとき、とても楽しかったです。非常に楽しかったです。

### さらに多くのJavaScriptの機能強化{: #js }

ここで紹介している内容の主要はJavaScriptなしで機能することを覚えておく必要です。そうは言っても、JSが利用可能になると、どのように強化できるか確認しましょう。

#### ディープリンク

ディープリンクはモバイル用語ですが、ここでは、タブのコンテンツへURLを直接に共有できるという点でディープリンクの目的がタブに合うと思います。ブラウザは、URLハッシュで一致するIDにページ内で移動します。この`onload`ハンドラーがプラットフォーム間で効果を発揮するとわかりました。

```js
window.onload = () => {
  if (location.hash) {
    tabsection.scrollLeft = document
      .querySelector(location.hash)
      .offsetLeft;
  }
}
```

#### スクロール終了の同期

ユーザーは常にキーボードをクリックしたり使用したりせずに必要に応じて、自由にスクロールする場合もあります。セクションスクローラーがスクロールを停止すると、それがどこで止めても、上部のナビゲーションバーに合わせ必要があります。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/syltOES9Gxc0ihOsgTIV.mp4", autoplay="true", loop="true", muted="true" %}</figure>

次はスクロールが終了するのをどうやって待つのです。

```js
tabsection.addEventListener('scroll', () => {
  clearTimeout(tabsection.scrollEndTimer);
  tabsection.scrollEndTimer = setTimeout(determineActiveTabSection, 100);
});
```

セクションがスクロールされているのはいつでも、セクションタイムアウトがある場合はそれをクリアし、新しいセクションを開始しましょう。セクションのスクロールが停止した場合は、タイムアウトをクリアせず、休止してから100ミリ秒後に起動しましょう。起動したら、ユーザーが停止した場所を特定できる関数を呼び出します。

```js
const determineActiveTabSection = () => {
  const i = tabsection.scrollLeft / tabsection.clientWidth;
  const matchingNavItem = tabnavitems[i];

  matchingNavItem && setActiveTab(matchingNavItem);
};
```

スクロールがスナップされたと仮定すると、現在のスクロール位置をスクロール範囲の幅で割る結果は小数ではなく整数になります。次に、この計算されたインデックスを介してキャッシュからナビゲーションアイテムを取得しようとします。何かが見つかった場合は、アクティブに設定するための一致するのを送信します。

```js
const setActiveTab = tabbtn => {
  tabnav
    .querySelector(':scope a[active]')
    .removeAttribute('active');

  tabbtn.setAttribute('active', '');
  tabbtn.scrollIntoView();
};
```

アクティブなタブの設定は、現在アクティブなタブをクリアしてから、着信ナビゲーションアイテムにアクティブな状態属性を与えることから始まります。 `scrollIntoView()`の呼び出しには、CSSとの楽しい相互作用があると覚えておきましょう。

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/nsiyMgZ2QGF2fx9gVRgu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
.scroll-snap-x {
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}
```

水平スクロールスナップユーティリティCSSでは、ユーザーがモーショントレラントである場合は、`smooth`スクロールを適用するメディアクエリを[ネスト](https://drafts.csswg.org/css-nesting-1/) しました。JavaScriptでは要素をスクロールして表示するための呼び出しを自由に行うことができ、CSSではUXを宣言的に管理できます。両方がたまに楽しい小さな試合を作ってもらいます。

### 結論

以上は私のやり方ですが貴方はどうしますか？これにより、楽しいコンポーネントアーキテクチャが実現できます。お気に入りのフレームワークで最初のバージョンを作成するのはどなたですか？ 🙂

アプローチを多様化し、Web上で構築するためのすべての方法を学びましょう。[Glitch](https://glitch.com)を作成し、自分のバージョンを私に[ツイート](https://twitter.com/argyleink)してください。下の[Community remixes](#community-remixes)に追加します。

## Community remixes

- [@ devnook](https://twitter.com/devnook) 、 [@ rob_dodson](https://twitter.com/rob_dodson) 、および[@DasSurma](https://twitter.com/DasSurma)とWebコンポーネント： [記事](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs)。
- [@jhvanderschee](https://twitter.com/jhvanderschee)ボタン付き： [Codepen](https://codepen.io/joosts/pen/PoKdZYP) 。
