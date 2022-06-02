---
layout: post
title: ページに HTML Doctype が指定されていないため、Quirks モードがトリガーされる
description: ページが古いブラウザで Quirks モードをトリガーしないようにする方法を学習します。
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

Doctype を指定すると、ブラウザが [Quirks モード](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)に切り替えて、[ページを予期しない方法でレンダリング](https://quirks.spec.whatwg.org/#css)してしまうことを防止できます。

## Lighthouse の Doctype 監査が失敗する原因

`<!DOCTYPE html>` 宣言が存在しない場合、[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) はページにフラグを設定します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Doctype がないことを示す Lighthouse 監査", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Doctype 宣言を追加する方法

`<!DOCTYPE html>` 宣言は HTML ドキュメントの先頭に追加します。

```html
<!DOCTYPE html>
<html lang="en">
…
```

詳細については、MDN の [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype) ページをご覧ください。

## リソース

- [「**ページに HTML Doctype がないため、Quirks モード監査がトリガーされる**」のソースコード](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype)
- [Quirks モードと標準モード](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
