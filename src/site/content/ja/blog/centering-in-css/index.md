---
layout: post
title: CSSでのセンタリング
subhead: 一連のテストを実行する際に、5つのセンタリング手法に従って、変更に対して最も回復力のある手法を確認します。
authors:
  - adamargyle
description: 一連のテストを実行する際に、5つのセンタリング手法に従って、変更に対して最も回復力のある手法を確認します。
date: 2020-12-16
hero: image/admin/uz0bDoJvK4kbtjozekGA.png
thumbnail: image/admin/4NFENgpVrXHi2O42mv0K.png
codelabs: codelab-centering-in-css
tags:
  - blog
  - css
  - layout
  - intl
---

CSSでのセンタリングは、ジョークや嘲笑に満ちた悪名高い課題です。2020年のCSSはすべて大人に成長し、今では強がらずにこれらのジョークを素直に笑えるようになっています。

動画を好む方は、この記事のYouTubeバージョンをご覧ください。

{% YouTube 'ncYzTvEMCyE' %}

## チャレンジ

**センタリングにはさまざまなタイプがあります**。さまざまなユースケースがあり、センタリングするものの数などもさまざまです。「勝利を手にできる」センタリング手法の背後にある理論的根拠を示すために、私はResilience Ringer（レジリエンスリンガー）なるものを作成しました。ここれは、各センタリング戦略のバランスを取り、ユーザーがパフォーマンスを観察するための一連のストレステストです。最後に、最高得点の獲得テクニックと「最も価値のある」テクニックを明らかにします。うまくいけば、あなたは新しいセンタリングテクニックと解決策を持ち帰ることができます。

### Resilience Ringer

Resilience Ringerは、センタリング戦略は多言語レイアウト、可変サイズのビューポート、テキスト編集、および動的コンテンツに対して高い回復力を持つ必要があるという私の信念を具現化したものです。これらの信条は、センタリングテクニックが次の項目に耐えられるようにするレジリエンステストを形作る上で支えとなりました。

1. **Squished（左右の押しつぶし）:** センタリングは幅の変更に対応できる必要があります。
2. **Squashed（上下の押しつぶし）:** センタリングは高さの変更に対応できる必要があります。
3. **Duplicate（複製）:** センタリングはアイテムの数に対して動的である必要があります。
4. **Edit（編集）:** センタリングはコンテンツの長さと言語に合わせて動的に行われる必要があります。
5. **Flow（フロー）:** センタリングはドキュメントの方向と書き込みモードに依存しない必要があります。

勝利のソリューションは、左右の押しつぶし、上下の押しつぶし、複製、編集、さまざまな言語モードと方向の入れ替えが起きても、コンテンツを中央に保持することによって、その回復力を実証する必要があります。信頼できるレジリエントなセンタリングが安全なセンタリングと言えます。

#### 伝説

コンテキストにそってメタ情報を示せるよう、色による視覚的なヒントをいくつか用意しました。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4K35cL1tVpEsGqb4FgKp.png", alt="", width="800", height="438" %} <figcaption></figcaption></figure>

- ピンクの境界線は、センタリングスタイルのオーナーシップを示します。
- 灰色のボックスは、アイテムを中央に配置しようとするコンテナの背景です。
- 各子の背景色は白なので、センタリングテクニックが子ボックスのサイズに与える影響を確認できます（存在する場合）。

## 5つのテクニック

5つのセンタリングテクニックがResilience Ringerで競い、1つだけがレジリエンスの王冠を勝ち取ります👸。

### 1. コンテンツセンター

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/content-center-ringer-cycle.mp4">
  </source></video>
  <figcaption><a href="https://github.com/GoogleChromeLabs/ProjectVisBug#visbug">VisBug</a>を使用してコンテンツの編集と複製を行う</figcaption></figure>

1. **Squish**：素晴らしい！
2. **Squash**：素晴らしい！
3. **Duplicate**：素晴らしい！
4. **Edit**：素晴らしい！
5. **Flow**：素晴らしい！

