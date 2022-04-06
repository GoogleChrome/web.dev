---
layout: post
title: Objetivos táctiles accesibles
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |2

  Es importante que los elementos interactivos tengan suficiente espacio a su alrededor cuando se utilicen en un dispositivo móvil o con pantalla táctil. Esto ayudará a todos, pero especialmente a aquellos con discapacidades motoras.
tags:
  - accessibility
---

Cuando tu diseño se muestra en un dispositivo móvil, debes de asegurarte de que los elementos interactivos, como botones o enlaces, sean lo suficientemente grandes y tengan suficiente espacio a su alrededor, para que sean fáciles de presionar sin que se superpongan accidentalmente con otros elementos. Esto beneficia a todos los usuarios, pero es especialmente útil para cualquier persona con una discapacidad motora.

Un tamaño de objetivo táctil mínimo recomendado es de alrededor de 48 píxeles, independiente del dispositivo, en un sitio con una ventana gráfica móvil configurada correctamente. Por ejemplo, aunque es posible que un icono solo tenga un ancho y un alto de 24px, puedes usar un relleno adicional para llevar el tamaño del objetivo táctil hasta 48px. El área de 48x48 píxeles corresponde a alrededor de 9mm, que es aproximadamente el tamaño del área de la yema del dedo de una persona.

En la siguiente demostración, agregué relleno a todos los enlaces para asegurarme de que cumplan con el tamaño mínimo.

{% Glitch { id: 'tap-targets', path: 'index.html' } %}

Los objetivos táctiles también deben de tener una separación de unos 8 píxeles, tanto horizontal como verticalmente, de modo que el dedo del usuario que presiona un objetivo táctil no toque inadvertidamente otro objetivo táctil.

## Probando tus objetivos táctiles

Si tu objetivo es texto y has utilizado valores relativos como `em` o `rem` para ajustar el tamaño del texto y cualquier padding (relleno), puedes utilizar DevTools para comprobar que el valor calculado de esa área es lo suficientemente grande. En el siguiente ejemplo, estoy usando `em` para mi texto y padding.

{% Glitch { id: 'tap-targets-2', path: 'style.css' } %}

Inspecciona la `a` del enlace y, en Chrome DevTools, cambia al [panel de Calculados](https://developer.chrome.com/docs/devtools/css/overrides/#computed) en donde puedes inspeccionar las distintas partes del cuadro y ver a qué tamaño de píxeles se resuelven. En Firefox DevTools hay un panel de diseño. En ese panel obtienes el tamaño real del elemento inspeccionado.

<figure style="max-width: 500px">{% Img src="image/admin/vmFzREveRttHVDfLqqCx.jpg", alt="El panel de diseño en Firefox DevTools muestra el tamaño del elemento a", width="800", height="565" %}</figure>

## Usar consultas de medios para detectar el uso de la pantalla táctil

Una de las características de los medios que ahora podemos probar con las consultas de medios es si la entrada principal del usuario es una pantalla táctil. La función de `pointer` nos regresará un `fine` o `coarse`. Un buen puntero será alguien que use un ratón o trackpad, incluso si ese ratón está conectado a través de Bluetooth a un teléfono. Un `coarse` indica una pantalla táctil, que podría ser un dispositivo móvil, pero también puede ser una pantalla de computadora portátil o una tableta grande.

Si estás ajustando tu CSS dentro de una consulta de medios para aumentar el objetivo táctil, la prueba de un puntero grueso te permite aumentar los objetivos táctiles para todos los usuarios de pantalla táctil. Esto te da el área de toque más grande, ya sea que el dispositivo sea un teléfono o un dispositivo más grande, mientras que la prueba de ancho solo te brinda a los usuarios móviles.

```css
.container a {
  padding: .2em;
}

@media (pointer: coarse) {
  .container a {
    padding: .8em;
  }
}
```

Puedes obtener más información sobre las funciones de medios de interacción, como el puntero, en el artículo de [Conceptos básicos del diseño web responsivo](/responsive-web-design-basics/).
