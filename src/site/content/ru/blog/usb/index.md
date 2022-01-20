---
title: Доступ к USB-устройствам в Интернете
subhead: |2-

  С WebUSB API использовать USB становится безопаснее и проще, предоставляя ему доступ в Интернет.
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Фотография платы Arduino Micro
description: |2-

  С WebUSB API использовать USB становится безопаснее и проще, предоставляя ему доступ в Интернет.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

Если я просто скажу «USB», вы с большой вероятностью сразу же вспомните клавиатуры, мыши, накопители, аудио- и видеоустройства. Ваша правда, но есть и другие типы устройств с универсальной последовательной шиной (USB).

Эти нестандартные USB-устройства требуют от поставщиков оборудования написания драйверов и SDK для конкретных платформ, чтобы вы (разработчик) могли ими воспользоваться. К сожалению, нативный код исторически препятствовал использованию этих устройств в сети. И это одна из причин, по которой был создан WebUSB API: реализовать возможность задействовать USB-устройства в Интернете. С помощью этого API производители оборудования смогут создавать кроссплатформенные SDK JavaScript для своих устройств. Но, что еще важнее, это **сделает USB безопаснее и проще в использовании, предоставив ему доступ в Интернет**.

Давайте посмотрим, какой алгоритм у вас будет при использовании WebUSB API:

1. Купите USB-устройство.
2. Подключите его к компьютеру. Сразу же появится уведомление с указанием нужного веб-сайта для этого устройства.
3. Щелкните по уведомлению. Сайт готов к использованию!
4. Нажмите, чтобы подключиться, и в Chrome появится окно выбора USB-устройства, где вы сможете выбрать свое устройство.

Вуаля!

На что была бы похожа эта процедура без WebUSB API?

