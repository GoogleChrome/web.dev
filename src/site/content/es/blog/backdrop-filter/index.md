---
layout: post
title: Cree fondos al estilo del sistema operativo con los filtros de fondo
subhead: Difuminado y cambio de color detrás de un elemento
date: 2019-07-26
updated: 2019-08-29
authors:
  - adamargyle
  - joemedley
hero: image/admin/ltK4SNRultTnkbimOySm.jpg
alt: Una vista a través de una ventana neblinosa cubierta por la lluvia.
description: Aprenda a agregar efectos de fondo como desenfoque y transparencia a los elementos de la interfaz de usuario en la web mediante la propiedad de filtro de fondo de CSS.
tags:
  - blog
  - css
feedback:
  - api
---

La translucidez, el desenfoque y otros efectos son formas útiles de crear profundidad mientras se mantiene el contexto del contenido de fondo. Admiten una gran cantidad de casos de uso, como vidrio esmerilado, superposiciones de video, encabezados de navegación translúcidos, censura de imágenes inapropiadas, carga de imágenes, etc. Puede reconocer estos efectos en dos sistemas operativos populares: [Windows 10](https://i.kinja-img.com/gawker-media/image/upload/s--9RLXARU4--/c_scale,dpr_2.0,f_auto,fl_progressive,q_80,w_800/trgz8yivyyqrpcnwscu5.png) e [iOS](https://static.businessinsider.com/image/51fd2822eab8eae16e00000b-750.jpg).

<figure>{% Img src="image/admin/mEc6bdwB2ZX6VSXvyJEn.jpg", alt="Un ejemplo de efecto de vidrio esmerilado", width="400", height="300" %} <figcaption>Un ejemplo de efecto de vidrio esmerilado. <a href="https://dribbble.com/shots/733714-Weather-App?list=tags&amp;tag=android" target="_blank" rel="noopener noreferrer">Fuente</a>.</figcaption></figure>

Históricamente, estas técnicas eran difíciles de implementar en la web, además requerían [trucos o soluciones](https://stackoverflow.com/questions/38145368/css-workaround-to-backdrop-filter) menos que perfectos. En los últimos años, tanto [Safari](https://webkit.org/blog/3632/introducing-backdrop-filters/) como Edge han proporcionado estas capacidades mediante la propiedad `background-filter` (y alternativamente, mediante la propiedad `-webkit-backdrop-filter`), que combina dinámicamente los colores de primer plano y de fondo según las funciones de filtro. Ahora Chrome admite `background-filter` a partir de la versión 76.

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>Una demostración de las funciones de filtro para <code>backdrop-filter</code>. Pruebe el ejemplo en <a href="https://codepen.io/robinrendle/pen/LmzLEL" target="_blank" rel="noopener">CodePen</a>.</figcaption></figure>

## Aspectos básicos

- La propiedad `backdrop-filter` aplica uno o más filtros a un elemento, para cambiar la apariencia de cualquier cosa detrás del elemento.
- El elemento de superposición debe ser al menos parcialmente transparente.
- El elemento superpuesto obtendrá un nuevo contexto de apilamiento.

{% Aside 'caution' %} La propiedad `backdrop-filter` puede afectar al rendimiento. Pruébela antes de implementarla. {% endAside %}

La propiedad `backdrop-filter` de CSS aplica uno o más efectos a un elemento que es translúcido o transparente. Para entender eso, considere las imágenes a continuación.

<div class="switcher">{% Compare 'worse', 'No foreground transparency' %} {% Img src="image/admin/LOqxvB3qqVkbZBmxMmKS.png", alt="Un triángulo superpuesto a un círculo. El círculo no se puede ver a través del triángulo.", width="480", height="283 " %}</div>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.frosty-glass-pane {
  backdrop-filter: blur(2px);
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'Foreground transparency' %} {% Img src="image/admin/VbyjpS6Td39E4FudeiVg.png", alt="Un triángulo superpuesto a un círculo. El triángulo es traslúcido, lo que permite ver el círculo a través de él.", width="480", height="283" %}</p>
<pre data-md-type="block_code" data-md-language="css/1"><code class="language-css/1">.frosty-glass-pane {
  opacity: .9;
  backdrop-filter: blur(2px);
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

La imagen de la izquierda muestra cómo se renderizarían los elementos superpuestos si no se utilizara o admitiera `backdrop-filter`. La imagen de la derecha aplica un efecto de desenfoque mediante `backdrop-filter`. Tenga en cuenta que utiliza `opacity` además de `backdrop-filter`. Sin `opacity`, no habría nada a lo que aplicar el desenfoque. Casi no hace falta decir que si `opacity` se establece en `1` (totalmente opaco) no habrá ningún efecto en el fondo.

La propiedad `backdrop-filter` es similar a los [filtros](https://developer.mozilla.org/docs/Web/CSS/filter) de CSS en el sentido de que admite todas sus [funciones de filtro](https://developer.mozilla.org/docs/Web/CSS/filter#Filter_functions) favoritas: `blur()`, `brightness()`, `contrast()`, `opacity()`, `drop-shadow()`, etc. También es compatible con la función `url()` si desea utilizar una imagen externa como el filtro, así como también las palabras clave `none`, `inherit`, `initial` y `unset`. Se ofrecen explicaciones para todo esto en [MDN](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter), incluidas las descripciones de sintaxis, filtros y valores.

Cuando `backdrop-filter` se establece en cualquier otro valor distinto a `none`, el navegador crea un nuevo [contexto de apilamiento](https://www.w3.org/TR/CSS21/zindex.html). También se puede crear un [bloque contenedor](https://developer.mozilla.org/docs/Web/CSS/Containing_block), pero solo si el elemento tiene descendientes de posición absoluta y fija.

Puede combinar filtros para obtener efectos enriquecidos e inteligentes, o usar solo un filtro para obtener efectos más sutiles o precisos. Incluso puede combinarlos con [filtros SVG](https://developer.mozilla.org/docs/Web/SVG/Element/filter).

## Detección de funciones y plan B

Al igual que con muchas funciones de la web moderna, querrá saber si el navegador del usuario admite `backdrop-filter` antes de usarlo. Hágalo con `@supports()`. Por motivos de rendimiento, recurra a una imagen en lugar de un polyfill cuando `backdrop-filter` no sea compatible. El siguiente ejemplo lo ilustra.

```css
@supports (backdrop-filter: none) {
	.background {
		backdrop-filter: blur(10px);
	}
}

@supports not (backdrop-filter: none) {
  .background {
    background-image: blurred-hero.png;
  }
}
```

## Ejemplos

Las técnicas y estilos de diseño que antes estaban reservados para los sistemas operativos ahora son eficaces y alcanzables con una sola declaración CSS. Veamos algunos ejemplos.

### Filtro único

En el siguiente ejemplo, el efecto escarchado se logra al combinar color y desenfoque. `backdrop-filter` proporciona el desenfoque, mientras que el color proviene del color de fondo semitransparente del elemento.

```css
.blur-behind-me {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(.5rem);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>Pruebe este ejemplo usted mismo en <a href="https://codepen.io/netsi1964/pen/JqBLPK" target="_blank" rel="noopener">CodePen</a>.</figcaption></figure>

### Varios filtros

A veces, necesitará varios filtros para lograr el efecto deseado. Para hacer esto, proporcione una lista de filtros separados por un espacio. Por ejemplo:

```css
.brighten-saturate-and-blur-behind-me {
  backdrop-filter: brightness(150%) saturate(150%) blur(1rem);
}
```

En el siguiente ejemplo, cada uno de los cuatro paneles tiene una combinación diferente de filtros de fondo, mientras que detrás de ellos se anima el mismo conjunto de formas.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-ambient_blur2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-ambient_blur2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>Pruebe este ejemplo usted mismo en <a href="https://codepen.io/pepf/pen/GqZkdj" target="_blank" rel="noopener">CodePen</a>.</figcaption></figure>

### Superposiciones

Este ejemplo muestra cómo desenfocar un fondo semitransparente para que el texto sea legible mientras se combina estilísticamente con el fondo de una página.

```css
.modal {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>Pruebe este <a href="https://mfreed7.github.io/backdrop-filter-feature/examples/scrollable.html" target="_blank" rel="noopener">ejemplo</a> usted mismo.</figcaption></figure>

### Contraste de texto sobre fondos dinámicos

Como se indicó anteriormente, `backdrop-filter` permite efectos de rendimiento que serían difíciles o imposibles en la web. Un ejemplo de esto es cambiar un fondo en respuesta a una animación. En este ejemplo, `backdrop-filter` mantiene el alto contraste entre el texto y su fondo a pesar de lo que sucede detrás del texto. Comienza con el color de fondo predeterminado `darkslategray` y usa `backdrop-filter` para invertir los colores después de la transformación.

```css
.container::before {
  z-index: 1;
  background-color: darkslategray;
  filter: invert(1);
}

.container::after {
	backdrop-filter: invert(1);
  z-index: 3;
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>Pruebe este ejemplo de <a href="https://www.chenhuijing.com/#%F0%9F%91%9F">Chen Hui Jing</a> en <a href="https://tympanus.net/codrops-playground/huijing/Qqpwg5Iy/editor" target="_blank" rel="noopener">Codrops</a>.</figcaption></figure>

## Conclusión

Más de 560 de ustedes votaron a favor del [error de Chromium](https://crbug.com/497522) en los últimos años, lo que marca claramente esto como una característica CSS largamente esperada. El lanzamiento de `backdrop-filter` en la versión 76 de Chrome acerca a la web a una presentación de interfaz de usuario verdaderamente similar a la de un sistema operativo.

### Recursos adicionales

- [Especificación](https://drafts.fxtf.org/filter-effects-2/#BackdropFilterProperty)
- [Estado de la plataforma Chrome](https://www.chromestatus.com/feature/5679432723333120)
- [MDN](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter)
- [`background-filter` en CSS Tricks](https://css-tricks.com/the-backdrop-filter-css-property/)
- [Muestras en Codepen](https://codepen.io/tag/backdrop-filter/#)
