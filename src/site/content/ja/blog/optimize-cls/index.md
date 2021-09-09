---
title: Cumulative Layout Shift を最適化する
subhead: 突然のレイアウト シフトを回避し、ユーザー エクスペリエンスを改善させる方法について説明します。
authors:
  - addyosmani
date: 2020-05-05
updated: 2021-08-17
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: Cumulative Layout Shift (累積レイアウト シフト数、CLS) は、ページ内のコンテンツの突然の移動をユーザーが経験する頻度を数値化する指標です。このガイドでは、一般的に CLS を悪化させる原因となるサイズが指定されていない画像、iframe、動的コンテンツなどを最適化する方法について説明します。
alt: レイアウト シフトが発生すると、読んでいたコンテンツやクリックしようとしていたコンテンツが突然ページの下方向へと押しやられてしまい、ユーザー エクスペリエンスの低下へとつながってしまいます。レイアウト シフトの原因となる動的コンテンツのためにスペースを確保しておくことで、より快適なユーザー エクスペリエンスを実現することができます。
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88' %}

"今クリックしようと思っていたのに！どうして動いたの？😭"

レイアウト シフトは、ユーザーの集中力を乱してしまう可能性があります。記事を読み始めたときに、突然ページ内の要素が移動してしまい、驚きながらも元々読み進めていた場所をもう一度見つけなければならない状況を想像してみてください。このような出来事は、Web 上でニュースを読んでいるときや、"検索" や "カートに入れる" などのボタンをクリックするときなどによく起こります。このような体験は視覚的に不快で、イライラするものです。こういった現象は、別の要素が突然ページに追加されたり、サイズが変更されたりしたために、視覚的な要素が強制的に移動させられた場合によく発生します。

[Core Web Vitals](/vitals) 指標の 1 つである [Cumulative Layout Shift](/cls) (累積レイアウト シフト数、CLS) は、ユーザーの入力から 500 ミリ秒が経過したタイミング以降に発生したレイアウト シフトのシフト スコアを合計することによってコンテンツの不安定性を測定する指標です。この指標では、表示されているコンテンツがビューポート内でどの程度移動したか、および影響を受けた要素の移動距離が測定されます。

このガイドでは、レイアウト シフトが発生する一般的な原因とその最適化について説明を行います。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="良好なCLS値は0.1未満、不良な値は0.25を超え、その間の値は改善が必要", width="384", height="96", class="w-screenshot w-screenshot--filled width-full" %}
</picture>


CLS が低下する要因としては、一般的に以下のものが考えられます。

- サイズが指定されていない画像
- サイズが指定されていない広告、埋め込み要素、iframe
- 動的に挿入されたコンテンツ
- FOIT/FOUT の原因となる Web フォント
- ネットワークの応答を待ってから DOM を更新するアクション

## サイズが指定されていない画像 🌆

**概要:** 画像要素や動画要素には、必ずサイズ属性 `width` と `height` を指定してください。または、[CSS を駆使したアスペクト比対応ボックス](https://css-tricks.com/aspect-ratio-boxes/)を利用して必要なスペースを確保します。この方法を使用すれば、画像の読み込み中にブラウザーがドキュメント内に適切なスペースを確保できるようになります。

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">width と height が指定されていない画像。</figcaption></figure>

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">width と height が指定されている画像。</figcaption></figure>

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="画像へのサイズ指定前後での Cumulative Layout Shift の変化を示す Lighthouse レポート", width="800", height="148" %} <figcaption class="w-figcaption">画像へのサイズ指定が CLS に与える影響を示している Lighthouse 6.0 での測定結果。</figcaption></figure>

### 歴史

Web の黎明期には、開発者は `width` と `height` 属性を `<img>` タグに追加することでブラウザーが画像の取得を開始する前にページ上に十分なスペースを確保したりしていました。これにより、リフローやリレイアウトを最小限に抑えることができます。

```html
<img src="puppy.jpg" width="640" height="360" alt="風船と子犬" />
```

上に示した `width` と `height` には単位が含まれていないことにお気付きかもしれません。これらの "ピクセル" でのサイズ指定により、640x360 の領域が確保されます。画像の実際のサイズが一致しているかどうかに関わらず、画像はこのスペースに合わせて引き伸ばされます。

[レスポンシブ Web デザイン](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/)が登場したとき、開発者は `width` と `height` を省略し、代わりに以下のような CSS を使用して画像のサイズを変更するようになりました。

```css
img {
  width: 100%; /* または max-width: 100%; */
  height: auto;
}
```

