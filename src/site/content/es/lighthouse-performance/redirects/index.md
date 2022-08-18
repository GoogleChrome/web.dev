---
layout: post
title: Evitar los redireccionamientos múltiples de páginas
description: |2

  Descubra por qué los redireccionamientos de página ralentizan la velocidad de carga de su página web y

  cómo evitarlos.
web_lighthouse:
  - redirects
date: 2019-05-04
updated: 2019-09-19
---

Los redireccionamientos ralentizan la velocidad de carga de la página. Cuando un navegador solicita un recurso que ha sido redirigido, el servidor generalmente devuelve una respuesta HTTP como esta:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

Después, el navegador debe realizar otra solicitud HTTP en la nueva ubicación para recuperar el recurso. Este viaje adicional a través de la red puede retrasar en cientos de milisegundos la carga del recurso.

## Cómo fallar la auditoría de redireccionamientos múltiples de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que tienen múltiples redireccionamientos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt="", width="800", height="276" %}</figure>

Una página falla en esta auditoría cuando tiene dos o más redireccionamientos.

## Cómo eliminar redireccionamientos

Señale los enlaces a los recursos marcados con las ubicaciones actuales de los recursos. Es especialmente importante evitar las redirecciones en los recursos necesarios para su [ruta de procesamieno crítica](/critical-rendering-path/).

Si está utilizando redireccionamientos para desviar a los usuarios de dispositivos móviles, a la versión móvil de su página, considere rediseñar su sitio para usar un [diseño adaptable](/responsive-web-design-basics/).

## Orientación específica de la pila

### React

Si está utilizando React Router, minimice el uso del componente `<Redirect>` para las [rutas de navegación](https://reacttraining.com/react-router/web/api/Redirect).

## Recursos

- [Código fuente para la auditoría **Evitar redireccionamientos de varias páginas**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/redirects.js)
- [Redirecciones en HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections)
- [Evitar los redireccionamientos de la página de destino](https://developers.google.com/speed/docs/insights/AvoidRedirects)
