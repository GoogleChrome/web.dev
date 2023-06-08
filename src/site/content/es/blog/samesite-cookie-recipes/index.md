---
title: Recetas para usar las cookies en SameSite
subhead: Actualice las cookies de su sitio para prepararse para los próximos cambios en el comportamiento de atributo de SameSite.
authors:
  - rowan_m
date: 2019-10-30
updated: 2020-05-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/5f56hyvtMT6Dymo839tc.png
description: Con la introducción del nuevo valor de atributo SameSite=None, los sitios ahora pueden marcar explícitamente sus cookies para uso entre sitios. Los navegadores están empezando a hacer que las cookies sin un atributo SameSite actúen como propias de forma predeterminada, una opción más segura y que preserva la privacidad que el comportamiento abierto actual. Aprenda a marcar sus cookies para asegurarse de que las cookies propias y de terceros continúan funcionando una vez que este cambio entre en vigencia.
tags:
  - blog
  - security
  - cookies
  - chrome-80
  - test-post
feedback:
  - api
---

{% Aside %} Este artículo es parte de una serie de artículos que hablan sobre los cambios en los atributos para cookies de `SameSite`

- [Explicación sobre las cookies de SameSite](/samesite-cookies-explained/)
- [Recetas para usar las cookies en SameSite](/samesite-cookie-recipes/)
- [Schemeful Same-Site](/schemeful-samesite) {% endAside %}

