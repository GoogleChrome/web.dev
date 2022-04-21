---
title: Recibir datos compartidos con la API de destino de recurso compartido web
subhead: Compartir recursos en dispositivos móviles y de escritorio de forma sencilla con la API de destino de recurso compartido web
authors:
  - petelepage
  - joemedley
date: 2019-11-08
updated: 2021-06-07
hero: image/admin/RfxdrfKdh5Fp8camulRt.png
alt: Una ilustración que demuestra que las aplicaciones específicas de la plataforma ahora pueden compartir contenido con aplicaciones web.
description: En un dispositivo móvil o de escritorio, compartir debería ser tan simple como hacer clic en el botón Compartir, elegir una aplicación y luego elegir con quién compartir. La API de destino de recurso compartido web permite que las aplicaciones web instaladas se registren con el sistema operativo subyacente para recibir contenido compartido.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

En un dispositivo móvil o de escritorio, compartir debería ser tan sencillo como hacer clic en el botón **Compartir**, elegir una aplicación y elegir con quién compartir. Por ejemplo, es posible que desee compartir un artículo interesante, ya sea al enviarlo por correo electrónico a sus amigos o mediante un tuit para todo el mundo.

En el pasado, solo las aplicaciones específicas de la plataforma podían registrarse en el sistema operativo para recibir recursos compartidos de otras aplicaciones instaladas. Pero con la API de destino de recurso compartido web, las aplicaciones web instaladas pueden registrarse con el sistema operativo subyacente como destino de recursos compartidos para recibir contenido compartido.

{% Aside %} La API de destino de recurso compartido web es solo la mitad de la magia. Las aplicaciones web pueden compartir datos, archivos, enlaces o texto mediante la API de recurso compartido web. Consulte el documento [API de recurso compartido web](/web-share/) para obtener más detalles. {% endAside %}

<figure data-float="right">{% Img src="image/admin/Q4nuOQMpsQrTilpXA3fL.png", alt="Teléfono Android con el cajón 'Compartir vía' abierto.", width="400", height="377" %} <figcaption>Selector de destino de recurso compartido a nivel del sistema con una PWA instalada como opción. </figcaption></figure>

## Vea el destino de recurso compartido en acción

