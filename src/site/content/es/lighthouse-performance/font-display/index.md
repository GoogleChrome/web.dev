---
layout: post
title: Asegúrese de que el texto permanece visible mientras carga la fuente web
description: Aprenda cómo utilizar la API de visualización de fuentes para asegurarse de que el texto de su página web siempre esté visible para sus usuarios.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - font-display
---

Con frecuencia, las fuentes son archivos grandes que tardan en cargarse. En algunos navegadores se oculta el texto hasta que se carga la fuente, lo que provoca un [destello de texto invisible (FOIT)](/avoid-invisible-text).

## Cómo falla la auditoría de visualización para fuentes de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) etiqueta cualquier fuente de una URL donde pueda destellar texto invisible:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/251Gbh9tn89GDJY289zZ.png", alt="Una captura de pantalla de Lighthouse. Asegúrese de que el texto permanece visible durante la auditoría de cargas para fuentes web", width="800", height="430" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo evitar que se muestre el texto invisible

El modo más sencillo de evitar que se visualice el texto invisible mientras se cargan las fuentes personalizadas es mostrar temporalmente una fuente del sistema. Incluyendo `font-display: swap` en el estilo de `@font-face`, puede evitar el FOIT en la mayoría de los navegadores modernos:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

En la [API de visualización de las fuentes](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) se especifica cómo se muestra una fuente. `swap` permite que el navegador muestre inmediatamente el texto que utiliza la fuente con una fuente del sistema. Una vez que la fuente personalizada está lista, reemplaza a la fuente del sistema. (Consulte la publicación [Evitar el texto invisible durante la carga](/avoid-invisible-text) para obtener más información).

### Precargar fuentes web

Utilice `<link rel="preload" as="font">` para recuperar los archivos de sus fuentes con antelación. Obtenga más información:

- [Precargue fuentes web para mejorar la velocidad de carga (codelab)](/codelab-preload-web-fonts/)<a></a>
- [Evite el cambio de diseño y los destellos de texto invisible (FOIT) mediante la precarga de fuentes opcionales](/preload-optional-fonts/)

### Fuentes de Google

Agregue el [parámetro](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL) `&display=swap` al final de la URL de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Compatibilidad con el navegador

Es importante mencionar que no todos los navegadores principales son compatibles con `font-display: swap`, por lo que es posible que necesite trabajar un poco más para solucionar el problema del texto invisible.

{% Aside 'codelab' %} Revise el [codelab para evitar el destello del texto invisible](/codelab-avoid-invisible-text) con el fin de conocer cómo evitar el FOIT en todos los navegadores. {% endAside %}

## Indicaciones específicas para cada categoría

### Drupal

Especifique `@font-display` cuando defina fuentes personalizadas en su tema.

### Magento

Especifique `@font-display` al [definir fuentes personalizadas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/using-fonts.html) .

## Recursos

- [Código fuente para **Asegurar que el texto permanezca visible durante la auditoría de carga para fuentes web**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [Evitar el texto invisible durante la carga](/avoid-invisible-text)
- [Controlar el rendimiento de las fuentes con visualizadores para fuentes](https://developers.google.com/web/updates/2016/02/font-display)
- [Precargar fuentes web para mejorar la velocidad de carga (codelab)](/codelab-preload-web-fonts/)<a></a>
- [Evitar el cambio de diseño y los destellos de texto invisible (FOIT) mediante la precarga de fuentes opcionales](/preload-optional-fonts/)
