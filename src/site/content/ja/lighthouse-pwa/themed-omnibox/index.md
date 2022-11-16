---
layout: post
title: アドレスバーのテーマの色を設定しません
description: |2-

  自分のProgressive Web Appのアドレスバーのテーマの色を設定する方法について学びましょう。
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

[Progressive Web App（PWA）](/discover-installable)のブランドカラーに一致するようにブラウザのアドレスバーにテーマを設定すると、より没入型のユーザー体験が提供されます。

## ブラウザの互換性

この記事を書いた時点で、ブラウザのアドレスバーのテーマ設定は Androidベースのブラウザでサポートされています。最新情報は、[Browser compatibility (ブラウザの互換性)](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility) を参照してください。

## Lighthouse によるテーマの色の監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、アドレスバーにテーマを適用しないページにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="Lighthouse 監査はページの色をテーマにしていないアドレスバーを表示します", width="800", height="98" %}</figure>

LighthouseがページのHTMLで`theme-color`メタタグを検出せず、[Webアプリマニフェスト](/add-manifest)で`theme_color`プロパティを検出しない場合、監査は失敗します。

Lighthouseは、値が有効なCSSカラー値であるかどうかをテストしないことに注意してください。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## アドレスバーのテーマの色を設定する方法

### ステップ1：ブランド化したいすべてのページに`theme-color`メタタグを追加します

`theme-color`メタタグは、ユーザーが通常のWebページとしてサイトにアクセスしたときにアドレスバーがブランド化されるようにします。タグの`content`属性を任意の有効なCSSカラー値に設定してください。

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

`theme-color`メタタグの詳細については、Googleの<a href="https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android" data-md-type="link">Android向けChrome39での`theme-color`</a>のサポートをご覧ください。

### ステップ2： `theme_color`プロパティをWebアプリマニフェストに追加します

Webアプリマニフェストの`theme_color`プロパティにより、ユーザーがホーム画面からPWAを起動したときに、アドレスバーがブランド化されます。 `theme-color`メタタグとは異なり、[マニフェスト](/add-manifest)でこれを定義する必要があるのは1回だけです。プロパティを任意の有効なCSSカラー値に設定してください。

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

マニフェストの`theme_color`で、ブラウザが自分のアプリのすべてのページのアドレスバーの色を設定します。

## リソース

- [監査の**アドレスバーのテーマカラーを設定しない**監査用のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/themed-omnibox.js)
- [Webアプリマニフェストを追加する](/add-manifest)
- [Android向けのChrome 39で`theme-color`用のサポート](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)