1. Установите нативное приложение.
2. Даже если устройство поддерживается вашей операционной системой, убедитесь, что загружено то, что нужно.
3. Установите загруженные ресурсы. Если вам повезет, вы не увидите жутких подсказок ОС или всплывающих окон, предупреждающих об установке драйверов или приложений из Интернета. Если не повезет, установленные драйверы или приложения будут работать некорректно и нанесут вред вашему компьютеру. (Помните — Интернет создан специально для [вредоносных веб-сайтов](https://www.youtube.com/watch?v=29e0CtgXZSI)).
4. Если вы используете эту функцию только один раз, код останется на вашем компьютере, пока вы не решите его удалить. В Интернете неиспользуемое пространство в конечном итоге освобождается.

## Перед началом

В этой статье предполагается, что у вас есть базовые знания о том, как работает USB. Если нет, рекомендую прочесть [USB in a NutShell](http://www.beyondlogic.org/usbnutshell). Для получения дополнительной информации о USB ознакомьтесь с [официальными спецификациями USB](https://www.usb.org/).

[WebUSB API](https://wicg.github.io/webusb/) доступен в Chrome 61.

### Доступно для испытаний по схеме Origin Trial

Чтобы получить как можно больше отзывов от разработчиков, использующих WebUSB API на практике, ранее мы добавили эту функцию в Chrome 54 и Chrome 57 для [испытаний по схеме Origin Trial](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

Последние испытания успешно завершились в сентябре 2017 года.

## Конфиденциальность и безопасность

### Только HTTPS

Поскольку это мощная функция, она работает только в [безопасных контекстах](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro). Это означает, что вам нужно будет проектировать код с учетом [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).

### Необходим жест пользователя

Из соображений безопасности `navigator.usb.requestDevice()` может вызываться только с помощью пользовательского жеста, например касания или щелчка мыши.

### Политика функциональности

[Feature Policy](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy) (политика функциональности) — это механизм, который позволяет разработчикам выборочно включать и отключать различные функции браузера и API. Его можно определить через HTTP-заголовок или атрибут iframe "allow".

Вы можете определить политику функциональности, которая контролирует, отображается ли атрибут usb в объекте Navigator, или, другими словами, разрешаете ли вы использование WebUSB.

Ниже приведен пример политики заголовков, в которой использование WebUSB запрещено:

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

Ниже приведен еще один пример политики контейнеров, в которой разрешен USB:

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## Начинаем программировать

WebUSB API в значительной степени полагается на [обещания](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) JavaScript. Если вы не знакомы с ними, прочтите это замечательное [руководство по обещаниям](/promises). И еще: `() => {}` — это просто [стрелочные функции](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ECMAScript 2015.

### Получаем доступ к USB-устройствам

Вы можете предложить пользователю выбрать одно подключенное USB-устройство с помощью `navigator.usb.requestDevice()` или вызвать `navigator.usb.getDevices()`, чтобы получить список всех подключенных USB-устройств, к которым у источника есть доступ.

Функция `navigator.usb.requestDevice()` принимает обязательный объект JavaScript, определяющий `filters`. Эти фильтры используются для сопоставления любого USB-устройства с указанным идентификатором поставщика (`vendorId`) и опционально — продукта (`productId`). Ключи `classCode`, `protocolCode`, `serialNumber` и `subclassCode` также могут быть там определены.

<figure>{% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Скриншот диалогового окна в Chrome с выбором USB-устройства", width="800", height="533" %} <figcaption>Диалоговое окно с выбором USB-устройства.</figcaption></figure>

Например, вот так можно получить доступ к подключенному устройству Arduino, настроенному для разрешения источника.

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

Прежде чем вы спросите — шестнадцатеричное число `0x2341` взялось не с потолка. Я просто поискал слово «Arduino» в этом [списке USB-идентификаторов](http://www.linux-usb.org/usb.ids).

Объект USB-`device`, возвращаемый в выполненном обещании выше, содержит некоторую базовую, однако важную информацию об устройстве, например, поддерживаемую версию USB, максимальный размер пакета, идентификаторы продукта и поставщика, число возможных конфигураций устройства. В основном он содержит все поля в [дескрипторе USB-устройства](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors).

Кстати, если USB-устройство объявляет о своей [поддержке WebUSB](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor), а также определяет URL-адрес целевой страницы, Chrome будет постоянно показывать уведомление при подключении USB-устройства. При нажатии на это уведомление откроется целевая страница.

<figure>{% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Скриншот уведомления WebUSB в Chrome", width="800", height="450" %} <figcaption>Уведомление WebUSB.</figcaption></figure>

Таким образом, вы можете просто вызвать `navigator.usb.getDevices()` и получить доступ к своему устройству Arduino, как показано ниже.

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Обращаемся к USB-плате Arduino

А теперь давайте посмотрим, насколько просто установить связь с платой Arduino, совместимой с WebUSB, через USB-порт. Ознакомьтесь с инструкциями на [https://github.com/webusb/arduino](https://github.com/webusb/arduino), чтобы активировать ваши [скетчи](http://www.arduino.cc/en/Tutorial/Sketch) через WebUSB.

Не волнуйтесь, позже в этой статье я расскажу обо всех методах устройства WebUSB, упомянутых ниже.

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // Начинаем сеанс.
  })
.then(() => device.selectConfiguration(1)) // Выбираем для устройства конфигурацию #1.
.then(() => device.claimInterface(2)) // Запрашиваем эксклюзивный контроль над интерфейсом #2.
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Готовы к получению данных
.then(() => device.transferIn(5, 64)) // Ожидаем 64 байта данных из конечной точки #5.
.then(result => {
  const decoder = new TextDecoder();
  console.log('Получено: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

Имейте в виду, что библиотека WebUSB, которую я здесь использую, просто реализует один пример протокола (на основе стандартного последовательного протокола USB), и что производители могут создавать любой набор и типы конечных точек по желанию. Передачи управления особенно хорошо подходят для небольших команд конфигурации, поскольку они получают приоритет шины и имеют четко определенную структуру.

А вот скетч, загруженный на плату Arduino.

```arduino
// Сторонняя библиотека WebUSB Arduino
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos");

#define Serial WebUSBSerial

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Ожидаем подключения серийного порта.
  }
  Serial.write("WebUSB рулит!");
  Serial.flush();
}

void loop() {
  // Здесь пока ничего нет.
}
```

[Сторонняя библиотека WebUSB Arduino](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB), используемая в приведенном выше примере кода, в основном выполняет две функции:

- Устройство действует как устройство WebUSB, позволяя Chrome читать [URL-адрес целевой страницы](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor).
- Предоставляет WebUSB Serial API, который можно использовать для замены стандартного.

Еще раз посмотрите на код JavaScript. Как только я получаю выбранное пользователем `device`, метод `device.open()` выполняет все шаги, зависящие от платформы, чтобы начать сеанс с USB-устройством. Затем мне нужно выбрать доступную конфигурацию USB с помощью `device.selectConfiguration()`. Помните, что конфигурация определяет способ питания устройства, его максимальную потребляемую мощность и количество интерфейсов. Кстати, об интерфейсах — мне нужно запросить эксклюзивный доступ с помощью `device.claimInterface()`, поскольку данные могут быть переданы интерфейсу или связанным конечным точкам, только когда интерфейс заявлен. Наконец, вызов `device.controlTransferOut()` необходим для настройки устройства Arduino с соответствующими командами для связи через WebUSB Serial API.

Таким образом, `device.transferIn()` выполняет массовую передачу на устройство, сообщая ему, что хост готов принять массовые данные. Затем обещание выполняется с помощью объекта `result`, содержащего данные `data` в [DataView](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView), которые необходимо соответствующим образом проанализировать.

Если вы работали с USB, все это должно показаться вам довольно знакомым.

### Нужно еще!

WebUSB API позволяет взаимодействовать со всеми типами передачи и конечных точек USB:

- Передачи CONTROL, используемые для отправки или получения параметров конфигурации или команд на USB-устройство, обрабатываются с помощью `controlTransferIn(setup, length)` и `controlTransferOut(setup, data)`.
- Передачи INTERRUPT, используемые для небольшого количества данных с ограниченным сроком действия, обрабатываются теми же методами, что и BULK-передачи с `transferIn(endpointNumber, length)` и `transferOut(endpointNumber, data)`.
- Передачи ISOCHRONOUS, используемые для потоков данных, таких как видео и звук, обрабатываются с помощью `isochronousTransferIn(endpointNumber, packetLengths)` и `isochronousTransferOut(endpointNumber, data, packetLengths)`.
- BULK-передачи, используемые для надежной передачи большого количества данных, не зависящих от времени, обрабатываются с помощью `transferIn(endpointNumber, length)` и `transferOut(endpointNumber, data)`.

Вы также можете ознакомиться с проектом Майка Цао [WebLight](https://github.com/sowbug/weblight), который представляет собой базовый пример создания светодиодного устройства с USB-управлением, разработанного для WebUSB API (здесь не используется Arduino). Вы найдете информацию об оборудовании, программном обеспечении и прошивке.

## Подсказки

Отладка USB в Chrome упрощается благодаря внутренней странице `about://device-log`, где в одном месте сосредоточены все события, связанные с USB-устройством.

<figure>{% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Скриншот страницы журнала устройства для отладки WebUSB в Chrome", width="800", height="442" %} <figcaption>Страница журнала устройства в Chrome для отладки WebUSB API.</figcaption></figure>

Внутренняя страница `about://usb-internals` также пригодится — она позволяет моделировать подключение и отключение виртуальных устройств WebUSB. Это полезно для тестирования пользовательского интерфейса без использования реального оборудования.

<figure>{% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Скриншот внутренней страницы для отладки WebUSB в Chrome", width="800", height="294" %} <figcaption>Внутренняя страница в Chrome для отладки WebUSB API.</figcaption></figure>

В большинстве систем Linux USB-устройства по умолчанию отображаются с разрешениями только для чтения. Чтобы разрешить Chrome открывать USB-устройство, вам нужно будет добавить новое [правило udev](https://www.freedesktop.org/software/systemd/man/udev.html). Создайте файл по адресу `/etc/udev/rules.d/50-yourdevicename.rules` со следующим содержанием:

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

где `[yourdevicevendor]` — `2341`, например, если ваше устройство — Arduino. Также можно добавить `ATTR{idProduct}` для конкретизации правила. Убедитесь, что ваш `user` является [членом](https://wiki.debian.org/SystemGroups) группы `plugdev`. Затем просто повторно подключите свое устройство.

{% Aside  %} Дескрипторы Microsoft OS 2.0, используемые в примерах Arduino, работают только в Windows 8.1 и новее. Без этой поддержки Windows по-прежнему требует ручной установки файла INF. {% endAside %}

## Ресурсы

- Stack Overflow: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- Спецификация WebUSB API: [http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Статус функции Chrome: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- Ошибки в спецификации: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- Ошибки реализации: [http://crbug.com?q=component:Blink&gt;USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: [#webusb](irc://irc.w3.org:6665/#webusb) в IRC W3C
- Список рассылки WICG: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- Проект WebLight: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

Отправьте твит на [@ChromiumDev][cr-dev-twitter], используя хэштег [`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live), и сообщите нам, где и как вы его используете.

## Благодарности

Спасибо [Джо Медли](https://github.com/jpmedley) за рецензирование этой статьи.
