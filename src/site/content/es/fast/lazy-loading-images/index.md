---
layout: post
title: Carga diferida de imágenes
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: |2-

  Esta publicación explica la carga diferida y las opciones disponibles para cargar las imágenes de forma diferida.
tags:
  - performance
  - images
feedback:
  - api
---

Las imágenes pueden aparecer en una página web debido a que están en línea (in-line) en el HTML como `<img>` o como imágenes de fondo CSS. En esta publicación, descubrirás cómo cargar de forma diferida ambos tipos de imagen.

## Imágenes en línea {: #images-inline }

Los candidatos de carga diferida más comunes son las imágenes que se usan en los elementos `<img>`. Con las imágenes en línea, tenemos tres opciones para una carga diferida  que se pueden usar en combinación para obtener la mejor compatibilidad entre los navegadores:

- [Usar la carga diferida a nivel del navegador](#images-inline-browser-level)
- [Usar Intersection Observer](#images-inline-intersection-observer)
- [Usar controladores de eventos de desplazamiento y cambio de tamaño](#images-inline-event-handlers)

### Usar la carga diferida a nivel del navegador {: #images-inline-browser-level }

Tanto Chrome como Firefox permiten la carga diferida con el atributo de `loading`. Este atributo se puede agregar a los `<img>` y también a los elementos `<iframe>`. Un valor de `lazy` le dice al navegador que cargue la imagen inmediatamente si está en la ventana gráfica y que busque otras imágenes cuando el usuario se desplace cerca de ellas.

{% Aside %} Nota `<iframe loading="lazy">` actualmente no es estándar. Si bien está implementado en Chromium, aún no tiene una especificación y está sujeto a cambios futuros cuando esto suceda. Sugerimos no realizar una carga diferida de iframes utilizando el atributo de `loading` hasta que se convierta en parte de la especificación. {% endAside %}

Consulta el campo de `loading` de [la tabla de compatibilidad de navegadores](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility) de MDN para obtener detalles sobre la compatibilidad de navegadores. Si el navegador no permite la carga diferida, el atributo se ignorará y las imágenes se cargarán inmediatamente, de manera habitual.

Para la mayoría de los sitios web, agregar este atributo a las imágenes en línea aumentará el rendimiento y evitará que los usuarios carguen imágenes a las que es posible que nunca se desplacen. Si tienes una gran cantidad de imágenes y deseas asegurarte de que los usuarios de navegadores sin compatibilidad para la carga diferida se beneficien, deberás combinar esto con uno de los métodos que se explican a continuación.

Para obtener más información, consulta [Carga diferida a nivel del navegador para la web](/browser-level-image-lazy-loading/).

### Usar Intersection Observer {: #images-inline-intersection-observer }

Para hacer un polyfill de carga diferida de los elementos de `<img>`, usamos JavaScript para verificar si están en la ventana gráfica. Si es así, los atributos de `src` (y algunas veces los atributos de `srcset`) se completan con los URL para el contenido de imagen deseado.

Si has escrito código de carga diferida antes, es posible que hayas logrado tu tarea mediante el uso de controladores de eventos como `scroll` o `resize`. Si bien este enfoque es el más compatible en todos los navegadores, los navegadores modernos ofrecen una forma más eficaz y eficiente de realizar el trabajo de verificar la visibilidad de los elementos a través de [la API de Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/).

{% Aside %} Intersection Observer no es compatible con todos los navegadores, especialmente con IE11 y versiones anteriores. Si la compatibilidad entre navegadores es crucial, asegúrate de leer [la siguiente sección](#images-inline-event-handlersy), que muestra cómo cargar imágenes de forma diferida utilizando controladores de eventos de menor rendimiento (¡pero más compatibles!) de desplazamiento (scroll) y de reajuste (resize) de tamaño. {% endAside %}

Intersection Observer es más fácil de usar y leer que el código que se basa en varios controladores de eventos, porque solo necesita registrar un observador para mirar los elementos en lugar de escribir un tedioso código de detección de visibilidad de elementos. Todo lo que queda por hacer es decidir qué hacer cuando un elemento esté visible. Supongamos el siguiente patrón de marcado básico para tus elementos `<img>`:

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="¡Soy una imagen!">
```

Hay tres partes relevantes de este marcado en las que deberías de  enfocarte:

1. El `class`, que es con lo que seleccionará el elemento en JavaScript.
2. El `src`, que hace referencia a una imagen de reserva (placeholder) de posición que aparecerá cuando se cargue la página por primera vez.
3. Los atributos de `data-src` y `data-srcset`, los cuales son atributos que definen una reserva que contienen la URL de la imagen que cargará una vez que el elemento esté en la ventana gráfica.

Ahora veamos cómo usar Intersection Observer en JavaScript para cargar imágenes de forma diferida usando este patrón de marcado:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

En el evento de `DOMContentLoaded` del documento, este script consulta al DOM todos los `<img>` con una clase de `lazy`. Si Intersection Observer está disponible, crea un nuevo observador que ejecuta una retrollamada cuando los `img.lazy` ingresen a la ventana gráfica.

{% Glitch { id: 'lazy-intersection-observer', path: 'index.html', previewSize: 0 } %}

Intersection Observer está disponible en todos los navegadores modernos. Por lo tanto, usarlo como polyfill para `loading="lazy"` garantizará que la carga diferida esté disponible para la mayoría de los visitantes.

## Imágenes en CSS {: #images-css }

Si bien las etiquetas de `<img>` son la forma más común de usar imágenes en páginas web, las imágenes también se pueden invocar a través de la propiedad CSS de [`background-image`](https://developer.mozilla.org/docs/Web/CSS/background-image) (y mediante otras propiedades). La carga diferida a nivel del navegador no se aplica a las imágenes de fondo del CSS, por lo que debes de considerar otros métodos si tienes imágenes de fondo para la carga diferida.

A diferencia de los elementos `<img>` que se cargan independientemente de su visibilidad, el comportamiento de carga de imágenes en CSS se realiza con más especulación. Cuando se crea el [documento y los modelos de objetos CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model) y el [render tree (árbol de renderización)](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction), el navegador examina cómo se aplica el CSS a un documento antes de solicitar recursos externos. Si el navegador ha determinado que una regla CSS que involucra un recurso externo no se aplica al documento como está construido actualmente, el navegador no lo solicita.

Este comportamiento especulativo se puede utilizar para diferir la carga de imágenes en CSS mediante el uso de JavaScript para determinar cuándo un elemento está dentro de la ventana gráfica y, posteriormente, aplicar una clase a ese elemento que aplica un estilo invocando una imagen de fondo. Esto hace que la imagen se descargue en el momento en que se necesite en lugar de en la carga inicial. Por ejemplo, tomemos un elemento que contiene una imagen de fondo de héroe grande:

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

El elemento de `div.lazy-background` normalmente contendría la imagen de fondo del héroe invocada por algún CSS. En este ejemplo de carga diferida, sin embargo, puedes aislar el `div.lazy-background` de la propiedad del elemento de `background-image` mediante una clase `visible` añadida al elemento cuando está en la ventana gráfica:

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Imagen de reserva */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* Imagen final */
}
```

Desde aquí, usa JavaScript para verificar si el elemento está en la ventana gráfica (¡utilizando Intersection Observer!) y agrega la clase de `visible` al `div.lazy-background` en el momento que carga la imagen:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

{% Glitch { id: 'lazy-background', path: 'index.html', previewSize: 0 } %}

## Bibliotecas de carga diferida {: #libraries }

Las siguientes bibliotecas se pueden utilizar para cargar imágenes de forma diferida.

- [lazysizes](https://github.com/aFarkas/lazysizes) es una biblioteca de carga diferida que contiene todas las funciones usadas para cargar imágenes e iframes de forma diferida. El patrón que usa es bastante similar a los ejemplos de código que se muestran aquí, ya que se vincula automáticamente a una clase de `lazyload` a `<img>` y requiere que especifiques las URL de la imagen en `data-src` y/o `data-srcset`, el contenido de que se intercambian en los `src` y/o `srcset` respectivamente. Utiliza Intersection Observer (que puede usarse mediante un polyfill) y se puede ampliar con [varios complementos](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo) para hacer cosas como cargas diferidas de videos. [Obtén más información sobre el uso de lazysizes](/use-lazysizes-to-lazyload-images/).
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) es una opción ligera para imágenes de carga diferida, imágenes de fondo, videos, iframes y scripts. Este utiliza Intersection Observer, admite imágenes receptivas y permite la carga diferida a nivel del navegador.
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) es otra opción ligera que solo usa Intersection Observer. Como tal, tiene un alto rendimiento, pero se tiene que hacer un polyfill antes de poder usarlo en navegadores más antiguos.
- [yall.js](https://github.com/malchata/yall.js) es una biblioteca que usa Intersection Observer y recurre a los controladores de eventos. Es compatible con IE11 y los principales navegadores.
- Si necesitas una biblioteca de carga diferida específica para React, considera [react-lazyload](https://github.com/jasonslyvia/react-lazyload). A pesar de que no utiliza Intersección Observer, *este* proporciona un método conocido de imágenes carga diferida para aquellos que están acostumbrados a desarrollar aplicaciones con React.
