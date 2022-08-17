---
layout: post
title: Los objetivos táctiles no tienen el tamaño adecuado
description: Obtenga más información sobre la auditoría  "Los objetivos táctiles no tienen el tamaño adecuado" de Lighthouse.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

Los objetivos táctiles son las áreas de una página web con las que los usuarios de dispositivos táctiles pueden interactuar. Todos los botones, enlaces y elementos de formulario tienen botones táctiles.

Muchos motores de búsqueda clasifican las páginas en función de su compatibilidad con dispositivos móviles. Asegurarse de que los objetivos táctiles sean lo suficientemente grandes y tengan la separación adecuada entre sí, hace que su página sea más accesible y compatible con dispositivos móviles.

## Cómo fallar la auditoría de objetivos táctiles de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca páginas con objetivos táctiles que son demasiado pequeños o están demasiado juntos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="Auditoría de Lighthouse que muestra objetivos táctiles de tamaño inadecuado", width="800", height="206" %}</figure>

Los objetivos que miden menos de 48 px por 48 px o que están a menos de 8 px de distancia no pasan la auditoría. Cuando la auditoría falla, Lighthouse enumera los resultados en una tabla con tres columnas:

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>Objetivo táctil</strong></td>
        <td>El objetivo táctil que tiene un tamaño inadecuado.</td>
      </tr>
      <tr>
        <td><strong>Tamaño</strong></td>
        <td>El tamaño del rectángulo delimitador del objetivo en pixeles.</td>
      </tr>
      <tr>
        <td><strong>Destino superpuesto</strong></td>
        <td>Qué otros objetivos táctiles, si los hay, están demasiado cerca.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## Cómo arreglar sus objetivos táctiles

**Paso 1:** aumente el tamaño de los objetivos táctiles que son demasiado pequeños. Los objetivos táctiles de 48 px por 48 px nunca fallan en la auditoría. Si tiene elementos que no deberían *aparecer* más grandes (por ejemplo, iconos), intente aumentar la propiedad `padding`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="Objetivos táctiles de tamaño apropiado", width="800", height="419" %} <figcaption>Utilice <code>padding</code> para agrandar los objetivos táctiles sin cambiar la apariencia de un elemento.</figcaption></figure>

**Paso 2:** aumente el espacio entre los objetivos táctiles que están demasiado cerca entre sí, utilizando propiedades como `margin`. Debe haber al menos 8 px entre los objetivos táctiles.

## Recursos

- [Objetivos táctiles accesibles](/accessible-tap-targets): más información sobre cómo garantizar que todos los usuarios puedan acceder a sus objetivos táctiles.
- [Código fuente para la auditoría **Los objetivos táctiles no tienen el tamaño adecuado.**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/tap-targets.js)
