---
layout: post
title: 動画を遅延読み込みする
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: この記事では、遅延読み込みと、動画を遅延読み込みするときに利用できるオプションについて説明します。
tags:
  - performance
feedback:
  - api
---

[画像要素](/lazy-loading-images)と同様に、動画も遅延読み込みすることができます。動画は通常、`<video>` 要素で読み込まれます（ただし限定的な実装で [`<img>` を使用する別の手法](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/)も出現しています）。`<video>` を遅延読み込みする*方法*はユースケースによって異なるため、それぞれに異なるソリューションを必要とするシナリオをいくつか確認してみましょう。

## 自動再生しない動画の場合 {: #video-no-autoplay }

ユーザーが再生を開始する動画（つまり、*自動再生しない*動画）の場合、`<video>` 要素に [`preload` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-preload) を指定することが望ましい場合があります。

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

上記の例では、値が `none` の `preload` 属性を使用して、ブラウザが*すべての*動画データをプリロードしないようにしています。`poster` 属性は、`<video>` 要素に、動画の読み込み中に動画のスペースを占有するプレースホルダーを表示するようにする属性です。これは、動画を読み込む際のデフォルトの動作がブラウザごとに異なる可能性があるためです。

- Chrome では、`preload` のデフォルトは以前は `auto` でしたが、Chrome 64 では、デフォルトで `metadata` に変更されています。それでも、デスクトップ版の Chrome では、`Content-Range` ヘッダーを使用して動画の一部がプリロードされる場合があります。Firefox、Edge、Internet Explorer 11 でも同じように動作します。
- デスクトップ版の Chrome と同様に、Safari の 11.0 デスクトップ版は、動画の範囲をプリロードします。バージョン 11.2 からは、動画メタデータのみがプリロードされます。 [iOS の Safariでは、動画がプリロードされることはありません](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9)。
- [データセーバーモード](https://support.google.com/chrome/answer/2392284)が有効になっている場合、 `preload` はデフォルトで `none` になります。

`preload` に関するブラウザのデフォルトの動作は明確に設定されていないため、明示的に設定することがおそらく最善の策と言えるでしょう。ユーザーが再生を開始するこのケースでは、`preload="none"` が、すべてのプラットフォームで動画の読み込みを延期する最も簡単な方法です。`preload` 属性は、動画コンテンツの読み込みを延期する唯一の方法ではありません。「[*Fast Playback with Video Preload*](/fast-playback-with-preload/)」で、JavaScript で動画再生を扱うためのアイデアや洞察を得られるかもしれません。

残念ながら、アニメーション GIF の代わりに動画を使用する場合は役に立ちません。これについて、次のセクションで説明します。

## アニメーション GIF の代わりとして機能する動画の場合 {: #video-gif-replacement }

アニメーション GIF は広く使用されていますが、多くの点で、特にファイルサイズにおいて、相当する動画に劣っています。アニメーション GIF は、数メガバイト範囲のデータにまで及ぶ可能性があります。同等の視覚的な品質を持つ動画は、はるかに小さい傾向があります。

アニメーション GIF の代わりに `<video>` 要素を使用するのは `<img>` 要素ほど簡単ではありません。アニメーション GIF には次の 3 つの特徴があります。

1. 読み込まれると自動的に再生する。
2. 連続的にループする（[必ずしもそうではないケースもあります](https://davidwalsh.name/prevent-gif-loop)）。
3. 音声トラックがない。

これを `<video>` 要素を使用して達成すると、次のようになります。

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

`autoplay`、`muted`、および `loop` 属性は自明です。[iOS で自動再生を行うには、`playsinline` が必要](https://webkit.org/blog/6784/new-video-policies-for-ios/)です。これで、プラットフォーム間で機能する GIF の代替として動画をサーブできるようになりました。しかし、それを遅延読み込みするにはどうすればよいでしょうか？手始めに、`<video>` マークアップを適宜変更します。

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

[`poster` 属性](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster)が追加されていることに気付くでしょう。これにより、動画が遅延読み込みされるまで `<video>` 要素のスペースに表示されるプレースホルダーを指定できます。[`<img>` の遅延読み込みの例](/lazy-loading-images/)と同様に、`<source>` 要素の `data-src` 属性に動画の URL を隠しておきます。そこから、Intersection Observer ベースの画像の遅延読み込みの例と同様の JavaScript コードを使用します。

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

`<video>` 要素を遅延読み込みするときは、すべての子 `<source>` 要素を反復処理し、それらの `data-src` 属性を `src` 属性に反転する必要があります。それが完了したら、要素の `load` メソッドを呼び出して動画の読み込みをトリガーする必要がありますが、それが終われば `autoplay` 属性に従ってメディアが自動的に再生を開始するようになります。

この方法を使用すると、アニメーション GIF の動作をエミュレートする動画ソリューションを得られますが、アニメーション GIF と同じように大量のデータを使用することはなく、そのコンテンツを遅延読み込みすることができます。

## 遅延読み込みライブラリ {: #libraries }

以下のライブラリは、動画の遅延読み込みに役立ちます。

- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) と [lozad.js](https://github.com/ApoorvSaxena/lozad.js) は、Intersection Observer のみを使用する超軽量のオプションです。そのため、パフォーマンスは高くなりますが、古いブラウザで使用する前にポリフィルする必要があります。
- [yall.js](https://github.com/malchata/yall.js) は、Intersection Observer を使用し、イベントハンドラーにフォールバックするライブラリです。IE11 および主要なブラウザとの互換性があります。
- React 固有の遅延読み込みライブラリが必要な場合は、 [react-lazyload](https://github.com/jasonslyvia/react-lazyload) を検討することをお勧めします。Intesection Observer を使用しませんが、React でのアプリケーション開発に慣れているのであれば、画像の遅延読み込みに似た方法を*得ることができます*。

これらの遅延読み込みライブラリには十分なドキュメントが揃っており、さまざまな遅延読み込みに関する取り組みに対応できるマークアップパターンが豊富に用意されています。
