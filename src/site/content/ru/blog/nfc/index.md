---
title: Взаимодействие с устройствами NFC в Chrome для Android
subhead: Chrome для Android теперь может читать и записывать NFC-метки.
authors:
  - beaufortfrancois
date: 2020-02-12
updated: 2021-02-23
hero: image/admin/TqG3qb5MiLGNTnAgKtqO.jpg
thumbnail: image/admin/8tWkeYbKLxSd2YgTUSGv.jpg
alt: Фото NFC-меток
description: |
  В Chrome для Android теперь можно читать и записывать NFC-метки.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webnfc
---

{% Aside 'success' %}
Интерфейс Web NFC, часть [проекта по расширению возможностей](https://developer.chrome.com/blog/fugu-status/),
реализован в Chrome 89 для Android.
{% endAside %}

## Что такое Web NFC? {: #what }

NFC (Near Field Communications) — это технология беспроводной связи ближнего действия
на частоте 13,56 МГц, которая обеспечивает передачу данных между устройствами
на расстоянии до 10 см со скоростью до 424 кбит/с.

Web NFC дает сайтам возможность читать и записывать NFC-метки, находящиеся
в непосредственной близости от устройства пользователя (обычно это 5-10 см).
Пока что работает только NDEF (NFC Data Exchange Format) — упрощенный формат
обмена двоичными сообщениями для меток различных форматов.

<figure>
  {% Img src="image/admin/jWmCabXZCB6zNwQIR90I.png", alt="Телефон обеспечивает питание NFC-метки для обмена данными", width="800", height="489" %}
  <figcaption>Схема работы NFC</figcaption>
</figure>

## Предлагаемые варианты использования {: #use-cases }

В Web NFC используется только NDEF, поскольку свойства системы безопасности
для чтения и записи данных NDEF легче измерить количественно. Низкоуровневые операции ввода-вывода
(например, ISO-DEP, NFC-A/B, NFC-F), режим одноранговой связи и эмуляция карт
на устройстве пользователя (HCE) не поддерживаются.

Примеры сайтов, которые могут использовать Web NFC:
- Музеи и художественные галереи: отображение дополнительных сведений
   об экспонате, когда пользователь касается его NFC-карты телефоном.
- Сайты инвентарного учета: чтение и запись данных в NFC-метку
   на контейнере для обновления сведений о его содержимом.
- Сайты конференций: сканирование NFC-бейджиков на мероприятии.
- Эту функцию можно использовать для обмена исходными секретными ключами,
   необходимыми для подготовки устройств или сервисов, а также для развертывания
   данных конфигурации в рабочем режиме.

<figure>
  {% Img src="image/admin/zTEXhIx9nDWtbKrIPN0x.png", alt="Телефон сканирует несколько NFC-меток", width="800", height="383" %}
  <figcaption>Иллюстрация инвентарного учета с помощью NFC</figcaption>
</figure>

## Текущее состояние {: #status }

<div class="table-wrapper scrollbar">

| Этап | Состояние |
| ------------------------------------------ | ---------------------------- |
| 1. Написать пояснение | [Готово][explainer] |
| 2. Создать исходный проект спецификации | [Готово][spec] |
| 3. Собрать отзывы и уточнить дизайн | [Готово](#feedback) |
| 4. Испытание в Origin | [Готово][ot] |
| **5. Запуск** | **Готово** |

</div>

## Использование Web NFC {: #use }

### Обнаружение функции {: #feature-detection }

Обнаружение функций для оборудования отличается от привычного.
Наличие `NDEFReader` сообщает, что браузер поддерживает Web NFC, но не говорит
о наличии необходимого оборудования. В частности, если оборудования нет,
то промис от определенных вызовов будет отклонен. Подробнее —
ниже, в описании `NDEFReader`.

```js
if ('NDEFReader' in window) { /* Сканирование и запись NFC-меток */ }
```

### Терминология {: #terminology }

NFC-метка — это пассивное NFC-устройство: оно получает питание от магнитной
индукции, когда поблизости находится активное устройство (например, телефон). NFC-метки бывают разных форм и видов: наклейки, пластиковые карты,
браслеты и т. д.

<figure>
  {% Img src="image/admin/uUBxSkSc3MJBG8Lw52fV.jpg", alt="Фото прозрачной NFC-метки", width="800", height="450" %}
  <figcaption>Прозрачная NFC-метка</figcaption>
</figure>

Объект `NDEFReader` — это точка входа в Web NFC, которая предоставляет
функции для подготовки действий чтения и (или) записи, выполняемых при появлении
NDEF-метки поблизости. Аббревиатура `NDEF` в `NDEFReader` означает NFC Data Exchange
Format — упрощенный формат обмена двоичным сообщениями по стандарту [NFC Forum].

Объект `NDEFReader` предназначен для действий с сообщениями NDEF от NFC-меток
и для записи сообщений NDEF в NFC-метки в радиусе действия.

NFC-метка с поддержкой NDEF напоминает записку: кто угодно может ее прочитать,
а также записать (если запись разрешена). В ней содержится одно сообщение NDEF,
в котором находится одна или несколько NDEF-записей. Каждая NDEF-запись —
это двоичная структура с полезными данными и сведениями о соответствующем типе.
Web NFC поддерживает следующие типы записей стандарта NFC Forum: пустая, текст,
URL-адрес, смарт-плакат, MIME-тип, абсолютный URL-адрес, внешний тип, неизвестный
и локальный тип.

<figure>
  {% Img src="image/admin/50clBWSJbKkyumsxrioB.png", alt="Схема NDEF-сообщения", width="800", height="243" %}
  <figcaption>Схема NDEF-сообщения</figcaption>
</figure>

### Сканирование NFC-меток {: #scan }

Чтобы сканировать NFC-метки, создайте экземпляр объекта `NDEFReader`. Вызов `scan()`
возвращает промис. Если ранее доступ не был получен, [пользователю может
быть отправлен запрос]. Объект Promise будет разрешен, если выполнятся следующие условия:

- Пользователь разрешил веб-сайту использовать NFC-устройства при прикосновении
   ими к телефону.
- Телефон поддерживает NFC.
- Пользователь включил NFC на телефоне.

После разрешения промиса можно подписаться `чтение` входящих
сообщений NDEF через прослушиватель событий. Также следует подписаться
на события `readingerror` — чтобы знать, когда поблизости
оказываются несовместимые NFC-метки.

```js
const ndef = new NDEFReader();
ndef.scan().then(() => {
  console.log("Сканирование запущено.");
  ndef.onreadingerror = () => {
    console.log("Не удается прочитать данные из NFC-метки. Попробовать другую?");
  };
  ndef.onreading = event => {
    console.log("NDEF-сообщение прочитано.");
  };
}).catch(error => {
  console.log(`Ошибка! Не удалось запустить сканирование. ${error}.`);
});
```

Если поблизости NFC-метка, срабатывает событие `NDEFReadingEvent` с
двумя уникальными свойствами:

- `serialNumber` — серийный номер устройства (например,
   00-11-22-33-44-55-66) или пустая строка, если его нет;
- `message` — NDEF-сообщение, хранящееся в NFC-метке.

Чтобы прочитать содержимое NDEF-сообщения, запустите цикл по `message.records`
и обработайте члены `data` [согласно] их `recordType` (тип).
Члены `data` представлены как <code>[DataView]</code> поскольку это позволяет
обрабатывать случаи с кодировкой UTF-16.

```js
ndef.onreading = event => {
  const message = event.message;
  for (const record of message.records) {
    console.log("Тип записи:  " + record.recordType);
    console.log("MIME-тип:    " + record.mediaType);
    console.log("Идентификатор записи:    " + record.id);
    switch (record.recordType) {
      case "text":
        // TODO. Прочитать текстовую запись согласно данным, языку и кодировке записи.
        break;
      case "url":
        // TODO. Прочитать запись URL согласно данным записи.
        break;
      default:
        // TODO. Обработка других записей согласно данным записи.
    }
  }
};
```

{% Aside %}
В [справочнике](#cookbook) есть много примеров чтения NDEF-записей в зависимости
от типа.
{% endAside %}

### Запись NFC-меток {: #write }

Чтобы записывать NFC-метки, создайте экземпляр объекта `NDEFReader`. Вызов `write()`
возвращает промис. Если ранее доступ не был получен, [пользователю может
быть отправлен запрос]. На этом этапе NDEF-сообщение уже «подготовлено». Объект
Promise будет разрешен, если выполнятся следующие условия:

- Пользователь разрешил веб-сайту использовать NFC-устройства при прикосновении
   ими к телефону.
- Телефон поддерживает NFC.
- Пользователь включил NFC на телефоне.
- Пользователь коснулся NFC-метки и NDEF-сообщение было записано.

Чтобы записать в NFC-метку текст, передайте в метод `write()` строку.

```js
const ndef = new NDEFReader();
ndef.write(
  "Hello World"
).then(() => {
  console.log("Сообщение записано.");
}).catch(error => {
  console.log(`Ошибка записи. Повторите попытку. ${error}.`);
});
```

Чтобы записать в NFC-метку URL-адрес, передайте в метод `write()` словарь,
представляющий NDEF-сообщение. В примере ниже NDEF-сообщение — это словарь с ключом
`records`, значение которого — массив записей. В этом случае
запись URL, определенная как объект, у которого ключ `recordType` имеет значение
`"url"`, а `data` — строка URL-адреса.

```js
const ndef = new NDEFReader();
ndef.write({
  records: [{ recordType: "url", data: "https://w3c.github.io/web-nfc/" }]
}).then(() => {
  console.log("Сообщение записано.");
}).catch(error => {
  console.log(`Ошибка записи. Повторите попытку. ${error}.`);
});
```

В NFC-метки можно заносить и несколько записей.

```js
const ndef = new NDEFReader();
ndef.write({ records: [
    { recordType: "url", data: "https://w3c.github.io/web-nfc/" },
    { recordType: "url", data: "https://web.dev/nfc/" }
]}).then(() => {
  console.log("Сообщение записано.");
}).catch(error => {
  console.log(`Ошибка записи. Повторите попытку. ${error}.`);
});
```

{% Aside %}
В [справочнике](#cookbook) есть много примеров с NDEF-записями других
типов.
{% endAside %}

Если NFC-метка содержит NDEF-сообщение, не предназначенное для перезаписи,
то в параметрах для метода `write()` нужно задать свойству `overwrite`
значение `false`. В этом случае, если в NFC-метке уже сохранено
NDEF-сообщение, возвращенный промис будет отклонен.

```js
const ndef = new NDEFReader();
ndef.write("Круто! Пишем данные в пустую NFC-метку!", { overwrite: false })
.then(() => {
  console.log("Сообщение записано.");
}).catch(_ => {
  console.log(`Ошибка записи. Повторите попытку. ${error}.`);
});
```

### Безопасность и разрешения {: #security-and-permissions }

Команда Chrome разработала и внедрила Web NFC согласно принципам, определенным
в [Контроле доступа к функциям веб-платформы с широкими
возможностями][powerful-apis], включая пользовательский контроль, прозрачность и удобство.

NFC расширяет область, в которой информация может быть доступна вредоносным
сайтам, поэтому использование NFC ограничено, с тем чтобы максимально
информировать пользователей и дать им контроль над этой функцией.

<figure>
  {% Img src="image/admin/PjUcOk4zbtOFJLXfSeSD.png", alt="Скриншот запроса Web NFC на сайте", width="800", height="407" %}
  <figcaption>Запрос Web NFC пользователю</figcaption>
</figure>

Web NFC используется только во фреймах верхнего уровня и контекстах безопасного
просмотра веб-страниц (только HTTPS). Источник при обработке жеста пользователя (например, нажатия кнопки) сначала
запрашивает [разрешение] `"nfc"`. Если ранее доступ не был получен, методы `scan()` и `write()`
объекта NDEFReader отправляют запрос пользователю.

```js
  document.querySelector("#scanButton").onclick = async () => {
    const ndef = new NDEFReader();
    // Запрос пользователю разрешить сайту взаимодействовать с NFC-устройствами.
    await ndef.scan();
    ndef.onreading = event => {
      // TODO. Обработка входящих NDEF-сообщений.
    };
  };
```

Сочетание инициированного пользователем запроса на разрешение и физического
перемещения устройства по целевой NFC-метке отражает паттерн выбирающего
субъекта, который можно найти в других API доступа к файлам и устройствам.

Для сканирования (записи) веб-страница должна быть видимой, когда пользователь
касается NFC-метки устройством. Касание отражается браузером с помощью тактильной
обратной связи. Если дисплей выключен или устройство заблокировано, доступ к NFC-передатчику
блокируется. Если веб-страница невидима, получение и отправка содержимого
приостанавливается и возобновляется, когда она становится видимой.

Изменение видимости документа можно отслеживать с помощью
[Page Visibility API].

```js
document.onvisibilitychange = event => {
  if (document.hidden) {
    // Если документ скрыт, все операции NFC автоматически приостанавливаются.
  } else {
    // При необходимости все операции NFC возобновляются.
  }
};
```

## Справочник {: #cookbook }

Ниже приведено несколько примеров кода.

### Проверка разрешения

С помощью [Permissions API] можно проверить, было ли получено разрешение
`"nfc"`. В примере показано, как сканировать NFC-метки без взаимодействия с пользователем,
если доступ уже есть (и отобразить кнопку, если он еще не был получен). Такой же
механизм действует и для записи, поскольку используется то же
разрешение.

```js
const ndef = new NDEFReader();

async function startScanning() {
  await ndef.scan();
  ndef.onreading = event => {
    /* обработка NDEF-сообщений */
  };
}

const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" });
if (nfcPermissionStatus.state === "granted") {
  // Доступ NFC уже был предоставлен — можно начинать сканирование.
  startScanning();
} else {
  // Показать кнопку сканирования.
  document.querySelector("#scanButton").style.display = "block";
  document.querySelector("#scanButton").onclick = event => {
    // Запросить у пользователя разрешение на отправку и получение информации при касании NFC-устройств.
    startScanning();
  };
}
```

### Прерывание операции с NFC

С помощью примитива <code>[AbortController]</code> можно прервать операции
с NFC. В примере ниже показано, как передать `signal` из `AbortController`
через параметры методов `scan()` и `write()` объекта NDEFReader и
одновременно прервать обе операции с NFC.

```js
const abortController = new AbortController();
abortController.signal.onabort = event => {
  // Все операции с NFC были прерваны.
};

const ndef = new NDEFReader();
await ndef.scan({ signal: abortController.signal });

await ndef.write("Hello world", { signal: abortController.signal });

document.querySelector("#abortButton").onclick = event => {
  abortController.abort();
};
```

### Чтение и создание текстовой записи

Данные `data` текстовой записи можно декодировать с помощью экземпляра
`TextDecoder`, созданного со свойством `encoding` записи. Язык
текстовой записи хранится в свойстве `lang`.

```js
function readTextRecord(record) {
  console.assert(record.recordType === "text");
  const textDecoder = new TextDecoder(record.encoding);
  console.log(`Текст: ${textDecoder.decode(record.data)} (${record.lang})`);
}
```

Сделать простую текстовую запись можно, передав в метод `write()` объекта NDEFReader строку.

```js
const ndef = new NDEFReader();
await ndef.write("Hello World");
```

Текстовые записи по умолчанию в кодировке UTF-8 и предполагают язык текущего
документа, однако NDEF-запись можно настроить, используя полный синтаксис и указав
свойства `encoding` и `lang`.

```js
function a2utf16(string) {
  let result = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i);
  }
  return result;
}

const textRecord = {
  recordType: "text",
  lang: "fr",
  encoding: "utf-16",
  data: a2utf16("Bonjour, François !")
};

const ndef = new NDEFReader();
await ndef.write({ records: [textRecord] });
```

### Чтение и создание записи с URL-адресом

Для декодирования данных `data` записи используйте `TextDecoder`.

```js
function readUrlRecord(record) {
  console.assert(record.recordType === "url");
  const textDecoder = new TextDecoder();
  console.log(`URL: ${textDecoder.decode(record.data)}`);
}
```

Создать запись с URL-адресом можно, передав в метод `write()` объекта NDEFReader
словарь с NDEF-сообщением. Запись с URL-адресом в NDEF-сообщении определяется как объект, у которого
ключ `recordType` имеет значение `"url"`, а `data` —
строка URL.

```js
const urlRecord = {
  recordType: "url",
  data:"https://w3c.github.io/web-nfc/"
};

const ndef = new NDEFReader();
await ndef.write({ records: [urlRecord] });
```

### Чтение и создание записи с MIME-типом

Свойство `mediaType` записи с MIME-типом представляет собой MIME-тип полезной
нагрузки NDEF-записи, что позволяет декодировать `data`. Например, для декодирования
JSON-текста используется `JSON.parse`, а для данных изображения — элемент Image.

```js
function readMimeRecord(record) {
  console.assert(record.recordType === "mime");
  if (record.mediaType === "application/json") {
    const textDecoder = new TextDecoder();
    console.log(`JSON: ${JSON.parse(decoder.decode(record.data))}`);
  }
  else if (record.mediaType.startsWith('image/')) {
    const blob = new Blob([record.data], { type: record.mediaType });
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  }
  else {
    // TODO. Добавить обработку других MIME-типов.
  }
}
```

Создать запись с MIME-типом можно, передав в метод `write()` объекта NDEFReader
словарь с NDEF-сообщением. Запись с MIME-типом в NDEF-сообщении определяется как объект, у которого
ключ `recordType` имеет значение `"mime"`, `mediaType` — MIME-тип
контента, а `data` — либо объект `ArrayBuffer`,
либо его представление (например,
`Uint8Array`, `DataView`).

```js
const encoder = new TextEncoder();
const data = {
  firstname: "François",
  lastname: "Beaufort"
};
const jsonRecord = {
  recordType: "mime",
  mediaType: "application/json",
  data: encoder.encode(JSON.stringify(data))
};

const imageRecord = {
  recordType: "mime",
  mediaType: "image/png",
  data: await (await fetch("icon1.png")).arrayBuffer()
};

const ndef = new NDEFReader();
await ndef.write({ records: [jsonRecord, imageRecord] });
```

### Чтение и создание записи с абсолютным URL-адресом

Данные `data` записи с абсолютным URL-адресом можно декодировать с помощью простого `TextDecoder`.

```js
function readAbsoluteUrlRecord(record) {
  console.assert(record.recordType === "absolute-url");
  const textDecoder = new TextDecoder();
  console.log(`Абсолютный URL: ${textDecoder.decode(record.data)}`);
}
```

Создать запись с абсолютным URL-адресом можно, передав в метод `write()` объекта
NDEFReader словарь с NDEF-сообщением. Запись с абсолютным URL в NDEF-сообщении определяется как объект,
у которого ключ `recordType` имеет значение `"absolute-url"`, а `data` —
строка URL.

```js
const absoluteUrlRecord = {
  recordType: "absolute-url",
  data:"https://w3c.github.io/web-nfc/"
};

const ndef = new NDEFReader();
await ndef.write({ records: [absoluteUrlRecord] });
```

### Чтение и создание записи со смарт-плакатом

Запись со смарт-плакатом (реклама журналов, листовки, рекламные щиты и т. д.)
описывает определенный веб-контент как NDEF-запись с NDEF-сообщением
в качестве полезной нагрузки. Чтобы преобразовать `data` в список записей из смарт-плаката,
нужно вызвать `record.toRecords()`. В нем должна быть запись URL, текстовая
запись для заголовка, запись с MIME-типом для изображения и [пользовательские
записи локального типа], например `":t"`, `":act"` и `":s"` для типа,
действия и размера записи со смарт-плакатом соответственно.

Записи локального типа уникальны в рамках локального контекста содержащей
их записи NDEF. Они используются, когда смысл типов вне локального контекста содержащей
их записи не имеет значения и когда размер хранилища является
существенным ограничением. В Web NFC имена записей локального типа всегда начинаются с `:`
(например, `":t"`, `":s"`, `":act"`). Это позволяет отличить, например, текстовую запись
локального типа от обычной текстовой записи.

```js
function readSmartPosterRecord(smartPosterRecord) {
  console.assert(record.recordType === "smart-poster");
  let action, text, url;

  for (const record of smartPosterRecord.toRecords()) {
    if (record.recordType == "text") {
      const decoder = new TextDecoder(record.encoding);
      text = decoder.decode(record.data);
    } else if (record.recordType == "url") {
      const decoder = new TextDecoder();
      url = decoder.decode(record.data);
    } else if (record.recordType == ":act") {
      action = record.data.getUint8(0);
    } else {
      // TODO. Обработка записей других типов, например `:t`, `:s`.
    }
  }

  switch (action) {
    case 0:
      // Выполнить действие
      break;
    case 1:
      // Сохранить на потом
      break;
    case 2:
      // Открыть для редактирования
      break;
  }
}
```

Создать запись со смарт-плакатом можно, передав в метод `write()` объекта NDEFReader
NDEF-сообщение. Запись со смарт-плакатом в NDEF-сообщении определяется как объект, у которого
ключ `recordType` имеет значение `"smart-poster"`, а `data` —
объект, представляющий, опять же, NDEF-сообщение, содержащееся в
записи смарт-плаката.

```js
const encoder = new TextEncoder();
const smartPosterRecord = {
  recordType: "smart-poster",
  data: {
    records: [
      {
        recordType: "url", // Запись с URL-адресом для содержимого смарт-плаката
        data: "https://my.org/content/19911"
      },
      {
        recordType: "text", // Запись с заголовком для содержимого смарт-плаката
        data: "Забавный танец"
      },
      {
        recordType: ":t", // Запись типа, локальный тип для смарт-плаката
        data: encoder.encode("image/gif") // MIME-тип смарт-плаката
      },
      {
        recordType: ":s", // Запись размера, локальный тип для смарт-плаката
        data: new Uint32Array([4096]) // Размер в байтах для смарт-плаката
      },
      {
        recordType: ":act", // Запись действия, локальный тип для смарт-плаката
        // Выполнить действие, в этом случае — открыть в браузере
        data: new Uint8Array([0])
      },
      {
        recordType: "mime", // Запись MIME-типа со значком
        mediaType: "image/png",
        data: await (await fetch("icon1.png")).arrayBuffer()
      },
      {
        recordType: "mime", // Еще одна запись со значком
        mediaType: "image/jpg",
        data: await (await fetch("icon2.jpg")).arrayBuffer()
      }
    ]
  }
};

const ndef = new NDEFReader();
await ndef.write({ records: [smartPosterRecord] });
```

### Чтение и создание записи с внешним типом

Внешний тип нужен для возможности создания записей, определяемых приложением. В них
в качестве полезной нагрузки может быть NDEF-сообщение, доступное посредством `toRecords()`. В
имени содержится доменное имя организации-эмитента, двоеточие и имя типа
длиной не менее одного символа, например `"example.com:foo"`.

```js
function readExternalTypeRecord(externalTypeRecord) {
  for (const record of externalTypeRecord.toRecords()) {
    if (record.recordType == "text") {
      const decoder = new TextDecoder(record.encoding);
      console.log(`Текст: ${textDecoder.decode(record.data)} (${record.lang})`);
    } else if (record.recordType == "url") {
      const decoder = new TextDecoder();
      console.log(`URL: ${decoder.decode(record.data)}`);
    } else {
      // TODO. Обработка записей других типов.
    }
  }
}
```

Создать запись с внешним типом можно, передав в метод `write()` объекта
NDEFReader словарь с NDEF-сообщением. Запись с внешним типом в NDEF-сообщении определяется
как объект, у которого в ключе `recordType` содержится имя внешнего
типа, а в `data` — объект, представляющий NDEF-сообщение, содержащееся в записи
с внешним типом. Ключ `data` также может являться либо объектом
`ArrayBuffer`, либо его представлением
(например, `Uint8Array`, `DataView`).

```js
const externalTypeRecord = {
  recordType: "example.game:a",
  data: {
    records: [
      {
        recordType: "url",
        data: "https://example.game/42"
      },
      {
        recordType: "text",
        data: "Здесь дается контекст игры"
      },
      {
        recordType: "mime",
        mediaType: "image/png",
        data: await (await fetch("image.png")).arrayBuffer()
      }
    ]
  }
};

const ndef = new NDEFReader();
ndef.write({ records: [externalTypeRecord] });
```

### Чтение и создание пустой записи

У пустой записи нет полезной нагрузки.

Создать пустую запись можно, передав в метод `write()` объекта NDEFReader
словарь с NDEF-сообщением. Пустая запись в NDEF-сообщении определяется как объект, у которого
ключ `recordType` имеет значение `"empty"`.

```js
const emptyRecord = {
  recordType: "empty"
};

const ndef = new NDEFReader();
await ndef.write({ records: [emptyRecord] });
```

## Поддержка в браузере {: #browser-support }

Web NFC поддерживается на Android в Chrome 89.

## Советы разработчикам

Ниже — то, что было бы неплохо знать до начала работы с Web NFC:

- Android обрабатывает NFC-метки на уровне ОС до того, как начинает действовать Web NFC.
- Значок NFC можно найти на сайте [material.io].
- Различать NDEF-записи легче всего, используя их `id`.
- NFC-метка без формата с поддержкой NDEF содержит одну запись пустого типа.
- [Ссылка на приложение Android] создается легко — см. ниже.

```js
const encoder = new TextEncoder();
const aarRecord = {
  recordType: "android.com:pkg",
  data: encoder.encode("com.example.myapp")
};

const ndef = new NDEFReader();
await ndef.write({ records: [aarRecord] });
```

## Демонстрация {: #demos }

Попробуйте [официальный пример] и посмотрите пару классных демонстраций Web NFC:
- [Карточки].
- [Список продуктов].
- [Intel RSP Sensor NFC].
- [Мультимедийная записка].

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/videos/web-nfc-cards-demo.mp4">
  </video>
  <figcaption>
    Демонстрация карточек Web NFC на Chrome Dev Summit 2019
  </figcaption>
</figure>

## Отзывы {: #feedback }

[Группа сообщества Web NFC](https://www.w3.org/community/web-nfc/) и команда Chrome
с радостью выслушает ваше мнение об Web NFC и опыте использования этой функции.

### Ваше мнение о дизайне API

Что-то в API не работает должным образом? Или, может, отсутствуют
методы или свойства, необходимые для реализации вашей идеи?

Отправьте заявку о проблеме со спецификацией (Spec issue) в [GitHub-репозиторий Web NFC][issues]
или прокомментируйте существующую.

### Сообщите о проблеме с реализацией

Нашли ошибку в реализации функции в браузере Chrome? Реализация
отличается от спецификации?

Сообщите об ошибке на странице [https://new.crbug.com][new-bug]. Опишите
проблему как можно подробнее, дайте простые инструкции по ее воспроизведению
и для *Components* укажите `Blink>NFC`. Для демонстрации этапов воспроизведения
ошибки удобно использовать [Glitch](https://glitch.com).

### Окажите поддержку

Планируете использовать Web NFC? Ваша публичная поддержка помогает команде Chrome
определять приоритет функций и показывает другим поставщикам браузеров,
насколько важно их поддерживать.

Упомяните в твите [@ChromiumDev][cr-dev-twitter], поставьте хештег
[`#WebNFC`](https://twitter.com/search?q=%23WebNFC&src=typed_query&f=live)
и расскажите, как вы используете эту функцию.

## Полезные ссылки {: #helpful }

* [Спецификация][spec].
* [Демонстрационный пример Web NFC][demo] | [Исходный код демопримера Web NFC][demo-source].
* [Отслеживание ошибок][cr-bug].
* [Запись на ChromeStatus.com][cr-status].
* Компонент Blink: [`Blink>NFC`](https://chromestatus.com/features#component%3ABlink%3ENFC).

## Благодарности

Большое спасибо [ребятам из Intel] за реализацию Web NFC. Google Chrome
опирается на сообщество разработчиков, вместе продвигающих проект Chromium
вперед. Не все авторы кода Chromium — сотрудники Google, поэтому
они заслуживают особой благодарности!

[explainer]: https://github.com/w3c/web-nfc/blob/gh-pages/EXPLAINER.md#web-nfc-explained
[spec]: https://w3c.github.io/web-nfc/
[ot]: https://developers.chrome.com/origintrials/#/view_trial/236438980436951041
[issues]: https://github.com/w3c/web-nfc/issues
[demo]: https://web-nfc-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/web-nfc-demo?path=script.js:1:0
[new-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ENFC
[cr-dev-twitter]: https://twitter.com/chromiumdev
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=520391
[cr-status]: https://www.chromestatus.com/feature/6261030015467520
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/master/docs/security/permissions-for-powerful-web-platform-features.md
[Permissions API]: https://www.w3.org/TR/permissions/
[AbortController]: https://developer.mozilla.org/docs/Web/API/AbortController
[Page Visibility API]: https://developer.mozilla.org/docs/Web/API/Page_Visibility_API
[пользователю может быть отправлен запрос]: #security-and-permissions
[разрешение]: https://w3c.github.io/permissions/
[ребятам из Intel]: https://github.com/w3c/web-nfc/graphs/contributors
[Ссылка на приложение Android]: https://developer.android.com/guide/topics/connectivity/nfc/nfc#aar
[NFC forum]: https://nfc-forum.org/
[Ссылка на приложение Android]: https://developer.android.com/guide/topics/connectivity/nfc/nfc#aar
[официальный пример]: https://googlechrome.github.io/samples/web-nfc/
[Карточки]: https://web-nfc-demo.glitch.me
[Список продуктов]: https://kenchris.github.io/webnfc-groceries
[Мультимедийная записка]: https://webnfc-media-memo.netlify.com/
[Intel RSP Sensor NFC]: https://kenchris.github.io/webnfc-rsp/
[material.io]: https://material.io/resources/icons/?icon=nfc&style=baseline
[согласно]: https://w3c.github.io/web-nfc/#data-mapping
[custom local type records]: https://w3c.github.io/web-nfc/#smart-poster-record
[DataView]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView
