---
layout: post
title: Prácticas recomendadas de Referrer-Policy y Referer
subhead: Prácticas recomendadas para establecer Referrer-Policy y utilizar Referrer en las solicitudes recibidas.
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |
  Considere la posibilidad de establecer una Referrer Policy de `strict-origin-when-cross-origin`. Esto conserva gran parte de las funciones del Referrer, a la vez que mitiga el riesgo de filtrar datos de orígenes cruzados.
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## Resumen

- La filtración inesperada de información de origen cruzado dificulta la privacidad de los usuarios de la web. En este caso puede ayudar una directiva protectora Referrer-Policy.
- Considere la posibilidad de establecer una Referrer-Policy de `strict-origin-when-cross-origin`. Esto conserva gran parte de las funciones del Referrer, a la vez que mitiga el riesgo de filtrar datos de orígenes cruzados.
- No utilice Referrer para protegerse contra la Falsificación de solicitudes en sitios cruzados (CSRF). En vez de eso utilice [tokens CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) y otros encabezados como una capa adicional de seguridad.

{% Aside %} Antes de comenzar:

- Si no está seguro de la diferencia entre "sitio" y "origen", consulte [Cómo comprender "same-site" y "same-origin"](/same-site-same-origin/)[](/same-site-same-origin/).
- Al encabezado `Referer` le falta una R, debido a un error ortográfico de origen en la especificación. El encabezado `Referrer-Policy` y `referrer` que son de JavaScript y de DOM se escriben correctamente. {% endAside %}

## Referer y Referrer-Policy 101

Las solicitudes HTTP pueden incluir el [encabezado `Referer`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer) de forma opcional, que indica el origen o la URL de la página web desde la que se realizó la solicitud. El [encabezado `Referrer-Policy`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) define qué datos están disponibles en el encabezado `Referer`.

En el siguiente ejemplo, el encabezado `Referer` incluye la URL completa de la página en `site-one` desde la que se realizó la solicitud.

<figure>{% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="Solicitud HTTP que incluye un encabezado Referer", width="800", height="573" %}</figure>

El encabezado `Referer` puede estar presente en diferentes tipos de solicitudes:

- Solicitudes de navegación, cuando un usuario hace clic en un enlace
- Solicitudes de subrecursos, cuando un navegador solicita imágenes, iframes, scripts y otros recursos que necesita una página.

También se puede acceder a los datos de las navegaciones y los iframes a través de JavaScript utilizando `document.referrer`.

El valor de `Referer` puede ser revelador. Por ejemplo, un servicio de análisis podría utilizar el valor para determinar que el 50% de los visitantes de `site-two.example` provienen de `social-network.example`.

Pero cuando la dirección URL completa, incluyendo la ruta y la cadena de consulta, se envía en el `Referer` **entre orígenes**, esto puede ser **un obstáculo para la privacidad** y también plantear **riesgos de seguridad**. Eche un vistazo a estas URL:

