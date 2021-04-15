---
layout: post
title: Elimina los recursos que bloquean el renderizado
description: Obtenga más información sobre la auditoría de recursos de bloqueo de procesamiento.
date: '2019-05-02'
updated: '2020-08-11'
web_lighthouse:
  - render-bloqueo-recursos
---

La sección Oportunidades de su informe Lighthouse enumera todas las URL que bloquean la primera pintura de su página. El objetivo es reducir el impacto de estas URL que bloquean el procesamiento incorporando recursos críticos, aplazando los recursos no críticos y eliminando todo lo que no se utilice.

<figure class="w-figure"><img class="w-screenshot" src="blocking-resources.png" alt="Una captura de pantalla de la auditoría de recursos de Lighthouse Eliminate que bloquean el procesamiento"></figure>

## ¿Qué URL se marcan como recursos de bloqueo de procesamiento?

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca dos tipos de URL que bloquean el procesamiento: scripts y hojas de estilo.

Una `<script>` que:

- Está en el `<head>` del documento.
- No tiene un atributo `defer`
- No tiene un atributo `async`

Una `<link rel="stylesheet">` que:

- No tiene un atributo `disabled` Cuando este atributo está presente, el navegador no descarga la hoja de estilo.
- No tiene un `media` que coincida con el dispositivo del usuario.

## Cómo identificar recursos críticos

El primer paso para reducir el impacto de los recursos de bloqueo de procesamiento es identificar qué es crítico y qué no. Utilice la [pestaña Cobertura](https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage) en Chrome DevTools para identificar CSS y JS no críticos. Cuando carga o ejecuta una página, la pestaña le dice cuánto código se usó, en comparación con cuánto se cargó:

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="coverage.png" alt="Chrome DevTools: pestaña Cobertura"><figcaption class="w-figcaption"> Chrome DevTools: pestaña Cobertura.</figcaption></figure>

Puede reducir el tamaño de sus páginas enviando solo el código y los estilos que necesita. Haga clic en una URL para inspeccionar ese archivo en el panel Fuentes. Los estilos de los archivos CSS y el código de los archivos JavaScript están marcados en dos colores:

- **Verde (crítico):** estilos que se requieren para la primera pintura; código que es fundamental para la funcionalidad principal de la página.
- **Rojo (no crítico):** estilos que se aplican a contenido que no es visible de inmediato; código que no se utiliza en la funcionalidad principal de la página.

## Cómo eliminar los scripts que bloquean el procesamiento

Una vez que haya identificado el código crítico, mueva ese código de la URL de bloqueo de procesamiento a una `script` de comandos en línea en su página HTML. Cuando se cargue la página, tendrá lo que necesita para manejar la funcionalidad principal de la página.

Si hay un código en una URL de bloqueo de procesamiento que no es crítico, puede mantenerlo en la URL y luego marcar la URL con `async` o `defer` (consulte también [Agregar interactividad con JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript) ).

El código que no se está utilizando en absoluto debe eliminarse (consulte [Eliminar el código no utilizado](/remove-unused-code) ).

## Cómo eliminar las hojas de estilo que bloquean el procesamiento

De manera similar al código en línea en una `<script>` , se requieren estilos críticos en línea para la primera pintura dentro de un `<style>` en el `head` de la página HTML. A continuación, cargue el resto de los estilos de forma asincrónica mediante el enlace de `preload` [(consulte Aplazar CSS no utilizado](/defer-non-critical-css) ).

Considere la posibilidad de automatizar el proceso de extracción e inserción de CSS "Above the Fold" utilizando la [herramienta Critical](https://github.com/addyosmani/critical/blob/master/README.md) .

Otro enfoque para eliminar los estilos de bloqueo de renderizado es dividir esos estilos en diferentes archivos, organizados por consulta de medios. Luego, agregue un atributo de medios a cada enlace de la hoja de estilo. Al cargar una página, el navegador solo bloquea la primera pintura para recuperar las hojas de estilo que coinciden con el dispositivo del usuario (consulte [CSS de bloqueo de renderizado](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css) ).

Finalmente, querrá minimizar su CSS para eliminar cualquier espacio en blanco o caracteres adicionales (consulte [Minificar CSS](/minify-css) ). Esto asegura que está enviando el paquete más pequeño posible a sus usuarios.

## Recursos

- [Código fuente para eliminar la auditoría de **recursos que bloquean la representación**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/render-blocking-resources.js)
- [Reduzca las cargas útiles de JavaScript con la división de código](/reduce-javascript-payloads-with-code-splitting)
- [Eliminar codelab de código no utilizado](/codelab-remove-unused-code)
- [Optimización de inicio de JavaScript](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/)
