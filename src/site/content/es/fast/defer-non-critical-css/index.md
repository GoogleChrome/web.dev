---
layout: post
title: Aplazar CSS no crítico
authors:
  - demianrenzulli
description: Aprenda a aplazar CSS no crítico con el objetivo de optimizar la ruta de renderización crítica y mejorar el FCP (primera pintura de contenido).
date: 2019-02-17
updated: 2020-06-12
tags:
  - performance
---

Los archivos CSS son [recursos que bloquean el renderizado](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources): deben cargarse y procesarse antes de que el navegador muestre la página. Las páginas web que contienen estilos de CSS innecesariamente grandes tardan más en procesarse.

En esta guía aprenderá cómo aplazar el CSS no crítico, con el objetivo de optimizar la [ruta de renderización crítica](/critical-rendering-path/) y mejorar la [First Contentful Paint o FCP (primer despliegue de contenido)](/fcp/).

## Cargar CSS de una manera deficiente

El siguiente ejemplo contiene un acordeón con tres párrafos de texto ocultos, cada uno con un estilo de diferente clase:

{% Glitch { id: 'defer-css-unoptimized', path: 'index.html'} %}

Esta página solicita un archivo CSS con ocho clases, pero no todas son necesarias para renderizar el contenido "visible".

El objetivo de esta guía es optimizar esta página, para que solo los **estilos críticos** se carguen simultáneamente, mientras que el resto (como los aplicados a los párrafos), se carguen sin bloquear el renderizado.

## Métrica

