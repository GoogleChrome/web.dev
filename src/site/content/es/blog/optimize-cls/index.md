---
title: Cómo optimizar Cumulative Layout Shift
subhead: Aprenda a evitar los cambios repentinos de diseño para mejorar la experiencia del usuario
authors:
  - addyosmani
date: 2020-05-05
updated: 2021-08-17
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: Cumulative Layout Shift (CLS) es una métrica que cuantifica la frecuencia con la que los usuarios experimentan cambios repentinos en el contenido de la página. En esta guía, cubriremos la optimización de las causas comunes de CLS, como las imágenes y los iframes sin dimensiones o el contenido dinámico.
alt: Los cambios de diseño pueden empujar repentinamente el contenido que está leyendo o en el que se va a hacer clic más abajo en la página, lo que provoca una experiencia de usuario deficiente. Reservar espacio para los contenidos dinámicos que provocan cambios en el diseño permite realizar una experiencia de usuario más agradable.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88' %}

"¡Estaba a punto de hacer clic en eso! ¿Por qué se movió? 😭"

Los cambios de diseño pueden distraer a los usuarios. Imagine que comenzó a leer un artículo y, de repente, los elementos cambian alrededor de la página, lo que le hace perder y le pide que encuentre su sitio de nuevo. Esto es muy común en la web, incluso cuando se leen las noticias o se intenta hacer clic en los botones "Buscar" o "Agregar al carrito". Tales experiencias son visualmente discordantes y frustrantes. A menudo se producen cuando los elementos visibles se ven obligados a moverse porque otro elemento se agregó repentinamente a la página o cambió su tamaño.

[Cumulative Layout Shift: Cambio Acumulativo del diseño](/cls) (CLS): una métrica de [Core Web Vitals](/vitals), mide la inestabilidad del contenido sumando las puntuaciones en los cambios de diseño que no se producen dentro de los 500 ms de la entrada de los usuarios. Se observa la cantidad de contenido visible que cambió en la ventana de visualización, así como la distancia a la que cambiaron los elementos impactados.

En esta guía, cubriremos la optimización de las causas comunes de los cambios de diseño.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Los valores de CLS buenos son inferiores a 0,1, los valores deficientes son superiores a 0,25 y cualquier valor intermedio debe mejorarse", width="384", height="96", class="w-screenshot w-screenshot--filled width-full" %}
</picture>

Las causas más comunes de una CLS deficiente son:

- Imágenes sin dimensiones
- Anuncios, inserciones e iframes sin dimensiones
- Contenido inyectado dinámicamente
- Fuentes web que causan FOIT/FOUT
- Acciones que esperan una respuesta de la red antes de actualizar el DOM

## Imágenes sin dimensiones 🌆

**Resumen:** siempre incluya los atributos de tamaño `width` y `height` en sus imágenes y elementos de video. Alternativamente, reserve el espacio necesario con [casillas de relación de aspecto en CSS](https://css-tricks.com/aspect-ratio-boxes/). Este enfoque garantiza que el navegador pueda asignar la cantidad correcta de espacio en el documento mientras se carga la imagen.

<figure class="w-figure">
  {% Video
    src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"],
    poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg",
    controls=true,
    loop=true,
    muted=true,
    class="w-screenshot"
  %}
 <figcaption class="w-figcaption">
    Imágenes sin ancho ni alto específico.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Video
    src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"],
    poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg",
    controls=true,
    loop=true,
    muted=true,
    class="w-screenshot"
  %}
 <figcaption class="w-figcaption">
    Imágenes sin ancho ni alto especificado.
  </figcaption>
</figure>

<figure class="w-figure">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="Informe de Lighthouse que muestra el impacto antes/después del Cumulative Layout Shift después de establecer las dimensiones en las imágenes", width="800", height="148" %}
<figcaption class="w-figcaption">
  Impacto de Lighthouse 6.0 en el establecimiento de las dimensiones de la imagen en CLS.
</figcaption>
</figure>


### Historia

En los primeros días de la web, los desarrolladores agregaban los atributos `width` y `height` en sus etiquetas `<img>` para garantizar de que se asigne suficiente espacio en la página antes de que el navegador comience a obtener las imágenes. Esto minimizaría el reflujo y el rediseño.

