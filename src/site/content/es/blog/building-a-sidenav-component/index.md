---
layout: post
title: Construyendo un componente sidenav
subhead: Una descripción general de los fundamentos de cómo construir un sidenav deslizante responsivo
authors:
  - adamargyle
description: Una descripción general de los fundamentos de cómo construir un sidenav deslizante responsivo
date: 2021-01-21
hero: image/admin/Zo1KkESK9CfEIYpbWzap.jpg
thumbnail: image/admin/pVZO6FsC9tF3H6QIWpY2.png
codelabs: codelab-building-a-sidenav-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

En esta publicación, quiero compartir con ustedes cómo hice un prototipo de un componente de sidenav para la web que es responsivo, tiene estados, permite la navegación por teclado, funciona con y sin JavaScript y es compatible en todos los navegadores. Pruébalo en esta [demostración](https://gui-challenges.web.app/sidenav/dist/).

Si prefieres ver un video, aquí tienes una versión de YouTube de esta publicación:

{% YouTube 'uiZqDLqjGRY' %}

## Resumen

Es difícil construir un sistema de navegación responsivo. Algunos usuarios estarán en un teclado, algunos tendrán computadoras de escritorio potentes y algunos visitarán desde un pequeño dispositivo móvil. Todas las personas que visiten deben poder abrir y cerrar el menú.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/desktop-demo-1080p.mp4">
  </source></video>
  <figcaption>Demostración de diseño responsivo de escritorio a dispositivo móvil</figcaption></figure>

<figure>
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/mobile-demo-1080p.mp4">
  </source></video>
  <figcaption>Modo claro y modo oscuro en iOS y Android</figcaption></figure>

## Tácticas web

En esta exploración de componentes tuve la alegría de combinar algunas características críticas de la plataforma web:

1. CSS [`:target`](#target-psuedo-class)
2. [Cuadrícula](#grid-stack) CSS
3. [Transformaciones](#transforms) CSS
4. Consultas de medios CSS para la ventana gráfica y las preferencias del usuario
5. JS para el `focus` en las [mejoras UX](#ux-enhancements)

Mi solución tiene una barra lateral y se alterna solo cuando se encuentra en una ventana de `540px` o menos. `540px` será nuestro breakpoint (punto de interrupción) para cambiar entre el diseño interactivo móvil y el diseño de escritorio estático.

### Pseudoclase de CSS `:target` {: #target-psuedo-class }

Un enlace de `<a>` establece el hash de la URL en `#sidenav-open` y el otro en vacío ( `''`). Por último, un elemento tiene la `id` para que coincida con el hash:

```html
<a href="#sidenav-open" id="sidenav-button" title="Open Menu" aria-label="Open Menu">

<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<aside id="sidenav-open">
  …
</aside>
```

Al hacer clic en cada uno de estos enlaces cambia el estado hash de la URL de nuestra página, para que luego, con una pseudoclase, pueda mostrar y ocultar la sidenav (barra de navegación lateral):

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
  }

  #sidenav-open:target {
    visibility: visible;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/hash-change.mp4">
  </source></video></figure>

### Cuadrícula CSS {: #grid-stacks }

En el pasado, solo usaba diseños y componentes de navegación lateral de posición absoluta o fija. Sin embargo, la cuadrícula, con su sintax de `grid-area`, nos permite asignar múltiples elementos a la misma fila o columna.

#### Stacks

El elemento de diseño principal `#sidenav-container` es una cuadrícula que crea 1 fila y 2 columnas, 1 de cada una se denomina `stack` (pila). Cuando el espacio está restringido, CSS asigna todos los `<main>` al mismo nombre de cuadrícula, colocando todos los elementos en el mismo espacio, creando una pila.

```css
#sidenav-container {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;
  min-height: 100vh;
}

@media (max-width: 540px) {
  #sidenav-container > * {
    grid-area: stack;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/responsive-stack-demo-1080p.mp4">
  </source></video></figure>

#### Fondo del menú

`<aside>` es el elemento de animación que contiene la navegación lateral. Tiene 2 hijos: el contenedor de navegación `<nav>` llamado `[nav]` y un fondo `<a>` llamado `[escape]`, que se usa para cerrar el menú.

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

Ajusta `2fr` y `1fr` para encontrar la proporción que desees para la superposición del menú y su botón de cierre de espacio negativo.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </source></video>
  <figcaption>Una demostración de lo que sucede cuando cambias la proporción.</figcaption></figure>

### Transformaciones y transiciones 3D en CSS {: #transforms}

Nuestro diseño ahora está apilado en un tamaño de ventana para dispositivos móviles. Hasta que se agreguen algunos estilos nuevos, se superpondrá a nuestro artículo de forma predeterminada. Aquí hay algo de UX (experiencia del usuario) que estoy buscando hacer con la siguiente sección:

- Animar las acciones de abrir y cerrar
- Solo animar con movimiento si el usuario está de acuerdo con eso
- Animar la `visibility` para que el enfoque del teclado no entre en el elemento ubicado fuera de la pantalla

A medida que empiezo a implementar animaciones con movimiento, quiero comenzar teniendo la accesibilidad como una alta prioridad.

#### Movimiento accesible

No todo el mundo querrá una experiencia de movimiento al momento de deslizarse. En nuestra solución, esta preferencia se aplica ajustando una variable CSS de `--duration` dentro de una consulta de medios. Este valor de consulta de medios representa la preferencia del sistema operativo del usuario por el movimiento (si está disponible).

```css
#sidenav-open {
  --duration: .6s;
}

@media (prefers-reduced-motion: reduce) {
  #sidenav-open {
    --duration: 1ms;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </source></video>
  <figcaption>Se aplicó una demostración de la interacción con y sin duración.</figcaption></figure>

Ahora, cuando nuestra sidenav se abre y se cierra, si un usuario prefiere un movimiento reducido, instantáneamente moveré el elemento a la vista, manteniendo el estado sin movimiento.

#### Transición, transformación, traslación

##### Sidenav afuera (predeterminado)

Para establecer el estado predeterminado de nuestro sidenav en el móvil a un estado fuera de la pantalla, yo posiciono el elemento con `transform: translateX(-110vw)`.

Ten en cuenta que agregué otros `10vw` al típico código fuera de la pantalla de `-100vw`, para asegurarme de que la `box-shadow` de la sidenav no se asome a la ventana principal cuando esté oculta.

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
    transform: translateX(-110vw);
    will-change: transform;
    transition:
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
  }
}
```

##### Sidenav adentro

Cuando el `#sidenav` coincida con `:target`, define la posición de `translateX()` a `0` y observa cómo el CSS desliza el elemento desde su posición de `-110vw` a su posición, "in" (adentro), de `0` durante `var(--duration)` cuando se cambia el hash de la URL.

```css
@media (max-width: 540px) {
  #sidenav-open:target {
    visibility: visible;
    transform: translateX(0);
    transition:
      transform var(--duration) var(--easeOutExpo);
  }
}
```

#### Visibilidad de la transición

El objetivo ahora es ocultar el menú a los lectores cuando está por fuera de la pantalla, para que los sistemas no pongan el enfoque en un menú fuera de la pantalla. Esto se logra estableciendo una transición de visibilidad cuando cambia `:target`.

- Al entrar, que la visibilidad no haga una transición; debe de ser visible de inmediato para que pueda ver el elemento deslizarse y aceptar el enfoque.
- Al salir, cambia la visibilidad, pero la retrasa, por lo que cambia a `hidden` al final de la transición.

### Mejoras de accesibilidad UX {: #ux-improvement }

#### Enlaces

Esta solución se basa en cambiar la URL para que se maneje el estado. Naturalmente, el elemento de `<a>` debería usarse aquí y tiene algunas funciones de accesibilidad interesantes de forma gratuita. Adornemos nuestros elementos interactivos con etiquetas que expresen claramente la intención.

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
  <svg>...</svg>
</a>
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/keyboard-voiceover.mp4">
  </source></video>
  <figcaption>Una demostración de la UX de interacción de voz y teclado.</figcaption></figure>

Ahora, nuestros botones de interacción principales indican claramente su intención tanto para el ratón como para el teclado.

#### `:is(:hover, :focus)`

Este práctico pseudo-selector funcional de CSS nos permite incluir rápidamente nuestros estilos de desplazamiento al compartirlos con el enfoque también.

```css
.hamburger:is(:hover, :focus) svg > line {
  stroke: hsl(var(--brandHSL));
}
```

#### Sprinkle en JavaScript

##### Presiona `escape` para cerrar

La tecla `Escape` de tu teclado debería cerrar el menú, ¿verdad? Nos encargaremos que eso suceda.

```js
const sidenav = document.querySelector('#sidenav-open');

sidenav.addEventListener('keyup', event => {
  if (event.code === 'Escape') document.location.hash = '';
});
```

##### Historial del navegador

Para evitar que la interacción de apertura y cierre apile varias entradas en el historial del navegador, agrega el siguiente JavaScript en línea al botón de cierre:

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu" onchange="history.go(-1)"></a>
```

Esto eliminará la entrada del historial de URL al cerrar, por lo que es como si el menú nunca se hubiera abierto.

##### Enfoque UX

El siguiente fragmento nos ayuda a centrarnos en los botones de apertura y cierre después de que se abren o se cierran. Quiero facilitar ese cambio.

```js
sidenav.addEventListener('transitionend', e => {
  const isOpen = document.location.hash === '#sidenav-open';

  isOpen
      ? document.querySelector('#sidenav-close').focus()
      : document.querySelector('#sidenav-button').focus();
})
```

Cuando se abra la navegación lateral, se enfoca el botón para cerrar. Cuando se cierra la navegación lateral, se enfoca el botón para abrir. Hago esto llamando a `focus()` en el elemento en JavaScript.

### Conclusión

Ahora que sabes cómo lo hice, ¡¿cómo lo harías tú?! ¡Esto es el primer paso de una arquitectura de componentes divertida! ¿Quién va a hacer la primera versión con slots? 🙂

Diversifiquemos nuestros enfoques y aprendamos todas las formas de construir en la web. Crea un [Glitch](https://glitch.com), [twitteame](https://twitter.com/argyleink) tu versión y la agregaré a la sección de [remixes de la comunidad](#community-remixes) que se encuentra a continuación.

## Remixes de la comunidad

- [@_developit](https://twitter.com/_developit) con elementos personalizados: [demostración y código](https://glitch.com/edit/#!/app-drawer)
- [@ mayeedwin1](https://twitter.com/mayeedwin1) con HTML / CSS / JS: [demostración y código](https://glitch.com/edit/#!/maye-gui-challenge)
- [@a_nurella](https://twitter.com/a_nurella) con Glitch Remix: [demostración y código](https://glitch.com/edit/#!/sidenav-with-adam)
- [@EvroMalarkey](https://twitter.com/EvroMalarkey) con HTML / CSS / JS: [demostración y código](https://evromalarkey.github.io/scrollsnap-drawer/index.html)
