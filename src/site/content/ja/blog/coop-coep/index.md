---
layout: post
title: COOPとCOEPの利用によりあなたのウェブサイトを「クロスオリジン分離」にする
subhead: COOPとCOEPの利用により、クロスオリジンの分離環境を設定し、`SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory（）、精度の高い高解像度タイマー等の強力な機能を有効にします。
description: 多少のWebAPIは、Spectreのようなサイドチャネル攻撃のリスクを高めます。そのリスクを軽減するために、ブラウザはオプトインベースの分離環境を提供します。COOPとCOEPの利用により、クロスオリジンの分離環境を設定し、`SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory（）、精度の高い高解像度タイマー等の強力な機能を有効にします。
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: ポップアップ、iframe、および画像を含むWebサイトを閲覧している人のイラスト。
date: 2020-04-13
updated: 2021-11-26
tags:
  - blog
  - security
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281"
feedback:
  - api
---

{% Aside 'caution' %}

`SharedArrayBuffer`は、Chrome 92以降のクロスオリジン分離から有効になります。詳細については[、Android Chrome88およびDesktopChrome92のSharedArrayBufferアップデートを](https://developer.chrome.com/blog/enabling-shared-array-buffer/)ご覧ください。

{% endAside %}

**更新**

- **2021年8月5日**：JSセルフプロファイリングAPIは、クロスオリジン分離を求めるAPIの1つとして言及されるが、 [最新の方向転換を](https://github.com/shhnjk/shhnjk.github.io/tree/main/investigations/js-self-profiling#conclusion)反映したので削除されました。
- **2021年5月6日**：フィードバックと報告された問題に基づき、ChromeM92で制限されるクロスオリジン分離がないサイトでの` SharedArrayBuffer `の使用のタイムラインを調整することを決めました。
- **2021年4月16日**[：新規COEPクレデンシャルレスモード](https://github.com/mikewest/credentiallessness/)と[COOP同一生成元許可ポップアップが、](https://github.com/whatwg/html/issues/6364)クロスオリジン分離のリラックス状態になることについてのメモを追加しました。
- **2021年3月5日**Chrome 89で完全に有効になった`SharedArrayBuffer` 、`performance.measureUserAgentSpecificMemory()` 、およびデバッグ機能の制限を削除しました。今後の機能であるより高精度の`performance.now()`と`performance.timeOrigin`を追加しました。
- **2021年2月19日**`allow="cross-origin-isolated"`機能ポリシーとDevToolsのデバッグ機能に関するメモを追加しました。
- **2020年10月15日**： `self.crossOriginIsolated`はChrome 87から動けます。これを反映して、 `self.crossOriginIsolated`が`true` になったら、`document.domain`は不変となります。 `performance.measureUserAgentSpecificMemory()`はオリジン トライアルを終了し、Chrome89のデフォルトで有効にさせました。AndroidChromeの共有アレイバッファはChrome88から利用できるようになります。

{% YouTube 'XLNJYhjA-0c' %}

多少のWebAPIは、Spectreのようなサイドチャネル攻撃のリスクを高めます。そのリスクを軽減するために、ブラウザーはクロスオリジン分離と呼ばれるオプトインベースの分離環境を提供します。クロスオリジンの分離状態では、Webページは次のような特権機能を使用できます。

<div>
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>説明</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer">
          <code>SharedArrayBuffer</code></a>
        </td>
        <td>WebAssemblyスレッドに必要です。これはAndroidChrome 88から利用できます。デスクトップバージョンは現在、<a href="https://www.chromium.org/Home/chromium-security/site-isolation">サイト分離</a>のサポートにより、デフォルトで有効になっているが、クロスオリジン分離状態が要求され、 <a href="https://developer.chrome.com/blog/enabling-shared-array-buffer/">Chrome92でデフォルトで無効にされます</a>。</td>
      </tr>
      <tr>
        <td>
          <a href="/monitor-total-page-memory-usage/">
          <code>performance.measureUserAgentSpecificMemory()</code></a>
        </td>
        <td>Chrome89から動けます。</td>
      </tr>
      <tr>
        <td><a href="https://crbug.com/1180178"><code>performance.now()</code> 、 <code>performance.timeOrigin</code></a></td>
        <td>現在、解像度が100マイクロ秒以上で、多くのブラウザで利用できます。クロスオリジンアイソレーションでは、解像度が5マイクロ秒以上になる可能性があります。</td>
      </tr>
    </tbody>
    <caption>クロスオリジン分離状態で利用できる機能。</caption>
  </table>
</div>

クロスオリジンの分離状態は、 `document.domain`の変更も防ぎます。（ `document.domain`を変更できると、同じサイトのドキュメント間の通信が可能になり、同一生成元ポリシーの抜け穴と見なされます。）

クロスオリジンの分離状態にオプトインするには、メインドキュメントで次のHTTP headers を送信する必要があります。

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

これらのheadersは、クロスオリジンドキュメントによるロードを選択していないリソースまたはiframeのロードを停止し、クロスオリジンウィンドウがドキュメントと直接対話するのを防ぐようにブラウザーに指示します。これは、クロスオリジンでロードされるリソースにはオプトインを求めるとも意味します。

[`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)を調べることで、Webページがクロスオリジンの分離状態にあるかどうかを判断できます。

この記事では、これらの新しいheadersの使用方法を説明します。[フォローアップ記事](/why-coop-coep)では、より多くのバックグラウンドとコンテキストを提供します。

{% Aside %}

`SharedArrayBuffer` 、WebAssemblyスレッド、 `performance.measureUserAgentSpecificMemory()`またはブラウザープラットフォーム経由でより堅牢な方法でより正確な高解像度タイマーを使用できるようにWebサイトを準備したい人を対象としています。

{% endAside %}

{% Aside 'key-term' %}この記事では、似たような用語を数多く使用しています。より明確にするには、最初からそれらを定義しましょう。

- [COEP：クロスオリジンエンベッダーポリシー](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP：クロスオリジンオープナーポリシー](https://github.com/whatwg/html/pull/5334/files)
- [CORP：クロスオリジンリソースポリシー](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS：クロスオリジンリソースシェアリング](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB：クロスオリジンリードブロッキング](https://www.chromium.org/Home/chromium-security/corb-for-developers){% endAside %}

## COOPとCOEPを展開することにより、Webサイトのクロスオリジンを分離します

{% Aside %}[クロスオリジン分離を有効にするについての説明](/cross-origin-isolation-guide/)で、クロスオリジン分離を有効にする実用的な手順を学びます。 {% endAside %}

### COOPとCOEPを統合する

#### 1. 最上位のドキュメントで`Cross-Origin-Opener-Policy: same-origin`headersを設定します

最上位のドキュメントで`COOP: same-origin`を有効にすると、同一生成元のウィンドウ、及びドキュメントから開いたウィンドウは、同じCOOP設定で同じ生成元にない限り、個別の閲覧コンテキスト組を得ます。したがって、開いているウィンドウには分離が適用され、両方のウィンドウ間の相互通信は無効になります。

{% Aside 'caution' %}

これにより、OAuthや支払いなどのクロスオリジンウィンドウの相互作用を求める統合が破られます。この状況を回避するために`Cross-Origin-Opener-Policy: same-origin-allow-popups`へのクロスオリジン分離を有効にする[条件の緩和を検討しています](https://github.com/whatwg/html/issues/6364)。このようにして、それ自体で開いたウィンドウとの通信が可能になります。

クロスオリジン分離を有効にしたいが、この問題によって阻止されている場合は[、オリジントライアルに登録し](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)、新しい条件が効くまで待つことをお勧めします。この問題が安全に解決されるまで、オリジントライアルを終了する予定はありません。

{% endAside %}

閲覧コンテキストグループは、同じコンテキストを共有するタブ、ウィンドウ、またはiframeのグループです。 例えば、ウェブサイト(`https://a.example`)はポップアップウィンドウ(`https://b.example`)を開くと、オープナーウィンドウとポップアップウィンドウは同じ閲覧コンテキストをを共有し、`window.opener`などのDOM APIを介して相互にアクセスします。

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="閲覧コンテキストグループ", width="470", height="469" %}

[DevToolsで](#devtools-coop)ウィンドウオープナーとそのopeneeが別々の閲覧コンテキストグループに属しているかどうかをチェックすることができます。

{% Aside 'codelab' %}[様々のCOOPパラメータの影響をご確認ください](https://cross-origin-isolation.glitch.me/coop). {% endAside %}

#### 2.リソースのCORPまたはCORSが有効になっていることを確認すること

ページ内のすべてのリソースにはCORP又はCORS HTTP headersがロードされていることを確認してください。このステップは[、COEPを有効にするステップ4に](#enable-coep)必要です。

次はリソースの性質に応じて、実施する必要となることです。

- リソースを**同じオリジンのみから**ロードしたい場合は、 `Cross-Origin-Resource-Policy: same-origin`headerをご設定ください。
- リソースを**同じサイトのみから、かつ、オリジンを介して**ロードしたい場合は、 `Cross-Origin-Resource-Policy: same-site`headerをご設定ください。
- リソースを**制御しクロスオリジンから**ロードをする場合は、可能であれば`Cross-Origin-Resource-Policy: cross-origin`headerをご設定ください。
- 制御できないクロスオリジンリソースの場合：
    - リソースがCORSで提供される場合は、読み込み中のHTMLタグで`crossorigin`属性をご使用ください。 （たとえば、 `<img src="***" crossorigin>`.)
    - CORSまたはCORPのいずれかをサポートする必要がある場合は、リソースの所有者に連絡してください。
- iframeの場合、CORPとCOEP headerを次のように使用します。Cross `Cross-Origin-Resource-Policy: same-origin` （またはコンテキストに応じて`same-site` 、 `cross-origin`)と `Cross-Origin-Embedder-Policy: require-corp` 。

{% Aside %}
`<iframe>`タグ `allow="cross-origin-isolated"`機能ポリシーを適用し、このドキュメントで説明されているのと同じ条件を満たすことで、iframe内に埋め込まれたドキュメントでクロスオリジン分離を有効にできます。親フレームと子フレームを含むドキュメントのチェーン全体も、クロスオリジンで分離される必要があることに注意してください。 {% endAside %}

{% Aside 'key-term' %}"同一サイト"と"同一生成元"の違いを理解することが重要です。[同一サイトと同一生成元の理解](/same-site-same-origin)で相違についてご参照ください。 {% endAside %}

#### 3. COEP Report-Only HTTP headerを使用して、埋め込まれたリソースを評価すること

COEPを完全に有効にする前に、 `Cross-Origin-Embedder-Policy-Report-Only`headerを使用してドライランを実行し、ポリシーが実際に機能するかどうかを確認できます。埋め込まれたコンテンツをブロックせずにレポートを受け 取ります。これをすべてのドキュメントに再帰的に適用します。 Report-Only HTTP headerの詳細情報については、[Observe issues using the Reporting API](#observe-issues-using-the-reporting-api)をご参照ください。

#### 4. COEPを有効にする {: #enable-coep }

全てが機能し、すべてのリソースを正常にロードできることを確認したら、`Cross-Origin-Embedder-Policy: require-corp`HTTP headerを、iframeを介して埋め込まれているドキュメントを含むすべてのドキュメントに適用します。

{% Aside 'codelab' %}[さまざまなCOEP / CORPパラメータの影響を確認してください](https://cross-origin-isolation.glitch.me/coep)。 {% endAside %}

{% Aside %} [Squoosh](https://squoosh.app)（画像最適化PWA） [は、COOP / COEP](https://github.com/GoogleChromeLabs/squoosh/pull/829/files#diff-316f969413f2d9a065fcc08c7a5589c088dd1e21deebadccfc5a4372ac5e0cbbR22-R23)を使用して、Android ChromeもWasmスレッド（とShared Array Buffer）にアクセスできるようになりました。 {% endAside %}

{% Aside 'caution' %}

クロスオリジン分離ではすべてのサブリソースが明示的にオプトインする必要があるため、`Cross-Origin-Resource-Policy`を大規模にデプロイする方法をỉ調べてきました。そして、反対方向に進むアイデアを思いつきました。それは[新しいCOEPの「クレデンシャル無し」モード](https://github.com/mikewest/credentiallessness/)で、すべてのクレデンシャルを削除することにより、CORP header無しでリソースをロードできることです。機能の仕組みについての詳細を理解しているが、`Cross-Origin-Resource-Policy` headerを送信していることを確認する負担が軽減されることを期待しております。

クロスオリジン分離を有効にしたいが、これによってブロックされている場合は[オリジントライアルに登録し](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)、新しいモードが効くまで待つことをお勧めします。新しいモードが利用可能になるまで、オリジントライアルを終了する予定はありません。

{% endAside %}

### `self.crossOriginIsolated`と共に分離が成功したかどうかを判断します

`self.crossOriginIsolated`プロパティは、Webページがクロスオリジン分離状態になり、すべてのリソースとウィンドウが同じ閲覧コンテキストグループ内で分離されている場合に`true`を返します。このAPIを使用して、閲覧コンテキストグループを正常に分離し、 `performance.measureUserAgentSpecificMemory()`などの強力な機能にアクセスできたかどうかを判断できます。

### ChromeDevToolsで問題をデバッグする

{% YouTube 'D5DLVo_TlEA' %}

画像などの画面に表示されるリソースの場合は、リクエストがブロックされ、ページに画像がないと示されるため、COEPの問題を簡単に検出できます。ただし、必ずしも視覚的な影響を与えないスクリプトやスタイルなどのリソースの場合、COEPの問題が見過ごされる恐れがあります。それらについては、DevToolsネットワークパネルをご利用ください。COEPに関する問題が発生する場合は、**ステータス**列にある`(blocked:NotSameOriginAfterDefaultedToSameOriginByCoep)`をご覧ください。

<figure>{% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="ネットワークパネルのステータス例のCOEP問題.", width="800", height="444" %}</figure>

次に、エントリをクリックしたら、詳細をご覧ください。

<figure>{% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="ネットワークパネルにあるネットワークリソースをクリックすると、COEPに関する問題の詳細がheaderタブに表示されます.", width="800", height="241" %}</figure>

**アプリケーション**パネルでiframeとポップアップウィンドウの状態を確認することもできます。左側の「Frames」セクションに移動し、「Top」を開き、リソース構造の内訳をご確認ください。

<span id="devtools-coep-iframe">`SharedArrayBuffer`の可用性などのiframeの状態を確認できます。</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframeのインスペクター", width="800", height="480" %}</figure>

<span id="devtools-coop">クロスオリジンが分離されているかどうかなのポップアップウィンドウの状態を確認することもできます。</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Chrome DevToolsポップアップウィンドウズのインスペクター", width="800", height="480" %}</figure>

### ReportingAPIで問題を観察する

[Reporting API](/reporting-api)は、種々な問題を検出できるメカニズムの一つです。 COEPがリソースのロードをブロックするか、COOPがポップアップウィンドウを分離するたびにレポートを送信するようにユーザーのブラウザーに指示するという仕組みでReportingAPIを構成できます。Chromeは、バージョン69以降から、COEPやCOOPなどのさまざまな用途でReportingAPIをサポートしています。

{% Aside %}

`Report-To` headerでReportingAPIをすでに利用していますか？`Report-To`を`Reporting-Endpoints`に置き換える新しいバージョンのReportingAPIに移行しています。新しいバージョンへの移行を検討してください。詳細については、 [Migrate to Reporting APIv1](/reporting-api-migration)をご覧ください。

{% endAside %}

Reporting APIを構成し、レポートを受信するようにサーバーを設定する方法については、[Using the Reporting API](/reporting-api/#using-the-reporting-api)に移動して、ご参考ください。

#### COEPレポートの例

クロスオリジンリソースがブロックされている場合の[COEPレポート](https://html.spec.whatwg.org/multipage/origin.html#coep-report-type)ペイロードの例は次のようになります。

```json
[{
  "age": 25101,
  "body": {
    "blocked-url": "https://third-party-test.glitch.me/check.svg?",
    "blockedURL": "https://third-party-test.glitch.me/check.svg?",
    "destination": "image",
    "disposition": "enforce",
    "type": "corp"
  },
  "type": "coep",
  "url": "https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %} `blocked-url`は後方互換性だけのために存在し、[最終的には削除](https://github.com/whatwg/html/pull/5848)されます。 {% endAside %}

#### COOPレポートの例

ポップアップウィンドウが開かれ、分離されたときの[COOPレポート](https://html.spec.whatwg.org/multipage/origin.html#reporting)ペイロードの例は、次のようになります。

```json
[{
  "age": 7,
  "body": {
    "disposition": "enforce",
    "effectivePolicy": "same-origin",
    "nextResponseURL": "https://third-party-test.glitch.me/popup?report-only&coop=same-origin&",
    "type": "navigation-from-response"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

異なる閲覧コンテキストグループが相互にアクセスすると（「report-only」モードのみ）、COOPもレポートを送信します。例えば、 `postMessage()`が試行されたとき、レポートは、次のようになります。

```json
[{
  "age": 51785,
  "body": {
    "columnNumber": 18,
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "lineNumber": 83,
    "property": "postMessage",
    "sourceFile": "https://cross-origin-isolation.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
},
{
  "age": 51785,
  "body": {
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "property": "postMessage",
    "type": "access-to-coop-page-from-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

## 結論

Webページを特別なクロスオリジン分離状態にオプトインするために、COOPとCOEP HTTP headerの組み合わせを使用します。 `self.crossOriginIsolated`を調べて、Webページがクロスオリジンの分離状態にあるかどうかを判断できます。

新しい機能がこのクロスオリジンの分離された状態に有効になり、COOPとCOEPに関するDevToolsがさらに改善されるので、本投稿は更新され続けます。

## 資力

- [強力な機能に「クロスオリジン分離」が必要な理由](/why-coop-coep/)
- [クロスオリジン分離を有効にするためのガイド](/cross-origin-isolation-guide/)
- [Android Chrome88およびDesktopChrome92でのSharedArrayBufferの更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
- [`measureUserAgentSpecificMemory()`使用してWebページの合計メモリ使用量を監視します](/monitor-total-page-memory-usage/)
