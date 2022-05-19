---
layout: codelab
title: インストール可能にする
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: このコードラボでは、beforeinstallprompt イベントを使用してサイトをインストール可能にする方法を学びます。
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

この Glitch には、[非常に単純な Service Worker](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js) や [Web アプリマニフェスト](https://glitch.com/edit/#!/make-it-installable?path=manifest.json)など、プログレッシブ Web アプリをインストール可能にするために必要な重要なコンポーネントがすでに含まれています。また、デフォルトで非表示になっているインストールボタンもあります。

## beforeinstallprompt イベントをリスンする

ブラウザが `beforeinstallprompt` イベントを発すると、プログレッシブ Web アプリをインストールできるようになり、インストールボタンをユーザーに表示できるようになります。`beforeinstallprompt` イベントは、PWA が[インストール可能性の基準](/install-criteria/)を満たしたときに発生します。

{% Instruction 'remix', 'ol' %}

1. `beforeinstallprompt` イベントハンドラーを `window` オブジェクトに追加します。
2. `event` をグローバル変数として保存します。プロンプトを表示するために後で必要になります。
3. インストールボタンを非表示状態を解除します。

コード：

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // モバイルでミニ情報バーが表示されないようにする。
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // イベントをスタッシュして後でトリガーできるようにする。
  window.deferredPrompt = event;
  // インストールボタンのコンテナから 'hidden' クラスを削除する。
  divInstall.classList.toggle('hidden', false);
});
```

## インストールボタンのクリックを処理する

インストールプロンプトを表示するには、保存された `beforeinstallprompt` イベントで `prompt()` を呼び出します。`prompt()` の呼び出しは、インストールボタンのクリックハンドラーで行われます。これは、`prompt()` がユーザーのジェスチャーによって呼び出されるためです。

1. インストールボタンのクリックイベントハンドラーを追加します。
2. 保存された `beforeinstallprompt` イベントで `prompt()` を呼び出します。
3. プロンプトの結果をログに記録します。
4. 保存された `beforeinstallprompt` イベントを null に設定します。
5. インストールボタンを非表示にします。

コード:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // デファーされたプロンプトは使用できません。
    return;
  }
  // インストールプロンプトを表示する。
  promptEvent.prompt();
  // 結果をログに記録する
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // デファーされたプロンプトの変数をリセット。
  // prompt() は1回しか呼び出せません。
  window.deferredPrompt = null;
  // インストールボタンを非表示にする。
  divInstall.classList.toggle('hidden', true);
});
```

## インストールイベントを追跡する

インストールボタンを使用してプログレッシブ Web アプリをインストールするのは、ユーザーが PWA をインストールできる方法のひとつに過ぎません。Chrome のメニュー、ミニ情報バー、および[オムニボックスのアイコンを](/promote-install/#browser-promotion)使用することもできます。`appinstalled` イベントをリスンすることで、これらすべてのインストール方法を追跡できます。

1. `appinstalled` イベントハンドラーを `window` オブジェクトに追加します。
2. インストールイベントを分析またはその他のメカニズムに記録します。

コード:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // deferredPrompt をクリアしてガベージコレクションを行えるようにする
  window.deferredPrompt = null;
});
```

## 参考文献

おめでとうございます。アプリがインストール可能になりました！

以下に、これから実行できる追加内容を紹介します。

- [アプリがホーム画面から起動されたかどうかを検出する](/customize-install/#detect-mode)
- [代わりに、OS のアプリインストールプロンプトを表示する](https://developer.chrome.com/blog/app-install-banners-native/)
