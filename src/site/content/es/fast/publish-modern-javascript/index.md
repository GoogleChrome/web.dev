---
layout: post
title: Publique, envíe e instale JavaScript moderno para obtener aplicaciones más rápidas
subhead: Mejore el rendimiento activando las dependencias y la salida de JavaScript modernas.
hero: image/admin/UQbMiPKbXL1EDjtWsLju.jpg
authors:
  - houssein
  - developit
description: El JavaScript moderno ofrece mejoras de tamaño y rendimiento con respecto al ES5 transpilado, y es compatible con el 95% de los navegadores web. Activar la salida de JavaScript moderno aporta estas ventajas a su aplicación, pero el impacto está limitado por las dependencias que ya están transpiladas a ES5. Esta guía muestra cómo publicar paquetes modernos en npm, y cómo instalar y agrupar de forma óptima paquetes de JavaScript moderno.
date: 2020-12-10
updated: 2020-12-16
codelabs:
  - laboratorio-de-código-brindar-código-moderno
tags:
  - performance
  - blog
---

Más del 90% de los navegadores son capaces de ejecutar JavaScript moderno, pero la prevalencia de JavaScript heredado sigue siendo uno de los mayores contribuyentes a los problemas de rendimiento en la web en la actualidad. [EStimator.dev](http://estimator.dev/) es una sencilla herramienta basada en web que calcula el tamaño y la mejora del rendimiento que podría lograr un sitio al ofrecer una sintaxis JavaScript moderna.

<figure data-size="full">{% Img src="image/admin/FHHnXqdjdsC6PNSSnnC4.png", alt="El análisis de EStimator.dev que muestra que un sitio web podría ser un 9% más rápido con JavaScript moderno.", width="800", height="785" %}<figcaption> EStimator.dev</figcaption></figure>

Hoy en día, la web está limitada por el JavaScript heredado, y ninguna optimización única mejorará el rendimiento tanto como escribir, publicar y enviar su página web o paquete utilizando la sintaxis **ES2017.**

## JavaScript moderno

El JavaScript moderno no se caracteriza como código escrito en una versión específica de la especificación ECMAScript, sino en una sintaxis compatible con todos los navegadores modernos. Los navegadores web modernos como Chrome, Edge, Firefox y Safari representan más del [90% del mercado de navegadores](https://www.caniuse.com/usage-table), y los diferentes navegadores que dependen de los mismos motores de renderización subyacentes constituyen un 5% adicional. Esto significa que el 95% del tráfico web global proviene de navegadores que admiten las funciones del lenguaje JavaScript más utilizadas en los últimos 10 años, que incluyen:

- Clases (ES2015)
- Funciones de flecha (ES2015)
- Generadores (ES2015)
- Ámbito de bloque (ES2015)
- Desestructuración (ES2015)
- Parámetros de descanso y propagación (ES2015)
- Sintaxis abreviada de objetos (ES2015)
- Asíncrono / espera (ES2017)

Las funciones de las versiones más recientes de la especificación del lenguaje generalmente tienen un soporte menos consistente en los navegadores modernos. Por ejemplo, muchas funciones de ES2020 y ES2021 solo son compatibles con el 70% del mercado de navegadores; sigue siendo la mayoría de los navegadores, pero no lo suficiente como para confiar directamente en esas funciones. Esto significa que, aunque el JavaScript "moderno" es un objetivo en movimiento, ES2017 tiene la más amplia gama de compatibilidad de navegadores e [incluye la mayoría de las características de sintaxis modernas de uso común](https://dev.to/garylchew/bringing-modern-javascript-to-libraries-432c). En otras palabras, **ES2017 es lo más cercano a la sintaxis moderna en la actualidad** .

## JavaScript heredado

El JavaScript heredado es un código que evita específicamente el uso de todas las funciones del lenguaje citadas arriba. La mayoría de los desarrolladores escriben su código fuente utilizando una sintaxis moderna, pero compilan todo con la sintaxis heredada para una mayor compatibilidad con el navegador. La compilación con la sintaxis heredada aumenta la compatibilidad con el navegador, sin embargo, el efecto suele ser menor de lo que creemos. En muchos casos, el apoyo aumenta de alrededor del 95% al 98%, mientras que conlleva un costo significativo:

- El JavaScript heredado suele ser alrededor de un 20% más grande y más lento que el código moderno equivalente. Las deficiencias y la mala configuración de las herramientas a menudo amplían aún más esta brecha.

- Las bibliotecas instaladas representan hasta el 90% del código JavaScript de producción típico. El código de biblioteca incurre en una sobrecarga de JavaScript heredado aún mayor debido al polyfill y la duplicación de helpers que podría evitarse mediante la publicación de código moderno.

## JavaScript moderno en npm

Recientemente, Node.js ha estandarizado un campo `"exports"` para definir [puntos de entrada para un paquete](https://nodejs.org/api/packages.html#packages_package_entry_points):

```json
{
  "exports": "./index.js"
}
```

Los módulos a los que hace referencia el `"exports"` implican una versión de nodo 12.8 o superior, la cuál admite ES2019. Esto significa que cualquier módulo al que se haga referencia mediante el `"exports"` se puede *escribir en JavaScript moderno*. Los consumidores de paquetes deben asumir que los módulos con un `"exports"` contienen código moderno y transpilar si es necesario.

### Solo moderno

Si desea publicar un paquete con código moderno y dejar que el consumidor se encargue de transpilarlo cuando lo use como dependencia, use solo el campo `"exports"`.

```json
{
  "name": "foo",
  "exports": "./modern.js"
}
```

{% Aside 'caution' %} No se *recomienda* este enfoque. En un mundo perfecto, cada desarrollador ya habría configurado su sistema de compilación para transpilar todas las dependencias (`node_modules`) a su sintaxis requerida. Sin embargo, este no es el caso actualmente, y la publicación de su paquete utilizando solo una sintaxis moderna evitaría su uso en aplicaciones a las que se accedería a través de navegadores heredados. {% endAside %}

### Moderno con respaldo heredado

Utilice el `"exports"` junto con `"main"` para publicar su paquete utilizando código moderno, pero también incluya un respaldo ES5 + CommonJS para navegadores heredados.

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs"
}
```

### Moderno con optimizaciones de paquetes de ESM y respaldo heredado

Además de definir un punto de entrada CommonJS de respaldo, el  campo `"module"` se puede usar para señalar un paquete de respaldo heredado similar, pero que usa la sintaxis de módulo de JavaScript (`import` y `export`).

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs",
  "module": "./module.js"
}
```

Muchos paquetes, como webpack y Rollup, confían en este campo para aprovechar las funciones del módulo y permitir la [agitación de árboles](/commonjs-larger-bundles/#how-does-commonjs-affect-your-final-bundle-size). Este sigue siendo un paquete heredado que no contiene ningún código moderno aparte de la sintaxis `import`/`export`, así que use este enfoque para enviar código moderno con un respaldo heredado que aún está optimizado para empaquetar.

## JavaScript moderno en aplicaciones

Las dependencias de terceros constituyen la gran mayoría del código típico JavaScript de producción en aplicaciones web. Si bien las dependencias de npm se han publicado históricamente como sintaxis de ES5 heredada, esto ya no es una suposición segura y corre el riesgo de que las actualizaciones de dependencia hagan fallar el soporte del navegador en su aplicación.

Con un número cada vez mayor de paquetes npm que se están moviendo a JavaScript moderno, es importante asegurarse de que las herramientas de compilación estén configuradas para manejarlos. Es muy probable que algunos de los paquetes npm de los que depende ya estén usando funciones de lenguaje moderno. Hay varias opciones disponibles para usar código moderno de npm sin romper su aplicación en navegadores más antiguos, pero la idea general es hacer que el sistema de compilación transpile las dependencias al mismo destino de sintaxis que su código fuente.

## webpack

A partir de webpack 5, ahora es posible configurar qué sintaxis utilizará webpack al generar código para paquetes y módulos. Esto no transpila su código o dependencias, solo afecta el código "pegamento" generado por webpack. Para especificar el objetivo de soporte del navegador, agregue una [configuración browserslist](https://github.com/browserslist/browserslist#readme) a su proyecto, o hágalo directamente en su configuración de webpack:

```js
module.exports = {
  target: ['web', 'es2017'],
};
```

También es posible configurar webpack para generar paquetes optimizados que omitan funciones de contenedor innecesarias cuando se enfocan a un entorno de módulos ES moderno. Esto también configura webpack para cargar paquetes de código dividido usando `<script type="module">`.

```js
module.exports = {
  target: ['web', 'es2017'],
  output: {
    module: true,
  },
  experiments: {
    outputModule: true,
  },
};
```

Hay varios complementos de webpack disponibles que permiten compilar y enviar JavaScript moderno sin dejar de admitir navegadores heredados, como Optimize Plugin y BabelEsmPlugin.

### Complemento Optimize

El complemento [Optimize](https://github.com/developit/optimize-plugin) es un complemento de webpack que transforma el código final empaquetado de JavaScript moderno a heredado en lugar de cada archivo fuente individual. Es una configuración autónoma que permite que su configuración de webpack asuma que todo es JavaScript moderno sin ramificaciones especiales para múltiples salidas o sintaxis.

Dado que el complemento Optimize opera en paquetes en lugar de módulos individuales, procesa el código de su aplicación y sus dependencias por igual. Esto hace que sea seguro usar dependencias de JavaScript modernas de npm, porque su código se empaquetará y transpilará a la sintaxis correcta. También puede ser más rápido que las soluciones tradicionales que implican dos pasos de compilación, al mismo tiempo que genera paquetes separados para navegadores modernos y heredados. Los dos conjuntos de paquetes están diseñados para cargarse utilizando el  patrón [module/nomodule](/serve-modern-code-to-modern-browsers/).

```js
// webpack.config.js
const OptimizePlugin = require('optimize-plugin');

module.exports = {
  // ...
  plugins: [new OptimizePlugin()],
};
```

`Optimize Plugin` puede ser más rápido y más eficiente que las configuraciones de webpack personalizadas, que normalmente agrupan código moderno y heredado por separado. También maneja la ejecución de [Babel](https://babeljs.io/) por usted y minimiza los paquetes usando [Terser](https://terser.org/) con configuraciones óptimas separadas para las salidas modernas y heredadas. Por último, los polyfills necesarios para los paquetes heredados generados se extraen en un script dedicado para que nunca se dupliquen ni se carguen innecesariamente en los navegadores más nuevos.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Comparación: transpilar módulos fuente dos veces versus transpilar paquetes generados.</figcaption></figure>

### BabelEsmPlugin

[BabelEsmPlugin](https://github.com/prateekbh/babel-esm-plugin) es un complemento de webpack que funciona junto con [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) para generar versiones modernas de paquetes existentes para enviar código menos transpilado a los navegadores modernos. Es la solución estándar más popular para module/nomodule, utilizada por [Next.js](https://nextjs.org/) y [Preact CLI](https://preactjs.com/cli/).

```js
// webpack.config.js
const BabelEsmPlugin = require('babel-esm-plugin');

module.exports = {
  //...
  module: {
    rules: [
      // your existing babel-loader configuration:
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [new BabelEsmPlugin()],
};
```

`BabelEsmPlugin` admite una amplia gama de configuraciones de webpack, ya que ejecuta dos compilaciones de su aplicación en gran medida independientes. Compilar dos veces puede llevar un poco de tiempo extra para aplicaciones grandes; sin embargo, esta técnica permite que `BabelEsmPlugin` se integre sin problemas en las configuraciones de webpack existentes y lo convierte en una de las opciones más convenientes disponibles.

### Configurar babel-loader para transpilar node_modules

Si está utilizando `babel-loader` sin uno de los dos complementos anteriores, se requiere un paso importante para consumir módulos npm de JavaScript modernos. La definición de dos `babel-loader` separados hace posible compilar automáticamente las características del lenguaje moderno que se encuentran en `node_modules` a ES2017, mientras sigue transpilando su propio código de origen con los complementos y ajustes preestablecidos de Babel definidos en la configuración de su proyecto. Esto no genera paquetes modernos y heredados para una configuración de module/nomodule, pero hace posible instalar y usar paquetes npm que contienen JavaScript moderno sin hacer fallar los navegadores más antiguos.

[webpack-plugin-modern-npm](https://www.npmjs.com/package/webpack-plugin-modern-npm) usa esta técnica para compilar las dependencias npm que tienen un campo `"exports"` en su `package.json`, ya que pueden contener sintaxis moderna:

```js
// webpack.config.js
const ModernNpmPlugin = require('webpack-plugin-modern-npm');

module.exports = {
  plugins: [
    // auto-transpile modern stuff found in node_modules
    new ModernNpmPlugin(),
  ],
};
```

Alternativamente, puede implementar la técnica manualmente en la configuración de su webpack al verificar un campo de `"exports"` en el `package.json` de los módulos a medida que se resuelven. Omitiendo el almacenamiento en caché por brevedad, una implementación personalizada podría verse así:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // Transpile for your own first-party code:
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // Transpile modern dependencies:
      {
        test: /\.js$/i,
        include(file) {
          let dir = file.match(/^.*[/\\]node_modules[/\\](@.*?[/\\])?.*?[/\\]/);
          try {
            return dir && !!require(dir[0] + 'package.json').exports;
          } catch (e) {}
        },
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

Al utilizar este enfoque, deberá asegurarse de que su minificador admita la sintaxis moderna. Tanto [Terser](https://github.com/terser/terser#minify-options) como [uglify-es](https://github.com/mishoo/UglifyJS/tree/harmony#minify-options) tienen una opción para especificar `{ecma: 2017}` para preservar y, en algunos casos, generar la sintaxis de ES2017 durante la compresión y el formateo.

## Rollup

Rollup tiene soporte incorporado para generar múltiples conjuntos de paquetes como parte de una sola compilación y genera código moderno de forma predeterminada. Como resultado, Rollup se puede configurar para generar paquetes modernos y heredados con los complementos oficiales que probablemente ya esté usando.

### @rollup/plugin-babel

Si usa Rollup, el [método `getBabelOutputPlugin()`](https://github.com/rollup/plugins/tree/master/packages/babel#running-babel-on-the-generated-code) (provisto por el [complemento Babel oficial](https://github.com/rollup/plugins/tree/master/packages/babel) de Rollup) transforma el código en paquetes generados en lugar de módulos fuente individuales. Rollup tiene soporte incorporado para generar múltiples conjuntos de paquetes como parte de una sola compilación, cada uno con sus propios complementos. Puede aprovecharlo para producir diferentes paquetes para modernos y heredados pasando cada uno a través de una configuración de complemento de salida de Babel diferente:

```js
// rollup.config.js
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    // modern bundles:
    {
      format: 'es',
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {esmodules: true},
                bugfixes: true,
                loose: true,
              },
            ],
          ],
        }),
      ],
    },
    // legacy (ES5) bundles:
    {
      format: 'amd',
      entryFileNames: '[name].legacy.js',
      chunkFileNames: '[name]-[hash].legacy.js',
      plugins: [
        getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
        }),
      ],
    },
  ],
};
```

## Herramientas de compilación adicionales

Rollup y webpack son altamente configurables, lo que generalmente significa que cada proyecto debe actualizar su configuración para habilitar la sintaxis de JavaScript moderno en las dependencias. También hay herramientas de compilación de alto nivel que favorecen las convenciones y los valores predeterminados sobre la configuración, como [Parcel](https://parceljs.org/), [Snowpack](https://www.snowpack.dev/), [Vite](https://github.com/vitejs/vite) y [WMR](https://github.com/preactjs/wmr). La mayoría de estas herramientas asumen que las dependencias de npm pueden contener sintaxis moderna y las transpilarán al nivel de sintaxis apropiado cuando se compile para producción.

Además de los complementos dedicados para webpack y Rollup, se pueden agregar paquetes de JavaScript moderno con alternativas heredadas a cualquier proyecto mediante [devolution](https://github.com/theKashey/devolution). Devolution es una herramienta independiente que transforma la salida de un sistema de compilación para producir variantes de JavaScript heredadas, permitiendo el empaquetado y las transformaciones para asumir un objetivo de salida moderno.

## Conclusión

[EStimator.dev](http://estimator.dev/) se creó para proporcionar una manera fácil de evaluar el impacto que puede tener el cambio a un código JavaScript capaz de usar la vesión moderna para la mayoría de sus usuarios. Hoy, ES2017 es lo más cercano a la sintaxis moderna y las herramientas como npm, Babel, webpack y Rollup han hecho posible configurar su sistema de compilación y escribir sus paquetes usando esta sintaxis. Este post cubre varios enfoques, y debe usar la opción más fácil que funcione para su caso de uso.

{% YouTube 'cLxNdLK--yI' %}

<br>
