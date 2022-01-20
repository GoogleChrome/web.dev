---
layout: post
title: Agrega un manifiesto de aplicación web con Create React App
subhead: Un manifiesto de aplicación web se incluye de forma predeterminada en Create React App y permite que cualquiera pueda instalar su aplicación React en su dispositivo.
hero: image/admin/pOjpReVK54kUJP6nZMwn.jpg
date: 2019-04-29
updated: 2021-05-19
description: |2-

  Create React App incluye un manifiesto de aplicación web de forma predeterminada. La modificación de este archivo te permitirá cambiar la forma en que se muestra tu aplicación cuando se instala en el dispositivo del usuario.
authors:
  - houssein
---

{% Aside %} Si no sabes cómo funcionan los archivos de manifiesto de aplicación web, consulta primero la guía [Agregar un manifiesto de aplicación web.](/add-manifest) {% endAside %}

Create React App (CRA) incluye un manifiesto de aplicación web de forma predeterminada. La modificación de este archivo te permitirá cambiar la forma que se muestra tu aplicación cuando se instala en el dispositivo del usuario.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yra3Y2jPf2tS5ELxJdAK.png", alt="A progressive web app icon on a mobile phone's home screen", width="317", height="640" %}</figure>

## ¿Por qué resulta útil?

Los archivos de manifiesto de aplicación web ofrecen la posibilidad de cambiar el aspecto de una aplicación instalada en el escritorio o en el dispositivo móvil del usuario. Al modificar las propiedades en el archivo JSON, puedes modificar una serie de detalles de tu aplicación, incluyendo su:

- Nombre
- Descripción
- Icono de la aplicación
- Color del tema

La [documentación MDN](https://developer.mozilla.org/docs/Web/Manifest) cubre todas las propiedades que se pueden cambiar en detalle.

## Modificar el manifiesto predeterminado

En CRA, un archivo de manifiesto predeterminado, `/public/manifest.json` se incluye automáticamente cuando se crea una nueva aplicación:

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

Esto permite a cualquiera instalar la aplicación en su dispositivo y ver algunos detalles por defecto de la aplicación. El archivo HTML `public/index.html`, también incluye un `<link>` para cargar el manifiesto.

```html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

A continuación, se muestra un ejemplo de una aplicación creada con CRA que tiene un archivo de manifiesto modificado:

{% Glitch {id: 'cra-web-app-manifest-defaut', ruta: 'public / manifest.json', previewSize: 0, height: 480}%}

Para saber si todas las propiedades funcionan correctamente en este ejemplo:

{% Instruction 'preview' %} {% Instruction 'devtools-application' %}

- En el panel de **Aplicación**, haga clic en la pestaña **Manifiesto.**

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IpK9fr3O0zEX1GJXq9mw.png", alt="DevTool's Manifest tab shows the properties from the app manifest file.", width="800", height="695" %}

## Conclusión

1. Si estás creando un sitio que crees que no necesita ser instalado en un dispositivo, elimina el manifiesto y el elemento `<link>` en el archivo HTML que apunta a él.
2. Si deseas que los usuarios instalen la aplicación en su dispositivo, modifica el archivo de manifiesto (o crea uno si no estás usando CRA) con las propiedades que desees. La [documentación MDN](https://developer.mozilla.org/docs/Web/Manifest) explica todos los atributos obligatorios y opcionales.
