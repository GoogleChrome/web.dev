---
layout: post
title: Cómo publicar activos estáticos con políticas eficientes para el caché
description: Descubra cómo el almacenamiento en el caché de los recursos estáticos de su página web puede mejorar el rendimiento y la seguridad para los visitantes habituales.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - usa-long-cache-ttl
---

Almacenar el HTTP en el caché puede acelerar el tiempo de carga de su página en las visitas habituales.

Cuando un navegador solicita un recurso, el servidor que lo proporciona puede indicarle a dicho navegador cuánto tiempo debe almacenar temporalmente o guardar el recurso en el *caché*. Ante cualquier solicitud que se efectúe de forma sucesiva de ese recurso, el navegador utilizará su propia copia local en vez de obtenerla de la red.

## Cómo puede fallar la auditoría de las políticas en el caché de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) etiqueta todos los recursos estáticos que no se almacenan en el caché:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vtRp9i6zzD8EDlHYkHtQ.png", alt="Una captura de pantalla sobre los activos estáticos de Lighthouse Serve y una auditoría eficiente de las políticas relacionadas con el caché", width="800", height="490" %}</figure>

Lighthouse considerará que un recurso puede almacenarse en el caché si se cumplen todas las condiciones que se indican a continuación:

- El recurso es una fuente, imagen, archivo multimedia, script o una hoja de estilo.
- El recurso tiene un [Código de estado HTTP](https://developer.mozilla.org/docs/Web/HTTP/Status) `200`, `203`, o `206`.
- El recurso carece de una política explícita de exclusión del caché.

Cuando una página no aprueba la auditoría, Lighthouse muestra los resultados en una tabla con tres columnas:

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>La ubicación del recurso que se puede almacenar en el caché</td>
      </tr>
      <tr>
        <td><strong>TTL del caché</strong></td>
        <td>El tiempo que se almacena actualmente el recurso en el caché</td>
      </tr>
      <tr>
        <td><strong>Tamaño</strong></td>
        <td>Un cálculo de los datos que sus usuarios se ahorrarían si los recursos etiquetados se almacenaran en el caché.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo almacenar en caché los recursos estáticos mediante el almacenamiento HTTP

Configure su servidor para que devuelva el encabezado HTTP `Cache-Control` como respuesta:

```js
Cache-Control: max-age=31536000
```

El directorio `max-age` le indica al navegador cuánto tiempo debe almacenar el recurso en segundos en el caché. En este ejemplo se establece la duración en `31,536,000`, que corresponde a 1 año: 60 segundos × 60 minutos × 24 horas × 365 días = 31,536,000 segundos.

Cuando sea posible, almacene en el caché los activos estáticos inmutables durante mucho tiempo, como un año o más.

{% Aside %} Uno de los riesgos de que la duración del caché sea por tiempo prolongado, es que los usuarios no verán las actualizaciones de los archivos estáticos. Puede evitar este problema configurando su herramienta de compilación para incrustar un hash en el nombre de los archivos de sus activos estáticos de forma que cada versión sea única, así se le solicitará al navegador que obtenga la nueva versión desde el servidor. (Para saber cómo incrustar hashes usando webpack, consulte la [guía de almacenamiento](https://webpack.js.org/guides/caching/) en caché de webpack). {% endAside %}

No use `no-cache` si el recurso cambia y la actualización es importante, pero si aún desea obtener algunos de los beneficios respecto a la velocidad del almacenamiento en caché. El navegador seguirá almacenando en el caché un recurso que está configurado como `no-cache` pero primero efectuará una verificación con el servidor para garantizar que el recurso aún esté actualizado.

No siempre es bueno que la duración del caché sea por tiempo prolongado. En última instancia, depende de usted decidir cuál será la duración óptima del caché para sus recursos.

Hay muchas directorios por personalizar conforme el caché del navegador almacene diferentes recursos. Obtenga más información sobre el almacenamiento de los recursos en el caché en [El caché HTTP: su guía sobre la primera línea de defensa](/http-cache) y [Cómo configurar el codelab de comportamiento para el almacenamiento HTTP](/codelab-http-cache).

## Cómo verificar las respuestas que se almacenan en el caché de Chrome DevTools

Para conocer los recursos que obtiene el navegador a partir de su caché, abra la pestaña **Network** en Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

El **tamaño** de la columna en Chrome DevTools puede ayudarle a verificar que un recurso se almacenó en el caché:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dc7QffBFDTcTHyUNNevi.png", alt="El tamaño de la columna", width="800", height="565" %}</figure>

Chrome publica los recursos más solicitados desde la memoria caché, que es muy rápida, pero se borra cuando se cierra el navegador.

Para verificar que el encabezado `Cache-Control` de un recurso se establezca como se espera, revise los datos del encabezado HTTP:

1. Haga clic en la URL de la solicitud, debajo de la **columna Name** en la tabla Solicitudes.
2. Haga clic en la pestaña **Encabezados.**

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dGDjkwsoUBwFVLYM0sVy.png", alt="Inspección del encabezado Cache-Control mediante la pestaña Headers", width="800", height="597" %} <figcaption> Inspección del encabezado <code>Cache-Control</code> mediante la pestaña <b>Headers</b>. </figcaption></figure>

## Orientación específica del Stack

### Drupal

Establezca la **Browser and proxy cache maximum age** en la sección **Administration** &gt; **Configuration** &gt; **Development** de la página. Consulte [Recursos sobre el rendimiento de Drupal](https://www.drupal.org/docs/7/managing-site-performance-and-scalability/caching-to-improve-performance/caching-overview#s-drupal-performance-resources).

### Joomla

Consulte [Caché](https://docs.joomla.org/Cache).

### WordPress

Consulte el [Caché del navegador](https://wordpress.org/support/article/optimization/#browser-caching).

## Recursos

- [Código fuente para la auditoría: **Cómo publicar activos estáticos con Políticas eficientes para el caché**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [Requisitos para especificar los controles del caché](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [Control del caché (MDN)](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control)
