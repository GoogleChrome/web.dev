---
title: La evolución de la métrica CLS
subhead: Planes dirigidos a mejorar la métrica CLS para que sea más justa con las páginas de larga duración.
description: Planes dirigidos a mejorar la métrica CLS para que sea más justa con las páginas de larga duración.
authors:
  - anniesullie
  - hbsong
date: 2021-04-07
hero: image/admin/JSBg0yF1fatrTDQSKiTW.webp
alt: Un ejemplo sobre el enfoque en el desarrollo de ventanas para medir cambios en el diseño.
tags:
  - blog
  - performance
  - web-vitals
---

{% Aside %} **2 de junio de 2021:** La actualización de CLS descrita en esta publicación ya está disponible en todas las apariencias de las herramientas web de Chrome. Consulte [La evolución de Cumulative Layout Shift: Cambio Acumulativo del diseño en las herramientas web](/cls-web-tooling/) para obtener más información. {% endAside %}

Nosotros (el equipo de métricas de velocidad de Chrome) recientemente presentamos nuestra investigación inicial sobre las [opciones para hacer que la métrica CLS sea más justa para las páginas que están abiertas durante mucho tiempo](/better-layout-shift-metric/). Recibimos muchos comentarios muy útiles y, después de completar el análisis a gran escala, finalizamos el cambio que planeamos realizar a la métrica: **Ventana de sesión máxima con un intervalo de 1 segundo, con un límite de 5 segundos**.

¡Siga leyendo para conocer los detalles!

## ¿Cómo evaluamos las opciones?

Revisamos todos los comentarios que recibimos de la comunidad de desarrolladores y los tomamos en cuenta.