`display: grid`の簡潔さと`place-content`のショートハンドに勝るのは厳しくなるようです。これは子を集合的に中央揃えと両端揃えにするため、読まれることを意図した要素グループ向けの堅実なセンタリングテクニックです。

```css
.content-center {
  display: grid;
  place-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %}-コンテンツは制約されたスペースとオーバーフローでも中央に配置されます- 中央揃えの編集とメンテナンスはすべて1つの場所で行われます - ギャップによって_n_個の子の間で等間隔が保証されます - グリッドはデフォルトで行を作成します</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">最も幅の広い子（<code data-md-type="codespan">max-content</code>）が、残りすべての幅を設定します。これについては、 <a href="#gentle-flex" data-md-type="link">ジェントルフレックス</a>で詳しく説明します。</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

段落や見出し、プロトタイプ、または一般的に読みやすいセンタリングを必要とするものを含むマクロのレイアウトに**最適です**。

{% Aside %} `place-content`は`display: grid`専用ではありません。`display: flex`にも`place-content`と`place-item`の[ショートハンド](https://codepen.io/argyleink/pen/PoqWOPZ)のメリットがあります。 {% endAside %}

### 2. ジェントルフレックス

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gentle-flex-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish**：素晴らしい！
2. **Squash**：素晴らしい！
3. **Duplicate**：素晴らしい！
4. **Edit**：素晴らしい！
5. **Flow**：素晴らしい！

ジェントルフレックスは、より真のセンタリング*限定*戦略です。`place-content: center`とは異なり、センタリング中に子のボックスのサイズが変更されないため、緩やかで柔軟性があります。可能な限り緩やかに、すべてのアイテムはスタックされ、中央に配置され、間隔が空けられます。

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 整列、方向、および均等割り付けのみを処理します - 編集とメンテナンスはすべて1つの場所で行われます - ギャップによって_n_個の子の間で等間隔が保証されます</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true"><li data-md-type="list_item" data-md-list-type="unordered">コード行数が最も多い</li></ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

マクロとミクロのレイアウトの両方に**最適です**。

{% Aside "key-term" %}**マクロレイアウト**は、国の州や準州のようなもので、非常に高レベルで広いカバレッジゾーンです。マクロレイアウトによって作成されたゾーンには、より多くのレイアウトが含まれる傾向があります。レイアウトがカバーする面が少ないほど、マクロレイアウトは小さくなります。レイアウトがカバーする面積が小さいか、含まれるレイアウトが少なければ、マイクロレイアウトは大きくなります。 {% endAside %}

### 3. オートボット

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/autobot-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish**：素晴らしい！
2. **Squash**：素晴らしい！
3. **Duplicate**：まぁまぁ
4. **Edit**：素晴らしい！
5. **Flow**：素晴らしい！

コンテナは整列スタイルなしでフレックスするように設定されていますが、直接の子は自動マージンでスタイル設定されています。`margin: auto`には、要素のすべてのサイドに適用される何となく懐かしく素晴らしいものがあります。

```css
.autobot {
  display: flex;
}
.autobot > * {
  margin: auto;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} - 楽しいトリック - 急場しのぎ</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">オーバーフローすると厄介な結果</li>
<li data-md-type="list_item" data-md-list-type="unordered">ギャップではなく均等割り付けに依存するということは、子がサイドに触れたレイアウトが発生する可能性があります。</li>
<li data-md-type="list_item" data-md-list-type="unordered">位置に「押し込む」ことは最適ではないようであり、子のボックスのサイズが変わる可能性があります。</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

アイコンや擬似要素の中央揃えに**最適です**。

### 4. ふわふわセンター

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/fluffy-center-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish**：悪い
2. **Squash**：悪い
3. **Duplicate**：悪い
4. **Edit**：素晴らしい！
5. **Flow:** 素晴らしい！（論理プロパティを使用する限り）

