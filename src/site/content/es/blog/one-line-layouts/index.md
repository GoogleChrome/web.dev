---
title: Diez diseños modernos en una línea de CSS
subhead: Este artículo destaca algunas poderosas líneas de CSS que se ocupan del trabajo pesado y le ayudan a construir diseños modernos y robustos.
authors:
  - una
description: Este artículo destaca algunas poderosas líneas de CSS que se ocupan del trabajo pesado y le ayudan a construir diseños modernos y robustos.
date: 2020-07-07
hero: image/admin/B07IzuMeRRGRLH9UQkwd.png
alt: Diseño del Santo Grial.
tags:
  - blog
  - css
  - layout
  - mobile
---

{% YouTube 'qm0IfG1GyZU' %}

Los diseños de CSS modernos permiten a los desarrolladores escribir reglas de estilo realmente significativas y sólidas digitando unas pocas teclas. La conversación anterior y esta publicación posterior examinan 10 poderosas líneas de CSS que hacen un trabajo bien pesado.

{% Glitch {id: '1linelayouts', path: 'README.md', height: 480} %}

Para seguir o probar estas demostraciones por su cuenta, consulte el Glitch insertado arriba o visite [1linelayouts.glitch.me](https://1linelayouts.glitch.me).

## 01. Supercentrado: `place-items: center`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/01-place-items-center.mp4">
  </source></video></figure>

Para el primer diseño 'de una sola línea', vamos a resolver el más grande misterio del CSS: cómo centrar las cosas. Verás que es más fácil de lo que piensas con [`place-items: center`](https://developer.mozilla.org/docs/Web/CSS/place-items).

Primero especifique `grid` como `display` y luego escriba `place-items: center` en el mismo elemento. `place-items` es una forma abreviada de establecer `align-items` y `justify-items` al mismo tiempo. Al darle el valor de `center`, tanto `align-items` como `justify-items` quedan con el valor `center`.

```css/2
.parent {
  display: grid;
  place-items: center;
}
```

Esto permite que el contenido esté perfectamente centrado dentro del elemento primario, independientemente del tamaño intrínseco.

## 02. El panqueque deconstruido: `flex: <grow> <shrink> <basewidth>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4">
  </source></video></figure>

¡A continuación tenemos el panqueque deconstruido! Este es un diseño común para los sitios de marketing, por ejemplo, que pueden tener una fila de 3 elementos, generalmente con una imagen, un título y luego algo de texto, que describe algunas características de un producto. En dispositivos móviles, queremos que estos elementos se apilen bien y se expandan a medida que aumentamos el tamaño de la pantalla.

Al usar Flexbox para este efecto, no necesitará consultas de medios (media queries) para ajustar la ubicación de estos elementos cuando la pantalla cambie de tamaño.

La abreviatura [`flex`](https://developer.mozilla.org/docs/Web/CSS/flex) equivale a: `flex: <flex-grow> <flex-shrink> <flex-basis>`.

Debido a esto, si desea que sus cajas llenen todo su `<flex-basis>`, se encoja en tamaños más pequeños, pero no se *estire* para llenar el espacio adicional, digite: `flex: 0 1 <flex-basis>`. En este caso, su `<flex-basis>` tiene `150px` por lo que se ve así:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

Si, en cambio *desea* que las cajas se estiren y llenen todo el espacio a medida que se desplazan a la siguiente línea, use `<flex-grow>` con el valor `1`, como se muestra a continuación:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4">
  </source></video></figure>

Ahora, a medida que aumenta o disminuye el tamaño de la pantalla, estos elementos flexibles crecen o se encogen respectivamente.

## 03. La barra lateral dice: `grid-template-columns: minmax(<min>, <max>) …)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4">
  </source></video></figure>

Esta demostración aprovecha la [función minmax](https://developer.mozilla.org/docs/Web/CSS/minmax) para diseños de cuadrícula. Lo que haremos aquí es establecer el tamaño mínimo de la barra lateral a `150px`, pero en pantallas más grandes, dejaremos que se extienda `25%` más. La barra lateral siempre ocupará el `25%` del espacio horizontal del elemento padre hasta que ese `25%` se vuelva menor que `150px`.

Agregue esto como un valor de grid-template-columns con el siguiente valor: `minmax(150px, 25%) 1fr`. El elemento de la primera columna (la barra lateral en este caso) tiene un `minmax` de `150px` con `25%`, y el segundo elemento (la sección `principal` en este caso) ocupa el resto del espacio como una sola sección`1fr`.

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

## 04. Pila de panqueques: `grid-template-rows: auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4">
  </source></video></figure>

A diferencia del panqueque deconstruido, este ejemplo no ajusta a los elementos secundarios cuando el tamaño de la pantalla cambia. Comúnmente conocido como [sticky footer](https://developer.mozilla.org/docs/Web/CSS/Layout_cookbook/Sticky_footers), este diseño se usa a menudo tanto para sitios web como para aplicaciones, en aplicaciones móviles (el pie de página es comúnmente una barra de herramientas) y sitios web (las aplicaciones de una sola página a menudo usan este diseño global).

Agregar `display: grid` al componente le dará una cuadrícula de una sola columna, sin embargo, el área principal solo será tan alta como el contenido con el pie de página debajo.

Para hacer que el pie de página se pegue al final, agregue:

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

Esto configura el contenido del encabezado y pie de página para que tome automáticamente el tamaño de sus hijos, y aplica el espacio restante (`1fr`) al área principal, mientras que la fila con tamaño `auto` tomará el tamaño del contenido mínimo de sus elementos secundarios, de modo que si ese contenido aumenta de tamaño, la fila crecerá para ajustarse.

## 05. Diseño del Santo Grial clásico: `grid-template: auto 1fr auto / auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4">
  </source></video></figure>

Para este diseño clásico del Santo Grial, tenemos encabezado, pie de página, barra lateral izquierda, barra lateral derecha y contenido principal. Es similar al diseño anterior, ¡pero ahora con barras laterales!

Para escribir la cuadrícula completa usando una sola línea de código, use la propiedad `grid-template`. Esto le permite configurar filas y columnas al mismo tiempo.

El par de propiedad y valor es: `grid-template: auto 1fr auto / auto 1fr auto`. La barra inclinada entre la primera y la segunda lista separadas por espacios es el salto entre filas y columnas.

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

Como en el último ejemplo, donde el encabezado y el pie de página tenían contenido de tamaño automático, aquí la barra lateral izquierda y derecha se dimensionan automáticamente en función del tamaño intrínseco de sus elementos secundarios. Sin embargo, esta vez es el tamaño horizontal (ancho) en lugar del vertical (alto).

## 06. Cuadrícula flexible de 12-columnas: `grid-template-columns: repeat(12, 1fr)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4">
  </source></video></figure>

A continuación tenemos otro clásico: la cuadrícula de 12 columnas. Puede escribir cuadrículas rápidamente en CSS con la función `repeat()`. Utilizando: `repeat(12, 1fr);` para las columnas de la plantilla de cuadrícula obtiene 12 columnas de `1fr` cada una.

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

Ahora, con una cuadrícula de 12 columnas, podemos colocar a nuestros elementos secundarios en la cuadrícula. Una forma de hacer esto sería colocarlos usando líneas de cuadrícula. Por ejemplo, `grid-column: 1 / 13` 1/13 abarcaría todo el espacio desde la primera línea hasta la última (13ª) y abarcaría 12 columnas. `grid-column: 1 / 5;` abarcaría las primeras cuatro.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4">
  </source></video></figure>

Otra forma de escribir esto es usando la palabra clave `span`. Con `span`, se establece la línea de inicio y luego la cantidad de columnas que se abarcarán desde ese punto de inicio. En este caso, `grid-column: 1 / span 12` sería equivalente a `grid-column: 1 / 13`, y `grid-column: 2 / span 6` sería equivalente a `grid-column: 2 / 8`.

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```

## 07. RAM (Repeat, Auto, MinMax): `grid-template-columns(auto-fit, minmax(<base>, 1fr))`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-1.mp4">
  </source></video></figure>

Para este séptimo ejemplo, combinamos algunos de los conceptos ya aprendidos para crear un diseño receptivo con elementos secundarios flexibles y posicionados automáticamente. Genial. Los términos clave para recordar aquí son `repeat`, `auto-(fit|fill)` y `minmax()'`, que puede recordar por la sigla RAM.

Todo junto, se ve así:

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

Está utilizando repeat de nuevo, pero esta vez, utilizando `auto-fit` en vez de un valor numérico explícito. Esto permite el posicionamiento automático de estos elementos secundarios. Estos elementos también tienen un valor mínimo de `150px` con un valor máximo de `1fr`, lo que significa que en pantallas más pequeñas, tendrán el ancho completo de `1fr` y, a medida que alcancen `150px` de ancho cada una, comenzarán a fluir hacia la misma línea.

Con `auto-fit`, las cajas aumentarán a medida que su tamaño horizontal supere los 150px para llenar todo el espacio restante. Sin embargo, si cambia a `auto-fill`, no aumentarán cuando se exceda su tamaño base con la función minmax:

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-2.mp4">
  </source></video></figure>

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
```

## 08. Alinear: `justify-content: space-between`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4">
  </source></video></figure>

Para el siguiente diseño, el punto principal a demostrar aquí es `justify-content: space-between`, que coloca el primer y el último elemento secundario en los bordes de su caja delimitadora, con el espacio restante distribuido uniformemente entre los elementos. Para estas tarjetas, se colocan en un modo de visualización Flexbox, con la dirección configurada en columna usando `flex-direction: column`.

Esto coloca el título, la descripción y el bloque de imagen en una columna vertical dentro de la tarjeta principal. Luego, la aplicación de `justify-content: space-between` ancla el primer (título) y el último (bloque de imagen) elemento a los bordes del flexbox, y el texto descriptivo entre ellos se coloca con el mismo espaciado en cada extremo.

```css/3
.parent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## 09. Cohibiendo el estilo: `clamp(<min>, <actual>, <max>)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/09-clamping.mp4">
  </source></video></figure>

Aquí es donde entramos en algunas técnicas con [menos compatibilidad](https://caniuse.com/#feat=css-math-functions) con el navegador, pero con algunas implicaciones realmente interesantes para la disposición y el diseño de interfaz de usuario receptiva. En esta demostración, está configurando el ancho usando clamp de la siguiente manera: `width: clamp(<min, <actual>, <max>)`.

Esto establece un tamaño mínimo y máximo absoluto, y un tamaño real. Con valores, puede verse así:

```css/1
.parent {
  width: clamp(23ch, 60%, 46ch);
}
```

El tamaño mínimo aquí es de `23ch` o 23 unidades de caracteres, y el tamaño máximo es de `46ch`, 46 caracteres. [Las unidades de ancho de carácter](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/) se basan en el tamaño de fuente del elemento (específicamente el ancho del caracter `0` ). El tamaño 'real' es 50%, que representa el 50% del ancho principal de este elemento.

Lo que `clamp()` hace aquí es permitir que este elemento retenga un 50% de ancho *hasta* que el 50% sea mayor que `46ch` (en ventanillas más amplias) o menor que `23ch` (en ventanillas más pequeñas). Puede ver que a medida que se estira y se encoge el tamaño principal, el ancho de esta tarjeta aumenta hasta su punto límite máximo y disminuye hasta su límite mínimo. Luego permanece centrado en el elemento primario, ya que hemos aplicado propiedades adicionales para centrarlo. Esto permite diseños más legibles, ya que el texto no será demasiado ancho (por encima de `46ch` ) ni demasiado aplastado y estrecho (menos de `23ch`).

Esta también es una excelente manera de implementar tipografía receptiva. Por ejemplo, podría escribir: `font-size: clamp(1.5rem, 20vw, 3rem)`. En este caso, el tamaño de fuente de un título siempre se mantendrá entre `1.5rem` y `3rem` pero crecerá y se reducirá en función del valor actual de `20vw` para ajustarse al ancho de la ventanilla.

Esta es una excelente técnica para garantizar la legibilidad con un valor de tamaño mínimo y máximo, pero recuerde que no es compatible con todos los navegadores modernos, así que asegúrese de tener alternativas y realice las pruebas.

## 10. Respeto por el aspecto: `aspect-ratio: <width> / <height>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4">
  </source></video></figure>

Y finalmente, esta última herramienta de diseño es la más experimental de todas. Recientemente se introdujo a Chrome Canary en Chromium 84, y Firefox realiza un esfuerzo activo para implementarla, pero actualmente no se encuentra en ninguna de las ediciones estables de navegadores.

Aún así, queremos mencionarlo porque es un problema que se encuentra con mucha frecuencia: mantener la relación de aspecto de una imagen.

Con la propiedad `aspect-ratio`, a medida que cambiamos el tamaño de la tarjeta, el bloque visual verde mantiene esta relación de aspecto de 16 x 9. Estamos respetando la relación de aspecto usando `aspect-ratio: 16 / 9`.

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

Para mantener una relación de aspecto de 16 x 9 sin esta propiedad, es preciso usar un [hack de `padding-top`](https://css-tricks.com/aspect-ratio-boxes/) con un relleno del `56.25%` para establecer una relación entre la parte superior y el ancho. En breve tendremos una propiedad para que esto y no tendremos que recurrir al hack y a la necesidad de calcular el porcentaje. Puede hacer un cuadrado con proporción `1 / 1`, una proporción de 2 a 1 con `2 / 1` y realmente cualquier cosa que necesite para que esta imagen sea dimensionada con una proporción de tamaño específica.

```css/1
.square {
  aspect-ratio: 1 / 1;
}
```

Si bien esta función aún está en desenvolvimiento, es bueno conocerla, ya que resuelve una de las problemáticas de desarrolladores a las que nos enfrentamos con frecuencia, especialmente cuando se trata de videos e iframes.

## Conclusión

Gracias por hacer este recorrido a través de 10 poderosas líneas de CSS. Para obtener más información, vea [el video completo](https://youtu.be/qm0IfG1GyZU) y pruebe [las demostraciones](https://1linelayouts.glitch.me) por sí mismo.
