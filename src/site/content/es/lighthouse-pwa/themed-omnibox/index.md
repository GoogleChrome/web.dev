---
layout: post
title: No establece un color de tema para la barra de direcciones
description: |2

  Aprenda a configurar un color para el tema de la barra de direcciones para su aplicación web progresiva.
web_lighthouse:
  - omnibox temático
date: 2019-05-04
updated: 2020-06-17
---

Usar un tema para la barra de direcciones del navegador para que coincida con los colores de la marca de su [aplicación web progresiva (PWA)](/discover-installable) proporciona una experiencia de usuario más inmersiva.

## Compatibilidad del navegador

En el momento de redactar este artículo, el uso de temas para la barra de direcciones del navegador es compatible con los navegadores basados en Android. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility) para obtener actualizaciones.

## Cómo falla la auditoría de color del tema Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no aplican un tema a la barra de direcciones:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="La auditoría de Lighthouse que muestra que la barra de direcciones no está relacionada con los colores de la página", width="800", height="98" %}</figure>

La auditoría falla si Lighthouse no encuentra una meta tag `theme-color` en el HTML de la página y una propiedad `theme_color` en el [manifiesto de la aplicación web](/add-manifest).

Tenga en cuenta que Lighthouse no verifica si los valores son valores de color CSS válidos.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo establecer un color de tema para la barra de direcciones

### Paso 1: agregue una meta tag `theme-color` a cada página que desee marcar

La meta tag `theme-color` garantiza que la barra de direcciones presente una marca cuando un usuario visita su sitio como una página web normal. Establezca el `content` (contenido) de la etiqueta en cualquier valor de color CSS válido:

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

Obtenga más información sobre la meta tag `theme-color` en <a href="https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android" data-md-type="link">Support for `theme-color` in Chrome 39 for Android</a>.

### Paso 2: Agregue la propiedad `theme_color` al manifiesto de su aplicación web

La propiedad `theme_color` en el manifiesto de su aplicación web garantiza que la barra de direcciones presente la marca cuando un usuario inicia su PWA desde la pantalla de inicio. A diferencia de la meta-tag `theme-color`, solo necesita definir esto una vez, en el [manifiesto](/add-manifest). Establezca la propiedad en cualquier valor de color CSS válido:

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

El navegador establecerá el color de la barra de direcciones de cada página de su aplicación de acuerdo con el `theme_color` del manifiesto.

## Recursos

- [Código fuente para la auditoría **No establece un color de tema para la barra de direcciones**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js)
- [Agregar un manifiesto de aplicación web](/add-manifest)
- [Support for <code>theme-color</code> in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)
