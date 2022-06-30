---
layout: post
title: No está configurada para una pantalla de presentación personalizada
description: |2

  Aprenda a crear una pantalla de presentación personalizada para su aplicación web progresiva.
web_lighthouse:
  - splash-screen
date: 2019-05-04
updated: 2019-09-19
---

Una pantalla de presentación personalizada hace que su [aplicación web progresiva (PWA)](/discover-installable) se sienta más como una aplicación creada para ese dispositivo. De forma predeterminada, cuando un usuario inicia su PWA desde la pantalla de inicio, Android muestra una pantalla en blanco hasta que la PWA está lista. El usuario puede ver esta pantalla en blanco durante máximo 200 ms. Al configurar una pantalla de presentación personalizada, puede mostrarles a sus usuarios un color de fondo personalizado y el ícono de su PWA, para ofrecer una experiencia atractiva y de marca.

## Cómo falla la auditoría Lighthouse de la pantalla de presentación

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no tienen una pantalla de presentación personalizada:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKrrTDSCZ0XLZ7ABKlZt.png", alt="Auditoría Lighthouse que muestra que el sitio no está configurado para una pantalla de presentación personalizada", width="800", height="98" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo crear una pantalla de bienvenida personalizada

Chrome para Android muestra automáticamente su pantalla de presentación personalizada siempre que cumpla con los siguientes requisitos en el [manifiesto de su aplicación web](/add-manifest):

- La propiedad `name` se configura como el nombre de su PWA.
- La propiedad `background_color` se establece en un valor de color CSS válido.
- La matriz `icons` especifica un icono de al menos 512 x 512 px.
- El icono especificado existe y es un archivo PNG.

Consulte el documento [Agregar una pantalla de presentación para las aplicaciones web instaladas en Chrome 47](https://developers.google.com/web/updates/2015/10/splashscreen) para obtener más información.

{% Aside %} Si bien la auditoría de Lighthouse se aprobará cuando haya un solo ícono de 512x512 px, existe cierto desacuerdo sobre qué íconos debería incluir una PWA. Consulte la [Auditoría: cobertura del tamaño de los iconos](https://github.com/GoogleChrome/lighthouse/issues/291) para obtener una discusión sobre los pros y los contras de los diferentes enfoques. {% endAside %}

## Recursos

[El código fuente de la auditoría **No está configurada para una pantalla de presentación personalizada**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/splash-screen.js)
