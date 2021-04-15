---
layout: post
title: Codifique imágenes de manera eficiente
description: Obtenga más información sobre la auditoría de usos-optimizados-imágenes.
date: '2019-05-02'
updated: 20/06/2020
web_lighthouse:
  - utiliza-imágenes-optimizadas
---

La sección Oportunidades de su informe Lighthouse enumera todas las imágenes no optimizadas, con ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) . Optimice estas imágenes para que la página se cargue más rápido y consuma menos datos:

<figure class="w-figure"><img class="w-screenshot" src="uses-optimized-images.png" alt="Una captura de pantalla de la auditoría de codificación eficiente de imágenes de Lighthouse"></figure>

## Cómo Lighthouse marca las imágenes como optimizables

Lighthouse recopila todas las imágenes JPEG o BMP de la página, establece el nivel de compresión de cada imagen en 85 y luego compara la versión original con la versión comprimida. Si los ahorros potenciales son de 4 KB o más, Lighthouse marca la imagen como optimizable.

## Cómo optimizar imágenes

Hay muchos pasos que puede seguir para optimizar sus imágenes, que incluyen:

- [Uso de CDN de imágenes](/image-cdns/)
- [Comprimir imágenes](/use-imagemin-to-compress-images)
- [Reemplazo de GIF animados con video](/replace-gifs-with-videos)
- [Imágenes de lazy loading](/use-lazysizes-to-lazyload-images)
- [Sirviendo imágenes receptivas](/serve-responsive-images)
- [Sirviendo imágenes con las dimensiones correctas](/serve-images-with-correct-dimensions)
- [Usar imágenes WebP](/serve-images-webp)

## Optimiza imágenes usando herramientas GUI

Otro enfoque es ejecutar sus imágenes a través de un optimizador que instala en su computadora y ejecuta como una GUI. Por ejemplo, con [ImageOptim](https://imageoptim.com/mac) , arrastra y suelta imágenes en su interfaz de usuario, y luego comprime automáticamente las imágenes sin comprometer la calidad de manera notable. Si está ejecutando un sitio pequeño y puede manejar la optimización manual de todas las imágenes, esta opción probablemente sea lo suficientemente buena.

[Squoosh](https://squoosh.app/) es otra opción. Squoosh es mantenido por el equipo de Google Web DevRel.

## Recursos

- [Código fuente para la auditoría de **codificación eficiente de imágenes**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-optimized-images.js)
