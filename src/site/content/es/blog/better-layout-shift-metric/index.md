---
title: 'Se busca retroalimentación: el camino hacia una mejor métrica de cambio de diseño para páginas de larga duración'
subhead: Conozca nuestros planes para mejorar la métrica Cumulative Layout Shift (cambio acumulativo de diseño) y envíenos sus comentarios.
description: Conozca nuestros planes para mejorar la métrica Cumulative Layout Shift (cambio acumulativo de diseño) y envíenos sus comentarios.
authors:
  - anniesullie
  - mmocny
date: 2021-01-25
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: Un ejemplo de enfoque de ventanas para medir el cambio de diseño.
tags:
  - blog
  - performance
  - web-vitals
---

La métrica [Cumulative Layout Shift](/cls) o CLS (cambio acumulativo de diseño) mide la estabilidad visual de una página web. La métrica se denomina cambio acumulativo de diseño porque la puntuación de cada cambio individual se suma a lo largo de la vida útil de la página.

Si bien todos los cambios de diseño son malas experiencias para el usuario, suman más en las páginas que están abiertas por más tiempo. Es por eso que el equipo de métricas de velocidad de Chrome se propuso mejorar la métrica CLS para ser más neutral con respecto al tiempo que se pasa en una página.

Es importante que la métrica se centre en la experiencia del usuario durante toda la vida útil de la página, ya que hemos descubierto que los usuarios a menudo tienen experiencias negativas después de la carga, mientras se desplazan o navegan por las páginas. Pero hemos escuchado preocupaciones sobre cómo afecta esto las páginas de larga duración, páginas que el usuario generalmente tiene abiertas durante mucho tiempo. Hay varios tipos diferentes de páginas que tienden a permanecer abiertas más tiempo; algunas de las más comunes son las aplicaciones de redes sociales con desplazamiento infinito y aplicaciones de una sola página.

Gracias a un análisis interno de páginas de larga duración con puntuaciones CLS altas, se descubrió que la mayoría de los problemas se debían a los siguientes patrones:

