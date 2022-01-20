---
layout: post
title: Ayude a los usuarios a cambiar las contraseñas fácilmente agregando una URL conocida para cambiar las contraseñas
subhead: Redirigir una solicitud a "/.well-known/change-password" a la URL de cambio de contraseñas
authors:
  - agektmr
date: 2020-09-01
updated: 2020-09-24
hero: image/admin/IOO23TBT2cCBNmsm9HKf.jpg
alt: Luces de neón con forma de varios símbolos que se utilizan comúnmente en las contraseñas.
description: |2

  Al redirigir las solicitudes a /.well-known/change-password a la URL de cambio de contraseña, puede permitir que los usuarios actualicen sus contraseñas más fácilmente que antes.
tags:
  - identity
  - security
feedback:
  - api
---

Establezca una redirección desde `/.well-known/change-password` a la página de cambio de contraseña de su sitio web. Esto permitirá a los administradores de contraseñas conducir a sus usuarios directamente a esa página.

## Introducción

Como sabrá, las [contraseñas no son la mejor manera de administrar cuentas](https://security.googleblog.com/2017/11/new-research-understanding-root-cause.html). Por suerte, existen tecnologías emergentes como [WebAuthn](https://webauthn.io/) y técnicas como las contraseñas de un solo uso que nos están ayudando a acercarnos a un mundo sin contraseñas. Sin embargo, estas tecnologías aún se están desarrollando y las cosas no cambiarán rápidamente. Muchos desarrolladores todavía necesitarán lidiar con contraseñas durante unos cuantos años. Mientras esperamos que las tecnologías y técnicas emergentes se transformen en algo común, al menos podemos hacer que las contraseñas sean más fáciles de usar.

Una buena forma de hacerlo es brindar un mejor soporte a los administradores de contraseñas.

### Cómo los administradores de contraseñas nos ayudan

Los administradores de contraseñas pueden integrarse en los navegadores o proporcionarse como aplicaciones de terceros. Pueden ayudar a los usuarios de varias formas, ya que consiguen:

**Autocompletar la contraseña para el campo de entrada correcto**: algunos navegadores pueden encontrar la entrada correcta de forma heurística incluso si el sitio web no está optimizado para este propósito. Los desarrolladores web pueden ayudar a los administradores de contraseñas [anotando correctamente las etiquetas de entrada HTML](/sign-in-form-best-practices/#new-password).

**Evitar el phishing**: debido a que los administradores de contraseñas recuerdan dónde se registró la contraseña, la contraseña se puede completar automáticamente solo en las URL adecuadas y no en los sitios web de phishing.

**Generar contraseñas sólidas y únicas**: debido a que el administrador de contraseñas genera y almacena directamente contraseñas sólidas y únicas, los usuarios no tienen que recordar ni un solo carácter de la contraseña.

La generación y el autocompletado de contraseñas con un administrador de contraseñas ya se han tornado un gran aliado de la web, pero considerando su ciclo de vida, actualizar las contraseñas siempre que sea necesario es tan importante como generar y autocompletar. Para aprovechar eso de la mejor forma, los administradores de contraseñas están agregando una nueva función:

**Detectar contraseñas vulnerables y sugerir su actualización**: los administradores de contraseñas pueden detectar contraseñas que se reutilizan, analizar la entropía y la debilidad de las mismas e incluso detectar contraseñas potencialmente filtradas o que se sabe que no son seguras de fuentes como [Have I Been Pwned](https://haveibeenpwned.com/).

Un administrador de contraseñas puede advertir a los usuarios sobre contraseñas problemáticas, pero hay mucha fricción al pedir a los usuarios que naveguen desde la página de inicio a una página de cambio de contraseña, además de pasar por el proceso real de cambio de contraseña (que varía de un sitio a otro). Sería mucho más fácil si los administradores de contraseñas pudieran llevar al usuario directamente a la URL de cambio de contraseña. Aquí es donde [una URL reconocida para cambiar contraseñas se](https://w3c.github.io/webappsec-change-password-url/) torna útil.

Al reservar una ruta URL conocida que redirige al usuario a la página de cambio de contraseña, el sitio web puede redirigir fácilmente a los usuarios al lugar correcto para cambiar sus contraseñas.

## Configurar "una URL conocida para cambiar contraseñas"

`.well-known/change-password` se propone como [una URL conocida para cambiar contraseñas](https://wicg.github.io/change-password-url/). Todo lo que tiene que hacer es configurar su servidor para redirigir las solicitudes de `.well-known/change-password` a la URL de cambio de contraseña de su sitio web.

Por ejemplo, supongamos que su sitio web es `https://example.com` y la URL de cambio de contraseña es `https://example.com/settings/password`. Solo necesitará configurar su servidor para redirigir una solicitud de `https://example.com/.well-known/change-password` a `https://example.com/settings/password`. Nada más. Para la redirección, [use el código de estado HTTP](https://wicg.github.io/change-password-url/#semantics) [`302 Found`](https://developer.mozilla.org/docs/Web/HTTP/Status/302), [`303 See Other`](https://developer.mozilla.org/docs/Web/HTTP/Status/303) o [`307 Temporary Redirect`](https://developer.mozilla.org/docs/Web/HTTP/Status/307).

Alternativamente, puede servir HTML en su `.well-known/change-password` con una etiqueta `<meta>` [`http-equiv="refresh"`](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-http-equiv).

```html
<meta http-equiv="refresh" content="0;url=https://example.com/settings/password">
```

### Vuelva a visitar el HTML de la página de cambio de contraseña

El objetivo de esta función es ayudar a que el ciclo de vida de la contraseña del usuario sea más fluido. Puede hacer dos cosas para que el usuario pueda actualizar su contraseña sin problemas:

- Si su formulario de cambio de contraseña necesita la contraseña actual, agregue `autocomplete="current-password"` a la `<input>` para ayudar al administrador de contraseñas a completarla automáticamente.
- Para el campo de la nueva contraseña (en muchos casos son dos campos para asegurar que el usuario haya ingresado la nueva contraseña correctamente), agregue `autocomplete="new-password"` a la `<input>` para ayudar al administrador de contraseñas a sugerir una contraseña generada.

Obtenga más información en [Prácticas recomendadas para el formulario de inicio de sesión](/sign-in-form-best-practices/#new-password).

## Cómo se usa en el mundo real

### Ejemplos

Gracias a la [implementación de](https://developer.apple.com/documentation/safari-release-notes/safari-13-release-notes) Apple Safari, `/.well-known/change-password`, ya está disponible en algunos sitios web importantes hace algún tiempo:

- [Google](https://accounts.google.com/.well-known/change-password)
- [GitHub](https://github.com/.well-known/change-password)
- [Facebook](https://www.facebook.com/.well-known/change-password)
- [Gorjeo](http://twitter.com/.well-known/change-password)
- [WordPress](https://wordpress.com/.well-known/change-password)

¡Pruébelos usted mismo y haga lo mismo con su sitio!

### Compatibilidad del navegador

[Safari admite una URL reconocida para cambiar contraseñas desde 2019](https://webkit.org/blog/9170/safari-technology-preview-84-with-safari-13-features-is-now-available/). El administrador de contraseñas de Chrome comenzó a admitir esta función a partir de la versión 86 (lanzada en octubre de 2020) y pueden seguir otros navegadores basados en Chromium. [Firefox considera que vale la pena implementarlo](https://mozilla.github.io/standards-positions/#change-password-url), pero no ha indicado que planee hacerlo hasta agosto de 2020.

### Comportamiento del administrador de contraseñas de Chrome

Echemos un vistazo a cómo el administrador de contraseñas de Chrome trata las contraseñas vulnerables.

El administrador de contraseñas de Chrome puede buscar contraseñas filtradas. Al navegar a `about://settings/passwords` usuarios pueden ejecutar **Comprobar contraseñas** para las contraseñas almacenadas y ver una lista de contraseñas que se recomienda actualizar.

<figure></figure>

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2qTEnaWJhxDcvX6hfgrY.png", alt="", width="1478", height="845" %}

  <figcaption>Función de <b>comprobación de contraseñas</b> de Chrome</figcaption>



Al hacer clic en el botón <b>Cambiar contraseña</b> junto a una contraseña que se recomienda actualizar, el navegador:

- Abrirá la página de cambio de contraseña del sitio web si `/.well-known/change-password` está configurado correctamente.
- Abrirá la página de inicio del sitio web si `/.well-known/change-password` no está configurado y Google desconoce la alternativa.

{% Details %}

{% DetailsSummary %} ¿Qué pasa si el servidor devuelve `200 OK` incluso si `/.well-known/change-password` no existe? {% endDetailsSummary %}

Los administradores de contraseñas intentan determinar si un sitio web admite una URL reconocida para cambiar contraseñas enviando una solicitud a `/.well-known/change-password` antes de redirigir a un usuario a esta URL. Si la solicitud devuelve `404 Not Found`, es obvio que la URL no está disponible, pero una `200 OK` no significa necesariamente que la URL esté disponible, porque hay algunos casos extremos:

- Un sitio web de representación del lado del servidor muestra "Not found" cuando no hay contenido pero con `200 OK`.
- Un sitio web de procesamiento del lado del servidor responde con `200 OK` cuando no hay contenido después de redirigir a la página "Not found".
- Una aplicación de una sola página responde con el shell con `200 OK` y muestra la página "Not found" en el lado del cliente cuando no hay contenido.

Para estos casos extremos, los usuarios serán reenviados a una página "Not found" y eso resultará en una fuente de confusión.

Es por eso que hay [un mecanismo estándar propuesto](https://wicg.github.io/change-password-url/response-code-reliability.html) para determinar si el servidor está configurado para responder con `404 Not Found` cuando realmente no hay contenido, solicitando una página aleatoria. En realidad, la URL también está reservada: `/.well-known/resource-that-should-not-exist-whose-status-code-should-not-be-200` . Chrome, por ejemplo, utiliza esta ruta de URL para determinar si puede esperar una URL de cambio de contraseña adecuada de `/.well-known/change-password` por adelantado.

Cuando esté implementando `/.well-known/change-password`, asegúrese de que su servidor devuelva `404 Not Found` para cualquier contenido no existente.

{% endDetails %}

## Feedback

Si tiene algún comentario sobre la especificación, envíe un problema al [repositorio de especificaciones](https://github.com/wicg/change-password-url/issues).

## Recursos

- [Una URL reconocida para cambiar contraseñas](https://wicg.github.io/change-password-url/)
- [Detectando la confiabilidad de los códigos de estado HTTP](https://wicg.github.io/change-password-url/response-code-reliability.html)
- [Prácticas recomendadas para el formulario de inicio de sesión](/sign-in-form-best-practices/)

Foto de [Matthew Brodeur](https://unsplash.com/photos/zEFyM4sulJ8) en [Unsplash](https://unsplash.com)
