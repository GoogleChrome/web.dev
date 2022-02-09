---
layout: post
title: sidenavコンポーネントの構築
subhead: 応答性の高いスライドアウトsidenavを作成する方法の基本的な概要
authors:
  - adamargyle
description: 応答性の高いスライドアウトsidenavを作成する方法の基本的な概要
date: 2021-01-21
hero: image/admin/Zo1KkESK9CfEIYpbWzap.jpg
thumbnail: image/admin/pVZO6FsC9tF3H6QIWpY2.png
codelabs: codelab-building-a-sidenav-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

この投稿では、応答性が高く、ステートフルで、キーボードナビゲーションをサポートし、JavaScriptの有無にかかわらず動作し、ブラウザー間で動作するWeb用のSidenavコンポーネントのプロトタイプを作成した方法について紹介します。[デモ](https://gui-challenges.web.app/sidenav/dist/)を試しください。

ビデオがお好みの場合は、この投稿のYouTubeバージョンをご覧ください。

{% YouTube 'uiZqDLqjGRY' %}

## 概要

応答性の高いナビゲーションシステムを構築するのは難しいです。多少のユーザーはキーボードを使用し、多少のユーザーは強力なデスクトップを使用し、一部のユーザーは小さなモバイルデバイスからアクセスします。訪問する全員がメニューを開いたり閉じたりできる必要があります。

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/desktop-demo-1080p.mp4">
  </source></video>
  <figcaption>デスクトップからモバイルへのレスポンシブ対応のレイアウトのデモ</figcaption></figure>

<figure>
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/mobile-demo-1080p.mp4">
  </source></video>
  <figcaption>iOSとAndroidでの明るいテーマと暗いテーマ</figcaption></figure>

## Web戦術

このコンポーネントの調査では、いくつかの重要なWebプラットフォーム機能を組み合わせることができました。

1. CSS [`:target`](#target-psuedo-class)
2. CSS[グリッド](#grid-stack)
3. CSS[変換](#transforms)
4. ビューポートとユーザー設定に関するCSSメディアクエリ
5. `focus` [UX拡張の](#ux-enhancements)ためのJS

私のソリューションとしてはサイドバーを1つ準備し、 `540px`以下の「モバイル」ビューポートになる時だけで切り替わります。`540px`は、モバイル向けのレイアウトと静的デスクトップ向けのレイアウトを切り替えるためのブレークポイントになります。

### CSS `:target` pseudo-class {: #target-psuedo-class }

一つの`<a>`リンクはURLハッシュを`#sidenav-open`に設定し、別の1つは空（ `''` ）に設定します。最後に、要素の一個にはハッシュと一致する`id`を持つようになります。

```html
<a href="#sidenav-open" id="sidenav-button" title="Open Menu" aria-label="Open Menu">

<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<aside id="sidenav-open">
  …
</aside>
```

これらの各リンクをクリックすると、ページURLのハッシュ状態が変更され、疑似クラスを使用してサイドナビーゲションを表示したり、非表示にしたりします。

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
  }

  #sidenav-open:target {
    visibility: visible;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/hash-change.mp4">
  </source></video></figure>

### CSSグリッド{: #grid-stacks }

以前、絶対に位置又は固定位置のサイドナビゲーションのレイアウトとコンポーネントのみを使用しました。ただし、グリッドでは、 `grid-area`構文を使用して、同行または同列に複数の要素を割り当てることができます。

#### スタック

主要なレイアウト要素`#sidenav-container`は、1行と2列を作成するグリッドであり、それぞれ1つが`stack`と呼ばれます。スペースが制限されている場合、CSSはすべての`<main>`要素の子を同じグリッド名に割り当て、すべての要素を同じスペースに配置してスタックを作成します。

```css
#sidenav-container {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;
  min-height: 100vh;
}

@media (max-width: 540px) {
  #sidenav-container > * {
    grid-area: stack;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/responsive-stack-demo-1080p.mp4">
  </source></video></figure>

#### メニューの背景

`<aside>`は、サイドナビゲーションを含むアニメーション要素です。 2つの子が`[nav]`という名前を持つ`<nav>`と、メニューを閉じるために使用される`[escape]`という名前を持つ背景`<a>`となります。

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

メニューオーバーレイとボタンに近くのネガティブスペースに適した比率を見つけるために、`2fr`と`1fr`を調整してください。

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </source></video>
  <figcaption>比率を変更する結果のデモ。</figcaption></figure>

### CSS 3D変換と遷移{: #transforms }

これで、レイアウトはモバイルビューポートのサイズに応じてスタックされます。新規のスタイルを追加するまで、デフォルトで記事をオーバーレイしています。この次のセクションで狙っているUXは次のとおりです。

- 開いたり閉じたりするアニメーションを作ります
- ユーザーの同意を得るに限り、モーションでアニメートします
- キーボードのフォーカスが画面外の要素に入らないように`visibility`アニメートします

モーションアニメーションの実装を開始する頃には、アクセシビリティを念頭に置いて始めたいと思います。

#### アクセス可能なモーション

誰もスライドアウトモーションを体験したいわけではありません。私たちのソリューションでは、この設定がメディアクエリ内の`--duration`CSS変数を調整することにより適用されています。このメディアクエリ値は、（使用可能な場合）モーションに対するユーザーのオペレーティングシステムの設定を表します。

```css
#sidenav-open {
  --duration: .6s;
}

@media (prefers-reduced-motion: reduce) {
  #sidenav-open {
    --duration: 1ms;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </source></video>
  <figcaption>durationが適用されている場合と適用されていない場合のインタラクションのデモ。</figcaption></figure>

これで、サイドナビゲーションがスライドして開閉している間に、ユーザーが動きを抑えたい場合は、要素を即座にビューに移動して、動きのない状態を維持します。

#### 移行、変換、翻訳

##### Sidenav out（デフォルト）

モバイルでのサイドナビゲーションのデフォルト状態をオフスクリーン状態に設定するには、変換を使用して要素`transform: translateX(-110vw)`を配置します。

`box-shadow`は非表示するときにメインビューポートを覗き込まないように確保するために、通常のオフスクリーンコードの`-100vw` に`10vw`を追加したことにご注意ください。

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
    transform: translateX(-110vw);
    will-change: transform;
    transition:
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
  }
}
```

##### Sidenav in

`#sidenav`要素が`:target`と一致したら、 `translateX()`の位置をhomebase `0`に設定し、URLハッシュが変更されたときにCSSが要素を`-110vw` の「out」位置から`var(--duration)`上`0` の「in」位置にスライドするのを確認します。

```css
@media (max-width: 540px) {
  #sidenav-open:target {
    visibility: visible;
    transform: translateX(0);
    transition:
      transform var(--duration) var(--easeOutExpo);
  }
}
```

#### 可視性の移行

現在の目標は、メニューが表示されていない時にスクリーンリーダーからメニューを非表示にすることため、システムはオフスクリーンのメニューに注目していません。 `:target`が変わる時に可視性の移行を設定することで実現します。

- 入ったら、可視性を移行しないでください。すぐに表示するので、要素がスライドインしてフォーカスを受け入れるのを確認できます。
- 出る際に、可視性を移行するが、遅延させるため、移行の終了時`hidden`に反転します。

### アクセシビリティUXの機能強化{: #ux-enhancements }

#### Links

このソリューションは、状態を管理することを目的とするURLの変更に依存しています。もちろん、`<a>`要素がここで利用される必要があり、いくつかの優れたアクセシビリティ機能を無料で取得します。インタラクティブな要素を、意図を明確に表現するラベルで飾りましょう。

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
  <svg>...</svg>
</a>
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/keyboard-voiceover.mp4">
  </source></video>
  <figcaption>ナレーションとキーボードインタラクションUXのデモ。</figcaption></figure>

これで、主要なインタラクションボタンは、マウスとキーボードの両方に対する意図を明確に示しています。

#### `:is(:hover, :focus)`

この便利なCSS機能疑似セレクターを使用すると、ホバースタイルをフォーカスと共に共有することで、ホバースタイルをすばやくこなせます。

```css
.hamburger:is(:hover, :focus) svg > line {
  stroke: hsl(var(--brandHSL));
}
```

#### JavaScriptを振りかける

##### 閉じるには`escape`を押してください

キーボードの`Escape`キーでメニューを閉じる必要がありますか？それを配線しましょう。

```js
const sidenav = document.querySelector('#sidenav-open');

sidenav.addEventListener('keyup', event => {
  if (event.code === 'Escape') document.location.hash = '';
});
```

##### ブラウザの履歴

開閉する操作によって複数のエントリがブラウザの履歴にスタックされないようにするには、閉じるボタンに次のインラインにあるJavaScriptを追加します。

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu" onchange="history.go(-1)"></a>
```

これにより、閉じるときにURL履歴エントリが削除され、メニューが開かれなかったかのようになります。

##### フォーカスUX

次のスニペットは、開いた後または閉じた後の開くボタンと閉じるボタンにfocusするのに役立ちます。切り替えを簡単にしたい。

```js
sidenav.addEventListener('transitionend', e => {
  const isOpen = document.location.hash === '#sidenav-open';

  isOpen
      ? document.querySelector('#sidenav-close').focus()
      : document.querySelector('#sidenav-button').focus();
})
```

サイドナビが開いたら、閉じるボタンにfocusします。サイドナビが閉じたら、開くボタンにfocusします。JavaScriptの要素で`focus()`を呼び出すことにより、それをできます。

### 結論

以上で私のやり方を理解したと思うが、あなたはどうしますか？これにより、面白いコンポーネントアーキテクチャが実現します。最初のバージョンを作る方は何方ですか？ 🙂

私たちのやり方を多様化し、ウェブ上でビルドするためのすべての方法を調べましょう。[Glitch](https://glitch.com)を作成し、バージョンを私へ[ツイート](https://twitter.com/argyleink)してください。下の[コミュニティリミックス](#community-remixes) セクションに追加します。

## コミュニティリミックス

- [@_developit](https://twitter.com/_developit) with カスタム要素：[デモとコード](https://glitch.com/edit/#!/app-drawer)
- [@mayeedwin1](https://twitter.com/mayeedwin1) with HTML/CSS/JS：[デモとコード](https://glitch.com/edit/#!/maye-gui-challenge)
- [@a_nurella](https://twitter.com/a_nurella) with a Glitch Remix：[デモとコード](https://glitch.com/edit/#!/sidenav-with-adam)
- [@EvroMalarkey](https://twitter.com/EvroMalarkey) with HTML / CSS / JS：[デモとコード](https://evromalarkey.github.io/scrollsnap-drawer/index.html)
