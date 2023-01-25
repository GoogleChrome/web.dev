---
layout: post
title: Evite el texto invisible durante la carga de fuentes
authors:
  - katiehempenius
description: Las fuentes suelen ser archivos de gran tamaño que tardan un poco en cargarse. Para lidiar con esto, algunos navegadores ocultan el texto hasta que se carga la fuente (el "destello de texto invisible"). Si está optimizando el rendimiento, querrá evitar el "destello de texto invisible "y mostrar el contenido a los usuarios de forma inmediata utilizando una fuente del sistema.
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## ¿Por qué debería preocuparte?

Las fuentes suelen ser archivos de gran tamaño que tardan un poco en cargarse. Para hacer frente a esto, algunos navegadores ocultan el texto hasta que se carga la fuente (el "destello de texto invisible"). Si está optimizando el rendimiento, querrá evitar el "destello de texto invisible" y mostrar el contenido a los usuarios inmediatamente usando una fuente del sistema (el "destello de texto sin estilo").

## Mostrar el texto inmediatamente

Esta guía describe dos formas de conseguir esto: el primer enfoque es muy simple pero no tiene [support](https://caniuse.com/#search=font-display) (soporte) universal de navegadores; el segundo enfoque es más trabajoso, pero tiene compatibilidad total con los navegadores. La mejor opción para usted es la que realmente implementará y mantendrá.

## Opción n. 1: Usar font-display

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Antes</th>
        <th>Después</th>
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
  </table>
</div>

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) es una API para especificar la estrategia de visualización de fuentes. `swap` le dice al navegador que el texto que usa esta fuente debe mostrarse inmediatamente usando una fuente del sistema. Una vez que la fuente personalizada está lista, la fuente del sistema se cambia.

Si un navegador no admite `font-display`, el navegador continúa con su comportamiento predeterminado para cargar fuentes. Compruebe qué navegadores admiten `font-display` [aquí](https://caniuse.com/#search=font-display).

Estos son los comportamientos predeterminados de carga de fuentes para navegadores comunes:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>Navegador</strong></th>
        <th><strong>Comportamiento predeterminado si la fuente no está lista...</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>Utiliza una fuente del sistema hasta que la fuente esté lista. Cambia la fuente.</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>Oculta el texto hasta por 3 segundos. Si el texto aún no está listo, use una fuente del sistema hasta que la fuente esté lista. Cambia la fuente.</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>Oculta el texto hasta por 3 segundos. Si el texto aún no está listo, use una fuente del sistema hasta que la fuente esté lista. Cambia la fuente.</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Oculta el texto hasta que la fuente esté lista.</td>
      </tr>
    </tbody>
  </table>
</div>

## Opción n. 2: Espere para usar fuentes personalizadas hasta que se carguen

Con un poco más de trabajo, se puede implementar el mismo comportamiento para que funcione en todos los navegadores.

Este enfoque consta de tres partes:

- No utilice una fuente personalizada en la carga de la página inicial. Esto asegura que el navegador muestre el texto inmediatamente usando una fuente del sistema.
- Detecta cuando se carga su fuente personalizada. Esto se puede lograr con un par de líneas de código JavaScript, gracias a la biblioteca [FontFaceObserver](https://github.com/bramstein/fontfaceobserver).
- Actualice el estilo de la página para usar la fuente personalizada.

Estos son los cambios que puede esperar realizar para implementar esto:

- Refactorice su CSS para no usar una fuente personalizada durante la carga inicial de la página.
- Agrega una secuencia de comandos a tu página. Este script detecta cuándo se carga la fuente personalizada y luego actualizará el estilo de la página.

{% Aside 'codelab' %} [Utilice Font Face Observer para mostrar el texto inmediatamente](/codelab-avoid-invisible-text). {% endAside %}

## Verificar

Ejecute Lighthouse para verificar que el sitio esté usando `font-display: swap` para mostrar texto:

{% Instruction 'audit-performance', 'ol' %}

Confirme que la auditoría **Ensure text remains visible during webfont load (Asegúrate de que el texto permanece visible mientras se carga la fuente web)** está pasando.
