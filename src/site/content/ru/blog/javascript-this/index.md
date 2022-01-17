---
title: Что означает «this» в JavaScript
subhead: Рассказываем, как разобраться, что в JavaScript значит `this`…
description: Рассказываем, как разобраться, что в JavaScript значит `this`…
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

Объект `this` в JavaScript — предмет многих шуток, поскольку разобраться с ним не так просто. Однако я видел, как разработчики прибегали к гораздо более сложным и специфичным для предметной области решениям — только чтобы не использовать `this`. Если вам тоже не всегда понятно, что означает `this`, надеюсь, моя статья прояснит этот вопрос. Будем считать, это мое руководство по `this`.

Начнем с самой конкретной ситуации и постепенно перейдем к менее конкретным. Структура статьи напоминает `if (…) … else if () … else if (…) …`, так что можете переходить к первому разделу, который соответствует нужному вам коду.

1. [Если функция определена как стрелочная функция](#arrow-functions).
2. [Иначе: если функция или класс вызываются с помощью `new`](#new).
3. [Иначе: если у функции есть «привязанное» значение `this`](#bound).
4. [Иначе: если объект `this` задан во время вызова](#call-apply).
5. [Иначе: если функция вызывается через родительский объект (`parent.func()`)](#object-member).
6. [Иначе: если область действия функции или родительского объекта находятся в строгом режиме](#strict).
7. [Иначе](#otherwise).

## Если функция определена как стрелочная функция {: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

В этом случае значение `this` *всегда* такое же, как у `this` в области действия родительского элемента:

```js
const outerThis = this;

const arrowFunction = () => {
  // Всегда выводит `true`:
  console.log(this === outerThis);
};
```

Стрелочные функции хороши тем, что внутреннее значение `this` не изменяется: оно *всегда* такое же, как у внешнего `this`.

### Другие примеры

В случае стрелочных функций значение `this` *нельзя* изменить с помощью [`bind`](#bound):

```js
// Выводит `true`: значение `this` привязки игнорируется:
arrowFunction.bind({foo: 'bar'})();
```

В случае стрелочных функций значение `this` *нельзя* изменить с помощью [`call` или `apply`](#call-apply):

```js
// Выводит `true`: вызванное значение `this` игнорируется:
arrowFunction.call({foo: 'bar'});
// Выводит `true`: примененное значение `this` игнорируется:
arrowFunction.apply({foo: 'bar'});
```

В случае стрелочных функций значение `this` *нельзя* изменить с помощью вызова функции как элемента другого объекта:

```js
const obj = {arrowFunction};
// Выводит `true`: родительский объект игнорируется:
obj.arrowFunction();
```

В случае стрелочных функций значение `this` *нельзя* изменить с помощью вызова функции как конструктора:

```js
// TypeError: arrowFunction не является конструктором (TypeError: arrowFunction is not a constructor)
new arrowFunction();
```

### «Привязанные» методы экземпляра

Если нужно, чтобы объект `this` всегда ссылался на экземпляр класса, лучше всего использовать стрелочные функции и [поля класса](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields):

```js
class Whatever {
  someMethod = () => {
    // Всегда экземпляр класса Whatever:
    console.log(this);
  };
}
```

Такой подход удобен при использовании методов экземпляра в качестве прослушивателей событий в компонентах (например, в компонентах React или веб-компонентах).

Может показаться, что описанное выше нарушает правило «значение `this` всегда такое же, как у `this` в области действия родительского элемента», однако если представить поля класса как синтаксический сахар для подготовки значений в конструкторе, всё становится понятно:

```js
class Whatever {
  someMethod = (() => {
    const outerThis = this;
    return () => {
      // Всегда выводит `true`:
      console.log(this === outerThis);
    };
  })();
}

// …примерно соответствует следующему:

class Whatever {
  constructor() {
    const outerThis = this;
    this.someMethod = () => {
      // Всегда выводит `true`:
      console.log(this === outerThis);
    };
  }
}
```

Среди альтернативных вариантов — привязка существующей функции в конструкторе и назначение функции в конструкторе. Если по какой-то причине использовать поля класса нельзя, удобной альтернативой будет назначение функции в конструкторе:

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## Иначе: если функция или класс вызываются с помощью `new` {: #new }

```js
new Whatever();
```

В коде выше мы вызываем `Whatever` (или функцию-конструктор, если это класс). В этом случае значение `this` будет равно результату `Object.create(Whatever.prototype)`.

```js
class MyClass {
  constructor() {
    console.log(
      this.constructor === Object.create(MyClass.prototype).constructor,
    );
  }
}

// Выводит `true`:
new MyClass();
```

Это же верно и для конструкторов в старом стиле:

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Выводит `true`:
new MyClass();
```

### Другие примеры

При вызове через `new` значение `this` *нельзя* изменить с помощью [`bind`](#bound):

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Выводит `true`: значение `this` привязки игнорируется:
new BoundMyClass();
```

При вызове через `new` значение `this` *нельзя* изменить с помощью вызова функции как элемента другого объекта:

```js
const obj = {MyClass};
// Выводит `true`: родительский объект игнорируется:
new obj.MyClass();
```

## Иначе: если у функции есть «привязанное» значение `this` {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

При каждом вызове `boundFunction` значением ее `this` будет объект, переданный в `bind` (`boundObject`).

```js
// Выводит `false`:
console.log(someFunction() === boundObject);
// Выводит `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %} Не стоит с помощью `bind` привязывать функцию к ее внешнему `this` — используйте [стрелочные функции](#arrow-functions): в этом случае значение `this` будет понятно из объявления функции, и не нужно будет смотреть, что же происходит в коде дальше.

Не задавайте с помощью `bind` объекту `this` значение, не связанное с родительским объектом: обычно такое поведение не ожидается. Плохая репутация у `this` именно из-за использования таких решений. Передайте нужное значение в качестве аргумента: это более явное поведение, и оно совместимо со стрелочными функциями. {% endAside %}

### Другие примеры

При вызове привязанной функции значение `this` *нельзя* изменить с помощью [`call` или `apply`](#call-apply):

```js
// Выводит `true`: вызванное значение `this` игнорируется:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Выводит `true`: примененное значение `this` игнорируется:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

При вызове привязанной функции значение `this` *нельзя* изменить с помощью вызова функции как элемента другого объекта:

```js
const obj = {boundFunction};
// Выводит `true`: родительский объект игнорируется:
console.log(obj.boundFunction() === boundObject);
```

## Иначе: если объект `this` задан во время вызова {: #call-apply }

```js
function someFunction() {
  return this;
}

const someObject = {hello: 'world'};

// Выводит `true`:
console.log(someFunction.call(someObject) === someObject);
// Выводит `true`:
console.log(someFunction.apply(someObject) === someObject);
```

Значение `this` — это объект, переданный в `call` или `apply`.

{% Aside 'warning' %} Не задавайте с помощью `call` или `apply` объекту `this` значение, не связанное с родительским объектом: обычно такое поведение не ожидается. Плохая репутация у `this` именно из-за использования таких решений. Передайте нужное значение в качестве аргумента: это более явное поведение, и оно совместимо со стрелочными функциями. {% endAside %}

К сожалению, иногда другое значение `this` может устанавливаться, например, прослушивателями событий DOM, в результате чего при использовании такого <code>this</code> код становится тяжелым для понимания.

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Выводит `element`, поскольку спецификация DOM устанавливает для `this` значение,
  // равное элементу, к которому прикреплен обработчик.
  console.log(this);
});
```

{% endCompare %}

В случаях вроде описанного выше я стараюсь избегать `this` и использую такой подход:

{% Compare 'better' %}

```js
element.addEventListener('click', (event) => {
  // Лучше всего — получить из родительской области действия:
  console.log(element);
  // Если это невозможно — из объекта события:
  console.log(event.currentTarget);
});
```

{% endCompare %}

## Иначе: если функция вызывается через родительский объект (`parent.func()`) {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Выводит `true`:
console.log(obj.someMethod() === obj);
```

В этом случае функция вызывается как элемент `obj`, поэтому значение `this` будет `obj`. Это происходит во время вызова, поэтому если функция вызывается без родительского объекта или с другим родительским объектом, связь разрывается:

```js
const {someMethod} = obj;
// Выводит `false`:
console.log(someMethod() === obj);

const anotherObj = {someMethod};
// Выводит `false`:
console.log(anotherObj.someMethod() === obj);
// Выводит `true`:
console.log(anotherObj.someMethod() === anotherObj);
```

Значение `someMethod() === obj` — `false`, потому что <code>someMethod</code> <em>не вызывается</em> как элемент <code>obj</code>. На такое можно наткнуться, если попытаться сделать что-то вроде такого:

```js
const $ = document.querySelector;
// TypeError: запрещенный вызов (TypeError: Illegal invocation)
const el = $('.some-element');
```

Такое не срабатывает, потому что реализация `querySelector` обращается к значению собственного `this` и ожидает, что это будет что-то вроде узла DOM, а код выше разрывает эту связь. Правильный способ добиться желаемого:

```js
const $ = document.querySelector.bind(document);
// Или:
const $ = (...args) => document.querySelector(...args);
```

Интересный факт: не все API используют `this` во внутренних структурах. Консольные методы (например, `console.log`), были изменены таким образом, чтобы избегать ссылок на `this`, поэтому привязка `log` к `console` необязательна.

{% Aside 'warning' %} Не переносите функцию на объект только для того, чтобы задать для `this` значение, не связанное с родительским объектом: обычно такое поведение не ожидается. Плохая репутация у `this` именно из-за использования таких решений. Передайте нужное значение в качестве аргумента: это более явное поведение, и оно совместимо со со стрелочными функциями. {% endAside %}

## Иначе: если область действия функции или родительского объекта находятся в строгом режиме {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Выводит `true`:
console.log(someFunction() === undefined);
```

В этом случае значение `this` не определено. Выражение `'use strict'` в функции не требуется, если родительская область действия находится в [строгом режиме](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode) (и все модули — тоже).

{% Aside 'warning' %} Не стоит полагаться на этот способ — в смысле, получить значение `undefined` можно намного проще 😀. {% endAside %}

## Иначе {: #otherwise }

```js
function someFunction() {
  return this;
}

// Выводит `true`:
console.log(someFunction() === globalThis);
```

В этом случае значение `this` такое же, как у `globalThis`.

{% Aside %} Большинство (включая меня) называют `globalThis` глобальным объектом, но, технически говоря, это не всегда так. Подробнее смотрите у [Матиаса Байненса](https://mathiasbynens.be/notes/globalthis#terminology) (он также объясняет, почему именно `globalThis`, а не просто `global`). {% endAside %}

{% Aside 'warning' %} Не стоит с помощью `this` ссылаться на глобальный объект (я же предупреждал, что я его так называю) — лучше используйте [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis): так намного более очевидно и понятно. {% endAside %}

## Уф!

Ну вот! Это всё, что я знаю об объекте `this`. Есть вопросы? Я что-то пропустил? Смело [пишите мне в Twitter](https://twitter.com/jaffathecake).

Огромное спасибо [Матиасу Байненсу](https://twitter.com/mathias), [Ингвару Степаняну](https://twitter.com/RReverser) и [Томасу Штейнеру](https://twitter.com/tomayac) за проверку статьи.
