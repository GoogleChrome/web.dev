---
title: Selectores
description: |-
  Para aplicar CSS a un elemento, debe seleccionarlo. CSS le proporciona varias formas diferentes de hacer esto, que
  puede explorar en este módulo.
audio:
  title: 'El Podcast de CSS   - 002: Selectores'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_002_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

Si tiene un texto que quiere que se agrande y aparezca en rojo cuando se muestre en el primer párrafo de un artículo, ¿cómo lo hace?

```html
<article>
  <p>Quiero ser rojo y más grande que el otro texto.</p>
  <p>Quiero tener el tamaño normal y el color predeterminado.</p>
</article>
```

Debe utilizar un selector de CSS para encontrar ese elemento específico y aplicar una regla de CSS, como esta.

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

CSS le brinda muchas opciones para seleccionar elementos y aplicarles reglas, desde muy simples hasta muy complejas, para ayudarlo a resolver situaciones como esta.

{% Codepen { user: 'web-dot-dev', id: 'XWprGYz', height: 250 } %}

## Las partes de una regla CSS

Para comprender cómo funcionan los selectores y su función en CSS, es importante conocer las partes de una regla CSS. Una regla CSS es un bloque de código que contiene uno o más selectores y una o más declaraciones.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/hFR4OOwyH5zWc5XUIcyu.svg", alt="Una imagen de una regla CSS con el selector .my-css-rule", width="800", height="427" %}</figure>

En esta regla CSS, el **selector** es `.my-css-rule` que encuentra todos los elementos de la clase `my-css-rule` en la página. Hay tres declaraciones entre corchetes. Una declaración es un par de propiedad y valor que aplica estilos a los elementos que coinciden con los selectores. Una regla CSS puede tener tantas declaraciones y selectores como desee.

## Selectores simples

El grupo más sencillo de selectores apunta a elementos HTML más las clases, los ID y otros atributos que se pueden agregar a una etiqueta HTML.

### Selector universal

Un [selector universal,](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) también conocido como comodín, coincide con cualquier elemento.

```css
* {
  color: hotpink;
}
```

Esta regla hace que todos los elementos HTML de la página tengan texto rosado.

### Selector de tipo

Un [selector de tipo](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) coincide directamente con un elemento HTML.

```css
section {
  padding: 2em;
}
```

Esta regla hace que cada elemento `<section>` tenga `2em` de `padding` en todos los lados.

### Selector de clase

