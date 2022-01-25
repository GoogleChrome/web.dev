---
layout: handbook
title: Componentes web.dev
date: 2019-06-26
updated: 2020-07-17
description: Aprenda a utilizar la interfaz de usuario y los componentes de contenido de web.dev
---

La plataforma web.dev incluye varios componentes para facilitar que los contribuyentes de contenido incluyan características de contenido comunes, como videos, comparaciones en paralelo y apartados.

Esta publicación ofrece un marcado de muestra para cada uno de los componentes de contenido de web.dev y brinda orientación sobre cómo usarlos de manera efectiva.

## Tipos de componentes

1. [Apartados](#asides)
2. [Banners](#banners)
3. [Bloques de citas](#blockquotes)
4. [Compatibilidad del navegador](#browsercompat)
5. [Botones](#buttons)
6. [Llamadas](#callouts)
7. [Casillas de verificación](#checkbox)
8. [Patrón de código](#codepattern)
9. [Codepen](#codepen)
10. [Columnas](#columns)
11. [Código](#code)
12. [Comparaciones](#compare)
13. [Detalles](#details)
14. [Glitches](#glitches)
15. [Imagenes](#images)
16. [Instrucciones](#instructions)
17. [Etiquetas](#labels)
18. [Listas](#lists)
19. [Estadisticas](#stats)
20. [Tablas](#tables)
21. [Pestañas](#tabs)
22. [Descripción flotante](#tooltips)
23. [Video](#video)

## Componentes obsoletos

1. [w-button](#w-button)
2. [w-columns](#w-columns)

## Apartados

Utilice los apartados para proporcionar información relacionada con el contenido del cuerpo de la publicación o del laboratorio de código, pero distinta. Los apartados generalmente deben ser cortos, no más de 2 a 3 líneas.

Los apartados pueden contener enlaces y texto formateado, incluido el código.

Hay varios tipos de apartados, cada uno con un propósito diferente.

### Apartados de notas

```text
{% raw %}{% Aside %}
Use the note aside to provide supplemental information.
{% endAside %}{% endraw %}
```

{% Aside %} Use un apartado de notas para brindar información complementaria. {% endAside %}

### Apartados de precaución

```text
{% raw %}{% Aside 'caution' %}
Use the caution aside to indicate a potential pitfall or complication.
{% endAside %}{% endraw %}
```

{% Aside 'caution' %} Use los apartados de precaución para indicar un peligro potencial o una complicación. {% endAside %}

### Apartados de advertencia

```text
{% raw %}{% Aside 'warning' %}
The warning aside is stronger than a caution aside; use it to tell the reader
not to do something.
{% endAside %}{% endraw %}
```

{% Aside 'warning' %} Los apartados de advertencia son más serios que un apartado de advertencia; úselo para decirle al lector que no haga algo. {% endAside %}

### Apartados de éxito

```text
{% raw %}{% Aside 'success' %}
Use the success aside to describe a successful action or an error-free status.
{% endAside %}{% endraw %}
```

{% Aside 'success' %} Utilice los apartados de éxito para describir una acción exitosa o un estado sin errores. {% endAside %}

### Apartados de objetivos

```text
{% raw %}{% Aside 'objective' %}
Use the objective aside to define the goal of a process described in the body
copy.
{% endAside %}{% endraw %}
```

{% Aside 'objective' %} Utilice el objetivo a un lado para definir el objetivo de un proceso descrito en el cuerpo del texto. {% endAside %}

### Apartados de problemas

```text
{% raw %}{% Aside 'gotchas' %}
Use the gotcha aside to indicate a common problem that the reader wouldn't know
without specialized knowledge of the topic.
{% endAside %}{% endraw %}
```

{% Aside 'gotchas' %} Use los apartados de problemas para indicar un problema común que el lector no reconocería sin un conocimiento especializado del tema. {% endAside %}

### Apartados de términos clave

```text
{% raw %}{% Aside 'key-term' %}
Use the key-term aside to define a term that's essential to understanding an
idea in the body copy. Key-term asides should be a single sentence that
includes the term in italics. For example, "A _portal_ is…"
{% endAside %}{% endraw %}
```

{% Aside 'key-term' %} Utilice los apartados de términos clave para definir un término que es esencial para comprender una idea en el cuerpo del texto. Los apartados de términos clave deben ser una sola oración que incluya el término en cursiva. Por ejemplo, "Un *portal* es …" {% endAside %}

### Apartado de Codelab

```text
{% raw %}{% Aside 'codelab' %}
Use the codelab aside to link to an associated codelab.
{% endAside %}{% endraw %}
```

{% Aside 'codelab' %} [Uso de Imagemin con Grunt](#) {% endAside %}

## Banners

### Banners predeterminados

Se pueden agregar banners predeterminados a las plantillas del sitio (por ejemplo, páginas de destino) para dar información oportuna a los usuarios (por ejemplo, una alerta sobre una próxima conferencia). No use banners predeterminados en el cuerpo de una publicación; en su lugar, use la variante de cuerpo, a continuación.

```text
{% raw %}{% Banner %}This is an info banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner %} Este es un banner de información. Es compatible con Markdown. {% endBanner %}

```text
{% raw %}{% Banner 'caution' %}This is a caution banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner 'caution' %} Este es un banner de precaución. Es compatible con Markdown. {% endBanner %}

```text
{% raw %}{% Banner 'warning' %}This is a warning banner. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner 'warning' %} Este es un banner de advertencia. Es compatible con Markdown. {% endBanner %}

```text
{% raw %}{% Banner 'neutral' %}This is a neutral banner, used to display a discreet suggestion for the user. It supports Markdown.{% endBanner %}{% endraw %}
```

{% Banner 'neutral' %} Este es un banner neutral. Es compatible con Markdown. {% endBanner %}

### Banners en el cuerpo

```text
{% raw %}{% Banner 'info', 'body' %}This is an info banner that's used in the body of a post. It has less padding and larger text.{% endBanner %}{% endraw %}
```

{% Banner 'info', 'body' %} Este es un banner de información usado en el cuerpo de una publicación. Tiene menos relleno y texto más grande. {% endBanner %}

## Citas en bloque

Utilice citas en bloque para enfatizar una cita que sea importante para la idea principal de una publicación. (Por ejemplo, en un estudio de caso, puede incluir una cita de alguien del equipo de gestión de la organización asociada).

Incluya siempre un elemento `<cite>` que indique la fuente de la cita al final de una cita en bloque:

```html
<blockquote>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin dictum a massa sit amet ullamcorper.
  </p>
  <cite>
    Jon Doe
  </cite>
</blockquote>
```

```html
{% raw %}{% Blockquote 'Jon Doe' %}
[Lorem ipsum](#) dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper.
{% endBlockquote %}{% endraw %}
```

{% Blockquote 'Jon Doe' %} [Lorem ipsum](#) dolor sit amet, consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. {% endBlockquote %}

## Tabla de compatibilidad del navegador {: #browsercompat }

Con el código abreviado `BrowserCompat` puede incrustar un widget [MDN - Datos de compatibilidad del navegador](https://github.com/mdn/browser-compat-data/) en su publicación. Necesita pasar el ID de la característica en notación separada por puntos, como lo usa [BCD Schema](https://github.com/mdn/browser-compat-data), por ejemplo, para [Web/API/BackgroundFetchEvent](https://github.com/mdn/browser-compat-data) la ID es `api.BackgroundFetchEvent`:

```text
{% raw %}{% BrowserCompat 'api.BackgroundFetchEvent' %}{% endraw %}
```

{% BrowserCompat 'api.BackgroundFetchEvent' %}

## Botones

En general, no debería necesitar agregar botones a sus publicaciones. Estos botones se muestran como referencia.

[Especificación detallada](design-system/component/button/)

### Botones de texto

<div>
  <button class="button">Botón de texto</button>
  <button class="button">{% include "icons/" ~ 'plus.svg'%} Botón de texto con icono</button>
</div>

<div>
  <button class="button" data-type="primary">Botón principal</button>
  <button class="button" data-type="primary">{% include "icons/" ~ 'plus.svg'%} Botón principal con icono</button>
</div>

<div>
  <button class="button" data-type="secondary">Botón secundario</button>
  <button class="button" data-type="secondary">{% include "icons/" ~ 'plus.svg'%} Botón secundario con ícono</button>
</div>

### Botones de icono

Un botón de icono predeterminado:

[Especificación detallada](design-system/component/icon-button/)

<div>
  <button class="icon-button" aria-label="Close">{% include "icons/close.svg" %}</button>
</div>

Un botón de icono con información sobre descripción flotante:

<div>
  <button class="icon-button tooltip" aria-labelledby="icon-button-toolip">{% include "icons/close.svg" %} <span class="tooltip__content" id="icon-button-toolip">Cerrar</span></button>
</div>

## Rótulos

### Llamadas de laboratorio de código

En general, no debería necesitar agregar manualmente una llamada de laboratorio de código a su página; en su lugar, use el campo `codelabs` [en el YAML de la publicación](/handbook/markup-post-codelab/#set-up-the-yaml) , que agregará automáticamente una llamada de codelab al final de la publicación.

{% CodelabsCallout ['codelab-fix-sneaky-404', 'codelab-art-direction'], lang%}

### Llamadas de autoevaluación

Vea la publicación de [Autoevaluaciones.](/handbook/self-assessment-components)

## Casilla de verificación

Para alinear una etiqueta con la casilla de verificación, envuelva la etiqueta y la casilla de verificación en un elemento con una clase `cluster gutter-base flex-align-start`.

[Especificación detallada](/design-system/component/form-fields/#checkbox)

```html
<div class="cluster gutter-base flex-align-start">
  <input id="myCheckbox" type="checkbox" />
  <label for="myCheckbox">Lorem ipsum dolor sit amet</label>
</div>
```

<div class="cluster gutter-base flex-align-start">
  <input id="myCheckbox" type="checkbox">
  <label for="myCheckbox">Lorem ipsum dolor sit amet</label>
</div>

## Patrón de código {: #codepattern }

Un componente que muestra una demostración y fragmentos de código uno al lado del otro, organizados en pestañas.

La altura del componente está determinada por el fragmento de código con la mayoría de las líneas de código.

Para cambiar la altura del componente, especifique el valor de la altura en píxeles en el código abreviado.

```text
{% raw %}{% CodePattern 'pattern-id', optional-height-in-px %}{% endraw %}
```

{% CodePattern 'example-set/example-pattern', 500 %}

Puede incrustar uno de los patrones existentes (del `/content/en/patterns/` ) o agregar uno nuevo. Consulte los [ejemplos y documentación](/patterns/example-set/) sobre cómo escribir nuevos patrones de código.

## Codepen {: #codepen }

Si no desea utilizar su cuenta personal, puede utilizar la cuenta **web-dev-codepen-external** para crear un Codepen. Hable con un miembro del equipo de redacción técnica para obtener acceso al nombre de usuario y la contraseña.

```md
{% raw %}{% Codepen {
  user: 'robdodson',
  id: 'GRroyyX',
  height: 300,
  theme: 'dark',
  tab: 'css,result',
  allow: ['geolocation']
} %}{% endraw %}
```

{% Codepen {user: 'robdodson', id: 'GRroyyX', height: 300, theme: 'oscuro', tab: 'css, resultado', allow: ['geolocalización']}%}

```typescript
{% include '../../../../../../types/site/_includes/components/Codepen.d.ts' %}
```

## Columnas

Cualquier elemento se puede colocar en un diseño de dos columnas envolviéndolos en un elemento `<div class="switcher">`. En tamaños de ventana gráfica más pequeños, los elementos en un diseño de dos columnas cambiarán a una disposición apilada.

[Especificación detallada](/design-system/css-compositions/#switcher)

```html
<div class="switcher">
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
</div>
```

<div class="switcher">
  <figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %} <figcaption> Imagen pequeña.</figcaption></figure>
  <figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %} <figcaption>%} Imagen pequeña.</figcaption></figure>
</div>

## Código

Vea la publicación [Código.](/handbook/markup-code)

## Comparar

```text
{% raw %}&#123;% Compare 'worse' %&#125;
&#96;&#96;&#96;text
Bad code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;

&#123;% Compare 'better' %&#125;
&#96;&#96;&#96;text
Good code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;{% endraw %}
```

{% Compare 'worse' %}
```text
Bad code example
```
{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```
{% endCompare %}

### Comparar con subtítulo

````text
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
````

{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}

### Comparar con etiquetas personalizadas

```text
{% raw %}{% Compare 'worse', 'Unhelpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
{% endCompare %}

{% Compare 'better', 'Helpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
{% endCompare %}{% endraw %}
```

{% Compare 'worse', 'Unhelpful' %} Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at. {% endCompare %}

{% Compare 'better', 'Helpful' %} Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at. {% endCompare %}

### Compare en columnas

```html
<div class="switcher">
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
</div>
```

<div class="switcher">{% Compare 'worse' %} `` `texto Ejemplo de código incorrecto` ``</div>
<p data-md-type="paragraph">{% CompareCaption %} Explicación de por qué el <code data-md-type="codespan">example</code> es malo. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<pre data-md-type="block_code" data-md-language="text"><code class="language-text">Good code example
</code></pre>
<p data-md-type="paragraph">{% CompareCaption %} Explicación de por qué el <code data-md-type="codespan">example</code> es bueno. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus incidunt harum reprehenderit laboriosam labore consequuntur quod. ¡Doloribus, deleniti! Atque aliquam facilis labore odio similique provident illo culpa assumenda perspiciatis.

## Detalles

### Componente de detalles básicos

```text
{% raw %}{% Details %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endDetails %}{% endraw %}
```

{% Details %}

{% DetailsSummary %} *Resumen* de detalles {% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at.

{% endDetails %}

### Componente de detalles con vista previa

```text/4-5
{% raw %}{% Details %}

{% DetailsSummary %}
Details _summary_
This is an optional preview. Make your preview text match the first paragraph
of your panel text.
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endDetails %}{% endraw %}
```

{% Details %}

{% DetailsSummary %} *Resumen de* detalles Esta es una vista previa opcional. Haga que su texto de vista previa coincida con el primer párrafo del texto de su panel. {% endDetailsSummary %}

Esta es una vista previa opcional. Haga que su texto de vista previa coincida con el primer párrafo del texto de su panel.

Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at.

{% endDetails %}

### Componente de detalles con nivel de encabezado personalizado

El nivel de encabezado predeterminado es `h2`. Para asegurarse de que el componente `Details` esté en el lugar correcto en la jerarquía de la página, agregue un argumento de encabezado personalizado al código abreviado `DetailsSummary`. Por ejemplo, si el componente está en una sección `h2`, use un encabezado `h3`.

```text/2
{% raw %}{% Details %}

{% DetailsSummary 'h3' %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endDetails %}{% endraw %}
```

{% Details %}

{% DetailsSummary 'h3' %} *Resumen de* detalles {% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at.

{% endDetails %}

### Componente de detalles en estado abierto

El componente `Details` está cerrado de forma predeterminada. Si por alguna razón desea que se abra, agregue el argumento `open` al código abreviado `Details`.

```text/0
{% raw %}{% Details 'open' %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endDetails %}{% endraw %}
```

{% Details 'open' %}

{% DetailsSummary %} *Resumen de* detalles {% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#) , consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius at.

{% endDetails %}

## Glitches {: #glitches }

### Cree un Glitch

- Mezcle la plantilla [web-dev-hello-webpage](https://glitch.com/~web-dev-hello-webpage) o [web-dev-hello-express.](https://glitch.com/~web-dev-hello-express)
- Haga clic en **Opciones de proyecto** y actualice la descripción de la falla.
- Actualice `README.md`.
- Actualice `package.json` (si existe).
- Agregue el proyecto al [equipo web.dev en Glitch](https://glitch.com/@webdev).
- Establezca el avatar del proyecto en el [logotipo de web.dev](https://cdn.glitch.com/9b775a52-d700-4208-84e9-18578ee75266%2Ficon.jpeg?v=1585082912878).

### Insertar una falla

{% raw %}

```html
{% Glitch {
  id: 'tabindex-zero',
  path: 'index.html',
  previewSize: 0,
  allow: []
} %}

<!-- Or just the Glitch ID -->

{% Glitch 'tabindex-zero' %}
```

{% endraw %}

Está bien ajustar la `height` del elemento wrapper Glitch si necesita más o menos espacio.

Los campos de objeto de código abreviado permiten modificar cómo se presenta la inserción:

- { `string | string[]` } `allow?` Lista de políticas de características de un IFrame, ya sea como una matriz de cadenas o como una lista separada por `;/code2}. De forma predeterminada, las siguientes políticas están habilitadas:`
    - `'camera', 'clipboard-read', 'clipboard-write', 'encrypted-media', 'geolocation', 'microphone', 'midi'`
- { `string` } `id` ID del proyecto Glitch.
- { `string` } `path?` Le permite especificar qué archivo de código fuente mostrar.
- { `number` } `previewSize?` Define qué porcentaje de la inserción debe dedicarse a la vista previa, el valor predeterminado es 100.
- { `number` } `height?` Alto, en píxeles, del elemento wrapper Glitch.

<!-- https://support.glitch.com/t/more-flexible-embeds/2925 -->

<!-- Don't attempt to load Glitch if we're screenshot testing. -->

{% if site.percy %}

<div style="background: aquamarine; width: 400px; height: 400px;">Glitch marcador de posición de iframe</div> {% else %} {% Glitch {id: 'tabindex-zero', ruta: 'index.html'}%} {% endif %}

## Imágenes

Vea la publicación de [Imágenes y video.](/handbook/markup-media)

## Instrucciones

El componente Instruction proporciona instrucciones de uso común para Glitch y Chrome DevTools. Utilice el componente Instrucción siempre que sea posible para ayudar a garantizar la coherencia del contenido y facilitar el mantenimiento entre sitios.

De forma predeterminada, cada instrucción se coloca en un elemento de lista desordenado. Para usar una lista ordenada, agregue un argumento `ol` al código abreviado. Para usar un párrafo, agregue un argumento `none`. Consulte la [sección Listas de la publicación Gramática, mecánica y uso](/handbook/grammar/#lists) para obtener información sobre cuándo usar cada tipo de lista.

Las instrucciones se pueden unir para crear procesos de varios pasos.

### Instrucciones de Glitch

Las instrucciones de Glitch más comunes explican cómo obtener una vista previa de una aplicación de muestra de Glitch mediante el uso de los argumentos `remix` y `preview` en dos códigos abreviados de `Instruction`:

```html
{% raw %}{% Instruction 'remix' %}
{% Instruction 'preview' %}{% endraw %}
```

{% Instruction 'remix', 'ol' %} {% Instruction 'preview', 'ol' %}

Para explicar cómo abrir la consola Glitch, use el argumento  `console`:

{% Instruction 'console', 'ol' %}

Para explicar cómo crear un nuevo archivo en un Glitch, use el argumento `create`:

{% Instruction 'create', 'ol' %}

Para explicar cómo ver el código fuente de un Glitch, use el argumento `source`:

{% Instruction 'source' %}

### Recarga de la página

Hay tres formas de indicar a los usuarios que vuelvan a cargar la página.

Si los usuarios están recargando una aplicación, use el argumento `reload-app`:

{% Instruction 'reload-app' %}

Si los usuarios están recargando una página web tradicional, use el argumento `reload-page`:

{% Instruction 'reload-page' %}

Si los usuarios están recargando una página con el propósito de crear perfiles, use el argumento de `start-profiling`:

{% Instruction 'start-profiling' %}

### Instrucciones de DevTools

Indique a los usuarios cómo acceder a cualquier pestaña en DevTools utilizando el argumento `devtools-tabName` en el código abreviado de Instrucción. Por ejemplo, estas son las instrucciones para la pestaña **Rendimiento**:

{% Instruction 'devtools-performance', 'ol' %}

Si solo necesita que los usuarios abran DevTools, use el argumento `devtools`.

{% Instruction 'devtools' %}

Para decirles a los usuarios cómo abrir el menú de **Command** de DevTools, use el argumento `devtools-command`:

{% Instruction 'devtools-command', 'ol' %}

Para decirles a los usuarios cómo deshabilitar la caché, use esta secuencia:

```html
{% raw %}{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}{% endraw %}
```

{% Instruction 'devtools-network', 'ol' %} {% Instruction 'disable-cache', 'ol' %}

Indique a los usuarios cómo ejecutar una auditoría en Lighthouse utilizando el argumento `audit-auditName` en el código abreviado de Instruction. Por ejemplo, aquí están las instrucciones para la auditoría de **desempeño:**:

{% Instruction 'audit-performance', 'ol' %}

## Etiquetas

Las etiquetas se pueden utilizar para mostrar un nombre de archivo asociado con un fragmento de [código.](/handbook/markup-code)

````text
{% raw %}{% Label %}filename.js:{% endLabel %}{% endraw %}

```js
console.log('hello');
```
````

{% Label %}filename.js:{% endLabel %}

```js
console.log('hello');
```

## Listas

Consulte la [sección Listas de la publicación Gramática, mecánica y uso](/handbook/grammar/#lists) para obtener información sobre cuándo usar cada tipo de lista.

Utilice la sintaxis estándar de Markdown para listas: `1.` para listas ordenadas y `-` para listas desordenadas.

### Lista ordenada

```md
1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…
1. Lorem ipsum dolor sit amet…
```

1. Lorem ipsum dolor sit amet…
2. Lorem ipsum dolor sit amet…
3. Lorem ipsum dolor sit amet…

### Lista no ordenada

```md
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
```

- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…
- Lorem ipsum dolor sit amet…

### Lista de definiciones

```md
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
```

Primer término: esta es la definición del primer término.

Segundo término: esta es una definición del segundo término. : Esta es otra definición del segundo término.

## Stats

Utilice el componente Stats para obtener estadísticas importantes sobre un producto o servicio que se comenta en una publicación. (Las estadísticas se utilizan principalmente en estudios de casos).

No incluya más de cuatro estadísticas en un solo componente Stat para evitar problemas de diseño.

[Especificación detallada](/design-system/component/stats/)

```html
<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">
      30
      <sub>%</sub>
    </p>
    <p>Lower cost per conversion</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      13
      <sub>%</sub>
    </p>
    <p>Higher CTR</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">
      4
      <sub>x</sub>
    </p>
    <p>Faster load times</p>
  </div>
</ul>
```

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">30 <sub>%</sub></p>
    <p>Menor costo por conversión</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">13 <sub>%</sub></p>
    <p>CTR más alto</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">4 <sub>x</sub></p>
    <p>Tiempos de carga más rápidos</p>
  </div>
</ul>

Componente Stats con la clase de utilidad aplicada `bg-state-good-bg color-state-good-text`:

<ul class="stats bg-state-good-bg color-state-good-text">
  <div class="stats__item">
    <p class="stats__figure">30 <sub>%</sub></p>
    <p>Menor costo por conversión</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">13 <sub>%</sub></p>
    <p>CTR más alto</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">4 <sub>x</sub></p>
    <p>Tiempos de carga más rápidos</p>
  </div>
</ul>

## Tablas

Utilice el marcado a continuación para crear una tabla. *No* utilice la sintaxis Markdown; no incluye el elemento wrapper necesario para garantizar un espacio en blanco correcto alrededor de la tabla.

[Especificación detallada](/design-system/component/tables/)

```html
<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Image Format</th>
        <th>Lossy Plugin(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="#">imagemin-mozjpeg</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="#">imagemin-pngquant</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="#">imagemin-giflossy</a></td>
      </tr>
    </tbody>
    <caption>
      Imagemin plugins for filetypes.
    </caption>
  </table>
</div>
```

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Formato de imagen</th>
        <th>Complemento (s) con pérdida</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="#">imagemin-mozjpeg</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="#">imagemin-pngquant</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="#">imagemin-giflossy</a></td>
      </tr>
    </tbody>
    <caption>Complementos de Imagemin para tipos de archivo.</caption>
  </table>
</div>

<div class="table-wrapper scrollbar">
  <table data-alignment="top">
    <thead>
      <tr>
        <th>Herramienta</th>
        <th>Resumen</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Faro</td>
        <td>
          <ul>
            <li>Estimaciones para diferentes tipos de recursos según su tamaño o recuento.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>paquete web</td>
        <td>
          <ul>
            <li>Estimaciones basadas en tamaños de activos generados por webpack</li>
            <li>Comprueba tamaños sin comprimir</li>
          </ul>
        </td>
      </tr>
    </tbody>
    <caption>Una tabla con el contenido de la celda alineado verticalmente por la excepción de alineación de datos = "superior".</caption>
  </table>
</div>

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Opción 1</th>
        <th>Opcion 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td>
<code>@font-face {
  font-family: Helvetica;
  &lt;strong&gt;font-display: swap;&lt;/strong&gt;
}
</code>
        </td>
      </tr>
    </tbody>
    <caption>Tabla usando un elemento "code".</caption>
  </table>
</div>

<div class="table-wrapper">
  <table>
    <tbody>
      <tr>
        <th>Red</th>
        <th>Dispositivo</th>
        <th>JS</th>
        <th>Imágenes</th>
        <th>CSS</th>
        <th>HTML</th>
        <th>Fuentes</th>
        <th>Total</th>
        <th>Estimado de Tiempo para ser interactivo</th>
      </tr>
      <tr>
        <td>3G lento</td>
        <td>Moto G4</td>
        <td>100</td>
        <td>30</td>
        <td>10</td>
        <td>10</td>
        <td>20</td>
        <td>~ 170 KB</td>
        <td>5 s</td>
      </tr>
      <tr>
        <td>4G lento</td>
        <td>Moto G4</td>
        <td>200</td>
        <td>50</td>
        <td>35</td>
        <td>30</td>
        <td>30</td>
        <td>~ 345 KB</td>
        <td>3 s</td>
      </tr>
      <tr>
        <td>Wifi</td>
        <td>Escritorio</td>
        <td>300</td>
        <td>250</td>
        <td>50</td>
        <td>50</td>
        <td>100</td>
        <td>~ 750 KB</td>
        <td>2 s</td>
      </tr>
    </tbody>
    <caption>Las tablas se desplazan cuando su ancho es mayor que el de la columna de contenido.</caption>
  </table>
</div>

## Pestañas

Utilice el componente web `web-tabs` para mostrar contenido que haga referencia a diferentes plataformas o idiomas. Cada hijo del componente `web-tabs` se convertirá en una pestaña independiente. Utilice el atributo `data-label` para establecer el título de la pestaña. Puede utilizar markdown dentro de la pestaña, por ejemplo, los bloques de código.

```html
{% raw %}
<web-tabs>
  <div data-label="html">
    ```html
    <p> I'm html</p>
    ```
  </div>
  <div data-label="css">
    ```css
    .class { border: 0; }
    ```
  </div>
</web-tabs>
{% endraw %}
```

<web-tabs>
  <div data-label="html" title="t"></div>
<pre data-md-type="block_code" data-md-language="html"><code class="language-html">&lt;p&gt; I'm html&lt;/p&gt;
</code></pre>
<div data-md-type="block_html">  </div>
  <div data-label="css"></div>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.class { border: 0; }
</code></pre>
<div data-md-type="block_html">  </div></web-tabs>

## Descripción flotante

Utilice descripciones flotantes para dar información sobre los controles de la interfaz de usuario que son demasiado pequeños para tener una etiqueta

[Especificación detallada](/design-system/component/tooltips/)

```html
<div class="tooltip" data-alignment="">
  <button class="fab" aria-labelledby="mytooltip">
    {% raw %}{% include "icons/plus.svg" %}{% endraw %}
  </button>
  <span class="tooltip__content" role="tooltip" id="mytooltip"
    >Standard alignment</span
  >
</div>
```

<div class="tooltip" data-alignment="right">
  <button class="fab" aria-labelledby="mytooltip">{% include "icons/plus.svg" %}</button>
  <span class="tooltip__content" role="tooltip" id="mytooltip">Alineación a la derecha</span>
</div>

<div class="tooltip" data-alignment="">
  <button class="fab" aria-labelledby="mytooltip">{% include "icons/plus.svg" %}</button>
  <span class="tooltip__content" role="tooltip" id="mytooltip">Alineación estándar</span>
</div>

## Video / YouTube {: #video }

Vea la publicación de [Imágenes y video.](/handbook/markup-media)

# Componentes obsoletos

## w-botones

En general, no debería necesitar agregar botones a sus publicaciones. Estos botones se muestran como referencia.

### Botones de texto

<div>
  <button class="w-button">Botón de texto</button>
  <button class="w-button w-button--with-icon" data-icon="file_download">Botón de texto con icono</button>
</div>
<br>

<div>
  <button class="w-button w-button--primary">Botón principal</button>
  <button class="w-button w-button--primary w-button--with-icon" data-icon="file_download">Botón principal con icono</button>
</div>
<br>

<div>
  <button class="w-button w-button--secondary">Botón secundario</button>
  <button class="w-button w-button--secondary w-button--with-icon" data-icon="file_download">Botón secundario con icono</button>
</div>

### Botones de icono

Un botón de icono predeterminado:

<div>
  <button class="w-button--icon" data-icon="format_align_justify">
    <span role="tooltip" class="w-tooltip">Justificar</span>
  </button>
</div>

Un botón de icono redondo:

<div>
  <button class="w-button--icon w-button--round" data-icon="close">
    <span role="tooltip" class="w-tooltip">Cerca</span>
  </button>
</div>

## w-columns

Cualquier elemento se puede colocar en un diseño de dos columnas envolviéndolos en un elemento `<div class="w-columns">` :

```html
<div class="w-columns">
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
  <figure>
    <img src="./image-small.png" alt="">
    <figcaption>
      Small image.
    </figcaption>
  </figure>
</div>
```

<div class="w-columns">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %} <figcaption> Imagen pequeña.</figcaption></figure>
  <figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/amwrx4HVBEVTEzQspIWw.png", alt="", width="800", height="155" %} <figcaption> Imagen pequeña.</figcaption></figure>
</div>

En tamaños de ventana gráfica más pequeños, los elementos en un diseño de dos columnas cambiarán a una disposición apilada.
