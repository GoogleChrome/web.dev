---
title: Comunicación con dispositivos Bluetooth a través de JavaScript
subhead: |2

  La API Web Bluetooth permite que los sitios web se comuniquen con dispositivos Bluetooth.
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: Un chip Bluetooth en una moneda
description: |2

  La API Web Bluetooth permite que los sitios web se comuniquen con dispositivos Bluetooth.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

¿Qué pasaría si le dijeran que los sitios web pueden comunicarse con dispositivos Bluetooth cercanos de una manera segura y que preserve la privacidad? De esta manera, los monitores de frecuencia cardíaca, las bombillas que cantan e incluso las [tortugas](https://www.youtube.com/watch?v=1LV1Fk5ZXwA) podrían interactuar directamente con un sitio web.

Hasta ahora, la capacidad de interactuar con dispositivos Bluetooth solo ha sido posible para aplicaciones específicas de una plataforma. La API Web Bluetooth tiene como objetivo cambiar esto y lo lleva también a los navegadores web.

## Antes de empezar

Este artículo asume que tiene conocimientos básicos sobre cómo funcionan el Bluetooth de baja energía (BLE) y el [Perfil de atributo genérico](https://www.bluetooth.com/specifications/gatt/) (GATT).

Aunque la [especificación de la API Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/) aún no está finalizada, los autores de las especificaciones están buscando activamente desarrolladores entusiastas para probar esta API y dar [comentario sobre las especificaciones](https://github.com/WebBluetoothCG/web-bluetooth/issues) y [retroalimentación sobre la implementación](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth).

Un subconjunto de la API Web Bluetooth está disponible en ChromeOS, Chrome para Android 6.0, Mac (Chrome 56) y Windows 10 (Chrome 70). Esto significa que debería poder [solicitar](#request) y [conectarse](#connect) a dispositivos Bluetooth de baja energía cercanos, [leer](#read)/[escribir](#write) características de Bluetooth, [recibir notificaciones GATT](#notifications), saber cuándo [se desconecta](#disconnect) un dispositivo Bluetooth e incluso [leer y escribir descriptores de Bluetooth](#descriptors). Consulte la tabla de [compatibilidad de navegadores](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility) de MDN para obtener más información.

Para Linux y versiones anteriores de Windows, habilite `#experimental-web-platform-features` en `about://flags`.

### Disponible para pruebas de origen

Para obtener la mayor retroalimentación posible de los desarrolladores que utilizan la API Web Bluetooth en el campo, Chrome ha agregado previamente esta función en Chrome 53 como una [prueba de origen](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) para ChromeOS, Android y Mac.

La prueba terminó con éxito en enero de 2017.

## Requerimientos de seguridad

Para comprender las compensaciones de seguridad, recomiendo la [publicación Web Bluetooth Security Model](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2) de Jeffrey Yasskin, un ingeniero de software del equipo de Chrome, que trabaja en la especificación Web Bluetooth API.

### Solo HTTPS

Debido a que esta API experimental es una nueva característica poderosa agregada a la web, solo está disponible para [contextos seguros](https://w3c.github.io/webappsec-secure-contexts/#intro). Esto significa que deberá compilar teniendo en cuenta la [TLS.](https://en.wikipedia.org/wiki/Transport_Layer_Security)

### Requerimiento de gestos de usuario

Como característica de seguridad, el descubrimiento de dispositivos Bluetooth con `navigator.bluetooth.requestDevice` debe activarse mediante [un gesto del usuario](https://html.spec.whatwg.org/multipage/interaction.html#activation), como un toque o un clic del mouse. Estamos hablando de atender a un evento [`pointerup`](https://developer.chrome.com/blog/pointer-events/), `click` y `touchend`.

```js
button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
});
```

## Entrar en el código

La API Web Bluetooth se basa en gran medida en JavaScript [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise). Si no está familiarizado con ello, consulte este excelente [tutorial de Promesas](/promises). Una cosa más, `() => {}` son simplemente [funciones de flecha de](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ECMAScript 2015.

### Solicitar dispositivos Bluetooth {: #request}

Esta versión de la especificación Web Bluetooth API permite que los sitios web, que se ejecutan en la función Central, se conecten a servidores GATT remotos a través de una conexión BLE. Admite la comunicación entre dispositivos que implementan un Bluetooth 4.0 o posterior.

Cuando un sitio web solicita acceso a dispositivos cercanos mediante `navigator.bluetooth.requestDevice`, el navegador brinda al usuario un selector de dispositivo donde puede elegir un dispositivo o simplemente cancelar la solicitud.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">Solicitud de usuario del dispositivo Bluetooth.</a></p>
  </figcaption></figure>

La función `navigator.bluetooth.requestDevice()` toma un objeto obligatorio que define filtros. Estos filtros se utilizan para devolver solo los dispositivos que coinciden con algunos servicios de Bluetooth GATT anunciados y/o el nombre del dispositivo.

#### Filtro de servicios

Por ejemplo, para solicitar dispositivos Bluetooth que anuncien el [servicio de batería Bluetooth GATT](https://www.bluetooth.com/specifications/gatt/) :

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Sin embargo, si su servicio Bluetooth GATT no está en la lista de [servicios Bluetooth GATT estandarizados](https://www.bluetooth.com/specifications/assigned-numbers/), puede proporcionar el UUID de Bluetooth completo o un formulario corto de 16 o 32 bits.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Filtro de nombre

También puede solicitar dispositivos Bluetooth en función del nombre del dispositivo que se anuncia con la clave de filtros `name`, o incluso un prefijo de este nombre con la clave de filtros `namePrefix`. Tenga en cuenta que, en este caso, también deberá definir la clave `optionalServices` para poder acceder a cualquier servicio no incluido en un filtro de servicio. Si no lo hace, obtendrá un error más adelante cuando intente acceder a ellos.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### Filtro de datos del fabricante

También es posible solicitar dispositivos Bluetooth en función de los datos específicos del fabricante que se anuncian con la clave de filtros de `manufacturerData`. Esta clave es una matriz de objetos con una clave de [identificación de empresa Bluetooth](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/) `companyIdentifier`. También puede proporcionar un prefijo de datos que filtre los datos del fabricante de los dispositivos Bluetooth que comienzan con él. Tenga en cuenta que también deberá definir la clave `optionalServices` para poder acceder a cualquier servicio no incluido en un filtro de servicio. Si no lo hace, obtendrá un error más adelante cuando intente acceder a ellos.

```js
// Filter Bluetooth devices from Google company with manufacturer data bytes
// that start with [0x01, 0x02].
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

También se puede usar una máscara con un prefijo de datos para hacer coincidir algunos patrones en los datos del fabricante. Consulte la [explicación de filtros de datos de Bluetooth](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md) para obtener más información.

{% Aside %} En el momento de escribir este artículo, la `manufacturerData` está disponible en Chrome 92. Si se desea compatibilidad con versiones anteriores de los navegadores más antiguos, debe proporcionar una opción de respaldo, ya que el filtro de datos del fabricante se considera vacío. Vea un [ejemplo](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ). {% endAside %}

#### Sin filtros

Finalmente, en lugar de `filters`, puede usar la clave `acceptAllDevices` para mostrar todos los dispositivos Bluetooth cercanos. También deberá definir la clave `optionalServices` para poder acceder a algunos servicios. Si no lo hace, obtendrá un error más adelante cuando intente acceder a ellos.

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %} Esto puede resultar en que se muestren un montón de dispositivos no relacionados en el selector y se desperdicie energía porque no hay filtros. Úselo con precaución. {% endAside %}

### Conectarse a un dispositivo Bluetooth {: #connect}

Entonces, ¿qué hacer ahora que tiene un `BluetoothDevice`? Conectémoslo al servidor Bluetooth remoto GATT que contiene el servicio y las definiciones de características.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // Human-readable name of the device.
  console.log(device.name);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### Leer una característica de Bluetooth {: #read}

Aquí estamos conectados al servidor GATT del dispositivo Bluetooth remoto. Ahora queremos obtener un servicio GATT primario y leer una característica que pertenece a este servicio. Intentemos, por ejemplo, leer el nivel de carga actual de la batería del dispositivo.

En el siguiente ejemplo, `battery_level` es la [característica de nivel de batería estandarizada](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Getting Battery Service…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Getting Battery Level Characteristic…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

Si utiliza una característica de Bluetooth GATT personalizado, puede proporcionar el UUID de Bluetooth completo o un formulario corto de 16 o 32 bits a `service.getCharacteristic`.

Tenga en cuenta que también se puede añadir un detector de evento `characteristicvaluechanged` en una característica para manejar la lectura de su valor. Consulte la [Muestra de lectura de valor de característica modificada](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) para ver otras opciones de cómo manejar también las próximas notificaciones del GATT.

```js
…
.then(characteristic => {
  // Set up event listener for when characteristic value changes.
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Reading Battery Level…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Battery percentage is ' + batteryLevel);
}
```

### Escribir en una característica de Bluetooth {: #write}

Escribir en una característica de Bluetooth GATT es tan fácil como leerla. Esta vez, usemos el Punto de control de frecuencia cardíaca para restablecer el valor del campo Energía gastada a 0 en un dispositivo de monitoreo de frecuencia cardíaca.

Prometo que no hay magia aquí. Todo se explica en la [página de características del punto de control de frecuencia cardíaca](https://www.bluetooth.com/specifications/gatt/).

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Writing 1 is the signal to reset energy expended.
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.error(error); });
```

### Reciba notificaciones del GATT {: #notifications}

Ahora, veamos cómo recibir notificaciones cuando cambie la característica de [medición de frecuencia cardíaca en el dispositivo:](https://www.bluetooth.com/specifications/gatt/)

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Notifications have been started.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Received ' + value);
  // TODO: Parse Heart Rate Measurement value.
  // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
}
```

Las [Notificaciones de ejemplo](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) muestran cómo detener las notificaciones con `stopNotifications()` y retirar adecuadamente el agregado detector de eventos agregado `characteristicvaluechanged`.

### Desconectarse de un dispositivo Bluetooth {: #disconnect}

Para proporcionar una mejor experiencia de usuario, es posible que desee escuchar los eventos de desconexión e invitar al usuario a volver a conectarse:

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // Set up event listener for when device gets disconnected.
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
}
```

También puede llamar a una función `device.gatt.disconnect()` para desconectar su aplicación web del dispositivo Bluetooth. Esto activará los detectores de eventos `gattserverdisconnected` existentes. Tenga en cuenta que NO detendrá la comunicación del dispositivo Bluetooth si otra aplicación ya se está comunicando con el dispositivo Bluetooth. Consulte la [Muestra de desconexión](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) del dispositivo y la [Muestra de reconexión automática](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) para saber más.

{% Aside 'caution' %} Los atributos, servicios, características, etc. de Bluetooth GATT se invalidan cuando un dispositivo se desconecta. Esto significa que su código siempre debe recuperar (a través de `getPrimaryService(s)`, `getCharacteristic(s)` , etc.) estos atributos después de volver a conectarse. {% endAside %}

### Leer y escribir descriptores de Bluetooth {: #descriptors}

Los descriptores de Bluetooth GATT son atributos que describen un valor característico. Puede leerlos y escribirlos de forma similar a las características de Bluetooth GATT.

Veamos, por ejemplo, cómo leer la descripción del usuario del intervalo de medición del termómetro de salud del dispositivo.

En el siguiente ejemplo, `health_thermometer` es el [servicio de Salud Termómetro](https://www.bluetooth.com/specifications/gatt/), `measurement_interval` la [característica Intervalo de medición](https://www.bluetooth.com/specifications/gatt/), y `gatt.characteristic_user_description` el [descriptor de característica de descripción de usuario](https://www.bluetooth.com/specifications/assigned-numbers/).

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`User Description: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
```

Ahora que hemos leído la descripción del usuario del intervalo de medición del termómetro de salud del dispositivo, veamos cómo actualizarlo y escribir un valor personalizado.

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Defines the time between measurements.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## Muestras, demostraciones y codelabs

Todas las [muestras de Web Bluetooth](https://googlechrome.github.io/samples/web-bluetooth/index.html) que se presentan a continuación se han probado con éxito. Para disfrutar de estas muestras al máximo, es recomendable que instale la [aplicación de Android BLE Peripheral Simulator](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral), que simula un periférico de BLE con un servicio de batería, un servicio de frecuencia cardíaca o un servicio de termómetro de salud.

### Principiante

- [Información del dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-info.html): recupere información básica del dispositivo desde un dispositivo BLE.
- [Nivel de la batería](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html): recupere la información de la batería de un dispositivo BLE que anuncie información sobre la batería.
- [Restablecer energía](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html): restablezca la energía gastada por un dispositivo BLE que anuncie la frecuencia cardíaca.
- [Propiedades de característica](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html): muestra todas las propiedades de una característica específica de un dispositivo BLE.
- [Notificaciones](https://googlechrome.github.io/samples/web-bluetooth/notifications.html): inicie y detenga las notificaciones características de un dispositivo BLE.
- [Desconexión del dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html): desconecte y reciba una notificación de desconexión de un dispositivo BLE después de conectarse a él.
- [Obtener características](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html): obtenga todas las características de un servicio anunciado desde un dispositivo BLE.
- [Obtener descriptores](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html): obtenga los descriptores de todas las características de un servicio anunciado desde un dispositivo BLE.
- [Filtro de datos del fabricante](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html): recupere información básica del dispositivo de un dispositivo BLE que coincida con los datos del fabricante.

### Combinando múltiples operaciones

- [Características de GAP](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html): obtenga todas las características de GAP de un dispositivo BLE.
- [Características de información del dispositivo](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html): obtenga todas las características de información del dispositivo de un dispositivo BLE.
- [Pérdida de enlace](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html): establezca la característica de nivel de alerta de un dispositivo BLE (readValue y writeValue).
- [Descubrir servicios y características](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html): descubra todos los servicios primarios accesibles y sus características desde un dispositivo BLE.
- [Reconexión automática](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html): vuelva a conectarse a un dispositivo BLE desconectado mediante un algoritmo de retroceso exponencial.
- [Leer valor de característica cambiado](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html): lea el nivel de la batería y reciba notificaciones de cambios desde un dispositivo BLE.
- [Leer descriptores](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html): lea todos los descriptores de características de un servicio desde un dispositivo BLE.
- [Escribir descriptor](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html): escriba en el descriptor "Característica de descripción de usuario" en un dispositivo BLE.

Consulte nuestras [demostraciones seleccionadas de Web Bluetooth](https://github.com/WebBluetoothCG/demos) y también los [laboratorios de código Web Bluetooth oficiales](https://github.com/search?q=org%3Agooglecodelabs+bluetooth).

## Bibliotecas

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils) es un módulo npm que agrega algunas funciones de conveniencia a la API.
- Hay una biblioteca shim de API Web Bluetooth disponible en [noble](https://github.com/sandeepmistry/noble), el módulo central BLE de Node.js más popular. Esto le permite usar funciones de webpack/browserify en noble sin la necesidad de un servidor WebSocket u otros complementos.
- [angular-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth) es un módulo para [Angular](https://angularjs.org) que abstrae todo el texto estándar necesario para configurar la API Web Bluetooth.

## Herramientas

- [Introducción a Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator) es una aplicación web sencilla que generará todo el código estándar de JavaScript para comenzar a interactuar con un dispositivo Bluetooth. Ingrese un nombre de dispositivo, un servicio, una característica, defina sus propiedades y listo.
- Si ya es un desarrollador de Bluetooth, el [complemento Web Bluetooth Developer Studio](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin) también generará el código JavaScript Web Bluetooth para su dispositivo Bluetooth.

## Consejos

Hay una página de **Bluetooth Internals** disponible en Chrome en `about://bluetooth-internals` para que pueda inspeccionar todo sobre los dispositivos Bluetooth cercanos: estado, servicios, características y descriptores.

<figure>{% Img src ="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt = "Captura de pantalla de la página interna para depurar Bluetooth en Chrome", width="800", height="572" %}<figcaption> Página interna en Chrome para depurar dispositivos Bluetooth.</figcaption></figure>

Es recomendable también que consulte la página oficial [Cómo presentar errores de Web Bluetooth](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs), ya que la depuración de Bluetooth puede ser difícil a veces.

{% Aside 'caution' %} Leer y escribir en características de Bluetooth en paralelo puede generar errores según la plataforma. Es altamente sugerido que ponga en cola manualmente las solicitudes de operación del GATT cuando sea apropiado. Consulte ["Operación del GATT en curso: ¿cómo manejarla?"](https://github.com/WebBluetoothCG/web-bluetooth/issues/188). {% endAside %}

## Qué sigue

Primero, verifique el [estado de implementación del navegador y la plataforma](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md) para saber qué partes de la API Web Bluetooth se están implementando actualmente.

Aunque todavía está incompleto, aquí hay un adelanto de qué esperar en el futuro cercano:

- [La búsqueda de anuncios BLE cercanos](https://github.com/WebBluetoothCG/web-bluetooth/pull/239) se realizará con `navigator.bluetooth.requestLEScan()`.
- Un nuevo evento `serviceadded` rastreará los servicios de Bluetooth GATT recién descubiertos, mientras que el evento `serviceremoved` rastreará los eliminados. Un nuevo evento `servicechanged` se activará cuando cualquier característica y/o descriptor sea agregado o removido de un servicio de Bluetooth GATT.

### Apoye la API

¿Está pensando en utilizar la API Web Bluetooth? Su soporte público ayuda al equipo de Chrome a priorizar las funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

Envíe un tweet a [@ChromiumDev](https://twitter.com/ChromiumDev) usando el hashtag [`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live) y háganos saber dónde y cómo lo está usando.

## Recursos

- Desbordamiento de pila: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Estado de la función de Chrome: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Errores de implementación de Chrome: [https://crbug.com/?q=component:Blink&gt;Bluetooth](https://crbug.com/?q=component:Blink%3EBluetooth)
- Especificaciones de Bluetooth web: [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- Problemas con las especificaciones: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- Aplicación BLE Peripheral Simulator: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ'%}

## Agradecimientos

Gracias a [Kayce Basques](https://github.com/kaycebasques) por revisar este artículo. Imagen de héroe de [SparkFun Electronics de Boulder, EE. UU.](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg)
