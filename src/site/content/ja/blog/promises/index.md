---
title: JavaScript の Promises の紹介
subhead: |2-

  Promiseは、遅延計算と非同期の計算を簡素化します。Promise とははまだ完了していない操作のことです。
description: Promiseは、遅延計算と非同期の計算を簡素化します。Promise とははまだ完了していない操作のことです。
date: 2013-12-16
updated: 2021-01-18
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

開発者の皆さん、私たちはウェブ開発の歴史の中で極めて重要な瞬間にさしかかろうとしています。

<em>【ドラムロール開始】</em>

JavaScript に Promise が導入されました！

<em>[花火が打ちあがり、キラキラした紙吹雪が舞い、人々が興奮]</em>

この時点で、あなたには次のカテゴリのいずれかが当てはまると思います。

- あなたの回りでは、大勢の人たちがこれを喜んでいますが、あなたは一体何の騒ぎなのか分かりません。あなたは「Promise」が何なのかさえ知らないのではないでしょうか。あなたは、思わず肩をすくてしまいます。しかし、キラキラ光る紙吹雪があなたの肩に重くのしかかってきます。これが当てはまるという方、ご安心ください。私もこの重要性を理解できるまでに何年もかかりました。あなたは、[最初](#whats-all-the-fuss-about)から始めることをおすすめします。
- あなたは空に向かって拳を突き上げます！ついにこの時が来たといった感じでしょうか？あなたは Promise の使用経験はあるものの、すべての実装で API が多少異なるという点にイライラしていました。JavaScript 公式バージョンの API は何なのか？そういうあなたには、[用語集](#promise-terminology)から始めることをおすすめします。
- そんなことはもう既に知っている、とこの知らせを初めて聞いて興奮する人々を笑うあなたは、自分のすごさに浸ってから、[API リファレンスに](#promise-api-reference)に直行してください。

## Promise とは一体？ {: ＃whats-all-the-fuss-about}

JavaScript はシングルスレッド、つまり、2 ビットのスクリプトを同時に実行することはできません。一つずつしか実行できません。ブラウザごとに異なりますが、JavaScript はブラウザ内で他の多くのものとスレッドを共有します。ただし、一般的に JavaScript は、ペイントやスタイルの更新、ユーザーによる操作の処理 (テキストの強調表示やフォームコントロールの操作など) と同じキューに置かれます。これらのいずれかで実行されるアクティビティが他の作業の実行を遅らせます。

私たち人間は、マルチスレッドと言えるでしょう。複数の指を使って入力したり、運転しながら会話をしたりすることができます。私たちの邪魔をする唯一の関数は、くしゃみです。くしゃみをする間は、進行中の他のすべてのアクティビティを一時停止しなくてはいけません。特に、運転中や会話をしようとしているときなどは、結構イライラさせられます。くしゃみをするようなコードは書きたくないものです。

回避策として、イベントやコールバックを使用したことがあるのではないでしょうか。以下のようなものがイベントです。

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // 画像の読み込みに成功
});

img1.addEventListener('error', function() {
  // 残念、破損しています
});
```

ここではくしゃみが一切起こりません。画像を見つけて、リスナーをいくつか追加しています。そして、JavaScript は、リスナーの 1 つが呼び出されるまで実行を停止できます。

残念ながら、上の例では、イベントをリッスンする前にイベントが発生した可能性があるため、回避策として画像の「complete」プロパティを使用します。

```js
var img1 = document.querySelector('.img-1');

function loaded() {
  // 画像の読み込みに成功
}

if (img1.complete) {
  loaded();
}
else {
  img1.addEventListener('load', loaded);
}

img1.addEventListener('error', function() {
  // 残念、破損しています
});
```

これでは、画像に対してリッスンするチャンスを得る前に発生したエラーをキャッチできません。残念ながら、DOM にはそれを実現する方法がありません。しかも、ここでは画像を 1 つ読み込んでいるだけです。複数の画像がいつ読み込まれたのかを確認したい場合は、もっと複雑になります。

## イベントを使うことがいつも最適であるとは限りません

イベントは、`keyup` や `touchstart`など、同じオブジェクトに対して複数回発生する可能性のあるものに対して効果的です。これらのイベントでは、リスナーをアタッチする前に発生したことに配慮する必要がありません。しかし、非同期の成功/失敗に関しては、次のようなコードが理想的と言えます。

```js
img1.callThisIfLoadedOrWhenLoaded(function() {
  // 読み込み完了
}).orIfFailedCallThis(function() {
  // 読み込み失敗
});

// and…
whenAllTheseHaveLoaded([img1, img2]).callThis(function() {
  // すべて読み込み完了
}).orIfSomeFailedCallThis(function() {
  // 1 つ以上の画像の読み込みに失敗
});
```

Promise は以下のように使い、名前も分かりやすく付けられています。HTML の image 要素に Promise を返す「ready」メソッドがある場合は、次のようにすることができます。

```js
img1.ready()
.then(function() {
  // 読み込み完了
}, function() {
  // 読み込み失敗
});

// and…
Promise.all([img1.ready(), img2.ready()])
.then(function() {
  // すべて読み込み完了
}, function() {
  // 1 つ以上の画像の読み込みに失敗
});
```

Promise は、次の点を除いて、最も基本的な面でイベントリスナーに少し似ています。

- Promise は、1 回だけ成功または失敗する。2 回はできない。また、成功から失敗に、またはその逆に切り替えることもできない。
- Promise が成功または失敗した後に成功/失敗のコールバックを追加した場合、イベントがその前に発生している場合でも、正しいコールバックが呼び出されます。

これは、非同期の成功/失敗において非常に便利です。これは、何かが利用可能になった正確な時間よりも、結果に反応することが大切であるためです。

## Promise の用語集 {: #promise-terminology}

[Domenic Denicola](https://twitter.com/domenic)がこの記事の最初のドラフトを校正し、用語集の評価はなんと「F」でした。彼は私を拘束し、 強制的に [States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) を 100 回コピーさせ、私に対する不安を綴った手紙を両親に書きました。にもかかわらず、私は未だに用語を混同していますが、基本的な用語をご紹介します。

Promise は以下の状態にできます。

- **fulfilled** - Promise に関連する行動が成功した
- **rejected** - Promise に関連するアクションが失敗した
- **pending** - まだ処理されても、拒否されてもいない
- **settled** - 処理済みである、または拒否された

[仕様](https://www.ecma-international.org/ecma-262/#sec-promise-objects)には、Promise のようなオブジェクトを説明するものとして、**thenable** という用語も使われています。この用語を見ると、過去にイングランドのあるフットボールクラブでマネージャーを務めた [Terry Venables](https://en.wikipedia.org/wiki/Terry_Venables) を思い出してしまうので、極力使わないようにします。

## Promise が JavaScript に登場！

Promise は、しばらく前から以下のようなライブラリとして出回っています。

- [NS](https://github.com/kriskowal/q)
- [when](https://github.com/cujojs/when)
- [WinJS](https://msdn.microsoft.com/library/windows/apps/br211867.aspx)
- [RSVP.js](https://github.com/tildeio/rsvp.js)

上記のライブラリと JavaScript Promise は、Promises / A + と呼ばれる共通の標準化された動作を共有します。[jQuery ユーザーなら、これに似た](https://api.jquery.com/category/deferred-object/)[Deferreds](https://api.jquery.com/category/deferred-object/) と呼ばれるものがあるのをご存知かもしれません。ただし、Deferred は Promise / A + に準拠していないため、前者は[微妙に異なり、有用性も劣ります](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/)ので、注意が必要です。 jQuery にも [Promise 型](https://api.jquery.com/Types/#Promise)がありますが、これは単に Deferred のサブセットであり、同じ問題を抱えています。

Promise の実装は標準化された動作に従いますが、全体的な API は異なります。 JavaScript の Promise と RSVP.js は、API が似ています。Promise は以下のように作成します。

```js
var promise = new Promise(function(resolve, reject) {
  // async などの作業を行ってから。。。

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

Promise のコンストラクターは、引数 を 1 つ (resolve と reject という 2 つのパラメーターを持つコールバック) だけ受け取ります。コールバック内で async など、何らかの作業を実行し、すべてがうまく行った場合は resolve を呼び出し、そうでない場合は reject  を呼び出します。

従来のシンプルな JavaScript で使われた `throw` と同様に、Error オブジェクトを使って拒否することは、必須ではないですが、お決まりとされています。 Error オブジェクトの利点は、スタックトレースをキャプチャするため、デバッグツールの効果が高まる点です。

Promise は、以下のように使います。

```js
promise.then(function(result) {
  console.log(result); // "成功！"
}, function(err) {
  console.log(err); // Error: "失敗！"
});
```

`then()`は、2 つの引数 (成功の場合のコールバックと失敗の場合のコールバック) を取ります。どちらもオプションですので、コールバックは成功の場合だけ、もしくは失敗の場合だけ追加できます。

JavaScript の Promise は、そもそも DOMで「Futures」として始まり、「Promises」へと名前が変更されてから、今回ついに JavaScript に移行しました。DOM ではなく JavaScript で使えると、Node.js をはじめとする、ブラウザー以外の JS コンテキストで利用できるため、非常に便利です (そのコア API で使用されるかどうかはまた別の話です)。

Promise は JavaScript の機能ですが、DOM でも堂々と使用されています。実際、非同期の成功/失敗メソッドを備えたすべての新しい DOM API で Promise が使用されています。すでに、[Quota Management](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html#idl-def-StorageQuota)、[Font Load Events](http://dev.w3.org/csswg/css-font-loading/#font-face-set-ready)、 [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/cf459d473ae09f6994e8539113d277cbd2bce939/service_worker.ts#L17) 、 [Web MIDI](https://webaudio.github.io/web-midi-api/#widl-Navigator-requestMIDIAccess-Promise-MIDIOptions-options) 、[Streams](https://github.com/whatwg/streams#basereadablestream) などで行われています。

## ブラウザのサポートとポリフィル

現在、Promise はすでにいくつかのブラウザに実装されています。

Chrome 32、Opera 19、Firefox 29、Safari 8、Microsoft Edge において、Promise はデフォルトで有効になっています。

Promise が完全には実装されていないブラウザーを仕様に準拠させる、または他のブラウザーや Node.js に Promise を追加するには、[ポリフィル](https://github.com/jakearchibald/ES6-Promises#readme) (2k gzip圧縮) を確認してください。

## 他のライブラリとの互換性

JavaScript の Promise API は、`then()` メソッドを使用するすべてのものを Promise のようなもの (または promise-speak **ため息** の場合は `thenable`) として処理するため、Q Promise を返すライブラリを使用する場合は、問題なく JavaScript の新しい Promise とうまく連携するでしょう。

ただし、前述したように、jQuery の Deferred はあまり役に立ちません。ありがたいことに、標準的な Promise にキャストすることができます。できるだけ早い段階で実行する価値があります。

```js
var jsPromise = Promise.resolve($.ajax('/whatever.json'))
```

ここで、jQuery の`$.ajax` は Deferred を返します。 Deferred には `then()` メソッドがあるため、 `Promise.resolve()` を使って JavaScript の Promise に変えることができます。ただし、たとえば、以下のように deferreds がコールバックに複数の引数を渡す場合があります。

```js
var jqDeferred = $.ajax('/whatever.json');

jqDeferred.then(function(response, statusText, xhrObj) {
  // ...
}, function(xhrObj, textStatus, err) {
  // ...
})
```

JS の Promise は最初のものを除いてすべてを無視します。

```js
jsPromise.then(function(response) {
  // ...
}, function(xhrObj) {
  // ...
})
```

幸い、通常は、これを期待するでしょう。少なくとも、必要なものへのアクセスを与えてくれます。また、jQuery は Error オブジェクトを拒否に渡すというルールには従わないことに注意してください。

## 複雑な非同期コードが簡単に

それでは、少しコーディングをしましょう。以下を行いたいとします。

1. スピナーを起動して読み込みの進捗を示す
2. ストーリーの JSON をフェッチして、タイトルと各チャプターの URL を取得する。
3. ページにタイトルを追加する
4. 各チャプターをフェッチする
5. ページにストーリーを追加する
6. スピナーを停止する

…しかし、途中で問題が発生した場合は、それをユーザーに伝えます。その時点でスピナーを停止します。そうしないと、スピナーは回転し続け、目が回り、他の UI にクラッシュしてしまいます。

もちろん、JavaScript を使用してストーリーを配信することはありません。[HTML として提供する方が速い](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)ですが、複数のデータをフェッチしてから、すべてが完了した後に何らかのアクションを実行するといったこのパターンは API を操作する際によく見られます。

まずは、ネットワークからデータをフェッチすることからはじめましょう。

## XMLHttpRequest を Promise で対応

古い API は Promise を使用するように更新されますが、下位互換性がある場合に限ります。`XMLHttpRequest` は最有力候補ですが、とりあえずは、GET リクエストを作成するシンプルな関数を書いてみましょう。

```js
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}
```

そしてその関数を使います。

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
})
```

今は、手動で `XMLHttpRequest` を入力しなくても、HTTP リクエストを作成できます。`XMLHttpRequest` の苛立たしいキャメルケースを見なくて済めば、作業が簡単になるので嬉しい限りです。

## 連鎖

`then()` はストーリーの終わりではありません。複数の `then` をつなぎ合わせれば、値を変換したり、別の非同期アクションを一つずつ実行したりできます。

### 値の変換

値は、単純に新しい値を返すだけで変換できます。

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

実用的な例を見るために、次のコードに戻ります。

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
})
```

応答はJSONですが、現在プレーンテキストとして受信しています。私たちは、JSONを使用するために私たちget関数を変更することができ[`responseType`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest#responseType) 、私たちも、約束の地でそれを解決することができます：

```js
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
})
```

`JSON.parse()`は単一の引数を取り、変換された値を返すため、ショートカットを作成できます。

```js
get('story.json').then(JSON.parse).then(function(response) {
  console.log("Yey JSON!", response);
})
```

実際、`getJSON()` 関数は非常に簡単に作成できます。

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

`getJSON()` は引き続き、URL をフェッチしてから、レスポンスを JSON として解析する Promise を返します。

### 非同期アクションのキューイング

`then` sをチェーンして、非同期アクションを順番に実行することもできます。

`then()` コールバックから何かを返すときは、ちょっとした魔法を使っているような感じです。値を返す場合、次の `then()` はその値を使って呼び出されます。ただし、Promise のようなものを返す場合、次の `then()` はそれを待機することになり、その Promise が解決した (成功/失敗した) ときにだけ呼び出されます。例えば、次のコードをご覧ください。

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

ここでは、リクエストする一連の URL が含まれた `story.json` に非同期リクエストを送信します。それから、最初の URL をリクエストします。ここで、Promise がシンプルなコールバックパターンよりも際立つようになります。

チャプターを取得するためのショートカットメソッドを作成することもできます。

```js
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// and using it is simple:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
})
```

`story.json` は `getChapter` が呼び出されるまでダウンロードしません。しかし、次に `getChapter` が呼び出されるときは、`story.json` を 2 回もフェッチしなくていいように、ストーリーの Promise を再利用します。Promise は非常に便利なんです！

## エラー処理

前に見たように、 `then()`は2つの引数を取ります。1つは成功、もう1つは失敗（またはpromise-speakでは実行と拒否）です。

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

`catch()` を使用することもできます。

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

`catch()` について何も特別なことはありません。`then(undefined, func)` のシュガーにすぎませんが、読みやすいのは確かです。上の 2 つのコード例は、異なる動作をしますので注意が必要です。後者は、下のコードと同じ動作をします。

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).then(undefined, function(error) {
  console.log("Failed!", error);
})
```

違いは微妙ですが、非常に便利です。Promise の拒否は、拒否コールバック (または同等の `catch()`) がある次の `then()` までスキップします。`then(func1, func2)` では、`func1` または `func2` のいずれかが呼び出されますが、両方が呼び出されることはありません。しかし、`then(func1).catch(func2)` の場合は、両者はチェーンないでは個別のステップであるため、`func1` が拒否すれば、両方が呼び出されます。次のコードをご覧ください。

```js
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

上記のフローは、通常の JavaScript の try / catch と非常によく似ており、「try」内で発生したエラーはすぐに `catch()` ブロックに送られます。こちらは、上のコードをフローチャートにしたものです (私がフローチャートが大好きなので)。


<div style="position: relative; padding-top: 93%;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"
   src="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/simQvoUExWisIW0XxToH.svg" | imgix }}" frameborder="0" allowtransparency="true"></iframe>
</div>

処理される Promise は青い線に、拒否される Promise については赤い線に従ってください。

### JavaScript の例外と Promise

拒否は、Promiseが 明示的に拒否された場合に発生しますが、コンストラクターのコールバックでエラーが投げられた場合は、暗黙的にも発生します。

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse throws an error if you feed it some
  // invalid JSON, so this implicitly rejects:
  resolve(JSON.parse("This ain't JSON"));
});

