---
layout: post
title: '`[user-scalable="no"]` が `<meta name="viewport">` 要素で使用されているか、`[maximum-scale]` 属性が `5` 未満です'
description: ブラウザのズーム無効になっていないことを確認して、Web ページのアクセシビリティをさらに高める方法を学びます。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

`<meta name="viewport">` 要素の `user-scalable="no"` パラメーターは、Web ページでのブラウザのズーム機能を無効にします。`maximum-scale` パラメーターは、ユーザーがズームできる量を制限します。どちらも、ブラウザのズーム機能に依存して Web ページのコンテンツを表示するロービジョンユーザーにとって問題となるパラメーターです。

## Lighthouse のブラウザのズーム機能監査が失敗する原因

Lighthouse は、ブラウザのズーム機能を無効にするページにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="ビューポートがテキストのスケーリングとズーム機能を無効にしていることを示す Lighthouse 監査", width="800", height="227" %}</figure>

以下のいずれかの `<meta name="viewport">` タグが含まれている場合、ページは監査に失敗します。

- `user-scalable="no"` パラメーターを持つ `content` 属性
- `maximum-scale` パラメーターが `5` 未満に設定された `content` 属性

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## ブラウザのズーム機能を無効にしないようにする方法

`user-scalable="no"` パラメーターをビューポートのメタタグから削除し、`maximum-scale` パラメーターが `5` 以上に設定されていることを確認します。

## リソース

- [「**`[user-scalable="no"]` が `<meta name="viewport">` 要素で使用されているか、`[maximum-scale]` 属性が 5 未満です**」監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [Zooming and scaling must not be disabled（Deque University）](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)
