---
title: 'Nuevos selectores funcionales de pseudoclases CSS `: is ()` y `: where ()`'
subhead: Estas aparentemente pequeñas adiciones a la sintaxis del selector de CSS tendrán un gran impacto.
authors:
  - adamargyle
description: Estas aparentemente pequeñas adiciones a la sintaxis del selector de CSS tendrán un gran impacto.
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/bFO3SPdt1bPIB8EylsB7.jpg
alt: Una biblioteca blanca y brillante, filas y filas de libros, con una sola persona en el medio que busca un solo libro.
tags:
  - blog
  - css
date: 2021-05-27
updated: 2021-05-27
---

Al escribir CSS, a veces puede terminar con largas listas de selección para apuntar a varios elementos con las mismas reglas de estilo. Por ejemplo, si desea ajustar el color de las etiquetas `<b>` encontradas dentro de un elemento de encabezado, puede escribir:

```css
h1 > b, h2 > b, h3 > b, h4 > b, h5 > b, h6 > b {
  color: hotpink;
}
```

En su lugar, puede usar `:is()` y mejorar la legibilidad para evitar un selector largo:

```css
:is(h1,h2,h3,h4,h5,h6) > b {
  color: hotpink;
}
```

La legibilidad y las conveniencias de selector más cortas son solo una parte del valor que `:is()` y `:where()` aportan a CSS. En esta publicación, descubrirá la sintaxis y el valor de estos dos pseudoselectores funcionales.

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/mkyjox1HJNL0AgtX25bi.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> Una visualización infinita del antes y el después de usar <code>:is()</code></figcaption></figure>

### Compatibilidad del navegador

Las pseudoclases `:is` y `:where` son compatibles con Chromium (&gt;=88), Firefox (&gt;=78) y Safari (&gt;=14). Consulte la [tabla de compatibilidad de los navegadores](https://developer.mozilla.org/docs/Web/CSS/:where#Browser_compatibility) con MDN para obtener más información. Algunas versiones anteriores del navegador admiten el selector `:is()` como `:matches()` o `-webkit-any()`. Para obtener más información, consulte la página <a href="https://developer.mozilla.org/docs/Web/CSS/:is" data-md-type="link">`:is()`</a> en MDN.

## Reunir `:is()` y `:where()`

Estos son selectores funcionales de pseudoclases, observe los caracteres `()` al final y la forma en que comienzan con `:`. Piense en ellos como invocaciones a funciones dinámicas en tiempo de ejecución que hacen coincidir elementos. Al escribir CSS, le brindan una forma de agrupar elementos en el medio, al principio o al final de un selector. También pueden cambiar la especificidad, dándole el poder de anular o aumentar la especificidad.

### Agrupación de selectores

Cualquier cosa que `:is()` pueda hacer con respecto a la agrupación, también puede hacerlo `:where()`. Esto incluye utilizarlos en cualquier parte del selector, anidarlos y apilarlos. Es la flexibilidad completa del CSS que conoce y ama. Estos son algunos ejemplos:

```css
/* al comienzo */
:where(h1,h2,h3,h4,h5,h6) > b {
  color: hotpink;
}

/* en la mitad */
article :is(header,footer) > p {
  color: gray;
}

/* al final */
.dark-theme :where(button,a) {
  color: rebeccapurple;
}

/* múltiple */
:is(.dark-theme, .dim-theme) :where(button,a) {
  color: rebeccapurple;
}

/* apilados */
:is(h1,h2):where(.hero,.subtitle) {
  text-transform: uppercase;
}

/* anidados */
.hero:is(h1,h2,:is(.header,.boldest)) {
  font-weight: 900;
}
```

Cada uno de los ejemplos anteriores de selectores demuestra la flexibilidad de estas dos pseudoclases funcionales. Para encontrar áreas de su código que podrían beneficiarse de `:is()` o de `:where()`, busque selectores con múltiples comas y con repetición de selectores.

### Uso de selectores simples y complejos con `:is()`

Para un repaso de los selectores, consulte el [módulo de selectores en Learn CSS](/learn/css/selectors/#complex-selectors). Estos son algunos ejemplos de selectores simples y complejos como ayuda para ilustrar la capacidad:

```css
article > :is(p,blockquote) {
  color: black;
}

:is(.dark-theme.hero > h1) {
  font-weight: bold;
}

article:is(.dark-theme:not(main .hero)) {
  font-size: 2rem;
}
```

{% Aside 'gotchas' %} Normalmente, cuando se usa un caracter `,` para crear una lista de selectores, si alguno de los selectores no es válido, todos los selectores se invalidan y la lista no coincidirá con los elementos. Es decir, no perdonan los errores. Aunque, `:is()` y `:where()` [son indulgentes](https://developer.mozilla.org/docs/Web/CSS/:is#forgiving_selector_parsing) y pueden [sacarlo de un apuro](https://css-tricks.com/almanac/selectors/i/is/#forgiving-selector-lists). {% endAside %}

Hasta ahora `:is()` y `:where()` son sintácticamente intercambiables. Es hora de ver en qué se diferencian.

### La diferencia entre `:is()` y `:where()`

Cuando se trata de especificidad `:is()` y `:where()` divergen fuertemente. Para un repaso sobre la especificidad, consulte el [módulo sobre la especificidad en Learn CSS](/learn/css/specificity/).

En breve

- `:where()` no tiene especificidad.<br> `:where()` aplasta toda la especificidad en la lista del selector pasada como parámetros funcionales. Esta es la primera función de selección de este tipo.
- `:is()` toma la especificidad de su selector más específico.<br> `:is(a,div,#id)` tiene una puntuación de especificidad de una ID, 100 puntos.

Tomar el selector de mayor especificidad de la lista solo fue un problema para mí cuando me estaba entusiasmando demasiado con la agrupación. Siempre pude mejorar la legibilidad si movía el selector de alta especificidad a su propio selector donde no tendría tanto impacto. He aquí un ejemplo de lo que quiero decir:

```css
article > :is(header, #nav) {
  background: white;
}

/* mejor con */
article > header,
article > #nav {
  background: white;
}
```

Con `:where()`, estoy esperando a que las bibliotecas ofrezcan versiones sin especificidad. La competencia de especificidad entre los estilos de autor y los estilos de biblioteca podría llegar a su fin. No habría ninguna especificidad con la que competir al escribir CSS. CSS ha estado trabajando en una función de agrupación como esta durante bastante tiempo, ya está aquí y todavía es un territorio en gran parte inexplorado. Diviértase mientras hace hojas de estilo más pequeñas y quitando comas.

*Foto de [Markus Winkler](https://unsplash.com/@markuswinkler) en [Unsplash](https://unsplash.com/photos/afW1hht0NSs)*
