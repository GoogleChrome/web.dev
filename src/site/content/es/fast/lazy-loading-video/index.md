---
layout: post
title: Carga diferida de video
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: |2-

  Esta publicación explica la carga diferida y las opciones de las que dispone cuando carga un vídeo de forma diferida.
tags:
  - performance
feedback:
  - api
---

Al igual que con los [elementos de imagen](/lazy-loading-images), también puede cargar videos de forma diferida. Los videos se cargan comúnmente con el elemento `<video>` (aunque [ha surgido un método alternativo que usa `<img>`](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/) con una implementación limitada). Sin embargo, la *forma* de cargar `<video>` de manera diferida depende del caso de uso. Analicemos un par de escenarios, cada uno de los cuales requiere una solución diferente.

## Para video que no se reproduce automáticamente {: #video-no-autoplay }

Para los videos en los que el usuario inicia la reproducción (es decir, los videos que *no* se reproducen automáticamente), quizá sea deseable especificar el [atributo `preload`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-preload) en el elemento `<video>`:

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

El ejemplo anterior utiliza un atributo `preload` con un valor `none` para evitar que los navegadores precarguen *cualquier* dato de vídeo. El atributo `poster` le da al elemento `<video>` un marcador de posición que ocupará el espacio mientras se carga el video. La razón de esto es que los comportamientos predeterminados para cargar videos pueden variar de un navegador a otro:

- En Chrome, el valor predeterminado para `preload` solía ser `auto`, pero a partir de Chrome 64, ahora tiene como valor predeterminado `metadata`. Aun así, en la versión de escritorio de Chrome, una parte del video puede precargarse mediante el encabezado `Content-Range`. Firefox, Edge e Internet Explorer 11 se comportan de manera similar.
- Al igual que con Chrome en el escritorio, las versiones 11.0 de Safari para escritorio precargarán un rango del video. A partir de la versión 11.2, solo se precargan los metadatos del video. [En Safari para iOS, los videos nunca se cargan previamente](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9).
- Cuando el [modo de ahorro de datos](https://support.google.com/chrome/answer/2392284) está habilitado, `preload` toma el valor predeterminado de `none`.

Debido a que los comportamientos predeterminados del navegador con respecto a `preload` no están escritos en piedra, ser explícito es probablemente su mejor opción. En estos casos en los que el usuario inicia la reproducción, usar `preload="none"` es la forma más fácil de aplazar la carga de video en todas las plataformas. El atributo `preload` no es la única forma de aplazar la carga de contenido de video. El documento [*Reproducción rápida con precarga de video*](/fast-playback-with-preload/) puede brindarle algunas ideas y conocimientos sobre cómo trabajar con la reproducción de video en JavaScript.

Desafortunadamente, no resulta útil cuando desea usar videos en lugar de GIF animados, que se tratan a continuación.

## Para video que actúa como reemplazo de GIF animado {: #video-gif-replacement}

Si bien los GIF animados disfrutan de un uso amplio, son inferiores de varias maneras a los equivalentes de video, particularmente en el tamaño del archivo. Los GIF animados pueden extenderse en el rango de varios megabytes de datos. Los videos de calidad visual similar tienden a ser mucho más pequeños.

Usar el elemento `<video>` como reemplazo del GIF animado no es tan sencillo como usar el elemento `<img>`. Los GIF animados tienen tres características:

1. Se reproducen automáticamente cuando se cargan.
2. Se repiten continuamente ([aunque ese no es siempre el caso](https://davidwalsh.name/prevent-gif-loop)).
3. No tienen pista de audio.

Lograr esto con el elemento `<video>` se parece a lo siguiente:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Los atributos `autoplay`, `muted` y `loop` se explican por sí mismos. El atributo {a3`playsinline` es necesario para que se produzca la reproducción automática en iOS. Ahora tiene un reemplazo útil del video como GIF que funciona en todas las plataformas. Pero, ¿cómo proceder con la carga diferida? Para comenzar, modifique su marcado de `<video>` en consecuencia:

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Puede notar la adición del [atributo `poster`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster), que le permite especificar un marcador de posición para ocupar el espacio de elemento `<video>` hasta que el video se cargue de forma diferida. Al igual que con los [ejemplos de carga diferida de `<img>`](/lazy-loading-images/), oculta la URL del video en el atributo `data-src` en cada elemento `<source>`. A partir de ahí, use código JavaScript similar a los ejemplos de carga diferida de imágenes basada en Intersection Observer:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

Cuando carga de manera diferida un elemento `<video>`, debe iterar a través de todos los elementos `<source>` secundarios y cambiar sus atributos `data-src` a atributos `src`. Una vez que haya hecho eso, debe activar la carga del video al invocar el método `load` del elemento, después de lo cual los medios comenzarán a reproducirse automáticamente según el atributo `autoplay`.

Con este método, tiene una solución de video que emula el comportamiento de los GIF animados, pero no implica el mismo uso intensivo de datos que los GIF animados y puede cargar ese contenido de forma diferida.

## Bibliotecas de carga diferida {: #libraries }

Las siguientes bibliotecas pueden ayudarlo a cargar videos de manera diferida:

- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) y [lozad.js](https://github.com/ApoorvSaxena/lozad.js) son opciones superligeras que solo usan Intersection Observer. Como tal, tienen un alto rendimiento, pero deberán envolverse en polietileno antes de poder usarlas en navegadores más antiguos.
- [yall.js](https://github.com/malchata/yall.js) es una biblioteca que usa Intersection Observer y recurre a los controladores de eventos. Es compatible con IE11 y los principales navegadores.
- Si necesita una biblioteca de carga diferida específica de React, podría considerar [react-lazyload](https://github.com/jasonslyvia/react-lazyload). A pesar de que no utiliza Intersection Observer, *proporciona* un método conocido de imágenes carga diferida para aquellos que están acostumbrados a desarrollar aplicaciones con React.

Cada una de estas bibliotecas de carga diferida está bien documentada, con muchos patrones de marcado para sus diversos esfuerzos de carga diferida.
