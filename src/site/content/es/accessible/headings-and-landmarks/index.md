---
layout: post
title: Encabezados y landmarks
authors:
  - robdodson
date: 2018-11-18
description: Al utilizar los elementos correctos para los títulos y los landmark, puedes mejorar la experiencia de navegación para los usuarios de tecnología de asistencia
---

{% include 'content/why-headings.njk' %}

## Utiliza encabezados para delinear la página

Utiliza los elementos de `h1` - `h6` para crear un esquema *estructural* para tu página. El objetivo es crear un esqueleto o un andamiaje de la página de modo que cualquiera que navegue por los encabezados pueda formarse una imagen mental.

Una práctica común es usar un solo `h1` para el título principal o el logotipo de una página, los `h2`  para designar las secciones principales y las `h3` en las subsecciones de apoyo:

```html
<h1>Company name</h1>
<section>
  <h2>Section Heading</h2>
  …
  <h3>Sub-section Heading</h3>
</section>
```

## No te saltes los niveles de encabezado

Los desarrolladores a menudo omiten los niveles de encabezado para usar los estilos predeterminados del navegador que se asemejan mucho a su diseño. Esto se considera un anti-patrón porque rompe el esquema del modelo.

En lugar de depender del tamaño de fuente predeterminado del navegador para los títulos, usa tu propio CSS y no omitas niveles.

Por ejemplo, este sitio tiene una sección llamada "IN THE NEWS (EN LAS NOTICIAS)", seguida de dos titulares:

{% Img src="image/admin/CdBjBuUo2yVVHWVFnQzx.png", alt="Un sitio de noticias con un título, una imagen principal y subsecciones.", width="800", height="414" %}

El título de la sección, "IN THE NEWS", podría ser un `h2` y ambos titulares de apoyo podrían ser `h3`.

Debido a que el `font-size` de "IN THE NEWS" es *más pequeño* que el título, puede ser tentador convertir el título de la primera historia en un `h2` y convertir "IN THE NEWS" a un `h3`. Si bien eso puede coincidir con el estilo predeterminado del navegador, ¡rompería el esquema transmitido a un usuario de lector de pantalla!

{% Aside %} Aunque pueda parecer contradictorio, no importa si *visualmente* `h3` y `h4` son más grandes que sus contrapartes `h2` o `h1`. Lo que importa es el esquema, sus elementos y su orden. {% endAside %}

Puedes utilizar Lighthouse para comprobar si tu página omite algún nivel de encabezado. Ejecuta la auditoría de accesibilidad (**Lighthouse > Opciones > Accesibilidad**) y busca los resultados de la auditoría de **los encabezados no omiten niveles**.

## Usa landmarks para ayudar a la navegación

Los elementos HTML5 como `main` , `nav` y `aside` actúan como **landmarks (puntos de referencia)** o regiones especiales en la página a las que puede saltar un lector de pantalla.

Utiliza etiquetas de landmark para definir las secciones principales de tu página en lugar de depender de los `div`. Ten cuidado de no exagerar porque tener *demasiados* puntos de referencia puede ser abrumador. Por ejemplo, limita el uso a un solo elemento de `main` en lugar de 3 o 4.

Lighthouse recomienda auditar manualmente tu sitio para comprobar que "los landmark HTML5 se utilizan para mejorar la navegación". Puedes utilizar esta [lista de elementos landmarks](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html) para comprobar tu página.

## Evita el contenido repetitivo con enlaces de omisión

Muchos sitios contienen navegación repetitiva en sus encabezados, lo que puede resultar molesto para navegar con tecnología de asistencia. Utiliza un **enlace de omisión (skip link)** para permitir que los usuarios omitan este contenido.

Un enlace de omisión es un ancla fuera de la pantalla que siempre es el primer elemento enfocable en el DOM. Normalmente, contiene un enlace en la página al contenido principal de la página. Debido a que es el primer elemento del DOM, solo se necesita una acción de la tecnología de asistencia para enfocarlo y evitar la navegación repetitiva.

```html
<!-- index.html -->
<a class="skip-link" href="#main">Skip to main</a>
…
<main id="main">
  [Main content]
</main>
```

```css
/* style.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

{% Aside 'codelab' %} [Ejemplo de enlace de omisión en vivo.](https://skip-link.glitch.me/) {% endAside %}

Muchos sitios populares como [GitHub](https://github.com/), [The NY Times](https://www.nytimes.com/) y [Wikipedia](https://wikipedia.org/) contienen enlaces de omisión. Intenta visitarlos y presiona la tecla de `TAB` en tu teclado varias veces.

Lighthouse puede ayudarte a verificar si tu página contiene un enlace de omisión. Vuelve a ejecutar la auditoría de accesibilidad y busca los resultados de la auditoría **La página contiene un encabezado, un enlace de omisión o una región landmark**.

{% Aside %} Técnicamente, esta prueba también se aprobará si tu sitio contiene elementos `h1` - `h6` o cualquiera de los landmark HTML5. Pero aunque la prueba es algo inexacta en sus requisitos, ¡es bueno pasarla si es posible! {% endAside %}
