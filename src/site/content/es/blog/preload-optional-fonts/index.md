---
title: Evite cambios de diseño y parpadeos de texto invisible (FOIT) mediante la precarga de fuentes opcionales
subhead: 'A partir de Chrome 83, link rel="preload" y font-display: opcional se pueden combinar para eliminar completamente los reacomodos desagradables en el diseño.'
authors:
  - houssein
date: 2020-03-18
hero: image/admin/wv5DLtYiAhHm4lNemN1E.jpg
alt: Una gran letra A de un conjunto de tipos colocada sobre una mesa blanca.
description: |2-

  Al optimizar los ciclos de renderizado, Chrome 83 elimina el cambio de diseño cuando precarga fuentes opcionales. Combinar <link rel="preload"> con font-display: optional es la forma más eficaz de garantizar un renderizado de fuentes personalizadas sin reacomodos desagradables.
tags:
  - blog
  - performance
  - fonts
feedback:
  - api
---

{% Aside %} En Chrome 83, se han realizado nuevas mejoras en la carga de fuentes para eliminar por completo las variaciones del diseño y el parpadeo de texto invisible (FOIT) cuando las fuentes opcionales están precargadas. {% endAside %}

Al optimizar los ciclos de renderizado, Chrome 83 elimina el cambio de diseño al precargar fuentes opcionales. La combinación de `<link rel="preload">` con `font-display: optional` es la forma más eficaz de garantizar que no haya reacomodos desagradables en el diseño al renderizar fuentes personalizadas.

## Compatibilidad del navegador {: #compatibility }

Consulte los datos de MDN para obtener información actualizada sobre compatibilidad con varios navegadores:

