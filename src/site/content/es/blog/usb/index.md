---
title: Acceder a dispositivos USB en la web
subhead: |2-

  La API WebUSB hace que el uso de dispositivos USB sea más seguro y más fácil de usar al llevarlos a la Web.
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Una foto de una placa Arduino Micro
description: |2-

  La API WebUSB hace que el uso de dispositivos USB sea más seguro y más fácil de usar al llevarlos a la Web.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

Al decir simple y llanamente "USB", es muy probable que piense inmediatamente en teclados, mouses, audio, video y dispositivos de almacenamiento. Tiene razón, pero encontrará otros tipos de dispositivos de bus serie universal (USB) por ahí.

Estos dispositivos USB no estandarizados requieren que los proveedores de hardware escriban controladores y SDK específicos de la plataforma para que usted (el desarrollador) pueda aprovecharlos. Lamentablemente, este código específico de la plataforma históricamente ha impedido que estos dispositivos sean utilizados por la Web. Y esa es una de las razones por las que se ha creado la API WebUSB: para proporcionar una forma de exponer los servicios de dispositivos USB a la Web. Con esta API, los fabricantes de hardware podrán crear SDK de JavaScript multiplataforma para sus dispositivos. Pero lo más importante es que esto hará **que el USB sea más seguro y más fácil de usar al llevarlo a la Web**.

Veamos el comportamiento que podría esperar con la API WebUSB:

1. Compre un dispositivo USB.
2. Conéctelo a su computadora. Aparece una notificación de inmediato, con el sitio web correcto al que debe ir para este dispositivo.
3. Haga clic en la notificación. ¡El sitio web está ahí y listo para usar!
4. Haga clic para conectarse y aparecerá un selector de dispositivo USB en Chrome, donde puede escoger su dispositivo.

¡Tará!

¿Cómo sería este procedimiento sin la API WebUSB?

