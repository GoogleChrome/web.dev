---
layout: post
title: Evite los redireccionamientos de varias páginas
description: Descubra por qué los redireccionamientos de página ralentizan la velocidad de carga de su página web y cómo evitarlos.
web_lighthouse:
  - redireccionamientos
date: '2019-05-04'
updated: '2019-09-19'
---

Los redireccionamientos ralentizan la velocidad de carga de la página. Cuando un navegador solicita un recurso que ha sido redirigido, el servidor generalmente devuelve una respuesta HTTP como esta:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

Luego, el navegador debe realizar otra solicitud HTTP en la nueva ubicación para recuperar el recurso. Este viaje adicional a través de la red puede retrasar la carga del recurso en cientos de milisegundos.

## Cómo falla la auditoría de redireccionamientos múltiples de Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca las páginas que tienen múltiples redireccionamientos:

<figure class="w-figure"><img class="w-screenshot" src="redirects.png" alt=""></figure>

Una página falla en esta auditoría cuando tiene dos o más redireccionamientos.

## Cómo eliminar redireccionamientos

Señale los enlaces a los recursos marcados con las ubicaciones actuales de los recursos. Es especialmente importante evitar redireccionamientos en los recursos necesarios para su [ruta de procesamiento crítica](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) .

Si está utilizando redireccionamientos para desviar a los usuarios de dispositivos móviles a la versión móvil de su página, considere rediseñar su sitio para usar [Responsive Design](https://developers.google.com/web/fundamentals/design-and-ux/responsive/) .

## Recursos

- [Código fuente para la auditoría **Evitar redireccionamientos de varias páginas**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/redirects.js)
- [Redirecciones en HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
- [Evite los redireccionamientos de la página de destino](https://developers.google.com/speed/docs/insights/AvoidRedirects)
