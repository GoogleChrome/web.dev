---
layout: post
title: Minificar JavaScript
description: Obtenga más información sobre la auditoría de JavaScript no minimizado.
date: '2019-05-02'
updated: 20/06/2020
web_lighthouse:
  - unminified-javascript
---

La minimización de archivos JavaScript puede reducir el tamaño de la carga útil y el tiempo de análisis del script. La sección Oportunidades de su informe Lighthouse enumera todos los archivos JavaScript no minificados, junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) cuando estos archivos se minifican:

<figure class="w-figure"><img class="w-screenshot" src="unminified-javascript.png" alt="Una captura de pantalla de la auditoría de JavaScript de Lighthouse Minify"></figure>

## Cómo minimizar sus archivos JavaScript

La minificación es el proceso de eliminar los espacios en blanco y cualquier código que no sea necesario para crear un archivo de código más pequeño pero perfectamente válido. [Terser](https://github.com/terser-js/terser) es una popular herramienta de compresión de JavaScript. webpack v4 incluye un complemento para esta biblioteca de forma predeterminada para crear archivos de compilación minificados.

## Recursos

- [Código fuente para la auditoría de **Minify JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-javascript.js)
