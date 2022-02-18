---
layout: post
title: Controlar el enfoque con tabindex
authors:
  - robdodson
date: 2018-11-18
description: |
  Los elementos HTML estándar como <button> o <input> participan en la navegación secuencial del teclado de forma accesible. Si estás creando componentes interactivos personalizados, utiliza tabindex para asegurarte de que sean accesibles desde el teclado
---

Los elementos HTML estándar como `<button>` o `<input>` participan en la navegación secuencial del teclado de forma accesible. Sin embargo, si estás creando *componentes interactivos personalizados* utiliza`tabindex` para asegurarte de que sean accesibles desde el teclado.

{% Aside %} Siempre que sea posible, utiliza un elemento HTML integrado en lugar de crear su propia versión personalizada. `<button>`, por ejemplo, es muy fácil de diseñar y ya tiene compatibilidad total con el teclado. Esto te evitará tener que administrar `tabindex` o agregar semántica con ARIA. {% endAside %}

## Comprueba si tus controles son accesibles desde el teclado

Una herramienta como Lighthouse es excelente para detectar ciertos problemas de accesibilidad, pero algunas cosas solo pueden ser probadas por humanos.

Intenta presionar `Tab` para navegar por tu sitio. ¿Puedes acceder a todos los controles interactivos de la página? De lo contrario, es posible que tengas que utilizar [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex) para mejorar la capacidad de enfoque de esos controles.

{% Aside 'warning' %} Si no ves ningún indicador de enfoque, es posible que tu CSS lo oculte. Comprueba si hay estilos que mencionen `:focus { outline: none; }`. Puedes aprender cómo solucionar este problema en nuestra guía sobre [enfoque de estilo](/style-focus). {% endAside %}

## Inserta un elemento en el orden de pestañas

Inserta un elemento en el orden natural de pestañas usando `tabindex="0"`. Por ejemplo:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

Para enfocar un elemento, presiona  `Tab` o llama al método `focus()`.

{% Glitch {id: 'tabindex-zero', ruta: 'index.html', altura: 346}%}

## Elimina un elemento del orden de pestañas

Elimina un elemento usando `tabindex="-1"`. Por ejemplo:

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

Esto elimina un elemento del orden natural de pestañas, pero el elemento aún se puede enfocar llamando a su método `focus()`.

{% Glitch {id: 'tabindex-negative-one', ruta: 'index.html', altura: 346}%}

Tené en cuenta que aplicar `tabindex="-1"` a un elemento no afecta a sus elementos secundarios; si están en el orden de pestañas de forma natural o debido a un `tabindex` de tabulación, permanecerán en el orden de pestañas. Para eliminar un elemento y todos sus elementos secundarios del orden de tabulación, considera usar el [polyfill WICG `inert`](https://github.com/WICG/inert). El polyfill emula el comportamiento del atributo propuesto `inert`, que evita que los elementos sean seleccionados o leídos por tecnologías de asistencia.

{% Aside 'caution' %} El polyfill `inert` es experimental y es posible que no funcione como se esperaba en todos los casos. Prueba cuidadosamente antes de usarlo en producción. {% endAside %}

## Evita `tabindex > 0`

Cualquier `tabindex` mayor que 0 salta el elemento al frente del orden de tabulación natural. Si hay varios elementos con un `tabindex` mayor que 0, el orden de tabulación comienza desde el valor más bajo mayor que cero y avanza hacia arriba.

El uso de un `tabindex` mayor que 0 se considera un **anti-patrón** porque los lectores de pantalla navegan por la página en orden DOM, no en orden de tabulación. Si necesitas que un elemento aparezca antes en el orden de tabulación, debe moverse a un lugar anterior en el DOM.

Lighthouse facilita la identificación de elementos con un `tabindex` &gt; 0. Ejecuta la Auditoría de accesibilidad (Lighthouse&gt; Opciones&gt; Accesibilidad) y busque los resultados de la auditoría "Ningún elemento tiene un valor [tabindex] mayor que 0".

## Crea componentes accesibles con "`roving tabindex`" o "tabindex itinerante"

Si estás construyendo un componente complejo, es posible que necesites añadir soporte adicional para el teclado más allá del enfoque. Considera el elemento `select` incorporado. Es enfocable y puede usar las teclas de flecha para exponer funcionalidades adicionales (las opciones seleccionables).

Para implementar una funcionalidad similar en sus propios componentes, utiliza una técnica conocida como " `tabindex` itinerante". El tabindex itinerante o roving tabindex funciona estableciendo `tabindex` en -1 para todos los elementos secundarios, excepto el que está actualmente activo. A continuación, el componente utiliza un detector de eventos de teclado para determinar qué tecla ha pulsado el usuario.

Cuando esto sucede, el componente establece el `tabindex` de tabulación del elemento secundario previamente enfocado en -1, establece el `tabindex` de tabulación del elemento secundario que se va a enfocar en 0 y llama al método `focus()` en él.

**Antes**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="0">Redo</div>
  <button tabindex="-1">Cut</div>
</div>
```

**Después**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```

{% Glitch {id: 'roving-tabindex', ruta: 'index.html', altura: 346}%}

{% Aside %} ¿Tienes curiosidad por saber para qué sirven esos atributos `role=""`? Te permiten cambiar la semántica de un elemento para que un lector de pantalla lo anuncie correctamente. Puedes obtener más información sobre ellos en nuestra guía sobre [conceptos básicos de lectores de pantalla](/semantics-and-screen-readers). {% endAside %}

{% Assessment 'self-assessment' %}

## Fórmulas de acceso al teclado

Si no estás seguro de qué nivel de soporte de teclado pueden necesitar tus componentes personalizados, puedes consultar las [Prácticas de creación de ARIA 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/). Esta sencilla guía enumera los patrones de IU comunes e identifica qué claves deben admitir sus componentes.
