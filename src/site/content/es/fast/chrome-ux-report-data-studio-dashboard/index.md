---
layout: post
title: Uso del panel de CrUX en Data Studio
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: |
  Data Studio es una poderosa herramienta de visualización de datos que le permite crear
  paneles con base en fuentes de macrodatos, como el Chrome UX Report. En esta
  guía, aprenda a crear su propio panel CrUX personalizado para rastrear la
  experiencia de usuario de un origen.
date: 2020-06-22
updated: 2022-07-18
tags:
  - performance
  - blog
  - chrome-ux-report
---

[Data Studio](https://marketingplatform.google.com/about/data-studio/) es una poderosa herramienta de visualización de datos que le permite crear paneles con base en fuentes de macrodatos, como el [Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX). En esta guía, aprenda a generar su propio panel CrUX personalizado para realizar un seguimiento de las tendencias en la experiencia del usuario de un origen.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="Panel de control del CrUX", width= "800", height="598" %}

El panel CrUX está construido con una función de Data Studio llamada [Conectores Comunitarios](https://developers.google.com/datastudio/connector/). Este conector es un vínculo preestablecido entre los datos no procesados de CrUX en [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report) y las visualizaciones de Data Studio. Elimina la necesidad de que los usuarios del tablero digiten consultas o generen gráficos. Fue construido con usted en mente; todo lo que necesita es proporcionar un origen y se generará un panel personalizado a su medida.

## Creando un panel

Para comenzar, vaya a [g.co/chromeuxdash](https://g.co/chromeuxdash). Esto lo llevará a la página del conector de la comunidad CrUX, donde puede proporcionar el origen para el cual se generará el panel. Tenga en cuenta que es posible que los usuarios nuevos tengan que completar las solicitudes de permiso o preferencias de marketing.

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="Conector de panel CrUX", width="800", height="484" %}

El campo de entrada de texto solo acepta orígenes, no URL completas. Por ejemplo:

{% Compare 'mejor', 'Origin (Soportado)'%}

```text
https://web.dev
```

{% endCompare %}

{% Compare "peor", "URL (No soportado)" %}

```text
https://web.dev/chrome-ux-report-data-studio-dashboard/
```

{% endCompare %}

Si omite el protocolo, se asume HTTPS. Los subdominios son importantes, por ejemplo, `https://developers.google.com` y `https://www.google.com` se consideran orígenes diferentes.

Algunos problemas comunes con los orígenes incluyen introducir el protocolo incorrecto, por ejemplo, `http://` lugar de `https://`, y omitir el subdominio cuando sea necesario. Algunos sitios web incluyen redireccionamientos, por lo que si `http://example.com` redirecciona a `https://www.example.com`, entonces debería usar este último, que es la versión canónica del origen. Como regla general, utilice el origen que los usuarios ven en la barra de URL.

Si su origen no está incluido en el conjunto de datos de CrUX, es posible que reciba un mensaje de error como el que se muestra a continuación. Hay más de 4 millones de orígenes en el conjunto de datos, pero es posible que el que desee no tenga suficientes datos para incluirlo.

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="Mensaje de error del panel CrUX", width="800", height="409" %}

Si el origen existe, se le dirigirá a la página de esquema del panel. Esta página muestra todos los campos incluidos: cada tipo de conexión efectiva, cada factor de forma, el mes de la publicación del conjunto de datos, la distribución del rendimiento para cada métrica y, por supuesto, el nombre del origen. No hay nada que deba hacer o cambiar en esta página, simplemente haga clic en **Crear informe** para continuar.

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="Esquema del panel CrUX", width="800", height="403" %}

## Uso del panel

Cada panel viene con tres tipos de páginas:

1. Descripción general de Core Web Vitals
2. Rendimiento de las métricas
3. Demografía de usuarios

Cada página incluye un gráfico que muestra las distribuciones a lo largo del tiempo para cada lanzamiento mensual disponible. A medida que se lanzan nuevos conjuntos de datos, simplemente puede actualizar el panel para obtener los datos más recientes.

Los conjuntos de datos mensuales se publican el segundo martes de cada mes. Por ejemplo, el conjunto de datos que consta de datos de la experiencia del usuario del mes de mayo se publica el segundo martes de junio.

### Descripción general de Core Web Vitals

La primera página es una descripción general del rendimiento [mensual de Core Web Vitals del origen.](/vitals/) Estas son las métricas de UX más importantes, por lo que Google recomienda que se concentre en estas.

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="Descripción general del Panel CrUX Core Web Vitals", width="800", height="906" %}

Utilice la página Core Web Vitals para entender cómo los usuarios de computadoras de escritorio y teléfonos perciben el origen. De forma predeterminada, se selecciona el mes más reciente en el momento en que creó el panel. Para cambiar entre versiones mensuales más antiguas o más nuevas, use el filtro  **Mes** en la parte superior de la página.

Tenga en cuenta que los tablets se omiten de estos gráficos de forma predeterminada, pero si es necesario, puede eliminar el filtro **Sin tablets** en la configuración del gráfico de barras, que se muestra a continuación.

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="Editando el panel CrUX para mostrar tablets en la página de Core Web Vitals", width="800", height="288" %}

### Rendimiento de las métricas