```html
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

Puede notar que `width` y `height` situados anteriormente en el texto no incluyen unidades. Estas dimensiones en "pixeles" garantizarían que se reserve un área de 640x360. La imagen se estiraría para adaptarse a este espacio, independientemente de si las dimensiones reales coinciden o no.

Cuando se introdujo el [Diseño web responsivo](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/), los desarrolladores comenzaron a omitir `width` y `height`, y empezaron a utilizar CSS para cambiar el tamaño de las imágenes:

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

Una desventaja de este enfoque es que solo se puede asignar espacio a una imagen una vez que se comienza a descargar y el navegador puede determinar sus dimensiones. Conforme se cargaban las imágenes, la página se redimensionaba conforme que aparecía cada imagen en la pantalla. Se volvió común que el texto apareciera repentinamente en la pantalla. Esta no era en absoluto una gran experiencia para el usuario.

Aquí es donde entra en juego la relación de aspecto. La relación de aspecto de una imagen es la relación entre su ancho y su altura. Es común ver esto expresado como dos números separados por dos puntos (por ejemplo, 16: 9 o 4: 3). Para una relación de aspecto x: y, la imagen tiene "x" unidades de ancho y "y" unidades de alto.

Esto significa que si conocemos una de las dimensiones, se puede determinar la otra. Para una relación de aspecto 16:9 podríamos obtener lo siguiente:

- Si puppy.jpg tiene una altura de 360 px, el ancho es 360 x (16/9) = 640 px
- Si puppy.jpg tiene un ancho de 640 px, la altura es de 640 x (9/16) = 360 px

Conocer la relación de aspecto permite al navegador calcular y reservar suficiente espacio para la altura y el área asociada.

### Prácticas recomendadas modernas

Los navegadores modernos ahora establecen la relación de aspecto predeterminada de las imágenes basándose en los atributos del ancho y alto de una imagen, por lo que es valioso establecerlos para evitar cambios de diseño. Gracias al Grupo de Trabajo de CSS, los desarrolladores solo necesitan establecer el `width` y el `height` de forma habitual:

```html
<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

… y las [hojas de estilo UA](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets) de todos los navegadores agregan una [relación de aspecto predeterminada](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images) basada en los atributos de `width` y `height`

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

Esto calcula una relación de aspecto basada en los atributos `width` y `height` antes de que se cargue la imagen. Proporciona esta información al comienzo del cálculo del diseño. En cuanto se indica que una imagen tiene un ancho determinado (por ejemplo, `width: 100%` ), la relación de aspecto se utiliza para calcular la altura.

