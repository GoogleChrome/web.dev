---
layout: post
title: La página no contiene un encabezado, saltos de enlace ni puntos de referencia.
description: |2-

  Aprende a mejorar la accesibilidad de tu página web incorporándo

  tecnologías de asistencia para omitir elementos de navegación repetidos.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - bypass
---

Para los usuarios que no pueden usar un mouse, el contenido que se repite en las páginas de su sitio puede dificultar la navegación. Por ejemplo, los usuarios de lectores de pantalla pueden tener que moverse a través de muchos enlaces en un menú de navegación para llegar al contenido principal de la página.

Proporcionar una forma de omitir el contenido repetitivo facilita la navegación sin mouse.

## Cómo falla esta auditoría de Lighthouse

Lighthouse marca las páginas que no ofrecen una forma de omitir el contenido repetitivo:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fJBo4Nbmlks8cj5i2UMJ.png", alt="Lighthouse audit showing page doesn't contain a heading, skip link, or landmark region", width="800", height="185" %}</figure>

Lighthouse comprueba que la página contenga al menos uno de los siguientes elementos:

- Un elemento `<header>`
- Un [salto de enlace](/headings-and-landmarks#bypass-repetitive-content-with-skip-links)
- Un [punto de referencia](/headings-and-landmarks/#use-landmarks-to-aid-navigation)

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo mejorar la navegación con el teclado

Pasar la auditoría de Lighthouse es muy fácil: agrega un encabezado, un [salto de enlace](/headings-and-landmarks#bypass-repetitive-content-with-skip-links) o un [punto de referencia](/headings-and-landmarks/#use-landmarks-to-aid-navigation) a tu página.

Sin embargo, para mejorar significativamente la experiencia de navegación de los usuarios de tecnologías de asistencia,

- Coloca todo el contenido de la página dentro de un elemento de referencia.
- Asegúrate de que cada punto de referencia refleje con precisión el tipo de contenido que comprende.
- Proporciona un salto de enlace.

{% Aside %} Si bien la mayoría de los lectores de pantalla permiten a los usuarios navegar por puntos de referencia, otras tecnologías de asistencia, como los [dispositivos de conmutación](https://en.wikipedia.org/wiki/Switch_access), solo permiten que los usuarios se muevan a través de cada elemento en el orden de tabulación de uno en uno. Por lo tanto, es importante proporcionar puntos de referencia y omitir enlaces siempre que sea posible. {% endAside %}

En este ejemplo, todo el contenido está dentro de un punto de referencia, los encabezados crean un esquema del contenido de la página, no se omiten títulos y se proporciona un salto de enlace para omitir el menú de navegación:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document title</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <a class="skip-link" href="#maincontent">Skip to main</a>
    <h1>Page title</h1>
    <nav>
      <ul>
        <li>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
          <a href="https://google.com">Nav link</a>
        </li>
      </ul>
    </nav>
    <main id="maincontent">
      <section>
        <h2>Section heading</h2>
	      <p>
	        Bacon ipsum dolor amet brisket meatball chicken, cow hamburger pork belly
	        alcatra pig chuck pork loin jerky beef tri-tip porchetta shank. Kevin porchetta
	        landjaeger, ribeye bacon strip steak pork chop tenderloin andouille.
	      </p>
        <h3>Sub-section heading</h3>
          <p>
            Prosciutto pork chicken chuck turkey tongue landjaeger shoulder picanha capicola
            ball tip meatball strip steak venison salami. Shoulder frankfurter short ribs
            ham hock, ball tip pork chop tenderloin beef ribs pastrami filet mignon.
          </p>
      </section>
    </main>
  </body>
</html>
```

Por lo general, no deseas mostrar el salto de enlace a los usuarios del mouse, por lo que es convencional usar CSS para ocultarlo fuera de la pantalla hasta que reciba el [foco](/keyboard-access/#focus-and-the-tab-order):

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

Consulta sobre [Encabezados y puntos de referencia](/headings-and-landmarks) para obtener más información.

## Recursos

- [El código fuente de **la página no contiene un encabezado, un salto de enlace ni una** auditoría de puntos de referencia.](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/bypass.js)
- [La página debe tener los medios para evitar los bloques repetidos (Universidad de Deque)](https://dequeuniversity.com/rules/axe/3.3/bypass)
