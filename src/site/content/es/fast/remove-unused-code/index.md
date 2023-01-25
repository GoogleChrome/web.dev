---
layout: post
title: Eliminar el código no utilizado
subhead: El npm hace que agregar código a su proyecto sea muy sencillo. ¿Pero realmente estás usando todo esos bytes extra?
authors:
  - houssein
date: 2018-11-05
description: Los registros como el npm han transformado el mundo de JavaScript para mejor al permitir que cualquier persona descargue y use fácilmente más de medio millón de paquetes públicos, pero a menudo incluimos bibliotecas que no estamos utilizando por completo. Para solucionar este problema, analice su paquete para detectar el código no utilizado.
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

Los registros como el [npm](https://docs.npmjs.com/getting-started/what-is-npm) han transformado el mundo de JavaScript para mejor, al permitir que cualquiera pueda descargar y usar fácilmente más de *medio millón de* paquetes públicos, pero a menudo incluimos bibliotecas que no estamos utilizando por completo. Para solucionar este problema, **analice su paquete** para detectar el código no utilizado. Posteriomente, elimine las bibliotecas **no utilizadas** e **innecesarias.**

## Analizar tu paquete

DevTools facilita ver el tamaño de todas las solicitudes de red:
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}
{% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="Panel de red con solicitud de paquete", width="800", height="169" %}

La pestaña [Cobertura](https://developer.chrome.com/docs/devtools/coverage/) en DevTools también le dirá cuánto código CSS y JS en su aplicación no es utilizado.

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="Cobertura de código en DevTools", width="800", height="562" %}

Al especificar una configuración completa de Lighthouse a través de su Node CLI, también se puede utilizar una auditoría de "JavaScript no utilizado" para rastrear la cantidad de código no utilizado que viene con su aplicación.

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Auditoría Lighthouse de JS no utilizado", width="800", height="347" %}

Si está utilizando [webpack](https://webpack.js.org/) para generar sus paquetes, [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) lo ayudará a investigar el contenido del el paquete. Incluya el complemento en el archivo de configuración webpack como cualquier otro complemento:

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

Aunque webpack se usa comúnmente para crear aplicaciones de una sola página, otros generadores de paquetes, como [Parcel](https://parceljs.org/) y [Rollup](https://rollupjs.org/guide/en), también tienen herramientas de visualización que puede utilizar para analizar su paquete.

Cargar de nuevo la aplicación con este complemento incluido, muestra un mapa de árbol ampliable de todo su paquete.

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack Bundle Analyzer", width="800", height="468"%}

El uso de esta visualización le permite inspeccionar qué partes de su paquete son más grandes que otras, así como tener una mejor idea de todas las bibliotecas que está importando. Esto puede ayudar a identificar si está utilizando bibliotecas innecesarias o no utilizadas.

## Eliminar bibliotecas no utilizadas

En la imagen de mapa de árbol anterior, hay bastantes paquetes dentro de un solo dominio `@firebase`. Si su sitio web solo necesita el componente de base de datos firebase, actualice las importaciones para obtener esa biblioteca:

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

Es importante enfatizar que este proceso es significativamente más complejo para aplicaciones más grandes.

Para el paquete de aspecto misterioso que está bastante seguro de que no se está utilizando en ningún lugar, retroceda un paso y vea cuál de sus dependencias de nivel superior lo está usando. Intente encontrar una manera de importar solo los componentes que necesita. Si no está utilizando una biblioteca, elimínela. Si la biblioteca no es necesaria para la carga de la página inicial, considere si puede [cargarse de forma diferida](/reduce-javascript-payloads-with-code-splitting).

Y en caso de que esté utilizando webpack, consulte [la lista de complementos que eliminan automáticamente el código no utilizado de las bibliotecas populares](https://github.com/GoogleChromeLabs/webpack-libs-optimizations).

{% Aside 'codelab' %} [Elimina el código no utilizado.](/codelab-remove-unused-code) {% endAside %}

## Eliminar bibliotecas innecesarias

No todas las bibliotecas se pueden dividir fácilmente en partes e importar de forma selectiva. En estos casos, considere si la biblioteca podría eliminarse por completo. La creación de una solución personalizada o el aprovechamiento de una alternativa más ligera siempre deben ser opciones que valgan la pena considerar. Sin embargo, es importante sopesar la complejidad y el trabajo necesario para cualquiera de estos esfuerzos antes de eliminar una biblioteca por completo de una aplicación.