[Chrome](https://www.chromium.org/updates/same-site), [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ), [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) y otros cambiarán su comportamiento predeterminado de acuerdo con la propuesta de IETF, [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) para que:

- Las cookies sin un atributo `SameSite` se traten como `SameSite=Lax`, lo que significa que el comportamiento predeterminado será restringir las cookies **solo a** contextos propios.
- Las cookies para uso entre sitios **deben** especificar `SameSite=None; Secure` para permitir la inclusión en el contexto de terceros.

Esta función es el [comportamiento predeterminado desde Chrome 84 en adelante](https://blog.chromium.org/2020/05/resuming-samesite-cookie-changes-in-july.html). Si aún no lo ha hecho, debe actualizar los atributos de sus cookies de terceros para que no se bloqueen en el futuro.

## Compatibilidad entre navegadores

Consulte la sección de [compatibilidad del navegador](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie#Browser_compatibility) de la página de [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) de MDN.

## Casos de uso para cookies entre sitios o de terceros

Hay una serie de casos de uso y patrones comunes en los que las cookies deben enviarse en un contexto de terceros. Si proporciona o depende de uno de estos casos de uso, asegúrese de que usted o el proveedor estén actualizando sus cookies para garantizar que el servicio continúe funcionando correctamente.

### Contenido dentro de un `<iframe>`

El contenido de un sitio diferente que se muestra en un `<iframe>` está en un contexto de terceros. Los casos de uso estándar aquí son:

- Contenido incrustado que se comparte desde otros sitios, como videos, mapas, muestras de código y publicaciones en redes sociales.
- Widgets de servicios externos como pagos, calendarios, reservaciones y funcionalidad de reservaciones.
- Widgets como botones de redes sociales o servicios antifraude que crean `<iframes>` menos obvios.

Las cookies se pueden utilizar aquí para, entre otras cosas, mantener el estado de la sesión, almacenar preferencias generales, habilitar estadísticas o personalizar contenido para usuarios con cuentas existentes.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fTUQP4SffHHcexSipvlz.png", alt="Diagrama de una ventana del navegador donde la URL del contenido incrustado no coincide con la URL de la página.", width="468", height="383 ", style="max-width: 35vw;" %}<figcaption> Si el contenido incrustado no proviene del mismo sitio que el contexto de navegación de nivel superior, es contenido de terceros.</figcaption></figure>

Además, como la web es intrínsecamente componible, los `<iframes>` se utilizan para incrustar contenido que también se ve en un contexto propio o de nivel superior. Todas las cookies utilizadas por ese sitio se considerarán como cookies de terceros cuando el sitio se muestre dentro del marco. Si está creando sitios que desea que otros incrusten fácilmente y, al mismo tiempo, confía en que las cookies funcionen, también deberá asegurarse de que estén marcadas para el uso entre sitios, o que pueda retroceder con elegancia sin ellos.

### Solicitudes "inseguras" entre sitios

Si bien "inseguro" puede parecer un poco preocupante aquí, esto se refiere a cualquier solicitud que pueda tener la intención de cambiar de estado. En la web, se trata principalmente de solicitudes POST. Las cookies marcadas como `SameSite=Lax` se enviarán en navegaciones seguras de nivel superior, por ejemplo, al hacer clic en un enlace para ir a un sitio diferente. Sin embargo, algo como un `<form>` a través de POST a un sitio diferente no incluiría cookies.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vddDg7f9Gp93OgaqWwHu.png", alt="Diagrama de una solicitud que se mueve de una página a otra.", width="719", height="382", style="max-width: 35vw; " %}<figcaption> Si la solicitud entrante utiliza un método "seguro", se enviarán las cookies.</figcaption></figure>

Este patrón se utiliza para sitios que pueden redirigir al usuario a un servicio remoto para realizar alguna operación antes de regresar, por ejemplo, redirigir a un proveedor de identidad de terceros. Antes de que el usuario abandone el sitio, se establece una cookie que contiene un token de un solo uso, con la expectativa de que este token se pueda verificar en la solicitud de retorno para mitigar los ataques de [falsificación de solicitudes entre sitios (CSRF).](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) Si esa solicitud de devolución llega a través de POST, será necesario marcar las cookies como `SameSite=None; Secure`.

### Recursos remotos

Cualquier recurso remoto en una página puede depender de las cookies que se enviarán con una solicitud, desde las etiquetas `<img>`, `<script>`, etc. Los casos de uso comunes incluyen el seguimiento de pixeles y la personalización de contenido.

Esto también se aplica a las solicitudes iniciadas desde su JavaScript mediante `fetch` o `XMLHttpRequest`. Si se llama a `fetch()` con la [opción `credentials: 'include'`](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included), esta es un buen indicio de que se pueden esperar cookies en esas solicitudes. Para `XMLHttpRequest`, debe buscar instancias de la [propiedad `withCredentials`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials) establecida en `true`. Esta es una buen indicio de que se pueden esperar cookies en esas solicitudes. Esas cookies deberán estar debidamente marcadas para que se incluyan en las solicitudes entre sitios.

### Contenido dentro de un WebView

Un WebView en una aplicación específica de la plataforma funciona con un navegador, y deberá probar si se aplican las mismas restricciones o problemas. En Android, si WebView funciona con Chrome, los nuevos valores predeterminados **no** se aplicarán inmediatamente con Chrome 84. Sin embargo, la intención es aplicarlos en el futuro, por lo que aún debe probar y prepararse para esto. Además, Android permite que sus aplicaciones específicas de la plataforma establezcan cookies directamente a través de la [API de CookieManager](https://developer.android.com/reference/android/webkit/CookieManager). Al igual que con las cookies configuradas a través de encabezados o JavaScript, considere incluir `SameSite=None; Secure` si están destinadas al uso entre sitios.

## Cómo implementar `SameSite` hoy

Para las cookies en las que solo se necesitan en un contexto propio, lo ideal es marcarlas como `SameSite=Lax` o `SameSite=Strict` según sus necesidades. También puede optar por no hacer nada y permitir que el navegador aplique su valor predeterminado, pero esto conlleva el riesgo de un comportamiento incoherente entre los navegadores y posibles advertencias de la consola para cada cookie.

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

Para las cookies necesarias en un contexto de terceros, deberá asegurarse de que estén marcadas como `SameSite=None; Secure`. Tenga en cuenta que necesita ambos atributos juntos. Si solo especifica `None` sin `Secure` la cookie será rechazada. Sin embargo, existen algunas diferencias mutuamente incompatibles en las implementaciones del navegador, por lo que es posible que deba utilizar algunas de las estrategias de mitigación que se describen en [Manejo de clientes incompatibles](#handling-incompatible-clients) a continuación.

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### Manejo de clientes incompatibles

Como estos cambios para incluir `None` y actualizar el comportamiento predeterminado aún son relativamente nuevos, existen inconsistencias entre los navegadores en cuanto a cómo se manejan estos cambios. Puede consultar la [página de actualizaciones en chromium.org](https://www.chromium.org/updates/same-site/incompatible-clients) para informarse sobre los problemas actualmente conocidos, sin embargo, no es posible decir si es exhaustivo. Si bien esto no es ideal, existen soluciones alternativas que puede emplear durante esta fase de transición. Sin embargo, la regla general es tratar a los clientes incompatibles como un caso especial. No cree una excepción para los navegadores que implementan las reglas más nuevas.

La primera opción es configurar las cookies de estilo nuevo y antiguo:

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

Los navegadores que implementan el comportamiento más nuevo establecerán la cookie con el valor `SameSite`, mientras que otros navegadores pueden ignorarlo o configurarlo incorrectamente. No obstante, esos mismos navegadores establecerán la cookie `3pcookie-legacy`. Al procesar las cookies incluidas, el sitio debe verificar primero la presencia de la nueva cookie de estilo y, si no se encuentra, deberá recurrir a la cookie heredada.

El siguiente ejemplo muestra cómo hacer esto en Node.js, usando el [marco Express](https://expressjs.com) y su middleware [analizador de cookies](https://www.npmjs.com/package/cookie-parser).

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // Set the new style cookie
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // And set the same value in the legacy cookie
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // check the new style cookie first
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // otherwise fall back to the legacy cookie
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

La desventaja es que esto implica configurar cookies redundantes para cubrir todos los navegadores, y requiere realizar cambios tanto en el punto de configuración como en la lectura de la cookie. Sin embargo, este enfoque debe cubrir todos los navegadores independientemente de su comportamiento y garantizar que las cookies de terceros sigan funcionando como antes.

Alternativamente, en el momento de enviar la cabecera `Set-Cookie`, puede elegir detectar el cliente a través de la cadena de agente de usuario. Consulte la [lista de clientes incompatibles](https://www.chromium.org/updates/same-site/incompatible-clients) y utilice una biblioteca adecuada para su plataforma, por ejemplo, la biblioteca [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) en Node.js. Es aconsejable encontrar una biblioteca para manejar la detección de agentes de usuario, ya que probablemente no desee escribir esas expresiones regulares usted mismo.

El beneficio de este enfoque es que solo requiere realizar un cambio en el momento de configurar la cookie. Sin embargo, la advertencia necesaria aquí, es que el rastreo de agentes de usuario es inherentemente frágil y puede que no atrape a todos los usuarios afectados.

{% Aside %}

Independientemente de la opción que elija, es recomendable asegurarse de tener una forma de registrar los niveles de tráfico que atraviesan la ruta heredada. Asegúrese de tener un recordatorio o alerta para eliminar esta solución una vez que esos niveles caigan por debajo de un umbral aceptable para su sitio.

{% endAside %}

## Compatibilidad con `SameSite=None` en idiomas, bibliotecas y marcos

La mayoría de los lenguajes y bibliotecas admiten el atributo `SameSite` para las cookies, sin embargo, la adición de `SameSite=None` todavía es relativamente nueva, lo que significa que es posible que deba solucionar algunos de los comportamientos estándar por ahora. Estos están documentados en el <a href="https://github.com/GoogleChromeLabs/samesite-examples" data-md-type="link">reporte de ejemplos de `SameSite`en GitHub</a> .

## Obtener ayuda

Las cookies están por todas partes y es raro que un sitio haya auditado por completo dónde se configuran y usan, especialmente una vez que se incluyen casos de uso entre sitios. Cuando encuentre un problema, puede que sea la primera vez que alguien lo encuentre, así que no dude en comunicarse:

- Plantear un problema en el [repote de ejemplos de `SameSite` en GitHub.](https://github.com/GoogleChromeLabs/samesite-examples)
- Escribir en el blog una pregunta sobre la [etiqueta "samesite" en StackOverflow](https://stackoverflow.com/questions/tagged/samesite).
- Para problemas con el comportamiento de Chromium, genere un error a través de la [plantilla de problema [Cookies de SameSite]](https://bit.ly/2lJMd5c).
- Siga el progreso de Chrome en la [página de actualizaciones de `SameSite`](https://www.chromium.org/updates/same-site).
