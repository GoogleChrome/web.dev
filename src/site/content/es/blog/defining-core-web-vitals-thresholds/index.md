---
layout: post
title: Definición de los umbrales de las métricas de Core Web Vitals
subhead: La investigación y la metodología detrás de los umbrales de Core Web Vitals
authors:
  - bmcquade
description: La investigación y la metodología detrás de los umbrales de Core Web Vitals
date: 2020-05-21
updated: 2022-07-18
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: La investigación y la metodología detrás de los umbrales de Core Web Vitals
tags:
  - blog
  - performance
  - web-vitals
---

[Core Web Vitals](/vitals/#core-web-vitals) es un conjunto de métricas de campo que miden aspectos importantes de la experiencia del usuario en el mundo real en la web. Core Web Vitals incluye métricas, así como umbrales objetivo para cada métrica, que ayudan a los desarrolladores a comprender cualitativamente si la experiencia de su sitio es "buena", "necesita mejorar" o es "mala". En esta publicación se explicará el enfoque utilizado para elegir los umbrales para las métricas de Core Web Vitals en general, así como también cómo se eligieron los umbrales para cada métrica específica de Core Web Vitals.

## Actualización: Métricas y umbrales básicos de Web Vitals

En el 2020 las Core Web Vitals son tres métricas: Largest Contentful Paint : Despliegue del contenido más extenso (LCP), First Input Delay: Demora de la primera entrada (FID) y Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS). Cada métrica mide un aspecto diferente de la experiencia del usuario: LCP mide la velocidad de carga percibida y marca el punto en la línea de tiempo de carga de la página en el que probablemente se haya cargado el contenido principal de la misma. FID mide la capacidad de respuesta y cuantifica la experiencia que sienten los usuarios cuando intentan interactuar por primera vez con la página, y CLS mide la estabilidad visual y cuantifica la cantidad de cambios de diseño inesperados del contenido visible de la página.

Cada métrica de Core Web Vitals tiene umbrales asociados, que clasifican el rendimiento como "bueno", "necesita mejorar" o "deficiente":

<style>
  .cluster > img {
    max-width: 30%;
  }
</style>
<div class="cluster">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Recomendaciones del umbral de Largest Contentful Paint", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="Recomendaciones del umbral de First Input Delay", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Recomendaciones del umbral de Cumulative Layout Shift", width="400", height="350" %}</div>

<div>
  <table>
    <tr>
      <th> </th>
      <th>Bueno</th>
      <th>Deficiente</th>
      <th>Percentil</th>
    </tr>
    <tr>
      <td>Largest Contentful Paint</td>
      <td>≤ 2,500ms</td>
      <td>&gt; 4,000 ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>First Input Delay</td>
      <td>≤ 100 ms</td>
      <td>&gt; 300 ms</td>
      <td>75</td>
    </tr>
    <tr>
      <td>Cumulative Layout Shift</td>
      <td>≤0.1</td>
      <td>&gt; 0.25</td>
      <td>75</td>
    </tr>
