---
title: Grid (cuadrícula)
description: |2-

  La disposición en cuadrícula CSS proporciona un sistema de distribución bidimensional,
  controlando la distribución en filas y columnas.
  En este módulo, descubra todo lo que la cuadrícula tiene para ofrecer.
audio:
  title: 'El Podcast de CSS   - 011: Grid'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_011_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-29
---

Una disposición muy común en el diseño web es la de cabecera, barra lateral, cuerpo y pie de página.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/tj7KmP72RKkffGQRswpA.svg", alt="Un encabezado con logotipo y navegación con una barra lateral y un área de contenido que incluye un artículo", width="800", height="531" %}

A lo largo de los años, ha habido muchos métodos para resolver esta distribución, pero con la cuadrícula CSS, no solo es relativamente sencillo, sino que tiene muchas opciones. La cuadrícula (Grid) es excepcionalmente útil para combinar el control que proporciona el tamaño extrínseco con la flexibilidad del tamaño intrínseco, lo que lo hace ideal para este tipo de disposición. Esto se debe a que la cuadrícula es un método de distribución diseñado para contenido bidimensional. Es decir, colocar las cosas en filas y columnas al mismo tiempo.

Al crear una distribución de cuadrícula, usted define una cuadrícula con filas y columnas. Luego, coloca elementos en esa cuadrícula o permite que el navegador los coloque automáticamente en las celdas que ha creado. El tema de la cuadrícula es muy extenso, pero con una descripción general de lo que tiene disponible, pronto estará haciendo diseños de cuadrícula.

## Descripción general

Entonces, ¿qué puede hacer con la cuadrícula? Las distribuciones de cuadrícula tienen las siguientes características. Aprenderá sobre todos ellos en esta guía.

1. Una cuadrícula se puede definir con filas y columnas. Puede elegir cómo dimensionar estas bandas de filas y columnas o pueden reaccionar al tamaño del contenido.
2. Los hijos directos (elementos secundarios) del contenedor de la cuadrícula se colocarán automáticamente en esta cuadrícula.
3. O puede colocar los elementos en la ubicación precisa que desee.
4. Las líneas y áreas de la cuadrícula se pueden nombrar para facilitar la colocación.
5. El espacio libre en el contenedor de cuadrícula se puede distribuir entre las bandas.
6. Los elementos de la cuadrícula se pueden alinear dentro de su área.

## Terminología de cuadrícula

El elemento Grid viene con un montón de terminología nueva, ya que es la primera vez que CSS tiene un sistema de distribución real.

### Líneas de cuadrícula

Una cuadrícula está formada por líneas, que corren horizontal y verticalmente. Si su cuadrícula tiene cuatro columnas, tendrá cinco líneas de columna, incluida la que está después de la última columna.

Las líneas se numeran empezando por 1, y la numeración sigue el modo de escritura y la dirección del script del componente. Esto significa que la línea de la columna 1 estará a la izquierda en un idioma de izquierda a derecha como el inglés y a la derecha en un idioma de derecha a izquierda como el árabe.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Sf8WXYmbhZkbhhPeqTrY.svg", alt="Representación de diagrama de líneas de cuadrícula", width="800", height="434" %}

### Bandas de cuadrícula

Una banda es el espacio entre dos líneas de cuadrícula. Una banda de fila está entre dos líneas de fila y una banda de columna entre dos líneas de columna. Cuando creamos nuestra cuadrícula, creamos estas bandas asignándoles un tamaño.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/7YkhnpgOQLrcaxjlKmlU.svg", alt="Representación de diagrama de una banda de cuadrícula", width="800", height="434" %}

### Celda de cuadrícula

Una celda de cuadrícula es el espacio más pequeño en una cuadrícula definida por la intersección de bandas de fila y columna. Es como una celda de una tabla o una celda en una hoja de cálculo. Si define una cuadrícula y no coloca ninguno de los elementos, se colocarán automáticamente un elemento en cada celda de cuadrícula definida.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/lpiPCpW6fy4BjFOL6j77.svg", alt="Representación de diagrama de una celda de cuadrícula", width="800", height="434" %}

### Área de cuadrícula

Varias celdas de la cuadrícula juntas. Las áreas de cuadrícula se crean haciendo que un elemento se extienda por varias bandas.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/pGmMokRfoVbLNxf1VXrF.svg", alt="Representación de diagrama de un área de cuadrícula", width="800", height="434" %}

