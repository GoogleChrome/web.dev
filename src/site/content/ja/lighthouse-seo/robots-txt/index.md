---
layout: post
title: "`robots.txt` が無効です"
description: |2-

  Lighthouse の「robots.txt is not valid（robots.txt が無効です）」監査について学びます。
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

`robots.txt` ファイルは、検索エンジンにサイトのどのページをクロールできるかを通知します。`robots.txt` の構成が無効である場合、以下の 2 つの問題が引き起こされる場合があります。

- 検索エンジンが公開ページをクロールできないため、検索結果にコンテンツが表示される頻度が減少します。
- 検索結果に表示したくないページを検索エンジンがクロールする可能性があります。

## Lighthouse の `robots.txt` 監査が失敗する原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) は、無効な `robots.txt` ファイルにフラグを立てます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="無効な robots.txt を示す Lighthouse の監査", width="800", height="203" %}</figure>

{% Aside %} Lighthouse のほとんどの監査は、現在表示しているページにのみ適用されます。ただし、`robots.txt` はホスト名レベルで定義されているため、この監査はドメイン全体（またはサブドメイン）に適用されます。{% endAside %}

レポート内の「**`robots.txt` is not valid**（robots.txt が無効です）」監査を展開し、`robots.txt` の何が誤っているのかを学習します。

一般的なエラーは次のとおりです。

- `No user-agent specified`
- `Pattern should either be empty, start with "/" or "*"`
- `Unknown directive`
- `Invalid sitemap URL`
- `$ should only be used at the end of the pattern`

Lighthouse は、`robots.txt` ファイルが正しい場所にあることを確認しません。正しく機能するには、ファイルがドメインまたはサブドメインのルートにある必要があります。

{% include 'content/lighthouse-seo/scoring.njk' %}

## `robots.txt` の問題を修正する方法

### `robots.txt` が HTTP 5XX ステータスコードを返さないことを確認する

サーバーがサーバーエラーに対してサーバーエラー（500 番代の [HTTP ステータスコード](/http-status-code)）を返した場合、検索エンジンはクロールする必要のあるページを認識しません。サイト全体のクロールが停止し、新しいコンテンツのインデックスが作成されなくなります。

HTTP ステータスコードを確認するには、Chrome で `robots.txt` を開き、[Chrome DevTools でリクエストを確認](https://developer.chrome.com/docs/devtools/network/reference/#analyze)します。

### `robots.txt` を 500KiB 未満に保つ

`robots.txt` が 500KiB より大きい場合、検索エンジンはファイルの処理を途中で停止することがあります。このため検索エンジンが混乱し、サイトのクロールが誤って行われる可能性があります。

`robots.txt` を小さく保つには、個別に除外されたページではなく、より広いパターンに注目します。たとえば、PDF ファイルのクロールをブロックする必要がある場合は、ファイルを個々に禁止するのではなく、`disallow: /*.pdf` を使用して、`.pdf` を含むすべての URL を禁止するようにします。

### フォーマットエラーを修正する

- `robots.txt` では、「name: value」形式に一致する空の行、コメント、およびディレクティブのみが許可されています。
- `allow` 値および `disallow` 値が空であるか、`/` または `*` で始まることを確認してください。
- `allow: /file$html` などのように、値の途中に `$` を使用しないでください。

#### `user-agent` 値があることを確認する

User-agent 名は、検索エンジンに対しそれが従うべきディレクティブを検索エンジンクローラーに指示します。検索エンジンが関連するディレクティブのセットに従うかどうかを認識できるよう、`user-agent` の各インスタンスに値を指定する必要があります。

特定の検索エンジンクローラーを指定するには、公開リストの user-agent 名を使用します。（たとえば、[Google が提供している、クロールに使用する user-agent 名のリスト](https://support.google.com/webmasters/answer/1061943)をご覧ください。）

`*` を使用して、他の一致しないすべてのクローラーを一致させます。

{% Compare 'worse', 'Don\'t' %}

```text
user-agent:
disallow: /downloads/
```

ユーザーエージェントは定義されていません。 {% endCompare %}

{% Compare 'better', 'Do' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

一般ユーザーエージェントと `magicsearchbot` ユーザーエージェントが定義されています。 {% endCompare %}

#### `user-agent` の前に `allow` または `disallow` ディレクティブがないことを確認してください

User-agent 名は、`robots.txt` ファイルのセクションを定義します。検索エンジンのクローラーは、これらのセクションを使用して、従うべきディレクティブを決定します。*最初の user-agent 名の前に*ディレクティブを配置すると、クローラーはそれに従いません。

{% Compare 'worse', 'Don\'t' %}

```text
# start of file
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

`disallow: /downloads` ディレクティブを読み取る検索エンジンクローラーはありません。 {% endCompare %}

{% Compare 'better', 'Do' %}

```text
# start of file
user-agent: *
disallow: /downloads/
```

すべての検索先人は、`/downloads` フォルダをクロールすることを許可されていません。 {% endCompare %}

検索エンジンのクローラーは、最も具体的な user-agent 名を持つセクションのディレクティブのみに従います。たとえば、 `user-agent: *` と `user-agent: Googlebot-Image` というディレクティブがある場合、`user-agent: Googlebot-Image` セクションのディレクティブのみに従います。

#### `sitemap` の絶対 URL を指定する

[サイトマップ](https://support.google.com/webmasters/answer/156184)ファイルは、検索エンジンに Web サイトのページについて知らせるための優れた方法です。サイトマップファイルには通常、Web サイトの URL のリストと、それらが最後に変更された日時に関する情報が含まれています。

`robots.txt` でサイトマップファイルを送信する場合は、必ず[絶対 URL](https://tools.ietf.org/html/rfc3986#page-27) を使用してください。

{% Compare 'worse', 'Don\'t' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Do' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## リソース

- [「**`robots.txt` が無効です**」監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/robots-txt.js)
- [`robots.txt file` を作成する](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Robots メタタグと X-Robots-Tag HTTP ヘッダーの仕様](https://developers.google.com/search/reference/robots_meta_tag)
- [サイトマップについて学ぶ](https://support.google.com/webmasters/answer/156184)
- [Google クローラー（ユーザーエージェント）](https://support.google.com/webmasters/answer/1061943)
