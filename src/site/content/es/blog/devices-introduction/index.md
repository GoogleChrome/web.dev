---
title: Acceder a dispositivos de hardware en la web
subhead: |
  Elige la API adecuada para comunicarte con un dispositivo de hardware de tu elección.
description: |
  Este artículo ayuda a los desarrolladores web a elegir la API de hardware adecuada en función de un dispositivo determinado.
authors:
  - beaufortfrancois
date: 2021-02-12
updated: 2021-11-16
hero: image/admin/vAnNpGQruw5EUXxob47V.jpg
alt: Una foto de una mujer sentada frente a un escritorio de madera.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
---

El objetivo de esta guía es ayudarte a elegir la mejor API para comunicarte con un dispositivo de hardware (por ejemplo, una cámara web, un micrófono, etc.) en la web. Por "mejor" me refiero a que te ofrece todo lo que necesitas con la menor cantidad de trabajo. En otras palabras, te ayuda en el caso que no sepas qué API usar o te preguntas si hay otra forma de conseguirlo.

Un problema en el que comúnmente veo caer a los desarrolladores web es saltar a las APIs de nivel inferior sin conocer las APIs de nivel superior que son más fáciles de implementar y proporcionan una mejor UX. Por lo tanto, esta guía comienza recomendando primero las APIs de nivel superior, pero también menciona las APIs de nivel inferior en caso de que hayas determinado que la API de nivel superior no cumpla con tus necesidades.

## 🕹 Recibir eventos de entrada de este dispositivo {: #input }

