---
title: Связь с Bluetooth-устройствами через JavaScript
subhead: |2-

  Web Bluetooth API позволяет веб-сайтам связываться с Bluetooth-устройствами.
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: Bluetooth-чип на монете
description: |2-

  Web Bluetooth API позволяет веб-сайтам связываться с Bluetooth-устройствами.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

Что если я скажу, что веб-сайты могут связываться с ближайшими Bluetooth-устройствами безопасным способом с сохранением конфиденциальности? Таким образом, пульсометры, поющие лампочки и даже [черепахи](https://www.youtube.com/watch?v=1LV1Fk5ZXwA) могут напрямую взаимодействовать с веб-сайтом.

До сих пор взаимодействовать с  Bluetooth-устройствами могли только платформозависимые приложения. Web Bluetooth API нацелен это изменить, дав такую возможность веб-браузерам.

## Перед началом

В этой статье предполагается, что у вас есть базовые знания о том, как работают технология Bluetooth с низким энергопотреблением (Bluetooth Low Energy, BLE) и [профиль общих атрибутов](https://www.bluetooth.com/specifications/gatt/) (Generic Attribute Profile, GATT).

Несмотря на то, что [спецификация Web Bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/) еще не окончательно доработана, авторы спецификации активно ищут энтузиастов-разработчиков, чтобы опробовать этот API и дать [отзывы о спецификации](https://github.com/WebBluetoothCG/web-bluetooth/issues) и [отзывы о реализации](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth).

Сокращенная версия Web Bluetooth API доступна в ChromeOS, Chrome для Android 6.0, Mac (Chrome 56) и Windows 10 (Chrome 70). Это означает, что вы должны иметь возможность [запрашивать](#request) и [подключаться к](#connect) ближайшим устройствам Bluetooth с низким энергопотреблением, [читать](#read) и [записывать](#write) характеристики Bluetooth, [получать уведомления GATT](#notifications), знать, когда [устройство Bluetooth отключается](#disconnect), а также [читать и записывать дескрипторы Bluetooth](#descriptors). Для получения дополнительной информации см. [таблицу совместимости браузера](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility) в MDN.

Для Linux и более ранних версий Windows включите флаг `#experimental-web-platform-features` в `about://flags`.

### Доступно для испытаний по схеме Origin Trial

Чтобы получить как можно больше отзывов от разработчиков, использующих Web Bluetooth API на практике, Chrome ранее добавил эту функцию в Chrome 53 для [испытаний по схеме Origin Trial](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) на ChromeOS, Android и Mac.

Испытания успешно завершились в январе 2017 года.

## Требования безопасности

Чтобы разобраться в компромиссах безопасности, рекомендую прочесть публикацию о [модели безопасности Web Bluetooth](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2) от Джеффри Яскина, инженера-программиста из команды Chrome, работающего над спецификацией Web Bluetooth API.

### Только HTTPS

Поскольку этот экспериментальный API — новая мощная функция, добавленная в Интернет, он доступен только для [защищенных контекстов](https://w3c.github.io/webappsec-secure-contexts/#intro). Это означает, что организовывать проект нужно исходя из требований протокола [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).

### Требуется жест пользователя

В целях безопасности обнаружение Bluetooth-устройств с помощью `navigator.bluetooth.requestDevice` должно запускаться [жестом пользователя](https://html.spec.whatwg.org/multipage/interaction.html#activation), например, касанием или щелчком мыши. Речь идет о прослушивании событий [`pointerup`](https://developer.chrome.com/blog/pointer-events/), `click` и `touchend`.

```js
button.addEventListener('pointerup', function(event) {
  // Вызываем navigator.bluetooth.requestDevice
});
```

## Займемся кодом

Web Bluetooth API в значительной степени полагается на [обещания](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) JavaScript. Если вы не знакомы с ними, прочтите это замечательное [руководство по обещаниям](/promises). И еще: `() => {}` — это просто [стрелочные функции](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ECMAScript 2015.

### Запрос устройств Bluetooth {: #request }

Эта версия спецификации Web Bluetooth API позволяет веб-сайтам, работающим в роли Central, подключаться к удаленным серверам GATT через соединение BLE. Поддерживается связь между устройствами, реализующими Bluetooth 4.0 или более поздней версии.

Когда веб-сайт запрашивает доступ к ближайшим устройствам с помощью `navigator.bluetooth.requestDevice`, браузер вызывает список устройств, где пользователь может выбрать одно устройство или отменить запрос.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">Пользовательское диалоговое окно с устройствами Bluetooth.</a></p>
  </figcaption></figure>

Функция `navigator.bluetooth.requestDevice()` принимает обязательный объект, определяющий фильтры. Эти фильтры используются для возврата только тех устройств, которые соответствуют некоторым объявленным службам Bluetooth GATT или имени устройства.

#### Фильтр служб

Вот так можно запросить устройства Bluetooth, объявляющие [службу батарей Bluetooth GATT](https://www.bluetooth.com/specifications/gatt/):

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Если ваша служба Bluetooth GATT не входит в список [стандартизированных служб Bluetooth GATT](https://www.bluetooth.com/specifications/assigned-numbers/), вы можете предоставить либо полный UUID Bluetooth, либо короткую 16- или 32-разрядную форму.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Фильтр имен

Вы также можете запрашивать устройства Bluetooth на основе имени устройства, которое объявляется с помощью ключа фильтров `name`, или даже префикса этого имени с ключом `namePrefix`. Обратите внимание, что в этом случае также необходимо будет определить ключ `optionalServices`, чтобы иметь доступ к любым службам, не включенным в фильтр служб. Если этого не сделать, позже при попытке доступа к ним вы получите сообщение об ошибке.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // Необходимо для последующего доступа к службе.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Фильтр данных производителя

Также можно запрашивать устройства Bluetooth на основе данных производителя, объявляемых с помощью ключа фильтров `manufacturerData`. Этот ключ представляет собой массив объектов с обязательным ключом [идентификатора компании Bluetooth](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/) под названием `companyIdentifier`. Также можно указать префикс данных, фильтрующий данные производителя устройств Bluetooth, которые с него начинаются. Обратите внимание, что также необходимо определить ключ `optionalServices`, чтобы иметь возможность доступа к любым службам, не включенным в фильтр служб. Если этого не сделать, позже при попытке доступа к ним вы получите сообщение об ошибке.

```js
// Фильтруем Bluetooth-устройства от Google с байтами данных производителя
// которые начинаются с [0x01, 0x02].
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // Необходимо для последующего доступа к службе.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Маска также может использоваться с префиксом данных, чтобы соответствовать некоторым шаблонам в данных производителя. Чтобы узнать больше, ознакомьтесь с [объяснением фильтров данных Bluetooth](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md).

{% Aside %} На момент написания ключ фильтра `manufacturerData` доступен в Chrome 92. Если требуется обратная совместимость со старыми браузерами, необходимо обеспечить альтернативный вариант, поскольку фильтр данных производителя считается пустым. См. [пример](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ). {% endAside %}

#### Без фильтров

Наконец, вместо `filters` можно использовать ключ `acceptAllDevices` для отображения всех ближайших Bluetooth-устройств. Вам также потребуется определить ключ `optionalServices`, чтобы иметь доступ к некоторым службам. Если этого не сделать, позже при попытке доступа к ним вы получите сообщение об ошибке.

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // Необходимо для последующего доступа к службе.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %} Это может привести к отображению группы несвязанных устройств в списке и потере энергии из-за отсутствия фильтров. Используйте эту опцию с осторожностью. {% endAside %}

### Подключение к устройству Bluetooth {: #connect }

Итак, что делать теперь, когда у вас есть `BluetoothDevice`? Давайте подключимся к удаленному Bluetooth-серверу GATT, который содержит определения служб и характеристик.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // Читаемое имя устройства.
  console.log(device.name);

  // Попытка соединиться с удаленным сервером GATT.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### Чтение характеристики Bluetooth {: #read }

Итак, мы подключены к серверу GATT удаленного устройства Bluetooth. Теперь нам нужно получить первичную службу GATT и прочитать характеристику, которая принадлежит этой службе. Попробуем, например, узнать текущий уровень заряда аккумулятора устройства.

В приведенном ниже примере `battery_level` — это [стандартизированная характеристика уровня заряда батареи](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Получаем службу аккумулятора…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Получаем характеристику уровня заряда батареи…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Считываем заряд батареи…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Уровень заряда: ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

Если вы используете настраиваемую характеристику Bluetooth GATT, вы можете предоставить либо полный UUID Bluetooth, либо короткую 16- или 32-разрядную форму для `service.getCharacteristic`.

Обратите внимание, что также можно добавить прослушиватель событий `characteristicvaluechanged` к характеристике для обработки считывания значения. Чтобы узнать, как дополнительно обрабатывать предстоящие уведомления GATT, ознакомьтесь с примером «[Как прочитать измененное значение характеристики](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)».

```js
…
.then(characteristic => {
  // Настраиваем прослушиватель событий для измененного значения характеристики.
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Считываем заряд батареи…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Уровень заряда: ' + batteryLevel);
}
```

### Запись в характеристику Bluetooth {: #write }

Записать значение в характеристику Bluetooth GATT так же просто, как ее прочитать. На этот раз давайте воспользуемся точкой контроля частоты пульса, чтобы сбросить значение поля «Расход энергии» на 0 на пульсометре.

Вот увидите, ничего магического здесь нет. Все объясняется на [странице характеристик контрольной точки пульса](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Запись 1 сигнализирует о том, что нужно сбросить энергозатраты.
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Расход энергии был сброшен.');
})
.catch(error => { console.error(error); });
```

### Получение уведомлений GATT {: #notifications }

Теперь давайте посмотрим, как получить уведомление при изменении характеристики [измерения пульса](https://www.bluetooth.com/specifications/gatt/) на устройстве:

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Уведомления запущены.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Получено ' + value);
  // Сделать: парсинг значения пульса.
  // См. https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
}
```

[Пример уведомлений](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) показывает, как отключить уведомления со `stopNotifications()` и правильно удалить добавленный прослушиватель событий `characteristicvaluechanged`.

### Отключение от устройства Bluetooth {: #disconnect }

Чтобы улучшить взаимодействие с пользователем, вы можете прослушивать события отключения и предлагать пользователю повторно подключиться:

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // Настраиваем прослушиватель событий для отключения устройства.
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // Попытка соединения с удаленным сервером GATT.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Устройство ${device.name} отключено.`);
}
```

Также можно вызвать `device.gatt.disconnect()`, чтобы отключить веб-приложение от устройства Bluetooth. Это запустит существующие прослушиватели событий `gattserverdisconnected`. Обратите внимание, что связь с Bluetooth-устройством не будет прекращена, если с ним уже взаимодействует другое приложение. Чтобы узнать больше, ознакомьтесь с [примером отключения устройства](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) и [примером автоматического повторного подключения](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html).

{% Aside 'caution' %} Атрибуты Bluetooth GATT, службы, характеристики и т. д. становятся недействительными при отключении устройства. Это означает, что ваш код всегда должен извлекать (с помощью `getPrimaryService(s)`, `getCharacteristic(s)` и т. д.) эти атрибуты после повторного подключения. {% endAside %}

### Чтение и запись дескрипторов Bluetooth {: #descriptors }

Дескрипторы Bluetooth GATT — это атрибуты, которые описывают значение характеристики. Их можно читать и записывать аналогично характеристикам Bluetooth GATT.

Давайте посмотрим, например, как читать пользовательское описание интервала измерения термометра.

В приведенном ниже примере `health_thermometer` является [службой термометра](https://www.bluetooth.com/specifications/gatt/), `measurement_interval` — [характеристикой интервала измерения](https://www.bluetooth.com/specifications/gatt/), а `gatt.characteristic_user_description` — [дескриптором пользовательского описания характеристики](https://www.bluetooth.com/specifications/assigned-numbers/).

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`Пользовательское описание: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
```

Теперь, когда мы прочитали пользовательское описание интервала измерения термометра, давайте посмотрим, как его обновить и записать пользовательское значение.

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Определяет время между измерениями.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## Примеры, демонстрации и кодовые лаборатории

Все приведенные ниже [примеры Web Bluetooth](https://googlechrome.github.io/samples/web-bluetooth/index.html) были успешно протестированы. Чтобы как следует оценить эти примеры, я рекомендую установить [Android-приложение BLE Peripheral Simulator](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral), которое имитирует периферийное BLE-устройство с помощью службы батареи, службы сердечного ритма или службы термометра.

### Для начинающих

- [Информация об устройстве](https://googlechrome.github.io/samples/web-bluetooth/device-info.html) — получение основной информации об устройстве с BLE-устройства.
- [Уровень заряда батареи](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html) — получение информации о батарее с BLE-устройства, выдающего соответствующие оповещения.
- [Сброс энергии](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html) — сброс энергии, израсходованной BLE-устройством, оповещающим о частоте сердечных сокращений.
- [Свойства характеристики](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html) — отображение всех свойств определенной характеристики с BLE-устройства.
- [Уведомления](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) — запуск и остановка уведомлений характеристики BLE-устройства.
- [Отключение устройства](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) — отключение и получение уведомления об отключении BLE-устройства после подключения к нему.
- [Получение характеристик](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html) — получение всех характеристик объявляемой службы с BLE-устройства.
- [Получение дескрипторов](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html) — получение дескрипторов всех характеристик объявляемой службы с BLE-устройства.
- [Фильтр данных производителя](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html) — получение основной информации об устройстве с BLE-устройства, которое соответствует данным производителя.

### Объединение нескольких операций

- [Характеристики GAP](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html) — получение всех характеристик GAP BLE-устройства.
- [Характеристики информации об устройстве](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html) — получение всех характеристик информации об устройстве для BLE-устройства.
- [Потеря соединения (Link Loss)](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html) — установка характеристики уровня оповещений (Alert Level) для BLE-устройства (readValue и writeValue).
- [Сведения о службах и характеристиках](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html) — получение информации обо всех доступных первичных службах и их характеристиках с BLE-устройства.
- [Автоматическое повторное подключение](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) — повторное подключение к отключенному BLE-устройству с использованием алгоритма экспоненциальной задержки.
- [Чтение измененного значения характеристики](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) — считывание уровня заряда батареи и получение уведомлений об изменениях с BLE-устройства.
- [Чтение дескрипторов](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html) — чтение дескрипторов всех характеристик службы с BLE-устройства.
- [Запись дескриптора](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html) — запись в дескриптор «Пользовательское описание характеристики» на BLE-устройстве.

Также ознакомьтесь с нашими [специально отобранными демонстрациями Web Bluetooth](https://github.com/WebBluetoothCG/demos) и [официальными кодовыми лабораториями Web Bluetooth](https://github.com/search?q=org%3Agooglecodelabs+bluetooth).

## Библиотеки

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils) — это npm-модуль, который добавляет некоторые удобные функции в API.
- Оболочка Web Bluetooth API доступна в [noble](https://github.com/sandeepmistry/noble), наиболее популярном Node.js-модуле BLE Central. Она позволяет упаковывать и просматривать noble без необходимости использования сервера WebSocket или других плагинов.
- [angular-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth) — это модуль для [Angular](https://angularjs.org), который абстрагирует весь стереотипный код, необходимый для настройки Web Bluetooth API.

## Инструменты

- [Начало работы с Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator) — простое веб-приложение, которое сгенерирует весь шаблонный код JavaScript для начала взаимодействия с Bluetooth-устройством. Введите имя устройства, службу, характеристику, определите его свойства, и все готово.
- Если вы уже являетесь разработчиком Bluetooth, [плагин Web Bluetooth Developer Studio](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin) также сгенерирует код JavaScript Web Bluetooth для вашего Bluetooth-устройства.

## Полезные советы

Страница «**Внутренние устройства Bluetooth**» доступна в Chrome по адресу `about://bluetooth-internals`. Здесь вы можете проверить все, что связано с ближайшими Bluetooth-устройствами: состояние, службы, характеристики и дескрипторы.

<figure>{% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="Снимок экрана внутренней страницы для отладки Bluetooth в Chrome", width="800", height="572" %} <figcaption>Внутренняя страница в Chrome для отладки Bluetooth-устройств.</figcaption></figure>

Также рекомендую ознакомиться с официальной страницей «[Как зарегистрировать ошибки Web Bluetooth](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs)», поскольку отладка Bluetooth порой может быть сложной.

{% Aside 'caution' %} Параллельное чтение и запись характеристик Bluetooth может вызвать ошибки в зависимости от платформы. Я настоятельно рекомендую вручную ставить в очередь запросы операций GATT, когда это необходимо. См. «[Выполняется операция GATT — как ее обработать?](https://github.com/WebBluetoothCG/web-bluetooth/issues/188)». {% endAside %}

## Что дальше

Сначала проверьте [состояние реализации браузера и платформы](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md), чтобы узнать, какие части интерфейса Web Bluetooth API реализуются на данный момент.

Интерфейс еще не завершен, но вот краткий анонс того, что ожидается в ближайшем будущем:

- [Поиск ближайших объявлений BLE](https://github.com/WebBluetoothCG/web-bluetooth/pull/239) будет выполняться с помощью `navigator.bluetooth.requestLEScan()`.
- Новое событие `serviceadded` будет отслеживать недавно обнаруженные службы Bluetooth GATT, в то время как событие `serviceremoved` будет отслеживать удаленные. Новое событие `servicechanged` будет срабатывать, когда какая-либо характеристика или дескриптор добавляются или удаляются из службы Bluetooth GATT.

### Поддержите API

Собираетесь использовать Web Bluetooth API? Ваша публичная поддержка помогает команде Chrome расставлять функции в порядке приоритетности и показывает другим поставщикам браузеров, насколько важно их поддерживать.

Отправьте твит на [@ChromiumDev](https://twitter.com/ChromiumDev), используя хэштег [`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live) и расскажите нам, где и как вы его используете.

## Ресурсы

- Stack Overflow: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Статус функции Chrome: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Ошибки реализации Chrome: [https://crbug.com/?q=component:Blink&gt;Bluetooth.](https://crbug.com/?q=component:Blink%3EBluetooth)
- Спецификация Web Bluetooth: [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- Ошибки в спецификации: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- Приложение BLE Peripheral Simulator: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ' %}

## Благодарности

Спасибо [Кэйси Баскесу](https://github.com/kaycebasques) за рецензирование этой статьи. Баннер предоставлен [SparkFun Electronics, Боулдер, США](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg).
