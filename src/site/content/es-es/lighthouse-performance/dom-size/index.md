---
layout: post
title: Evite un tamaño de DOM excesivo
description: Descubra cómo un DOM grande puede reducir el rendimiento de su página web y cómo puede reducir el tamaño de su DOM en el momento de la carga.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - dom-tamaño
---

Un árbol DOM grande puede ralentizar el rendimiento de su página de varias formas:

- **Eficiencia de la red y rendimiento de la carga**

    Un árbol DOM grande a menudo incluye muchos nodos que no son visibles cuando el usuario carga la página por primera vez, lo que aumenta innecesariamente los costos de datos para sus usuarios y ralentiza el tiempo de carga.

- **Rendimiento en tiempo de ejecución**

    A medida que los usuarios y los scripts interactúan con su página, el navegador debe [recalcular constantemente la posición y el estilo de los nodos](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli) . Un árbol DOM grande en combinación con reglas de estilo complicadas puede ralentizar considerablemente el renderizado.

- **Rendimiento de la memoria**

    Si su JavaScript utiliza selectores de consultas generales como `document.querySelectorAll('li')` , es posible que, sin saberlo, esté almacenando referencias a una gran cantidad de nodos, lo que puede abrumar las capacidades de memoria de los dispositivos de sus usuarios.

## Cómo falla la auditoría de tamaño de Lighthouse DOM

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) informa el total de elementos DOM de una página, la profundidad máxima de DOM de la página y sus elementos secundarios máximos:

<figure class="w-figure"><img class="w-screenshot" src="dom-size.png" alt="Una captura de pantalla de Lighthouse evita una auditoría de tamaño DOM excesivo"></figure>

Lighthouse marca páginas con árboles DOM que:

- Tiene más de 1,500 nodos en total.
- Tener una profundidad superior a 32 nodos.
- Tener un nodo principal con más de 60 nodos secundarios.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo optimizar el tamaño del DOM

En general, busque formas de crear nodos DOM solo cuando sea necesario y destruya los nodos cuando ya no sean necesarios.

Si actualmente está enviando un árbol DOM grande, intente cargar su página y anotar manualmente qué nodos se muestran. Quizás pueda eliminar los nodos no mostrados del documento cargado inicialmente y solo crearlos después de una interacción de usuario relevante, como un desplazamiento o un clic en un botón.

Si crea nodos DOM en tiempo de ejecución, los [puntos de interrupción de cambio de DOM de modificación de subárbol](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints#dom) pueden ayudarlo a identificar cuándo se crean los nodos.

Si no puede evitar un árbol DOM grande, otro enfoque para mejorar el rendimiento de la representación es simplificar sus selectores de CSS. Consulte [Reducir el alcance y la complejidad de los cálculos de estilo de](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations) Google para obtener más información.

## Recursos

- [Código fuente para evitar una auditoría de **tamaño de DOM excesivo**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/dom-size.js)
- [Reducir el alcance y la complejidad de los cálculos de estilo](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
