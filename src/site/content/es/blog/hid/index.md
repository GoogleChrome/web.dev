---
layout: post
title: Conexión a dispositivos HID poco comunes
subhead: |2-

  La API WebHID permite que los sitios web accedan a teclados auxiliares alternativos y controles de juego exóticos.
authors:
  - beaufortfrancois
date: 2020-09-15
updated: 2021-02-27
hero: image/admin/05NRg2Lw0w5Rv6TToabY.jpg
thumbnail: image/admin/AfLwyZZbL7bh4S4RikYi.jpg
alt: Foto de Elgato Stream Deck.
description: |2

  La API de WebHID permite que los sitios web accedan a teclados auxiliares alternativos y gamepads exóticos.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webhid
---

{% Aside 'success' %} La API WebHID, parte del [proyecto de capacidades](https://developer.chrome.com/blog/fugu-status/), se lanzó en Chrome 89. {% endAside %}

Existe una larga lista de dispositivos de interfaz humana (HID), como teclados alternativos o controles de juego exóticos, que son demasiado nuevos, demasiado antiguos o poco comunes para que los controladores de dispositivos de los sistemas puedan acceder a ellos. La API WebHID resuelve esto dando una forma de implementar la lógica específica del dispositivo en JavaScript.

## Casos de uso sugeridos {: #use-cases }

Un dispositivo HID toma la entrada o les da una salida a los seres humanos. Ejemplos de dispositivos pueden ser teclados, dispositivos señaladores (mouse, pantallas táctiles, etc.) y controles de juego. El [protocolo HID](https://www.usb.org/hid) hace posible acceder a estos dispositivos en computadoras de escritorio utilizando controladores del sistema operativo. La plataforma web admite dispositivos HID basándose en estos controladores.

La imposibilidad de acceder a dispositivos HID poco comunes es particularmente dolorosa cuando se trata de teclados auxiliares alternativos (por ejemplo, [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck), [auriculares Jabra](https://www.jabra.com/business/office-headsets), [teclas X](https://xkeys.com/xkeys.html)) y compatibilidad con controles de juego exóticos. Los controles de juego diseñados para computadoras de escritorio a menudo usan HID para las entradas del control (botones, palancas, disparadores) y salidas (LED, vibración). Desafortunadamente, las entradas y salidas del control no están bien estandarizadas y los navegadores web a menudo requieren una lógica personalizada para dispositivos específicos. Esto es insostenible y da como resultado un soporte deficiente para la larga fila de dispositivos más antiguos y poco comunes. También hace que el navegador dependa de peculiaridades en el comportamiento de dispositivos específicos.

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
<td data-md-type="table_cell"><a href="https://github.com/WICG/webhid/blob/master/EXPLAINER.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/webhid/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopilar comentarios e iterar en el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/register_trial/1074108511127863297" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lanzamiento</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Completo</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Terminología {: #terminology }

HID consta de dos conceptos fundamentales: informes y descriptores de informes. Los informes son los datos que se intercambian entre un dispositivo y un cliente de software. El descriptor de informe describe el formato y el significado de los datos que admite el dispositivo.

Un HID (Dispositivo de interfaz humana) es un tipo de dispositivo que recibe entradas de personas o les proporciona salidas. También se refiere al protocolo HID, un estándar para la comunicación bidireccional entre un host y un dispositivo que está diseñado para simplificar el procedimiento de instalación. El protocolo HID se desarrolló originalmente para dispositivos USB, pero desde entonces se ha implementado en muchos otros protocolos, incluido Bluetooth.

Las aplicaciones y los dispositivos HID intercambian datos binarios a través de tres tipos de informes:

<div>
  <table>
    <thead>
      <tr>
        <th>Tipo de informe</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Informe de entrada</td>
        <td>Datos que se envían desde el dispositivo a la aplicación (por ejemplo, se presiona un botón).</td>
      </tr>
      <tr>
        <td>Informe de salida</td>
        <td>Datos que se envían desde la aplicación al dispositivo (por ejemplo, una solicitud para encender la luz de fondo del teclado).</td>
      </tr>
      <tr>
        <td>Informe de funciones</td>
        <td>Datos que pueden enviarse en cualquier dirección. El formato es específico del dispositivo.</td>
      </tr>
    </tbody>
  </table>
</div>

Un descriptor de informe describe el formato binario de los informes admitidos por el dispositivo. Su estructura es jerárquica y puede agrupar informes como colecciones distintas dentro de la colección de nivel superior. El [formato](https://gist.github.com/beaufortfrancois/583424dfef66be1ade86231fd1a260c7) del descriptor está definido por la especificación HID.

Un uso de HID es un valor numérico que se refiere a una entrada o salida estandarizada. Los valores de uso permiten que un dispositivo describa el uso previsto del dispositivo y el propósito de cada campo en sus informes. Por ejemplo, se define uno para el botón izquierdo de un mouse. Los usos también se organizan en páginas de uso, que proporcionan una indicación de la categoría de alto nivel del dispositivo o informe.

## Uso de la API de WebHID {: #use }

### Detección de características {: #feature-detection }

Para comprobar si la API WebHID es compatible, utilice:

```js
if ("hid" in navigator) {
  // The WebHID API is supported.
}
```

### Abra una conexión HID {: #open }

La API WebHID es asincrónica por diseño para evitar que la interfaz de usuario del sitio web se bloquee cuando se espera una entrada. Esto es importante porque los datos HID se pueden recibir en cualquier momento, lo que requiere una forma de escucharlos.

Para abrir una conexión HID, primero acceda a un objeto `HIDDevice`. Para ello, puede pedirle al usuario que seleccione un dispositivo llamando a `navigator.hid.requestDevice()`, o elegir uno de `navigator.hid.getDevices()` que devuelve una lista de dispositivos a los que el sitio web ha tenido acceso previamente.

La función `navigator.hid.requestDevice()` toma un objeto obligatorio que define filtros. Se utilizan para emparejar cualquier dispositivo conectado con un identificador de proveedor USB (`vendorId`), un identificador de producto USB (`productId`), un valor de página de uso (`usagePage`) y un valor de uso `usage`. Puede obtenerlos del [repositorio de ID de USB](http://www.linux-usb.org/usb-ids.html) y del [documento de tablas de uso de HID](https://usb.org/document-library/hid-usage-tables-12).

Los múltiples objetos `HIDDevice` devueltos por esta función representan múltiples interfaces HID en el mismo dispositivo físico.

```js
// Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
const filters = [
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2006 // Joy-Con Left
  },
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2007 // Joy-Con Right
  }
];

// Prompt user to select a Joy-Con device.
const [device] = await navigator.hid.requestDevice({ filters });
```

```js
// Get all devices the user has previously granted the website access to.
const devices = await navigator.hid.getDevices();
```

<figure>{% Img src="image/admin/gaZo8LxG3Y8eU2VirlZ4.jpg", alt="Captura de pantalla de un mensaje de dispositivo HID en un sitio web.", width="800", height="513" %}<figcaption> Mensaje de usuario para seleccionar un Joy-Con de Nintendo Switch.</figcaption></figure>

Un objeto `HIDDevice` contiene identificadores de producto y proveedor USB para la identificación del dispositivo. Su atributo `collections` se inicializa con una descripción jerárquica de los formatos de informe del dispositivo.

```js
for (let collection of device.collections) {
  // A HID collection includes usage, usage page, reports, and subcollections.
  console.log(`Usage: ${collection.usage}`);
  console.log(`Usage page: ${collection.usagePage}`);

  for (let inputReport of collection.inputReports) {
    console.log(`Input report: ${inputReport.reportId}`);
    // Loop through inputReport.items
  }

  for (let outputReport of collection.outputReports) {
    console.log(`Output report: ${outputReport.reportId}`);
    // Loop through outputReport.items
  }

  for (let featureReport of collection.featureReports) {
    console.log(`Feature report: ${featureReport.reportId}`);
    // Loop through featureReport.items
  }

  // Loop through subcollections with collection.children
}
```

Los dispositivos `HIDDevice` se devuelven por default en un estado "cerrado" y deben abrirse llamando a `open()` antes de que se puedan enviar o recibir datos.

```js
// Wait for the HID connection to open before sending/receiving data.
await device.open();
```

### Reciba informes de entrada {: #receive-input-reports }

Una vez que se ha establecido la conexión HID, puede manejar los informes de entrada entrantes escuchando los `"inputreport"` del dispositivo. Esos eventos contienen los datos HID como un objeto [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) (`data`), el dispositivo HID al que pertenece (`device`) y el ID de informe de 8 bits asociado con el informe de entrada (`reportId`).

<figure>{% Img src="image/admin/Hr4EXZcunl7r2TJwVvQ8.jpg", alt="Foto de Nintendo switch rojo y azul.", width="800", height="575" %}<figcaption> Dispositivos Nintendo Switch Joy-Con.</figcaption></figure>

Continuando con el ejemplo anterior, el código a continuación le muestra cómo detectar qué botón ha presionado el usuario en un dispositivo Joy-Con Right para que, con suerte, pueda probarlo en casa.

```js
device.addEventListener("inputreport", event => {
  const { data, device, reportId } = event;

  // Handle only the Joy-Con Right device and a specific report ID.
  if (device.productId !== 0x2007 && reportId !== 0x3f) return;

  const value = data.getUint8(0);
  if (value === 0) return;

  const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
  console.log(`User pressed button ${someButtons[value]}.`);
});
```

{% Glitch { id: 'webhid-joycon-button', path: 'script.js', height: 480, allow: 'hid' } %}

### Envíe informes de salida {: #send-output-reports }

Para enviar un informe de salida a un dispositivo HID, pase el ID de informe de 8 bits asociado con el informe de salida (`reportId`) y bytes como un [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) (`data`) a `device.sendReport()`. La promesa devuelta se resuelve una vez que se ha enviado el informe. Si el dispositivo HID no utiliza IDs de informe, ponga `reportId` a 0.

El siguiente ejemplo aplica a un dispositivo Joy-Con y le muestra cómo hacerlo vibrar con los informes de salida.

```js
// First, send a command to enable vibration.
// Magical bytes come from https://github.com/mzyy94/joycon-toolweb
const enableVibrationData = [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01];
await device.sendReport(0x01, new Uint8Array(enableVibrationData));

// Then, send a command to make the Joy-Con device rumble.
// Actual bytes are available in the sample below.
const rumbleData = [ /* ... */ ];
await device.sendReport(0x10, new Uint8Array(rumbleData));
```

{% Glitch { id: 'webhid-joycon-rumble', path: 'script.js', height: 480, allow: 'hid' } %}

### Envíe y reciba informes de características {: #feature-reports }

Los informes de características son el único tipo de informes de datos HID que pueden viajar en ambas direcciones. Permiten que los dispositivos y aplicaciones HID intercambien datos HID no estandarizados. A diferencia de los informes de entrada y salida, la aplicación no recibe ni envía informes de características de forma regular.

<figure>{% Img src="image/admin/QJiKwOCVAtUsAWUnqLxi.jpg", alt="Foto de computadora portátil negra y plateada.", width="800", height="575" %}<figcaption> Teclado de computadora portátil</figcaption></figure>

Para enviar un informe de características a un dispositivo HID, pase el ID de informe de 8 bits asociado con el informe de características (`reportId`) y bytes como un [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource) (`data`) a `device.sendFeatureReport()`. La promesa devuelta se resuelve una vez que se ha enviado el informe. Si el dispositivo HID no utiliza IDs de informe, ponga `reportId` a 0.

El siguiente ejemplo ilustra el uso de informes de características mostrándole cómo enviar solicitud a un dispositivo de retroiluminación de teclado de Apple, abrirlo y hacer que parpadee.

```js
const waitFor = duration => new Promise(r => setTimeout(r, duration));

// Prompt user to select an Apple Keyboard Backlight device.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0x05ac, usage: 0x0f, usagePage: 0xff00 }]
});

// Wait for the HID connection to open.
await device.open();

// Blink!
const reportId = 1;
for (let i = 0; i < 10; i++) {
  // Turn off
  await device.sendFeatureReport(reportId, Uint32Array.from([0, 0]));
  await waitFor(100);
  // Turn on
  await device.sendFeatureReport(reportId, Uint32Array.from([512, 0]));
  await waitFor(100);
}
```

{% Glitch { id: 'webhid-apple-keyboard-backlight', path: 'script.js', height: 480, allow: 'hid' } %}

Para recibir un informe de características de un dispositivo HID, pase el ID de informe de 8 bits asociado con el informe de características (`reportId`) a `device.receiveFeatureReport()`. La promesa devuelta se resuelve con un objeto [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) con el contenido del informe de características. Si el dispositivo HID no utiliza IDs de informe, ponga `reportId` a 0.

```js
// Request feature report.
const dataView = await device.receiveFeatureReport(/* reportId= */ 1);

// Read feature report contents with dataView.getInt8(), getUint8(), etc...
```

### Escuche la conexión y la desconexión {: #connection-disconnection }

Cuando el sitio web tiene permiso para acceder a un dispositivo HID, puede recibir activamente eventos de conexión y desconexión escuchando eventos `"connect"` y `"disconnect"`.

```js
navigator.hid.addEventListener("connect", event => {
  // Automatically open event.device or warn user a device is available.
});

navigator.hid.addEventListener("disconnect", event => {
  // Remove |event.device| from the UI.
});
```

## Consejos para desarrolladores {: #dev-tips }

La depuración de HID en Chrome es fácil con la página interna, `about://device-log`, donde puede ver todos los eventos relacionados con dispositivos HID y USB en un solo lugar.

<figure>{% Img src="image/admin/zwpr1W7oDsRw0DKsFQ9D.jpg", alt="Captura de pantalla de la página interna para depurar HID.", width="800", height="575" %}<figcaption> Página interna en Chrome para depurar HID.</figcaption></figure>

## Compatibilidad con navegadores {: #browser-support }

La API WebHID está disponible en todas las plataformas de escritorio (ChromeOS, Linux, macOS y Windows) en Chrome 89.

## Demostraciones {: #demos }

Algunas demostraciones de WebHID se enumeran en [web.dev/hid-examples](/hid-examples/). ¡Deles un vistazo!

## Seguridad y privacidad {: #security-privacy }

Los autores de especificaciones han diseñado e implementado la API WebHID utilizando los principios básicos definidos en [Control del acceso a las funciones de la plataforma web de gran alcance](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluido el control del usuario, la transparencia y la ergonomía. La capacidad de usar esta API está controlada principalmente por un modelo de permisos que otorga acceso a un solo dispositivo HID a la vez. En respuesta a un mensaje de usuario, el usuario debe tomar medidas activas para seleccionar un dispositivo HID en particular.

Para comprender las compensaciones de seguridad, consulte la sección [Consideraciones de seguridad y privacidad](https://wicg.github.io/webhid/#security-and-privacy) de la especificación de WebHID.

Además de esto, Chrome inspecciona el uso de cada colección de nivel superior y si una colección de nivel superior tiene un uso protegido (por ejemplo, teclado genérico, mouse), entonces un sitio web no podrá enviar ni recibir ningún informe definido en esa colección. La lista completa de usos protegidos está [disponible públicamente](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_usage_and_page.cc).

Tenga en cuenta que los dispositivos HID sensibles a la seguridad (como los dispositivos FIDO HID utilizados para una autenticación más sólida) también están bloqueados en Chrome. Consulte los archivos [lista de bloqueo USB](https://source.chromium.org/chromium/chromium/src/+/master:chrome/browser/usb/usb_blocklist.cc) y [lista de bloqueo HID](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_blocklist.cc).

## Retroalimentación {: #feedback }

Al equipo de Chrome le encantaría conocer sus pensamientos y experiencias con la API WebHID.

### Cuéntenos sobre el diseño de la API

¿Hay algo en la API que no funcione como se esperaba? ¿O faltan métodos o propiedades que necesita para implementar su idea?

Reporte un problema de especificaciones en el [repositorio  GitHub de la API WebHID](https://github.com/wicg/webhid/issues) o agregue sus comentarios a un reporte existente.

### Reporte problemas con la implementación

¿Encontró un error con la implementación en Chrome? ¿O la implementación es diferente de la especificación?

Reporte un error en [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EHID). Asegúrese de incluir todos los detalles que pueda, dé instrucciones sencillas para reproducir el error y configure los *Componentes* como `Blink>HID`. [Glitch](https://glitch.com) funciona muy bien para compartir reproducciones rápidas y fáciles.

### Muestre apoyo

¿Está pensando en utilizar la API WebHID? Su soporte público ayuda al equipo de Chrome a priorizar las funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

Envíe un tweet a [@ChromiumDev](https://twitter.com/chromiumdev) usando el hashtag [`#WebHID`](https://twitter.com/search?q=%23WebHID&src=typed_query&f=live) y háganos saber dónde y cómo lo está usando.

## Enlaces útiles {: #helpful }

- [Especificación](https://wicg.github.io/webhid/)
- [Error de seguimiento](https://crbug.com/890096)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/5172464636133376)
- Componente Blink: [`Blink>HID`](https://chromestatus.com/features#component%3ABlink%3EHID)

## Agradecimientos

Gracias a [Matt Reynolds](https://github.com/nondebug) y [Joe Medley](https://github.com/jpmedley) por sus reseñas de este artículo. Foto de Nintendo Switch roja y azul de [Sara Kurfeß](https://unsplash.com/photos/jqpRECmiNEU), y foto de computadora portátil negra y plateada de [Athul Cyriac Ajay](https://unsplash.com/photos/ndokCrfQWrI) en Unsplash.
