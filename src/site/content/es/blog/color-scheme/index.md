---
title: Se mejoró el estilo predeterminado del modo oscuro con la propiedad CSS de `color-scheme` y la metaetiqueta correspondiente
subhead: |2-

  La propiedad CSS `color-scheme` y la metaetiqueta correspondiente permite a los desarrolladores optar por incluir sus páginas en los valores predeterminados específicos del tema de la hoja de estilo del agente de usuario.
authors:
  - thomassteiner
date: 2020-04-08
updated: 2021-10-19
hero: image/admin/rOe3wxcy28m5DCKcHv7E.jpg
alt: Palomas en una pared con un marcado contraste con un fondo blanco y negro.
description: |2-

  La propiedad CSS de color-scheme y la metaetiqueta correspondiente permite a los desarrolladores optar por sus páginas en los valores predeterminados específicos del tema de la hoja de estilo del agente de usuario, por ejemplo, controles de formulario, barras de desplazamiento y colores del sistema CSS.

  Al mismo tiempo, esta función evita que los navegadores apliquen transformaciones por sí mismos.
tags:
  - blog
  - css
feedback:
  - api
---

## Fondo

### La función `prefers-color-scheme` de medios de preferencia del usuario

La función de [`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) de medios de preferencia del usuario ofrece a los desarrolladores un control total sobre la apariencia de sus páginas. Si no estás familiarizado con él, lee mi artículo de [`prefers-color-scheme`: Hola oscuridad, mi viejo amigo](/prefers-color-scheme/), donde documenté todo lo que sé sobre la creación de increíbles experiencias en modo oscuro.

Una pieza del rompecabezas que solo se mencionó brevemente en el artículo es la propiedad CSS de `color-scheme` y la metaetiqueta correspondiente del mismo nombre. Ambos te facilitan la vida como desarrollador al permitirte incluir en tu página los valores predeterminados específicos del tema de la hoja de estilo del agente de usuario, como, por ejemplo, controles de formulario, barras de desplazamiento y colores del sistema CSS. Al mismo tiempo, esta función evita que los navegadores apliquen transformaciones por sí mismos.

### La hoja de estilo del agente de usuario

Antes de continuar, déjame describir brevemente qué es una hoja de estilo de agente de usuario. La mayoría de las veces, puedes pensar en la palabra *agente de usuario* (UA) como una forma elegante de decir *navegador*. La hoja de estilo del UA determina la apariencia predeterminada de una página. Como sugiere el nombre, una hoja de estilo del UA es algo que depende de la UA en cuestión. Puedes echar un vistazo a la hoja de estilo UA de [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css) (y Chromium) y compararla con la de [Firefox](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) o con la de [Safari](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) (y WebKit). Normalmente, las hojas de estilo del UA coinciden en la mayoría de las cosas. Por ejemplo, todos hacen que los enlaces sean azules, el texto general negro y el color de fondo blanco, pero también hay diferencias importantes (y a veces molestas), por ejemplo, cómo diseñan los controles de los formularios.

Da un vistazo más de cerca a [la hoja de estilo del UA de WebKit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) y lo que hace con respecto al modo oscuro. (Realiza una búsqueda de texto completo para "dark" en la hoja de estilo.) El valor predeterminado proporcionado por la hoja de estilo cambia según si el modo oscuro está activado o desactivado. Para ilustrar esto, aquí hay una regla CSS que usa la pseudoclase de [`:matches`](https://css-tricks.com/almanac/selectors/m/matches/) y las variables internas de WebKit como `-apple-system-control-background`, así como la directiva del preprocesador interno de WebKit `#if defined`:

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* snip */
}
```

Notarás algunos valores no estándar para las propiedades de  `color` y de `background-color`. Ni el `text` y ni el `-apple-system-control-background` son colores CSS válidos. Son colores *semánticos* internos de WebKit.

Resulta que CSS ha estandarizado los colores del sistema semántico. Se especifican en [CSS Color Module Level 4 (nivel 4 del módulo de color CSS)](https://drafts.csswg.org/css-color/#css-system-colors). Por ejemplo, el [`Canvas`](https://drafts.csswg.org/css-color/#valdef-system-color-canvas) (que no debe confundirse con la etiqueta de `<canvas>`) es para el fondo del contenido o los documentos de la aplicación, mientras que el [`CanvasText`](https://drafts.csswg.org/css-color/#valdef-system-color-canvastext) es para el texto en el contenido o los documentos de la aplicación. Los dos van juntos y no deben usarse de forma aislada.

Las hojas de estilo del UA pueden utilizar sus propios colores patentados o los del sistema semántico estandarizado, para determinar cómo se deben representar los elementos HTML de forma predeterminada. Si el sistema operativo está configurado en modo oscuro o usa un tema oscuro, `CanvasText` (o `text`) se establecerá condicionalmente en blanco y `Canvas` (o `-apple-system-control-background`) se establecerá en negro. La hoja de estilo del UA asigna el siguiente CSS solo una vez y cubre tanto el modo claro como el oscuro.

```css
/**
  No es una actual hoja de estilo de UA.
  Esto es usado para fines educativos.
*/
body {
  color: CanvasText;
  background-color: Canvas
}
```

## La propiedad CSS del `color-scheme`

La especificación de [CSS Color Adjustment Module Level 1 (nivel 1 del módulo de color CSS)](https://drafts.csswg.org/css-color-adjust/) introduce un modelo y controla el ajuste automático del color por parte del agente de usuario con el objetivo de manejar las preferencias del usuario, como el modo oscuro, el ajuste de contraste o esquemas de color específicos deseados.

La propiedad de [`color-scheme`](https://drafts.csswg.org/css-color-adjust/#color-scheme-prop) definida en el mismo permite que un elemento indique con qué esquemas de color se siente cómodo para ser renderizado. Estos valores se negocian con las preferencias del usuario, lo que da como resultado un esquema de color elegido que afecta aspectos de la interfaz de usuario (IU) como los colores predeterminados de los controles de formulario y las barras de desplazamiento, así como los valores usados de los colores del sistema CSS. Actualmente se admiten los siguientes valores:

- *`normal`* Indica que el elemento no conoce los esquemas de color en lo absoluto, por lo que el elemento debe renderizarse con el esquema de color predeterminado del navegador.

- *`[ light | dark ]+`* Indica que el elemento conoce y puede manejar los esquemas de color enumerados y expresa una preferencia ordenada entre ellos.

{% Aside 'note' %} Proporcionar ambas palabras claves indica que el primer esquema es el preferido (por el autor), pero el segundo también es aceptable si el usuario lo prefiere. {% endAside %}

En esta lista, la `light` representa un esquema de color claro, con colores de fondo claros y colores de primer plano oscuros, mientras que `dark` representa lo contrario, con colores de fondo oscuros y colores claros de primer plano.

Para todos los elementos, la renderización con un esquema de color debe hacer que los colores utilizados en toda la interfaz de usuario proporcionada por el navegador para que el elemento coincida con la intención del esquema de color. Algunos ejemplos son las barras de desplazamiento, los subrayados del corrector ortográfico, los controles de formulario, etc.

{% Aside 'note' %} La propiedad de `color-scheme` del CSS se puede utilizar tanto en el `:root` como en un nivel individual por elemento. {% endAside %}

En un elemento `:root`, la representación con un esquema de color debe afectar adicionalmente el color de la superficie del canvas (es decir, el color de fondo global), el valor inicial de la propiedad de `color` y los valores usados de los colores del sistema, y también debe afectar las barras de desplazamiento de la ventana gráfica.

```css
/*
 Esta página tiene compatibilidad con esquemas de colores light (claro) y dark (oscuro) y el autor prefiere dark.
*/
:root {
  color-scheme: dark light;
}
```

## La metaetiqueta de `color-scheme`

Utilizar la propiedad `color-scheme` del CSS requiere que el CSS se descargue primero (si se hace referencia a él a través de `<link rel="stylesheet">`) y se analice. Para ayudar a los agentes de usuario a representar el fondo de la página con el esquema de color deseado *inmediatamente*, también se puede proporcionar un valor de `color-scheme` en un elemento [`<meta name="color-scheme">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme).

