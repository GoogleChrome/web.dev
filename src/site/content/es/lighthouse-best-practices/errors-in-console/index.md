---
layout: post
title: Los errores del navegador se registraron en la consola
description: Aprenda a identificar y corregir errores del navegador.
web_lighthouse:
  - errores en la consola
date: 2019-05-02
updated: 2019-08-28
---

La mayoría de los navegadores incorporan herramientas para desarrolladores. Estas herramientas para desarrolladores suelen incluir una [consola](https://developer.chrome.com/docs/devtools/console/). La consola le da información sobre la página que se está ejecutando actualmente.

Los mensajes que se registran en la consola provienen de los desarrolladores web que desarrollaron la página o del propio navegador. Todos los mensajes de la consola tienen un nivel de importancia: `Verbose`, `Info`, `Warning`, o `Error`. Un mensaje de `Error` significa que se produjo un problema en su página que debe resolver.

## Cómo falla la auditoría de errores del navegador Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca todos los errores del navegador que se registran en la consola:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt = "La auditoría de Lighthouse muestra los errores del navegador en la consola", width = "800", height = "247"%}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Cómo corregir errores en el navegador

Corrija cada uno de los errores del navegador que informa Lighthouse para garantizar que su página funcione como se espera para todos sus usuarios.

Chrome DevTools incluye un par de herramientas que le ayudarán a localizar la causa de los errores:

- Debajo del texto de cada error, DevTools Console muestra la [pila de llamadas](https://developer.mozilla.org/docs/Glossary/Call_stack) que provocó la ejecución del código problemático.
- Un enlace en la parte superior derecha de cada error le muestra el código que causó el error.

Por ejemplo, esta captura de pantalla muestra una página con dos errores:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="Un ejemplo de los errores en la consola de Chrome DevTools", width="800", height="505" %}</figure>

En el ejemplo anterior, el primer error proviene de un desarrollador web mediante una llamada a [`console.error()`](https://developer.chrome.com/docs/devtools/console/api/#error). El segundo error proviene del navegador e indica que una variable que se utiliza en uno de los scripts de la página no existe.

Debajo del texto de cada error, la consola de DevTools indica la pila de llamadas en la que aparece el error. Por ejemplo, para el primer error la Consola indica que una función `(anonymous)` llamó a la función `init`, que a su vez llamó a la función `doStuff`. Al hacer clic en el enlace `pen.js:9` que aparece en la parte superior derecha de ese error, se muestra el código correspondiente.

Examinar el código correspondiente a cada error de esta manera puede ayudarle a identificar y resolver los posibles problemas.

Si no puede determinar la causa de un error, intente introducir el texto del error en un motor de búsqueda. Si no puede encontrar soluciones a su problema, intente hacer una pregunta en [Stack Overflow](https://stackoverflow.com).

Si no puede corregir un error, considere la posibilidad de envolverlo en una sentencia [`try...catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) con el fin de indicar explícitamente en el código que es consciente del problema. También puede utilizar el bloque `catch` para atender el error con más elegancia.

## Recursos

- [El código fuente para **los errores del navegador se registraron en la consola** de la auditoría](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/errors-in-console.js)
- [Descripción general de la consola](https://developer.chrome.com/docs/devtools/console/)
- [Stack Overflow](https://stackoverflow.com/)
- [try…catch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch)
