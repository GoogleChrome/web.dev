---
layout: post
title: CSS `accent-color`
subhead: Lleve el color de su marca a las entradas de formulario integradas en HTML con una línea de código.
authors:
  - adamargyle
  - jarhar
description: Lleve el color de su marca a las entradas de formulario integradas en HTML con una línea de código.
date: 2021-08-11
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WOcuCLCwMr0M2lF17bmm.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/huEpiCoJQ6dAo8rHGsZT.png
tags:
  - blog
  - css
---

Los elementos de formulario HTML actuales son [difíciles de personalizar](https://codepen.io/GeoffreyCrofte/pen/BiHzp). Se siente como si fuera una elección entre pocos o ningún estilo personalizado, o restablecer los estilos de entrada y construirlos desde cero, lo cual implica mucho más trabajo del previsto. También puede provocar el olvido de estilos para elementos de estado ([indeterminado](https://developer.mozilla.org/docs/Web/CSS/:indeterminate), te estoy viendo) y la pérdida de funciones de accesibilidad integradas. Recrear por completo lo que proporciona el navegador, puede ser más trabajo del que está buscando.

```css
accent-color: hotpink;
```

La propiedad CSS `accent-color` de la [especificación de la interfaz de usuario de CSS](https://www.w3.org/TR/css-ui-4/#widget-accent) está aquí para teñir elementos con una línea de CSS, lo que le ahorra esfuerzos de personalización al proporcionar una forma de llevar su marca a los elementos.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CfSS3F1XUsfCHIB86xeE.png", alt="Una captura de pantalla de una demostración de color de acento en tema claro, donde la casilla de verificación, los botones de radio, el control deslizante de rango y la barra de progreso están teñidos de color hot-pink (rosa vívido).", width="800", height="548" %} <figcaption> <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Damostración</a> </figcaption></figure>

La propiedad `accent-color` también funciona con [`color-scheme`](/color-scheme/), lo que permite a los autores teñir tanto los elementos claros como los oscuros. En el siguiente ejemplo, el usuario tiene un tema oscuro activo, la página usa `color-scheme: light dark`, y usa el mismo `accent-color: hotpink` para controles teñidos de hotpink con temas oscuros.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3gxeeZoSLY34tsMxkyt9.png", alt="Una captura de pantalla de una demostración de color de acento con tema oscuro, donde la casilla de verificación, los botones de radio, el control deslizante de rango y la barra de progreso están teñidos de hot-pink (rosa vívido).", width="800", height="548" %} <figcaption><a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demostración</a></figcaption></figure>

### Compatibilidad del navegador

En el momento de escribir estas líneas, Chromium 93+ y Firefox 92+ admiten `accent-color`.

## Elementos compatibles

Actualmente, solo cuatro elementos se pueden teñir a través de la propiedad `accent-color`: [casilla de verificación](#checkbox), [radio](#radio), [rango](#range) y [progreso](#progress). Cada uno se puede previsualizar aquí [https://accent-color.glitch.me](https://accent-color.glitch.me) en esquemas de colores claros y oscuros.

{% Aside "warning" %} Si los siguientes elementos de demostración son todos del mismo color, entonces su navegador aún no admite `accent-color`. {% endAside %}

### Casilla de verificación

{% Codepen {user: 'web-dot-dev', id: 'dyWjGqZ'}%}

### Radio

{% Codepen {user: 'web-dot-dev', id: 'WNjKrgB'}%}

### Rango

{% Codepen {user: 'web-dot-dev', id: 'yLbqeRy'}%}

### Progreso

{% Codepen {user: 'web-dot-dev', id: 'rNmrxqL'}%}

## Garantizando el contraste

Para evitar que existan elementos inaccesibles, los navegadores con `accent-color` deben determinar un [color de contraste elegible](https://webaim.org/articles/contrast/) para usar junto con el acento personalizado. A continuación se muestra una captura de pantalla que demuestra cómo Chrome 94 (izquierda) y Firefox 92 Nightly (derecha) difieren en sus algoritmos:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DJhB56n10Eh8O29RsRdE.png", alt="Una captura de pantalla de Firefox y Chromium uno al lado del otro, que muestra un espectro completo de casillas de verificación en varios tonos y sombras.", width="800", height="832" %}

Lo más importante que hay que sacar de esto es **confiar en el navegador**. Proporcione un color de marca y confíe en que tomará decisiones inteligentes por usted.

{% Aside %} El navegador no cambiará tu color en un tema oscuro. {% endAside %}

## Extra: más tinte

Quizás se esté preguntando cómo teñir más de estos cuatro elementos de forma. Aquí hay un entorno de pruebas mínimo que tiñe:

- el anillo de enfoque
- resaltado de la selección de texto
- [marcadores](/css-marker-pseudo-element/) de lista
- indicadores de flecha (solo Webkit)
- pulgar de la barra de desplazamiento (solo Firefox)

```css
html {
  --brand: hotpink;
  scrollbar-color: hotpink Canvas;
}

:root { accent-color: var(--brand); }
:focus-visible { outline-color: var(--brand); }
::selection { background-color: var(--brand); }
::marker { color: var(--brand); }

:is(
  ::-webkit-calendar-picker-indicator,
  ::-webkit-clear-button,
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button
) {
  color: var(--brand);
}
```

{% Codepen {user: 'web-dot-dev', id: 'RwVBreJ'}%}

### Futuro potencial

La especificación no limita la aplicación de `accent-color` a los cuatro elementos que se muestran en este artículo, más adelante se podrían agregar más elementos compatibles. Los elementos como `<option>` en `<select>` podrían resaltarse con el `accent-color`.

¿Qué más le gusta teñir en la web? ¡Envíe un tweet a [@argyleink](https://twitter.com/argyleink) con su selector y es posible que se agregue a este artículo!