</table>
</div>
<p data-md-type="paragraph">Además, para clasificar el rendimiento general de una página o un sitio, utilizamos el valor del percentil 75 de todas las visualizaciones de página de esa página o sitio. En otras palabras, si al menos el 75% de las visualizaciones de página de un sitio cumplen el umbral "bueno", el sitio se clasifica como de "buen" rendimiento para esa métrica. Por el contrario, si al menos el 25 por ciento de las visualizaciones de página cumplen el umbral "deficiente", el sitio se clasifica como de rendimiento "deficiente". Así, por ejemplo, un percentil 75 de LCP de 2 segundos se clasifica como "bueno", mientras que un percentil 75 de LCP de 5 segundos se clasifica como "deficiente".</p>
<h2 data-md-type="header" data-md-header-level="2">Criterios para los umbrales de las métricas de Core Web Vitals</h2>
<p data-md-type="paragraph">Al establecer los umbrales de las métricas de Core Web Vitals, primero identificamos los criterios que debía cumplir cada umbral. A continuación, explico los criterios que utilizamos en Google para evaluar los umbrales de las métricas del 2020 para Core Web Vitals. En las secciones siguientes se explicará con más detalle cómo se aplicaron estos criterios para seleccionar los umbrales de cada métrica en el 2020. En los próximos años, prevemos realizar mejoras y adiciones a los criterios y umbrales para mejorar aún más nuestra capacidad de medir las experiencias de los usuarios en la web.</p>
<h3 data-md-type="header" data-md-header-level="3">Alta calidad en la experiencia del usuario</h3>
<p data-md-type="paragraph">Nuestro objetivo principal es la optimización para el usuario y su calidad de experiencia. Por ello, nuestro objetivo es garantizar que las páginas que cumplen los umbrales "buenos" de Core Web Vitals ofrezcan una experiencia de usuario de alta calidad.</p>
<p data-md-type="paragraph">Para identificar un umbral asociado a una experiencia de usuario de alta calidad, nos fijamos en la percepción humana y en la investigación sobre HCI. Mientras que esta investigación se resume a veces utilizando un único umbral fijo, encontramos que la investigación subyacente se expresa normalmente como un rango de valores. Por ejemplo, la investigación sobre la cantidad de tiempo que los usuarios normalmente esperan antes de perder la concentración se describe a veces como 1 segundo, mientras que la investigación subyacente se expresa en realidad como un rango, desde cientos de milisegundos hasta varios segundos. El hecho de que los umbrales de percepción varíen según el usuario y el contexto se ve respaldado por los datos conjuntados y anónimos de las métricas de Chrome, que muestran que no hay una cantidad única de tiempo que los usuarios esperan para que una página web muestre el contenido antes de abortar la carga de la página. Más bien, estos datos muestran una distribución fluida y continua. Para profundizar en los umbrales de percepción humana y en la investigación sobre HCI, consulte <a href="https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html" data-md-type="link">La ciencia detrás de los Web Vitals</a>.</p>
<p data-md-type="paragraph">En los casos en los que se dispone de investigaciones relevantes sobre la experiencia del usuario para una métrica determinada y existe un consenso razonable sobre el rango de valores en la literatura, utilizamos este rango como entrada para guiar nuestro proceso de selección de umbrales. En los casos en los que no se dispone de investigaciones relevantes sobre la experiencia del usuario, como en el caso de una nueva métrica como Cumulative Layout Shift, evaluamos páginas del mundo real que cumplen con diferentes umbrales candidatos para una métrica, con el fin de identificar un umbral que resulte en una buena experiencia de usuario.</p>
<h3 data-md-type="header" data-md-header-level="3">Posible mediante el contenido web actual</h3>
<p data-md-type="paragraph">Además, para garantizar que los propietarios de los sitios puedan optimizarlos para que cumplan los umbrales "buenos", exigimos que estos umbrales sean alcanzables para los contenidos actuales de la web. Por ejemplo, mientras que cero milisegundos es un umbral ideal de LCP "bueno", que da lugar a experiencias de carga instantáneas, un umbral de cero milisegundos no es alcanzable en la práctica de la mayoría de los casos, debido a las latencias de procesamiento de la red y de los dispositivos. Por lo tanto, cero milisegundos no es un umbral LCP "bueno" razonable para Core Web Vitals.</p>
<p data-md-type="paragraph">Al evaluar los umbrales "buenos" de Core Web Vitals de los candidatos, verificamos que esos umbrales sean alcanzables, según los datos del <a href="https://developer.chrome.com/docs/crux/" data-md-type="link">Chrome User Experience Report</a> (CrUX). Para confirmar que se puede alcanzar un umbral, requerimos que al menos el 10% de los <a href="/same-site-same-origin/#origin" data-md-type="link">orígenes</a> actualmente cumplen con el umbral "bueno". Además, para garantizar que los sitios bien optimizados no se clasifican erróneamente debido a la variabilidad de los datos de campo, también verificamos que el contenido bien optimizado cumple sistemáticamente el umbral "bueno".</p>
<p data-md-type="paragraph">Por el contrario, establecemos el umbral "deficiente" identificando un nivel de rendimiento que solo una minoría de orígenes que actualmente no cumple. A menos que se disponga de investigaciones pertinentes para definir un umbral "deficiente", de forma predeterminada se clasifica como "deficiente" entre el 10 y el 30% de los orígenes con peores resultados.</p>
<h3 data-md-type="header" data-md-header-level="3">Reflexiones finales sobre los criterios</h3>
<p data-md-type="paragraph">Al evaluar los umbrales de los candidatos, encontramos que los criterios a veces entraban en conflicto entre sí. Por ejemplo, puede haber una tensión entre un umbral que se puede alcanzar de manera constante y que garantiza experiencias de usuario consistentemente buenas. Además, dado que la investigación de la percepción humana generalmente proporciona una variedad de valores, y las métricas de comportamiento del usuario muestran cambios graduales en el comportamiento, descubrimos que a menudo no existe un umbral "correcto" único para una métrica. Por lo tanto, nuestro enfoque para el Core Web Vitals 2020 fue elegir los umbrales que cumplan mejor con los criterios anteriores, reconociendo al mismo tiempo que no hay un umbral perfecto y que a veces podemos tener que elegir entre múltiples umbrales candidatos razonables. En vez de preguntar "¿cuál es el umbral perfecto?" en cambio, nos hemos centrado en preguntar "¿qué umbral candidato cumple mejor nuestros criterios?"</p>
<h2 data-md-type="header" data-md-header-level="2">Elección del percentil</h2>
<p data-md-type="paragraph">Como se señaló anteriormente, para clasificar el rendimiento general de una página o sitio, utilizamos el valor del percentil 75 de todas las visitas a esa página o sitio. El percentil 75 se eligió en función de dos criterios. En primer lugar, el percentil debe garantizar que la mayoría de las visitas a una página o sitio experimenten el nivel de rendimiento deseado. En segundo lugar, el valor del percentil elegido no debe verse afectado en exceso por los valores atípicos.</p>
<p data-md-type="paragraph">Estos objetivos son en cierto modo contradictorios. Para satisfacer el primer objetivo, normalmente un percentil más alto sería la mejor opción. Sin embargo, con percentiles más altos, también aumenta la probabilidad de que el valor resultante se vea afectado por valores atípicos. Si algunas visitas a un sitio se realizan en conexiones de red defectuosas que dan como resultado muestras de LCP excesivamente grandes, no queremos que la clasificación de nuestro sitio se decida por estas muestras atípicas. Por ejemplo, si estuviéramos evaluando el rendimiento de un sitio con 100 visitas con la ayuda de un percentil alto como el 95, se necesitarían solo 5 muestras de valores atípicos para que el valor del percentil 95 se vea afectado por los valores atípicos.</p>
<p data-md-type="paragraph">Dado que estos objetivos son un poco contradictorios, después el análisis, llegamos a la conclusión de que el percentil 75 logra un equilibrio razonable. Al utilizar el percentil 75, sabemos que la mayoría de las visitas al sitio (3 de 4) experimentaron el nivel de rendimiento objetivo o mejor. Además, es menos probable que el valor del percentil 75 se vea afectado por valores atípicos. Volviendo a nuestro ejemplo, para un sitio con 100 visitas, 25 de esas visitas necesitarían informar de grandes muestras de valores atípicos para que el valor del percentil 75 se vea afectado por los valores atípicos. Aunque es posible que 25 de 100 muestras sean atípicas, es mucho menos probable que en el caso del percentil 95.</p>
<h2 data-md-type="header" data-md-header-level="2">Largest Contentful Paint</h2>
<h3 data-md-type="header" data-md-header-level="3">Calidad de la experiencia</h3>
<p data-md-type="paragraph">Con frecuencia se cita 1 segundo como la cantidad de tiempo que un usuario esperará antes de comenzar a perder el enfoque en una tarea. Al examinar más detenidamente las investigaciones relevantes, descubrimos que 1 segundo es una aproximación para describir un rango de valores, desde aproximadamente varios cientos de milisegundos hasta varios segundos.</p>
<p data-md-type="paragraph">Dos fuentes comúnmente citadas para el umbral de 1 segundo son <a href="https://dl.acm.org/doi/10.1145/108844.108874" data-md-type="link">Card et al</a> y <a href="https://dl.acm.org/doi/10.1145/1476589.1476628" data-md-type="link">Miller</a>. Card define un umbral de "respuesta inmediata" de 1 segundo, citando las <a href="https://dl.acm.org/doi/book/10.5555/86564" data-md-type="link">Teorías Unificadas de la Cognición</a> de Newell. Newell explica las respuestas inmediatas como "respuestas que deben hacerse a algún estímulo dentro de <em data-md-type="emphasis">aproximadamente un segundo</em> (es decir, aproximadamente de ~0.3seg a ~3seg)". Esto sigue a la discusión de Newell sobre "las limitaciones de la cognición en tiempo real", donde se observa que "las interacciones con el entorno que evocan consideraciones cognitivas tienen lugar en el orden de segundos", que van aproximadamente de 0.5 a 2 o 3 segundos. Miller, otra fuente comúnmente citada para el umbral de 1 segundo, señala que "las tareas que los humanos pueden realizar y realizarán con las comunicaciones de las máquinas cambiarán seriamente su carácter si los retrasos en la respuesta son mayores a dos segundos, con alguna posible extensión de otro segundo más o menos".</p>
<p data-md-type="paragraph">La investigación de Miller y Card describe la cantidad de tiempo que un usuario esperará antes de perder el enfoque en un rango, desde aproximadamente 0.3 a 3 segundos, lo que sugiere que nuestro umbral "bueno" de LCP debería estar en este rango. Además, dado que el umbral "bueno" actual de First Contentful Paint es de 1 segundo, y que Largest Contentful Paint generalmente ocurre después de First Contentful Paint, restringimos aún más nuestro rango de umbrales de LCP candidatos, de 1 a 3 segundos. Para elegir el umbral en este rango que mejor cumpla con nuestros criterios, a continuación analizaremos la posibilidad de alcanzar estos umbrales candidatos.</p>
<h3 data-md-type="header" data-md-header-level="3">Viabilidad</h3>
<p data-md-type="paragraph">Utilizando los datos de CrUX, podemos determinar el porcentaje de orígenes en la web que cumplen nuestros umbrales candidatos a LCP "buenos".</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de orígenes CrUX clasificados como "buenos" (para los umbrales LCP candidatos)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>1 segundo</th>
      <th>1.5 segundos</th>
      <th>2 segundos</th>
      <th>2.5 segundos</th>
      <th>3 segundos</th>
    </tr>
    <tr>
      <td><strong>teléfono</strong></td>
      <td>3.5%</td>
      <td>13%</td>
      <td>27%</td>
      <td>42%</td>
      <td>55%</td>
    </tr>
    <tr>
      <td><strong>escritorio</strong></td>
      <td>6.9%</td>
      <td>19%</td>
      <td>36%</td>
      <td>51%</td>
      <td>64%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Mientras que menos del 10% de los orígenes cumplen el umbral de 1 segundo, todos los demás umbrales de 1.5 a 3 segundos satisfacen nuestro requisito de que al menos el 10% de los orígenes cumplan el umbral "bueno", y por tanto siguen siendo candidatos válidos.</p>
