---
title: Cuándo usar HTTPS para el desarrollo local
subhead: "Usar http://localhost para el desarrollo local funciona bien casi todo el tiempo, excepto en algunos casos especiales. Esta publicación explica cuándo necesita ejecutar su sitio de desarrollo local con HTTPS."
authors:
  - maudn
date: 2021-01-25
hero: image/admin/rIRKS6XfdH4ZU6N1y4zE.jpg
tags:
  - blog
  - security
---

Consulte también: [Cómo utilizar HTTPS para el desarrollo local](/how-to-use-local-https).

*En esta publicación, los enunciados sobre `localhost` son válidas para `127.0.0.1` y `[::1]`, ya que ambas describen la dirección de la computadora local, también llamada "dirección de bucle invertido". Además, para simplificar las cosas, no se especifica el número de puerto.** Entonces, cuando vea `http://localhost`, `http://localhost:{PORT}` o `http://127.0.0.1:{PORT}`.*

## Resumen

Cuando lleve a cabo desarrollo local, use `http://localhost` por defecto. Así, los Service Workers, la API de autenticación web y otros funcionarán. Sin embargo, en los siguientes casos, necesitará HTTPS para el desarrollo local:

- Para configurar cookies seguras de forma coherente en todos los navegadores

- Para depurar problemas de contenido mixto

- Para usar HTTP/2 y posterior

- Para usar bibliotecas o API de terceros que requieren HTTPS

- Para usar un nombre de host personalizado

    <figure>{% Img src="image/admin/ifswaep3VUkY7cjArbIc.png", alt="Una lista de casos en los que necesita usar HTTPS para el desarrollo local.", width="800", height="450" %}<figcaption> Cuándo usar HTTPS para el desarrollo local.</figcaption></figure>

{% Aside %} Si necesita HTTPS para uno de los casos de uso anteriores, consulte [Cómo usar HTTPS para el desarrollo local](/how-to-use-local-https). {% endAside %}

✨ Esto es todo lo que necesitas saber. Si estás interesado en obtener más detalles, ¡sigue leyendo!

## Por qué su sitio de desarrollo debe comportarse de forma segura

Para evitar problemas inesperados, es conveniente que su sitio de desarrollo local se comporte en la medida de lo posible como su sitio web de producción. Así, si su sitio web de producción utiliza HTTPS, debe optar porque su sitio de desarrollo local se comporte **como un sitio HTTPS**.

{% Aside 'warning' %} Si su sitio web de producción no utiliza HTTPS, considérelo [una prioridad](/why-https-matters/). {% endAside %}

## Utilice `http://localhost` de forma predeterminada

Los navegadores tratan `http://localhost` de una manera especial: **aunque usa HTTP, en su mayor parte se comporta como un sitio HTTPS**.

En `http://localhost`, los Service Workers, el Sensor API, el Authentication API, los Pagos y [otras características que requieren ciertas garantías de seguridad](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts) son compatibles y se comportan exactamente como en un sitio HTTPS.

## Cuándo usar HTTPS para el desarrollo local

Puede encontrar casos especiales en los que `http://localhost` *no se* comporte como un sitio HTTPS, o puede que simplemente desee utilizar un nombre de sitio personalizado que no sea `http://localhost`.

Debe utilizar HTTPS para el desarrollo local en los siguientes casos:

