---
layout: post
title: Construyendo un componente de configuración
subhead: Una descripción fundamental de cómo crear un componente de configuración de controles deslizantes y casillas de verificación.
authors:
  - adamargyle
description: Una descripción fundamental de cómo crear un componente de configuración de controles deslizantes y casillas de verificación.
date: 2021-03-17
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/SUaxDTgOYvv2JXxaErBP.png
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zkv1FlI6dn82rJ104yBV.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

En esta publicación, quiero compartir mi forma de pensar cuando creo un componente de configuración para que la web sea responsiva, admita múltiples entradas de dispositivo y funcione en todos los navegadores. Prueba esto en esta [demostración](https://gui-challenges.web.app/settings/dist/).

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/WuIwd9jPb30KmmnjJn75.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> <a href="https://gui-challenges.web.app/settings/dist/">Demostración</a> </figcaption></figure>

Si prefieres ver un video o deseas una vista previa del UI/UX de lo que estamos creando, aquí hay un tutorial más corto en YouTube:

{% YouTube 'dm7gnp6eh3Q' %}

## Descripción general

He dividido los aspectos de este componente en las siguientes secciones:

1. [Diseños](#layouts)
2. [Color](#color)
3. [Entrada de rango personalizado](#custom-range)
4. [Entrada de casilla de verificación personalizada](#custom-checkbox)
5. [Consideraciones de accesibilidad](#accessibility)
6. [JavaScript](#javascript)

{% Aside 'gotchas' %} Los siguientes fragmentos de CSS asumen PostCSS con [PostCSS Preset Env](https://preset-env.cssdb.org/features). La intención es practicar de manera temprana y a menudo con la sintaxis en los primeros borradores o en todos los buscadores que se encuentre disponible de manera experimental. O como les gusta decir a los complementos, "Usa hoy el CSS del mañana". {% endAside %}

## Diseños

¡Esta es la primera demostración de GUI Challenge en ser **completamente un CSS Grid**! Aquí está cada cuadrícula resaltada con [Chrome DevTools for grid](https://goo.gle/devtools-grid):

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/h6LZhScslprBcFol4gGp.png", alt="Contornos coloridos y superposiciones de espacios que ayudan a mostrar todos los cuadros que componen el diseño de configuración", width="800", height="563" %}

{% Aside %} Para resaltar tus diseños de cuadrícula:

1. Abre Chrome DevTools usando `cmd+opt+i` o `ctrl+alt+i`.
2. Selecciona la pestaña de Diseño junto a la pestaña de Estilos.
3. En la sección de Cuadrícula, marca todos los diseños.
4. Cambia los colores de todos los diseños. {% endAside %}

### Solo por espacio

El diseño más común:

```css
foo {
  display: grid;
  gap: var(--something);
}
```

A este diseño le llamo "solo por espacio" porque solo usa la cuadrícula para agregar espacios entre bloques.

Cinco diseños usan esta estrategia, aquí se muestran todos:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zYWSVLzdtrh1K8p8yUuA.png", alt="Diseños de cuadrícula verticales resaltados con contornos y rellenados con espacios", width="800", height="568" %}

El elemento de `fieldset`, que contiene cada grupo de entrada (`.fieldset-item`), usa `gap: 1px` para crear los bordes finos entre los elementos. ¡No es una solución de borde complicada!

<div class="switcher">
{% Compare 'better', 'Filled gap' %}

```css
.grid {
  display: grid;
  gap: 1px;
  background: var(--bg-surface-1);

  & > .fieldset-item {
    background: var(--bg-surface-2);
  }
}
```

{% endCompare %}

{% Compare 'worse', 'Border trick' %}

```css
.grid {
  display: grid;

  & > .fieldset-item {
    background: var(--bg-surface-2);

    &:not(:last-child) {
      border-bottom: 1px solid var(--bg-surface-1);
    }
  }
}
```
{% endCompare %}
</div>

### Envoltura de cuadricula natural

El diseño más complejo terminó siendo el diseño de macros, el sistema de diseño lógico entre `<main>` y `<form>`.

#### Centrando del contenido de envoltura

Tanto la flexbox como la cuadrícula brindan habilidades a `align-items` o `align-content`, y cuando se trata de elementos de envoltura, las alineaciones de diseño de `content` distribuirán el espacio entre los elementos secundarios como un grupo.

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
}
```

El elemento principal está usando `place-content: center` [método abreviado de alineación](https://developer.mozilla.org/docs/Web/CSS/place-content) para que los elementos secundarios estén centrados vertical y horizontalmente en diseños de una y dos columnas.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IQI2PofA6gpNFUkDrvKo.mp4", autoplay="true", loop="true", muted="true" %}

Mira el video anterior para apreciar cómo el "contenido" permanece centrado, a pesar de que se ha producido el ajuste.

#### Repeat auto-fit minmax

El `<form>` utiliza un diseño de cuadrícula adaptable para cada sección. Este diseño cambia de una a dos columnas según el espacio disponible.

```css
form {
  display: grid;
  gap: var(--space-xl) var(--space-xxl);
  grid-template-columns: repeat(auto-fit, minmax(min(10ch, 100%), 35ch));
  align-items: flex-start;
  max-width: 89vw;
}
```

Esta cuadrícula tiene un valor diferente para `row-gap` (--space-xl) y `column-gap` (--space-xxl) para poner ese toque personalizado en el diseño responsivo. Cuando las columnas se apilan, queremos un espacio grande, pero no tan grande como si estuviéramos en una pantalla ancha.

La `grid-template-columns` utiliza 3 funciones CSS: `repeat()`, `minmax()` y `min()`. [Una Kravets](#) tiene una [excelente publicación de blog de diseño](/one-line-layouts/) sobre esto, llamándolo [RAM](/one-line-layouts/#07-ram-repeat,-auto,-minmax-grid-template-columnsauto-fit,-minmaxlessbasegreater,-1fr).

Hay 3 adiciones especiales en nuestro diseño, si lo comparas con el de Una:

- Pasamos una función extra de `min()`.
- Especificamos `align-items: flex-start`.
- Hay un estilo de `max-width: 89vw`.

La función extra de `min()` está bien descrita por Evan Minto en su blog en la publicación [Intrinsically Responsive CSS Grid with minmax() y min() (Cuadricula CSS intrínsecamente responsiva con minmax() y min())](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min/). Recomiendo leer esa entrada. La alineación de `flex-start` es para eliminar el efecto de estiramiento predeterminado, de modo que los elementos secundarios de este diseño no necesiten tener alturas iguales, pueden tener alturas naturales e intrínsecas. El video de YouTube tiene un desglose rápido de esta adición de alineación.

Es importante darle un pequeño desglose a `max-width: 89vw` en esta publicación. Déjame mostrarte el diseño con y sin el estilo aplicado:

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/gdldf7hyaBrHWwxQbSaT.mp4", autoplay="true", loop="true", muted="true" %}

¿Qué está sucediendo? Cuando `max-width` es especificado, proporciona contexto, tamaño explícito o [tamaño definido](https://drafts.csswg.org/css-sizing-3/#definite) para que el [algoritmo de diseño de `auto-fit`](https://drafts.csswg.org/css-grid/#auto-repeat) sepa cuántas repeticiones puede caber en el espacio. Si bien parece obvio que el espacio es de "ancho completo", según la especificación de la cuadrícula CSS, se debe proporcionar un tamaño definido o un tamaño máximo. He proporcionado un tamaño máximo.

Entonces, ¿por qué `89vw`? Porque "funcionó" para mi diseño. Un par de personas de Chrome y yo estamos investigando por qué un valor más razonable, como `100vw`, no es suficiente y si esto se trata de un error.

### Espaciado

La mayor parte de la armonía de este diseño proviene de una paleta de espaciado limitada, 7 espacios para ser exactos.

```css
:root {
  --space-xxs: .25rem;
  --space-xs:  .5rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-xxl: 6rem;
}
```

El uso de estos flujos es realmente agradable con grid, [CSS @nest](https://drafts.csswg.org/css-nesting-1/) y [level 5 syntax of @media (sintaxis de nivel 5 de @media)](https://drafts.csswg.org/mediaqueries-5/). Aquí hay un ejemplo, el conjunto de estilos de diseño del `<main>`.

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
  padding: var(--space-sm);

  @media (width >= 540px) {
    & {
      padding: var(--space-lg);
    }
  }

  @media (width >= 800px) {
    & {
      padding: var(--space-xl);
    }
  }
}
```

Una cuadrícula con contenido centrado, moderadamente acolchado (padded) por defecto (como es en los dispositivos móviles). Pero a medida que se dispone de más espacio en la ventana gráfica, se extiende aumentando el relleno. ¡CSS en el 2021 luce bastante bien!

¿Recuerda el diseño anterior, "solo por espacio"? Aquí hay una versión más completa de cómo se ven en este componente:

```css
header {
  display: grid;
  gap: var(--space-xxs);
}

section {
  display: grid;
  gap: var(--space-md);
}
```

## Color

Un uso controlado del color ayudó a que este diseño se destacara como expresivo pero minimalista. Lo hago de la siguiente manera:

```css
:root {
  --surface1: lch(10 0 0);
  --surface2: lch(15 0 0);
  --surface3: lch(20 0 0);
  --surface4: lch(25 0 0);

  --text1: lch(95 0 0);
  --text2: lch(75 0 0);
}
```

{% Aside 'key-term' %} El [complemento PostCSS de `lab()` y `lch()`](https://github.com/csstools/postcss-lab-function) es parte de [PostCSS Preset Env](https://preset-env.cssdb.org/features#lch-function) y genera colores `rgb()`. {% endAside %}

Nombro a mi superficie (surface) y colores del texto con números en lugar de nombres como `surface-dark` y `surface-darker` porque en una consulta de medios, los cambiaré y claro y oscuro no tendrán sentido.

Los intercambio en una consulta de medios de preferencia como la siguiente:

```css
:root {
  ...

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --surface2: lch(100 0 0);
      --surface3: lch(98 0 0);
      --surface4: lch(85 0 0);

      --text1: lch(20 0 0);
      --text2: lch(40 0 0);
    }
  }
}
```

{% Aside 'key-term' %} El [complemento PostCSS `@nest`](https://github.com/csstools/postcss-nesting) es parte de [PostCSS Preset Env](https://preset-env.cssdb.org/features) y expandirá los selectores a una sintaxis compatible con los navegadores actuales. {% endAside %}

Es importante echarle un vistazo rápido a la imagen y a las estrategias generales antes de sumergirnos en los detalles de la sintaxis del color. Pero, como me adelanté un poco, permíteme retroceder.

### ¿LCH?

Sin profundizar demasiado en la teoría del color, LCH es una sintaxis orientada a los humanos, que se adapta a cómo percibimos el color, no a cómo medimos el color con matemáticas (por ejemplo, usando el 255). Esto le da una clara ventaja, ya que los humanos pueden escribirlo más fácilmente y otros humanos estarán en sintonía con estos ajustes.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/160dWLSrMhFISwWMVd4w.png", alt="Una captura de pantalla de la página web pod.link/csspodcast, con el Color 2: Perception episode pulled up", width="800", height="329" %}<figcaption> Aprende sobre el color perceptual (¡y más!) En el <a href="https://pod.link/thecsspodcast">CSS Podcast</a></figcaption></figure>

Por hoy, en esta demostración, centrémonos en la sintaxis y los valores que estoy cambiando para hacer claro y oscuro. Veamos 1 superficie y 1 color de texto:

```css
:root {
  --surface1: lch(10 0 0);
  --text1:    lch(95 0 0);

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --text1:    lch(40 0 0);
    }
  }
}
```

`--surface1: lch(10 0 0)` se traduce en un `10%` de luminosidad, 0 croma y 0 matiz: un gris incoloro muy oscuro. Luego, en la consulta de medios para el modo claro, la luminosidad se cambia al `90%` con `--surface1: lch(90 0 0);`. Y esa es la esencia de la estrategia. Comienza cambiando la luminosidad entre los 2 temas, manteniendo las relaciones de contraste que requiere el diseño o lo que puede mantener la accesibilidad.

La ventaja de `lch()` es que la claridad está orientada al ser humano y podemos sentirnos bien con un `%` de cambio, que será perceptual y consistentemente ese `%` será diferente. `hsl()` por ejemplo, [no es tan confiable](https://twitter.com/argyleink/status/1201908189257555968).

Hay [más para aprender](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/) sobre los espacios de color y `lch()` si estás interesado. ¡Se está aproximando!

{% Blockquote 'Lea Verou' %} CSS en este momento **no puede acceder a estos colores en lo absoluto**. Permítanme repetirlo: **no tenemos acceso a un tercio de los colores en la mayoría de los monitores modernos.** Y estos no son solo algunos colores, sino los **colores más vivos que puede mostrar la pantalla**. Nuestros sitios web se han desvanecido porque el hardware del monitor evolucionó más rápido que las especificaciones CSS y las implementaciones del navegador. {% endBlockquote %}

### Controles de formularios adaptables con color-scheme

Muchos navegadores incluyen controles de temas oscuros, actualmente Safari y Chromium lo hacen, pero debes especificar en el CSS o HTML que tu diseño los usa.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/0VVtEAWM6jHeIxahqnFy.mp4", autoplay="true", loop="true", muted="true" %}

Lo anterior demuestra el efecto de la propiedad del panel Estilos de DevTools. La demostración usa la etiqueta HTML, que en mi opinión es generalmente una mejor ubicación:

```html
<meta name="color-scheme" content="dark light">
```

Aprende todo al respecto en este [artículo sobre `color-scheme`](/color-scheme/) de [Thomas Steiner](/authors/thomassteiner/). ¡Hay mucho más que ganar que las entradas de las casillas oscuras  de verificación!

### `accent-color` de CSS

Ha habido [una actividad reciente](https://twitter.com/argyleink/status/1360022120810483715?s=20) en torno a `accent-color` en los elementos de formulario, siendo un estilo CSS único que puede cambiar el color de tinte utilizado en el elemento de entrada de los navegadores. Lee más sobre esto [aquí en GitHub](https://github.com/w3c/csswg-drafts/issues/5187). Lo he incluido en mis estilos para este componente. Como los navegadores lo permiten, mis casillas de verificación estarán más relacionadas con el tema mediante los colores rosa y morado.

```css
input[type="checkbox"] {
  accent-color: var(--brand);
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/J9pbhB0ImoDzbsXkBGtG.png", alt="Una captura de pantalla de Chromium en Linux con casillas de verificación rosas", width="800", height="406" %}

### Estallidos de color con degradados fijos y focus-within

El color resalta más cuando se usa con moderación y una de las formas en que me gusta lograrlo es a través de interacciones coloridas en la interfaz de usuario.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pm75QwVToKkiqedqPtmm.mp4", autoplay="true", loop="true", muted="true", width="480px" %}

Hay muchas capas de retroalimentación e interacción de la interfaz de usuario en el video anterior, que ayudan a dar personalidad a la interacción mediante lo siguiente:

- Destacando el contexto.
- Proporcionar información de la interfaz de usuario de "qué tan completo" está el valor en el rango.
- Proporcionar comentarios de la interfaz de usuario de que un campo está aceptando entradas.

Para proporcionar comentarios cuando se interactúa con un elemento, CSS utiliza la pseudo-clase de [`:focus-within`](https://developer.mozilla.org/docs/Web/CSS/:focus-within) para cambiar la apariencia de varios elementos, analicemos el `.fieldset-item`, es muy interesante:

```css
.fieldset-item {
  ...

  &:focus-within {
    background: var(--surface2);

    & svg {
      fill: white;
    }

    & picture {
      clip-path: circle(50%);
      background: var(--brand-bg-gradient) fixed;
    }
  }
}
```

Cuando uno de los elementos secundarios de este elemento tiene un focus-within:

1. Al `.fieldset-item` background se le asigna un color de superficie de mayor contraste.
2. El `svg` anidado se rellena de blanco para un mayor contraste.
3. El anidado `clip-path` en el `<picture>` se expande a un círculo completo y el fondo se rellena con el degradado fijo brillante.

## Rango personalizado

Dado el siguiente elemento de entrada HTML, te mostraré cómo personalicé su apariencia:

```html
<input type="range">
```

Hay 3 partes de este elemento que debemos personalizar:

1. [Elemento de rango / contenedor](#range-element-styles)
2. [Pista (track)](#track-styles)
3. [Pulgar (thumb)](#thumb-styles)

### Estilos de elementos de rango

```css
input[type="range"] {
  /* style setting variables */
  --track-height: .5ex;
  --track-fill: 0%;
  --thumb-size: 3ex;
  --thumb-offset: -1.25ex;
  --thumb-highlight-size: 0px;

  appearance: none;         /* limpia el estilo, me da espacio para el mio */
  display: block;
  inline-size: 100%;        /* llena el contenedor */
  margin: 1ex 0;            /* se asegura que el pulgar no entra en colisión con algún contenido secundario */
  background: transparent;  /* el fondo (background) esta en la pista */
  outline-offset: 5px;      /* los estilos enfocados tienen espacio */
}
```

Las primeras líneas de CSS son las partes personalizadas de los estilos y espero que al documentarlas claramente nos ayude. El resto de los estilos son en su mayoría estilos restablecidos, para proporcionar una base consistente para construir las partes complicadas del componente.

### Estilos de pista

```css
input[type="range"]::-webkit-slider-runnable-track {
  appearance: none; /* limpia el estilo, me da espacio para el mio */
  block-size: var(--track-height);
  border-radius: 5ex;
  background:
    /* gradiente de parada dura:
        - mitad transparente (donde lo colorido estará)
        - llenar la pista con color medio oscuro
        - la 1er imagen de fondo esta en arriba
    */
    linear-gradient(
      to right,
      transparent var(--track-fill),
      var(--surface1) 0%
    ),
    /* efecto colorido de llenado, superficie detrás de la pista llenada */
    var(--brand-bg-gradient) fixed;
}
```

El truco para esto es "revelar" el color vibrante de relleno. Esto se hace con el gradiente de hard stop en la parte superior. El degradado es transparente hasta el porcentaje de relleno y, a continuación, utiliza el color de la superficie de la pista sin rellenar. Detrás de esa superficie sin relleno, hay un color de ancho completo, esperando que la transparencia lo revele.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/aiAL28AkDRZvaAZNEbW8.mp4", autoplay="true", loop="true", muted="true" %}

#### Estilo de relleno de pista

Mi diseño **requiere JavaScript** para mantener el estilo de relleno. Hay estrategias solo de CSS, pero requieren que el elemento del pulgar tenga la misma altura que la pista, y no pude encontrar una armonía dentro de esos límites.

```js
/* toma los desplazadores de la página */
const sliders = document.querySelectorAll('input[type="range"]')

/* toma un elemento de desplazador, regresa un porcentaje como cadena para usar en CSS */
const rangeToPercent = slider => {
  const max = slider.getAttribute('max') || 10;
  const percent = slider.value / max * 100;

  return `${parseInt(percent)}%`;
};

/* al cargar la página, define la cantidad de llenado */
sliders.forEach(slider => {
  slider.style.setProperty('--track-fill', rangeToPercent(slider));

  /* cuando un desplazador cambia, actualiza el prop de llenado */
  slider.addEventListener('input', e => {
    e.target.style.setProperty('--track-fill', rangeToPercent(e.target));
  })
})
```

Creo que esto lo convierte en una buena mejora visual. El control deslizante funciona muy bien sin JavaScript, el prop de `--track-fill` no es necesario, simplemente no tendrá un estilo de relleno si no está presente. Si JavaScript está disponible, completa la propiedad personalizada mientras observas los cambios del usuario, sincronizando la propiedad personalizada con el valor.

[Aquí hay una gran publicación](https://css-tricks.com/sliding-nightmare-understanding-range-input/) sobre [CSS-Tricks](https://css-tricks.com/) de [Ana Tudor](https://twitter.com/anatudor), que demuestra una solución única de CSS para el relleno de pistas. También encontré este [elemento de `range`](https://app.native-elements.dev/editor/elements/range) muy inspirador.

### Estilos de pulgar

```css
input[type="range"]::-webkit-slider-thumb {
  appearance: none; /* limpia el estilo, me da espacio para el mio */
  cursor: ew-resize; /* estilo del cursor para admitir la dirección de arrastre */
  border: 3px solid var(--surface3);
  block-size: var(--thumb-size);
  inline-size: var(--thumb-size);
  margin-top: var(--thumb-offset);
  border-radius: 50%;
  background: var(--brand-bg-gradient) fixed;
}
```

La mayoría de estos estilos son para hacer un bonito círculo. De nuevo, verás el degradado de fondo fijo que unifica los colores dinámicos de los pulgares, las pistas y los elementos SVG asociados. Separé los estilos de la interacción para ayudar a aislar la técnica de `box-shadow` que se usa para el resaltado de desplazamiento:

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);

::-webkit-slider-thumb {
  …

  /* shadow spread es inicialmente un 0 */
  box-shadow: 0 0 0 var(--thumb-highlight-size) var(--thumb-highlight-color);

  /* si el movimiento es permitido, haz una transición del cambio de box-shadow*/
  @media (--motionOK) {
    & {
      transition: box-shadow .1s ease;
    }
  }

  /* en el estado de on hover/active del elemento primario, incrementa el tamaño del prop */
  @nest input[type="range"]:is(:hover,:active) & {
    --thumb-highlight-size: 10px;
  }
}
```

{% Aside 'key-term' %} [@custom-media](https://drafts.csswg.org/mediaqueries-5/#custom-mq) es una adición de especificación de nivel 5 de [PostCSS Custom Media](https://github.com/postcss/postcss-custom-media), que forma parte de [PostCSS Preset Env](https://preset-env.cssdb.org/features). {% endAside %}

El objetivo era un destacado visual animado y fácil de manejar para los comentarios de los usuarios. Al usar una box shadow (sombra de la caja), puedo evitar [activar el diseño](/animations-guide/#triggers) con el efecto. Hago esto creando una sombra que no esté borrosa y coincida con la forma circular del elemento del pulgar. Luego cambio y hago la transición de su tamaño de propagación al pasar el mouse.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/s835RbH88L5bxjl5bMFl.mp4", autoplay="true", loop="true", muted="true" %}

Si tan solo el efecto de resaltado fuera tan fácil en las casillas de verificación…

### Selectores entre navegadores

Descubrí que necesitaba estos `-webkit-` y `-moz-` para lograr consistencia entre navegadores:

```css
input[type="range"] {
  &::-webkit-slider-runnable-track {}
  &::-moz-range-track {}
  &::-webkit-slider-thumb {}
  &::-moz-range-thumb {}
}
```

{% Aside 'gotchas' %} [Josh Comeau](https://twitter.com/JoshWComeau) describe por qué los ejemplos anteriores no usan simplemente una coma entre los selectores para el estilo de varios navegadores; consulta el [hilo de Twitter](https://twitter.com/JoshWComeau/status/1359213591602335752?s=20) para obtener más información. {% endAside %}

## Casilla de verificación personalizada

Dado el siguiente elemento de entrada HTML, te mostraré cómo personalizar su apariencia:

```html
<input type="checkbox">
```

Hay 3 partes de este elemento que debemos personalizar:

1. [Elemento de casilla de verificación](#checkbox-element)
2. [Etiquetas asociadas](#checkbox-labels)
3. [Efecto de resaltado](#checkbox-highlight)

### Elemento de casilla de verificación

```css
input[type="checkbox"] {
  inline-size: var(--space-sm);   /* incrementa el ancho */
  block-size: var(--space-sm);    /* incrementa el tamaño */
  outline-offset: 5px;            /* mejora de focus style */
  accent-color: var(--brand);     /* marca con un color la entrada */
  position: relative;             /* preparación para un pseudo elemento */
  transform-style: preserve-3d;   /* crea un contexto de apilamiento de espacio 3d con eje z */
  margin: 0;
  cursor: pointer;
}
```

Los estilos de `transform-style` y de `position` se preparan para el pseudoelemento que presentaremos más adelante para diseñar el resaltado. De lo contrario, es algo menos significante en el estilo basandome en mi opinión. Me gusta que el cursor sea un puntero, me gustan las outline offsets, las casillas de verificación predeterminadas son demasiado pequeñas y, si se [permite](https://drafts.csswg.org/css-ui-4/#widget-accent) el `accent-color`, lleva estas casillas de verificación al esquema de color de la marca (brand color scheme).

### Etiquetas de las casillas de verificación

Es importante proporcionar etiquetas para las casillas de verificación por 2 razones. La primera es representar para qué se usa el valor de la casilla de verificación, para responder "¿encendido o apagado o para qué?" En segundo lugar es para el UX, los usuarios de la web se han acostumbrado a interactuar con las casillas de verificación a través de sus etiquetas asociadas.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/7GYIFNjNCBdj13juFO7S.mp4", autoplay="true", loop="true", muted="true" %}

<div class="switcher">{% Compare 'better', 'input' %}</div>
<pre data-md-type="block_code" data-md-language="html"><code class="language-html"><input
  type="checkbox"
  id="text-notifications"
  name="text-notifications"
>
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'label' %}</p>
<pre data-md-type="block_code" data-md-language="html"><code class="language-html"><label for="text-notifications">
  <h3>Mensajes de texto</h3>
  <small>Recibe notificaciones sobre todos los mensajes de texto enviados a su dispositivo</small>
</label>
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

En tu etiqueta, coloca un atributo de `for` que apunte a una casilla de verificación mediante su ID: `<label for="text-notifications">`. En tu casilla de verificación, duplica el nombre y la identificación para asegurarte de que se encuentran con diferentes herramientas y tecnología, como un ratón o un lector de pantalla: `<input type="checkbox" id="text-notifications" name="text-notifications">`. `:hover`, `:active` y más vienen gratis con la conexión, aumentando las formas en que se puede interactuar con tu formulario.

### Resaltado de la casilla de verificación

Quiero mantener mis interfaces consistentes y el elemento deslizante tiene un bonito resaltado en miniatura que me gustaría usar con la casilla de verificación. La miniatura puede usar `box-shadow` y su propiedad de  `spread` para escalar una sombra hacia arriba y hacia abajo. Sin embargo, ese efecto no funciona aquí porque nuestras casillas de verificación son [y deberían ser](https://twitter.com/argyleink/status/1329230409784291328?s=20) cuadradas.

Pudes lograr el mismo efecto visual con un pseudo elemento y una cantidad desafortunada de CSS complicado:

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);

input[type="checkbox"]::before {
  --thumb-scale: .01;                        /* escala inicial del color para resaltar */
  --thumb-highlight-size: var(--space-xl);

  content: "";
  inline-size: var(--thumb-highlight-size);
  block-size: var(--thumb-highlight-size);
  clip-path: circle(50%);                     /* forma de círculo */
  position: absolute;                         /* es por esto que usamos position relative en el elemento primario */
  top: 50%;                                   /* tecnica de pop y plop (https://web.dev/centering-in-css/#5-pop-and-plop) */
  left: 50%;
  background: var(--thumb-highlight-color);
  transform-origin: center center;            /* la meta es un circulo escalable colocado en el centro */
  transform:                                  /* el orden aquí importa!! */
    translateX(-50%)                          /* contra balancea a la izquierda: 50% */
    translateY(-50%)                          /* contra balancea al tope: 50% */
    translateZ(-1px)                          /* LO PONE DETRAS DE LA CASILLA */
    scale(var(--thumb-scale))                 /* el valor que activamos para animación */
  ;
  will-change: transform;

  @media (--motionOK) {                       /* transición permitida si el movimiento está habilitado */
    & {
      transition: transform .2s ease;
    }
  }
}

/* en on hover, define la propiedad personalizada de escala al estado de "in" */
input[type="checkbox"]:hover::before {
  --thumb-scale: 1;
}
```

Crear un psuedo-elemento circular es un trabajo sencillo, pero **colocarlo detrás del elemento al que está unido** fue más difícil. Aquí está el antes y después de que lo arreglé:

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Spdpw5P1MD8ceazneRXo.mp4", autoplay="true", loop="true", muted="true" %}

Definitivamente es una micro interacción, pero es importante para mí mantener la consistencia visual. La técnica de escala de animación es la misma que hemos estado usando en otros lugares. Establecemos una propiedad personalizada en un nuevo valor y dejamos que CSS la haga en función de las preferencias de movimiento. La característica clave aquí es `translateZ(-1px)`. El elemento primario creó un espacio 3D y este pseudo elemento secundario lo aprovechó colocándose ligeramente hacia atrás en el eje z.

## Accesibilidad

El video de YouTube hace una gran demostración de las interacciones del ratón, el teclado y el lector de pantalla para este componente de configuración. Anotaré algunos de los detalles aquí.

### Opciones de elementos HTML

```html
<form>
<header>
<fieldset>
<picture>
<label>
<input>
```

Cada uno de estos contiene sugerencias y consejos para la herramienta de navegación del usuario. Algunos elementos brindan sugerencias de interacción, algunos conectan la interactividad y algunos ayudan a dar forma al árbol de accesibilidad por el que navega un lector de pantalla.

### Atributos HTML

Podemos ocultar elementos que no son necesarios para los lectores de pantalla, en este caso el icono al lado del control deslizante:

```html
<picture aria-hidden="true">
```

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/fVjqHRZHQixAaxjeAvDP.mp4", autoplay="true", loop="true", muted="true", width="480px"%}

El video anterior muestra el flujo del lector de pantalla en Mac OS. Observa cómo el foco de entrada se mueve directamente de un control deslizante al siguiente. Esto se debe a que hemos ocultado el icono que puede haber sido una parada en el camino hacia el siguiente control deslizante. Sin este atributo, un usuario tendría que detenerse, escuchar y pasar de la imagen que tal vez no pueda ver.

{% Aside 'gotchas' %} Asegúrate de hacer una prueba de los lectores de pantalla en todos los buscadores. La demostración original incluía `<label>` en la lista de elementos con `aria-hidden="true"`, pero desde entonces se eliminó después de que una [conversación de Twitter](https://twitter.com/rob_dodson/status/1371859386210029568) reveló diferencias entre navegadores. {% endAside %}

El SVG es un montón de matemáticas, agreguemos un elemento `<title>` para cuando el ratón pase por el elemento y despliegue un comentario legible por humanos sobre lo que están creando las matemáticas:

```html
<svg viewBox="0 0 24 24">
  <title>A note icon</title>
  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
</svg>
```

Aparte de eso, hemos utilizado suficiente HTML que fue claramente marcado que el formulario funciona realmente bien en el ratón, el teclado, los mandos de videojuegos y los lectores de pantalla.

## JavaScript

Ya he [explicado](#track-styles) cómo se administraba el color de relleno de la pista desde JavaScript, así que veamos ahora el JavaScript relacionado con el `<form>`:

```js
const form = document.querySelector('form');

form.addEventListener('input', event => {
  const formData = Object.fromEntries(new FormData(form));
  console.table(formData);
})
```

Cada vez que se interactúa con el formulario y ocurre un cambio, la consola registra el formulario como un objeto en una tabla para una fácil revisión antes de enviarlo a un servidor.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/hFAyIOpOSdiczdf4AtIj.png", alt="Una captura de pantalla de los resultados de console.table(), donde los datos del formulario se muestran en una tabla", width="800", height="285" %}

## Conclusión

Ahora que sabes cómo lo hice, ¡¿cómo lo harías tú?! ¡Esta es una arquitectura de componentes bien divertida! ¿Quién va a hacer la primera versión con slots usando su framework favorito? 🙂

Diversifiquemos nuestros enfoques y aprendamos todas las formas de construir en la web. Crea una demostración, [tuitéame](https://twitter.com/argyleink) tu versión y la agregaré a la sección de [Remixes de la comunidad](#community-remixes) a continuación.

## Remixes de la comunidad

- [¡@tomayac](https://twitter.com/tomayac) con su estilo respecto al área de desplazamiento para las etiquetas de las casillas de verificación! Esta versión no tiene ningún espacio flotante entre los elementos: [demostración](https://tomayac.github.io/gui-challenges/settings/dist/) y [fuente](https://github.com/tomayac/gui-challenges).
