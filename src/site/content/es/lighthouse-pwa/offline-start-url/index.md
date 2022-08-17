---
layout: post
title: '"start_url" no responde con un 200 cuando está sin conexión'
description: Aprende a configurar la URL de inicio de tu aplicación web progresiva para que tu aplicación sea accesible sin conexión.
web_lighthouse:
  - offline-start-url
date: 2019-05-04
updated: 2020-04-29
---

El [manifiesto](/add-manifest) de una [Aplicación web progresiva](/what-are-pwas/) (PWA) debe incluir un `start_url` que indica la URL que se cargará cuando el usuario inicie la aplicación.

Si el navegador no recibe una [respuesta HTTP 200](https://developer.mozilla.org/docs/Web/HTTP/Status#Successful_responses) al acceder a una aplicación desde el `start_url`, la `start_url` no es correcta o la página no es accesible sin conexión. Esto causa problemas a los usuarios que han instalado la aplicación en sus dispositivos.

## Cómo falla la auditoría Lighthouse de `start_url`

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las aplicaciones web cuya URL de inicio no responde con un 200 cuando está sin conexión:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZR8gYzKNpBkrXEgQQnbl.png", alt="La auditoría Lighthouse que muestra que la URL de inicio no responde con 200 cuando está sin conexión", width="800", height="76" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo asegurarse de que tu página esté disponible sin conexión

{% include 'content/reliable/workbox.njk' %}

1. Si aún no tienes uno, [agrega un manifiesto de aplicación web](/add-manifest/).
2. Verifica que el `start_url` en tu manifiesto esté correcto.
3. Agrega un service worker a tu aplicación.
4. Utiliza el service worker para almacenar en caché los archivos localmente.
5. Cuando estés sin conexión, utiliza el service worker como proxy de red para devolver la versión del archivo almacenada en el caché local.

Consulta [la página actual no responde con un 200 cuando está sin conexión](/works-offline) para obtener más información.

## Recursos

- [¿Qué es la confiabilidad de la red y cómo se mide?](/network-connections-unreliable/)
- [Agregar un manifiesto de aplicación web](/add-manifest/)
- [Workbox: Tu kit de herramientas para service workers de alto nivel](/workbox/)
