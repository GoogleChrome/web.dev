---
layout: post
title: Carga diferida de imágenes a nivel del navegador para la web
subhead: "¡La carga diferida incorporada finalmente está aquí!"
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-08-06
updated: 2020-07-16
hero: image/admin/F6VE4QkpCsomiJilTFNG.png
alt: Esquema del teléfono con imagen de carga y activos
description: |2-

  Esta publicación cubre el atributo para cargar (loading) y cómo se puede usar para controlar la carga de imágenes.
tags:
  - blog
  - performance
feedback:
  - api
---

¡La compatibilidad con el nivel del navegador para imágenes de carga diferida ahora es compatible en la web! Este video muestra una [demostración](https://mathiasbynens.be/demo/img-loading-lazy) de la función:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
  </source></source></video></figure>

Desde Chrome 76 en adelante, puede usar el atributo de `loading` para cargar imágenes de forma diferida sin la necesidad de escribir un código de carga diferida personalizado o usar una biblioteca de JavaScript separada. Es hora de dar un clavado en los detalles.

## Compatibilidad del navegador

`<img loading=lazy>` es compatible con los navegadores más populares con tecnología Chromium (Chrome, Edge, Opera) y [Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/75#HTML). La implementación de WebKit (Safari) [está en progreso](https://bugs.webkit.org/show_bug.cgi?id=200764). [caniuse.com](https://caniuse.com/#feat=loading-lazy-attr) tiene información detallada sobre la compatibilidad con varios navegadores. Los navegadores que no admiten el atributo de `loading` simplemente lo ignoran sin efectos secundarios.

## ¿Por qué la carga diferida a nivel del navegador?

Según [HTTPArchive](https://httparchive.org/reports/page-weight), las imágenes son el tipo de archivo más consultado para la mayoría de los sitios web y, por lo general, ocupan más ancho de banda que cualquier otro recurso. En el percentil 90, los sitios envían aproximadamente 4,7 MB de imágenes en computadoras de escritorio y dispositivos móviles. Eso equivale a muchas [fotos de gatos](https://en.wikipedia.org/wiki/Cats_and_the_Internet).

Actualmente, hay dos formas de aplazar la carga de imágenes fuera de la pantalla:

- Usando la [API de Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/)
- Usando los [controladores de eventos de](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way) `scroll`, `resize` o `orientationchange`

Cualquiera de las opciones puede permitir a los desarrolladores incluir la funcionalidad de carga diferida, y muchos desarrolladores han creado bibliotecas de terceros para proporcionar abstracciones que son aún más fáciles de usar. Sin embargo, con la carga diferida compatible directamente con el navegador, no es necesario una biblioteca externa. La carga diferida a nivel del navegador también garantiza que la carga diferida de imágenes siga funcionando incluso si JavaScript está deshabilitado en el cliente.

## El atributo de `loading`

Hoy en día, Chrome carga imágenes con diferentes prioridades dependiendo de dónde se encuentren con respecto a la ventana gráfica del dispositivo. Las imágenes debajo de la ventana gráfica se cargan con una prioridad más baja, pero aún así se obtienen lo antes posible.

En Chrome 76+, puede utilizar el `loading` para aplazar por completo la carga de imágenes fuera de la pantalla a las que se puede acceder desplazándose:

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Estos son los valores admitidos para el atributo de `loading`

- `auto`: comportamiento predeterminado de carga diferida del navegador, que es lo mismo que no incluir el atributo.
- `lazy`: pospone la carga del recurso hasta que alcance una [distancia calculada](#distance-from-viewport-thresholds) desde la ventana gráfica.
- `eager`: carga el recurso inmediatamente, independientemente de dónde se encuentre en la página.

{% Aside 'caution' %} Aunque está disponible en Chromium, el `auto` no se menciona en la [especificación](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes). Dado que puede estar sujeto a cambios, recomendamos no usarlo hasta que sea incluido. {% endAside %}

### Limite de distancia desde la ventana gráfica

Todas las imágenes que están en la mitad superior de la página, es decir, que se pueden ver inmediatamente sin desplazarse, se cargan normalmente. Las que están muy por debajo de la ventana gráfica del dispositivo solo se cargan cuando el usuario se desplaza cerca de ellas.

La implementación de Chromium de la carga diferida intenta garantizar que las imágenes fuera de la pantalla se carguen lo suficientemente temprano para que estén listas una vez que el usuario se desplaza cerca de ellas. Al buscar imágenes cercanas antes de que se vuelvan visibles en la ventana gráfica, maximizamos la posibilidad de que ya estén cargadas cuando se vuelven visibles.

En comparación con las bibliotecas de carga diferida de JavaScript, los limites para obtener imágenes que se desplazan a la vista pueden considerarse como conservadores. Chromium busca alinear mejor estos limites con las expectativas de los desarrolladores.

{% Aside %} Los experimentos realizados con Chrome en Android sugieren que en 4G, el 97,5% de las imágenes de la mitad inferior de la página que se cargan de forma diferida se cargaron por completo en un plazo de 10ms desde que se hicieron visibles. Incluso en redes 2G lentas, el 92,6% de las imágenes de la mitad inferior de la página se cargaron por completo en 10ms. Esto significa que la carga diferida a nivel del navegador ofrece una experiencia estable con respecto a la visibilidad de los elementos que se desplazan hacia la vista. {% endAside %}

El limite de distancia no es fijo y varía en función de varios factores:

- El tipo de recurso de imagen que se está recuperando.
- Si el [modo lite](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) está habilitado en Chrome para Android
- El [tipo de conexión efectiva](https://googlechrome.github.io/samples/network-information/)

Puede encontrar los valores predeterminados para los diferentes tipos de conexiones efectivas en la [fuente de Chromium](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad). Estos números, e incluso el enfoque de buscar solo cuando se alcanza una cierta distancia desde la ventana gráfica, pueden cambiar en un futuro cercano a medida que el equipo de Chrome mejora la heurística para determinar cuándo comenzar a cargar.

{% Aside %} En Chrome 77+, puede experimentar con estos diferentes limites al [limitar la red](https://developer.chrome.com/docs/devtools/network/#throttle) en las DevTools. Mientras tanto, deberá anular el tipo de conexión efectiva del navegador mediante el uso de la bandera de `about://flags/#force-effective-connection-type`. {% endAside %}

## Ahorro de datos mejorado y limites de distancia desde la ventana gráfica

A partir de julio de 2020, Chrome ha realizado mejoras significativas para alinear los limites de la distancia de carga diferida desde la ventana gráfica de la imagen para cumplir mejor con las expectativas de los desarrolladores.

En conexiones rápidas (por ejemplo, 4G), redujimos los limites de distancia desde la ventana de Chrome de `3000px` a `1250px` y en conexiones más lentas (por ejemplo, 3G), cambiamos el limite de `4000px` a `2500px`. Este cambio logra dos cosas:

- `<img loading=lazy>` se comporta más cerca de la experiencia que ofrecen las bibliotecas de carga diferida de JavaScript.
- Los nuevos limites de distancia desde la ventana gráfica aún nos permiten garantizar que las imágenes probablemente se hayan cargado cuando un usuario se haya desplazado hacia ellas.

Puede encontrar una comparación entre los limites de distancia desde la ventana gráfica antiguos y los nuevos para una de nuestras demostraciones en una conexión rápida (4G) a continuación:

Limites antiguos contra limites nuevos:

<figure>{% Img src="image/admin/xSZMqpbioBRwRTnenK8f.png", alt="Los nuevos y mejorados limites para la carga diferida de imágenes, reduciendo los limites de distancia desde la ventana gráfica para conexiones rápidas de 3000px a 1250px", width="800", height="460" %}</figure>

y los nuevos limites frente a LazySizes (una popular biblioteca de carga diferida de JS):

<figure>{% Img src="image/admin/oHMFvflk9aesT7r0iJbx.png", alt="Los nuevos limites de distancia desde la ventana gráfica en Chrome carga 90KB de imágenes en comparación con LazySizes que carga en 70KB en las mismas condiciones de red", width="800", height="355" %}</figure>

{% Aside %} Para garantizar que los usuarios de Chrome en versiones recientes también se beneficien de los nuevos limites, hemos respaldado estos cambios para que Chrome 79 - 85 también los use. Tenga esto en cuenta si intenta comparar los ahorros de datos de versiones anteriores de Chrome con las más recientes. {% endAside %}

Estamos comprometidos a trabajar con la comunidad de estándares web para explorar una mejor alineación en cómo se abordan los limites de distancia desde la ventana gráfica en diferentes navegadores.

### Las imágenes deben incluir atributos de dimensión

Mientras el navegador carga una imagen, no conoce inmediatamente las dimensiones de la misma, a menos que se especifiquen explícitamente. Para permitir que el navegador reserve suficiente espacio en una página para imágenes, se recomienda que todas las etiquetas `<img>` incluyan atributos de `width` y de `height`. Sin las dimensiones especificadas, pueden producirse [cambios en el diseño](/cls), que son más evidentes en las páginas que tardan más tiempo en cargarse.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

Alternativamente, especifique sus valores directamente en un estilo en línea:

```html
<img src="image.png" loading="lazy" alt="…" style="height:200px; width:200px;">
```

La mejor práctica para establecer dimensiones se aplica a las `<img>` independientemente de si se cargan de forma diferida o no. Con la carga diferida, esto puede volverse más relevante. Establecer el `width` y la `height` de las imágenes en los navegadores modernos también permite a los navegadores inferir su tamaño intrínseco.

En la mayoría de los escenarios, las imágenes aún se cargan de forma diferida si no se incluyen las dimensiones, pero hay algunos casos extremos que se debe de conocer. Sin `width` y el `height`, las dimensiones de la imagen son 0 × 0 píxeles al principio. Si tiene una galería de tales imágenes, el navegador puede concluir que todas encajan dentro de la ventana gráfica al principio, ya que cada una de ellas prácticamente no ocupa espacio y ninguna imagen se desplaza fuera de la pantalla. En este caso el navegador determina que todos son visibles para el usuario y decide cargarlos todos.

Además, [especificar las dimensiones de la imagen reduce las posibilidades de que se produzcan cambios en el diseño](https://www.youtube.com/watch?v=4-d_SoCHeWE). Si no puede incluir dimensiones para sus imágenes, cargarlas de forma diferida puede ser una compensación entre ahorrar recursos de red y tener un riesgo mayor de cambio de diseño.

Si bien la carga diferida en Chromium se implementa de tal manera de que sea probable que las imágenes se carguen una vez que estén visibles, todavía existe una pequeña posibilidad de que aún no se hayan cargado. En este caso, los atributos de `width` y `height` faltan en tales imágenes y con ello aumentan su impacto en el Cambio de diseño acumulativo.

{% Aside %} Eche un vistazo a esta [demostración](https://mathiasbynens.be/demo/img-loading-lazy) para ver cómo funciona el `loading` con 100 imágenes. {% endAside %}

Las imágenes que se definen mediante el `<picture>` también se pueden cargar de forma diferida:

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
  <img src="photo.jpg" loading="lazy">
</picture>
```

Aunque un navegador decidirá qué imagen cargar de cualquiera de los `<source>`, el `loading` solo debe incluirse en el elemento de respaldo `<img>` .

## Evite las imágenes de carga diferida que se encuentran en la primera ventana gráfica visible

Debe evitar configurar `loading=lazy` para las imágenes que se encuentran en la primera ventana gráfica visible.

Si es posible, se recomienda agregar sólo `loading=lazy` a las imágenes que se colocan debajo de la primera pantalla. Las imágenes que se cargan rápidamente se pueden recuperar de inmediato, mientras para las imágenes que se cargan de manera diferida, el navegador actualmente necesita esperar hasta que reconozca dónde está posicionada la imagen en la página, lo que depende de que IntersectionObserver esté disponible.

{% Aside %} En Chromium, el impacto de las imágenes en la ventana gráfica inicial marcadas con `loading=lazy` en Largest Contentful Paint: Despliegue del contenido más extenso (LCP) es bastante pequeño, con una regresión de &lt;1% en los percentiles 75 y 99 en comparación con las imágenes cargadas rápidamente. {% endAside %}

En general, cualquier imagen dentro de la ventana gráfica debe cargarse rápidamente utilizando los valores predeterminados del navegador. No es necesario especificar `loading=eager` para que este sea el caso de las imágenes en la ventana gráfica.

```html
<!-- visible in the viewport -->
<img src="product-1.jpg" alt="..." width="200" height="200">
<img src="product-2.jpg" alt="..." width="200" height="200">
<img src="product-3.jpg" alt="..." width="200" height="200">

<!-- offscreen images -->
<img src="product-4.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-5.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-6.jpg" loading="lazy" alt="..." width="200" height="200">
```

## Degradación elegante

Los navegadores que aún no tienen compatibilidad con el atributo de `loading` ignorarán su presencia. Si bien estos navegadores, no obtendrán los beneficios de la carga diferida, incluir el atributo no tiene un impacto negativo en ellos.

## Preguntas frecuentes

### ¿Hay planes para cargar imágenes de forma diferida automáticamente en Chrome?

Chromium ya carga automáticamente de forma diferida cualquier imagen que sea adecuada para diferir si el [modo lite](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) está habilitado en Chrome para Android. Esto está dirigido principalmente a usuarios conscientes del ahorro de datos.

### ¿Puedo cambiar qué tan cerca debe estar una imagen antes de que se active una carga?

Estos valores están codificados y no se pueden cambiar a través de la API. Sin embargo, pueden cambiar en el futuro a medida que los navegadores experimenten con diferentes distancias de limite y variables.

### ¿Pueden las imágenes de fondo del CSS aprovechar el atributo de `loading`?

No, actualmente solo se puede usar con las etiquetas `<img>`

### ¿Existe algún inconveniente en las imágenes de carga diferida que se encuentran dentro de la ventana gráfica del dispositivo?

Es más seguro evitar colocar `loading=lazy` en las imágenes de la mitad superior de la página, ya que Chrome no precargará `loading=lazy` en el escáner de precarga.

### ¿Cómo funciona el `loading` con imágenes que están en la ventana gráfica pero que no son visibles inmediatamente (por ejemplo: detrás de un carousel u ocultas por el CSS para ciertos tamaños de pantalla)?

Solo las imágenes que están por debajo de la ventana gráfica del dispositivo por la [distancia calculada](#distance-from-viewport-thresholds) se cargan de manera diferida. Todas las imágenes sobre la ventana gráfica, independientemente de si son inmediatamente visibles, se cargan normalmente.

### ¿Qué sucede si ya estoy usando una biblioteca de terceros o un script para cargar imágenes de forma diferida?

El `loading` no debería afectar el código que actualmente carga de forma diferida sus archivos de ninguna manera, pero hay algunas cosas importantes a considerar:

1. Si su cargador diferido personalizado intenta cargar imágenes o marcos antes que cuando Chrome los carga normalmente, es decir, a una distancia mayor que los [limites de distancia desde la ventana gráfica](#distance-from-viewport-thresholds), se aplazarán y se cargarán según el comportamiento normal del navegador.
2. Si su cargador diferido personalizado utiliza una distancia más corta para determinar cuándo cargar una imagen en particular que el navegador, entonces el comportamiento se ajustará a su configuración personalizada.

Una de las razones importantes para seguir usando una biblioteca de terceros junto con `loading="lazy"` es proporcionar un polyfill para los navegadores que aún no tienen compatibilidad con el atributo.

### ¿Cómo manejo los navegadores que aún no tienen compatibilidad con la carga diferida?

Cree un polyfill o utilice una biblioteca de terceros para cargar imágenes en forma diferida en su sitio. La propiedad de `loading` se puede utilizar para detectar si la función es compatible con el navegador:

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

Por ejemplo, [lazysizes](https://github.com/aFarkas/lazysizes) es una popular biblioteca de carga diferida de JavaScript. Puede detectar el soporte al atributo de `loading` para cargar lazysizes como una biblioteca de reserva sólo cuando `loading` no sea compatible. Esto funciona de la siguiente manera:

- Reemplace `<img src>` con `<img data-src>` para evitar una carga rápida en navegadores no compatibles. Si el atributo de `loading` es compatible, intercambie `data-src` por `src`.
- Si `loading` no es compatible, cargue una opción de respaldo (lazysizes) e inícielo. Según los documentos de lazysizes, se usa la `lazyload` como una forma de indicar a lazysizes qué imágenes se cargarán de forma diferida.

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt="…">

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="cats.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="dogs.jpg" alt="…" loading="lazy" class="lazyload">

<script>
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
</script>
```

Aquí hay una [demostración](https://lazy-loading.firebaseapp.com/lazy_loading_lib.html) de este patrón. Pruébelo en un navegador como Firefox o Safari para ver el respaldo en acción.

{% Aside %} La biblioteca lazysizes también proporciona un [complemento de carga](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading) que usa la carga diferida a nivel del navegador cuando está disponible, pero recurre a la funcionalidad personalizada de la biblioteca cuando es necesario. {% endAside %}

### ¿La carga diferida para iframes también es compatible con Chrome?

`<iframe loading=lazy>` se estandarizó recientemente y ya está implementado en Chromium. Esto le permite cargar iframes de forma diferida utilizando el atributo `loading`. En breve se publicará un artículo dedicado sobre la carga diferida de iframe en web.dev.

El `loading` afecta a los iframes de manera diferente que a las imágenes, dependiendo de si el iframe está oculto. (Los iframes ocultos se utilizan a menudo con fines analíticos o de comunicación). Chrome utiliza los siguientes criterios para determinar si un iframe está oculto:

- El ancho y el alto del iframe son 4 px o menos.
- `display: none` o `visibility: hidden` es utilizado.
- El iframe se coloca fuera de la pantalla con un posicionamiento X o Y negativo.

Si un iframe cumple con alguna de estas condiciones, Chrome lo considera oculto y no lo cargará de forma diferida en la mayoría de los casos. Los iframes que *no estén* ocultos solo se cargarán cuando estén dentro de los [limites de distancia desde la ventana gráfica](#distance-from-viewport-thresholds). Se muestra un marcador de posición para los iframes cargados de forma diferida que aún están siendo recuperados.

### ¿Cómo afecta la carga diferida a nivel del navegador a los anuncios en una página web?

Todos los anuncios que se muestran al usuario en forma de imagen o iframe se cargan de forma diferida como cualquier otra imagen o iframe.

### ¿Cómo se manejan las imágenes cuando se imprime una página web?

Aunque la funcionalidad no está en Chrome actualmente, existe un [problema abierto](https://bugs.chromium.org/p/chromium/issues/detail?id=875403) para garantizar que todas las imágenes e iframes se carguen inmediatamente si se imprime una página.

### ¿Lighthouse reconoce la carga diferida a nivel del navegador?

Las versiones anteriores de Lighthouse aún destacarían que las páginas que usan `loading=lazy` en imágenes requerían una estrategia para cargar imágenes fuera de la pantalla. [Lighthouse 6.0](/lighthouse-whats-new-6.0/) y superior tienen un mejor factor en los enfoques para la carga diferida de imágenes fuera de la pantalla que pueden usar diferentes limites, lo que les permite pasar la auditoría de [diferir imágenes fuera de la pantalla](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/).

## Conclusión

Implementar una compatibilidad de imágenes de carga diferida puede facilitarle significativamente la mejora del rendimiento de sus páginas web.

¿Está notando algún comportamiento inusual con esta función habilitada en Chrome? [¡Reporta el problema!](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C)
