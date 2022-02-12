---
layout: post
title: measureUserAgentSpecificMemory() を使用してWebページの合計メモリ使用量を監視する
subhead: リグレッションを検出するために本番環境でWebページのメモリ使用量を測定する方法について説明します。
description: リグレッションを検出するために本番環境でWebページのメモリ使用量を測定する方法について説明します。
updated: 2020-10-19
date: 2020-04-13
authors:
  - ulan
hero: image/admin/Ne2U4cUtHG6bJ0YeIkt5.jpg
alt: |2

  緑のRAMスティック。 UnsplashのHarrisonBroadbentによる写真。
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113"
tags:
  - blog
  - memory
  - javascript
feedback:
  - api
---

{% Aside 'caution' %}

**更新**

**2021年4月23日:** ステータスを更新し、プロセス外のiframeに関するメモを使用してAPIの範囲を明確にしました。

**2021年1月20日:** `performance.measureMemory`は`performance.measureUserAgentSpecificMemory`という名称に変更され、Chrome 89では[クロスオリジン分離](/coop-coep)されたWebページでデフォルトで有効にされています。結果の形式も、Origin Trialバージョンと比較してわずかに[変更](https://github.com/WICG/performance-measure-memory/blob/master/ORIGIN_TRIAL.md#result-differences)されています。 {% endAside %}

ブラウザーはWebページのメモリを自動的に管理します。 Webページがオブジェクトを作成するときはいつでも、ブラウザーはオブジェクトを格納するために「内部」でメモリのチャンクを割り当てます。メモリは有限のリソースであるため、ブラウザーはガベージコレクションを実行して、オブジェクトが不要になるときを検出し、基になるメモリチャンクを解放します。ただし、検出は完全ではなく、完全な検出は不可能な作業であること[が証明されました](https://en.wikipedia.org/wiki/Halting_problem)。したがって、ブラウザーは「オブジェクトが必要である」という概念を「オブジェクトが到達可能である」という概念に近似します。Webページがその変数および他の到達可能なオブジェクトのフィールドを使用してオブジェクトに到達できない場合、ブラウザーはオブジェクトを安全に再利用できます。次の例に示すように、これら2つの概念の違いにより、メモリリークが発生します。

```javascript
const object = { a: new Array(1000), b: new Array(2000) };
setInterval(() => console.log(object.a), 1000);
```

ここでは、大きい配列`b`は不要になりましたが、コールバックの`object.b`経由でして到達可能であるため、ブラウザーはそれを再利用しません。したがって、より大きな配列のメモリがリークします。

Webではメモリリークが[蔓延しています](https://docs.google.com/presentation/d/14uV5jrJ0aPs0Hd0Ehu3JPV8IBGc3U8gU6daLAqj6NrM/edit#slide=id.p)。イベントリスナーの登録解除を忘れたり、iframeからオブジェクトを誤って取り込んだり、ワーカーを閉じなかったり、オブジェクトを配列に蓄積したりすることで、メモリリークは容易に発生します。 Webページにメモリリークがある場合、メモリ使用量は時間の経過とともに増加し、Webページは遅く表示され、ユーザーには肥大化します。

この問題を解決するための最初のステップは、それを測定することです。新しい[`performance.measureUserAgentSpecificMemory()` API](https://github.com/WICG/performance-measure-memory)を使用すると、開発者は本番環境でのWebページのメモリ使用量を測定し、ローカルテストをすり抜けるメモリリークを検出できます。

## `performance.measureUserAgentSpecificMemory()`とレガシー`performance.memory` APIとの違い{: #legacy-api }

既存の非標準の`performance.memory` APIに詳しい場合は、新しいAPIとの違いについて疑問に思われるかもしれません。主な違いは、古いAPIはJavaScriptヒープのサイズを返すのに対し、新しいAPIはWebページで使用されているメモリ量を推定することです。この違いは、Chromeが同じヒープを複数のWebページ (または同じWebページの複数のインスタンス) と共有する場合に重要になります。このような場合、古いAPIの結果は任意でオフにできます。古いAPIは「ヒープ」などの実装固有の用語で定義されているため、標準化は不可能です。

もう1つの違いは、新しいAPIがガベージコレクション中にメモリ測定を実行することです。これにより、結果のノイズが減少しますが、結果が生成されるまでに時間がかかる場合があります。他のブラウザーでは、ガベージコレクションに依存せずに、新しいAPIの実装を決定する場合があることに注意してください。

## 推奨されるユースケース{: #use-cases}

Webページのメモリ使用量は、イベント、ユーザーアクション、およびガベージコレクションのタイミングによって異なります。そのため、メモリ測定APIは、本番環境からのメモリ使用量データを集約することを目的としています。個々の呼び出しの結果はあまり役に立ちません。ユースケースの例:

- Webページの新しいバージョンの展開中にリグレッション検出を実行して、新しいメモリリークを特定する。
- A/ Bテストで新機能をテストし、メモリの影響を評価して、メモリリークを検出する。
- メモリ使用量をセッション期間と相関させて、メモリリークの有無を検証する。
- メモリ使用量をユーザーメトリックと相関させて、メモリ使用量の全体的な影響を理解する。

## ブラウザーの互換性{: #compatibility }

現在、APIはオリジントライアルとしてChrome83でのみサポートされています。ブラウザーにはメモリ内のオブジェクトを表すさまざまな方法とメモリ使用量を推定するさまざまな方法があるため、APIの結果は実装に大きく依存します。適切なアカウンティングが高すぎるか実行不可能な場合、ブラウザは一部のメモリ領域をアカウンティングから除外する場合があります。したがって、結果をブラウザー間で比較することはできません。同じブラウザーの結果を比較することだけが意味があります。

## 現在のステータス{: #status }

<div><table>
    <thead>
      <tr>
        <th>ステップ</th>
        <th>状態</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. 説明者を作成する</td>
        <td><a href="https://github.com/WICG/performance-measure-memory">完了</a></td>
      </tr>
      <tr>
        <td>2. 仕様の初期ドラフトを作成する</td>
        <td><a href="https://wicg.github.io/performance-measure-memory/">完了</a></td>
      </tr>
      <tr>
        <td>3. フィードバックを収集して設計を繰り返す</td>
        <td><a href="#feedback">進行中</a></td>
      </tr>
      <tr>
        <td>4. オリジントライアル</td>
        <td><a href="https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113">完了</a></td>
      </tr>
      <tr>
        <td>5. 展開</td>
        <td>Chrome89ではデフォルトで有効</td>
      </tr>
    </tbody>
</table></div>

## `performance.measureUserAgentSpecificMemory()`の使用方法{: use }

### about：// flagsを介して有効にする

オリジントライアルトークンなしで`performance.measureUserAgentSpecificMemory()`を実験するには、`about://flags`で`#experimental-web-platform-features`フラグを有効にします。

### 特徴の検出

実行環境がクロスオリジン情報のリークを防ぐためのセキュリティ要件を満たしていない場合、`performance.measureUserAgentSpecificMemory()` 関数が[SecurityError](https://developer.mozilla.org/docs/Web/API/DOMException#exception-SecurityError)で失敗する可能性があります。Chromeでのオリジントライアル中には、APIでは[サイト分離](https://developers.google.com/web/updates/2018/07/site-isolation)が有効になっている必要があります。APIが連携するときには、[クロスオリジン分離](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)に依存します。Webページは、[COOP + COEPヘッダー](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)を設定することにより、クロスオリジン分離をオプトインできます。

```javascript
if (performance.measureUserAgentSpecificMemory) {
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.log('The context is not secure.');
    } else {
      throw error;
    }
  }
  console.log(result);
}
```

### ローカルテスト

Chromeは、ガベージコレクション中にメモリ測定を実行します。これは、APIが結果のプロミスをすぐに解決せず、代わりに次のガベージコレクションを待機することを意味します。APIはタイムアウト後にガベージコレクションを強制的に実行します。タイムアウトは現在20秒に設定されています。`--enable-blink-features='ForceEagerMeasureMemory'` コマンドラインフラグを使用してChromeを起動すると、タイムアウトがゼロに短縮され、ローカルのデバッグとテストに役立ちます。

## 例

APIの推奨される使用法は、Webページ全体のメモリ使用量をサンプリングし、集計と分析のために結果をサーバーに送信するグローバルメモリモニターを定義することです。最も簡単な方法は、定期的に、たとえば`M`分ごとにサンプリングすることです。ただし、サンプル間でメモリのピークが発生する可能性があるため、データに偏りが生じます。次の例は、[ポアソン過程](https://en.wikipedia.org/wiki/Poisson_point_process)を使用して偏りのないメモリ測定を行う方法を示しています。これにより、サンプルが任意の時点 ([デモ](https://performance-measure-memory.glitch.me/)、[ソース](https://glitch.com/edit/#!/performance-measure-memory?path=script.js:1:0)) で等しく発生する可能性が高くなります。

まず、ランダム化された間隔で`setTimeout()` を使用して、次のメモリ測定をスケジュールする関数を定義します。この関数は、メインウィンドウでページを読み込んだ後に呼び出されます。

```javascript
function scheduleMeasurement() {
  if (!performance.measureUserAgentSpecificMemory) {
    console.log(
      'performance.measureUserAgentSpecificMemory() is not available.',
    );
    return;
  }
  const interval = measurementInterval();
  console.log(
    'Scheduling memory measurement in ' +
      Math.round(interval / 1000) +
      ' seconds.',
  );
  setTimeout(performMeasurement, interval);
}

// メインウィンドウでのページ読み込みの後に測定を開始。
window.onload = function () {
  scheduleMeasurement();
};
```

`measurementInterval()` 関数は、平均して5分ごとに1回の測定が行われるように、ミリ秒単位でランダムな間隔を計算します。関数の基になる数学に興味がある場合は、[指数分布](https://en.wikipedia.org/wiki/Exponential_distribution#Computational_methods)を参照してください。

```javascript
function measurementInterval() {
  const MEAN_INTERVAL_IN_MS = 5 * 60 * 1000;
  return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
}
```

最後に、非同期の`performMeasurement()` 関数がAPIを呼び出し、結果を記録して、次の測定をスケジュールします。

```javascript
async function performMeasurement() {
  // 1. performance.measureUserAgentSpecificMemory() を呼び出す。
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.log('The context is not secure.');
      return;
    }
    // 他のエラーを発生させる。
    throw error;
  }
  // 2. 結果を記録する。
  console.log('Memory usage:', result);
  // 3. 次の測定をスケジュールする。
  scheduleMeasurement();
}
```

結果は次のようになります。

```javascript
// コンソール出力:
{
  bytes: 60_000_000,
  breakdown: [
    {
      bytes: 40_000_000,
      attribution: [
        {
          url: "https://foo.com",
          scope: "Window",
        },
      ]
      types: ["JS"]
    },
    {
      bytes: 0,
      attribution: [],
      types: []
    },
    {
      bytes: 20_000_000,
      attribution: [
        {
          url: "https://foo.com/iframe",
          container: {
            id: "iframe-id-attribute",
            src: "redirect.html?target=iframe.html",
          },
        },
      ],
      types: ["JS"]
    },
  ]
}
```

合計メモリ使用量の見積もりは、`bytes`フィールドに返されます。バイトの値は、[数値区切り構文](https://v8.dev/features/numeric-separators)を使用しています。この値は実装に大きく依存するため、ブラウザー間で比較することはできません。同じブラウザーの異なるバージョン間でも変更される可能性があります。オリジントライアル中の値には、メインウィンドウとすべての**同じサイト**のiframeおよび関連ウィンドウのJavaScriptメモリ使用量が含まれます。APIが連携されると、値は現在のプロセスのすべてのiframe、関連するウィンドウ、およびWebワーカーのJavaScriptおよびDOMメモリを考慮します。[サイト分離](https://www.chromium.org/developers/design-documents/oop-iframes)が有効になっている場合、APIはクロスサイト[プロセス外iframe](https://www.chromium.org/Home/chromium-security/site-isolation)のメモリを測定しないことに注意してください。

`breakdown`リストには、使用されているメモリに関する詳細情報が記載されています。各エントリは、メモリの一部を記述し、URLで識別される一連のウィンドウ、iframe、およびワーカーに帰属します。`types`フィールドには、メモリに関連付けられている実装固有のメモリタイプが一覧表示されます。

すべてのリストを汎用的な方法で扱い、特定のブラウザーに基づいて仮定をハードコーディングしないことが重要です。たとえば、一部のブラウザーは空の`breakdown`または空の`attribution`を返す場合があります。他のブラウザーは`attribution`で複数のエントリを返し、これらのエントリのどれがメモリを所有しているかを区別できなかったことを示します。

## フィードバック{: #feedback }

`performance.measureUserAgentSpecificMemory()`に関する考えや経験について、[Webパフォーマンスコミュニティグループ](https://www.w3.org/community/webperfs/)およびChromeチームにお聞かせください。

### API設計について教えてください

期待どおりに機能しないAPIについて何かありますか？または、アイデアを実装するために必要な不足しているプロパティがありますか？ [performance.measureUserAgentSpecificMemory（）GitHubリポジトリに](https://github.com/WICG/performance-measure-memory/issues)仕様の問題を提出するか、既存の問題に考えを追加してください。

### 実装に関する問題を報告する

Chrome実装のバグを見つけた場合や、実装が仕様と異なる場合は、[https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EPerformanceAPIs)でバグを報告してください。必ず詳細を記入し、バグを再現するための簡単な手順を説明して、**Components**を`Blink>PerformanceAPIs`に設定してください。[Glitch](https://glitch.com/)は、すばやく簡単に再現を共有するのに最適です。

### サポートを表示

`performance.measureUserAgentSpecificMemory()`を使用するご予定ですか？皆さまからの公開サポートは、Chromeチームが各機能に優先順位を付け、そうした機能をサポートすることがいかに重要であるかを他のブラウザベンダーに示すのに役立ちます。[@ChromiumDev](https://twitter.com/chromiumdev)にツイートを送信し、使用している場所と使用している方法を教えてください。

## 便利なリンク {: #helpful }

- [説明者](https://github.com/WICG/performance-measure-memory)
- [デモ](https://performance-measure-memory.glitch.me/) | [デモソース](https://glitch.com/edit/#!/performance-measure-memory?path=script.js:1:0)
- [オリジントライアル](https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113)
- [バグの追跡](https://bugs.chromium.org/p/chromium/issues/detail?id=1049093)
- [ChromeStatus.comエントリ](https://www.chromestatus.com/feature/5685965186138112)

## 謝辞

API設計をレビューしてくださったDomenic Denicola氏、Yoav Weiss氏、Mathias Bynens氏、ChromeのコードをレビューしてくださったDominik Inführ氏、Hannes Payer氏、Kentaro Hara氏、Michael Lippautz氏に感謝します。また、APIを大幅に改善した貴重なユーザーフィードバックを提供してくださったPer Parker氏、Philipp Weis氏、Olga Belomestnykh氏、Matthew Bolohan氏、Neil Mckay氏にも感謝します。

[Unsplashの](https://unsplash.com)[HarrisonBroadbent](https://unsplash.com/@harrisonbroadbent)による[ヒーロー画像](https://unsplash.com/photos/5tLfQGURzHM)