Después de la página Core Web Vitals, encontrará páginas independientes para todas las [métricas](https://developer.chrome.com/docs/crux/methodology/#metrics) en el conjunto de datos de CrUX.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="Página de LCP del panel de CrUX", width="800", height="598" %}

En la parte superior de cada página se encuentra el filtro **Dispositivos**, que puede usarse para restringir los factores de forma incluidos en los datos de experiencia. Por ejemplo, puede profundizar específicamente en las experiencias telefónicas. Esta configuración persiste en todas las páginas.

Las visualizaciones principales en estas páginas son las distribuciones mensuales de experiencias categorizadas como "Buena", "Necesita mejorar" y "Deficiente". La leyenda codificada por colores debajo del gráfico indica las diversas experiencias incluidas en la categoría. Por ejemplo, en la captura de pantalla anterior, puede ver que el porcentaje de experiencias "buenas" de [Largest Contentful Paint](/lcp/#what-is-a-good-lcp-score) (LCP) fluctúa y empeora ligeramente en los últimos meses.

Los porcentajes de experiencias "buenas" y "malas" del mes más reciente se muestran encima del gráfico junto con un indicador de la diferencia porcentual con respecto al mes anterior. Para este origen, las experiencias "buenas" de LCP cayeron un 3.2% llegando a 56.04% mes a mes.

{% Aside 'caution' %} Debido a una peculiaridad con Data Studio, es posible que a veces vea `No Data` aquí. Esto es normal y se debe a que el lanzamiento del mes anterior no estaba disponible hasta el segundo martes. {% endAside %}

Además, para métricas como LCP y otros Core Web Vitals que ofrecen recomendaciones explícitas de percentiles, encontrará la métrica "P75" entre los porcentajes "buenos" y "malos". Este valor corresponde al percentil 75 de experiencias de usuario del origen. En otras palabras, el 75% de las experiencias son mejores que este valor. Una cosa a tener en cuenta es que esto se aplica a la distribución general de *todos los dispositivos* en el origen. Al alternar dispositivos específicos con el filtro **Dispositivos** no se volverá a calcular el percentil.

{% Details %} {% DetailsSummary %} Advertencias técnicas aburridas sobre los percentiles {% endDetailsSummary%}

Tenga en cuenta que las métricas de percentiles se basan en los datos del histograma de [BigQuery](/chrome-ux-report-bigquery/), por lo que la granularidad será aproximada: 1000 ms para LCP, 100 ms para FID y 0.05 para CLS. En otras palabras, un P75 LCP de 3800ms indica que el percentil 75 verdadero está entre 3800ms y 3900ms.

Además, el conjunto de datos de BigQuery utiliza una técnica denominada "distribución por rangos" en la que las densidades de las experiencias de los usuarios se agrupan intrínsecamente en intervalos muy generales de granularidad decreciente. Esto nos permite incluir densidades diminutas en la cola de la distribución sin tener que superar los cuatro dígitos de precisión. Por ejemplo, los valores de LCP inferiores a 3 segundos se agrupan en rangos de 200 ms de ancho. Entre 3 y 10 segundos, los rangos tienen 500 ms de ancho. Más allá de 10 segundos, los rangos tienen 5000 ms de ancho, etc. En lugar de tener rangos de diferentes anchos, la distribución por rangos garantiza que todos los rangos tengan un ancho constante de 100 ms (el mayor común divisor) y la distribución se interpola linealmente en cada rango.

Los valores de P75 correspondientes en herramientas como PageSpeed Insights no se basan en el conjunto de datos público de BigQuery y pueden proporcionar valores de precisión de milisegundos. {% endDetails %}

### Demografía de usuarios

Hay dos [dimensiones](https://developer.chrome.com/docs/crux/methodology/#dimensions) incluidas en las páginas de datos demográficos del usuario: dispositivos y tipos de conexión efectiva (ECT). Estas páginas ilustran la distribución de las visitas a las páginas en todo el origen para los usuarios de cada grupo demográfico.

La página de distribución de dispositivos muestra el desglose de los usuarios de teléfonos, computadoras de escritorio y tablets a lo largo del tiempo. Varios orígenes tienden a tener pocos o ningún dato de tablets, por lo que a menudo verá un "0%" próximo al borde del gráfico.

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="Página del dispositivo del panel CrUX", width="800", height="603" %}

De manera similar, la página de distribución de ECT muestra el desglose de 4G, 3G, 2G, 2G lento y experiencias sin conexión.

{% Aside 'key-term' %} Los tipos de conexión efectivos se consideran *efectivos* porque se basan en mediciones de ancho de banda en los dispositivos de los usuarios y no implican el uso de ninguna tecnología específica. Por ejemplo, un usuario de escritorio con Wi-Fi rápido puede etiquetarse como 4G, mientras que una conexión móvil más lenta puede etiquetarse como 2G. {% endAside %}

Las distribuciones para estas dimensiones se calculan utilizando segmentos de los datos del histograma [First Contentful Paint](/fcp/) (FCP).

## Preguntas frecuentes

### ¿Cuándo debo usar el Panel CrUX en lugar de otras herramientas?

El panel CrUX se basa en los mismos datos subyacentes disponibles en BigQuery, pero no es necesario que escriba ni una sola línea de SQL para extraer los datos y nunca tendrá que preocuparse por exceder las cuotas gratuitas. Configurar un panel es rápido y fácil, todas las visualizaciones se generan automáticamente y tiene el control para compartirlas con quien desee.

### ¿Existen limitaciones para usar el panel CrUX?

Como está basado en BigQuery, el panel CrUX también hereda todas sus limitaciones. Está restringido a datos de nivel de origen con granularidad mensual.

El panel CrUX también sacrifica parte de la versatilidad de los datos no procesados en BigQuery en busca de simplicidad y conveniencia. Por ejemplo, las distribuciones métricas solo se ofrecen como "buena", "necesita mejorar" y "mala", en contraposición a los histogramas completos. Además, el panel CrUX proporciona datos a nivel global, mientras que el conjunto de datos de BigQuery le permite concentrarse en países específicos.

### ¿Dónde puedo obtener más información sobre Data Studio?

Consulte la [página de funciones de Data Studio](https://marketingplatform.google.com/about/data-studio/features/) para obtener más información.