- [Desplazamientos infinitos que cambian el contenido](https://addyosmani.com/blog/infinite-scroll-without-layout-shifts/) a medida que el usuario se desplaza.
- Los controladores de entrada tardan más de 500 ms en actualizar la interfaz de usuario en respuesta a la interacción del usuario, sin ningún tipo de marcador de posición o patrón skeleton.

Si bien alentamos a los desarrolladores a mejorar esas experiencias de usuario, también estamos trabajando para mejorar la métrica y buscamos retroalimentación sobre posibles enfoques.

## ¿Cómo decidiríamos si una nueva métrica es mejor?

Antes de sumergirnos en el diseño de métricas, queríamos asegurarnos de evaluar nuestras ideas en una amplia variedad de páginas web y casos de uso reales. Para empezar, diseñamos un pequeño estudio de usuarios.

Primero, grabamos videos y [rastros de Chrome](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de 34 recorridos de usuarios a través de varios sitios web. Al seleccionar los recorridos de los usuarios, apuntamos a algunas cosas:

- Una variedad de diferentes tipos de sitios, como sitios de noticias y compras.
- Una variedad de recorridos del usuario, como la carga inicial de la página, el desplazamiento, la navegación de aplicaciones de una sola página y las interacciones del usuario.
- Una variedad tanto del número como de la intensidad de los cambios de diseño individuales en los sitios.
- Pocas experiencias negativas en los sitios además de los cambios de diseño.

Le pedimos a 41 de nuestros colegas que vieran dos videos a la vez, calificando cuál de los dos era mejor en términos de cambio de diseño. A partir de estas calificaciones, creamos un orden de clasificación idealizado de los sitios. Los resultados de la clasificación de usuarios confirmaron nuestras sospechas de que nuestros colegas, como la mayoría de los usuarios, están realmente frustrados por los cambios de diseño después de la carga, especialmente durante el desplazamiento y la navegación de aplicaciones de una sola página. Vimos que algunos sitios tienen experiencias de usuario mucho mejores durante estas actividades que otros.

Dado que registramos los rastros de Chrome junto con los videos, teníamos todos los detalles de los cambios de diseño individuales en cada recorrido del usuario. Los usamos para calcular valores métricos para cada idea para cada viaje de usuario. Esto nos permitió ver cómo cada variante de métrica clasificaba los viajes del usuario y qué tan diferente era cada una de la clasificación ideal.

## ¿Qué ideas métricas probamos?

### Estrategias de ventanas

A menudo, las páginas tienen varios cambios de diseño agrupados muy juntos, ya que los elementos pueden cambiar varias veces a medida que el contenido nuevo llega pieza por pieza. Esto nos llevó a probar técnicas para agrupar turnos. Para lograrlo, analizamos tres enfoques de ventanas:

- Ventanas de salto de tamaño constante
- Ventanas deslizantes
- Ventanas de sesión

En cada uno de estos ejemplos, la página tiene cambios de diseño de diferente gravedad a lo largo del tiempo. Cada barra azul representa un cambio de diseño único y la longitud representa la [puntuación](/cls/#layout-shift-score) de ese cambio. Las imágenes ilustran las formas en que las diferentes estrategias de ventanas agrupan los cambios de diseño a lo largo del tiempo.

#### Ventanas de salto de tamaño constante

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/tumbling-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Ejemplo de una ventana de salto de tamaño constante</figcaption></figure>

El enfoque más simple es dividir la página en ventanas de partes del mismo tamaño. Estos se llaman ventanas de salto de tamaño constante. Arriba notará que la cuarta barra realmente parece que debería estar agrupada en la segunda ventana de salto de tamaño constante, pero debido a que todas las ventanas tienen un tamaño fijo, está en la primera ventana. Si hay ligeras diferencias en el tiempo de las cargas o las interacciones del usuario en la página, los mismos cambios de diseño pueden caer en diferentes lados de los límites de la ventana de salto de tamaño constante.

#### Ventanas deslizantes

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/sliding-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Ejemplo de ventana deslizante.</figcaption></figure>

Un enfoque que nos permite ver más agrupaciones posibles de la misma longitud es actualizar continuamente la ventana potencial a lo largo del tiempo. La imagen de arriba muestra una ventana deslizante a la vez, pero podríamos mirar todas las ventanas deslizantes posibles o un subconjunto de ellas para crear una métrica.

#### Ventanas de sesión

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Ejemplo de ventana de sesión.</figcaption></figure>

Si quisiéramos centrarnos en identificar áreas de la página con ráfagas de cambios de diseño, podríamos iniciar cada ventana en un turno y seguir aumentando hasta que encontremos un intervalo de tamaño determinado entre los cambios de diseño. Este enfoque agrupa los cambios de diseño e ignora la mayor parte de la experiencia del usuario sin cambios. Un problema potencial es que si no hay intervalos en los cambios de diseño, una métrica basada en las ventanas de sesión podría crecer sin límites al igual que la métrica CLS actual. Así que también probamos esto con un tamaño máximo de ventana.

### Tamaños de ventana

La métrica puede dar resultados muy diferentes según el tamaño real de las ventanas, por lo que probamos varios tamaños de ventana diferentes:

- Cada cambio como su propia ventana (sin ventanas)
- 100 ms
- 300 ms
- 1 segundo
- 5 segundos

### Resumen

Probamos muchas formas de resumir las diferentes ventanas.

#### Percentiles

Observamos el valor máximo de la ventana, así como el percentil 95, el percentil 75 y la mediana.

#### Promedio

Observamos el valor medio de la ventana.

#### Presupuestos

Nos preguntamos si tal vez había algún puntaje mínimo de cambio de diseño que los usuarios no notarían, y simplemente podríamos contar los cambios de diseño sobre ese "presupuesto" en el puntaje. Entonces, para varios valores potenciales de "presupuesto", observamos el porcentaje de cambios sobre el presupuesto y la puntuación total del cambio sobre este.

### Otras estrategias

También analizamos muchas estrategias que no involucraban ventanas, como el cambio de diseño total dividido entre el tiempo en la página y el promedio de los peores N turnos individuales.

## Resultados iniciales

En general, probamos **145 definiciones de métricas diferentes** basadas en permutaciones de las ideas anteriores. Para cada métrica, clasificamos todos los recorridos de los usuarios por su puntuación en la métrica y luego clasificamos las métricas según lo cerca que estaban de la clasificación ideal.

Para obtener una línea de referencia, también clasificamos todos los sitios según su puntaje CLS actual. La CLS se ubicó en el puesto 32, empatando con otras 13 estrategias, por lo que fue mejor que la mayoría de las permutaciones de las estrategias anteriores. Para asegurarnos de que los resultados fueran significativos, también agregamos en tres órdenes aleatorios. Como era de esperar, los órdenes aleatorios resultaron peor que todas las estrategias probadas.

Para comprender si podríamos estar sobreajustados para el conjunto de datos, después de nuestro análisis, registramos algunos videos y seguimientos de cambios de diseño nuevos, los clasificamos manualmente y vimos que las clasificaciones métricas eran muy similares para el conjunto de datos nuevo y el original.

Algunas estrategias diferentes se destacaron en la clasificación.

### Mejores estrategias

Cuando clasificamos las estrategias, encontramos tres tipos que encabezaban la lista. Cada uno tuvo aproximadamente el mismo rendimiento, por lo que planeamos avanzar con un análisis más profundo de cada uno. También nos gustaría escuchar los comentarios de los desarrolladores para comprender si hay factores fuera de la experiencia del usuario que deberíamos considerar al decidir entre ellos. (Consulte a continuación cómo brindar retroalimentación).

#### Percentiles altos de ventanas largas

Algunas estrategias de ventanas funcionaron bien con tamaños de ventana largos:

- Ventanas deslizantes de 1 segundo
- Ventanas de sesión limitadas a 5 segundos con un intervalo de 1 segundo
- Ventanas de sesión destapadas con un intervalo de 1 segundo

Todas calificaron muy bien tanto en el percentil 95 como en el máximo.

Sin embargo, para tamaños de ventanas tan grandes, estábamos preocupados por usar el percentil 95; a menudo veíamos solo de 4 a 6 ventanas, y tomar el percentil 95 de eso es mucha interpolación. No está claro qué está haciendo la interpolación en términos del valor métrico. El valor máximo es mucho más claro, por lo que decidimos seguir adelante con la verificación del máximo.

#### Promedio de ventanas de sesión con intervalos largos

El promedio de las puntuaciones de todas las ventanas de sesión destapadas con intervalos de 5 segundos entre ellas funcionó muy bien. Esta estrategia tiene algunas características interesantes:

- Si la página no tiene intervalos entre los cambios de diseño, termina siendo una ventana de sesión larga con exactamente la misma puntuación que la CLS actual.
- Esta métrica no tuvo en cuenta directamente el tiempo de inactividad; solo tomó en cuenta los cambios que ocurrieron en la página, y no en momentos en los que la página no estaba cambiando.

#### Percentiles altos de ventanas cortas

La ventana deslizante máxima de 300 ms clasificó muy alto, así como el percentil 95. Para el tamaño de ventana más corto, hay menos interpolación de percentiles que los tamaños de ventana más grandes, pero también nos preocupaba la "repetición" de las ventanas deslizantes: si se produce un conjunto de cambios de diseño en dos marcos, hay varias ventanas de 300 ms que las incluyen. Tomar el máximo es mucho más claro y sencillo que tomar el percentil 95. Así que de nuevo decidimos seguir adelante comprobando el máximo.

### Estrategias que no funcionaron

Las estrategias que intentaron considerar la experiencia "promedio" del tiempo dedicado tanto sin cambios de diseño como con cambios de diseño, obtuvieron muy malos resultados. Ninguno de los resúmenes de la mediana o del percentil 75 de ninguna estrategia de ventana clasificó bien los sitios, así como tampoco la suma de los cambios de diseño a lo largo del tiempo.

Evaluamos varios "presupuestos" diferentes para cambios de diseño aceptables:

- El porcentaje de diseño cambia por encima de cierto presupuesto. Para varios presupuestos, todos estos se clasificaron bastante mal.
- El cambio de diseño promedio por encima de algún exceso. La mayoría de las variaciones de esta estrategia funcionaron mal, pero el exceso promedio durante una sesión larga con un gran intervalo lo hizo casi tan bien como el promedio de ventanas de sesión con intervalos largos. Decidimos seguir adelante solo con este último porque es más simple.

## Próximos pasos

### Análisis a mayor escala

Hemos implementado en Chrome las principales estrategias mostradas anteriormente, de modo que podamos obtener datos sobre el uso real para un conjunto mucho más grande de sitios web. Planeamos utilizar un enfoque similar de clasificación de sitios en función de sus puntuaciones métricas para realizar el análisis a mayor escala:

- Clasificar todos los sitios por CLS y por cada nuevo aspecto candidato a métrica.
    - ¿Qué sitios están clasificados de manera más diferente por la CLS y cada candidato? ¿Encontramos algo inesperado cuando vemos estos sitios?
    - ¿Cuáles son las mayores diferencias entre los nuevos candidatos a métricas? ¿Alguna de las diferencias se destaca como ventaja o desventaja de un candidato específico?
- Repetir el análisis anterior, pero agrupando el tiempo dedicado a la carga de cada página. ¿Vemos una mejora esperada para las cargas de páginas de larga duración con un cambio de diseño aceptable? ¿Vemos resultados inesperados para las páginas de corta duración?

### Retroalimentación sobre nuestro enfoque

Nos encantaría recibir comentarios de los desarrolladores web sobre estos enfoques. Algunas cosas a tener en cuenta al considerar los nuevos enfoques:

#### Lo que no cambia

Queremos aclarar que muchas cosas no cambiarán con un nuevo enfoque:

- Ninguna de nuestras ideas de métricas cambia la forma en que las puntuaciones de cambio de diseño para [marcos individuales se calculan](/cls/#layout-shift-score), solo la forma en que resumimos varios marcos. Esto significa que la [API de JavaScript](/cls/#measure-cls-in-javascript) para cambios de diseño seguirá siendo la misma, y los eventos subyacentes en los seguimientos de Chrome que utilizan las herramientas de desarrollador también permanecerán iguales, por lo que las reacciones de cambio de diseño en herramientas como WebPageTest y Chrome DevTools seguirán funcionando de la misma manera.
- Continuaremos trabajando duro para hacer que las métricas sean fáciles de adoptar para los desarrolladores, incluyéndolas en la [biblioteca web-](https://github.com/GoogleChrome/web-vitals) [vitals](/metrics) , documentando en web.dev e informándolas en nuestras herramientas para desarrolladores como Lighthouse.

#### Compensación entre métricas

Una de las estrategias principales resume las ventanas de cambio de diseño como un promedio, y el resto informa la ventana máxima. Para las páginas que están abiertas durante mucho tiempo, es probable que el promedio informe un valor más representativo, pero en general será más fácil para los desarrolladores actuar en una sola ventana: pueden registrar cuándo ocurrió, los elementos que cambiaron y demás. Nos encantaría recibir comentarios sobre cuál es más importante para los desarrolladores.

¿Le resultan más fáciles de entender las ventanas deslizantes o de sesión? ¿Las diferencias son importantes para usted?

#### Cómo brindar retroalimentación

Puede probar las nuevas métricas de cambio de diseño en cualquier sitio utilizando nuestras [implementaciones de JavaScript de ejemplo](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver) o nuestra [bifurcación de la extensión Core Web Vitals](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

Envíe sus comentarios por correo electrónico a nuestro **[grupo de Google web-vitals-feedback](https://groups.google.com/g/web-vitals-feedback)**, con el asunto "[Layout Shift Metrics]". ¡Estamos ansiosos por escuchar lo que piensa!
