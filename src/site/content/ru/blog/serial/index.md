---
title: Действия по чтению и записи последовательного порта
subhead: Web Serial API позволяет веб-сайтам обмениваться данными с устройствами с последовательным интерфейсом.
authors:
  - beaufortfrancois
date: 2020-08-12
updated: 2021-11-18
hero: image/admin/PMOws2Au6GPLq9sXSSqw.jpg
thumbnail: image/admin/8diipQ5aHdP03xNuFNp7.jpg
alt: Старые модемы, роутеры, сетевое оборудование. Последовательные и телефонные разъемы, аудиоразъемы, Ethernet-разъемы.
description: |2

  Web Serial API соединяет сеть и физический мир, позволяя веб-сайтам обмениваться данными с устройствами с последовательным интерфейсом.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
---

{% Aside 'success' %} Web Serial API — это часть [проекта возможностей](https://developer.chrome.com/blog/fugu-status/), запущенного в Chrome 89. {% endAside %}

## Что такое Web Serial API? {: #what }

Последовательный порт — это двунаправленный интерфейс связи, который позволяет посылать и получать данные побайтно.

Web Serial API предоставляет веб-сайтам способ осуществлять действия по чтению/записи последовательного устройства с помощью JavaScript. Последовательные устройства подключаются либо через последовательный порт в системе пользователя, либо через съемные устройства USB и Bluetooth, которые имитируют последовательный порт.

Другими словами, Web Serial API соединяет сеть и физический мир, позволяя веб-сайтам обмениваться данными с устройствами с последовательным интерфейсом, такими как микроконтроллеры и 3D-принтеры.

Этот API также является отличным дополнением к [WebUSB](https://developers.google.com/web/updates/2016/03/access-usb-devices-on-the-web), поскольку операционные системы требуют, чтобы приложения взаимодействовали с некоторыми последовательными портами, используя свой высокоуровневый последовательный API, а не низкоуровневый USB API.

## Предлагаемые варианты использования {: #use-cases }

В образовательном, любительском и промышленном секторах пользователи подключают периферийные устройства к компьютерам. Эти устройства часто управляются микроконтроллерами через последовательное соединение, используемое специальным программным обеспечением. Некоторое программное обеспечение для управления этими устройствами создано с применением веб-технологий:

- [Arduino Create](https://create.arduino.cc/);
- [Betaflight Configurator](https://github.com/betaflight/betaflight-configurator);
- [Espruino Web IDE](http://espruino.com/ide);
- [Microsoft MakeCode](https://www.microsoft.com/en-us/makecode).

Веб-сайты могут связываться с устройством через приложение-агент, которое пользователи устанавливают вручную. Иногда устанавливается пакетное приложение через фреймворк, такой как Electron. В отдельных случаях от пользователя требуется выполнить дополнительные действия, например, скопировать скомпилированное приложение на устройство через USB-накопитель.

Во всех этих случаях пользовательский опыт будет улучшен за счет обеспечения прямой связи между веб-сайтом и устройством, которым он управляет.

## Текущий статус {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Этап</th>
<th data-md-type="table_cell">Статус</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Составление объяснительного материала.</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/serial/blob/main/EXPLAINER.md" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Создание черновика спецификации.</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/serial" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Сбор отзывов и доработка проекта.</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Испытания по схеме Origin Trial.</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/2992641952387694593" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Запуск.</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><a>Завершен</a></strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Использование Web Serial API {: #use }

### Обнаружение функции {: #feature-detection }

Чтобы проверить, поддерживается ли Web Serial API, используйте:

```js
if ("serial" in navigator) {
  // The Web Serial API is supported.
}
```

### Откройте последовательный порт {: #open-port }

Web Serial API является асинхронным по своей природе. Это предотвращает блокировку пользовательского интерфейса веб-сайта при ожидании ввода. Это важно, поскольку последовательные данные могут быть получены в любое время, а для этого должен существовать способ их прослушивания.

Чтобы открыть последовательный порт, сначала получите доступ к объекту `SerialPort`. Первый способ: предложить пользователю выбрать один последовательный порт, вызвав `navigator.serial.requestPort()` в ответ на жест пользователя (прикосновение или щелчок мыши). Второй способ: выбрать порт с помощью функции `navigator.serial.getPorts()`, возвращающего список всех последовательных портов, к которым у сайта есть доступ.

```js
document.querySelector('button').addEventListener('click', async () => {
  // Prompt user to select any serial port.
  const port = await navigator.serial.requestPort();
});
```

```js
// Get all serial ports the user has previously granted the website access to.
const ports = await navigator.serial.getPorts();
```

Функция `navigator.serial.requestPort()` принимает необязательный объектный литерал, определяющий фильтры. Они используются для поиска любого последовательного устройства, подключенного по USB, с обязательным идентификатором поставщика (`usbVendorId`) и необязательным идентификатором продукта (`usbProductId`) для USB-устройства.

```js
// Filter on devices with the Arduino Uno USB Vendor/Product IDs.
const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
  { usbVendorId: 0x2341, usbProductId: 0x0001 }
];

// Prompt user to select an Arduino Uno device.
const port = await navigator.serial.requestPort({ filters });

const { usbProductId, usbVendorId } = port.getInfo();
```

<figure>{% Img src="image/admin/BT9OxLREXfb0vcnHlYu8.jpg", alt="Скриншот веб-формы с выбором последовательного порта", width="800", height="513" %} <figcaption>Указание пользователю выбрать BBC micro:bit</figcaption></figure>

Вызов `requestPort()` предлагает пользователю выбрать устройство и возвращает объект `SerialPort` Если у вас есть `SerialPort` , вызов `port.open()` с желаемой скоростью передачи откроет последовательный порт. `baudRate` словаря baudRate указывает, насколько быстро данные передаются по последовательной линии. Он выражается в битах в секунду (бит / с). Проверьте правильность значения в документации вашего устройства, так как все данные, которые вы отправляете и получаете, будут бессмысленны, если они будут указаны неправильно. Для некоторых устройств USB и Bluetooth, которые имитируют последовательный порт, это значение может быть безопасно установлено на любое значение, поскольку оно игнорируется эмуляцией.

```js
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();

// Wait for the serial port to open.
await port.open({ baudRate: 9600 });
```

Вы также можете указать любую из опций ниже при открытии последовательного порта. Эти параметры не являются обязательными и имеют удобные [значения по умолчанию](https://wicg.github.io/serial/#serialoptions-dictionary) .

- `dataBits` : количество бит данных в кадре (7 или 8).
- `stopBits` : количество стоповых битов в конце кадра (1 или 2).
- `parity` : режим четности ( `"none"` , `"even"` или `"odd"` ).
- `bufferSize` : размер буферов чтения и записи, которые должны быть созданы (должен быть меньше 16 МБ).
- `flowControl` : режим управления потоком ( `"none"` или `"hardware"` ).

### Чтение из последовательного порта {: #read-port}

Потоки ввода и вывода в Web Serial API обрабатываются Streams API.

{% Aside %} Если потоки для вас впервые, ознакомьтесь с [концепциями Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts) . В этой статье даже поверхностно рассматриваются потоки и их обработка. {% endAside %}

После установления соединения через последовательный порт свойства `writable` `readable` и записи из объекта `SerialPort` [возвращают ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream) и [WritableStream](https://developer.mozilla.org/docs/Web/API/WritableStream) . Они будут использоваться для приема и отправки данных на последовательное устройство. Оба используют `Uint8Array` для передачи данных.

Когда новые данные поступают от последовательного устройства, `port.readable.getReader().read()` асинхронно возвращает два свойства: `value` и логическое `done` Если `done` имеет значение true, последовательный порт был закрыт или данные больше не поступают. Вызов `port.readable.getReader()` создает считыватель и блокирует `readable` к нему для чтения. Пока `readable` [заблокировано](https://streams.spec.whatwg.org/#lock) , последовательный порт не может быть закрыт.

```js
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
```

Некоторые нефатальные ошибки чтения последовательного порта могут возникать при определенных условиях, таких как переполнение буфера, ошибки кадрирования или ошибки четности. `port.readable` добавлением другого цикла поверх предыдущего, который проверяет port.readable. Это работает, потому что, пока ошибки не являются фатальными, автоматически создается [новый ReadableStream.](https://developer.mozilla.org/docs/Web/API/ReadableStream) Если происходит фатальная ошибка, например, при удалении последовательного устройства, `port.readable` становится пустым.

```js/0,3,15-18
while (port.readable) {
  const reader = port.readable.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      if (value) {
        console.log(value);
      }
    }
  } catch (error) {
    // TODO: Handle non-fatal read error.
  }
}
```

Если последовательное устройство отправляет текст обратно, вы можете `port.readable` через `TextDecoderStream` как показано ниже. `TextDecoderStream` - это [поток преобразования,](https://developer.mozilla.org/docs/Web/API/TransformStream) который захватывает все `Uint8Array` и преобразует их в строки.

```js/0-2,12
const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a string.
  console.log(value);
}
```

### Запись в последовательный порт {: #write-port}

Чтобы отправить данные на последовательное устройство, передайте данные в `port.writable.getWriter().write()` . Вызов `releaseLock()` для `port.writable.getWriter()` требуется для закрытия последовательного порта позже.

```js
const writer = port.writable.getWriter();

const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
await writer.write(data);


// Allow the serial port to be closed later.
writer.releaseLock();
```

Отправьте текст на устройство через `TextEncoderStream` конвейеру `port.writable` как показано ниже.

```js
const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

const writer = textEncoder.writable.getWriter();

await writer.write("hello");
```

### Закройте последовательный порт {: #close-port}

`port.close()` закрывает последовательный порт, если его `readable` и `writable` члены [разблокированы](https://streams.spec.whatwg.org/#lock) , что означает, что `releaseLock()` был вызван для их соответствующих читателей и писателей.

```js
await port.close();
```

Однако при непрерывном чтении данных с последовательного устройства с использованием цикла `port.readable` всегда будет заблокирован до тех пор, пока не возникнет ошибка. В этом случае вызов `reader.cancel()` заставит `reader.read()` немедленно разрешиться с помощью `{ value: undefined, done: true }` и, следовательно, позволит циклу вызвать `reader.releaseLock()` .

```js
// Without transform streams.

let keepReading = true;
let reader;

async function readUntilClosed() {
  while (port.readable && keepReading) {
    reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // reader.cancel() has been called.
          break;
        }
        // value is a Uint8Array.
        console.log(value);
      }
    } catch (error) {
      // Handle error...
    } finally {
      // Allow the serial port to be closed later.
      reader.releaseLock();
    }
  }

  await port.close();
}

const closedPromise = readUntilClosed();

document.querySelector('button').addEventListener('click', async () => {
  // User clicked a button to close the serial port.
  keepReading = false;
  // Force reader.read() to resolve immediately and subsequently
  // call reader.releaseLock() in the loop example above.
  reader.cancel();
  await closedPromise;
});
```

[При использовании потоков преобразования](https://developer.mozilla.org/docs/Web/API/TransformStream) (таких как `TextDecoderStream` и `TextEncoderStream` ) закрыть последовательный порт сложнее. Вызовите `reader.cancel()` как раньше. Затем вызовите `writer.close()` и `port.close()` . Это распространяет ошибки через потоки преобразования на базовый последовательный порт. Поскольку распространение ошибки не происходит сразу, вы должны использовать `readableStreamClosed` и `writableStreamClosed` обещания , созданный ранее для обнаружения , когда `port.readable` и `port.writable` разблокированы. Отмена `reader` приводит к прерыванию потока; вот почему вы должны поймать и проигнорировать возникшую ошибку.

```js/20-26
// With transform streams.

const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    reader.releaseLock();
    break;
  }
  // value is a string.
  console.log(value);
}

const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

reader.cancel();
await readableStreamClosed.catch(() => { /* Ignore the error */ });

writer.close();
await writableStreamClosed;

await port.close();
```

### Прослушивание подключения и отключения {: #connection-disconnection}

Если последовательный порт предоставляется устройством USB, это устройство может быть подключено или отключено от системы. Когда веб-сайту было предоставлено разрешение на доступ к последовательному порту, он должен отслеживать события `connect` и `disconnect`

```js
navigator.serial.addEventListener("connect", (event) => {
  // TODO: Automatically open event.target or warn user a port is available.
});

navigator.serial.addEventListener("disconnect", (event) => {
  // TODO: Remove |event.target| from the UI.
  // If the serial port was opened, a stream error would be observed as well.
});
```

{% Aside %} До Chrome 89 события `connect` и `disconnect` `SerialConnectionEvent` настраиваемый объект SerialConnectionEvent с затронутым `SerialPort` доступным в качестве атрибута `port` Вы можете использовать `event.port || event.target` для обработки перехода. {% endAside %}

### Обработка сигналов {: #signals}

После установления соединения через последовательный порт вы можете явно запросить и установить сигналы, предоставляемые последовательным портом, для обнаружения устройства и управления потоком. Эти сигналы определены как логические значения. Например, некоторые устройства, такие как Arduino, войдут в режим программирования, если включен сигнал готовности терминала данных (DTR).

Установка [выходных сигналов](https://wicg.github.io/serial/#serialoutputsignals-dictionary) и получение [входных сигналов](https://wicg.github.io/serial/#serialinputsignals-dictionary) соответственно выполняется путем вызова `port.setSignals()` и `port.getSignals()` . См. Примеры использования ниже.

```js
// Turn off Serial Break signal.
await port.setSignals({ break: false });

// Turn on Data Terminal Ready (DTR) signal.
await port.setSignals({ dataTerminalReady: true });

// Turn off Request To Send (RTS) signal.
await port.setSignals({ requestToSend: false });
```

```js
const signals = await port.getSignals();
console.log(`Clear To Send:       ${signals.clearToSend}`);
console.log(`Data Carrier Detect: ${signals.dataCarrierDetect}`);
console.log(`Data Set Ready:      ${signals.dataSetReady}`);
console.log(`Ring Indicator:      ${signals.ringIndicator}`);
```

### Преобразование потоков {: #transforming-streams}

Когда вы получаете данные с последовательного устройства, вам не обязательно получать все данные сразу. Он может быть произвольно разбит на части. Дополнительные сведения см. В разделе [Концепции Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts) .

Чтобы справиться с этим, вы можете использовать некоторые встроенные потоки преобразования, такие как `TextDecoderStream` или создать свой собственный поток преобразования, который позволяет анализировать входящий поток и возвращать проанализированные данные. Поток преобразования находится между последовательным устройством и циклом чтения, который потребляет поток. Он может применить произвольное преобразование до того, как данные будут использованы. Думайте об этом как о сборочной линии: по мере того, как виджет спускается по конвейеру, каждый шаг в линии изменяет виджет, так что к тому времени, когда он доберется до своего конечного пункта назначения, это полностью функционирующий виджет.

<figure>{% Img src="image/admin/seICV1jfxA6NfFRt9iVL.jpg", alt="Фотография завода по производству самолетов", width="800", height="519"%}<figcaption>Самолетный завод в замке Бромвич времен Второй мировой войны</figcaption></figure>

Например, рассмотрим, как создать класс потока преобразования, который потребляет поток и разбивает его на части на основе разрывов строк. Его `transform()` вызывается каждый раз, когда поток получает новые данные. Он может либо поставить данные в очередь, либо сохранить их на потом. Метод `flush()` вызывается при закрытии потока и обрабатывает все данные, которые еще не были обработаны.

Чтобы использовать класс потока преобразования, вам необходимо пропустить через него входящий поток. В третьем примере кода в разделе « [Чтение из последовательного порта»](#read-port) исходный входной поток передавался только через `TextDecoderStream` , поэтому нам нужно вызвать `pipeThrough()` чтобы передать его через наш новый `LineBreakTransformer` .

```js
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
```

```js/2-5
const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable
  .pipeThrough(new TransformStream(new LineBreakTransformer()))
  .getReader();
```

Для отладки проблем связи с последовательным устройством используйте метод `tee()` для `port.readable` чтобы разделить потоки, идущие к последовательному устройству или от него. Два созданных потока можно использовать независимо друг от друга, что позволяет вывести один на консоль для проверки.

```js
const [appReadable, devReadable] = port.readable.tee();

// You may want to update UI with incoming data from appReadable
// and log incoming data in JS console for inspection from devReadable.
```

## Советы разработчиков {: #dev-tips}

Отладка Web Serial API в Chrome проста с помощью внутренней страницы `about://device-log` где вы можете увидеть все события, связанные с последовательным устройством, в одном месте.

<figure>{% Img src="image/admin/p2T9gxxLsDWsS1GaqoXj.jpg", alt="Снимок экрана внутренней страницы для отладки Web Serial API.", width="800", height="547"%}<figcaption> Внутренняя страница в Chrome для отладки Web Serial API.</figcaption></figure>

## Codelab {: #codelab}

В [кодовой лаборатории Google Developer](https://codelabs.developers.google.com/codelabs/web-serial) вы будете использовать Web Serial API для взаимодействия с [доской BBC micro: bit](https://microbit.org/) для отображения изображений на ее светодиодной матрице 5x5.

## Поддержка браузера {: #browser-support}

Web Serial API доступен на всех настольных платформах (ChromeOS, Linux, macOS и Windows) в Chrome 89.

## Полифилл {: #polyfill}

В Android поддержка последовательных портов на базе USB возможна с помощью WebUSB API и [полифилла Serial API](https://github.com/google/web-serial-polyfill) . Этот полифил ограничен оборудованием и платформами, на которых устройство доступно через API WebUSB, поскольку оно не заявлено встроенным драйвером устройства.

## Безопасность и конфиденциальность {: #security-privacy}

Авторы спецификации разработали и реализовали Web Serial API, используя основные принципы, определенные в разделе « [Управление доступом к мощным функциям веб-платформы»](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md) , включая пользовательский контроль, прозрачность и эргономику. Возможность использования этого API в первую очередь обеспечивается моделью разрешений, которая предоставляет доступ только одному последовательному устройству за раз. В ответ на запрос пользователя пользователь должен предпринять активные действия для выбора конкретного последовательного устройства.

Чтобы понять компромиссы безопасности, ознакомьтесь с [разделами о безопасности](https://wicg.github.io/serial/#security) и [конфиденциальности](https://wicg.github.io/serial/#privacy) в объяснении Web Serial API Explainer.

## Отзыв {: #feedback}

Команда Chrome хотела бы услышать о ваших мыслях и опыте работы с Web Serial API.

### Расскажите о дизайне API

Есть ли в API что-то, что не работает должным образом? Или отсутствуют методы или свойства, необходимые для реализации вашей идеи?

Отправьте вопрос спецификации в [репозиторий GitHub Web Serial API](https://github.com/wicg/serial/issues) или добавьте свои мысли к существующей проблеме.

### Сообщить о проблеме с реализацией

Вы нашли ошибку в реализации Chrome? Или реализация отличается от спецификации?

Сообщите об ошибке на [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESerial) . Обязательно укажите как можно больше подробностей, предоставьте простые инструкции по воспроизведению ошибки и установите для *Компонентов* `Blink>Serial` . [Glitch](https://glitch.com) отлично подходит для быстрого и легкого обмена репродукциями.

### Показать поддержку

Планируете ли вы использовать Web Serial API? Ваша общедоступная поддержка помогает команде Chrome определять приоритеты функций и показывает другим поставщикам браузеров, насколько важна их поддержка.

Отправьте твит на [@ChromiumDev](https://twitter.com/chromiumdev), используя хэштег [`#WebShare`](https://twitter.com/search?q=%23SerialAPI&src=typed_query&f=live), и сообщите нам, где и как вы его используете.

## Полезные ссылки {: #helpful}

- [Технические характеристики](https://github.com/WICG/serial)
- [Отслеживание ошибок](https://crbug.com/884928)
- [Запись на ChromeStatus.com](https://chromestatus.com/feature/6577673212002304)
- Компонент мигания: [`Blink>Serial`](https://chromestatus.com/features#component%3ABlink%3ESerial)

## Демо {: #demos}

- [Последовательный терминал](https://googlechromelabs.github.io/serial-terminal/)
- [Espruino Web IDE](https://www.espruino.com/ide/)

## Благодарности

Спасибо [Рейли Гранту](https://twitter.com/reillyeon) и [Джо Медли](https://github.com/jpmedley) за рецензии на эту статью. Фотография завода самолетов [Бирмингемского](https://unsplash.com/@birminghammuseumstrust) [музейного](https://unsplash.com/photos/E1PSU-7aWcY) фонда на Unsplash.
