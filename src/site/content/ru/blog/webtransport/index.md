---
title: Экспериментируем с WebTransport
subhead: WebTransport — это новый API, предлагающий двунаправленный обмен сообщениями между клиентом и сервером с малой задержкой. Узнайте больше о вариантах его использования и о том, как оставить отзыв для будущей реализации.
authors:
  - jeffposnick
description: WebTransport — это новый API, предлагающий двунаправленный обмен сообщениями между клиентом и сервером с малой задержкой. Узнайте больше о вариантах его использования и о том, как оставить отзыв для будущей реализации.
date: 2020-06-08
updated: 2021-09-29
hero: image/admin/Wh6q6ughWxUYcu4iOutU.jpg
hero_position: center
alt: |2

  Фотография быстро движущегося транспорта.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/793759434324049921"
tags:
  - blog
  - capabilities
  - network
feedback:
  - api
---

{% Aside 'caution' %} Это предложение продолжает меняться в течение периода испытаний по схеме Origin. Возможны расхождения между реализацией в браузере и информацией в этой статье.

Чтобы узнать последнюю информацию об этом развивающемся предложении, прочтите [редакционный черновик WebTransport](https://w3c.github.io/webtransport/).

Как только предложение стабилизируется, мы обновим эту статью и связанные с ней образцы кода, добавив самую свежую информацию. {% endAside %}

## Общая информация

### Что такое WebTransport?

[WebTransport](https://w3c.github.io/webtransport/) — это веб-API, использующий [протокол HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) в качестве двунаправленной коммуникации. Он предназначен для двусторонней связи между веб-клиентом и сервером HTTP/3. Этот интерфейс поддерживает отправку данных как ненадежно через [API-интерфейсы датаграмм](#datagram), так и надежно через [API-интерфейсы потоков](#stream).

[Датаграммы](https://tools.ietf.org/html/draft-ietf-quic-datagram-00) идеально подходят для отправки и получения данных, для которых не требуются строгие гарантии доставки. Отдельные пакеты данных ограничены по размеру [максимальной единицей передачи (MTU)](https://en.wikipedia.org/wiki/Maximum_transmission_unit) нижележащего соединения. Их передача может быть успешной или неудачной, а в случае успеха пакеты могут прибыть в произвольном порядке. Благодаря этим характеристикам API-интерфейсы датаграмм отлично подходят для передачи данных с максимально доступным качеством и минимальными задержками. Датаграммы можно рассматривать как сообщения [протокола пользовательских датаграмм (UDP)](https://en.wikipedia.org/wiki/User_Datagram_Protocol), но зашифрованные и адаптируемые к перегрузкам.

API-интерфейсы потоков, напротив, обеспечивают [надежную](https://en.wikipedia.org/wiki/Reliability_(computer_networking)) упорядоченную передачу данных. Они [хорошо подходят](https://quicwg.org/base-drafts/draft-ietf-quic-transport.html#name-streams) для сценариев, когда вам нужно отправить или получить один или несколько потоков упорядоченных данных. Использование нескольких потоков WebTransport аналогично установлению нескольких [TCP-соединений](https://en.wikipedia.org/wiki/Transmission_Control_Protocol), но поскольку HTTP/3 использует за кадром более легкий протокол [QUIC](https://www.chromium.org/quic), их можно открывать и закрывать без особых затрат.

### Сценарии использования

Вот небольшой список возможных способов использования WebTransport разработчиками.

- Отправка данных о состоянии игры через регулярные интервалы с минимальной задержкой на сервер с помощью небольших ненадежных неупорядоченных сообщений.
- Получение потоков мультимедиа, отправленных с сервера, с минимальной задержкой и независимо от других потоков данных.
- Получение уведомлений, отправленных с сервера, когда веб-страница открыта.

В рамках процесса испытаний по схеме Origin Trial мы хотели бы [узнать больше](#feedback) о том, как вы планируете использовать WebTransport.

{% Aside %} Со многими концепциями из этого предложения ранее проводились эксперименты в рамках испытаний по схеме Origin Trial более ранней версии QuicTransport, которая не была выпущена как часть Chrome.

WebTransport помогает в тех же сценариях использования, что и QuicTransport, с основным отличием в том, что основным транспортным протоколом является [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html), а не [QUIC](https://www.chromium.org/quic). {% endAside %}

## Текущее состояние {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Этап</th>
<th data-md-type="table_cell">Состояние</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Создание пояснений</td>
<td data-md-type="table_cell"><a href="https://github.com/w3c/webtransport/blob/main/explainer.md" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Создание черновика спецификации</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/webtransport/" data-md-type="link">Завершен</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. Сбор отзывов и доработка проекта</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis"><a>Выполняется</a></strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">4. Испытания по схеме Origin Trial</strong></td>
<td data-md-type="table_cell"><a href="#register-for-ot" data-md-type="link"><strong data-md-type="double_emphasis"><a>Выполняется</a></strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Запуск</td>
<td data-md-type="table_cell">Не начато</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Связь WebTransport с другими технологиями

### Является ли WebTransport заменой WebSockets?

Возможно. Существуют сценарии использования, когда допустимыми протоколами связи могут быть [WebSockets](https://developer.mozilla.org/docs/Web/API/WebSockets_API) или WebTransport.

Связь WebSockets моделируется на основе единого надежного упорядоченного потока сообщений, что подходит для некоторых типов коммуникационных потребностей. Если вам нужны эти характеристики, их также могут предоставить API-интерфейсы потоков WebTransport. Для сравнения, API-интерфейсы датаграмм WebTransport обеспечивают доставку с малой задержкой, без гарантий надежности или порядка, поэтому они не являются прямой заменой WebSockets.

Используя WebTransport через API датаграмм или через несколько параллельных экземпляров API потоков, вы можете не беспокоиться о проблеме [блокировки заголовка](https://en.wikipedia.org/wiki/Head-of-line_blocking), которая может возникать при использовании WebSockets. Кроме того, есть преимущества в производительности при установлении новых соединений, поскольку базовое [квитирование QUIC](https://www.fastly.com/blog/quic-handshake-tls-compression-certificates-extension-study) выполняется быстрее, чем запуск TCP через TLS.

WebTransport является частью новой черновой спецификации, и поэтому экосистема WebSocket вокруг клиентских и серверных библиотек в настоящее время намного более надежна. Если вам нужно готовое решение с общими настройками сервера и широкой поддержкой веб-клиентов, на данный момент лучшим выбором будет WebSockets.

### WebTransport — это то же самое, что и UDP Socket API?

Нет. WebTransport не является [UDP Socket API](https://www.w3.org/TR/raw-sockets/). В то время как WebTransport использует HTTP/3, который, в свою очередь, за кадром использует UDP, у WebTransport есть требования к шифрованию и контролю перегрузки, которые выводят его за рамки простого API-интерфейса UDP Socket.

### Является ли WebTransport альтернативой каналам данных WebRTC?

Да, для клиент-серверных соединений. WebTransport имеет многие из тех же свойств, что и [каналы данных WebRTC](https://developer.mozilla.org/docs/Web/API/RTCDataChannel), хотя лежащие в основе протоколы отличаются.

{% Aside %} Каналы данных WebRTC поддерживают одноранговую связь, но WebTransport поддерживает только соединение клиент-сервер. Для нескольких клиентов, которым необходимо напрямую общаться друг с другом, WebTransport не будет жизнеспособной альтернативой. {% endAside %}

Как правило, для запуска HTTP/3-совместимого сервера требуется меньше настроек, чем для обслуживания сервера WebRTC, что предполагает понимание нескольких протоколов ([ICE](https://developer.mozilla.org/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates), [DTLS](https://webrtc-security.github.io/#4.3.1.) и [SCTP](https://developer.mozilla.org/docs/Web/API/RTCSctpTransport)) для получения рабочего транспорта. WebRTC включает в себя гораздо больше движущихся частей, которые могут привести к неудачным переговорам между клиентом и сервером.

API WebTransport был разработан с учетом вариантов использования веб-разработчиками, так что работа с ним должна больше походить на написание кода современной веб-платформы, чем на использование интерфейсов каналов данных WebRTC. [В отличие от WebRTC](https://bugs.chromium.org/p/chromium/issues/detail?id=302019), WebTransport поддерживается внутри [веб-воркеров](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers), что позволяет вам выполнять обмен данными между клиентом и сервером независимо от данной HTML-страницы. Поскольку WebTransport предоставляет [интерфейс, совместимый с потоками](https://streams.spec.whatwg.org/), он поддерживает оптимизацию [контроля обратного потока](https://streams.spec.whatwg.org/#backpressure).

Однако, если у вас уже есть работающая конфигурация WebRTC клиент/сервер, которая вас устраивает, переход на WebTransport может не дать особых преимуществ.

## Попробуйте сами

Лучший способ поэкспериментировать с WebTransport — запустить совместимый сервер HTTP/3 локально. (К сожалению, публичный эталонный сервер, совместимый с последней спецификацией, в настоящее время недоступен.) Затем вы можете использовать эту страницу с [базовым клиентом JavaScript](https://googlechrome.github.io/samples/webtransport/client.html), чтобы опробовать связь клиент/сервер.

## Использование API

WebTransport был разработан на основе примитивов современных веб-платформ, таких как [Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API). Он в значительной степени полагается на [обещания](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises) и хорошо работает с [<code>async</code> и <code>await</code>](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Async_await).

[Испытания по схеме Origin Trial](#register-for-ot) WebTransport поддерживают три различных типа трафика: датаграммы, однонаправленные и двунаправленные потоки.

### Подключение к серверу

Вы можете подключиться к серверу HTTP/3, создав экземпляр `WebTransport`. Схема URL должна быть `https`. Номер порта нужно указать явно.

Вы должны использовать обещание `ready`, чтобы дождаться установления соединения. Это обещание не будет выполнено до завершения настройки и будет отклонено, если соединение не будет установлено на этапе QUIC/TLS.

Обещание `closed` выполняется, когда соединение закрывается нормально, и отклоняется, если закрытие было неожиданным.

Если сервер отклоняет соединение из-за ошибки [индикации клиента](https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2) (например, путь URL-адреса недействителен), то это приводит к отклонению `closed`, а обещание `ready` остается неразрешенным.

```js
const url = 'https://example.com:4999/foo/bar';
const transport = new WebTransport(url);

// По желанию, настраиваем функции для ответа
// на закрытие соединения:
transport.closed.then(() => {
  console.log(`Соединение HTTP/3 с ${url} закрыто должным образом.`);
}).catch((error) => {
  console.error('Соединение HTTP/3 с ${url} закрыто из-за ошибки: ${error}.');
});

// Когда .ready выполнится, соединение можно использовать.
await transport.ready;
```

### API датаграмм {: #datagram }

Если у вас есть экземпляр WebTransport, подключенный к серверу, вы можете использовать его для отправки и получения дискретных битов данных, известных как [датаграммы](https://en.wikipedia.org/wiki/Datagram).

Получатель `writeable` возвращает <code>[WritableStream](https://developer.mozilla.org/docs/Web/API/WritableStream)</code>, который веб-клиент может использовать для отправки данных на сервер. Получатель <code>readable</code> возвращает <code>[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)</code>, позволяя вам прослушивать данные с сервера. Оба потока по своей природе ненадежны, поэтому возможно, что данные, которые вы записываете, не будут получены сервером, и наоборот.

Оба типа потоков используют экземпляры <code>[Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)</code> для передачи данных.

```js
// Посылаем на сервер две датаграммы.
const writer = transport.datagrams.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);

// Считываем датаграммы с сервера.
const reader = transport.datagrams.readable.getReader();
while (true) {
  const {value, done} = await reader.read();
  if (done) {
    break;
  }
  // Значение представляет собой Uint8Array.
  console.log(value);
}
```

{% Aside %} Chrome в [настоящее время](https://bugs.chromium.org/p/chromium/issues/detail?id=929585) не предоставляет [асинхронный итератор](https://github.com/whatwg/streams/issues/778) для `ReadableStream`. На данный момент лучшим способом чтения из потока является использование `getReader()` сочетании с `while()`. {% endAside %}

### API потоков {: #stream }

После подключения к серверу вы также можете использовать WebTransport для отправки и получения данных через его API потоков.

Каждый фрагмент всех потоков — это массив `Uint8Array`. В отличие от API датаграмм, эти потоки надежны. Но каждый поток независим, поэтому порядок данных в потоках не гарантируется.

#### SendStream

<code>[SendStream](https://wicg.github.io/web-transport/#sendstream)</code> создается веб-клиентом с помощью метода <code>createSendStream()</code> экземпляра `WebTransport`, который возвращает обещание для <code>SendStream</code>.

Используйте метод <code>[close()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/close)</code>, принадлежащий <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code>, чтобы закрыть связанное соединение HTTP/3. Браузер пытается отправить все ожидающие данные, прежде чем фактически закрыть связанное соединение.

```js
// Посылаем два массива Uint8Array на сервер.
const stream = await transport.createSendStream();
const writer = stream.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);
try {
  await writer.close();
  console.log('Все данные отправлены.');
} catch (error) {
  console.error(`Произошла ошибка: ${error}`);
}
```

Точно так же используйте метод <code>[abort()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/abort)</code>, принадлежащий <code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code>, для отправки [QUIC RESET_STREAM](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4) на сервер. При использовании <code>abort()</code> браузер может отбросить все ожидающие данные, которые еще не были отправлены.

```js
const ws = await transport.createSendStream();
const writer = ws.getWriter();
writer.write(...);
writer.write(...);
await writer.abort();
// Возможно, были записаны не все данные.
```

#### ReceiveStream

<code>[ReceiveStream](https://wicg.github.io/web-transport/#receivestream)</code> инициируется сервером. Получение <code>ReceiveStream</code> — двухэтапный процесс для веб-клиента. Сначала он вызывает метод <code>receiveStreams()</code> экземпляра `WebTransport`, который возвращает <code>ReadableStream</code>. Каждый фрагмент этого <code>ReadableStream</code>, в свою очередь, является <code>ReceiveStream</code>, который можно использовать для чтения экземпляров <code>Uint8Array</code>, отправленных сервером.

```js
async function readFrom(receiveStream) {
  const reader = receiveStream.readable.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    // Значение представляет собой Uint8Array
    console.log(value);
  }
}

const rs = transport.receiveStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // Значение представляет собой ReceiveStream
  await readFrom(value);
}
```

Вы можете обнаружить закрытие потока, используя обещание <code>[closed](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/closed)</code>, принадлежащее <code>[ReadableStreamDefaultReader](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)</code>. Когда базовое соединение HTTP/3 [закрывается битом FIN](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.8), обещание <code>closed</code> выполняется после чтения всех данных. Когда соединение HTTP/3 внезапно закрывается (например, с помощью <code>[STREAM_RESET](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)</code>), обещание <code>closed</code> отклоняется.

```js
// Предполагаем активный receiveStream
const reader = receiveStream.readable.getReader();
reader.closed.then(() => {
  console.log('receiveStream закрыт должным образом.');
}).catch(() => {
  console.error('receiveStream закрыт неожиданно.');
});
```

#### BidirectionalStream

<code>[BidirectionalStream](https://wicg.github.io/web-transport/#bidirectional-stream)</code> может быть создан сервером или клиентом.

Веб-клиенты могут создать его, используя метод `createBidirectionalStream()` экземпляра `WebTransport`, который возвращает обещание для `BidirectionalStream`.

```js
const stream = await transport.createBidirectionalStream();
// stream представляет собой BidirectionalStream
// stream.readable представляет собой ReadableStream
// stream.writable представляет собой WritableStream
```

Вы можете прослушивать `BidirectionalStream`, созданный сервером, с помощью метода `receiveBidirectionalStreams()` экземпляра `WebTransport`, который возвращает `ReadableStream`. Каждый фрагмент этого `ReadableStream`, в свою очередь, является `BidirectionalStream`.

```js
const rs = transport.receiveBidrectionalStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // value представляет собой BidirectionalStream
  // value.readable представляет собой ReadableStream
  // value.writable представляет собой WritableStream
}
```

`BidirectionalStream` — это просто комбинация `SendStream` и `ReceiveStream`. В примерах из двух предыдущих разделов поясняется, как использовать их использовать.

### Дополнительные примеры

[Черновик спецификации WebTransport](https://wicg.github.io/web-transport/) включает ряд дополнительных встроенных примеров, а также полную документацию по всем методам и свойствам.

## Включение поддержки во время испытаний по схеме Origin Trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### WebTransport в Chrome DevTools

К сожалению, поддержка [Chrome DevTools](https://developer.chrome.com/docs/devtools/) для WebTransport к моменту запуска испытаний по схеме Origin Trial не готова. Вы можете пометить [эту проблему в Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=1152290), чтобы получать уведомления об обновлениях интерфейса DevTools.

## Вопросы конфиденциальности и безопасности

См. [соответствующий раздел](https://wicg.github.io/web-transport/#privacy-security) проекта спецификации для получения авторитетных указаний.

## Отзывы {: #feedback }

Команда Chrome хочет узнать ваши мнения и впечатления от использования этого API на протяжении всего периода испытаний.

### Отзывы о структуре API

Есть ли в API что-то неудобное или работающее не так, как вы ожидали? Может быть, отсутствуют какие-то элементы, необходимые для реализации вашей идеи?

Отправьте сообщение о проблеме в [репозиторий GitHub для Web Transport](https://github.com/WICG/web-transport/issues) или добавьте свой комментарий к существующей теме.

### Проблема с реализацией?

Вы нашли ошибку в реализации Chrome?

Сообщите об ошибке на [https://new.crbug.com](https://new.crbug.com). Укажите как можно больше подробностей и простые инструкции по воспроизведению.

### Планируете использовать этот API?

Ваша публичная поддержка помогает команде Chrome определять приоритет функций и показывает важность их поддержки разработчикам других браузеров.

- Обязательно подпишитесь на [отчет о ходе испытаний Origin Trial](https://developer.chrome.com/origintrials/#/view_trial/793759434324049921), указав свой домен и контактную информацию. Так вы покажете, что заинтересованы в этом интерфейсе.
- Упомяните в твите [@ChromiumDev](https://twitter.com/chromiumdev), поставьте хэштег [`#WebTransport`](https://twitter.com/search?q=%23WebTransport&src=typed_query&f=live) и подробно расскажите, где и как вы используете этот API.

### Обсуждение

Вы можете использовать [группу Google web-transport-dev](https://groups.google.com/a/chromium.org/g/web-transport-dev) для решения общих вопросов или проблем, которые не попадают ни в одну из других категорий.

## Благодарности

Эта статья включает информацию из [пояснительного документа WebTransport](https://github.com/w3c/webtransport/blob/main/explainer.md), [черновой спецификации](https://wicg.github.io/web-transport/) и [связанных проектных документов](https://docs.google.com/document/d/1UgviRBnZkMUq4OKcsAJvIQFX6UCXeCbOtX_wMgwD_es/edit#). Благодарим их авторов за предоставленные основы.

*Баннер для этой статьи взят у [Робина Пьера](https://unsplash.com/photos/dPgPoiUIiXk) на Unsplash.*
