---
title: Establecer conexiones de red tempranas para mejorar la velocidad percibida de la página
subhead: Obtenga más información sobre las sugerencias de recursos rel=preconnect y rel=dns-prefetch y cómo usarlas.
date: 2019-07-30
hero: image/admin/Dyccd1RLN0fzhjPXswmL.jpg
alt: La creación de Adán pintada por Miguel Ángel en el techo de la Capilla Sixtina
authors:
  - mihajlija
description: Obtenga más información sobre las sugerencias de recursos rel=preconnect y rel=dns-prefetch y cómo usarlas.
tags:
  - blog
  - performance
---

Antes de que el navegador pueda solicitar un recurso de un servidor, debe establecer una conexión. Establecer una conexión segura implica tres pasos:

- Buscar el nombre de dominio y resolverlo en una dirección IP.

- Configurar una conexión al servidor.

- Cifrar la conexión por seguridad.

En cada uno de estos pasos, el navegador envía un dato a un servidor y el servidor envía una respuesta. Ese viaje, desde el origen hasta el destino y de regreso, se denomina [viaje de ida y vuelta](https://developer.mozilla.org/docs/Glossary/Round_Trip_Time_(RTT)).

Dependiendo de las condiciones de la red, un solo viaje de ida y vuelta puede llevar mucho tiempo. El proceso de configuración de la conexión puede implicar hasta tres viajes de ida y vuelta (y más en casos no optimizados).

Hacernos cargo de todo eso con anticipación hace que las aplicaciones se sientan mucho más rápidas. Esta publicación explica cómo lograr eso con dos sugerencias de recursos: `<link rel=preconnect>` y `<link rel=dns-prefetch>`.

## Establecer conexiones tempranas con `rel=preconnect`

Los navegadores modernos hacen [todo lo posible para anticipar](https://www.igvita.com/posa/high-performance-networking-in-google-chrome/#tcp-pre-connect) qué conexiones necesitará una página, pero no pueden predecirlas todas de manera confiable. La buena noticia es que puede darles una sugerencia (un recurso 😉).

Agregar `rel=preconnect` a un `<link>` informa al navegador que su página tiene la intención de establecer una conexión con otro dominio y que desea que el proceso comience lo antes posible. Los recursos se cargarán más rápido porque el proceso de configuración ya se ha completado cuando el navegador los solicita.

Las sugerencias de recursos obtienen su nombre porque no son instrucciones obligatorias. Proporcionan la información sobre lo que le gustaría que suceda, pero, en última instancia, depende del navegador decidir si ejecutarlos. Configurar y mantener una conexión abierta es mucho trabajo, por lo que el navegador puede optar por ignorar las sugerencias de recursos o ejecutarlas parcialmente según la situación.

Informar al navegador de su intención es tan simple como agregar una etiqueta `<link>` a su página:

```html
<link rel="preconnect" href="https://example.com">
```

{% Img src="image/admin/988BgvmiVEAp2YVKt2jq.png", alt="Un diagrama que muestra cómo la descarga no se inicia durante un tiempo después de que se establece la conexión.", width="800", height="539" %}

Puede acelerar el tiempo de carga entre 100 y 500 ms al establecer conexiones tempranas con importantes orígenes de terceros. Estas cifras pueden parecer pequeñas, pero marcan la diferencia en la forma en que los [usuarios perciben el rendimiento de la página web](/rail/#focus-on-the-user).

{% Aside %} chrome.com [mejoró el tiempo de interacción](https://twitter.com/addyosmani/status/1090874825286000640) en casi 1 s al preconectarse a orígenes importantes. {% endAside %}

## Casos de uso para `rel=preconnect`

### Saber en *dónde*, pero no *lo que* buscas

Debido a las dependencias versionadas, a veces se termina en una situación en la que se sabe que se va a solicitar un recurso de una CDN en particular, pero no la ruta exacta.

<figure>{% Img src="image/admin/PsP4qymb1gIp8Ip2sD9W.png", alt="La URL de un script con el nombre de la versión", width="450", height="50" %} <figcaption>Ejemplo de una URL versionada.</figcaption></figure>

El otro caso común es la carga de imágenes desde una [CDN de imágenes](/image-cdns), donde la ruta exacta de una imagen depende de consultas multimedia o verificaciones de funciones en tiempo de ejecución en el navegador del usuario.

<figure>{% Img src="image/admin/Xx4ai7tzSq12DJsQXaL1.png", alt="Una URL de CDN de imagen con los parámetros size=300x400 y quality=auto.", width="800", height="52" %} <figcaption>Ejemplo de una URL de CDN de imagen.</figcaption></figure>

En estas situaciones, si el recurso que va a buscar es importante, querrá ahorrar tanto tiempo como sea posible conectándose previamente al servidor. El navegador no descargará el archivo hasta que su página lo solicite, pero al menos puede manejar los aspectos de conexión con anticipación, evitando que el usuario tenga que esperar varios viajes de ida y vuelta.

### Streaming de contenido multimedia

Otro ejemplo en el que es posible que desee ahorrar algo de tiempo en la fase de conexión, pero no necesariamente comenzar a recuperar contenido de inmediato, es cuando se transmite contenido multimedia desde un origen diferente.

Dependiendo de cómo maneje su página el contenido transmitido, es posible que desee esperar hasta que sus scripts se hayan cargado y estén listos para procesar la transmisión. La conexión previa lo ayuda a reducir el tiempo de espera a un solo viaje de ida y vuelta una vez que esté listo para comenzar a buscar.

## Cómo implementar `rel=preconnect`

Una forma de iniciar una `preconnect` es agregar una etiqueta `<link>` a la `<head>` del documento.

```html
<head>
    <link rel="preconnect" href="https://example.com">
</head>
```

La conexión previa solo es efectiva para dominios que no sean el dominio de origen, por lo que no debe usarla para su sitio.

{% Aside 'caution' %} Preconéctese solo a los dominios críticos que usará pronto, ya que el navegador cierra cualquier conexión que no se use en 10 segundos. La conexión previa innecesaria puede retrasar otros recursos importantes, así que limite la cantidad de dominios preconectados y [pruebe el impacto que tiene la conexión previa](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/). {% endAside %}

También puede iniciar una conexión previa a través del [encabezado `Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link) HTTP:

`Link: <https://example.com/>; rel=preconnect`

{% Aside %} Una ventaja de especificar una sugerencia de conexión previa en el encabezado HTTP es que no depende del análisis del marcado y puede activarse mediante solicitudes de hojas de estilo, scripts y más. Por ejemplo, Google Fonts envía un encabezado `Link` en la respuesta de la hoja de estilo para preconectarse al dominio que aloja los archivos de fuentes. {% endAside %}

Algunos tipos de recursos, como las fuentes, se cargan de [modo anónimo](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). Para ellos, debe establecer el atributo `crossorigin` con la sugerencia de `preconnect`:

```html
<link rel="preconnect" href="https://example.com/ComicSans" crossorigin>
```

Si omite el atributo `crossorigin`, el navegador solo realiza la búsqueda de DNS.

## Resolver el nombre de dominio temprano con `rel=dns-prefetch`

Una persona recuerda los sitios por sus nombres, pero los servidores los recuerdan por direcciones IP. Por eso existe el sistema de nombres de dominio (DNS). El navegador utiliza DNS para convertir el nombre del sitio en una dirección IP. Este proceso ([resolución de nombres de dominio](https://hacks.mozilla.org/2018/05/a-cartoon-intro-to-dns-over-https/)) es el primer paso para establecer una conexión.

Si una página necesita establecer conexiones con muchos dominios de terceros, conectarlos previamente a todos resulta contraproducente. La sugerencia `preconnect` se usa mejor solo para las conexiones más críticas. Para el resto, use `<link rel=dns-prefetch>` para ahorrar tiempo en el primer paso, la búsqueda de DNS, que suele tardar entre [20 y 120 ms](https://www.keycdn.com/support/reduce-dns-lookups).

La resolución de DNS se inicia de manera similar a la `preconnect`: agregando una etiqueta `<link>` a la `<head>` del documento.

```html
<link rel="dns-prefetch" href="http://example.com">
```

[La compatibilidad del navegador con `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) es ligeramente diferente a la [compatibilidad con](https://caniuse.com/#search=preconnect) [`preconnect`](https://caniuse.com/#search=preconnect), por lo que `dns-prefetch` puede servir como una alternativa para los navegadores que no admiten `preconnect`.

{% Compare 'better' %}

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

{% CompareCaption %} Para implementar de forma segura la alternativa, utilice etiquetas de enlace independientes. {% endCompareCaption %}

{% endCompare %}

{% Compare 'worse' %}

```html
<link rel="preconnect dns-prefetch" href="http://example.com">
```

{% CompareCaption %} La implementación de la alternativa  `dns-prefetch` en la misma etiqueta `<link>` provoca un error en Safari donde la sugerencia `preconnect` se cancela. {% endCompareCaption %}

{% endCompare %}

## Conclusión

Estas dos sugerencias de recursos son útiles para mejorar la velocidad de la página cuando sabe que pronto descargará algo de un dominio de terceros, pero no conoce la URL exacta del recurso. Los ejemplos incluyen CDN que distribuyen bibliotecas, imágenes o fuentes de JavaScript. Tenga en cuenta las limitaciones, use `preconnect` solo para los recursos más importantes, confíe en `dns-prefetch` para el resto y mida siempre el impacto en el mundo real.
