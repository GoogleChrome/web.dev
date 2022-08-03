---
layout: post
title: Los atributos ARIA no tienen nombres accesibles
description: Aprenda a mejorar la accesibilidad de su página web garantizando que los usuarios de tecnología asistencial puedan acceder a los nombres de los atributos ARIA.
date: 2020-12-08
web_lighthouse:
  - aria-command-name
  - aria-input-field-name
  - aria-meter-name
  - aria-progressbar-name
  - aria-toggle-field-name
  - aria-tooltip-name
  - aria-treeitem-name
tags:
  - accessibility
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

## Cómo Lighthouse identifica los atributos ARIA sin nombres accesibles

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca los artículos ARIA personalizados cuyos nombres no son accesibles para las tecnologías asistenciales:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dnruhkr4IKtq0Pi9Pgny.png", alt="Auditoría de Lighthouse que muestra elementos de alternancia personalizados sin nombres accesibles", width="800", height="259" %}</figure>

Existen 7 auditorías que verifican nombres accesibles, cada una cubre un conjunto diferente de [roles ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex). Los elementos que tienen alguno de los siguientes roles ARIA pero no tienen nombres accesibles harán que esta auditoría falle:

Nombre de la auditoría | Roles ARIA
--- | ---
`aria-command-name` | `button` , `link` , `menuitem`
`aria-input-field-name` | `combobox` , `listbox` `searchbox` , `slider` , `spinbutton` , `textbox`
`aria-meter-name` | `meter`
`aria-progressbar-name` | `progressbar`
`aria-toggle-field-name` | `checkbox` , `menu` , `menuitemcheckbox` , `menuitemradio` , `radio` , `radiogroup` , `switch`
`aria-tooltip-name` | `tooltip`
`aria-treeitem-name` | `treeitem`

{% include 'content/lighthouse-accessibility/use-built-in.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Ejemplo 1: Cómo agregar nombres accesibles a sus campos de alternancia ARIA personalizados

### Opción 1: agregar texto interno al elemento

La forma más sencilla de proporcionar un nombre accesible para la mayoría de los elementos es incluir contenido de texto dentro del elemento.

Por ejemplo, esta casilla de verificación personalizada se anunciará como "Periódico" para los usuarios de tecnología de asistencia:

```html
<div id="checkbox1" role="checkbox">Periódico</div>
```

Con el [patrón de clip](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/) , puede ocultar el texto interno en la pantalla, y aún así anunciarlo por tecnología asistencial. Esto puede resultar especialmente útil si traduce sus páginas para localizarlas.

```html
<a href="/accessible">Learn more <span class="visually-hidden">about accessibility on web.dev</span></a>
```

### Opción 2: agregar el atributo `aria-label` al elemento

Si no puede agregar texto interno, por ejemplo, si no desea que el nombre del elemento sea visible, use el atributo `aria-label`

Este interruptor personalizado se anunciará como "Alternar luz azul" para los usuarios de tecnología asistencial:

```html
<div id="switch1"
    role="switch"
    aria-checked="true"
    aria-label="Alternar luz azul">
    <span>off</span>
    <span>on</span>
</div>
```

### Opción 3: establezca una referencia a otro elemento usando `aria-labelledby`

Utilice el `aria-labelledby` para identificar otro elemento, utilizando su ID, para que sirva como nombre del elemento actual.

Por ejemplo, este botón de `menuitem1Label` menú personalizado se refiere al párrafo menuitem1Label como su etiqueta y se anunciará como "Sans-serif":

```html
<p id="menuitem1Label">Sans-serif</p>
<ul role="menu">
    <li id="menuitem1"
        role="menuitemradio"
        aria-labelledby="menuitem1Label"
        aria-checked="true"></li>
</ul>
```

## Ejemplo 2: Cómo agregar nombres accesibles a sus campos de entrada ARIA personalizados

La forma más sencilla de proporcionar un nombre accesible para la mayoría de los elementos es incluir contenido de texto en el elemento. Sin embargo, los campos de entrada personalizados no suelen tener texto interno, por lo que puede utilizar una de las siguientes estrategias.

### Opción 2: agregar el atributo `aria-label` al elemento

Utilice el atributo `aria-label` para definir el nombre del elemento actual.

Por ejemplo, este cuadro combinado personalizado se anunciará como "país" para los usuarios de tecnología asistencial:

```html
<div id="combo1" aria-label="país" role="combobox"></div>
```

### Opción 2: establezca una referencia a otro elemento usando `aria-labelledby`

Utilice el atributo `aria-labelledby` para identificar otro elemento, utilizando su ID, para que sirva como nombre del elemento actual.

Por ejemplo, este cuadro de búsqueda personalizado se refiere al `searchLabel` como su etiqueta y se anunciará como "Buscar pares de divisas":

```html
<p id="searchLabel">Buscar pares de divisas:</p>
<div id="search"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="searchLabel"></div>
```

## Recursos

- [Código fuente para la auditoría **No todos los campos de alternancia ARIA tienen de nombres accesibles**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-toggle-field-name.js)
- [Los elementos <code>button</code>, <code>link</code>, <code>menuitem</code> deben tener nombres accesibles (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-command-name)
- [Los elementos <code>aria-input-field-name</code> deben tener nombres accesibles (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-input-field-name)
- [El elemento <code>aria-meter-name</code> debe tener un nombre accesible (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-meter-name)
- [El elemento <code>aria-progressbar-name</code> debe tener un nombre accesible (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-progressbar-name)
- [Los campos <code>aria-toggle-field-name</code> deben tener un nombre accesible (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-toggle-field-label)
- [El elemento <code>aria-tooltip-name</code> debe tener un nombre accesible (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-tooltip-name)
- [El elemento <code>aria-treeitem-name</code> debe tener un nombre accesible (Universidad Deque)](https://dequeuniversity.com/rules/axe/4.1/aria-treeitem-name)
- [Etiquetas y alternativas de texto](/labels-and-text-alternatives)
- [Utilice HTML semántico para obtener más beneficios con el teclado](/use-semantic-html)
