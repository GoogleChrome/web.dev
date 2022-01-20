---
title: Especificidad
description: Este módulo analiza en profundidad la especificidad, una parte clave de la cascada.
audio:
  title: 'El Podcast de CSS - 003: Especificidad'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_003_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-02
---

Suponga que está trabajando con los siguientes HTML y CSS:

```html
<button class="branding">Hello, Specificity!</button>
```

```css
button {
  color: red;
}

.branding {
  color: blue;
}
```

Aquí hay dos reglas que compiten. Una coloreará el botón de rojo y el otro de azul. ¿Qué regla se aplica al elemento? Comprender el algoritmo de la especificación CSS sobre la especificidad es la clave para comprender cómo el CSS decide entre reglas en competencia.

La especificidad es una de las cuatro etapas distintas de la cascada, que se cubrió en el último módulo de [la cascada](/learn/css/the-cascade/).

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'YzNKMXm',
  height: 200
} %}
</figure>

## Puntuación de especificidad

Cada regla de selección obtiene una puntuación. Puede pensar en la especificidad como una puntuación total y cada tipo de selector gana puntos para esa puntuación. El selector con la puntuación más alta gana.

En un proyecto real con especificidad, debe haber un balance entre el asegurarse de que las reglas de CSS que espera aplicar, realmente se *apliquen,* y que, en general, se mantengan las puntuaciones bajas para evitar la complejidad. El puntaje solo debe ser tan alto como sea necesario, en lugar de ser lo más alto posible. En el futuro, puede que sea necesario aplicar algunos CSS más importantes. Si busca el puntaje más alto, hará que ese trabajo sea difícil.

## Puntuación de cada tipo de selector

Cada tipo de selector gana puntos. Agregue todos estos puntos para calcular la especificidad general de un selector.

### Selector universal

Un [selector universal](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) (`*`) **no** tiene especificidad y obtiene **0 puntos**. Esto significa que cualquier regla con 1 o más puntos lo anulará.

```css
* {
  color: red;
}
```

### Selector de elementos o pseudoelementos

