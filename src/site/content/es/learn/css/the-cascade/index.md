---
title: La cascada
description: |-
  A veces, dos o más reglas CSS pueden aplicarse a un elemento.
  En este módulo, descubre cómo el navegador elige cuál usar y cómo controlar esta selección.
audio:
  title: 'The CSS Podcast   - 004: The Cascade'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_004_v1.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
tags:
  - css
---

CSS son las siglas para Cascading Stylesheets (hojas de estilo en cascada). La cascada es el algoritmo para resolver conflictos donde se aplican múltiples reglas CSS a un elemento HTML. Es la razón por la que el texto del botón con el siguiente CSS será azul.

```css
button {
  color: red;
}

button {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'GRrgMOm', height: 200 } %}</figure>

Comprender el algoritmo en cascada te ayuda a comprender en cómo el navegador resuelve conflictos como este. El algoritmo en cascada se divide en 4 etapas distintas.

1. **Posición y orden de aparición**: El orden en el que aparecen tus reglas CSS
2. **Especificidad**: Un algoritmo que determina qué selector de CSS tiene la coincidencia más fuerte
3. **Origen**: El orden en el que aparece CSS y de dónde proviene, ya sea un estilo de navegador, CSS de una extensión de navegador o tu propio CSS creado
4. **Importancia**: Algunas reglas CSS tienen más peso que otras, especialmente con el tipo de regla `!important`

## Posición y orden de aparición

La cascada tiene en cuenta el orden en que aparecen las reglas CSS y cómo aparecen mientras calcula la resolución de conflictos.

La demostración que se encuentra al comienzo de esta lección es el ejemplo más sencillo de posición. Hay dos reglas que tienen selectores de especificidad idéntica, por lo que la última en ser declarada fue la que ganó.

Los estilos pueden provenir de varias fuentes en una página HTML, como una etiqueta de `<link>`, una etiqueta `<style>` incrustada y CSS en línea como se define en el atributo de `style`.

Si tienes un `<link>` que incluye CSS en la parte superior de tu página HTML y tienes otro `<link>` que incluye un CSS en la parte inferior de tu página, el `<link>` inferior tendrá la mayor especificidad. Lo mismo ocurre con los elementos de `<style>`. Se vuelven más específicos cuanto más abajo están en la página.

<figure>{% Codepen { user: 'web-dot-dev', id: 'NWdPaWv' } %} <figcaption> El botón tiene un fondo azul, como lo define el CSS, que está incluido en un elemento <code>&lt;link /&gt;</code>. Una regla CSS que establece que sea oscura se encuentra en una segunda hoja de estilo vinculada y se aplica debido a donde se encuentra en su posición (especificada más tarde).</figcaption></figure>

Este orden también se aplica a los elementos de `<style>`. Si se declaran antes de un `<link>`, el CSS de la hoja de estilo vinculada tendrá la mayor especificidad.

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbLoB' } %} <figcaption> El elemento de <code>&lt;style&gt;</code> se declara en <code>&lt;head&gt;</code>, mientras que el elemento de <code>&lt;link /&gt;</code> se declara en <code>&lt;body&gt;</code>. Esto significa que obtiene más especificidad que el elemento de <code>&lt;style&gt;</code></figcaption></figure>

Un atributo `style` en línea con CSS declarado anulará todos los demás CSS, independientemente de su posición, a menos que una declaración tenga definido el atributo de `!important`.

La posición también se aplica en el orden de tus reglas CSS. En este ejemplo, el elemento tendrá un fondo violeta porque `background: purple` se declaró en último lugar. Debido a que el fondo verde se declaró antes que el fondo violeta, el primero será ignorado por el navegador.

```css
.my-element {
  background: green;
  background: purple;
}
```

Poder especificar dos valores para la misma propiedad puede ser una forma sencilla de crear alternativas para los navegadores que no admiten un valor en particular. En el siguiente ejemplo, `font-size` se declara dos veces. Si el navegador es compatible con `clamp()`, se descartará la declaración de `font-size`. Si `clamp()` no es compatible, se respetará la declaración inicial y el tamaño de fuente será 1.5rem

```css
.my-element {
  font-size: 1.5rem;
  font-size: clamp(1.5rem, calc(1rem + 3vw), 2rem);
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbPMP' } %}</figure>

{% Aside %} Este enfoque de declarar la misma propiedad dos veces funciona porque los navegadores ignoran los valores que no comprenden. A diferencia de otros lenguajes de programación, CSS no arrojará un error ni interrumpirá tu programa cuando detecte una línea que no puede analizar; el valor que no puede analizar no es válido y, por lo tanto, se ignora. Luego, el navegador continúa procesando el resto del CSS sin romper las cosas que ya comprende. {% endAside %}

{% Assessment 'position' %}

## Especificidad

La especificidad es un algoritmo que determina qué selector de CSS es el más específico, utilizando un sistema de ponderación o puntuación para realizar esos cálculos. Al hacer una regla más específica, puede hacer que se aplique incluso si algún otro CSS que coincida con el selector aparece más adelante en el CSS.

En [la siguiente lección](/learn/css/specificity), puedes aprender los detalles de cómo se calcula la especificidad; sin embargo, tener en cuenta algunas cosas te ayudará a evitar demasiados problemas de especificidad.

El CSS dirigido a una clase en un elemento hará que la regla sea más específica y, por lo tanto, se considerará más importante de aplicar que el CSS dirigido solamente al elemento. Esto significa que con el siguiente CSS, el `h1` será de color rojo aunque ambas reglas coincidan y la regla para el `h1` venga más adelante en la hoja de estilo.

```html
<h1 class="my-element">Heading</h1>
```

```css
.my-element {
  color: red;
}

h1 {
  color: blue;
}
```

Una `id` hace que el CSS sea aún más específico, por lo que los estilos aplicados a una id anularán los aplicados de muchas otras formas. Esta es una de las razones por las que generalmente no es una buena idea adjuntar estilos a una `id`. Puede dificultar la sobrescritura de ese estilo con otra cosa.

### La especificidad es acumulativa

Como aprenderás en la siguiente lección, a cada tipo de selector se le otorgan puntos que indican qué tan específico es, los puntos para todos los selectores que has utilizado para apuntar a un elemento se suman. Esto significa que si apuntas a un elemento con una lista de selección como `a.my-class.another-class[href]:hover`, obtendrás algo bastante difícil de sobrescribir con otro CSS. Por esta razón, y para ayudar a que tu CSS sea más reutilizable, es una buena idea mantener tus selectores lo más simples posible. Usa la especificidad como una herramienta para llegar a los elementos cuando lo necesites, pero siempre considera refactorizar listas de selectores largas y específicas, si es posible.

## Origen

El CSS que escribes no es el único CSS que se aplica a una página. La cascada tiene en cuenta el origen del CSS. Este origen incluye la hoja de estilo interna del navegador, los estilos agregados por las extensiones del navegador o el sistema operativo y tu CSS creado. El **orden de especificidad de estos orígenes**, desde el menos específico al más específico, son los siguientes:

1. **Estilos base de agente de usuario**. Estos son los estilos que tu navegador aplica a los elementos HTML de forma predeterminada.
2. **Estilos de usuarios locales**. Estos pueden provenir del nivel del sistema operativo, como un tamaño de fuente base o una preferencia de movimiento reducido. También pueden provenir de extensiones de navegador, como una extensión de navegador que permite al usuario escribir su propio CSS personalizado para una página web.
3. **CSS creado**. El CSS que tú creas.
4. **Los `!important` creados**. Cualquier `!important` que agregues a tus declaraciones creadas.
5. **Estilos de usuarios locales `!important`**. Cualquier `!important` que provenga del nivel del sistema operativo o del nivel de extensión del navegador CSS.
6. **Agente de usuario `!important`**. Cualquier `!important` que se define en el CSS predeterminado, proporcionado por el navegador.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/zPdaZ6G11oYrgJ78EfF7.svg", alt="Una demostración visual del orden de los orígenes como también se explica en la lista.", width="800", height="347" %}</figure>

Si tienes un `!important` en el CSS que hayas creado y el usuario tiene una regla de `!important` en su CSS personalizado, ¿cuál CSS será el ganador?

{% Assessment 'origin' %}

## Importancia

No todas las reglas de CSS se calculan de la misma manera entre sí, ni se les da la misma especificidad entre sí.

El **orden de importancia**, de menor a mayor importancia, es el siguiente:

1. tipo de regla normal, como `font-size` , `background` o `color`
2. tipo de regla de `animation`
3.  tipo de regla de `!important` (siguiendo el mismo orden que el origen)
4. tipo de regla de `transition`

Los tipos de reglas de transition (transición) y animation (animación) tienen más importancia que las reglas normales. En el caso de las transiciones, es más importante que los tipos de reglas `!important`. Esto se debe a que cuando una animación o transición se activa, su comportamiento esperado es cambiar el estado visual.

## Usando DevTools para averiguar por qué no se aplican algunos CSS

Browser DevTools normalmente mostrará todos los CSS que podrían coincidir con un elemento, mientras los que no se utilizarán se terminan tachando.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Z6aLsqcqjGAUsWzq7DZs.png", alt="Una imagen de DevTools del navegador con un CSS sobrescrito que fue tachado", width="800", height="446" %}</figure>

Si el CSS que esperabas aplicar no aparece en lo absoluto, entonces no coincide con el elemento. En ese caso, debes de buscar en otra parte, tal vez por un error tipográfico en el nombre de una clase o elemento o algún CSS no válido.

{% Assessment 'conclusion' %}

## Recursos

- [Un explicador de la cascada muy interactivo](https://wattenberger.com/blog/css-cascade)
- [Referencia de cascada de MDN](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
