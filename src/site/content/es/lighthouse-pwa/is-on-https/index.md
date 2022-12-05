---
layout: post
title: No usa HTTPS
description: |2

  Aprenda a proteger su sitio web con HTTPS.
web_lighthouse:
  - is-on-https
date: 2019-05-04
updated: 2020-04-29
---

Todos los sitios web deben estar protegidos con HTTPS, incluso los que no manejan datos confidenciales. HTTPS evita que los intrusos manipulen o escuchen pasivamente las comunicaciones entre su sitio y sus usuarios.

Una página no puede calificar como una [aplicación web progresiva (PWA)](/discover-installable) si no se ejecuta sobre HTTPS; muchas tecnologías centrales de PWA, como los service workers, requieren HTTPS.

Para obtener más información sobre por qué todos los sitios deben protegerse con HTTPS, consulte [Por qué es importante HTTPS](/why-https-matters/).

## Cómo falla la auditoría Lighthouse para HTTPS

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no utilizan HTTPS:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FD2HDFl8SQCgRdhV4tzZ.png", alt="Auditoría Lighthouse que muestra que la página no utiliza HTTPS", width="800", height="139" %}</figure>

Lighthouse espera un evento del [Protocolo de depuración remota de Chrome](https://github.com/ChromeDevTools/devtools-protocol) que indica que la página se está ejecutando sobre una conexión segura. Si el evento no se detecta en 10 segundos, la auditoría falla.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo migrar su sitio a HTTPS

Considere alojar su sitio en una CDN. La mayoría de las CDN son seguras de forma predeterminada.

Para aprender cómo habilitar HTTPS en sus servidores, consulte el recurso de Google [Habilitar HTTPS en sus servidores](/enabling-https-on-your-servers/). Si está ejecutando su propio servidor y necesita una forma barata y fácil de generar certificados, el recurso [Cifremos](https://letsencrypt.org/) es una buena opción.

Si su página ya se está ejecutando sobre HTTPS pero no pasa esta auditoría, es posible que tenga problemas con el [contenido mixto](/what-is-mixed-content/). Una página tiene contenido mixto cuando la propia página se carga a través de HTTPS, pero solicita un recurso desprotegido (HTTP). Consulte el siguiente documento en el panel de seguridad de Chrome DevTools para aprender cómo depurar estas situaciones: [Comprenda los problemas de seguridad con Chrome DevTools](https://developer.chrome.com/docs/devtools/security/).

## Recursos

- [Código fuente de la auditoría **No utiliza HTTPS**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/is-on-https.js).
- [Por qué debería usar siempre HTTPS](/why-https-matters/)
- [Habilitar HTTPS en sus servidores](/enabling-https-on-your-servers/)
- [Comprenda los problemas de seguridad con Chrome DevTools](https://developer.chrome.com/docs/devtools/security/)
- [¿Qué es el contenido mixto?](/what-is-mixed-content/)
- [Cifremos](https://letsencrypt.org/)
