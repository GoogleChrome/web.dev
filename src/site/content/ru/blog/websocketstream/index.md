---
title: |2-

  WebSocketStream: интеграция потоков с WebSocket API
subhead: |2-

  Как с помощью обратной реакции не дать приложению утонуть в сообщениях WebSocket

  и не переполнить данными сервер WebSocket.
authors:
  - thomassteiner
date: 2020-03-27
updated: 2021-02-23
hero: image/admin/8SrIq5at2bH6i98stCgs.jpg
alt: Пожарный шланг, из которого вытекает вода
description: |2-

  WebSocketStream позволяет использовать потоки с WebSocket API,

  благодаря чему приложение может применять обратную реакцию к полученным сообщениям.
tags:
  - blog
  - capabilities
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745"
feedback:
  - api
---

## Общая информация

### WebSocket API

[WebSocket API](https://developer.mozilla.org/docs/Web/API/WebSockets_API) предоставляет интерфейс JavaScript для [протокола WebSocket](https://tools.ietf.org/html/rfc6455), что позволяет открывать сеанс двусторонней интерактивной передачи данных между браузером пользователя и сервером. Используя этот API, можно отправлять сообщения на сервер и получать ответы на основе событий, не опрашивая сервер.

### Streams API

[Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API) позволяет JavaScript программно получать доступ к потокам фрагментов данных, полученных по сети, и обрабатывать их. Важным понятием в контексте потоков является [обратная реакция](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#Backpressure) — процесс, посредством которого отдельный поток или цепочка перенаправления регулирует скорость чтения или записи. Когда исходный поток или поток далее в цепочке перенаправления еще занят и не готов принимать следующие фрагменты, он отправляет обратно по цепочке сигнал о необходимости замедлить доставку данных.

### Проблема с текущим WebSocket API

#### Невозможность применять обратную реакцию к полученным сообщениям

В текущем WebSocket API реакция на сообщение происходит в [`WebSocket.onmessage`](https://developer.mozilla.org/docs/Web/API/WebSocket/onmessage) — обработчике `EventHandler`, который вызывается при получении сообщения от сервера.

Предположим, у нас есть приложение, которое с каждым полученным сообщением должно выполнять ресурсоемкую обработку данных. Соответствующий код наверняка будет похож на приведенный ниже. В нем мы ожидаем (`await`) результат вызова `process()`, поэтому всё должно работать, верно?

```js
// Ресурсоемкая обработка данных.
const process = async (data) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      console.log('Сообщение WebSocket обработано:', data);
      return resolve('done');
    }, 1000);
  });
};

webSocket.onmessage = async (event) => {
  const data = event.data;
  // Ждем результат этапа обработки в обработчике сообщений.
  await process(data);
};
```

Неверно! Проблема с текущим WebSocket API в том, что мы не можем использовать обратную реакцию. Если сообщения приходят быстрее, чем их может обработать метод `process()`, процесс отрисовки либо забьет память, буферизируя эти сообщения, либо перестанет отвечать из-за 100 % загрузки ЦП (или произойдет и то, и другое).

#### Применять обратную реакцию к отправляемым сообщениям — неудобно

Применять обратную реакцию к отправляемым сообщениям можно, но для этого нужно запрашивать свойство [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount), что неэффективно и неудобно. Это доступное только для чтения свойство возвращает количество байтов данных, помещенных в очередь посредством вызовов [`WebSocket.send()`](https://developer.mozilla.org/docs/Web/API/WebSocket/send), но еще не переданных в сеть. Значение сбрасывается на ноль после отправки всех данных в очереди, но если продолжить вызывать `WebSocket.send()`, оно будет повышаться.

## Что представляет собой WebSocketStream API {: #what }

WebSocketStream API решает проблему отсутствия надлежащей обратной реакции путем интеграции потоков с WebSocket API. То есть, обратную реакцию можно применять «бесплатно» — без дополнительных ресурсозатрат.

### Предлагаемые варианты использования для WebSocketStream API {: #use-cases }

Примеры сайтов, которые могут использовать этот API:

- Приложения WebSocket с высокой сетевой нагрузкой, которые должны оставаться интерактивными, в частности — решения для трансляции видео и демонстрации экрана.
- Средства для видеозахвата и другие приложения, генерирующие в браузере большие объемы данных, который необходимо загрузить на сервер. Используя обратную реакцию, клиент может остановить производство данных и не накапливать их в памяти.

## Текущее состояние {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Этап</th>
<th data-md-type="table_cell">Состояние</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Написание пояснения</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Создание первоначального проекта спецификации</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">Выполняется</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Сбор отзывов и доработка проекта</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Выполняется</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Испытание в Origin</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745" data-md-type="link">Готово</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Запуск</td>
<td data-md-type="table_cell">Не запущено</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Как использовать WebSocketStream API {: #use }

### Вводный пример

WebSocketStream API работает на промисах, и поэтому естественным образом встраивается в современный мир JavaScript. Для начала мы создаем новый объект `WebSocketStream` передаем ему URL-адрес сервера WebSocket. Затем ждем , пока установится подключение (`connection`). В результате мы получаем [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) и (или) [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream).

Вызывая метод [`ReadableStream.getReader()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader), мы в итоге получаем [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader), с помощью которого можно читать ([`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read)) данные из потока до его завершения, то есть пока поток не вернет объект в форме `{value: undefined, done: true}`.

Аналогичным образом, вызывая метод [`WritableStream.getWriter()`](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter), мы в итоге получаем [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter), с помощью которого можно записывать ([`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write)) данные.

```js
  const wss = new WebSocketStream(WSS_URL);
  const {readable, writable} = await wss.connection;
  const reader = readable.getReader();
  const writer = writable.getWriter();

  while (true) {
    const {value, done} = await reader.read();
    if (done) {
      break;
    }
    const result = await process(value);
    await writer.write(result);
  }
```

#### Обратная реакция

А что насчет обещанной функции обратной реакции? Как я писал выше, она дается «бесплатно» — ничего дополнительно делать не нужно: если для `process()` требуется больше времени, следующее сообщение будет потреблено, только когда конвейер будет готов. Соответственно, и действие `WritableStreamDefaultWriter.write()` будет выполняться только в том случае, когда это допустимо.

### Более сложные примеры

Второй аргумент в WebSocketStream — это набор параметров, число которых может быть увеличено в будущем. Пока что есть только параметр `protocols`, который ведет себя так же, как [второй аргумент в конструкторе WebSocket](https://developer.mozilla.org/docs/Web/API/WebSocket/WebSocket#Parameters:~:text=respond.-,protocols):

```js
const chatWSS = new WebSocketStream(CHAT_URL, {protocols: ['chat', 'chatv2']});
const {protocol} = await chatWSS.connection;
```

Выбранный протокол (`protocol`) и возможные расширения (`extensions`) входят в словарь, доступный по промису `WebSocketStream.connection`. В этом промисе содержится вся информация о действующем подключении (если связь не установлена, эти данные неактуальны).

```js
const {readable, writable, protocol, extensions} = await chatWSS.connection;
```

### Информация о закрытом подключении WebSocketStream

Информацию, которая была доступна в событиях [`WebSocket.onclose`](https://developer.mozilla.org/docs/Web/API/WebSocket/onclose) и [`WebSocket.onerror`](https://developer.mozilla.org/docs/Web/API/WebSocket/onerror) в WebSocket API, теперь можно получить через промис `WebSocketStream.closed`. Если подключение закрыто ненадлежащим образом, промис отклоняется. В противном случае он разрешается с кодом и причиной, полученными от сервера.

Все возможные коды состояния и их значение объяснены в [списке для `CloseEvent`](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes).

```js
const {code, reason} = await chatWSS.closed;
```

### Закрытие подключения WebSocketStream

Закрыть WebSocketStream можно с помощью [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController): достаточно передать [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) в конструктор `WebSocketStream`.

```js
const controller = new AbortController();
const wss = new WebSocketStream(URL, {signal: controller.signal});
setTimeout(() => controller.abort(), 1000);
```

Также можно использовать метод `WebSocketStream.close()`, но его основное предназначение — указание [кода](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes) и причины, которые отправляются на сервер.

```js
wss.close({code: 4000, reason: 'Игра закончена'});
```

### Прогрессивное улучшение и совместимость

Пока что WebSocketStream API реализован только в браузере Chrome. Для совместимости с классическим WebSocket API применение обратной реакции к полученным сообщениям невозможно. Применять обратную реакцию к отправляемым сообщениям можно, но для этого нужно запрашивать свойство [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount), что неэффективно и неудобно.

#### Обнаружение функции

Как проверить, поддерживается ли WebSocketStream API:

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` поддерживается!
}
```

## Демонстрация

Увидеть работу WebSocketStream API (если поддержка в браузере реализована) можно во встроенном iframe здесь или [на странице Glitch](https://websocketstream-demo.glitch.me/).

{% Glitch { id: 'websocketstream-demo', path: 'public/index.html' } %}

## Отзывы {: #feedback }

Команде Chrome хотелось бы услышать ваши отзывы о работе с WebSocketStream API.

### Расскажите, что вы думаете о структуре API

Что-то в API не работает должным образом? Или, может, отсутствуют методы или свойства, необходимые для реализации вашей идеи? Есть вопрос или комментарий по модели безопасности? Отправьте заявку о проблеме со спецификацией (Spec issue) в [GitHub-репозиторий](https://github.com/ricea/websocketstream-explainer/issues) или прокомментируйте существующую.

### Сообщите о проблеме с реализацией

Нашли ошибку в реализации функции в браузере Chrome? Реализация отличается от спецификации? Сообщите об ошибке на странице [new.crbug.com](https://new.crbug.com). Опишите проблему как можно подробнее, дайте простые инструкции по ее воспроизведению и в поле <strong>Components</strong> укажите <code>Blink&gt;Network&gt;WebSockets</code>. Для демонстрации этапов воспроизведения ошибки удобно использовать [Glitch](https://glitch.com/).

### Окажите поддержку API

Планируете использовать WebSocketStream API? Ваш публичный интерес помогает команде Chrome определять приоритет функций и показывает важность их поддержки разработчикам других браузеров.

Упомяните в твите [@ChromiumDev](https://twitter.com/ChromiumDev), поставьте хештег [`#WebSocketStream`](https://twitter.com/search?q=%23WebSocketStream&src=typed_query&f=live) и расскажите, как вы используете эту функцию.

## Полезные ссылки {: #helpful }

- [Публичное пояснение](https://github.com/ricea/websocketstream-explainer/blob/master/README.md).
- [Демонстрация WebSocketStream API](https://websocketstream-demo.glitch.me/). | [Исходный код демопримера WebSocketStream API](https://glitch.com/edit/#!/websocketstream-demo).
- [Отслеживание ошибок](https://bugs.chromium.org/p/chromium/issues/detail?id=983030).
- [Запись на ChromeStatus.com](https://chromestatus.com/feature/5189728691290112).
- Компонент Blink: [`Blink>Network>WebSockets`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets).

## Благодарности

Авторы реализации WebSocketStream API — [Адам Райс](https://github.com/ricea) и [Ютака Хирано](https://github.com/yutakahirano). Автор главного изображения — [Даан Муйдж](https://unsplash.com/@daanmooij), платформа [Unsplash](https://unsplash.com/photos/91LGCVN5SAI).
