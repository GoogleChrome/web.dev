---
title: Herencia
description: 
  Algunas propiedades CSS se heredan si no especifica un valor para ellas.
  Descubra cómo funciona esto y cómo utilizarlo en su beneficio en este módulo.
audio:
  title: 'El Podcast de CSS - 005: Herencia'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_005_v1.2.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-02
---

Digamos que acaba de escribir algo de CSS para que los elementos parezcan un botón.

```html
<a href="http://example.com" class="my-button">I am a button link</a>
```

```css
.my-button {
  display: inline-block;
  padding: 1rem 2rem;
  text-decoration: none;
  background: pink;
  font: inherit;
  text-align: center;
}
```

Luego agrega un elemento de enlace a un artículo de contenido, con un valor `.my-button` para `class`. Sin embargo, hay un problema, el texto no tiene el color que esperaba. ¿Cómo pasó esto?

Algunas propiedades CSS se heredan si no especifica un valor para ellas. En el caso de este botón, **heredó** el `color` de este CSS:

```css
article a {
  color: maroon;
}
```

En esta lección, aprenderá por qué sucede eso y cómo la herencia es una característica poderosa para ayudarlo a escribir menos CSS.

<figure>{% Codepen { user: 'web-dot-dev', id: 'zYNGEbg', height: 400 } %}</figure>

## Flujo de la herencia

Echemos un vistazo a cómo funciona la herencia, mediante este fragmento de HTML:

```html
<html>
  <body>
    <article>
      <p>Lorem ipsum dolor sit amet.</p>
    </article>
  </body>
</html>
```

El elemento raíz (`<html>`) no heredará nada porque es el primer elemento del documento. Agregue algo de CSS en el elemento HTML y comenzará a heredarse en cascada por el documento.

```css
html {
  color: lightslategray;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'JjEKgBX', height: 200 } %}</figure>

La propiedad `color` es heredada por otros elementos. El elemento `html` tiene un valor `color: lightslategray`, por lo tanto, todos los elementos que pueden heredar el color ahora tendrán un color `lightslategray`.

```css
body {
  font-size: 1.2em;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'VwPLrLP', height: 200 } %}</figure>

{% Aside %} Debido a que esta demostración establece el tamaño de fuente en el elemento `body`, el elemento `html` aún tendrá el tamaño de fuente inicial establecido por el navegador (hoja de estilo del agente de usuario), pero los elementos `article` y `p` heredarán el tamaño de fuente declarado por el elemento `body`. Esto se debe a que la herencia solo desciende en cascada. {% endAside %}

```css
p {
  font-style: italic;
}
```

Solo el elemento `<p>` tendrá texto en cursiva porque es el elemento anidado más profundo. La herencia solo fluye hacia abajo, no hacia los elementos principales.

<figure>{% Codepen { user: 'web-dot-dev', id: 'JjEKgmK', tab: 'css,result', height: 400 } %}</figure>

## ¿Qué propiedades son heredables?

No todas las propiedades CSS son heredables, pero hay muchas que sí lo son. Como referencia, esta es la lista completa de propiedades heredables, tomada de la referencia W3 de todas las propiedades CSS:

- [azimut](https://developer.mozilla.org/docs/Web/SVG/Attribute/azimuth)
- [border-collapse](https://developer.mozilla.org/docs/Web/CSS/border-collapse)
- [border-spacing](https://developer.mozilla.org/docs/Web/CSS/border-spacing)
- [caption-side](https://developer.mozilla.org/docs/Web/CSS/caption-side)
- [color](https://developer.mozilla.org/docs/Web/CSS/color)
- [cursor](https://developer.mozilla.org/docs/Web/CSS/cursor)
- [direction](https://developer.mozilla.org/docs/Web/CSS/direction)
- [empty-cells](https://developer.mozilla.org/docs/Web/CSS/empty-cells)
- [font-family](https://developer.mozilla.org/docs/Web/CSS/font-family)
- [font-size](https://developer.mozilla.org/docs/Web/CSS/font-size)
- [font-style](https://developer.mozilla.org/docs/Web/CSS/font-style)
- [font-variant](https://developer.mozilla.org/docs/Web/CSS/font-variant)
- [font-weight](https://developer.mozilla.org/docs/Web/CSS/font-weight)
- [font](https://developer.mozilla.org/docs/Web/CSS/font)
- [letter-spacing](https://developer.mozilla.org/docs/Web/CSS/letter-spacing)
- [line-height](https://developer.mozilla.org/docs/Web/CSS/line-height)
- [list-style-image](https://developer.mozilla.org/docs/Web/CSS/list-style-image)
- [list-style-position](https://developer.mozilla.org/docs/Web/CSS/list-style-position)
- [list-style-type](https://developer.mozilla.org/docs/Web/CSS/list-style-type)
- [list-style](https://developer.mozilla.org/docs/Web/CSS/list-style)
- [orphans](https://developer.mozilla.org/docs/Web/CSS/orphans)
- [quotes](https://developer.mozilla.org/docs/Web/CSS/quotes)
- [text-align](https://developer.mozilla.org/docs/Web/CSS/text-align)
- [text-indent](https://developer.mozilla.org/docs/Web/CSS/text-indent)
- [text-transform](https://developer.mozilla.org/docs/Web/CSS/text-transform)
- [visibility](https://developer.mozilla.org/docs/Web/CSS/visibility)
- [white-space](https://developer.mozilla.org/docs/Web/CSS/white-space)
- [widows](https://developer.mozilla.org/docs/Web/CSS/widows)
- [word-spacing](https://developer.mozilla.org/docs/Web/CSS/word-spacing)

## Cómo funciona la herencia

Cada elemento HTML tiene todas las propiedades CSS definidas por defecto con un valor inicial. Un valor inicial es una propiedad que no se hereda y aparece como predeterminada si la cascada no calcula un valor para ese elemento.

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/OvoYqOMcdFZL7wJQIL2C.mp4" %}</figure>

Las propiedades que se pueden heredar descienden en cascada y los elementos secundarios obtendrán un valor calculado que representa el valor de sus primarios. Esto significa que si un primario tiene el elemento `font-weight` establecido en `bold`, todos los elementos secundarios estarán en negrita, a menos que su elemento `font-weight` se establezca en un valor diferente, o la hoja de estilo del agente de usuario tenga un valor `font-weight` para ese elemento.

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgGPOZ' } %}</figure>

## Cómo heredar y controlar explícitamente la herencia

La herencia puede afectar los elementos de formas inesperadas, por lo que CSS tiene herramientas para ayudar con eso.

### La palabra clave `inherit`

Puede hacer que cualquier propiedad herede el valor calculado de su elemento primario con la palabra clave `inherit`. Una forma útil de usar esta palabra clave es crear excepciones.

```css
strong {
  font-weight: 900;
}
```

Este fragmento de CSS establece que todos los elementos `<strong>` tengan un `font-weight` de `900`, en lugar del valor `bold` predeterminado, que sería el equivalente a `font-weight: 700`.

```css
.my-component {
  font-weight: 500;
}
```

En su lugar, la clase `.my-component` establece el valor `font-weight` en `500`. Para hacer que los elementos `<strong>` dentro de `.my-component` también tengan `font-weight: 500` agregue:

```css
.my-component strong {
  font-weight: inherit;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'eYgNedO', height: 400 } %}</figure>

Ahora, los elementos `<strong>` dentro de `.my-component` tendrán un `font-weight` igual a `500`.

Puede establecer explícitamente este valor, pero si usa `inherit` y el CSS de `.my-component` cambia en el futuro, puede garantizar que su `<strong>` se mantendrá actualizado automáticamente con eso.

### La palabra clave `initial`

La herencia puede causar problemas con sus elementos y la palabra clave `initial` proporciona una poderosa opción de reinicio.

Aprendió anteriormente que cada propiedad tiene un valor predeterminado en CSS. La palabra clave `initial` establece una propiedad de nuevo a ese valor predeterminado inicial.

```css
aside strong {
  font-weight: initial;
}
```

Este fragmento eliminará el peso en negrita de todos los elementos `<strong>` dentro de un elemento `<aside>` y, en su lugar, los convertirá en un peso normal, que es el valor inicial.

<figure>{% Codepen { user: 'web-dot-dev', id: 'OJWVORZ', tab: 'css,result', height: 300 } %}</figure>

### La palabra clave `unset`

La propiedad `unset` se comporta de manera diferente si una propiedad es heredable o no. Si una propiedad es heredable, la palabra clave `unset` se comportará lo mismo que `inherit`. Si la propiedad no es heredable, la palabra clave `unset` se comporta igual que `initial`.

Recordar qué propiedades CSS son heredables puede ser difícil, pero `unset` puede ser útil en ese contexto. Por ejemplo, `color` es heredable, pero `margin` no lo es, por lo que puede escribir esto:

```css
/* Estilos de color globales para párrafos en CSS creado */
p {
  margin-top: 2em;
  color: goldenrod;
}

/* La p debe restablecerse en asides, para que pueda usar unset */
aside p {
  margin: unset;
  color: unset;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'JjEdpjw', tab: 'css,result', height: 400 } %}</figure>

Ahora, el `margin` se elimina y el `color` vuelve a ser el valor calculado heredado.

También puede utilizar el valor `unset` con la propiedad `all`. De regreso al ejemplo anterior, ¿qué sucede si los estilos `p` globales obtienen algunas propiedades adicionales? Solo se aplicará la regla que se estableció para los parámetros `margin` y `color`.

```css/5-6
/* Estilos de color globales para párrafos en CSS creado */
p {
	margin-top: 2em;
	color: goldenrod;
	padding: 2em;
	border: 1px solid;
}

/* No todas las propiedades se tienen más en cuenta */
aside p {
	margin: unset;
	color: unset;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'bGgdLNB', tab: 'css,result' } %}</figure>

Si en vez de ello, cambia la regla `aside p` a `all: unset`, no importa qué estilos globales se apliquen a `p` en el futuro, siempre estarán desactivados.

```css/2-3
aside p {
	margin: unset;
	color: unset;
	all: unset;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWpbZbB', tab: 'css,result' } %}</figure>

{% Assessment 'conclusion' %}

## Recursos

- [Referencia de MDN en valores calculados](https://developer.mozilla.org/docs/Web/CSS/computed_value)
- [Un artículo sobre cómo la herencia puede ser útil en front-end modulares](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/)
