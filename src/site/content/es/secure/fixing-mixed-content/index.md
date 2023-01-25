---
layout: post
title: Solucionar el contenido mixto
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-23
description: |2

  Descubra cómo corregir errores de contenido mixto en su sitio web,
  para proteger a los usuarios y garantizar que se cargue todo su contenido.
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

Admitir HTTPS en su sitio web es un paso importante para la protección de su sitio y de sus usuarios contra ataques, pero el contenido mixto puede hacer que esa protección sea inútil. Los navegadores bloquearán el contenido mixto cada vez más inseguro, como se explica en [¿Qué es el contenido mixto?](/what-is-mixed-content)

En esta guía, demostraremos las técnicas y herramientas para solucionar problemas existentes de contenido mixto y evitar que sucedan otros nuevos.

## Encontrar contenido mixto mientras visita su sitio

Cuando visita una página HTTPS en Google Chrome, el navegador le advierte sobre el contenido mixto en la forma de errores y advertencias en la consola de JavaScript.

En [¿Qué es el contenido mixto?](/what-is-mixed-content), puede encontrar varios ejemplos y ver cómo se informan los problemas en Chrome DevTools.

El ejemplo de [contenido mixto pasivo](https://passive-mixed-content.glitch.me/) generará las siguientes advertencias. Si el navegador puede encontrar el contenido en una URL `https`, lo actualiza automáticamente y luego muestra un mensaje.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y7b4EWAbSL6BgI07FdQq.jpg", alt="Chrome DevTools muestra las advertencias que aparecen cuando se detecta y actualiza contenido mixto", width="800", height="294" %}</figure>

El [contenido mixto activo](https://active-mixed-content.glitch.me/) está bloqueado y se muestra una advertencia.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KafrfEz1adCP2eUHQEWy.jpg", alt="Chrome DevTools muestra las advertencias que aparecen cuando el contenido mixto activo está bloqueado", width="800", height="304" %}</figure>

Si encuentra advertencias como estas para las URL `http://` en su sitio, debe corregirlas en la fuente del mismo. Es útil hacer una lista de estas URL, junto con la página donde las encontró, para usarla cuando las corrija.

{% Aside %} Los errores y advertencias de contenido mixto solo se muestran para la página que está viendo actualmente. Además, la consola de JavaScript se borra cada vez que navega a una página nueva. Esto significa que tendrá que revisar individualmente cada página de su sitio para encontrar estos errores. {% endAside %}

### Encontrar el contenido mixto en su sitio

Puede buscar contenido mixto directamente en su código fuente. Busque `http://` en su código fuente y encuentre las etiquetas que incluyan atributos de URL HTTP. Tenga en cuenta que tener `http://` en el atributo `href` de las etiquetas de anclaje (`<a>`) a menudo no es un problema de contenido mixto, con algunas excepciones notables que se comentan más adelante.

Si su sitio se publica mediante un sistema de gestión de contenido, es posible que se inserten enlaces a URL inseguras cuando se publiquen las páginas. Por ejemplo, las imágenes pueden incluirse con una URL completa en lugar de una ruta relativa. Deberá encontrarlas y corregirlas dentro del contenido CMS.

### Solucionar el contenido mixto

Una vez que haya encontrado contenido mixto en la fuente de su sitio, puede seguir los siguientes pasos para solucionarlo.

Si recibe un mensaje en la consola respecto a que una solicitud de recursos se actualizó automáticamente de HTTP a HTTPS, puede cambiar de forma segura el `http://` del recurso en su código a `https://`. También puede verificar si un recurso está disponible de forma segura si cambia de `http://` a `https://` en la barra de URL del navegador y si intenta abrir la URL en una pestaña del navegador.

Si el recurso no está disponible a través de `https://`, debe considerar una de las siguientes opciones:

- Incluya el recurso desde un host diferente, si hay uno disponible.
- Descargue y aloje el contenido en su sitio directamente, si está legalmente autorizado para hacerlo.
- Excluya por completo el recurso de su sitio.

Una vez solucionado el problema, revise la página donde encontró el error originalmente y verifique que el error ya no aparezca.

### Tenga cuidado con el uso de etiquetas no estándar

Tenga cuidado con el uso de etiquetas no estándar en su sitio. Por ejemplo, las URL de etiquetas de anclaje (`<a>`) no generan errores de contenido mixto, ya que hacen que el navegador vaya a una nueva página. Esto significa que, por lo general, no es necesario solucionarlas. Sin embargo, algunos scripts de la galería de imágenes anulan la funcionalidad de la etiqueta `<a>` y cargan el recurso HTTP especificado por el atributo `href` en una pantalla Lightbox en la página, lo que genera un problema de contenido mixto.

## Manejar el contenido mixto a escala

Los pasos manuales anteriores funcionan bien para sitios web más pequeños; pero para sitios web grandes o sitios con muchos equipos de desarrollo separados, puede ser difícil realizar un seguimiento de todo el contenido que se carga. Para ayudar con esta tarea, puede utilizar la política de seguridad de contenido para indicarle al navegador que le notifique sobre el contenido mixto y asegurar que sus páginas nunca carguen recursos inseguros de forma inesperada.

### Política de seguridad de contenido

La [política de seguridad de contenido](/csp/) (CSP) es una función multipropósito del navegador que puede utilizar para administrar el contenido mixto a escala. El mecanismo de informes de CSP se puede utilizar para rastrear el contenido mixto en su sitio y proporcionar políticas de cumplimiento para proteger a los usuarios al actualizar o bloquear el contenido mixto.

Puede habilitar estas funciones para una página al incluir el encabezado `Content-Security-Policy` o `Content-Security-Policy-Report-Only` en la respuesta enviada desde su servidor. Además, puede configurar `Content-Security-Policy` (aunque **no** `Content-Security-Policy-Report-Only`) mediante una etiqueta `<meta>` en la sección `<head>` de su página.

{% Aside %} Los navegadores modernos hacen cumplir todas las políticas de seguridad de contenido que reciben. Los valores múltiples de encabezado CSP recibidos por el navegador en el encabezado de respuesta o en los elementos `<meta>` se combinan y aplican como una sola política. Asimismo, se combinan las políticas de presentación de informes. Las políticas se combinan al considerar la intersección de las políticas; es decir, cada política después de la primera solo puede restringir aún más el contenido permitido, no ampliarlo. {% endAside %}

### Encontrar contenido mixto con la política de seguridad de contenido

Puede utilizar la política de seguridad de contenido para recopilar informes de contenido mixto en su sitio. Para habilitar esta función, configure la directiva `Content-Security-Policy-Report-Only` al agregarla como un encabezado de respuesta para su sitio.

Encabezado de respuesta:

`Content-Security-Policy-Report-Only: default-src https: 'unsafe-inline' 'unsafe-eval'; report-uri https://example.com/reportingEndpoint`

{% Aside %} El encabezado de respuesta [report-uri](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri) se está dejando de soportar en favor de [report-to](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-to). La compatibilidad del navegador con `report-to` se limita actualmente a Chrome y Edge. Puede proporcionar ambos encabezados, en cuyo caso `report-uri` se ignorará si el navegador admite `report-to`. {% endAside %}

Cada vez que un usuario visita una página de su sitio, su navegador envía informes en formato JSON a `https://example.com/reportingEndpoint` sobre cualquier cosa que viole la política de seguridad de contenido. En este caso, cada vez que se carga un recurso secundario a través de HTTP, se envía un informe. Estos informes incluyen la URL de la página donde ocurrió la infracción de la política y la URL del recurso secundario que violó la política. Si configura su terminal de informes para registrar estos informes, puede rastrear el contenido mixto en su sitio sin visitar cada página por sí mismo.

Las dos salvedades a esto son:

- Los usuarios deben visitar su página en un navegador que comprenda el encabezado CSP. Esto es cierto para la mayoría de los navegadores modernos.
- Solo obtiene informes de las páginas visitadas por sus usuarios. Por lo tanto, si tiene páginas que no reciben mucho tráfico, puede pasar algún tiempo antes de que obtenga informes para todo su sitio.

La guía de [políticas de seguridad de contenido](/csp/) tiene más información y un terminal de ejemplo.

### Alternativas a la presentación de informes con CSP

Si tiene su sitio alojado en una plataforma como Blogger, es posible que no tenga acceso para modificar los encabezados y agregar un CSP. En cambio, una alternativa viable podría ser el uso de un rastreador de sitios web para encontrar problemas en su sitio, como [HTTPSChecker](https://httpschecker.net/how-it-works#httpsChecker) o [Mixed Content Scan](https://github.com/bramus/mixed-content-scan).

### Actualizar las solicitudes inseguras

Los navegadores están comenzando a actualizar y a bloquear solicitudes inseguras. Puede utilizar las directivas CSP para forzar la actualización automática o el bloqueo de estos activos.

La directiva CSP [`upgrade-insecure-requests`](https://www.w3.org/TR/upgrade-insecure-requests/) le indica al navegador que actualice las URL inseguras antes de realizar solicitudes de red.

Por ejemplo, si una página contiene una etiqueta de imagen con una URL HTTP como `<img src="http://example.com/image.jpg">`.

En cambio, el navegador realiza una solicitud segura para `https://example.com/image.jpg`, lo que evita que el usuario reciba contenido mixto.

Puede habilitar este comportamiento si envía un encabezado `Content-Security-Policy` con esta directiva:

```markup
Content-Security-Policy: upgrade-insecure-requests
```

O puede incrustar esa misma directiva en serie en la sección `<head>` del documento mediante un elemento `<meta>`:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

Al igual que con la actualización automática del navegador, si el recurso no está disponible a través de HTTPS, la solicitud actualizada falla y el recurso no se carga. Esto mantiene la seguridad de su página. La directiva `upgrade-insecure-requests` irá más allá de la actualización automática del navegador, para intentar actualizar las solicitudes que el navegador no actualizó actualmente.

La directiva `upgrade-insecure-requests` se distribuye en cascada en los documento `<iframe>`, lo que garantiza que toda la página esté protegida.

### Bloquear todo el contenido mixto

Una opción alternativa para proteger a los usuarios es la directiva CSP [`block-all-mixed-content`](https://www.w3.org/TR/mixed-content/#strict-checking). Esta directiva le indica al navegador que nunca cargue contenido mixto. Se bloquean todas las solicitudes de recursos de contenido mixto, incluido el contenido mixto activo y pasivo. Esta opción también se distribuye en cascada en los documentos `<iframe>`, lo que garantiza que toda la página esté libre de contenido mixto.

Una página puede optar por este comportamiento si envía un encabezado `Content-Security-Policy` con esta directiva:

```markup
Content-Security-Policy: block-all-mixed-content
```

O si incrusta esa misma directiva en serie en la sección `<head>` del documento mediante un elemento `<meta>`:

```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
```

{% Aside %} Si configura `upgrade-insecure-requests` y `upgrade-insecure-requests` a la vez, `block-all-mixed-content` se evaluará y se utilizará primero. El navegador no seguirá bloqueando las solicitudes. Por lo tanto, debe utilizar uno u otro. {% endAside %}
