---
layout: post
title: Intercambio de recursos de origen cruzado (CORS)
subhead: Intercambie recursos de origen cruzado de forma segura
authors:
  - kosamari
date: 2018-11-05
description: |2-

  La política del mismo origen del navegador bloquea la lectura de un recurso de un origen distinto. Este mecanismo impide que un sitio malintencionado lea los datos de otro sitio, pero también impide los usos legítimos. ¿Qué tal si  quisiera conocer los datos meteorológicos de otro país? Habilitar el CORS permite que el servidor le diga al navegador que tiene permitido utilizar un origen adicional.
tags:
  - security
---

La política del mismo origen del navegador bloquea la lectura de un recurso de un origen distinto. Este mecanismo impide que un sitio malintencionado lea los datos de otro sitio, pero también impide los usos legítimos. ¿Qué tal si  quisiera conocer los datos meteorológicos de otro país?

En una aplicación web moderna, una aplicación a menudo desea obtener recursos de un origen diferente. Por ejemplo, desea recuperar datos JSON de un dominio diferente o cargar imágenes de otro sitio en un elemento `<canvas>`

En otras palabras, hay **recursos públicos** que deberían estar disponibles para que cualquiera los lea, pero la política del mismo origen bloquea eso. Los desarrolladores han utilizado soluciones alternativas como [JSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about), pero el uso del **Intercambio de recursos de origen cruzado (CORS)** corrige esto de una forma estándar.

Habilitar el **CORS** permite que el servidor le diga al navegador que tiene permiso para usar un origen adicional.

## ¿Cómo funciona una consulta de recursos en la web?

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8J6A0Bk5YXdvyoj8HVzs.png", alt="consulta y respuesta", width="668", height="327" %} <figcaption> Imagen: Ilustración de la consulta del cliente y respuesta del servidor </figcaption></figure>

Un navegador y un servidor pueden intercambiar datos a través de la red utilizando el **Protocolo de transferencia de hipertexto** (HTTP). El HTTP define las reglas de comunicación entre quien la solicita y quien responde, incluyendo la información que se necesita para obtener un recurso.

La cabecera HTTP se utiliza para negociar el tipo de intercambio de mensajes entre el cliente y el servidor y se utiliza para determinar el acceso. Tanto la consulta del navegador como el mensaje de respuesta del servidor se dividen en dos partes: **cabecera** y **cuerpo**.

### header (cabecera)

Información sobre el mensaje, como el tipo de mensaje o la codificación del mensaje. Una cabecera puede incluir una [variedad de información](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields) expresada como key-value pairs (par clave-valor). La cabecera de consulta y la cabecera de respuesta contienen información diferente.

{% Aside %} Es importante tener en cuenta que las cabeceras no pueden contener comentarios. {% endAside %}

**Ejemplo de cabecera de consulta**

```text
Accept: text/html
Cookie: Version=1
```

Lo anterior equivale a decir "Quiero recibir un HTML como respuesta. Aquí hay una cookie que tengo".

**Ejemplo de cabecera de respuesta**

```text
Content-Encoding: gzip
Cache-Control: no-store
```

Lo anterior equivale a decir "Los datos están codificados con gzip. No guarde en caché esto, por favor".

### body (cuerpo)

Es el mensaje en sí. Puede ser texto sin formato, una imagen binaria, JSON, HTML, etc.

## ¿Cómo funciona CORS?

Recuerde, la política del mismo origen le dice al navegador que bloquee las solicitudes de origen cruzado. Cuando desee obtener un recurso público de un origen diferente, el servidor que proporciona el recurso necesita decirle al navegador "Este origen de donde proviene la consulta puede acceder a mi recurso". El navegador recuerda eso y permite compartir recursos de origen cruzado.

### Paso 1: consulta del cliente (navegador)

Cuando el navegador realiza una consulta de origen cruzado, el navegador agrega una cabecera `Origin` con el origen actual (esquema, host y puerto).

### Paso 2: respuesta del servidor

En el lado del servidor, cuando un servidor ve esta cabecera y quiere permitir el acceso, necesita agregar una cabecera `Access-Control-Allow-Origin` a la respuesta especificando el origen de la consulta (o `*` para permitir cualquier origen).

### Paso 3: el navegador recibe la respuesta

Cuando el navegador ve esta respuesta con un `Access-Control-Allow-Origin` apropiado, el navegador permitirá que los datos de la respuesta se compartan con el sitio del cliente.

## Vea a CORS en acción

Aquí hay un pequeño servidor web que usa Express.

{% Glitch {id: 'cors-demo', ruta: 'server.js', altura: 480}%}

El primer endpoint (línea 8) no tiene ninguna cabecera de respuesta establecida, solo envía un archivo en respuesta.

{% Instruction 'devtools' %} {% Instruction 'devtools-console', 'ul' %}

- Intente utilizar el siguiente comando:

```js
fetch('https://cors-demo.glitch.me/', {mode:'cors'})
```

Debería ver un error que dice:

```bash
request has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

El segundo endpoint (línea 13) envía el mismo archivo en respuesta pero agrega `Access-Control-Allow-Origin: *` en la cabecera. Desde la consola, escriba:

```js
fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})
```

Esta vez, su consulta no debe ser bloqueada.

## Comparta credenciales con CORS

Por razones de privacidad, CORS se usa normalmente para "solicitudes anónimas", aquellas en las que la consulta no identifica a su remitente. Si desea enviar cookies cuando usa CORS (que podría identificar al remitente), debe agregar cabeceras adicionales a la de consulta y de respuesta.

### Request (consulta)

Agregue `credentials: 'include'` a las opciones de fetch (recuperación) como se muestra a continuación. Esto incluirá la cookie con la consulta.

```js
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include'
})
```

### Response (respuesta)

`Access-Control-Allow-Origin` debe establecerse en un origen específico (sin comodines usando `*` ) y debe establecer `Access-Control-Allow-Credentials` en `true` .

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## Solicitudes de verificación previa para peticiones HTTP complejas

Si una aplicación web necesita una solicitud HTTP compleja, el navegador agrega una **[solicitud de verificación previa](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests)** al principio de la cadena de solicitudes.

La especificación CORS define una **consulta compleja** como

- Una consulta que utilice métodos distintos a GET, POST o HEAD
- Una consulta que incluya encabezados distintos a `Accept` , `Accept-Language` o `Content-Language`
- Una consulta que tenga un `Content-Type` que no sea `application/x-www-form-urlencoded` , `multipart/form-data` o `text/plain`

Los navegadores crean una consulta de verificación previa si es necesario. En una consulta `OPTIONS` como la que se muestra a continuación, es la que se envía antes del mensaje de consulta real.

```text
OPTIONS /data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: DELETE
```

En el lado del servidor, una aplicación debe responder a la consulta de verificación previa con información sobre los métodos que la aplicación acepta desde este origen.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS
```

La respuesta del servidor también puede incluir un `Access-Control-Max-Age` para especificar la duración (en segundos) para almacenar en caché los resultados de la verificación previa para que el cliente no necesite realizar una solicitud de verificación previa cada vez que envía una consulta compleja.