この方法の欠点として、画像のダウンロードが開始され、ブラウザーがそのサイズを判断できるようになってからでないと画像用のスペースを確保できないことが挙げられます。画像が読み込まれ始めると、それぞれの画像が画面に表示されるたびにページでリフローが発生します。そのため、突然テキストが下に移動する現象が一般的に見られるようになりました。この現象は、ユーザー エクスペリエンスとして好ましいものではありません。

ここで登場するのが、アスペクト比です。画像のアスペクト比とは、画像の width と height の比率のことを指します。一般的に 2 つの数字をコロンで区切る形式によって表現されます (例: 16:9、4:3)。アスペクト比が x:y の場合、画像の幅は x 単位、高さは y 単位となります。

これはつまり、片方のサイズが分かればもう片方のサイズを計算によって明らかにできることを意味しています。アスペクト比が 16:9 の場合には、以下のように計算します。

- puppy.jpg の高さが 360px の場合、幅は 360x(16/9)=640px となります。
- puppy.jpg の幅が 640px の場合、高さは 640x(9/16)=360px となります。

アスペクト比を理解することで、ブラウザーが高さや関連する領域に対する十分なスペースを計算して確保できるようになります。

### 最新のベスト プラクティス

最近のブラウザーでは画像のデフォルトのアスペクト比を画像の width と height 属性に基づいて設定するようになっているため、レイアウト シフトの発生を防ぐためにそれらを設定しておくと便利です。CSS Working Group のおかげで、開発者は次のような形で通常通りに `width` と `height` を設定するだけでよくなりました。

```html
<!-- アスペクト比を 640:360 (16:9) に設定します -->
<img src="puppy.jpg" width="640" height="360" alt="風船と子犬" />
```

そしてすべてのブラウザーの [UA スタイルシート](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets)は、要素に設定されている既存の `width` と `height` 属性に基づいて[デフォルトのアスペクト比](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images)を追加します。

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

アスペクト比は、画像が読み込まれる前に `width` と `height` 属性に基づいて計算されます。この情報は、レイアウト計算の初期段階で供給されます。画像の幅を特定の値 (たとえば `width: 100%`) に設定するように指示があると、アスペクト比はすぐに高さの計算に使用されます。

