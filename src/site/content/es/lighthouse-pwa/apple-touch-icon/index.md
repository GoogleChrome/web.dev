---
layout: post
title: No proporciona un ícono apple-touch-icon válido
description: Aprenda a especificar qué icono muestra su aplicación web progresiva en las pantallas de inicio de iOS.
web_lighthouse:
  - apple-touch-icon
codelabs: laboratorio-de-código-apple-touch-icon
date: 2019-08-27
updated: 2019-09-19
---

Cuando los usuarios de iOS Safari agregan [aplicaciones web progresivas (PWA)](/discover-installable) a sus pantallas de inicio, el ícono que aparece se llama *ícono táctil de Apple*. Puede especificar qué ícono debe usar su aplicación al incluir una etiqueta `<link rel="apple-touch-icon" href="/example.png">` en la `<head>` de su página. Si su página no tiene esta etiqueta de enlace, iOS genera un icono tomando una captura de pantalla del contenido de la página. En otras palabras, indicarle a iOS que descargue un icono da como resultado una experiencia de usuario más refinada.

## Cómo la auditoría Lighthouse del icono táctil de Apple señala un error

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) señala la falta de un `<link rel="apple-touch-icon" href="/example.png">` en el `<head>` de las páginas:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mXGs4XSr4DXMxLk536wo.png", alt="No proporciona un icono táctil de Apple válido", width="800", height="95" %}</figure>

{% Aside %} Un enlace `rel="apple-touch-icon-precomposed"` pasa la auditoría, pero ha sido obsoleto desde iOS 7. Use `rel="apple-touch-icon"`en su lugar. {% endAside %}

Lighthouse no comprueba si el icono realmente existe o si el icono tiene el tamaño correcto.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo agregar un ícono táctil de Apple

1. Agregue `<link rel="apple-touch-icon" href="/example.png">` al `<head>` de su página:

    ```html/4
    <!DOCTYPE html>
    <html lang="en">
      <head>
        …
        <link rel="apple-touch-icon" href="/example.png">
        …
      </head>
      …
    ```

2. Reemplace `/example.png` con la ruta real a su ícono.

{% Aside 'codelab' %} Revise el laboratorio de código [Agregar un ícono táctil de Apple a su aplicación web progresiva](/codelab-apple-touch-icon) para ver cómo agregar un ícono táctil de Apple crea una experiencia de usuario más refinada. {% endAside %}

Para dar una buena experiencia de usuario, asegúrese de que:

- El icono tiene 180x180 píxeles o 192x192 píxeles.
- La ruta especificada al icono es válida
- El fondo del icono no es transparente.

## Recursos

- [Código fuente para la Auditoría **No proporciona un ícono `apple-touch-icon` válido**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/apple-touch-icon.js)
- [Descubra lo que se necesita para ser instalable](/install-criteria)
- <a href="https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/" rel="noreferrer">Usar el icono táctil de Apple</a>