1. Mediante Chrome 76 o posterior para Android, o mediante Chrome 89 o posterior equipos de escritorio, abra la [demostración de destino de recurso compartido](https://web-share.glitch.me/).
2. Cuando se le solicite, haga clic en **Instalar** para agregar la aplicación a su pantalla de inicio, o use el menú de Chrome para agregarla a su pantalla de inicio.
3. Abra cualquier aplicación que admita compartir recursos o use el botón Compartir en la aplicación de demostración.
4. En el selector de destino, elija **Prueba de recurso compartido web**.

Después de compartir, debería ver toda la información compartida en la aplicación web de destino de recurso compartido web.

## Registre su aplicación como destino para recursos compartidos

Para registrar su aplicación como destino para recursos compartidos, debe cumplir con los [criterios de instalación de Chrome](https://developers.google.com/web/fundamentals/app-install-banners/#criteria). Además, antes de que un usuario pueda compartir recursos con su aplicación, debe agregarla a su pantalla de inicio. Esto evita que los sitios se agreguen aleatoriamente al selector de intención de compartir del usuario y asegura que compartir recursos sea algo que los usuarios quieran hacer con su aplicación.

## Actualice el manifiesto de su aplicación web

Para registrar su aplicación como destino de recursos compartidos, agregue una entrada `share_target` a su [manifiesto de aplicación web](/add-manifest/). Esto le indica al sistema operativo que incluya su aplicación como una opción en el selector de intención. Lo que usted agrega al manifiesto controla los datos que aceptará su aplicación. Hay tres escenarios comunes para la entrada `share_target`:

- Aceptar información básica
- Aceptar cambios en la aplicación
- Aceptar archivos

{% Aside %} Solo puede tener un `share_target` por manifiesto, si desea compartir en diferentes lugares dentro de su aplicación, dispóngalo como una opción dentro de la página de destino del recurso compartido. {% endAside %}

### Aceptar información básica

Si su aplicación de destino simplemente acepta información básica como datos, enlaces y texto, agregue lo siguiente al archivo `manifest.json`:

```json
"share_target": {
  "action": "/share-target/",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

Si su aplicación ya tiene un esquema de URL de recursos compartidos, puede reemplazar los valores `param` con sus parámetros de consulta existentes. Por ejemplo, si su esquema de URL de recursos compartidos usa `body` en lugar de `text`, puede reemplazar `"text": "text"` por `"text": "body"`.

El valor de `method` se predetermina en `"GET"` si no se proporciona. El campo `enctype`, que no se muestra en este ejemplo, indica el [tipo de codificación](https://developer.mozilla.org/docs/Web/HTML/Element/form#attr-enctype) de los datos. Para el método `"GET"`, el campo `enctype` se predetermina en `"application/x-www-form-urlencoded"` y se ignora si se configura en cualquier otra cosa.

### Aceptar cambios en la aplicación

Si los datos compartidos cambian la aplicación de destino de alguna manera, por ejemplo, al guardar un marcador en la aplicación de destino, establezca el valor `method` en `"POST"` e incluya el campo `enctype`. El siguiente ejemplo crea un marcador en la aplicación de destino, por lo que usa `"POST"` para el `method` y `"multipart/form-data"` para el `enctype`:

```json/4-5
{
  "name": "Bookmark",
  "share_target": {
    "action": "/bookmark",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "url": "link"
    }
  }
}
```

### Aceptar archivos

Al igual que con los cambios en la aplicación, la aceptación de archivos requiere que el `method` sea `"POST"` y que el parámetro `enctype` esté presente. Además, `enctype` debe ser `"multipart/form-data"` y se debe agregar la entrada `files`.

También debe agregar una matriz `files` que defina los tipos de archivo que acepta su aplicación. Los elementos de la matriz son entradas con dos miembros: un campo `name` y un campo `accept`. El campo `accept` toma un tipo MIME, una extensión de archivo o una matriz que los contenga a ambos. Es mejor proporcionar una matriz que incluya tanto un tipo MIME como una extensión de archivo, ya que las preferencias de los sistemas operativos difieren.

```json/5,10-19
{
  "name": "Aggregator",
  "share_target": {
    "action": "/cgi-bin/aggregate",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "name",
      "text": "description",
      "url": "link",
      "files": [
        {
          "name": "records",
          "accept": ["text/csv", ".csv"]
        },
        {
          "name": "graphs",
          "accept": "image/svg+xml"
        }
      ]
    }
  }
}
```

## Manejo del contenido entrante

La forma en que se manejan los datos compartidos entrantes depende de usted y depende de su aplicación. Por ejemplo:

- Un cliente de correo electrónico podría redactar un nuevo correo electrónico mediante el campo `title` como asunto de un correo electrónico, con los campos `text` y `url` concatenados en conjunto como el cuerpo.
- Una aplicación de redes sociales podría redactar una nueva publicación mientras ignora el campo `title`, para usar el campo `text` como el cuerpo del mensaje, además de agregar una `url` como enlace. Si falta el campo `text`, la aplicación también puede usar el campo `url` en el cuerpo. Si falta el campo `url`, la aplicación puede escanear el campo `text` en busca de una URL para agregarla como un enlace.
- Una aplicación para compartir fotos podría crear una nueva presentación de diapositivas al utilizar el campo `title` como el título de la presentación, el campo `text` como descripción y el campo `files` como imágenes de la presentación.
- Una aplicación de mensajería de texto podría redactar un nuevo mensaje al utilizar los campos `text` y `url` concatenados en conjunto mientras excluye el campo `title`.

### Procesamiento de recursos compartidos GET

Si el usuario selecciona su aplicación y el `method` que usted utiliza es `"GET"` (el predeterminado), el navegador abre una nueva ventana en la URL de `action`. Luego, el navegador genera una cadena de consulta mediante los valores codificados en la URL proporcionados en el manifiesto. Por ejemplo, si la aplicación que comparte proporciona los campos `title` y `text`, la cadena de consulta es `?title=hello&text=world`. Para procesar esto, use un detector de eventos `DOMContentLoaded` en su página de primer plano y procese la cadena de consulta:

```js
window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
  // searchParams.get() manejará adecuadamente la decodificación de los valores.
  console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
  console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
  console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
});
```

Asegúrese de utilizar un service worker para [almacenar previamente](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker) la página de `action` para que se cargue rápidamente y funcione de manera confiable, incluso si el usuario no está conectado. [Workbox](https://developer.chrome.com/docs/workbox/) es una herramienta que puede ayudarlo a [implementar el almacenamiento previo en caché](/precache-with-workbox/) en su service worker.

### Procesamiento de recursos compartidos POST

Si su `method` es `"POST"`, como lo sería si su aplicación de destino aceptase un marcador guardado o archivos compartidos, entonces el cuerpo de la solicitud entrante `POST` contiene los datos transmitidos por la aplicación que comparte, codificados con el valor `enctype` proporcionado en el manifiesto.

La página de primer plano no puede procesar estos datos directamente. Dado que la página ve los datos como una solicitud, la página los pasa al service worker, donde usted puede interceptarlos con un detector de eventos `fetch`. Desde aquí, puede pasar los datos a la página de primer plano mediante `postMessage()` o pasarlos al servidor:

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Si esta es una solicitud POST entrante para la
  // URL de "action" registrada, se responde.
  if (event.request.method === 'POST' &&
      url.pathname === '/bookmark') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })());
  }
});
```

### Verificar el contenido compartido

<figure data-float="right">{% Img src="image/admin/hSwbgPk8IFgPC81oJbxZ.png", alt="Un teléfono Android que muestra la aplicación de demostración con contenido compartido", width="400", height="280" %} <figcaption> Ejemplo de aplicación de destino de recurso compartido. </figcaption></figure>

Asegúrese de verificar los datos entrantes. Desafortunadamente, no hay garantía de que otras aplicaciones compartan el contenido apropiado en el parámetro correcto.

Por ejemplo, en Android, el [campo `url` estará vacío](https://bugs.chromium.org/p/chromium/issues/detail?id=789379) porque no es compatible con el sistema de recursos compartidos de Android. En cambio, las URL aparecerán a menudo en el campo `text` u ocasionalmente en el campo `title`.

## Soporte del navegador

Desde principios de 2021, la API de destino de recurso compartido web es compatible con:

- Chrome y Edge 76 o posterior en Android.
- Chrome 89 o posterior en ChromeOS.

En todas las plataformas, su aplicación web debe estar [instalada](https://developers.google.com/web/fundamentals/app-install-banners/#criteria) antes de que aparezca como un objetivo potencial para recibir datos compartidos.

## Aplicaciones de ejemplo

- [Squoosh](https://github.com/GoogleChromeLabs/squoosh)
- [Álbum de recortes PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)

### Muestre su apoyo a la API

¿Está pensando en utilizar la API de destino de recurso compartido web? Su apoyo público ayuda a que el equipo de Chromium priorice las funciones y les muestra a otros proveedores de navegadores lo importante que es brindarle soporte.

Envíe un tuit a [@ChromiumDev](https://twitter.com/ChromiumDev) con el hashtag [`#WebShareTarget`](https://twitter.com/search?q=%23WebShareTarget&src=recent_search_click&f=live) y háganos saber dónde y cómo la está usando.
