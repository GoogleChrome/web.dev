---
title: Cómo CommonJS está tornando sus paquetes más grandes
subhead: Descubra cómo los módulos de CommonJS están impactando el "tree-shaking" de su aplicación
authors:
  - mgechev
date: 2020-05-08
updated: 2020-05-26
hero: image/admin/S5JWmwRRW3rEXKwJR0JA.jpg
alt: Cómo CommonJS está tornando sus paquetes más grandes
description: Los módulos CommonJS son bastante dinámicos, lo que evita que los optimizadores y los paquetes JavaScript realicen optimizaciones avanzadas en ellos.
tags:
  - blog
  - javascript
  - modules
---

En esta publicación, veremos qué es CommonJS y por qué hace que sus paquetes de JavaScript sean más grandes de lo necesario.

Resumen: **para garantizar de que el bundler pueda optimizar con éxito su aplicación, evite depender de los módulos CommonJS y utilice la sintaxis de módulos ECMAScript en toda su aplicación.**

## ¿Qué es CommonJS?

CommonJS es un estándar de 2009 que estableció convenciones para módulos JavaScript. Inicialmente, estaba diseñado para usarse fuera del navegador web, principalmente para aplicaciones del lado del servidor.

Con CommonJS puede definir módulos, exportar la funcionalidad de ellos e importarlos en otros módulos. Por ejemplo, el fragmento a continuación define un módulo que exporta cinco funciones: `add`, `subtract`, `multiply`, `divide` y `max`:

```javascript
// utils.js
const { maxBy } = require('lodash-es');
const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

Posteriormente, otro módulo puede importar y utilizar algunas o todas estas funciones:

```javascript
// index.js
const { add } = require('./utils');
console.log(add(1, 2));
```

Invocar `index.js` con `node` generará el número `3` en la consola.

Debido a la falta de un sistema de módulos estandarizado en el navegador a principios de la década de 2010, CommonJS también se convirtió en un formato de módulo popular para las bibliotecas del lado del cliente de JavaScript.

## ¿Cómo afecta CommonJS al tamaño final de su paquete?

El tamaño de su aplicación JavaScript del lado del servidor no es tan crítico como en el navegador, por eso CommonJS no fue diseñado para reducir el tamaño del paquete de producción en mente. Al mismo tiempo, el [análisis](https://v8.dev/blog/cost-of-javascript-2019) muestra que el tamaño del paquete de JavaScript sigue siendo la razón número uno para hacer que las aplicaciones del navegador sean más lentas.

Bundlers de JavaScript, como `webpack` y `terser`, realizan diferentes optimizaciones para reducir el tamaño de su aplicación. Al analizar su aplicación en el momento de la compilación, intentan eliminar tanto como sea posible del código fuente que no está utilizando.

Por ejemplo, en el fragmento anterior, su paquete final solo debe incluir la función `add`, ya que este es el único símbolo de `utils.js` que está importando para `index.js`.

Construyamos la aplicación usando la siguiente configuración de `webpack`:

```javascript
const path = require('path');
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

Aquí especificamos que queremos usar optimizaciones del modo de producción y usar `index.js` como punto de entrada. Después de invocar el `webpack`, si exploramos el tamaño de salida ([output](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js)), veremos algo como esto:

```shell
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

Tenga en cuenta que **el paquete tiene 625 KB**. Si observamos la salida, encontraremos todas las funciones de `utils.js` más muchos módulos de [`lodash`](https://lodash.com/) **. Aunque no usamos `lodash` en `index.js`, es parte de la salida**, lo que agrega mucho peso adicional a nuestros activos de producción.

Ahora cambiemos el formato del módulo a [módulos ECMAScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) e intentemos nuevamente. Esta vez, `utils.js` se vería así:

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

E `index.js` se importaría desde `utils.js` usando la sintaxis del módulo ECMAScript:

```javascript
import { add } from './utils';

console.log(add(1, 2));
```

Usando la misma `webpack`, podemos construir nuestra aplicación y abrir el archivo de salida. **Ahora tiene 40 bytes** con la siguiente [salida](https://github.com/mgechev/commonjs-example/blob/master/esm/dist/out.js):

```javascript
(()=>{"use strict";console.log(1+2)})();
```

Tenga en cuenta que el paquete final no contiene ninguna de las funciones de `utils.js` que no usamos, ¡y no hay rastro de `lodash`! Aún más, `terser`(el minificador de Javascript que `webpack` utiliza) incluyó la función `add` en `console.log`.

Una pregunta justa que puede surgir es, **¿por qué usar CommonJS hace que el paquete de salida sea casi 16,000 veces más grande**? Por supuesto, este es un ejemplo, en realidad, la diferencia de tamaño puede no ser tan grande, pero lo más probable es que CommonJS agregue un peso significativo a su producto en desarrollo.

**Los módulos CommonJS son más difíciles de optimizar de forma general porque son mucho más dinámicos que los módulos ES. Para garantizar que su bundler y su minificador puedan optimizar con éxito su aplicación, evite depender de los módulos CommonJS y utilice la sintaxis de módulos ECMAScript en toda su aplicación.**

Tenga en cuenta que incluso si está utilizando módulos ECMAScript en `index.js`, si el módulo que está consumiendo es un módulo CommonJS, el tamaño del paquete de su aplicación se verá afectado.

## ¿Por qué CommonJS aumenta el tamaño de su aplicación?

Para responder a esta pregunta, veremos el comportamiento del `ModuleConcatenationPlugin` en `webpack` y, después de eso, analizaremos la capacidad de análisis estática. Este complemento concatena el alcance de todos sus módulos en un solo cierre y permite que su código tenga un tiempo de ejecución más rápido en el navegador. Veamos un ejemplo:

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// index.js
import { add } from './utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

Arriba, tenemos un módulo ECMAScript, que importamos a `index.js`. También definimos una función de `subtract`. Podemos construir el proyecto usando la misma configuración `webpack` anterior, pero esta vez, deshabilitaremos la minimización:

```javascript
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
};
```

Veamos la salida producida:

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;**
console.log(add(1, 2));**

/******/ })();
```

