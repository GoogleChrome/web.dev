---
layout: post
title: バック/フォワードキャッシュ
subhead: ブラウザーの戻るボタンと進むボタンを使用するときに、ページが瞬時に読み込まれるように最適化します。
description: |2-

  ブラウザーの戻るボタンと進むボタンを使用するときに、ページを瞬時に読み込むように最適化する方法について説明します。
authors:
  - philipwalton
date: 2020-11-10
updated: 2021-11-15
hero: image/admin/Qoeb8x3a11BdGgRzYJbY.png
alt: 戻るボタンと進むボタン
tags:
  - blog
  - performance
  - web-vitals
---

バック/フォワードキャッシュ (またはbfcache) は、ブラウザーの最適化であり、即時の前後移動ナビゲーションを可能にします。これにより、ユーザー (特に低速のネットワークやデバイスを使用しているユーザー) のブラウジングエクスペリエンスが大幅に向上します。

Web開発者として、ユーザーがメリットを享受できるように、すべてのブラウザーで[bfcache用にページを最適化](#optimize-your-pages-for-bfcache)する方法を理解することが重要です。

## ブラウザーの互換性

bfcacheは、デスクトップとモバイルの両方で、[Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching)と[Safari](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/)の両方で長年サポートされてきました。

バージョン86以降、ChromeはAndroidの[クロスサイト](/same-site-same-origin/)ナビゲーションで少数のユーザー向けにbfcacheを有効にしました。以降のリリースでは、追加のサポートが徐々に展開されました。バージョン96以降、bfcacheはデスクトップとモバイルのすべてのChromeユーザーに対して有効になっています。

## bfcacheの基本

bfcacheは、ユーザーが移動しているときにページの完全なスナップショット (JavaScriptヒープを含む) を格納するメモリ内キャッシュです。ページ全体がメモリに保存されているため、ユーザーが戻ることを決めた場合、ブラウザーはすばやく簡単にページを復元できます。

Webサイトにアクセスし、リンクをクリックして別のページに移動したことがありますが、それが目的のページではないことに気づき、[戻る] ボタンをクリックしたことが何度もあることでしょう。その瞬間、bfcacheは前のページの読み込み速度に大きな違いをもたらす可能性があります。

<div class="table-wrapper">
  <table data-alignment="top">
    <tr>
      <td width="30%">
        <strong>bfcacheが有効になってい<em>ない</em></strong>
      </td>
      <td>前のページを読み込む新しい要求が開始され、そのページが繰り返しアクセスできるように<a href="/reliable/#the-options-in-your-caching-toolbox">最適化</a>されているかどうかに応じて、ブラウザーはダウンロードされたばかりのリソースの一部 (またはすべて) を再ダウンロード、再解析、および再実行しなければならない場合があります。</td>
    <tr>
      <td><strong>bfcacheを有効に<em>すると</em></strong></td>
      <td>前のページの読み込みは<em>基本的に瞬時</em>に行われます。これは、ネットワークにまったくアクセスしなくても、ページ全体をメモリから復元できるためです。</td>
    </tr>
  </table>
</div>

ナビゲーションで実現可能な高速化については、この動画でbfcacheの動作を確認してください。

{% YouTube 'cuPsdRckkF0' %}

上の動画では、bfcacheを使用した例は、bfcacheを使用しない例よりもかなり高速です。

bfcacheは、ナビゲーションを高速化するだけでなく、リソースを再度ダウンロードする必要がないため、データ使用量も削減します。

Chromeの使用状況データによると、デスクトップでは10分の1のナビゲーション、モバイルでは5分の1のナビゲーションが前後いずれかの移動です。 bfcacheを有効にすると、ブラウザーはデータ転送と、毎日数十億ものWebページの読み込みに費やす時間をなくすことができます。

### 「キャッシュ」の仕組み

bfcacheで使用される「キャッシュ」は、[HTTPキャッシュ](/http-cache/) (これは繰り返しのナビゲーションを高速化するのにも役立ちます) とは異なります。bfcacheは、メモリ内のページ全体 (JavaScriptヒープを含む) のスナップショットですが、HTTPキャッシュには、以前に行われた要求に対する応答のみが含まれます。ページの読み込みに必要なすべての要求がHTTPキャッシュから実行されることは非常にまれであるため、bfcache復元を使用した繰り返しアクセスは、最も最適化された非bfcacheナビゲーションよりも常に高速です。

ただし、メモリ内にページのスナップショットを作成するには、実行中のコードを保持するための最善の方法に関して、ある程度の複雑さが伴います。たとえば、ページがbfcacheにあるときにタイムアウトに達した場合、`setTimeout()`呼び出しをどのように処理しますか。

この質問に対する答えは、ブラウザーが保留中のタイマーまたは未解決のプロミス (基本的には[JavaScriptタスクキュー](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)のすべての保留中のタスク) の実行を一時停止し、ページがbfcacheから復元されたとき (または復元された場合) にタスクの処理を再開することです。

これはかなりリスクが低い (タイムアウトやプロミスなど) 場合もありますが、非常に混乱したり、予期しない動作につながる可能性があります。たとえば、ブラウザーが[IndexedDBトランザクション](https://developer.mozilla.org/docs/Web/API/IDBTransaction)の一部として必要なタスクを一時停止すると、同じオリジンで開いている他のタブに影響を与える可能性があります (同じIndexedDBデータベースには複数のタブから同時にアクセスできるため)。その結果、通常、ブラウザーは、IndexedDBトランザクションの途中、または他のページに影響を与える可能性のあるAPIを使用しているときには、ページをキャッシュに保存しようとしません。

さまざまなAPIの使用がページのbfcacheの適格性にどのように影響するかについての詳細は、以下の[bfcache用にページを最適化する](#optimize-your-pages-for-bfcache)を参照してください。

### bfcacheを監視するAPI

bfcacheはブラウザーが自動的に行う最適化ですが、開発者が[ページを最適化](#optimize-your-pages-for-bfcache)し、それに応じて[メトリックやパフォーマンス測定](#implications-for-analytics-and-performance-measurement)を調整できるように、bfcacheがいつ発生するかを知ることは依然として重要です。

bfcacheを監視するために使用される主なイベントは、[ページ遷移イベント](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent) (`pageshow`および`pagehide`) です。これらは、bfcacheが存在し、[現在使用されているほとんどすべてのブラウザー](https://caniuse.com/page-transition-events)でサポートされている限り存在します。

新しい[ページライフサイクル](https://developer.chrome.com/blog/page-lifecycle-api/)イベント (`freeze`と`resume`) も、ページがbfcacheに入出力されるとき、およびその他の状況で配信されます。たとえば、CPU使用率を最小限に抑えるために、背景タブがフリーズした場合です。現在、ページライフサイクルイベントはChromiumベースのブラウザでのみサポートされていることに注意してください。

#### ページがbfcacheから復元されるタイミングを監視する

`pageshow`イベントは、ページが最初に読み込まれているとき、およびページがbfcacheから復元されるたびに、`load`イベントの直後に発生します。`pageshow`イベントには[`persisted`](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent/persisted)プロパティがあり、ページがbfcacheから復元された場合は`true`、そうでない場合は`false`になります。`persisted`プロパティを使用して、通常のページの読み込みとbfcacheの復元を区別できます。例えば次のようになります。

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('This page was restored from the bfcache.');
  } else {
    console.log('This page was loaded normally.');
  }
});
```

Page Lifecycle APIをサポートするブラウザーでは、ページがbfcacheから復元されたとき (`pageshow`イベントの直前) に`resume`イベントも発生しますが、ユーザーがフリーズした背景タブにもう一度アクセスしたときにも発生します。フリーズ後にページの状態 (bfcache内のページを含む) を復元する場合は、`resume`イベントを使用できますが、サイトのbfcacheヒット率を測定する場合は、 `pageshow`イベントを使用する必要があります。場合によっては、両方を使用する必要があります。

{% Aside %} bfcache測定のベストプラクティスの詳細については、[パフォーマンスと分析への影響](#how-bfcache-affects-analytics-and-performance-measurement)を参照してください。 {% endAside %}

#### ページがbfcacheになるときを監視する

`pagehide`イベントは`pageshow`イベントの反対です。`pageshow`イベントは、ページが正常に読み込まれるか、bfcacheから復元されたときに発生します。`pagehide`イベントは、ページが正常に読み込み解除されたとき、またはブラウザーがページをbfcacheに入れようとしたときに発生します。

`pagehide`イベントにも`persisted`プロパティがあり、 `false`場合は、ページがbfcacheに入ろうとしていないことを確信できます。ただし、 `persisted`プロパティが`true` 、ページがキャッシュされることは保証されません。*これは、ブラウザがページをキャッシュしようと*していることを意味しますが、キャッシュを不可能にする要因がある可能性があります。

```js
window.addEventListener('pagehide', (event) => {
  if (event.persisted === true) {
    console.log('This page *might* be entering the bfcache.');
  } else {
    console.log('This page will unload normally and be discarded.');
  }
});
```

同様に、 `freeze`イベントは`pagehide`ます（イベントの`persisted`プロパティが`true` ）が、これもブラウザ*が*ページをキャッシュすることを意図していることを意味します。以下に説明するいくつかの理由により、それでも破棄しなければならない場合があります。

## bfcache用にページを最適化する

すべてのページがbfcacheに保存されるわけではなく、ページがそこに保存されたとしても、無期限にそこにとどまるわけではありません。キャッシュヒット率を最大化するには、開発者がページをbfcacheに適格 (および不適格) にする理由を理解することが重要です。

次のセクションでは、ブラウザーがページをキャッシュに保存できるようにするためのベストプラクティスの概要を説明します。

### `unload`イベントは絶対に使用しない

すべてのブラウザーでbfcacheを最適化する最も重要な方法は、`unload`イベントを使用しないことです。

`unload` `unload`イベントが発生した後はページが存在し続けないという（合理的な）仮定の下で動作するため、ブラウザにとって問題があります。このプレゼント、これらのページの多くは*また、*ことを前提に構築されたので、挑戦`unload`イベントはもはや真でユーザーが離れてナビゲートされるたびに、火災う（と[長い時間のために、真されていません](https://developer.chrome.com/blog/page-lifecycle-api/#the-unload-event)）。

そのため、ブラウザーはジレンマに直面しており、ユーザーエクスペリエンスを向上させることができるものから選択する必要がありますが、ページを壊すリスクもあります。

`unload`リスナーを追加する場合、ページをbfcacheの対象外にすることを選択しました。これにより、リスクは低くなりますが*、多く*のページが失格になります。 `unload`イベントリスナーを使用して一部のページをキャッシュしようとしますが、破損の可能性を減らすため`unload`イベントを実行しないため、イベントの信頼性が非常に低くなります。

`unload`イベントを使用する代わりに`pagehide`イベントを使用してください。 `pagehide` `unload`イベントが現在発生しているすべての場合に発生し、ページがbfcacheに配置されたとき*にも発生します。*

実際、[Lighthouse v6.2.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.2.0)には[`no-unload-listeners audit`](https://github.com/GoogleChrome/lighthouse/pull/11085)が追加されており、ページのJavaScript (サードパーティライブラリを含む) が`unload`イベントリスナーを追加する場合には開発者に警告します。

{% Aside 'warning' %}絶対に`unload`イベントリスナーを追加しないでください。代わりに、`pagehide`イベントを使用してください。`unload`イベントリスナーを追加すると、Firefoxでのサイトの速度が低下し、ほとんどの場合ChromeとSafariではコードが実行されなくなります。 {% endAside %}

#### 条件付きで`beforeunload`リスナーのみを追加する

`beforeunload`イベントによって、ページがChromeまたはSafariのbfcacheの対象外になることはありませんが、Firefoxでは対象外になるため、どうしても必要な場合を除いて、このイベントの使用は避けてください。

ただし、`unload`イベントとは異なり、`beforeunload`を使用する合理的な理由があります。たとえば、未保存の変更があり、ページから移動すると変更が失われることをユーザーに警告するときです。ユーザーに未保存の変更があるときにのみ`beforeunload`リスナーを追加し、未保存の変更が保存された直後に削除することをお勧めします。

{% Compare 'worse' %}

```js
window.addEventListener('beforeunload', (event) => {
  if (pageHasUnsavedChanges()) {
    event.preventDefault();
    return event.returnValue = 'Are you sure you want to exit?';
  }
});
```

{% CompareCaption %}上記のコードは、`beforeunload`リスナーを無条件に追加します。 {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```js
function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};

// ページに未保存の変更があるときにコールバックを呼び出す関数。
onPageHasUnsavedChanges(() => {
  window.addEventListener('beforeunload', beforeUnloadListener);
});

// ページの未保存の変更が解決されたときにコールバックを呼び出す関数。
onAllChangesSaved(() => {
  window.removeEventListener('beforeunload', beforeUnloadListener);
});
```

{% CompareCaption %}上記のコードは、必要なときに`beforeunload`リスナーを追加します (不要なときは削除)。 {% endCompareCaption %} {% endCompare %}

### window.opener参照を避ける

一部のブラウザー (Chromiumベースのブラウザーを含む) では、[`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener) を使用せずに、[`window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open) を使用するか、([バージョン88より前のChromiumベースのブラウザーで](https://crbug.com/898942)) [`target=_blank`](https://developer.mozilla.org/docs/Web/HTML/Element/a#target)へのリンクを使用してページが開かれた場合、元のページが開かれたページのウィンドウオブジェクトを参照します。

[セキュリティ上のリスク](https://mathiasbynens.github.io/rel-noopener/)のほかに、非ヌルのcode1}[window.opener](https://developer.mozilla.org/docs/Web/API/Window/opener) 参照があるページは、それにアクセスしようとしているページを破損させる可能性があるため、安全にbfcacheに格納できません。

したがって、可能な限り、`rel="noopener"`を使用して`window.opener`参照を作成しないようにすることをお勧めします。サイトでウィンドウを開いて、[`window.postMessage()`](https://developer.mozilla.org/docs/Web/API/Window/postMessage) で制御するか、ウィンドウオブジェクトを直接参照する必要がある場合は、開いているウィンドウも元のウィンドウもbfcache.の対象になりません。

### ユーザーが移動する前に必ず開いている接続を閉じる

上記のように、ページがbfcacheに格納されると、スケジュールされたすべてのJavaScriptタスクが一時停止され、ページがキャッシュから取り出されると再開されます。

これらのスケジュールされたJavaScriptタスクがDOM API (または現在のページのみに分離された他のAPI) にのみアクセスしている場合、ページがユーザーに表示されていないときにこれらのタスクを一時停止しても、問題は発生しません。

ただし、これらのタスクが同じオリジンの他のページからもアクセスできるAPIに接続されている場合 (たとえば、IndexedDB、Web Locks、WebSocketsなど) は、これらのタスクを一時停止すると他のタブのコードが実行されなくなる可能性があるため、これが問題になる可能性があります。

その結果、一部のブラウザーでは、次のシナリオのときに、ページをbfcacheに配置しようとしません。

- [IndexedDB接続](https://developer.mozilla.org/docs/Web/API/IDBOpenDBRequest)が開いているページ
- 実行中の[fetch()](https://developer.mozilla.org/docs/Web/API/Fetch_API)または[XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)があるページ
- [WebSocket](https://developer.mozilla.org/docs/Web/API/WebSocket)または[WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API)接続が開いているページ

ページでこれらのAPIのいずれかを使用している場合は、`pagehide`または`freeze`イベント中に必ず接続を閉じて、オブザーバーを削除またはた切断することをお勧めします。これにより、ブラウザーは、開いている他のタブに影響を与えるリスクなく、ページを安全にキャッシュに保存できます。

次に、ページがbfcacheから復元された場合、それらのAPIを再度開くか再接続できます (`pageshow`または`resume`イベント)。

次の例では、`pagehide`イベントリスナーで開いている接続を閉じることにより、IndexedDBを使用するときに、ページがbfcacheの対象であることを確認する方法を示しています。

```js
let dbPromise;
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('my-db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('keyval');
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  return dbPromise;
}

// ユーザーが移動するときにデータベースへの接続を閉じる。
window.addEventListener('pagehide', () => {
  if (dbPromise) {
    dbPromise.then(db => db.close());
    dbPromise = null;
  }
});

// ページがbfcacheから読み込まれるか復元されるときに接続を開く。
window.addEventListener('pageshow', () => openDB());
```

### bfcacheの復元後に古いデータまたは機密データを更新する

サイトがユーザー状態 (特に機密性の高いユーザー情報) を保持している場合は、ページがbfcacheから復元された後、そのデータを更新またはクリアする必要があります。

たとえば、ユーザーがチェックアウトページに移動してからショッピングカートを更新した場合、古いページがbfcacheから復元された場合、戻る操作によって古い情報が表示される可能性があります。

もう1つのより重要な例は、ユーザーが公共のコンピューターでサイトからサインアウトし、次のユーザーが[戻る]ボタンをクリックした場合です。これにより、ユーザーがログアウトしたときにクリアされたと想定した個人データが公開される可能性があります。

この状況を避けるために、`event.persisted`が`true`の場合、`pageshow`イベントの後に常にページを更新することをお勧めします。

`pageshow`イベントでサイト固有のCookieが存在するかどうかを確認し、Cookieが見つからない場合は再読み込みします。

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !document.cookie.match(/my-cookie/)) {
    //ユーザーがログアウトした場合に強制的に再読み込み。
    location.reload();
  }
});
```

### ページがキャッシュ可能であることを確認するためのテスト

Chrome DevToolsは、ページをテストしてbfcache用に最適化されていることを確認し、ページの適格性を妨げる可能性のある問題を特定するのに役立ちます。

特定のページをテストするには、Chromeでそのページに移動し、DevToolsで**[アプリケーション]** > **[バックフォワードキャッシュ]** に移動します。次に、**[テストの実行**] ボタンをクリックすると、DevToolsは前後に移動して、ページをbfcacheから復元できるかどうかを判断します。

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/QafTzULUNflaSh77zBgT.png", alt="DevToolsのバックフォワードキャッシュパネル", width="800", height="313" %}

{% Aside %} 現在、DevToolsのバック/フォワードキャッシュ機能は活発に開発されています。開発者は、Chrome Canaryでページをテストして、最新バージョンのDevToolsを実行し、最新のbfcacheの推奨事項が適用されていることを確認するように強くお勧めします。 {% endAside %}

成功すると、パネルに「バックフォワードキャッシュから復元されました」と表示されます。

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vPwN0z95ZBTiwZIpdZT4.png", alt="ページがbfcacheから正常に復元されたことを報告するDevTools", width="800", height="313" %}

失敗した場合、パネルにはページが復元されなかったことと、理由が表示します。開発者とが対処できる理由である場合は、その点についても表示されます。

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/ji3ew4DoP6joKdJvtGwa.png", alt="bfcacheからページを復元できなかったことを報告'するDevTools'", width="800", height="313" %}

上のスクリーンショットでは、`unload`イベントリスナーの使用によって、ページがbfcacheの[対象にならなくなっています](/bfcache/#never-use-the-unload-event)。`unload`から`pagehide`を使用するように切り替えることで、この問題を修正できます。

{% Compare 'worse' %}

```js
window.addEventListener('unload', ...);
```

{% endCompare %}

{% Compare 'better' %}

```js
window.addEventListener('pagehide', ...);
```

{% endCompare %}

## bfcacheが分析とパフォーマンス測定にどのように影響するか

分析ツールを使用してサイトへのアクセスを追跡すると、Chromeはより多くのユーザーに対してbfcacheを有効し続けるため、報告されるページビューの総数が減少することに気付くはずです。

実際、人気のある分析ライブラリのほとんどはbfcacheの復元を新しいページビューとして追跡しないため、bfcacheを実装している他のブラウザからのページビューを*すでに*過少報告している可能性があります。

Chromeでbfcacheが有効であることでページビュー数を減らしたくない場合は、`pageshow`プロパティを待機し`persisted`プロパティを確認することで、bfcacheの復元をページビューとして報告できます (推奨)。

次の例は、Google Analyticsでこれを行う方法を示しています。ロジックは他の分析ツールでも同様であるはずです。

```js
// ページが最初に読み込まれるときにページビューを送信。
gtag('event', 'page_view');

window.addEventListener('pageshow', (event) => {
  if (event.persisted === true) {
    // Send another pageview if the page is restored from bfcache.
    gtag('event', 'page_view');
  }
});
```

### パフォーマンス測定

bfcacheは、[フィールド](/user-centric-performance-metrics/#in-the-field)で収集されたパフォーマンスメトリック、特にページの読み込み時間を測定するメトリックにも悪影響を与える可能性があります。

bfcacheナビゲーションは、新しいページの読み込みを開始するのではなく、既存のページを復元します。このため、bfcacheを有効にすると、収集されるページの読み込みの総数が減少します。ただし、重要なのは、bfcacheの復元で置換されているページの読み込みは、データセット内で最も高速なページの読み込みの一部であった可能性が高いということです。これは、前後のナビゲーションは、定義上、繰り返しアクセスであり、繰り返しページの読み込みは、最初の訪問者からのページの読み込みよりも一般的に高速であるためです (前述の[HTTPキャッシュ](/http-cache/)のため)。

その結果、データセット内のページの読み込みが減り、ユーザーが体験するパフォーマンスがおそらく向上したにもかかわらず、配信が遅くなる可能性があります。

この問題に対処する方法はいくつかあります。1つは、すべてのページ読み込みメトリックにそれぞれの[ナビゲーションタイプ](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types) (`navigate`、 `reload`、 `back_forward`、または`prerender`) 注釈を付けることです。これにより、全体的な配信がマイナスに偏っている場合でも、これらのナビゲーションタイプ内でパフォーマンスを監視し続けることができます。このアプローチは、[Time to First Byte (TTFB)](/ttfb/)などの非ユーザー中心のページ読み込みメトリックで推奨されます。

[Core Web Vitals](/vitals/)のようなユーザー中心のメトリックの場合、より適切なオプションは、ユーザーエクスペリエンスをより正確に表す値を報告することです。

{% Aside 'caution' %} [Navigation Timing API](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types)の`back_forward`ナビゲーションタイプをbfcacheの復元と混同しないでください。Navigation Timing APIはページの読み込みにのみ注釈を付けますが、bfcacheの復元は前のナビゲーションから読み込まれたページを再利用します。 {% endAside %}

### Core Web Vitalsへの影響

[Core Web Vitals](/vitals/)はさまざまな次元 (読み込み速度、双方向性、視覚的安定性) でWebページのユーザーエクスペリエンスを測定します。ユーザーは、従来のページ読み込みよりも高速なナビゲーションとしてbfcacheの復元を体験するため、Core WebVitalsのメトリックがこれを反映することが重要です。 結局のところ、ユーザーにとって気になるのは、bfcacheが有効になっているかどうかではなく、ナビゲーションが高速であることだけです。

Core Web Vitalsメトリックを収集して報告する[Chrome User Experience Report](https://developer.chrome.com/docs/crux/)などのツールは、bfcacheの復元をデータセット内の個別のページアクセスとして扱います。

また、bfcacheの復元後にこれらのメトリックを測定するための専用のWebパフォーマンスAPIは (まだ) ありませんが、既存のWeb APIを使用してそれらの値を概算できます。

- [Largest Contentful Paint (LCP)](/lcp/)では、`pageshow`イベントのタイムスタンプと次にペイントされたフレームのタイムスタンプの間の差分を使用できます (フレーム内のすべての要素が同時にペイントされるため)。 bfcache復元の場合、LCPとFCPは同じになることに注意してください。
- [First Input Delay (FID)](/fid/) では、`pageshow`イベントリスナー ([FID polyfill](https://github.com/GoogleChromeLabs/first-input-delay)で使用したのと同じもの) を再度追加し、bfcache復元後も最初の入力の遅延としてFIDを報告できます。
- [Cumulative Layout Shift (CLS)](/cls/) の場合、既存のパフォーマンスオブザーバーを引き続き使用できます。現在のCLS値を0にリセットするだけです。

bfcacheが各メトリックに与える影響の詳細については、個々のCore Web Vitalsの[メトリックガイドページ](/vitals/#core-web-vitals)を参照してください。また、これらのメトリックのbfcacheバージョンをコードに実装する方法の具体例については、[web-vitals JSライブラリに追加するPR](https://github.com/GoogleChrome/web-vitals/pull/87)を参照してください。

{% Aside %} `v1`以降、[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScriptライブラリは、報告するメトリックで[bfcacheの復元をサポート](https://github.com/GoogleChrome/web-vitals/pull/87)します。`v1`以降を使用している開発者は、コードを更新する必要はありません。 {% endAside %}

## 追加リソース

- [Firefox Caching](https://developer.mozilla.org/Firefox/Releases/1.5/Using_Firefox_1.5_caching) *(Firefoxのbfcache)*
- [Page Cache](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/) *(Safariのbfcache)*
- [Back/forward cache: web exposed behavior](https://docs.google.com/document/d/1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc/edit?usp=sharing) *(ブラウザー間のbfcacheの違い)*
- [bfcache tester](https://back-forward-cache-tester.glitch.me/?persistent_logs=1) *(異なるAPIとイベントがブラウザーのbfcacheに影響する方法をテスト)*
