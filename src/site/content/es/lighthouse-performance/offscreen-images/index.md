---
layout: post
title: Aplazar imágenes fuera de pantalla
description: |2

  Obtenga más información sobre la auditoría de imágenes fuera de la pantalla.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - offscreen-images
---

La sección de Oportunidades del informe Lighthouse enumera todas las imágenes ocultas o fuera de la pantalla en tu página junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Considera la posibilidad de cargar de forma diferida estas imágenes después de que todos los recursos críticos hayan terminado de cargarse para reducir el [Time to Interactive (TTI): Tiempo para interactuar](/tti/):

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/agMyJtIarLruD8iuz0Mt.png", alt="Una captura de pantalla de la auditoría de aplazar imágenes fuera de pantalla de Lighthouse", width="800", height="416" %}</figure>

Consulta también [Carga diferida de imágenes fuera de pantalla con lazysizes codelab](/codelab-use-lazysizes-to-lazyload-images).

## Orientación de recursos tecnológicos específicos

### AMP

De manera automática carga imágenes diferidas con [`amp-img`](https://amp.dev/documentation/components/amp-img/). Consulta la guía de [Imágenes](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/#images).

### Drupal

Instala [un módulo de Drupal](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A67&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=%22lazy+load%22&solrsort=iss_project_release_usage+desc&op=Search) que pueda cargar imágenes de forma diferida. Dichos módulos brindan la capacidad de diferir cualquier imagen fuera de la pantalla para mejorar el rendimiento.

### Joomla

Instala un [complemento de Joomla de carga diferida](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading) que brinde la capacidad de diferir cualquier imagen fuera de la pantalla, o cambiar a una plantilla que brinde esa funcionalidad. A partir de Joomla 4.0, se puede habilitar un complemento dedicado de carga diferida mediante el complemento "Contenido - Cargando imágenes de manera diferida". También considera usar [un complemento AMP](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=amp).

### Magento

Considera modificar las plantillas de tu producto y catálogo para hacer uso de la función de [carga diferida](/browser-level-image-lazy-loading/) de la plataforma web.

### WordPress

Instala un [complemento de WordPress de carga diferida](https://wordpress.org/plugins/search/lazy+load/) que brinde la capacidad de diferir cualquier imagen fuera de la pantalla o cambiar a un tema que brinde esa funcionalidad. También considera usar [el complemento AMP](https://wordpress.org/plugins/amp/).

## Recursos

- [Código fuente para la auditoría de **Aplazar  imágenes fuera de la pantalla**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/offscreen-images.js)
