---
layout: post
title: Los elementos de referencia HTML5 se utilizan para mejorar la navegación.
description: |2-

  Aprenda a mejorar la accesibilidad de su página web proporcionando elementos de referencia que los usuarios del teclado pueden utilizar para navegar.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - uso-referencias
  - enfoque-administrado
---

Los elementos HTML5 como `main`, `nav` y `aside` actúan como puntos de referencia o regiones especiales en la página a las que los lectores de pantalla y otras tecnologías de asistencia pueden saltar. Al utilizar elementos de referencia, puede mejorar drásticamente la experiencia de navegación en su sitio para los usuarios de tecnologías de asistencia. Obtenga más información en [Elementos de referencia HTML 5 y ARIA](https://dequeuniversity.com/rules/axe/4.1/landmark-one-main) de la Universidad de Deque.

## Cómo verificar puntos de referencia manualmente

Utilice la [lista de elementos de referencia del W3C](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html) para comprobar que cada sección principal de su página esté contenida por un elemento de referencia. Por ejemplo:

```html
<header>
  <p>Put product name and logo here</p>
</header>
<nav>
  <ul>
    <li>Put navigation here</li>
  </ul>
</nav>
<main>
  <p>Put main content here</p>
</main>
<footer>
  <p>Put copyright info, supplemental links, etc. here</p>
</footer>
```

También puede usar herramientas como la <a href="https://accessibilityinsights.io/" rel="noopener">extensión Accessibility Insights</a> de Microsoft para visualizar la estructura de su página y encontrar secciones que no están incluidas en puntos de referencia:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EUH3Yz64EbuAI0GKQoWa.png", alt="Captura de pantalla de web.dev con elementos de referencia resaltados por la extensión Accessibility Insights", width="800", height="534" %}</figure>

## Cómo utilizar los elementos de referencia de forma eficaz

- Utilice elementos de referencia para definir las secciones principales de su página en lugar de depender de elementos genéricos como `<div>` o `<span>`.
- Utilice elementos de referencia para transmitir la estructura de su página. Por ejemplo, el elemento `<main>` debe incluir todo el contenido directamente relacionado con la idea principal de la página, por lo que solo debe haber uno por página. Consulte el [resumen de MDN de los elementos de sección de contenido](https://developer.mozilla.org/docs/Web/HTML/Element#Content_sectioning) para aprender a usar cada elemento de referencia.
- Utilice los elementos de referencia con prudencia. Tener demasiados puede hacer que la navegación sea *más* difícil para los usuarios de tecnología de asistencia porque les impide saltar fácilmente al contenido deseado.

{% Aside %} Si encuentra que su página tiene, por ejemplo, cuatro `<nav>` o diez elementos `<aside>`, eso puede sugerir la necesidad de simplificar su interfaz de usuario o la estructura del contenido, lo que probablemente beneficiará a *todos* los usuarios. {% endAside %}

Consulte el post [Encabezados y elementos de referencia](/headings-and-landmarks) para obtener más información.

## Recursos

- [El código fuente de la auditoría **elementos de referencia HTML5 se utiliza para mejorar la navegación.**](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/accessibility/manual/use-landmarks.js)
- [Elementos de seccionamiento HTML5 (W3C)](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/landmarks/HTML5.html)
- [Elementos de referencia HTML 5 y ARIA (Universidad Deque)](https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/landmarks.html)