```html
<!--
  Esta página tiene compatibilidad con esquemas de colores light (claro) y dark (oscuro) y el autor prefiere dark.
-->
<meta name="color-scheme" content="dark light">
```

## Combinando `color-scheme` y `prefers-color-scheme`

Dado que tanto la metaetiqueta como la propiedad CSS (si se aplican al `:root`) eventualmente dan como resultado el mismo comportamiento, siempre recomiendo especificar el esquema de color a través de la metaetiqueta, para que el navegador pueda adoptar el esquema preferido más rápido.

Si bien para las páginas de línea de base absolutas no se necesitan reglas CSS adicionales, en el caso general siempre debes de combinar `color-scheme` con `prefers-color-scheme`. Por ejemplo, el color patentado de WebKit CSS `-webkit-link`, utilizado por WebKit y Chrome para el clásico enlace azul `rgb(0,0,238)`, tiene una relación de contraste insuficiente de 2,23:1 sobre un fondo negro y [falla](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000) tanto en la WCAG AA como así como los [requisitos](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels) de la WCAG AAA.

Abrí errores para [Chrome](https://crbug.com/1066811), [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209851) y [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1626560), así como un [problema meta en el estándar HTML](https://github.com/whatwg/html/issues/5426) para solucionarlo.

## Interacción con el `prefers-color-scheme`

La interacción de la propiedad `color-scheme` del CSS y la metaetiqueta correspondiente con la función de medios de preferencia del usuario de `prefers-color-scheme` puede lucir un poco confusa al principio. De hecho, ambos funcionan muy bien entre ellos. Lo más importante que hay que entender es que `color-scheme` determina exclusivamente la apariencia predeterminada, mientras que el `prefers-color-scheme` determina la apariencia que se le puede aplicar un estilo. Para aclarar esto, asume la siguiente página:

```html
<head>
  <meta name="color-scheme" content="dark light">
  <style>
    fieldset {
      background-color: gainsboro;
    }
    @media (prefers-color-scheme: dark) {
      fieldset {
        background-color: darkslategray;
      }
    }
  </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, legere ancillae ne vis.
  </p>
  <form>
    <fieldset>
      <legend>Lorem ipsum</legend>
      <button type="button">Lorem ipsum</button>
    </fieldset>
  </form>
</body>
```

El código CSS en línea en la página establece el `background-color` del elemento `<fieldset>` en `gainsboro` en el caso general, y en `darkslategray` si el usuario prefiere un esquema de color `dark` de acuerdo con la función de medios de preferencia del usuario de `prefers-color-scheme`.

A través del elemento `<meta name="color-scheme" content="dark light">`, la página le dice al navegador que admite un tema oscuro y uno claro, con preferencia por un tema oscuro.

Dependiendo de si el sistema operativo está configurado en modo oscuro o claro, toda la página aparece clara sobre oscura, o viceversa, según la hoja de estilo del agente de usuario. No *hay* CSS adicional proporcionado por el desarrollador para cambiar el texto del párrafo o el color de fondo de la página.

Observa cómo el `background-color` de fondo del elemento de `<fieldset>` cambia en función de si el modo oscuro está habilitado, siguiendo las reglas de la hoja de estilo en línea proporcionada por el desarrollador en la página. Puede ser `gainsboro` o `darkslategray`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSgOIiGRqjw2PvRlVCaV.png", alt="Una página en modo claro", width="800", height="322" %}<figcaption> <strong>Modo claro:</strong> Estilos especificados por el desarrollador y el agente de usuario. El texto es negro y el fondo es blanco según la hoja de estilo del agente de usuario. El <code>background-color</code> del elemento <code>&lt;fieldset&gt;</code> es <code>gainsboro</code> según la hoja de estilo en línea del desarrollador.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qqkHz83kerktbDIGCJeG.png", alt="Una página en modo oscuro.", width="800", height="322" %}<figcaption> <strong>Modo oscuro:</strong> Estilos especificados por el desarrollador y el agente de usuario. El texto es blanco y el fondo es negro según la hoja de estilo del agente de usuario. El <code>background-color</code> del elemento <code>&lt;fieldset&gt;</code> es <code>darkslategray</code> según la hoja de estilo en línea del desarrollador.</figcaption></figure>

