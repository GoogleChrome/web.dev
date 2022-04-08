---
title: Modelo de caja
description: |2-

  Todo lo que muestra CSS es una caja.
  Por lo tanto, comprender cómo funciona el modelo de caja CSS es una base fundamental de CSS.
audio:
  title: 'The CSS Podcast   - 001: The Box Model'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_001_v2.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

Digamos que tienes este fragmento de HTML:

```html
<p>Soy un párrafo de texto y tengo algunas palabras.</p>
```

Luego escribes este CSS para el párrafo anterior:

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

El contenido saldría de su elemento y tendría 142px de ancho, en lugar de 100px. ¿Porqué sucede eso? El modelo de caja es una base fundamental de CSS y comprender cómo funciona, cómo se ve afectado por otros aspectos de CSS y, lo que es más importante, cómo puedes controlarlo te ayudará a escribir un CSS más predecible.

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNRemxN', height: 300 } %}</figure>

Una cosa realmente importante para recordar al escribir CSS, o al trabajar en la web en general, es que todo lo que muestra CSS es una caja. Ya sea que uses `border-radius` en una caja para que se parezca a un círculo, o incluso solo un texto: la clave a recordar es que todo es una caja.

## Contenido y tamaño

Las cajas tienen un comportamiento diferente según su `display`, sus dimensiones establecidas y el contenido que vive dentro de ellas. Este contenido podría ser incluso más cajas, generadas por elementos secundarios, o por contenido de texto sin formato. De cualquier manera, este contenido afectará la forma predeterminada del tamaño de la caja.

Puedes controlar esto mediante el **tamaño extrínseco**, o puedes seguir permitiendo que el navegador tome decisiones por ti en función del tamaño del contenido, utilizando el **tamaño intrínseco**.

Veamos rápidamente la diferencia, usando una demostración como apoyo.

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoMBL' } %} <figcaption> Ten en cuenta que cuando la caja usa un tamaño extrínseco, hay un límite de la cantidad de contenido que puede agregar antes de que se desborde de los límites de la caja. Esto hace que la palabra "awesome" se desborde.</figcaption></figure>

La demostración tiene las palabras, "CSS is awesome" en una caja con dimensiones fijas y un borde grueso. La caja tiene un ancho, por lo que tiene un tamaño extrínseco, el cual controla el tamaño de su contenido hijo. Sin embargo, el problema con esto es que la palabra "awesome" es demasiado grande para la caja, por lo que se desborda fuera del **borde de la caja** del elemento padre (más sobre esto más adelante en la lección). Una forma de evitar este desbordamiento es permitir que la caja tenga un tamaño intrínseco ya sea removiendo el tamaño del ancho o, en este caso, estableciendo el `width` en `min-content`. El `min-content` le dice a la caja que sea tan ancha como el ancho mínimo intrínseco de su contenido (la palabra "awesome"). Esto permite que la caja se ajuste perfectamente a "CSS is awesome".

Veamos algo más complejo para ver el impacto de diferentes tamaños en el contenido real:

<figure>{% Codepen { user: 'web-dot-dev', id: 'wvgwOJV', height: 650 } %}</figure>

Activa y desactiva el tamaño intrínseco para ver cómo puedes obtener más control con el tamaño extrínseco y dejar que el contenido tenga más control con el tamaño intrínseco. Para ver el efecto que tiene el tamaño intrínseco y extrínseco, agrega algunas oraciones de contenido a la tarjeta. Cuando este elemento usa un tamaño extrínseco, hay un límite de la cantidad de contenido que puedes agregar antes de que se desborde de los límites del elemento, pero este no es el caso cuando el tamaño intrínseco está activado.

De forma predeterminada, este elemento tiene un `width` y un `height` ambos de `400px`. Estas dimensiones dan límites estrictos a todo lo que se encuentre adentro del elemento, que se respetará a menos que el contenido sea demasiado grande para la caja, en cuyo caso se producirá un desbordamiento visible. Puedes ver esto en acción cambiando el contenido de la leyenda, debajo de la imagen de la flor, a algo que exceda la altura de la caja, que son unas pocas líneas de contenido.

