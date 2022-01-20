---
layout: post
title: Leer y escribir archivos y directorios con la biblioteca de browser-fs-access
authors:
  - thomassteiner
description: |-
 "Todos los navegadores modernos pueden leer archivos y directorios locales; sin embargo, un verdadero acceso de escritura, es decir, más que descargar archivos, está limitado a navegadores que implementan la API de File System Access."
  Esta publicación presenta una biblioteca de apoyo llamada browser-fs-access que actúa como una capa de abstracción sobre la API de File System Access  y de manera transparente, recurre a enfoques heredados para tratar con archivos.
scheduled: 'true'
date: 2020-07-27
updated: 2021-01-27
hero: image/admin/Y4wGmGP8P0Dc99c3eKkT.jpg
tags:
  - blog
  - progressive-web-apps
  - capabilities
feedback:
  - api
---

Los navegadores han podido manejar archivos y directorios durante mucho tiempo. La [API de File (archivos)](https://w3c.github.io/FileAPI/) proporciona funciones para representar objetos de archivo en aplicaciones web, así como para seleccionarlos mediante programación y acceder a tus datos. Sin embargo, en el momento en que miras más de cerca, todo lo que brilla no es oro.

## La forma tradicional de tratar con los archivos

{% Aside %} Si sabes cómo solía funcionar la antigua forma, puedes [saltarte directamente a la nueva](#the-file-system-access-api). {% endAside %}

### Abrir archivos

Como desarrollador, puedes abrir y leer archivos a través del elemento [`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file). En su forma más simple, abrir un archivo puede parecerse al ejemplo de código a continuación. El objeto `input` te proporciona una lista de [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList), que en el caso siguiente consta de un solo [`File`](https://developer.mozilla.org/docs/Web/API/File). Un `File` es un tipo específico de [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) y se puede usar en cualquier contexto en el que un Blob pueda hacerlo.

```js
const openFile = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
      resolve(input.files[0]);
    });
    input.click();
  });
};
```

### Abrir directorios

Para abrir carpetas (o directorios), puedes establecer el atributo de [`<input webkitdirectory>`](https://developer.mozilla.org/docs/Web/HTML/Element/input#attr-webkitdirectory). Aparte de eso, todo lo demás funciona igual que el ejemplo anterior. A pesar de su nombre predefinido por el proveedor, `webkitdirectory` no solo se puede usar en los navegadores Chromium y WebKit, sino también en legacy Edge basado en EdgeHTML y en Firefox.

### Guardar (más bien, descargar) archivos

Para guardar un archivo, tradicionalmente, se limita a *descargar* un archivo, que funciona gracias al atributo [`<a download>`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-download:~:text=download). Dado un Blob, puedes establecer el atributo `href` del ancla en un `blob:` URL que puedes obtener del método [`URL.createObjectURL()`](https://developer.mozilla.org/docs/Web/API/URL/createObjectURL). {% Aside 'caution' %} Para evitar pérdidas de memoria, siempre revoca la URL después de la descarga. {% endAside %}

```js
const saveFile = async (blob) => {
  const a = document.createElement('a');
  a.download = 'my-file.txt';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
```

### El problema

Una desventaja masiva del enfoque de *descarga* es que no hay forma de hacer que suceda un flujo clásico de abrir → editar → guardar, es decir, no hay forma de *sobrescribir* el archivo original. En su lugar, terminarás con una nueva *copia* del archivo original en la carpeta de Descargas predeterminada del sistema operativo en cada ocasión que "guardes".

## La API de File System Access

La API de File System Access hace que ambas operaciones, abrir y guardar, sean mucho más simples. También permite un *verdadero guardado*, es decir, no solo puedes elegir dónde guardar un archivo, sino también sobrescribir un archivo existente.

{% Aside %} Para obtener una introducción más detallada a la API de File System Access, consulta el artículo [La API de File System Access: simplificación del acceso a archivos locales](/file-system-access/). {% endAside %}

### Abrir archivos

Con la [API de File System Access](https://wicg.github.io/file-system-access/), abrir un archivo es cuestión de una llamada al método `window.showOpenFilePicker()`. Esta llamada devuelve un identificador de archivo, desde el cual puede obtener el `File` real a través del método `getFile()`.

```js
const openFile = async () => {
  try {
    // Siempre regresa una matriz.
    const [handle] = await window.showOpenFilePicker();
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

### Abrir directorios

Abres un directorio llamando a `window.showDirectoryPicker()` el cual hace que los directorios se puedan seleccionar en el cuadro de diálogo del archivo.

### Guardar archivos

Guardar archivos es igualmente sencillo. Desde un identificador de archivo, crea un stream de escritura a través de `createWritable()`, luego escribe los datos de Blob llamando al metodo `write()` del stream y finalmente cierra el stream llamando a su método `close()`.

```js
const saveFile = async (blob) => {
  try {
    const handle = await window.showSaveFilePicker({
      types: [{
        accept: {
          // Omitted
        },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

## Presentando a browser-fs-access

Tan perfectamente bien como lo es la API de File System Access, [esta función aún no está ampliamente disponible](https://caniuse.com/native-filesystem-api).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/G1jsSjCBR871W1uKQWeN.png", alt="Tabla de compatibilidad del navegador para la API de File System Access. Todos los navegadores están marcados como 'sin soporte' o 'detrás de una bandera'.", width="800", height="224" %}<figcaption> Tabla de compatibilidad del navegador para la API de File System Access. (<a href="https://caniuse.com/native-filesystem-api">Fuente</a>)</figcaption></figure>

Es por eso que veo la API de File System Access como una [mejora progresiva](/progressively-enhance-your-pwa). Como tal, quiero usarla cuando el navegador lo permita y usar el enfoque tradicional y si no es posible; mientras el usuario no sea castigado con descargas innecesarias de código JavaScript no compatible. La biblioteca [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) es mi respuesta para este desafío.

### Filosofía de diseño

Dado que es probable que la API de File System Access cambie en el futuro, la API de browser-fs-access no se basa en ella. Es decir, la biblioteca no es un [polyfill](https://developer.mozilla.org/docs/Glossary/Polyfill), sino un [ponyfill](https://github.com/sindresorhus/ponyfill). Puedes (estática o dinámicamente) importar exclusivamente cualquier funcionalidad que necesites para mantener tu aplicación lo más pequeña posible. Los métodos disponibles son [`fileOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files), [`directoryOpen()`](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories) y [`fileSave()`](https://github.com/GoogleChromeLabs/browser-fs-access#saving-files). Internamente, la función de biblioteca detecta si la API de File System Access es compatible y luego importa la ruta del código correspondiente.

### Usando la biblioteca browser-fs-access

Los tres métodos son intuitivos de usar. Puedes especificar los tipos aceptados de `mimeTypes` o las `extensions` de los archivos aceptados por tu aplicación, y establecer una bandera de `multiple` para permitir o no permitir la selección de varios archivos o directorios. Para obtener todos los detalles, consulta la [documentación de la API de browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access#api-documentation). El siguiente ejemplo de código muestra cómo puede abrir y guardar archivos de imagen.

```js
// Los metodos importados utilizarán la API de File
// System Access o una implementación de respaldo.
import {
  fileOpen,
  directoryOpen,
  fileSave,
} from 'https://unpkg.com/browser-fs-access';

(async () => {
  // Abre un archivo de imagen.
  const blob = await fileOpen({
    mimeTypes: ['image/*'],
  });

  // Abre multiples archivos de imagenes.
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    multiple: true,
  });

  // Abre todos los archivos en una carpeta
  // de manera recursiva incluyendo las subcarpetas.
  const blobsInDirectory = await directoryOpen({
    recursive: true
  });

  // Guarda un archivo.
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```

### Demostración

Puedes ver el código anterior en acción en una [demostración](https://browser-fs-access.glitch.me/) de Glitch. Su [código fuente](https://glitch.com/edit/#!/browser-fs-access) también se encuentra disponible allí. Dado que, por razones de seguridad, los subcuadros de origen cruzado no pueden mostrar un selector de archivos, la demostración no se puede incrustar en este artículo.

## La biblioteca browser-fs-access en lo salvaje

En mi tiempo libre, contribuyo un poco a una [PWA instalable](/progressive-web-apps/#installable) llamada [Excalidraw](https://excalidraw.com/), una herramienta de pizarra que te permite dibujar diagramas fácilmente con una sensación de dibujo a mano. Es totalmente responsiva y funciona bien en una variedad de dispositivos, desde pequeños teléfonos móviles hasta computadoras con pantallas grandes. Esto significa que debes manejar archivos en todas las diversas plataformas, ya sea que admitan o no la API de File System Access. Esto la convierte en una gran candidata para la biblioteca browser-fs-access.

Puedo, por ejemplo, iniciar un dibujo en mi iPhone, guardarlo (técnicamente: descargarlo, ya que Safari no es compatible con la API de File System Access) en la carpeta Descargas de mi iPhone, abrir el archivo en mi escritorio (después de transferirlo desde mi teléfono), modificar el archivo y sobrescribirlo con mis cambios, o incluso guardarlo como un archivo nuevo.

<figure>{% Img src="image/admin/u1Gwxp5MxS39wl8PW2vz.png", alt="Un dibujo de Excalidraw en un iPhone", width="300", height="649" %}<figcaption> Iniciar un dibujo de Excalidraw en un iPhone donde no se admite la API de File System Access, pero donde se puede guardar (descargar) un archivo en la carpeta Descargas.</figcaption></figure>

<figure>{% Img src="image/admin/W1lt36DtKuveBJJTzonC.png", alt="El dibujo de Excalidraw modificado en Chrome en el escritorio.", width="800", height="592" %} <figcaption> Abrir y modificar el dibujo de Excalidraw en el escritorio donde se admite la API de File System Access y, por lo tanto, se puede acceder al archivo a través de la API.</figcaption></figure>

<figure>{% Img src="image/admin/srqhiMKy2i9UygEP4t8e.png", alt="Sobrescribiendo el archivo original con las modificaciones.", width="800", height="585" %} <figcaption> Sobrescribiendo el archivo original con las modificaciones al archivo de dibujo original de Excalidraw. El navegador muestra un cuadro de diálogo que me pregunta si está correcto.</figcaption></figure>

<figure>{% Img src="image/admin/FLzOZ4eXZ1lbdQaA4MQi.png", alt="Guardando las modificaciones en un nuevo archivo de dibujo de Excalidraw.", width="800", height="592" %} <figcaption> Guardar las modificaciones en un nuevo archivo Excalidraw. El archivo original permanece intacto.</figcaption></figure>

### Ejemplo de código de la vida real

A continuación, puedes ver un ejemplo real de browser-fs-access tal como se usa en Excalidraw. Este extracto está tomado de [`/src/data/json.ts`](https://github.com/excalidraw/excalidraw/blob/cd87bd6901b47430a692a06a8928b0f732d77097/src/data/json.ts#L24-L52). Es de especial interés cómo el método `saveAsJSON()` pasa un identificador de archivo o un `null` al método `fileSave()` de browser-fs-access, lo que hace que se sobrescriba cuando se proporciona un identificador, o que se guarde en un nuevo archivo en caso contrario.

```js
export const saveAsJSON = async (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  fileHandle: any,
) => {
  const serialized = serializeAsJSON(elements, appState);
  const blob = new Blob([serialized], {
    type: "application/json",
  });
  const name = `${appState.name}.excalidraw`;
  (window as any).handle = await fileSave(
    blob,
    {
      fileName: name,
      description: "Excalidraw file",
      extensions: ["excalidraw"],
    },
    fileHandle || null,
  );
};

export const loadFromJSON = async () => {
  const blob = await fileOpen({
    description: "Excalidraw files",
    extensions: ["json", "excalidraw"],
    mimeTypes: ["application/json"],
  });
  return loadFromBlob(blob);
};
```

### Consideraciones sobre la interfaz de usuario

Ya sea en Excalidraw o en tu aplicación, la interfaz de usuario debe adaptarse a la situación que el navegador es compatible. Si la API de File System Access es compatible (`if ('showOpenFilePicker' in window){}`) puedes mostrar un botón de **Guardar como** además de un botón de **Guardar**. Las capturas de pantalla a continuación muestran la diferencia entre la barra de herramientas de la aplicación principal responsiva de Excalidraw en el iPhone y en el escritorio de Chrome. Ten en cuenta que en el iPhone hace falta el botón de **Guardar como**.

<figure>{% Img src="image/admin/c2sjjj86zh53VDrPIo6M.png", alt="Barra de herramientas de la aplicación Excalidraw en iPhone con solo un botón de 'Guardar'.", width="300", height="226" %}<figcaption> Barra de herramientas de la aplicación Excalidraw en iPhone con solo un botón de <strong>Guardar</strong>.</figcaption></figure>

<figure>{% Img src="image/admin/unUUghwH5mG2hLnaViHK.png", alt="Barra de herramientas de la aplicación Excalidraw en el escritorio de Chrome con un botón de 'Guardar' y un botón de 'Guardar como'.", width="300", height="66" %} <figcaption> Barra de herramientas de la aplicación Excalidraw en Chrome con un botón de <strong>Guardar</strong> y un botón enfocado de <strong>Guardar como</strong>.</figcaption></figure>

## Conclusiones

Trabajar con archivos del sistema funciona técnicamente en todos los navegadores modernos. En los navegadores que admiten la API de File System Access, puedes mejorar la experiencia al permitir el verdadero guardado y la sobrescritura (no solo la descarga) de archivos y al permitir que tus usuarios creen nuevos archivos donde lo deseen, todo sin dejar de ser funcional en los navegadores que no sean compatibles con la API de File System Access API. El [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) te facilita la vida al lidiar con las sutilezas de la mejora progresiva y hacer que tu código sea lo más simple posible.

## Agradecimientos

Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley) y [Kayce Basques](https://github.com/kaycebasques). Gracias a los [colaboradores de Excalidraw](https://github.com/excalidraw/excalidraw/graphs/contributors) por su trabajo en el proyecto y por revisar mis Pull Requests. [Imagen de héroe](https://unsplash.com/photos/hXrPSgGFpqQ) de [Ilya Pavlov](https://unsplash.com/@ilyapavlov) en Unsplash.
