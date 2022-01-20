---
title: Flexbox
description: |-
  Flexbox es un mecanismo de distribución diseñado para distribuir grupos de elementos en una dimensión.
  Aprenda a usarlo en este módulo.
audio:
  title: 'El Podcast de CSS   - 010: Flexbox'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_010_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-21
---

Un patrón de diseño que puede ser complicado en el diseño responsivo es una barra lateral que se alinea con algunos contenidos. Donde hay espacio en la ventana gráfica, este patrón funciona muy bien, pero donde el espacio se condensa, esta distribución rígida puede volverse problemática.

{% Codepen { user: 'web-dot-dev', id: 'poRENWv', height: 420 } %}

El modelo de distribución de caja flexible (flexbox) es un modelo de distribución pensado para contenido unidimensional. Se destaca por tomar varios elementos que tienen diferentes tamaños y devolver la mejor distribución para estos.

Este es el modelo de distribución ideal para este patrón de barra lateral. Flexbox no solo ayuda a colocar la barra lateral y el contenido en línea, sino que, donde no queda suficiente espacio, la barra lateral se dividirá en una nueva línea. En lugar de establecer dimensiones rígidas para que las siga el navegador, con flexbox, puede ofrecer límites flexibles para indicar cómo podría mostrarse el contenido.

{% Codepen { user: 'web-dot-dev', id: 'xxgERMp', height: 400 } %}

## ¿Qué se puede hacer con una distribución flex?

Las distribuciones flex tienen las siguientes características, que podrá explorar en esta guía.

- Pueden mostrarse como una fila o una columna.
- Respetan el modo de escritura del documento.
- Son de una sola línea por default, pero se les puede pedir que se ajusten a varias líneas.
- Los elementos en el diseño se pueden reordenar visualmente, sin considerar su orden en el DOM.
- El espacio se puede distribuir dentro de los elementos, por lo que se vuelven más grandes y más pequeños según el espacio disponible en su padre.
- El espacio se puede distribuir alrededor de los elementos y las líneas flex en una distribución envolvente, utilizando las propiedades Box Alignment.
- Los elementos en sí se pueden alinear en el eje transversal.

## El eje principal y el eje transversal

La clave para comprender flexbox es comprender el concepto de eje principal y eje transversal. El eje principal es el que establece su propiedad `flex-direction`. Si esa es `row`, su eje principal está a lo largo de la fila, si es `column` su eje principal está a lo largo de la columna.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/xKtf0cHRw0xQyiyYuuyz.svg", alt="Tres cuadros uno al lado del otro con una flecha, apuntando de izquierda a derecha. La flecha está etiquetada como Eje principal",width="800", height="320" %}</figure>

Los elementos flex se mueven como un grupo en el eje principal. Recuerde: tenemos un montón de cosas y estamos tratando de obtener el mejor diseño para ellas como grupo.

El eje transversal corre en la otra dirección al eje principal, por lo que si `flex-direction` es `row` el eje transversal corre a lo largo de la columna.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/5wCsZcBmK5L33LS7nOmP.svg", alt="Tres cuadros de diferentes alturas, uno al lado del otro con una flecha, apuntando de izquierda a derecha. La flecha está etiquetada como eje principal. Hay otra flecha apuntando de arriba a abajo. Esta tiene la etiqueta Eje transversal", width="800", height="320" %}</figure>

Puede hacer dos cosas en el eje transversal. Puede mover los elementos individualmente o en grupo para que se alineen entre sí y con el contenedor flex. Además, si ha envuelto líneas flex, puede tratar esas líneas como un grupo para controlar cómo se asigna el espacio a ellas. Verá cómo funciona todo esto en la práctica a lo largo de esta guía, por ahora solo tenga en cuenta que el eje principal sigue su `flex-direction`.

## Creando un contenedor flex

Veamos cómo se comporta flexbox tomando un grupo de elementos de diferentes tamaños y usando flexbox para distribuirlos.

