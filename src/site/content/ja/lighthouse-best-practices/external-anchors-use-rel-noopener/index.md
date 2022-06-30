---
layout: post
title: 安全でないクロスオリジン宛先へのリンク
description: |2-

  別のホスト上のリソースに安全にリンクする方法を学びます。
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

`target="_blank"`属性を使用して別のサイトのページにリンクすると、サイトのパフォーマンスとセキュリティに問題が発生する可能性があります。

- 他のページは、あなたのページと同じプロセスで実行される場合があります。他のページが多くのJavaScriptを実行している場合、あなたのページのパフォーマンスが低下する可能性があります。
- 他のページは`window.opener`プロパティを使用してあなたの`window`オブジェクトにアクセスできます。これにより、他のページがあなたのページを悪意のあるURLにリダイレクトする可能性があります。

`rel="noopener"`または`rel="noreferrer"`をあなたの`target="_blank"`リンクに追加することで、これらの問題を回避できます。

{% Aside %} Chromiumバージョン88の時点では、`target="_blank"`のアンカーはデフォルトで自動的に[`noopener`の動作を取得します](https://www.chromestatus.com/feature/6140064063029248)。明示的に`rel="noopener"`を指定することで、Edge LegacyやInternet Explorerなどのレガシーブラウザのユーザーを保護することができます。 {% endAside %}

## Lighthouseのクロスオリジン宛先監査が失敗する理由

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)は、安全でないクロスオリジン宛先へのリンクにフラグを設定します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="安全でないクロスオリジン宛先へリンクを示すLighthouse監査", width="800", height="213" %}</figure>

Lighthouseは、次のプロセスを使用して、リンクを安全でないものとして識別します。

1. `target="_blank"`属性を含み、 `rel="noopener"`または`rel="noreferrer"`属性を含まないすべての`<a>`タグを収集します。
2. 同じホストのリンクをすべて除外します。

Lighthouseは同じホストのリンクを除外するため、大型のサイトで作業している場合には注意すべき事項があります。1つのページに、同一サイト上の別のページへの`target="_blank"`リンクが`rel="noopener"`を使用せずに含まれている場合でも、この監査のパフォーマンスに関する影響が適用されますが、Lighthouseの結果には、これらのリンクが表示されません。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## サイトのパフォーマンスを改善し、セキュリティの脆弱性を防ぐには

Lighthouseレポートで識別された各リンクに`rel="noopener"`または`rel="noreferrer"`を追加してください。一般に、`target="_blank"`を使用する場合は、常に`rel="noopener"`または`rel="noreferrer"`を追加してください。

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"`によって、新しいページは`window.opener`プロパティにアクセスできなくなり、別のプロセスで実行されるようになります。
- `rel="noreferrer"`も同じ効果がありますが、 `Referer`ヘッダーが新しいページに送信されないようにします。「["noreferrer" リンクタイプ](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer)」をご覧ください。

詳細については、「[クロスオリジンリソースを安全に共有する](/cross-origin-resource-sharing/)」をご覧ください。

## リソース

- [**安全でないクロスオリジン宛先へのリンク**監査のソースコード](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [クロスオリジンリソースを安全に共有する](/cross-origin-resource-sharing/)
- [ウェブ開発者向けのサイト分離](https://developers.google.com/web/updates/2018/07/site-isolation)
