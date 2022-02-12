---
title: 'Aprendiendo Portals: navegación perfecta en la web'
subhead: |2-

  Descubre cómo la propuesta de la API de Portals puede mejorar tu experiencia de usuario en la navegación.
date: 2019-05-06
updated: 2021-02-15
authors:
  - uskay
hero: image/admin/7hJbSWnhhE1lRVHJOWI9.png
alt: Un logo de Portals
description: |2-

  La recientemente propuesta API de Portals ayuda a mantener tu interfaz simple, al mismo tiempo que permite una navegación fluida con transiciones personalizadas. En este artículo, obtendrás experiencia práctica con Portals para mejorar la experiencia del usuario en tu sitio.
tags:
  - blog
  - ux
feedback:
  - api
---

Asegurarse de que tus páginas se carguen rápidamente es clave para ofrecer una buena experiencia de usuario. Pero un área que a menudo pasamos por alto son las transiciones de página: lo que ven nuestros usuarios cuando se mueven de una página a otra.

Una nueva propuesta de API de la plataforma web llamada [Portals](https://github.com/WICG/portals) tiene como objetivo ayudar con esto simplificando la experiencia a medida que los usuarios navegan *por* tu sitio.

Mira a Portals en acción:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_vp9.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_h264.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Incrustaciones y navegación sin problemas con Portals. Creado por <a href="https://twitter.com/argyleink">Adam Argyle</a>.</figcaption></figure>

## Qué habilita Portals

Las aplicaciones de página única (SPA) ofrecen buenas transiciones, pero tienen el costo de una mayor complejidad de construcción. Las aplicaciones de varias páginas (MPA) son mucho más fáciles de crear, pero terminas con pantallas en blanco entre las páginas.

Portals ofrece lo mejor de ambos mundos: la baja complejidad de un MPA con las transiciones fluidas de un SPA. Piensa en ellos como un `<iframe>` en el sentido de que permiten la incrustación, pero a diferencia de un `<iframe>`, también vienen con funciones para navegar a tu contenido.

Ver para creer: primero comprueba lo que mostramos en Chrome Dev Summit 2018:

{% YouTube id='Ai4aZ9Jbsys', startTime='1081' %}

Con las navegaciones clásicas, los usuarios tienen que esperar en una pantalla en blanco hasta que el navegador termine de renderizar el destino. Con Portals, los usuarios pueden experimentar una animación, mientras que el `<portal>` pre-renderiza el contenido y crea una experiencia de navegación perfecta.

Antes de Portals, podríamos haber renderizado otra página usando un `<iframe>`. También podríamos haber agregado animaciones para mover el marco por la página. Pero un `<iframe>` no te permitirá navegar por tu contenido. Los Portals cierran esta brecha, permitiendo casos de uso interesantes.

## Prueba Portals

### Habilitación a través de about://flags {: #enable-flags }

Prueba Portals en Chrome 85 y versiones posteriores habilitando una bandera experimental:

- Habilita la bandera de `about://flags/#enable-portals` para navegaciones del mismo origen.
- Para probar navegaciones de origen cruzado, también habilita la bandera de `about://flags/#enable-portals-cross-origin`.

Durante esta fase inicial del experimento de Portals, también recomendamos usar un directorio de datos de usuario completamente separado para tus pruebas configurando la bandera de línea de comando [`--user-data-dir`](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#command-line). Una vez que Portals esté habilitado, confirma en DevTools que tienes el nuevo `HTMLPortalElement`.

{% Img src="image/admin/aUrrqhzMxaEX865Fk5zX.png", alt="Una captura de pantalla de la consola de DevTools que muestra HTMLPortalElement", width="800", height="252" %}

## Implementar Portals

Veamos un ejemplo básico de implementación.

```javascript
// Crea un portal con la página de Wikipedia, e incrustala
// (en un iframe).También puedes usar la etiqueta de <portal>.
portal = document.createElement('portal');
portal.src = 'https://en.wikipedia.org/wiki/World_Wide_Web';
portal.style = '...';
document.body.appendChild(portal);

// Cuando el usuario toca la vista preview (el portal incrusta // do):
// haz una animación llamativa, por ejemplo: expandir...
// y termina haciendo la actual transición.
// Por motivos de simplicidad, este código navegará
// en el evento de 'onload' del elemento de Portals
portal.addEventListener('load', (evt) => {
   portal.activate();
});
```

Es así de simple. Prueba este código en la consola de DevTools, la página de Wikipedia debería abrirse.

{% Img src="image/admin/rp6i8ngGJkvooXJ9WmLK.gif", alt="Un gif de demostración de estilo de un portal de vista previa", width="800", height="557" %}

Si deseas crear algo como lo mostramos en Chrome Dev Summit y que funcione igual que la demostración anterior, el siguiente fragmento será de tu interés.

```javascript
// Agregando algunos estilos con transiciones
const style = document.createElement('style');
style.innerHTML = `
  portal {
    position:fixed;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 20px 10px #999;
    transform: scale(0.4);
    transform-origin: bottom left;
    bottom: 20px;
    left: 20px;
    animation-name: fade-in;
    animation-duration: 1s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }
  .portal-transition {
    transition: transform 0.4s;
  }
  @media (prefers-reduced-motion: reduce) {
    .portal-transition {
      transition: transform 0.001s;
    }
  }
  .portal-reveal {
    transform: scale(1.0) translateX(-20px) translateY(20px);
  }
  @keyframes fade-in {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
`;
const portal = document.createElement('portal');
// Vamos a navegar a la página de especificaciones de WICG
//Portals
portal.src = 'https://wicg.github.io/portals/';
// Agrega una clase que defina la transición. Considera usar
// `prefers-reduced-motion` como consulta de medios para contr// olar la animación.
// https://developers.google.com/web/updates/2019/03/prefers-reduced-motion
portal.classList.add('portal-transition');
portal.addEventListener('click', (evt) => {
  // Lanzar la animación cuando el usuario interactué con
  // los Portals
  portal.classList.add('portal-reveal');
});
portal.addEventListener('transitionend', (evt) => {
  if (evt.propertyName == 'transform') {
    // Activar el Portal cuando la transición sea completada
    portal.activate();
  }
});
document.body.append(style, portal);
```

También es fácil realizar la detección de funciones para mejorar progresivamente un sitio web utilizando Portals.

```javascript
if ('HTMLPortalElement' in window) {
  // Si esta es una plataforma que tiene Portals...
  const portal = document.createElement('portal');
  ...
}
```

Si deseas experimentar rápidamente cómo se siente Portals, intenta usar [uskay-portals-demo.glitch.me](https://uskay-portals-demo.glitch.me). ¡Asegúrate de acceder a él con Chrome 85 o versiones posteriores y activa la [bandera experimental](#enable-flags)!

1. Ingresa una URL de la que desees obtener una vista previa.
2. Luego, la página se incrustará como un elemento `<portal>`.
3. Haz clic en la vista previa.
4. La vista previa se activará después de una animación.

{% Img src="image/admin/Y4Vv6v3DAAC32IsiWS7g.gif", alt="Un gif de la demostración en Glitch usando Portals", width="800", height="547" %}

## Echa un vistazo a la especificación

Estamos discutiendo activamente [la especificación de Portals](https://wicg.github.io/portals/) en el Grupo de la Comunidad de Incubación Web (WICG). Para ponerte al día rápidamente, échale un vistazo a algunos de los [escenarios clave](https://github.com/WICG/portals/blob/master/key-scenarios.md). Estas son las tres características importantes con las que debes de familiarizarte:

- [El elemento `<portal>`](https://wicg.github.io/portals/#the-portal-element): El propio elemento HTML. La API es muy sencilla. Consiste en el atributo de`src`, la función de `activate` y una interfaz para mensajería (`postMessage`). `activate` toma un argumento opcional para pasar datos al `<portal>` al momento de la activación.
- [La interfaz `portalHost`](https://wicg.github.io/portals/#the-portalhost-interface): Agrega un objeto `portalHost` al objeto `window`. Esto te permite verificar si la página está incrustada como un elemento `<portal>`. También proporciona una interfaz para enviar mensajes (`postMessage`) de regreso al host.
- [La interfaz PortalActivateEvent](https://wicg.github.io/portals/#the-portalactivateevent-interface): Un evento que se dispara cuando se activa `<portal>`. Hay una función llamada `adoptPredecessor` en la que puedes usar para recuperar la página anterior como un elemento `<portal>`. Esto te permite crear navegaciones fluidas y experiencias compuestas entre dos páginas.

Veamos más allá del patrón de uso básico. Aquí hay una lista no exhaustiva de lo que puedes lograr con Portals junto con el código de muestra.

### Personaliza el estilo cuando se incrusta como un elemento `<portal>`

```javascript
// Detecta si la página está en un host con Portals
if (window.portalHost) {
  // Personalizar la IU cuando se incrusta como un portal
}
```

### Mensajería entre el elemento `<portal>` y `portalHost`

```javascript
// Envía un mensaje al elemento de portal
const portal = document.querySelector('portal');
portal.postMessage({someKey: someValue}, ORIGIN);

// Recibe un mensaje mediante window.portalHost
window.portalHost.addEventListener('message', (evt) => {
  const data = evt.data.someKey;
  // Maneja el evento
});
```

### Activando el elemento `<portal>` y recibiendo el evento `portalactivate`

```javascript
// Opcionalmente puedes agregar datos al argumentos para activ// ar la función
portal.activate({data: {somekey: 'somevalue'}});

// El contenido del portal recibirá el evento de portalactivat//e cuando el evento suceda
window.addEventListener('portalactivate', (evt) => {
  // Los datos estarán disponibles como evt.data
  const data = evt.data;
});
```

### Recuperando el predecesor

```javascript
// Escucha al evento de portalactivate
window.addEventListener('portalactivate', (evt) => {
  // ...y de manera creativa utiliza el predecesor
  const portal = evt.adoptPredecessor();
  document.querySelector('someElm').appendChild(portal);
});
```

### Saber que tu página fue adoptada como predecesora

```javascript
// La función de activación regresa una promesa.
// Cuando esta se resuelve, significa que el portal ha sido ac  // tivado.
// Si este documento fue adoptado por eso, window.portalHost // existirá
portal.activate().then(() => {
  // Verifica si el documento fue adoptado en un elemento de p    // ortal.
  if (window.portalHost) {
    // Puedes iniciar la comunicación con el elemento portal
    // en otras palabras, oír los mensajes
    window.portalHost.addEventListener('message', (evt) => {
      // manejar el evento
    });
  }
});
```

Al combinar todas las funciones compatibles con Portals, puedes crear experiencias de usuario muy elegantes. Por ejemplo, la siguiente demostración explica cómo los Portals pueden permitir una experiencia de usuario perfecta entre un sitio web y el contenido incrustado de terceros.

{% YouTube '4JkipxFVE9k' %}

{% Aside %} ¿Estás interesado en esta demostración? [¡Bifurcalo en GitHub](https://github.com/WICG/portals/tree/master/demos/portal-embed-demo) y crea tu propia versión! {% endAside %}

## Planes y casos de uso

¡Esperamos que te haya gustado este breve recorrido por Portals! No podemos esperar a ver qué se te ocurre. Por ejemplo, es posible que desees comenzar a usar Portals para navegaciones no triviales, como: renderizar previamente la página para tu producto más vendido desde una página de lista de categorías de productos.

Otra cosa importante que debe saber es que los Portals se pueden usar en navegaciones de origen cruzado, al igual que un `<iframe>`. Por lo tanto, si tienes varios sitios web que hacen referencia cruzada entre sí, también puedes usar Portals para crear una navegación fluida entre dos sitios web diferentes. Este caso de uso de origen cruzado es muy exclusivo de Portals e incluso puede mejorar la experiencia del usuario de los SPA.

## Bienvenida la retroalimentación

Portals está listo para experimentar en Chrome 85 y versiones posteriores. Los comentarios de la comunidad son cruciales para el diseño de nuevas API, así que úsalo y coméntanos lo que piensas. Si tienes alguna solicitud de función o comentarios, ve al [repositorio en GitHub de WICG](https://github.com/WICG/portals/issues).
