---
title: JavaScript：これはどういう意味ですか？
subhead: JavaScriptでは `this`の値を理解するのに困る場合がありますが、次のとおりにやってみましょう
description: JavaScriptでは `this`の値を理解するのに困る場合がありますが、次のとおりにやってみましょう
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

JavaScriptの`this`は笑いネタであり、それはまあ、それはかなり複雑からです。しかし、開発者が`this`対処を避けるために、もっと複雑かつドメイン固有のものをしたことを見られました 。`this`に困れば、この記事が役に立つかもしれません。これが私の`this`についてのガイドです。

最も具体的な状況から始めて、最も具体的でない状況で終わります。この記事は、`if (…) … else if () … else if (…) …`ように大きいものなので、探しているコードに一致する最初のセクションに直接進むことができます。

1. [関数が矢印関数として定義されている場合](#arrow-functions)
2. [それ以外、関数/クラスが`new`で呼び出された場合](#new)
3. [それ以外、関数に「バインドされた」 `this`値がある場合](#bound)
4. [それ以外、`this`がcall-timeに設定されている場合](#call-apply)
5. [それ以外、関数が親オブジェクト（ `parent.func()` ）を介して呼び出された場合](#object-member)
6. [それ以外、関数または親スコープが厳密モードにある場合](#strict)
7. [それ以外の場合](#otherwise)

## 関数が矢印関数として定義されている場合：{: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

この場合には、`this`の値は*常に*親スコープ内にある`this`と同じです：

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

矢印関数では`this`の内側の値が変更されなくて、優れるものです。 *常に*外側の`this`と同じです。

### その他の例

矢印関数の使用により、`this`の値が[`bind`](#bound)に*変更されません* ：

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

矢印関数の使用により、`this`の値が[`call`または`apply`](#call-apply)に*変更されません* ：

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

矢印関数では、別のオブジェクトのメンバーとして関数を呼び出しても、`this`*の値が変更されません*。

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

矢印関数では、コンストラクターとして関数を呼び出しても、`this`*値が変更されません*。

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### 「バインドされた」インスタンスメソッド

インスタンスメソッドでは、`this`が常にクラスインスタンスを参照することを確保したい場合は、最善の方法として矢印関数と[class fields](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)を使用することを勧めます。

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

このパターンは、コンポーネント（ReactコンポーネントやWebコンポーネントなど）でイベントリスナーとしてインスタンスメソッドを使用する上で非常に役立ちます。

上記は、「`this`は親スコープの `this`と同じになる」というルールに違反しているように感じるかもしれませんが、クラスフィールドをコンストラクターで設定するための糖衣構文のようなものと考えると意味が分かります。

```js
class Whatever {
  someMethod = (() => {
    const outerThis = this;
    return () => {
      // Always logs `true`:
      console.log(this === outerThis);
    };
  })();
}

// …is roughly equivalent to:

class Whatever {
  constructor() {
    const outerThis = this;
    this.someMethod = () => {
      // Always logs `true`:
      console.log(this === outerThis);
    };
  }
}
```

代替パッテンには、コンストラクターで既存関数をバインドするか、コンストラクター内で関数を割り当てることが含まれます。何らかの理由でクラスフィールドを使用できない場合は、代替手段としてコンストラクター内で関数を割り当てることをお勧めします。

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## それ以外、関数/クラスが`new`: で呼び出された場合 {: #new }

```js
new Whatever();
```

下記のように`this`で `Whatever`（またはクラスの場合はそのconstructor関数）を呼び出し、`Object.create(Whatever.prototype)`の結果に設定します。

```js
class MyClass {
  constructor() {
    console.log(
      this.constructor === Object.create(MyClass.prototype).constructor,
    );
  }
}

// Logs `true`:
new MyClass();
```

同様なやり方は古いスタイルのconstructorにも当てはまります。

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### その他の例

`new`で呼び出された場合、 `this` は[`bind`](#bound)で*変更されません*：

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

`new`で呼び出された場合、別のオブジェクトのメンバーとして関数を呼び出しても、`this`の値が*変更されません。*

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## それ以外、関数に「バウンドされた」`this` の値がある場合 : {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

`boundFunction`呼ばれるたびに、その`this`値は`bind` (`boundObject`)に渡されたオブジェクトになります。

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %}`bind`で関数をその外側の`this`に結びつけることは避けてください。代わりに、[矢印関数を使用してください](#arrow-functions)。なぜかと言えば、コードの後半で発生することではなく、関数宣言から`this`明確にするからです。

`bind` で`this`を親オブジェクトに関係のない値に設定しないでください。それは通常期待の通りにならなず、そして`this`がそのような悪い評判を得る理由です。代わりに、引数として値を渡すことを検討してください。より明確で、矢印関数で機能するからです。{% endAside %}

### その他の例

バインドされた関数を呼び出す場合、`this`の値が[`call`または`apply`](#call-apply)に*変更されません* ：

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

バインドされた関数を呼び出す場合、別のオブジェクトのメンバーとして関数を呼び出しても`this`値が*変更されません。*

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## それ以外、 `this`がcall-timeに設定されている場合：{: #call-apply }

```js
function someFunction() {
  return this;
}

const someObject = {hello: 'world'};

// Logs `true`:
console.log(someFunction.call(someObject) === someObject);
// Logs `true`:
console.log(someFunction.apply(someObject) === someObject);
```

`this`の値に`call`/`apply`に渡されたオブジェクトです 。

{% Aside 'warning' %}`call`/`apply` で `this`を親オブジェクトに関係のない値に設定しないでください。それは通常期待の通りにならなず、そして`this`がそのような悪い評判を得る理由です。代わりに、引数として値を渡すことを検討してください。より明確で、矢印関数で機能するからです。{% endAside %}

残念ながら、 `this`はDOMイベントリスナーなどによって他の値に設定されており、これを使用すると、コードが理解しにくくなる可能性があります。

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

上記の場合などには`this`を使用せず、代わりに次のようにします。

{% Compare 'better' %}

```js
element.addEventListener('click', (event) => {
  // Ideally, grab it from a parent scope:
  console.log(element);
  // But if you can't do that, get it from the event object:
  console.log(event.currentTarget);
});
```

{% endCompare %}

## それ以外、関数が親オブジェクト (`parent.func()`)を介して呼び出された場合： {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

この場合、関数は`obj`のメンバーとして呼び出されるため、 `this`は`obj`になります。これはcall-timeに発生するため、関数が親オブジェクトなしで、または別の親オブジェクトを使用して呼び出された場合、リンクは切断されます。

```js
const {someMethod} = obj;
// Logs `false`:
console.log(someMethod() === obj);

const anotherObj = {someMethod};
// Logs `false`:
console.log(anotherObj.someMethod() === obj);
// Logs `true`:
console.log(anotherObj.someMethod() === anotherObj);
```

`someMethod`*は*`obj`メンバーとして呼び出されないため、`someMethod() === obj`はfalseになります。次のようなことを試みたときに、この落とし穴に遭遇するかもしれません。

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

これは、 `querySelector`の実装がそれ自体の`this`値を調べて、それが一種のDOMノードであると想定するために壊れ、そしてその接続を壊します。上記を正しく機能するには：

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

面白い事実：すべてのAPIが`this`内部で使用しているわけではありません。`console.log`などのコンソールメソッドは`this`参考を回避するように変更されたため、`log`は`console`にバインドされる必要はありません。

{% Aside 'warning' %}`this`を親オブジェクトと関係のない値に設定するためだけで、関数をオブジェクトに移植しないでください。それは通常期待の通りにならなず、そして<code>this</code>がそのような悪い評判を得る理由です。代わりに、引数として値を渡すことを検討してください。より明確で、矢印関数で機能するからです。{% endAside %}

## それ以外、関数または親スコープが厳密モードにある場合： {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

この場合には、`this`の値は未定義です。親スコープが[厳密モード](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode)にある場合（およびすべてのモジュールが厳密モードにある場合）、`'use strict'`は必要ありません。

{% Aside 'warning' %}これに依存しないでください。 `undefined`の値を取得する簡単な方法があります😀。{% endAside %}

## それ以外：{: #otherwise }

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

この場合には、`this`の値は`globalThis`と同じです 。

{% Aside %}ほとんどの人（私を含む）は`globalThis`をグローバルオブジェクトと呼んでいますが、これは技術的に100％正しくありません。 ここは単に`global`ではなく`globalThis`と呼ばれる理由が入っている[Mathias Bynensとその詳細](https://mathiasbynens.be/notes/globalthis#terminology)です。 {% endAside %}

{% Aside 'warning' %} `this`を使用してglobal objectを参照することは避けてください（はい、私はまだそれを呼んでいます）。代わりに、より明示的な[`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis) をご使用ください{% endAside %}

## ふぅ！

以上です！それが`this`について把握しているのです。何かご質問はありませんか？見逃したものはありますか？お気軽に[ツイート](https://twitter.com/jaffathecake)してください。

[Mathias Bynens](https://twitter.com/mathias) 、[Ingvar Stepanyan](https://twitter.com/RReverser) 、と[Thomas Steiner](https://twitter.com/tomayac)に見直していただき、誠にありがとうございます。