```html
<div class="container" id="container">
  <div>One</div>
  <div>Item two</div>
  <div>The item we will refer to as three</div>
</div>
```

Para usar flexbox, debe declarar que desea usar un contexto de formato flex y no una distribución de bloque y en línea regular. Haga esto cambiando el valor de la propiedad `display` a `flex`.

```css
.container {
  display: flex;
}
```

Como aprendió en la [guía de diseño,](/learn/css/layout) esto le dará una caja a nivel de bloque, con elementos secundarios flex. Los elementos flex comienzan inmediatamente a mostrar algún comportamiento de flexbox, utilizando sus **valores iniciales**.

{% Aside %} Todas las propiedades CSS tienen valores iniciales que controlan cómo se comportan inicialment cuando no ha aplicado ningún CSS para cambiar ese comportamiento inicial. Los hijos de nuestro contenedor flex se convierten en elementos flex tan pronto como su padre recibe `display: flex`, por lo que estos valores iniciales quieren decir que comenzamos a ver algún comportamiento tipo flexbox. {% endAside %}

Los valores iniciales significan que:

- Los elementos se muestran como una fila.
- No envuelven.
- No crecen para llenar el contenedor.
- Se alinean al comienzo del contenedor.

## Controlar la dirección de los elementos

Aunque todavía no ha agregado una propiedad `flex-direction`, los elementos se muestran como una fila porque el valor inicial de `flex-direction` es `row`. Si desea una fila, no es necesario que agregue la propiedad. Para cambiar la dirección, agregue la propiedad y uno de los cuatro valores:

- `row` : los elementos se distribuyen como una fila.
- `row-reverse:` los elementos se colocan como una fila desde el final del contenedor flex.
- `column` : los elementos se distribuyen como una columna.
- `column-reverse` : los elementos se distribuyen como una columna desde el final del contenedor flex.

Puede probar todos los valores utilizando nuestro grupo de elementos en la demostración a continuación.

{% Codepen { user: 'web-dot-dev', id: 'bGgKNXq' } %}

### Invertir el flujo de elementos y la accesibilidad

Debe tener cuidado al usar cualquier propiedad que reordene la presentación visual de forma diferente a cómo se ordenan las cosas en el documento HTML, ya que puede afectar negativamente la accesibilidad. Los valores `row-reverse` y `column-reverse` son un buen ejemplo. El reordenamiento solo ocurre para el orden visual, no para el orden lógico. Es importante entender esto, ya que el orden lógico es en el que un lector de pantalla leerá el contenido y cualquiera que navegue usando el teclado lo seguirá.

Puede ver en el siguiente video cómo, en una distribución de columna invertida, la navegación por tab entre enlaces se vuelve desconectada ya que la navegación del teclado sigue al DOM, no a la representación visual.

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/IgpaIRZd7kOq8sd46eaR.mp4", autoplay=true, controls=true %}

Cualquier cosa que pueda cambiar el orden de los elementos en flexbox o cuadrícula puede causar este problema. Por lo tanto, cualquier reordenamiento debe incluir pruebas exhaustivas para comprobar que no hará que su sitio sea difícil de usar para algunas personas.

Para más información, ver:

