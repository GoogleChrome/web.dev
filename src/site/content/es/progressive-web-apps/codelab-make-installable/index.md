---
layout: codelab
title: Hágalo instalable
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: |-
  En este laboratorio de código, aprenda cómo hacer que un sitio sea instalable usando el
  evento beforeinstallprompt.
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

Este glitch ya contiene los componentes críticos necesarios para hacer que una aplicación web progresiva se pueda instalar, incluido un [service worker muy simple](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js) y un [manifiesto de la aplicación web](https://glitch.com/edit/#!/make-it-installable?path=manifest.json). También tiene un botón de instalación que está oculto por defecto.

## Escuche el evento beforeinstallprompt

Cuando el navegador efectúa el evento `beforeinstallprompt`, esa es la indicación de que se puede instalar la aplicación web progresiva, y se puede mostrar un botón de instalación al usuario. El evento `beforeinstallprompt` se activa cuando la PWA cumple con [los criterios de instalación](/install-criteria/).

{% Instruction 'remix', 'ol' %}

1. Agregue un manejador de eventos `beforeinstallprompt` al objeto `window`.
2. Guarde `event` como una variable global; lo necesitaremos más tarde para mostrar el mensaje.
3. Muestre el botón de instalación.

Código:

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile.
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Remove the 'hidden' class from the install button container.
  divInstall.classList.toggle('hidden', false);
});
```

## Manejar el botón de instalación

Para mostrar el mensaje de instalación, llame a `prompt()` guardado en el evento `beforeinstallprompt`. La llamada a `prompt()` se realiza en el controlador de clic del botón de instalación, porque `prompt()` debe llamarse desde un gesto de usuario.

1. Agregue un manejador de evento clic para el botón de instalación.
2. Llame a `prompt()` en el evento `beforeinstallprompt`.
3. Registre los resultados del prompt.
4. Establezca el `beforeinstallprompt` en "null".
5. Oculte el botón de instalación.

Código:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
  divInstall.classList.toggle('hidden', true);
});
```

## Seguimiento del evento de instalación

La instalación de una aplicación web progresiva a través de un botón de instalación es solo una de las formas en que los usuarios pueden instalar una PWA. También pueden usar el menú de Chrome, la mini-barra de información, y a través[de un ícono en la omnibox (barra de direcciones)](/promote-install/#browser-promotion). Puede realizar un seguimiento de todas estas formas de instalación escuchando el evento `appinstalled`.

1. Agregue un manejador de evento `appinstalled` al objeto `window`.
2. Registre el evento de instalación en análisis u otro mecanismo.

Código:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null;
});
```

## Otras lecturas

¡Felicitaciones, su aplicación ahora se puede instalar!

Aquí hay algunas cosas adicionales que puede hacer:

- [Detecte si su aplicación se inicia desde la pantalla de inicio](/customize-install/#detect-mode)
- [En su lugar, muestre el mensaje de instalación de la aplicación del sistema operativo](https://developer.chrome.com/blog/app-install-banners-native/)
