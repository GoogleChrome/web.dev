---
layout: post
title: Uso del informe Chrome UX para observar el rendimiento en el campo
authors:
  - rviscomi
description: |2-

  El informe Chrome UX (conocido informalmente como CrUX) es un conjunto de datos públicos de datos de la experiencia del usuario en millones de sitios web. A diferencia de los datos de laboratorio, los datos de CrUX realmente provienen de usuarios  en la vida real que han optado por participar en el estudio.
date: 2020-07-13
updated: 2022-07-18
tags:
  - performance
  - chrome-ux-report
---

El [informe Chrome UX](https://developer.chrome.com/docs/crux/) (conocido informalmente como CrUX) es un conjunto de datos públicos de datos reales de la experiencia del usuario en millones de sitios web. A diferencia de los datos de laboratorio, los datos de CrUX en realidad provienen de [usuarios que han optado por participar](https://developer.chrome.com/docs/crux/methodology/#user-eligibility) en el estudio. Mide las [métricas de Core Web Vitals](/vitals/), incluidas la Largest Contentful Paint:  Despliegue del contenido más extenso (LCP), First Input Delay: Demora de la primera entrada (FID) y Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS), así como métricas de diagnóstico como el Time to First Byte: Tiempo hasta el primer byte (TTFB) y First Contentful Paint: Primer Despliegue de contenido (FCP).

El conjunto de datos también contiene dimensiones cualitativas sobre la experiencia del usuario, por ejemplo, el dispositivo y los tipos de conexión, lo que permite profundizar en las experiencias del usuario agrupadas por tecnologías similares. Consulte la [documentación de CrUX](https://developer.chrome.com/docs/crux/methodology/#metrics) para obtener la lista completa de métricas.

Con estos datos, los desarrolladores pueden comprender la amplia distribución de las experiencias de los usuarios del mundo real entre sitios web, segmentos de la web o la web en su conjunto. ¡Este es muy importante! El conjunto de datos del Informe de Chrome UX es el primero de su tipo que permite a los desarrolladores web comparar el rendimiento de sus usuarios reales con el de la competencia y la industria.

## Cómo usarlo

Hay cuatro formas principales de extraer información del Informe Chrome UX, que varían en complejidad. Para un análisis rápido y sencillo del rendimiento del sitio web, las herramientas recomendadas son [Panel de control de CrUX](http://g.co/chromeuxdash) y [PageSpeed Insights](https://pagespeed.web.dev/). [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report) disminuye la simplicidad del análisis a cambio del poder de la personalización y estadísticas más detalladas. Y la [API](https://developer.chrome.com/docs/crux/api/) permite la integración de datos de alto nivel con otras aplicaciones.

### Panel de control de CrUX

El [Panel de control de CrUX](http://g.co/chromeuxdash) es una herramienta de visualización de datos personalizable del rendimiento histórico de los sitios web integrada en [Data Studio](https://marketingplatform.google.com/about/data-studio/). Los datos provienen del conjunto de datos de BigQuery y todas las consultas SQL se manejan internamente. El panel muestra la distribución de las experiencias del usuario, según lo capturan las métricas clave de rendimiento, y cómo cambia con el tiempo. También muestra cómo las distribuciones de métricas cualitativas, como el tipo de dispositivo y el tipo de conexión efectiva, cambian con el tiempo. Pruebe la [guía del panel de control de Data Studio](/chrome-ux-report-data-studio-dashboard).

### PageSpeed Insights

[PageSpeed Insights](https://pagespeed.web.dev/) muestra las distribuciones de rendimiento más recientes desglosadas por usuarios de escritorio y móviles. Los datos de rendimiento están disponibles para páginas web individuales (además de orígenes enteros) y están agregados por los 28 días de datos más recientes (a diferencia del mes natural anterior en BigQuery). Utilizar esta herramienta es tan fácil como introducir una URL o un origen en el cuadro de búsqueda de la interfaz web, y los datos de rendimiento del campo se muestran junto con sugerencias prescriptivas para optimizar la página. Pruebe la guía [PageSpeed Insights](/chrome-ux-report-pagespeed-insights).

### CrUX en BigQuery

La base de datos CrUX en [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report), parte de Google Cloud Platform (GCP), con una interfaz web y de línea de comandos, aloja los datos sin procesar que agregan métricas clave de rendimiento de UX para los principales orígenes en la web. Periódicamente se agregan nuevas tablas a la base de datos que cubren el mes calendario anterior. Los desarrolladores pueden crear consultas para extraer el conjunto de datos en busca de información específica. BigQuery requiere conocimientos de SQL y un proyecto de GCP con facturación habilitada para ejecutar las consultas. Esta es una herramienta especialmente útil para usuarios avanzados que requieren acceso de bajo nivel a los datos para crear informes personalizados, evaluaciones comparativas e informes sobre el estado de la web. Pruebe la [guía de BigQuery](/chrome-ux-report-bigquery).

### API CrUX

La API de CrUX es una interfaz RESTful gratuita para buscar datos de experiencia de usuario a nivel de URL o de origen. Los datos se actualizan diariamente y agregan los datos de los 28 días anteriores, similar a PageSpeed Insights. Puede utilizar esta API para crear sus propias aplicaciones sobre los datos de la experiencia del usuario real en CrUX. Prueba la guía de la [API de CrUX.](/chrome-ux-report-api)

## Cómo conseguir ayuda

Si necesita algún tipo de apoyo, existen algunos canales para comunicarse con alguien que pueda ayudarlo. [CrUX Google Group](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report) es un foro público para que los usuarios del conjunto de datos hagan preguntas y compartan análisis. También hay una [etiqueta CrUX para Stack Overflow](https://stackoverflow.com/questions/tagged/chrome-ux-report) si necesita ayuda de programación con el acceso a SQL o API. Y finalmente, puede seguir la cuenta de Twitter [@ChromeUXReport](https://twitter.com/ChromeUXReport) para hacer preguntas y escuchar los anuncios de productos.

## Véalo en acción

Para familiarizarse más con los datos disponibles, siga las guías paso a paso para usar BigQuery, Data Studio Dashboard y PageSpeed Insights:

- [CrUX: panel de controlde  Data Studio](/chrome-ux-report-data-studio-dashboard)
- [CrUX: PageSpeed Insights](/chrome-ux-report-pagespeed-insights)
- [CrUX: BigQuery](/chrome-ux-report-bigquery)
- [CrUX: API](/chrome-ux-report-api)