ヒント: アスペクト比の理解が難しい場合には、便利な[計算機](https://aspectratiocalculator.com/16-9.html)をご利用ください。

上で示した画像のアスペクト比の変更は [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231) と [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891) で実装されており、[WebKit](https://twitter.com/smfr/status/1220051332767174656) (Safari) にも展開される予定です。

アスペクト比に関する詳細とレスポンシブ画像に関するさらなる考察については、「[メディアのアスペクト比を利用した無駄のないページ読み込み](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/)」を参照してください。

画像がコンテナに含まれている場合、CSS を使用して画像のサイズをこのコンテナの幅に合わせて変更することができます。画像の高さが固定値 (例: `360px`) にならないように、`height: auto;` を設定します。

```css
img {
  height: auto;
  width: 100%;
}
```

**レスポンシブ画像の場合**

[レスポンシブ画像](/serve-responsive-images)を使用する場合、`srcset` を使用してブラウザーに選択させる画像と、各画像のサイズを定義します。また、`<img>` の width と height 属性を確実に設定するために、各画像では同じアスペクト比を使用する必要があります。

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="風船と子犬"
/>
```

[アート ディレクション問題](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)への対応

ページでは、ビューポートが狭い場合には画像をトリミングして表示し、デスクトップ環境ではフルサイズの画像を表示するとよいでしょう。

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="風船と子犬" />
</picture>
```

これらの画像にはアスペクト比が異なるものが指定される可能性があり、ブラウザーはすべてのソースでサイズを指定するべきかどうかを含めて最も効果的な解決策を検討しています。解決策が決定されるまでは、ここではリレイアウトが可能です。

## サイズが指定されていない広告、埋め込み要素、iframe 📢😱

### 広告

広告は、Web 上で発生するレイアウト シフトに最も大きな影響を与える要素の 1 つです。広告ネットワークやパブリッシャーはしばしば動的な広告サイズの変更をサポートしています。多彩な広告サイズによってクリック率が高くなればより多くの広告がオークションに参加して競い合うことになるため、パフォーマンスと収益が向上します。しかしながら、残念なことに広告によって表示コンテンツがページの下へと追いやられてしまうため、最適なユーザー エクスペリエンスが得られなくなってしまう可能性があります。

広告のライフサイクルの中では、以下のような多くのポイントでレイアウト シフトが発生する可能性があります。

- サイトが DOM に広告コンテナを挿入するとき
- サイトがファーストパーティ コードを使用して広告コンテナのサイズを変更するとき
- 広告タグ ライブラリが読み込まれる (それによって広告コンテナのサイズが変更される) とき
- 広告がコンテナ内を表示される (最終的な広告のサイズが異なるためにサイズが変更される) とき

以下に示すようなサイト上で発生する広告によるレイアウト シフトを減らすためのベスト プラクティスに従うことで、レイアウト シフトを軽減することができます。

- 広告スロットのスペースを静的に確保します。
    - つまり、広告タグ ライブラリが読み込まれる前に要素にスタイルを設定するのです。
    - コンテンツ フロー内に広告を配置する場合には、スロットのサイズを確保しておくことで確実にレイアウト シフトを回避します。こういった広告については、画面外で読み込まれる場合でもレイアウト シフトが*発生しないようにする必要があります*。
- ビューポートの最上部付近に位置が固定されていない広告を配置する場合には注意が必要です。
    - 以下の例では、広告を "WORLD VISION" のロゴの下に移動し、スロット用に十分なスペースを確保しておくことをお勧めします。
- 広告スロットが表示されているのに広告が返されていない場合には、プレースホルダーを表示することで確保されたスペースを崩さないようにします。
- 可能な限り大きいサイズを広告スロット用に確保することで、レイアウト シフトを回避することができます。
    - 有効な方法ではありますが、最大値よりも小さな広告クリエイティブがスロットに表示された場合に空白のスペースが生まれてしまうリスクがあります。
- 過去のデータに基づき、対象の広告スロットに最適なサイズを選択しましょう。

サイトによっては、広告スロットが埋まりそうにない場合に最初に枠を潰してしまうことでレイアウト シフトを抑えられる場合があります。広告配信を自分でコントロールしない限りは、正確なサイズを毎回簡単に選択する方法はありません。

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">十分なスペースが確保されていない広告。</figcaption></figure>

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">十分なスペースが確保されている広告。</figcaption></figure>

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="広告などのバナー用のスペースを確保する前後での Cumulative Layout Shift の変化を示す Lighthouse レポート", width="800", height="148" %} <figcaption class="w-figcaption">バナー用のスペースの確保が CLS に与える影響を示している Lighthouse 6.0 での測定結果</figcaption></figure>

#### 広告スロットのスペースを静的に確保する

タグ ライブラリに渡されたものと同じサイズになるようにスロットの DOM 要素を静的にスタイル設定します。これにより、ライブラリの読み込み時にレイアウト シフトが発生しないようにすることができます。これを行わないと、ページがレイアウトされた後にライブラリがスロット要素のサイズを変更してしまう可能性があります。

また、比較的サイズが小さい広告の配信についてもご検討ください。比較的小さな広告が配信されれば、パブリッシャーがコンテナに (比較的大きな) サイズを設定することにより、レイアウト シフトの発生を防止することができます。この方法の欠点として空白のスペースが増えてしまうことが挙げられますので、この点を念頭に置いてご検討ください。

#### ビューポートの最上部付近への広告配置を避ける

ビューポートの上部に位置する広告は、中央に位置する広告に比べてより大きなレイアウト シフトを引き起こしてしまう可能性があります。これは、上部に位置する広告は自然と下方向に位置するコンテンツが多くなってしまうために、広告によるレイアウト シフトが発生した場合に移動させてしまう要素が必然的に多くなることが原因です。逆にビューポートの中央付近に位置する広告は、上部に位置する広告に比べてレイアウトシフトが発生した場合に移動させてしまうコンテンツが比較的少なくなります。

### 埋め込み要素と iframe

埋め込みが可能なウィジェットを使用すると、移動が可能な Web コンテンツをページ内に埋め込むことができるようになります (たとえば、YouTube の動画、Google マップの地図、ソーシャル メディアの投稿など)。こういった埋め込みには、さまざまな形式が存在します。

- HTML フォールバックや、そのフォールバックをリッチな埋め込み要素へと変換する JavaScript タグ。
- インライン HTML スニペット
- iframe を使用した埋め込み要素

こういった埋め込み要素は埋め込まれる要素の大きさを事前に把握していない場合が多く (たとえばソーシャル メディアの投稿を埋め込む場合に、画像や動画、複数行に渡るテキストなどがそこに含まれているかどうか)、そのため、埋め込みを提供しているプラットフォームがその埋め込み要素を表示するために十分なスペースを確保できない場合があり、最終的に読み込まれたときにレイアウト シフトが発生してしまう場合があります。

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">スペースを確保せずに埋め込まれる場合。</figcaption></figure>

  <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">スペースが確保された状態で埋め込まれる場合。</figcaption></figure>

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="埋め込み要素のためのスペースを確保する前後での Cumulative Layout Shift の変化を示す Lighthouse レポート", width="800", height="148" %} <figcaption class="w-figcaption">埋め込み要素のためのスペースの確保が CLS に与える影響を示している Lighthouse 6.0 での測定結果</figcaption></figure>

