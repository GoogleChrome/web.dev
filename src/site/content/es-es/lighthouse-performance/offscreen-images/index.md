---
layout: post
title: Aplazar imágenes fuera de pantalla
description: Obtenga más información sobre la auditoría de imágenes fuera de la pantalla.
date: '2019-05-02'
updated: '2020-05-29'
web_lighthouse:
  - imágenes fuera de pantalla
---

La sección Oportunidades de su informe Lighthouse enumera todas las imágenes ocultas o fuera de la pantalla en su página junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) . Considere la posibilidad de cargar de forma diferida estas imágenes después de que todos los recursos críticos hayan terminado de cargarse para reducir el [tiempo de interacción](/interactive) :

<figure class="w-figure"><img class="w-screenshot" src="offscreen-images.png" alt="Una captura de pantalla de la auditoría de imágenes fuera de pantalla de Lighthouse Aplazar"></figure>

Consulte también [Imágenes fuera de pantalla de carga diferida con laboratorio de código lazysizes](/codelab-use-lazysizes-to-lazyload-images) .

## Recursos

- [Código fuente para Aplazar la auditoría de **imágenes fuera de la pantalla**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/offscreen-images.js)
