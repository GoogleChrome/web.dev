---
title: 'min(), max() y clamp(): tres funciones lógicas de CSS que se utilizan actualmente'
subhead: Aprenda a controlar el tamaño de los elementos, a mantener un espaciado adecuado y a implementar una tipografía fluida por medio de estas funciones de CSS totalmente compatibles.
authors:
  - una
date: 2020-10-14
hero: image/admin/aVL3BEXD3AF9fFzPGKMf.jpg
alt: Conjunto de herramientas que están en un escritorio.
description: Min, max, y clamp ofrecen algunas funciones de CSS poderosas que permiten un estilo más adaptativo con menos líneas de código. En este artículo se explica cómo controlar el tamaño de los elementos, mantener un espaciado adecuado e implementar una tipografía fluida utilizando estas funciones matemáticas de CSS.
tags:
  - blog
  - css
  - layout
feedback:
  - api
---

Con la evolución del diseño adaptativo y su creciente complejidad, el propio CSS evoluciona constantemente y proporciona a los autores un mayor control. Las funciones
[`min()`](https://developer.mozilla.org/docs/Web/CSS/min),
[`max()`](https://developer.mozilla.org/docs/Web/CSS/max), y
[`clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp),
que ahora son compatibles con todos los navegadores modernos, son algunas de las herramientas más recientes para crear sitios web y aplicaciones más dinámicas y adaptativas.

Cuando se trata de una tipografía flexible y fluida, un cambio de tamaño controlado de los elementos y el mantenimiento de un espaciado adecuado, las funciones `min()`, `max()` y `clamp()` pueden ayudar.

## Antecedentes

<blockquote>
  <p>Las funciones matemáticas <code>calc()</code>, <code>min()</code>, <code>max()</code> y <code>clamp()</code> permiten utilizar expresiones matemáticas con la suma (+), resta (-), multiplicación (*) y división (/) como componentes de los valores.</p>
  <cite><p data-md-type="paragraph"><a href="https://www.w3.org/TR/css-values-4/#calc-notation">Valores y unidades de CSS de Nivel 4</a></p></cite>
</blockquote>

Safari fue el primero en incorporar el conjunto completo de funciones en abril del 2019, y Chromium lo hizo más tarde ese mismo año en su versión 79. Este año, con el lanzamiento de Firefox [75](https://bugzilla.mozilla.org/show_bug.cgi?id=1519519), ahora tenemos similitud de navegadores para `min()`, `max()` y `clamp()` en todos los navegadores evergreen.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIgePP41Quh7ubYh54vo.png", alt="", width="800", height="246" %} <figcaption> Mesa de apoyo <a href="https://caniuse.com/css-math-functions">Caniuse</a>.</figcaption></figure>

## Cómo se utilizan

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-demo.mp4">
  </source></video>
  <figcaption>Para mostrar cómo la función min() selecciona un valor basado en una lista de opciones y su padre. <a href="https://codepen.io/una/pen/rNeGNVL">Consulte la demostración en Codepen.</a></figcaption></figure>

Se puede utilizar `min()`, `max()`, y `clamp()` en el lado derecho de cualquier expresión de CSS donde tenga sentido. En el caso de `min()` y `max()`, se proporciona una lista de valores como argumento, y el navegador determina cuál es el más pequeño o el más grande, respectivamente. Por ejemplo, en el caso de `min(1rem, 50%, 10vw)`, el navegador calcula cuál de estas unidades relativas es la más pequeña, y utiliza ese valor como valor real.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-demo.mp4">
  </source></video>
  <figcaption>Para mostrar cómo la función max() selecciona un valor basado en una lista de opciones y su padre. <a href="https://codepen.io/una/pen/RwaZXqR">Consulte la demostración en Codepen.</a></figcaption></figure>

En la función `max()` se selecciona el mayor valor de una lista de expresiones separadas por comas.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-demo.mp4">
  </source></video>
  <figcaption>Para mostrar cómo la función clamp() selecciona un valor basado en una lista de opciones y su padre. <a href="https://codepen.io/una/pen/bGpoGdJ">Consulte la demostración en Codepen.</a></figcaption></figure>

Para usar `clamp()` ingrese tres valores: un valor mínimo, un valor ideal (a partir del cual calcular) y un valor máximo.

Cualquiera de estas funciones puede utilizarse en cualquier lugar donde se permita un `<length>`, `<frequency>`, `<angle>`, `<time>`, `<percentage>`, `<number>`, o `<integer>`. Puede utilizarlos de forma independiente (por ejemplo, `font-size: max(0.5vw, 50%, 2rem)`), junto con `calc()` (por ejemplo, `font-size: max(calc(0.5vw - 1em), 2rem)`), o compuesto (por ejemplo `font-size: max(min(0.5vw, 1em), 2rem)`).

{% Aside %} Cuando se utiliza un cálculo dentro de una función `min()` , `max()` o `clamp()` , puede eliminar la llamada a `calc()` . Por ejemplo, escribir `font-size: max(calc(0.5vw - 1em), 2rem)` sería lo mismo que `font-size: max(0.5vw - 1em, 2rem)` . {% endAside %}

En resumen:

- `min(<value-list>)`: selecciona el valor más pequeño (más negativo) de una lista de expresiones separadas por comas.
- `max(<value-list>)`: selecciona el mayor valor (más positivo) de una lista de expresiones separadas por comas.
- `clamp(<min>, <ideal>, <max>)`: establece un valor entre un límite superior y uno inferior, basado en un valor ideal establecido.

Echemos un vistazo a algunos ejemplos.

## El ancho perfecto

De acuerdo con [El estilo tipográfico de los elementos (The Elements of Typographic Style)](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%20from%2045%20to%2075,is%2040%20to%2050%20characters.%E2%80%9D), escrito por Robert Bringhurst, "se considera que entre 45 y 75 caracteres es una longitud de línea satisfactoria para una página de una sola columna en una carátula de texto en formato serif con un tamaño de texto determinado".

Para garantizar que sus bloques de texto no sean más estrechos que 45 caracteres ni más anchos que 75, utilice `clamp()` y la unidad `ch` ([avance de caracteres](https://developer.mozilla.org/docs/Web/CSS/length) de ancho 0):

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

Esto permite que el navegador defina el ancho del párrafo. Establecerá el ancho al 50%, a menos que el 50% sea más pequeño que `45ch`, en cuyo caso se seleccionará `45ch`, y a la inversa si el 50% es más ancho que `75ch`. En esta demostración, la tarjeta por sí misma quedará sujeta:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-width.mp4">
  </source></video>
  <figcaption>Al utilizar la función clamp() para limitar un ancho mínimo y máximo. <a href="https://codepen.io/una/pen/QWyLxaL">Consulte la demostración en Codepen.</a></figcaption></figure>

Podrá dividir esto con la función `min()` o `max()`. Si desea que el elemento siempre esté a `50%` de ancho, y no exceda `75ch` de ancho (es decir, en pantallas más grandes), escriba: `width: min(75ch, 50%);`. Esto establece esencialmente un tamaño "máximo" utilizando la función `min()`.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-width.mp4">
  </source></video>
  <figcaption>Al utilizar la función clamp() para limitar un ancho mínimo y máximo.</figcaption></figure>

Del mismo modo, puede garantizar un tamaño mínimo para que el texto sea legible mediante la función `max()`. Esto se vería así: `width: max(45ch, 50%);`. Aquí, el navegador seleccionará lo que sea más grande, `45ch` o `50%`, lo que significa que el elemento debe tener *al menos* `45ch` o que sea más grande.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-width.mp4">
  </source></video>
  <figcaption>Al utilizar la función clamp() para limitar un ancho mínimo y máximo.</figcaption></figure>

## Administración del relleno

Aplicando el mismo concepto anterior, en el que la función `min()` puede establecer un valor "máximo" y `max()` establece un valor "mínimo", puede utilizar `max()` para establecer un tamaño mínimo de relleno. Este ejemplo viene de [Trucos de CSS](https://css-tricks.com/using-max-for-an-inner-element-max-width/), donde el lector Caluã de Lacerda Pataca compartió esta idea: La idea es permitir que un elemento tenga un relleno adicional en tamaños de pantalla más grandes, pero mantener un relleno mínimo en tamaños de pantalla más pequeños, particularmente en el relleno en línea. Para conseguirlo, utiliza `calc()` y resta el relleno mínimo de cada lado: `calc((100vw - var(--contentwidth)) / 2)`, *o* utilice max: `max(2rem, 50vw - var(--contentwidth) / 2)`. Todo junto se verá así:

```css
footer {
  padding: var(--blockPadding) max(2rem, 50vw - var(--contentwidth) / 2);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-padding.mp4">
  </source></video>
  <figcaption>Establezca un relleno mínimo para un componente mediante la función max(). <a href="https://codepen.io/chriscoyier/pen/qBZqNKa">Consulte la demostración en Codepen.</a></figcaption></figure>

## Tipografía fluida

Para permitir una tipografía fluida, [Mike Riethmeuller](https://twitter.com/mikeriethmuller) popularizó una técnica que utiliza la función `calc()` para establecer un tamaño de fuente mínimo, un tamaño de fuente máximo y permitir escalar del mínimo al máximo.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/fliud-type.mp4">
  </source></video>
  <figcaption>Para crear una tipografía fluida con clamp(), <a href="https://codepen.io/una/pen/ExyYXaN">consulte la demostración en Codepen.</a><a href="https://codepen.io/una/pen/ExyYXaN"></a></figcaption></figure>

Con `clamp()`, puede escribir esto más claramente. En vez de requerir una cadena compleja, el navegador puede hacer el trabajo por usted. Establezca el tamaño de fuente mínimo aceptable (por ejemplo, `1,5rem` para un título, el tamaño máximo (es decir, `3rem`) y el tamaño ideal de `5vw`.

Ahora, obtendremos una tipografía que se escalará con el ancho de la ventana de visualización de la página hasta que alcance los valores mínimos y máximos que la limitan, en una línea de código mucho más breve:

```css
p {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

{% Aside 'warning' %} Limitar el tamaño del texto con `max()` o `clamp()` puede causar un fallo WCAG bajo [1.4.4 para redimensionar el texto (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=144#resize-text) porque un usuario puede ser incapaz de escalar el texto al 200% de su tamaño original. Asegúrese de [probar los resultados con el zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html). {% endAside %}

## Conclusión

Las funciones matemáticas de CSS, `min()`, `max()`, y `clamp()` son muy poderosas, con buena compatibilidad, y podrían ser justo lo que está buscando para ayudarle a construir interfaces de usuario adaptativas. Para obtener más recursos, consulte:

- [Valores y unidades de CSS en MDN](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Values_and_units)
- [Valores y unidades de CSS en la especificación del Nivel 4](https://www.w3.org/TR/css-values-4/)
- [Trucos de CSS en el artículo sobre el ancho del elemento interno](https://css-tricks.com/using-max-for-an-inner-element-max-width/)
- [min(), max(), clamp() Resumen de Ahmad Shadeed](https://ishadeed.com/article/css-min-max-clamp/)

Imagen de [portada](https://unsplash.com/@yer_a_wizard) de @yer_a_wizard en Unsplash.
