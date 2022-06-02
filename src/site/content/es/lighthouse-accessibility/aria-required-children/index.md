---
layout: post
title: A los elementos con un "[role]" ARIA que requieren que los hijos contengan un "[role]" específico les faltan algunos o todos los hijos requeridos
description: Aprenda a mejorar la accesibilidad de su página web para los usuarios de tecnologías de asistencia, asegurándose de que todos los elementos con funciones ARIA tengan el elemento hijo requerido.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-children
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Algunas funciones ARIA requieren roles hijos específicos. Por ejemplo, el rol `tablist` debe poseer al menos un elemento con el rol `tab`. Si los roles hijos requeridos no están presentes, las tecnologías de asistencia pueden transmitir información confusa sobre su página, como anunciar un conjunto de pestañas sin pestañas.

## Cómo identifica Lighthouse las funciones de los hijos faltantes

<a href="https://developer.chrome.com/docs/lighthouse/overview/" rel="noopener">Lighthouse</a> marca los roles ARIA que no tienen los roles hijos requeridos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/meMpRNGub2polfC7ysFf.png", alt="Auditoría de Lighthouse que muestra la función ARIA que falta en el rol hijo requerido", width="800", height="205" %}</figure>

Lighthouse usa las <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">definiciones de roles de la especificación WAI-ARIA</a> para verificar <a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">los elementos de propiedad requeridos</a>, es decir, los roles hijos requeridos. Una página falla en esta auditoría cuando contiene un rol padre al que le faltan sus roles hijos requeridos.

En el ejemplo de auditoría de Lighthouse anterior, el rol `radiogroup` requiere elementos hijos con el rol `radio`. Dado que no hay hijos con un `radio` definido, la auditoría falla. Esto tiene sentido, ya que sería confuso tener un grupo de radio sin botones de radio.

Es importante solucionar este problema ya que puede dañar la experiencia de los usuarios. En el ejemplo anterior, el elemento aún puede anunciarse como un grupo de radio, pero los usuarios no sabrán cuántos botones de radio contiene.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar los roles hijos que faltan

Consulte las <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">definiciones de roles WAI-ARIA</a> para ver qué roles hijos son necesarios para los elementos marcados por Lighthouse. (La especificación se refiere a los hijos <a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">obligatorios como elementos de propiedad obligatorios</a>).

{% include 'content/lighthouse-accessibility/aria-child-parent.njk' %}

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-children.js" rel="noopener">Código fuente para la auditoría <strong>A los elementos con un <code>[role]</code> ARIA que requieren que los hijos contengan un [role] específico les faltan algunos o todos los hijos requeridos</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-children" rel="noopener">Ciertos roles de ARIA deben contener ciertos hijos en particular (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Definiciones de roles de la especificación WAI-ARIA</a>
