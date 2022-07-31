---
layout: post
title: Minificación de JavaScript
description: |2-

  Obtenga más información sobre la auditoría de JavaScript unminified-javascript.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - unminified-javascript
---

La minificación de archivos JavaScript puede reducir el tamaño de carga útil y el tiempo de análisis del script. La sección Oportunidades de su informe de Lighthouse enumera todos los archivos JavaScript no minificados, junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) cuando estos archivos se minifican:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aHumzRfDrBcuplUDCnvf.png", alt="Una captura de pantalla de la auditoría de JavaScript, Lighthouse Minify", width="800", height="212" %}</figure>

## Cómo minificar sus archivos JavaScript

La minificación es el proceso de eliminar los espacios en blanco y cualquier código que no sea necesario para crear un archivo de código más pequeño pero perfectamente válido. [Terser](https://github.com/terser-js/terser) es una popular herramienta de compresión de JavaScript. webpack v4 incluye un complemento para esta biblioteca de forma predeterminada para crear archivos de compilación minificados.

## Orientación específica de la pila

### Drupal

Asegúrese de habilitar **Aggregate JavaScript files** en la **Administration**.

> **Configuración** > Página de **desarrollo.** También puede configurar opciones de agregación más avanzadas a través de [módulos adicionales](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=javascript+aggregation&solrsort=iss_project_release_usage+desc&op=Search) para acelerar su sitio concatenando, minimizando y comprimiendo sus activos de JavaScript.

### Joomla

Varias [extensiones](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) de Joomla pueden acelerar su sitio concatenando, minimizando y comprimiendo sus scripts. También existen plantillas que brindan esta funcionalidad.

### Magento

Use [Terser](https://www.npmjs.com/package/terser) para minimizar todos los activos de JavaScript de la implementación de contenido estático y deshabilite la función de minificación incorporada.

### Reaccionar

Si su sistema de compilación minimiza los archivos JS automáticamente, asegúrese de que está implementando la [compilación](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) de producción de su aplicación. Puede verificar esto con la extensión React Developer Tools.

### WordPress

Varios [complementos](https://wordpress.org/plugins/search/minify+javascript/) de WordPress pueden acelerar su sitio al concatenar, minificar y comprimir sus scripts. También es posible que desee utilizar un proceso de construcción para hacer esta minificación por adelantado si es posible.

## Recursos

- [Código fuente para la auditorí **Minify JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unminified-javascript.js)
