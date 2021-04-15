---
layout: post
title: Sirva activos estáticos con una política de caché eficiente
description: Descubra cómo el almacenamiento en caché de los recursos estáticos de su página web puede mejorar el rendimiento y la confiabilidad para los visitantes habituales.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - usa-long-cache-ttl
---

El almacenamiento en caché HTTP puede acelerar el tiempo de carga de su página en visitas repetidas.

Cuando un navegador solicita un recurso, el servidor que proporciona el recurso puede decirle al navegador cuánto tiempo debe almacenar temporalmente o almacenar en *caché* el recurso. Para cualquier solicitud posterior de ese recurso, el navegador usa su copia local en lugar de obtenerla de la red.

## Cómo falla la auditoría de la política de caché de Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca todos los recursos estáticos que no se almacenan en caché:

<figure class="w-figure"><img class="w-screenshot" src="uses-long-cache-ttl.png" alt="Una captura de pantalla de los activos estáticos de Lighthouse Serve con una auditoría de política de caché eficiente"></figure>

Lighthouse considera que un recurso se puede almacenar en caché si se cumplen todas las condiciones siguientes:

- El recurso es una fuente, una imagen, un archivo multimedia, un script o una hoja de estilo.
- El recurso tiene un [código de estado HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) `200` , `203` o `206` .
- El recurso no tiene una política explícita de no caché.

Cuando una página no pasa la auditoría, Lighthouse enumera los resultados en una tabla con tres columnas:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>La ubicación del recurso almacenable en caché</td>
      </tr>
      <tr>
        <td><strong>TTL de caché</strong></td>
        <td>La duración actual de la caché del recurso.</td>
      </tr>
      <tr>
        <td><strong>Tamaño</strong></td>
        <td>Una estimación de los datos que sus usuarios guardarían si el recurso marcado se hubiera almacenado en caché</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo almacenar en caché los recursos estáticos mediante el almacenamiento en caché HTTP

Configure su servidor para que devuelva el encabezado de respuesta HTTP de `Cache-Control`

```js
Cache-Control: max-age=31536000
```

La `max-age` le dice al navegador cuánto tiempo debe almacenar en caché el recurso en segundos. Este ejemplo establece la duración en `31536000` , que corresponde a 1 año: 60 segundos × 60 minutos × 24 horas × 365 días = 31536000 segundos.

Cuando sea posible, almacene en caché los activos estáticos inmutables durante mucho tiempo, como un año o más.

{% Aside %} Uno de los riesgos de las duraciones prolongadas de la caché es que los usuarios no verán las actualizaciones de los archivos estáticos. Puede evitar este problema configurando su herramienta de compilación para incrustar un hash en los nombres de archivo de sus activos estáticos para que cada versión sea única, lo que le pide al navegador que obtenga la nueva versión del servidor. (Para aprender cómo incrustar hashes usando webpack, consulte la [guía de almacenamiento](https://webpack.js.org/guides/caching/) en caché de webpack). {% endAside %}

No use `no-cache` si el recurso cambia y la actualización es importante, pero aún desea obtener algunos de los beneficios de velocidad del almacenamiento en caché. El navegador aún almacena en caché un recurso que está configurado como `no-cache` pero primero verifica con el servidor para asegurarse de que el recurso aún esté actualizado.

Una mayor duración de la caché no siempre es mejor. En última instancia, depende de usted decidir cuál es la duración óptima de la caché para sus recursos.

Hay muchas directivas para personalizar cómo el navegador almacena en caché diferentes recursos. Obtenga más información sobre el almacenamiento en caché de recursos en [El caché HTTP: su primera línea de guía de defensa](/http-cache) y el [laboratorio de códigos de configuración del comportamiento del almacenamiento en caché HTTP](/codelab-http-cache) .

## Cómo verificar las respuestas almacenadas en caché en Chrome DevTools

Para ver qué recursos obtiene el navegador de su caché, abra la **pestaña Red** en Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

La **columna Tamaño** en Chrome DevTools puede ayudarlo a verificar que un recurso se haya almacenado en caché:

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="size.png" alt="La columna Tamaño."></figure>

Chrome sirve los recursos más solicitados de la memoria caché, que es muy rápido, pero se borra cuando se cierra el navegador.

Para verificar que el `Cache-Control` un recurso esté configurado como se esperaba, verifique sus datos de encabezado HTTP:

1. Haga clic en la URL de la solicitud, debajo de la **columna Nombre** de la tabla Solicitudes.
2. Haga clic en la pestaña **Encabezados.**

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="cache-control-header.png" alt="Inspeccionar el encabezado Cache-Control a través de la pestaña Encabezados"><figcaption class="w-figcaption"> Inspeccionando el <code>Cache-Control</code> través de la pestaña <b>Encabezados.</b></figcaption></figure>

## Recursos

- [Código fuente para **servir activos estáticos con una** auditoría de políticas de caché eficiente](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [Especificación de control de caché](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [Control de caché (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
