---
layout: post
title: "「same-site」と「same-origin」を理解する"
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
description: "「same-site」と「same-origin」は頻繁に引用されますが、誤解されることもよくあります。この記事は、それらが何であるか、そしてどのように違うかについて説明します。"
tags:
  - security
---

「same-site」と「same-origin」は頻繁に引用されますが、誤解されることもよくあります。例えば、ページ切り替えコンテキスト、 `fetch()`リクエスト、Cookies、開くポップアップ、埋め込みリソース、iframeで言及されています。

## オリジン

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Origin", width="680", height="100" %}

「オリジン」は、[スキーム](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)（[プロトコル](https://developer.mozilla.org/docs/Glossary/Protocol)とも呼ばれ、 [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP)や[HTTPSなど](https://developer.mozilla.org/docs/Glossary/HTTPS)）、[ホスト名](https://en.wikipedia.org/wiki/Hostname)、および[ポート](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port)（指定されている場合）の組み合わせです。たとえば、URLが`https://www.example.com:443/foo`場合、「origin」は`https://www.example.com:443`です。

### 「same-origin」と「cross-origin」{: #same-origin-and-cross-origin}

同じスキーム、ホスト名、ポートの組み合わせを持つWebサイトは、「同一オリジン」と見なされます。それ以外はすべて「オリジン間」と見なされます。

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>オリジンA</th>
        <th>オリジンB</th>
        <th>オリジンAとオリジンBが「same-origin」か「cross-origin」かについての説明します。</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https：// <strong>www.evil.com：443</strong>
</td>
        <td>cross-origin：異なるドメイン</td>
      </tr>
      <tr>
        <td>https：// <strong>example.com：443</strong>
</td>
        <td>cross-origin：異なるサブドメイン</td>
      </tr>
      <tr>
        <td>https：// <strong>login</strong> .example.com：443</td>
        <td>cross-origin：異なるサブドメイン</td>
      </tr>
      <tr>
        <td><strong>http://www.example.com:443</strong></td>
        <td>cross-origin：異なるスキーム</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com：80</strong></td>
        <td>cross-origin：異なるポート</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-origin：完全一致</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-origin：暗黙のポート番号（443）が一致する</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## サイト

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Site", width="680", height="142" %}

`.com`や`.org`などのトップレベルドメイン（TLD）は、[ルートゾーンデータベースに](https://www.iana.org/domains/root/db)リストされています。上記の例では、「サイト」はTLDとその直前のドメインの一部の組み合わせです。 `https://www.example.com:443/foo` / fooのURLが与えられた場合、「サイト」は`example.com`です。

しかし、`.co.jp`や`.github.io`などのドメインの`.jp`または`.io` TLDを使用するだけでは、「サイト」を識別できるほど正確ではありません。また、特定のTLDの登録可能ドメインのレベルをアルゴリズム的に決定する方法はありません。そのため、「有効なTLD」（eTLD）のリストが作成されました。これらは、[Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List)で定義されています。 eTLDのリストは、[publicsuffix.org/list](https://publicsuffix.org/list/)で管理されています。

サイト名全体はeTLD + 1として知られています。たとえば、URLが`https://my-project.github.io`場合、eTLDは`.github.io`あり、eTLD + 1は`my-project.github.io`であり、これは「サイト」と見なされます。つまり、eTLD + 1は有効なTLDであり、その直前のドメインの一部です。

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### 「same-site」と「cross-site」{: #same-site-cross-site}

同じeTLD + 1を持つWebサイトは、「same-site」と見なされます。異なるeTLD + 1を持つWebサイトは、「cross-site」です。

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>オリジンA</th>
        <th>オリジンB</th>
        <th>オリジンAとオリジンBが「same-site」か「cross-site」かについての説明</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https：// <strong>www.evil.com：443</strong>
</td>
        <td>cross-site：異なるドメイン</td>
      </tr>
      <tr>
        <td>https：// <strong>login</strong> .example.com：443</td>
        <td><strong>same-site：異なるサブドメインは重要ではありません</strong></td>
      </tr>
      <tr>
        <td><strong>http://www.example.com:443</strong></td>
        <td><strong>same-site：異なるスキームは重要ではありません</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com：80</strong></td>
        <td><strong>same-site：異なるポートは重要ではありません</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-site：完全に一致します</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-site：ポートは重要ではありません</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### 「計画的なsame-site」

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

「same-site」の定義は、HTTPが[脆弱なチャネル](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8)として使用されないように、 URL スキームをサイトの一部として考慮するように展開されています。ブラウザがこのように解釈すると、古い定義を参照する場合は[「スキームのないsame-site](/schemeful-samesite/)」への参照が表示され、より厳密な定義を参照する場合は「スキームのないsame-site」への参照が表示される場合があります。その場合、スキームが一致しないため`http://www.example.com`と`https://www.example.com`はcross-siteと見なされます。

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>オリジンA</th>
        <th>オリジンB</th>
        <th>オリジンAとオリジンBが「計画的なsame-site」であるかどうかの説明します</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https：// <strong>www.evil.com：443</strong>
</td>
        <td>cross-site：異なるドメイン</td>
      </tr>
      <tr>
        <td>https：// <strong>login</strong> .example.com：443</td>
        <td><strong>計画的なsame-site：異なるサブドメインは重要ではありません</strong></td>
      </tr>
      <tr>
        <td><strong>http://www.example.com:443</strong></td>
        <td>cross-site：異なるスキーム</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com：80</strong></td>
        <td><strong>計画的なsame-site：異なるポートは重要ではありません</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>計画的なsame-site：完全に一致します</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>計画的なsame-site：ポートは重要ではありません</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## リクエストが「same-site」、「same-origin」、「cross-site」のいずれであるかを確認する方法

Chromeは`Sec-Fetch-Site`headerでリクエストを送信します。 2020年4月の時点から、 `Sec-Fetch-Site`をサポートするブラウザがありません。[これは、より大きなFetch Metadata RequestHeaders](https://www.w3.org/TR/fetch-metadata/)提案の一部です。headerには、次のいずれかの値が含まれます。

- `cross-site`
- `same-site`
- `same-origin`
- `none`

`Sec-Fetch-Site`の値を調べることで、リクエストが「same-site」、「same-origin」、「cross-site」のいずれであるかを判断できます（「schemeful-same-site」は `Sec-Fetch-Site` でキャプチャされません）。
