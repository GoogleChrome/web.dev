---
layout: post
title: Cómo proporcionar tu propia experiencia de instalación en la aplicación
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: Utiliza el evento beforeinstallprompt para proporcionar una personalizada y fluida experiencia de instalación en la aplicación
tags:
  - progressive-web-apps
---

Muchos navegadores te permiten habilitar y promover la instalación de su Aplicación web progresiva (PWA) directamente dentro de la interfaz de usuario de su PWA. La instalación (la cual anteriormente se le conocía como Agregar a la pantalla de inicio) facilita a los usuarios la instalación de tu PWA en su dispositivo móvil o de escritorio. La instalación de una PWA se agrega al lanzador de un usuario, lo que permite que se ejecute como cualquier otra aplicación instalada.

Además de la [experiencia de instalación proporcionada](/promote-install/#browser-promotion) por el navegador, es posible proporcionar su propio flujo de instalación personalizado, directamente dentro de su aplicación.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt="Botón Instalar aplicación provisto en Spotify PWA", width="491", height="550" %}<figcaption> Botón de "Instalar aplicación" proporcionado en el PWA de Spotify</figcaption></figure>

Al considerar si promover la instalación, es mejor pensar en cómo los usuarios suelen usar su PWA. Por ejemplo, si hay un conjunto de usuarios que usan su PWA varias veces en una semana, estos usuarios podrían beneficiarse de la conveniencia adicional de iniciar su aplicación desde la pantalla de inicio de un teléfono inteligente o desde el menú de inicio en un sistema operativo de escritorio. Algunas aplicaciones de productividad y entretenimiento también se benefician del espacio adicional de pantalla creado al eliminar las barras de herramientas del navegador de la ventana en los modos de `standalone` o `minimal-ui`.

## Promoviendo la instalación {: #promote-installation }

Para indicar que tu Aplicación web progresiva (PWA) se puede instalar y para proporcionar un flujo de instalación personalizado en la aplicación tienes que:

1. Escuchar el evento de `beforeinstallprompt`
2. Guardar el `beforeinstallprompt`, de modo que pueda usarse para activar el flujo de instalación más adelante.
3. Avisarle al usuario de que tu PWA se puede instalar y proporcionar un botón u otro elemento para iniciar el flujo de instalación en la aplicación.

{% Aside %} El `beforeinstallprompt` y el `appinstalled` se movieron de la especificación del manifiesto de la aplicación web a su propia [incubadora](https://github.com/WICG/beforeinstallprompt). El equipo de Chrome mantiene su compromiso de brindarles asistencia y no tiene planes de eliminar o desaprobar la compatibilidad. El equipo de Web DevRel de Google continúa recomendando su uso para proporcionar una experiencia de instalación personalizada. {% endAside %}

### Escuchar al evento de `beforeinstallprompt` {: #beforeinstallprompt }

Si tu aplicación web progresiva cumple con los [criterios de instalación](/install-criteria/) requeridos, el navegador disparará un evento de `beforeinstallprompt`. Guarda una referencia al evento y actualiza tu interfaz de usuario para indicar que el usuario puede instalar su PWA. Esto se explica a continuación.

```js
// Inicializa deferredPrompt para su uso más tarde.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Previene a la mini barra de información que aparezca en smartphones
  e.preventDefault();
  // Guarda el evento para que se dispare más tarde
  deferredPrompt = e;
  // Actualizar la IU para notificarle al usuario que se puede instalar tu PWA
  showInstallPromotion();
  // De manera opcional, envía el evento de analíticos para saber si se mostró la promoción a a instalación del PWA
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %} Hay muchos [patrones](/promote-install/) diferentes que puedes utilizar para notificar al usuario que se puede instalar tu aplicación y proporcionar un flujo de instalación en la aplicación, por ejemplo, un botón en la cabecera, un elemento en el menú de navegación o un elemento en su fuente de contenido. {% endAside %}

### Flujo de instalación en la aplicación {: #in-app-flow }

Para proporcionar la instalación en la aplicación, debes de crear un botón u otro elemento de interfaz en el que un usuario pueda hacer clic para instalar su aplicación. Cuando se hace clic en el elemento, se llama a `prompt()` en el evento de `beforeinstallprompt` (el cual fue almacenado en la variable de `deferredPrompt`). Muéstrale al usuario un cuadro modal de diálogo para la instalación, pidiéndole que confirme que si desea instalar su PWA.

```js
buttonInstall.addEventListener('click', async () => {
  // Esconde la información promotora de la instalación
  hideInstallPromotion();
  // Muestre el mensaje de instalación
  deferredPrompt.prompt();
  // Espera a que el usuario responda al mensaje
  const { outcome } = await deferredPrompt.userChoice;
  // De manera opcional, envía analíticos del resultado que eligió el usuario
  console.log(`User response to the install prompt: ${outcome}`);
  // Como ya usamos el mensaje, no lo podemos usar de nuevo, este es descartado
  deferredPrompt = null;
});
```

La `userChoice` es una promesa que se resuelve con la elección del usuario. Solo puede llamar a `prompt()` en el evento diferido una vez. Si el usuario lo descarta, deberás esperar hasta que el evento de `beforeinstallprompt` sea lanzado de nuevo, generalmente inmediatamente después de que se haya resuelto la propiedad de `userChoice`.

{% Aside 'codelab' %} [Haz que un sitio se pueda instalar mediante el evento beforeinstallprompt](/codelab-make-installable). {% endAside %}

## Detecta cuándo se instaló correctamente la PWA {: #detect-install }

Puedes usar la `userChoice` para determinar si el usuario instaló su aplicación desde tu interfaz de usuario. Pero, si el usuario instaló tu PWA desde la barra de direcciones u otro componente del navegador, `userChoice` no será de ayuda. En su lugar, debes escuchar el evento de `appinstalled`. Este se activa cada vez que se instala tu PWA, sin importar qué mecanismo se haya utilizado para instalar tu PWA.

```js
window.addEventListener('appinstalled', () => {
  // Esconder la promoción de instalación de la PWA
  hideInstallPromotion();
  // Limpiar el defferedPrompt para que pueda ser eliminado por el recolector de basura
  deferredPrompt = null;
  // De manera opcional, enviar el evento de analíticos para indicar una instalación exitosa
  console.log('PWA was installed');
});
```

## Detecta cómo se lanzó la PWA {: #detect-launch-type }

El `display-mode` de CSS indica cómo se inició la PWA, ya sea mediante una pestaña del navegador o como una PWA instalada. Esto permite aplicar diferentes estilos dependiendo de cómo se inició la aplicación. Por ejemplo, siempre oculta el botón de instalación y proporciona un botón de retroceso cuando se inicie como una PWA instalada.

### Seguimiento de cómo se lanzó la PWA

Para rastrear cómo los usuarios lanzan tu PWA utiliza `matchMedia()` para probar la consulta de medios en `display-mode`. Safari en iOS no admite esto todavía, por lo que debes de verificar con `navigator.standalone`, el cual devuelve un booleano que indica si el navegador se está ejecutando en modo independiente.

```js
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
```

### Seguimiento cuando cambia el modo de visualización

Para rastrear si el usuario cambia entre `standalone` y `browser tab`, escucha los cambios en la consulta de medios en `display-mode`.

```js
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});
```

### Actualizar la interfaz de usuario según el modo de visualización actual

Para aplicar un color de fondo diferente para una PWA cuando se inicia como una PWA instalada, use CSS condicional:

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## Actualizar el icono y el nombre de su aplicación

¿Qué tal si necesitas actualizar el nombre de tu aplicación o actualizar a nuevos íconos? Consulta [Cómo maneja Chrome las actualizaciones del manifiesto de la aplicación web](/manifest-updates/) para ver cuándo y cómo se reflejan esos cambios en Chrome.
