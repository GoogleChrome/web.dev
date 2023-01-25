---
title: Unidades de dimensionamiento
description: En este módulo aprenderá a dimensionar elementos mediante CSS, trabajando con el medio flexible de la web.
audio:
  title: 'The CSS Podcast   - 008: Dimensionamiento de unidades'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_008_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-13
tags:
  - css
---

La web es un medio responsivo, pero a veces deseamos controlar sus dimensiones para mejorar la calidad general de la interfaz. Un buen ejemplo de esto es limitar la longitud de las líneas para mejorar la legibilidad. ¿Cómo haría eso en un medio flexible como la web?

<figure>{% Codepen { user: 'web-dot-dev', id: 'bGgEGxj', tab: 'css,result' } %}</figure>

Para este caso, puede usar una unidad `ch`, que es igual al ancho de un carácter "0" en la fuente renderizada a su tamaño calculado. Esta unidad le permite limitar el ancho del texto con una unidad diseñada para ajustar su tamaño, lo que a su vez, permite un control predecible independientemente del tamaño de ese texto. La unidad `ch` es una de las pocas unidades que son útiles para contextos específicos como este ejemplo.

## Números

Los números se utilizan para definir la `opacity`, `line-height` e incluso los valores del canal de color en `rgb`. Los números son enteros sin unidades (1, 2, 3, 100) y decimales (.1, .2, .3).

Los números tienen significado según su contexto. Por ejemplo, al definir `line-height`, un número es representativo de una ratio si la define sin una unidad de apoyo:

```css
p {
  font-size: 24px;
  line-height: 1.5;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'yLgYZRK', tab: 'css,result' } %}</figure>

En este ejemplo, `1.5` es igual al **150%** del **tamaño de fuente en píxeles calculado** del elemento `p`. Esto significa que si la `p` tiene un `font-size` de `24px`, la altura de la línea se calculará como `36px`.

{% Aside %} Es una buena idea usar un valor sin unidades para `line-height`, en lugar de especificar una unidad. Como aprendió en el [módulo de herencia](/learn/css/inheritance), `font-size` se puede heredar. Definir una `line-height` sin unidades mantiene la altura de la línea en relación con el tamaño de la fuente. Esto da una mejor experiencia que, digamos, `line-height: 15px`, que no cambiará y puede parecer extraño con ciertos tamaños de fuente. {% endAside %}

Los números también se pueden utilizar en los siguientes lugares:

- Al configurar valores para filtros: `filter: sepia(0.5)` aplica un filtro sepia del `50%`.
- Al configurar la opacidad: `opacity: 0.5` aplica una opacidad del `50%`.
- En canales de color: `rgb(50, 50, 50)`, donde los valores 0-255 son aceptables para establecer un valor de color. [Ver lección de color](/learn/css/color).
- Para transformar un elemento: `transform: scale(1.2)` escala el elemento en un 120% de su tamaño inicial.

## Porcentajes

Al usar un porcentaje en CSS, necesita saber cómo se calcula éste. Por ejemplo, `width` se calcula como un porcentaje del ancho del elemento principal.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  width: 50%; /* calculated: 150px */
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'ZELbwwj', tab: 'css,result' } %}</figure>

En el ejemplo anterior, el ancho de `div p` es `150px`.

Si establece `margin` o `padding` como un porcentaje, serán una porción del **ancho del elemento principal**, independientemente de la dirección.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  margin-top: 50%; /* calculated: 150px */
  padding-left: 50%; /* calculated: 150px */
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNRQPqX', tab: 'css,result' } %}</figure>

En el fragmento anterior, tanto `margin-top` como `padding-left` se calcularán en `150px`.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  width: 50%; /* calculated: 150px */
  transform: translateX(10%); /* calculated: 15px */
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgwBxv', tab: 'css,result' } %}</figure>

Si establece un valor `transform` como porcentaje, se basa en el elemento con el conjunto de transformación. En este ejemplo, `p` tiene un valor `translateX` de `10%` y un `width` del `50%`. Primero, calcule cuál será el ancho: `150px` porque es el **50% del ancho de su padre**. Luego, toma el `10%` de `150px`, que son `15px`.

{% Aside 'key-term' %} La propiedad transformación le permite alterar la apariencia y la posición de un elemento al rotarlo, sesgarlo, escalarlo y traducirlo. Esto se puede hacer en un espacio 2D y 3D. {% endAside %}

## Dimensiones y longitudes

Si adjunta una unidad a un número, se convierte en una dimensión. Por ejemplo, `1rem` es una dimensión. En este contexto, la unidad que se adjunta a un número se denomina en las especificaciones como un símbolo de dimensión. Las longitudes son **dimensiones que se refieren a la distancia** y pueden ser absolutas o relativas.

### Longitudes absolutas

Todas las longitudes absolutas se resuelven contra la misma base, lo que las hace predecibles dondequiera que se utilicen en su CSS. Por ejemplo, si usa `cm` para dimensionar su elemento y luego imprime, debería ser exacto si lo compara con una regla.

```css
div {
  width: 10cm;
  height: 5cm;
  background: black;
}
```

Si imprimiera esta página, el `div` se imprimiría como un rectángulo negro de 10x5cm. Tenga en cuenta que CSS se utiliza no solo para contenido digital, sino también para diseñar contenido impreso. Las longitudes absolutas pueden resultar muy útiles a la hora de diseñar para imprimir.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Unidad</th>
        <th>Nombre</th>
        <th>Equivalente a</th>
      </tr>
    </thead>
  <tbody>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#cm">cm</a></td>
      <td>Centímetros</td>
      <td>1 cm = 96 px/2.54</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#mm">mm</a></td>
      <td>Milimetros</td>
      <td>1 mm = 1/10 de 1 cm</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#q">Q</a></td>
      <td>Cuarto de milímetro</td>
      <td>1Q = 1/40 de 1 cm</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#in">in</a></td>
      <td>Pulgadas</td>
      <td>1 in = 2.54 cm = 96 px</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#pc">pc</a></td>
      <td>Picas</td>
      <td>1pc = 1/6 de 1 in</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#pt">pt</a></td>
      <td>Puntos</td>
      <td>1 pt = 1/72 de 1 in</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#px">px</a></td>
      <td>Pixeles</td>
      <td>1 px = 1/96 de 1 in</td>
    </tr>
    </tbody>
  </table>
</div>

### Longitudes relativas

La longitud relativa se calcula contra un valor base, muy parecido a un porcentaje. La diferencia entre estos y los porcentajes es que puede dimensionar los elementos contextualmente. Esto significa que CSS tiene unidades como `ch` que usan el tamaño del texto como base y `vw` que se basa en el ancho de la ventana gráfica (la ventana de su navegador). Las longitudes relativas son particularmente útiles en la web debido a su naturaleza responsiva.

#### Unidades relativas al tamaño de fuente

CSS tiene unidades útiles que son relativas al tamaño de los elementos de la tipografía renderizada, como el tamaño del texto en sí (unidades `em`) o el ancho de los caracteres tipográficos (unidades `ch`).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>unidad</th>
        <th>relativo a:</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#em">em</a></td>
        <td>En relación con el tamaño de fuente, es decir, 1.5em será un 50% más grande que el tamaño de fuente calculado base de su padre. (Históricamente, la altura de la letra mayúscula "M").</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ex">ex</a></td>
        <td>Heurística para determinar si se debe usar la x-height,, una letra "x" o `.5em` en el tamaño de fuente calculado actual del elemento.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#cap">cap</a></td>
        <td>Altura de las letras mayúsculas en el tamaño de fuente calculado actual del elemento.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ch">ch</a></td>
        <td>
<a href="https://www.w3.org/TR/css-values-4/#length-advance-measure">Avance de carácter</a> promedio de un glifo estrecho en la fuente del elemento (representado por el glifo "0").</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ic">ic</a></td>
        <td>
<a href="https://www.w3.org/TR/css-values-4/#length-advance-measure">Avance de carácter</a> promedio de un glifo de ancho completo en la fuente del elemento, representado por el glifo "水" (ideograma de agua CJK, U + 6C34).</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#rem">rem</a></td>
        <td>Tamaño de fuente del elemento raíz (el valor predeterminado es 16px).</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#lh">lh</a></td>
        <td>Altura de línea del elemento.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#rlh">rlh</a></td>
        <td>Altura de línea del elemento raíz.</td>
      </tr>
    </tbody>
  </table>
</div>

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ttaikDgwEC572lrGgWlG.svg", alt="El texto CSS es 10x grande con etiquetas para altura ascendente, altura descendente y x-height. x-height representa 1ex y 0 representa 1ch" , width="800", height="203" %}</figure>

#### Unidades relativas a la ventana gráfica

Puede utilizar las dimensiones de la ventana gráfica (ventana del navegador) como una base relativa. Estas unidades reparten el espacio disponible de la ventana gráfica.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>unidad</th>
        <th>relativa a</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vw">vw</a></td>
        <td>1% del ancho de la ventana gráfica. Se usa esta unidad para hacer trucos de fuentes geniales, como cambiar el tamaño de una fuente de encabezado en función del ancho de la página, de modo que a medida que el usuario cambia el tamaño de la ventana, la fuente también cambia de tamaño.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vh">vh</a></td>
        <td>1% de la altura de la ventana gráfica. Puede usarla para organizar elementos en una interfaz de usuario, si tiene una barra de herramientas de pie de página, por ejemplo.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vi">vi</a></td>
        <td>1% del tamaño de la ventana gráfica en el <a href="https://www.w3.org/TR/css-writing-modes-4/#inline-axis">eje en línea</a> del elemento raíz. El eje se refiere a los modos de escritura. En los modos de escritura horizontal como el inglés, el eje en línea es horizontal. En los modos de escritura vertical como algunos tipos de letra japoneses, el eje en línea va de arriba a abajo.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vb">vb</a></td>
        <td>1% del tamaño de la ventana gráfica en el <a href="https://www.w3.org/TR/css-writing-modes-4/#block-axis">eje del bloque</a> del elemento raíz. Para el eje del bloque, esta sería la direccionalidad del lenguaje. Los idiomas LTR como el inglés tendrían un eje de bloque vertical, ya que los lectores en inglés analizan la página de arriba a abajo. Un modo de escritura vertical tiene un eje de bloque horizontal.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vmin">vmin</a></td>
        <td>1% de la dimensión más pequeña de la ventana gráfica.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vmax">vmax</a></td>
        <td>1% de la dimensión más grande de la ventana gráfica.</td>
      </tr>
    </tbody>
  </table>
</div>

```css
div {
  width: 10vw;
}

