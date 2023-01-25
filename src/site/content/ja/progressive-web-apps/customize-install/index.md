---
layout: post
title: 独自のアプリ内インストールエクスペリエンスを提供する方法
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: |2-

  beforeinstallpromptイベントを使用して、カスタマイズしたシームレスなアプリ内インストールエクスペリエンスをユーザーに提供します。
tags:
  - progressive-web-apps
---

多くのブラウザーでは、プログレッシブウェブアプリ（PWA）のインストールをPWAのユーザーインターフェイス内で直接有効にして促進することができます。インストール（以前はAdd to Home Screenと呼ばれることもありました）を使用すると、ユーザーはモバイルデバイスまたはデスクトップデバイスにPWAを簡単にインストールできます。PWAをインストールすると、ユーザーのランチャーに追加され、インストールされている他のアプリと同じように実行できるようになります。

[ブラウザが提供するインストールエクスペリエンス](/promote-install/#browser-promotion)に加えて、独自のカスタムインストールフローをアプリ内で直接提供することができます。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt="Spotify PWAで提供されるInstall Appボタン", width="491", height="550"%}<figcaption> Spotify PWAで提供される「Install App」ボタン</figcaption></figure>

インストールを促すかどうかを検討するときは、ユーザーが通常どのようにPWAを使用しているかを考えると良いでしょう。たとえば、1週間にPWAを複数回も使用するユーザーがいる場合、これらのユーザーにとっては、スマートフォンのホーム画面またはデスクトップのオペレーティングシステムの[スタート]メニューから便利にアプリを起動できると便利でしょう。一部の生産性アプリやエンターテインメントアプリにとっては、インストールされた`standalone`モードまたは`minimal-ui`モードでウィンドウからブラウザーのツールバーを削除することによって画面領域が広がるということがメリットになるでしょう。

<div class="w-clearfix"></div>

## インストールを促す方法 {: #promote-installation}

プログレッシブウェブアプリがインストール可能であることを示し、カスタマイズしたアプリ内インストールのフローを提供するには、以下のことを行います。

1. `beforeinstallprompt`イベントをリッスンする。
2. `beforeinstallprompt`イベントを保存して、後でインストールフローをトリガーできるようにする。
3. PWAがインストール可能であることをユーザーに知らせ、アプリ内インストールのフローを開始するボタンまたはその他の要素を提供する。

{% Aside %} `beforeinstallprompt`イベントと`appinstalled`イベントは、ウェブアプリマニフェストの仕様から独自の[インキュベーター](https://github.com/WICG/beforeinstallprompt)に移動されました。Chromeチームは、引き続きこれらのイベントをサポートしていきます。また、サポートを削除または廃止する予定はありません。GoogleのWeb DevRelチームは、カスタマイズされたインストールエクスペリエンスを提供するために、これらのイベントを使用することを引き続き推奨しています。{% endAside %}

### `beforeinstallprompt`イベントをリッスンする {: #beforeinstallprompt}

プログレッシブウェブアプリが必要な[インストール基準](/install-criteria/)を満たしている場合、ブラウザは`beforeinstallprompt`イベントを発生させます。イベントへの参照を保存し、ユーザーインターフェイスを更新することにより、ユーザーがPWAをインストールできることを示します。これを以下のコードで説明します。

```js
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %}対象のアプリがインストール可能であることをユーザーに知らせ、アプリ内インストールのフローを提供するために使用できる[パターン](/promote-install/)はたくさんあります。たとえば、ヘッダーのボタン、ナビゲーションメニューのアイテム、コンテンツフィードなどを使えます。{% endAside %}

### アプリ内インストールのフロー {: #in-app-flow}

アプリ内インストールを提供するには、ユーザーがクリックしてアプリをインストールできるボタンまたはその他のインターフェース要素を提供します。要素がクリック`beforeinstallprompt`されたら、保存されている`beforeinstallprompt`イベントに対して`prompt()`を呼び出します (`deferredPrompt`変数に格納されています)。それにより、ユーザーにはモーダルインストールダイアログが表示され、PWAをインストールすることをユーザーに確認します。

```js
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
```

`userChoice`プロパティは、ユーザーの選択によって解決されるPromiseです。延期されたイベントに対して`prompt()`を呼び出せるのは1回だけです。ユーザーがそれを無視した場合は、`beforeinstallprompt`イベントが再度発生するまで待機する必要があります。通常は、`userChoice`プロパティが解決された直後に発生します。

{% Aside 'codelab' %} [beforeinstallpromptイベントを使用してサイトをインストール可能にします](/codelab-make-installable)。 {% endAside %}

## PWAが正常にインストールされたことを検出する {: #detect-install}

`userChoice`プロパティを使用すると、ユーザーがユーザーインターフェイス内からアプリをインストールしたかどうかを判断できます。ただし、ユーザーがアドレスバーまたはその他のブラウザコンポーネントからPWAをインストールした場合は、`userChoice`を使っても効果はありません。代わりに、`appinstalled`イベントをリッスンすると良いでしょう。このイベントは、PWAのインストールに使用されているメカニズムを問わず、PWAがインストールされるたびに発生します。

```js
window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
```

## PWAがどのように起動されたかを検出する {: #detect-launch-type}

CSS `display-mode`メディアクエリは、PWAがどのように起動されたかを示します (ブラウザタブで起動されたのか、インストールされたPWAとして起動されたのか)。このおかげで、アプリの起動方法に応じてさまざまなスタイルを適用することができます。たとえば、インストールされたPWAとして起動するときは、常にインストールボタンを非表示にし、戻るボタンを提供します。

### PWAがどのように開始されたかを追跡する

ユーザーがPWAを起動する方法を追跡するには、`matchMedia()`を使って`display-mode`メディアクエリをテストします。iOSのSafariではまだこれがサポートされていないため、 `navigator.standalone`確認する必要があります。これは、ブラウザがスタンドアロンモードで実行されているかどうかを示すブール値を返します。

```js
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
```

### 表示モードがいつ変わるかを追跡する

ユーザーが`standalone`と`browser tab`を切り替えているかどうかを追跡するには、`display-mode`メディアクエリへの変更をリッスンします。

```js
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});
```

### 現在の表示モードに基づいてUIを更新する

インストールされたPWAとして起動されたときにPWAに異なる背景色を適用するには、条件付きCSSを使用します。

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## アプリのアイコンと名前を更新する

アプリ名を更新したり、新しいアイコンを提供したりする必要がある場合はどうすればいいでしょうか？こうした変更がChromeにどのタイミングで、どのように反映されるかは、[How Chrome handles updates to the web app manifest](/manifest-updates/)をお読みください。
