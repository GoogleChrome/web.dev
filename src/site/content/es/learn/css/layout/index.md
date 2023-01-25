---
title: Diseño
description: Una descripción general de los distintos métodos de diseño entre los que puede elegir al crear un componente o diseño de página.
audio:
  title: 'El Podcast de CSS   - 009: Diseño'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_009_v1.1.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-20
tags:
  - css
---

Imagine que está trabajando como desarrollador y un colega diseñador le entrega el diseño para un nuevo sitio web. El diseño tiene todo tipo de distribución de elementos y composiciones interesantes: diseños bidimensionales que tienen en cuenta el ancho y la altura de la ventana gráfica, así como diseños que deben ser fluidos y flexibles. ¿Cómo decides la mejor manera de llevarlos a cabo con CSS?

El CSS nos proporciona varias formas de resolver problemas de diseño en un eje vertical, horizontal o incluso ambos. Elegir el método de diseño adecuado para un contexto puede ser difícil y, a menudo, es posible que necesite más de un método de diseño para resolver su problema. Para ayudar con esto, en los siguientes módulos, aprenderá sobre las características únicas de cada mecanismo de diseño CSS para informar esas decisiones.

## Diseño: una breve historia

En los primeros días de la web, los diseños más complejos que un simple documento se presentaban con elementos `<table>`. La separación de HTML de los estilos visuales se hizo más fácil cuando los navegadores adoptaron CSS ampliamente a finales de los noventa. El CSS abrió la puerta a que los desarrolladores pudieran cambiar completamente la apariencia de un sitio web sin tener que tocar el HTML. Esta nueva capacidad inspiró proyectos como [The CSS Zen Garden](http://www.csszengarden.com), creado para demostrar el poder del CSS y alentar a más desarrolladores a aprenderlo. El CSS ha evolucionado a medida que evolucionan nuestras necesidades de diseño web y tecnología de navegador. Puede leer cómo el diseño CSS y nuestro enfoque de diseño han evolucionado con el tiempo en [este artículo de Rachel Andrew](https://24ways.org/2019/a-history-of-css-through-15-years-of-24-ways/). {% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/vDDoFFoPVgJEuEaqcP4H.svg", alt="Cronología que muestra cómo ha evolucionado el CSS desde 1996 hasta 2021", width="760", height="270" %}

## Diseño: el presente y el futuro

El CSS moderno tiene herramientas de diseño excepcionalmente poderosas. Tenemos sistemas dedicados para el diseño y vamos a tener una visión de alto nivel sobre lo que tenemos a nuestra disposición, antes de profundizar en más detalles de Flexbox y Grid en los próximos módulos.

## Comprender la propiedad `display`

La propiedad `display` hace dos cosas. Lo primero es determinar si la caja a la que se aplica actúa como en línea o en bloque.

```css
.my-element {
  display: inline;
}
```

Los elementos en línea se comportan como palabras en una oración. Se sientan uno al lado del otro en la dirección en línea. Los elementos como `<span>` y `<strong>`, que se utilizan normalmente para dar estilo a fragmentos de texto dentro de elementos que contienen elementos como un `<p>` (párrafo), van en línea de forma predeterminada. También conservan los espacios en blanco circundantes. {% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/GezxDZXkJgkMevkKg39M.png", alt="Un diagrama que muestra todos los diferentes tamaños de una caja, así como el inicio y el fin de cada sección de tamaño", width="800", height="559" %}  No puede establecer un ancho y un alto explícito en elementos en línea. Los elementos circundantes ignorarán cualquier margen y espacio de relleno a nivel de bloque.

```css
.my-element {
	display: block;
}
```

Los elementos de bloque no se sientan uno al lado del otro. Crean una nueva línea para ellos mismos. Un elemento de bloque se expandirá al tamaño de la dimensión en línea (a menos que sea cambiado por otro código CSS), por lo tanto, abarcará todo el ancho en un modo de escritura horizontal. Se respetará el margen en todos los lados de un elemento de bloque.

```css
.my-element {
	display: flex;
}
```

La propiedad `display` también determina el comportamiento de los hijos de un elemento. Por ejemplo, establecer la propiedad `display` a `display: flex` hace de la caja una caja a nivel de bloque, y también convierte a sus hijos en elementos flexibles. Esto habilita las propiedades flexibles que controlan la alineación, el orden y el flujo.

## Flexbox y Grid

Hay dos mecanismos de diseño principales que crean reglas de diseño para múltiples elementos, *[flexbox](/learn/css/flexbox)* y *[grid](/learn/css/grid)*. Comparten similitudes, pero están dirigidos a resolver diferentes problemas de diseño. {% Aside %} Entraremos en más detalles de ambos en módulos futuros, pero aquí hay una descripción general de alto nivel de qué son y para qué son útiles. {% endAside %}

### Flexbox

```css
.my-element {
	display: flex;
}
```

Flexbox es un mecanismo de diseño para diseños unidimensionales, es decir, disposición en un solo eje, ya sea horizontal o vertical. De forma predeterminada, flexbox alineará los elementos hijos del elemento uno al lado del otro, en la dirección en línea, y los estirará en la dirección del bloque para que todos tengan la misma altura. {% Codepen { user: 'web-dot-dev', id: 'rNjxmor', tab: 'css,result', height: 300 } %} Los elementos permanecerán en el mismo eje y no se ajustarán cuando se queden sin espacio. En lugar de ello, intentarán encajarse en la misma línea que el otro. Este comportamiento se puede cambiar usando las propiedades `align-items`, `justify-content` y `flex-wrap`. {% Codepen { user: 'web-dot-dev', id: 'jOyWLmg' } %} Flexbox también convierte los elementos hijos en **elementos flexibles**, lo que significa que puede escribir reglas sobre cómo se comportan dentro de un contenedor flexible. Puede cambiar la alineación, el orden y la justificación de un objeto individual. También puede cambiar la forma en que se encoge o crece utilizando la propiedad `flex`.

```css
.my-element div {
 	flex: 1 0 auto;
}
```

La propiedad `flex` es una abreviatura de `flex-grow`, `flex-shrink` y `flex-basis`. El ejemplo anterior se puede desglosar de la siguiente manera:

```css
.my-element div {
 flex-grow: 1;
 flex-shrink: 0;
 flex-basis: auto;
}
```

Los desarrolladores proporcionan estas reglas de bajo nivel para indicarle al navegador cómo debe comportarse el diseño cuando se ve desafiado por el contenido y las dimensiones de la ventana gráfica. Esto lo convierte en un mecanismo muy útil para el diseño web receptivo.

### Grid

```css
.my-element {
	display: grid;
}
```

Grid es similar en muchos aspectos a **flexbox**, pero está diseñado para controlar diseños de varios ejes en lugar de diseños de un solo eje (espacio vertical u horizontal). Grid le permite escribir reglas de diseño en un elemento que tiene `display: grid` e introduce algunas primitivas nuevas para el estilo de diseño, como las funciones `repeat()` y `minmax()`. La unidad `fr` (una fracción del espacio restante) es una unidad de cuadrícula útil. Puede construir cuadrículas tradicionales de 12 columnas, con un espacio entre cada objeto, con 3 propiedades CSS:

```css
.my-element {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

{% Codepen { user: 'web-dot-dev', id: 'rNjxGVz' } %} El ejemplo anterior muestra un diseño de un solo eje. Mientras que flexbox trata principalmente a los elementos como un grupo, grid le brinda un control preciso sobre su ubicación en dos dimensiones. Podríamos definir que el primer elemento de esta cuadrícula ocupa 2 filas y 3 columnas:

```css
.my-element :first-child {
  grid-row: 1/3;
  grid-column: 1/4;
}
```

Las propiedades `grid-row` y `grid-column` indican al primer elemento de la cuadrícula que se extienda desde la primera columna hasta el inicio de la cuarta columna, luego se extienda desde la primera fila hasta la tercera fila. {% Codepen { user: 'web-dot-dev', id: 'YzNwrwB', height: 650 } %}

## Disposición de flujo

Si no usa grid o flexbox, sus elementos se muestran en flujo normal. Hay varios métodos de diseño que puede utilizar para ajustar el comportamiento y la posición de los elementos cuando están en flujo normal.

### Bloque en línea

¿Recuerda cómo los elementos circundantes no respetan el margen de bloque y el relleno en un elemento en línea? Con `inline-block` *puede* hacer que esto suceda.

```css
p span {
	display: inline-block;
}
```

El uso de `inline-block` le brinda un cuadro que tiene algunas de las características de un elemento a nivel de bloque, pero que aún fluye en línea con el texto.

```css
p span {
	margin-top: 0.5rem;
}
```

{% Codepen { user: 'web-dot-dev', id: 'PoWZJKw', height: 300, tab: 'css,result' } %}

### Flotadores

Si tiene una imagen que se encuentra dentro de un párrafo de texto, ¿no sería útil que ese texto se situara alrededor de esa imagen como podría ver en un periódico? Puede hacer esto con los flotadores.

```css
img {
	float: left;
	margin-right: 1em;
}
```

La propiedad `float` indica a un elemento que "flote" en el lugar especificado. A la imagen de este ejemplo se le indica que flote a la izquierda, lo que permite que los elementos hermanos se "envuelvan" a su alrededor. Puede indicarle a un elemento que flote a la `left`, `right` o `inherit`. {% Codepen { user: 'web-dot-dev', id: 'VwPaLMg', height: 300 } %} {% Aside 'warning' %} Cuando utilice `float`, tenga en cuenta que cualquier elemento que siga al elemento flotante puede tener su diseño ajustado. Para evitar esto, puede borrar el flotador, ya sea usando `clear: both` en un elemento que sigue a su elemento flotante *o* con `display: flow-root` en el padre de sus elementos flotantes. Obtenga más información en el artículo [El final del truco de clearfix](https://rachelandrew.co.uk/archives/2017/01/24/the-end-of-the-clearfix-hack/). {% endAside %}

### Disposición multicolumna

Si tiene una lista muy larga de elementos, como una lista de todos los países del mundo, puede ser resultar en un desplazamiento y pérdida de tiempo *muy grandes* para un usuario. También puede crear un exceso de espacios en blanco en la página. Con el CSS multicolumna, puede dividir su lista en varias columnas para ayudar con ambos problemas.

```html
<h1>All countries</h1>
<ul class="countries">
  <li>Argentina</li>
  <li>Aland Islands</li>
  <li>Albania</li>
  <li>Algeria</li>
  <li>American Samoa</li>
  <li>Andorra</li>
  …
</ul>
```

```css
.countries {
	column-count: 2;
	column-gap: 1em;
}
```

Esto divide automáticamente esa lista larga en dos columnas y agrega un espacio entre las columnas. {% Codepen { user: 'web-dot-dev', id: 'gOgrpzO' } %}

```css
.countries {
	width: 100%;
	column-width: 260px;
	column-gap: 1em;
}
```

{% Codepen { user: 'web-dot-dev', id: 'jOyqPvB' } %} En lugar de establecer el número de columnas en las que se divide el contenido, puede utilizar `column-width` para definir un ancho mínimo deseado. A medida que haya más espacio disponible en la ventana gráfica, se crearán automáticamente más columnas y, a medida que se reduzca el espacio, las columnas también se reducirán. Esto es muy útil en contextos de diseño web receptivo.

### Posicionamiento

Lo último en esta descripción general de los mecanismos de diseño es el posicionamiento. La propiedad `position` cambia el comportamiento de un elemento dentro del flujo normal del documento y  la manera en que se relaciona con otros elementos. Las opciones disponibles son `relative`, `absolute`, `fixed` y `sticky` con el valor predeterminado de `static`.

```css
.my-element {
  position: relative;
  top: 10px;
}
```

Este elemento se desplaza 10 píxeles hacia abajo en función de su posición actual en el documento, ya que está posicionado con respecto a sí mismo. Agregar `position: relative` a un elemento también lo convierte en el bloque contenedor de cualquier elemento hijo con `position: absolute`. Esto significa que el hijo ahora se reposicionará de acuerdo a este elemento en particular, en lugar de al padre relativo superior, cuando se le aplique una posición absoluta.

```css
.my-element {
  position: relative;
  width: 100px;
  height: 100px;
}

.another-element {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 50px;
	height: 50px;
}
```

Cuando establece `position` en `absolute`, el elemento del flujo de documentos actual se separa. Esto significa dos cosas:

1. Puede usar `top`, `right`, `bottom` y `left` en el padre relativo más cercano de un elemento para colocarlo donde quiera.
2. Todo el contenido que rodea a un elemento absoluto se reajusta para llenar el espacio restante. Un elemento con un valor de `position` `fixed` se comporta de manera similar a `absolute`, siendo su padre el elemento raíz `<html>`. Los elementos de posición fija permanecen anclados desde la parte superior izquierda según los valores `top`, `right`, `bottom` y `left` que establezca. Puede lograr los aspectos anclados y fijos de `fixed` y los aspectos más predecibles que respetan el flujo de documentos de `relative` mediante el uso de `sticky`. Con este valor, a medida que la ventana gráfica se desplaza más allá del elemento, permanece anclada a los valores `top`, `right`, `bottom` y `left` establecidos.  {% Codepen { user: 'web-dot-dev', id: 'NWdNGZB', height: 600 } %}

## En conclusión

Hay muchas opciones y una gran flexibilidad con el diseño CSS. Para sumergirse más en el poder del CSS de [Flexbox](/learn/css/flexbox) y [Grid](/learn/css/grid), continúe con los siguientes módulos. {% Assessment 'layout' %}