Un elemento HTML puede tener uno o más elementos definidos en su atributo `class`. El [selector de clase](https://developer.mozilla.org/docs/Web/CSS/Class_selectors) coincide con cualquier elemento que tenga esa clase aplicada.

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

Cualquier elemento al que se le haya aplicado la clase se coloreará en rojo:

```css
.my-class {
  color: red;
}
```

Observe cómo el `.` solo está presente en CSS y **no** en HTML. Esto se debe a que el carácter `.` le indica al lenguaje CSS que haga coincidir los miembros del atributo de clase. Este es un patrón común en CSS, donde se usa un carácter especial, o un conjunto de caracteres, para definir tipos de selectores.

Un elemento HTML que tenga una clase `.my-class` seguirá coincidiendo con la regla CSS anterior, incluso si tienen varias otras clases, como esta:

```html
<div class="my-class another-class some-other-class"></div>
```

Esto se debe a que CSS busca un atributo `class` que *contenga* la clase definida, en lugar de coincidir exactamente con esa clase.

{% Aside %} El valor de un atributo de clase puede ser casi cualquier cosa que desee. Una cosa que podría hacerlo tropezar es que no puede comenzar una clase (o una identificación) con un número, como `.1element`. Puede leer más [en la especificación](https://www.w3.org/TR/CSS21/syndata.html#characters). {% endAside %}

### Selector de ID

Un elemento HTML con un atributo `id` debe ser el único elemento en una página con ese valor de identificación. Debe seleccionar elementos con un [selector de ID](https://developer.mozilla.org/docs/Web/CSS/ID_selectors) como este:

```css
#rad {
  border: 1px solid blue;
}
```

Este CSS aplicaría un borde azul al elemento HTML que tiene un atributo `id` igual a `rad`, así:

```html
<div id="rad"></div>
```

Similar al selector de clases `.`, use un carácter `#` para indicarle a CSS que busque un elemento que coincida con la `id` que le sigue.

{% Aside %} Si el navegador encuentra más de una instancia de una `id`, aplicará todavía las reglas CSS que coincidan con su selector. Sin embargo, se supone que cualquier elemento que tenga un atributo `id` tiene un valor único para él, por lo que, a menos que esté escribiendo CSS muy específico para un solo elemento, evite aplicar estilos con el selector `id`, ya que significa que no puede reutilizar esos estilos en otros lugares. {% endAside %}

### Selector de atributos

Puede buscar elementos que tengan un determinado atributo HTML, o que tengan un determinado valor para un atributo HTML, si utiliza el [selector de atributos](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors). Puede indicarle a CSS que busque atributos si encierra el selector entre corchetes cuadrados (`[ ]`).

```css
[data-type='primary'] {
  color: red;
}
```

Este CSS busca todos los elementos que tienen un atributo `data-type` con un valor de `primary`, de la siguiente manera:

```html
<div data-type="primary"></div>
```

En lugar de buscar un valor específico de `data-type`, también puede buscar elementos que presenten el atributo, independientemente de su valor.

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

Ambos `<div>` tendrán texto rojo.

Puede utilizar selectores de atributos que distingan entre mayúsculas y minúsculas si añade un operador `s` a su selector de atributos.

```css
[data-type='primary' s] {
  color: red;
}
```

Esto significa que si un elemento HTML tuviera un `data-type` igual a  `Primary`, en lugar de `primary`, no se mostraría en texto rojo. Puede hacer lo opuesto (insensibilidad a mayúsculas y minúsculas) mediante el uso de un operador `i`.

Junto con los operadores de casos, tiene acceso a los operadores que buscan porciones coincidentes de cadenas dentro de los valores de los atributos.

```css
/* Un href que contiene "example.com" */
[href*='example.com'] {
  color: red;
}

/* Un href que comienza con https */
[href^='https'] {
  color: green;
}

/* Un href que termina con .com */
[href$='.com'] {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbOy' } %}<figcaption>En esta demostración, el operador `$` en nuestro selector de atributos obtiene el tipo de archivo del atributo `href`. Esto hace posible ponerle un prefijo a la etiqueta, con base en ese tipo de archivo mediante un pseudoelemento.</figcaption></figure>

### Agrupar selectores

Un selector no tiene que coincidir con un solo elemento. Puede agrupar varios selectores si los separa con comas:

```css
strong,
em,
.my-class,
[lang] {
  color: red;
}
```

Este ejemplo extiende el cambio de color a ambos elementos `<strong>` y también a los elementos `<em>`. También se extiende a una clase llamada `.my-class` y a un elemento que tiene un atributo `lang`.

{% Assessment 'simple-selectors' %}

## Pseudoclases y pseudoelementos

CSS proporciona tipos de selectores útiles que se centran en el estado específico de la plataforma, como cuando se desplaza un elemento, estructuras *dentro* de un elemento o partes de un elemento.

### Pseudoclases

Los elementos HTML se encuentran en varios estados, ya sea porque interactúan con ellos o porque uno de sus elementos secundarios está en un estado determinado.

Por ejemplo, un usuario podría colocar el cursor sobre un elemento HTML con el puntero del ratón *o* el usuario también podría colocar el cursor sobre un elemento secundario. Para esas situaciones, use la pseudoclase `:hover`.

```css
/* El cursor está sobre nuestro enlace */
a:hover {
  outline: 1px dotted green;
}

/* Hace que todos los párrafos pares tengan un fondo diferente */
p:nth-child(even) {
  background: floralwhite;
}
```

Obtenga más información en el [módulo de pseudoclases](/learn/css/pseudo-classes).

### Pseudoelementos

Los pseudoelementos se diferencian de las pseudoclases porque en lugar de responder al estado de la plataforma, actúan como si estuvieran insertando un nuevo elemento con CSS. Los pseudoelementos también son sintácticamente diferentes de las pseudoclases, ya que en vez de usar un solo signo de dos puntos (`:`), utilizamos un signo de dos puntos dobles (`::`).

{% Aside %} Un signo de dos puntos dobles ( `::`) es lo que distingue a un pseudoelemento de una pseudoclase, pero debido a que esta distinción no estaba presente en las versiones anteriores de las especificaciones de CSS, los navegadores admiten dos puntos simples para los pseudoelementos originales, como `:before` y `:after` para ayudar con la compatibilidad con versiones anteriores de los navegadores más antiguos, como IE8. {% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

Al igual que en la demostración anterior, en la que puso el prefijo de la etiqueta de un enlace según el tipo de archivo que correspondía, puede usar el pseudoelemento `::before` para insertar contenido al **comienzo de un elemento**, o el pseudoelemento `::after` para insertar contenido al **final de un elemento**.

Sin embargo, los pseudoelementos no se limitan a insertar contenido. También puede usarlos para apuntar a partes específicas de un elemento. Por ejemplo, suponga que tiene una lista. Utilice `::marker` para diseñar cada viñeta (o número) en la lista.

```css
/* Su lista ahora tendrá puntos rojos o números rojos */
li::marker {
  color: red;
}
```

También puede usar `::selection` para agregarle un estilo al contenido que un usuario ha resaltado.

```css
::selection {
  background: black;
  color: white;
}
```

Obtenga más información en el [módulo sobre pseudoelementos](/learn/css/pseudo-elements).

{% Assessment 'pseudo-selectors' %}

## Selectores complejos

Ya ha visto una amplia gama de selectores, pero a veces, necesitará un *control* más detallado con su CSS. Aquí es donde los selectores complejos intervienen para ayudar.

Vale la pena recordar en este punto que, aunque los siguientes selectores nos dan más poder, solo podemos **descender en cascada** para seleccionar los elementos secundarios. No podemos apuntar ascendentemente y seleccionar un elemento principal. Cubriremos qué es una cascada y cómo funciona [en una lección posterior](/learn/css/the-cascade).

### Combinadores

Un combinador es lo que se encuentra entre dos selectores. Por ejemplo, si el selector era `p > strong`, el combinador es el carácter `>`. Los selectores que utilizan estos combinadores le ayudan a seleccionar elementos según su posición en el documento.

#### Combinador descendiente

Para entender los combinadores descendientes, primero debe entender los elementos principales y secundarios.

```html
<p>Un párrafo de texto con algo de <strong>texto en negrita para enfatizar</strong>.</p>
```

El elemento principal es `<p>` que contiene texto. Dentro de ese elemento `<p>` hay un elemento `<strong>`, lo que hace que su contenido esté en negrita. Debido a que está dentro de `<p>`, es un elemento secundario.

Un combinador descendiente nos permite apuntar a un elemento secundario. Esto usa un espacio (` `) para indicarle al navegador que busque elementos secundarios:

```css
p strong {
  color: blue;
}
```

Este fragmento selecciona todos los elementos `<strong>` que son elementos secundarios de los elementos `<p>` únicamente, para volverlos de color azul de forma recursiva.

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbGN' } %} <figcaption>Debido a que el combinador descendiente es recursivo, se aplica el relleno agregado a cada elemento secundario, lo que da como resultado un efecto escalonado.</figcaption></figure>

Este efecto se visualiza mejor en el ejemplo anterior, mediante el uso del selector de combinador, `.top div`. Esa regla CSS agrega relleno a la izquierda de esos elementos `<div>`. Debido a que el combinador es recursivo, a todos los elementos `<div>` que están en `.top` se les aplicará el mismo relleno.

Échele un vistazo al panel HTML en esta demostración para ver cómo el elemento `.top` tiene varios elementos secundarios `<div>` que, a su vez, tienen elementos secundarios `<div>`.

#### Combinador de hermano siguiente

Puede buscar un elemento que siga inmediatamente a otro elemento si usa un cáracter `+` en su selector.

{% Codepen {user: 'web-dot-dev', id: 'JjEPzwB'} %}

Para agregar espacio entre elementos apilados, use el combinador hermano siguiente para agregar espacio *solo* si un elemento es el **hermano siguiente** de un elemento secundario de `.top`.

Puede agregar margen a todos los elementos secundarios de `.top`, mediante el siguiente selector:

```css
.top * {
  margin-top: 1em;
}
```

El problema con esto es que debido a que está seleccionando todos los elementos secundarios de `.top`, esta regla crea potencialmente un espacio adicional innecesario. El **combinador de hermano siguiente**, combinado con un **selector universal**, le permite no solo controlar qué elementos obtienen un espacio, sino también aplicar un espacio a **cualquier elemento**. Esto le proporciona cierta flexibilidad a largo plazo, independientemente de los elementos HTML que aparezcan en `.top`.

#### Combinador de hermanos subsiguientes

Un combinador subsiguiente es muy similar a un selector de hermano siguiente. Sin embargo, en lugar de un carácter `+`, utilice un carácter `~`. La diferencia es que un elemento solo tiene que seguir a otro elemento con el mismo elemento primario, en lugar de ser el siguiente elemento con el mismo elemento primario.

<figure>{% Codepen { user: 'web-dot-dev', id: 'ZELzPPX', height: 400 } %} <figcaption>Utilice un selector subsiguiente junto con una pseudoclase `:checked` para crear un elemento de interruptor CSS puro.</figcaption></figure>

Este combinador subsiguiente proporciona un poco menos de rigidez, lo que es útil en contextos como el ejemplo anterior, donde cambiamos el color de un interruptor personalizado cuando su casilla de verificación asociada tiene el estado `:checked`.

#### Combinador secundario

Un combinador secundario (también conocido como descendiente directo) le permite más control sobre la recursividad que viene con los selectores de combinador. Al usar el carácter `>`, limita el selector de combinador para que se aplique **solo** a los secundarios directos.

Considere el ejemplo anterior de selector de hermanos siguientes. El espacio se agrega a cada **hermano siguiente**, pero si uno de esos elementos también tiene **elementos del hermano siguiente** como secundarios, puede resultar en un espaciado adicional no deseado.

{% Codepen { user: 'web-dot-dev', id: 'ExZYMJL' } %}

Para aliviar este problema, cambie el **selector de hermanos siguientes** para incorporar un combinador de secundarios: `> * + *`. La regla ahora **solo** se aplicará a los secundarios directos de `.top`.

{% Codepen { user: 'web-dot-dev', id: 'dyNbrEr' } %}

### Selectores compuestos

Puede combinar selectores para aumentar la especificidad y la legibilidad. Por ejemplo, para apuntar a los elementos `<a>`, que también tienen una clase de `.my-class`, escriba lo siguiente:

```css
a.my-class {
  color: red;
}
```

Esto no aplicaría un color rojo a todos los enlaces y también aplicaría el color rojo a `.my-class` **si** estuviera en un elemento `<a>`. Para obtener más información sobre esto, consulte el [módulo de especificidad](/learn/css/specificity).

{% Assessment 'complex-selectors' %}

## Recursos

- [Referencia de selectores CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [Juego interactivo de selectores](https://flukeout.github.io/)
- [Referencia de pseudoclases y pseudoelementos](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [Una herramienta que traduce los selectores de CSS en explicaciones sencillas en inglés](https://kittygiraudel.github.io/selectors-explained/)
