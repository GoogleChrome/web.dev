---
layout: post
title: Minificar CSS
authors:
  - demianrenzulli
description: |2-

  Aprenda a minificar los archivos CSS para mejorar el rendimiento sin afectar la forma en que el navegador procesa los estilos.
date: 2019-05-02
tags:
  - performance
---

Los archivos CSS pueden contener caracteres innecesarios, como comentarios, espacios en blanco e indentación. En producción, estos caracteres se pueden eliminar de forma segura para reducir el tamaño del archivo sin afectar la forma en que el navegador procesa los estilos. Esta técnica se llama **minificación**.

## Cargar CSS no minificado

Eche un vistazo al siguiente bloque CSS:

```css
body {
  font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
  margin: 2em;
}

/* all titles need to have the same font, color and background */
h1 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}

h2 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}
```

Este contenido es fácil de leer, a costa de producir un archivo más grande de lo necesario:

- Utiliza espacios con para la indentación y contiene comentarios, que el navegador ignora, por lo que se pueden eliminar.
- Los elementos `<h1>` y `<h2>` tienen los mismos estilos: en lugar de declararlos por separado: "`h1 {...} h2 {...}`" podrían expresarse como "`h1, h2{...}`".
- El **color de fondo**, `#000000` podría expresarse simplemente como `#000`.

Después de realizar estos cambios, obtendría una versión más compacta de los mismos estilos:

```css
body{font-family:"Benton Sans","Helvetica Neue",helvetica,arial,sans-serif;margin:2em}h1,h2{font-style:italic;color:#373fff;background-color:#000}
```

