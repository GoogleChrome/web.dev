---
layout: post
title: "¿Cómo medir la velocidad?"
authors:
  - bojanpavic
  - ansteychris
description: |2

  El rendimiento en el mundo real es muy variable debido a las diferencias en los

  dispositivos, conexiones de red y otros factores. En esta publicación exploramos

  herramientas que pueden ayudarlo a recopilar datos de laboratorio o de campo para evaluar el rendimiento de la página.
web_lighthouse: N / A
date: 2019-05-01
updated: 2022-07-18
tags:
  - performance
---

El rendimiento en el mundo real es muy variable debido a las diferencias en los dispositivos de los usuarios, las conexiones de red y otros factores. Por ejemplo, si carga su sitio web usando una conexión de red de cable en su oficina y lo compara con la carga usando WiFi en una cafetería, es probable que las experiencias sean muy diferentes. Hay muchas herramientas en el mercado que pueden ayudarlo a recopilar datos de laboratorio o de campo para evaluar el rendimiento de la página.

## Datos de laboratorio frente a datos de campo

{% Img src="image/admin/6OMEfvIKRuDWWSiVDto4.png", alt="Gráficos de herramientas de velocidad", width="800", height="232" %}

**Los datos de laboratorio** son datos de rendimiento recopilados dentro de un entorno controlado con dispositivos predefinidos y configuraciones de red, mientras que los **datos de campo** son datos de rendimiento recopilados de cargas reales de páginas experimentadas por sus usuarios en la vida real. Cada tipo tiene sus propias fortalezas y limitaciones.

**Los datos de laboratorio** ofrecen resultados reproducibles y un entorno de depuración, pero es posible que no capturen los cuellos de botella del mundo real y no puedan correlacionarse con los KPI de la página en el mundo real. Con los datos de laboratorio, debe comprender los dispositivos y redes típicos de sus usuarios y reflejar adecuadamente esas condiciones cuando pruebe el rendimiento. Tenga en cuenta que incluso en áreas con 4G, los usuarios pueden experimentar conexiones más lentas o intermitentes cuando están en ascensores, mientras viajan o en entornos comparables.

**Los datos de campo** (también denominados Real User Monitoring o RUM) capturan la verdadera experiencia del usuario en el mundo real y permiten la correlación con los KPI comerciales, pero tienen un conjunto restringido de métricas y capacidades de depuración limitadas.

## Instrumentos

### Datos de laboratorio

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) toma una URL y ejecuta una serie de auditorías en la página, generando un informe sobre qué tan bien le fue a la página. Hay varias formas de ejecutar Lighthouse, incluida una opción para auditar fácilmente una página desde Chrome DevTools.

### Datos de campo

[El Informe de experiencia del usuario de Chrome (CrUX)](https://developer.chrome.com/docs/crux/) proporciona métricas que muestran cómo los usuarios de Chrome en el mundo real experimentan los destinos populares en la web.

### Otras herramientas

[PageSpeed Insights](https://pagespeed.web.dev/) proporciona datos de laboratorio y de campo sobre una página. Utiliza Lighthouse para recopilar y analizar datos de laboratorio sobre la página, mientras que los datos de campo del mundo real se basan en el conjunto de datos del Informe de experiencia del usuario de Chrome.

[Chrome Developer Tools](https://developer.chrome.com/docs/devtools/) son un conjunto de herramientas para desarrolladores web integradas directamente en el navegador Google Chrome. Le permite perfilar el tiempo de ejecución de una página, así como identificar y depurar cuellos de botella de rendimiento.