p {
  max-width: 60ch;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'JjEYqXa' } %}</figure>

En este ejemplo, el `div` será el 10% del ancho de la ventana gráfica, porque `1vw` es el **1% del ancho de la ventana gráfica**. El elemento `p` tiene un `max-width` de `60ch` que significa que no puede exceder el ancho de 60 caracteres "0" en la fuente y el tamaño calculados.

{% Aside 'objective' %}

Al dimensionar el texto con unidades relativas como `em` o `rem`, en lugar de una unidad absoluta, como `px`, el tamaño de su texto puede responder a las preferencias del usuario. Esto puede incluir el tamaño de fuente del sistema o el tamaño de fuente del elemento principal, como `<body>`. El tamaño base del `em` es el padre del elemento y el tamaño base del `rem` es el tamaño de fuente base del documento.

Si no define un `font-size` en su elemento `html`, este tamaño de fuente del sistema preferido por el usuario será respetado si usa longitudes relativas, como `em` y `rem`. Si usa unidades `px` para cambiar el tamaño del texto, esta preferencia se ignorará.

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/cUEl77VN4ZtAdElV4fd6.mp4", autoplay=true, controls=true, muted=true %}

{% endAside %}

## Unidades misceláneas

Hay algunas otras unidades que se han especificado para tratar tipos particulares de valores.

### Unidades angulares

En el [módulo de color](/learn/css/color/), analizamos las **unidades de ángulo**, que son útiles para definir valores de grados, como el tono en `hsl`. También son útiles para rotar elementos dentro de funciones de transformación.

```css
div {
  width: 150px;
  height: 150px;
  transform: rotate(60deg);
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'VwPvRbK', tab: 'css,result' } %}</figure>

Usando launidad de ángulo `deg`, puede rotar un `div` 90 ° en su eje central.

```css
div {
  background-image: url('a-low-resolution-image.jpg');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  div {
    background-image: url('a-high-resolution-image.jpg');
  }
}
```

{% Aside %} Otros unidades de ángulo incluyen `rad` (radianes), `grad` (grados centesimales), y unidades `turn`, que representan una parte de un ángulo, donde `1turn` = `360deg`, y `0.5turn` = `180deg`. {% endAside %}

#### Unidades de resolución

En el ejemplo anterior, el valor de `min-resolution` es `192dpi`. La unidad `dpi` significa **puntos por pulgada**. Un contexto útil para esto es detectar pantallas de muy alta resolución, como pantallas Retina, en una consulta de medios y mostrar una imagen de mayor resolución.

{% Assessment 'sizing' %}

## Recursos

- [Unidades y valores de especificación CSS Nivel 4](https://www.w3.org/TR/css-values-4)
- [Dimensionamiento y unidades en MDN](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Values_and_units)
- [Todo sobre Ems](https://learn.scannerlicker.net/2014/07/31/so-how-much-is-an-em/)
- [Un explicador de porcentajes](https://wattenberger.com/blog/css-percents)
