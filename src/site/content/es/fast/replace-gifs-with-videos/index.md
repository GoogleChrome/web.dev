---
layout: post
title: Reemplace los GIF animados con video para cargas de página más rápidas
authors:
  - houssein
description: "¿Alguna vez ha visto un GIF animado en un servicio como Imgur o Gfycat, lo ha inspeccionado en sus herramientas de desarrollo, sólo para descubrir que ese GIF era realmente un vídeo? Hay una buena razón para ello. Los GIFs animados pueden ser realmente enormes. Si se convierten los GIFs grandes en vídeos, se puede ahorrar mucho ancho de banda a los usuarios."
date: 2018-11-05
updated: 2019-08-29
codelabs:
  - laboratorio-de-código-reemplazar-gifs-con-video
tags:
  - performance
feedback:
  - api
---

¿Alguna vez ha visto un GIF animado en un servicio como Imgur o Gfycat, lo inspeccionó en sus herramientas de desarrollo y descubrió que el GIF era realmente un video? Hay una buena razón para ello. Los GIF animados pueden ser francamente *enormes*.

{% Img src="image/admin/3UZ0b9dDotVIXWQT5Auk.png", alt="El panel de red de DevTools muestra un gif de 13.7 MB", width="800", height="155" %}

Afortunadamente, esta es una de esas áreas del rendimiento de carga en las que hacer un trabajo relativamente pequeño brinda grandes ganancias. **Al convertir GIF grandes en videos, puede ahorrarle mucho ancho de banda a los usuarios**.

## Mida primero

Use Lighthouse para verificar su sitio en busca de GIFs que se puedan convertir en videos. En DevTools, haga clic en la pestaña Auditorías y marque la casilla de verificación Rendimiento. Luego, ejecute Lighthouse y verifique el informe. Si tiene algún GIF que se pueda convertir, debería ver una sugerencia para "Usar formatos de video para contenido animado":

{% Img src="image/admin/KOSr9IivnkyaFk6RJ5u1.png", alt="Una auditoría de Lighthouse fallida, use formatos de video para contenido animado.", width="800", height="173" %}

## Cree videos MPEG

Hay varias formas de convertir GIF a video; **[FFmpeg](https://www.ffmpeg.org/)** es la herramienta utilizada en esta guía. Para usar FFmpeg para convertir el GIF, `my-animation.gif` en un video MP4, ejecute el siguiente comando en su consola:

```bash
ffmpeg -i my-animation.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

Esto le dice a FFmpeg que tome `my-animation.gif` como **entrada**, indicada por la bandera `-i` y que la convierta en un video llamado `my-animation.mp4`.

El codificador libx264 solo funciona con archivos que tienen dimensiones pares, como 320 px por 240 px. Si el GIF de entrada tiene dimensiones impares, puede incluir un filtro de recorte para evitar que FFmpeg arroje un error de 'altura/ancho no divisible por 2':

```bash
ffmpeg -i my-animation.gif -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

## Cree videos WebM

Mientras el formato MP4 existe desde 1999, WebM es un formato de archivo relativamente nuevo lanzado inicialmente en 2010. Los videos WebM son mucho más pequeños que los videos MP4, pero no todos los navegadores son compatibles con ellos, por lo que tiene sentido generar ambos.

Para usar FFmpeg para convertir `my-animation.gif` en un video WebM, ejecute el siguiente comando en su consola:

```bash
ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm
```

## Compare la diferencia

El ahorro de costos entre un GIF y un video puede ser bastante significativo.

{% Img src="image/admin/LWzvOWaOdMnNLTPWjayt.png", alt="La comparación del tamaño del archivo muestra 3.7 MB para el gif, 551 KB para el mp4 y 341 KB para el webm.", width="800", height="188" %}

En este ejemplo, el GIF inicial es de 3.7 MB, en comparación con la versión MP4, que tiene 551 KB, y la versión WebM, ¡que solo tiene 341 KB!

## Reemplace la imagen GIF con un video

Los GIF animados tienen tres características clave que un video debe recrear:

- Se reproducen automáticamente.
- Se repiten continuamente (normalmente, pero es posible evitarlo).
- No tienen sonido.

Afortunadamente, puede recrear estos comportamientos usando el elemento `<video>`

```bash
<video autoplay loop muted playsinline></video>
```

Un elemento `<video>` con estos atributos se reproduce automáticamente, se repite sin cesar, no reproduce audio y se reproduce en línea (es decir, no en pantalla completa), ¡todos los comportamientos característicos que se esperan de los GIF animados! 🎉

Finalmente, el elemento `<video>` requiere uno o más elementos hijo `<source>` apuntando a diferentes archivos de video entre los que el navegador puede elegir, dependiendo del formato de soporte del navegador. Ofrezca WebM y MP4, de modo que si un navegador no es compatible con WebM, puede recurrir a MP4.

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

{% Aside 'codelab' %} [Reemplace un GIF animado por un video](/codelab-replace-gifs-with-video). {% endAside %}

{% Aside %} Los navegadores no especulan sobre cuál `<source>` es óptimo, por lo que el orden de los `<source>` es importante. Por ejemplo, si primero especifica un video MP4 y el navegador es compatible con WebM, los navegadores omitirán WebM `<source>` y utilizarán MPEG-4 en su lugar. Si prefiere que se use un `<source>` WebM, ¡especifíquelo primero! {% endAside %}
