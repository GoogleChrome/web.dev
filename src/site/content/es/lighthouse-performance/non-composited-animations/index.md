---
layout: post
title: Evita las animaciones no compuestas
description: Cómo aprobar la auditoría Lighthouse "Evitar animaciones no compuestas".
date: 2020-08-12
web_lighthouse:
  - animaciones no compuestas
---

Las animaciones no compuestas pueden parecer irregulares (es decir, no fluidas) en teléfonos de gama baja o cuando se ejecutan tareas de alto rendimiento en la línea principal. Las animaciones Janky pueden aumentar el [cambio de diseño acumulativo](/cls/) (CLS) de su página. Reducir CLS mejorará su puntuación de rendimiento de Lighthouse.

## Antecedentes

Los algoritmos del navegador para convertir HTML, CSS y JavaScript en píxeles se conocen colectivamente como *canalización de renderizado*.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/68xt0KeUvOpB8kA1OH0a.jpg", alt="The rendering pipeline consists of the following sequential steps: JavaScript, Style, Layout, Paint, Composite.", width="800", height="122" %} <figcaption> Canalización de renderizado.</figcaption></figure>

Está bien si no comprendes lo que significa cada paso de la canalización de renderizado. La clave para entenderlo ahora es que en cada paso de la canalización de renderizado, el navegador usa el resultado de la operación anterior para crear nuevos datos. Por ejemplo, si tu código hace algo que activa Diseño, los pasos Pintura y Composición deben ejecutarse nuevamente. Una animación no compuesta es cualquier animación que activa uno de los pasos anteriores en la canalización de renderizado (Estilo, Diseño o Pintura). Las animaciones no compuestas funcionan peor porque obligan al navegador a trabajar más.

Consulta los siguientes recursos para obtener más información en detalle sobre la canalización de renderizado:

- [Una mirada al interior de los navegadores web modernos (parte 3)](https://developer.chrome.com/blog/inside-browser-part3/)
- [Simplifica la complejidad de la pintura y reduce sus áreas](/simplify-paint-complexity-and-reduce-paint-areas/)
- [Limítate a las propiedades del compositor y gestiona el número de capas](/stick-to-compositor-only-properties-and-manage-layer-count/)

## Cómo detecta Lighthouse las animaciones no compuestas

Cuando una animación no se puede componer, Chrome informa las razones de la falla al seguimiento de DevTools, que es lo que lee Lighthouse. Lighthouse enumera los nodos DOM que tienen animaciones que no fueron compuestas junto con los motivos de falla de cada animación.

## Cómo asegurarse de que las animaciones estén compuestas

Consulta [Adherirse a las propiedades exclusivas del compositor y administrar el número de capas](/stick-to-compositor-only-properties-and-manage-layer-count/) y [las animaciones de alto rendimiento](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) .

## Recursos

- [Código fuente para la auditoría de *Evitar animaciones no compuestas*](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/non-composited-animations.js)
- [Limítate a las propiedades exclusivas del compositor y gestiona el número de capas](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [Animaciones de alto rendimiento](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [Simplifica la complejidad de la pintura y reduce sus áreas](/simplify-paint-complexity-and-reduce-paint-areas/)
- [Una mirada al interior de los navegadores web modernos (parte 3)](https://developer.chrome.com/blog/inside-browser-part3/)