{% Aside "key-term" %} Cuando el contenido es demasiado grande para la caja en la que se encuentra, lo llamamos desbordamiento. Puedes definir cómo un elemento maneja el contenido de desbordamiento, utilizando la propiedad de `overflow`. {% endAside %}

Cuando cambia al tamaño intrínseco, deja que el navegador tome decisiones por ti, según el tamaño del contenido de la caja. Es mucho más difícil que exista un desbordamiento con el tamaño intrínseco porque nuestra caja cambiará el tamaño con su contenido, en lugar de intentar ajustar el tamaño del contenido. Es importante recordar que este es el comportamiento flexible y predeterminado de un navegador. Aunque el tamaño extrínseco brinda más control sobre la superficie, el tamaño intrínseco, la mayoría del tiempo, proporciona la mayor flexibilidad.

## Las áreas del modelo de caja

Las cajas se componen de áreas de modelo de caja distintas que realizan un trabajo específico.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ECuEOJEGnudhXW5JEFih.svg", alt="Un diagrama que muestra las cuatro áreas principales del modelo de caja: caja de contenido, caja de padding, caja de borde y caja de margen", width="800", height="547" %} <figcaption> Las cuatro áreas principales del modelo de caja: caja de contenido, caja de padding, caja de borde y caja de margen.</figcaption></figure>

Inicias con la **caja de contenido**, que es la área en la que reside el contenido. Como aprendiste antes: este contenido puede controlar el tamaño de su elemento principal, por lo que suele ser el área de tamaño más variable.

