---
layout: post
title: HTTPキャッシュを使用して不要なネットワーク要求を防ぐ
authors:
  - jeffposnick
  - ilyagrigorik
date: 2018-11-05
updated: 2020-04-17
description: どのようにすれば不要なネットワーク要求を回避できるのでしょうか。ブラウザのHTTPキャッシュは第1ディフェンスラインです。この方法は必ずしも最も強力または柔軟なアプローチであるとは限りません。また、キャッシュに格納された応答の存続期間を制御する能力も限定的です。しかし、これは効果的で、すべてのブラウザでサポートされているため、簡単に導入することができます。
codelabs:
  - codelab-http-cache
feedback:
  - api
---

ネットワーク上でリソースを取得するには、時間とコストの両方がかかります。

- サイズが大きい応答では、ブラウザとサーバーと間で何度も往復する必要があります。
- [重要なリソース](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)がすべて完全にダウンロードされるまで、ページは読み込まれません。
- データ量が制限されているモバイルデータプランでサイトにアクセスしている場合、不要なネットワーク要求はすべて無駄なコストになります。

どのようにすれば不要なネットワーク要求を回避できるのでしょうか。ブラウザのHTTPキャッシュは第1ディフェンスラインです。この方法は必ずしも最も強力または柔軟なアプローチであるとは限りません。また、キャッシュに格納された応答の存続期間を制御する能力も限定的です。しかし、これは効果的で、すべてのブラウザでサポートされているため、簡単に導入することができます。

このガイドでは、効果的なHTTPキャッシュ実装の基本について説明します。

## ブラウザの互換性{: #browser-compatibility }

実際には、HTTPキャッシュと呼ばれる単一のAPIはありません。これは、WebプラットフォームAPIのコレクションの一般的な名前です。これらのAPIは、すべてのブラウザでサポートされています。

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Browser_compatibility)
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#Browser_compatibility)
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified#Browser_compatibility)

## HTTPキャッシュの仕組み{: #overview }

ブラウザが行うすべてのHTTP要求は、最初にブラウザキャッシュにルーティングされ、要求の実行に使用できる有効な応答がキャッシュにあるかどうかが確認されます。一致する応答がある場合、応答はキャッシュから読み取られます。これにより、ネットワーク遅延と転送のデータコストの両方が解消されます。

