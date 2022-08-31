---
layout: post
title: テキストの圧縮を有効にする
description: |2-

  テキストの圧縮を有効にすると、ウェブページの読み込みパフォーマンスが向上する仕組みについて学びます。
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-text-compression
---

テキストベースのリソースは、ネットワークの総バイト数を最小限に抑えるために圧縮して提供する必要があります。Lighthouseレポートの[Opportunities]セクションには、圧縮されていないテキストベースのリソースがすべて表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZftZfKlPcEu2cs4ltwK8.png", alt="Lighthouseによる「テキストの圧縮を有効にする」監査のスクリーンショット", width="800", height="271" %}</figure>

## Lighthouseがテキストの圧縮を取り扱う方法

Lighthouseは、次に該当するすべてのレスポンスを収集します。

- テキストベースのリソースタイプを持っている。
- `br` 、`gzip` 、または`deflate`に設定されていない`content-encoding`ヘッダーが含まれていない。

次に、Lighthouseは[GZIP](https://www.gnu.org/software/gzip/)を使ってこれらを圧縮し、削減を見込めるデータ量を算出します。

レスポンスの元のサイズが1.4KiB未満の場合、または圧縮により削減を見込めるデータ量が元のサイズの10％未満の場合、Lighthouseは結果の中でそのレスポンスをフラグしません。

{% Aside 'note' %} Lighthouseにより表示されるデータ量削減の見込みは、レスポンスがGZIPでエンコードされた場合の見込みです。 Brotliを使用すれば、さらなる削減が可能です。{% endAside %}

## サーバーでテキストの圧縮を有効にする方法

この監査に合格するには、こうしたレスポンスを提供したサーバーでテキストの圧縮を有効にします。

ブラウザはリソースをリクエストするとき、[`Accept-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Encoding) HTTPリクエストヘッダーを使用して、サポートしている圧縮アルゴリズムを示します。

```text
Accept-Encoding: gzip, compress, br
```

[ブラウザがBrotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) (`br`) をサポートしている場合は、Brotliを使用することをおすすめします。他の圧縮アルゴリズムよりもリソースのファイルサイズを多く削減できます。`how to enable Brotli compression in <X> (<X> で Brotli を使った圧縮を有効にする方法)`を検索してください (`<X>`にはサーバーの名前が入ります)。2020年6月の時点で、Brotliは、Internet Explorer、デスクトップ版 Safari、iOS 版 Safariを除くすべての主要なブラウザーでサポートされています。最新情報は、[Browser compatibility (ブラウザの互換性)](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding#Browser_compatibility) を参照してください。

BrotliのフォールバックとしてGZIPを使用します。 GZIPはすべての主要なブラウザーでサポートされていますが、効率面ではBrotliに劣ります。その例については、[Server Config (サーバー構成)](https://github.com/h5bp/server-configs) を参照してください。

サーバーは、[`Content-Encoding`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding) HTTP レスポンスヘッダーを返し、使用した圧縮アルゴリズムを示す必要があります。

```text
Content-Encoding: br
```

## レスポンスがChrome DevToolsで圧縮されたかどうかを確認する

サーバーがレスポンスを圧縮したかどうかを確認するには、以下のことを行います。

{% Instruction 'devtools-network', 'ol' %}

1. 関心のあるレスポンスを引き起こしたリクエストをクリックします。
2. **Headers**] (ヘッダー) タブをクリックします。
3. **[Response Headers]** (レスポンスヘッダー) セクションの`content-encoding`ヘッダーを確認します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jBKe0MYnlcQK9OLzAKTa.svg", alt="content-encoding レスポンスヘッダー", width="800", height="571" %}<figcaption> <code>content-encoding</code>レスポンスヘッダー。</figcaption></figure>

レスポンスの圧縮されたときのサイズと圧縮解除されたときのサイズを比較するには、以下のことを行います。

{% Instruction 'devtools-network', 'ol' %}

1. 大きなリクエスト行を有効にします。[Use large request rows (大きなリクエスト行を使用する)](https://developer.chrome.com/docs/devtools/network/reference/#request-rows)を参照してください。
2. 関心のあるレスポンスの[**Size**]列を見てください。一番上の値は圧縮されたサイズで、一番下の値は圧縮解除されたサイズです。

[Minify and compress network payloads (ネットワークペイロードの縮小と圧縮)](/reduce-network-payloads-using-text-compression) も参照してください。

## スタック固有のガイダンス

### Joomla

Gzipのページ圧縮設定を有効にします (**System** (システム) &gt; **Global configuration** (グローバル構成) &gt; **Server** (サーバー))。

### WordPress

ウェブサーバー構成でテキストの圧縮を有効にします。

## リソース

- [**Enable text compression (テキストの圧縮を有効にする)** 監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-text-compression.js)
