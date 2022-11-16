---
layout: post
title: Codifique imágenes de manera eficiente
description: Obtenga más información sobre la auditoría de uso de imágenes optimizadas.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

La sección Oportunidades de su informe Lighthouse enumera todas las imágenes no optimizadas, con ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Optimice estas imágenes para que la página se cargue más rápido y consuma menos datos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Una captura de pantalla de la auditoría Lighthouse Codificación eficiente de imágenes", width="800", height="263" %}</figure>

## De qué manera marca Lighthouse las imágenes como optimizables

Lighthouse recopila todas las imágenes JPEG o BMP de la página, establece el nivel de compresión de cada imagen en 85 y luego compara la versión original con la versión comprimida. Si los ahorros potenciales son de 4 KB o más, Lighthouse marca la imagen como optimizable.

## Cómo optimizar imágenes

Hay muchos pasos que puede seguir para optimizar sus imágenes, incluyendo:

- [Usar CDN de imágenes](/image-cdns/)
- [Comprimir imágenes](/use-imagemin-to-compress-images)
- [Reemplazar de GIF animados con video](/replace-gifs-with-videos)
- [Carga diferida de imágenes](/use-lazysizes-to-lazyload-images)
- [Servir imágenes receptivas](/serve-responsive-images)
- [Servir imágenes con las dimensiones correctas](/serve-images-with-correct-dimensions)
- [Usar imágenes WebP](/serve-images-webp)

## Optimizar imágenes usando herramientas GUI

Otro enfoque es ejecutar sus imágenes a través de un optimizador que instale en su computadora y ejecute como una GUI. Por ejemplo, con [ImageOptim](https://imageoptim.com/mac), puede arrastrar y soltar imágenes en su interfaz de usuario, y después se comprimen automáticamente sin comprometer la calidad de manera notable. Si maneja un sitio pequeño y puede manejar la optimización manual de todas las imágenes, es probable que esta opción sea lo suficientemente buena.

[Squoosh](https://squoosh.app/) es otra opción. Squoosh es mantenido por el equipo de Google Web DevRel.

## Orientación específica de la pila

### Drupal

Considere la posibilidad de utilizar [un módulo](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search) que optimice y reduzca automáticamente el tamaño de las imágenes cargadas a través del sitio mientras conserva la calidad. Además, asegúrese de utilizar los [estilos de imagen receptiva](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) integrados en Drupal, (disponibles en Drupal 8 y versiones posteriores) para todas las imágenes renderizadas en el sitio.

### Joomla

Considere la posibilidad de utilizar un [complemento de optimización de imágenes](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) que comprima sus imágenes sin perder la calidad.

### Magento

Considere usar una [extensión Magento de terceros que optimice las imágenes](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image).

### WordPress

Considere usar un [complemento de WordPress para optimización de imágenes](https://wordpress.org/plugins/search/optimize+images/) que comprima sus imágenes sin perder calidad.

## Recursos

- [Código fuente para la auditoría de **Codificación eficiente de imágenes**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