HTTPキャッシュの動作は、[要求ヘッダー](https://developer.mozilla.org/docs/Glossary/Request_header)と[応答ヘッダーの](https://developer.mozilla.org/docs/Glossary/Response_header)組み合わせによって制御されます。理想的なシナリオでは、Webアプリケーションのコード (要求ヘッダーを決定する) とWebサーバーの構成 (応答ヘッダーを決定する) の両方を制御できるようになります。

詳細な概念の概要については、 MDNの[HTTPキャッシュ](https://developer.mozilla.org/docs/Web/HTTP/Caching)の記事を確認してください。

## 要求ヘッダー：デフォルトを使用する (通常) {: #request-headers }

Webアプリケーションの送信要求には多数の重要なヘッダーが含まれていますが、ほとんどの場合、要求が実行されると、ユーザーではなく、ブラウザによってヘッダーが設定されます。 [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match)と[`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since)など、鮮度のチェックに影響する要求ヘッダーは、ブラウザで認識されているHTTPキャッシュの現在の値に基づいて表示されます。

これは朗報です。つまり、`<img src="my-image.png">`ようなタグを引き続きHTMLに含めることができ、ユーザー側で作業しなくても、ブラウザで自動的にHTTPキャッシュが処理されます。

{% Aside %} WebアプリケーションでHTTPキャッシュの制御を強化する必要がある開発者向けには、別の方法があります。レベルを落とし、手動で[APIの取得](https://developer.mozilla.org/docs/Web/API/Fetch_API)を使用して、特定の[`Request`](https://developer.mozilla.org/docs/Web/API/Request)オーバーライドが設定された[`Request`](https://developer.mozilla.org/docs/Web/API/Request/cache)オブジェクトを渡すことができます。ただし、これはこのガイドの対象外であるため、ここでは説明しません。 {% endAside %}

## 応答ヘッダー：Webサーバーを構成する{: #response-headers }

HTTPキャッシュ設定の最も重要な部分は、Webサーバーが各送信応答に追加するヘッダーです。次のヘッダーはすべて、効果的なキャッシュ動作に影響します。

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control): サーバーは、 `Cache-Control`ディレクティブを返します。このディレクティブは、ブラウザおよびその他の中間キャッシュが個々の応答をキャッシュする方法と期間を指定します。
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag): ブラウザは、期限切れになったキャッシュに格納された応答を見つけると、小さいトークン (通常はファイルの内容のハッシュ) をサーバーに送信して、ファイルが変更されたかどうかを確認できます。サーバーが同じトークンを返す場合、ファイルは同じであり、再ダウンロードする必要はありません。
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified): このヘッダーは、`ETag`と同じ目的を果たしますが、`ETag`のコンテンツベースのストラテジとは対照的に、時間ベースのストラテジを使用して、リソースが変更されたかどうかを判断します。

一部のWebサーバーには、デフォルトでこれらのヘッダーを設定するためのビルトインのサポートがありますが、明示的に構成しないかぎり、ヘッダーを完全に除外するものもあります。ヘッダーの構成*方法*の具体的な詳細は、使用するWebサーバーによって大きく異なります。最も正確な詳細については、サーバーのマニュアルを参照してください。

検索を減らすために、いくつかの一般的なWebサーバーの構成に関する手順を次に示します。

- [Express](https://expressjs.com/en/api.html#express.static)
- [Apache](https://httpd.apache.org/docs/2.4/caching.html)
- [nginx](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Firebase Hosting](https://firebase.google.com/docs/hosting/full-config)
- [Netlify](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/)

`Cache-Control`応答ヘッダーを省略しても、HTTPキャッシュは無効になりません。特定のタイプのコンテンツに対して最も合理的なキャッシュ動作の種類は、ブラウザによって[効果的に推測](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness)されます。ブラウザの推測よりも詳細な制御が必要になる可能性があるため、時間をかけて応答ヘッダーを構成してください。

## 使用すべき応答ヘッダー値{: #response-header-strategies }

Webサーバーの応答ヘッダーを構成するときには、次の2つの重要なシナリオに対応してください。

### バージョン管理されたURLの長期キャッシュ{: #versioned-urls }

{% Details %} {% DetailsSummary 'h4' %}バージョン管理されたURLはキャッシュストラテジに役立ちます。バージョン管理されたURLは、キャッシュに保存された応答を簡単に無効化できるため、優れた方法です。{% endDetailsSummary %}サーバーがブラウザーにCSSファイルを1年間キャッシュに保存するように命令 (<code>Cache-Control: max-age=31536000</code>) し、設計者が緊急更新を行ったため、すぐにロールアウトする必要があるとします。キャッシュに保存された「古い」コピーを更新するようにブラウザに通知するにはどうすればよいのでしょうか。少なくとも、リソースのURLを変更せずに行うことはできません。ブラウザが応答をキャッシュに保存した後、キャッシュに保存されたバージョンは、<code>max-age</code>または<code>expires</code>の判定に基づき最新の状態でなくなったか、何らかの他の理由 (たとえば、ユーザーがブラウザのキャッシュを消去したなど) でキャッシュから削除されるまで使用されます。その結果、ページの作成時に異なるユーザーが異なるバージョンのファイルを使用する可能性があります。つまり、リソースを取得したばかりのユーザーは新しいバージョンを使用し、以前の (まだ有効な) コピーをキャッシュに保存したユーザーは古いバージョンの応答を使用します。クライアント側のキャッシュと迅速な更新の両方の長所をどのように活用できるのでしょうか。コンテンツが変更されるたびに、リソースのURLを変更し、ユーザーに新しい応答を強制的にダウンロードさせることになります。通常、これを行うには、ファイルのフィンガープリントまたはバージョン番号をファイル名に埋め込みます (例: <code>style.x234dff.css</code>。{% endDetails %}

[フィンガープリント](https://en.wikipedia.org/wiki/Fingerprint_(computing))またはバージョン情報を含み、内容が変更されないURLの要求に応答する場合は、応答に`Cache-Control: max-age=31536000`を追加します。

この値を設定すると、次の1年間 (31,536,000秒、サポートされる最大値) の任意の時点で同じURLを読み込む必要があるときに、Webサーバーに対してネットワーク要求をまったく行わずに、HTTPキャッシュ内の値をすぐに使用できることをブラウザに通知します。これはすばらしいことです。ネットワークを回避することで信頼性と速度がすぐに実現できます。

webpackのようなビルドツールは、アセットURLにハッシュフィンガープリントを割り当てる[プロセスを自動化](https://webpack.js.org/guides/caching/#output-filenames)できます。

{% Aside %}さらなる最適化として[`immutable`プロパティ](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading)を`Cache-Control`ヘッダーに追加することもできますが、一部のブラウザでは[無視されます](https://www.keycdn.com/blog/cache-control-immutable#browser-support)。{% endAside %}

### バージョン管理されていないURLのサーバーによる再検証{: #unversioned-urls }

残念ながら、読み込むすべてのURLがバージョン管理されるわけではありません。Webアプリケーションを展開する前に、ビルドステップを含めることができず、ハッシュをアセットURLに追加できない場合もあります。さらに、すべてのWebアプリケーションではHTMLファイルが必要です。これらのファイルはバージョン情報を含むことはほとんどありません。アクセスするURLが`https://example.com/index.34def12.html`であることを記憶している必要がある場合、Webアプリをわざわざ使用することはありません。では、このようなURLに対して何ができるのでしょうか。

このシナリオでは、敗北を認めなければなりません。 HTTPキャッシュだけでは、ネットワークを完全に回避するほど強力ではありません。([サービスワーカー](/service-workers-cache-storage/)についてはすぐに学習します。サービスワーカーはこの状況を有利にするために必要なサポートを提供します。) ただし、ネットワーク要求が可能なかぎり高速かつ効率的であることを保証するために実行できるいくつかの手順があります。

次の`Cache-Control`値は、バージョン管理されていないURLがキャッシュに保存される場所と方法を微調整するのに役立ちます。

- `no-cache`: これは、キャッシュに保存されたバージョンのURLを使用する前に、毎回サーバーで再検証する必要があることをブラウザに命令します。
- `no-store` 。これは、ブラウザおよびその他の中間キャッシュ（CDNなど）に、ファイルのどのバージョンも保存しないように指示します。
- `private`: ブラウザはファイルをキャッシュに保存できますが、中間キャッシュはできません。
- `public`: 応答は任意のキャッシュに保存できます。

[付録: `Cache-Control`フローチャート](#flowchart)を確認して、使用する`Cache-Control`値を決定するプロセスを視覚化してください。 `Cache-Control`には、カンマ区切りのディレクティブのリストを使用することもできます。<a href="#examples" data-md-type="link">付録: `Cache-Control`の例</a>を参照してください。

さらに、[`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag)または[`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified)の2つの追加の応答ヘッダーのいずれかを設定することも役立ちます。[Responseヘッダー](#response-headers)で説明したように、`ETag`と`Last-Modified`はいずれも同じ目的を果たします。つまり、ブラウザで有効期限が切れたキャッシュのファイルを再ダウンロードする必要があるかどうかを判断します。`ETag`の方が正確であり、推奨されます。

{% Details %} {% DetailsSummary 'h4' %}ETagの例: {% endDetailsSummary %}最初の取得から120秒が経過し、ブラウザが同じリソースに対して新しい要求を開始したと仮定します。まず、ブラウザはHTTPキャッシュをチェックし、以前の応答を検索します。残念ながら、応答の有効期限が切れているため、ブラウザは以前の応答を使用できません。この時点で、ブラウザは新しい要求を配信し、新しい完全な応答を取得できます。ただし、リソースが変更されていない場合は、すでにキャッシュにある同じ情報をダウンロードする理由がないため、これは非効率的です。 <code>ETag</code>ヘッダーで指定されている検証トークンが解決するように設計されている問題です。サーバーは任意のトークンを生成して返します。これは通常、ファイルの内容のハッシュまたはその他のフィンガープリントです。ブラウザは、フィンガープリントがどのように生成されるかを認識する必要はありません。次の要求でサーバーに送信するだけで済みます。フィンガープリントが同じである場合、リソースは変更されておらず、ブラウザはダウンロードをスキップできます。 {% endDetails %}

`ETag`または`Last-Modified`を設定すると、再検証要求が大幅に効率的になります。最終的には、[要求ヘッダー](#request-headers)に記述された[`If-Modified-Since`](#request-headers)または[`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match)がトリガーされます。

適切に構成されたWebサーバーは、受信要求ヘッダーを確認するときに、ブラウザによってすでにHTTPキャッシュに格納されたリソースのバージョンがWebサーバー上の最新バージョンと一致するかどうかを確認できます。一致がある場合、サーバーは[`304 Not Modified`](https://developer.mozilla.org/docs/Web/HTTP/Status/304) HTTP応答で応答できます。これは、「既存のリソースを引き続き使用すること」という意味です。このような応答を送信するときには、転送するデータがほとんどありません。このため、通常は、要求されている実際のリソースのコピーを実際に返送するよりも処理が大幅に高速化します。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e2bN6glWoVbWIcwUF1uh.png", alt="リソースを要求しているクライアントと304ヘッダーで応答しているサーバーの図。", width="474", height="215" %} <figcaption>ブラウザはサーバーに<code>/file</code>を要求し<code>If-None-Match</code>ヘッダーを追加して、サーバー上のファイルの<code>ETag</code>がブラウザの<code>If-None-Match</code>値と一致しない場合にのみ、完全なファイルを返すようにサーバーに命令します。この場合、2つの値が一致したため、サーバーは、ファイルをキャッシュに保存する期間に関する命令 (<code>Cache-Control: max-age=120</code>) と<code>304 Not Modified</code>応答を返します。</figcaption></figure>

## まとめ{: #summary }

HTTPキャッシュを使用すると、不要なネットワーク要求が減るため、読み込みパフォーマンスを向上させるための効果的な方法になります。HTTPキャッシュはすべてのブラウザでサポートされており、設定にそれほど手間はかかりません。

次の`Cache-Control`構成から始めることをお勧めします。

- `Cache-Control: no-cache`: 使用する前に毎回サーバーと再検証すべきリソース。
- `Cache-Control: no-store`: 絶対にキャッシュに保存しないリソース。
- `Cache-Control: max-age=31536000`: バージョン管理リソース。

また、`ETag`または`Last-Modified`ヘッダーは、期限切れのキャッシュリソースをより効率的に再検証するのに役立ちます。

{% Aside 'codelab' %}[HTTP Cache codelab](/codelab-http-cache)を試して、Expressで`Cache-Control`と`ETag`を実際に体験してください。 {% endAside %}

## 詳細{: #learn-more }

`Cache-Control`ヘッダーの使用の応用的な使用方法については、Archibaldの[Caching best practices &amp; max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)を確認してください。

繰り返しアクセスするユーザー向けにキャッシュの使用を最適化する方法については、[Love your cache](/love-your-cache)を参照してください。

## 付録: その他のヒント{: #tips }

時間に余裕がある場合は、次の方法でHTTPキャッシュの使用を最適化できます。

- 一貫性のあるURLを使用します。同じコンテンツを異なるURLで提供する場合、そのコンテンツは複数回取得および保存されます。
- チャーンを最小限に抑えます。リソースの一部 (CSSファイルなど) が頻繁に更新され、ファイルの残りの部分 (ライブラリコードなど) が頻繁に更新されない場合は、頻繁に更新されるコードを別のファイルに分割して、頻繁に更新されるコードには短時間のキャッシュストラテジを使用し、頻繁に変更されないコードには長時間のキャッシュストラテジを使用することを検討してください。
- `Cache-Control`ポリシーである程度の古さが許容される場合は、新しい[`stale-while-revalidate`{/a0ディレクティブを確認してください。](/stale-while-revalidate/)

## 付録: `Cache-Control`フローチャート{: #flowchart }

{% Img src="image/admin/htXr84PI8YR0lhgLPiqZ.png", alt="フローチャート", width="595", height="600" %}

## 付録: `Cache-Control`例{: #examples }

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<code>Cache-Control</code>値</th>
        <th>説明</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>max-age=86400</code></td>
        <td>応答は、ブラウザおよび中間キャッシュによって最大1日間 (60秒 x 60分 x 24時間) キャッシュに保存できます。</td>
      </tr>
      <tr>
        <td><code>private, max-age=600</code></td>
        <td>応答は、ブラウザによって最大10分間 (60秒 x 10分間) キャッシュに保存できます (中間キャッシュはキャッシュに保存できません)。</td>
      </tr>
      <tr>
        <td><code>public, max-age=31536000</code></td>
        <td>応答は、任意のキャッシュに1年間保存できます。</td>
      </tr>
      <tr>
        <td><code>no-store</code></td>
        <td>応答をキャッシュに保存することは許可されておらず、要求ごとに全体を取得する必要があります。</td>
      </tr>
    </tbody>
  </table>
</div>