<p data-md-type="paragraph">Además, para garantizar que el umbral elegido se pueda alcanzar de forma constante para los sitios bien optimizados, analizamos el rendimiento de LCP para los sitios de mejor rendimiento en la web, para determinar qué umbrales se pueden alcanzar de forma coherente para estos sitios. Específicamente, nuestro objetivo es identificar un umbral que se pueda alcanzar de manera consistente en el percentil 75 para los sitios con mayor rendimiento. Descubrimos que los umbrales de 1.5 y 2 segundos no se pueden alcanzar de forma sistemática, mientras que los de 2.5 segundos sí se pueden alcanzar de forma sistemática.</p>
<p data-md-type="paragraph">Para identificar un umbral "deficiente" para LCP, utilizamos los datos de CrUX para identificar un umbral que cumple la mayoría de los orígenes:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de orígenes CrUX clasificados como "deficientes" (para los umbrales LCP candidatos)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>3 segundos</th>
      <th>3.5 segundos</th>
      <th>4 segundos</th>
      <th>4.5 segundos</th>
      <th>5 segundos</th>
    </tr>
    <tr>
      <td><strong>teléfono</strong></td>
      <td>45%</td>
      <td>35%</td>
      <td>26%</td>
      <td>20%</td>
      <td>15%</td>
    </tr>
    <tr>
      <td><strong>escritorio</strong></td>
      <td>36%</td>
      <td>26%</td>
      <td>19%</td>
      <td>14%</td>
      <td>10%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Para un umbral de 4 segundos, aproximadamente el 26% de los orígenes telefónicos y el 21% de los orígenes en equipos de escritorio se clasificarían como deficientes. Esto entra en nuestro rango objetivo de entre el 10 y 30%, por lo que concluimos que 4 segundos es un umbral "deficiente" aceptable.</p>
