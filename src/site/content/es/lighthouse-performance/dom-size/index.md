---
layout: post
title: Evitar un tamaño de DOM excesivo
description: Aprenda cómo un DOM grande puede reducir el rendimiento de su página web y cómo puede reducir el tamaño de su DOM durante el tiempo de carga.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - dom-size
tags:
  - memory
---

Un árbol DOM grande puede ralentizar el rendimiento de tu página de varias maneras:

- **Eficiencia de la red y rendimiento de la carga**

    Un árbol DOM grande normalmente incluye una gran cantidad de nodos que no son visibles cuando el usuario carga la página por primera vez, lo que aumenta innecesariamente los costos de los datos para sus usuarios y ralentiza el tiempo de carga.

- **Rendimiento del tiempo de ejecución**

    Mientras que los usuarios y los scripts interactúan con su página, el navegador debe [recalcular constantemente la posición y el estilo de los nodos](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli). Un árbol DOM grande en combinación con reglas de estilo complicadas puede ralentizar mucho la renderización.

- **Rendimiento de la memoria**

    Si su JavaScript utiliza selectores de consulta generales como `document.querySelectorAll('li')`, puede almacenar, sin saberlo, referencias a un gran número de nodos, lo que puede sobrepasar la capacidad de memoria de los dispositivos de sus usuarios.

## Cómo falla la auditoría sobre el tamaño del DOM de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) reporta el total de elementos que conforman el DOM, la profundidad máxima del DOM de la página y el máximo de elementos hijos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="Una captura de pantalla de Lighthouse evita una auditoría de tamaño excesivo del DOM", width="800", height="363" %}</figure>

Lighthouse marca páginas con árboles DOM que:

- Advierte cuando el elemento body tiene más de ~800 nodos.
- Se producen errores cuando el elemento body tiene más de ~1,400 nodos.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo optimizar el tamaño del DOM

En general, busca la forma de crear nodos DOM solo cuando se necesiten, y de destruir los nodos cuando ya no sean necesarios.

Si actualmente envía un gran árbol DOM, intente cargar su página y anotar manualmente qué nodos se muestran. Quizás pueda eliminar los nodos que no se visualizan del documento cargado inicialmente y solo crearlos después de una interacción relevante del usuario, como un desplazamiento o un botón de clic.

Si crea nodos DOM durante la ejecución, la [Modificación del subárbol DOM cambia puntos de interrupción](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom) puede ayudarle a determinar cuando se crean los nodos.

Si no puede evitar un árbol DOM grande, otro enfoque para mejorar el rendimiento de la renderización es simplificar sus selectores de CSS. Consulte el documento de Google [Reducir el alcance y la complejidad de los cálculos de estilo](/reduce-the-scope-and-complexity-of-style-calculations/) para obtener más información.

## Orientación específica de una pila

### Angular

Si renderiza listas grandes, utilice [desplazamiento virtual](/virtualize-lists-with-angular-cdk/) con el Kit de desarrollo de componentes (CDK).

### React

- Utilice una biblioteca de "ventanas" como [`react-window`](/virtualize-long-lists-react-window/) para minimizar el número de nodos DOM creados si renderiza muchos elementos repetidos en la página.
- Minimice las renderizaciones repetititvas innecesarias utilizando [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action), [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent), o [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo).
- [Omita efectos](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) solo hasta que ciertas dependencias hayan cambiado si utiliza el hook `Effect` para mejorar el rendimiento en el tiempo de ejecución.

## Recursos

- [Código fuente para **evitar una auditoría de tamaño excesivo del DOM**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/dom-size.js)
- [Reducir el alcance y la complejidad de los cálculos de estilo](/reduce-the-scope-and-complexity-of-style-calculations/)