jsonPromise.then(function(data) {
  // This never happens:
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

つまり、エラーは自動的にキャッチされ、拒否となるため、Promise 関連の作業はすべて Promise コンストラクターのコールバック内で行うと便利だということになります。

`then()` コールバックで投げられるエラーについても同じことが言えます。

```js
get('/').then(JSON.parse).then(function() {
  // This never happens, '/' is an HTML page, not JSON
  // so JSON.parse throws
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

### 実際のエラー処理

このストーリーとチャプターの例では、catch を使用してユーザーにエラーを表示できます。

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

`story.chapterUrls[0]` のフェッチが失敗した場合、(たとえば、http 500 またはユーザーがオフラインの場合)、後続のすべての成功コールバック (レスポンスを JSON として解析しようと試みる `getJSON()` の成功コールバックを含む) だけでなく、ページに chapter1.html を追加するコールバックもスキップします。代わりに、catch のコールバックへと進みます。その結果、前のアクションのいずれかが失敗した場合は、ページに「Failed to show chapter」が追加されます。

JavaScript の try / catch と同様に、エラーはキャッチされ、後続のコードは続行されるため、スピナーは表示されることがありません。まさに理想通りの処理です。上のコードは、下のコードの非ブロック型の非同期バージョンになります。

```js
try {
  var story = getJSONSync('story.json');
  var chapter1 = getJSONSync(story.chapterUrls[0]);
  addHtmlToPage(chapter1.html);
}
catch (e) {
  addTextToPage("Failed to show chapter");
}
document.querySelector('.spinner').style.display = 'none'
```

`catch()` は、エラーから回復せずに、ログ目的で使用することをお勧めします。これは、エラーを投げ直すだけで行えます。今回の例では、`getJSON()` メソッドの中で行えます。

```js
function getJSON(url) {
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}
```

なんとか 1 つのチャプターをフェッチできましたが、すべてのチャプターが必要なので、さっそく取りかかりましょう。

## 並列処理とシーケンス化: それぞれの長所を活かす

非同期で考えるのは簡単ではありません。手がつけられずに困っている人は、同期させるものとしてコードを記述してみてください。この場合は、以下のようになります。

```js
try {
  var story = getJSONSync('story.json');
  addHtmlToPage(story.heading);

  story.chapterUrls.forEach(function(chapterUrl) {
    var chapter = getJSONSync(chapterUrl);
    addHtmlToPage(chapter.html);
  });

  addTextToPage("All done");
}
catch (err) {
  addTextToPage("Argh, broken: " + err.message);
}

document.querySelector('.spinner').style.display = 'none'
```

{% Glitch { id: 'promises-sync-example', height: 480 } %}

これなら大丈夫ですね！しかし、これだと同期するだけでなく、ダウンロード中にはブラウザをロックすることになります。これを非同期にするには、`then()` を使って一つずつ実行していきます。

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // TODO: for each url in story.chapterUrls, fetch & display
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

しかし、チャプターの各 URLをループして、それらを順番にフェッチするにはどうすればいいでしょうか？以下のコードでは、**実現できません**。

```js
story.chapterUrls.forEach(function(chapterUrl) {
  // Fetch chapter
  getJSON(chapterUrl).then(function(chapter) {
    // and add it to the page
    addHtmlToPage(chapter.html);
  });
})
```

`forEach` は非同期に対応していないため、チャプターはダウンロードされた順序で表示されます。パルプフィクションはそうやって制作されましたが、これはパルプフィクションではないので、修正しましょう。

### シーケンスの作成

`chapterUrls` 配列を一連の Promise に変換したいと思います。それは、`then()` を使って行えます。

```js
// Start off with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function(chapterUrl) {
  // Add these actions to the end of the sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
})
```

`Promise.resolve()` を見るのはこれが初めてです。これは、指定した値に解決される Promise を作成します。 `Promise` インスタンスを渡しても、返されるだけです (**注:** これは仕様への変更ですが、一部の実装では未だ実践されていません)。それに Promise のようなもの (`then()` メソッドを持つなど) に渡すと、同じかたちで実行/拒否される `Promise`  が作成されます。`Promise.resolve('Hello')` などの他の値を渡すと、その値を使って処理される Promise が作成されます。上のコードのように値なしで呼び出すと、「undefined」として処理されます。

`Promise.reject(val)` というものもあります。これは、指定した値 (または undefined) で拒否される Promise を作成します。

上のコードは、[`array.reduce`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) を使用すれば、読みやすくなります。

```js
// Loop through our chapter urls
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Add these actions to the end of the sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())
```

これは前の例と同じことをしていますが、個別の「シーケンス」変数は必要ありません。配列内のアイテムごとに reduce コールバックが呼び出されます。 「シーケンス」は、一回目は `Promise.resolve()` ですが、残りの呼び出しでは、前の呼び出しから返されたものになります。  `array.reduce`は、配列を単一の値 (この場合でいうと Promise) にまとめる際に非常に便利です。

それでは、すべてのコードを一まとめにしてみましょう。

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Once the last chapter's promise is done…
    return sequence.then(function() {
      // …fetch the next chapter
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // and add it to the page
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-example', height: 480 } %}

これで、同期バージョンの完全な非同期バージョンができました。しかし、まだ改善の余地はあります。現在、私たちのページは次のようにダウンロードされています。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

ブラウザには一度に複数のものをダウンロードする能力があるため、チャプターを一つずつダウンロードすることでパフォーマンスが損なわれていることになります。すべてのチャプターを同時にダウンロードして、完了した時点で処理するのが理想的です。幸い、それを実現できる API があります。

```js
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
})
```

`Promise.all` は Promise の配列を受け取り、それらすべてが正常に完了したときに処理される Promise を作成してくれます。結果の配列は、(Promise の処理結果を問わず) 渡したPromise と同じ順番で作成されます。

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Take an array of promises and wait on them all
  return Promise.all(
    // Map our array of chapter urls to
    // an array of chapter json promises
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Now we have the chapters jsons in order! Loop through…
  chapters.forEach(function(chapter) {
    // …and add to the page
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened so far
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-all-example', height: 480 } %}

接続によっては、1 つずつ読み込む場合よりも数秒速くなる可能性があり、最初の試行よりもコードが少なくなります。チャプターはどの順番でもダウンロードできますが、画面には正しい順序で表示されます。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

ただし、知覚パフォーマンスについてはまだ改善の余地があります。最初のチャプターのダウンロードが終了したら、それをぺーじに追加します。そうすれば、ユーザーは残りのチャプターのダウンロードが完了する前に読み始めることができます。チャプター 3 が到着しても、ページには追加しません。チャプター 2 が欠落していることにユーザーが気付いていない可能性があるためです。チャプター 2 が完了したら、チャプター 2、3、…を追加していきます。

これを行うには、すべてのチャプターの JSON を同時にフェッチしてから、それらをドキュメントに追加するシーケンスを作成します。

```js
getJSON('story.json')
.then(function(story) {
  addHtmlToPage(story.heading);

  // Map our array of chapter urls to
  // an array of chapter json promises.
  // This makes sure they all download in parallel.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce to chain the promises together,
      // adding content to the page for each chapter
      return sequence
      .then(function() {
        // Wait for everything in the sequence so far,
        // then wait for this chapter to arrive.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-best-example', height: 480 } %}

こうして、両方の長所だけを活用できました！すべてのコンテンツを配信するのにかかる時間は同じですが、ユーザーは最初のコンテンツを早く読み始めることができます。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

この小さな例では、すべてのチャプターはほぼ同時に到着しますが、各チャプターを一つずつ表示することのメリットは、より大きなチャプターをダウンロードする際に一層際立つでしょう。

[Node.js スタイルのコールバックまたはイベント](https://gist.github.com/jakearchibald/0e652d95c07442f205ce)を使用して同じことを実行すると、コードはおよそ 2 倍の量に膨れ上がりますが、さらに重要なことは、理解しにくくなってしまうという点です。ただし、これで Promise のすべてをカバーできた訳ではありません。ES6 の他の機能を組み合わせれば、作業がもっと簡単になります。

## ボーナスラウンド: 拡張機能

私が最初にこの記事を書いて以来、Promise を使用する機能は大幅に拡大しています。Chrome 55 が登場してからは、非同期関数で Promise ベースのコードを同期関数のように記述することができるようになりましたが、メインスレッドをブロックせずに行うことができます。詳しくは、[私が書いた非同期関数に関する記事](/async-functions)をお読みください。主要なブラウザでは、Promise と非同期機能の両方が幅広くサポートされています。詳しくは、MDN に記載の[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) および [async 関数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) のリファレンスを参照してください。

本記事の校正および修正・提案をしてくださった皆さま (Anne van Kesteren、Domenic Denicola、Tom Ashworth、Remy Sharp、Addy Osmani、Arthur Evans、Yutaka Hirano) に感謝いたします。

また、本記事の[さまざまな箇所を更新](https://mathiasbynens.be/)してくれた [MathiasBynens](https://github.com/html5rocks/www.html5rocks.com/pull/921/files)にも感謝いたします。