<p data-md-type="paragraph">Por lo tanto, llegamos a la conclusión de que 2.5 segundos es un umbral razonable "bueno", y 4 segundos es un umbral razonable "deficiente" para Largest Contentful Paint.</p>
<h2 data-md-type="header" data-md-header-level="2">First Input Delay</h2>
<h3 data-md-type="header" data-md-header-level="3">Calidad de la experiencia</h3>
<p data-md-type="paragraph">La investigación es razonablemente consistente al concluir que los retrasos en la retroalimentación visual de hasta unos 100 ms se perciben como causados por una fuente asociada, como una entrada del usuario. Esto sugiere que un umbral "bueno" para First Input Delay de 100 ms probablemente sea apropiado como nivel mínimo: si la demora para procesar la entrada excede los 100 ms, no hay posibilidad de que otros pasos de procesamiento y renderización se completen a tiempo.</p>
<p data-md-type="paragraph">El citado <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" data-md-type="link">Response Times: The 3 Important Limits</a> de Jakob define 0.1 segundos como el límite para que el usuario sienta que el sistema reacciona instantáneamente. Nielsen cita a Miller y Card, que cita el trabajo de Michotte de 1962 <a href="https://psycnet.apa.org/record/1964-05029-000" data-md-type="link">La percepción de la causalidad</a>. En la investigación de Michotte, a los participantes del experimento se les muestran "dos objetos en una pantalla. El objeto A se pone en marcha y se mueve hacia B. Se detiene en el momento en que entra en contacto con B, mientras que este último comienza y se aleja de A". Michotte varía el intervalo de tiempo entre el momento en que el objeto A se detiene y el momento en que el objeto B comienza a moverse. Michotte encuentra que, para retrasos de hasta aproximadamente 100 ms, los participantes tienen la impresión de que el Objeto A causa el movimiento del Objeto B. Para los retrasos de aproximadamente 100 ms a 200 ms, la percepción de la causalidad es mixta, y para los retrasos de más de 200 ms, el movimiento del objeto B ya no se considera causado por el objeto A.</p>
<p data-md-type="paragraph">Del mismo modo, Miller define un umbral de respuesta para "Respuesta a la activación del control" como "la indicación de acción dada, normalmente, por el movimiento de una llave, interruptor u otro miembro del control que indica que fue físicamente activado. Esta respuesta debe ser … percibida como parte de la acción mecánica inducida por el operador. Demora de tiempo: No más de 0.1 segundos" y posteriormente "el retraso entre presionar una tecla y la retroalimentación visual no debe ser mayor de 0.1 a 0.2 segundos ".</p>
<p data-md-type="paragraph">Más recientemente, en <a href="https://dl.acm.org/doi/10.1145/2611387" data-md-type="link">Towards the Temporally Perfect Virtual Button</a>, Kaaresoja et al investigaron la percepción de simultaneidad entre pulsar un botón virtual en una pantalla táctil y la retroalimentación visual posterior que indica que el botón se pulsó, con varios retrasos. Cuando el retraso entre pulsar el botón y la retroalimentación visual fue de 85 ms o menos, los participantes informaron que la retroalimentación visual apareció simultáneamente con la pulsación del botón el 75% de las veces. Además, para retrasos de 100 ms o menos, los participantes informaron una calidad percibida consistentemente alta al pulsar el botón, con una calidad percibida cayendo para demoras de 100 ms a 150 ms, y alcanzando niveles muy bajos para demoras de 300 ms.</p>
<p data-md-type="paragraph">Teniendo en cuenta lo anterior, llegamos a la conclusión de que la investigación apunta a un rango de valores de alrededor de 100ms como un umbral de  First Input Delay apropiado para Web Vitals. Además, dado que los usuarios informaron de niveles de calidad bajos para retrasos de 300 ms o más, 300 ms se presenta como un umbral "deficiente" de forma razonable.</p>
<h3 data-md-type="header" data-md-header-level="3">Viabilidad</h3>
<p data-md-type="paragraph">Utilizando los datos de CrUX, determinamos que la mayoría de los orígenes en la web cumplen el umbral de 100 ms de FID "bueno" en el percentil 75:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de orígenes CrUX clasificados como "buenos" para el umbral FID de 100ms</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th></th>
      <th>100 ms</th>
    </tr>
    <tr>
      <td><strong>teléfono</strong></td>
      <td>78%</td>
    </tr>
    <tr>
      <td><strong>escritorio</strong></td>
      <td>&gt; 99%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Además, observamos que los mejores sitios en la web pueden alcanzar este umbral sistemáticamente en el percentil 75 (y a menudo lo cumplen en el percentil 95).</p>