Intenta escuchar eventos de [teclado](https://developer.mozilla.org/docs/Web/API/KeyboardEvent) y [puntero.](https://developer.mozilla.org/docs/Web/API/Pointer_events) Si este dispositivo es un controlador de juego, usa [Gamepad API](/gamepad/) para saber qué botones se están presionando y qué ejes se mueven.

Si ninguna de estas opciones te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 📸 Acceder a audio y video desde este dispositivo {: #audio-video }

Utiliza [MediaDevices.getUserMedia()](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) para obtener transmisiones de audio y video en vivo desde este dispositivo y aprender a [capturar audio y video](https://www.html5rocks.com/en/tutorials/getusermedia/intro/). También puedes [controlar la panorámica, la inclinación y el zoom de la cámara](/camera-pan-tilt-zoom/) y otras configuraciones, como el [brillo y el contraste](https://developers.google.com/web/updates/2016/12/imagecapture), e incluso también puedes [tomar imágenes fijas](https://beaufortfrancois.github.io/sandbox/image-capture/playground). [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) se puede utilizar para agregar efectos al audio, crear visualizaciones de audio o aplicar efectos espaciales (como la panorámica). Ver también [cómo perfilar el rendimiento de las aplicaciones Web Audio](/profiling-web-audio-apps-in-chrome/) en Chrome.

Si ninguna de estas opciones te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🖨 Imprimir en este dispositivo {: #print }

Utiliza [window.print ()](https://developer.mozilla.org/docs/Web/API/Window/print) para abrir un cuadro de diálogo en el navegador que le permita al usuario elegir este dispositivo como opción para imprimir el documento actual.

Si esto no te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🔐 Autenticarse con este dispositivo {: #auth }

Utiliza [WebAuthn](https://webauthn.io/) para crear una credencial de clave pública con alcance de origen fuerte y certificada con este dispositivo de seguridad de hardware para autenticar a los usuarios. Admite el uso de autenticadores U2F o FIDO2 por Bluetooth, NFC y USB -también conocidos como claves de seguridad-, así como un autenticador de plataforma, que permite a los usuarios autenticarse con sus huellas dactilares o bloqueos de pantalla. Consulta [Crea tu primera aplicación WebAuthn](https://developers.google.com/codelabs/webauthn-reauth).

Si este dispositivo es otro tipo de dispositivo de seguridad de hardware (por ejemplo, una billetera de criptomonedas), una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🗄 Acceder a archivos en este dispositivo {: #files }

Utiliza [File System Access API](/file-system-access/) para leer y guardar cambios directamente en archivos y carpetas en el dispositivo del usuario. Si no está disponible, usa [File API](https://developer.mozilla.org/docs/Web/API/File/Using_files_from_web_applications) para pedirle al usuario que seleccione archivos locales de un cuadro de diálogo del navegador y luego lea el contenido de esos archivos.

Si ninguna de estas opciones te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🧲 Acceder a los sensores de este dispositivo {: #sensors }

Utiliza [Generic Sensor API](/generic-sensor/) para leer los valores brutos de los sensores de movimiento (por ejemplo, el acelerómetro o el giroscopio) y sensores ambientales (por ejemplo, la luz ambiental, el magnetómetro). Si no está disponible, usa los [eventos DeviceMotion y DeviceOrientation](https://developers.google.com/web/fundamentals/native-hardware/device-orientation) para obtener acceso al acelerómetro, el giroscopio y la brújula integrados en dispositivos móviles.

Si no te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🛰 Acceder a las coordenadas GPS en este dispositivo {: #gps }

Utiliza [Geolocation API](/native-hardware-user-location/) para obtener la latitud y la longitud de la posición actual del usuario en este dispositivo.

Si no te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 🔋 Verificar la batería de este dispositivo {: #battery }

Utiliza [Battery API](https://developer.mozilla.org/docs/Web/API/Battery_Status_API) para obtener información del host sobre el nivel de carga de la batería y recibir una notificación cuando el nivel de la batería o el estado de carga se modifiquen.

Si no te funciona, una API de nivel inferior puede ser la solución. Consulta [Descubre cómo comunicarte con tu dispositivo](#discover) para comenzar tu recorrido.

## 📞 Comunicarse con este dispositivo a través de la red {: #network }

En la red local, usa [Remote Playback API](https://developers.google.com/web/updates/2018/04/present-web-pages-to-secondary-attached-displays) para transmitir audio y/o video en un dispositivo de reproducción remota (por ejemplo, un smart TV o un altavoz inalámbrico) o utiliza [Presentation API](https://developers.google.com/web/updates/2018/04/present-web-pages-to-secondary-attached-displays) para transmitir una página web en una segunda pantalla (por ejemplo, una pantalla conectada con un cable HDMI o un smart TV conectado de forma inalámbrica).

Si este dispositivo expone un servidor web, utiliza [API Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) y/o [WebSockets](https://developer.mozilla.org/docs/Web/API/WebSockets_API) para obtener algunos datos de este dispositivo pulsando los puntos finales apropiados. Si bien los sockets TCP y UDP no están disponibles en la web, consulta [WebTransport](/webtransport/) para manejar conexiones de red interactivas, bidireccionales y multiplexadas. Ten en cuenta que [WebRTC](/webrtc-standard-announcement/) también se puede utilizar para comunicar datos en tiempo real con otros navegadores mediante un protocolo de igual a igual.

## 🧱 Descubre cómo comunicarte con tu dispositivo {: #discover }

La decisión de qué API de nivel inferior debes usar está determinada por la naturaleza de tu conexión física al dispositivo. Si es inalámbrica, consulta Web NFC para conexiones inalámbricas de muy corto alcance y Web Bluetooth para dispositivos inalámbricos cercanos.

- Con [Web NFC](/nfc), se puede leer y escribir en este dispositivo cuando estés muy cerca del dispositivo del usuario (generalmente de 5 a 10 cm, de 2 a 4 pulgadas). Herramientas como [NFC TagInfo de NXP](https://play.google.com/store/apps/details?id=com.nxp.taginfolite) te permiten navegar por el contenido de este dispositivo con fines de ingeniería inversa.

- Con [Web Bluetooth](/bluetooth/), puedes conectarte al dispositivo a través de una conexión Bluetooth de bajo consumo. Debería ser bastante fácil comunicarse con él cuando utilizas servicios Bluetooth GATT estandarizados (como el servicio de batería), ya que su comportamiento está [bien documentado](https://www.bluetooth.com/specifications/gatt/). Si no es así, en este punto, debes buscar documentación de hardware para este dispositivo o realizar ingeniería inversa. Puedes utilizar herramientas externas como [nRF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp) y herramientas integradas del navegador, como la página interna `about://bluetooth-internals` en navegadores basados en Chromium. Echa un vistazo a [la ingeniería inversa de una bombilla Bluetooth](https://urish.medium.com/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546) de Uri Shaked. Ten en cuenta que los dispositivos Bluetooth también pueden hablar los protocolos HID o serie.

Si está conectado, consulte estas APIs en este orden específico:

1. Con [WebHID](/hid/), la comprensión de los informes HID y los descriptores de informes a través de [colecciones](https://webhid-collections.glitch.me/) es clave para comprender este dispositivo. Esto puede resultar complicado sin la documentación del proveedor de este dispositivo. Herramientas como [Wireshark](https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB) pueden ayudarte a realizar ingeniería inversa.

2. Con [Web Serial](/serial/), sin la documentación del proveedor para este dispositivo y los comandos que soporta, es difícil, pero no imposible. La ingeniería inversa de este dispositivo se puede realizar capturando tráfico USB sin procesar con herramientas como [Wireshark](https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB). También puedes utilizar la [aplicación web Serial Terminal](https://googlechromelabs.github.io/serial-terminal/) para experimentar con este dispositivo si utilizas un protocolo legible por humanos.

3. Con [WebUSB](/usb/) , sin una documentación clara para este dispositivo y los comandos USB que soporta, es difícil, pero no imposible. Puedes ver [Exploring WebUSB y su emocionante potencial](https://www.youtube.com/watch?v=IpfZ8Nj3uiE) de Suz Hinton. También puedes aplicar ingeniería inversa a este dispositivo capturando tráfico USB sin procesar e inspeccionando [descriptores USB](https://www.beyondlogic.org/usbnutshell/usb5.shtml) con herramientas externas como Wireshark y herramientas integradas en el navegador, como la página interna `about://usb-internals` en los navegadores basados en Chromium.

## Agradecimientos {: #acknowledgements }

Gracias a [Reilly Grant](https://github.com/reillyeon), [Thomas Steiner](/authors/thomassteiner/) y [Kayce Basques](/authors/kaycebasques/) por revisar este artículo.

Foto de [Darya Tryfanava](https://unsplash.com/@darya_tryfanava) en [Unsplash](https://unsplash.com/photos/uZBGDkYkvhM).