En el resultado anterior, todas las funciones están dentro del mismo espacio de nombres. Para evitar colisiones, el paquete web cambió el nombre de la función `subtract` en `index.js` a `index_subtract`.

Si un minificador procesa el código fuente anterior, hará lo siguiente:

- Eliminará las funciones no utilizadas `subtract` e `index_subtract`
- Eliminará todos los comentarios y espacios en blanco redundantes
- Incorporará el cuerpo de la función `add` en la llamada `console.log`

A menudo, los desarrolladores se refieren a esta **remoción de importaciones no utilizadas como tree-shaking**. Este tree-shaking solo fue posible porque el webpack consiguió entender estáticamente (en el momento de la compilación) los símbolos que estamos importando de `utils.js`, y los símbolos que `utils.js` está exportando.

Este comportamiento está habilitado de forma predeterminada para los **módulos ES** porque **son más fáciles de analizar estáticamente**, en comparación con CommonJS.

Veamos exactamente el mismo ejemplo, pero esta vez cambie `utils.js` para usar CommonJS en lugar de módulos ES:

```javascript
// utils.js
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

Esta pequeña actualización cambiará significativamente la salida. Dado que es demasiado grande para introducirse en esta página, he compartido solo una pequeña parte:

```javascript
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

Tenga en cuenta que el paquete final contiene un "tiempo de ejecución" `webpack`: es un código inyectado que es responsable de importar/exportar la funcionalidad de los módulos incluidos. Esta vez, en lugar de colocar todos los símbolos de `utils.js` e `index.js` en el mismo espacio de nombres, solicitamos dinámicamente, durante el tiempo de ejecución, la función `add` `__webpack_require__`.

Esto es necesario porque con CommonJS podemos obtener el nombre de exportación de una expresión arbitraria. Por ejemplo, el siguiente código es una construcción perfectamente válida:

```javascript
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

No hay forma de que el bundler sepa en el momento de la compilación cuál es el nombre del símbolo exportado, ya que esto requiere información que solo está disponible durante el tiempo de ejecución, en el contexto del navegador del usuario.

**De esta manera, el minificador es incapaz de comprender exactamente qué es lo que `index.js` utiliza de sus dependencias, por lo que no puede deshacerse de él.** También observaremos exactamente el mismo comportamiento para los módulos de terceros. **Si importamos un módulo CommonJS de `node_modules`, su cadena de herramientas de compilación no podrá optimizarlo correctamente.**

## "Tree-shaking" con CommonJS

Es mucho más difícil analizar los módulos CommonJS ya que son dinámicos por definición. Por ejemplo, la ubicación de importación en los módulos ES es siempre un literal de cadena, en comparación con CommonJS, donde es una expresión.

En algunos casos, si la biblioteca que está utilizando sigue convenciones específicas sobre cómo utiliza CommonJS, es posible eliminar las exportaciones no utilizadas en el momento de la compilación utilizando un [plugin de](https://github.com/indutny/webpack-common-shake) `webpack` de terceros. Aunque este plugin agrega soporte para "tree-shaking", no cubre todas las diferentes formas en que sus dependencias podrían usar CommonJS. Esto significa que no obtiene las mismas garantías que con los módulos ES. Además, agrega un costo adicional como parte de su proceso de compilación además del comportamiento normal del `webpack`.

## Conclusión

**Para garantizar de que el bundler pueda optimizar con éxito su aplicación, evite depender de los módulos CommonJS y utilice la sintaxis de módulos ECMAScript en toda su aplicación.**

A continuación, presentamos algunos consejos prácticos para verificar que se encuentra en el camino idóneo:

- Use el plugin [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) de Rollup.js y configure la bandera `modulesOnly` para especificar que desea depender solo de los módulos ECMAScript.
- Use el paquete [`is-esm`](https://github.com/mgechev/is-esm) para verificar que un paquete npm utiliza los módulos ECMAScript.
- Si está utilizando Angular, de forma predeterminada recibirá una advertencia si depende de módulos en los que no puede llevar a cabo procedimientos de "tree-shaking".
