---
layout: post
title: フォントの読み込み中にテキストが非表示されることを避ける
authors:
  - katiehempenius
description: フォントは普段、大きなファイルで読み込みに時間がかかります。これに対処するために、一部のブラウザは、フォントが読み込まれるまでテキストを非表示にします（非表示のテキストのフラッシュ）。パフォーマンスを最適化する目的で、「非表示のテキストのフラッシュ」を避けて、システムフォントを使用してユーザーにすぐにコンテンツを表示することを希望するかもしれません。
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## なぜこの点を配慮する必要がありますか？

フォントは普段、大きなファイルで読み込みに時間がかかります。これに対処するために、一部のブラウザは、フォントが読み込まれるまでテキストを非表示にします（非表示のテキストのフラッシュ）。パフォーマンスを最適化する目的で、「非表示のテキストのフラッシュ」を避けて、（スタイルのないテキストのフラッシュ）システムフォントを使用してユーザーにすぐにコンテンツを表示することを希望するかもしれません。

## すぐにテキストを表示する

このガイドでは、これを実現する2つの方法を説明します。最初のアプローチは非常に簡単ですが、ユニバーサルブラウザが[サポート](https://caniuse.com/#search=font-display)してもらいません。 2番目のアプローチはより多くの作業が必要ですが、ブラウザが完全にサポートしてもらいます。最良の選択は、実際に実装して維持するものです。

## オプション＃1：font-displayを使用する

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>前</th>
        <th>後</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td>
<code>@font-face {
  font-family: Helvetica;
  <strong>font-display: swap;</strong>
}
</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)は、フォント表示戦略を指定するためのAPIです。 `swap`は、システムフォントを使用して、このフォントを使用するテキストがすぐに表示される必要があるようとブラウザに通知します。カスタムフォントの準備ができたら、システムフォントが交換されます。

ブラウザは`font-display`サポートしていない場合、フォントの読み込みのためのデフォルトの動作にフローし続けます。[こちら](https://caniuse.com/#search=font-display)で`font-display`サポートしているブラウザを確認してください。

下記は、一般的なブラウザのデフォルトのフォント読み込み動作です。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>ブラウザ</strong></th>
        <th><strong>フォントの準備ができていない場合はデフォルトの動作が…</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>フォントの準備ができあがるまでシステムフォントを使用します。フォントを交換します。</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>3秒以内でテキストを非表示にします。それでもテキストの準備ができていない場合は、フォントの準備ができるまでシステムフォントを使用します。フォントを交換します。</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>3秒以内でテキストを非表示にします。それでもテキストの準備ができていない場合は、フォントの準備ができるまでシステムフォントを使用します。フォントを交換します。</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>フォントの準備ができるまでテキストを非表示にします。</td>
      </tr>
    </tbody>
  </table>
</div>

## オプション＃2：カスタムフォントが読み込まれる後の使用を待機する

もう少し作業を行うことで、すべてのブラウザで機能するように同じ動作を実装できます。

このアプローチには3つの部分があります。

- 最初のページ読み込み時にカスタムフォントを使用しないでください。これにより、ブラウザはシステムフォントを使用してテキストをすぐに表示できます。
- カスタムフォントが読み込まれる時点を検出します。これは、[FontFaceObserver](https://github.com/bramstein/fontfaceobserver)ライブラリのおかげで、数行のJavaScriptコードで実現できます。
- カスタムフォントを使用できようにページスタイルを更新します。

これを実装するために実施する必要である変更は次のとおりです。

- 最初のページの読み込み時にカスタムフォントを使用しないように、CSSをリファクタリングすること。
- ページにスクリプトを追加すること。このスクリプトでは、カスタムフォントが読み込まれたことを検出して、ページのスタイルを更新します。

{% Aside 'codelab' %} [Font Face Observerを使用して、テキストをすぐに表示します](/codelab-avoid-invisible-text)。 {% endAside %}

## 確認

Lighthouseの実行により、サイトがテキストを表示するために`font-display: swap`を使用していることを確認できます。

{% Instruction 'audit-performance', 'ol' %}

Webフォントの読み込み監査に合格したら、**テキストが表示されたままであること**を確認します。