これを回避するためには、プレースホルダーやフォールバックを使用して埋め込み要素を表示するために十分なスペースを事前に計算し、CLS を最小限に抑える必要があります。以下に、埋め込みに利用可能なワークフローの 1 つをご紹介します。

- ブラウザーの開発ツールを使用して最終的な埋め込み要素の高さを確認する
- 埋め込み要素が読み込まれると包含されている iframe のサイズも調整され、それに合わせてコンテンツのサイズも調整される。

サイズに注意を払い、それに合わせて埋め込み用のプレースホルダーのスタイルを設定してください。広告やプレースホルダーのサイズが規格ごとに微妙に異なる場合には、メディア クエリを使用して調整する必要が生じる可能性があります。

### 動的コンテンツ 📐

**概要:** ユーザーの操作に対する応答以外で、既存のコンテンツの上側にコンテンツを挿入することは避けてください。こうしておくことで、レイアウト シフトが発生したとしても、その影響を想定内に留めておくことができるようになります。

サイトの読み込みの際に、ビューポート内の上部または下部に UI が表示され、レイアウト シフトが発生したことがあるという方がいらっしゃるかもしれません。広告と同じように、バナーやフォームによってページ内のコンテンツが移動させられてしまうことがよくあります。

- "ニュースレターにサインアップしましょう！" (おいおい、落ち着けって。さっき見たばかりだよ！)

- "関連コンテンツ"

- "[iOS/Android] アプリをインストールしましょう"

- "まだまだ注文受付中です"

- "GDPR に基づく通知"

    <figure class="w-figure">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %} <figcaption class="w-figcaption">スペースが確保されていない動的コンテンツ。</figcaption></figure>

このようなタイプの UI アフォーダンスを表示しなければならない場合には、事前にビューポート内に十分なスペースを確保し (たとえば、プレースホルダーやスケルトン UI を使用しましょう)、読み込み時にページ内のコンテンツが大幅に移動してしまわないようにしましょう。

場合によっては、コンテンツの動的な追加がユーザー エクスペリエンスにとって重要な要素となることがあります。たとえば、商品リストに商品を追加する場合や、ライブ フィードのコンテンツを更新する場合などです。そういった場合に予期しないレイアウト シフトを回避する方法には、以下のようなものがあります。

- サイズが固定されたコンテナ内で、古いコンテンツを新しいコンテンツで置き換えるか、トランジション後にカルーセルを使用して古いコンテンツを削除します。新しいコンテンツが追加されている最中に誤ってクリックやタップを行なってしまうことがないよう、トランジションが完了するまでの間はリンクやコントロールを必ず無効にしてください。
- 新しいコンテンツの読み込みをユーザーが主導するようにし、ユーザーがコンテンツの変化に驚かされることがないようにします (たとえば、"続きを読む" や "更新" ボタンなどを使用しましょう)。その場合に、ユーザーによる操作の前にコンテンツを事前取得しておくことで、すぐに表示されるようにすることをお勧めします。また、ユーザーが入力を行なってから 500 ミリ秒以内に発生したレイアウト シフトは CLS の対象にならないことを覚えておきましょう。
- 画面外のコンテンツをシームレスに読み込み、ユーザーに利用可能であることをオーバーレイで通知しましょう (たとえば、"上にスクロール" ボタンなど)。

<figure class="w-figure">{% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="予期しないレイアウト シフトを発生させることなく動的コンテンツを読み込む場合の例 (Twitter と Chloé の Web サイトより)", width="800", height="458" %} <figcaption class="w-figcaption">動的コンテンツを読み込んでも予期しないレイアウト シフトが発生しない場合の例。左: Twitter でのライブ フィード コンテンツの読み込み。右: Chloé の Web サイトでの "Load More" (続きを読む) の例。YNAP チームによる<a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">追加コンテンツを読み込む場合の CLS の最適化方法</a>をご確認ください。</figcaption></figure>

