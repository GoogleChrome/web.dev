---
layout: post
title: Evite las animaciones no compuestas
description: Cómo aprobar la auditoría Lighthouse "Evitar animaciones no compuestas".
date: '2020-08-12'
web_lighthouse:
  - animaciones no compuestas
---

Las animaciones no compuestas pueden parecer irregulares (es decir, no fluidas) en teléfonos de gama baja o cuando se ejecutan tareas de alto rendimiento en el hilo principal. Las animaciones Janky pueden aumentar el [cambio de diseño acumulativo](/cls/) (CLS) de su página. Reducir CLS mejorará su puntuación de rendimiento de Lighthouse.

## Fondo

Los algoritmos del navegador para convertir HTML, CSS y JavaScript en píxeles se conocen colectivamente como el *canal de procesamiento* .

<figure class="w-figure"><img src="rendering-pipeline.jpg" alt="La canalización de renderizado consta de los siguientes pasos secuenciales: &lt;span translate =" no=""> JavaScript, estilo, diseño, pintura, compuesto. "&gt;<figcaption class="w-figcaption"> La canalización de renderizado.</figcaption></figure>

Está bien si no comprende lo que significa cada paso de la canalización de renderizado. La clave para entender ahora es que en cada paso de la canalización de renderizado, el navegador usa el resultado de la operación anterior para crear nuevos datos. Por ejemplo, si su código hace algo que activa Layout, los pasos Paint y Composite deben ejecutarse nuevamente. Una animación no compuesta es cualquier animación que activa uno de los pasos anteriores en la canalización de renderizado (Estilo, Diseño o Pintura). Las animaciones no compuestas funcionan peor porque obligan al navegador a trabajar más.

Consulte los siguientes recursos para obtener más información sobre la canalización de renderizado en profundidad:

- [Una mirada al interior de los navegadores web modernos (parte 3)]
- [Simplifique la complejidad de la pintura y reduzca las áreas de pintura]
- [Cíñete a las propiedades exclusivas del compositor y gestiona el recuento de capas]

## Cómo detecta Lighthouse las animaciones no compuestas

Cuando una animación no se puede componer, Chrome informa las razones de la falla al seguimiento de DevTools, que es lo que lee Lighthouse. Lighthouse enumera los nodos DOM que tienen animaciones que no se compusieron junto con los motivos de falla de cada animación.

## Cómo asegurarse de que las animaciones estén compuestas

Consulte [Apegarse a las propiedades exclusivas del compositor y administrar el recuento de capas](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count) y [las animaciones de alto rendimiento] .

## Recursos

- [Código fuente para la auditoría *Evitar animaciones no compuestas*](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/non-composited-animations.js)
- [Cíñete a las propiedades exclusivas del compositor y gestiona el recuento de capas](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
- [Animaciones de alto rendimiento](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [Simplifique la complejidad de la pintura y reduzca las áreas de pintura](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)
- [Una mirada al interior de los navegadores web modernos (parte 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)


[Cíñete a las propiedades exclusivas del compositor y gestiona el recuento de capas]: https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count
[las animaciones de alto rendimiento]: https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
[Simplifique la complejidad de la pintura y reduzca las áreas de pintura]: https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas
[Una mirada al interior de los navegadores web modernos (parte 3)]: https://developers.google.com/web/updates/2018/09/inside-browser-part3