Probablemente no desee escribir CSS así. En su lugar, puede escribir CSS como de costumbre y agregar un paso de minificación a su proceso de compilación. En esta guía, aprenderá cómo hacerlo mediante el uso de una herramienta de compilación popular: [webpack](https://webpack.js.org/).

## Medición

Va a aplicar la minificación CSS a un sitio que se ha utilizado en otras guías: [Fav Kitties](https://fav-kitties-animated.glitch.me/). Esta versión del sitio utiliza una biblioteca CSS genial: [animate.css](https://github.com/daneden/animate.css), para animar diferentes elementos de la página cuando un usuario vota por un gato 😺.

Como primer paso, debe comprender cuál sería la oportunidad después de minificar este archivo:

1. Abra [la página de medición](/measure).
2. Ingrese la URL: `https://fav-kitties-animated.glitch.me` y haga clic en **Ejecutar auditoría**.
3. Haga clic en **Ver informe**.
4. Haga clic en **Rendimiento** y vaya a la sección **Oportunidades.**

El informe resultante muestra que se pueden ahorrar **hasta 16 KB** del archivo **animate.css:**

{% Img src="image/admin/RFMk5OMAIvOlkUZJTsh4.png", alt="Lighthouse: Minify CSSportunity.", width="800", height="172", class = "screenshot" %}

Ahora inspeccione el contenido del CSS:

1. Abre el [sitio Fav Kitties](https://fav-kitties-animated.glitch.me/) en Chrome. (Es posible que los servidores de Glitch tarden un poco en responder la primera vez). {% Instruction 'devtools-network', 'ol' %}
2. Haga clic en el filtro **CSS.**
3. Seleccione la casilla de verificación **Desactivar caché.** {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/WgneNAyftk8jneyXxMih.png", alt="Rastro no optimizada de DevTools CSS", width="800", height="138" %}

La página solicita dos archivos CSS, de **1.9 KB** y **76.2 KB** respectivamente.

1. Haga clic en **animate.css**.
2. Haga clic en la pestaña **Respuesta** para ver el contenido del archivo.

Tenga en cuenta que la hoja de estilo contiene caracteres para espacios en blanco e indentación:

{% Img src="image/admin/UEB5Xxe5IHhGtMx3XfKD.png", alt="Respuesta no optimizada de DevTools CSS", width="800", height="286" %}

A continuación, agregará algunos complementos de webpack a su proceso de compilación para minificar estos archivos.

{% Aside 'note' %} **Nota:** el informe de Lighthouse anterior solo enumera `animate.css` como una oportunidad para minificar. La minificación de `style.css` también ahorrará algunos bytes, pero no lo suficiente para que Lighthouse lo considere un ahorro significativo. Sin embargo, minificar CSS es una buena práctica general; por lo que tiene sentido hacerlo con todos sus archivos CSS. {% endAside %}

## Minificación CSS con webpack

Antes de entrar en las optimizaciones, tómese un tiempo para comprender cómo funciona el proceso de creación del [sitio Fav Kitties](https://glitch.com/edit/#!/fav-kitties-animated?path=webpack.config.js:1:0%5D):

{% Glitch { id: 'fav-kitties-animated', path: 'webpack.config.js', previewSize: 0 } %}

De forma predeterminada, el paquete JS resultante que produce webpack contendría el contenido de los archivos CSS en línea. Como queremos mantener archivos CSS separados, usamos dos complementos complementarios:

- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) extraerá cada hoja de estilo en su propio archivo, como uno de los pasos del proceso de compilación.
- [webpack-fix-style-only-entries](https://github.com/fqborges/webpack-fix-style-only-entries) se usa para corregir un problema en wepback 4, para evitar generar un archivo JS adicional para cada archivo CSS listado en **webpack-config.js**.

Ahora realizará algunos cambios en el proyecto:

1. Abra [el proyecto Fav Kitties en Glitch](https://glitch.com/~fav-kitties-animated). {% Instruction 'source', 'ol' %} {% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

Para minificar el CSS resultante, utilizará el complemento [Optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin):

1. En la consola Glitch, ejecute `npm install --save-dev optimize-css-assets-webpack-plugin`.
2. Ejecute `refresh`, para que los cambios se sincronicen con el editor de Glitch.

A continuación, vuelva al editor de Glitch, abra el archivo **webpack.config.js** y haga las siguientes modificaciones:

Cargue el módulo al principio del archivo:

```js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
```

Luego, pase una instancia del complemento a la matriz de **complementos:**

```js
  plugins: [
    new HtmlWebpackPlugin({template: "./src/index.html"}),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new FixStyleOnlyEntriesPlugin(),
    new OptimizeCSSAssetsPlugin({})
  ]
```

Después de realizar los cambios, se activará una reconstrucción del proyecto. Así es como se verá el **webpack.config.js** resultante:

{% Glitch { id: 'fav-kitties-animated-min', path: 'webpack.config.js', previewSize: 0 } %}

A continuación, comprobará el resultado de esta optimización con herramientas de rendimiento.

## Verificar

{% Instruction 'preview' %}

Si se perdió en algún paso anterior, puede hacer clic [aquí](https://fav-kitties-animated-min.glitch.me/) para abrir una versión optimizada del sitio.

Para inspeccionar el tamaño y el contenido de los archivos:

{% Instruction 'devtools-network', 'ol' %}

1. Haga clic en el filtro **CSS**.
2. Seleccione la casilla de verificación **Deshabilitar caché** si aún no está seleccionada. {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/id5kWwB3NilmVPWPTM59.png", alt="Respuesta no optimizada de DevTools CSS", width="800", height="130" %}

Puede inspeccionar estos archivos y ver que las nuevas versiones no contienen espacios en blanco. Ambos archivos son mucho más pequeños, en particular, [animate.css](http://fav-kitties-animated-min.glitch.me/animate.css) se ha reducido en **~26%**, ¡ahorrando **~20 KB**!

Como paso final:

1. Abra [la página de mediciones](/measure).
2. Ingrese la URL del sitio optimizado.
3. Haga clic en **Ver informe**.
4. Haga clic en **Rendimiento** y busque la sección **Oportunidades.**

El informe ya no muestra "Minificar CSS" como "Oportunidad" y ahora se ha trasladado a la sección "Auditorías aprobadas":

{% Img src="image/admin/zegn2qIHYYK58w1GhgYd.png", alt="Auditorías aprobadas por Lighthouse para una página optimizada", width="800", height="163" %}

Dado que los archivos CSS son [recursos bloqueadores de la renderización](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources), si aplica minificación en sitios que usan archivos CSS grandes, puede ver mejoras en métricas como [First Contentful Paint: Primer despliegue de contenido](/fcp/).

## Próximos pasos y recursos

En esta guía, hemos cubierto la minificación CSS con webpack, pero el mismo enfoque se puede seguir con otras herramientas de compilación, como [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) para [Gulp](https://gulpjs.com/) o [grunt-contrib-cssmin](https://www.npmjs.com/package/grunt-contrib-cssmin) para [Grunt](https://gruntjs.com/).

La minificación también se puede aplicar a otros tipos de archivos. Consulte la [guía Minificar y comprimir cargas útiles de red](/fast/reduce-network-payloads-using-text-compression) para obtener más información sobre las herramientas para minificar JS y algunas técnicas complementarias, como la compresión.