El elemento de `<button>` está controlado por la hoja de estilo del agente de usuario. Su `color` se establece en el color del sistema [`ButtonText`](https://drafts.csswg.org/css-color/#valdef-system-color-buttontext) y su `background-color` y los cuatro `border-color` se establecen en el color del sistema de [`ButtonFace`](https://drafts.csswg.org/css-color/#valdef-system-color-buttonface).

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lSNFROIe1P94DlhoVtoV.png", alt = "Una página en modo claro que usa la propiedad ButtonFace.", width = "800", height = "322"%}<figcaption> <strong>Modo claro:</strong> El <code>background-color</code> y los distintos <code>border-color</code> se establecen en el color del sistema de <a href="https://drafts.csswg.org/css-color/#valdef-system-color-buttonface">ButtonFace.</a></figcaption></figure>

Ahora observa cómo cambia el `border-color` del elemento `<button>.` El valor *calculado* para `border-top-color` y `border-bottom-color` cambia de `rgba(0, 0, 0, 0.847)` (negro profundo) a `rgba(255, 255, 255, 0.847)` (blanco claro), ya que el agente del usuario actualiza `ButtonFace` dinámicamente según el esquema de color. Lo mismo se aplica para el `color` del elemento `<button>` que se establece en el color del sistema correspondiente de `ButtonText`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IogmyIzUhokJgnnxUkPi.png", alt="Mostrando los valores de color calculados coinciden con ButtonFace.", width="800", height="322" %}<figcaption> <strong>Modo claro:</strong> Los valores calculados de <code>border-top-color</code> y <code>border-bottom-color</code> que se establecen en base a <code>ButtonFace</code> en la hoja de estilo del agente de usuario ahora son <code>rgba(0, 0, 0, 0.847)</code>.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3sU1uZyt3zNhEgw3gpZJ.png", alt="Mostrando que los valores de color calculados aún coinciden con ButtonFace en modo oscuro.", width="800", height="322" %}<figcaption> <strong>Modo oscuro:</strong> Los valores calculados de <code>border-top-color</code> y <code>border-bottom-color</code> que están configurados en base a  <code>ButtonFace</code> en la hoja de estilo del agente de usuario ahora son <code>rgba(255, 255, 255, 0.847)</code>.</figcaption></figure>

