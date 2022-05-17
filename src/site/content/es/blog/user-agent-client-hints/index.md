---
layout: post
title: Cómo mejorar la privacidad del usuario y la experiencia del desarrollador con las sugerencias incluidas en el repositorio User-Agent Client Hints
subhead: Las sugerencias incluidas en el repositorio User-Agent Client Hints son una nueva expansión de la API Client Hints, la cual permite a los desarrolladores acceder a la información sobre el navegador del usuario de una forma sencilla y que mantiene la privacidad.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: Hay un gran variedad de tipos de huellas en la nieve. Eso nos da una pista de quién estuvo allí.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

Las sugerencias que se encuentran en Client Hints permiten a los desarrolladores solicitar información de forma activa sobre el dispositivo o las condiciones del usuario, en lugar de tener que analizarla fuera de la cadena User-Agent (UA). Proporcionar esta ruta alternativa es el primer paso para eventualmente reducir la granularidad de la cadena User-Agent.

Aprenda a actualizar las funciones existentes que se basan en analizar la cadena User-Agent para que en vez de ellas, se utilicen las sugerencias incluidas en el repositorio User-Agent Client Hints.

{% Aside 'caution' %} Si ya utiliza el repositorio User-Agent Client Hints, ponga atención a los próximos cambios. El formato del encabezado está cambiando, de modo que los tokens `Accept-CH` coinciden exactamente con los encabezados devueltos. Anteriormente, un sitio habría enviado `Accept-CH: UA-Platform` para recibir el encabezado `Sec-CH-UA-Platform` y ahora ese sitio debería enviar `Accept-CH: Sec-CH-UA-Platform`. Si ya utiliza las sugerencias incluidas en User-Agent Client Hints, envíe ambos formatos hasta que la modificación se haya implementado completamente y de forma estable en Chromium. Consulte la conversación [Intent to Remove: Rename User-Agent Client Hint ACCEPT-CH tokens](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ) para conocer las actualizaciones recientes. {% endAside %}

## Antecedentes