También implementamos las [mejores opciones](/better-layout-shift-metric/#best-strategies) en Chrome e hicimos un análisis a gran escala de las métricas en millones de páginas web. Verificamos qué tipos de sitios mejoró cada opción, y cómo se compararon las opciones, especialmente examinando los sitios que fueron calificados de manera diferente por diferentes opciones. En general, encontramos que:

- **Todas** las opciones redujeron la correlación entre el tiempo de permanencia en la página y la puntuación obtenida por el cambio de diseño.
- **Ninguna** de las opciones produjo una peor puntuación para ninguna de las páginas. Así que no hay que preocuparse de que este cambio empeore las puntuaciones de su sitio.

## Puntos a tomar en cuenta para tomar decisiones

### ¿Por qué una ventana de sesión?

En nuestra [publicación anterior](/better-layout-shift-metric/), cubrimos [algunas estrategias diferentes en el desarrollo de ventanas](/better-layout-shift-metric/#windowing-strategies) para agrupar los cambios de diseño y garantizar que la puntuación no crezca sin límites. Los comentarios que recibimos de los desarrolladores favorecieron abrumadoramente la estrategia de la ventana de sesión porque agrupa los cambios de diseño de forma más intuitiva.

A continuación se muestra un ejemplo para revisar las ventanas de la sesión:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Ejemplo de ventana de sesión.</figcaption></figure>

En el ejemplo anterior, se producen muchos cambios de diseño a lo largo del tiempo mientras el usuario ve la página. Cada uno está representado por una barra azul. Observará que las barras azules tienen diferentes alturas, que representan la [puntuación](/cls/#layout-shift-score) de cada cambio de diseño. Una ventana de sesión comienza con el primer cambio de diseño y continúa expandiéndose hasta que hay un espacio sin cambios de diseño. Cuando se produce el siguiente cambio de diseño, se inicia una nueva ventana de sesión. Dado que hay tres intervalos sin cambios de diseño, hay tres ventanas de sesión en el ejemplo. Al igual que en la definición actual de CLS, las puntuaciones de cada cambio se suman, de modo que la puntuación de cada ventana es la suma de sus cambios de diseño individuales.

Basándonos en la [investigación inicial](/better-layout-shift-metric/#best-strategies), elegimos un intervalo de 1 segundo entre las ventanas de sesión, y ese intervalo funcionó bien en nuestro análisis a gran escala. Por lo tanto, el "intervalo entre sesiones" que se muestra en el ejemplo anterior es de 1 segundo.

### ¿Por qué la ventana de sesión máxima?

En nuestra investigación inicial redujimos las [estrategias de resumen](/better-layout-shift-metric/#summarization) a dos opciones:

- La puntuación **promedio** de todas las ventanas de sesión, para ventanas de sesión muy grandes (ventanas sin límite con intervalos de 5 segundos entre ellas).
- La puntuación **máxima** de todas las ventanas de sesión, para las ventanas de sesión más pequeñas (con un límite de 5 segundos, con intervalos de 1 segundo entre ellas).

Después de la investigación inicial, agregamos cada métrica a Chrome para poder hacer un análisis a gran escala de millones de URL. En el análisis a gran escala, encontramos muchas URL con patrones de cambio de diseño como este:

{% Img src="image/MZfwZ8oVW8U6tzo5CXffcER0jR83/bW3lHZmss3cqGayZsq4P.png", alt="Ejemplo de un pequeño cambio de diseño que reduce el promedio", width="800", height="550" %}

En la parte inferior derecha, se puede ver que solo hay un único y diminuto cambio de diseño en la Ventana de Sesión 2, lo que le da una puntuación muy baja. Eso significa que la puntuación promedio es bastante baja. ¿Pero qué pasa si el desarrollador arregla ese pequeño cambio de diseño? Entonces la puntuación se calcula únicamente en la Ventana de Sesión 1, lo que significa que la puntuación de la página *casi se duplica*. Sería realmente confuso y desalentador para los desarrolladores mejorar sus cambios de diseño solo para descubrir que la puntuación ha empeorado. Y la eliminación de este pequeño cambio de diseño es, obviamente, ligeramente mejor para la experiencia del usuario, por lo que no debería empeorar la puntuación.

Debido a este problema con los promedios, decidimos seguir adelante con las ventanas máximas más pequeñas y limitadas. Así, en el ejemplo anterior, se ignoraría la Ventana de Sesión 2 y solo se informaría de la suma de los cambios de diseño en la Ventana de Sesión 1.

### ¿Por qué 5 segundos?

Evaluamos varios tamaños de ventana y encontramos dos cosas:

- En el caso de las ventanas cortas, una carga más lenta de la página y una respuesta más lenta a las interacciones del usuario podrían interrumpir los cambios de diseño en varias ventanas y mejorar la puntuación. ¡Queríamos mantener la ventana lo suficientemente grande como para no recompensar las ralentizaciones!
- Hay algunas páginas con un flujo continuo de pequeños cambios de diseño. Por ejemplo, una página de resultados deportivos que cambia un poco con cada actualización de los resultados. Estos cambios son molestos, pero no se vuelven más molestos con el paso del tiempo. Así que queríamos asegurarnos de que la ventana se limitará a este tipo de cambios de diseño.

Si consideramos estas dos cosas y comparamos una variedad de tamaños de ventana en muchas páginas web del mundo real, llegamos a la conclusión de que 5 segundos sería un buen límite para el tamaño de la ventana.

## ¿Cómo afectará esto a la puntuación CLS de mi página?

Dado que esta actualización limita el CLS de una página, **ninguna página tendrá una peor puntuación** como consecuencia de este cambio.

De acuerdo con nuestro análisis, el **55% de los orígenes no verán ningún cambio en el CLS en el percentil 75**. Esto se debe a que sus páginas actualmente no tienen ningún cambio de diseño o los cambios que tienen se limitan a una sola ventana de sesión.

**Con este cambio, el resto de los orígenes obtendrán mejores puntuaciones en el percentil 75.** La mayoría solo verá una leve mejora, pero alrededor del 3% verá mejorar sus puntuaciones, que pasarán de tener una calificación de "necesita mejorar" o "pobre" a tener una calificación "buena". Estas páginas tienden a utilizar desplazamientos infinitos o tienen muchas actualizaciones lentas en la interfaz del usuario, como se describe en nuestra [publicación anterior](/better-layout-shift-metric/).

## ¿Cómo puedo probarlo?

Pronto actualizaremos nuestras herramientas para que utilicen la nueva definición de la métrica. Hasta entonces, puede probar la versión actualizada de CLS en cualquier sitio que utilice las [implementaciones que se encuentran en el ejemplo de JavaScript](https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver) o la [bifurcación de la extensión Web Vitals](https://github.com/mmocny/web-vitals-extension/tree/experimental-ls).

¡Gracias a todos los que se tomaron el tiempo de leer la publicación anterior y dar sus comentarios!