## Demostración

Puedes ver los efectos de `color-scheme` aplicado a una gran cantidad de elementos HTML en una [demostración de Glitch](https://color-scheme-demo.glitch.me/). La demostración *muestra deliberadamente* [la violación de](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000) WCAG AA y WCAG AAA con los colores de enlace mencionados en la [advertencia anterior](#using-color-scheme-in-practice).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bqXapQKcNbyE3uwEOELO.png", alt="La demostración en modo claro.", width="800", height="982" %}<figcaption> La <a href="https://color-scheme-demo.glitch.me/">demostración</a> cambió al <code>color-scheme: light</code>.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9G4hFdtSSwPLOm57zedD.png", alt="La demostración en modo oscuro.", width="800", height="982" %}<figcaption> La <a href="https://color-scheme-demo.glitch.me/">demostración</a> cambió al <code>color-scheme: dark</code>. Ten en cuenta la <a href="https://webaim.org/resources/contrastchecker/?fcolor=0000EE&amp;bcolor=000000">violación</a> de WCAG AA y WCAG AAA con los colores de los enlaces.</figcaption></figure>

## Agradecimientos

La propiedad CSS de `color-scheme` y la metaetiqueta correspondiente fueron implementadas por [Rune Lillesveen](https://github.com/lilles). Rune también es coeditor de CSS Color Adjustment Module Level 1 specification (especificación de nivel 1 del módulo de ajuste de color CSS). Imagen de héroe de [Philippe Leone](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) en [Unsplash](https://unsplash.com/photos/dbFfEBOCrkU).
