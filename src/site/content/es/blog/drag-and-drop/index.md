---
title: Cómo se usa la API Drag and Drop de HTML5
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: |
  La API Drag and Drop (DnD) de HTML5 nos permite la posibilidad de que casi cualquier elemento de nuestra página se pueda arrastrar. En esta publicación explicaremos los conceptos básicos de arrastrar y soltar (en inglés, "drag and drop").
tags:
  - blog
  - html
  - javascript
  - file-system
---

La API Drag and Drop (DnD) de HTML5 nos permite la posibilidad de que casi cualquier elemento de nuestra página se pueda arrastrar. En esta publicación explicaremos los conceptos básicos de arrastrar y soltar (en inglés, "drag and drop").

## Crear contenido que se pueda arrastrar

Es importante señalar que en la mayoría de los navegadores, el texto seleccionado, las imágenes y los enlaces se pueden arrastrar de forma predeterminada. Por ejemplo, si arrastras el logotipo de Google en la [Búsqueda de Google](https://google.com), verás una imagen fantasma. La imagen se puede colocar en la barra de direcciones, en un elemento `<input type="file" />` o incluso en el escritorio. Para hacer que otros tipos de contenido se puedan arrastrar, debes utilizar las API DnD de HTML5.

Para hacer que un objeto se pueda arrastrar, establece `draggable=true` en dicho elemento. Puedes habilitar la acción de arrastrar en casi cualquier cosa: imágenes, enlaces, archivos o cualquier marca de tu página.

En nuestro ejemplo, creamos una interfaz para reorganizar algunas columnas que fueron diseñadas con CSS Grid. El marcado básico para mis columnas se ve así, y cada columna tiene el atributo `draggable` establecido en `true`.

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

Este es el CSS para mi contenedor y elementos de la caja. Ten en cuenta que el único CSS relacionado con la funcionalidad DnD es la propiedad [`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor) El resto del código solo controla el diseño y el estilo del contenedor y los elementos de la caja.

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

En este punto, verás que puedes arrastrar los elementos, pero nada más que eso. Para agregar la funcionalidad DnD, necesitamos usar la API de JavaScript.

## Supervisar eventos de arrastre

Hay varios eventos diferentes a los que se puede adjuntar para supervisar todo el proceso de arrastrar y soltar.

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

Para controlar el flujo de DnD, necesitas un elemento de origen (donde se origina el arrastre), la carga útil de datos (lo que estás tratando de soltar) y un objetivo (un área colocación). El elemento de origen puede ser una imagen, lista, enlace, objeto de archivo, bloque de HTML, etc. El destino es la zona de colocación (o conjunto de zonas de colocación) que acepta los datos que el usuario está intentando eliminar. Ten en cuenta que no todos los elementos pueden ser objetivos, por ejemplo, una imagen no puede ser un objetivo.

## Iniciar y finalizar una secuencia de arrastrar y soltar

Una vez que hayas definido los atributos `draggable="true"` en tu contenido, adjunta un controlador de eventos `dragstart` para iniciar la secuencia DnD para cada columna.

Este código establecerá la opacidad de la columna al 40 % cuando el usuario comience a arrastrarla, y la devolverá al 100 % cuando finalice el evento de arrastre.

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

El resultado se puede ver en la demostración de Glitch a continuación. Al arrastrar un elemento, éste se vuelve opaco. Como el objetivo del evento `dragstart` es el elemento de origen, si estableces `this.style.opacity` al 40 % le mostrarás al usuario una respuesta visual de que el elemento es la selección actual que se está moviendo. Una vez que suelte el elemento, aunque la funcionalidad de soltar no exista, el elemento de origen volverá a tener una opacidad del 100 %.

{% Glitch {id: 'simple-drag-and-drop-1', path: 'style.css'}%}

## Agregar señales visuales adicionales con `dragenter` , `dragover` y `dragleave`

Para ayudar al usuario a comprender cómo interactuar con su interfaz, utiliza los controladores de eventos `dragenter` `dragover` `dragleave` . En este ejemplo, las columnas son objetivos para soltar, además de ser arrastrables. Ayuda al usuario a comprender esto haciendo que el borde sea discontinuo mientras sostenga un elemento arrastrado sobre una columna. Por ejemplo, en tu CSS puedes crear una clase `over` para representar elementos que son objetivos de arrastre:

```css
.box.over {
  border: 3px dotted #666;
}
```

Luego, en tu código JavaScript, configura los controladores de eventos, agrega la clase `over` cuando se arrastre la columna y elimínala cuando finalice. En el `dragend` también nos aseguramos de eliminar las clases al final del arrastre.

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch {id: 'simple-drag-drop2', path: 'dnd.js'}%}

Hay un par de puntos que vale la pena aclarar de este código:

- En el caso de arrastrar algo como un enlace, debes evitar el comportamiento predeterminado del navegador, que es navegar hasta ese enlace. Para hacer esto, llama a `e.preventDefault()` en el evento `dragover`. Hay otra práctica recomendada, que es devolver `false` en ese mismo controlador.
- El controlador de eventos `dragenter` se usa para alternar la clase `over` en lugar de `dragover`. Si usas `dragover`, la clase CSS se cambiará muchas veces mientras el evento `dragover` continúe activándose al pasar por encima de una columna. En última instancia, eso haría que el renderizador del navegador realizara mucho trabajo innecesario. Mantener los redraws al mínimo es siempre una buena idea. Si necesitas usar el evento `dragover`, considera [limitar o eliminar los rebotes de su detector de eventos](https://css-tricks.com/debouncing-throttling-explained-examples/) .

## Finalizar la función soltar

Para procesar la función de soltar, agrega un monitor de eventos para el evento `drop` En el controlador de `drop`, deberás evitar el comportamiento predeterminado del navegador para la función de soltar, que suele ser algún tipo de redireccionamiento molesto. Puedes evitar que el evento suba por el DOM llamando a `e.stopPropagation()`.

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

Asegúrate de registrar el nuevo controlador entre los demás controladores:

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

Si ahora ejecutas el código, el elemento no se soltará en la nueva ubicación. Para lograr esto, necesitas usar el objeto [`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer).

La propiedad `dataTransfer` es donde ocurre toda la magia de DnD. Contiene la pieza de datos enviada en una función de arrastre. `dataTransfer` se establece en el evento `dragstart` y se lee/maneja en el evento soltar. Si llamas a `e.dataTransfer.setData(mimeType, dataPayload)` establecerás el tipo MIME del objeto y la carga útil de datos.

En este ejemplo, permitiremos a los usuarios reorganizar el orden de las columnas. Para hacer eso, primero debe almacenar el HTML del elemento de origen cuando se inicia la acción de arrastrar:

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

En el evento `drop`, se procesa la función "soltar" de la columna, debes establecer el código HTML de la columna de origen al HTML de la columna de destino sobre la que se ha soltado, y primero verifica que el usuario no esté volviendo a soltar en la misma columna desde la que la arrastró.

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

Puedes ver el resultado en la siguiente demostración. Arrastra y suelta la columna A en la parte superior de la columna B y observa cómo cambian de lugar:

{% Glitch {id: 'simple-drag-drop', path: 'dnd.js'}%}

## Más propiedades de arrastre

El objeto `dataTransfer` muestra propiedades para proporcionar información visual al usuario durante el proceso de arrastre. Estas propiedades también se pueden usar para controlar cómo responde cada objetivo de arrastre a un tipo de datos en particular.

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed) restringe qué 'tipo de arrastre' puede realizar el usuario sobre el elemento. Se utiliza en el modelo de procesamiento de arrastrar y soltar para inicializar el `dropEffect` durante los eventos `dragenter` y `dragover`. La propiedad puede tener los siguientes valores: `none`, `copy`, `copyLink`, `copyMove`, `link`, `linkMove`, `move`, `all` y `uninitialized`.
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect) controla la respuesta que se da al usuario durante los eventos `dragenter` y `dragover`. Cuando el usuario se desplaza sobre un elemento destino, el cursor del navegador indicará qué tipo de operación se llevará a cabo (por ejemplo, una copia, el desplazamiento de un elemento, etc.). El efecto puede adoptar uno de los siguientes valores: `none`, `copy`, `link`, `move`.
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage) significa que en lugar de usar la respuesta predeterminada de 'imagen fantasma' del navegador, opcionalmente puedes establecer un icono de arrastre.

## Carga de archivos con la función de arrastrar y soltar

Este sencillo ejemplo utiliza una columna como origen y destino u objetivo de arrastre. Esto se puede ver en una interfaz de usuario donde se le pide al usuario que reordene los elementos. En algunas situaciones, el destino y el origen de arrastre pueden ser diferentes, como en una interfaz en la que el usuario necesita seleccionar una imagen para que sea la imagen principal de un producto arrastrando la imagen seleccionada a un destino.

La función de arrastrar y soltar se utiliza con frecuencia para permitir a los usuarios arrastrar elementos desde su escritorio a una aplicación. La principal diferencia está en su controlador de `drop`. En lugar de usar `dataTransfer.getData()` para acceder a los archivos, sus datos estarán contenidos en la propiedad `dataTransfer.files`:

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

Podrás encontrar más información al respecto en [Arrastrar y soltar personalizado](/read-files/#select-dnd) .

## Más recursos

- [Especificaciones de Drag and Drop](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [API Drag and Drop HTML MDN](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [Cómo hacer un cargador de archivos Drag and Drop con JavaScript estándar](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [Crear un juego de estacionamiento con la API Drag and Drop HTML](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [Cómo utilizar la API Drag and Drop HTML en React](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
