---
title: Arreglar un servidor sobrecargado
subhead: |2-

  Cómo determinar el cuello de botella de un servidor, solucionarlo rápidamente, mejorar su rendimiento y prevenir regresiones.
authors:
  - katiehempenius
date: 2020-03-31
hero: image/admin/5fmiwGShxNngW0sOeKvf.jpg
description: |2-

  Cómo determinar el cuello de botella de un servidor, solucionarlo rápidamente, mejorar su rendimiento y prevenir regresiones.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

## Descripción general

Esta guía te muestra cómo reparar un servidor sobrecargado en 4 pasos:

1. [Evaluar](#assess): Determinar el cuello de botella del servidor.
2. [Estabilizar](#stabilize): Implementar soluciones rápidas para mitigar el impacto.
3. [Mejorar](#improve): Aumentar y optimizar las capacidades del servidor.
4. [Supervisar](#monitor): Utilizar herramientas automatizadas para ayudar a prevenir problemas futuros.

{% Aside %}

Si tienes preguntas o comentarios sobre esta guía, o si deseas compartir tus propios consejos y trucos, deja un comentario en [PR # 2479](https://github.com/GoogleChrome/web.dev/pull/2479).

{% endAside %}

## Evaluar

Cuando el tráfico sobrecarga un servidor, uno o más de los siguientes elementos pueden convertirse en un cuello de botella: CPU, red, memoria o E/S del disco. Identificar cuál de ellos es el cuello de botella permite centrar los esfuerzos en las mitigaciones más impactantes.

- CPU: El uso del CPU que es constantemente superior al 80% debe ser investigado y solucionado. El rendimiento del servidor a menudo se deteriora una vez que el uso del CPU alcanza el ~80-90%, y se vuelve más pronunciado a medida que el uso se acerca al 100%. La utilización del CPU para atender una sola solicitud es insignificante, pero hacerlo a la escala que se encuentra durante los picos de tráfico a veces puede abrumar a un servidor. La descarga de servicios a otra infraestructura, la reducción de operaciones costosas y la limitación de la cantidad de solicitudes reducirán la utilización del CPU.
- Red: Durante los períodos de alto tráfico, el rendimiento de la red requerido para satisfacer las solicitudes de los usuarios puede exceder la capacidad. Algunos sitios, según el proveedor de hosting, también pueden alcanzar los límites de transferencia de datos acumulados. Reducir el tamaño y la cantidad de datos transferidos hacia y desde el servidor eliminará este cuello de botella.
- Memoria: Cuando un sistema no tiene suficiente memoria, los datos tienen que ser descargados al disco para su almacenamiento. El acceso al disco es considerablemente más lento que el de la memoria, y esto puede ralentizar toda la aplicación. Si la memoria se agota por completo, pueden producirse errores de [memoria insuficiente](https://en.wikipedia.org/wiki/Out_of_memory) (en inglés "out of memory", OOM). El ajuste de la asignación de memoria, la reparación de pérdidas de memoria y la actualización de la memoria pueden eliminar este cuello de botella.
- E/S del disco: La velocidad a la que se pueden leer o escribir datos desde el disco está limitada por el propio disco. Si la E/S del disco es un cuello de botella, aumentar la cantidad de datos almacenados en la memoria caché puede aliviar este problema (a costa de una mayor utilización de la memoria). Si esto no funciona, puede que sea necesario actualizar tus discos.

Las técnicas de esta guía se centran en abordar los cuellos de botella del CPU y la red. Para la mayoría de los sitios, el CPU y la red serán los cuellos de botella más relevantes durante un pico de tráfico.

Ejecutar el [`top`](https://linux.die.net/man/1/top) del servidor afectado es un buen punto de partida para investigar los cuellos de botella. Si está disponible, complementa esto con los datos históricos de su proveedor de hosting o herramientas de monitoreo.

## Estabilizar

Un servidor sobrecargado puede provocar rápidamente [fallas en cascada](https://en.wikipedia.org/wiki/Cascading_failure) en otras partes del sistema. Por lo tanto, es importante estabilizar el servidor antes de intentar realizar cambios más significativos.

### Limitación de velocidad

La limitación de la velocidad protege la infraestructura al limitar la cantidad de solicitudes entrantes. Esto es cada vez más importante a medida que se deteriora el rendimiento del servidor: a medida que aumentan los tiempos de respuesta, los usuarios tienden a actualizar activamente la página, lo que aumenta aún más la carga del servidor.

#### Reparar

Aunque rechazar una solicitud es relativamente económico, la mejor manera de proteger tu servidor es gestionar la limitación de la velocidad en algún punto anterior al mismo, por ejemplo, a través de un equilibrador de carga, un proxy inverso o una CDN.

Instrucciones:

- [NGINX](https://www.nginx.com/blog/rate-limiting-nginx/)
- [HAProxy](https://www.haproxy.com/blog/four-examples-of-haproxy-rate-limiting/)
- [Microsoft IIS](https://docs.microsoft.com/iis/configuration/system.applicationhost/sites/site/limits)

Otras lecturas:

- [Estrategias y técnicas de limitación de velocidad](https://cloud.google.com/solutions/rate-limiting-strategies-techniques)

### Almacenamiento en caché HTTP

Busca formas de almacenar contenidos en caché de forma más activa. Si un recurso puede servirse desde un caché HTTP (ya sea el caché del navegador o una CDN), no es necesario solicitarlo al servidor de origen, lo que reduce la carga del servidor.

Los encabezados HTTP como [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control), [`Expires`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Expires) y [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) indican cómo un recurso debe almacenarse en caché mediante un caché HTTP. Auditar y corregir estos encabezados mejorará el almacenamiento en caché.

Aunque [los trabajadores de servicio](https://developer.chrome.com/docs/workbox/service-worker-overview/) también se pueden utilizar para el almacenamiento en caché, utilizan un [caché](https://developer.mozilla.org/docs/Web/API/Cache) separado y son un complemento, en lugar de un reemplazo, para un adecuado almacenamiento en caché HTTP. Por esta razón, cuando se maneja un servidor sobrecargado, los esfuerzos deben centrarse en optimizar el almacenamiento en caché HTTP.

#### Diagnosticar

Ejecuta [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) y observa los [activos estáticos de servicio con una auditoría de política de caché eficiente](https://developers.google.com/web/tools/lighthouse/audits/cache-policy) para ver una lista de recursos con un [tiempo de vida](https://en.wikipedia.org/wiki/Time_to_live) corto o medio (TTL). Para cada recurso enumerado, considera si se debe aumentar el TTL. A título orientativo:

- Los recursos estáticos deben almacenarse en caché con un TTL largo (1 año).
- Los recursos dinámicos deben almacenarse en caché con un TTL breve (3 horas).

#### Reparar

Establece la directiva `max-age` del encabezado [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) en el número apropiado de segundos.

Instrucciones:

- [NGINX](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [apache](http://httpd.apache.org/docs/current/mod/mod_expires.html)
- [Microsoft](https://docs.microsoft.com/iis/configuration/system.webserver/staticcontent/clientcache)

Nota: `max-age` es solo una de las muchas directivas de almacenamiento en caché. Hay muchas otras directivas y encabezados que afectarán el comportamiento de almacenamiento en caché de tu aplicación. Para obtener una explicación más detallada de la estrategia de almacenamiento en caché, se recomienda encarecidamente que leas [Almacenamiento en caché HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching).

### Deterioro gradual

El deterioro gradual es la estrategia de reducir temporalmente la funcionalidad para eliminar el exceso de carga de un sistema. Este concepto se puede aplicar de muchas formas diferentes: por ejemplo, ofreciendo una página de texto estático en lugar de una aplicación con todas las funciones, deshabilitando la búsqueda o devolviendo menos resultados de búsqueda, también deshabilitando ciertas funciones costosas o no esenciales. Se debe hacer hincapié en suprimir las funcionalidades que pueden eliminarse de forma segura y sencilla con un impacto comercial mínimo.

## Mejorar

### Utilizar una red de distribución de contenidos (CDN)

El servicio de activos estáticos se puede descargar desde tu servidor a una red de distribución de contenidos (CDN), reduciendo así la carga.

La función principal de una CDN es entregar los contenidos a los usuarios con rapidez, proporcionando una amplia red de servidores que se encuentran cerca de los usuarios. Sin embargo, la mayoría de las CDN también ofrecen funciones adicionales relacionadas con el rendimiento, la compresión, el equilibrio de carga y la optimización de medios.

#### Configurar una CDN

Las CDN se benefician de la escala, por lo que operar tu propia CDN rara vez tiene sentido. Una configuración básica de CDN es bastante rápida de configurar (~ 30 minutos) y consiste en actualizar los registros DNS para apuntar a la CDN.

#### Optimizar el uso de la CDN

#### Diagnosticar

Identifica los recursos que no se sirven desde una CDN (pero que deberían servirse) ejecutando [WebPageTest](https://webpagetest.org/). En la página de resultados, haz clic en el recuadro situado encima de "Uso efectivo de la CDN" para ver la lista de recursos que deberían servirse desde una CDN.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/awCu4XpFI9IQ1bfhIaWJ.jpg", alt="Arrow pointing to the 'Effective use of CDN' button", width="300", height="109" %} <figcaption> Resultados de WebPageTest</figcaption></figure>

#### Reparar

Si un recurso no está siendo almacenado en caché por la CDN, comprueba que se cumplan las siguientes condiciones:

- Tiene un encabezado [`Cache-Control: public`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Cacheability)
- Tiene un encabezado [`Cache-Control: s-maxage`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Expiration), [`Cache-Control: max-age`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Expiration) o [`Expires`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Expires).
- Tiene un [`Content-Length`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Length), [`Content-Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Range) o[`Transfer-Encoding header`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Transfer-Encoding).

### Ampliar los recursos informáticos

La decisión de ampliar los recursos informáticos debe tomarse con cuidado. Aunque a menudo es necesario, hacerlo prematuramente puede generar una complejidad importante y costos financieros innecesarios.

#### Diagnosticar

Un [tiempo elevado hasta el primer byte](/ttfb/) (TTFB, sus siglas en inglés) puede ser una señal de que un servidor se está acercando a su capacidad. Puede encontrar esta información en la auditoría [Reducir los tiempos de respuesta del servidor (TTFB)](https://developers.google.com/web/tools/lighthouse/audits/ttfb) de Lighthouse.

Para investigar más a fondo, utiliza una herramienta de monitorización para evaluar el uso de la CPU. Si el uso actual o previsto de la CPU supera el 80%, deberías considerar la posibilidad de aumentar tus servidores.

#### Reparar

Agregar un equilibrador de carga permite distribuir el tráfico entre varios servidores. Un equilibrador de carga se encuentra frente a un grupo de servidores y enruta el tráfico al servidor adecuado. Los proveedores de la nube ofrecen sus propios equilibradores de carga ([GCP](https://cloud.google.com/load-balancing), [AWS](https://aws.amazon.com/elasticloadbalancing/), [Azure](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)) o puedes configurar los tuyos propios utilizando [HAProxy](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts) o [NGINX](http://nginx.org/en/docs/http/load_balancing.html). Una vez que se haya implementado un equilibrador de carga, se pueden agregar servidores adicionales.

Además del equilibrio de carga, la mayoría de los proveedores de la nube ofrecen un ajuste de escala automático ([GCP](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling), [AWS](https://docs.aws.amazon.com/ec2/index.html), [Azure](https://docs.microsoft.com/azure/azure-monitor/platform/autoscale-overview)). El ajuste de escala automático funciona junto con el equilibrio de carga: el ajuste de escala automático aumenta y disminuye automáticamente los recursos informáticos en función de la demanda en un momento dado. Este proceso no es mágico: requiere una configuración significativa y se necesita tiempo para que las nuevas instancias se conecten. Debido a la complejidad adicional que conlleva el ajuste de escala automático, primero se debe considerar una configuración más simple basada en el balanceador de carga.

### Habilitar la compresión

Los recursos basados en texto deben comprimirse mediante gzip o brotli. Gzip puede reducir el tamaño de transferencia de estos recursos en aproximadamente un 70%.

#### Diagnosticar

Utiliza la auditoría  [habilitar compresión de texto](https://developers.google.com/web/tools/lighthouse/audits/text-compression) de Lighthouse para identificar los recursos que deben comprimirse.

#### Reparar

Habilita la compresión actualizando la configuración de tu servidor. Instrucciones:

- [NGINX](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [apache](https://httpd.apache.org/docs/trunk/mod/mod_deflate.html)
- [Microsoft](https://docs.microsoft.com/iis/extensions/iis-compression/iis-compression-overview)

### Optimizar imágenes y medios

[Las imágenes constituyen la mayor parte del tamaño de los archivos de la mayoría de los sitios web](https://images.guide/#introduction); la optimización de imágenes puede reducir rápida y significativamente el tamaño de un sitio.

#### Diagnosticar

Lighthouse tiene una variedad de auditorías que marcan las posibles optimizaciones de las imágenes. Otra estrategia consiste en utilizar DevTools para identificar los archivos de imágenes más grandes: estas imágenes serán probablemente buenas candidatas para la optimización.

Auditorías relevantes de Lighthouse:

- [Dimensionar correctamente las imágenes](https://developers.google.com/web/tools/lighthouse/audits/oversized-images)
- [Aplazar las imágenes fuera de la pantalla](https://developers.google.com/web/tools/lighthouse/audits/offscreen-images)
- [Codificación eficiente de imágenes](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/)
- [Servir imágenes en formatos de última generación](https://developers.google.com/web/tools/lighthouse/audits/webp)
- [Utilizar formatos de video para contenidos animados](https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content/)

Flujo de trabajo de Chrome DevTools:

- [Registrar la actividad de la red](https://developer.chrome.com/docs/devtools/network/#load)
- Haz clic en **Img** para [filtrar los recursos que no son imágenes](https://developer.chrome.com/docs/devtools/network/reference/#filter-by-type)
- Haz clic en la columna **Tamaño** para ordenar los archivos de imágenes por tamaño

#### Reparar

*Si tienes tiempo limitado…*

Concentra tu tiempo en identificar imágenes grandes y cargadas con frecuencia y optimizarlas manualmente con una herramienta como [Squoosh](https://squoosh.app/). Las imágenes heroicas suelen ser buenas candidatas para la optimización.

Aspectos a tener en cuenta:

- Tamaño: Las imágenes no deben ser más grandes de lo necesario.
- Compresión: En términos generales, un nivel de calidad de 80-85 tendrá un efecto mínimo en la calidad de la imagen al tiempo que producirá una reducción del 30-40% en el tamaño del archivo.
- Formato: Utiliza archivos JPEG para fotos en lugar de PNG; usa MP4 para [contenido animado](/replace-gifs-with-videos/) en lugar de GIF.

*Si tienes más tiempo…*

Considera la posibilidad de configurar una CDN de imágenes si las imágenes constituyen una parte sustancial de tu sitio. Las CDN de imágenes están diseñadas para servir y optimizar imágenes y descargarán el servicio de imágenes desde el servidor de origen. La configuración de una CDN de imagen es sencilla, pero requiere actualizar las URL de imágenes existentes para que apunten a la CDN de la imagen.

Otras lecturas:

- [Utiliza CDN de imágenes para optimizarlas](/image-cdns/#optimize-your-images)
- [images.guide](https://images.guide/)

### Minificar JS y CSS

La minificación elimina los caracteres innecesarios de JavaScript y CSS.

#### Diagnosticar

Utiliza las auditorías [Minificar CSS](https://developers.google.com/web/tools/lighthouse/audits/minify-css) y [Minificar JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/) de Lighthouse para identificar los recursos que necesitan minificación.

#### Reparar

Si tienes poco tiempo, concéntrate en minificar tu JavaScript. La mayoría de los sitios tienen más JavaScript que CSS, por lo que esto tendrá más impacto.

- [Minificar JavaScript](/reduce-network-payloads-using-text-compression/)
- [Minificar CSS](/minify-css/)

## Monitorizar

Las herramientas de monitorización del servidor proporcionan recopilación de datos, cuadros de mando y alertas sobre su rendimiento. Su uso puede ayudar a prevenir y mitigar problemas futuros de rendimiento del servidor.

La configuración del monitoreo debe ser lo más sencilla posible. La recopilación excesiva de datos y alertas tiene sus costos: cuanto mayor sea el alcance o la frecuencia de la recopilación de datos, más costosa será su recogida y almacenamiento; el exceso de alertas conduce inevitablemente a páginas ignoradas.

Las alertas deben usar métricas que detecten problemas de manera consistente y precisa. El tiempo de respuesta del servidor (latencia) es una métrica que funciona particularmente bien para esto: detecta una amplia variedad de problemas y se correlaciona directamente con la experiencia del usuario. Las alertas basadas en métricas de nivel inferior, como el uso de la CPU, pueden ser un complemento útil, pero detectarán un subconjunto más pequeño de problemas. Además, las alertas deben basarse en el rendimiento observado en la cola (en otras palabras, los percentiles 95 o 99), en lugar de promedios. De lo contrario, los promedios pueden ocultar fácilmente problemas que no afectan a todos los usuarios.

### Reparar

Todos los principales proveedores de nube ofrecen sus propias herramientas de monitoreo ([GCP](https://codelabs.developers.google.com/codelabs/cloud-monitoring-alerting/index.html?index=..%2F..index), [AWS](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/monitoring-system-instance-status-check.html), [Azure](https://docs.microsoft.com/azure/azure-monitor/)). Además, [Netdata](https://github.com/topics/monitoring) es una excelente alternativa gratuita y de código abierto. Independientemente de la herramienta que elijas, deberás instalar el agente de monitoreo de la herramienta en cada servidor que desees supervisar. Una vez completado, asegúrate de configurar las alertas.

Instrucciones:

- [GCP](https://cloud.google.com/monitoring/alerts)
- [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html)
- [Azur](https://docs.microsoft.com/azure/azure-monitor/app/alerts)
- [Netdata](https://docs.netdata.cloud/health/)
