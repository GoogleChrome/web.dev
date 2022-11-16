---
layout: post
title: 要求されるオリジンへの事前接続
description: |2

  uses-rel-preconnect監査について学習します。
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - uses-rel-preconnect
---

LighthouseレポートのOpportunitiesセクションには、`<link rel=preconnect>`でフェッチリクエストを優先していないすべての主要なリクエストの一覧が表示されます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Lighthouseの「要求されたオリジンへの事前接続」監査のスクリーンショット", width="800", height="226" %}</figure>

## ブラウザの互換性

`<link rel=preconnect>`はほとんどのブラウザでサポートされています。[ブラウザの互換性](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)を参照してください。

## 事前接続でページの読み込み速度を向上させる

重要なサードパーティオリジンへの早期接続を確立するために、`preconnect`または`dns-prefetch`リソースヒントを追加することを検討してください。

`<link rel="preconnect">`は、ページが別のオリジンへの接続を確立する意図があり、プロセスをできるだけ早く開始することをブラウザに通知します。

接続の確立には、DNSルックアップ、リダイレクト、およびユーザーの要求を処理する最終サーバーへの数回のラウンドトリップが含まれる可能性があるため、特に接続を保護する際に、低速ネットワークであればかなりの時間がかかることがよくあります。

これらすべてを事前に処理しておけば、帯域幅の使用に悪影響が及ぶことなくアプリケーションの読み込みがより迅速に行われている感触をユーザーに与えることができます。接続の確立にかかる時間の大伴は、データやり取りではなく、待機に費やされるためです。

ページにリンクタグを追加するのと同じくらい簡単に、ブラウザに意図を通知することができます。

`<link rel="preconnect" href="https://example.com">`

これでブラウザはページが`example.com`に接続し、コンテンツを取得する意図を認識できます。

`<link rel="preconnect">`はかなり低コストですが、特に安全な接続では貴重なCPU時間を消費する可能性があることに注意してください。これは特に、ブラウザが閉じられる際に、接続が10秒以内に使用されていない場合に問題であり、早期接続の処理がすべて無駄になってしまいます。

一般的には、`<link rel="preload">`を使用してみてください。これは、より包括的にパフォーマンスを調整できますが、次のようなエッジケースの場合は、ツールベルトに`<link rel="preconnect">`を保持してください。

- [ユースケース：どこから来たのかはわかっているが、何を取得しているのかはわからない](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [ユースケース：ストリーミングメディア](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">`は、接続に関連する`<link>`のタイプの一つです。これはDNSルックアップのみを処理しますが、より幅広いブラウザーサポートを備えているため、優れたフォールバックとして機能する可能性があります。使用方法はまったく同じです。

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## スタック特定のガイダンス

### Drupal

[ユーザーエージェントのリソースヒントをサポートするモジュールを](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search)使用すると、事前接続またはDNSプリフェッチリソースヒントをインストールして構成できます。

### Magento

[テーマのレイアウトを変更](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html)し、事前接続またはDNSプリフェッチリソースヒントを追加します。

## リソース

- [**必要なオリジンへの事前接続**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preconnect.js)
- [リソースの優先順位付け―ブラウザの支援を活用する](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [ページ速度の感触を改善するために、早期にネットワーク接続を確立する](/preconnect-and-dns-prefetch/)
- [Linkタイプ: preconnect](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
