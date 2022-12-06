---
layout: post
title: Redes de entrega de contenido (CDN)
authors:
  - katiehempenius
description: Este artículo proporciona una descripción general completa de las redes de entrega de contenido (CDN). Además, explica cómo elegir, configurar y optimizar la instalación de una CDN.
subhead: Mejore el rendimiento mediante el uso de una red de entrega de contenido.
date: 2020-09-22
hero: image/admin/22YYRBuQy8gvQhgllLKq.jpg
tags:
  - blog
  - performance
  - network
---

Las redes de entrega de contenido (CDN) mejoran el rendimiento de los sitios mediante el uso de una red distribuida de servidores para entregar recursos a los usuarios. Debido a que las CDN reducen la carga del servidor, reducen los costos del servidor y son adecuadas para manejar los picos de tráfico. Este artículo analiza cómo funcionan las CDN y proporciona una guía independiente de la plataforma para elegir, configurar y optimizar la instalación de una CDN.

## Descripción general

Una red de entrega de contenido consta de una red de servidores optimizados para entregar contenido rápidamente a los usuarios. Aunque podría decirse que las CDN son más conocidas por ofrecer contenido almacenado en caché, también pueden mejorar la entrega de contenido que no se puede almacenar en caché. En términos generales, cuanto más de su sitio entregue su CDN, mejor.

