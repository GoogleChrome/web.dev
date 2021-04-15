---
layout: post
title: Precargar solicitudes de claves
description: Obtenga más información sobre la auditoría uses-rel-preload.
date: '2019-05-02'
updated: '2020-06-04'
web_lighthouse:
  - usa-rel-preload
---

La sección Oportunidades de su informe Lighthouse marca el tercer nivel de solicitudes en su cadena de solicitudes críticas como candidatos de precarga:

<figure class="w-figure"><img class="w-screenshot" src="uses-rel-preload.png" alt="Una captura de pantalla de la auditoría de solicitudes de claves de precarga de Lighthouse"></figure>

## Cómo las banderas de Lighthouse determinan los candidatos de precarga

Suponga que la [cadena de solicitudes críticas de](/critical-request-chains) su página tiene este aspecto:

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

Su archivo `index.html` `<script src="app.js">` . Cuando se `app.js` , llama a `fetch()` para descargar `styles.css` y `ui.js` La página no aparece completa hasta que esos 2 últimos recursos se descargan, analizan y ejecutan. Usando el ejemplo anterior, Lighthouse marcaría `styles.css` y `ui.js` como candidatos.

Los ahorros potenciales se basan en cuánto antes el navegador podría iniciar las solicitudes si declara los enlaces de precarga. Por ejemplo, si `app.js` tarda 200 ms en descargar, analizar y ejecutar, el ahorro potencial para cada recurso es de 200 ms, ya que `app.js` ya no es un cuello de botella para cada una de las solicitudes.

Las solicitudes de precarga pueden hacer que sus páginas se carguen más rápido.

<figure><img src="before.png" alt="Sin enlaces de precarga, styles.css y ui.js se solicitan solo después de &lt;span translate =" no=""> app.js ha sido descargado, analizado y ejecutado. "&gt;<figcaption> Sin enlaces de precarga, <code>styles.css</code> y <code>ui.js</code> se solicitan solo después de que <code>app.js</code> se haya descargado, analizado y ejecutado.</figcaption></figure>

El problema aquí es que el navegador solo se da cuenta de esos 2 últimos recursos después de descargar, analizar y ejecutar `app.js` Pero sabe que esos recursos son importantes y deben descargarse lo antes posible.

## Declare sus enlaces de precarga

Declare enlaces de precarga en su HTML para indicar al navegador que descargue los recursos clave lo antes posible.

```html
<head>
  ...
  <link rel="preload" href="styles.css" as="style">
  <link rel="preload" href="ui.js" as="script">
  ...
</head>
```

<figure><img src="after.png" alt="Con los enlaces de precarga, se solicitan styles.css y ui.js al mismo tiempo &lt;span translate =" no=""> como app.js. "&gt;<figcaption> Con los enlaces de precarga, <code>styles.css</code> y <code>ui.js</code> al mismo tiempo que <code>app.js</code></figcaption></figure>

Consulte también [Precarga de activos críticos para mejorar la velocidad de carga](/preload-critical-assets) para obtener más orientación.

### Compatibilidad del navegador

A partir de junio de 2020, la precarga es compatible con los navegadores basados en Chromium. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Browser_compatibility) para obtener actualizaciones.

### Compatibilidad con herramientas de compilación para precarga {: #tools}

Consulte la página de [activos de precarga de Tooling.Report.](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload)

## Recursos

- [Código fuente para la auditoría de **solicitudes de claves de precarga**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preload.js)