1. Instale una aplicación específica para la plataforma.
2. Incluso si es compatible con mi sistema operativo, verificar que haya descargado la aplicación correcta.
3. Instalae el asunto. Si tiene suerte, no recibirá mensajes de sistema operativo ni ventanas emergentes que le adviertan sobre la instalación de controladores/aplicaciones de Internet. Si no tiene suerte, los controladores instalados o las aplicaciones no funcionan correctamente y dañan su computadora. (Recuerde, la web está diseñada para [albergar sitios web que funcionan mal](https://www.youtube.com/watch?v=29e0CtgXZSI)).
4. Si solo usa la función una vez, el código permanece en su computadora hasta que se le ocurra eliminarlo (en la Web, finalmente se recupera el espacio no utilizado).

## Antes de empezar

Este artículo asume que tiene algunos conocimientos básicos sobre cómo funciona el USB. Si no es así, recomiendo leer [USB en pocas palabras (USB in a Nutshell)](http://www.beyondlogic.org/usbnutshell). Para obtener información general sobre USB, consulte las [especificaciones oficiales de USB](https://www.usb.org/).

La [API WebUSB](https://wicg.github.io/webusb/) está disponible en Chrome 61.

### Disponible para pruebas de origen

Para obtener la mayor cantidad de comentarios posibles de los desarrolladores que utilizan la API WebUSB en el campo, anteriormente agregamos esta función en Chrome 54 y Chrome 57 como una [prueba de origen](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

La última prueba finalizó con éxito en septiembre de 2017.

## Privacidad y seguridad

### Solo HTTPS

Debido al poder de esta característica, solo funciona en [contextos seguros](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro). Esto significa que deberá compilar teniendo en cuenta el protocolo [TLS.](https://en.wikipedia.org/wiki/Transport_Layer_Security)

### Requiere gestos del usuario

Como medida de seguridad, `navigator.usb.requestDevice()` solo puede ejecutarsemediante un gesto del usuario, como un toque o un clic del mouse.

### Política de funciones

Una [política de funciones](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy) es un mecanismo que permite a los desarrolladores habilitar y deshabilitar de forma selectiva varias funciones y API del navegador. Se puede definir mediante un encabezado HTTP o un atributo "allow" de iframe.

Puede definir una política de funciones que controle si el atributo usb está expuesto en el objeto Navigator o, en otras palabras, si permite WebUSB.

A continuación se muestra un ejemplo de una política de encabezado donde no se permite WebUSB:

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

A continuación, se muestra otro ejemplo de una política de contenedores en la que se permite USB:

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## Empecemos a codificar

La API WebUSB se basa en gran medida en [Promesas (Promises)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) de JavaScript. Si no está familiarizado con estas, consulte este excelente [tutorial de Promesas](/promises). Una cosa más, `() => {}` son simplemente [funciones de flecha de](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ECMAScript 2015.

### Obtenga acceso a dispositivos USB

Puede solicitar al usuario que seleccione un único dispositivo USB conectado mediante `navigator.usb.requestDevice()` o ejecutar `navigator.usb.getDevices()` para obtener una lista de todos los dispositivos USB conectados a los que el origen tiene acceso.

La función `navigator.usb.requestDevice()` toma un objeto JavaScript obligatorio que define `filters`. Estos filtros se utilizan para emparejar cualquier dispositivo USB con los identificadores `vendorId` del proveedor y, opcionalmente, los (`productId`) del producto. Las claves `classCode`, `protocolCode`, `serialNumber` y `subclassCode` también se pueden definir allí.

<figure>{% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Captura de pantalla del mensaje de usuario del dispositivo USB en Chrome", width="800", height="533" %}<figcaption>Mensaje de usuario del dispositivo USB.</figcaption></figure>

Por ejemplo, aquí se explica cómo obtener acceso a un dispositivo Arduino conectado configurado para permitir el origen.

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

Antes de que preguntes, no se me ocurrió mágicamente este número hexadecimal `0x2341`. Simplemente busqué la palabra "Arduino" en esta [lista de ID de USB](http://www.linux-usb.org/usb.ids).

El `device` USB devuelto en la promesa cumplida anterior tiene información básica pero importante sobre el dispositivo, como la versión USB compatible, el tamaño máximo de paquete, el proveedor y los ID de producto, la cantidad de configuraciones posibles que puede tener el dispositivo. Básicamente, contiene todos los campos del [descriptor USB](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors) del dispositivo.

Por cierto, si un dispositivo USB anuncia su [compatibilidad con WebUSB](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor), además de definir una URL de página de destino, Chrome mostrará una notificación persistente cuando el dispositivo USB esté conectado. Al hacer clic en esta notificación, se abrirá la página de destino.

<figure>{% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Captura de pantalla de la notificación WebUSB en Chrome", width="800", height="450" %}<figcaption> Notificación WebUSB.</figcaption></figure>

A partir de allí, puede ejecutar fácilmente `navigator.usb.getDevices()` y acceder a su dispositivo Arduino como se muestra a continuación.

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Comuníquese con una placa USB Arduino

Bien, ahora veamos qué tan fácil es comunicarse desde una placa Arduino compatible con WebUSB a través del puerto USB. Consulte las instrucciones en [https://github.com/webusb/arduino](https://github.com/webusb/arduino) para habilitar sus [bocetos](http://www.arduino.cc/en/Tutorial/Sketch) mediante WebUSB.

No se preocupe, cubriré todos los métodos de dispositivo WebUSB que se mencionan a continuación más adelante en este artículo.

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // Begin a session.
  })
.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
.then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Ready to receive data
.then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
.then(result => {
  const decoder = new TextDecoder();
  console.log('Received: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

Tenga en cuenta que la biblioteca WebUSB que estoy usando aquí solo implementa un protocolo de ejemplo (basado en el protocolo serie USB estándar) y que los fabricantes pueden crear cualquier conjunto y tipos de endpoints que deseen. Las transferencias de control son especialmente agradables para comandos de configuración pequeños, ya que tienen prioridad de bus y tienen una estructura bien definida.

Y aquí está el boceto que se ha subido a la placa Arduino.

```arduino
// Third-party WebUSB Arduino library
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos");

#define Serial WebUSBSerial

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect.
  }
  Serial.write("WebUSB FTW!");
  Serial.flush();
}

void loop() {
  // Nothing here for now.
}
```

La [biblioteca WebUSB Arduino](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB) de terceros utilizada en el código de muestra anterior hace básicamente dos cosas:

- El dispositivo actúa como un dispositivo WebUSB que permite a Chrome leer la [URL de la página de destino](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor).
- Expone una API serial WebUSB que puede usar para anular la predeterminada.

Veamos el código JavaScript nuevamente. Una vez obtenido el `device` escogido por el usuario, `device.open()` ejecuta todos los pasos específicos de la plataforma para iniciar una sesión con el dispositivo USB. Luego, es necesario seleccionar una configuración USB disponible con `device.selectConfiguration()`. Recuerde que una configuración especifica cómo se alimenta el dispositivo, su consumo máximo de energía y su número de interfaces. Hablando de interfaces, también es necesario solicitar acceso exclusivo con `device.claimInterface()`, ya que los datos solo se pueden transferir a una interfaz o endpoints asociados cuando se reclama la interfaz. Finalmente, es necesario ejecutar `device.controlTransferOut()` para configurar el dispositivo Arduino con los comandos apropiados para comunicarse a través de la API WebUSB Serial.

A partir de aquí, `device.transferIn()` realiza una transferencia masiva al dispositivo para informarle que el host está listo para recibir datos masivos. Luego, la promesa se cumple con un objeto de `result` que contiene `datos` de [DataView](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) que deben analizarse adecuadamente.

Si está familiarizado con el USB, todo esto le resultará bastante habitual.

### Quiero más

La API WebUSB le permite interactuar con todos los tipos de transferencias y endpoints USB:

- Las transferencias de CONTROL, que se utilizan para enviar o recibir configuraciones o parámetros de comando a un dispositivo USB, se manejan con `controlTransferIn(setup, length)` y `controlTransferOut(setup, data)`.
- Las transferencias INTERRUPT, utilizadas para una pequeña cantidad de datos urgentes, se manejan con los mismos métodos que las transferencias BULK con `transferIn(endpointNumber, length)` y `transferOut(endpointNumber, data)`.
- Las transferencias ISOCHRONOUS, utilizadas para flujos de datos como video y sonido, se manejan con `isochronousTransferIn(endpointNumber, packetLengths)` y `isochronousTransferOut(endpointNumber, data, packetLengths)` .
- Las transferencias BULK, que se utilizan para transferir una gran cantidad de datos no urgentes de manera confiable, se manejan con `transferIn(endpointNumber, length)` y `transferOut(endpointNumber, data)`.

Es posible que también desee echar un vistazo al [proyecto WebLight de](https://github.com/sowbug/weblight) Mike Tsao, que proporciona un ejemplo básico de la construcción de un dispositivo LED controlado por USB diseñado para la API WebUSB (sin usar un Arduino en este caso). Encontrarás hardware, software y firmware.

## Consejos

La depuración de USB en Chrome es más fácil con la página interna `about://device-log` donde puede ver todos los eventos relacionados con el dispositivo USB en un solo lugar.

<figure>{% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Captura de pantalla de la página de registro del dispositivo para depurar WebUSB en Chrome", width="800", height="442", clase="w-captura de pantalla" %}<figcaption>Página de registro del dispositivo en Chrome para depurar la API WebUSB.</figcaption></figure>

La página interna `about://usb-internals` también es útil y le permite simular la conexión y desconexión de dispositivos WebUSB virtuales. Esto es útil para realizar pruebas de IU sin hardware real.

<figure>{% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Captura de pantalla de la página interna para depurar WebUSB en Chrome", width="800", height="294" %}<figcaption> Página interna en Chrome para depurar la API WebUSB.</figcaption></figure>

En la mayoría de los sistemas Linux, los dispositivos USB se asignan con permisos de solo lectura de forma predeterminada. Para permitir que Chrome abra un dispositivo USB, deberá agregar una nueva [regla de udev](https://www.freedesktop.org/software/systemd/man/udev.html). Cree un archivo en `/etc/udev/rules.d/50-yourdevicename.rules` con el siguiente contenido:

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

donde `[yourdevicevendor]` es `2341` si su dispositivo es un Arduino, por ejemplo. También puede utilizarse `ATTR{idProduct}` para una regla más específica. Asegúrese de que su `user` sea [miembro](https://wiki.debian.org/SystemGroups) del grupo `plugdev` Luego, simplemente vuelva a conectar su dispositivo.

{% Aside  %} Los descriptores de Microsoft OS 2.0 utilizados por los ejemplos de Arduino solo funcionan en Windows 8.1 y versiones posteriores. Sin eso, el soporte de Windows aún requiere la instalación manual de un archivo INF. {% endAside %}

## Recursos

- Stack Overflow: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- Especificaciones de API WebUSB: [http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Estado de la función en Chrome: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- Problemas de especificaciones: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- Errores de implementación: [http://crbug.com?q=component:Blink&gt;USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: [#webusb](irc://irc.w3.org:6665/#webusb) en el IRC del W3C
- Lista de correo de WICG: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- Proyecto WebLight: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

Envíe un tweet a [@ChromiumDev] [cr-dev-twitter] usando el hashtag [`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live) y déjanos saber dónde y cómo lo está usando.

## Agradecimientos

Gracias a [Joe Medley](https://github.com/jpmedley) por la revisión este artículo.
