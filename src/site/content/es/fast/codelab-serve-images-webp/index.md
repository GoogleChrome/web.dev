---
layout: codelab
title: Creación de imágenes WebP con la línea de comandos
authors:
  - katiehempenius
description: |2

  En este laboratorio de código, aprenda a servir imágenes optimizadas mediante WebP.
date: 2018-11-05
glitch: webp-cli
related_post: serve-images-webp
tags:
  - performance
---

La <a href="https://developers.google.com/speed/webp/docs/precompiled">herramienta de línea de comandos</a> webp ya se ha instalado, por lo que está listo para comenzar. Esta herramienta convierte imágenes JPG, PNG y TIFF a WebP.

## Convertir imágenes a WebP

{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}

1. Escriba el siguiente comando:

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

Este comando convierte, con una calidad de `50` (`0` es la peor; `100` es la mejor), el archivo `images/flower1.jpg` y lo guarda como `images/flower1.webp`.

{% Aside %} ¿Se pregunta por qué escribe `cwebp` lugar de `webp` ? WebP tiene dos comandos separados para codificar y decodificar imágenes WebP. `cwebp` codifica imágenes en WebP, mientras que `dwebp` decodifica imágenes de WebP. {% endAside %}

Después de hacer esto, debería ver algo como esto en la consola:

```bash
Saving file 'images/flower1.webp'
File:      images/flower1.jpg
Dimension: 504 x 378
Output:    29538 bytes Y-U-V-All-PSNR 34.57 36.57 36.12   35.09 dB
           (1.24 bpp)
block count:  intra4:        750  (97.66%)
              intra16:        18  (2.34%)
              skipped:         0  (0.00%)
bytes used:  header:            116  (0.4%)
             mode-partition:   4014  (13.6%)
 Residuals bytes  |segment 1|segment 2|segment 3|segment 4|  total
    macroblocks:  |      22%|      26%|      36%|      17%|     768
      quantizer:  |      52 |      42 |      33 |      24 |
   filter level:  |      16 |       9 |       6 |      26 |
```

Acaba de convertir correctamente la imagen a WebP.

Sin embargo, ejecutar el comando `cwebp` una imagen a la vez de esta forma, para convertir muchas imágenes, tomaría mucho tiempo. Si necesita hacer esto, puede usar un script en su lugar.

- Ejecute este script en la consola (no olvide las comillas invertidas):

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

Este script convierte, con una calidad de `50`, todos los archivos del directorio `images/` y los guarda como un archivo nuevo (mismo nombre de archivo, pero con una extensión de archivo `.webp`) en el mismo directorio.

### ✔︎ Revisión

Ahora debería tener 6 archivos en su directorio `images/`

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

A continuación, actualice este Glitch para ofrecer imágenes WebP a los navegadores que lo admitan.

## Añadir imágenes WebP usando la etiqueta `<picture>`

La etiqueta `<picture>` permite servir WebP a los navegadores más nuevos, mientras mantiene la compatibilidad con los navegadores más antiguos.

- En `index.html` reemplace `<img src="images/flower1.jpg"/>` con el siguiente HTML:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- A continuación, reemplace las etiquetas `<img>` por `flower2.jpg` y `flower3.png` con etiqueta `<picture>`.

### ✔︎ Revisión

Una vez completado, las etiquetas `<picture>` en `index.html` deberían verse así:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower2.webp">
  <source type="image/jpeg" srcset="images/flower2.jpg">
  <img src="images/flower2.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower3.webp">
  <source type="image/png" srcset="images/flower3.png">
  <img src="images/flower3.png">
</picture>
```

A continuación, use Lighthouse para verificar que haya implementado correctamente las imágenes WebP en el sitio.

## Verificar el uso de WebP con Lighthouse

La auditoría de rendimiento de Lighthouse **Servir imágenes en formatos de próxima generación**, puede permitirle saber si todas las imágenes de su sitio utilizan formatos de próxima generación como WebP.

{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}

1. Verifique que se apruebe la auditoría de **Servir imágenes en formatos de próxima generación.**

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="Auditoría 'Servir imágenes en formatos de próxima generación' de Lighthouse aprobada", width="701", height="651" %}

¡Éxito! Ahora está sirviendo imágenes WebP en su sitio.