Ejecute [Lighthouse](/discover-performance-opportunities-with-lighthouse/#run-lighthouse-from-chrome-devtools) en [la página](https://defer-css-unoptimized.glitch.me/) y vaya a la sección **Rendimiento.**

El informe muestra la métrica **First Contentful Paint** con un valor de "1s" y la oportunidad **Eliminar recursos que bloquean el renderizado**, apuntando al archivo **style.css**:

<figure>{% Img src="image/admin/eZtuQ2IwL3Mtnmz09bmp.png", alt="Informe Lighthouse para página no optimizada, que muestra FCP de '1s' y la opción 'Eliminar recursos de bloqueo' en la sección 'Oportunidades'", width="800", height="640" %}</figure>

{% Aside %} El CSS que usamos para este sitio de demostración es bastante pequeño. Si usted solicitaba archivos CSS más grandes (algo frecuente en escenarios de producción), y si Lighthouse detecta que una página tiene al menos 2048 bytes de reglas CSS que no se usaron al renderizar el contenido **superior**, también recibirá una sugerencia llamada **Eliminar CSS no utilizado**. {% endAside %}

Para visualizar cómo este CSS bloquea el renderizado:

1. Abra [la página](https://defer-css-unoptimized.glitch.me/) en Chrome.
{% Instruction 'devtools-performance', 'ol' %}
1. En el panel Rendimiento, haga clic en **Actualizar**.

En el seguimiento resultante, verá que el marcador **FCP** se coloca inmediatamente después de que el CSS termina de cargarse:

<figure>{% Img src="image/admin/WhpaDYb98Rf03JmuPenp.png", alt="Seguimiento de rendimiento de DevTools para página no optimizada, mostrando FCP comenzando después de cargar el CSS", width="800", height="352" %}</figure>

Esto significa que el navegador debe esperar a que todo el CSS se cargue y procese antes de pintar un solo píxel en la pantalla.

## Optimizar

Para optimizar esta página, necesita saber qué clases se consideran "críticas". Utilizará la [herramienta de cobertura](https://developer.chrome.com/docs/devtools/css/reference/#coverage) para eso:

1. En DevTools, abra el [menú de comandos](https://developer.chrome.com/docs/devtools/command-menu/) presionando `Control+Shift+P` o `Command+Shift+P` (Mac).
2. Escriba "Cobertura" y seleccione **Mostrar cobertura**.
3. Haga clic en el botón **Actualizar** para volver a cargar la página y comenzar a capturar la cobertura.

<figure>{% Img src="image/admin/JTFK7wjhlTzd2cCfkpps.png", alt="Cobertura del archivo CSS, que muestra 55,9% de bytes no utilizados", width="800", height="82" %}</figure>

Haga doble clic en el informe para ver las clases marcadas en dos colores:

- Verde (**crítico**): estas son las clases que el navegador necesita para renderizar el contenido visible (como los botones de título, subtítulo y acordeón).
- Rojo (**no crítico**): estos estilos se aplican al contenido que no es visible inmediatamente (como los párrafos dentro de los acordeones).

Optimice su CSS con esta información para que el navegador comience a procesar los estilos críticos inmediatamente después de que se cargue la página, mientras pospone el CSS no crítico para más adelante:

- Extraiga las definiciones de clase marcadas con verde en el informe obtenido de la herramienta de cobertura y colóquelas dentro de un `<style>` en el encabezado de la página:

```html
<style type="text/css">
.accordion-btn {background-color: #ADD8E6;color: #444;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;transition: 0.4s;}.container {padding: 0 18px;display: none;background-color: white;overflow: hidden;}h1 {word-spacing: 5px;color: blue;font-weight: bold;text-align: center;}
</style>
```

- A continuación, cargue el resto de las clases de forma asincrónica, aplicando el siguiente patrón:

```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

Esta no es la forma estándar de cargar CSS. Así es como funciona:

- `link rel="preload" as="style"` solicita la hoja de estilo de forma asincrónica. Puede obtener más información sobre el atributo `preload` en la [Guía de activos críticos de precarga](/preload-critical-assets).
- El atributo `onload` en `link` permite que el CSS se procese cuando termine de cargarse.
- "null" en el controlador `onload`, una vez que se haya utilizado, ayuda a algunos navegadores a evitar volver a llamar al controlador al cambiar el atributo rel.
- La referencia a la hoja de estilo dentro de un elemento `noscript` funciona como una alternativa para los navegadores que no ejecutan JavaScript.

{% Aside %} En esta guía, utilizó código básico para implementar esta optimización. En un escenario de producción real, es una buena práctica utilizar funciones como [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md), que pueden encapsular este comportamiento y funcionar bien en todos los navegadores. {% endAside %}

La [página resultante](https://defer-css-optimized.glitch.me/) se ve exactamente como la versión anterior, incluso cuando la mayoría de los estilos se cargan de forma asincrónica. Así es como se ven los estilos en línea y la solicitud asincrónica al archivo CSS en el archivo HTML:

<!-- Copy and Paste Me -->

{% Glitch { id: 'defer-css-optimized', path: 'index.html', previewSize: 0 } %}

## Monitor

Utilice DevTools para ejecutar otro seguimiento de **rendimiento** [en la página optimizada](https://defer-css-optimized.glitch.me/).

El marcador **FCP** aparece antes de que la página solicite el CSS, lo que significa que el navegador no necesita esperar a que se cargue el CSS antes de renderizar la página:

<figure>{% Img src ="image/admin/0mVq3q760y37JSn2MmCP.png", alt="Seguimiento de rendimiento de DevTools para una página no optimizada, que muestra el inicio de FCP antes de que se cargue el CSS", width="800", height="389", class="w -captura de pantalla" %}</figure>

Como paso final, ejecute Lighthouse en la página optimizada.

En el informe, verá que la página FCP se ha reducido en **0,2 s** (¡una mejora del 20%!):

<figure>{% Img src="image/admin/oTDQFSlfQwS9SbqE0D0K.png", alt="Informe Lighthouse, que muestra un valor de FCP de '0.8s'.", width="800", height="324" %}</figure>

La sugerencia **Eliminar recursos que bloquean el renderizado** ya no se encuentra en **Oportunidades** y ahora pertenece a la sección **Auditorías aprobadas**:

<figure>{% Img src="image/admin/yDjEvZAcjPouC6I3I7qB.png", alt="Informe Lighthouse que muestra la sugerencia 'Eliminar recursos de bloqueo' en la sección 'Auditorías aprobadas'.", width="800", height="237" %}</figure>

## Próximos pasos y referencias

En esta guía, aprendió cómo aplazar el CSS no crítico extrayendo manualmente el código no utilizado en la página. Además, la [guía de extracción de CSS crítico](/extract-critical-css/) cubre algunas de las herramientas más populares para extraer CSS crítico, e incluye [un codelab](/codelab-extract-and-inline-critical-css/) para ver cómo funciona en la práctica.
