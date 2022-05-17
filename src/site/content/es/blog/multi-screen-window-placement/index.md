---
title: Administrar varias pantallas con la API de colocación de ventanas multipantalla
subhead: Obtenga información sobre las pantallas conectadas y la posición de las ventanas en relación con esas pantallas.
authors:
  - thomassteiner
description: |-
  La API de ubicación de ventanas multipantalla le permite enumerar las pantallas conectadas a su
  máquina y colocar ventanas en pantallas específicas.
date: 2020-09-14
updated: 2021-11-10
tags:
  - blog
  - capabilities
hero: image/admin/9wQYJACMKOM6aUA0BPsW.jpg
alt: Mesa de trading simulada que muestra múltiples criptodivisas falsas y sus gráficos de precios.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191"
feedback:
  - api
---

{% Aside %} La API de colocación de ventanas multipantalla es parte del [proyecto de capacidades](https://developer.chrome.com/blog/fugu-status/) y está actualmente en desarrollo. Esta publicación se actualizará a medida que avance la implementación. {% endAside %}

La API de colocación de ventanas multipantalla le permite enumerar las pantallas conectadas a su máquina y colocar ventanas en pantallas específicas.

### Casos de uso sugeridos {: #use-cases}

Ejemplos de sitios que pueden usar esta API incluyen:

- Los editores gráficos de ventanas múltiples tipo [Gimp](https://www.gimp.org/release-notes/gimp-2.8.html#single-window-mode) pueden colocar varias herramientas de edición en ventanas colocadas con precisión.
- Las mesas de trading virtual pueden mostrar las tendencias del mercado en múltiples ventanas, cualquiera de las cuales se puede ver en modo de pantalla completa.
- Las aplicaciones de presentación de diapositivas pueden mostrar notas del orador en la pantalla principal interna y la presentación en un proyector externo.

## Estado actual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crea un explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://webscreens.github.io/window-placement/" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopile comentarios y repita el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. <strong data-md-type="double_emphasis">Prueba de origen</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><p data-md-type="paragraph"><a href="https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191" data-md-type="link">En curso</a></p></strong></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lanzamiento</td>
<td data-md-type="table_cell">No empezado</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Cómo utilizar la API de colocación de ventanas multipantalla {: #use}

### Habilitación a través de about://flags

Para experimentar con la API de colocación de ventanas multipantalla localmente, sin un token de prueba de origen, habilite la bandera `#enable-experimental-web-platform-features` en `about://flags`.

### Habilitación de soporte durante la fase de prueba de origen

Una primera prueba de origen se realizó de Chromium 86 a Chromium 88. Después de esta prueba de origen, hicimos algunos [cambios](https://github.com/webscreens/window-placement/blob/main/CHANGES.md) en la API. El artículo se ha actualizado en consecuencia.

A partir de Chromium 93, la API de colocación de ventanas multipantalla volverá a estar disponible como prueba de origen en Chromium. Se espera que esta segunda prueba de origen finalice en Chromium 96 (15 de diciembre de 2021).

{% include 'content/origin-trials.njk' %}

### Regístrese para la prueba de origen {: #register-for-ot}

{% include 'content/origin-trial-register.njk' %}

### El problema

El enfoque probado con el tiempo para controlar las ventanas, [`Window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open), desafortunadamente no toma en cuenta las pantallas adicionales. Si bien algunos aspectos de esta API parecen un poco arcaicos, como su parámetro [`windowFeatures`](https://developer.mozilla.org/docs/Web/API/Window/open#Parameters:~:text=title.-,windowFeatures) `DOMString`, nos ha servido bien a lo largo de los años. Para especificar la [posición](https://developer.mozilla.org/docs/Web/API/Window/open#Position) de una ventana, puede pasar las coordenadas como `left` y `top` (o `screenX` y `screenY` respectivamente) y pasar el [tamaño](https://developer.mozilla.org/docs/Web/API/Window/open#Size:~:text=well.-,Size) deseado como `width` y `height` (o `innerwidth` e `innerHeight` respectivamente). Por ejemplo, para abrir una ventana de 400 × 300 a 50 píxeles de la izquierda y 50 píxeles de la parte superior, podría usar este código:

```js
const popup = window.open(
  'https://example.com/',
  'My Popup',
  'left=50,top=50,width=400,height=300',
);
```

Puede obtener información sobre la pantalla actual mirando la [`window.screen`](https://developer.mozilla.org/docs/Web/API/Window/screen), que devuelve un objeto [`Screen`](https://developer.mozilla.org/docs/Web/API/Screen). Esta es la salida en mi MacBook Pro 13 ″:

```js
window.screen;
/* Output from my MacBook Pro 13″:
  availHeight: 969
  availLeft: 0
  availTop: 25
  availwidth: 1680
  colorDepth: 30
  height: 1050
  isExtended: true
  onchange: null
  orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
  pixelDepth: 30
  width: 1680
*/
```

Como la mayoría de las personas que trabajan en campos de tecnología, he tenido que adaptarme a la nueva realidad laboral y montar mi propia oficina en casa. La mía se ve como en la foto de abajo (si está interesado, puede leer los [detalles completos sobre mi configuración](https://blog.tomayac.com/2020/03/23/my-working-from-home-setup-during-covid-19/)). El iPad al lado de mi MacBook está conectado a la computadora portátil a través de [Sidecar](https://support.apple.com/en-us/HT210380) , por lo que siempre que lo necesito, puedo convertir rápidamente el iPad en una segunda pantalla.

<figure>{% Img src="image/admin/Qt3SlHOLDzxpZ3l3bN5t.jpg", alt="Banco escolar en dos sillas. En la parte superior del banco escolar hay cajas de zapatos que sostienen una computadora portátil y dos iPads a su alrededor.", width="558", height="520" %}<figcaption> Una configuración multipantalla.</figcaption></figure>

Si quiero aprovechar la pantalla más grande, puedo colocar la ventana emergente del [ejemplo de código](/multi-screen-window-placement/#the-problem) anterior en la segunda pantalla. Lo hago así:

```js
popup.moveTo(2500, 50);
```

Esta es una suposición aproximada, ya que no hay forma de conocer las dimensiones de la segunda pantalla. La información de `window.screen` solo cubre la pantalla incorporada, pero no la pantalla del iPad. El `width` informado de la pantalla incorporada fue de `1680` píxeles, por lo que pasar a `2500` píxeles *podría* funcionar para cambiar la ventana al iPad, ya que *sé* que está ubicada a la derecha de mi MacBook. ¿Cómo puedo hacer esto en un caso general? Resulta que hay una forma mejor que tratar de adivinar. Esa forma es la API de colocación de ventanas multipantalla.

### Detección de características

Para comprobar si la API de colocación de ventanas multipantalla es compatible, utilice:

```js
if ('getScreenDetails' in window) {
  // The Multi-Screen Window Placement API is supported.
}
```

### El permiso `window-placement`

Antes de poder utilizar la API de colocación de ventanas multipantalla, debo pedirle permiso al usuario para hacerlo. El nuevo `window-placement` se puede consultar con la [API de permisos](https://developer.mozilla.org/docs/Web/API/Permissions_API) de la siguiente manera:

```js
let granted = false;
try {
  const { state } = await navigator.permissions.query({ name: 'window-placement' });
  granted = state === 'granted';
} catch {
  // Nothing.
}
```

El navegador [puede](https://webscreens.github.io/window-placement/#usage-overview-screen-information:~:text=This%20method%20may%20prompt%20the%20user%20for%20permission) optar por mostrar la solicitud de permiso de forma dinámica en el primer intento de utilizar cualquiera de los métodos de la nueva API. Siga leyendo para obtener más información.

### La propiedad `window.screen.isExtended`

Para saber si hay más de una pantalla conectada a mi dispositivo, yo accedo a la propiedad `window.screen.isExtended`. Devuelve `true` o `false`. Para mi configuración, devuelve `true`.

```js
window.screen.isExtended;
// Returns `true` or `false`.
```

### El método `getScreenDetails()`

Ahora que sé que la configuración actual es multipantalla, puedo obtener más información sobre la segunda pantalla usando `Window.getScreenDetails()`. Llamar a esta función mostrará un mensaje de permiso que me pregunta si el sitio puede abrir y colocar ventanas en mi pantalla. La función devuelve una promesa que se resuelve con un objeto `ScreenDetailed`. En mi MacBook Pro 13 con un iPad conectado, esto incluye un campo de `screens` con dos objetos `ScreenDetailed`:

```js
await window.getScreenDetails();
/* Output from my MacBook Pro 13″ with the iPad attached:
{
  currentScreen: ScreenDetailed {left: 0, top: 0, isPrimary: true, isInternal: true, devicePixelRatio: 2, …}
  oncurrentscreenchange: null
  onscreenschange: null
  screens: [{
    // The MacBook Pro
    availHeight: 969
    availLeft: 0
    availTop: 25
    availwidth: 1680
    colorDepth: 30
    devicePixelRatio: 2
    height: 1050
    isExtended: true
    isInternal: true
    isPrimary: true
    label: ""
    left: 0
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 30
    top: 0
    width: 1680
  },
  {
    // The iPad
    availHeight: 999
    availLeft: 1680
    availTop: 25
    availwidth: 1366
    colorDepth: 24
    devicePixelRatio: 2
    height: 1024
    isExtended: true
    isInternal: false
    isPrimary: false
    label: ""
    left: 1680
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 24
    top: 0
    width: 1366
  }]
}
*/
```

La información sobre las pantallas conectadas está disponible en la matriz de `screens`. Observe cómo el valor de `left` para el iPad comienza en `1680`, que es exactamente el `width` de la pantalla incorporada. Esto me permite determinar exactamente cómo están dispuestas lógicamente las pantallas (una al lado de la otra, una encima de la otra, etc.). También hay datos ahora de cada pantalla para mostrar si es interna (`isInternal`) y si es una Principal `isPrimary`. Tenga en cuenta que la pantalla incorporada [no es necesariamente la pantalla principal](https://osxdaily.com/2010/04/27/set-the-primary-display-mac/#:~:text=Click%20on%20the%20Display%20icon,primary%20display%20for%20your%20Mac) .

El campo `currentScreen` es un objeto vivo correspondiente a la pantalla `window.screen` actual. El objeto se actualiza en ubicaciones cruzadas de ventanas o cambios de dispositivo.

### El evento `screenschange`

Lo único que falta ahora es una forma de detectar cuándo cambia la configuración de mi pantalla. Un nuevo evento, `screenschange`, hace exactamente eso: se activa cada vez que se modifica la constelación de pantallas. (Observe que "screens" es plural en el nombre del evento). Esto significa que el evento se activa cada vez que se conecta o desconecta una nueva pantalla o una pantalla existente (física o virtualmente en el caso de Sidecar).

Tenga en cuenta que debe buscar los detalles de la nueva pantalla de forma asincrónica, el evento `screenschange` por sí no proporciona estos datos. Para buscar los detalles de la pantalla, use el objeto vivo desde una interfaz de `Screens` en caché.

```js
const screenDetails = await window.getScreenDetails();
let cachedScreensLength = screenDetails.screens.length;
screenDetails.addEventListener('screenschange', (event) => {
  if (screenDetails.screens.length !== cachedScreensLength) {
    console.log(
      `The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`,
    );
    cachedScreensLength = screenDetails.screens.length;
  }
});
```

### El evento `currentscreenchange`

Si sólo estoy interesado en los cambios en la pantalla actual (es decir, el valor del objeto directo `currentScreen`), puedo escuchar el evento `currentscreenchange`.

```js
const screenDetails = await window.getScreenDetails();
screenDetails.addEventListener('currentscreenchange', async (event) => {
  const details = screenDetails.currentScreen;
  console.log('The current screen has changed.', event, details);
});
```

### El evento `change`

Finalmente, si solo estoy interesado en cambios en una pantalla concreta, puedo escuchar el evento `change`.

```js
const firstScreen = (await window.getScreenDetails())[0];
firstScreen.addEventListener('change', async (event) => {
  console.log('The first screen has changed.', event, firstScreen);
});
```

### Nuevas opciones de pantalla completa

Hasta ahora, podía solicitar que los elementos se mostraran en modo de pantalla completa a través del método [`requestFullScreen()`](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen). El método toma un parámetro `options` donde puede pasar [`FullscreenOptions`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions). Hasta ahora, su única propiedad ha sido [`navigationUI`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions/navigationUI). La API de colocación de ventanas multipantalla agrega una nueva propiedad `screen` que le permite determinar en qué pantalla iniciar la vista de pantalla completa. Por ejemplo, si desea que la pantalla principal esté en pantalla completa:

```js
try {
  const primaryScreen = (await getScreenDetails()).screens.filter((screen) => screen.isPrimary)[0];
  await document.body.requestFullscreen({ screen: primaryScreen });
} catch (err) {
  console.error(err.name, err.message);
}
```

### Polyfill

No es posible aplicar polyfill a la API de colocación de ventanas multipantalla, pero puede ajustar su forma para poder codificar exclusivamente hacia la nueva API:

```js
if (!('getScreenDetails' in window)) {
  // Returning a one-element array with the current screen,
  // noting that there might be more.
  window.getScreenDetails = async () => [window.screen];
  // Set to `false`, noting that this might be a lie.
  window.screen.isExtended = false;
}
```

Los otros aspectos de la API, es decir, los diversos eventos de cambio de pantalla y la propiedad `screen` del `FullscreenOptions`, simplemente nunca se activarían o serían ignorados en silencio, respectivamente, por los navegadores no compatibles.

## Demostración

Si usted es como yo, vigila de cerca el desarrollo de las distintas criptomonedas. (En realidad, no lo hago mucho porque amo este planeta, pero, por el bien de este artículo, asuma que lo hago). Para realizar un seguimiento de las criptomonedas que poseo, he desarrollado una aplicación web que me permite ver los mercados en todas las situaciones de la vida, como desde la comodidad de mi cama, donde tengo una configuración decente de pantalla única.

<figure>{% Img src="image/admin/sSLkcAMHuqBaj4AmT5eP.jpg", alt= "Pantalla de televisión enorme al final de una cama con las piernas del autor parcialmente visibles. En la pantalla, una mesa de trading de criptodivisas falsas.", width="800", height="863" %}<figcaption> Relajándose y observando los mercados.</figcaption></figure>

Al tratarse de criptomonedas, los mercados pueden agitarse en cualquier momento. Si esto sucediera, puedo moverme rápidamente a mi escritorio donde tengo una configuración de múltiples pantallas. Puedo hacer clic en la ventana de cualquier moneda y ver rápidamente los detalles completos en una vista de pantalla completa en la pantalla opuesta. A continuación se muestra una foto reciente mía tomada durante el último [baño de sangre de YCY](https://www.youtube.com/watch?v=dQw4w9WgXcQ). Me tomó completamente desprevenido y me dejó [con las manos en la cara](https://www.buzzfeednews.com/article/gavon/brokers-with-hands-on-their-faces).

<figure>{% Img src="image/admin/wFu8TBzOAqaKCgcERr3z.jpg", alt="El autor con las manos en la cara de pánico mirando la mesa de trading de criptomonedas falsas.", width="800", height="600" %}<figcaption> En pánico, presenciando el baño de sangre de YCY.</figcaption></figure>

Puede jugar con la [demostración](https://window-placement.glitch.me/) incrustada a continuación, o ver su [código fuente](https://glitch.com/edit/#!/window-placement) en glitch.

<!-- Copy and Paste Me -->

<div class="glitch-embed-wrap" style="height: 800px; width: 100%;">   <iframe src="https://window-placement.glitch.me/" title="window-placement on Glitch" allow="fullscreen; window-placement" sandbox="allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Seguridad y permisos

El equipo de Chrome ha diseñado e implementado la API de colocación de ventanas multipantalla utilizando los principios básicos definidos en [Control del acceso a las potentes funciones de la plataforma web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluyendo el control del usuario, la transparencia y la ergonomía. La API de colocación de ventanas multipantalla expone nueva información sobre las pantallas conectadas a un dispositivo, lo que aumenta la superficie de huellas dactilares de los usuarios, especialmente aquellos con varias pantallas conectadas constantemente a sus dispositivos. Como mitigación de este problema de privacidad, las propiedades de la pantalla expuesta se limitan al mínimo necesario para los casos de uso común de la ubicación. Se requiere permisos de usuario para que los sitios obtengan información multipantalla y coloquen ventanas en otras pantallas.

### Control de usuario

El usuario tiene el control total de la exposición de su configuración. Pueden aceptar o rechazar la solicitud de permiso y revocar un permiso otorgado previamente a través de la función de información del sitio en el navegador.

### Transparencia

El hecho de que se haya otorgado el permiso para usar la API de colocación de ventanas multipantalla se muestra en la información del sitio del navegador y también se puede consultar a través de la API de permisos.

### Persistencia del permiso

El navegador conserva las concesiones de permisos. El permiso se puede revocar a través de la información del sitio del navegador.

## Retroalimentación {: #feedback }

El equipo de Chrome desea conocer sus experiencias con la API de colocación de ventanas multipantalla.

### Cuéntenos sobre el diseño de la API

¿Hay algo en la API que no funciona como esperaba? ¿O faltan métodos o propiedades que necesita para implementar su idea? ¿Tiene alguna pregunta o comentario sobre el modelo de seguridad?

- Reporte un problema de especificaciones en el [repositorio de GitHub](https://github.com/webscreens/window-placement/issues) correspondiente o agregue sus comentarios a un reporte existente.

### Reporte problemas con la implementación

¿Encontró un error con la implementación en Chrome? ¿O la implementación es diferente de la especificación?

- Reporte los errores en [new.crbug.com](https://new.crbug.com). Asegúrese de incluir todos los detalles que pueda, instrucciones simples para reproducir el error e ingrese [`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog) en el cuadro **Components**. [Glitch](https://glitch.com/) funciona muy bien para compartir repros rápidos y fáciles.

### Muestre su apoyo a la API

¿Está pensando en utilizar la API de colocación de ventanas multipantalla? Su apoyo público ayuda al equipo de Chrome a priorizar las funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

- Comparta cómo planea usarlo en el [hilo WICG Discourse](https://discourse.wicg.io/t/proposal-supporting-window-placement-on-multi-screen-devices/3948) .
- Envíe un tweet a [@ChromiumDev](https://twitter.com/ChromiumDev) utilizando el hashtag [`#WindowPlacement`](https://twitter.com/search?q=%23WindowPlacement&src=typed_query&f=live) y díganos dónde y cómo lo está utilizando.
- Solicite a otros proveedores de navegadores que implementen la API.

## Enlaces útiles {: #helpful}

- [Borrador de especificaciones](https://webscreens.github.io/window-placement/)
- [Explicador público](https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md)
- [Demostración de la API de colocación de ventanas multipantalla](https://window-placement.glitch.me/) | [Fuente de demostración de la API de colocación de ventanas multipantalla](https://glitch.com/edit/#!/window-placement)
- [Error de seguimiento de Chromium](https://crbug.com/897300)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/5252960583942144)
- Componente Blink: [`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog)
- [Revisión de TAG](https://github.com/w3ctag/design-reviews/issues/522)
- [Intent to Experiment](https://groups.google.com/a/chromium.org/g/blink-dev/c/C6xw8i1ZIdE/m/TJsr0zXxBwAJ)

## Agradecimientos

[Victor Costan](https://www.linkedin.com/in/pwnall) y [Joshua Bell](https://www.linkedin.com/in/joshuaseanbell) editaron la especificación de la API de colocación de ventanas multipantalla. La API fue implementada por [Mike Wasserman](https://www.linkedin.com/in/mike-wasserman-9900a079/) y [Adrienne Walker](https://github.com/quisquous). Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley), [François Beaufort](https://github.com/beaufortfrancois) y [Kayce Basques](https://github.com/kaycebasques). Gracias a Laura Torrent Puig por las fotos.
