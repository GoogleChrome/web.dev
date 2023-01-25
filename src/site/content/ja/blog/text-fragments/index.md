---
title: 'これは人類最初の試みとして、驚異に満ちたリンクの物語である: テキストフラグメント'
subhead: |2-

  テキストフラグメントを使用すると、URLフラグメントでテキストスニペットを指定できます。
  このようなテキストフラグメントを含むURLに移動する場合、ブラウザはそれを強調したりユーザーの注意を引いたりすることができます。
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: |2-

  テキストフラグメントを使用すると、URLフラグメントでテキストスニペットを指定できます。
  このようなテキストフラグメントを含むURLに移動する場合、ブラウザはそれを強調したりユーザーの注意を引いたりすることができます。
tags:
  - blog
  - capabilities
feedback:
  - api
---

## フラグメント識別子

Chrome80は大きなリリースでした。これには、[WebワーカーのECMAScriptモジュール](/module-workers/)、 [Null合体](https://v8.dev/features/nullish-coalescing)、[オプションのチェーン](https://v8.dev/features/optional-chaining)など、非常に期待されている機能が多数含まれていました。このリリースは、いつものように、Chromiumブログの[ブログ記事](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)を通じて発表されました。下のスクリーンショットはそのブログ記事の抜粋です。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %} <figcaption><code>id</code>属性を持つ要素の周りに赤いボックスが付いたChromiumのブログ記事。</figcaption></figure>

すべての赤いボックスが何を意味するのかを考えているのではないでしょうか。これらは、DevToolsで次のスニペットを実行した結果です。`id`属性を持つすべての要素が強調表示されています。

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

[フラグメント識別子](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment)のお陰で、赤いボックスで強調表示された要素にディープリンクを作成することができます。これは、後で、ページのURLの[ハッシュ](https://developer.mozilla.org/docs/Web/API/URL/hash)で使用できるようになります。横にある「*[プロダクトフォーラム](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)にフィードバックを送信*」ボックスにディープリンクを作成するとした場合、手動でURL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#HTML1</mark></code></a>とすることで作成することができます。DevToolsの要素パネルに表示されているとおり、対象の要素には`id`属性と値`HTML1`があります。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width="600", height="97" %} <figcaption>要素の<code>id</code>を表示するDevTools。</figcaption></figure>

このURLをJavaScriptの`URL()`コンストラクターで解析すると、さまざまなコンポーネントが表示されます。値が`#HTML1`を持つ`hash`プロパティに注目してください。

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Creates a new `URL` object
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

ただし、DevToolsを開かなければ要素の`id`を見つけられないということは、ブログ記事の作成者がページのこの特定のセクションにリンクする必要があることを示す可能性があります。

`id`を使わずに何かにリンクしたい場合はどうなるでしょうか。*ECMAScript Modules in Web Workers*ヘッダーにリンクするとしましょう。下のスクリーンショットでわかるように、問題の`<h1>`には`id`属性がありません。つまり、この見出しにリンクする方法はないということです。テキストフラグメントを使用すると、この問題を解決できます。

<figure>% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption><code>id</code>のない見出しを表示するDevTools。</figcaption></figure>

## テキストフラグメント

[テキストフラグメント](https://wicg.github.io/ScrollToTextFragment/)の提案は、URLハッシュにテキストスニペットを指定するためのサポートを追加します。このようなテキストフラグメントを含むURLに移動する場合、ユーザーエージェントはそれを強調したり、ユーザーの注意を引くことができます。

### ブラウザの互換性

テキストフラグメント機能は、バージョン80以降のChromiumベースのブラウザでサポートされています。これを書いている時点では、SafariとFirefoxはこの機能を実装する意図を公に示していません。SafariとFirefoxのディスカッションへのポインタは、[関連リンク](#related-links)を参照してください。

{% Aside 'success' %}これらのリンクは、Twitterなどの一部の一般的なサービスが使用する[クライアント側のリダイレクト](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections)を介して配信される場合には機能しませんでした。この問題は[crbug.com/1055455](https://crbug.com/1055455)として追跡されていましたが、現在では修正されています。通常の[HTTPリダイレクト](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle)は常に正常に機能していました。 {% endAside %}

[セキュリティ](#security)上の理由から、この機能ではリンクを[`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener)コンテキストで開く必要があります。したがって、 `<a>`アンカーマークアップに[`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel)を含めるか、ウィンドウ機能フィーチャーの`Window.open()`リストに[`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener)を追加してください。

### `textStart`

テキストフラグメントの構文、最も単純な形式では次のようになります。ハッシュ記号`#`の後に`:~:text=`が続き、最後に`textStart`という、リンクする[パーセントエンコードされた](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)テキストを表すコードを入力します。

```bash
#:~:text=textStart
```

たとえば、[Chrome 80の機能を発表するブログ記事](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)のなかで、「*ECMAScript Modules in Web Workers*」という見出しにリンクするとした場合、このURLは次のようになります。

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=ECMAScript%20Modules%20in%20Web%20Workers</mark></code></a>

テキストフラグメントは<mark class="highlight-line highlight-line-active">このように</mark>が強調されます。Chromeなどのサポートブラウザでこのリンクをクリックすると、テキストフラグメントが強調表示され、スクロールして表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption>テキストフラグメントはスクロールして表示され、強調表示されます。</figcaption></figure>

### `textStart`と`textEnd`

では、「*ECMAScript Modules in Web Workers*」というタイトルの見出しだけでなく、*セクション*全体にリンクするにはどうすればよいでしょうか？セクションのテキスト全体をパーセントエンコードすると、URLがありえないほど長くなります。

幸いなことに、もっと良い方法があります。テキスト全体ではなく、`textStart,textEnd`構文を使用して目的のテキストをフレーム化する方法です。したがって、目的のテキストの先頭にパーセントエンコードされた単語と目的のテキストの終わりにパーセントエンコードされた単語をカンマ（`,`）区切りで指定します。

これは次のようになります。

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.</mark></code></a> 。

`textStart`の`ECMAScript%20Modules%20in%20Web%20Workers`、コンマ（`,`）、そして`textEnd`として`ES%20Modules%20in%20Web%20Workers.`となっています。Chromeなどのサポートされているブラウザでクリックすると、セクション全体が強調表示され、スクロールして表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2yTYmKnjHTnqXkcmHF1F.png", alt="", width="400", height="343" %} <figcaption>スクロール表示され、強調表示されたテキストフラグメント。</figcaption></figure>

`textStart`と`textEnd`の選択について疑問に思うかもしれません。実際には、わずかに短いURL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=ECMAScript%20Modules,Web%20Workers.</mark></code></a>で、両側に2つの単語しか使用しなくてもよいでしょう。`textStart`と`textEnd`を以前の値と比較してください。

`textStart`と`textEnd`の両方に1つの単語しか使用しない場合、問題が発生していることがわかります。URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=ECMAScript,Workers.</mark></code></a>はさらに短くなりましたが、強調表示されたテキストフラグメントは本来求めていたものではなくなりました。強調表示は、最初に出現する`Workers.`で停止し、これは正しい動作ではありますが、私が強調しようとしたものではありません。問題は、目的のセクションは、現在の一単語のみの`textStart`と`textEnd`の値では一意に識別されていないということです。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption>意図しないテキストフラグメントがスクロール表示され、強調表示されています。</figcaption></figure>

### `prefix-`と`-suffix`

`textStart`と`textEnd`で十分な長さの値を使用することが、一意のリンクを取得するための1つのソリューションです。ただし、状況によっては、これが不可能な場合もあります。ちなみに、なぜChrome 80リリースのブログ記事を例として選んだのでしょうか？このリリースでテキストフラグメントが導入されたからです。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="ブログ記事のテキスト: テキストURLフラグメント。ユーザーまたは作成者は、URLに指定するテキストフラグメントを使用してページの特定の部分にリンクできるようになりました。ページが読み込まれると、ブラウザはテキストを強調表示し、そのフラグメントまでスクロールして表示します。たとえば、以下のURLは、「Cat」のwikiページを読み込み、「text」パラメーターにリストされているコンテンツまでスクロールします。", width="800", height="200" %} <figcaption>テキストフラグメントの発表ブログ記事の抜粋。</figcaption></figure>

上のスクリーンショットで「テキスト」という単語が4回表示されていることに注目してください。 4番目の出現は緑色のコードフォントで書かれています。この特定の単語にリンクする場合は、 `textStart`を`text`に設定します。「テキスト」という単語は1つの単語だけなので、 `textEnd`は存在できません。どうすればよいでしょうか？URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=text</mark></code></a>とすると、見出しにも「Text」が存在するため、最初の出現で一致してしまいます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption>「Text」の最初の出現に一致するテキストフラグメント。</figcaption></figure>

{% Aside 'caution' %}テキストフラグメントの一致では大文字と小文字が区別されないことに注意してください。 {% endAside %}

幸いなことに解決策があります。このようなケースでは、`prefix​-`と`-suffix`を指定することができます 。緑のコードフォントの「text」の前の単語は「the」で、後の単語は「parameter」です。ほかの3つの「Text」の出現には、これと同じ前後の単語がありません。この知識を使って、前のURLを微調整して、`prefix-`と`-suffix`を追加できます。他のパラメーターと同様に、これらもパーセントエンコードする必要があり、複数の単語を含めることができます。 <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=the-,text,-parameter</mark></code></a> 。パーサーが`prefix-`と`-suffix`をはっきりと識別できるようにするに 、`textStart`から分離し、オプションの`textEnd`にはダッシュ`-`を使用します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %}<figcaption> 「テキスト」の目的のオカレンスでのテキストフラグメントの一致。</figcaption></figure>

### 完全な構文

テキストフラグメントの完全な構文を以下に示します。（角括弧はオプションのパラメーターを示します。）すべてのパラメーターの値はパーセントエンコードする必要があります。これは特に、ダッシュ`-` 、アンパサンド`&` 、およびコンマ`,`文字の場合に特に重要であるため、テキストディレクティブ構文の一部として解釈されていません。

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

`prefix-`、`textStart`、`textEnd`、および`-suffix`はそれぞれ、単一の[ブロックレベル要素](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements)内のテキストに一致しますが、完全な`textStart,textEnd`の範囲は複数のブロックにまたがる*ことができます*。たとえば、 `:~:text=The quick,lazy dog`は次の例では失敗します。これは開始文字列の「The quick」が単一の中断されないブロックレベル要素内に表示されないためです。

```html
<div>
  The
  <div></div>
  quick brown fox
</div>
<div>jumped over the lazy dog</div>
```

ただし、この例では一致します。

```html
<div>The quick brown fox</div>
<div>jumped over the lazy dog</div>
```

### ブラウザ拡張機能を使ってテキストフラグメントURLを作成する

テキストフラグメントのURLを手動で作成することは、特にそれらが一意であることを確認する場合には面倒です。本当に必要な場合は、仕様にいくつかのヒントがあり、 [テキストフラグメントURLを生成するための正確な手順](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives)がリストされています。 [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment)と呼ばれるオープンソースのブラウザ拡張機能を提供しています。この拡張機能を使用すると、テキストを選択し、コンテキストメニューの[選択したテキストにリンクをコピー]をクリックして任意のテキストにリンクできます。この拡張機能は、次のブラウザで使用できます。

- [Google Chrome用Link to Text Fragment](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [Microsoft Edge用Link to Text Fragment](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [Mozilla Firefox用Link to Text Fragment](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [Apple Safari用Link to Text Fragment](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %} <figcaption><a href="https://github.com/GoogleChromeLabs/link-to-text-fragment"> Link to Text Fragment </a>ブラウザ拡張機能</figcaption></figure>

### 1つのURLに複数のテキストフラグメント

1つのURLに複数のテキストフラグメントが表示される可能性があることに注意してください。特定のテキストフラグメントは、アンパサンド文字で`&`区切る必要があります。ここに、3つのテキストフラグメントを含むリンクの例を示します。<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet<mark class="highlight-line highlight-line-active"></code></a>。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %} <figcaption>1つのURLの3つのテキストフラグメント。</figcaption></figure>

### 要素とテキストフラグメントの混合

従来の要素フラグメントをテキストフラグメントと組み合わせることができます。同一のURLに両方のフラグメントを含めることにまったく問題はないため、たとえばページの元のテキストが変更したことでテキストフラグメントが一致しなくなった場合の意味のあるフォールバックを提供することができます。「*Give us feedback in our [Product Forums](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)*」セクションにリンクするURL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html<mark class="highlight-line highlight-line-active">#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.</mark></code></a> には、要素フラグメント（`HTML1`）だけでなく、テキストフラグメント（`text=Give%20us%20feedback%20in%20our%20Product%20Forums.`）の両方が含まれています。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt="", width="237", height="121" %} <figcaption>要素フラグメントとテキストフラグメントの両方を使用したリンク。</figcaption></figure>

### フラグメントディレクティブ

まだ説明していない構文の要素が1つあります。それは、フラグメントディレクティブ`:~:`です。上記のような既存のURL要素フラグメントとの互換性の問題を回避するために、 [Text Fragments仕様](https://wicg.github.io/ScrollToTextFragment/)にはフラグメントディレクティブが導入されています。`:~:`というコードシーケンスで区切られたURLフラグメントの一部です。`text=`などのユーザーエージェント命令用に予約されており、作成者のスクリプトが直接対話できないように、読み込み中にURLから削除されます。ユーザーエージェント命令は、*ディレクティブ*とも呼ばれます。そのため、具体的なケースでは、 `text=`*はテキストディレクティブ*と呼ばれます。

### 機能の検出

サポートを検出するには、 `document`に`fragmentDirective`プロパティがあるかをテストします。フラグメントディレクティブは、URLがドキュメントではなくブラウザに向けられた命令を指定するためのメカニズムです。これは、作成者スクリプトとの直接の対話を回避することを目的としているため、既存のコンテンツに重大な変更を加える心配なく、将来のユーザーエージェント命令を追加できます。たとえば、翻訳のヒントを追加する可能性があります。

```js
if ('fragmentDirective' in document) {
  // Text Fragments is supported.
}
```

{% Aside %} Chrome80からChrome85まで、 `fragmentDirective`プロパティは`Location.prototype`で定義されていました。この変更の詳細については、[WICG/scroll-to-text-fragment#130](https://github.com/WICG/scroll-to-text-fragment/issues/130)を参照してください。 {% endAside %}

機能検出は主に、リンクが動的に生成され（たとえば、検索エンジンによって）、それらをサポートしていないブラウザへのテキストフラグメントリンクの提供を回避する場合を対象としています。

### テキストフラグメントのスタイル付け

デフォルトでは、ブラウザは[`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark)のスタイル（通常、`mark`のCSS[システムカラー](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors)である黄色に黒）と同じスタイルをテキストフラフメントにも設定します。ユーザーエージェントのスタイルシートには、次のようなCSSが含まれています。

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

ご覧のとおり、ブラウザは、適用された強調表示をカスタマイズするために使用できる[`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text)という疑似セレクターを公開します。たとえば、テキストフラグメントを赤い背景に黒いテキストになるようにデザインできます。いつものように、オーバーライドのスタイルがアクセシビリティの問題を引き起こさないように[色のコントラストを確認](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast)し、ハイライトが実際に他のコンテンツから視覚的に目立つようにしてください。

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### ポリフィル可能性

テキストフラグメント機能は、ある程度ポリフィルすることができます。機能がJavaScriptで実装されているテキストフラグメントの組み込みサポートを提供しないブラウザ用に[、拡張機能](https://github.com/GoogleChromeLabs/link-to-text-fragment)によって内部的に使用される[ポリフィル](https://github.com/GoogleChromeLabs/text-fragments-polyfill)を提供します。

### プログラムによるテキストフラグメントリンクの生成

[ポリフィル](https://github.com/GoogleChromeLabs/text-fragments-polyfill)には、インポートしてテキストフラグメントリンクを生成するために使用できる`fragment-generation-utils.js`が含まれています。これは、以下のコードサンプルで概説されています。

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### 分析目的でのテキストフラグメントの取得

多くのサイトがルーティングにフラグメントを使用しているため、ブラウザはそれらのページを壊さないようにテキストフラグメントを取り除きます。分析目的などでテキストフラグメントのリンクをページに公開する[必要があることは認められています](https://github.com/WICG/scroll-to-text-fragment/issues/128)が、提案されたソリューションはまだ実装されていません。今のところ回避策として、以下のコードを使用して必要な情報を抽出できます。

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### セキュリティ

[テキストフラグメントディレクティブは、ユーザーのアクティブ化の](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation)結果である完全な（同じページではない）ナビゲーションでのみ呼び出されます。さらに、宛先とは異なるオリジンから発信されたナビゲーションでは、宛先のページが十分に分離されていることがわかるように[`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener)コンテキストで発生する必要があります。テキストフラグメントディレクティブは、メインフレームにのみ適用されます。つまり、テキストはiframe内で検索されず、iframeナビゲーションでテキストフラグメントを呼び出すことはできません。

### プライバシー

テキストフラグメントがページで見つかったかどうかに関係なく、テキストフラグメント仕様の実装がリークしないことが重要です。要素フラグメントは元のページ作成者の完全な制御下にありますが、テキストフラグメントは誰でも作成できます。上記の　　例では、`<h1>`に`id`がなかったために、「*ECMAScript Modules in Web Workers* 」という見出しにリンクできなかったことを思い出してください。それでは、どうすれば、テキストフラグメントを慎重に作成することで、誰もがどこにでもリンクできるというのでしょうか。

悪意のある`evil-ads.example.com`という広告ネットワークを運営しているとしましょう。さらに、広告用のiframeの1つでは、ユーザーが広告と対話したら、テキストフラグメントURL <code>dating.example.com<mark class="highlight-line highlight-line-active">#:~:text=Log%20Out</mark></code>を使って、`dating.example.com`への隠しクロスオリジンiframeを動的に作成したことを想像してください。「Log Out」というテキストがあれば、犠牲者は現在`dating.example.com`にログイン中であることになるため、プロファイリングに使用することができます。テキストフラグメントの実装は悪意があるなどを認識しないことから、正しく一致するとフォーカスが切り替わるようにできるため、`evil-ads.example.com`で、`blur`イベントをリスンして一致が発生したことを知ることができます。Chromeでは、このようなシナリオを実現できないようにテキストフラグメントが実装されています。

他には、スクロールの位置に応じてネットワークトラフィックを悪用する攻撃があります。会社のイントラネットの管理者のように、被害者のネットワークトラフィックログにアクセスできたとしましょう。次に、人事関連の「*What to Do If You Suffer From…*（次のような症状への対策）」という長いドキュメントがあり、*burn out*（燃え尽き）、*anxiety*（不安）などの症状のリストがあるとします。各項目の横に追跡用のピクセルを配置し、ドキュメントの読み込みが、たとえば「*burn out*」項目の追跡ピクセルの読み込みと一時的に同時に発生することがわかったなら、イントラネット管理者として、機密情報であり、誰にも表示されないと社員が思い込んでいる「`:~:text=burn%20out`」を使ったテキストフラグメントのリンクを社員がクリックしたと判定することができます。この例は、多少工夫されており、*非常に*具体的な前提条件が満たされることで悪用が成り立つため、Chromeのセキュリティチームはナビゲーションにスクロールを実装するリスクを管理可能と評価しました。他のユーザーエージェントは、代わりに手動のスクロールUI要素を表示するように決定している場合があります。

オプトアウトを希望するサイトの場合、Chromiumは送信可能な[ドキュメントポリシー](https://wicg.github.io/document-policy/)ヘッダー値をサポートしているため、ユーザーエージェントはテキストフラグメントURLを処理しません。

```bash
Document-Policy: force-load-at-top
```

## テキストフラグメントの無効化

この機能を無効にする最も簡単な方法は、HTTPレスポンスヘッダーを注入できる拡張機能を使用することです。たとえば、[ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)（非Google製品）を使用すると、次のようにレスポンス（*リクエストではありません*）ヘッダーを挿入することができます。

```bash
Document-Policy: force-load-at-top
```

オプトアウトするもう1つの方法は、より複雑ではありますが、エンタープライズ設定の[`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled) を使用することです。macOSでこれを行うには、以下のコマンドをターミナルに貼り付けます。

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

Windowsの場合は、[Google Chrome Enterpriseヘルプ](https://support.google.com/chrome/a/answer/9131254?hl=en)サポートサイトのドキュメントに従ってください。

{% Aside 'warning' %}これは、操作内容を理解している場合に限り試してください。 {% endAside %}

## Web検索のテキストフラグメント

一部の検索では、Google検索エンジンは、関連するWebサイトのコンテンツスニペットによってクイックアンサーまたは要約を提供します。これらの*注目のスニペット*は、検索が質問の形式である場合に表示される可能性が最も高くなります。注目のスニペットをクリックすると、ユーザーはソースWebページの注目のスニペットテキストに直接移動します。この動作は、自動的に作成されたテキストフラグメントURLによるものです。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %} <figcaption>注目のスニペットを表示するGoogle検索エンジンの結果ページ。ステータスバーにはテキストフラグメントURLが表示されている。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %} <figcaption>クリックすると、ページの関連するセクションがスクロールされて表示される。</figcaption></figure>

## まとめ

テキストフラグメントURLは、Webページ上の任意のテキストにリンクするための強力な機能です。これを使用すると、学術コミュニティは非常に正確な引用または参照リンクを提供でき、検索エンジンはページ上のテキスト結果にディープリンクを作成できます。また、ソーシャルネットワーキングサイトは、アクセスできないスクリーンショットではなく、ユーザーがWebページの特定の一節を共有できるようにすることができます。[テキストフラグメントURLを使用](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet)し、便利であることに気づいていただければと思います。[Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment)ブラウザ拡張機能をぜひインストールしてください。

## 関連リンク

- [Spec draft](https://wicg.github.io/scroll-to-text-fragment/)
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/392)
- [Chrome Platform Status ページ](https://chromestatus.com/feature/4733392803332096)
- [Chromeのバグトラッカー](https://crbug.com/919204)
- [Intent to Shipスレッド](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [WebKit-Devスレッド](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Mozilla standards positionスレッド](https://github.com/mozilla/standards-positions/issues/194)

## 謝辞

テキストフラグメントは、[Grant Wang](https://github.com/grantjwang)の貢献とともに、[Nick Burris](https://github.com/nickburris)と[David Bokan](https://github.com/bokand)によって実装され、仕様に含まれました。この記事を徹底的にレビューしてくれた[Joe Medley](https://github.com/jpmedley)に感謝しています。ヒーロー画像提供: [Greg Rakozy](https://unsplash.com/@grakozy)（[Unsplash](https://unsplash.com/photos/oMpAz-DN-9I)）。