「ふわふわセンター」は、最もおいしい響きの候補であり、完全に要素/子が制御する唯一のセンタリングテクニックです。私たちのソロの内側のピンクのボーダーを見てください！？

```css
.fluffy-center {
  padding: 10ch;
}
```

<div class="switcher">{% Compare 'better', 'Pros' %} -コンテンツを保護します - アトミック - すべてのテストにはこのセンタリング戦略が密かに含まれています - 単語スペースはギャップです</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">役に立たないという錯覚</li>
<li data-md-type="list_item" data-md-list-type="unordered">コンテナとアイテムの間に衝突があります。当然、それぞれのサイズが固定しているためです。</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

単語やフレーズを中心とセンタリング、タグ、ピル、ボタン、チップなどに**最適です**。

### 5. ポップ＆プロップ

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/popnplop-ringer-cycle.mp4">
  </source></video></figure>

1. **Squish**：OK
2. **Squash**：OK
3. **Duplicate**：悪い
4. **Edit:** まぁまぁ
5. **Flow:** まぁまぁ

これは、絶対位置によって要素が通常のフローからはじき出されるため、「ポップ」します。名前の「プロップ」の部分は、私が他のものの上にそれをポチャンと落とす（プロップする）ことが最も役立つと思ったことに由来しています。これは、コンテンツサイズに柔軟かつ動的な、古典的で便利なオーバーレイセンタリングテクニックです。UIを他のUIの上に配置する必要がある場合もあります。

<div class="switcher">{% Compare 'better', 'Pros' %} - 便利 - 信頼できる - 必要なときに非常に貴重</div>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'worse', 'Cons' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">負のパーセンテージ値のコード</li>
<li data-md-type="list_item" data-md-list-type="unordered">内包するブロックを強制する <code data-md-type="codespan">position: relative</code> が必要</li>
<li data-md-type="list_item" data-md-list-type="unordered">早くて厄介な改行</li>
<li data-md-type="list_item" data-md-list-type="unordered">ほかの作業を行わなければ、内包するブロック当たり1つしか存在できません</li>
</ul>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

モーダル、トーストとメッセージ、スタックと深さ効果、ポップオーバーに**最適です**。

## 勝者

孤島でセンタリングテクニックを1つしか持てなかったとしたら、それは…

[ダラララララララ…（ドラムロール）]

**ジェントルフレックス**🎉

```css
.gentle-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
```

マクロレイアウトとマイクロレイアウトの両方に役立つので、私のスタイルシートではいつも使用しています。これは、私の期待にマッチする結果を出してくれる、万能で信頼性の高いソリューションです。また、私は本質的にサイジングオタクなので、このソリューションに向かう傾向があります。確かに、入力する量は多いですが、それから得るメリットの方が余分なコードよりも高いのです。

### MVP

**ふわふわセンター**

```css
.fluffy-center {
  padding: 2ch;
}
```

ふわふわセンターは非常に小さいので、センタリングテクニックとして見落としがちですが、私のセンタリング戦略の定番です。とてもアトミックなので、使っているのを忘れてしまうことがあります。

### まとめ

あなたのセンタリング戦略を破ったのはどのタイプですか？レジリエンスリンガーには他にどのようなチャレンジを追加できるでしょうか？コンテナの変換と自動高の切り替えを検討しましたが、他に何かありますか？

私のやり方がわかったところで、あなたならどのようにしますか？私たちのアプローチを多様化し、Webで構築するためのあらゆる手法を一緒に学んでいきましょう。この記事のcodelabに従って、この記事の例と同じように、独自のセンタリングの例を作ってみてください。あなたのバージョンを[私宛にツイート](https://twitter.com/argyleink)していただけば、下の[コミュニティリミックス](#community-remixes)セクションに追加します。

## コミュニティリミックス

- [ブログ記事](https://css-tricks.com/)付きの[CSSトリック](https://css-tricks.com/centering-in-css/)
