---
layout: post
title: Reducir los tiempos de respuesta del servidor (TTFB)
description: Obtenga más información sobre la auditoría de tiempo hasta el primer byte.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - tiempo hasta el primer byte
---

La sección Oportunidades de su informe Lighthouse informa Tiempo hasta el primer byte, el tiempo que tarda el navegador de un usuario en recibir el primer byte del contenido de la página:

<figure class="w-figure"><img class="w-screenshot" src="time-to-first-byte.png" alt="Una captura de pantalla de la auditoría de los tiempos de respuesta de Lighthouse Server son bajos (TTFB)"></figure>

## Los tiempos de respuesta lentos del servidor afectan el rendimiento

Esta auditoría falla cuando el navegador espera más de 600 ms para que el servidor responda a la solicitud del documento principal. A los usuarios no les gusta que las páginas tarden mucho en cargarse. Los tiempos de respuesta lentos del servidor son una posible causa de cargas de páginas largas.

Cuando los usuarios navegan a una URL en su navegador web, el navegador realiza una solicitud de red para obtener ese contenido. Su servidor recibe la solicitud y devuelve el contenido de la página.

Es posible que el servidor deba hacer mucho trabajo para devolver una página con todo el contenido que los usuarios desean. Por ejemplo, si los usuarios están mirando su historial de pedidos, el servidor necesita buscar el historial de cada usuario de una base de datos y luego insertar ese contenido en la página.

Optimizar el servidor para que funcione de esta manera lo más rápido posible es una forma de reducir el tiempo que los usuarios pasan esperando a que se carguen las páginas.

## Cómo mejorar los tiempos de respuesta del servidor

El primer paso para mejorar los tiempos de respuesta del servidor es identificar las tareas conceptuales centrales que su servidor debe completar para devolver el contenido de la página y luego medir cuánto tiempo toma cada una de estas tareas. Una vez que haya identificado las tareas más largas, busque formas de acelerarlas.

Hay muchas causas posibles de respuestas lentas del servidor y, por lo tanto, muchas formas posibles de mejorar:

- Optimice la lógica de la aplicación del servidor para preparar las páginas más rápido. Si usa un marco de servidor, el marco puede tener recomendaciones sobre cómo hacer esto.
- Optimice la forma en que su servidor consulta las bases de datos o migre a sistemas de base de datos más rápidos.
- Actualice el hardware de su servidor para tener más memoria o CPU.

## Recursos

- [Código fuente para la auditoría **Reducir los tiempos de respuesta del servidor (TTFB)**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/server-response-time.js)
- [Servicio adaptable con API de información de red](/adaptive-serving-based-on-network-quality)