<p data-md-type="paragraph">Teniendo en cuenta lo anterior, llegamos a la conclusión de que 100 ms es un "buen" umbral razonable para FID.</p>
<h2 data-md-type="header" data-md-header-level="2">Cumulative Layout Shift</h2>
<h3 data-md-type="header" data-md-header-level="3">Calidad de la experiencia</h3>
<p data-md-type="paragraph">Cumulative Layout Shift (CLS) es una nueva métrica que mide cuánto cambia el contenido visible de una página. Dado que CLS es nuevo, no conocemos ninguna investigación que pueda informar directamente sobre los umbrales de esta métrica. Por lo tanto, para identificar un umbral que se ajuste a las expectativas de los usuarios, evaluamos páginas del mundo real con diferentes cantidades de cambios en el diseño, para determinar la cantidad máxima de cambio que se percibe como aceptable antes de causar interrupciones significativas al consumir el contenido de la página. En nuestras pruebas internas, encontramos que los niveles de cambio a partir de 0.15 se percibían sistemáticamente como disruptivos, mientras que los cambios de 0.1 e inferiores eran perceptibles pero no excesivamente disruptivos. Por lo tanto, aunque el cambio cero del diseño es el ideal, llegamos a la conclusión de que los valores de hasta 0.1 son umbrales CLS "buenos".</p>
<h3 data-md-type="header" data-md-header-level="3">Viabilidad</h3>
<p data-md-type="paragraph">Según los datos de CrUX, podemos ver que casi el 50% de los orígenes tienen CLS de 0.05 o menos.</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de orígenes CrUX clasificados como "buenos" (para los umbrales CLS candidatos)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.05</th>
      <th>0.1</th>
      <th>0.15</th>
    </tr>
    <tr>
      <td><strong>teléfono</strong></td>
      <td>49%</td>
      <td>60%</td>
      <td>69%</td>
    </tr>
    <tr>
      <td><strong>escritorio</strong></td>
      <td>42%</td>
      <td>59%</td>
      <td>69%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Si bien los datos de CrUX sugieren que 0.05 podría ser un umbral razonablemente "bueno" de CLS, reconocemos que hay algunos casos de uso en los que actualmente es difícil evitar cambios de diseño disruptivos. Por ejemplo, en el caso de los contenidos incrustados de terceros, como las incrustaciones de redes sociales, a veces no se conoce la altura del contenido incrustado hasta que termina de cargarse, lo que puede provocar un cambio de diseño superior a 0.05. Por lo tanto, llegamos a la conclusión de que, si bien muchos orígenes alcanzan el umbral de 0.05, el umbral CLS es ligeramente menos estricto ya que con 0.1 logra un mejor equilibrio entre la calidad de la experiencia y la viabilidad. Esperamos que, en el futuro, el ecosistema web identifique soluciones para abordar los cambios de diseño causados por incrustaciones de terceros, lo que permitiría usar un umbral CLS "bueno" más estricto de 0.05 o 0 en una iteración futura de Core Web Vitals.</p>
