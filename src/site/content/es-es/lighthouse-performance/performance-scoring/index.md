---
layout: post
title: Puntuación de rendimiento del faro
description: Descubra cómo Lighthouse genera la puntuación de rendimiento general para su página.
subhead: Cómo Lighthouse calcula su puntaje de desempeño general
date: '2019-09-19'
updated: '2020-06-12'
---

En general, solo las [métricas](/lighthouse-performance/#metrics) contribuyen a su puntuación de Lighthouse Performance, no los resultados de las oportunidades o los diagnósticos. Dicho esto, la mejora de las oportunidades y los diagnósticos probablemente mejore los valores de las métricas, por lo que existe una relación indirecta.

A continuación, describimos por qué la puntuación puede fluctuar, cómo se compone y cómo Lighthouse puntúa cada métrica individual.

## Por qué fluctúa su puntuación {: #fluctuations}

Gran parte de la variabilidad en la puntuación de rendimiento general y los valores de las métricas no se debe a Lighthouse. Cuando su puntaje de rendimiento fluctúa, generalmente se debe a cambios en las condiciones subyacentes. Los problemas comunes incluyen:

- Pruebas A / B o cambios en los anuncios que se publican.
- Cambios en el enrutamiento del tráfico de Internet
- Pruebas en diferentes dispositivos, como una computadora de escritorio de alto rendimiento y una computadora portátil de bajo rendimiento
- Extensiones de navegador que inyectan JavaScript y agregan / modifican solicitudes de red
- Software antivirus

[La documentación de Lighthouse sobre variabilidad](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md) cubre esto con más profundidad.

Además, aunque Lighthouse puede proporcionarle una única puntuación de rendimiento general, podría ser más útil pensar en el rendimiento de su sitio como una distribución de puntuaciones, en lugar de un solo número. Consulte la introducción de [métricas de rendimiento centradas en el usuario](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics) para comprender por qué.

## Cómo se pondera la puntuación de rendimiento {: #weightings}

La puntuación de rendimiento es un [promedio ponderado](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub) de las *puntuaciones métricas* . Naturalmente, las métricas más ponderadas tienen un efecto mayor en su puntuación de rendimiento general. Las puntuaciones métricas no son visibles en el informe, pero se calculan bajo el capó.

{% Aside %} Las ponderaciones se eligen para proporcionar una representación equilibrada de la percepción del rendimiento del usuario. Las ponderaciones han cambiado con el tiempo porque el equipo de Lighthouse investiga con regularidad y recopila comentarios para comprender qué tiene el mayor impacto en el rendimiento percibido por el usuario. {% endAside %}

<figure class="w-figure">
  <p data-md-type="paragraph"><a href="https://googlechrome.github.io/lighthouse/scorecalc/"></a><img src="./score-calc.png" alt="Calculadora de puntuación Lighthouse webapp" style="max-width: 600px;"></p>
  <figcaption class="w-figcaption">Explore la puntuación con la <a href="https://googlechrome.github.io/lighthouse/scorecalc/">calculadora de puntuación de Lighthouse</a></figcaption></figure>

### Faro 6

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Auditoría</th>
        <th>Peso</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Primera pintura con contenido</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Índice de velocidad</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Pintura con contenido más grande</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Tiempo para interactuar</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Tiempo total de bloqueo</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Cambio de diseño acumulativo</a></td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### Faro 5

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Auditoría</th>
        <th>Peso</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Primera pintura con contenido</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Índice de velocidad</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">Primera pintura significativa</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Tiempo para interactuar</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">Primera CPU inactiva</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Cómo se determinan las puntuaciones de las métricas {: # metric-scores}

Una vez que Lighthouse termina de recopilar las métricas de rendimiento (en su mayoría informadas en milisegundos), convierte cada valor de métrica sin procesar en una puntuación de métrica de 0 a 100 al observar dónde cae el valor de la métrica en su distribución de puntuación de Lighthouse. La distribución de puntuación es una distribución logarítmica normal derivada de las métricas de rendimiento de los datos de rendimiento del sitio web real en [HTTP Archive](https://httparchive.org/) .

Por ejemplo, la pintura de contenido más grande (LCP) mide cuando un usuario percibe que el contenido más grande de una página está visible. El valor de la métrica para LCP representa el tiempo que transcurre entre el usuario que inicia la carga de la página y la página que presenta su contenido principal. Según los datos reales del sitio web, los sitios con mejor rendimiento representan LCP en aproximadamente 1.220 ms, por lo que el valor de la métrica se asigna a una puntuación de 99.

Profundizando un poco más, el modelo de curva de puntuación de Lighthouse utiliza datos de HTTPArchive para determinar dos puntos de control que luego establecen la forma de una curva [logarítmica normal.](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law) El percentil 25 de los datos de HTTPArchive se convierte en una puntuación de 50 (el punto de control medio) y el percentil 8 se convierte en una puntuación de 90 (el punto de control bueno / verde). Mientras explora el gráfico de la curva de puntuación a continuación, tenga en cuenta que entre 0,50 y 0,92, existe una relación casi lineal entre el valor métrico y la puntuación. Alrededor de una puntuación de 0,96 es el "punto de rendimientos decrecientes", ya que arriba, la curva se aleja, requiriendo cada vez más mejoras métricas para mejorar una puntuación ya alta.

<figure class="w-figure"><img src="./scoring-curve.png" alt="Imagen de la curva de puntuación para TTI" style="max-width: 600px;"><figcaption class="w-figcaption"> <a href="https://www.desmos.com/calculator/o98tbeyt1t">Explore la curva de puntuación para TTI</a> .</figcaption></figure>

### Cómo se manejan las computadoras de escritorio y los dispositivos móviles {: #desktop}

Como se mencionó anteriormente, las curvas de puntuación se determinan a partir de datos de rendimiento reales. Antes de Lighthouse v6, todas las curvas de puntuación se basaban en datos de rendimiento móvil, sin embargo, una ejecución de Lighthouse de escritorio lo usaría. En la práctica, esto llevó a puntajes de escritorio inflados artificialmente. Lighthouse v6 solucionó este error mediante el uso de una puntuación de escritorio específica. Si bien ciertamente puede esperar cambios generales en su puntaje de rendimiento de 5 a 6, cualquier puntaje para escritorio será significativamente diferente.

### Cómo se codifican por colores las puntuaciones {: # color-coding}

Las puntuaciones de las métricas y la puntuación de rendimiento están coloreadas de acuerdo con estos rangos:

- 0 a 49 (rojo): deficiente
- 50 a 89 (naranja): necesita mejorar
- 90 a 100 (verde): bueno

Para brindar una buena experiencia de usuario, los sitios deben esforzarse por obtener una buena puntuación (90-100). Una puntuación "perfecta" de 100 es extremadamente difícil de lograr y no se espera. Por ejemplo, tomar una puntuación de 99 a 100 necesita aproximadamente la misma cantidad de mejora métrica que tomaría de 90 a 94.

### ¿Qué pueden hacer los desarrolladores para mejorar su puntuación de rendimiento?

En primer lugar, utilice la [calculadora de puntuación de Lighthouse](https://googlechrome.github.io/lighthouse/scorecalc/) para comprender qué umbrales debe apuntar para lograr una determinada puntuación de rendimiento de Lighthouse.

En el informe Lighthouse, la **sección Oportunidades** contiene sugerencias detalladas y documentación sobre cómo implementarlas. Además, la **sección Diagnóstico** enumera pautas adicionales que los desarrolladores pueden explorar para mejorar aún más su rendimiento.

<!--
We don't think users care about the historical scoring rubrics, but we'd still prefer to keep them around because X
## Historical versions

### Lighthouse 3 and 4

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>

-->
