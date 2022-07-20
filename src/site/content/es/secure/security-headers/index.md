---
layout: post
title: Referencia rápida de las cabeceras de seguridad
subhead: Obten más información sobre las cabeceras que pueden mantener seguro a tu sitio y busca rápidamente los detalles más importantes.
authors:
  - agektmr
  - maudn
  - arturjanc
date: 2021-05-18
hero: image/YLflGBAPWecgtKJLqCJHSzHqe2J2/E3BVnrBFNV6w2Uqxn3bQ.jpg
alt: Un candado delante del código comprimido
description: Este artículo enumera las cabeceras de seguridad más importantes que puedes utilizar para proteger tu página web. Úsalo para comprender las funciones de seguridad basadas en la web, aprende a implementarlos en tu sitio web y como referencia para cuando necesites un recordatorio.
tags:
  - blog
  - security
---

Este artículo enumera las cabeceras de seguridad más importantes que puedes utilizar para proteger tu página web. Úsalo para comprender las funciones de seguridad basadas en la web, aprende a implementarlos en tu sitio web y como referencia para cuando necesites un recordatorio.

Cabeceras de seguridad recomendados para sitios web que manejan datos confidenciales del usuario: : [Content Security Policy(CSP): Política de seguridad de contenido](#csp) : [Trusted Types (Tipos confiables)](#tt)

Cabeceras de seguridad recomendados para todos los sitios web:: [X-Content-Type-Options](#xcto) : [X-Frame-Options](#xfo) : [Política de recursos de origen cruzado (CORP)](#corp) : [Política de apertura de origen cruzado (COOP)](#coop) : [Seguridad de transporte estricta de HTTP (HSTS)](#hsts)

Cabeceras de seguridad para sitios web con capacidades avanzadas:: [Intercambio de recursos de origen cruzado (CORS)](#cors) : [Política de incrustación de origen cruzado (COEP)](#coep)

{% Details %} {% DetailsSummary %}

Amenazas conocidas en la web

Antes de sumergirse en las cabeceras de seguridad, obtén información sobre las amenazas conocidas en la web y por qué te gustaría utilizar estas cabeceras de seguridad.

{% endDetailsSummary %}

Antes de sumergirse en las cabeceras de seguridad, obtén información sobre las amenazas conocidas en la web y por qué te gustaría utilizar estas cabeceras de seguridad.

### Proteje tu sitio de vulnerabilidades de inyección

Las vulnerabilidades de inyección surgen cuando los datos que no son de confianza procesados por tu aplicación pueden afectar su comportamiento y, comúnmente, llevar a la ejecución de scripts controlados por atacantes. La vulnerabilidad más común causada por errores de inyección es la [secuencia de comandos entre sitios](https://portswigger.net/web-security/cross-site-scripting) (XSS) en sus diversas formas, incluido [reflected XSS (XSS reflejado)](https://portswigger.net/web-security/cross-site-scripting/reflected), [stored XSS (XSS almacenado)](https://portswigger.net/web-security/cross-site-scripting/stored), [DOM-based XSS (XSS basado en DOM)](https://portswigger.net/web-security/cross-site-scripting/dom-based) y otras variantes.

Una vulnerabilidad XSS normalmente puede dar a un atacante acceso completo a los datos del usuario procesados por la aplicación y cualquier otra información alojada en el mismo [origen web](/same-site-same-origin/#origin).

Las defensas tradicionales contra las inyecciones incluyen el uso constante de sistemas de plantilla HTML con escape automático, evitar el uso de las [API de JavaScript peligrosas](https://domgo.at/cxss/sinks) y procesar correctamente los datos del usuario alojando las cargas de archivos en un dominio separado y desinfectando el HTML controlado por el usuario.

- Utiliza la [Política de seguridad de contenido (CSP)](#csp) para controlar qué scripts se pueden ejecutar en tu aplicación para mitigar el riesgo de inyecciones.
- Utiliza los [Trusted Types](#tt) para aplicar la desinfección de los datos que se pasan a las API peligrosas de JavaScript.
- Utiliza [X-Content-Type-Options](#xcto) para evitar que el navegador malinterprete los tipos MIME de los recursos de tu sitio web, lo que puede llevar a la ejecución de un script.

### Aísla tu sitio de otros sitios web

La apertura de la web permite que los sitios web interactúen entre sí de formas que pueden violar las expectativas de seguridad de una aplicación. Esto incluye realizar solicitudes autenticadas inesperadamente o incrustar datos de otra aplicación en el documento del atacante, lo que permite al atacante modificar o leer datos de la aplicación.

Las vulnerabilidades comunes que quiebran el aislamiento web incluyen el [clickjacking (secuestro de clics)](https://portswigger.net/web-security/clickjacking), la [falsificación de solicitudes entre sitios](https://portswigger.net/web-security/csrf) (CSRF), la [inclusión de scripts entre sitios](https://www.scip.ch/en/?labs.20160414) (XSSI) y varias [cross-site leaks (fugas entre sitios)](https://xsleaks.dev).

- Utiliza [X-Frame-Options](#xfo) para evitar que tus documentos sean incrustados por un sitio web malicioso.
- Utiliza la [Política de recursos de origen cruzado (CORP)](#corp) para evitar que los recursos de tu sitio web se incluyan en un sitio web de origen cruzado.
- Utiliza la [Política de apertura de origen cruzado (COOP)](#coop) para proteger las ventanas de tu sitio web de las interacciones de sitios web maliciosos.
- Utiliza el uso [compartido de recursos de origen cruzado (CORS)](#cors) para controlar el acceso a los recursos de tu sitio web desde documentos de origen cruzado.

El [Post-Spectre Web Development (desarrollo web de Post-Spectre)](https://www.w3.org/TR/post-spectre-webdev/) es una excelente lectura si estás interesado en estas cabeceras.

### Crea un sitio web potente de forma segura

[Spectre](https://ieeexplore.ieee.org/document/8835233) coloca todos los datos cargados en el mismo [grupo de contexto de navegación](/why-coop-coep/) los cuales son potencialmente legibles a pesar [de la política del mismo origen](/same-origin-policy/). Los navegadores restringen las funciones que posiblemente puedan aprovechar la vulnerabilidad <br>mediante un entorno especial llamado "[aislamiento de origen cruzado](/coop-coep/)". Con el aislamiento de origen cruzado, puedes utilizar funciones potentes como `SharedArrayBuffer`.

- Utiliza la [Política de incrustación de origen cruzado (COEP)](#coep) junto con [COOP](#coop) para habilitar el aislamiento de origen cruzado.

### Cifra el tráfico a tu sitio

Los problemas de cifrado aparecen cuando una aplicación no cifra completamente los datos en tránsito, lo que permite a los atacantes que "escuchan" a escondidas conocer las interacciones del usuario con la aplicación.

Puede surgir un cifrado insuficiente en los siguientes casos: no usar HTTPS, [contenido mixto](/what-is-mixed-content/), configurar cookies sin el [atributo de `Secure`](https://developer.mozilla.org/docs/Web/HTTP/Cookies#restrict_access_to_cookies) (o con el [prefijo `__Secure`](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Cookie_prefixes)) o la [lax CORS validation logic (lógica de validación CORS laxa)](https://blog.detectify.com/2018/04/26/cors-misconfigurations-explained/).

- Utiliza [HTTP Strict Transport Security (HSTS)](#hsts) para ofrecer tus contenidos de manera coherente a través de HTTPS.

{% endDetails %}

## Política de seguridad de contenido (CSP) {: #csp }

[Cross-Site Scripting (XSS)](https://www.google.com/about/appsecurity/learning/xss/) es un ataque en el que una vulnerabilidad en un sitio web permite que se inyecte y ejecute un script malicioso.

`Content-Security-Policy` proporciona una capa adicional para mitigar los ataques XSS al restringir qué scripts pueden ser ejecutados por la página.

Se recomienda que habilites el CSP estricto mediante uno de los siguientes enfoques:

- Si procesas tus páginas HTML en el servidor, utiliza **un CSP estricto basado en nonce**.
- Si tu HTML tiene que ser servido de manera estática o en caché, por ejemplo, si es una aplicación de una sola página, usa **un CSP estricto basado en hash**.

{% Label %} Ejemplo de uso: un CSP basado en nonce {% endLabel%}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Details %} {% DetailsSummary %}

Cómo usar CSP

{% endDetailsSummary %}

### Usos recomendados

{% Aside %}

Un CSP puede ser una *protección adicional* contra ataques XSS; aún debes de asegurarte de escapar (y desinfectar) la entrada del usuario.

{% endAside %}

#### 1. Utiliza un CSP estricto basado en nonce {: #nonce-based-csp }

Si procesas tus páginas HTML en el servidor, utiliza **un CSP estricto basado en nonce**.

{% Aside 'caution' %}

Un nonce es un número aleatorio que se usa solo una vez. Un CSP basado en nonce solo es seguro si puede generar un nonce diferente para cada respuesta. Si no puedes hacer esto, usa [un CSP basado en hash](#hash-based-csp) en su lugar.

{% endAside %}

Genera un nuevo valor nonce mediante scripts para cada consulta en el lado del servidor y establece la siguiente cabecera:

{% Label %} archivo de configuración del servidor {% endLabel %}

```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

En HTML, para cargar los scripts, establece el atributo de `nonce` de todas las etiquetas de `<script>` a la misma cadena de `<RANDOM>`.

{% Label %} index.html {% endLabel %}

```html
<script nonce="<RANDOM>" src="https://example.com/script1.js"></script>
<script nonce="<RANDOM>">
  // Scripts en linea pueden ser usados con el atributo de nonce.
</script>
```

[Google Photos](https://photos.google.com/) es un buen ejemplo de CSP estricto basado en nonce. Usa DevTools para ver cómo se usa.

#### 2. Utiliza un CSP estricto basado en hash {: #hash-based-csp }

Si tu HTML debe entregarse de forma estática o en caché, por ejemplo, si estás creando una aplicación de una sola página (SPA), usa **un CSP estricto basado en hash**.

{% Label %} archivo de configuración del servidor {% endLabel %}

```http
Content-Security-Policy:
  script-src 'sha256-{HASH1}' 'sha256-{HASH2}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

En HTML, necesitarás insertar tus scripts para aplicar una política basada en hash, porque la [mayoría de los navegadores no admiten el hash de scripts externos](https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned).

{% Label %} index.html {% endLabel %}

```html
<script>
...// tu script 1, en linea
</script>
<script>
...// tu script 2, en linea
</script>
```

Para cargar scripts externos, lee "Cargar scripts desde su origen dinámicamente" en la sección de [Opción B: Cabecera de respuesta de CSP basado en hash](/strict-csp/#hash-based-csp).

[CSP Evaluator](https://csp-evaluator.withgoogle.com/) es una buena herramienta para evaluar tu CSP, pero al mismo tiempo es un buen ejemplo de CSP estricto basado en nonce. Usa DevTools para ver cómo se usa.

### Navegadores compatibles

Chrome, Firefox, Edge, Safari

{% Aside 'gotchas' %}

- `https:` Es un respaldo para Safari y `unsafe-inline` es un respaldo para versiones de navegador muy antiguas. `https:` y `unsafe-inline` no hacen que tu política sea menos segura porque serán ignorados por los navegadores que admiten `strict-dynamic`. Obtén más información en [Agregar alternativas para admitir Safari y navegadores más antiguos](/strict-csp/#step-4:-add-fallbacks-to-support-safari-and-older-browsers).
- Safari aún *no* admite `strict-dynamic`. Pero un CSP estricto como en los ejemplos anteriores es más seguro que un CSP de lista de permitidos (y mucho más seguro que no usar ningún CSP) para todos sus usuarios. Incluso en Safari, un CSP estricto protege tu sitio de algunos tipos de ataques XSS, porque la presencia del CSP no permite ciertos patrones inseguros.

{% endAside %}

Ver [más compatibilidades](https://developer.mozilla.org/docs/Web/HTTP/CSP#browser_compatibility).

### Otras cosas a tener en cuenta sobre el CSP

- La directiva de [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) protege a tu sitio contra el clickjacking, un riesgo que surge si permites que los sitios que no son de confianza se incrusten al tuyo. Si prefieres una solución más simple, puedes usar [`X-Frame-Options`](#xfo) para bloquear la carga, pero `frame-ancestors` te brinda una configuración avanzada para permitir solo orígenes específicos como incrustadores.
- Es posible que hayas utilizado [un CSP para asegurarte de que todos los recursos de su sitio se carguen a través de HTTPS](/fixing-mixed-content/#content-security-policy). Esto se ha vuelto menos relevante: hoy en día, la mayoría de los navegadores bloquean el [contenido mixto](/what-is-mixed-content/).
- También puedes configurar un CSP en [report-only-mode (modo de solo informe)](/strict-csp/#step-2:-set-a-strict-csp-and-prepare-your-scripts).
- Si no puedes configurar un CSP como cabecera del lado del servidor, también puedes configurarlo como una metaetiqueta. Ten en cuenta que no puedes usar el **report-only mode** para las metaetiquetas (aunque [esto puede cambiar](https://github.com/w3c/webappsec-csp/issues/277)).

### Aprende más

- [Mitigar XSS con una estricta política de seguridad de contenido (CSP)](/strict-csp)
- [Hoja de referencia de la política de seguridad de contenido](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

{% endDetails %}

## Trusted Types {: #tt}

El [DOM-based XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based) es un ataque en el que se pasan datos maliciosos a un receptor que admite la ejecución de código dinámico como `eval()` o `.innerHTML`.

Los Trusted Types proporcionan las herramientas para escribir, revisar la seguridad y mantener aplicaciones libres de DOM XSS. Se pueden habilitar a través de [CSP](#csp) y hace que el código JavaScript sea seguro de forma predeterminada al limitar las API web peligrosas para que solo acepten un objeto especial: un Trusted Type.

Para crear estos objetos, puedes definir políticas de seguridad en las que puedas asegurarte de que las reglas de seguridad (como el escape o la desinfección) se apliquen de forma coherente antes de que los datos se escriban en el DOM. Estas políticas son los únicos lugares en el código que potencialmente podrían introducir DOM XSS.

{% Label %} Ejemplos de usos {% endLabel %}

```http
Content-Security-Policy: require-trusted-types-for 'script'
```

```javascript
// Detección de función
if (window.trustedTypes && trustedTypes.createPolicy) {
  // Nombra y crea una política
  const policy = trustedTypes.createPolicy('escapePolicy', {
    createHTML: str => {
      return str.replace(/\</g, '<').replace(/>/g, '>');
    }
  });
}
```

```javascript
// Asignación de cadenas crudas se bloquean por Trusted Types.
el.innerHTML = 'some string'; // Esto arroja una excepción.

// La asignación de Trusted Types se aceptó de manera segura.
const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Details %} {% DetailsSummary %}

Cómo utilizar Trusted Types

{% endDetailsSummary %}

### Usos recomendados

1. Aplicar Trusted Types para receptores DOM peligrosos {% Label %} Cabecera de CSP y Trusted Types: {% endLabel %}

    ```http
    Content-Security-Policy: require-trusted-types-for 'script'
    ```

    Actualmente, `'script'` es el único valor aceptable para la directiva de `require-trusted-types-for`.

    Por supuesto, puedes combinar Trusted Types con otras directivas de CSP:

    {% Label %} Combinando un CSP basado en los nonce anteriores con Trusted Types: {% endLabel %}

    ```http
    Content-Security-Policy:
      script-src 'nonce-{RANDOM1}' 'strict-dynamic' https: 'unsafe-inline';
      object-src 'none';
      base-uri 'none';
      require-trusted-types-for 'script';
    ```

    {% Aside %}

    Puedes limitar los nombres de políticas de Trusted Types permitidos estableciendo una directiva de `trusted-types` adicional (por ejemplo, `trusted-types myPolicy`). Sin embargo, esto no es un requisito.

    {% endAside %}

2. Definir una política

    {% Label %} Política: {% endLabel %}

    ```javascript
    // Detección de función
    if (window.trustedTypes && trustedTypes.createPolicy) {
      // Nombra y crea una política
      const policy = trustedTypes.createPolicy('escapePolicy', {
        createHTML: str => {
          return str.replace(/\</g, '&lt;').replace(/>/g, '&gt;');
        }
      });
    }
    ```

    {% Aside %}

    Puedes definir políticas con nombres arbitrarios a menos que limites los nombres de las políticas de Trusted Types permitidos estableciendo la directiva de `trusted-types`.

    {% endAside %}

3. Aplicar la política

    {% Label %} Utiliza la política al escribir datos en el DOM: {% endLabel %}

    ```javascript
    // Asignación de cadenas crudas se bloquean por Trusted Types.
    el.innerHTML = 'some string'; // Esto arroja una excepción.

    // La asignación de Trusted Types se aceptó de manera segura.
    const escaped = policy.createHTML('<img src=x onerror=alert(1)>');
    el.innerHTML = escaped;  // '&lt;img src=x onerror=alert(1)&gt;'
    ```

    Con `require-trusted-types-for 'script'`, el uso de un Trusted Type es un requisito. El uso de cualquier API de DOM peligrosa con una cadena dará como resultado un error.

### Navegadores compatibles

Chrome, Edge.

Ver [más compatibilidades](https://caniuse.com/?search=trusted%20types).

### Aprende más

- [Evita las vulnerabilidades de secuencias de comandos en sitios cruzados basadas en DOM con Trusted Types](/trusted-types/)
- [CSP: require-trusted-types-for - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
- [CSP: trusted-types - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
- [Demostración de Trusted Types:](https://www.compass-demo.com/trusted-types/) Abre DevTools Inspector y observa lo que está sucediendo

{% endDetails %}

## X-Content-Type-Options {: #xcto}

Cuando se entrega un documento HTML malicioso desde tu dominio (por ejemplo, si una imagen cargada en un servicio de fotografías contiene un marcado HTML válido), algunos navegadores lo tratarán como un documento activo y le permitirán ejecutar scripts en el contexto de la aplicación, dando lugar a un [cross-site scripting bug (error de secuencia de comandos entre sitios)](https://www.google.com/about/appsecurity/learning/xss/).

`X-Content-Type-Options: nosniff` previene indicando al navegador que el [tipo MIME](https://mimesniff.spec.whatwg.org/#introduction) establecido en el `Content-Type` para una respuesta dada es correcto. Se recomienda esta cabecera para **todos tus recursos**.

{% Label %} Ejemplo de uso {% endLabel%}

```http
X-Content-Type-Options: nosniff
```

{% Details %} {% DetailsSummary %}

Cómo utilizar X-Content-Type-Options

{% endDetailsSummary %}

### Usos recomendados

`X-Content-Type-Options: nosniff` se recomienda para todos los recursos servidos desde tu servidor junto con la cabecera de `Content-Type`.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/IWqRWe9R1mOJImmMbLoM.png", alt="X-Content-Type-Options: nosniff", width="800", height="237" %}

{% Label %} Ejemplos de cabeceras enviadas con un documento HTML {% endLabel %}

```http
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
```

### Navegadores compatibles

Chrome, Firefox, Safari, Edge

Ver [más compatibilidades](https://caniuse.com/mdn-http_headers_x-content-type-options).

### Aprende más

- a0}X-Content-Type-Options - HTTP MDN

{% endDetails %}

## X-Frame-Options {: #xfo}

Si un sitio web malicioso puede incrustar tu sitio como un iframe, esto puede permitir a los atacantes invocar acciones no deseadas por parte del usuario mediante [clickjacking](https://portswigger.net/web-security/clickjacking). Además, en algunos casos, [los ataques de tipo Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) brindan a los sitios web maliciosos la oportunidad de conocer el contenido de un documento incrustado.

`X-Frame-Options` indica si un navegador debe poder representar una página en un `<frame>` , `<iframe>` , `<embed>` u `<object>`. **Se recomienda que todos los documentos** envíen esta cabecera para indicar si permiten ser incrustados por otros documentos.

{% Aside %}

Si necesitas un control más granular, como permitir que solo un origen específico incruste el documento, usa la directiva [`frame-ancestors`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) de [CSP](#csp).

{% endAside %}

{% Label %} Ejemplo de uso {% endLabel%}

```http
X-Frame-Options: DENY
```

{% Details %} {% DetailsSummary %}

Cómo utilizar X-Frame-Options

{% endDetailsSummary %}

### Usos recomendados

Todos los documentos que no están diseñados para ser incrustados deben usar la cabecera de `X-Frame-Options`.

Puedes probar cómo las siguientes configuraciones afectan la carga de un iframe en [esta demostración](https://cross-origin-isolation.glitch.me/). Cambia el `X-Frame-Options` y haz clic en el botón de **Reload the iframe (Recargar el iframe)**.

#### Protege tu sitio web de ser incrustado por otros sitios web

Niega ser incrustado por cualquier otro documento.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2ZM5obgGK38CMcZ75PkH.png", alt="X-Frame-Options: DENY", width="800", height="237" %}

```http
X-Frame-Options: DENY
```

#### Protege tu sitio web de ser incrustado por sitios web de origen cruzado

Permitir ser incrustado solo por documentos del mismo origen.

```http
X-Frame-Options: SAMEORIGIN
```

{% Aside 'gotchas' %}

Los documentos que se pueden incrustar de forma predeterminada significa que los desarrolladores web deben enviar explícitamente `DENY` o `SAMEORIGIN` para dejar de estar incrustados y protegerse de los ataques de canal lateral. El equipo de Chrome está considerando cambiar a bloquear incrustaciones de documentos de forma predeterminada para que los sitios web sean seguros incluso si no establecen explícitamente la cabecera. En ese nuevo mundo, los documentos tendrían que optar explícitamente para ser incrustados.

{% endAside %}

### Navegadores compatibles

Chrome, Firefox, Safari, Edge

Ver [más compatibilidades](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options#browser_compatibility).

### Aprende más

- a0}X-Frame-Options - HTTP

{% endDetails %}

## Política de recursos de origen cruzado (CORP) {: #corp}

Un atacante puede incrustar recursos de otro origen, por ejemplo, de tu sitio, para obtener información sobre ellos explotando las [cross-site leaks](https://xsleaks.dev/).

`Cross-Origin-Resource-Policy` mitiga este riesgo al indicar el conjunto de sitios web en los que se puede cargar. La cabecera toma uno de tres valores: `same-origin`, `same-site` y `cross-origin`. **Se recomienda que todos los recursos** envíen esta cabecera para indicar si permiten que otros sitios web los carguen.

{% Label %} Ejemplo de uso {% endLabel%}

```http
Cross-Origin-Resource-Policy: same-origin
```

{% Details %} {% DetailsSummary %}

Cómo usar CORP

{% endDetailsSummary %}

### Usos recomendados

Se recomienda que **todos** los recursos se sirvan con una de las siguientes tres cabeceras.

Puedes probar cómo las siguientes configuraciones afectan la carga de recursos bajo un [`Cross-Origin-Embedder-Policy: require-corp`](#coep) en [esta demostración](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Cambia el menú desplegable de **Cross-Origin-Resource-Policy** y haz clic en el botón **Reload the iframe (Recargar el iframe)** o **Reload the image (Recargar la imagen)** para ver el efecto.

#### Permitir que los recursos se carguen `cross-origin`

Se recomienda que los servicios similares a CDN apliquen `cross-origin` a los recursos (ya que generalmente se cargan mediante páginas de origen cruzado), a menos que ya se hayan servido a través de [CORS,](#cors) que tiene un efecto similar.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/qP2mspVMC6RazxDjWUrL.png", alt="Cross-Origin-Resource-Policy: cross-origin", width="800", height="234" %}

```http
Cross-Origin-Resource-Policy: cross-origin
```

#### Limitar los recursos que se cargarán desde el `same-origin`

`same-origin` debe aplicarse a los recursos que están destinados a ser cargados solo por páginas del mismo origen. Debes de aplicar esto a los recursos que incluyen información confidencial sobre el usuario o respuestas de una API que está destinada a ser llamada solo desde el mismo origen.

Ten en cuenta que los recursos con esta cabecera aún se pueden cargar directamente, por ejemplo, navegando a la URL en una nueva ventana del navegador. La política de recursos de origen cruzado (CORP) solo protege el recurso para que no se incruste en otros sitios web.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/7UzYMWsbKkh89m5ZImvj.png", alt="Cross-Origin-Resource-Policy: same-origin", width="800", height="238" %}

```http
Cross-Origin-Resource-Policy: same-origin
```

#### Limita los recursos que se cargarán desde el `same-site`

`same-site` es recomendado que se aplique a los recursos que son similares a los anteriores pero que están destinados a ser cargados por otros subdominios de tu sitio.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/R9yNRGSJ4xABc560WRJI.png", alt="Cross-Origin-Resource-Policy: same-site", width="800", height="233" %}

```http
Cross-Origin-Resource-Policy: same-site
```

{% Aside %}

Para obtener más información sobre la diferencia entre el same-origin (mismo origen) y el same-site (mismo sitio), consulta [Comprendiendo "same-site" y "same-origin"](/same-site-same-origin/).

{% endAside %}

### Navegadores compatibles

Chrome, Firefox, Safari, Edge

Ver [más compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-resource-policy).

### Aprende más

- [Considera implementar una política de recursos de origen cruzado](https://resourcepolicy.fyi/)
- [Hacer que tu sitio web sea "aislado de origen cruzado" utilizando COOP y COEP](/coop-coep/)
- [Por qué necesitas un "cross-origin-isolated" para funciones potentes](/why-coop-coep/)

{% endDetails %}

## Política de apertura de origen cruzado (COOP) {: #coop}

El sitio web de un atacante puede abrir otro sitio en una ventana emergente para obtener información al respecto aprovechando las [cross-site leaks](https://xsleaks.dev/). En algunos casos, esto también puede permitir la explotación de ataques de canal lateral basados en [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)).

La cabecera de `Cross-Origin-Opener-Policy` proporciona una forma para que un documento se aísle de las ventanas de origen cruzado abiertas a través de `window.open()` o un enlace con `target="_blank"` sin `rel="noopener"`. Como resultado, cualquier abridor de origen cruzado del documento no tendrá ninguna referencia a él y no podrá interactuar con él.

{% Label %} Ejemplo de uso {% endLabel%}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

{% Details %} {% DetailsSummary %}

Cómo usar COOP

{% endDetailsSummary %}

### Usos recomendados

Puedes probar cómo las siguientes configuraciones afectan la comunicación con una ventana emergente de origen cruzado en [esta demostración](https://cross-origin-isolation.glitch.me/). Cambia el menú desplegable de **Cross-Origin-Opener-Policy** tanto para el documento como para la ventana emergente, haz clic en el botón **Open a popup (Abrir una ventana emergente)** y luego haz clic en **Send a postMessage (Enviar un postMessage)** para ver si el mensaje realmente se envió.

#### Aislar un documento de las ventanas de origen cruzado

Al establecer el `same-origin` el documento se aislará de las ventanas de documentos de origen cruzado.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/mSDG9auD7r5asxGJvJjg.png", alt="Cross-Origin-Opener-Policy: same-origin", width="800", height="235" %}

```http
Cross-Origin-Opener-Policy: same-origin
```

#### Aislar un documento de las ventanas de origen cruzado pero permitir ventanas emergentes

La configuración de `same-origin-allow-popups` permite que un documento retenga una referencia a tus ventanas emergentes a menos que establezcan COOP con ventanas emergentes del `same-origin` o del `same-origin-allow-popups`. Esto significa que `same-origin-allow-popups` puede proteger el documento para que no se haga referencia cuando se abre como una ventana emergente, pero permiten que se comunique con sus propias ventanas emergentes.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/2uJZ0s2VnjxJUcBI2Ol9.png", alt="Cross-Origin-Opener-Policy: same-origin-allow-popups", width="800", height="233" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

#### Permitir que un documento sea referenciado por ventanas de origen cruzado

`unsafe-none` es el valor predeterminado, pero puede indicar explícitamente que este documento se puede abrir mediante una ventana de origen cruzado y conservar el acceso mutuo.

{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/oSco89ZT3RP7gZzNKDjY.png", alt="Cross-Origin-Opener-Policy: unsafe-none", width="800", height="233" %}

{% Aside 'gotchas' %}

Dado que `unsafe-none` es el valor predeterminado significa que los desarrolladores web deben enviar `same-origin-allow-popups` o `same-origin`  explícitamente para proteger tu sitio web de los ataques de canal lateral.

{% endAside %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

{% Aside %}

Las funciones como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` o [JS Self Profiling API](https://wicg.github.io/js-self-profiling/) están deshabilitadas de forma predeterminada. Algunos navegadores te permiten usarlos en contextos "aislados de origen cruzado", que requieren que configures las cabeceras de [COOP](#coop) y [COEP](#coep).

Para obtener más información, lee [Hacer que tu sitio web sea "cross-origin-isolated" utilizando COOP y COEP](/coop-coep/).

{% endAside %}

#### Informar patrones incompatibles con COOP

Puedes recibir informes cuando COOP evita interacciones entre ventanas con la API de Reporting.

```http
Cross-Origin-Opener-Policy: same-origin; report-to="coop"
```

COOP también admite un modo de solo informe para que puedas recibir informes sin bloquear realmente la comunicación entre documentos de origen cruzado.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop"
```

### Navegadores compatibles

Chrome, Firefox, Edge

Ver [más compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-opener-policy).

### Aprende más

- [Por qué necesitas un "cross-origin-isolated" para funciones potentes](/why-coop-coep/)

{% endDetails %}

## Uso compartido de recursos de origen cruzado (CORS) {: #cors}

A diferencia de otros elementos de este artículo, el intercambio de recursos de origen cruzado (CORS) no es una cabecera, sino un mecanismo del navegador que solicita y permite el acceso a recursos de origen cruzado.

De forma predeterminada, los navegadores imponen [same-origin policy (política del mismo origen)](/same-origin-policy/) para evitar que una página web acceda a recursos de origen cruzado. Por ejemplo, cuando se carga una imagen de origen cruzado, aunque se muestra visualmente en la página web, el JavaScript de la página no tiene acceso a los datos de la imagen. El proveedor de recursos puede relajar las restricciones y permitir que otros sitios web lean el recurso al optar por participar con CORS.

{% Label %} Ejemplo de uso {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

{% Details %} {% DetailsSummary %}

Cómo usar CORS

{% endDetailsSummary %}

Antes de investigar cómo configurar el CORS, es útil comprender la distinción entre tipos de petición. Dependiendo de los detalles de la petición, una petición se clasificará como una **petición simple** o una **petición preflighted**.

Criterios para una petición simple:

- El método es `GET` , `HEAD` o `POST` .
- Las cabeceras personalizadas solo incluyen `Accept`, `Accept-Language`, `Content-Language` y `Content-Type`.
- El `Content-Type` es `application/x-www-form-urlencoded`, `multipart/form-data` o `text/plain`.

Todo lo demás se clasifica como una petición preflighted. Para obtener más detalles, consulta [Cross-Origin Resource Sharing (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS#simple_requests).

### Usos recomendados

#### Petición simple

Cuando una petición cumple con los criterios de petición simple, el navegador envía una petición de origen cruzado con un `Origin` que indica el origen de la petición.

{% Label %} Ejemplo de la cabecera de consulta {% endLabel %}

```http
Get / HTTP/1.1
Origin: https://example.com
```

{% Label %} Ejemplo de la cabecera de respuesta {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

- `Access-Control-Allow-Origin: https://example.com` indica que `https://example.com` puede acceder al contenido de la respuesta. Los recursos destinados a ser legibles por cualquier sitio pueden establecer esta cabecera en `*`, en tal caso el navegador solo requerirá que la petición se realice [sin credenciales](https://developer.mozilla.org/docs/Web/API/Request/credentials#value).
- `Access-Control-Allow-Credentials: true` indica que las solicitudes que llevan credenciales (cookies) pueden cargar el recurso. De lo contrario, las solicitudes autenticadas se rechazarán incluso si el origen solicitante está presente en la cabecera de `Access-Control-Allow-Origin`.

Puedes probar cómo la petición simple afecta la carga de recursos en un [`Cross-Origin-Embedder-Policy: require-corp`](#coep) en [esta demostración](https://cross-origin-isolation.glitch.me/?coep=require-corp&). Haz clic en la casilla de verificación **Cross-Origin Resource Sharing (Intercambio de recursos de origen cruzado)** y haz clic en el botón de **Reload the image (Volver a cargar la imagen)** para ver el efecto.

#### Petición preflighted

Una petición preflighted está precedida por una consulta de `OPTIONS` para verificar si se permite el envío de la consulta posterior.

{% Label %} Ejemplo de la cabecera de consulta {% endLabel %}

```http
OPTIONS / HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

- `Access-Control-Request-Method: POST` permite realizar la siguiente consulta con el método `POST`.
- `Access-Control-Request-Headers: X-PINGOTHER, Content-Type` permite al solicitante establecer los `X-PINGOTHER` y las cabeceras HTTP de `Content-Type` en la petición posterior.

{% Label %} Ejemplos de la cabecera de respuesta {% endLabel %}

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

- `Access-Control-Allow-Methods: POST, GET, OPTIONS` indica que las peticiones posteriores se pueden realizar con los métodos `POST`, `GET` y `OPTIONS`.
- `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` indica que las peticiones posteriores pueden incluir las cabeceras `X-PINGOTHER` y `Content-Type`.
- `Access-Control-Max-Age: 86400` indica que el resultado de la petición preflighted se puede almacenar en caché durante 86400 segundos.

### Navegadores compatibles

Chrome, Firefox, Safari, Edge

Ver [más compatibilidades](https://caniuse.com/mdn-http_headers_content-length_cors_response_safelist).

### Aprende más

- [Intercambio de recursos de origen cruzado (CORS)](/cross-origin-resource-sharing/)
- [Cross-Origin Resource Sharing (CORS) - HTTP | MDN](https://developer.mozilla.org/docs/Web/HTTP/CORS)

{% endDetails %}

## Política de incrustación de origen cruzado (COEP) {: #coep}

Para reducir la habilidad de [los ataques basados en Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) para robar recursos de origen cruzado, funciones como `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` o [JS Self Profiling API](https://wicg.github.io/js-self-profiling/) están deshabilitadas de forma predeterminada.

`Cross-Origin-Embedder-Policy: require-corp` evita que los documentos y los workers carguen recursos de origen cruzado como imágenes, scripts, hojas de estilo, iframes y otros, a menos que estos recursos opten explícitamente por cargarse a través de cabeceras [CORS](#cors) o [CORP.](#corp) COEP se puede combinar con la `Cross-Origin-Opener-Policy` para optar por un documento en el [aislamiento de origen cruzado](/cross-origin-isolation-guide/).

Utiliza `Cross-Origin-Embedder-Policy: require-corp` cuando desees habilitar el [aislamiento de origen cruzado](/coop-coep/) para tu documento.

{% Label %} Ejemplo de uso {% endLabel %}

```http
Cross-Origin-Embedder-Policy: require-corp
```

{% Details %} {% DetailsSummary %}

Cómo usar COEP

{% endDetailsSummary %}

### Usos de ejemplo

COEP toma un valor único de `require-corp`. Al enviar esta cabecera, puedes indicarle al navegador que bloquee la carga de recursos que no se inscriben a través de [CORS](#cors) o [CORP](#corp).

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="Cómo funciona COEP", width="800", height="410" %}

Puedes probar cómo las siguientes configuraciones afectan la carga de recursos en [esta demostración](https://cross-origin-isolation.glitch.me/). Cambia el menú desplegable de **Cross-Origin-Embedder-Policy**, el menú desplegable de **Cross-Origin-Resource-Policy**, la casilla de verificación **Report Only** etc, para ver cómo afectan la carga de recursos. Además, abre [the reporting endpoint demo (la demostración del punto final de informes)](https://reporting-endpoint.glitch.me/) para ver si se informan los recursos bloqueados.

#### Habilitar el aislamiento de origen cruzado

Habilita el [aislamiento entre orígenes](/coop-coep) enviando `Cross-Origin-Embedder-Policy: require-corp` junto con `Cross-Origin-Opener-Policy: same-origin`.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

#### Informe de recursos incompatibles con COEP

Puedes recibir informes de recursos bloqueados causados por COEP con la API de Reporting.

```http
Cross-Origin-Embedder-Policy: require-corp; report-to="coep"
```

COEP también admite el modo de solo informe para que puedas recibir informes sin bloquear realmente la carga de recursos.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep"
```

### Navegadores compatibles

Chrome, Firefox, Edge

Ver [más compatibilidades](https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Aprende más

- [Cómo hacer que su sitio web sea "aislado y de origen cruzado" utilizando COOP y COEP](/coop-coep/)
- [Por qué necesitas un "cross-origin-isolated" para funciones potentes](/why-coop-coep/)
- [Una guía para habilitar el aislamiento de origen cruzado](/cross-origin-isolation-guide/)

{% endDetails %}

## HTTP Strict Transport Security (HSTS) {: #hsts}

La comunicación a través de una conexión HTTP plain no está encriptada, lo que hace que los datos transferidos sean accesibles para los espías a nivel de red.

`Strict-Transport-Security` informa al navegador que nunca debe cargar el sitio usando HTTP y usar HTTPS en su lugar. Una vez configurado, el navegador utilizará HTTPS en lugar de HTTP para acceder al dominio sin una redirección durante el tiempo definido en la cabecera.

{% Label %} Ejemplo de uso {% endLabel%}

```http
Strict-Transport-Security: max-age=31536000
```

{% Details %} {% DetailsSummary %}

Cómo utilizar HSTS

{% endDetailsSummary %}

### Usos recomendados

Todos los sitios web que realizan la transición de HTTP a HTTPS deben responder con un `Strict-Transport-Security` cuando se recibe una consulta con HTTP.

```http
Strict-Transport-Security: max-age=31536000
```

### Navegadores compatibles

Chrome, Firefox, Safari, Edge

Ver [más compatibilidades](https://caniuse.com/stricttransportsecurity).

### Aprende más

- [Strict-Transport-Security - HTTP](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)

{% endDetails %}

## Lecturas complementarias

- [Post-Spectre Web Development (Desarrollo web Post-Spectre)](https://www.w3.org/TR/post-spectre-webdev/)
