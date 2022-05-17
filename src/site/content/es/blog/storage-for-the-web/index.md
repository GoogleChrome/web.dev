---
title: Almacenamiento para la web
subhead: Hay muchas opciones diferentes para almacenar datos en el navegador. ¿Cuál es mejor para sus necesidades?
authors:
  - petelepage
description: Hay muchas opciones diferentes para almacenar datos en el navegador. ¿Cuál es mejor para sus necesidades?
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: Pila de contenedores de envío
feedback:
  - api
---

Las conexiones a Internet pueden ser defectuosas o inexistentes sobre la marcha, por lo que el soporte sin conexión y el rendimiento confiable son características comunes en las [aplicaciones web progresivas](/progressive-web-apps/). Incluso en entornos inalámbricos perfectos, el uso prudente del almacenamiento en caché y otras técnicas de almacenamiento puede mejorar sustancialmente la experiencia del usuario. Hay varias formas de almacenar en caché los recursos de su aplicación estática (HTML, JavaScript, CSS, imágenes, etc.) y los datos (datos de usuario, artículos de noticias, etc.). ¿Pero cuál es la mejor solución? ¿Cuánto puede almacenar? ¿Cómo evita que se vacíe?

## ¿Qué debo usar? {: #recomendación}

Esta es una recomendación general para almacenar recursos:

- Para obtener los recursos de red necesarios para cargar su aplicación y su contenido basado en archivos, use la [**API de almacenamiento en caché**](/cache-api-quick-guide/) (parte de [service workers](https://developer.chrome.com/docs/workbox/service-worker-overview/)).
- Para otros datos, use [**IndexedDB**](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) (con un [promises wrapper](https://www.npmjs.com/package/idb)).

IndexedDB y la API de almacenamiento en caché son compatibles con todos los navegadores modernos. Ambas son asincrónicas y no bloquearán el hilo principal. Se puede acceder a ellas desde el objetivo `window`, los web workers y los service workers, lo que facilita su uso en cualquier parte de su código.

## ¿Qué pasa con otros mecanismos de almacenamiento? {: #otro }

Hay varios otros mecanismos de almacenamiento disponibles en el navegador, pero tienen un uso limitado y pueden causar problemas importantes de rendimiento.

[SessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage) es específico de una pestaña y se ajusta a la vida útil de la pestaña. Puede ser útil para almacenar pequeñas cantidades de información específica de la sesión, por ejemplo, una clave de IndexedDB. Debe usarse con precaución porque es sincrónico y bloqueará el hilo principal. Está limitado a unos 5 MB y solo puede contener cadenas. Debido a que es específico de una pestaña, los web workers o los service workers no pueden acceder a él.

[LocalStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) debe evitarse porque es sincrónico y bloqueará el hilo principal. Está limitado a unos 5 MB y solo puede contener cadenas. LocalStorage no es accesible para web workers o service workers.

Las [cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies) tienen ciertos usos, pero no deben usarse para almacenamiento. Las cookies se envían con cada solicitud HTTP, por lo que almacenar algo más que una pequeña cantidad de datos aumentará significativamente el tamaño de cada solicitud web. Son sincrónicas y los web workers no pueden acceder a ellas. Al igual que LocalStorage y SessionStorage, las cookies se limitan solo a cadenas.

La [API del sistema de archivos](https://developer.mozilla.org/docs/Web/API/File_and_Directory_Entries_API/Introduction) y la API FileWriter proporcionan métodos para leer y escribir archivos en un sistema de archivos de espacio aislado. Si bien es asincrónica, no se recomienda porque solo está [disponible en navegadores basados en Chromium](https://caniuse.com/#feat=filesystem).

La [API de acceso al sistema de archivos](/file-system-access/) se diseñó para facilitarles a los usuarios la lectura y edición de archivos en su sistema de archivos local. El usuario debe otorgar permiso antes de que una página pueda leer o escribir en cualquier archivo local, y los permisos no se conservan entre sesiones.

WebSQL **no** debe utilizarse y el uso existente se debe migrar a IndexedDB. Se ha [eliminado](https://caniuse.com/#feat=sql-storage) la compatibilidad con casi todos los principales navegadores. El W3C [dejó de mantener la especificación Web SQL](https://www.w3.org/TR/webdatabase/) en 2010, sin planes de realizar más actualizaciones.

**No** se debe utilizar la caché de aplicaciones y el uso existente se debe migrar a los service workers y la API de caché. Ha quedado [obsoleta](https://developer.mozilla.org/docs/Web/API/Window/applicationCache) y la compatibilidad se eliminará de los navegadores en el futuro.

## ¿Cuánto puedo almacenar? {: #cuánto }

En resumen, **mucho**, al menos un par de cientos de megabytes y potencialmente cientos de gigabytes o más. Las implementaciones del navegador varían, pero la cantidad de almacenamiento disponible generalmente se basa en la cantidad de almacenamiento disponible en el dispositivo.

- Chrome permite que el navegador utilice hasta el 80% del espacio total en disco. Un origen puede utilizar hasta el 60% del espacio total en disco. Puede utilizar la [API StorageManager](#check) para determinar la cuota máxima disponible. Otros navegadores basados en Chromium pueden permitir que el navegador utilice más almacenamiento. Consulte el [PR # 3896](https://github.com/GoogleChrome/web.dev/pull/3896) para obtener detalles sobre la implementación de Chrome.
- Internet Explorer 10 y versiones posteriores pueden almacenar hasta 250 MB y le avisará al usuario cuando se hayan utilizado más de 10 MB.
- Firefox permite que el navegador utilice hasta el 50% del espacio libre en disco. Un grupo de [eTLD+1](https://godoc.org/golang.org/x/net/publicsuffix) (por ejemplo, `example.com`, `www.example.com` y `foo.bar.example.com`), [puede utilizar hasta 2 GB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits). Puede utilizar la [API StorageManager](#check-available) para determinar cuánto espacio queda disponible.
- Safari (tanto de escritorio como móvil) parece permitir aproximadamente 1 GB. Cuando se alcanza el límite, Safari le pedirá al usuario que aumente el límite en incrementos de 200 MB. No pude encontrar ninguna documentación oficial sobre esto.
    - Si se agrega una PWA a la pantalla de inicio en Safari móvil, parece crear un nuevo contenedor de almacenamiento y no se comparte nada entre la PWA y Safari móvil. Una vez que se alcanza la cuota para una PWA instalada, no parece haber ninguna forma de solicitar almacenamiento adicional.

En el pasado, si un sitio excedía un cierto umbral de datos almacenados, el navegador le solicitaba al usuario que concediera permiso para utilizar más datos. Por ejemplo, si el origen usó más de 50 MB, el navegador le pedirá al usuario que le permita almacenar hasta 100 MB y luego volverá a preguntar en incrementos de 50 MB.

Hoy en día, la mayoría de los navegadores modernos no le avisarán al usuario y permitirán que un sitio utilice hasta su cuota asignada. La excepción parece ser Safari, que solicita 750 MB y solicita permiso para almacenar hasta 1,1 GB. Si un origen intenta utilizar más de su cuota asignada, los intentos posteriores de escribir datos fallarán.

## ¿Cómo puedo comprobar la cantidad de almacenamiento disponible? {: #comprobar }

En [muchos navegadores](https://caniuse.com/#feat=mdn-api_storagemanager) , puede usar la [API StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) para determinar la cantidad de almacenamiento disponible para el origen y cuánto almacenamiento está usando. Informa el número total de bytes utilizados por IndexedDB y la API de caché, además permite calcular el espacio de almacenamiento restante aproximado disponible.

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
}
```

StorageManager aún no está [implementado](https://caniuse.com/#feat=mdn-api_storagemanager) en todos los navegadores, por lo que debe detectarlo antes de usarlo. Incluso cuando está disponible, debe detectar errores por exceso de cuota (ver más abajo). En algunos casos, es posible que la cuota disponible exceda la cantidad real de almacenamiento disponible.

{% Aside %} Otros navegadores basados en Chromium pueden tener en cuenta la cantidad de espacio libre al informar la cuota disponible. Chrome no lo hace y siempre informará el 60% del tamaño real del disco. Esto ayuda a reducir la capacidad de determinar el tamaño de los recursos de origen cruzado almacenados. {% endAside %}

### Inspección

Durante el desarrollo, puede utilizar las DevTools de su navegador para inspeccionar los diferentes tipos de almacenamiento y borrar fácilmente todos los datos almacenados.

Se agregó una nueva función en Chrome 88 que le permite anular la cuota de almacenamiento del sitio en el Panel de almacenamiento. Esta función le brinda la capacidad de simular diferentes dispositivos y probar el comportamiento de sus aplicaciones en escenarios de baja disponibilidad de disco. Vaya a **Aplicación y** luego **Almacenamiento**, habilite la **casilla de verificación Simular cuota de almacenamiento personalizada** e ingrese cualquier número válido para simular la cuota de almacenamiento.

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt="Panel de almacenamiento DevTools Storage.", width="800", height="567" %}

Mientras trabajaba en este artículo, escribí una [herramienta sencilla](https://storage-quota.glitch.me/) para intentar utilizar rápidamente la mayor cantidad de almacenamiento posible. Es una forma rápida y fácil de experimentar con diferentes mecanismos de almacenamiento y ver qué sucede cuando se usa toda la cuota.

## ¿Cómo manejar la superación de la cuota? {: #superar-la-cuota}

¿Qué debe hacer cuando se supera la cuota? Lo más importante es que siempre debe detectar y manejar los errores de escritura, ya sea un `QuotaExceededError` u otra cosa. Luego, en función del diseño de su aplicación, decida cómo manejarlo. Por ejemplo, elimine el contenido al que no se ha accedido durante mucho tiempo, elimine los datos según el tamaño o proporcione una forma para que los usuarios elijan lo que desean eliminar.

Tanto IndexedDB como la API de cache arrojan un `DOMError` llamado `QuotaExceededError` cuando se ha superado la cuota disponible.

### IndexedDB

Si el origen ha superado su cuota, los intentos de escribir en IndexedDB fallarán. El controlador `onabort()` de la transacción, pasará un evento. El evento incluirá una `DOMException` en la propiedad del error. Si se verifica el `name` del error devolverá `QuotaExceededError`.

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // Fallback code goes here
  }
};
```

### API de caché

Si el origen ha superado su cuota, los intentos de escribir en la API de caché se rechazarán con una `QuotaExceededError` `DOMException` .

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // Fallback code goes here
  }
}
```

## ¿Cómo funciona el vaciado? {: #vaciado}

El almacenamiento web se clasifica en dos categorías, "Mejor esfuerzo" y "Persistente". Mejor esfuerzo significa que el navegador puede borrar el almacenamiento sin interrumpir al usuario, pero es menos duradero para datos críticos o de largo plazo. El almacenamiento persistente no se borra automáticamente cuando el almacenamiento es bajo. El usuario debe borrar manualmente este almacenamiento (a través de la configuración del navegador).

De forma predeterminada, los datos de un sitio (incluidos IndexedDB, API de cache, etc.) se incluyen en la categoría de mejor esfuerzo, lo que significa que, a menos que un sitio haya [solicitado almacenamiento persistente](/persistent-storage/), el navegador puede vaciar los datos del sitio a su discreción, por ejemplo, cuando el almacenamiento del dispositivo es bajo.

La política de vaciado por mejor esfuerzo es:

- Los navegadores basados en Chromium comenzarán a vaciar los datos cuando el navegador se quede sin espacio, para borrar primero todos los datos del sitio origen utilizado menos recientemente, luego el siguiente, hasta que el navegador ya no supere el límite.
- Internet Explorer 10+ no vaciará los datos, pero evitará que el origen siga escribiendo.
- Firefox comenzará a vaciar los datos cuando se llene el espacio disponible en el disco, para borrar todos los datos del sitio origen menos utilizado recientemente, luego el siguiente, hasta que el navegador ya no supere el límite.
- Safari anteriormente no vaciaba los datos, pero recientemente implementó un nuevo límite de siete días en todo el almacenamiento de escritura (ver más abajo).

A partir de iOS, iPadOS 13.4 y Safari 13.1 en macOS, hay un límite de siete días en todo el almacenamiento de escritura de scripts, incluidos IndexedDB, el registro del service worker y la API de caché. Esto significa que Safari vaciará todo el contenido de la caché después de siete días de uso de Safari si el usuario no interactúa con el sitio. Esta política de vaciado **no se aplica a las PWA instaladas** que se han agregado a la pantalla de inicio. Consulte [Bloqueo completo de cookies de terceros y más](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) en el blog de WebKit para obtener los detalles completos.

{% Aside %} Puede solicitar [almacenamiento persistente](/persistent-storage/) para su sitio a fin de proteger los datos críticos de las aplicaciones o los usuarios. {% endAside %}

## Bono: ¿Por qué usar un contenedor para IndexedDB?

IndexedDB es una API de bajo nivel que requiere una configuración significativa antes de su uso, lo que puede ser particularmente difícil para almacenar datos simples. A diferencia de la mayoría de las API modernas basadas en promesas, se basa en eventos. Los promise wrappers como [idb](https://www.npmjs.com/package/idb) para IndexedDB ocultan algunas de las características poderosas pero, lo que es más importante, ocultan la maquinaria compleja (por ejemplo, transacciones, control de versiones de esquemas) que viene con la biblioteca IndexedDB.

## Conclusión

Atrás quedaron los días del almacenamiento limitado y de incitar al usuario a almacenar más y más datos. Los sitios pueden almacenar de forma eficaz todos los recursos y datos que necesitan para funcionar. Con la [API StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate), puede determinar cuánto está disponible para usted y cuánto ha usado. Y con el [almacenamiento persistente](/persistent-storage/), a menos que el usuario lo elimine, usted puede protegerlo contra el vaciado.

### Recursos adicionales

- [Prácticas recomendadas de IndexedDB](/indexeddb-best-practices/)
- [Conceptos de cuotas y almacenamiento web de Chrome](https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview)

### Gracias

Un agradecimiento especial a Jarryd Goodman, Phil Walton, Eiji Kitamura, Daniel Murphy, Darwin Huang, Josh Bell, Marijn Kruisselbrink y Victor Costan por revisar este artículo. Gracias a Eiji Kitamura, Addy Osmani y Marc Cohen, quienes escribieron los artículos originales en los que se basa. Eiji escribió una herramienta útil llamada [Browser Storage Abuser](http://demo.agektmr.com/storage/) que fue útil para validar el comportamiento actual. Le permite almacenar tantos datos como sea posible y ver los límites de almacenamiento en su navegador. Gracias a Francois Beaufort, quien investigó Safari para averiguar sus límites de almacenamiento.

La imagen hero es de Guillaume Bolduc en [Unsplash](https://unsplash.com/photos/uBe2mknURG4) .
