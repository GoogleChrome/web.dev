---
layout: post
title: No usa HTTP / 2 para todos sus recursos
description: |2

  Descubra por qué HTTP / 2 es importante para el tiempo de carga de su página y cómo habilitar

  HTTP / 2 en su servidor.
web_lighthouse:
  - usos-http2
date: 2019-05-02
updated: 2019-08-28
---

HTTP / 2 sirve los recursos de su página más rápido y con menos datos moviéndose por el cable.

## Cómo falla la auditoría de Lighthouse HTTP / 2

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) enumera todos los recursos que no se sirven a través de HTTP / 2:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt = "La auditoría de Lighthouse muestra los recursos no servidos a través de HTTP / 2", width = "800", height = "191"%}</figure>

Lighthouse recopila todos los recursos solicitados por la página y verifica la versión del protocolo HTTP de cada uno. Hay algunos casos en los que las solicitudes que no son HTTP / 2 se ignorarán en los resultados de la auditoría. [Consulte la implementación](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138) para obtener más detalles.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Cómo pasar esta auditoría

Sirva sus recursos a través de HTTP / 2.

Para saber cómo habilitar HTTP / 2 en sus servidores, consulte [Configuración de HTTP / 2](https://dassur.ma/things/h2setup/) .

## Recursos

- [Código fuente de **No usa HTTP / 2 para todas sus** auditorías de recursos](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/uses-http2.js)
- [Introducción a HTTP / 2](/performance-http2/)
- [Preguntas frecuentes sobre HTTP / 2](https://http2.github.io/faq/)