Un selector de [elemento](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) (tipo) o [pseudoelemento](https://developer.mozilla.org/docs/Web/CSS/Pseudo-elements) obtiene **1 punto de especificidad**.

#### Selector de tipo

```css
div {
  color: red;
}
```

#### Selector de pseudoelementos

```css
::selection {
  color: red;
}
```

### Selector de clase, pseudoclase o atributo

Un selector de [clase](https://developer.mozilla.org/docs/Web/CSS/Class_selectors), [pseudoclase](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes) o [atributo](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors) obtiene **10 puntos de especificidad**.

#### Selector de clases

```css
.my-class {
  color: red;
}
```

#### Selector de pseudoclase

```css
:hover {
  color: red;
}
```

#### Selector de atributos

```css
[href='#'] {
  color: red;
}
```

La pseudoclase [`:not()`](https://developer.mozilla.org/docs/Web/CSS/:not) en sí misma no agrega nada al cálculo de especificidad. Sin embargo, los selectores que pasan como argumentos se agregan al cálculo de especificidad.

```css
div:not(.my-class) {
  color: red;
}
```

Esta muestra tendría **11 puntos** de especificidad porque tiene un selector de tipo (`div`) y una clase *dentro de* `:not()`.

### Selector de ID

Un selector de [ID](https://developer.mozilla.org/docs/Web/CSS/ID_selectors) obtiene **100 puntos de especificidad**, siempre que use un selector de ID (`#myID`) y no un selector de atributo (`[id="myID"]`).

```css
#myID {
  color: red;
}
```

### Atributo de estilo en línea

El CSS aplicado directamente al atributo `style` del elemento HTML, obtiene una **puntuación de especificidad de 1.000 puntos**. Esto significa que para anularlo en CSS, debe escribir un selector extremadamente específico.

```html
<div style="color: red"></div>
```

### Regla `!important`

Por último, escribir `!important` al final de un valor de CSS obtiene una puntuación de especificidad de **10.000 puntos**. Esta es la mayor especificidad que puede obtener un objeto individual.

Una regla `!important` se aplica a una propiedad CSS, por lo que todo en la regla general (selector y propiedades) no obtiene la misma puntuación de especificidad.

```css
.my-class {
  color: red !important; /* 10,000 points */
  background: white; /* 10 points */
}
```

{% Assessment 'scoring-beginner' %}

## Especificidad en contexto

La especificidad de cada selector que coincide con un elemento se suma. Considere este ejemplo de HTML:

```html
<a class="my-class another-class" href="#">A link</a>
```

Este enlace tiene dos clases. Agregue el siguiente CSS y obtendrá **1 punto de especificidad**:

```css
a {
  color: red;
}
```

Haga referencia a una de las clases en esta regla, ahora tiene **11 puntos de especificidad**:

```css
a.my-class {
  color: green;
}
```

Agregue la otra clase al selector, ahora tiene **21 puntos de especificidad**:

```css
a.my-class.another-class {
  color: rebeccapurple;
}
```

Agregue el atributo `href` al selector, ahora tiene **31 puntos de especificidad**:

```css
a.my-class.another-class[href] {
  color: goldenrod;
}
```

Finalmente, agregue una pseudiclase `:hover`, y el selector termina con **41 puntos de especificidad**:

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'scoring-advanced' %}

## Visualizando la especificidad

En diagramas y calculadoras de especificidad, la especificidad a menudo se visualiza así:

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/McrFhjqHXMznUzXbRuJ6.svg", alt="Un diagrama que muestra los selectores más específicos a los menos específicos", width="800", height="474" %}

El grupo de la izquierda son los selectores de `id`. El segundo grupo son los selectores de clase, atributo y pseudoclase. El grupo final son los selectores de elementos y pseudoelementos.

Como referencia, el siguiente selector es `0-4-1`:

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'visualizing' %}

## Especificidad pragmáticamente creciente

Digamos que tenemos algo de CSS que se parece a esto:

```css
.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

Con un HTML que se ve así:

```html
<button class="my-button" onclick="alert('hello')">Click me</button>
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoxdR', tab: 'css,result' } %}</figure>

El botón tiene un fondo gris, porque el segundo selector gana **11 puntos de especificidad** (`0-1-1`). Esto se debe a que tiene un selector de tipo (`button`), que es de **1 punto** y un selector de atributo (`[onclick]`), que es de **10 puntos**.

La regla anterior, `.my-button` obtiene **10 puntos** (`0-1-0`), porque tiene un selector de clase.

Si desea mejorar esta regla, repita el selector de clases de la siguiente manera:

```css
.my-button.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'zYNOXBJ', tab: 'css,result' } %}</figure>

Ahora, el botón tendrá un fondo azul, porque el nuevo selector obtiene una puntuación de especificidad de **20 puntos** (`0-2-0`).

{% Aside 'caution' %} Si encuentra que necesita aumentar la especificidad de esta manera con frecuencia, puede indicar que está escribiendo selectores demasiado específicos. Considere si puede refactorizar su CSS para reducir la especificidad de otros selectores para evitar este problema. {% endAside %}

## Una puntuación de especificidad coincidente hace que la instancia más nueva gane

Sigamos con el ejemplo del botón por ahora y cambiemos el CSS a esto:

```css
.my-button {
  background: blue;
}

[onclick] {
  background: grey;
}
```

El botón tiene un fondo gris, porque **ambos selectores tienen una puntuación de especificidad idéntica** ( `0-1-0` ).

<figure>{% Codepen { user: 'web-dot-dev', id: 'zYNOXKJ', tab: 'css,result' } %}</figure>

Si cambia las reglas en el orden de origen, el botón será azul.

```css
[onclick] {
  background: grey;
}

.my-button {
  background: blue;
}
```

<figure>{% Codepen {user: 'web-dot-dev', id: 'WNReWRO', tab: 'css,result' } %}</figure>

Esta es la única instancia en la que gana el CSS más nuevo. Para hacerlo, debe coincidir con la especificidad de otro selector que apunte al mismo elemento.

## Recursos

- [CSS SpeciFISHity](http://specifishity.com)
- [Calculadora de especificidad](https://specificity.keegan.st)
- [Especificidad MDN](https://developer.mozilla.org/docs/Web/CSS/Specificity)
- [Detalles sobre la especificidad de CSS](https://css-tricks.com/specifics-on-css-specificity/)
- [Otra calculadora de especificidad](https://polypane.app/css-specificity-calculator)
