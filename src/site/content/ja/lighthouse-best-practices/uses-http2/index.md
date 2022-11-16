---
layout: post
title: すべてのリソースにHTTP/2を使用していない
description: ページの読み込み時間にHTTP/2が重要である理由と、サーバーでHTTP/2を有効にする方法。
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2019-08-28
---

HTTP/2は、ページのリソースをより高速に提供し、ネットワークで転送されるデータを減らします。

## Lighthouse HTTP/2監査が失敗する理由

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)では、HTTP/2経由で提供されないすべてのリソースが表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt="Lighthouse監査は、HTTP/2経由提供されていないリソースを示しています ", width="800", height="191" %}</figure>

Lighthouseは、ページによって要求されたすべてのリソースを収集し、それぞれのHTTPプロトコルバージョンをチェックします。 HTTP/2以外の要求が監査結果で無視される場合があります。詳細については、[実装を参照](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138)してください。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## この監査に合格する方法

HTTP/2を経由でリソースを提供します。

サーバーでHTTP/2を有効にする方法については、[HTTP/2の設定](https://dassur.ma/things/h2setup/)を参照してください。

## リソース

- [**すべてのリソース監査にHTTP/2を使用していない**のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/uses-http2.js)
- [HTTP/2の概要](/performance-http2/)
- [HTTP/2のよくある質問](https://http2.github.io/faq/)
