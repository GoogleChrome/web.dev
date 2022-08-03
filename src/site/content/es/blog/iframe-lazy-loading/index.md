---
layout: post
title: "¡Es hora de cargar de forma diferida iframes fuera de la pantalla!"
subhead: "¡Llegó la carga diferida incorporada al navegador para iframes!"
authors:
  - addyosmani
date: 2020-07-24
updated: 2022-07-12
hero: image/admin/dMCW2Qqi5Qp2DB3w4DyE.png
alt: Esquema del teléfono con carga de imagen y recursos
description: Esta publicación cubre el atributo loading y cómo se puede utilizar para controlar la carga de los iframes.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - memory
feedback:
  - api
---

[La carga diferida estandarizada para imágenes](/browser-level-image-lazy-loading/) llegó a Chrome 76 a través del atributo `loading` y más tarde a Firefox. Nos complace compartir que la **carga diferida en el navegador para iframes** ahora es [estándar](https://github.com/whatwg/html/pull/5579) y también es compatible con los navegadores Chrome y Chromium.

```html/1
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>
```

La carga diferida estandarizada de iframes difiere la carga de iframes fuera de la pantalla hasta que el usuario se desplaza cerca de ellos. Esto ahorra datos, acelera la carga de otras partes de la página y reduce el uso de memoria.

Esta [demo](https://lazy-load.netlify.app/iframes/) de `<iframe loading=lazy>` muestra código incrustado de video de carga diferida:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.mp4" type="video/mp4">
  </source></source></video></figure>

### ¿Por qué deberíamos cargar iframes de forma diferida?

El código incrustado de terceros cubre una amplia gama de casos de uso, desde reproductores de video hasta publicaciones en redes sociales y anuncios. A menudo, este contenido no es visible inmediatamente en la ventana gráfica del usuario. Por el contrario, solo se ve una vez que se desplazan hacia abajo en la página. A pesar de esto, los usuarios pagan el costo de descargar datos y JavaScript por cada cuadro, incluso si no se desplazan hasta él.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xqZMRuULxbz6DVXNP8ea.png", alt="Ahorro de datos por usar iframe lazy-loading para un iframe. En este ejemplo, una carga completa usa 3 MB, mientras que lazy-loading no descarga nada hasta que el usuario se desplaza cerca del iframe.", width="800", height="460" %}</figure>

Según la investigación de Chrome sobre [iframes fuera de pantalla de carga diferida automática para usuarios de Data Saver](https://blog.chromium.org/2019/10/automatically-lazy-loading-offscreen.html), los iframes de carga diferida podrían generar un ahorro medio de datos  del 2-3%, 1-2% de reducción de la [primera pintura con contenido](/fcp/) en la mediana y mejoras del 2% en el [retraso de la primera entrada](/fid/) (FID) en el percentil 95.

### ¿Cómo funciona la carga diferida incorporada para iframes?

El atributo `loading` permite que un navegador difiera la carga de iframes e imágenes fuera de la pantalla hasta que los usuarios se desplacen cerca de ellos. `loading` admite tres valores:

- `lazy`: es un buen candidato para la carga diferida.
- `eager`: no es un buen candidato para la carga diferida. Cargue de inmediato.

El uso del `loading` en iframes funciona de la siguiente manera:

```html
<!-- Lazy-load the iframe -->
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>

<!-- Eagerly load the iframe -->
<iframe src="https://example.com"
        width="600"
        height="400"></iframe>

<!-- or use loading="eager" to opt out of automatic
lazy-loading in Lite Mode -->
<iframe src="https://example.com"
        loading="eager"
        width="600"
        height="400"></iframe>
```

No especificar el atributo en absoluto tendrá el mismo impacto que cargar explícitamente el recurso con entusiasmo, excepto para los usuarios del [Modo Básico](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html), donde Chrome usará el `auto` para decidir si debe cargarse de forma diferida.

Si necesitas crear *dinámicamente* iframes a través de JavaScript, establecer `iframe.loading = 'lazy'` en el elemento también está [apoyado](https://bugs.chromium.org/p/chromium/issues/detail?id=993273) :

```js/2
var iframe = document.createElement('iframe');
iframe.src = 'https://example.com';
iframe.loading = 'lazy';
document.body.appendChild(iframe);
```

#### Comportamiento de carga diferida específico de iframe

El atributo de carga afecta a los iframes de manera diferente a las imágenes, dependiendo de si el iframe está oculto. (Los iframes ocultos se utilizan a menudo con fines analíticos o de comunicación). Chrome utiliza los siguientes criterios para determinar si un iframe está oculto:

- El ancho y el alto del iframe son de `4px` o menos.
- Se aplica `display: none` o `visibility: hidden`.
- El iframe se coloca fuera de la pantalla mediante un posicionamiento X o Y negativo.
- Este criterio se aplica tanto a `loading=lazy` como a `loading=auto`.

Si un iframe cumple alguna de estas condiciones, Chrome lo considera oculto y no lo cargará de forma diferida en la mayoría de los casos. Los iframes que no están ocultos solo se cargarán cuando estén dentro del [umbral de distancia de carga](/browser-level-image-lazy-loading/#load-in-distance-threshold). Chrome muestra un marcador de posición para los iframes cargados de forma diferida que aún se están recuperando.

### ¿Qué impacto podríamos ver en el código de incrustación de iframe populares de carga diferida?

¿Qué pasaría si pudiéramos cambiar la web en general para que los iframes fuera de pantalla de carga diferida fueran los predeterminados? Se vería un poco así:

Incrustaciones de video de YouTube de carga diferida (ahorra ~ 500 KB en la carga de la página inicial):

```html/1
<iframe src="https://www.youtube.com/embed/YJGCZCaIZkQ"
        loading="lazy"
        width="560"
        height="315"
        frameborder="0"
        allow="accelerometer; autoplay;
        encrypted-media; gyroscope;
        picture-in-picture"
        allowfullscreen></iframe>
```

**Anécdota:** cuando cambiamos a incrustaciones de YouTube de carga diferida para Chrome.com, ahorramos 10 segundos de la rapidez con la que nuestras páginas podrían ser interactivas en dispositivos móviles. Abrí un error interno con YouTube para discutir la adición de `loading=lazy` a su código de inserción.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HQkwBgEoyiZsiOaPyz8v.png", alt = "Chrome.com logró una reducción de 10 segundos en el tiempo de interacción mediante la carga diferida de iframes fuera de la pantalla para su video incrustado de YouTube", width = "800", height = "460"%}</figure>

{% Aside %} Si está buscando formas más eficientes de cargar inserciones de YouTube, es posible que le interese el [componente YouTube Lite](https://github.com/paulirish/lite-youtube-embed) . {% endAside %}

**Inserciones de Instagram de carga diferida (ahorra&gt; 100 KB en gzip en la carga inicial):**

Las incrustaciones de Instagram proporcionan un bloque de marcado y un script, que inyecta un iframe en su página. La carga diferida de este iframe evita tener que cargar todo el script necesario para la inserción. Dado que tales incrustaciones a menudo se muestran debajo de la ventana gráfica en la mayoría de los artículos, esto parece un candidato razonable para la carga diferida de su iframe.

**Incrustaciones de Spotify de carga diferida (ahorra 514 KB en la carga inicial):**

```html
<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
        loading="lazy"
        width="300"
        height="380"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"></iframe>
```

Aunque las incrustaciones anteriores ilustran los beneficios potenciales de los iframes de carga diferida para el contenido de medios, existe la posibilidad de ver también estos beneficios en los anuncios.

### Estudio de caso: carga diferida de los complementos sociales de Facebook

*Los complementos sociales* de Facebook permiten a los desarrolladores incrustar contenido de Facebook en sus páginas web. Se ofrecen varios de estos complementos, como publicaciones incrustadas, fotos, videos, comentarios… El más popular es el [complemento Me gusta](https://developers.facebook.com/docs/plugins/like-button/) , un botón que muestra un recuento de a quién le ha "gustado" la página. De forma predeterminada, incrustar el complemento Me gusta en una página web (utilizando FB JSSDK) extrae ~ 215 KB de recursos, de los cuales 197 KB son JavaScript. En muchos casos, el complemento puede aparecer al final de un artículo o cerca del final de una página, por lo que cargarlo con entusiasmo cuando está fuera de la pantalla puede ser subóptimo.

<figure>{% Img src = "image/admin/fdy8o61jxPN560IkF2Ne.png", alt = "Botón Me gusta de Facebook", width = "800", height = "71"%}</figure>

Gracias al ingeniero Stoyan Stefanov, [todos los complementos sociales de Facebook ahora admiten la carga diferida de iframe estandarizada](https://developers.facebook.com/docs/plugins/like-button#settings) . Los desarrolladores que opten por la carga diferida a través de la `data-lazy` diferidos de los complementos ahora podrán evitar que se cargue hasta que el usuario se desplace cerca. Esto permite que la inserción siga funcionando completamente para los usuarios que la necesitan, al tiempo que ofrece ahorros de datos para aquellos que no se desplazan hacia abajo en una página. Tenemos la esperanza de que esta sea la primera de muchas incorporaciones para explorar la carga diferida de iframe estandarizada en producción.

### ¿Puedo cargar iframes de forma diferida en varios navegadores? sí

La carga diferida de iframe se puede aplicar como una mejora progresiva. Los navegadores que admiten `loading=lazy` en iframes cargarán el iframe de forma perezosa, mientras que el `loading` se ignorará de forma segura en los navegadores que aún no lo admiten.

También es posible cargar de forma diferida iframes fuera de la pantalla utilizando la biblioteca de JavaScript [lazysizes.](/use-lazysizes-to-lazyload-images/) Esto puede ser deseable si:

- requieren más umbrales de carga diferida personalizados que los que ofrece actualmente la carga diferida estandarizada
- desea ofrecer a los usuarios una experiencia coherente de carga diferida de iframe en todos los navegadores

```html/3
<script src="lazysizes.min.js" async></script>

<iframe frameborder="0"
	  class="lazyload"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>
```

Utilice el siguiente patrón para detectar la función de carga diferida y obtener tamaños diferidos cuando no esté disponible:

```html/2
<iframe frameborder="0"
	  class="lazyload"
    loading="lazy"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>

<script>
  if ('loading' in HTMLIFrameElement.prototype) {
    const iframes = document.querySelectorAll('iframe[loading="lazy"]');

    iframes.forEach(iframe => {
      iframe.src = iframe.dataset.src;
    });

  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

</script>
```

### Una opción para los usuarios de WordPress {: #wordpress}

Es posible que tenga muchos iframes distribuidos a lo largo de años de contenido de publicación en un sitio de WordPress. Opcionalmente, puede agregar el siguiente código al `functions.php` su tema de WordPress para insertar automáticamente `loading="lazy"` en sus iframes existentes sin tener que actualizarlos manualmente de forma individual.

Tenga en cuenta que [en el núcleo de WordPress también se está trabajando en la compatibilidad a nivel del navegador para iframes de carga diferida](https://core.trac.wordpress.org/ticket/50756) . El siguiente fragmento verificará las banderas relevantes para que, una vez que WordPress tenga la funcionalidad incorporada, ya no agregará manualmente el `loading="lazy"` , lo que garantiza que sea interoperable con esos cambios y no resulte en un atributo duplicado. .

```php
// TODO: Remove once https://core.trac.wordpress.org/ticket/50756 lands.
function wp_lazy_load_iframes_polyfill( $content ) {
	// If WP core lazy-loads iframes, skip this manual implementation.
	if ( function_exists( 'wp_lazy_loading_enabled' ) && wp_lazy_loading_enabled( 'iframe', 'the_content' ) ) {
		return $content;
	}

	return str_replace( '<iframe ', '<iframe loading="lazy" ', $content );
}
add_filter( 'the_content', 'wp_lazy_load_iframes_polyfill' );
```

Si su sitio de WordPress utiliza almacenamiento en caché (pista: debería), no olvide reconstruir el caché de su sitio después.

### Conclusión

Hornear en soporte estandarizado para iframes de carga diferida hace que sea mucho más fácil para usted mejorar el rendimiento de sus páginas web. Si tiene algún comentario, no dude en enviar un problema a [Chromium Bug Tracker](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ELoader%3ELazyLoad) .

Y, en caso de que se lo haya perdido, consulte la [colección de carga diferida de imágenes y videos de](/fast/#lazy-load-images-and-video) web.dev para obtener más ideas de carga diferida.

*Agradecemos a Dom Farolino, Scott Little, Houssein Djirdeh, Simon Pieters, Kayce Basques, Joe Medley y Stoyan Stefanov por sus reseñas.*
