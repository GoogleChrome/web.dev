---
title: Leer archivos en JavaScript
subhead: Cómo seleccionar archivos, leer metadatos y contenido de archivos y monitorear el progreso de la lectura.
description: |2

  Cómo seleccionar archivos, leer metadatos y contenido de archivos y monitorear el progreso de la lectura.
date: 2010-06-18
updated: 2021-03-29
authors:
  - kaycebasques
  - petelepage
  - thomassteiner
tags:
  - blog
  - storage
---

Poder seleccionar e interactuar con archivos en el dispositivo local del usuario es una de las características más utilizadas de la web. Esto permite a los usuarios seleccionar archivos y cargarlos en un servidor, por ejemplo, cargando fotos o enviando documentos fiscales, etc. Pero también permite que los sitios los lean y manipulen sin tener que transferir los datos a través de la red.

## La API moderna de acceso al sistema de archivos

La API de acceso al sistema de archivos proporciona una manera fácil de leer y escribir archivos y directorios en el sistema local del usuario. Actualmente está disponible en la mayoría de los navegadores derivados de Chromium como Chrome o Edge. Para obtener más información al respecto, consulte el artículo de la [API de acceso al sistema de archivos.](/file-system-access/)

Dado que la API de acceso al sistema de archivos aún no es compatible con todos los navegadores, consulte [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access), la cual es una biblioteca auxiliar que usa la nueva API siempre que esté disponible, pero si no está disponible utiliza métodos antiguos.

## Trabajar con archivos, de la forma clásica

Esta guía le muestra a como:

- Seleccionar archivos
    - [Usando el elemento de entrada HTML](#select-input)
    - [Usando una zona de arrastrar y soltar](#select-dnd)
- [Leer metadatos de archivos](#read-metadata)
- [Leer el contenido de un archivo](#read-content)

## Seleccionar archivos {: #select }

### Elemento de entrada HTML {: #select-input }

La forma más sencilla de permitir que los usuarios seleccionen archivos es utilizando el elemento [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file) , que es compatible con todos los navegadores principales. Cuando se hace clic, permite al usuario seleccionar un archivo, o varios archivos si el atributo de[`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) es incluido, utilizando la IU de selección de archivos incorporada de su sistema operativo. Cuando el usuario termina de seleccionar un archivo o archivos, se dispara el evento de `change`. Puede acceder a la lista de archivos desde `event.target.files`, que es un objeto [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Cada elemento de `FileList` es un objeto [`File`](https://developer.mozilla.org/docs/Web/API/File)

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %} Verifique si el método [`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read) es una alternativa viable para su caso, ya que también le brinda un identificador de archivo para que pueda volver a escribir en el archivo, además de leer. Este método se puede utilizar con [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files). {% endAside %}

Este ejemplo permite a un usuario seleccionar varios archivos usando la IU de selección de archivos incorporada de su sistema operativo y luego registra cada archivo seleccionado en la consola.

{% Glitch {id: 'input-type-file', altura: 480}%}

#### Limite los tipos de archivos que el usuario puede seleccionar {: #accept }

En algunos casos, es posible que desee limitar los tipos de archivos que los usuarios pueden seleccionar. Por ejemplo, una aplicación de edición de imágenes solo debe aceptar imágenes, no archivos de texto. Para hacer eso, puede agregar un [`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) al elemento de entrada para especificar qué archivos se aceptan.

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### Arrastrar y soltar personalizado {: #select-dnd }

En algunos navegadores, el elemento `<input type="file">` también es un lugar para arrastrar y soltar archivos, lo que permite a los usuarios mandar archivos en su aplicación. Sin embargo, el objetivo es pequeño y puede resultar difícil de usar. En su lugar, una vez que haya proporcionado la funcionalidad principal mediante un elemento `<input type="file">`, puede crear una gran zona personalizada para arrastrar y soltar archivos.

{% Aside %} Verifique si el método [`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration) es una alternativa viable para su caso, ya que también le brinda un identificador de archivo para que pueda volver a escribir en el archivo, además de leer. {% endAside %}

#### Elija su zona para soltar {: #choose-drop-zone }

Su zona para soltar dependerá del diseño de su aplicación. Es posible que solo desee que una parte de la ventana sea una zona para soltar o, potencialmente, toda la ventana.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="Una captura de pantalla de Squoosh, una aplicación web para compresión de imagen.", width="800", height="589" %} <figcaption> Squoosh convierte toda la ventana en una zona para soltar. </figcaption></figure>

Squoosh permite al usuario arrastrar y soltar una imagen en cualquier lugar de la ventana, y al hacer clic en **seleccionar una imagen se** invoca el elemento `<input type="file">`. Independientemente de lo que elija como zona para soltar, asegúrese de que el usuario tenga claro que puede arrastrar y soltar archivos en esa zona.

#### Defina la zona para soltar {: #define-drop-zone }

Para permitir que un elemento sea una zona de arrastrar y soltar, deberá escuchar dos eventos, [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event) y [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event) . El `dragover` actualiza la interfaz de usuario del navegador para indicar visualmente que la acción de arrastrar y soltar está creando una copia del archivo. El `drop` se activa después de que el usuario haya dejado caer los archivos en la zona. De manera similar al elemento de entrada, puede acceder a la lista de archivos desde `event.dataTransfer.files`, que es un objeto [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList). Cada elemento de `FileList` es un objeto [`File`](https://developer.mozilla.org/docs/Web/API/File)

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

[`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) y [`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) evitan que suceda el comportamiento predeterminado del navegador y permiten que su código se ejecute en su lugar. Sin ellos, su navegador le enviaría a un lugar fuera de su página y abriría los archivos que el usuario colocó en la ventana del navegador.

{# Este ejemplo no funciona si se utiliza sin ser modificado. #}

Consulte [Arrastrar y soltar personalizado](https://custom-drag-and-drop.glitch.me/) para ver una demostración en vivo.

### ¿Qué pasa con los directorios? {: #directories }

Desafortunadamente, hoy en día no existe una buena forma de acceder a un directorio.

El [`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) en el atributo `<input type="file">` permite al usuario elegir un directorio o directorios. Es compatible con algunos navegadores basados en Chromium y posiblemente en la versión escritorio de Safari, pero hay reportes de [conflictos](https://caniuse.com/#search=webkitdirectory) sobre la compatibilidad del navegador.

{% Aside %} Verifique si el método  [`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents) es una alternativa viable para su caso, ya que también le brinda un identificador de directorio para que pueda volver a escribir en el directorio, además de leer. Este método se puede utilizar con [polyfill](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories). {% endAside %}

Si la función de arrastrar y soltar está habilitada, un usuario puede intentar arrastrar un directorio a la zona para soltar. Cuando se activa el evento, incluirá un objeto `File` en el directorio, pero no podrá acceder a ninguno de los archivos dentro del directorio.

## Leer metadatos de archivos {: #read-metadata }

El objeto [`File`](https://developer.mozilla.org/docs/Web/API/File) contiene varias propiedades de metadatos sobre el archivo. La mayoría de los navegadores proporcionan el nombre del archivo, el tamaño del archivo y el tipo de MIME, dependiendo según la plataforma, los diferentes navegadores pueden proporcionar información diferente o adicional.

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

Puede ver esto en acción en la demostración de Glitch del [`input-type-file`](https://input-type-file.glitch.me/).

## Leer el contenido de un archivo {: #read-content }

Para leer un archivo, use [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader), que le permite leer el contenido de un `File` en la memoria. Puede darle instrucciones a `FileReader` a para que lea un archivo como un [búfer de matriz](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer), una [URL de datos](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) o [texto](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText).

```js
function readImage(file) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith('image/')) {
    console.log('File is not an image.', file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
```

El ejemplo anterior lee un `File` proporcionado por el usuario, luego lo convierte en una URL de datos y utiliza esa URL de datos para mostrar la imagen en un elemento `img`. Echa un vistazo al Glitch de [`read-image-file`](https://read-image-file.glitch.me/) para ver cómo verificar que el usuario haya seleccionado un archivo de imagen.

{% Glitch {id: 'read-image-file', height: 480}%}

### Supervisar el progreso de la lectura de un archivo {: #monitor-progress }

Al leer archivos grandes, puede ser útil proporcionar algo de UX para indicar cuánto ha progresado la lectura. Para eso, use el evento de [`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event), proporcionado por `FileReader` . El `progress` proporciona dos propiedades, `loaded`, la cantidad leída y `total`, la cantidad total a leer.

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(file);
}
```

Imagen de héroe por Vincent Botta de [Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)
