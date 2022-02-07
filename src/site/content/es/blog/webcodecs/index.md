---
title: Procesamiento de video con WebCodecs
subhead: Manipulación de componentes de transmisión de video.
description: Trabaja con componentes de una transmisión de video, como fotogramas y chunks de audio o video codificados sin mezclar.
date: 2020-10-13
updated: 2021-08-26
hero: image/admin/I09h0la9qLPSRLZs1ruB.jpg
alt: Un rollo de película.
authors:
  - djuffin
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-7811493553674125311"
tags:
  - blog
  - media
feedback:
  - api
---

Las tecnologías web modernas brindan amplias formas de trabajar con video. [API de Media Stream](https://developer.mozilla.org/docs/Web/API/MediaStream_Recording_API), [API de Media Recording](https://developer.mozilla.org/docs/Web/API/MediaStream_Recording_API), [API de Media Source](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API) y [API de WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) se suman a un rico conjunto de herramientas para grabar, transferir y reproducir secuencias de video. Mientras resuelven ciertas tareas de alto nivel, estas API no permiten que los programadores web trabajen con componentes individuales de una transmisión de video, como cuadros y chunks (fragmentos) de audio o video codificados sin ser multiplexados. Para obtener acceso de bajo nivel a estos componentes básicos, los desarrolladores han estado utilizando WebAssembly para incorporar [códecs de audio y video](https://en.wikipedia.org/wiki/Video_codec) al navegador. Pero dado que los navegadores modernos ya vienen con una variedad de códecs (que a menudo son acelerados por hardware), volver a empaquetarlos como WebAssembly parece una pérdida de recursos humanos e informáticos.

La [API de WebCodecs](https://wicg.github.io/web-codecs/) elimina esta ineficiencia al brindarles a los programadores una forma de usar componentes multimedia que ya están presentes en el navegador. Específicamente:

- Decodificadores de video y audio
- Codificadores de video y audio
- Fotogramas de video sin procesar
- Decodificadores de imágenes

La API de WebCodecs es útil para aplicaciones web que requieren un control total sobre la forma en que se procesa el contenido multimedia, como editores de video, videoconferencia, transmisión de video, etc.

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
<td data-md-type="table_cell"><a href="https://github.com/WICG/web-codecs/blob/master/explainer.md" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/web-codecs/" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopilar comentarios e iterar el diseño</td>
<td data-md-type="table_cell">Completado</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lanzamiento</td>
<td data-md-type="table_cell">Chrome 94</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Flujo de trabajo de procesamiento de video

Los fotogramas son la pieza central en el procesamiento de video. Por lo tanto, en WebCodecs, la mayoría de las clases consumen o producen fotogramas. Los codificadores de video convierten los fotogramas en chunks codificados. Los decodificadores de video hacen lo contrario.

Además, `VideoFrame` es compatible con otras API web al ser [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource) y por tener un [constructor](https://www.w3.org/TR/webcodecs/#dom-videoframe-videoframe) que acepta a `CanvasImageSource`. Por lo tanto, se puede usar en funciones como [`drawImage()`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage) y [`texImage2D()`](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext/texImage2D). También se puede construir a partir de canvas, mapas de bits, elementos de video y otros fotogramas de video.

La API de WebCodecs funciona bien en conjunto con las clases de la [API de Insertable Streams](https://w3c.github.io/mediacapture-transform/) que conectan WebCodecs con [pistas de transmisión multimedia](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack).

- `MediaStreamTrackProcessor` divide las pistas multimedia en fotogramas individuales.
- `MediaStreamTrackGenerator` crea una pista de medios a partir de una secuencia de fotogramas.

## WebCodecs y web workers

Por diseño, la API de WebCodecs hace todo el trabajo pesado de forma asincrónica y fuera del hilo principal. Pero dado que las retrollamadas de fotogramas y chunks a menudo se pueden llamar varias veces por segundo, pueden saturar el hilo principal y, por lo tanto, hacer que el sitio web sea menos responsivo. Por lo tanto, es preferible trasladar el manejo de fotogramas individuales y chunks codificados a un web worker.

Para ayudar a eso, [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream) proporciona una forma conveniente de transferir automáticamente todos los fotogramas provenientes de una pista de medios al web worker. Por ejemplo, `MediaStreamTrackProcessor` se puede utilizar para obtener un `ReadableStream` para una pista de transmisión multimedia procedente de la cámara web. Después de eso, la transmisión se transfiere a un web worker donde los fotogramas se leen uno por uno y se meten a la cola de `VideoEncoder`.

Con [`HTMLCanvasElement.transferControlToOffscreen`](https://developers.google.com/web/updates/2018/08/offscreen-canvas#unblock_main_thread) se pueden renderizar fuera del hilo principal. Pero si todas las herramientas de alto nivel resultan inconvenientes, `VideoFrame` es [transferible](https://developer.mozilla.org/docs/Web/API/Transferable) y se puede mover entre web workers.

## WebCodecs en acción

### Codificación

<figure>{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/lEovMYp8oh1JSClCLCiD.png", alt="La ruta desde un Canvas o un ImageBitmap a la red o al almacenamiento", width="800", height="393" %}<figcaption> La ruta desde un <code>Canvas</code> o un <code>ImageBitmap</code> a la red o al almacenamiento</figcaption></figure>

Todo comienza con un `VideoFrame`. Hay tres formas de construir fotogramas de video.

- Desde una fuente de imagen como un canvas, un mapa de bits de imagen o un elemento de video.

```js
const cnv = document.createElement('canvas');
// dibuja algo en el canvas
…
let frame_from_canvas = new VideoFrame(cnv, { timestamp: 0 });
```

- Utiliza `MediaStreamTrackProcessor` para extraer fotogramas de un [`MediaStreamTrack`](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack)

```js
  const stream = await navigator.mediaDevices.getUserMedia({ … });
  const track = stream.getTracks()[0];

  const media_processor = new MediaStreamTrackProcessor(track);

  const reader = media_processor.readable.getReader();
  while (true) {
      const result = await reader.read();
      if (result.done)
        break;
      let frame_from_camera = result.value;
  }
```

- Crea un fotograma a partir de su renderización de píxeles binarios en un [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource)

```js
  const pixelSize = 4;
  const init = {timestamp: 0, codedwidth: 320, codedHeight: 200, format: 'RGBA'};
  let data = new Uint8Array(init.codedwidth * init.codedHeight * pixelSize);
  for (let x = 0; x < init.codedwidth; x++) {
    for (let y = 0; y < init.codedHeight; y++) {
      let offset = (y * init.codedwidth + x) * pixelSize;
      data[offset] = 0x7F;      // Red
      data[offset + 1] = 0xFF;  // Green
      data[offset + 2] = 0xD4;  // Blue
      data[offset + 3] = 0x0FF; // Alpha
    }
  }
  let frame = new VideoFrame(data, init);
```

No importa de dónde vengan, los fotogramas se pueden codificar en objetos de `EncodedVideoChunk` con un `VideoEncoder`.

Antes de codificar, `VideoEncoder` necesita dos objetos JavaScript:

- Diccionario de inicio con dos funciones para manejar chunks codificados y errores. Estas funciones están definidas por el desarrollador y no se pueden cambiar después de ser pasadas al constructor `VideoEncoder`.
- Objeto de configuración del codificador, que contiene parámetros para la transmisión de video de salida. Puedes cambiar estos parámetros más tarde llamando a `configure()`.

```js
const init = {
  output: handleChunk,
  error: (e) => {
    console.log(e.message);
  }
};

let config = {
  codec: 'vp8',
  width: 640,
  height: 480,
  bitrate: 2_000_000, // 2 Mbps
  framerate: 30,
};

let encoder = new VideoEncoder(init);
encoder.configure(config);
```

Una vez que se hayas configurado el codificador, está listo para aceptar fotogramas mediante el método `encode()`. Tanto `configure()` como `encode()` regresan inmediatamente sin esperar a que se complete el trabajo. Esto permite que varios fotogramas entren a la cola para ser codificados al mismo tiempo, mientras que  `encodeQueueSize` muestra cuántas solicitudes están esperando en la cola para que finalicen las codificaciones anteriores. Los errores se informan lanzando inmediatamente una excepción, en caso de que los argumentos o el orden de las llamadas al método infrinjan el contrato de la API, o haciendo una  retrollamada de `error()` para los problemas encontrados en la implementación del códec. Si la codificación es completada correctamente, la retrollamada de `output() se llama con un nuevo pedazo codificado como argumento.` Otro detalle importante es que los fotogramas deben ser informados cuando ya no se necesitan llamando a `close()`.

```js
let frame_counter = 0;

const track = stream.getVideoTracks()[0];
const media_processor = new MediaStreamTrackProcessor(track);

const reader = media_processor.readable.getReader();
while (true) {
    const result = await reader.read();
    if (result.done)
      break;

    let frame = result.value;
    if (encoder.encodeQueueSize > 2) {
      // Too many frames in flight, encoder is overwhelmed
      // let's drop this frame.
      frame.close();
    } else {
      frame_counter++;
      const insert_keyframe = (frame_counter % 150) == 0;
      encoder.encode(frame, { keyFrame: insert_keyframe });
      frame.close();
    }
}
```

Finalmente, es el momento de terminar de codificar el código escribiendo una función que maneje chunks de video codificado a medida que salen del codificador. Por lo general, esta función enviaría chunks de datos a través de la red o [multiplexarlos](https://en.wikipedia.org/wiki/Multiplexing#Video_processing) en un contenedor de medios para su almacenamiento.

```js
function handleChunk(chunk, metadata) {

  if (metadata.decoderConfig) {
    // El decodificador necesita ser configurado (o volver a ser configurado) con los nuevos parámetros
    // cuando la metadata tiene un nuevo decoderConfig.
    // Esto usualmente sucede en el principio o cuando el codificador tiene una nueva
    // especificación binaria de configuración de codec. (VideoDecoderConfig.description).
    fetch('/upload_extra_data',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: metadata.decoderConfig.description
    });
  }

  // los bytes actuales de los datos codificados
  let chunkData = new Uint8Array(chunk.byteLength);
  chunk.copyTo(chunkData);

  let timestamp = chunk.timestamp;        // tiempo de los medios en microsegundos
  let is_key = chunk.type == 'key';       // también puede ser un "delta"
  fetch(`/upload_chunk?timestamp=${timestamp}&type=${chunk.type}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: chunkData
  });
}
```

Si en algún momento necesitas asegurarte de que se hayan completado todas las solicitudes de codificación pendientes, puedes llamar a `flush()` y esperar su promesa.

```js
await encoder.flush();
```

### Decodificación

<figure>{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/fzi3E4v2jJJj5QAlhoRG.png", alt="La ruta desde la red o el almacenamiento a un Canvas o ImageBitmap.", width="800", height="419" %}<figcaption> La ruta desde la red o el almacenamiento a un <code>Canvas</code> o un <code>ImageBitmap</code>.</figcaption></figure>

La configuración de un `VideoDecoder` es similar a lo que se ha hecho para el `VideoEncoder`: se pasan dos funciones cuando se crea el decodificador y se pasan los parámetros del códec a `configure()`.

El conjunto de parámetros del códec varía de un códec a otro. Por ejemplo, el códec H.264 puede necesitar un [binary blob (blob binario)](https://wicg.github.io/web-codecs/#dom-audiodecoderconfig-description) de avcC, a menos que esté codificado en el formato AnnexB (`encoderConfig.avc = { format: "annexb" }`).

```js
const init = {
  output: handleFrame,
  error: (e) => {
    console.log(e.message);
  }
};

const config = {
  codec: 'vp8',
  codedwidth: 640,
  codedHeight: 480
};

let decoder = new VideoDecoder(init);
decoder.configure(config);
```

Una vez que se inicializa el decodificador, puedes comenzar a alimentarlo con objetos `EncodedVideoChunk`. Para crear un chunk, necesitarás:

- Un [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) de video codificados
- La marca de tiempo de inicio del chunk en microsegundos (tiempo de medios del primer fotograma codificado en el chunk)
- El tipo del chunk, cualquiera de los siguientes:
    - `key` si el chunk se puede decodificar independientemente de los chunks anteriores
    - `delta` si el chunk solo se puede decodificar después de que se hayan decodificado uno o más chunks anteriores

Además, cualquier chunk emitido por el codificador está listo para el decodificador. Todas las cosas mencionadas anteriormente sobre la notificación de errores y la naturaleza asincrónica de los métodos del codificador son igualmente válidas para los decodificadores.

```js
let responses = await downloadVideoChunksFromServer(timestamp);
for (let i = 0; i < responses.length; i++) {
  let chunk = new EncodedVideoChunk({
    timestamp: responses[i].timestamp,
    type: (responses[i].key ? 'key' : 'delta'),
    data: new Uint8Array ( responses[i].body )
  });
  decoder.decode(chunk);
}
await decoder.flush();
```

Ahora es el momento de mostrar cómo se puede mostrar un fotograma recién decodificado en la página. Es mejor asegurarse de que la retrollamada de salida del decodificador (`handleFrame()`) regrese rápidamente. En el siguiente ejemplo, solo agregas un fotograma a la cola de fotogramas listos para renderizar. El renderizado ocurre por separado y consta de dos pasos:

1. Esperando el momento adecuado para mostrar el fotograma.
2. Dibujando el fotograma en el canvas.

Una vez que ya no se necesita un fotograma, llamas a `close()` para liberar la memoria subyacente antes de que el recolector de basura llegue a él, esto reducirá la cantidad promedio de memoria utilizada por la aplicación web.

```js
let cnv = document.getElementById('canvas_to_render');
let ctx = cnv.getContext('2d');
let ready_frames = [];
let underflow = true;
let time_base = 0;

function handleFrame(frame) {
  ready_frames.push(frame);
  if (underflow)
    setTimeout(render_frame, 0);
}

function delay(time_ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}

function calculateTimeTillNextFrame(timestamp) {
  if (time_base == 0)
    time_base = performance.now();
  let media_time = performance.now() - time_base;
  return Math.max(0, (timestamp / 1000) - media_time);
}

async function render_frame() {
  if (ready_frames.length == 0) {
    underflow = true;
    return;
  }
  let frame = ready_frames.shift();
  underflow = false;

  // En base al tiempo del fotograma calculado en cuanto tiemp   // o real espera
  // que se necesite para mostrar el siguiente fotograma.
  let time_till_next_frame = calculateTimeTillNextFrame(frame.timestamp);
  await delay(time_till_next_frame);
  ctx.drawImage(frame, 0, 0);
  frame.close();

  // Inmediatamente agenda el renderizaje del próximo fotogram//a
  setTimeout(render_frame, 0);
}
```

## Demostración

La siguiente demostración muestra cómo son los fotogramas de animación de un canvas:

- Capturado a 25 fps en un `ReadableStream` por `MediaStreamTrackProcessor`
- Transferido a un web worker
- Codificado en formato de video H.264
- Decodificado de nuevo en una secuencia de fotogramas de video
- Y renderizado en el segundo canvas usando `transferControlToOffscreen()`

{% Glitch 'new-webcodecs-blogpost-demo' %}

### Otras demostraciones

Consulta también nuestras otras demostraciones:

- [Decodificando gifs con ImageDecoder](https://imagedecoder.glitch.me/)
- [Capturar la entrada de la cámara en un archivo](https://w3c.github.io/webcodecs/samples/capture-to-file/capture-to-file.html)
- [Reproducción de MP4](https://w3c.github.io/webcodecs/samples/mp4-decode/)
- [Otros ejemplos](https://w3c.github.io/webcodecs/samples/)

## Usando la API de WebCodecs {: #use }

## Detección de características

Para comprobar la compatibilidad con WebCodecs:

```js
if ('VideoEncoder' in window) {
  // La API de WebCodecs es compatible.
}
```

Ten en cuenta que la API de WebCodecs solo está disponible en [contextos seguros](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts), por lo que la detección fallará si [`self.isSecureContext`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/isSecureContext) es falso.

## Retroalimentación {: #feedback }

El equipo de Chrome desea saber sobre tu experiencia con la API de WebCodecs.

### Cuéntanos sobre el diseño de la API

¿Hay algo en la API que no funciona como lo esperabas? ¿O faltan métodos o propiedades que necesitas para implementar tu idea? ¿Tienes alguna pregunta o comentario sobre el modelo de seguridad? Presenta un problema de especificación en el [repositorio de GitHub](https://github.com/WICG/web-codecs/issues) correspondiente o agrega tus sugerencias a un problema existente.

### Reportar un problema con la implementación

¿Encontraste un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación? Presenta un error en [new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EMedia%3EWebCodecs). Asegúrate de incluir todos los detalles que puedas y de agregar instrucciones simples para reproducir e ingresar `Blink>Media>WebCodecs` en el cuadro de **Componentes**. [Glitch](https://glitch.com/) funciona muy bien para compartir reproducciones rápidas y fáciles.

### Muestra tu apoyo a la API

¿Estás pensando en utilizar la API de WebCodecs? Tu apoyo público ayuda al equipo de Chrome a priorizar funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

Envía un correo electrónico a [media-dev@chromium.org](mailto:media-dev@chromium.org) o envía un tweet a [@ChromiumDev] [cr-dev-twitter] usando el hashtag de [`#WebCodecs`](https://twitter.com/search?q=%23WebCodecs&src=typed_query&f=live) y déjanos saber dónde y cómo lo estás usando.

[Imagen de héroe](https://unsplash.com/photos/8eQOBtgn9Qo) de [Denise Jans](https://unsplash.com/@dmjdenise) en [Unsplash](https://unsplash.com).