Sugerencia: si tiene dificultades para comprender la relación de aspecto, hay una [calculadora](https://aspectratiocalculator.com/16-9.html) útil disponible para ayudarlo.

Los cambios de relación de aspecto de la imagen anteriores se enviaron a [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231) y [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891), y están llegando a [WebKit](https://twitter.com/smfr/status/1220051332767174656) (Safari).

Para una fantástica inmersión en profundidad en la relación de aspecto con un análisis más detallado de las imágenes responsivas, consulte [Cómo cargar páginas libres de bloqueos con relaciones de aspecto en los medios](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/).

Si su imagen está en un contenedor, puede utilizar CSS para cambiar el tamaño de la imagen al ancho de este contenedor. Establecemos `height: auto;` para evitar que la altura de la imagen sea un valor fijo (por ejemplo, `360px`).

```css
img {
  height: auto;
  width: 100%;
}
```

**¿Qué sucede con las imágenes responsive?**

Cuando se trabaja con [imágenes responsive](/serve-responsive-images), `srcset` define las imágenes entre las que se permite que el navegador seleccione y el tamaño de cada imagen. Para garantizar que los atributos width y height de `<img>` se puedan establecer, cada imagen debe utilizar la misma relación de aspecto.

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="Puppy with balloons"
/>
```

¿Qué sucede con la [dirección de arte](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)?

Es posible que las páginas deseen incluir una foto recortada de una imagen en ventanas de visualización estrechas con la imagen completa tal como se muestra en el escritorio.

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="Puppy with balloons" />
</picture>
```

Es muy probable que estas imágenes tengan diferentes relaciones de aspecto y los navegadores aún estén evaluando cuál debería ser la solución más eficiente en este caso, incluso si las dimensiones deben especificarse en todas las fuentes. Hasta que se decida una solución, la retransmisión sigue siendo posible en este caso.

## Anuncios, incrustaciones e iframes sin dimensiones 📢😱

### Anuncios

Los anuncios son uno de los factores que más contribuyen a los cambios de diseño en la web. Las redes publicitarias y los editores normalmente admiten tamaños de anuncios dinámicos. Los tamaños de los anuncios aumentan el rendimiento y los ingresos debido a las mayores tasas de clics y al mayor número de anuncios que compiten en la subasta. Desafortunadamente, esto puede conducir a una experiencia de usuario subóptima debido a que los anuncios empujan el contenido visible que está viendo hacia abajo en la página.

Durante el ciclo de vida del anuncio, muchos puntos pueden introducir el cambio de diseño:

- Cuando un sitio inserta el contenedor de anuncios en el DOM
- Cuando un sitio cambia el tamaño del contenedor de anuncios con código de origen
- Cuando se carga la biblioteca de etiquetas de anuncios (y cambia el tamaño del contenedor de anuncios)
- Cuando el anuncio llena un contenedor (y cambia de tamaño si el anuncio final tiene un tamaño diferente)

La buena noticia es que es posible que los sitios sigan las prácticas recomendadas para reducir el cambio de los anuncios. Los sitios pueden mitigar estos cambios de diseño de la siguiente manera:

- Reserve de forma estática el espacio publicitario.
    - En otras palabras, aplique estilo al elemento antes de que se cargue la biblioteca de etiquetas de anuncios.
    - Si coloca anuncios en el flujo de contenido, asegúrese de eliminar los cambios reservando el tamaño del espacio. Estos anuncios *no deberían* causar cambios de diseño si se cargan fuera de la pantalla.
- Tenga cuidado al colocar anuncios no adhesivos cerca de la parte superior de la ventana de visualización.
    - En el siguiente ejemplo, se recomienda mover el anuncio a la parte inferior del logotipo de "visión del mundo" y asegúrese de reservar suficiente espacio para el lugar.
- Evite contraer el espacio reservado si no se devuelve ningún anuncio cuando el espacio publicitario se encuentra visible para mostrar un marcador de posición.
- Elimine los cambios reservando el mayor tamaño posible para el espacio publicitario.
    - Esto funciona, pero corre el riesgo de tener un espacio en blanco si un mensaje publicitario más pequeño llena el lugar.
- Elija el tamaño más probable para el espacio publicitario basándose en los datos históricos.

Algunos sitios pueden encontrar que contraer el lugar inicialmente puede reducir los cambios de diseño si es poco probable que se llene el espacio publicitario. No hay una manera fácil de elegir el tamaño exacto cada vez, a menos que usted mismo controle los servicios publicitarios.

<figure class="w-figure">
  {% Video
    src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"],
    poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
    controls=true,
    loop=true,
    muted=true,
    class="w-screenshot"
  %}
 <figcaption class="w-figcaption">
    Anuncios sin suficiente espacio reservado.
  </figcaption>
</figure>

<figure class="w-figure">
    {% Video
      src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"],
      poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg",
      controls=true,
      loop=true,
      muted=true,
      class="w-screenshot"
    %}
 <figcaption class="w-figcaption">
    Anuncios con suficiente espacio reservado.
  </figcaption>
</figure>

<figure class="w-figure">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="Informe del Lighthouse que muestra el impacto antes/después del Cumulative Layout Shift para reservar el espacio para banners como anuncios", width="800", height="148" %}
<figcaption class="w-figcaption">
  Impacto de Lighthouse 6.0 para reservar el espacio de este banner en CLS
</figcaption>
</figure>

#### Reserve de forma estática el espacio publicitario

Diseñe de forma estática los elementos del espacio del DOM con los mismos tamaños transferidos a su biblioteca de etiquetas. Esto puede ayudar a garantizar que la biblioteca no introduzca cambios de diseño cuando se cargue. Si no hace esto, la biblioteca puede cambiar el tamaño del lugar para el elemento después de diseñar la página.

También considere los tamaños de los anuncios más pequeños. Si se publica un anuncio más pequeño, un editor puede diseñar el contenedor (más grande) para evitar cambios de diseño. La desventaja de este enfoque es que aumentará la cantidad de espacio en blanco, así que tenga en cuenta la disyuntiva.

#### Evite colocar anuncios cerca de la parte superior de la ventana de visualización

Los anuncios situados cerca de la parte superior de la ventana de visualización pueden provocar un mayor cambio del diseño que los situados en el centro. Esto se debe a que los anuncios de la parte superior generalmente tienen más contenido que en la parte inferior, lo que significa que se mueven más elementos cuando el anuncio provoca un cambio. Por el contrario, los anuncios situados en el centro de la ventana de visualización puede que no cambien tantos elementos, ya que es menos probable que el contenido situado por encima se mueva.

### Incrustaciones e iframes

Los widgets integrables le permiten incrustar contenido web portátil en su página (por ejemplo, videos de YouTube, mapas de Google Maps, publicaciones en redes sociales, y así sucesivamente). Estas incrustaciones pueden adoptar varias formas:

- Respaldo HTML y una etiqueta JavaScript que transforma el respaldo en una incrustación elegante
- Fragmento de HTML en estilos integrados en el código
- iframe incrustado

Estas incrustaciones con frecuencia no son conscientes del tamaño de una incrustación (por ejemplo, en el caso de una publicación en las redes sociales: ¿tiene una imagen incrustada, un video, varias filas de texto?). Como resultado, las plataformas que ofrecen incrustaciones no siempre reservan suficiente espacio para sus incrustaciones y pueden provocar cambios de diseño cuando finalmente se cargan.

<figure class="w-figure">
  {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
 <figcaption class="w-figcaption">
    Incrustar sin espacio reservado.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
 <figcaption class="w-figcaption">
    Incrustar con espacio reservado.
  </figcaption>
</figure>

<figure class="w-figure">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="Informe del Lighthouse que muestra el impacto antes/después del Cumulative Layout Shift para reservar el espacio para esta incrustación en CLS", width="800", height="148" %}
<figcaption class="w-figcaption">
  Informe del Lighthouse 6.0 que muestra el impacto para reservar el espacio para esta incrustación en CLS
</figcaption>
</figure>

Para solucionar esto, puede minimizar el CLS pre-calculando el espacio suficiente para las incrustaciones con un marcador de posición o una reserva. Un flujo de trabajo que puede utilizar para las incrustaciones:

- Obtenga la altura de su incrustación final inspeccionándola con las herramientas de desarrollo de su navegador
- Una vez que la incrustación se cargue, el contenido del iframe cambiará de tamaño para ajustarse a su contenido.

Tome nota de las dimensiones y aplique el estilo de un marcador de posición para la incrustación correspondiente. Es posible que deba tener en cuenta las diferencias sutiles en el tamaño de los anuncios/marcadores de posición entre diferentes factores de forma que utilice consultas de medios.

### Contenido dinámico 📐

**Resumen:** evite insertar contenido nuevo por encima del contenido existente, a menos que sea en respuesta a la interacción del usuario. Esto asegura que se esperen los cambios de diseño que se produzcan.

Probablemente haya experimentado cambios de diseño debido a la interfaz de usuario que aparece en la parte superior o inferior de la ventana de visualización cuando intenta cargar un sitio. Al igual que con los anuncios, esto normalmente sucede con los banners y formularios que cambian el resto del contenido de la página:

- "¡Suscríbase a nuestro boletín!" (¡Vaya, más despacio! ¡Nos acabamos de conocer!)

- "Contenido relacionado"

- "Instale nuestra aplicación [iOS/Android]"

- "Aún estamos recibiendo solicitudes"

- "Notificación del  GDPR"

  <figure class="w-figure">
    {% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true, class="w-screenshot" %}
    <figcaption class="w-figcaption">
      Contenido dinámico sin espacio reservado.
    </figcaption>
  </figure>

Si necesita mostrar este tipo de posibilidades de la interfaz del usuario, reserve suficiente espacio en la ventana de visualización para ello con anticipación (por ejemplo, utilice un marcador de posición o una interfaz de usuario de esqueleto) para que cuando se cargue, no haga que el contenido de la página cambie de forma sorprendentemente.

En algunos casos, agregar contenido de forma dinámica es una parte importante de la experiencia del usuario. Por ejemplo, al cargar más productos en una lista de artículos o al actualizar el contenido de la transmisión en vivo. Hay varias formas de evitar cambios de diseño inesperados en esos casos:

- Sustituya el contenido antiguo por el nuevo dentro de un contenedor de tamaño fijo o utilice un carrusel y elimine el contenido antiguo después de la transición. Recuerde deshabilitar los enlaces y controles hasta que se complete la  transición para evitar clics o toques accidentales mientras llega el nuevo contenido.
- Haga que el usuario inicie la carga de contenido nuevo, para que no se sorprenda con el cambio (por ejemplo, con un botón "Cargar más" o "Actualizar"). Se recomienda buscar previamente el contenido antes de la interacción con el usuario para que aparezca de inmediato. Como recordatorio, los cambios de diseño que ocurren dentro de los 500 ms de la entrada del usuario no cuentan para CLS.
- Cargue sin problemas el contenido fuera de la pantalla y superponga una notificación para que el usuario sepa que está disponible (por ejemplo, con un botón "Desplazarse hacia arriba").

<figure class="w-figure">
  {% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="Ejemplos de carga de contenido dinámico sin provocar cambios de diseño inesperados en Twitter y el sitio web de Chloe", width="800", height="458" %}
  <figcaption class="w-figcaption">
    Ejemplos de carga de contenidos dinámicos sin provocar cambios inesperados en el diseño. Izquierda: carga de contenido en vivo en Twitter. Derecha: el ejemplo "obtener más información" en el sitio web de Chloé. Verifique cómo el equipo de YNAP se <a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">optimizó para que CLS cargue más contenido</a>.
  </figcaption>
</figure>

### Fuentes web que causan FOUT/FOIT 📝

La descarga y la renderización de fuentes web pueden provocar cambios en el diseño de dos formas:

- La fuente alternativa se cambia por una nueva (FOUT: destello de texto sin estilo)
- El texto "invisible" se muestra hasta que se procesa una nueva fuente (FOIT: destello de texto invisible)

Las siguientes herramientas pueden ayudarle a minimizar esto:

- <code>[font-display](/font-display/)</code>  permite modificar el comportamiento de la renderización de fuentes personalizadas con valores como <code>auto</code> , <code>swap</code> , <code>block</code> , <code>fallback</code> y <code>optional</code>. Desafortunadamente, todos estos valores (excepto los [opcionales](http://crrev.com/749080)) pueden causar un rediseño de una de las formas anteriores.
- La [API para cargar fuentes](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api) puede reducir el tiempo necesario para obtener las fuentes necesarias.

A partir de Chrome 83, también puedo recomendar lo siguiente:

- Al utilizar `<link rel=preload>` en las fuentes web clave: una fuente precargada tendrá una mayor probabilidad de encontrarse con el primer despliegue, en cuyo caso no habrá cambios de diseño.
- Combinando `<link rel=preload>` y `font-display: optional`

Lea [Cómo prevenir cambios de diseño y destellos del texto invisible (FOIT) cargando previamente fuentes opcionales](/preload-optional-fonts/) para obtener más detalles.

### Animaciones 🏃‍♀️

**Resumen:** elija las animaciones de `transform` a las animaciones de las propiedades que desencadenan cambios de diseño.

Los cambios en los valores de las propiedades CSS pueden hacer que el navegador reaccione a estos cambios. Un número de valores desencadenan el rediseño, el despliegue y la composición, como `box-shadow` y `box-sizing`. Varias propiedades de CSS se pueden cambiar de una manera menos costosa.

Para obtener más información sobre las propiedades de CSS que activan el diseño, consulte [Activadores de CSS](https://csstriggers.com/) y [animaciones de alto rendimiento](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

### Herramientas para desarrolladores 🔧

Me complace compartir que hay una serie de herramientas disponibles para medir y depurar el Cumulative Layout Shift (CLS).

[Lighthouse](https://developers.google.com/web/tools/lighthouse) [6.0](https://github.com/GoogleChrome/lighthouse/releases) y posteriores incluyen soporte para medir CLS en un entorno de laboratorio. Esta versión también destacará los nodos que causan más cambios de diseño.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="Lighthouse 6.0 incluye soporte para medir CLS en la sección de métricas", width="800", height="309" %}

El [panel de Rendimiento](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance) en DevTools resalta los cambios de diseño en la sección **Experiencia a** a partir de Chrome 84. La vista del **Resumen** para un realizar un `Cambio en el diseño` incluye la puntuación de cumulative layout shift, así como una superposición rectangular que muestra las regiones afectadas.

<figure class="w-figure">
  {% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Los registros de cambio de diseño se muestran en el panel de rendimiento de Chrome DevTools cuando se expande la sección Experiencia", width="800", height="438" %}
  <figcaption class="w-figcaption">Después de registrar un nuevo seguimiento en el panel de Rendimiento, la sección <b>Experiencia</b> de los resultados se completa con una barra de color rojo que muestra un registro <code>Layout Shift</code>. Al hacer clic en el registro, se puede profundizar en los elementos impactados (por ejemplo, observar desde/hasta las entradas que se movieron).</figcaption>
</figure>

También es posible medir CLS del mundo real agregado un nivel de origen que utilice el [Chrome User Experience Report](/chrome-ux-report-bigquery/). Los datos de CrUX CLS están disponibles por medio de BigQuery y una [consulta de muestra](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql) para ver que el rendimiento de CLS está disponible para su uso.

Espero que esto le ayude a mantener sus páginas con menos cambios :)

*Agradecemos a Philip Walton, Kenji Baheux, Warren Maresca, Annie Sullivan, Steve Kobes y Gilberto Cocchi por sus valiosos comentarios.*
