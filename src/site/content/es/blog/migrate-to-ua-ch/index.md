---
layout: post
title: Migración a los indicadores de cliente de agente de usuario
subhead: Estrategias para migrar su sitio de depender de la cadena de agente de usuario a los nuevos indicadores de cliente de agente de usuario.
authors:
  - rowan_m
date: 2021-05-19
description: Estrategias para migrar su sitio de depender de la cadena de agente de usuario a los nuevos indicadores de cliente de agente de usuario.
hero: image/VWw0b3pM7jdugTkwI6Y81n6f5Yc2/uHTVU6MzCWYVPzLposSy.jpg
alt: Una ruta brillantemente iluminada a través de un paisaje frío y oscuro.
tags:
  - blog
  - privacy
---

La [cadena de agente de usuario](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent) es una importante [superficie de huellas digitales pasivas](https://w3c.github.io/fingerprinting-guidance/#passive) en los navegadores, además de ser difícil de procesar. Sin embargo, existen todo tipo de razones válidas para recopilar y procesar datos de agente de usuario, así que lo que se necesita es una ruta hacia una mejor solución. Los indicadores de cliente de agente de usuario proporcionan una forma explícita de declarar su necesidad de datos de agente de usuario y los métodos para devolver los datos en un formato fácil de usar.

{% Aside %} Para obtener más información sobre los indicadores de cliente y ampliarlos con datos de agente de usuario, lea el [artículo introductorio sobre los indicadores de cliente de agente de usuario](/user-agent-client-hints). {% endAside %}

Este artículo lo guiará a través de la auditoría de su acceso a los datos de agente de usuario y la migración del uso de cadenas de agente de usuario a los indicadores de cliente de agente de usuario.

## Auditar la recopilación y el uso de datos de agentes de usuario

Al igual que con cualquier forma de recopilación de datos, siempre debe comprender **por qué** los recopila. El primer paso, independientemente de si tomará alguna medida o no, es comprender dónde y por qué está utilizando datos de agente de usuario.

Si no sabe si o dónde se están utilizando los datos del agente de usuario, considere buscar en su código de front-end el uso de `navigator.userAgent` y en su código de back-end el uso del encabezado HTTP `User-Agent`. También debe verificar el uso de funciones ya obsoletas en su código de front-end, como `navigator.platform` y `navigator.appVersion`.

Desde un punto de vista funcional, piense en cualquier lugar de su código donde esté registrando o procesando:

- Nombre o versión del navegador
- Nombre o versión del sistema operativo
- Marca o modelo del dispositivo
- Tipo de CPU, arquitectura o bits (por ejemplo, 64 bits)

También es probable que esté utilizando una biblioteca o servicio de terceros para procesar el agente de usuario. En este caso, compruebe si se están actualizando para admitir los indicadores de cliente de agente de usuario.

### ¿Está utilizando solo datos básicos de agente de usuario?

El conjunto predeterminado de indicadores de cliente de agente de usuario incluye:

- `Sec-CH-UA`: nombre del navegador y versión principal/significativa
- `Sec-CH-UA-Mobile`: valor booleano que indica un dispositivo móvil
- `Sec-CH-UA-Platform`: nombre del sistema operativo
    - *Tenga en cuenta que esto se ha actualizado en la especificación y  en breve se [reflejará en Chrome](https://groups.google.com/a/chromium.org/g/blink-dev/c/dafizBGwWMw/m/72l-1zm6AAAJ) y otros navegadores basados en Chromium.*

La versión reducida de la cadena de agente de usuario que se propone también retendrá esta información básica de una manera compatible con versiones anteriores. Por ejemplo, en lugar de `Chrome/90.0.4430.85` la cadena incluiría `Chrome/90.0.0.0`.

Si solo está verificando la cadena de agente de usuario para el nombre del navegador, la versión principal o el sistema operativo, entonces su código seguirá funcionando, aunque es probable que vea advertencias de obsolescencia.

Si bien puede y debe migrar a los indicadores de cliente de agente de usuario, es posible que tenga restricciones de código o recursos heredados que lo impidan. La reducción de información en la cadena de agente de usuario de esta manera compatible con versiones anteriores tiene como objetivo garantizar que, si bien el código existente recibirá información menos detallada, aún debería conservar la funcionalidad básica.

## Estrategia: API JavaScript del lado del cliente bajo demanda

Si actualmente está utilizando `navigator.userAgent`, debe hacer la transición a la preferencia de `navigator.userAgentData` antes de volver a analizar la cadena de agente de usuario.

```javascript
if (navigator.userAgentData) {
  // use los indicadores nuevos
} else {
  // regresar al análisis de la cadena de agenta de usuario
}
```

Si está buscando un dispositivo móvil o de escritorio, use el valor `mobile`

```javascript
const isMobile = navigator.userAgentData.mobile;
```

`userAgentData.brands` es un conjunto de objetos con propiedades `brand` y `version` donde el navegador puede enumerar su compatibilidad con esas marcas. Puede acceder a él directamente como una matriz o puede usar una invocación `some()` para verificar si una entrada específica está presente:

```javascript
function isCompatible(item) {
  // En la vida real es muy probable que tenga aquí reglas más complejas
  return ['Chromium', 'Google Chrome', 'NewBrowser'].includes(item.brand);
}
if (navigator.userAgentData.brands.some(isCompatible)) {
  // El navegador reporta que es compatible
}
```

{% Aside 'gotchas' %} `userAgentData.brands` contendrá valores variables en un orden variable, así que no confíe en algo que aparezca en un índice determinado. {% endAside %}

Si necesita uno de los valores de agente de usuario de alta entropía más detallados, deberá especificarlo y verificar el resultado en la `Promise` devuelta:

```javascript
navigator.userAgentData.getHighEntropyValues(['model'])
  .then(ua => {
    // se solicitaron los indicadores disponibles como atributos
    const model = ua.model
  });

```

También puede utilizar esta estrategia si desea pasar del procesamiento del lado del servidor al procesamiento del lado del cliente. La API de JavaScript no requiere acceso a los encabezados de solicitud HTTP, por lo que los valores de agente de usuario se pueden solicitar en cualquier momento.

{% Aside %} Pruebe la [demostración de la API de JavaScript indicadores de cliente de agente de usuario](https://user-agent-client-hints.glitch.me/javascript.html). {% endAside %}

## Estrategia: encabezado estático del lado del servidor

Si está utilizando el encabezado de solicitud de `agente de usuario` en el servidor y sus necesidades de esos datos son relativamente consistentes en todo su sitio, entonces puede especificar los indicadores de cliente deseados como un conjunto estático en sus respuestas. Este es un enfoque relativamente simple, ya que generalmente solo necesita configurarlo en una ubicación. Por ejemplo, puede estar en la configuración de su servidor web si ya agrega encabezados allí, la configuración de su alojamiento o la configuración de nivel superior del marco o plataforma que usa para su sitio.

Considere esta estrategia si está transformando o personalizando las respuestas entregadas en función de los datos del agente de usuario.

{% Aside %} También puede considerar migrar a la estrategia de [API de JavaScript del lado del cliente bajo demanda](#strategy-on-demand-client-side-javascript-api) en lugar de enviar encabezados adicionales. {% endAside %}

Los navegadores u otros clientes pueden optar por proporcionar diferentes indicadores predeterminados, por lo que es una buena práctica especificar todo lo que necesita, incluso si generalmente se proporciona de forma predeterminada.

Por ejemplo, los valores predeterminados actuales para Chrome se representarían como:

⬇️ Encabezados de respuesta

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA
```

Si también desea recibir el modelo del dispositivo en las respuestas, debe enviar:

⬇️ Encabezados de respuesta

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA
```

{% Aside 'gotchas' %} El orden no es importante, el ejemplo se enumera alfabéticamente. {% endAside %}

Al procesar esto en el lado del servidor, primero debe verificar si se ha enviado el encabezado `Sec-CH-UA` deseado y luego regresar al encabezado `User-Agent` si no está disponible.

{% Aside %} Pruebe la [demostración del encabezado HTTP indicadores de clientes de agente de usuario](https://user-agent-client-hints.glitch.me/). {% endAside %}

## Estrategia: delegación de indicadores a solicitudes de origen cruzado

Si solicita subrecursos de origen cruzado o entre sitios que requieren que se envíen indicadores de cliente de agente de usuario en sus solicitudes, deberá especificar explícitamente los indicadores deseados mediante una política de permisos.

{% Aside %} La [política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) es la nueva forma de política de funciones {%  endAside %}

Por ejemplo, digamos que `https://blog.site` aloja recursos en `https://cdn.site` que puede devolver recursos optimizados para un dispositivo específico. `https://blog.site` puede solicitar el indicador `Sec-CH-UA-Model`, pero debe delegarlo explícitamente en `https://cdn.site` mediante el encabezado `Permissions-Policy`. La lista de indicadores controlados por políticas está disponible en el [borrador de infraestructura de indicadores para clientes](https://wicg.github.io/client-hints-infrastructure/#policy-controlled-client-hints-features).

⬇️ Respuesta de `blog.site` para delegar el indicador

```text
Accept-CH: Sec-CH-UA-Model
Permissions-Policy: ch-ua-model=(self "https://cdn.site")
```

⬆️ La solicitud de los subrecursos en `cdn.site` incluye el indicador delegado

```text
Sec-CH-UA-Model: "Pixel 5"
```

Puede especificar múltiples indicadores para múltiples orígenes y no solo del rango `ch-ua`:

⬇️ Respuesta de `blog.site` para delegar múltiples indicadores a múltiples orígenes

```text
Accept-CH: Sec-CH-UA-Model, DPR
Permissions-Policy: ch-ua-model=(self "https://cdn.site"),
                    ch-dpr=(self "https://cdn.site" "https://img.site")
```

{% Aside 'gotchas' %} No **es** necesario que incluya cada indicador delegado en `Accept-CH`, pero **sí** necesita incluir `self` para cada indicador, incluso si no lo está utilizando directamente en el nivel superior. {% endAside %}

## Estrategia: Delegar indicadores a iframes

Los iframes de origen cruzado funcionan de manera similar a los recursos de origen cruzado, pero usted especifica los indicadores que le gustaría delegar en el atributo `allow`.

⬇️ Respuesta de `blog.site`

```text
Accept-CH: Sec-CH-UA-Model
```

↪️ HTML para `blog.site`

```html
<iframe src="https://widget.site" allow="ch-ua-model"></iframe>
```

⬆️ Solicitud a `widget.site`

```text
Sec-CH-UA-Model: "Pixel 5"
```

El atributo `allow` en el iframe anulará cualquier encabezado `Accept-CH` que `widget.site` pueda enviarse a sí mismo, así que asegúrese de haber especificado todo lo que necesitará el sitio con iframe.

## Estrategia: indicadores dinámicos del lado del servidor

Si tiene partes específicas del recorrido del usuario en las que necesita una selección más amplia de indicadores que en el resto del sitio, puede optar por solicitar esos indicadores a pedido en lugar de estáticamente en todo el sitio. Esto es más complejo de administrar, pero si ya configuró diferentes encabezados por ruta, puede ser factible.

Lo importante a recordar aquí es que cada instancia del encabezado `Accept-CH` sobrescribirá efectivamente el conjunto existente. Por lo tanto, si está configurando dinámicamente el encabezado, cada página debe solicitar el conjunto completo de indicadores requeridos.

Por ejemplo, puede tener una sección en su sitio donde desee proporcionar iconos y controles que coincidan con el sistema operativo del usuario. Para esto, es posible que desee incorporar adicionalmente `Sec-CH-UA-Platform-Version` para suministrar los subrecursos apropiados.

⬇️ Encabezados de respuesta para `/blog`

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA
```

⬇️ Encabezados de respuesta para `/app`

```text
Accept-CH: Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA
```

## Estrategia: se requieren indicadores del lado del servidor en la primera solicitud

Puede haber casos en los que requiera más indicadores que el conjunto predeterminado de indicadores en la primera solicitud. Sin embargo, es probable que esto sea raro, así que asegúrese de revisar el razonamiento.

La primera solicitud realmente significa la primera solicitud de nivel superior para ese origen enviada en esa sesión de navegación. El conjunto predeterminado de indicadores incluye el nombre del navegador con la versión principal, la plataforma y el indicador móvil. Entonces, la pregunta que debe hacerse aquí es, ¿necesita datos extendidos en la carga de la página inicial?

{% Aside %} Considere también hacer uso de la [estrategia de API de JavaScript del lado del cliente bajo demanda](#strategy-on-demand-client-side-javascript-api) para modificar el contenido dentro de la página en lugar del lado del servidor. {% endAside %}

Para obtener indicadores adicionales durante la primera solicitud, hay dos opciones. Primero, puede hacer uso del encabezado `Critical-CH`. Esto toma el mismo formato que `Accept-CH` pero le dice al navegador que debe reintentar inmediatamente la solicitud si la primera se envió sin el indicador crítico.

⬆️ Solicitud inicial

```text
[With default headers]
```

⬇️ Encabezados de respuesta

```text
Accept-CH: Sec-CH-UA-Model
Critical-CH: Sec-CH-UA-Model
```

🔃 El navegador vuelve a intentar la solicitud inicial con el encabezado adicional

```text
[With default headers + …]
Sec-CH-UA-Model: Pixel 5
```

Esto incurrirá en la sobrecarga del reintento durante la primera solicitud, pero el costo de implementación es relativamente bajo. Envíe el encabezado adicional y el navegador hará el resto.

{% Aside 'gotchas' %} Cualquier valor de `Critical-CH` debe ser un subconjunto de los valores en `Accept-CH` . `Accept-CH` incluye todos los valores que le gustaría para la página, `Critical-CH` es el subconjunto de esos valores que **debe** tener o no podrá cargar la página correctamente. {% endAside %}

Para situaciones en las que realmente requiera indicadores adicionales en la carga de la primera página, la [propuesta de confiabilidad de indicadores de cliente](https://github.com/WICG/client-hints-infrastructure/blob/main/reliability.md#connection-level-settings) establece una ruta para especificar indicadores en la configuración del nivel de conexión. Esto hace uso de la extensión de [Configuraciones del protocolo de la capa de aplicaciones(ALPS)](https://tools.ietf.org/html/draft-vvv-tls-alps) a TLS 1.3 para habilitar esta transmisión temprana de indicadores en las conexiones HTTP/2 y HTTP/3. Esto aún se encuentra en una etapa muy temprana, pero si administra activamente su propio TLS y la configuración de conexión, este es un momento ideal para contribuir.

## Estrategia: soporte heredado

Es posible que tenga un código heredado o de terceros en su sitio que dependa de `navigator.userAgent`, incluidas partes de la cadena de agente de usuario que se reducirán. A largo plazo, debe planificar pasarse a las invocaciones `navigator.userAgentData` equivalentes, pero hay una solución provisional.

{% Aside 'warning' %} Esto no se recomienda y no se admite de ninguna manera. Esta solución se incluye por razones de integridad, pero si dedica algún tiempo a intentar la corrección errores en ella, sería mejor invertir ese tiempo en la migración real. {% endAside %}

[UA-CH retrofill](https://github.com/GoogleChromeLabs/uach-retrofill) es una pequeña biblioteca que le permite sobrescribir `navigator.userAgent` con una nueva cadena construida a partir de los valores de `navigator.userAgentData`.

Por ejemplo, este código generará una cadena de agente de usuario que además incluye el indicador de "modelo":

```javascript
import { overrideUserAgentUsingClientHints } from './uach-retrofill.js';
overrideUserAgentUsingClientHints(['model'])
  .then(() => { console.log(navigator.userAgent); });
```

La cadena resultante mostraría el modelo `Pixel 5`, pero aún muestra el `92.0.0.0` reducido ya que no se solicitó el indicador `uaFullVersion`:

```text
Mozilla/5.0 (Linux; Android 10.0; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.0.0 Mobile Safari/537.36
```

## Soporte adicional

Si estas estrategias no cubren su caso de uso, inicie una [Discusión en el repositorio privacy-sandbox-dev-support](https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/discussions) para poder explorar su problema juntos.

*Foto de [Ricardo Rocha](https://unsplash.com/@rcrazy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) en [Unsplash](https://unsplash.com/photos/nj1bqRzClq8)*
