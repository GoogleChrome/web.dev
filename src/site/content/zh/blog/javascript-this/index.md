---
title: JavaScript：这是什么意思？
subhead: 在 JavaScript 中找出 `this` 的值可能很难，这里介绍了方法……
description: 在 JavaScript 中找出 `this` 的值可能很难，这里介绍了方法……
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

JavaScript 的`this`产生了许多笑话，因为它非常复杂。但是，我已经看到开发人员做了更复杂和特定领域的事来避免处理`this` 。如果您不确定`this`是什么，希望本文会对您有所帮助。这是我的`this`指南。

我会从最具体的情况开始讲起，以最不具体的情况结束。这篇文章有点像一个大大的`if (…) … else if () … else if (…) …` ，所以您可以直接进入与您要了解的代码相匹配的第一节。

1. [如果函数定义为箭头函数](#arrow-functions)
2. [否则，如果使用`new`](#new)调用函数/类
3. [否则，如果函数有一个“绑定”的`this`值](#bound)
4. [否则，如果`this`是在调用时设置的](#call-apply)
5. 否则，如果函数是通过父对象 (<code>parent.func()</code>) 调用的： {: #object-member }
6. [否则，如果函数或父作用域处于严格模式](#strict)
7. [否则](#otherwise)

## 如果函数定义为箭头函数：{: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

在这种情况下，`this`的值*始终*与父作用域的`this`相同：

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

箭头函数好就好在`this`的内部值无法更改，它*始终*与外部`this`相同。

### 其他示例

使用箭头函数时，*不能*通过[`bind`](#bound)更改 `this`的值：

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

使用箭头函数时，*不能*通过[`call`或`apply`](#call-apply)更改`this`的值：

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

使用箭头函数时，*不能*通过将函数作为另一个对象的成员调用来更改`this`的值：

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

使用对于箭头函数时，*不能*通过将函数作为构造函数调用来更改`this`的值：

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### “绑定”实例方法

使用实例方法时，如果您想确保`this`始终指向类实例，最好的方法是使用箭头函数和[类字段](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)：

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

当在组件（例如 React 组件或 Web 组件）中使用实例方法作为事件侦听器时，此模式非常有用。

上面的内容可能会让人觉得它打破了“`this`与父作用域的`this`相同”规则，但如果您将类字段视为在构造函数中设置内容的语法糖，这样就讲得通了：

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

替代模式涉及在构造函数中绑定现有函数，或在构造函数中分配函数。如果由于某种原因不能使用类字段，那么在构造函数中分配函数是一个合理的选择：

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## 否则，如果使用<code>new</code>调用函数/类 {: #new }

```js
new Whatever();
```

上面的代码会调用`Whatever`（或如果它是类的话，会调用它的构造函数），并将`this`设置为`Object.create(Whatever.prototype)`的结果。

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

对于旧式构造函数也是如此：

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### 其他示例

当使用`new`调用时，*无法*用[`bind`](#bound)改变`this`的值：

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

当使用`new`调用时，*不能*通过将函数作为另一个对象的成员调用来更改`this`的值：

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## 否则，如果函数有一个“绑定”的<code>this</code>值 {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

每次调用`boundFunction`时，它的`this`值将是传递给`bind` ( `boundObject` ) 的对象。

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %} 避免使用`bind`将函数绑定到它的外部`this` 。相反，使用[箭头函数](#arrow-functions)，因为它们通过函数生命让`this`更清晰，而不是在代码后面发生的事情。

不要使用`bind`将`this`设置为与父对象无关的某个值；这通常是出乎意料的，这就是`this`遭人诟病的原因。考虑将值作为参数传递；它更明确，并且可与箭头函数一起使用。 {% endAside %}

### 其他示例

调用绑定函数时，*无法*通过[`call`或`apply`](#call-apply)更改`this`的值：

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

调用绑定函数时，*不能*通过将函数作为另一个对象的成员调用来更改`this`的值：

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## 否则，如果`this`是在调用时设置的：{: #call-apply }

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

`this`的值是传递给`call` / `apply`的对象。

{% Aside 'warning' %}不要使用`call`/`apply` 将`this`设置为与父对象无关的某个值；这通常是出乎意料的，这就是`this`遭人诟病的原因。考虑将值作为参数传递；它更明确，并且可与箭头函数一起使用。 {% endAside %}

不幸的是， `this`被诸如 DOM 事件侦听器之类的东西设置为其他一些值，并且使用它可能会导致难以理解的代码：

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

我会避免在上述情况下使用`this`，而是用：

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

## 否则，如果函数是通过父对象 (`parent.func()`) 调用的： {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

在这种情况下，函数作为`obj`的成员被调用，所以`this`会是`obj` 。这发生在调用时，所以如果在没有父对象的情况下调用函数，或者使用不同的父对象调用函数，链接就会断开：

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

`someMethod() === obj`是 false，因为`someMethod`*不是*作为`obj`的成员调用的。在尝试这样的事情时，您可能遇到过这个问题：

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

这会中断，因为`querySelector`的实现查看自己的`this`值并期望它是某种 DOM 节点，而上述代码中断了该连接。要正确实现上述目标：

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

有趣的事实：并非所有的 API 都在内部使用`this`。如`console.log`这样的控制台方法已做过更改，从而避免引用`this`，因此不需要将`log`绑定到`console`。

{% Aside 'warning' %}不要将函数移植到对象上，来将<code>this</code>设置为与父对象无关的某个值；这通常是出乎意料的，这就是<code>this</code>遭人诟病的原因。考虑将值作为参数传递；它更明确，并且可与箭头函数一起使用。 {% endAside %}

## 否则，如果函数或父作用域处于严格模式：{: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

在这种情况下，价值`this`没有定义。 如果父作用域处于[严格模式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode)（并且所有模块都处于严格模式），则函数中不需要`'use strict'`。

{% Aside 'warning' %}不要依赖这个方法。我的意思是，有更简单的方法可以获得`undefined`值😀。 {% endAside %}

## 否则：{: #otherwise }

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

在这种情况下，`this`的值与`globalThis`相同。

{% Aside %} 大多数人（包括我）都将`globalThis`称为全局对象，但这在技术上并不是完全正确的。这里是[Mathias Bynens 的详细介绍](https://mathiasbynens.be/notes/globalthis#terminology)，包括为什么将其称为`globalThis`而不是简单的`global` 。 {% endAside %}

{% Aside 'warning' %} 避免使用`this`来引用全局对象（是的，我仍然这样称呼它）。相反，请使用更加明确的[`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis) {% endAside %}

## 大功告成！

就是这样！这就是我知道的关于`this`的一切。有任何疑问？我漏掉了什么？请随时[给我发推文](https://twitter.com/jaffathecake)。

感谢 [Mathias Bynens](https://twitter.com/mathias) 、[Ingvar Stepanyan](https://twitter.com/RReverser) 和 [Thomas Steiner](https://twitter.com/tomayac)的校对。
