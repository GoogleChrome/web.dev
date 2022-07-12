---
layout: post
title: 今こそ、オフスクリーンiframeの遅延読み込み
subhead: iframe用のブラウザレベルのビルトイン遅延読み込みはこちら
authors:
  - addyosmani
date: 2020-07-24
hero: image/admin/dMCW2Qqi5Qp2DB3w4DyE.png
alt: 画像とアセットを読み込んでいるスマートフォンのアウトライン
description: この投稿では、loading属性と、それを使用してiframeの読み込みを制御する方法について説明します。
tags:
  - blog
  - performance
  - memory
feedback:
  - api
---

[画像の標準化された遅延読み込み](/browser-level-image-lazy-loading/)はChrome 76で`loading`属性という形で導入され、その後Firefoxでも導入されました。そして、今、**iframeのブラウザレベルの遅延読み込み**が[標準化](https://github.com/whatwg/html/pull/5579)され、ChromeおよびChromiumベースのブラウザでもサポートされるようになりました。

```html/1
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>
```

iframeの標準化された遅延読み込みは、ユーザーがiframeの近くをスクロールするまで、オフスクリーンiframeが読み込まれないようにします。これにより、データが節約され、ページの他の部分の読み込みが高速化し、メモリ使用量が削減されます。

この`<iframe loading=lazy>`の[デモ](https://lazy-load.netlify.app/iframes/)は、遅延読み込みの動画埋め込みを示しています。

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.mp4" type="video/mp4">
  </source></source></video></figure>

### iframeを遅延読み込みすべき理由

サードパーティの埋め込みは、動画再生ツールから、ソーシャルメディアの投稿、広告まで、幅広いユースケースに対応しています。多くの場合、このコンテンツはユーザーのビューポートにすぐには表示されず、ページをさらに下にスクロールして初めて表示されます。それにもかかわらず、ユーザーは、スクロールしない場合でも、フレームごとにデータのダウンロードと高額なJavaScriptのコストを支払っています。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xqZMRuULxbz6DVXNP8ea.png", alt="iframeでiframe遅延読み込みを使用することによるデータの節約。この例では、即時読み込みでは3MBを取り込みますが、遅延読み込みでは、ユーザーがiframeの近くにスクロールするまで、このコードを取り込みません。", width="800", height="460" %}</figure>

[データセーバーユーザー向けのオフスクリーンiframeの自動遅延読み込み](https://blog.chromium.org/2019/10/automatically-lazy-loading-offscreen.html)に関するChromeの調査に基づくと、iframeの遅延読み込みにより、データの節約の中央値が2〜3％、中央値での[最初のコンテンツフルペイントの](/fcp/)[削減が1〜2％、95パーセンタイルで](/fid/)[最初の入力遅延](/fid/)(FID)が2%改善される可能性があります。

### ビルトインのiframeの遅延読み込みの機能

`loading`属性を使用すると、ブラウザは、ユーザーがオフスクリーンのiframeや画像の近くをスクロールするまで、それらの読み込みを遅延できます。 `loading`は次の3つの値をサポートします。

- `lazy`: 遅延読み込みの適切な候補です。
- `eager`: 遅延読み込みには適していません。すぐに読み込みます。

iframeで`loading`属性を使用すると、次のように機能します。

```html
<!-- iframeの遅延読み込み -->
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>

<!-- iframeの即時読み込み -->
<iframe src="https://example.com"
        width="600"
        height="400"></iframe>

<!-- Lite Modeでloading="eager" を使用して自動遅延読み込みをオプトアウト  -->
<iframe src="https://example.com"
        loading="eager"
        width="600"
        height="400"></iframe>
```

属性をまったく指定しないと、リソースを明示的に即時読み込みするのと同じ影響があります。ただし、[Lite Mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html)のユーザーは、Chromeが`auto`値を使用して遅延読み込みするかどうかを決定します。

JavaScriptを使用して*動的に*iframeを作成する必要がある場合は、要素で`iframe.loading = 'lazy'`を設定することも[サポート](https://bugs.chromium.org/p/chromium/issues/detail?id=993273)されています。

```js/2
var iframe = document.createElement('iframe');
iframe.src = 'https://example.com';
iframe.loading = 'lazy';
document.body.appendChild(iframe);
```

#### iframe固有の遅延読み込みの動作

loading属性は、iframeが非表示かどうかによって、画像とは異なる方法でiframeに影響を与えます。(通常、非表示のiframeは分析や通信の目的で使用されます。) Chromeは、次の基準を使用して、iframeが非表示かどうかを判断します。

- iframeの幅と高さが`4px`以下。
- `display: none`または`visibility: hidden`が適用されている。
- iframeが負のXまたはY位置を使用してオフスクリーンに配置されている。
- この条件は`loading=lazy`と`loading=auto`の両方に適用されます。

iframeがこれらの条件のいずれかを満たしている場合、Chromeはそれを非表示と見なし、ほとんどの場合、遅延読み込みを行いません。非表示ではないiframeは、[読み込み距離のしきい値](/browser-level-image-lazy-loading/#load-in-distance-threshold)内にある場合にのみ読み込まれます。 Chromeには、まだ取得中である遅延読み込みiframeのプレースホルダーが表示されます。

### 一般的なiframe埋め込みを遅延読み込みした場合の影響

オフスクリーンiframeの遅延読み込みがデフォルトになるように、Web全体を変更できるとしたらどうでしょうか。この場合は、だいたい次のようになります。

YouTube動画埋め込みの遅延読み込み (最初のページ読み込みで最大500KBを節約):

```html/1
<iframe src="https://www.youtube.com/embed/YJGCZCaIZkQ"
        loading="lazy"
        width="560"
        height="315"
        frameborder="0"
        allow="accelerometer; autoplay;
        encrypted-media; gyroscope;
        picture-in-picture"
        allowfullscreen></iframe>
```

**エピソード:** Chrome.comのYouTube埋め込みを遅延読み込みに切り替えたとき、モバイルデバイスで対話時間を10秒節約できました。 YouTubeの内部バグを申請して、埋め込みコードに`loading=lazy`を追加するように提案しました。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HQkwBgEoyiZsiOaPyz8v.png", alt="Chrome.comは、YouTube動画埋め込み用のオフスクリーンiframeを遅延読み込みすることで、対話時間を10秒短縮しました", width="800", height="460" %}</figure>

{% Aside %} YouTube埋め込みを読み込むためのより効率的な方法を探している場合は、[YouTube liteコンポーネント](https://github.com/paulirish/lite-youtube-embed)にも検討してみてください。{% endAside %}

**Instagram埋め込みの遅延読み込み (最初の読み込みで100KBを超えるgzip圧縮を削減):**

Instagramの埋め込みは、マークアップのブロックと、ページにiframeを挿入するスクリプトを提供します。このiframeを遅延読み込みすると、埋め込みに必要なすべてのスクリプトを読み込む必要がなくなります。このような埋め込みはほとんどの記事でビューポートの下に表示されることが多いため、iframeの遅延読み込みを検討するべき対象であると考えられます。

**Spotify埋め込みの遅延読み込み (最初の読み込みで514KBを削減):**

```html
<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
        loading="lazy"
        width="300"
        height="380"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"></iframe>
```

上記の埋め込みは、メディアコンテンツのiframeを遅延読み込みした場合の潜在的な利点を示していますが、広告でもこのような利点を確認できる可能性があります。

### 事例研究: Facebookのソーシャルプラグインの遅延読み込み

Facebookの*ソーシャルプラグイン*を使用すると、開発者はFacebookコンテンツをWebページに埋め込むことができます。埋め込まれた投稿、写真、動画、コメントなど、このようなプラグインが多数提供されています。最も人気のあるプラグイン[Likeプラグイン](https://developers.facebook.com/docs/plugins/like-button/)で、ページを「いいね」した人の数を表示するボタンです。デフォルトでは、FB JSSDKを使用して、WebページにLikeプラグインを埋め込むと、最大215KBのリソースが取り込まれます。そのうち、197KBはJavaScriptです。多くの場合、プラグインは記事の最後またはページの終わり近くに表示される可能性があるため、オフスクリーンのときに即時読み込みすることは最適ではない可能性があります。

<figure>{% Img src="image/admin/fdy8o61jxPN560IkF2Ne.png", alt="Facebookの「いいね」ボタン", width="800", height="71" %}</figure>

エンジニアのStoyanStefanovのおかげで、[Facebookのすべてのソーシャルプラグインが標準化されたiframe遅延読み込みをサポートするようになりました](https://developers.facebook.com/docs/plugins/like-button#settings)。 プラグインの`data-lazy`構成を使用した遅延読み込みを選択する開発者は、ユーザーが近くをスクロールするまで、読み込みを回避できるようになります。これにより、埋め込みを必要とするユーザーにとっては埋め込みが完全に機能し、ページを最後までスクロールしていないユーザーにとってはデータが節約されます。これは、多数の埋め込みの中でも、本番環境で標準化されたiframe遅延読み込みを検討する最初の埋め込みであると思います。

### iframeクロスブラウザの遅延読み込みも可能。

iframeの遅延読み込みは、プログレッシブエンハンスメントとして適用できます。iframeの`loading=lazy`をサポートするブラウザは、iframeを遅延読み込みしますが、まだブラウザでサポートされていない場合は、`loading`属性が安全に無視されます。

[lazysizes](/use-lazysizes-to-lazyload-images/) JavaScriptライブラリを使用して、オフスクリーンiframeを遅延読み込みすることもできます。これは、次の場合に推奨されることがあります。

- 現在標準化された遅延読み込みが提供している数よりも多くのカスタム遅延読み込みしきい値が必要
- ブラウザ間で一貫したiframe遅延読み込みエクスペリエンスをユーザーに提供したい

```html/3
<script src="lazysizes.min.js" async></script>

<iframe frameborder="0"
	  class="lazyload"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>
```

次のパターンを使用して、遅延読み込みを検出し、遅延読み込みがない場合はlazysizesを取得します。

```html/2
<iframe frameborder="0"
	  class="lazyload"
    loading="lazy"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>

<script>
  if ('loading' in HTMLIFrameElement.prototype) {
    const iframes = document.querySelectorAll('iframe[loading="lazy"]');

    iframes.forEach(iframe => {
      iframe.src = iframe.dataset.src;
    });

  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

</script>
```

### WordPressユーザー向けのオプション{: #wordpress }

WordPressサイトには、何年分もの投稿コンテンツに多数のiframeが散在している可能性があります。任意で、WordPressテーマの`functions.php`ファイルに次のコードを追加して、既存のiframeに`loading="lazy"`を自動的に挿入できます。各iframeを個別に手動で更新する必要はありません。

[iframeの遅延読み込みのブラウザレベルサポートもWordPressコアで動作していることに](https://core.trac.wordpress.org/ticket/50756)注意してください。次のスニペットは、関連するフラグをチェックします。これにより、WordPressに機能が組み込まれると、 `loading="lazy"`属性が手動で追加されなくなり、確実にこれらの変更と相互運用可能になり、属性が重複しなくなります。

```php
// TODO: https://core.trac.wordpress.org/ticket/50756 landsを1回削除。
function wp_lazy_load_iframes_polyfill( $content ) {
	// If WP core lazy-loads iframes, skip this manual implementation.
	if ( function_exists( 'wp_lazy_loading_enabled' ) && wp_lazy_loading_enabled( 'iframe', 'the_content' ) ) {
		return $content;
	}

	return str_replace( '<iframe ', '<iframe loading="lazy" ', $content );
}
add_filter( 'the_content', 'wp_lazy_load_iframes_polyfill' );
```

WordPressサイトがキャッシュを利用している場合 (ヒント: キャッシュは推奨されます)、必ず後でサイトのキャッシュを再構築してください。

### まとめ

iframeの遅延読み込みの標準化されたサポートを組み込むと、Webページのパフォーマンスを大幅に向上させることが簡単にできます。フィードバックがある場合は、[Chromiumバグトラッカーに](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ELoader%3ELazyLoad)問題を送信してください。

また、見逃した場合は、web.devの[画像と動画の遅延読み込みコレクション](/fast/#lazy-load-images-and-video)で詳細な遅延読み込みのアイデアを確認してください。

*Dom Farolino、Scott Little、Houssein Djirdeh、Simon Pieters、Kayce Basques、Joe Medley、StoyanStefanovのレビューに感謝します。*
