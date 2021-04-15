---
layout: post
title: Imágenes de tamaño adecuado
description: Obtenga más información sobre la auditoría de usos-imágenes-receptivas.
date: '2019-05-02'
updated: 20/06/2020
web_lighthouse:
  - utiliza imágenes sensibles
---

La sección Oportunidades de su informe Lighthouse enumera todas las imágenes de su página que no tienen el tamaño adecuado, junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) . Cambie el tamaño de estas imágenes para guardar datos y mejorar el tiempo de carga de la página:

<figure class="w-figure"><img class="w-screenshot" src="uses-responsive-images.png" alt="Una captura de pantalla de la auditoría de imágenes de tamaño adecuado de Lighthouse"></figure>

## Cómo Lighthouse calcula imágenes de gran tamaño

Para cada imagen de la página, Lighthouse compara el tamaño de la imagen renderizada con el tamaño de la imagen real. El tamaño renderizado también tiene en cuenta la proporción de píxeles del dispositivo. Si el tamaño renderizado es al menos 4 KB más pequeño que el tamaño real, la imagen no pasa la auditoría.

## Estrategias para dimensionar correctamente las imágenes

Idealmente, su página nunca debería mostrar imágenes que sean más grandes que la versión que se muestra en la pantalla del usuario. Cualquier cosa más grande que eso solo da como resultado bytes desperdiciados y ralentiza el tiempo de carga de la página.

La estrategia principal para servir imágenes de tamaño apropiado se llama "imágenes receptivas". Con las imágenes receptivas, genera varias versiones de cada imagen y luego especifica qué versión usar en su HTML o CSS mediante consultas de medios, dimensiones de la ventana gráfica, etc. Consulte [Publicar imágenes receptivas](/serve-responsive-images) para obtener más información.

[Las CDN de imágenes](/image-cdns/) son otra estrategia principal para ofrecer imágenes de tamaño adecuado. Puede pensar en CDN de imágenes como API de servicios web para transformar imágenes.

Otra estrategia es utilizar formatos de imagen basados en vectores, como SVG. Con una cantidad finita de código, una imagen SVG puede escalar a cualquier tamaño. Consulte [Reemplazar íconos complejos con SVG](https://developers.google.com/web/fundamentals/design-and-ux/responsive/images#replace_complex_icons_with_svg) para obtener más información.

Herramientas como [gulp-responsive](https://www.npmjs.com/package/gulp-responsive) o [responsive-images-generator](https://www.npmjs.com/package/responsive-images-generator) pueden ayudar a automatizar el proceso de conversión de una imagen en múltiples formatos. También hay CDN de imágenes que te permiten generar múltiples versiones, ya sea cuando subes una imagen o la solicitas desde tu página.

## Recursos

- [Código fuente para la auditoría de **imágenes de tamaño adecuado**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-responsive-images.js)
- [Sirve imágenes con las dimensiones correctas](/serve-images-with-correct-dimensions)