Cuando los navegadores web realizan solicitudes, agregan información sobre el navegador y su entorno para que los servidores puedan habilitar el análisis y personalizar la respuesta. Esto se definió en 1996.  Consulte el protocolo RFC 1945 para HTTP/1.0, donde encontrará la [definición original de la cadena User-Agent](https://tools.ietf.org/html/rfc1945#section-10.15), y además se incluye un ejemplo:

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

Este encabezado estaba destinado a especificar, según el orden de importancia, el producto (por ejemplo, si se trata de un navegador o de una biblioteca) y un comentario (por ejemplo, la versión).

### El estado de la cadena User-Agent

Con el transcurso de las *décadas*, esta cadena ha acumulado una gran cantidad de información adicional sobre el cliente que realiza la solicitud (al igual que datos no importantes, debido a su compatibilidad con las versiones anteriores). Eso es lo que vemos cuando miramos la cadena actual User-Agent de Chrome:

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

La cadena anterior contiene información sobre el sistema operativo y la versión del usuario, el modelo del dispositivo, la marca del navegador y la versión completa, pistas suficientes para inferir que se trata de un navegador móvil, y no es necesario mencionar una serie de referencias a otros navegadores por razones históricas.

La combinación de estos parámetros con la gran diversidad de valores posibles significa que la cadena User-Agent podría contener suficiente información como para permitir que los usuarios individuales sean identificados de forma única. Si pone a prueba a su propio navegador en [AmIUnique](https://amiunique.org/), podrá ver cuán estrechamente **su** cadena User-Agent puede **identificarlo**. Entre menor sea el "índice de similitud" correspondiente, más exclusivas serán sus solicitudes y más fácil será para los servidores rastrearlo de forma encubierta.

La cadena User-Agent habilita muchos [casos de uso](https://github.com/WICG/ua-client-hints/blob/main/README.md#use-cases) legítimos, y tiene un propósito importante para los desarrolladores y propietarios de sitios. Sin embargo, también es fundamental que la privacidad de los usuarios esté protegida contra métodos de seguimiento encubiertos, y el envío de información desde la UA de forma predeterminada va en contra de ese objetivo.

También es necesario mejorar la compatibilidad de la web cuando se trata de la cadena User-Agent. Esto es algo que no está estructurado, por lo que analizarlo genera una complejidad innecesaria, que a menudo es la causa de errores y problemas de compatibilidad en el sitio los cuales perjudican a los usuarios. Estos problemas también afectan de manera desproporcionada a los usuarios de navegadores menos habituales, ya que es posible que los sitios no hayan probado su configuración.

## Presentación de las nuevas sugerencias incluidas en el repositorio User-Agent Client Hints

Las sugerencias incluidas en el repositorio [User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) permiten el acceso a la misma información, pero de una forma que preserva mejor la privacidad, lo que a su vez permite a los navegadores reducir eventualmente la función predeterminada de la cadena User-Agent para transmitir todo. [Client Hints](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints) impone un modelo en el que el servidor debe solicitar al navegador un conjunto de datos sobre el cliente (las sugerencias) y el navegador aplica sus propias políticas o configuración del usuario para determinar cuáles son los datos que deben devolverse. Esto significa que, en lugar de exponer **toda** la información que contiene User-Agent de forma predeterminada, el acceso ahora se controla de una forma explícita y auditable. Los desarrolladores también se benefician de una API más sencilla: ¡ya no es necesario usar expresiones regulares!

El conjunto actual de Client Hints describe principalmente las capacidades de conexión y visualización del navegador. Puede analizar los detalles en el documento [Automating Resource Selection with Client Hints](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/), pero aquí se muestra un resumen rápido del proceso.

El servidor solicita sugerencias específicas de Client Hint mediante un encabezado:

⬇️ *Respuesta del servidor*

```text
Accept-CH: Viewport-Width, Width
```

O una metaetiqueta:

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

Posteriormente, el navegador puede optar por devolver los siguientes encabezados en solicitudes posteriores:

⬆️ *Solicitud posterior*

```text
Viewport-Width: 460
Width: 230
```

El servidor puede optar por variar sus respuestas, por ejemplo, al proporcionar imágenes con una resolución adecuada.

{% Aside %} Actualmente se discute la posibilidad de habilitar Client Hints en una solicitud inicial, pero es necesario tomar en cuenta la [receptividad del diseño](/responsive-web-design-basics) o mejorarlo progresivamente antes de seguir este camino. {% endAside %}

Las sugerencias incluidas en el repositorio User-Agent Client Hints amplían el rango de propiedades con ayuda del prefijo `Sec-CH-UA`, el cual puede especificarse mediante el encabezado de respuesta del servidor `Accept-CH` Para consultar toda la información sobre este tema, comience con [la explicación](https://github.com/WICG/ua-client-hints/blob/main/README.md) y luego continúe con la [propuesta completa](https://wicg.github.io/ua-client-hints/).

{% Aside %} Las sugerencias de Client Hints **solo se envían a través de conexiones seguras**, por lo tanto, asegúrese de haber [migrado su sitio a HTTPS](/why-https-matters). {% endAside %}

El nuevo conjunto de sugerencias está disponible en Chromium 84, así que descubramos cómo funciona.

## El conjunto de sugerencias User-Agent Client Hints de Chromium 84

Las sugerencias de User-Agent Client Hints solo se habilitarán gradualmente en Chrome Stable a medida que se resuelvan los [problemas de compatibilidad.](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285) Para forzar la funcionalidad durante las pruebas:

- Utilice Chrome 84 **Beta** o una versión similar.
- Habilite el indicador `about://flags/#enable-experimental-web-platform-features`.

De forma predeterminada, el navegador devuelve la marca del navegador, la versión más importante/principal y un indicador si el cliente es un dispositivo móvil:

⬆️ *Todas las solicitudes*

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %} Estas propiedades son más complejas que un valor único, de modo que los [encabezados estructurados](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html) se utilizan para representar listas y valores booleanos. {% endAside %}

### Respuestas de User-Agent y encabezados de solicitud

<style>
.table-wrapper th:nth-of-type(1), .table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ `Accept-CH`<br> ⬆️ Encabezado de solicitud | ⬆️ Solicitar<br> valor de ejemplo | Descripción
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | Lista de marcas de navegadores y su versión significativa.
`Sec-CH-UA-Mobile` | `?1` | Booleano que indica si el navegador está en un dispositivo móvil (`?1` para verdadero) o no (`?0` para falso).
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | La versión completa para el navegador.
`Sec-CH-UA-Platform` | `"Android"` | Se usa en la plataforma del dispositivo, generalmente en el sistema operativo (SO).
`Sec-CH-UA-Platform-Version` | `"10"` | Es la versión para la plataforma o el sistema operativo.
`Sec-CH-UA-Arch` | `"arm"` | Corresponde a la arquitectura subyacente del dispositivo. Si bien esto puede no ser relevante para mostrar la página, es posible que el sitio desee ofrecer una descarga con el formato correcto de forma predeterminada.
`Sec-CH-UA-Model` | `"Pixel 3"` | Es el modelo del dispositivo.

{% Aside 'gotchas' %} Las cuestiones relacionadas con la privacidad y la compatibilidad significan que el valor puede estar en blanco, no haber sido devuelto o se completó con un valor variable. Esto se conoce como [GREASE](https://wicg.github.io/ua-client-hints/#grease). {% endAside %}

### Ejemplo sobre un intercambio

El ejemplo sobre un intercambio se vería de esta manera:

⬆️ *Solicitud inicial del navegador*<br> El navegador solicita la página `/downloads` del sitio y envía su User-Agent básico predeterminado.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️ *Respuesta del servidor*<br> El servidor devuelve la página y, además, solicita la versión completa del navegador y la plataforma.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️ *Solicitudes posteriores*<br> El navegador concede acceso a la información adicional del servidor y envía las sugerencias adicionales en todas las respuestas que recibe posteriormente.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### API de JavaScript

Además de los encabezados, también se puede acceder al User-Agent en JavaScript a través de `navigator.userAgentData`. Es posible acceder a la información predeterminada de los encabezados `Sec-CH-UA` y `Sec-CH-UA-Mobile` mediante las propiedades `brands` y `mobile`, respectivamente:

```js
// Log the brand data
console.log(navigator.userAgentData.brands);

// output
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// Log the mobile indicator
console.log(navigator.userAgentData.mobile);

// output
false;
```

Se accede a los valores adicionales mediante la llamada `getHighEntropyValues()`. El término "alta entropía" es una referencia a la [entropía de la información](https://en.wikipedia.org/wiki/Entropy_(information_theory)), en otras palabras, la cantidad de información que estos valores revelan sobre el navegador del usuario. Al igual que con la solicitud de encabezados adicionales, depende del navegador cuáles son los valores que se devolverán, si los hay.

```js
// Log the full user-agent data
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// output
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### Demostración

Puede probar tanto los encabezados como la API de JavaScript en su propio dispositivo desde [user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me).

{% Aside %} Asegúrese de utilizar Chrome 84 Beta o una versión similar que tenga el indicador `about://flags/#enable-experimental-web-platform-features` habilitado. {% endAside %}

### Hint life-time y restablecimiento

Las sugerencias especificadas a través del encabezado `Accept-CH` se enviarán durante la sesión del navegador o hasta que se establezca un conjunto de sugerencias diferente.

Eso significa que si el servidor envía:

⬇️ *Respuesta*

```text
Accept-CH: Sec-CH-UA-Full-Version
```

Posteriormente, el navegador enviará el encabezado `Sec-CH-UA-Full-Version` en todas las solicitudes de ese sitio hasta que se cierre el navegador.

⬆️ *Solicitudes posteriores*

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

Sin embargo, si se recibe otro encabezado `Accept-CH`, eso **reemplazará por completo** las sugerencias actuales que envía el navegador.

⬇️ *Respuesta*

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️ *Solicitudes posteriores*

```text
Sec-CH-UA-Platform: "Android"
```

**No se enviará** el encabezado `Sec-CH-UA-Full-Version` que se solicitó anteriormente.

Lo mejor es pensar que el encabezado `Accept-CH` especifica el conjunto completo de sugerencias deseables para esa página, lo cual significa que el navegador envía las sugerencias que se especificaron para todos los subrecursos de dicha página. Si bien las sugerencias persisten hasta la siguiente navegación, el sitio no debe confiar ni asumir que se entregarán.

{% Aside 'success' %} Siempre asegúrese de que puede ofrecer una experiencia significativa sin esta información. Pues se trata de mejorar la experiencia del usuario, no de definirla. ¡Por esta razón es que se llaman "sugerencias" y no "respuestas" o "requisitos"! {% endAside %}

También puede usarlo para eliminar de forma efectiva todas las sugerencias que se hayan enviado por el navegador mediante un `Accept-CH` en blanco en la respuesta. Considere incluir eso en cualquier lugar donde el usuario esté restableciendo sus preferencias o cerrando la sesión de su sitio.

Este patrón también coincide con el funcionamiento de las sugerencias a través de la etiqueta `<meta http-equiv="Accept-CH" …>` Las sugerencias que se hayan solicitado únicamente se enviarán en las solicitudes iniciadas por la página y no durante la navegación posterior.

### Objetivos de las sugerencias y solicitudes de tipo cross-origin

De forma predeterminada, las sugerencias Client Hints solo se enviarán en solicitudes que tengan el mismo origen. Eso significa que si solicita sugerencias específicas en `https://example.com`, pero los recursos que desea optimizar están en `https://downloads.example.com`, los recursos**no** recibirán ninguna sugerencia.

Para permitir sugerencias en las solicitudes cross-origin, cada sugerencia y origen deben especificarse mediante un encabezado `Feature-Policy`. Si desea aplicar esto a un User-Agent Client Hint, debe poner la sugerencia en minúsculas y eliminar el prefijo `sec-` Por ejemplo:

⬇️ *Respuesta de `example.com`*

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️ *Solicitud para `downloads.example.com`*

```text
Sec-CH-UA-Platform: "Android"
```

⬆️ *Solicitudes para `cdn.provider` o `img.example.com`*

```text
DPR: 2
```

## ¿Dónde utilizar las sugerencias del repositorio User-Agent Client Hints?

La respuesta rápida es que debe refactorizar cualquier instancia en la que esté analizando al encabezado User-Agent o haciendo uso de cualquiera de las llamadas de JavaScript que tienen acceso a la misma información (es decir, `navigator.userAgent`, `navigator.appVersion` o `navigator.platform` ) para usar User-Agent Client Hints en su lugar.

Para llevar las cosas un paso más allá, debe examinar nuevamente el uso que User-Agent hace de la información y reemplazarlo por otros métodos siempre que sea posible. A menudo, puede lograr el mismo objetivo si utiliza la mejora progresiva, la detección de funciones o un [diseño adaptable](/responsive-web-design-basics). El problema básico de confiar en los datos de User-Agent es que siempre mantiene un mapeo entre la propiedad que está inspeccionando y el comportamiento que habilita. Esto es un exceso de mantenimiento para garantizar que su función de detección sea integral y se permanezca actualizada.

Con estas limitaciones en mente, en el [repositorio User-Agent Client Hints se mencionan algunos casos de uso válidos](https://github.com/WICG/ua-client-hints#use-cases) para los sitios.

## ¿Qué sucede con la cadena User-Agent?

El plan es minimizar la capacidad de rastreo encubierto en la web al reducir la cantidad de información de identidad expuesta por la cadena User-Agent existente, sin causar interrupciones indebidas en los sitios que ya están activos. La introducción de User-Agent Client Hints ahora le brinda una oportunidad para comprender y experimentar con estas nuevas funcionalidades antes de que se efectúen cambios en las cadenas User-Agent.

[Eventualmente](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ), la información en la cadena User-Agent se reducirá para que mantenga el formato heredado mientras solo se proporcione el mismo navegador de alto nivel e información importante sobre la versión dependiendo de las sugerencias predeterminadas. En Chromium, este cambio se ha aplazado al menos hasta el 2021 a fin de que el ecosistema tenga más tiempo para evaluar las nuevas funciones de User Agent Client Hints.

Puede probar una versión de esto habilitando el indicador `about://flags/#reduce-user-agent` de Chrome 93 (Nota: este indicador se llamó `about://flags/#freeze-user-agent` en las versiones de Chrome 84 - 92). Por razones de compatibilidad, solo devolverá una cadena con las entradas históricas, pero incluirá detalles específicos. Por ejemplo, algo como lo siguiente:

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*Foto de [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) en [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