### Brechas (Gaps)

Una cuneta o callejón entre vías. A efectos de dimensionamiento, estos actúan como una banda normal. No puede colocar contenido en uuna brecha, pero puede distribuir elementos de cuadrícula a través de él.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/JNXSRH4j77loSB099E04.svg", alt="Representación de diagrama de una cuadrícula con brechas", width="800", height="434" %}

### Contenedor de cuadrícula

El elemento HTML al que se le aplicó el `display: grid` y, por lo tanto, crea un nuevo contexto de formato de cuadrícula para los hijos directos.

```css
.container {
  display: grid;
}
```

### Elemento de cuadrícula

Un elemento de la cuadrícula es un elemento que es un hijo directo del contenedor de la cuadrícula.

```html/1-3
<div class="container">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```

## Filas y columnas

Para crear una cuadrícula básica, puede definir una con tres bandas de columna, dos bandas de fila y una brecha de 10 píxeles entre bandas de la siguiente manera.

```css
.container {
    display: grid;
    grid-template-columns: 5em 100px 30%;
    grid-template-rows: 200px auto;
    gap: 10px;
}
```

Esta cuadrícula demuestra muchas de las cosas descritas en la sección de terminología. Tiene tres bandas de columna. Cada banda usa una unidad de longitud diferente. Tiene dos bandas de fila, una que usa una unidad de longitud y la otra automática. Cuando se utiliza como un tamaño automático de banda, se puede pensar que es tan grande como el contenido. Las bandas tienen un tamaño automático de forma predeterminada.

Si el elemento con una clase de `.container` tiene elementos hijos, se colocarán inmediatamente en esta cuadrícula. Puede ver esto en acción en la siguiente demostración.

{% Codepen { user: 'web-dot-dev', id: 'NWdbrzr' } %}

Las herramientas de desarrollo de Chrome Grid pueden ayudarlo a comprender las distintas partes de la cuadrícula.