- [Reordenamiento de contenido](/content-reordering/)
- [Flexbox y la navegación desconectada por teclado](https://tink.uk/flexbox-the-keyboard-navigation-disconnect/)

### Modos de escritura y dirección

Los elementos flex se presentan como una fila de forma predeterminada. Una fila fluye en la dirección de las oraciones en su modo de escritura y en la dirección del script. Esto significa que si está trabajando en árabe, que tiene una dirección de escritura de derecha a izquierda (rtl), los elementos se alinearán a la derecha. El orden de tabulación también comenzaría a la derecha, ya que esta es la forma en que se leen las oraciones en árabe.

{% Codepen { user: 'web-dot-dev', id: 'ExZgwWN' } %}

Si está trabajando con un modo de escritura vertical, como algunos tipos de letra japoneses, entonces la fila fluirá verticalmente, de arriba a abajo. Intente cambiar la `flex-direction` en esta demostración que utiliza un modo de escritura vertical.

{% Codepen { user: 'web-dot-dev', id: 'qBRaPXX', height: 600 } %}

Por lo tanto, la forma en que se comportan los elementos flex de forma predeterminada está vinculada al modo de escritura del documento. La mayoría de los tutoriales están escritos en inglés u otro modo de escritura horizontal de izquierda a derecha. Esto podría malinterpretarse en que los elementos flex se alinean a la **izquierda** y fluyen **horizontalmente**.

Teniendo que considerar los ejes principal y transversal más el modo de escritura, podría ser más fácil de entender si hablamos de **inicio** y **final** en lugar de arriba, abajo, izquierda y derecha en flexbox. Cada eje tiene un inicio y un final. El inicio del eje principal se conoce como **inicio principal**. Entonces, nuestros elementos flex se alinean inicialmente desde el inicio principal. El final de ese eje es el **final principal**. El inicio del eje transversal es **inicio transversal** y el final es **final transversal**.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/uSH4TxRv8KNQDTK7Vn8h.svg", alt="Un diagrama etiquetado de los términos anteriores", width="800", height="382" %}

## Elementos flex envolventes

El valor inicial de la propiedad `flex-wrap` es `nowrap`. Esto significa que si no hay suficiente espacio en el contenedor, los elementos se desbordarán.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/VTUdLS9PeBziBvbOSc4q.jpg", alt="Un contenedor flex con nueve elementos dentro, los elementos se han reducido, por lo que una palabra está en una línea, pero no hay suficiente espacio para mostrarlos uno al lado del otro, por lo que los elementos flex se han extendido fuera de la caja del contenedor. ", width="800", height="282" %}<figcaption> Una vez que alcancen el tamaño mínimo del contenido, los elementos flex comenzarán a desbordar su contenedor</figcaption></figure>

Los elementos que se muestran usando los valores iniciales se encogerán lo más pequeño posible, hasta el tamaño `min-content`, antes de que ocurra el desbordamiento.

Para hacer que los artículos sean envolventes, agregue `flex-wrap: wrap` al contenedor flex.

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

{% Codepen { user: 'web-dot-dev', id: 'WNRGdNZ', height: 601 } %}

Cuando un contenedor flex envuelve, crea múltiples **líneas flex**. En términos de distribución del espacio, cada línea actúa como un nuevo contenedor flex. Por lo tanto, si está ajustando filas, no es posible hacer que algo en la fila 2 se alinee con algo arriba en la fila 1. Esto es lo que significa que flexbox es unidimensional. Puede controlar la alineación en un eje, una fila o una columna, no ambos juntos como podemos hacer en la cuadrícula.

### La notación abreviada flex-flow

Puede establecer las `flex-direction` y `flex-wrap` utilizando la notación abreviada `flex-flow`. Por ejemplo, para establecer `flex-direction` en la `column` y permitir que los elementos envuelvan:

```css
.container {
  display: flex;
  flex-flow: column wrap;
}
```

## Controlar el espacio dentro de los elementos flex

Suponiendo que nuestro contenedor tiene más espacio del necesario para mostrar los elementos, los elementos se alinean al principio y no crecen para llenar el espacio. Dejan de crecer a su tamaño max-content. Esto se debe a que el valor inicial de las propiedades `flex-` es:

- `flex-grow: 0` : los elementos no crecen.
- `flex-shrink: 1` : los elementos pueden encogerse más pequeños que su `flex-basis`.
- `flex-basis: auto` : los elementos tienen un tamaño base de `auto`.

Esto se puede representar mediante un valor de palabra clave de `flex: initial`. La notación abreviada `flex`, o las notaciones extendidas de `flex-grow`, `flex-shrink` y `flex-basis` se aplican a los elementos secundarios del contenedor flex.

{% Codepen { user: 'web-dot-dev', id: 'LYxRebE' } %}

Para hacer que los elementos crezcan, mientras permite que los elementos grandes tengan más espacio que los pequeños, use `flex:auto`. Puede probarlo usando la demostración anterior. Esta establece las propiedades como:

- `flex-grow: 1` : los elementos pueden crecer más que su `flex-basis`.
- `flex-shrink: 1` : los elementos pueden encogerse más pequeños que su `flex-basis`.
- `flex-basis: auto` : los elementos tienen un tamaño base de `auto`.

El uso de `flex: auto` hará que los elementos terminen en tamaños diferentes, ya que el espacio que se comparte entre los elementos se comparte *después* de que cada elemento se presenta como tamaño max-content. Entonces, un elemento grande ganará más espacio. Para forzar que todos los elementos tengan un tamaño constante e ignorar el tamaño del contenido, cambie `flex:auto` a `flex: 1` en la demostración.

Esto a su vez quiere decir que:

- `flex-grow: 1` : los elementos pueden crecer más que su `flex-basis`.
- `flex-shrink: 1` : los elementos pueden encogerse más pequeños que su `flex-basis`.
- `flex-basis: 0` : los elementos tienen un tamaño base de `0`.

El uso de `flex: 1` dice que todos los elementos tienen un tamaño cero, por lo tanto, todo el espacio en el contenedor flex está disponible para distribuirse. Como todos los elementos tienen un factor `flex-grow` de `1`, todos crecen por igual y el espacio se comparte por igual.

{% Aside %} También hay un valor de `flex: none`, que le proporcionará elementos flex inflexibles que no crecen ni se encogen. Esto puede resultar útil si está utilizando únicamente flexbox para acceder a las propiedades de alineación, pero no desea ningún comportamiento flexible. {% endAside %}

### Permitir que los artículos crezcan a diferentes ritmos

No es necesario asignar a todos los artículos un factor `flex-grow` de `1`. Puede asignar a sus elementos flex diferentes factores `flex-grow`. En la siguiente demostración, el primer elemento tiene `flex: 1`, el segundo `flex: 2` y el tercero `flex: 3`. A medida que estos elementos crecen desde `0` el espacio disponible en el contenedor flex se comparte en seis. Se asigna una parte al primer artículo, dos partes al segundo, tres partes al tercero.

{% Codepen { user: 'web-dot-dev', id: 'OJWRzEz' } %}

Puede hacer lo mismo desde una `flex-basis` de `auto`, aunque deberá especificar los tres valores. El primer valor es `flex-grow`, el segundo `flex-shrink` y el tercero `flex-basis`.

```css
.item1 {
  flex: 1 1 auto;
}

.item2 {
  flex: 2 1 auto;
}
```

Este es un caso de uso menos común ya que la razón para usar una `flex-basis` de `auto` es permitir que el navegador descubra la distribución del espacio. Sin embargo, podría ser útil si desea hacer que un elemento crezca un poco más de lo que decide el algoritmo.

## Reordenar artículos flex

Los elementos en su contenedor flex se pueden reordenar usando la propiedad `order`. Esta propiedad permite ordenar los elementos en **grupos ordinales**. Los elementos se distribuyen en la dirección dictada por la dirección de `flex-direction`, los valores más bajos primero. Si más de un elemento tiene el mismo valor, se mostrará con los otros elementos con ese valor.

El siguiente ejemplo demuestra este orden.

{% Codepen { user: 'web-dot-dev', id: 'NWdRXoL' } %}

{% Aside 'warning' %} Usar `order` tiene los mismos problemas que los valores de `column-reverse` `row-reverse` y de `flex-direction`. Sería muy fácil crear una experiencia desconectada para algunos usuarios. No use `order` para está arreglar cosas que están fuera de orden en el documento. Si los elementos lógicamente deberían estar en un orden diferente, ¡cambie su HTML! {% endAside %}

{% Assessment 'flex' %}

## Descripción general de la alineación de Flexbox

Flexbox trajo consigo un conjunto de propiedades para alinear elementos y distribuir el espacio entre ellos. Estas propiedades fueron tan útiles que desde entonces se han movido a su propia especificación, también las encontrará en Grid Layout. Aquí puede averiguar cómo funcionan al usae flexbox.

El conjunto de propiedades se puede dividir en dos grupos. Propiedades de distribución del espacio y propiedades de alineación. Las propiedades que distribuyen el espacio son:

- `justify-content` : distribución del espacio en el eje principal.
- `align-content` : distribución del espacio en el eje transversal.
- `place-content` : una forma abreviada de configurar las dos propiedades anteriores.

Las propiedades utilizadas para la alineación en flexbox son:

- `align-self` : alinea un solo elemento en el eje transversal
- `align-items` : alinea todos los elementos como un grupo en el eje transversal

Si está trabajando en el eje principal, las propiedades comienzan con `justify-`. En el eje transversal comienzan con `align-`.

## Distribuir espacio en el eje principal

Con el HTML utilizado anteriormente, los elementos flex dispuestos como una fila, hay espacio en el eje principal. Los artículos no son lo suficientemente grandes para llenar completamente el contenedor flex. Los elementos se alinean al comienzo del contenedor flex porque el valor inicial de `justify-content` es `flex-start`. Los elementos se alinean al principio y cualquier espacio adicional al final.

Agregue la `justify-content` al contenedor flex, asígnele un valor de `flex-end`, y los elementos se alinean al final del contenedor y el espacio libre se coloca al principio.

```css
.container {
  display: flex;
  justify-content: flex-end;
}
```

También puede distribuir el espacio entre los elementos con `justify-content: space-between`.

Pruebe algunos de los valores de la demostración y [consulte MDN](https://developer.mozilla.org/docs/Web/CSS/justify-content) para conocer el conjunto completo de valores posibles.

{% Codepen { user: 'web-dot-dev', id: 'JjERpGb' } %}

{% Aside %} Para que la propiedad `justify-content` haga cualquier cosa, debe tener espacio libre en su contenedor en el eje principal. Si sus artículos llenan el eje, entonces no hay espacio para compartir, por lo que la propiedad no hará nada. {% endAside %}

### Con `flex-direction: column`

Si ha cambiado su `flex-direction` a `column` entonces `justify-content` funcionará en la columna. Para tener espacio libre en su contenedor cuando trabaje como una columna, debe darle a su contenedor una `height` o `block-size`. De lo contrario, no tendrá espacio libre que distribuir.

Pruebe los diferentes valores, esta vez con una distribución de columna de flexbox.

{% Codepen { user: 'web-dot-dev', id: 'bGgwLgz', height: 600 } %}

## Distribuir espacio entre líneas flex

Con un contenedor flex envuelto, es posible que tenga espacio para distribuir en el eje transversal. En este caso, puede utilizar la `align-content` con los mismos valores que `justify-content`. A diferencia de `justify-content` que alinea los elementos a `flex-start` por defecto, el valor inicial de `align-content` es `stretch`. Agregue la propiedad `align-content` al contenedor flex para cambiar ese comportamiento predeterminado.

```css
.container {
  align-content: center;
}
```

Pruebe esto en la demostración. El ejemplo tiene líneas envueltas de elementos flex y el contenedor tiene un `block-size` para que tengamos algo de espacio libre.

{% Codepen { user: 'web-dot-dev', id: 'poREawo' } %}

### La notación abreviada de `place-content`

Para configurar tanto `justify-content` como `align-content`, puede usar `place-content` con uno o dos valores. Se utilizará un único valor para ambos ejes, si especifica que el primero se utiliza para `align-content` y el segundo para `justify-content`.

```css
.container {
  place-content: space-between;
  /* sets both to space-between */
}

.container {
  place-content: center flex-end;
  /* wrapped lines on the cross axis are centered,
  on the main axis items are aligned to the end of the flex container */
}
```

## Alinear elementos en el eje transversal

En el eje transversal también puede alinear sus elementos dentro de la línea flex usando `align-items` y `align-self`. El espacio disponible para esta alineación dependerá de la altura del contenedor flex o de la línea flex en el caso de un conjunto envuelto de elementos.

El valor inicial de `align-self` es `stretch`, por lo que los elementos flex en una fila se extienden hasta la altura del elemento más alto de forma predeterminada. Para cambiar esto, agregue la propiedad `align-self` a cualquiera de sus elementos flex.

```css
.container {
  display: flex;
}

.item1 {
  align-self: flex-start;
}
```

Utilice cualquiera de los siguientes valores para alinear el elemento:

- `flex-start`
- `flex-end`
- `center`
- `stretch`
- `baseline`

Consulte [la lista completa de valores en MDN](https://developer.mozilla.org/docs/Web/CSS/align-self).

La siguiente demostración tiene una sola línea de elementos `flex-direction: row`. El último elemento define la altura del contenedor flex. El primer elemento tiene la `align-self` con un valor de `flex-start`. Intente cambiar el valor de esa propiedad para ver cómo se mueve dentro de su espacio en el eje transversal.

{% Codepen { user: 'web-dot-dev', id: 'RwKGQee', height: 600 } %}

La propiedad `align-self` se aplica a elementos individuales. La propiedad `align-items` se puede aplicar al contenedor flex para establecer todas las propiedades `align-self` individuales como un grupo.

```css
.container {
  display: flex;
  align-items: flex-start;
}
```

En esta próxima demostración, intente cambiar el valor de `align-items` para alinear todos los elementos en el eje transversal como un grupo.

{% Codepen { user: 'web-dot-dev', id: 'QWdKmby', height: 600 } %}

## ¿Por qué no hay justify-self en flexbox?

Los elementos flex actúan como un grupo en el eje principal. Por tanto, no existe el concepto de separar un elemento individual de ese grupo.

En el diseño de cuadrícula, las propiedades `justify-self` y `justify-items` funcionan en el eje en línea para alinear los elementos en ese eje dentro de su área de cuadrícula. Debido a la forma en que los diseños flex tratan los elementos como un grupo, estas propiedades no se implementan en un contexto flex.

Vale la pena saber que flexbox funciona muy bien con márgenes automáticos. Si necesita separar un elemento de un grupo, o separar el grupo en dos grupos, puede aplicar un margen para ello. En el ejemplo siguiente, el último elemento tiene un margen izquierdo de `auto`. El margen automático absorbe todo el espacio en la dirección en que se aplica. Esto significa que empuja el elemento hacia la derecha, dividiendo así los grupos.

{% Codepen { user: 'web-dot-dev', id: 'poRELbR' } %}

## Cómo centrar un elemento vertical y horizontalmente

Las propiedades de alineación se pueden utilizar para centrar un elemento dentro de otro cuadro. La propiedad `justify-content` alinea el elemento en el eje principal, que es la fila. La propiedad `align-items` en el eje transversal.

```css
.container {
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

{% Aside %} En el futuro, es posible que podamos hacer esta alineación sin necesidad de convertir al padre en un contenedor flex. Las propiedades de alineación se especifican para la distribución de bloques y en línea. En la actualidad, ningún navegador los ha implementado. Sin embargo, cambiar a un contexto de formato flex le da acceso a las propiedades. Si necesita alinear algo, es una excelente manera de hacerlo. {% endAside %}

{% Assessment 'conclusion' %}

## Recursos

- [El diseño de Flexible Box CSS de MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout) incluye una serie de guías detalladas con ejemplos.
- [CSS Tricks: Guía de Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Qué sucede cuando crea un contenedor Flexbox Flex](https://www.smashingmagazine.com/2018/08/flexbox-display-flex-container/)
- [Todo lo que necesita saber sobre la alineación en Flexbox](https://www.smashingmagazine.com/2018/08/flexbox-alignment/)
- [¿Qué tan grande es esa Flexible Box?](https://www.smashingmagazine.com/2018/09/flexbox-sizing-flexible-box/)
- [Casos de uso para Flexbox](https://www.smashingmagazine.com/2018/10/flexbox-use-cases/)