<figure>{% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URL con rutas, asignadas a diferentes riesgos de privacidad y seguridad", width="800", height="370" %}</figure>

Las URL del #1 al #5 contienen información privada, a veces incluso identificativa o confidencial. Filtrar estos datos de forma silenciosa a través de los orígenes puede comprometer la privacidad de los usuarios en la web.

La URL #6 es una [capability URL](https://www.w3.org/TR/capability-urls/). Usted no desea que caiga en manos de nadie que no sea el usuario previsto. Si esto sucede, un ciberdelincuente podría secuestrar la cuenta de este usuario.

**Para restringir los datos del Referrer que están disponibles para las solicitudes de su sitio, puede establecer una Referrer-Policy.**

## ¿Qué políticas están disponibles y en qué se diferencian?

Puede seleccionar una de las ocho políticas. Dependiendo de la política, los datos disponibles del encabezado `Referer` (y de `document.referrer`) pueden ser:

- No hay datos (el encabezado `Referer` no está presente)
- Solo el [origen](/same-site-same-origin/#origin)
- La dirección URL completa: origen, ruta y cadena de consulta

<figure>{% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Datos que pueden estar contenidos en el encabezado Referer y document.referrer", width="800", height="255" %}</figure>

Algunas políticas están diseñadas para comportarse de forma diferente dependiendo del **contexto**: solicitud de origen cruzado o del mismo origen, seguridad (si el destino de la solicitud es tan seguro como el origen), o ambos. Esto es útil para limitar la cantidad de información compartida entre orígenes o para orígenes menos seguros, mientras se mantiene la riqueza del Referrer dentro de su propio sitio.

Aquí se muestra una descripción general de cómo las Referrer Policies restringen los datos de la URL disponibles en el encabezado Referer y `document.referrer`:

<figure>{% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="Diferentes Referrer Policies and their behaviour, según la seguridad y el contexto de origen cruzado", width="800", height="537" %}</figure>

MDN proporciona una [lista completa de políticas y ejemplos de comportamiento](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives).

Cosas a tener en cuenta:

- Todas las políticas que tienen en cuenta el esquema (HTTPS vs. HTTP) (`strict-origin`, `no-referrer-when-downgrade` y `strict-origin-when-cross-origin`) tratan las solicitudes desde un origen HTTP a otro origen HTTP de la misma manera que las solicitudes de un origen HTTPS a otro origen HTTPS, incluso si HTTP es menos seguro. Esto se debe a que, para estas políticas, lo que importa es si se produce un **downgrade** de seguridad, es decir, si la solicitud puede exponer los datos de un origen cifrado a uno sin cifrar. Una solicitud HTTP → HTTP no está cifrada todo el tiempo, por lo que no hay downgrade. Las solicitudes HTTPS → HTTP, por el contrario, presentan un downgrade.
- Si una solicitud es **same-origin**, significa que el esquema (HTTPS o HTTP) es el mismo, por lo tanto, no hay ningún downgrade o degradación de seguridad.

## Referrer Policies predeterminadas en los navegadores

*A partir de julio del 2020*

**Si no se establece ninguna Referrer Policy, se utilizará la política predeterminada del navegador.**

<div>
  <table>
    <thead>
      <tr>
        <th>Navegador</th>
        <th>Comportamiento/<code>Referrer-Policy</code> predeterminado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>Se planeó el cambio a <code>strict-origin-when-cross-origin</code> en la <a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">versión 85</a> (conocida anteriormente como <code>no-referrer-when-downgrade</code>)</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li>
<code>strict-origin-when-cross-origin</code> (<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">consulte el error cerrado</a>)</li>
            <li>
<code>strict-origin-when-cross-origin</code> en navegación privada y para rastreadores</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li>Se hacen <a href="https://github.com/privacycg/proposals/issues/13">pruebas</a> con <code>strict-origin-when-cross-origin</code>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>Es similar a <code>strict-origin-when-cross-origin</code>. Consulte <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Prevención del seguimiento</a> para obtener más información.</td>
      </tr>
    </tbody>
  </table>
</div>

## Configuración de su Referrer Policy: prácticas recomendadas

{% Aside 'objective' %} Establezca explícitamente una privacy-enhancing policy, como `strict-origin-when-cross-origin` (o más estricto). {% endAside %}

Hay diferentes maneras de establecer Referrer Policies en su sitio:

- Como un encabezado HTTP
- Dentro de su [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML)
- Desde JavaScript a las [bases de las solicitudes](https://javascript.info/fetch-api#referrer-referrerpolicy)

Puede establecer diferentes políticas para diferentes páginas, solicitudes o elementos.

Tanto el encabezado HTTP como el elemento meta están a nivel de página. El orden de precedencia al determinar la política efectiva de un elemento es:

1. Política a nivel de elemento
2. Política de nivel de página
3. Navegador predeterminado

**Ejemplo:**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

La imagen se solicitará con una política `no-referrer-when-downgrade`, mientras que todas las demás solicitudes de recursos secundarios de esta página seguirán la política `strict-origin-when-cross-origin`.

## ¿Cómo ver la Referrer Policy?

[securityheaders.com](https://securityheaders.com/) es útil para determinar la política que utiliza un sitio o una página específica.

También puede utilizar las herramientas para desarrolladores de Chrome, Edge o Firefox para ver la Referrer Policy que se utilizó en una solicitud específica. En el momento de escribir este artículo, Safari no muestra la `Referrer-Policy` pero sí muestra la `Referer` que se envió.

<figure>{% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="Una captura de pantalla del panel la red de Chrome DevTools, que muestra Referer y Referrer-Policy", width="800", height="416" %} <figcaption>Chrome DevTools, panel de la <b>red</b> con una solicitud seleccionada.</figcaption></figure>

## ¿Qué política debe establecer en su sitio web?

Resumen: establezca explícitamente una política de mejora de la privacidad como `strict-origin-when-cross-origin` (o más estricta).

### ¿Por qué "explícitamente"?

Si no se establece una Referrer Policy, se utilizará la política por predeterminada del navegador, de hecho, los sitios web normalmente aceptan la política predeterminada del navegador. Pero esto no es lo ideal, porque:

- Las políticas predeterminadas de los navegadores son `no-referrer-when-downgrade`, `strict-origin-when-cross-origin` o más estrictas, según el navegador y el modo (privado/incógnito). Por lo tanto, su sitio web no se comportará de manera predecible en todos los navegadores.
- Los navegadores están adoptando valores predeterminados más estrictos, como `strict-origin-when-cross-origin` y los mecanismos como cuando [referrer hace trimming](https://github.com/privacycg/proposals/issues/13) en las solicitudes de origen cruzado. Opte explícitamente por una política de mejora de la privacidad antes de que cambien los valores predeterminados del navegador le da el control y le ayuda a ejecutar las pruebas como mejor le parezca.

### ¿Por qué `strict-origin-when-cross-origin` (o más estricto)?

Necesita una política que sea segura, que mejore la privacidad y que sea útil, lo que significa "útil" depende de lo que desee del referrer:

- **Seguro**: si su sitio web utiliza HTTPS ([si no es así, hágalo prioritario](/why-https-matters/)), no desea que las URL de su sitio web se filtren en solicitudes que no sean HTTPS. Dado que cualquiera en la red puede verlos, esto expondría a sus usuarios a ataques de persona en el medio. Las políticas `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, `no-referrer` y `strict-origin` resuelven este problema.
- **Mejora de la privacidad**: para una solicitud de origen cruzado, `no-referrer-when-downgrade` comparte la URL completa, esto no mejora la privacidad. `strict-origin-when-cross-origin` y `strict-origin` solo comparten el origen, y `no-referrer` no comparte nada. Esto le deja con `strict-origin-when-cross-origin` `strict-origin` y `no-referrer` como opciones para mejorar la privacidad.
- **Útil**: `no-referrer` y `strict-origin` nunca comparten la URL completa, ni siquiera para las solicitudes del mismo origen, así que si necesita esto, `strict-origin-when-cross-origin` es una mejor opción.

Todo esto significa que **`strict-origin-when-cross-origin`** es generalmente una opción sensata.

**Ejemplo: establecer una política de `strict-origin-when-cross-origin`**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

O del lado del servidor, por ejemplo en Express:

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### ¿Qué sucedería si `strict-origin-when-cross-origin` (o más estricto) no se adapta a todos sus casos de uso?

En este caso, adopte un **enfoque progresivo** : establezca una política de protección como `strict-origin-when-cross-origin` para su sitio web y, si es necesario, una política más permisiva para solicitudes específicas o elementos HTML.

### Ejemplo: política a nivel de elemento

`index.html` :

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Tenga en cuenta que Safari/WebKit puede limitar `document.referrer` o el encabezado `Referer` para solicitudes [cross-site](/same-site-same-origin/#same-site-cross-site). Consulte [detalles](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).

### Ejemplo: política de nivel de solicitud

`script.js` :

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### ¿Qué más debería considerar?

Su política debe depender de su sitio web y de los casos de uso, esto depende de usted, su equipo y su empresa. Si algunas URL contienen datos de identificación o confidenciales, establezca una política de protección.

{% Aside 'warning' %} Los datos que pueden no parecer sensibles para usted, pueden serlo para sus usuarios, o simplemente no son datos que ellos quieran o esperen que se filtren silenciosamente de origen cruzado. {% endAside %}

## Uso de Referrer en las solicitudes recibidas: prácticas recomendadas

### ¿Qué hacer si la funcionalidad de su sitio utiliza la URL de Referrer en las solicitudes recibidas?

#### Proteja los datos de los usuarios

`Referer` puede contener datos privados, personales o de identificación, así que asegúrese de tratarlos como tales.

#### Tenga en cuenta que el `Referer` que recibe puede cambiar

El uso de Referrer de las solicitudes entrantes de origen cruzado tiene algunas limitaciones:

- Si no tiene control sobre la implementación del emisor de solicitudes, no puede hacer suposiciones sobre el encabezado `Referer` (y `document.referrer`) que recibe. El emisor de la solicitud puede decidir en cualquier momento cambiar a una política `non-referrer`, o de manera más general a una política más estricta que la que usaba antes, lo que significa que obtendrá menos datos mediante `Referer` que antes.
- Los navegadores utilizan cada vez más la Referrer-Policy de `strict-origin-when-cross-origin` de forma predeterminada. Esto significa que ahora puede recibir solo el origen (en vez de la URL de Referrer completa) en las solicitudes recibidas de origen cruzado, si el sitio que las envía no tiene ninguna política establecida.
- Los navegadores pueden cambiar la forma en que administran `Referer`. Por ejemplo, en el futuro, es posible que decidan los referrers siempre hagan trim a los orígenes en las solicitudes de subrecursos de origen cruzado, con el fin de proteger la privacidad del usuario.
- El encabezado `Referer` (y `document.referrer`) puede contener más datos de los que necesita, por ejemplo una URL completa cuando solo desea saber si la solicitud es de origen cruzado.

#### Alternativas a `Referer`

Es posible que deba considerar alternativas si:

- Una función esencial de su sitio utiliza la URL de referrer de las solicitudes entrantes de origen cruzado
- Y/o si su sitio ya no recibe la parte de la URL de Referrer que necesita en una solicitud de origen cruzado. Esto sucede cuando el emisor de la solicitud cambió su política o cuando no tiene una política establecida y la política predeterminada del navegador cambió (como en [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)).

Para definir las alternativas, analice primero qué parte de referrer está utilizando.

**Si solo necesita el origen ( `https://site-one.example` ):**

- Si está utilizando el referrer en un script que tiene acceso de nivel superior a la página, `window.location.origin` es una alternativa.
- Si están disponibles, los encabezados como [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) y [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) le dan el `Origin` o describen si la solicitud es de origen cruzado, que puede ser exactamente lo que necesita.

**Si necesita otros elementos de la URL (ruta, parámetros de consulta…):**

- Los parámetros de solicitud pueden abordar su caso de uso y esto le ahorra el trabajo de analizar el referrer.
- Si está utilizando el referrer en un script que tiene acceso de nivel superior a la página, `window.location.pathname` puede ser una alternativa. Extraiga solo la sección de la ruta de acceso de la URL y emítala como argumento, de modo que no se transmita ninguna información potencialmente sensible de los parámetros de la URL.

**Si no puede utilizar estas alternativas:**

- Verifique si sus sistemas pueden cambiarse para esperar que el emisor de solicitudes ( `site-one.example` ) establezca explícitamente la información que necesita en una configuración de algún tipo. Ventaja: más explícito, más preservación de la privacidad para los usuarios de `site-one.example` Contra: potencialmente más trabajo de su lado o para los usuarios de su sistema.
- Verifique si el sitio que emite las solicitudes puede aceptar establecer una Referrer-Policy of `no-referrer-when-downgrade` por elemento o por solicitud. Contra: potencialmente menos preservación de la privacidad para `site-one.example`, potencialmente no es compatible con todos los navegadores.

### Protección contra la falsificación de solicitudes en sitios cruzados (CSRF)

Tenga en cuenta que un emisor de solicitudes siempre puede decidir no enviar el referrer estableciendo una política `no-referrer` (y un actor malintencionado podría incluso falsificar el referrer).

Utilice [Tokens CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) como protección principal. Para una protección adicional, utilice [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites) y en lugar de `Referer`, utilice encabezados como [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) (disponible en solicitudes POST y CORS) y [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) (si está disponible).

### Registro de datos

Asegúrese de proteger los datos personales o confidenciales de los usuarios que puedan estar en el `Referer`.

Si solo está utilizando el origen, verifique si el [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) podría ser una alternativa. Esto puede brindarle la información que necesita para fines de depuración de una manera más simple y sin necesidad de analizar al Referrer.

### Pagos

Los proveedores de pago pueden confiar en el `Referer` de las solicitudes recibidas para controles de seguridad.

Por ejemplo:

- El usuario hace clic en un botón **Comprar** `online-shop.example/cart/checkout`.
- `online-shop.example` redirecciona a `payment-provider.example` para administrar la transacción.
- `payment-provider.example` verifica el `Referer` de esta solicitud con una lista de `Referer` permitidos establecidos por los comerciantes. Si no coincide con ninguna entrada de la lista, `payment-provider.example` rechaza la solicitud. Si coincide, el usuario puede continuar con la transacción.

#### Prácticas recomendadas para los controles de seguridad del flujo de pagos

**Resumen: como proveedor de pagos, puede utilizar el `Referer` como un control básico contra ataques naive, pero definitivamente debería tener otro método de verificación más confiable.**

El encabezado `Referer` por sí solo no es una base confiable para una verificación: el sitio solicitante, ya sea o no un comerciante legítimo, puede establecer una política `no-referrer` que hará que la información de `Referer` no esté disponible para el proveedor de pagos. Sin embargo, como proveedor de pagos, observar el `Referer` puede ayudarle a atrapar a los atacantes ingenuos que no establecieron una política `no-referrer`. De modo que puede decidir utilizar `Referer` como primera verificación básica. Si lo hace:

- **No espere que el `Referer` siempre esté presente, y si está presente solo compruebe con el dato que incluirá como mínimo: el origen**. Al establecer la lista de valores `Referer` permitidos, asegúrese de que no se incluya ninguna ruta, sino solo el origen. Ejemplo: los valores `Referer` permitidos de `online-shop.example` deben estar `online-shop.example` , no `online-shop.example/cart/checkout`. ¿Por qué? Debido a que al no esperar ningún `Referer` o un valor de `Referer` que sea el origen del sitio web solicitante, se evitan errores inesperados ya que **no está haciendo suposiciones sobre la `Referrer-Policy`** que el comerciante ha establecido o sobre el comportamiento del navegador si el comerciante no tiene una política establecida. Tanto el sitio como el navegador podrían eliminar el `Referer` enviado en la solicitud entrante solo al origen o no enviar al `Referer` en absoluto.
- Si el `Referer` está ausente o si está presente y su verificación básica de origen de `Referer` fue exitosa: puede pasar a su otro método de verificación más confiable (ver más abajo).

**¿Cuál es un método de verificación más confiable?**

Un método de verificación confiable es permitir que el solicitante **codifique los parámetros de la solicitud** junto con una clave única. Como proveedor de pagos, puede **calcular el mismo hash de su lado** y solo aceptar la solicitud si coincide con su cálculo.

**¿Qué sucede con el `Referer` cuando un sitio de comerciante HTTP sin una Referrer Policy redirecciona a un proveedor de pago HTTPS?**

Ningún `Referer` será visible en la solicitud para el proveedor de pago HTTPS, porque la [mayoría de los navegadores](#default-referrer-policies-in-browsers) usan `strict-origin-when-cross-origin` o `no-referrer-when-downgrade` de categoría de forma predeterminada cuando un sitio web no tiene una política establecida. También tenga en cuenta que el [cambio de Chrome a una nueva política predeterminada](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) no cambiará este comportamiento.

{% Aside %}

Si su sitio web utiliza HTTP, [migre a HTTPS](/why-https-matters/).

{% endAside %}

## Conclusión

Una Referrer Policy protectora es una excelente manera de brindar a sus usuarios más privacidad.

Para obtener más información sobre las diferentes técnicas para proteger a sus usuarios, consulte la colección [Safe and secure](/secure/) de web.dev.

*Muchas gracias por las contribuciones y comentarios a todos los revisores, especialmente a Kaustubha Govind, David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck y Kayce Basques.*

## Recursos

- [Entender "mismo sitio" y "mismo origen"](/same-site-same-origin/)
- [Un nuevo encabezado de seguridad: Referrer Policy (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Referrer Policy en MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [Encabezado del referer: preocupaciones de privacidad y seguridad en MDN](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Cambio de Chrome: intento de implementación de Blink](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Cambio de Chrome: intención de envío de Blink](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Cambio de Chrome: entrada de estado](https://www.chromestatus.com/feature/6251880185331712)
- [Cambio de Chrome: publicación de blog de la versión 85](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [Referrer hace trimming en el procesador de GitHub: lo que hacen los diferentes navegadores](https://github.com/privacycg/proposals/issues/13)
- [Especificación de Referrer-Policy](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
