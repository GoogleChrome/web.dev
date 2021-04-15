---
layout: post
title: Utilice formatos de video para contenido animado
description: Obtenga más información sobre la auditoría de contenido animado eficiente.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - contenido-animado-eficiente
---

La sección Oportunidades de su informe Lighthouse enumera todos los GIF animados, junto con los ahorros estimados en segundos logrados al convertir estos GIF en video:

<figure class="w-figure"><img class="w-screenshot" src="efficient-animated-content.png" alt="Una captura de pantalla de los formatos de video Lighthouse Use para la auditoría de contenido animado"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Por qué debería reemplazar los GIF animados con video

Los GIF grandes son ineficaces para entregar contenido animado. Al convertir GIF grandes en videos, puede ahorrar mucho en el ancho de banda de los usuarios. Considere usar videos MPEG4 / WebM para animaciones y PNG / WebP para imágenes estáticas en lugar de GIF para ahorrar bytes de red.

## Crea videos MPEG

Hay varias formas de convertir GIF en video. [FFmpeg](https://ffmpeg.org/) es la herramienta utilizada en esta guía. Para usar FFmpeg para convertir el GIF, `my-animation.gif` en un video MP4, ejecute el siguiente comando en su consola:

`ffmpeg -i my-animation.gif my-animation.mp4`

Esto le dice a FFmpeg que tome `my-animation.gif` como entrada, indicada por la `-i` , y que la convierta en un video llamado `my-animation.mp4` .

## Crear videos de WebM

Los videos WebM son mucho más pequeños que los videos MP4, pero no todos los navegadores son compatibles con WebM, por lo que tiene sentido generar ambos.

Para usar FFmpeg para convertir `my-animation.gif` en un video de WebM, ejecute el siguiente comando en su consola:

`ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm`

## Reemplazar la imagen GIF con un video

Los GIF animados tienen tres características clave que un video debe reproducir:

- Juegan automáticamente.
- Se repiten continuamente (normalmente, pero es posible evitarlos).
- Están en silencio.

Afortunadamente, puede recrear estos comportamientos usando el elemento `<video>`

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

## Recursos

- [Código fuente para **usar formatos de video para** auditoría de contenido animado](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/efficient-animated-content.js)
- [Reemplace los GIF animados con video para cargas de página más rápidas](/replace-gifs-with-videos)
- [Reemplazar GIF con codelab de video](/codelab-replace-gifs-with-video)
