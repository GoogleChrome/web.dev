---
layout: post
title: Uso de la API de Chrome UX Report
subhead: |2-

  Aprende a utilizar la API de Chrome UX Report para obtener un acceso fácil, con acceso REST a datos de la experiencia del usuario real en millones de sitios web.
authors:
  - rviscomi
  - exterkamp
hero: image/admin/TQ4U8BZanGFSfJI973xn.png
description: Aprende a utilizar la API de Chrome UX Report para obtener un acceso fácil, con acceso REST a datos de la experiencia del usuario real en millones de sitios web.
date: 2020-06-25
updated: 2022-07-18
tags:
  - blog
  - chrome-ux-report
  - web-vitals
  - performance
  - metrics
---

El [Chrome UX Report (CrUX): Reporte de la experiencia de usuario de Chrome](https://developer.chrome.com/docs/crux/) representa cómo los usuarios de Chrome en el mundo real experimentan los destinos populares en la web. Desde 2017, cuando el conjunto de datos consultables se lanzó por primera vez en [BigQuery](/chrome-ux-report-bigquery/), los datos de campo de CrUX se han integrado en herramientas para desarrolladores como [PageSpeed Insights](/chrome-ux-report-pagespeed-insights/), [CrUX Dashboard](/chrome-ux-report-data-studio-dashboard/) y el [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520) de Search Console, lo que permite a los desarrolladores medir y monitorear fácilmente las experiencias de los usuarios reales. La pieza que ha faltado todo este tiempo ha sido una herramienta que proporciona acceso gratuito y del tipo REST a los datos de CrUX mediante programación. Para ayudar a cerrar esa brecha, ¡nos complace anunciar el lanzamiento de la nueva [API de Chrome UX Report](https://developer.chrome.com/docs/crux/api/)!

Esta API se ha creado con el objetivo de proporcionar a los desarrolladores un acceso sencillo, rápido y completo a los datos de CrUX. La API de CrUX solo informa datos de la experiencia del usuario de [*campo*](/how-to-measure-speed/#lab-data-vs-field-data), a diferencia de la [API de PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started) existente, que también informa datos de *laboratorio* de las auditorías de rendimiento de Lighthouse. La API de CrUX está optimizada y puede servir rápidamente datos de la experiencia del usuario, lo que la hace ideal para aplicaciones de auditoría en tiempo real.

Para garantizar que los desarrolladores tengan acceso a todas las métricas que más importan, los [Core Web Vitals](/vitals/#core-web-vitals), la API de CrUX audita y supervisa la [Largest Contentful Paint (LCP): Despliegue del contenido más extenso](/lcp/), el [First Input Delay (FID): Demora de la primera entrada](/fid/)  y el [Cumulative Layout Shift (CLS): Cambio Acumulativo del diseño](/cls/) tanto del origen y al nivel de URL.

¡Así que profundicemos y veamos cómo usarlo!

## Consulta los datos de origen

Los orígenes del conjunto de datos CrUX abarcan todas las experiencias subyacentes a nivel de página. El siguiente ejemplo demuestra cómo consultar la API de CrUX para obtener los datos de la experiencia del usuario de un origen utilizando cURL en la línea de comando.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"origin": "https://web.dev"}'
```

{% Aside %}
Todas las solicitudes de API deben proporcionar un valor para el parámetro `key` usando el `[YOUR_API_KEY]` donde en el ejemplo anterior se deja como marcador de posición (placeholder). Obtén tu propia llave API de CrUX privada en la [documentación oficial de la API de CrUX](https://developer.chrome.com/docs/crux/api/#crux-api-key).
{% endAside %}

El `curl` se compone de tres partes:

1. El endpoint de la URL de la API, incluida la llave API privada de la persona que llama.
2. La cabecera de `Content-Type: application/json`, que indica que el cuerpo de la solicitud contiene JSON.
3. [El cuerpo de la solicitud](https://developer.chrome.com/docs/crux/api/#request-body) codificado en JSON, que especifica el origen `https://web.dev`.

Para hacer lo mismo en JavaScript, usa la utilidad <a name="crux-api-util"><code>CrUXApiUtil</code></a>, que realiza la llamada a la API y devuelve la respuesta decodificada.

```js/2
const CrUXApiUtil = {};
// Obtén tu llave de la API de CrUX en https://goo.gle/crux-api-key.
CrUXApiUtil.API_KEY = '[YOUR_API_KEY]';
CrUXApiUtil.API_ENDPOINT = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CrUXApiUtil.API_KEY}`;
CrUXApiUtil.query = function (requestBody) {
  if (CrUXApiUtil.API_KEY == '[YOUR_API_KEY]') {
    throw 'Reemplaza "YOUR_API_KEY" con tu llave de la API de CrUX. Obtén una llave en https://goo.gle/crux-api-key.';
  }
  return fetch(CrUXApiUtil.API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(requestBody)
  }).then(response => response.json()).then(response => {
    if (response.error) {
      return Promise.reject(response);
    }
    return response;
  });
};
```

Reemplaza `[YOUR_API_KEY]` con tu [llave](https://goo.gle/crux-api-key). A continuación, llama a la función `CrUXApiUtil.query` y pasa el objeto del [cuerpo de la solicitud](https://developer.chrome.com/docs/crux/api/#request-body).

```js/1
CrUXApiUtil.query({
  origin: 'https://web.dev'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

Si existen datos para este origen, la respuesta de la API es un objeto codificado en JSON que contiene [métricas](https://developer.chrome.com/docs/crux/api/#metric) que representan la distribución de las experiencias del usuario. Las métricas de distribución son los intervalos de histograma y los percentiles.

```json/11,24
{
  "record": {
    "key": {
      "origin": "https://web.dev"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.7925068547983514
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.1317422195536863
          },
          {
            "start": 4000,
            "density": 0.07575092564795324
          }
        ],
        "percentiles": {
          "p75": 2216
        }
      },
      // ...
    }
  }
}
```

Las propiedades de `start` y `end` del objeto `histogram` representan el rango de valores que experimentan los usuarios para la métrica dada. La propiedad `density` representa la proporción de experiencias de usuario dentro de ese rango. En este ejemplo, el 79% de las experiencias del usuario del LCP en todas las páginas de web.dev están por debajo de los 2500 milisegundos, que es el umbral de LCP definido como ["bueno".](/lcp/#what-is-lcp) Los `percentiles.p75` significa que el 75% de las experiencias de los usuarios en esta distribución fueron menos de 2216 milisegundos. Obtén más información sobre la estructura de la respuesta en la documentación del [cuerpo de la respuesta](https://developer.chrome.com/docs/crux/api/#response-body).

### Errores

Cuando la API de CrUX no tiene ningún dato para un origen determinado, responde con un mensaje de error codificado en JSON:

```json
{
  "error": {
    "code": 404,
    "message": "chrome ux report data not found",
    "status": "NOT_FOUND"
  }
}
```

Para depurar este error, primero verifica que el origen solicitado sea navegable públicamente. Puede probar esto ingresando el origen en la barra de URL de tu navegador y comparándolo con la URL final después de cualquier redireccionamiento. Los problemas comunes incluyen agregar u omitir innecesariamente el subdominio y usar el protocolo HTTP incorrecto.

{% Compare 'worse', 'Error' %}

```json
{"origin": "http://www.web.dev"}
```

{% CompareCaption %} Este origen incluye incorrectamente el protocolo `http://` y el subdominio `www.`. {% endCompareCaption %} {% endCompare %}

{% Compare 'better', 'Success' %}

```json
{"origin": "https://web.dev"}
```

{% CompareCaption %} Este origen es navegable públicamente. {% endCompareCaption %} {% endCompare %}

Si el origen solicitado *es* la versión navegable, este error también puede ocurrir si el origen tiene un número insuficiente de muestras. Todos los orígenes y URL incluidos en el conjunto de datos deben tener una cantidad suficiente de muestras para anonimizar a los usuarios individuales. Además, los orígenes y las URL deben ser [públicamente indexable](https://developers.google.com/search/docs/advanced/crawling/block-indexing). Consulta la [CrUX methodology (metodología CrUX)](https://developer.chrome.com/docs/crux/methodology/#origin-eligibility) para obtener más información sobre cómo se incluyen los sitios web en el conjunto de datos.

## Consulta de datos de URL

Ya aprendiste a cómo consultar la API de CrUX para conocer la experiencia general del usuario en un origen. Para restringir los resultados a una página en particular, usa el parámetro de solicitud de `url`.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://web.dev/fast/"}'
```

Este comando cURL es similar al ejemplo de origen, excepto que el cuerpo de la solicitud usa el parametro `url` para especificar la página a buscar.

Para consultar datos de URL de la API de CrUX en JavaScript, llama a la función [`CrUXApiUtil.query`](#crux-api-util) utilizando el `url` en el cuerpo de la solicitud.

```js/1
CrUXApiUtil.query({
  url: 'https://web.dev/fast/'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

Si existen datos para esta URL en el conjunto de datos de CrUX, la API devolverá una respuesta codificada en JSON como la que se muestra a continuación.

```json/11,24
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.8477304539092148
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.08988202359528057
          },
          {
            "start": 4000,
            "density": 0.062387522495501155
          }
        ],
        "percentiles": {
          "p75": 1947
        }
      },
      // ...
    }
  }
}
```

Fiel a su estilo, los resultados muestran que `https://web.dev/fast/` tiene un 85% de experiencias de LCP "buenas" y un percentil 75 de 1.947 milisegundos, que es ligeramente mejor que la distribución de todo el origen.

### Normalización de URL

La API de CrUX puede normalizar las URL solicitadas para que coincidan mejor con la lista de URL conocidas. Por ejemplo, la consulta de la URL `https://web.dev/fast/#measure-performance-in-the-field` dará como resultado datos para `https://web.dev/fast/` debido a la normalización. Cuando esto suceda, un objeto `urlNormalizationDetails` sera incluido en la respuesta.

```json/8-9
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/"
    },
    "metrics": { ... }
  },
  "urlNormalizationDetails": {
    "normalizedUrl": "https://web.dev/fast/",
    "originalUrl": "https://web.dev/fast/#measure-performance-in-the-field"
  }
}
```

Obtén más información sobre la [URL normalization (normalización de URL)](https://developer.chrome.com/docs/crux/api/#api-response-urlnormalization) en la documentación de CrUX.

## Consulta por factor de forma

{% Aside 'key-term' %} Un factor de forma es el tipo de dispositivo en el que un usuario visita un sitio web. Los tipos de dispositivos comunes incluyen computadoras de escritorio, teléfonos y tabletas. {% endAside%}

Las experiencias de los usuarios pueden variar significativamente según las optimizaciones del sitio web, las condiciones de la red y los dispositivos de los usuarios. Para comprender mejor estas diferencias, profundiza en el origen y el rendimiento de la URL utilizando la dimensión [`formFactor`](https://developer.chrome.com/docs/crux/api/#form-factor) de la API de CrUX.

La API admite tres valores de factor de forma explícitos: `DESKTOP`, `PHONE` y `TABLET`. Además del origen o la URL, especifica uno de estos valores en el [cuerpo de la solicitud](https://developer.chrome.com/docs/crux/api/#request-body) para restringir los resultados solo a esas experiencias de usuario. El siguiente ejemplo demuestra cómo consultar la API por factor de forma usando cURL.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://web.dev/fast/", "formFactor": "PHONE"}'
```

Para consultar la API de CrUX para datos específicos de factor de forma usando JavaScript, llama a la función [`CrUXApiUtil.query`](#crux-api-util) usando los parametros de `url` y `formFactor` en el cuerpo de la solicitud.

```js/1-2
CrUXApiUtil.query({
  url: 'https://web.dev/fast/',
  formFactor: 'PHONE'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

Omitiendo el parametro de `formFactor` equivale a solicitar datos para todos los factores de forma combinados.

```json/11,24
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/",
      "formFactor": "PHONE"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.778631284916204
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.13943202979515887
          },
          {
            "start": 4000,
            "density": 0.08193668528864119
          }
        ],
        "percentiles": {
          "p75": 2366
        }
      },
    // ...
    }
  }
}
```

El campo `key` de la respuesta regresará la configuración solicitud de `formFactor` para confirmar que solo se incluyen las experiencias del teléfono móvil.

{% Aside 'caution' %} Cuanto más detallada sea la solicitud, por ejemplo, una combinación específica de URL y factor de forma, menos experiencias de usuario incluirá. Esto puede dar lugar a errores de "no encontrado" más frecuentes, especialmente al consultar URL menos populares o el tipo de dispositivo de tableta menos popular. {% endAside %}

Recuerda de la sección anterior que el 85% de las experiencias de los usuarios en esta página tenían un LCP definido como "bueno". Compara eso con las experiencias específicas del teléfono, de las cuales solo el 78% se consideran "buenas". El percentil 75 también es más lento entre las experiencias telefónicas, de 1.947 milisegundos a 2.366 milisegundos. La segmentación por factor de forma tiene el potencial de resaltar disparidades más extremas en las experiencias de los usuarios.

## Evaluación del desempeño de Core Web Vitals

El programa [Core Web Vitals](/vitals/#core-web-vitals) define objetivos que ayudan a determinar si una experiencia de usuario o una distribución de experiencias puede considerarse "buena". En el siguiente ejemplo, usamos la API de CrUX y la función [`CrUXApiUtil.query`](#crux-api-util) para evaluar si la distribución de una página web de las métricas de Core Web Vitals (LCP, FID, CLS) es "buena".

```js/1
CrUXApiUtil.query({
  url: 'https://web.dev/fast/'
}).then(response => {
  assessCoreWebVitals(response);
}).catch(response => {
  console.error(response);
});

function assessCoreWebVitals(response) {
  // See https://web.dev/vitals/#core-web-vitals.
  const CORE_WEB_VITALS = [
    'largest_contentful_paint',
    'first_input_delay',
    'cumulative_layout_shift'
  ];
  CORE_WEB_VITALS.forEach(metric => {
    const data = response.record.metrics[metric];
    if (!data) {
      console.log('No data for', metric);
      return;
    }
    const p75 = data.percentiles.p75;
    const threshold = data.histogram[0].end;
    // A Core Web Vitals metric passes the assessment if
    // its 75th percentile is under the "good" threshold.
    const passes = p75 < threshold;
    console.log(`The 75th percentile (${p75}) of ${metric} ` +
        `${passes ? 'passes' : 'does not pass'} ` +
        `the Core Web Vitals "good" threshold (${threshold}).`)
  });
}
```

{% Aside 'gotchas' %} La API solo se puede llamar con un origen o URL a la vez. Para evaluar varios sitios web o páginas, debes de hacer llamadas separadas a la API. {% endAside %}

Los resultados muestran que esta página aprueba las evaluaciones de Core Web Vitals para las tres métricas.

```text
The 75th percentile (1973) of largest_contentful_paint passes the Core Web Vitals "good" threshold (2500).
The 75th percentile (20) of first_input_delay passes the Core Web Vitals "good" threshold (100).
The 75th percentile (0.05) of cumulative_layout_shift passes the Core Web Vitals "good" threshold (0.10).
```

Combinado con una forma automatizada de monitorear los resultados de la API, los datos de CrUX se pueden usar para garantizar que las experiencias del usuario real sean **rápidas** y **permanezcan rápidas**. Para obtener más información sobre Core Web Vitals y cómo medirlos, consulta [Web Vitals](/vitals) y [Herramientas para medir los Core Web Vitals](/vitals-tools).

## ¿Qué sigue?

Las características incluidas en la versión inicial de la API de CrUX solo tocan la superficie de los tipos de información que son posibles con CrUX. Los usuarios del [conjunto de datos CrUX en BigQuery](/chrome-ux-report-bigquery/) pueden estar familiarizados con algunas de las funciones más avanzadas, que incluyen:

- Métricas adicionales
    - `first_paint`
    - `dom_content_loaded`
    - `onload`
    - `time_to_first_byte`
    - `notification_permissions`
- Dimensiones adicionales
    - month (mes)
    - country (país)
    - tipo de conexión efectiva (ECT)
- Granularidad adicional
    - histogramas detallados
    - más percentiles

Con el tiempo, esperamos integrar más de estas características con la facilidad de uso y en los precios gratuitos de la API de CrUX para permitir nuevas formas de explorar los datos y descubrir información sobre el estado de las experiencias de los usuarios en la web.

Consulta los documentos oficiales de la [API de CrUX](https://developer.chrome.com/docs/crux/api/) para [adquirir tu llave API](https://goo.gle/crux-api-key) y explorar más aplicaciones de ejemplo. Esperamos que lo pruebes y nos encantaría escuchar cualquier pregunta o comentario que puedas tener, así que comunícate con nosotros en el [foro de discusión de CrUX](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report). Y para estar al día de todo lo que hemos planeado para la API de CrUX, suscríbete al [foro de anuncios de CrUX](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report-announce) o síguenos en Twitter en [@ChromeUXReport](https://twitter.com/ChromeUXReport).
