---
title: WebRTC ahora es un estándar W3C e IETF
subhead: |
  Una breve descripción general de la historia, la arquitectura, los casos de uso y el futuro de WebRTC.
description: |
  Una breve descripción general de la historia, la arquitectura, los casos de uso y el futuro de WebRTC.
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

El proceso de definición de un estándar web es un proceso largo que garantiza la utilidad, la coherencia y la compatibilidad entre los navegadores. Hoy, [el W3C y el IETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en) marcan la finalización de quizás uno de los estándares más importantes durante la pandemia: WebRTC.

{% Aside %} Consulte el  codelab [comunicación en tiempo real con WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web) para obtener un tutorial práctico sobre la implementación de WebRTC. {% endAside %}

## Historia {: #history }

WebRTC es una plataforma que brinda a navegadores, aplicaciones móviles y aplicaciones de escritorio capacidad de comunicación en tiempo real, que normalmente se utiliza para videollamadas. La plataforma consta de un conjunto completo de tecnologías y estándares. Google inició la idea de crear WebRTC en 2009, como una alternativa a Adobe Flash y a las aplicaciones de escritorio que no se podían ejecutar en el navegador. La generación anterior de productos basados en navegador se construyó sobre tecnología patentada con licencia. Se crearon varios productos con esta tecnología, incluyendo Hangouts. Luego, Google adquirió las empresas de las que había estado licenciando la tecnología y la puso a disposición como el proyecto WebRTC de código abierto. Este código base está integrado en Chrome y es utilizado por la mayoría de las aplicaciones que utilizan WebRTC. Junto con otros proveedores de navegadores y líderes de la industria como Mozilla, Microsoft, Cisco y Ericsson, se inició la estandarización de WebRTC tanto en el W3C como en el IETF. En 2013, Mozilla y Google hicieron una [demostración](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html) de videollamadas entre sus navegadores. A través de la evolución del estándar, muchas discusiones sobre la arquitectura llevaron a diferencias de implementación entre los navegadores que desafiaron la compatibilidad y la interoperabilidad. La mayoría de estos desacuerdos finalmente se resolvieron cuando se finalizó el estándar en los últimos años. La especificación WebRTC ahora viene acompañada de un [conjunto completo de pruebas de plataforma](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned) y herramientas para abordar la compatibilidad, y los navegadores han adaptado en gran medida sus implementaciones en consecuencia. Esto pone fin a un período desafiante en el que los desarrolladores web tenían que adoptar continuamente sus servicios para diferentes implementaciones de navegadores y cambios de especificaciones.

## Arquitectura y funcionalidad {: #architecture }

La [API `RTCPeerConnection`](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection) es la parte central de la especificación WebRTC. `RTCPeerConnection` se ocupa de conectar dos aplicaciones en diferentes endpoints para comunicarse mediante un protocolo de igual a igual. La `PeerConnection` interactúa estrechamente con [`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) para acceder a la cámara y al micrófono, y con [`getDisplayMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia) para capturar el contenido de la pantalla. WebRTC le permite enviar y recibir transmisiones que incluyen contenido de audio o video, así como datos binarios arbitrarios a través del `DataChannel`. La funcionalidad de medios para procesar, codificar y decodificar audio y video proporciona el núcleo de cualquier implementación de WebRTC. WebRTC admite varios códecs de audio, siendo Opus el más utilizado y versátil. Se requieren implementaciones de WebRTC para admitir el códec de video VP8 de uso gratuito de Google y H.264 para procesar video. Las conexiones WebRTC siempre están encriptadas, lo que se logra a través de dos protocolos existentes: DTLS y SRTP. WebRTC se basa en gran medida en los estándares y tecnologías existentes, desde códecs de video (VP8, H264), recorrido de red (ICE), transporte (RTP, SCTP), hasta protocolos de descripción de medios (SDP). Esto está vinculado en más de 50 RFC.

## Casos de uso: cuando es cuestión de milisegundos {: #use-cases }

WebRTC se usa ampliamente en aplicaciones de prioridad temporal crítica, como cirugía remota, monitoreo de sistemas y control remoto de carros autónomos, y llamadas de voz o video creadas en UDP donde el almacenamiento en búfer no es posible. Casi todos los servicios de videollamadas basados en navegador de empresas como Google, Facebook, Cisco, RingCentral y Jitsi utilizan WebRTC. Google Stadia y NVIDIA GeForce NOW usan WebRTC para transmitir el juego desde la nube al navegador web sin demoras perceptibles.

## La pandemia acentúa el rendimiento de las videollamadas {: #performance }

Durante el año pasado, WebRTC ha visto un aumento de 100 veces en el uso de Chrome debido al aumento de las videollamadas desde el navegador. Reconociendo que las videollamadas se han convertido en una parte fundamental de la vida de muchas personas durante la pandemia, los proveedores de navegadores han comenzado a optimizar las tecnologías de las que dependen las videollamadas. Esto fue particularmente importante, ya que las reuniones grandes que demandaban recursos y los efectos de video en las reuniones de video se volvieron más comunes cuando los empleados y estudiantes comenzaron a trabajar y estudiar desde casa. En el último año, Chrome se ha vuelto hasta un 30% más eficiente en términos de batería para las videollamadas, con más optimizaciones por venir para escenarios de uso intensivo. Mozilla, Apple y Microsoft [han realizado mejoras significativas](https://www.youtube.com/watch?v=YZROn-WsyO4) en su implementación de WebRTC durante la pandemia, en particular para asegurarse de que se adhieran al estándar ahora formalizado.

## El futuro de WebRTC {: #future }

Si bien WebRTC ahora forma parte del estándar W3C, las mejoras continúan. El nuevo códec de video AV1, que [ahorra hasta un 50% del ancho de banda,](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/) está tornándose disponible para WebRTC y navegadores web. Se espera que las continuas mejoras en la base del código fuente abierto reduzcan aún más la demora y mejoren la calidad del video que se puede transmitir. [WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/) reúne la iniciativa de crear API complementarias para permitir nuevos casos de uso. Estas consisten en extensiones de las API existentes para brindar más control sobre la funcionalidad existente, como la [Codificación de video escalable](https://www.w3.org/TR/webrtc-svc/), así como las API que brindan acceso a [componentes de nivel inferior](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md). Este último ofrece más flexibilidad a los desarrolladores web para innovar mediante la integración de componentes WebAssembly personalizados de alto rendimiento. Con las redes 5G emergentes y la demanda de servicios más interactivos, esperamos ver un aumento continuo de la construcción de servicios baseados en WebRTC en el próximo año.
