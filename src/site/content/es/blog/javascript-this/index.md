---
title: 'JavaScript: ¿Qué significa esto (this)?'
subhead: Averiguar el valor de "this" puede ser complicado en JavaScript, aquí explicamos cómo hacerlo…
description: Averiguar el valor de "this" puede ser complicado en JavaScript, aquí explicamos cómo hacerlo…
authors:
  - jakearchibald
date: 2021-03-08
hero: image/CZmpGM8Eo1dFe0KNhEO9SGO8Ok23/cePCOGeXNFT6WCy85gb4.png
alt: "this \U0001F914"
tags:
  - blog
  - javascript
---

La palabra clave `this` es el blanco de muchas bromas, y eso es porque, bueno, es bastante complicado. Sin embargo, he visto a los desarrolladores hacer cosas mucho más complicadas y específicas del dominio para evitar lidiar con `this`. Si no se siente seguro usando `this`, esperamos que esto le ayude. Esta es mi guía para `this`.

Comenzaré con la situación más específica y terminaré con la menos específica. Este artículo es como un gran `if (…) … else if () … else if (…) …` , así que puedes ir directamente a la primera sección que coincide con el código que estás viendo.

1. [Si la función se define como una función de flecha](#arrow-functions)
2. [De otro modo, si se llama a la función/clase con `new`](#new)
3. [De otro modo, si la función tiene un 'límite' use `this` con este valor](#bound)
4. [De otro modo, si `this` se establece en el momento de la llamada](#call-apply)
5. [De otro modo, si la función se llama a través de un objeto principal ( `parent.func()` )](#object-member)
6. [De otro modo, si la función o el ámbito principal está en modo estricto](#strict)
7. [De otro modo](#otherwise)

## Si la función se define como una función de flecha: {: #arrow-functions }

```js
const arrowFunction = () => {
  console.log(this);
};
```

En este caso, el valor de `this` es *siempre* el mismo que `this` en el ámbito primario:

```js
const outerThis = this;

const arrowFunction = () => {
  // Always logs `true`:
  console.log(this === outerThis);
};
```

Las funciones de flecha son geniales porque el valor interno de `this` no se puede cambiar, *siempre es* el mismo que el valor externo de `this`.

### Otros ejemplos

Con las funciones de flecha, el valor de `this` *no se* puede cambiar con [`bind`](#bound) :

```js
// Logs `true` - bound `this` value is ignored:
arrowFunction.bind({foo: 'bar'})();
```

Con las funciones de flecha, el valor de `this` *no se* puede cambiar con [`call` o `apply`](#call-apply) :

```js
// Logs `true` - called `this` value is ignored:
arrowFunction.call({foo: 'bar'});
// Logs `true` - applied `this` value is ignored:
arrowFunction.apply({foo: 'bar'});
```

Con las funciones de flecha, el valor de `this` *no se* puede cambiar llamando a la función como miembro de otro objeto:

```js
const obj = {arrowFunction};
// Logs `true` - parent object is ignored:
obj.arrowFunction();
```

Con las funciones de flecha, el valor de `this` *no se* puede cambiar llamando a la función como un constructor:

```js
// TypeError: arrowFunction is not a constructor
new arrowFunction();
```

### Métodos de instancia con 'bound'

Con los métodos de instancia, si desea asegurarse de que `this` siempre se refiera a la instancia de la clase, la mejor manera es usar funciones de flecha y [campos de clase](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields):

```js
class Whatever {
  someMethod = () => {
    // Always the instance of Whatever:
    console.log(this);
  };
}
```

Este patrón es realmente útil cuando se utilizan métodos de instancia como detectores de eventos en componentes (como componentes React o componentes web).

Lo anterior puede parecer que está quebrando la regla "`this` será igual que `this` en el ámbito principal", pero comienza a tener sentido si piensa en los campos de clase como azúcar sintáctico para configurar cosas en el constructor:

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

Los patrones alternativos implican vincular una función existente o asignar la función en el constructor. Si no puede usar campos de clase por alguna razón, asignar funciones en el constructor es una alternativa razonable:

```js
class Whatever {
  constructor() {
    this.someMethod = () => {
      // …
    };
  }
}
```

## De otro modo, si se llama la función/clase con `new`: {: #new }

```js
new Whatever();
```

Lo anterior llamará a `Whatever` (o su función constructora si es una clase) con `this` configurado con el resultado de `Object.create(Whatever.prototype)`.

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

Lo mismo ocurre con los constructores de estilo antiguo:

```js
function MyClass() {
  console.log(
    this.constructor === Object.create(MyClass.prototype).constructor,
  );
}

// Logs `true`:
new MyClass();
```

### Otros ejemplos

Cuando se llama con `new`, el valor de `this` *no se* puede cambiar con [`bind`](#bound):

```js
const BoundMyClass = MyClass.bind({foo: 'bar'});
// Logs `true` - bound `this` value is ignored:
new BoundMyClass();
```

Cuando se llama con `new`, el valor de `this` *no se* puede cambiar llamando a la función como miembro de otro objeto:

```js
const obj = {MyClass};
// Logs `true` - parent object is ignored:
new obj.MyClass();
```

## De otro modo, si la función tiene un 'bound', el valor de `this`: {: #bound }

```js
function someFunction() {
  return this;
}

const boundObject = {hello: 'world'};
const boundFunction = someFunction.bind(boundObject);
```

Siempre que se llama `boundFunction`, el valor de `this` será el objeto pasado a `bind` (`boundObject`).

```js
// Logs `false`:
console.log(someFunction() === boundObject);
// Logs `true`:
console.log(boundFunction() === boundObject);
```

{% Aside 'warning' %} Evite usar `bind` para vincular una función a su `this` exterior. En vez de eso, use [funciones de flecha](#arrow-functions), ya que hacen que `this` quede más claro a partir de la declaración de la función, en lugar de algo que suceda más adelante en el código.

No use `bind` para establecer a `this` algún valor no relacionado con el objeto principal; suele ser inesperado y es por eso que `this` tiene tan mala reputación. En vez de eso, considere pasar el valor como un argumento; es más explícito y funciona con funciones de flecha. {% endAside %}

### Otros ejemplos

Al llamar a una función vinculada, el valor de `this` *no se* puede cambiar con [`call` o `apply`](#call-apply):

```js
// Logs `true` - called `this` value is ignored:
console.log(boundFunction.call({foo: 'bar'}) === boundObject);
// Logs `true` - applied `this` value is ignored:
console.log(boundFunction.apply({foo: 'bar'}) === boundObject);
```

Cuando se llama a una función vinculada, el valor de `this` *no se* puede cambiar llamando a la función como miembro de otro objeto:

```js
const obj = {boundFunction};
// Logs `true` - parent object is ignored:
console.log(obj.boundFunction() === boundObject);
```

## De otro modo, si `this` se ha establecido en call-time: {: #call-apply }

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

El valor de `this` es el objeto que se pasa a `call`/`apply`.

{% Aside 'warning' %} No use `call`/`apply` para establecer a `this` algún valor no relacionado con el objeto principal; suele ser inesperado y es por eso que `this` tiene tan mala reputación. En vez de eso, considere pasar el valor como un argumento; es más explícito y funciona con funciones de flecha. {% endAside %}

Desafortunadamente, se establece algún otro valor para `this` por elementos como los detectores de eventos DOM, cuyo uso puede dar como resultado un código difícil de entender:

{% Compare 'worse' %}

```js
element.addEventListener('click', function (event) {
  // Logs `element`, since the DOM spec sets `this` to
  // the element the handler is attached to.
  console.log(this);
});
```

{% endCompare %}

Yo evito usar `this` en casos como el anterior, y en vez de eso utilizo:

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

## De otro modo, si la función se llama a través de un objeto principal (`parent.func()`): {: #object-member }

```js
const obj = {
  someMethod() {
    return this;
  },
};

// Logs `true`:
console.log(obj.someMethod() === obj);
```

En este caso, la función se llama como miembro de `obj`, por lo que `this` será un `obj`. Esto sucede en el momento de la llamada, por lo que el enlace se corta si se llama a la función sin su objeto principal o con un objeto principal diferente:

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

`someMethod() === obj` es falso porque `someMethod` *no se* llama como miembro de `obj`. Es posible que se haya encontrado con este problema al intentar algo como esto:

```js
const $ = document.querySelector;
// TypeError: Illegal invocation
const el = $('.some-element');
```

Esto da un error como resultado porque la implementación de `querySelector` ve su proprio valor de `this` y espera que sea una especie de nodo DOM, y lo anterior corta esa conexión. Para conseguir el resultado deseado con el código anterior correctamente use:

```js
const $ = document.querySelector.bind(document);
// Or:
const $ = (...args) => document.querySelector(...args);
```

Dato curioso: no todas las API utilizan `this` internamente. Los métodos de consola como `console.log` se cambiaron para evitar las referencias a `this`, por lo que no es necesario que el `log` esté vinculado a `console`.

{% Aside 'warning' %} No trasplante una función a un objeto solo para establecer a `this` algún valor no relacionado con el objeto principal; suele ser inesperado y es por eso que `this` tiene tan mala reputación. En vez de eso, considere pasar el valor como un argumento; es más explícito y funciona con funciones de flecha. {% endAside %}

## De otro modo, si la función o el ámbito principal está en modo estricto: {: #strict }

```js
function someFunction() {
  'use strict';
  return this;
}

// Logs `true`:
console.log(someFunction() === undefined);
```

En este caso, el valor de `this` no está definido. `'use strict'` no es necesario en la función si el ámbito principal está en [modo estricto](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode) (y todos los módulos están en modo estricto).

{% Aside 'warning' %} No confíe en esto. Quiero decir, hay formas más fáciles de obtener un valor `undefined` 😀. {% endAside %}

## De otro modo: {: #otherwise }

```js
function someFunction() {
  return this;
}

// Logs `true`:
console.log(someFunction() === globalThis);
```

En este caso, el valor de `this` es el mismo que `globalThis`.

{% Aside %} La mayoría de la gente (incluyéndome) llama a `globalThis` el objeto global, pero esto no es 100 % correcto, técnicamente hablando. Aquí tenemos a [Mathias Bynens con todos los detalles](https://mathiasbynens.be/notes/globalthis#terminology), incluyendo por qué se llama `globalThis` en vez de simplemente `global`. {% endAside %}

{% Aside 'warning' %} Evite usar `this` para hacer referencia al objeto global (sí, todavía lo estoy llamando así). En vez de eso, utilice [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis), que es mucho más explícito. {% endAside %}

## ¡Uf!

¡Y eso es! Eso es todo lo que sé sobre `this`. ¿Alguna pregunta? ¿Se me ha escapado algo? Envíame un [tuit](https://twitter.com/jaffathecake).

Gracias a [Mathias Bynens](https://twitter.com/mathias), [Ingvar Stepanyan](https://twitter.com/RReverser) y [Thomas Steiner](https://twitter.com/tomayac) por la revisión.
