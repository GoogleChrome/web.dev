---
layout: post
title: Primer despliegue significativo (First Meaningful Paint)
description: Obtenga información sobre la métrica de Primer despliegue significativo de Lighthouse y cómo medirlo y optimizarlo.
date: 2019-05-02
updated: 2019-11-05
web_lighthouse:
  - first-meaningful-paint
---

{% Aside 'caution' %} El Primer despliegue significativo (FMP) está obsoleto a partir de Lighthouse 6.0. En la práctica, FMP se ha comportado de forma demasiado sensible a las pequeñas diferencias en la carga de la página, lo que ha dado lugar a resultados inconsistentes (bimodales). Además, la definición de la métrica se basa en detalles de implementación específicos del navegador, lo que significa que no se puede estandarizar ni implementar en todos los navegadores. En el futuro, en vez de esta métrica, considere usar [Despliegue del contenido más extenso](/lcp/). {% endAside %}

Primer despliegue significativo (FMP) es una de las seis métricas que se registran en la sección **Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra FMP en segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6XzSjk0QsMpAL8V0bZiq.png", alt="Una captura de pantalla de la auditoría Primer despliegue significativo en Lighthouse", width="800", height="588" %}</figure>

## ¿Qué mide FMP?

FMP mide cuándo el contenido principal de una página se hace  visible para el usuario. La puntuación bruta para FMP es el tiempo en segundos entre el momento en que el usuario inicia la carga de la página y el momento en que la página presenta el contenido principal de la mitad superior de la página. FMP esencialmente muestra el momento del despliegue después del cual ocurre el mayor cambio en el diseño en la parte superior de la página. Obtenga más información sobre los detalles técnicos de FMP en [Hasta el primer despliegue significativo: un enfoque basado en diseño](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view) de Google.

El [Primer despliegue del contenido (FCP)](/fcp/) y el FMP suelen ser iguales cuando el primer fragmento de contenido representado en la página incluye el contenido en la mitad superior de la página. Sin embargo, estas métricas pueden diferir cuando, por ejemplo, existe contenido en la mitad superior de un iframe. FMP registra cuando el contenido dentro del iframe es visible para el usuario, mientras que FCP *no* incluye contenido de iframe.

## Cómo Lighthouse determina su puntaje FMP

Al igual que FCP, FMP se basa en [datos reales de rendimiento del sitio web del Archivo HTTP](https://httparchive.org/reports/loading-speed#fcp) .

Cuando FMP y FCP son iguales, sus puntuaciones son idénticas. Si FMP ocurre después de FCP, por ejemplo, cuando una página contiene contenido de iframe, la puntuación de FMP será más baja que la puntuación de FCP.

Por ejemplo, digamos que su FCP es de 1,5 segundos y su FMP es de 3 segundos. La puntuación FCP sería 99, pero la puntuación FMP sería 75.

Esta tabla muestra cómo interpretar su puntuación FMP:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Métrica FMP<br> (en segundos)</th>
        <th>Código de colores</th>
        <th>Puntuación FMP<br> (Percentil de archivo HTTP de FCP)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-2</td>
        <td>Verde (rápido)</td>
        <td>75-100</td>
      </tr>
      <tr>
        <td>2-4</td>
        <td>Naranja (moderado)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Más de 4</td>
        <td>Rojo (lento)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntuación FMP

Vea [Cómo mejorar despliegue del contenido más extenso en su sitio](/largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site). Las estrategias para mejorar el FMP son en gran parte las mismas que las estrategias para mejorar el despliegue del contenido más extenso.

## Seguimiento de FMP en dispositivos de usuarios reales

Para saber cómo medir cuándo ocurre realmente el FMP en los dispositivos de sus usuarios, consulte la página de [métricas de rendimiento centradas en el usuario](/user-centric-performance-metrics/) de Google. La sección [Seguimiento de FMP usando elementos principales](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements) describe cómo acceder a los datos de FCP mediante programación y enviarlos a Google Analytics.

Consulte [Evaluación del rendimiento de carga en la vida real con la navegación y sincronización de recursos](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) de Google para obtener más información sobre la recopilación de métricas de usuarios reales. La [auditoría de Lighthouse User Timing marks and measures](/user-timings) le permite ver los datos del tiempo del usuario en su informe.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría de **Primer despliegue significativo**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/first-meaningful-paint.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Hasta el primer despliegue significativo: un enfoque basado en diseño](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)
- [Despliegue con contenido más extenso](/lcp/)
