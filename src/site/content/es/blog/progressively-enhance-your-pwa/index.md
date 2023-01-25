---
layout: post
title: Mejore progresivamente su aplicación web progresiva
subhead: Diseñando para navegadores modernos y mejorando progresivamente como en 2003
authors:
  - thomassteiner
description: Aprenda a mejorar progresivamente su aplicación web progresiva para que siga siendo útil en todos los navegadores modernos, pero ofreciendo una experiencia avanzada en navegadores que admiten nuevas capacidades web como acceso al sistema de archivos, acceso al portapapeles del sistema, recuperación de contactos, sincronización periódica en segundo plano, bloqueo de activación de pantalla, funciones para compartir web, y muchos más.
scheduled: true
date: 2020-06-29
updated: 2020-07-10
tags:
  - blog
  - capabilities
  - progressive-web-apps
hero: image/admin/0uSwSmGHmPXimU3dz8Xa.jpg
alt: Una imagen de un pez.
thumbnail: image/admin/X84uooDup0B9OYWY4ZKh.jpg
---

{% YouTube 'NXCT3htg9nk' %}

En marzo de 2003, [Nick Finck](https://twitter.com/nickf) y [Steve Champeon](https://twitter.com/schampeo) sorprendieron al mundo del diseño web con el concepto de [mejora progresiva](http://www.hesketh.com/publications/inclusive_web_design_for_the_future/), una estrategia para el diseño web que enfatiza la carga del contenido principal de la página web en primer lugar, y que luego agrega progresivamente capas de presentación y características más matizadas y técnicamente rigurosas sobre el contenido. Mientras que en 2003, la mejora progresiva consistía en usar, en ese momento, características modernas de CSS, JavaScript discreto e incluso gráficos vectoriales escalables. La mejora progresiva en 2020 y después se trata de utilizar [las capacidades de los navegadores modernos](https://developer.chrome.com/blog/fugu-status/).

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IEOd4MT9BqnbeXQ7z0vC.png", alt="Diseño web inclusivo para el futuro con mejoras progresivas. Diapositiva de título de la presentación original de Finck y Champeon.", width="800", height="597" %}
<figcaption>
 Diapositiva: Diseño web inclusivo para el futuro con mejoras progresivas.
 (<a href="http://www.hesketh.com/publications/inclusive_web_design_for_the_future/">Fuente</a>)
 </figcaption>
 </figure>

## JavaScript moderno

Hablando de JavaScript, la situación de compatibilidad del navegador para las últimas funciones básicas de JavaScript de ES 2015 es excelente. El nuevo estándar incluye promesas, módulos, clases, literales de plantilla, funciones de flecha, `let` y `const`, parámetros predeterminados, generadores, asignación de desestructuración, descanso y extensión, `Map`/`Set`, `WeakMap`/`WeakSet`, y muchos más. [Todos son compatibles](https://caniuse.com/#feat=es6).

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sYcABrEPMr01C2ilp4B0.png", alt="La tabla de compatibilidad de CanIUse para las funciones de ES6 que muestra la compatibilidad con todos los navegadores principales.", width="800", height="296" %}
<figcaption>
 La tabla de compatibilidad del navegador ECMAScript 2015 (ES6). (<a href="https://caniuse.com/#feat=es6">Fuente</a>)
 </figcaption>
</figure>

Las funciones asincrónicas, una característica de ES 2017 y una de mis favoritas, [se pueden utilizar](https://caniuse.com/#feat=async-functions) en todos los navegadores principales. Las palabras clave `async` y `await` permiten que el comportamiento asincrónico basado en promesas se escriba en un estilo más limpio, evitando la necesidad de configurar explícitamente cadenas de promesas.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0WFlQTFFTlqXKvpROMu9.png", alt="La tabla de compatibilidad de CanIUse para funciones asíncronas que muestra compatibilidad en todos los navegadores principales.", width="800", height="247" %}
 <figcaption>
  La tabla de soporte del navegador de funciones asíncronas. (<a href="https://caniuse.com/#feat=async-functions">Fuente</a>)
  </figcaption>
</figure>

Incluso adiciones de lenguaje ES 2020 súper recientes, como el [encadenamiento opcional](https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining) y la[fusión nula](https://caniuse.com/#feat=mdn-javascript_operators_nullish_coalescing), se tornaron compatibles muy rápidamente. Puede ver un ejemplo de código a continuación. Cuando se trata de funciones básicas de JavaScript, la situación no podría estar mejor al día de hoy.

```js
const adventurer = {
  name: 'Alice',
  cat: {
    name: 'Dinah',
  },
};
console.log(adventurer.dog?.name);
// Expected output: undefined
console.log(0 ?? 42);
// Expected output: 0
```

<figure data-size="full">
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/v1nhcTV9aaqPKd9oRvYz.png", alt="La imagen de fondo de hierba verde icónica de Windows XP.", width="800", height="500" %}
 <figcaption>
  Está mejor que nunca cuando se trata de funciones básicas de JavaScript (captura de pantalla de producto de Microsoft, utilizada con <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/permissions/default">permiso</a>.)</figcaption></figure>

## La aplicación de muestra: Fugu Greetings

Para este artículo, trabajo con una PWA simple, llamada [Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/) ([GitHub](https://github.com/tomayac/fugu-greetings)). El nombre de esta aplicación es un homenaje al Project Fugu 🐡, un esfuerzo por darle a la web todos los poderes de las aplicaciones de escritorio/Android/iOS. Puede leer más sobre el proyecto en su [página de inicio](https://developer.chrome.com/blog/fugu-status).

Fugu Greetings es una aplicación de dibujo que te permite crear tarjetas de felicitación virtuales y enviárselas a tus seres queridos. Ejemplifica [los conceptos centrales de PWA](/progressive-web-apps/). Es [confiable](/reliable/) y está completamente habilitada sin conexión, por lo que puede usarla incluso si no está conectado a una red. También se puede [instalar](/install-criteria/) en la pantalla de inicio de un dispositivo y se integra perfectamente con el sistema operativo como una aplicación independiente.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0id013BKBF2z7m70TrX.png", alt="PWA Fugu Greetings con un dibujo que se asemeja al logo de la comunidad de PWA.", width="800", height="543" %}
<figcaption>
 La aplicación de muestra <a href="https://tomayac.github.io/fugu-greetings/public/">Fugu Greetings.</a>
 </figcaption>
 </figure>

## Mejora progresiva

Con esto fuera del camino, es hora de hablar sobre la *mejora progresiva*. El glosario de MDN Web Docs [define](https://developer.mozilla.org/docs/Glossary/Progressive_Enhancement) el concepto de la siguiente manera:

{% Blockquote 'MDN contributors' %}
La mejora progresiva es una filosofía de diseño que proporciona una línea de base de contenido y funcionalidad esenciales para tantos usuarios como sea posible, al tiempo que brinda la mejor experiencia posible solo a los usuarios de los navegadores más modernos que pueden ejecutar todo el código requerido.

[La detección de características](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) se usa generalmente para determinar si los navegadores pueden manejar una funcionalidad más moderna, mientras que los [polyfills](https://developer.mozilla.org/docs/Glossary/Polyfill) se usan a menudo para agregar características faltantes con JavaScript.

[…]

La mejora progresiva es una técnica útil que permite a los desarrolladores web concentrarse en desarrollar los mejores sitios web posibles mientras hacen que esos sitios web funcionen en múltiples agentes de usuario desconocidos. [La degradación elegante](https://developer.mozilla.org/docs/Glossary/Graceful_degradation) está relacionada, pero no es lo mismo y, a menudo, se considera que va en la dirección opuesta a la mejora progresiva. En realidad, ambos enfoques son válidos y, a menudo, pueden complementarse entre sí. {% endBlockquote %}

{% Aside 'note' %}
 Este no es un artículo introductorio sobre la mejora progresiva, pero se supone que está familiarizado con el concepto. Para una base sólida, recomiendo el artículo de Steve Champeon [Mejora progresiva y el futuro del diseño web](http://www.hesketh.com/progressive_enhancement_and_the_future_of_web_design.html).
{% endAside %}

Comenzar cada tarjeta de felicitación desde cero puede ser realmente engorroso. Entonces, ¿por qué no tener una función que permita a los usuarios importar una imagen y comenzar desde allí? Con un enfoque tradicional, habría utilizado un elemento [`<input type=file>`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file) para que esto suceda. Primero, crearía el elemento, establecería su `type` en `'file'` y agregaría tipos MIME a la propiedad `accept`, y luego haría "clic" en él mediante programación y sondaría los cambios. Cuando seleccione una imagen, se importa directamente al lienzo.

```js
const importImage = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
      resolve(input.files[0]);
    });
    input.click();
  });
};
```

Cuando hay una *función de importación*, probablemente debería haber una *función de exportación* para que los usuarios puedan guardar sus tarjetas de felicitación localmente. La forma tradicional de guardar archivos es crear un enlace de anclaje con un atributo [`download`](https://developer.mozilla.org/docs/Web/HTML/Element/a#download) y con una URL de blob como su `href`. También debería "hacer clic" en él mediante programación para activar la descarga y, con suerte, para evitar pérdidas de memoria, no olvide revocar la URL del objeto blob.

```js
const exportImage = async (blob) => {
  const a = document.createElement('a');
  a.download = 'fugu-greeting.png';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
```

Pero espere un minuto. Mentalmente, no ha "descargado" una tarjeta de felicitación, la ha "guardado". En lugar de mostrarle un cuadro de diálogo "guardar" que le permite elegir dónde colocar el archivo, el navegador descargó directamente la tarjeta de felicitación sin interacción del usuario y la colocó directamente en su carpeta Downloads. Esto no es lo ideal.

¿Y si hubiera una forma mejor? ¿Qué pasaría si pudiera abrir un archivo local, editarlo y luego guardar las modificaciones, ya sea en un archivo nuevo o en el archivo original que había abierto inicialmente? Resulta que la hay. La [API de acceso al sistema de archivos](/file-system-access/) (File System Access API) le permite abrir y crear archivos y directorios, así como modificarlos y guardarlos.

Entonces, ¿cómo detecto una API? La API de acceso al sistema de archivos expone un nuevo método `window.chooseFileSystemEntries()`. En consecuencia, necesito cargar condicionalmente diferentes módulos de importación y exportación dependiendo de si este método está disponible. Demuestro cómo hacer esto a continuación.

```js
const loadImportAndExport = () => {
  if ('chooseFileSystemEntries' in window) {
    Promise.all([
      import('./import_image.mjs'),
      import('./export_image.mjs'),
    ]);
  } else {
    Promise.all([
      import('./import_image_legacy.mjs'),
      import('./export_image_legacy.mjs'),
    ]);
  }
};
```

Pero antes de entrar de lleno en los detalles de la API de acceso al sistema de archivos, permítanme destacar rápidamente el patrón de mejora progresiva aquí. En los navegadores que actualmente no son compatibles con la API de acceso al sistema de archivos, cargo los scripts heredados. Puede ver las pestañas de red de Firefox y Safari a continuación.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rnPL8xIMt6HJEUbDfrez.png", alt="Safari Web Inspector muestra los archivos heredados que se cargan.", width="800", height="114" %}
<figcaption>
 Pestaña de red Safari Web Inspector.
 </figcaption>
 </figure>

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bui4rcv0jvlVLHI3jBoo.png", alt="Herramientas de desarrollo de Firefox que muestran los archivos heredados que se cargan.", width="800", height="166" %}
<figcaption>
 Pestaña de red Firefox Developer Tools.
 </figcaption>
 </figure>

Sin embargo, en Chrome, un navegador que admite la API, solo se cargan los nuevos scripts. Esto se hace posible de forma elegante gracias a [dynamic `import()`](https://v8.dev/features/dynamic-import), que todos los navegadores modernos [soportan](https://caniuse.com/#feat=es6-module-dynamic-import). Como dije anteriortmente, las cosas van viento en popa hoy en día.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/plf6kGtFE8g9Fjogv8ia.png", alt="Chrome DevTools que muestra los archivos modernos que se cargan.", width="800", height="241" %}
<figcaption>
 Pestaña de red Chrome DevTools.
 </figcaption>
 </figure>

## La API de acceso al sistema de archivos

Entonces, ahora que he abordado esto, es hora de ver la implementación real basada en la API de acceso al sistema de archivos. Para importar una imagen, llamo `window.chooseFileSystemEntries()` y le paso una propiedad `accepts` donde establezco que quiero archivos de imagen. Se admiten tanto extensiones de archivo como los tipos MIME. Esto da como resultado un identificador de archivo, del cual puedo obtener el archivo real llamando a `getFile()`.

```js
const importImage = async () => {
  try {
    const handle = await window.chooseFileSystemEntries({
      accepts: [
        {
          description: 'Image files',
          mimeTypes: ['image/*'],
          extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        },
      ],
    });
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Exportar una imagen es casi lo mismo, pero esta vez necesito pasar un parámetro de tipo de `'save-file'` al método `chooseFileSystemEntries()`. A partir de esto, obtengo un cuadro de diálogo para guardar archivos. Con el archivo abierto, esto no era necesario porque `'open-file'` es el valor predeterminado. He establecido el parámetro `accepts` de forma similar al anterior, pero esta vez limitado solamente a imágenes PNG. Nuevamente, recupero un identificador de archivo, pero en lugar de obtener el archivo, esta vez creo una secuencia de escritura llamando a `createWritable()`. A continuación, escribo el blob, que es la imagen de mi tarjeta de felicitación, en el archivo. Finalmente, cierro la secuencia de escritura.

Todo puede fallar: el disco podría quedarse sin espacio, podría haber un error de escritura o lectura, o tal vez simplemente el usuario cancele el cuadro de diálogo del archivo. Es por eso que siempre envuelvo las llamadas en una declaración `try...catch`.

```js
const exportImage = async (blob) => {
  try {
    const handle = await window.chooseFileSystemEntries({
      type: 'save-file',
      accepts: [
        {
          description: 'Image file',
          extensions: ['png'],
          mimeTypes: ['image/png'],
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Utilizando la mejora progresiva con la API de acceso al sistema de archivos, puedo abrir un archivo como antes. El archivo importado se dibuja directamente en el lienzo. Puedo hacer mis ediciones y finalmente guardarlas con un cuadro de diálogo de guardado real donde puedo elegir el nombre y la ubicación de almacenamiento del archivo. Ahora el archivo está listo para conservarse por la eternidad.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEKHbetFMURVWh4QPRJw.png", alt="Aplicación Fugu Greetings con un cuadro de diálogo para abrir archivo.", width="800", height="480" %}
<figcaption>
 El diálogo abrir de archivo.
 </figcaption>
 </figure>

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tls52mkxDB513SzzcfNj.png", alt="La aplicación Fugu Greetings ahora con una imagen importada.", width="800", height="480" %}
<figcaption>
 La imagen importada.
 </figcaption>
 </figure>

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3LwHvtROaN1bHJN1El5D.png", alt="Aplicación Fugu Greetings con la imagen modificada", width="800", height="480" %}
<figcaption>
 Guardando la imagen modificada en un nuevo archivo.
</figcaption>
</figure>

## Las API Web Share y Web Share Target

Además de almacenarla por toda la eternidad, tal vez realmente quiera compartir mi tarjeta de felicitación. Esto es algo que la [API Web Share](/web-share/) y la [API Web Share Target](/web-share-target/) me permiten hacer. Los sistemas operativos móviles y, más recientemente, los de escritorio, han adquirido mecanismos de intercambio integrados. Por ejemplo, a continuación se muestra la hoja para compartir de Safari de escritorio en macOS activada desde un artículo de mi [blog](https://blog.tomayac.com/). Cuando hace clic en el botón **Compartir artículo**, puedes compartir un enlace al artículo con un amigo, por ejemplo, a través de la aplicación Mensajes de macOS.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sinRHRHFgSgwAC7x8dIZ.png", alt="Hoja para compartir de Desktop Safari en macOS activada desde el botón Compartir de un artículo", width="800", height="423" %}
<figcaption>
 API Web Share en Safari de escritorio para macOS.
 </figcaption>
 </figure>

El código para que esto suceda es bastante sencillo. Llamo `navigator.share()` y le paso un `title`, un `text` y un `url` opcionales en un objeto. Pero, ¿y si quiero adjuntar una imagen? El nivel 1 de la API Web Share aún no admite esto. La buena noticia es que Web Share Level 2 ha agregado capacidades para compartir archivos.

```js
try {
  await navigator.share({
    title: 'Check out this article:',
    text: `"${document.title}" by @tomayac:`,
    url: document.querySelector('link[rel=canonical]').href,
  });
} catch (err) {
  console.warn(err.name, err.message);
}
```

Déjame mostrarte cómo hacer que esto funcione con la aplicación Fugu Greetings. Primero, necesito preparar un objeto de `data` con un array de `archivos` que consiste de un blob, y luego un `title` y un `text`. A continuación, como práctica recomendada, utilizo el nuevo `navigator.canShare()` que hace lo que sugiere su nombre: me dice si el objeto de `data` que estoy tratando de compartir puede técnicamente ser compartido por el navegador. Si `navigator.canShare()` me dice que los datos se pueden compartir, estoy listo para llamar a `navigator.share()` como antes. Como todo puede fallar, de nuevo estoy usando un bloque `try...catch`.

```js
const share = async (title, text, blob) => {
  const data = {
    files: [
      new File([blob], 'fugu-greeting.png', {
        type: blob.type,
      }),
    ],
    title: title,
    text: text,
  };
  try {
    if (!(navigator.canShare(data))) {
      throw new Error("Can't share data.", data);
    }
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Como antes, utilizo la mejora progresiva. Si tanto `'share'` como `'canShare'` existen en el objeto `navigator`, solo entonces cargo `share.mjs` a través de la `import()` dinámica. En navegadores como Safari móvil que solo cumplen una de las dos condiciones, no cargo la funcionalidad.

```js
const loadShare = () => {
  if ('share' in navigator && 'canShare' in navigator) {
    import('./share.mjs');
  }
};
```

En Fugu Greetings, si toco el botón **Compartir** en un navegador compatible como Chrome en Android, se abre la hoja para compartir incorporada. Puedo, por ejemplo, escoger Gmail, y el widget del redactor de correo electrónico aparece con la imagen adjunta.

<div class="switcher">
  <figure>
   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/szInJQl908kv9GEU8EJf.png", alt="Hoja para compartir a nivel de SO que muestra varias aplicaciones para compartir la imagen.", width="800", height="1645" %}
   <figcaption>
    Elección de una aplicación para compartir el archivo.
   </figcaption>
  </figure>

  <figure>
   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mKmdg1OMGpWDukmfSSOl.png", alt="Widget de redacción de correo electrónico de Gmail con la imagen adjunta.", width = "800", height = "1645" %}
   <figcaption>
     El archivo se adjunta a un nuevo correo electrónico en el redactor de Gmail.
   </figcaption>
  </figure>
</div>

## La API de selección de contactos

A continuación, quiero hablar sobre contactos, es decir, la libreta de direcciones de un dispositivo o la aplicación de administrador de contactos. Cuando escribe una tarjeta de felicitación, puede que no siempre sea fácil escribir correctamente el nombre de alguien. Por ejemplo, tengo un amigo Sergey que prefiere que su nombre se escriba en cirílico. Estoy usando un teclado QWERTZ alemán y no tengo idea de cómo escribir su nombre. Este es un problema que la [API de selecciónr de contactos](/contact-picker/) puede resolver. Como tengo a mi amigo almacenado en la aplicación de contactos de mi teléfono, puedo acceder a mis contactos desde la web a través de esta API.

Primero, necesito especificar la lista de propiedades a las que quiero acceder. En este caso, solo quiero los nombres, pero para otros casos de uso, podría estar interesado en números de teléfono, correos electrónicos, íconos de avatar o direcciones físicas. A continuación, configuro un objeto `options` con el valor de `multiple` ajustado en `true`, de modo que puedo seleccionar más de una entrada. Finalmente, puedo llamar a `navigator.contacts.select()`, que devuelve las propiedades deseadas para los contactos seleccionados por el usuario.

```js
const getContacts = async () => {
  const properties = ['name'];
  const options = { multiple: true };
  try {
    return await navigator.contacts.select(properties, options);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Y probablemente ya ha aprendido el patrón: solo cargo el archivo cuando la API es realmente compatible.

```js
if ('contacts' in navigator) {
  import('./contacts.mjs');
}
```

En Fugu Greeting, cuando toco el **botón Contactos** y selecciono a mis dos mejores amigos,
[Сергей Михайлович Брин](https://ru.wikipedia.org/wiki/%D0%91%D1%80%D0%B8%D0%BD,_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9_%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D0%B8%D1%87) y [劳伦斯·爱德华·"拉里"·佩奇](https://zh.wikipedia.org/wiki/%E6%8B%89%E9%87%8C%C2%B7%E4%BD%A9%E5%A5%87), puedes ver cómo el selector de contactos se limita a mostrar solo sus nombres, pero no sus direcciones de correo electrónico u otra información como sus números de teléfono. Luego, sus nombres se incorporan a mi tarjeta de felicitación.

<div class="switcher">
  <figure>
   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/T5gmSr1XGiVIV9Pw1HbC.png", alt="Selector de contactos que muestra los nombres de dos contactos en la libreta de direcciones.", width="800", height="1645" %}
   <figcaption>
    Selección de dos nombres con el selector de contactos de la libreta de direcciones.
   </figcaption>
   </figure>

  <figure>
   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ioMOCEHwvwdyzS7DX5L8.png", alt="Los nombres de los dos contactos seleccionados previamente incorporados a la tarjeta de felicitación.", width="800", height="1644" %}
   <figcaption>
    Luego, los dos nombres se incorporan a la tarjeta de felicitación.
   </figcaption>
  </figure>
</div>


## La API del portapapeles asíncrono

Lo siguiente es copiar y pegar. Una de nuestras operaciones favoritas como desarrolladores de software es copiar y pegar. Como autor de tarjetas de felicitación, a veces, es posible que desee hacer lo mismo. Es posible que quiera pegar una imagen en una tarjeta de felicitación en la que estoy trabajando o copiar mi tarjeta de felicitación para poder seguir editándola desde otro lugar. La [API del portapapeles asíncrono](/image-support-for-async-clipboard/) (API Async Clipboard) admite texto e imágenes. Déjame explicarte cómo agregué el soporte para copiar y pegar a la aplicación Fugu Greetings.

Para copiar algo en el portapapeles del sistema, necesito escribir en él. El `navigator.clipboard.write()` toma una matriz de elementos del portapapeles como parámetro. Cada elemento del portapapeles es esencialmente un objeto con un blob como valor y el tipo del blob como clave.

```js
const copy = async (blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Para pegar, necesito recorrer los elementos obtenidos del portapapeles llamando a `navigator.clipboard.read()`. La razón de esto es que varios elementos del portapapeles pueden estar en el portapapeles en diferentes representaciones. Cada elemento del portapapeles tiene un campo `types` que me dice los tipos MIME de los recursos disponibles. Llamo al `getType()` del elemento del portapapeles, pasando el tipo MIME que obtuve antes.

```js
const paste = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      try {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          return blob;
        }
      } catch (err) {
        console.error(err.name, err.message);
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

Y prácticamente no hace falta decirlo a estas alturas. Solo hago esto en navegadores compatibles.

```js
if ('clipboard' in navigator && 'write' in navigator.clipboard) {
  import('./clipboard.mjs');
}
```

Entonces, ¿cómo funciona esto en la práctica? Tengo una imagen abierta en la aplicación macOS Preview y la copio al portapapeles. Cuando hago clic en **Pegar**, la aplicación Fugu Greetings me pregunta si quiero permitir que la aplicación vea texto e imágenes en el portapapeles.

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EO9BemEDnDtO3SvLl8u5.png", alt="La aplicación Fugu Greetings muestra la solicitud de permiso del portapapeles.", width="800", height="543" %}
 <figcaption>
  La solicitud de permiso del portapapeles.
  </figcaption>
</figure>

Finalmente, después de aceptar el permiso, la imagen se pega en la aplicación. También funciona al revés. Déjame copiar una tarjeta de felicitación en el portapapeles. Cuando abro Preview y hago clic en **File** y luego en **New desde el portapapeles**, la tarjeta de felicitación se pega en una nueva imagen sin título.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VAkvEYWsQsJ0VJ8IjEs1.png", alt="La aplicación de vista previa de macOS con una imagen sin título, recién pegada.", width="800", height="464" %}
<figcaption>
 Una imagen pegada en la aplicación macOS Preview.
 </figcaption>
 </figure>

## La API de credenciales

Otra API útil es la [API de credenciales](/badging-api/) (Badging API). Como PWA instalable, Fugu Greetings, por supuesto, tiene un ícono de aplicación que los usuarios pueden colocar en la barra de tareas o en la pantalla de inicio. Una forma fácil y divertida de demostrar la API es (ab) usarla en Fugu Greetings como un contador de trazos de lápiz. He agregado un detector de eventos que incrementa el contador de trazos de lápiz a cada evento `pointerdown` y luego establece la credencial del icono actualizada. Siempre que se borra el lienzo, el contador se reinicia y se quita la credencial.

```js
let strokes = 0;

canvas.addEventListener('pointerdown', () => {
  navigator.setAppBadge(++strokes);
});

clearButton.addEventListener('click', () => {
  strokes = 0;
  navigator.setAppBadge(strokes);
});
```

Esta característica es una mejora progresiva, por lo que la lógica de carga es la habitual.

```js
if ('setAppBadge' in navigator) {
  import('./badge.mjs');
}
```

En este ejemplo, dibujé los números del uno al siete, usando un trazo de lápiz por número. El contador de insignias en el icono ahora está en siete.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uKurKxYeRlLCLXJYhX9I.png", alt="Los números del uno al siete dibujados en la tarjeta de felicitación, cada uno con un solo trazo de lápiz.", width="800", height="480" %}
 <figcaption>
  Dibujo de los números del 1 al 7 con siete trazos de lápiz.
 </figcaption>
</figure>

<figure>
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5uOcN2MdjKVnWXRyTmCG.png", alt="Icono de insignia en la aplicación Fugu Greetings que muestra el número 7.", width="742", height="448" %}
<figcaption>
El contador de trazos de lápiz tiene la forma de la credencial del icono de la aplicación.
</figcaption>
</figure>

## La API de sincronización periódica en segundo plano

¿Quiere empezar cada día con algo nuevo? Una característica interesante de la aplicación Fugu Greetings es que puede inspirarte cada mañana con una nueva imagen de fondo para comenzar tu tarjeta de felicitación. La aplicación utiliza la [API de sincronización periódica en segundo plano](/periodic-background-sync/) para lograr esto.

El primer paso es *registrar* un evento de sincronización periódica en el registro del service worker. Escucha una etiqueta de sincronización llamada `'image-of-the-day'` y tiene un intervalo mínimo de un día, por lo que el usuario puede obtener una nueva imagen de fondo cada 24 horas.

```js
const registerPeriodicBackgroundSync = async () => {
  const registration = await navigator.serviceWorker.ready;
  try {
    registration.periodicSync.register('image-of-the-day-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};
```

El segundo paso es *escuchar* el evento `periodicsync` en el service worker. Si la etiqueta del evento es `'image-of-the-day'`, es decir, la que se registró antes, la imagen del día se recupera mediante la función `getImageOfTheDay()` y el resultado se propaga a todos los clientes, para que puedan actualizar sus lienzos y cachés.

```js
self.addEventListener('periodicsync', (syncEvent) => {
  if (syncEvent.tag === 'image-of-the-day-sync') {
    syncEvent.waitUntil(
      (async () => {
        const blob = await getImageOfTheDay();
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            image: blob,
          });
        });
      })()
    );
  }
});
```

Nuevamente, esto es realmente una mejora progresiva, por lo que el código solo se carga cuando la API es compatible con el navegador. Esto se aplica tanto al código del cliente como al código del service worker. En los navegadores que no son compatibles, ninguno de ellos se carga. Nota cómo en el service worker, en lugar de un `import()` dinámico (que no es compatible en el contexto del service worker [yet](https://github.com/w3c/ServiceWorker/issues/1356#issuecomment-433411852)), utilizo los clásicos [`importScripts()`](https://developer.mozilla.org/docs/Web/API/WorkerGlobalScope/importScripts).

```js
// In the client:
const registration = await navigator.serviceWorker.ready;
if (registration && 'periodicSync' in registration) {
  import('./periodic_background_sync.mjs');
}
```

```js
// In the service worker:
if ('periodicSync' in self.registration) {
  importScripts('./image_of_the_day.mjs');
}
```

En Fugu Greetings, al presionar el botón **Fondo de pantalla** se muestra la imagen de la tarjeta de felicitación del día que se actualiza todos los días a través de la API de sincronización periódica en segundo plano.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YdSHSI4pZcTPyVv8CVx8.png", alt="Aplicación Fugu Greetings con una nueva imagen de tarjeta de felicitación del día.", width="800", height="481" %}
 <figcaption>
  Al presionar el botón <strong>Fondo de pantalla</strong> se muestra la imagen del día.
 </figcaption>
</figure>

## API de activación de notificaciones

A veces, incluso con mucha inspiración, necesita un pequeño empujón para terminar una tarjeta de felicitación iniciada. Esta es una función que está habilitada por la [API de activación de notificaciones](/notification-triggers/). Como usuario, puedo ingresar una hora en la que quiero que me notifiquen para terminar mi tarjeta de felicitación. Cuando llegue ese momento, recibiré una notificación de que mi tarjeta de felicitación está esperando.

Después de solicitar el tiempo objetivo, la aplicación programa la notificación con un `showTrigger`. Puede ser un `TimestampTrigger` con la fecha objetivo previamente seleccionada. La notificación de recordatorio se activará localmente, no se necesita red ni servidor.

```js
const targetDate = promptTargetDate();
if (targetDate) {
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Reminder', {
    tag: 'reminder',
    body: "It's time to finish your greeting card!",
    showTrigger: new TimestampTrigger(targetDate),
  });
}
```

Como con todo lo demás que he mostrado hasta ahora, esta es una mejora progresiva, por lo que el código solo se carga condicionalmente.

```js
if ('Notification' in window && 'showTrigger' in Notification.prototype) {
  import('./notification_triggers.mjs');
}
```

Cuando marco la casilla de verificación **Recordatorio** en Fugu Greetings, un mensaje me pregunta cuándo quiero que se me recuerde que debo terminar mi tarjeta de felicitación.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xtD7PtIIBO0Yn1ISFSyz.png", alt="Aplicación Fugu Greetings con un mensaje que pregunta al usuario cuándo quiere que se le recuerde que termine su tarjeta de felicitación.", width="800", height="480" %}
  <figcaption>
   Programación de una notificación local para recordarle que debe terminar una tarjeta de felicitación.
  </figcaption>
</figure>

Cuando se activa una notificación programada en Fugu Greetings, se muestra como cualquier otra notificación, pero como escribí antes, no fue necesaria una conexión de red.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e1FJA11UE3lrL1d4mCCo.png", alt="Centro de notificaciones de macOS que muestra una notificación activada de Fugu Greetings.", width="300", height="172" %}
  <figcaption>
   La notificación activada aparece en el Centro de notificaciones de macOS.
  </figcaption>
</figure>

## La API de Wake Lock

También quiero incluir la [API de Wake Lock](/wakelock/) . A veces solo necesitas mirar fijamente la pantalla el tiempo suficiente hasta que la inspiración te llegue. Lo peor que puede pasar es que la pantalla se apague. La API de Wake Lock puede evitar que esto suceda.

El primer paso es obtener un wake lock con el `navigator.wakelock.request method()`. Le paso la cadena `'screen'` para obtener un wake lock. Luego agrego un detector de eventos para ser informado cuando se libera el wake lock. Esto puede suceder, por ejemplo, cuando cambia la visibilidad de la pestaña. Si esto sucede, puedo, cuando la pestaña vuelva a ser visible, volver a obtener el wake lock.

```js
let wakeLock = null;
const requestWakeLock = async () => {
  wakeLock = await navigator.wakeLock.request('screen');
  wakeLock.addEventListener('release', () => {
    console.log('Wake Lock was released');
  });
  console.log('Wake Lock is active');
};

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', handleVisibilityChange);
```

Sí, esta es una mejora progresiva, por lo que solo necesito cargarla cuando el navegador admita la API.

```js
if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
  import('./wake_lock.mjs');
}
```

En Fugu Greetings, hay una **casilla de verificación Insomnia** que, cuando está marcada, mantiene la pantalla activa.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kB5LkdV3cVKaJ0Xze76v.png", alt="La casilla de insomnia, si está marcada, mantiene la pantalla activa.", width="800", height="480" %}
 <figcaption>
  La casilla de verificación <strong>Insomnia</strong> mantiene la aplicación activa.
 </figcaption>
</figure>

## La API de detección de inactividad

A veces, incluso si miras la pantalla durante horas, es inútil y no se te ocurre la menor idea de qué hacer con tu tarjeta de felicitación. La [API de detección de inactividad](/idle-detection/) permite que la aplicación detecte el tiempo de inactividad del usuario. Si el usuario está inactivo durante demasiado tiempo, la aplicación se restablece al estado inicial y borra el lienzo. Esta API actualmente está bloqueada detrás del [permiso de notificaciones](https://developer.mozilla.org/docs/Web/API/Notification/requestPermission) , ya que muchos casos de uso de producción de detección inactiva están relacionados con notificaciones, por ejemplo, para enviar solo una notificación a un dispositivo que el usuario está usando actualmente de forma activa.

Después de asegurarme de que se otorgue el permiso de notificaciones, entonces creo una instancia del detector inactivo. Registro un detector de eventos que escucha los cambios inactivos, que incluye el usuario y el estado de la pantalla. El usuario puede estar activo o inactivo y la pantalla se puede desbloquear o bloquear. Si el usuario está inactivo, el lienzo se borra. Le doy al detector inactivo un umbral de 60 segundos.

```js
const idleDetector = new IdleDetector();
idleDetector.addEventListener('change', () => {
  const userState = idleDetector.userState;
  const screenState = idleDetector.screenState;
  console.log(`Idle change: ${userState}, ${screenState}.`);
  if (userState === 'idle') {
    clearCanvas();
  }
});

await idleDetector.start({
  threshold: 60000,
  signal,
});
```

Y como siempre, solo cargo este código cuando el navegador lo admite.

```js
if ('IdleDetector' in window) {
  import('./idle_detection.mjs');
}
```

En la aplicación Fugu Greetings, el lienzo se borra cuando la casilla de verificación **Ephemeral** está marcada y el usuario está inactivo durante demasiado tiempo.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yq3IsOqp01AZTw7nvfnB.png", alt="La aplicación Fugu Greetings con un lienzo despejado después de que el usuario ha estado inactivo durante demasiado tiempo.", width="800", height="480" %}
  <figcaption>
   Cuando la casilla de verificación <strong>Ephemeral</strong> está marcada y el usuario ha estado inactivo durante demasiado tiempo, el lienzo se borra.
  </figcaption>
</figure>

## Conclusión

Uf, qué paseo. Tantas API en una sola aplicación de muestra. Y recuerde, nunca hacemos que el usuario pague el costo de descarga de una función que su navegador no admite. Al usar la mejora progresiva, me aseguro de que solo se cargue el código relevante. Y dado que con HTTP/2, las solicitudes son baratas, este patrón debería funcionar bien para muchas aplicaciones, aunque es posible que desee considerar un paquete para aplicaciones realmente grandes.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DOnuk7CHPsnbTdlqOHXM.png", alt="El panel Chrome DevTools Network muestra solo solicitudes de archivos con código compatible con el navegador actual.", width="800", height="566" %}
 <figcaption>
  La pestaña de DevTools de Chrome muestra solo las solicitudes de archivos con código compatible con el navegador actual.
 </figcaption>
</figure>

La aplicación puede aparecer un poco diferente en cada navegador, ya que no todas las plataformas admiten todas las funciones, pero la funcionalidad principal siempre está disponible, mejorada progresivamente de acuerdo con las capacidades del navegador específico. Tenga en cuenta que estas capacidades pueden cambiar incluso en el mismo navegador, dependiendo de si la aplicación se ejecuta como una aplicación instalada o en una pestaña del navegador.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/LmUW0CZpH5eXIoHTZ6kH.png", alt="Fugu Greetings en Android Chrome, mostrando muchas funciones disponibles.", width="500", height="243" %}
  <figcaption>
   <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> en ejecución en Android Chrome.
  </figcaption>
</figure>

<figure>
 {% Img src ="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BOcbAW4FCi10d9cGdeNW.png", alt="Fugu Greetings ejecutándose en Safari de escritorio, mostrando menos funciones disponibles.", width="500", height="403" %}
 <figcaption> <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> en ejecución en Safari de escritorio.
 </figcaption>
</figure>

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7zT4BEUzxTkjg8e08OJU.png", alt="Fugu Greetings en ejecución en Chrome para escritorio, mostrando varias funciones disponibles.", width="500", height="348" %}
  <figcaption> <a href="https://github.com/tomayac/fugu-greetings">Fugu Greetings</a> en ejecución en Chrome para escritorios.
  </figcaption>
</figure>

Si está interesado en la [aplicación Fugu Greetings](https://tomayac.github.io/fugu-greetings/public/) búsquelo y [bifúrquelo en GitHub](https://github.com/tomayac/fugu-greetings).

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l260mtBzRi8OxdV8gXSg.png", alt="Repo de Fugu Greetings en GitHub.", width="800", height="490" %}
  <figcaption>
   <a href="https://github.com/tomayac/fugu-greetings">Aplicación Fugu Greetings</a> en GitHub.
  </figcaption>
</figure>

El equipo de Chromium está trabajando duro para hacer que mejorar las API avanzadas de Fugu. Al aplicar mejoras progresivas en el desarrollo de mi aplicación, me aseguro de que todos obtengan una experiencia de referencia sólida e inclusiva, y que las personas que utilizan navegadores que admiten aún más API de plataformas web obtengan una experiencia aún mejor. Espero ver lo que hace con la mejora progresiva en sus aplicaciones.

## Agradecimientos

Mil gracias a [Christian Liebel](https://christianliebel.com/) y [Hemanth HM](https://h3manth.com/) quienes han contribuido a Fugu Greetings. Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley) y [Kayce Basques](https://github.com/kaycebasques). [Jake Archibald](https://github.com/jakearchibald/) me ayudó a descubrir la situación con el `import()` dinámico en el contexto de los service workers.
