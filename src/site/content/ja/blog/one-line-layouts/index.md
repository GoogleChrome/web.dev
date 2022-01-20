---
title: 1行のCSSで10の最新のレイアウト
subhead: この投稿では、CSSのいくつかの強力な行に焦点を当てています。これらの行は、深刻な重労働を行い、堅牢で最新のレイアウトを構築するのに役立ちます。
authors:
  - una
description: この投稿では、負荷が高い処理を実行し、最新の堅牢なレイアウトを構築するのに役立つ、数行の強力なCSSをハイライトします。
date: 2020-07-07
hero: image/admin/B07IzuMeRRGRLH9UQkwd.png
alt: Holy grailレイアウト。
tags:
  - blog
  - css
  - layout
  - mobile
---

{% YouTube 'qm0IfG1GyZU' %}

最新のCSSレイアウトにより、開発者は数回のキー操作で実に有意義で堅牢なスタイリングルールを作成できます。上記の話とそれに続くこの投稿では、負荷の高い処理を実行する10行の強力なCSSについて検討します。

{% Glitch { id: '1linelayouts', path: 'README.md', height: 480 } %}

これらのデモを自分でフォローまたは試してみるには、上記のGlitch埋め込みを確認するか、[1linelayouts.glitch.me](https://1linelayouts.glitch.me)にアクセスしてください。

## 01. Super Centered: `place-items: center`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/01-place-items-center.mp4">
  </source></video></figure>

最初の「単一行」レイアウトでは、CSSの世界全体で最大の謎である「センタリング」を解明します。これは[`place-items: center`](https://developer.mozilla.org/docs/Web/CSS/place-items)で考えるよりも簡単であることを理解していただきたいと思います。

最初に、`display`メソッドとして`grid`を指定してから、同じ要素に`place-items: center`を書き込みます。`place-items`は、`align-items`と`justify-items`の両方を一度に設定するための省略形です。`center`に設定すると、`align-items`と`justify-items`の両方が`center`に設定されます。

```css/2
.parent {
  display: grid;
  place-items: center;
}
```

これにより、固有のサイズに関係なく、コンテンツを親の中央に正確に配置できます。

## 02. Deconstructed Pancake: `flex: <grow> <shrink> <baseWidth>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4">
  </source></video></figure>

次に、Deconstructed Pancakeです。これは、たとえばマーケティングサイトの一般的なレイアウトであり、通常は画像、タイトル、そして製品の一部の機能を説明するテキストを含む3つの項目の行が含まれる場合があります。モバイルでは、それらをうまく積み重ねて、画面サイズを大きくしたときに、拡大するようにします。

この効果にFlexboxを使用することにより、画面のサイズが変更されたときにこれらの要素の配置を調整するためのメディアクエリは必要ありません。

[`flex`](https://developer.mozilla.org/docs/Web/CSS/flex)省略形は、`flex: <flex-grow> <flex-shrink> <flex-basis>`を表します。

このため、ボックスを`<flex-basis>`サイズまで埋める場合は、小さいサイズで縮小しますが、追加のスペースを埋めるために*拡大*しない場合は、`flex: 0 1 <flex-basis>`と記述します。この場合、`<flex-basis>`は`150px`なので、次のようになります。

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

あなたはストレッチにボックスをしたいと、彼らは次の行に折り返さとしてのスペースを埋める*ない*場合は、設定`<flex-grow>`に`1` 、それは次のようになりますので、：

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4">
  </source></video></figure>

これで、画面サイズを拡大または縮小すると、これらの柔軟な項目の拡大または縮小します。

## 03. Sidebar Says: `grid-template-columns: minmax(<min>, <max>) …)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4">
  </source></video></figure>

このデモでは、グリッドレイアウトの[minmax](https://developer.mozilla.org/docs/Web/CSS/minmax)関数を利用します。ここで行っているのは、サイドバーの最小サイズを`150px`に設定します。画面が大きい場合は、`25%`まで拡大します。サイドバーは常に親の水平スペースの`25%`を占め、その`25%`が`150px`より小さくなるまでこの状態が続きます。

grid-template-columnsの値として、この値と`minmax(150px, 25%) 1fr`の値を追加します。最初の列の項目 (この場合はサイドバー) は`25%`で`minmax` `150px`を取得します。2番目の項目 (`main`セクション) は残りのスペースを単一の`1fr`トラックとして占めます。

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

## 04. Pancake Stack: `grid-template-rows: auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4">
  </source></video></figure>

Deconstructed Pancakeとは異なり、この例では、画面サイズが変更されても子を折り返しません。一般に[スティッキーフッター](https://developer.mozilla.org/docs/Web/CSS/Layout_cookbook/Sticky_footers)と呼ばれるこのレイアウトは、モバイルアプリケーション (通常、フッターはツールバー)、およびWebサイト (多くの場合、シングルページアプリケーションはこのグローバルレイアウトを使用) 全体で、Webサイトとアプリの両方によく使用されます。

コンポーネントに`display: grid`を追加すると、単一の列グリッドが作成されますが、メイン領域の高さは、その下にフッターがあるコンテンツと同じになります。

フッターを下部に固定するには、次のコードを追加します。

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

これにより、ヘッダーとフッターのコンテンツが自動的に子のサイズを取得するように設定され、残りのスペース (`1fr`) がメイン領域に適用されます。`auto`サイズの行は、子の最小コンテンツのサイズを取得し、そのコンテンツのサイズが大きくなると、行自体が大きくなって調整されます。

## 05. Classic Holy Grailレイアウト: `grid-template: auto 1fr auto / auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4">
  </source></video></figure>

この従来からのHoly Grailレイアウトには、ヘッダー、フッター、左側のサイドバー、右側のサイドバー、およびメインコンテンツがあります。以前のレイアウトと似ていますが、サイドバーが追加されました。

1行のコードを使用してこのグリッド全体を作成するには、`grid-template`プロパティを使用します。これにより、行と列の両方を同時に設定できます。

プロパティと値のペアは次のとおり`grid-template: auto 1fr auto / auto 1fr auto`です。1番目と2番目のスペースで区切られたリストの間のスラッシュは、行と列の間の区切りです。

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

ヘッダーとフッターに自動サイズのコンテンツが含まれていた最後の例のように、ここでは、左右のサイドバーが子の固有のサイズに基づいて自動的にサイズ変更されます。ただし、今回は縦 (高さ) ではなく横 (幅) のサイズです。

## 06. 12-Spanグリッド: `grid-template-columns: repeat(12, 1fr)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4">
  </source></video></figure>

次に、もう1つの従来のレイアウトがあります。12-spanグリッドです。`repeat()`関数を使用して、すばやくCSSでグリッドを作成できます。グリッドテンプレート列で`repeat(12, 1fr);`を使用すると、`1fr`ごとに12列になります。

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

これで12列のトラックグリッドが作成されたため、子をグリッドに配置できます。これを行うための方法の1つは、グリッド線を使用してそれらを配置することです。たとえば、`grid-column: 1 / 13`は、最初の行から最後 (13番目) までのすべての行にまたがり、12列にまたがります。 `grid-column: 1 / 5;`最初の4列にまたがります。

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4">
  </source></video></figure>

別の方法として、`span`キーワードを使用して、作成することもできます。`span`を使用すると、開始線を設定し、その開始点からまたがる列数を設定します。この場合、`grid-column: 1 / span 12`は`grid-column: 1 / 13`と同じです。また、`grid-column: 2 / span 6`は`grid-column: 2 / 8`と同じです。

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```

## 07. RAM (Repeat, Auto, MinMax): `grid-template-columns(auto-fit, minmax(<base>, 1fr))`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-1.mp4">
  </source></video></figure>

この7番目の例では、すでに学習したレスポンシブレイアウトの作成に関する概念の一部を、自動的に配置された柔軟な子と組み合わせます。非常に整然としています。ここで覚えておくべき重要な用語は、`repeat`、`auto-(fit|fill)`、および`minmax()'`です。これは頭字語のRAMとして覚えておくことができます。

まとめると、次のようになります。

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

ここでもrepeatを使用していますが、今回は、明示的な数値ではなく、`auto-fit`キーワードを使用しています。これにより、これらの子要素の自動配置が可能になります。これらの子の基本最小値は`150px`、最大値は`1fr`です。つまり、小さい画面では、`1fr`の幅全体を占めます。この幅がそれぞれ`150px`に達すると、同じ行にフローします。

`auto-fit`では、ボックスの水平方向のサイズが150ピクセルを超えると、ボックスが伸びて残りのスペース全体が埋められます。ただし、これを`auto-fill`に変更すると、minmax関数の基本サイズを超えても伸びることはありません。

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-2.mp4">
  </source></video></figure>

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
```

## 08. Line Up: `justify-content: space-between`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4">
  </source></video></figure>

次のレイアウトで示す主なポイントは、`justify-content: space-between`です。これは、最初と最後の子要素をバウンディングボックスの端に配置し、残りのスペースを要素間で均等に分散させます。これらのカードの場合、Flexbox表示モードになり、`flex-direction: column`を使用して方向がcolumnに設定されます。

これにより、タイトル、説明、および画像ブロックが親カード内の縦の列に配置されます。次に、`justify-content: space-between`を適用すると、最初の (タイトル) 要素と最後の (画像ブロック) 要素がFlexbox<br>の端に固定され、それらの間の説明テキストが等間隔で各端点に配置されます。

```css/3
.parent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## 09. Clamping My Style: `clamp(<min>, <actual>, <max>)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/09-clamping.mp4">
  </source></video></figure>

ここでは、[ブラウザのサポート](https://caniuse.com/#feat=css-math-functions)が少ない手法についていくつか説明しますが、レイアウトとレスポンシブUI設計には非常におもしろい影響があります。このデモでは、`width: clamp(<min>, <actual>, <max>)`のようにclampを使用して幅を設定しています。

これにより、絶対最小サイズと最大サイズ、および実際のサイズが設定されます。値を使用すると、次のようになります。

```css/1
.parent {
  width: clamp(23ch, 60%, 46ch);
}
```

ここでの最小サイズは`23ch`、23文字です。最大サイズは`46ch`、46文字です。 [文字幅の単位](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)は、要素のフォントサイズ (具体的には`0`グリフの幅) に基づいています。 「実際の」サイズは50%で、これはこの要素の親幅の50%を表します。

`clamp()`関数は、50%が`46ch`より大きい (広いビューポートの場合) か`23ch`より小さい (小さいビューポートの場合) 状態になる*まで*、この要素が50%の幅を保持できるようにしています。親のサイズを拡大および縮小すると、このカードの幅が固定された最大点まで増加し、固定された最小値まで減少することがわかります。追加のプロパティを適用して中央に配置したため、親の中央に配置されたままになります。これにより、幅が広すぎたり (`46ch`以上)、押しつぶされて狭くなりすぎたり (`23ch`未満) せずに、読みやすいレイアウトが可能になります。

これは、レスポンシブタイポグラフィを実装するための優れた方法でもあります。たとえば、`font-size: clamp(1.5rem, 20vw, 3rem)`のように記述できます。この場合、見出しのフォントサイズは常に`1.5rem`から`3rem`間で固定されますが、ビューポートの幅に合わせて、実際の値の`20vw`に基づいて拡大および縮小します。

これは、最小サイズと最大サイズの値で読みやすさを確保するための優れた手法ですが、最近のすべてのブラウザでサポートされているわけではないため、必ずフォールバックを準備して、テストを行ってください。

## 10. Respect for Aspect: `aspect-ratio: <width> / <height>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4">
  </source></video></figure>

そして最後に、この最後のレイアウトツールは最も実験的なものです。最近、Chromium84でChromeCanaryに導入され、Firefoxからこれを実装するための積極的な取り組みが行われていますが、現在、安定したブラウザエディションには含まれていません。

ただし、これは非常に一般的な問題であるため、説明しておきたいと思います。つまり、それは単に画像のアスペクト比を維持することです。

`aspect-ratio`プロパティを使用して、カードのサイズを変更すると、緑色のビジュアルブロックがこの16x9のアスペクト比を維持します。`aspect-ratio: 16 / 9`でアスペクト比を維持しています。

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

このプロパティなしで16x9のアスペクト比を維持するには、[`padding-top`ハック](https://css-tricks.com/aspect-ratio-boxes/)を使用して、`56.25%`パディングを指定し、top-to-width比を設定する必要があります。ハックと割合を計算する必要性を回避するためのプロパティがまもなく用意されます。`1 / 1`比の正方形と、`2 / 1`で2:1比を作成できます。設定されたサイズ比でこの画像を調整するために必要なのはこれだけです。

```css/1
.square {
  aspect-ratio: 1 / 1;
}
```

この機能はまだ開発中ですが、特に動画やiframeに関して、私が何度も直面した多くの開発者の問題を解決するので、知っておくとよいでしょう。

## まとめ

強力な10行のCSSをお読みくださり、どうもありがとうございました。詳細については、[動画](https://youtu.be/qm0IfG1GyZU)をご覧になるか、ご自身で[デモ](https://1linelayouts.glitch.me)をお試しください。
