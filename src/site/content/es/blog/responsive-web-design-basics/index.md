---
title: Conceptos básicos del diseño web responsivo
subhead: Cómo crear sitios que respondan a las necesidades y capacidades del dispositivo en el que se ven.
description: |
  Cómo crear sitios que respondan a las necesidades y capacidades del dispositivo en el que se ven.
date: 2019-02-12
updated: 2020-05-14
authors:
  - petelepage
  - rachelandrew
tags:
  - blog
  - css
  - layout
  - mobile
  - ux
---

{# TODO(kayce): Elimina esta Tabla de Contenidos codificado de forma rígida una vez que #1983 aterrice. #}

- [Establecer la ventana gráfica](#viewport)
- [Ajustar el tamaño del contenido a la ventana gráfica](#size-content)
- [Utilice consultas de medios CSS para mejorar la capacidad de respuesta](#media-queries)
- [Cómo elegir los breakpoints](#breakpoints)
- [Ver consultas de medios con breakpoints en Chrome DevTools](#devtools)

El uso de dispositivos móviles para navegar por la web continúa creciendo a un ritmo astronómico, y estos dispositivos a menudo están limitados por el tamaño de la pantalla y requieren un enfoque diferente sobre cómo se presenta el contenido en la pantalla.

El diseño web responsivo, originalmente definido por [Ethan Marcotte en A List Apart](http://alistapart.com/article/responsive-web-design/), responde a las necesidades de los usuarios y a la de los dispositivos que utilizan. El diseño cambia según el tamaño y las capacidades del dispositivo. Por ejemplo, en un teléfono, los usuarios verían el contenido que se muestra en una vista de una sola columna mientras que una tableta puede mostrar el mismo contenido en dos columnas.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RKRFvbuoXGkOSuEArb7.mp4", autoplay=true, controls=true, loop=true, muted=true, playsinline=true %}</figure>

Existe una multitud de tamaños de pantalla diferentes en teléfonos, "phablets", tabletas, computadoras de escritorio, consolas de juegos, televisores e incluso dispositivos portátiles. Los tamaños de pantalla cambian constantemente, por lo que es importante que su sitio pueda adaptarse a cualquier tamaño de pantalla, hoy o en el futuro. Además, los dispositivos tienen distintas características con las que interactuamos con ellos. Por ejemplo, algunos de sus visitantes utilizarán una pantalla táctil. El diseño responsivo moderno considera todas estas cosas para optimizar la experiencia para todos.

## Configurar la ventana gráfica {: #viewport }

Las páginas optimizadas para una variedad de dispositivos deben incluir una meta etiqueta de ventana gráfica en el encabezado del documento. Una meta etiqueta de ventana gráfica le da al navegador instrucciones sobre cómo controlar las dimensiones y la escala de la página.

Para intentar brindar la mejor experiencia, los navegadores móviles representan la página con un ancho de pantalla de escritorio (generalmente alrededor de `980px`, aunque esto varía según los dispositivos) y luego intentan hacer que el contenido se vea mejor aumentando el tamaño de la fuente y escalando el contenido para que se ajuste al tamaño de la  pantalla. Esto significa que los tamaños de fuente pueden parecer inconsistentes para los usuarios que deben de tocar dos veces o pellizcar para hacer zoom para ver e interactuar con el contenido.

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …

```

El uso del valor de la meta etiqueta de ventana gráfica  `width=device-width` indica a la página que coincida con el ancho de la pantalla en píxeles independientes del dispositivo. Un dispositivo (o densidad) de píxeles independientes es una representación de un solo píxel, el cual en una pantalla de alta densidad puede constar de muchos píxeles físicos. Esto permite que la página redistribuya el contenido para que coincida con diferentes tamaños de pantalla, ya sea renderizado en un teléfono móvil pequeño o en un monitor de escritorio grande.

<figure>{% Img src="image/admin/SrMBH5gokGU06S0GsjLS.png", alt="Una captura de pantalla de una página con un texto difícil de leer gracias a que el texto se encuentra muy alejado", width="500", height="640" %}<figcaption> Un ejemplo de cómo se carga la página en un dispositivo sin la meta etiqueta de la ventana gráfica. <a href="https://without-vp-meta.glitch.me/">Vea este ejemplo en Glitch</a> .</figcaption></figure>

<figure>{% Img src="image/admin/9NrJxt3aEv37A3E7km65.png", alt="Una captura de pantalla de la misma página con el texto de un tamaño que se puede leer", width="500", height="888" %}<figcaption> Un ejemplo de cómo se carga la página en un dispositivo con la meta etiqueta de la ventana gráfica. <a href="https://with-vp-meta.glitch.me/">Vea este ejemplo en Glitch</a> .</figcaption></figure>

[Algunos navegadores](https://css-tricks.com/probably-use-initial-scale1/) mantienen constante el ancho de la página cuando se gira al modo horizontal y hacen zoom en lugar de volver a acomodar para llenar la pantalla. Agregar el valor `initial-scale=1` indica a los navegadores que establezcan una relación 1:1 entre los píxeles del CSS y los píxeles independientes del dispositivo, independientemente de la orientación del dispositivo, y permite que la página aproveche todo el ancho.

{% Aside 'caution' %} Para asegurarse de que los navegadores más antiguos puedan analizar correctamente los atributos, use una coma para separarlos. {% endAside %}

La auditoría Lighthouse de [No tiene una etiqueta `<meta name="viewport">` con `width` o `initial-scale`](/viewport/) puede ayudarle a automatizar el proceso de asegurarse de que sus documentos HTML estén usando la meta etiqueta de ventana gráfica correctamente.

### Asegurar una ventana gráfica accesible {: #access-viewport }

Además de establecer el `initial-scale`, también puede establecer los siguientes atributos en la ventana gráfica:

- `minimum-scale`
- `maximum-scale`
- `user-scalable`

Cuando se configuran, estos pueden deshabilitar la capacidad del usuario para hacer zoom en la ventana gráfica, lo que podría causar problemas de accesibilidad. Por lo tanto, no recomendamos utilizar estos atributos.

## Adapte el contenido a la ventana gráfica {: #size-content }

Tanto en el escritorio como en los dispositivos móviles, los usuarios están acostumbrados a desplazarse por los sitios web verticalmente pero no horizontalmente, obligar al usuario a desplazarse horizontalmente o alejarse para ver toda la página resulta en una mala experiencia de usuario.

Al desarrollar un sitio móvil con una meta etiqueta de ventana gráfica, es fácil crear accidentalmente contenido de página que no encaja del todo dentro de la ventana gráfica especificada. Por ejemplo, una imagen que se muestra con un ancho más grande que la ventana gráfica puede hacer que esta se desplace horizontalmente. Debe ajustar este contenido para que se ajuste al ancho de la ventana gráfica, de modo que el usuario no necesite desplazarse horizontalmente.

La auditoría de Lighthouse del [Contenido no tiene el tamaño adecuado para la ventana gráfica](/content-width/) puede ayudarle a automatizar el proceso de detección del contenido desbordado.

### Imágenes {: #images }

Una imagen tiene dimensiones fijas y si es más grande que la ventana gráfica, se creará una barra de desplazamiento. Una forma habitual de solucionar este problema es dar a todas las imágenes un `max-width` del `100%`. Esto hará que la imagen se encoja para ajustarse al espacio disponible, en caso de que el tamaño de la ventana gráfica sea más pequeño que el de la imagen. Sin embargo, debido a que el `max-width`, en lugar del `width` es del `100%`, la imagen no se estirará más que su tamaño natural. Por lo general, es seguro agregar lo siguiente a su hoja de estilo para que nunca tenga problemas con las imágenes que pueden causar una barra de desplazamiento.

```css
img {
  max-width: 100%;
  display: block;
}
```

#### Agregue las dimensiones de la imagen al elemento img {: #image-dimensions }

Cuando usa `max-width: 100%`, está anulando las dimensiones naturales de la imagen, sin embargo, aún debe usar los atributos de `width` y `height` en su etiqueta `<img>`. Esto se debe a que los navegadores modernos usarán esta información para reservar espacio para la imagen antes de que se cargue, esto ayudará a evitar [cambios de diseño](/optimize-cls/) a medida que se carga el contenido.

### Diseño {: #layout }

Dado que las dimensiones y el ancho de la pantalla en píxeles del CSS varían ampliamente entre dispositivos (por ejemplo, entre teléfonos y tabletas, e incluso entre diferentes teléfonos), el contenido no debe depender de un ancho de ventana en particular para renderizarse bien.

En el pasado, esto requería elementos de configuración que se usaban para crear un diseño basado en porcentajes. En el siguiente ejemplo, puede ver un diseño de dos columnas con elementos flotantes, con un tamaño con base en píxeles. Una vez que la ventana gráfica se vuelva más pequeña que el ancho total de las columnas, tenemos que desplazarnos horizontalmente para ver el contenido.

<figure>{% Img src="image/admin/exFCZNQLUveUnpMFjvcj.jpg", alt="Captura de pantalla de un diseño con dos columnas donde la segunda columna está por fuera de la ventana gráfica", width="800", height="504" %} <figcaption> Un diseño flotante que utiliza píxeles. <a href="https://layout-floats-px.glitch.me/">Vea este ejemplo en Glitch</a> .</figcaption></figure>

Al usar porcentajes para los anchos, las columnas siempre quedan como un cierto porcentaje del contenedor. Esto significa que las columnas se vuelven más estrechas, en lugar de crear una barra de desplazamiento.

{% Glitch {id: 'layout-floats-percent', ruta: 'README.md'}%}

Las técnicas modernas de diseño de CSS como Flexbox, Diseño de cuadrículas y Multicol facilitan mucho la creación de estas cuadrículas flexibles.

#### Flexbox {: #flexbox }

Este método de diseño es ideal cuando tiene un conjunto de elementos de diferentes tamaños y le gustaría que encajen cómodamente en una fila o más, donde los elementos más pequeños ocupan menos espacio y los más grandes tienen más espacio.

```css
.items {
  display: flex;
  justify-content: space-between;
}
```

En un diseño responsivo, puede usar Flexbox para mostrar elementos como una sola fila o envueltos en varias filas a medida que disminuye el espacio disponible.

{% Glitch {id: 'responsive-flexbox', altura: 220}%}

[Leer más sobre Flexbox](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox).

#### Diseño de cuadrículas CSS  {: #grid }

El diseño de cuadrícula CSS permite la creación sencilla de cuadrículas flexibles. Si consideramos el ejemplo anterior, en lugar de crear nuestras columnas con porcentajes, podríamos usar el diseño de cuadrícula y la `fr`, que representa una parte del espacio disponible en el contenedor.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

La cuadrícula también se puede utilizar para crear diseños de cuadrícula regulares, con tantos elementos como quepan. El número de pistas disponibles se reducirá a medida que se reduzca el tamaño de la pantalla. En la siguiente demostración, tenemos tantas tarjetas como quepan en cada fila, con un tamaño mínimo de `200px`.

{% Glitch 'grid-as-many-as-fit' %}

[Leer más sobre el diseño de cuadrículas CSS](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### Diseño de varias columnas {: #multicol }

Para ciertos tipos de diseño, puede usar un diseño de columnas múltiples (Multicol), que puede crear varias columnas responsivas con la propiedad de `column-width`. En la siguiente demostración, puede ver que se agregan columnas si hay espacio para otra columna de `200px`.

{% Glitch {id: 'responsive-multicol', ruta: 'style.css'}%}

[Leer más sobre Multicol](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout)

## Utilice consultas de medios CSS para mejorar la capacidad de respuesta {: #media-queries }

En ocasiones, necesitará realizar cambios más extensos en su diseño para permitir a un cierto tamaño de pantalla fuera de lo que permiten las técnicas que se muestran arriba. Aquí es donde las consultas de medios se vuelven útiles.

Las consultas de medios son filtros simples que se pueden aplicar a los estilos CSS. Facilitan el cambio de estilos según los tipos de dispositivos que despliegan el contenido o por las características de ese dispositivo, por ejemplo, ancho, alto, orientación, capacidad para desplazarse y si el dispositivo se está utilizando como pantalla táctil.

Para proporcionar diferentes estilos de impresión, debe apuntar a un *tipo* de salida para poder incluir una hoja de estilo con los estilos de impresión de la siguiente manera:

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <link rel="stylesheet" href="print.css" media="print">
    …
  </head>
  …
```

Alternativamente, puede incluir estilos de impresión dentro de su hoja de estilo principal mediante una consulta de medios:

```css
@media print {
  /* print styles go here */
}
```

{% Aside 'note' %} También es posible incluir hojas de estilo separadas en el archivo principal de CSS mediante el sintaxis de `@import`, `@import url(print.css) print;`, sin embargo, este uso no se recomendable por razones de rendimiento. Consulte [Evitar importaciones de CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#avoid_css_imports) para obtener más detalles. {% endAside %}

Para el diseño web responsivo, generalmente consultamos las *características* del dispositivo para proporcionar un diseño diferente para pantallas más pequeñas, o cuando detectamos que nuestro visitante está usando una pantalla táctil.

### Consultas de medios basadas en el tamaño de la ventana gráfica {: #viewport-media-queries }

Las consultas de medios nos permiten crear una experiencia responsiva donde se aplican estilos específicos a pantallas pequeñas, pantallas grandes y cualquier tamaño intermedio. La característica que estamos detectando aquí es el tamaño de la pantalla, con la cual podemos probar las siguientes cosas.

- `width` ( `min-width` `max-width` )
- `height` ( `min-height` `max-height` )
- `orientation`
- `aspect-ratio`

{% Glitch {id: 'media-queries-size', ruta: 'index.html'}%}

Todas estas características tienen una excelente compatibilidad con los navegadores; para obtener más detalles, incluyendo la información de soporte del navegador, consulte el [ancho](https://developer.mozilla.org/docs/Web/CSS/@media/width) , la [altura](https://developer.mozilla.org/docs/Web/CSS/@media/height) , la [orientación](https://developer.mozilla.org/docs/Web/CSS/@media/orientation) y [la relación de aspecto](https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio) en MDN.

{% Aside 'note' %} La especificación incluyó pruebas para `device-width` y `device-height`. Estos han quedado obsoletos y deben evitarse. `device-width` y `device-height` fueron utilizados para obtener el tamaño actual de la ventana del dispositivo, lo que no fue útil en práctica porque puede ser diferente de la ventana gráfica que está mirando el usuario, por ejemplo, al cambiar el tamaño de la ventana del navegador. {% endAside %}

### Consultas de medios basadas en la capacidad del dispositivo {: #capacity-media-queries }

Dada la gama de dispositivos disponibles, no podemos suponer que todos los dispositivos grandes son una computadora de escritorio o una computadora laptop, o que las personas solo usan una pantalla táctil en un dispositivo pequeño. Con algunas adiciones más recientes a la especificación de consultas de medios, podemos probar características como el tipo de puntero utilizado para interactuar con el dispositivo y si el usuario puede desplazarse sobre los elementos.

- `hover`
- `pointer`
- `any-hover`
- `any-pointer`

Intente ver esta demostración en diferentes dispositivos, como una computadora de escritorio normal y en un teléfono o tableta.

{% Glitch 'media-query-pointer' %}

Estas funciones más recientes tienen un buen soporte en todos los navegadores modernos. Obtenga más información en las páginas de MDN para [hover](https://developer.mozilla.org/docs/Web/CSS/@media/hover), [any-hover](https://developer.mozilla.org/docs/Web/CSS/@media/any-hover), [pointer](https://developer.mozilla.org/docs/Web/CSS/@media/pointer), [any-pointer](https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer).

#### Usando `any-hover` y `any-pointer`

Las funciones de `any-hover` y `any-pointer` comprueban si el usuario tiene la capacidad de pasar el ratón sobre un elemento (hover) o usar ese tipo de puntero, incluso si no es la forma principal en la que interactúa con su dispositivo. Tenga mucho cuidado al usarlos. ¡Obligar a un usuario a cambiar a un ratón cuando está usando su pantalla táctil no es algo fácil! Sin embargo, `any-hover` y `any-pointer` pueden ser útiles si es importante averiguar qué tipo de dispositivo tiene un usuario. Por ejemplo, una laptop con pantalla táctil y trackpad debe coincidir con punteros gruesos y finos, además de la capacidad de situar el puntero sobre un elemento.

## Cómo elegir los breakpoints {: #breakpoints }

No defina los breakpoints basados en clases de dispositivos. La definición de breakpoints basados en dispositivos, productos, marcas o sistemas operativos específicos que se utilizan hoy en día puede resultar en una pesadilla de mantenimiento. En cambio, el contenido en sí debería determinar cómo se ajusta el diseño a su contenedor.

### Elija los breakpoints principales comenzando con algo pequeño y partir de ahí {: #major-breakpoints }

Primero diseñe el contenido para que se ajuste a un tamaño de pantalla pequeño, luego expanda la pantalla hasta que sea necesario un breakpoint. Esto le permite optimizar los breakpoints según el contenido y mantener la menor cantidad de breakpoints posible.

Trabajemos en el ejemplo que vimos al principio: el pronostico del clima. El primer paso es hacer que el pronóstico se vea bien en una pantalla pequeña.

<figure>{% Img src="image/admin/3KPWtKzDFCwImLyHprRP.png", alt="Captura de pantalla de una aplicación del pronostico del clima con un ancho de dispositivo móvil", width="400", height="667" %}<figcaption> La aplicación en una anchura muy estrecha.</figcaption></figure>

A continuación, cambie el tamaño del navegador hasta que haya demasiado espacio en blanco entre los elementos y el pronóstico del clima no se vea tan bien. La decisión es algo subjetiva, pero por encima de `600px` es ciertamente demasiado amplia.

<figure>{% Img src="image/admin/sh1P84rvjvviENlVFED4.png", alt="Captura de pantalla de una aplicación meteorológica con grandes espacios entre los elementos", width="400", height="240" %} <figcaption> La aplicación en un punto en el que creemos que deberíamos modificar el diseño.</figcaption></figure>

Para insertar un breakpoint en `600px`, cree dos consultas de medios al final de su CSS para el componente, una que se utilice cuando el navegador tenga `600px` o menos, y otra para cuando sea más ancho que `600px`.

```css
@media (max-width: 600px) {

}

@media (min-width: 601px) {

}
```

Finalmente, refactorice el CSS. Dentro de la consulta de medios para un `max-width` de `600px`, agregue el CSS que es solo para pantallas pequeñas. Dentro de la consulta de medios para un `min-width` mínimo de `601px` agregue CSS para pantallas más grandes.

#### Elija breakpoints menores cuando sea necesario

Además de elegir breakpoints importantes cuando el diseño cambia significativamente, también es útil ajustarlos para cambios menores. Por ejemplo, entre los breakpoints principales puede resultar útil ajustar los márgenes o el relleno de un elemento, o aumentar el tamaño de la fuente para que se sienta más natural en el diseño.

Comencemos optimizando el diseño de la pantalla pequeña. En este caso, aumentemos la fuente cuando el ancho de la ventana sea `360px`. De manera seguida, cuando hay suficiente espacio, podemos separar las temperaturas altas y bajas para que estén en la misma línea en lugar de una encima de la otra. Y también hagamos un poco más grandes los íconos del clima.

```css
@media (min-width: 360px) {
  body {
    font-size: 1.0em;
  }
}

@media (min-width: 500px) {
  .seven-day-fc .temp-low,
  .seven-day-fc .temp-high {
    display: inline-block;
    width: 45%;
  }

  .seven-day-fc .seven-day-temp {
    margin-left: 5%;
  }

  .seven-day-fc .icon {
    width: 64px;
    height: 64px;
  }
}
```

Del mismo modo, para las pantallas grandes, es mejor limitar el ancho máximo del panel de pronóstico para que no consuma todo el ancho de la pantalla.

```css
@media (min-width: 700px) {
  .weather-forecast {
    width: 700px;
  }
}
```

{% Glitch {id: 'responsive-forecast', ruta: 'style.css'}%}

### Optimiza el texto para leer

La teoría clásica de la legibilidad sugiere que una columna ideal debe contener de 70 a 80 caracteres por línea (aproximadamente de 8 a 10 palabras en inglés). Por lo tanto, cada vez que el ancho de un bloque de texto supere las 10 palabras, considere agregar un breakpoint.

<figure>{% Img src="image/admin/C4IGJw9hbPXKnTSovEXS.jpg", alt="Captura de pantalla de una página de texto en un dispositivo móvil", width="400", height="488" %} <figcaption> El texto como se lee en un dispositivo móvil.</figcaption></figure>

<figure>{% Img src="image/admin/rmsa1EB5FpvWV0vFIpTF.jpg", alt="Captura de pantalla de una página de texto en un navegador de escritorio", width="800", height="377" %} <figcaption> El texto como se lee en un navegador de escritorio con un breakpoint agregado para restringir la longitud de la línea.</figcaption></figure>

Echemos un vistazo más profundo al ejemplo de la publicación anterior del blog. En pantallas más pequeñas, la fuente Roboto en `1em` funciona perfectamente acumulando 10 palabras por línea, pero las pantallas más grandes requieren un breakpoint. En este caso, si el ancho del navegador es superior a `575px`, el ancho ideal del contenido es `550px`.

```css
@media (min-width: 575px) {
  article {
    width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

{% Glitch {id: 'rwd-reading', ruta: 'index.html'}%}

### Evite ocultar contenido

Tenga cuidado al elegir qué contenido ocultar o mostrar según el tamaño de la pantalla. No oculte el contenido simplemente porque no puede caber en la pantalla. El tamaño de la pantalla no es una indicación definitiva de lo que puede querer un usuario. Por ejemplo, eliminar el recuento de polen del pronóstico del clima podría ser un problema grave para las personas alérgicas en primavera que necesitan la información para determinar si pueden salir o no.

## Ver consultas de medios de breakpoints en Chrome DevTools {: #devtools }

Una vez que haya configurado sus consultas de medios de breakpoints, querrá ver cómo se ve su sitio con ellos. Puede cambiar el tamaño de la ventana de su navegador para activar los puntos de interrupción, pero Chrome DevTools tiene una función incorporada que facilita ver cómo se ve una página en diferentes puntos de interrupción.

<figure>{% Img src="image/admin/DhaeCbVo5AmzZ0CyLtVp.png", alt="Captura de pantalla de DevTools con nuestra aplicación del pronostico del clima abierta y un ancho de 822 píxeles seleccionados.", width="800", height="522" %} <figcaption> DevTools muestra la aplicación del pronóstico del clima a medida que se ve en un tamaño de ventana más amplio.</figcaption></figure>

<figure>{% Img src="image/admin/35IEQnhGox93PHvbeglM.png", alt="Captura de pantalla de DevTools con nuestra aplicación del pronostico del clima abierta y un ancho de 436 píxeles seleccionados.", width="800", height="521" %}<figcaption> DevTools muestra la aplicación del pronóstico del clima a medida que se ve en un tamaño de ventana gráfica más estrecho.</figcaption></figure>

Para ver su página en diferentes breakpoints:

[Abra DevTools](https://developer.chrome.com/docs/devtools/open/) y luego active el [modo de dispositivo](https://developer.chrome.com/docs/devtools/device-mode/#toggle). Esto se abre en [modo responsivo](https://developer.chrome.com/docs/devtools/device-mode/#responsive) de forma predeterminada.

Para ver sus consultas de medios, abra el menú de modo de dispositivo y seleccione [Mostrar consultas de medios](https://developer.chrome.com/docs/devtools/device-mode/#queries) para mostrar sus breakpoints como barras de colores sobre su página.

Haga clic en una de las barras para ver su página mientras esa consulta de medios está activa. Haga clic con el botón derecho en una barra para saltar a la definición de la consulta de medios.