<p data-md-type="paragraph">Además, para determinar un umbral "deficiente" para CLS, utilizamos datos de CrUX para identificar un umbral que cumple con la mayoría de los orígenes:</p>
<p data-md-type="paragraph"><strong data-md-type="double_emphasis">% de orígenes CrUX clasificados como "deficientes" (para los umbrales CLS candidatos)</strong></p>
<div data-md-type="block_html"><div>
  <table>
    <tr>
      <th> </th>
      <th>0.15</th>
      <th>0.2</th>
      <th>0.25</th>
      <th>0.3</th>
    </tr>
    <tr>
      <td><strong>teléfono</strong></td>
      <td>31%</td>
      <td>25%</td>
      <td>20%</td>
      <td>18%</td>
    </tr>
    <tr>
      <td><strong>escritorio</strong></td>
      <td>31%</td>
      <td>23%</td>
      <td>18%</td>
      <td>16%</td>
    </tr>
  </table>
</div></div>
<p data-md-type="paragraph">Para un umbral de 0.25, aproximadamente el 20% de los orígenes telefónicos y el 18% de los orígenes en equipos de escritorio se clasificarían como "deficientes". Esto entra en nuestro rango objetivo de entre 10 y 30%, por lo que concluimos que 0.25 es un umbral "deficiente" aceptable.</p>
