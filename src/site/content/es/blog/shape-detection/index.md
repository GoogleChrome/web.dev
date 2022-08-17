---
title: 'La API de detección de formas (Shape Detection API): una imagen vale más que mil palabras, rostros y códigos de barras'
subhead: La API de detección de formas detecta rostros, códigos de barras y texto en imágenes.
authors:
  - thomassteiner
description: La API de detección de formas detecta rostros, códigos de barras y texto en imágenes.
date: 2019-01-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - origin-trials
  - progressive-web-apps
hero: image/admin/pcEIwc0D09iF7BPo3TT1.jpg
alt: Código QR escaneado por un teléfono móvil
origin-trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919"
feedback:
  - api
---

{% Aside %} Esta API es parte del [proyecto de nuevas funcionalidades](https://developer.chrome.com/blog/capabilities/). La detección de códigos de barras se lanzó en Chrome 83. La detección de rostros y texto está disponible detrás de una bandera. Esta publicación se actualizará a medida que la API de detección de formas evolucione. {% endAside %}

## ¿Qué es la API de detección de formas? {: #what }

Con API como [`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) y el [selector de fotos](https://bugs.chromium.org/p/chromium/issues/detail?id=656015) de Chrome para Android, se ha vuelto bastante fácil capturar imágenes o datos de video en vivo desde las cámaras del dispositivo, o cargar imágenes locales. Hasta ahora, estos datos de imágenes dinámicas, así como las imágenes estáticas en una página, no eran accesibles por código, aunque las imágenes pueden contener muchas características interesantes como rostros, códigos de barras y texto.

Por ejemplo, en el pasado, si los desarrolladores querían extraer tales características en el cliente para construir un [lector de códigos QR](https://qrsnapper.appspot.com/), tenían que depender de bibliotecas JavaScript externas. Esto podría resultar caro desde el punto de vista del rendimiento y aumentar el peso total de la página. Por otro lado, los sistemas operativos incluyendo Android, iOS y macOS, pero también los chips de hardware que se encuentran en los módulos de la cámara, normalmente ya tienen detectores de funciones altamente optimizados y de alto rendimiento, como el [`FaceDetector`](https://developer.android.com/reference/android/media/FaceDetector) Android o el detector de funciones genéricas de iOS, [`CIDetector`](https://developer.apple.com/documentation/coreimage/cidetector?language=objc).

La [API de detección de formas](https://wicg.github.io/shape-detection-api) expone estas implementaciones a través de un conjunto de interfaces JavaScript. Actualmente, las funciones admitidas son la detección de rostros a través de la `FaceDetector`, la detección de códigos de barras a través de la `BarcodeDetector` y la detección de texto (reconocimiento óptico de caracteres (OCR)) a través de la interfaz `TextDetector`.

{% Aside 'caution' %} La detección de texto, a pesar de ser un campo interesante, no se considera lo suficientemente estable en plataformas informáticas o conjuntos de caracteres para estandarizarse en este momento, por lo que la detección de texto se ha trasladado a una [especificación informativa](https://wicg.github.io/shape-detection-api/text.html) separada. {% endAside %}

### Casos de uso sugeridos {: #use-cases }

Como se describió anteriormente, la API de detección de formas actualmente admite la detección de rostros, códigos de barras y texto. La siguiente lista de viñetas contiene ejemplos de casos de uso para las tres funciones.

#### Detección de rostros

- Las redes sociales o los sitios para compartir fotos comúnmente permiten a sus usuarios anotar personas en imágenes. Al resaltar los límites de los rostros detectados, esta tarea se puede facilitar.
- Los sitios de contenido pueden recortar imágenes dinámicamente basándose en rostros potencialmente detectados en lugar de depender de otras heurísticas, o resaltar rostros detectados con efectos de panorámica y zoom similares al efecto [Ken Burns](https://en.wikipedia.org/wiki/Ken_Burns_effect) en formatos similares a un story.
- Los sitios de mensajería multimedia pueden permitir a sus usuarios superponer objetos divertidos como [gafas de sol o bigotes](https://beaufortfrancois.github.io/sandbox/media-recorder/mustache.html) en los puntos de referencia detectados.

#### Detección de códigos de barras

- Las aplicaciones web que leen códigos QR pueden desbloquear casos de uso interesantes como pagos en línea o navegación web, o utilizar códigos de barras para establecer conexiones sociales en aplicaciones de mensajería.
- Las aplicaciones de compras pueden permitir a sus usuarios escanear [códigos de barras EAN](https://en.wikipedia.org/wiki/International_Article_Number) o [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code) de artículos en una tienda física para comparar precios en línea.
- Los aeropuertos pueden proporcionar quioscos web donde los pasajeros pueden escanear los [códigos Aztec](https://en.wikipedia.org/wiki/Aztec_Code) de sus tarjetas de embarque para mostrar información personalizada relacionada con sus vuelos.

#### Detección de texto

- Los sitios de redes sociales pueden mejorar la accesibilidad del contenido de imágenes generado por el usuario agregando textos detectados como atributos `alt` para etiquetas de `<img>` cuando no se proporcionan otras descripciones.
- Los sitios de contenido pueden usar la detección de texto para evitar colocar encabezados sobre imágenes con contenido de texto.
- Las aplicaciones web pueden utilizar la detección de texto para traducir textos como, por ejemplo, menús de restaurantes.

## Estado actual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crear un explicador</td>
<td data-md-type="table_cell"><a href="https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/shape-detection-api" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. Recopilar comentarios e iterar el diseño</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">En curso</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lanzamiento</strong></td>
<td data-md-type="table_cell">Detección de código de barras <strong data-md-type="double_emphasis">Completo</strong><br> Detección facial <a href="https://www.chromestatus.com/feature/5678216012365824" data-md-type="link">En curso</a><br> Detección de texto <a href="https://www.chromestatus.com/feature/5644087665360896" data-md-type="link">En curso</a>
</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Cómo utilizar la API de detección de formas {: #use }

{% Aside 'warning' %} Hasta ahora, solo la detección de códigos de barras está disponible de forma predeterminada, comenzando en Chrome 83, pero la detección de rostros y texto está disponible detrás de una bandera. Siempre puede usar la API de detección de formas para experimentos locales habilitando la bandera `#enable-experimental-web-platform-features`. {% endAside %}

Si desea experimentar con la API de detección de formas localmente, habilite la `#enable-experimental-web-platform-features` en `about://flags`.

Las interfaces de los tres detectores, `FaceDetector`, `BarcodeDetector` y `TextDetector` , son similares. Todas proporcionan un único método asincrónico llamado `detect()` que toma [`ImageBitmapSource`](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#imagebitmapsource) como entrada (es decir, [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource), un [`Blob`](https://w3c.github.io/FileAPI/#dfn-Blob) o [`ImageData`](https://html.spec.whatwg.org/multipage/canvas.html#imagedata)).

Para `FaceDetector` y `BarcodeDetector`, se pueden pasar parámetros opcionales al constructor del detector que permiten proporcionar pistas a los detectores subyacentes.

Consulte atentamente la matriz de soporte en el [explicador](https://github.com/WICG/shape-detection-api#overview) para obtener una descripción general de las diferentes plataformas.

{% Aside 'gotchas' %} Si su `ImageBitmapSource` tiene un [origen de script efectivo](https://html.spec.whatwg.org/multipage/#concept-origin) que no es el mismo que el origen de script efectivo del documento, los intentos de llamar a `detect()` fallarán con una nueva `SecurityError` [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException). Si el origen de su imagen es compatible con CORS, puede utilizar el [`crossorigin`](https://developer.mozilla.org/docs/Web/HTML/CORS_settings_attributes) para solicitar acceso a CORS. {% endAside %}

### Trabajar con `BarcodeDetector` {: #barcodedetector }

El `BarcodeDetector` devuelve los valores sin procesar del código de barras que encuentra en `ImageBitmapSource` y los cuadros delimitadores, así como otra información como los formatos de los códigos de barras detectados.

```js
const barcodeDetector = new BarcodeDetector({
  // (Optional) A series of barcode formats to search for.
  // Not all formats may be supported on all platforms
  formats: [
    'aztec',
    'code_128',
    'code_39',
    'code_93',
    'codabar',
    'data_matrix',
    'ean_13',
    'ean_8',
    'itf',
    'pdf417',
    'qr_code',
    'upc_a',
    'upc_e'
  ]
});
try {
  const barcodes = await barcodeDetector.detect(image);
  barcodes.forEach(barcode => searchProductDatabase(barcode));
} catch (e) {
  console.error('Barcode detection failed:', e);
}
```

### Trabajar con `FaceDetector` {: #facedetector }

`FaceDetector` siempre devuelve los cuadros delimitadores de caras que detecta en `ImageBitmapSource`. Dependiendo de la plataforma, puede haber más información disponible sobre puntos de referencia faciales como ojos, nariz o boca. Es importante tener en cuenta que esta API solo detecta rostros. No identifica a quién pertenece un rostro.

```js
const faceDetector = new FaceDetector({
  // (Optional) Hint to try and limit the amount of detected faces
  // on the scene to this maximum number.
  maxDetectedFaces: 5,
  // (Optional) Hint to try and prioritize speed over accuracy
  // by, e.g., operating on a reduced scale or looking for large features.
  fastMode: false
});
try {
  const faces = await faceDetector.detect(image);
  faces.forEach(face => drawMustache(face));
} catch (e) {
  console.error('Face detection failed:', e);
}
```

### Trabajar con `TextDetector` {: #textdetector }

`TextDetector` siempre devuelve los cuadros delimitadores de los textos detectados y, en algunas plataformas, los caracteres reconocidos.

{% Aside 'caution' %} El reconocimiento de texto no está disponible universalmente. {% endAside %}

```js
const textDetector = new TextDetector();
try {
  const texts = await textDetector.detect(image);
  texts.forEach(text => textToSpeech(text));
} catch (e) {
  console.error('Text detection failed:', e);
}
```

## Detección de características {: #featuredetection }

Verificar exclusivamente la existencia de los constructores para detectar características de la API de detección de formas no es suficiente. La presencia de una interfaz no le dice si la plataforma subyacente es compatible con la función. Esto está funcionando [según lo previsto](https://crbug.com/920961). Es por eso que recomendamos un enfoque de *programación defensiva* al realizar una detección de características como esta:

```js
const supported = await (async () => 'FaceDetector' in window &&
    await new FaceDetector().detect(document.createElement('canvas'))
    .then(_ => true)
    .catch(e => e.name === 'NotSupportedError' ? false : true))();
```

La interfaz del `BarcodeDetector` se ha actualizado para incluir un método `getSupportedFormats()` y se han propuesto interfaces similares [para `FaceDetector`](https://github.com/WICG/shape-detection-api/issues/53) y [`TextDetector`](https://github.com/WICG/shape-detection-api/issues/57).

```js
await BarcodeDetector.getSupportedFormats();
/* On a macOS computer logs
  [
    "aztec",
    "code_128",
    "code_39",
    "code_93",
    "data_matrix",
    "ean_13",
    "ean_8",
    "itf",
    "pdf417",
    "qr_code",
    "upc_e"
  ]
*/
```

Esto le permite detectar la función específica que necesita, por ejemplo, escaneo de códigos QR:

```js
if (('BarcodeDetector' in window) &&
    ((await BarcodeDetector.getSupportedFormats()).includes('qr_code'))) {
  console.log('QR code scanning is supported.');
}
```

Esto es mejor que ocultar las interfaces porque, incluso entre plataformas, las capacidades pueden variar, por lo que se debe alentar a los desarrolladores a verificar con precisión la capacidad (como un formato de código de barras en particular o un punto de referencia facial) que requieren.

## Compatibilidad con el sistema operativo {: #os-support }

La detección de códigos de barras está disponible en macOS, ChromeOS y Android. Se requiere [Google Play Services](https://play.google.com/store/apps/details?id=com.google.android.gms) para Android.

## Prácticas recomendadas {: #bestpractices }

Todos los detectores funcionan de forma asincrónica, es decir, no bloquean el hilo principal. Por lo tanto, no confíe en la detección en tiempo real, sino más bien deje un tiempo para que el detector haga su trabajo.

Si eres fanático de [Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API), te alegrará saber que los detectores también están expuestos allí. Los resultados de la detección se pueden serializar y, por lo tanto, se pueden pasar del trabajador a la aplicación principal a través de `postMessage()`. La [demostración](https://shape-detection-demo.glitch.me/) muestra esto en acción.

No todas las implementaciones de plataforma admiten todas las funciones, así que asegúrese de verificar la situación de soporte cuidadosamente y use la API como una mejora progresiva. Por ejemplo, algunas plataformas pueden admitir la detección de rostros per se, pero no la detección de puntos de referencia de rostros (ojos, nariz, boca, etc.); o se puede reconocer la existencia y la ubicación del texto, pero no el contenido del mismo.

{% Aside 'caution' %} Esta API es una optimización y no algo garantizado que esté disponible en la plataforma para todos los usuarios. Se espera que los desarrolladores combinen esto con su propio [código de reconocimiento de imágenes](https://github.com/mjyc/opencv) y aprovechen la optimización de la plataforma cuando esté disponible. {% endAside %}

## Feedback {: #feedback }

El equipo de Chrome y la comunidad de estándares web desean conocer sus experiencias con la API de detección de formas.

### Cuéntanos sobre el diseño de la API {: .hide-from-toc }

¿Hay algo en la API que no funciona como esperabas? ¿O faltan métodos o propiedades que necesita para implementar su idea? ¿Tiene alguna pregunta o comentario sobre el modelo de seguridad?

- Presenta un problema de especificación en el [repositorio de GitHub de la API de detección de formas](https://github.com/WICG/shape-detection-api/issues) o agregue sus comentarios a un problema existente.

### ¿Problemas con la implementación? {: .hide-from-toc }

¿Encontraste un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación?

- Presenta un error en [https://new.crbug.com](https://new.crbug.com). Asegúrese de incluir todos los detalles que pueda, instrucciones sencillas para reproducir y configure *Componentes* en `Blink>ImageCapture`. [Glitch](https://glitch.com) funciona muy bien para compartir repros rápidos y fáciles.

### ¿Planea utilizar la API? {: .hide-from-toc }

¿Planea utilizar la API de detección de formas en su sitio? Su apoyo público nos ayuda a priorizar funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

- Comparta cómo planea usarlo en el [hilo de WICG de Discourse](https://discourse.wicg.io/t/rfc-proposal-for-face-detection-api/1642/3).
- Envíe un tweet a [@ChromiumDev](https://twitter.com/chromiumdev) usando el hashtag[`#ShapeDetection`](https://twitter.com/search?q=%23ShapeDetection&src=typed_query&f=live) y déjanos saber dónde y cómo la está usando.

## Enlaces útiles {: #helpful }

- [Explicador público](https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit)
- [Demostración de API](https://shape-detection-demo.glitch.me/) | [Código fuente de la demostración de API](https://glitch.com/edit/#!/shape-detection-demo)
- [Seguimiento de errores](https://bugs.chromium.org/p/chromium/issues/detail?id=728474)
- [Entrada de ChromeStatus.com](https://www.chromestatus.com/feature/4757990523535360)
- Componente Blink: `Blink>ImageCapture`
