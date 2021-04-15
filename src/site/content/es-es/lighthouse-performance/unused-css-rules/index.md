---
layout: post
title: Eliminar CSS no utilizado
description: Obtenga más información sobre la auditoría de reglas de CSS no utilizadas.
date: '2019-05-02'
updated: '2020-05-29'
web_lighthouse:
  - reglas-CSS-no utilizadas
---

La sección Oportunidades de su informe Lighthouse enumera todas las hojas de estilo con CSS no utilizado con un ahorro potencial de 2 KiB o más. Elimine el CSS no utilizado para reducir los bytes innecesarios consumidos por la actividad de la red:

<figure class="w-figure"><img class="w-screenshot" src="unused-css-rules.png" alt="Una captura de pantalla de la auditoría de CSS no utilizada de Lighthouse Remove"></figure>

## Cómo el CSS no utilizado ralentiza el rendimiento

Usar una `<link>` es una forma común de agregar estilos a una página:

```html
<!doctype html>
<html>
  <head>
    <link href="main.css" rel="stylesheet">
    ...
```

El `main.css` que descarga el navegador se conoce como hoja de estilo externa, porque se almacena por separado del HTML que lo usa.

De forma predeterminada, un navegador debe descargar, analizar y procesar todas las hojas de estilo externas que encuentra antes de poder mostrar o representar cualquier contenido en la pantalla de un usuario. No tendría sentido que un navegador intentara mostrar contenido antes de que se hayan procesado las hojas de estilo, porque las hojas de estilo pueden contener reglas que afecten el estilo de la página.

Cada hoja de estilo externa debe descargarse de la red. Estos viajes de red adicionales pueden aumentar significativamente el tiempo que los usuarios deben esperar antes de ver cualquier contenido en sus pantallas.

El CSS no utilizado también ralentiza la construcción del [árbol de renderizado](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) por parte del navegador. El árbol de renderización es como el árbol DOM, excepto que también incluye los estilos para cada nodo. Para construir el árbol de renderizado, un navegador debe recorrer todo el árbol DOM y verificar qué reglas CSS se aplican a cada nodo. Cuanto más CSS no utilizado haya, más tiempo podría necesitar un navegador para calcular los estilos de cada nodo.

## Cómo detectar CSS no utilizado

La pestaña Cobertura de Chrome DevTools puede ayudarlo a descubrir CSS crítico y no crítico. Consulte [Ver CSS usado y no usado con la pestaña Cobertura](https://developers.google.com/web/tools/chrome-devtools/css/reference#coverage) .

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="coverage.png" alt="Chrome DevTools: pestaña Cobertura"><figcaption class="w-figcaption"> Chrome DevTools: pestaña Cobertura.</figcaption></figure>

También puede extraer esta información de Puppeteer. Ver página de [cobertura](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagecoverage) .

## Insertar CSS crítico y diferir CSS no crítico

De manera similar al código en línea en una `<script>` , se requieren estilos críticos en línea para la primera pintura dentro de un `<style>` en el `head` de la página HTML. Luego, cargue el resto de los estilos de forma asincrónica utilizando el enlace de `preload`

Considere la posibilidad de automatizar el proceso de extracción e inserción de CSS "Above the Fold" utilizando la [herramienta Critical](https://github.com/addyosmani/critical/blob/master/README.md) .

Obtenga más información en [Aplazar CSS no crítico](/defer-non-critical-css) .

## Recursos

- [Código fuente para Eliminar auditoría **CSS no utilizada**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-css-rules.js)
