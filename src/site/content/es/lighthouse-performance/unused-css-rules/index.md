---
layout: post
title: Eliminar el CSS no utilizado
description: Obtén más información sobre la auditoría de unused-css-rules.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unused-css-rules
---

La sección Oportunidades de tu informe Lighthouse enumera todas las hojas de estilo con CSS no utilizado con un ahorro potencial de 2 KiB o más. Elimina el CSS no utilizado para reducir los bytes innecesarios consumidos por la actividad de la red:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m3WfvnCGJgrC5wqyvyyQ.png", alt="captura de pantalla de la auditoría de Eliminar el CSS no utilizado de Lighthouse", width="800", height="235" %}</figure>

## Cómo el CSS no utilizado ralentiza el rendimiento

Usar una etiqueta de `<link>` es una forma común de agregar estilos a una página:

```html
<!doctype html>
<html>
  <head>
    <link href="main.css" rel="stylesheet">
    ...
```

El `main.css` que descarga el navegador se conoce como hoja de estilo externa, porque se almacena por separado del HTML que lo usa.

De forma predeterminada, un navegador debe descargar, analizar y procesar todas las hojas de estilo externas que encuentra antes de poder mostrar o representar cualquier contenido en la pantalla de un usuario. No tendría sentido que un navegador intentara mostrar contenido antes de que se hayan procesado las hojas de estilo, porque las hojas de estilo pueden contener reglas que afecten el estilo de la página.

Cada hoja de estilo externa debe descargarse de la red. Estos viajes por la red adicionales pueden aumentar significativamente el tiempo que los usuarios deben esperar antes de ver cualquier contenido en sus pantallas.

El CSS no utilizado también ralentiza la construcción del [render tree (árbol de renderizaje)](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) por parte del navegador. El render tree es como el árbol de DOM, excepto que también incluye los estilos para cada nodo. Para construir el render tree, un navegador debe recorrer todo el árbol de DOM y verificar qué las reglas CSS se hayan aplicado a cada nodo. Cuanto más CSS no utilizado haya, más tiempo podría necesitar un navegador para calcular los estilos de cada nodo.

## Cómo detectar el CSS no utilizado {: #coverage }

La pestaña de Cobertura (Coverage) de Chrome DevTools puede ayudarte a descubrir el CSS crítico y no crítico. Consulta [Ver CSS usado y no usado en la pestaña de Cobertura](https://developer.chrome.com/docs/devtools/css/reference/#coverage).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ydgzuclRCAlY2nzrpDmk.png", alt="Chrome DevTools: pestaña de Cobertura", width="800", height="407" %} <figcaption> Chrome DevTools: pestaña de Cobertura.</figcaption></figure>

También puedes extraer esta información desde Puppeteer. Consulta [page.coverage](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagecoverage).

## CSS crítico en línea y aplazar CSS no crítico

Similar al código en línea en una etiqueta de`<script>`, se requieren estilos críticos en línea para la primera pintura dentro de un `<style>` en el `head` de la página HTML. Luego carga el resto de los estilos de forma asincrónica utilizando el enlace de `preload`.

Considera la posibilidad de automatizar el proceso de extracción e inserción de CSS "Above the Fold" utilizando la [Critical tool (Herramienta critica)](https://github.com/addyosmani/critical/blob/master/README.md).

Obten más información en [Aplazar CSS no crítico](/defer-non-critical-css).

## Orientación de recursos tecnológicos específicos

### Drupal

Considera eliminar las reglas CSS no utilizadas y solo adjunta las bibliotecas de Drupal necesarias a la página o componente relevante en una página. Consulta [Definición de una biblioteca](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library) para obtener más detalles.

### Joomla

Considera reducir o cambiar la cantidad de [extensiones de Joomla](https://extensions.joomla.org/) que cargan CSS y que no se usan en tu página.

### WordPress

Considera reducir o cambiar la cantidad de [complementos de WordPress que](https://wordpress.org/plugins/) cargan CSS y que no se usan en tu página.

## Recursos

- [Código fuente para la auditoria de **Eliminar el CSS no utilizado**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unused-css-rules.js)
