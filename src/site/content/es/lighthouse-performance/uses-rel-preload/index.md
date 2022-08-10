---
layout: post
title: Precargar consultas claves
description: |2-

  Obtenga más información sobre la auditoría de uses-rel-preload.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-rel-preload
---

La sección Oportunidades de su informe Lighthouse marca el tercer nivel de consultas en su cadena de consultas críticas como candidatos de precarga:

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fvwBQLvwfogd6ukq4vTZ.png", alt="Una captura de pantalla de la auditoría de precargar consultas claves de Lighthouse", width="800", height="214" %}</figure>

## Cómo las banderas de Lighthouse determinan los candidatos de precarga

Suponga que la [cadena de consultas críticas](/critical-request-chains) de su página tiene el siguiente aspecto:

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

Su archivo `index.html` declara `<script src="app.js">`. Cuando `app.js`, llama a `fetch()` para descargar `styles.css` y `ui.js` La página no aparece completa hasta que esos 2 últimos recursos sean descargados, analizados y ejecutados. Usando el ejemplo anterior, Lighthouse marcaría `styles.css` y `ui.js` como candidatos.

Los ahorros potenciales se basan en cuánto antes el navegador podría iniciar las consultas si declara los enlaces de precarga. Por ejemplo, si `app.js` tarda 200 ms en descargar, analizar y ejecutar, el ahorro potencial para cada recurso es de 200 ms, ya que `app.js` no causa un cuello de botella para cada una de las consultas.

Precargar las consultas puede hacer que sus páginas se carguen más rápido.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OiT1gArpZxNliikhBgx7.png", alt="Sin enlaces de precarga, styles.css y ui.js se consultan después de que app.js se haya descargado, analizado, y ejecutado.", width="800", height="486" %} <figcaption> Sin enlaces de precarga, <code>styles.css</code> y <code>ui.js</code> se consultan después de que <code>app.js</code> se haya descargado, analizado y ejecutado.</figcaption></figure>

El problema aquí es que el navegador solo se da cuenta de esos 2 últimos recursos después de descargar, analizar y ejecutar `app.js`. Pero sabe que esos recursos son importantes y deben descargarse lo antes posible.

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

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tJLJXH2qXcrDBUfsSAK5.png", alt="Con enlaces de precarga, styles.css y ui.js se solicitan al mismo tiempo que app.js.", width="800", height="478" %} <figcaption> Con los enlaces de precarga, <code>styles.css</code> y <code>ui.js</code> se solicitan al mismo tiempo que <code>app.js</code></figcaption></figure>

Consulte también [Precarga de archivos críticos para mejorar la velocidad de carga](/preload-critical-assets) para obtener más orientación.

### Compatibilidad del navegador

A partir de junio de 2020, la precarga es compatible con los navegadores basados en Chromium. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) para obtener actualizaciones.

### Compatibilidad con herramientas de compilación para precarga {: #tools }

Consulte la página de [Precargando archivos (Preloading Assets) de Tooling.Report](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload).

## Orientación de recursos tecnológicos específicos

### Angular

[Precargue las rutas](/route-preloading-in-angular/) con anticipación para acelerar la navegación.

### Magento

[Modifique el diseño de sus temas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) y agregue etiquetas `<link rel=preload>`

## Recursos

- [Código fuente para la auditoría de **Precargar consultas claves**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preload.js)