- Debe configurar [una cookie](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) localmente que sea `Segura`, o `SameSite:none`, o que tenga el prefijo `__Host`. Las cookies `seguras` se establecen solo en HTTPS, pero no en `http://localhost` para todos los navegadores. Y debido a que `SameSite:none` y `__Host` también requieren que la cookie sea `segura`, la configuración de dichas cookies en su sitio de desarrollo local también requiere HTTPS.

    {% Aside 'gotchas' %} Cuando se trata de configurar cookies `seguras` localmente, no todos los navegadores se comportan de la misma manera. Por ejemplo, Chrome y Safari no configuran cookies `seguras` en localhost, pero Firefox sí. En Chrome, esto se considera un [error](https://bugs.chromium.org/p/chromium/issues/detail?id=1056543&q=localhost%20secure%20cookie&can=2). {% endAside %}

- Debe depurar localmente un problema que ocurre solamente en un sitio web HTTPS pero no en un sitio HTTP, ni siquiera en `http://localhost`, como un problema de [contenido mixto.](https://developer.mozilla.org/docs/Web/Security/Mixed_content)

- Debe probar o reproducir localmente un comportamiento específico de HTTP/2 o posterior. Por ejemplo, si necesita probar el rendimiento de carga en HTTP/2 o posterior. No se admite HTTP/2 inseguro o posterior, ni siquiera en `localhost`.

- Debe probar localmente bibliotecas o API de terceros que requieren HTTPS (por ejemplo, OAuth).

- No está utilizando `localhost`, sino un nombre de host personalizado para el desarrollo local, por ejemplo, `mysite.example`. Normalmente, esto significa que ha anulado su archivo de hosts local:

    <figure>{% Img src="image/admin/i7dPGFARXLbg9oIAUol2.jpg", alt="Captura de pantalla de una terminal editando un archivo de hosts", width="740", height="318" %}<figcaption> Editar un archivo de hosts para agregar un nombre de host personalizado.</figcaption></figure>

    En este caso, Chrome, Edge, Safari y Firefox *no* consideran que `mysite.example` sea seguro de forma predeterminada, aunque sea un sitio local. Por lo tanto, no se comportará como un sitio HTTPS.

- ¡Otros casos! Esta no es una lista exhaustiva, pero si encuentra un caso que no está en esta lista, se dará cuenta: las cosas no funcionarán en `http://localhost` o este no se comportará como su sitio de producción. 🙃

**En todos estos casos, debe utilizar HTTPS para el desarrollo local.**

## Cómo utilizar HTTPS para el desarrollo local

Si necesita usar HTTPS para el desarrollo local, diríjase a [Cómo usar HTTPS para el desarrollo local](/how-to-use-local-https).

## Consejos si está utilizando un nombre de host personalizado

**Si está utilizando un nombre de host personalizado, por ejemplo, editando su archivo de hosts:**

- No use un nombre de host como `mysite` porque si hay un [dominio de nivel superior (TLD)](https://en.wikipedia.org/wiki/Top-level_domain) que tiene el mismo nombre (`mysite`), encontrará problemas. Y no es tan improbable: en 2020, hay más de 1.500 TLD y la lista está creciendo. `Cafés`, `museos`, `agencias de viaje` y muchos nombres de grandes empresas (¡tal vez hasta la empresa en la que trabaja!) son TLD. [Vea la lista completa aquí](https://data.iana.org/TLD/tlds-alpha-by-domain.txt).
- Utilice únicamente dominios que sean suyos o que estén reservados para este fin. Si no tiene un dominio propio, puede usar `test` o `localhost` (`mysite.localhost`). `test` no tiene un tratamiento especial en los navegadores, pero `localhost` sí: Chrome y Edge admiten `http://<name>.localhost` de fábrica, y se comportará de forma segura cuando localhost lo haga. Pruébelo: ejecute cualquier sitio en localhost y acceda a `http://<cualquier nombre que desees>.localhost:<your port>` en Chrome o Edge. Esto también puede ser posible en breve en Firefox y [Safari](https://bugs.webkit.org/show_bug.cgi?id=160504). La razón por la que puede hacer esto (tener subdominios como `mysite.localhost` ) es porque `localhost` no es solo un nombre de host: también es un TLD completo, como `com`.

## Más información

- [Contextos seguros](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts)
- [localhost como contexto seguro](https://www.w3.org/TR/secure-contexts/#localhost)
- [localhost como contexto seguro en Chrome](https://www.chromestatus.com/feature/6269417340010496)

*Muchas gracias por las contribuciones y comentarios a todos los revisores, especialmente a Ryan Sleevi, Filippo Valsorda, Milica Mihajlija, Rowan Merewood y Jake Archibald. 🙌*

*Imagen principal de [@moses_lee](https://unsplash.com/@moses_lee) en [Unsplash](https://unsplash.com/photos/Q2Xy_hYzrgg), editada.*
