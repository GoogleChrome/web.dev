---
title: Prácticas recomendadas para medir Web Vitals en el campo
subhead: Cómo medir Web Vitals con su herramienta de análisis actual.
authors:
  - philipwalton
description: Cómo medir Web Vitals con su herramienta de análisis actual
date: 2020-05-27
updated: 2020-07-21
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: Cómo medir Web Vitals con su herramienta de análisis actual
tags:
  - blog
  - performance
  - web-vitals
---

Tener la capacidad de medir e informar sobre el rendimiento real de sus páginas es fundamental para diagnosticar y mejorar el rendimiento a lo largo del tiempo. Sin [datos de campo](/user-centric-performance-metrics/#in-the-field) , es imposible saber con certeza si los cambios que está realizando en su sitio realmente están logrando los resultados deseados.

Muchos proveedores populares de análisis [Real User Monitoring (RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) ya admiten las métricas de [Core Web Vitals](/vitals/#core-web-vitals) en sus herramientas (así como muchas [otras Web Vitals](/vitals/#other-web-vitals)). Si actualmente utiliza una de estas herramientas de análisis RUM, está en condiciones de evaluar si las páginas de su sitio cumplen los [umbrales recomendados por Core Web Vitals](/vitals/#core-web-vitals) y evitar regresiones en el futuro.

Aunque recomendamos utilizar una herramienta de análisis que admita las métricas de Core Web Vitals, si la herramienta de análisis que utiliza actualmente no las admite, no es necesario que cambie. Casi todas las herramientas de análisis ofrecen una forma de definir y medir [métricas personalizadas](https://support.google.com/analytics/answer/2709828) o [eventos](https://support.google.com/analytics/answer/1033068), lo que significa que probablemente pueda utilizar su proveedor de análisis actual para medir las métricas de Core Web Vitals y agregarlas a sus paneles y reportes de análisis actuales.

En esta guía se analizan las prácticas recomendadas para medir las métricas de Core Web Vitals (o cualquier métrica personalizada) con una herramienta de análisis de terceros o interna. También puede servir de guía para los proveedores de análisis que deseen agregar el soporte de Core Web Vitals a su servicio.

## Utilice eventos o métricas personalizadas

Como se mencionó anteriormente, la mayoría de las herramientas de análisis le permiten medir datos personalizados. Si su herramienta de análisis lo permite, debería poder medir cada una de las métricas de Core Web Vitals mediante este mecanismo.

Medir eventos o métricas personalizadas en una herramienta de análisis generalmente es un proceso de tres pasos:

1. [Defina o registre](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827) la métrica personalizada en el administrador de su herramienta (si es necesario). *(Nota: no todos los proveedores de análisis requieren que las métricas personalizadas se definan con anticipación).*
2. Calcule el valor de la métrica en su código JavaScript del frontend.
3. Envíe el valor de la métrica al análisis del backend, asegúrese de que el nombre o el ID coincide con lo que definió en el paso 1 *(de nuevo, si es necesario)*.

Para los pasos 1 y 3, puede consultar la documentación de su herramienta de análisis para obtener instrucciones. Para el paso 2, puede utilizar la Biblioteca de Javascript [web-vitals](https://github.com/GoogleChrome/web-vitals) para calcular el valor de cada una de las métricas de Core Web Vitals.

El siguiente ejemplo de código muestra lo fácil que puede ser realizar un seguimiento de estas métricas en el código y enviarlas a un servicio de análisis.

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
  const body = JSON.stringify({name, value, id});
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## Asegúrese de que puede reportar una distribución

Una vez que haya calculado los valores de cada una de las métricas de Core Web Vitals y los haya enviado a su servicio de análisis mediante una métrica o un evento personalizado, el siguiente paso es crear un informe o un panel que muestre los valores recopilados.

Para asegurarse de que cumple los [umbrales recomendados por Core Web Vitals](/vitals/#core-web-vitals), necesitará que su reporte muestre el valor de cada métrica en el percentil 75.

Si su herramienta de análisis no ofrece informes de percentiles como una función incorporada, probablemente aún pueda obtener estos datos manualmente generando un informe que enumere todos los valores de las métricas clasificados en orden ascendente. Una vez que se genere este informe, el resultado que se encuentre en el 75% de la lista completa y ordenada de todos los valores de ese informe será el percentil 75 para esa métrica, y esto será así independientemente de cómo se segmenten los datos (por tipo de dispositivo, tipo de conexión, país, etc.).

Si su herramienta de análisis no le ofrece un nivel de detalle para realizar reportes a nivel de métricas de forma predeterminada, probablemente pueda conseguir el mismo resultado si su herramienta de análisis admite [dimensiones personalizadas](https://support.google.com/analytics/answer/2709828). Al establecer un valor de dimensión único y personalizado para cada instancia de métrica individual a la que le realiza un seguimiento, debería poder generar un reporte, desglosado por instancias de métrica individuales, si incluye la dimensión personalizada en la configuración del reporte. Dado que cada instancia tendrá un valor de dimensión único, no se producirá ninguna agrupación.

[Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report) es un ejemplo de esta técnica que utiliza Google Analytics. El código del reporte es de [código abierto](https://github.com/GoogleChromeLabs/web-vitals-report), por lo que los desarrolladores pueden consultarlo como un ejemplo de las técnicas descritas en esta sección.

![Capturas de pantalla de Web Vitals](https://user-images.githubusercontent.com/326742/101584324-3f9a0900-3992-11eb-8f2d-182f302fb67b.png)

{% Aside %} Sugerencia: la Biblioteca de Javascript [`web-vitals`](https://github.com/GoogleChrome/web-vitals) proporciona un ID para cada instancia de métrica reportada, lo que permite crear distribuciones en la mayoría de las herramientas de análisis. Consulte la documentación de la interfaz [`Metric`](https://github.com/GoogleChrome/web-vitals#metric) para obtener más información. {% endAside %}

## Envíe sus datos en el momento adecuado

Algunas métricas de rendimiento se pueden calcular una vez que la página haya terminado de cargarse, mientras que otras (como CLS) tienen en cuenta toda la vida útil de la página y solo son definitivas una vez que la página haya comenzado a descargarse.

Sin embargo, esto puede ser problemático ya que los eventos `beforeunload` y `unload` no son confiables (especialmente en móviles) y su uso [no es recomendado](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#legacy-lifecycle-apis-to-avoid) (ya que pueden evitar que una página sea elegible para la función [Back-Forward Cache](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#page-navigation-cache)).

Para las métricas que rastrean toda la vida útil de una página, es mejor enviar el valor actual de la métrica durante el evento `visibilitychange`, siempre que el estado de visibilidad de la página cambie a `hidden`. Esto se debe a que, una vez que el estado de visibilidad de la página cambia a `hidden`, no hay garantía de que cualquier script de esa página pueda volver a ejecutarse. Esto es especialmente cierto en los sistemas operativos móviles, donde la aplicación del navegador en sí se puede cerrar sin que se active ninguna devolución de llamada de páginas.

Tenga en cuenta que los sistemas operativos móviles generalmente activan el evento `visibilitychange` al cambiar de pestaña, se cambia de aplicación o se cierra la propia aplicación del navegador. También activan el evento `visibilitychange` cuando se cierra una pestaña o se navega a una nueva página. Esto hace que el evento `visibilitychange` sea mucho más confiable que los eventos `unload` o `beforeunload`.

{% Aside 'gotchas' %} Debido a [algunos errores del navegador](https://github.com/w3c/page-visibility/issues/59#issue-554880545), hay algunos casos en los que el evento `visibilitychange` no se activa. Si está construyendo su propia biblioteca de análisis, es importante que tenga en cuenta estos errores. Tenga en cuenta que la Biblioteca de Javascript [web-vitals](https://github.com/GoogleChrome/web-vitals) tiene en cuenta todos estos errores. {% endAside %}

## Supervisar el rendimiento a lo largo del tiempo

Una vez que haya actualizado su implementación de análisis para realizar un seguimiento e informar sobre las métricas de Core Web Vitals, el siguiente paso es realizar un seguimiento de cómo los cambios en su sitio afectan al rendimiento a lo largo del tiempo.

### La versión de sus cambios

Un enfoque ingenuo (y en última instancia poco confiable) para el seguimiento de los cambios es implementar los cambios en la producción y luego asumir que todas las métricas recibidas después de la fecha de implementación corresponden al nuevo sitio y todas las métricas recibidas antes de la fecha de implementación corresponden al sitio anterior. Sin embargo, cualquier número de factores (incluyendo el almacenamiento en caché en el HTTP, el trabajador de servicios o la capa CDN) puede evitar que esto funcione.

Un enfoque mucho mejor es crear una versión única para cada cambio implementado y luego rastrear esa versión en su herramienta de análisis. La mayoría de las herramientas de análisis admiten la configuración de una versión. Si el suyo no lo hace, puede crear una dimensión personalizada y establecer esa dimensión en su versión implementada.

### Ejecutar experimentos

Puede llevar el control de versiones un paso más allá mediante el seguimiento de varias versiones (o experimentos) al mismo tiempo.

Si su herramienta de análisis le permite definir grupos de experimentos, utilice esa función. De lo contrario, puede utilizar dimensiones personalizadas para asegurarse de que cada uno de los valores de sus métricas se pueda asociar con un grupo de experimentos en particular en sus reportes.

Con la experimentación en el lugar donde lleva a cabo análisis, puede implementar un cambio experimental en un subconjunto de sus usuarios y comparar el rendimiento de ese cambio con el rendimiento de los usuarios en el grupo de control. Una vez que tenga la seguridad de que un cambio realmente mejora el rendimiento, puede implementarlo en todos los usuarios.

{% Aside %} Los grupos de experimentación siempre deben configurarse en el servidor. Evite utilizar cualquier herramienta de experimentación o prueba A/B que se ejecute del lado del cliente. Por lo general, estas herramientas bloquearán la renderización hasta que se determine el grupo de experimentación de un usuario, lo que puede ser perjudicial para sus tiempos de LCP. {% endAside %}

## Garantizar que el cálculo no afecte al rendimiento

Cuando se mide el rendimiento en usuarios reales, es absolutamente fundamental que cualquier código para medir el rendimiento que esté ejecutando no tenga un impacto negativo en el rendimiento de su página. Si es así, cualquier conclusión que intente sacar sobre cómo afecta su rendimiento a su negocio no será confiable, ya que nunca sabrá si la presencia del propio código de análisis está teniendo el mayor impacto negativo.

Siga siempre estos principios cuando implemente el código de análisis del RUM en su sitio de producción:

### Difiera sus análisis

El código de análisis siempre debe cargarse de forma asincrónica y sin bloqueo y, por lo general, debe cargarse en último lugar. Si carga su código de análisis de forma bloqueada, puede afectar negativamente a LCP.

Todas las API utilizadas para medir las métricas de Core Web Vitals fueron diseñadas específicamente para soportar la carga asíncrona y diferida de scripts (a través de la marca [`buffered`](https://www.chromestatus.com/feature/5118272741572608)), por lo que no es necesario apresurarse para que sus scripts se carguen antes de tiempo.

En el caso de que esté midiendo una métrica que no se puede calcular más adelante en la línea de tiempo de carga de la página, debe incluir *solo* el código que debe ejecutarse antes en el `<head>` de su documento (para que no sea una [solicitud de bloqueo de renderización](/render-blocking-resources/)) y diferir el resto. No cargue todos sus análisis de forma anticipada solo porque una sola métrica lo requiera.

### No cree tareas largas

El código de análisis con frecuencia se ejecuta en respuesta a la entrada del usuario, pero si su código de análisis realiza muchos cálculos del DOM o utiliza otras API que requieren uso intensivo del procesador, el propio código de análisis puede causar una respuesta de entrada deficiente. Además, si el archivo JavaScript que contiene su código de análisis es grande, la ejecución de ese archivo puede bloquear el proceso principal y afectar negativamente a la FID.

### Utilice las API sin bloqueo

API como <code>[sendBeacon()](https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon)</code> y <code>[requestIdleCallback()](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)</code> están diseñadas específicamente para ejecutar tareas no fundamentales de manera que no bloqueen las tareas fundamentales para el usuario.

Estas API son excelentes herramientas para usar en una biblioteca de análisis de RUM.

En general, todas las señales de los análisis deben enviarse utilizando la API `sendBeacon()` (si está disponible), y todo el código de cálculo de análisis pasivos debe ejecutarse durante los periodos de inactividad.

{% Aside %} Para obtener orientación sobre cómo maximizar el uso del tiempo de inactividad y, al mismo tiempo, garantizar que el código se pueda ejecutar con urgencia cuando sea necesario (como cuando un usuario está descargando la página), consulte el patrón [idle-until-urgent](https://philipwalton.com/articles/idle-until-urgent/). {% endAside %}

### No rastree más de lo que necesita

El navegador expone una gran cantidad de datos de rendimiento, pero el hecho de que los datos estén disponibles no significa necesariamente que deba registrarlos y enviarlos a sus servidores para realizar análisis.

Por ejemplo, la [API de tiempo de recursos](https://w3c.github.io/resource-timing/) proporciona datos de tiempo detallados para cada recurso cargado en su página. Sin embargo, es poco probable que todos esos datos sean necesarios o útiles para mejorar el rendimiento de la carga de recursos.

En resumen, no se limite a rastrear los datos porque están ahí, asegúrese de que los datos se utilizarán antes de consumir recursos para realizar su seguimiento.
