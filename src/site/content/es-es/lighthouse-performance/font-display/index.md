---
layout: post
title: Asegúrese de que el texto permanezca visible durante la carga de la fuente web
description: Aprenda a usar la API de visualización de fuentes para asegurarse de que el texto de su página web siempre sea visible para sus usuarios.
date: '2019-05-02'
updated: '2020-04-29'
web_lighthouse:
  - fuente-pantalla
---

Las fuentes suelen ser archivos de gran tamaño que tardan un poco en cargarse. Algunos navegadores ocultan el texto hasta que se carga la fuente, lo que provoca un [destello de texto invisible (FOIT)](/avoid-invisible-text) .

## Cómo falla la auditoría de visualización de fuentes de Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca cualquier URL de fuente que pueda mostrar texto invisible:

<figure class="w-figure"><img class="w-screenshot" src="font-display.png" alt="Una captura de pantalla del texto Lighthouse Asegúrese de que permanezca visible durante la auditoría de cargas de fuentes web"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo evitar mostrar texto invisible

La forma más fácil de evitar mostrar texto invisible mientras se cargan fuentes personalizadas es mostrar temporalmente una fuente del sistema. Al incluir `font-display: swap` en su estilo `@font-face` , puede evitar FOIT en la mayoría de los navegadores modernos:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

La [API de visualización de fuentes](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) especifica cómo se muestra una fuente. `swap` le dice al navegador que el texto que usa la fuente debe mostrarse inmediatamente usando una fuente del sistema. Una vez que la fuente personalizada está lista, reemplaza la fuente del sistema. (Consulte la [publicación Evitar texto invisible durante la carga](/avoid-invisible-text) para obtener más información).

### Precargar fuentes web

Utilice `<link rel="preload">` para recuperar sus archivos de fuentes antes. Aprende más:

- [Precargar fuentes web para mejorar la velocidad de carga (codelab)](/codelab-preload-web-fonts/)
- [Evite el cambio de diseño y los flashes de texto invisible (FOIT) mediante la precarga de fuentes opcionales](/preload-optional-fonts/)

### Fuentes de Google

Agregue el [parámetro](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL) `&display=swap` al final de su URL de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Soporte del navegador

Vale la pena mencionar que no todos los navegadores principales admiten `font-display: swap` , por lo que es posible que deba trabajar un poco más para solucionar el problema del texto invisible.

{% Aside 'codelab' %} Consulte el laboratorio de código [Evitar el destello de texto invisible](/codelab-avoid-invisible-text) para aprender cómo evitar FOIT en todos los navegadores. {% endAside %}

## Recursos

- [Código fuente para **Asegúrese de que el texto permanezca visible durante la** auditoría de carga de fuentes web](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [Evite el texto invisible durante la carga](/avoid-invisible-text)
- [Controlar el rendimiento de la fuente con visualización de fuentes](https://developers.google.com/web/updates/2016/02/font-display)
- [Precargar fuentes web para mejorar la velocidad de carga (codelab)](/codelab-preload-web-fonts/)
- [Evite el cambio de diseño y los flashes de texto invisible (FOIT) mediante la precarga de fuentes opcionales](/preload-optional-fonts/)
