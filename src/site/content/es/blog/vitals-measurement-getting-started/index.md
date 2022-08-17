---
title: Cómo empezar a medir Web Vitals
authors:
  - katiehempenius
date: 2020-05-27
updated: 2022-07-18
hero: image/admin/QxMJKZcue9RS5u05XxTE.png
alt: Gráfico mensual superpuesto con cronómetros etiquetados como LCP, FID y CLS.
description: Aprenda a medir los Web Vitals de su sitio tanto en el mundo real como en entornos de laboratorio.
tags:
  - blog
  - performance
  - web-vitals
---

La recopilación de datos sobre los Web Vitals de su sitio es el primer paso para mejorarlos. Un análisis completo recopilará datos de rendimiento tanto en el mundo real como en entornos de laboratorio. Medir Web Vitals requiere cambios mínimos de código y se puede lograr usando herramientas gratuitas.

## Cómo medir los Web Vitals utilizando los datos del RUM

El [Real User Monitoring: Monitoreo de Usuarios Reales](https://en.wikipedia.org/wiki/Real_user_monitoring) (RUM), también conocido como los datos de campo, capturan el rendimiento experimentado por los usuarios reales de un sitio. Los datos RUM son los que utiliza Google para determinar si un sitio cumple con los [umbrales recomendados por Core Web Vitals.](/vitals/)

### Cómo comenzar

Si no tiene una configuración del RUM, las siguientes herramientas le proporcionarán rápidamente datos sobre el rendimiento de su sitio en el mundo real. Todas estas herramientas se basan en el mismo conjunto de datos subyacente ([Chrome User Experience Report](https://developer.chrome.com/docs/crux/)), pero tienen casos de uso ligeramente diferentes:

- **PageSpeed Insights (PSI)**: [PageSpeed Insights](https://pagespeed.web.dev/) informa sobre el rendimiento agregado a nivel de página y a nivel de origen durante los últimos 28 días. Además, proporciona sugerencias sobre cómo mejorar el rendimiento. Si busca una única acción para comenzar a medir y mejorar los Web Vitals de su sitio web, le recomendamos que utilice PSI para auditar su sitio. PSI está disponible en la [web](https://pagespeed.web.dev/) y como [API](https://developers.google.com/speed/docs/insights/v5/get-started).
- **Search Console**: [Search Console](https://search.google.com/search-console/welcome) informa los datos de rendimiento por página. Esto lo hace adecuado para identificar páginas específicas que necesitan mejoras. A diferencia de PageSpeed Insights, los informes de Search Console incluyen datos históricos de rendimiento. Search Console solo se puede utilizar con sitios de los que seas propietario y cuya propiedad ha sido verificada.
- **Panel de control de CrUX**: el [panel de control de CrUX](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard) es un panel de control preconstruido que muestra los datos de CrUX para un origen de su elección. Está construido sobre Data Studio y el proceso de configuración toma aproximadamente un minuto. En comparación con PageSpeed Insights y Search Console, los informes del panel de CrUX incluyen más dimensiones, por ejemplo, los datos se pueden desglosar por dispositivo y tipo de conexión.

Vale la pena señalar que, aunque las herramientas enumeradas anteriormente son adecuadas para "comenzar" a medir Web Vitals, también pueden ser útiles en otros contextos. En particular, tanto CrUX como PSI están disponibles como API y se pueden utilizar para [crear paneles de control](https://dev.to/chromiumdev/a-step-by-step-guide-to-monitoring-the-competition-with-the-chrome-ux-report-4k1o)  y otros informes.

### Recopilación de datos del RUM

Aunque las herramientas basadas en CrUX son un buen punto de partida para investigar el rendimiento de los Web Vitals, le recomendamos encarecidamente que lo complemente con su propio RUM. Los datos del RUM que recopila usted mismo pueden proporcionar información más detallada e inmediata sobre el rendimiento de su sitio. Esto facilita la identificación de problemas y probar posibles soluciones.

{% Aside %} Las fuentes de datos basadas en CrUX informan de los datos utilizando una granularidad de aproximadamente un mes, sin embargo, los detalles de esto varían ligeramente según la herramienta. Por ejemplo, PSI y Search Console informan del rendimiento observado en los últimos 28 días, mientras que el conjunto de datos y el panel de control de CrUX se desglosan por mes natural. {% endAside %}

Puede recopilar sus propios datos del RUM utilizando un proveedor del RUM especializado, o bien, configurando sus propias herramientas.

Los proveedores del RUM especializado se especializan en la recopilación y presentación de datos del RUM. Para utilizar Core Web Vitals con estos servicios, pregunte a su proveedor del RUM sobre la habilitación de la supervisión de Core Web Vitals para su sitio.

Si no tiene un proveedor del RUM, puede aumentar su configuración de análisis existente para recopilar e informar sobre estas métricas utilizando la [Biblioteca de JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals). Este método se explica con más detalle a continuación.

### Biblioteca de JavaScript web-vitals

Si está implementando su propia configuración del RUM para Web Vitals, la forma más sencilla de recoger las medidas de los Web Vitals es utilizar la Biblioteca de JavaScript [`web-vitals`](https://github.com/GoogleChrome/web-vitals). `web-vitals` es una biblioteca pequeña y modular (~1KB) que proporciona una API conveniente para recopilar y reportar cada una de las [medidas de campo](/user-centric-performance-metrics/#in-the-field) en Web Vitals.

Las métricas que componen Web Vitals no están expuestas directamente por las API de rendimiento integradas en el navegador, sino que se crearon sobre ellas. Por ejemplo, [Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS)](/cls/) se implementa utilizando la [API Layout Instability](https://wicg.github.io/layout-instability/). Al utilizar `web-vitals`, no necesita preocuparse de implementar estas métricas usted mismo. Además, garantiza que los datos que recopila coinciden con la metodología y las prácticas recomendadas para cada métrica.

Para obtener más información sobre la implementación de `web-vitals`, consulte la [documentación](https://github.com/GoogleChrome/web-vitals) y las [Prácticas recomendadas para medir Web Vitals en la guía de campo](/vitals-field-measurement-best-practices/).

### Cómo agregar datos

Es esencial que reporte las medidas recopiladas por `web-vitals`. Si estos datos se miden pero no se reportan, nunca los verá. La documentación de los `web-vitals` incluye ejemplos que muestran cómo enviar los datos a [un endpoint genérico de la API](https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint), [Google Analytics](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics) o [Google Tag Manager](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-tag-manager).

Si ya tiene una herramienta de reportes favorita, considere usarla. De lo contrario, Google Analytics es gratuita y se puede utilizar para este propósito.

Al considerar qué herramienta utilizar, es útil pensar en quién necesitará tener acceso a los datos. Por lo general, las empresas obtienen las mayores ganancias de rendimiento cuando toda la empresa, en lugar de un solo departamento, está interesada en mejorar el rendimiento. Consulte [Cómo corregir la velocidad del sitio web de forma cruzada](/fixing-website-speed-cross-functionally/) para obtener información sobre cómo conseguir la participación de diferentes departamentos.

### Interpretación de los datos

Al analizar los datos de rendimiento, es importante prestar atención a las colas de la distribución. Los datos de RUM con frecuencia revelan que el rendimiento varía ampliamente: algunos usuarios tienen experiencias rápidas, otros tienen experiencias lentas. Sin embargo, el uso de la mediana para resumir los datos puede enmascarar fácilmente este comportamiento.

Con respecto a los Web Vitals, Google utiliza el porcentaje de experiencias "buenas", en vez de estadísticas como medianas o promedios, para determinar si un sitio o página cumple con los umbrales recomendados. Específicamente, para que se considere que un sitio o una página cumple con los umbrales de Core Web Vitals, el 75% de las visitas a la página deben alcanzar el umbral "bueno" para cada métrica.

## Cómo medir los Web Vitals utilizando los datos del laboratorio

Los [datos de laboratorio](/user-centric-performance-metrics/#in-the-lab), también conocidos como datos sintéticos, se recopilan de un entorno controlado, en vez de usuarios reales. A diferencia de los datos del RUM, los datos de laboratorio se pueden recopilar de entornos de preproducción y, por lo tanto, se pueden incorporar a los flujos de trabajo de los desarrolladores y a los procesos de integración continua. Ejemplos de herramientas que recopilan datos sintéticos son Lighthouse y WebPageTest.

### Consideraciones

Siempre habrá discrepancias entre los datos del RUM y los datos de laboratorio, especialmente si las condiciones de la red, el tipo de dispositivo o la ubicación del entorno del laboratorio difieren significativamente de las de los usuarios. Sin embargo, cuando se trata de recopilar datos de laboratorio sobre métricas de Web Vitals en particular, hay un par de consideraciones específicas que es importante tener en cuenta:

- **Cumulative Layout Shift (CLS):** El [Cumulative Layout Shift](/cls/) medido en entornos de laboratorio puede ser artificialmente más bajo que el CLS observado en los datos del RUM. El CLS se define como la "suma total de todas las puntuaciones de cambio de diseño individuales para cada cambio de diseño inesperado que se produce *durante toda la vida útil de la página* ". Sin embargo, la vida útil de una página suele ser muy diferente dependiendo de si la carga un usuario real o una herramienta sintética para medir el rendimiento. Muchas herramientas de laboratorio solo cargan la página, no interactúan con ella. Como resultado, solo capturan los cambios de diseño que se producen durante la carga de la página inicial. Por el contrario, el CLS medido por las herramientas del RUM captura [cambios de diseño inesperados](/cls/#expected-vs.-unexpected-layout-shifts) que ocurren a lo largo de toda la vida útil de la página.
- **First Input Delay: Demora de la primera entrada (FID)** [First Input Delay](/fid/) no se puede medir en entornos de laboratorio porque requiere interacciones del usuario con la página. Como resultado, [Total Blocking Time: Tiempo de bloqueo total](/tbt/) (TBT) es el proxy de laboratorio recomendado para la FID. TBT mide la "cantidad total de tiempo entre First Contentful Paint y Time to Interactive durante el cual la página está bloqueada para responder a la entrada del usuario". Aunque FID y TBT se calculan de manera diferente, ambos son reflejos de un hilo principal bloqueado durante el proceso de arranque. Cuando el proceso principal está bloqueado, el navegador se demora en responder a las interacciones del usuario. FID mide la demora, si lo hay, que se produce la primera vez que un usuario intenta interactuar con una página.

### Herramientas

Estas herramientas se pueden utilizar para recopilar medidas obtenidas en el laboratorio de Web Vitals:

- **Web Vitals Chrome Extension:** la [extensión](https://github.com/GoogleChrome/web-vitals-extension) de los Web Vitals de Chrome mide y reporta los Core Web Vitals (LCP, FID, y CLS) para una página determinada. Esta herramienta está destinada a proporcionar a los desarrolladores comentarios sobre el rendimiento en tiempo real conforme se realizan cambios en el código.
- **Lighthouse:** Lighthouse reporta sobre LCP, CLS y TBT, y también destaca las posibles mejoras en el rendimiento. Lighthouse está disponible en Chrome DevTools, como una extensión de Chrome y como un paquete npm. Lighthouse también se puede incorporar a los flujos de trabajo de integración continua a través de [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).
- **WebPageTest:** [WebPageTest](https://webpagetest.org/) incluye Web Vitals como parte de sus informes estándar. WebPageTest es útil para recopilar información sobre los Web Vitals en condiciones particulares de los dispositivos y las redes.