A un alto nivel, los beneficios de rendimiento de las CDN se derivan de un puñado de principios: los servidores CDN están ubicados más cerca de los usuarios que los [servidores de origen](https://en.wikipedia.org/wiki/Upstream_server) y, por lo tanto, tienen una latencia  más pequeña de [tiempo de ida y vuelta (RTT);](https://en.wikipedia.org/wiki/Round-trip_delay) las optimizaciones de red permiten que las CDN entreguen contenido más rápidamente que si el contenido se cargara "directamente" desde el servidor de origen; por último, las cachés de CDN eliminan la necesidad de una solicitud para viajar al servidor de origen.

{% Aside 'key-term' %} **Servidor de origen** se refiere al servidor del que una CDN recupera contenido. {% endAside %}

### Entrega de recursos

Aunque quizá parezca poco intuitivo, usar una CDN para suministrar recursos (incluso los que no se pueden almacenar en caché) generalmente será más rápido que hacer que el usuario cargue el recurso "directamente" desde sus servidores.

Cuando se utiliza una CDN para entregar recursos desde el origen, se establece una nueva conexión entre el cliente y un servidor CDN cercano. El resto del recorrido (en otras palabras, la transferencia de datos entre el servidor CDN y el origen) ocurre a través de la red CDN, lo que a menudo incluye conexiones persistentes existentes con el origen. Los beneficios de esto son dobles: terminar la nueva conexión lo más cerca posible del usuario elimina los costos innecesarios de configuración de la conexión (establecer una nueva conexión es costoso y requiere múltiples recorridos de ida y vuelta). El uso de una conexión precalentada permite que los datos se transfieran inmediatamente al máximo rendimiento posible.

<figure>{% Img src="image/admin/M9kzM7J7FenUyO7E9MF0.png", alt="Comparación de la configuración de la conexión con y sin CDN", width="800", height="512" %}</figure>

Algunas CDN mejoran esto aún más al enrutar el tráfico hacia el origen a través de múltiples servidores CDN distribuidos por Internet. Las conexiones entre los servidores CDN ocurren a través de rutas confiables y altamente optimizadas, en lugar de rutas determinadas por el [Protocolo de puerta de enlace fronteriza (BGP)](https://en.wikipedia.org/wiki/Border_Gateway_Protocol). Aunque BGP es el protocolo de enrutamiento de facto de Internet, sus decisiones de enrutamiento no siempre están orientadas al rendimiento. Por lo tanto, es probable que las rutas determinadas por BGP tengan un rendimiento menor que las rutas finamente ajustadas entre servidores CDN.

<figure>{% Img src="image/admin/ZLMPFySQgBkpWvgujuJP.png", alt="Comparación de la configuración de la conexión con y sin CDN", width="800", height="449" %}</figure>

### Almacenamiento en caché

El almacenamiento en caché de los recursos en los servidores de una CDN elimina la necesidad de que una solicitud recorra todo el camino hasta el origen para ser atendida. Como resultado, el recurso se entrega más rápidamente; esto también reduce la carga en el servidor de origen.

#### Agregar recursos a la caché

El método más comúnmente utilizado para poblar las cachés de CDN es hacer que la CDN "extraiga" los recursos necesarios, esto se conoce como "extracción de origen". La primera vez que se solicita un recurso en particular desde la caché, la CDN se lo solicitará al servidor de origen y almacenará la respuesta en la caché. De esta manera, el contenido de la caché se acumula con el tiempo a medida que se solicitan recursos adicionales no almacenados en caché.

#### Eliminar recursos de la caché

Los CDN utilizan el vaciado de la caché para eliminar periódicamente de la caché los recursos no tan útiles. Además, los propietarios de sitios pueden utilizar la depuración para eliminar recursos de forma explícita.

- **Desalojo de la caché**

    Las cachés tienen una capacidad de almacenamiento finita. Cuando una caché se acerca a su capacidad, hace espacio para nuevos recursos al eliminar los recursos a los que no se ha accedido recientemente o que ocupan mucho espacio. Este proceso se conoce como desalojo de la caché. El desalojo de un recurso de una caché no significa necesariamente que se haya eliminado de todas las cachés en una red CDN.

- **Depuración**

    La depuración (también conocida como "invalidación de caché") es un mecanismo para eliminar un recurso de las cachés de una CDN sin tener que esperar a que expire o que se desaloje. Normalmente se ejecuta a través de una API. La depuración es fundamental en situaciones en las que es necesario retirar el contenido (por ejemplo, corregir errores tipográficos, errores de precios o artículos de noticias incorrectos). Además de eso, también puede jugar un papel crucial en la estrategia de almacenamiento en caché de un sitio.

    Si una CDN admite una depuración casi instantánea, la depuración se puede utilizar como un mecanismo para administrar el almacenamiento en caché de contenido dinámico: el contenido dinámico se almacena en caché mediante un TTL largo y luego se depura el recurso cada vez que se actualiza. De esta forma, es posible maximizar la duración del almacenamiento en caché de un recurso dinámico, a pesar de no saber de antemano cuándo cambiará el recurso. Esta técnica a veces se denomina "almacenamiento en caché hasta que se le indique".

    Cuando la depuración se usa a escala, generalmente se usa junto con un concepto conocido como "etiquetas de caché" o "claves de caché sustitutas". Este mecanismo permite que los propietarios de sitios asocien uno o más identificadores adicionales (a veces denominados "etiquetas") con un recurso almacenado en caché. Estas etiquetas se pueden utilizar para realizar depuraciones muy granulares. Por ejemplo, puede agregar una etiqueta de "pie de página" a todos los recursos (por ejemplo, `/about`, `/blog`) que contienen el pie de página de su sitio. Cuando se actualice el pie de página, indíquele a su CDN que depure todos los recursos asociados con la etiqueta "pie de página".

#### Recursos almacenables en caché

Si un recurso debe almacenarse en caché, y cómo debe hacerse, depende de si es público o privado; estático o dinámico.

##### Recursos públicos y privados

- **Recursos privados**

    Los recursos privados contienen datos destinados a un solo usuario y, por lo tanto, una CDN no debe almacenarlos en caché. Los recursos privados se indican mediante el encabezado `Cache-Control: private`.

- **Recursos públicos**

    Los recursos públicos no contienen información específica del usuario y, por lo tanto, una CDN los puede almacenar en caché. Un recurso puede ser considerado como almacenable en caché por una CDN si no tiene un encabezado `Cache-Control: no-store` o `Cache-Control: private`. El tiempo que se puede almacenar en caché un recurso público depende de la frecuencia con la que cambia el activo.

##### Contenido dinámico y estático

- **Contenido dinámico**

    El contenido dinámico es el contenido que cambia con frecuencia. Una respuesta de API y una página de inicio de una tienda son ejemplos de este tipo de contenido. Sin embargo, el hecho de que este contenido cambie con frecuencia no impide necesariamente que se almacene en caché. Durante períodos de mucho tráfico, almacenar en caché estas respuestas durante períodos de tiempo muy cortos (por ejemplo, 5 segundos) puede reducir significativamente la carga en el servidor de origen, al tiempo que tiene un impacto mínimo sobre la actualización de los datos.

- **Contenido estático**

    El contenido estático cambia con poca frecuencia, si es que lo hace alguna vez. Las imágenes, los videos y las bibliotecas versionadas suelen ser ejemplos de este tipo de contenido. Debido a que el contenido estático no cambia, debe almacenarse en caché con un período de vida prolongado (TTL), por ejemplo, 6 meses o 1 año.

## Elección de una CDN

El rendimiento suele ser una de las principales consideraciones al elegir una CDN. Sin embargo, las otras características que ofrece una CDN (por ejemplo, características de seguridad y análisis), así como también es importante tener en cuenta los precios, el soporte y la incorporación de una CDN al elegir una CDN.

### Rendimiento

En un nivel alto, la estrategia de rendimiento de una CDN se puede pensar en términos de la compensación entre minimizar la latencia y maximizar la tasa de aciertos de caché. Las CDN con muchos puntos de presencia (PoP) pueden ofrecer una latencia más baja, pero pueden experimentar índices de aciertos de caché más bajos como resultado de la división del tráfico en más cachés. Por el contrario, las CDN con menos PoP pueden estar ubicadas geográficamente más lejos de los usuarios, pero pueden lograr índices de aciertos de caché más altos.

Como resultado de esta compensación, algunas CDN utilizan un enfoque escalonado para el almacenamiento en caché: los PoP ubicados cerca de los usuarios (también conocidos como "cachés perimetrales") se complementan con PoP centrales que tienen índices de aciertos de caché más altos. Cuando una caché perimetral no puede encontrar un recurso, buscará el recurso en un PoP central. Este enfoque intercambia una latencia ligeramente mayor por una mayor probabilidad de que el recurso se pueda servir desde una caché CDN, aunque no necesariamente una caché perimetral.

La compensación entre minimizar la latencia y minimizar la tasa de aciertos de caché es un espectro. Ningún enfoque en particular es universalmente mejor; sin embargo, en función de la naturaleza de su sitio y su base de usuarios, puede encontrar que uno de estos enfoques ofrece un rendimiento significativamente mejor que el otro.

También vale la pena señalar que el rendimiento de una CDN puede variar significativamente según la geografía, la hora del día e incluso los eventos actuales. Aunque siempre es una buena idea hacer su propia investigación sobre el rendimiento de una CDN, puede ser difícil predecir el rendimiento exacto que obtendrá de una CDN.

### Características adicionales

Las CDN suelen ofrecer una amplia variedad de funciones además de su oferta principal de CDN. Las características que se ofrecen comúnmente incluyen: balanceo de carga, optimización de imágenes, transmisión de video, computación en el perímetro y productos de seguridad.

## Cómo instalar y configurar una CDN

Idealmente, debería utilizar una CDN para suministrar los contenidos de todo su sitio. En un nivel alto, el proceso de configuración para esto consiste en registrarse con un proveedor de CDN y luego actualizar su registro DNS CNAME para apuntar al proveedor de CDN. Por ejemplo, el registro CNAME de `www.example.com` podría apuntar a `example.my-cdn.com`. Como resultado de este cambio de DNS, el tráfico a su sitio se enrutará a través de la CDN.

Si usar una CDN para suministrar todos los recursos no es una opción, puede configurar una CDN para que suministre un subconjunto de recursos, por ejemplo, solo recursos estáticos. Puede hacer esto si crea un registro CNAME separado que solo se usará para los recursos que la CDN debería suministrar. Por ejemplo, puede crear un registro CNAME `static.example.com` que apunte a `example.my-cdn.com`. También sería necesario que volviera a escribir las URL de los recursos que la CDN está suministrando para que apunten al subdominio `static.example.com`  que creó.

Aunque su CDN se configurará en este punto, es probable que haya ineficiencias en su configuración. Las siguientes dos secciones de este artículo explicarán cómo aprovechar al máximo su CDN al aumentar la tasa de aciertos de caché y habilitar funciones de rendimiento.

## Mejora de la tasa de aciertos de caché

Una configuración de CDN eficaz suministrará tantos recursos como sea posible desde la caché. Esto se mide comúnmente por la tasa de aciertos de caché (CHR). La tasa de aciertos de caché se define como el número de aciertos de caché dividido por el número de solicitudes totales durante un intervalo de tiempo determinado.

Una caché recién inicializada tendrá una CHR de 0, pero esto aumenta a medida que la caché se llena de recursos. Una CHR del 90% es un buen objetivo para la mayoría de los sitios. Su proveedor de CDN debe proporcionarle análisis e informes sobre su CHR.

Al optimizar la CHR, lo primero que debe verificar es que todos los recursos que se pueden almacenar en caché se almacenan en la caché y se almacenan en ella durante el período de tiempo correcto. Esta es una evaluación simple que se debe realizar en todos los sitios.

El siguiente nivel de optimización de CHR, en términos generales, es ajustar la configuración de su CDN para asegurar que las respuestas del servidor lógicamente equivalentes no se almacenen en caché por separado. Esta es una ineficiencia común que se produce debido al impacto de factores como los parámetros de consulta, las cookies y los encabezados de solicitud en el almacenamiento en caché.

### Auditoria inicial

La mayoría de las CDN proporcionarán análisis de caché. Además, herramientas como [WebPageTest](https://webpagetest.org/) y [Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/) también se pueden utilizar para verificar rápidamente que todos los recursos estáticos de una página se almacenen en caché durante el período de tiempo correcto. Esto se logra al verificar los encabezados de caché HTTP de cada recurso. El almacenamiento en caché de un recurso mediante el uso del tiempo de vida (TTL) máximo apropiado evitará búsquedas de origen innecesarias en el futuro y, por lo tanto, aumentará la CHR.

Como mínimo, uno de estos encabezados generalmente debe configurarse para que una CDE almacene un recurso en caché:

- `Cache-Control: max-age=`
- `Cache-Control: s-maxage=`
- `Expires`

Además, aunque no afecta si un recurso es almacenado en caché por una CDN o cómo se almacena, es una buena práctica establecer también la directiva [`Cache-Control: immutable`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading). `Cache-Control: immutable` indica que un recurso "no se actualizará durante su vida útil". Como resultado, el navegador no revalidará el recurso cuando se suministre desde la caché del navegador, lo que elimina así una solicitud innecesaria del servidor. Desafortunadamente, esta directiva solo es [compatible](https://caniuse.com/#feat=mdn-http_headers_cache-control_immutable) con Firefox y Safari; no es compatible con los navegadores basados en Chromium. Este [problema](https://bugs.chromium.org/p/chromium/issues/detail?id=611416) rastrea la compatibilidad de Chromium con `Cache-Control: immutable`. Destacar este problema puede ayudar a fomentar el soporte para esta función.

Para obtener una explicación más detallada del almacenamiento en caché HTTP, consulte [Evitar solicitudes de red innecesarias con la caché HTTP](/http-cache/) .

### Ajustes de precisión

Una explicación ligeramente simplificada de cómo funcionan los cachés de CDN es que la URL de un recurso se utiliza como clave para almacenar y recuperar el recurso desde la caché. En la práctica, esto sigue siendo abrumadoramente cierto, pero se complica un poco por el impacto de cosas como los encabezados de solicitud y los parámetros de consulta. Como resultado, reescribir las URL de solicitud es una técnica importante tanto para maximizar la CHR como para garantizar que se les brinde el contenido correcto a los usuarios. Una instancia de CDN configurada correctamente logra el equilibrio correcto entre el almacenamiento en caché demasiado granular (lo que perjudica a la CHR) y el almacenamiento en caché insuficientemente granular (lo que da como resultado que se les brinden respuestas incorrectas a los usuarios).

#### Parámetros de consulta

De forma predeterminada, las CDN tienen en cuenta los parámetros de consulta al almacenar un recurso en caché. Sin embargo, pequeños ajustes en el manejo de los parámetros de consulta pueden tener un impacto significativo sobre la CHR. Por ejemplo:

- **Parámetros de consulta innecesarios**

    De forma predeterminada, una CDN almacenaría en caché `example.com/blog` y `example.com/blog?referral_id=2zjk` por separado, aunque probablemente sean el mismo recurso subyacente. Esto se soluciona si se ajusta la configuración de una CDN para ignorar el parámetro de consulta de `referral\_id`.

- **Orden de los parámetros de consulta**

    Una CDN almacenará en caché `example.com/blog?id=123&query=dogs` separado de `example.com/blog?query=dogs&id=123`. Para la mayoría de los sitios, el orden de los parámetros de consulta no importa, por lo que configurar la CDN para ordenar los parámetros de consulta (para normalizar así la URL utilizada para almacenar en caché la respuesta del servidor) aumentará la CHR.

#### Vary

El [encabezado de respuesta Vary](https://developer.mozilla.org/docs/Web/HTTP/Headers/Vary) les informa a las cachés que la respuesta del servidor correspondiente a una URL en particular puede variar según los encabezados establecidos en la solicitud (por ejemplo, los encabezados de solicitud [Accept-Language](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) o [Accept-Encoding](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Encoding)). Como resultado, le indica a una CDN que almacene en caché estas respuestas por separado. El encabezado Vary no es ampliamente compatible con las CDN y puede provocar que un recurso que de otro modo se pueda almacenar en caché no se suministre desde una caché.

Aunque el encabezado Vary puede ser una herramienta útil, el uso inadecuado perjudica a la CHR. Además, si usa `Vary`, normalizar los encabezados de solicitud ayudará a mejorar la CHR. Por ejemplo, sin la normalización, los encabezados de solicitud `Accept-Language: en-US` y `Accept-Language: en-US,en;q=0.9` darían como resultado dos entradas de caché separadas, aunque su contenido probablemente sería idéntico.

#### Cookies

Las cookies se establecen en las solicitudes mediante el encabezado [`Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cookie), se establecen en las respuestas mediante el encabezado `Set-Cookie`. Debe evitarse el uso innecesario del encabezado <a href="https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie" data-md-type="link">`Set-Cookie`</a> dado que las cachés normalmente no almacenarán en caché las respuestas del servidor que contengan este encabezado.

## Características de rendimiento

En esta sección, se analizan las características de rendimiento que suelen ofrecer las CDN como parte de su oferta principal de productos. Muchos sitios se olvidan de habilitar estas funciones, por lo que pierden ventajas fáciles de rendimiento.

### Compresión

Todas las respuestas basadas en texto deben [comprimirse](/reduce-network-payloads-using-text-compression/#data-compression) con gzip o Brotli. Si tiene la opción, elija Brotli en lugar de gzip. Brotli es un algoritmo de compresión más nuevo y, en comparación con gzip, puede lograr relaciones de compresión más altas.

Hay dos tipos de compatibilidad con CDN para la compresión Brotli: "Brotli desde el origen" y "compresión Brotli automática".

#### Brotli desde el origen

Brotli desde el origen es cuando una CDN suministra recursos que el origen comprimió mediante Brotli. Aunque esto puede parecer una característica que todos las CDN deberían admitir de forma inmediata, requiere que una CDN pueda almacenar en caché múltiples versiones (en otras palabras, versiones comprimidas con gzip y comprimidas con Brotli) del recurso correspondiente a una URL determinada.

#### Compresión Brotli automática

La compresión Brotli automática se produce cuando la CDN comprime los recursos con Brotli. Las CDN pueden comprimir tanto los recursos que se pueden almacenar en caché como los que no se pueden almacenar en caché.

La primera vez que se solicita un recurso, se suministra con una compresión "suficientemente buena", por ejemplo, Brotli-5. Este tipo de compresión se aplica tanto a los recursos que se pueden almacenar en caché como a los que no se pueden almacenar en caché.

Mientras tanto, si un recurso se puede almacenar en caché, la CDN utilizará el procesamiento fuera de línea para comprimir el recurso a un nivel de compresión más potente pero mucho más lento, por ejemplo, Brotli-11. Una vez que se completa esta compresión, la versión más comprimida se almacenará en caché y se utilizará para solicitudes posteriores.

#### Prácticas recomendadas de compresión

Los sitios que quieran maximizar el rendimiento deben aplicar la compresión Brotli tanto en su servidor de origen como en su CDN. La compresión Brotli en el origen minimiza el tamaño de transferencia de los recursos que no se pueden suministrar desde la caché. Para evitar retrasos en el procesamiento de las solicitudes, el origen debe comprimir los recursos dinámicos mediante un nivel de compresión bastante conservador, por ejemplo, Brotli-4. Los recursos estáticos se pueden comprimir mediante Brotli-11. Si un origen no es compatible con Brotli, se puede utilizar gzip-6 para comprimir recursos dinámicos; gzip-9 se puede utilizar para comprimir recursos estáticos.

### TLS 1.3

TLS 1.3 es la versión más reciente de [Transport Layer Security (seguridad de capa de transporte) (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), el protocolo criptográfico utilizado por [HTTPS](https://en.wikipedia.org/wiki/HTTPS). TLS 1.3 proporciona una mejor privacidad y rendimiento en comparación con TLS 1.2.

TLS 1.3 acorta el protocolo de enlace TLS de dos recorridos de ida y vuelta a uno. Para las conexiones que utilizan HTTP/1 o HTTP/2, acortar el protocolo de enlace TLS a un recorrido de ida y vuelta reduce efectivamente el tiempo de configuración de la conexión en un 33%.

<figure>{% Img src="image/admin/FnCSj1W23jXaiOWCp0Bw.png", alt="Comparación de los protocolos de acuerdo TLS 1.2 y TLS 1.3", width="800", height="448" %}</figure>

### HTTP/2 y HTTP/3

HTTP/2 y HTTP/3 proporcionan ventajas de rendimiento sobre HTTP/1. De los dos, HTTP/3 ofrece mayores beneficios *potenciales* de rendimiento. HTTP/3 aún no está completamente estandarizado, pero será ampliamente [compatible](https://caniuse.com/#feat=http3) una vez que esto suceda.

#### HTTP/2

Si su CDN aún no ha habilitado [HTTP/2](https://almanac.httparchive.org/en/2019/http2) de forma predeterminada, debería considerar activarlo. HTTP/2 proporciona múltiples [beneficios de rendimiento](https://hpbn.co/http2) sobre HTTP/1 y es [compatible](https://caniuse.com/#feat=http2) con los principales navegadores. Las características de rendimiento de HTTP/2 incluyen: [multiplexación](https://hpbn.co/http2/#request-and-response-multiplexing), [priorización de transmisión](https://hpbn.co/http2/#stream-prioritization), [inserción de servidor](https://almanac.httparchive.org/en/2019/http2#http2-push) y [compresión de encabezado](https://tools.ietf.org/html/rfc7541/).

- **Multiplexación**

    La multiplexación es posiblemente la característica más importante de HTTP/2. La multiplexación permite que una sola conexión TCP atienda a varios pares de solicitud-respuesta al mismo tiempo. Esto elimina la sobrecarga de configuraciones de conexión innecesarias. Dado que la cantidad de conexiones que un navegador puede tener abiertas en un momento determinado es limitada, esto también implica que el navegador ahora puede solicitar más recursos de una página en paralelo. En teoría, la multiplexación elimina la necesidad de optimizaciones HTTP/1 como la concatenación y las hojas de sprites. Sin embargo, en la práctica, estas técnicas seguirán siendo relevantes dado que los archivos más grandes se comprimen mejor.

- **Priorización de los flujos**

    La multiplexación permite múltiples flujos concurrentes; [La priorización de los flujos](https://httpwg.org/specs/rfc7540.html#StreamPriority) proporciona una interfaz para comunicar la prioridad relativa de cada uno de estos flujos. Esto ayuda al servidor a enviar primero los recursos más importantes, incluso si no se solicitaron primero.

el navegador expresa la priorización de los flujos a través de un árbol de dependencias y es simplemente una declaración de *preferencia*: en otras palabras, el servidor no está obligado a cumplir (ni siquiera a considerar) las prioridades proporcionadas por el navegador. La priorización de flujos se vuelve más efectiva cuando se suministra más de un sitio a través de una CDN.

Las implementaciones CDN de la priorización de recursos HTTP/2 varían enormemente. Para identificar si su CDN es compatible completa y correctamente con la priorización de recursos HTTP/2, consulte [¿Ya es rápido HTTP/2?](https://ishttp2fastyet.com/).

Aunque cambiar su instancia de CDN a HTTP/2 es en gran parte una cuestión de activar un interruptor, es importante probar minuciosamente este cambio antes de habilitarlo en producción. HTTP/1 y HTTP/2 usan las mismas convenciones para los encabezados de solicitud y respuesta, pero HTTP/2 es mucho menos indulgente cuando estas convenciones no se cumplen. Como resultado, las prácticas que se alejan de la especificación, como la inclusión de caracteres no ASCII o mayúsculas en los encabezados, pueden comenzar a causar errores una vez que se habilita HTTP/2. Si esto ocurre, los intentos de un navegador de descargar el recurso fallarán. El intento fallido de descarga será visible en la pestaña "Red" de DevTools. Además, se mostrará el mensaje de error "ERR_HTTP2_PROTOCOL_ERROR" en la consola.

#### HTTP/3

[HTTP/3](https://en.wikipedia.org/wiki/HTTP/3) es el sucesor de [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2). A partir de septiembre de 2020, todos los navegadores principales tienen [soporte](https://caniuse.com/#feat=http3) experimental para HTTP/3 y algunas CDN lo admiten. El rendimiento es el principal beneficio de HTTP/3 sobre HTTP/2. Específicamente, HTTP/3 elimina el bloqueo de cabecera en el nivel de la conexión y reduce el tiempo de configuración de la conexión.

- **Eliminación del bloqueo de cabecera**

    HTTP/2 introdujo la multiplexación, una función que permite utilizar una sola conexión para transmitir múltiples flujos de datos simultáneamente. Sin embargo, con HTTP/2, un solo paquete descartado bloquea todos los flujos en una conexión (un fenómeno conocido como bloqueo de cabecera de línea). Con HTTP/3, un paquete descartado solo bloquea un único flujo. Esta mejora es en gran parte el resultado del uso de [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) por parte de HTTP/3 (HTTP/3 usa UDP a través de [QUIC](https://en.wikipedia.org/wiki/QUIC)) en lugar de [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol). Esto hace que HTTP/3 sea particularmente útil para la transferencia de datos a través de redes congestionadas o con pérdidas.

<figure>{% Img src="image/admin/B7YKfqGG4eS2toSoTDdS.png", alt="Diagrama que muestra las diferencias en la transmisión de datos entre HTTP/1, HTTP/2 y HTTP/3", width="800", height="449" %}</figure>

- **Reducción del tiempo de configuración de la conexión**

    HTTP/3 usa TLS 1.3 y, por lo tanto, comparte sus beneficios de rendimiento: establecer una nueva conexión solo requiere un único recorrido de ida y vuelta y reanudar una conexión existente no requiere recorridos de ida y vuelta.

<figure>{% Img src="image/admin/7ffDEjblsisTNsfkynt6.png", alt="Comparación de la reanudación de la conexión entre TLS 1.2, TLS 1.3, TLS 1.3 0-RTT y HTTP/3", width="800", height=" 400 " %}</figure>

HTTP/3 tendrá el mayor impacto en los usuarios con conexiones de red deficientes: no solo porque HTTP/3 maneja la pérdida de paquetes mejor que sus predecesores, sino también porque el ahorro de tiempo absoluto resultante de una configuración de conexión 0-RTT o 1-RTT será mayor en redes con alta latencia.

### Optimización de imagen

Los servicios de optimización de imágenes de CDN generalmente se enfocan en optimizaciones de imágenes que se pueden aplicar automáticamente para reducir el tamaño de las transferencia de imágenes. Por ejemplo: eliminar datos [EXIF](https://en.wikipedia.org/wiki/Exif), aplicar compresión sin pérdida y convertir imágenes a formatos de archivo más nuevos (por ejemplo, WebP). Las imágenes constituyen aproximadamente 50% de los bytes de transferencia en una página web mediana, por lo que la optimización de imágenes puede reducir significativamente el tamaño de la página.

### Minificación

La [minificación](/reduce-network-payloads-using-text-compression/#minification) elimina los caracteres innecesarios de JavaScript, CSS y HTML. Es preferible realizar la minificación en el servidor de origen, en lugar de en la CDN. Los propietarios de sitios tienen más contexto sobre el código que se minificará y, por lo tanto, a menudo pueden utilizar técnicas de minificación más agresivas que las empleadas por las CDN. Sin embargo, si la minificación del código en el origen no es una opción, la minificación por CDN es una buena alternativa.

## Conclusión

- **Use una CDN:** las CDN proveen recursos rápidamente, reducen la carga en el servidor de origen y son útiles para lidiar con picos de tráfico.
- **Almacene el contenido en caché de la manera más agresiva posible:** tanto el contenido estático como el dinámico pueden y deben almacenarse en caché, aunque con diferentes duraciones. Audite periódicamente su sitio para asegurar que está almacenando el contenido en caché de manera óptima.
- **Habilite las funciones de rendimiento de CDN:** las funciones como Brotli, TLS 1.3, HTTP/2 y HTTP/3 mejoran aún más el rendimiento.
