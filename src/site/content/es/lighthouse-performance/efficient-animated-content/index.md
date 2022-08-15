---
layout: post
title: Usar formatos de video para contenido animado
description: |2

  Obtenga más información sobre la auditoría de contenido animado eficiente.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - efficient-animated-content
---

La sección Oportunidades de su informe Lighthouse enumera todos los GIF animados, junto con los ahorros estimados de segundos obtenidos al convertir estos GIF en video:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MTfWMspCIMjREn2rpwlG.png", alt="Una captura de pantalla de la auditoría de Lighthouse 'Usar formatos de video para contenido animado'", width="800", height="235" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Por qué debería reemplazar los GIF animados con video

Los GIF grandes son ineficaces para entregar contenido animado. Al convertir GIF grandes en videos, puede ahorrar mucho en el ancho de banda de los usuarios. Considere usar videos MPEG4/WebM para animaciones y PNG/WebP para imágenes estáticas en lugar de GIF para ahorrar bytes de red.

## Crea videos MPEG

Hay varias formas de convertir GIF en video. [FFmpeg](https://ffmpeg.org/) es la herramienta utilizada en esta guía. Para convertir el GIF, `my-animation.gif` en un video MP4 mediante FFmpeg, ejecute el siguiente comando en su consola:

`ffmpeg -i my-animation.gif my-animation.mp4`

Esto le dice a FFmpeg que tome `my-animation.gif` como una entrada, indicada por la `-i`, y que la convierta en un video llamado `my-animation.mp4`.

## Crear videos WebM

Los videos WebM son mucho más pequeños que los videos MP4, pero no todos los navegadores son compatibles con WebM, por lo que tiene sentido generar ambos.

Para convertir `my-animation.gif` en un video WebM mediante FFmpeg, ejecute el siguiente comando en su consola:

`ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm`

## Reemplazar la imagen GIF con un video

Los GIF animados tienen tres características clave que un video debe imitar:

- Se reproducen automáticamente.
- Se repiten de forma continua (normalmente, pero es posible evitarlo).
- Están en silencio.

Afortunadamente, puede recrear estos comportamientos usando el elemento `<video>`.

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

## Utilizar un servicio que convierta GIF en videos HTML5

Muchas [CDN de imágenes admiten](/image-cdns/) la conversión de video GIF a HTML5. Se sube un GIF a la CDN de imágenes, y esta devuelve un video HTML5.

## Orientación específica de la pila

### AMP

Para contenido animado, use [`amp-anim`](https://amp.dev/documentation/components/amp-anim/) para minimizar el uso del CPU cuando el contenido esté fuera de la pantalla.

## Recursos

- [Código fuente para la auditoría **Usar formatos de video para contenido animado**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/efficient-animated-content.js)
- [Reemplazar los GIF animados con video para cargas de página más rápidas](/replace-gifs-with-videos)
- [Laboratorio de código para reemplazar GIF con video](/codelab-replace-gifs-with-video)
