---
layout: post
title: Sirve imágenes en formatos de próxima generación
description: Obtenga más información sobre la auditoría de uses-webp-images.
date: '2019-05-02'
updated: '2020-05-29'
codelabs:
  - codelab-serve-images-webp
web_lighthouse:
  - utiliza-webp-imágenes
---

La sección Oportunidades de su informe Lighthouse enumera todas las imágenes en formatos de imagen más antiguos, mostrando los ahorros potenciales obtenidos al ofrecer versiones WebP de esas imágenes:

<figure class="w-figure"><img class="w-screenshot" src="uses-webp-images.png" alt="Una captura de pantalla de las imágenes de Lighthouse Serve en la auditoría de formatos de próxima generación"></figure>

## Por qué servir imágenes en formato WebP

JPEG 2000, JPEG XR y WebP son formatos de imagen que tienen características de calidad y compresión superiores en comparación con sus contrapartes JPEG y PNG anteriores. Codificar sus imágenes en estos formatos en lugar de JPEG o PNG significa que se cargarán más rápido y consumirán menos datos móviles.

WebP es compatible con Chrome y Opera y proporciona una mejor compresión con pérdida y sin pérdida de imágenes en la web. Consulte [Un nuevo formato de imagen para la Web](https://developers.google.com/speed/webp/) para obtener más información sobre WebP.

{% Aside 'codelab' %} [Cree imágenes WebP con la línea de comandos](/codelab-serve-images-webp) {% endAside %}

## Cómo Lighthouse calcula los ahorros potenciales

Lighthouse recopila cada imagen BMP, JPEG y PNG en la página y luego las convierte a WebP, informando los ahorros potenciales según las cifras de conversión.

{% Aside 'note' %} Lighthouse omite la imagen de su informe si los ahorros potenciales son inferiores a 8 KB. {% endAside %}

## Compatibilidad del navegador

La compatibilidad con el navegador no es universal para WebP, pero la mayoría de los principales navegadores deberían ofrecer ahorros similares en un formato alternativo de próxima generación. Deberá proporcionar una imagen PNG o JPEG de respaldo para la compatibilidad con otros navegadores. Consulte [¿Cómo puedo detectar la compatibilidad del navegador con WebP?](https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp) para obtener una descripción general de las técnicas de respaldo y la lista a continuación para la compatibilidad con los formatos de imagen del navegador.

Para ver la compatibilidad actual del navegador para cada formato de próxima generación, consulte las entradas a continuación:

- [WebP](https://caniuse.com/#feat=webp)
- [JPEG 2000](https://caniuse.com/#feat=jpeg2000)
- [JPEG XR](https://caniuse.com/#feat=jpegxr)

## Recursos

- [Auditoría de código fuente para **publicar imágenes en formatos de próxima generación**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-webp-images.js)
- [Usar imágenes WebP](/serve-images-webp)

<!-- https://www.reddit.com/r/webdev/comments/gspjwe/serve_images_in_nextgen_formats/ -->
