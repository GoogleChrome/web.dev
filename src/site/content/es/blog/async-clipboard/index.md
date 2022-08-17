---
title: Desbloqueo del acceso al portapapeles
subhead: Acceso al portapapeles más seguro y desbloqueado para texto e imágenes
authors:
  - developit
  - thomassteiner
description: La API Async Clipboard simplifica la función de copiar y pegar con permisos.
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: Portapapeles con lista de compras
feedback:
  - api
---

En los últimos años, los navegadores han utilizado [`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands) para las interacciones con el portapapeles. Aunque es ampliamente compatible, este método de cortar y pegar tenía un costo: el acceso al portapapeles era sincrónico y solo se podía leer y escribir al DOM.

Eso funciona muy bien para pequeños fragmentos de texto, pero hay muchos casos en los que bloquear la página para transferir desde el portapapeles resulta en una mala experiencia. Es posible que se necesite una limpieza o decodificación de imágenes que requiera mucho tiempo antes de que el contenido se pueda pegar de manera segura. Es posible que el navegador necesite cargar o incorporar recursos vinculados desde un documento pegado. Eso bloquearía la página mientras espera en el disco o en la red. Imagine agregar permisos a esta combinación, lo que requiere que el navegador bloquee la página mientras solicita acceso al portapapeles. Al mismo tiempo, los permisos establecidos por `document.execCommand()` para la interacción del portapapeles son definidos en líneas generales y varían entre los navegadores.

La [API del portapapeles asíncrono (API Async Clipboard)](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api) aborda estos problemas, proporcionando un modelo de permisos bien definido que no bloquea la página. Safari anunció recientemente el [soporte a la API en la versión 13.1](https://webkit.org/blog/10855/). Con eso, los principales navegadores tienen un nivel básico de soporte. En el momento de escribir estas líneas, Firefox solo admite texto; y el soporte de imágenes está limitado a PNG en algunos navegadores. Si está interesado en utilizar la API, [consulte una tabla de compatibilidad de navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility) antes de continuar.

{% Aside %} La API del portapapeles asíncrono se limita a manejar texto e imágenes. Chrome 84 introduce una función experimental que permite que el portapapeles maneje cualquier tipo de datos arbitrario. {% endAside %}

## Copiar: escribir datos en el portapapeles

### writeText()

Para copiar texto al portapapeles, ejecute `writeText()`. Dado que esta API es asincrónica, la función `writeText()` devuelve una Promesa (Promise) que se resuelve o rechaza dependiendo de si el texto correspondiente se copia correctamente:

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
```

### write()

En realidad, `writeText()` es solo un método conveniente para el método `write()` genérico, que también le permite copiar imágenes al portapapeles. Al igual que `writeText()`, es asincrónico y devuelve una Promesa.

Para copiar una imagen en el portapapeles, necesita la imagen como un [`blob`](https://developer.mozilla.org/docs/Web/API/blob). Una forma de hacer esto es solicitando la imagen de un servidor usando `fetch()`, luego ejecutar [`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob) en la respuesta.

Solicitar una imagen del servidor puede no ser deseable o posible por una variedad de razones. Afortunadamente, también puede dibujar la imagen en un lienzo (canvas) y ejecutar el método [`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob)

A continuación, pase un conjunto de objetos `ClipboardItem` como parámetro del método `write()`. Actualmente, solo puede pasar una imagen a la vez, pero esperamos agregar soporte para varias imágenes en el futuro. `ClipboardItem` toma un objeto con el tipo MIME de la imagen como clave y el blob como valor. Para los objetos Blob obtenidos por `fetch()` o `canvas.toBlob()`, la propiedad `blob.type` contiene automáticamente el tipo MIME correcto para una imagen.

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Image copied.');
} catch (err) {
  console.error(err.name, err.message);
}
```

{% Aside 'warning' %} Safari (WebKit) trata la activación del usuario de manera diferente a Chromium (Blink) (consulte el [error de WebKit #222262](https://bugs.webkit.org/show_bug.cgi?id=222262)). Para Safari, ejecute todas las operaciones asincrónicas en una promesa cuyo resultado se asigne al `ClipboardItem`:

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### El evento copy

En el caso de que un usuario inicie una copia del portapapeles, se le proporcionarán datos no textuales como un blob. El [evento `copy`](https://developer.mozilla.org/docs/Web/API/Document/copy_event) incluye `clipboardData` con los elementos que ya están en el formato correcto, lo que elimina la necesidad de crear manualmente un Blob. Ejecute `preventDefault()` para evitar el comportamiento predeterminado en favor de su propia lógica, luego copie el contenido al portapapeles. Lo que no se cubre en este ejemplo es cómo recurrir a API anteriores cuando la API del portapapeles no es compatible. Cubriremos eso en [Detección de características](#feature-detection), más adelante en este artículo.

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Image copied.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## Pegar: leer datos del portapapeles

### readText()

Para leer texto del portapapeles, ejecute `navigator.clipboard.readText()` y espere a que se resuelva la Promesa devuelta:

```js
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}
```

### read()

El método `navigator.clipboard.read()` también es asincrónico y devuelve una Promesa. Para leer una imagen del portapapeles, obtenga una lista de [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem) y luego repita la iteración sobre ellos.

Cada `ClipboardItem` puede albergar contenido de diferentes tipos, por lo que deberá iterar la lista de tipos, nuevamente usando un bucle `for...of`. Para cada tipo, ejecute `getType()` con el tipo actual como argumento para obtener el Blob correspondiente. Como antes, este código no está vinculado a imágenes y funcionará con otros tipos de archivos futuros.

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### Trabajar con archivos pegados

Es útil para los usuarios poder utilizar atajos de teclado del portapapeles como <kbd>ctrl</kbd> + <kbd>c</kbd> <kbd>ctrl</kbd> + <kbd>v</kbd>. Chromium expone *archivos de solo lectura* en el portapapeles como se describe a continuación. Esto se activa cuando el usuario accede al acceso directo de pegado predeterminado del sistema operativo o cuando el usuario hace clic en **Editar y** luego en **Pegar** en la barra de menú del navegador. No se necesita más código de plomería.

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Read the file's contents, assuming it's a text file.
  // There is no way to write back to it.
  console.log(await file.text());
});
```

### El evento paste

Como se señaló anteriormente, existen planes para introducir eventos para que funcionen con la API del portapapeles, pero por ahora puede usar el evento `paste`. Funciona muy bien con los nuevos métodos asincrónicos para leer el texto del portapapeles. Al igual que con el evento `copy`, no olvide se olvide de ejecutar `preventDefault()`.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

Al igual que con el `copy`, recurrir a API anteriores cuando la API del portapapeles no es compatible se abordará en [Detección de características](#feature-detection).

## Manejo de varios tipos de archivos

La mayoría de las implementaciones colocan varios formatos de datos en el portapapeles para una sola operación de cortar o copiar. Hay dos razones para esto: como desarrollador de aplicaciones, no tiene como conocer las funcionalidades de la aplicación de la cual un usuario desea copiar texto o imágenes, y muchas aplicaciones permiten pegar datos estructurados como texto sin formato. Esto se presenta a los usuarios como un elemento del menú **Editar** llamado **Combinar formato** o **Mantener solo texto** o algo por el estilo.

El siguiente ejemplo muestra cómo hacer esto. Este ejemplo usa `fetch()` para obtener datos de imagen, pero también podría provenir de un [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) o de la [API de acceso al sistema de archivos](/file-system-access/).

```js
async function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## Seguridad y permisos

El acceso al portapapeles siempre ha supuesto un problema de seguridad para los navegadores. Sin los permisos adecuados, una página podría copiar silenciosamente todo tipo de contenido malicioso en el portapapeles de un usuario que produciría resultados catastróficos al pegarlo. Imagine una página web que copia silenciosamente `rm -rf /` o una [bomba zip](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html) a su portapapeles.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="Cuadro de diálogo del navegador que solicita al usuario el permiso del portapapeles.", width="800", height="338" %}<figcaption> La solicitud de permiso para la API del portapapeles.</figcaption></figure>

Dar a las páginas web acceso de lectura sin restricciones al portapapeles es aún más problemático. Los usuarios copian rutinariamente información confidencial como contraseñas y datos personales al portapapeles, que luego podría ser leído por cualquier página sin el conocimiento del usuario.

Como ocurre con muchas API nuevas, la API del portapapeles solo es compatible con las páginas servidas a través de HTTPS. Para ayudar a prevenir el abuso, el acceso al portapapeles solo está permitido cuando una página está en la pestaña activa. Las páginas en pestañas activas pueden escribir en el portapapeles sin solicitar permiso, pero leer desde el portapapeles siempre requiere permiso.

Se han agregado permisos para copiar y pegar a la [API de permisos](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web). El permiso `clipboard-write` se otorga automáticamente a las páginas en la pestaña activa. Se debe solicitar el permiso `clipboard-read`, lo que puede hacerse al intentar leer los datos del portapapeles. El siguiente código muestra este último caso:

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Will be 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Listen for changes to the permission state
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

También puede controlar si se requiere un gesto de usuario para invocar cortar o pegar usando la opción `allowWithoutGesture`. El valor predeterminado de este valor varía según el navegador, por lo que siempre debe incluirlo.

Aquí es donde la naturaleza asincrónica de la API del portapapeles es realmente útil: intentar leer o escribir datos del portapapeles solicita automáticamente al usuario permiso si aún no se ha otorgado. Dado que la API se basa en promesas, esto es completamente transparente, y un usuario que niega el permiso del portapapeles hace que la promesa sea rechazada para que la página pueda responder adecuadamente.

Debido a que Chrome solo permite el acceso al portapapeles cuando una página es la pestaña activa, encontrará que algunos de los ejemplos aquí no se ejecutan si se pegan directamente en DevTools, ya que DevTools en sí es la pestaña activa. Pero hay un truco: retrase el acceso al portapapeles usando `setTimeout()`, luego haga clic rápidamente dentro de la página para enfocarla antes de que se ejecuten las funciones:

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## Integración de la política de permisos

Para usar la API en iframes, debe habilitarla con la [Política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/), que define un mecanismo que permite habilitar y deshabilitar selectivamente varias API y funciones del navegador. Concretamente, debe pasar una o ambas de las opciones siguientes: `clipboard-read` o `clipboard-write`, según las necesidades de su aplicación.

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## Detección de características

Para usar la API del portapapeles asíncrono de forma compatible con todos los navegadores, prueba `navigator.clipboard` y recurre a métodos anteriores. Por ejemplo, así es como puede implementar el pegado para incluir otros navegadores:

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Got pasted text: ', text);
});
```

Eso no es todo. Antes de la API del portapapeles asíncrono, había una combinación de diferentes implementaciones de copiar y pegar en los navegadores web. En la mayoría de los navegadores, la función de copiar y pegar del navegador se puede activar mediante `document.execCommand('copy')` y `document.execCommand('paste')`. Si el texto que se va a copiar es una cadena que no está presente en el DOM, debe inyectarse en el DOM y seleccionarse:

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
});
```

En Internet Explorer, también puede acceder al portapapeles a través de `window.clipboardData`. Si se accede mediante un gesto de usuario, como un evento de clic, que forma parte de las solicitudes de permiso responsables, no se muestra ningún mensaje de permiso.

## Demostraciones

Puede probar la API del portapapeles asíncrono en las demostraciones a continuación o [directamente en Glitch](https://async-clipboard-api.glitch.me/).

El primer ejemplo muestra cómo mover texto dentro y fuera del portapapeles.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Para probar la API con imágenes, use esta demostración. Recuerde que solo se admiten archivos PNG y solo en [algunos navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility).

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Próximos pasos

Chrome está trabajando activamente para expandir la API del portapapeles asíncrono con eventos simplificados alineados con la [API de arrastrar y soltar (Drag and Drop API)](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API). Debido a los riesgos potenciales, Chrome está avanzando de forma cuidadosa. Para mantenerse actualizado sobre el progreso de Chrome, vea este artículo y nuestro [blog](/blog/) para obtener actualizaciones.

Por ahora, la compatibilidad con la API del Portapapeles está disponible en [varios navegadores](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility).

¡Feliz copiar y pegar!

## Enlaces relacionados

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## Agradecimientos

[Darwin Huang](https://www.linkedin.com/in/darwinhuang/) y [Gary Kačmarčík](https://www.linkedin.com/in/garykac/) implementaron la API del portapapeles asíncrono. Darwin también proporcionó la demostración. Gracias a [Kyarik](https://github.com/kyarik) y nuevamente a Gary Kačmarčík por revisar partes de este artículo.

Hero image de [Markus Winkler](https://unsplash.com/@markuswinkler) en [Unsplash](https://unsplash.com/photos/7iSEHWsxPLw).