### FOIT/FOUT の原因となる Web フォント 📝

Web フォントのダウンロードとレンダリングが行われる場合、以下のような 2 つのパターンでレイアウト シフトが発生する可能性があります。

- フォールバック フォントが新しいフォントと入れ替わる場合 (FOUT - スタイルが設定されていないテキストの瞬間的表示。Flash of unstyled text の略)。
- 新しいフォントのレンダリングが完了するまでの間、"非表示" のテキストが表示される場合 (FOIT - 非表示テキストの瞬間的表示。Flash of invisible text の略)。

以下のツールを使用することで、この現象を最小限に抑えることができます。

- <code>[font-display](/font-display/)</code> では、<code>auto</code>、<code>swap</code>、<code>block</code>、<code>fallback</code>、<code>optional</code> などの値を使用してカスタム フォントのレンダリング動作を修正することができます。残念ながら、これらの値 ([optional](http://crrev.com/749080) を除く) はすべて上に示したパターンのいずれかによるリレイアウトを引き起こしてしまう可能性があります。
- [Font Loading API](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api) を使用すれば、必要なフォントの取得にかかる時間を短縮することができます。

Chrome 83 の公開時点では、以下も方法もお勧めできます。

- 主な Web フォントに `<link rel=preload>` を使用する: 事前読み込みされたフォントは初期の描画に含まれている可能性が高く、その場合にはレイアウト シフトは発生しません。
- `<link rel=preload>` と `font-display: optional` を組み合わせる

詳細については、「[オプションのフォントを事前読み込みすることにより、レイアウト シフトや非表示テキストの瞬間的表示 (FOIT) を防ぐ](/preload-optional-fonts/)」を参照してください。

### アニメーション 🏃‍♀️

**概要:** レイアウト シフトの原因となるプロパティを利用したアニメーションを、`transform` アニメーションに置き換えます。

CSS プロパティの値が変更されると、ブラウザーがその変更に対応しなければならなくなります。`box-shadow` や `box-sizing` などを含む多くの値が、リレイアウト、描画、コンポジットを引き起こします。そして、簡単に変更が可能な CSS プロパティは多数存在します。

レイアウト変更のトリガーとなる CSS プロパティについては、「[CSS のトリガー](https://csstriggers.com/)」および「[パフォーマンスの高いアニメーション](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)」を参照してください。

### 開発者ツール 🔧

喜ばしいことに、Cumulative Layout Shift (CLS) の測定やデバッグを行うためのツールは、以下に示すようにたくさんのものが存在します。

[Lighthouse](https://developers.google.com/web/tools/lighthouse) [6.0](https://github.com/GoogleChrome/lighthouse/releases) 以降では、ラボ設定での CLS の測定がサポートされています。また、このリリースにおいては、レイアウト シフトを最も多く発生させているノードが強調表示されます。

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="Lighthouse 6.0 では、Metrics (指標) セクションで CLS を測定することが可能です", width="800", height="309" %}

DevTools の[パフォーマンス パネル](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)では、Chrome 84 以降 **Experience** (エクスペリエンス) セクションでレイアウト シフトが強調表示されています。`Layout Shift` レコードの **Summary** (概要) ビューでは、Cumulative Layout Shift のスコアに加えて影響を受ける範囲を示す四角形のオーバーレイが表示されます。

<figure class="w-figure">{% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Experience セクションを展開し、Layout Shift レコードが表示されている Chrome DevTools のパフォーマンス パネル", width="800", height="438" %} <figcaption class="w-figcaption">パフォーマンス パネルで新しいトレースを記録すると、結果を示す <b>Experience</b> セクションには <code>Layout Shift</code> レコードを表す赤色のバーが表示されます。レコードをクリックすることで、影響を受ける要素を詳細に確認することができます (例: エントリの Moved from (移動元) や Moved to (移動先) を確認する)。</figcaption></figure>

また、[Chrome User Experience Report](/chrome-ux-report-bigquery/) を使用し、オリジンレベルで集計される実際の環境での CLS を測定することも可能です。CrUX の CLS データは BigQuery を介して利用することができ、CLS のパフォーマンスを確認するための[サンプル クエリ](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql)が利用可能です。

このガイドの内容は以上となります。この記事が少しでもあなたのページのレイアウト シフトを減らす手助けとなれば嬉しいです。

*レビューしていただいた Philip Walton、Kenji Baheux、Warren Maresca、Annie Sullivan、Steve Kobes、Gilberto Cocchi には、心より感謝申し上げます。*
