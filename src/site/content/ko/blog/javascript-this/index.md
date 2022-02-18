---
title: 'JavaScript: 이것(this)이 의미하는 바는 무엇입니까?'
subhead: JavaScript에서 `this`의 값을 알아내는 것은 까다로울 수 있습니다. 작업 수행 방법은 다음과 같습니다.
description: JavaScript에서 `this`의 값을 알아내는 것은 까다로울 수 있습니다. 작업 수행 방법은 다음과 같습니다.
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

JavaScript의 `this`는 많은 농담의 소재가 되곤 합니다. 그 이유는 그것이 꽤 복잡하기 때문입니다. 하지만 개발자가 이 `this`를 처리하지 않기 위해 훨씬 더 복잡하고 도메인 특정 작업을 수행하는 것을 보았습니다. `this`에 대해 잘 모르는 경우 도움이 되기를 바랍니다. 이것은 저의 `this` 가이드입니다.

가장 구체적인 상황부터 시작하여 가장 덜 구체적인 상황으로 마무리하겠습니다. 이 문서는 큰 `if (…) … else if () … else if (…) …`와 대략적으로 비슷하므로 여러분이 보고 있는 코드와 일치하는 첫 번째 섹션으로 바로 이동할 수 있습니다.

1. [함수가 화살표 함수로 정의된 경우](#arrow-functions)
2. [그렇지 않고 함수/클래스가 `new`](#new)로 호출되는 경우
3. [그렇지 않고 함수에 '바운드' `this` 값이 있는 경우](#bound)
4. [그렇지 않고 `this`가 호출 시 설정된 경우](#call-apply)
5. [그렇지 않고 함수가 상위 개체를 통해 호출되는 경우(`parent.func()`)](#object-member)
6. [그렇지 않고 함수 또는 상위 범위가 엄격 모드에 있는 경우](#strict)
7. [그 외의 경우](#otherwise)

## 함수가 화살표 함수로 정의된 경우: {: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

이 경우 `this`의 값은 *항상* 상위 범위의 `this`와 동일합니다.

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

화살표 함수는 `this`의 내부 값을 변경할 수 없고 *항상* 외부 `this`와 동일하기 때문에 훌륭합니다.

### 다른 예시

화살표 함수를 사용하면 [`bind`](#bound)로 `this` 값을 변경할 수 *없습니다*.

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

화살표 기능을 사용하면 [`call` 또는 `apply`](#call-apply)로 `this` 값을 변경할 수 *없습니다*.

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

화살표 함수를 사용하면 다른 개체의 구성 요소로 함수를 호출하여 `this`의 값을 변경할 수 *없습니다*.

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

화살표 함수를 사용하면 함수를 생성자로 호출하여 `this`의 값을 변경할 수 *없습니다*.

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### '바운드' 인스턴스 메서드

인스턴스 메서드를 사용할 때 `this`가 항상 클래스 인스턴스를 참조하도록 하려면 화살표 함수와 [클래스 필드](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)를 사용하는 것이 가장 좋습니다.

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

이 패턴은 구성 요소(예: React 구성 요소 또는 웹 구성 요소)에서 인스턴스 메서드를 이벤트 리스너로 사용할 때 정말 유용합니다.

위의 내용이 "`this`는 상위 범위의 `this`와 동일할 것"이라는 규칙을 위반하는 것처럼 느껴질 수 있지만 클래스 필드를 생성자에서 설정하기 위한 구문 설탕과 같다고 생각하면 이해가 되기 시작합니다.

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

대체 패턴에는 생성자에 기존 함수를 바인딩하거나 생성자에 함수를 할당하는 것이 포함됩니다. 어떤 이유로 클래스 필드를 사용할 수 없는 경우 생성자에서 함수를 할당하는 것이 합리적인 대안입니다.

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## 그렇지 않고 함수/클래스가 `new`로 호출되는 경우: {: #new }

```js
new Whatever();
```

위는 `this` `Object.create(Whatever.prototype)` 의 결과로 설정하여 `Whatever` (또는 클래스인 경우 생성자 함수)을 호출합니다.

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

이전 스타일 생성자의 경우에도 마찬가지입니다.

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### 다른 예

`new` 호출할 때 `this` 의 값은 [`bind`](#bound) 로 변경할 *수 없습니다* .

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

`new` 호출할 때 `this` 의 값은 다른 객체의 멤버로 함수를 호출하여 변경할 *수 없습니다.*

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## 그렇지 않고 함수에 '바운드' `this` 값이 있는 경우: {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

`boundFunction` 이 호출될 때마다 `this` `bind` ( `boundObject` )에 전달된 객체가 됩니다.

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %} `bind` 를 사용하여 함수를 외부 `this` 에 바인딩하지 마십시오. 대신 [화살표 함수를](#arrow-functions) 사용하십시오. 코드에서 나중에 발생하는 것이 아니라 함수 선언에서 `this`

`this` 부모 객체와 관련이 없는 어떤 값으로 설정 `bind` 를 사용하지 마십시오. 보통 예기치 않은 왜 그건 `this` 나쁜 평판을 가져옵니다. 대신 값을 인수로 전달하는 것을 고려하십시오. 더 명확하고 화살표 기능과 함께 작동합니다. {% endAside %}

### 다른 예

바인딩된 함수를 호출할 때 `this` [`call` 또는 `apply`](#call-apply) 로 변경할 *수 없습니다* .

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

바인딩된 함수를 호출할 때 `this` 값은 다른 객체의 멤버로 함수를 호출하여 변경할 *수 없습니다.*

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## 그렇지 않고 `this`가 호출 시 설정된 경우: {: #call-apply }

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

`this` 값은 `call`/`apply`에 전달된 개체입니다.

{% Aside 'warning' %} `call`/`apply`를 사용하여 `this`를 상위 개체와 관련이 없는 값으로 설정하지 마십시오. 이것은 일반적으로 예상치 못하며 `this`가 나쁜 평판을 받는 이유가 됩니다. 대신 값을 인수로 전달하는 것을 고려하십시오. 더 명확하며 화살표 함수와 함께 작동합니다. {% endAside %}

불행히도 `this`는 DOM 이벤트 리스너와 같은 요소에 의해 다른 값으로 설정되며, 이를 사용할 경우 이해하기 어려운 코드 결과를 얻을 수 있습니다.

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

저는 위와 같은 경우에 `this`를 사용하는 대신 다음을 사용합니다.

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

## 그렇지 않고 함수가 상위 개체를 통해 호출되는 경우 (`parent.func()`): {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

이 경우 함수는 `obj`의 구성 요소로 호출되므로 `this`는 `obj`가 됩니다. 이것은 호출 시에 발생하므로 함수가 상위 개체 없이 호출되거나 다른 상위 개체와 함께 호출되면 링크가 끊어집니다.

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

`someMethod() === obj`는 `someMethod`가 `obj`의 구성 요소로 호출되지 *않으므로* false입니다. 다음과 같은 코드를 시도할 때 이러한 문제가 발생했을 수 있습니다.

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

`querySelector` 구현이 자체 `this` 값을 바라보며 이것이 일종의 DOM 노드일 것으로 예상하고 위의 경우 해당 연결을 끊기 때문에 이것이 중단됩니다. 위의 사항을 올바르게 달성하려면 다음을 수행하십시오.

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

재미있는 사실: 모든 API가 내부적으로 `this`를 사용하는 것은 아닙니다. `console.log`와 같은 콘솔 메서드는 `this` 참조를 피하기 위해 변경되었으므로 `log`를 `console`에 바인딩할 필요는 없습니다.

{% Aside 'warning' %} `this`를 상위 개체와 관련이 없는 값으로 설정하기 위해 개체에 함수를 이식하지 마십시오. 이것은 일반적으로 예상치 못하며 <code>this</code>가 나쁜 평판을 받는 이유가 됩니다. 대신 값을 인수로 전달하는 것을 고려하십시오. 더 명확하며 화살표 함수와 함께 작동합니다. {% endAside %}

## 그렇지 않고 함수 또는 상위 범위가 엄격 모드에 있는 경우: {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

이 경우 `this`의 값은 정의되어 있지 않습니다. 상위 범위가 [엄격 모드](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode)이고 모든 모듈이 엄격 모드인 경우 `'use strict'`가 함수에 필요하지 않습니다.

{% Aside 'warning' %} 이에 의존하지 마십시오. `undefined` 값을 얻는 더 쉬운 방법이 있습니다 😀. {% endAside %}

## 그 외의 경우: {: #otherwise }

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

이 경우 `this`의 값은 `globalThis`와 동일합니다.

{% Aside %} 저를 포함한 대부분의 사람들은 `globalThis` 전역 개체를 호출하지만 이것은 기술적으로 100% 정확하지 않습니다. [자세한 내용과 함께 Mathias Bynens를 소개](https://mathiasbynens.be/notes/globalthis#terminology)합니다. 여기에는 단순히 `global`이 아니라 `globalThis`라고 불리는 이유가 포함되어 있습니다. {% endAside %}

{% Aside 'warning' %} 전역 개체를 참조하기 위해 `this`를 사용하지 마세요(예, 저도 여전히 그렇게 부르고 있습니다). 대신 훨씬 더 명시적인 [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis)를 사용하십시오. {% endAside %}

## 휴우!

이게 전부입니다! 이것에 제가 `this`에 대해 아는 전부입니다. 질문이 있으신가요? 제가 놓친 게 있을까요? 저에게 [트윗 메시지를 주시기 바랍니다](https://twitter.com/jaffathecake).

내용을 검토해 주신 [Mathias Bynens](https://twitter.com/mathias), [Ingvar Stepanyan](https://twitter.com/RReverser), [Thomas Steiner](https://twitter.com/tomayac)에게 감사드립니다.
