---
layout: post
title: Etiquetas y texto alternativo
authors:
  - robdodson
date: 2018-11-18
description: |-
  Para que un lector de pantalla presente una interfaz de usuario hablada al usuario, los elementos significativos deben tener etiquetas adecuadas o texto alternativo. Una etiqueta o el texto alternativo le da a un elemento su nombre accesible, una de las propiedades clave
  para expresar la semántica de los elementos en el árbol de accesibilidad.
---

Para que un lector de pantalla presente una interfaz de usuario hablada al usuario, los elementos significativos deben tener etiquetas adecuadas o texto alternativo. Una etiqueta o el texto alternativo le da a un elemento su **nombre** accesible, una de las propiedades clave para [expresar la semántica del elemento en el árbol de accesibilidad](/semantics-and-screen-readers/#semantic-properties-and-the-accessibility-tree).

Cuando el nombre de un elemento se combina con la **función** del elemento, le da al usuario un contexto para que pueda entender con qué tipo de elemento está interactuando y cómo se representa en la página. Si no hay un nombre, un lector de pantalla solo anuncia la función del elemento. Imagínese intentar navegar por una página y escuchar "botón", "casilla de verificación", "imagen" sin ningún contexto adicional. Es por eso que las etiquetas y el texto alternativo son cruciales para una experiencia buena y accesible.

## Inspeccionar el nombre de un elemento

Es fácil verificar el nombre accesible de un elemento usando DevTools de Chrome:

1. Haga clic derecho en un elemento y elija **Inspeccionar**. Esto abre el panel Elementos de DevTools.
2. En el panel Elementos, busque el panel **Accesibilidad.** Puede estar oculto detrás de un símbolo `»`.
3. En el menú desplegable**{nbsp}Propiedades computadas**, busque la propiedad **Nombre**.

<figure>{% Img src="image/admin/38c68DmamTCqt2LFxTmu.png", alt="", width="800", height="471" %} <figcaption> Panel de accesibilidad de DevTools que muestra el nombre de un botón.</figcaption></figure>

{% Aside %} Para obtener más información, consulte la [Referencia de accesibilidad de DevTools](https://developer.chrome.com/docs/devtools/accessibility/reference/). {% endAside %}

Ya sea que esté viendo un `img` con texto `alt` o un `input` con `label`, todos estos escenarios dan el mismo resultado: brindarle a un elemento su nombre accesible.

## Revisar si faltan nombres

Hay diferentes formas de agregar un nombre accesible a un elemento, según su tipo. La siguiente tabla enumera los tipos de elementos más comunes que necesitan nombres accesibles y enlaces a explicaciones sobre cómo agregarlos.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Tipo de elemento</th>
        <th>Cómo agregar un nombre</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Documento HTML</td>
        <td><a href="#label-documents-and-frames">Etiquetar documentos y marcos</a></td>
      </tr>
      <tr>
        <td>Elementos <code>&lt;frame&gt;</code> o <code>&lt;iframe&gt;</code>
</td>
        <td><a href="#label-documents-and-frames">Etiquetar documentos y marcos</a></td>
      </tr>
      <tr>
        <td>Elementos de la imagen</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir texto alternativo para imágenes y objetos</a></td>
      </tr>
      <tr>
        <td>Elementos <code>&lt;input type="image"&gt;</code>
</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir texto alternativo para imágenes y objetos</a></td>
      </tr>
      <tr>
        <td>Elementos <code>&lt;object&gt;</code>
</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">Incluir texto alternativo para imágenes y objetos</a></td>
      </tr>
      <tr>
        <td>Botones</td>
        <td><a href="#label-buttons-and-links">Etiquetar botones y enlaces</a></td>
      </tr>
      <tr>
        <td>Enlaces</td>
        <td><a href="#label-buttons-and-links">Etiquetar botones y enlaces</a></td>
      </tr>
      <tr>
        <td>Elementos de formulario</td>
        <td><a href="#label-form-elements">Etiquetar elementos de formulario</a></td>
      </tr>
    </tbody>
  </table>
</div>

## Etiquetar documentos y marcos

Cada página debe tener un elemento [`title`](https://developer.mozilla.org/docs/Web/HTML/Element/title) que explique brevemente de qué trata la página. El elemento `title` le da a la página su nombre accesible. Cuando un lector de pantalla ingresa a la página, este es el primer texto que se anuncia.

Por ejemplo, la página siguiente tiene el título "Mary's Maple Bar Fast-Baking Recipe":

```html/3
<!doctype html>
  <html lang="en">
    <head>
      <title>Mary's Maple Bar Fast-Baking Recipe</title>
    </head>
  <body>
    …
  </body>
</html>
```

{% Aside %} Para obtener sugerencias sobre cómo escribir títulos eficaces, consulte la [guía para escribir títulos descriptivos](/write-descriptive-text). {% endAside %}

De manera similar, cualquier elemento `frame` o `iframe` debe tener atributos de `title`:

```html
<iframe title="An interactive map of San Francisco" src="…"></iframe>
```

Si bien el contenido de un `iframe` puede contener su propio `title` interno, un lector de pantalla generalmente se detiene en el límite del marco y anuncia la función del elemento ("marco") y su nombre accesible, proporcionado por el atributo de `title`. Esto le permite al usuario decidir si desea ingresar al marco o evitarlo.

## Incluir texto alternativo para imágenes y objetos

Un `img` siempre debe ir acompañado de un atributo [`alt`](https://developer.mozilla.org/docs/Web/HTML/Element/img#Attributes) para darle a la imagen su nombre accesible. Si la imagen no se carga, el texto `alt` se utiliza como marcador de posición para que los usuarios tengan una idea de lo que la imagen intentaba transmitir.

Escribir un buen texto `alt` es un arte, pero hay un par de pautas que puedes seguir:

1. Determine si la imagen proporciona contenido que de otro modo sería difícil de obtener leyendo el texto circundante.
2. Si es así, transmita el contenido de la manera más sucinta posible.

Si la imagen actúa como decoración y no proporciona ningún contenido útil, puede asignarle un atributo `alt=""` para eliminarla del árbol de accesibilidad.

{% Aside %} Obtenga más información sobre cómo escribir texto `alt` eficaz consultando la [guía de WebAIM sobre texto alternativo](https://webaim.org/techniques/alttext/). {% endAside %}

### Imágenes como enlaces y entradas

Una imagen envuelta en un enlace debe usar el atributo `alt` de `img` para describir hacia dónde navegará el usuario si hace clic en el enlace:

```html
<a href="https://en.wikipedia.org/wiki/Google">
  <img alt="Google's wikipedia page" src="google-logo.jpg">
</a>
```

De manera similar, si se usa el elemento `<input type="image">` para crear un botón de imagen, debe contener texto `alt` que describa la acción que ocurre cuando el usuario hace clic en el botón:

```html/5
<form>
  <label>
    Username:
    <input type="text">
  </label>
  <input type="image" alt="Sign in" src="./sign-in-button.png">
</form>
```

### Objetos incrustados

Los elementos `<object>`, que normalmente se utilizan para incrustaciones como Flash, PDF o ActiveX, también deben contener texto alternativo. Al igual que en las imágenes, este texto se muestra si el elemento no se procesa. El texto alternativo va dentro del elemento `object` como texto normal, como "Annual report" a continuación:

```html
<object type="application/pdf" data="/report.pdf">
Annual report.
</object>
```

## Etiquetar botones y enlaces

Los botones y enlaces suelen ser cruciales para la experiencia de un sitio, y es importante que ambos tengan nombres accesibles buenos.

### Botones

Un elemento `button` siempre intenta calcular su nombre accesible utilizando su contenido de texto. Para los botones que no son parte de un `form`, escribir una acción clara como el contenido del texto puede ser todo lo que necesita para crear un buen nombre accesible.

```html
<button>Book Room</button>
```

{% Img src="image/admin/tcIDzNpCHS9AlfwflQjI.png", alt="Un formulario móvil con un botón 'Book Room'.", width="800", height="269" %}

Una excepción común a esta regla son los botones de íconos. Un botón de ícono puede utilizar una imagen o una fuente de ícono para proporcionar el contenido de texto del botón. Por ejemplo, los botones que se utilizan en un editor de "Lo que ves es lo que obtienes (WYSIWYG)" para formatear el texto, suelen ser solo símbolos gráficos:

{% Img src="image/admin/ZmQ77kLPbqd5iFOmn4SU.png", alt="Un botón de icono de alineación a la izquierda.", width="800", height="269" %}

Cuando se trabaja con botones de icono, puede resultar útil darles un nombre accesible explícito mediante el atributo `aria-label`. `aria-label` anula cualquier contenido de texto dentro del botón, lo que le permite describir claramente la acción a cualquiera que use un lector de pantalla.

```html
<button aria-label="Left align"></button>
```

### Enlaces

Al igual que los botones, los enlaces obtienen su nombre accesible principalmente de su contenido de texto. Un buen truco al crear un enlace es poner el texto más significativo en el enlace, en lugar de palabras de relleno como "Aquí" o "Leer más".

{% Compare 'worse', 'Sin suficiente descripción' %}

```html
Check out our guide to web performance <a href="/guide">here</a>.
```

{% endCompare %}

{% Compare 'better', 'Contenido útil' %}

```html
Check out <a href="/guide">our guide to web performance</a>.
```

{% endCompare %}

Esto es especialmente útil para los lectores de pantalla que ofrecen accesos directos para enumerar todos los enlaces de la página. Si los enlaces están llenos de texto de relleno repetitivo, estos atajos se vuelven mucho menos útiles:

<figure>{% Img src="image/admin/IPxS2dwHMyGRvGxGi5n2.jpg", alt="El menú de enlaces de VoiceOver se llenó con la palabra 'aquí'.", width = "519", height="469" %} <figcaption>Ejemplo de VoiceOver, un lector de pantalla para macOS, que muestra el menú de navegación por enlaces.</figcaption></figure>

## Etiquetar elementos de formulario

Hay dos formas de asociar una etiqueta con un elemento de formulario, como una casilla de verificación. Cualquiera de los métodos hace que el texto de la etiqueta también se convierta en un objetivo de clic para la casilla de verificación, lo que también es útil para los usuarios de ratón o pantallas táctiles. Para asociar una etiqueta con un elemento, haga lo siguiente:

- Coloque el elemento de entrada dentro de un elemento de etiqueta

```html
<label>
  <input type="checkbox">Receive promotional offers?</input>
</label>
```

- O use la etiqueta de atributo `for` para referirse al `id` del elemento

```html
<input id="promo" type="checkbox"></input>
<label for="promo">Receive promotional offers?</label>
```

Cuando la casilla de verificación se ha etiquetado correctamente, el lector de pantalla puede informar que el elemento tiene la función de casilla de verificación, está en un estado marcado y se llama "Receive promotional offers?" como en el ejemplo de VoiceOver a continuación:

<figure>{% Img src="image/admin/WklT2ymrCmceyrGUNizF.png", alt="Salida de texto de VoiceOver que muestra '¿Recibir ofertas promocionales?'", width="640", height="174" %}</figure>

{% Assessment 'self-assessment' %}
