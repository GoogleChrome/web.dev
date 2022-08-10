---
layout: post
title: Reducción de los Tiempos de respuesta del servidor (TTFB)
description: Obtenga información sobre time-to-first-byte audit.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - time-to-first-byte
---

La sección Oportunidades de su informe Lighthouse contiene información sobre Time to First Byte, que es el tiempo que el navegador de un usuario tarda en recibir el primer byte del contenido de la página:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V0P3MeqXSwGIL7fJbBRj.png", alt="Una captura de pantalla de la auditoría (TTFB) de los tiempos de respuesta bajos del servidor Lighthouse", width="800", height="95" %}</figure>

## Los tiempos de respuesta lentos del servidor afectan el desempeño

Esta auditoría se considera fallida cuando el navegador espera más de 600 ms a que el servidor responda a la solicitud del documento principal. A los usuarios no les gusta que las páginas tarden mucho en cargarse. Que los tiempos de respuesta del servidor sean lentos es una posible causa de que la carga de las páginas tarda demasiado

Cuando los usuarios abren una URL en su navegador, este envía a la red una solicitud para obtener dicho contenido. Su servidor recibe la solicitud y devuelve el contenido de la página.

Es posible que el servidor trabaje para devolver una página con todo el contenido que los usuarios desean. Por ejemplo, si los usuarios revisan su historial de pedidos, el servidor debe obtener el historial de cada usuario de una base de datos y después insertar ese contenido en la página.

Una manera de reducir el tiempo que los usuarios deben esperar para que se carguen las páginas es optimizar el servidor, de modo que tareas como esta se realicen lo más rápidamente posible.

## Cómo mejorar los tiempos de respuesta del servidor

El primer paso para mejorar los tiempos de respuesta del servidor es identificar las tareas conceptuales principales que su servidor efectúa para devolver el contenido de la página, y después medir el tiempo que tarda cada una de ellas. Una vez que se identifiquen las tareas más largas, busque maneras de acelerarlas.

Hay muchas causas posibles para que el servidor tarde en responder, así que también hay muchas formas posibles de mejorar:

- Optimice la lógica de la aplicación del servidor para que las páginas estilistas más rápidamente. Si utiliza un framework del lado del servidor, ese puede incluir recomendaciones sobre cómo hacerlo.
- Optimice la manera en que su servidor consulta las bases de datos o cambie a sistemas que tengan bases de datos más rápidas.
- Actualice el hardware de su servidor para ampliar su memoria o CPU.

## Orientación específica para la pila

### Drupal

Tanto los temas, los módulos y las especificaciones del servidor contribuyen al tiempo de respuesta del servidor. Busque un tema más optimizado, seleccione cuidadosamente un módulo de optimización o actualice su servidor. Para preparar las páginas más rápidamente, sus servidores de hosting deben utilizar caché opcode PHP, sistemas de caché en memoria como memcached o Redis para reducir los tiempos de consulta de la base de datos, así como lógicas de aplicación optimizadas.

### Magento

Utilice la [integración Varnish](https://devdocs.magento.com/guides/v2.3/config-guide/varnish/config-varnish.html) de Magento.

### React

Si renderiza del lado del servidor cualquier componente de React, utilice  [`renderToNodeStream()`](https://reactjs.org/docs/react-dom-server.html#rendertonodestream) o `renderToStaticNodeStream()` para que el cliente reciba e hidrate diferentes partes del marcado en lugar de todo a la vez.

### WordPress

Tanto los temas, los complementos y las especificaciones del servidor contribuyen al tiempo de respuesta del servidor. Busque un tema más optimizado, seleccione cuidadosamente un complemento de optimización y/o actualice su servidor.

## Recursos

- [Código fuente para la auditoría de **Reducción de los tiempos de respuesta del servidor (TTFB**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/server-response-time.js)
- [Servicio adaptativo con API de Información de red](/adaptive-serving-based-on-network-quality)