La **caja de padding (relleno)** rodea la caja de contenido y es el espacio creado por la propiedad de [`padding`](https://developer.mozilla.org/docs/Web/CSS/padding). Debido a que el padding está dentro de la caja, el fondo de la caja será visible en el espacio que crea. Si nuestra caja tiene reglas de desbordamiento establecidas, como `overflow: auto` o `overflow: scroll`, las barras de desplazamiento ocuparán este espacio también.

<figure>{% Codepen { user: 'web-dot-dev', id: 'BaReoEV' } %}</figure>

La **caja de borde** rodea la caja de padding y su espacio está ocupado por el valor del `border`. La caja de borde son los límites de su caja y el **filo del borde** es el límite de lo que puedes ver visualmente. La propiedad de <a href="https://developer.mozilla.org/docs/Web/CSS/border" data-md-type="link">`border`</a> se usa para enmarcar visualmente un elemento.

El área final, la **caja de margen**, es el espacio alrededor de tu caja, definida por la regla de `margin`. Propiedades como el [`outline`](https://developer.mozilla.org/docs/Web/CSS/outline) y [`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow) ocupan este espacio porque están pintadas por encima de los elementos, por lo que no afectan el tamaño de nuestra caja. Puedes tener un `outline-width` de `200px` en nuestra caja y todo lo que está dentro e incluido la caja de borde sería exactamente del mismo tamaño.

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWprGea' } %}</figure>

## Una analogía útil

El modelo de caja es complejo de entender, así que recapitulemos lo que has aprendido con una analogía.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg", alt="Tres fotos con marcos", width="800", height="562" %}</figure>

En este diagrama, tienes tres fotos con marcos, montados en una pared, uno al lado del otro. El diagrama tiene etiquetas que asocian elementos del marco con el modelo de caja.

Para descomponer esta analogía:

- La caja de contenido es la obra de arte.
- La caja de padding es el blanco mate, entre el marco y la obra de arte.
- La caja de borde es el marco, que proporciona un borde literal para la obra de arte.
- La caja de margen es el espacio entre cada cuadro.
- La sombra ocupa el mismo espacio que la caja de margen.

## Depurando el modelo de caja

Browser DevTools proporciona una visualización de los cálculos del modelo de caja de una caja seleccionada, lo que puede ayudarte a comprender cómo funciona el modelo de caja y, lo que es más importante, cómo está afectando el sitio web en el que estas trabajando.

Prueba lo siguiente en tu propio navegador:

1. [Abre DevTools](https://developer.chrome.com/docs/devtools/open/)
2. [Selecciona un elemento](https://developer.chrome.com/docs/devtools/css/reference/#select)
3. Muestra el depurador del modelo de caja

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/sKdHrAfqahgWfDVQEBBT.mp4", controls=true %}</figure>

## Controlando el modelo de caja

Para comprender cómo controlar el modelo de caja, primero debes comprender lo que sucede en tu navegador.

Cada navegador aplica una hoja de estilo de agente de usuario a los documentos HTML. El CSS utilizado varía entre cada navegador, pero proporciona valores predeterminados sensibles para facilitar la lectura del contenido. Estos definen cómo deben verse y comportarse los elementos si no hay un CSS definido. En los estilos de agente de usuario es donde también se establece el `display` por defecto para la caja. Por ejemplo, si estamos en un flujo normal, el valor `display` por defecto de un elemento `<div>` es `block`, el valor `display` por defecto de `<li>` de `list-item` y el valor `display` por defecto de `<span>` es `inline`.

Un `inline` tiene un margen de bloque, pero otros elementos no lo respetarán. Utiliza `inline-block` y esos elementos respetarán el margen del bloque, mientras que el elemento mantiene la mayoría de los mismos comportamientos que tenía como elemento en `inline`. Un `block`, por defecto, llenará el **espacio inline** disponible, mientras que los elementos de `inline` e `inline-block` solo serán tan grandes como su contenido.

Además de comprender cómo los estilos de agente de usuario afectan a cada caja, también debes comprender el `box-sizing`, que le indica a nuestra caja cómo calcular su tamaño de la caja. Por defecto, todos los elementos tienen el siguiente estilo de agente de usuario: `box-sizing: content-box;`.

Utilizar `content-box` como valor de `box-sizing` significa que cuando estableces dimensiones, como el `width` y el `height`, se aplicarán al **cuadro de contenido**. Si luego configuras el `padding` y el `border`, estos valores se agregarán al tamaño de la caja de contenido.

{% Assessment 'box-model' %}

El ancho real de esta caja será de 260px. Como el CSS usa el predeterminado `box-sizing: content-box`, el ancho aplicado es el ancho del contenido, el `padding` y el `border` en ambos lados se agregan a eso. Entonces, 200px para el contenido + 40px de padding + 20px de borde hace un ancho visible total de 260px.

Sin embargo, *puedes* controlar esto haciendo la siguiente modificación para usar el modelo de caja alternativo, `border-box`:

```css/1
.my-box {
  box-sizing: border-box;
	width: 200px;
	border: 10px solid;
	padding: 20px;
}
```

Este modelo de caja alternativo le dice a CSS que aplique el `width`  la caja de borde en lugar de la caja de contenido. Esto significa que nuestro `border` y `padding` se *empujan hacia adentro* y, como resultado, cuando configuras `.my-box` para que tenga `200px` ancho: en realidad se renderiza a `200px` ancho.

Mira cómo funciona esto en la siguiente demostración interactiva. Observa que cuando cambia el `box-sizing` se muestra, a través de un fondo azul, qué CSS se está aplicando *dentro de* nuestro cuadro.

<figure>{% Codepen { user: 'web-dot-dev', id: 'oNBvVpM', height: 650 } %}</figure>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Esta regla CSS selecciona todos los elementos del documento y todos los `::before` y `::after` y aplica `box-sizing: border-box`. Esto significa que ahora todos los elementos tendrán este modelo de caja alternativo.

Debido a que el modelo de caja alternativo puede ser más predecible, los desarrolladores a menudo agregan esta regla a resets y normalizers, [como lo es este](https://piccalil.li/blog/a-modern-css-reset).

## Recursos

- [Introducción al modelo de caja](https://developer.mozilla.org/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [¿Qué son las herramientas para desarrolladores de los navegadores?](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)

### Hojas de estilo del agente de usuario

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
