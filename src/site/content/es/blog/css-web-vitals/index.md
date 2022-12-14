---
title: CSS para Web Vitals
subhead: Técnicas relacionadas con CSS para optimizar los Web Vitals
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: Gradiente multicolor
description: Este artículo cubre técnicas relacionadas con CSS para optimizar Web Vitals.
tags:
  - blog
  - performance
  - css
---

La forma en que escribes tus estilos y creas diseños puede tener un gran impacto en [Core Web Vitals](/collection/). Esto es particularmente cierto para el [Cumulative Layout Shift (CLS): Cambio Acumulativo del diseño](/cls) y [Largest Contentful Paint (LCP): Despliegue del contenido más extenso](/lcp).

Este artículo cubre técnicas relacionadas con CSS para optimizar Web Vitals. Estas optimizaciones se desglosan mediante diferentes aspectos de una página: diseño, imágenes, fuentes, animaciones y carga. A lo largo del camino, exploraremos la mejora de una [página de ejemplo](https://codepen.io/una/pen/vYyLKvY):

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png", alt="Captura de pantalla del sitio de ejemplo", width="800", height="646" %}

## Diseño

### Insertar contenido en el DOM

Insertar contenido en una página después de que el contenido que rodea a todo ya haya sido cargado, todo lo demás será empujado hacia abajo. Esto provoca [cambios de diseño](/cls/#layout-shifts-in-detail).

[Los avisos de cookies](/cookie-notice-best-practices/), en particular los que se encuentran en la parte superior de la página, son un ejemplo común de este problema. Otros elementos de la página que a menudo provocan este tipo de cambio de diseño cuando se cargan incluyen anuncios e incrustaciones.

#### Identificar

La auditoría Lighthouse de "Evita grandes cambios de diseño" identifica los elementos de la página que se han desplazado. Para esta demostración, los resultados se ven de la siguiente manera:

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png", alt="Auditoría Lighthouse de 'Evita grandes cambios de diseño'", width="800", height="500" %}

El aviso de cookies no se incluye en estos resultados porque el aviso de cookies en sí no se desplaza cuando se está cargando. Más bien, hace que los elementos debajo de él en la página (es decir, `div.hero` y `article`) cambien. Para obtener más información sobre cómo identificar y corregir cambios de diseño, consulta [Depurar cambios de diseño](/debugging-layout-shifts).

{% Aside %}

Lighthouse solo analiza el rendimiento de una página hasta el evento de "carga de la página". Los banners de cookies, los anuncios y otros widgets a veces no se cargan hasta después de la carga de la página. Estos cambios de diseño siguen afectando a los usuarios, incluso si Lighthouse no los marca.

{% endAside %}

#### Reparar

Coloca el aviso de cookies en la parte inferior de la página con posicionamiento absoluto o fijo.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png", alt="Aviso de cookies en la parte inferior de la página", width="800", height="656" %}

Antes:

```css
.banner {
  position: sticky;
  top: 0;
}
```

Después:

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

Otra forma de corregir este cambio de diseño sería reservar espacio para el aviso de cookies en la parte superior de la pantalla. Este enfoque es igualmente eficaz. Para obtener más información, consulta las [mejores prácticas de notificación de cookies](/cookie-notice-best-practices/).

{% Aside %}

El aviso de cookies es uno de los múltiples elementos de la página que desencadenan cambios de diseño cuando se carga. Para ayudarnos a ver más de cerca estos elementos de la página, los pasos de demostración posteriores no incluirán el aviso de cookies.

{% endAside %}

## Imágenes

### Imágenes y Largest Contentful Paint (LCP)

Las imágenes suelen ser el elemento de Largest Contentful Paint (LCP) de una página. Otros [elementos de la página que pueden ser elementos LCP](/lcp/#what-elements-are-considered) incluyen bloques de texto e imágenes de poster de video. El momento en que se carga el elemento LCP, se determina el LCP.

Es importante tener en cuenta que los elementos LCP de una página pueden variar de una carga a otra según el contenido que es visible para el usuario cuando la página se muestra por primera vez. Por ejemplo, en esta demostración, el fondo del aviso de cookies, la imagen principal y el texto del artículo son algunos de los posibles elementos de LCP.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png", alt="Diagrama que destaca los elementos LCP de la página en diferentes escenarios.", width="800", height="498" %}

En el sitio de ejemplo, la imagen de fondo del aviso de cookies es en realidad una imagen grande. Para mejorar el LCP, se puede desplegar el degradado en CSS, en lugar de cargar una imagen para crear el efecto.

#### Reparar

Cambia el CSS de `.banner` para usar un degradado CSS en lugar de una imagen:

Antes:

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

Después:

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```

### Imágenes y cambios de diseño

Los navegadores solo pueden determinar el tamaño de una imagen una vez que se carga la imagen. Si la carga de la imagen se produce después de que se ha renderizado la página, pero no se ha reservado espacio para la imagen, se produce un cambio de diseño cuando aparece la imagen. En la demostración, la imagen principal está provocando un cambio de diseño cuando se carga.

{% Aside %} El fenómeno de las imágenes que provocan cambios en el diseño es más obvio en situaciones en las que las imágenes tardan en cargarse, por ejemplo, en una conexión lenta o cuando se carga una imagen con un tamaño de archivo particularmente grande. {% endAside %}

#### Identificar

Para identificar imágenes sin `width` y `height` explícitos, utiliza la auditoría de "Los elementos de imagen tienen ancho y alto explícitos" de Lighthouse.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png", alt="Auditoría de Los elementos de imagen tienen ancho y alto explícitos de Lighthouse.", width="800", height="274" %}

En este ejemplo, tanto la imagen principal como la imagen del artículo carecen de los atributos de `width` y `height`

#### Reparar

Define los elementos de `width` y `height` en estas imágenes para evitar cambios de diseño.

Antes:

```html
<img src="https://source.unsplash.com/random/2000x600" alt="imagen a cargar">
<img src="https://source.unsplash.com/random/800x600" alt="imagen a cargar">
```

Después:

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="imagen a cargar">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="imagen a cargar">
```

<figure>{% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMGOlGhKnNHef2py.mp4" %} <figcaption> La imagen ahora se carga sin provocar un cambio de diseño.</figcaption></figure>

{% Aside %} Otro enfoque para la carga de imágenes es utilizar los atributos de [`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) y [`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) en conjunción con la especificación de los atributos de `width` y `height`. Esto tiene la ventaja de rendimiento adicional de permitirte servir imágenes de diferentes tamaños a diferentes dispositivos. Para obtener más información, consulta [Servir imágenes responsivas](/serve-responsive-images/). {% endAside %}

## Fuentes

Las fuentes pueden retrasar la representación del texto y provocar cambios en el diseño. Como resultado, es importante servir fuentes rápidamente.

### Renderización de texto con retraso

De forma predeterminada, un navegador no procesará inmediatamente un elemento de texto si sus fuentes web asociadas aún no se han cargado. Esto se hace para evitar un ["destello de texto sin estilo" (FOUT)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content). En muchas situaciones, esto retrasa el [First Contentful Paint (FCP): Primer despliegue de contenido](/fcp). En algunas situaciones, esto retrasa a Largest Contentful Paint (LCP).

{% Aside %}

De forma predeterminada, los navegadores basados en Chromium y Firefox [bloquearán la renderización de texto hasta 3 segundos](https://developers.google.com/web/updates/2016/02/font-display) si la fuente web asociada no se ha cargado; Safari bloqueará la renderización de texto de forma indefinida. El [período de bloqueo](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline) comienza cuando el navegador solicita una fuente web. Si la fuente aún no se ha cargado al final del período de bloqueo, el navegador procesará el texto usando una fuente alternativa y cambiará la fuente web una vez que esté disponible.

{% endAside %}

### Cambios de diseño

El intercambio de fuentes, si bien es excelente para mostrar contenido al usuario rápidamente, tiene el potencial de causar cambios en el diseño. Estos cambios de diseño ocurren cuando una fuente web y su fuente alternativa ocupan diferentes cantidades de espacio en la página. El uso de fuentes de proporciones similares minimizará el tamaño de estos cambios de diseño.

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="Diagrama que muestra un cambio de diseño causado por un cambio de fuente", width="800", height="452" %} <figcaption> En este ejemplo, el intercambio de fuentes provocó que los elementos de la página se desplazaran cinco píxeles hacia arriba.</figcaption></figure>

#### Identificar

Para ver las fuentes que se están cargando en una página en particular, abre la pestaña de **Red** en DevTools y filtra la información por **Fuente**. Las fuentes pueden ser archivos de gran tamaño, por lo que generalmente, el rendimiento es mejor si se usan menos fuentes.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png", alt="Captura de pantalla de una fuente mostrada en DevTools", width="800", height="252" %}

Para ver cuánto tiempo se tarda en solicitar la fuente, haz clic en la pestaña de **Tiempo.** Cuanto antes se solicite una fuente, antes se podrá cargar y utilizar.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png", alt="Captura de pantalla de la pestaña 'Tiempo' en DevTools", width="800", height="340" %}

Para ver la cadena de solicitud de una fuente, haz clic en la pestaña de **Iniciador**. En términos generales, cuanto más corta sea la cadena de solicitudes, antes se podrá solicitar la fuente.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png", alt="Captura de pantalla de la pestaña 'Iniciador' en DevTools", width="800", height="189" %}

#### Reparar

Esta demostración utiliza la API de Google Fonts. Google Fonts ofrece la opción de cargar fuentes mediante las etiquetas de  `<link>` o una declaración de `@import`. El fragmento de código `<link>` incluye un recurso de sugerencia de `preconnect`. Esto debería resultar en una entrega de hojas de estilo más rápida que con la versión de `@import`.

En un nivel muy alto, puedes pensar sobre [las sugerencias](https://www.w3.org/TR/resource-hints/#resource-hints) de recursos como una forma de indicarle al navegador que necesitará configurar una conexión en particular o descargar un recurso en particular. Como resultado, el navegador priorizará estas acciones. Cuando utilices sugerencias de recursos, ten en cuenta que priorizar una acción en particular quita recursos del navegador de otras acciones. Por lo tanto, las sugerencias de recursos deben usarse con cuidado y no para todo. Para obtener más información, consulta [Establecer conexiones de red con anticipación para mejorar la velocidad percibida de la página](/preconnect-and-dns-prefetch/).

Elimina la siguiente `@import` de tu hoja de estilo:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

Agrega las siguientes etiquetas `<link>` en el `<head>` del documento:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

Estas etiquetas de enlace le indican al navegador que establezca una conexión temprana con los orígenes utilizados por Google Fonts y que cargue la hoja de estilo que contiene la declaración de fuente para Montserrat y Roboto. Estas etiquetas de `<link>` deben colocarse lo antes posible en `<head>`.

{% Aside %}

Para cargar solo un subconjunto de una fuente de Google Fonts, agrega el parametro de API de [`?text=`](https://developers.google.com/fonts/docs/getting_started). Por ejemplo `?text=ABC` carga solo los caracteres necesarios para representar "ABC". Ésta es una buena forma de reducir el tamaño de archivo de una fuente.

{% endAside %}

## Animaciones

La forma principal en que las animaciones afectan a los Web Vitals es cuando provocan cambios en el diseño. Hay dos tipos de animaciones que debes evitar usar: [animaciones que activan el diseño](/animations-guide/#triggers) y efectos "similares a animaciones" que mueven elementos de la página. Por lo general, estas animaciones se pueden reemplazar con equivalentes de mayor rendimiento mediante el uso de propiedades CSS como [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform), [`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity) y [`filter`](https://developer.mozilla.org/docs/Web/CSS/filter). Para obtener más información, consulta [Cómo crear animaciones CSS de alto rendimiento](/animations/).

### Identificar

La auditoría Lighthouse de "Evitar animaciones no compuestas" puede ser útil para identificar animaciones que no funcionan.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png", alt="Auditoría Lighthouse de 'Evitar animaciones no compuestas'", width="512", height="132" %}

{% Aside 'caution' %}

La auditoría Lighthouse de "Evitar animaciones no compuestas" solo identifica *animaciones CSS* que no funcionan; Las animaciones controladas por JavaScript (por ejemplo, usando [`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) para "animar" un elemento) son malas para el rendimiento, pero esta auditoría no las marcará.

{% endAside %}

### Reparar

Cambia la secuencia de animación `slideIn` para utilizar `transform: translateX()` en lugar de cambiar la propiedad de `margin-left`.

Antes:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

Después:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```

## CSS crítico

Las hojas de estilo bloquean el renderizado. Esto significa que el navegador encuentra una hoja de estilo, dejará de descargar otros recursos hasta que el navegador haya descargado y analizado la hoja de estilo. Esto puede retrasar el LCP. Para mejorar el rendimiento, considera la posibilidad de [eliminar el CSS no utilizado](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/), [poner en línea el CSS crítico](/extract-critical-css/) y [aplazar el CSS no crítico](/defer-non-critical-css/#optimize).

## Conclusión

Aunque todavía hay espacio para mejoras adicionales (por ejemplo, usar la [compresión de imágenes](/use-imagemin-to-compress-images/) para servir imágenes más rápido), estos cambios han mejorado significativamente las Web Vitals de este sitio. Si este fuera un sitio real, el siguiente paso sería [recopilar datos de rendimiento de usuarios reales](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data) para evaluar si está [cumpliendo con los umbrales de Web Vitals para la mayoría de los usuarios](/vitals-measurement-getting-started/#data-interpretation). Para obtener más información sobre Web Vitals, consulta [Aprende Core Web Vitals](/collection/).
