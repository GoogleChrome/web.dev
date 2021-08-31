---
layout: post
title: クロスオリジンアイソレーションを有効にするためのガイド
authors:
  - agektmr
date: '2021-02-09'
updated: '2021-05-06'
subhead: |2

  クロスオリジン分離により、Webページで次のような強力な機能を使用できます。

  SharedArrayBuffer。この記事では、クロスオリジンを有効にする方法について説明します

  あなたのウェブサイトの分離。
description: |2

  クロスオリジン分離により、Webページで次のような強力な機能を使用できます。

  SharedArrayBuffer。この記事では、クロスオリジンを有効にする方法について説明します

  あなたのウェブサイトの分離。
tags:
  - security
---

このガイドでは、クロスオリジン分離を有効にする方法を説明します。 [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 、 [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/) 、[より高精度の高解像度タイマー](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/)、またはJS Self-Profiling APIを使用する場合は、クロスオリジン分離が必要です。

クロスオリジン分離を有効にする場合は、広告の配置など、ウェブサイト上の他のクロスオリジンリソースに与える影響を評価してください。

{% Details %} {% DetailsSummary %} Webサイトの`SharedArrayBuffer`が使用されているかを判断する

`SharedArrayBuffer`を使用する機能は、クロスオリジン分離なしでは機能しなくなります。 `SharedArrayBuffer`非推奨メッセージが原因でこのページにアクセスした場合は、Webサイトまたはそれに埋め込まれているリソースの1つが`SharedArrayBuffer`を使用している可能性があります。非推奨のためにWebサイトが中断しないようにするには、使用場所を特定することから始めます。

{% endDetailsSummary %}

{% Aside 'objective' %}

- SharedArrayBufferを使い続けるには、クロスオリジンアイソレーションを`SharedArrayBuffer`ます。
- `SharedArrayBuffer`を使用するサードパーティのコードに依存している場合は、サードパーティのプロバイダーにアクションを実行するように通知してください。 {% endAside %}

`SharedArrayBuffer`がサイトのどこで使用されているかわからない場合は、次の2つの方法で確認できます。

- ChromeDevToolsの使用
- （詳細）非推奨レポートの使用

`SharedArrayBuffer`を使用している場所がすでにわかっている場合は、スキップして[クロスオリジン分離の影響](#analysis)を分析します。

### ChromeDevToolsの使用

[Chrome DevToolsを](https://developers.google.com/web/tools/chrome-devtools/open)使用すると、開発者はWebサイトを検査できます。

1. [SharedArrayBuffer](https://developers.google.com/web/tools/chrome-devtools/open)を使用していると`SharedArrayBuffer`れるページでChromeDevToolsを開きます。
2. **コンソール**パネルを選択します。
3. `SharedArrayBuffer`を使用している場合、次のメッセージが表示されます。
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. メッセージの最後にあるファイル名と行番号（たとえば、 `common-bundle.js:535` ）は、 `SharedArrayBuffer`示します。サードパーティのライブラリの場合は、開発者に連絡して問題を修正してください。 Webサイトの一部として実装されている場合は、以下のガイドに従って、クロスオリジン分離を有効にしてください。

<figure class="w-figure">{％Img src = "image / YLflGBAPWecgtKJLqCJHSzHqe2J2 / GOgkyjAabePTc8AG22F7.png"、alt = "SharedArrayBufferがクロスオリジン分離なしで使用された場合のDevTooolsコンソール警告"、width = "800"、height = "163"、class = "w-screenshot "％}<figcaption> SharedArrayBufferがクロスオリジン分離なしで使用された場合のDevTooolsコンソールの警告。</figcaption></figure>

### （詳細）非推奨レポートの使用

一部のブラウザには、指定されたエンドポイントへの[APIを非推奨にするレポート機能があります。](https://wicg.github.io/deprecation-reporting/)

1. [非推奨のレポートサーバーをセットアップし、レポートURLを取得します](/coop-coep/#set-up-reporting-endpoint)。これは、公共サービスを使用するか、自分で構築することで実現できます。
2. `SharedArrayBuffer`提供している可能性のあるページに次のHTTPヘッダーを設定します。
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. ヘッダーの伝播が開始されると、登録したエンドポイントが非推奨レポートの収集を開始する必要があります。

ここで実装例を参照してください： [https](https://first-party-test.glitch.me) ：//first-party-test.glitch.me。

{% endDetails %}

## クロスオリジン分離の影響を分析する{：#analysis}

実際に何も壊さずに、クロスオリジン分離を有効にするとサイトに与える影響を評価できたら素晴らしいと思いませんか？ [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)および[`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)ヘッダーを使用すると、まさにそれを実行できます。

1. トップレベルドキュメントで[`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)名前が示すように、このヘッダーは`COOP: same-origin`**が**サイトに与える影響に関するレポートのみを送信します。ポップアップウィンドウとの通信が実際に無効になることはありません。
2. レポートを設定し、レポートを受信して保存するようにWebサーバーを構成します。
3. トップレベルのドキュメントに[`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources)繰り返しになりますが、このヘッダーを使用すると、サイトの機能に実際に影響を与えることなく`COEP: require-corp`このヘッダーは、前の手順で設定したのと同じレポートサーバーにレポートを送信するように構成できます。

{% Aside %} Chrome DevTools**ネットワーク**[**パネルの[ドメイン**]列を有効にして、](https://developers.google.com/web/tools/chrome-devtools/network#information)影響を受けるリソースの概要を取得することもできます。 {% endAside %}

{% Aside 'caution' %}

クロスオリジン分離を有効にすると、明示的にオプトインしていないクロスオリジンリソースの読み込みがブロックされ、トップレベルのドキュメントがポップアップウィンドウと通信できなくなります。

クロスオリジン分離ではすべてのサブリソースが明示的にオプトインする必要があるため、クロス`Cross-Origin-Resource-Policy`を大規模にデプロイする方法を模索してきました。そして、反対の方向に進むというアイデアを思いつきまし[た。新しいCOEPの「クレデンシャルなし」モード](https://github.com/mikewest/credentiallessness/)で、すべてのクレデンシャルを削除することで、CORPヘッダーなしでリソースをロードできます。 `Cross-Origin-Resource-Policy`ヘッダーを送信していることを確認する負担が軽減されることを願っています。

`Cross-Origin-Opener-Policy: same-origin`ヘッダーは、OAuthや支払いなどのクロスオリジンウィンドウの相互作用を必要とする統合を壊すことが知られています。この問題を軽減するために[、条件を緩和して、](https://github.com/whatwg/html/issues/6364) `Cross-Origin-Opener-Policy: same-origin-allow-popups`へのクロスオリジン分離を有効にすることを検討しています。このようにして、それ自体で開いたウィンドウとの通信が可能になります。

クロスオリジンアイソレーションを有効にしたいが、これらの課題によってブロックさ[れている場合は、オリジントライアルに登録し](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)、新しいモードが利用可能になるまで待つことをお勧めします。これらの新しいモードが利用可能になるまで、オリジントライアルを終了する予定はありません。

{% endAside %}

## クロスオリジン分離の影響を軽減する

クロスオリジン分離の影響を受けるリソースを決定したら、これらのクロスオリジンリソースを実際にオプトインする方法に関する一般的なガイドラインを次に示します。

1. 画像、スクリプト、スタイルシート、iframeなどの[`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin)ヘッダーを設定します。同じサイトのリソースで、[`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin)ヘッダーを設定します。
2. [リソースがCORS](/cross-origin-resource-sharing/)で提供される場合は、トップレベルドキュメントのHTMLタグに`crossorigin`属性を設定します（たとえば、 `<img src="example.jpg" crossorigin>` ）。
3. iframeにロードされたクロスオリジンリソースにiframeの別のレイヤーが含まれる場合は、先に進む前に、このセクションで説明されている手順を再帰的に適用してください。
4. すべてのクロスオリジンリソースがオプトインされていることを確認したら、iframeにロードされたクロスオリジンリソースに`Cross-Origin-Embedder-Policy: require-corp`
5. `postMessage()`介した通信を必要とするクロスオリジンポップアップウィンドウがないことを確認してください。クロスオリジンアイソレーションが有効になっている場合、それらを機能させ続ける方法はありません。クロスオリジンで分離されていない別のドキュメントに通信を移動したり、別の通信方法（HTTPリクエストなど）を使用したりできます。

## クロスオリジン分離を有効にする

クロスオリジン分離による影響を軽減した後、クロスオリジン分離を有効にするための一般的なガイドラインを次に示します。

1. `Cross-Origin-Opener-Policy: same-origin`ヘッダーを設定します。 `Cross-Origin-Opener-Policy-Report-Only: same-origin`場合は、それを置き換えます。これにより、トップレベルのドキュメントとそのポップアップウィンドウ間の通信がブロックされます。
2. `Cross-Origin-Embedder-Policy: require-corp`ヘッダーを設定します。 `Cross-Origin-Embedder-Policy-Report-Only: require-corp`場合は、それを置き換えます。これにより、オプトインされていないクロスオリジンリソースのロードがブロックされます。
3. `self.crossOriginIsolated`が`true`を返すことを確認して、ページがクロスオリジンで分離されていることを確認します。

{% Aside 'gotchas' %}

単純なサーバーはヘッダーの送信をサポートしていないため、ローカルサーバーでクロスオリジン分離を有効にするのは面倒な場合があります。 `--enable-features=SharedArrayBuffer`を使用してChromeを起動すると、クロスオリジン分離を有効に`SharedArrayBuffer`を有効にできます。 [それぞれのプラットフォームでコマンドラインフラグを使用してChromeを実行する方法を](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)学びます。

{% endAside %}

## 資力

- [COOPとCOEPを使用してWebサイトを「クロスオリジン分離」にする](/coop-coep/)
- [Android Chrome88およびDesktopChrome92でのSharedArrayBufferの更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