- [`<link rel="preload">`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)
- [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

## Renderizado de fuentes

El reacomodo de diseño, o rediseño, ocurre cuando un recurso en una página web cambia dinámicamente, lo que resulta en un "reacomodo" del contenido. Obtener y renderizar fuentes web puede provocar reacomodos de diseño directamente de una de estas dos formas:

- Una fuente alternativa se cambia por una nueva ("parpadeo de texto sin estilo")
- Se muestra texto "invisible" hasta que se renderiza una nueva fuente en la página ("parpadeo de texto invisible")

La propiedad CSS [`font-display`](https://font-display.glitch.me/) ofrece una forma de modificar el comportamiento de renderizado de las fuentes personalizadas a través de un rango de diferentes valores admitidos (`auto`, `block`, `swap`, `fallback` y `optional`). La elección del valor que se utilizará depende del comportamiento preferido de las fuentes cargadas de forma asincrónica. Sin embargo, cada uno de estos valores admitidos podía desencadenar un rediseño de una de las dos formas enumeradas anteriormente, ¡hasta ahora!

{% Aside %} La métrica [Cumulative Layout Shift: Cambio de diseño acumulativo](/cls/) permite medir la inestabilidad del diseño en una página web. {% endAside %}

## Fuentes opcionales

La propiedad `font-display` usa una línea de tiempo de tres períodos para manejar las fuentes que deben descargarse antes de que se puedan renderizar:

- **Bloqueo:** renderiza texto "invisible", pero cambia a la fuente web tan pronto como termine de cargarse.
- **Intercambio:** renderiza el texto con una fuente alternativa del sistema, pero cambia a la fuente web tan pronto como termina de cargarse.
- **Fallo:** renderiza el texto con una fuente alternativa del sistema.

Anteriormente, las fuentes designadas con `font-display: optional` tenían un período de bloqueo de 100 ms y ningún período de Intercambio. Esto significa que el texto "invisible" se muestra muy brevemente antes de cambiar a una fuente alternativa. Si la fuente no se descarga en 100 ms, se utiliza la fuente alternativa y no se produce ningún cambio.

<figure>{% Img src="image/admin/WHLORYEu864QRRveFQUz.png", alt="Diagrama que muestra el comportamiento anterior de la fuente opcional cuando la fuente no se carga", width="800", height="340" %}<figcaption> Comportamiento anterior de <code>font-display: optional</code> en Chrome cuando la fuente se descarga <b>después</b> del período de bloqueo de 100 ms</figcaption></figure>

Sin embargo, en caso de que la fuente se descargue antes de que finalice el período de bloqueo de 100 ms, la fuente personalizada se renderiza y usa en la página.

<figure>{% Img src="image/admin/mordYRjmCCDtlMcNXEOU.png", alt="Diagrama que muestra el comportamiento anterior de la fuente opcional cuando la fuente se carga a tiempo", width="800", height="318" %}<figcaption> Comportamiento anterior de <code>font-display: optional</code> en Chrome cuando la fuente se descarga <b>antes</b> del período de bloqueo de 100 ms</figcaption></figure>

Chrome vuelve a renderizar la página **dos veces** en ambos casos, independientemente de si se usa la fuente alternativa o si la fuente personalizada termina de cargarse a tiempo. Esto provoca un ligero parpadeo de texto invisible y, en los casos en que se renderiza una nueva fuente, un reacomodo desagradable del diseño que mueve parte del contenido de la página. Esto ocurre incluso si la fuente está almacenada en la memoria caché del disco del navegador y puede cargarse mucho antes de que finalice el período de bloqueo.

Las [optimizaciones](https://bugs.chromium.org/p/chromium/issues/detail?id=1040632) llegaron a Chrome 83 para eliminar por completo el primer ciclo de renderizado de fuentes opcionales precargadas con [`<link rel="preload'>`](/codelab-preload-web-fonts/). En su lugar, el renderizado se bloquea hasta que la fuente personalizada haya terminado de cargarse o haya transcurrido un cierto período de tiempo. Este período de tiempo de espera está establecido actualmente en 100 ms, pero es posible que cambie en un futuro próximo para optimizar el rendimiento.

<figure>{% Img src="image/admin/zLldiq9J3duBTaeRN88e.png", alt="Diagrama que muestra el comportamiento de la nueva fuente opcional precargada cuando la fuente falla en cargarse", width="800", height="353" %}<figcaption> Comportamiento nuevo de <code>font-display: optional</code> en Chrome cuando las fuentes están precargadas y la fuente se descarga <b>después</b> del período de bloqueo de 100 ms (sin parpadeo de texto invisible)</figcaption></figure>

<figure>{% Img src="image/admin/OEHClGFMFspaWjb3xXLY.png", alt="Diagrama que muestra el comportamiento de la nueva fuente opcional precargada cuando la fuente se carga a tiempo", width="800", height="346" %}<figcaption> Comportamiento nuevo de <code>font-display: optional</code> en Chrome cuando las fuentes están precargadas y la fuente se descarga <b>antes</b> del período de bloqueo de 100 ms (sin parpadeo de texto invisible)</figcaption></figure>

La precarga de fuentes opcionales en Chrome elimina la posibilidad de alteraciones desagradables en el diseño y parpadeos de texto sin estilo. Esto coincide con el comportamiento requerido como se especifica en el [nivel 4 del módulo de fuentes CSS,](https://drafts.csswg.org/css-fonts-4/#valdef-font-face-font-display-optional) donde las fuentes opcionales nunca deben causar un rediseño y los agentes de usuario pueden, en cambio, retrasar la renderización durante un período de tiempo adecuado.

Aunque no es necesario precargar una fuente opcional, mejora en gran medida la posibilidad de que se cargue antes del primer ciclo de renderizado, especialmente si aún no está almacenada en la caché del navegador.

## Conclusión

El equipo de Chrome está interesado en escuchar sus experiencias al precargar fuentes opcionales con estas nuevas optimizaciones implementadas. Mándelos un [reporte](https://bugs.chromium.org/p/chromium/issues/entry) si experimenta algún problema o le gustaría dejarnos alguna sugerencia de funciones.
