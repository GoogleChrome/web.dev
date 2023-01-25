---
title: 'Flujos: la guía definitiva'
subhead: Aprenda a usar flujos de lectura, de escritura y de transformación con la API de flujos.
description: |2-

  La API de flujos permite que JavaScript acceda mediante programación a los flujos de datos recibidos a través de la red y procesarlos según lo deseado.
authors:
  - thomassteiner
date: 2021-02-19
updated: 2021-02-25
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/TuciUuOQOd3u7uMgDZBi.jpg
alt: Un arroyo de bosque con hojas caídas de colores.
tags:
  - blog
  - capabilities
---

La API de flujos le permite acceder mediante programación a los flujos de datos recibidos a través de la red o creados por cualquier medio localmente y procesarlos con JavaScript. La transmisión de flujos implica dividir un recurso que desea recibir, enviar o transformar en pequeños fragmentos y luego procesar estos fragmentos poco a poco. Si bien la transmisión de flujos es algo que los navegadores hacen de todos modos cuando reciben activos como HTML o videos para mostrarlos en páginas web, esta capacidad nunca estuvo disponible para JavaScript antes de que `fetch` con flujos se introdujera en 2015.

{% Aside %} La transmisión de flujos era técnicamente posible con `XMLHttpRequest`, pero [realmente no era nada agradable](https://gist.github.com/igrigorik/5736866). {% endAside %}

Anteriormente, si deseaba procesar un recurso de algún tipo (ya sea un video o un archivo de texto, etc.), tendría que descargar el archivo completo, esperar a que se deserializara en un formato adecuado y luego procesar eso. Con los flujos disponibles para JavaScript, todo esto cambia. Ahora puede tratar datos sin procesar con JavaScript de forma progresiva tan pronto como estén disponibles en el cliente, sin necesidad de generar un búfer, una cadena o un blob. Esto desbloquea una serie de casos de uso, algunos de los cuales enumero a continuación:

- **Efectos de video:** canalizar un flujo de video de lectura a través de una flujo de transformación que aplica efectos en tiempo real.
- **(Des)compresión de datos:** canalizar un flujo de archivos a través de un flujo de transformación que lo (des)comprime selectivamente.
- **Decodificación de imágenes:** canalizar un flujo de respuesta HTTP a través de un flujo de transformación que decodifica bytes en datos de mapa de bits y luego a través de otro flujo de transformación que traduce mapas de bits a PNG. Si se instala dentro del `fetch` de un service worker, esto le permite rellenar de forma transparente nuevos formatos de imagen como AVIF.

## Conceptos básicos

Antes de entrar en detalles sobre los distintos tipos de flujos, permítanme presentar algunos conceptos básicos.

### Fragmentos

Un fragmento es una **sola pieza de datos** que se escribe o se lee desde un flujo. Puede ser de cualquier tipo; los flujos pueden incluso contener fragmentos de diferentes tipos. La mayoría de las veces, un fragmento no será la unidad de datos más atómica para un flujo determinado. Por ejemplo, un flujo de bytes puede contener fragmentos que constan de unidades  `Uint8Array` de 16 KiB, en lugar de bytes individuales.

### Flujos de lectura

Un flujo de lectura representa una fuente de datos desde la que usted puede leer. En otras palabras, los datos **provienen** de un flujo de lectura. Concretamente, un flujo de lectura es una instancia de la clase `ReadableStream`.

### Flujos de escritura

Un flujo de escritura representa un destino para los datos en el que se puede escribir. En otras palabras, los datos **ingresan** a un flujo de escritura. Concretamente, un flujo de escritura es una instancia de la clase `WritableStream`.

### Flujos de transformación

Un flujo de transformación consta de un **par de flujos**: un flujo de escritura, conocido como su lado de escritura, y un flujo de lectura, conocido como su lado de lectura. Una metáfora del mundo real para esto sería un [intérprete simultáneo](https://en.wikipedia.org/wiki/Simultaneous_interpretation) que traduce de un idioma a otro sobre la marcha. De una manera específica para el flujo de transformación, escribir en el lado de escritura da como resultado que nuevos datos estén disponibles para leer desde el lado de lectura. Concretamente, cualquier objeto con una propiedad `writable` y una propiedad `readable` puede servir como un flujo de transformación. Sin embargo, la clase `TransformStream` estándar facilita la creación de un par de este tipo que esté correctamente entrelazado.

### Cadenas de tuberías

Los flujos se utilizan principalmente al **canalizarlos** entre sí. Un flujo de lectura se puede canalizar directamente a un flujo de escritura, mediante el método `pipeTo()` del flujo de lectura, o se puede canalizar primero a través de un o más flujos de transformación, mediante el método `pipeThrough()`. Un **{nbsp}conjunto de flujos canalizados en conjunto** de esta manera se denomina cadena de tuberías.

### Contrapresión

Una vez que se construye una cadena de tuberías, propagará señales con respecto a la rapidez con que los fragmentos deben fluir a través de ella. Si algún paso de la cadena aún no puede aceptar fragmentos, se propaga una señal hacia atrás a través de la cadena de tuberías, hasta que finalmente se le indica a la fuente original que deje de producir fragmentos tan rápido. Este proceso de **normalización del flujo** se llama contrapresión.

### Procesamiento en T

Un flujo de lectura puede procesarse en T (nombrado por la forma de una 'T' mayúscula) mediante su método `tee()`. Esto **bloqueará** el flujo, es decir, dejará de ser utilizable directamente. Sin embargo, creará **dos nuevos flujos**, llamados ramas, que se pueden consumir de forma independiente. El procesamiento en T también es importante porque los flujos no se pueden rebobinar ni reiniciar, explicaré más sobre esto posteriormente.

<figure><comment data-md-type="comment"></comment>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/M70SLIvXhMkYfxDm5b98.svg", alt="Diagrama de una cadena de tuberías que consta de un flujo de lectura procedente de una invocación a la API Fetch que luego se canaliza a través de un flujo de transformación cuya salida se conecta y luego envía al navegador para el primer flujo de lectura resultante y a la caché del service worker para el segundo flujo de lectura resultante.", width="800", height ="430"%} <figcaption>Una cadena de tuberías.</figcaption></figure>

## La mecánica de un flujo de lectura

Un flujo de lectura es una fuente de datos representada en JavaScript por un objeto [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) que fluye desde una fuente subyacente. El constructor [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) crea y devuelve un objeto de flujo de lectura de los controladores dados. Hay dos tipos de fuentes subyacentes:

- **Las fuentes de inserción** le envían datos constantemente cuando ha accedido a ellas, y depende de usted iniciar, pausar o cancelar el acceso al flujo. Los ejemplos incluyen flujos de video en vivo, eventos enviados por el servidor o WebSockets.
- **Las fuentes de extracción** requieren que solicite los datos explícitamente una vez que se haya conectado. Los ejemplos incluyen operaciones HTTP a través de invocaciones `fetch()` o `XMLHttpRequest`.

Los datos del flujo se leen secuencialmente en pequeños pedazos llamados **fragmentos**. Se dice que los fragmentos colocados en un flujo están en **cola**. Esto significa que están esperando en una cola listos para ser leídos. Una **cola interna** realiza un seguimiento de los fragmentos que aún no se han leído.

Una **estrategia de cola** es un objeto que determina la manera en que un flujo debe señalar la contrapresión en función del estado de su cola interna. La estrategia de cola asigna un tamaño a cada fragmento y compara el tamaño total de todos los fragmentos de la cola con un número específico, conocido como **marca de agua máxima**.

**Un lector** lee los fragmentos dentro del flujo. Este lector recupera los datos un fragmento a la vez, lo que le permite realizar cualquier tipo de operación que desee realizar en él. El lector más el otro código de procesamiento que lo acompaña se denominan como un **consumidor**.

La siguiente construcción en este contexto se llama **controlador**. Cada flujo de lectura tiene un controlador asociado que, como su nombre lo indica, le permite controlar el flujo.

Solo un lector puede leer un flujo a la vez; cuando se crea un lector y comienza a leer un flujo (es decir, se convierte en un **lector activo**), se **bloquea** para ese flujo. Si desea que otro lector se haga cargo de la lectura de su flujo, normalmente debe **liberar** el primer lector antes de hacer cualquier otra cosa (aunque puede **procesar en T** los flujos).

### Crear un flujo de lectura

Puede crear una flujo de lectura si invoca a su constructor [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream). El constructor tiene un argumento opcional `underlyingSource`, que representa un objeto con métodos y propiedades que definen cómo se comportará la instancia de flujo construido.

#### El argumento `underlyingSource`

Esto puede utilizar los siguientes métodos opcionales definidos por el desarrollador:

- `start(controller)`: se invoca inmediatamente cuando se construye el objeto. El método puede acceder a la fuente del flujo y hacer cualquier otra cosa necesaria para configurar la funcionalidad del flujo. Si este proceso se realizará de forma asincrónica, el método puede devolver una promesa para señalar el éxito o el fracaso. El parámetro `controller` pasado a este método es un [`ReadableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController).
- `pull(controller)`: se puede usar para controlar el flujo a medida que se obtienen más fragmentos. Se invoca repetidamente siempre que la cola interna de fragmentos del flujo no esté llena, hasta que la cola alcance su nivel máximo. Si el resultado de invocar a `pull()` es una promesa, `pull()` no se invocará de nuevo hasta que dicha promesa se realice. Si la promesa se rechaza, el flujo tendrá errores.
- `cancel(reason)`: se invoca cuando el consumidor del flujo cancela el flujo.

```js
const readableStream = new ReadableStream({
  start(controller) {
    /* … */
  },

  pull(controller) {
    /* … */
  },

  cancel(reason) {
    /* … */
  },
});
```

`ReadableStreamDefaultController` admite los siguientes métodos:

- [`ReadableStreamDefaultController.close()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/close) cierra el flujo asociado.
- [`ReadableStreamDefaultController.enqueue()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/enqueue) pone en cola un fragmento determinado en el flujo asociado.
- [`ReadableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/error) provoca errores en cualquier interacción futura con el flujo asociado.

```js
/* … */
start(controller) {
  controller.enqueue('El primer fragmento');
},
/* … */
```

#### El argumento `queuingStrategy`

El segundo argumento igualmente opcional del constructor `ReadableStream()` es `queuingStrategy`. Es un objeto que opcionalmente define una estrategia de cola para el flujo, que toma dos parámetros:

- `highWaterMark`: un número no negativo que indica la marca de agua máxima del flujo que utiliza esta estrategia de cola.
- `size(chunk)`: una función que calcula y devuelve el tamaño finito no negativo del valor del fragmento dado. El resultado se utiliza para determinar la contrapresión, que se manifiesta a través de la propiedad `ReadableStreamDefaultController.desiredSize`. También gobierna el momento en que se invoca al método `pull()`.

```js
const readableStream = new ReadableStream({
    /* … */
  },
  {
    highWaterMark: 10,
    size(chunk) {
      return chunk.length;
    },
  },
);
```

{% Aside %} Puede definir su propia `queuingStrategy` personalizada o utilizar una instancia de [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) o [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) para el valor de este objeto. Si no se suministra una `queuingStrategy`, el valor predeterminado utilizado será el mismo que `CountQueuingStrategy` con una `highWaterMark` de `1`. {% endAside %}

#### Los métodos `getReader()` y `read()`

Para leer desde un flujo de lectura, necesita un lector, que será un [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader). El método `getReader()` de la interfaz `ReadableStream` crea un lector y bloquea el flujo en él. Mientras que el flujo esté bloqueado, no se puede adquirir ningún otro lector hasta que se libere este.

El método [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) de la interfaz `ReadableStreamDefaultReader` devuelve una promesa que proporciona acceso al siguiente fragmento de la cola interna del flujo. Se cumple o se rechaza con un resultado en función del estado del flujo. Las diferentes posibilidades son las siguientes:

- Si hay un fragmento disponible, la promesa se cumplirá con un objeto de la forma<br> `{ value: chunk, done: false }`.
- Si el flujo se cierra, la promesa se cumplirá con un objeto de la forma<br> `{ value: undefined, done: true }`.
- Si el flujo tiene errores, la promesa se rechazará con el error correspondiente.

```js
const reader = readableStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    console.log('The stream is done.');
    break;
  }
  console.log('Just read a chunk:', value);
}
```

#### La propiedad `locked`

Puede comprobar si un flujo de lectura está bloqueado si accede a su propiedad [`ReadableStream.locked`](https://developer.mozilla.org/docs/Web/API/ReadableStream/locked).

```js
const locked = readableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### Muestras de código de flujo de lectura

El siguiente ejemplo de código muestra todos los pasos en acción. Primero cree un `ReadableStream` que en su argumento `underlyingSource` (es decir, la clase `TimestampSource`) defina un método `start()`. Este método le indica al `controller` del flujo que `enqueue()` (ponga en cola) una marca de tiempo cada segundo durante diez segundos. Finalmente, le dice al controlador que `close()` (cierre) el flujo. Usted consume este flujo al crear un lector mediante el método `getReader()` y al invocar a `read()` hasta que el flujo se indique como `done` (finalizado).

```js
class TimestampSource {
  #interval

  start(controller) {
    this.#interval = setInterval(() => {
      const string = new Date().toLocaleTimeString();
      // Add the string to the stream.
      controller.enqueue(string);
      console.log(`Enqueued ${string}`);
    }, 1_000);

    setTimeout(() => {
      clearInterval(this.#interval);
      // Close the stream after 10s.
      controller.close();
    }, 10_000);
  }

  cancel() {
    // This is called if the reader cancels.
    clearInterval(this.#interval);
  }
}

const stream = new ReadableStream(new TimestampSource());

async function concatStringStream(stream) {
  let result = '';
  const reader = stream.getReader();
  while (true) {
    // The `read()` method returns a promise that
    // resolves when a value has been received.
    const { done, value } = await reader.read();
    // Result objects contain two properties:
    // `done`  - `true` if the stream has already given you all its data.
    // `value` - Some data. Always `undefined` when `done` is `true`.
    if (done) return result;
    result += value;
    console.log(`Read ${result.length} characters so far`);
    console.log(`Most recently read chunk: ${value}`);
  }
}
concatStringStream(stream).then((result) => console.log('Stream complete', result));
```

### Iteración asincrónica

Comprobar sobre cada iteración del bucle `read()` si el flujo está `done` (finalizado) quizá no sea la API más conveniente. Afortunadamente, pronto habrá una mejor manera de hacer esto, la iteración asincrónica.

```js
for await (const chunk of stream) {
  console.log(chunk);
}
```

{% Aside 'caution' %} La iteración asincrónica aún no está implementada en ningún navegador. {% endAside %}

Una solución alternativa a utilizar la iteración asincrónica hoy en día es implementar el comportamiento con una función auxiliar. Esto le permite usar la función en su código como se muestra en el fragmento a continuación.

```js
function streamAsyncIterator(stream) {
  // Get a lock on the stream:
  const reader = stream.getReader();

  return {
    next() {
      // Stream reads already resolve with {done, value}, so
      // we can just call read:
      return reader.read();
    },
    return() {
      // Release the lock if the iterator terminates.
      reader.releaseLock();
      return {};
    },
    // for-await calls this on whatever it's passed, so
    // iterators tend to return themselves.
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

async function example() {
  const response = await fetch(url);
  for await (const chunk of streamAsyncIterator(response.body)) {
    console.log(chunk);
  }
}
```

### Procesar en T un flujo de lectura

El método [`tee()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee) de la interfaz `ReadableStream` procesa en T el flujo de lectura actual, para devolver una matriz de dos elementos que contiene las dos ramas resultantes como nuevas instancias de `ReadableStream`. Esto permite que dos lectores lean un flujo simultáneamente. Usted puede hacer esto, por ejemplo, en un service worker si desea obtener una respuesta del servidor y transmitirla al navegador, pero también transmitirla a la caché del service worker. Dado que un cuerpo de respuesta no se puede consumir más de una vez, necesita dos copias para hacer esto. Para cancelar el flujo, debe cancelar ambas ramas resultantes. El inicio de un flujo generalmente la bloqueará durante el tiempo que dure, lo que evitará que otros lectores lo bloqueen.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called `read()` when the controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

// Create two `ReadableStream`s.
const [streamA, streamB] = readableStream.tee();

// Read streamA iteratively one by one. Typically, you
// would not do it this way, but you certainly can.
const readerA = streamA.getReader();
console.log('[A]', await readerA.read()); //=> {value: "a", done: false}
console.log('[A]', await readerA.read()); //=> {value: "b", done: false}
console.log('[A]', await readerA.read()); //=> {value: "c", done: false}
console.log('[A]', await readerA.read()); //=> {value: "d", done: false}
console.log('[A]', await readerA.read()); //=> {value: undefined, done: true}

// Read streamB in a loop. This is the more common way
// to read data from the stream.
const readerB = streamB.getReader();
while (true) {
  const result = await readerB.read();
  if (result.done) break;
  console.log('[B]', result);
}
```

## Flujos de bytes de lectura

Para los flujos que representan bytes, se proporciona una versión extendida del flujo de lectura para manejar bytes de manera eficiente, en particular al minimizar las copias. Los flujos de bytes permiten que se adquieran los lectores "traiga su propio búfer" (bring-your-own-buffer, BYOB). La implementación predeterminada puede proporcionar un rango de salidas diferentes, como cadenas o búferes de matriz en el caso de WebSockets, mientras que los flujos de bytes garantizan la salida de bytes. Además, los lectores BYOB tienen beneficios de estabilidad. Esto se debe a que si un búfer se desconecta, puede garantizar que no se escriba en el mismo búfer dos veces, para evitar así las condiciones de carrera. Los lectores BYOB pueden reducir la cantidad de veces que el navegador necesita ejecutar la recolección de basura, ya que puede reutilizar los búferes.

### Crear un flujo de bytes de lectura

Puede crear un flujo de bytes de lectura si pasa un parámetro adicional `type` al constructor `ReadableStream()`.

```js
new ReadableStream({ type: 'bytes' });
```

#### El argumento `underlyingSource`

La fuente subyacente de un flujo de bytes de lectura recibe un `ReadableByteStreamController` para su manipulación. Su método `ReadableByteStreamController.enqueue()` toma un `chunk` cuyo valor es una `ArrayBufferView`. La propiedad `ReadableByteStreamController.byobRequest` devuelve la solicitud de extracción BYOB actual, o un valor nulo si no hay ninguna. Finalmente, la propiedad `ReadableByteStreamController.desiredSize` devuelve el tamaño deseado para llenar la cola interna del flujo controlado.

### El argumento `queuingStrategy`

El segundo argumento, igualmente opcional del constructor `ReadableStream()` es `queuingStrategy`. Es un objeto que define opcionalmente una estrategia de cola para el flujo, que toma un parámetro:

- `highWaterMark`: un número no negativo de bytes que indica la marca de agua máxima del flujo que utiliza esta estrategia de cola. Esto se utiliza para determinar la contrapresión, que se manifiesta mediante de la propiedad `ReadableByteStreamController.desiredSize`. También controla el momento en que se invoca el método `pull()`.

{% Aside %} A diferencia de las estrategias de cola para otros tipos de flujo, una estrategia de cola para un flujo de bytes de lectura no tiene una función de `size(chunk)`. El tamaño de cada fragmento siempre está determinado por su propiedad `byteLength`. {% endAside %}

{% Aside %} Si no se suministra una `queuingStrategy`, el valor predeterminado utilizado es uno con una `highWaterMark` igual a `0`. {% endAside %}

#### Los métodos `getReader()` y `read()`

Posteriormente, puede obtener acceso a un `ReadableStreamBYOBReader` si configura el parámetro `mode` en consecuencia: `ReadableStream.getReader({ mode: "byob" })`. Esto permite un control más preciso sobre la asignación del búfer para evitar copias. Para leer del flujo de bytes, debe invocar a `ReadableStreamBYOBReader.read(view)`, donde `view` es una [`ArrayBufferView`](https://developer.mozilla.org/docs/Web/API/ArrayBufferView).

#### Ejemplo de código de flujo de bytes de lectura

```js
const reader = readableStream.getReader({ mode: "byob" });

let startingAB = new ArrayBuffer(1_024);
const buffer = await readInto(startingAB);
console.log("The first 1024 bytes, or less:", buffer);

async function readInto(buffer) {
  let offset = 0;

  while (offset < buffer.byteLength) {
    const { value: view, done } =
        await reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset));
    buffer = view.buffer;
    if (done) {
      break;
    }
    offset += view.byteLength;
  }

  return buffer;
}
```

La siguiente función devuelve flujos de bytes de lectura que permiten una lectura eficiente de copia cero de una matriz generada aleatoriamente. En lugar de utilizar un tamaño de fragmento predeterminado de 1024, intenta llenar el búfer proporcionado por el desarrollador, lo que permite un control total.

```js
const DEFAULT_CHUNK_SIZE = 1_024;

function makeReadableByteStream() {
  return new ReadableStream({
    type: 'bytes',

    pull(controller) {
      // Even when the consumer is using the default reader,
      // the auto-allocation feature allocates a buffer and
      // passes it to us via `byobRequest`.
      const view = controller.byobRequest.view;
      view = crypto.getRandomValues(view);
      controller.byobRequest.respond(view.byteLength);
    },

    autoAllocateChunkSize: DEFAULT_CHUNK_SIZE,
  });
}
```

## La mecánica de un flujo de escritura

Un flujo de escritura es un destino en el que puede escribir datos, representados en JavaScript por un objeto [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream). Esto sirve como una abstracción sobre la parte superior de un **receptor de datos subyacente,** un receptor de datos de E/S de nivel inferior en el que se escriben los datos sin procesar.

Los datos se escriben en el flujo a través de un **escritor**, un fragmento a la vez. Un fragmento puede adoptar una multitud de formas, al igual que los fragmentos de un lector. Puede utilizar cualquier código que desee para producir los fragmentos listos para escritura; al escritor más el código asociado se le conoce como **productor**.

Cuando se crea un escritor y comienza a escribir en un flujo (un **escritor activo**), se dice que está **bloqueado**. Solo un escritor puede escribir en un flujo de escritura a la vez. Si desea que otro escritor comience a escribir en su flujo, normalmente debe liberarlo antes de adjuntar otro escritor.

Una **cola interna** realiza un seguimiento de los fragmentos que se han escrito en el flujo pero que el receptor subyacente aún no ha procesado.

Una **estrategia de cola** es un objeto que determina cómo un flujo debe señalar la contrapresión en función del estado de su cola interna. La estrategia de cola asigna un tamaño a cada fragmento y compara el tamaño total de todos los fragmentos de la cola con un número específico, conocido como **marca de agua máxima**.

La construcción final se llama **controlador**. Cada flujo de escritura tiene un controlador asociado que le permite controlar el flujo (por ejemplo, cancelarlo).

### Crear un flujo de escritura

La interfaz [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) de la API de flujos proporciona una abstracción estándar para escribir los datos de transmisión de flujos hacia un destino, conocido como receptor. Este objeto viene con contrapresión y cola incorporadas. Puede crear un flujo de escritura si invoca a su constructor [`WritableStream()`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream). Tiene un parámetro `underlyingSink` opcional, que representa un objeto con métodos y propiedades que definen cómo se comportará la instancia de flujo construida.

#### El parámetro `underlyingSink`

El parámetro `underlyingSink` puede incluir los siguientes métodos opcionales definidos por el desarrollador. El parámetro `controller` que se pasa a algunos de los métodos es un [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController).

- `start(controller)`: este método se invoca inmediatamente cuando se construye el objeto. El contenido de este método debe tener como objetivo obtener acceso al receptor de datos subyacente. Si este proceso se realizará de forma asincrónica, puede devolver una promesa para señalar el éxito o el fracaso.
- `write(chunk, controller)`: este método se invocará cuando un nuevo fragmento de datos (especificado en el `chunk`) esté listo para escribirse en el receptor de datos subyacente. Puede devolver una promesa para señalar el éxito o el fracaso de la operación de escritura. Este método se invocará solo después de que las escrituras anteriores hayan tenido éxito y nunca después de que el flujo se cierre o se anule.
- `close(controller)`: este método se invocará si la aplicación indica que ha terminado de escribir fragmentos en el flujo. El contenido debe hacer todo lo necesario para finalizar las escrituras en el receptor de datos subyacente y liberar el acceso a él. Si este proceso es asincrónico, puede devolver una promesa para señalar el éxito o el fracaso. Este método se invocará solo después de que todas las escrituras en cola hayan tenido éxito.
- `abort(reason)`: este método se invocará si la aplicación indica que desea cerrar abruptamente el flujo y ponerla en un estado con errores. Puede limpiar cualquier recurso retenido, al igual que `close()`, pero se invocará a `abort()` incluso si las escrituras están en cola. Esos fragmentos se desecharán. Si este proceso es asincrónico, puede devolver una promesa para señalar el éxito o el fracaso. El parámetro `reason` contiene una `DOMString` que describe por qué se canceló el flujo.

```js
const writableStream = new WritableStream({
  start(controller) {
    /* … */
  },

  write(chunk, controller) {
    /* … */
  },

  close(controller) {
    /* … */
  },

  abort(reason) {
    /* … */
  },
});
```

La interfaz [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController) de la API de flujos representa un controlador que permite el control del estado de un `WritableStream` durante la configuración, a medida que se envían más fragmentos para escritura o al final de la escritura. Al construir un `WritableStream`, el receptor de datos subyacente recibe una instancia `WritableStreamDefaultController` correspondiente para manipular. El `WritableStreamDefaultController` solo tiene un método: [`WritableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController/error), que provoca que cualquier interacción futura con el flujo asociado produzca errores.

```js
/* … */
write(chunk, controller) {
  try {
    // Try to do something dangerous with `chunk`.
  } catch (error) {
    controller.error(error.message);
  }
},
/* … */
```

#### El argumento `queuingStrategy`

El segundo argumento, igualmente opcional, del constructor `WritableStream()` es `queuingStrategy`. Es un objeto que opcionalmente define una estrategia de cola para el flujo, que toma dos parámetros:

- `highWaterMark`: un número no negativo que indica la marca de agua máxima del flujo que utiliza esta estrategia de cola.
- `size(chunk)`: una función que calcula y devuelve el tamaño finito no negativo del valor de fragmento dado. El resultado se utiliza para determinar la contrapresión, que se manifiesta a través de la propiedad `WritableStreamDefaultWriter.desiredSize`.

{% Aside %} Puede definir su propia `queuingStrategy` personalizada o utilizar una instancia de [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) o [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) para este valor de objeto. Si no se suministra una `queuingStrategy`, el valor predeterminado utilizado es el mismo que `CountQueuingStrategy` con una `highWaterMark` de `1`. {% endAside %}

#### Los métodos `getWriter()` y `write()`

Para escribir en un flujo de escritura, necesita un escritor, que será `WritableStreamDefaultWriter`. El método `getWriter()` de la interfaz `WritableStream` devuelve una nueva instancia de `WritableStreamDefaultWriter` y bloquea el flujo en esa instancia. Mientras el flujo esté bloqueado, no se puede adquirir ningún otro escritor hasta que se libere el actual.

El método [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write) de la interfaz [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) escribe un fragmento de datos pasado en un `WritableStream` y su receptor de datos subyacente, luego devuelve una promesa que se resuelve para indicar el éxito o el fracaso de la operación de escritura. Tenga en cuenta que lo que significa "éxito" depende del receptor de datos subyacente; podría indicar que el fragmento ha sido aceptado y no necesariamente que se haya guardado de forma segura en su destino final.

```js
const writer = writableStream.getWriter();
const resultPromise = writer.write('The first chunk!');
```

#### La propiedad `locked`

Puede comprobar si un flujo de escritura está bloqueado si accede a su propiedad [`WritableStream.locked`](https://developer.mozilla.org/docs/Web/API/WritableStream/locked).

```js
const locked = writableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### Ejemplo de código de flujo de escritura

El siguiente ejemplo de código muestra todos los pasos en acción.

```js
const writableStream = new WritableStream({
  start(controller) {
    console.log('[start]');
  },
  async write(chunk, controller) {
    console.log('[write]', chunk);
    // Wait for next write.
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

const writer = writableStream.getWriter();
const start = Date.now();
for (const char of 'abcdefghijklmnopqrstuvwxyz') {
  // Wait to add to the write queue.
  await writer.ready;
  console.log('[ready]', Date.now() - start, 'ms');
  // The Promise is resolved after the write finishes.
  writer.write(char);
}
await writer.close();
```

### Canalización de un flujo de lectura a un flujo de escritura

Un flujo de lectura se puede canalizar a un flujo de escritura mediante el método [`pipeTo()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo). `ReadableStream.pipeTo()` canaliza el `ReadableStream` actual a un `WritableStream` dado y devuelve una promesa que se cumple cuando el proceso de canalización se completa con éxito, o se rechaza si se encuentra algún error.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start readable]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called when controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

const writableStream = new WritableStream({
  start(controller) {
    // Called by constructor
    console.log('[start writable]');
  },
  async write(chunk, controller) {
    // Called upon writer.write()
    console.log('[write]', chunk);
    // Wait for next write.
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

await readableStream.pipeTo(writableStream);
console.log('[finished]');
```

## Crear un flujo de transformación

La interfaz `TransformStream` de la API de flujos representa un conjunto de datos transformables. Puede crear un flujo de transformación si invoca a su constructor `TransformStream()`, que crea y devuelve un objeto de flujo de transformación a partir de los controladores dados. El constructor `TransformStream()` acepta como primer argumento un objeto JavaScript opcional que representa el `transformer`. Dichos objetos pueden contener cualquiera de los siguientes métodos:

### El método `transformer`

- `start(controller)`: este método se invoca inmediatamente cuando se construye el objeto. Por lo general, esto se usa para poner en cola fragmentos de prefijo, mediante `controller.enqueue()`. Esos fragmentos se leerán desde el lado de lectura, pero no dependen de ninguna escritura en el lado de escritura. Si este proceso inicial es asincrónico, por ejemplo, porque se necesita algo de esfuerzo para adquirir los fragmentos de prefijo, la función puede devolver una promesa para señalar el éxito o el fracaso; una promesa rechazada producirá un error en el flujo. Cualquier excepción lanzada será relanzada por el constructor `TransformStream()`.
- `transform(chunk, controller)`: este método se invoca cuando un nuevo fragmento originalmente escrito en el lado de escritura está listo para ser transformado. La implementación del flujo garantiza que esta función se invoque solo después de que las transformaciones anteriores hayan tenido éxito, y nunca antes de que `start()` se haya completado o después de que `flush()` se haya invocado. Esta función realiza el trabajo de transformación real del flujo de transformación. Puede poner los resultados en cola mediante `controller.enqueue()`. Esto permite que un solo fragmento escrito en el lado de escritura resulte en cero o en varios fragmentos en el lado de lectura, en función de cuántas veces se se invoque a `controller.enqueue()`. Si el proceso de transformación es asincrónico, esta función puede devolver una promesa para señalar el éxito o el fracaso de la transformación. Una promesa rechazada generará errores en los lados de lectura y de escritura del flujo de transformación. Si no se usa un método `transform()`, se usa la transformación de identidad, que pone en cola fragmentos sin cambios desde el lado de escritura al lado de lectura.
- `flush(controller)`: este método se invoca después de que todos los fragmentos escritos en el lado de escritura se hayan transformado al pasar con éxito a través de `transform()`, y el lado de escritura esté a punto de cerrarse. Por lo general, esto se usa para poner en cola fragmentos de sufijos en el lado de lectura, antes de que también se cierre. Si el proceso de vaciado es asincrónico, la función puede devolver una promesa para señalar el éxito o el fracaso; el resultado se comunicará a la instancia que invoque `stream.writable.write()`. Además, una promesa rechazada generará errores en los lados del flujo de lectura y escritura. El lanzamiento de una excepción se trata de la misma forma que la devolución de una promesa rechazada.

```js
const transformStream = new TransformStream({
  start(controller) {
    /* … */
  },

  transform(chunk, controller) {
    /* … */
  },

  flush(controller) {
    /* … */
  },
});
```

### Las estrategias de cola `writableStrategy` y `readableStrategy`

El segundo y tercer parámetros opcionales del constructor `TransformStream()` son las estrategias opcionales de cola `writableStrategy` y `readableStrategy`. Se definen como se describe en las secciones de flujo de [lectura](#the-queuingstrategy) y de [escritura](#the-queuingstrategy-3) respectivamente.

### Ejemplo de código de flujo de transformación

El siguiente ejemplo de código muestra un flujo de transformación simple en acción.

```js
// Note that `TextEncoderStream` and `TextDecoderStream` exist now.
// This example shows how you would have done it before.
const textEncoderStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

(async () => {
  const readStream = textEncoderStream.readable;
  const writeStream = textEncoderStream.writable;

  const writer = writeStream.getWriter();
  for (const char of 'abc') {
    writer.write(char);
  }
  writer.close();

  const reader = readStream.getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

### Canalización de un flujo de lectura a través de un flujo de transformación

El método [`pipeThrough()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeThrough) de la interfaz `ReadableStream` proporciona una forma encadenable de canalizar el flujo actual a través de un flujo de transformación o cualquier otro par de escritura/lectura. La canalización de un flujo generalmente lo bloqueará durante la duración de la tubería, evitando que otros lectores lo bloqueen.

```js
const transformStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

const readableStream = new ReadableStream({
  start(controller) {
    // called by constructor
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // called read when controller's queue is empty
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // or controller.error();
  },
  cancel(reason) {
    // called when rs.cancel(reason)
    console.log('[cancel]', reason);
  },
});

(async () => {
  const reader = readableStream.pipeThrough(transformStream).getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

El siguiente ejemplo de código (un poco artificial) muestra cómo se podría implementar una versión "vociferante" de `fetch()` que pone en mayúsculas todo el texto al consumir la promesa de respuesta devuelta [como un flujo](https://developer.mozilla.org/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_as_a_stream) y al poner en mayúsculas fragmento por fragmento. La ventaja de este enfoque es que no es necesario esperar a que se descargue todo el documento, lo que puede marcar una gran diferencia cuando se trata de archivos grandes.

```js
function upperCaseStream() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });
}

function appendToDOMStream(el) {
  return new WritableStream({
    write(chunk) {
      el.append(chunk);
    }
  });
}

fetch('./lorem-ipsum.txt').then((response) =>
  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(upperCaseStream())
    .pipeTo(appendToDOMStream(document.body))
);
```

## Soporte de navegador y polyfill

La compatibilidad de los navegadores con la API de flujos varía. Asegúrese de verificar la sección [¿Puedo usarla?](https://caniuse.com/streams) para obtener datos de compatibilidad detallados. Tenga en cuenta que algunos navegadores solo tienen implementaciones parciales de ciertas características, así que asegúrese de verificar los datos a fondo.

La buena noticia es que hay una [implementación de referencia](https://github.com/whatwg/streams/tree/master/reference-implementation) disponible y un [polyfill](https://github.com/MattiasBuelens/web-streams-polyfill) destinado al uso en producción.

{% Aside 'gotchas' %} Si es posible, cargue el polyfill condicionalmente y solo si la función incorporada no está disponible. {% endAside %}

## Demostración

La siguiente demostración muestra flujos de lectura, de escritura y de transformación en acción. También incluye ejemplos de las cadenas de tubería `pipeThrough()` y `pipeTo()` y además demuestra el uso de `tee()`. Opcionalmente, puede ejecutar la [demostración](https://streams-demo.glitch.me/) en su propia ventana o ver el [código fuente](https://glitch.com/edit/#!/streams-demo?path=script.js).

{% Glitch 'streams-demo' %}

## Flujos útiles disponibles en el navegador

Hay una serie de flujos útiles integradas en el navegador. Puede crear fácilmente un `ReadableStream` a partir de un blob. El método [stream()](https://developer.mozilla.org/docs/Web/API/Blob/stream) de la interfaz [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob/stream) devuelve un `ReadableStream` que, al leerlo, devuelve los datos contenidos en el blob. Recuerde también que un objeto [`File`](https://developer.mozilla.org/docs/Web/API/File) es un tipo específico de `Blob` y se puede usar en cualquier contexto en el que pueda hacerlo un blob.

```js
const readableStream = new Blob(['hola mundo'], { type: 'text/plain' }).stream();
```

Las variantes de transmisión de flujos de `TextDecoder.decode()` y `TextEncoder.encode()` se denominan [`TextDecoderStream`](https://encoding.spec.whatwg.org/#interface-textdecoderstream) y [`TextEncoderStream`](https://encoding.spec.whatwg.org/#interface-textencoderstream) respectivamente.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const decodedStream = response.body.pipeThrough(new TextDecoderStream());
```

Comprimir o descomprimir un archivo es fácil con los flujos de transformación [`CompressionStream`](https://wicg.github.io/compression/#compression-stream) y [`DecompressionStream`](https://wicg.github.io/compression/#decompression-stream). El siguiente ejemplo de código muestra cómo puede descargar la especificación de flujos, comprimirla (con gzip) directamente en el navegador y escribir el archivo comprimido directamente en el disco.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const readableStream = response.body;
const compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));

const fileHandle = await showSaveFilePicker();
const writableStream = await fileHandle.createWritable();
compressedStream.pipeTo(writableStream);
```

El [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#filesystemwritablefilestream) de la [API de acceso al sistema de archivos](/file-system-access/) y los flujos de solicitud [`fetch()`](/fetch-upload-streaming/#writable-streams) experimentales son ejemplos de flujos de escritura en condiciones reales.

La [API serial](/serial/) hace un uso intensivo de flujos tanto de lectura como de escritura.

```js
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();
// Wait for the serial port to open.
await port.open({ baudRate: 9_600 });
const reader = port.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}

// Write to the serial port.
const writer = port.writable.getWriter();
const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
await writer.write(data);
// Allow the serial port to be closed later.
writer.releaseLock();
```

Finalmente, la API [`WebSocketStream`](/websocketstream/) integra los flujos con la API de WebSocket.

```js
const wss = new WebSocketStream(WSS_URL);
const { readable, writable } = await wss.connection;
const reader = readable.getReader();
const writer = writable.getWriter();

while (true) {
  const { value, done } = await reader.read();
  if (done) {
    break;
  }
  const result = await process(value);
  await writer.write(result);
}
```

## Recursos útiles

- [Especificación de los flujos](https://streams.spec.whatwg.org/)
- [Demostraciones adjuntas](https://streams.spec.whatwg.org/demos/)
- [Flujos de polyfill](https://github.com/MattiasBuelens/web-streams-polyfill)
- [2016: el año de los flujos para la web](https://jakearchibald.com/2016/streams-ftw/)
- [Iteradores y generadores asincrónicos](https://jakearchibald.com/2017/async-iterators-and-generators/)
- [Visualizador de flujos](https://surma.dev/lab/whatwg-stream-visualizer/lab.html)

## Agradecimientos

Este artículo fue revisado por [Jake Archibald](https://jakearchibald.com/), [François Beaufort](https://github.com/beaufortfrancois), [Sam Dutton](https://samdutton.com/), [Mattias Buelens](https://github.com/MattiasBuelens), [Surma](https://surma.dev/), [Joe Medley](https://github.com/jpmedley) y [Adam Rice](https://github.com/ricea). Las publicaciones del blog de [Jake Archibald](https://jakearchibald.com/) me han ayudado mucho a comprender los flujos. Algunas de los ejemplos de código están inspiradas en las exploraciones del usuario de GitHub  [@bellbind](https://gist.github.com/bellbind/f6a7ba88e9f1a9d749fec4c9289163ac) y partes de la redacción se basan en gran medida en los [Documentos web MDN sobre flujos](https://developer.mozilla.org/docs/Web/API/Streams_API). Los [autores](https://github.com/whatwg/streams/graphs/contributors) del [Estándar de flujos](https://streams.spec.whatwg.org/) han hecho un gran trabajo al escribir esta especificación. La imagen hero es de [Ryan Lara](https://unsplash.com/@ryanlara) en [Unsplash](https://unsplash.com/).
