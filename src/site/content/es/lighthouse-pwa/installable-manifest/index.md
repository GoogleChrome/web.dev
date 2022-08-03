---
layout: post
title: El manifiesto de la aplicación web no cumple con los requisitos de instalación
description: |2

  Aprenda a hacer que su aplicación web progresiva sea instalable.
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

La instalación es un requisito fundamental de las [aplicaciones web progresivas (PWA)](/discover-installable). Al pedirles a los usuarios que instalen su PWA, les permite agregarla a sus pantallas de inicio. Los usuarios que agregan aplicaciones a las pantallas de inicio interactúan con esas aplicaciones con más frecuencia.

Un [manifiesto de aplicación web](/add-manifest/) incluye información clave necesaria para que su aplicación se pueda instalar.

## Cómo falla la auditoría Lighthouse del manifiesto de la aplicación web

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no tengan un [manifiesto de aplicación web](/add-manifest/) que cumpla con los requisitos mínimos de instalación:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="Auditoría de Lighthouse que muestra que el usuario no puede instalar la aplicación web desde su pantalla de inicio", width="800", height="98" %}</figure>

Si el manifiesto de una página no incluye las siguientes propiedades, la auditoría fallará:

- Una propiedad [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) o [`name`](https://developer.mozilla.org/docs/Web/Manifest/name)
- Una propiedad [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons) que incluya un icono de 192x192 px y uno de 512x512 px
- Una propiedad [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url)
- Una propiedad [`display`](https://developer.mozilla.org/docs/Web/Manifest/display) establecida en `fullscreen`, `standalone` o `minimal-ui`
- Una propiedad [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) establecida en un valor distinto de `true`.

{% Aside 'caution' %} Un manifiesto de aplicación web es *necesario* para que su aplicación sea instalable, pero no es *suficiente*. Para saber cómo cumplir con todos los requisitos de instalación, consulte la publicación [Descubra lo que se necesita para sea instalable](/discover-installable). {% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo hacer que su PWA sea instalable

Verifique que su aplicación tenga un manifiesto que cumpla con los criterios anteriores. Consulte la colección [instalable](/installable/) para obtener más información sobre cómo crear una PWA.

## Cómo comprobar que su PWA es instalable

### En Chrome

Cuando su aplicación cumpla con los requisitos mínimos de instalación, Chrome activará un evento `beforeinstallprompt` que usted puede usar para solicitarle al usuario que instale su PWA.

{% Aside 'codelab' %} Obtenga información sobre cómo hacer que su aplicación se pueda instalar en Chrome con el laboratorio de códigos [Hacer que sea instalable](/codelab-make-installable). {% endAside %}

### En otros navegadores

Otros navegadores tienen diferentes criterios de instalación y para activar el evento `beforeinstallprompt`. Consulte sus respectivos sitios para conocer todos los detalles:

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Ópera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## Recursos

- [El código fuente de la auditoria **El manifiesto de la aplicación web no cumple con los requisitos de instalación**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/installable-manifest.js).
- [Agregar un manifiesto de aplicación web](/add-manifest/)
- [Descubra lo que se necesita para que sea instalable](/discover-installable)
- [Manifiesto de la aplicación web](https://developer.mozilla.org/docs/Web/Manifest)
- [No usa HTTPS](/is-on-https/)
