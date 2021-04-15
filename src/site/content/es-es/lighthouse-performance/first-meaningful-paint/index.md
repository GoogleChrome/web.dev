---
layout: post
title: Primera pintura significativa
description: Conozca la métrica Primera pintura significativa de Lighthouse y cómo medirla y optimizarla.
date: '2019-05-02'
updated: '2019-11-05'
web_lighthouse:
  - primera pintura significativa
---

{% Aside 'caution' %} La primera pintura significativa (FMP) está obsoleta en Lighthouse 6.0. En la práctica, FMP ha sido demasiado sensible a las pequeñas diferencias en la carga de la página, lo que ha dado lugar a resultados inconsistentes (bimodales). Además, la definición de la métrica se basa en detalles de implementación específicos del navegador, lo que significa que no se puede estandarizar ni implementar en todos los navegadores web. En el futuro, considere usar la [pintura con contenido más grande en su](/largest-contentful-paint/) lugar. {% endAside %}

Primera pintura significativa (FMP) es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Las pantallas del faro muestran FMP en segundos:

<figure class="w-figure"><img class="w-screenshot" src="first-meaningful-paint.png" alt="Una captura de pantalla de la auditoría de Lighthouse First Meaningful Paint"></figure>

## Qué mide FMP

FMP mide cuándo el contenido principal de una página es visible para el usuario. La puntuación bruta de FMP es el tiempo en segundos entre el usuario que inicia la carga de la página y la página que presenta el contenido principal de la mitad superior de la página. FMP esencialmente muestra el momento de la pintura después de lo cual ocurre el mayor cambio de diseño en la parte superior del pliegue. Obtenga más información sobre los detalles técnicos de FMP en Google [Time to First Meaningful Paint: un enfoque basado en diseño](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view) .

[First Contentful Paint (FCP)](/first-contentful-paint) y FMP suelen ser lo mismo cuando el primer fragmento de contenido representado en la página incluye el contenido en la mitad superior de la página. Sin embargo, estas métricas pueden diferir cuando, por ejemplo, hay contenido en la mitad superior de la página dentro de un iframe. FMP se registra cuando el contenido dentro del iframe es visible para el usuario, mientras que FCP *no* incluye el contenido del iframe.

## Cómo Lighthouse determina su puntuación FMP

Al igual que FCP, FMP se basa en [datos reales de rendimiento del sitio web del Archivo HTTP](https://httparchive.org/reports/loading-speed#fcp) .

Cuando FMP y FCP son iguales, sus puntuaciones son idénticas. Si FMP ocurre después de FCP, por ejemplo, cuando una página contiene contenido de iframe, la puntuación de FMP será más baja que la puntuación de FCP.

Por ejemplo, digamos que su FCP es de 1,5 segundos y su FMP es de 3 segundos. La puntuación FCP sería 99, pero la puntuación FMP sería 75.

Esta tabla muestra cómo interpretar su puntuación FMP:

<div class="w-table-wrapper">
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

Consulte [Cómo mejorar la pintura con contenido más grande en su sitio] . Las estrategias para mejorar FMP son en gran medida las mismas que las estrategias para mejorar la pintura con contenido más grande.

## Seguimiento de FMP en dispositivos de usuarios reales

Para saber cómo medir cuándo ocurre realmente la FMP en los dispositivos de sus usuarios, consulte la página de [métricas de rendimiento centradas en el usuario de Google.] La [sección Seguimiento de FMP utilizando elementos de héroe] describe cómo acceder mediante programación a los datos de FCP y enviarlos a Google Analytics.

Consulte [Evaluación del rendimiento de carga en la vida real de](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) Google con navegación y sincronización de recursos para obtener más información sobre la recopilación de métricas de usuarios reales. La [auditoría Lighthouse marca y mide el tiempo del usuario](/user-timings) le permite ver los datos del tiempo del usuario en su informe.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la primera auditoría de **pintura significativa**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-meaningful-paint.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Es hora de la primera pintura significativa: un enfoque basado en el diseño](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)
- [Pintura con contenido más grande](/largest-contentful-paint)


[métricas de rendimiento centradas en el usuario de Google.]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[sección Seguimiento de FMP utilizando elementos de héroe]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements
[Cómo mejorar la pintura con contenido más grande en su sitio]: /largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site