Abra la [demostración](https://codepen.io/web-dot-dev/full/NWdbrzr) en Chrome. Inspeccione el elemento con el fondo gris, que tiene un ID de `container`. Resalte la cuadrícula seleccionando la insignia de la cuadrícula en el DOM, junto al elemento `.container`. Dentro de la pestaña Diseño, seleccione **Mostrar números de línea** en el menú desplegable para ver los números de línea en su cuadrícula.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/YxpjWBUDsqQB2fr6rzU3.jpg", alt="Como se describe en el título y las instrucciones", width="800", height="449" %}<figcaption> Una cuadrícula resaltada en Chrome DevTools que muestra números de línea, celdas y bandas.</figcaption></figure>

### Palabras clave de tamaño intrínsecas

Además de las dimensiones de longitud y porcentaje, como se describe en la sección sobre [unidades de tamaño](/learn/css/sizing), las bandas de cuadrícula pueden usar palabras clave de tamaño intrínsecas. Estas palabras clave se definen en la especificación Box Sizing y agregan métodos adicionales de dimensionamiento de cajas en CSS, no solo bandas de cuadrícula.

- `min-content`
- `max-content`
- `fit-content()`

La palabra clave [`min-content`](https://developer.mozilla.org/docs/Web/CSS/min-content) hará que una banda sea lo más pequeña posible sin que su contenido se desborde. Cambiar el diseño de la cuadrícula de ejemplo para tener tres bandas de columna, todas con `min-content`, significará que se volverán tan estrechas como la palabra más larga de la banda.

La palabra clave [`max-content`](https://developer.mozilla.org/docs/Web/CSS/max-content) tiene el efecto contrario. La banda se volverá lo suficientemente ancha para que todo el contenido se muestre en una cadena larga e ininterrumpida. Esto puede causar desbordamientos ya que la cadena no será envolvente.

La función [`fit-content()`](https://developer.mozilla.org/docs/Web/CSS/fit-content()) actúa como `max-content` al principio. Sin embargo, una vez que la banda alcanza el tamaño que usted pasa a la función, el contenido comienza a ajustarse. Por lo tanto, `fit-content(10em)` creará una banda de menos de 10em, si el tamaño `max-content` es inferior a 10em, pero nunca mayor de 10em.

En la siguiente demostración, pruebe las diferentes palabras clave intrínsecas de tamaño cambiando el tamaño de las bandas de la cuadrícula.

{% Codepen { user: 'web-dot-dev', id: 'qBRqNgL', height: 600 } %}

{% Aside %} Puede ver en esta demostración que cuando se usa auto, las columnas de la cuadrícula se estiran para llenar el contenedor. Las bandas de tamaño auto se estirarán de forma predeterminada si hay espacio adicional en el contenedor de la cuadrícula. {% endAside %}

### La unidad `fr`

Tenemos dimensiones de longitud existentes, porcentajes y también estas nuevas palabras clave. También hay un método de dimensionamiento especial que solo funciona en el diseño de cuadrícula. Esta es la unidad `fr`, una longitud flexible que describe una parte del espacio disponible en el contenedor de cuadrícula.

La unidad `fr` funciona de manera similar a usar `flex: auto` en flexbox. Distribuye el espacio una vez dispuestos los elementos. Por lo tanto, para tener tres columnas que tengan la misma proporción de espacio disponible:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

Como la unidad fr comparte el espacio disponible, se puede combinar con una brecha de tamaño fijo o bandas de tamaño fijo. Para tener un componente con un elemento de tamaño fijo y la segunda banda ocupando el espacio que queda, puede usar una lista de bandas como `grid-template-columns: 200px 1fr`.

El uso de diferentes valores para la unidad fr compartirá el espacio en proporción. Los valores más grandes obtienen más espacio libre. En la siguiente demostración, cambie el valor de la tercera banda.

{% Codepen { user: 'web-dot-dev', id: 'vYgyXNE', height: 600 } %}

### La función `minmax()`

Esta función significa que puede establecer un tamaño mínimo y máximo para una banda. Esto puede resultar muy útil. Si tomamos el ejemplo de la unidad `fr` antedicha que distribuye el espacio restante, podría escribirse usando [`minmax()`](https://developer.mozilla.org/docs/Web/CSS/minmax()) como `minmax(auto, 1fr)`. Grid analiza el tamaño intrínseco del contenido y luego distribuye el espacio disponible después de darle suficiente espacio al contenido. Esto significa que es posible que no obtenga bandas con una parte igual de todo el espacio disponible en el contenedor de la cuadrícula.

Para forzar que una banda ocupe una parte igual del espacio en el contenedor de la cuadrícula menos las brechas, use minmax. Reemplace `1fr` como tamaño de banda con `minmax(0, 1fr)`. Esto hace que el tamaño mínimo de la banda sea 0 y no el tamaño mínimo del contenido. Grid tomará todo el tamaño disponible en el contenedor, deducirá el tamaño necesario para cualquier brecha y compartirá el resto de acuerdo con sus unidades fr.

### Notación `repeat()`

Si desea crear una cuadrícula de bandas con 12 columnas iguales, puede usar el siguiente CSS.

```css
.container {
    display: grid;
    grid-template-columns:
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr);
}
```

O puede escribirlo usando [`repeat()`](https://developer.mozilla.org/docs/Web/CSS/repeat()):

```css
.container {
    display: grid;
    grid-template-columns: repeat(12, minmax(0,1fr));
}
```

La función `repeat()` se puede utilizar para repetir cualquier sección de su lista de bandas. Por ejemplo, puede repetir un patrón de bandas. También puede tener algunas bandas regulares y una sección repetida.

```css
.container {
    display: grid;
    grid-template-columns: 200px repeat(2, 1fr 2fr) 200px; /*creates 6 tracks*/
}
```

### `auto-fill` y `auto-fit`

Puede combinar todo lo que ha aprendido sobre el tamaño de bandas, `minmax()` y repeat, para crear un patrón útil con distribución de cuadrícula. Quizás no desee especificar el número de bandas de columna, sino que desee crear tantas como quepan en su contenedor.

Esto se puede conseguir con `repeat()` y las palabras clave `auto-fill` o `auto-fit`. En la siguiente demostración, la cuadrícula creará tantas bandas de 200 píxeles como quepan en el contenedor. Abra la demostración en una nueva ventana y vea cómo cambia la cuadrícula a medida que cambia el tamaño de la ventana gráfica.

{% Codepen { user: 'web-dot-dev', id: 'XWpNjgO' } %}

En la demostración obtenemos tantas bandas como quepan. Sin embargo, las bandas no son flexibles. Obtendrá un espacio al final hasta que haya suficiente espacio para otra banda de 200 píxeles. Si agrega la función `minmax()`, puede solicitar tantas bandas como quepan con un tamaño mínimo de 200 píxeles y un máximo de 1fr. Grid luego presenta las bandas de 200 píxeles y el espacio sobrante se distribuye por igual entre ellos.

Esto crea un diseño de respuesta bidimensional sin necesidad de consultas de medios.

{% Codepen { user: 'web-dot-dev', id: 'OJWbRax' } %}

Existe una sutil diferencia entre `auto-fill` y `auto-fit`. En la siguiente demostración, juegue con un diseño de cuadrícula utilizando la sintaxis explicada anteriormente, pero con solo dos elementos de cuadrícula en el contenedor de la cuadrícula. Con la palabra clave `auto-fill` puede ver que se han creado bandas vacías. Cambie la palabra clave a `auto-fit` y las bandas se colapsarán hasta el tamaño 0. Esto significa que las bandas flexibles ahora crecen para consumir espacio.

{% Codepen { user: 'web-dot-dev', id: 'MWJbbNe' } %}

En cualquier otro caso, las palabras clave `auto-fill` y `auto-fit` actúan exactamente iguales. No hay diferencia entre ellas una vez que se llena la primera banda.

## Colocación automática

Ya ha visto la colocación automática en cuadrículas funcionando en las demostraciones hasta ahora. Los elementos se colocan en la cuadrícula uno por celda en el orden en que aparecen en la fuente. Para muchos diseños, esto puede ser todo lo que necesita. Si necesita más control, hay un par de cosas que necesita hacer. El primero es modificar la distribución de colocación automática.

### Colocar elementos en columnas

El comportamiento predeterminado de la distribución de cuadrícula es colocar elementos a lo largo de las filas. En su lugar, puede hacer que los elementos se coloquen en columnas usando `grid-auto-flow: column`. Debe definir bandas de fila, de lo contrario, los elementos crearán bandas de columna intrínsecas y se distribuirán en una fila larga.

Estos valores se relacionan con el modo de escritura del documento. Una fila siempre se ejecuta en la dirección en la que se ejecuta una oración en el modo de escritura del documento o componente. En la siguiente demostración, puede cambiar el modo el valor de `grid-auto-flow` y la propiedad `writing-mode`.

{% Codepen { user: 'web-dot-dev', id: 'PoWbWbr', height: 600 } %}

### Abarcar bandas

Puede hacer que algunos o todos los elementos de un diseño colocado automáticamente abarquen más de una banda. Utilice la palabra clave `span` más el número de líneas a abarcar como valor para `grid-column-end` o `grid-row-end`.

```css
.item {
    grid-column-end: span 2; /* will span two lines, therefore covering two tracks */
}
```

Como no ha especificado un `grid-column-start`, este usa el valor inicial de `auto` y se coloca de acuerdo con las reglas de colocación automática. También puede especificar lo mismo usando la notación abreviada `grid-column`:

```css
.item {
    grid-column: auto / span 2;
}
```

### Llenar brechas

Una distribución colocada automáticamente con algunos elementos que abarcan varias bandas puede dar como resultado una cuadrícula con algunas celdas sin rellenar. El comportamiento predeterminado del diseño de cuadrícula con una distribución colocada completamente automáticamente es progresar siempre hacia adelante. Los artículos se colocarán según el orden en que se encuentren en la fuente, o cualquier modificación con la propiedad `order`. Si no hay suficiente espacio para colocar un elemento, la cuadrícula dejará un espacio y se moverá a la siguiente banda.

La siguiente demostración muestra este comportamiento. La casilla de verificación aplicará el modo de empaquetado denso. Esto se habilita dando a `grid-auto-flow` un valor `dense`. Con este valor, la cuadrícula tomará elementos más adelante en la distribución y los usará para llenar los espacios. Esto puede significar que la visualización se desconecte del orden lógico.

{% Codepen { user: 'web-dot-dev', id: 'ZELBLrJ', height: 600 } %}

## Colocación de elementos

Ya posee muchas funciones de CSS Grid. Veamos ahora cómo colocamos los elementos en la cuadrícula que hemos creado.

Lo primero que debe recordar es que el diseño de cuadrícula CSS Grid se basa en una cuadrícula de líneas numeradas. La forma más sencilla de colocar cosas en la cuadrícula es colocarlas de una línea a la otra. Descubrirá otras formas de colocar elementos en esta guía, pero siempre tendrá acceso a esas líneas numeradas.

Las propiedades que puede utilizar para colocar elementos por número de línea son:

- [`grid-column-start`](https://developer.mozilla.org/docs/Web/CSS/grid-column-start)
- [`grid-column-end`](https://developer.mozilla.org/docs/Web/CSS/grid-column-end)
- [`grid-row-start`](https://developer.mozilla.org/docs/Web/CSS/grid-row-start)
- [`grid-row-end`](https://developer.mozilla.org/docs/Web/CSS/grid-row-end)

Tienen notaciones abreviadas que le permiten establecer líneas de inicio y final a la vez:

- [`grid-column`](https://developer.mozilla.org/docs/Web/CSS/grid-column)
- [`grid-row`](https://developer.mozilla.org/docs/Web/CSS/grid-row)

Para colocar su elemento, establezca las líneas de inicio y final del área de la cuadrícula en la que debe colocarse.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 200px 100px);
}

.item {
    grid-column-start: 1; /* start at column line 1 */
    grid-column-end: 4; /* end at column line 4 */
    grid-row-start: 2; /*start at row line 2 */
    grid-row-end: 4; /* end at row line 4 */
}
```

Chrome DevTools puede darle una guía visual de las líneas para verificar dónde está colocado su elemento.

La numeración de líneas sigue el modo de escritura y la dirección del componente. En la siguiente demostración, cambie el modo o la dirección de escritura para ver cómo la ubicación de los elementos se mantiene coherente con la forma en que fluye el texto.

{% Codepen { user: 'web-dot-dev', id: 'QWdGdzd', height: 600 } %}

### Apilar elementos

Con el posicionamiento basado en líneas, puede colocar elementos en la misma celda de la cuadrícula. Esto significa que puede apilar elementos o hacer que un elemento se superponga parcialmente con otro. Los elementos que vienen más adelante en la fuente se mostrarán encima de los elementos que vienen antes. Puede cambiar este orden de apilamiento utilizando `z-index` igual que con los elementos posicionados.

{% Codepen { user: 'web-dot-dev', id: 'BapQWQW', height: 600 } %}

### Números de línea negativos

Cuando crea una cuadrícula utilizando `grid-template-rows` y `grid-template-columns`, está creando lo que se conoce como la **cuadrícula explícita**. Esta es una cuadrícula que usted definió y que otorgó un tamaño dado a las bandas.

A veces, tendrá elementos que se muestran fuera de esta cuadrícula explícita. Por ejemplo, puede definir bandas de columna y luego agregar varias filas de elementos de cuadrícula sin definir bandas de fila. Las bandas tendrían un tamaño automático de forma predeterminada. También puede colocar un elemento utilizando `grid-column-end` que esté fuera de la cuadrícula explícita definida. En ambos casos, Grid creará bandas para que la distribución funcione, y a éstas nos referimos como la **cuadrícula implícita**.

La mayoría de las veces, no habrá diferencia si está trabajando con una cuadrícula implícita o explícita. Sin embargo, con la ubicación basada en líneas, es posible que se encuentre con la principal diferencia entre los dos.

Usando números de línea negativos, puede colocar elementos desde la línea final de la cuadrícula explícita. Esto puede resultar útil si desea que un elemento abarque desde la primera hasta la última línea de la columna. En ese caso, puede usar `grid-column: 1 / -1`. El elemento se extenderá a lo largo de la cuadrícula explícita.

Sin embargo, esto solo funciona para la cuadrícula explícita. Tome un diseño de tres filas de elementos colocados automáticamente donde le gustaría que el primer elemento se extendiera hasta la línea final de la cuadrícula.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Dt8yG376MqSyWJJ8KqPr.svg", alt="Una barra lateral con 8 elementos de cuadrícula hermanos", width="800", height="359" %}

Podría pensar que puede darle `grid-row: 1 / -1` a ese elemento. En la demostración a continuación, puede ver que esto no funciona. Las bandas se crean en la cuadrícula implícita, no hay forma de llegar al final de la cuadrícula usando `-1`.

{% Codepen { user: 'web-dot-dev', id: 'YzNpZeq' } %}

#### Dimensionamiento de bandas implícitas

Las bandas creadas en la cuadrícula implícita se ajustarán automáticamente de forma predeterminada. Sin embargo, si desea controlar el tamaño de las filas, use la propiedad [`grid-auto-rows`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows) y, para las columnas, [`grid-auto-columns`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns).

Para crear todas las filas implícitas con un tamaño mínimo de `10em` y un tamaño máximo de `auto`:

```css
.container {
    display: grid;
    grid-auto-rows: minmax(10em, auto);
}
```

Crear columnas implícitas con un patrón de bandas de 100 px y 200 px de ancho. En este caso, la primera columna implícita será de 100 px, la segunda de 200 px, la tercera de 100 px, y así sucesivamente.

```css
.container {
    display: grid;
    grid-auto-columns: 100px 200px;
}
```

## Líneas de cuadrícula con nombre

Puede facilitar la colocación de elementos en un diseño si las líneas tienen un nombre en lugar de un número. Puede nombrar cualquier línea en su cuadrícula agregando un nombre de su elección entre corchetes. Se pueden agregar varios nombres, separados por un espacio dentro de los mismos corchetes. Una vez que haya nombrado las líneas, se pueden usar en lugar de los números.

```css
.container {
    display: grid;
    grid-template-columns:
      [main-start aside-start] 1fr
      [aside-end content-start] 2fr
      [content-end main-end]; /* a two column layout */
}

.sidebar {
    grid-column: aside-start / aside-end;
    /* placed between line 1 and 2*/
}

footer {
    grid-column: main-start / main-end;
    /* right across the layout from line 1 to line 3*/
}
```

## Áreas de plantilla de cuadrícula

También puede nombrar áreas de la cuadrícula y colocar elementos en esas áreas nombradas. Esta es una técnica encantadora, ya que le permite ver cómo se ve su componente allí mismo en el CSS.

Para empezar, asigne un nombre a los hijos directos de su contenedor de cuadrícula utilizando la propiedad [`grid-area`](https://developer.mozilla.org/docs/Web/CSS/grid-area):

```css
header {
    grid-area: header;
}

.sidebar {
    grid-area: sidebar;
}

.content {
    grid-area: content;
}

footer {
    grid-area: footer;
}
```

El nombre puede ser cualquier cosa que desee, excluyendo las palabras clave `auto` y `span`. Una vez que todos sus elementos tengan nombre, use la propiedad [`grid-template-areas`](https://developer.mozilla.org/docs/Web/CSS/grid-template-areas) para definir qué celdas de la cuadrícula abarcará cada elemento. Cada fila se define entre comillas.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "header header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

Hay algunas reglas al usar `grid-template-areas`.

- El valor debe ser una cuadrícula completa sin celdas vacías.
- Para abarcar más de una banda, repita el nombre.
- Las áreas creadas al repetir el nombre deben ser rectangulares y no pueden estar desconectadas.

Si infringe alguna de las reglas anteriores, el valor se considera no válido y se desecha.

Para dejar espacios en blanco en la cuadrícula, use uno o varios `.` sin espacios en blanco entre ellos. Por ejemplo, para dejar vacía la primera celda de la cuadrícula, podría agregar una serie de caracteres `.`:

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "....... header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

Como su distribución completa está definida en un solo lugar, es sencillo redefinirla mediante consultas de medios. En el siguiente ejemplo, he creado una distribución de dos columnas que se mueve a tres columnas redefiniendo el valor de `grid-template-columns` y `grid-template-areas`. Abra el ejemplo en una nueva ventana para jugar con el tamaño de la ventana y ver el cambio de distribución.

También puede ver cómo la propiedad `grid-template-areas` se relaciona con `writing-mode` y la dirección, al igual que con otros métodos de la cuadrícula.

{% Codepen { user: 'web-dot-dev', id: 'oNBYepg', height: 600 } %}

## Propiedades de notación abreviada

Hay dos propiedades en notación abreviada que le permiten establecer muchas de las propiedades de la cuadrícula en un solo paso. Estas pueden parecer un poco confusas hasta que analice exactamente cómo van juntas. Si desea usarlas o prefiere usar notaciones extendidas, depende de usted.

### `grid-template`

La propiedad [`grid-template`](https://developer.mozilla.org/docs/Web/CSS/grid-template) es una notación abreviada de `grid-template-rows`, `grid-template-columns` y `grid-template-areas`. Las filas se definen primero, junto con el valor de `grid-template-areas`. El tamaño de columnas se agrega después de una `/`.

```css
.container {
    display: grid;
    grid-template:
      "head head head" minmax(150px, auto)
      "sidebar content content" auto
      "sidebar footer footer" auto / 1fr 1fr 1fr;
}
```

### propiedad `grid`

La notación abreviada [`grid`](https://developer.mozilla.org/docs/Web/CSS/grid) se puede utilizar exactamente de la misma forma que la de `grid-template`. Cuando se usa así, restablecerá las otras propiedades de la cuadrícula que acepta a sus valores iniciales. La lista completa es:

- `grid-template-rows`
- `grid-template-columns`
- `grid-template-areas`
- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

Alternativamente, puede usar esta notación abreviada para definir cómo se comporta la cuadrícula implícita, por ejemplo:

```css
.container {
    display: grid;
    grid: repeat(2, 80px) / auto-flow  120px;
}
```

## Alineación

La distribución de cuadrícula utiliza las mismas propiedades de alineación que aprendió en la guía de [flexbox](/learn/css/flexbox). En la cuadrícula, las propiedades que comienzan con `justify-` siempre se usan en el eje en línea, la dirección en la que fluyen las oraciones en su modo de escritura.

Las propiedades que comienzan con `align-` se utilizan en el eje de bloque, la dirección en la que se colocan los bloques en su modo de escritura.

- [`justify-content`](https://developer.mozilla.org/docs/Web/CSS/justify-content) y [`align-content`](https://developer.mozilla.org/docs/Web/CSS/align-content): distribuyen el espacio adicional en el contenedor de cuadrícula alrededor o entre bandas.
- [`justify-self`](https://developer.mozilla.org/docs/Web/CSS/justify-self) y [`align-self`](https://developer.mozilla.org/docs/Web/CSS/align-self): se aplican a un elemento de la cuadrícula para moverlo dentro del área de la cuadrícula en la que está colocado.
- [`justify-items`](https://developer.mozilla.org/docs/Web/CSS/justify-items) y [`align-items`](https://developer.mozilla.org/docs/Web/CSS/align-items): se aplican al contenedor de la cuadrícula para configurar todas las propiedades `justify-self` en los elementos.

### Distribuir espacio extra

En esta demostración, la cuadrícula es más grande que el espacio necesario para colocar las bandas de ancho fijo. Esto significa que tenemos espacio en las dimensiones en línea y en bloque de la cuadrícula. Pruebe diferentes valores de `align-content` y `justify-content` para ver cómo se comportan las bandas.

{% Codepen { user: 'web-dot-dev', id: 'rNjjMVd', height: 650 } %}

Observe cómo los espacios se vuelven más grandes cuando se utilizan valores como el `space-between`, y cualquier elemento de la cuadrícula que abarque dos bandas también crece para absorber el espacio adicional agregado a la brecha.

{% Aside %} Al igual que con flexbox, estas propiedades solo funcionarán si hay espacio adicional que distribuir. Si su cuadrícula llena perfectamente el contenedor, no habrá espacio que compartir. {% endAside %}

### Mover contenido

Los elementos con un color de fondo parecen llenar completamente el área de la cuadrícula en la que están colocados, porque el valor inicial para `justify-self` y `align-self` es `stretch`.

{% Aside %} Si su elemento es una imagen o algo más con una relación de aspecto intrínseca, el valor inicial será de `start` en lugar de `stretch` para evitar deformarlo. {% endAside %}

En la demostración, cambie los valores de `justify-items` y `align-items` para ver cómo esto cambia la distribución. El área de la cuadrícula no cambia de tamaño, sino que los elementos se mueven dentro del área definida.

{% Codepen { user: 'web-dot-dev', id: 'YzZOOXB', height: 650 } %}

{% Assessment 'grid' %}

## Recursos

Esta guía le ha dado una descripción general de las diferentes partes de la especificación de la distribución de cuadrícula. Para saber más, consulte los siguientes recursos.

- [Diseño de cuadrícula CSS de MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)
- [Una guía completa de Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Crear un contenedor de cuadrícula](https://www.smashingmagazine.com/2020/01/understanding-css-grid-container/)
- [Una colección completa de material didáctico de cuadrícula](https://gridbyexample.com/)
