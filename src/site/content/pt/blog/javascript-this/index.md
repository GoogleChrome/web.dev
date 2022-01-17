---
title: 'JavaScript: Qual é o significado disso?'
subhead: Descobrir o valor de `this` pode ser complicado em JavaScript. Veja como fazer…
description: Descobrir o valor de `this` pode ser complicado em JavaScript. Veja como fazer…
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

O `this` do JavaScript é o alvo de muitas piadas, e isso é porque, bem, é bastante complicado. No entanto, tenho visto desenvolvedores fazerem coisas muito mais complicadas e de domínio específico para evitar lidar com esse `this`. Se você não tiver certeza sobre `this`, espero que isto ajude. Este é o meu guia sobre `this`.

Vou começar com a situação mais específica e terminar com a menos específica. Este artigo é meio como um grande `if (…) … else if () … else if (…) …`, então você pode ir direto para a primeira seção que corresponde ao código que você está vendo.

1. [Se a função for definida como uma função de seta](#arrow-functions)
2. [Caso contrário, se a função/classe for chamada com <code>new</code>](#new)
3. [Caso contrário, se a função tiver um valor de, <code>this</code> 'vinculado'](#bound)
4. [Caso contrário, se <code>this</code> for definido no tempo da chamada](#call-apply)
5. [Caso contrário, se a função for chamada através de um objeto pai (<code>parent.func()</code>)](#object-member)
6. [Caso contrário, se a função ou escopo pai estiver no modo strict](#strict)
7. [Caso contrário](#otherwise)

## Se a função for definida como uma função de seta: {: # arrow-functions}

```js
const arrowFunction = () => {
  console.log(this);
};
```

Neste caso, o valor de `this` é *sempre* o mesmo que `this` no escopo do bloco pai:

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

As funções de seta são ótimas porque o valor interno de `this` não pode ser alterado e ele é *sempre* igual ao valor do `this` externo.

### Outros exemplos

Com as funções de seta, o valor de `this` *não pode* ser alterado com [`bind`](#bound):

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

Com as funções de seta, o valor de `this` *não pode* ser alterado com [`call` ou `apply`](#call-apply):

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

Com funções de seta, o valor de `this` *não pode* ser alterado chamando a função como membro de outro objeto:

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

Com funções de seta, o valor de `this` *não pode* ser alterado chamando a função como um construtor:

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### Métodos de instância 'vinculados'

Com métodos de instância, se você quiser garantir que `this` sempre se refira à instância da classe, a melhor maneira é usar funções de seta e [campos de classe](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields):

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

Esse padrão é muito útil ao usar métodos de instância como ouvintes de eventos em componentes (como componentes React ou componentes web).

O código acima pode parecer que está quebrando a regra "O `this` será igual ao `this` do escopo pai" mas ele começa a fazer sentido se você pensar nos campos de classe como uma outra maneira de definir coisas no construtor:

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

Os padrões alternativos envolvem vincular uma função existente no construtor ou atribuir a função dentro do construtor. Se você não pode usar campos de classe por algum motivo, atribuir funções dentro do construtor é uma alternativa razoável:

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## Caso contrário, se a função/classe for chamada com `new` : {: #new}

```js
new Whatever();
```

O código acima irá chamar `Whatever` (ou seu construtor, se for uma classe) com `this` definido com o resultado de `Object.create(Whatever.prototype)`.

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

O mesmo é verdadeiro para construtores antigos:

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### Outros exemplos

Quando chamado com `new`, o valor de `this` *não pode* ser alterado com [`bind`](#bound):

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

Quando chamado com `new`, o valor `this` *não pode* ser alterado chamando a função como um membro de outro objeto:

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## Caso contrário, se a função tiver um valor de, `this` 'vinculado': {: #bound}

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

Sempre que `boundFunction` for chamada, o valor de `this` será o objeto transmitido a `bind` (`boundObject`).

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %} Evite usar `bind` para vincular uma função ao seu `this` externo. Em vez disso, use [funções de seta](#arrow-functions), pois elas deixam `this` claro na declaração da função, em vez de algo que acontece posteriormente no código.

Não use `bind` para definir o valor de `this` para algum valor não relacionado ao objeto pai. Isto é geralmente inesperado e o motivo pelo qual a reputação de `this` é tão ruim. Em vez disso, considere passar o valor como um argumento. Isto é mais explícito e funciona com funções de seta. {% endAside %}

### Outros exemplos

Ao chamar uma função vinculada (bound), o valor de `this` *não pode* ser alterado com [`call` ou `apply`](#call-apply):

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

Ao chamar uma função vinculada (bound), o valor de `this` *não pode* ser alterado chamando a função como membro de outro objeto:

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## Caso contrário, se `this` for definido no tempo da chamada: {: #call-apply}

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

O valor de `this` é o objeto passado para `call`/`apply`.

{% Aside 'warning' %} Não use `call`/`apply` para definir o valor de `this` para algum valor não relacionado ao objeto pai. Isto é geralmente inesperado e o motivo pelo qual a reputação de `this` é tão ruim. Em vez disso, considere passar o valor como um argumento. Isto é mais explícito e funciona com funções de seta. {% endAside %}

Infelizmente, `this` é definido com algum outro valor por coisas como ouvintes de eventos DOM. Nesses casos, usá-lo pode resultar em código difícil de entender:

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

Evito usar `this` em casos como o acima e, em vez disso faço:

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

## Caso contrário, se a função for chamada através de um objeto pai (`parent.func()`): {: #object-member}

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

Neste caso, a função é chamada como um membro de `obj`, então `this` será `obj`. Isto acontece no momento da chamada, então o link é quebrado se a função for chamada sem seu objeto pai ou com um objeto pai diferente:

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

`someMethod() === obj` é falso porque o método `someMethod` *não é* chamado como membro de `obj`. Você poderá encontrar este problema se tentar algo assim:

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

Isto quebra porque a implementação de `querySelector` olha para o seu próprio valor de `this` e espera que seja algum tipo de nó do DOM e isto quebra a ligação. Para alcançar o resultado desejado acima da forma correta, use:

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

Curiosidade: nem todas as APIs usam `this` internamente. Os métodos do console, como `console.log` foram alterados para evitar referências `this`, portanto, o `log` não precisa ser vinculado ao `console`.

{% Aside 'warning' %} Não transplante uma função para um objeto apenas para definir como valor de `this` algum valor não relacionado ao objeto pai. Isto é geralmente inesperado e o motivo pelo qual a reputação de <code>this</code> é tão ruim. Em vez disso, considere passar o valor como um argumento. Isto é mais explícito e funciona com funções de seta. {% endAside %}

## Caso contrário, se a função ou escopo pai estiver no modo strict: {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

Neste caso, o valor de `this` é undefined. `'use strict'` não é necessário na função se o escopo pai já estiver no [modo strict](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode) (e todos os módulos estiverem no modo strict).

{% Aside 'warning' %} Não confie nisso. Quero dizer, existem maneiras mais fáceis de obter um `undefined` 😀. {% endAside %}

## Caso contrário: {: #otherwise}

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

Nesse caso, o valor de `this` é o mesmo que o de `globalThis`.

{% Aside %} A maioria das pessoas (inclusive eu) chama `globalThis` de o objeto global, mas isto não é 100% tecnicamente correto. Aqui está [Mathias Bynens com os detalhes](https://mathiasbynens.be/notes/globalthis#terminology), incluindo por que é chamado `globalThis` vez de simplesmente `global`. {% endAside %}

{% Aside 'warning' %} Evite usar `this` para fazer referência ao objeto global (sim, ainda estou chamando-o assim). Em vez disso, use [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis), que é muito mais explícito. {% endAside %}

## Ufa!

E é isso! Isso é tudo que sei sobre `this`. Alguma pergunta? Algo que perdi? Sinta-se à vontade para [twittar para mim](https://twitter.com/jaffathecake).

Agradecimentos a [Mathias Bynens](https://twitter.com/mathias) , [Ingvar Stepanyan](https://twitter.com/RReverser) e [Thomas Steiner](https://twitter.com/tomayac) pela revisão.
